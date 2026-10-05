"use strict";

/*
 * Provider Productivity reports - Daily / Weekly / Monthly / Scoreboard.
 *
 * Built on the newer reports stack (AG Charts + ag-grid + KPI tiles), matching
 * USOperationalReportsCtrl rather than the older FusionCharts dashboard code.
 *
 * Points come from the Visit Reason Group weights configured under
 * Settings > Visit Reason Groups, applied to completed encounters server-side.
 */
eHnoteWebApp.controller("USProviderProductivityCtrl", ["$scope", "$filter", "$timeout", "alertify", "$uibModal",
    "eHnoteMasterDataService", "eHnoteMainDashboardDataServices", "eHnoteMainAppointmentService", "eHnoteLoginStatusService", "eHnoteUserDataService",
    function ($scope, $filter, $timeout, alertify, $uibModal, eHnoteMasterDataService, eHnoteMainDashboardDataServices, eHnoteMainAppointmentService, eHnoteLoginStatusService, eHnoteUserDataService) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        var hospitalInfo = (doctorinfo && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo) || {};
        var PPHospitalId = hospitalInfo.HospitalID || 0;
        var PPParentHospitalId = hospitalInfo.ParentHospitalID || 0;

        /* ---------------- state ---------------- */

        $scope.PPTab = 'daily';
        $scope.PPScoreboardCadence = 'week';
        $scope.PPShowProspective = (new Date()).getDay() === 5;   // default on for Friday
        $scope.PPSampleMode = false;
        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.RoleId = userLoginDetails.RoleID;

        $scope.PPProviderTypeList = [
            { "Id": 1, "Name": "OD" },
            { "Id": 2, "Name": "MD" },
            { "Id": 3, "Name": "Technician" }
        ];

        $scope.PPDoctorChecklist = [];
        $scope.PPLocationChecklist = [];
        $scope.PPSearchDoctor = "";
        $scope.PPSearchLocation = "";
        $scope.PPAllDoctorsCheck = true;
        $scope.PPAllLocationsCheck = true;
        $scope.selectedPPDoctorText = 'All Providers';
        $scope.selectedPPLocationText = 'All Locations';

        $scope.PPDailyData = [];
        $scope.PPWeeklyData = [];
        $scope.PPWeeklyProspectiveData = [];
        $scope.PPMonthlyData = [];
        $scope.PPScoreboardRows = [];
        $scope.PPKpis = [];

        function getPPFilterObj() {
            var today = $filter('date')(new Date(), "MM-dd-yyyy");
            return {
                "FromDate": today,
                "ToDate": today,
                "ProviderTypeId": "",     // single select - "" means all types
                "ProviderIds": [],
                "LocationIds": []
            };
        }
        $scope.PPFilterObj = getPPFilterObj();
        if ($scope.RoleId == 10) {
            $scope.PPFilterObj.ProviderTypeId = 3;
        } else if ($scope.RoleId == 1) {
            $scope.PPFilterObj.ProviderTypeId = 1;
        } else if ($scope.RoleId == 43) {
            $scope.PPFilterObj.ProviderTypeId = 2;
        }
        /* ---------------- filters ---------------- */

        // Role -> provider type. RoleId 1/43 are doctors, split into OD vs MD by SuffixName;
        // RoleId 10 is a technician. NOTE: every other list in the app filters to RoleId 1||43,
        // which drops technicians entirely - this report needs all three, so it loads its own list.
        var PP_ROLE_DOCTORS = [1, 43];
        var PP_ROLE_TECHNICIAN = 10;

        function providerTypeFor(user) {
            if (user.RoleId === PP_ROLE_TECHNICIAN) { return { Id: 3, Name: 'Technician' }; }
            var suffix = (user.SuffixName || '').trim().toUpperCase();
            if (suffix === 'OD') { return { Id: 1, Name: 'OD' }; }
            if (suffix === 'MD') { return { Id: 2, Name: 'MD' }; }
            return { Id: 0, Name: suffix || 'Unspecified' };
        }

        // Locations come from the parent dashboard scope; providers we load ourselves.
        // ApptBranchLocations carries a synthetic "All Locations" row with ClinicId 0.
        // Drop it - the template has its own All Locations checkbox, and sending the 0
        // through as a location id would make LocationIds read "0,2" instead of "2".
        function seedChecklists() {
            var branches = $filter('filter')($scope.ApptBranchLocations || [], function (l) {
                return l.ClinicId !== 0;
            });
            $scope.PPLocationChecklist = angular.copy(branches);
            angular.forEach($scope.PPLocationChecklist, function (l) { l.IsChecked = true; });
            updatePPLocationText();
        }

        // The provider list always belongs to the locations that are ticked right now - it is
        // reloaded on every location change so the two filters can't drift apart.
        $scope.loadPPProviders = function () {
            var locationIds = ($scope.PPFilterObj.LocationIds || []).join(",");

            // No location ticked - there is nothing to ask the server for, and keeping the old
            // providers around would leave the two filters out of sync.
            if (!locationIds) {
                $scope.PPDoctorChecklist = [];
                $scope.PPAllDoctorsCheck = false;
                updatePPDoctorText();
                return;
            }

            eHnoteMainAppointmentService.getAllUsersByDepartmentIdNew({ "BranchId": locationIds }).then(function (resp) {
                var rows = (resp.data && resp.data.rows) || [];
                var seen = {};
                var list = [];
                angular.forEach(rows, function (u) {
                    if (seen[u.DoctorID]) { return; }
                    if (PP_ROLE_DOCTORS.indexOf(u.RoleId) === -1 && u.RoleId !== PP_ROLE_TECHNICIAN) { return; }
                    seen[u.DoctorID] = true;
                    var pt = providerTypeFor(u);
                    list.push(angular.extend({}, u, {
                        isChecked: true,
                        ProviderTypeId: pt.Id,
                        ProviderTypeName: pt.Name
                    }));
                });
                $scope.PPDoctorChecklist = list;
                updatePPDoctorText();
                $scope.onPPProviderTypeChange();
            }, function () {
                alertify.error("Unable to load providers.");
            });
        };

        // only show providers of the selected type
        $scope.ppDoctorMatchesType = function (doctor) {
            if (!$scope.PPFilterObj.ProviderTypeId) { return true; }   // "" = all types
            return doctor.ProviderTypeId === $scope.PPFilterObj.ProviderTypeId;
        };

        $scope.$watch('ApptBranchLocations.length', function () {
            seedChecklists();
            // the synthetic "All Locations" row is stripped above, so this is a real
            // branch count - don't ask for providers until we have one to ask about.
            if ($scope.PPLocationChecklist.length) {
                $scope.loadPPProviders();
            }
        });

        function updatePPDoctorText() {
            var checked = $filter('filter')($scope.PPDoctorChecklist, { isChecked: true });
            $scope.selectedPPDoctorText = !($scope.PPDoctorChecklist || []).length ? 'No Providers'
                : !checked.length ? 'All Providers'
                : (checked.length === 1 ? checked[0].FullName : checked.length + ' Providers Selected');
            $scope.PPFilterObj.ProviderIds = checked.map(function (d) { return d.DoctorID; });
        }

        function updatePPLocationText() {
            var all = $scope.PPLocationChecklist || [];
            var checked = $filter('filter')(all, { IsChecked: true });
            $scope.selectedPPLocationText = !checked.length ? 'No Locations Selected'
                : (checked.length === all.length ? 'All Locations'
                : (checked.length === 1 ? checked[0].BranchName : checked.length + ' Locations Selected'));
            $scope.PPFilterObj.LocationIds = checked.map(function (l) { return l.ClinicId; });
            $scope.PPAllLocationsCheck = all.length > 0 && checked.length === all.length;
        }

        $scope.PPDoctorToggle = updatePPDoctorText;

        // A location change always reloads the providers, so a provider can never stay selected
        // for a location that is no longer ticked.
        $scope.PPLocationToggle = function () {
            updatePPLocationText();
            $scope.loadPPProviders();
        };

        $scope.PPcheckAllDoctors = function (val) {
            // only the rows actually visible - i.e. matching both the search box and the type filter
            var visible = $filter('filter')($scope.PPDoctorChecklist, { FullName: $scope.PPSearchDoctor });
            visible = $filter('filter')(visible, $scope.ppDoctorMatchesType);
            angular.forEach(visible, function (d) { d.isChecked = val; });
            updatePPDoctorText();
        };

        $scope.PPcheckAllLocations = function (val) {
            angular.forEach($filter('filter')($scope.PPLocationChecklist, { BranchName: $scope.PPSearchLocation }), function (l) {
                l.IsChecked = val;
            });
            updatePPLocationText();
            $scope.loadPPProviders();
        };

        // Changing the type re-ticks exactly the providers of that type, so ProviderIds always
        // carries the right set. The server does no provider-type filtering of its own.
        $scope.onPPProviderTypeChange = function () {
            angular.forEach($scope.PPDoctorChecklist, function (d) {
                d.isChecked = $scope.ppDoctorMatchesType(d);
            });
            $scope.PPAllDoctorsCheck = true;
            updatePPDoctorText();
        };

        function ppCadenceForTab() {
            if ($scope.PPTab === 'weekly') { return 'week'; }
            if ($scope.PPTab === 'monthly') { return 'month'; }
            if ($scope.PPTab === 'scoreboard') { return $scope.PPScoreboardCadence; }
            return 'day';
        }

        function buildPPRequest(extra) {
            var req = {
                "ParentOrganizationId": PPParentHospitalId || PPHospitalId,
                "FromDate": $filter('date')(new Date($scope.PPFilterObj.FromDate), 'yyyy-MM-dd'),
                "ToDate": $filter('date')(new Date($scope.PPFilterObj.ToDate), 'yyyy-MM-dd'),
                "Cadence": ppCadenceForTab(),
                // comma-separated, matching the DoctorsIds / HospitalIdsList convention.
                // ProviderIds is already narrowed to the selected provider type, so the proc
                // does no role/provider-type filtering - it just honours this id list.
                "ProviderIds": ($scope.PPFilterObj.ProviderIds || []).join(","),
                "LocationIds": ($scope.PPFilterObj.LocationIds || []).join(","),
                "ProviderTypeId": $scope.PPFilterObj.ProviderTypeId,
            };
            return angular.extend(req, extra || {});
        }

        /* ---------------- KPI tiles ---------------- */

        // The proc doesn't know the role -> provider type mapping, so fill the display name in
        // here from the provider list we already loaded.
        function applyProviderTypeNames(rows) {
            var byId = {};
            angular.forEach($scope.PPDoctorChecklist, function (d) { byId[d.DoctorID] = d.ProviderTypeName; });
            angular.forEach(rows || [], function (r) {
                // Ours wins: the proc sends the role name ("Doctor"), which can't tell OD from MD.
                // prospectiveRows still carry DoctorId until the proc renames it to ProviderId.
                var mapped = byId[r.ProviderId || r.DoctorId];
                r.ProviderTypeName = mapped || r.ProviderTypeName || '-';
            });
            return rows || [];
        }

        function sum(rows, key) {
            var total = 0;
            angular.forEach(rows || [], function (r) { total += (r[key] || 0); });
            return total;
        }

        // A target is optional. Treat "not configured" as its own state - NOT as a target of zero,
        // which would make every provider look like they had beaten their goal.
        // Target = scheduled minutes / 10, so 0 means no scheduled time, i.e. not configured.
        // The proc currently ISNULLs a missing target to 0, so 0 must count as "no target" too.
        function hasTarget(row) {
            return row && Number(row.TargetPoints) > 0;
        }

        function anyTargetsConfigured() {
            return ($scope.PPWeeklyData || []).some(hasTarget);
        }

        function round1(n) { return Math.round(n * 10) / 10; }

        function buildPPKpis() {
            var tiles = [];
            if ($scope.PPTab === 'daily') {
                var providers = {};
                angular.forEach($scope.PPDailyData, function (r) { providers[r.ProviderName] = true; });
                var providerCount = Object.keys(providers).length;
                var points = sum($scope.PPDailyData, 'Points');
                tiles = [
                    { label: 'Total points', value: round1(points), accent: 'FF7904' },
                    { label: 'Encounters', value: sum($scope.PPDailyData, 'EncounterCount'), accent: '3BAC66' },
                    { label: 'Avg points / provider', value: providerCount ? round1(points / providerCount) : 0, accent: '0040A1' },
                    { label: 'Providers', value: providerCount, accent: '7B4FBF' }
                ];
            } else if ($scope.PPTab === 'weekly') {
                var total = sum($scope.PPWeeklyData, 'TotalPoints');
                if (!anyTargetsConfigured()) {
                    // no targets set up yet - say so rather than implying everyone is on target
                    tiles = [
                        { label: 'Week total', value: round1(total), accent: 'FF7904' },
                        { label: 'Target', value: 'Not set', accent: '757575' },
                        { label: 'Providers', value: $scope.PPWeeklyData.length, accent: '0040A1' },
                        { label: 'Vs target', value: '—', accent: '757575' }
                    ];
                } else {
                    var withTarget = $filter('filter')($scope.PPWeeklyData, hasTarget);
                    var target = sum(withTarget, 'TargetPoints');
                    var over = $filter('filter')(withTarget, function (r) {
                        return (r.TotalPoints || 0) >= r.TargetPoints;
                    }).length;
                    tiles = [
                        { label: 'Week total', value: round1(total), accent: 'FF7904' },
                        { label: 'Target', value: round1(target), accent: '0040A1' },
                        { label: 'At / over target', value: over + ' / ' + withTarget.length, accent: '3BAC66' },
                        { label: 'Under target', value: (withTarget.length - over) + ' / ' + withTarget.length, accent: 'C71D27' }
                    ];
                }
            } else if ($scope.PPTab === 'monthly') {
                var mTotal = sum($scope.PPMonthlyData, 'TotalPoints');
                var avg = $scope.PPMonthlyData.length ? sum($scope.PPMonthlyData, 'AvgPointsPerDay') / $scope.PPMonthlyData.length : 0;
                var best = null;
                angular.forEach($scope.PPMonthlyData, function (r) {
                    if (!best || (r.TotalPoints || 0) > (best.TotalPoints || 0)) { best = r; }
                });
                tiles = [
                    { label: 'Total points', value: round1(mTotal), accent: 'FF7904' },
                    { label: 'Avg points / day', value: round1(avg), accent: '0040A1' },
                    { label: 'Top provider', value: best ? best.ProviderName : '-', accent: '3BAC66' },
                    { label: 'Providers', value: $scope.PPMonthlyData.length, accent: '7B4FBF' }
                ];
            } else {
                var sTotal = sum($scope.PPScoreboardRows, 'Points');
                var types = {};
                angular.forEach($scope.PPScoreboardRows, function (r) { types[r.ProviderTypeName] = true; });
                tiles = [
                    { label: 'Total points', value: round1(sTotal), accent: 'FF7904' },
                    { label: 'Providers ranked', value: $scope.PPScoreboardRows.length, accent: '0040A1' },
                    { label: 'Provider types', value: Object.keys(types).length, accent: '3BAC66' },
                    { label: 'Cadence (' + $scope.PPScoreboardCadence + ')', value: $scope.PPScoreboardRangeText || '-', accent: '7B4FBF' }
                ];
            }
            $scope.PPKpis = tiles;
        }

        /* ---------------- AG Charts ---------------- */

        var chartInstance = null;

        function destroyChart() {
            if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
        }

        function renderPPChart() {
            var container = document.getElementById("PPChart");
            if (!container || typeof agCharts === 'undefined') { return; }
            destroyChart();

            var options = null;

            if ($scope.PPTab === 'daily') {
                // one series per session, so AM/PM sit side by side per provider
                var sessions = [];
                angular.forEach($scope.PPDailyData, function (r) {
                    var s = r.Session || 'All';
                    if (sessions.indexOf(s) === -1) { sessions.push(s); }
                });
                var byProvider = {};
                angular.forEach($scope.PPDailyData, function (r) {
                    var key = r.ProviderName;
                    byProvider[key] = byProvider[key] || { provider: key };
                    byProvider[key][r.Session || 'All'] = r.Points || 0;
                });
                options = {
                    container: container,
                    data: Object.keys(byProvider).map(function (k) { return byProvider[k]; }),
                    title: { text: 'Points by provider & session' },
                    series: sessions.map(function (s) {
                        return { type: 'bar', xKey: 'provider', yKey: s, yName: s };
                    }),
                    axes: [
                        { type: 'category', position: 'bottom' },
                        { type: 'number', position: 'left', title: { text: 'Points' } }
                    ],
                    legend: { position: 'bottom' }
                };

            } else if ($scope.PPTab === 'weekly') {
                if (!anyTargetsConfigured()) {
                    // nothing to compare against - plot the totals honestly instead of a fake variance
                    options = {
                        container: container,
                        data: $scope.PPWeeklyData.map(function (r) {
                            return { provider: r.ProviderName, total: r.TotalPoints || 0 };
                        }),
                        title: { text: 'Weekly points' },
                        subtitle: { text: 'No targets configured - showing totals only' },
                        series: [{ type: 'bar', xKey: 'provider', yKey: 'total', yName: 'Points' }],
                        axes: [
                            { type: 'category', position: 'bottom' },
                            { type: 'number', position: 'left', title: { text: 'Points' } }
                        ],
                        legend: { enabled: false }
                    };
                } else {
                    options = {
                        container: container,
                        // providers with no target are left out rather than shown as a huge surplus
                        data: $filter('filter')($scope.PPWeeklyData, hasTarget).map(function (r) {
                            return { provider: r.ProviderName, variance: round1(r.Variance || 0) };
                        }),
                        title: { text: 'Variance to target' },
                        series: [{
                            type: 'bar', xKey: 'provider', yKey: 'variance', yName: 'Points vs target',
                            itemStyler: function (params) {
                                return { fill: params.datum.variance < 0 ? '#C71D27' : '#0040A1' };
                            }
                        }],
                        axes: [
                            { type: 'category', position: 'bottom' },
                            { type: 'number', position: 'left', title: { text: 'Over / under target' } }
                        ],
                        legend: { enabled: false }
                    };
                }

            } else if ($scope.PPTab === 'monthly') {
                options = {
                    container: container,
                    data: $scope.PPMonthlyData.map(function (r) {
                        return { provider: r.ProviderName, total: r.TotalPoints || 0 };
                    }),
                    title: { text: 'Total points by provider' },
                    series: [{ type: 'bar', xKey: 'provider', yKey: 'total', yName: 'Points' }],
                    axes: [
                        { type: 'category', position: 'bottom' },
                        { type: 'number', position: 'left', title: { text: 'Points' } }
                    ],
                    legend: { enabled: false }
                };

            } else {
                // horizontal ranked bars, ordered by type then points so each type reads as a block
                options = {
                    container: container,
                    data: $scope.PPScoreboardRows.map(function (r) {
                        return { provider: r.ProviderTypeName + ' - ' + r.ProviderName, points: r.Points || 0 };
                    }),
                    title: { text: 'Scoreboard (' + $scope.PPScoreboardCadence + ')' },
                    series: [{ type: 'bar', direction: 'horizontal', xKey: 'provider', yKey: 'points', yName: 'Points' }],
                    axes: [
                        { type: 'category', position: 'left' },
                        { type: 'number', position: 'bottom', title: { text: 'Points' } }
                    ],
                    legend: { enabled: false }
                };
            }

            chartInstance = agCharts.AgCharts.create(options);
        }

        /* ---------------- ag-grid ---------------- */

        var gridApi = null;

        function encounterLinkRenderer(params) {
            if (!(params.value > 0)) { return params.value; }
            var link = document.createElement('a');
            link.href = 'javascript:;';
            link.textContent = params.value;
            link.addEventListener('click', function () {
                $scope.$applyAsync(function () {
                    $scope.showPPEncounterDetails(params.data, params.colDef.field === 'ScheduledEncounterCount' ? 'scheduled' : 'completed');
                });
            });
            return link;
        }

        function columnDefsForTab() {
            if ($scope.PPTab === 'daily') {
                return [
                    { field: 'ProviderName', headerName: 'Provider', minWidth: 180 },
                    { field: 'ProviderTypeName', headerName: 'Provider Type' },
                    { field: 'LocationName', headerName: 'Location', minWidth: 180 },
                    { field: 'Session', headerName: 'Session' },
                    { field: 'EncounterCount', headerName: 'Encounters', cellRenderer: encounterLinkRenderer },
                    { field: 'Points', headerName: 'Points' },
                    { field: 'Minutes', headerName: 'Minutes' }
                ];
            }
            if ($scope.PPTab === 'weekly') {
                return [
                    { field: 'ProviderName', headerName: 'Provider', minWidth: 180 },
                    { field: 'ProviderTypeName', headerName: 'Provider Type' },
                    { field: 'LocationName', headerName: 'Location', minWidth: 180 },
                    { field: 'TotalPoints', headerName: 'Total Points' },
                    {
                        field: 'TargetPoints', headerName: 'Target',
                        valueFormatter: function (p) { return hasTarget(p.data) ? p.value : '—'; }
                    },
                    {
                        field: 'Variance', headerName: 'Variance',
                        // no target means no variance - don't imply a surplus that isn't real
                        valueFormatter: function (p) {
                            if (!hasTarget(p.data)) { return '—'; }
                            var v = round1(p.data.Variance || 0);
                            return (v > 0 ? '+' : '') + v;
                        },
                        cellStyle: function (p) {
                            if (!hasTarget(p.data)) { return { color: '#757575' }; }
                            return { color: (p.data.Variance || 0) < 0 ? '#C71D27' : '#3BAC66' };
                        }
                    }
                ];
            }
            if ($scope.PPTab === 'monthly') {
                return [
                    { field: 'ProviderName', headerName: 'Provider', minWidth: 180 },
                    { field: 'ProviderTypeName', headerName: 'Provider Type' },
                    { field: 'LocationName', headerName: 'Location', minWidth: 180 },
                    { field: 'AvgPointsPerDay', headerName: 'Avg Points / Day' },
                    { field: 'TotalPoints', headerName: 'Total Points' },
                    {
                        field: 'TrendPercent', headerName: 'Trend vs Prior',
                        // null = no previous-period points, so there is no trend to show
                        valueFormatter: function (p) {
                            if (p.value === null || p.value === undefined) { return '—'; }
                            return (p.value > 0 ? '+' : '') + p.value + '%';
                        },
                        cellStyle: function (p) {
                            if (p.value === null || p.value === undefined) { return { color: '#757575' }; }
                            return { color: (p.value < 0) ? '#C71D27' : '#3BAC66' };
                        }
                    }
                ];
            }
            return [
                { field: 'ProviderTypeName', headerName: 'Provider Type', rowGroup: false },
                { field: 'Rank', headerName: 'Rank (within type)', maxWidth: 160 },
                { field: 'ProviderName', headerName: 'Provider', minWidth: 180 },
                { field: 'LocationName', headerName: 'Location', minWidth: 180 },
                { field: 'Points', headerName: 'Points' }
            ];
        }

        function rowDataForTab() {
            if ($scope.PPTab === 'daily') { return $scope.PPDailyData; }
            if ($scope.PPTab === 'weekly') { return $scope.PPWeeklyData; }
            if ($scope.PPTab === 'monthly') { return $scope.PPMonthlyData; }
            return $scope.PPScoreboardRows;
        }

        function renderPPGrid() {
            var gridDiv = document.getElementById("PPGrid");
            if (!gridDiv || typeof agGrid === 'undefined') { return; }

            if (gridApi) {
                gridApi.setGridOption('columnDefs', columnDefsForTab());
                gridApi.setGridOption('rowData', rowDataForTab());
                return;
            }

            gridApi = agGrid.createGrid(gridDiv, {
                columnDefs: columnDefsForTab(),
                rowData: rowDataForTab(),
                defaultColDef: {
                    flex: 1,
                    minWidth: 110,
                    sortable: true,
                    filter: false,
                    resizable: true,
                    suppressHeaderMenuButton: true
                },
                animateRows: false
            });
        }

        function refreshPPView() {
            buildPPKpis();
            $timeout(function () {
                renderPPChart();
                renderPPGrid();
            }, 0);
        }

        // ag-grid's own Excel export, replacing the hand-rolled blob download
        $scope.exportProviderProductivityToExcel = function () {
            if (!gridApi) { return; }
            gridApi.exportDataAsExcel({
                fileName: 'ProviderProductivity_' + $scope.PPTab + '_' + $filter('date')(new Date(), 'yyyyMMdd') + '.xlsx',
                sheetName: $scope.PPTab
            });
        };

        /* ---------------- data ---------------- */

        $scope.switchPPTab = function (tab) {
            $scope.PPTab = tab;
            if ($scope.PPSampleMode) { refreshPPView(); return; }
            $scope.ApplyPPFilters();
        };

        $scope.changePPScoreboardCadence = function (cadence) {
            $scope.PPScoreboardCadence = cadence;
            if ($scope.PPSampleMode) { refreshPPView(); return; }
            $scope.getPPScoreboard();
        };

        $scope.ApplyPPFilters = function () {
            // An empty LocationIds reads as "every location" on the server, so an unticked
            // location filter would silently widen the search instead of narrowing it.
            if (!($scope.PPFilterObj.LocationIds || []).length) {
                alertify.error("Please select at least one location.");
                return;
            }
            $scope.PPSampleMode = false;
            if ($scope.PPTab === 'daily') { $scope.getPPDaily(); }
            else if ($scope.PPTab === 'weekly') { $scope.getPPWeekly(); }
            else if ($scope.PPTab === 'monthly') { $scope.getPPMonthly(); }
            else { $scope.getPPScoreboard(); }
        };

        $scope.getPPDaily = function () {
            eHnoteMainDashboardDataServices.GetProviderProductivityDaily(buildPPRequest()).then(function (resp) {
                $scope.PPDailyData = applyProviderTypeNames((resp.data && resp.data.rows) || []);
                refreshPPView();
            }, function () { alertify.error("Unable to load Daily Provider Productivity."); });
        };

        $scope.getPPWeekly = function () {
            eHnoteMainDashboardDataServices.GetProviderProductivityWeekly(buildPPRequest()).then(function (resp) {
                $scope.PPWeeklyData = applyProviderTypeNames((resp.data && resp.data.rows) || []);
                $scope.PPWeeklyProspectiveData = applyProviderTypeNames((resp.data && resp.data.prospectiveRows) || []);
                refreshPPView();
            }, function () { alertify.error("Unable to load Weekly Provider Productivity."); });
        };

        $scope.getPPMonthly = function () {
            eHnoteMainDashboardDataServices.GetProviderProductivityMonthly(buildPPRequest()).then(function (resp) {
                $scope.PPMonthlyData = applyProviderTypeNames((resp.data && resp.data.rows) || []);
                refreshPPView();
            }, function () { alertify.error("Unable to load Monthly Provider Productivity."); });
        };

        $scope.getPPScoreboard = function () {
            eHnoteMainDashboardDataServices.GetProviderProductivityScoreboard(buildPPRequest(ppScoreboardDateRange()))
                .then(function (resp) {
                    $scope.PPScoreboardRows = applyProviderTypeNames(flattenScoreboard(resp.data));
                    refreshPPView();
                }, function () { alertify.error("Unable to load Provider Productivity Scoreboard."); });
        };

        // The scoreboard proc only reads FromDate/ToDate, so the cadence has to become a date range.
        // Windows end on the selected To Date: day = that date, week = last 7 days, month = last month.
        function ppScoreboardDateRange() {
            var to = moment($scope.PPFilterObj.ToDate, ["MM-DD-YYYY", "YYYY-MM-DD"], true);
            if (!to.isValid()) { to = moment(); }
            var from = to.clone();
            if ($scope.PPScoreboardCadence === 'week') { from.subtract(6, 'days'); }
            else if ($scope.PPScoreboardCadence === 'month') { from.subtract(1, 'months').add(1, 'days'); }
            // From Date is ignored here, so show the window actually queried - otherwise the
            // filter bar's From Date reads as if it applied.
            $scope.PPScoreboardRangeText = ($scope.PPScoreboardCadence === 'day')
                ? to.format('MM-DD-YYYY')
                : from.format('MM-DD-YYYY') + ' to ' + to.format('MM-DD-YYYY');
            return {
                "Cadence": $scope.PPScoreboardCadence,
                "FromDate": from.format('YYYY-MM-DD'),
                "ToDate": to.format('YYYY-MM-DD')
            };
        }

        // the proc returns groups; the grid wants flat rows, ordered type-then-rank
        function flattenScoreboard(data) {
            var rows = [];
            angular.forEach((data && data.providerTypeGroups) || [], function (group) {
                angular.forEach(group.Providers || [], function (p) {
                    rows.push({
                        ProviderTypeName: group.ProviderTypeName,
                        ProviderName: p.ProviderName,
                        LocationName: p.LocationName,
                        Points: p.Points,
                        Rank: p.Rank,
                        ProviderId: p.ProviderId
                    });
                });
            });
            return rows;
        }

        /* ---------------- drill-down popup ---------------- */

        $scope.showPPEncounterDetails = function (row, mode) {
            var count = (mode === 'scheduled') ? row.ScheduledEncounterCount : row.EncounterCount;
            if (!(count > 0)) { return; }

            if ($scope.PPSampleMode) {
                openPPEncounterDetailsPopup(row, mode, buildPPSampleEncounterDetails(row, count));
                return;
            }
            //var req = buildPPRequest({
            //    "ProviderId": row.ProviderId || 0,
            //    "Session": row.Session || "",
            //    "Mode": mode || "completed"
            //});
            var req = {
                "ProviderId": row.ProviderId || row.DoctorId || 0,
                //"Session": row.Session || "",
                "Mode": mode || "completed",
                "ParentOrganizationId": PPParentHospitalId || PPHospitalId,
                "FromDate": $filter('date')(new Date($scope.PPFilterObj.FromDate), 'yyyy-MM-dd'),
                "ToDate": $filter('date')(new Date($scope.PPFilterObj.ToDate), 'yyyy-MM-dd'),
                "Cadence": "day",
                "LocationIds": ($scope.PPFilterObj.LocationIds || []).join(","),
                "Session": "",
                "ProviderTypeId": $scope.PPFilterObj.ProviderTypeId,

            }
            eHnoteMainDashboardDataServices.GetProviderProductivityEncounterDetails(req).then(function (resp) {
                openPPEncounterDetailsPopup(row, mode, (resp.data && resp.data.rows) || []);
            }, function () { alertify.error("Unable to load appointment details."); });
        };

        function openPPEncounterDetailsPopup(row, mode, details) {
            var totalPoints = 0;
            var totalMinutes = 0;
            angular.forEach(details, function (d) {
                var MobileNumber = d.MobileNo || 0;

                var mobileno = eHnoteUserDataService.UsMobileFormatChange(MobileNumber);
                d.MobileNo = mobileno.UsFormatMobileNumber;

                totalPoints += (d.Points || 0);
                totalMinutes += (d.Minutes || 0);
            });

            $uibModal.open({
                size: 'lg',
                backdrop: true,
                controller: ['$scope', '$uibModalInstance', 'PObj', function ($scope, $uibModalInstance, PObj) {
                    $scope.info = PObj;
                    $scope.closeDetails = function () { $uibModalInstance.dismiss('cancel'); };
                }],
                resolve: {
                    PObj: function () {
                        return {
                            heading: (mode === 'scheduled') ? 'Scheduled' : 'Encounters',
                            provider: row.ProviderName,
                            providerType: row.ProviderTypeName,
                            session: row.Session || '',
                            totalPoints: round1(totalPoints),
                            totalMinutes: round1(totalMinutes),
                            details: details
                        };
                    }
                },
                /*<th>Time</th>*/
                /*<td>{{p.AppointmentTime}}</td>*/
                template:
                    '<div class="modal-header">' +
                    '  <button type="button" class="close" ng-click="closeDetails()">&times;</button>' +
                    '  <h4 class="modal-title">{{info.heading}} &mdash; {{info.provider}} <small>({{info.providerType}}<span ng-if="info.session">, {{info.session}}</span>)</small></h4>' +
                    '</div>' +
                    '<div class="modal-body" style="max-height:70vh;overflow:auto;">' +
                    '  <div ng-if="!info.details.length" class="text-muted">No appointments found.</div>' +
                    '  <table ng-if="info.details.length" class="table table-striped table-bordered">' +
                    '    <thead><tr>' +
                    '      <th>#</th><th>Location</th><th>Patient</th><th>MR #</th><th>DOB</th><th>Gender</th>' +
                    '      <th>Mobile</th><th>Appt Date</th><th>Visit Reason</th>' +
                    '      <th class="text-right">Points</th><th class="text-right">Minutes</th>' +
                    '    </tr></thead>' +
                    '    <tbody>' +
                    '      <tr ng-repeat="p in info.details">' +
                    '        <td>{{$index + 1}}</td><td>{{p.OrganizationName || "-"}}</td><td>{{p.PatientName}}</td><td>{{p.MRNumber}}</td>' +
                    '        <td>{{p.DOB}}</td><td>{{p.Gender || "-"}}</td><td>{{p.MobileNo}}</td>' +
                    '        <td>{{p.AppointmentDate}}</td><td>{{p.VisitReason}}</td>' +
                    '        <td class="text-right">{{p.Points}}</td><td class="text-right">{{p.Minutes}}</td>' +
                    '      </tr>' +
                    '    </tbody>' +
                    '    <tfoot><tr>' +
                    '      <th colspan="9" class="text-right">Total</th>' +
                    '      <th class="text-right">{{info.totalPoints}}</th>' +
                    '      <th class="text-right">{{info.totalMinutes}}</th>' +
                    '    </tr></tfoot>' +
                    '  </table>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '  <button class="btn btn-default" ng-click="closeDetails()">Close</button>' +
                    '</div>'
            });
        }

        

        $scope.$on('$destroy', function () {
            destroyChart();
            if (gridApi && gridApi.destroy) { gridApi.destroy(); }
        });

        seedChecklists();
        refreshPPView();
    }]);

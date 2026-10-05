"use strict";
eHnoteWebApp.controller("UsASCIncompleteEhrReportCtrl", ["$scope", "$q", "$timeout", "$uibModal", "alertify", "eHnoteMasterDataService", "eHnoteMainAppointmentService", "eHnoteSurgeryService", "eHnoteInsuranceService", function ($scope, $q, $timeout, $uibModal, alertify, eHnoteMasterDataService, eHnoteMainAppointmentService, eHnoteSurgeryService, eHnoteInsuranceService) {
    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    var ehrGridApi = null;
    var ehrChart = null;
    var ehrDashboardCharts = { "Provider": null, "Section": null };
    var ehrRequestToken = 0;
    var ehrProfessionalsList = [];

    var EhrRoles = [
        { "RoleTypeId": 1, "DisplayName": "Doctor", "RoleNames": ["doctor", "doctors", "admin doctor", "md", "od", "surgeon", "physician"], "RoleIds": [] },
        { "RoleTypeId": 2, "DisplayName": "Anesthesia", "RoleNames": ["anesthesia", "anesthetist", "anesthetists", "anesthesiologist"], "RoleIds": [] },
        { "RoleTypeId": 3, "DisplayName": "Nurse", "RoleNames": ["nurse", "nurses"], "RoleIds": [] }
    ];

    // ScreenTypeId is the phase - Facesheet, Discharge, Orders and Consents have none, so they go as 0 and match on Screen
    var EhrSections = [
        { "ScreenTypeId": 4, "Screen": "PreOp", "UserType": "Nurse", "DisplayName": "Pre Op Nurse" },
        { "ScreenTypeId": 4, "Screen": "PreOp", "UserType": "Anesthesia", "DisplayName": "Pre Op Anesthesia" },
        { "ScreenTypeId": 5, "Screen": "IntraOp", "UserType": "Nurse", "DisplayName": "Intra Op Nurse" },
        { "ScreenTypeId": 5, "Screen": "IntraOp", "UserType": "Anesthesia", "DisplayName": "Intra Op Anesthesia" },
        { "ScreenTypeId": 6, "Screen": "PostOp-R1", "UserType": "", "DisplayName": "Recovery I" },
        { "ScreenTypeId": 6, "Screen": "PostOp-R2", "UserType": "", "DisplayName": "Recovery II" },
        { "ScreenTypeId": 0, "Screen": "Facesheet", "UserType": "", "DisplayName": "Doctor Notes (Procedure Report)" },
        { "ScreenTypeId": 0, "Screen": "Discharge", "UserType": "", "DisplayName": "Discharge Summary" },
        { "ScreenTypeId": 0, "Screen": "Orders", "UserType": "", "DisplayName": "Orders" },
        { "ScreenTypeId": 0, "Screen": "Consents", "UserType": "", "DisplayName": "Consents" },
        { "ScreenTypeId": 0, "Screen": "AdvanceDirectives", "UserType": "", "DisplayName": "Advance Directives" }
    ];

    $scope.EhrCustomRangeId = 11;
    $scope.EhrDateRangeList = [
        { "Id": 0, "Name": "All" },
        { "Id": 4, "Name": "This month" },
        { "Id": 5, "Name": "Last month" },
        { "Id": 6, "Name": "Last 2 months" },
        { "Id": 7, "Name": "Last 3 months" },
        { "Id": 9, "Name": "This year" },
        { "Id": 10, "Name": "Last year" },
        { "Id": $scope.EhrCustomRangeId, "Name": "Custom Date" }
    ];

    function getEhrFilterGroup(title, list) {
        let group = { "Title": title, "List": list || [], "AllCheck": true, "SearchText": "", "SelectedText": "All" };
        $scope.checkAllDashboardItems(group);
        return group;
    }

    function getEhrCheckedIds(group, key) {
        return _.pluck(_.where(group.List, { isChecked: true }), key).join(",");
    }

    function getEhrLocations() {
        let branches = ($scope.mainAscParentObj && $scope.mainAscParentObj.AllBranchesList) || [];
        return branches.filter(function (item) { return item.ClinicId !== 0; }).map(function (item) {
            return { "ClinicId": item.ClinicId, "DisplayName": item.BranchName || item.ClinicName };
        });
    }

    var EhrDefaultDateRangeId = 4;

    function getEhrFilter() {
        return {
            "DateRangeId": EhrDefaultDateRangeId,
            "FromDate": "",
            "ToDate": ""
        };
    }

    function buildEhrProfessionalsGroup() {
        let roleIds = getCheckedEhrRoleIds();
        let list = angular.copy(ehrProfessionalsList.filter(function (item) { return roleIds.indexOf(item.RoleId) >= 0; }));
        $scope.EhrProfessionals = getEhrFilterGroup("Doctor", list);
    }

    function resetEhrFilters() {
        $scope.EhrFilter = getEhrFilter();
        $scope.setEhrDateRange();
        $scope.EhrLocations = getEhrFilterGroup("Location", getEhrLocations());
        $scope.EhrRoles = getEhrFilterGroup("Role", angular.copy(EhrRoles));
        $scope.EhrSections = getEhrFilterGroup("Screen", angular.copy(EhrSections));
        buildEhrProfessionalsGroup();
    }

    $scope.checkAllEhrRoles = function (group) {
        $scope.checkAllDashboardItems(group);
        buildEhrProfessionalsGroup();
    };

    $scope.toggleEhrRole = function (group) {
        $scope.toggleDashboardItem(group);
        buildEhrProfessionalsGroup();
    };

    $scope.setEhrDateRange = function () {
        let filter = $scope.EhrFilter;
        switch (filter.DateRangeId) {
            case 4:
                filter.FromDate = moment().startOf("month").format("MM-DD-YYYY");
                filter.ToDate = moment().format("MM-DD-YYYY");
                break;
            case 5:
                filter.FromDate = moment().subtract(1, "months").startOf("month").format("MM-DD-YYYY");
                filter.ToDate = moment().subtract(1, "months").endOf("month").format("MM-DD-YYYY");
                break;
            case 6:
                filter.FromDate = moment().subtract(2, "months").startOf("month").format("MM-DD-YYYY");
                filter.ToDate = moment().format("MM-DD-YYYY");
                break;
            case 7:
                filter.FromDate = moment().subtract(3, "months").startOf("month").format("MM-DD-YYYY");
                filter.ToDate = moment().format("MM-DD-YYYY");
                break;
            case 9:
                filter.FromDate = moment().startOf("year").format("MM-DD-YYYY");
                filter.ToDate = moment().format("MM-DD-YYYY");
                break;
            case 10:
                filter.FromDate = moment().subtract(1, "years").startOf("year").format("MM-DD-YYYY");
                filter.ToDate = moment().subtract(1, "years").endOf("year").format("MM-DD-YYYY");
                break;
            default:
                filter.FromDate = "";
                filter.ToDate = "";
        }
    };

    function loadEhrRoleIds() {
        return eHnoteMainAppointmentService.GetParentOrgRolesById($scope.ParentHospitalID).then(function (resp) {
            let masterRoles = (resp.data && resp.data.row) || [];

            EhrRoles.forEach(function (role) {
                role.RoleIds = masterRoles
                    .filter(function (item) { return role.RoleNames.indexOf(String(item.RoleName || "").trim().toLowerCase()) >= 0; })
                    .map(function (item) { return Number(item.RoleId); });
            });

            if (_.every(EhrRoles, function (role) { return role.RoleIds.length === 0; })) {
                alertify.error("Getting Roles Failed");
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Roles Failed");
        });
    }

    function getCheckedEhrRoleIds() {
        return _.flatten(_.pluck(_.where($scope.EhrRoles.List, { isChecked: true }), "RoleIds"));
    }

    function getEhrRoleOf(roleId) {
        return _.find(EhrRoles, function (role) { return role.RoleIds.indexOf(Number(roleId)) >= 0; });
    }

    function loadEhrProfessionals() {
        let branches = (($scope.mainAscParentObj && $scope.mainAscParentObj.AllBranchesList) || []).filter(function (item) { return item.BranchId !== 0; });
        let branchIds = branches.length > 0 ? _.pluck(branches, "BranchId").join(",") : String($scope.HospitalID);

        return eHnoteMainAppointmentService.getBranchSubSpecializationsById(doctorInfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalID).then(function (resp) {
            let subSpecializations = (resp.data && resp.data.row) || [];
            if (subSpecializations.length === 0) {
                alertify.error("No Users are been added");
                return;
            }
            let reqObj = {
                "BranchId": branchIds,
                "SubSpecializationIdArray": _.pluck(subSpecializations, "SubSpecializationId").join(",")
            };
            let deferred = $q.defer();
            eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, function (data) {
                ehrProfessionalsList = [];
                _.uniq((data && data.rows) || [], false, function (item) { return item.DoctorID; }).forEach(function (item) {
                    if (!getEhrRoleOf(item.RoleId)) { return; }
                    ehrProfessionalsList.push({ "DoctorID": item.DoctorID, "RoleId": Number(item.RoleId), "DisplayName": item.SecondUserFullName || item.FullName || "" });
                });
                ehrProfessionalsList = _.sortBy(ehrProfessionalsList, "DisplayName");
                deferred.resolve();
            }, function (err) {
                console.log(err);
                alertify.error("Getting Providers Failed");
                deferred.resolve();
            });
            return deferred.promise;
        }, function (err) {
            console.log(err);
            alertify.error("Getting Providers Failed");
        });
    }

    var EHR_COUNT_FIELDS = ["LessThan30Days", "MoreThan30Days", "Total"];

    function isEhrTotalRow(p) {
        return !!(p.node && p.node.rowPinned) || !!(p.data && p.data.IsTypeRow);
    }

    function isEhrDrillCell(p) {
        return !isEhrTotalRow(p) && EHR_COUNT_FIELDS.indexOf(p.colDef.field) >= 0 && Number(p.value) > 0;
    }

    function getEhrCountColumn(field, header) {
        return {
            "headerName": header,
            "field": field,
            "width": 140,
            "type": "numericColumn",
            "valueFormatter": function (p) { return Number(p.value) || 0; },
            "cellStyle": function (p) {
                if (isEhrTotalRow(p)) { return { fontWeight: "700" }; }
                return isEhrDrillCell(p) ? { cursor: "pointer" } : null;
            }
        };
    }

    function getEhrColumnDefs() {
        return [
            {
                "headerName": "Provider",
                "field": "Name",
                "flex": 1,
                "minWidth": 260,
                "cellStyle": function (p) {
                    if (isEhrTotalRow(p)) { return { fontWeight: "700" }; }
                    return { paddingLeft: "28px" };
                }
            },
            getEhrCountColumn("LessThan30Days", "< 30 days"),
            getEhrCountColumn("MoreThan30Days", "≥ 30 days"),
            getEhrCountColumn("Total", "Total")
        ];
    }

    function getEhrCounts(item) {
        return {
            "LessThan30Days": Number(item && item.LessThan30Days) || 0,
            "MoreThan30Days": Number(item && item.MoreThan30Days) || 0,
            "Total": Number(item && item.Total) || 0
        };
    }

    function addEhrCounts(target, item) {
        let counts = getEhrCounts(item);
        target.LessThan30Days += counts.LessThan30Days;
        target.MoreThan30Days += counts.MoreThan30Days;
        target.Total += counts.Total;
    }

    var EhrOtherRole = { "RoleTypeId": 0, "DisplayName": "Other" };

    // RoleId when the proc sends it, otherwise the provider's role from the users master
    function getEhrRowRole(item) {
        let role = getEhrRoleOf(item.RoleId);
        if (role) { return role; }

        let user = _.find(ehrProfessionalsList, function (provider) {
            return Number(provider.DoctorID) === Number(item.ProviderId);
        });
        return (user && getEhrRoleOf(user.RoleId)) || null;
    }

    function getEhrProfessionalRows(rows) {
        let gridRows = [];
        let grouped = _.groupBy(rows, function (item) {
            let role = getEhrRowRole(item);
            return role ? role.RoleTypeId : EhrOtherRole.RoleTypeId;
        });

        EhrRoles.concat([EhrOtherRole]).forEach(function (role) {
            let members = grouped[role.RoleTypeId] || [];
            if (members.length === 0) { return; }

            let roleRow = angular.extend({ "Name": role.DisplayName, "IsTypeRow": true }, getEhrCounts(null));
            gridRows.push(roleRow);
            _.sortBy(members, "ProviderName").forEach(function (item) {
                addEhrCounts(roleRow, item);
                gridRows.push(angular.extend({
                    "Name": item.ProviderName,
                    "ProviderId": item.ProviderId,
                    "RoleId": item.RoleId,
                    "RoleName": role.DisplayName
                }, getEhrCounts(item)));
            });
        });
        return gridRows;
    }

    // one case can be incomplete for several providers, so the unique row is the proc's and never a sum
    function getEhrPinnedRows(rows, uniqueRecords) {
        let totalRow = angular.extend({ "Name": "Total" }, getEhrCounts(null));
        rows.forEach(function (item) { addEhrCounts(totalRow, item); });
        return [
            totalRow,
            angular.extend({ "Name": "Total Unique Incomplete Records" }, getEhrCounts(uniqueRecords))
        ];
    }

    // the dashboard's 13 boxes are the mockup's, in its order; the ones BA has not defined yet carry
    // IsPending so they read "Definition pending" instead of showing a count we invented
    var EhrDashboardSections = [
        { "Key": "Facesheet", "DisplayName": "Doctor Note (No report)", "Screens": [{ "ScreenTypeId": 0, "Screen": "Facesheet", "UserType": "" }] },
        { "Key": "Discharge", "DisplayName": "Discharge Summary", "Screens": [{ "ScreenTypeId": 0, "Screen": "Discharge", "UserType": "" }] },
        { "Key": "PreOp", "DisplayName": "Pre Op", "Screens": [{ "ScreenTypeId": 4, "Screen": "PreOp", "UserType": "Nurse" }, { "ScreenTypeId": 4, "Screen": "PreOp", "UserType": "Anesthesia" }] },
        { "Key": "IntraOp", "DisplayName": "Intra Op", "Screens": [{ "ScreenTypeId": 5, "Screen": "IntraOp", "UserType": "Nurse" }, { "ScreenTypeId": 5, "Screen": "IntraOp", "UserType": "Anesthesia" }] },
        { "Key": "PostOp-R1", "DisplayName": "Recovery I", "Screens": [{ "ScreenTypeId": 6, "Screen": "PostOp-R1", "UserType": "" }] },
        { "Key": "PostOp-R2", "DisplayName": "Recovery", "Screens": [{ "ScreenTypeId": 6, "Screen": "PostOp-R2", "UserType": "" }] },
        { "Key": "Orders", "DisplayName": "Orders", "Screens": [{ "ScreenTypeId": 0, "Screen": "Orders", "UserType": "" }] },
        { "Key": "Consents", "DisplayName": "Consents", "Screens": [{ "ScreenTypeId": 0, "Screen": "Consents", "UserType": "" }] },
        { "Key": "AdvanceDirectives", "DisplayName": "Advance Directives", "Screens": [{ "ScreenTypeId": 0, "Screen": "AdvanceDirectives", "UserType": "" }] }
    ];

    // the chart card is h__300-- (300px), which reads comfortably up to about ten horizontal bars
    var EHR_CHART_TOP_N = 10;

    $scope.EhrDashboard = {
        "Unique": null, "Panels": [], "Sections": [], "SortedSections": [],
        "ProviderChartRows": [], "SectionChartRows": [],
        "HasSectionRows": false, "Context": null
    };
    $scope.EhrView = { "Tab": "Report" };

    // ag-charts sizes itself off the container, which has no height while the tab is hidden
    $scope.SetEhrView = function (tab) {
        $scope.EhrView.Tab = tab;
        if (tab === "Dashboard") { loadEhrDashboardSections(); }
    };

    function buildEhrDashboardChart(containerId, chartRows) {
        let container = document.getElementById(containerId);
        if (!container || typeof agCharts === "undefined" || chartRows.length === 0) { return null; }

        return agCharts.AgCharts.create({
            "container": container,
            "data": chartRows,
            // the mockup's chart: horizontal stacked bars, biggest total at the top, value on each segment
            "series": [
                {
                    "type": "bar", "direction": "horizontal", "xKey": "Name",
                    "yKey": "LessThan30Days", "yName": "< 30 days",
                    "stacked": true, "fill": "#4472C4",
                    "label": { "enabled": true, "color": "#FFFFFF", "fontSize": 11 }
                },
                {
                    "type": "bar", "direction": "horizontal", "xKey": "Name",
                    "yKey": "MoreThan30Days", "yName": "> 30 days",
                    "stacked": true, "fill": "#ED7D31",
                    "label": { "enabled": true, "color": "#FFFFFF", "fontSize": 11 }
                }
            ],
            "legend": { "position": "bottom", "item": { "marker": { "shape": "square" } } },
            "axes": [
                { "type": "category", "position": "left", "label": { "fontSize": 11 } },
                { "type": "number", "position": "bottom", "label": { "fontSize": 11 } }
            ]
        });
    }

    function renderEhrDashboardCharts() {
        ["Provider", "Section"].forEach(function (key) {
            if (ehrDashboardCharts[key]) {
                ehrDashboardCharts[key].destroy();
                ehrDashboardCharts[key] = null;
            }
        });
        ehrDashboardCharts.Provider = buildEhrDashboardChart("EhrDashboardProviderChart", $scope.EhrDashboard.ProviderChartRows);
        ehrDashboardCharts.Section = buildEhrDashboardChart("EhrDashboardSectionChart", $scope.EhrDashboard.SectionChartRows);
    }

    // SectionRows is the proc's second result set - until it ships, a defined box shows "-" not a zero
    function getEhrSectionRow(sectionRows, section) {
        return _.find(sectionRows, function (item) {
            let name = (item.SectionName || "").toLowerCase();
            return name === section.Key.toLowerCase() || name === section.DisplayName.toLowerCase();
        });
    }

    function buildEhrDashboard(rows, uniqueRecords, sectionRows) {
        sectionRows = sectionRows || [];

        let grouped = _.groupBy(rows, function (item) {
            let role = getEhrRowRole(item);
            return role ? role.RoleTypeId : EhrOtherRole.RoleTypeId;
        });

        $scope.EhrDashboard.Unique = getEhrCounts(uniqueRecords);

        $scope.EhrDashboard.Panels = EhrRoles.concat([EhrOtherRole]).map(function (role) {
            let members = grouped[role.RoleTypeId] || [];
            return {
                "DisplayName": role.DisplayName,
                "Count": members.length,
                // ProviderId and RoleName travel with the row so a click can open the details panel
                "Members": _.sortBy(members, "ProviderName").map(function (item) {
                    return angular.extend({
                        "Name": item.ProviderName,
                        "ProviderId": item.ProviderId,
                        "RoleName": role.DisplayName
                    }, getEhrCounts(item));
                })
            };
        }).filter(function (panel) { return panel.Members.length > 0; });

        $scope.EhrDashboard.Sections = EhrDashboardSections.map(function (section) {
            let match = section.IsPending ? null : getEhrSectionRow(sectionRows, section);
            return angular.extend({
                "DisplayName": section.DisplayName,
                "IsPending": section.IsPending === true,
                "HasCounts": !!match
            }, getEhrCounts(match));
        });

        // both charts are the mockup's: the two buckets only, biggest total first. The bar chart is
        // unreadable past a couple of dozen providers, so it shows the worst EHR_CHART_TOP_N
        $scope.EhrDashboard.ProviderChartRows = _.sortBy(rows.map(function (item) {
            return angular.extend({ "Name": item.ProviderName }, getEhrCounts(item));
        }), "Total").reverse().slice(0, EHR_CHART_TOP_N);

        $scope.EhrDashboard.HasSectionRows = sectionRows.length > 0;
        setEhrSectionChartRows();
        setEhrDashboardSummary();

        if ($scope.EhrView.Tab === "Dashboard") { loadEhrDashboardSections(); }
    }

    function setEhrBarPercent(list) {
        let max = _.max(list.map(function (item) { return item.Total || 0; })) || 0;
        list.forEach(function (item) {
            item.BarPercent = max > 0 ? Math.round(((item.Total || 0) / max) * 100) : 0;
        });
    }

    function setEhrDashboardSummary() {
        $scope.EhrDashboard.Panels.forEach(function (panel) { setEhrBarPercent(panel.Members); });
        setEhrBarPercent($scope.EhrDashboard.Sections);

        // worst first, so the eye lands on the sections that need chasing
        $scope.EhrDashboard.SortedSections = _.sortBy($scope.EhrDashboard.Sections, function (section) {
            return section.HasCounts ? -(section.Total || 0) : 1;
        });

        // a screenshot of this ends up in an email, where the filter bar is no longer visible
        $scope.EhrDashboard.Context = {
            "DateRange": $scope.EhrFilter.DateRangeId === 0
                ? "All service dates"
                : "Service dates " + $scope.EhrFilter.FromDate + " – " + $scope.EhrFilter.ToDate,
            "Location": $scope.EhrLocations.SelectedText,
            "Roles": $scope.EhrRoles.SelectedText,
            "Generated": moment().format("MM-DD-YYYY hh:mm A")
        };
    }

    // the boxes carry DisplayName, the chart plots xKey "Name" - without this every bar is one "undefined" category
    function setEhrSectionChartRows() {
        $scope.EhrDashboard.SectionChartRows = _.sortBy($scope.EhrDashboard.Sections.filter(function (section) {
            return section.HasCounts;
        }), "Total").reverse().map(function (section) {
            return angular.extend({ "Name": section.DisplayName }, getEhrCounts(section));
        });
    }

    // until the proc returns SectionRows, each defined box is one summary call filtered to that screen -
    // that call's UniqueRecords is the box's count. When SectionRows ships this whole fallback goes away.
    function loadEhrSectionCounts() {
        let base = getEhrRequest();
        if (!base) { return; }

        let token = ehrRequestToken;
        let defined = EhrDashboardSections.filter(function (section) { return section.Screens.length > 0; });

        $q.all(defined.map(function (section) {
            let request = angular.extend({}, base, { "Screens": angular.copy(section.Screens) });
            return eHnoteSurgeryService.GetIncompleteEhrSummaryReport(request).then(function (resp) {
                if (!resp.data || resp.data.Status !== "Success") {
                    console.log("Incomplete EHR: no section counts for " + section.DisplayName, resp.data);
                    return null;
                }
                // the proc does not always answer a single screen filter with UniqueRecords, so its rows are summed instead
                if (resp.data.UniqueRecords) { return resp.data.UniqueRecords; }
                let totals = getEhrCounts(null);
                (resp.data.rows || []).forEach(function (row) { addEhrCounts(totals, row); });
                return totals;
            }, function () {
                console.log("Incomplete EHR: section call failed for " + section.DisplayName);
                return null;
            });
        })).then(function (results) {
            if (token !== ehrRequestToken) { return; }

            defined.forEach(function (section, index) {
                let box = _.find($scope.EhrDashboard.Sections, { "DisplayName": section.DisplayName });
                if (!box) { return; }
                box.HasCounts = !!results[index];
                angular.extend(box, getEhrCounts(results[index]));
            });

            setEhrSectionChartRows();
            setEhrDashboardSummary();
            renderEhrDashboardCharts();
        });
    }

    function loadEhrDashboardSections() {
        if ($scope.EhrDashboard.HasSectionRows) {
            $timeout(renderEhrDashboardCharts, 0);
            return;
        }
        $timeout(renderEhrDashboardCharts, 0);
        loadEhrSectionCounts();
    }

    function getEhrGrid() {
        if (ehrGridApi) { return ehrGridApi; }

        let gridDiv = document.getElementById("IncompleteEhrAgGrid");
        if (!gridDiv) { return null; }

        ehrGridApi = agGrid.createGrid(gridDiv, {
            "columnDefs": getEhrColumnDefs(),
            "rowData": [],
            "defaultColDef": {
                "sortable": false,
                "filter": false,
                "resizable": true,
                "suppressMovable": true,
                "suppressHeaderMenuButton": true
            },
            "animateRows": false,
            "getRowStyle": function (p) {
                return (p.data && p.data.IsTypeRow) ? { background: "#F5F5F5" } : null;
            },
            "onCellClicked": function (p) {
                if (!isEhrDrillCell(p)) { return; }
                $scope.$applyAsync(function () {
                    $scope.OpenIncompleteEhrDetails(p.data, p.colDef.field);
                });
            }
        });
        return ehrGridApi;
    }

    function buildEhrChart(chartRows) {
        let container = document.getElementById("IncompleteEhrBarChart");
        if (!container || typeof agCharts === "undefined") { return; }

        if (ehrChart) {
            ehrChart.destroy();
            ehrChart = null;
        }
        if (chartRows.length === 0) { return; }

        ehrChart = agCharts.AgCharts.create({
            "container": container,
            "data": chartRows.map(function (item) {
                return angular.extend({ "Name": item.Name }, getEhrCounts(item));
            }),
            "series": [
                { "type": "bar", "xKey": "Name", "yKey": "LessThan30Days", "yName": "< 30 days" },
                { "type": "bar", "xKey": "Name", "yKey": "MoreThan30Days", "yName": "≥ 30 days" },
                { "type": "bar", "xKey": "Name", "yKey": "Total", "yName": "Total" }
            ],
            "legend": { "position": "bottom" },
            "axes": [
                { "type": "category", "position": "bottom", "label": { "rotation": -45 } },
                { "type": "number", "position": "left" }
            ]
        });
    }

    $scope.OpenIncompleteEhrDetails = function (providerRow, bucket) {
        let request = getEhrRequest();
        if (!request) { return; }
        let reportScope = $scope;

        $uibModal.open({
            "templateUrl": "templates/ASC/ASCIncompleteEhrDetails.html",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "offcanves-right",
            "resolve": {
                "PObj": function () {
                    return {
                        "Provider": angular.copy(providerRow),
                        "Bucket": bucket,
                        "Request": request,
                        "Screens": angular.copy(_.where($scope.EhrSections.List, { isChecked: true }))
                    };
                }
            },
            "controller": ["$scope", "$uibModalInstance", "PObj", function ($scope, $uibModalInstance, PObj) {
                let detailsGridApi = null;
                let allDetailRows = [];
                let selectedScreens = PObj.Screens || [];

                $scope.ProviderRow = PObj.Provider || {};
                $scope.ActiveBucket = PObj.Bucket || "Total";
                $scope.EhrDetailsCount = 0;

                $scope.EhrBucketTabs = [
                    { "key": "LessThan30Days", "label": "< 30 days" },
                    { "key": "MoreThan30Days", "label": "≥ 30 days" },
                    { "key": "Total", "label": "All" }
                ];

                function screenKey(screen) {
                    return [screen.ScreenTypeId, screen.Screen, screen.UserType || ""].join("|");
                }

                $scope.close = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                function isPending(row, screen) {
                    return _.some((row && row.PendingScreens) || [], function (item) { return screenKey(item) === screenKey(screen); });
                }

                function boldTotalRow(p) {
                    return (p.node && p.node.rowPinned) ? { fontWeight: "700" } : null;
                }

                function getDetailColumnDefs() {
                    let flagColumn = function (header, getValue) {
                        return {
                            "headerName": header,
                            "width": 110,
                            "wrapHeaderText": true,
                            "autoHeaderHeight": true,
                            "type": "numericColumn",
                            "valueGetter": getValue,
                            "cellStyle": boldTotalRow
                        };
                    };

                    let columns = [
                        { "headerName": "Doctor", "field": "ProviderName", "width": 200, "pinned": "left", "cellStyle": boldTotalRow },
                        { "headerName": "Role", "field": "RoleName", "width": 130 },
                        { "headerName": "MR No", "field": "PatientDisplayId", "width": 120 },
                        { "headerName": "Patient Name", "field": "PatientName", "width": 180 },
                        { "headerName": "DOS", "field": "DOS", "width": 120 },
                        flagColumn("< 30 days", function (p) { return p.data.LessThan30Days || ""; }),
                        flagColumn("≥ 30 days", function (p) { return p.data.MoreThan30Days || ""; })
                    ];

                    selectedScreens.forEach(function (screen) {
                        columns.push(flagColumn(screen.DisplayName, function (p) {
                            if (p.node && p.node.rowPinned) { return p.data.ScreenTotals[screenKey(screen)] || 0; }
                            return isPending(p.data, screen) ? 1 : "";
                        }));
                    });

                    return columns;
                }

                function getDetailTotalRow(rows) {
                    let total = { "ProviderName": "Total", "LessThan30Days": 0, "MoreThan30Days": 0, "ScreenTotals": {} };
                    rows.forEach(function (row) {
                        total.LessThan30Days += Number(row.LessThan30Days) || 0;
                        total.MoreThan30Days += Number(row.MoreThan30Days) || 0;
                        selectedScreens.forEach(function (screen) {
                            let key = screenKey(screen);
                            total.ScreenTotals[key] = (total.ScreenTotals[key] || 0) + (isPending(row, screen) ? 1 : 0);
                        });
                    });
                    return [total];
                }

                function getBucketRows(bucket) {
                    return bucket === "Total" ? allDetailRows : allDetailRows.filter(function (row) { return Number(row[bucket]) === 1; });
                }

                $scope.LoadEhrDetails = function (bucket) {
                    $scope.ActiveBucket = bucket;
                    if (!detailsGridApi) { return; }

                    let rows = getBucketRows(bucket);
                    $scope.EhrDetailsCount = rows.length;
                    detailsGridApi.setGridOption("rowData", rows);
                    detailsGridApi.setGridOption("pinnedBottomRowData", rows.length > 0 ? getDetailTotalRow(rows) : []);
                };

                // queues the active tab as an export job; the screen names go along as the sheet's column headers
                $scope.ExportEhrDetails = function () {
                    if (getBucketRows($scope.ActiveBucket).length === 0) {
                        alertify.error("No data to export");
                        return;
                    }

                    let tab = _.findWhere($scope.EhrBucketTabs, { "key": $scope.ActiveBucket }) || {};
                    let request = angular.extend(getDetailsRequest(), {
                        "Screens": selectedScreens.map(function (item) {
                            return { "ScreenTypeId": item.ScreenTypeId, "Screen": item.Screen, "UserType": item.UserType, "DisplayName": item.DisplayName };
                        })
                    });
                    reportScope.ClickForIncompleteEhrDetailsExcelExport(request, $scope.ProviderRow, $scope.ActiveBucket, tab.label || "");
                };

                $scope.ExportEhrDetailsStatus = function () {
                    reportScope.IncompleteEhrExcelStatus(INCOMPLETE_EHR_DETAILS_EXPORT_REPORT_ID, INCOMPLETE_EHR_DETAILS_REPORT_NAME);
                };

                function getDetailsRequest() {
                    let providerId = Number($scope.ProviderRow.ProviderId) || 0;
                    let request = angular.extend({}, PObj.Request, { "ProviderId": providerId });
                    if (providerId > 0) { request.UserIds = String(providerId); }
                    return request;
                }

                function loadDetailRows() {
                    return eHnoteSurgeryService.GetIncompleteEhrDetailsReport(getDetailsRequest()).then(function (resp) {
                        if (!resp.data || resp.data.Status !== "Success") {
                            alertify.error((resp.data && resp.data.Message) || "Getting Incomplete EHR Records Failed");
                            return [];
                        }
                        return resp.data.rows || [];
                    }, function (err) {
                        console.log(err);
                        alertify.error("Getting Incomplete EHR Records Failed");
                        return [];
                    });
                }

                $uibModalInstance.rendered.then(function () {
                    let gridDiv = document.getElementById("IncompleteEhrDetailsAgGrid");
                    if (!gridDiv) { return; }

                    detailsGridApi = agGrid.createGrid(gridDiv, {
                        "columnDefs": getDetailColumnDefs(),
                        "rowData": [],
                        "defaultColDef": {
                            "sortable": true,
                            "filter": false,
                            "resizable": true,
                            "suppressMovable": true,
                            "suppressHeaderMenuButton": true
                        },
                        "animateRows": false
                    });

                    loadDetailRows().then(function (rows) {
                        allDetailRows = rows;
                        $scope.LoadEhrDetails($scope.ActiveBucket);
                    });
                });

                $scope.$on("$destroy", function () {
                    if (detailsGridApi) {
                        detailsGridApi.destroy();
                        detailsGridApi = null;
                    }
                });
            }]
        });
    };

    function getEhrRequest() {
        let filter = $scope.EhrFilter;
        let fromDate = "";
        let toDate = "";

        if (filter.DateRangeId !== 0) {
            let from = moment(filter.FromDate, "MM-DD-YYYY");
            let to = moment(filter.ToDate, "MM-DD-YYYY");
            if (!from.isValid() || !to.isValid()) {
                alertify.error("Please select From and To dates");
                return null;
            }
            if (from.isAfter(to)) {
                alertify.error("From date should not be greater than To date");
                return null;
            }
            fromDate = from.format("MM-DD-YYYY");
            toDate = to.format("MM-DD-YYYY");
        }

        let unselectedGroup = _.find([$scope.EhrLocations, $scope.EhrRoles, $scope.EhrProfessionals, $scope.EhrSections], function (group) {
            return group.List.length > 0 && !_.findWhere(group.List, { isChecked: true });
        });
        if (unselectedGroup) {
            alertify.error("Please select at least one " + unselectedGroup.Title);
            return null;
        }

        return {
            "ParentOrganizationId": $scope.ParentHospitalID,
            "AllLocationInd": 0,
            "LocationId": getEhrCheckedIds($scope.EhrLocations, "ClinicId") || String($scope.HospitalID),
            "RoleIds": getCheckedEhrRoleIds().join(","),
            "UserIds": getEhrCheckedIds($scope.EhrProfessionals, "DoctorID"),
            "Screens": _.where($scope.EhrSections.List, { isChecked: true }).map(function (item) {
                return { "ScreenTypeId": item.ScreenTypeId, "Screen": item.Screen, "UserType": item.UserType };
            }),
            "StartDate": fromDate,
            "EndDate": toDate,
            "PageSize": 1000,
            "PageNumber": 1
        };
    }

    $scope.GetIncompleteEhrSummary = function () {
        let params = getEhrRequest();
        if (!params) { return; }

        let gridApi = getEhrGrid();
        if (!gridApi) { return; }

        let requestToken = ++ehrRequestToken;
        gridApi.setGridOption("rowData", []);
        gridApi.setGridOption("pinnedBottomRowData", []);

        function showSummary(data) {
            let rows = data.rows || [];
            let gridRows = getEhrProfessionalRows(rows);
            let pinnedRows = rows.length > 0 ? getEhrPinnedRows(rows, data.UniqueRecords) : [];
            gridApi.setGridOption("rowData", gridRows);
            gridApi.setGridOption("pinnedBottomRowData", pinnedRows);
            buildEhrChart(gridRows.concat(pinnedRows));
            buildEhrDashboard(rows, data.UniqueRecords, data.SectionRows);
        }

        eHnoteSurgeryService.GetIncompleteEhrSummaryReport(params).then(function (resp) {
            // a slower earlier request must not overwrite a newer one
            if (requestToken !== ehrRequestToken) { return; }

            if (!resp.data || resp.data.Status !== "Success") {
                alertify.error((resp.data && resp.data.Message) || "Getting Incomplete EHR Records Failed");
                return;
            }
            showSummary(resp.data);
        }, function (err) {
            if (requestToken !== ehrRequestToken) { return; }
            console.log(err);
            alertify.error("Getting Incomplete EHR Records Failed");
        });
    };

    var INCOMPLETE_EHR_EXPORT_REPORT_ID = 18;
    var INCOMPLETE_EHR_REPORT_NAME = "Incomplete EHR Records";
    var INCOMPLETE_EHR_DETAILS_EXPORT_REPORT_ID = 19;
    var INCOMPLETE_EHR_DETAILS_REPORT_NAME = "Incomplete EHR Details";

    $scope.ExportSummarylist = [];

    $scope.ClickForIncompleteEhrExcelExport = function () {
        let request = getEhrRequest();
        if (!request) { return; }
        startIncompleteEhrExport(eHnoteInsuranceService.InitiateIncompleteEhrReportCSVData, INCOMPLETE_EHR_EXPORT_REPORT_ID,
            INCOMPLETE_EHR_REPORT_NAME, request);
    };

    // called from the details popup - the clicked doctor and the active tab travel in RequestDetails;
    // the API adds the period to the name, so it is not added here
    $scope.ClickForIncompleteEhrDetailsExcelExport = function (request, providerRow, bucket, bucketLabel) {
        let reportName = INCOMPLETE_EHR_DETAILS_REPORT_NAME + " - " + (providerRow.Name || "") + " - " + bucketLabel;
        startIncompleteEhrExport(eHnoteInsuranceService.InitiateIncompleteEhrDetailsReportCSVData, INCOMPLETE_EHR_DETAILS_EXPORT_REPORT_ID,
            reportName, angular.extend({}, request, { "Bucket": bucket }));
    };

    function startIncompleteEhrExport(initiate, reportId, reportName, request) {
        let from = moment(request.StartDate, "MM-DD-YYYY");
        let to = moment(request.EndDate, "MM-DD-YYYY");
        let isShortRange = from.isValid() && to.isValid() && to.diff(from, "days") <= 7;

        let obj = {
            "ExportJobId": 0,
            "UserId": $scope.UserId,
            "RequestedByUserId": $scope.UserId,
            "RequestedByUserName": (doctorInfo.doctordata.User[0].FullName || ""),
            "OrganizationId": $scope.HospitalID,
            "ParentOrganizationId": $scope.ParentHospitalID,
            "ReportName": reportName,
            "ReportId": reportId,
            "StatusId": 1,
            "StatusName": "Pending",
            "IsManualExport": true,
            "CSVFileName": "",
            "CSVFileExt": ".xlsx",
            "CSVFileUrl": null,
            "ErrorMessage": null,
            "StartedOn": new Date(),
            "CompletedOn": null,
            "DeleteInd": "N",
            "RequestType": isShortRange ? "Immediate" : "TaskRun",
            "RequestDetails": angular.extend({}, request, {
                "DateRangeId": $scope.EhrFilter.DateRangeId,
                "LocationName": $scope.EhrLocations.SelectedText
            })
        };

        initiate(obj).then(function (resp) {
            if (resp.data && resp.data.status == "Success") {
                alertify.success("Excel export started - check the download list for the file.");
            } else {
                alertify.error((resp.data && resp.data.Message) || "Excel Export Failed");
            }
        }, function (err) {
            console.log(err);
            alertify.error("Excel Export Failed");
        });
    }

    $scope.GetReportExportStatusList = function (activeMasterReportId) {
        let obj = {
            "OrganizationId": $scope.HospitalID,
            "RequestedByUserId": $scope.UserId,
            "FromDate": "",
            "ToDate": "",
            "PageSize": 100,
            "PageNumber": 1,
            "StatusId": 0,
            "ReportId": activeMasterReportId
        };

        return eHnoteInsuranceService.GetReportExportJobsStatusList(obj).then(function (resp) {
            if (resp.data && resp.data.status == "Success") {
                $scope.ExportSummarylist = (resp.data.rows || []).filter(function (item) {
                    return Number(item.MasterReportId) === Number(activeMasterReportId);
                });
            } else {
                alertify.error((resp.data && resp.data.Message) || "Getting Excel Exports Failed");
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting Excel Exports Failed");
        });
    };

    // refreshes every 5 seconds while a job is still Pending / Running, so the status and Download link update on their own
    $scope.IncompleteEhrExcelStatus = function (reportId, reportName) {
        reportId = reportId || INCOMPLETE_EHR_EXPORT_REPORT_ID;
        $scope.ExcelReportsObj = { "ReportId": reportId, "ReportName": reportName || INCOMPLETE_EHR_REPORT_NAME };
        $scope.ExportSummarylist = [];

        $uibModal.open({
            "templateUrl": "templates/USBilling/uibpopups/excelExport.html",
            "backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "modal__seventy--",
            "controller": ["$scope", "$uibModalInstance", "$timeout", function ($scope, $uibModalInstance, $timeout) {
                let refreshTimer = null;

                function refresh() {
                    $scope.GetReportExportStatusList(reportId).then(function () {
                        let inProgress = _.some($scope.ExportSummarylist, function (item) { return Number(item.StatusId) === 1 || Number(item.StatusId) === 2; });
                        if (inProgress) { refreshTimer = $timeout(refresh, 5000); }
                    });
                }
                refresh();

                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };
                $scope.$on("$destroy", function () {
                    if (refreshTimer) { $timeout.cancel(refreshTimer); }
                });
            }]
        });
    };

    $scope.ResetIncompleteEhrFilters = function () {
        resetEhrFilters();
        $scope.GetIncompleteEhrSummary();
    };

    $scope.$on("$destroy", function () {
        if (ehrGridApi) {
            ehrGridApi.destroy();
            ehrGridApi = null;
        }
        if (ehrChart) {
            ehrChart.destroy();
            ehrChart = null;
        }
    });

    $scope.InitIncompleteEhrReport = function () {
        resetEhrFilters();
        loadEhrRoleIds().then(loadEhrProfessionals).then(function () {
            $scope.EhrRoles = getEhrFilterGroup("Role", angular.copy(EhrRoles));
            buildEhrProfessionalsGroup();
            $scope.GetIncompleteEhrSummary();
        });
    };

    $scope.InitIncompleteEhrReport();

}]);

eHnoteWebApp.controller("UsDenialSummuryCntrl", ["$scope", "$rootScope", "alertify", "$filter", "$q", "eHnoteMasterDataService", "eHnoteSettingsDataService", "datapersistanceFactory", "eHnoteCacheStorageService", "localStorageFactory", "eHnoteUserAppointmentDataService", "eHnoteMainAppointmentService", "eHnoteInsuranceService", "eHnoteMainAdminServices", "$uibModal", "eHnoteConditionsDataService", "eHnotePatientDataService", "eHnoteUserDataService", "eHnoteDiagnosisDataServices", "eHnoteLoginStatusService", "eHnoteAuditServices", "eHnoteReferalDataService", "$uibModal", "$http", "$sce", "eHnotePrintService", "$timeout", "$routeParams", "$location", "eHnotePatientAddressDataServices",
    function ($scope, $rootScope, alertify, $filter, $q, eHnoteMasterDataService, eHnoteSettingsDataService, datapersistanceFactory, eHnoteCacheStorageService, localStorageFactory, eHnoteUserAppointmentDataService, eHnoteMainAppointmentService, eHnoteInsuranceService, eHnoteMainAdminServices, $uibModal, eHnoteConditionsDataService, eHnotePatientDataService, eHnoteUserDataService, eHnoteDiagnosisDataServices, eHnoteLoginStatusService, eHnoteAuditServices, eHnoteReferalDataService, $uibModal, $http, $sce, eHnotePrintService, $timeout, $routeParams, $location, eHnotePatientAddressDataServices) {
        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.SpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;
        $scope.DoctorId = $scope.doctorinfo.doctordata.User[0].DoctorID;
        $scope.GetAllIndicator = 0;
        $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        $scope.HospitalId = 0;
        $scope.ParentHospitalId = 0;
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
            && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }
        var addrExt = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails;
        if (addrExt.HospitalInfo && addrExt.HospitalInfo.HospitalCode && addrExt.HospitalInfo.HospitalID) {
            $scope.HospitalId = addrExt.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = addrExt.HospitalInfo.ParentHospitalID;
        }

        // ══════════════════════════════════════════════════════════════
        //  STATIC DATA  (replace these arrays with API calls later)
        // ══════════════════════════════════════════════════════════════

        var TODAY = new Date('2026-04-09');
        var DENIAL_CODES = ['CO-4', 'CO-97', 'N290', 'M15', 'CO-16', 'OA-23', 'PR-96', 'N30', '234', 'CO-18'];
        var PROVIDERS = ['Tim Ehn', 'Nayda Vega Perez', 'Adriana Hernandez', 'INSTITUTO ASC', 'Luis Colon'];
        var FNAMES = ['James', 'Susan', 'Carlos', 'Diana', 'Rachel', 'Brian', 'Gary', 'Nina', 'Paul', 'Fiona', 'David', 'Rosa', 'Maria', 'John', 'Ana'];
        var LNAMES = ['Howell', 'Patel', 'Ruiz', 'Foster', 'Kim', 'Okafor', 'Brown', 'Shah', 'Winters', 'Grant', 'Ortega', 'Mendez', 'Garcia', 'Smith', 'Lopez'];

        var PAYER_DEFS = [
            { name: 'Triple-S', win: 120 },
            { name: 'Medicare', win: 120 },
            { name: 'Medicaid', win: 90 },
            { name: 'BlueCross BlueShield', win: 180 },
            { name: 'Aetna', win: 90 },
            { name: 'UnitedHealth', win: 120 },
            { name: 'Cigna', win: 60 },
            { name: 'Humana', win: 90 },
            { name: 'MMM Healthcare', win: 90 },
            { name: 'AHM-TS', win: 120 },
            { name: 'GHP – MMM Multihealth', win: 90 },
            { name: 'American Health Medicare', win: 120 },
            { name: 'MCS', win: 60 },
            { name: 'First Medical', win: 90 },
            { name: 'Menonita', win: 120 },
            { name: 'Molina Healthcare', win: 90 },
            { name: 'WellCare', win: 60 },
            { name: 'Anthem', win: 180 },
            { name: 'Centene', win: 90 },
            { name: 'Oscar Health', win: 120 },
        ];

        // Seeded pseudo-random so data is stable across renders
        var _seed = 42;
        function sr() { _seed = (_seed * 16807) % 2147483647; return (_seed - 1) / 2147483646; }
        function rnd(a, b) { return Math.floor(sr() * (b - a + 1)) + a; }
        function pick(arr) { return arr[Math.floor(sr() * arr.length)]; }
        function addDays(d, n) { var r = new Date(d); r.setDate(r.getDate() + n); return r; }
        function diffDays(a, b) { return Math.round((a - b) / 86400000); }
        function fmtDate(d) {
            return ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
                ('0' + d.getDate()).slice(-2) + '-' + d.getFullYear();
        }

        // Generate claim records
        var ALL_CLAIMS = [];
        var _id = 20000;
        PAYER_DEFS.forEach(function (p) {
            var n = rnd(3, 8);
            for (var i = 0; i < n; i++) {
                var daysAgo = rnd(5, p.win + 15);
                var denialDate = addDays(TODAY, -daysAgo);
                var deadline = addDays(denialDate, p.win);
                var daysLeft = diffDays(deadline, TODAY);
                var pct = Math.min(100, Math.max(0, Math.round(((p.win - daysLeft) / p.win) * 100)));
                var bucket = daysLeft > 30 ? 'g' : daysLeft >= 2 ? 'y' : daysLeft === 1 ? 'o' : 'r';
                var billed = rnd(80, 500) + 0.99;
                var insPayment = daysLeft < 0 ? 0 : Math.round(billed * rnd(20, 60) / 100 * 100) / 100;
                var insBalance = Math.round((billed - insPayment) * 100) / 100;
                var numCodes = rnd(1, 4);
                var shuffled = DENIAL_CODES.slice().sort(function () { return sr() - 0.5; });
                _id++;
                ALL_CLAIMS.push({
                    id: _id,
                    payor: p.name,
                    win: p.win,
                    patient: pick(FNAMES) + ' ' + pick(LNAMES),
                    claimNo: 'IC-' + String(_id).padStart(7, '0'),
                    mrNo: 'MR' + rnd(100000, 999999),
                    codes: shuffled.slice(0, numCodes),
                    dos: fmtDate(addDays(denialDate, -rnd(1, 10))),
                    denialDate: fmtDate(denialDate),
                    provider: pick(PROVIDERS),
                    billed: billed,
                    insPayment: insPayment,
                    insBalance: insBalance,
                    daysLeft: daysLeft,
                    pct: pct,
                    bucket: bucket,
                    status: 'ERA Denied'
                });
            }
        });

        // Per-payer stats
        function pStats(name) {
            var pc = ALL_CLAIMS.filter(function (c) { return c.payor === name; });
            return {
                total: pc.length,
                g: pc.filter(function (c) { return c.bucket === 'g'; }).length,
                y: pc.filter(function (c) { return c.bucket === 'y'; }).length,
                o: pc.filter(function (c) { return c.bucket === 'o'; }).length,
                r: pc.filter(function (c) { return c.bucket === 'r'; }).length,
                billed: pc.reduce(function (s, c) { return s + c.billed; }, 0),
                ins: pc.reduce(function (s, c) { return s + c.insBalance; }, 0)
            };
        }

        // ══════════════════════════════════════════════════════════════
        //  SCOPE STATE
        // ══════════════════════════════════════════════════════════════

        $scope.searchPayer = '';
        $scope.winFilter = '';   // '' | '60' | '90' | '120' | '180'
        $scope.bucketFilter = '';   // '' | 'g'  | 'y'  | 'o'  | 'r'

        // Summary cards
        $scope.summaryCards = [];

        //$scope.buildSummaryCards = function () {
        //    var all = $scope.visiblePayers.reduce(function (arr, p) {
        //        return arr.concat(ALL_CLAIMS.filter(function (c) { return c.payor === p.name; }));
        //    }, []);
        //    $scope.summaryCards = [
        //        { key: 'g', label: 'On track', sublabel: '>30 days', count: all.filter(function (c) { return c.bucket === 'g'; }).length },
        //        { key: 'y', label: 'Due soon', sublabel: '2–30 days', count: all.filter(function (c) { return c.bucket === 'y'; }).length },
        //        { key: 'o', label: 'Due date', sublabel: '1 day left', count: all.filter(function (c) { return c.bucket === 'o'; }).length },
        //        { key: 'r', label: 'Overdue', sublabel: 'Deadline passed', count: all.filter(function (c) { return c.bucket === 'r'; }).length }
        //    ];
        //};

        // Payer table
        //$scope.PAGE_SIZE = 20;
        //$scope.payerPage = 1;
        //$scope.visiblePayers = PAYER_DEFS.slice();
        $scope.payerRows = [];

        //$scope.buildPayerRows = function () {
        //    var start = ($scope.payerPage - 1) * $scope.PAGE_SIZE;
        //    var slice = $scope.visiblePayers.slice(start, start + $scope.PAGE_SIZE);
        //    $scope.payerRows = slice.map(function (p, i) {
        //        var s = pStats(p.name);
        //        return {
        //            sno: start + i + 1, name: p.name, win: p.win,
        //            total: s.total, g: s.g, y: s.y, o: s.o, r: s.r,
        //            billed: s.billed, ins: s.ins
        //        };
        //    });
        //};

        // Footer totals
        $scope.footerPayers = function () { return $scope.visiblePayers.length; };
        $scope.footerBilled = function () {
            return $scope.visiblePayers.reduce(function (s, p) { return s + pStats(p.name).billed; }, 0);
        };
        $scope.footerIns = function () {
            return $scope.visiblePayers.reduce(function (s, p) { return s + pStats(p.name).ins; }, 0);
        };

        // Payer pagination
        //$scope.payerRangeStart = function () { return ($scope.payerPage - 1) * $scope.PAGE_SIZE + 1; };
        //$scope.payerRangeEnd = function () { return Math.min($scope.payerPage * $scope.PAGE_SIZE, $scope.visiblePayers.length); };
        //$scope.payerHasPrev = function () { return $scope.payerPage > 1; };
        //$scope.payerHasNext = function () { return $scope.payerPage * $scope.PAGE_SIZE < $scope.visiblePayers.length; };
        //$scope.payerPrev = function () { if ($scope.payerHasPrev()) { $scope.payerPage--; $scope.buildPayerRows(); } };
        //$scope.payerNext = function () { if ($scope.payerHasNext()) { $scope.payerPage++; $scope.buildPayerRows(); } };

        // Drill (bottom sheet)
        $scope.activeDrill = null;
        $scope.drillClaims = [];
        $scope.claimPage = 1;
        $scope.claimRows = [];

        var BUCKET_LABELS = { g: 'On track (>30 days)', y: 'Due soon (2–30 days)', o: 'Due date (1 day left)', r: 'Overdue' };

 

        $scope.closeDrill = function () {
            $scope.activeDrill = null;
            $scope.drillClaims = [];
            $scope.claimRows = [];
        //    $scope.buildPayerRows();
        };

        $scope.buildClaimRows = function () {
            var start = ($scope.claimPage - 1) * $scope.PAGE_SIZE;
            $scope.claimRows = $scope.drillClaims.slice(start, start + $scope.PAGE_SIZE);
        };

      

        // ── Filters ──────────────────────────────────────────────────────────────
        $scope.applyFilters = function () {
            var search = ($scope.searchPayer || '').toLowerCase();
            var win = $scope.winFilter;
            var bucket = $scope.bucketFilter;
            $scope.visiblePayers = PAYER_DEFS.filter(function (p) {
                if (search && p.name.toLowerCase().indexOf(search) === -1) return false;
                if (win && String(p.win) !== win) return false;
                if (bucket && pStats(p.name)[bucket] === 0) return false;
                return true;
            });
            $scope.payerPage = 1;
            if ($scope.activeDrill) $scope.closeDrill();
            //$scope.buildPayerRows();
            //$scope.buildSummaryCards();
        };

        // ── Display helpers ───────────────────────────────────────────────────────
        $scope.fmt = function (val) {
            if (!val && val !== 0) return '$0.00';
            return '$' + parseFloat(val).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };

        $scope.daysText = function (c) {
            if (c.daysLeft > 1) return c.daysLeft + 'd left';
            if (c.daysLeft === 1) return '1 day left';
            if (c.daysLeft === 0) return 'Today';
            return Math.abs(c.daysLeft) + 'd overdue';
        };

        var BG_COLOR = { g: '#EAF3DE', y: '#FAEEDA', o: '#FEF3E2', r: '#FCEBEB' };
        var TXT_COLOR = { g: '#3B6D11', y: '#854F0B', o: '#7A4400', r: '#A32D2D' };
        var BAR_COLOR = { g: '#639922', y: '#BA7517', o: '#D4730A', r: '#E24B4A' };

        $scope.bucketStyle = function (b) {
            return { 'background': BG_COLOR[b], 'color': TXT_COLOR[b] };
        };
        $scope.barStyle = function (c) {
            return { 'width': c.pct + '%', 'background': BAR_COLOR[c.bucket] };
        };
        $scope.dotCls = function (b) { return 'dot-' + b; };
        $scope.cardCls = function (b) { return 'df-card df-card-' + b; };
        $scope.txtCls = function (b) { return 'dfc-' + b; };

        $scope.isActiveDrill = function (name, bucket) {
            return $scope.activeDrill && $scope.activeDrill.payor === name && $scope.activeDrill.bucket === bucket;
        };
        $scope.isActiveRow = function (name) {
            return !!($scope.activeDrill && $scope.activeDrill.payor === name);
        };

        // Denial codes
        $scope.visibleCodes = function (codes) { return (codes || []).slice(0, 2); };
        $scope.extraCount = function (codes) { return (codes || []).length > 2 ? (codes.length - 2) : 0; };
        $scope.extraTooltip = function (codes) { return 'Denial Codes: ' + (codes || []).slice(2).join(', '); };

        // ── Action stubs ─────────────────────────────────────────────────────────
        // Replace alertify.message() with $uibModal.open() calls in next phase
        $scope.openAdjRequest = function (c) { alertify.message('Adjustment Request: ' + c.claimNo); };
        $scope.openClaimLifecycle = function (c) { alertify.message('Claim Lifecycle: ' + c.claimNo); };
        $scope.viewClaimSummary = function (c) { alertify.message('Claim Summary: ' + c.claimNo); };
        $scope.viewPatientDetails = function (c) { alertify.message('Patient: ' + c.patient); };
        $scope.openGeneralNotes = function (c) { alertify.message('Notes: ' + c.claimNo); };
        $scope.openAlert = function (c) { alertify.message('Alert: ' + c.claimNo); };
        $scope.exportToExcel = function () { alertify.message('Exporting to Excel…'); };
        $scope.printSheet = function () { window.print(); };

        // ── Init ─────────────────────────────────────────────────────────────────
        //$scope.buildSummaryCards();
        //$scope.buildPayerRows();



        $scope.GetDenialSummurySearchObject = function () {
            var obj = {
                "PayorObj": null,
                "FromDate": moment().subtract(120, 'days').format('MM-DD-YYYY')||null,
                "ToDate": moment().format('MM-DD-YYYY')||null,
                "DepositFromDate": null,
                "DepositToDate": null,
                "DepositStatusId": "",
                "OrganizationBillingProviderId": "",
                "BillPaymentTypeId": "",
                "AppliedStatusId": "",
                "ReferenceNumber": "",
                "SortByName": "",
                "SortById": null,
                "PaymentMethodId": "",
                "PostingPaymentTab": 1,
                "ProcessingTypeId": 0,
                "PaymentStatusId": 0,
                "PageNumber": 1,
                "PageSize": 100,
                AdjustmentFilingDays: null
            }
            return obj;
        }

        $scope.DenialSearchObj = $scope.GetDenialSummurySearchObject();
        $scope.GetOrganizationNewPayorAllList = function (val) {

            var param = {
                "SearchText": val || "",
                "Status": "Active",
                "PageSize": 10,
                "PageNumber": 1,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "OrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "ParentOrganizationId": $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "GetAllIndicator": 0,
                "PayorId": 0,
                "PayorTypeId": 0
            };
            return eHnoteInsuranceService.GetOrganizationInsurancePayorsList(param).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.rows !== undefined) {
                        return resp.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            }, function (error) {
                console.log(error);
            });
        };
        $scope.payerPrev = function () {
            if ($scope.DenialSearchObj.PageNumber > 1) {
                $scope.DenialSearchObj.PageNumber--;
                $scope.GetOrganizationDenialSummuryClaimlist(1, 'Denial');
            }
        };

        $scope.payerNext = function () {
            if ($scope.hasNextPage) {
                $scope.DenialSearchObj.PageNumber++;
                $scope.GetOrganizationDenialSummuryClaimlist(1, 'Denial');
            }
        };
        $scope.payerRow = [];
        $scope.filterObj = {
            status: null,   // 'onTrack' | 'dueSoon' | 'dueDate' | 'overdue' | null
            adjWindow: null    // 60 | 90 | 120 | 180 | null
        };
        $scope.GetOrganizationDenialSummuryClaimlist = function (Id, status, Pgno) {
            Pgno = Pgno || 1;
            var f = $scope.filterObj;

          
            var TempAddress = $filter("filter")($scope.ClaimLocationList, function (iterator, ind) { return iterator.ClinicId !== 0 && iterator.IsChecked; });
            var HospitalIDs = _.pluck(TempAddress, "BranchId").join(",");
            let obj = {
                "OrganizationId": $scope.HospitalId,
                "FromDate": $scope.DenialSearchObj.FromDate||null,
                "ToDate": $scope.DenialSearchObj.ToDate||null,
                "PayorId": $scope.DenialSearchObj.PayorId||0,
               
                "Locationids": HospitalIDs,
                //"AdjustmentFilingDays": $scope.DenialSearchObj.AdjustmentFilingDays||120,
                "StatusId": $scope.DenialSearchObj.StatusId ||1,/*(ontrack, duesoon,)  */              // "PageSize": 100,
                "PageSize": $scope.DenialSearchObj.PageSize,
                "PageNumber": $scope.DenialSearchObj.PageNumber || Pgno,
                "AdjWindowDays": f.adjWindow || null,
                "onTrack": f.status === 'onTrack',
                "dueSoon": f.status === 'dueSoon',
                "dueDate": f.status === 'dueDate',
                "overdue": f.status === 'overdue',
            }
            eHnoteInsuranceService.GetOrganizationDenialSummuryClaimlist(obj).then(function (resp) {
                $scope.payerRow = [];
                $scope.TotalClaimsCount = 0;
                $scope.TotalOntrackClaimsCount = 0;
                $scope.TotalDuesoonClaimsCount = 0;
                $scope.TotalDueDateclaimsCOunt = 0;
                $scope.TotalOverdueclaimsCount = 0;
                $scope.TotalBilledAmount = 0;
                $scope.TotalInsuranceBalance = 0;
                if (resp.data.status === "Success") {
                    var total = resp.data.count || 0;
                    var pageSize = $scope.DenialSearchObj.PageSize;
                    var pageNo = $scope.DenialSearchObj.PageNumber;

                    $scope.hasNextPage = pageNo * pageSize < total;
                    $scope.payerRow = resp.data.rows || [];

                    $scope.TotalClaimsCount = resp.data.count || 0;
                    $scope.TotalOntrackClaimsCount = resp.data.TotalOntrackClaimsCount || 0;
                    $scope.TotalDuesoonClaimsCount = resp.data.TotalDuesoonClaimsCount || 0;
                    $scope.TotalDueDateclaimsCOunt = resp.data.TotalDueDateclaimsCOunt || 0;
                    $scope.TotalOverdueclaimsCount = resp.data.TotalOverdueclaimsCount || 0;
                    $scope.TotalBilledAmount = resp.data.TotalBilledAmount || 0;
                    $scope.TotalInsuranceBalance = resp.data.TotalInsuranceBalance || 0;
                }

               
            });
        }
        $scope.GetOrganizationDenialSummuryClaimlist(1, 'Denial');
        $scope.ChangeInsurancePayor = function (obj) {

   
            $scope.DenialSearchObj.PayorId = obj.PayorId;
        }
        $scope.drill = function (row, bucket) {
            // Toggle off same cell
            if ($scope.activeDrill && $scope.activeDrill.payor === row.MasterPayorName && $scope.activeDrill.bucket === bucket) {
                $scope.closeDrill(); return;
            }
            
            $scope.ClaimPagination.PageNumber = 1;
            $scope.ClaimPagination.AdjustmentFilingDays = row.adjWindow || null;
            $scope.activeDrill = {
                payor: row.MasterPayorName,
                payorId: row.MasterPayorId,   // 🔥 ADD THIS
                bucket: bucket,
                label: row.MasterPayorName + ' · ' + BUCKET_LABELS[bucket]
            };
            $scope.GetOrganizationDenialClaimlistDetails(row, bucket, 'Denial');

        
        };
        $scope.ClaimPagination = {
            PageNumber: 1,
            PageSize: 100
        };
        $scope.ClaimLocationList = [];
        $scope.ClaimProviderList = [];
        $scope.DenailClaimdetails = [];
        $scope.ClaimProviderList = $scope.mainBillerDataObj.BillingProviderList || [];
        $scope.ClaimLocationList = angular.copy($scope.mainBillerDataObj.AllBranchesList);
        $scope.GetOrganizationDenialClaimlistDetails = function (item, bucket, Type) {

            var TempAddress = $filter("filter")($scope.ClaimLocationList, function (iterator, ind) { return iterator.ClinicId !== 0 && iterator.IsChecked; });
            var HospitalIDs = _.pluck(TempAddress, "BranchId").join(",");
            $scope.PayorName = item.MasterPayorName;
            //$scope.ClaimdetailsObj.PayorId = item.MasterPayorId;
            ////$scope.ClaimdetailsObj.Range = range;
            //$scope.ClaimdetailsObj.Type = Type;

            var flags = {
                onTrack: false,
                dueSoon: false,
                dueDate: false,
                overdue: false
            };
            if (bucket === 'g') flags.onTrack = true;
            if (bucket === 'y') flags.dueSoon = true;
            if (bucket === 'o') flags.dueDate = true;
            if (bucket === 'r') flags.overdue = true;
            let obj = {
                "OrganizationId": $scope.SearchAckmtObj.OrganizationId,
                "FromDate": $scope.DenialSearchObj.FromDate,
                "ToDate": $scope.DenialSearchObj.ToDate,
                "Locationids": HospitalIDs,
                "UserId": 0,
                // "PayorId": $scope.SearchAckmtObj.PayorId,
                "PayorId": item.MasterPayorId,
                "PageSize": $scope.ClaimPagination.PageSize,
                "PageNumber": $scope.ClaimPagination.PageNumber,
                "OnTrack": flags.onTrack||false,
                "Overdue": flags.overdue ||false,
                "DueSoon": flags.dueSoon ||false,
                "DueDate": flags.dueDate ||false,
            }


            eHnoteInsuranceService.GetOrganizationDenialClaimlistDetails(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    $scope.DenailClaimdetails = resp.data.rows || [];
                    $scope.DenailClaimdetailsCount = resp.data.count || 0;
                    $scope.ClaimsTotalAmount = resp.data.TotalClaimAmount || 0;
                    $scope.ClaimsInsuranceBalance = resp.data.TotalInsuranceBalance || 0;
                    //$scope.ClaimdetailsObj.Count = resp.data.Count || 0;
                    //if ($scope.RejctedClaimdetails.length > 0) {
                    //    let amount = 0;
                    //    angular.forEach($scope.RejctedClaimdetails, function (item) {
                    //        item.isOpen = false;
                    //        amount += item.TotalClaimAmount;
                    //    });
                    //    $scope.ClaimdetailsObj.TotalAmount = amount;
                    //}
                    angular.forEach($scope.DenailClaimdetails, function (c) {
                        c._denialCodesDisplay = (c.ClaimDenials || []).map(function (dc) {
                            return  dc.DenialCode;
                        });
                    });
                    let page = $scope.ClaimPagination.PageNumber;
                    let size = $scope.ClaimPagination.PageSize;
                    let total = $scope.DenailClaimdetailsCount;

                    $scope.claimStart = total === 0 ? 0 : ((page - 1) * size) + 1;
                    $scope.claimEnd = Math.min(page * size, total);

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }
        $scope.claimHasPrev = function () {
            return $scope.ClaimPagination.PageNumber > 1;
        };

        $scope.claimHasNext = function () {
            return $scope.ClaimPagination.PageNumber * $scope.ClaimPagination.PageSize < $scope.DenailClaimdetailsCount;
        };

        $scope.claimPrev = function () {
            if ($scope.claimHasPrev()) {
                $scope.ClaimPagination.PageNumber--;
                $scope.GetOrganizationDenialClaimlistDetails(
                    { MasterPayorId: $scope.activeDrill.payorId },
                    $scope.activeDrill.bucket,
                    'Denial'
                );
            }
        };

        $scope.claimNext = function () {
            if ($scope.claimHasNext()) {
                $scope.ClaimPagination.PageNumber++;
                $scope.GetOrganizationDenialClaimlistDetails(
                    { MasterPayorId: $scope.activeDrill.payorId },
                    $scope.activeDrill.bucket,
                    'Denial'
                );
            }
        };
        $scope.getAdjDays = function (c) {
           // var windowDays =  $scope.ClaimPagination.AdjustmentFilingDays || 0;
           // var used = c.AdjustmentDays || 0;
           // return windowDays - used;
return Math.max(c.AdjustmentDays || 0, 0);
        };

        $scope.getAdjPercent = function (c) {
            var windowDays = $scope.ClaimPagination.AdjustmentFilingDays || 0;
            var used = c.AdjustmentDays || 0;

            return Math.min((used / windowDays) * 100, 100);
        };
        $scope.getAdjClass = function (daysLeft) {
            if (daysLeft > 30) return 'green';
            if (daysLeft > 10) return 'yellow';
            return 'red';
        };
        $scope.HospitalAddressArray = [];
        if (doctorinfo.doctordata.UserAddress[0] !== undefined) {
            $scope.HospitalAddressArray = doctorinfo.doctordata.UserAddress[0];
        }
        $scope.ClickForPrintdData = function () {


            $scope.PrintRejctedClaimdetails = angular.copy($scope.DenailClaimdetails);

            $timeout(function () {
                var innerContents = document.getElementById('ClaimAgingReport').innerHTML;
                var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                //  popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.write(`<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint"> ${innerContents}</body></html>`);
                popupWinindow.document.close();
            }, 500);

        }
        $scope.toDataURL = function (dataURL, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var reader = new FileReader();
                reader.onloadend = function () {
                    callback(reader.result);
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', dataURL);
            xhr.responseType = 'blob';
            xhr.send();
        };
        $scope.HospitalAddressArray.OrganizationLogoUrl = $scope.HospitalAddressArray.OrganizationLogoUrl || '';
        if ($scope.HospitalAddressArray.OrganizationLogoUrl != '') {
            $scope.toDataURL($scope.HospitalAddressArray.OrganizationLogoUrl, function (dataURL) {
                $scope.HospitalAddressArray.OrganizationBase64 = dataURL;
            });
        }
        $scope.extraDenialTooltip = function (denials) {
            return (denials || []).slice(2)
                .map(function (dc) { return  dc.DenialCode; })
                .join(', ');
        };
        $scope.refreshAllClaimDetails = function (tab) {
            $scope.DenialSearchObj = $scope.GetDenialSummurySearchObject();

            $scope.ClaimPagination = {
                PageNumber: 1,
                PageSize: 100
            };
            $scope.filterObj = { status: null, adjWindow: null };

            $scope.payerRow = [];
            $scope.ClaimLocationList = [];
            $scope.ClaimProviderList = [];
            $scope.DenailClaimdetails = [];
            $scope.activeDrill = null;
            $scope.GetOrganizationDenialSummuryClaimlist(1, 'Denial');

            angular.element(document.querySelector('.popover')).remove();
        }
        $scope.closeFilterPopover = function () {
            $scope._closePopover = true;
            $timeout(function () { $scope._closePopover = false; }, 100);
            angular.element(document.querySelector('.popover')).remove();
        };
        $scope.toggleAllStatus = function () {
            var v = $scope.filterObj._allStatus;
            $scope.filterObj.onTrack = v;
            $scope.filterObj.dueSoon = v;
            $scope.filterObj.dueDate = v;
            $scope.filterObj.overdue = v;
        };

        $scope.toggleAllWindows = function () {
            var v = $scope.filterObj._allWindows;
            $scope.filterObj.win60 = v;
            $scope.filterObj.win90 = v;
            $scope.filterObj.win120 = v;
            $scope.filterObj.win180 = v;
        };
    $scope.$on("RefreshitemsIndenailSummury", function (event, data) {
  $scope.closeDrill();
$scope.DenialSearchObj.PageNumber=1;
                $scope.GetOrganizationDenialSummuryClaimlist(1, 'Denial');


    });
    }]);

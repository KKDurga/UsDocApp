"use strict";
eHnoteWebApp.controller("UsAuditReport", ["$scope", "$filter", "$uibModal", "alertify", "eHnoteInsuranceService", "eHnoteMasterDataService", "eHnoteReferalDataService", "eHnoteSettingsDataService", "$timeout","$document",
    function ($scope, $filter, $uibModal, alertify, eHnoteInsuranceService, eHnoteMasterDataService, eHnoteReferalDataService, eHnoteSettingsDataService, $timeout, $document) {

        /* ═══════════════════════════════════════════════
           USER / HOSPITAL INFO
        ═══════════════════════════════════════════════ */
        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.HospitalId = 0;
        $scope.ParentHospitalId = 0;
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;

        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
            && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }

        /* ═══════════════════════════════════════════════
           GRID API HANDLE
        ═══════════════════════════════════════════════ */
        var auditDetailGridApi = null;

        /* ═══════════════════════════════════════════════
           STATIC ARRAYS
        ═══════════════════════════════════════════════ */



        $scope.ClaimCreateDateRangeArray = [
            { Id: 1, Name: 'Today' },
            { Id: 4, Name: 'This month' },
            { Id: 5, Name: 'Last month' },
            { Id: 6, Name: 'Last 2 months' },
            { Id: 7, Name: 'Last 3 months' },
            { Id: 9, Name: 'This year' },
            { Id: 10, Name: 'Last year' },
            { Id: 11, Name: 'Custom Date' }
        ];

        $scope.PaymentDateRangeArray = [
            { Id: 1, Name: 'Today' },
            { Id: 4, Name: 'This month' },
            { Id: 5, Name: 'Last month' },
            { Id: 6, Name: 'Last 2 months' },
            { Id: 7, Name: 'Last 3 months' },
            { Id: 9, Name: 'This year' },
            { Id: 10, Name: 'Last year' },
            { Id: 11, Name: 'Custom Date' }
        ];

        $scope.ServiceDateRangeArray = [
            { Id: 1, Name: 'Today' },
            { Id: 3, Name: 'Last week' },
            { Id: 4, Name: 'This month' },
            { Id: 5, Name: 'Last month' },
            { Id: 6, Name: 'Last 2 months' },
            { Id: 7, Name: 'Last 3 months' },
            { Id: 9, Name: 'This year' },
            { Id: 10, Name: 'Last year' },
            { Id: 11, Name: 'Custom Date' }
        ];

    

        

        /* ═══════════════════════════════════════════════
           MAIN FILTER OBJECT
        ═══════════════════════════════════════════════ */
        $scope.AuditReportObj = {
            "ParentOrganizationId": $scope.ParentHospitalId,                  
            "ServiceDateRangeId": 4,
            "DOSFromDate": '',
            "DOSToDate": '',       
            "BillingProviderList": angular.copy($scope.mainBillerDataObj.BillingProviderList || []),
            "SelectBillingProviderString": 'All',
            "AllBillingProviderStatusCheck": true,
            "RenderingProviderList": angular.copy($scope.mainBillerDataObj.AllDoctorsList || []),
            "SelectRenderingStatusString": 'All Doctors',
            "AllRenderingStatusCheck": true,
            "AllUsersList": angular.copy($scope.mainBillerDataObj.AllUsersList || []),
            "SelectUserStatusString": 'All',
            "AllUserStatusCheck": true,
            "AllBranchesList": angular.copy($scope.mainBillerDataObj.AllBranchesList || []),
            "SelectLocationString": 'All',
            "AllLocationStatusCheck": true,
            "AllPayorList": [],
            "AllProcedureList": [],
            "AllReferalList": [],
            "PayorObj": '',
            "ServiceObj": '',
            "ReferringObj": '',
            "AllMasterPayorsInd": 1,
            "AllProcedureInd": 1,
            "AllReferralProviderInd": 1,
            "AllLocationInd": 1,
            "AllBillingProviderInd": 1,
            "AllRenderingProviderInd": 1,
            "AllPostingUsersInd": 1,
            "UserFullName": "",
            "CheckDate": "",
            "ChkPostedDateRangeId": null,
            "ChkPostedFromDate": '',
            "ChkPostedToDate": '',
            "ClaimStartDate": '',
            "ClaimEndDate": '',
            "ClaimCreateDateRangeId": null,


        };

        // Mark all providers / users / branches as checked by default
        angular.forEach($scope.AuditReportObj.BillingProviderList, function (i) { i.IsChecked = true; });
        angular.forEach($scope.AuditReportObj.RenderingProviderList, function (i) { i.IsChecked = true; });
        angular.forEach($scope.AuditReportObj.AllUsersList, function (i) { i.IsChecked = true; });
        angular.forEach($scope.AuditReportObj.AllBranchesList, function (i) { i.IsChecked = true; });

        $scope.auditSearchTxt = { rendering: '' };
        $scope.AuditSubTab = 'Detail';
        $scope.AuditDetailCount = -1;   // -1 = not loaded yet
        $scope.AuditSummaryList = [];
        $scope.AuditSummaryTotals = {};
        $scope.auditDetailLoading = false;
        $scope.auditSummaryLoading = false;
        $scope.auditFilterPopover = { templateUrl: 'auditFilterPopover.html' };
        $scope.auditPopoverOpen = false;

        /* ═══════════════════════════════════════════════
           INIT – load providers, branches, then apply defaults
        ═══════════════════════════════════════════════ */
        $scope.initAuditReport = function () {
            // Set default date range = This month
            $scope.setAuditDOSDateRange(4);
        };

        // Master data comes from mainBillerDataObj — no separate API call needed.

        /* ═══════════════════════════════════════════════
           DATE RANGE HELPERS
        ═══════════════════════════════════════════════ */
        function formatDate(d) {
            return d ? $filter('date')(d, 'MM-dd-yyyy') : '';
        }

        $scope.setAuditCheckDateRange = function (id) {
            var d = new Date();
            var from, to = new Date();
            switch (id) {
                case 1: from = new Date(d); break;
                case 4: from = new Date(d.getFullYear(), d.getMonth(), 1); break;
                case 5:
                    from = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    to = new Date(d.getFullYear(), d.getMonth(), 0);
                    break;
                case 6: from = new Date(d.getFullYear(), d.getMonth() - 2, 1); break;
                case 7: from = new Date(d.getFullYear(), d.getMonth() - 3, 1); break;
                case 9: from = new Date(d.getFullYear(), 0, 1); break;
                case 10:
                    from = new Date(d.getFullYear() - 1, 0, 1);
                    to = new Date(d.getFullYear() - 1, 11, 31);
                    break;
                case 11: from = null; to = null; break;
                default: from = new Date(d.getFullYear(), d.getMonth(), 1);
            }
            $scope.AuditReportObj.ChkPostedFromDate = formatDate(from);
            $scope.AuditReportObj.ChkPostedToDate = formatDate(to);
        };

        $scope.setAuditCreateDateRange = function (id) {
            var d = new Date();
            var from, to = new Date();
            switch (id) {
                case 1: from = new Date(d); break;
                case 4: from = new Date(d.getFullYear(), d.getMonth(), 1); break;
                case 5:
                    from = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    to = new Date(d.getFullYear(), d.getMonth(), 0);
                    break;
                case 6: from = new Date(d.getFullYear(), d.getMonth() - 2, 1); break;
                case 7: from = new Date(d.getFullYear(), d.getMonth() - 3, 1); break;
                case 9: from = new Date(d.getFullYear(), 0, 1); break;
                case 10:
                    from = new Date(d.getFullYear() - 1, 0, 1);
                    to = new Date(d.getFullYear() - 1, 11, 31);
                    break;
                case 11: from = null; to = null; break;
                default: from = new Date(d.getFullYear(), d.getMonth(), 1);
            }
            $scope.AuditReportObj.ClaimStartDate = formatDate(from);
            $scope.AuditReportObj.ClaimEndDate = formatDate(to);
        };

        $scope.setAuditDOSDateRange = function (id) {
            var d = new Date();
            var from, to = new Date();
            switch (id) {
                case 1: from = new Date(d); break;
                case 3: from = new Date(d.setDate(d.getDate() - 7)); break;
                case 4: from = new Date(d.getFullYear(), d.getMonth(), 1); break;
                case 5:
                    from = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    to = new Date(d.getFullYear(), d.getMonth(), 0);
                    break;
                case 6: from = new Date(d.getFullYear(), d.getMonth() - 2, 1); break;
                case 7: from = new Date(d.getFullYear(), d.getMonth() - 3, 1); break;
                case 9: from = new Date(d.getFullYear(), 0, 1); break;
                case 10:
                    from = new Date(d.getFullYear() - 1, 0, 1);
                    to = new Date(d.getFullYear() - 1, 11, 31);
                    break;
                case 11: from = null; to = null; break;
                default: from = ''; to = '';
            }
            $scope.AuditReportObj.DOSFromDate = formatDate(from);
            $scope.AuditReportObj.DOSToDate = formatDate(to);
        };
        $scope.setAuditChkPostedDateRange = function (id) {
            var d = new Date(), from, to = new Date();
            switch (id) {
                case 1: from = new Date(d); break;
                case 4: from = new Date(d.getFullYear(), d.getMonth(), 1); break;
                case 5:
                    from = new Date(d.getFullYear(), d.getMonth() - 1, 1);
                    to = new Date(d.getFullYear(), d.getMonth(), 0);
                    break;
                case 6: from = new Date(d.getFullYear(), d.getMonth() - 2, 1); break;
                case 7: from = new Date(d.getFullYear(), d.getMonth() - 3, 1); break;
                case 9: from = new Date(d.getFullYear(), 0, 1); break;
                case 10:
                    from = new Date(d.getFullYear() - 1, 0, 1);
                    to = new Date(d.getFullYear() - 1, 11, 31);
                    break;
                case 11: from = null; to = null; break;
                default: from = ''; to = '';
            }
            $scope.AuditReportObj.ChkPostedFromDate = formatDate(from);
            $scope.AuditReportObj.ChkPostedToDate = formatDate(to);
        };
        /* ═══════════════════════════════════════════════
           BUILD PAYLOAD HELPER
        ═══════════════════════════════════════════════ */
        function buildAuditPayload(startRow, endRow) {
            var obj = $scope.AuditReportObj;

            var LocationIds = (obj.AllBranchesList || [])
                .filter(function (x) { return x.IsChecked && x.ClinicId !== 0; })
                .map(function (x) { return x.ClinicId; }).join(',');

            var BillingProviderIds = (obj.BillingProviderList || [])
                .filter(function (x) { return x.IsChecked; })
                .map(function (x) { return x.OrganizationBillingProviderId; }).join(',');

            var RenderingProviderIds = (obj.RenderingProviderList || [])
                .filter(function (x) { return x.IsChecked; })
                .map(function (x) { return x.DoctorID; }).join(',');

            var MasterPayorIds = null;
            obj.AllMasterPayorsInd = 1;
            if (obj.AllPayorList.length > 0) {
                MasterPayorIds = obj.AllPayorList.map(function (p) { return p.PayorId; }).join(',');
                obj.AllMasterPayorsInd = 0;
            }

            var ProcedureIds = null;
            obj.AllProcedureInd = 1;
            if (obj.AllProcedureList.length > 0) {
                ProcedureIds = obj.AllProcedureList.map(function (p) { return p.ProcedureId; }).join(',');
                obj.AllProcedureInd = 0;
            }

            var PcpReferralIds = null;
            obj.AllReferralProviderInd = 1;
            if (obj.AllReferalList.length > 0) {
                PcpReferralIds = obj.AllReferalList.map(function (p) { return p.PcpReferralId; }).join(',');
                obj.AllReferralProviderInd = 0;
            }

          
            var payload = {
                "ParentOrganization": $scope.ParentHospitalId,
                "OrganizationId": $scope.HospitalId,
                "AllLocationInd": 1,
                "LocationIds": LocationIds || "",
                "AllBillingProviderInd": 1,
                "BillingProviderIds": BillingProviderIds || null,
                "AllRenderingProviderInd": 1,
                "RenderingProviderIds": RenderingProviderIds || null,
                "AllMasterPayorsInd": obj.AllMasterPayorsInd,
                "MasterPayorIds": MasterPayorIds,
                "AllProcedureInd": obj.AllProcedureInd,
                "ProcedureIds": ProcedureIds,
                "AllReferralProviderInd": obj.AllReferralProviderInd,
                "ReferralProviderIds": PcpReferralIds,
                "ChkPostedFromDate": obj.ChkPostedFromDate || "",
                "ChkPostedToDate": obj.ChkPostedToDate || "",
                "DOSFrom": obj.DOSFromDate || "",
                "DOSTo": obj.DOSToDate || "",       
                "StartRow": startRow,
                "EndRow": endRow,                           
                "CheckDate": obj.CheckDate || ""
            };
            return payload;
        }

        /* ═══════════════════════════════════════════════
           AG-GRID – DETAIL (server-side)
        ═══════════════════════════════════════════════ */
        $scope.initAuditDetailGrid = function () {
            var gridDiv = document.getElementById('AuditDetailAgGrid');
            if (!gridDiv) { console.warn('AuditDetailAgGrid div not found'); return; }

            if (auditDetailGridApi) {
                auditDetailGridApi.destroy();
                auditDetailGridApi = null;
            }

            var columnDefs = [
                { headerName: "Claim No", field: "PatientClaimNumber", minWidth: 120, pinned: 'left' },
                { headerName: "Record No", field: "PatientMrNo", minWidth: 110 },
                { headerName: "Patient", field: "PatientFullName", minWidth: 160 },
                { headerName: "Claim Status", field: "ClaimStatusName", minWidth: 120 },
                { headerName: "Billing Provider", field: "BillingProviderName", minWidth: 160 },
                { headerName: "Billing NPI", field: "BillingProviderNPI", minWidth: 120 },
                { headerName: "Rendering Provider", field: "RenderingProviderName", minWidth: 160 },
                { headerName: "Rendering NPI", field: "RenderingProviderNPI", minWidth: 120 },
                { headerName: "DOS", field: "DateOfServiceFrom", minWidth: 110 },
                { headerName: "DOS To", field: "DateOfServiceTo", minWidth: 110 },
                { headerName: "POS", field: "PlaceOfServiceName", minWidth: 110 },
                { headerName: "Payor", field: "PayorName", minWidth: 160 },
                { headerName: "Policy Id", field: "PolicyId", minWidth: 120 },
                { headerName: "CPT", field: "CPTCODE", minWidth: 80 },
                { headerName: "Procedure", field: "ProcedureName", minWidth: 180 },
                { headerName: "Units", field: "ServiceUnits", minWidth: 80 },
                { headerName: "Charges", field: "ChargeAmount", minWidth: 110 },
                { headerName: "Insurance Paid", field: "InsurancePaidAmount", minWidth: 120 },
                { headerName: "Adj. Codes", field: "Adjustmentcodes", minWidth: 110 },
                { headerName: "Adjustment", field: "Adjustment", minWidth: 110 },
                { headerName: "Insurance Balance", field: "Balance", minWidth: 130 },
                { headerName: "Posting Date", field: "PostingDate", minWidth: 120 },
                { headerName: "Check/EFT Date", field: "CheckEFTDate", minWidth: 130 },
                { headerName: "Check/EFT No", field: "CheckEFTNo", minWidth: 120 },
                { headerName: "Referral", field: "ReferralName", minWidth: 150 },
                { headerName: "Create Date", field: "CreateDate", minWidth: 120 },
                { headerName: "Created By", field: "CreatedByUserName", minWidth: 140 },
                { headerName: "User", field: "PostingUserName", minWidth: 140 }
            ];

            var gridOptions = {
                columnDefs: columnDefs,
                defaultColDef: {
                    flex: 1,
                    minWidth: 100,
                    sortable: true,
                    filter: false,
                    resizable: true,
                    suppressHeaderMenuButton: false
                },
                rowModelType: 'serverSide',
                cacheBlockSize: 100,
                maxBlocksInCache: 10,
                animateRows: false,
                onGridReady: function (params) {
                    auditDetailGridApi = params.api;

                    var ds = {
                        getRows: function (ssParams) {
                            $scope.auditDetailLoading = true;
                            var payload = buildAuditPayload(
                                ssParams.request.startRow,
                                ssParams.request.endRow
                            );

                            eHnoteInsuranceService.GetAuditDetailReport(payload)
                                .then(function (resp) {
                                    $scope.auditDetailLoading = false;
                                    if (resp.data.status === "Success") {
                                        var rows = resp.data.rows || [];
                                        var totalCount = resp.data.Count || 0;
                                        $scope.AuditDetailCount = totalCount;

                                        // Format dates
                                        rows.forEach(function (item) {
                                            item.DateOfServiceFrom = $filter('date')(item.DateOfServiceFrom, 'MM-dd-yyyy');
                                            item.DateOfServiceTo = $filter('date')(item.DateOfServiceTo, 'MM-dd-yyyy');
                                            item.PostingDate = $filter('date')(item.PostingDate, 'MM-dd-yyyy');
                                            item.CheckEFTDate = $filter('date')(item.CheckEFTDate, 'MM-dd-yyyy');
                                            item.CreateDate = $filter('date')(item.CreateDate, 'MM-dd-yyyy');
                                        });

                                        if (totalCount === 0) {
                                            ssParams.success({ rowData: [], rowCount: 0 });
                                            return;
                                        }
                                        var lastRow = ssParams.request.endRow >= totalCount ? totalCount : -1;
                                        ssParams.success({ rowData: rows, rowCount: lastRow });
                                    } else {
                                        $scope.AuditDetailCount = 0;
                                        ssParams.fail();
                                    }
                                })
                                .catch(function () {
                                    $scope.auditDetailLoading = false;
                                    $scope.AuditDetailCount = 0;
                                    ssParams.fail();
                                });
                        }
                    };

                    params.api.setGridOption('serverSideDatasource', ds);
                }
            };

            auditDetailGridApi = agGrid.createGrid(gridDiv, gridOptions);
        };

        /* ═══════════════════════════════════════════════
           SUMMARY REPORT
        ═══════════════════════════════════════════════ */

        let InsBillingProviderchartContainer = null;
        let InsbillingProviderChart = null;
        $scope.loadAuditSummary = function () {
            $scope.auditSummaryLoading = true;
            $scope.AuditSummaryList = [];
            $scope.AuditSummaryTotals = {
                TotalChargeAmount: 0,
                TotalInsurancePayment: 0,
                TotalInsuranceAdjustmentPayment: 0,
                TotalInsuranceBalance: 0,
                TotalPatientPayment: 0,
                TotalPatientWriteOff: 0,
                TotalPatientBalance: 0
            };

            var LocationIds = ($scope.AuditReportObj.AllBranchesList || [])
                .filter(function (x) { return x.IsChecked && x.ClinicId !== 0; })
                .map(function (x) { return x.ClinicId; }).join(',');

            var BillingProviderIds = ($scope.AuditReportObj.BillingProviderList || [])
                .filter(function (x) { return x.IsChecked; })
                .map(function (x) { return x.OrganizationBillingProviderId; }).join(',');

            var RenderingProviderIds = ($scope.AuditReportObj.RenderingProviderList || [])
                .filter(function (x) { return x.IsChecked; })
                .map(function (x) { return x.DoctorID; }).join(',');

            var MasterPayorIds = null;
            $scope.AuditReportObj.AllMasterPayorsInd = 1;
            if ($scope.AuditReportObj.AllPayorList.length > 0) {
                MasterPayorIds = $scope.AuditReportObj.AllPayorList.map(function (p) { return p.PayorId; }).join(',');
                $scope.AuditReportObj.AllMasterPayorsInd = 0;
            }

            var ProcedureIds = null;
            $scope.AuditReportObj.AllProcedureInd = 1;
            if ($scope.AuditReportObj.AllProcedureList.length > 0) {
                ProcedureIds = $scope.AuditReportObj.AllProcedureList.map(function (p) { return p.ProcedureId; }).join(',');
                $scope.AuditReportObj.AllProcedureInd = 0;
            }

            var PcpReferralIds = null;
            $scope.AuditReportObj.AllReferralProviderInd = 1;
            if ($scope.AuditReportObj.AllReferalList.length > 0) {
                PcpReferralIds = $scope.AuditReportObj.AllReferalList.map(function (p) { return p.PcpReferralId; }).join(',');
                $scope.AuditReportObj.AllReferralProviderInd = 0;
            }

            let UserIds = $scope.AuditReportObj.AllUsersList
                .filter(pitem => pitem.IsChecked)
                .map(pitem => pitem.DoctorID)
                .join(",");
   
            var payload = {
                "ParentOrganizationId": $scope.ParentHospitalId,
                "OrganizationId": $scope.HospitalId,
                "AllLocationInd": $scope.AuditReportObj.AllLocationInd,
                "LocationIds": LocationIds || "",
                "AllBillingProviderInd": $scope.AuditReportObj.AllBillingProviderInd,
                "BillingProviderIds": BillingProviderIds || null,
                "AllRenderingProviderInd": $scope.AuditReportObj.AllRenderingProviderInd,
                "RenderingProviderIds": RenderingProviderIds || null,
                "AllMasterPayorsInd": $scope.AuditReportObj.AllMasterPayorsInd,
                "MasterPayorIds": MasterPayorIds,
                "AllProcedureInd": $scope.AuditReportObj.AllProcedureInd,
                "ProcedureIds": ProcedureIds,
                "AllReferralProviderInd": $scope.AuditReportObj.AllReferralProviderInd,
                "ReferalUserIds": PcpReferralIds,
                //"PaymentStartDate": $scope.AuditReportObj.PaymentFromDate || "",
                //"PaymentEndDate": $scope.AuditReportObj.PaymentToDate || "",
                "FromDate": $scope.AuditReportObj.DOSFromDate || "",
                "ToDate": $scope.AuditReportObj.DOSToDate || "",
                "DOSFrom": $scope.AuditReportObj.DOSFromDate || "",
                "DOSTo": $scope.AuditReportObj.DOSToDate || "",
                "ClaimStartDate": $scope.AuditReportObj.ClaimStartDate || "",
                "ClaimEndDate": $scope.AuditReportObj.ClaimEndDate || "",
                "PostingUserIds": UserIds,
                "PageSize": $scope.AuditReportObj.PageSize || 10,
                "PageNumber": $scope.AuditReportObj.PageNumber || 1,
                "ChkPostedFromDate": $scope.AuditReportObj.ChkPostedFromDate || "",
                "ChkPostedToDate": $scope.AuditReportObj.ChkPostedToDate || "",
                "CheckDate": $scope.AuditReportObj.CheckDate || ""
                
            };

            

            eHnoteInsuranceService.GetAuditSummaryReport(payload).then(function (resp) {
                    $scope.auditSummaryLoading = false;
                    if (resp.data.status === "Success") {
                        $scope.AuditSummaryList = resp.data.rows || [];
                        $scope.AuditSummaryListCharList = resp.data.MonthWiseData || [];
                        // Calculate totals
                     
                        $scope.AuditSummaryList.forEach(function (r) {
                            $scope.AuditSummaryTotals.TotalChargeAmount += r.TotalChargeAmount || 0;
                            $scope.AuditSummaryTotals.TotalInsurancePayment += r.TotalInsurancePayment || 0;
                            $scope.AuditSummaryTotals.TotalInsuranceAdjustmentPayment += r.TotalInsuranceAdjustmentPayment || 0;
                            $scope.AuditSummaryTotals.TotalInsuranceBalance += r.TotalInsuranceBalance || 0;
                            $scope.AuditSummaryTotals.TotalPatientPayment += r.TotalPatientPayment || 0;
                            $scope.AuditSummaryTotals.TotalPatientWriteOff += r.TotalPatientWriteOff || 0;
                            $scope.AuditSummaryTotals.TotalPatientBalance += r.TotalPatientBalance || 0;
                        });
                        

                        $timeout(function () {

                            InsBillingProviderchartContainer = $document[0].getElementById("InsBillingProviderBarChart");
                            $scope.GetInsBillingProviderChart();
                        }, 0);
                    }
                })
                
        };


        $scope.GetInsBillingProviderChart = function () {

            // 1️⃣ Get container
            if (!InsBillingProviderchartContainer) {
                InsBillingProviderchartContainer =
                    document.getElementById("InsBillingProviderBarChart");
            }
            if (!InsBillingProviderchartContainer) return;

            // 2️⃣ Prepare data — aggregate totals per BillingProviderName
            const raw = angular.isArray($scope.AuditSummaryListCharList)
                ? $scope.AuditSummaryListCharList
                : [];

            // ✅ If no data → clear chart
            if (!raw.length) {
                if (InsbillingProviderChart) {
                    InsbillingProviderChart.destroy();
                    InsbillingProviderChart = null;
                }
                return;
            }

            // 3️⃣ Aggregate by BillingProviderName
            const providerMap = {};
            raw.forEach(item => {
                const key = item.BillingProviderName || "Unknown";
                if (!providerMap[key]) {
                    providerMap[key] = {
                        provider: key,
                        cPrimaryCharges: 0,
                        InsAmtPaid: 0,
                        InsBalance: 0,
                        cPatientCharge: 0,
                        PatientPymtns: 0,
                        PatientBalance: 0
                    };
                }
                const p = providerMap[key];
                p.cPrimaryCharges += Number(item.TotalChargeAmount) || 0;
                p.InsAmtPaid += Number(item.TotalInsurancePayment) || 0;
                p.InsBalance += Number(item.TotalInsuranceBalance) || 0;
                p.cPatientCharge += Number(item.TotalInsuranceAdjustmentPayment) || 0;
                p.PatientPymtns += Number(item.TotalPatientPayment) || 0;
                p.PatientBalance += Number(item.TotalPatientBalance) || 0;
            });

            const chartData = Object.values(providerMap);

            // 4️⃣ Metric definitions  (label + color matching your screenshot)
            const metrics = [
                { yKey: "cPrimaryCharges", yName: "cPrimaryCharges", color: "#1F4E79" },  // dark blue
                { yKey: "InsAmtPaid", yName: "InsAmtPaid", color: "#F4A623" },  // orange
                { yKey: "InsBalance", yName: "InsBalance", color: "#2E7D32" },  // green
                { yKey: "cPatientCharge", yName: "cPatientCharge", color: "#00BCD4" },  // cyan
                { yKey: "PatientPymtns", yName: "PatientPymtns", color: "#9C27B0" },  // purple
                { yKey: "PatientBalance", yName: "PatientBalance", color: "#8BC34A" }   // light green
            ];

            // 5️⃣ Build series
            const series = metrics.map(m => ({
                type: "bar",
                xKey: "provider",
                yKey: m.yKey,
                yName: m.yName,
                fill: m.color,
                stroke: m.color,
                data: chartData
            }));

            // 6️⃣ Tooltip formatter (shared)
            const tooltipRenderer = function (params) {
                const value = Number(params.datum[params.yKey] || 0);
                return {
                    title: params.yName,
                    content: `$${value.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`
                };
            };
            series.forEach(s => s.tooltip = { renderer: tooltipRenderer });

            // 7️⃣ Build dynamic title  (month range from data)
            const months = [...new Set(raw.map(x => x.Month).filter(Boolean))];
            const subtitle = months.length
                ? `Group Billing Provider  ${months[0]}${months.length > 1 ? " to " + months[months.length - 1] : ""}`
                : "Group Billing Provider";

            // 8️⃣ Chart options
            const options = {
                container: InsBillingProviderchartContainer,
                title: {
                    text: "Billing Insurance by DOS  vs  Payments Insurance & Balance Ins\nand Patient Charge Pay, Bal",
                    fontSize: 13
                },
                subtitle: {
                    text: subtitle,
                    fontSize: 11
                },
                series: series,
                legend: {
                    position: "bottom"
                },
                axes: [
                    {
                        type: "category",
                        position: "bottom",
                        title: { text: "Billing Provider" }
                    },
                    {
                        type: "number",
                        position: "left",
                        title: { text: "Amount ($)" },
                        label: {
                            formatter: p =>
                                `$${Number(p.value).toLocaleString("en-US", {
                                    maximumFractionDigits: 0
                                })}`
                        }
                    }
                ]
            };

            // 9️⃣ Destroy previous & create new
            if (InsbillingProviderChart) {
                InsbillingProviderChart.destroy();
            }
            InsbillingProviderChart = agCharts.AgCharts.create(options);
        };

        /* ═══════════════════════════════════════════════
           APPLY / CLEAR
        ═══════════════════════════════════════════════ */
        $scope.ClickForAuditFilteredData = function () {

            $scope.loadAuditSummary();
        };

        $scope.ClearAuditFilters = function () {
         

            // Reset dates to This Month
            $scope.AuditReportObj.ServiceDateRangeId = 4;
            $scope.setAuditDOSDateRange(4);        
            $scope.AuditReportObj.DOSFromDate = '';
            $scope.AuditReportObj.DOSToDate = '';


            /* ─── 5. Add to ClearAuditFilters() ─── */
            $scope.AuditReportObj.ChkPostedDateRangeId = '';
            $scope.AuditReportObj.ChkPostedFromDate = '';
            $scope.AuditReportObj.ChkPostedToDate = '';
            $scope.AuditReportObj.ClaimCreateDateRangeId = '';
            $scope.AuditReportObj.ClaimStartDate = '';
            $scope.AuditReportObj.ChkPostedToDate = '';
            //$scope.AuditReportObj.ChkDateRangeId = '';
            $scope.AuditReportObj.CheckDate = '';

            // Reset providers
            angular.forEach($scope.AuditReportObj.BillingProviderList, function (i) { i.IsChecked = true; });
            angular.forEach($scope.AuditReportObj.RenderingProviderList, function (i) { i.IsChecked = true; });
            $scope.AuditReportObj.SelectBillingProviderString = 'All';
            $scope.AuditReportObj.AllBillingProviderStatusCheck = true;
            $scope.AuditReportObj.SelectRenderingStatusString = 'All Doctors';
            $scope.AuditReportObj.AllRenderingStatusCheck = true;

            // Reset lists
            $scope.AuditReportObj.AllPayorList = [];
            $scope.AuditReportObj.AllProcedureList = [];
            $scope.AuditReportObj.AllReferalList = [];
            
            
        };

        $scope.checkAuditAllBillingProviders = function (val) {
            angular.forEach($scope.AuditReportObj.BillingProviderList, function (i) { i.IsChecked = val; });
            $scope.AuditReportObj.SelectBillingProviderString = val ? 'All' : 'Select Billing Provider';
        };

        $scope.AuditBillingProviderToggle = function () {
            var checked = $scope.AuditReportObj.BillingProviderList.filter(function (i) { return i.IsChecked; });
            $scope.AuditReportObj.AllBillingProviderStatusCheck = checked.length === $scope.AuditReportObj.BillingProviderList.length;
            $scope.AuditReportObj.SelectBillingProviderString =
                checked.length === 0 ? 'Select Billing Provider' :
                    $scope.AuditReportObj.AllBillingProviderStatusCheck ? 'All' : 'Selected';
        };

        $scope.checkAuditAllRendering = function (val) {
            angular.forEach($scope.AuditReportObj.RenderingProviderList, function (i) { i.IsChecked = val; });
            $scope.AuditReportObj.SelectRenderingStatusString = val ? 'All Doctors' : 'Select';
        };

        $scope.AuditRenderingToggle = function () {
            var checked = _.where($scope.AuditReportObj.RenderingProviderList, { IsChecked: true });
            $scope.AuditReportObj.AllRenderingStatusCheck = checked.length === $scope.AuditReportObj.RenderingProviderList.length;
            $scope.AuditReportObj.SelectRenderingStatusString =
                checked.length === 0 ? 'Select' :
                    checked.length === 1 ? checked[0].SecondUserFullName + '-' + checked[0].NPI : 'Selected';
        };

        /* ═══════════════════════════════════════════════
           PAYOR TYPEAHEAD
        ═══════════════════════════════════════════════ */
        

        $scope.GetOrganizationNewPayorAllList = function (val) {

            var param = {
                "SearchText": val || "",
                "Status": "Active",
                "PageSize": 10,
                "PageNumber": 1,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "OrganizationId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParentHospitalId,
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

        $scope.AuditChangePayor = function (item) {
            var exists = $filter('filter')($scope.AuditReportObj.AllPayorList, { PayorId: item.OrganizationPayorId }, true);
            if (exists.length > 0) { alertify.error('Payor already selected'); return; }
            $scope.AuditReportObj.AllPayorList.push({ PayorId: item.OrganizationPayorId, PayorName: item.OrganizationPayorName });
            $scope.AuditReportObj.PayorObj = '';
        };
        $scope.AuditDeletePayor = function (i) { $scope.AuditReportObj.AllPayorList.splice(i, 1); };
        $scope.AuditClearAllPayor = function () { $scope.AuditReportObj.AllPayorList = []; };

        /* ═══════════════════════════════════════════════
           PROCEDURE TYPEAHEAD
        ═══════════════════════════════════════════════ */
        $scope.GetOrganizationProcedure = function (text) {
            var params = {
                "OrganizationId": $scope.HospitalId,
                "ProcedureId": 0,
                "CPTCODE": "",  // cptcode tblorganizationprocedure
                "SearchText": text || "", // searchtext
                "TypeOfServiceId": 0,
                "PageNumber": 1,
                "PageSize": 10,
                "Status": 1,
                "IsFrequent": "N",
                "ParentOrganizationId": $scope.ParenthospitalId || null
            };
            if (params.SearchText == '') {
                params.IsFrequent = 'Y';
            }

            return eHnoteSettingsDataService.GetOrganizationProceduresSearchEngine(params).then(function (resp) {
                if (resp.data.rows !== undefined) {
                    //return resp.data.rows.map(function (item) {
                    //    return item;
                    //});
                    return resp.data.rows
                        .filter(function (item) {
                            return item.IsActive == true;
                        })
                        .map(function (item) {
                            return item;
                        });
                }
            });
        };



        $scope.AuditOnselectServiceItem = function (item) {
            if ($scope.AuditReportObj.AllProcedureList.length > 0) {
                var filterList = $filter("filter")($scope.AuditReportObj.AllProcedureList, { "ProcedureId": item.ProcedureId }, true) || [];
                if (filterList.length == 0) {
                    let obj = {
                        "ProcedureId": item.ProcedureId,
                        "ProcedureName": item.ProcedureName,
                    }
                    $scope.AuditReportObj.AllProcedureList.push(obj);
                } else {
                    alertify.error("Procedure is already selected");
                    return false;
                }
            } else {
                let obj = {
                    "ProcedureId": item.ProcedureId,
                    "ProcedureName": item.ProcedureName,
                }
                $scope.AuditReportObj.AllProcedureList.push(obj);
            }
            $scope.AuditReportObj.ServiceObj = "";

        }        
        $scope.AuditDeleteProcedure = function (i) { $scope.AuditReportObj.AllProcedureList.splice(i, 1); };
        $scope.AuditClearAllProcedure = function () { $scope.AuditReportObj.AllProcedureList = []; };

        /* ═══════════════════════════════════════════════
           REFERRAL TYPEAHEAD
        ═══════════════════════════════════════════════ */
        $scope.GetReferalPCPDoctors = function (val, typeid) {
            var searchText = '', searchNpi = '';
            if (/^[0-9]+$/.test(val)) { searchNpi = val; } else { searchText = val; }
            return eHnoteReferalDataService.GetReferalPCPDoctors({
                'LocationId': null, 'PageNumber': 1, 'PageSize': 10,
                'SearchTaxt': searchText, 'NPI': searchNpi,
                'SpecializationId': null, 'RefaralTypeId': typeid,
                'DeleteInd': 'N', 'OrganizationId': $scope.HospitalId
            }).then(function (resp) {
                return (resp.data.status === 'Success') ? resp.data.PcpRefdetails : [];
            });
        };

        $scope.AuditOnSelectReferral = function (item) {
            var exists = $filter('filter')($scope.AuditReportObj.AllReferalList, { PcpReferralId: item.PcpReferralId }, true);
            if (exists.length > 0) { alertify.error('Referral already selected'); return; }
            $scope.AuditReportObj.AllReferalList.push({ PcpReferralId: item.PcpReferralId, FullName: item.FullName });
            $scope.AuditReportObj.ReferringObj = '';
        };
        $scope.AuditDeleteReferal = function (i) { $scope.AuditReportObj.AllReferalList.splice(i, 1); };
        $scope.AuditClearAllReferal = function () { $scope.AuditReportObj.AllReferalList = []; };

        /* ═══════════════════════════════════════════════
           POPOVER
        ═══════════════════════════════════════════════ */
        $scope.toggleAuditPopover = function () { $scope.auditPopoverOpen = !$scope.auditPopoverOpen; };
        $scope.closeAuditFilterPopover = function () {
            angular.element(document.querySelector('.popover')).remove();
            $scope.auditPopoverOpen = false;
        };

 

        /* ═══════════════════════════════════════════════
           BOOT
        ═══════════════════════════════════════════════ */
        $scope.initAuditReport();


        $scope.openInsurancePaymentPopup = function (id, type, item) {
            let obj = {
                "id": id || 1,
                "type": type || '',
                "Mainobj": angular.copy($scope.AuditReportObj),
                "selecteditem": item,
            }
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/Reports/AuditGridContainer.html",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "PObj": function () { return obj; }
                },
                "windowClass": "offcanves-right",
                "controller": "UsAuditGridContainerCtrl",

            });
        }



    }
]);
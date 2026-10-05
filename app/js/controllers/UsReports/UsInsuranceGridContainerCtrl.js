"use strict";
eHnoteWebApp.controller("UsInsuranceGridContainerCtrl", ["$scope", "$uibModal", "$uibModalInstance", "$timeout", "PObj", "eHnoteInsuranceService", "eHnoteMasterDataService", "eHnoteReferalDataService", "eHnoteSettingsDataService", "$filter", "alertify",
    function ($scope, $uibModal, $uibModalInstance, $timeout, PObj, eHnoteInsuranceService, eHnoteMasterDataService, eHnoteReferalDataService, eHnoteSettingsDataService, $filter, alertify) {

        /* ---------------- GRID API ---------------- */
        let gridApi = null;
        $scope.close = function () {
            //if (gridApi) {
            //    gridApi.destroy();
            //    gridApi = null;
            //}
            $uibModalInstance.dismiss("cancel");
        };

        /* ---------------- USER / HOSPITAL INFO ---------------- */
        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.HospitalId = 0;
        $scope.ParentHospitalId = 0;
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
            && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        }

        $scope.MainPobj = PObj.Mainobj || {};
        $scope.InsSubTab = PObj.type || '';
        $scope.SelectedId = PObj.id || '';

        $scope.PaymentDateRangeArray = [
            { Id: 1, Name: 'Today' },
            /* { Id: 2, Name: 'Yesterday' },*/
            /* { Id: 3, Name: 'Last week' },*/
            { Id: 4, Name: 'This month' },
            { Id: 5, Name: 'Last month' },
            { Id: 6, Name: 'Last 2 months' },
            { Id: 7, Name: 'Last 3 months' },
            //{ Id: 8, Name: 'Last 6 months' },
            { Id: 9, Name: 'This year' },
            { Id: 10, Name: 'Last year' },
            { Id: 11, Name: 'Custom Date' }
        ];
        $scope.payerFilterPopover = {
            templateUrl: 'InspayerFilterPopover.html',
        };
        $scope.ServiceDateRangeArray = [
            { Id: 1, Name: 'Today' },
            //{ Id: 2, Name: 'Yesterday' },
            { Id: 3, Name: 'Last week' },
            { Id: 4, Name: 'This month' },
            { Id: 5, Name: 'Last month' },
            { Id: 6, Name: 'Last 2 months' },
            { Id: 7, Name: 'Last 3 months' },
            //{ Id: 8, Name: 'Last 6 months' },
            { Id: 9, Name: 'This year' },
            { Id: 10, Name: 'Last year' },
            { Id: 11, Name: 'Custom Date' }
        ];

        $scope.setInsuranceCheckDateRange = function (selectedRangeId) {
            var currentDate = new Date();

            switch (selectedRangeId) {
                case 1: // Today
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate);
                    $scope.MainPobj.PaymentToDate = new Date(currentDate);
                    break;
                case 2: // Yesterday
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
                    var currentDate = new Date();
                    $scope.MainPobj.PaymentToDate = new Date(currentDate.setDate(currentDate.getDate() - 1))// new Date(); // Reset to current date
                    break;
                case 3: // Last week
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                    $scope.MainPobj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 4: // This month
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    $scope.MainPobj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 5: // Last month
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    $scope.MainPobj.PaymentToDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of the previous month
                    break;
                case 6: // Last 2 months
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
                    $scope.MainPobj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 7: // Last 3 months
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
                    $scope.MainPobj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 8: // Last 6 months
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
                    $scope.MainPobj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 9: // This year
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of current year
                    $scope.MainPobj.PaymentToDate = new Date(); // Reset to current date
                    break;
                case 10: // Last year
                    $scope.MainPobj.PaymentFromDate = new Date(currentDate.getFullYear() - 1, 0, 1); // January 1st of last year
                    $scope.MainPobj.PaymentToDate = new Date(currentDate.getFullYear() - 1, 11, 31); // December 31st of last year
                    break;
                case 11: // Custom Date
                    $scope.MainPobj.PaymentFromDate = null;
                    $scope.MainPobj.PaymentToDate = null;
                    break;
                default:
                    $scope.MainPobj.PaymentFromDate = "";
                    $scope.MainPobj.PaymentToDate = "";
            }

            $scope.MainPobj.PaymentFromDate = $scope.MainPobj.PaymentFromDate;
            $scope.MainPobj.PaymentToDate = $scope.MainPobj.PaymentToDate;

            if ($scope.MainPobj.PaymentFromDate != '') {
                $scope.MainPobj.PaymentFromDate = $filter('date')($scope.MainPobj.PaymentFromDate, "MM-dd-yyyy");
            }
            if ($scope.MainPobj.PaymentToDate != '') {
                $scope.MainPobj.PaymentToDate = $filter('date')($scope.MainPobj.PaymentToDate, "MM-dd-yyyy");
            }
        };

        $scope.setDOSDateRange = function (selectedRangeId) {
            var currentDate = new Date();

            switch (selectedRangeId) {
                case 1: // Today
                    $scope.MainPobj.DOSFromDate = new Date(currentDate);
                    $scope.MainPobj.DOSToDate = new Date(currentDate);
                    break;
                case 2: // Yesterday
                    $scope.MainPobj.DOSFromDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
                    var currentDate = new Date();
                    $scope.MainPobj.DOSToDate = new Date(currentDate.setDate(currentDate.getDate() - 1))// new Date(); // Reset to current date
                    break;
                case 3: // Last week
                    $scope.MainPobj.DOSFromDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                    $scope.MainPobj.DOSToDate = new Date(); // Reset to current date
                    break;
                case 4: // This month
                    $scope.MainPobj.DOSFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    $scope.MainPobj.DOSToDate = new Date(); // Reset to current date
                    break;
                case 5: // Last month
                    $scope.MainPobj.DOSFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    $scope.MainPobj.DOSToDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of the previous month
                    break;
                case 6: // Last 2 months
                    $scope.MainPobj.DOSFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
                    $scope.MainPobj.DOSToDate = new Date(); // Reset to current date
                    break;
                case 7: // Last 3 months
                    $scope.MainPobj.DOSFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
                    $scope.MainPobj.DOSToDate = new Date(); // Reset to current date
                    break;
                case 8: // Last 6 months
                    $scope.MainPobj.DOSFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
                    $scope.MainPobj.DOSToDate = new Date(); // Reset to current date
                    break;
                case 9: // This year
                    $scope.MainPobj.DOSFromDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of current year
                    $scope.MainPobj.DOSToDate = new Date(); // Reset to current date
                    break;
                case 10: // Last year
                    $scope.MainPobj.DOSFromDate = new Date(currentDate.getFullYear() - 1, 0, 1); // January 1st of last year
                    $scope.MainPobj.DOSToDate = new Date(currentDate.getFullYear() - 1, 11, 31); // December 31st of last year
                    break;
                case 11: // Custom Date
                    $scope.MainPobj.DOSFromDate = null;
                    $scope.MainPobj.DOSToDate = null;
                    break;
                default:
                    $scope.MainPobj.DOSFromDate = "";
                    $scope.MainPobj.DOSToDate = "";
            }

            $scope.MainPobj.DOSFromDate = $scope.MainPobj.DOSFromDate;
            $scope.MainPobj.DOSToDate = $scope.MainPobj.DOSToDate;

            if ($scope.MainPobj.DOSFromDate != '') {
                $scope.MainPobj.DOSFromDate = $filter('date')($scope.MainPobj.DOSFromDate, "MM-dd-yyyy");
            }
            if ($scope.MainPobj.DOSToDate != '') {
                $scope.MainPobj.DOSToDate = $filter('date')($scope.MainPobj.DOSToDate, "MM-dd-yyyy");
            }
        };




        $scope.init = function () {
            if ($scope.InsSubTab == 'BillingProvider') {
                if ($scope.MainPobj.BillingProviderList.length > 0) {
                    angular.forEach($scope.MainPobj.BillingProviderList, function (item) {
                        item.IsChecked = false;
                        if (item.OrganizationBillingProviderId == $scope.SelectedId) {
                            item.IsChecked = true;
                        }
                    });

                }
            }
            else if ($scope.InsSubTab == 'RenderingProvider') {
                if ($scope.MainPobj.RenderingProviderList.length > 0) {
                    angular.forEach($scope.MainPobj.RenderingProviderList, function (item) {
                        item.IsChecked = false;
                        if (item.DoctorID == $scope.SelectedId) {
                            item.IsChecked = true;
                        }
                    });

                }
            }
            else if ($scope.InsSubTab == 'Payor') {
                $scope.MainPobj.AllPayorList = [];
                let obj = {
                    "PayorId": $scope.SelectedId,
                    "PayorName": PObj.selecteditem.OrganizationPayorName || ""
                }
                $scope.MainPobj.AllPayorList.push(obj);
                //if ($scope.MainPobj.AllPayorList.length > 0) {
                //    var filterList = $filter("filter")($scope.InsuranceReportsObj.AllPayorList, { "PayorId": $scope.SelectedId }, true) || [];
                //    if (filterList.length>0) {
                //        $scope.InsuranceReportsObj.AllPayorList = [];
                //        $scope.InsuranceReportsObj.AllPayorList.push(filterList[0]);
                //    }
                //}
            } else {

            }

            $scope.pageload();
        }


        $scope.setInsChkPostedDateRange = function (id) {
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
            $scope.MainPobj.ChkPostedFromDate = auditFormatDate(from);
            $scope.MainPobj.ChkPostedToDate = auditFormatDate(to);
        };


        /* ---------------- GRID INIT (AFTER MODAL RENDER) ---------------- */

        $scope.pageload = function () {
            const LocationIds = ($scope.MainPobj.AllBranchesList || [])
                .filter(x => x.IsChecked && x.ClinicId !== 0)
                .map(x => x.ClinicId)
                .join(",");
            const BillingProviderIds = ($scope.MainPobj.BillingProviderList || [])
                .filter(x => x.IsChecked)
                .map(x => x.OrganizationBillingProviderId)
                .join(",");
            const RenderingProviderIds = ($scope.MainPobj.RenderingProviderList || [])
                .filter(x => x.IsChecked)
                .map(x => x.DoctorID)
                .join(",");

            const PaymentModeIds = ($scope.MainPobj.AllMasterPaymentsMethods || [])
                .filter(x => x.IsChecked)
                .map(x => x.PaymentModeId)
                .join(",");

            const UserIds = ($scope.MainPobj.AllUsersList || [])
                .filter(x => x.IsChecked)
                .map(x => x.DoctorID)
                .join(",");

            var MasterPayorIds = null;
            $scope.MainPobj.AllMasterPayorsInd = 1;
            if ($scope.MainPobj.AllPayorList.length > 0) {
                MasterPayorIds = $scope.MainPobj.AllPayorList
                    .map(pitem => pitem.PayorId)
                    .join(",");
                $scope.MainPobj.AllMasterPayorsInd = 0;
            }
            var PcpReferralIds = null;
            $scope.MainPobj.AllReferralProviderInd = 1;
            if ($scope.MainPobj.AllReferalList.length > 0) {
                PcpReferralIds = $scope.MainPobj.AllReferalList
                    .map(pitem => pitem.PcpReferralId)
                    .join(",");
                $scope.MainPobj.AllReferralProviderInd = 0;
            }

            var ProcedureIds = null;
            $scope.MainPobj.AllProcedureInd = 1;
            if ($scope.MainPobj.AllProcedureList.length > 0) {
                ProcedureIds = $scope.MainPobj.AllProcedureList
                    .map(pitem => pitem.ProcedureId)
                    .join(",");
                $scope.MainPobj.AllProcedureInd = 0;
            }
            if ($scope.InsSubTab == 'BillingProvider') {
                $scope.BillingProviderCount = 0;
                $uibModalInstance.rendered.then(function () {

                    const gridDiv = document.getElementById('InspopupAgGrid');
                    if (!gridDiv) {
                        console.warn('Popup ag-Grid div not found');
                        return;
                    }
                    if (gridApi) {
                        gridApi.destroy();
                        gridApi = null;
                    }
                    /* ---------- FILTER VALUES ---------- */



                    const gridOptions = {
                        columnDefs: [
                            { headerName: "Billing NPI", field: "BillingProviderNPI" },
                            { headerName: "Billing Provider", field: "BillingProviderName" },
                            { headerName: "Professional", field: "RenderingProviderName" },
                            { headerName: "Professional NPI", field: "RenderingProviderNPI" },
                            { headerName: "Record No", field: "PatientMrNo" },
                            { headerName: "Patient", field: "PatientFullName" },
                            { headerName: "Claim No", field: "PatientClaimNumber" },
                            { headerName: "DOS", field: "DateOfServiceFrom" },
                            { headerName: "POS", field: "PlaceOfServiceName" },
                            { headerName: "Posting Date", field: "PostingDate" },
                            { headerName: "CheckEFT Date", field: "CheckEFTDate" },
                            { headerName: "Payor", field: "Payorname" },
                            { headerName: "Policy Id", field: "PolicyId" },
                            { headerName: "CPT", field: "CPTCODE" },
                            { headerName: "Procedure", field: "ProcedureName" },
                            { headerName: "Charges", field: "ChargeAmount" },
                            { headerName: "Insurance Paid", field: "InsurancePaidAmount" },
                            { headerName: "Adjustment codes", field: "Adjustmentcodes" },
                            { headerName: "Adjustment", field: "Adjustment" },
                            { headerName: "Insurance Balance", field: "Balance" },

                        ],
                        defaultColDef: {
                            flex: 1,
                            minWidth: 120,
                            sortable: false,
                            filter: false,
                            resizable: true,
                            suppressHeaderMenuButton: false,
                            // suppressHeaderContextMenu: true
                        },
                        rowModelType: 'serverSide',
                        // serverSideStoreType: 'partial',
                        //serverSideInitialRowCount: 0,
                        cacheBlockSize: 100,
                        maxBlocksInCache: 5,
                        animateRows: false,

                        onGridReady: function (params) {
                            gridApi = params.api;

                            const serverSideDatasource = {
                                getRows: function (ssParams) {

                                    let payload = {
                                        "ParentOrganization": $scope.ParentHospitalId,
                                        "AllLocationInd": 1,
                                        "LocationIds": LocationIds || "",
                                        "AllBillingProviderInd": 1,
                                        "BillingProviderIds": BillingProviderIds || null,
                                        //"BillingProviderIds": $scope.SelectedId || null,
                                        "AllRenderingProviderInd": 1,
                                        "RenderingProviderIds": RenderingProviderIds || null,
                                        "UserIds": UserIds || "",
                                        "AllMasterPayorsInd": $scope.MainPobj.AllMasterPayorsInd || 1,
                                        "MasterPayorIds": MasterPayorIds || null,
                                        "AllProcedureInd": $scope.MainPobj.AllProcedureInd || 1,
                                        "ProcedureIds": ProcedureIds || null,
                                        "AllReferralProviderInd": $scope.MainPobj.AllReferralProviderInd || 1,
                                        "ReferralProviderIds": PcpReferralIds || null,
                                        "AllPostingUsersInd": 1,
                                        "PostingUserIds": UserIds,
                                        "PaymentEndDate": $scope.MainPobj.PaymentToDate || "",
                                        "PaymentStartDate": $scope.MainPobj.PaymentFromDate || "",
                                        "DOSFrom": $scope.MainPobj.DOSFromDate || "",
                                        "DOSTo": $scope.MainPobj.DOSToDate || "",
                                        "ChkPostedFromDate": $scope.MainPobj.ChkPostedFromDate || "",
                                        "ChkPostedToDate": $scope.MainPobj.ChkPostedToDate || "",
                                        "StartRow": ssParams.request.startRow,
                                        "EndRow": ssParams.request.endRow

                                    };

                                    eHnoteInsuranceService.GetInsuranceDetailedPaymentsByBillingProviderId_New(payload)
                                        .then(function (resp) {
                                            if (resp.data.status === "Success") {
                                                const rows = resp.data.rows;
                                                if (rows.length > 0) {
                                                    angular.forEach(rows, function (item) {
                                                        item.CheckEFTDate = $filter('date')(item.CheckEFTDate, "MM-dd-yyyy");
                                                        item.DateOfServiceFrom = $filter('date')(item.DateOfServiceFrom, "MM-dd-yyyy");
                                                        item.PostingDate = $filter('date')(item.PostingDate, "MM-dd-yyyy");
                                                    })
                                                }
                                                $scope.BillingProviderCount = resp.data.Count;
                                                const totalCount = resp.data.Count;
                                                // Reset totals only first API call
                                                if (ssParams.request.startRow === 0) {

                                                    $scope.insBptotalCharges = 0;
                                                    $scope.insBptotalInsPaid = 0;
                                                    $scope.insBptotalAdjustment = 0;
                                                    $scope.insBptotalBalance = 0;
                                                }

                                                // Current block totals
                                                const currentCharges =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.ChargeAmount) || 0);
                                                    }, 0);

                                                const currentInsPaid =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.InsurancePaidAmount) || 0);
                                                    }, 0);

                                                const currentAdjustment =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.Adjustment) || 0);
                                                    }, 0);

                                                const currentBalance =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.Balance) || 0);
                                                    }, 0);

                                                $scope.insBptotalCharges += currentCharges;
                                                $scope.insBptotalInsPaid += currentInsPaid;
                                                $scope.insBptotalAdjustment += currentAdjustment;
                                                $scope.insBptotalBalance += currentBalance;

                                                gridApi.setGridOption('pinnedBottomRowData', [{
                                                    BillingProviderNPI: 'TOTALS',
                                                    ChargeAmount: $scope.insBptotalCharges.toFixed(2),
                                                    InsurancePaidAmount: $scope.insBptotalInsPaid.toFixed(2),
                                                    Adjustment: $scope.insBptotalAdjustment.toFixed(2),
                                                    Balance: $scope.insBptotalBalance.toFixed(2)
                                                }]);
                                                // VERY IMPORTANT
                                                //const lastRow =
                                                //    ssParams.request.endRow >= totalCount
                                                //        ? totalCount
                                                //        : 10000;
                                                const lastRow =
                                                    ssParams.request.endRow >= totalCount
                                                        ? totalCount
                                                        : -1;
                                                if (totalCount === 0) {
                                                    ssParams.success({
                                                        rowData: [],
                                                        rowCount: 0
                                                    });
                                                    return;
                                                }
                                                ssParams.success({
                                                    rowData: rows,
                                                    rowCount: lastRow
                                                });
                                            } else {
                                                ssParams.fail();
                                            }
                                        })
                                        .catch(function () {
                                            ssParams.fail();
                                        });
                                }
                            };

                            // ✅ NEW API (v31+)
                            params.api.setGridOption(
                                'serverSideDatasource',
                                serverSideDatasource
                            );
                        }

                    };

                    gridApi = agGrid.createGrid(gridDiv, gridOptions);
                });
            }
            else if ($scope.InsSubTab == 'RenderingProvider') {
                $scope.RenderingProviderCount = 0;
                $uibModalInstance.rendered.then(function () {

                    const gridDiv = document.getElementById('InsRenderingProviderpopupAgGrid');
                    if (!gridDiv) {
                        console.warn('Popup ag-Grid div not found');
                        return;
                    }
                    if (gridApi) {
                        gridApi.destroy();
                        gridApi = null;
                    }

                    const gridOptions = {
                        columnDefs: [
                            { headerName: "Billing NPI", field: "BillingProviderNPI" },
                            { headerName: "Billing Provider", field: "BillingProviderName" },
                            { headerName: "Professional", field: "RenderingProviderName" },
                            { headerName: "Professional NPI", field: "RenderingProviderNPI" },
                            { headerName: "Record No", field: "PatientMrNo" },
                            { headerName: "Patient", field: "PatientFullName" },
                            { headerName: "Claim No", field: "PatientClaimNumber" },
                            { headerName: "DOS", field: "DateOfServiceFrom" },
                            { headerName: "POS", field: "PlaceOfServiceName" },
                            { headerName: "Posting Date", field: "PostingDate" },
                            { headerName: "CheckEFT Date", field: "CheckEFTDate" },
                            { headerName: "Payor", field: "Payorname" },
                            { headerName: "Policy Id", field: "PolicyId" },
                            { headerName: "CPT", field: "CPTCODE" },
                            { headerName: "Procedure", field: "ProcedureName" },
                            { headerName: "Units", field: "ServiceUnits" },
                            { headerName: "Charges", field: "ChargeAmount" },
                            { headerName: "Insurance Paid", field: "InsurancePaidAmount" },
                            { headerName: "Adjustment codes", field: "Adjustmentcodes" },
                            { headerName: "Adjustment", field: "Adjustment" },
                            { headerName: "Insurance Balance", field: "Balance" },
                        ],
                        defaultColDef: {
                            flex: 1,
                            minWidth: 120,
                            sortable: false,
                            filter: false,
                            resizable: true,
                            suppressHeaderMenuButton: false,
                            // suppressHeaderContextMenu: true
                        },
                        rowModelType: 'serverSide',
                        // serverSideStoreType: 'partial',
                        //serverSideInitialRowCount: 0,
                        cacheBlockSize: 100,
                        maxBlocksInCache: 5,
                        animateRows: false,
                        onGridReady: function (params) {
                            gridApi = params.api;
                            const serverSideDatasource = {
                                getRows: function (ssParams) {
                                    let payload = {
                                        "ParentOrganization": $scope.ParentHospitalId,
                                        "AllLocationInd": 1,
                                        "LocationIds": LocationIds || "",
                                        "AllBillingProviderInd": 1,
                                        "BillingProviderIds": BillingProviderIds || null,
                                        "AllRenderingProviderInd": 1,
                                        "RenderingProviderIds": RenderingProviderIds || null,
                                        // "RenderingProviderIds": $scope.SelectedId || null,
                                        "UserIds": UserIds || "",
                                        "AllMasterPayorsInd": $scope.MainPobj.AllMasterPayorsInd || 1,
                                        "MasterPayorIds": MasterPayorIds || null,
                                        "AllProcedureInd": $scope.MainPobj.AllProcedureInd || 1,
                                        "ProcedureIds": ProcedureIds || null,
                                        "AllReferralProviderInd": $scope.MainPobj.AllReferralProviderInd || 1,
                                        "ReferralProviderIds": PcpReferralIds || null,
                                        "AllPostingUsersInd": 1,
                                        "PostingUserIds": UserIds,
                                        "PaymentEndDate": $scope.MainPobj.PaymentToDate || "",
                                        "PaymentStartDate": $scope.MainPobj.PaymentFromDate || "",
                                        "DOSFrom": $scope.MainPobj.DOSFromDate || "",
                                        "DOSTo": $scope.MainPobj.DOSToDate || "",
                                        "ChkPostedFromDate": $scope.MainPobj.ChkPostedFromDate || "",
                                        "ChkPostedToDate": $scope.MainPobj.ChkPostedToDate || "",
                                        "StartRow": ssParams.request.startRow,
                                        "EndRow": ssParams.request.endRow

                                    };

                                    eHnoteInsuranceService.GetInsuranceDetailedPaymentsByRenderingProviderId_New(payload)
                                        .then(function (resp) {
                                            if (resp.data.status === "Success") {
                                                const rows = resp.data.rows;
                                                if (rows.length > 0) {
                                                    angular.forEach(rows, function (item) {
                                                        item.CheckEFTDate = $filter('date')(item.CheckEFTDate, "MM-dd-yyyy");
                                                        item.DateOfServiceFrom = $filter('date')(item.DateOfServiceFrom, "MM-dd-yyyy");
                                                        item.PostingDate = $filter('date')(item.PostingDate, "MM-dd-yyyy");
                                                    })
                                                }
                                                $scope.RenderingProviderCount = resp.data.Count;
                                                const totalCount = resp.data.Count;
                                                if (ssParams.request.startRow === 0) {

                                                    $scope.insRptotalCharges = 0;
                                                    $scope.insRptotalInsPaid = 0;
                                                    $scope.insRptotalAdjustment = 0;
                                                    $scope.insRptotalBalance = 0;
                                                }

                                                const currentCharges =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.ChargeAmount) || 0);
                                                    }, 0);

                                                const currentInsPaid =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.InsurancePaidAmount) || 0);
                                                    }, 0);

                                                const currentAdjustment =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.Adjustment) || 0);
                                                    }, 0);

                                                const currentBalance =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.Balance) || 0);
                                                    }, 0);

                                                $scope.insRptotalCharges += currentCharges;
                                                $scope.insRptotalInsPaid += currentInsPaid;
                                                $scope.insRptotalAdjustment += currentAdjustment;
                                                $scope.insRptotalBalance += currentBalance;

                                                gridApi.setGridOption('pinnedBottomRowData', [{
                                                    BillingProviderNPI: 'TOTALS',
                                                    ChargeAmount: $scope.insRptotalCharges.toFixed(2),
                                                    InsurancePaidAmount: $scope.insRptotalInsPaid.toFixed(2),
                                                    Adjustment: $scope.insRptotalAdjustment.toFixed(2),
                                                    Balance: $scope.insRptotalBalance.toFixed(2)
                                                }]);

                                                
                                                // VERY IMPORTANT
                                                const lastRow =
                                                    ssParams.request.endRow >= totalCount
                                                        ? totalCount
                                                        : 10000;

                                                ssParams.success({
                                                    rowData: rows,
                                                    rowCount: lastRow
                                                });
                                            } else {
                                                ssParams.fail();
                                            }
                                        })
                                        .catch(function () {
                                            ssParams.fail();
                                        });
                                }
                            };

                            // ✅ NEW API (v31+)
                            params.api.setGridOption(
                                'serverSideDatasource',
                                serverSideDatasource
                            );
                        }

                    };

                    gridApi = agGrid.createGrid(gridDiv, gridOptions);
                });
            }
            else if ($scope.InsSubTab == 'Payor') {
                $scope.PayorCount = 0;
                $uibModalInstance.rendered.then(function () {

                    const gridDiv = document.getElementById('InsPayorpopupAgGrid');
                    if (!gridDiv) {
                        console.warn('Popup ag-Grid div not found');
                        return;
                    }
                    if (gridApi) {
                        gridApi.destroy();
                        gridApi = null;
                    }


                    const gridOptions = {
                        columnDefs: [
                            { headerName: "NPI", field: "BillingProviderNPI" },
                            { headerName: "Provider", field: "BillingProviderName" },
                            { headerName: "Professional", field: "RenderingProviderName" },
                            { headerName: "Professional NPI", field: "RenderingProviderNPI" },
                            { headerName: "Record No", field: "PatientMrNo" },
                            { headerName: "Patient", field: "PatientFullName" },
                            { headerName: "Claim No", field: "PatientClaimNumber" },
                            { headerName: "DOS", field: "DateOfServiceFrom" },
                            { headerName: "POS", field: "PlaceOfServiceName" },
                            { headerName: "Posting Date", field: "PostingDate" },
                            { headerName: "CheckEFT Date", field: "CheckEFTDate" },
                            { headerName: "User Name", field: "PostingUserName" },
                            { headerName: "Payor", field: "PayorName" },
                            { headerName: "Policy Id", field: "PolicyId" },
                            { headerName: "CPT", field: "CPTCODE" },
                            { headerName: "Procedure", field: "ProcedureName" },
                            { headerName: "Units", field: "ServiceUnits" },
                            { headerName: "Charges", field: "ChargeAmount" },
                            { headerName: "Insurance Paid", field: "InsurancePaidAmount" },
                            { headerName: "Adjustment codes", field: "Adjustmentcodes" },
                            { headerName: "Adjustment", field: "Adjustment" },
                            { headerName: "Insurance Balance", field: "Balance" },
                        ],
                        defaultColDef: {
                            flex: 1,
                            minWidth: 120,
                            sortable: false,
                            filter: false,
                            resizable: true,
                            suppressHeaderMenuButton: false,
                            // suppressHeaderContextMenu: true
                        },
                        rowModelType: 'serverSide',
                        // serverSideStoreType: 'partial',
                        //serverSideInitialRowCount: 0,
                        cacheBlockSize: 100,
                        maxBlocksInCache: 5,
                        animateRows: false,

                        onGridReady: function (params) {
                            gridApi = params.api;

                            const serverSideDatasource = {
                                getRows: function (ssParams) {


                                    let payload = {
                                        "ParentOrganization": $scope.ParentHospitalId,
                                        "AllLocationInd": 1,
                                        "LocationIds": LocationIds || "",
                                        "AllBillingProviderInd": 1,
                                        "BillingProviderIds": BillingProviderIds || null,
                                        "AllRenderingProviderInd": 1,
                                        "RenderingProviderIds": RenderingProviderIds || null,
                                        "UserIds": UserIds || "",
                                        "AllMasterPayorsInd": 0,
                                        //  "AllMasterPayorsInd": $scope.MainPobj.AllMasterPayorsInd || 1,
                                        "MasterPayorIds": MasterPayorIds || null,
                                        //"MasterPayorIds": $scope.SelectedId || null,
                                        "AllProcedureInd": $scope.MainPobj.AllProcedureInd || 1,
                                        "ProcedureIds": ProcedureIds || null,
                                        "AllReferralProviderInd": $scope.MainPobj.AllReferralProviderInd || 1,
                                        "ReferralProviderIds": PcpReferralIds || null,
                                        "AllPostingUsersInd": 1,
                                        "PostingUserIds": UserIds,
                                        "PaymentEndDate": $scope.MainPobj.PaymentToDate || "",
                                        "PaymentStartDate": $scope.MainPobj.PaymentFromDate || "",
                                        "DOSFrom": $scope.MainPobj.DOSFromDate || "",
                                        "DOSTo": $scope.MainPobj.DOSToDate || "",
                                        "ChkPostedFromDate": $scope.MainPobj.ChkPostedFromDate || "",
                                        "ChkPostedToDate": $scope.MainPobj.ChkPostedToDate || "",
                                        "StartRow": ssParams.request.startRow,
                                        "EndRow": ssParams.request.endRow

                                    };

                                    eHnoteInsuranceService.GetInsuranceDetailedPaymentsByPayors_New(payload)
                                        .then(function (resp) {
                                            if (resp.data.status === "Success") {
                                                const rows = resp.data.rows;
                                                $scope.PayorCount = resp.data.Count;
                                                const totalCount = resp.data.Count;
                                                if (rows.length > 0) {
                                                    angular.forEach(rows, function (item) {
                                                        item.CheckEFTDate = $filter('date')(item.CheckEFTDate, "MM-dd-yyyy");
                                                        item.DateOfServiceFrom = $filter('date')(item.DateOfServiceFrom, "MM-dd-yyyy");
                                                        item.PostingDate = $filter('date')(item.PostingDate, "MM-dd-yyyy");
                                                    })
                                                }
                                                if (ssParams.request.startRow === 0) {

                                                    $scope.inspayortotalCharges = 0;
                                                    $scope.inspayortotalInsPaid = 0;
                                                    $scope.inspayortotalAdjustment = 0;
                                                    $scope.inspayortotalBalance = 0;
                                                }

                                                const currentCharges =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.ChargeAmount) || 0);
                                                    }, 0);

                                                const currentInsPaid =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.InsurancePaidAmount) || 0);
                                                    }, 0);

                                                const currentAdjustment =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.Adjustment) || 0);
                                                    }, 0);

                                                const currentBalance =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.Balance) || 0);
                                                    }, 0);

                                                $scope.inspayortotalCharges += currentCharges;
                                                $scope.inspayortotalInsPaid += currentInsPaid;
                                                $scope.inspayortotalAdjustment += currentAdjustment;
                                                $scope.inspayortotalBalance += currentBalance;

                                                gridApi.setGridOption('pinnedBottomRowData', [{
                                                    BillingProviderNPI: 'TOTALS',
                                                    ChargeAmount: $scope.inspayortotalCharges.toFixed(2),
                                                    InsurancePaidAmount: $scope.inspayortotalInsPaid.toFixed(2),
                                                    Adjustment: $scope.inspayortotalAdjustment.toFixed(2),
                                                    Balance: $scope.inspayortotalBalance.toFixed(2)
                                                }]);
                                                // VERY IMPORTANT
                                                const lastRow =
                                                    ssParams.request.endRow >= totalCount
                                                        ? totalCount
                                                        : 10000;

                                                ssParams.success({
                                                    rowData: rows,
                                                    rowCount: lastRow
                                                });
                                            } else {
                                                ssParams.fail();
                                            }
                                        })
                                        .catch(function () {
                                            ssParams.fail();
                                        });
                                }
                            };

                            // ✅ NEW API (v31+)
                            params.api.setGridOption(
                                'serverSideDatasource',
                                serverSideDatasource
                            );
                        }

                    };

                    gridApi = agGrid.createGrid(gridDiv, gridOptions);
                });
            }

            else {

            }
        }

        $scope.init();


        $scope.closeFilterPopover = function () {
            angular.element(document.querySelector('.popover')).remove();
        };
        $scope.isPopoverOpen = false;
        $scope.togglePopover = function () {
            $scope.isPopoverOpen = !$scope.isPopoverOpen;
        };

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
        $scope.ChangeInsurancePayor = function (item) {
            if ($scope.MainPobj.AllPayorList.length > 0) {
                var filterList = $filter("filter")($scope.MainPobj.AllPayorList, { "PayorId": item.OrganizationPayorId }, true) || [];
                if (filterList.length == 0) {
                    let obj = {
                        "PayorId": item.OrganizationPayorId,
                        "PayorName": item.OrganizationPayorName,
                    }
                    $scope.MainPobj.AllPayorList.push(obj);
                } else {
                    alertify.error("Payor is already selected");
                    return false;
                }
            } else {
                let obj = {
                    "PayorId": item.OrganizationPayorId,
                    "PayorName": item.OrganizationPayorName,
                }
                $scope.MainPobj.AllPayorList.push(obj);
            }
            $scope.MainPobj.PayorObj = "";

        }

        $scope.GetReferalPCPDoctors = function (val, typeid) {

            var searchText = "", searchNpi = "";
            if (/^[0-9]+$/.test(val)) {
                searchNpi = val;
            } else {
                searchText = val;
            }
            $scope.IsProviderDrListEmpty = false;

            var newreqObj = {
                'LocationId': null,
                'PageNumber': 1,
                'PageSize': 10,
                'SearchTaxt': searchText || '',
                'NPI': searchNpi || '',
                "SpecializationId": null,
                "RefaralTypeId": typeid,
                "DeleteInd": 'N',
                "OrganizationId": $scope.HospitalId
            };
            return eHnoteReferalDataService.GetReferalPCPDoctors(newreqObj).then(function (resp) {

                if (resp.data.status == "Success") {
                    if (resp.data.count == 0) {
                        $scope.IsProviderDrListEmpty = true;
                    }
                    return resp.data.PcpRefdetails.map(function (mitem) {
                        return mitem;
                    });
                } else {
                    alertify.error(resp.data.Message);
                }
            }, function (error) {
                console.log(error);
            });

        };

        $scope.onSelectReferral = function (item) {
            if ($scope.MainPobj.AllReferalList.length > 0) {
                var filterList = $filter("filter")($scope.MainPobj.AllReferalList, { "PcpReferralId": item.PcpReferralId }, true) || [];
                if (filterList.length == 0) {
                    let obj = {
                        "PcpReferralId": item.PcpReferralId,
                        "FullName": item.FullName,
                    }
                    $scope.MainPobj.AllReferalList.push(obj);
                } else {
                    alertify.error("Referal is already selected");
                    return false;
                }
            } else {
                let obj = {
                    "PcpReferralId": item.PcpReferralId,
                    "FullName": item.FullName,
                }
                $scope.MainPobj.AllReferalList.push(obj);
            }
            $scope.MainPobj.ReferringObj = "";

        }

        $scope.onselectServiceItem = function (item) {
            if ($scope.MainPobj.AllProcedureList.length > 0) {
                var filterList = $filter("filter")($scope.MainPobj.AllProcedureList, { "ProcedureId": item.ProcedureId }, true) || [];
                if (filterList.length == 0) {
                    let obj = {
                        "ProcedureId": item.ProcedureId,
                        "ProcedureName": item.ProcedureName,
                    }
                    $scope.MainPobj.AllProcedureList.push(obj);
                } else {
                    alertify.error("Procedure is already selected");
                    return false;
                }
            } else {
                let obj = {
                    "ProcedureId": item.ProcedureId,
                    "ProcedureName": item.ProcedureName,
                }
                $scope.MainPobj.AllProcedureList.push(obj);
            }
            $scope.MainPobj.ServiceObj = "";

        }

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
                "ParentOrganizationId": $scope.ParentHospitalId || null
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

        $scope.DeleteProcedure = function (index, item) {
            $scope.MainPobj.AllProcedureList.splice(index, 1);
        }

        $scope.DeleteReferal = function (index, item) {
            $scope.MainPobj.AllReferalList.splice(index, 1);
        }

        $scope.DeletePayor = function (index, item) {
            $scope.MainPobj.AllPayorList.splice(index, 1);
        }
        $scope.ClearAllPayor = function () {
            $scope.MainPobj.AllPayorList = [];
        }
        $scope.ClearAllReferal = function () {
            $scope.MainPobj.AllReferalList = [];
        }
        $scope.ClearAllProcedure = function () {
            $scope.MainPobj.AllProcedureList = [];
        }


        $scope.checkInsuranceAllBillingProviders = function (val) {
            angular.forEach($scope.MainPobj.BillingProviderList, function (item) {
                item.IsChecked = val;
            });
            $scope.MainPobj.SelectBillingProviderString = val ? "All" : "Select Billing Provider";
        };
        $scope.InsuranceProviderToggle = function (item) {
            const checkedCount = $scope.MainPobj.BillingProviderList.filter(i => i.IsChecked).length;

            $scope.MainPobj.AllBillingProviderStatusCheck = checkedCount === $scope.MainPobj.BillingProviderList.length;
            if (checkedCount === 0) {
                $scope.MainPobj.SelectBillingProviderString = "Select Billing Provider";
            } else if ($scope.MainPobj.AllBillingProviderStatusCheck) {
                $scope.MainPobj.SelectBillingProviderString = "All";
            } else {
                $scope.MainPobj.SelectBillingProviderString = "Selected";
            }
        };

        $scope.InsuranceRenderingToggle = function (item) {
            var checkedArray = _.where($scope.MainPobj.RenderingProviderList, { IsChecked: true });
            $scope.MainPobj.AllRenderingStatusCheck = checkedArray.length > 0 && $scope.MainPobj.RenderingProviderList.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.MainPobj.SelectRenderingStatusString = "Select";
            } else {
                if (checkedArray.length === 1) {
                    $scope.MainPobj.SelectRenderingStatusString = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                } else {
                    $scope.MainPobj.SelectRenderingStatusString = "Selected";
                }
            }

        };
        $scope.InsuranceUserToggle = function (item) {
            var checkedArray = _.where($scope.MainPobj.AllUsersList, { IsChecked: true });
            $scope.MainPobj.AllUserStatusCheck = checkedArray.length > 0 && $scope.MainPobj.AllUsersList.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.MainPobj.SelectUserStatusString = "Select";
            } else {
                if (checkedArray.length === 1) {
                    $scope.MainPobj.SelectUserStatusString = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                } else {
                    $scope.MainPobj.SelectUserStatusString = "Selected";
                }
            }

        };
        $scope.checkAllRendering = function (val) {
            if (val) {
                angular.forEach($scope.MainPobj.RenderingProviderList, function (item) {
                    item.IsChecked = true;
                });
                $scope.MainPobj.SelectRenderingStatusString = 'All Doctors';
            } else {
                angular.forEach($scope.MainPobj.RenderingProviderList, function (item) {
                    item.IsChecked = false;
                });
                $scope.MainPobj.SelectRenderingStatusString = 'Select';
            }
            var checkedArray = _.where($scope.MainPobj.RenderingProviderList, { IsChecked: true });
            $scope.MainPobj.AllRenderingStatusCheck = checkedArray.length > 0 && $scope.MainPobj.RenderingProviderList.length === checkedArray.length ? true : false;

        };
        $scope.checkAllInsuranceUser = function (val) {
            if (val) {
                angular.forEach($scope.MainPobj.AllUsersList, function (item) {
                    item.IsChecked = true;
                });
                $scope.MainPobj.SelectUserStatusString = 'All Doctors';
            } else {
                angular.forEach($scope.MainPobj.AllUsersList, function (item) {
                    item.IsChecked = false;
                });
                $scope.MainPobj.SelectUserStatusString = 'Select';
            }
            var checkedArray = _.where($scope.MainPobj.AllUsersList, { IsChecked: true });
            $scope.MainPobj.AllUserStatusCheck = checkedArray.length > 0 && $scope.MainPobj.AllUsersList.length === checkedArray.length ? true : false;

        };
        $scope.ClearInsuranceFilters = function (Type) {

            angular.element(document.querySelector('.popover')).remove();
            Type = Type || "";
            if ($scope.MainPobj.AllBranchesList.length > 0) {
                $scope.MainPobj.AllBranchesList = angular.copy($scope.MainPobj.AllBranchesList);
                angular.forEach($scope.MainPobj.AllBranchesList, function (Aitem) {
                    Aitem.IsChecked = true;
                });
                $scope.MainPobj.SelectLocationString = "Selected";
                $scope.MainPobj.AllLocationStatusCheck = true;
            }
            if ($scope.MainPobj.BillingProviderList.length > 0) {
                angular.forEach($scope.MainPobj.BillingProviderList, function (item) {
                    item.IsChecked = true;
                });

            }



            $scope.MainPobj.PatientPayFromDate = $filter('date')(new Date(), "MM-dd-yyyy") || '';
            $scope.MainPobj.PatientPayToDate = $filter('date')(new Date(), "MM-dd-yyyy") || '';

            $scope.MainPobj.ServiceFromDate = '';
            $scope.MainPobj.ServiceToDate = '';
            var currentDate = new Date();
            $scope.MainPobj.PaymentDateRangeId = 4;
            $scope.MainPobj.PaymentFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            $scope.MainPobj.PaymentToDate = new Date();
            $scope.MainPobj.ServiceDateRangeId = 0;

            if ($scope.MainPobj.AllUsersList.length > 0) {
                $scope.MainPobj.AllUsersList = angular.copy($scope.MainPobj.AllUsersList);
                angular.forEach($scope.MainPobj.AllUsersList, function (item) {
                    item.IsChecked = true;
                });
                $scope.MainPobj.SelectUserStatusString = "All";
                $scope.MainPobj.AllUserStatusCheck = true;
            }
            if ($scope.MainPobj.RenderingProviderList.length > 0) {
                angular.forEach($scope.MainPobj.RenderingProviderList, function (item) {
                    item.IsChecked = true;
                });
                $scope.selectedDoctor = "All Doctors";
                $scope.MainPobj.AllDoctorCheck = true;
            }
        };


        $scope.ClickForInsuranceFilteredData = function () {
            angular.element(document.querySelector('.popover')).remove();
            $scope.pageload();

        }




        $scope.GetExcelReportsObj = function () {
            let obj = {
                "ExportJobId": 0,
                "UserId": $scope.UserId,
                "RequestedByUserId": $scope.UserId || null,
                "RequestedByUserName": "",
                "OrganizationId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParentHospitalId,
                "ReportName": "Patient Payment Detailed Report By BillingProvider",
                "ReportId": 1,
                "StatusId": 1,
                "StatusName": "Pending",
                "IsManualExport": true,
                "CSVFileName": "",
                "CSVFileExt": ".csv",
                "CSVFileUrl": null,
                "ErrorMessage": null,
                "startedOn": new Date(),
                "CompletedOn": null,
                "DeleteInd": "N",
                "AllBranchesList": $scope.MainPobj.AllBranchesList,
                "AllBillingProviderList": $scope.MainPobj.BillingProviderList,
                "AllUsersList": $scope.MainPobj.AllUsersList,
                "AllRenderingProviderList": $scope.MainPobj.RenderingProviderDoctorsList,
                "AllMasterPaymentsMethods": $scope.MainPobj.AllMasterPaymentsMethods,
                "RequestType": "Immediate",

            };

            return obj;
        }


        $scope.ExcelReportsObj = $scope.GetExcelReportsObj();

        $scope.ClickForExceldData = function () {
            const LocationIds = ($scope.MainPobj.AllBranchesList || [])
                .filter(x => x.IsChecked && x.ClinicId !== 0)
                .map(x => x.ClinicId)
                .join(",");
            const BillingProviderIds = ($scope.MainPobj.BillingProviderList || [])
                .filter(x => x.IsChecked)
                .map(x => x.OrganizationBillingProviderId)
                .join(",");
            const RenderingProviderIds = ($scope.MainPobj.RenderingProviderList || [])
                .filter(x => x.IsChecked)
                .map(x => x.DoctorID)
                .join(",");
            const UserIds = ($scope.MainPobj.AllUsersList || [])
                .map(x => x.DoctorID)
                .join(",");
            const PaymentModeIds = ($scope.MainPobj.AllMasterPaymentsMethods || [])
                .filter(x => x.IsChecked)
                .map(x => x.PaymentModeId)
                .join(",");

            var MasterPayorIds = null;
            if ($scope.MainPobj.AllPayorList.length > 0) {
                MasterPayorIds = $scope.MainPobj.AllPayorList
                    .map(pitem => pitem.PayorId)
                    .join(",");

            }

            var PcpReferralIds = null;

            if ($scope.MainPobj.AllReferalList.length > 0) {
                PcpReferralIds = $scope.MainPobj.AllReferalList
                    .map(pitem => pitem.PcpReferralId)
                    .join(",");

            }

            var ProcedureIds = null;

            if ($scope.MainPobj.AllProcedureList.length > 0) {
                ProcedureIds = $scope.MainPobj.AllProcedureList
                    .map(pitem => pitem.ProcedureId)
                    .join(",");

            }

            let filtredArray = $filter("filter")($scope.MainPobj.AllUsersList, { "DoctorID": $scope.UserId }, true) || [];
            if (filtredArray.length > 0) {
                $scope.ExcelReportsObj.RequestedByUserName = filtredArray[0].FullName || "";
            }
            var startDate = new Date($scope.MainPobj.PaymentFromDate);
            var endDate = new Date($scope.MainPobj.PaymentToDate);

            // Calculate difference in days
            var diffTime = endDate - startDate;
            var diffDays = diffTime / (1000 * 60 * 60 * 24);

            // Condition
            if (diffDays <= 7) {
                $scope.ExcelReportsObj.RequestType = "Immediate";
            } else {
                $scope.ExcelReportsObj.RequestType = "TaskRun";
            }

            if ($scope.InsSubTab == 'BillingProvider') {
                $scope.ExcelReportsObj.ReportId = 5;
                $scope.ExcelReportsObj.ReportName = "Insurance Payment Detailed Report By BillingProvider";
            }
            else if ($scope.InsSubTab == 'RenderingProvider') {
                $scope.ExcelReportsObj.ReportId = 6;
                $scope.ExcelReportsObj.ReportName = "Insurance Payment Detailed Report By RenderingProvider";
            }
            else if ($scope.InsSubTab == 'Payor') {
                $scope.ExcelReportsObj.ReportId = 7;
                $scope.ExcelReportsObj.ReportName = "Insurance Payment Detailed Report By Payor";
            } else {

            }
            let obj = {
                "ExportJobId": $scope.ExcelReportsObj.ExportJobId,
                "RequestedByUserId": $scope.ExcelReportsObj.RequestedByUserId,
                "RequestedByUserName": $scope.ExcelReportsObj.RequestedByUserName,
                "UserId": $scope.UserId,
                "OrganizationId": $scope.ExcelReportsObj.OrganizationId,
                "ParentOrganizationId": $scope.ExcelReportsObj.ParentOrganizationId,
                "ReportName": $scope.ExcelReportsObj.ReportName,
                "ReportId": $scope.ExcelReportsObj.ReportId,
                "StatusId": $scope.ExcelReportsObj.StatusId,
                "StatusName": $scope.ExcelReportsObj.StatusName,
                "IsManualExport": $scope.ExcelReportsObj.IsManualExport,
                "CSVFileName": $scope.ExcelReportsObj.CSVFileName,
                "CSVFileExt": $scope.ExcelReportsObj.CSVFileExt,
                "CSVFileUrl": $scope.ExcelReportsObj.CSVFileUrl,
                "ErrorMessage": $scope.ExcelReportsObj.ErrorMessage,
                "StartedOn": $scope.ExcelReportsObj.StartedOn,
                "CompletedOn": $scope.ExcelReportsObj.CompletedOn,
                "DeleteInd": $scope.ExcelReportsObj.DeleteInd,
                "RequestType": $scope.ExcelReportsObj.RequestType,
                "RequestDetails": {
                    "PaymentFromDate": $scope.MainPobj.PaymentFromDate,
                    "PaymentToDate": $scope.MainPobj.PaymentToDate,
                    "LocationIds": LocationIds,
                    "BillingProviderIds": BillingProviderIds,
                    "RenderingProviderIds": RenderingProviderIds,
                    "UserIds": UserIds,
                    "MasterPayorIds": MasterPayorIds || null,
                    "ProcedureIds": ProcedureIds || null,
                    "ReferralProviderIds": PcpReferralIds || null,
                    "PaymentModeIds": PaymentModeIds || null,
                    "DOSStartDate": $scope.MainPobj.DOSFromDate,
                    "DOSEndDate": $scope.MainPobj.DOSToDate,
                    "ChkPostedFromDate": $scope.MainPobj.ChkPostedFromDate || "",
                    "ChkPostedToDate": $scope.MainPobj.ChkPostedToDate || "",
                }
            };

            eHnoteInsuranceService.InitiateInsuranceDetailedPaymentCSVData(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    alertify.success("Excel file exported successfully");
                    return false;
                } else {
                    alertify.error(resp.data.Message);
                }
            });


        }

        $scope.excelExports = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/USBilling/uibpopups/excelExport.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__seventy--",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };
        $scope.GetExcelDetailsObj = function () {
            let obj = {

                "UserId": $scope.UserId,
                "RequestedByUserId": null,
                "OrganizationId": $scope.HospitalId,
                "ParentOrganizationId": $scope.ParentHospitalId,
                "FromDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "ToDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PageSize": 100,
                "PageNumber": 1,
                "StatusId": null,
                "ReportId": null,
                "SelectUserStatusString": "All",
                "AllUserStatusCheck": true,
                "UserFullName": "",
                "AllUsersList": angular.copy($scope.MainPobj.AllUsersList) || [],
            };

            return obj;


        }

        $scope.ExcelDetailsObj = $scope.GetExcelDetailsObj();

        $scope.GetExportStatusList = function (activeMasterReportId) {

            let obj = {
                "OrganizationId": $scope.ExcelDetailsObj.OrganizationId,
                "RequestedByUserId": $scope.ExcelDetailsObj.RequestedByUserId,
                "FromDate": "",
                "ToDate": "",
                "PageSize": $scope.ExcelDetailsObj.PageSize,
                "PageNumber": $scope.ExcelDetailsObj.PageNumber,
                "StatusId": $scope.ExcelDetailsObj.StatusId,
                "ReportId": $scope.ExcelDetailsObj.ReportId,
            };

            eHnoteInsuranceService.GetReportExportJobsStatusList(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    let allReports = resp.data.rows || [];
                    $scope.ExportSummarylist = allReports.filter(function (item) {
                        return item.MasterReportId === activeMasterReportId;
                    });

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }
        $scope.excelExports = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/USBilling/uibpopups/excelExport.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__seventy--",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    if ($scope.InsSubTab == 'BillingProvider') {
                        $scope.ExcelReportsObj.ReportId = 5;
                        $scope.ExcelReportsObj.ReportName = "Insurance Payment Detailed Report By BillingProvider";
                    }
                    else if ($scope.InsSubTab == 'RenderingProvider') {
                        $scope.ExcelReportsObj.ReportId = 6;
                        $scope.ExcelReportsObj.ReportName = "Insurance Payment Detailed Report By RenderingProvider";
                    }
                    else if ($scope.InsSubTab == 'Payor') {
                        $scope.ExcelReportsObj.ReportId = 7;
                        $scope.ExcelReportsObj.ReportName = "Insurance Payment Detailed Report By Payor";
                    } else {

                    }
                    $scope.activeMasterReportId = $scope.ExcelReportsObj.ReportId;
                    $scope.GetExportStatusList($scope.activeMasterReportId);
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };
    }]);
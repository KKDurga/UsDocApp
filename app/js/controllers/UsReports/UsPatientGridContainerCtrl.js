"use strict";
eHnoteWebApp.controller("UsPatientGridContainerCtrl", ["$scope", "$uibModal", "$uibModalInstance", "$timeout", "PObj", "eHnoteInsuranceService", "eHnoteMasterDataService", "alertify","$filter",
    function ($scope, $uibModal, $uibModalInstance, $timeout, PObj, eHnoteInsuranceService, eHnoteMasterDataService, alertify, $filter) {

        /* ---------------- GRID API ---------------- */
        let gridApi = null;
        $scope.close = function () {
            if (gridApi) {
                gridApi.destroy();
                gridApi = null;
            }
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
        $scope.MainPobj.AllUsersList = PObj.Mainobj.ReportUsersList || [];
        $scope.Subtab = PObj.type || '';
        $scope.SelectedId = PObj.id || '';
        $scope.selectedDoctor = "All Doctors";





        $scope.ClickForFilteredData = function () {
            const LocationIds = ($scope.MainPobj.AllBranchesList || [])
                .filter(x => x.IsChecked && x.ClinicId !== 0)
                .map(x => x.ClinicId)
                .join(",");

            const BillingProviderIds = ($scope.MainPobj.BillingProviderList || [])
                .filter(x => x.IsChecked)
                .map(x => x.OrganizationBillingProviderId)
                .join(",");
            const RenderingProviderIds = ($scope.MainPobj.RenderingProviderDoctorsList || [])
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
            /* ---------------- GRID INIT (AFTER MODAL RENDER) ---------------- */
            if ($scope.Subtab == 'BillingProvider') {
                $scope.BillingProviderCount = 0;
                $uibModalInstance.rendered.then(function () {

                    const gridDiv = document.getElementById('popupAgGrid');
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
                            { headerName: "Creation Date", field: "Claim_CreationDate" },
                            { headerName: "Creation Time", field: "Claim_CreationTime" },
                            { headerName: "Claim No", field: "PatientClaimNumber" },
                            { headerName: "DOS", field: "DateOfServiceFrom" },
                            { headerName: "POS", field: "PlaceOfServiceName" },
                            { headerName: "Payment Date", field: "PaymentDate" },
                            { headerName: "User", field: "User" },
                            { headerName: "CPT", field: "CPTCODE" },
                            { headerName: "Procedure", field: "ProcedureName" },
                            { headerName: "Charges", field: "ChargeAmount" },
                            { headerName: "Type", field: "Paymenttype" },
                            { headerName: "Patient Paid", field: "PatientPaidAmount" },
                            { headerName: "Adjustment", field: "Adjustment" },
                            { headerName: "Patient Balance", field: "Balance" },

                        ],
                        defaultColDef: {
                            flex: 1,
                            minWidth: 120,
                            sortable: true,
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
                                        "LocationIds": LocationIds,
                                        "BillingProviderId": BillingProviderIds || null,
                                        "RenderingProviderIds": RenderingProviderIds,
                                        "PaymentTypeIds": PaymentModeIds,
                                        "UserIds": UserIds,
                                        "PaymentStartDate": $scope.MainPobj.PatientPayFromDate || "",
                                        "PaymentEndDate": $scope.MainPobj.PatientPayToDate || "",
                                        "ServiceStartDate": $scope.MainPobj.ServiceFromDate || "",
                                        "ServiceEndDate": $scope.MainPobj.ServiceToDate || "",
                                        "StartRow": ssParams.request.startRow,
                                        "EndRow": ssParams.request.endRow

                                    };

                                    eHnoteInsuranceService.GetPatientDetailedPaymentsByBillingProviderId(payload)
                                        .then(function (resp) {
                                            if (resp.data.status === "Success") {
                                                const rows = resp.data.rows || [];

                                                // Reset totals only first API call
                                                if (ssParams.request.startRow === 0) {

                                                    $scope.bptotalCharges = 0;
                                                    $scope.bptotalPatientPaid = 0;
                                                    $scope.bptotalAdjustment = 0;
                                                    $scope.bptotalBalance = 0;
                                                }

                                                // Format rows
                                                if (rows.length > 0) {
                                                    angular.forEach(rows, function (item) {

                                                        item.PaymentDate =
                                                            $filter('date')(item.PaymentDate, "MM-dd-yyyy");

                                                        item.Claim_CreationDate =
                                                            $filter('date')(item.Claim_CreationDate, "MM-dd-yyyy");

                                                        item.DateOfServiceFrom =
                                                            $filter('date')(item.DateOfServiceFrom, "MM-dd-yyyy");
                                                    });
                                                }
                                                $scope.BillingProviderCount = resp.data.Count;
                                                const totalCount = resp.data.Count;

                                                // Current API block totals
                                                const currentCharges =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.ChargeAmount) || 0);
                                                    }, 0);

                                                const currentPatientPaid =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.PatientPaidAmount) || 0);
                                                    }, 0);

                                                const currentAdjustment =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.Adjustment) || 0);
                                                    }, 0);

                                                const currentBalance =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.Balance) || 0);
                                                    }, 0);

                                                // Add scrolling totals
                                                $scope.bptotalCharges += currentCharges;
                                                $scope.bptotalPatientPaid += currentPatientPaid;
                                                $scope.bptotalAdjustment += currentAdjustment;
                                                $scope.bptotalBalance += currentBalance;

                                                // Footer totals
                                                gridApi.setGridOption('pinnedBottomRowData', [{
                                                    BillingProviderNPI: 'TOTALS',
                                                    ChargeAmount: $scope.bptotalCharges.toFixed(2),
                                                    PatientPaidAmount: $scope.bptotalPatientPaid.toFixed(2),
                                                    Adjustment: $scope.bptotalAdjustment.toFixed(2),
                                                    Balance: $scope.bptotalBalance.toFixed(2)
                                                }]);

                                                // Total row count
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
            else if ($scope.Subtab == 'RenderingProvider') {
                $scope.RenderingProviderCount = 0;
                $uibModalInstance.rendered.then(function () {

                    const gridDiv = document.getElementById('RenderingProviderpopupAgGrid');
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
                            { headerName: "Creation Date", field: "Claim_CreationDate" },
                            { headerName: "Creation Time", field: "Claim_CreationTime" },
                            { headerName: "Claim No", field: "PatientClaimNumber" },
                            { headerName: "DOS", field: "DateOfServiceFrom" },
                            { headerName: "POS", field: "PlaceOfServiceName" },
                            { headerName: "Payment Date", field: "PaymentDate" },
                            { headerName: "User", field: "User" },
                            { headerName: "CPT", field: "CPTCODE" },
                            { headerName: "Procedure", field: "ProcedureName" },
                            { headerName: "Type", field: "Paymenttype" },
                            { headerName: "Units", field: "ServiceUnits" },
                            { headerName: "Charges", field: "ChargeAmount" },
                            { headerName: "Patient Paid", field: "PatientPaidAmount" },
                            { headerName: "Adjustment", field: "Adjustment" },
                            { headerName: "Patient Balance", field: "Balance" },
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
                                        "LocationIds": LocationIds,
                                        "BillingProviderIds": BillingProviderIds || null,
                                        "RenderingProviderId": RenderingProviderIds,
                                        "PaymentTypeIds": PaymentModeIds,
                                        "UserIds": UserIds,
                                        "PaymentStartDate": $scope.MainPobj.PatientPayFromDate || "",
                                        "PaymentEndDate": $scope.MainPobj.PatientPayToDate || "",
                                        "ServiceStartDate": $scope.MainPobj.ServiceFromDate || "",
                                        "ServiceEndDate": $scope.MainPobj.ServiceToDate || "",
                                        "StartRow": ssParams.request.startRow,
                                        "EndRow": ssParams.request.endRow

                                    };

                                    eHnoteInsuranceService.GetPatientPaymentsByRenderingProviderId(payload)
                                        .then(function (resp) {
                                            if (resp.data.status === "Success") {
                                                const rows = resp.data.rows;
                                                if (rows.length > 0) {
                                                    angular.forEach(rows, function (item) {
                                                        item.PaymentDate = $filter('date')(item.PaymentDate, "MM-dd-yyyy");
                                                        item.Claim_CreationDate = $filter('date')(item.Claim_CreationDate, "MM-dd-yyyy");
                                                        item.DateOfServiceFrom = $filter('date')(item.DateOfServiceFrom, "MM-dd-yyyy");
                                                    })
                                                }
                                                $scope.RenderingProviderCount = resp.data.Count;
                                                const totalCount = resp.data.Count;
                                                // Reset only first API call
                                                if (ssParams.request.startRow === 0) {

                                                    $scope.rptotalCharges = 0;
                                                    $scope.rptotalPatientPaid = 0;
                                                    $scope.rptotalAdjustment = 0;
                                                    $scope.rptotalBalance = 0;
                                                }

                                                // Current block totals
                                                const currentCharges =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.ChargeAmount) || 0);
                                                    }, 0);

                                                const currentPatientPaid =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.PatientPaidAmount) || 0);
                                                    }, 0);

                                                const currentAdjustment =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.Adjustment) || 0);
                                                    }, 0);

                                                const currentBalance =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.Balance) || 0);
                                                    }, 0);

                                                // Add scrolling totals
                                                $scope.rptotalCharges += currentCharges;
                                                $scope.rptotalPatientPaid += currentPatientPaid;
                                                $scope.rptotalAdjustment += currentAdjustment;
                                                $scope.rptotalBalance += currentBalance;

                                                gridApi.setGridOption('pinnedBottomRowData', [{
                                                    BillingProviderNPI: 'TOTALS',
                                                    ChargeAmount: $scope.rptotalCharges.toFixed(2),
                                                    PatientPaidAmount: $scope.rptotalPatientPaid.toFixed(2),
                                                    Adjustment: $scope.rptotalAdjustment.toFixed(2),
                                                    Balance: $scope.rptotalBalance.toFixed(2)
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
            else if ($scope.Subtab == 'UserProvider') {
                $scope.UserCount = 0;
                $uibModalInstance.rendered.then(function () {

                    const gridDiv = document.getElementById('UserpopupAgGrid');
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
                            { headerName: "Record No", field: "PatientMrNo" },
                            { headerName: "Patient", field: "PatientFullName" },
                            { headerName: "Payment Date", field: "PaymentDate" },
                            { headerName: "Deposit Date", field: "DepositDate" },
                            { headerName: "Location", field: "OrganizationName" },
                            //{ headerName: "Billing NPI", field: "BillingProviderNPI" },
                            //{ headerName: "Billing Provider", field: "BillingProviderName" },
                            //{ headerName: "Professional", field: "RenderingProviderName" },
                            //{ headerName: "Professional NPI", field: "RenderingProviderNPI" },
                            { headerName: "User", field: "UserName" },
                            { headerName: "Receipt NO", field: "ReceiptNumber" },
                            { headerName: "Creation Date", field: "Claim_CreationDate" },
                            { headerName: "Creation Time", field: "Claim_CreationTime" },
                            { headerName: "Claim NO", field: "PatientClaimNumber" },
                            { headerName: "Type", field: "Paymenttype" },
                            { headerName: "Payment Type", field: "PaymentMethodName" },
                            { headerName: "Payment Amount", field: "PaymentAmount" },
                            { headerName: "Patient Adjustment", field: "Adjustment" },
                            { headerName: "Patient Balance", field: "Balance" },
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
                                        "LocationIdsList": LocationIds,
                                        "PaymentFromDate": $scope.MainPobj.PatientPayFromDate || "",
                                        "PaymentToDate": $scope.MainPobj.PatientPayToDate || "",
                                        "ServiceStartDate": $scope.MainPobj.ServiceFromDate || "",
                                        "ServiceEndDate": $scope.MainPobj.ServiceToDate || "",
                                        "PaymentMethodsList": PaymentModeIds,
                                        "UserId": UserIds || null,
                                        "StartRow": ssParams.request.startRow,
                                        "EndRow": ssParams.request.endRow

                                    };

                                    eHnoteInsuranceService.GetAllPatientPaymentsListByUserId(payload)
                                        .then(function (resp) {
                                            if (resp.data.status === "Success") {
                                                const rows = resp.data.rows;
                                                if (rows.length > 0) {
                                                    angular.forEach(rows, function (item) {
                                                        item.PaymentDate = $filter('date')(item.PaymentDate, "MM-dd-yyyy");
                                                        item.Claim_CreationDate = $filter('date')(item.Claim_CreationDate, "MM-dd-yyyy");
                                                        item.DepositDate = $filter('date')(item.DepositDate, "MM-dd-yyyy");
                                                    })
                                                }
                                                $scope.UserCount = resp.data.Count;
                                                const totalCount = resp.data.Count;
                                                if (ssParams.request.startRow === 0) {

                                                    $scope.totalPaymentAmount = 0;
                                                    $scope.totalAdjustment = 0;
                                                    $scope.totalBalance = 0;
                                                }

                                                const currentPaymentAmount =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.PaymentAmount) || 0);
                                                    }, 0);

                                                const currentAdjustment =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.Adjustment) || 0);
                                                    }, 0);

                                                const currentBalance =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.Balance) || 0);
                                                    }, 0);

                                                $scope.totalPaymentAmount += currentPaymentAmount;
                                                $scope.totalAdjustment += currentAdjustment;
                                                $scope.totalBalance += currentBalance;

                                                gridApi.setGridOption('pinnedBottomRowData', [{
                                                    PatientMrNo: 'TOTALS',
                                                    PaymentAmount: $scope.totalPaymentAmount.toFixed(2),
                                                    Adjustment: $scope.totalAdjustment.toFixed(2),
                                                    Balance: $scope.totalBalance.toFixed(2)
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
            else if ($scope.Subtab == 'PaymentType') {
                $scope.PaymentTypeCount = 0;
                $uibModalInstance.rendered.then(function () {

                    const gridDiv = document.getElementById('PaymentspopupAgGrid');
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
                            { headerName: "Record No", field: "PatientMrNo" },
                            { headerName: "Patient", field: "PatientFullName" },
                            { headerName: "Billing NPI", field: "BillingProviderNPI" },
                            { headerName: "Billing Provider", field: "BillingProviderName" },
                            { headerName: "Creation Date", field: "Claim_CreationDate" },
                            { headerName: "Creation Time", field: "Claim_CreationTime" },
                            { headerName: "Claim No", field: "PatientClaimNumber" },
                            { headerName: "Payment Date", field: "PaymentDate" },
                            { headerName: "Deposit Date", field: "DepositDate" },
                            { headerName: "Location", field: "OrganizationName" },
                            { headerName: "User", field: "UserName" },
                            { headerName: "Receipt NO", field: "ReceiptNumber" },
                            { headerName: "Type", field: "Paymenttype" },
                            { headerName: "Payment Method", field: "PaymentMethodName" },
                            { headerName: "Payment Amount", field: "PaymentAmount" },
                            { headerName: "Adjustment", field: "Adjustment" },
                            { headerName: "Patient Balance", field: "Balance" },
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
                                        "ParentOrganizationId": $scope.ParentHospitalId,
                                        "PaymentFromDate": $scope.MainPobj.PatientPayFromDate || "",
                                        "PaymentToDate": $scope.MainPobj.PatientPayToDate || "",
                                        "ServiceStartDate": $scope.MainPobj.ServiceFromDate || "",
                                        "ServiceEndDate": $scope.MainPobj.ServiceToDate || "",
                                        "LocationIdsList": LocationIds,
                                        "BillingProviderIds": BillingProviderIds,
                                        "UserIdsList": UserIds || "",
                                        "PaymentMethodsId": PaymentModeIds || null,
                                        "StartRow": ssParams.request.startRow,
                                        "EndRow": ssParams.request.endRow

                                    };

                                    eHnoteInsuranceService.GetAllPatientbyPaymentMethodId(payload)
                                        .then(function (resp) {
                                            if (resp.data.status === "Success") {
                                                const rows = resp.data.rows;
                                                if (rows.length > 0) {
                                                    angular.forEach(rows, function (item) {
                                                        item.PaymentDate = $filter('date')(item.PaymentDate, "MM-dd-yyyy");
                                                        item.Claim_CreationDate = $filter('date')(item.Claim_CreationDate, "MM-dd-yyyy");
                                                        item.DepositDate = $filter('date')(item.DepositDate, "MM-dd-yyyy");
                                                    })
                                                }
                                                $scope.PaymentTypeCount = resp.data.Count;
                                                const totalCount = resp.data.Count;
                                                if (ssParams.request.startRow === 0) {

                                                    $scope.totalPaymentAmount = 0;
                                                    $scope.totalAdjustment = 0;
                                                    $scope.totalBalance = 0;
                                                }

                                                const currentPaymentAmount =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.PaymentAmount) || 0);
                                                    }, 0);

                                                const currentAdjustment =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.Adjustment) || 0);
                                                    }, 0);

                                                const currentBalance =
                                                    rows.reduce(function (s, r) {
                                                        return s + (parseFloat(r.Balance) || 0);
                                                    }, 0);

                                                $scope.totalPaymentAmount += currentPaymentAmount;
                                                $scope.totalAdjustment += currentAdjustment;
                                                $scope.totalBalance += currentBalance;

                                                gridApi.setGridOption('pinnedBottomRowData', [{
                                                    PatientMrNo: 'TOTALS',
                                                    PaymentAmount: $scope.totalPaymentAmount.toFixed(2),
                                                    Adjustment: $scope.totalAdjustment.toFixed(2),
                                                    Balance: $scope.totalBalance.toFixed(2)
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

        $scope.ClickForFilteredData();


        $scope.init = function () {
            if ($scope.Subtab == 'BillingProvider') {
                if ($scope.MainPobj.BillingProviderList.length > 0) {
                    angular.forEach($scope.MainPobj.BillingProviderList, function (item) {
                        item.IsChecked = false;
                        if (item.OrganizationBillingProviderId == $scope.SelectedId) {
                            item.IsChecked = true;
                        }
                    });

                }
            }
            else if ($scope.Subtab == 'RenderingProvider') {
                if ($scope.MainPobj.RenderingProviderDoctorsList.length > 0) {
                    angular.forEach($scope.MainPobj.RenderingProviderDoctorsList, function (item) {
                        item.IsChecked = false;
                        if (item.DoctorID == $scope.SelectedId) {
                            item.IsChecked = true;
                        }
                    });

                }
            }
         
            else if ($scope.Subtab == 'UserProvider') {
                if ($scope.MainPobj.AllUsersList.length > 0) {
                    angular.forEach($scope.MainPobj.AllUsersList, function (item) {
                        item.IsChecked = false;
                        if (item.DoctorID == $scope.SelectedId) {
                            item.IsChecked = true;
                        }
                    });

                }
            
            }
            else if ($scope.Subtab == 'PaymentType') {
                if ($scope.MainPobj.AllMasterPaymentsMethods.length > 0) {
                    angular.forEach($scope.MainPobj.AllMasterPaymentsMethods, function (item) {
                        item.IsChecked = false;
                        if (item.PaymentModeId == $scope.SelectedId) {
                            item.IsChecked = true;
                        }
                    });

                }

            }
            else {

            }

            $scope.ClickForFilteredData();
        }
        $scope.init();

        $scope.GetExcelReportsObj = function () {
            let obj = {
                "ExportJobId": 0,
                "RequestedByUserId": $scope.UserId,
                "RequestedByUserName": "Vinay Kokkula",
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
                "StartedOn" :new Date(),
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

        $scope.PaymentDateRangeArray = [
            { Id: 1, Name: 'Today' },
            /* { Id: 2, Name: 'Yesterday' },*/
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

        function getLastCompletedMonthsInfo(monthCount) {

            var now = new Date();

            // End date = last day of previous month
            var endDate = new Date(now.getFullYear(), now.getMonth(), 0);

            // Start date = first day of (endDate - (monthCount - 1))
            var startDate = new Date(
                endDate.getFullYear(),
                endDate.getMonth() - (monthCount - 1),
                1
            );

            // Build months array
            var monthsArray = [];

            for (var i = monthCount - 1; i >= 0; i--) {
                var d = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
                monthsArray.push(moment(d).format("MMM-YYYY"));
            }

            return {
                startDate: startDate,
                endDate: endDate,
                months: monthsArray
            };
        }

        $scope.setPaymentDateRange = function (selectedRangeId) {
            var currentDate = new Date();

            switch (selectedRangeId) {
                case 1: // Today
                    $scope.MainPobj.PatientPayFromDate = new Date(currentDate);
                    $scope.MainPobj.PatientPayToDate = new Date(currentDate);
                    break;
                case 2: // Yesterday
                    $scope.MainPobj.PatientPayFromDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
                    var currentDate = new Date();
                    $scope.MainPobj.PatientPayToDate = new Date(currentDate.setDate(currentDate.getDate() - 1))// new Date(); // Reset to current date
                    break;
                case 3: // Last week
                    $scope.MainPobj.PatientPayFromDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                    $scope.MainPobj.PatientPayToDate = new Date(); // Reset to current date
                    break;
                case 4: // This month
                    $scope.MainPobj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    $scope.MainPobj.PatientPayToDate = new Date(); // Reset to current date
                    break;
                case 5: // Last month
                    $scope.MainPobj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    $scope.MainPobj.PatientPayToDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of the previous month
                    break;
                case 6: // Last 2 months

                    var result = getLastCompletedMonthsInfo(2);
                    $scope.MainPobj.PatientPayFromDate = result.startDate;
                    $scope.MainPobj.PatientPayToDate = result.endDate

                    //$scope.MainPobj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
                    //$scope.MainPobj.PatientPayToDate = new Date(); // Reset to current date
                    break;
                case 7: // Last 3 months

                    var result = getLastCompletedMonthsInfo(3);

                    $scope.MainPobj.PatientPayFromDate = result.startDate;
                    $scope.MainPobj.PatientPayToDate = result.endDate;

                    //$scope.MainPobj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
                    //$scope.MainPobj.PatientPayToDate = new Date(); // Reset to current date
                    break;
                case 8: // Last 6 months
                    $scope.MainPobj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
                    $scope.MainPobj.PatientPayToDate = new Date(); // Reset to current date
                    break;
                case 9: // This year
                    $scope.MainPobj.PatientPayFromDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of current year
                    $scope.MainPobj.PatientPayToDate = new Date(); // Reset to current date
                    break;
                case 10: // Last year
                    $scope.MainPobj.PatientPayFromDate = new Date(currentDate.getFullYear() - 1, 0, 1); // January 1st of last year
                    $scope.MainPobj.PatientPayToDate = new Date(currentDate.getFullYear() - 1, 11, 31); // December 31st of last year
                    break;
                case 11: // Custom Date
                    $scope.MainPobj.PatientPayFromDate = null;
                    $scope.MainPobj.PatientPayToDate = null;
                    break;
                default:
                    $scope.MainPobj.PatientPayFromDate = moment().format("MM-DD-YYYY") || null;
                    $scope.MainPobj.PatientPayToDate = moment().format("MM-DD-YYYY") || null;
            }

            $scope.MainPobj.PatientPayFromDate = $scope.MainPobj.PatientPayFromDate;
            $scope.MainPobj.PatientPayToDate = $scope.MainPobj.PatientPayToDate;

            if ($scope.MainPobj.PatientPayFromDate != '') {
                $scope.MainPobj.PatientPayFromDate = $filter('date')($scope.MainPobj.PatientPayFromDate, "MM-dd-yyyy");
            }
            if ($scope.MainPobj.PatientPayToDate != '') {
                $scope.MainPobj.PatientPayToDate = $filter('date')($scope.MainPobj.PatientPayToDate, "MM-dd-yyyy");
            }
        };

        $scope.isPopoverOpen = false;
        $scope.togglePopover = function () {
            $scope.isPopoverOpen = !$scope.isPopoverOpen;
        };
        $scope.ExcelBillingFilterPopover = {
            templateUrl: 'ExcelBillingFilterPopover.html',
        };



        $scope.ClickForExcelExportData = function () {
            const LocationIds = ($scope.MainPobj.AllBranchesList || [])
                .filter(x => x.IsChecked && x.ClinicId !== 0)
                .map(x => x.ClinicId)
                .join(",");
            const BillingProviderIds = ($scope.MainPobj.BillingProviderList || [])
                .filter(x => x.IsChecked)
                .map(x => x.OrganizationBillingProviderId)
                .join(",");
            const RenderingProviderIds = ($scope.MainPobj.RenderingProviderDoctorsList || [])
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

            var startDate = new Date($scope.MainPobj.PatientPayFromDate);
            var endDate = new Date($scope.MainPobj.PatientPayToDate);

            // Calculate difference in days
            var diffTime = endDate - startDate;
            var diffDays = diffTime / (1000 * 60 * 60 * 24);

            // Condition
            if (diffDays <= 7) {
                $scope.ExcelReportsObj.RequestType= "Immediate";
            } else {
                $scope.ExcelReportsObj.RequestType= "TaskRun";
            }

            let filtredArray = $filter("filter")($scope.MainPobj.AllUsersList, { "DoctorID": $scope.UserId }, true) || [];
            if (filtredArray.length > 0) {
                $scope.ExcelReportsObj.RequestedByUserName = filtredArray[0].FullName || "";
            }

            if ($scope.Subtab == 'BillingProvider') {
                $scope.ExcelReportsObj.ReportId = 1;
                $scope.ExcelReportsObj.ReportName = "Patient Payment Detailed Report By BillingProvider";
            }
            else if ($scope.Subtab == 'RenderingProvider') {
                $scope.ExcelReportsObj.ReportId = 2;
                $scope.ExcelReportsObj.ReportName = "Patient Payment Detailed Report By RenderingProvider";
            }
            else if ($scope.Subtab == 'UserProvider') {
                $scope.ExcelReportsObj.ReportId = 3;
                $scope.ExcelReportsObj.ReportName = "Patient Payment Detailed Report By User";
            }
            else if ($scope.Subtab == 'PaymentType') {
                $scope.ExcelReportsObj.ReportId = 4;
                $scope.ExcelReportsObj.ReportName = "Patient Payment Detailed Report By PaymentType";
            } else {

            }
            

            let obj = {
                "ExportJobId": $scope.ExcelReportsObj.ExportJobId,
                "UserId": $scope.UserId,
                "RequestedByUserId": $scope.ExcelReportsObj.RequestedByUserId,
                "RequestedByUserName": $scope.ExcelReportsObj.RequestedByUserName,
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
                    "PaymentFromDate": $scope.MainPobj.PatientPayFromDate,
                    "PaymentToDate": $scope.MainPobj.PatientPayToDate,
                    "LocationIds": LocationIds,
                    "BillingProviderIds": BillingProviderIds,
                    "RenderingProviderIds": RenderingProviderIds,
                    "UserIds": UserIds,
                    "PaymentModeIds": PaymentModeIds,
                    "DOSStartDate": $scope.MainPobj.ServiceFromDate,
                    "DOSEndDate": $scope.MainPobj.ServiceToDate
                }
            };  

            eHnoteInsuranceService.InitiatePatientDetailedPaymentCSVData(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    alertify.success("Excel file exported successfully");
                    return false;                   

                } else {
                    alertify.error(resp.data.Message);
                }
            });
            

        }

        $scope.ProviderToggle = function (item) {
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
        $scope.checkAllBillingProviders = function (val) {
            angular.forEach($scope.MainPobj.BillingProviderList, function (item) {
                item.IsChecked = val;
            });
            $scope.MainPobj.SelectBillingProviderString = val ? "All" : "Select Billing Provider";
            
        };

        $scope.checkAllDoctor = function (val) {
            if (val) {
                angular.forEach($scope.MainPobj.RenderingProviderDoctorsList, function (item) {
                    item.IsChecked = true;
                });
                $scope.selectedDoctor = 'All Doctors';
            } else {
                angular.forEach($scope.MainPobj.RenderingProviderDoctorsList, function (item) {
                    item.IsChecked = false;
                });
                $scope.selectedDoctor = 'Select';
            }
            var checkedArray = _.where($scope.MainPobj.RenderingProviderDoctorsList, { IsChecked: true });
            $scope.MainPobj.AllDoctorCheck = checkedArray.length > 0 && $scope.MainPobj.RenderingProviderDoctorsList.length === checkedArray.length ? true : false;

        };
        $scope.DoctorToggle = function (item) {
            var checkedArray = _.where($scope.MainPobj.RenderingProviderDoctorsList, { IsChecked: true });
            $scope.MainPobj.AllDoctorCheck = checkedArray.length > 0 && $scope.MainPobj.RenderingProviderDoctorsList.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.selectedDoctor = "Select";
            } else {
                if (checkedArray.length === 1) {
                    $scope.selectedDoctor = checkedArray[0].SecondUserFullName + '-' + checkedArray[0].NPI;
                } else if (checkedArray.length == $scope.MainPobj.RenderingProviderDoctorsList.length) {
                    $scope.selectedDoctor = "All Doctors";
                } else {
                    $scope.selectedDoctor = "Selected";
                }
            }

        };

        $scope.CheckReportAllPaymentType = function (Val, Type) {
           
            if (Type == "User") {
                if (Val) {
                    $scope.MainPobj.SelectUserStatusString = "All";
                    angular.forEach($scope.MainPobj.ReportUsersList, function (Aitem) {
                        Aitem.IsChecked = true;
                    });
                } else {
                    $scope.MainPobj.SelectUserStatusString = "Select";
                    angular.forEach($scope.MainPobj.ReportUsersList, function (Aitem) {
                        Aitem.IsChecked = false;
                    });
                }
            } else {
                if (Val) {
                    $scope.MainPobj.SelectPaymentStatusString = "All";
                    angular.forEach($scope.MainPobj.AllMasterPaymentsMethods, function (Aitem) {
                        Aitem.IsChecked = true;
                    });
                } else {
                    $scope.MainPobj.SelectPaymentStatusString = "Select";
                    angular.forEach($scope.MainPobj.AllMasterPaymentsMethods, function (Aitem) {
                        Aitem.IsChecked = false;
                    });
                }
            }
             
        };



        $scope.ChangeReportsUser = function (item) {

            var checkedArray = _.where($scope.MainPobj.ReportUsersList, { IsChecked: true });
            $scope.MainPobj.AllUserStatusCheck = checkedArray.length > 0 && $scope.MainPobj.ReportUsersList.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.MainPobj.SelectUserStatusString = "Select";
            } else {
                if (checkedArray.length === 1) {
                    $scope.MainPobj.SelectUserStatusString = checkedArray[0].SecondUserFullName;
                } else if (checkedArray.length == $scope.MainPobj.ReportUsersList.length) {
                    $scope.MainPobj.SelectUserStatusString = "All";
                } else {
                    $scope.MainPobj.SelectUserStatusString = "Selected";
                }
            }
        };

        $scope.ChangeReportsPaymentType = function (item) {

            var checkedArray = _.where($scope.MainPobj.AllMasterPaymentsMethods, { IsChecked: true });
            $scope.MainPobj.AllStatusCheck = checkedArray.length > 0 && $scope.MainPobj.AllMasterPaymentsMethods.length === checkedArray.length ? true : false;

            if (checkedArray.length == 0) {
                $scope.MainPobj.SelectPaymentStatusString = "Select";
            } else {
                if (checkedArray.length === 1) {
                    $scope.MainPobj.SelectPaymentStatusString = checkedArray[0].PaymentModeName;
                } else if (checkedArray.length == $scope.MainPobj.AllMasterPaymentsMethods.length) {
                    $scope.MainPobj.SelectPaymentStatusString = "All";
                } else {
                    $scope.MainPobj.SelectPaymentStatusString = "Selected";
                }
            }
        };
        $scope.setServiceDateRange = function (selectedRangeId) {
            var currentDate = new Date();

            switch (selectedRangeId) {
                case 1: // Today
                    $scope.MainPobj.ServiceFromDate = new Date(currentDate);
                    $scope.MainPobj.ServiceToDate = new Date(currentDate);
                    break;
                case 2: // Yesterday
                    $scope.MainPobj.ServiceFromDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
                    var currentDate = new Date();
                    $scope.MainPobj.ServiceToDate = new Date(currentDate.setDate(currentDate.getDate() - 1))// new Date(); // Reset to current date
                    break;
                case 3: // Last week

                    var today = new Date();
                    var day = today.getDay(); // 0 = Sunday, 1 = Monday, ...

                    // Calculate last week's Monday
                    var lastWeekStart = new Date(today);
                    lastWeekStart.setDate(today.getDate() - day - 6);

                    // Calculate last week's Sunday
                    var lastWeekEnd = new Date(lastWeekStart);
                    lastWeekEnd.setDate(lastWeekStart.getDate() + 6);

                    $scope.MainPobj.ServiceFromDate = lastWeekStart;
                    $scope.MainPobj.ServiceToDate = lastWeekEnd;



                    //$scope.MainPobj.ServiceFromDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                    //$scope.MainPobj.ServiceToDate = new Date(); // Reset to current date
                    break;
                case 4: // This month
                    $scope.MainPobj.ServiceFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    $scope.MainPobj.ServiceToDate = new Date(); // Reset to current date
                    break;
                case 5: // Last month
                    $scope.MainPobj.ServiceFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    $scope.MainPobj.ServiceToDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of the previous month
                    break;
                case 6: // Last 2 months
                    $scope.MainPobj.ServiceFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
                    $scope.MainPobj.ServiceToDate = new Date(); // Reset to current date
                    break;
                case 7: // Last 3 months
                    $scope.MainPobj.ServiceFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
                    $scope.MainPobj.ServiceToDate = new Date(); // Reset to current date
                    break;
                case 8: // Last 6 months
                    $scope.MainPobj.ServiceFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);
                    $scope.MainPobj.ServiceToDate = new Date(); // Reset to current date
                    break;
                case 9: // This year
                    $scope.MainPobj.ServiceFromDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of current year
                    $scope.MainPobj.ServiceToDate = new Date(); // Reset to current date
                    break;
                case 10: // Last year
                    $scope.MainPobj.ServiceFromDate = new Date(currentDate.getFullYear() - 1, 0, 1); // January 1st of last year
                    $scope.MainPobj.ServiceToDate = new Date(currentDate.getFullYear() - 1, 11, 31); // December 31st of last year
                    break;
                case 11: // Custom Date
                    $scope.MainPobj.ServiceFromDate = null;
                    $scope.MainPobj.ServiceToDate = null;
                    break;
                default:
                    $scope.MainPobj.ServiceFromDate = "";
                    $scope.MainPobj.ServiceToDate = "";
            }

            $scope.MainPobj.ServiceFromDate = $scope.MainPobj.ServiceFromDate;
            $scope.MainPobj.ServiceToDate = $scope.MainPobj.ServiceToDate;

            if ($scope.MainPobj.ServiceFromDate != '') {
                $scope.MainPobj.ServiceFromDate = $filter('date')($scope.MainPobj.ServiceFromDate, "MM-dd-yyyy");
            }
            if ($scope.MainPobj.ServiceToDate != '') {
                $scope.MainPobj.ServiceToDate = $filter('date')($scope.MainPobj.ServiceToDate, "MM-dd-yyyy");
            }
        };

        $scope.ClearFilters = function (Type) {
            Type = Type || "";

            var currentDate = new Date();
            if ($scope.MainPobj.BillingProviderList.length > 0) {
                angular.forEach($scope.MainPobj.BillingProviderList, function (item) {
                    item.IsChecked = true;
                });

            }
            $scope.MainPobj.SelectBillingProviderString = "All";


            $scope.MainPobj.PatientPayFromDate = $filter('date')(new Date(), "MM-dd-yyyy") || '';
            $scope.MainPobj.PatientPayToDate = $filter('date')(new Date(), "MM-dd-yyyy") || '';

            $scope.MainPobj.ServiceFromDate = '';
            $scope.MainPobj.ServiceToDate = '';

            $scope.MainPobj.PaymentDateRangeId = 4;
            $scope.MainPobj.PatientPayFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            $scope.MainPobj.PatientPayToDate = new Date();
            $scope.MainPobj.ServiceDateRangeId = 0;


            if ($scope.MainPobj.AllMasterBranchesList.length > 0) {
                $scope.MainPobj.AllBranchesList = angular.copy($scope.MainPobj.AllMasterBranchesList);
                angular.forEach($scope.MainPobj.AllBranchesList, function (Aitem) {
                    Aitem.IsChecked = true;
                });
                $scope.MainPobj.SelectLocationString = "All";
                $scope.MainPobj.AllLocationStatusCheck = true;
            }

            if ($scope.MainPobj.AllUsersList.length > 0) {
                $scope.MainPobj.ReportUsersList = angular.copy($scope.MainPobj.AllUsersList);
                angular.forEach($scope.MainPobj.ReportUsersList, function (item) {
                    item.IsChecked = true;
                });
                $scope.MainPobj.SelectUserStatusString = "All";
                $scope.MainPobj.AllUserStatusCheck = true;
            }
            if ($scope.MainPobj.RenderingProviderDoctorsList.length > 0) {
                angular.forEach($scope.MainPobj.RenderingProviderDoctorsList, function (item) {
                    item.IsChecked = true;
                });
                $scope.selectedDoctor = "All Doctors";
                $scope.MainPobj.AllDoctorCheck = true;
            }
            if ($scope.MainPobj.AllMasterPaymentsMethods.length > 0) {
                angular.forEach($scope.MainPobj.AllMasterPaymentsMethods, function (item) {
                    item.IsChecked = true;
                });
                $scope.MainPobj.SelectPaymentStatusString = "All";
                $scope.MainPobj.AllStatusCheck = true;
            }
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
                    if ($scope.Subtab == 'BillingProvider') {
                        $scope.ExcelReportsObj.ReportId = 1;
                        $scope.ExcelReportsObj.ReportName = "Patient Payment Detailed Report By BillingProvider";
                    }
                    else if ($scope.Subtab == 'RenderingProvider') {
                        $scope.ExcelReportsObj.ReportId = 2;
                        $scope.ExcelReportsObj.ReportName = "Patient Payment Detailed Report By RenderingProvider";
                    }
                    else if ($scope.Subtab == 'UserProvider') {
                        $scope.ExcelReportsObj.ReportId = 3;
                        $scope.ExcelReportsObj.ReportName = "Patient Payment Detailed Report By User";
                    }
                    else if ($scope.Subtab == 'PaymentType') {
                        $scope.ExcelReportsObj.ReportId = 4;
                        $scope.ExcelReportsObj.ReportName = "Patient Payment Detailed Report By PaymentType";
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
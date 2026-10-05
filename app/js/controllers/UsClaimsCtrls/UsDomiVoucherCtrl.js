"use strict";
eHnoteWebApp.controller("UsDomiVoucherCtrl", ["$scope", "$rootScope", "$filter", "alertify", "$uibModal", "datapersistanceFactory", "$q", "$timeout", "eHnoteMasterDataService", "eHnoteSettingsDataService", "eHnotePatientDataService", "eHnoteInsuranceService", "eHnoteCacheStorageService", "eHnoteMainAdminServices",
    function ($scope, $rootScope, $filter, alertify, $uibModal, datapersistanceFactory, $q, $timeout, eHnoteMasterDataService, eHnoteSettingsDataService, eHnotePatientDataService, eHnoteInsuranceService, eHnoteCacheStorageService, eHnoteMainAdminServices) {
        $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.HospitalId = 0;
        $scope.ParentHospitalId = 0;
        if ($scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode
            && $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID) {
            $scope.HospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParentHospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.ParenthospitalId = $scope.doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.SpecializationId = $scope.doctorinfo.doctordata.User[0].SpecializationId;

        }
        $scope.patSearchType = 2;
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var mObj = datapersistanceFactory.getItem("masterDataArrays");
        //E: \UsProject\UsWEBApp\app\js\controllers\UsClaimsCtrls\UsDomiVoucherCtrl.js
        //var domiobj = {
        //    "OrganizationId": 2,
        //    "BillingProviderId": 0,
        //    "PayorId": 0,
        //    "DomiVoucherName": "",
        //    "ReferenceNumber": "",
        //    "PageSize": 50,
        //    "PageNumber": 1,
        //    "PostingFrom": null,
        //    "PostingTo": null,
        //    "PaymentFrom": null,
        //    "PaymentTo": null,
        //    "DepositStatusId": 0,
        //    "AppliedStatusId": 0,
        //    "PaymentMethodId": 0,
        //    "SortById": 0,
        //    "SortByName": "",
        //    "ProcessingTypeId": 0,
        //    "VoucherStatusId": 0,
        //    "EraId": 0,
        //    "PaymentStatusId": 0
        //}

        $scope.selectedItem = null;

        $scope.GetEOBPaymentPostingObj = function () {
            let Obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "EOBId": 0,
                "EraId": 0,
                "PostingDate": null,
                "EOBName": "",
                "EOBTypeId": 1,
                "EOBType": "Insurance Payment",
                "PaymentMethodId": "",
                "PaymentMethod": "",
                "ProcessingTypeId": 1,
                "ProcessingType": "Manual",
                "EOBCategory": "",
                "PaymentReceivedAt": "",
                "PaymentFormatCode": "",
                "PaymentDate": null,
                "ReferenceNumber": "",
                "PayorName": "",
                "PayorAddress": "",
                "PayorId": "",
                "OrganizationPayorId": "",
                "OrganizationBillingProviderId": "",
                "BillingProviderName": "",
                "BillingProviderNPI": "",
                "TotalPaymentAmount": 0,
                "TotalAllowedAmount": 0,
                "TotalDeductAmount": 0,
                "TotalCoInsuranceAmount": 0,
                "TotalAdjustmentAmount": 0,
                "TotalWriteOffAmount": 0,
                "TotalPatientResponsibilityAmount": 0,
                "TotalDeniedAmount": 0,
                "TotalPatientResponsibilityWriteOffAmount": 0,
                "TotalAppliedAmount": 0,
                "TotalUnAppliedAmount": 0,
                "CurrentTotalUnAppliedAmount": 0,
                "TotalZeroLineItems": 0,
                "TotalDeniedLineItems": 0,
                "PayerIdentifier": "",
                "FederalTaxPayersIdentificationNumber": "",
                "ClaimPaymentInfo": "",
                "ReceiptNumber": "",
                "ReceiptId": 0,
                "EOBFileId": 0,
                "EOBFileName": "",
                "EOBFileS3URL": "",
                "EDIFileId": 0,
                "EDIFileName": "",
                "EDIFileS3URL": "",
                "DepositedBy": "",
                "DepositDate": null,
                "Notes": "",
                "DepositStatus": "All",
                "DepositStatusId": 0,
                "DeleteInd": "N",
                "DocumentDetails": [],
                "TempDocumentDetails": [],
                "PayorObj": null,
                "IsShowSummaryScreen": false,
                "isSummaryPanelOpen ": false,
                "IsShowEOBAddingScreen": false,
                "IsShowAssociatedClaims": false,
                "IsShowAddAssociatedClaims": false,
                "IsShowEOBListScreen": false,
                "IsEOBEditModeInd": false,
                "IsDataAdded": false,
                "AppliedStatus": "",
                "DepositStatusName": "",
                "BillPaymentTypeId": "",
                "BillingProvidersdata": "",
                "BillingProvidersList": [],
                "PageSize": 100,
                "PageNumber": 1,
                "PayerAdjAmount": 0,
                "IsChecked": false,
                "IsNonPayment": false,
                "IsCapitationInd ": false,
                "CapitationDiscount ": 0,
                "IsExternalSystemPosted ": false,
                "ExternalSystemPostedAmount ": 0,
                "PayerIdentificationNo": "",
                "PrimaryBillerId": null,
                "PrimaryBillerName": '',
                "PrimaryBillerNPI": '',
                "ModifiedDt": '',
                "ModifiedTime": '',
                "ModifiedName": '',
                "CreatedName": '',
                "CreatedDt": '',
                "CreatedTime": '',
                "RetentionTaxAmount": 0,
                "RetentionAdjustmentId1": 0,
                "RetentionAdjustmentReason1": "",
                "RetentionAdjustmentAmount1": 0,
                "RetentionAdjustmentId2": 0,
                "RetentionAdjustmentReason2": "",
                "RetentionAdjustmentAmount2": 0,
                "RetentionOtherAdjAmount": 0,
                "NotReconciledAmount": 0,
                "TotalPaymentToProvAmount": 0,
                "TotalGlobalRetentionAmount": 0,
                "TotalTaxAmount": null,
                "ProviderAdjustmentList": [],

            }
            return Obj;
        };

        $scope.mainEOBPaymentPostingObj = $scope.GetEOBPaymentPostingObj();
        // Domi Voucher Search Object
        $scope.DomiVoucherSearchObj = {
            BillingProviderId: 0,
            PayorId: 0,
            DomiVoucherName: "",
            ReferenceNumber: "",
            PageSize: 100,
            PageNumber: 1,
            PostingFrom: null,
            PostingTo: null,
            PaymentFrom: null,
            PaymentTo: null,
            DepositStatusId: 0,
            AppliedStatusId: 0,
            PaymentMethodId: 0,
            SortById: 0,
            SortByName: "",
            Count: 0,
            SelectedMonth: "",
            SelectedYear: new Date().getFullYear(),
        };
        //$scope.DomiVoucherSearchObj.SelectedMonth = 0;
        //$scope.DomiVoucherSearchObj.SelectedYear = new Date().getFullYear();

        $scope.OnMonthYearChange = function () {
            var month = parseInt($scope.DomiVoucherSearchObj.SelectedMonth) || "";
            var year = parseInt($scope.DomiVoucherSearchObj.SelectedYear) || "";

            if (!month || !year) {
                $scope.DomiVoucherSearchObj.PaymentFrom = null;
                $scope.DomiVoucherSearchObj.PaymentTo = null;
            } else {
                var fromDate = new Date(year, month - 1, 1, 0, 0, 0);   // 1st day 00:00:00
                var toDate = new Date(year, month, 0, 23, 59, 59);     // last day 23:59:59

                // Send as date string only — no timezone conversion
                $scope.DomiVoucherSearchObj.PaymentFrom = fromDate.getFullYear() + '-' +
                    String(fromDate.getMonth() + 1).padStart(2, '0') + '-' +
                    String(fromDate.getDate()).padStart(2, '0') + 'T00:00:00';

                $scope.DomiVoucherSearchObj.PaymentTo = toDate.getFullYear() + '-' +
                    String(toDate.getMonth() + 1).padStart(2, '0') + '-' +
                    String(toDate.getDate()).padStart(2, '0') + 'T23:59:59';
                //if (year) {
                $scope.SearchAllDomiVoucherDetails(1);
                /*}*/
            }

        };






        $scope.mainDomiVoucherPostingObj = {
            DomiVoucherPostingList: []
        };

        $scope.TotalDomiVoucherAmount = 0;
        $scope.TotalDomiVoucherManualAmount = 0;
        $scope.TotalDomiVoucherElectronicAmount = 0;

        // Active tab
        $scope.activeClaimTab = 'ALL';

        // Init

        $scope.init = function (typeid) {

            $scope.ReconcileEraId = $scope.ReconcileEraId || 0;
            $scope.ClaimBillingProviderList = [];
            $scope.masterSettlementStatusList = [];
            $scope.mainEOBPaymentPostingObj.EOBPaymentPostingList = [];
            $scope.TotalERAAmount = 0;
            $scope.TotalERAManualAmount = 0;
            $scope.TotalERAElectronicAmount = 0;
            $scope.OrganizationBillingProviderGroupsDetails = [];
            $scope.MasterEobDepositStatus = [];
            $scope.MasterEraPaymentStatus = [];
            $scope.EOBMasterAdjustments = [];
            $scope.DomiVoucherSearchObj.SelectedMonth = "";
            $scope.DomiVoucherSearchObj.SelectedYear = "";


            let Req = {
                /*  "OrganizationId": $scope.HospitalId || 0,*/
                "ParentOrganizationId": $scope.ParenthospitalId,
                "FacilityCode": "",
                "PageNumber": 1,
                "PageSize": 200
            }

            //let obj = {
            //    "EOBId": $scope.mainEOBPaymentPostingObj.EOBId || 0
            //}

            var billinggroupobj = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "OrganizationId": 0
            };


            var param = {
                OrganizationId: $scope.HospitalId,
                BillingProviderId: $scope.DomiVoucherSearchObj.BillingProviderId,
                PayorId: $scope.DomiVoucherSearchObj.PayorId,
                DomiVoucherName: $scope.DomiVoucherSearchObj.DomiVoucherName,
                ReferenceNumber: $scope.DomiVoucherSearchObj.ReferenceNumber,
                PageSize: $scope.DomiVoucherSearchObj.PageSize,
                PageNumber: 1,
                PostingFrom: $scope.DomiVoucherSearchObj.PostingFrom,
                PostingTo: $scope.DomiVoucherSearchObj.PostingTo,
                PaymentFrom: $scope.DomiVoucherSearchObj.PaymentFrom,
                PaymentTo: $scope.DomiVoucherSearchObj.PaymentTo,
                DepositStatusId: $scope.DomiVoucherSearchObj.DepositStatusId,
                AppliedStatusId: $scope.DomiVoucherSearchObj.AppliedStatusId,
                PaymentMethodId: $scope.DomiVoucherSearchObj.PaymentMethodId,
                SortById: $scope.DomiVoucherSearchObj.SortById,
                SortByName: $scope.DomiVoucherSearchObj.SortByName,
                ProcessingTypeId: 3  // Fixed → DomiVoucher
            };
            var param2 = {
                "OrganizationId": $scope.HospitalId,
                "FacilityName": ""
            };
            $q.all([
                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
              /*  eHnoteMainAdminServices.GetOrganizationBillingProviderGroups(billinggroupobj),*/
                eHnoteSettingsDataService.GetMasterPaymentAdjustmentCodes($scope.ParenthospitalId),
                eHnoteInsuranceService.GetOrganizationDomiVoucherList(param),


            ]).then(function (resp) {



                if (resp[0].data.SettlementStatus.length > 0) {
                    angular.forEach(resp[0].data.SettlementStatus, function (item) {
                        if (item.SettlementStatusId != 1 && item.SettlementStatusId != 6) {
                            $scope.masterSettlementStatusList.push(item);
                        }
                    })
                }
                if (resp[0].data.MasterEobDepositStatus.length > 0) {
                    $scope.MasterEobDepositStatus = resp[0].data.MasterEobDepositStatus || []
                }
                if (resp[0].data.MasterEraPaymentStatus.length > 0) {
                    $scope.MasterEraPaymentStatus = resp[0].data.MasterEraPaymentStatus || []
                }
                if (resp[0].data.MasterPriority.length > 0) {
                    $scope.MasterPriority = resp[0].data.MasterPriority || [];
                }
                if (resp[0].data.MasterAlertTypes.length > 0) {
                    $scope.MasterAlertTypes = resp[0].data.MasterAlertTypes || [];
                    angular.forEach($scope.MasterAlertTypes, function (item) {
                        item.IsChecked = false;
                    });
                }
                if (resp[0].data.MasterAlertTag.length > 0) {
                    $scope.MasterAlertTag = resp[0].data.MasterAlertTag || [];
                }
                if (resp[0].data.MasterAlertNoteType.length > 0) {
                    $scope.MasterAlertNoteType = $filter("filter")(resp[0].data.MasterAlertNoteType, function (item) {
                        return item.AlertNoteTypeId !== 6;
                    }) || [];
                }
                if (resp[0].data.EOBMasterAdjustments.length > 0) {
                    $scope.EOBMasterAdjustments = resp[0].data.EOBMasterAdjustments || [];
                }


                //if (resp[1].data.status == "Success") {
                //    $scope.OrganizationBillingProviderGroupsDetails = angular.copy(resp[1].data.rows);
                //    if ($scope.OrganizationBillingProviderGroupsDetails.length > 0) {
                //        angular.forEach($scope.OrganizationBillingProviderGroupsDetails, function (item) {
                //            item.DoctorId = item.DoctorId || 0;
                //            item.GroupsFullName = (item.Title + " " + item.DoctorFullName) || '';

                //        })
                //    }
                //}


                if (resp[1].data.rows.length !== 0) {
                    $scope.PaymentReasonList = resp[1].data.rows || [];
                    if ($scope.PaymentReasonList.length > 0) {
                        angular.forEach($scope.PaymentReasonList, function (item) {
                            item.AdjsutmentDescription = item.GroupCode + '-' + item.AdjustmentReasonCode + '-' + item.AdjsutmentReasonDescription;
                        });
                    }
                    $scope.AdjustmentCodeTypes = resp[1].data.AdjustmentCodeTypes || [];
                }
                if (resp[2].data.status == "Success") {
                    $scope.mainDomiVoucherPostingObj.DomiVoucherPostingList = resp[2].data.rows;

                    $scope.MainDomiVoucherPostingList = resp[2].data.rows;
                    $scope.PendingClaims = resp[2].data.PendingClaims;

                    $scope.DomiVoucherPostingList = angular.copy($scope.MainDomiVoucherPostingList) || [];
                    $scope.DomiVoucherPostingList.forEach(function (item) {
                        item.VoucherMonth = new Date(item.ClaimYear, item.ClaimMonth - 1, 1);
                        item.PoolCap = item.TotalPaymentAmount;   // 5000
                        item.PoolCapUsed = item.TotalAppliedAmount;  // 9704.72
                    });

                    //$scope.DomiVoucherStatusCounts = {
                    //    All: $scope.MainDomiVoucherPostingList.length,
                    //    //Pending: $filter("filter")($scope.MainDomiVoucherPostingList, function (item) { return item.SettlementStatusId === 1; }).length,
                    //    Partial: $filter("filter")($scope.MainDomiVoucherPostingList, function (item) { return item.SettlementStatusId === 2; }).length,
                    //    ReadyToSettle: $filter("filter")($scope.MainDomiVoucherPostingList, function (item) { return item.SettlementStatusId === 2; }).length,
                    //    Posted: $filter("filter")($scope.MainDomiVoucherPostingList, function (item) { return item.SettlementStatusId === 3; }).length
                    //};
                    $scope.DomiVoucherStatusCounts = {
                        All: $scope.MainDomiVoucherPostingList.length,
                        ReadyToSettle: $filter("filter")($scope.MainDomiVoucherPostingList, function (item) { return item.SettlementStatusId === 1; }).length,
                        Partial: $filter("filter")($scope.MainDomiVoucherPostingList, function (item) { return item.SettlementStatusId === 2; }).length,
                        Posted: $filter("filter")($scope.MainDomiVoucherPostingList, function (item) { return item.SettlementStatusId === 3; }).length
                    };
                    $scope.DomiVoucherSearchObj.Count = resp[2].data.count;
                    if ($scope.mainEOBPaymentPostingObj.EOBId) {
                        $scope.selectedItem = $filter("filter")(
                            $scope.MainDomiVoucherPostingList,
                            function (item) {
                                return item.EOBId == $scope.mainEOBPaymentPostingObj.EOBId;
                            }
                        )[0] || null;
                    } else {
                        $scope.selectedItem = null;
                    }

                }

            });
        }
        $scope.ChangeInsurancePayor = function (obj) {

            $scope.mainEOBPaymentPostingObj.PayorId = obj.PayorId;
            $scope.mainEOBPaymentPostingObj.PayorName = obj.PayorName;
            $scope.mainEOBPaymentPostingObj.PayorCode = obj.PayorCode;
            $scope.mainEOBPaymentPostingObj.OrganizationPayorId = obj.OrganizationPayorId;
            //$scope.mainEOBPaymentPostingObj.PayorAddress = obj.Address1;
            $scope.mainEOBPaymentPostingObj.PayorAddress = obj.Address1 + ' ' + obj.Address2 + ', ' + obj.CityName + ', ' + obj.StateName + ', ' + obj.CountryName + ' ' + obj.ZipCode;
            $scope.EOBSearchObj.PayorId = obj.PayorId;
        }
        $scope.SearchAllDomiVoucherDetails = function (Pageno) {
            $scope.DomiVoucherSearchObj.PageNumber = Pageno;

            var param = {
                OrganizationId: $scope.HospitalId,
                BillingProviderId: $scope.DomiVoucherSearchObj.BillingProviderId,
                PayorId: $scope.EOBSearchObj.PayorId,
                DomiVoucherName: $scope.DomiVoucherSearchObj.DomiVoucherName,
                ReferenceNumber: $scope.DomiVoucherSearchObj.ReferenceNumber,
                PageSize: $scope.DomiVoucherSearchObj.PageSize,
                PageNumber: Pageno || 1,
                PostingFrom: $scope.DomiVoucherSearchObj.PostingFrom,
                PostingTo: $scope.DomiVoucherSearchObj.PostingTo,
                //PaymentFrom: $scope.DomiVoucherSearchObj.Month,
                //PaymentTo: $scope.DomiVoucherSearchObj.Year,
                DepositStatusId: $scope.DomiVoucherSearchObj.DepositStatusId,
                AppliedStatusId: $scope.DomiVoucherSearchObj.AppliedStatusId,
                PaymentMethodId: $scope.DomiVoucherSearchObj.PaymentMethodId,
                SortById: $scope.DomiVoucherSearchObj.SortById,
                SortByName: $scope.DomiVoucherSearchObj.SortByName,
                ProcessingTypeId: 3, // Fixed → DomiVoucher
                Month: $scope.DomiVoucherSearchObj.SelectedMonth,
                Year: $scope.DomiVoucherSearchObj.SelectedYear,
            };

            eHnoteInsuranceService.GetOrganizationDomiVoucherList(param).then(function (response) {
                if (response.data.status == "Success") {
                    $scope.mainDomiVoucherPostingObj.DomiVoucherPostingList = response.data.rows;
                    $scope.MainDomiVoucherPostingList = response.data.rows;
                    $scope.PendingClaims = response.data.PendingClaims;
                    //$scope.DomiVoucherPostingList = response.data.rows.map(function (item) {
                    //    return mapDomiVoucherItem(item);
                    //});
                    $scope.DomiVoucherPostingList = angular.copy($scope.MainDomiVoucherPostingList) || [];
                    $scope.DomiVoucherPostingList.forEach(function (item) {
                        item.VoucherMonth = new Date(item.ClaimYear, item.ClaimMonth - 1, 1);
                        item.PoolCap = item.TotalPaymentAmount;   // 5000
                        item.PoolCapUsed = item.TotalAppliedAmount;  // 9704.72
                    });

                    //$scope.DomiVoucherStatusCounts = {
                    //    All: $scope.MainDomiVoucherPostingList.length,
                    //    Pending: $filter("filter")($scope.MainDomiVoucherPostingList, function (item) { return item.SettlementStatusId === 1; }).length,
                    //    Partial: $filter("filter")($scope.MainDomiVoucherPostingList, function (item) { return item.SettlementStatusId === 4; }).length,
                    //    ReadyToSettle: $filter("filter")($scope.MainDomiVoucherPostingList, function (item) { return item.SettlementStatusId === 2; }).length,
                    //    Posted: $filter("filter")($scope.MainDomiVoucherPostingList, function (item) { return item.SettlementStatusId === 3; }).length
                    //};
                    $scope.DomiVoucherStatusCounts = {
                        All: $scope.MainDomiVoucherPostingList.length,
                        ReadyToSettle: $filter("filter")($scope.MainDomiVoucherPostingList, function (item) { return item.SettlementStatusId === 1; }).length,
                        Partial: $filter("filter")($scope.MainDomiVoucherPostingList, function (item) { return item.SettlementStatusId === 2; }).length,
                        Posted: $filter("filter")($scope.MainDomiVoucherPostingList, function (item) { return item.SettlementStatusId === 3; }).length
                    };
                    $scope.DomiVoucherSearchObj.Count = response.data.count;
                    if ($scope.mainEOBPaymentPostingObj.EOBId) {
                        $scope.selectedItem = $filter("filter")(
                            $scope.MainDomiVoucherPostingList,
                            function (item) {
                                return item.EOBId == $scope.mainEOBPaymentPostingObj.EOBId;
                            }
                        )[0] || null;
                    } else {
                        $scope.selectedItem = null;
                    }
                    angular.element(document.querySelector('.popover')).remove();

                    //$scope.TotalDomiVoucherAmount = response.data.TotalPaymentAmount;
                    //$scope.TotalDomiVoucherManualAmount = response.data.manualtotalpayment;
                    //$scope.TotalDomiVoucherElectronicAmount = response.data.electronictotalpayment;
                }
            }, function (error) {
                console.log(error);
            });
        };
        var generatePlanYears = function () {
            var currentYear = new Date().getFullYear();
            var startYear = currentYear - 2;
            var endYear = currentYear + 3;
            $scope.planYears = [];

            for (var year = startYear; year <= endYear; year++) {
                $scope.planYears.push({
                    id: year,
                    value: year,
                    label: year.toString()
                });
            }
            let fstobj = {
                id: "",
                value: "",
                label: "All Years"
            }
            $scope.planYears.unshift(fstobj)

        };

        generatePlanYears();
        $scope.refreshAllClaimDetails = function (tab) {

            $scope.EOBSearchObj = $scope.GetEOBSearchObject();
            $scope.mainEOBPaymentPostingObj = $scope.GetEOBPaymentPostingObj();
            $scope.DomiVoucherSearchObj.SelectedMonth = "";
            $scope.DomiVoucherSearchObj.SelectedYear = "";
            $scope.DomiVoucherSearchObj.PaymentFrom = null;
            $scope.DomiVoucherSearchObj.PaymentTo = null;
            $scope.SearchAllDomiVoucherDetails(1);
            angular.element(document.querySelector('.popover')).remove();
        }
        //$scope.SearchAllDomiVoucherDetails(1);
        //function mapDomiVoucherItem(item) {
        //    return angular.extend(item, {
        //        VoucherMonth: "January 2026",        // temp static
        //        GroupName: "OPH+ASC",               // temp static
        //        TotalClaims: 12,                    // temp static
        //        PendingClaims: 4,                   // temp static
        //        CO24Total: 147000.00,              // temp static
        //        NetEarningsDoctor: 126200.00,      // temp static
        //        AlreadyPosted: 76000.00,           // temp static
        //        PoolCap: 200000.00,                // temp static
        //        PoolCapUsed: 55000.00              // temp static
        //    });
        //}
        //    SearchAllDomiVoucherDetails(1);
        $scope.counts = {
            All: 23, Pending: 6, Partial: 4, ReadyToSettle: 12, Posted: 1
        };

        $scope.activeTab = 'ALL';
        $scope.claimTab = 'RTS';
        $scope.selectedItem = null;
        //statustab
        //$scope.ChangeDomiactiveClaimTab = function (tab) {
        //    $scope.activeClaimTab = tab || 'ALL';
        //    $scope.selectedItem = null;

        //    if ($scope.activeClaimTab == 'ALL') {
        //        $scope.DomiVoucherPostingList = angular.copy($scope.MainDomiVoucherPostingList);
        //    }
        //    else if ($scope.activeClaimTab == 'PENDING') {
        //        $scope.DomiVoucherPostingList = $filter("filter")($scope.MainDomiVoucherPostingList, function (item) {
        //            return item.SettlementStatusId === 1;
        //        }) || [];
        //    }
        //    else if ($scope.activeClaimTab == 'PARTIAL') {
        //        $scope.DomiVoucherPostingList = $filter("filter")($scope.MainDomiVoucherPostingList, function (item) {
        //            return item.SettlementStatusId === 2;
        //        }) || [];
        //    }
        //    else if ($scope.activeClaimTab == 'READYTOSETTLE') {
        //        $scope.DomiVoucherPostingList = $filter("filter")($scope.MainDomiVoucherPostingList, function (item) {
        //            return item.SettlementStatusId === 2;
        //        }) || [];
        //    }
        //    else if ($scope.activeClaimTab == 'POSTED') {
        //        $scope.DomiVoucherPostingList = $filter("filter")($scope.MainDomiVoucherPostingList, function (item) {
        //            return item.SettlementStatusId === 3;
        //        }) || [];
        //    }
        //    else {
        //        $scope.DomiVoucherPostingList = angular.copy($scope.MainDomiVoucherPostingList);
        //    }
        //};
        $scope.ChangeDomiactiveClaimTab = function (tab) {
            $scope.activeClaimTab = tab || 'ALL';
            $scope.selectedItem = null;

            if ($scope.activeClaimTab == 'ALL') {
                $scope.DomiVoucherPostingList = angular.copy($scope.MainDomiVoucherPostingList);
            }


            else if ($scope.activeClaimTab == 'PARTIAL') {
                $scope.DomiVoucherPostingList = $filter("filter")($scope.MainDomiVoucherPostingList, function (item) {
                    return item.SettlementStatusId === 2;  // Partially Settled
                }) || [];
            }
            else if ($scope.activeClaimTab == 'POSTED') {
                $scope.DomiVoucherPostingList = $filter("filter")($scope.MainDomiVoucherPostingList, function (item) {
                    return item.SettlementStatusId === 3;  // Fully Settled
                }) || [];
            }
            else {
                $scope.DomiVoucherPostingList = angular.copy($scope.MainDomiVoucherPostingList);
            }
        };


        // ── Post Payment Popup (Domi) ──
        $scope.openPostPaymentPopup = function (item, type) {
            if (type === 'Post') {
                var poolCap = parseFloat($scope.selectedItem.PoolCap || 0);
                var poolCapUsed = parseFloat($scope.selectedItem.PoolCapUsed || 0);
                var remaining = poolCap - poolCapUsed;
                var claimPayment = 0;
                angular.forEach(item.EOBClaimLineItems, function (lineItem) {
                    claimPayment += parseFloat(lineItem.PaymentAmount || 0);
                });
                //if (poolCap > 0 && claimPayment > remaining) {
                //    alertify.error(
                //        "Posting failed: Insurance payment ($" + claimPayment.toFixed(2) +
                //        ") exceeds pool cap balance ($" + remaining.toFixed(2) + ")."
                //    );
                //    return false;
                //}
            }

            let mainObject = {
                "PatientId": item.PatientId,
                "PatientFullName": item.PatientName,
                "AppointmentId": item.AppointmentId,
                "AppointmentTypeId": item.AppointmentTypeId,
                "PatientClaimId": item.PatientClaimId,
                "EOBId": item.EOBId,
                "ReferenceNumber": item.ReferenceNumber,
                "EOBClaimInfoId": item.EOBClaimInfoId,
                "IsCapitationInd": $scope.mainEOBPaymentPostingObj.IsCapitationInd || false,
                "CapitationDiscount": $scope.mainEOBPaymentPostingObj.CapitationDiscount || null,
                "PayorId": $scope.mainEOBPaymentPostingObj.PayorId,
                "PostingDate": $scope.mainEOBPaymentPostingObj.PostingDate,
                "TotalUnAppliedAmount": $scope.mainEOBPaymentPostingObj.TotalUnAppliedAmount,
                "TotalPaymentAmount": $scope.mainEOBPaymentPostingObj.TotalPaymentAmount,
                "EraId": $scope.mainEOBPaymentPostingObj.EraId,
                "Type": type || '',
                "ClaimTypeId": item.ClaimTypeId || 2
            }

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/PostPaymentpopup.html",
                "controller": "UsPostPaymentpopupCtrl",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "mainObject": function () { return mainObject; },
                    "AllHospitalData": function () { return $scope.mainBillerDataObj; },
                    "mainEOBPaymentPostingObj": function () { return $scope.mainEOBPaymentPostingObj || null },
                },
                "windowClass": "modal__popup--1",

            });
            mInstanceAdd.result.then(function (resp) {
                resp = resp || "";
                if (resp.status === "Success") {
                    $scope.Subtab = 2;
                    $scope.GetEOBClaimDetails(mainObject.EOBClaimInfoId, resp.status);
                    $scope.init(1);
                } else {
                    if (resp?.SettlementStatusId !== 1) {
                        $scope.Subtab = 2;
                    }
                    $scope.GetEOBClaimDetails(mainObject.EOBClaimInfoId, "Patient");
                    $scope.SearchAllDomiVoucherDetails($scope.DomiVoucherSearchObj.PageNumber, 'Slected');

                }

            }, function () {

            });
        };

        // ── FILTER by tab ──
        $scope.filteredList = function () {
            if ($scope.activeTab === 'ALL') return $scope.DomiVoucherPostingList;
            if ($scope.activeTab === 'PENDING') return $scope.DomiVoucherPostingList.filter(function (i) { return i.SettlementStatusId === 1; });
            if ($scope.activeTab === 'PARTIAL') return $scope.DomiVoucherPostingList.filter(function (i) { return i.SettlementStatusId === 4; });
            if ($scope.activeTab === 'RTS') return $scope.DomiVoucherPostingList.filter(function (i) { return i.SettlementStatusId === 2; });
            if ($scope.activeTab === 'POSTED') return $scope.DomiVoucherPostingList.filter(function (i) { return i.SettlementStatusId === 3; });
            return $scope.DomiVoucherPostingList;
        };

        $scope.setTab = function (tab) {
            $scope.activeTab = tab;
            $scope.selectedItem = null;
        };

        $scope.selectItem = function (item) {
            $scope.selectedItem = item;
            $scope.clickonEOBEdit(4, item);
            $scope.claimTab = 'RTS';
        };

        $scope.closePanel = function () {
            $scope.selectedItem = null;
            $scope.refreshAllClaimDetails();
        };


        $scope.navtoOpenProfilePopup = function (item, id, type, NotesId) {


            type = type || '';
            item = item || '';
            id = id || 0;
            let AppointmentId = null;
            let PatientId = null;
            if (item != '') {
                AppointmentId = item.AppointmentId;
                PatientId = item.PatientId;
            }
            $scope.claimScreenParentObj = {
                "PatientId": PatientId || null,
                "AppointmentId": AppointmentId || null,
                "AppointmentTypeId": item.AppointmentTypeId || null,
                "ActionType": "AddClaim",
                "SubActionType": "Verify",
                "ScreenType": "Popup",
                "SuperBillId": null,
                "PatientClaimId": item.PatientClaimId,
                "SuperBillArray": [],
                "NotesId": NotesId || 1,
            };

            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);


            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/ClaimPatientProfile.html",
                "size": "lg",
                "keyboard": false,
                "controller": "UsClaimPatientProfileCtrl",
                "windowClass": "offcanves-right  ",
                "resolve": {
                    "AllHospitalData": function () { return $scope.mainBillerDataObj; },
                    "PatientInsuranceListData": function () { return item; },
                    "id": function () { return id; },
                    "type": function () { return type; },
                    "IshideIndicator": true,
                }

            });

            $scope.mInstanceAdd.result.then(function (response) {

                $scope.GetEOBClaimDetails();
            }, function () { });
        }
        //$scope.openPostPaymentPopup = function (item, type) {

        //    let mainObject = {
        //        "PatientId": item.PatientId,
        //        "PatientFullName": item.PatientName,
        //        "AppointmentId": item.AppointmentId,
        //        "AppointmentTypeId": item.AppointmentTypeId,
        //        "PatientClaimId": item.PatientClaimId,
        //        "EOBId": item.EOBId,
        //        "ReferenceNumber": item.ReferenceNumber,
        //        "EOBClaimInfoId": item.EOBClaimInfoId,
        //        "IsCapitationInd": $scope.mainEOBPaymentPostingObj.IsCapitationInd || false,
        //        "CapitationDiscount": $scope.mainEOBPaymentPostingObj.CapitationDiscount || null,
        //        "PayorId": $scope.mainEOBPaymentPostingObj.PayorId,
        //        "PostingDate": $scope.mainEOBPaymentPostingObj.PostingDate,
        //        "TotalUnAppliedAmount": $scope.mainEOBPaymentPostingObj.TotalUnAppliedAmount,
        //        "TotalPaymentAmount": $scope.mainEOBPaymentPostingObj.TotalPaymentAmount,
        //        "EraId": $scope.mainEOBPaymentPostingObj.EraId,
        //        "Type": type || '',
        //        "ClaimTypeId": item.ClaimTypeId || 2
        //    }

        //    let mInstanceAdd = $uibModal.open({
        //        "templateUrl": "templates/uibpopups/PostPaymentpopup.html",
        //        "controller": "UsPostPaymentpopupCtrl",
        //        //"size": "lg",
        //        "backdrop": "static",
        //        "keyboard": false,
        //        "resolve": {
        //            "mainObject": function () { return mainObject; },
        //            "AllHospitalData": function () { return $scope.mainBillerDataObj; },
        //            "mainEOBPaymentPostingObj": function () { return $scope.mainEOBPaymentPostingObj || null },
        //        },
        //        "windowClass": "modal__popup--1",

        //    });
        //    mInstanceAdd.result.then(function (resp) {
        //        resp = resp || "";
        //        if (resp.status === "Success") {
        //            $scope.Subtab = 2;
        //            $scope.GetEOBClaimDetails(mainObject.EOBClaimInfoId, resp.status);
        //            $scope.init(1);
        //        } else {
        //            if (resp?.SettlementStatusId !== 1) {
        //                $scope.Subtab = 2;
        //            }
        //            $scope.GetEOBClaimDetails(mainObject.EOBClaimInfoId, "Patient");
        //        }
        //    }, function () {

        //    });
        //};
        $scope.changepagination = function (val) {
            $scope.mainEOBPaymentPostingObj.PageNumber = val;
            $scope.GetEOBClaimDetails();
        }
        $scope.GetEOBClaimDetails = function (Id, status, Pgno) {
            Pgno = Pgno || 1;
            let SettlementStatusList = "1";
            var EraId = 0;
            EraId = $scope.mainEOBPaymentPostingObj.EraId;
            if ($scope.Subtab == 1) {
                SettlementStatusList = "1";
                /*EraId = $scope.mainEOBPaymentPostingObj.EraId;*/
            }
            else if ($scope.Subtab == 2) {
                $scope.SearchObj.SettlementStatusId = $scope.SearchObj.SettlementStatusId || '';
                if ($scope.SearchObj.SettlementStatusId != '') {
                    SettlementStatusList = $scope.SearchObj.SettlementStatusId;
                } else {
                    SettlementStatusList = "2,3,4,5";
                }

            }
            else if ($scope.Subtab == 3) {
                SettlementStatusList = "6";
            }
            else if ($scope.Subtab == 4) {
                SettlementStatusList = "7";
            }
            else if ($scope.Subtab == 5) {
                SettlementStatusList = "8";
            }
            else if ($scope.Subtab == 6) {
                SettlementStatusList = "9";
            }
            else if ($scope.Subtab == 7) {
                SettlementStatusList = "10";

            }
            else {

            }
            let obj = {
                "EOBId": $scope.mainEOBPaymentPostingObj.EOBId,
                "SettlementStatusList": SettlementStatusList || "1",
                // "PageSize": 100,
                "PageSize": $scope.mainEOBPaymentPostingObj.PageSize,
                "PageNumber": $scope.mainEOBPaymentPostingObj.PageNumber || Pgno,
                //    "EraId": EraId
            }
            eHnoteInsuranceService.GetEOBClaimDetailsByStatusForDomiVocherList(obj).then(function (resp) {
                $scope.EOBClaimList = [];
                $scope.EOBClaimListCount = 0;
                if (resp.data.status === "Success") {

                    $scope.EOBClaimList = resp.data.rows || [];
                    $scope.EOBClaimListCount = resp.data.count || 0;
                    var totalCO24 = 0;
                    var totalNetEarnings = 0;
                    var totalAlreadyPosted = 0;
                    var totalPending = 0;
                    $scope.selectedItem.AlreadyPosted = resp.data.AlreadyPosted;
                    $scope.selectedItem.PendingClaims = resp.data.PendingClaims;
                    //$scope.selectedItem.CO24Total = resp.data.CO24Total;
                    $scope.selectedItem.NetEarningsDoctor = resp.data.NetEarnings;
                    if ($scope.EOBClaimList.length > 0) {
                        angular.forEach($scope.EOBClaimList, function (Citem) {
                            var WriteOffAmount = 0;
                            var PatientBalance = 0;
                            var InsuranceBalance = 0;
                            var TotalBalance = 0;
                            var TotalPatientResponsibility = 0;
                            var AjustmentAmount = 0;
                            var TotalPaymentAmount = 0;
                            var writeOffTotal = 0;
                            Citem.ERAPaidBy = Citem.ERAPaidBy || null;
                            if (Citem.EOBClaimLineItems.length > 0) {
                                Citem.PatientClaimInfo.PatientClaimLineItems = Citem.PatientClaimInfo.PatientClaimLineItems || [];
                                $scope.Capitationfilter = [];
                                $scope.CapitationList = $scope.CapitationList || [];
                                $scope.PayoreffectiveDate = "";
                                $scope.Payorpercentage = 0;

                                angular.forEach(Citem.PatientClaimInfo.PatientClaimLineItems, function (Aitem) {

                                    if ($scope.Subtab == 1) {
                                        Aitem.ServiceAdjustments = [];
                                        let EOBClaim = $filter("filter")(Citem.EOBClaimLineItems, function (fitem, index) { return fitem.ClaimLineItemId === Aitem.ClaimLineItemId }, true) || [];
                                        if (EOBClaim.length > 0) {
                                            Aitem.IsCO24Ind = false;
                                            Aitem.TotalCO24AdjustmentAmount = 0;
                                            PatientBalance += EOBClaim[0].PatientBalance || 0;
                                            InsuranceBalance += EOBClaim[0].InsuranceBalance || 0;
                                            TotalBalance += EOBClaim[0].TotalBalance || 0;
                                            TotalPatientResponsibility += EOBClaim[0].PatientResponsibility || 0;

                                            Aitem.AllowedAmount = EOBClaim[0].AllowedAmount || 0;
                                            Aitem.InsurancePaymentAmount = EOBClaim[0].PaymentAmount || 0;
                                            Aitem.AdjustmentAmount = EOBClaim[0].AdjustmentAmount || 0;
                                            Aitem.InsuranceWriteOff = EOBClaim[0].InsuranceWriteOff || 0;
                                            AjustmentAmount += EOBClaim[0].AdjustmentAmount || 0;
                                            TotalPaymentAmount += Aitem.InsurancePaymentAmount;
                                            writeOffTotal += EOBClaim[0].InsuranceWriteOff;
                                            /*Aitem.ServiceAdjustments = [];*/
                                            let EobServiceAdjustments = EOBClaim[0].ServiceAdjustments || [];
                                            let EOBClaimLineItemDenials = EOBClaim[0].EOBClaimLineItemDenials || [];
                                            if (EobServiceAdjustments.length > 0) {
                                                angular.forEach(EobServiceAdjustments, function (esitem) {
                                                    let obj = {
                                                        'AdjustmentAmount': esitem.AdjustmentAmount || 0,
                                                        'AdjustmentId': esitem.AdjustmentId || 0,
                                                        'AdjustmentReasonCode': esitem.AdjustmentReasonCode || 0,
                                                        'AdjustmentReasonId': esitem.AdjustmentReasonId || 0,
                                                        'EOBLineItemId': esitem.EOBLineItemId || 0,
                                                        'GroupCode': esitem.GroupCode || 0,
                                                    }

                                                    Aitem.ServiceAdjustments.push(obj);
                                                    //AjustmentAmount += esitem.AdjustmentAmount || 0;
                                                    if (esitem.GroupCode === "CO" && esitem.AdjustmentReasonCode == "24") {
                                                        Aitem.IsCO24Ind = true;
                                                        Aitem.TotalCO24AdjustmentAmount += parseFloat(esitem.AdjustmentAmount || 0);
                                                    }

                                                });

                                            }

                                            Aitem.TotalCO24AdjustmentAmount = parseFloat((Aitem.TotalCO24AdjustmentAmount).toFixed(2));

                                            // ── Capitation Discount Calculation (only if CO-24) ───

                                            //if ($scope.mainEOBPaymentPostingObj.ProcessingTypeId == 3) {
                                            //    if (Aitem.IsCO24Ind === true && Aitem.TotalCO24AdjustmentAmount > 0) {

                                            //        var chargeAmount = parseFloat(Aitem.TotalChargeAmount || 0);
                                            //        var co24Amount = parseFloat(Aitem.TotalCO24AdjustmentAmount || 0);
                                            //        var discountPct = parseFloat($scope.Payorpercentage);



                                            //        var discountAmount = parseFloat(((co24Amount * discountPct) / 100).toFixed(2));
                                            //        var insurancePaid = parseFloat((co24Amount - discountAmount).toFixed(2));
                                            //        var writeOff = discountAmount;
                                            //        var insBalance = discountAmount;

                                            //        // ── Override EOB values with capitation calc ──────
                                            //        Aitem.DiscountAmount = discountAmount;
                                            //        Aitem.TotalBalance = discountAmount;
                                            //        Aitem.WriteOffAmount = writeOff;
                                            //        //  Aitem.InsuranceBalance = insBalance;
                                            //        Aitem.AllowedAmount = parseFloat(chargeAmount.toFixed(2));
                                            //        Aitem.InsurancePaymentAmount = insurancePaid;

                                            //        // ── Update running totals ─────────────────────────
                                            //        // Remove old EOB values first, add new capitation values
                                            //        TotalPaymentAmount -= (EOBClaim[0].PaymentAmount || 0);   // remove old
                                            //        TotalPaymentAmount += insurancePaid;                        // add new

                                            //        writeOffTotal -= (EOBClaim[0].InsuranceWriteOff || 0); // remove old
                                            //        writeOffTotal += writeOff;                              // add new

                                            //        InsuranceBalance -= (EOBClaim[0].InsuranceBalance || 0);  // remove old
                                            //        InsuranceBalance += insBalance;                            // add new

                                            //        TotalBalance -= (EOBClaim[0].TotalBalance || 0);      // remove old
                                            //        TotalBalance += discountAmount;                        // add new

                                            //        // Round running totals
                                            //        TotalPaymentAmount = parseFloat(TotalPaymentAmount.toFixed(2));
                                            //        writeOffTotal = parseFloat(writeOffTotal.toFixed(2));
                                            //        InsuranceBalance = parseFloat(InsuranceBalance.toFixed(2));
                                            //        TotalBalance = parseFloat(TotalBalance.toFixed(2));



                                            //        var templist = $filter("filter")($scope.PaymentReasonList, { "AdjustmentReasonCode": '151' }, true) || [];
                                            //        // if (Aitem.ServiceAdjustments.length == 0) {
                                            //        let obj = {
                                            //            "AdjustmentId": 0,
                                            //            "EOBLineItemId": Aitem.EOBLineItemId || 0,
                                            //            "ClaimLineItemId": Aitem.ClaimLineItemId || "",
                                            //            "AdjustmentReasonCode": templist[0].AdjustmentReasonCode,
                                            //            "AdjsutmentDescription": templist[0].AdjsutmentDescription,
                                            //            "GroupCode": templist[0].GroupCode || '',
                                            //            "AdjustmentReasonId": templist[0].AdjustmentReasonId,
                                            //            "AdjustmentAmount": Aitem.WriteOffAmount || null,
                                            //            "PayorPostingStatusId": 1,
                                            //            "PayorPostingStatus": 'Adjustment',
                                            //            "Notes": "",
                                            //            "DeleteInd": "Y",
                                            //            "ActiveInd": "N",
                                            //        }
                                            //        Aitem.ServiceAdjustments.push(obj);
                                            //        // }

                                            //        console.log('── CO-24 Capitation Calc ─────────────────────');
                                            //        console.log('Claim Line     : ' + Aitem.ClaimLineItemId);
                                            //        console.log('ServiceCode    : ' + Aitem.ServiceCode);
                                            //        console.log('ChargeAmount   : $' + chargeAmount);
                                            //        console.log('CO24 Amount    : $' + co24Amount);
                                            //        console.log('Discount %     : ' + discountPct + '%');
                                            //        console.log('Discount Amt   : $' + discountAmount);
                                            //        console.log('Insurance Paid : $' + insurancePaid);
                                            //        console.log('Write-Off      : $' + writeOff);
                                            //        console.log('Ins. Balance   : $' + insBalance);
                                            //        console.log('─────────────────────────────────────────────');

                                            //    }
                                            //}



                                        }

                                    }
                                    else if ($scope.Subtab == 3) {

                                        let EOBClaim = $filter("filter")(Citem.EOBClaimLineItems, function (fitem, index) { return fitem.ClaimLineItemId === Aitem.ClaimLineItemId }) || [];
                                        if (EOBClaim.length > 0) {
                                            PatientBalance += EOBClaim[0].PatientBalance || 0;
                                            InsuranceBalance += EOBClaim[0].InsuranceBalance || 0;
                                            TotalBalance += EOBClaim[0].TotalBalance || 0;
                                            TotalPatientResponsibility += EOBClaim[0].PatientResponsibility || 0;
                                            Aitem.AllowedAmount = EOBClaim[0].AllowedAmount || 0;
                                            Aitem.InsurancePaymentAmount = EOBClaim[0].PaymentAmount || 0;
                                            TotalPaymentAmount += Aitem.InsurancePaymentAmount;
                                            Aitem.AdjustmentAmount = EOBClaim[0].AdjustmentAmount || 0;
                                            Aitem.InsuranceWriteOff = EOBClaim[0].InsuranceWriteOff || 0;
                                            AjustmentAmount += EOBClaim[0].AdjustmentAmount || 0;
                                            writeOffTotal += EOBClaim[0].InsuranceWriteOff;
                                            EOBClaim[0].Modifier1 = EOBClaim[0].Modifier1 != null ? EOBClaim[0].Modifier1 : Aitem.Modifier1;
                                            EOBClaim[0].Modifier2 = EOBClaim[0].Modifier2 != null ? EOBClaim[0].Modifier2 : Aitem.Modifier2;
                                            EOBClaim[0].Modifier3 = EOBClaim[0].Modifier3 != null ? EOBClaim[0].Modifier3 : Aitem.Modifier3;
                                            EOBClaim[0].Modifier4 = EOBClaim[0].Modifier4 != null ? EOBClaim[0].Modifier4 : Aitem.Modifier4;

                                            Aitem.ServiceAdjustments = [];
                                            let EobServiceAdjustments = EOBClaim[0].ServiceAdjustments || [];
                                            if (EobServiceAdjustments.length > 0) {
                                                angular.forEach(EobServiceAdjustments, function (esitem) {
                                                    let obj = {
                                                        'AdjustmentAmount': esitem.AdjustmentAmount || 0,
                                                        'AdjustmentId': esitem.AdjustmentId || 0,
                                                        'AdjustmentReasonCode': esitem.AdjustmentReasonCode || 0,
                                                        'AdjustmentReasonId': esitem.AdjustmentReasonId || 0,
                                                        'EOBLineItemId': esitem.EOBLineItemId || 0,
                                                        'GroupCode': esitem.GroupCode || 0,
                                                    }

                                                    Aitem.ServiceAdjustments.push(obj);
                                                    //AjustmentAmount += esitem.AdjustmentAmount || 0;


                                                });

                                            }

                                        }
                                    }
                                    else if ($scope.Subtab == 2 || $scope.Subtab == 4 || $scope.Subtab == 5 || $scope.Subtab == 6 || $scope.Subtab == 7) {

                                        let EOBClaim = $filter("filter")(Citem.EOBClaimLineItems, function (fitem, index) { return fitem.ClaimLineItemId === Aitem.ClaimLineItemId }) || [];
                                        if (EOBClaim.length > 0) {
                                            PatientBalance += EOBClaim[0].PatientBalance || 0;
                                            InsuranceBalance += EOBClaim[0].InsuranceBalance || 0;
                                            TotalBalance += EOBClaim[0].TotalBalance || 0;
                                            TotalPatientResponsibility += EOBClaim[0].PatientResponsibility || 0;
                                            Aitem.AllowedAmount = EOBClaim[0].AllowedAmount || 0;
                                            Aitem.InsurancePaymentAmount = EOBClaim[0].PaymentAmount || 0;
                                            TotalPaymentAmount += Aitem.InsurancePaymentAmount;
                                            Aitem.AdjustmentAmount = EOBClaim[0].AdjustmentAmount || 0;
                                            Aitem.InsuranceWriteOff = EOBClaim[0].InsuranceWriteOff || 0;
                                            AjustmentAmount += EOBClaim[0].AdjustmentAmount || 0;
                                            writeOffTotal += EOBClaim[0].InsuranceWriteOff;
                                            EOBClaim[0].Modifier1 = EOBClaim[0].Modifier1 != null ? EOBClaim[0].Modifier1 : Aitem.Modifier1;
                                            EOBClaim[0].Modifier2 = EOBClaim[0].Modifier2 != null ? EOBClaim[0].Modifier2 : Aitem.Modifier2;
                                            EOBClaim[0].Modifier3 = EOBClaim[0].Modifier3 != null ? EOBClaim[0].Modifier3 : Aitem.Modifier3;
                                            EOBClaim[0].Modifier4 = EOBClaim[0].Modifier4 != null ? EOBClaim[0].Modifier4 : Aitem.Modifier4;

                                            Aitem.ServiceAdjustments = [];
                                            let EobServiceAdjustments = EOBClaim[0].ServiceAdjustments || [];
                                            let EOBClaimLineItemDenials = EOBClaim[0].EOBClaimLineItemDenials || [];
                                            if (EobServiceAdjustments.length > 0) {
                                                angular.forEach(EobServiceAdjustments, function (esitem) {
                                                    let obj = {
                                                        'AdjustmentAmount': esitem.AdjustmentAmount || 0,
                                                        'AdjustmentId': esitem.AdjustmentId || 0,
                                                        'AdjustmentReasonCode': esitem.AdjustmentReasonCode || 0,
                                                        'AdjustmentReasonId': esitem.AdjustmentReasonId || 0,
                                                        'EOBLineItemId': esitem.EOBLineItemId || 0,
                                                        'GroupCode': esitem.GroupCode || 0,
                                                    }

                                                    Aitem.ServiceAdjustments.push(obj);

                                                    //AjustmentAmount += esitem.AdjustmentAmount || 0;


                                                });

                                            }

                                            // Citem.ClaimAdjustmentAmount = AjustmentAmount;

                                        }
                                    }


                                    else {
                                        PatientBalance += Aitem.PatientBalance || 0;
                                        InsuranceBalance += Aitem.InsuranceBalance || 0;
                                        TotalBalance += Aitem.TotalBalance || 0;
                                        TotalPatientResponsibility += Aitem.PatientResponsibilityAmount || 0;
                                        TotalPaymentAmount += Aitem.InsurancePaymentAmount;
                                    }

                                });

                                Citem.ERAId = Citem.ERAId || null;

                                if (Citem.ERAId != null) {
                                    Citem.PatientClaimInfo.TotalPatientBalance = PatientBalance;
                                    Citem.PatientClaimInfo.TotalInsuranceBalance = InsuranceBalance;
                                    Citem.PatientClaimInfo.TotalBalance = TotalBalance;
                                    Citem.PatientClaimInfo.TotalPatientResponsibilityAmount = TotalPatientResponsibility;
                                    Citem.PatientClaimInfo.TotalInsurancePayment = TotalPaymentAmount;
                                    Citem.PatientClaimInfo.TotalWriteOffAmount = writeOffTotal;
                                    Citem.PatientClaimInfo.TotalAdjustmentAmount = AjustmentAmount || 0;

                                }
                                else {
                                    Citem.PatientClaimInfo.TotalPatientBalance = PatientBalance;
                                    Citem.PatientClaimInfo.TotalInsuranceBalance = InsuranceBalance;
                                    Citem.PatientClaimInfo.TotalBalance = TotalBalance;
                                    Citem.PatientClaimInfo.TotalPatientResponsibilityAmount = TotalPatientResponsibility;
                                    Citem.PatientClaimInfo.TotalInsurancePayment = TotalPaymentAmount;
                                    Citem.PatientClaimInfo.TotalWriteOffAmount = writeOffTotal;
                                    Citem.PatientClaimInfo.TotalAdjustmentAmount = AjustmentAmount || 0;
                                }




                            }
                            else {
                                angular.forEach(Citem.PatientClaimInfo.PatientClaimLineItems, function (Aitem) {
                                    Aitem.ServiceAdjustments = [];
                                    //if ($scope.mainEOBPaymentPostingObj.IsCapitationInd) {
                                    //    var discountAmount = (Aitem.TotalChargeAmount * $scope.mainEOBPaymentPostingObj.CapitationDiscount) / 100;

                                    //    Aitem.TotalBalance = parseFloat(discountAmount.toFixed(2));
                                    //    Aitem.WriteOffAmount = parseFloat(discountAmount.toFixed(2));
                                    //    Aitem.InsuranceBalance = parseFloat(discountAmount.toFixed(2));
                                    //    Aitem.AllowedAmount = parseFloat(Aitem.TotalChargeAmount.toFixed(2));
                                    //    Aitem.InsurancePaymentAmount = parseFloat((Aitem.TotalChargeAmount - discountAmount).toFixed(2));

                                    //    var templist = $filter("filter")($scope.PaymentReasonList, { "AdjustmentReasonCode": '151' }, true) || [];
                                    //    if (Aitem.ServiceAdjustments.length == 0) {
                                    //        let obj = {
                                    //            "AdjustmentId": 0,
                                    //            "EOBLineItemId": Aitem.EOBLineItemId || 0,
                                    //            "ClaimLineItemId": Aitem.ClaimLineItemId || "",
                                    //            "AdjustmentReasonCode": templist[0].AdjustmentReasonCode,
                                    //            "AdjsutmentDescription": templist[0].AdjsutmentDescription,
                                    //            "GroupCode": templist[0].GroupCode || '',
                                    //            "AdjustmentReasonId": templist[0].AdjustmentReasonId,
                                    //            "AdjustmentAmount": Aitem.WriteOffAmount || null,
                                    //            "PayorPostingStatusId": 1,
                                    //            "PayorPostingStatus": 'Adjustment',
                                    //            "Notes": "",
                                    //            "DeleteInd": "Y",
                                    //            "ActiveInd": "N",
                                    //        }
                                    //        Aitem.ServiceAdjustments.push(obj);
                                    //    }
                                    //}


                                    WriteOffAmount += Aitem.WriteOffAmount || 0;
                                    PatientBalance += Aitem.PatientBalance || 0;
                                    InsuranceBalance += Aitem.InsuranceBalance || 0;
                                    TotalBalance += Aitem.TotalBalance || 0;
                                    TotalPatientResponsibility += Aitem.PatientResponsibilityAmount || 0;
                                    TotalPaymentAmount += Aitem.InsurancePaymentAmount;
                                    AjustmentAmount += Aitem.AjustmentAmount;



                                });
                                Citem.PatientClaimInfo.TotalWriteOffAmount = WriteOffAmount;
                                Citem.PatientClaimInfo.TotalPatientBalance = PatientBalance;
                                Citem.PatientClaimInfo.TotalInsuranceBalance = InsuranceBalance;
                                Citem.PatientClaimInfo.TotalBalance = TotalBalance;
                                Citem.PatientClaimInfo.TotalPatientResponsibilityAmount = TotalPatientResponsibility;
                                Citem.PatientClaimInfo.TotalInsurancePayment = TotalPaymentAmount;
                                Citem.PatientClaimInfo.TotalAdjustmentAmount = AjustmentAmount || 0;
                            }
                            //commented for display clima level adjustment

                            console.log(AjustmentAmount + "__AjustmentAmount");
                            console.log(writeOffTotal + "__AwriteOffTotal");


                            Citem.PatientClaimInfo.TotalChargeAmount = Citem.PatientClaimInfo.TotalChargeAmount || 0;
                            if (Citem.PatientClaimInfo.TotalChargeAmount == 0) {
                                Citem.PatientClaimInfo.TotalChargeAmount = Citem.PatientClaimInfo.TotalClaimAmount;
                            }
                            var co24Total = 0;
                            var writeOff = 0;
                            var co24 = 0;


                            angular.forEach(Citem.EOBClaimLineItems, function (lineItem) {
                                totalNetEarnings += lineItem.PaymentAmount || 0;
                                angular.forEach(lineItem.ServiceAdjustments, function (adj) {
                                    if (adj.AdjustmentReasonCode == "24") {
                                        co24Total += parseFloat(adj.AdjustmentAmount || 0);
                                    }
                                });
                                writeOff += parseFloat(lineItem.InsuranceWriteOff || 0);

                            });
                            Citem.CO24Total = parseFloat(co24Total.toFixed(2));
                            Citem.NetEarningsDoctor = parseFloat((co24 - writeOff).toFixed(2));

                            totalCO24 += Citem.CO24Total;
                            //totalNetEarnings += Citem.NetEarningsDoctor;
                            if (Citem.SettlementStatusId === 3) {
                                totalAlreadyPosted += parseFloat(Citem.PatientClaimInfo.TotalInsurancePayment || 0);
                            }
                            if (Citem.SettlementStatusId === 1) {
                                totalPending += 1;
                            }
                        });

                      
                    }
                    $scope.GetParticularEobdetails(Id, status);

                    status = status || "";

                    if ($scope.Subtab == 1) {
                        if ($scope.CapitationList.length > 0) {
                            var TotalPaidamount = 0;
                            var TotalCo24amount = 0;
                            angular.forEach($scope.EOBClaimList, function (Citem) {
                                $scope.Capitationfilter = $filter("filter")($scope.CapitationList[0].PayorBillingProvider, function (fitem, index) { return fitem.RenderingProviderId === Citem.PatientClaimInfo.RenderingProviderId }, true) || [];
                                var monthNames = [
                                    'january', 'february', 'march', 'april',
                                    'may', 'june', 'july', 'august',
                                    'september', 'october', 'november', 'december'
                                ];

                                // ── Get month from ClaimDate ──────────────────────
                                var claimDate = new Date(Citem.ClaimDate);
                                var claimMonthIdx = claimDate.getMonth();          // 0-11
                                var claimMonthName = monthNames[claimMonthIdx]
                                var pctKey = claimMonthName + 'percentage';
                                var effKey = claimMonthName + 'effectiveDate';

                                // ── Monthly capitation amount key ─────────────────
                                // e.g. "totalDecemberAmount"
                                var monthCapKey = 'total'
                                    + claimMonthName.charAt(0).toUpperCase()
                                    + claimMonthName.slice(1)
                                    + 'Amount';
                                if ($scope.Capitationfilter.length > 0) {
                                    $scope.Payorpercentage = parseFloat($scope.Capitationfilter[0][pctKey] || 0);
                                    $scope.PayoreffectiveDate = $scope.Capitationfilter[0][effKey] || null;
                                    $scope.MonthlyCapAmount = parseFloat($scope.CapitationList[0][monthCapKey] || 0);
                                    Citem.CapitationPercentage = $scope.Payorpercentage
                                }
                                let TotalPaymentAmount = 0;
                                let TotalwriteOff = 0;
                                let TotalCO24AdjustmentAmount = 0;
                                angular.forEach(Citem.EOBClaimLineItems, function (Aitem) {
                                    let co24Total = 0;
                                    angular.forEach(Aitem.ServiceAdjustments, function (adj) {
                                        if (adj.AdjustmentReasonCode == "24") {
                                            co24Total += parseFloat(adj.AdjustmentAmount || 0);
                                            adj.DeleteInd = "Y";
                                            adj.ActiveInd = "N";

                                        }
                                    });
                                    Aitem.TotalCO24AdjustmentAmount = co24Total;
                                    TotalCo24amount += co24Total;
                                    var chargeAmount = parseFloat(Aitem.TotalChargeAmount || 0);
                                    var co24Amount = parseFloat(Aitem.TotalCO24AdjustmentAmount || 0);
                                    var discountPct = parseFloat($scope.Payorpercentage);



                                    var discountAmount = parseFloat(((co24Amount * discountPct) / 100).toFixed(2));
                                    var insBalance = parseFloat((co24Amount - discountAmount).toFixed(2));
                                    var writeOff = insBalance;
                                    var insurancePaid = discountAmount;

                                    // ── Override EOB values with capitation calc ──────
                                    Aitem.DiscountAmount = discountAmount;
                                    Aitem.TotalBalance = discountAmount;
                                    Aitem.WriteOffAmount = writeOff;
                                    //  Aitem.InsuranceBalance = insBalance;
                                    Aitem.AllowedAmount = parseFloat(chargeAmount.toFixed(2));
                                    Aitem.InsurancePaymentAmount = insurancePaid;
                                    Aitem.PaymentAmount = insurancePaid;

                                    TotalPaymentAmount += Aitem.PaymentAmount;
                                    TotalwriteOff += Aitem.WriteOffAmount;
                                    var templist = $filter("filter")($scope.PaymentReasonList, { "AdjustmentReasonCode": '151' }, true) || [];
                                    if (Citem.IsCO24EffectiveDate == false) {
                                        let obj = {
                                            "AdjustmentId": 0,
                                            "EOBLineItemId": Aitem.EOBLineItemId || 0,
                                            "ClaimLineItemId": Aitem.ClaimLineItemId || "",
                                            "AdjustmentReasonCode": templist[0].AdjustmentReasonCode,
                                            "AdjsutmentDescription": templist[0].AdjsutmentDescription,
                                            "GroupCode": templist[0].GroupCode || '',
                                            "AdjustmentReasonId": templist[0].AdjustmentReasonId,
                                            "AdjustmentAmount": Aitem.WriteOffAmount || null,
                                            "PayorPostingStatusId": 1,
                                            "PayorPostingStatus": 'Adjustment',
                                            "Notes": "",
                                            "DeleteInd": "N",
                                            "ActiveInd": "Y",
                                        }
                                        Aitem.ServiceAdjustments.push(obj);
                                    }

                                    let AdjustmentAmount = 0;
                                    angular.forEach(Aitem.ServiceAdjustments, function (adj) {
                                        adj.AdjustmentAmount = parseFloat(adj.AdjustmentAmount).toFixed(2);
                                        // Only sum active, non-deleted adjustments
                                        if (adj.AdjustmentReasonCode != "24") {
                                            var tempAdjAmount = parseFloat(adj.AdjustmentAmount) || 0;
                                            AdjustmentAmount += tempAdjAmount;

                                        }
                                    });
                                    Aitem.AdjustmentAmount = AdjustmentAmount;



                                });

                                Citem.WriteOffAmount = TotalwriteOff;
                                Citem.TotalWriteOffAmount = TotalwriteOff||0;
                                Citem.TotalInsurancePayment = TotalPaymentAmount||0;
                                Citem.ClaimPaymentAmount = TotalPaymentAmount;
                                TotalPaidamount += TotalPaymentAmount;
                               // TotalCO24AdjustmentAmount += Aitem.TotalCO24AdjustmentAmount;

                            });
                            $scope.selectedItem.NetEarningsDoctor = TotalPaidamount;
                            $scope.selectedItem.CO24Total = TotalCo24amount;
                        }
                    }

                    if (status === "Patient") {
                        let filterEOBClaimlist = $filter("filter")($scope.EOBClaimList, function (item) { return item.EOBClaimInfoId === Id }, true) || [];
                        if (filterEOBClaimlist.length > 0) {
                            var TabName = ($scope.Subtab === 1 || $scope.Subtab === 7) ? "Post" : "Edit";
                            $scope.openPostPaymentPopup(filterEOBClaimlist[0], TabName);
                        }
                    } else if (status === "Success") {
                        $scope.OpenPatientAlertpopup();
                    }
                }

                else {
                    alertify.error(resp.data.Message);
                }
            });
        }
        $scope.GetSearchObject = function () {
            var obj = {
                "SettlementStatusId": '',
            }
            return obj;
        }
        $scope.Settledinit = function (val) {
            $scope.SearchObj = $scope.GetSearchObject();
            val = val || 1;
            //$scope.ReconcileEraId = $scope.ReconcileEraId || 0;
            //if ($scope.ReconcileEraId != 0) {
            //    val = $scope.isAllPaidDenial ? 3 : (!$scope.isApprovedInd ? 2 : 1);
            //}

            //$scope.Subtab = val || 1;
            $scope.Subtab = 1;

            if ($scope.ReconcileERAStatusId == 5) {
                $scope.Subtab = 1
            }
            if ($scope.Subtab == 1) {
                let obj = {                   
                    "OrganizationId": $scope.HospitalId,
                    "OrganizationPayorBillingId": $scope.mainEOBPaymentPostingObj.OrganizationPayorBillingId,
                    "PayorId": $scope.mainEOBPaymentPostingObj.PayorId,
                    "PageSize": 100,
                    "PageNumber": 1
                }
                eHnoteInsuranceService.GetCapitationList(obj).then(function (resp) {
                    if (resp.data.Status == "Success") {
                        $scope.CapitationList = resp.data.rows || [];
                        $scope.CapitationListcount = resp.data.count || [];
                        $scope.GetEOBClaimDetails();
                    } else {
                        alertify.error(resp.data.Message);
                    }
                });
            } else {
                $scope.GetEOBClaimDetails();
            }




        }

        $scope.clickonEOBEdit = function (typeid, item) {
            //if (typeid == 2 || typeid == 4) {

            $scope.mainEOBPaymentPostingObj.OrganizationPayorBillingId = item.OrganizationPayorBillingId || null;
            $scope.mainEOBPaymentPostingObj.EOBId = item.EOBId || 0;
            $scope.mainEOBPaymentPostingObj.EraId = item.EraId || 0;
            $scope.mainEOBPaymentPostingObj.PayorId = item.PayorId || null;
            $scope.mainEOBPaymentPostingObj.PayorName = item.PayerName || "";
            $scope.mainEOBPaymentPostingObj.PayorObj = item.PayerName || "";
            $scope.mainEOBPaymentPostingObj.PayorAddress = item.PayorAddress || "";
            $scope.mainEOBPaymentPostingObj.EOBName = item.EOBName || "";
            $scope.mainEOBPaymentPostingObj.PaymentMethodId = item.PaymentMethodId || "";
            $scope.mainEOBPaymentPostingObj.PaymentMethod = item.PaymentMethod || "";
            $scope.mainEOBPaymentPostingObj.ReferenceNumber = item.ReferenceNumber || 0;
            $scope.mainEOBPaymentPostingObj.DepositStatus = item.DepositStatus || "Deposited";
            $scope.mainEOBPaymentPostingObj.DepositStatusId = item.DepositStatusId || 1;
            $scope.mainEOBPaymentPostingObj.PaymentDate = $filter('date')(item.PaymentDate, "MM-dd-yyyy") || null;
            $scope.mainEOBPaymentPostingObj.TotalPaymentAmount = item.TotalPaymentAmount || 0;
            $scope.mainEOBPaymentPostingObj.PostingDate = $filter('date')(item.PostingDate, "MM-dd-yyyy") || null;
            $scope.mainEOBPaymentPostingObj.OrganizationBillingProviderId = item.OrganizationBillingProviderId || 0;
            $scope.mainEOBPaymentPostingObj.BillingProviderName = item.BillingProviderName || "";
            $scope.mainEOBPaymentPostingObj.EOBFileId = item.EOBFileId || 0;
            $scope.mainEOBPaymentPostingObj.EOBFileName = item.EOBFileName || "";
            $scope.mainEOBPaymentPostingObj.EOBFileS3URL = item.EOBFileS3URL || "";
            $scope.mainEOBPaymentPostingObj.Notes = item.Notes || "";
            $scope.mainEOBPaymentPostingObj.IsEOBEditModeInd = true;
            $scope.mainEOBPaymentPostingObj.TotalUnAppliedAmount = item.TotalUnAppliedAmount || 0;
            $scope.mainEOBPaymentPostingObj.CurrentTotalUnAppliedAmount = item.TotalUnAppliedAmount || 0;
            $scope.mainEOBPaymentPostingObj.TotalPaymentAmount = item.TotalPaymentAmount || 0;
            $scope.mainEOBPaymentPostingObj.TotalAppliedAmount = item.TotalAppliedAmount || 0;
            $scope.mainEOBPaymentPostingObj.DocumentDetails = item.DocumentDetails || [];
            $scope.mainEOBPaymentPostingObj.PayerAdjAmount = item.PayerAdjAmount || 0;
            $scope.mainEOBPaymentPostingObj.IsNonPayment = item.IsNonPayment || false;
            $scope.mainEOBPaymentPostingObj.IsExternalSystemPosted = item.IsExternalSystemPosted || false;
            $scope.mainEOBPaymentPostingObj.ExternalSystemPostedAmount = item.ExternalSystemPostedAmount || 0;
            $scope.mainEOBPaymentPostingObj.IsCapitationInd = item.IsCapitationInd || false;
            $scope.mainEOBPaymentPostingObj.CapitationDiscount = item.CapitationDiscount || null;

            $scope.mainEOBPaymentPostingObj.RetentionAdjustmentAmount1 = item.RetentionAdjustmentAmount1 || 0;
            $scope.mainEOBPaymentPostingObj.RetentionAdjustmentAmount2 = item.RetentionAdjustmentAmount2 || 0;
            $scope.mainEOBPaymentPostingObj.RetentionAdjustmentId1 = item.RetentionAdjustmentId1 || null;
            $scope.mainEOBPaymentPostingObj.RetentionAdjustmentId2 = item.RetentionAdjustmentId2 || null;
            $scope.mainEOBPaymentPostingObj.RetentionAdjustmentReason1 = item.RetentionAdjustmentReason1 || "";
            $scope.mainEOBPaymentPostingObj.RetentionAdjustmentReason2 = item.RetentionAdjustmentReason2 || "";
            $scope.mainEOBPaymentPostingObj.RetentionOtherAdjAmount = item.RetentionOtherAdjAmount || 0;
            $scope.mainEOBPaymentPostingObj.RetentionTaxAmount = item.RetentionTaxAmount || 0;
            $scope.mainEOBPaymentPostingObj.NotReconciledAmount = item.NotReconciledAmount || 0;
            $scope.mainEOBPaymentPostingObj.TotalPaymentToProvAmount = item.TotalPaymentToProvAmount || 0;
            $scope.mainEOBPaymentPostingObj.TotalGlobalRetentionAmount = item.TotalGlobalRetentionAmount || 0;
            $scope.mainEOBPaymentPostingObj.ProviderAdjustmentList = item.ProviderAdjustmentList || [];



            $scope.mainEOBPaymentPostingObj.BillingProvidersList = item.BillingProvidersList || [];

            if ($scope.mainEOBPaymentPostingObj.BillingProvidersList.length > 0) {
                let providerNames = [];
                angular.forEach($scope.mainEOBPaymentPostingObj.BillingProvidersList, function (pitem) {
                    if (pitem.BillingProviderName) {
                        providerNames.push(pitem.BillingProviderName);
                    }
                });

                $scope.mainEOBPaymentPostingObj.BillingProvidersdata = providerNames.join(', ');

            } else {
                $scope.mainEOBPaymentPostingObj.BillingProvidersdata = item.BillingProviderName || "";
            }

            $scope.mainEOBPaymentPostingObj.PrimaryBillerId = item.PrimaryBillerId;
            $scope.mainEOBPaymentPostingObj.PrimaryBillerName = item.PrimaryBillerName;
            $scope.mainEOBPaymentPostingObj.PrimaryBillerNPI = item.PrimaryBillerNPI;
            $scope.mainEOBPaymentPostingObj.IsShowEOBAddingScreen = false;
            $scope.mainEOBPaymentPostingObj.IsShowSummaryScreen = true;
            $scope.mainEOBPaymentPostingObj.isSummaryPanelOpen = true;
            $scope.mainEOBPaymentPostingObj.IsShowAssociatedClaims = true;
            $scope.mainEOBPaymentPostingObj.IsShowEOBListScreen = true;
            $scope.mainEOBPaymentPostingObj.IsShowAddAssociatedClaims = false;
            //$rootScope.showTabs = false;
            $scope.Settledinit(item.TotalAppliedAmount === 0 ? 1 : 2);
            /*}*/
        }

        $scope.Changesubtab = function (val) {
            $scope.Subtab = val;
            if ($scope.Subtab == 1) {
                let obj = {
                    "OrganizationId": $scope.HospitalId,
                    "OrganizationPayorBillingId": $scope.mainEOBPaymentPostingObj.OrganizationPayorBillingId,
                    "PayorId": $scope.mainEOBPaymentPostingObj.PayorId,
                    "PageSize": 100,
                    "PageNumber": 1
                }
                eHnoteInsuranceService.GetCapitationList(obj).then(function (resp) {
                    if (resp.data.Status == "Success") {
                        $scope.CapitationList = resp.data.rows || [];
                        $scope.CapitationListcount = resp.data.count || [];
                        $scope.GetEOBClaimDetails();
                    } else {
                        alertify.error(resp.data.Message);
                    }
                });

            } else {
            $scope.mainEOBPaymentPostingObj.PageNumber = 1;
            $scope.GetEOBClaimDetails();
            }

            $scope.mainEOBPaymentPostingObj.IsChecked = false;


        }

        $scope.addPaymentPostingForSelectedClaims = function () {

            $scope.IsAllClaims = false;
            angular.forEach($scope.EOBClaimList, function (item) {
                item.IsSelected = true;
            });
            let filterobj1 = $filter("filter")($scope.EOBClaimList, { "IsSelected": true }) || [];


            if (filterobj1.length === 0) {
                alertify.error("Please select a claim to post");
                return false;
            }
            var totalInsurancePayment = 0;
            angular.forEach(filterobj1, function (claim) {
                totalInsurancePayment += parseFloat(claim.ClaimPaymentAmount || 0);
            });
            var poolCap = parseFloat($scope.selectedItem.PoolCap || 0);
            var poolCapUsed = parseFloat($scope.selectedItem.PoolCapUsed || 0);
            var remaining = poolCap - poolCapUsed;
            if (poolCap > 0 && totalInsurancePayment > remaining) {
                alertify.error(
                    "Posting failed: Insurance payment ($" + totalInsurancePayment.toFixed(2) +
                    ") exceeds pool cap balance ($" + remaining.toFixed(2) + ")."
                );
                return false;
            }
            //if (filterobj1.length === $scope.EOBClaimList.length) {
            //    $scope.IsAllClaims = true;
            //}


            //var claimsList = [];
            //angular.forEach($scope.EOBClaimList, function (mitems) {
            //    if (mitems.IsSelected) {
            //        claimsList.push(mitems.PatientClaimId);
            //    }
            //});

            var claimsListString = "";
            var claimsList = [];

            angular.forEach($scope.EOBClaimList, function (mitems) {
                if (mitems.IsSelected) {
                    var totalPayment = 0;
                    let TransactionSourceId = 1;
                    let TransactionSource = "Primary Insurance";
                    let TransactionTypeId = 32;
                    let TransactionType = "PrimaryInsurancePayment";
                    mitems.ERAPaidBy = parseInt(mitems.ERAPaidBy) || 0;
                    if (mitems.ERAPaidBy === 1 || mitems.ERAPaidBy === 19) {
                        TransactionSourceId = 1;
                        TransactionSource = "Primary Insurance";
                        TransactionTypeId = 32;
                        TransactionType = "PrimaryInsurancePayment";
                    }
                    else if (mitems.ERAPaidBy === 2 || mitems.ERAPaidBy === 20) {
                        TransactionSourceId = 2;
                        TransactionSource = "Secondary Insurance";
                        TransactionTypeId = 36;
                        TransactionType = "SecondaryInsPayment";
                    }
                    else {

                    }

                    let SettlementStatusId = 3;
                    let SettlementStatus = "Fully Settled";

                    if (mitems.ERAPaidBy == 4) {
                         SettlementStatusId = 6;
                        SettlementStatus = "Denied";
                    }
                    let ClaimLineItems = [];
                    angular.forEach(mitems.EOBClaimLineItems, function (lineItem) {
                        totalPayment += parseFloat(lineItem.PaymentAmount || 0);
                        
                       
                        let ClaimTransaction = [];
                        if (lineItem.InsurancePaymentAmount!=0) {
                            let InsurancePaymentAmount = parseFloat(lineItem.InsurancePaymentAmount) || 0;
                            let Tranobj = {
                                "ClaimTransactionId": 0,
                                "PatientInsuranceDetailId": mitems.PatientInsuranceDetailId,
                                "ClaimLineItemId": lineItem.ClaimLineItemId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                "TransactionAmount": - + InsurancePaymentAmount,
                                "PatientAmount": 0,
                                "InsuranceAmount": -+InsurancePaymentAmount,
                                "EOBId": mitems.EOBId,
                                "PayorId": mitems.PrimaryInsuranceId,
                                "AdjustmentReasonId": null,
                                "AdjustmentReasonCode": "",
                                "ReferenceNumber": $scope.mainEOBPaymentPostingObj.ReferenceNumber,
                                "TransactionTypeId": TransactionTypeId,
                                "TransactionType": TransactionType,
                                "TransactionSourceId": TransactionSourceId,
                                "TransactionSource": TransactionSource,
                                "SettlementStatusId": SettlementStatusId || 3,
                                "SettlementStatus": SettlementStatus || "Fully Settled",
                                "TransactionNotes": ""
                            }
                            ClaimTransaction.push(Tranobj);
                        }

                       
                        
                        if ($scope.mainEOBPaymentPostingObj.ProcessingTypeId == 3) {
                            let co24AdjustmentAmount = 0;
                            var lineHasCO24 = (lineItem.ServiceAdjustments || []).some(function (a) {
                                return a.GroupCode === "CO" && a.AdjustmentReasonCode === "24";
                            });
                            if (lineHasCO24) {
                                angular.forEach(lineItem.ServiceAdjustments || [], function (adj) {
                                    if (adj.GroupCode === "CO" &&
                                        adj.AdjustmentReasonCode !== "24" &&
                                        adj.AdjustmentReasonCode !== "151") {

                                        co24AdjustmentAmount += parseFloat(adj.AdjustmentAmount) || 0;
                                    }
                                });

                                if (lineItem.AdjustmentAmount != 0) {
                                    let AdjustmentAmount = parseFloat(lineItem.AdjustmentAmount) || 0;
                                    let Tranobj = {
                                        "ClaimTransactionId": 0,
                                        "ClaimLineItemId": lineItem.ClaimLineItemId,
                                        "PatientInsuranceDetailId": mitems.PatientInsuranceDetailId,
                                        "OrganizationId": $scope.HospitalId,
                                        "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                        "TransactionAmount": -+AdjustmentAmount,
                                        "PatientAmount": 0,                                       
                                        "InsuranceAmount": -+AdjustmentAmount,
                                        "EOBId": mitems.EOBId,
                                        "PayorId": mitems.PrimaryInsuranceId,
                                        "AdjustmentReasonId": null,
                                        "AdjustmentReasonCode": "",
                                        "ReferenceNumber": $scope.mainEOBPaymentPostingObj.ReferenceNumber,
                                        "TransactionTypeId": 53,
                                        "TransactionType": "CONTRACTUAL ADJUSTMENT",
                                        "TransactionSourceId": TransactionSourceId,
                                        "TransactionSource": TransactionSource,
                                        "SettlementStatusId": 7,
                                        "SettlementStatus": "Cancel Payment",
                                        "TransactionNotes": ""
                                    }

                                    ClaimTransaction.push(Tranobj);
                                }
                            }

                            if (co24AdjustmentAmount != 0) {

                                let Tranobj = {
                                    "ClaimTransactionId": 0,
                                    "ClaimLineItemId": lineItem.ClaimLineItemId,
                                    "PatientInsuranceDetailId": mitems.PatientInsuranceDetailId,
                                    "OrganizationId": $scope.HospitalId,
                                    "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                    "TransactionAmount": co24AdjustmentAmount,
                                    "PatientAmount": 0,
                                    //"InsuranceAmount": 0,
                                    "InsuranceAmount": co24AdjustmentAmount,
                                    "EOBId": mitems.EOBId,
                                    "PayorId": mitems.PrimaryInsuranceId,
                                    "AdjustmentReasonId": null,
                                    "AdjustmentReasonCode": "",
                                    "ReferenceNumber": $scope.mainEOBPaymentPostingObj.ReferenceNumber,
                                    "TransactionTypeId": 104,
                                    "TransactionType": "Adjustment Reversal",
                                    "TransactionSourceId": TransactionSourceId,
                                    "TransactionSource": TransactionSource,
                                    "SettlementStatusId": SettlementStatusId || 3,
                                    "SettlementStatus": SettlementStatus || "Fully Settled",
                                    "TransactionNotes": ""
                                }

                                ClaimTransaction.push(Tranobj);
                            }
                        } else {
                            if (lineItem.CurrentAdjustmentAmount != 0) {
                                let AdjustmentAmount = parseFloat(lineItem.CurrentAdjustmentAmount) || 0;
                                let Tranobj = {
                                    "ClaimTransactionId": 0,
                                    "ClaimLineItemId": lineItem.ClaimLineItemId,
                                    "PatientInsuranceDetailId": mitems.PatientInsuranceDetailId,
                                    "OrganizationId": $scope.HospitalId,
                                    "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                    "TransactionAmount": -+AdjustmentAmount,
                                    "PatientAmount": 0,
                                    //"InsuranceAmount": 0,
                                    "InsuranceAmount": -+AdjustmentAmount,
                                    "EOBId": mitems.EOBId,
                                    "PayorId": mitems.PrimaryInsuranceId,
                                    "AdjustmentReasonId": null,
                                    "AdjustmentReasonCode": "",
                                    "ReferenceNumber": $scope.mainEOBPaymentPostingObj.ReferenceNumber,
                                    "TransactionTypeId": 53,
                                    "TransactionType": "CONTRACTUAL ADJUSTMENT",
                                    "TransactionSourceId": TransactionSourceId,
                                    "TransactionSource": TransactionSource,
                                    "SettlementStatusId": SettlementStatusId || 3,
                                    "SettlementStatus": SettlementStatus || "Fully Settled",
                                    "TransactionNotes": ""
                                }
                                //if (item.IsPatientBalanceReceived || item.IsPatientPaymentDone) {
                                //    Tranobj.InsuranceAmount = 0;
                                //}
                                ClaimTransaction.push(Tranobj);
                            }
                        }
                        if (lineItem.WriteOffAmount != 0) {
                            let AdjustmentAmount = parseFloat(lineItem.WriteOffAmount) || 0;
                            let Tranobj = {
                                "ClaimTransactionId": 0,
                                "ClaimLineItemId": lineItem.ClaimLineItemId,
                                "PatientInsuranceDetailId": mitems.PatientInsuranceDetailId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                                "TransactionAmount": -+AdjustmentAmount,
                                "PatientAmount": 0,
                                "InsuranceAmount": -+AdjustmentAmount,
                                "EOBId": mitems.EOBId,
                                "PayorId": mitems.PrimaryInsuranceId,
                                "AdjustmentReasonId": null,
                                "AdjustmentReasonCode": "",
                                "ReferenceNumber": $scope.mainEOBPaymentPostingObj.ReferenceNumber,
                                "TransactionTypeId": 13,
                                "TransactionType": "Posting Write Off",
                                "TransactionSourceId": TransactionSourceId,
                                "TransactionSource": TransactionSource,
                                "SettlementStatusId": SettlementStatusId || 3,
                                "SettlementStatus": SettlementStatus || "Fully Settled",
                                "TransactionNotes": ""
                            }

                            ClaimTransaction.push(Tranobj);
                        }

                        if (lineItem.EOBClaimLineItemDenials.length > 0) {
                            angular.forEach(lineItem.EOBClaimLineItemDenials, function (item) {
                                item.DeleteInd = "N";
                            });
                        }

                        let postobj = {
                            "EOBLineItemId": lineItem.EOBLineItemId || null,
                            "ClaimLineItemId": lineItem.ClaimLineItemId,
                            "PatientClaimId": mitems.PatientClaimId,
                            "ServiceId": lineItem.ServiceId,
                            "PatientBalance": lineItem.PatientBalance,
                            "InsuranceBalance": lineItem.InsuranceBalance,
                            "PaymentAmount": lineItem.PaymentAmount,
                            "TotalChargeAmount": lineItem.TotalChargeAmount,
                            "AllowedAmount": lineItem.AllowedAmount,
                            "CoInsuranceAmount": lineItem.CoInsuranceAmount,
                            "DeductibleAmount": lineItem.DeductibleAmount,
                            "CoPaymentAmount": lineItem.CoPaymentAmount,
                            "AdjustmentAmount": lineItem.AdjustmentAmount,
                            "InsuranceWriteOff": lineItem.WriteOffAmount,
                            "PatientResponsibility": lineItem.PatientResponsibilityAmount,
                            "OtherPatientAmount": null,
                            "PatientWriteOffAmount": null,
                            "TotalBalance": lineItem.TotalBalance,                            
                            "ServiceAdjustments": lineItem.ServiceAdjustments || [],
                            "DenialCodes": lineItem.EOBClaimLineItemDenials || [],
                            "ClaimTransaction": ClaimTransaction || [],
                            "RefundAmount":0,
                            "PreviousInsurancePaymentAmount": lineItem.InsurancePaymentAmount,
                            "PreviousPatientPaymentAmount": lineItem.PatientPaymentAmount,
                            "PreviousInsuranceAdjustmentAmount": lineItem.sInsuranceAdjustmentAmount,
                            "PreviousInsurancePRAmount": lineItem.InsurancePRAmount,
                            "PreviousInsuranceWriteOffAmount": lineItem.WriteOffAmount,
                            "PreviousInsuranceAllowedAmount": lineItem.AllowedAmount,
                            "PreviousPatientBalanceAmount": lineItem.PatientBalance,
                            "Notes": lineItem.Notes || "",
                            "NoteCode": lineItem.NoteCode || ""
                        };
                        //if (postobj.DenialCodes.length > 0) {//now we dont hve DenialCodes array
                        //    denialCount++;
                        //}
                        ClaimLineItems.push(postobj);

                    });

                    var ClaimObj = {
                        "ClaimId": mitems.PatientClaimId || 0,
                        "EOBId": mitems.EOBId || 0,
                        "EOBClaimInfoId": mitems.EOBClaimInfoId || 0,
                        "insPaymentAmount": parseFloat(totalPayment.toFixed(2)) || 0,
                        "TotalWriteOffAmount": parseFloat(mitems.TotalWriteOffAmount.toFixed(2)) || 0,
                        "TotalInsurancePayment": parseFloat(mitems.TotalInsurancePayment.toFixed(2)) || 0,
                        "SettlementStatusId": SettlementStatusId||3,
                        "ClaimLineItems": ClaimLineItems||[],
                    }
                    claimsList.push(ClaimObj);


                    if (claimsListString) {
                        claimsListString += ",";
                    }
                    claimsListString += mitems.PatientClaimId;
                }
            });

            $scope.claimsListString = claimsListString;
            console.log($scope.claimsListString);



            var currentDate = new Date();


            var params = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                //"EraId": $scope.mainEOBPaymentPostingObj.EraId || 0,
                "IsPostPayment": true,
                "PostingDate": currentDate,
                "IsAllClaims": $scope.IsAllClaims,
                "claimsListString": $scope.claimsListString || "",
                "ProcessingTypeId": $scope.mainEOBPaymentPostingObj.ProcessingTypeId || 3,
                "PaymentTransactionTypeId": 2,
                "PaymentTransactionType": "Debit",
                "claimsList": claimsList || [],
            }






            console.log(JSON.stringify(params));

            eHnoteInsuranceService.UpdateERAToBeActiveForDomiVoucher(params, onSuccess, onError);
            function onSuccess(resp) {
                if (resp.Status === 'Success') {
                    alertify.success("Posted Successfully");
                    $scope.SearchAllDomiVoucherDetails($scope.DomiVoucherSearchObj.PageNumber, 'Slected');

                    $scope.Changesubtab(2)
                }
                console.log(resp);

            }
            function onError(reponse) {
            }
        }
        $scope.GetParticularEobdetails = function (Id, status) {
            let obj = {
                "EOBId": $scope.mainEOBPaymentPostingObj.EOBId || 0
            };
            eHnoteInsuranceService.GetParticularEOBDetailsById($scope.mainEOBPaymentPostingObj.EOBId).then(function (resp) {
                if (resp.data.status === "Success") {

                    if (resp.data.rows.length > 0) {

                        var EOBPaymentDetails = angular.copy(resp.data.rows[0]);

                        $scope.mainEOBPaymentPostingObj.EOBId = EOBPaymentDetails.EOBId || 0;
                        $scope.mainEOBPaymentPostingObj.PostingDate = EOBPaymentDetails.PostingDate || null;
                        $scope.mainEOBPaymentPostingObj.EOBName = EOBPaymentDetails.EOBName || "";
                        $scope.mainEOBPaymentPostingObj.EOBTypeId = EOBPaymentDetails.EOBTypeId || 0;
                        $scope.mainEOBPaymentPostingObj.EOBType = EOBPaymentDetails.EOBType || "";
                        $scope.mainEOBPaymentPostingObj.PaymentMethodId = EOBPaymentDetails.PaymentMethodId || 0;
                        $scope.mainEOBPaymentPostingObj.PaymentMethod = EOBPaymentDetails.PaymentMethod || "";
                        $scope.mainEOBPaymentPostingObj.ProcessingTypeId = EOBPaymentDetails.ProcessingTypeId || 1;
                        $scope.mainEOBPaymentPostingObj.ProcessingType = EOBPaymentDetails.ProcessingType || "Manual";
                        $scope.mainEOBPaymentPostingObj.EOBCategory = EOBPaymentDetails.EOBCategory || "";
                        $scope.mainEOBPaymentPostingObj.PaymentReceivedAt = EOBPaymentDetails.PaymentReceivedAt || "";
                        $scope.mainEOBPaymentPostingObj.PaymentFormatCode = EOBPaymentDetails.PaymentFormatCode || "";
                        $scope.mainEOBPaymentPostingObj.PaymentDate = EOBPaymentDetails.PaymentDate || null;
                        $scope.mainEOBPaymentPostingObj.ReferenceNumber = EOBPaymentDetails.ReferenceNumber || 0;
                        $scope.mainEOBPaymentPostingObj.PayorName = EOBPaymentDetails.PayerName || "";
                        $scope.mainEOBPaymentPostingObj.PayorAddress = EOBPaymentDetails.PayorAddress || "";
                        $scope.mainEOBPaymentPostingObj.PayorId = EOBPaymentDetails.PayorId || 0;
                        $scope.mainEOBPaymentPostingObj.OrganizationPayorId = EOBPaymentDetails.OrganizationPayorId || 0;
                        $scope.mainEOBPaymentPostingObj.OrganizationBillingProviderId = EOBPaymentDetails.OrganizationBillingProviderId || 0;
                        $scope.mainEOBPaymentPostingObj.BillingProviderName = EOBPaymentDetails.BillingProviderName || "";
                        $scope.mainEOBPaymentPostingObj.BillingProviderNPI = EOBPaymentDetails.BillingProviderNPI || "";
                        $scope.mainEOBPaymentPostingObj.TotalPaymentAmount = EOBPaymentDetails.TotalPaymentAmount || 0;
                        $scope.mainEOBPaymentPostingObj.TotalAllowedAmount = EOBPaymentDetails.TotalAllowedAmount || 0;
                        $scope.mainEOBPaymentPostingObj.TotalDeductAmount = EOBPaymentDetails.TotalDeductAmount || 0;
                        $scope.mainEOBPaymentPostingObj.TotalCoInsuranceAmount = EOBPaymentDetails.TotalCoInsuranceAmount || 0;
                        $scope.mainEOBPaymentPostingObj.TotalAdjustmentAmount = EOBPaymentDetails.TotalAdjustmentAmount || 0;
                        $scope.mainEOBPaymentPostingObj.TotalWriteOffAmount = EOBPaymentDetails.TotalWriteOffAmount || 0;
                        $scope.mainEOBPaymentPostingObj.TotalPatientResponsibilityAmount = EOBPaymentDetails.TotalPatientResponsibilityAmount || 0;
                        $scope.mainEOBPaymentPostingObj.TotalDeniedAmount = EOBPaymentDetails.TotalDeniedAmount || 0;
                        $scope.mainEOBPaymentPostingObj.TotalPatientResponsibilityWriteOffAmount = EOBPaymentDetails.TotalPatientResponsibilityWriteOffAmount || 0;
                        $scope.mainEOBPaymentPostingObj.TotalAppliedAmount = EOBPaymentDetails.TotalAppliedAmount || 0;
                        $scope.mainEOBPaymentPostingObj.TotalUnAppliedAmount = EOBPaymentDetails.TotalUnAppliedAmount || 0;
                        $scope.mainEOBPaymentPostingObj.CurrentTotalUnAppliedAmount = EOBPaymentDetails.TotalUnAppliedAmount || 0;
                        $scope.mainEOBPaymentPostingObj.TotalZeroLineItems = EOBPaymentDetails.TotalZeroLineItems || 0;
                        $scope.mainEOBPaymentPostingObj.TotalDeniedLineItems = EOBPaymentDetails.TotalDeniedLineItems || 0;
                        $scope.mainEOBPaymentPostingObj.PayerIdentifier = EOBPaymentDetails.PayerIdentifier || "";
                        $scope.mainEOBPaymentPostingObj.FederalTaxPayersIdentificationNumber = EOBPaymentDetails.FederalTaxPayersIdentificationNumber || "";
                        $scope.mainEOBPaymentPostingObj.ClaimPaymentInfo = EOBPaymentDetails.ClaimPaymentInfo || "";
                        $scope.mainEOBPaymentPostingObj.ReceiptNumber = EOBPaymentDetails.ReceiptNumber || "";
                        $scope.mainEOBPaymentPostingObj.ReceiptId = EOBPaymentDetails.ReceiptId || 0;
                        $scope.mainEOBPaymentPostingObj.EOBFileId = EOBPaymentDetails.EOBFileId || 0;
                        $scope.mainEOBPaymentPostingObj.EOBFileName = EOBPaymentDetails.EOBFileName || "";
                        $scope.mainEOBPaymentPostingObj.EOBFileS3URL = EOBPaymentDetails.EOBFileS3URL || "";
                        $scope.mainEOBPaymentPostingObj.EDIFileId = EOBPaymentDetails.EDIFileId || 0;
                        $scope.mainEOBPaymentPostingObj.EDIFileName = EOBPaymentDetails.EDIFileName || "";
                        $scope.mainEOBPaymentPostingObj.EDIFileS3URL = EOBPaymentDetails.EDIFileS3URL || "";
                        $scope.mainEOBPaymentPostingObj.DepositedBy = EOBPaymentDetails.DepositedBy || 0;
                        $scope.mainEOBPaymentPostingObj.DepositDate = EOBPaymentDetails.DepositDate || null;
                        $scope.mainEOBPaymentPostingObj.Notes = EOBPaymentDetails.Notes || "";
                        $scope.mainEOBPaymentPostingObj.DepositStatus = EOBPaymentDetails.DepositStatus || "";
                        $scope.mainEOBPaymentPostingObj.DepositStatusId = EOBPaymentDetails.DepositStatusId || 1;
                        $scope.mainEOBPaymentPostingObj.PayorObj = EOBPaymentDetails.PayerName;
                        $scope.mainEOBPaymentPostingObj.BillingProvidersList = EOBPaymentDetails.BillingProvidersList;
                        $scope.mainEOBPaymentPostingObj.PayerAdjAmount = EOBPaymentDetails.PayerAdjAmount || 0;
                        $scope.mainEOBPaymentPostingObj.DocumentDetails = EOBPaymentDetails.DocumentDetails || [];
                        $scope.mainEOBPaymentPostingObj.ModifiedDt = EOBPaymentDetails.ModifiedDt || "";
                        $scope.mainEOBPaymentPostingObj.ModifiedTime = EOBPaymentDetails.ModifiedTime || "";
                        $scope.mainEOBPaymentPostingObj.ModifiedName = EOBPaymentDetails.ModifiedName || "";
                        $scope.mainEOBPaymentPostingObj.CreatedName = EOBPaymentDetails.CreatedName || "";
                        $scope.mainEOBPaymentPostingObj.CreatedDt = EOBPaymentDetails.CreatedDt || "";
                        $scope.mainEOBPaymentPostingObj.CreatedTime = EOBPaymentDetails.CreatedTime || "";

                        $scope.mainEOBPaymentPostingObj.RetentionAdjustmentAmount1 = EOBPaymentDetails.RetentionAdjustmentAmount1 || 0;
                        $scope.mainEOBPaymentPostingObj.RetentionAdjustmentAmount2 = EOBPaymentDetails.RetentionAdjustmentAmount2 || 0;
                        $scope.mainEOBPaymentPostingObj.RetentionAdjustmentId1 = EOBPaymentDetails.RetentionAdjustmentId1 || null;
                        $scope.mainEOBPaymentPostingObj.RetentionAdjustmentId2 = EOBPaymentDetails.RetentionAdjustmentId2 || null;
                        $scope.mainEOBPaymentPostingObj.RetentionAdjustmentReason1 = EOBPaymentDetails.RetentionAdjustmentReason1 || "";
                        $scope.mainEOBPaymentPostingObj.RetentionAdjustmentReason2 = EOBPaymentDetails.RetentionAdjustmentReason2 || "";
                        $scope.mainEOBPaymentPostingObj.RetentionOtherAdjAmount = EOBPaymentDetails.RetentionOtherAdjAmount || 0;
                        $scope.mainEOBPaymentPostingObj.RetentionTaxAmount = EOBPaymentDetails.RetentionTaxAmount || 0;
                        $scope.mainEOBPaymentPostingObj.NotReconciledAmount = EOBPaymentDetails.NotReconciledAmount || 0;
                        $scope.mainEOBPaymentPostingObj.TotalPaymentToProvAmount = EOBPaymentDetails.TotalPaymentToProvAmount || 0;
                        $scope.mainEOBPaymentPostingObj.TotalGlobalRetentionAmount = EOBPaymentDetails.TotalGlobalRetentionAmount || 0;

                        //var obj = {
                        //    "EOBFileId": $scope.mainEOBPaymentPostingObj.EOBFileId,
                        //    "EOBFileName": $scope.mainEOBPaymentPostingObj.EOBFileName,
                        //    "EOBFileS3URL": $scope.mainEOBPaymentPostingObj.EOBFileS3URL,
                        //    "DisplayName": $scope.mainEOBPaymentPostingObj.EOBFileName
                        //}
                        //$scope.mainEOBPaymentPostingObj.DocumentDetails.push(obj);

                        if ($scope.mainEOBPaymentPostingObj.BillingProvidersList.length > 0) {
                            let providerNames = [];
                            angular.forEach($scope.mainEOBPaymentPostingObj.BillingProvidersList, function (pitem) {
                                if (pitem.BillingProviderName) {
                                    providerNames.push(pitem.BillingProviderName);
                                }
                            });

                            $scope.mainEOBPaymentPostingObj.BillingProvidersdata = providerNames.join(', ');

                        } else {
                            $scope.mainEOBPaymentPostingObj.BillingProvidersdata = EOBPaymentDetails.BillingProviderName || "";
                        }

                    }
                }
            });
        };
        $scope.ClaimObjecDate = {
            "ClaimExpiryDate": null,
        }

        $scope.calculateExpiryDate = function () {

            var currentDate = new Date();

            currentDate.setDate(currentDate.getDate() + 90);

            var expiryMonth = currentDate.getMonth() + 1;
            var expiryDay = currentDate.getDate();
            var expiryYear = currentDate.getFullYear();

            expiryMonth = expiryMonth < 10 ? '0' + expiryMonth : expiryMonth;
            expiryDay = expiryDay < 10 ? '0' + expiryDay : expiryDay;

            $scope.ClaimObjecDate.ClaimExpiryDate = `${expiryMonth}-${expiryDay}-${expiryYear}`;
        };
        $scope.navtoClaimSummaryPopup = function (item) {
            $scope.calculateExpiryDate();
            item = item || '';
            let AppointmentId = null;
            let PatientId = null;
            if (item != '') {
                AppointmentId = item.AppointmentId;
                PatientId = item.PatientId;
            }

            $scope.claimScreenParentObj = {
                "PatientId": PatientId || null,
                "AppointmentId": AppointmentId || null,
                "AppointmentTypeId": item.AppointmentTypeId || null,
                "PatientFullName": item.PatientFullName || "",
                "VisitId": item.VisitId || '',
                "ActionType": "EditClaim",
                "SubActionType": "Verify",
                "ScreenType": "Popup",
                "SuperBillId": null,
                "ResponcibilityId": item.CurrentResponsibilityId || 0,
                "IsCreateSuperBill": false,
                "PatientClaimId": item.PatientClaimId,
                "SuperBillArray": [],
                "ClaimExpiryDate": $scope.ClaimObjecDate.ClaimExpiryDate || null,
                "AppointmentDoctorId": item.RenderingProviderId || 0,
                "PageNumber": 1,
            };
            $scope.mainBillerDataObj.Tabid = 2;
            $scope.mainBillerDataObj.PatientId = PatientId || 0;
            $scope.mainBillerDataObj.HospitalId = $scope.HospitalId || 0;
            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
                "size": "lg",
                "keyboard": false,
                "controller": "UsAddUpdateClaimPopupCtrl",
                "windowClass": "modal__popup--1",
                "resolve": {
                    "mainBillerDataObj": function () { return $scope.mainBillerDataObj || null; },
                }
            });

            $scope.mInstanceAdd.result.then(function (response) {
                response = response || "";
                console.log(response);
                $scope.GetEOBClaimDetails();

            }, function () { });
        }
        $scope.init();
        $scope.DomiVoucherFilterPopover = {
            templateUrl: 'DomiVoucherFilterPopover.html',
        };
        $scope.GetEOBSearchObject = function () {
            var obj = {
                "PayorObj": null,
                "PostingFromDate": null,
                "PostingToDate": null,
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
                "PageSize": 100
            }
            return obj;
        }

        $scope.EOBSearchObj = $scope.GetEOBSearchObject();
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
        $scope.closeFilterPopover = function () {
            angular.element(document.querySelector('.popover')).remove();
        };
        //$scope.selectItem = function (item) {
        //    $scope.selectedItem = item;  // ← row click చేసినప్పుడు ఆ item store అవుతుంది
        //    $scope.claimTab = 'RTS';
        //};
        $scope.getVoucherMonth = function (month, year) {
            if (!month || !year) return '-';
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            return monthNames[month - 1] + ' ' + year;
        };
        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }
        function getnewEOBPrintClaimObj() {
            var obj = {
                "PayorName": "",
                "PayorCode": "",
                "PayorNPI": "",
                "PayorAddress1": "",
                "PayorAddress2": "",
                "PayorZipCode": "",
                "PayorCity": "",
                "PayorState": "",
                "PayorWWW": "",
                "PayorContactNumber": "",
                "TraceNumber": "",
                "ChequeOrEFTDate": "",
                "TotalPaymentAmount": "",
                "TotalAdjustmentAmount": "",
                "PaymentMode": "",
                "TotalChargeAmount": "",
                "BillingProviderName": "",
                "BillingProviderNPI": "",
                "BillingProviderAddress1": "",
                "BillingProviderAddress2": "",
                "BillingProviderZipCode": "",
                "BillingProviderCity": "",
                "BillingProviderState": "",
                "BillingProviderTaxId": "",
                "BillingProviderTaxonomyId": "",
                "OrganizationName": "",
                "OrganizationAddress1": "",
                "OrganizationAddress2": "",
                "OrganizationCity": "",
                "OrganizationState": "",
                "OrganizationZipCode": "",
                "OrganizationStateCode": "",
                "OrganizationNPI": "",
                "ClaimPaymentInfo": [],
                "ClaimAdjustments": [],
                "ClaimLegends": [],
                "PrintedDatenTime": "",
                "ParsedDate": "",
                "TotalPatientResponsibilityAmount": 0,
                "ClaimAdjustmentAmount": 0,
                "TotalOtherAdjustmentAmount": 0,
                "TotalClaimsAmountData": 0,
                "AllTotalOtherAdjAmt": 0,
                "ProviderAdjustments": [],
                "LegendCodeList": [],
                "TotalWUAdjAmt": 0,
                "ParseDate": "",
                "GlobalPayorId": 0,
            };
            return obj;
        };

        $scope.EOBPrintMainObj = getnewEOBPrintClaimObj();
        $scope.navtopatientEOBprint = function (item) {

            var PatientId = item.PatientId || null;
            var ERAId = item.ERAId || item.EraId || null;
            var PayerClaimControlNumber = "";
            eHnoteInsuranceService.GetEOBPatientPostingPrintDetails(ERAId, PatientId, PayerClaimControlNumber).then(function (resp) {

                if (resp.data.status == "Success") {
                    var ERAresp = angular.copy(resp.data.rows);
                    var MatchedClaimsList = (ERAresp.Claims).filter(function (claim) {
                        return claim.PatientClaimNumber === item.PatientClaimNumber;
                    });
                    if (MatchedClaimsList.length > 0) {
                        item.PatientClaimNumber
                        $scope.EOBPrintMainObj.PayorName = ERAresp.PayerName || "";
                        $scope.EOBPrintMainObj.PayorCode = ERAresp.PayerCode || "";
                        $scope.EOBPrintMainObj.PayorNPI = ERAresp.PayerNPI || "";
                        $scope.EOBPrintMainObj.GlobalPayorId = ERAresp.GlobalPayorId || 0;
                        $scope.EOBPrintMainObj.PayorAddress1 = ERAresp.PayerAddress1 || "";
                        $scope.EOBPrintMainObj.PayorAddress2 = ERAresp.PayerAddress2 || "";
                        $scope.EOBPrintMainObj.PayorZipCode = ERAresp.PayerZip || "";
                        $scope.EOBPrintMainObj.PayorCity = ERAresp.PayerCity || "";
                        $scope.EOBPrintMainObj.PayorState = ERAresp.PayerState || "";
                        $scope.EOBPrintMainObj.PayorWWW = ERAresp.PayerWWW || "";
                        $scope.EOBPrintMainObj.PayorContactNumber = ERAresp.PayorContactNumber || "";
                        $scope.EOBPrintMainObj.TraceNumber = ERAresp.TransactionNumber || "";
                        $scope.EOBPrintMainObj.PaymentMode = ERAresp.PaymentMethod || "";
                        $scope.EOBPrintMainObj.ChequeOrEFTDate = ERAresp.TransactionDate || "";
                        /* $scope.EOBPrintMainObj.TotalAdjustmentAmount = 0 || "";*/
                        $scope.EOBPrintMainObj.TotalChargeAmount = ERAresp.TotalChargeAmount || "";
                        $scope.EOBPrintMainObj.BillingProviderName = ERAresp.BillIngProviderName || "";
                        $scope.EOBPrintMainObj.BillingProviderNPI = ERAresp.BillingProviderNPI || "";
                        $scope.EOBPrintMainObj.BillingProviderAddress1 = ERAresp.BillingProviderAddress1 || "";
                        $scope.EOBPrintMainObj.BillingProviderAddress2 = ERAresp.BillingProviderAddress2 || "";
                        $scope.EOBPrintMainObj.BillingProviderZipCode = ERAresp.BillingProviderZip || "";
                        $scope.EOBPrintMainObj.BillingProviderCity = ERAresp.BillingProviderCity || "";
                        $scope.EOBPrintMainObj.BillingProviderState = ERAresp.BillingProviderState || "";
                        $scope.EOBPrintMainObj.BillingProviderTaxID = ERAresp.BillingProviderTaxID || "";
                        $scope.EOBPrintMainObj.BillingProviderTaxonomyId = ERAresp.BillingProviderTaxonomyId || "";
                        $scope.EOBPrintMainObj.ParseDate = ERAresp.ParseDate || "";

                        $scope.EOBPrintMainObj.OrganizationName = ERAresp.OrganizationName || "";
                        $scope.EOBPrintMainObj.OrganizationAddress1 = ERAresp.OrganizationAddress1 || "";
                        $scope.EOBPrintMainObj.OrganizationAddress2 = ERAresp.OrganizationAddress2 || "";
                        $scope.EOBPrintMainObj.OrganizationCity = ERAresp.OrganizationCity || "";
                        $scope.EOBPrintMainObj.OrganizationState = ERAresp.OrganizationState || "";
                        $scope.EOBPrintMainObj.OrganizationStateCode = ERAresp.OrganizationStateCode || "";
                        $scope.EOBPrintMainObj.OrganizationZipCode = ERAresp.OrganizationZipCode || "";
                        $scope.EOBPrintMainObj.OrganizationNPI = $scope.BranchNPI || "";
                        $scope.EOBPrintMainObj.ParsedDate = ERAresp.ParseDate || "";
                        $scope.EOBPrintMainObj.TotalClaimChargeAmount = ERAresp.TotalClaimChargeAmount || 0,
                            $scope.EOBPrintMainObj.TotalPatientResponsibilityAmount = ERAresp.TotalClaimPatientRespAmount || 0,
                            $scope.EOBPrintMainObj.ClaimAdjustmentAmount = ERAresp.TotalClaimAdjustmentAmount || 0,
                            /* $scope.EOBPrintMainObj.TotalOtherAdjustmentAmount = ERAresp.TotalOtherAdjustmentAmount || 0,*/
                            $scope.EOBPrintMainObj.TotalPaymentAmount = ERAresp.TransactionAmount || 0;

                        $scope.EOBPrintMainObj.ProviderAdjustments = ERAresp.ProviderAdjustments || [];
                        $scope.EOBPrintMainObj.TotalWUAdjAmt = 0;
                        angular.forEach($scope.EOBPrintMainObj.ProviderAdjustments, function (pitem) {
                            $scope.EOBPrintMainObj.TotalWUAdjAmt += pitem.AdjustmentAmount || 0;
                        });
                        $scope.EOBPrintMainObj.TotalPaidAmount = 0;
                        $scope.EOBPrintMainObj.TotalVoucherAmount = 0;
                        $scope.EOBPrintMainObj.TotalPaidAmount = $scope.EOBPrintMainObj.TotalPaymentAmount + $scope.EOBPrintMainObj.TotalWUAdjAmt || 0;
                        $scope.EOBPrintMainObj.MatchedClaimsPaidTotal = 0;

                        angular.forEach(MatchedClaimsList || [], function (claim) {
                            $scope.EOBPrintMainObj.MatchedClaimsPaidTotal += Number(claim.PaidAmount) || 0;
                        });

                        $scope.EOBPrintMainObj.TotalVoucherAmount = $scope.EOBPrintMainObj.MatchedClaimsPaidTotal - $scope.EOBPrintMainObj.TotalWUAdjAmt;


                        //ERAresp.Claims = ERAresp.Claims || [];
                        //ERAresp.UnMatchedClaims = ERAresp.UnMatchedClaims || [];

                        console.log(MatchedClaimsList);
                        $scope.EOBPrintMainObj.TotalClaimsAmountData = 0;
                        $scope.EOBPrintMainObj.AllTotalPatientRespAmt = 0;
                        $scope.EOBPrintMainObj.AllTotalAdjAmount = 0;
                        angular.forEach(MatchedClaimsList, function (cERAresp) {
                            $scope.EOBPrintMainObj.TotalClaimsAmountData += cERAresp.ClaimAmount || 0;
                            cERAresp.TotalPatientRespAmount = 0;
                            cERAresp.TotalAdjAmount = 0;
                            cERAresp.TotalOtherAdjustmentAmt = 0;
                            cERAresp.AllAdjustmentAmount = 0;
                            angular.forEach(cERAresp.ClaimLineItems, function (citem) {
                                citem.TotalCOAmount = 0;
                                citem.TotalPRAmount = 0;
                                citem.TotalOAAmt = 0;
                                angular.forEach(citem.LineItemAdjustments, function (aitem) {
                                    if (aitem.GroupCode === "CO") {
                                        citem.TotalCOAmount += aitem.AdjustmentAmount || 0;
                                        cERAresp.TotalAdjAmount += aitem.AdjustmentAmount || 0;
                                        $scope.EOBPrintMainObj.AllTotalAdjAmount += aitem.AdjustmentAmount || 0;
                                    } else if (aitem.GroupCode === "PR") {
                                        citem.TotalPRAmount += aitem.AdjustmentAmount || 0;
                                        cERAresp.TotalPatientRespAmount += aitem.AdjustmentAmount || 0;
                                        $scope.EOBPrintMainObj.AllTotalPatientRespAmt += aitem.AdjustmentAmount || 0;
                                    } else if (aitem.GroupCode === "OA") {
                                        citem.TotalOAAmt += aitem.AdjustmentAmount || 0;
                                        cERAresp.TotalOtherAdjustmentAmt += aitem.AdjustmentAmount || 0;
                                        $scope.EOBPrintMainObj.AllTotalOtherAdjAmt += aitem.AdjustmentAmount || 0;
                                    }
                                    cERAresp.AllAdjustmentAmount += aitem.AdjustmentAmount || 0;

                                })

                            })


                            cERAresp.ClaimPaymentRemark1 = cERAresp.ClaimPaymentRemark1 || '';
                            cERAresp.ClaimPaymentRemark2 = cERAresp.ClaimPaymentRemark2 || '';
                            cERAresp.ClaimPaymentRemark3 = cERAresp.ClaimPaymentRemark3 || '';
                            cERAresp.ClaimPaymentRemark4 = cERAresp.ClaimPaymentRemark4 || '';
                            cERAresp.ClaimPaymentRemark5 = cERAresp.ClaimPaymentRemark5 || '';

                            if (cERAresp.ClaimPaymentRemark1 != '') {
                                let obj = {
                                    "Code": cERAresp.ClaimPaymentRemark1,
                                    "Description": cERAresp.AdjsutmentReasonDescriptionk1,
                                }
                                $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                            }
                            if (cERAresp.ClaimPaymentRemark2 != '') {
                                let obj = {
                                    "Code": cERAresp.ClaimPaymentRemark2,
                                    "Description": cERAresp.AdjsutmentReasonDescriptionk2,
                                }
                                $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                            }
                            if (cERAresp.ClaimPaymentRemark3 != '') {
                                let obj = {
                                    "Code": cERAresp.ClaimPaymentRemark3,
                                    "Description": cERAresp.AdjsutmentReasonDescriptionk3,
                                }
                                $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                            }
                            if (cERAresp.ClaimPaymentRemark4 != '') {
                                let obj = {
                                    "Code": cERAresp.ClaimPaymentRemark4,
                                    "Description": cERAresp.AdjsutmentReasonDescriptionk4,
                                }
                                $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                            }
                            if (cERAresp.ClaimPaymentRemark5 != '') {
                                let obj = {
                                    "Code": cERAresp.ClaimPaymentRemark5,
                                    "Description": cERAresp.AdjsutmentReasonDescriptionk5,
                                }
                                $scope.EOBPrintMainObj.LegendCodeList.push(obj);
                            }

                        });

                        if ($scope.EOBPrintMainObj.LegendCodeList.length > 0) {
                            $scope.EOBPrintMainObj.LegendCodeList = _.uniq($scope.EOBPrintMainObj.LegendCodeList, false, function (p) { return p.Code; });
                        }

                        $scope.EOBPrintMainObj.ClaimPaymentInfo = MatchedClaimsList || [];
                        $scope.EOBPrintMainObj.ClaimAdjustments = [];
                        $scope.EOBPrintMainObj.ClaimLegends = [];
                        $scope.EOBPrintMainObj.PrintedDatenTime = "";


                        var tadjAmt = 0;

                        var tempadjarray = [], tempadjLegendsarray = [];

                        angular.forEach(MatchedClaimsList, function (gitem) {
                            angular.forEach(gitem.ClaimLineItems, function (sitem) {
                                sitem.TotallineItemChargeAmount = sitem.ChargedAmount * sitem.Quantity;
                                angular.forEach(sitem.LineItemAdjustments, function (aitem) {
                                    tadjAmt += parseFloat(aitem.AdjustmentAmount) || 0;
                                    if (tempadjarray.length > 0) {

                                        var filarray = $filter("filter")(tempadjarray, { "AdjustmentCodeId": aitem.AdjustmentReasonId }, true);

                                        if (filarray.length > 0) {
                                            angular.forEach(tempadjarray, function (tadjitem) {
                                                if (tadjitem.AdjustmentCodeId === aitem.AdjustmentReasonId) {
                                                    tadjitem.AdjustmentAmount += parseFloat(aitem.AdjustmentAmount) || 0;
                                                }
                                            });

                                        } else {
                                            var taobj = {
                                                "AdjustmentCodeId": aitem.AdjustmentReasonId,
                                                "AdjustmentCode": aitem.AdjustmentReasonCode,
                                                "AdjustmentCodeName": aitem.AdjustmentReason,
                                                "AdjustmentAmount": parseFloat(aitem.AdjustmentAmount) || 0,
                                                "GroupCode": aitem.GroupCode
                                            }
                                            tempadjarray.push(taobj);
                                        }



                                    }
                                    else {

                                        var taobj = {
                                            "AdjustmentCodeId": aitem.AdjustmentReasonId,
                                            "AdjustmentCode": aitem.AdjustmentReasonCode,
                                            "AdjustmentCodeName": aitem.AdjustmentReason,
                                            "AdjustmentAmount": parseFloat(aitem.AdjustmentAmount) || 0,
                                            "GroupCode": aitem.GroupCode
                                        }
                                        tempadjarray.push(taobj);
                                    }

                                    if (aitem.AdjustmentCode === "CO" || aitem.AdjustmentCode === "PR") {

                                    } else {

                                        if (tempadjLegendsarray.length > 0) {

                                            var filarray = $filter("filter")(tempadjLegendsarray, { "AdjustmentCodeId": aitem.AdjustmentReasonId }, true);

                                            if (filarray.length > 0) {

                                            } else {
                                                var taobj = {
                                                    "AdjustmentCodeId": aitem.AdjustmentReasonId,
                                                    "AdjustmentCode": aitem.AdjustmentReasonCode,
                                                    "AdjustmentCodeName": aitem.AdjustmentReason,
                                                    "GroupCode": aitem.GroupCode
                                                }
                                                tempadjLegendsarray.push(taobj);
                                            }

                                        } else {
                                            var taobj = {
                                                "AdjustmentCodeId": aitem.AdjustmentReasonId,
                                                "AdjustmentCode": aitem.AdjustmentReasonCode,
                                                "AdjustmentCodeName": aitem.AdjustmentReason,
                                                "GroupCode": aitem.GroupCode
                                            }
                                            tempadjLegendsarray.push(taobj);
                                        }


                                    }
                                });
                            });



                        });


                        $scope.EOBPrintMainObj.TotalAdjustmentAmount = tadjAmt;
                        $scope.EOBPrintMainObj.ClaimAdjustments = tempadjarray;
                        $scope.EOBPrintMainObj.ClaimLegends = tempadjLegendsarray;


                        var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
                        var printTime = moment(new Date()).format("HH:mm");
                        var printDatemTime = printDate + '  ' + printTime;
                        $scope.EOBPrintMainObj.PrintedDatenTime = printDatemTime;




                        console.log($scope.EOBPrintMainObj);


                        $timeout(function () {
                            var innerContents = document.getElementById('EOBPostingprint').innerHTML;
                            var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                            popupWinindow.document.open();
                            popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                            popupWinindow.document.close();
                        }, 500);
                    }


                }
            });
        }


        $scope.truncateTo2 = function (value) {
            return Math.floor(value * 100) / 100;
        };



    }]);

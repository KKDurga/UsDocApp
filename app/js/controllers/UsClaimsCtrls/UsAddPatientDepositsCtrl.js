"use strict";
eHnoteWebApp.controller("UsAddPatientDepositsCtrl", ["$scope", "$rootScope", "$uibModal", "eHnoteMasterDataService", "localStorageFactory", "eHnoteUserAppointmentDataService", "$filter",
    "eHnoteInsuranceService", "alertify", "InventoryService", "eHnotePatientAddressDataServices", "datapersistanceFactory", "$uibModalInstance", "Selectobj", "USPrintService", "eHnoteSettingsDataService", "eHnotePrintService", "$q", "eHnotePatientDataService", "eHnotePaymentGatewayService", "eHnoteCacheStorageService", "eHnoteUserDataService", "$timeout", "$location", function ($scope, $rootScope, $uibModal, eHnoteMasterDataService,
        localStorageFactory, eHnoteUserAppointmentDataService, $filter, eHnoteInsuranceService, alertify, InventoryService, eHnotePatientAddressDataServices, datapersistanceFactory, $uibModalInstance, Selectobj, USPrintService, eHnoteSettingsDataService, eHnotePrintService, $q, eHnotePatientDataService, eHnotePaymentGatewayService, eHnoteCacheStorageService, eHnoteUserDataService, $timeout, $location) {
        var doctorInfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SelectedPayorHospital = "";
        var allbranches = localStorageFactory.getItem("allBranchesData") || [];
        $scope.claimScreenParentObj = datapersistanceFactory.getItem("IsComingFromClaim");
        var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches(true, allbranches, doctorInfo) || [];
        $scope.HospitalList = clinicAddress || [];
        $scope.SelectedPayorHospital = $filter("filter")($scope.HospitalList, { "BranchId": doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID }, true)[0];

        $scope.SpecializationId = doctorInfo.doctordata.User[0].SpecializationId;
        $scope.ParenthospitalId = 0;

        if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {

            $scope.ParenthospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        }

        $scope.HospitalAddressArray = [];
        if (doctorinfo.doctordata.UserAddress[0] !== undefined) {
            $scope.HospitalAddressArray = doctorinfo.doctordata.UserAddress[0];
        }

        var mObj = datapersistanceFactory.getItem("masterDataArrays");
        $scope.masterPaymentModes = [];
        if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
            $scope.masterPaymentModes = mObj.PaymentModes;
            $scope.filterPaymentModes = $scope.masterPaymentModes.filter(function (item) {
                return item.PaymentModeId !== 13 && item.PaymentModeId !== 14;
            });

        }
        $scope.IsAllocateDisabled == false;
        $scope.selectedDeposits = [];
        $scope.allClaimPatientPayments = [];
        $scope.patientList = [];
        $scope.Selectobj = Selectobj || '';
        $scope.Selectobj.Type = $scope.Selectobj.Type || '';
        $scope.Selectobj.mainBillerDataObj = $scope.Selectobj.mainBillerDataObj || {};
        var currentdate = $filter('date')(new Date(), "MM-dd-yyyy");

        $scope.Selectobj.isIojOrgEnable = false;
        var currenturl = $location.absUrl().split('?')[0];
        var CurrentEnvironment = currenturl.split('/#')[0];
        if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com") {
            $scope.Selectobj.isIojOrgEnable = true;
        };

        $scope.AllCardTypes = [];
        $scope.AllCardTypes = $scope.Selectobj.CardTypesData || [];

        if ($scope.Selectobj.ClaimDataObj != undefined) {
            $scope.mainClaimObject = $scope.Selectobj.ClaimDataObj || {};
        }

        if ($scope.Selectobj.DiagnosisArrayList != undefined) {
            $scope.addedDiagnosisArray = $scope.Selectobj.DiagnosisArrayList || {};
        }
        if ($scope.Selectobj.PatientClaimTransmissionObj != undefined) {
            $scope.PatientClaimTransmissionObj = $scope.Selectobj.PatientClaimTransmissionObj || {};
        }
        if ($scope.Selectobj.ClaimSaveSatus != undefined) {
            $scope.ClaimSaveSatus = $scope.Selectobj.ClaimSaveSatus || {};
        }

        $scope.IsDepositAllocationEditMode = false;
        $scope.DepositDetails =
        {
            "TotalPatientClaimBalance": 0,
            "TotalUnAllocatedAmount": 0,
            "TotalAllocatedAmount": 0,
            "PatientInsuranceBalance": 0
        };
        $scope.PatientDepositDetails =
        {
            "DepositDate": null,
            "DepositNumber": null,
            "DepositAmount": 0
        };

        $scope.GetPatientlineItemsObj = function () {
            return {
                "EOBLineItemId": null,
                "ClaimLineItemId": null,
                "PatientClaimId": null,
                "ServiceId": null,
                "ServiceName": "",
                "ServiceCode": "",
                "DOSfrom": "",
                "UnitCharge": null,
                "Quantity": null,
                "DeleteInd": "N",
                "PatientPaid": null,
                "TotalChargeAmount": null,
                "AllowedAmount": null,
                "InsurancePaymentAmount": null,
                "CoPaymentAmount": null,
                "AdjustmentAmount": null,
                "DeductibleAmount": null,
                "CoInsuranceAmount": null,
                "PatientPaymentAmount": null,
                "WriteOffAmount": null,
                "InsuranceBalance": null,
                "PatientBalance": null,
                "TotalBalance": null,
                "PatientPaymentTypeId": null,
                "TransactionAmount": null,
                "CurrentPatientBalance": null,
                "CurrentTotalBalance": null,
                "CurrentPatientPaymentAmount": null,
                "AdjustmentReasonCodeId": null,
                "AdjustmentReasonCode": '',
                "AdjsutmentReasonDescription": '',
                "TransactionTypeId": '',
                "TransactionType": '',
                "PatientClaimNumber": '',
                "IsEditMode": false
            }
        };


        $scope.AllUsersList = $scope.Selectobj.UsersList || [];

        $scope.ClaimDetailsList = $scope.Selectobj.ClaimDetailsList;
        $scope.OrganizationFacilityList = $scope.Selectobj.OrganizationFacilityList || [];
        /* $scope.AllBranchesList = $scope.Selectobj.AllBranchesList || [];*/

        $scope.AllBranchesList = $scope.Selectobj.AllBranchesList.filter(item => item.DefaultBillingProviderId != 0) || [];

        $scope.DepositTypes = $scope.Selectobj.DepositTypes || [];
        $scope.WriteOffReasons = $scope.Selectobj.WriteOffReasons || [];
        $scope.PatientClaimNumber = $scope.Selectobj.PatientClaimNumber || 0;

        $scope.PatientDetails = $scope.Selectobj.Patientobj;

        $scope.showNotes = false;
        $scope.addNotes = function () {
            $scope.showNotes = !$scope.showNotes;
        }

        $scope.GetPatientDepositPaymodeList = [{
            "PatientDepositPaymodeListId": 0,
            "PaymentMethodId": 1,
            "PaymentMethodName": "Cash",
            "DepositAmount": "",
            "ReferenceNumber": "",
            "IsDepositAdded": false,
            "DeleteInd": "N",
            "PatientDepositId": null,
            "CardNumber": "",
            "CardType": "",
            "CardtypeId": 0,
        }];

        $scope.CardTypeDetails = [];
        $scope.MasterTransactionCategories = [];
        $scope.GetPatientDepositsObj = function () {
            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "PatientDepositId": 0,
                "PatientId": $scope.Selectobj.PatientId || 0,
                "ReceiptNo": "",
                "ReceiptId": "",
                "DepositDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "PaymentDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "DepositAmount": "",
                "DepositedByUserId": "",
                "DepositedBy": "",
                "UnBilledAmount": 0.00,
                "BilledAmount": 0.00,
                "DeleteInd": "N",
                "AppointmentId": "",
                "BillingProviderId": "",
                "BillingProviderObj": "",
                "DepositTypeId": 3,
                "DepositTypeName": "General",
                "PaymentMethodId": 1,
                "PaymentMethodName": "Cash",
                "ChequeNumber": "",
                "CardNumber": "",
                "OnlineTransactionNumber": "",
                "CardName": "",
                "CardExpiry": "",
                "Notes": "",
                "BatchNumber": "",
                "OrganizationFacilityId": $scope.HospitalId,
                "FacilityName": "",
                "BillingProviderName": "",
                "IsConsent": false,
                "IsDepositPrint": false,
                "IsEmail": false,
                "IsSelectedRadiobtn": false,
                "DepositStatusId": 1,
                "DepositStatus": 'Deposited',
                "PageSize": 50,
                "PageNumber": 1,
                "Count": 0,
                "PatientDepositPaymodeList": [],
                "OrganizationTransactionId": $scope.HospitalId,
                "OrganizationTransactionName": "",
                "TransactionCategoryId":1
            }

            return obj;
        };

        $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());

        //$scope.masterDepositTypes = [
        //    { DepositTypeId: 1, DepositType: 'Deposit' },
        //    { DepositTypeId: 2, DepositType: 'Copay' },
        //    { DepositTypeId: 3, DepositType: 'Deductible' },
        //    { DepositTypeId: 4, DepositType: 'General' },

        //];

        $scope.AllSelectionObj = {
            "IsAllItemsChecked": false
        }

        $scope.SelectedPatientDetails = {
            "PatientObj": "",
            "DepositsObj": ""
        };

        $scope.getSearchObj = function () {
            var obj = {
                "SearchText": "",
                "Type": 1,
                "PageSize": 10,
                "PageNumber": 1,
                "ShowpatientListdiv": false,
                "OrganizationId": $scope.ParenthospitalId
            };
            return obj;
        };

        $scope.SearchObj = angular.copy($scope.getSearchObj());

        $scope.GetPatientpaymentObj = function () {
            var obj = {
                "PatientDepositId": 0,
                "EOBId": 0,
                "IsPatientDeposit": false,
                "IsEditPatientDeposit": false,
                "PostingDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "DepositDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                "EOBName": "",
                "EOBTypeId": 0,
                "EOBType": "",
                "PaymentMethodId": "",
                "PaymentMethod": "",
                "ProcessingTypeId": 0,
                "ProcessingType": "",
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
                "TotalPaymentAmount": "",
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
                "PatientName": "",
                "PatientId": $scope.Selectobj.PatientId || null,
                "PatientAddress": "",
                "BatchNumber": "",
                "DepositStatus": "",
                "DepositStatusId": "",
                "DepositTypeId": 3,
                "DepositTypeName": "General",
                "Notes": "",
                "IsShowPatienPostListScreen": false,
                "IsShowPatientScreen": false,
                "IsShowPatientAddingScreen": false,
                "IsShowPatientListScreen": false,
                "IsPatientEditModeInd": false,
                "IsPatientPostSummaryScreen": false,
                "IsDataAdded": false,
                "DocumentDetails": [],
                "PatientDepositPaymodeList": [],
                "DeleteInd": "N",
                "UnBilledAmount": null,
                "BilledAmount": null,
                "DepositAmount": "",
                "OrganizationName": '',
                "IsDepositPrint": false,
                "BillingProviderIds": "",
                "CurrentPaymentType": "",
                "OrganizationTransactionId": $scope.HospitalId,
                "OrganizationTransactionName": "",

            }

            return obj;
        };

        $scope.PatientPaymentObj = angular.copy($scope.GetPatientpaymentObj());

        $scope.GetPaymentmethodList = function () {
            var Obj = {
                "PatientDepositPaymodeListId": 0,
                "PaymentMethodId": 1,
                "PaymentMethodName": "Cash",
                "DepositAmount": "",
                "ReferenceNumber": "",
                "IsDepositAdded": false,
                "DeleteInd": "N",
                "PatientDepositId": null,
                "CardNumber": "",
                "CardType": "",
                "CardtypeId": 0,
                "NMITransactionId": ""
            }
            return Obj;
        }

        $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());

        var PaymentMethodIds = $scope.masterPaymentModes.map(function (status) {
            return status.PaymentModeId;
        }).join(',');

        $scope.GetPatientPaymentsDetails = function () {

            var obj = {
                "PatientId": $scope.PatientDetails.PatientId,
                "MrNo": $scope.PatientDetails.PatientDisplayId,
                "ClaimNo": "",
                "PaymentFromDate": currentdate,
                "PaymentToDate": currentdate,
                "ReceiptFromDate": currentdate,
                "ReceiptToDate": currentdate,
                "BillingProviderId": $scope.PatientPaymentObj.BillingProviderIds,
                "UserId": $scope.UserId,
                "PaymentMethodId": PaymentMethodIds,
                "ReferenceNumber": $scope.PatientPaymentObj.ReferenceNumber,
                "PageSize": 100,
                "PageNumber": 1,
                "OrganizationId": $scope.HospitalId,
                "PaymentTypeId": 0,
            }

            eHnoteInsuranceService.GetAllClaimPatientPayments(obj).then(function (resp) {
                if (resp.data.status == "Success") {
                    if (resp.data.rows.length > 0) {
                        $scope.allClaimPatientPayments = angular.copy(resp.data.rows);

                        if ($scope.Selectobj.ScreenType == 'Payment') {
                            let filteredList = $scope.allClaimPatientPayments.filter(function (item) {
                                return item.PatientClaimId === $scope.Selectobj.PatientClaimId;
                            });
                            //if (filteredList.length > 0) {
                            //    $scope.PatientPaymentObj.EOBId = filteredList[0].EOBId;
                            //    $scope.PatientPaymentObj.PatientDepositPaymodeList = angular.copy(filteredList[0].DepositPaymentmodeList);
                            //}

                        }
                    }
                }
            });
        }

        function getnewemptypaymentobj() {
            var obj = {
                "TotalChargeBalanceAmount": 0,
                "TotalPatientBalanceAmount": 0,
                "TotalPatientPaymentBalance": 0,
                "TotalPreviousPaymentBalance": 0,
                "TotalAdjustmentBalanceAmount": 0,
                "TotalFinalPatientBalanceAmount": 0,
                "TotalPayableAmount": 0,
                "TotalPaidAmount": 0
            }

            return obj;
        }
        if ($scope.HospitalId != null) {
            var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": $scope.HospitalId }, true) || [];
            if (filtredArray.length > 0) {
                $scope.PatientDepositsObj.BillingProviderId = filtredArray[0].DefaultBillingProviderId;
                $scope.PatientDepositsObj.OrganizationTransactionId = filtredArray[0].BranchId;
                $scope.PatientDepositsObj.OrganizationTransactionName = filtredArray[0].BranchName;

                $scope.PatientPaymentObj.BillingProviderId = filtredArray[0].DefaultBillingProviderId || 0;
                $scope.PatientPaymentObj.OrganizationTransactionId = filtredArray[0].BranchId;
                $scope.PatientPaymentObj.OrganizationTransactionName = filtredArray[0].BranchName;

            }
        }
        $scope.initpage = function () {
            if ($scope.Selectobj.ScreenType == "Deposit") {
                $scope.SubTab = 2;
            } else {
                $scope.SubTab = 1;
            }
            $scope.PatientPaymentObj = angular.copy($scope.GetPatientpaymentObj());

            $scope.mainPaymentObject = getnewemptypaymentobj();
            //$scope.TotalChargeBalanceAmount = 0;
            //$scope.TotalPatientBalanceAmount = 0;
            //$scope.TotalPatientPaymentBalance = 0;
            //$scope.TotalPreviousPaymentBalance = 0;
            //$scope.TotalAdjustmentBalanceAmount = 0;
            //$scope.TotalFinalPatientBalanceAmount = 0;
            //$scope.TotalPayableAmount = 0;
            $scope.DepositSubTab = 1;
            $scope.BillingProvidersList = [];
            var params = {
                "OrganizationId": $scope.HospitalId || 0,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "HospitalIds": $scope.HospitalIds || '',
                "FacilityCode": "",
                "PageNumber": 1,
                "PageSize": 1000
            };
            $q.all([
                eHnoteSettingsDataService.GetOrganizationBillingProviders(params),
                eHnoteInsuranceService.GetPatientTotalDepositsById($scope.Selectobj.PatientId),
                eHnoteSettingsDataService.GetAllMasterClaimsData($scope.HospitalId),
            ]).then(function (resp) {
                if (resp[0].data.Status == "Success") {
                    resp[0].data.rows = resp[0].data.rows || [];
                    $scope.TotalFacilityCount = resp[0].data.count || 0;
                    if (resp[0].data.rows.length > 0) {
                        $scope.BillingProvidersList = resp[0].data.rows || [];

                        $scope.PatientPaymentObj.BillingProviderIds = $scope.BillingProvidersList.map(function (status) {
                            return status.OrganizationBillingProviderId;
                        }).join(',');
                    }
                    if (resp[0].data.Masterrefundreasons.length > 0) {
                        $scope.Masterrefundreasons = resp[0].data.Masterrefundreasons || [];
                    }
                    if (resp[0].data.TransactionCategory.length > 0) {
                        $scope.MasterTransactionCategories = resp[0].data.TransactionCategory || [];

                        $scope.MasterTransactionCategories.unshift({
                            TransactionCategoryId: 0,
                            TransactionCategoryName: 'All'
                        });
                    }
                }
                if (resp[1].data[0].status === "success") {
                    $scope.Selectedpatientobj = '';
                    $scope.Selectedpatientobj = resp[1].data[0];


                    if ($scope.Selectedpatientobj.AppointmentmentsArray.length > 0) {
                        angular.forEach($scope.Selectedpatientobj.AppointmentmentsArray, function (ditem) {
                            ditem.AppointmentDate = $filter('date')(ditem.AppointmentDate, "MM-dd-yyyy");
                        });
                    }

                    $scope.changeAppointment($scope.Selectedpatientobj.AppointmentmentsArray[0].AppointmentId);

                }

                //if (Selectobj.Allocate == 3) {
                //    $scope.SelectedDepositeAllocatePayment(Selectobj.item);
                //}
                if (resp[2].data.MasterPriority.length > 0) {
                    $scope.MasterPriority = resp[2].data.MasterPriority || [];
                }
                if (resp[2].data.MasterAlertTypes.length > 0) {
                    $scope.MasterAlertTypes = resp[2].data.MasterAlertTypes || [];
                    angular.forEach($scope.MasterAlertTypes, function (item) {
                        item.IsChecked = false;
                    });

                }
                if (resp[2].data.MasterAlertTag.length > 0) {
                    $scope.MasterAlertTag = resp[2].data.MasterAlertTag || [];
                }
                if (resp[2].data.MasterAlertNoteType.length > 0) {
                    $scope.MasterAlertNoteType = $filter("filter")(resp[2].data.MasterAlertNoteType, function (item) {
                        return item.AlertNoteTypeId !== 6;
                    }) || [];
                }
                $scope.GetPatientPaymentsDetails();
            });

            if ($scope.Selectobj.ScreenType == 'Payment') {
                $scope.SubTab = 1;
                // $scope.AllocatePaymentDeposite();
                $scope.PatientPaymentObj = angular.copy($scope.GetPatientpaymentObj());
                $scope.GetPatientPaymentsList(Selectobj.item, '', 'Allocate');
                console.log("GetPatientPaymentsList call6");
                //if ($scope.Selectobj.Incomingfrom == "EditClaim") {
                //    $scope.GetPatientPaymentsList(true);
                //} else {
                //    $scope.GetPatientPaymentsList();
                //}

            } else {
                $scope.SubTab = 2;
                console.log("GetPatientPaymentsList call1");
                $scope.GetPatientPaymentsList();
                // $scope.SelectedDepositeAllocatePayment(Selectobj.item);
            }
        }

        $scope.onSelectDepositSubTab = function (val) {
            $scope.DepositSubTab = val;
            if (val === 1) {
                $scope.getPatientDepositAmountById();
            } else {
                //$scope.GetPatientConversationList();
                $scope.GetPatientPendingPaymentsList();
            }
        };

        $scope.changeAppointment = function (Id) {
            var filtredArray = $filter("filter")($scope.Selectedpatientobj.AppointmentmentsArray, { "AppointmentId": Id }, true) || [];
            if (filtredArray.length > 0) {
                $scope.PatientDepositsObj.AppointmentId = filtredArray[0].AppointmentId;
            }

            var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": $scope.HospitalId }, true) || [];
            if (filtredArray.length > 0) {
                $scope.PatientDepositsObj.BillingProviderId = filtredArray[0].DefaultBillingProviderId;
                $scope.PatientDepositsObj.OrganizationFacilityId = filtredArray[0].BranchId;
                $scope.PatientDepositsObj.FacilityName = filtredArray[0].BranchName;

                $scope.PatientPaymentObj.BillingProviderId = filtredArray[0].DefaultBillingProviderId || 0;
                $scope.PatientPaymentObj.OrganizationFacilityId = filtredArray[0].BranchId;
                $scope.PatientPaymentObj.FacilityName = filtredArray[0].BranchName;

            }

        }

        $scope.customFilter = function (item) {
            return item.DepositStatusId !== 2;
        };

        $scope.BacktoDeposit = function () {
            $scope.ViewDepositScreen = false;
            $scope.SubTab = 2;
        }

        $scope.GetPatientPaymentsList = function (item, ID, type) {

            var EOBId = null;
            if ($scope.Selectobj.PaymentEditType == 'PaymentEdit') {
                EOBId = $scope.Selectobj.item.EOBId;
            } else {
                EOBId = null;
            }


            let obj = {
                "PatientId": $scope.Selectobj.PatientId || null,
                "EOBId": EOBId,
                "PatientClaimId": $scope.Selectobj.PatientClaimId || null,
            }
            eHnoteInsuranceService.GetAllPatientResponsibilityDetails(obj).then(function (resp) {
                console.log(resp);

                if (resp.data.status === "Success") {

                    $scope.PatientClaimList = [];
                    $scope.EOBPatientClaimList = [];
                    $scope.mainPaymentObject.TotalChargeBalanceAmount = 0;
                    $scope.mainPaymentObject.TotalPatientBalanceAmount = 0;
                    $scope.mainPaymentObject.TotalPatientPaymentBalance = 0;
                    $scope.mainPaymentObject.TotalPreviousPaymentBalance = 0;
                    $scope.mainPaymentObject.TotalAdjustmentAmount = 0;
                    $scope.mainPaymentObject.TotalFinalPatientBalanceAmount = 0;
                    $scope.mainPaymentObject.TotalPayableAmount = 0;

                    if (resp.data.EOBClaims.length > 0) {
                        $scope.EOBPatientClaimList = resp.data.EOBClaims || [];
                    }
                    if ($scope.Selectobj.PaymentEditType == 'PaymentEdit') {
                        if (resp.data.EOBClaims.length > 0) {
                            $scope.AllPatientClaimList = resp.data.EOBClaims || [];
                            $scope.PatientClaimList = (resp.data.EOBClaims || []).filter(
                                eob => eob.EOBId === $scope.Selectobj.item.EOBId
                            );
                            var patientPaymentAmt = 0; var patientcollectedAmount = 0; var patienttotalDue = 0; var patientActualBalance = 0; var patientAdjAmt = 0;
                            angular.forEach($scope.PatientClaimList, function (Aitem) {
                                Aitem.TotalClaimAmount = 0;
                                Aitem.TotalClaimAmount = Aitem.TotalChargeAmount;
                                Aitem.ClaimPatientResponsibility = [];
                                if (Aitem.EOBClaimLineItems.length > 0) {
                                    angular.forEach(Aitem.EOBClaimLineItems, function (item) {


                                        let PatientlineItemsObj = angular.copy($scope.GetPatientlineItemsObj());
                                        PatientlineItemsObj.PatientClaimNumber = item.PatientClaimNumber;
                                        PatientlineItemsObj.EOBLineItemId = item.EOBLineItemId || null;
                                        PatientlineItemsObj.ClaimLineItemId = item.ClaimLineItemId;
                                        PatientlineItemsObj.PatientClaimId = item.PatientClaimId;
                                        PatientlineItemsObj.EOBId = $scope.Selectobj.item.EOBId;
                                        PatientlineItemsObj.ServiceId = item.ServiceId;
                                        PatientlineItemsObj.ServiceName = item.ServiceName;
                                        PatientlineItemsObj.ServiceCode = item.ServiceCode;
                                        PatientlineItemsObj.OrganizationProcedureId = item.OrganizationProcedureId;
                                        PatientlineItemsObj.DOSfrom = item.DOSfrom;
                                        PatientlineItemsObj.PlaceOfServiceId = item.PlaceOfServiceId;
                                        PatientlineItemsObj.PlaceOfServiceName = item.PlaceOfServiceName;
                                        PatientlineItemsObj.UnitCharge = item.UnitCharge;
                                        PatientlineItemsObj.Quantity = item.Quantity;
                                        PatientlineItemsObj.RenderingProviderId = item.RenderingProviderId;
                                        PatientlineItemsObj.TypeOfServiceId = item.TypeOfServiceId;
                                        PatientlineItemsObj.RevenueBillingCode = item.RevenueBillingCode;
                                        PatientlineItemsObj.RevenueBillingCodeId = item.RevenueBillingCodeId;
                                        PatientlineItemsObj.PatientPaid = item.PatientPaid;
                                        PatientlineItemsObj.TotalChargeAmount = item.TotalChargeAmount;
                                        PatientlineItemsObj.AllowedAmount = item.AllowedAmount;
                                        PatientlineItemsObj.InsurancePaymentAmount = item.InsurancePaymentAmount;
                                        PatientlineItemsObj.CoPaymentAmount = item.CoPaymentAmount;
                                        PatientlineItemsObj.AdjustmentAmount = item.AdjustmentAmount;
                                        PatientlineItemsObj.DeductibleAmount = item.DeductibleAmount;
                                        PatientlineItemsObj.CoInsuranceAmount = item.CoInsuranceAmount;
                                        // PatientlineItemsObj.PatientPaymentAmount = item.PatientPaymentAmount;
                                        PatientlineItemsObj.PatientPaymentAmount = item.PaymentAmount;
                                        //PatientlineItemsObj.WriteOffAmount = item.WriteOffAmount;
                                        PatientlineItemsObj.WriteOffAmount = item.PatientWriteOffAmount;
                                        PatientlineItemsObj.PreviousPaymentAmount = item.PaymentAmount;
                                        PatientlineItemsObj.PreviousAdjustmentAmount = item.PatientWriteOffAmount;
                                        PatientlineItemsObj.PatientResponsibilityAmount = item.PatientResponsibility;

                                        // PatientlineItemsObj.AdjustmentReasonCodeId = 0;
                                        PatientlineItemsObj.AdjustmentReasonCodeId = item.AdjustmentReasonCodeId || 0;
                                        var filterArray = $filter("filter")($scope.WriteOffReasons, { "OrganizationWriteOffReasonId": PatientlineItemsObj.AdjustmentReasonCodeId }, true) || [];
                                        if (filterArray.length > 0) {
                                            PatientlineItemsObj.AdjsutmentReasonDescription = filterArray[0].ReasonDescription;
                                            PatientlineItemsObj.AdjustmentReasonCode = filterArray[0].ReasonCode;
                                        }
                                        PatientlineItemsObj.InsuranceBalance = item.InsuranceBalance;
                                        //PatientlineItemsObj.PatientBalance = item.PatientBalance;
                                        PatientlineItemsObj.PatientBalance = item.PatientResponsibility;
                                        PatientlineItemsObj.PreviousPatientBalance = item.PatientBalance;
                                        PatientlineItemsObj.CurrentPatientBalance = item.PatientBalance;
                                        PatientlineItemsObj.TotalBalance = item.TotalBalance;
                                        // PatientlineItemsObj.PreviousPaymentAmount = item.PaymentAmount + item.PatientWriteOffAmount;
                                        PatientlineItemsObj.PatientPaymentTypeId = item.PatientPaymentTypeId;
                                        PatientlineItemsObj.IsEditMode = (item.PaymentAmount ?? 0) !== 0 || (item.PatientWriteOffAmount ?? 0) !== 0;
                                        PatientlineItemsObj.IsPaymentEdit = false;
                                        PatientlineItemsObj.IsAdjCodeEnable = false;
                                        PatientlineItemsObj.IsChecked = true;
                                        $scope.AllSelectionObj.IsAllItemsChecked = true;
                                        PatientlineItemsObj.ClaimTransactions = item.ClaimTransactions || [];

                                        if ($scope.Selectobj.Incomingfrom == "EditClaim") {
                                            PatientlineItemsObj.IsEditMode = false;
                                            PatientlineItemsObj.IsPaymentEdit = true;
                                        }

                                        Aitem.ClaimPatientResponsibility.push(PatientlineItemsObj);

                                        $scope.mainPaymentObject.TotalChargeBalanceAmount += item.TotalChargeAmount;
                                        $scope.mainPaymentObject.TotalPatientBalanceAmount += item.PatientBalance || 0;
                                        //$scope.TotalPatientPaymentBalance += item.PatientPaymentAmount;
                                        //$scope.TotalPatientPaymentBalance = 0;
                                        $scope.mainPaymentObject.TotalAdjustmentAmount += PatientlineItemsObj.WriteOffAmount;
                                        //$scope.TotalAdjustmentBalanceAmount = 0;
                                        //$scope.TotalPreviousPaymentBalance += PatientlineItemsObj.PreviousPaymentAmount;
                                        patientActualBalance += PatientlineItemsObj.PatientBalance;
                                        patientPaymentAmt += PatientlineItemsObj.PatientPaymentAmount;
                                        patienttotalDue += PatientlineItemsObj.TotalBalance;
                                    });

                                }

                                $scope.PatientPaymentObj.OrganizationName = Aitem.OrganizationName || "";
                                $scope.PatientPaymentObj.PatientId = Aitem.PatientId || null;

                                console.log($scope.mainPaymentObject.TotalPayableAmount);

                                if (type == 'Allocate') {
                                    $scope.IsDepositAllocationEditMode = true;
                                } else {
                                    if ($scope.mainPaymentObject.TotalPatientBalanceAmount == 0) {
                                        $scope.IsDepositAllocationEditMode = false;
                                    }
                                    else {
                                        $scope.IsDepositAllocationEditMode = true;
                                    }
                                }



                            });



                            console.log($scope.mainPaymentObject.TotalPaidAmount);
                            console.log($scope.mainPaymentObject.TotalPatientBalanceAmount);
                            console.log($scope.PatientPaymentObj.UnBilledAmount);

                            $scope.mainPaymentObject.TotalPatientBalanceAmount = patientActualBalance || 0;
                            $scope.mainPaymentObject.TotalFinalPatientBalanceAmount = patientActualBalance || 0;
                            $scope.mainPaymentObject.TotalFinalPatientBalanceAmount = parseFloat($scope.mainPaymentObject.TotalFinalPatientBalanceAmount.toFixed(2));

                            $scope.mainPaymentObject.TotalPayableAmount = patientPaymentAmt || 0;
                            $scope.mainPaymentObject.TotalPayableAmount = parseFloat($scope.mainPaymentObject.TotalPayableAmount.toFixed(2));

                            if ($scope.PatientPaymentObj.UnBilledAmount > 0) {
                                $scope.mainPaymentObject.TotalPaidAmount = $scope.PatientPaymentObj.UnBilledAmount || 0;
                                $scope.mainPaymentObject.TotalPatientBalanceAmount = $scope.mainPaymentObject.TotalFinalPatientBalanceAmount - $scope.mainPaymentObject.TotalPaidAmount;
                            }

                            $scope.mainPaymentObject.TotalPatientBalanceAmount = parseFloat($scope.mainPaymentObject.TotalPatientBalanceAmount.toFixed(2));

                            console.log($scope.mainPaymentObject.TotalPayableAmount);


                            console.log($scope.mainPaymentObject.TotalPaidAmount);
                            console.log($scope.mainPaymentObject.TotalPatientBalanceAmount);


                            if (ID == 1) {
                                PatientDepositAllocated(item, type);
                                $scope.getPatientDepositAmountById();
                            }
                            if ($scope.Selectobj.Incomingfrom == "EditClaim") {
                                $scope.getPatientDepositAmountById();
                                if (type == 'Allocate') {
                                    $scope.IsDepositAllocationEditMode = true;
                                } else {
                                    if ($scope.mainPaymentObject.TotalPatientBalanceAmount == 0) {
                                        $scope.IsDepositAllocationEditMode = false;
                                    }
                                    else {
                                        $scope.IsDepositAllocationEditMode = true;
                                    }
                                }

                                if ($scope.EOBPatientClaimList.length > 0) {
                                    angular.forEach($scope.EOBPatientClaimList, function (Aitem) {
                                        angular.forEach($scope.PatientClaimList, function (Bitem) {
                                            Bitem.EOBClaimInfoId = Aitem.EOBClaimInfoId || 0;
                                            if (Aitem.EOBClaimLineItems.length > 0) {
                                                angular.forEach(Aitem.EOBClaimLineItems, function (jitem) {
                                                    angular.forEach(Bitem.ClaimPatientResponsibility, function (kitem) {

                                                        if (jitem.ClaimLineItemId == kitem.ClaimLineItemId) {
                                                            kitem.EOBLineItemId = jitem.EOBLineItemId || 0;
                                                            kitem.PatientPaymentTypeId = jitem.PatientPaymentTypeId || 0;
                                                            /*kitem.AdjustmentReasonCodeId = jitem.AdjustmentReasonCodeId || 0;*/
                                                        }
                                                    });
                                                });
                                            }
                                        });
                                    });
                                }
                            }

                            if (Selectobj.Allocate == 3) {
                                $scope.SelectedDepositeAllocatePayment(Selectobj.item);
                                // Selectobj.Allocate = '';
                            }
                        }
                    }
                    else {

                        if (resp.data.rows.length > 0) {
                            $scope.PatientClaimList = resp.data.rows || [];

                            var patientPaymentAmt = 0; var patientcollectedAmount = 0; var patienttotalDue = 0; var patientActualBalance = 0; var patientAdjAmt = 0;
                            angular.forEach($scope.PatientClaimList, function (Aitem) {
                                Aitem.ClaimPatientResponsibility = [];
                                if (Aitem.PatientClaimLineItems.length > 0) {
                                    angular.forEach(Aitem.PatientClaimLineItems, function (item) {
                                        let PatientlineItemsObj = angular.copy($scope.GetPatientlineItemsObj());
                                        PatientlineItemsObj.PatientClaimNumber = item.PatientClaimNumber;
                                        PatientlineItemsObj.EOBLineItemId = item.EOBLineItemId || null;
                                        PatientlineItemsObj.ClaimLineItemId = item.ClaimLineItemId;
                                        PatientlineItemsObj.PatientClaimId = item.PatientClaimId;
                                        PatientlineItemsObj.ServiceId = item.ServiceId;
                                        PatientlineItemsObj.ServiceName = item.ServiceName;
                                        PatientlineItemsObj.ServiceCode = item.ServiceCode;
                                        PatientlineItemsObj.OrganizationProcedureId = item.OrganizationProcedureId;
                                        PatientlineItemsObj.DOSfrom = item.DOSfrom;
                                        PatientlineItemsObj.PlaceOfServiceId = item.PlaceOfServiceId;
                                        PatientlineItemsObj.PlaceOfServiceName = item.PlaceOfServiceName;
                                        PatientlineItemsObj.UnitCharge = item.UnitCharge;
                                        PatientlineItemsObj.Quantity = item.Quantity;
                                        PatientlineItemsObj.RenderingProviderId = item.RenderingProviderId;
                                        PatientlineItemsObj.TypeOfServiceId = item.TypeOfServiceId;
                                        PatientlineItemsObj.RevenueBillingCode = item.RevenueBillingCode;
                                        PatientlineItemsObj.RevenueBillingCodeId = item.RevenueBillingCodeId;
                                        PatientlineItemsObj.PatientPaid = item.PatientPaid;
                                        PatientlineItemsObj.TotalChargeAmount = item.TotalChargeAmount;
                                        PatientlineItemsObj.AllowedAmount = item.AllowedAmount;
                                        PatientlineItemsObj.InsurancePaymentAmount = item.InsurancePaymentAmount;
                                        PatientlineItemsObj.CoPaymentAmount = item.CoPaymentAmount;
                                        PatientlineItemsObj.AdjustmentAmount = item.AdjustmentAmount;
                                        PatientlineItemsObj.DeductibleAmount = item.DeductibleAmount;
                                        PatientlineItemsObj.CoInsuranceAmount = item.CoInsuranceAmount;
                                        // PatientlineItemsObj.PatientPaymentAmount = item.PatientPaymentAmount;
                                        PatientlineItemsObj.PatientPaymentAmount = item.PatientBalance;
                                        //PatientlineItemsObj.WriteOffAmount = item.WriteOffAmount;
                                        PatientlineItemsObj.WriteOffAmount = 0;
                                        PatientlineItemsObj.AdjustmentReasonCodeId = 0;
                                        PatientlineItemsObj.InsuranceBalance = item.InsuranceBalance;
                                        PatientlineItemsObj.PatientBalance = item.PatientBalance;
                                        PatientlineItemsObj.PreviousPatientBalance = item.PatientBalance;
                                        PatientlineItemsObj.CurrentPatientBalance = item.PatientBalance;
                                        PatientlineItemsObj.TotalBalance = item.TotalBalance;
                                        PatientlineItemsObj.PreviousPaymentAmount = item.PatientPaymentAmount + item.WriteOffAmount;
                                        PatientlineItemsObj.PatientPaymentTypeId = item.PatientPaymentTypeId;
                                        PatientlineItemsObj.IsEditMode = (item.PatientPaymentAmount ?? 0) !== 0 || (item.WriteOffAmount ?? 0) !== 0;
                                        PatientlineItemsObj.IsPaymentEdit = false;
                                        PatientlineItemsObj.IsAdjCodeEnable = false;
                                        PatientlineItemsObj.IsChecked = true;
                                        $scope.AllSelectionObj.IsAllItemsChecked = true;
                                        PatientlineItemsObj.ClaimTransactions = item.ClaimTransactions || [];
                                        PatientlineItemsObj.PatientResponsibilityAmount = item.PatientResponsibilityAmount || "";

                                        if ($scope.Selectobj.Incomingfrom == "EditClaim") {
                                            PatientlineItemsObj.IsEditMode = false;
                                            PatientlineItemsObj.IsPaymentEdit = true;
                                        }
                                        if (item.PatientBalance == 0) {
                                            PatientlineItemsObj.PatientPaymentAmount = item.PatientPaymentAmount;
                                            PatientlineItemsObj.WriteOffAmount = item.WriteOffAmount;
                                        }
                                        Aitem.ClaimPatientResponsibility.push(PatientlineItemsObj);

                                        $scope.mainPaymentObject.TotalChargeBalanceAmount += item.TotalChargeAmount;
                                        $scope.mainPaymentObject.TotalPatientBalanceAmount += item.PatientBalance || 0;
                                        //$scope.TotalPatientPaymentBalance += item.PatientPaymentAmount;
                                        //$scope.TotalPatientPaymentBalance = 0;
                                        $scope.mainPaymentObject.TotalAdjustmentAmount += PatientlineItemsObj.WriteOffAmount;
                                        //$scope.TotalAdjustmentBalanceAmount = 0;
                                        //$scope.TotalPreviousPaymentBalance += PatientlineItemsObj.PreviousPaymentAmount;
                                        patientActualBalance += PatientlineItemsObj.PatientBalance;
                                        patientPaymentAmt += PatientlineItemsObj.PatientPaymentAmount;
                                        patienttotalDue += PatientlineItemsObj.TotalBalance;
                                    });
                                }
                                $scope.PatientPaymentObj.OrganizationName = Aitem.OrganizationName || "";
                                $scope.PatientPaymentObj.PatientId = Aitem.PatientId || null;

                                console.log($scope.mainPaymentObject.TotalPayableAmount);


                                //console.log($scope.mainPaymentObject.TotalPaidAmount);
                                //console.log($scope.mainPaymentObject.TotalPatientBalanceAmount);
                                //console.log($scope.PatientPaymentObj.UnBilledAmount);



                                //if ($scope.PatientPaymentObj.UnBilledAmount > 0) {

                                //    var collectedAmount = $scope.PatientPaymentObj.UnBilledAmount;
                                //    var patientBalance = $scope.mainPaymentObject.TotalPatientBalanceAmount
                                //    var allowedAmount = Math.min(collectedAmount, patientBalance);
                                //    $scope.PatientPaymentObj.UnBilledAmount = allowedAmount;

                                //    $scope.mainPaymentObject.TotalFinalPatientBalanceAmount = $scope.mainPaymentObject.TotalPatientBalanceAmount || 0;
                                //    $scope.mainPaymentObject.TotalPayableAmount = parseFloat($scope.mainPaymentObject.TotalFinalPatientBalanceAmount);
                                //    $scope.mainPaymentObject.TotalPatientPaymentBalance = $scope.PatientPaymentObj.UnBilledAmount || 0;
                                //    $scope.mainPaymentObject.TotalPaidAmount = $scope.PatientPaymentObj.UnBilledAmount || 0;
                                //    $scope.mainPaymentObject.TotalPatientBalanceAmount = parseFloat($scope.mainPaymentObject.TotalFinalPatientBalanceAmount) - $scope.mainPaymentObject.TotalPaidAmount;
                                //}
                                //else {
                                //    $scope.mainPaymentObject.TotalPatientBalanceAmount = $scope.mainPaymentObject.TotalPatientBalanceAmount || 0;
                                //    $scope.mainPaymentObject.TotalFinalPatientBalanceAmount = $scope.mainPaymentObject.TotalPatientBalanceAmount || 0;
                                //    $scope.mainPaymentObject.TotalPayableAmount = $scope.mainPaymentObject.TotalPatientBalanceAmount || 0;
                                //}

                                //console.log($scope.mainPaymentObject.TotalPayableAmount);


                                //console.log($scope.mainPaymentObject.TotalPaidAmount);
                                //console.log($scope.mainPaymentObject.TotalPatientBalanceAmount);

                                //const total = $scope.PatientClaimList[0].ClaimPatientResponsibility.reduce((sum, item) => {
                                //    return sum + (item.DeleteInd !== 'Y' ? (parseFloat(item.PatientBalance) || 0) : 0);
                                //}, 0);

                                //$scope.PatientDepositsObj.DepositAmount = total;
                                if (type == 'Allocate') {
                                    $scope.IsDepositAllocationEditMode = true;
                                } else {
                                    if ($scope.mainPaymentObject.TotalPatientBalanceAmount == 0) {
                                        $scope.IsDepositAllocationEditMode = false;
                                    }
                                    else {
                                        $scope.IsDepositAllocationEditMode = true;
                                    }
                                }



                            });



                            console.log($scope.mainPaymentObject.TotalPaidAmount);
                            console.log($scope.mainPaymentObject.TotalPatientBalanceAmount);
                            console.log($scope.PatientPaymentObj.UnBilledAmount);

                            $scope.mainPaymentObject.TotalPatientBalanceAmount = patientActualBalance || 0;
                            $scope.mainPaymentObject.TotalFinalPatientBalanceAmount = patientActualBalance || 0;
                            $scope.mainPaymentObject.TotalFinalPatientBalanceAmount = parseFloat($scope.mainPaymentObject.TotalFinalPatientBalanceAmount.toFixed(2));

                            $scope.mainPaymentObject.TotalPayableAmount = patientPaymentAmt || 0;
                            $scope.mainPaymentObject.TotalPayableAmount = parseFloat($scope.mainPaymentObject.TotalPayableAmount.toFixed(2));

                            if ($scope.PatientPaymentObj.UnBilledAmount > 0) {
                                $scope.mainPaymentObject.TotalPaidAmount = $scope.PatientPaymentObj.UnBilledAmount || 0;
                                $scope.mainPaymentObject.TotalPatientBalanceAmount = $scope.mainPaymentObject.TotalFinalPatientBalanceAmount - $scope.mainPaymentObject.TotalPaidAmount;
                            }

                            $scope.mainPaymentObject.TotalPatientBalanceAmount = parseFloat($scope.mainPaymentObject.TotalPatientBalanceAmount.toFixed(2));

                            console.log($scope.mainPaymentObject.TotalPayableAmount);


                            console.log($scope.mainPaymentObject.TotalPaidAmount);
                            console.log($scope.mainPaymentObject.TotalPatientBalanceAmount);


                            if (ID == 1) {
                                PatientDepositAllocated(item, type);
                                $scope.getPatientDepositAmountById();
                            }
                            if ($scope.Selectobj.Incomingfrom == "EditClaim") {
                                $scope.getPatientDepositAmountById();
                                if (type == 'Allocate') {
                                    $scope.IsDepositAllocationEditMode = true;
                                } else {
                                    if ($scope.mainPaymentObject.TotalPatientBalanceAmount == 0) {
                                        $scope.IsDepositAllocationEditMode = false;
                                    }
                                    else {
                                        $scope.IsDepositAllocationEditMode = true;
                                    }
                                }

                                if ($scope.EOBPatientClaimList.length > 0) {
                                    angular.forEach($scope.EOBPatientClaimList, function (Aitem) {
                                        angular.forEach($scope.PatientClaimList, function (Bitem) {
                                            Bitem.EOBClaimInfoId = Aitem.EOBClaimInfoId || 0;
                                            if (Aitem.EOBClaimLineItems.length > 0) {
                                                angular.forEach(Aitem.EOBClaimLineItems, function (jitem) {
                                                    angular.forEach(Bitem.ClaimPatientResponsibility, function (kitem) {

                                                        if (jitem.ClaimLineItemId = kitem.ClaimLineItemId) {
                                                            kitem.EOBLineItemId = jitem.EOBLineItemId || 0;
                                                            kitem.PatientPaymentTypeId = jitem.PatientPaymentTypeId || 0;
                                                            /*kitem.AdjustmentReasonCodeId = jitem.AdjustmentReasonCodeId || 0;*/
                                                        }
                                                    });
                                                });
                                            }
                                        });
                                    });
                                }
                            }

                            if (Selectobj.Allocate == 3) {
                                $scope.SelectedDepositeAllocatePayment(Selectobj.item);
                                // Selectobj.Allocate = '';
                            }
                        }
                    }
                }
            });

        }
        $scope.initpage();

        $scope.SelectedPatient = function (item) {
            $scope.PatientDepositsObj.PatientId = item.PatientId;
            $scope.SearchObj.ShowpatientListdiv = false;

            $scope.SelectedPatientDetails.PatientObj = item || "";

            if (item.PatientId !== '') {
                eHnoteInsuranceService.GetPatientTotalDepositsById(item.PatientId).then(function (resp) {
                    if (resp.data[0].status === "success") {
                        $scope.Selectedpatientobj = '';
                        $scope.Selectedpatientobj = resp.data[0];


                        if ($scope.Selectedpatientobj.AppointmentmentsArray.length > 0) {
                            /* $scope.PatientDepositsObj.AppointmentId = $scope.PatientDepositsObj.Selectedpatientobj.AppointmentmentsArray[0].AppointmentId;*/

                            angular.forEach($scope.Selectedpatientobj.AppointmentmentsArray, function (ditem) {
                                ditem.AppointmentDate = $filter('date')(ditem.AppointmentDate, "MM-dd-yyyy");
                            });
                        }

                        $scope.changeAppointment($scope.Selectedpatientobj.AppointmentmentsArray[0].AppointmentId);

                    } else {
                        alertify.error(resp.data.Message);
                    }
                });
            }
        }

        $scope.IsViewDepositScreen = false;
        $scope.SelectedDepositeAllocatePayment = function (item, type) {
            $scope.ViewDepositScreen = false;
            //if ($scope.ClaimSaveSatus == 'AddClaim') {
            //    alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>To allocate the deposit you need to save the claim, do you want to save the claim and continue?</h4>", function () {
            //        if ($scope.mainClaimObject != undefined) {
            //            $scope.PatientClaimTransmissionObj.TotalClaimAmount = $scope.mainClaimObject.TotalClaimAmount;
            //            $scope.mainClaimObject.PatientClaimTransmission = angular.copy($scope.PatientClaimTransmissionObj);


            //            angular.forEach($scope.addedDiagnosisArray, function (ditem, dindex) {
            //                if (dindex === 0) {
            //                    $scope.mainClaimObject.ICD1 = ditem.ICDCode;
            //                    $scope.mainClaimObject.ICD1Name = ditem.DiagnosisName;
            //                    $scope.mainClaimObject.ICD1DiagnosisId = ditem.DiagnosisId;
            //                }
            //                if (dindex === 1) {
            //                    $scope.mainClaimObject.ICD2 = ditem.ICDCode;
            //                    $scope.mainClaimObject.ICD2Name = ditem.DiagnosisName;
            //                    $scope.mainClaimObject.ICD2DiagnosisId = ditem.DiagnosisId;
            //                }
            //                if (dindex === 2) {
            //                    $scope.mainClaimObject.ICD3 = ditem.ICDCode;
            //                    $scope.mainClaimObject.ICD3Name = ditem.DiagnosisName;
            //                    $scope.mainClaimObject.ICD3DiagnosisId = ditem.DiagnosisId;
            //                }
            //                if (dindex === 3) {
            //                    $scope.mainClaimObject.ICD4 = ditem.ICDCode;
            //                    $scope.mainClaimObject.ICD4Name = ditem.DiagnosisName;
            //                    $scope.mainClaimObject.ICD4DiagnosisId = ditem.DiagnosisId;
            //                }
            //                if (dindex === 4) {
            //                    $scope.mainClaimObject.ICD5 = ditem.ICDCode;
            //                    $scope.mainClaimObject.ICD5Name = ditem.DiagnosisName;
            //                    $scope.mainClaimObject.ICD5DiagnosisId = ditem.DiagnosisId;
            //                }
            //                if (dindex === 5) {
            //                    $scope.mainClaimObject.ICD6 = ditem.ICDCode;
            //                    $scope.mainClaimObject.ICD6Name = ditem.DiagnosisName;
            //                    $scope.mainClaimObject.ICD6DiagnosisId = ditem.DiagnosisId;
            //                }
            //                if (dindex === 6) {
            //                    $scope.mainClaimObject.ICD7 = ditem.ICDCode;
            //                    $scope.mainClaimObject.ICD7Name = ditem.DiagnosisName;
            //                    $scope.mainClaimObject.ICD7DiagnosisId = ditem.DiagnosisId;
            //                }
            //                if (dindex === 7) {
            //                    $scope.mainClaimObject.ICD8 = ditem.ICDCode;
            //                    $scope.mainClaimObject.ICD8Name = ditem.DiagnosisName;
            //                    $scope.mainClaimObject.ICD8DiagnosisId = ditem.DiagnosisId;
            //                }
            //                if (dindex === 8) {
            //                    $scope.mainClaimObject.ICD9 = ditem.ICDCode;
            //                    $scope.mainClaimObject.ICD9Name = ditem.DiagnosisName;
            //                    $scope.mainClaimObject.ICD9DiagnosisId = ditem.DiagnosisId;
            //                }
            //                if (dindex === 9) {
            //                    $scope.mainClaimObject.ICD10 = ditem.ICDCode;
            //                    $scope.mainClaimObject.ICD10Name = ditem.DiagnosisName;
            //                    $scope.mainClaimObject.ICD10DiagnosisId = ditem.DiagnosisId;
            //                }
            //                if (dindex === 10) {
            //                    $scope.mainClaimObject.ICD11 = ditem.ICDCode;
            //                    $scope.mainClaimObject.ICD11Name = ditem.DiagnosisName;
            //                    $scope.mainClaimObject.ICD11DiagnosisId = ditem.DiagnosisId;
            //                }
            //                if (dindex === 11) {
            //                    $scope.mainClaimObject.ICD12 = ditem.ICDCode;
            //                    $scope.mainClaimObject.ICD12Name = ditem.DiagnosisName;
            //                    $scope.mainClaimObject.ICD12DiagnosisId = ditem.DiagnosisId;
            //                }
            //            });


            //            let Modifierscount = 0;
            //            let RevenueCount = 0;
            //            angular.forEach($scope.mainClaimObject.PatientClaimLineItems, function (sitem, index) {
            //                if (sitem.ServiceCode == "") {
            //                    $scope.mainClaimObject.PatientClaimLineItems.splice(index, 1);
            //                    sitem.RenderingProviderId = $scope.mainClaimObject.RenderingProviderId;

            //                }
            //                if ($scope.mainClaimObject.ClaimTypeId == 1) {
            //                    sitem.ModifierObj1 = sitem.ModifierObj1 || "";
            //                    sitem.ModifierObj2 = sitem.ModifierObj2 || "";
            //                    sitem.ModifierObj3 = sitem.ModifierObj3 || "";
            //                    sitem.ModifierObj4 = sitem.ModifierObj4 || "";
            //                    if (sitem.ModifierObj1 != "" || sitem.ModifierObj2 != "" || sitem.ModifierObj3 != "" || sitem.ModifierObj4 != "") {
            //                        Modifierscount++;

            //                    }

            //                } else if ($scope.mainClaimObject.ClaimTypeId == 2) {
            //                    if (sitem.RevenueBillingCode == null || sitem.RevenueBillingCode == "" || sitem.RevenueBillingCode == undefined) {
            //                        sitem.RevenueBillingCode = null;
            //                    }
            //                    //sitem.RevenueBillingCode = sitem.RevenueBillingCode || "";
            //                    // Check if Revenue Code is missing
            //                    if (sitem.RevenueBillingCode == null) {
            //                        RevenueCount++;


            //                    }
            //                } else {

            //                }

            //                sitem.DragServiceLine = index + 1;
            //            });
            //            //if (Modifierscount == 0) {
            //            //    alertify.error("please select modifiers");
            //            //    return false;
            //            //}
            //            //if (RevenueCount > 0) {
            //            //    alertify.error("Please Select Revenue Codes")
            //            //    return false;
            //            //}




            //            console.log(JSON.stringify($scope.mainClaimObject));
            //            console.log($scope.PatientClaimTransmissionObj);


            //            if ($scope.mainClaimObject.BillPaymentTypeId === 1) {
            //                $scope.mainClaimObject.ClaimProcessingStatusId = 5;
            //                $scope.mainClaimObject.ClaimProcessingStatus = 'Sent';

            //            } else {
            //                $scope.mainClaimObject.ClaimProcessingStatusId = 4;
            //                $scope.mainClaimObject.ClaimProcessingStatus = 'Sent';
            //            }

            //            if ($scope.mainClaimObject.BillPaymentTypeId == 2) {
            //                // $scope.mainClaimObject.TotalInsuranceBalance = $scope.mainClaimObject.TotalClaimAmount;

            //                $scope.mainClaimObject.BillStatusId = 2;
            //                $scope.mainClaimObject.BillStatus = 'In Progress';
            //            }

            //            $scope.mainClaimObject.VisitId = $scope.mainClaimObject.VisitId || 0;

            //            $scope.mainClaimObject.ClaimStatusId = 1;
            //            $scope.mainClaimObject.ClaimStatus = "Not Transmitted";

            //            $scope.mainClaimObject.TempDocumentDetails = $scope.mainClaimObject.TempDocumentDetails || [];
            //            if ($scope.mainClaimObject.TempDocumentDetails.length > 0) {
            //                angular.forEach($scope.mainClaimObject.TempDocumentDetails, function (item) {
            //                    item.DocumentId = item.DocumentId || 0;
            //                    var object = {
            //                        "file": item.file,
            //                        "S3URL": item.S3URL || '',
            //                        "DeleteInd": "N",
            //                        "DocumentId": item.DocumentId,
            //                        "PatientClaimId": item.PatientClaimId || null,
            //                        "FileName": item.FileName,
            //                        "FileExt": item.FileExt,
            //                        "FileTypeId": 38,
            //                        "DisplayName": item.DisplayName,
            //                    };
            //                    $scope.mainClaimObject.DocumentDetails.unshift(object);
            //                });
            //            }

            //            eHnotePatientDataService.AddUpdatePatientClaimNew($scope.mainClaimObject, onClaimSaveSuccess, onClaimSaveError);


            //            function onClaimSaveSuccess(resp) {
            //                console.log(resp);
            //                if (resp.Status === 'Success') {


            //                    alertify.success("Claim Saved Successfully");

            //                    $scope.mainClaimObject.ClaimTransmissionId = resp.ClaimTransmissionId || null;
            //                    $scope.mainClaimObject.PatientClaimId = resp.PatientClaimId || null;
            //                    $scope.mainClaimObject.PatientClaimNumber = resp.PatientClaimNumber || null;
            //                    $scope.Selectobj.PatientClaimId = resp.PatientClaimId || null;
            //                    if (resp.ClaimLineitems.length > 0) {
            //                        $scope.TotalclaimPatientBalance = 0;
            //                        if ($scope.mainClaimObject.PatientClaimLineItems.length > 0) {
            //                            angular.forEach(resp.ClaimLineitems, function (Aitem) {
            //                                angular.forEach($scope.mainClaimObject.PatientClaimLineItems, function (Bitem) {
            //                                    if (Aitem.ServiceId == Bitem.ServiceId) {
            //                                        Bitem.ClaimLineItemId = Aitem.ClaimLineItemId || 0;
            //                                    }
            //                                });
            //                                $scope.TotalclaimPatientBalance += Aitem.PatientBalance || 0;
            //                            });
            //                        }
            //                    }
            //                    $scope.mainPaymentObject.TotalFinalPatientBalanceAmount = $scope.TotalclaimPatientBalance || 0;
            //                }
            //                $scope.ClaimSaveSatus = '';
            //                // PatientDepositAllocated(item);
            //                $scope.PatientPaymentObj.UnBilledAmount = item.UnBilledAmount;
            //                if (item.PatientDepositPaymodeList && item.PatientDepositPaymodeList.length > 0) {
            //                    if (item.UnBilledAmount > $scope.mainPaymentObject.TotalFinalPatientBalanceAmount) {
            //                        var collectedAmount = $scope.PatientPaymentObj.UnBilledAmount;
            //                        var patientBalance = $scope.mainPaymentObject.TotalPatientBalanceAmount
            //                        var allowedAmount = Math.min(collectedAmount, $scope.mainPaymentObject.TotalFinalPatientBalanceAmount);
            //                        var consolidatedDeposit = {
            //                            PatientDepositPaymodeListId: 0,
            //                            PaymentMethodId: 14,
            //                            PaymentMethodName: "Patient Deposits",
            //                            DepositAmount: allowedAmount,
            //                            PatientDepositId: item.PatientDepositId,
            //                            ReferenceNumber: '',
            //                            DeleteInd: 'N',
            //                            CardNumber: '',
            //                            CardType: '',
            //                            CardtypeId: 0,
            //                            IsCollectPayment: true
            //                        };
            //                    }
            //                    else {
            //                        var consolidatedDeposit = {
            //                            PatientDepositPaymodeListId: 0,
            //                            PaymentMethodId: 14,
            //                            PaymentMethodName: "Patient Deposits",
            //                            DepositAmount: item.UnBilledAmount,
            //                            PatientDepositId: item.PatientDepositId,
            //                            ReferenceNumber: '',
            //                            DeleteInd: 'N',
            //                            CardNumber: '',
            //                            CardType: '',
            //                            CardtypeId: 0,
            //                            IsCollectPayment: true
            //                        };
            //                    }


            //                    $scope.PatientPaymentObj.PatientDepositPaymodeList.push(consolidatedDeposit);
            //                }
            //                $scope.GetPatientPaymentsList(item, 1, 'Allocate');
            //                console.log("GetPatientPaymentsList call2");
            //            }
            //            function onClaimSaveError(error) {
            //                console.log(error);
            //            }

            //        }
            //        //function PatientDepositAllocated(item) {
            //        //    $scope.SubTab = 1;
            //        //    $scope.IsViewDepositScreen = true;
            //        //    $scope.PatientPaymentObj.PatientDepositPaymodeList = [];
            //        //    $scope.PatientPaymentObj.PatientId = item.PatientId;
            //        //    $scope.PatientPaymentObj.AppointmentId = item.AppointmentID;
            //        //    $scope.PatientPaymentObj.ReceiptNo = item.ReceiptNo;
            //        //    $scope.PatientPaymentObj.PaymentMethodId = item.PaymentMethodId;
            //        //    $scope.PatientPaymentObj.PaymentMethodName = item.PaymentMethodName;
            //        //    $scope.PatientPaymentObj.DepositDate = item.DepositDate;
            //        //    $scope.PatientPaymentObj.DepositDate = $filter('date')($scope.PatientPaymentObj.DepositDate, "MM-dd-yyyy");
            //        //    $scope.PatientPaymentObj.PatientDepositId = item.PatientDepositId || 0;
            //        //    $scope.PatientPaymentObj.DepositTypeId = item.DepositTypeId;
            //        //    $scope.PatientPaymentObj.DepositTypeName = item.DepositTypeName;
            //        //    $scope.PatientPaymentObj.DepositAmount = item.DepositAmount;
            //        //    $scope.PatientPaymentObj.Notes = item.Notes;
            //        //    $scope.PatientPaymentObj.BilledAmount = item.BilledAmount;
            //        //    $scope.PatientPaymentObj.UnBilledAmount = item.UnBilledAmount;
            //        //    $scope.PatientPaymentObj.PaymentsArray = item.PaymentsArray;
            //        //    $scope.PatientPaymentObj.IsPatientDeposit = $scope.DepositDetails.IsPatientDeposit;
            //        //    $scope.PatientPaymentObj.BillingProviderId = item.BillingProviderId || 0;
            //        //    $scope.PatientPaymentObj.BillingProviderName = item.BillingProviderName || '';
            //        //    /*$scope.PatientPaymentObj.PatientDepositPaymodeList = item.PatientDepositPaymodeList || [];*/
            //        //    $scope.PatientPaymentObj.OrganizationFacilityId = item.OrganizationFacilityId || 0;
            //        //    $scope.PatientPaymentObj.FacilityName = item.FacilityName || 0;


            //        //    $scope.PatientDepositDetails.DepositNumber = item.ReceiptNo || "";
            //        //    $scope.PatientDepositDetails.DepositAmount = item.UnBilledAmount || "";
            //        //    $scope.PatientDepositDetails.DepositDate = $filter('date')($scope.PatientPaymentObj.DepositDate, "MM-dd-yyyy") || "";

            //        //    if (item.DepositAmount == item.UnBilledAmount && $scope.TotalPatientBalanceAmount !=0) {
            //        //        $scope.PatientPaymentObj.DepositAmount = item.DepositAmount;
            //        //    } else {
            //        //        $scope.PatientPaymentObj.DepositAmount = item.UnBilledAmount;
            //        //    }

            //        //    if ($scope.PatientPaymentObj.DepositAmount > $scope.TotalPatientBalanceAmount) {
            //        //        $scope.PatientPaymentObj.DepositAmount = $scope.TotalPatientBalanceAmount;
            //        //    } else {

            //        //    }

            //        //    $scope.PaymentMethodObj.PatientDepositPaymodeListId = 0;
            //        //    $scope.PaymentMethodObj.PaymentMethodId = 14;
            //        //    $scope.PaymentMethodObj.PaymentMethodName = "Patient Deposits";
            //        //    $scope.PaymentMethodObj.DepositAmount = $scope.PatientPaymentObj.DepositAmount;
            //        //    $scope.PaymentMethodObj.ReferenceNumber = '';
            //        //    $scope.PaymentMethodObj.IsDepositAdded = false;
            //        //    $scope.PaymentMethodObj.DeleteInd = "N";
            //        //    $scope.PaymentMethodObj.PatientDepositId = item.PatientDepositId;
            //        //    $scope.PaymentMethodObj.CardNumber = '';
            //        //    $scope.PaymentMethodObj.CardType = '';
            //        //    $scope.PaymentMethodObj.CardtypeId = 0;
            //        //    $scope.PaymentMethodObj.PatientDepositAmt = $scope.PatientDepositDetails.DepositAmount || 0;
            //        //    $scope.PaymentMethodObj.PatientDepositDate = $scope.PatientDepositDetails.DepositDate || 0;
            //        //    $scope.PaymentMethodObj.DepositNumber = $scope.PatientDepositDetails.DepositNumber || 0;

            //        //    if ($scope.PatientPaymentObj.PatientDepositId != 0 && $scope.allClaimPatientPayments.length > 0) {
            //        //        let filteredList = $scope.allClaimPatientPayments.filter(function (item) {
            //        //            return item.PatientDepositId === $scope.PatientPaymentObj.PatientDepositId;
            //        //        });
            //        //        if (filteredList.length > 0) {
            //        //            $scope.PatientPaymentObj.EOBId = filteredList[0].EOBId || 0;
            //        //        }
            //        //    }

            //        //    if (type === "Update") {
            //        //        $scope.PatientPaymentObj.CurrentPaymentType = "Update";
            //        //    } else {
            //        //        $scope.PatientPaymentObj.CurrentPaymentType = "Allocate";
            //        //    }
            //        //    $scope.GetPatientPaymentsList();
            //        //}

            //    }, function () {

            //    });
            //}
            //else {

            //    $scope.SubTab = 1;
            //    $scope.IsViewDepositScreen = true;
            //    $scope.IsDepositAllocationEditMode = true;
            //    $scope.PatientPaymentObj.PatientDepositPaymodeList = [];
            //    $scope.PatientPaymentObj.PatientId = item.PatientId;
            //    $scope.PatientPaymentObj.AppointmentId = item.AppointmentID;
            //    $scope.PatientPaymentObj.ReceiptNo = item.ReceiptNo;
            //    $scope.PatientPaymentObj.PaymentMethodId = item.PaymentMethodId;
            //    $scope.PatientPaymentObj.PaymentMethodName = item.PaymentMethodName;
            //    $scope.PatientPaymentObj.DepositDate = item.DepositDate;
            //    $scope.PatientPaymentObj.DepositDate = $filter('date')($scope.PatientPaymentObj.DepositDate, "MM-dd-yyyy");
            //    $scope.PatientPaymentObj.PatientDepositId = 0;//item.PatientDepositId ||
            //    $scope.PatientPaymentObj.DepositTypeId = item.DepositTypeId;
            //    $scope.PatientPaymentObj.DepositTypeName = item.DepositTypeName;
            //    $scope.PatientPaymentObj.DepositAmount = item.DepositAmount;
            //    $scope.PatientPaymentObj.Notes = item.Notes;
            //    $scope.PatientPaymentObj.BilledAmount = item.BilledAmount;
            //    $scope.PatientPaymentObj.UnBilledAmount = item.UnBilledAmount;

            //    console.log($scope.PatientPaymentObj.UnBilledAmount + "__" + item.UnBilledAmount + "__" + item.BilledAmount);
            //    $scope.PatientPaymentObj.PaymentsArray = item.PaymentsArray;
            //    $scope.PatientPaymentObj.IsPatientDeposit = $scope.DepositDetails.IsPatientDeposit;
            //    $scope.PatientPaymentObj.BillingProviderId = item.BillingProviderId || 0;
            //    $scope.PatientPaymentObj.BillingProviderName = item.BillingProviderName || '';
            //    //$scope.PatientPaymentObj.PatientDepositPaymodeList = item.PatientDepositPaymodeList || [];
            //    $scope.PatientPaymentObj.OrganizationFacilityId = item.OrganizationFacilityId || 0;
            //    $scope.PatientPaymentObj.FacilityName = item.FacilityName || 0;

            //    $scope.PatientPaymentObj.PatientDepositPaymodeList = [];

            //    if (item.PatientDepositPaymodeList && item.PatientDepositPaymodeList.length > 0) {
            //        if (item.UnBilledAmount > $scope.mainPaymentObject.TotalFinalPatientBalanceAmount) {
            //            var collectedAmount = $scope.PatientPaymentObj.UnBilledAmount;
            //            var patientBalance = $scope.mainPaymentObject.TotalPatientBalanceAmount
            //            var allowedAmount = Math.min(collectedAmount, $scope.mainPaymentObject.TotalFinalPatientBalanceAmount);
            //            var consolidatedDeposit = {
            //                PatientDepositPaymodeListId: 0,
            //                PaymentMethodId: 14,
            //                PaymentMethodName: "Patient Deposits",
            //                DepositAmount: allowedAmount,
            //                PatientDepositId: item.PatientDepositId,
            //                ReferenceNumber: '',
            //                DeleteInd: 'N',
            //                CardNumber: '',
            //                CardType: '',
            //                CardtypeId: 0,
            //                IsCollectPayment: true
            //            };
            //        }
            //        else {
            //            var consolidatedDeposit = {
            //                PatientDepositPaymodeListId: 0,
            //                PaymentMethodId: 14,
            //                PaymentMethodName: "Patient Deposits",
            //                DepositAmount: item.UnBilledAmount,
            //                PatientDepositId: item.PatientDepositId,
            //                ReferenceNumber: '',
            //                DeleteInd: 'N',
            //                CardNumber: '',
            //                CardType: '',
            //                CardtypeId: 0,
            //                IsCollectPayment: true
            //            };
            //        }


            //        $scope.PatientPaymentObj.PatientDepositPaymodeList.push(consolidatedDeposit);
            //    }

            //    if (Selectobj.Allocate === 3) {
            //        Selectobj.Allocate = "";
            //    } else {
            //        $scope.GetPatientPaymentsList('', '', 'Allocate');
            //        console.log("GetPatientPaymentsList call3");
            //    }


            //    $scope.PatientDepositDetails.DepositNumber = item.ReceiptNo || "";
            //    $scope.PatientDepositDetails.DepositAmount = item.UnBilledAmount || "";
            //    $scope.PatientDepositDetails.DepositDate = $filter('date')($scope.PatientPaymentObj.DepositDate, "MM-dd-yyyy") || "";

            //    /* $scope.selectedDeposits.push(item.PatientDepositId);*/

            //    //if ($scope.TotalPatientBalanceAmount < $scope.PatientPaymentObj.DepositAmount) {
            //    //    alertify.error("The payment amount cannot exceed the billed amount. Please review the values and try again.");
            //    //    return false;
            //    //}

            //    if (item.DepositAmount == item.UnBilledAmount && $scope.mainPaymentObject.TotalPatientBalanceAmount != 0) {
            //        $scope.PatientPaymentObj.DepositAmount = item.DepositAmount;
            //    } else {
            //        $scope.PatientPaymentObj.DepositAmount = item.UnBilledAmount;
            //    }

            //    if ($scope.PatientPaymentObj.DepositAmount > $scope.mainPaymentObject.TotalPatientBalanceAmount) {
            //        $scope.PatientPaymentObj.DepositAmount = $scope.mainPaymentObject.TotalPatientBalanceAmount;
            //    } else {

            //    }

            //    if ($scope.IsViewDepositScreen == false) {
            //        $scope.PatientPaymentObj.PaymentMethodId = item.PaymentMethodId;
            //        $scope.PatientPaymentObj.PaymentMethodName = item.PaymentMethodName;
            //    } else {
            //        $scope.PatientPaymentObj.PaymentMethodId = 14;
            //        $scope.PatientPaymentObj.PaymentMethodName = "Patient Deposits";
            //    }


            //    $scope.PatientPaymentObj.DepositAmount = $scope.PatientPaymentObj.DepositAmount;

            //    $scope.PaymentMethodObj.PatientDepositPaymodeListId = 0;
            //    $scope.PaymentMethodObj.PaymentMethodId = 14;
            //    $scope.PaymentMethodObj.PaymentMethodName = "Patient Deposits";
            //    $scope.PaymentMethodObj.DepositAmount = $scope.PatientPaymentObj.DepositAmount;
            //    $scope.PaymentMethodObj.ReferenceNumber = '';
            //    $scope.PaymentMethodObj.IsDepositAdded = false;
            //    $scope.PaymentMethodObj.DeleteInd = "N";
            //    $scope.PaymentMethodObj.PatientDepositId = 0;// item.PatientDepositId;
            //    $scope.PaymentMethodObj.CardNumber = '';
            //    $scope.PaymentMethodObj.CardType = '';
            //    $scope.PaymentMethodObj.CardtypeId = 0;
            //    $scope.PaymentMethodObj.PatientDepositAmt = $scope.PatientDepositDetails.DepositAmount || 0;
            //    $scope.PaymentMethodObj.PatientDepositDate = $scope.PatientDepositDetails.DepositDate || 0;
            //    $scope.PaymentMethodObj.DepositNumber = $scope.PatientDepositDetails.DepositNumber || 0;

            //    //if ($scope.PatientPaymentObj.PatientDepositId != 0 && $scope.allClaimPatientPayments.length > 0) {
            //    //    let filteredList = $scope.allClaimPatientPayments.filter(function (item) {
            //    //        return item.PatientDepositId === $scope.PatientPaymentObj.PatientDepositId;
            //    //    });
            //    //    if (filteredList.length > 0) {
            //    //        $scope.PatientPaymentObj.EOBId = filteredList[0].EOBId;
            //    //        $scope.PatientPaymentObj.PatientDepositPaymodeList = angular.copy(filteredList[0].DepositPaymentmodeList);
            //    //    }

            //    //}



            //    if (type === "Update") {
            //        $scope.PatientPaymentObj.CurrentPaymentType = "Update";
            //    } else {
            //        $scope.PatientPaymentObj.CurrentPaymentType = "Allocate";
            //    }

            //    if ($scope.PatientPaymentObj.UnBilledAmount > 0) {
            //        $scope.mainPaymentObject.TotalPaidAmount = $scope.PatientPaymentObj.UnBilledAmount || 0;
            //        $scope.mainPaymentObject.TotalPatientBalanceAmount = $scope.mainPaymentObject.TotalFinalPatientBalanceAmount - $scope.mainPaymentObject.TotalPaidAmount;
            //    }
            //}

            $scope.SubTab = 1;
            $scope.IsViewDepositScreen = true;
            $scope.IsDepositAllocationEditMode = true;
            $scope.PatientPaymentObj.PatientDepositPaymodeList = [];
            $scope.PatientPaymentObj.PatientId = item.PatientId;
            $scope.PatientPaymentObj.AppointmentId = item.AppointmentID;
            $scope.PatientPaymentObj.ReceiptNo = item.ReceiptNo;
            $scope.PatientPaymentObj.PaymentMethodId = item.PaymentMethodId;
            $scope.PatientPaymentObj.PaymentMethodName = item.PaymentMethodName;
            //$scope.PatientPaymentObj.DepositDate = item.DepositDate;
            $scope.PatientPaymentObj.DepositDate = $filter('date')(new Date(), "MM-dd-yyyy");
            $scope.PatientPaymentObj.PatientDepositId = 0;//item.PatientDepositId ||
            $scope.PatientPaymentObj.DepositTypeId = item.DepositTypeId;
            $scope.PatientPaymentObj.DepositTypeName = item.DepositTypeName;
            $scope.PatientPaymentObj.DepositAmount = item.DepositAmount;
            $scope.PatientPaymentObj.Notes = item.Notes;
            $scope.PatientPaymentObj.BilledAmount = item.BilledAmount;
            $scope.PatientPaymentObj.UnBilledAmount = item.UnBilledAmount;

            console.log($scope.PatientPaymentObj.UnBilledAmount + "__" + item.UnBilledAmount + "__" + item.BilledAmount);
            $scope.PatientPaymentObj.PaymentsArray = item.PaymentsArray;
            $scope.PatientPaymentObj.IsPatientDeposit = $scope.DepositDetails.IsPatientDeposit;
            //$scope.PatientPaymentObj.BillingProviderId = item.BillingProviderId || 0;
            //$scope.PatientPaymentObj.BillingProviderName = item.BillingProviderName || '';
            ////$scope.PatientPaymentObj.PatientDepositPaymodeList = item.PatientDepositPaymodeList || [];
            //$scope.PatientPaymentObj.OrganizationFacilityId = item.OrganizationFacilityId || 0;
            //$scope.PatientPaymentObj.FacilityName = item.FacilityName || 0;

            $scope.PatientPaymentObj.PatientDepositPaymodeList = [];

            if (item.PatientDepositPaymodeList && item.PatientDepositPaymodeList.length > 0) {
                if (item.UnBilledAmount > $scope.mainPaymentObject.TotalFinalPatientBalanceAmount) {
                    var collectedAmount = $scope.PatientPaymentObj.UnBilledAmount;
                    var patientBalance = $scope.mainPaymentObject.TotalPatientBalanceAmount
                    var allowedAmount = Math.min(collectedAmount, $scope.mainPaymentObject.TotalFinalPatientBalanceAmount);
                    var consolidatedDeposit = {
                        PatientDepositPaymodeListId: 0,
                        PaymentMethodId: 14,
                        PaymentMethodName: "Patient Deposits",
                        DepositAmount: allowedAmount,
                        PatientDepositId: item.PatientDepositId,
                        ReferenceNumber: '',
                        DeleteInd: 'N',
                        CardNumber: '',
                        CardType: '',
                        CardtypeId: 0,
                        IsCollectPayment: true,
                        ReceiptNo: item.ReceiptNo,
                        ChequeNumber: '',
                    };

                    item.UnBilledAmount = angular.copy(allowedAmount);
                    $scope.PatientPaymentObj.UnBilledAmount = angular.copy(allowedAmount);
                }
                else {
                    var consolidatedDeposit = {
                        PatientDepositPaymodeListId: 0,
                        PaymentMethodId: 14,
                        PaymentMethodName: "Patient Deposits",
                        DepositAmount: item.UnBilledAmount,
                        PatientDepositId: item.PatientDepositId,
                        ReferenceNumber: '',
                        DeleteInd: 'N',
                        CardNumber: '',
                        CardType: '',
                        CardtypeId: 0,
                        IsCollectPayment: true,
                        ReceiptNo: item.ReceiptNo,
                        ChequeNumber: '',
                    };
                }

                angular.forEach(item.PatientDepositPaymodeList, function (ditem) {
                    ditem.ReceiptNo = item.ReceiptNo || '';
                })


                $scope.PatientPaymentObj.PatientDepositPaymodeList.push(consolidatedDeposit);
                //$scope.PatientPaymentObj.PatientDepositPaymodeList.push(...item.PatientDepositPaymodeList);
            }

            if (Selectobj.Allocate === 3) {
                Selectobj.Allocate = "";
            } else {
                $scope.GetPatientPaymentsList('', '', 'Allocate');
                console.log("GetPatientPaymentsList call3");
            }


            $scope.PatientDepositDetails.DepositNumber = item.ReceiptNo || "";
            $scope.PatientDepositDetails.DepositAmount = item.UnBilledAmount || "";
            $scope.PatientDepositDetails.DepositDate = $filter('date')($scope.PatientPaymentObj.DepositDate, "MM-dd-yyyy") || "";

            /* $scope.selectedDeposits.push(item.PatientDepositId);*/

            //if ($scope.TotalPatientBalanceAmount < $scope.PatientPaymentObj.DepositAmount) {
            //    alertify.error("The payment amount cannot exceed the billed amount. Please review the values and try again.");
            //    return false;
            //}

            if (item.DepositAmount == item.UnBilledAmount && $scope.mainPaymentObject.TotalPatientBalanceAmount != 0) {
                $scope.PatientPaymentObj.DepositAmount = item.DepositAmount;
            } else {
                $scope.PatientPaymentObj.DepositAmount = item.UnBilledAmount;
            }

            if ($scope.PatientPaymentObj.DepositAmount > $scope.mainPaymentObject.TotalPatientBalanceAmount) {
                $scope.PatientPaymentObj.DepositAmount = $scope.mainPaymentObject.TotalPatientBalanceAmount;
            } else {

            }

            if ($scope.IsViewDepositScreen == false) {
                $scope.PatientPaymentObj.PaymentMethodId = item.PaymentMethodId;
                $scope.PatientPaymentObj.PaymentMethodName = item.PaymentMethodName;
            } else {
                $scope.PatientPaymentObj.PaymentMethodId = 14;
                $scope.PatientPaymentObj.PaymentMethodName = "Patient Deposits";
            }


            $scope.PatientPaymentObj.DepositAmount = $scope.PatientPaymentObj.DepositAmount;

            $scope.PaymentMethodObj.PatientDepositPaymodeListId = 0;
            $scope.PaymentMethodObj.PaymentMethodId = 14;
            $scope.PaymentMethodObj.PaymentMethodName = "Patient Deposits";
            $scope.PaymentMethodObj.DepositAmount = $scope.PatientPaymentObj.DepositAmount;
            $scope.PaymentMethodObj.ReferenceNumber = '';
            $scope.PaymentMethodObj.IsDepositAdded = false;
            $scope.PaymentMethodObj.DeleteInd = "N";
            $scope.PaymentMethodObj.PatientDepositId = 0;// item.PatientDepositId;
            $scope.PaymentMethodObj.CardNumber = '';
            $scope.PaymentMethodObj.CardType = '';
            $scope.PaymentMethodObj.CardtypeId = 0;
            $scope.PaymentMethodObj.PatientDepositAmt = $scope.PatientDepositDetails.DepositAmount || 0;
            $scope.PaymentMethodObj.PatientDepositDate = $scope.PatientDepositDetails.DepositDate || 0;
            $scope.PaymentMethodObj.DepositNumber = $scope.PatientDepositDetails.DepositNumber || 0;

            //if ($scope.PatientPaymentObj.PatientDepositId != 0 && $scope.allClaimPatientPayments.length > 0) {
            //    let filteredList = $scope.allClaimPatientPayments.filter(function (item) {
            //        return item.PatientDepositId === $scope.PatientPaymentObj.PatientDepositId;
            //    });
            //    if (filteredList.length > 0) {
            //        $scope.PatientPaymentObj.EOBId = filteredList[0].EOBId;
            //        $scope.PatientPaymentObj.PatientDepositPaymodeList = angular.copy(filteredList[0].DepositPaymentmodeList);
            //    }

            //}



            if (type === "Update") {
                $scope.PatientPaymentObj.CurrentPaymentType = "Update";
            } else {
                $scope.PatientPaymentObj.CurrentPaymentType = "Allocate";
            }

            if ($scope.PatientPaymentObj.UnBilledAmount > 0) {
                $scope.mainPaymentObject.TotalPaidAmount = $scope.PatientPaymentObj.UnBilledAmount || 0;
                $scope.mainPaymentObject.TotalPatientBalanceAmount = $scope.mainPaymentObject.TotalFinalPatientBalanceAmount - $scope.mainPaymentObject.TotalPaidAmount;
            }


            $scope.AllSelectionObj.IsAllItemsChecked = true;
        }

        //if (Selectobj.Allocate == 3) {
        //    $scope.SelectedDepositeAllocatePayment(Selectobj.item);
        //}
        function PatientDepositAllocated(item, type) {
            $scope.SubTab = 1;
            $scope.IsViewDepositScreen = true;
            $scope.IsDepositAllocationEditMode = true;
            // $scope.PatientPaymentObj.PatientDepositPaymodeList = [];
            $scope.PatientPaymentObj.PatientId = item.PatientId;
            $scope.PatientPaymentObj.AppointmentId = item.AppointmentID;
            $scope.PatientPaymentObj.ReceiptNo = item.ReceiptNo;
            $scope.PatientPaymentObj.PaymentMethodId = item.PaymentMethodId;
            $scope.PatientPaymentObj.PaymentMethodName = item.PaymentMethodName;
            //$scope.PatientPaymentObj.DepositDate = item.DepositDate;
            $scope.PatientPaymentObj.DepositDate = $filter('date')(new Date(), "MM-dd-yyyy");
            $scope.PatientPaymentObj.PatientDepositId = item.PatientDepositId || 0;
            $scope.PatientPaymentObj.DepositTypeId = item.DepositTypeId;
            $scope.PatientPaymentObj.DepositTypeName = item.DepositTypeName;
            $scope.PatientPaymentObj.DepositAmount = item.DepositAmount;
            $scope.PatientPaymentObj.Notes = item.Notes;
            $scope.PatientPaymentObj.BilledAmount = item.BilledAmount;
            $scope.PatientPaymentObj.UnBilledAmount = item.UnBilledAmount;
            $scope.PatientPaymentObj.PaymentsArray = item.PaymentsArray;
            $scope.PatientPaymentObj.IsPatientDeposit = $scope.DepositDetails.IsPatientDeposit;
            //$scope.PatientPaymentObj.BillingProviderId = item.BillingProviderId || 0;
            //$scope.PatientPaymentObj.BillingProviderName = item.BillingProviderName || '';
            ///*$scope.PatientPaymentObj.PatientDepositPaymodeList = item.PatientDepositPaymodeList || [];*/
            //$scope.PatientPaymentObj.OrganizationFacilityId = item.OrganizationFacilityId || 0;
            //$scope.PatientPaymentObj.FacilityName = item.FacilityName || 0;


            $scope.PatientDepositDetails.DepositNumber = item.ReceiptNo || "";
            $scope.PatientDepositDetails.DepositAmount = item.UnBilledAmount || "";
            $scope.PatientDepositDetails.DepositDate = $filter('date')($scope.PatientPaymentObj.DepositDate, "MM-dd-yyyy") || "";

            if (item.DepositAmount == item.UnBilledAmount) {
                $scope.PatientPaymentObj.DepositAmount = item.DepositAmount;
            } else {
                $scope.PatientPaymentObj.DepositAmount = item.UnBilledAmount;
            }

            if ($scope.PatientPaymentObj.DepositAmount > $scope.mainPaymentObject.TotalPatientBalanceAmount) {
                $scope.PatientPaymentObj.DepositAmount = $scope.mainPaymentObject.TotalPatientBalanceAmount;
            } else {

            }

            if ($scope.IsViewDepositScreen == false) {
                $scope.PatientPaymentObj.PaymentMethodId = item.PaymentMethodId;
                $scope.PatientPaymentObj.PaymentMethodName = item.PaymentMethodName;
            } else {
                $scope.PatientPaymentObj.PaymentMethodId = 14;
                $scope.PatientPaymentObj.PaymentMethodName = "Patient Deposits";
            }

            $scope.PaymentMethodObj.PatientDepositPaymodeListId = 0;
            $scope.PaymentMethodObj.PaymentMethodId = 14;
            $scope.PaymentMethodObj.PaymentMethodName = "Patient Deposits";
            $scope.PaymentMethodObj.DepositAmount = $scope.PatientPaymentObj.DepositAmount;
            $scope.PaymentMethodObj.ReferenceNumber = '';
            $scope.PaymentMethodObj.IsDepositAdded = false;
            $scope.PaymentMethodObj.DeleteInd = "N";
            $scope.PaymentMethodObj.PatientDepositId = item.PatientDepositId;
            $scope.PaymentMethodObj.CardNumber = '';
            $scope.PaymentMethodObj.CardType = '';
            $scope.PaymentMethodObj.CardtypeId = 0;
            $scope.PaymentMethodObj.PatientDepositAmt = $scope.PatientDepositDetails.DepositAmount || 0;
            $scope.PaymentMethodObj.PatientDepositDate = $scope.PatientDepositDetails.DepositDate || 0;
            $scope.PaymentMethodObj.DepositNumber = $scope.PatientDepositDetails.DepositNumber || 0;

            if ($scope.PatientPaymentObj.PatientDepositId != 0 && $scope.allClaimPatientPayments.length > 0) {
                let filteredList = $scope.allClaimPatientPayments.filter(function (item) {
                    return item.PatientDepositId === $scope.PatientPaymentObj.PatientDepositId;
                });
                //if (filteredList.length > 0) {
                //    $scope.PatientPaymentObj.EOBId = filteredList[0].EOBId || 0;
                //}
                //$scope.PatientPaymentObj.PatientDepositPaymodeList = angular.copy(filteredList[0].DepositPaymentmodeList);
            }

            if (type === "Update") {
                $scope.PatientPaymentObj.CurrentPaymentType = "Update";
            } else {
                $scope.PatientPaymentObj.CurrentPaymentType = "Allocate";
            }
            /* $scope.GetPatientPaymentsList();*/
        }

        $scope.ChangeAmountData = function (item) {
            if ($scope.PatientPaymentObj.DepositAmount > $scope.mainPaymentObject.TotalPatientBalanceAmount) {
                alertify.error("The payment amount cannot exceed the billed amount. Please review the values and try again.");
                $scope.PatientPaymentObj.DepositAmount = $scope.PatientPaymentObj.DepositAmount - item.DepositAmount || 0;
                item.DepositAmount = '';
                return false;
            }

        }

        if ($scope.Selectobj !== '') {
            if ($scope.Selectobj.PatientId != '') {
                $scope.SelectedPatient($scope.Selectobj);
            }

        }
        function LoadPatientSearch(object) {
            return InventoryService.SearchInvPatient(object).then(function (resp) {
                if (resp.data.data.length !== 0) {
                    if (resp.data.data != undefined) {
                        $scope.patientList = resp.data.data || [];
                        $scope.SearchObj.ShowpatientListdiv = true;
                    }
                    return $scope.patientList.map(function (item) {
                        if (item.MobileNo === 0) {
                            item.MobileNo = "";
                        }

                        return item;
                    });

                }
            }, function (err) { console.log(err); alertify.error("Search Patient Failed"); });
        }
        $scope.SearchPatientAutoComplete = function (val, type) {
            var object = {};
            if (type === 1) {
                if (val.length >= 3) {
                    object = {
                        "ParentOrganizationId": $scope.SearchObj.OrganizationId,
                        "Name": val,
                        "Mobile": null,
                        "PatientId": null,
                        "PageSize": 10,
                        "PageNo": 1
                    };
                    LoadPatientSearch(object);
                }
            }
            if (type === 2) {
                if (val.length > 9) {
                    object = {
                        "ParentOrganizationId": $scope.SearchObj.OrganizationId,
                        "Name": null,
                        "Mobile": val,
                        "PatientId": null,
                        "PageSize": 10,
                        "PageNo": 1
                    };
                    LoadPatientSearch(object);
                }
            }
            if (type === 3) {
                if (val.length > 9) {
                    object = {
                        "ParentOrganizationId": $scope.SearchObj.OrganizationId,
                        "Name": null,
                        "Mobile": null,
                        "PatientId": val,
                        "PageSize": 10,
                        "PageNo": 1
                    };
                    LoadPatientSearch(object);
                }
            }

        };

        $scope.ClearPatientDeposits = function () {
            $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());
            $scope.SearchObj = angular.copy($scope.getSearchObj());

        };



        $scope.IsAddDepositbtn = false;
        $scope.AddUpdatePatientDeposit = function (item) {

            item = item || '';
            $scope.IsAddDepositbtn = false;

            $scope.ViewDepositScreen = true;

            if (item != '') {
                if (item.DepositAmount > 0) {

                    if (item.PaymentMethodId == 2 || item.PaymentMethodId == 3) {
                        if (item.CardtypeId == 0) {
                            alertify.error("Please select Card Type");
                            return;
                        }
                        if (item.CardNumber == '' || item.CardNumber.trim().length < 4) {
                            alertify.error("Please enter the last 4 digits of the card");
                            return;
                        }
                    }
                    $scope.PatientDepositsObj.DepositAmount += parseFloat(item.DepositAmount);
                    $scope.PatientDepositsObj.PatientDepositPaymodeList.push(angular.copy(item));
                }
            }

            if ($scope.PatientDepositsObj.PatientId === 0) {
                alertify.error("Please Select Patient ");
                return;
            }

            if ($scope.PatientDepositsObj.OrganizationFacilityId === 0) {
                alertify.error("Please select the location ");
                return;
            }

            let i = 0; let j = 0; let k = 0; let l = 0;
            angular.forEach($scope.PatientDepositsObj.PatientDepositPaymodeList, function (item) {
                if (item.PaymentMethodId == 0) {
                    i++;
                }
                if (item.DepositAmount == "") {
                    j++;
                }
                if (item.PaymentMethodId == 1) {

                } else {
                    //if (item.ReferenceNumber == "") {
                    //    k++;
                    //}
                }
                //if (item.PaymentDate == null) {
                //    l++;
                //}
                //else {
                //    item.PaymentDate = $filter('date')(item.PaymentDate, 'yyyy-MM-dd');
                //}
            });

            if (i > 0) {
                alertify.error("Please select payment method");
                return;
            }
            if (j > 0) {
                alertify.error("Please enter amount");
                return;
            }
            //if (k > 0) {
            //    alertify.error("Please enter reference number");
            //    return;
            //}
            //if (l > 0) {
            //    alertify.error("Please select payment date");
            //    return;
            //}

            //$scope.PatientDepositsObj.PaymentMethodId = $scope.PatientDepositsObj.PaymentMethodId || null;
            //if ($scope.PatientDepositsObj.PaymentMethodId === null) {
            //    alertify.error("Please Select Payment Method ");
            //    return;
            //}

            //$scope.PatientDepositsObj.DepositAmount = $scope.PatientDepositsObj.DepositAmount || "";
            //if ($scope.PatientDepositsObj.DepositAmount === "") {
            //    alertify.error("Please Enter Amount ");
            //    return;
            //}


            if ($scope.PatientDepositsObj.PatientDepositPaymodeList.length == 0) {
                alertify.error("Please Enter Amount ");
                return;
            }

            var ConvertedDate = $filter("usdateFormatter")($scope.PatientDepositsObj.DepositDate, "-");
            var PaymentDate = $filter("usdateFormatter")($scope.PatientDepositsObj.PaymentDate, "-");




            var obj = {
                "UserId": $scope.PatientDepositsObj.UserId,
                "OrganizationId": $scope.PatientDepositsObj.OrganizationId,
                "PatientDepositId": $scope.PatientDepositsObj.PatientDepositId || 0,
                "PatientId": $scope.PatientDepositsObj.PatientId || 0,
                "ReceiptNo": $scope.PatientDepositsObj.ReceiptNo,
                "ReceiptId": $scope.PatientDepositsObj.ReceiptId || 0,
                "DepositDate": ConvertedDate,
                "PaymentDate": PaymentDate,
                "DepositAmount": $scope.PatientDepositsObj.DepositAmount || 0,
                "DepositedByUserId": $scope.PatientDepositsObj.DepositedByUserId,
                "DepositedBy": $scope.PatientDepositsObj.DepositedBy,
                "UnBilledAmount": $scope.PatientDepositsObj.UnBilledAmount,
                "BilledAmount": $scope.PatientDepositsObj.BilledAmount || 0,
                "DeleteInd": $scope.PatientDepositsObj.DeleteInd || "N",
                "AppointmentId": $scope.PatientDepositsObj.AppointmentId,
                "BillingProviderId": $scope.PatientDepositsObj.BillingProviderId,
                "DepositTypeId": $scope.PatientDepositsObj.DepositTypeId,
                "DepositType": $scope.PatientDepositsObj.DepositType,
                "PaymentMethodId": $scope.PatientDepositsObj.PaymentMethodId,
                "PaymentMethodName": $scope.PatientDepositsObj.PaymentMethodName,
                "ChequeNumber": $scope.PatientDepositsObj.ChequeNumber,
                "CardNumber": "",
                "OnlineTransactionNumber": $scope.PatientDepositsObj.OnlineTransactionNumber,
                "CardName": "",
                "CardExpiry": "",
                "Notes": $scope.PatientDepositsObj.Notes,
                "BatchNumber": $scope.PatientDepositsObj.BatchNumber,
                "OrganizationFacilityId": $scope.PatientDepositsObj.OrganizationFacilityId,
                "FacilityName": $scope.PatientDepositsObj.FacilityName,
                "IsConsent": $scope.PatientDepositsObj.IsConsent,
                "IsDepositPrint": $scope.PatientDepositsObj.IsDepositPrint,
                "IsEmail": $scope.PatientDepositsObj.IsEmail,
                "DepositStatusId": $scope.PatientDepositsObj.DepositStatusId,
                "DepositStatus": $scope.PatientDepositsObj.DepositStatus,
                "PageSize": $scope.PatientDepositsObj.PageSize,
                "PageNumber": $scope.PatientDepositsObj.PageNumber,
                "PatientDepositPaymodeList": $scope.PatientDepositsObj.PatientDepositPaymodeList || [],
                /*"PatientVoidDeposit": 0,*/
            };

            eHnoteInsuranceService.AddUpdatePatientDepositAmount(obj).then(function (resp) {
                if (resp.data.Status === "Success") {

                    if (obj.PatientDepositId === 0) {
                        alertify.success("Added Successfully");
                    } else {
                        alertify.success("Updated Successfully");
                    }
                    $scope.getPatientDepositAmountById();
                    $scope.SelectedPatientDetails.DepositsObj = angular.copy($scope.PatientDepositsObj) || "";

                    if ($scope.SelectedPatientDetails.DepositsObj.IsDepositPrint == true) {
                        $scope.SelectedPatientDetails.DepositsObj.ReceiptNo = resp.data.ReceiptNo || '';
                        $scope.SelectedPatientDetails.DepositsObj.CreatedBy = resp.data.CreatedBy || '';
                        $scope.SelectedPatientDetails.DepositsObj.BillingProviderName = resp.data.BillingProviderName || '';
                        $scope.AddDespositePrint($scope.SelectedPatientDetails.DepositsObj, $scope.SelectedPatientDetails.PatientObj, 1);
                    } else {

                    }

                    $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());
                    $scope.SearchObj = angular.copy($scope.getSearchObj());
                    $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());


                    //$scope.SelectedPatientDetails.PatientObj = "";
                    $scope.SelectedPatientDetails.DepositsObj = "";

                    if (Selectobj.Allocate == 4) {
                        $scope.ViewDepositScreen = true;
                    } else {
                        $scope.ViewDepositScreen = false;
                    }
                    $scope.showNotes = false;
                } else {
                    alertify.error(resp.data.Message);
                }
            });
        };


        $scope.changeBillingProvider = function (id, item) {
            var List1 = $filter("filter")($scope.BillingProvidersList, function (Pitem,) { return Pitem.OrganizationBillingProviderId === id; }) || [];
            if (List1.length != 0) {
                item.BillingProviderName = List1[0].BillingProviderName;
            }
        }

        $scope.ClosePopup = function (type) {
            if (type === "cancel") {
                $uibModalInstance.dismiss(type);
                return;
            }

            // No payment entered
            if ($scope.mainPaymentObject.TotalPaidAmount == 0) {
                $uibModalInstance.close();
                return;
            }

            // Payment entered - ask whether to post it
            alertify.confirm(
                "<b class='txt-centre'>Confirm!</b>" +
                "<div style='padding: 20px 2px 4px; text-align: center; color: #000000; font-size: var(--font-size-lg); line-height: 1.5; word-break: normal; overflow-wrap: break-word;'>" +
                "<p style='margin: 0 0 12px;'>" +
                "$" + $scope.mainPaymentObject.TotalPaidAmount +
                " has been allocated to the claim, but it isn't applied yet." +
                "</p>" +
                "<p style='margin: 0 0 12px;'>" +
                "The claim balance only updates when you post. " +
                "Do you want to post the payment now?" +
                "</p>" +
                "<p style='margin: 0;'>" +
                "If you choose <b>NO</b>, the $" +
                $scope.mainPaymentObject.TotalPaidAmount +
                " will be added to the patient's deposits as unallocated. " +
                "It won't be applied to the claim, so the claim will still have a patient balance." +
                "</p>" +
                "</div>",

                function () {
                    // YES - Post payment
                    if ($scope.Selectobj.isIojOrgEnable) {
                        $scope.SavePatientPayment('PostAndPrint');
                    } else {
                        $scope.SavePatientPayment();
                    }
                },

                function () {
                    // NO - Keep as unallocated patient deposit
                    $uibModalInstance.close();
                }
            );
        };

        function PatientDepositePrint() {
            if ($scope.SelectedPatientDetails.PatientObj === "") {
                return;
            }
            var patientObj = $scope.SelectedPatientDetails.PatientObj || "";
            var Tempitem = {
                "Title": patientObj.Title,
                "PatientFullname": patientObj.fullname,
                "Gender": patientObj.Sex,
                "PatientDisplayId": patientObj.PatientDisplayId,
                "PatientID": patientObj.PatientId,
                "Address": "",
                "AgeInYears": patientObj.AgeInYears,
                "AgeInMonths": patientObj.AgeInMonths,
                "PatientMobile": patientObj.MobileNo,
                "DepositDate": $scope.SelectedPatientDetails.DepositsObj.DepositDate,
                "DepositAmount": $scope.SelectedPatientDetails.DepositsObj.DepositAmount,
                "DipositeRemarks": $scope.SelectedPatientDetails.DepositsObj.Remarks
            };
            var CostInWords = "";
            var amount = parseInt(Tempitem.DepositAmount) || 0;
            CostInWords = USPrintService.ConvertNumberToWords(amount);
            var PaymentMode = "";
            var list = $filter("filter")($scope.masterPaymentModes, { "PaymentModeId": $scope.SelectedPatientDetails.DepositsObj.PaymentModeId }, true);
            if (list.length > 0) {
                PaymentMode = list[0].PaymentModeName;
            }

            var PrintInfo = {
                "DepositeDetails": Tempitem,
                "BillingType": "Deposit RECEIPT",
                "PrintedDatenTime": "",
                "CostInWords": CostInWords,
                "DepositDate": $filter("date")($scope.SelectedPatientDetails.DepositsObj.DepositDate, "MM-dd-yyyy") || "",
                "PaymentType": PaymentMode ? PaymentMode : ""
            };
            var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
            var printTime = moment(new Date()).format("HH:mm");
            var printDatemTime = printDate + '  ' + printTime;
            PrintInfo.PrintedDatenTime = printDatemTime;

            USPrintService.GenerateAddPatientDepositPrint(PrintInfo);
        };

        $scope.ChangePatientType = function (type) {
            $scope.SearchObj = angular.copy($scope.getSearchObj());
            $scope.SearchObj.Type = type;
        };

        //$scope.BillingProvidersList = [];
        //$scope.GetOrganizationFacilitiesNew = function (pagenumber) {
        //    var params = {
        //        "OrganizationId": $scope.HospitalId || 0,
        //        "ParentOrganizationId": $scope.ParenthospitalId,
        //        "FacilityCode": "",
        //        "PageNumber": pagenumber,
        //        "PageSize": 20
        //    };

        //    eHnoteSettingsDataService.GetOrganizationBillingProviders(params).then(function (resp) {
        //        $scope.BillingProvidersList = [];
        //        if (resp.data.Status == "Success") {
        //            resp.data.rows = resp.data.rows || [];
        //            $scope.TotalFacilityCount = resp.data.count || 0;
        //            if (resp.data.rows.length > 0) {
        //                $scope.BillingProvidersList = resp.data.rows || [];
        //            }
        //        } else {
        //            alertify.error(resp.data.Message);
        //        }
        //    }, function (error) {
        //        console.log(error);
        //    });
        //};

        //$scope.GetOrganizationFacilitiesNew(1);

        $scope.ChangeDepositType = function (depositId, item) {

            var depositId = parseFloat(depositId) || 0;
            var List1 = $filter("filter")($scope.DepositTypes, function (Pitem,) { return Pitem.DepositTypeId === depositId; }) || [];
            if (List1.length != 0) {
                item.DepositType = List1[0].DepositTypeName;
                $scope.PatientPaymentObj.DepositTypeId = List1[0].DepositTypeId;
                $scope.PatientPaymentObj.DepositTypeName = List1[0].DepositTypeName;

                $scope.PatientDepositsObj.DepositTypeId = List1[0].DepositTypeId;
                $scope.PatientDepositsObj.DepositTypeName = List1[0].DepositTypeName;
            }
        };

        $scope.changePaymentModeData = function (ID, item) {
            var List1 = $filter("filter")($scope.masterPaymentModes, function (Pitem,) { return Pitem.PaymentModeId === ID; }) || [];
            if (List1.length != 0) {
                $scope.PatientPaymentObj.PaymentMethodId = List1[0].PaymentModeId;
                $scope.PatientPaymentObj.PaymentMethodName = List1[0].PaymentModeName;
            }
        };
        $scope.ChangePaymentMode = function (id, item, index) {

            item.DepositAmount = '';
            item.ReferenceNumber = '';
            item.CardNumber = '';
            item.CardType = '';
            item.CardtypeId = 0;

            $scope.PatientDepositsObj.DepositAmount = 0;

            let i = 0;
            angular.forEach($scope.PatientDepositsObj.PatientDepositPaymodeList, function (item) {
                if (item.PaymentMethodId === id) {
                    i++;
                }
            });

            //if (i > 1) {
            //    alertify.error("The selected payment method is already existed!");
            //    $scope.PatientDepositsObj.PatientDepositPaymodeList[index].PaymentMethodId = 0;
            //    return;
            //}

            var List1 = $filter("filter")($scope.masterPaymentModes, function (Pitem,) { return Pitem.PaymentModeId === id; }) || [];
            if (List1.length != 0) {
                item.PaymentMethodName = List1[0].PaymentModeName;
            }
        }

        $scope.ChangePatientPaymentMode = function (id, item, index) {
            $scope.IsDepositButton = false;
            $scope.SelectedDeposit = false;

            /*  $scope.PatientPaymentObj.DepositAmount = $scope.PatientPaymentObj.DepositAmount - item.DepositAmount || 0;*/

            $scope.selectedDeposits.splice(index, 1);

            /* item.DepositAmount = '';*/
            item.PatientDepositAmt = '';
            item.ReferenceNumber = '';
            item.DepositNumber = '';
            item.PatientDepositDate = '';
            item.PatientDepositId = null;
            item.CardNumber = '';
            item.CardType = '';
            item.CardtypeId = 0;
            item.PaymentMethodId = 0;

            let i = 0;
            angular.forEach($scope.PatientPaymentObj.PatientDepositPaymodeList, function (item) {
                if (item.PaymentMethodId === id) {
                    i++;
                }
            });
            //if (id != 14) {
            //    if (i > 1) {
            //        alertify.error("The selected payment method is already existed!");
            //        $scope.PatientPaymentObj.PatientDepositPaymodeList[index].PaymentMethodId = 0;
            //        return;
            //    }
            //}


            var List1 = $filter("filter")($scope.masterPaymentModes, function (Pitem,) { return Pitem.PaymentModeId === id; }) || [];
            if (List1.length != 0) {
                item.PaymentMethodId = List1[0].PaymentModeId;
                item.PaymentMethodName = List1[0].PaymentModeName;
            }
            //if (id == 12) {
            //    $scope.AddCreditAmount(id,index);
            //}
            if (id == 14) {
                /* $scope.IsDepositButton = true;*/
                $scope.id = id;
                $scope.index = index;
                $scope.openDepositsPopup();

            }
        }


        $scope.AddMultiplePatientDeposits = function (item, typeId) {
            $scope.IsdisabledPatAmt = true
            if ($scope.PaymentMethodObj.PatientDepositId) {
                $scope.selectedDeposits.push($scope.PaymentMethodObj.PatientDepositId);
            }

            if (item.PaymentMethodId == 0) {
                alertify.error("Please select payment method");
                return;
            }
            if (item.DepositAmount == "") {
                alertify.error("Please enter deposit amount");
                return;
            } else if (item.DepositAmount === "0") {
                alertify.error("Please enter deposit amount Greater than Zero");
                return;
            } else {
            }

            if (item.PaymentMethodId == 2 || item.PaymentMethodId == 3) {
                if (item.CardtypeId == 0) {
                    alertify.error("Please select Card Type");
                    return;
                }
                if (item.CardNumber == '' || item.CardNumber.trim().length < 4) {
                    alertify.error("Please Enter Card Last 4 digits");
                    return;
                }
            }

            var depositToAdd = parseFloat(item.DepositAmount) || 0;

            // Set payment method name
            var List = $filter("filter")($scope.masterPaymentModes, function (Pitem) {
                return Pitem.PaymentModeId === item.PaymentMethodId;
            }) || [];

            if (List.length > 0) {
                item.PaymentMethodName = List[0].PaymentModeName;
            }

            typeId = typeId || 0;

            if (typeId == 1) {
                if ($scope.PatientDepositsObj.PatientDepositPaymodeList.length >= 3) {
                    alertify.error("You can only add up to 3 records.");
                    return;
                }
                $scope.PatientDepositsObj.PatientDepositPaymodeList.push(angular.copy(item));
            } else {
                // Calculate total before adding
                if ($scope.Editdata == 'EditPayment') {

                    $scope.PaymentListArray = [];
                    $scope.PaymentListArray = angular.copy($scope.PatientPaymentObj.PatientDepositPaymodeList);

                    $scope.PaymentListArray.forEach(function (paymode, i) {
                        if (i === $scope.editIndex) {
                            paymode.DepositAmount = item.DepositAmount;
                        }
                    });

                    var DepositTotalAmt = 0;
                    $scope.PaymentListArray.forEach(function (paymode) {
                        DepositTotalAmt += parseFloat(paymode.DepositAmount) || 0;
                    });

                    if (DepositTotalAmt > $scope.mainPaymentObject.TotalPatientBalanceAmount) {
                        var exceed = DepositTotalAmt - $scope.mainPaymentObject.TotalPatientBalanceAmount;
                        alertify.error(`Adding $${depositToAdd} exceeds the balance. Please enter a lesser amount.`);
                        $scope.PaymentMethodObj.DepositAmount = 0;
                        $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                        $scope.editIndex = null;
                        $scope.Editdata = null;
                        return;
                    }


                } else {
                    var currentTotal = 0;
                    $scope.PatientPaymentObj.PatientDepositPaymodeList.forEach(function (paymode) {
                        currentTotal += parseFloat(paymode.DepositAmount) || 0;
                    });

                    var newTotal = currentTotal + depositToAdd;

                    if (currentTotal === $scope.mainPaymentObject.TotalPatientBalanceAmount) {
                        alertify.error(`You have already paid $${currentTotal}. No balance left to add another payment mode.`);
                        $scope.PaymentMethodObj.DepositAmount = 0;
                        $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                        return;
                    }

                    if (newTotal > $scope.mainPaymentObject.TotalPatientBalanceAmount) {
                        var exceed = newTotal - $scope.mainPaymentObject.TotalPatientBalanceAmount;
                        alertify.error(`Adding $${depositToAdd} exceeds the balance. Please enter a lesser amount.`);
                        $scope.PaymentMethodObj.DepositAmount = 0;
                        $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                        return;
                    }
                }

                // Editing existing record
                if ($scope.editIndex !== null) {
                    $scope.PatientPaymentObj.PatientDepositPaymodeList[$scope.editIndex] = angular.copy(item);
                    /* alertify.success(`Payment method updated. Remaining balance: $${$scope.TotalPatientBalanceAmount - newTotal}`);*/
                    $scope.editIndex = null;
                } else {
                    // Adding new entry
                    if (item.PaymentMethodId === 1) {
                        var existing = $scope.PatientPaymentObj.PatientDepositPaymodeList.find(function (paymode) {
                            return paymode.PaymentMethodId === item.PaymentMethodId;
                        });

                        if (existing) {
                            existing.DepositAmount = (parseFloat(existing.DepositAmount) || 0) + depositToAdd;
                        } else {
                            if ($scope.PatientPaymentObj.PatientDepositPaymodeList.length < 3) {
                                $scope.PatientPaymentObj.PatientDepositPaymodeList.push(angular.copy(item));
                            } else {
                                alertify.error("You can only add up to 3 records.");
                                $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                                return;
                            }
                        }
                    } else {
                        if ($scope.PatientPaymentObj.PatientDepositPaymodeList.length < 3) {
                            $scope.PatientPaymentObj.PatientDepositPaymodeList.push(angular.copy(item));
                        } else {
                            alertify.error("You can only add up to 3 records.");
                            $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                            return;
                        }
                    }
                }

                // Update balance after successful add/edit
                var updatedTotal = 0;
                $scope.PatientPaymentObj.PatientDepositPaymodeList.forEach(function (paymode) {
                    updatedTotal += parseFloat(paymode.DepositAmount) || 0;
                });

                var updatedBalance = Math.abs($scope.mainPaymentObject.TotalPatientBalanceAmount - updatedTotal);
                $scope.PatPaymentBalance = updatedBalance || 0;

                /*  alertify.success(`Deposit processed. Remaining balance: $${updatedBalance}`);*/
            }

            $scope.CalculateDepositAmount();
            $scope.applyDeposit();
            $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
            $scope.editIndex = null;
            $scope.Editdata = null;
        };

        $scope.AddMultipleDepositsList = function (item, typeId) {
            if (item.PaymentMethodId == 0) {
                alertify.error("Please select payment method");
                return;
            }
            if (item.DepositAmount == "") {
                alertify.error("Please enter deposit amount");
                return;
            } else if (item.DepositAmount === "0") {
                alertify.error("Please enter deposit amount Greater than Zero");
                return;
            } else {
            }

            if (item.PaymentMethodId == 2 || item.PaymentMethodId == 3) {
                if (item.CardtypeId == 0) {
                    alertify.error("Please select Card Type");
                    return;
                }
                if (item.CardNumber == '' || item.CardNumber.trim().length < 4) {
                    alertify.error("Please Enter Card Last 4 digits");
                    return;
                }
            }
            if ($scope.PatientDepositsObj.PatientDepositPaymodeList.length < 3 || item.PaymentMethodId == 1) {
                var depositToAdd = parseFloat(item.DepositAmount) || 0;
            }



            // Editing existing record
            if ($scope.editIndex !== null) {
                $scope.PatientDepositsObj.PatientDepositPaymodeList[$scope.editIndex] = angular.copy(item);
                /* alertify.success(`Payment method updated. Remaining balance: $${$scope.TotalPatientBalanceAmount - newTotal}`);*/
                $scope.editIndex = null;
            } else {
                // Adding new entry
                if (item.PaymentMethodId === 1) {
                    var existing = $scope.PatientDepositsObj.PatientDepositPaymodeList.find(function (paymode) {
                        return paymode.PaymentMethodId === item.PaymentMethodId;
                    });

                    if (existing) {
                        if ($scope.PatientDepositsObj.PatientDepositPaymodeList.length < 3 || item.PaymentMethodId == 1) {
                            existing.DepositAmount = (parseFloat(existing.DepositAmount) || 0) + depositToAdd;
                        }
                    } else {
                        if ($scope.PatientDepositsObj.PatientDepositPaymodeList.length < 3) {
                            $scope.PatientDepositsObj.PatientDepositPaymodeList.push(angular.copy(item));
                        } else {
                            alertify.error("You can only add up to 3 records.");
                            $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                            return;
                        }
                    }
                } else {
                    if ($scope.PatientDepositsObj.PatientDepositPaymodeList.length < 3) {
                        $scope.PatientDepositsObj.PatientDepositPaymodeList.push(angular.copy(item));
                    } else {
                        alertify.error("You can only add up to 3 records.");
                        $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                        return;
                    }
                }
            }


            //if ($scope.PatientDepositsObj.PatientDepositPaymodeList.length >= 3) {
            //    alertify.error("You can only add up to 3 records.");
            //    return;
            //}
            //$scope.PatientDepositsObj.PatientDepositPaymodeList.push(angular.copy(item));


            $scope.CalculateTotal();

            $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
        }



        $scope.editIndex = null; // For tracking row being edited
        $scope.Editdata = null;
        $scope.IsdisabledPatAmt = false;
        $scope.EditPaymentMode = function (item, index, value) {
            item = item || null;
            $scope.IsdisabledPatAmt = true;
            $scope.editIndex = index; // Store index for updating
            $scope.Editdata = value;
            $scope.PaymentMethodObj = {
                PatientDepositPaymodeListId: item.PatientDepositPaymodeListId || 0,
                PaymentMethodId: item.PaymentMethodId || 0,
                PaymentMethodName: item.PaymentMethodName || '',
                DepositAmount: item.DepositAmount || 0,
                ReferenceNumber: item.ReferenceNumber || '',
                IsDepositAdded: item.IsDepositAdded || false,
                DeleteInd: item.DeleteInd || 'N',
                PatientDepositId: item.PatientDepositId || null,
                CardNumber: item.CardNumber || '',
                CardType: item.CardType || '',
                CardtypeId: item.CardtypeId || 0
            };
        };

        $scope.CalculateTotal = function () {
            const total = $scope.PatientDepositsObj.PatientDepositPaymodeList.reduce((sum, item) => {
                return sum + (item.DeleteInd !== 'Y' ? (parseFloat(item.DepositAmount) || 0) : 0);
            }, 0);

            $scope.PatientDepositsObj.DepositAmount = total;
            $scope.PatientDepositsObj.UnBilledAmount = total;
        };

        $scope.DeletePatientDeposit = function (item, index) {
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                if (item.PatientDepositPaymodeListId != 0) {
                    item.DeleteInd = "Y";
                } else {
                    $scope.PatientDepositsObj.PatientDepositPaymodeList.splice(index, 1);
                }

                $scope.CalculateTotal();
                $scope.$apply();
                $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
            }, function () {

            });
        };


        $scope.CalculateTotalPayments = function (type) {
            const total = $scope.PatientPaymentObj.PatientDepositPaymodeList.reduce((sum, item) => {
                return sum + (item.DeleteInd !== 'Y' ? (parseFloat(item.DepositAmount) || 0) : 0);
            }, 0);

            $scope.PatientPaymentObj.DepositAmount = total;
            $scope.PatientPaymentObj.UnBilledAmount = total;
            console.log(total + "__total");
            $scope.mainPaymentObject.TotalPaidAmount = total;


            //$scope.applyDeposit('', type);

            //angular.forEach($scope.PatientClaimList, function (pitem) {
            //    pitem.PaymentAmount = 0;
            //    pitem.WriteOffAmount = 0;
            //    pitem.AdjustmentReasonCodeId = 0;
            //    pitem.AdjustmentReasonCode = 0;
            //});

            console.log($scope.mainPaymentObject.TotalPayableAmount + "_TotalPayableAmount_");
            $scope.mainPaymentObject.TotalPaidAmount = parseFloat($scope.PatientPaymentObj.UnBilledAmount) || 0;
            var totalPatientBal = parseFloat($scope.mainPaymentObject.TotalPayableAmount) || 0;
            var totalPatientPaidAmt = parseFloat($scope.mainPaymentObject.TotalPaidAmount) || 0;
            var totalAdjustmentBalanceAmount = parseFloat($scope.mainPaymentObject.TotalAdjustmentAmount) || 0;

            console.log(totalPatientBal + "__" + $scope.mainPaymentObject.TotalPaidAmount);
            $scope.mainPaymentObject.TotalPatientBalanceAmount = totalPatientBal - totalPatientPaidAmt;


        };

        $scope.DeletePatientPayment = function (item, index, type) {
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete the payment ? </h4>", function () {
                if (item.PatientDepositPaymodeListId != 0) {
                    item.DeleteInd = "Y";
                } else {
                    $scope.PatientPaymentObj.PatientDepositPaymodeList.splice(index, 1);
                    /* $scope.selectedDeposits.splice(index, 1);*/
                }

                $scope.CalculateTotalPayments(type);
                //$scope.applyDeposit();
                $scope.$apply();
                //$scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
            }, function () {

            });
        };


        //$scope.ChangeDoctor = function (doctorobj) {
        //    $scope.DoctorObj = doctorobj;
        //    $scope.PatientDepositsObj.DepositedByUserId = doctorobj.DoctorID;
        //    $scope.PatientDepositsObj.DepositedBy = doctorobj.FullName;
        //};

        $scope.GetPatientDepositsLitsObj = function () {
            return {
                "DepositFrom": "",
                "DepositTo": "",
                "PatientId": $scope.Selectobj.PatientId,
                "OrganizationId": $scope.Selectobj.HospitalId,
                "PaymentModeId": 0,
                "PageSize": 10,
                "PageNumber": 1,
                "TransactionNumber": "",
                "Type": 1
            }
        };


        $scope.SearchPatientDepositsObj = angular.copy($scope.GetPatientDepositsLitsObj());
        $scope.PatientDepositsListArray = [];
        $scope.PatientDeposits = [];

        $scope.getPatientDepositAmountById = function (pageno, type) {
            $scope.PatientDepositsObj.PageNumber = pageno || 1;
            var type = (type === undefined || type === '') ? 'All' : type;
            var obj = {
                "DepositFrom": $scope.SearchPatientDepositsObj.DepositFrom || "",
                "DepositTo": $scope.SearchPatientDepositsObj.DepositTo || "",
                "PatientId": $scope.SearchPatientDepositsObj.PatientId,
                "OrganizationId": $scope.SearchPatientDepositsObj.OrganizationId,
                "PaymentModeId": $scope.SearchPatientDepositsObj.PaymentModeId,
                "PageSize": $scope.PatientDepositsObj.PageSize,
                "PageNumber": $scope.PatientDepositsObj.PageNumber,
                "TransactionNumber": "",
                "SortBy": "Asc",
                "SearchType": "Deposit",
                "TransactionCategoryId":$scope.PatientDepositsObj.TransactionCategoryId || 0,
            };

            obj.PaymentModeId = parseInt(obj.PaymentModeId);


            if (obj.DepositFrom != "") {
                obj.DepositFrom = $filter("usdateFormatter")(obj.DepositFrom, "-");
            }
            if (obj.DepositTo != "") {
                obj.DepositTo = $filter("usdateFormatter")(obj.DepositTo, "-");
            }

            console.log("deposit add called 1");
            eHnoteInsuranceService.GetAllPatientDeposits(obj).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.PatientDepositsListArray = [];
                    $scope.PatientDepositsListArray = resp.data.rows || [];


                    if ($scope.PatientDepositsListArray.length == 0) {


                    }

                    $scope.PatientDeposits = $scope.PatientDepositsListArray.filter(item => item.DepositStatusId === 1);

                    if ($scope.PatientDepositsListArray.length > 0) {
                        angular.forEach($scope.PatientDepositsListArray, function (pitem) {
                            pitem.IsselectedDeposit = false;
                            var uniqueMap = {};

                            (pitem.PatientDepositPaymodeList || []).forEach(function (bitem) {
                                var original = bitem.DepositTypeName || "";
                                var key = original.replace(/\s+/g, '').toLowerCase();
                                if (!uniqueMap[key]) {
                                    uniqueMap[key] = original;
                                }
                            });

                            pitem.DepositTypeNames = Object.values(uniqueMap).join(', ') || pitem.DepositTypeName || "";
                        })

                    }

                    $scope.PatientDepositsObj.Count = resp.data.count || 0;
                    $scope.DepositDetails = resp.data;


                    var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": $scope.HospitalId }, true) || [];
                    if (filtredArray.length > 0) {
                        $scope.PatientDepositsObj.BillingProviderId = filtredArray[0].DefaultBillingProviderId;
                        $scope.PatientDepositsObj.OrganizationFacilityId = filtredArray[0].BranchId;
                        $scope.PatientDepositsObj.FacilityName = filtredArray[0].BranchName;

                        $scope.PatientPaymentObj.BillingProviderId = filtredArray[0].DefaultBillingProviderId || 0;
                        $scope.PatientPaymentObj.OrganizationFacilityId = filtredArray[0].BranchId;
                        $scope.PatientPaymentObj.FacilityName = filtredArray[0].BranchName;

                    }


                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }

        $scope.getPatientDepositAmountById();

        $scope.GetPatientVoidDepositList = function (pageno, type) {
            $scope.VoidList = [];
            $scope.Refundlist = [];
            var obj = {
                "PatientId": $scope.SearchPatientDepositsObj.PatientId,
                "OrganizationId": $scope.SearchPatientDepositsObj.OrganizationId,

            };


            eHnoteInsuranceService.GetPatientVoidandRefundDepositList(obj).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.VoidList = resp.data.VoidList || [];
                    $scope.Refundlist = resp.data.Refundlist || [];

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }
        //commented by durga as on 31-03-2026 Need to know why in page load this has been called
        //$scope.GetPatientVoidDepositList();
        $scope.changeBillingFacility = function (Id) {
            var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": Id }, true) || [];
            if (filtredArray.length > 0 && filtredArray[0].ClinicId === 0) {
                $scope.HospitalIds = $scope.AllBranchesList.map(branch => branch.ClinicId).filter(clinicId => clinicId !== 0).join(',');
            } else {
                $scope.HospitalIds = filtredArray[0].ClinicId;
            }

            /* $scope.getOrganizationBillingProviderList();*/

            if (filtredArray.length > 0) {
                $scope.PatientDepositsObj.BillingProviderId = filtredArray[0].DefaultBillingProviderId;
                $scope.PatientDepositsObj.OrganizationFacilityId = filtredArray[0].BranchId;
                $scope.PatientDepositsObj.FacilityName = filtredArray[0].BranchName;
            }

        }

        $scope.changePaymentLocation = function (Id) {
            var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": Id }, true) || [];
            if (filtredArray.length > 0 && filtredArray[0].ClinicId === 0) {
                $scope.HospitalIds = $scope.AllBranchesList.map(branch => branch.ClinicId).filter(clinicId => clinicId !== 0).join(',');
            } else {
                $scope.HospitalIds = filtredArray[0].ClinicId;
            }

            if (filtredArray.length > 0) {
                $scope.PatientPaymentObj.BillingProviderId = filtredArray[0].DefaultBillingProviderId || 0;
                $scope.PatientPaymentObj.OrganizationFacilityId = filtredArray[0].BranchId;
                $scope.PatientPaymentObj.FacilityName = filtredArray[0].BranchName;
            }
            /* $scope.HospitalId = filtredArray[0].ClinicId;*/
            /* $scope.getOrganizationBillingProviderList();*/
        }

        $scope.IsShowDepositScreen = false;
        $scope.ViewEditDepositScreen = false;
        $scope.IsShowCollectaddPayment = false;
        $scope.EditPatientDepositData = function (item, ID) {

            //$scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());

            $scope.IsAddDepositbtn = true;
            $scope.ViewDepositScreen = true;

            $scope.IsShowDepositScreen = true;

            if (ID == 1) {
                $scope.IsShowCollectaddPayment = true;
            } else {
                $scope.IsShowCollectaddPayment = false;
            }

            $scope.ViewEditDepositScreen = false;
            item = item || null;

            $scope.PatientDepositsObj.AddressLine1 = item.AddressLine1;
            $scope.PatientDepositsObj.AddressLine2 = item.AddressLine2;
            $scope.PatientDepositsObj.BilledAmount = item.BilledAmount;
            $scope.PatientDepositsObj.CityName = item.CityName;
            $scope.PatientDepositsObj.CountryName = item.CountryName;
            $scope.PatientDepositsObj.CreatedBy = item.CreatedBy;
            $scope.PatientDepositsObj.DOB = item.DOB;
            $scope.PatientDepositsObj.DepositStatus = item.DepositStatus;
            $scope.PatientDepositsObj.DepositStatusId = item.DepositStatusId;
            $scope.PatientDepositsObj.DepositedBy = item.DepositedBy;
            $scope.PatientDepositsObj.Gender = item.Gender;
            $scope.PatientDepositsObj.OrganizationId = item.OrganizationId;
            $scope.PatientDepositsObj.OrganizationName = item.OrganizationName;
            $scope.PatientDepositsObj.PatientDisplayId = item.PatientDisplayId;
            $scope.PatientDepositsObj.PatientFullName = item.PatientFullName;
            $scope.PatientDepositsObj.PatientId = item.PatientId;
            $scope.PatientDepositsObj.PatientMobile = item.PatientMobile;
            $scope.PatientDepositsObj.PatientVoidDepositId = item.PatientVoidDepositId;
            $scope.PatientDepositsObj.ReceiptId = item.ReceiptId;
            $scope.PatientDepositsObj.StateCode = item.StateCode;
            $scope.PatientDepositsObj.StateName = item.StateName;
            $scope.PatientDepositsObj.Title = item.Title;
            $scope.PatientDepositsObj.TotalPatientBalance = item.TotalPatientBalance;
            $scope.PatientDepositsObj.VoidRemarks = item.VoidRemarks;
            $scope.PatientDepositsObj.ZipCode = item.ZipCode;
            $scope.PatientDepositsObj.AgeInMonths = item.AgeInMonths;
            $scope.PatientDepositsObj.AgeInYears = item.AgeInYears;

            $scope.PatientDepositsObj.PatientDepositId = item.PatientDepositId;
            $scope.PatientDepositsObj.PaymentMethodId = item.PaymentMethodId;
            $scope.PatientDepositsObj.PaymentMethodName = item.PaymentMethodName;
            $scope.PatientDepositsObj.BatchNumber = item.BatchNumber;
            $scope.PatientDepositsObj.DepositDate = item.DepositDate || "";
            $scope.PatientDepositsObj.PaymentDate = $filter('date')(item.PaymentDate, 'MM-dd-yyyy');
            if ($scope.PatientDepositsObj.DepositDate != "") {
                $scope.PatientDepositsObj.DepositDate = $filter('date')($scope.PatientDepositsObj.DepositDate, 'MM-dd-yyyy');
            }
            $scope.PatientDepositsObj.AppointmentId = item.AppointmentID;
            $scope.PatientDepositsObj.OrganizationFacilityId = item.OrganizationFacilityId;
            $scope.PatientDepositsObj.FacilityName = item.FacilityName;
            $scope.PatientDepositsObj.BillingProviderId = item.BillingProviderId;
            $scope.PatientDepositsObj.BillingProviderObj = item.BillingProviderName;
            $scope.PatientDepositsObj.DepositTypeId = item.DepositTypeId;
            $scope.PatientDepositsObj.DepositTypeName = item.DepositTypeName;
            $scope.PatientDepositsObj.DepositAmount = item.DepositAmount;
            $scope.PatientDepositsObj.ReceiptNo = item.ReceiptNo;
            $scope.PatientDepositsObj.PatientDepositId = item.PatientDepositId;
            $scope.PatientDepositsObj.Notes = item.Notes;
            $scope.PatientDepositsObj.IsDepositPrint = false;
            $scope.PatientDepositsObj.UnBilledAmount = item.UnBilledAmount;
            $scope.PatientDepositsObj.PatientDepositPaymodeList = [];

            if (item.PatientDepositPaymodeList.length > 0) {
                angular.forEach(item.PatientDepositPaymodeList, function (item) {
                    item.IsDepositAdded = true;
                    item.PaymentDate = $filter('date')(item.PaymentDate, 'MM-dd-yyyy');
                    $scope.PatientDepositsObj.PatientDepositPaymodeList.push(item);
                });
            } else {
                $scope.PatientDepositsObj.PatientDepositPaymodeList.push($scope.GetPatientDepositPaymodeList[0]);
            }

            /*    $scope.showNotes = true;*/
        }

        $scope.ViewDepositScreen = false;
        if (Selectobj.Allocate == 4) {
            $scope.ViewDepositScreen = true;
            $scope.IsShowDepositScreen = true;
            $scope.EditPatientDepositData(Selectobj.item);
        } else {
            $scope.ViewDepositScreen = false;
        }

        $scope.ClearPatientDeposit = function () {
            $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());
            $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
            $scope.IsAddDepositbtn = false;
            $scope.showNotes = false;
            $scope.initpage();
            $scope.getPatientDepositAmountById();
        }

        /*  $scope.IsselectedDeposit;*/




        //if ($scope.PatientClaimNumber == 0 && $scope.Selectobj.Type == 'Payment') {
        //    $scope.IsShowPatietnPaymentPopup = true;
        //}
        //else {
        //    $scope.IsShowPatietnPaymentPopup = false;
        //}
        $scope.IsShowPatietnPaymentPopup = false;
        $scope.AllocatePaymentDeposite = function () {

            $scope.IsShowPatietnPaymentPopup = true;
            $scope.PatientDepositsListArray = $scope.PatientDepositsListArray || [];


            if ($scope.PatientDepositsListArray.length > 0) {
                let PatientPaymentList = $scope.PatientDepositsListArray || [];
                $scope.PaymentLIst = angular.copy(PatientPaymentList);

                if ($scope.PaymentLIst.length > 0) {
                    $scope.PatientPaymentObj.PatientId = $scope.PaymentLIst[0].PatientId;
                    $scope.PatientPaymentObj.AppointmentId = $scope.PaymentLIst[0].AppointmentID;
                    $scope.PatientPaymentObj.ReceiptNo = $scope.PaymentLIst[0].ReceiptNo;
                    $scope.PatientPaymentObj.PaymentMethodId = $scope.PaymentLIst[0].PaymentMethodId;
                    $scope.PatientPaymentObj.PaymentMethodName = $scope.PaymentLIst[0].PaymentMethodName;
                    $scope.PatientPaymentObj.DepositDate = $scope.PaymentLIst[0].DepositDate;
                    $scope.PatientPaymentObj.DepositDate = $filter('date')($scope.PatientPaymentObj.DepositDate, "MM-dd-yyyy");
                    $scope.PatientPaymentObj.PatientDepositId = $scope.PaymentLIst[0].PatientDepositId;
                    $scope.PatientPaymentObj.DepositTypeId = $scope.PaymentLIst[0].DepositTypeId;
                    $scope.PatientPaymentObj.DepositTypeName = $scope.PaymentLIst[0].DepositTypeName;
                    $scope.PatientPaymentObj.DepositAmount = $scope.PaymentLIst[0].DepositAmount;
                    $scope.PatientPaymentObj.Notes = $scope.PaymentLIst[0].Notes;
                    $scope.PatientPaymentObj.BilledAmount = $scope.PaymentLIst[0].BilledAmount;
                    $scope.PatientPaymentObj.UnBilledAmount = $scope.PaymentLIst[0].UnBilledAmount;
                    $scope.PatientPaymentObj.PaymentsArray = $scope.PaymentLIst[0].PaymentsArray;
                    $scope.PatientPaymentObj.IsPatientDeposit = $scope.DepositDetails.IsPatientDeposit;
                }



            }
            // $scope.GetPatientPaymentsList();

        }
        $scope.ShowDepositeScreen = function () {
            $scope.IsShowPatietnPaymentPopup = false;
        }
        $scope.ShowAddDepositeScreen = function () {
            $scope.SubTab = 2;
            $scope.Selectobj.Allocate = '';
            $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());
            $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
            $scope.IsViewDepositScreen = false;
            $scope.getPatientDepositAmountById();
        }

        $scope.SelectedDepositeData = function (item) {
            angular.forEach($scope.PatientDepositsListArray, function (mitem) {
                mitem.IsselectedDeposit = false;
            });
            item.IsselectedDeposit = true;
        }

        $scope.changeAdjustment = function (typeid, mainitem) {

            var filterArray = $filter("filter")($scope.WriteOffReasons, { "OrganizationWriteOffReasonId": typeid }, true) || [];
            if (filterArray.length > 0) {
                mainitem.AdjsutmentReasonDescription = filterArray[0].ReasonDescription;
                mainitem.AdjustmentReasonCode = filterArray[0].ReasonCode;
                mainitem.AdjustmentReasonCodeId = filterArray[0].OrganizationWriteOffReasonId;
            }
        }




        $scope.calculateLineItemPatientTotals = function (atype) {
            var atype = atype || "";
            var totalPatientBalance = 0, totalWriteOffAmt = 0, totalPatientPaymentBlsAmt = 0, totalcount = 0, totalPatientBlsAmt = 0, totalClaimPatientBal = 0, totalClaimPatientPaymentAllocateAmt = 0;
            angular.forEach($scope.PatientClaimList, function (Aitem) {
                let totalPaymentAmount = 0;
                let totalWriteOffAmount = 0;
                let totalBalanceAmount = 0;
                let totalPatientBlnsAmount = 0;
                angular.forEach(Aitem.ClaimPatientResponsibility, function (sitem) {

                    if (sitem.IsChecked) {

                        sitem.PatientPaymentTypeId = $scope.PatientPaymentObj.DepositTypeId;

                        var List1 = $filter("filter")($scope.DepositTypes, function (Pitem,) { return Pitem.DepositTypeId === sitem.PatientPaymentTypeId; }) || [];
                        if (List1.length != 0) {

                            sitem.PatientPaymentTypeName = List1[0].DepositTypeName;
                        }
                        var CurrentPatientBalance = parseFloat(sitem.PatientBalance) || 0;
                        var CurrentPatientPaymentAmount = parseFloat(sitem.PatientPaymentAmount) || 0;
                        var CurrentWriteOffAmount = parseFloat(sitem.WriteOffAmount) || 0;
                        var CurrentInsuranceBalance = parseFloat(sitem.InsuranceBalance) || 0;

                        sitem.CurrentPatientBalance = CurrentPatientBalance - (CurrentPatientPaymentAmount + CurrentWriteOffAmount);
                        if (CurrentWriteOffAmount == 0) {
                            sitem.AdjsutmentReasonDescription = "";
                            sitem.AdjustmentReasonCode = "";
                            sitem.AdjustmentReasonCodeId = 0;
                        }
                        sitem.TotalBalance = sitem.CurrentPatientBalance + CurrentInsuranceBalance;
                        var CurrentTotalBalance = parseFloat(sitem.TotalBalance) || 0;
                        var CrntPatientBalance = parseFloat(sitem.CurrentPatientBalance) || 0;
                        totalBalanceAmount += CurrentTotalBalance;
                        totalPatientBalance += CurrentPatientBalance;
                        totalPaymentAmount += CurrentPatientPaymentAmount;
                        totalWriteOffAmount += CurrentWriteOffAmount;
                        totalPatientBlnsAmount += CrntPatientBalance;
                    }

                    // if ((totalPaymentAmount + totalWriteOffAmount) > $scope.PatientPaymentObj.UnBilledAmount) {
                    //if ((totalPaymentAmount) > $scope.PatientPaymentObj.UnBilledAmount) {
                    //    sitem.PatientPaymentAmount = null;
                    //    sitem.WriteOffAmount = null;
                    //    totalcount++;
                    //}
                });
                Aitem.TotalPatientBalance = totalPatientBalance - (totalPaymentAmount + totalWriteOffAmount);
                Aitem.TotalPatientPayment = totalPaymentAmount;
                Aitem.TotalWriteOffAmount = totalWriteOffAmount;
                Aitem.TotalBalance = totalBalanceAmount;
                totalClaimPatientBal += totalPatientBalance;
                totalPatientPaymentBlsAmt += totalPaymentAmount;
                totalWriteOffAmt += totalWriteOffAmount;
                totalPatientBlsAmt += totalPatientBlnsAmount;
                totalClaimPatientPaymentAllocateAmt += totalPaymentAmount;


            });
            $scope.mainPaymentObject.TotalPatientPaymentBalance = totalPatientPaymentBlsAmt;
            $scope.mainPaymentObject.TotalAdjustmentAmount = totalWriteOffAmt;
            $scope.PatientPaymentObj.BilledAmount = $scope.mainPaymentObject.TotalPatientPaymentBalance;


            $scope.mainPaymentObject.TotalPatientBalanceAmount = totalPatientBlsAmt;

            var collectedApymentAmt = 0;
            angular.forEach($scope.PatientPaymentObj.PatientDepositPaymodeList, function (item) {
                if (item.DeleteInd !== 'Y') {
                    collectedApymentAmt += parseFloat(item.DepositAmount) || 0;
                }
            });

            console.log(collectedApymentAmt + "__collectedApymentAmt");
            $scope.mainPaymentObject.TotalPaidAmount = collectedApymentAmt || 0;
            /*$scope.mainPaymentObject.TotalPayableAmount = totalClaimPatientBal - $scope.mainPaymentObject.TotalPaidAmount;*/
            $scope.mainPaymentObject.TotalPayableAmount = totalClaimPatientPaymentAllocateAmt;
            //if (atype == 'allocation') {
            //    $scope.mainPaymentObject.TotalPayableAmount = totalClaimPatientPaymentAllocateAmt;

            //    /*   $scope.mainPaymentObject.TotalPayableAmount = totalClaimPatientPaymentAllocateAmt - $scope.mainPaymentObject.TotalPaidAmount;*/


            //} else {
            //    $scope.mainPaymentObject.TotalPayableAmount = totalClaimPatientBal - $scope.mainPaymentObject.TotalPaidAmount;
            //}


            if ($scope.mainPaymentObject.TotalPayableAmount === 0 && $scope.mainPaymentObject.TotalAdjustmentAmount === 0) {
                $scope.mainPaymentObject.TotalPayableAmount = totalPatientBlsAmt;
            }

            $scope.mainPaymentObject.TotalPayableAmount = parseFloat($scope.mainPaymentObject.TotalPayableAmount.toFixed(2));
            var totalPatientBal = parseFloat($scope.mainPaymentObject.TotalPayableAmount) || 0;
            var totalPatientPaidAmt = parseFloat($scope.mainPaymentObject.TotalPaidAmount) || 0;
            var totalAdjustmentBalanceAmount = parseFloat($scope.mainPaymentObject.TotalAdjustmentAmount) || 0;

            console.log(totalPatientBal + "__totalPatientBal_" + totalPatientPaidAmt + "__totalPatientPaidAmt_" + totalAdjustmentBalanceAmount + "__totalAdjustmentAMt");
            $scope.mainPaymentObject.TotalPatientBalanceAmount = totalPatientBal - totalPatientPaidAmt;
            $scope.mainPaymentObject.TotalPatientBalanceAmount = parseFloat($scope.mainPaymentObject.TotalPatientBalanceAmount.toFixed(2));
        };


        $scope.AddCreditAmount = function (id, index) {
            angular.forEach($scope.PatientPaymentObj.PatientDepositPaymodeList, function (sitem) {
                if (sitem.PaymentMethodId == id) {
                    $scope.PatientPaymentObj.PatientDepositPaymodeList[index].DepositAmount = 100;
                    $scope.CalculateTotalPayments();
                }
            });



        }

        $scope.applyDeposit = function (atype, dtype) {
            var atype = atype || "";
            var dtype = dtype || "";
            var totalApplied = 0;
            var count = 0;



            $scope.mainPaymentObject.TotalPatientPaymentBalance = 0;
            let allChecked = true;
            $scope.PatientPaymentObj.UnBilledAmount = $scope.PatientPaymentObj.UnBilledAmount || 0;
            if ($scope.PatientPaymentObj.UnBilledAmount == 0) {
                angular.forEach($scope.PatientClaimList, function (Aitem) {
                    angular.forEach(Aitem.ClaimPatientResponsibility, function (item) {
                        if (item.IsChecked) {
                            count++;
                        }
                    })
                })
                if (count === 0) {
                    alertify.error('Please select at least one line item before the Allocate Payment.');
                    return false;
                }


                $scope.IsDepositAllocationEditMode = true;
                $scope.mainPaymentObject.TotalPatientBalanceAmount = 0;
                var patientDepositAmount = parseFloat($scope.PatientPaymentObj.UnBilledAmount);
                angular.forEach($scope.PatientClaimList, function (claim) {

                    for (let i = 0; i < claim.ClaimPatientResponsibility.length; i++) {
                        //let availableBls = claim.ClaimPatientResponsibility[i].CurrentPatientBalance;
                        let availableBls = claim.ClaimPatientResponsibility[i].PatientBalance;
                        claim.ClaimPatientResponsibility[i].WriteOffAmount = 0;

                        claim.ClaimPatientResponsibility[i].PatientPaymentTypeId = $scope.PatientPaymentObj.DepositTypeId;

                        var List1 = $filter("filter")($scope.DepositTypes, function (Pitem,) { return Pitem.DepositTypeId === claim.ClaimPatientResponsibility[i].PatientPaymentTypeId; }) || [];
                        if (List1.length != 0) {

                            claim.ClaimPatientResponsibility[i].PatientPaymentTypeName = List1[0].DepositTypeName;
                        }
                        var filterArray = $filter("filter")($scope.WriteOffReasons, { "OrganizationWriteOffReasonId": claim.ClaimPatientResponsibility[i].AdjustmentReasonCodeId }, true) || [];
                        if (filterArray.length > 0) {
                            claim.ClaimPatientResponsibility[i].AdjsutmentReasonDescription = filterArray[0].ReasonDescription;
                            claim.ClaimPatientResponsibility[i].AdjustmentReasonCode = filterArray[0].ReasonCode;
                        }
                        claim.ClaimPatientResponsibility[i].PatientPaymentAmount = patientDepositAmount;
                        claim.ClaimPatientResponsibility[i].CurrentPatientBalance = (availableBls - patientDepositAmount);
                        //$scope.TotalPatientPaymentBalance += patientDepositAmount;
                        $scope.mainPaymentObject.TotalPatientBalanceAmount += availableBls;
                        $scope.mainPaymentObject.TotalPatientBalanceAmount = parseFloat($scope.mainPaymentObject.TotalPatientBalanceAmount.toFixed(2));
                        claim.ClaimPatientResponsibility[i].IsChecked = claim.ClaimPatientResponsibility[i].PatientPaymentAmount !== 0;
                        patientDepositAmount = 0; // Deposit is exhausted
                        /*break;*/ // Exit loop since no deposit amount is left
                        if (!claim.ClaimPatientResponsibility[i].IsChecked && claim.ClaimPatientResponsibility[i].PatientBalance != 0) {
                            allChecked = false;
                        }
                        $scope.AllSelectionObj.IsAllItemsChecked = allChecked;
                    }
                });


                /*  return false;*/
            }
            else {

                $scope.mainPaymentObject.TotalPaidAmount = parseFloat($scope.mainPaymentObject.TotalPaidAmount.toFixed(2));
                if ($scope.mainPaymentObject.TotalPaidAmount < $scope.mainPaymentObject.TotalPayableAmount) {
                    alertify.error("Mismatch in payment amount and collected amount. Please update and resubmit");
                    return false;
                }

                angular.forEach($scope.PatientClaimList, function (Aitem) {
                    angular.forEach(Aitem.ClaimPatientResponsibility, function (item) {
                        if (item.IsChecked) {
                            count++;
                        }
                    })
                })
                if (count === 0) {
                    alertify.error('Please select at least one line item before the Allocate Payment.');
                    return false;
                }

                if (dtype == 'deleteDeposit') {
                    $scope.IsDepositAllocationEditMode = true;
                } else {
                    $scope.IsDepositAllocationEditMode = false;
                }

                var isPaymentAllocatedManually = $scope.PatientClaimList?.some(pitem =>
                    pitem.ClaimPatientResponsibility?.some(citem => {
                        const ppAmt = parseFloat(citem.PatientPaymentAmount) || 0;
                        const adjAmt = parseFloat(citem.WriteOffAmount) || 0;
                        return ppAmt > 0 || adjAmt > 0;
                    })
                );


                if ($scope.mainPaymentObject.TotalPaidAmount < $scope.mainPaymentObject.TotalPayableAmount) {
                    isPaymentAllocatedManually = false;
                }
                if (!isPaymentAllocatedManually) {
                    var patientDepositAmount = parseFloat($scope.PatientPaymentObj.UnBilledAmount);
                    angular.forEach($scope.PatientClaimList, function (claim) {
                        for (let i = 0; i < claim.ClaimPatientResponsibility.length; i++) {
                            if (claim.ClaimPatientResponsibility[i].IsChecked) {
                                let balance = claim.ClaimPatientResponsibility[i].PatientBalance;
                                //let availableBls = claim.ClaimPatientResponsibility[i].CurrentPatientBalance;
                                let availableBls = claim.ClaimPatientResponsibility[i].PatientBalance;
                                // claim.ClaimPatientResponsibility[i].WriteOffAmount = 0;

                                // If deposit is greater than or equal to the balance, pay it off completely
                                if (patientDepositAmount >= balance) {
                                    claim.ClaimPatientResponsibility[i].PatientPaymentTypeId = $scope.PatientPaymentObj.DepositTypeId;
                                    var List1 = $filter("filter")($scope.DepositTypes, function (Pitem,) { return Pitem.DepositTypeId === claim.ClaimPatientResponsibility[i].PatientPaymentTypeId; }) || [];
                                    if (List1.length != 0) {

                                        claim.ClaimPatientResponsibility[i].PatientPaymentTypeName = List1[0].DepositTypeName;
                                    }
                                    var filterArray = $filter("filter")($scope.WriteOffReasons, { "OrganizationWriteOffReasonId": claim.ClaimPatientResponsibility[i].AdjustmentReasonCodeId }, true) || [];
                                    if (filterArray.length > 0) {
                                        claim.ClaimPatientResponsibility[i].AdjsutmentReasonDescription = filterArray[0].ReasonDescription;
                                        claim.ClaimPatientResponsibility[i].AdjustmentReasonCode = filterArray[0].ReasonCode;
                                    }
                                    claim.ClaimPatientResponsibility[i].PatientPaymentAmount = balance;
                                    claim.ClaimPatientResponsibility[i].CurrentPatientBalance = (availableBls - balance);
                                    patientDepositAmount -= balance;
                                    $scope.mainPaymentObject.TotalPatientPaymentBalance += balance;
                                    claim.ClaimPatientResponsibility[i].IsChecked = claim.ClaimPatientResponsibility[i].PatientPaymentAmount !== 0;

                                } else {
                                    // If deposit is less than the balance, pay as much as possible
                                    claim.ClaimPatientResponsibility[i].PatientPaymentTypeId = $scope.PatientPaymentObj.DepositTypeId;
                                    var List1 = $filter("filter")($scope.DepositTypes, function (Pitem,) { return Pitem.DepositTypeId === claim.ClaimPatientResponsibility[i].PatientPaymentTypeId; }) || [];
                                    if (List1.length != 0) {

                                        claim.ClaimPatientResponsibility[i].PatientPaymentTypeName = List1[0].DepositTypeName;
                                    }
                                    var filterArray = $filter("filter")($scope.WriteOffReasons, { "OrganizationWriteOffReasonId": claim.ClaimPatientResponsibility[i].AdjustmentReasonCodeId }, true) || [];
                                    if (filterArray.length > 0) {
                                        claim.ClaimPatientResponsibility[i].AdjsutmentReasonDescription = filterArray[0].ReasonDescription;
                                        claim.ClaimPatientResponsibility[i].AdjustmentReasonCode = filterArray[0].ReasonCode;
                                    }
                                    claim.ClaimPatientResponsibility[i].PatientPaymentAmount = patientDepositAmount;
                                    claim.ClaimPatientResponsibility[i].CurrentPatientBalance = (availableBls - patientDepositAmount);
                                    $scope.mainPaymentObject.TotalPatientPaymentBalance += patientDepositAmount;
                                    patientDepositAmount = 0; // Deposit is exhausted
                                    claim.ClaimPatientResponsibility[i].IsChecked = claim.ClaimPatientResponsibility[i].PatientPaymentAmount !== 0;
                                    //break; // Exit loop since no deposit amount is left
                                }


                                if (!claim.ClaimPatientResponsibility[i].IsChecked && claim.ClaimPatientResponsibility[i].PatientBalance != 0) {
                                    allChecked = false;
                                }
                                $scope.AllSelectionObj.IsAllItemsChecked = allChecked;
                            }
                        }
                    });
                }

            }

            if ($scope.mainPaymentObject.TotalPaidAmount == $scope.mainPaymentObject.TotalPayableAmount) {
                $scope.IsAllocateDisabled = true;
            }

            //$scope.PatientPaymentObj.BilledAmount = $scope.TotalPatientPaymentBalance;

            //$scope.TotalPatientBalanceAmount = $scope.TotalPatientBalanceAmount - $scope.TotalPatientPaymentBalance;

            $scope.calculateLineItemPatientTotals();

        };

        $scope.changeDepositAmount = function () {
            $scope.PatientPaymentObj.UnBilledAmount = parseFloat($scope.PatientPaymentObj.DepositAmount) || 0;
        }


        $scope.SavePatientPayment = function (IsFrom) {
            if (IsFrom == 'PostAndPrint') {
                $scope.PatientPaymentObj.IsDepositPrint = true;
            }

            if ($scope.mainPaymentObject.TotalPaidAmount == 0 && $scope.mainPaymentObject.TotalAdjustmentAmount == 0) {
                alertify.error("Please Collect  Payment Amount");
                $scope.PatientPaymentObj.IsDepositPrint = false;
                return false;
            }

            let i = 0, j = 0, hasDepositAmount = false;

            console.log($scope.PatientPaymentObj);

            var totalPayableAmt = parseFloat($scope.mainPaymentObject.TotalPayableAmount) || 0;

            if ($scope.PatientPaymentObj.BillingProviderId == 0 || $scope.PatientPaymentObj.BillingProviderId == null || $scope.PatientPaymentObj.BillingProviderId == undefined) {
                alertify.error("Please select Billing Provider");
                return false;
            }

            console.log($scope.PatientPaymentObj.PatientDepositPaymodeList);

            $scope.PatientPaymentObj.PatientDepositPaymodeList = $scope.PatientPaymentObj.PatientDepositPaymodeList || [];
            if ($scope.PatientPaymentObj.PatientDepositPaymodeList.length > 0) {

                angular.forEach($scope.PatientPaymentObj.PatientDepositPaymodeList, function (item) {
                    if (item.PaymentMethodId == 0) {
                        i++;
                    }
                    if (item.DepositAmount && item.DepositAmount !== "") {
                        hasDepositAmount = true;
                    }

                });
            }

            if (i > 0) {
                alertify.error("Please select payment method");
                return;
            }

            //if ($scope.PatientPaymentObj.PatientDepositPaymodeList.length === 1 && !hasDepositAmount) {
            //    alertify.error("Please enter deposit amount");
            //    return;
            //}
            let EOBClaims = [];
            let count = 0;
            let pcount = 0;
            let wcount = 0;
            let ecount = 0;
            let acount = 0;
            let adjcount = 0;
            if ($scope.PatientClaimList.length > 0) {

                angular.forEach($scope.PatientClaimList, function (Aitem) {
                    let ClaimLineItems = [];
                    Aitem.TotalPatientResponsibilityAmount = 0;
                    angular.forEach(Aitem.ClaimPatientResponsibility, function (item) {
                        let ClaimTransactions = [];
                        item.PatientPaymentAmount = item.PatientPaymentAmount || 0;
                        item.WriteOffAmount = item.WriteOffAmount || 0;
                        Aitem.TotalPatientResponsibilityAmount += item.PatientResponsibilityAmount || 0;

                        if (item.IsChecked) {
                            count++;
                        }
                        if (item.IsChecked && (item.PatientPaymentAmount == 0 && item.WriteOffAmount == 0)) {
                            pcount++;
                        }
                        if (!item.IsChecked && (item.PatientPaymentAmount !== 0 || item.WriteOffAmount !== 0)) {
                            acount++;
                        }
                        if (item.IsChecked && item.WriteOffAmount != 0 && item.AdjustmentReasonCodeId == 0) {
                            adjcount++;
                        }
                        let prevAdjustment = item.PreviousAdjustmentAmount || 0;
                        let newAdjustment = item.WriteOffAmount || 0;
                        let prevPayment = item.PreviousPaymentAmount || 0;
                        let newPayment = item.PatientPaymentAmount || 0;
                        if ($scope.Selectobj.PaymentEditType == 'PaymentEdit') {

                            if (prevAdjustment !== 0) {
                                let adjreversalObj = {
                                    "ClaimTransactionId": 0,
                                    "PatientDepositId": 0,
                                    "ClaimLineItemId": item.ClaimLineItemId,
                                    "OrganizationId": $scope.HospitalId,
                                    "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                                    "TransactionAmount": prevAdjustment,
                                    "PatientAmount": prevAdjustment,
                                    "InsuranceAmount": 0,
                                    "ReferenceNumber": $scope.PatientPaymentObj.ReferenceNumber,
                                    "TransactionTypeId": 104,
                                    "TransactionType": "Adjustment Reversal",
                                    "TransactionSourceId": 3,
                                    "TransactionSource": "Patient",
                                    "SettlementStatusId": 7,
                                    "SettlementStatus": "Cancel Payment",
                                    "TransactionNotes": "Reversal of previous adjustment",
                                    "IsReversal": 1
                                };
                                ClaimTransactions.push(adjreversalObj);
                            }
                            if (prevPayment !== 0) {
                                let payreversalObj = {
                                    "ClaimTransactionId": 0,
                                    "PatientDepositId": 0,
                                    "ClaimLineItemId": item.ClaimLineItemId,
                                    "OrganizationId": $scope.HospitalId,
                                    "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                                    "TransactionAmount": prevPayment,
                                    "PatientAmount": prevPayment,
                                    "InsuranceAmount": 0,
                                    "ReferenceNumber": $scope.PatientPaymentObj.ReferenceNumber,
                                    "TransactionTypeId": 101,
                                    "TransactionType": "Patient Payment Reversal",
                                    "TransactionSourceId": 3,
                                    "TransactionSource": "Patient",
                                    "SettlementStatusId": 7,
                                    "SettlementStatus": "Cancel Payment",
                                    "TransactionNotes": "Reversal of previous patient payment",
                                    "IsReversal": 1
                                };
                                ClaimTransactions.push(payreversalObj);
                            }
                        }
                        if (item.WriteOffAmount != 0 && item.IsChecked) {
                            let obj3 = {
                                "ClaimTransactionId": 0,
                                "PatientDepositId": $scope.PatientPaymentObj.PatientDepositId,
                                "ClaimLineItemId": item.ClaimLineItemId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                                "TransactionAmount": -+item.WriteOffAmount,
                                "PatientAmount": -+item.WriteOffAmount,
                                "InsuranceAmount": 0,
                                "ReferenceNumber": $scope.PatientPaymentObj.ReferenceNumber,
                                "TransactionTypeId": 57,
                                "TransactionType": "Selfpay Adjustment",
                                "TransactionSourceId": 3,
                                "TransactionSource": "Patient",
                                "SettlementStatusId": 3,
                                "SettlementStatus": "Fully Settled",
                                "TransactionNotes": ""
                            }
                            ClaimTransactions.push(obj3);
                        }

                        if (item.PatientPaymentAmount != 0 && item.IsChecked) {
                            let obj3 = {
                                "ClaimTransactionId": 0,
                                "PatientDepositId": $scope.PatientPaymentObj.PatientDepositId,
                                "ClaimLineItemId": item.ClaimLineItemId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                                "TransactionAmount": -+item.PatientPaymentAmount,
                                "PatientAmount": -+item.PatientPaymentAmount,
                                "InsuranceAmount": 0,
                                "ReferenceNumber": $scope.PatientPaymentObj.ReferenceNumber,
                                "TransactionTypeId": 26,
                                "TransactionType": "Patient Payment Check",
                                "TransactionSourceId": 3,
                                "TransactionSource": "Patient",
                                "SettlementStatusId": 3,
                                "SettlementStatus": "Fully Settled",
                                "TransactionNotes": ""
                            }
                            ClaimTransactions.push(obj3);
                        }

                        if ($scope.Selectobj.PaymentEditType == 'PaymentEdit') {
                            Aitem.EOBClaimInfoId = Aitem.EOBClaimInfoId;
                            item.EOBLineItemId = item.EOBLineItemId;
                        } else {
                            Aitem.EOBClaimInfoId = 0;
                            item.EOBLineItemId = 0;
                        }


                        if (ClaimTransactions.length > 0) {
                            let obj2 = {
                                "PatientClaimId": item.PatientClaimId,
                                "ClaimLineItemId": item.ClaimLineItemId,
                                "PatientDepositId": $scope.PatientPaymentObj.PatientDepositId,
                                "EOBLineItemId": item.EOBLineItemId,
                                "ServiceId": item.ServiceId,
                                "AllowedAmount": item.AllowedAmount,
                                "InsurancePaymentAmount": item.InsurancePaymentAmount,
                                "CoPaymentAmount": item.CoPaymentAmount,
                                "DeductibleAmount": item.DeductibleAmount,
                                "CoInsuranceAmount": item.CoInsuranceAmount,
                                "PatientPaymentAmount": item.PatientPaymentAmount,
                                "WriteOffAmount": item.WriteOffAmount,
                                "PatientBalance": item.CurrentPatientBalance,
                                "TotalBalance": item.TotalBalance,
                                "PatientPaymentTypeId": item.PatientPaymentTypeId,
                                "PatientPaymentType": item.PatientPaymentType,
                                "AdjustmentAmount": item.AdjustmentAmount,
                                "AdjustmentReasonCodeId": item.AdjustmentReasonCodeId,
                                "AdjustmentReasonCode": item.AdjustmentReasonCode,
                                "AdjsutmentReasonDescription": item.AdjsutmentReasonDescription,
                                "ClaimTransactions": ClaimTransactions || [],
                                "PatientResponsibilityAmount": item.PatientResponsibilityAmount,
                            }

                            ClaimLineItems.push(obj2);
                        }

                    });


                    if (ClaimLineItems.length > 0) {
                        let obj2 = {
                            "PatientClaimId": Aitem.PatientClaimId,
                            "EOBClaimInfoId": Aitem.EOBClaimInfoId || 0,
                            "TotalChargeAmount": Aitem.TotalClaimAmount || 0,
                            "ClaimPaymentAmount": Aitem.TotalPatientPayment || 0,
                            "TotalAdjustmentAmount": Aitem.TotalAdjustmentAmount,
                            "TotalAllowedAmount": Aitem.TotalAllowedAmount,
                            "TotalBalance": Aitem.TotalBalance,
                            "TotalClaimAmount": Aitem.TotalClaimAmount,
                            "TotalCoInsuranceAmount": Aitem.TotalCoInsuranceAmount,
                            "TotalCopayAmount": Aitem.TotalCopayAmount,
                            "TotalDeductibleAmount": Aitem.TotalDeductibleAmount,
                            "TotalInsuranceBalance": Aitem.TotalInsuranceBalance,
                            "TotalInsurancePayment": Aitem.TotalInsurancePayment,
                            "TotalPatientBalance": Aitem.TotalPatientBalance,
                            "TotalPatientPayment": Aitem.TotalPatientPayment,
                            "TotalPaymentAmount": Aitem.TotalPaymentAmount,
                            "TotalWriteOffAmount": Aitem.TotalWriteOffAmount,
                            "EOBClaimLineItems": ClaimLineItems || [],
                            "TotalPatientResponsibilityAmount": Aitem.TotalPatientResponsibilityAmount,
                        }
                        EOBClaims.push(obj2);
                    };
                });

            }

            if (count === 0) {
                alertify.error('Please select at least one line item before posting.');
                return false;
            }
            //if (acount > 0) {
            //    alertify.error('Please select the line item before posting.');
            //    return false;
            //}
            if (pcount > 0) {
                alertify.error('There is no payment amount for the selected line items');
                return false;
            }
            if (EOBClaims.length == 0) {
                return false;
            }
            $scope.PatientPaymentObj.UnBilledAmount = $scope.PatientPaymentObj.UnBilledAmount || 0;

            if ($scope.mainPaymentObject.TotalPatientPaymentBalance == 0 && wcount > 0 && ecount == 0) {
                alertify.error("Please apply Deposit Amount.");
                return false;
            }

            if ($scope.mainPaymentObject.TotalPaidAmount < $scope.mainPaymentObject.TotalPayableAmount) {
                alertify.error("Mismatch in payment amount and collected amount. Please update and resubmit");
                return false;
            }
            if (adjcount > 0) {
                alertify.error('Please select Adj. reason code.');
                return false;
            }
            if ($scope.mainPaymentObject.TotalPayableAmount > 0) {
                if ($scope.mainPaymentObject.TotalPaidAmount > $scope.mainPaymentObject.TotalPayableAmount) {
                    angular.forEach($scope.PatientPaymentObj.PatientDepositPaymodeList, function (ditem) {
                        /* ditem.DepositAmount = 0;*/
                        if (totalPayableAmt > 0) {
                            var amtTobeallocated = 0;
                            ditem.UnBilledAmount = ditem.UnBilledAmount || 0;
                            ditem.DepositAmount = ditem.DepositAmount || 0;
                            if (ditem.UnBilledAmount != 0) {
                                amtTobeallocated = ditem.UnBilledAmount;
                            } else if (ditem.DepositAmount !== 0) {
                                amtTobeallocated = ditem.DepositAmount;
                            }


                            if (totalPayableAmt > amtTobeallocated) {
                                ditem.DepositAmount = amtTobeallocated;
                                totalPayableAmt -= ditem.DepositAmount;
                            } else {
                                ditem.DepositAmount = totalPayableAmt;
                                totalPayableAmt = 0;
                            }
                        }
                        else {
                            ditem.DepositAmount = 0;
                        }
                    });


                }
            } else {
                $scope.PatientPaymentObj.PatientDepositPaymodeList = [];
            }
            if ($scope.mainPaymentObject.TotalPatientBalanceAmount > 0) {

                alertify.confirm(
                    "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure ,you want toContinue with Due Amount?</h4>",
                    function () {

                        $scope.SavePatientPaymentNew(EOBClaims);
                        $scope.$apply();


                    },
                    function () {

                        return false;
                    }
                );
            }
            else {
                $scope.SavePatientPaymentNew(EOBClaims);

            }
        }

        $scope.PatientAlertobj =
        {
            'IsAlertInd': false
        }
        $scope.SavePatientPaymentNew = function (EOBClaims) {

            let DepositAmount = 0;
            let UnBilledAmount = 0;
            let UnAppliedAmount = 0;
            let EOBUnAppliedAmount = 0;
            let EOBAppliedAmount = 0;
            if ($scope.PatientPaymentObj.IsPatientDeposit) {

                DepositAmount = $scope.PatientPaymentObj.DepositAmount;
                UnBilledAmount = $scope.PatientPaymentObj.UnBilledAmount;
                EOBAppliedAmount = ($scope.PatientPaymentObj.BilledAmount);
                UnAppliedAmount = (DepositAmount - $scope.PatientPaymentObj.BilledAmount);
                //UnAppliedAmount = $scope.PatientPaymentObj.BilledAmount;

            } else {
                DepositAmount = $scope.PatientPaymentObj.UnBilledAmount;
                EOBUnAppliedAmount = (DepositAmount - $scope.PatientPaymentObj.BilledAmount);
                EOBAppliedAmount = ($scope.PatientPaymentObj.BilledAmount);
            }

            if ($scope.PatientPaymentObj.IsEditPatientDeposit === true) {
                if ($scope.DepositDetails.TotalAllocatedAmount > $scope.mainPaymentObject.TotalPatientPaymentBalance) {
                    UnAppliedAmount = $scope.DepositDetails.TotalAllocatedAmount - $scope.mainPaymentObject.TotalPatientPaymentBalance;
                } else {
                    UnAppliedAmount = $scope.mainPaymentObject.TotalPatientPaymentBalance - $scope.DepositDetails.TotalAllocatedAmount;
                }
                DepositAmount = 0;
            }




            if ($scope.Selectobj.PaymentEditType == 'PaymentEdit') {
                $scope.PatientPaymentObj.EOBId = $scope.Selectobj.item.EOBId;
            } else {
                $scope.PatientPaymentObj.EOBId = 0;
            }

            //let filteredList = [];

            //if ((ecount > 0 || $scope.PatientPaymentObj.PatientDepositId != 0) && $scope.Selectobj.ScreenType === 'Deposit') {
            //    filteredList = $scope.allClaimPatientPayments.filter(function (item) {
            //        return item.PatientDepositId === $scope.PatientPaymentObj.PatientDepositId;
            //    });
            //} else if ($scope.Selectobj.ScreenType === 'Payment' && $scope.PatientPaymentObj.PatientDepositId === 0) {
            //    filteredList = $scope.allClaimPatientPayments.filter(function (item) {
            //        return item.PatientClaimId === $scope.Selectobj.PatientClaimId;
            //    });
            //}

            //if (filteredList.length > 0) {
            //    let amountToUse = UnAppliedAmount !== 0 ? UnAppliedAmount : DepositAmount;
            //    let adjustedAmount;
            //    if ($scope.PatientPaymentObj.CurrentPaymentType === "Update") {
            //        adjustedAmount = -Math.abs(amountToUse);
            //    } else {
            //        adjustedAmount = amountToUse;
            //    }

            //    filteredList[0].DepositPaymentmodeList.forEach(function (item) {
            //        item.DepositAmount = adjustedAmount;
            //    });

            //    $scope.PatientPaymentObj.PatientDepositPaymodeList = angular.copy(filteredList[0].DepositPaymentmodeList);
            //}
            //$scope.PatientPaymentObj.PatientDepositPaymodeList.forEach(function (item) {
            //    if ($scope.PaymentMethodObj.PatientDepositId == item.PatientDepositId) {
            //        item.DepositAmount =$scope.PatientPaymentObj.BilledAmount;

            //    }

            //});
            //let remainingAmount = EOBAppliedAmount;
            //$scope.PatientPaymentObj.PatientDepositPaymodeList.forEach(function (item) {
            //    if (remainingAmount <= 0) {
            //        item.DepositAmount = 0;
            //        return;
            //    }
            //    let originalAmount = item.DepositAmount || 0;
            //    let appliedAmount = Math.min(originalAmount, remainingAmount);
            //    item.DepositAmount = appliedAmount;
            //    remainingAmount -= appliedAmount;
            //});
            if ($scope.HospitalId != null) {
                var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": $scope.HospitalId }, true) || [];
                if (filtredArray.length > 0) {
                    $scope.PatientPaymentObj.OrganizationTransactionId = filtredArray[0].BranchId;
                    $scope.PatientPaymentObj.OrganizationTransactionName = filtredArray[0].BranchName;
                }
            }

            angular.forEach($scope.PatientPaymentObj.PatientDepositPaymodeList, function (item) {
                item.PatientDepositPaymodeListId = 0;
            })

            let obj = {
                "UserId": $scope.UserId,
                //"OrganizationId": $scope.HospitalId,
                "PatientDepositId": $scope.PatientPaymentObj.PatientDepositId,
                "TotalPaymentAmount": $scope.PatientPaymentObj.BilledAmount,
                "TotalUnAppliedAmount": (DepositAmount - $scope.PatientPaymentObj.BilledAmount),
                // "TotalUnAppliedAmount": UnAppliedAmount,
                "TotalAppliedAmount": $scope.PatientPaymentObj.BilledAmount,
                "TotalEOBUnAppliedAmount": EOBUnAppliedAmount || 0,
                "TotalEOBAppliedAmount": EOBAppliedAmount || 0,
                "PaymentModeId": $scope.PatientPaymentObj.PaymentMethodId,
                "PaymentMode": $scope.PatientPaymentObj.PaymentMethodName,
                "DepositTypeId": $scope.PatientPaymentObj.DepositTypeId,
                "DepositTypeName": $scope.PatientPaymentObj.DepositTypeName,
                "DepositDate": $filter("date")($scope.PatientPaymentObj.DepositDate, "yyyy-MM-dd"),
                "PostingDate": $filter("date")($scope.PatientPaymentObj.PostingDate, "yyyy-MM-dd"),
                "ReceiptNo": $scope.PatientPaymentObj.ReceiptNo,
                "BatchNumber": $scope.PatientPaymentObj.BatchNumber,
                "Notes": $scope.PatientPaymentObj.Notes,
                "PatientId": $scope.PatientPaymentObj.PatientId,
                "EOBId": $scope.PatientPaymentObj.EOBId || 0,
                "EOBClaims": EOBClaims || [],
                "PostingType": "Patient Payment",
                "PostingTypeId": 3,
                "EOBTypeId": 2,
                "EOBType": "Patient Payment",
                "BillingProviderId": $scope.PatientPaymentObj.BillingProviderId,        // new params
                "OrganizationFacilityId": $scope.PatientPaymentObj.OrganizationFacilityId,
                "FacilityName": $scope.PatientPaymentObj.FacilityName,
                "PatientDepositPaymodeList": $scope.PatientPaymentObj.PatientDepositPaymodeList || [],
                "IsDepositPrint": $scope.PatientPaymentObj.IsDepositPrint,
                "PaymentTransactionTypeId": 2,
                "PaymentTransactionType": 'Debit',
                "OrganizationTransactionId": $scope.PatientPaymentObj.OrganizationTransactionId,
                "OrganizationTransactionName": $scope.PatientPaymentObj.OrganizationTransactionName,
                "OrganizationId": $scope.PatientPaymentObj.OrganizationFacilityId,
                "OrganizationName": $scope.PatientPaymentObj.FacilityName,


            }
            console.log(JSON.stringify(obj))

            eHnoteInsuranceService.AddUpdatePatientPayment(obj).then(function (resp) {
                console.log(resp);
                if (resp.data.Status === "Success") {

                    var settlementStatusId = $scope.Selectobj.item?.SettlementStatusId || 1;

                    $scope.PatientAlertobj.IsAlertInd = true;
                    var responsedata = {
                        "status": "Success",
                        "IsAlertInd": $scope.PatientAlertobj.IsAlertInd,
                        "SettlementStatusId": settlementStatusId
                    };
                    $scope.SelectedPatientDetails.DepositsObj = angular.copy($scope.PatientPaymentObj) || "";

                    if ($scope.SelectedPatientDetails.DepositsObj.IsDepositPrint == true) {
                        $scope.SelectedPatientDetails.DepositsObj.ReceiptNo = resp.data.ReceiptNo || '';
                        $scope.SelectedPatientDetails.DepositsObj.CreatedBy = resp.data.CreatedBy || '';
                        $scope.SelectedPatientDetails.DepositsObj.BillingProviderName = resp.data.BillingProviderName || '';
                        resp.data.EOBCLaims = resp.data.EOBCLaims || [];
                        if (resp.data.EOBCLaims.length > 0) {
                            $scope.SelectedPatientDetails.DepositsObj.EOBCLaims = resp.data.EOBCLaims || [];
                            $scope.SelectedPatientDetails.DepositsObj.EOBClaimLineItems = resp.data.EOBCLaims[0].EOBClaimLineItems || [];
                            $scope.SelectedPatientDetails.TotalChargeAmount = 0;
                            $scope.SelectedPatientDetails.TotalAdjustmentAmount = 0;
                            $scope.SelectedPatientDetails.TotalPatientPayment = 0;
                            $scope.SelectedPatientDetails.DiagnosisArray = [];

                            if ($scope.SelectedPatientDetails.DepositsObj.EOBClaimLineItems.length > 0) {
                                angular.forEach($scope.SelectedPatientDetails.DepositsObj.EOBClaimLineItems, function (kitem) {
                                    $scope.SelectedPatientDetails.TotalChargeAmount += kitem.PatientResponsibility;
                                    if (kitem.DiagnosisList.length > 0) {
                                        angular.forEach(kitem.DiagnosisList, function (Ditem) {
                                            var filtredArray = $filter("filter")($scope.SelectedPatientDetails.DiagnosisArray, { "DiagnosisId": Ditem.DiagnosisId }, true) || [];
                                            if (filtredArray.length == 0) {
                                                $scope.SelectedPatientDetails.DiagnosisArray.push(Ditem);
                                            }
                                        });
                                    }

                                });
                            }
                            // $scope.SelectedPatientDetails.TotalChargeAmount = resp.data.EOBCLaims[0].TotalChargeAmount || 0;
                            $scope.SelectedPatientDetails.Sub_Total = ($scope.SelectedPatientDetails.TotalChargeAmount || 0) - ($scope.SelectedPatientDetails.DepositsObj.EOBCLaims[0].TotalWriteOffAmount || 0);
                            $scope.SelectedPatientDetails.TotalBalance = $scope.SelectedPatientDetails.DepositsObj.EOBCLaims[0].TotalPatientBalance || 0;
                            $scope.SelectedPatientDetails.TotalPatientPayment = $scope.SelectedPatientDetails.DepositsObj.EOBCLaims[0].TotalPatientPayment || 0;
                        }

                        $scope.DepositTransactionObj.TransactionDate = resp.data.CreatedDt || '';
                        $scope.DepositTransactionObj.TransactionTime = resp.data.CreatedTime || '';
                        //$scope.DepositTransactionObj.TransactionTime = resp.data.PatientDepositPaymodeList[0].TransactionTime || '';
                        $scope.DepositTransactionObj.TransReciptNo = resp.data.PatientDepositPaymodeList[0].EobPaymodeReceiptNo || '';
                        $scope.DepositTransactionObj.PaymentMethodId = resp.data.PatientDepositPaymodeList[0].PaymentMethodId;
                        $scope.DepositTransactionObj.PaymentMethodName = resp.data.PatientDepositPaymodeList[0].PaymentMethodName || '';
                        var card = resp.data.PatientDepositPaymodeList[0].CardNumber?.toString() || '';
                        $scope.DepositTransactionObj.CardNumber = card.length === 3 ? "0" + card : card;
                        $scope.DepositTransactionObj.ChequeNumber = resp.data.PatientDepositPaymodeList[0].ChequeNumber || '';
                        $scope.DepositTransactionObj.CardType = resp.data.PatientDepositPaymodeList[0].CardType || '';
                        $scope.DepositTransactionObj.OnlineTransactionNumber = resp.data.PatientDepositPaymodeList[0].OnlineTransactionNumber || '';
                        $scope.DepositTransactionObj.TransactionAmount = resp.data.PatientDepositPaymodeList[0].DepositAmount || '';
                        $scope.DepositTransactionObj.ReceiptNumber = resp.data.ReceiptNo || '';
                        $scope.DepositTransactionObj.OrganizationName = resp.data.PatientDepositPaymodeList[0].OrganizationName || '';

                        var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": resp.data.PatientDepositPaymodeList[0].OrganizationId }, true) || [];
                        if (filtredArray.length > 0) {
                            $scope.DepositTransactionObj.CityTown = filtredArray[0].CityTown;
                            $scope.DepositTransactionObj.State = filtredArray[0].State;
                            $scope.DepositTransactionObj.Country = filtredArray[0].Country;
                            $scope.DepositTransactionObj.FaxNumber = filtredArray[0].FaxNumber || "";
                            if ($scope.DepositTransactionObj.FaxNumber != "") {
                                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.DepositTransactionObj.FaxNumber);
                                $scope.DepositTransactionObj.FaxNumber = obj.UsFormatMobileNumber;
                            }
                        }


                        $scope.HospitalAddress = $scope.HospitalAddressArray || null;
                        if ($scope.HospitalAddress.PharmacyPhoneNo != "") {
                            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.PharmacyPhoneNo);
                            $scope.HospitalAddress.PharmacyPhoneNo = obj.UsFormatMobileNumber;
                        }
                        if ($scope.HospitalAddress.ContactNo != "") {
                            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.ContactNo);
                            $scope.HospitalAddress.ContactNo = obj.UsFormatMobileNumber;
                        }
                        $scope.PatientPaymentprintpopup();
                    } else {

                    }
                    alertify.success("Payments posted Successfully");
                    $uibModalInstance.close(responsedata);
                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }

        $scope.ShowDepositPaymentScreen = function () {
            $scope.IsShowDepositScreen = true;
            /*   $scope.changeBillingFacility($scope.PatientDepositsObj.OrganizationFacilityId);*/
            $scope.changeAppointment($scope.Selectedpatientobj.AppointmentmentsArray[0].AppointmentId);
        }


        $scope.AddDepositandAllocate = function (item) {

            $scope.DepositDetails.TotalPatientClaimBalance = $scope.DepositDetails.TotalPatientClaimBalance || 0;
            if ($scope.DepositDetails.TotalPatientClaimBalance === 0) {
                alertify.error("There is no patient balance to allocate amount");
                return;
            }

            if ($scope.PatientDepositsObj.PatientId === 0) {
                alertify.error("Please Select Patient ");
                return;
            }

            let i = 0; let j = 0; let k = 0; let l = 0;
            angular.forEach($scope.PatientDepositsObj.PatientDepositPaymodeList, function (item) {
                if (item.PaymentMethodId == 0) {
                    i++;
                }
                if (item.DepositAmount == "") {
                    j++;
                }
                //if (item.ReferenceNumber == "") {
                //    k++;
                //}
                //if (item.PaymentDate == null) {
                //    l++;
                //}
                //else {
                //    item.PaymentDate = $filter("usdateFormatter")(item.PaymentDate, "-");
                //}
            });

            if (i > 0) {
                alertify.error("Please select payment method");
                return;
            }
            if (j > 0) {
                alertify.error("Please enter amount");
                return;
            }
            //if (k > 0) {
            //    alertify.error("Please enter reference number");
            //    return;
            //}
            //if (l > 0) {
            //    alertify.error("Please select payment date");
            //    return;
            //}

            //$scope.PatientDepositsObj.PaymentMethodId = $scope.PatientDepositsObj.PaymentMethodId || null;
            //if ($scope.PatientDepositsObj.PaymentMethodId === null) {
            //    alertify.error("Please Select Payment Method ");
            //    return;
            //}

            //$scope.PatientDepositsObj.DepositAmount = $scope.PatientDepositsObj.DepositAmount || "";
            //if ($scope.PatientDepositsObj.DepositAmount === "") {
            //    alertify.error("Please Enter Amount ");
            //    return;
            //}


            var ConvertedDate = $filter("usdateFormatter")($scope.PatientDepositsObj.DepositDate, "-");
            var PaymentDate = $filter("usdateFormatter")($scope.PatientDepositsObj.PaymentDate, "-");



            var obj = {
                "UserId": $scope.PatientDepositsObj.UserId,
                "OrganizationId": $scope.PatientDepositsObj.OrganizationId,
                "PatientDepositId": $scope.PatientDepositsObj.PatientDepositId || 0,
                "PatientId": $scope.PatientDepositsObj.PatientId || 0,
                "ReceiptNo": "",
                "ReceiptId": 0,
                "DepositDate": ConvertedDate,
                "PaymentDate": PaymentDate,
                "DepositAmount": $scope.PatientDepositsObj.DepositAmount || 0,
                "DepositedByUserId": $scope.PatientDepositsObj.DepositedByUserId,
                "DepositedBy": $scope.PatientDepositsObj.DepositedBy,
                "UnBilledAmount": 0,
                "BilledAmount": 0,
                "DeleteInd": $scope.PatientDepositsObj.DeleteInd || "N",
                "AppointmentId": $scope.PatientDepositsObj.AppointmentId,
                "BillingProviderId": $scope.PatientDepositsObj.BillingProviderId,
                "DepositTypeId": $scope.PatientDepositsObj.DepositTypeId,
                "DepositType": $scope.PatientDepositsObj.DepositTypeName,
                "PaymentMethodId": $scope.PatientDepositsObj.PaymentMethodId,
                "PaymentMethodName": $scope.PatientDepositsObj.PaymentMethodName,
                "ChequeNumber": $scope.PatientDepositsObj.ChequeNumber,
                "CardNumber": "",
                "OnlineTransactionNumber": $scope.PatientDepositsObj.OnlineTransactionNumber,
                "CardName": "",
                "CardExpiry": "",
                "Notes": $scope.PatientDepositsObj.Notes,
                "BatchNumber": $scope.PatientDepositsObj.BatchNumber,
                "OrganizationFacilityId": $scope.PatientDepositsObj.OrganizationFacilityId,
                "FacilityName": $scope.PatientDepositsObj.FacilityName,
                "IsConsent": $scope.PatientDepositsObj.IsConsent,
                "IsDepositPrint": $scope.PatientDepositsObj.IsDepositPrint,
                "IsEmail": $scope.PatientDepositsObj.IsEmail,
                "DepositStatusId": $scope.PatientDepositsObj.DepositStatusId,
                "DepositStatus": $scope.PatientDepositsObj.DepositStatus,
                "PageSize": $scope.PatientDepositsObj.PageSize,
                "PageNumber": $scope.PatientDepositsObj.PageNumber,
                "PatientDepositPaymodeList": $scope.PatientDepositsObj.PatientDepositPaymodeList || []
            };

            eHnoteInsuranceService.AddUpdatePatientDepositAmount(obj).then(function (resp) {
                if (resp.data.Status === "Success") {

                    if (obj.PatientDepositId === 0) {
                        alertify.success("Added Successfully");
                    } else {
                        alertify.success("Updated Successfully");
                    }
                    $scope.getPatientDepositAmountById();
                    $scope.SelectedPatientDetails.DepositsObj = angular.copy($scope.PatientDepositsObj) || "";



                    $scope.SelectedPatientDetails.PatientObj = "";
                    $scope.SelectedPatientDetails.DepositsObj = "";

                    /*  $scope.AllocatePaymentDeposite();*/


                    $scope.IsShowPatietnPaymentPopup = true;
                    $scope.PatientPaymentObj = angular.copy($scope.GetPatientpaymentObj());
                    $scope.PatientPaymentObj.AppointmentId = $scope.PatientDepositsObj.AppointmentId;
                    $scope.PatientPaymentObj.ReceiptNo = resp.data.ReceiptNo;
                    $scope.PatientPaymentObj.PaymentMethodId = $scope.PatientDepositsObj.PaymentMethodId;
                    $scope.PatientPaymentObj.PaymentMethodName = $scope.PatientDepositsObj.PaymentMethodName;
                    $scope.PatientPaymentObj.DepositDate = ConvertedDate;
                    $scope.PatientPaymentObj.DepositDate = $filter('date')($scope.PatientPaymentObj.DepositDate, "MM-dd-yyyy");
                    $scope.PatientPaymentObj.PatientDepositId = resp.data.PatientDepositId;
                    $scope.PatientPaymentObj.DepositTypeId = $scope.PatientDepositsObj.DepositTypeId;
                    $scope.PatientPaymentObj.DepositTypeName = $scope.PatientDepositsObj.DepositTypeName;
                    $scope.PatientPaymentObj.DepositAmount = $scope.PatientDepositsObj.DepositAmount;
                    $scope.PatientPaymentObj.Notes = $scope.PatientDepositsObj.Notes;
                    $scope.PatientPaymentObj.BilledAmount = 0;
                    $scope.PatientPaymentObj.UnBilledAmount = $scope.PatientDepositsObj.DepositAmount;

                    $scope.GetPatientPaymentsList();

                    console.log("GetPatientPaymentsList call5");
                    $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());
                    $scope.SearchObj = angular.copy($scope.getSearchObj());

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        };

        $scope.EditcalculateLineItemPatientTotals = function () {
            var totalPatientBalance = 0, totalWriteOffAmt = 0, totalPatientPaymentBlsAmt = 0, totalPatientBalancesAmt = 0;
            angular.forEach($scope.PatientClaimList, function (Aitem) {
                let totalPaymentAmount = 0;
                let totalWriteOffAmount = 0;
                let totalBalanceAmount = 0;
                angular.forEach(Aitem.ClaimPatientResponsibility, function (sitem) {


                    var CurrentPatientBalance = parseFloat(sitem.PatientBalance) || 0;
                    var CurrentPatientPaymentAmount = parseFloat(sitem.PatientPaymentAmount) || 0;
                    var CurrentWriteOffAmount = parseFloat(sitem.WriteOffAmount) || 0;
                    var CurrentPreviousPaymentAmount = parseFloat(sitem.PreviousPaymentAmount) || 0;
                    var CurrentTotalChargeAmount = parseFloat(sitem.TotalChargeAmount) || 0;
                    var CurrentInsuranceBalance = parseFloat(sitem.InsuranceBalance) || 0;
                    //sitem.PatientBalance = sitem.PatientBalance || 0;

                    if (!sitem.IsEditMode) {
                        //sitem.PatientBalance = CurrentTotalChargeAmount - (CurrentPatientPaymentAmount + CurrentWriteOffAmount + CurrentInsuranceBalance);
                        CurrentPatientBalance = CurrentTotalChargeAmount - (CurrentPatientPaymentAmount + CurrentWriteOffAmount + CurrentInsuranceBalance);
                    }




                    sitem.CurrentPatientBalance = CurrentPatientBalance;

                    if (CurrentWriteOffAmount == 0) {
                        sitem.AdjsutmentReasonDescription = "";
                        sitem.AdjustmentReasonCode = "";
                        sitem.AdjustmentReasonCodeId = 0;
                    }
                    sitem.TotalBalance = CurrentPatientBalance + CurrentInsuranceBalance;
                    var CurrentTotalBalance = parseFloat(sitem.TotalBalance) || 0;
                    totalBalanceAmount += CurrentTotalBalance;
                    totalPatientBalance += CurrentPatientBalance;
                    totalPaymentAmount += CurrentPatientPaymentAmount;
                    totalWriteOffAmount += CurrentWriteOffAmount;
                });
                Aitem.TotalPatientBalance = totalPatientBalance;
                Aitem.TotalPatientPayment = totalPaymentAmount;
                Aitem.TotalWriteOffAmount = totalWriteOffAmount;
                Aitem.TotalBalance = totalBalanceAmount;
                totalPatientPaymentBlsAmt += totalPaymentAmount;
                totalPatientBalancesAmt += totalPatientBalance;
                totalWriteOffAmt += totalWriteOffAmount;
            });

            $scope.mainPaymentObject.TotalPatientPaymentBalance = totalPatientPaymentBlsAmt;
            $scope.mainPaymentObject.TotalAdjustmentAmount = totalWriteOffAmt;
            $scope.mainPaymentObject.TotalPatientBalanceAmount = totalPatientBalancesAmt;
            $scope.PatientPaymentObj.BilledAmount = $scope.mainPaymentObject.TotalPatientPaymentBalance;
            $scope.PatientPaymentObj.UnBilledAmount = totalPatientBalancesAmt;
            $scope.PatientDepositsObj.BilledAmount = $scope.mainPaymentObject.TotalPatientPaymentBalance;
            $scope.PatientDepositsObj.UnBilledAmount = totalPatientBalancesAmt;

        }


        $scope.changePaymentAmount = function (item, mainitem, typeid) {

            var PaymentAmount = parseFloat(item.PatientPaymentAmount) || 0;
            var PreviousPaymentAmount = parseFloat(item.PreviousPaymentAmount) || 0;
            var PatientBalance = parseFloat(item.PatientBalance) || 0;
            var PreviousPatientBalance = parseFloat(item.PreviousPatientBalance) || 0;
            var WriteOffAmount = parseFloat(item.WriteOffAmount) || 0;
            var CurrentTotalChargeAmount = parseFloat(item.TotalChargeAmount) || 0;
            var CurrentInsuranceBalance = parseFloat(item.InsuranceBalance) || 0;
            var UnBilledAmount = parseFloat($scope.PatientPaymentObj.UnBilledAmount) || 0;
            var AdjustmentAmount = PatientBalance - PaymentAmount;
            AdjustmentAmount = parseFloat(AdjustmentAmount.toFixed(2)) || 0;
            typeid = typeid || 0;

            if (PaymentAmount > PatientBalance) {
                item.PatientPaymentAmount = 0;
                alertify.error("Payment amount cannot be higher than allowed amount");
                //return false;
            }

            else if (WriteOffAmount > AdjustmentAmount) {
                item.WriteOffAmount = 0;
                item.IsAdjCodeEnable = false;
                alertify.error("The adjustment amount cannot exceed. Please review the values and try again.");
                //return false;
            }


            $scope.mainPaymentObject.TotalPayableAmount = 0;

            $scope.calculateLineItemPatientTotals('allocation');
        }
        $scope.processRefund = function (item) {

            var modalInstance = $uibModal.open({
                templateUrl: "AddRefundPopUp.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "windowClass": "",

            });
            modalInstance.result.then(function (selectedItem) {

            }, function () {

            });
            $scope.ClosedPopup = function () {
                modalInstance.dismiss('Cancel');
            };
        }

        $scope.openDepositsPopup = function () {

            $scope.Patientobj = {
                "PatientId": $scope.Selectobj.PatientId || 0,
                "selectedDeposits": [],
                "PatientDepositPaymodeList": $scope.PatientPaymentObj.PatientDepositPaymodeList
            };
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/DepositsPopUp.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "Patientobj": function () { return $scope.Patientobj; }
                },
                "windowClass": "modal__ninety--",
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMasterDataService, eHnoteInsuranceService, Patientobj) {

                    $scope.selectedDeposits = Patientobj.selectedDeposits || []

                    var doctorinfo = eHnoteMasterDataService.getUserInfo();
                    $scope.UserId = eHnoteMasterDataService.getLoginId();
                    $scope.ParenthospitalId = 0;
                    $scope.SelectedDeposit = false;
                    $scope.HospitalId = 0;
                    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
                        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
                    };
                    $scope.uibclose = function () {
                        $uibModalInstance.close("cancel");
                    };

                    $scope.GetPatientDepositsLitsObj = function () {
                        return {
                            "DepositFrom": "",
                            "DepositTo": "",
                            "PatientId": Patientobj.PatientId,
                            "OrganizationId": $scope.HospitalId,
                            "PaymentModeId": 0,
                            "PageSize": 10,
                            "PageNumber": 1,
                            "TransactionNumber": "",
                            "Type": 1
                        }
                    };


                    $scope.SearchPatientDepositsObj = angular.copy($scope.GetPatientDepositsLitsObj());


                    $scope.getPatientDepositAmountById = function () {
                        var obj = {
                            "DepositFrom": $scope.SearchPatientDepositsObj.DepositFrom || "",
                            "DepositTo": $scope.SearchPatientDepositsObj.DepositTo || "",
                            "PatientId": $scope.SearchPatientDepositsObj.PatientId,
                            "OrganizationId": $scope.SearchPatientDepositsObj.OrganizationId,
                            "PaymentModeId": 0,
                            "PageSize": 100,
                            "PageNumber": 1,
                            "TransactionNumber": "",
                            "SortBy": "Asc",
                        };
                        obj.PaymentModeId = parseInt(obj.PaymentModeId);
                        if (obj.DepositFrom != "") {
                            obj.DepositFrom = $filter("usdateFormatter")(obj.DepositFrom, "-");
                        }
                        if (obj.DepositTo != "") {
                            obj.DepositTo = $filter("usdateFormatter")(obj.DepositTo, "-");
                        }
                        eHnoteInsuranceService.GetPatientDepositAmountList(obj).then(function (resp) {
                            $scope.PatientDepositsListArray = [];
                            $scope.PatientTotalUnallocated = 0;
                            if (resp.data.status === "Success") {
                                $scope.PatientDepositsListArray = resp.data.rows || [];
                                if ($scope.PatientDepositsListArray.length > 0) {
                                    angular.forEach($scope.PatientDepositsListArray, function (item) {
                                        item.IsChecked = false;
                                        var uniqueMap = {};

                                        (item.PatientDepositPaymodeList || []).forEach(function (bitem) {
                                            var original = bitem.DepositTypeName || "";
                                            var key = original.replace(/\s+/g, '').toLowerCase();
                                            if (!uniqueMap[key]) {
                                                uniqueMap[key] = original; // keep first occurrence
                                            }
                                        });

                                        item.DepositTypeNames = Object.values(uniqueMap).join(',') || item.DepositTypeName || "";
                                        if (item.UnBilledAmount >= 0) {
                                            $scope.PatientTotalUnallocated += item.UnBilledAmount;
                                            $scope.PatientTotalUnallocated = parseFloat($scope.PatientTotalUnallocated.toFixed(2));
                                        }
                                    });

                                }
                                $scope.PtDepositsDataArray = [];
                                $scope.PtDepositsDataArray = $scope.PatientDepositsListArray.filter(item => item.DepositStatusId != 2);

                                if ($scope.PtDepositsDataArray.length > 0) {
                                    angular.forEach($scope.PtDepositsDataArray, function (item) {
                                        item.IsChecked = false;
                                        var match = Patientobj.PatientDepositPaymodeList.some(function (pm) {
                                            return pm.PatientDepositId === item.PatientDepositId;
                                        });

                                        if (match) {
                                            item.IsChecked = true;
                                        }
                                    });
                                }
                            } else {
                                alertify.error(resp.data.Message);
                            }
                        });
                    }


                    $scope.IsCheckAllEras = function (ischeck) {
                        if (ischeck) {
                            angular.forEach($scope.PtDepositsDataArray, function (item) {
                                item.UnBilledAmount = item.UnBilledAmount || 0;
                                if (item.UnBilledAmount != 0) {
                                    item.IsChecked = true;
                                }

                            });
                        }
                        else {
                            angular.forEach($scope.PtDepositsDataArray, function (item) {
                                item.IsChecked = false;
                            });
                        }

                    }

                    $scope.getPatientDepositAmountById();

                    $scope.SelectedDepositslist = function () {


                        var filterDeposits = $filter("filter")($scope.PtDepositsDataArray, { "IsChecked": true }, true) || [];
                        if (filterDeposits.length == 0) {
                            alertify.error("Please Select a Deposit.");
                            return false;
                        }
                        let obj = {
                            "Mainlist": filterDeposits || [],
                            "IsPatientDeposit": true
                        }
                        $uibModalInstance.close(obj);
                    }

                    $scope.SelectPatientPayments = function (item) {
                        let obj = {
                            "Mainobj": item,
                            "IsPatientDeposit": true
                        }
                        $uibModalInstance.close(obj);
                    }
                }
            });

            mInstanceAdd.result.then(function (resp) {

                if (resp == "cancel") {
                    $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                }
                else {
                    var totalUnbilledDepositAmt = 0;
                    //$scope.PatientPaymentObj.PatientDepositPaymodeList.forEach(function (item) {
                    //    if (item.IsCollectPayment === false) {
                    //        $scope.PatientPaymentObj.UnBilledAmount -= item.DepositAmount || 0;
                    //        $scope.PatientPaymentObj.BilledAmount -= item.BilledAmount || 0;
                    //        totalUnbilledDepositAmt += item.DepositAmount || 0;
                    //        $scope.mainPaymentObject.TotalPayableAmount += item.DepositAmount || 0;
                    //        //$scope.mainPaymentObject.TotalPatientPaymentBalance -= item.DepositAmount || 0;
                    //    }
                    //});

                    //if ($scope.mainPaymentObject.TotalPayableAmount === 0) {
                    //    $scope.mainPaymentObject.TotalPayableAmount = $scope.mainPaymentObject.TotalFinalPatientBalanceAmount;
                    //}
                    //$scope.PatientPaymentObj.PatientDepositPaymodeList.forEach(function (item) {
                    //    $scope.mainPaymentObject.TotalPatientBalanceAmount += item.DepositAmount || 0;
                    //    $scope.mainPaymentObject.TotalPaidAmount -= item.DepositAmount || 0;

                    //});
                    $scope.PatientPaymentObj.PatientDepositPaymodeList = [];
                    $scope.PatientPaymentObj.UnBilledAmount = 0;
                    var remainingBalance = angular.copy($scope.mainPaymentObject.TotalPayableAmount);
                    //$scope.PatientPaymentObj.PatientDepositPaymodeList = $scope.PatientPaymentObj.PatientDepositPaymodeList.filter(function (item) {
                    //    return item.IsCollectPayment === true;
                    //});

                    angular.forEach(resp.Mainlist, function (depositItem) {
                        if (depositItem.IsChecked) {
                            let unbilled = depositItem.UnBilledAmount || 0;
                            let billed = depositItem.BilledAmount || 0;

                            if (unbilled <= 0) {
                                alertify.error("There is no Available Deposit Balance.");
                                return;
                            }

                            let selectedAmount = Math.min(remainingBalance, unbilled);
                            if (selectedAmount <= 0) return;

                            let alreadyExists = $scope.PatientPaymentObj.PatientDepositPaymodeList.some(function (d) {
                                return d.PatientDepositId === depositItem.PatientDepositId;
                            });

                            if (!alreadyExists) {
                                let depositCopy = angular.copy(depositItem);
                                depositCopy.PaymentMethodId = 14;
                                depositCopy.PaymentMethodName = "Patient Deposits";
                                depositCopy.PatientDepositPaymodeListId = 0;
                                depositCopy.DepositAmount = selectedAmount;
                                depositCopy.IsCollectPayment = true;

                                $scope.PatientPaymentObj.PatientDepositPaymodeList.push(depositCopy);

                                $scope.PatientPaymentObj.UnBilledAmount += selectedAmount;//($scope.PatientPaymentObj.UnBilledAmount || 0) + 

                                $scope.PatientPaymentObj.BilledAmount += billed;

                                $scope.PatientDepositDetails.DepositNumber = depositItem.ReceiptNo || "";
                                $scope.PatientDepositDetails.DepositAmount = selectedAmount;
                                $scope.PatientDepositDetails.DepositDate = $filter('date')(depositItem.DepositDate, "MM-dd-yyyy") || "";

                                $scope.PaymentMethodObj = {
                                    PaymentMethodId: 14,
                                    PaymentMethodName: "Patient Deposits",
                                    DepositAmount: selectedAmount,
                                    ReferenceNumber: '',
                                    IsDepositAdded: false,
                                    DeleteInd: "N",
                                    PatientDepositId: depositItem.PatientDepositId || 0,
                                    CardNumber: '',
                                    CardType: '',
                                    CardtypeId: 0,
                                    PatientDepositAmt: selectedAmount,
                                    PatientDepositDate: $scope.PatientDepositDetails.DepositDate,
                                    DepositNumber: $scope.PatientDepositDetails.DepositNumber
                                };

                                remainingBalance -= selectedAmount;
                                $scope.SelectedDeposit = true;
                            }

                        }


                    });
                    /*   $scope.mainPaymentObject.TotalPayableAmount = parseFloat($scope.mainPaymentObject.TotalFinalPatientBalanceAmount) - $scope.PatientPaymentObj.UnBilledAmount;*/
                    /*   $scope.mainPaymentObject.TotalPatientPaymentBalance = $scope.PatientPaymentObj.UnBilledAmount || 0;*/
                    $scope.mainPaymentObject.TotalPaidAmount = $scope.PatientPaymentObj.UnBilledAmount || 0;
                    /*   $scope.mainPaymentObject.TotalPatientBalanceAmount = parseFloat($scope.mainPaymentObject.TotalFinalPatientBalanceAmount) - $scope.mainPaymentObject.TotalPaidAmount;*/


                    var totalPatientBal = parseFloat($scope.mainPaymentObject.TotalPayableAmount) || 0;
                    var totalPatientPaidAmt = parseFloat($scope.mainPaymentObject.TotalPaidAmount) || 0;
                    var totalAdjustmentBalanceAmount = parseFloat($scope.mainPaymentObject.TotalAdjustmentAmount) || 0;

                    console.log(totalPatientBal + "__totalPatientBal_" + totalPatientPaidAmt + "__totalPatientPaidAmt_" + totalAdjustmentBalanceAmount + "__totalAdjustmentAMt");
                    $scope.mainPaymentObject.TotalPatientBalanceAmount = totalPatientBal - totalPatientPaidAmt;
                    $scope.mainPaymentObject.TotalPatientBalanceAmount = parseFloat($scope.mainPaymentObject.TotalPatientBalanceAmount.toFixed(2));

                    if ($scope.mainPaymentObject.TotalPaidAmount == $scope.mainPaymentObject.TotalPayableAmount) {
                        $scope.applyDeposit();
                    }

                }

            }, function () {

            });




            //mInstanceAdd.result.then(function (resp) {
            //    $scope.SelectedDeposit = true;           
            //    //sourceDeposit.DepositAmount = Math.min($scope.mainPosObject.PatientBalanceAmount, totalDepositAmount);
            //    //var alreadyExists = $scope.PaymentsObj.PatientDepositPaymodeList.some(function (d) {
            //    //    return d.PatientDepositId === resp.Mainobj.PatientDepositId;
            //    //});

            //    //if (!alreadyExists) {
            //    //    $scope.PaymentsObj.PatientDepositPaymodeList.push(sourceDeposit);
            //    //}

            //    //$scope.PaymentsObj.PaymentAmount += sourceDeposit.DepositAmount;



            //    if (resp.Mainobj != undefined) {
            //        if (resp.Mainobj.UnBilledAmount <= 0) {
            //            alertify.error("There is no Available Deposit Balance.");
            //            $scope.PaymentMethodObj.PaymentMethodId = 1;
            //            $scope.PaymentMethodObj.PaymentMethodName = "Cash";
            //            $scope.SelectedDeposit = false;
            //        }
            //        else {

            //            if ($scope.selectedDeposits.includes(resp.Mainobj.PatientDepositId)) {

            //                alertify.error("This deposit is already selected!");
            //                return false;
            //            } else {

            //                $scope.selectedDeposits.push(resp.Mainobj.PatientDepositId);
            //                $scope.PatientDepositDetails.DepositNumber = resp.Mainobj.ReceiptNo || "";
            //                $scope.PatientDepositDetails.DepositAmount = resp.Mainobj.UnBilledAmount || "";
            //                $scope.PatientPaymentObj.BilledAmount = resp.Mainobj.BilledAmount || 0;
            //               $scope.PatientPaymentObj.UnBilledAmount += resp.Mainobj.UnBilledAmount || 0;
            //                $scope.PatientDepositDetails.DepositDate = $filter('date')(resp.Mainobj.DepositDate, "MM-dd-yyyy") || "";

            //                $scope.PatientPaymentObj.PatientId = resp.Mainobj.PatientId || "";
            //                $scope.PatientPaymentObj.PatientDepositId = resp.Mainobj.PatientDepositId || "";

            //                var SelectedDepositAmount = resp.Mainobj.UnBilledAmount || 0;

            //                $scope.TotalPaymentAmt = 0;
            //                $scope.PatientPaymentObj.PatientDepositPaymodeList = $scope.PatientPaymentObj.PatientDepositPaymodeList || [];

            //                if (resp.Mainobj.PatientDepositPaymodeList && resp.Mainobj.PatientDepositPaymodeList.length > 0) {

            //                    var sourceDeposit = angular.copy(resp.Mainobj.PatientDepositPaymodeList[0]);

            //                    sourceDeposit.PatientDepositPaymodeListId = 0;
            //                    sourceDeposit.DepositAmount = Math.min($scope.TotalPatientBalanceAmount, SelectedDepositAmount);
            //                    var alreadyExists = $scope.PatientPaymentObj.PatientDepositPaymodeList.some(function (d) {
            //                        return d.PatientDepositId === resp.Mainobj.PatientDepositId;
            //                    });

            //                    if (!alreadyExists) {
            //                        $scope.PatientPaymentObj.PatientDepositPaymodeList.push(sourceDeposit);
            //                    }
            //                }


            //               // $scope.CalculateTotalPayments();
            //                if (resp.Mainobj.PatientDepositPaymodeList.length > 0) {
            //                    var filtredArray = $filter("filter")(resp.Mainobj.PatientDepositPaymodeList, { "PatientDepositId": resp.Mainobj.PatientDepositId }, true) || [];
            //                    if (filtredArray.length > 0) {
            //                        $scope.PaymentMethodObj.PatientDepositPaymodeListId = filtredArray[0].PatientDepositPaymodeListId;
            //                    }
            //                }

            //                $scope.PaymentMethodObj.PaymentMethodId = 14;
            //                $scope.PaymentMethodObj.PaymentMethodName = "Patient Deposits";
            //                $scope.PaymentMethodObj.DepositAmount = SelectedDepositAmount;
            //                $scope.PaymentMethodObj.ReferenceNumber = '';
            //                $scope.PaymentMethodObj.IsDepositAdded = false;
            //                $scope.PaymentMethodObj.DeleteInd = "N";
            //                $scope.PaymentMethodObj.PatientDepositId = resp.Mainobj.PatientDepositId || 0;
            //                $scope.PaymentMethodObj.CardNumber = '';
            //                $scope.PaymentMethodObj.CardType = '';
            //                $scope.PaymentMethodObj.CardtypeId = 0;
            //                $scope.PaymentMethodObj.PatientDepositAmt = $scope.PatientDepositDetails.DepositAmount || 0;
            //                $scope.PaymentMethodObj.PatientDepositDate = $scope.PatientDepositDetails.DepositDate || 0;
            //                $scope.PaymentMethodObj.DepositNumber = $scope.PatientDepositDetails.DepositNumber || 0;


            //            }
            //        }
            //    }

            //    if (resp == "cancel") {
            //        $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
            //    }


            //}, function () {

            //});
        };

        //$scope.VoidPatientDeposit = function (item, type) {

        //   /* var ConvertedDate = $filter("usdateFormatter")(item.DepositDate, "-");*/


        //    alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Void the Patient Deposit?</h4>", function () {

        //        var obj = {
        //            "UserId": $scope.PatientDepositsObj.UserId,
        //            "OrganizationId": $scope.PatientDepositsObj.OrganizationId,
        //            "PatientDepositId": item.PatientDepositId || 0,
        //            "PatientId": item.PatientId || 0,
        //            "ReceiptNo": "",
        //            "ReceiptId": 0,
        //            "DepositDate": ConvertedDate,
        //            "PaymentDate": PaymentDate,
        //            "DepositAmount": item.DepositAmount || 0,
        //            "DepositedByUserId": $scope.PatientDepositsObj.DepositedByUserId,
        //            "DepositedBy": item.DepositedBy,
        //            "UnBilledAmount": item.UnBilledAmount,
        //            "BilledAmount": 0,
        //            "DeleteInd": $scope.PatientDepositsObj.DeleteInd || "N",
        //            "AppointmentId": item.AppointmentID,
        //            "BillingProviderId": item.BillingProviderId,
        //            "DepositTypeId": item.DepositTypeId,
        //            "DepositType": item.DepositTypeName,
        //            "PaymentMethodId": item.PaymentMethodId,
        //            "PaymentMethodName": item.PaymentMethodName,
        //            "ChequeNumber": $scope.PatientDepositsObj.ChequeNumber,
        //            "CardNumber": "",
        //            "OnlineTransactionNumber": $scope.PatientDepositsObj.OnlineTransactionNumber || '',
        //            "CardName": "",
        //            "CardExpiry": "",
        //            "Notes": item.Notes,
        //            "BatchNumber": item.BatchNumber,
        //            "OrganizationFacilityId": item.OrganizationFacilityId,
        //            "FacilityName": item.FacilityName,
        //            //"IsConsent": $scope.PatientDepositsObj.IsConsent,
        //            //"IsDepositPrint": $scope.PatientDepositsObj.IsDepositPrint,
        //            //"IsEmail": $scope.PatientDepositsObj.IsEmail,
        //            "DepositStatusId": 2,
        //            "DepositStatus": "Void Deposit",
        //            "PageSize": $scope.PatientDepositsObj.PageSize,
        //            "PageNumber": $scope.PatientDepositsObj.PageNumber,
        //            "PatientDepositPaymodeList": item.PatientDepositPaymodeList || [],
        //            /*"PatientVoidDeposit": 1,*/
        //        }

        //        eHnoteInsuranceService.AddUpdatePatientDepositAmount(obj).then(function (resp) {
        //            if (resp.data.Status == "Success") {
        //                $scope.getPatientDepositAmountById();
        //            }
        //            $scope.ClearPatientDeposit();
        //        }, function (err) {

        //        });

        //       /* $scope.$apply();*/
        //    }, function () {

        //    });


        //}

        $scope.ViewVoidPatientDeposit = function () {

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "VoidDepositpopup.html",
                "backdrop": "static",
                "keyboard": false,
                //"size": "lg",
                "windowClass": "modal__ninety-- in",
                "resolve": {
                    "VoidList": function () { return $scope.VoidList; },
                },
                "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, VoidList) {

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.PtDepositsDataArray = [];
                    $scope.PtDepositsDataArray = VoidList;//.filter(item => item.DepositStatusId === 2)

                    $scope.IsShowVoidRemarks = null;
                    $scope.ShowVoidDepositRemarks = function (index) {
                        if ($scope.IsShowVoidRemarks === index) {
                            $scope.IsShowVoidRemarks = null;
                        } else {
                            $scope.IsShowVoidRemarks = index;
                        }
                    };

                }

            });

        }

        $scope.ViewPatientRefund = function () {

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "RefundListpopup.html",
                "backdrop": "static",
                "keyboard": false,
                //"size": "lg",
                "windowClass": "modal__ninety-- in",
                "resolve": {
                    "Refundlist": function () { return $scope.Refundlist; },
                },
                "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, Refundlist) {

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.Refundlist = [];
                    $scope.Refundlist = Refundlist || [];



                }

            });

        }

        $scope.RefundPatientDeposit = function (item, sitem) {

            var obj = {
                "AllCardTypes": $scope.AllCardTypes || [],
                "Masterrefundreasons": $scope.Masterrefundreasons || [],
                "AllUsersList": $scope.AllUsersList || [],
            }
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "RefundDepositpopup.html",
                "backdrop": "static",
                "size": "lg",
                "keyboard": false,
                "windowClass": "",
                "resolve": {
                    //"PatientDepositsListArray": function () { return $scope.PatientDepositsListArray; },
                    "mainobj": function () { return item; },
                    "obj": function () { return obj; },
                    "sitem": function () { return sitem; },

                },
                "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, mainobj, datapersistanceFactory, obj, eHnoteInsuranceService, sitem) {
                    sitem = sitem || '';
                    $scope.IsRefundDisable = false;
                    $scope.mainNMITransactionid = "";
                    if (sitem.NMITransactionId !== 0) {
                        $scope.mainNMITransactionid = sitem.OnlineTransactionNumber || "";
                    }

                    var mObj = datapersistanceFactory.getItem("masterDataArrays");
                    $scope.masterPaymentModes = [];
                    if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
                        $scope.masterPaymentModes = mObj.PaymentModes;
                        $scope.filterPaymentModes = function (item) {
                            return ![13, 14].includes(item.PaymentModeId);
                        };
                    };
                    var doctorinfo = eHnoteMasterDataService.getUserInfo();
                    $scope.UserId = eHnoteMasterDataService.getLoginId();
                    $scope.ParenthospitalId = 0;
                    $scope.HospitalId = 0;
                    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
                        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
                    };
                    $scope.mainobj = mainobj;
                    $scope.Masterrefundreasons = obj.Masterrefundreasons || [];
                    $scope.AllCardTypes = obj.AllCardTypes || [];
                    $scope.AllUsersList = obj.AllUsersList || [];

                    $scope.GetRefundpaymentObj = function () {
                        var obj = {
                            "UserId": $scope.UserId,
                            "RefundByUser": "",
                            "OrganizationId": $scope.HospitalId,
                            "PatientDepositId": $scope.mainobj.PatientDepositId || null,
                            "RefundDepositId": null,
                            "ReceiptNo": $scope.mainobj.ReceiptNo || "",
                            "ReceiptId": 0,
                            "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                            "RefundAmount": sitem.TransactionAmount || null, //$scope.mainobj.UnBilledAmount || null,
                            "RefundBy": "",
                            "DeleteInd": "N",
                            "AppointmentId": $scope.mainobj.AppointmentID || null,
                            "PatientId": $scope.mainobj.PatientId || null,
                            "RefundreasonId": null,
                            "Refundreason": null,
                            "Remarks": null,
                            "CardtypeId": null,
                            "Cardtype": "",
                            "RefundPaymentMethodId": null,
                            "RefundPaymentMethod": "",
                            "ReceiptNumber": "",
                            "ReferenceNumber": "",
                            "CardNumber": "",
                            "DepositStatus": "Refund",
                            "DepositStatusId": "3",
                            "Transactions": [],
                            "PaymentTransactionTypeId": 3,
                            "PaymentTransactionType": 'Refund'


                        }

                        return obj;
                    };


                    $scope.init = function () {

                        $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());

                        var filtredArray = $filter("filter")($scope.AllUsersList, { "DoctorID": $scope.UserId }, true) || [];
                        if (filtredArray.length > 0) {
                            $scope.RefundPaymentObj.RefundByUser = filtredArray[0].FullName || "";
                        }
                    }
                    $scope.init();

                    $scope.RefundPaymentObj.RefundPaymentMethodId = sitem.PaymentMethodId;
                    $scope.RefundPaymentObj.RefundPaymentMethod = sitem.PaymentMethodName;

                    if ($scope.RefundPaymentObj.RefundPaymentMethodId == 2 || $scope.RefundPaymentObj.RefundPaymentMethodId == 3) {
                        $scope.RefundPaymentObj.CardNumber = sitem.CardNumber;
                        $scope.RefundPaymentObj.CardtypeId = sitem.CardtypeId;
                        $scope.RefundPaymentObj.Cardtype = sitem.Cardtype;
                    }

                    $scope.changeRefund = function (id) {
                        var filtredArray = $filter("filter")($scope.Masterrefundreasons, { "RefundreasonId": id }, true) || [];
                        if (filtredArray.length > 0) {
                            $scope.RefundPaymentObj.Refundreason = filtredArray[0].Refundreason || "";
                        }
                    }
                    $scope.ChangePaymentMode = function (id) {
                        var filtredArray = $filter("filter")($scope.masterPaymentModes, { "PaymentModeId": id }, true) || [];
                        if (filtredArray.length > 0) {
                            $scope.RefundPaymentObj.RefundPaymentMethod = filtredArray[0].PaymentModeName || "";
                        }
                    }

                    $scope.PatientRefund = function () {


                        let Transactions = [];
                        $scope.RefundPaymentObj.RefundAmount = parseFloat($scope.RefundPaymentObj.RefundAmount) || null;
                        $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;

                        if ($scope.RefundPaymentObj.RefundAmount == null) {
                            alertify.error("Please Enter Refund Amount");
                            return;
                        }
                        if ($scope.RefundPaymentObj.RefundreasonId == null) {
                            alertify.error("Please Select Refund Reason");
                            return;
                        }
                        if ($scope.RefundPaymentObj.RefundAmount > $scope.mainobj.UnBilledAmount) {
                            alertify.error("RefundAmount exceeds the UnBilledAmount. Please Enter the Lesser Amount.");
                            return;
                        }
                        if ($scope.RefundPaymentObj.RefundAmount != null) {
                            let obj3 = {

                                "UserId": $scope.UserId,
                                "PatientId": $scope.mainobj.PatientId || null,
                                "RefundDepositId": null,
                                "RefundTransactionId": 0,
                                "PatientDepositId": $scope.mainobj.PatientDepositId,
                                "OrganizationId": $scope.HospitalId,
                                "TransactionDate": $filter('date')($scope.RefundPaymentObj.RefundDate, "MM-dd-yyyy"),
                                "TransactionAmount": -+$scope.RefundPaymentObj.RefundAmount,
                                "RefundAmount": -+$scope.RefundPaymentObj.RefundAmount,
                                "TransactionSourceId": 3,
                                "TransactionSource": "Patient",
                                "DeleteInd": "N",

                            }
                            Transactions.push(obj3);
                        }

                        var params = {
                            "UserId": $scope.UserId,
                            "OrganizationId": $scope.HospitalId,
                            "DepositStatus": "Refund",
                            "DepositStatusId": "3",
                            "PatientDepositId": $scope.RefundPaymentObj.PatientDepositId || null,
                            "RefundDepositId": null,
                            "ReceiptNo": $scope.RefundPaymentObj.ReceiptNo || "",
                            "RefundDate": $filter('date')($scope.RefundPaymentObj.RefundDate, "MM-dd-yyyy"),
                            "RefundAmount": $scope.RefundPaymentObj.RefundAmount || null,
                            "RefundByUserId": $scope.UserId,
                            "RefundByUser": $scope.RefundPaymentObj.RefundByUser || "",
                            "DeleteInd": "N",
                            "AppointmentId": $scope.RefundPaymentObj.AppointmentId || null,
                            "PatientId": $scope.RefundPaymentObj.PatientId || null,
                            "RefundreasonId": $scope.RefundPaymentObj.RefundreasonId || null,
                            "RefundReason": $scope.RefundPaymentObj.Refundreason || "",
                            "Remarks": $scope.RefundPaymentObj.Remarks || "",
                            "CardtypeId": $scope.RefundPaymentObj.CardtypeId || "",
                            "RefundPaymentMethodId": $scope.RefundPaymentObj.RefundPaymentMethodId || "",
                            "RefundPaymentMethod": $scope.RefundPaymentObj.RefundPaymentMethod || "",
                            "RefundStatus": "Initiated",
                            "RefundStatusId": "1",
                            "ReferenceNumber": $scope.RefundPaymentObj.ReferenceNumber || "",
                            "CardNumber": $scope.RefundPaymentObj.CardNumber || "",
                            "Transactions": Transactions || [],
                            "PatientDepositPaymodeListId": sitem.PatientDepositPaymodeListId,
                            "TransactionId": sitem.TransReciptNo,
                            "PaymentTransactionTypeId": 3,
                            "PaymentTransactionType": 'Refund'



                        }

                        console.log(JSON.stringify(params));


                        eHnoteInsuranceService.AddUpdatePatientDepositRefund(params).then(function (resp) {
                            if (resp.data.Status == "Success") {
                                $uibModalInstance.close("cancel");
                            }

                        }, function (err) {

                        });
                    }


                    $scope.navtoNMIPatientRefund = function (item) {
                        $scope.RefundPaymentObj.RefundAmount = $scope.RefundPaymentObj.RefundAmount || null;
                        $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
                        if ($scope.RefundPaymentObj.RefundAmount == null) {
                            alertify.error("Please Enter Refund Amount");
                            return;
                        }
                        if ($scope.RefundPaymentObj.RefundreasonId == null) {
                            alertify.error("Please Select Refund Reason");
                            return;
                        }

                        if ($scope.mainNMITransactionid == "") {
                            alertify.error("you cannot perform void, as TransactionId is empty");
                            return false;
                        }
                        $scope.RefundPaymentObj.Remarks = $scope.RefundPaymentObj.Remarks || "";
                        if ($scope.RefundPaymentObj.Remarks == "" || $scope.RefundPaymentObj.Remarks == null) {
                            alertify.error("Please enter Refund remarks.");
                            return false;
                        }

                        $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                        $scope.mainNMITransactionObj.NMITransactionId = 0;
                        $scope.mainNMITransactionObj.UserId = $scope.UserId;
                        $scope.mainNMITransactionObj.PatientId = $scope.mainobj.PatientId;
                        $scope.mainNMITransactionObj.OrganizationId = $scope.mainobj.OrganizationId;
                        $scope.mainNMITransactionObj.PaymentAmount = $scope.mainobj.PatientDepositPaymodeList[0].DepositAmount;
                        $scope.mainNMITransactionObj.MerchentId = $scope.mainNMITransactionObj.MerchentId;
                        $scope.mainNMITransactionObj.MerchentName = $scope.mainNMITransactionObj.MerchentName;
                        $scope.mainNMITransactionObj.CardHolderName = $scope.mainobj.PatientFullName || "";
                        $scope.mainNMITransactionObj.PatientEmail = $scope.mainobj.PatientEmailId || "";
                        $scope.mainNMITransactionObj.PatientMobile = $scope.mainobj.PatientMobile || "";

                        if ($scope.mainNMITransactionObj.PatientMobile != "") {
                            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                            $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                        }

                        $scope.mainNMITransactionObj.PatientMrNo = $scope.mainobj.PatientDisplayId || "";
                        $scope.mainNMITransactionObj.OrderId = "";
                        $scope.mainNMITransactionObj.OrderDescription = $scope.RefundPaymentObj.Refundreason || "";
                        $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                        $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.mainobj.PatientDepositPaymodeList[0].BillPaymentTypeId || 0;
                        $scope.mainNMITransactionObj.BillPaymentType = $scope.mainobj.PatientDepositPaymodeList[0].BillPaymentType || "";
                        $scope.mainNMITransactionObj.ResponseId = 0;
                        $scope.mainNMITransactionObj.ResponseCode = "";
                        $scope.mainNMITransactionObj.ResponseText = "";
                        $scope.mainNMITransactionObj.Status = "";
                        $scope.mainNMITransactionObj.TransactionTypeId = 5;
                        $scope.mainNMITransactionObj.TransactionType = "refund";
                        $scope.mainNMITransactionObj.DeleteInd = "N";
                        $scope.mainNMITransactionObj.Type = "refund";
                        $scope.mainNMITransactionObj.AppointmentId = $scope.mainobj.AppointmentId || 0;
                        $scope.mainNMITransactionObj.VisitId = $scope.mainobj.VisitId || 0;


                        eHnotePaymentGatewayService.NMIPaymentTransactionRefund($scope.mainNMITransactionObj).then(function (resp) {
                            var res = resp.data || {};
                            console.log(res)
                            if (res.Status == "Success") {
                                alertify.success(res.Status);

                                $scope.PatientRefund();
                            }
                        })

                    };

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }

            });

            mInstanceAdd.result.then(function () {

                $scope.getPatientDepositAmountById();
                $scope.ViewDepositScreen = false;
                $scope.ClearPatientDeposit();

            }, function () { });
        }


        //$scope.ShowVoidRemarksPopover = {
        //    templateUrl: 'ViewRemarksListRefPopovertemplate.html'
        //};

        $scope.CalculateDepositAmount = function () {
            let count = 0;
            let hasInvalidAmount = false;

            angular.forEach($scope.PatientPaymentObj.PatientDepositPaymodeList, function (item) {
                if (item.DeleteInd !== 'Y') {
                    let deposit = parseFloat(item.DepositAmount) || 0;
                    if (count + deposit > $scope.mainPaymentObject.TotalPatientBalanceAmount) {
                        item.DepositAmount = null;
                        hasInvalidAmount = true;
                    } else {
                        count += deposit;
                    }
                }
            });

            $scope.CalculateTotalPayments();
            if (hasInvalidAmount) {
                alertify.error("Payment amount should not be greater than patient balance!");
            }
        };

        $scope.TransferPatientDeposit = function (item) {

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "TranferDepositpopup.html",
                "backdrop": "static",
                "keyboard": false,
                "size": "lg",
                "windowClass": " ",
                "resolve": {
                    "item": function () { return item; },
                    "OrganizationId": function () { return $scope.HospitalId; },
                },
                "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, eHnotePatientDataService, eHnoteUserDataService, OrganizationId, item) {

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    var doctorinfo = eHnoteMasterDataService.getUserInfo();
                    $scope.UserId = eHnoteMasterDataService.getLoginId();
                    $scope.ParenthospitalId = 0;
                    $scope.HospitalId = 0;
                    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
                        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
                    };
                    $scope.UserRoleId = doctorinfo.doctordata.User[0].RoleId;
                    function getSelectedPatientObj() {
                        var obj = {
                            "SearchText": "",
                            "PatientId": 0,
                            "SearchTypeId": 2,
                            "ScreenType": "",
                            "OrganizationFacilityId": "",
                            "PatientMRNo": "",
                            "DOB": ""
                        }
                        return obj;
                    };
                    $scope.PatientSearchObj = getSelectedPatientObj();

                    $scope.LoadPatientListSearch = function (val) {


                        if (val == undefined || val == null || val == "") {
                            $scope.AllPatientList = [];
                            $scope.PatientSearchObj.PatientId = 0;
                            $scope.ShowPatientDetailsDrop = false;
                            return false;
                        }
                        var param = {
                            "PageSize": 21,
                            "UserId": "",
                            "PageNumber": 1,
                            "SearchText": "",
                            "Count": 0,
                            "SearchDetails": { "listdocpatients": "Y" },
                            "EndAge": 0,
                            "StartAge": 0,
                            "StartDate": "",
                            "EndDate": ""
                        };


                        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                            param['HospitalID'] = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;

                            $scope.HospitalArray = [];
                            angular.forEach(doctorinfo.doctordata.UserAddress, function (item) {
                                if (item.ExtDetails !== undefined) {
                                    if (item.ExtDetails.HospitalInfo !== undefined && item.ExtDetails.HospitalInfo.HospitalID !== undefined && item.ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                                        var Obj = {
                                            "HospitalName": item.ClinicName,
                                            "HospitalID": item.ExtDetails.HospitalInfo.HospitalID,
                                            "ActiveIND": "Y",
                                            "isChecked": true,
                                            "BranchId": item.ExtDetails.HospitalInfo.HospitalID
                                        };
                                        $scope.HospitalArray.push(Obj);
                                    }
                                }
                            });

                        }
                        var list = [];
                        angular.forEach($scope.HospitalArray, function (items) {
                            if (items.isChecked) {
                                list.push(items.BranchId);
                            }
                        });
                        param["HospitalIDLst"] = list;
                        eHnoteMasterDataService.addPatientSearchInfo(param);
                        var object = {
                            "UserId": $scope.UserId,
                            "HospitalID": $scope.HospitalId,
                            "HospitalIDLst": param.HospitalIDLst.toString(),
                            "SearchText": $scope.PatientSearchObj.SearchText || "",
                            "SearchTypeID": $scope.PatientSearchObj.SearchTypeId || 0,
                        }
                        if ($scope.PatientSearchObj.SearchTypeId == 1) {
                            object.Name = val;
                        } else if ($scope.PatientSearchObj.SearchTypeId == 2) {
                            object.PatientId = val;
                        }
                        eHnotePatientDataService.SearchAllPatientData(object, OnGetopSearchPatientSuccess, OnGetopPatientSearchError)
                    };
                    $scope.ShowPatientDetailsDrop = false;
                    function OnGetopSearchPatientSuccess(data) {

                        if (data.count > 0) {
                            $scope.count = data.count;
                            $scope.AllPatientList = [];
                            if (data.rows.length > 0) {
                                $scope.AllPatientList = data.rows || [];
                            }
                            else {
                                $scope.count = 0;
                                $scope.AllPatientList = [];
                            }
                        }

                        if (data.count > 0) {
                            $scope.count = data.count;
                            $scope.AllPatientList = [];
                            $scope.patientDetailsList = [];
                            $scope.patientinitval = {};
                            angular.forEach(data.rows, function (item) {
                                $scope.patientinitval = {};
                                var array_list = ['#af77c6', '#e4c120', '#69b3e7', '#ed9945', '#90c752'];
                                var val = array_list[Math.floor(Math.random() * array_list.length)];
                                if (item.EmailID !== undefined) {
                                    $scope.patientinitval.EmailID = item.EmailID;
                                }

                                $scope.patientinitval.PatientID = item.PatientId;
                                $scope.patientinitval.Title = item.Title;
                                $scope.patientinitval.S3URL = item.S3URL || "";
                                $scope.patientinitval.FullName = item.FullName;
                                $scope.patientinitval.DOB = item.DOB;
                                $scope.patientinitval.AgeInYears = item.AgeInYears;
                                $scope.patientinitval.AgeInMonths = item.AgeInMonths;
                                $scope.patientinitval.AgeInDays = item.AgeInDays;
                                $scope.patientinitval.AltCountryCode = item.AltCountryCode || '';
                                $scope.patientinitval.Altareacode = item.Altareacode || '';
                                $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || '';

                                $scope.patientinitval.Gender = item.Gender;
                                $scope.patientinitval.LastVisited = item.LastVisited;
                                $scope.patientinitval.CountryCode = item.CountryCode;
                                $scope.patientinitval.PhoneNumber = item.PhoneNumber;
                                $scope.patientinitval.CurrentAge = item.CurrentAge;
                                $scope.patientinitval.colors = val;
                                $scope.patientinitval.OldMrno = item.OldMrno || "";
                                $scope.patientinitval.patientCaseBillingAmtInfo = item.patientCaseBillingAmtInfo;
                                $scope.patientinitval.patientdisplayid = item.DisplayID;
                                $scope.patientinitval.Reviewed = item.Reviewed === undefined ? "N" : item.Reviewed;
                                $scope.patientinitval.familydisplayid = item.FamilyDisplayID;

                                $scope.patientinitval.ReferralSourceId = item.ReferralSourceId;
                                $scope.patientinitval.Due = item.Due;
                                $scope.patientinitval.PatientTypeId = item.PatientTypeId;
                                $scope.patientinitval.IsVIPInd = item.IsVIPInd || false;
                                $scope.patientinitval.IsResearchInd = item.IsResearchInd || false;
                                $scope.patientinitval.IsHighRiskInd = item.IsHighRiskInd || false;
                                $scope.patientinitval.DisplayID = item.DisplayID || "";
                                $scope.patientinitval.Altareacode = item.Altareacode || "";
                                $scope.patientinitval.AltHomeNumber = item.AltHomeNumber || "";
                                $scope.patientinitval.InsuranceDetails = item.InsuranceDetails || [];
                                var obj = eHnoteUserDataService.UsMobileFormatChange(item.Altareacode + item.AltHomeNumber);
                                $scope.patientinitval.MobileNo = obj.UsFormatMobileNumber;
                                var previouspatval = angular.copy($scope.patientinitval);
                                $scope.patientDetailsList.push(previouspatval);
                            });
                            $scope.AllPatientList = $scope.patientDetailsList;

                            $scope.noresult = false;
                            $scope.showloading = false;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        } else {
                            $scope.count = 0;
                            $scope.AllPatientList = [];
                        }
                        if ($scope.PatientSearchObj.SearchText != "") {
                            $scope.ShowPatientDetailsDrop = true;
                        }
                    }
                    function OnGetopPatientSearchError() {
                        $scope.count = 0;
                        $scope.AllPatientList = [];
                        $scope.PatientSearchObj.SearchText = "";
                    }
                    $scope.changePatientSearchType = function (id) {
                        $scope.PatientSearchObj = getSelectedPatientObj();
                        $scope.PatientSearchObj.SearchTypeId = id;
                        $scope.AllPatientList = [];
                        $scope.AllEncounterPatientList = [];
                        if ($scope.PatientSearchObj.SearchText == '') {
                            $scope.ShowPatientDetailsDrop = false;
                        }

                    }
                    $scope.clearPatientListData = function () {
                        $scope.ShowPatientDetailsDrop = false;
                        $scope.PatientSearchObj.SearchText = "";
                        $scope.PatientSearchObj.PatientId = 0;
                    };

                    $scope.SelectedPatientData = function (patietnitem) {
                        $scope.PatientSearchObj.PatientId = patietnitem.PatientID;
                        $scope.PatientSearchObj.SearchText = patietnitem.FullName;
                        $scope.AllPatientList = [];
                        $scope.ShowPatientDetailsDrop = false;

                    };



                    $scope.TransferDeposit = function () {

                        $scope.PatientDeposits = item;
                        angular.forEach($scope.PatientDeposits.PatientDepositPaymodeList, function (Pitem) {
                            Pitem.PatientId = $scope.PatientSearchObj.PatientId || 0;
                        })

                        var obj = {
                            "UserId": $scope.UserId,
                            "OrganizationId": OrganizationId,
                            "PatientDepositId": $scope.PatientDeposits.PatientDepositId || 0,
                            "PatientId": $scope.PatientSearchObj.PatientId || 0,
                            "ReceiptNo": "",
                            "ReceiptId": 0,
                            "DepositDate": $filter('date')($scope.PatientDeposits.DepositDate, "MM-dd-yyyy"),
                            "PaymentDate": $filter('date')($scope.PatientDeposits.PaymentDate, "MM-dd-yyyy"),
                            "DepositAmount": $scope.PatientDeposits.DepositAmount || 0,
                            "DepositedByUserId": $scope.PatientDeposits.DepositedByUserId,
                            "DepositedBy": $scope.PatientDeposits.DepositedBy,
                            "UnBilledAmount": 0,
                            "BilledAmount": 0,
                            "DeleteInd": $scope.PatientDeposits.DeleteInd || "N",
                            "AppointmentId": 0,
                            "BillingProviderId": $scope.PatientDeposits.BillingProviderId,
                            "DepositTypeId": $scope.PatientDeposits.DepositTypeId,
                            "DepositType": $scope.PatientDeposits.DepositTypeName,
                            "PaymentMethodId": $scope.PatientDeposits.PaymentMethodId,
                            "PaymentMethodName": $scope.PatientDeposits.PaymentMethodName,
                            "ChequeNumber": "",
                            "CardNumber": "",
                            "OnlineTransactionNumber": '',
                            "CardName": "",
                            "CardExpiry": "",
                            "Notes": $scope.PatientDeposits.Notes,
                            "BatchNumber": $scope.PatientDeposits.BatchNumber,
                            "OrganizationFacilityId": $scope.PatientDeposits.OrganizationFacilityId,
                            "FacilityName": $scope.PatientDeposits.FacilityName,
                            //"IsConsent": $scope.PatientDepositsObj.IsConsent,
                            //"IsDepositPrint": $scope.PatientDepositsObj.IsDepositPrint,
                            //"IsEmail": $scope.PatientDepositsObj.IsEmail,
                            "DepositStatusId": $scope.PatientDeposits.DepositStatusId,
                            "DepositStatus": $scope.PatientDeposits.DepositStatus,
                            "PageSize": 10,
                            "PageNumber": 1,
                            "PatientDepositPaymodeList": $scope.PatientDeposits.PatientDepositPaymodeList || [],
                            "PatientVoidDeposit": 0,
                        }

                        eHnoteInsuranceService.AddUpdatePatientDepositAmount(obj).then(function (resp) {
                            if (resp.data.Status == "Success") {
                                $scope.getPatientDepositAmountById();
                            }
                        }, function (err) {

                        });


                    }


                    $scope.getPatientDepositAmountById = function () {

                        var obj = {
                            "DepositFrom": "",
                            "DepositTo": "",
                            "PatientId": $scope.PatientSearchObj.PatientId,
                            "OrganizationId": OrganizationId,
                            "PaymentModeId": 0,
                            "PageSize": 10,
                            "PageNumber": 1,
                            "TransactionNumber": "",
                            "SortBy": "Asc",
                            "SearchType": "Deposit",
                            "TransactionCategoryId": $scope.PatientDepositsObj.TransactionCategoryId || 0,
                        };

                        eHnoteInsuranceService.GetAllPatientDeposits(obj).then(function (resp) {
                            if (resp.data.status === "Success") {
                                $scope.PatientDepositsListArray = [];
                                $scope.PatientDepositsListArray = resp.data.rows || [];

                            } else {
                                alertify.error(resp.data.Message);
                            }
                        });
                    }


                }

            });
            mInstanceAdd.result.then(function (resp) {
                /*$scope.getPatientDepositAmountById();*/
            }, function (cancel) {
                $scope.getPatientDepositAmountById();
            });

        }

        $scope.getOrganizationBillingProviderList = function () {

            $scope.BillingProvidersList = [];
            var params = {
                "OrganizationId": $scope.HospitalId || 0,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "HospitalIds": $scope.HospitalIds || '',
                "FacilityCode": "",
                "PageNumber": 1,
                "PageSize": 1000
            };
            eHnoteSettingsDataService.GetOrganizationBillingProviders(params).then(function (resp) {
                if (resp.data.Status == "Success") {
                    resp.data.rows = resp.data.rows || [];
                    $scope.TotalFacilityCount = resp.data.count || 0;
                    if (resp.data.rows.length > 0) {
                        $scope.BillingProvidersList = resp.data.rows || [];
                    }
                } else {
                    alertify.error(resp.data.Message);
                }

            });
        }


        $scope.AddDespositePrint = function (Tempitem, Patientlist, Id) {
            $scope.ViewDepositScreen = false;
            if (Id == 1) {
                var Patientdata = Patientlist.Patientobj || '';
                if (Tempitem != undefined) {
                    /*Tempitem.PatientFullName = Patientdata.FirstName + ' ' + Patientdata.MiddleName + ' ' + Patientdata.LastName || '';*/
                    Tempitem.PatientFullName = Patientdata.PatientFullName || '';
                    Tempitem.AddressLine1 = Patientdata.Address1 || '';
                    Tempitem.AddressLine2 = Patientdata.Address2 || '';
                    Tempitem.PatientMobile = Patientdata.MobileNo || '';
                    Tempitem.AgeInMonths = Patientdata.AgeInMonths || 0;
                    Tempitem.AgeInYears = Patientdata.AgeInYears || '';
                    Tempitem.CityName = Patientdata.CityName || '';
                    Tempitem.StateName = Patientdata.StateName || '';
                    Tempitem.ZipCode = Patientdata.ZipCode || '';
                    Tempitem.PatientDisplayId = Patientdata.PatientDisplayId || '';
                    Tempitem.Gender = Patientdata.Sex || '';
                    Tempitem.StateCode = Patientdata.StateCode || '';
                }
            }

            var CostInWords = "";
            CostInWords = eHnotePrintService.ConvertNumberToWords(Tempitem.DepositAmount);

            var PrintInfo = {
                "DepositeDetails": Tempitem,
                "BillingType": "Payment Receipt",
                "PrintedDatenTime": "",
                "CostInWords": CostInWords,
                "DepositDate": $filter("date")(Tempitem.DepositDate, "MM-dd-yyyy") || "",
                "PaymentType": Tempitem.PatientDepositPaymodeList.length > 0 || ""
            };
            var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
            var printTime = moment(new Date()).format("HH:mm");
            var printDatemTime = printDate + '  ' + printTime;
            PrintInfo.PrintedDatenTime = printDatemTime;

            eHnotePrintService.GenerateAddPatientDepositPrint(PrintInfo);
        };


        $scope.VoidPatientDeposit = function (item, sitem) {

            var mInstanceAdd = $uibModal.open({
                "templateUrl": "VoidReasonPopUp.html",
                "size": "sm",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": " ",
                "resolve": {
                    "item": function () { return item; },
                    "UserId": function () { return $scope.UserId; },
                    "HospitalId": function () { return $scope.HospitalId; },
                    "sitem": function () { return sitem; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, item, UserId, HospitalId, sitem) {
                    item = item || '';

                    console.log(JSON.stringify(item));
                    $scope.uibclose = function () {
                        $uibModalInstance.close("cancel");
                    }
                    $scope.mainNMITransactionid = "";
                    if (sitem.NMITransactionId !== 0) {
                        $scope.mainNMITransactionid = sitem.OnlineTransactionNumber || "";
                    }


                    //$scope.getVoidPatientObj = function () {
                    //    var Obj = {
                    //        "VoidRemarks": ''
                    //    }
                    //    return Obj;
                    //}

                    $scope.VoidPatientObj = {
                        "VoidRemarks": '',
                    }

                    $scope.SaveVoidDepositData = function () {
                        $scope.SavePatientVoidDeposit(item, sitem);
                    }

                    //$scope.SavePatientVoidDeposit = function (item) {

                    //    if ($scope.VoidPatientObj.VoidRemarks == '') {
                    //        alertify.error("Please enter Remarks.");
                    //        return false;
                    //    }

                    //    var ConvertedDate = $filter('date')(item.DepositDate, "MM-dd-yyyy");
                    //    var PaymentDate = $filter("usdateFormatter")(item.PaymentDate, "-");

                    //    var obj = {
                    //        "UserId": UserId,
                    //        "OrganizationId": HospitalId,
                    //        "PatientDepositId": item.PatientDepositId || 0,
                    //        "PatientId": item.PatientId || 0,
                    //        "ReceiptNo": "",
                    //        "ReceiptId": 0,
                    //        "DepositDate": ConvertedDate,
                    //        "PaymentDate": PaymentDate,
                    //        "DepositAmount": sitem.DepositAmount || null,// item.DepositAmount || 0,
                    //        /*"DepositedByUserId": $scope.PatientDepositsObj.DepositedByUserId,*/
                    //        "DepositedBy": item.DepositedBy,
                    //        "UnBilledAmount": item.UnBilledAmount,
                    //        "BilledAmount": 0,
                    //        "DeleteInd": "N",
                    //        "AppointmentId": item.AppointmentID,
                    //        "BillingProviderId": item.BillingProviderId,
                    //        "DepositTypeId": item.DepositTypeId,
                    //        "DepositType": item.DepositTypeName,
                    //        "PaymentMethodId": item.PaymentMethodId,
                    //        "PaymentMethodName": item.PaymentMethodName,
                    //        /* "ChequeNumber": $scope.PatientDepositsObj.ChequeNumber,*/
                    //        "CardNumber": "",
                    //        /* "OnlineTransactionNumber": $scope.PatientDepositsObj.OnlineTransactionNumber || '',*/
                    //        "CardName": "",
                    //        "CardExpiry": "",
                    //        "Notes": item.Notes,
                    //        "BatchNumber": item.BatchNumber,
                    //        "OrganizationFacilityId": item.OrganizationFacilityId,
                    //        "FacilityName": item.FacilityName,
                    //        "DepositStatusId": 2,
                    //        "DepositStatus": "Void Deposit",
                    //        "PageSize": 10,
                    //        "PageNumber": 1,
                    //        "PatientDepositPaymodeList": item.PatientDepositPaymodeList || [],
                    //        "VoidRemarks": $scope.VoidPatientObj.VoidRemarks || '',
                    //        "PatientDepositPaymodeListId": sitem.PatientDepositPaymodeListId,
                    //        "PaymentTransactionTypeId": 4,
                    //        "PaymentTransactionType ": 'Void'
                    //    }

                    //    eHnoteInsuranceService.AddUpdatePatientDepositAmount(obj).then(function (resp) {
                    //        if (resp.data.Status == "Success") {
                    //        }
                    //        $scope.uibclose();
                    //    }, function (err) {

                    //    });
                    //}


                    $scope.SavePatientVoidDeposit = function (item, sitem) {
                        if ($scope.VoidPatientObj.VoidRemarks == '') {
                            alertify.error("Please enter Remarks.");
                            return false;
                        }

                        var Obj = {
                            "OrganizationId": HospitalId,
                            "TransactionId": 0,
                            "UpdateTransactionId": sitem.TransReciptNo,
                            "PatientDepositId": item.PatientDepositId || 0,
                            "Amount": sitem.TransactionAmount || 0,
                            "PaymentTransactionTypeId": 4,
                            "PaymentTransactionType": 'Void',
                            "TransactionDate": $filter("date")(sitem.TransactionDate, "MM-dd-yyyy") || "",
                            "NMITransactionId": sitem.NMITransactionId,
                            "PatientDepositPaymodeListId": sitem.PatientDepositPaymodeListId,
                            "EOBId": 0,
                            "UserId": UserId,
                            "VoidRemarks": $scope.VoidPatientObj.VoidRemarks,
                        }

                        eHnoteInsuranceService.AddUpdatePatientDepositVoid(Obj).then(function (resp) {
                            if (resp.data.Status == "Success") {
                            }
                            $scope.uibclose();
                        }, function (err) {

                        });


                    }

                    $scope.SaveOnlineVoidDeposit = function () {
                        $scope.navtoVoidOnlinePayment(item);
                    }

                    $scope.navtoVoidOnlinePayment = function (item) {
                        $scope.VoidPatientObj.VoidRemarks = $scope.VoidPatientObj.VoidRemarks || "";
                        if ($scope.VoidPatientObj.VoidRemarks == '') {
                            alertify.error("Please enter Remarks.");
                            return false;
                        }

                        if ($scope.mainNMITransactionid == "") {
                            alertify.error("you cannot perform void, as TransactionId is empty");
                            return false;
                        }

                        $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                        $scope.mainNMITransactionObj.NMITransactionId = 0;
                        $scope.mainNMITransactionObj.UserId = UserId;
                        $scope.mainNMITransactionObj.PatientId = item.PatientId;
                        $scope.mainNMITransactionObj.OrganizationId = item.OrganizationId;
                        $scope.mainNMITransactionObj.PaymentAmount = sitem.DepositAmount;
                        $scope.mainNMITransactionObj.MerchentId = "";
                        $scope.mainNMITransactionObj.MerchentName = "ehnotesandbox";
                        $scope.mainNMITransactionObj.CardHolderName = item.PatientFullName || "";
                        $scope.mainNMITransactionObj.PatientEmail = item.PatientEmailId || "";
                        $scope.mainNMITransactionObj.PatientMobile = item.PatientMobile || "";

                        if ($scope.mainNMITransactionObj.PatientMobile != "") {
                            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                            $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                        }

                        $scope.mainNMITransactionObj.PatientMrNo = item.PatientDisplayId || "";
                        $scope.mainNMITransactionObj.OrderId = "";
                        $scope.mainNMITransactionObj.OrderDescription = $scope.VoidPatientObj.VoidRemarks || "";
                        $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                        $scope.mainNMITransactionObj.BillPaymentTypeId = sitem.BillPaymentTypeId || 0;
                        $scope.mainNMITransactionObj.BillPaymentType = sitem.BillPaymentType || "";
                        $scope.mainNMITransactionObj.ResponseId = 0;
                        $scope.mainNMITransactionObj.ResponseCode = "";
                        $scope.mainNMITransactionObj.ResponseText = "";
                        $scope.mainNMITransactionObj.Status = "";
                        $scope.mainNMITransactionObj.TransactionTypeId = 4;
                        $scope.mainNMITransactionObj.TransactionType = "void";
                        $scope.mainNMITransactionObj.DeleteInd = "N";
                        $scope.mainNMITransactionObj.Type = "void";
                        $scope.mainNMITransactionObj.AppointmentId = item.AppointmentId || 0;
                        $scope.mainNMITransactionObj.VisitId = item.VisitId || 0;


                        eHnotePaymentGatewayService.NMIPaymentTransactionVoid($scope.mainNMITransactionObj).then(function (resp) {
                            console.log(resp.data);

                            var res = resp.data || {};
                            if (res.Status == "Success") {
                                alertify.success(res.ResponseText);

                                $scope.SavePatientVoidDeposit(item);
                            }
                        })

                    };
                }
            });

            mInstanceAdd.result.then(function () {

                $scope.getPatientDepositAmountById();
                $scope.ViewDepositScreen = false;
                $scope.ClearPatientDeposit();
                $scope.GetPatientVoidDepositList();

            }, function () { });
        }

        $scope.HideNoDataFound = false;
        $scope.ShowDepositScreen = function () {
            $scope.ViewDepositScreen = true;
            $scope.HideNoDataFound = true;

            var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": $scope.HospitalId }, true) || [];
            if (filtredArray.length > 0) {
                $scope.PatientDepositsObj.BillingProviderId = filtredArray[0].DefaultBillingProviderId;
                $scope.PatientDepositsObj.OrganizationFacilityId = filtredArray[0].BranchId;
                $scope.PatientDepositsObj.FacilityName = filtredArray[0].BranchName;

                $scope.PatientPaymentObj.BillingProviderId = filtredArray[0].DefaultBillingProviderId || 0;
                $scope.PatientPaymentObj.OrganizationFacilityId = filtredArray[0].BranchId;
                $scope.PatientPaymentObj.FacilityName = filtredArray[0].BranchName;
            }
        }

        $scope.CancelPatientDeposit = function () {
            $scope.ViewDepositScreen = false;
            $scope.HideNoDataFound = false;
            $scope.ClearPatientDeposit();
        }

        $scope.ChangeCardType = function (Id, item) {

            var filtredArray = $filter("filter")($scope.AllCardTypes, { "CardtypeId": Id }, true) || [];
            item.CardType = filtredArray[0].CardType || '';
            item.CardtypeId = filtredArray[0].CardtypeId || '';
        }



        $scope.paymentMethods = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "paymentMethods.html",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__popup--right modal__width--50",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };




        $scope.CheckAllLineItems = function (val) {
            if (!val) {

                alertify.confirm(
                    "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to uncheck this item? Entered amounts will be cleared.</h4>",
                    function () {


                        angular.forEach($scope.PatientClaimList, function (item) {
                            angular.forEach(item.ClaimPatientResponsibility, function (item) {
                                item.IsChecked = false;
                                item.PatientPaymentAmount = 0;
                                item.WriteOffAmount = 0;
                                item.AdjustmentReasonCodeId = 0;
                                item.AdjustmentReasonCode = 0;
                                item.AdjsutmentReasonDescription = "";
                            });
                        });
                        $scope.AllSelectionObj.IsAllItemsChecked = false;
                        $scope.calculateLineItemPatientTotals();
                        //$scope.$apply();


                    },
                    function () {
                        angular.forEach($scope.PatientClaimList, function (item) {
                            angular.forEach(item.ClaimPatientResponsibility, function (item) {
                                item.IsChecked = true;
                            });
                        });
                        $scope.AllSelectionObj.IsAllItemsChecked = true;
                        return false;
                    }
                );
            }
            else {
                angular.forEach($scope.PatientClaimList, function (item) {
                    angular.forEach(item.ClaimPatientResponsibility, function (item) {
                        item.IsChecked = true;
                        item.PatientPaymentAmount = item.PatientBalance;
                        item.WriteOffAmount = 0;
                        item.AdjustmentReasonCodeId = 0;
                        item.AdjustmentReasonCode = 0;
                        item.AdjsutmentReasonDescription = "";
                    });
                });
                $scope.AllSelectionObj.IsAllItemsChecked = true;

                $scope.calculateLineItemPatientTotals();
                // $scope.$apply();
            }
            //if (val) {
            //    angular.forEach($scope.PatientClaimList, function (item) {
            //        angular.forEach(item.ClaimPatientResponsibility, function (item) {
            //            item.IsChecked = true;
            //        });
            //    });
            //} else {
            //    angular.forEach($scope.PatientClaimList, function (item) {
            //        angular.forEach(item.ClaimPatientResponsibility, function (item) {
            //            item.IsChecked = false;
            //        });
            //    });
            //}
        }

        $scope.CheckLineItem = function (Aitem) {
            let allChecked = true;

            if (!Aitem.IsChecked) {

                alertify.confirm(
                    "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to uncheck this item? Entered amounts will be cleared.</h4>",
                    function () {

                        Aitem.PatientPaymentAmount = 0;
                        Aitem.WriteOffAmount = 0;
                        Aitem.IsAdjCodeEnable = false;
                        Aitem.AdjustmentReasonCodeId = 0;
                        Aitem.AdjustmentReasonCode = 0;
                        Aitem.AdjsutmentReasonDescription = "";
                        angular.forEach($scope.PatientClaimList, function (item) {
                            angular.forEach(item.ClaimPatientResponsibility, function (lineItem) {
                                //if (!lineItem.IsChecked && lineItem.PatientBalance != 0) {
                                //    allChecked = false;
                                //}
                                if (!lineItem.IsChecked) {
                                    allChecked = false;
                                }
                            });
                        });

                        $scope.AllSelectionObj.IsAllItemsChecked = allChecked;
                        $scope.calculateLineItemPatientTotals();
                        // $scope.$apply();


                    },
                    function () {
                        angular.forEach($scope.PatientClaimList, function (item) {
                            angular.forEach(item.ClaimPatientResponsibility, function (lineItem) {
                                lineItem.IsChecked = true;
                            });
                        });
                        $scope.AllSelectionObj.IsAllItemsChecked = allChecked;
                        return false;
                    }
                );
            }
            else {
                angular.forEach($scope.PatientClaimList, function (item) {
                    angular.forEach(item.ClaimPatientResponsibility, function (lineItem) {
                        //if (!lineItem.IsChecked && lineItem.PatientBalance != 0) {
                        //    allChecked = false;
                        //}
                        if (!lineItem.IsChecked) {
                            allChecked = false;
                        }
                    });
                });

                $scope.AllSelectionObj.IsAllItemsChecked = allChecked;
                Aitem.PatientPaymentAmount = Aitem.PatientBalance;
                Aitem.WriteOffAmount = 0;
                Aitem.AdjustmentReasonCodeId = 0;
                Aitem.AdjustmentReasonCode = 0;
                Aitem.AdjsutmentReasonDescription = "";
                $scope.calculateLineItemPatientTotals();
                //$scope.$apply();
            }

            //if (!Aitem.IsChecked) {
            //    $scope.PatientPaymentObj.PatientDepositPaymodeList = [];
            //    $scope.PatientPaymentObj.UnBilledAmount = 0;
            //    $scope.applyDeposit();
            //}

        };


        $scope.PayOnline = function (PaymentMethodObj) {
            console.log($scope.PatientDetails);
            if (PaymentMethodObj.PaymentMethodId !== 2 && PaymentMethodObj.PaymentMethodId !== 3 && PaymentMethodObj.PaymentMethodId !== 7) {
                alert("Please select a payment method.");
                return;
            }

            const paymentType = (PaymentMethodObj.PaymentMethodId === 2 || PaymentMethodObj.PaymentMethodId === 3) ? 'cc' : 'ck';

            CollectJS.configure({
                paymentType: paymentType, // 'cc' or 'ck'
                callback: function (response) {
                    $scope.$apply(function () {
                        $scope.tokenResponse = response;
                        if (paymentType == "cc") {
                            if (response.card && response.card.type) {
                                switch (response.card.type.toLowerCase()) {
                                    case 'visa':
                                        PaymentMethodObj.CardtypeId = 1;
                                        break;
                                    case 'mastercard':
                                        PaymentMethodObj.CardtypeId = 2;
                                        break;
                                    case 'amex':
                                        PaymentMethodObj.CardtypeId = 3;
                                        break;
                                    default:
                                        PaymentMethodObj.CardtypeId = 0; // or a default value if needed
                                }
                            } else {
                                PaymentMethodObj.CardtypeId = 0;
                            }
                            PaymentMethodObj.CardNumber = response.card.number.slice(-4);
                            PaymentMethodObj.CardType = response.card.type;
                        }
                        if (paymentType == "ck") {

                        }


                        $scope.processPayment(response.token, PaymentMethodObj);
                    });
                }
            });

            CollectJS.startPaymentRequest();

        }
        $scope.processPayment = function (paymentToken, PaymentMethodObj) {
            var paymentProcessingData = {
                NMITransactionId: 0,
                UserId: $scope.UserId,
                PatientId: $scope.PatientDetails.PatientId,
                OrganizationId: $scope.HospitalId,
                PaymentAmount: $scope.PaymentMethodObj.DepositAmount,
                MerchentId: "",
                MerchentName: "ehnotesandbox",
                PaymentToken: paymentToken, // assumed from earlier logic
                PatientFirstName: $scope.PatientDetails.FirstName,
                PatientLastName: $scope.PatientDetails.LastName,
                Email: $scope.PatientDetails.EmailId,
                PatientMrNo: $scope.PatientDetails.PatientDisplayId,
                OrderId: "",
                OrderDescription: "Patient copay for consultation on 2025-04-29",
                TransactionId: 0,
                ResponseId: 0,
                ResponseCode: "",
                ResponseText: "",
                Status: "",
                TransactionTypeId: 1,
                TransactionType: "sale",
                DeleteInd: "N",
                Type: "sale",
                AppointmentId: "APT123",
                VisitId: 9876,
                BillingProviderId: 555
            };


            eHnotePaymentGatewayService.ProcessPayment(paymentProcessingData).then(function (resp) {
                var res = resp.data || {};

                if (res.ResponseId === 1) {
                    alertify.success(res.Status);

                    PaymentMethodObj.ReferenceNumber = res.TransactionId;
                    PaymentMethodObj.NMITransactionId = res.NMITransactionId
                    $scope.AddMultipleDepositsList(PaymentMethodObj, PaymentMethodObj.PaymentMethodId)
                } else if (res.ResponseId === 2) {
                    alertify.error(res.Status);
                } else {
                    alertify.error(res.Status);
                }

                console.log(res);
                /* $uibModalInstance.close(); // Close the modal*/
            });

        };
        $scope.VoidPayment = function (item, index) {
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Void the payment? </h4>", function () {
                if (item.PatientDepositPaymodeListId != 0) {
                    item.DeleteInd = "Y";
                } else {
                    eHnotePaymentGatewayService.VoidPayment(item.ReferenceNumber).then(function (resp) {
                        var res = resp.data || {};
                        if (res.success == true) {
                            alertify.success(res.responseText);
                        }
                    })
                    //  $scope.PatientDepositsObj.PatientDepositPaymodeList.splice(index, 1);
                    $scope.selectedDeposits.splice(index, 1);
                }
                $scope.CalculateTotalPayments();
                $scope.applyDeposit();
                $scope.$apply();
            }, function () {

            });
        };

        $scope.RefundPayment = function (item, index) {
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Refund the payment? </h4>", function () {
                if (item.PatientDepositPaymodeListId != 0) {
                    item.DeleteInd = "Y";
                } else {
                    var refundPayment = {
                        transactionId: item.ReferenceNumber,
                        amount: item.DepositAmount
                    }
                    eHnotePaymentGatewayService.RefundPayment(refundPayment).then(function (resp) {
                        var res = resp.data || {};
                        if (res.success == true) {
                            alertify.success(res.responseText);
                        }
                    })
                    // $scope.PatientDepositsObj.PatientDepositPaymodeList.splice(index, 1);
                    $scope.selectedDeposits.splice(index, 1);
                }
                $scope.CalculateTotalPayments();
                $scope.applyDeposit();
                $scope.$apply();
            }, function () {

            });
        }

        $scope.GetNMITransactionStatusQuery = function (item, index) {
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to check the payment status? </h4>", function () {

                var transactionId = item.ReferenceNumber;
                eHnotePaymentGatewayService.GetNMITransactionStatusQuery(transactionId).then(function (resp) {
                    var res = resp.data || {};

                    alertify.success(res.Status);

                })

                $scope.selectedDeposits.splice(index, 1);

            }, function () {

            });
        }


        $scope.VoidPaymentMethodDeposit = function (voidItem, pItem) {

            var mInstanceAdd = $uibModal.open({
                "templateUrl": "VoidReasonPopUp.html",
                "size": "sm",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": " ",
                "resolve": {
                    "item": function () { return pItem; },
                    "voidItem": function () { return voidItem; },
                    "UserId": function () { return $scope.UserId; },
                    "HospitalId": function () { return $scope.HospitalId; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, item, UserId, HospitalId, voidItem) {
                    item = item || '';
                    $scope.uibclose = function () {
                        $uibModalInstance.close("cancel");
                    }

                    //$scope.getVoidPatientObj = function () {
                    //    var Obj = {
                    //        "VoidRemarks": ''
                    //    }
                    //    return Obj;
                    //}

                    $scope.VoidPatientObj = {
                        "VoidRemarks": '',
                    }

                    $scope.VoidPaymentMethodData = {
                        "PatientDepositPaymodeListId": 0,
                        "PaymentMethodId": 0,
                        "PaymentMethodName": "",
                        "DepositAmount": "",
                        "ReferenceNumber": "",
                        "IsDepositAdded": false,
                        "DeleteInd": "N",
                        "PatientDepositId": null,
                        "CardNumber": "",
                        "CardType": "",
                        "CardtypeId": 0,
                        "PaymodeReceiptNo": "",
                    }

                    $scope.SaveVoidDepositData = function () {
                        $scope.SavePatientVoidDeposit(item);
                    }

                    $scope.SavePatientVoidDeposit = function (item) {

                        if ($scope.VoidPatientObj.VoidRemarks == '') {
                            alertify.error("Please enter Remarks.");
                            return false;
                        }

                        var ConvertedDate = $filter('date')(item.DepositDate, "MM-dd-yyyy");
                        var PaymentDate = $filter("usdateFormatter")(item.PaymentDate, "-");

                        var obj = {
                            "UserId": UserId,
                            "OrganizationId": HospitalId,
                            "PatientDepositId": item.PatientDepositId || 0,
                            "PatientId": item.PatientId || 0,
                            "ReceiptNo": "",
                            "ReceiptId": 0,
                            "DepositDate": ConvertedDate,
                            "PaymentDate": PaymentDate,
                            "DepositAmount": item.DepositAmount || 0,
                            /*"DepositedByUserId": $scope.PatientDepositsObj.DepositedByUserId,*/
                            "DepositedBy": item.DepositedBy,
                            "UnBilledAmount": item.UnBilledAmount,
                            "BilledAmount": 0,
                            "DeleteInd": "N",
                            "AppointmentId": item.AppointmentID,
                            "BillingProviderId": item.BillingProviderId,
                            "DepositTypeId": item.DepositTypeId,
                            "DepositType": item.DepositTypeName,
                            "PaymentMethodId": item.PaymentMethodId,
                            "PaymentMethodName": item.PaymentMethodName,
                            /* "ChequeNumber": $scope.PatientDepositsObj.ChequeNumber,*/
                            "CardNumber": "",
                            /* "OnlineTransactionNumber": $scope.PatientDepositsObj.OnlineTransactionNumber || '',*/
                            "CardName": "",
                            "CardExpiry": "",
                            "Notes": item.Notes,
                            "BatchNumber": item.BatchNumber,
                            "OrganizationFacilityId": item.OrganizationFacilityId,
                            "FacilityName": item.FacilityName,
                            "DepositStatusId": 2,
                            "DepositStatus": "Void Deposit",
                            "PageSize": 10,
                            "PageNumber": 1,
                            "VoidPaymentMethodData": voidItem || {},
                            "PatientDepositPaymodeList": item.PatientDepositPaymodeList || [],
                            "VoidRemarks": $scope.VoidPatientObj.VoidRemarks || '',
                        }

                        eHnoteInsuranceService.AddUpdatePatientDepositAmount(obj).then(function (resp) {
                            if (resp.data.Status == "Success") {
                            }
                            $scope.uibclose();
                        }, function (err) {

                        });
                    }

                }
            });

            mInstanceAdd.result.then(function () {

                $scope.getPatientDepositAmountById();
                $scope.ViewDepositScreen = false;
                $scope.ClearPatientDeposit();

            }, function () { });
        }


        $scope.IsPaymentMode = false;
        $scope.navtoCollectPayment = function (id) {

            console.log($scope.PatientDetails);
            $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());
            if ($scope.PatientDepositsObj.PatientId === 0) {
                alertify.error("Please Select Patient ");
                return;
            }

            //var depositAmt = parseFloat($scope.PatientDepositsObj.DepositAmount) || 0;
            //if (depositAmt === 0) {
            //    alertify.error("Please Enter Deposit Amount");
            //    return;
            //}



            //if ($scope.PatientDepositsObj.OrganizationFacilityId === 0) {
            //    alertify.error("Please select the location ");
            //    return;
            //}

            $scope.IsPaymentMode = true;

            var Parentobj = {
                "PatientId": $scope.PatientDepositsObj.PatientId,
                "AppointmentId": $scope.PatientDepositsObj.AppointmentId,
                "PatientFirstName": $scope.PatientDetails.FirstName,
                "PatientLastName": $scope.PatientDetails.LastName,
                "PatientDisplayId": $scope.PatientDetails.PatientDisplayId,
                "PatientEmailId": $scope.PatientDetails.EmailId,
                "PatientGender": $scope.PatientDetails.Gender,
                "PatientAgeInYears": $scope.PatientDetails.AgeInYears,
                "PatientAgeInMonths": $scope.PatientDetails.AgeInMonths,
                "PatientDOB": $scope.PatientDetails.DOB,
                "PatientMobileNumber": $scope.PatientDetails.MobileNo,
                "PatientZipCode": $scope.PatientDetails.ZipCode,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "PaymentAmount": $scope.PatientDepositsObj.DepositAmount,
                "DepositAmount": $scope.PatientDepositsObj.DepositAmount,
                "DepositDate": $scope.PatientDepositsObj.DepositDate,
                "PaymentModeId": $scope.PatientDepositsObj.PaymentMethodId || 0,
                "PaymentMode": $scope.PatientDepositsObj.PaymentMethodName || "",
                "PaymentTypeId": 1,
                "PaymentType": "Deposit",
                "ScreenType": "AddDeposit",
                "AllCardTypes": $scope.AllCardTypes,
                "BillingProviderId": $scope.PatientDepositsObj.BillingProviderId,
                "IsDepositPrint": false,// $scope.PatientDepositsObj.IsDepositPrint,
                "PatientDataObj": $scope.SelectedPatientDetails.PatientObj || {},
                "PatientDepositsObj": $scope.PatientDepositsObj || {},
                "DepositTypeId": $scope.PatientDepositsObj.DepositTypeId,
                "DepositType": $scope.PatientDepositsObj.DepositTypeName,
                "Notes": $scope.PatientDepositsObj.Notes,
                "PatientClaimId": $scope.Selectobj.PatientClaimId || null,
                "mainBillerDataObj": $scope.Selectobj.mainBillerDataObj || {},
                "IsPaymentMode": $scope.IsPaymentMode,
                "DepositTypes": $scope.DepositTypes,
                "DepositscreenTypeId": id,
                "ClaimDataObj": $scope.Selectobj.ClaimDataObj || {},
                "TransactionCategoryId": 1,
                "TransactionCategoryName": 'Deposit'

            }
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/collectPayment.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "resolve": {
                    "Parentobj": function () { return Parentobj; }
                },
                "windowClass": "modal__ninetyfive--",

                "controller": "UsMainNmiPaymentCtrl",
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                console.log(resp);
                if (resp != undefined) {
                    if (resp.Status === "Success") {

                        $scope.SelectedPatientDetails.DepositsObj = angular.copy($scope.PatientDepositsObj) || "";
                        $scope.SelectedPatientDetails.DepositsObj.IsDepositPrint = resp.IsDepositPrint || false;
                        if ($scope.SelectedPatientDetails.DepositsObj.IsDepositPrint == true) {
                            $scope.SelectedPatientDetails.DepositsObj.ReceiptNo = resp.ReceiptNo || '';
                            $scope.SelectedPatientDetails.DepositsObj.CreatedBy = resp.CreatedBy || '';
                            $scope.SelectedPatientDetails.DepositsObj.BillingProviderName = resp.BillingProviderName || '';
                            $scope.SelectedPatientDetails.DepositsObj.PatientDepositPaymodeList = resp.PatientDepositPaymodeList || [];
                            /*  $scope.AddDespositePrint($scope.SelectedPatientDetails.DepositsObj, $scope.SelectedPatientDetails.PatientObj, 1);*/
                            $scope.AddTransactionPrint(resp);
                        } else {

                        }

                        $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());
                        $scope.SearchObj = angular.copy($scope.getSearchObj());
                        $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());


                        //$scope.SelectedPatientDetails.PatientObj = "";
                        $scope.SelectedPatientDetails.DepositsObj = "";

                        if (Selectobj.Allocate == 4) {
                            $scope.ViewDepositScreen = true;
                        } else {
                            $scope.ViewDepositScreen = false;
                        }
                        $scope.showNotes = false;
                    }
                }
                $scope.IsPaymentMode = false;
               
                console.log($scope.DepositSubTab + "__$scope.DepositSubTab");
             
                if ($scope.DepositSubTab === 2) {
                    $scope.GetPatientPendingPaymentsList();
                } else {
                    $scope.getPatientDepositAmountById();
                }



            }, function (cancel) {
            });
        };

        $scope.EditClaimLineItem = function (item, Aitem, index) {
            Aitem.IsEditMode = false;
            Aitem.IsPaymentEdit = true;
            $scope.PatientPaymentObj.IsPatientDeposit = true;
            $scope.PatientPaymentObj.IsEditPatientDeposit = true;
        };

        $scope.navtoCollectPatientPayment = function (Id) {
            $scope.IsPaymentMode = true
            console.log($scope.PatientDetails);

            if ($scope.PatientPaymentObj.PatientId === 0) {
                alertify.error("Please Select Patient ");
                return;
            }

            //if ($scope.PatientPaymentObj.PaymentMethodId === '') {
            //    alertify.error("Please Select PaymentMode ");
            //    return;
            //}

            //var depositAmt = parseFloat($scope.PatientPaymentObj.DepositAmount) || 0;
            //if (depositAmt === 0) {
            //    alertify.error("Please Enter Payment Amount");
            //    return;
            //}

            //if ($scope.IsViewDepositScreen == true) {
            //    if ($scope.PatientPaymentObj.DepositAmount > $scope.PaymentMethodObj.PatientDepositAmt) {
            //        alertify.error("Please enter an Amount less than or equal to the available deposit.");
            //        return;
            //    }
            //} else {

            //}

            if ($scope.PatientPaymentObj.OrganizationFacilityId === 0) {
                alertify.error("Please select the location ");
                return;
            }

            //if ($scope.PatientPaymentObj.DepositAmount > $scope.TotalPatientBalanceAmount) {
            //    alertify.error(` $${$scope.PatientPaymentObj.DepositAmount} exceeds the PatientBalance Amount. Please enter a lesser amount.`);
            //    $scope.PatientPaymentObj.DepositAmount = "";
            //    return;
            //}

            if ($scope.mainPaymentObject.TotalPayableAmount === 0) {
                $scope.applyDeposit();
            } else {
                $scope.continuetoCollectPayment(Id);
            }

        };


        $scope.continuetoCollectPayment = function (Id) {
            var Parentobj = {
                "PatientId": $scope.PatientPaymentObj.PatientId || $scope.Selectobj.PatientId,
                "AppointmentId": $scope.PatientPaymentObj.AppointmentId,
                "PatientFirstName": $scope.PatientDetails.FirstName,
                "PatientLastName": $scope.PatientDetails.LastName,
                "PatientDisplayId": $scope.PatientDetails.PatientDisplayId,
                "PatientEmailId": $scope.PatientDetails.EmailId,
                "PatientGender": $scope.PatientDetails.Gender,
                "PatientAgeInYears": $scope.PatientDetails.AgeInYears,
                "PatientAgeInMonths": $scope.PatientDetails.AgeInMonths,
                "PatientDOB": $scope.PatientDetails.DOB,
                "PatientMobileNumber": $scope.PatientDetails.MobileNo,
                "PatientZipCode": $scope.PatientDetails.ZipCode,
                "UserId": $scope.UserId,
                "HospitalId": $scope.PatientPaymentObj.OrganizationFacilityId,
                "PaymentAmount": $scope.mainPaymentObject.TotalPatientBalanceAmount || 0, //$scope.TotalPatientBalanceAmount,
                "DepositDate": $scope.PatientPaymentObj.DepositDate,
                "PaymentModeId": 1,
                "PaymentMode": "Cash",
                "PaymentTypeId": 2,
                "PaymentType": "Payment",
                "ScreenType": "AddPayment",
                "AllCardTypes": $scope.AllCardTypes,
                "BillingProviderId": $scope.PatientPaymentObj.BillingProviderId,
                "IsDepositPrint": $scope.PatientPaymentObj.IsDepositPrint,
                "PatientDataObj": $scope.SelectedPatientDetails.PatientObj || {},
                "PatientPaymentObj": $scope.PatientPaymentObj || {},
                "DepositTypeId": $scope.PatientPaymentObj.DepositTypeId,
                "DepositType": $scope.PatientPaymentObj.DepositTypeName,
                "Notes": "",
                "PatientClaimId": $scope.Selectobj.PatientClaimId || null,
                "mainBillerDataObj": $scope.Selectobj.mainBillerDataObj || {},
                "PatientClaimList": $scope.PatientClaimList || [],
                //"PaymentModeId": $scope.PatientPaymentObj.PaymentMethodId || 0,
                //"PaymentMode": $scope.PatientPaymentObj.PaymentMethodName || "",
                "PatientDepositId": $scope.PatientPaymentObj.PatientDepositId || 0,
                "IsPaymentMode": false,
                "IsShowPaymentAmount": true,
                "EditOverAllBool": false,
                "DepositTypes": $scope.DepositTypes,
                "DepositscreenTypeId": Id,
                //"RenderingProviderId": $scope.PatientPaymentObj.RenderingProviderId || 0,
                //"RenderingProviderName": $scope.PatientPaymentObj.RenderingProviderName || "",
                "RenderingProviderId": 0,
                "RenderingProviderName": "",
                "ClaimDataObj": $scope.Selectobj.ClaimDataObj || {},
                "TransactionCategoryId": 2,
                "TransactionCategoryName": "Patient Payment",

            }
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/collectPayment.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "resolve": {
                    "Parentobj": function () { return Parentobj; }
                },
                "windowClass": "modal__ninetyfive--",
                "controller": "UsMainNmiPaymentCtrl",
            });
            $scope.mInstanceAdd.result.then(function (resp) {

                if (resp == 'cancel' || resp == undefined) {

                }
                else {
                    if (resp != undefined) {
                        if (resp.Status === "Success") {

                            $scope.SelectedPatientDetails.DepositsObj = angular.copy($scope.PatientPaymentObj) || "";
                            $scope.SelectedPatientDetails.DepositsObj.IsDepositPrint = resp.IsDepositPrint || false;
                            if ($scope.SelectedPatientDetails.DepositsObj.IsDepositPrint == true) {
                                $scope.SelectedPatientDetails.DepositsObj.ReceiptNumber = resp.ReceiptNo || '';
                                $scope.SelectedPatientDetails.DepositsObj.CreatedBy = resp.CreatedBy || '';
                                $scope.SelectedPatientDetails.DepositsObj.BillingProviderName = resp.BillingProviderName || '';
                                $scope.SelectedPatientDetails.DepositsObj.PatientDepositPaymodeList = resp.PatientDepositPaymodeList || [];
                                $scope.AddTransactionPrint(resp);
                            } else {

                            }

                        }
                    }

                    console.log(resp);

                    $scope.PatientPaymentObj = $scope.PatientPaymentObj || {};
                    $scope.PatientPaymentObj.PatientDepositPaymodeList = $scope.PatientPaymentObj.PatientDepositPaymodeList || [];


                    var remainingBalance = $scope.mainPaymentObject.TotalPayableAmount;
                    //if (resp && resp.PatientDepositPaymodeList && resp.PatientDepositPaymodeList.length > 0) {
                    //    angular.forEach(resp.PatientDepositPaymodeList, function (depositItem) {

                    //        let availableAmount = depositItem.DepositAmount || 0;
                    //        if (availableAmount <= 0 || remainingBalance <= 0) {
                    //            return;
                    //        }
                    //        let usedAmount = Math.min(remainingBalance, availableAmount);

                    //        let alreadyExists = $scope.PatientPaymentObj.PatientDepositPaymodeList.some(function (d) {
                    //            return d.PatientDepositId === depositItem.PatientDepositId;
                    //        });

                    //        if (!alreadyExists) {
                    //            var sourceDeposit = angular.copy(depositItem);
                    //            sourceDeposit.PatientDepositPaymodeListId = 0;
                    //            sourceDeposit.PaymentMethodId = depositItem.PaymentMethodId;
                    //            sourceDeposit.PaymentMethodName = depositItem.PaymentMethodName;
                    //            sourceDeposit.DepositAmount = usedAmount;
                    //            sourceDeposit.IsCollectPayment = true;
                    //            $scope.PatientPaymentObj.PatientDepositPaymodeList.push(sourceDeposit);
                    //            $scope.selectedDeposits.push(depositItem.PatientDepositId);

                    //            $scope.PatientPaymentObj.UnBilledAmount = ($scope.PatientPaymentObj.UnBilledAmount || 0) + usedAmount;
                    //            remainingBalance -= usedAmount;
                    //        }
                    //    });

                    //}

                    if (resp && resp.PatientDepositPaymodeList && resp.PatientDepositPaymodeList.length > 0) {

                        // Group by PatientDepositId and sum the amounts first
                        var depositMap = {};
                        angular.forEach(resp.PatientDepositPaymodeList, function (depositItem) {
                            var depId = depositItem.PatientDepositId;
                            if (!depositMap[depId]) {
                                depositMap[depId] = angular.copy(depositItem);
                                depositMap[depId].DepositAmount = 0;
                            }
                            depositMap[depId].DepositAmount += (depositItem.DepositAmount || 0);
                        });

                        angular.forEach(depositMap, function (depositItem, depId) {
                            let availableAmount = depositItem.DepositAmount || 0;
                            if (availableAmount <= 0 || remainingBalance <= 0) {
                                return;
                            }
                            let usedAmount = Math.min(remainingBalance, availableAmount);

                            let alreadyExists = $scope.PatientPaymentObj.PatientDepositPaymodeList.some(function (d) {
                                return d.PatientDepositId === depositItem.PatientDepositId;
                            });

                            if (!alreadyExists) {
                                var sourceDeposit = angular.copy(depositItem);
                                sourceDeposit.PatientDepositPaymodeListId = 0;
                                sourceDeposit.PaymentMethodId = 14;           // Patient Deposits
                                sourceDeposit.PaymentMethodName = 'Patient Deposits';
                                sourceDeposit.DepositAmount = usedAmount;
                                sourceDeposit.IsCollectPayment = true;
                                //$scope.PatientPaymentObj.PatientDepositPaymodeList.push(sourceDeposit);
                                $scope.PatientPaymentObj.PatientDepositPaymodeList.push(...resp.PatientDepositPaymodeList);
                                $scope.selectedDeposits.push(depositItem.PatientDepositId);
                                $scope.PatientPaymentObj.UnBilledAmount = ($scope.PatientPaymentObj.UnBilledAmount || 0) + usedAmount;
                                remainingBalance -= usedAmount;
                            }
                        });
                    }


                    var isPaymentAllocatedManually = $scope.PatientClaimList?.some(pitem =>
                        pitem.ClaimPatientResponsibility?.some(citem => {
                            const ppAmt = parseFloat(citem.PatientPaymentAmount) || 0;
                            const adjAmt = parseFloat(citem.WriteOffAmount) || 0;
                            return ppAmt > 0 || adjAmt > 0;
                        })
                    );

                    console.log(isPaymentAllocatedManually);

                    if (isPaymentAllocatedManually) {
                        $scope.calculateLineItemPatientTotals();

                        if ($scope.mainPaymentObject.TotalPaidAmount < $scope.mainPaymentObject.TotalPayableAmount) {

                        } else {
                            $scope.applyDeposit();
                        }

                    } else {
                        $scope.applyDeposit();
                    }
                }

            }, function (cancel) {
                //$scope.PatientPaymentObj.DepositAmount = 0;
                //$scope.getPatientDepositAmountById();
                //$scope.GetPatientPaymentsList();

            });
        }

        $scope.RefundPatientDepositAmount = function () {
            console.log($scope.DepositDetails)
            var obj = {
                "AllCardTypes": $scope.AllCardTypes || [],
                "Masterrefundreasons": $scope.Masterrefundreasons || [],
                "AllUsersList": $scope.AllUsersList || [],
            }
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "RefundPatientDepositAmount.html",
                "backdrop": "static",
                "keyboard": false,
                //"size": "lg",
                "windowClass": "modal__ninety--",
                "resolve": {

                    "Patientobj": function () { return $scope.SearchPatientDepositsObj; },
                    "obj": function () { return obj; },
                    "HospitalId": function () { return $scope.HospitalId; },

                },
                "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, datapersistanceFactory, HospitalId, Patientobj, obj) {

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.UserId = eHnoteMasterDataService.getLoginId();
                    $scope.HospitalId = HospitalId;
                    var mObj = datapersistanceFactory.getItem("masterDataArrays");
                    $scope.masterPaymentModes = [];
                    if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
                        $scope.masterPaymentModes = mObj.PaymentModes;
                        $scope.filterPaymentModes = function (item) {
                            return ![13, 14].includes(item.PaymentModeId);
                        };
                    };
                    $scope.Masterrefundreasons = obj.Masterrefundreasons || [];
                    $scope.AllCardTypes = obj.AllCardTypes || [];
                    $scope.AllUsersList = obj.AllUsersList || [];
                    $scope.PatientTotalUnallocated = 0;
                    $scope.GetPatientDepositsLitsObj = function () {
                        return {
                            "DepositFrom": "",
                            "DepositTo": "",
                            "PatientId": Patientobj.PatientId,
                            "OrganizationId": $scope.HospitalId,
                            "PaymentModeId": 0,
                            "PageSize": 10,
                            "PageNumber": 1,
                            "TransactionNumber": "",
                            "Type": 1
                        }
                    };

                    $scope.getDepositRefundObj = function () {
                        return {
                            "UserId": $scope.UserId,
                            "RefundByUser": "",
                            "OrganizationId": $scope.HospitalId,
                            "PatientDepositId": null,
                            "RefundDepositId": null,
                            "ReceiptNo": "",
                            "ReceiptId": 0,
                            "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                            "RefundAmount": $scope.PatientTotalUnallocated || 0,
                            "RefundBy": "",
                            "DeleteInd": "N",
                            "AppointmentId": null,
                            "PatientId": Patientobj.PatientId || null,
                            "RefundreasonId": null,
                            "Refundreason": null,
                            "Remarks": null,
                            "CardtypeId": null,
                            "Cardtype": "",
                            "RefundPaymentMethodId": 5,
                            "RefundPaymentMethod": "Check",
                            "ReceiptNumber": "",
                            "ReferenceNumber": "",
                            "CardNumber": "",
                            "DepositStatus": "Refund",
                            "DepositStatusId": "3",
                            "Transactions": [],
                            "PaymentTransactionTypeId": 3,
                            "PaymentTransactionType": 'Refund'


                        }


                    };


                    $scope.SearchPatientDepositsObj = angular.copy($scope.GetPatientDepositsLitsObj());

                    $scope.calculateRefundAmount = function (amount) {

                        if (amount > $scope.PatientTotalUnallocated) {
                            alertify.error("Refund Amount should not be greater than the Unallocated Deposit Amount.");
                            $scope.DepositRefundObj.RefundAmount = '';
                            return false;
                        } else {

                        }
                    }

                    $scope.getPatientDepositAmountById = function () {
                        var obj = {
                            "DepositFrom": $scope.SearchPatientDepositsObj.DepositFrom || "",
                            "DepositTo": $scope.SearchPatientDepositsObj.DepositTo || "",
                            "PatientId": $scope.SearchPatientDepositsObj.PatientId,
                            "OrganizationId": $scope.SearchPatientDepositsObj.OrganizationId,
                            "PaymentModeId": 0,
                            "PageSize": 100,
                            "PageNumber": 1,
                            "TransactionNumber": "",
                            "SortBy": "Asc",
                        };
                        obj.PaymentModeId = parseInt(obj.PaymentModeId);
                        if (obj.DepositFrom != "") {
                            obj.DepositFrom = $filter("usdateFormatter")(obj.DepositFrom, "-");
                        }
                        if (obj.DepositTo != "") {
                            obj.DepositTo = $filter("usdateFormatter")(obj.DepositTo, "-");
                        }
                        eHnoteInsuranceService.GetPatientDepositAmountList(obj).then(function (resp) {
                            $scope.PatientDepositsListArray = [];

                            if (resp.data.status === "Success") {
                                $scope.PatientDepositsListArray = resp.data.rows || [];
                                if ($scope.PatientDepositsListArray.length > 0) {
                                    angular.forEach($scope.PatientDepositsListArray, function (item) {
                                        item.IsChecked = false;
                                        if (item.UnBilledAmount >= 0) {
                                            $scope.PatientTotalUnallocated += item.UnBilledAmount;
                                            $scope.PatientTotalUnallocated = parseFloat($scope.PatientTotalUnallocated.toFixed(2));
                                        }
                                        var uniqueMap = {};

                                        (item.PatientDepositPaymodeList || []).forEach(function (bitem) {
                                            var original = bitem.DepositTypeName || "";
                                            var key = original.replace(/\s+/g, '').toLowerCase();
                                            if (!uniqueMap[key]) {
                                                uniqueMap[key] = original; // keep first occurrence
                                            }
                                        });

                                        item.DepositTypeNames = Object.values(uniqueMap).join(',') || item.DepositTypeName || "";
                                    });
                                }
                                $scope.PatientDepositsDataArray = [];
                                $scope.PatientDepositsDataArray = $scope.PatientDepositsListArray.filter(item => item.UnBilledAmount > 0) || [];
                                $scope.DepositRefundObj = angular.copy($scope.getDepositRefundObj());

                            } else {
                                alertify.error(resp.data.Message);
                            }
                        });
                    }

                    $scope.getPatientDepositAmountById();
                    $scope.hasUnbilledAmount = function (item) {
                        return item.UnBilledAmount > 0;
                    };
                    $scope.hasTransactionAmount = function (item) {
                        return item.TransactionAmount > 0;
                    };
                    $scope.ChangeDepositMode = function (ID) {
                        var List1 = $filter("filter")($scope.masterPaymentModes, function (Pitem,) { return Pitem.PaymentModeId === ID; }) || [];
                        if (List1.length != 0) {
                            $scope.DepositRefundObj.RefundPaymentMethodId = List1[0].PaymentModeId;
                            $scope.DepositRefundObj.RefundPaymentMethod = List1[0].PaymentModeName;
                        }
                    };
                    $scope.changeRefund = function (id) {
                        var filtredArray = $filter("filter")($scope.Masterrefundreasons, { "RefundreasonId": id }, true) || [];
                        if (filtredArray.length > 0) {
                            $scope.DepositRefundObj.Refundreason = filtredArray[0].Refundreason || "";
                        }
                    }
                    $scope.SaveRefundPatientDepositAmount = function () {
                        if ($scope.DepositRefundObj.RefundAmount == '' || $scope.DepositRefundObj.RefundAmount == 0) {
                            alertify.error("Please enter the Refund Amount.");
                            return false;

                        }
                        if ($scope.DepositRefundObj.RefundPaymentMethodId == 0) {
                            alertify.error("Please Select Refund Payment Method.");
                            return false;

                        }
                        if ($scope.DepositRefundObj.RefundreasonId == null) {
                            alertify.error("Please Select Refund Reason");
                            return;
                        }
                        if ($scope.DepositRefundObj.Remarks == "" || $scope.DepositRefundObj.Remarks == null) {
                            alertify.error("Please enter Refund remarks.");
                            return false;
                        }
                        if ($scope.DepositRefundObj.RefundAmount > $scope.PatientTotalUnallocated) {
                            alertify.error("Refund Amount should not be greater than the Unallocated Deposit Amount.");
                            return false;

                        }
                        let remainingRefund = $scope.DepositRefundObj.RefundAmount;
                        let TransactionsList = [];
                        let FinalRefundParamsList = [];

                        angular.forEach($scope.PatientDepositsDataArray, function (item) {
                            if (remainingRefund > 0 && item.UnBilledAmount > 0) {
                                let refundPortion = Math.min(item.UnBilledAmount, remainingRefund);

                                // Transaction object (refund)
                                let transaction = {
                                    "UserId": $scope.UserId,
                                    "PatientId": item.PatientId || null,
                                    "RefundDepositId": null,
                                    "RefundTransactionId": 0,
                                    "PatientDepositId": item.PatientDepositId,
                                    "OrganizationId": $scope.HospitalId,
                                    "TransactionDate": $filter('date')($scope.DepositRefundObj.RefundDate, "MM-dd-yyyy"),
                                    "TransactionAmount": -refundPortion,
                                    "RefundAmount": -refundPortion,
                                    "TransactionSourceId": 3,
                                    "TransactionSource": "Patient",
                                    "DeleteInd": "N"
                                };
                                TransactionsList.push(transaction);

                                // Refund params object
                                let param = {
                                    "UserId": $scope.UserId,
                                    "OrganizationId": $scope.HospitalId,
                                    "DepositStatus": "Refund",
                                    "DepositStatusId": "3",
                                    "PatientDepositId": item.PatientDepositId || null,
                                    "RefundDepositId": 0,
                                    "ReceiptNo": item.ReceiptNo || "",
                                    "RefundDate": $filter('date')($scope.DepositRefundObj.RefundDate, "MM-dd-yyyy"),
                                    "RefundAmount": refundPortion,
                                    "RefundByUserId": $scope.UserId,
                                    "RefundByUser": $scope.DepositRefundObj.RefundByUser || "",
                                    "DeleteInd": "N",
                                    "AppointmentId": item.AppointmentId || null,
                                    "PatientId": $scope.DepositRefundObj.PatientId || null,
                                    "RefundreasonId": $scope.DepositRefundObj.RefundreasonId || null,
                                    "RefundReason": $scope.DepositRefundObj.Refundreason || "",
                                    "Remarks": $scope.DepositRefundObj.Remarks || "",
                                    "CardtypeId": item.PatientDepositPaymodeList[0]?.CardtypeId || "",
                                    "RefundPaymentMethodId": $scope.DepositRefundObj.RefundPaymentMethodId || "",
                                    "RefundPaymentMethod": $scope.DepositRefundObj.RefundPaymentMethod || "",
                                    "RefundStatus": "Initiated",
                                    "RefundStatusId": "1",
                                    "ReferenceNumber": item.ReferenceNumber || "",
                                    "CardNumber": item.PatientDepositPaymodeList[0]?.CardNumber || "",
                                    "Transactions": [transaction], // each param has 1 transaction
                                    "PatientDepositPaymodeListId": item.PatientDepositPaymodeList[0]?.PatientDepositPaymodeListId || null,
                                    "PaymentTransactionTypeId": 3,
                                    "PaymentTransactionType": 'Refund'
                                };
                                FinalRefundParamsList.push(param);

                                remainingRefund -= refundPortion;
                            }
                        });

                        eHnoteInsuranceService.AddUpdateAllPatientDepositRefund(FinalRefundParamsList).then(function (resp) {
                            if (resp.data.Status === "Success") {
                                alertify.success("Updated Successfully");
                                $scope.uibclose();

                            } else {
                                alertify.error(resp.data.Message);
                            }
                        });

                    }
                    $scope.processeachRefund = function (item, sitem) {
                        //if ($scope.DepositRefundObj.RefundPaymentMethodId == 0) {
                        //    alertify.error("Please Select Refund Payment Method.");
                        //    return false;

                        //}

                        let mInstanceAdd = $uibModal.open({
                            "templateUrl": "RefundeachTransPopUp.html",
                            "backdrop": "static",
                            "keyboard": false,
                            /*"scope": $scope,*/
                            "size": "md",
                            // "windowClass": "modal__ninety--",
                            "resolve": {

                                "Patientobj": function () { return $scope.SearchPatientDepositsObj; },
                                "obj": function () { return obj; },
                                "HospitalId": function () { return $scope.HospitalId; },
                                "item": function () { return item; },
                                "sitem": function () { return sitem; },
                                "UserId": function () { return $scope.UserId; },
                                "PatientTotalUnallocated": function () { return $scope.PatientTotalUnallocated; },

                            },
                            "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, datapersistanceFactory, HospitalId, Patientobj, obj, sitem, item, UserId, PatientTotalUnallocated) {
                                $scope.Masterrefundreasons = obj.Masterrefundreasons || [];
                                $scope.UserId = UserId;
                                $scope.HospitalId = HospitalId;
                                $scope.PatientTotalUnallocated = PatientTotalUnallocated;
                                $scope.uibclose = function () {
                                    $uibModalInstance.dismiss("cancel");
                                };



                                $scope.getPatientDepositRefundObj = function () {
                                    return {
                                        "UserId": $scope.UserId,
                                        "RefundByUser": "",
                                        "OrganizationId": $scope.HospitalId,
                                        "PatientDepositId": null,
                                        "RefundDepositId": null,
                                        "ReceiptNo": "",
                                        "ReceiptId": 0,
                                        "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                                        "RefundAmount": $scope.PatientTotalUnallocated || 0,
                                        "RefundBy": "",
                                        "DeleteInd": "N",
                                        "AppointmentId": null,
                                        "PatientId": item.PatientId || null,
                                        "RefundreasonId": null,
                                        "Refundreason": null,
                                        "Remarks": null,
                                        "CardtypeId": null,
                                        "Cardtype": "",
                                        "RefundPaymentMethodId": 5,
                                        "RefundPaymentMethod": "Check",
                                        "ReceiptNumber": "",
                                        "ReferenceNumber": "",
                                        "CardNumber": "",
                                        "DepositStatus": "Refund",
                                        "DepositStatusId": "3",
                                        "Transactions": [],
                                        "PaymentTransactionTypeId": 3,
                                        "PaymentTransactionType": 'Refund'


                                    }
                                };

                                $scope.DepositRefundObj = angular.copy($scope.getPatientDepositRefundObj());

                                $scope.changeRefundReason = function (id) {
                                    var filtredArray = $filter("filter")($scope.Masterrefundreasons, { "RefundreasonId": id }, true) || [];
                                    if (filtredArray.length > 0) {
                                        $scope.DepositRefundObj.Refundreason = filtredArray[0].Refundreason || "";
                                    }
                                }


                                $scope.SaveDepositTransRefund = function () {
                                    $scope.mainNMITransactionid = "";
                                    if (sitem.NMITransactionId !== 0) {
                                        $scope.mainNMITransactionid = sitem.OnlineTransactionNumber || "";
                                    }
                                    if ($scope.mainNMITransactionid != "") {
                                        $scope.navtoNMIPatientRefund(item, sitem);
                                    }
                                    else {
                                        $scope.RefundDeposit(item, sitem);

                                    }


                                }




                                $scope.RefundDeposit = function (item, sitem) {


                                    let Transactions = [];
                                    $scope.DepositRefundObj.RefundAmount = parseFloat(sitem.TransactionAmount) || null;
                                    $scope.DepositRefundObj.RefundreasonId = $scope.DepositRefundObj.RefundreasonId || null;

                                    if ($scope.DepositRefundObj.RefundAmount == null) {
                                        alertify.error("Please Enter Refund Amount");
                                        return;
                                    }
                                    if ($scope.DepositRefundObj.RefundreasonId == null) {
                                        alertify.error("Please Select Refund Reason");
                                        return;
                                    }
                                    if ($scope.DepositRefundObj.Remarks == "" || $scope.DepositRefundObj.Remarks == null) {
                                        alertify.error("Please enter Refund remarks.");
                                        return false;
                                    }
                                    //if ($scope.RefundPaymentObj.RefundAmount > $scope.mainobj.UnBilledAmount) {
                                    //    alertify.error("RefundAmount exceeds the UnBilledAmount. Please Enter the Lesser Amount.");
                                    //    return;
                                    //}
                                    if ($scope.DepositRefundObj.RefundAmount != null) {
                                        let obj3 = {

                                            "UserId": $scope.UserId,
                                            "PatientId": item.PatientId || null,
                                            "RefundDepositId": null,
                                            "RefundTransactionId": 0,
                                            "PatientDepositId": item.PatientDepositId,
                                            "OrganizationId": $scope.HospitalId,
                                            "TransactionDate": $filter('date')($scope.DepositRefundObj.RefundDate, "MM-dd-yyyy"),
                                            "TransactionAmount": -+$scope.DepositRefundObj.RefundAmount,
                                            "RefundAmount": -+$scope.DepositRefundObj.RefundAmount,
                                            "TransactionSourceId": 3,
                                            "TransactionSource": "Patient",
                                            "DeleteInd": "N",

                                        }
                                        Transactions.push(obj3);
                                    }

                                    var params = {
                                        "UserId": $scope.UserId,
                                        "OrganizationId": $scope.HospitalId,
                                        "DepositStatus": "Refund",
                                        "DepositStatusId": "3",
                                        "PatientDepositId": item.PatientDepositId || null,
                                        "RefundDepositId": 0,
                                        "ReceiptNo": item.ReceiptNo || "",
                                        "RefundDate": $filter('date')($scope.DepositRefundObj.RefundDate, "MM-dd-yyyy"),
                                        "RefundAmount": $scope.DepositRefundObj.RefundAmount || null,
                                        "RefundByUserId": $scope.UserId,
                                        "RefundByUser": $scope.DepositRefundObj.RefundByUser || "",
                                        "DeleteInd": "N",
                                        "AppointmentId": item.AppointmentId || null,
                                        "PatientId": $scope.DepositRefundObj.PatientId || null,
                                        "RefundreasonId": $scope.DepositRefundObj.RefundreasonId || null,
                                        "RefundReason": $scope.DepositRefundObj.Refundreason || "",
                                        "Remarks": $scope.DepositRefundObj.Remarks || "",
                                        "CardtypeId": sitem.CardtypeId || "",
                                        "CardType": sitem.CardType || "",
                                        "RefundPaymentMethodId": sitem.PaymentMethodId || "",
                                        "RefundPaymentMethod": sitem.PaymentMethodName || "",
                                        "RefundStatus": "Initiated",
                                        "RefundStatusId": "1",
                                        "ReferenceNumber": item.ReferenceNumber || "",
                                        "CardNumber": sitem.CardNumber || "",
                                        "Transactions": Transactions || [],
                                        "PatientDepositPaymodeListId": sitem.PatientDepositPaymodeListId,
                                        "TransactionId": sitem.TransReciptNo,
                                        "PaymentTransactionTypeId": 3,
                                        "PaymentTransactionType": 'Refund'

                                    }

                                    console.log(JSON.stringify(params));


                                    eHnoteInsuranceService.AddUpdatePatientDepositRefund(params).then(function (resp) {
                                        if (resp.data.Status == "Success") {
                                            $uibModalInstance.close("cancel");
                                        }

                                    }, function (err) {

                                    });
                                }

                                $scope.navtoNMIPatientRefund = function (item, sitem) {
                                    $scope.DepositRefundObj.RefundAmount = sitem.TransactionAmount || null;
                                    $scope.DepositRefundObj.RefundreasonId = $scope.DepositRefundObj.RefundreasonId || null;
                                    if ($scope.DepositRefundObj.RefundAmount == null) {
                                        alertify.error("Please Enter Refund Amount");
                                        return;
                                    }
                                    if ($scope.DepositRefundObj.RefundreasonId == null) {
                                        alertify.error("Please Select Refund Reason");
                                        return;
                                    }
                                    if ($scope.DepositRefundObj.Remarks == "" || $scope.DepositRefundObj.Remarks == null) {
                                        alertify.error("Please enter Refund remarks.");
                                        return false;
                                    }

                                    if ($scope.mainNMITransactionid == "") {
                                        alertify.error("you cannot perform void, as TransactionId is empty");
                                        return false;
                                    }

                                    $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                                    $scope.mainNMITransactionObj.NMITransactionId = 0;
                                    $scope.mainNMITransactionObj.UserId = $scope.UserId;
                                    $scope.mainNMITransactionObj.PatientId = item.PatientId;
                                    $scope.mainNMITransactionObj.OrganizationId = item.OrganizationId;
                                    $scope.mainNMITransactionObj.PaymentAmount = sitem.TransactionAmount;
                                    $scope.mainNMITransactionObj.MerchentId = $scope.mainNMITransactionObj.MerchentId;
                                    $scope.mainNMITransactionObj.MerchentName = $scope.mainNMITransactionObj.MerchentName;
                                    $scope.mainNMITransactionObj.CardHolderName = item.PatientFullName || "";
                                    $scope.mainNMITransactionObj.PatientEmail = item.PatientEmailId || "";
                                    $scope.mainNMITransactionObj.PatientMobile = item.PatientMobile || "";

                                    if ($scope.mainNMITransactionObj.PatientMobile != "") {
                                        var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                                        $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                                    }

                                    $scope.mainNMITransactionObj.PatientMrNo = item.PatientDisplayId || "";
                                    $scope.mainNMITransactionObj.OrderId = "";
                                    $scope.mainNMITransactionObj.OrderDescription = $scope.DepositRefundObj.Refundreason || "";
                                    $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                                    $scope.mainNMITransactionObj.BillPaymentTypeId = sitem.BillPaymentTypeId || 0;
                                    $scope.mainNMITransactionObj.BillPaymentType = sitem.BillPaymentType || "";
                                    $scope.mainNMITransactionObj.ResponseId = 0;
                                    $scope.mainNMITransactionObj.ResponseCode = "";
                                    $scope.mainNMITransactionObj.ResponseText = "";
                                    $scope.mainNMITransactionObj.Status = "";
                                    $scope.mainNMITransactionObj.TransactionTypeId = 5;
                                    $scope.mainNMITransactionObj.TransactionType = "refund";
                                    $scope.mainNMITransactionObj.DeleteInd = "N";
                                    $scope.mainNMITransactionObj.Type = "refund";
                                    $scope.mainNMITransactionObj.AppointmentId = item.AppointmentId || 0;
                                    $scope.mainNMITransactionObj.VisitId = item.VisitId || 0;

                                    $scope.mainNMITransactionObj.PaymentModeId = $scope.RefundPaymentObj.RefundPaymentMethodId;
                                    $scope.mainNMITransactionObj.PaymentMode = $scope.RefundPaymentObj.RefundPaymentMethod;


                                    eHnotePaymentGatewayService.NMIPaymentTransactionRefund($scope.mainNMITransactionObj).then(function (resp) {
                                        var res = resp.data || {};
                                        console.log(res)
                                        if (res.Status == "Success") {
                                            alertify.success(res.Status);
                                            $scope.RefundDeposit(item, sitem);

                                        }
                                    })

                                };



                            }
                        })

                        mInstanceAdd.result.then(function () {
                            $scope.getPatientDepositAmountById();
                        }, function () {
                            $scope.getPatientDepositAmountById();
                        });


                    }

                    $scope.getPatientDepositAmountById = function () {
                        $scope.PatientTotalUnallocated = 0;
                        var obj = {
                            "DepositFrom": $scope.SearchPatientDepositsObj.DepositFrom || "",
                            "DepositTo": $scope.SearchPatientDepositsObj.DepositTo || "",
                            "PatientId": $scope.SearchPatientDepositsObj.PatientId,
                            "OrganizationId": $scope.SearchPatientDepositsObj.OrganizationId,
                            "PaymentModeId": 0,
                            "PageSize": 100,
                            "PageNumber": 1,
                            "TransactionNumber": "",
                            "SortBy": "Asc",
                        };
                        obj.PaymentModeId = parseInt(obj.PaymentModeId);
                        if (obj.DepositFrom != "") {
                            obj.DepositFrom = $filter("usdateFormatter")(obj.DepositFrom, "-");
                        }
                        if (obj.DepositTo != "") {
                            obj.DepositTo = $filter("usdateFormatter")(obj.DepositTo, "-");
                        }
                        eHnoteInsuranceService.GetPatientDepositAmountList(obj).then(function (resp) {
                            $scope.PatientDepositsListArray = [];

                            if (resp.data.status === "Success") {
                                $scope.PatientDepositsListArray = resp.data.rows || [];
                                if ($scope.PatientDepositsListArray.length > 0) {
                                    angular.forEach($scope.PatientDepositsListArray, function (item) {
                                        item.IsChecked = false;
                                        var uniqueMap = {};

                                        (item.PatientDepositPaymodeList || []).forEach(function (bitem) {
                                            var original = bitem.DepositTypeName || "";
                                            var key = original.replace(/\s+/g, '').toLowerCase();
                                            if (!uniqueMap[key]) {
                                                uniqueMap[key] = original; // keep first occurrence
                                            }
                                        });

                                        item.DepositTypeNames = Object.values(uniqueMap).join(',') || item.DepositTypeName || "";
                                        if (item.UnBilledAmount >= 0) {
                                            $scope.PatientTotalUnallocated += item.UnBilledAmount;
                                            $scope.PatientTotalUnallocated = parseFloat($scope.PatientTotalUnallocated.toFixed(2));
                                        }
                                    });

                                }
                                $scope.PatientDepositsDataArray = [];
                                $scope.PatientDepositsDataArray = $scope.PatientDepositsListArray.filter(item => item.UnBilledAmount > 0) || [];
                                $scope.DepositRefundObj = angular.copy($scope.getDepositRefundObj());

                            } else {
                                alertify.error(resp.data.Message);
                            }
                        });
                    }



                    $scope.opentransactionlist = function (item) {
                        angular.forEach($scope.PatientDepositsDataArray, function (sitem) {
                            if (sitem !== item) {
                                sitem.Isshow = false;
                            }
                        });
                        item.Isshow = !item.Isshow;
                        if (!item.Isshow) return;
                        item.PatientDepositTransactionList = [];

                        var obj = {
                            "PatientId": item.PatientId,
                            //"OrganizationId": item.OrganizationId,
                            "PatientDepositId": item.PatientDepositId
                        };

                        eHnoteInsuranceService.GetPatientDepositTransactionList(obj).then(function (resp) {
                            if (resp.data.Status === "Success") {
                                var allTransactions = resp.data.rows || [];
                                item.PatientDepositTransactionList = allTransactions.filter(function (t) {
                                    return t.PaymentTransactionTypeId !== 4 && t.PaymentTransactionTypeId !== 6;
                                });
                            } else {
                                alertify.error(resp.data.Message);
                            }
                        });
                    };


                    $scope.AddEachDepositRefund = function (item, ID) {
                        $scope.ViewDepositScreen = false;
                        var obj = {
                            "AllCardTypes": $scope.AllCardTypes || [],
                            "Masterrefundreasons": $scope.Masterrefundreasons || [],
                            "AllUsersList": $scope.AllUsersList || [],
                        }
                        let mInstanceAdd = $uibModal.open({
                            "templateUrl": "RefundDepositpopup.html",
                            "backdrop": "static",
                            "size": "lg",
                            "keyboard": false,
                            "windowClass": "",
                            "resolve": {
                                //"PatientDepositsListArray": function () { return $scope.PatientDepositsListArray; },
                                "mainobj": function () { return item; },
                                "obj": function () { return obj; },
                                "ID": function () { return ID; },

                            },
                            "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, mainobj, datapersistanceFactory, obj, eHnoteInsuranceService, ID) {
                                ID = ID || '';
                                $scope.mainNMITransactionid = "";

                                //if (mainobj.NMITransactionId !== 0) {
                                //    $scope.mainNMITransactionid = mainobj.OnlineTransactionNumber || "";
                                //}
                                $scope.IsRefundDisable = true;

                                var mObj = datapersistanceFactory.getItem("masterDataArrays");
                                $scope.masterPaymentModes = [];
                                if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
                                    $scope.masterPaymentModes = mObj.PaymentModes;
                                    $scope.filterPaymentModes = function (item) {
                                        return ![13, 14].includes(item.PaymentModeId);
                                    };
                                };
                                var doctorinfo = eHnoteMasterDataService.getUserInfo();
                                $scope.UserId = eHnoteMasterDataService.getLoginId();
                                $scope.ParenthospitalId = 0;
                                $scope.HospitalId = 0;
                                if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                                    $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
                                    $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                                    $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                                    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
                                };
                                $scope.mainobj = mainobj;
                                $scope.Masterrefundreasons = obj.Masterrefundreasons || [];
                                $scope.AllCardTypes = obj.AllCardTypes || [];
                                $scope.AllUsersList = obj.AllUsersList || [];

                                $scope.GetRefundpaymentObj = function () {
                                    var obj = {
                                        "UserId": $scope.UserId,
                                        "RefundByUser": "",
                                        "OrganizationId": $scope.mainobj.OrganizationId,
                                        "PatientDepositId": $scope.mainobj.PatientDepositId || null,
                                        "RefundDepositId": null,
                                        "ReceiptNo": $scope.mainobj.ReceiptNo || "",
                                        "ReceiptId": 0,
                                        "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                                        "RefundAmount": mainobj.UnBilledAmount || null,
                                        "RefundBy": "",
                                        "DeleteInd": "N",
                                        "AppointmentId": $scope.mainobj.AppointmentID || null,
                                        "PatientId": $scope.mainobj.PatientId || null,
                                        "RefundreasonId": null,
                                        "Refundreason": null,
                                        "Remarks": null,
                                        "CardtypeId": null,
                                        "Cardtype": "",
                                        "RefundPaymentMethodId": 5,
                                        "RefundPaymentMethod": "Check",
                                        "ReceiptNumber": "",
                                        "ReferenceNumber": "",
                                        "CardNumber": "",
                                        "DepositStatus": "Refund",
                                        "DepositStatusId": "3",
                                        "Transactions": [],
                                        "IsCheckedRefund": false,


                                    }

                                    return obj;
                                };

                                $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());

                                if (mainobj.PatientDepositPaymodeList.length == 1) {
                                    if (mainobj.PatientDepositPaymodeList[0].NMITransactionId !== 0) {
                                        $scope.mainNMITransactionid = mainobj.PatientDepositPaymodeList[0].OnlineTransactionNumber || "";
                                    }
                                }

                                $scope.handlePatPaymentRefundCheckbox = function (item) {
                                    if (item.IsCheckedRefund == true) {
                                        if (mainobj.PatientDepositPaymodeList.length == 1) {
                                            if (mainobj.PatientDepositPaymodeList[0].NMITransactionId !== 0) {
                                                $scope.RefundPaymentObj.RefundPaymentMethodId = mainobj.PatientDepositPaymodeList[0].PaymentMethodId || 5;
                                                $scope.RefundPaymentObj.RefundPaymentMethod = mainobj.PatientDepositPaymodeList[0].PaymentMethodName || '';
                                                $scope.RefundPaymentObj.CardtypeId = mainobj.PatientDepositPaymodeList[0].CardtypeId || null;
                                                $scope.RefundPaymentObj.Cardtype = mainobj.PatientDepositPaymodeList[0].CardType || null;
                                                $scope.RefundPaymentObj.CardNumber = mainobj.PatientDepositPaymodeList[0].CardNumber || '';
                                            }
                                        }
                                        $scope.RefundPaymentObj.IsCheckedRefund = true;
                                    } else {
                                        $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());
                                        $scope.RefundPaymentObj.IsCheckedRefund = false;
                                    }
                                };


                                $scope.changeIndividualRefund = function (amount) {
                                    if (amount > mainobj.UnBilledAmount) {
                                        alertify.error("Refund Amount should not be greater than the Unallocated Deposit Amount.");
                                        $scope.RefundPaymentObj.RefundAmount = '';
                                        return false;
                                    } else {

                                    }
                                }

                                $scope.init = function () {

                                    /* $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());*/

                                    var filtredArray = $filter("filter")($scope.AllUsersList, { "DoctorID": $scope.UserId }, true) || [];
                                    if (filtredArray.length > 0) {
                                        $scope.RefundPaymentObj.RefundByUser = filtredArray[0].FullName || "";
                                    }
                                }
                                $scope.init();



                                $scope.changeRefund = function (id) {
                                    var filtredArray = $filter("filter")($scope.Masterrefundreasons, { "RefundreasonId": id }, true) || [];
                                    if (filtredArray.length > 0) {
                                        $scope.RefundPaymentObj.Refundreason = filtredArray[0].Refundreason || "";
                                    }
                                }
                                $scope.ChangePaymentMode = function (id) {
                                    var filtredArray = $filter("filter")($scope.masterPaymentModes, { "PaymentModeId": id }, true) || [];
                                    if (filtredArray.length > 0) {
                                        $scope.RefundPaymentObj.RefundPaymentMethod = filtredArray[0].PaymentModeName || "";
                                    }
                                }

                                $scope.PatientRefund = function () {


                                    let Transactions = [];
                                    $scope.RefundPaymentObj.RefundAmount = parseFloat($scope.RefundPaymentObj.RefundAmount) || null;
                                    $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
                                    if ($scope.RefundPaymentObj.RefundreasonId == null) {
                                        alertify.error("Please Select Refund Reason");
                                        return;
                                    }
                                    if ($scope.RefundPaymentObj.RefundAmount == null || $scope.RefundPaymentObj.RefundAmount == 0) {
                                        alertify.error("Please Enter Refund Amount");
                                        return;
                                    }
                                    if ($scope.RefundPaymentObj.RefundAmount > $scope.mainobj.UnBilledAmount) {
                                        alertify.error("RefundAmount exceeds the UnBilledAmount. Please Enter the Lesser Amount.");
                                        return;
                                    }
                                    if ($scope.RefundPaymentObj.Remarks == "" || $scope.RefundPaymentObj.Remarks == null) {
                                        alertify.error("Please enter Refund remarks.");
                                        return false;
                                    }
                                    if ($scope.RefundPaymentObj.RefundAmount != null) {
                                        let obj3 = {

                                            "UserId": $scope.UserId,
                                            "PatientId": $scope.mainobj.PatientId || null,
                                            "RefundDepositId": null,
                                            "RefundTransactionId": 0,
                                            "PatientDepositId": $scope.mainobj.PatientDepositId,
                                            "OrganizationId": $scope.RefundPaymentObj.OrganizationId,
                                            "TransactionDate": $filter('date')($scope.RefundPaymentObj.RefundDate, "MM-dd-yyyy"),
                                            "TransactionAmount": -+$scope.RefundPaymentObj.RefundAmount,
                                            "RefundAmount": -+$scope.RefundPaymentObj.RefundAmount,
                                            "TransactionSourceId": 3,
                                            "TransactionSource": "Patient",
                                            "DeleteInd": "N",

                                        }
                                        Transactions.push(obj3);
                                    }

                                    var params = {
                                        "UserId": $scope.UserId,
                                        "OrganizationId": $scope.RefundPaymentObj.OrganizationId,
                                        "DepositStatus": "Refund",
                                        "DepositStatusId": "3",
                                        "PatientDepositId": $scope.RefundPaymentObj.PatientDepositId || null,
                                        "RefundDepositId": null,
                                        "ReceiptNo": $scope.RefundPaymentObj.ReceiptNo || "",
                                        "RefundDate": $filter('date')($scope.RefundPaymentObj.RefundDate, "MM-dd-yyyy"),
                                        "RefundAmount": $scope.RefundPaymentObj.RefundAmount || null,
                                        "RefundByUserId": $scope.UserId,
                                        "RefundByUser": $scope.RefundPaymentObj.RefundByUser || "",
                                        "DeleteInd": "N",
                                        "AppointmentId": $scope.RefundPaymentObj.AppointmentId || null,
                                        "PatientId": $scope.RefundPaymentObj.PatientId || null,
                                        "RefundreasonId": $scope.RefundPaymentObj.RefundreasonId || null,
                                        "RefundReason": $scope.RefundPaymentObj.Refundreason || "",
                                        "Remarks": $scope.RefundPaymentObj.Remarks || "",
                                        "CardtypeId": $scope.RefundPaymentObj.CardtypeId || "",
                                        "RefundPaymentMethodId": $scope.RefundPaymentObj.RefundPaymentMethodId || "",
                                        "RefundPaymentMethod": $scope.RefundPaymentObj.RefundPaymentMethod || "",
                                        "RefundStatus": "Initiated",
                                        "RefundStatusId": "1",
                                        "ReferenceNumber": $scope.RefundPaymentObj.ReferenceNumber || "",
                                        "CardNumber": $scope.RefundPaymentObj.CardNumber || "",
                                        "Transactions": Transactions || [],
                                        "PatientDepositPaymodeListId": mainobj.PatientDepositPaymodeListId,
                                        "PaymentTransactionTypeId": 3,
                                        "PaymentTransactionType": 'Refund',
                                        "DepositTypeId": $scope.mainobj.DepositTypeId || 0,
                                        "DepositTypeName": $scope.mainobj.DepositTypeName || "",

                                    }

                                    console.log(JSON.stringify(params));


                                    eHnoteInsuranceService.AddUpdatePatientDepositRefund(params).then(function (resp) {
                                        if (resp.data.Status == "Success") {
                                            $uibModalInstance.close("cancel");
                                        }

                                    }, function (err) {

                                    });
                                }


                                $scope.navtoNMIPatientRefund = function (item) {
                                    $scope.RefundPaymentObj.RefundAmount = $scope.RefundPaymentObj.RefundAmount || null;
                                    $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
                                    if ($scope.RefundPaymentObj.RefundAmount == null) {
                                        alertify.error("Please Enter Refund Amount");
                                        return;
                                    }
                                    if ($scope.RefundPaymentObj.RefundreasonId == null) {
                                        alertify.error("Please Select Refund Reason");
                                        return;
                                    }

                                    if ($scope.mainNMITransactionid == "") {
                                        alertify.error("you cannot perform void, as TransactionId is empty");
                                        return false;
                                    }
                                    $scope.RefundPaymentObj.Remarks = $scope.RefundPaymentObj.Remarks || "";
                                    if ($scope.RefundPaymentObj.Remarks == "" || $scope.RefundPaymentObj.Remarks == null) {
                                        alertify.error("Please enter Refund remarks.");
                                        return false;
                                    }

                                    $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                                    $scope.mainNMITransactionObj.NMITransactionId = 0;
                                    $scope.mainNMITransactionObj.UserId = $scope.UserId;
                                    $scope.mainNMITransactionObj.PatientId = $scope.mainobj.PatientId;
                                    $scope.mainNMITransactionObj.OrganizationId = $scope.mainobj.OrganizationId;
                                    $scope.mainNMITransactionObj.PaymentAmount = $scope.RefundPaymentObj.RefundAmount;
                                    $scope.mainNMITransactionObj.MerchentId = $scope.mainNMITransactionObj.MerchentId;
                                    $scope.mainNMITransactionObj.MerchentName = $scope.mainNMITransactionObj.MerchentName;
                                    $scope.mainNMITransactionObj.CardHolderName = $scope.mainobj.PatientFullName || "";
                                    $scope.mainNMITransactionObj.PatientEmail = $scope.mainobj.PatientEmailId || "";
                                    $scope.mainNMITransactionObj.PatientMobile = $scope.mainobj.PatientMobile || "";

                                    if ($scope.mainNMITransactionObj.PatientMobile != "") {
                                        var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                                        $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                                    }

                                    $scope.mainNMITransactionObj.PatientMrNo = $scope.mainobj.PatientDisplayId || "";
                                    $scope.mainNMITransactionObj.OrderId = "";
                                    $scope.mainNMITransactionObj.OrderDescription = $scope.RefundPaymentObj.Refundreason || "";
                                    $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                                    $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.mainobj.PatientDepositPaymodeList[0].BillPaymentTypeId || 0;
                                    $scope.mainNMITransactionObj.BillPaymentType = $scope.mainobj.PatientDepositPaymodeList[0].BillPaymentType || "";
                                    $scope.mainNMITransactionObj.ResponseId = 0;
                                    $scope.mainNMITransactionObj.ResponseCode = "";
                                    $scope.mainNMITransactionObj.ResponseText = "";
                                    $scope.mainNMITransactionObj.Status = "";
                                    $scope.mainNMITransactionObj.TransactionTypeId = 5;
                                    $scope.mainNMITransactionObj.TransactionType = "refund";
                                    $scope.mainNMITransactionObj.DeleteInd = "N";
                                    $scope.mainNMITransactionObj.Type = "refund";
                                    $scope.mainNMITransactionObj.AppointmentId = $scope.mainobj.AppointmentId || 0;
                                    $scope.mainNMITransactionObj.VisitId = $scope.mainobj.VisitId || 0;


                                    eHnotePaymentGatewayService.NMIPaymentTransactionRefund($scope.mainNMITransactionObj).then(function (resp) {
                                        var res = resp.data || {};
                                        console.log(res)
                                        if (res.Status == "Success") {
                                            alertify.success(res.Status);

                                            $scope.PatientRefund();
                                        }
                                    })

                                };

                                $scope.uibclose = function () {
                                    $uibModalInstance.dismiss("cancel");
                                };
                            }

                        });

                        mInstanceAdd.result.then(function () {

                            $scope.getPatientDepositAmountById();
                            //$scope.ViewDepositScreen = false;
                            //$scope.ClearPatientDeposit();

                        }, function () { });
                    }

                }

            });
            mInstanceAdd.result.then(function () {

                $scope.getPatientDepositAmountById();
                $scope.ViewDepositScreen = false;
                $scope.ClearPatientDeposit();

            }, function () {
                $scope.getPatientDepositAmountById();
            });
        }

        $scope.OpenNewDepositPopup = function () {
            $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());
            var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": $scope.HospitalId }, true) || [];
            if (filtredArray.length > 0) {
                $scope.PatientDepositsObj.BillingProviderId = filtredArray[0].DefaultBillingProviderId;
                $scope.PatientDepositsObj.OrganizationFacilityId = filtredArray[0].BranchId;
                $scope.PatientDepositsObj.FacilityName = filtredArray[0].BranchName;
            }
            $scope.ViewDepositScreen = true;
            $scope.ViewEditDepositScreen = true;
            $scope.IsShowDepositScreen = false;
            $scope.IsShowCollectaddPayment = false;
            //$scope.addNewDepositPopup();
        }

        $scope.CloseDepositPopup = function () {
            $scope.ViewDepositScreen = false;
        }

        $scope.addNewDepositPopup = function (item) {
            item = item || null;
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "addNewDepositsPopup.html",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "offcanves-right modal__width--30",
                "resolve": {
                    "item": function () { return item; },
                    "PatientDepositsObj": function () { return $scope.PatientDepositsObj; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, item, PatientDepositsObj) {

                    $scope.PatientDepositsObj = PatientDepositsObj || {};

                    if (item != null) {
                        $scope.IsAddDepositbtn = true;
                        $scope.ViewDepositScreen = true;
                        $scope.IsShowDepositScreen = true;
                        $scope.PatientDepositsObj.AddressLine1 = item.AddressLine1;
                        $scope.PatientDepositsObj.AddressLine2 = item.AddressLine2;
                        $scope.PatientDepositsObj.BilledAmount = item.BilledAmount;
                        $scope.PatientDepositsObj.CityName = item.CityName;
                        $scope.PatientDepositsObj.CountryName = item.CountryName;
                        $scope.PatientDepositsObj.CreatedBy = item.CreatedBy;
                        $scope.PatientDepositsObj.DOB = item.DOB;
                        $scope.PatientDepositsObj.DepositStatus = item.DepositStatus;
                        $scope.PatientDepositsObj.DepositStatusId = item.DepositStatusId;
                        $scope.PatientDepositsObj.DepositedBy = item.DepositedBy;
                        $scope.PatientDepositsObj.Gender = item.Gender;
                        $scope.PatientDepositsObj.OrganizationId = item.OrganizationId;
                        $scope.PatientDepositsObj.OrganizationName = item.OrganizationName;
                        $scope.PatientDepositsObj.PatientDisplayId = item.PatientDisplayId;
                        $scope.PatientDepositsObj.PatientFullName = item.PatientFullName;
                        $scope.PatientDepositsObj.PatientId = item.PatientId;
                        $scope.PatientDepositsObj.PatientMobile = item.PatientMobile;
                        $scope.PatientDepositsObj.PatientVoidDepositId = item.PatientVoidDepositId;
                        $scope.PatientDepositsObj.ReceiptId = item.ReceiptId;
                        $scope.PatientDepositsObj.StateCode = item.StateCode;
                        $scope.PatientDepositsObj.StateName = item.StateName;
                        $scope.PatientDepositsObj.Title = item.Title;
                        $scope.PatientDepositsObj.TotalPatientBalance = item.TotalPatientBalance;
                        $scope.PatientDepositsObj.VoidRemarks = item.VoidRemarks;
                        $scope.PatientDepositsObj.ZipCode = item.ZipCode;
                        $scope.PatientDepositsObj.AgeInMonths = item.AgeInMonths;
                        $scope.PatientDepositsObj.AgeInYears = item.AgeInYears;

                        $scope.PatientDepositsObj.PatientDepositId = item.PatientDepositId;
                        $scope.PatientDepositsObj.PaymentMethodId = item.PaymentMethodId;
                        $scope.PatientDepositsObj.PaymentMethodName = item.PaymentMethodName;
                        $scope.PatientDepositsObj.BatchNumber = item.BatchNumber;
                        $scope.PatientDepositsObj.DepositDate = item.DepositDate || "";
                        $scope.PatientDepositsObj.PaymentDate = $filter('date')(item.PaymentDate, 'MM-dd-yyyy');
                        if ($scope.PatientDepositsObj.DepositDate != "") {
                            $scope.PatientDepositsObj.DepositDate = $filter('date')($scope.PatientDepositsObj.DepositDate, 'MM-dd-yyyy');
                        }
                        $scope.PatientDepositsObj.AppointmentId = item.AppointmentID;
                        $scope.PatientDepositsObj.OrganizationFacilityId = item.OrganizationFacilityId;
                        $scope.PatientDepositsObj.FacilityName = item.FacilityName;
                        $scope.PatientDepositsObj.BillingProviderId = item.BillingProviderId;
                        $scope.PatientDepositsObj.BillingProviderObj = item.BillingProviderName;
                        $scope.PatientDepositsObj.DepositTypeId = item.DepositTypeId;
                        $scope.PatientDepositsObj.DepositTypeName = item.DepositTypeName;
                        $scope.PatientDepositsObj.DepositAmount = item.DepositAmount;
                        $scope.PatientDepositsObj.ReceiptNo = item.ReceiptNo;
                        $scope.PatientDepositsObj.PatientDepositId = item.PatientDepositId;
                        $scope.PatientDepositsObj.Notes = item.Notes;
                        $scope.PatientDepositsObj.IsDepositPrint = false;
                        $scope.PatientDepositsObj.UnBilledAmount = item.UnBilledAmount;
                        $scope.PatientDepositsObj.PatientDepositPaymodeList = [];

                        if (item.PatientDepositPaymodeList.length > 0) {
                            angular.forEach(item.PatientDepositPaymodeList, function (item) {
                                item.IsDepositAdded = true;
                                item.PaymentDate = $filter('date')(item.PaymentDate, 'MM-dd-yyyy');
                                $scope.PatientDepositsObj.PatientDepositPaymodeList.push(item);
                            });
                        } else {
                            $scope.PatientDepositsObj.PatientDepositPaymodeList.push($scope.GetPatientDepositPaymodeList[0]);
                        }

                        $scope.showNotes = true;
                    }

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.AddDepositData = function () {

                        if ($scope.PatientDepositsObj.PatientDepositPaymodeList.length == 0) {
                            alertify.error("Please Enter Amount ");
                            return;
                        } else {
                            $uibModalInstance.close("cancel");
                        }

                    }
                }
            });
            mInstanceAdd.result.then(function (resp) {
                console.log(resp);
                $scope.AddUpdatePatientDeposit();
            }, function (cancel) {
            });
        };

        $scope.EditpatientDepositlist = function (item) {
            item = item || null;
            $scope.addNewDepositPopup(item);
        }



        $scope.EditPaymentMethod = function (item, index, value) {
            item = item || null;
            $scope.IsdisabledPatAmt = true;
            $scope.editIndex = index; // Store index for updating
            $scope.Editdata = value;
            $scope.PaymentMethodObj = {
                PatientDepositPaymodeListId: item.PatientDepositPaymodeListId || 0,
                PaymentMethodId: item.PaymentMethodId || 0,
                PaymentMethodName: item.PaymentMethodName || '',
                DepositAmount: item.DepositAmount || 0,
                ReferenceNumber: item.ReferenceNumber || '',
                IsDepositAdded: item.IsDepositAdded || false,
                DeleteInd: item.DeleteInd || 'N',
                PatientDepositId: item.PatientDepositId || null,
                CardNumber: item.CardNumber || '',
                CardType: item.CardType || '',
                CardtypeId: item.CardtypeId || 0
            };
            $scope.addPaymentPopup($scope.PaymentMethodObj)
        };

        $scope.addPaymentPopup = function (item) {
            item = item || null;
            if ($scope.editIndex != null) {
                $scope.editIndex = $scope.editIndex;
            } else {
                $scope.editIndex = null;
            }
            var obj = {
                "PatientDetails": $scope.PatientDetails,
                "AllUsersList": $scope.AllUsersList,
                "masterPaymentModes": $scope.masterPaymentModes,
                "AllCardTypes": $scope.AllCardTypes,
                "item": item,
                "editIndex": $scope.editIndex,
            }

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "addPaymentPopupNew.html",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__sixty--",
                "resolve": {
                    "Obj": function () { return obj; }
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, Obj) {

                    $scope.AllDoctorList = Obj.AllUsersList || null;
                    $scope.allUserList = Obj.AllUsersList;
                    $scope.masterPaymentModes = Obj.masterPaymentModes;
                    $scope.masterPaymentModes = $filter('filter')($scope.masterPaymentModes, function (Pitem) {
                        return Pitem.PaymentModeId != 14 && Pitem.PaymentModeId != 13;
                    }) || [];

                    $scope.AllCardTypes = Obj.AllCardTypes;
                    $scope.editIndex = Obj.editIndex;
                    $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                    $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                        return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57;
                    });

                    $scope.addNotes = function () {
                        $scope.showNotes = !$scope.showNotes;
                    }
                    function getemptyPaymentreqObj() {
                        var obj = {
                            "UserBranchId": 0,
                            "RenderingProviderId": 0,
                            "RenderingProviderName": "",
                            "RenderingProviderObj": {
                                "SecondUserFullName": ""
                            },
                            "RecievedUserId": 0,
                            "RecievedUserName": "",
                            "RecievedUserObj": {
                                "SecondUserFullName": ""
                            },
                        }
                    }
                    $scope.PaymentRequestObj = getemptyPaymentreqObj();
                    $scope.changePaymentProvider = function (item) {
                        $scope.PaymentRequestObj.RenderingProviderId = item.DoctorID;
                        $scope.PaymentRequestObj.RenderingProviderName = item.DoctorName;
                        $scope.PaymentRequestObj.UserBranchId = item.UserBranchId;
                        $scope.PaymentRequestObj.RenderingProviderObj = item || '';
                    };

                    $scope.changePaymentReciever = function (item) {
                        $scope.PaymentRequestObj.RecievedUserId = item.DoctorID;
                        $scope.PaymentRequestObj.RecievedUserName = item.DoctorName;
                        $scope.PaymentRequestObj.RecievedUserObj = item || '';
                    };

                    if ($scope.editIndex != null) {
                        $scope.PaymentMethodObj = {
                            PatientDepositPaymodeListId: item.PatientDepositPaymodeListId || 0,
                            PaymentMethodId: item.PaymentMethodId || 0,
                            PaymentMethodName: item.PaymentMethodName || '',
                            DepositAmount: item.DepositAmount || 0,
                            ReferenceNumber: item.ReferenceNumber || '',
                            IsDepositAdded: item.IsDepositAdded || false,
                            DeleteInd: item.DeleteInd || 'N',
                            PatientDepositId: item.PatientDepositId || null,
                            CardNumber: item.CardNumber || '',
                            CardType: item.CardType || '',
                            CardtypeId: item.CardtypeId || 0
                        };
                    } else {
                        $scope.GetPaymentmethodList = function () {
                            var Obj = {
                                "PatientDepositPaymodeListId": 0,
                                "PaymentMethodId": 1,
                                "PaymentMethodName": "Cash",
                                "DepositAmount": "",
                                "ReferenceNumber": "",
                                "IsDepositAdded": false,
                                "DeleteInd": "N",
                                "PatientDepositId": null,
                                "CardNumber": "",
                                "CardType": "",
                                "CardtypeId": 0,
                                "NMITransactionId": ""
                            }
                            return Obj;
                        }

                        $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                    }

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.AddPaymentmodes = function (item) {

                        if (item.DepositAmount == "") {
                            alertify.error("Please enter deposit amount");
                            return;
                        } else if (item.DepositAmount === "0") {
                            alertify.error("Please enter deposit amount Greater than Zero");
                            return;
                        } else {
                        }

                        if (item.PaymentMethodId == 2 || item.PaymentMethodId == 3) {
                            if (item.CardtypeId == 0) {
                                alertify.error("Please select Card Type");
                                return;
                            }
                            if (item.CardNumber == '' || item.CardNumber.trim().length < 4) {
                                alertify.error("Please Enter Card Last 4 digits");
                                return;
                            }
                        }

                        $uibModalInstance.close(item);
                    }
                    $scope.ChangePaymentModelist = function (Id, item) {
                        var FilterPaymentmode = $filter('filter')($scope.masterPaymentModes, function (Pitem) { return Pitem.PaymentModeId === Id; }) || [];
                        if (FilterPaymentmode.length != 0) {
                            $scope.PaymentMethodObj.PaymentMethodName = FilterPaymentmode[0].PaymentModeName;
                        }

                    }
                }
            });
            mInstanceAdd.result.then(function (resp) {
                console.log(resp);
                $scope.AddMultipleDepositsList(resp);
            }, function (cancel) {
            });
        };


        $scope.geteachtransactionprint = function () {
            var Obj = {
                "TransactionDate": '',
                "TransReciptNo": '',
                "PaymentMethodName": '',
                "CardNumber": '',
                "OnlineTransactionNumber": '',
                "CardType": '',
                "TransactionAmount": 0,
                "ReceiptNumber": '',
                "InvoiceNumber": '',
                "PatientClaimNumber": '',
                "CityTown": '',
                "State": '',
                "Country": '',
                "FaxNumber": '',
                "OrganizationName": '',
                "ClaimNumbers": '',
                "ClaimData": [],
            }
            return Obj;
        }
        $scope.DepositTransactionObj = angular.copy($scope.geteachtransactionprint());

        $scope.AddAnotherPaymentMode = function (item, id) {
            $scope.IsPaymentMode = false;
            $scope.ViewDepositScreen = false;
            var obj = $scope.GetPatientDepositsObj();

            obj.PatientDepositId = item.PatientDepositId;
            obj.PatientId = item.PatientId;
            obj.ReceiptId = item.ReceiptId;
            obj.ReceiptNo = item.ReceiptNo;
            obj.DepositDate = $filter('date')(item.DepositDate, "MM-dd-yyyy");
            obj.PaymentDate = $filter('date')(item.PaymentDate, "MM-dd-yyyy");
            obj.DepositAmount = 0;
            obj.UnBilledAmount = item.UnBilledAmount;
            obj.BilledAmount = item.BilledAmount;
            obj.Notes = item.Notes;
            obj.DepositedBy = item.DepositedBy;
            obj.DepositedByUserId = $scope.UserId; // Or fetch from item if needed
            obj.OrganizationId = item.OrganizationId;
            obj.OrganizationFacilityId = item.OrganizationFacilityId;
            obj.FacilityName = item.FacilityName;
            obj.BillingProviderId = item.BillingProviderId;
            obj.BillingProviderName = item.BillingProviderName;
            obj.DepositTypeId = item.DepositTypeId;
            obj.DepositTypeName = item.DepositTypeName;
            obj.PaymentMethodId = item.PaymentMethodId;
            obj.PaymentMethodName = item.PaymentMethodName;
            obj.BatchNumber = item.BatchNumber || '';
            obj.AppointmentId = item.AppointmentID;

            obj.IsDepositPrint = false;
            obj.DepositStatusId = item.DepositStatusId;
            obj.DepositStatus = item.DepositStatus;



            $scope.PatientDepositsObj = obj;
            console.log($scope.PatientDetails);

            if ($scope.PatientDepositsObj.PatientId === 0) {
                alertify.error("Please Select Patient ");
                return;
            }


            //if ($scope.PatientDepositsObj.OrganizationFacilityId === 0) {
            //    alertify.error("Please select the location ");
            //    return;
            //}


            var Parentobj = {
                "PatientId": $scope.PatientDepositsObj.PatientId,
                "AppointmentId": $scope.PatientDepositsObj.AppointmentId,
                "PatientFirstName": $scope.PatientDetails.FirstName,
                "PatientLastName": $scope.PatientDetails.LastName,
                "PatientDisplayId": $scope.PatientDetails.PatientDisplayId,
                "PatientEmailId": $scope.PatientDetails.EmailId,
                "PatientGender": $scope.PatientDetails.Gender,
                "PatientAgeInYears": $scope.PatientDetails.AgeInYears,
                "PatientAgeInMonths": $scope.PatientDetails.AgeInMonths,
                "PatientDOB": $scope.PatientDetails.DOB,
                "PatientMobileNumber": $scope.PatientDetails.MobileNo,
                "PatientZipCode": $scope.PatientDetails.ZipCode,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "PaymentAmount": $scope.PatientDepositsObj.DepositAmount,
                "DepositDate": $scope.PatientDepositsObj.DepositDate,
                "PaymentModeId": 1,
                "PaymentMode": "Cash",
                "PaymentTypeId": 1,
                "PaymentType": "Deposit",
                "ScreenType": "AddDeposit",
                "AllCardTypes": $scope.AllCardTypes,
                "BillingProviderId": $scope.PatientDepositsObj.BillingProviderId,
                "IsDepositPrint": $scope.PatientDepositsObj.IsDepositPrint,
                "PatientDataObj": $scope.SelectedPatientDetails.PatientObj || {},
                "PatientDepositsObj": $scope.PatientDepositsObj || {},
                "DepositTypeId": $scope.PatientDepositsObj.DepositTypeId,
                "DepositType": $scope.PatientDepositsObj.DepositTypeName,
                "Notes": $scope.PatientDepositsObj.Notes,
                "PatientClaimId": $scope.Selectobj.PatientClaimId || null,
                "mainBillerDataObj": $scope.Selectobj.mainBillerDataObj || {},
                "IsPaymentMode": $scope.IsPaymentMode,
                "RenderingProviderId": item.RenderingProviderId || 0,
                "RenderingProviderName": item.RenderingProviderName || "",
                "DepositTypes": $scope.DepositTypes,
                "DepositscreenTypeId": id,
            }
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/collectPayment.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "resolve": {
                    "Parentobj": function () { return Parentobj; }
                },
                "windowClass": "modal__sixty--  ",
                "controller": "UsMainNmiPaymentCtrl",
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                console.log(resp);
                if (resp != undefined) {
                    if (resp.Status === "Success") {

                        $scope.SelectedPatientDetails.DepositsObj = angular.copy($scope.PatientDepositsObj) || "";
                        $scope.SelectedPatientDetails.DepositsObj.IsDepositPrint = resp.IsDepositPrint || false;
                        if ($scope.SelectedPatientDetails.DepositsObj.IsDepositPrint == true) {
                            $scope.SelectedPatientDetails.DepositsObj.ReceiptNo = resp.ReceiptNo || '';
                            $scope.SelectedPatientDetails.DepositsObj.CreatedBy = resp.CreatedBy || '';
                            $scope.SelectedPatientDetails.DepositsObj.BillingProviderName = resp.BillingProviderName || '';
                            $scope.SelectedPatientDetails.DepositsObj.PatientDepositPaymodeList = resp.PatientDepositPaymodeList || [];
                            /*$scope.AddDespositePrint($scope.SelectedPatientDetails.DepositsObj, $scope.SelectedPatientDetails.PatientObj, 1);*/
                            $scope.AddTransactionPrint(resp);
                        } else {

                        }

                        $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());
                        $scope.SearchObj = angular.copy($scope.getSearchObj());
                        $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());


                        //$scope.SelectedPatientDetails.PatientObj = "";
                        $scope.SelectedPatientDetails.DepositsObj = "";

                        if (Selectobj.Allocate == 4) {
                            $scope.ViewDepositScreen = true;
                        } else {
                            $scope.ViewDepositScreen = false;
                        }
                        $scope.showNotes = false;
                    }
                }

                $scope.getPatientDepositAmountById();

            }, function (cancel) {
            });
        };

        $scope.depositGreaterThanZero = function (sitem) {
            return sitem.DepositAmount > 0;
        };
        $scope.ViewTransaction = function (item) {
            $scope.ViewDepositScreen = false;
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "DepositTransactionList.html",
                "backdrop": "static",
                "keyboard": false,
                //"size": "lg",
                "windowClass": "modal__ninety-- in",
                "resolve": {
                    "item": function () { return item; },
                },
                "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, item) {

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    item = item || [];

                    $scope.TransactionListData = [];

                    $scope.GetPatientTransactionList = function (pageno, type) {

                        var obj = {
                            "PatientId": item.PatientId,
                            //"OrganizationId": item.OrganizationId,
                            "PatientDepositId": item.PatientDepositId

                        };


                        eHnoteInsuranceService.GetPatientTransactionList(obj).then(function (resp) {
                            if (resp.data.Status === "Success") {
                                $scope.TransactionListData = resp.data.rows || [];

                            } else {
                                alertify.error(resp.data.Message);
                            }
                        });
                    }
                    $scope.GetPatientTransactionList();

                }

            });

        }

        $scope.isToday = function (transactionDateStr) {
            var today = new Date();
            var todayStr = today.toISOString().slice(0, 10);
            return transactionDateStr === todayStr;
        };

        $scope.RefundPatientDepositdata = function (item, ID) {
            $scope.ViewDepositScreen = false;
            var obj = {
                "AllCardTypes": $scope.AllCardTypes || [],
                "Masterrefundreasons": $scope.Masterrefundreasons || [],
                "AllUsersList": $scope.AllUsersList || [],
            }
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "RefundDepositpopup.html",
                "backdrop": "static",
                "size": "lg",
                "keyboard": false,
                "windowClass": "",
                "resolve": {
                    //"PatientDepositsListArray": function () { return $scope.PatientDepositsListArray; },
                    "mainobj": function () { return item; },
                    "obj": function () { return obj; },
                    "ID": function () { return ID; },

                },
                "controller": function ($scope, $uibModalInstance, eHnoteMasterDataService, mainobj, datapersistanceFactory, obj, eHnoteInsuranceService, ID) {
                    ID = ID || '';
                    $scope.mainNMITransactionid = "";

                    //if (mainobj.NMITransactionId !== 0) {
                    //    $scope.mainNMITransactionid = mainobj.OnlineTransactionNumber || "";
                    //}
                    $scope.IsRefundDisable = true;

                    var mObj = datapersistanceFactory.getItem("masterDataArrays");
                    $scope.masterPaymentModes = [];
                    if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
                        $scope.masterPaymentModes = mObj.PaymentModes;
                        $scope.filterPaymentModes = function (item) {
                            return ![13, 14].includes(item.PaymentModeId);
                        };
                    };
                    var doctorinfo = eHnoteMasterDataService.getUserInfo();
                    $scope.UserId = eHnoteMasterDataService.getLoginId();
                    $scope.ParenthospitalId = 0;
                    $scope.HospitalId = 0;
                    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
                        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
                        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
                        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
                        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
                    };
                    $scope.mainobj = mainobj;
                    $scope.Masterrefundreasons = obj.Masterrefundreasons || [];
                    $scope.AllCardTypes = obj.AllCardTypes || [];
                    $scope.AllUsersList = obj.AllUsersList || [];

                    $scope.GetRefundpaymentObj = function () {
                        var obj = {
                            "UserId": $scope.UserId,
                            "RefundByUser": "",
                            "OrganizationId": $scope.mainobj.OrganizationId,
                            "PatientDepositId": $scope.mainobj.PatientDepositId || null,
                            "RefundDepositId": null,
                            "ReceiptNo": $scope.mainobj.ReceiptNo || "",
                            "ReceiptId": 0,
                            "RefundDate": $filter('date')(new Date(), "MM-dd-yyyy"),
                            "RefundAmount": mainobj.UnBilledAmount || null,
                            "RefundBy": "",
                            "DeleteInd": "N",
                            "AppointmentId": $scope.mainobj.AppointmentID || null,
                            "PatientId": $scope.mainobj.PatientId || null,
                            "RefundreasonId": null,
                            "Refundreason": null,
                            "Remarks": null,
                            "CardtypeId": null,
                            "Cardtype": "",
                            "RefundPaymentMethodId": 5,
                            "RefundPaymentMethod": "Check",
                            "ReceiptNumber": "",
                            "ReferenceNumber": "",
                            "CardNumber": "",
                            "DepositStatus": "Refund",
                            "DepositStatusId": "3",
                            "Transactions": [],
                            "IsCheckedRefund": false,


                        }

                        return obj;
                    };

                    $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());

                    if (mainobj.PatientDepositPaymodeList.length == 1) {
                        if (mainobj.PatientDepositPaymodeList[0].NMITransactionId !== 0) {
                            $scope.mainNMITransactionid = mainobj.PatientDepositPaymodeList[0].OnlineTransactionNumber || "";
                        }
                    }

                    $scope.handlePatPaymentRefundCheckbox = function (item) {
                        if (item.IsCheckedRefund == true) {
                            if (mainobj.PatientDepositPaymodeList.length == 1) {
                                if (mainobj.PatientDepositPaymodeList[0].NMITransactionId !== 0) {
                                    $scope.RefundPaymentObj.RefundPaymentMethodId = mainobj.PatientDepositPaymodeList[0].PaymentMethodId || 5;
                                    $scope.RefundPaymentObj.RefundPaymentMethod = mainobj.PatientDepositPaymodeList[0].PaymentMethodName || '';
                                    $scope.RefundPaymentObj.CardtypeId = mainobj.PatientDepositPaymodeList[0].CardtypeId || null;
                                    $scope.RefundPaymentObj.Cardtype = mainobj.PatientDepositPaymodeList[0].CardType || null;
                                    $scope.RefundPaymentObj.CardNumber = mainobj.PatientDepositPaymodeList[0].CardNumber || '';
                                }
                            }
                            $scope.RefundPaymentObj.IsCheckedRefund = true;
                        } else {
                            $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());
                            $scope.RefundPaymentObj.IsCheckedRefund = false;
                        }
                    };


                    $scope.changeIndividualRefund = function (amount) {
                        if (amount > mainobj.UnBilledAmount) {
                            alertify.error("Refund Amount should not be greater than the Unallocated Deposit Amount.");
                            $scope.RefundPaymentObj.RefundAmount = '';
                            return false;
                        } else {

                        }
                    }

                    $scope.init = function () {

                        /* $scope.RefundPaymentObj = angular.copy($scope.GetRefundpaymentObj());*/

                        var filtredArray = $filter("filter")($scope.AllUsersList, { "DoctorID": $scope.UserId }, true) || [];
                        if (filtredArray.length > 0) {
                            $scope.RefundPaymentObj.RefundByUser = filtredArray[0].FullName || "";
                        }
                    }
                    $scope.init();



                    $scope.changeRefund = function (id) {
                        var filtredArray = $filter("filter")($scope.Masterrefundreasons, { "RefundreasonId": id }, true) || [];
                        if (filtredArray.length > 0) {
                            $scope.RefundPaymentObj.Refundreason = filtredArray[0].Refundreason || "";
                        }
                    }
                    $scope.ChangePaymentMode = function (id) {
                        var filtredArray = $filter("filter")($scope.masterPaymentModes, { "PaymentModeId": id }, true) || [];
                        if (filtredArray.length > 0) {
                            $scope.RefundPaymentObj.RefundPaymentMethod = filtredArray[0].PaymentModeName || "";
                        }
                    }

                    $scope.PatientRefund = function () {


                        let Transactions = [];
                        $scope.RefundPaymentObj.RefundAmount = parseFloat($scope.RefundPaymentObj.RefundAmount) || null;
                        $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
                        if ($scope.RefundPaymentObj.RefundreasonId == null) {
                            alertify.error("Please Select Refund Reason");
                            return;
                        }
                        if ($scope.RefundPaymentObj.RefundAmount == null || $scope.RefundPaymentObj.RefundAmount == 0) {
                            alertify.error("Please Enter Refund Amount");
                            return;
                        }
                        if ($scope.RefundPaymentObj.RefundAmount > $scope.mainobj.UnBilledAmount) {
                            alertify.error("RefundAmount exceeds the UnBilledAmount. Please Enter the Lesser Amount.");
                            return;
                        }
                        $scope.RefundPaymentObj.Remarks = $scope.RefundPaymentObj.Remarks || "";
                        if ($scope.RefundPaymentObj.Remarks == "" || $scope.RefundPaymentObj.Remarks == null) {
                            alertify.error("Please enter Refund remarks.");
                            return false;
                        }
                        if ($scope.RefundPaymentObj.RefundAmount != null) {
                            let obj3 = {

                                "UserId": $scope.UserId,
                                "PatientId": $scope.mainobj.PatientId || null,
                                "RefundDepositId": null,
                                "RefundTransactionId": 0,
                                "PatientDepositId": $scope.mainobj.PatientDepositId,
                                "OrganizationId": $scope.RefundPaymentObj.OrganizationId,
                                "TransactionDate": $filter('date')($scope.RefundPaymentObj.RefundDate, "MM-dd-yyyy"),
                                "TransactionAmount": -+$scope.RefundPaymentObj.RefundAmount,
                                "RefundAmount": -+$scope.RefundPaymentObj.RefundAmount,
                                "TransactionSourceId": 3,
                                "TransactionSource": "Patient",
                                "DeleteInd": "N",

                            }
                            Transactions.push(obj3);
                        }

                        var params = {
                            "UserId": $scope.UserId,
                            "OrganizationId": $scope.RefundPaymentObj.OrganizationId,
                            "DepositStatus": "Refund",
                            "DepositStatusId": "3",
                            "PatientDepositId": $scope.RefundPaymentObj.PatientDepositId || null,
                            "RefundDepositId": null,
                            "ReceiptNo": $scope.RefundPaymentObj.ReceiptNo || "",
                            "RefundDate": $filter('date')($scope.RefundPaymentObj.RefundDate, "MM-dd-yyyy"),
                            "RefundAmount": $scope.RefundPaymentObj.RefundAmount || null,
                            "RefundByUserId": $scope.UserId,
                            "RefundByUser": $scope.RefundPaymentObj.RefundByUser || "",
                            "DeleteInd": "N",
                            "AppointmentId": $scope.RefundPaymentObj.AppointmentId || null,
                            "PatientId": $scope.RefundPaymentObj.PatientId || null,
                            "RefundreasonId": $scope.RefundPaymentObj.RefundreasonId || null,
                            "RefundReason": $scope.RefundPaymentObj.Refundreason || "",
                            "Remarks": $scope.RefundPaymentObj.Remarks || "",
                            "CardtypeId": $scope.RefundPaymentObj.CardtypeId || "",
                            "RefundPaymentMethodId": $scope.RefundPaymentObj.RefundPaymentMethodId || "",
                            "RefundPaymentMethod": $scope.RefundPaymentObj.RefundPaymentMethod || "",
                            "RefundStatus": "Initiated",
                            "RefundStatusId": "1",
                            "ReferenceNumber": $scope.RefundPaymentObj.ReferenceNumber || "",
                            "CardNumber": $scope.RefundPaymentObj.CardNumber || "",
                            "Transactions": Transactions || [],
                            "PatientDepositPaymodeListId": mainobj.PatientDepositPaymodeListId,
                            "PaymentTransactionTypeId": 3,
                            "PaymentTransactionType": 'Refund',
                            "DepositTypeId": $scope.mainobj.DepositTypeId || 0,
                            "DepositTypeName": $scope.mainobj.DepositTypeName || "",

                        }

                        console.log(JSON.stringify(params));


                        eHnoteInsuranceService.AddUpdatePatientDepositRefund(params).then(function (resp) {
                            if (resp.data.Status == "Success") {
                                $uibModalInstance.close("cancel");
                            }

                        }, function (err) {

                        });
                    }


                    $scope.navtoNMIPatientRefund = function (item) {
                        $scope.RefundPaymentObj.RefundAmount = $scope.RefundPaymentObj.RefundAmount || null;
                        $scope.RefundPaymentObj.RefundreasonId = $scope.RefundPaymentObj.RefundreasonId || null;
                        if ($scope.RefundPaymentObj.RefundAmount == null) {
                            alertify.error("Please Enter Refund Amount");
                            return;
                        }
                        if ($scope.RefundPaymentObj.RefundreasonId == null) {
                            alertify.error("Please Select Refund Reason");
                            return;
                        }

                        if ($scope.mainNMITransactionid == "") {
                            alertify.error("you cannot perform void, as TransactionId is empty");
                            return false;
                        }
                        $scope.RefundPaymentObj.Remarks = $scope.RefundPaymentObj.Remarks || "";
                        if ($scope.RefundPaymentObj.Remarks == "" || $scope.RefundPaymentObj.Remarks == null) {
                            alertify.error("Please enter Refund remarks.");
                            return false;
                        }

                        $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                        $scope.mainNMITransactionObj.NMITransactionId = 0;
                        $scope.mainNMITransactionObj.UserId = $scope.UserId;
                        $scope.mainNMITransactionObj.PatientId = $scope.mainobj.PatientId;
                        $scope.mainNMITransactionObj.OrganizationId = $scope.mainobj.OrganizationId;
                        /* $scope.mainNMITransactionObj.PaymentAmount = $scope.mainobj.PatientDepositPaymodeList[0].DepositAmount;*/
                        $scope.mainNMITransactionObj.PaymentAmount = $scope.RefundPaymentObj.RefundAmount;
                        $scope.mainNMITransactionObj.MerchentId = $scope.mainNMITransactionObj.MerchentId;
                        $scope.mainNMITransactionObj.MerchentName = $scope.mainNMITransactionObj.MerchentName;
                        $scope.mainNMITransactionObj.CardHolderName = $scope.mainobj.PatientFullName || "";
                        $scope.mainNMITransactionObj.PatientEmail = $scope.mainobj.PatientEmailId || "";
                        $scope.mainNMITransactionObj.PatientMobile = $scope.mainobj.PatientMobile || "";

                        if ($scope.mainNMITransactionObj.PatientMobile != "") {
                            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                            $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                        }

                        $scope.mainNMITransactionObj.PatientMrNo = $scope.mainobj.PatientDisplayId || "";
                        $scope.mainNMITransactionObj.OrderId = "";
                        $scope.mainNMITransactionObj.OrderDescription = $scope.RefundPaymentObj.Refundreason || "";
                        $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                        $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.mainobj.PatientDepositPaymodeList[0].BillPaymentTypeId || 0;
                        $scope.mainNMITransactionObj.BillPaymentType = $scope.mainobj.PatientDepositPaymodeList[0].BillPaymentType || "";
                        $scope.mainNMITransactionObj.ResponseId = 0;
                        $scope.mainNMITransactionObj.ResponseCode = "";
                        $scope.mainNMITransactionObj.ResponseText = "";
                        $scope.mainNMITransactionObj.Status = "";
                        $scope.mainNMITransactionObj.TransactionTypeId = 5;
                        $scope.mainNMITransactionObj.TransactionType = "refund";
                        $scope.mainNMITransactionObj.DeleteInd = "N";
                        $scope.mainNMITransactionObj.Type = "refund";
                        $scope.mainNMITransactionObj.AppointmentId = $scope.mainobj.AppointmentId || 0;
                        $scope.mainNMITransactionObj.VisitId = $scope.mainobj.VisitId || 0;

                        $scope.mainNMITransactionObj.PaymentModeId = $scope.RefundPaymentObj.RefundPaymentMethodId;
                        $scope.mainNMITransactionObj.PaymentMode = $scope.RefundPaymentObj.RefundPaymentMethod;

                        eHnotePaymentGatewayService.NMIPaymentTransactionRefund($scope.mainNMITransactionObj).then(function (resp) {
                            var res = resp.data || {};
                            console.log(res)
                            if (res.Status == "Success") {
                                alertify.success(res.Status);

                                $scope.PatientRefund();
                            }
                        })

                    };

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }

            });

            mInstanceAdd.result.then(function () {

                $scope.getPatientDepositAmountById();
                $scope.ViewDepositScreen = false;
                $scope.ClearPatientDeposit();

            }, function () { });
        }

        $scope.AddAnotherPaymentPopUp = function (item) {
            $scope.EditPatientDepositData(item);
            $scope.addPaymentPopup();

        }

        $scope.Showtransactionlist = function (item) {
            $scope.ViewDepositScreen = false;
            angular.forEach($scope.PatientDepositsListArray, function (sitem) {
                if (sitem !== item) {
                    sitem.Isshow = false;
                }
            });
            item.Isshow = !item.Isshow;
            if (!item.Isshow) return;
            item.PatientDepositTransactionList = [];

            var obj = {
                "PatientId": item.PatientId,
                //"OrganizationId": item.OrganizationId,
                "PatientDepositId": item.PatientDepositId
            };

            eHnoteInsuranceService.GetPatientDepositTransactionList(obj).then(function (resp) {
                if (resp.data.Status === "Success") {
                    var allTransactions = resp.data.rows || [];

                    if (allTransactions.length > 0) {
                        item.IsVoidTransactionInd = allTransactions.some(t => t.PaymentTransactionTypeId === 4);
                        item.IsCancelTransactionInd = allTransactions.some(t => t.PaymentTransactionTypeId === 6);
                    }

                    item.PatientDepositTransactionList = allTransactions.filter(function (t) {
                        return t.PaymentTransactionTypeId !== 4 && t.PaymentTransactionTypeId !== 6;
                    });
                } else {
                    alertify.error(resp.data.Message);
                }
            });
        };


        $scope.openAccordianItem = function (item) {
            const isCurrentlyOpen = item.isOpen;
            $scope.PatientDepositsListArray.forEach(subItem => {
                subItem.isOpen = false;
            });
            item.isOpen = !isCurrentlyOpen;
        };

        $scope.ChangePaymentModelist = function (Id) {
            var FilterPaymentmode = $filter('filter')($scope.masterPaymentModes, function (Pitem) { return Pitem.PaymentModeId === Id; }) || [];
            if (FilterPaymentmode.length != 0) {
                $scope.PatientPaymentObj.PaymentMethodName = FilterPaymentmode[0].PaymentModeName;
                $scope.PatientDepositsObj.PaymentMethodName = FilterPaymentmode[0].PaymentModeName;
            }

            if (Id == 14) {
                /* $scope.IsDepositButton = true;*/
                $scope.id = Id;
                /* $scope.index = index;*/
                $scope.openDepositsPopup();

            }

        }

        $scope.calculateExpiryDate = function () {

            var currentDate = new Date();

            currentDate.setDate(currentDate.getDate() + 90);

            var expiryMonth = currentDate.getMonth() + 1;
            var expiryDay = currentDate.getDate();
            var expiryYear = currentDate.getFullYear();

            expiryMonth = expiryMonth < 10 ? '0' + expiryMonth : expiryMonth;
            expiryDay = expiryDay < 10 ? '0' + expiryDay : expiryDay;

            $scope.ClaimExpiryDate = `${expiryMonth}-${expiryDay}-${expiryYear}`;
        };

        $scope.navtoClaimSummaryPopup = function (Obj, item, pitem) {
            $scope.calculateExpiryDate();
            Obj = Obj || '';
            item = item || '';
            pitem = pitem || '';
            let AppointmentId = null;
            let PatientId = null;
            if (item != '') {
                AppointmentId = pitem.AppointmentId;
                PatientId = Obj.PatientId;
            }

            $scope.claimScreenParentObj = {
                "PatientId": PatientId || null,
                "AppointmentId": AppointmentId || null,
                "PatientFullName": item.PatientFullName || "",
                "VisitId": item.VisitId || '',
                "ActionType": "EditClaim",
                "SubActionType": "Verify",
                "ScreenType": "Popup",
                "SuperBillId": null,
                "ResponcibilityId": item.CurrentResponsibilityId || 0,
                "IsCreateSuperBill": false,
                "PatientClaimId": pitem.PatientClaimId,
                "SuperBillArray": [],
                "ClaimExpiryDate": $scope.ClaimExpiryDate || null,
                "AppointmentDoctorId": item.RenderingProviderId || 0,
                "IsClaimPatientDeposit": true,
            };

            if (!$scope.Selectobj.mainBillerDataObj || Object.keys($scope.Selectobj.mainBillerDataObj).length === 0) {
                $scope.mainBillerDataObj = {
                    'AllBranchesList': $scope.Selectobj.AllBranchesList || [],
                    'AllUsersList': $scope.Selectobj.UsersList || [],
                    'Tabid': 2,
                };
                $scope.Selectobj.mainBillerDataObj = $scope.mainBillerDataObj;
            }



            $scope.Selectobj.mainBillerDataObj.Tabid == $scope.Selectobj.mainBillerDataObj.Tabid || 0
            /* $scope.mainBillerDataObj.Tabid = 2;*/
            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/AddUpdateClaimPopup.html",
                "size": "lg",
                "keyboard": false,
                "controller": "UsAddUpdateClaimPopupCtrl",
                "windowClass": "modal__popup--1",
                "resolve": {
                    "mainBillerDataObj": function () { return $scope.Selectobj.mainBillerDataObj || null; },
                }
            });

            $scope.mInstanceAdd.result.then(function (response) {
                response = response || "";
                console.log(response);

            }, function () { });
        }

        $scope.AddTransactionPrint = function (item) {
            $scope.DepositTransactionObj.TransactionDate = item.DepositTransaction[0].TransactionDate || '';
            $scope.DepositTransactionObj.TransactionTime = item.DepositTransaction[0].TransactionTime || '';
            $scope.DepositTransactionObj.TransReciptNo = item.DepositTransaction[0].TransReciptNo || '';
            $scope.DepositTransactionObj.PaymentMethodName = item.PatientDepositPaymodeList[0].PaymentMethodName || '';
            $scope.DepositTransactionObj.CardNumber = item.PatientDepositPaymodeList[0].CardNumber || '';
            $scope.DepositTransactionObj.ChequeNumber = item.PatientDepositPaymodeList[0].ChequeNumber || '';
            $scope.DepositTransactionObj.CardType = item.PatientDepositPaymodeList[0].CardType || '';
            $scope.DepositTransactionObj.OnlineTransactionNumber = item.PatientDepositPaymodeList[0].OnlineTransactionNumber || '';
            $scope.DepositTransactionObj.TransactionAmount = item.PatientDepositPaymodeList[0].DepositAmount || '';
            $scope.DepositTransactionObj.ReceiptNumber = item.ReceiptNo || '';
            $scope.DepositTransactionObj.OrganizationName = item.DepositTransaction[0].OrganizationName || '';

            var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": item.DepositTransaction[0].OrganizationId }, true) || [];
            if (filtredArray.length > 0) {
                $scope.DepositTransactionObj.CityTown = filtredArray[0].CityTown;
                $scope.DepositTransactionObj.State = filtredArray[0].State;
                $scope.DepositTransactionObj.Country = filtredArray[0].Country;
                $scope.DepositTransactionObj.FaxNumber = filtredArray[0].FaxNumber || "";
                if ($scope.DepositTransactionObj.FaxNumber != "") {
                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.DepositTransactionObj.FaxNumber);
                    $scope.DepositTransactionObj.FaxNumber = obj.UsFormatMobileNumber;
                }
            }


            $scope.HospitalAddress = $scope.HospitalAddressArray || null;
            if ($scope.HospitalAddress.PharmacyPhoneNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.PharmacyPhoneNo);
                $scope.HospitalAddress.PharmacyPhoneNo = obj.UsFormatMobileNumber;
            }
            if ($scope.HospitalAddress.ContactNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.ContactNo);
                $scope.HospitalAddress.ContactNo = obj.UsFormatMobileNumber;
            }

            $scope.Depositprintpopup();

        }



        $scope.AddIndPrinttransactionPopUp = function (item, sitem) {
            item = item || null;
            sitem = sitem || null;
            $scope.TransactionReceiptText = sitem.PaymentTransactionTypeId == 3 ? "Refund Transaction Receipt" : "Deposit Transaction Receipt";


            $scope.DepositList = item || '';
            $scope.DepositTransactionObj.TransactionDate = sitem.TransactionDate || '';
            $scope.DepositTransactionObj.TransactionTime = sitem.TransactionTime || '';
            $scope.DepositTransactionObj.TransReciptNo = sitem.TransReciptNo || '';
            $scope.DepositTransactionObj.PaymentMethodName = sitem.PaymentMethodName || '';
            $scope.DepositTransactionObj.CardNumber = sitem.CardNumber || '';
            $scope.DepositTransactionObj.ChequeNumber = sitem.ChequeNumber || '';
            $scope.DepositTransactionObj.CardType = sitem.CardType || '';
            $scope.DepositTransactionObj.OnlineTransactionNumber = sitem.OnlineTransactionNumber || '';
            $scope.DepositTransactionObj.TransactionAmount = sitem.TransactionAmount || '';
            $scope.DepositTransactionObj.ReceiptNumber = item.ReceiptNo || '';
            $scope.DepositTransactionObj.OrganizationName = sitem.OrganizationName || '';

            var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": sitem.OrganizationId }, true) || [];
            if (filtredArray.length > 0) {
                $scope.DepositTransactionObj.CityTown = filtredArray[0].CityTown;
                $scope.DepositTransactionObj.State = filtredArray[0].State;
                $scope.DepositTransactionObj.Country = filtredArray[0].Country;
                $scope.DepositTransactionObj.FaxNumber = filtredArray[0].FaxNumber || "";
                if ($scope.DepositTransactionObj.FaxNumber != "") {
                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.DepositTransactionObj.FaxNumber);
                    $scope.DepositTransactionObj.FaxNumber = obj.UsFormatMobileNumber;
                }
            }


            $scope.HospitalAddress = $scope.HospitalAddressArray || null;
            if ($scope.HospitalAddress.PharmacyPhoneNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.PharmacyPhoneNo);
                $scope.HospitalAddress.PharmacyPhoneNo = obj.UsFormatMobileNumber;
            }
            if ($scope.HospitalAddress.FaxNumber != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.FaxNumber);
                $scope.HospitalAddress.FaxNumber = obj.UsFormatMobileNumber;
            }
            if ($scope.HospitalAddress.ContactNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.ContactNo);
                $scope.HospitalAddress.ContactNo = obj.UsFormatMobileNumber;
            }
            $scope.Depositprintpopup();
        };

        $scope.Depositprintpopup = function () {

            $timeout(function () {
                var innerContents = document.getElementById('PrintIndtransPopupNew').innerHTML;
                var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 1000);
        }


        $scope.PatientPaymentprintpopup = function () {
            $scope.PatientPaymentObj.PatientDepositPaymodeList = $scope.PatientPaymentObj.PatientDepositPaymodeList || [];
            $scope.PaymentDepositAmount = 0;
            angular.forEach($scope.PatientPaymentObj.PatientDepositPaymodeList, function (pitem) {
                $scope.PaymentDepositAmount += pitem.DepositAmount || 0;
            })

            //$timeout(function () {
            //    var innerContents = document.getElementById('PrintIndtransPopupNew').innerHTML;

            //    var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            //    popupWinindow.document.open();
            //    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
            //    popupWinindow.document.close();
            //}, 1000);

            let modalInstance = $uibModal.open({
                templateUrl: 'yourTemplate.html',
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                "scope": $scope,
            });

            modalInstance.rendered.then(function () {
                $timeout(function () {
                    var page1 = document.getElementById('PaymentDepositTrans_Print').innerHTML;
                    var page2 = document.getElementById('PrintToPatient_English').innerHTML;

                    if ($scope.PatientPaymentObj.IsDepositPrint) {
                        var innerContents = `<div class="print-page">${page1}</div><div class="print-page">${page2}</div>`;
                    } else {
                        var innerContents = `<div class="print-page">${page1}</div>`;
                    }

                    var popupWin = window.open('', '_blank');
                    popupWin.document.open();
                    popupWin.document.write(`<html><head><link rel="stylesheet" href="css/billing.css" /><style>@media print {.print-page {page-break-after: always !important; page-break-before: always !important;} table {page-break-inside: auto !important;} tr {page-break-inside: avoid !important;} td {page-break-inside: avoid !important;}}</style></head><body onload="window.print()">${innerContents}</body></html>`);
                    popupWin.document.close();
                    modalInstance.dismiss('Cancel');
                    $scope.PatientPaymentObj.IsDepositPrint = false;
                }, 1000);
            });
        }


        $scope.AddPatientDepositPrint = function (item, type) {
            item = item || null;
            type = type || "";
            $scope.PatientDepositDetails = item || null;
            if ($scope.PatientDepositDetails.PatientMobile != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientDepositDetails.PatientMobile);
                $scope.PatientDepositDetails.PatientMobile = obj.UsFormatMobileNumber;
            }
            $scope.DepositTransactionList = [];
            $scope.HospitalAddress = $scope.HospitalAddressArray || null;
            if ($scope.HospitalAddress.PharmacyPhoneNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.PharmacyPhoneNo);
                $scope.HospitalAddress.PharmacyPhoneNo = obj.UsFormatMobileNumber;
            }
            if ($scope.HospitalAddress.ContactNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.ContactNo);
                $scope.HospitalAddress.ContactNo = obj.UsFormatMobileNumber;
            }


            var obj = {
                "PatientId": item.PatientId,
                //"OrganizationId": item.OrganizationId,
                "PatientDepositId": item.PatientDepositId

            };

            eHnoteInsuranceService.GetPatientDepositTransactionList(obj).then(function (resp) {
                if (resp.data.Status === "Success") {
                    resp.data.rows = resp.data.rows || [];

                    $scope.DepositTransactionList = resp.data.rows.filter(function (item) {
                        /*return item.PaymentTransactionTypeId == 1 && item.PaymentMethodId !== 15;*/
                        if (resp.data.rows.length > 1) {
                            return item.PaymentTransactionTypeId == 1 && item.PaymentMethodId !== 15;
                        } else {
                            return item.PaymentTransactionTypeId == 1;
                        }
                        
                    });
                    if (type === 'DepositMail') {
                        $timeout(function () {
                            $scope.GetPatientDepositDetailsEmailNew(type);
                        }, 1000);
                    }
                } else {
                    alertify.error(resp.data.Message);
                }
            });



            if (type === "Print") {
                $timeout(function () {
                    var innerContents = document.getElementById('PatientEachDeposit_Print').innerHTML;
                    var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                    popupWinindow.document.open();
                    popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                    popupWinindow.document.close();
                }, 1000);
            }
        };

        $scope.AddVoidPatientDeposit = function (item, actionType) {

            var templateToUse = (actionType === 'void') ? "VoidReasonPopUp.html" : "CancelReasonPopUp.html";

            var mInstanceAdd = $uibModal.open({
                "templateUrl": templateToUse,
                "size": "sm",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "z-index-nine__one",
                "resolve": {
                    "item": function () { return item; },
                    "UserId": function () { return $scope.UserId; },
                    "HospitalId": function () { return $scope.HospitalId; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, item, UserId, HospitalId) {
                    item = item || '';

                    console.log(JSON.stringify(item));
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    }
                    $scope.mainNMITransactionid = "";
                    if (item.PatientDepositPaymodeList[0].NMITransactionId !== 0) {
                        $scope.mainNMITransactionid = item.PatientDepositPaymodeList[0].OnlineTransactionNumber || "";
                    }


                    //$scope.getVoidPatientObj = function () {
                    //    var Obj = {
                    //        "VoidRemarks": ''
                    //    }
                    //    return Obj;
                    //}

                    $scope.VoidPatientObj = {
                        "VoidRemarks": '',
                    }

                    $scope.SaveVoidDepositData = function () {
                        $scope.SavePatientVoidDeposit(item);
                    }

                    $scope.SavePatientVoidDeposit = function (item) {
                        if ($scope.VoidPatientObj.VoidRemarks == '') {
                            alertify.error("Please enter Remarks.");
                            return false;
                        }

                        var Obj = {
                            "OrganizationId": item.OrganizationId,
                            "TransactionId": 0,
                            "UpdateTransactionId": 0,
                            "PatientDepositId": item.PatientDepositId || 0,
                            "Amount": item.DepositAmount || 0,
                            "DepositTypeId": item.DepositTypeId || 0,
                            "DepositTypeName": item.DepositTypeName || "",
                            "PaymentTransactionTypeId": (actionType === 'void') ? 4 : 6,
                            "PaymentTransactionType": (actionType === 'void') ? 'Void' : 'Cancel',
                            "TransactionDate": $filter('date')(new Date(), "MM-dd-yyyy") || '',
                            "NMITransactionId": 0,
                            "PatientDepositPaymodeListId": 0,
                            "EOBId": 0,
                            "UserId": UserId,
                            "VoidRemarks": $scope.VoidPatientObj.VoidRemarks,
                            "PatientDepositPaymodeList": item.PatientDepositPaymodeList || [],
                            "OrganizationTransactionId": item.OrganizationTransactionId || 0,
                            "OrganizationTransactionName": item.OrganizationTransactionName || "",
                            "OrganizationName": item.OrganizationName || "",
                        }

                        eHnoteInsuranceService.AddUpdatePatientDepositVoid(Obj).then(function (resp) {
                            if (resp.data.Status == "Success") {

                                if (item.PatientDepositPaymodeList[0].PaymentProcessTypeId != 3 || item.PatientDepositPaymodeList[0].PaymentProcessTypeId != 1) {
                                    if (actionType == 'void') {
                                        alertify.success('Deposit Void Successfully');
                                    }
                                }
                                if (actionType == 'cancel') {
                                    alertify.success('Deposit Cancel Successfully');
                                }

                            }
                            $uibModalInstance.close("success");
                        }, function (err) {

                        });

                    }

                    $scope.SaveOnlineVoidDeposit = function () {
                        $scope.navtoVoidOnlinePayment(item);
                    }

                    $scope.navtoVoidOnlinePayment = function (item) {
                        $scope.VoidPatientObj.VoidRemarks = $scope.VoidPatientObj.VoidRemarks || "";
                        if ($scope.VoidPatientObj.VoidRemarks == '') {
                            alertify.error("Please enter Remarks.");
                            return false;
                        }

                        if ($scope.mainNMITransactionid == "") {
                            alertify.error("you cannot perform void, as TransactionId is empty");
                            return false;
                        }

                        $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                        $scope.mainNMITransactionObj.NMITransactionId = 0;
                        $scope.mainNMITransactionObj.UserId = UserId;
                        $scope.mainNMITransactionObj.PatientId = item.PatientId;
                        $scope.mainNMITransactionObj.OrganizationId = item.OrganizationId;
                        $scope.mainNMITransactionObj.PaymentAmount = item.PatientDepositPaymodeList[0].DepositAmount;
                        $scope.mainNMITransactionObj.MerchentId = "";
                        $scope.mainNMITransactionObj.MerchentName = "ehnotesandbox";
                        $scope.mainNMITransactionObj.CardHolderName = item.PatientFullName || "";
                        $scope.mainNMITransactionObj.PatientEmail = item.PatientEmailId || "";
                        $scope.mainNMITransactionObj.PatientMobile = item.PatientMobile || "";

                        if ($scope.mainNMITransactionObj.PatientMobile != "") {
                            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                            $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                        }

                        $scope.mainNMITransactionObj.PatientMrNo = item.PatientDisplayId || "";
                        $scope.mainNMITransactionObj.OrderId = "";
                        $scope.mainNMITransactionObj.OrderDescription = $scope.VoidPatientObj.VoidRemarks || "";
                        $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                        $scope.mainNMITransactionObj.BillPaymentTypeId = item.PatientDepositPaymodeList[0].BillPaymentTypeId || 0;
                        $scope.mainNMITransactionObj.BillPaymentType = item.PatientDepositPaymodeList[0].BillPaymentType || "";
                        $scope.mainNMITransactionObj.ResponseId = 0;
                        $scope.mainNMITransactionObj.ResponseCode = "";
                        $scope.mainNMITransactionObj.ResponseText = "";
                        $scope.mainNMITransactionObj.Status = "";
                        $scope.mainNMITransactionObj.TransactionTypeId = (actionType === 'void') ? 4 : 6;
                        $scope.mainNMITransactionObj.TransactionType = (actionType === 'void') ? 'void' : 'cancel';
                        $scope.mainNMITransactionObj.DeleteInd = "N";
                        $scope.mainNMITransactionObj.Type = (actionType === 'void') ? 'void' : 'cancel',
                            $scope.mainNMITransactionObj.AppointmentId = item.AppointmentId || 0;
                        $scope.mainNMITransactionObj.VisitId = item.VisitId || 0;


                        eHnotePaymentGatewayService.NMIPaymentTransactionVoid($scope.mainNMITransactionObj).then(function (resp) {
                            console.log(resp.data);

                            var res = resp.data || {};
                            if (res.Status == "Success") {
                                alertify.success(res.ResponseText);

                                $scope.SavePatientVoidDeposit(item);
                            }
                        })

                    };
                }
            });

            mInstanceAdd.result.then(function () {

                $scope.getPatientDepositAmountById();
                $scope.ViewDepositScreen = false;
                $scope.ClearPatientDeposit();

            }, function () { });
        }

        $scope.GetOrganizationPOSInvoices = function (item, sitem, val) {
            $scope.POSInvoicesCount = null;
            $scope.POSPaymentListCount = null;
            $scope.POSInvoiceslist = [];
            item = item || '';
            sitem = sitem || '';
            val = val || '';

            let param = {
                "OrganizationId": $scope.HospitalId,
                "PageSize": 100,
                "PageNumber": 1,
                "InvoiceNumber": sitem.InvoiceNumber || "",
                "PatientId": item.PatientId || "",
                "SoldByUserId": "",
                "FromDate": "",
                "ToDate": "",
                "PaymentStatusId": "",
            }

            eHnoteInsuranceService.GetOrganizationPOSInvoices(param).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.POSVoidInvoiceslist = resp.data.PosVoid || [];
                    if (resp.data.rows.length > 0) {
                        $scope.POSInvoicesCount = resp.data.count || 0;
                        $scope.POSInvoiceslist = resp.data.rows || [];

                        if ($scope.POSInvoiceslist.length > 0) {
                            angular.forEach($scope.POSInvoiceslist, function (item) {
                                item.Isshow = false;
                            })
                        }

                        $scope.POSPaymentListCount = $scope.POSInvoiceslist.filter(function (item) {
                            return item.PaymentStatusId != 4;
                        }).length;

                    }

                    $scope.navtoPointOfSalePopup($scope.POSInvoiceslist[0], val);


                }
            }, function (err) { console.log(err); });

        }

        $scope.navtoPointOfSalePopup = function (item, EditId) {
            let obj = {
                "ScreenType": "EditPos",
                "EditItem": item,
                "PatientId": item.PatientId,
                "EditId": EditId || 0,

            }

            if ($scope.Selectobj.mainBillerDataObj.AllBranchesList == undefined || $scope.Selectobj.mainBillerDataObj.AllUsersList == undefined) {
                $scope.MainBillObj = {
                    'AllBranchesList': $scope.Selectobj.AllBranchesList || [],
                    'AllUsersList': $scope.Selectobj.UsersList || [],
                }
                if ($scope.Selectobj.UsersList == undefined) {
                    $scope.MainBillObj.AllUsersList = $scope.Selectobj.AllUsersList || [];
                }
                $scope.Selectobj.mainBillerDataObj = $scope.MainBillObj || {};
            }

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/pointOfSalePopup.html",
                "controller": "UsPointOfSalePopupCtrl",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "mainObj": function () { return obj || null; },
                    "mainBillerDataObj": function () { return $scope.Selectobj.mainBillerDataObj || null; },
                },
                "windowClass": "modal__popup--1 in",
            });

            mInstanceAdd.result.then(function (resp) {
                /* $scope.GetOrganizationPOSInvoices();*/
            }, function () { });
        }

        $scope.AddPatientPaymentTransDeposit = function (item, sitem) {
            item = item || null;
            sitem = sitem || null;

            $scope.DepositList = item || '';
            $scope.DepositTransactionObj.TransactionDate = sitem.TransactionDate || '';
            $scope.DepositTransactionObj.TransactionTime = sitem.TransactionTime || '';
            $scope.DepositTransactionObj.TransReciptNo = sitem.TransReciptNo || '';
            $scope.DepositTransactionObj.PaymentMethodName = sitem.PaymentMethodName || '';
            $scope.DepositTransactionObj.CardNumber = sitem.CardNumber || '';
            $scope.DepositTransactionObj.CardType = sitem.CardType || '';
            $scope.DepositTransactionObj.OnlineTransactionNumber = sitem.OnlineTransactionNumber || '';
            $scope.DepositTransactionObj.InvoiceNumber = sitem.InvoiceNumber || '';
            $scope.DepositTransactionObj.TransactionAmount = sitem.TransactionAmount || '';
            $scope.DepositTransactionObj.PatientClaimNumber = sitem.PatientClaimNumber || '';
            $scope.DepositTransactionObj.ReceiptNumber = item.ReceiptNo || '';
            $scope.DepositTransactionObj.OrganizationName = sitem.OrganizationName || '';
            $scope.DepositTransactionObj.ClaimData = sitem.ClaimData || '';
            $scope.DepositTransactionObj.ChequeNumber = sitem.ChequeNumber || '';
            if (sitem.OnlineTransactionNumber == '0') {
                $scope.DepositTransactionObj.OnlineTransactionNumber = sitem.ReferenceNumber || '';
            }

            $scope.DepositTransactionObj.ClaimNumbers =
                $scope.DepositTransactionObj.ClaimData
                    .map(citem => citem.PatientClaimNumber)
                    .join(",");


            var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": sitem.OrganizationId }, true) || [];
            if (filtredArray.length > 0) {
                $scope.DepositTransactionObj.CityTown = filtredArray[0].CityTown;
                $scope.DepositTransactionObj.State = filtredArray[0].State;
                $scope.DepositTransactionObj.Country = filtredArray[0].Country;
                $scope.DepositTransactionObj.FaxNumber = filtredArray[0].FaxNumber || "";
                if ($scope.DepositTransactionObj.FaxNumber != "") {
                    var obj = eHnoteUserDataService.UsMobileFormatChange($scope.DepositTransactionObj.FaxNumber);
                    $scope.DepositTransactionObj.FaxNumber = obj.UsFormatMobileNumber;
                }
            }

            $scope.HospitalAddress = $scope.HospitalAddressArray || null;
            if ($scope.HospitalAddress.PharmacyPhoneNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.PharmacyPhoneNo);
                $scope.HospitalAddress.PharmacyPhoneNo = obj.UsFormatMobileNumber;
            }
            if ($scope.HospitalAddress.FaxNumber != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.FaxNumber);
                $scope.HospitalAddress.FaxNumber = obj.UsFormatMobileNumber;
            }
            if ($scope.HospitalAddress.ContactNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.ContactNo);
                $scope.HospitalAddress.ContactNo = obj.UsFormatMobileNumber;
            }
            $scope.DepositPaymentprintpopup();
        };

        $scope.DepositPaymentprintpopup = function () {

            $timeout(function () {
                var innerContents = document.getElementById('PatientPaymentEachTrans_Print').innerHTML;
                var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 1000);
        }


        $scope.PatientDepositRefund_Print = function (item, sitem) {
            item = item || null;
            sitem = sitem || null;

            $scope.DepositList = item || '';
            $scope.DepositTransactionObj.TransactionDate = sitem.TransactionDate || '';
            $scope.DepositTransactionObj.TransactionTime = sitem.TransactionTime || '';
            $scope.DepositTransactionObj.TransReciptNo = sitem.TransReciptNo || '';
            $scope.DepositTransactionObj.PaymentMethodName = sitem.PaymentMethodName || '';
            $scope.DepositTransactionObj.CardNumber = sitem.CardNumber || '';
            $scope.DepositTransactionObj.CardType = sitem.CardType || '';
            $scope.DepositTransactionObj.OnlineTransactionNumber = sitem.OnlineTransactionNumber || '';
            $scope.DepositTransactionObj.TransactionAmount = sitem.TransactionAmount || '';
            $scope.DepositTransactionObj.ReceiptNumber = item.ReceiptNo || '';

            $scope.HospitalAddress = $scope.HospitalAddressArray || null;
            if ($scope.HospitalAddress.PharmacyPhoneNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.PharmacyPhoneNo);
                $scope.HospitalAddress.PharmacyPhoneNo = obj.UsFormatMobileNumber;
            }
            if ($scope.HospitalAddress.FaxNumber != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.FaxNumber);
                $scope.HospitalAddress.FaxNumber = obj.UsFormatMobileNumber;
            }
            if ($scope.HospitalAddress.ContactNo != "") {
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddress.ContactNo);
                $scope.HospitalAddress.ContactNo = obj.UsFormatMobileNumber;
            }
            $scope.DepositRefundprintpopup();
        };

        $scope.DepositRefundprintpopup = function () {

            $timeout(function () {
                var innerContents = document.getElementById('PatientDepositRefund_Print').innerHTML;
                var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 1000);
        };

        $scope.navtoEditPayment = function () {
            $scope.IsDepositAllocationEditMode = true;
            $scope.IsAllocateDisabled = false;
        }
        $scope.IsAdjCodeEnable = false;
        $scope.calculateAmount = function (Aitem, item) {
            item = item || null;
            Aitem = Aitem || null;

            if (Aitem.PatientPaymentAmount !== undefined && Aitem.PatientPaymentAmount !== null) {

                let inputValue = Aitem.PatientPaymentAmount.toString();

                inputValue = inputValue.replace(/[^0-9.]/g, '');

                if (inputValue.length > 1 && inputValue.startsWith('0') && !inputValue.startsWith('0.')) {
                    inputValue = inputValue.slice(1);
                }

                if (inputValue.startsWith('.')) {
                    // inputValue = '';
                    inputValue = '0' + inputValue;
                }
                const decimalParts = inputValue.split('.');
                if (decimalParts.length > 2) {
                    inputValue = decimalParts[0] + '.' + decimalParts[1];
                }

                Aitem.PatientPaymentAmount = inputValue;

                if (inputValue === '' || isNaN(parseFloat(inputValue))) {
                    Aitem.PatientPaymentAmount = '';
                }
            }
            if (Aitem.WriteOffAmount !== undefined && Aitem.WriteOffAmount !== null) {

                let AdjmtAmtValue = Aitem.WriteOffAmount.toString();

                AdjmtAmtValue = AdjmtAmtValue.replace(/[^0-9.]/g, '');

                if (AdjmtAmtValue.length > 1 && AdjmtAmtValue.startsWith('0') && !AdjmtAmtValue.startsWith('0.')) {
                    AdjmtAmtValue = AdjmtAmtValue.slice(1);
                }

                if (AdjmtAmtValue.startsWith('.')) {
                    // AdjmtAmtValue = '';
                    AdjmtAmtValue = '0' + AdjmtAmtValue;
                }
                const decimalParts = AdjmtAmtValue.split('.');
                if (decimalParts.length > 2) {
                    AdjmtAmtValue = decimalParts[0] + '.' + decimalParts[1];
                }

                Aitem.WriteOffAmount = AdjmtAmtValue;

                if (AdjmtAmtValue === '' || isNaN(parseFloat(AdjmtAmtValue))) {
                    Aitem.WriteOffAmount = '';
                }
                Aitem.WriteOffAmount = Aitem.WriteOffAmount || 0;
                if (Aitem.WriteOffAmount > 0) {
                    Aitem.IsAdjCodeEnable = true;
                } else {
                    Aitem.IsAdjCodeEnable = false;
                }


            }
        }
        $scope.filterPositiveBalance = function (item) {
            return item.PatientBalance > 0;
        };

        $scope.isDepositToday = function (DepositDate) {
            var DepositDateStr = $filter('date')(DepositDate, "MM-dd-yyyy");
            var todayStr = $filter('date')(new Date(), "MM-dd-yyyy");
            return DepositDateStr === todayStr;
        };

        $scope.isDepositCancelToday = function (date) {
            var DepositDateStr = $filter('date')(date, "MM-dd-yyyy");
            var todayStr = $filter('date')(new Date(), "MM-dd-yyyy");
            return DepositDateStr != todayStr;
        };
        $scope.changedecimalvalue = function (val) {
            if (val !== null) {
                let inputValue = val.toString();
                inputValue = inputValue.replace(/[^0-9.+-]/g, '');


                if (inputValue.includes('+') || inputValue.includes('-')) {
                    const signMatch = inputValue.match(/^[-+]/);
                    const sign = signMatch ? signMatch[0] : '';
                    inputValue = sign + inputValue.replace(/[-+]/g, '');
                }
                if (inputValue.startsWith('.')) {
                    inputValue = '0' + inputValue;
                } else if (inputValue.startsWith('-.')) {
                    inputValue = '-0' + inputValue.substring(1);
                }
                if (inputValue.length > 1 && inputValue.startsWith('0') && !inputValue.startsWith('0.')) {
                    inputValue = inputValue.slice(1);
                }

                const decimalParts = inputValue.split('.');
                if (decimalParts.length > 2) {
                    inputValue = decimalParts[0] + '.' + decimalParts[1];
                }

                $scope.PatientDepositsObj.DepositAmount = inputValue;

                if (inputValue === '' || isNaN(parseFloat(inputValue))) {
                    val = '';
                }
            }
        }

        $scope.GetPatientDepositEmail = function (type) {

            $scope.PatientDetails.EmailId = $scope.PatientDetails.EmailId || "";
            if (!$scope.PatientDetails.EmailId) {
                alertify.error("There is no email for this patient");
                return false;
            }

            const clinicname = $scope.PatientPaymentObj.FacilityName || "";
            const doctorname = $scope.Selectobj.DoctorName || "";
            var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddressArray.ContactNo);
            $scope.HospitalAddressArray.ContactNo = obj1.UsFormatMobileNumber;

            var obj2 = eHnoteUserDataService.UsMobileFormatChange($scope.HospitalAddressArray.MobileNo);
            $scope.HospitalAddressArray.MobileNo = obj2.UsFormatMobileNumber;
            const branchAddress = ($scope.HospitalAddressArray.Address1 || "") + ", " + ($scope.HospitalAddressArray.Address2 || "") + ", " + ($scope.HospitalAddressArray.CityName || "") + ", " + ($scope.HospitalAddressArray.StateName || "") + ", " + ($scope.HospitalAddressArray.CountryName || "") + ", " + ($scope.HospitalAddressArray.PinCode || "");

            const obj = {
                "htmlContent": $scope.htmlContent,
                "PatientId": $scope.Selectobj.PatientId,
                "OrganizationId": $scope.HospitalId,
                "PatientEmail": $scope.PatientDetails.EmailId || "",
                "ClinicName": clinicname || "",
                "DoctorName": doctorname || "",
                "BranchAddress": branchAddress || "",
                "PatientFullName": $scope.PatientDetails.PatientFullName || "",
                "BranchContactNo": $scope.HospitalAddressArray.ContactNo || "",
                "BranchMobileNo": $scope.HospitalAddressArray.MobileNo || "",
                "IsFrom": type || "",
                "HospitalAddressArray": $scope.HospitalAddressArray || {},
                "UserId": $scope.UserId,
                "AppointmentId": '',
                "EmailCommunicationProviderId": doctorinfo.doctordata.UserAddress[0].EmailCommunicationProviderId || 0,
                "EmailCommunicationEnabled": doctorinfo.doctordata.UserAddress[0].EmailCommunicationEnabled || false,
                'PatientDepositId': $scope.PatientDepositsObj.PatientDepositId || 0
            };

            eHnoteInsuranceService.GenerateLedgerUrl(obj).then(resp => {
                if (resp.data === "Success") {
                    alertify.success("Email Sent Successfully");
                }
            });
        };

        $scope.GetPatientDepositDetailsEmailNew = function (type) {

            $scope.htmlContent = document.getElementById('PatientEachDeposit_Print').innerHTML;
            $scope.GetPatientDepositEmail(type);
        };
        $scope.paymentCollection = function () {
            console.log("opup");
            $scope.PaymentPoPUP = $uibModal.open({
                "templateUrl": "paymentCollection.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "right-to-left-modal offcanves-right modal__width--30",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.paymentClose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };

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


        $scope.OpenPatientAlert = function () {

            let obj = {
                "PatientId": $scope.PatientDetails.PatientId,
                "PatientFullName": $scope.PatientDetails.PatientFullName,
                "PatientDisplayID": $scope.PatientDetails.PatientDisplayId,
                "StatusId": 2,
                "MasterPriority": $scope.MasterPriority,
                "MasterAlertTypes": $scope.MasterAlertTypes,
                "MasterAlertTag": $scope.MasterAlertTag,
                "MasterAlertNoteType": $scope.MasterAlertNoteType,
            }

            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/AddUpdatePatientAlerts.html",
                "controller": "USPatientAlertsCtrl",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__sixty-- ",
                "resolve": {
                    "PatientAlertsobj": function () { return obj; },
                },
            });

            mInstanceAdd.result.then(
                function () {

                },
                function () {

                }
            );

        }

        $scope.EditDepositAmount = function (item, id) {

            console.log(item);
            $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());

            if (item.PatientId === 0) {
                alertify.error("Please Select Patient");
                return;
            }

            $scope.IsPaymentMode = true;

            var filteredPaymodeList = (item.PatientDepositPaymodeList || []).filter(function (sitem) {
                return sitem.PaymentMethodId !== 15;
            });

            var Parentobj = {
                "PatientId": item.PatientId,
                "AppointmentId": item.AppointmentID,
                "PatientFirstName": $scope.PatientDetails.FirstName,
                "PatientLastName": $scope.PatientDetails.LastName,
                "PatientDisplayId": $scope.PatientDetails.PatientDisplayId,
                "PatientEmailId": $scope.PatientDetails.EmailId,
                "PatientGender": $scope.PatientDetails.Gender,
                "PatientAgeInYears": $scope.PatientDetails.AgeInYears,
                "PatientAgeInMonths": $scope.PatientDetails.AgeInMonths,
                "PatientDOB": $scope.PatientDetails.DOB,
                "PatientMobileNumber": $scope.PatientDetails.MobileNo,
                "PatientZipCode": $scope.PatientDetails.ZipCode,
                "UserId": $scope.UserId,
                "HospitalId": item.OrganizationId || 0,
                "PaymentAmount": item.DepositAmount,
                "DepositAmount": item.DepositAmount,
                "DepositDate": item.DepositDate,
                "ReceiptNo": item.ReceiptNo || "",
                "PaymentModeId": item.PaymentMethodId || 0,
                "PaymentMode": item.PaymentMethodName || "",
                "PaymentTypeId": 1,
                "PaymentType": "Deposit",
                "ScreenType": "AddDeposit",
                "AllCardTypes": $scope.AllCardTypes,
                "BillingProviderId": item.BillingProviderId || 0,
                "IsDepositPrint": false,
                "PatientDataObj": $scope.SelectedPatientDetails.PatientObj || {},
                "PatientDepositsObj": $scope.PatientDepositsObj || {},
                "DepositTypeId": item.DepositTypeId,
                "DepositType": item.DepositTypeName,
                "Notes": item.Notes,
                "PatientClaimId": $scope.Selectobj.PatientClaimId || null,
                "mainBillerDataObj": $scope.Selectobj.mainBillerDataObj || {},
                "IsPaymentMode": $scope.IsPaymentMode,
                "DepositTypes": $scope.DepositTypes,
                "ClaimDataObj": $scope.Selectobj.ClaimDataObj || {},
                "DepositscreenTypeId": 2,
                "PatientDepositId": item.PatientDepositId,
                "PatientDepositPaymodeList": filteredPaymodeList || [],
                "RenderingProviderId": item.RenderingProviderId,
                "RenderingProviderName": item.RenderingProviderName,
                "RenderingProviderObj": item.RenderingProviderObj || {},
                "EditOverAllBool": true,
                "TransactionCategoryId": 1,
                "TransactionCategoryName": "Deposit",
            };

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/collectPayment.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "resolve": {
                    "Parentobj": function () { return Parentobj; }
                },
                "windowClass": "modal__ninetyfive--",   // same size as add new deposit
                "controller": "UsMainNmiPaymentCtrl",
            });

            $scope.mInstanceAdd.result.then(function (resp) {
                console.log(resp);
                if (resp != undefined) {
                    if (resp.Status === "Success") {

                        $scope.SelectedPatientDetails.DepositsObj = angular.copy($scope.PatientDepositsObj) || "";
                        $scope.SelectedPatientDetails.DepositsObj.IsDepositPrint = resp.IsDepositPrint || false;

                        if ($scope.SelectedPatientDetails.DepositsObj.IsDepositPrint == true) {
                            $scope.SelectedPatientDetails.DepositsObj.ReceiptNo = resp.ReceiptNo || '';
                            $scope.SelectedPatientDetails.DepositsObj.CreatedBy = resp.CreatedBy || '';
                            $scope.SelectedPatientDetails.DepositsObj.BillingProviderName = resp.BillingProviderName || '';
                            $scope.SelectedPatientDetails.DepositsObj.PatientDepositPaymodeList = resp.PatientDepositPaymodeList || [];
                            $scope.AddTransactionPrint(resp);
                        }

                        $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());
                        $scope.SearchObj = angular.copy($scope.getSearchObj());
                        $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                        $scope.SelectedPatientDetails.DepositsObj = "";

                        if (Selectobj.Allocate == 4) {
                            $scope.ViewDepositScreen = true;
                        } else {
                            $scope.ViewDepositScreen = false;
                        }
                        $scope.showNotes = false;
                    }
                }
                $scope.IsPaymentMode = false;
                $scope.getPatientDepositAmountById();

            }, function (cancel) { });
        };

        $scope.PatientConversationsListArray = [];
        $scope.ConversationListObj = {
            PageNumber: 1,
            PageSize: 50,
            Count: 0
        };
        $scope.ConversationFilter = {
            Status: ""   // "", pending, completed, expired, closed
        };
        $scope.PendingConversationCount = 0;

        $scope.GetPatientConversationList = function (pageno) {

            $scope.ConversationListObj.PageNumber = pageno || 1;

            var obj = {
                OrganizationId: $scope.SearchPatientDepositsObj.OrganizationId,
                NMIMerchantId: 0,
                PatientId: $scope.SearchPatientDepositsObj.PatientId,
                Status: $scope.ConversationFilter.Status || "",
                PageNumber: $scope.ConversationListObj.PageNumber,
                PageSize: $scope.ConversationListObj.PageSize
            };

            console.log(JSON.stringify(obj));


            eHnotePatientDataService.GetPatientTextToPayConversationList(obj).then(function (resp) {
                if (resp.data && resp.data.status == "Success") {
                    $scope.PatientConversationsListArray = resp.data.rows || [];
                    $scope.ConversationListObj.Count = resp.data.count || 0;

                    // Update pending counter for header badge
                    $scope.PendingConversationCount =
                        $scope.PatientConversationsListArray
                            .filter(function (i) { return i.PaymentStatus === 'Pending'; })
                            .length;

                    // Default expanded state
                    angular.forEach($scope.PatientConversationsListArray, function (c) {
                        c.IsShowDetails = false;
                    });
                } else {
                    $scope.PatientConversationsListArray = [];
                    $scope.ConversationListObj.Count = 0;
                    $scope.PendingConversationCount = 0;
                    if (resp.data && resp.data.Message) {
                        alertify.error(resp.data.Message);
                    }
                }
            });
        };


        $scope.IsSyncingStatuses = false;
        $scope.LastSyncedAt = null;

        $scope.GetPatientLatestTextToPayConversationList = function () {

            if ($scope.IsSyncingStatuses) {
                return;  // prevent double-fire
            }

            $scope.IsSyncingStatuses = true;

            var obj = {
                UserId: $scope.UserId,
                OrganizationId: $scope.SearchPatientDepositsObj.OrganizationId,
                PatientId: $scope.SearchPatientDepositsObj.PatientId,
                StartDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
                EndDate: moment().format('YYYY-MM-DD'),
                Statuses: ["in progress", "completed", "expired"]
            };

            eHnotePatientDataService.GetListofTextToPayConversations(obj).then(function (resp) {


                console.log(JSON.stringify(resp));
                $scope.IsSyncingStatuses = false;

                var res = resp.data || {};

                if (res.Status === "Success") {
                    $scope.LastSyncedAt = new Date();
                    alertify.success("Statuses refreshed from NMI");

                    // Reload the list from our DB — the backend already updated rows during the NMI call
                   // $scope.GetPatientConversationList($scope.ConversationListObj.PageNumber);
                    $scope.GetPatientPendingPaymentsList($scope.ConversationListObj.PageNumber);
                } else {
                    alertify.error(res.Message || "Failed to refresh statuses");
                }
            }, function (err) {
                $scope.IsSyncingStatuses = false;
                console.error("Status sync error:", err);
                alertify.error("Failed to refresh statuses. Please try again.");
            });
        };


        $scope.ShowConversationDetails = function (item) {
            item.IsShowDetails = !item.IsShowDetails;
        };

        $scope.GetParticularTextToPayConversationLatestStatus = function (item) {
            var obj = {
                ConversationId: item.ConversationId,
                OrganizationId: $scope.SearchPatientDepositsObj.OrganizationId,
                UserId: $scope.UserId,
                MerchantId: "",
            };
            eHnotePatientDataService.GetParticularTextToPayConversation(obj).then(function (resp) {
                if ((resp.data || {}).Status === "Success") {
                    alertify.success("Status refreshed");
                    //$scope.GetPatientConversationList($scope.ConversationListObj.PageNumber);
                    $scope.GetPatientPendingPaymentsList($scope.ConversationListObj.PageNumber);
                } else {
                    alertify.error("Unable to refresh status");
                }
            });
        };

        $scope.CancelTextToPayConversation = function (item) {

            var confirmMsg =
                "Close this TextToPay request?\n\n" +
                "Patient: " + item.PatientFirstName + " " + item.PatientLastName + "\n" +
                "Amount: $" + (item.Amount || 0) + "\n" +
                "Mobile: " + item.PhoneNumber + "\n\n" +
                "The patient won't be able to pay using this link anymore.";

            if (!confirm(confirmMsg)) return;


            if (item.IsClosing) return;
            item.IsClosing = true;

            var obj = {
                ConversationId: item.ConversationId,
                OrganizationId: $scope.SearchPatientDepositsObj.OrganizationId,
                UserId: $scope.UserId
            };
            eHnotePatientDataService.CloseTextToPayConversation(obj).then(function (resp) {
                item.IsClosing = false;
                var res = resp.data || {};

                if (res.Status === "Success" || res.status === "Success") {
                    alertify.success("Conversation closed");

                    // Reload the list — UI will reflect the new Cancelled status
                    //$scope.GetPatientConversationList($scope.ConversationListObj.PageNumber);
                    $scope.GetPatientPendingPaymentsList($scope.ConversationListObj.PageNumber);
                } else {
                    alertify.error(res.Message || res.message || "Unable to close conversation");
                }
            });
        };

        $scope.NavigateToDepositRow = function (depositId) {
            $scope.DepositSubTab = 1;
            $scope.getPatientDepositAmountById();
        };

        $scope.GetCancelPaymentEOBDetails = function (item) {
            var obj = {
                "PatientId": item.PatientId,
                "PatientDepositId": item.PatientDepositId,
                "TransactionId": item.TransactionId
            };

            eHnoteInsuranceService.GetCancelPaymentEOBDetails(obj).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.rows.length > 0) {

                        item.EOBClaimInfoId = resp.data.rows[0].EOBClaimInfoId || 0;
                        item.PatientClaimId = resp.data.rows[0].PatientClaimId || 0;
                        item.OrganizationId = resp.data.rows[0].OrganizationId || 0;
                        item.OrganizationBillingProviderId = resp.data.rows[0].OrganizationBillingProviderId || 0;
                        item.EOBId = resp.data.rows[0].EOBId || 0;
                        item.PatientId = resp.data.rows[0].PatientId || 0;
                        item.ReferenceNumber = resp.data.rows[0].ReferenceNumber || '';

                        item.EOBClaimInfo = Array.isArray(resp.data.rows[0].EOBClaimInfo)
                            ? resp.data.rows[0].EOBClaimInfo
                            : [];

                        // OPEN POPUP
                        OpenCancelPaymentPopup(item);
                    }

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }

        function OpenCancelPaymentPopup(item) {

            var mInstanceAdd = $uibModal.open({
                "templateUrl": "PaymentVoidReasonPopUp.html",
                "size": "sm",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": " ",
                "resolve": {
                    "sitem": function () { return item; },
                    "UserId": function () { return $scope.UserId; },
                    "HospitalId": function () { return $scope.HospitalId; },

                },
                "controller": function ($scope, $uibModal, $uibModalInstance, sitem, UserId, HospitalId) {
                    sitem = sitem || '';
                    $scope.uibclose = function () {
                        $uibModalInstance.close("cancel");
                    }

                    $scope.HospitalId = HospitalId;
                    $scope.UserId = UserId;

                    $scope.mainNMITransactionid = "";
                    if (sitem.NMITransactionId !== 0) {
                        $scope.mainNMITransactionid = sitem.OnlineTransactionNumber || "";
                    }
                    $scope.VoidPatientObj = {
                        "VoidRemarks": '',
                    }


                    $scope.SaveOnlineVoidPaymentData = function () {
                        $scope.VoidPatientObj.VoidRemarks = $scope.VoidPatientObj.VoidRemarks || "";
                        if ($scope.VoidPatientObj.VoidRemarks == '') {
                            alertify.error("Please enter Remarks.");
                            return false;
                        }

                        if ($scope.mainNMITransactionid == "") {
                            alertify.error("you cannot perform void, as TransactionId is empty");
                            return false;
                        }

                        $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                        $scope.mainNMITransactionObj.NMITransactionId = 0;
                        $scope.mainNMITransactionObj.UserId = UserId;
                        $scope.mainNMITransactionObj.PatientId = sitem.PatientId;
                        $scope.mainNMITransactionObj.OrganizationId = sitem.OrganizationId;
                        $scope.mainNMITransactionObj.PaymentAmount = sitem.TotalPatientPayment;
                        $scope.mainNMITransactionObj.MerchentId = "";
                        $scope.mainNMITransactionObj.MerchentName = "ehnotesandbox";
                        $scope.mainNMITransactionObj.CardHolderName = sitem.PatientFullName || "";
                        $scope.mainNMITransactionObj.PatientEmail = sitem.PatientEmailId || "";
                        $scope.mainNMITransactionObj.PatientMobile = sitem.PatientMobile || "";

                        if ($scope.mainNMITransactionObj.PatientMobile != "") {
                            var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMITransactionObj.PatientMobile);
                            $scope.mainNMITransactionObj.PatientMobile = obj.UsFormatMobileNumber;
                        }

                        $scope.mainNMITransactionObj.PatientMrNo = sitem.PatientDisplayId || "";
                        $scope.mainNMITransactionObj.OrderId = "";
                        $scope.mainNMITransactionObj.OrderDescription = $scope.VoidPatientObj.VoidRemarks || "";
                        $scope.mainNMITransactionObj.TransactionId = $scope.mainNMITransactionid;
                        $scope.mainNMITransactionObj.BillPaymentTypeId = sitem.BillPaymentTypeId || 0;
                        $scope.mainNMITransactionObj.BillPaymentType = sitem.BillPaymentType || "";
                        $scope.mainNMITransactionObj.ResponseId = 0;
                        $scope.mainNMITransactionObj.ResponseCode = "";
                        $scope.mainNMITransactionObj.ResponseText = "";
                        $scope.mainNMITransactionObj.Status = "";
                        $scope.mainNMITransactionObj.TransactionTypeId = 4;
                        $scope.mainNMITransactionObj.TransactionType = "void";
                        $scope.mainNMITransactionObj.DeleteInd = "N";
                        $scope.mainNMITransactionObj.Type = "void";
                        $scope.mainNMITransactionObj.AppointmentId = sitem.AppointmentId || 0;
                        $scope.mainNMITransactionObj.VisitId = sitem.VisitId || 0;


                        eHnotePaymentGatewayService.NMIPaymentTransactionVoid($scope.mainNMITransactionObj).then(function (resp) {
                            console.log(resp.data);

                            var res = resp.data || {};
                            if (res.Status == "Success") {
                                alertify.success(res.responseText);

                                $scope.SavePatientVoidPayment();
                            }
                        })

                    };


                    $scope.SavePatientVoidPayment = function () {
                        if ($scope.VoidPatientObj.VoidRemarks == '') {
                            alertify.error("Please enter Remarks.");
                            return false;
                        }
                        let ClaimTransactions = [];
                        $scope.TotalTransactionAmount = 0;

                        angular.forEach(item.EOBClaimInfo, function (pitem) {

                            angular.forEach(pitem.EOBClaimLineItems, function (titem) {
                                if (titem.PatientWriteOffAmount != 0) {
                                    let obj3 = {
                                        "ClaimTransactionId": 0,
                                        "PatientDepositId": 0,
                                        "EOBClaimInfoId": pitem.EOBClaimInfoId || 0,
                                        "PatientClaimId": titem.PatientClaimId || 0,
                                        "ClaimLineItemId": titem.ClaimLineItemId,
                                        "OrganizationId": $scope.HospitalId,
                                        "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                                        "TransactionAmount": titem.PatientWriteOffAmount,
                                        "PatientAmount": titem.PatientWriteOffAmount,
                                        "InsuranceAmount": 0,
                                        "ReferenceNumber": "",
                                        "TransactionTypeId": 103,
                                        "TransactionType": "WriteOff Reversal",
                                        "TransactionSourceId": 3,
                                        "TransactionSource": "Patient",
                                        "SettlementStatusId": 7,
                                        "SettlementStatus": "Cancel Payment",
                                        "TransactionNotes": $scope.VoidPatientObj.VoidRemarks || "",
                                        "EOBId": sitem.EOBId || 0,
                                    }
                                    ClaimTransactions.push(obj3);
                                }

                                if (titem.PaymentAmount != 0) {
                                    let obj3 = {
                                        "ClaimTransactionId": 0,
                                        "PatientDepositId": 0,
                                        "EOBClaimInfoId": pitem.EOBClaimInfoId || 0,
                                        "PatientClaimId": titem.PatientClaimId || 0,
                                        "ClaimLineItemId": titem.ClaimLineItemId,
                                        "OrganizationId": $scope.HospitalId,
                                        "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                                        "TransactionAmount": titem.PaymentAmount,
                                        "PatientAmount": titem.PaymentAmount,
                                        "InsuranceAmount": 0,
                                        "ReferenceNumber": "",
                                        "TransactionTypeId": 101,
                                        "TransactionType": "Patient Payment Reversal",
                                        "TransactionSourceId": 3,
                                        "TransactionSource": "Patient",
                                        "SettlementStatusId": 7,
                                        "SettlementStatus": "Cancel Payment",
                                        "TransactionNotes": $scope.VoidPatientObj.VoidRemarks || "",
                                        "EOBId": sitem.EOBId || 0,
                                    }
                                    ClaimTransactions.push(obj3);
                                }

                            });

                        });

                        let obj = {
                            "EOBId": sitem.EOBId || 0,
                            "EOBClaimInfoId": sitem.EOBClaimInfoId || 0,
                            "BillingProviderId": sitem.OrganizationBillingProviderId || null,
                            "ClaimLineItemId": sitem.ClaimLineItemId,
                            "OrganizationId": sitem.OrganizationId,
                            "TransactionDate": $filter("date")(new Date(), "yyyy-MM-dd"),
                            "ReferenceNumber": sitem.ReferenceNumber,
                            "TransactionTypeId": "",
                            "TransactionType": "",
                            "TransactionSourceId": 3,
                            "TransactionSource": "Patient",
                            "SettlementStatusId": 7,
                            "SettlementStatus": "Cancel Payment",
                            "TransactionNotes": $scope.VoidPatientObj.VoidRemarks || "",
                            "UserId": $scope.UserId,
                            "PatientId": sitem.PatientId || null,
                            "PatientClaimId": sitem.PatientClaimId,
                            "ClaimTransactions": ClaimTransactions
                        }

                        console.log(JSON.stringify(obj))

                        eHnoteInsuranceService.UpdateVoidPatientPayment(obj).then(function (resp) {
                            console.log(resp);
                            if (resp.data.Status === "Success") {

                                $uibModalInstance.close(resp.data);
                                alertify.success("Payment cancelled successfully.")
                            } else {
                                alertify.error(resp.data.Message);
                            }
                        });
                    }


                }
            });

            mInstanceAdd.result.then(function () {
                $scope.getPatientDepositAmountById();
                $scope.GetPatientPaymentsDetails();

            }, function () {
                $scope.getPatientDepositAmountById();
                $scope.GetPatientPaymentsDetails();
            });
        }


        $scope.PatientPendingPaymentsArray = [];
        $scope.PendingFilter = { Source: "" };   // "", ACH, TextToPay

        $scope.GetPatientPendingPaymentsList = function (pageno) {
            $scope.ConversationListObj.PageNumber = pageno || 1;

            var obj = {
                OrganizationId: $scope.SearchPatientDepositsObj.OrganizationId,
                PatientId: $scope.SearchPatientDepositsObj.PatientId,
                Source: $scope.PendingFilter.Source || "",
                PageNumber: $scope.ConversationListObj.PageNumber,
                PageSize: $scope.ConversationListObj.PageSize
            };

            eHnotePatientDataService.GetPatientPendingNMIPaymentsList(obj).then(function (resp) {
                if (resp.data && resp.data.status == "Success") {
                    $scope.PatientPendingPaymentsArray = resp.data.rows || [];
                    $scope.ConversationListObj.Count = resp.data.count || 0;
                    $scope.PendingConversationCount = $scope.PatientPendingPaymentsArray.length;

                    angular.forEach($scope.PatientPendingPaymentsArray, function (c) {
                        c.IsShowDetails = false;
                    });
                } else {
                    $scope.PatientPendingPaymentsArray = [];
                    $scope.ConversationListObj.Count = 0;
                    $scope.PendingConversationCount = 0;
                    if (resp.data && resp.data.Message) alertify.error(resp.data.Message);
                }
            });
        };
        $scope.CheckACHStatus = function (item) {
            if (!item.GatewayTransactionId) {
                alertify.error("No gateway transaction id to check.");
                return;
            }

            var params = {
                "TransactionId": item.GatewayTransactionId,
                "OrganizationId": $scope.HospitalId
            };
            eHnotePaymentGatewayService.GetNMITransactionStatusQuery(params)
                .then(function (resp) {
                    var res = resp.data || {};

                    if (res.Outcome === "Settled" || res.Outcome === "Returned") {
                        // status advanced -> the row left the pending list, reload
                        alertify.success(res.Message || "Status updated");
                        $scope.GetPatientPendingPaymentsList($scope.ConversationListObj.PageNumber);
                    } else if (res.Outcome === "Pending") {
                        // nothing changed -> don't reload, just inform
                        alertify.success("Latest status fetched — still pending settlement");
                    } else {
                        alertify.success(res.Message || "Status checked");
                    }
                });
        };

        $scope.ResetDepositFilter = function () {
            $scope.PatientDepositsObj.TransactionCategoryId = 1;
            $scope.getPatientDepositAmountById();
        };
    }]);


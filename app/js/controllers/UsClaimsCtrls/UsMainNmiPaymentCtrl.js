
"use strict";
eHnoteWebApp.controller("UsMainNmiPaymentCtrl", ["$scope", "$filter", "alertify", "$q", "$uibModal", "$uibModalInstance", "eHnoteMasterDataService", "eHnoteInsuranceService", "eHnotePatientDataService", "eHnoteSettingsDataService", "eHnoteUserDataService", "eHnotePrintService", "datapersistanceFactory", "Parentobj", "localStorageFactory", "eHnoteUserAppointmentDataService", "eHnoteLoginStatusService", "eHnoteMainAppointmentService", "eHnotePaymentGatewayService", "$timeout", "eHnoteCacheStorageService", "eHnoteAuditServices", "$location",
    function ($scope, $filter, alertify, $q, $uibModal, $uibModalInstance, eHnoteMasterDataService, eHnoteInsuranceService, eHnotePatientDataService, eHnoteSettingsDataService, eHnoteUserDataService, eHnotePrintService, datapersistanceFactory, Parentobj, localStorageFactory, eHnoteUserAppointmentDataService, eHnoteLoginStatusService, eHnoteMainAppointmentService, eHnotePaymentGatewayService, $timeout, eHnoteCacheStorageService, eHnoteAuditServices, $location) {


        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        $scope.userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.RoleId = $scope.userLoginDetails.RoleID;
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;

        //ConvenienceFee Static assigning

        $scope.IsConvenienceFeeEnabledForPaymentGateway = false;
        $scope.ConvenienceFeeValue = 0;
        $scope.ConvenienceFeeTypeId = null;
        $scope.ConvenienceFeeSettings = [];
        $scope.textToPayUSnumberString = "";
        $scope.ConvenienceFeeMap = {};


        console.log($scope.IsConvenienceFeeEnabledForPaymentGateway + "__$scope.IsConvenienceFeeEnabledForPaymentGateway");
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined) {
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
            $scope.IsConvenienceFeeEnabledForPaymentGateway = doctorinfo.doctordata.UserAddress[0].IsConvenienceFeeEnabledForPaymentGateway;
        };
        console.log($scope.IsConvenienceFeeEnabledForPaymentGateway + "__$scope.IsConvenienceFeeEnabledForPaymentGateway");
        console.log(doctorinfo);

        $scope.MainParentobj = Parentobj;
        $scope.MainParentobj.HospitalId = $scope.MainParentobj.HospitalId || 0;

        $scope.MainParentobj.DepositscreenTypeId = $scope.MainParentobj.DepositscreenTypeId;

        if ($scope.MainParentobj.DepositscreenTypeId == 1) {
            $scope.IsShowDepsoitNewScreen = false;
        } else if ($scope.MainParentobj.DepositscreenTypeId == 2) {
            $scope.IsShowDepsoitNewScreen = true;
        }

        $scope.showAddposnew = false;

        $scope.ShowPOSTransctionPopup = false;
        if (Parentobj.ScreenType === "AddPOS") {
            $scope.showAddposnew = true;
        }
        $scope.DepositTypes = [];
        if ($scope.MainParentobj.DepositTypes != undefined) {
            $scope.DepositTypes = $scope.MainParentobj.DepositTypes || [];
        }

        $scope.EditOverAllBool = $scope.MainParentobj.EditOverAllBool || false;

        $scope.AllLocations = [];
        $scope.allUserList = [];
        $scope.PatientClaimList = [];
        if ($scope.MainParentobj.PatientClaimList != undefined) {
            $scope.PatientClaimList = $scope.MainParentobj.PatientClaimList || []
        }
        $scope.PatientPaymentObj = {};
        if ($scope.MainParentobj.PatientPaymentObj != undefined) {
            $scope.PatientPaymentObj = $scope.MainParentobj.PatientPaymentObj || {};
        }

        $scope.AllCardTypes = $scope.MainParentobj.AllCardTypes || [];
        $scope.masterPaymentTypes = [
            {
                "PaymentTypeId": 1,
                "PaymentType": "Deposit"
            },
            {
                "PaymentTypeId": 2,
                "PaymentType": "Payment"
            },
            {
                "PaymentTypeId": 3,
                "PaymentType": "PointOfSale"
            }
        ];

        $scope.notesPopoverClick = {
            templateUrl: 'notesPopover.html',
        };

        $scope.selectedRowIndex = 0;

        $scope.infoPopover = {
            templateUrl: 'infoPopover.html',
        };

        var mObj = datapersistanceFactory.getItem("masterDataArrays");
        $scope.masterPaymentModes = [];
        $scope.filteredPaymentModes = [];
        if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
            $scope.masterPaymentModes = mObj.PaymentModes;
            $scope.filteredPaymentModes = $scope.masterPaymentModes || [];
        }
        $scope.filteredPaymentModes = $scope.masterPaymentModes.filter(function (item) {
            return item.PaymentModeId !== 13 && item.PaymentModeId !== 14 && item.PaymentModeId !== 12;
        });
        //if ($scope.MainParentobj.PaymentTypeId == 1) {
        //    if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
        //        $scope.masterPaymentModes = mObj.PaymentModes;
        //        $scope.filteredPaymentModes = $scope.masterPaymentModes || [];
        //    }
        //    $scope.filteredPaymentModes = $scope.masterPaymentModes.filter(function (item) {
        //        return item.PaymentModeId !== 13 && item.PaymentModeId !== 14;
        //    });
        //} else {
        //    if (mObj.PaymentModes && mObj.PaymentModes.length > 0) {
        //        $scope.masterPaymentModes = mObj.PaymentModes;
        //        $scope.filteredPaymentModes = $scope.masterPaymentModes || [];
        //    }
        //}

        $scope.masterPaymentProcessingTypes = [
            {
                "PaymentProcessTypeId": 1,
                "PaymentProcessType": "Device(EMV)",
                "disabled": false
            },
            {
                "PaymentProcessTypeId": 3,
                "PaymentProcessType": "Payment Page",
                "disabled": false
            },
            {
                "PaymentProcessTypeId": 4,
                "PaymentProcessType": "Without Gateway",
                "disabled": false
            }
        ];

        var currenturl = $location.absUrl().split('?')[0];
        var CurrentEnvironment = currenturl.split('/#')[0];
        if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com") {
            $scope.masterPaymentProcessingTypes = $scope.masterPaymentProcessingTypes.filter(function (item) {
                return item.PaymentProcessTypeId === 4 || item.PaymentProcessTypeId === 3;
            });
            angular.forEach($scope.masterPaymentProcessingTypes, function (item) {
                if (item.PaymentProcessTypeId === 3) {
                    item.disabled = true; // disable only Payment Page
                }
            });
        }




        $scope.GetPatientDepositsLitsObj = function () {
            return {
                "DepositFrom": "",
                "DepositTo": "",
                "PatientId": $scope.MainParentobj.PatientId,
                "OrganizationId": $scope.MainParentobj.HospitalId,
                "PaymentModeId": 0,
                "PageSize": 10,
                "PageNumber": 1,
                "TransactionNumber": "",
                "Type": 1
            }
        };

        $scope.SearchPatientDepositsObj = angular.copy($scope.GetPatientDepositsLitsObj());


        $scope.MainParentobj.ClaimDataObj = $scope.MainParentobj.ClaimDataObj || null;
        var BillingProviderId = '';
        var HospitalId = 0;
        var HospitalName = "";
        var RenderingProviderId = 0;
        if ($scope.MainParentobj.ClaimDataObj != null && Object.keys($scope.MainParentobj.ClaimDataObj).length > 0) {
            BillingProviderId = $scope.MainParentobj.ClaimDataObj.BillingProviderId || '';
            HospitalId = $scope.MainParentobj.ClaimDataObj.OrganizationId || 0;
            RenderingProviderId = $scope.MainParentobj.ClaimDataObj.RenderingProviderId || 0;
            var filtredBranchArray = $filter("filter")($scope.AllBranchesList, { "BranchId": HospitalId }, true) || [];
            if (filtredBranchArray.length > 0) {
                HospitalName = filtredBranchArray[0].ClinicName;
            }
        } else {
            HospitalId = $scope.HospitalId;
            var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": $scope.HospitalId }, true) || [];
            if (filtredArray.length > 0) {
                BillingProviderId = filtredArray[0].DefaultBillingProviderId;
                HospitalId = filtredArray[0].BranchId;
                HospitalName = filtredArray[0].ClinicName;
            }
        }

        $scope.IsKountEnabled = false;

        $scope.GetPatientDepositsObj = function () {
            var obj = {
                "UserId": $scope.UserId,
                "HospitalId": HospitalId,
                "OrganizationId": HospitalId,
                "PatientDepositId": 0,
                "PatientDepositPaymodeListId": 0,
                "PatientId": $scope.MainParentobj.PatientId || 0,
                "ReceiptNo": "",
                "ReceiptId": 0,
                "DepositDate": $filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss'),
                "PaymentDate": $filter('date')(new Date(), 'MM-dd-yyyy'),
                "DepositAmount": "",
                "DepositedByUserId": "",
                "DepositedBy": "",
                "UnBilledAmount": 0.00,
                "BilledAmount": 0.00,
                "DeleteInd": "N",
                "AppointmentId": $scope.MainParentobj.AppointmentId || 0,
                "BillingProviderId": BillingProviderId,
                "BillingProviderObj": "",
                "DepositTypeId": 3,
                "DepositTypeName": "General",
                "PaymentModeId": 1,
                "PaymentMode": "Cash",
                "ChequeNumber": "",
                "CardNumber": "",
                "OnlineTransactionNumber": "",
                "CardTypeId": "",
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
                "IsDepositLineItemDisabled": false,
                "Status": "",
                "PaymentMethodId": 1,
                "PaymentMethodName": "Cash",
                "RecievedUserId": 0,
                "RecievedUserName": "",
                "IsShoweachDepositNotes": false,
                "RenderingProviderId": RenderingProviderId,
                "IsActive": false,
                // ── NEW: side panel fields — one per row ─────────────────────
                // Payment processing
                "PaymentProcessTypeId": "",
                "PaymentProcessType": "",
                "PoiDeviceId": "",

                // Card details
                "CardType": "",
                "CardHolderName": "",
                "CardBillingZip": "",
                "CardBillingAddress1": "",
                "CardBillingAddress2": "",
                "CardBillingCity": "",
                "CardBillingState": "",

                // ACH details
                "ACHAccountNumber": "",
                "ACHABANumber": "",
                "ACHAccountName": "",

                // Transaction
                "TransactionId": "",
                "NMITransactionId": 0,
                "TransactionReceiptNo": "",
                "TransactionDate": "",
                "TransactionTime": "",
                "ReceiptNo": "",

                // Merchant (filled when location selected)
                "MerchentId": 0,
                "MerchentName": "",
                "ProcessorId": "",
                "ProcessorName": "",
                "TokenizationKey": "",
                "PublicCheckOutKey": "",
                "HospitalName": HospitalName,
                "OriginalAmount": 0,
                "ConvenienceFeeAmount": 0,
                "FinalChargedAmount": 0
            }

            return obj;
        };

        $scope.PatientDepositsObj = angular.copy($scope.GetPatientDepositsObj());

        $scope.IsShowDepositFields = false;

        $scope.GetPOSAddanotherpayment = function () {
            var obj = {
                "PaymentId": 0,
                "InvoiceId": 0,
                "PaymentMethodId": 0,
                "PaymentMethod": "",
                "PaymentAmount": 0,
                "PatientDepositId": null,
                "TransactionTypeId": "",
                "TransactionType": "",
                "DeleteInd": "",
                "CardNumber": "",
                "CardType": "",
                "CardtypeId": 0,
                "NMITransactionId": "",
                "OnlineTransactionNumber": null,
                "PaymentProcessTypeId": null,
                "PaymentProcessType": null,
                "BillPaymentTypeId": null,
                "BillPaymentType": null,
                "PaymentTransactionTypeId": null,
                "PaymentTransactionType": null,
                "Remarks": "",
                "IsDisablePOS": true,
                "CardHolderName": "",
                "ManualAmount": 0,
                "CardBillingZip": "",
                "PoiDeviceId": "",
                "ReferenceNumber": "",
            };
            return obj;
        }

        $scope.POSAddanotherpaymentObj = angular.copy($scope.GetPOSAddanotherpayment());
        $scope.RenderingProviderID = 0;
        $scope.RenderingProviderName = "";
        $scope.allFieldsValid = true;
        $scope.isPaymentInProgress = false;
        $scope._nmiLoadedKey = null;
        $scope.kountSessionId = null;
        $scope.ccValitationobj = {
            "ccnumbervalid": false,
            "ccexpiry": false,
            "cccvv": false,
            "checkaccountvalid": false,
            "checkroutingnovalid": false,
            "checknamevalid": false,
        };

        if ($scope.MainParentobj.RenderingProviderId != undefined) {
            if ($scope.MainParentobj.RenderingProviderId != 0) {
                $scope.RenderingProviderID = $scope.MainParentobj.RenderingProviderId || 0;
                $scope.RenderingProviderName = $scope.MainParentobj.RenderingProviderName || "";

            }
        }

        function getemptyPaymentreqObj() {

            var UITransactionStatus = "Ready"; //If Transaction is ready to submit. 
            //"Processing"//If Transaction is processing.
            //"Success" //If Transaction is Success.
            //"Failure" //If Transaction is Failure.

            var obj = {
                "UserId": $scope.MainParentobj.UserId,
                "HospitalId": $scope.MainParentobj.HospitalId || 0,
                "PatientId": $scope.MainParentobj.PatientId,
                "PatientFirstName": $scope.MainParentobj.PatientFirstName,
                "PatientLastName": $scope.MainParentobj.PatientLastName,
                "PatientEmailId": $scope.MainParentobj.PatientEmailId,
                "PatientMrno": $scope.MainParentobj.PatientDisplayId,
                "PatientGender": $scope.MainParentobj.PatientGender,
                "PatientAgeInYears": $scope.MainParentobj.PatientAgeInYears,
                "PatientAgeInMonths": $scope.MainParentobj.PatientAgeInMonths,
                "PatientDOB": $scope.MainParentobj.PatientDOB,
                "PatientMobileNumber": $scope.MainParentobj.PatientMobileNumber,
                "NMITransactionId": 0,
                "PaymentAmount": $scope.MainParentobj.PaymentAmount || 0,
                "PaymentDate": $filter('date')(new Date(), 'MM-dd-yyyy'),
                "AppointmentId": $scope.MainParentobj.AppointmentId || 0,
                "VisitId": $scope.MainParentobj.VisitId || 0,
                "MerchentId": 0,
                "MerchentName": "",
                "MerchentKey": "",
                "PaymentToken": "",
                "HospitalName": "",
                "HospitalObj": "",
                "RenderingProviderId": $scope.RenderingProviderID,
                "RenderingProviderName": "",
                "RenderingProviderObj": {
                    // "SecondUserFullName": $scope.RenderingProviderName || ""
                    "SecondUserFullName": ""
                },
                "RecievedUserId": 0,
                "RecievedUserName": "",
                "RecievedUserObj": {
                    "SecondUserFullName": ""
                },
                "PaymentTypeId": $scope.MainParentobj.PaymentTypeId || "",
                "PaymentType": $scope.MainParentobj.PaymentType || "",
                "ShowPaymentNote": false,
                "PaymentNote": $scope.MainParentobj.Notes,
                "PaymentModeId": $scope.MainParentobj.PaymentModeId || 1,
                "PaymentMode": $scope.MainParentobj.PaymentMode || "Cash",
                "PaymentProcessTypeId": 0,
                "PaymentProcessType": "",
                "TransactionTypeId": 1,
                "TransactionType": "sale",
                "TransactionId": "",
                "UITransactionStatus": UITransactionStatus,
                "StatusId": 0,
                "Status": "",
                "ResponseId": 0,
                "ResponseCode": "",
                "ResponseText": "",
                "DeleteInd": "N",
                "CardTypeId": $scope.MainParentobj.PatientDepositPaymodeList?.length > 0 ? $scope.MainParentobj.PatientDepositPaymodeList[0].CardTypeId : "",
                "CardType": $scope.MainParentobj.PatientDepositPaymodeList?.length > 0 ? $scope.MainParentobj.PatientDepositPaymodeList[0].CardType : "",
                "CardHolderName": "",
                "ChequeNumber": $scope.MainParentobj.PatientDepositPaymodeList?.length > 0 ? $scope.MainParentobj.PatientDepositPaymodeList[0].ChequeNumber : "",
                "CardNumber": $scope.MainParentobj.PatientDepositPaymodeList?.length > 0 ? $scope.MainParentobj.PatientDepositPaymodeList[0].CardNumber : "",
                "CardExpiry": "",
                "Cvv": "",
                "ZipCode": $scope.MainParentobj.Patientzip,
                "ACHAccountName": "",
                "ACHABANumber": "",
                "ACHAccountNumber": "",
                "PoiDeviceId": "",
                "CardBillingAddress1": "",
                "CardBillingAddress2": "",
                "CardBillingState": "",
                "CardBillingCity": "",
                "CardBillingZip": "",
                "PatientDepositPaymodeListId": 0,
                "PatientDepositId": $scope.MainParentobj.PatientDepositId || 0,
                "TransactionReceiptNo": "",
                "DepositTransactionDate": "",
                "DepositTransactionTime": "",
                "ProcessorId": "",
                "ProcessorName": "",
                "TokenizationKey": "",
                "PublicCheckOutKey": "",
                "OrganizationTransactionId": $scope.HospitalId,
                "OrganizationTransactionName": "",
                "BillingProviderId": $scope.MainParentobj.BillingProviderId || 0,
                "TransactionDate": "",
                "TransactionTime": "",
                "Remarks": "",
                "DepositTypeId": 3,
                "DepositTypeName": "General",
                "PatientDepositLineItem": [],
                "IsDepositPrint": false,
                /*     "GetPOSAddanotherpayment": [],*/
                "POSMultiPaymentsArray": [],
            }
            return obj;
        };
        $scope.PatientDepositPaymodeList = [];
        $scope.restructureUsersList = function (usersarray, type) {
            var loadType = type || "";
            $scope.allUserList = usersarray || [];
            $scope.AllCounsollerList = angular.copy($scope.allUserList);
            $scope.AllDilationList = angular.copy($scope.allUserList);
            $scope.AllTechnicianList = angular.copy($scope.allUserList);
            $scope.AllOpthaList = angular.copy($scope.allUserList);
            $scope.AllOptometristList = angular.copy($scope.allUserList);
            $scope.AllDoctorList = angular.copy($scope.allUserList);
            $scope.AllPlayDoctorList = angular.copy($scope.allUserList);
            $scope.AllARList = angular.copy($scope.allUserList);
            $scope.AllBillingList = angular.copy($scope.allUserList);
            $scope.AllPlayBillingList = angular.copy($scope.allUserList);
            $scope.AllReceptionList = angular.copy($scope.allUserList);

            $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
            $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57;
            });

            var DoctorObj = $filter("filter")($scope.allUserList, function (item, index) { return item.DoctorID == $scope.UserId })[0];
            if (DoctorObj != undefined || DoctorObj != null) {
                $scope.DoctorObj = DoctorObj;
                $scope.mainNMIPaymentRequestObj.RecievedUserId = $scope.DoctorObj.DoctorID;
                $scope.mainNMIPaymentRequestObj.RecievedUserName = $scope.DoctorObj.UserFullName;
                $scope.mainNMIPaymentRequestObj.RecievedUserObj = $scope.DoctorObj || '';
            }


            $scope.AllPlayDoctorList = _.uniq($scope.AllPlayDoctorList, false, function (p) { return p.DoctorID; });
            $scope.AllPlayDoctorList = $filter("filter")($scope.AllPlayDoctorList, function (item) {
                return (item.RoleId === 1 && item.SuffixId !== 13) || (item.RoleId === 43 && item.SuffixId !== 13);
            });
            $scope.AllOpthaList = _.uniq($scope.AllOpthaList, false, function (p) { return p.DoctorID; });
            $scope.AllOpthaList = $filter("filter")($scope.AllOpthaList, function (item) {
                return item.RoleId === 10;
            });

            $scope.AllOptometristList = _.uniq($scope.AllOptometristList, false, function (p) { return p.DoctorID; });
            $scope.AllOptometristList = $filter("filter")($scope.AllOptometristList, function (item) {
                return (item.RoleId === 1 && item.SuffixId === 13) || (item.RoleId === 43 && item.SuffixId === 13) || item.RoleId === 16;
            });

            $scope.AllCounsollerList = _.uniq($scope.AllCounsollerList, false, function (p) { return p.DoctorID; });
            $scope.AllCounsollerList = $filter("filter")($scope.AllCounsollerList, function (item) {
                return item.RoleId === 18;
            });
            $scope.AllDilationList = _.uniq($scope.AllDilationList, false, function (p) { return p.DoctorID; });
            $scope.AllDilationList = $filter("filter")($scope.AllDilationList, function (item) {
                return item.RoleId === 54 || item.RoleId === 2 || item.RoleId === 10;
            });
            $scope.AllTechnicianList = _.uniq($scope.AllTechnicianList, false, function (p) { return p.DoctorID; });
            $scope.AllTechnicianList = $filter("filter")($scope.AllTechnicianList, function (item) {
                return item.RoleId === 10 || item.RoleId === 38 || item.RoleId === 55;
            });
            $scope.AllARList = _.uniq($scope.AllARList, false, function (p) { return p.DoctorID; });
            $scope.AllARList = $filter("filter")($scope.AllARList, function (item) {
                return item.RoleId === 61;
            });
            $scope.AllBillingList = _.uniq($scope.AllBillingList, false, function (p) { return p.DoctorID; });
            $scope.AllBillingList = $filter("filter")($scope.AllBillingList, function (item) {
                return item.RoleId === 2 || item.RoleId === 19;
            });
            $scope.AllPlayBillingList = _.uniq($scope.AllPlayBillingList, false, function (p) { return p.DoctorID; });
            $scope.AllPlayBillingList = $filter("filter")($scope.AllPlayBillingList, function (item) {
                return item.RoleId === 2 || item.RoleId === 19 || item.RoleId === 64 || item.RoleId === 65 || item.RoleId === 71;
            });

            $scope.AllReceptionList = _.uniq($scope.AllReceptionList, false, function (p) { return p.DoctorID; });
            $scope.AllReceptionList = $filter("filter")($scope.AllReceptionList, function (item) {
                return item.RoleId === 2;
            });

            if ($scope.MainParentobj.ClaimDataObj != null && Object.keys($scope.MainParentobj.ClaimDataObj).length > 0) {
                var filtredRenderArray = $filter("filter")($scope.AllDoctorList, { "DoctorID": $scope.MainParentobj.ClaimDataObj.RenderingProviderId }, true) || [];
                if (filtredRenderArray.length > 0) {
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[0].RenderingProviderId = filtredRenderArray[0].DoctorID;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[0].RenderingProviderName = filtredRenderArray[0].UserFullName;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[0].UserBranchId = filtredRenderArray[0].UserBranchId;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[0].RenderingProviderObj = filtredRenderArray[0] || '';
                }
            }
            else {
                var DoctorObj = $filter("filter")($scope.allUserList, function (item, index) { return item.DoctorID == $scope.UserId })[0];
                if (DoctorObj != undefined || DoctorObj != null) {
                    $scope.DoctorObj = DoctorObj;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[0].RenderingProviderId = $scope.DoctorObj.DoctorID;
                    //$scope.mainNMIPaymentRequestObj.RecievedUserName = $scope.DoctorObj.FullName;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[0].RenderingProviderName = $scope.DoctorObj.UserFullName;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[0].RenderingProviderObj = $scope.DoctorObj || '';
                }
            }

            if ($scope.MainParentobj.DepositscreenTypeId == 1) {
                var renderingObj = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.MainParentobj.RenderingProviderId })[0];
                if (renderingObj != undefined || renderingObj != null) {
                    $scope.mainNMIPaymentRequestObj.RenderingProviderId = renderingObj.DoctorID;
                    $scope.mainNMIPaymentRequestObj.RenderingProviderName = renderingObj.UserFullName;
                    $scope.mainNMIPaymentRequestObj.UserBranchId = renderingObj.UserBranchId;
                    $scope.mainNMIPaymentRequestObj.RenderingProviderObj = renderingObj || '';
                }
                $scope.mainNMIPaymentRequestObj.DepositTypeId = $scope.MainParentobj.DepositTypeId || 0;
            }


        }

        $scope.ShowPatientDetailsList = function (PatientId) {

            eHnoteAuditServices.getPatientDetailsById(PatientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
            function ongetPatientDetailsSuccess(data) {
                console.log(data);
                if (data != undefined) {
                    var patientitem = data;
                    $scope.PatientProfileDetails = data;
                    $scope.PatientId = patientitem.Patient[0].PatientID;
                    $scope.mainNMIPaymentRequestObj.PatientFirstName = patientitem.Patient[0].FirstName;
                    $scope.mainNMIPaymentRequestObj.PatientLastName = patientitem.Patient[0].LastName;
                    $scope.mainNMIPaymentRequestObj.CardHolderName = patientitem.Patient[0].FullName || "";
                    $scope.mainNMIPaymentRequestObj.PatientId = patientitem.Patient[0].PatientID;
                    $scope.mainNMIPaymentRequestObj.PatientDOB = patientitem.Patient[0].DOB;
                    if ($scope.mainNMIPaymentRequestObj.PatientDOB != "") {
                        $scope.mainNMIPaymentRequestObj.PatientDOB = $filter('date')($scope.mainNMIPaymentRequestObj.PatientDOB, 'MM-dd-yyyy');
                    }
                    $scope.mainNMIPaymentRequestObj.PatientGender = patientitem.Patient[0].Gender;
                    $scope.mainNMIPaymentRequestObj.PatientMobileNumber = patientitem.Patient[0].MobileNo || "";
                    if ($scope.mainNMIPaymentRequestObj.PatientMobileNumber != "") {
                        var obj = eHnoteUserDataService.UsMobileFormatChange($scope.mainNMIPaymentRequestObj.PatientMobileNumber);
                        $scope.mainNMIPaymentRequestObj.PatientMobileNumber = obj.UsFormatMobileNumber;
                    }

                    $scope.mainNMIPaymentRequestObj.PatientAgeInYears = patientitem.Patient[0].AgeInMonths || "";
                    $scope.mainNMIPaymentRequestObj.PatientAgeInYears = patientitem.Patient[0].AgeInYears || "";
                    $scope.mainNMIPaymentRequestObj.PatientEmailId = patientitem.Patient[0].EmailId;
                    $scope.mainNMIPaymentRequestObj.PatientMrno = patientitem.Patient[0].PatientDisplayId || "";
                    $scope.mainNMIPaymentRequestObj.S3URL = patientitem.Patient[0].S3URL || "";


                    $scope.mainNMIPaymentRequestObj.CardBillingAddress1 = patientitem.PatientAddress.PostalAddress.AddressLine1 || "";
                    $scope.mainNMIPaymentRequestObj.CardBillingAddress2 = patientitem.PatientAddress.PostalAddress.AddressLine2 || "";
                    $scope.mainNMIPaymentRequestObj.CardBillingZip = patientitem.PatientAddress.PostalAddress.ZipCode || "";
                    $scope.mainNMIPaymentRequestObj.CardBillingCity = patientitem.PatientAddress.PostalAddress.CityName;
                    $scope.mainNMIPaymentRequestObj.CardBillingState = patientitem.PatientAddress.PostalAddress.StateName;

                }
            }
            function ongetPatientDetailsError(error) {
                console.log(error);
            }

        }

        $scope.loadNmiGatewayScript = function () {
            
            if (window.Gateway) return $q.resolve(window.Gateway);

            var d = $q.defer();
            var existing = document.getElementById("nmi-gateway-script");
            if (existing) {
                $timeout(function () {
                    window.Gateway ? d.resolve(window.Gateway) : d.reject("Gateway.js not ready");
                }, 0);
                return d.promise;
            }
            var script = document.createElement("script");
            script.src = "https://secure.nmi.com/js/v1/Gateway.js";
            script.id = "nmi-gateway-script";
            script.onload = function () {
                $timeout(function () {
                    window.Gateway ? d.resolve(window.Gateway)
                        : d.reject("Gateway.js not available after load");
                }, 0);
            };
            script.onerror = function () { d.reject("Failed to load Gateway.js"); };
            document.body.appendChild(script);
            return d.promise;
        };
        $scope.loadNmiCollectScript = function (tokenizationKey) {
            tokenizationKey = tokenizationKey || $scope.mainNMIPaymentRequestObj.TokenizationKey;
            if (!tokenizationKey) return $q.reject("Missing tokenization key");

            // Same merchant already live -> reuse
            if ($scope._nmiLoadedKey === tokenizationKey && window.CollectJS) {
                return $q.resolve(window.CollectJS);
            }

            // New/different merchant -> tear down old, load fresh
            $scope.destroyNmiCollectScript();
            $scope._nmiLoadedKey = tokenizationKey;

            var d = $q.defer();
            const script = document.createElement("script");
            script.src = "https://secure.nmi.com/token/Collect.js";
            script.setAttribute("data-tokenization-key", tokenizationKey);
            script.setAttribute("data-variant", "inline");
            script.id = "nmi-collect-script";
            script.onload = function () {
                $timeout(function () {
                    window.CollectJS ? d.resolve(window.CollectJS)
                        : d.reject("CollectJS not available after load");
                }, 0);
            };
            script.onerror = function () {
                $scope._nmiLoadedKey = null;
                d.reject("Failed to load Collect.js");
            };
            document.body.appendChild(script);
            return d.promise;
        };

        $scope.destroyNmiCollectScript = function () {
            const script = document.querySelector('script[src="https://secure.nmi.com/token/Collect.js"]');
            if (script) script.remove();

            document.querySelectorAll("iframe[src*='secure.nmi.com']").forEach(el => el.remove());

            ["#nmi-ccnumber", "#nmi-cvv", "#nmi-exp", "#nmi-chkacctnumber", "#nmi-checkaba", "#nmi-checkname"]
                .forEach(selector => {
                    const el = document.querySelector(selector);
                    if (el) el.innerHTML = "";
                });

            const wrapper = document.getElementById("nmi-payment-wrapper");
            if (wrapper) {
                wrapper.innerHTML = "";
            }

            try { delete window.CollectJS; } catch (e) { }
            try { delete window.tokenizationForm; } catch (e) { }
            $scope._nmiLoadedKey = null;
        };

        $scope.GetAllUsersBySelectedBranch = function (id) {


            var reqObj = {
                "BranchId": id || 0,
            }

            eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
            function onGetUsersSuccess(resp) {
                resp.rows = resp.rows || [];
                if (resp.rows.length > 0) {
                    // $scope.restructureUsersList(resp.rows, 'OnChange')
                } else {
                    alertify.error("No Users Found in Selected Departments");
                    $scope.clinicDoctorList = [];
                }
            }

            function onGetUsersFailure(data) {
            }
        };

        $scope.ChangePaymentLocation = function (H_id) {
            $scope.defaultbranch = $filter("filter")($scope.AllLocations, function (item) {
                return item.BranchId === H_id;
            });
            $scope.defaultbranch = $scope.defaultbranch || [];
            if ($scope.defaultbranch.length > 0) {
                console.log($scope.defaultbranch[0])
                $scope.mainNMIPaymentRequestObj.HospitalId = $scope.defaultbranch[0].ClinicId;
                $scope.mainNMIPaymentRequestObj.HospitalName = $scope.defaultbranch[0].ClinicName;
                $scope.mainNMIPaymentRequestObj.HopitalObj = $scope.defaultbranch[0];
                $scope.mainNMIPaymentRequestObj.MerchentId = $scope.defaultbranch[0].NMIMerchantId;
                $scope.mainNMIPaymentRequestObj.ProcessorId = $scope.defaultbranch[0].ProcessorId;
                $scope.mainNMIPaymentRequestObj.ProcessorName = $scope.defaultbranch[0].ProcessorName;
                $scope.mainNMIPaymentRequestObj.TokenizationKey = $scope.defaultbranch[0].TokenizationKey || '';
                $scope.mainNMIPaymentRequestObj.PublicCheckOutKey = $scope.defaultbranch[0].PublicCheckOutKey || '';
                $scope.mainNMIPaymentRequestObj.BillingProviderId = $scope.defaultbranch[0].DefaultBillingProviderId;
            }

            //setTimeout(function () {
            //    $scope.initCollectJS();
            //}, 100);
           // $scope.loadNmiCollectScript($scope.mainNMIPaymentRequestObj.TokenizationKey).catch(function (e) { console.warn("Collect.js preload:", e); });
        };

        $scope.ChangeDepositPaymentLocation = function (H_id, litem) {

            litem = litem || null;

            $scope.defaultbranch = $filter("filter")($scope.AllLocations, function (item) {
                return item.BranchId === H_id;
            });
            $scope.defaultbranch = $scope.defaultbranch || [];
            if (litem != null) {
                if ($scope.defaultbranch.length > 0) {
                    console.log($scope.defaultbranch[0])
                    litem.HospitalId = $scope.defaultbranch[0].ClinicId;
                    litem.OrganizationId = $scope.defaultbranch[0].ClinicId;
                    litem.HospitalName = $scope.defaultbranch[0].ClinicName;
                    litem.HopitalObj = $scope.defaultbranch[0];
                    litem.MerchentId = $scope.defaultbranch[0].NMIMerchantId;
                    litem.ProcessorId = $scope.defaultbranch[0].ProcessorId;
                    litem.ProcessorName = $scope.defaultbranch[0].ProcessorName;
                    litem.TokenizationKey = $scope.defaultbranch[0].TokenizationKey || '';
                    litem.PublicCheckOutKey = $scope.defaultbranch[0].PublicCheckOutKey || '';
                    litem.BillingProviderId = $scope.defaultbranch[0].DefaultBillingProviderId;


                    var List1 = $filter("filter")($scope.BillingProviderList, function (Pitem,) { return Pitem.OrganizationBillingProviderId === litem.BillingProviderId; }) || [];
                    if (List1.length != 0) {
                        litem.BillingProviderId = List1[0].OrganizationBillingProviderId;
                        litem.BillingProviderName = List1[0].BillingProviderName;
                    }

                }
            }


            angular.forEach($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (pitem) {
                pitem.HospitalId = litem.HospitalId;
                pitem.OrganizationId = litem.OrganizationId;
                pitem.HospitalName = litem.HospitalName;
                pitem.HopitalObj = angular.copy(litem.HopitalObj);
                pitem.TokenizationKey = litem.TokenizationKey;
                pitem.PublicCheckOutKey = litem.PublicCheckOutKey;
                pitem.MerchentId = litem.MerchentId;             
                pitem.ProcessorId = litem.ProcessorId;           
                pitem.ProcessorName = litem.ProcessorName;       
            });
          
          
        };

        $scope.changeRenderingProvider = function (item, pitem) {
            pitem.RenderingProviderId = item.DoctorID;
            pitem.RenderingProviderName = item.UserFullName;
            pitem.UserBranchId = item.UserBranchId;
            pitem.RenderingProviderObj = item || '';
        };

        $scope.initActiveDepositRow = function () {
            if ($scope.mainNMIPaymentRequestObj.PatientDepositLineItem.length > 0) {
                $scope.setActiveDepositRow(0);
                $scope.ISShowCardPaymentDetails = false; // no mode selected yet
            }
        };

        $scope.setActiveDepositRow = function (index) {
            angular.forEach($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (item, i) {
                item.IsActive = (i === index);
            });

            $scope.DepositIndex = index;

            var activeItem = $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[index];
            if (!activeItem) return;

          
            var needsSidePanel = !activeItem.IsDepositLineItemDisabled
                && (activeItem.PaymentModeId === 2
                    || activeItem.PaymentModeId === 3
                    || activeItem.PaymentModeId === 5
                    || activeItem.PaymentModeId === 7
                    || activeItem.PaymentModeId === 16);

            $scope.ISShowCardPaymentDetails = needsSidePanel;
 
            $scope.ActiveDepositItem = activeItem;



        };

        $scope.getPatientDepositPaymentreqObj = function () {

            var UITransactionStatus = "Ready"; //If Transaction is ready to submit. 
            //"Processing"//If Transaction is processing.
            //"Success" //If Transaction is Success.
            //"Failure" //If Transaction is Failure.

            var obj = {
                "UserId": $scope.MainParentobj.UserId,
                "HospitalId": 0,
                "PatientId": $scope.MainParentobj.PatientId,
                "PatientFullName": "",
                "PatientFirstName": $scope.MainParentobj.PatientFirstName,
                "PatientLastName": $scope.MainParentobj.PatientLastName,
                "PatientEmailId": $scope.MainParentobj.PatientEmailId,
                "PatientMrno": $scope.MainParentobj.PatientDisplayId,
                "PatientGender": $scope.MainParentobj.PatientGender,
                "PatientAgeInYears": $scope.MainParentobj.PatientAgeInYears,
                "PatientAgeInMonths": $scope.MainParentobj.PatientAgeInMonths,
                "PatientDOB": $scope.MainParentobj.PatientDOB,
                "PatientMobileNumber": $scope.MainParentobj.PatientMobileNumber,
                "NMITransactionId": 0,
                "PaymentAmount": $scope.MainParentobj.PaymentAmount || 0,
                "PaymentDate": $filter("date")(new Date(), "MM-dd-yyyy"),
                "AppointmentId": $scope.MainParentobj.AppointmentId || 0,
                "VisitId": $scope.MainParentobj.VisitId || 0,
                "MerchentId": 0,
                "MerchentName": "",
                "MerchentKey": "",
                "PaymentToken": "",
                "HospitalName": "",
                "HospitalObj": "",
                "RenderingProviderId": $scope.RenderingProviderID,
                "RenderingProviderName": "",
                "RenderingProviderObj": {
                    // "SecondUserFullName": $scope.RenderingProviderName || ""
                    "SecondUserFullName": ""
                },
                "RecievedUserId": 0,
                "RecievedUserName": "",
                "RecievedUserObj": {
                    "SecondUserFullName": ""
                },
                "PaymentTypeId": $scope.MainParentobj.PaymentTypeId || "",
                "PaymentType": $scope.MainParentobj.PaymentType || "",
                "ShowPaymentNote": false,
                "PaymentNote": "",
                "PaymentModeId": $scope.MainParentobj.PaymentModeId || 1,
                "PaymentMode": $scope.MainParentobj.PaymentMode || "Cash",
                "PaymentProcessTypeId": 0,
                "PaymentProcessType": "",
                "TransactionTypeId": 1,
                "TransactionType": "sale",
                "TransactionId": "",
                "UITransactionStatus": UITransactionStatus,
                "StatusId": 0,
                "Status": "",
                "ResponseId": 0,
                "ResponseCode": "",
                "ResponseText": "",
                "DeleteInd": "N",
                "CardTypeId": "",
                "CardType": "",
                "CardHolderName": "",
                "ChequeNumber": "",
                "CardNumber": "",
                "CardExpiry": "",
                "Cvv": "",
                "ZipCode": "",
                "ACHAccountName": "",
                "ACHABANumber": "",
                "ACHAccountNumber": "",
                "PoiDeviceId": "",
                "CardBillingAddress1": "",
                "CardBillingAddress2": "",
                "CardBillingState": "",
                "CardBillingCity": "",
                "CardBillingZip": "",
                "PatientDepositPaymodeListId": 0,
                "PatientDepositId": 0,
                "TransactionReceiptNo": "",
                "DepositTransactionDate": "",
                "DepositTransactionTime": "",
                "ProcessorId": "",
                "ProcessorName": "",
                "TokenizationKey": "",
                "PublicCheckOutKey": "",
                "OrganizationTransactionId": $scope.HospitalId,
                "OrganizationTransactionName": "",
                "BillingProviderId": "",
                "TransactionDate": "",
                "TransactionTime": "",
                "DepositTypeId": 0,
                "DepositTypeName": "",
                "PatientDepositLineItem": [],
                "IsDepositPrint": false,
                "ReferenceNumber": "",
                "PatientDepositPaymodeList": [],
            }
            return obj;
        };

        $scope.isDepositToday = function (DepositDate) {
            var DepositDateStr = $filter('date')(DepositDate, "MM-dd-yyyy");
            var todayStr = $filter('date')(new Date(), "MM-dd-yyyy");
            return DepositDateStr === todayStr;
        };
        $scope.checkstatusCollectAndSaveButton = function () {


            var lineItems = $scope.mainNMIPaymentRequestObj.PatientDepositLineItem || [];


            var pendingRows = lineItems.filter(function (item) {
                return !item.IsDepositLineItemDisabled;
            });


            $scope.IsShowCollectpaymentbutton = pendingRows.length > 0;


            //var hasUncollectedCardRow = pendingRows.some(function (item) {
            //    var isCardMode = item.PaymentModeId === 2
            //        || item.PaymentModeId === 3
            //        || item.PaymentModeId === 7;
            //    var notYetCollected = !item.Status || item.Status === '';
            //    return isCardMode && notYetCollected;
            //});

            var hasUncollectedNMICardRow = pendingRows.some(function (item) {
                var isCardMode = item.PaymentModeId === 2
                    || item.PaymentModeId === 3
                    || item.PaymentModeId === 7
                    || item.PaymentModeId === 16;
                var isNMIGateway = item.PaymentProcessTypeId !== 4; // 4 = without gateway
                var notYetCollected = !item.Status || item.Status === '';
                return isCardMode && isNMIGateway && notYetCollected;
            });

            $scope.IsShowpaymentbutton = hasUncollectedNMICardRow;
        };

        var FEE_APPLICABLE_PAYMENT_MODES = [2, 3, 7,16];

 
        $scope.ShouldShowFeeRow = function (item) {
            if (!item) return false;
            if (!$scope.IsConvenienceFeeEnabledForPaymentGateway) return false;
            if (!item.PaymentModeId) return false;
            if (FEE_APPLICABLE_PAYMENT_MODES.indexOf(item.PaymentModeId) === -1) return false;

            var feeConfig = $scope.ConvenienceFeeMap[item.PaymentModeId];
            if (!feeConfig || !feeConfig.IsActive || !feeConfig.IsConvenienceFeeEnabled) return false;

            return parseFloat(item.DepositAmount || 0) > 0;
        };

      
        $scope.ShouldShowPaymentBreakdown = function () {
            return $scope.ActiveDepositItem
                && $scope.ShouldShowFeeRow($scope.ActiveDepositItem);
        };

      
        $scope.GetFeeDisplayText = function (item) {
            if (!item) return '';
            var feeConfig = $scope.ConvenienceFeeMap[item.PaymentModeId];
            if (!feeConfig) return '';

            if (feeConfig.ConvenienceFeeTypeId === 2) {
                return feeConfig.ConvenienceFeeValue + '%';
            }
            return '$' + parseFloat(feeConfig.ConvenienceFeeValue).toFixed(2) + ' flat';
        };

       
        $scope.CalculateLineFee = function (item) {
            if (!item) return;

            var original = parseFloat(item.DepositAmount || 0);

            item.OriginalAmount = original;
            item.ConvenienceFeeAmount = 0;
            item.FinalChargedAmount = original;
            item.ConvenienceFeeTypeId = 0;
            item.ConvenienceFeeType = "";

            if (!$scope.IsConvenienceFeeEnabledForPaymentGateway) {
                $scope.RecalculateTotals();
                return;
            }

            if (FEE_APPLICABLE_PAYMENT_MODES.indexOf(item.PaymentModeId) === -1) {
                $scope.RecalculateTotals();
                return;
            }

            var feeConfig = $scope.ConvenienceFeeMap[item.PaymentModeId];
            if (!feeConfig || !feeConfig.IsActive || !feeConfig.IsConvenienceFeeEnabled) {
                $scope.RecalculateTotals();
                return;
            }

            var feeValue = parseFloat(feeConfig.ConvenienceFeeValue) || 0;
            var minFee = parseFloat(feeConfig.MinimumConvenienceFeeAmount) || 0;
            var maxFee = parseFloat(feeConfig.MaximumConvenienceFeeAmount) || 0;

            if (feeConfig.ConvenienceFeeTypeId === 2) {
                // ── Percentage — apply Min/Max caps ──
                item.ConvenienceFeeAmount = (original * feeValue) / 100;

                if (minFee > 0 && original > 0 && item.ConvenienceFeeAmount < minFee) {
                    item.ConvenienceFeeAmount = minFee;
                }
                if (maxFee > 0 && item.ConvenienceFeeAmount > maxFee) {
                    item.ConvenienceFeeAmount = maxFee;
                }
            } else if (feeConfig.ConvenienceFeeTypeId === 1) {
                // ── Fixed — use as-is ──
                item.ConvenienceFeeAmount = original > 0 ? feeValue : 0;
            }

           
            item.ConvenienceFeeAmount = $scope.roundHalfUp(item.ConvenienceFeeAmount);
            item.FinalChargedAmount = $scope.roundHalfUp(original + item.ConvenienceFeeAmount);

            item.ConvenienceFeeTypeId = feeConfig.ConvenienceFeeTypeId;
            item.ConvenienceFeeType = feeConfig.ConvenienceFeeType || "";

            $scope.RecalculateTotals();
        };

        $scope.roundHalfUp = function (value) {
            if (value === null || value === undefined || isNaN(value)) return 0;

            var num = parseFloat(value);
           
            return Math.round((num + Number.EPSILON) * 100) / 100;
        };

        
        $scope.RecalculateAllLineFees = function () {
            if (!$scope.mainNMIPaymentRequestObj || !$scope.mainNMIPaymentRequestObj.PatientDepositLineItem) {
                return;
            }
            angular.forEach($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (item) {
                $scope.CalculateLineFee(item);
            });
        };

       
        $scope.RecalculateTotals = function () {
            var subtotal = 0, fee = 0, total = 0,depositTotal=0;

            angular.forEach($scope.mainNMIPaymentRequestObj.PatientDepositLineItem || [], function (item) {
               
                if (item.DeleteInd === 'N' || !item.DeleteInd) {
                    subtotal += parseFloat(item.OriginalAmount || item.DepositAmount || 0);
                    fee += parseFloat(item.ConvenienceFeeAmount || 0);
                    total += parseFloat(item.FinalChargedAmount || item.DepositAmount || 0);
                    depositTotal += parseFloat(item.DepositAmount||0);
                }
            });
            $scope.TotalDepositAmount = depositTotal;
            $scope.TotalSubtotalAmount = parseFloat(subtotal.toFixed(2));
            $scope.TotalConvenienceFee = parseFloat(fee.toFixed(2));
            $scope.TotalFinalAmount = parseFloat(total.toFixed(2));
        };



        $scope.LoadConvenienceFeeSettingsIfEnabled = function (hospitalId) {

            var obj = {
                OrganizationId: hospitalId,
                BillingProviderId: null,
                PaymentMethodId: null,
                OnlyActive: true
            };

            eHnotePatientDataService.GetOrganizationConvenienceFeeSettings(obj).then(function (resp) {

                var res = resp.data || {};

                if (res.Status === "Success") {
                    $scope.IsConvenienceFeeEnabledForPaymentGateway = !!res.IsConvenienceFeeEnabledForPaymentGateway;
                    $scope.ConvenienceFeeSettings = res.ConvenienceFeeSettings || [];


                    $scope.ConvenienceFeeMap = {};
                    angular.forEach($scope.ConvenienceFeeSettings, function (row) {
                        if (row.IsActive && row.PaymentMethodId) {
                            $scope.ConvenienceFeeMap[row.PaymentMethodId] = row;
                        }
                    });

                    console.log("Convenience fee config loaded:", $scope.ConvenienceFeeMap);
                    // Recalculate any existing items in case fee config changed
                    $scope.RecalculateAllLineFees();
                } else {
                    console.warn("Failed to load convenience fee settings:", res.Message);
                    $scope.IsConvenienceFeeEnabledForPaymentGateway = false;
                }
            }, function (err) {
                console.error("Convenience fee API error:", err);
                $scope.IsConvenienceFeeEnabledForPaymentGateway = false;
            });
        };

        $scope.TotalDepositAmount = 0;
        $scope.patientDepositAmnt = 0;
        $scope.TotalPOSPaymentAmount = 0;
        $scope.TotalPOSPatientPaymentAmt = 0;
        $scope.init = function () {


            $scope.IsEditLineItemMode = false;
            $scope.EditingLineItem = null;
            $scope.EditingLineItemIndex = null;


            var NewBranchList = localStorageFactory.getItem("allBranchesData") || [];
            var clinicAddress = eHnoteUserAppointmentDataService.RestructureNewBranches($scope.UserAccessRights.AllAccessRights.APPListAllBranchesAppointments, NewBranchList, doctorinfo) || [];

            console.log(clinicAddress);

            $scope.AllLocations = clinicAddress;

            $scope.LocationFilterDta = angular.copy($scope.AllLocations) || [];
            $scope.mainNMIPaymentRequestObj = getemptyPaymentreqObj();
            $scope.SaveDepositPaymentReqObj = angular.copy($scope.getPatientDepositPaymentreqObj());

            $scope.mainNMIPaymentRequestObj.PatientDepositLineItem.push($scope.GetPatientDepositsObj());





            if ($scope.MainParentobj.PaymentTypeId == 3) {
                var creditObj = angular.copy($scope.GetPOSAddanotherpayment());
                creditObj.PaymentMethodId = 1;
                creditObj.PaymentMethod = "Cash";
                creditObj.PaymentAmount = $scope.MainParentobj.PaymentAmount;

                $scope.mainNMIPaymentRequestObj.POSMultiPaymentsArray.push(creditObj);

                $scope.TotalAmount = $scope.MainParentobj.PaymentAmount;
                $scope.TotalPOSPaymentAmount = $scope.MainParentobj.PaymentAmount;
                $scope.TotalPOSPaymentAmtusingDeposit = $scope.MainParentobj.PaymentAmount;


                if ($scope.PatientPaymentObj.PatientDepositPaymodeList.length > 0) {
                    $scope.TotalPOSPaymentAmtusingDeposit = parseFloat($scope.TotalPOSPaymentAmtusingDeposit) || 0;
                    angular.forEach($scope.PatientPaymentObj.PatientDepositPaymodeList, function (pitem) {
                        pitem.PaymentAmount = pitem.DepositAmount || 0;
                        pitem.PaymentMethod = pitem.PaymentMethodName || 0;
                        $scope.TotalPOSPaymentAmtusingDeposit += pitem.PaymentAmount;
                    });
                }
            }

            //$scope.filteredPaymentModesForSecond = $scope.filteredPaymentModes.filter(function (x) {
            //    return x.PaymentModeId == 2 || x.PaymentModeId == 3;
            //});

            $scope.filteredPaymentModesForPOS = $scope.filteredPaymentModes.filter(function (x) {
                return x.PaymentModeId == 1 || x.PaymentModeId == 2 || x.PaymentModeId == 3;
            });

            //$scope.mainNMIPaymentRequestObj.POSMultiPaymentsArray.push($scope.GetPOSAddanotherpayment());

            if ($scope.MainParentobj.Notes != "") {
                $scope.mainNMIPaymentRequestObj.PaymentNote = $scope.MainParentobj.Notes;
                $scope.mainNMIPaymentRequestObj.ShowPaymentNote = true;
            }

            if ($scope.MainParentobj.RenderingProviderObj != {} || $scope.MainParentobj.RenderingProviderObj != undefined) {
                $scope.mainNMIPaymentRequestObj.RenderingProviderObj = $scope.MainParentobj.RenderingProviderObj;
            }

            console.log($scope.HospitalId + "__HospitalId");
            if ($scope.HospitalId != null) {
             
               
                var filtredArray = $filter("filter")($scope.AllLocations, { "BranchId": $scope.HospitalId }, true) || [];

                //$scope.LocationFilterDta = $filter("filter")($scope.AllLocations, function (item) {
                //    if ($scope.HospitalId === 5 && $scope.ParenthospitalId == 3) {
                //        return item.BranchId === 5;
                //    } else if (($scope.HospitalId === 3 || $scope.HospitalId === 4) && $scope.ParenthospitalId == 3) {
                //        return item.BranchId === 3 || item.BranchId === 4;
                //    }
                //    else {
                //        return true;
                //    }

                //}) || [];

                //if ($scope.LocationFilterDta.length == 1) {
                //    $scope.ChangePaymentLocation($scope.LocationFilterDta[0].ClinicId);
                //}
                console.log($scope.HospitalId + "__filtredArray");
               
                $scope.ChangePaymentLocation($scope.HospitalId);

                if (filtredArray.length > 0) {
                    $scope.mainNMIPaymentRequestObj.OrganizationTransactionId = filtredArray[0].ClinicId;
                    $scope.mainNMIPaymentRequestObj.OrganizationTransactionName = filtredArray[0].ClinicName;
                }
            }

            var defaultHospitalId = $scope.HospitalId;
            if ($scope.MainParentobj.HospitalId !== 0) {
                defaultHospitalId = $scope.MainParentobj.HospitalId
            }
            $scope.defaultbranch = $filter("filter")($scope.AllLocations, function (item) {
                return item.BranchId === defaultHospitalId;
            });
            $scope.defaultbranch = $scope.defaultbranch || [];

            var params = {
                "BranchId": defaultHospitalId,
            }
            let params1 = {
                "OrganizationId": $scope.HospitalId || 0,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "FacilityCode": "",
                "PageNumber": 1,
                "PageSize": 200
            }

            var obj = {
                "DepositFrom": "",
                "DepositTo": "",
                "PatientId": $scope.MainParentobj.PatientId,
                "OrganizationId": $scope.HospitalId,
                "PaymentModeId": 0,
                "PageSize": 1,
                "PageNumber": 50,
                "TransactionNumber": "",
                "SortBy": "Asc",
                "SearchType": "Deposit"
            };

            $q.all([
                eHnoteMainAppointmentService.getAllUsersByDepartmentIdNew(params),
                eHnoteSettingsDataService.GetOrganizationBillingProviders(params1),
                eHnoteInsuranceService.GetAllPatientDeposits(obj),
            ]).then(function (resp) {
                if (resp[0].data.rows.length > 0) {
                    /*$scope.restructureUsersList(resp[0].data.rows, 'PageLoad');*/

                    var loadType = "PageLoad";
                    $scope.allUserList = resp[0].data.rows || [];
                    $scope.AllCounsollerList = angular.copy($scope.allUserList);
                    $scope.AllDilationList = angular.copy($scope.allUserList);
                    $scope.AllTechnicianList = angular.copy($scope.allUserList);
                    $scope.AllOpthaList = angular.copy($scope.allUserList);
                    $scope.AllOptometristList = angular.copy($scope.allUserList);
                    $scope.AllDoctorList = angular.copy($scope.allUserList);
                    $scope.AllPlayDoctorList = angular.copy($scope.allUserList);
                    $scope.AllARList = angular.copy($scope.allUserList);
                    $scope.AllBillingList = angular.copy($scope.allUserList);
                    $scope.AllPlayBillingList = angular.copy($scope.allUserList);
                    $scope.AllReceptionList = angular.copy($scope.allUserList);

                    $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
                    $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                        return item.RoleId === 1 || item.RoleId === 3 || item.RoleId === 4 || item.RoleId === 43 || item.RoleId === 16 || item.RoleId === 56 || item.RoleId === 57;
                    });

                    var DoctorObj = $filter("filter")($scope.allUserList, function (item, index) { return item.DoctorID == $scope.UserId })[0];
                    if (DoctorObj != undefined || DoctorObj != null) {
                        $scope.DoctorObj = DoctorObj;
                        $scope.mainNMIPaymentRequestObj.RecievedUserId = $scope.DoctorObj.DoctorID;
                        $scope.mainNMIPaymentRequestObj.RecievedUserName = $scope.DoctorObj.UserFullName;
                        $scope.mainNMIPaymentRequestObj.RecievedUserObj = $scope.DoctorObj || '';
                    }


                    $scope.AllPlayDoctorList = _.uniq($scope.AllPlayDoctorList, false, function (p) { return p.DoctorID; });
                    $scope.AllPlayDoctorList = $filter("filter")($scope.AllPlayDoctorList, function (item) {
                        return (item.RoleId === 1 && item.SuffixId !== 13) || (item.RoleId === 43 && item.SuffixId !== 13);
                    });
                    $scope.AllOpthaList = _.uniq($scope.AllOpthaList, false, function (p) { return p.DoctorID; });
                    $scope.AllOpthaList = $filter("filter")($scope.AllOpthaList, function (item) {
                        return item.RoleId === 10;
                    });

                    $scope.AllOptometristList = _.uniq($scope.AllOptometristList, false, function (p) { return p.DoctorID; });
                    $scope.AllOptometristList = $filter("filter")($scope.AllOptometristList, function (item) {
                        return (item.RoleId === 1 && item.SuffixId === 13) || (item.RoleId === 43 && item.SuffixId === 13) || item.RoleId === 16;
                    });

                    $scope.AllCounsollerList = _.uniq($scope.AllCounsollerList, false, function (p) { return p.DoctorID; });
                    $scope.AllCounsollerList = $filter("filter")($scope.AllCounsollerList, function (item) {
                        return item.RoleId === 18;
                    });
                    $scope.AllDilationList = _.uniq($scope.AllDilationList, false, function (p) { return p.DoctorID; });
                    $scope.AllDilationList = $filter("filter")($scope.AllDilationList, function (item) {
                        return item.RoleId === 54 || item.RoleId === 2 || item.RoleId === 10;
                    });
                    $scope.AllTechnicianList = _.uniq($scope.AllTechnicianList, false, function (p) { return p.DoctorID; });
                    $scope.AllTechnicianList = $filter("filter")($scope.AllTechnicianList, function (item) {
                        return item.RoleId === 10 || item.RoleId === 38 || item.RoleId === 55;
                    });
                    $scope.AllARList = _.uniq($scope.AllARList, false, function (p) { return p.DoctorID; });
                    $scope.AllARList = $filter("filter")($scope.AllARList, function (item) {
                        return item.RoleId === 61;
                    });
                    $scope.AllBillingList = _.uniq($scope.AllBillingList, false, function (p) { return p.DoctorID; });
                    $scope.AllBillingList = $filter("filter")($scope.AllBillingList, function (item) {
                        return item.RoleId === 2 || item.RoleId === 19;
                    });
                    $scope.AllPlayBillingList = _.uniq($scope.AllPlayBillingList, false, function (p) { return p.DoctorID; });
                    $scope.AllPlayBillingList = $filter("filter")($scope.AllPlayBillingList, function (item) {
                        return item.RoleId === 2 || item.RoleId === 19 || item.RoleId === 64 || item.RoleId === 65 || item.RoleId === 71;
                    });

                    $scope.AllReceptionList = _.uniq($scope.AllReceptionList, false, function (p) { return p.DoctorID; });
                    $scope.AllReceptionList = $filter("filter")($scope.AllReceptionList, function (item) {
                        return item.RoleId === 2;
                    });

                    if ($scope.MainParentobj.ClaimDataObj != null && Object.keys($scope.MainParentobj.ClaimDataObj).length > 0) {
                        var filtredRenderArray = $filter("filter")($scope.AllDoctorList, { "DoctorID": $scope.MainParentobj.ClaimDataObj.RenderingProviderId }, true) || [];
                        if (filtredRenderArray.length > 0) {
                            $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[0].RenderingProviderId = filtredRenderArray[0].DoctorID;
                            $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[0].RenderingProviderName = filtredRenderArray[0].UserFullName;
                            $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[0].UserBranchId = filtredRenderArray[0].UserBranchId;
                            $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[0].RenderingProviderObj = filtredRenderArray[0] || '';
                        }
                    }
                    else {
                        var DoctorObj = $filter("filter")($scope.allUserList, function (item, index) { return item.DoctorID == $scope.UserId })[0];
                        if (DoctorObj != undefined || DoctorObj != null) {
                            $scope.DoctorObj = DoctorObj;
                            $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[0].RenderingProviderId = $scope.DoctorObj.DoctorID;
                            //$scope.mainNMIPaymentRequestObj.RecievedUserName = $scope.DoctorObj.FullName;
                            $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[0].RenderingProviderName = $scope.DoctorObj.UserFullName;
                            $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[0].RenderingProviderObj = $scope.DoctorObj || '';
                        }
                    }

                    if ($scope.MainParentobj.DepositscreenTypeId == 1) {
                        var renderingObj = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.MainParentobj.RenderingProviderId })[0];
                        if (renderingObj != undefined || renderingObj != null) {
                            $scope.mainNMIPaymentRequestObj.RenderingProviderId = renderingObj.DoctorID;
                            $scope.mainNMIPaymentRequestObj.RenderingProviderName = renderingObj.UserFullName;
                            $scope.mainNMIPaymentRequestObj.UserBranchId = renderingObj.UserBranchId;
                            $scope.mainNMIPaymentRequestObj.RenderingProviderObj = renderingObj || '';
                        }
                        $scope.mainNMIPaymentRequestObj.DepositTypeId = $scope.MainParentobj.DepositTypeId || 0;
                    }

                }
                if (resp[1].data.rows.length > 0) {
                    $scope.BillingProviderList = angular.copy(resp[1].data.rows);

                    console.log($scope.BillingProviderList);
                }
                if (resp[2].data.rows.length > 0) {
                    $scope.PatientDepositsListArray = resp[2].data.rows || [];
                }


                if ($scope.MainParentobj.EditOverAllBool === true
                    && $scope.MainParentobj.PatientDepositPaymodeList
                    && $scope.MainParentobj.PatientDepositPaymodeList.length > 0) {

                    // Clear the default empty line item added by init
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem = [];

                    angular.forEach($scope.MainParentobj.PatientDepositPaymodeList, function (pitem) {

                        var depositLineItem = $scope.GetPatientDepositsObj();

                        // Fill from existing paymode entry
                        depositLineItem.DepositAmount = pitem.DepositAmount || 0;
                        depositLineItem.PaymentModeId = pitem.PaymentMethodId || 0;
                        depositLineItem.PaymentMode = pitem.PaymentMethodName || "";
                        depositLineItem.PaymentMethodId = pitem.PaymentMethodId || 0;
                        depositLineItem.PaymentMethodName = pitem.PaymentMethodName || "";
                        depositLineItem.CardNumber = pitem.CardNumber || "";
                        depositLineItem.CardType = pitem.CardType || "";
                        depositLineItem.CardTypeId = pitem.CardtypeId || 0;
                        depositLineItem.ChequeNumber = pitem.ChequeNumber || "";
                        depositLineItem.OnlineTransactionNumber = pitem.OnlineTransactionNumber || "";
                        depositLineItem.NMITransactionId = pitem.NMITransactionId || 0;
                        depositLineItem.PaymentProcessTypeId = pitem.PaymentProcessTypeId || 0;
                        depositLineItem.PaymentProcessType = pitem.PaymentProcessType || "";
                        depositLineItem.ReferenceNumber = pitem.ReferenceNumber || "";
                        depositLineItem.TransactionId = pitem.ReferenceNumber || "";

                        // Deposit header fields from Parentobj
                        depositLineItem.PatientDepositId = $scope.MainParentobj.PatientDepositId || 0;

                        console.log(pitem.PatientDepositPaymodeListId + "__PatientDepositPaymodeListId");
                        depositLineItem.PatientDepositPaymodeListId = pitem.PatientDepositPaymodeListId || 0;
                        depositLineItem.HospitalId = $scope.MainParentobj.HospitalId || 0;
                        depositLineItem.BillingProviderId = $scope.MainParentobj.BillingProviderId || 0;
                        depositLineItem.DepositTypeId = $scope.MainParentobj.DepositTypeId || 3;
                        depositLineItem.DepositTypeName = $scope.MainParentobj.DepositType || "General";
                        depositLineItem.Notes = $scope.MainParentobj.Notes || "";
                        depositLineItem.RenderingProviderId = $scope.MainParentobj.RenderingProviderId || 0;
                        depositLineItem.TransactionDate = pitem.TransactionDate;
                        depositLineItem.TransactionTime = pitem.TransactionTime;

                        $scope.DepositOrganization = $filter("filter")($scope.AllLocations, function (item) {
                            return item.BranchId === pitem.OrganizationId;
                        });
                        $scope.DepositOrganization = $scope.DepositOrganization || [];
                        if ($scope.DepositOrganization.length > 0) {
                            console.log($scope.DepositOrganization[0])
                            depositLineItem.HospitalName = $scope.DepositOrganization[0].ClinicName;
                        }

                        console.log(pitem.DepositTransactionReciptNo + "__DepositTransactionReciptNo");
                        console.log($scope.MainParentobj.ReceiptNo + "__ReceiptNo");

                        depositLineItem.TransactionReceiptNo = pitem.PaymodeReceiptNo;
                        depositLineItem.ReceiptNo = $scope.MainParentobj.ReceiptNo;
                        depositLineItem.OrganizationId = pitem.OrganizationId;
                        var renderingObjArray = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.MainParentobj.RenderingProviderId });

                        console.log(renderingObjArray);

                        console.log("rendering obj");
                        if (renderingObjArray.length > 0) {
                            depositLineItem.RenderingProviderName = renderingObjArray[0].RenderingProviderName || "";
                            depositLineItem.RenderingProviderObj = renderingObjArray[0] || {};
                        }




                        // Mark as already saved — disable editing of saved rows
                        depositLineItem.IsDepositLineItemDisabled = true;
                        depositLineItem.Status = 'Success';
                        depositLineItem.IsEditDepositNotes = true;


                        depositLineItem.DepositTypeId = pitem.DepositTypeId || 0;

                        depositLineItem.ACHABANumber = pitem.ACHABANumber || "";
                        depositLineItem.ACHAccountNumber = pitem.ACHAccountNumber || "";

                        var List1 = $filter("filter")($scope.DepositTypes, function (Pitem,) { return Pitem.DepositTypeId === depositLineItem.DepositTypeId; }) || [];
                        if (List1.length != 0) {
                            depositLineItem.DepositTypeName = List1[0].DepositTypeName || "";
                        }
                        depositLineItem.Notes = pitem.Notes || "";

                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem.push(depositLineItem);
                    });



                    // Recalculate total
                    $scope.TotalDepositAmount = 0;
                    angular.forEach($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (li) {
                        $scope.TotalDepositAmount += parseFloat(li.DepositAmount) || 0;
                    });
                    $scope.TotalDepositAmount = parseFloat($scope.TotalDepositAmount.toFixed(2));
                    $scope.patientDepositAmnt = $scope.TotalDepositAmount;

                    // No pending rows — show "Save Payment" button (just close)
                    $scope.IsShowCollectpaymentbutton = false;
                    $scope.ISShowCardPaymentDetails = false;

                    //$scope.initActiveDepositRow();
                    $scope.checkstatusCollectAndSaveButton();

                    $timeout(function () {

                        var list = $scope.mainNMIPaymentRequestObj.PatientDepositLineItem;

                        var cashIndex = list.findIndex(function (item) {
                            return item.PaymentMethodId === 1;
                        });

                        if (cashIndex !== -1) {
                            var cashObj = list[cashIndex];
                            $scope.EditDepositLineItem(cashObj, cashIndex);
                        }
                    }, 200);
                } else {
                    $scope.initActiveDepositRow();
                }

                $timeout(function () {

                    if ($scope.MainParentobj.EditOverAllBool !== true
                        && $scope.MainParentobj.IsShowDepsoitNewScreen !== false) {

                        var preAmount = parseFloat($scope.MainParentobj.PaymentAmount) || 0;

                        if (preAmount > 0
                            && $scope.mainNMIPaymentRequestObj.PatientDepositLineItem.length === 1
                            && !$scope.mainNMIPaymentRequestObj.PatientDepositLineItem[0].DepositAmount) {

                            var defaultItem = $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[0];
                            defaultItem.DepositAmount = preAmount;

                            if ($scope.MainParentobj.HospitalId) {
                                defaultItem.HospitalId = $scope.MainParentobj.HospitalId;
                                $scope.ChangeDepositPaymentLocation(defaultItem.HospitalId, defaultItem);
                            }
                            if ($scope.MainParentobj.BillingProviderId) {
                                defaultItem.BillingProviderId = $scope.MainParentobj.BillingProviderId;
                            }
                            if ($scope.MainParentobj.DepositTypeId) {
                                defaultItem.DepositTypeId = $scope.MainParentobj.DepositTypeId;
                                defaultItem.DepositTypeName = $scope.MainParentobj.DepositType || "";
                            }
                            if ($scope.MainParentobj.RenderingProviderId) {
                                defaultItem.RenderingProviderId = $scope.MainParentobj.RenderingProviderId;
                            }

                            $scope.TotalDepositAmount = preAmount;
                            $scope.patientDepositAmnt = preAmount;
                        }

                        //$scope.checkstatusCollectAndSaveButton();
                        $scope.IsShowCollectpaymentbutton = true;
                    }
                }, 200);


                if ($scope.MainParentobj.PaymentTypeId == 2) {
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[0].DepositAmount = $scope.MainParentobj.PaymentAmount;
                    $scope.TotalDepositAmount = $scope.MainParentobj.PaymentAmount;
                    $scope.patientDepositAmnt = $scope.MainParentobj.PaymentAmount;
                }


                if ($scope.IsConvenienceFeeEnabledForPaymentGateway) {
                    $scope.LoadConvenienceFeeSettingsIfEnabled($scope.HospitalId);
                }
            }, function (err) {
                console.log(err);
                alertify.error("Getting Data Failed");
            });
            $scope.ShowPatientDetailsList($scope.MainParentobj.PatientId);
        }
        $scope.init();

        $scope.PrintData = null;
        $scope.uibclose = function () {

            //Commented Old Deposit Functionality
            //if ($scope.mainNMIPaymentRequestObj.UITransactionStatus == 'Success') {
            //    $uibModalInstance.close($scope.PrintData);
            //}
            //else {
            //    $uibModalInstance.close();
            //}

            if ($scope.MainParentobj.PaymentTypeId == 2) {

                if ($scope.PatientDepositPaymodeList.length > 0) {

                    $scope.PatientDepositPaymodeList = $scope.PatientDepositPaymodeList.filter(function (item) {
                        return item.PaymentTransactionTypeId != 7;
                    });
                    var obj = {
                        "PatientDepositLineItem": $scope.mainNMIPaymentRequestObj.PatientDepositLineItem,
                        "Status": 'Status',
                        "PatientDepositPaymodeList": $scope.PatientDepositPaymodeList,
                    }

                    $uibModalInstance.close(obj);
                }
                else {
                    $uibModalInstance.close();
                }
            } else {
                $uibModalInstance.close();
            }
            $scope.destroyNmiCollectScript();
        };

        $scope.uibPOSclose = function () {

            if ($scope.mainNMIPaymentRequestObj.ResponseId === 1) {
                $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Success';
            } else if ($scope.mainNMIPaymentRequestObj.ResponseId === 2) {
                $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Failure';
            } else {
                $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Failure';
            }

            if ($scope.mainNMIPaymentRequestObj.UITransactionStatus == 'Success' || $scope.mainNMIPaymentRequestObj.UITransactionStatus == 'Failure') {
                $uibModalInstance.close($scope.PrintData);
            }
            else {
                $uibModalInstance.close();
            }

        };
        $scope.savePayment = function () {
            $uibModalInstance.close("save");
        }

        $scope.changePaymentProvider = function (item) {
            $scope.mainNMIPaymentRequestObj.RenderingProviderId = item.DoctorID;
            $scope.mainNMIPaymentRequestObj.RenderingProviderName = item.UserFullName;
            $scope.mainNMIPaymentRequestObj.UserBranchId = item.UserBranchId;
            $scope.mainNMIPaymentRequestObj.RenderingProviderObj = item || '';
        };

        $scope.changePaymentReciever = function (item) {
            $scope.mainNMIPaymentRequestObj.RecievedUserId = item.DoctorID;
            $scope.mainNMIPaymentRequestObj.RecievedUserName = item.UserFullName;
            $scope.mainNMIPaymentRequestObj.RecievedUserObj = item || '';
        };

        $scope.navtoshowPaymentNote = function (value) {
            if (value) {
                $scope.mainNMIPaymentRequestObj.ShowPaymentNote = true;
                $scope.mainNMIPaymentRequestObj.PaymentNote = "";
            } else {
                $scope.mainNMIPaymentRequestObj.ShowPaymentNote = false;
                $scope.mainNMIPaymentRequestObj.PaymentNote = "";
            }
        };

        $scope.ChangeCardType = function (Id, pitem) {
            var filtredArray = $filter("filter")($scope.AllCardTypes, { "CardtypeId": Id }, true) || [];
            $scope.mainNMIPaymentRequestObj.CardType = filtredArray[0].CardType || '';
            $scope.mainNMIPaymentRequestObj.CardTypeId = filtredArray[0].CardtypeId || 0;
            pitem.CardType = filtredArray[0].CardType || '';
            pitem.CardTypeId = filtredArray[0].CardtypeId || 0;
        };

        function getnewTransactionObj() {
            var obj = {
                NMITransactionId: 0,
                UserId: 0,
                PatientId: 0,
                OrganizationId: 0,
                PaymentAmount: 0,
                MerchentId: "",
                MerchentName: "",
                PaymentToken: "",
                CardHolderName: "",
                CardBillingAddress1: "",
                CardBillingAddress2: "",
                CardBillingState: "",
                CardBillingCity: "",
                CardBillingZip: "",
                PatientEmail: "",
                PatientMobile: "",
                PatientMrNo: "",
                OrderId: "",
                OrderDescription: "",
                TransactionId: 0,
                ResponseId: 0,
                ResponseCode: "",
                ResponseText: "",
                Status: "",
                TransactionTypeId: 0,
                TransactionType: "",
                DeleteInd: "N",
                Type: "",
                AppointmentId: 0,
                VisitId: 0,
                BillingProviderId: 0,
                PaymentModeId: 0,
                PaymentMode: "",
            };
            return obj;
        }

        $scope.coninueprocessinlineOnlinePayment = function (paymentToken, PaymentMethodObj) {

            var orderdescription = $scope.mainNMIPaymentRequestObj.PatientFirstName + " Payment" + $scope.mainNMIPaymentRequestObj.PaymentAmount + " for " + $scope.mainNMIPaymentRequestObj.PaymentType + " on " + $scope.mainNMIPaymentRequestObj.PaymentDate;

            $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());


            $scope.mainNMITransactionObj.NMITransactionId = 0;
            $scope.mainNMITransactionObj.UserId = $scope.mainNMIPaymentRequestObj.RecievedUserId;
            $scope.mainNMITransactionObj.PatientId = $scope.mainNMIPaymentRequestObj.PatientId;
            $scope.mainNMITransactionObj.OrganizationId = $scope.mainNMIPaymentRequestObj.HospitalId;
            $scope.mainNMITransactionObj.PaymentAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount;
            $scope.mainNMITransactionObj.MerchentId = $scope.mainNMIPaymentRequestObj.MerchentId;
            $scope.mainNMITransactionObj.MerchentName = $scope.mainNMIPaymentRequestObj.MerchentName;
            $scope.mainNMITransactionObj.PaymentToken = paymentToken;
            $scope.mainNMITransactionObj.CardHolderName = $scope.mainNMIPaymentRequestObj.CardHolderName || "";
            $scope.mainNMITransactionObj.PatientEmail = $scope.mainNMIPaymentRequestObj.PatientEmailId || "";
            $scope.mainNMITransactionObj.PatientMobile = $scope.mainNMIPaymentRequestObj.PatientMobileNumber || "";
            $scope.mainNMITransactionObj.PatientMrNo = $scope.mainNMIPaymentRequestObj.PatientMrNo || "";

            $scope.mainNMITransactionObj.CardBillingAddress1 = $scope.mainNMIPaymentRequestObj.CardBillingAddress1 || "";
            $scope.mainNMITransactionObj.CardBillingAddress2 = $scope.mainNMIPaymentRequestObj.CardBillingAddress2 || "";
            $scope.mainNMITransactionObj.CardBillingState = $scope.mainNMIPaymentRequestObj.CardBillingState || "";
            $scope.mainNMITransactionObj.CardBillingCity = $scope.mainNMIPaymentRequestObj.CardBillingCity || "";
            $scope.mainNMITransactionObj.CardBillingZip = $scope.mainNMIPaymentRequestObj.CardBillingZip || "";

            $scope.mainNMITransactionObj.ProcessorId = $scope.mainNMIPaymentRequestObj.ProcessorId || "";
            $scope.mainNMITransactionObj.ProcessorName = $scope.mainNMIPaymentRequestObj.ProcessorName || "";
            $scope.mainNMITransactionObj.TokenizationKey = $scope.mainNMIPaymentRequestObj.TokenizationKey || "";
            $scope.mainNMITransactionObj.PublicCheckOutKey = $scope.mainNMIPaymentRequestObj.PublicCheckOutKey || "";

            $scope.mainNMITransactionObj.OrderId = "";
            $scope.mainNMITransactionObj.OrderDescription = orderdescription;
            $scope.mainNMITransactionObj.TransactionId = 0;
            $scope.mainNMITransactionObj.ResponseId = 0;
            $scope.mainNMITransactionObj.ResponseCode = "";
            $scope.mainNMITransactionObj.ResponseText = "";
            $scope.mainNMITransactionObj.Status = "";
            $scope.mainNMITransactionObj.TransactionTypeId = $scope.mainNMIPaymentRequestObj.TransactionTypeId;
            $scope.mainNMITransactionObj.TransactionType = $scope.mainNMIPaymentRequestObj.TransactionType;
            $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
            $scope.mainNMITransactionObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
            $scope.mainNMITransactionObj.DeleteInd = "N";
            $scope.mainNMITransactionObj.Type = $scope.mainNMIPaymentRequestObj.TransactionType;
            $scope.mainNMITransactionObj.AppointmentId = $scope.mainNMIPaymentRequestObj.AppointmentId;
            $scope.mainNMITransactionObj.VisitId = $scope.mainNMIPaymentRequestObj.VisitId;
            $scope.mainNMITransactionObj.PaymentType = $scope.mainNMIPaymentRequestObj.PaymentModeId == 2 ? 'creditcard' :
                $scope.mainNMIPaymentRequestObj.PaymentModeId == 7 ? 'check' :
                    'creditcard';
            $scope.mainNMITransactionObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
            $scope.mainNMITransactionObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";

            $scope.mainNMITransactionObj.PaymentModeId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
            $scope.mainNMITransactionObj.PaymentMode = $scope.mainNMIPaymentRequestObj.PaymentMode;

            eHnotePaymentGatewayService.ProcessPayment($scope.mainNMITransactionObj).then(function (resp) {

                console.log(JSON.stringify(resp));
                var res = resp.data || {};
                $scope.mainNMITransactionObj.ResponseText = res.ResponseText;
                res.ResponseId = parseInt(res.ResponseId || 0);

                if (res.ResponseId === 1) {
                    alertify.success(res.ResponseText);
                    $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Success';
                    $scope.mainNMIPaymentRequestObj.NMITransactionId = res.NMITransactionId;
                    $scope.mainNMIPaymentRequestObj.TransactionId = res.TransactionId;
                } else if (res.ResponseId === 2) {
                    alertify.error(res.ResponseText);
                    $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Failure';
                } else {
                    alertify.error(res.ResponseText);
                    $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Failure';
                }


                if (+$scope.mainNMIPaymentRequestObj.PaymentTypeId === 1) {
                    $scope.mainNMIPaymentRequestObj.DepositStatusId = 1;
                    $scope.mainNMIPaymentRequestObj.DepositStatus = "Deposited";
                    $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId = 1;
                    $scope.mainNMIPaymentRequestObj.PaymentTransactionType = "Credit";

                    if (res.ResponseId === 1) {
                        alertify.success(res.ResponseText);
                        $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Success';
                        $scope.mainNMIPaymentRequestObj.NMITransactionId = res.NMITransactionId;
                        $scope.mainNMIPaymentRequestObj.TransactionId = res.TransactionId;
                        $scope.mainNMIPaymentRequestObj.Remarks = res.ResponseText || "";
                    } else {
                        alertify.error(res.ResponseText);
                        $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Failure';
                        $scope.mainNMIPaymentRequestObj.DepositStatusId = 6;
                        $scope.mainNMIPaymentRequestObj.DepositStatus = "Failed";
                        $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId = 7;
                        $scope.mainNMIPaymentRequestObj.PaymentTransactionType = "Failed";
                        $scope.mainNMIPaymentRequestObj.Remarks = res.ResponseText || "";
                    }

                    $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                    $scope.PaymentMethodObj.PaymentMethodId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
                    $scope.PaymentMethodObj.PaymentMethodName = $scope.mainNMIPaymentRequestObj.PaymentMode;
                    $scope.PaymentMethodObj.DepositAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount || 0;
                    $scope.PaymentMethodObj.ReferenceNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                    $scope.PaymentMethodObj.NMITransactionId = $scope.mainNMIPaymentRequestObj.NMITransactionId || 0;
                    $scope.PaymentMethodObj.OnlineTransactionNumber = $scope.mainNMIPaymentRequestObj.TransactionId || "";
                    $scope.PaymentMethodObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
                    $scope.PaymentMethodObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";
                    $scope.PaymentMethodObj.CardType = $scope.mainNMIPaymentRequestObj.CardType || "";
                    $scope.PaymentMethodObj.CardTypeId = $scope.mainNMIPaymentRequestObj.CardTypeId || "";
                    $scope.PaymentMethodObj.CardNumber = $scope.mainNMIPaymentRequestObj.CardNumber || "";
                    $scope.PaymentMethodObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
                    $scope.PaymentMethodObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
                    $scope.PaymentMethodObj.PaymentTransactionTypeId = $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId || 0;
                    $scope.PaymentMethodObj.PaymentTransactionType = $scope.mainNMIPaymentRequestObj.PaymentTransactionType || "";
                    $scope.PaymentMethodObj.Remarks = $scope.mainNMIPaymentRequestObj.Remarks || "";
                    $scope.navtoAddtheDeposits($scope.PaymentMethodObj, $scope.mainNMIPaymentRequestObj);
                }
                else if (+$scope.mainNMIPaymentRequestObj.PaymentTypeId === 2) {

                    $scope.mainNMIPaymentRequestObj.DepositStatusId = 1;
                    $scope.mainNMIPaymentRequestObj.DepositStatus = "Deposited";
                    $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId = 1;
                    $scope.mainNMIPaymentRequestObj.PaymentTransactionType = "Credit";
                    $scope.mainNMIPaymentRequestObj.Remarks = res.ResponseText || "";

                    if (res.ResponseId === 1) {
                        alertify.success(res.Status);
                        $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Success';
                        $scope.mainNMIPaymentRequestObj.NMITransactionId = res.NMITransactionId;
                        $scope.mainNMIPaymentRequestObj.TransactionId = res.TransactionId;
                    } else {
                        alertify.error(res.Status);
                        $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Failure';
                        $scope.mainNMIPaymentRequestObj.DepositStatusId = 6;
                        $scope.mainNMIPaymentRequestObj.DepositStatus = "Failed";
                        $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId = 7;
                        $scope.mainNMIPaymentRequestObj.PaymentTransactionType = "Failed";
                        $scope.mainNMIPaymentRequestObj.Remarks = res.ResponseText || "";
                    }

                    $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                    $scope.PaymentMethodObj.PaymentMethodId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
                    $scope.PaymentMethodObj.PaymentMethodName = $scope.mainNMIPaymentRequestObj.PaymentMode;
                    $scope.PaymentMethodObj.DepositAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount || 0;
                    $scope.PaymentMethodObj.ReferenceNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                    $scope.PaymentMethodObj.NMITransactionId = $scope.mainNMIPaymentRequestObj.NMITransactionId || 0;
                    $scope.PaymentMethodObj.OnlineTransactionNumber = $scope.mainNMIPaymentRequestObj.TransactionId || "";
                    $scope.PaymentMethodObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
                    $scope.PaymentMethodObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";
                    $scope.PaymentMethodObj.PatientDepositId = $scope.mainNMIPaymentRequestObj.PatientDepositId || 0;
                    $scope.PaymentMethodObj.CardType = $scope.mainNMIPaymentRequestObj.CardType || "";
                    $scope.PaymentMethodObj.CardTypeId = $scope.mainNMIPaymentRequestObj.CardTypeId || "";
                    $scope.PaymentMethodObj.CardNumber = $scope.mainNMIPaymentRequestObj.CardNumber || "";
                    $scope.PaymentMethodObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
                    $scope.PaymentMethodObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
                    $scope.PaymentMethodObj.PaymentTransactionTypeId = $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId || 0;
                    $scope.PaymentMethodObj.PaymentTransactionType = $scope.mainNMIPaymentRequestObj.PaymentTransactionType || "";
                    $scope.PaymentMethodObj.Remarks = $scope.mainNMIPaymentRequestObj.Remarks || "";
                    $scope.navtoAddtheDeposits($scope.PaymentMethodObj, $scope.mainNMIPaymentRequestObj);
                    /* $scope.navtoAddthePayments($scope.PaymentMethodObj, $scope.mainNMIPaymentRequestObj);*/
                    //$scope.navtoSavePayments($scope.PaymentMethodObj, $scope.mainNMIPaymentRequestObj);
                }
                else if (+$scope.mainNMIPaymentRequestObj.PaymentTypeId === 3) {

                    $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId = 2;
                    $scope.mainNMIPaymentRequestObj.PaymentTransactionType = "Debit";
                    $scope.mainNMIPaymentRequestObj.Remarks = res.ResponseText || "";

                    if (res.ResponseId === 1) {
                        alertify.success(res.Status);
                        $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Success';
                        $scope.mainNMIPaymentRequestObj.NMITransactionId = res.NMITransactionId;
                        $scope.mainNMIPaymentRequestObj.TransactionId = res.TransactionId;
                    } else {
                        alertify.error(res.Status);
                        $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Failure';
                        $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId = 7;
                        $scope.mainNMIPaymentRequestObj.PaymentTransactionType = "Failed";
                        $scope.mainNMIPaymentRequestObj.Remarks = res.ResponseText || "";
                    }


                    $scope.PaymentMethodObj = angular.copy($scope.GetPOSPaymentmethodItem());
                    $scope.PaymentMethodObj.PaymentMethodId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
                    $scope.PaymentMethodObj.PaymentMethodName = $scope.mainNMIPaymentRequestObj.PaymentMode;
                    $scope.PaymentMethodObj.DepositAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount || 0;
                    $scope.PaymentMethodObj.ReferenceNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                    $scope.PaymentMethodObj.NMITransactionId = $scope.mainNMIPaymentRequestObj.NMITransactionId || 0;
                    $scope.PaymentMethodObj.OnlineTransactionNumber = $scope.mainNMIPaymentRequestObj.TransactionId || "";
                    $scope.PaymentMethodObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
                    $scope.PaymentMethodObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";
                    $scope.PaymentMethodObj.CardType = $scope.mainNMIPaymentRequestObj.CardType || "";
                    $scope.PaymentMethodObj.CardTypeId = $scope.mainNMIPaymentRequestObj.CardTypeId || "";
                    $scope.PaymentMethodObj.CardNumber = $scope.mainNMIPaymentRequestObj.CardNumber || "";
                    $scope.PaymentMethodObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
                    $scope.PaymentMethodObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
                    $scope.PaymentMethodObj.PaymentTransactionTypeId = $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId || 0;
                    $scope.PaymentMethodObj.PaymentTransactionType = $scope.mainNMIPaymentRequestObj.PaymentTransactionType || "";
                    $scope.PaymentMethodObj.Remarks = $scope.mainNMIPaymentRequestObj.Remarks || "";

                    $scope.navtoAddthePOS($scope.mainNMIPaymentRequestObj, $scope.PaymentMethodObj);
                    //$scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                    //$scope.PaymentMethodObj.PaymentMethodId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
                    //$scope.PaymentMethodObj.PaymentMethodName = $scope.mainNMIPaymentRequestObj.PaymentMode;
                    //$scope.PaymentMethodObj.DepositAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount || 0;
                    //$scope.PaymentMethodObj.ReferenceNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                    //$scope.PaymentMethodObj.NMITransactionId = $scope.mainNMIPaymentRequestObj.NMITransactionId || 0;
                    //$scope.PaymentMethodObj.OnlineTransactionNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                    //$scope.PaymentMethodObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
                    //$scope.PaymentMethodObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";
                    //$scope.PaymentMethodObj.CardType = $scope.mainNMIPaymentRequestObj.CardType || "";
                    //$scope.PaymentMethodObj.CardTypeId = $scope.mainNMIPaymentRequestObj.CardTypeId || "";
                    //$scope.PaymentMethodObj.CardNumber = $scope.mainNMIPaymentRequestObj.CardNumber || "";
                    //$scope.PaymentMethodObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
                    //$scope.PaymentMethodObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
                    //$scope.navtoAddtheDeposits($scope.PaymentMethodObj, $scope.mainNMIPaymentRequestObj);
                }

                console.log(res);

            });

        };

        $scope.navtoOnlinePaymentGatewayPayment = function () {
            if (!window.CollectJS) {
                alert("Payment Gateway not loaded");
                return;
            }

            if ($scope.isPaymentInProgress) {
                alertify.error("Transaction already in progress. Please wait.");
                return;
            }

            var PaymentAmount = parseFloat($scope.mainNMIPaymentRequestObj.PaymentAmount) || 0;
            if (PaymentAmount == 0) {
                alertify.error("Please Enter Payment Amount");
                return false;
            }

            if ($scope.mainNMIPaymentRequestObj.HospitalId == 0) {
                alertify.error("Please select Office Location");
                return false;
            };
            $scope.mainNMIPaymentRequestObj.BillingProviderId = $scope.mainNMIPaymentRequestObj.BillingProviderId || 0;
            if ($scope.mainNMIPaymentRequestObj.BillingProviderId == 0) {
                alertify.error("Please select Billing Provider");
                return false;
            };
            var paymtDate = $scope.mainNMIPaymentRequestObj.PaymentDate || "";
            if (paymtDate == "") {
                alertify.error("Please select PaymentDate");
                return false;
            };

            console.log($scope.ccValitationobj);

            if ($scope.mainNMIPaymentRequestObj.PaymentModeId === 2) {
                if (!$scope.ccValitationobj.ccnumbervalid || !$scope.ccValitationobj.cccvv || !$scope.ccValitationobj.ccexpiry) {
                    alertify.error("Please Enter the required fields");
                    return false;
                }
            }
            if ($scope.mainNMIPaymentRequestObj.PaymentProcessTypeId == 3) {
                if ($scope.mainNMIPaymentRequestObj.CardBillingZip == "") {
                    alertify.error("Please select Zip Code");
                    return false;
                };
            }


            $scope.isPaymentInProgress = true;
            /* $("#maineHnoteLoader").show();*/
            CollectJS.startPaymentRequest(event);
        };

        $scope.initCollectJS = function () {



            if (window.CollectJS) {
                let fields = {};
                const paymenttype = "";
                if ($scope.mainNMIPaymentRequestObj.PaymentModeId === 2 || $scope.mainNMIPaymentRequestObj.PaymentModeId === 3) {

                    fields = {
                        ccnumber: {
                            selector: "#nmi-ccnumber",
                            placeholder: "0000 0000 0000 0000",
                            display: "required",
                        },
                        ccexp: {
                            selector: "#nmi-exp",
                            placeholder: "MM/YY",
                            display: "required",
                        },
                        cvv: {
                            selector: "#nmi-cvv",
                            placeholder: "***",
                            display: "required"
                        }
                    };
                }
                else if ($scope.mainNMIPaymentRequestObj.PaymentModeId === 7) {

                    fields = {
                        checkaccount: {
                            selector: "#nmi-chkacctnumber",
                            placeholder: "Account Number"
                        },
                        checkaba: {
                            selector: "#nmi-checkaba",
                            placeholder: "Routing Number"
                        },
                        checkname: {
                            selector: "#nmi-checkname",
                            placeholder: "Name on Account"
                        }
                    };
                }

                CollectJS.configure({
                    variant: "inline",
                    currency: "USD",
                    country: "US",
                    price: $scope.mainNMIPaymentRequestObj.PaymentAmount,
                    fields: fields,
                    validationCallback: function (field, status, message) {
                        //if (status) {
                        //    var message = field + " is now OK: " + message;
                        //} else {
                        //    var message = field + " is now Invalid: " + message;
                        //}
                        //console.log(message);
                        //if (message == 'Success') {
                        //    alertify.success(field + " is now OK: " + message);
                        //}
                        //else {
                        //    alertify.error(field + " is now Invalid: " + message);
                        //}
                        console.log(status + "__" + field);
                        //if (!status) {
                        //    if (field === 'card_number') alertify.error(message);
                        //    if (field === 'cvv') alertify.error(message);
                        //    if (field === 'expiry') alertify.error(message);
                        //    $scope.allFieldsValid = true;
                        //} else {
                        //    $scope.allFieldsValid = false;
                        //}

                        if (field === 'ccnumber') {
                            if (status) {
                                $scope.ccValitationobj.ccnumbervalid = true;
                            } else {
                                $scope.ccValitationobj.ccnumbervalid = false;
                                alertify.error(message);
                            }
                        }
                        if (field === 'cvv') {
                            if (status) {
                                $scope.ccValitationobj.cccvv = true;
                            } else {
                                $scope.ccValitationobj.cccvv = false;
                                alertify.error(message);
                            }
                        }
                        if (field === 'ccexp') {
                            if (status) {
                                $scope.ccValitationobj.ccexpiry = true;
                            } else {
                                $scope.ccValitationobj.ccexpiry = false;
                                alertify.error(message);
                            }
                        }
                    },
                    callback: function (response) {
                        $scope.$apply(function () {

                            console.log(response);
                            $scope.isPaymentInProgress = false;
                            $("#maineHnoteLoader").hide();
                            $scope.tokenResponse = response;

                            if ($scope.mainNMIPaymentRequestObj.PaymentModeId === 2 || $scope.mainNMIPaymentRequestObj.PaymentModeId === 3) {
                                if (response.card && response.card.type) {
                                    switch (response.card.type.toLowerCase()) {
                                        case 'visa':
                                            $scope.mainNMIPaymentRequestObj.CardTypeId = 1;
                                            break;
                                        case 'mastercard':
                                            $scope.mainNMIPaymentRequestObj.CardTypeId = 2;
                                            break;
                                        case 'amex':
                                            $scope.mainNMIPaymentRequestObj.CardTypeId = 3;
                                            break;
                                        default:
                                            $scope.mainNMIPaymentRequestObj.CardTypeId = 0;
                                    }
                                } else {
                                    $scope.mainNMIPaymentRequestObj.CardTypeId = 0;
                                }

                                $scope.mainNMIPaymentRequestObj.CardNumber = response.card.number.slice(-4);
                                $scope.mainNMIPaymentRequestObj.CardType = response.card.type;
                            } else if ($scope.mainNMIPaymentRequestObj.PaymentModeId === 7) {
                                console.log(response.check);
                                //response.check.aba
                                //response.check.account
                                //response.check.hash
                                //response.check.institution
                                //response.check.name
                                //response.check.transit

                            }

                            $scope.coninueprocessinlineOnlinePayment(response.token, $scope.mainNMIPaymentRequestObj);
                        });
                    },
                    timeoutCallback: function () {
                        alert("Tokenization timed out.");
                        $scope.$apply(function () { $scope.isPaymentInProgress = false; });
                        $("#maineHnoteLoader").hide();
                    },
                    fieldsAvailableCallback: function () {
                        console.log("Fields loaded.");
                        $("#maineHnoteLoader").hide();
                    }
                });
            } else {
                console.error("CollectJS not loaded.");
                $("#maineHnoteLoader").hide();
            }
        };

        //setTimeout($scope.initCollectJS, 500);

        $scope.changePOSPaymentModePayment = function (Id, item) {
            var mcount = 0;
            var List1 = $filter("filter")($scope.filteredPaymentModes, function (Pitem,) { return Pitem.PaymentModeId === Id; }) || [];
            if (List1.length != 0) {
                //item.PaymentModeId = List1[0].PaymentModeId;
                //item.PaymentMode = List1[0].PaymentModeName;

                item.PaymentMethodId = List1[0].PaymentModeId;
                item.PaymentMethod = List1[0].PaymentModeName;

            }

            item.PaymentProcessTypeId = "";

            angular.forEach($scope.mainNMIPaymentRequestObj.POSMultiPaymentsArray, function (pitem) {
                if (pitem.PaymentMethodId == 2 || pitem.PaymentMethodId == 3) {
                    mcount++;
                }
            })

            if (mcount > 1) {
                alertify.error("Only one credit/debit card payment is allowed. Please choose another payment method.");
                item.PaymentMethodId = 0;
                return false;
            }
            if (mcount = 1) {

            } else {
                $scope.clearCollectJSFields();
            }
        };
        $scope.changePaymentProcessingType = function (id) {
            if (id === 3) {
                $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId = id;
                $scope.mainNMIPaymentRequestObj.PaymentProcessType = "Payment Page";
                setTimeout(function () {
                    $scope.initCollectJS();
                }, 100);
            } else if (id == 1) {
                $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId = id;
                $scope.mainNMIPaymentRequestObj.PaymentProcessType = "Device(EMV)";
                $scope.GetOrganizationPOIDeviceList();
            } else if (id == 2) {
                $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId = id;
                $scope.mainNMIPaymentRequestObj.PaymentProcessType = "Swipe";
            } else if (id == 4) {
                $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId = id;
                $scope.mainNMIPaymentRequestObj.PaymentProcessType = "Without Gateway";
            } else {

            }
        };

        $scope.changePOSPaymentProcessingType = function (id, item) {
            if (id === 3) {
                item.PaymentProcessTypeId = id;
                item.PaymentProcessType = "Payment Page";
                item.CardHolderName = $scope.mainNMIPaymentRequestObj.CardHolderName;
                item.CardBillingZip = $scope.mainNMIPaymentRequestObj.CardBillingZip;
                setTimeout(function () {
                    $scope.POSinitCollectJS(item);
                }, 100);
            } else if (id == 1) {
                item.PaymentProcessTypeId = id;
                item.PaymentProcessType = "Device(EMV)";
                $scope.GetOrganizationPOIDeviceList();
            } else if (id == 2) {
                item.PaymentProcessTypeId = id;
                item.PaymentProcessType = "Swipe";
            } else if (id == 4) {
                item.PaymentProcessTypeId = id;
                item.PaymentProcessType = "Without Gateway";
            } else {

            }
        };
        $scope.changePOIDevice = function (selectedPoiDeviceId) {
            $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
            var selectedItem = $scope.POIDeviceList.find(x => x.PoiDeviceId === selectedPoiDeviceId);
            $scope.mainNMIPaymentRequestObj.PoiDeviceId = selectedItem.PoiDeviceId || "";
            $scope.mainNMITransactionObj.MerchentId = selectedItem.NMIMerchantId;
            $scope.mainNMITransactionObj.MerchentName = selectedItem.MerchantName;
        }

        $scope.ChangePaymentType = function (Id) {
            if (Id == 1) {
                $scope.mainNMIPaymentRequestObj.PaymentTypeId = Id;
                $scope.mainNMIPaymentRequestObj.PaymentType = "Deposit";
            } else if (Id == 2) {
                $scope.mainNMIPaymentRequestObj.PaymentTypeId = Id;
                $scope.mainNMIPaymentRequestObj.PaymentType = "Payment";
            } else {
                $scope.mainNMIPaymentRequestObj.PaymentTypeId = Id;
                $scope.mainNMIPaymentRequestObj.PaymentType = "PointOfSale";
            }
        }

        $scope.clearCollectJSFields = function () {
            const selectors = ['#nmi-ccnumber', '#nmi-cvv', '#nmi-exp', '#nmi-chkacctnumber', '#nmi-checkaba', '#nmi-checkname'];
            selectors.forEach(selector => {
                const el = document.querySelector(selector);
                if (el) el.innerHTML = '';
            });

        }
        $scope.changePaymentModePayment = function (Id) {

            var List1 = $filter("filter")($scope.filteredPaymentModes, function (Pitem,) { return Pitem.PaymentModeId === Id; }) || [];
            if (List1.length != 0) {
                $scope.mainNMIPaymentRequestObj.PaymentModeId = List1[0].PaymentModeId;
                $scope.mainNMIPaymentRequestObj.PaymentMode = List1[0].PaymentModeName;
            }
            $scope.mainNMIPaymentRequestObj.ChequeNumber = "";
            $scope.mainNMIPaymentRequestObj.TransactionId = "";
            $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId = "";

            var isGatewayMode = Id === 2 || Id === 3 || Id === 7;

            if (isGatewayMode) {
                var existingGatewayCount = 0;
                angular.forEach($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (ditem, dindex) {
                    // Count other rows (not the current one being changed)
                    if (dindex !== index) {
                        if (ditem.PaymentModeId === 2 || ditem.PaymentModeId === 3 || ditem.PaymentModeId === 7) {
                            existingGatewayCount++;
                        }
                    }
                });

                if (existingGatewayCount > 0) {
                    pitem.PaymentModeId = 0;
                    pitem.PaymentMode = "";
                    alertify.error("Only one Credit Card / Debit Card / ACH payment is allowed. Please use a different payment method.");
                    return false;
                }
            }

            $scope.clearCollectJSFields();
        };
        $scope.ISShowCardPaymentDetails = false;
        $scope.DepositIndex = 0;
        $scope.changeDepositPaymentMode = function (Id, pitem, index) {

            pitem.PaymentProcessTypeId = "";
            pitem.ChequeNumber = "";
            pitem.CardHolderName = "";
            pitem.CardBillingZip = "";
            pitem.CardTypeId = "";
            pitem.CardType = "";
            pitem.CardNumber = "";
            pitem.TransactionId = "";
            pitem.PoiDeviceId = "";
            pitem.TransactionId = "";
            pitem.ACHAccountNumber = "";
            pitem.ACHABANumber = "";

           
            pitem.PatientMobile = "";
            pitem.TextToPayTopic = "";
            pitem.TextToPayExpiration = "";

            if (pitem.PaymentModeId == 2 || pitem.PaymentModeId == 3 || pitem.PaymentModeId == 7) {
                if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com") {
                    $scope.ActiveDepositItem.PaymentProcessTypeId = 4;
                }
            }

            if (pitem.DepositAmount == 0) {
                alertify.error("Please enter deposit amount");
                pitem.PaymentModeId = 0;

                var List1 = $filter("filter")($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (Pitem) {
                    return Pitem.PaymentModeId === 1;
                }) || [];
                if (List1.length != 0 && List1[0].Status != '') {
                    $scope.filteredPaymentModesExceptCash = [];
                    $scope.filteredPaymentModesExceptCash = $scope.filteredPaymentModes.filter(function (item) {
                        return item.PaymentModeId !== 1;
                    });
                } else {
                    $scope.filteredPaymentModesExceptCash = angular.copy($scope.filteredPaymentModes);
                }

                return;
            }

            var duplicatePayMode = $scope.mainNMIPaymentRequestObj.PatientDepositLineItem.filter(function (ditem) {
                return ditem.PaymentModeId === pitem.PaymentModeId;
            });

            console.log(duplicatePayMode);
            console.log("duplicatePayMode");

            if (duplicatePayMode.length > 1) {
                var alreadySavedCard = duplicatePayMode.some(function (ditem) {
                    return ditem.Status === 'Success'
                        && ditem.PatientDepositPaymodeListId != 0
                        && ditem !== pitem;
                });
                if (!alreadySavedCard) {
                    pitem.PaymentModeId = "";
                    alertify.error("This payment method is already selected. Please choose another payment method.");
                    return;
                }
            }
            console.log($scope.filteredPaymentModes);

            $scope.DepositIndex = index;
            var List1 = $filter("filter")($scope.filteredPaymentModes, function (Pitem) {
                return Pitem.PaymentModeId === Id;
            }) || [];
            if (List1.length != 0) {
                pitem.PaymentModeId = List1[0].PaymentModeId;
                pitem.PaymentMode = List1[0].PaymentModeName;

                $scope.mainNMIPaymentRequestObj.PaymentModeId = List1[0].PaymentModeId;
                $scope.mainNMIPaymentRequestObj.PaymentMode = List1[0].PaymentModeName;

                $scope.SaveDepositPaymentReqObj.PaymentModeId = List1[0].PaymentModeId;
                $scope.SaveDepositPaymentReqObj.PaymentMode = List1[0].PaymentModeName;
            }

            $scope.SaveDepositPaymentReqObj.PaymentAmount = pitem.DepositAmount;
            $scope.SaveDepositPaymentReqObj.PaymentProcessTypeId = "";
            $scope.SaveDepositPaymentReqObj.ChequeNumber = "";
            $scope.SaveDepositPaymentReqObj.PaymentProcessTypeId = "";
            $scope.SaveDepositPaymentReqObj.CardHolderName = "";
            $scope.SaveDepositPaymentReqObj.CardBillingZip = "";
            $scope.SaveDepositPaymentReqObj.CardTypeId = "";
            $scope.SaveDepositPaymentReqObj.CardNumber = "";
            $scope.SaveDepositPaymentReqObj.TransactionId = "";
            $scope.SaveDepositPaymentReqObj.PoiDeviceId = "";

            $scope.SaveDepositPaymentReqObj.CardHolderName = $scope.PatientProfileDetails.Patient[0].FullName || "";
            $scope.SaveDepositPaymentReqObj.PatientFullName = $scope.PatientProfileDetails.Patient[0].FullName || "";
            $scope.SaveDepositPaymentReqObj.PatientMrno = $scope.PatientProfileDetails.Patient[0].PatientDisplayId || "";
            $scope.SaveDepositPaymentReqObj.CardBillingAddress1 = $scope.PatientProfileDetails.PatientAddress.PostalAddress.AddressLine1 || "";
            $scope.SaveDepositPaymentReqObj.CardBillingAddress2 = $scope.PatientProfileDetails.PatientAddress.PostalAddress.AddressLine2 || "";
            $scope.SaveDepositPaymentReqObj.CardBillingZip = $scope.PatientProfileDetails.PatientAddress.PostalAddress.ZipCode || "";
            $scope.SaveDepositPaymentReqObj.CardBillingCity = $scope.PatientProfileDetails.PatientAddress.PostalAddress.CityName;
            $scope.SaveDepositPaymentReqObj.CardBillingState = $scope.PatientProfileDetails.PatientAddress.PostalAddress.StateName;

            $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId = "";

            if (Id == 14) {
                $scope.id = Id;
                $scope.openDepositsPopup();
            }

            $scope.destroyNmiCollectScript();

         
            if (Id != 1 && Id != 12 && Id != 6 && Id != 4) {
                $scope.ISShowCardPaymentDetails = true;
            } else {
                $scope.ISShowCardPaymentDetails = false;
            }

            var List1 = $filter("filter")($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (Pitem) {
                return Pitem.PaymentModeId === 1;
            }) || [];

            if (List1.length != 0 && List1[0].Status != '') {
                $scope.filteredPaymentModesExceptCash = [];
                $scope.filteredPaymentModesExceptCash = $scope.filteredPaymentModes.filter(function (item) {
                    return item.PaymentModeId !== 1;
                });
            } else {
                $scope.filteredPaymentModesExceptCash = angular.copy($scope.filteredPaymentModes);
            }

            if (Id === 2 || Id === 3 || Id === 7) {
                if ($scope.mainNMIPaymentRequestObj.TokenizationKey) {
                    $scope.loadNmiCollectScript($scope.mainNMIPaymentRequestObj.TokenizationKey)
                        .catch(function (e) { console.warn("Collect.js preload:", e); });
                }

                console.log($scope.mainNMIPaymentRequestObj.PublicCheckOutKey + "__" + $scope.IsKountEnabled);

                if ($scope.mainNMIPaymentRequestObj.PublicCheckOutKey && $scope.IsKountEnabled) {
                    $scope.loadNmiGatewayScript()
                        .catch(function (e) { console.warn("Gateway.js preload:", e); });
                }
              
            }

           
            if (Id === 16) {
              
                pitem.PaymentProcessTypeId = 5;
                pitem.PaymentProcessType = "Text To Pay";

            
                $scope.textToPayUSnumberString = "";

             
                pitem.TextToPayExpiration = "1d";

             
                if ($scope.PatientProfileDetails && $scope.PatientProfileDetails.Patient && $scope.PatientProfileDetails.Patient[0]) {
                    var areaCode = $scope.PatientProfileDetails.Patient[0].Altareacode || "";
                    var homeNum = $scope.PatientProfileDetails.Patient[0].PatientHomeNumber || "";
                    pitem.PatientMobile = areaCode + "" + homeNum;

                    if (pitem.PatientMobile) {
                        $scope.formatUSNumberInfo(pitem.PatientMobile);
                    }
                }
                console.log($scope.mainNMIPaymentRequestObj.DepositTypeName + "_DepositTypeName_" + pitem.DepositTypeName);
                // Optional: auto-generate topic
                if (!pitem.TextToPayTopic) {
                    pitem.TextToPayTopic = $scope.mainNMIPaymentRequestObj.DepositTypeName +" Payment";
                }
            }

            $scope.setActiveDepositRow(index);
            $scope.checkstatusCollectAndSaveButton();
            $scope.CalculateLineFee(pitem);
        };

       
        $scope.filterProcessTypesForMode = function (processType) {

            if (!$scope.ActiveDepositItem) return true;

            var mode = $scope.ActiveDepositItem.PaymentModeId;

          
            if (processType.PaymentProcessTypeId === 5 && mode === 7) {
                return false;
            }

            
            if (mode === 7 && processType.PaymentProcessTypeId === 1) {
                return false;   // hide EMV Device for ACH
            }

            return true;
        };

        //$scope.ShowEachDepositNotes = function () {
        //    $scope.IsShoweachDepositNotes = !$scope.IsShoweachDepositNotes;
        //};
        $scope.ShowEachDepositNotes = function (row) {
            row.IsShoweachDepositNotes = !row.IsShoweachDepositNotes;
        };

        $scope.blurchangePaymentAmount = function (val) {
            /*var Amount = parseFloat(amt) || 0;*/

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

                $scope.mainNMIPaymentRequestObj.PaymentAmount = inputValue;

                if (inputValue === '' || isNaN(parseFloat(inputValue))) {
                    $scope.mainNMIPaymentRequestObj.PaymentAmount = '';
                    val = '';
                }
            }

            if ($scope.mainNMIPaymentRequestObj.PaymentAmount !== 0) {
                setTimeout(function () {
                    $scope.initCollectJS();
                }, 100);
            } else {
                $scope.clearCollectJSFields();
            }

        }

        //Deposit add code in nmi payment by durga as on 15052025
        $scope.GetPaymentmethodList = function () {
            var Obj = {
                "PatientDepositPaymodeListId": 0,
                "PaymentMethodId": 1,
                "PaymentMethodName": "Cash",
                "DepositAmount": "",
                "ReferenceNumber": "",
                "IsDepositAdded": false,
                "DeleteInd": "N",
                "PatientDepositId": $scope.MainParentobj?.PatientDepositsObj?.PatientDepositId || null,
                "CardNumber": "",
                "CardType": "",
                "CardTypeId": 0,
                "NMITransactionId": "",
                "PaymentProcessTypeId": 0,
                "PaymentProcessType": "",
                "OnlineTransactionNumber": "",
                "BillPaymentTypeId": 0,
                "BillPaymentType": "",
            }
            return Obj;
        }

        $scope.GetAllocatePaymentmethodList = function () {
            var Obj = {
                "PatientDepositPaymodeListId": 0,
                "PaymentMethodId": 1,
                "PaymentMethodName": "Cash",
                "DepositAmount": "",
                "ReferenceNumber": "",
                "IsDepositAdded": false,
                "DeleteInd": "N",
                "PatientDepositId": $scope.PatientPaymentObj.PatientDepositId || null,
                "CardNumber": "",
                "CardType": "",
                "CardTypeId": 0,
                "NMITransactionId": "",
                "PaymentProcessTypeId": 0,
                "PaymentProcessType": "",
                "OnlineTransactionNumber": "",
                "BillPaymentTypeId": 0,
                "BillPaymentType": "",
            }
            return Obj;
        }

        $scope.SelectedPatientDetails = {
            "PatientObj": "",
            "DepositsObj": ""
        };
        $scope.SelectedPatientDetails.PatientObj = $scope.MainParentobj.PatientDataObj || {};

        $scope.navtoAddtheDeposits = function (PaymentMethodObj, mainObj) {
            var PatientDepositPaymodeList = [];
            if ($scope.MainParentobj.PatientDepositPaymodeList.length > 0) {
                PatientDepositPaymodeList.push(PaymentMethodObj);
                PatientDepositPaymodeList[0].PatientDepositPaymodeListId = $scope.MainParentobj.PatientDepositPaymodeList[0].PatientDepositPaymodeListId;
                PatientDepositPaymodeList[0].PatientDepositId = $scope.MainParentobj.PatientDepositId;
            }
            else {
                PatientDepositPaymodeList.push(PaymentMethodObj);
            }



            //var ConvertedDate = $filter("usdateFormatter")($scope.MainParentobj.DepositDate, "-");
            //var PaymentDate = $filter("usdateFormatter")(mainObj.PaymentDate, "-");
            /*   var ConvertedDate = $filter("date")($scope.MainParentobj.DepositDate, "yyyy-MM-dd");*/
            /* var PaymentDate = $filter("date")(mainObj.PaymentDate, "yyyy-MM-dd");*/

            var existing = new Date(mainObj.PaymentDate);

            // If the date is invalid (Invalid Date), fix it manually
            if (isNaN(existing.getTime())) {

                // Try parsing MM-dd-yyyy (like 11-28-2025)
                var parts = mainObj.PaymentDate.split('-');
                if (parts.length === 3) {
                    // yyyy, MM-1, dd
                    existing = new Date(parts[2], parts[0] - 1, parts[1]);
                }
            }

            // Add current time
            var now = new Date();
            existing.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

            // Final formatted output
            var PaymentDate = $filter("date")(existing, 'MM-dd-yyyy HH:mm:ss');

            /*     var PaymentDate = $filter("date")(mainObj.PaymentDate, 'MM-dd-yyyy HH:mm:ss');*/


            mainObj.DepositAmount = parseFloat(PatientDepositPaymodeList[0].DepositAmount);


            var obj = {
                "UserId": $scope.MainParentobj.UserId,
                "PatientDepositId": $scope.MainParentobj.PatientDepositId || $scope.PaymentMethodObj.PatientDepositId,
                "PatientId": $scope.MainParentobj.PatientId || 0,
                "ReceiptNo": "",
                "ReceiptId": 0,
                "DepositDate": $filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss'),
                "PaymentDate": PaymentDate,
                "DepositAmount": mainObj.DepositAmount || 0,
                "DepositedByUserId": mainObj.RecievedUserId,
                "DepositedBy": mainObj.RecievedUserName,
                "UnBilledAmount": mainObj.DepositAmount,
                "BilledAmount": 0,
                "DeleteInd": "N",
                "AppointmentId": $scope.MainParentobj.AppointmentId,
                "BillingProviderId": $scope.mainNMIPaymentRequestObj.BillingProviderId,
                "PaymentMethodId": mainObj.PaymentModeId,
                "PaymentMethodName": mainObj.PaymentMode,
                //  "ChequeNumber": mainObj.ChequeNumber,
                "ChequeNumber": $scope.mainNMIPaymentRequestObj.ChequeNumber || "",
                "CardNumber": mainObj.CardNumber,
                "OnlineTransactionNumber": mainObj.TransactionId || "",
                "NMITransactionId": mainObj.NMITransactionId || 0,
                "CardName": "",
                "CardExpiry": "",
                "Notes": $scope.mainNMIPaymentRequestObj.PaymentNote,
                "BatchNumber": $scope.MainParentobj.BatchNumber || "",
                "OrganizationFacilityId": mainObj.HospitalId,
                "FacilityName": mainObj.HospitalName,
                "IsConsent": false,
                "IsDepositPrint": $scope.MainParentobj.IsDepositPrint,
                "IsEmail": false,
                "DepositStatusId": mainObj.DepositStatusId || 1,
                "DepositStatus": mainObj.DepositStatus || 'Deposited',
                "PageSize": 10,
                "PageNumber": 1,
                "PatientDepositPaymodeList": PatientDepositPaymodeList || [],
                "RenderingProviderId": $scope.mainNMIPaymentRequestObj.RenderingProviderId || 0,
                "DepositTypeId": $scope.mainNMIPaymentRequestObj.DepositTypeId,
                "DepositType": $scope.mainNMIPaymentRequestObj.DepositTypeName,
                "PaymentTransactionTypeId": mainObj.PaymentTransactionTypeId || 1,
                "PaymentTransactionType": mainObj.PaymentTransactionType || 'Credit',
                "OrganizationTransactionId": $scope.mainNMIPaymentRequestObj.OrganizationTransactionId,
                "OrganizationTransactionName": $scope.mainNMIPaymentRequestObj.OrganizationTransactionName,
                "OrganizationId": $scope.mainNMIPaymentRequestObj.HospitalId,
                "OrganizationName": $scope.mainNMIPaymentRequestObj.HospitalName,
                "Remarks": $scope.mainNMIPaymentRequestObj.Remarks || "",
                "RecievedUserId": $scope.mainNMIPaymentRequestObj.RecievedUserId || 0,
                "RecievedUserName": $scope.mainNMIPaymentRequestObj.RecievedUserName || "",
                //"PaymentProcessTypeId": $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId,
                //"PaymentProcessType": $scope.mainNMIPaymentRequestObj.PaymentProcessType,
            };
            eHnoteInsuranceService.AddUpdatePatientDepositAmount(obj).then(function (resp) {
                if (resp.data.Status === "Success") {

                    if ($scope.mainNMIPaymentRequestObj.PaymentTransactionType == "Failed") {
                        alertify.error("Deposit Transaction Failed");
                    } else {
                        if (obj.PatientDepositId === 0 || obj.PatientDepositId === null) {
                            alertify.success("Added Successfully");
                        } else {
                            alertify.success("Updated Successfully");
                        }
                    }


                    $scope.DepositTransactionData = resp.data;
                    if ($scope.DepositTransactionData.length > 0) {
                        $scope.mainNMIPaymentRequestObj.TransactionReceiptNo = $scope.DepositTransactionData.TransReciptNo || '';
                        $scope.mainNMIPaymentRequestObj.DepositTransactionDate = $scope.DepositTransactionData.DepositTransaction[0].TransactionDate || '';
                        $scope.mainNMIPaymentRequestObj.TransactionDate = $scope.DepositTransactionData.DepositTransaction[0].TransactionDate || '';
                        $scope.mainNMIPaymentRequestObj.TransactionTime = $scope.DepositTransactionData.DepositTransaction[0].TransactionTime || '';
                    }

                    $scope.PrintData = resp.data;
                    if ($scope.mainNMIPaymentRequestObj.UITransactionStatus != 'Success' && $scope.mainNMIPaymentRequestObj.UITransactionStatus != 'Failure') {
                        $uibModalInstance.close(resp.data);
                    }

                    $scope.destroyNmiCollectScript();
                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }

        $scope.navtoCollectCashPayment = function (Id) {

            var PaymentAmount = parseFloat($scope.mainNMIPaymentRequestObj.PaymentAmount) || 0;
            if (PaymentAmount == 0) {
                alertify.error("Please Enter Payment Amount");
                return false;
            }

            if ($scope.mainNMIPaymentRequestObj.HospitalId == 0) {
                alertify.error("Please select Office Location");
                return false;
            };
            $scope.mainNMIPaymentRequestObj.BillingProviderId = $scope.mainNMIPaymentRequestObj.BillingProviderId || 0;
            if ($scope.mainNMIPaymentRequestObj.BillingProviderId == 0) {
                alertify.error("Please select Billing Provider");
                return false;
            };
            var paymtDate = $scope.mainNMIPaymentRequestObj.PaymentDate || "";
            if (paymtDate == "") {
                alertify.error("Please select Payment Date");
                return false;
            };

            if ($scope.mainNMIPaymentRequestObj.PaymentModeId == 2 || $scope.mainNMIPaymentRequestObj.PaymentModeId == 3 || $scope.mainNMIPaymentRequestObj.PaymentModeId == 7) {
                if ($scope.mainNMIPaymentRequestObj.PaymentProcessTypeId == "") {
                    alertify.error("Please select Receive Via");
                    return false;
                }
            }

            if ($scope.mainNMIPaymentRequestObj.PaymentModeId == 2 || $scope.mainNMIPaymentRequestObj.PaymentModeId == 3) {
                if ($scope.mainNMIPaymentRequestObj.CardTypeId == 0) {
                    alertify.error("Please select Card Type");
                    return;
                }
                if ($scope.mainNMIPaymentRequestObj.CardNumber == '' || $scope.mainNMIPaymentRequestObj.CardNumber.trim().length < 4) {
                    alertify.error("Please Enter Card Last 4 digits");
                    return;
                }
            }


            var PaymentModeId = parseFloat($scope.mainNMIPaymentRequestObj.PaymentModeId) || 0;
            //if (Id == 1) {
            //    if (PaymentModeId != 1) {
            //        alertify.error("You are doing Cash Payment ,kindly select the Cash Paymentmode");
            //        return false;
            //    }
            //} else {

            //}

            if (+$scope.mainNMIPaymentRequestObj.PaymentTypeId === 1) {


                $scope.mainNMIPaymentRequestObj.DepositStatusId = 1;
                $scope.mainNMIPaymentRequestObj.DepositStatus = "Deposited";
                $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId = 1;
                $scope.mainNMIPaymentRequestObj.PaymentTransactionType = "Credit";
                $scope.mainNMIPaymentRequestObj.Remarks = "";

                $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                $scope.PaymentMethodObj.PaymentMethodId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
                $scope.PaymentMethodObj.PaymentMethodName = $scope.mainNMIPaymentRequestObj.PaymentMode;
                $scope.PaymentMethodObj.DepositAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount || 0;
                $scope.PaymentMethodObj.ReferenceNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                $scope.PaymentMethodObj.NMITransactionId = $scope.mainNMIPaymentRequestObj.NMITransactionId || 0;
                $scope.PaymentMethodObj.OnlineTransactionNumber = $scope.mainNMIPaymentRequestObj.TransactionId || '';
                $scope.PaymentMethodObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
                $scope.PaymentMethodObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";
                $scope.PaymentMethodObj.CardType = $scope.mainNMIPaymentRequestObj.CardType || "";
                $scope.PaymentMethodObj.CardTypeId = $scope.mainNMIPaymentRequestObj.CardTypeId || "";
                $scope.PaymentMethodObj.CardNumber = $scope.mainNMIPaymentRequestObj.CardNumber || "";
                $scope.PaymentMethodObj.ChequeNumber = $scope.mainNMIPaymentRequestObj.ChequeNumber || "";
                $scope.PaymentMethodObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
                $scope.PaymentMethodObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
                $scope.PaymentMethodObj.PaymentTransactionTypeId = $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId || 0;
                $scope.PaymentMethodObj.PaymentTransactionType = $scope.mainNMIPaymentRequestObj.PaymentTransactionType || "";
                $scope.PaymentMethodObj.Remarks = $scope.mainNMIPaymentRequestObj.Remarks || "";

                $scope.navtoAddtheDeposits($scope.PaymentMethodObj, $scope.mainNMIPaymentRequestObj)
            }
            else if (+$scope.mainNMIPaymentRequestObj.PaymentTypeId === 2) {

                $scope.mainNMIPaymentRequestObj.DepositStatusId = 1;
                $scope.mainNMIPaymentRequestObj.DepositStatus = "Deposited";
                $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId = 1;
                $scope.mainNMIPaymentRequestObj.PaymentTransactionType = "Credit";
                $scope.mainNMIPaymentRequestObj.Remarks = "";

                $scope.PaymentMethodObj = angular.copy($scope.GetAllocatePaymentmethodList());
                $scope.PaymentMethodObj.PaymentMethodId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
                $scope.PaymentMethodObj.PaymentMethodName = $scope.mainNMIPaymentRequestObj.PaymentMode;
                $scope.PaymentMethodObj.DepositAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount || 0;
                $scope.PaymentMethodObj.ReferenceNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                $scope.PaymentMethodObj.NMITransactionId = $scope.mainNMIPaymentRequestObj.NMITransactionId || 0;
                $scope.PaymentMethodObj.OnlineTransactionNumber = $scope.mainNMIPaymentRequestObj.TransactionId || '';
                $scope.PaymentMethodObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
                $scope.PaymentMethodObj.PatientDepositId = $scope.mainNMIPaymentRequestObj.PatientDepositId || 0;
                $scope.PaymentMethodObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";
                $scope.PaymentMethodObj.CardType = $scope.mainNMIPaymentRequestObj.CardType || "";
                $scope.PaymentMethodObj.CardTypeId = $scope.mainNMIPaymentRequestObj.CardTypeId || "";
                $scope.PaymentMethodObj.CardNumber = $scope.mainNMIPaymentRequestObj.CardNumber || "";
                $scope.PaymentMethodObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
                $scope.PaymentMethodObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
                $scope.PaymentMethodObj.PaymentTransactionTypeId = $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId || 0;
                $scope.PaymentMethodObj.PaymentTransactionType = $scope.mainNMIPaymentRequestObj.PaymentTransactionType || "";
                $scope.PaymentMethodObj.Remarks = $scope.mainNMIPaymentRequestObj.Remarks || "";

                $scope.navtoAddtheDeposits($scope.PaymentMethodObj, $scope.mainNMIPaymentRequestObj);
                // $scope.navtoSavePayments($scope.PaymentMethodObj, $scope.mainNMIPaymentRequestObj);

                /* $scope.navtoAddthePayments($scope.PaymentMethodObj, $scope.mainNMIPaymentRequestObj);*/
            }
            else if (+$scope.mainNMIPaymentRequestObj.PaymentTypeId === 3) {
                $scope.PaymentMethodObj = angular.copy($scope.GetPOSPaymentmethodItem());
                $scope.PaymentMethodObj.PaymentMethodId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
                $scope.PaymentMethodObj.PaymentMethodName = $scope.mainNMIPaymentRequestObj.PaymentMode;
                $scope.PaymentMethodObj.DepositAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount || 0;
                $scope.PaymentMethodObj.PatientDepositId = $scope.mainNMIPaymentRequestObj.PatientDepositId || 0;
                $scope.PaymentMethodObj.ReferenceNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                $scope.PaymentMethodObj.OnlineTransactionNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                $scope.PaymentMethodObj.NMITransactionId = $scope.mainNMIPaymentRequestObj.NMITransactionId || 0;
                $scope.PaymentMethodObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
                $scope.PaymentMethodObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";
                $scope.PaymentMethodObj.CardType = $scope.mainNMIPaymentRequestObj.CardType || "";
                $scope.PaymentMethodObj.CardTypeId = $scope.mainNMIPaymentRequestObj.CardTypeId || "";
                $scope.PaymentMethodObj.CardNumber = $scope.mainNMIPaymentRequestObj.CardNumber || "";
                $scope.PaymentMethodObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
                $scope.PaymentMethodObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
                $scope.navtoAddthePOS($scope.mainNMIPaymentRequestObj, $scope.PaymentMethodObj);
                //$scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                //$scope.PaymentMethodObj.PaymentMethodId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
                //$scope.PaymentMethodObj.PaymentMethodName = $scope.mainNMIPaymentRequestObj.PaymentMode;
                //$scope.PaymentMethodObj.DepositAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount || 0;
                //$scope.PaymentMethodObj.ReferenceNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                //$scope.PaymentMethodObj.NMITransactionId = $scope.mainNMIPaymentRequestObj.NMITransactionId || 0;
                //$scope.PaymentMethodObj.OnlineTransactionNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                //$scope.PaymentMethodObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
                //$scope.PaymentMethodObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";
                //$scope.PaymentMethodObj.CardType = $scope.mainNMIPaymentRequestObj.CardType || "";
                //$scope.PaymentMethodObj.CardTypeId = $scope.mainNMIPaymentRequestObj.CardTypeId || "";
                //$scope.PaymentMethodObj.CardNumber = $scope.mainNMIPaymentRequestObj.CardNumber || "";
                //$scope.PaymentMethodObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
                //$scope.PaymentMethodObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
                //$scope.navtoAddtheDeposits($scope.PaymentMethodObj, $scope.mainNMIPaymentRequestObj);
                ////$scope.navtoAddthePOS($scope.mainNMIPaymentRequestObj, $scope.PaymentMethodObj);
                //$scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                //$scope.PaymentMethodObj.PaymentMethodId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
                //$scope.PaymentMethodObj.PaymentMethodName = $scope.mainNMIPaymentRequestObj.PaymentMode;
                //$scope.PaymentMethodObj.DepositAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount || 0;
                //$scope.PaymentMethodObj.ReferenceNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                //$scope.PaymentMethodObj.NMITransactionId = $scope.mainNMIPaymentRequestObj.NMITransactionId || 0;
                //$scope.PaymentMethodObj.OnlineTransactionNumber = $scope.mainNMIPaymentRequestObj.TransactionId || "";
                //$scope.PaymentMethodObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
                //$scope.PaymentMethodObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";
                //$scope.PaymentMethodObj.CardType = $scope.mainNMIPaymentRequestObj.CardType || "";
                //$scope.PaymentMethodObj.CardTypeId = $scope.mainNMIPaymentRequestObj.CardTypeId || "";
                //$scope.PaymentMethodObj.CardNumber = $scope.mainNMIPaymentRequestObj.CardNumber || "";
                //$scope.PaymentMethodObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
                //$scope.PaymentMethodObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
                //$scope.navtoAddtheDeposits($scope.PaymentMethodObj, $scope.mainNMIPaymentRequestObj);
            }
        }

        $scope.navtoAddthePayments = function () {

            let i = 0, j = 0, hasDepositAmount = false;
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

            if ($scope.PatientPaymentObj.PatientDepositPaymodeList.length === 1 && !hasDepositAmount) {
                alertify.error("Please enter deposit amount");
                return;
            }


            let EOBClaims = [];
            let count = 0;
            let pcount = 0;
            let wcount = 0;
            //let ecount = 0;
            if ($scope.PatientClaimList.length > 0) {

                angular.forEach($scope.PatientClaimList, function (Aitem) {
                    let ClaimLineItems = [];
                    angular.forEach(Aitem.ClaimPatientResponsibility, function (item) {
                        let ClaimTransactions = [];
                        item.PatientPaymentAmount = item.PatientPaymentAmount || 0;
                        item.WriteOffAmount = item.WriteOffAmount || 0;

                        if (item.IsChecked) {
                            count++;
                        }
                        if (item.IsChecked && item.PatientPaymentAmount == 0) {
                            pcount++;
                        }
                        if (item.IsChecked && item.WriteOffAmount == 0) {
                            wcount++;
                        }
                        //if (item.IsPaymentEdit) {
                        //    ecount++;
                        //}

                        if (item.WriteOffAmount != 0 && item.IsChecked == true) {
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

                        if (item.PatientPaymentAmount != 0 && item.IsChecked == true) {
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
                                "TransactionType": " Payment Check",
                                "TransactionSourceId": 3,
                                "TransactionSource": "Patient",
                                "SettlementStatusId": 3,
                                "SettlementStatus": "Fully Settled",
                                "TransactionNotes": ""
                            }
                            ClaimTransactions.push(obj3);
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
                                "ClaimTransactions": ClaimTransactions || [],
                            }

                            ClaimLineItems.push(obj2);
                        }

                    });
                    if (ClaimLineItems.length > 0) {
                        let obj2 = {
                            "PatientClaimId": Aitem.PatientClaimId,
                            "EOBClaimInfoId": 0,
                            "TotalPaymentAmount": Aitem.TotalPaymentAmount || 0,
                            "TotalAdjustmentAmount": Aitem.TotalAdjustmentAmount || 0,
                            "TotalAllowedAmount": Aitem.TotalAllowedAmount || 0,
                            "TotalBalance": Aitem.TotalBalance || 0,
                            "TotalClaimAmount": Aitem.TotalClaimAmount || 0,
                            "TotalCoInsuranceAmount": Aitem.TotalCoInsuranceAmount || 0,
                            "TotalCopayAmount": Aitem.TotalCopayAmount || 0,
                            "TotalDeductibleAmount": Aitem.TotalDeductibleAmount || 0,
                            "TotalInsuranceBalance": Aitem.TotalInsuranceBalance || 0,
                            "TotalInsurancePayment": Aitem.TotalInsurancePayment || 0,
                            "TotalPatientBalance": Aitem.TotalPatientBalance || 0,
                            "TotalPatientPayment": Aitem.TotalPatientPayment || 0,
                            "TotalPaymentAmount": Aitem.TotalPaymentAmount || 0,
                            "TotalWriteOffAmount": Aitem.TotalWriteOffAmount || 0,
                            "EOBClaimLineItems": ClaimLineItems || []
                        }
                        EOBClaims.push(obj2);
                    };
                });

            }

            if (count === 0) {
                alertify.error('Please select at least one line item before posting.');
                return false;
            }
            if (pcount > 0 && wcount > 0) {
                alertify.error('There is no payment amount for the selected line items');
                return false;
            }
            if (EOBClaims.length == 0) {
                return false;
            }
            $scope.PatientPaymentObj.UnBilledAmount = $scope.PatientPaymentObj.UnBilledAmount || 0;
            if ($scope.PatientPaymentObj.UnBilledAmount == 0 && wcount > 0) {
                alertify.error("There is no deposit amount for this patient");
                return false;
            }
            if ($scope.TotalPatientPaymentBalance == 0 && wcount > 0) {
                alertify.error("Please apply Deposit Amount.");
                return false;
            }
            let DepositAmount = 0;
            let UnBilledAmount = 0;
            let UnAppliedAmount = 0;
            let EOBUnAppliedAmount = 0;
            let EOBAppliedAmount = 0;
            if ($scope.PatientPaymentObj.IsPatientDeposit) {

                DepositAmount = $scope.PatientPaymentObj.DepositAmount;
                UnBilledAmount = $scope.PatientPaymentObj.UnBilledAmount;
                EOBAppliedAmount = ($scope.PatientPaymentObj.BilledAmount);
                //UnAppliedAmount = (DepositAmount - $scope.PatientPaymentObj.BilledAmount);
                UnAppliedAmount = (UnBilledAmount - $scope.PatientPaymentObj.BilledAmount);

            } else {
                DepositAmount = $scope.PatientPaymentObj.UnBilledAmount;
                EOBUnAppliedAmount = (DepositAmount - $scope.PatientPaymentObj.BilledAmount);
                EOBAppliedAmount = ($scope.PatientPaymentObj.BilledAmount);
            }
            $scope.PatientPaymentObj.PatientDepositPaymodeList.forEach(function (item) {
                item.PatientDepositPaymodeListId = 0;
            });
            let obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "PatientDepositId": $scope.PaymentMethodObj.PatientDepositId,
                "TotalPaymentAmount": DepositAmount,
                //"TotalUnAppliedAmount": (DepositAmount - $scope.PatientPaymentObj.BilledAmount),
                "TotalUnAppliedAmount": UnAppliedAmount,
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
                "Notes": $scope.mainNMIPaymentRequestObj.PaymentNote,
                "PatientId": $scope.PatientPaymentObj.PatientId,
                "EOBId": $scope.PatientPaymentObj.EOBId,
                "EOBClaims": EOBClaims || [],
                "PostingType": "Patient Payment",
                "PostingTypeId": 3,
                "BillingProviderId": $scope.PatientPaymentObj.BillingProviderId,        // new params
                "OrganizationFacilityId": $scope.PatientPaymentObj.OrganizationFacilityId,
                "FacilityName": $scope.PatientPaymentObj.FacilityName,
                "PatientDepositPaymodeList": $scope.PatientPaymentObj.PatientDepositPaymodeList || [],
                "IsDepositPrint": $scope.PatientPaymentObj.IsDepositPrint,
                "PaymentTransactionTypeId": 2,
                "PaymentTransactionType": 'Debit'

            }
            console.log(JSON.stringify(obj))

            eHnoteInsuranceService.AddUpdatePatientPayment(obj).then(function (resp) {
                console.log(resp);
                if (resp.data.Status === "Success") {

                    $scope.PrintData = resp.data;
                    if ($scope.mainNMIPaymentRequestObj.UITransactionStatus != 'Success' && $scope.mainNMIPaymentRequestObj.UITransactionStatus != 'Failure') {
                        $uibModalInstance.close(resp.data);
                    }

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }

        $scope.CalculateTotalPayments = function () {
            const total = $scope.PatientPaymentObj.PatientDepositPaymodeList.reduce((sum, item) => {
                return sum + (item.DeleteInd !== 'Y' ? (parseFloat(item.DepositAmount) || 0) : 0);
            }, 0);

            $scope.PatientPaymentObj.DepositAmount = total;
            $scope.PatientPaymentObj.UnBilledAmount = total;
        };

        $scope.calculateLineItemPatientTotals = function () {
            var totalPatientBalance = 0, totalWriteOffAmt = 0, totalPatientPaymentBlsAmt = 0, totalcount = 0;
            angular.forEach($scope.PatientClaimList, function (Aitem) {
                let totalPaymentAmount = 0;
                let totalWriteOffAmount = 0;
                let totalBalanceAmount = 0;
                angular.forEach(Aitem.ClaimPatientResponsibility, function (sitem) {
                    var CurrentPatientBalance = parseFloat(sitem.PatientBalance) || 0;
                    var CurrentPatientPaymentAmount = parseFloat(sitem.PatientPaymentAmount) || 0;
                    var CurrentWriteOffAmount = parseFloat(sitem.WriteOffAmount) || 0;
                    var CurrentInsuranceBalance = parseFloat(sitem.InsuranceBalance) || 0;
                    sitem.CurrentPatientBalance = CurrentPatientBalance - (CurrentPatientPaymentAmount + CurrentWriteOffAmount);
                    sitem.TotalBalance = sitem.CurrentPatientBalance + CurrentInsuranceBalance;
                    var CurrentTotalBalance = parseFloat(sitem.TotalBalance) || 0;
                    totalBalanceAmount += CurrentTotalBalance;
                    totalPatientBalance += CurrentPatientBalance;
                    totalPaymentAmount += CurrentPatientPaymentAmount;
                    totalWriteOffAmount += CurrentWriteOffAmount;
                    // if ((totalPaymentAmount + totalWriteOffAmount) > $scope.PatientPaymentObj.UnBilledAmount) {
                    if ((totalPaymentAmount) > $scope.PatientPaymentObj.UnBilledAmount) {
                        sitem.PatientPaymentAmount = null;
                        sitem.WriteOffAmount = null;
                        totalcount++;
                    }
                });
                Aitem.TotalPatientBalance = totalPatientBalance - (totalPaymentAmount + totalWriteOffAmount);
                Aitem.TotalPatientPayment = totalPaymentAmount;
                Aitem.TotalBalance = totalBalanceAmount;
                Aitem.TotalWriteOffAmount = totalWriteOffAmount;
                totalPatientPaymentBlsAmt += totalPaymentAmount;
                totalWriteOffAmt += totalWriteOffAmount;
            });
            $scope.TotalPatientPaymentBalance = totalPatientPaymentBlsAmt;
            $scope.TotalAdjustmentBalanceAmount = totalWriteOffAmt;
            $scope.PatientPaymentObj.BilledAmount = $scope.TotalPatientPaymentBalance;
        }

        $scope.applyDeposit = function () {
            var totalApplied = 0;
            $scope.TotalPatientPaymentBalance = 0;
            let allChecked = true;
            $scope.PatientPaymentObj.UnBilledAmount = $scope.PatientPaymentObj.UnBilledAmount || 0;
            if ($scope.PatientPaymentObj.UnBilledAmount == 0) {

                var patientDepositAmount = parseFloat($scope.PatientPaymentObj.UnBilledAmount);
                angular.forEach($scope.PatientClaimList, function (claim) {
                    for (let i = 0; i < claim.ClaimPatientResponsibility.length; i++) {
                        //let availableBls = claim.ClaimPatientResponsibility[i].CurrentPatientBalance;
                        let availableBls = claim.ClaimPatientResponsibility[i].PatientBalance;
                        claim.ClaimPatientResponsibility[i].WriteOffAmount = 0;

                        claim.ClaimPatientResponsibility[i].PatientPaymentTypeId = $scope.PatientPaymentObj.DepositTypeId;
                        claim.ClaimPatientResponsibility[i].PatientPaymentAmount = patientDepositAmount;
                        claim.ClaimPatientResponsibility[i].CurrentPatientBalance = (availableBls - patientDepositAmount);
                        $scope.TotalPatientPaymentBalance += patientDepositAmount;
                        claim.ClaimPatientResponsibility[i].IsChecked = claim.ClaimPatientResponsibility[i].PatientPaymentAmount !== 0;
                        patientDepositAmount = 0; // Deposit is exhausted
                        /*break;*/ // Exit loop since no deposit amount is left
                        if (!claim.ClaimPatientResponsibility[i].IsChecked && claim.ClaimPatientResponsibility[i].PatientBalance != 0) {
                            allChecked = false;
                        }
                        $scope.AllSelectionObj.IsAllItemsChecked = allChecked;
                    }
                });


                return false;
            }

            var patientDepositAmount = parseFloat($scope.PatientPaymentObj.UnBilledAmount);
            angular.forEach($scope.PatientClaimList, function (claim) {
                for (let i = 0; i < claim.ClaimPatientResponsibility.length; i++) {
                    let balance = claim.ClaimPatientResponsibility[i].PatientBalance;
                    //let availableBls = claim.ClaimPatientResponsibility[i].CurrentPatientBalance;
                    let availableBls = claim.ClaimPatientResponsibility[i].PatientBalance;
                    claim.ClaimPatientResponsibility[i].WriteOffAmount = 0;

                    // If deposit is greater than or equal to the balance, pay it off completely
                    if (patientDepositAmount >= balance) {
                        claim.ClaimPatientResponsibility[i].PatientPaymentTypeId = $scope.PatientPaymentObj.DepositTypeId;
                        claim.ClaimPatientResponsibility[i].PatientPaymentAmount = balance;
                        claim.ClaimPatientResponsibility[i].CurrentPatientBalance = (availableBls - balance);
                        patientDepositAmount -= balance;
                        $scope.TotalPatientPaymentBalance += balance;
                        claim.ClaimPatientResponsibility[i].IsChecked = claim.ClaimPatientResponsibility[i].PatientPaymentAmount !== 0;

                    } else {
                        // If deposit is less than the balance, pay as much as possible
                        claim.ClaimPatientResponsibility[i].PatientPaymentTypeId = $scope.PatientPaymentObj.DepositTypeId;
                        claim.ClaimPatientResponsibility[i].PatientPaymentAmount = patientDepositAmount;
                        claim.ClaimPatientResponsibility[i].CurrentPatientBalance = (availableBls - patientDepositAmount);
                        $scope.TotalPatientPaymentBalance += patientDepositAmount;
                        patientDepositAmount = 0; // Deposit is exhausted
                        claim.ClaimPatientResponsibility[i].IsChecked = claim.ClaimPatientResponsibility[i].PatientPaymentAmount !== 0;
                        //break; // Exit loop since no deposit amount is left
                    }


                    if (!claim.ClaimPatientResponsibility[i].IsChecked && claim.ClaimPatientResponsibility[i].PatientBalance != 0) {
                        allChecked = false;
                    }
                    $scope.AllSelectionObj.IsAllItemsChecked = allChecked;
                }
            });
            //$scope.PatientPaymentObj.BilledAmount = $scope.TotalPatientPaymentBalance;
            $scope.calculateLineItemPatientTotals();

        };

        $scope.navtoSavePayments = function (PaymentMethodObj, mainObj) {
            var PatientDepositPaymodeList = [];
            PatientDepositPaymodeList.push(PaymentMethodObj);
            $scope.PatientPaymentObj.PatientDepositPaymodeList = PatientDepositPaymodeList || [];
            $scope.CalculateTotalPayments();
            $scope.applyDeposit();
            $scope.navtoAddthePayments(PaymentMethodObj, mainObj);
        }

        $scope.GetPOSPaymentmethodItem = function () {
            var Obj = {
                "PaymentId": 0,
                "InvoiceId": 0,
                "PaymentMethodId": 1,
                "PaymentMethod": "Cash",
                "PaymentAmount": null,
                "PatientDepositId": $scope.MainParentobj?.PatientDepositsObj?.PatientDepositId || null,
                "TransactionTypeId": 0,
                "TransactionType": "",
                "BillPaymentTypeId": 0,
                "BillPaymentType": "",
                "DeleteInd": "N",
                "CardNumber": '',
                "CardType": '',
                "CardTypeId": 0,
                "OnlineTransactionNumber": "",
                "PaymentProcessTypeId": 0,
                "PaymentProcessType": "",
                "NMITransactionId": 0
            }
            return Obj;
        };

        function getPaymentStatus(totalNetAmount, paidAmount) {
            if (!paidAmount || paidAmount === 0) return "Unpaid";
            if (paidAmount > 0 && paidAmount < totalNetAmount) return "Partially Paid";
            if (paidAmount >= totalNetAmount) return "Fully Paid";
            return "Unknown";
        }

        $scope.navtoAddthePOS = function (mainobj, PaymentMethodObj) {
            console.log(mainobj);
            var PatientDepositPaymodeList = [];
            PatientDepositPaymodeList.push(PaymentMethodObj);
            $scope.PatientPaymentObj.PatientDepositPaymodeList = $scope.PatientPaymentObj.PatientDepositPaymodeList || [];
            $scope.PatientPaymentObj.PatientDepositPaymodeList.push(PaymentMethodObj);

            $scope.MainParentobj.mainPosObject.Remarks = $scope.mainNMIPaymentRequestObj.PaymentNote || '';

            var InvoiceItems = [];
            $scope.TotalPatientPaymentBalance = 0;
            let totalAmount = 0;
            angular.forEach($scope.PatientPaymentObj.PatientDepositPaymodeList || [], function (item) {
                totalAmount += parseFloat(item.DepositAmount) || 0;
            });
            $scope.mainNMIPaymentRequestObj.PaymentAmount = totalAmount;
            var patientDepositAmount = parseFloat($scope.mainNMIPaymentRequestObj.PaymentAmount);
            for (let i = 0; i < $scope.MainParentobj.mainPosObject.InvoiceItems.length; i++) {

                let balance = $scope.MainParentobj.mainPosObject.InvoiceItems[i].PatientBalanceAmount;
                let availableBls = $scope.MainParentobj.mainPosObject.InvoiceItems[i].PatientBalanceAmount;
                let originalBls = $scope.MainParentobj.mainPosObject.InvoiceItems[i].PatientPaymentAmount;
                if (patientDepositAmount >= balance) {

                    $scope.MainParentobj.mainPosObject.InvoiceItems[i].PatientPaymentAmount += balance;
                    $scope.MainParentobj.mainPosObject.InvoiceItems[i].PatientBalanceAmount = (availableBls - balance);
                    patientDepositAmount -= balance;
                    $scope.TotalPatientPaymentBalance += balance;
                } else {

                    $scope.MainParentobj.mainPosObject.InvoiceItems[i].PatientPaymentAmount += patientDepositAmount;
                    $scope.MainParentobj.mainPosObject.InvoiceItems[i].PatientBalanceAmount = (availableBls - patientDepositAmount);
                    $scope.TotalPatientPaymentBalance += patientDepositAmount;
                    patientDepositAmount = 0;
                    break;
                }


            }

            if ($scope.MainParentobj.mainPosObject.OverallDiscountValue > 0) {
                var totalItems = $scope.MainParentobj.mainPosObject.InvoiceItems.length;
                var TotalCharge = 0, TotalDiscountAmount = 0, TotalNetAmount = 0, PatientPaymentAmount = 0, PatientBalanceAmount = 0, WriteOffAmount = 0, TotalBalanceAmount = 0;
                angular.forEach($scope.MainParentobj.mainPosObject.InvoiceItems, function (citem) {
                    if (citem.DeleteInd == "N") {

                        TotalCharge += parseFloat(citem.TotalChargeAmount);
                        TotalNetAmount += parseFloat(citem.TotalNetAmount);
                        PatientPaymentAmount += parseFloat(citem.PatientPaymentAmount);
                        PatientBalanceAmount += parseFloat(citem.PatientBalanceAmount);
                        TotalBalanceAmount += parseFloat(citem.PatientBalanceAmount);


                        if ($scope.MainParentobj.mainPosObject.OverallDiscountType === "A") {
                            TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                        } else {
                            TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                        }
                        //if ($scope.mainPosObject.OverallDiscountType === "A") {
                        //    TotalDiscountAmount = parseFloat($scope.mainPosObject.OverallDiscountValue) || 0;

                        //} else {
                        //    TotalDiscountAmount = (parseFloat($scope.mainPosObject.OverallDiscountValue) / 100) || 0;
                        //}


                    }
                });

                $scope.MainParentobj.mainPosObject.TotalChargeAmount = parseFloat(TotalCharge.toFixed(2));
                $scope.MainParentobj.mainPosObject.TotalDiscountAmount = parseFloat(TotalDiscountAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.TotalNetAmount = parseFloat(TotalNetAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.PatientPaymentAmount = parseFloat(PatientPaymentAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.PatientBalanceAmount = parseFloat(PatientBalanceAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.WriteOffAmount = parseFloat(WriteOffAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.TotalBalanceAmount = parseFloat(TotalBalanceAmount.toFixed(2));

                if ($scope.MainParentobj.mainPosObject.TotalNetAmount < 0) {
                    alertify.error("Over All Discount  should not be Greater Than Total Charge Amount");
                    $scope.MainParentobj.mainPosObject.OverallDiscountValue = 0;
                    TotalCharge = 0; TotalDiscountAmount = 0; TotalNetAmount = 0; PatientPaymentAmount = 0; PatientBalanceAmount = 0; WriteOffAmount = 0; TotalBalanceAmount = 0;
                    angular.forEach($scope.MainParentobj.mainPosObject.InvoiceItems, function (citem) {
                        citem.TotalChargeAmount = citem.UnitPrice * citem.Quantity;
                        citem.UnitPrice = parseFloat(citem.UnitPrice) || 0;
                        citem.Quantity = parseInt(citem.Quantity) || 1;
                        citem.DiscountAmount = 0;
                        citem.TotalNetAmount = (citem.UnitPrice * citem.Quantity) - citem.DiscountAmount;
                        citem.PatientBalanceAmount = citem.TotalNetAmount - (citem.PatientPaymentAmount || 0);


                        TotalCharge += parseFloat(citem.TotalChargeAmount);
                        TotalNetAmount += parseFloat(citem.TotalNetAmount);
                        PatientPaymentAmount += parseFloat(citem.PatientPaymentAmount);
                        PatientBalanceAmount += parseFloat(citem.PatientBalanceAmount);
                        TotalBalanceAmount += parseFloat(citem.PatientBalanceAmount);

                        if ($scope.MainParentobj.mainPosObject.OverallDiscountType === "A") {
                            TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                        } else {
                            TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                        }

                    });

                    $scope.MainParentobj.mainPosObject.TotalChargeAmount = parseFloat(TotalCharge.toFixed(2));
                    $scope.MainParentobj.mainPosObject.TotalDiscountAmount = parseFloat(TotalDiscountAmount.toFixed(2));
                    $scope.MainParentobj.mainPosObject.TotalNetAmount = parseFloat(TotalNetAmount.toFixed(2));
                    $scope.MainParentobj.mainPosObject.PatientPaymentAmount = parseFloat(PatientPaymentAmount.toFixed(2));
                    $scope.MainParentobj.mainPosObject.PatientBalanceAmount = parseFloat(PatientBalanceAmount.toFixed(2));
                    $scope.MainParentobj.mainPosObject.WriteOffAmount = parseFloat(WriteOffAmount.toFixed(2));
                    $scope.MainParentobj.mainPosObject.TotalBalanceAmount = parseFloat(TotalBalanceAmount.toFixed(2));
                    $scope.disableTotalDiscount = false;
                    $scope.disableIndividualDiscount = false;
                    return false;
                }

            }
            else {
                var totalItems = $scope.MainParentobj.mainPosObject.InvoiceItems.length;
                var TotalCharge = 0, TotalDiscountAmount = 0, TotalNetAmount = 0, PatientPaymentAmount = 0, PatientBalanceAmount = 0, WriteOffAmount = 0, TotalBalanceAmount = 0;
                angular.forEach($scope.MainParentobj.mainPosObject.InvoiceItems, function (citem) {
                    if (citem.DeleteInd == "N") {

                        TotalCharge += parseFloat(citem.TotalChargeAmount);
                        TotalNetAmount += parseFloat(citem.TotalNetAmount);
                        PatientPaymentAmount += parseFloat(citem.PatientPaymentAmount);
                        PatientBalanceAmount += parseFloat(citem.PatientBalanceAmount);
                        TotalBalanceAmount += parseFloat(citem.PatientBalanceAmount);


                        if (citem.DiscountType === "$") {
                            TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                        } else {
                            TotalDiscountAmount += (citem.DiscountAmount / 100) * (citem.UnitPrice * citem.Quantity);
                        }
                        //if ($scope.mainPosObject.OverallDiscountType === "A") {
                        //    TotalDiscountAmount = parseFloat($scope.mainPosObject.OverallDiscountValue) || 0;
                        //} else {
                        //    TotalDiscountAmount = (parseFloat($scope.mainPosObject.OverallDiscountValue) / 100) || 0;
                        //}


                    }
                });

                $scope.MainParentobj.mainPosObject.TotalChargeAmount = parseFloat(TotalCharge.toFixed(2));
                $scope.MainParentobj.mainPosObject.TotalDiscountAmount = parseFloat(TotalDiscountAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.TotalNetAmount = parseFloat(TotalNetAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.PatientPaymentAmount = parseFloat(PatientPaymentAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.PatientBalanceAmount = parseFloat(PatientBalanceAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.WriteOffAmount = parseFloat(WriteOffAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.TotalBalanceAmount = parseFloat(TotalBalanceAmount.toFixed(2));

            }

            angular.forEach($scope.MainParentobj.mainPosObject.InvoiceItems, function (item) {

                let PosTransaction = [];
                if (item.PatientBalanceAmount != 0) {
                    let PatientBalance = parseFloat(item.PatientBalanceAmount) || 0;
                    let Tranobj = {
                        "InvoiceItemTransactionId": 0,
                        "InvoiceItemId": item.InvoiceItemId,
                        "OrganizationId": $scope.HospitalId,
                        "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                        "TransactionAmount": item.TotalChargeAmount,
                        "PatientAmount": PatientBalance,
                        "PatientDepositId": null,
                        "AdjustmentReasonId": null,
                        "AdjustmentReasonCode": null,
                        "ReferenceNumber": "",
                        "TransactionTypeId": 1,
                        "TransactionType": "Payment",
                        "TransactionSourceId": 10,
                        "TransactionSource": "POS",
                        "SettlementStatusId": 3,
                        "SettlementStatus": "Fully Settled",
                        "TransactionNotes": "Payment received",
                        "DeleteInd": 'N'
                    }
                    PosTransaction.push(Tranobj);
                }

                let subobj = {
                    "InvoiceItemId": item.InvoiceItemId || null,
                    "InvoiceId": item.InvoiceId || null,
                    "ItemMasterId": item.ItemMasterId || null,
                    "ItemMasterName": item.ItemMaster || "",
                    "OrganizationItemId": item.OrganizationItemId || null,
                    "Quantity": item.Quantity || null,
                    "UnitPrice": item.UnitPrice || null,
                    "TotalChargeAmount": item.TotalChargeAmount || 0,
                    "DiscountValue": item.DiscountValue || null,
                    "DiscountType": item.DiscountType || "",
                    //"DiscountAmount": item.DiscountAmount || 0,
                    "DiscountAmount": $scope.MainParentobj.mainPosObject.OverallDiscountValue == 0 ?
                        item.DiscountType === "%" ? ((item.DiscountAmount / 100) * item.TotalChargeAmount) : item.DiscountAmount : item.DiscountAmount,
                    "TotalNetAmount": item.TotalNetAmount || 0,
                    "PatientPaymentAmount": item.PatientPaymentAmount || 0,
                    "PatientBalanceAmount": item.PatientBalanceAmount || 0,
                    "WriteOffAmount": item.WriteOffAmount || 0,
                    "BalanceAmount": item.BalanceAmount || 0,
                    "DeleteInd": item.DeleteInd,
                    "Transactions": PosTransaction || []
                }
                InvoiceItems.push(subobj);
            })

            var tempPayments = [];

            $scope.PaymentMethodObj.PaymentAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount || null;
            if ($scope.PaymentMethodObj.PaymentAmount != null) {

                angular.forEach($scope.PatientPaymentObj.PatientDepositPaymodeList, function (sitem) {

                    if (sitem.PaymentId == 0) {
                        let obj = {
                            "PaymentId": sitem.PaymentId || 0,
                            "InvoiceId": $scope.MainParentobj.mainPosObject.InvoiceId || 0,
                            "PaymentMethodId": sitem.PaymentMethodId || null,
                            "PaymentMethod": sitem.PaymentMethodName || "",
                            "PaymentAmount": sitem.DepositAmount || null,
                            "PatientDepositId": sitem.PatientDepositId || null,
                            "TransactionTypeId": $scope.PaymentsObj.TransactionTypeId,
                            "TransactionType": $scope.PaymentsObj.TransactionType,
                            "DeleteInd": $scope.PaymentsObj.DeleteInd,
                            "CardNumber": sitem.CardNumber || '',
                            "CardType": sitem.CardType || '',
                            "CardtypeId": sitem.CardTypeId || 0,
                            "NMITransactionId": sitem.NMITransactionId || "",
                            "OnlineTransactionNumber": sitem.OnlineTransactionNumber || null,
                            "PaymentProcessTypeId": sitem.PaymentProcessTypeId || null,
                            "PaymentProcessType": sitem.PaymentProcessType || null,
                            "BillPaymentTypeId": sitem.BillPaymentTypeId || null,
                            "BillPaymentType": sitem.BillPaymentType || null,
                            "PaymentTransactionTypeId": sitem.PaymentTransactionTypeId || null,
                            "PaymentTransactionType": sitem.PaymentTransactionType || "",
                            "Remarks": sitem.Remarks || "",
                        }
                        tempPayments.push(obj);
                    }

                })
                //$scope.PaymentsObj.PaymentMethodId = $scope.PaymentsObj.PaymentMethodId || null;
                //if ($scope.PaymentsObj.PaymentMethodId == null) {
                //    alertify.error("Please Select PaymentMethod");
                //    return false;
                //}

                //tempPayments.push(obj);
            }
            let paymentStatusIdMap = {
                "Unpaid": 1,
                "Partially Paid": 2,
                "Fully Paid": 3
            };

            let paymentStatusText = getPaymentStatus(
                $scope.MainParentobj.mainPosObject.TotalNetAmount,
                $scope.MainParentobj.mainPosObject.PatientPaymentAmount,
                /*$scope.PaymentMethodObj.PaymentAmount*/
            );

            let paymentStatusId = paymentStatusIdMap[paymentStatusText];
            let param = {
                "UserId": $scope.UserId,
                "InvoiceId": $scope.MainParentobj.mainPosObject.InvoiceId,
                "PatientId": $scope.MainParentobj.mainPosObject.PatientId,
                "PatientName": $scope.MainParentobj.mainPosObject.PatientName,
                /*   "OrganizationId": $scope.HospitalId,*/
                "BuyerId": $scope.MainParentobj.mainPosObject.BuyerId,
                "BuyerName": $scope.MainParentobj.mainPosObject.BuyerName,
                "IsEmployee": $scope.MainParentobj.mainPosObject.IsEmployee,
                "SoldByUserId": $scope.MainParentobj.mainPosObject.SoldByUserId,
                "SoldBy": $scope.MainParentobj.mainPosObject.SoldBy,
                //"BillingProviderId": $scope.MainParentobj.mainPosObject.BillingProviderId,
                //"BillingProviderName": $scope.MainParentobj.mainPosObject.BillingProviderName,
                "RenderingProviderId": $scope.MainParentobj.mainPosObject.RenderingProviderId,
                "RenderingProviderName": $scope.MainParentobj.mainPosObject.RenderingProviderName,
                "InvoiceDate": $scope.MainParentobj.mainPosObject.InvoiceDate,
                "DiscountReasonId": $scope.MainParentobj.mainPosObject.DiscountReasonId,
                "DiscountReasonCode": $scope.MainParentobj.mainPosObject.DiscountReasonCode,
                "OverallDiscountValue": $scope.MainParentobj.mainPosObject.OverallDiscountValue || null,
                "OverallDiscountType": $scope.MainParentobj.mainPosObject.OverallDiscountType || "",
                "TotalChargeAmount": $scope.MainParentobj.mainPosObject.TotalChargeAmount || "",
                "TotalDiscountAmount": $scope.MainParentobj.mainPosObject.TotalDiscountAmount || null,
                "TotalNetAmount": $scope.MainParentobj.mainPosObject.TotalNetAmount || null,
                "PatientPaymentAmount": $scope.MainParentobj.mainPosObject.PatientPaymentAmount || null,
                "PatientBalanceAmount": $scope.MainParentobj.mainPosObject.PatientBalanceAmount || null,
                "WriteOffAmount": $scope.MainParentobj.mainPosObject.WriteOffAmount || 0,
                "TotalBalanceAmount": $scope.MainParentobj.mainPosObject.TotalBalanceAmount || 0,
                //"PaymentStatus": $scope.MainParentobj.mainPosObject.PaymentStatus || 0,
                //"PaymentStatusId": $scope.MainParentobj.mainPosObject.PaymentStatusId || "",
                "DeleteInd": $scope.MainParentobj.mainPosObject.DeleteInd || "N",
                "InvoiceItems": InvoiceItems || [],
                "Payments": tempPayments || [],
                "ReferenceNumber": $scope.MainParentobj.mainPosObject.ReferenceNumber || '',
                "PaymentStatus": paymentStatusText,
                "PaymentStatusId": paymentStatusId,
                "Notes": $scope.mainNMIPaymentRequestObj.PaymentNote,
                "PaymentTransactionTypeId": $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId || 2,
                "PaymentTransactionType": $scope.mainNMIPaymentRequestObj.PaymentTransactionType || 'Debit',
                "OrganizationTransactionId": $scope.mainNMIPaymentRequestObj.OrganizationTransactionId,
                "NMITransactionId": mainobj.NMITransactionId || 0,
                "OrganizationTransactionName": $scope.mainNMIPaymentRequestObj.OrganizationTransactionName,
                "OrganizationId": $scope.mainNMIPaymentRequestObj.HospitalId,
                "OrganizationName": $scope.mainNMIPaymentRequestObj.HospitalName,
                "BillingProviderId": $scope.mainNMIPaymentRequestObj.BillingProviderId,
                "TransactionRemarks": $scope.mainNMIPaymentRequestObj.Remarks || "",
            }



            eHnoteInsuranceService.AddUpdatePOSSale(param).then(function (resp) {
                if (resp.data.Status === "Success") {
                    //$uibModalInstance.close({
                    //    response: resp.data,
                    //    paymentRequest: $scope.mainNMIPaymentRequestObj
                    //});
                    $scope.PrintData = resp.data;
                    $scope.mainNMIPaymentRequestObj.TransactionReceiptNo = $scope.PrintData.PaymentMethods[0].PosPaymodeReceiptNo || '';
                    $scope.mainNMIPaymentRequestObj.TransactionDate = $scope.PrintData.PaymentMethods[0].TransactionDate || '';
                    $scope.mainNMIPaymentRequestObj.TransactionTime = $scope.PrintData.PaymentMethods[0].TransactionTime || '';

                    if ($scope.mainNMIPaymentRequestObj.UITransactionStatus != 'Success' && $scope.mainNMIPaymentRequestObj.UITransactionStatus != 'Failure') {
                        $uibModalInstance.close(resp.data);
                    }
                    $scope.destroyNmiCollectScript();
                }
            }, function (err) { console.log(err); });
        }

        $scope.navtoCollectPaymentFromCloudDevice = function () {

            if ($scope.mainNMIPaymentRequestObj.HospitalId == 0) {
                alertify.error("Please select Office Location");
                return false;
            };
            $scope.mainNMIPaymentRequestObj.BillingProviderId = $scope.mainNMIPaymentRequestObj.BillingProviderId || 0;
            if ($scope.mainNMIPaymentRequestObj.BillingProviderId == 0) {
                alertify.error("Please select Billing Provider");
                return false;
            };
            var PoiDeviceId = $scope.mainNMIPaymentRequestObj.PoiDeviceId || "";
            if ($scope.mainNMIPaymentRequestObj.PaymentProcessTypeId == 1) {
                if (PoiDeviceId == "") {
                    alertify.error("Please select PoiDevice");
                    return false;
                };
            }

           


            var orderdescription = $scope.mainNMIPaymentRequestObj.PatientFirstName + " Payment" + $scope.mainNMIPaymentRequestObj.PaymentAmount + " for " + $scope.mainNMIPaymentRequestObj.PaymentType + " on " + $scope.mainNMIPaymentRequestObj.PaymentDate;

            $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());


            $scope.mainNMITransactionObj.NMITransactionId = 0;
            $scope.mainNMITransactionObj.UserId = $scope.mainNMIPaymentRequestObj.RecievedUserId;
            $scope.mainNMITransactionObj.PatientId = $scope.mainNMIPaymentRequestObj.PatientId;
            $scope.mainNMITransactionObj.OrganizationId = $scope.mainNMIPaymentRequestObj.HospitalId;
            $scope.mainNMITransactionObj.PaymentAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount;
            $scope.mainNMITransactionObj.MerchentId = "";
            $scope.mainNMITransactionObj.MerchentName = "ehnotesandbox";
            $scope.mainNMITransactionObj.PaymentToken = "";
            $scope.mainNMITransactionObj.CardHolderName = $scope.mainNMIPaymentRequestObj.CardHolderName || "";
            $scope.mainNMITransactionObj.PatientEmail = $scope.mainNMIPaymentRequestObj.PatientEmailId || "";
            $scope.mainNMITransactionObj.PatientMobile = $scope.mainNMIPaymentRequestObj.PatientMobileNumber || "";
            $scope.mainNMITransactionObj.PatientMrNo = $scope.mainNMIPaymentRequestObj.PatientMrNo || "";

            $scope.mainNMITransactionObj.CardBillingAddress1 = $scope.mainNMIPaymentRequestObj.CardBillingAddress1 || "";
            $scope.mainNMITransactionObj.CardBillingAddress2 = $scope.mainNMIPaymentRequestObj.CardBillingAddress2 || "";
            $scope.mainNMITransactionObj.CardBillingState = $scope.mainNMIPaymentRequestObj.CardBillingState || "";
            $scope.mainNMITransactionObj.CardBillingCity = $scope.mainNMIPaymentRequestObj.CardBillingCity || "";
            $scope.mainNMITransactionObj.CardBillingZip = $scope.mainNMIPaymentRequestObj.CardBillingZip || "";

            $scope.mainNMITransactionObj.OrderId = "";
            $scope.mainNMITransactionObj.OrderDescription = orderdescription;
            $scope.mainNMITransactionObj.TransactionId = 0;
            $scope.mainNMITransactionObj.ResponseId = 0;
            $scope.mainNMITransactionObj.ResponseCode = "";
            $scope.mainNMITransactionObj.ResponseText = "";
            $scope.mainNMITransactionObj.Status = "";
            $scope.mainNMITransactionObj.TransactionTypeId = $scope.mainNMIPaymentRequestObj.TransactionTypeId;
            $scope.mainNMITransactionObj.TransactionType = $scope.mainNMIPaymentRequestObj.TransactionType;
            $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
            $scope.mainNMITransactionObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
            $scope.mainNMITransactionObj.DeleteInd = "N";
            $scope.mainNMITransactionObj.Type = $scope.mainNMIPaymentRequestObj.TransactionType;
            $scope.mainNMITransactionObj.AppointmentId = $scope.mainNMIPaymentRequestObj.AppointmentId;
            $scope.mainNMITransactionObj.VisitId = $scope.mainNMIPaymentRequestObj.VisitId;
            $scope.mainNMITransactionObj.PaymentType = $scope.mainNMIPaymentRequestObj.PaymentModeId == 2 ? 'creditcard' :
                $scope.mainNMIPaymentRequestObj.PaymentModeId == 7 ? 'check' :
                    'creditcard';
            $scope.mainNMITransactionObj.PoiDeviceId = $scope.mainNMIPaymentRequestObj.PoiDeviceId || "";
            $scope.mainNMITransactionObj.ResponseMethod = "synchronous";
            $scope.mainNMITransactionObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
            $scope.mainNMITransactionObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";

            $scope.mainNMITransactionObj.PaymentModeId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
            $scope.mainNMITransactionObj.PaymentMode = $scope.mainNMIPaymentRequestObj.PaymentMode;

            eHnotePaymentGatewayService.NMIProcessTransactionWithCloudDevice($scope.mainNMITransactionObj).then(function (resp) {

                console.log(JSON.stringify(resp));
                var res = resp.data || {};
                $scope.mainNMITransactionObj.ResponseText = res.ResponseText;
                if (res.ResponseId === 1) {
                    alertify.success(res.ResponseText);
                    $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Success';
                    $scope.mainNMIPaymentRequestObj.NMITransactionId = res.NMITransactionId;
                    $scope.mainNMIPaymentRequestObj.TransactionId = res.TransactionId;

                } else if (res.ResponseId === 2) {
                    alertify.error(res.ResponseText);

                    $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Failure';
                } else {
                    alertify.error(res.ResponseText);
                    $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Failure';
                }

                if (+$scope.mainNMIPaymentRequestObj.PaymentTypeId === 1) {

                    $scope.mainNMIPaymentRequestObj.DepositStatusId = 1;
                    $scope.mainNMIPaymentRequestObj.DepositStatus = "Deposited";
                    $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId = 1;
                    $scope.mainNMIPaymentRequestObj.PaymentTransactionType = "Credit";

                    if (res.ResponseId === 1) {
                        alertify.success(res.ResponseText);
                        $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Success';
                        $scope.mainNMIPaymentRequestObj.NMITransactionId = res.NMITransactionId;
                        $scope.mainNMIPaymentRequestObj.TransactionId = res.TransactionId;
                        $scope.mainNMIPaymentRequestObj.Remarks = res.ResponseText || "";
                    } else {
                        alertify.error(res.ResponseText);
                        $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Failure';
                        $scope.mainNMIPaymentRequestObj.DepositStatusId = 6;
                        $scope.mainNMIPaymentRequestObj.DepositStatus = "Failed";
                        $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId = 7;
                        $scope.mainNMIPaymentRequestObj.PaymentTransactionType = "Failed";
                        $scope.mainNMIPaymentRequestObj.Remarks = res.ResponseText || "";
                    }

                    $scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                    $scope.PaymentMethodObj.PaymentMethodId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
                    $scope.PaymentMethodObj.PaymentMethodName = $scope.mainNMIPaymentRequestObj.PaymentMode;
                    $scope.PaymentMethodObj.DepositAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount || 0;
                    $scope.PaymentMethodObj.ReferenceNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                    $scope.PaymentMethodObj.NMITransactionId = $scope.mainNMIPaymentRequestObj.NMITransactionId || 0;
                    $scope.PaymentMethodObj.OnlineTransactionNumber = $scope.mainNMIPaymentRequestObj.TransactionId || "";
                    $scope.PaymentMethodObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
                    $scope.PaymentMethodObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";
                    $scope.PaymentMethodObj.CardType = $scope.mainNMIPaymentRequestObj.CardType || "";
                    $scope.PaymentMethodObj.CardTypeId = $scope.mainNMIPaymentRequestObj.CardTypeId || "";
                    $scope.PaymentMethodObj.CardNumber = $scope.mainNMIPaymentRequestObj.CardNumber || "";
                    $scope.PaymentMethodObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
                    $scope.PaymentMethodObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
                    $scope.PaymentMethodObj.PaymentTransactionTypeId = $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId || 0;
                    $scope.PaymentMethodObj.PaymentTransactionType = $scope.mainNMIPaymentRequestObj.PaymentTransactionType || "";
                    $scope.PaymentMethodObj.Remarks = $scope.mainNMIPaymentRequestObj.Remarks || "";

                    $scope.navtoAddtheDeposits($scope.PaymentMethodObj, $scope.mainNMIPaymentRequestObj);
                }
                else if (+$scope.mainNMIPaymentRequestObj.PaymentTypeId === 2) {

                    $scope.mainNMIPaymentRequestObj.DepositStatusId = 1;
                    $scope.mainNMIPaymentRequestObj.DepositStatus = "Deposited";
                    $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId = 1;
                    $scope.mainNMIPaymentRequestObj.PaymentTransactionType = "Credit";
                    $scope.mainNMIPaymentRequestObj.Remarks = res.ResponseText || "";

                    if (res.ResponseId === 1) {
                        alertify.success(res.ResponseText);
                        $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Success';
                        $scope.mainNMIPaymentRequestObj.NMITransactionId = res.NMITransactionId;
                        $scope.mainNMIPaymentRequestObj.TransactionId = res.TransactionId;
                    } else {
                        alertify.error(res.ResponseText);
                        $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Failure';
                        $scope.mainNMIPaymentRequestObj.DepositStatusId = 6;
                        $scope.mainNMIPaymentRequestObj.DepositStatus = "Failed";
                        $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId = 7;
                        $scope.mainNMIPaymentRequestObj.PaymentTransactionType = "Failed";
                        $scope.mainNMIPaymentRequestObj.Remarks = res.ResponseText || "";
                    }

                    $scope.PaymentMethodObj = angular.copy($scope.GetAllocatePaymentmethodList());
                    $scope.PaymentMethodObj.PaymentMethodId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
                    $scope.PaymentMethodObj.PaymentMethodName = $scope.mainNMIPaymentRequestObj.PaymentMode;
                    $scope.PaymentMethodObj.DepositAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount || 0;
                    $scope.PaymentMethodObj.ReferenceNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                    $scope.PaymentMethodObj.NMITransactionId = $scope.mainNMIPaymentRequestObj.NMITransactionId || 0;
                    $scope.PaymentMethodObj.OnlineTransactionNumber = $scope.mainNMIPaymentRequestObj.TransactionId || "";
                    $scope.PaymentMethodObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
                    $scope.PaymentMethodObj.PatientDepositId = $scope.mainNMIPaymentRequestObj.PatientDepositId || 0;
                    $scope.PaymentMethodObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";
                    $scope.PaymentMethodObj.CardType = $scope.mainNMIPaymentRequestObj.CardType || "";
                    $scope.PaymentMethodObj.CardTypeId = $scope.mainNMIPaymentRequestObj.CardTypeId || "";
                    $scope.PaymentMethodObj.CardNumber = $scope.mainNMIPaymentRequestObj.CardNumber || "";
                    $scope.PaymentMethodObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
                    $scope.PaymentMethodObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
                    $scope.PaymentMethodObj.PaymentTransactionTypeId = $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId || 0;
                    $scope.PaymentMethodObj.PaymentTransactionType = $scope.mainNMIPaymentRequestObj.PaymentTransactionType || "";
                    $scope.PaymentMethodObj.Remarks = $scope.mainNMIPaymentRequestObj.Remarks || "";
                    $scope.navtoAddtheDeposits($scope.PaymentMethodObj, $scope.mainNMIPaymentRequestObj);
                    //$scope.navtoAddthePayments($scope.PaymentMethodObj, $scope.mainNMIPaymentRequestObj);
                    //$scope.navtoSavePayments($scope.PaymentMethodObj, $scope.mainNMIPaymentRequestObj);
                }
                else if (+$scope.mainNMIPaymentRequestObj.PaymentTypeId === 3) {

                    $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId = 2;
                    $scope.mainNMIPaymentRequestObj.PaymentTransactionType = "Debit";
                    $scope.mainNMIPaymentRequestObj.Remarks = res.ResponseText || "";

                    if (res.ResponseId === 1) {
                        alertify.success(res.Status);
                        $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Success';
                        $scope.mainNMIPaymentRequestObj.NMITransactionId = res.NMITransactionId;
                        $scope.mainNMIPaymentRequestObj.TransactionId = res.TransactionId;
                    } else {
                        alertify.error(res.Status);
                        $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Failure';
                        $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId = 7;
                        $scope.mainNMIPaymentRequestObj.PaymentTransactionType = "Failed";
                        $scope.mainNMIPaymentRequestObj.Remarks = res.ResponseText || "";
                    }

                    $scope.PaymentMethodObj = angular.copy($scope.GetPOSPaymentmethodItem());
                    $scope.PaymentMethodObj.PaymentMethodId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
                    $scope.PaymentMethodObj.PaymentMethodName = $scope.mainNMIPaymentRequestObj.PaymentMode;
                    $scope.PaymentMethodObj.DepositAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount || 0;
                    $scope.PaymentMethodObj.ReferenceNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                    $scope.PaymentMethodObj.OnlineTransactionNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                    $scope.PaymentMethodObj.NMITransactionId = $scope.mainNMIPaymentRequestObj.NMITransactionId || 0;
                    $scope.PaymentMethodObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
                    $scope.PaymentMethodObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";
                    $scope.PaymentMethodObj.CardType = $scope.mainNMIPaymentRequestObj.CardType || "";
                    $scope.PaymentMethodObj.CardTypeId = $scope.mainNMIPaymentRequestObj.CardTypeId || "";
                    $scope.PaymentMethodObj.CardNumber = $scope.mainNMIPaymentRequestObj.CardNumber || "";
                    $scope.PaymentMethodObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
                    $scope.PaymentMethodObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
                    $scope.PaymentMethodObj.PaymentTransactionTypeId = $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId || 0;
                    $scope.PaymentMethodObj.PaymentTransactionType = $scope.mainNMIPaymentRequestObj.PaymentTransactionType || "";
                    $scope.PaymentMethodObj.Remarks = $scope.mainNMIPaymentRequestObj.Remarks || "";
                    $scope.navtoAddthePOS($scope.mainNMIPaymentRequestObj, $scope.PaymentMethodObj);
                    //$scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                    //$scope.PaymentMethodObj.PaymentMethodId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
                    //$scope.PaymentMethodObj.PaymentMethodName = $scope.mainNMIPaymentRequestObj.PaymentMode;
                    //$scope.PaymentMethodObj.DepositAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount || 0;
                    //$scope.PaymentMethodObj.ReferenceNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                    //$scope.PaymentMethodObj.NMITransactionId = $scope.mainNMIPaymentRequestObj.NMITransactionId || 0;
                    //$scope.PaymentMethodObj.OnlineTransactionNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                    //$scope.PaymentMethodObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
                    //$scope.PaymentMethodObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";
                    //$scope.PaymentMethodObj.CardType = $scope.mainNMIPaymentRequestObj.CardType || "";
                    //$scope.PaymentMethodObj.CardTypeId = $scope.mainNMIPaymentRequestObj.CardTypeId || "";
                    //$scope.PaymentMethodObj.CardNumber = $scope.mainNMIPaymentRequestObj.CardNumber || "";
                    //$scope.PaymentMethodObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
                    //$scope.PaymentMethodObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
                    //$scope.navtoAddtheDeposits($scope.PaymentMethodObj, $scope.mainNMIPaymentRequestObj);
                    //$scope.navtoAddthePOS($scope.mainNMIPaymentRequestObj, $scope.PaymentMethodObj);
                    //$scope.PaymentMethodObj = angular.copy($scope.GetPaymentmethodList());
                    //$scope.PaymentMethodObj.PaymentMethodId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
                    //$scope.PaymentMethodObj.PaymentMethodName = $scope.mainNMIPaymentRequestObj.PaymentMode;
                    //$scope.PaymentMethodObj.DepositAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount || 0;
                    //$scope.PaymentMethodObj.ReferenceNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                    //$scope.PaymentMethodObj.NMITransactionId = $scope.mainNMIPaymentRequestObj.NMITransactionId || 0;
                    //$scope.PaymentMethodObj.OnlineTransactionNumber = $scope.mainNMIPaymentRequestObj.TransactionId || "";
                    //$scope.PaymentMethodObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
                    //$scope.PaymentMethodObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";
                    //$scope.PaymentMethodObj.CardType = $scope.mainNMIPaymentRequestObj.CardType || "";
                    //$scope.PaymentMethodObj.CardTypeId = $scope.mainNMIPaymentRequestObj.CardTypeId || "";
                    //$scope.PaymentMethodObj.CardNumber = $scope.mainNMIPaymentRequestObj.CardNumber || "";
                    //$scope.PaymentMethodObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
                    //$scope.PaymentMethodObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
                    //$scope.navtoAddtheDeposits($scope.PaymentMethodObj, $scope.mainNMIPaymentRequestObj);
                }


                console.log(res);

            });

        }

        $scope.PrintreceptList = function () {
            $scope.PrintData.IsDepositPrint = true;
            $scope.PrintData.IsPosPrint = $scope.PrintData.IsPosPrint || false;
            $scope.PrintData.IsPosPrint = true;
            $scope.uibclose();
        }

        console.log($scope.mainBillerDataObj);

        $scope.navtoOpenProfilePopup = function (item, id, NotesId) {
            item = item || null;
            let AppointmentId = null;
            let PatientId = null;

            if ($scope.MainParentobj.AppointmentId != undefined) {
                if ($scope.MainParentobj.AppointmentId == null) {
                    AppointmentId = $scope.MainParentobj.AppointmentId;
                    PatientId = $scope.MainParentobj.PatientID;
                }
            } else {
                AppointmentId = $scope.MainParentobj.AppointmentId;
                PatientId = $scope.MainParentobj.PatientId;
            }
            $scope.claimScreenParentObj = {
                "PatientId": PatientId || null,
                "AppointmentId": AppointmentId || null,
                "ActionType": "AddClaim",
                "SubActionType": "Verify",
                "ScreenType": "Popup",
                "PatientClaimId": $scope.MainParentobj.PatientClaimId,
                "SuperBillId": null,
                "SuperBillArray": [],
                "NotesId": NotesId || 1,
            };

            datapersistanceFactory.set("IsComingFromClaim", $scope.claimScreenParentObj);


            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsClaims/ClaimPatientProfile.html",
                "size": "lg",
                "keyboard": false,
                "controller": "UsClaimPatientProfileCtrl",
                "windowClass": "offcanves-right z-index-nine__one",
                'backdrop': 'static',
                "resolve": {
                    "PatientInsuranceListData": function () { return item; },
                    "id": function () { return id; },
                    "AllHospitalData": function () { return $scope.MainParentobj.mainBillerDataObj || null; },
                    "IshideIndicator": true,
                }

            });
            $scope.mInstanceAdd.result.then(function () {
                $scope.ShowPatientDetailsList($scope.MainParentobj.PatientId);
            }, function () { });

        }

        $scope.openDepositsPopup = function () {

            $scope.Patientobj = {
                "PatientId": $scope.MainParentobj.PatientId || 0,
                /*   "selectedDeposits": $scope.selectedDeposits || [],*/
            };
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/DepositsPopUp.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "Patientobj": function () { return $scope.Patientobj; }
                },
                "windowClass": "modal__ninety-- z-index-nine__one",
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnoteMasterDataService, eHnoteInsuranceService, Patientobj) {

                    /*    $scope.selectedDeposits = Patientobj.selectedDeposits || []*/

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
                                        if (item.UnBilledAmount >= 0) {
                                            $scope.PatientTotalUnallocated += item.UnBilledAmount;
                                        }
                                    });

                                }
                                $scope.PtDepositsDataArray = [];
                                $scope.PtDepositsDataArray = $scope.PatientDepositsListArray.filter(item => item.DepositStatusId != 2);

                            } else {
                                alertify.error(resp.data.Message);
                            }
                        });
                    }

                    $scope.getPatientDepositAmountById();

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
                $scope.SelectedDeposit = true;
                if (resp.Mainobj != undefined) {
                    if (resp.Mainobj.UnBilledAmount <= 0) {
                        alertify.error("There is no Available Deposit Balance.");
                        $scope.PaymentMethodObj.PaymentMethodId = 1;
                        $scope.PaymentMethodObj.PaymentMethodName = "Cash";
                        $scope.SelectedDeposit = false;
                    }
                    else {

                        //if ($scope.PatientPaymentObj.PatientDepositPaymodeList.length == 0) {
                        //    if ($scope.TotalPatientBalanceAmount < resp.Mainobj.UnBilledAmount) {
                        //        resp.Mainobj.UnBilledAmount = $scope.TotalPatientBalanceAmount
                        //    }
                        //}

                        $scope.PatientDepositDetails.DepositNumber = resp.Mainobj.ReceiptNo || "";
                        $scope.PatientDepositDetails.DepositAmount = resp.Mainobj.UnBilledAmount || "";
                        $scope.PatientPaymentObj.BilledAmount = resp.Mainobj.BilledAmount || 0;
                        $scope.PatientPaymentObj.UnBilledAmount += resp.Mainobj.UnBilledAmount || 0;
                        $scope.PatientDepositDetails.DepositDate = $filter('date')(resp.Mainobj.DepositDate, "MM-dd-yyyy") || "";

                        $scope.PatientPaymentObj.PatientId = resp.Mainobj.PatientId || "";

                        var SelectedDepositAmount = resp.Mainobj.UnBilledAmount || 0;
                        //$scope.TotalPaymentAmt = 0;
                        //if ($scope.TotalPatientBalanceAmount < SelectedDepositAmount) {
                        //    angular.forEach($scope.PatientPaymentObj.PatientDepositPaymodeList, function (item) {
                        //        $scope.TotalPaymentAmt += parseFloat(item.DepositAmount);
                        //        $scope.SelectedDeposit = true;
                        //    });
                        //    SelectedDepositAmount = $scope.TotalPatientBalanceAmount - $scope.TotalPaymentAmt || 0;
                        //}

                        //if ($scope.PatientPaymentObj.PatientDepositPaymodeList.length > 0) {
                        //    if ($scope.TotalPatientBalanceAmount == SelectedDepositAmount) {
                        //        angular.forEach($scope.PatientPaymentObj.PatientDepositPaymodeList, function (item) {
                        //            $scope.TotalPaymentAmt += parseFloat(item.DepositAmount);
                        //            $scope.SelectedDeposit = true;
                        //        });
                        //        SelectedDepositAmount = $scope.TotalPatientBalanceAmount - $scope.TotalPaymentAmt || 0;
                        //    }
                        //}

                        $scope.mainNMIPaymentRequestObj.PatientDepositPaymodeListId = 0;
                        $scope.mainNMIPaymentRequestObj.PaymentMethodId = 14;
                        $scope.mainNMIPaymentRequestObj.PaymentMethodName = "Patient Deposits";
                        $scope.mainNMIPaymentRequestObj.PaymentAmount = Math.min(SelectedDepositAmount, $scope.mainNMIPaymentRequestObj.PaymentAmount);
                        $scope.mainNMIPaymentRequestObj.ReferenceNumber = '';
                        $scope.mainNMIPaymentRequestObj.IsDepositAdded = false;
                        $scope.mainNMIPaymentRequestObj.DeleteInd = "N";
                        $scope.mainNMIPaymentRequestObj.PatientDepositId = resp.Mainobj.PatientDepositId || 0;
                        $scope.mainNMIPaymentRequestObj.CardNumber = '';
                        $scope.mainNMIPaymentRequestObj.CardType = '';
                        $scope.mainNMIPaymentRequestObj.CardtypeId = 0;
                        $scope.mainNMIPaymentRequestObj.PatientDepositAmt = $scope.PatientDepositDetails.DepositAmount || 0;
                        $scope.mainNMIPaymentRequestObj.PatientDepositDate = $scope.PatientDepositDetails.DepositDate || 0;
                        $scope.mainNMIPaymentRequestObj.DepositNumber = $scope.PatientDepositDetails.DepositNumber || 0;

                        //$scope.mainNMIPaymentRequestObj.NMITransactionId = resp.Mainobj.NMITransactionId || 0;
                        //$scope.mainNMIPaymentRequestObj.OnlineTransactionNumber = resp.Mainobj.TransactionId || 0;
                        //$scope.mainNMIPaymentRequestObj.PaymentProcessTypeId = resp.Mainobj.PaymentProcessTypeId || 0;
                        //$scope.mainNMIPaymentRequestObj.PaymentProcessType = resp.Mainobj.PaymentProcessType || "";
                        //$scope.mainNMIPaymentRequestObj.BillPaymentTypeId = resp.Mainobj.PaymentTypeId;
                        //$scope.mainNMIPaymentRequestObj.BillPaymentType = resp.Mainobj.PaymentType;

                    }
                }

                if (resp == "cancel") {
                    $scope.PaymentMethodObj = angular.copy($scope.GetAllocatePaymentmethodList());
                }

            }, function () {

            });
        };

        $scope.GetOrganizationPOIDeviceList = function () {
            var params = {
                "OrganizationId": $scope.HospitalId,
                "StatusId": 0,
            };
            return eHnotePaymentGatewayService.GetOrganizationPOIDeviceList(params).then(function (resp) {
                $scope.POIDeviceList = [];
                if (resp.data.rows.length > 0) {
                    $scope.POIDeviceList = resp.data.rows || [];
                    $scope.FilterPOIDeviceList = $filter("filter")($scope.POIDeviceList, function (item) {
                        if ($scope.HospitalId === 5 && $scope.ParenthospitalId == 3) {
                            return item.OrganizationId === 5;
                        } else if (($scope.HospitalId === 3 || $scope.HospitalId === 4) && $scope.ParenthospitalId == 3) {
                            return item.OrganizationId === 3 || item.OrganizationId === 4;
                        }
                        else {
                            return true;
                        }

                    }) || [];
                }
            });
        }

        $scope.changeBillingProvider = function (id) {
            var List1 = $filter("filter")($scope.BillingProviderList, function (Pitem,) { return Pitem.OrganizationBillingProviderId === id; }) || [];
            if (List1.length != 0) {
                $scope.mainNMIPaymentRequestObj.BillingProviderId = List1[0].OrganizationBillingProviderId;
                $scope.mainNMIPaymentRequestObj.BillingProviderName = List1[0].BillingProviderName;
            }
        }
        $scope.changeDepositBillingProvider = function (id, item) {
            var List1 = $filter("filter")($scope.BillingProviderList, function (Pitem,) { return Pitem.OrganizationBillingProviderId === id; }) || [];
            if (List1.length != 0) {
                item.BillingProviderId = List1[0].OrganizationBillingProviderId;
                item.BillingProviderName = List1[0].BillingProviderName;
            }
        }

        $scope.ChangePatientDepositType = function (depositId, item) {

            var depositId = parseFloat(depositId) || 0;
            var List1 = $filter("filter")($scope.DepositTypes, function (Pitem,) { return Pitem.DepositTypeId === depositId; }) || [];
            if (List1.length != 0) {
                item.DepositTypeId = List1[0].DepositTypeId;
                item.DepositTypeName = List1[0].DepositTypeName;
            }
        };
        $scope.ChangeDepositType = function (depositId) {

            var depositId = parseFloat(depositId) || 0;
            var List1 = $filter("filter")($scope.DepositTypes, function (Pitem,) { return Pitem.DepositTypeId === depositId; }) || [];
            if (List1.length != 0) {
                $scope.mainNMIPaymentRequestObj.DepositTypeId = List1[0].DepositTypeId;
                $scope.mainNMIPaymentRequestObj.DepositTypeName = List1[0].DepositTypeName;
            }
        };



        $scope.AddDepositLineItem = function () {
            var items = $scope.mainNMIPaymentRequestObj.PatientDepositLineItem;


            angular.forEach($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (ditem) {
                if (ditem.IsEditMode == true) {
                    $scope.CancelEditDepositLineItem(ditem);
                }
            });


            if (items.some(p => !p.DepositAmount)) {
                alertify.error("Please Enter Deposit Amount");
                return false;
            }

            if (items.some(p => !p.PaymentModeId || p.PaymentModeId == 0)) {
                alertify.error("Please Select Payment Mode");
                return false;
            }

            var newPatientDepositObj = $scope.GetPatientDepositsObj();

            // Rendering provider pre-fill
            if ($scope.MainParentobj.ClaimDataObj != null && Object.keys($scope.MainParentobj.ClaimDataObj).length > 0) {
                var filtredRenderArray = $filter("filter")($scope.AllDoctorList, { "DoctorID": $scope.MainParentobj.ClaimDataObj.RenderingProviderId }, true) || [];
                if (filtredRenderArray.length > 0) {
                    newPatientDepositObj.RenderingProviderId = filtredRenderArray[0].DoctorID;
                    newPatientDepositObj.RenderingProviderName = filtredRenderArray[0].UserFullName;
                    newPatientDepositObj.UserBranchId = filtredRenderArray[0].UserBranchId;
                    newPatientDepositObj.RenderingProviderObj = filtredRenderArray[0] || '';
                }
            } else {
                var DoctorObj = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.UserId; })[0];
                if (DoctorObj) {
                    newPatientDepositObj.RenderingProviderId = DoctorObj.DoctorID;
                    newPatientDepositObj.RenderingProviderName = DoctorObj.UserFullName;
                    newPatientDepositObj.UserBranchId = DoctorObj.UserBranchId;
                    newPatientDepositObj.RenderingProviderObj = DoctorObj || '';
                }
            }

            console.log($scope.MainParentobj);

            newPatientDepositObj.PatientDepositId = $scope.MainParentobj.PatientDepositId;
            newPatientDepositObj.PaymentModeId = 0;
            newPatientDepositObj.PaymentMode = '';
            newPatientDepositObj.IsActive = false;

            $scope.mainNMIPaymentRequestObj.PatientDepositLineItem.push(newPatientDepositObj);


            var newIndex = $scope.mainNMIPaymentRequestObj.PatientDepositLineItem.length - 1;

            $scope.isAddingRow = true; // 👈 ADD THIS LINE (main fix)

            $scope.setActiveDepositRow(newIndex);

            $scope.ISShowCardPaymentDetails = false;

            // small delay to reset flag (important)
            setTimeout(function () {
                $scope.isAddingRow = false;
                $scope.$applyAsync();
            }, 0);
            // ✅ IMPORTANT FIX END

            $scope.checkstatusCollectAndSaveButton();
            $scope.RecalculateTotals();
        };

        $scope.paymentCollection = function (item, ditem, index) {

            console.log("opup");
            console.log("Selected Index:", index);

            if (index != "") {
                var selectedItem = ditem[index];

                $scope.mainNMIPaymentRequestObj.PaymentAmount = selectedItem.DepositAmount || 0;
            } else {
                var selectedItem = ditem[0];
                $scope.mainNMIPaymentRequestObj.PaymentAmount = selectedItem.DepositAmount || 0;
            }
            $scope.PatientProfileDetails = $scope.PatientProfileDetails || null;

            var PaymentAmount = parseFloat($scope.mainNMIPaymentRequestObj.PaymentAmount) || 0;
            if (PaymentAmount == 0) {
                alertify.error("Please Enter Payment Amount");
                return false;
            }

            if (selectedItem.HospitalId == 0) {
                alertify.error("Please select Office Location");
                return false;
            };
            selectedItem.BillingProviderId = selectedItem.BillingProviderId || 0;
            if (selectedItem.BillingProviderId == 0) {
                alertify.error("Please select Billing Provider");
                return false;
            };

            //if ($scope.MainParentobj.PaymentTypeId == 2) {
            //    if ($scope.TotalDepositAmount > $scope.MainParentobj.PaymentAmount) {
            //        alertify.error("The Collected Amount exceeds the total payable amount. Please enter a valid amount.");
            //        return false;
            //    }
            //}

            var Obj = {
                "item": item,
                "PatientDepositLineItem": selectedItem,
                "BillingProviderList": $scope.BillingProviderList || [],
                "filteredPaymentModes": $scope.filteredPaymentModes || [],
                "mainNMIPaymentRequestObj": $scope.mainNMIPaymentRequestObj,
                "MainParentobj": $scope.MainParentobj,
                "HospitalId": $scope.HospitalId,
                "Index": index,
                "PatientProfileDetails": $scope.PatientProfileDetails,
            }

            $scope.PaymentPoPUP = $uibModal.open({
                "templateUrl": "paymentCollection.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "right-to-left-modal offcanves-right modal__width--30",
                "resolve": {
                    "Obj": function () { return Obj; }
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, Obj) {
                    Obj = Obj || null;
                    $scope.PatientDepositLineItemObj = Obj.PatientDepositLineItem || null;
                    $scope.mainNMIPaymentRequestObj = Obj.mainNMIPaymentRequestObj;
                    $scope.MainParentobj = Obj.MainParentobj || null;
                    $scope.HospitalId = Obj.HospitalId || 0;
                    $scope.Index = Obj.Index || 0;
                    var PatientProfileDetails = Obj.PatientProfileDetails || null;
                    $scope.ShowCollectpaymetnpaymentPopup = false;
                    $scope.isPaymentInProgress = false;
                    $scope.BillingProviderList = Obj.BillingProviderList || null;
                    $scope.filteredPaymentModes = Obj.filteredPaymentModes || null;

                    $scope.getPatientDepositreqObj = function () {

                        var UITransactionStatus = "Ready"; //If Transaction is ready to submit. 
                        //"Processing"//If Transaction is processing.
                        //"Success" //If Transaction is Success.
                        //"Failure" //If Transaction is Failure.

                        var obj = {
                            "UserId": $scope.MainParentobj.UserId,
                            "HospitalId": 0,
                            "PatientId": $scope.MainParentobj.PatientId,
                            "PatientFullName": "",
                            "PatientFirstName": $scope.MainParentobj.PatientFirstName,
                            "PatientLastName": $scope.MainParentobj.PatientLastName,
                            "PatientEmailId": $scope.MainParentobj.PatientEmailId,
                            "PatientMrno": $scope.MainParentobj.PatientDisplayId,
                            "PatientGender": $scope.MainParentobj.PatientGender,
                            "PatientAgeInYears": $scope.MainParentobj.PatientAgeInYears,
                            "PatientAgeInMonths": $scope.MainParentobj.PatientAgeInMonths,
                            "PatientDOB": $scope.MainParentobj.PatientDOB,
                            "PatientMobileNumber": $scope.MainParentobj.PatientMobileNumber,
                            "NMITransactionId": 0,
                            "PaymentAmount": $scope.MainParentobj.PaymentAmount || 0,
                            "PaymentDate": $filter("date")(new Date(), "MM-dd-yyyy"),
                            "AppointmentId": $scope.MainParentobj.AppointmentId || 0,
                            "VisitId": $scope.MainParentobj.VisitId || 0,
                            "MerchentId": 0,
                            "MerchentName": "",
                            "MerchentKey": "",
                            "PaymentToken": "",
                            "HospitalName": "",
                            "HospitalObj": "",
                            "RenderingProviderId": $scope.RenderingProviderID,
                            "RenderingProviderName": "",
                            "RenderingProviderObj": {
                                // "SecondUserFullName": $scope.RenderingProviderName || ""
                                "SecondUserFullName": ""
                            },
                            "RecievedUserId": 0,
                            "RecievedUserName": "",
                            "RecievedUserObj": {
                                "SecondUserFullName": ""
                            },
                            "PaymentTypeId": $scope.MainParentobj.PaymentTypeId || "",
                            "PaymentType": $scope.MainParentobj.PaymentType || "",
                            "ShowPaymentNote": false,
                            "PaymentNote": "",
                            "PaymentModeId": $scope.MainParentobj.PaymentModeId || 1,
                            "PaymentMode": $scope.MainParentobj.PaymentMode || "Cash",
                            "PaymentProcessTypeId": 0,
                            "PaymentProcessType": "",
                            "TransactionTypeId": 1,
                            "TransactionType": "sale",
                            "TransactionId": "",
                            "UITransactionStatus": UITransactionStatus,
                            "StatusId": 0,
                            "Status": "",
                            "ResponseId": 0,
                            "ResponseCode": "",
                            "ResponseText": "",
                            "DeleteInd": "N",
                            "CardTypeId": "",
                            "CardType": "",
                            "CardHolderName": "",
                            "ChequeNumber": "",
                            "CardNumber": "",
                            "CardExpiry": "",
                            "Cvv": "",
                            "ZipCode": "",
                            "ACHAccountName": "",
                            "ACHABANumber": "",
                            "ACHAccountNumber": "",
                            "PoiDeviceId": "",
                            "CardBillingAddress1": "",
                            "CardBillingAddress2": "",
                            "CardBillingState": "",
                            "CardBillingCity": "",
                            "CardBillingZip": "",
                            "PatientDepositPaymodeListId": 0,
                            "PatientDepositId": 0,
                            "TransactionReceiptNo": "",
                            "DepositTransactionDate": "",
                            "DepositTransactionTime": "",
                            "ProcessorId": "",
                            "ProcessorName": "",
                            "TokenizationKey": "",
                            "PublicCheckOutKey": "",
                            "OrganizationTransactionId": $scope.HospitalId,
                            "OrganizationTransactionName": "",
                            "BillingProviderId": "",
                            "TransactionDate": "",
                            "TransactionTime": "",
                            "DepositTypeId": 0,
                            "DepositTypeName": "",
                            "PatientDepositLineItem": [],
                            "IsDepositPrint": false,
                            "ReferenceNumber": "",
                            "PatientDepositPaymodeList": [],
                        }
                        return obj;
                    };


                    $scope.mainPatientDepositReqObj = angular.copy($scope.getPatientDepositreqObj());

                    $scope.mainPatientDepositReqObj.CardHolderName = PatientProfileDetails.Patient[0].FullName || "";
                    $scope.mainPatientDepositReqObj.PatientFullName = PatientProfileDetails.Patient[0].FullName || "";
                    $scope.mainPatientDepositReqObj.PatientMrno = PatientProfileDetails.Patient[0].PatientDisplayId || "";
                    $scope.mainPatientDepositReqObj.CardBillingAddress1 = PatientProfileDetails.PatientAddress.PostalAddress.AddressLine1 || "";
                    $scope.mainPatientDepositReqObj.CardBillingAddress2 = PatientProfileDetails.PatientAddress.PostalAddress.AddressLine2 || "";
                    $scope.mainPatientDepositReqObj.CardBillingZip = PatientProfileDetails.PatientAddress.PostalAddress.ZipCode || "";
                    $scope.mainPatientDepositReqObj.CardBillingCity = PatientProfileDetails.PatientAddress.PostalAddress.CityName;
                    $scope.mainPatientDepositReqObj.CardBillingState = PatientProfileDetails.PatientAddress.PostalAddress.StateName;




                    $scope.GetPaymentmodeList = function () {
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
                            "CardTypeId": 0,
                            "NMITransactionId": "",
                            "PaymentProcessTypeId": 0,
                            "PaymentProcessType": "",
                            "OnlineTransactionNumber": "",
                            "BillPaymentTypeId": 0,
                            "BillPaymentType": "",
                        }
                        return Obj;
                    }


                    if ($scope.PatientDepositLineItemObj != null || $scope.PatientDepositLineItemObj != undefined) {


                        $scope.mainPatientDepositReqObj.HospitalId = $scope.PatientDepositLineItemObj.HospitalId;
                        $scope.mainPatientDepositReqObj.HospitalName = $scope.PatientDepositLineItemObj.HospitalName;

                        $scope.mainPatientDepositReqObj.HopitalObj = $scope.HopitalObj;
                        $scope.mainPatientDepositReqObj.MerchentId = $scope.PatientDepositLineItemObj.MerchentId;
                        $scope.mainPatientDepositReqObj.ProcessorId = $scope.PatientDepositLineItemObj.ProcessorId;
                        $scope.mainPatientDepositReqObj.ProcessorName = $scope.PatientDepositLineItemObj.ProcessorName;
                        $scope.mainPatientDepositReqObj.TokenizationKey = $scope.PatientDepositLineItemObj.TokenizationKey || '';
                        $scope.mainPatientDepositReqObj.PublicCheckOutKey = $scope.PatientDepositLineItemObj.PublicCheckOutKey || '';
                        $scope.mainPatientDepositReqObj.BillingProviderId = $scope.PatientDepositLineItemObj.BillingProviderId;
                        $scope.mainPatientDepositReqObj.BillingProviderName = $scope.PatientDepositLineItemObj.BillingProviderName;
                        $scope.PatientDepositLineItemObj.RenderingProviderObj = $scope.PatientDepositLineItemObj.RenderingProviderObj || {};
                        if ($scope.PatientDepositLineItemObj.RenderingProviderObj != {}) {
                            $scope.PatientDepositLineItemObj.RenderingProviderObj.SecondUserFullName = $scope.PatientDepositLineItemObj.RenderingProviderObj.SecondUserFullName;
                            $scope.mainPatientDepositReqObj.RenderingProviderName = $scope.PatientDepositLineItemObj.RenderingProviderObj.SecondUserFullName;
                        }
                        $scope.mainPatientDepositReqObj.DepositTypeName = $scope.PatientDepositLineItemObj.DepositTypeName;
                        $scope.mainPatientDepositReqObj.PaymentAmount = $scope.PatientDepositLineItemObj.DepositAmount;
                        $scope.mainPatientDepositReqObj.PaymentModeId = $scope.PatientDepositLineItemObj.PaymentModeId;
                        $scope.mainPatientDepositReqObj.PaymentMode = $scope.PatientDepositLineItemObj.PaymentMode;
                        //$scope.mainPatientDepositReqObj.PaymentNote = $scope.mainNMIPaymentRequestObj.PaymentNote;
                        $scope.mainPatientDepositReqObj.PaymentNote = $scope.PatientDepositLineItemObj.Notes;
                        $scope.mainPatientDepositReqObj.PaymentDate = $scope.mainNMIPaymentRequestObj.PaymentDate;
                        $scope.mainPatientDepositReqObj.RecievedUserId = $scope.mainNMIPaymentRequestObj.RecievedUserId;
                        $scope.mainPatientDepositReqObj.RecievedUserName = $scope.mainNMIPaymentRequestObj.RecievedUserObj.SecondUserFullName;


                        $scope.mainPatientDepositReqObj.DepositTypeId = $scope.PatientDepositLineItemObj.DepositTypeId;
                        $scope.mainPatientDepositReqObj.DepositTypeName = $scope.PatientDepositLineItemObj.DepositTypeName;


                    }

                    $scope.paymentClose = function () {

                        /*   $uibModalInstance.close($scope.mainPatientDepositReqObj, Index);*/
                        if ($scope.mainPatientDepositReqObj.UITransactionStatus == 'Success' || $scope.mainPatientDepositReqObj.UITransactionStatus == 'Failed') {

                            var obj = {
                                "Index": $scope.Index || 0,
                                "mainPatientDepositReqObj": $scope.mainPatientDepositReqObj,
                            }

                            $uibModalInstance.close(obj);
                        }
                        else {
                            $uibModalInstance.close("cancel");
                        }
                        $scope.mainPatientDepositReqObj = angular.copy($scope.getPatientDepositreqObj());
                    };




                    $scope.changePatientPmntProcessingType = function (id) {
                        $scope.mainPatientDepositReqObj.PoiDeviceId = "";
                        $scope.mainPatientDepositReqObj.CardTypeId = "";
                        $scope.mainPatientDepositReqObj.CardType = "";
                        $scope.mainPatientDepositReqObj.CardNumber = "";
                        $scope.mainPatientDepositReqObj.TransactionId = "";
                        if (id === 3) {
                            $scope.mainPatientDepositReqObj.PaymentProcessTypeId = id;
                            $scope.mainPatientDepositReqObj.PaymentProcessType = "Payment Page";
                            setTimeout(function () {
                                $scope.initCollectJS();
                            }, 100);
                        } else if (id == 1) {
                            $scope.mainPatientDepositReqObj.PaymentProcessTypeId = id;
                            $scope.mainPatientDepositReqObj.PaymentProcessType = "Device(EMV)";
                            $scope.GetOrganizationPOIDeviceList();
                        } else if (id == 2) {
                            $scope.mainPatientDepositReqObj.PaymentProcessTypeId = id;
                            $scope.mainPatientDepositReqObj.PaymentProcessType = "Swipe";
                        } else if (id == 4) {
                            $scope.mainPatientDepositReqObj.PaymentProcessTypeId = id;
                            $scope.mainPatientDepositReqObj.PaymentProcessType = "Without Gateway";
                        } else {

                        }
                    };
                    console.log($scope.mainNMIPaymentRequestObj.TokenizationKey);
                    $scope.loadNmiCollectScript($scope.mainNMIPaymentRequestObj.TokenizationKey)
                        .catch(function (e) { console.warn("Collect.js preload:", e); });

                    $scope.changePOIDevicePayment = function (selectedPoiDeviceId) {
                        $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());
                        var selectedItem = $scope.POIDeviceList.find(x => x.PoiDeviceId === selectedPoiDeviceId);
                        $scope.mainNMITransactionObj.MerchentId = selectedItem.NMIMerchantId;
                        $scope.mainNMITransactionObj.MerchentName = selectedItem.MerchantName;
                    }



                    $scope.changePaymentMethod = function (Id) {

                        var List1 = $filter("filter")($scope.filteredPaymentModes, function (Pitem,) { return Pitem.PaymentModeId === Id; }) || [];
                        if (List1.length != 0) {

                            $scope.mainPatientDepositReqObj.PaymentModeId = List1[0].PaymentModeId;
                            $scope.mainPatientDepositReqObj.PaymentMode = List1[0].PaymentModeName;
                        }

                        $scope.mainPatientDepositReqObj.PaymentProcessTypeId = "";

                        if (Id == 14) {
                            $scope.id = Id;
                            /*   $scope.index = index;*/
                            $scope.openDepositsPopup();
                        }

                        $scope.clearCollectJSFields();
                    };



                    $scope.ChangePatientCardType = function (Id) {
                        var filtredArray = $filter("filter")($scope.AllCardTypes, { "CardtypeId": Id }, true) || [];
                        $scope.mainPatientDepositReqObj.CardType = filtredArray[0].CardType || '';
                        $scope.mainPatientDepositReqObj.CardTypeId = filtredArray[0].CardtypeId || 0;
                    };

                    $scope.GetOrganizationPOIDeviceList = function () {
                        var params = {
                            "OrganizationId": $scope.HospitalId,
                            "StatusId": 0,
                        };
                        return eHnotePaymentGatewayService.GetOrganizationPOIDeviceList(params).then(function (resp) {
                            $scope.POIDeviceList = [];
                            if (resp.data.rows.length > 0) {
                                $scope.POIDeviceList = resp.data.rows || [];
                                $scope.FilterPOIDeviceList = $filter("filter")($scope.POIDeviceList, function (item) {
                                    if ($scope.HospitalId === 5 && $scope.ParenthospitalId == 3) {
                                        return item.OrganizationId === 5;
                                    } else if (($scope.HospitalId === 3 || $scope.HospitalId === 4) && $scope.ParenthospitalId == 3) {
                                        return item.OrganizationId === 3 || item.OrganizationId === 4;
                                    }
                                    else {
                                        return true;
                                    }

                                }) || [];
                            }
                        });
                    }



                    $scope.navtoCollectDepositPayment = function (Id) {
                        if ($scope.mainPatientDepositReqObj.PaymentModeId == 2 || $scope.mainPatientDepositReqObj.PaymentModeId == 3 || $scope.mainPatientDepositReqObj.PaymentModeId == 7) {
                            if ($scope.mainPatientDepositReqObj.PaymentProcessTypeId == "") {
                                alertify.error("Please select Receive Via");
                                return false;
                            }
                        }

                        if ($scope.mainPatientDepositReqObj.PaymentModeId == 2 || $scope.mainPatientDepositReqObj.PaymentModeId == 3) {
                            if ($scope.mainPatientDepositReqObj.CardTypeId == 0) {
                                alertify.error("Please select Card Type");
                                return;
                            }
                            if ($scope.mainPatientDepositReqObj.CardNumber == '' || $scope.mainPatientDepositReqObj.CardNumber.trim().length < 4) {
                                alertify.error("Please Enter Card Last 4 digits");
                                return;
                            }
                        }

                        if ($scope.mainPatientDepositReqObj.PaymentModeId == 5) {
                            if ($scope.mainPatientDepositReqObj.ChequeNumber == "") {
                                alertify.error("Please Enter Check Number");
                                return false;
                            }
                        }


                        if (+$scope.mainPatientDepositReqObj.PaymentTypeId === 1) {


                            $scope.mainPatientDepositReqObj.DepositStatusId = 1;
                            $scope.mainPatientDepositReqObj.DepositStatus = "Deposited";
                            $scope.mainPatientDepositReqObj.PaymentTransactionTypeId = 1;
                            $scope.mainPatientDepositReqObj.PaymentTransactionType = "Credit";
                            $scope.mainPatientDepositReqObj.Remarks = "";

                            $scope.AddPaymentModeObj = angular.copy($scope.GetPaymentmodeList());
                            $scope.AddPaymentModeObj.PaymentMethodId = $scope.mainPatientDepositReqObj.PaymentModeId;
                            $scope.AddPaymentModeObj.PaymentMethodName = $scope.mainPatientDepositReqObj.PaymentMode;
                            $scope.AddPaymentModeObj.DepositAmount = $scope.mainPatientDepositReqObj.PaymentAmount || 0;
                            $scope.AddPaymentModeObj.ReferenceNumber = $scope.mainPatientDepositReqObj.TransactionId || "";
                            $scope.AddPaymentModeObj.NMITransactionId = $scope.mainPatientDepositReqObj.NMITransactionId || 0;
                            $scope.AddPaymentModeObj.OnlineTransactionNumber = $scope.mainPatientDepositReqObj.TransactionId || '';
                            $scope.AddPaymentModeObj.PaymentProcessTypeId = $scope.mainPatientDepositReqObj.PaymentProcessTypeId || 0;
                            $scope.AddPaymentModeObj.PaymentProcessType = $scope.mainPatientDepositReqObj.PaymentProcessType || "";
                            $scope.AddPaymentModeObj.CardType = $scope.mainPatientDepositReqObj.CardType || "";
                            $scope.AddPaymentModeObj.CardTypeId = $scope.mainPatientDepositReqObj.CardTypeId || "";
                            $scope.AddPaymentModeObj.CardNumber = $scope.mainPatientDepositReqObj.CardNumber || "";
                            $scope.AddPaymentModeObj.ChequeNumber = $scope.mainPatientDepositReqObj.ChequeNumber || "";
                            $scope.AddPaymentModeObj.BillPaymentTypeId = $scope.mainPatientDepositReqObj.PaymentTypeId;
                            $scope.AddPaymentModeObj.BillPaymentType = $scope.mainPatientDepositReqObj.PaymentType;
                            $scope.AddPaymentModeObj.PaymentTransactionTypeId = $scope.mainPatientDepositReqObj.PaymentTransactionTypeId || 0;
                            $scope.AddPaymentModeObj.PaymentTransactionType = $scope.mainPatientDepositReqObj.PaymentTransactionType || "";
                            $scope.AddPaymentModeObj.Remarks = $scope.mainPatientDepositReqObj.Remarks || "";

                            $scope.navtoAddPatientDeposits($scope.AddPaymentModeObj, $scope.mainPatientDepositReqObj)
                        }
                        else if (+$scope.mainPatientDepositReqObj.PaymentTypeId === 2) {

                            $scope.mainPatientDepositReqObj.DepositStatusId = 1;
                            $scope.mainPatientDepositReqObj.DepositStatus = "Deposited";
                            $scope.mainPatientDepositReqObj.PaymentTransactionTypeId = 1;
                            $scope.mainPatientDepositReqObj.PaymentTransactionType = "Credit";
                            $scope.mainPatientDepositReqObj.Remarks = "";

                            $scope.AddPaymentModeObj = angular.copy($scope.GetAllocatePaymentmethodList());
                            $scope.AddPaymentModeObj.PaymentMethodId = $scope.mainPatientDepositReqObj.PaymentModeId;
                            $scope.AddPaymentModeObj.PaymentMethodName = $scope.mainPatientDepositReqObj.PaymentMode;
                            $scope.AddPaymentModeObj.DepositAmount = $scope.mainPatientDepositReqObj.PaymentAmount || 0;
                            $scope.AddPaymentModeObj.ReferenceNumber = $scope.mainPatientDepositReqObj.TransactionId || "";
                            $scope.AddPaymentModeObj.NMITransactionId = $scope.mainPatientDepositReqObj.NMITransactionId || 0;
                            $scope.AddPaymentModeObj.OnlineTransactionNumber = $scope.mainPatientDepositReqObj.TransactionId || '';
                            $scope.AddPaymentModeObj.PaymentProcessTypeId = $scope.mainPatientDepositReqObj.PaymentProcessTypeId || 0;
                            $scope.AddPaymentModeObj.PatientDepositId = $scope.mainPatientDepositReqObj.PatientDepositId || 0;
                            $scope.AddPaymentModeObj.PaymentProcessType = $scope.mainPatientDepositReqObj.PaymentProcessType || "";
                            $scope.AddPaymentModeObj.CardType = $scope.mainPatientDepositReqObj.CardType || "";
                            $scope.AddPaymentModeObj.CardTypeId = $scope.mainPatientDepositReqObj.CardTypeId || "";
                            $scope.AddPaymentModeObj.CardNumber = $scope.mainPatientDepositReqObj.CardNumber || "";
                            $scope.AddPaymentModeObj.ChequeNumber = $scope.mainPatientDepositReqObj.ChequeNumber || "";
                            $scope.AddPaymentModeObj.BillPaymentTypeId = $scope.mainPatientDepositReqObj.PaymentTypeId;
                            $scope.AddPaymentModeObj.BillPaymentType = $scope.mainPatientDepositReqObj.PaymentType;
                            $scope.AddPaymentModeObj.PaymentTransactionTypeId = $scope.mainPatientDepositReqObj.PaymentTransactionTypeId || 0;
                            $scope.AddPaymentModeObj.PaymentTransactionType = $scope.mainPatientDepositReqObj.PaymentTransactionType || "";
                            $scope.AddPaymentModeObj.Remarks = $scope.mainPatientDepositReqObj.Remarks || "";

                            $scope.navtoAddPatientDeposits($scope.AddPaymentModeObj, $scope.mainPatientDepositReqObj);
                        }
                    }


                    $scope.navtoAddPatientDeposits = function (AddPaymentModeObj, maindepositObj) {


                        var PatientDepositPaymodeList = [];
                        PatientDepositPaymodeList.push(AddPaymentModeObj);


                        var PaymentDate = $filter("date")(maindepositObj.PaymentDate, 'MM-dd-yyyy HH:mm:ss');


                        maindepositObj.DepositAmount = parseFloat(PatientDepositPaymodeList[0].DepositAmount);


                        var obj = {
                            "UserId": $scope.MainParentobj.UserId,
                            "PatientDepositId": 0,
                            "PatientId": $scope.MainParentobj.PatientId || 0,
                            "ReceiptNo": "",
                            "ReceiptId": 0,
                            "DepositDate": $filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss'),
                            "PaymentDate": PaymentDate,
                            "DepositAmount": maindepositObj.DepositAmount || 0,
                            "DepositedByUserId": maindepositObj.RecievedUserId,
                            "DepositedBy": maindepositObj.RecievedUserName,
                            "UnBilledAmount": maindepositObj.DepositAmount,
                            "BilledAmount": 0,
                            "DeleteInd": "N",
                            "AppointmentId": $scope.MainParentobj.AppointmentId,
                            "BillingProviderId": $scope.mainPatientDepositReqObj.BillingProviderId,
                            "PaymentMethodId": maindepositObj.PaymentModeId,
                            "PaymentMethodName": maindepositObj.PaymentMode,
                            //  "ChequeNumber": maindepositObj.ChequeNumber,
                            "ChequeNumber": maindepositObj.ChequeNumber || "",
                            "CardNumber": maindepositObj.CardNumber,
                            "OnlineTransactionNumber": maindepositObj.TransactionId || "",
                            "NMITransactionId": maindepositObj.NMITransactionId || 0,
                            "CardName": "",
                            "CardExpiry": "",
                            "Notes": $scope.mainPatientDepositReqObj.PaymentNote,
                            "BatchNumber": $scope.MainParentobj.BatchNumber || "",
                            "OrganizationFacilityId": maindepositObj.HospitalId,
                            "FacilityName": maindepositObj.HospitalName,
                            "IsConsent": false,
                            "IsDepositPrint": $scope.MainParentobj.IsDepositPrint,
                            "IsEmail": false,
                            "DepositStatusId": maindepositObj.DepositStatusId || 1,
                            "DepositStatus": maindepositObj.DepositStatus || 'Deposited',
                            "PageSize": 10,
                            "PageNumber": 1,
                            "PatientDepositPaymodeList": PatientDepositPaymodeList || [],
                            "RenderingProviderId": $scope.mainPatientDepositReqObj.RenderingProviderId || 0,
                            "DepositTypeId": $scope.mainPatientDepositReqObj.DepositTypeId,
                            "DepositType": $scope.mainPatientDepositReqObj.DepositTypeName,
                            "PaymentTransactionTypeId": maindepositObj.PaymentTransactionTypeId || 1,
                            "PaymentTransactionType": maindepositObj.PaymentTransactionType || 'Credit',
                            "OrganizationTransactionId": $scope.mainPatientDepositReqObj.OrganizationTransactionId,
                            "OrganizationTransactionName": $scope.mainPatientDepositReqObj.OrganizationTransactionName,
                            "OrganizationId": $scope.mainPatientDepositReqObj.HospitalId,
                            "OrganizationName": $scope.mainPatientDepositReqObj.HospitalName,
                            "Remarks": $scope.mainPatientDepositReqObj.Remarks || "",
                            "RecievedUserId": $scope.mainPatientDepositReqObj.RecievedUserId || "",
                            "RecievedUserName": $scope.mainPatientDepositReqObj.RecievedUserName || "",
                        };
                        eHnoteInsuranceService.AddUpdatePatientDepositAmount(obj).then(function (resp) {
                            if (resp.data.Status === "Success") {
                                $scope.mainPatientDepositReqObj.UITransactionStatus = resp.data.Status;
                                //$scope.mainPatientDepositReqObj.ResponseText = resp.data.Status;

                                if ($scope.mainPatientDepositReqObj.PaymentTransactionType == "Failed") {
                                    alertify.error("Deposit Transaction Failed");
                                } else {
                                    if (obj.PatientDepositId === 0 || obj.PatientDepositId === null) {
                                        alertify.success("Added Successfully");
                                    } else {
                                        alertify.success("Updated Successfully");
                                    }
                                }
                                $scope.ShowCollectpaymetnpaymentPopup = true;

                                $scope.DepositTransactionData = resp.data;
                                $scope.mainPatientDepositReqObj.TransactionReceiptNo = $scope.DepositTransactionData.TransReciptNo || '';
                                $scope.mainPatientDepositReqObj.DepositTransactionDate = $scope.DepositTransactionData.DepositTransaction[0].TransactionDate || '';
                                $scope.mainPatientDepositReqObj.TransactionDate = $scope.DepositTransactionData.DepositTransaction[0].TransactionDate || '';
                                $scope.mainPatientDepositReqObj.TransactionTime = $scope.DepositTransactionData.DepositTransaction[0].TransactionTime || '';
                                $scope.mainPatientDepositReqObj.ReceiptNo = $scope.DepositTransactionData.ReceiptNo || '';
                                $scope.mainPatientDepositReqObj.ReferenceNumber = $scope.DepositTransactionData.PatientDepositPaymodeList[0].ReferenceNumber || '';

                                $scope.mainPatientDepositReqObj.PatientDepositPaymodeList = resp.data.PatientDepositPaymodeList || [];

                            } else {
                                alertify.error(resp.data.Message);
                            }
                        });




                    }


                    $scope.DepositTransactionPrintrecept = function () {
                        $scope.DepositTransactionData = $scope.DepositTransactionData || null;
                        $scope.PatientDepositPaymodeListData = $scope.PatientDepositPaymodeListData || null;
                        $scope.AddTransactionPrint($scope.DepositTransactionData, $scope.PatientDepositPaymodeListData);
                    }

                    $scope.AddTransactionPrint = function (item, pitem) {
                        item.DepositTransaction = item.DepositTransaction || [];
                        if (item.DepositTransaction.length > 0) {
                            $scope.DepositTransactionObj.PatientFullName = item.PatientFullName || '';
                            $scope.DepositTransactionObj.PatientDisplayId = item.PatientDisplayId || '';
                            $scope.DepositTransactionObj.TransactionDate = item.DepositTransaction[0].TransactionDate || '';
                            $scope.DepositTransactionObj.TransactionTime = item.DepositTransaction[0].TransactionTime || '';
                            $scope.DepositTransactionObj.TransReciptNo = item.DepositTransaction[0].TransReciptNo || '';
                            $scope.DepositTransactionObj.PaymentMethodName = item.PatientDepositPaymodeList[0].PaymentMethodName || '';
                            $scope.DepositTransactionObj.CardNumber = item.PatientDepositPaymodeList[0].CardNumber || '';
                            $scope.DepositTransactionObj.ChequeNumber = item.PatientDepositPaymodeList[0].ChequeNumber || '';
                            $scope.DepositTransactionObj.CardType = item.PatientDepositPaymodeList[0].CardType || '';
                            $scope.DepositTransactionObj.OnlineTransactionNumber = item.PatientDepositPaymodeList[0].OnlineTransactionNumber || '';
                            $scope.DepositTransactionObj.ReferenceNumber = item.PatientDepositPaymodeList[0].ReferenceNumber || '';
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
                        } else if (item.length > 0) {


                            $scope.DepositTransactionObj.PatientFullName = $scope.mainPatientDepositReqObj.PatientFullName || '';
                            $scope.DepositTransactionObj.PatientDisplayId = $scope.mainPatientDepositReqObj.PatientMrno || '';

                            $scope.DepositTransactionObj.TransactionDate = item[0].TransactionDate || '';
                            $scope.DepositTransactionObj.TransactionTime = item[0].TransactionTime || '';
                            $scope.DepositTransactionObj.TransReciptNo = item[0].TransReciptNo || '';
                            //$scope.DepositTransactionObj.PaymentMethodName = item[0].PaymentMethodName || '';
                            $scope.DepositTransactionObj.PaymentMethodName = item[0].PaymentMethod || '';
                            $scope.DepositTransactionObj.CardNumber = pitem[0].CardNumber || '';
                            $scope.DepositTransactionObj.ChequeNumber = pitem[0].ChequeNumber || '';
                            $scope.DepositTransactionObj.CardType = pitem[0].CardType || '';
                            $scope.DepositTransactionObj.OnlineTransactionNumber = pitem[0].OnlineTransactionNumber || '';
                            $scope.DepositTransactionObj.ReferenceNumber = pitem[0].ReferenceNumber || '';
                            $scope.DepositTransactionObj.TransactionAmount = pitem[0].DepositAmount || '';
                            $scope.DepositTransactionObj.ReceiptNumber = $scope.mainPatientDepositReqObj.ReceiptNo || '';
                            $scope.DepositTransactionObj.OrganizationName = item[0].OrganizationName || '';

                            var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": item[0].OrganizationId }, true) || [];
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

                        $scope.printPatientDeposit();

                    }
                    $scope.printPatientDeposit = function () {

                        $timeout(function () {
                            var innerContents = document.getElementById('PrintDepsoitTransPopupNew').innerHTML;
                            var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                            popupWinindow.document.open();
                            popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                            popupWinindow.document.close();
                        }, 1000);
                    }


                    $scope.navtoDepositOnlinePaymentGateway = function (item) {
                        if ($scope.mainPatientDepositReqObj.PaymentProcessTypeId == 3) {
                            if (!window.CollectJS) {
                                alert("Payment Gateway not loaded");
                                return;
                            }

                            if ($scope.isPaymentInProgress) {
                                alertify.error("Transaction already in progress. Please wait.");
                                return;
                            }


                            console.log($scope.ccValitationobj);

                            if ($scope.mainPatientDepositReqObj.PaymentModeId === 2 || $scope.mainPatientDepositReqObj.PaymentModeId === 3) {
                                if (!$scope.ccValitationobj.ccnumbervalid || !$scope.ccValitationobj.cccvv || !$scope.ccValitationobj.ccexpiry) {
                                    alertify.error("Please Enter the required fields");
                                    return false;
                                }
                            }
                            if ($scope.mainPatientDepositReqObj.PaymentModeId === 7) {
                                if (!$scope.ccValitationobj.checkaccountvalid || !$scope.ccValitationobj.checkroutingnovalid || !$scope.ccValitationobj.checknamevalid) {
                                    alertify.error("Please Enter the required fields");
                                    return false;
                                }
                            }

                            if ($scope.mainPatientDepositReqObj.CardBillingZip == "") {
                                alertify.error("Please select Zip Code");
                                return false;
                            };

                            $scope.isPaymentInProgress = true;
                            $("#maineHnoteLoader").show();
                            CollectJS.startPaymentRequest(event);
                        }
                        else if ($scope.mainPatientDepositReqObj.PaymentProcessTypeId == 1) {
                            var PoiDeviceId = $scope.mainPatientDepositReqObj.PoiDeviceId || "";
                            if ($scope.mainPatientDepositReqObj.PaymentProcessTypeId == 1) {
                                if (PoiDeviceId == "") {
                                    alertify.error("Please select PoiDevice");
                                    return false;
                                };
                            }
                            $scope.coninueprocessonlineNMIPayment("", $scope.mainPatientDepositReqObj);

                        }
                    };

                    $scope.initCollectJS = function () {

                        if (window.CollectJS) {
                            let fields = {};
                            const paymenttype = "";
                            if ($scope.mainPatientDepositReqObj.PaymentModeId === 2 || $scope.mainPatientDepositReqObj.PaymentModeId === 3) {

                                fields = {
                                    ccnumber: {
                                        selector: "#nmi-ccnumber",
                                        placeholder: "0000 0000 0000 0000",
                                        display: "required",
                                    },
                                    ccexp: {
                                        selector: "#nmi-exp",
                                        placeholder: "MM/YY",
                                        display: "required",
                                    },
                                    cvv: {
                                        selector: "#nmi-cvv",
                                        placeholder: "***",
                                        display: "required"
                                    }
                                };
                            }
                            else if ($scope.mainPatientDepositReqObj.PaymentModeId === 7) {

                                fields = {
                                    checkaccount: {
                                        selector: "#nmi-chkacctnumber",
                                        placeholder: "Account Number"
                                    },
                                    checkaba: {
                                        selector: "#nmi-checkaba",
                                        placeholder: "Routing Number"
                                    },
                                    checkname: {
                                        selector: "#nmi-checkname",
                                        placeholder: "Name on Account"
                                    }
                                };
                            }

                            CollectJS.configure({
                                variant: "inline",
                                currency: "USD",
                                country: "US",
                                price: $scope.mainPatientDepositReqObj.PaymentAmount,
                                fields: fields,
                                validationCallback: function (field, status, message) {

                                    if ($scope.mainPatientDepositReqObj.PaymentProcessTypeId == 3 && ($scope.mainPatientDepositReqObj.PaymentModeId == 2 || $scope.mainPatientDepositReqObj.PaymentModeId == 3)) {
                                        if (field === 'ccnumber') {
                                            if (status) {
                                                $scope.ccValitationobj.ccnumbervalid = true;
                                            } else {
                                                $scope.ccValitationobj.ccnumbervalid = false;
                                                alertify.error(message);
                                            }
                                        }
                                        if (field === 'cvv') {
                                            if (status) {
                                                $scope.ccValitationobj.cccvv = true;
                                            } else {
                                                $scope.ccValitationobj.cccvv = false;
                                                alertify.error(message);
                                            }
                                        }
                                        if (field === 'ccexp') {
                                            if (status) {
                                                $scope.ccValitationobj.ccexpiry = true;
                                            } else {
                                                $scope.ccValitationobj.ccexpiry = false;
                                                alertify.error(message);
                                            }
                                        }
                                    }


                                    if ($scope.mainPatientDepositReqObj.PaymentProcessTypeId == 3 && $scope.mainPatientDepositReqObj.PaymentModeId == 7) {
                                        if (field === 'checkaccount') {
                                            if (status) {
                                                $scope.ccValitationobj.checkaccountvalid = true;
                                            } else {
                                                $scope.ccValitationobj.checkaccountvalid = false;
                                                alertify.error(message);
                                            }
                                        }
                                        if (field === 'checkaba') {
                                            if (status) {
                                                $scope.ccValitationobj.checkroutingnovalid = true;
                                            } else {
                                                $scope.ccValitationobj.checkroutingnovalid = false;
                                                alertify.error(message);
                                            }
                                        }
                                        if (field === 'checkname') {
                                            if (status) {
                                                $scope.ccValitationobj.checknamevalid = true;
                                            } else {
                                                $scope.ccValitationobj.checknamevalid = false;
                                                alertify.error(message);
                                            }
                                        }
                                    }

                                },
                                callback: function (response) {
                                    $scope.$apply(function () {

                                        console.log(response);
                                        $scope.isPaymentInProgress = false;
                                        $("#maineHnoteLoader").hide();
                                        $scope.tokenResponse = response;

                                        if ($scope.mainPatientDepositReqObj.PaymentModeId === 2 || $scope.mainPatientDepositReqObj.PaymentModeId === 3) {
                                            if (response.card && response.card.type) {
                                                switch (response.card.type.toLowerCase()) {
                                                    case 'visa':
                                                        $scope.mainPatientDepositReqObj.CardTypeId = 1;
                                                        break;
                                                    case 'mastercard':
                                                        $scope.mainPatientDepositReqObj.CardTypeId = 2;
                                                        break;
                                                    case 'amex':
                                                        $scope.mainPatientDepositReqObj.CardTypeId = 3;
                                                        break;
                                                    default:
                                                        $scope.mainPatientDepositReqObj.CardTypeId = 0;
                                                }
                                            } else {
                                                $scope.mainPatientDepositReqObj.CardTypeId = 0;
                                            }

                                            $scope.mainPatientDepositReqObj.CardNumber = response.card.number.slice(-4);
                                            $scope.mainPatientDepositReqObj.CardType = response.card.type;
                                        } else if ($scope.mainPatientDepositReqObj.PaymentModeId === 7) {
                                            console.log(response.check);
                                            //response.check.aba
                                            //response.check.account
                                            //response.check.hash
                                            //response.check.institution
                                            //response.check.name
                                            //response.check.transit

                                        }

                                        $scope.coninueprocessonlineNMIPayment(response.token, $scope.mainPatientDepositReqObj);
                                        //$scope.coninueprocessinlineOnlinePayment(response.token, $scope.mainPatientDepositReqObj);
                                    });
                                },
                                timeoutCallback: function () {
                                    alert("Tokenization timed out.");
                                    $scope.$apply(function () { $scope.isPaymentInProgress = false; });
                                    $("#maineHnoteLoader").hide();
                                },
                                fieldsAvailableCallback: function () {
                                    console.log("Fields loaded.");
                                    $("#maineHnoteLoader").hide();
                                }
                            });
                        } else {
                            console.error("CollectJS not loaded.");
                            $("#maineHnoteLoader").hide();
                        }
                    };

                    setTimeout($scope.initCollectJS, 500);


                    $scope.coninueprocessonlineNMIPayment = function (paymentToken, pitem) {
                        paymentToken = paymentToken || "";

                        var orderdescription = $scope.mainPatientDepositReqObj.PatientFirstName + " Payment" + $scope.mainPatientDepositReqObj.PaymentAmount + " for " + $scope.mainPatientDepositReqObj.PaymentType + " on " + $scope.mainPatientDepositReqObj.PaymentDate;

                        $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());

                        $scope.AddPaymentModeObj = angular.copy($scope.GetPaymentmodeList());
                        $scope.AddPaymentModeObj.PaymentMethodId = $scope.mainPatientDepositReqObj.PaymentModeId;
                        $scope.AddPaymentModeObj.PaymentMethodName = $scope.mainPatientDepositReqObj.PaymentMode;
                        $scope.AddPaymentModeObj.DepositAmount = $scope.mainPatientDepositReqObj.PaymentAmount || 0;
                        $scope.AddPaymentModeObj.ReferenceNumber = '';
                        $scope.AddPaymentModeObj.NMITransactionId = 0;
                        $scope.AddPaymentModeObj.OnlineTransactionNumber = '';
                        $scope.AddPaymentModeObj.PaymentProcessTypeId = $scope.mainPatientDepositReqObj.PaymentProcessTypeId || 0;
                        $scope.AddPaymentModeObj.PaymentProcessType = $scope.mainPatientDepositReqObj.PaymentProcessType || "";
                        $scope.AddPaymentModeObj.CardType = $scope.mainPatientDepositReqObj.CardType || "";
                        $scope.AddPaymentModeObj.CardTypeId = $scope.mainPatientDepositReqObj.CardTypeId || "";
                        $scope.AddPaymentModeObj.CardNumber = $scope.mainPatientDepositReqObj.CardNumber || "";
                        $scope.AddPaymentModeObj.ChequeNumber = $scope.mainPatientDepositReqObj.ChequeNumber || "";
                        $scope.AddPaymentModeObj.BillPaymentTypeId = $scope.mainPatientDepositReqObj.PaymentTypeId;
                        $scope.AddPaymentModeObj.BillPaymentType = $scope.mainPatientDepositReqObj.PaymentType;
                        $scope.AddPaymentModeObj.PaymentTransactionTypeId = 1;
                        $scope.AddPaymentModeObj.PaymentTransactionType = "Credit";
                        $scope.AddPaymentModeObj.Remarks = "";

                        $scope.PatientDepositLineItemObj.PatientDepositPaymodeList = [];
                        $scope.PatientDepositLineItemObj.PatientDepositPaymodeList.push($scope.AddPaymentModeObj);
                        $scope.PatientDepositLineItemObj.DepositedByUserId = $scope.mainPatientDepositReqObj.RecievedUserId;
                        $scope.PatientDepositLineItemObj.DepositedBy = $scope.mainPatientDepositReqObj.RecievedUserName;
                        $scope.PatientDepositLineItemObj.UnBilledAmount = $scope.mainPatientDepositReqObj.PaymentAmount;

                        $scope.mainNMITransactionObj.NMITransactionId = 0;
                        $scope.mainNMITransactionObj.UserId = $scope.mainPatientDepositReqObj.RecievedUserId;
                        $scope.mainNMITransactionObj.PatientId = $scope.mainPatientDepositReqObj.PatientId;
                        $scope.mainNMITransactionObj.OrganizationId = $scope.mainPatientDepositReqObj.HospitalId;
                        $scope.mainNMITransactionObj.PaymentAmount = $scope.mainPatientDepositReqObj.PaymentAmount;
                        $scope.mainNMITransactionObj.MerchentId = $scope.mainPatientDepositReqObj.MerchentId;
                        $scope.mainNMITransactionObj.MerchentName = $scope.mainPatientDepositReqObj.MerchentName;
                        $scope.mainNMITransactionObj.PaymentToken = paymentToken;
                        $scope.mainNMITransactionObj.CardHolderName = $scope.mainPatientDepositReqObj.CardHolderName || "";
                        $scope.mainNMITransactionObj.PatientEmail = $scope.mainPatientDepositReqObj.PatientEmailId || "";
                        $scope.mainNMITransactionObj.PatientMobile = $scope.mainPatientDepositReqObj.PatientMobileNumber || "";
                        $scope.mainNMITransactionObj.PatientMrNo = $scope.mainPatientDepositReqObj.PatientMrNo || "";

                        $scope.mainNMITransactionObj.CardBillingAddress1 = $scope.mainPatientDepositReqObj.CardBillingAddress1 || "";
                        $scope.mainNMITransactionObj.CardBillingAddress2 = $scope.mainPatientDepositReqObj.CardBillingAddress2 || "";
                        $scope.mainNMITransactionObj.CardBillingState = $scope.mainPatientDepositReqObj.CardBillingState || "";
                        $scope.mainNMITransactionObj.CardBillingCity = $scope.mainPatientDepositReqObj.CardBillingCity || "";
                        $scope.mainNMITransactionObj.CardBillingZip = $scope.mainPatientDepositReqObj.CardBillingZip || "";

                        $scope.mainNMITransactionObj.ProcessorId = $scope.mainPatientDepositReqObj.ProcessorId || "";
                        $scope.mainNMITransactionObj.ProcessorName = $scope.mainPatientDepositReqObj.ProcessorName || "";
                        $scope.mainNMITransactionObj.TokenizationKey = $scope.mainPatientDepositReqObj.TokenizationKey || "";
                        $scope.mainNMITransactionObj.PublicCheckOutKey = $scope.mainPatientDepositReqObj.PublicCheckOutKey || "";
                        $scope.mainNMITransactionObj.OrderId = "";
                        $scope.mainNMITransactionObj.OrderDescription = orderdescription;
                        $scope.mainNMITransactionObj.TransactionId = 0;
                        $scope.mainNMITransactionObj.ResponseId = 0;
                        $scope.mainNMITransactionObj.ResponseCode = "";
                        $scope.mainNMITransactionObj.ResponseText = "";
                        $scope.mainNMITransactionObj.Status = "";
                        $scope.mainNMITransactionObj.TransactionTypeId = $scope.mainPatientDepositReqObj.TransactionTypeId;
                        $scope.mainNMITransactionObj.TransactionType = $scope.mainPatientDepositReqObj.TransactionType;
                        $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.mainPatientDepositReqObj.PaymentTypeId;
                        $scope.mainNMITransactionObj.BillPaymentType = $scope.mainPatientDepositReqObj.PaymentType;
                        $scope.mainNMITransactionObj.DeleteInd = "N";
                        $scope.mainNMITransactionObj.Type = $scope.mainPatientDepositReqObj.TransactionType;
                        $scope.mainNMITransactionObj.AppointmentId = $scope.mainPatientDepositReqObj.AppointmentId;
                        $scope.mainNMITransactionObj.VisitId = $scope.mainPatientDepositReqObj.VisitId;
                        $scope.mainNMITransactionObj.PaymentType = $scope.mainPatientDepositReqObj.PaymentModeId == 2 ? 'creditcard' :
                            $scope.mainPatientDepositReqObj.PaymentModeId == 7 ? 'check' :
                                'creditcard';
                        if ($scope.mainPatientDepositReqObj.PaymentProcessTypeId == 1) {
                            $scope.mainNMITransactionObj.ResponseMethod = "synchronous";
                        } else {
                            $scope.mainNMITransactionObj.ResponseMethod = "";
                        }

                        $scope.mainNMITransactionObj.PoiDeviceId = $scope.mainPatientDepositReqObj.PoiDeviceId || "";
                        $scope.mainNMITransactionObj.PaymentProcessTypeId = $scope.mainPatientDepositReqObj.PaymentProcessTypeId || 0;
                        $scope.mainNMITransactionObj.PaymentProcessType = $scope.mainPatientDepositReqObj.PaymentProcessType || "";

                        $scope.mainNMITransactionObj.PaymentModeId = $scope.mainPatientDepositReqObj.PaymentModeId;
                        $scope.mainNMITransactionObj.PaymentMode = $scope.mainPatientDepositReqObj.PaymentMode;
                        $scope.mainNMITransactionObj.CardNumber = $scope.mainPatientDepositReqObj.CardNumber;
                        $scope.mainNMITransactionObj.CardTypeId = $scope.mainPatientDepositReqObj.CardTypeId;
                        $scope.mainNMITransactionObj.CardType = $scope.mainPatientDepositReqObj.CardType;

                        $scope.PatientDepositLineItemObj.PaymentMethodId = $scope.mainPatientDepositReqObj.PaymentModeId;
                        $scope.PatientDepositLineItemObj.PaymentMethodName = $scope.mainPatientDepositReqObj.PaymentMode;
                        $scope.PatientDepositLineItemObj.Notes = $scope.mainPatientDepositReqObj.PaymentNote;
                        $scope.PatientDepositLineItemObj.CardNumber = $scope.mainPatientDepositReqObj.CardNumber;
                        $scope.PatientDepositLineItemObj.CardTypeId = $scope.mainPatientDepositReqObj.CardTypeId;
                        $scope.PatientDepositLineItemObj.CardType = $scope.mainPatientDepositReqObj.CardType;
                        $scope.PatientDepositLineItemObj.OrganizationId = $scope.mainPatientDepositReqObj.HospitalId;
                        $scope.PatientDepositLineItemObj.OrganizationName = $scope.mainPatientDepositReqObj.HospitalName;
                        $scope.PatientDepositLineItemObj.OrganizationTransactionName = $scope.mainNMIPaymentRequestObj.OrganizationTransactionName;
                        /*    $scope.PatientDepositLineItemObj.HospitalId = $scope.mainPatientDepositReqObj.HospitalId;*/
                        $scope.mainPatientDepositReqObj.PatientDepositLineItem.push($scope.PatientDepositLineItemObj);

                        $scope.mainNMITransactionObj.PatientDeposits = $scope.mainPatientDepositReqObj.PatientDepositLineItem || [];

                        eHnotePaymentGatewayService.PaymentProcessandAddDeposit($scope.mainNMITransactionObj).then(function (resp) {

                            console.log(JSON.stringify(resp));
                            var res = resp.data || {};
                            $scope.mainNMITransactionObj.ResponseText = res.NMITransactionResponse.ResponseText;
                            $scope.mainPatientDepositReqObj.ResponseText = $scope.mainNMITransactionObj.ResponseText;
                            res.ResponseId = parseInt(res.NMITransactionResponse.ResponseId || 0);

                            if (res.NMITransactionResponse.ResponseId === 1) {
                                if (res.DepositInsertResults[0].Status == 'Success') {
                                    alertify.success(res.NMITransactionResponse.ResponseText);
                                    $scope.mainPatientDepositReqObj.UITransactionStatus = 'Success';
                                } else {
                                    alertify.error(res.DepositInsertResults[0].Status);
                                    $scope.mainPatientDepositReqObj.UITransactionStatus = 'Failed';
                                }


                            } else if (res.NMITransactionResponse.ResponseId === 2) {
                                alertify.error(res.NMITransactionResponse.ResponseText);
                                $scope.mainPatientDepositReqObj.UITransactionStatus = 'Failed';
                            } else {
                                alertify.error(res.NMITransactionResponse.ResponseText);
                                $scope.mainPatientDepositReqObj.UITransactionStatus = 'Failed';
                            }

                            $scope.ShowCollectpaymetnpaymentPopup = true;

                            if (resp.data.DepositInsertResults[0].DepositTransaction.length > 0) {

                                $scope.DepositTransactionData = resp.data.DepositInsertResults[0].DepositTransaction;
                                $scope.PatientDepositPaymodeListData = resp.data.DepositInsertResults[0].PatientDepositPaymodeList;

                                $scope.mainPatientDepositReqObj.NMITransactionId = $scope.PatientDepositPaymodeListData[0].NMITransactionId;
                                $scope.mainPatientDepositReqObj.TransactionId = $scope.DepositTransactionData[0].TransactionId;
                                $scope.mainPatientDepositReqObj.OnlineTransactionNumber = $scope.DepositTransactionData[0].OnlineTransactionNumber;
                                $scope.mainPatientDepositReqObj.TransactionReceiptNo = $scope.DepositTransactionData[0].TransReciptNo || '';
                                $scope.mainPatientDepositReqObj.DepositTransactionDate = $scope.DepositTransactionData[0].TransactionDate || '';
                                $scope.mainPatientDepositReqObj.TransactionDate = $scope.DepositTransactionData[0].TransactionDate || '';
                                $scope.mainPatientDepositReqObj.TransactionTime = $scope.DepositTransactionData[0].TransactionTime || '';
                                $scope.mainPatientDepositReqObj.ReceiptNo = resp.data.DepositInsertResults[0].ReceiptNo || '';
                                $scope.mainPatientDepositReqObj.ReferenceNumber = $scope.PatientDepositPaymodeListData[0].ReferenceNumber || '';
                                $scope.mainPatientDepositReqObj.PatientDepositPaymodeList = $scope.PatientDepositPaymodeListData || [];

                            }


                            /*   alertify.error(resp.data.Message);*/





                        });

                    };



                }
            });
            $scope.PaymentPoPUP.result.then(function (resp) {

                resp = resp || null;

                /*  $scope.getPatientDepositAmountById();*/
                $scope.getPatientDepositById();

                if (resp != 'cancel') {

                    $scope.DepositLineItemIndex = resp.Index || 0;
                    $scope.DepositPaymentObj = resp.mainPatientDepositReqObj || {};

                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem = $scope.mainNMIPaymentRequestObj.PatientDepositLineItem || [];

                    // Assign Status to selected row
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].Status = $scope.DepositPaymentObj.UITransactionStatus || '';
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].IsDepositLineItemDisabled = true;


                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].CardType = $scope.DepositPaymentObj.CardType;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].CardNumber = $scope.DepositPaymentObj.CardNumber;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].NMITransactionId = $scope.DepositPaymentObj.NMITransactionId;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].TransactionReceiptNo = $scope.DepositPaymentObj.TransactionReceiptNo;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].TransactionId = $scope.DepositPaymentObj.TransactionId;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].TransactionDate = $scope.DepositPaymentObj.TransactionDate;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].TransactionTime = $scope.DepositPaymentObj.TransactionTime;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].OrganizationName = $scope.DepositPaymentObj.HospitalName;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].OrganizationId = $scope.DepositPaymentObj.HospitalId;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].ChequeNumber = $scope.DepositPaymentObj.ChequeNumber;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].ReceiptNo = $scope.DepositPaymentObj.ReceiptNo;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].PatientDepositPaymodeList = $scope.DepositPaymentObj.PatientDepositPaymodeList || [];
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].PatientDepositId = $scope.DepositPaymentObj.PatientDepositPaymodeList[0].PatientDepositId || 0;
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].IsShoweachDepositNotes = false;
                    $scope.DepositPaymentObj.PatientDepositPaymodeList[0].ReceiptNo = $scope.DepositPaymentObj.PatientDepositPaymodeList[0].ReceiptNo || '';
                    $scope.DepositPaymentObj.PatientDepositPaymodeList[0].ReceiptNo = $scope.DepositPaymentObj.ReceiptNo;
                    $scope.PatientDepositPaymodeList.push(
                        ...($scope.DepositPaymentObj.PatientDepositPaymodeList || [])
                    );

                    $scope.IsShowDepositFields = true;

                }



                //"ResponseText": "",
                //"Status": "",

            }, function () {

            });
        };


        $scope.navtoEditDepositNotes = function (item, index) {
            item = item || null;



        }

        $scope.UpdatePatientDepositNotes = function (item) {


            item = item || null


            var obj = {
                "UserId": $scope.UserId,
                "PatientDepositId": item.PatientDepositId,
                "Notes": item.Notes,
            };
            eHnoteInsuranceService.UpdatePatientDepositNotes(obj).then(function (resp) {
                if (resp.data.Status === "Success") {
                    if (obj.PatientDepositId === 0 || obj.PatientDepositId === null) {
                        alertify.success("Added Successfully");
                    } else {
                        alertify.success("Updated Successfully");
                    }
                    $scope.ShowCollectpaymetnpaymentPopup = true;

                } else {
                    alertify.error(resp.data.Message);
                }
            });

        }


        $scope.getPatientDepositAmountById = function () {
            var obj = {
                "DepositFrom": "",
                "DepositTo": "",
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
                            if (item.UnBilledAmount >= 0) {
                                $scope.PatientTotalUnallocated += item.UnBilledAmount;
                            }
                        });

                    }
                    $scope.PtDepositsDataArray = [];
                    $scope.PtDepositsDataArray = $scope.PatientDepositsListArray.filter(item => item.DepositStatusId != 2);

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }


        $scope.getPatientDepositById = function () {
            $scope.PatientDepositsListArray = [];
            var obj = {
                "DepositFrom": "",
                "DepositTo": "",
                "PatientId": $scope.SearchPatientDepositsObj.PatientId,
                "OrganizationId": $scope.SearchPatientDepositsObj.OrganizationId,
                "PaymentModeId": 0,
                "PageSize": 10,
                "PageNumber": 1,
                "TransactionNumber": "",
                "SortBy": "Asc",
                "SearchType": "Deposit"
            };

            eHnoteInsuranceService.GetAllPatientDeposits(obj).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.PatientDepositsListArray = resp.data.rows || [];

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }


        $scope.DeletePatientDepositLineItem = function (index, item) {
            item.PatientDepositId = item.PatientDepositId || 0;
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                if (item.PatientDepositId != 0) {
                    item.DeleteInd = "Y";

                    if (item.PatientDepositPaymodeListId === 0) {
                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem.splice(index, 1);
                    }
                } else {
                    $scope.mainNMIPaymentRequestObj.PatientDepositLineItem.splice(index, 1);

                    if ($scope.mainNMIPaymentRequestObj.PatientDepositLineItem.length > 0) {
                        $scope.patientDepositAmnt = 0;
                        $scope.TotalDepositPaymentAmount = 0;
                        angular.forEach($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (aitem) {
                            //aitem.DepositAmount = parseFloat(aitem.DepositAmount) || 0;
                            $scope.TotalDepositPaymentAmount += aitem.DepositAmount;
                        });
                        /*          $scope.TotalDepositPaymentAmount = parseFloat($scope.TotalDepositPaymentAmount.toFixed(2));*/

                        $scope.TotalDepositAmount = $scope.TotalDepositPaymentAmount;
                        $scope.patientDepositAmnt = $scope.TotalDepositPaymentAmount;
                    }

                    $scope.IsAddMultiplePaymentbutton = false;
                    $scope.ISShowCardPaymentDetails = false;

                    //var List2 = $filter("filter")($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (Pitem) {
                    //    return Pitem.Status === '';
                    //}) || [];

                    //if (List2.length !== 0) {
                    //    $scope.IsShowCollectpaymentbutton = false;
                    //} else {
                    //    $scope.IsShowCollectpaymentbutton = true;
                    //}

                    $scope.checkstatusCollectAndSaveButton();

                }

                $scope.RecalculateTotals();
            }, function () {

            });
        };

        $scope.CollectDepositAmount = function (amount, item) {
            $scope.patientDepositAmnt = 0;
            $scope.TotalDepositPaymentAmount = 0;


            $scope.SaveDepositPaymentReqObj.PaymentAmount = amount;
            //angular.forEach($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (aitem) {
            //    aitem.DepositAmount = aitem.DepositAmount || 0;
            //    $scope.TotalDepositAmount += parseFloat(aitem.DepositAmount);

            //})

            angular.forEach($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (aitem) {
                aitem.DepositAmount = parseFloat(aitem.DepositAmount) || 0;
                $scope.TotalDepositPaymentAmount += aitem.DepositAmount;


            });
            $scope.TotalDepositPaymentAmount = parseFloat($scope.TotalDepositPaymentAmount.toFixed(2));

            if ($scope.MainParentobj.PaymentTypeId == 2) {
                if ($scope.TotalDepositPaymentAmount > $scope.MainParentobj.PaymentAmount) {
                    alertify.error("The Collected Amount exceeds the total payable amount. Please enter a valid amount.");
                    item.DepositAmount = "";
                    $scope.TotalDepositPaymentAmount = 0;
                    return false;
                }
            }
            $scope.TotalDepositAmount = $scope.TotalDepositPaymentAmount;
            $scope.patientDepositAmnt = amount || 0;

            var List1 = $filter("filter")($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (Pitem,) { return Pitem.Status === ""; }) || [];
            if (List1.length != 0) {
                $scope.IsAddMultiplePaymentbutton = true;
            } else {
                $scope.IsAddMultiplePaymentbutton = false;
            }

            //if ($scope.mainNMIPaymentRequestObj.PatientDepositLineItem.length ==1) {
            //    $scope.IsShowpaymentbutton = false;
            //}

            $scope.checkstatusCollectAndSaveButton();
            $scope.CalculateLineFee(item);
            $scope.RecalculateTotals();
        }

        $scope.DepositCollectPrint = function (item, pitem) {
            item = item || null;
            pitem = pitem || null;
            $scope.DepositTransactionObj.PatientFullName = $scope.PatientProfileDetails.Patient[0].FullName || "";
            $scope.DepositTransactionObj.PatientDisplayId = $scope.PatientProfileDetails.Patient[0].PatientDisplayId || "";
            $scope.DepositTransactionObj.TransactionDate = pitem.TransactionDate || '';
            $scope.DepositTransactionObj.TransactionTime = pitem.TransactionTime || '';
            $scope.DepositTransactionObj.TransReciptNo = pitem.TransactionReceiptNo || '';
            $scope.DepositTransactionObj.ReceiptNumber = pitem.ReceiptNo || '';
            $scope.DepositTransactionObj.ReferenceNumber = pitem.ReferenceNumber || '';


            $scope.DepositTransactionObj.PaymentMethodName = pitem.PaymentMode || '';
            $scope.DepositTransactionObj.CardNumber = pitem.CardNumber || '';
            $scope.DepositTransactionObj.ChequeNumber = pitem.ChequeNumber || '';
            $scope.DepositTransactionObj.CardType = pitem.CardType || '';
            $scope.DepositTransactionObj.OnlineTransactionNumber = pitem.OnlineTransactionNumber || '';
            $scope.DepositTransactionObj.TransactionAmount = pitem.DepositAmount || '';

            $scope.DepositTransactionObj.OrganizationName = pitem.HospitalName || '';
            $scope.DepositTransactionObj.OrganizationId = pitem.HospitalId || '';
            $scope.DepositTransactionObj.OrganizationId = pitem.OrganizationId || '';


            var filtredArray = $filter("filter")($scope.AllBranchesList, { "BranchId": $scope.DepositTransactionObj.OrganizationId }, true) || [];
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
            $scope.printPatientDeposit();
        }
        $scope.printPatientDeposit = function () {

            $timeout(function () {
                var innerContents = document.getElementById('PrintDepsoitTransPopupNew').innerHTML;
                var popupWinindow = window.open('scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
                popupWinindow.document.open();
                popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head><body onload="window.print()" class="bodyheightprint">' + innerContents + '</body></html>');
                popupWinindow.document.close();
            }, 1000);
        }
        $scope.POSObject = {};

        $scope.POSCollectNMIPayment = function (item) {
            item = item || null;
            item.POSMultiPaymentsArray = item.POSMultiPaymentsArray || [];
            var Acount = 0;
            var Bcount = 0;
            var Pcount = 0;
            var Dcount = 0;
            var Ecount = 0;
            var Devicecount = 0;
            var PaymentPagecount = 0;
            var mcount = 0;
            angular.forEach(item.POSMultiPaymentsArray, function (pitem) {
                pitem.PaymentAmount = pitem.PaymentAmount || 0;
                if (pitem.PaymentAmount == 0) {
                    Acount++;
                }
                if (pitem.PaymentMethodId == 0) {
                    Pcount++;
                }

                //if (pitem.PaymentMethodId == 2 || pitem.PaymentMethodId == 3) {
                //    mcount++;
                //}

                if (pitem.PaymentMethodId == 2 || pitem.PaymentMethodId == 3) {

                    if (pitem.PaymentProcessTypeId == "") {
                        Bcount++;
                    }
                }

                if (pitem.PaymentProcessTypeId == 4) {
                    if (pitem.PaymentMethodId == 2 || pitem.PaymentMethodId == 3) {

                        var cardTypeId = pitem.CardTypeId || pitem.CardtypeId
                        if (cardTypeId == 0) {
                            Dcount++;
                        }

                        if (pitem.CardNumber == '' || pitem.CardNumber.trim().length < 4) {
                            Ecount++;
                        }
                    }
                }

                if (pitem.PaymentProcessTypeId == 3) {
                    PaymentPagecount++;
                } else if (pitem.PaymentProcessTypeId == 1) {
                    Devicecount++;
                }

            });

            if (Pcount > 0) {
                alertify.error("Please select Payment Method.");
                return false;
            }
            if (Acount > 0) {
                alertify.error("Please enter Payment Amount.");
                return false;
            }

            if ($scope.TotalPOSPaymentAmount < $scope.MainParentobj.PaymentAmount) {
                alertify.error("Please Collect the Total amount.");
                return false;
            }


            if (Bcount > 0) {
                alertify.error("Please select Receive Via.");
                return false;
            }

            if (Dcount > 0) {
                alertify.error("Please select Card Type");
                return false;
            }
            if (Ecount > 0) {
                alertify.error("Please Enter Card Last 4 digits");
                return false;
            }
            //if (mcount > 1) {
            //    alertify.error("Multiple card payments are not allowed. At least one cash payment must be collected.");
            //    return false;
            //}

            if (PaymentPagecount > 0) {

                var filteredData = item.POSMultiPaymentsArray.filter(function (x) {
                    return x.PaymentProcessTypeId === 3;
                });

                if (!window.CollectJS) {
                    alert("Payment Gateway not loaded");
                    return;
                }

                if ($scope.isPaymentInProgress) {
                    alertify.error("Transaction already in progress. Please wait.");
                    return;
                }

                if (filteredData[0].PaymentMethodId === 2) {
                    if (!$scope.ccValitationobj.ccnumbervalid || !$scope.ccValitationobj.cccvv || !$scope.ccValitationobj.ccexpiry) {
                        alertify.error("Please Enter the required fields");
                        return false;
                    }
                }
                if (filteredData[0].CardBillingZip == "") {
                    alertify.error("Please select Zip Code");
                    return false;
                };


                $scope.isPaymentInProgress = true;
                $("#maineHnoteLoader").show();
                CollectJS.startPaymentRequest(event);
            }

            if (Devicecount > 0) {
                var filteredDeviceData = item.POSMultiPaymentsArray.filter(function (x) {
                    return x.PaymentProcessTypeId === 1;
                });

                if (filteredDeviceData[0].PaymentProcessTypeId == 1) {
                    var PoiDeviceId = filteredDeviceData[0].PoiDeviceId || "";

                    if (PoiDeviceId == "") {
                        alertify.error("Please select PoiDevice");
                        return false;
                    };
                    $scope.navtoOnlinePaymentGatewayPaymentnew("", item);

                }
            }

            if (PaymentPagecount == 0 && Devicecount == 0) {
                $scope.navtoOnlinePaymentGatewayPaymentnew("", item);
            }
        }

        $scope.POSinitCollectJS = function (item) {

            if (item == undefined) {
                item = item || {};
                item.PaymentMethodId = 1;
            }

            if (window.CollectJS) {
                let fields = {};
                const paymenttype = "";
                if (item.PaymentMethodId === 2 || item.PaymentMethodId === 3) {

                    fields = {
                        ccnumber: {
                            selector: "#nmi-ccnumber",
                            placeholder: "0000 0000 0000 0000",
                            display: "required",
                        },
                        ccexp: {
                            selector: "#nmi-exp",
                            placeholder: "MM/YY",
                            display: "required",
                        },
                        cvv: {
                            selector: "#nmi-cvv",
                            placeholder: "***",
                            display: "required"
                        }
                    };
                }
                else if (item.PaymentMethodId === 7) {

                    fields = {
                        checkaccount: {
                            selector: "#nmi-chkacctnumber",
                            placeholder: "Account Number"
                        },
                        checkaba: {
                            selector: "#nmi-checkaba",
                            placeholder: "Routing Number"
                        },
                        checkname: {
                            selector: "#nmi-checkname",
                            placeholder: "Name on Account"
                        }
                    };
                }

                CollectJS.configure({
                    variant: "inline",
                    currency: "USD",
                    country: "US",
                    price: item.PaymentAmount,
                    fields: fields,
                    validationCallback: function (field, status, message) {
                        //if (status) {
                        //    var message = field + " is now OK: " + message;
                        //} else {
                        //    var message = field + " is now Invalid: " + message;
                        //}
                        //console.log(message);
                        //if (message == 'Success') {
                        //    alertify.success(field + " is now OK: " + message);
                        //}
                        //else {
                        //    alertify.error(field + " is now Invalid: " + message);
                        //}
                        console.log(status + "__" + field);
                        //if (!status) {
                        //    if (field === 'card_number') alertify.error(message);
                        //    if (field === 'cvv') alertify.error(message);
                        //    if (field === 'expiry') alertify.error(message);
                        //    $scope.allFieldsValid = true;
                        //} else {
                        //    $scope.allFieldsValid = false;
                        //}

                        if (field === 'ccnumber') {
                            if (status) {
                                $scope.ccValitationobj.ccnumbervalid = true;
                            } else {
                                $scope.ccValitationobj.ccnumbervalid = false;
                                alertify.error(message);
                            }
                        }
                        if (field === 'cvv') {
                            if (status) {
                                $scope.ccValitationobj.cccvv = true;
                            } else {
                                $scope.ccValitationobj.cccvv = false;
                                alertify.error(message);
                            }
                        }
                        if (field === 'ccexp') {
                            if (status) {
                                $scope.ccValitationobj.ccexpiry = true;
                            } else {
                                $scope.ccValitationobj.ccexpiry = false;
                                alertify.error(message);
                            }
                        }
                    },
                    callback: function (response) {
                        $scope.$apply(function () {

                            console.log(response);
                            $scope.isPaymentInProgress = false;
                            $("#maineHnoteLoader").hide();
                            $scope.tokenResponse = response;

                            if (item.PaymentMethodId === 2 || item.PaymentMethodId === 3) {
                                if (response.card && response.card.type) {
                                    switch (response.card.type.toLowerCase()) {
                                        case 'visa':
                                            item.CardTypeId = 1;
                                            break;
                                        case 'mastercard':
                                            item.CardTypeId = 2;
                                            break;
                                        case 'amex':
                                            item.CardTypeId = 3;
                                            break;
                                        default:
                                            item.CardTypeId = 0;
                                    }
                                } else {
                                    item.CardTypeId = 0;
                                }

                                item.CardNumber = response.card.number.slice(-4);
                                item.CardType = response.card.type;
                            } else if (item.PaymentMethodId === 7) {
                                console.log(response.check);
                                //response.check.aba
                                //response.check.account
                                //response.check.hash
                                //response.check.institution
                                //response.check.name
                                //response.check.transit

                            }

                            $scope.navtoOnlinePaymentGatewayPaymentnew(response.token, item);
                        });
                    },
                    timeoutCallback: function () {
                        alert("Tokenization timed out.");
                        $scope.$apply(function () { $scope.isPaymentInProgress = false; });
                        $("#maineHnoteLoader").hide();
                    },
                    fieldsAvailableCallback: function () {
                        console.log("Fields loaded.");
                        $("#maineHnoteLoader").hide();
                    }
                });
            } else {
                console.error("CollectJS not loaded.");
                $("#maineHnoteLoader").hide();
            }
        };

        $scope.PatientRemainingBalanceAmount = 0;
        $scope.validateTotal = function (currentItem, index) {

            var allowed = parseFloat($scope.MainParentobj.PaymentAmount || 0);
            if (index !== 0) {
                currentItem.PaymentAmount = parseFloat(currentItem.ManualAmount || 0);
            }

            var cashRow = $scope.mainNMIPaymentRequestObj.POSMultiPaymentsArray[0];
            var cash = parseFloat(cashRow.PaymentAmount || 0);

            var creditTotal = 0;
            angular.forEach($scope.mainNMIPaymentRequestObj.POSMultiPaymentsArray, function (row, i) {
                if (i !== 0)
                    creditTotal += parseFloat(row.ManualAmount || 0);
            });

            var total = cash + creditTotal;

            if (index === 0) {

                if (cash > allowed) {
                    alertify.error("Cash cannot be greater than " + allowed);
                    cashRow.PaymentAmount = allowed;
                    return;
                }

                if (total > allowed) {
                    alertify.error("Total cannot exceed " + allowed);
                    cashRow.PaymentAmount = 0;   // clear only cash
                    return;
                }
            }

            if (index !== 0) {

                var credit = parseFloat(currentItem.ManualAmount || 0);

                if (credit > allowed) {
                    alertify.error("Credit cannot be greater than " + allowed);
                    currentItem.ManualAmount = 0;
                    currentItem.PaymentAmount = 0;
                    return;
                }

                if (total > allowed) {
                    alertify.error("Total cannot exceed " + allowed);
                    currentItem.ManualAmount = 0;     // clear only this credit
                    currentItem.PaymentAmount = 0;
                    return;
                }
            }

            $scope.TotalAmount = total;
            $scope.PatientRemainingBalanceAmount = allowed - total;
        };

        $scope.validatePOSTotalAmount = function (currentItem, index) {



            var allowed = parseFloat($scope.MainParentobj.PaymentAmount || 0);


            $scope.TotalPOSPaymentAmount = 0;
            angular.forEach($scope.mainNMIPaymentRequestObj.POSMultiPaymentsArray, function (item) {
                item.PaymentAmount = item.PaymentAmount || 0;
                $scope.TotalPOSPaymentAmount += parseFloat(item.PaymentAmount);
            })
            $scope.TotalPOSPaymentAmount = parseFloat($scope.TotalPOSPaymentAmount.toFixed(2));
            if ($scope.TotalPOSPaymentAmount > $scope.MainParentobj.PaymentAmount) {
                alertify.error('Payment amount cannot exceed the balance amount. Please enter a lesser amount.');
                currentItem.PaymentAmount = 0;
                return false;
            }
            $scope.TotalAmount = $scope.TotalPOSPaymentAmount;
            $scope.PatientRemainingBalanceAmount = allowed - $scope.TotalPOSPaymentAmount;
        };


        $scope.navtoOnlinePaymentGatewayPaymentnew = function (paymentToken, aitem) {


            if ($scope.mainNMIPaymentRequestObj.POSMultiPaymentsArray.length > 0) {
                $scope.POSMultipaymentsArray = [];
                $scope.POSMultipaymentsArray = angular.copy($scope.mainNMIPaymentRequestObj.POSMultiPaymentsArray);
            }

            if ($scope.PatientPaymentObj.PatientDepositPaymodeList.length > 0) {
                /*$scope.TotalPOSPaymentAmount = 0;*/
                angular.forEach($scope.PatientPaymentObj.PatientDepositPaymodeList, function (pitem) {
                    pitem.PaymentAmount = pitem.DepositAmount || 0;
                    pitem.PaymentMethod = pitem.PaymentMethodName || 0;
                })

                $scope.POSMultipaymentsArray =
                    $scope.POSMultipaymentsArray.concat(
                        angular.copy($scope.PatientPaymentObj.PatientDepositPaymodeList)
                    );

                //angular.forEach($scope.POSMultipaymentsArray, function (pitem) {
                //    pitem.PaymentAmount = parseFloat(pitem.PaymentAmount);
                //    $scope.TotalPOSPaymentAmount += pitem.PaymentAmount || 0;
                //})

            }

            //var patientDepositAmount = parseFloat($scope.TotalAmount);
            //var patientDepositAmount = parseFloat($scope.TotalPOSPaymentAmount);
            $scope.TotalPatientPaymentBalance = 0;
            var patientDepositAmount = parseFloat($scope.TotalPOSPaymentAmtusingDeposit);
            for (let i = 0; i < $scope.MainParentobj.mainPosObject.InvoiceItems.length; i++) {

                let balance = $scope.MainParentobj.mainPosObject.InvoiceItems[i].PatientBalanceAmount;
                let availableBls = $scope.MainParentobj.mainPosObject.InvoiceItems[i].PatientBalanceAmount;
                let originalBls = $scope.MainParentobj.mainPosObject.InvoiceItems[i].PatientPaymentAmount;
                $scope.MainParentobj.mainPosObject.InvoiceItems[i].PatientPaymentAmount = parseFloat($scope.MainParentobj.mainPosObject.InvoiceItems[i].PatientPaymentAmount);
                if (patientDepositAmount >= balance) {
                    $scope.MainParentobj.mainPosObject.InvoiceItems[i].PatientPaymentAmount += parseFloat(balance);
                    $scope.MainParentobj.mainPosObject.InvoiceItems[i].PatientBalanceAmount = (availableBls - balance);
                    patientDepositAmount -= balance;
                    $scope.TotalPatientPaymentBalance += balance;
                } else {

                    $scope.MainParentobj.mainPosObject.InvoiceItems[i].PatientPaymentAmount += patientDepositAmount;
                    $scope.MainParentobj.mainPosObject.InvoiceItems[i].PatientBalanceAmount = (availableBls - patientDepositAmount);
                    $scope.TotalPatientPaymentBalance += patientDepositAmount;
                    patientDepositAmount = 0;
                    break;
                }


            }

            if ($scope.MainParentobj.mainPosObject.OverallDiscountValue > 0) {
                var totalItems = $scope.MainParentobj.mainPosObject.InvoiceItems.length;
                var TotalCharge = 0, TotalDiscountAmount = 0, TotalNetAmount = 0, PatientPaymentAmount = 0, PatientBalanceAmount = 0, WriteOffAmount = 0, TotalBalanceAmount = 0;
                angular.forEach($scope.MainParentobj.mainPosObject.InvoiceItems, function (citem) {
                    if (citem.DeleteInd == "N") {

                        TotalCharge += parseFloat(citem.TotalChargeAmount);
                        TotalNetAmount += parseFloat(citem.TotalNetAmount);
                        PatientPaymentAmount += parseFloat(citem.PatientPaymentAmount);
                        PatientBalanceAmount += parseFloat(citem.PatientBalanceAmount);
                        TotalBalanceAmount += parseFloat(citem.PatientBalanceAmount);


                        if ($scope.MainParentobj.mainPosObject.OverallDiscountType === "A") {
                            TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                        } else {
                            TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                        }
                        //if ($scope.mainPosObject.OverallDiscountType === "A") {
                        //    TotalDiscountAmount = parseFloat($scope.mainPosObject.OverallDiscountValue) || 0;

                        //} else {
                        //    TotalDiscountAmount = (parseFloat($scope.mainPosObject.OverallDiscountValue) / 100) || 0;
                        //}


                    }
                });

                if ($scope.MainParentobj.mainPosObject.OverallDiscountValue > 0) {
                    if ($scope.MainParentobj.mainPosObject.OverallDiscountType === "A") {
                        TotalDiscountAmount = parseFloat($scope.MainParentobj.mainPosObject.OverallDiscountValue);
                        TotalNetAmount = parseFloat($scope.TotalPOSPaymentAmtusingDeposit);
                        PatientPaymentAmount = parseFloat($scope.TotalPOSPaymentAmtusingDeposit);
                    }
                }

                $scope.MainParentobj.mainPosObject.TotalChargeAmount = parseFloat(TotalCharge.toFixed(2));
                $scope.MainParentobj.mainPosObject.TotalDiscountAmount = parseFloat(TotalDiscountAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.TotalNetAmount = parseFloat(TotalNetAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.PatientPaymentAmount = parseFloat(PatientPaymentAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.PatientBalanceAmount = parseFloat(PatientBalanceAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.WriteOffAmount = parseFloat(WriteOffAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.TotalBalanceAmount = parseFloat(TotalBalanceAmount.toFixed(2));

                if ($scope.MainParentobj.mainPosObject.TotalNetAmount < 0) {
                    alertify.error("Over All Discount  should not be Greater Than Total Charge Amount");
                    $scope.MainParentobj.mainPosObject.OverallDiscountValue = 0;
                    TotalCharge = 0; TotalDiscountAmount = 0; TotalNetAmount = 0; PatientPaymentAmount = 0; PatientBalanceAmount = 0; WriteOffAmount = 0; TotalBalanceAmount = 0;
                    angular.forEach($scope.MainParentobj.mainPosObject.InvoiceItems, function (citem) {
                        citem.TotalChargeAmount = citem.UnitPrice * citem.Quantity;
                        citem.UnitPrice = parseFloat(citem.UnitPrice) || 0;
                        citem.Quantity = parseInt(citem.Quantity) || 1;
                        citem.DiscountAmount = 0;
                        citem.TotalNetAmount = (citem.UnitPrice * citem.Quantity) - citem.DiscountAmount;
                        citem.PatientBalanceAmount = citem.TotalNetAmount - (citem.PatientPaymentAmount || 0);


                        TotalCharge += parseFloat(citem.TotalChargeAmount);
                        TotalNetAmount += parseFloat(citem.TotalNetAmount);
                        PatientPaymentAmount += parseFloat(citem.PatientPaymentAmount);
                        PatientBalanceAmount += parseFloat(citem.PatientBalanceAmount);
                        TotalBalanceAmount += parseFloat(citem.PatientBalanceAmount);

                        if ($scope.MainParentobj.mainPosObject.OverallDiscountType === "A") {
                            TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                        } else {
                            TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                        }

                    });

                    $scope.MainParentobj.mainPosObject.TotalChargeAmount = parseFloat(TotalCharge.toFixed(2));
                    $scope.MainParentobj.mainPosObject.TotalDiscountAmount = parseFloat(TotalDiscountAmount.toFixed(2));
                    $scope.MainParentobj.mainPosObject.TotalNetAmount = parseFloat(TotalNetAmount.toFixed(2));
                    $scope.MainParentobj.mainPosObject.PatientPaymentAmount = parseFloat(PatientPaymentAmount.toFixed(2));
                    $scope.MainParentobj.mainPosObject.PatientBalanceAmount = parseFloat(PatientBalanceAmount.toFixed(2));
                    $scope.MainParentobj.mainPosObject.WriteOffAmount = parseFloat(WriteOffAmount.toFixed(2));
                    $scope.MainParentobj.mainPosObject.TotalBalanceAmount = parseFloat(TotalBalanceAmount.toFixed(2));
                    $scope.disableTotalDiscount = false;
                    $scope.disableIndividualDiscount = false;
                    return false;
                }

            }
            else {
                var totalItems = $scope.MainParentobj.mainPosObject.InvoiceItems.length;
                var TotalCharge = 0, TotalDiscountAmount = 0, TotalNetAmount = 0, PatientPaymentAmount = 0, PatientBalanceAmount = 0, WriteOffAmount = 0, TotalBalanceAmount = 0;
                angular.forEach($scope.MainParentobj.mainPosObject.InvoiceItems, function (citem) {
                    if (citem.DeleteInd == "N") {

                        TotalCharge += parseFloat(citem.TotalChargeAmount);
                        TotalNetAmount += parseFloat(citem.TotalNetAmount);
                        PatientPaymentAmount += parseFloat(citem.PatientPaymentAmount);
                        PatientBalanceAmount += parseFloat(citem.PatientBalanceAmount);
                        TotalBalanceAmount += parseFloat(citem.PatientBalanceAmount);


                        if (citem.DiscountType === "$") {
                            TotalDiscountAmount += parseFloat(citem.DiscountAmount);
                        } else {
                            TotalDiscountAmount += (citem.DiscountAmount / 100) * (citem.UnitPrice * citem.Quantity);
                        }
                        //if ($scope.mainPosObject.OverallDiscountType === "A") {
                        //    TotalDiscountAmount = parseFloat($scope.mainPosObject.OverallDiscountValue) || 0;
                        //} else {
                        //    TotalDiscountAmount = (parseFloat($scope.mainPosObject.OverallDiscountValue) / 100) || 0;
                        //}


                    }
                });

                $scope.MainParentobj.mainPosObject.TotalChargeAmount = parseFloat(TotalCharge.toFixed(2));
                $scope.MainParentobj.mainPosObject.TotalDiscountAmount = parseFloat(TotalDiscountAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.TotalNetAmount = parseFloat(TotalNetAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.PatientPaymentAmount = parseFloat(PatientPaymentAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.PatientBalanceAmount = parseFloat(PatientBalanceAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.WriteOffAmount = parseFloat(WriteOffAmount.toFixed(2));
                $scope.MainParentobj.mainPosObject.TotalBalanceAmount = parseFloat(TotalBalanceAmount.toFixed(2));

            }
            if (+$scope.mainNMIPaymentRequestObj.PaymentTypeId === 3) {
                $scope.PaymentMethodObj = angular.copy($scope.GetPOSPaymentmethodItem());
                $scope.PaymentMethodObj.PaymentMethodId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
                $scope.PaymentMethodObj.PaymentMethodName = $scope.mainNMIPaymentRequestObj.PaymentMode;
                $scope.PaymentMethodObj.DepositAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount || 0;
                $scope.PaymentMethodObj.PatientDepositId = $scope.mainNMIPaymentRequestObj.PatientDepositId || 0;
                $scope.PaymentMethodObj.ReferenceNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                $scope.PaymentMethodObj.OnlineTransactionNumber = $scope.mainNMIPaymentRequestObj.TransactionId || 0;
                $scope.PaymentMethodObj.NMITransactionId = $scope.mainNMIPaymentRequestObj.NMITransactionId || 0;
                $scope.PaymentMethodObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
                $scope.PaymentMethodObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";
                $scope.PaymentMethodObj.CardType = $scope.mainNMIPaymentRequestObj.CardType || "";
                $scope.PaymentMethodObj.CardTypeId = $scope.mainNMIPaymentRequestObj.CardTypeId || "";
                $scope.PaymentMethodObj.CardNumber = $scope.mainNMIPaymentRequestObj.CardNumber || "";
                $scope.PaymentMethodObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
                $scope.PaymentMethodObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
            }
            var InvoiceItems = [];
            angular.forEach($scope.MainParentobj.mainPosObject.InvoiceItems, function (item) {

                let PosTransaction = [];
                if (item.PatientBalanceAmount != 0) {
                    let PatientBalance = parseFloat(item.PatientBalanceAmount) || 0;
                    let Tranobj = {
                        "InvoiceItemTransactionId": 0,
                        "InvoiceItemId": item.InvoiceItemId,
                        "OrganizationId": $scope.HospitalId,
                        "TransactionDate": $filter('date')($scope.CurreDate, "yyyy-MM-dd"),
                        "TransactionAmount": item.TotalChargeAmount,
                        "PatientAmount": PatientBalance,
                        "PatientDepositId": null,
                        "AdjustmentReasonId": null,
                        "AdjustmentReasonCode": null,
                        "ReferenceNumber": "",
                        "TransactionTypeId": 1,
                        "TransactionType": "Payment",
                        "TransactionSourceId": 10,
                        "TransactionSource": "POS",
                        "SettlementStatusId": 3,
                        "SettlementStatus": "Fully Settled",
                        "TransactionNotes": "Payment received",
                        "DeleteInd": 'N'
                    }
                    PosTransaction.push(Tranobj);
                }

                let subobj = {
                    "InvoiceItemId": item.InvoiceItemId || null,
                    "InvoiceId": item.InvoiceId || null,
                    "ItemMasterId": item.ItemMasterId || null,
                    "ItemMasterName": item.ItemMaster || "",
                    "OrganizationItemId": item.OrganizationItemId || null,
                    "Quantity": item.Quantity || null,
                    "UnitPrice": item.UnitPrice || null,
                    "TotalChargeAmount": item.TotalChargeAmount || 0,
                    "DiscountValue": item.DiscountValue || null,
                    "DiscountType": item.DiscountType || "",
                    //"DiscountAmount": item.DiscountAmount || 0,
                    "DiscountAmount": $scope.MainParentobj.mainPosObject.OverallDiscountValue == 0 ?
                        item.DiscountType === "%" ? ((item.DiscountAmount / 100) * item.TotalChargeAmount) : item.DiscountAmount : item.DiscountAmount,
                    "TotalNetAmount": item.TotalNetAmount || 0,
                    "PatientPaymentAmount": item.PatientPaymentAmount || 0,
                    "PatientBalanceAmount": item.PatientBalanceAmount || 0,
                    "WriteOffAmount": item.WriteOffAmount || 0,
                    "BalanceAmount": item.BalanceAmount || 0,
                    "DeleteInd": item.DeleteInd,
                    "Transactions": PosTransaction || []
                }
                InvoiceItems.push(subobj);
            })
            var tempPayments = [];
            /* $scope.PatientPaymentObj.PatientDepositPaymodeList.push($scope.PaymentMethodObj);*/

            //if ($scope.PatientPaymentObj.PatientDepositPaymodeList.length > 0) {

            //    angular.forEach($scope.PatientPaymentObj.PatientDepositPaymodeList, function (pitem) {
            //        pitem.PaymentAmount = pitem.DepositAmount || 0;
            //        pitem.PaymentMethod = pitem.PaymentMethodName || 0;
            //    })

            //    $scope.mainNMIPaymentRequestObj.POSMultiPaymentsArray =
            //        $scope.mainNMIPaymentRequestObj.POSMultiPaymentsArray.concat(
            //            angular.copy($scope.PatientPaymentObj.PatientDepositPaymodeList)
            //        );
            //}

            $scope.PaymentMethodObj.PaymentAmount = $scope.mainNMIPaymentRequestObj.PaymentAmount || null;
            if ($scope.PaymentMethodObj.PaymentAmount != null) {
                angular.forEach($scope.POSMultipaymentsArray, function (sitem, index) {
                    //if (index != 0 && (!sitem.ManualAmount || sitem.ManualAmount == 0)) {
                    //    sitem.PaymentAmount = 0;
                    //}
                    //if ((!sitem.PaymentAmount || sitem.PaymentAmount === "")) {
                    //    sitem.PaymentAmount = 0;
                    //}
                    if (sitem.PaymentId == 0) {
                        let obj = {
                            "PaymentId": sitem.PaymentId || 0,
                            "InvoiceId": $scope.MainParentobj.mainPosObject.InvoiceId || 0,
                            "PaymentMethodId": sitem.PaymentMethodId || null,
                            "PaymentMethod": sitem.PaymentMethod || "",
                            "PaymentAmount": sitem.PaymentAmount || null,
                            "PatientDepositId": sitem.PatientDepositId || null,
                            "TransactionTypeId": $scope.PaymentsObj.TransactionTypeId,
                            "TransactionType": $scope.PaymentsObj.TransactionType,
                            "DeleteInd": $scope.PaymentsObj.DeleteInd,
                            "CardNumber": sitem.CardNumber || '',
                            "CardType": sitem.CardType || '',
                            "CardtypeId": sitem.CardTypeId || 0,
                            "NMITransactionId": sitem.NMITransactionId || "",
                            "OnlineTransactionNumber": sitem.OnlineTransactionNumber || null,
                            "PaymentProcessTypeId": sitem.PaymentProcessTypeId || null,
                            "PaymentProcessType": sitem.PaymentProcessType || null,
                            "BillPaymentTypeId": 3,
                            "BillPaymentType": "PointOfSale",
                            "PaymentTransactionTypeId": $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId || 2,
                            "PaymentTransactionType": $scope.mainNMIPaymentRequestObj.PaymentTransactionType || 'Debit',
                            "Remarks": sitem.Remarks || "",
                            "ReferenceNumber": sitem.ReferenceNumber || "",
                        }
                        tempPayments.push(obj);
                    }

                })
            }

            var items = tempPayments || [];
            //var totalAmount = 0;
            //if (items[1].PaymentProcessTypeId == 3) {
            //    if (aitem.CardBillingZip == "") {
            //        alertify.error("Please select Zip Code");
            //        return false;
            //    };
            //}
            //for (var i = 0; i < items.length; i++) {
            //    var item = items[i];
            //    if (!item) continue;

            //    var amt = parseFloat(item.PaymentAmount || 0) || 0;
            //    totalAmount += amt;
            //}

            //if (totalAmount <= 0) {
            //    alertify.error("Please enter Payment Amount");
            //    return false;
            //}
            //if (totalAmount <
            //    $scope.MainParentobj.mainPosObject.TotalNetAmount) {
            //    alertify.error("Please Collect the Total amount.");
            //    return false;
            //}
            //for (var i = 0; i < items.length; i++) {
            //    var item = items[i];
            //    if (!item) continue;

            //    var amt = parseFloat(item.PaymentAmount || 0) || 0;

            //    if (!item.PaymentMethodId && amt > 0) {
            //        alertify.error("Please select Payment Type");
            //        return false;
            //    }

            //    if ((item.PaymentMethodId == 2 || item.PaymentMethodId == 3 || item.PaymentMethodId == 7) && amt > 0) {
            //        if (!item.PaymentProcessTypeId) {
            //            alertify.error("Please select Receive Via");
            //            return false;
            //        }
            //    }
            //}
            //for (var i = 0; i < aitem.length; i++) {

            //    var item = aitem[i];   // correct reference to each object

            //    if (!item) continue;

            //    var PoiDeviceId = item.PoiDeviceId || "";

            //    if (item.PaymentProcessTypeId == 1) {
            //        if (PoiDeviceId == "") {
            //            alertify.error("Please select PoiDevice");
            //            return false;
            //        }
            //    }
            //    if (item.PaymentProcessTypeId == 4) {
            //        if (item.PaymentMethodId == 2 || item.PaymentMethodId == 3) {
            //            var cardTypeId = item.CardTypeId || item.CardtypeId
            //            if (cardTypeId == 0) {
            //                alertify.error("Please select Card Type");
            //                return;
            //            }

            //            if (item.CardNumber == '' || item.CardNumber.trim().length < 4) {
            //                alertify.error("Please Enter Card Last 4 digits");
            //                return;
            //            }
            //        }
            //    }
            //}
            //for (var i = tempPayments.length - 1; i >= 0; i--) {
            //    let p = tempPayments[i];
            //    if (!p.PaymentMethodId || p.PaymentMethodId === "" || !p.PaymentAmount || p.PaymentAmount == 0) {
            //        tempPayments.splice(i, 1);
            //    }
            //}
            // Calculate single payment amount from array
            $scope.PatientPaymentAmount = 0;

            angular.forEach($scope.POSMultipaymentsArray, function (row, index) {
                $scope.PatientPaymentAmount += parseFloat(row.PaymentAmount || 0);
            });

            let paymentStatusText = getPaymentStatus(
                $scope.MainParentobj.mainPosObject.TotalNetAmount,
                //$scope.MainParentobj.mainPosObject.PatientPaymentAmount,
                $scope.PatientPaymentAmount,
                /*$scope.PaymentMethodObj.PaymentAmount*/
            );
            let paymentStatusIdMap = {
                "Unpaid": 1,
                "Partially Paid": 2,
                "Fully Paid": 3
            };
            let paymentStatusId = paymentStatusIdMap[paymentStatusText];
            let posobject = {
                "UserId": $scope.UserId,
                "InvoiceId": null,
                "PatientId": $scope.MainParentobj.PatientId,
                "OrganizationId": $scope.MainParentobj.LocationName.BranchId,
                "PatientName": $scope.MainParentobj.mainPosObject.PatientName,
                "BuyerId": $scope.MainParentobj.mainPosObject.BuyerId,
                "BuyerName": $scope.MainParentobj.mainPosObject.BuyerName,
                "IsEmployee": false,
                "SoldByUserId": $scope.MainParentobj.mainPosObject.SoldByUserId,
                "SoldBy": $scope.MainParentobj.mainPosObject.SoldBy,
                "BillingProviderId": $scope.MainParentobj.mainPosObject.BillingProviderId,
                "BillingProviderName": $scope.MainParentobj.mainPosObject.BillingProviderName,
                "RenderingProviderId": $scope.MainParentobj.mainPosObject.RenderingProviderId,
                "RenderingProviderName": $scope.MainParentobj.mainPosObject.RenderingProviderName,
                "InvoiceDate": $scope.MainParentobj.mainPosObject.InvoiceDate,
                "DiscountReasonId": $scope.MainParentobj.mainPosObject.DiscountReasonId,
                "DiscountReasonCode": $scope.MainParentobj.mainPosObject.DiscountReasonCode,
                "OverallDiscountValue": $scope.MainParentobj.mainPosObject.OverallDiscountValue || null,
                "OverallDiscountType": $scope.MainParentobj.mainPosObject.OverallDiscountType || "",
                "TotalChargeAmount": $scope.MainParentobj.mainPosObject.TotalChargeAmount || "",
                "TotalDiscountAmount": $scope.MainParentobj.mainPosObject.TotalDiscountAmount || null,
                "TotalNetAmount": $scope.MainParentobj.mainPosObject.TotalNetAmount || null,
                "PatientPaymentAmount": $scope.PatientPaymentAmount || null,
                "PatientBalanceAmount": $scope.MainParentobj.mainPosObject.PatientBalanceAmount || null,
                "WriteOffAmount": $scope.MainParentobj.mainPosObject.WriteOffAmount || 0,
                "TotalBalanceAmount": $scope.MainParentobj.mainPosObject.TotalBalanceAmount || 0,
                "PaymentStatus": paymentStatusText || 0,
                "PaymentStatusId": paymentStatusId || "",
                "DeleteInd": $scope.MainParentobj.mainPosObject.DeleteInd || "N",
                "InvoiceItems": InvoiceItems || [],
                "Payments": tempPayments || [],
                "ReferenceNumber": $scope.MainParentobj.mainPosObject.ReferenceNumber || '',
                "Remarks": "",
                "POSRefundId": null,
                "ReceiptNo": "",
                "RefundDate": null,
                "RefundAmount": null,
                "RefundByUserId": null,
                "RefundByUser": "",
                "AppointmentId": null,
                "RefundreasonId": null,
                "RefundReason": "",
                "CardtypeId": null,
                "RefundPaymentMethodId": null,
                "RefundPaymentMethod": "",
                "RefundStatus": "Initiated",
                "RefundStatusId": 1,
                "CardNumber": "",
                "PatientDepositId": null,
                "PaymentId": null,
                "PaymentTransactionTypeId": $scope.mainNMIPaymentRequestObj.PaymentTransactionTypeId || 2,
                "PaymentTransactionType": $scope.mainNMIPaymentRequestObj.PaymentTransactionType || 'Debit',
                "OrganizationTransactionId": $scope.mainNMIPaymentRequestObj.OrganizationTransactionId,
                "NMITransactionId": $scope.mainNMIPaymentRequestObj.NMITransactionId || 0,
                "OrganizationTransactionName": $scope.mainNMIPaymentRequestObj.OrganizationTransactionName,
                "OrganizationName": $scope.MainParentobj.LocationName.BranchName,
            }
            $scope.NMIPaymentAmount = 0;
            angular.forEach($scope.POSMultipaymentsArray, function (pitem) {
                if (pitem.PaymentProcessTypeId == 1 || pitem.PaymentProcessTypeId == 3) {
                    if (pitem.PaymentMethodId == 2 || pitem.PaymentMethodId == 3) {
                        $scope.NMIPaymentAmount = pitem.PaymentAmount || 0;

                        $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId = pitem.PaymentProcessTypeId || 0;
                        $scope.mainNMIPaymentRequestObj.PaymentProcessType = pitem.PaymentProcessType || "";

                        $scope.mainNMIPaymentRequestObj.PaymentModeId = pitem.PaymentMethodId || "";
                        $scope.mainNMIPaymentRequestObj.PaymentMode = pitem.PaymentMethod;
                        $scope.mainNMIPaymentRequestObj.CardNumber = pitem.CardNumber;
                        $scope.mainNMIPaymentRequestObj.CardTypeId = pitem.CardTypeId;
                        $scope.mainNMIPaymentRequestObj.CardType = pitem.CardType;
                    }
                }

            })


            paymentToken = paymentToken || "";

            var orderdescription = $scope.mainNMIPaymentRequestObj.PatientFirstName + " Payment " + $scope.NMIPaymentAmount + " for " + $scope.mainNMIPaymentRequestObj.PaymentType + " on " + $scope.mainNMIPaymentRequestObj.PaymentDate;

            $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());




            $scope.mainNMITransactionObj.NMITransactionId = 0;
            $scope.mainNMITransactionObj.UserId = $scope.mainNMIPaymentRequestObj.RecievedUserId;
            $scope.mainNMITransactionObj.PatientId = $scope.mainNMIPaymentRequestObj.PatientId;
            $scope.mainNMITransactionObj.OrganizationId = $scope.MainParentobj.LocationName.BranchId;
            $scope.mainNMITransactionObj.PaymentAmount = $scope.NMIPaymentAmount;
            $scope.mainNMITransactionObj.MerchentId = $scope.mainNMIPaymentRequestObj.MerchentId;
            $scope.mainNMITransactionObj.MerchentName = $scope.mainNMIPaymentRequestObj.MerchentName;
            $scope.mainNMITransactionObj.PaymentToken = paymentToken;
            $scope.mainNMITransactionObj.CardHolderName = $scope.mainNMIPaymentRequestObj.CardHolderName || "";
            $scope.mainNMITransactionObj.PatientEmail = $scope.mainNMIPaymentRequestObj.PatientEmailId || "";
            $scope.mainNMITransactionObj.PatientMobile = $scope.mainNMIPaymentRequestObj.PatientMobileNumber || "";
            $scope.mainNMITransactionObj.PatientMrNo = $scope.mainNMIPaymentRequestObj.PatientMrNo || "";

            $scope.mainNMITransactionObj.CardBillingAddress1 = $scope.mainNMIPaymentRequestObj.CardBillingAddress1 || "";
            $scope.mainNMITransactionObj.CardBillingAddress2 = $scope.mainNMIPaymentRequestObj.CardBillingAddress2 || "";
            $scope.mainNMITransactionObj.CardBillingState = $scope.mainNMIPaymentRequestObj.CardBillingState || "";
            $scope.mainNMITransactionObj.CardBillingCity = $scope.mainNMIPaymentRequestObj.CardBillingCity || "";
            $scope.mainNMITransactionObj.CardBillingZip = $scope.mainNMIPaymentRequestObj.CardBillingZip || "";

            $scope.mainNMITransactionObj.ProcessorId = $scope.mainNMIPaymentRequestObj.ProcessorId || "";
            $scope.mainNMITransactionObj.ProcessorName = $scope.mainNMIPaymentRequestObj.ProcessorName || "";
            $scope.mainNMITransactionObj.TokenizationKey = $scope.mainNMIPaymentRequestObj.TokenizationKey || "";
            $scope.mainNMITransactionObj.PublicCheckOutKey = $scope.mainNMIPaymentRequestObj.PublicCheckOutKey || "";
            $scope.mainNMITransactionObj.OrderId = "";
            $scope.mainNMITransactionObj.OrderDescription = orderdescription;
            $scope.mainNMITransactionObj.TransactionId = 0;
            $scope.mainNMITransactionObj.ResponseId = 0;
            $scope.mainNMITransactionObj.ResponseCode = "";
            $scope.mainNMITransactionObj.ResponseText = "";
            $scope.mainNMITransactionObj.Status = "";
            $scope.mainNMITransactionObj.TransactionTypeId = $scope.mainNMIPaymentRequestObj.TransactionTypeId;
            $scope.mainNMITransactionObj.TransactionType = $scope.mainNMIPaymentRequestObj.TransactionType;
            $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
            $scope.mainNMITransactionObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
            $scope.mainNMITransactionObj.DeleteInd = "N";
            $scope.mainNMITransactionObj.Type = $scope.mainNMIPaymentRequestObj.TransactionType;
            $scope.mainNMITransactionObj.AppointmentId = $scope.mainNMIPaymentRequestObj.AppointmentId;
            $scope.mainNMITransactionObj.VisitId = $scope.mainNMIPaymentRequestObj.VisitId;
            $scope.mainNMITransactionObj.PaymentType = $scope.mainNMIPaymentRequestObj.PaymentModeId == 2 ? 'creditcard' :
                $scope.mainNMIPaymentRequestObj.PaymentModeId == 7 ? 'check' :
                    'creditcard';
            if ($scope.mainNMIPaymentRequestObj.PaymentProcessTypeId == 1) {
                $scope.mainNMITransactionObj.ResponseMethod = "synchronous";
            } else {
                $scope.mainNMITransactionObj.ResponseMethod = "";
            }

            $scope.mainNMITransactionObj.PoiDeviceId = $scope.mainNMIPaymentRequestObj.PoiDeviceId || "";
            $scope.mainNMITransactionObj.PaymentProcessTypeId = $scope.mainNMIPaymentRequestObj.PaymentProcessTypeId || 0;
            $scope.mainNMITransactionObj.PaymentProcessType = $scope.mainNMIPaymentRequestObj.PaymentProcessType || "";

            $scope.mainNMITransactionObj.PaymentModeId = $scope.mainNMIPaymentRequestObj.PaymentModeId;
            $scope.mainNMITransactionObj.PaymentMode = $scope.mainNMIPaymentRequestObj.PaymentMode;
            $scope.mainNMITransactionObj.CardNumber = $scope.mainNMIPaymentRequestObj.CardNumber;
            $scope.mainNMITransactionObj.CardTypeId = $scope.mainNMIPaymentRequestObj.CardTypeId;
            $scope.mainNMITransactionObj.CardType = $scope.mainNMIPaymentRequestObj.CardType;
            $scope.mainNMITransactionObj.POSObject = posobject,

                eHnotePaymentGatewayService.PaymentProcessandAddPOS($scope.mainNMITransactionObj).then(function (resp) {
                    if (resp.data.Status === "Success") {
                        $scope.PrintData = resp.data;
                        $scope.mainNMITransactionObj.ResponseText = resp.data.ResponseText || '';
                        $scope.mainNMIPaymentRequestObj.transactionDateandtime = '';
                        if (resp.data.ResponseId != 0) {
                            if (resp.data.ResponseId === 1) {
                                alertify.success(resp.data.ResponseText);
                                $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Success';
                                $scope.mainNMIPaymentRequestObj.NMITransactionId = resp.data.NMITransactionId;
                                $scope.mainNMIPaymentRequestObj.TransactionId = resp.data.TransactionId;
                                $scope.mainNMIPaymentRequestObj.ReferenceNumber = resp.data.OnlineTransactionNumber;
                            } else if (resp.data.ResponseId === 2) {
                                alertify.error(resp.data.ResponseText);
                                $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Failure';
                                $scope.mainNMIPaymentRequestObj.PatientName = $scope.MainParentobj.mainPosObject.PatientName || "";
                                $scope.mainNMIPaymentRequestObj.TotalChargeAmount = $scope.MainParentobj.mainPosObject.TotalChargeAmount;
                                $scope.mainNMIPaymentRequestObj.TransactionId = resp.data.TransactionId;
                                $scope.mainNMIPaymentRequestObj.ReferenceNumber = resp.data.OnlineTransactionNumber;
                            } else {
                                alertify.error(resp.data.ResponseText);
                                $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Failure';
                            }

                        } else {
                            alertify.success('Success');
                            $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Success';
                        }


                        $scope.mainNMIPaymentRequestObj.PaymentMethodsList = [];


                        if ($scope.mainNMIPaymentRequestObj.UITransactionStatus != 'Success' && $scope.PrintData.PaymentMethods == undefined) {
                            $scope.mainNMIPaymentRequestObj.PatientName = $scope.MainParentobj.mainPosObject.PatientName || "";
                            $scope.mainNMIPaymentRequestObj.TotalChargeAmount = $scope.MainParentobj.mainPosObject.TotalChargeAmount;
                            $scope.mainNMIPaymentRequestObj.InvoiceDate = $filter("date")(new Date(), "MMM-dd-yyyy") || '';
                            angular.forEach(posobject.Payments, function (sitem) {
                                $scope.mainNMIPaymentRequestObj.PaymentMethodsList.push({
                                    transactionreceiptno: '',
                                    transactiondate: $filter("date")(new Date(), "MMM-dd-yyyy") || '',
                                    transactiontime: moment(new Date()).format("HH:mm") || '',
                                    PaymentMethodName: sitem.PaymentMethod || '',
                                    NMITransactionId: sitem.NMITransactionId || '',
                                    PaymentAmount: sitem.PaymentAmount || '',
                                    PosPaymodeReceiptNo: '',
                                    CardType: sitem.CardType || '',
                                });
                            });
                        }




                        if ($scope.mainNMIPaymentRequestObj.UITransactionStatus != 'Failure') {
                            $scope.mainNMIPaymentRequestObj = angular.copy($scope.PrintData);
                            $scope.mainNMIPaymentRequestObj.PaymentMethodsList = [];
                            $scope.mainNMIPaymentRequestObj.InvoiceNumber = $scope.PrintData.InvoiceNumber || '';
                            $scope.mainNMIPaymentRequestObj.TotalChargeAmount = $scope.PrintData.TotalChargeAmount || '';
                            $scope.mainNMIPaymentRequestObj.InvoiceDate = $scope.PrintData.InvoiceDate || '';
                            $scope.mainNMIPaymentRequestObj.PatientName = $scope.PrintData.PatientName || '';



                            angular.forEach($scope.PrintData.PaymentMethods, function (sitem) {
                                $scope.mainNMIPaymentRequestObj.PaymentMethodsList.push({
                                    transactionreceiptno: sitem.PosPaymodeReceiptNo || '',
                                    transactiondate: sitem.TransactionDate || '',
                                    transactiontime: sitem.TransactionTime || '',
                                    PaymentMethodName: sitem.PaymentMethodName || '',
                                    NMITransactionId: sitem.NMITransactionId || '',
                                    PaymentAmount: sitem.PaymentAmount || '',
                                    PosPaymodeReceiptNo: sitem.PosPaymodeReceiptNo || '',
                                    CardType: sitem.CardType || '',
                                });

                                if (sitem.PaymentProcessTypeId == 4) {
                                    $scope.mainNMIPaymentRequestObj.ReferenceNumber = sitem.ReferenceNumber || '';
                                } else if (sitem.PaymentProcessTypeId == 1 || sitem.PaymentProcessTypeId == 3) {
                                    $scope.mainNMIPaymentRequestObj.ReferenceNumber = resp.data.OnlineTransactionNumber;
                                } else {
                                }

                            });
                            $scope.destroyNmiCollectScript();
                        }


                        var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
                        var printTime = moment(new Date()).format("HH:mm A");
                        var printDatemTime = printDate + '  ' + printTime;
                        $scope.mainNMIPaymentRequestObj.transactionDateandtime = printDatemTime;

                        if ($scope.mainNMIPaymentRequestObj.UITransactionStatus == 'Failure') {
                            angular.forEach($scope.mainNMIPaymentRequestObj.POSMultiPaymentsArray, function (pitem) {
                                if (pitem.PaymentProcessTypeId == 1 || pitem.PaymentProcessTypeId == 3) {
                                    pitem.CardTypeId = 0;
                                    pitem.CardType = "";
                                    pitem.ReferenceNumber = "";
                                    pitem.PaymentProcessTypeId = "";
                                    pitem.PaymentProcessType = "";
                                    pitem.CardNumber = "";
                                    pitem.PoiDeviceId = "";
                                }

                            });
                        }

                        $scope.ShowPOSTransctionPopup = true;

                    }
                });

        }

        $scope.EditbacktoPOSPayment = function () {
            $scope.mainNMIPaymentRequestObj.UITransactionStatus == 'Ready';
            $scope.ShowPOSTransctionPopup = false;

        }




        function getPOSListObj() {
            var obj = {
                "BuyerId": 0,
                "BuyerName": '',
                "InvoiceId": 0,
                "InvoiceDate": '',
                "InvoiceItems": [],
                "InvoiceNumber": '',
                "PatientBalanceAmount": 0,
                "PatientPaymentAmount": 0,
                "RenderingProviderId": 0,
                "RenderingProviderName": '',
                "SoldBy": '',
                "SoldByUserId": 0,
                "TotalBalanceAmount": 0,
                "TotalChargeAmount": 0,
                "TotalDiscountAmount": 0,
                "TotalNetAmount": 0,
                "PaymentMethods": [],
                "ReferenceNumber": '',
                "PatientName": '',
                "PatientId": 0,
                "TotalPaymentAmount": 0,
                "PatientDisplayID": 0,
                "PrintedDatenTime": '',
                "OrganizationName": '',
                "OrganizationCityName": '',
                "OrganizationStateName": '',
                "OrganizationStateCode": '',
                "OrganizationZipCode": '',
                "PosChargeAmount": 0,
                "PosDiscountAmount": 0,
                "PosPatientPaymentAmt": 0,
                "PosTotalNetAmount": 0,
                "PosTotalPatbalance": 0,
                "POSIntegerNumber": 0,
                "POSDecimalNumber": 0,
                "IntegerAmountInWords": "",
                "DecimalAmountInWords": "",

            };
            return obj;
        };
        $scope.POSPrintList = function () {

            var item = $scope.PrintData;
            $scope.POSPrintMainObj = getPOSListObj();

            $scope.POSPrintMainObj.BuyerId = item.BuyerId || 0;
            $scope.POSPrintMainObj.BuyerName = item.BuyerName || '';
            $scope.POSPrintMainObj.InvoiceId = item.InvoiceId || 0;
            $scope.POSPrintMainObj.InvoiceDate = item.InvoiceDate || '';
            $scope.POSPrintMainObj.InvoiceNumber = item.InvoiceNumber || '';
            $scope.POSPrintMainObj.PatientName = item.PatientName || '';
            $scope.POSPrintMainObj.PatientId = item.PatientId || 0;
            $scope.POSPrintMainObj.PatientDisplayID = item.DisplayID || '';

            $scope.POSPrintMainObj.TotalChargeAmount = item.TotalChargeAmount || 0;
            $scope.POSPrintMainObj.TotalDiscountAmount = item.TotalDiscountAmount || 0;
            $scope.POSPrintMainObj.TotalNetAmount = item.TotalNetAmount || 0;
            $scope.POSPrintMainObj.PatientBalanceAmount = item.PatientBalanceAmount || 0;
            $scope.POSPrintMainObj.TotalBalanceAmount = item.TotalBalanceAmount || 0;
            $scope.POSPrintMainObj.SoldBy = item.SoldBy || '';
            $scope.POSPrintMainObj.SoldByUserId = item.SoldByUserId || 0;


            $scope.POSPrintMainObj.OrganizationName = item.OrganizationName || '';
            $scope.POSPrintMainObj.OrganizationAddressLine1 = item.OrganizationAddressLine1 || '';
            $scope.POSPrintMainObj.OrganizationAddressLine2 = item.OrganizationAddressLine2 || '';
            $scope.POSPrintMainObj.OrganizationCityName = item.OrganizationCityName || '';
            $scope.POSPrintMainObj.OrganizationStateCode = item.OrganizationStateCode || '';
            $scope.POSPrintMainObj.OrganizationZipCode = item.OrganizationZipCode || '';
            $scope.POSPrintMainObj.OrganizationFaxNo = item.OrganizationFaxNo || '';
            $scope.POSPrintMainObj.OrganizationNPI = item.OrganizationNPI || '';
            $scope.POSPrintMainObj.RenderingProviderName = item.RenderingProviderName || '';

            var mob = eHnoteUserDataService.UsMobileFormatChange(item.OrganizationContactNo);
            $scope.POSPrintMainObj.OrganizationContactNo = mob.UsFormatMobileNumber;


            $scope.POSPrintMainObj.PaymentMethods = angular.copy(item.PaymentMethods || []);

            $scope.POSPrintMainObj.TotalPaymentAmount = 0;
            angular.forEach($scope.POSPrintMainObj.PaymentMethods, function (pitem) {
                $scope.POSPrintMainObj.TotalPaymentAmount += Number(pitem.DepositAmount || 0);
            });

            $scope.POSPrintMainObj.InvoiceItems = angular.copy(item.InvoiceItems || []);

            $scope.POSPrintMainObj.PosChargeAmount = 0;
            $scope.POSPrintMainObj.PosDiscountAmount = 0;
            $scope.POSPrintMainObj.PosTotalNetAmount = 0;
            $scope.POSPrintMainObj.PosPatientPaymentAmt = 0;
            $scope.POSPrintMainObj.PosTotalPatbalance = 0;

            //angular.forEach($scope.POSPrintMainObj.InvoiceItems, function (Mitem) {
            //    $scope.POSPrintMainObj.PosChargeAmount += Number(Mitem.TotalChargeAmount || 0);
            //    $scope.POSPrintMainObj.PosDiscountAmount += Number(Mitem.DiscountAmount || 0);
            //    $scope.POSPrintMainObj.PosTotalNetAmount += Number(Mitem.TotalNetAmount || 0);
            //    $scope.POSPrintMainObj.PosPatientPaymentAmt += Number(Mitem.PatientPaymentAmount || 0);
            //    $scope.POSPrintMainObj.PosTotalPatbalance += Number(Mitem.PatientBalanceAmount || 0);
            //});

            //$scope.POSPrintMainObj.PosPatientPaymentAmt = item.PatientPaymentAmount || 0;

            $scope.POSPrintMainObj.PosChargeAmount = item.TotalChargeAmount || 0;
            $scope.POSPrintMainObj.PosDiscountAmount = item.TotalDiscountAmount || 0;
            $scope.POSPrintMainObj.PosTotalNetAmount = item.TotalNetAmount || 0;
            $scope.POSPrintMainObj.PosPatientPaymentAmt = item.PatientPaymentAmount || 0;
            $scope.POSPrintMainObj.PosTotalPatbalance = item.PatientBalanceAmount || 0;


            var POSIntegerNumber = Math.floor($scope.POSPrintMainObj.TotalPaymentAmount);
            var POSDecimalNumber = Math.round(($scope.POSPrintMainObj.TotalPaymentAmount - POSIntegerNumber) * 100);

            $scope.POSPrintMainObj.POSIntegerNumber = POSIntegerNumber;
            $scope.POSPrintMainObj.POSDecimalNumber = POSDecimalNumber;

            $scope.POSPrintMainObj.IntegerAmountInWords =
                eHnotePrintService.ConvertNumberToWords(POSIntegerNumber);

            if (POSDecimalNumber > 0) {
                $scope.POSPrintMainObj.DecimalAmountInWords =
                    eHnotePrintService.ConvertNumberToWords(POSDecimalNumber);
            } else {
                $scope.POSPrintMainObj.DecimalAmountInWords = '';
            }

            var printDate = $filter("date")(new Date(), "MMM-dd-yyyy");
            var printTime = moment(new Date()).format("HH:mm A");
            $scope.POSPrintMainObj.PrintedDatenTime = printDate + ' ' + printTime;

            $timeout(function () {
                var content = document.getElementById('POSPrintIndtransPopupNew').innerHTML;
                var win = window.open('', '');
                win.document.open();
                win.document.write(
                    '<html><head><link rel="stylesheet" type="text/css" href="css/billing.css" /></head>' +
                    '<body onload="window.print()" class="bodyheightprint">' +
                    content +
                    '</body></html>'
                );
                win.document.close();
            }, 50);

        };




        $scope.changedecimalvalue = function (val, item) {
            if (val !== null) {
                let inputValue = val.toString();
                inputValue = inputValue.replace(/[^0-9.]/g, '');

                if (inputValue.startsWith('.')) {
                    inputValue = '0' + inputValue;
                }
                if (inputValue.length > 1 && inputValue.startsWith('0') && !inputValue.startsWith('0.')) {
                    inputValue = inputValue.slice(1);
                }

                const decimalParts = inputValue.split('.');
                if (decimalParts.length > 2) {
                    inputValue = decimalParts[0] + '.' + decimalParts[1];
                }


                if ($scope.MainParentobj.PaymentTypeId == 3) {
                    item.PaymentAmount = inputValue;
                    item.ManualAmount = inputValue;
                } else {
                    item.DepositAmount = inputValue;
                }

                if (inputValue === '' || isNaN(parseFloat(inputValue))) {
                    val = '';
                }
            }
            $scope.CalculateLineFee(item);
        }

        $scope.AddanotherPOSpayment = function () {

            var POSAmount = parseFloat($scope.mainNMIPaymentRequestObj.POSMultiPaymentsArray[0].PaymentAmount)

            if (POSAmount == $scope.MainParentobj.PaymentAmount) {
                alertify.error("There is no Patient Balance to Add Another Payment");
                return false;
            } else {

                if ($scope.mainNMIPaymentRequestObj.POSMultiPaymentsArray.length > 0) {
                    $scope.POSpaymentObj = null;
                    $scope.POSpaymentObj = $scope.mainNMIPaymentRequestObj.POSMultiPaymentsArray[0];
                    if ($scope.POSpaymentObj.PaymentMethodId == 0) {
                        alertify.error("Please select Payment Method");
                        return false;
                    }
                    if ($scope.POSpaymentObj.PaymentAmount == "") {
                        alertify.error("Please Enter Payment Amount");
                        return false;
                    }
                    if ($scope.POSpaymentObj.PaymentMethodId == 2 || $scope.POSpaymentObj.PaymentMethodId == 3) {
                        if ($scope.POSpaymentObj.PaymentProcessTypeId == "") {
                            alertify.error("Please select Receive Via.");
                            return false;
                        }
                    }
                    if ($scope.POSpaymentObj.PaymentProcessTypeId == 4) {
                        if ($scope.POSpaymentObj.PaymentMethodId == 2 || $scope.POSpaymentObj.PaymentMethodId == 3) {

                            var cardTypeId = $scope.POSpaymentObj.CardTypeId || $scope.POSpaymentObj.CardtypeId
                            if (cardTypeId == 0) {
                                alertify.error("Please select Card Type");
                                return false;
                            }

                            if ($scope.POSpaymentObj.CardNumber == '' || $scope.POSpaymentObj.CardNumber.trim().length < 4) {
                                alertify.error("Please Enter Card Last 4 digits");
                                return false;
                            }
                        }
                    } else if ($scope.POSpaymentObj.PaymentProcessTypeId == 3) {

                        if (!window.CollectJS) {
                            alert("Payment Gateway not loaded");
                            return;
                        }

                        if ($scope.isPaymentInProgress) {
                            alertify.error("Transaction already in progress. Please wait.");
                            return;
                        }

                        if ($scope.POSpaymentObj.PaymentMethodId === 2) {
                            if (!$scope.ccValitationobj.ccnumbervalid || !$scope.ccValitationobj.cccvv || !$scope.ccValitationobj.ccexpiry) {
                                alertify.error("Please Enter the required fields");
                                return false;
                            }
                        }
                        if ($scope.POSpaymentObj.CardBillingZip == "") {
                            alertify.error("Please select Zip Code");
                            return false;
                        };
                    } else if ($scope.POSpaymentObj.PaymentProcessTypeId === 1) {
                        if ($scope.POSpaymentObj.PoiDeviceId == "") {
                            alertify.error("Please select PoiDevice");
                            return false;
                        };
                    }

                }



                $scope.mainNMIPaymentRequestObj.POSMultiPaymentsArray.push($scope.GetPOSAddanotherpayment());
            }




        }

        $scope.DeletePOSPayment = function (index, item) {
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                item.PatientDepositId = item.PatientDepositId || 0;
                if (item.PatientDepositId != 0) {
                    item.DeleteInd = "Y";
                } else {
                    $scope.mainNMIPaymentRequestObj.POSMultiPaymentsArray.splice(index, 1);
                    $scope.TotalPOSPaymentAmount = 0;
                    var allowed = parseFloat($scope.MainParentobj.PaymentAmount || 0);
                    angular.forEach($scope.mainNMIPaymentRequestObj.POSMultiPaymentsArray, function (item) {
                        $scope.TotalPOSPaymentAmount += parseFloat(item.PaymentAmount);
                    })

                    $scope.TotalAmount = $scope.TotalPOSPaymentAmount;
                    $scope.PatientRemainingBalanceAmount = allowed - $scope.TotalPOSPaymentAmount;
                }
            }, function () {

            });
        };



        $scope.ChangePatientCardType = function (Id) {
            var filtredArray = $filter("filter")($scope.AllCardTypes, { "CardtypeId": Id }, true) || [];
            if (filtredArray.length > 0) {
                $scope.ActiveDepositItem.CardType = filtredArray[0].CardType || "";
                $scope.ActiveDepositItem.CardTypeId = filtredArray[0].CardtypeId || 0;
            }
        };


        $scope.changePatPaymentProcessingType = function (id) {
            
            $scope.ActiveDepositItem.PoiDeviceId = "";
            $scope.ActiveDepositItem.CardTypeId = "";
            $scope.ActiveDepositItem.CardType = "";
            $scope.ActiveDepositItem.CardNumber = "";
            $scope.ActiveDepositItem.TransactionId = "";
            $scope.ActiveDepositItem.ACHAccountNumber = "";
            $scope.ActiveDepositItem.ACHABANumber = "";

           
            if ($scope.PatientProfileDetails && $scope.PatientProfileDetails.Patient) {
                $scope.ActiveDepositItem.CardHolderName = $scope.PatientProfileDetails.Patient[0].FullName || "";
                $scope.ActiveDepositItem.CardBillingAddress1 = $scope.PatientProfileDetails.PatientAddress.PostalAddress.AddressLine1 || "";
                $scope.ActiveDepositItem.CardBillingAddress2 = $scope.PatientProfileDetails.PatientAddress.PostalAddress.AddressLine2 || "";
                $scope.ActiveDepositItem.CardBillingZip = $scope.PatientProfileDetails.PatientAddress.PostalAddress.ZipCode || "";
                $scope.ActiveDepositItem.CardBillingCity = $scope.PatientProfileDetails.PatientAddress.PostalAddress.CityName || "";
                $scope.ActiveDepositItem.CardBillingState = $scope.PatientProfileDetails.PatientAddress.PostalAddress.StateName || "";
            }

            
            if (id === 3) {
                $scope.ActiveDepositItem.PaymentProcessTypeId = id;
                $scope.ActiveDepositItem.PaymentProcessType = "Payment Page";
                setTimeout(function () {
                    $scope.initPaymentCollectJS();
                }, 100);
            } else if (id === 1) {
                $scope.ActiveDepositItem.PaymentProcessTypeId = id;
                $scope.ActiveDepositItem.PaymentProcessType = "Device(EMV)";
                $scope.GetOrganizationPOIDeviceList();
            } else if (id === 2) {
                $scope.ActiveDepositItem.PaymentProcessTypeId = id;
                $scope.ActiveDepositItem.PaymentProcessType = "Swipe";
            } else if (id === 4) {
                $scope.ActiveDepositItem.PaymentProcessTypeId = id;
                $scope.ActiveDepositItem.PaymentProcessType = "Without Gateway";
            }
           
        };


        $scope.navtoCollectDepositPayment = function (item, ditem, index) {


            console.log("opup");
            console.log("Selected Index:", index);
            console.log("Selected Deposit Index:", $scope.DepositIndex);

            var selectedItem = ditem[$scope.DepositIndex];

            $scope.mainNMIPaymentRequestObj.PaymentAmount = selectedItem.DepositAmount || 0;


            $scope.PatientProfileDetails = $scope.PatientProfileDetails || null;

            var PaymentAmount = parseFloat($scope.mainNMIPaymentRequestObj.PaymentAmount) || 0;
            if (PaymentAmount == 0) {
                alertify.error("Please Enter Payment Amount");
                return false;
            }

            if (selectedItem.HospitalId == 0) {
                alertify.error("Please select Office Location");
                return false;
            };
            selectedItem.BillingProviderId = selectedItem.BillingProviderId || 0;
            if (selectedItem.BillingProviderId == 0) {
                alertify.error("Please select Billing Provider");
                return false;
            };

            if (selectedItem.PaymentModeId == 0) {
                alertify.error("Please select payment method");
                return false;
            };


            //if ($scope.MainParentobj.PaymentTypeId == 2) {
            //    if ($scope.TotalDepositAmount > $scope.MainParentobj.PaymentAmount) {
            //        alertify.error("The Collected Amount exceeds the total payable amount. Please enter a valid amount.");
            //        return false;
            //    }
            //}

            var Obj = {
                "item": item,
                "PatientDepositLineItem": selectedItem,
                "HospitalId": $scope.HospitalId,
                "Index": $scope.DepositIndex,
                "PatientProfileDetails": $scope.PatientProfileDetails,
            }


            Obj = Obj || null;
            $scope.PatientDepositLineItemObj = Obj.PatientDepositLineItem || null;
            $scope.Index = Obj.Index || 0;
            var PatientProfileDetails = Obj.PatientProfileDetails || null;
            $scope.ShowCollectpaymetnpaymentPopup = false;
            $scope.isPaymentInProgress = false;

            $scope.SaveDepositPaymentReqObj.CardHolderName = PatientProfileDetails.Patient[0].FullName || "";
            $scope.SaveDepositPaymentReqObj.PatientFullName = PatientProfileDetails.Patient[0].FullName || "";
            $scope.SaveDepositPaymentReqObj.PatientMrno = PatientProfileDetails.Patient[0].PatientDisplayId || "";
            $scope.SaveDepositPaymentReqObj.CardBillingAddress1 = PatientProfileDetails.PatientAddress.PostalAddress.AddressLine1 || "";
            $scope.SaveDepositPaymentReqObj.CardBillingAddress2 = PatientProfileDetails.PatientAddress.PostalAddress.AddressLine2 || "";
            $scope.SaveDepositPaymentReqObj.CardBillingZip = PatientProfileDetails.PatientAddress.PostalAddress.ZipCode || "";
            $scope.SaveDepositPaymentReqObj.CardBillingCity = PatientProfileDetails.PatientAddress.PostalAddress.CityName;
            $scope.SaveDepositPaymentReqObj.CardBillingState = PatientProfileDetails.PatientAddress.PostalAddress.StateName;

            if ($scope.PatientDepositLineItemObj != null || $scope.PatientDepositLineItemObj != undefined) {


                $scope.SaveDepositPaymentReqObj.HospitalId = $scope.PatientDepositLineItemObj.HospitalId;
                $scope.SaveDepositPaymentReqObj.HospitalName = $scope.PatientDepositLineItemObj.HospitalName;

                $scope.SaveDepositPaymentReqObj.HopitalObj = $scope.HopitalObj;
                $scope.SaveDepositPaymentReqObj.MerchentId = $scope.PatientDepositLineItemObj.MerchentId;
                $scope.SaveDepositPaymentReqObj.ProcessorId = $scope.PatientDepositLineItemObj.ProcessorId;
                $scope.SaveDepositPaymentReqObj.ProcessorName = $scope.PatientDepositLineItemObj.ProcessorName;
                $scope.SaveDepositPaymentReqObj.TokenizationKey = $scope.PatientDepositLineItemObj.TokenizationKey || '';
                $scope.SaveDepositPaymentReqObj.BillingProviderId = $scope.PatientDepositLineItemObj.BillingProviderId;
                $scope.SaveDepositPaymentReqObj.BillingProviderName = $scope.PatientDepositLineItemObj.BillingProviderName;
                $scope.PatientDepositLineItemObj.RenderingProviderObj = $scope.PatientDepositLineItemObj.RenderingProviderObj || {};
                if ($scope.PatientDepositLineItemObj.RenderingProviderObj != {}) {
                    $scope.PatientDepositLineItemObj.RenderingProviderObj.SecondUserFullName = $scope.PatientDepositLineItemObj.RenderingProviderObj.SecondUserFullName;
                    $scope.SaveDepositPaymentReqObj.RenderingProviderName = $scope.PatientDepositLineItemObj.RenderingProviderObj.SecondUserFullName;
                }
                $scope.SaveDepositPaymentReqObj.DepositTypeName = $scope.PatientDepositLineItemObj.DepositTypeName;
                $scope.SaveDepositPaymentReqObj.PaymentAmount = $scope.PatientDepositLineItemObj.DepositAmount;
                $scope.SaveDepositPaymentReqObj.PaymentModeId = $scope.PatientDepositLineItemObj.PaymentModeId;
                $scope.SaveDepositPaymentReqObj.PaymentMode = $scope.PatientDepositLineItemObj.PaymentMode;
                //$scope.SaveDepositPaymentReqObj.PaymentNote = $scope.mainNMIPaymentRequestObj.PaymentNote;
                $scope.SaveDepositPaymentReqObj.PaymentNote = $scope.PatientDepositLineItemObj.Notes;
                $scope.SaveDepositPaymentReqObj.PaymentDate = $scope.mainNMIPaymentRequestObj.PaymentDate;
                $scope.SaveDepositPaymentReqObj.RecievedUserId = $scope.mainNMIPaymentRequestObj.RecievedUserId;
                $scope.SaveDepositPaymentReqObj.RecievedUserName = $scope.mainNMIPaymentRequestObj.RecievedUserObj.SecondUserFullName;


                $scope.SaveDepositPaymentReqObj.DepositTypeId = $scope.PatientDepositLineItemObj.DepositTypeId;
                $scope.SaveDepositPaymentReqObj.DepositTypeName = $scope.PatientDepositLineItemObj.DepositTypeName;

                $scope.SaveDepositPaymentReqObj.RenderingProviderId = selectedItem.RenderingProviderId || 0;
            }


            if ($scope.SaveDepositPaymentReqObj.PaymentModeId == 2 || $scope.SaveDepositPaymentReqObj.PaymentModeId == 3 || $scope.SaveDepositPaymentReqObj.PaymentModeId == 7) {
                if ($scope.SaveDepositPaymentReqObj.PaymentProcessTypeId == "") {
                    alertify.error("Please select Receive Via");
                    return false;
                }
            }

            if ($scope.SaveDepositPaymentReqObj.PaymentModeId == 2 || $scope.SaveDepositPaymentReqObj.PaymentModeId == 3) {
                if ($scope.SaveDepositPaymentReqObj.CardTypeId == 0) {
                    alertify.error("Please select Card Type");
                    return;
                }
                if ($scope.SaveDepositPaymentReqObj.CardNumber == '' || $scope.SaveDepositPaymentReqObj.CardNumber.trim().length < 4) {
                    alertify.error("Please Enter Card Last 4 digits");
                    return;
                }
            }

            if ($scope.SaveDepositPaymentReqObj.PaymentModeId == 5) {
                if ($scope.SaveDepositPaymentReqObj.ChequeNumber == "") {
                    alertify.error("Please Enter Check Number");
                    return false;
                }
            }


            if (+$scope.SaveDepositPaymentReqObj.PaymentTypeId === 1) {


                $scope.SaveDepositPaymentReqObj.DepositStatusId = 1;
                $scope.SaveDepositPaymentReqObj.DepositStatus = "Deposited";
                $scope.SaveDepositPaymentReqObj.PaymentTransactionTypeId = 1;
                $scope.SaveDepositPaymentReqObj.PaymentTransactionType = "Credit";
                $scope.SaveDepositPaymentReqObj.Remarks = "";

                $scope.AddPaymentModeObj = angular.copy($scope.GetPaymentmodeList());
                $scope.AddPaymentModeObj.PaymentMethodId = $scope.SaveDepositPaymentReqObj.PaymentModeId;
                $scope.AddPaymentModeObj.PaymentMethodName = $scope.SaveDepositPaymentReqObj.PaymentMode;
                $scope.AddPaymentModeObj.DepositAmount = $scope.SaveDepositPaymentReqObj.PaymentAmount || 0;
                $scope.AddPaymentModeObj.ReferenceNumber = $scope.SaveDepositPaymentReqObj.TransactionId || "";
                $scope.AddPaymentModeObj.NMITransactionId = $scope.SaveDepositPaymentReqObj.NMITransactionId || 0;
                $scope.AddPaymentModeObj.OnlineTransactionNumber = $scope.SaveDepositPaymentReqObj.TransactionId || '';
                $scope.AddPaymentModeObj.PaymentProcessTypeId = $scope.SaveDepositPaymentReqObj.PaymentProcessTypeId || 0;
                $scope.AddPaymentModeObj.PaymentProcessType = $scope.SaveDepositPaymentReqObj.PaymentProcessType || "";
                $scope.AddPaymentModeObj.CardType = $scope.SaveDepositPaymentReqObj.CardType || "";
                $scope.AddPaymentModeObj.CardTypeId = $scope.SaveDepositPaymentReqObj.CardTypeId || "";
                $scope.AddPaymentModeObj.CardNumber = $scope.SaveDepositPaymentReqObj.CardNumber || "";
                $scope.AddPaymentModeObj.ChequeNumber = $scope.SaveDepositPaymentReqObj.ChequeNumber || "";
                $scope.AddPaymentModeObj.BillPaymentTypeId = $scope.SaveDepositPaymentReqObj.PaymentTypeId;
                $scope.AddPaymentModeObj.BillPaymentType = $scope.SaveDepositPaymentReqObj.PaymentType;
                $scope.AddPaymentModeObj.PaymentTransactionTypeId = $scope.SaveDepositPaymentReqObj.PaymentTransactionTypeId || 0;
                $scope.AddPaymentModeObj.PaymentTransactionType = $scope.SaveDepositPaymentReqObj.PaymentTransactionType || "";
                $scope.AddPaymentModeObj.Remarks = $scope.SaveDepositPaymentReqObj.Remarks || "";

                $scope.navtoAddPatientDeposits($scope.AddPaymentModeObj, $scope.SaveDepositPaymentReqObj, $scope.Index)
            }
            else if (+$scope.SaveDepositPaymentReqObj.PaymentTypeId === 2) {

                $scope.SaveDepositPaymentReqObj.DepositStatusId = 1;
                $scope.SaveDepositPaymentReqObj.DepositStatus = "Deposited";
                $scope.SaveDepositPaymentReqObj.PaymentTransactionTypeId = 1;
                $scope.SaveDepositPaymentReqObj.PaymentTransactionType = "Credit";
                $scope.SaveDepositPaymentReqObj.Remarks = "";

                $scope.AddPaymentModeObj = angular.copy($scope.GetAllocatePaymentmethodList());
                $scope.AddPaymentModeObj.PaymentMethodId = $scope.SaveDepositPaymentReqObj.PaymentModeId;
                $scope.AddPaymentModeObj.PaymentMethodName = $scope.SaveDepositPaymentReqObj.PaymentMode;
                $scope.AddPaymentModeObj.DepositAmount = $scope.SaveDepositPaymentReqObj.PaymentAmount || 0;
                $scope.AddPaymentModeObj.ReferenceNumber = $scope.SaveDepositPaymentReqObj.TransactionId || "";
                $scope.AddPaymentModeObj.NMITransactionId = $scope.SaveDepositPaymentReqObj.NMITransactionId || 0;
                $scope.AddPaymentModeObj.OnlineTransactionNumber = $scope.SaveDepositPaymentReqObj.TransactionId || '';
                $scope.AddPaymentModeObj.PaymentProcessTypeId = $scope.SaveDepositPaymentReqObj.PaymentProcessTypeId || 0;
                $scope.AddPaymentModeObj.PatientDepositId = $scope.SaveDepositPaymentReqObj.PatientDepositId || 0;
                $scope.AddPaymentModeObj.PaymentProcessType = $scope.SaveDepositPaymentReqObj.PaymentProcessType || "";
                $scope.AddPaymentModeObj.CardType = $scope.SaveDepositPaymentReqObj.CardType || "";
                $scope.AddPaymentModeObj.CardTypeId = $scope.SaveDepositPaymentReqObj.CardTypeId || "";
                $scope.AddPaymentModeObj.CardNumber = $scope.SaveDepositPaymentReqObj.CardNumber || "";
                $scope.AddPaymentModeObj.ChequeNumber = $scope.SaveDepositPaymentReqObj.ChequeNumber || "";
                $scope.AddPaymentModeObj.BillPaymentTypeId = $scope.SaveDepositPaymentReqObj.PaymentTypeId;
                $scope.AddPaymentModeObj.BillPaymentType = $scope.SaveDepositPaymentReqObj.PaymentType;
                $scope.AddPaymentModeObj.PaymentTransactionTypeId = $scope.SaveDepositPaymentReqObj.PaymentTransactionTypeId || 0;
                $scope.AddPaymentModeObj.PaymentTransactionType = $scope.SaveDepositPaymentReqObj.PaymentTransactionType || "";
                $scope.AddPaymentModeObj.Remarks = $scope.SaveDepositPaymentReqObj.Remarks || "";

                $scope.navtoAddPatientDeposits($scope.AddPaymentModeObj, $scope.SaveDepositPaymentReqObj, $scope.Index);
            }
        }



        $scope.navtoCollectMulipleDepositPayments = function (closetype) {

            var Closetype = closetype || "";
            var lineItems = $scope.mainNMIPaymentRequestObj.PatientDepositLineItem || [];

            if (lineItems.some(p => !p.DepositAmount)) {
                alertify.error("Please Enter Deposit Amount");
                return false;
            }

            if (lineItems.some(p => !p.PaymentModeId || p.PaymentModeId == 0)) {
                alertify.error("Please Select Payment Mode");
                return false;
            }

            var pendingItems = lineItems.filter(function (i) { return !i.IsDepositLineItemDisabled; });

            if (pendingItems.length === 0) {
                alertify.error("No pending deposits to save.");
                return;
            }

         
            var gatewayRows = pendingItems.filter(function (item) {
                return item.PaymentProcessTypeId === 1
                    || item.PaymentProcessTypeId === 3
                    || item.PaymentModeId === 16;
            });
            if (gatewayRows.length > 1) {
                alertify.error("Only one gateway-driven payment (Card / EMV / TextToPay) is allowed per submission.");
                return;
            }

           
            var txtToPayRows = pendingItems.filter(function (item) {
                return item.PaymentModeId === 16;
            });
            if (txtToPayRows.length > 0 && pendingItems.length > 1) {
                alertify.error("TextToPay must be sent on its own. Please remove other pending rows.");
                return;
            }
            if (txtToPayRows.length > 1) {
                alertify.error("Only one TextToPay request can be sent at a time.");
                return;
            }

           
            for (var vi = 0; vi < pendingItems.length; vi++) {
                var item = pendingItems[vi];
                var n = lineItems.indexOf(item) + 1;

                if (!item.DepositAmount || parseFloat(item.DepositAmount) <= 0) {
                    alertify.error("Row " + n + ": Please enter a valid deposit amount."); return;
                }
                if (!item.HospitalId || item.HospitalId === 0) {
                    alertify.error("Row " + n + ": Please select an office location."); return;
                }
                if (!item.BillingProviderId || item.BillingProviderId === 0) {
                    alertify.error("Row " + n + ": Please select a billing provider."); return;
                }
                if (!item.PaymentModeId || item.PaymentModeId === 0) {
                    alertify.error("Row " + n + ": Please select a payment method."); return;
                }

                var mode = item.PaymentModeId;
                var procType = item.PaymentProcessTypeId;

               
                if (mode === 2 || mode === 3 || mode === 7) {
                    if (!procType || procType === "") {
                        alertify.error("Row " + n + ": Please select Receive Via for " + item.PaymentMode + "."); return;
                    }
                }

              
                if (mode === 5) {
                    if (!item.ChequeNumber || item.ChequeNumber.trim() === "") {
                        alertify.error("Row " + n + ": Please enter the check number."); return;
                    }
                }

               
                if (procType === 4) {
                    if (mode === 2 || mode === 3) {
                        if (!item.CardTypeId || item.CardTypeId === 0) {
                            alertify.error("Row " + n + ": Please select a card type."); return;
                        }
                        if (!item.CardNumber || item.CardNumber.trim().length < 4) {
                            alertify.error("Row " + n + ": Please enter the last 4 digits of the card."); return;
                        }
                    }
                    if (mode === 7) {
                        if (!item.ACHAccountNumber || item.ACHAccountNumber.trim() === "") {
                            alertify.error("Row " + n + ": Please enter the ACH account number."); return;
                        }
                        if (!item.ACHABANumber || item.ACHABANumber.trim() === "") {
                            alertify.error("Row " + n + ": Please enter the ACH routing number."); return;
                        }
                    }
                }

               
                if (procType === 1) {
                    if (!item.PoiDeviceId || item.PoiDeviceId === "") {
                        alertify.error("Row " + n + ": Please select a POI device."); return;
                    }
                }

                 
                if (procType === 3) {
                    if (mode === 2 || mode === 3) {
                        if (!$scope.ccValitationobj.ccnumbervalid ||
                            !$scope.ccValitationobj.cccvv ||
                            !$scope.ccValitationobj.ccexpiry) {
                            alertify.error("Row " + n + ": Please fill in all required card fields."); return;
                        }
                        if (!item.CardBillingZip || item.CardBillingZip.trim() === "") {
                            alertify.error("Row " + n + ": Please enter the billing zip code."); return;
                        }
                    }
                    if (mode === 7) {
                        if (!$scope.ccValitationobj.checkaccountvalid ||
                            !$scope.ccValitationobj.checkroutingnovalid ||
                            !$scope.ccValitationobj.checknamevalid) {
                            alertify.error("Row " + n + ": Please fill in all required ACH fields."); return;
                        }
                    }
                }

               
                if (mode === 16) {
                    if (!item.PatientMobile || item.PatientMobile.trim().length < 10) {
                        alertify.error("Row " + n + ": Please enter a valid 10-digit mobile number for TextToPay.");
                        return;
                    }
                    if (!item.TextToPayTopic || item.TextToPayTopic.trim() === "") {
                        alertify.error("Row " + n + ": Please enter a topic for the TextToPay message.");
                        return;
                    }
                    if (!item.TextToPayExpiration || item.TextToPayExpiration.trim() === "") {
                        item.TextToPayExpiration = "7d";
                    }
                }
            }

          
            var nmiPageLine = null;
            var nmiEMVLine = null;
            var txtToPayLine = null;

            angular.forEach(pendingItems, function (item) {
                if (item.PaymentProcessTypeId === 3 && !nmiPageLine) nmiPageLine = item;
                if (item.PaymentProcessTypeId === 1 && !nmiEMVLine) nmiEMVLine = item;
            });
            angular.forEach(pendingItems, function (item) {
                if (item.PaymentModeId === 16) {
                    txtToPayLine = item;
                } 
            });

            console.log(txtToPayLine + "__txtToPayLine");
            if (txtToPayLine) {
                if ($scope.isPaymentInProgress) {
                    alertify.error("A request is already in progress. Please wait.");
                    return;
                }
                _sendTextToPayConversation(txtToPayLine, Closetype);
                return;
            }

           
            if (nmiPageLine) {
                if (!window.CollectJS) {
                    alertify.error("Payment gateway not loaded. Please refresh and try again.");
                    return;
                }
                if ($scope.isPaymentInProgress) {
                    alertify.error("A transaction is already in progress. Please wait.");
                    return;
                }
                $scope.isPaymentInProgress = true;
                $("#maineHnoteLoader").show();
                CollectJS.startPaymentRequest();
                return;
            }

           
            if (nmiEMVLine) {
                _multiDepositBuildAndSave("", nmiEMVLine, pendingItems, Closetype);
                return;
            }

           
            _multiDepositBuildAndSave("", null, pendingItems, Closetype);
        };

        function _sendTextToPayConversation(lineItem, Closetype) {

            if ($scope.isPaymentInProgress) {
                alertify.error("A request is already in progress. Please wait.");
                return;
            }

            var textToPaySndignMobileNo = "";
            console.log(lineItem.TransactionCategoryId + "__TransactionCategoryId");
            textToPaySndignMobileNo = $scope.textToPayUSnumberString;
 
            lineItem.OriginalAmount = parseFloat(lineItem.DepositAmount || 0);
            lineItem.ConvenienceFeeAmount = 0;
            lineItem.FinalChargedAmount = lineItem.OriginalAmount;
            lineItem.ConvenienceFeeTypeId = 0;
            lineItem.ConvenienceFeeType = "";

            if ($scope.IsConvenienceFeeEnabledForPaymentGateway &&
                (lineItem.PaymentModeId === 2 || lineItem.PaymentModeId === 3 ||
                    lineItem.PaymentModeId === 7 || lineItem.PaymentModeId === 16)) {

                var feeConfig = $scope.ConvenienceFeeMap
                    ? $scope.ConvenienceFeeMap[lineItem.PaymentModeId]
                    : null;

                if (feeConfig &&
                    feeConfig.IsActive &&
                    feeConfig.IsConvenienceFeeEnabled &&
                    parseFloat(feeConfig.ConvenienceFeeValue) > 0) {

                    var feeValue = parseFloat(feeConfig.ConvenienceFeeValue) || 0;
                    var feeTypeId = feeConfig.ConvenienceFeeTypeId;
                    var minFee = parseFloat(feeConfig.MinimumConvenienceFeeAmount) || 0;
                    var maxFee = parseFloat(feeConfig.MaximumConvenienceFeeAmount) || 0;

                    if (feeTypeId === 2) {
                        lineItem.ConvenienceFeeAmount = (lineItem.OriginalAmount * feeValue) / 100;
                        if (minFee > 0 && lineItem.OriginalAmount > 0 && lineItem.ConvenienceFeeAmount < minFee) {
                            lineItem.ConvenienceFeeAmount = minFee;
                        }
                        if (maxFee > 0 && lineItem.ConvenienceFeeAmount > maxFee) {
                            lineItem.ConvenienceFeeAmount = maxFee;
                        }
                    } else if (feeTypeId === 1) {
                        lineItem.ConvenienceFeeAmount = lineItem.OriginalAmount > 0 ? feeValue : 0;
                    }

                    lineItem.ConvenienceFeeAmount = $scope.roundHalfUp(lineItem.ConvenienceFeeAmount);
                    lineItem.ConvenienceFeeTypeId = feeTypeId;
                    lineItem.ConvenienceFeeType = feeConfig.ConvenienceFeeType || "";
                }

                lineItem.FinalChargedAmount = $scope.roundHalfUp(lineItem.OriginalAmount + lineItem.ConvenienceFeeAmount);
            }

            console.log("TextToPay Amounts: Original=" + lineItem.OriginalAmount
                + " Fee=" + lineItem.ConvenienceFeeAmount
                + " FinalCharged=" + lineItem.FinalChargedAmount);


            var hasConvFee = lineItem.ConvenienceFeeAmount > 0;

            var patientFirstName = $scope.mainNMIPaymentRequestObj.PatientFirstName || "";
            var patientLastName = $scope.mainNMIPaymentRequestObj.PatientLastName || "";
            var patientFullName = (patientFirstName + " " + patientLastName).trim();
            if (!patientFullName) patientFullName = "the patient";
            var dynamicTopic = "";
            var dynamicInstructions = "";
            var orgName = lineItem.HospitalName
                || $scope.mainNMIPaymentRequestObj.OrganizationName
                || $scope.mainNMIPaymentRequestObj.HospitalName
                || "the clinic";

            console.log(orgName);

            var originalStr = (lineItem.OriginalAmount || 0).toFixed(2);
            var feeStr = (lineItem.ConvenienceFeeAmount || 0).toFixed(2);
            var totalStr = (lineItem.FinalChargedAmount || 0).toFixed(2);
            
            if (hasConvFee) {
               
                dynamicInstructions =
                    "Hi " + patientFirstName + ", "
                    + "here is the Payment request from " + orgName + " of $" + originalStr + ". "
                    + "A convenience fee of $" + feeStr + " applies for online payment. "
                    + "Total Amount to Pay: $" + totalStr + ".";

              
                dynamicTopic = "your balance incl. $" + feeStr + " conv fee";

            } else {
                
                dynamicInstructions =
                    "Hi " + patientFirstName + ", "
                    + "here is the Payment request from " + orgName + " of $" + originalStr + ".";

                dynamicTopic = "your patient balance payment";
            }

        
            if (dynamicTopic.length > 50) {
                dynamicTopic = dynamicTopic.substring(0, 50);
            }

          
            var payload = {
                OrganizationId: $scope.mainNMIPaymentRequestObj.HospitalId || 0,
                MerchantId: "",
                ProcessorId: lineItem.ProcessorId || "",
                Phone: textToPaySndignMobileNo,
                Amount: parseFloat(lineItem.FinalChargedAmount) || 0,
                OriginalAmount: parseFloat(lineItem.OriginalAmount) || 0,
                ConvenienceFeeAmount: parseFloat(lineItem.ConvenienceFeeAmount) || 0,
                FinalChargedAmount: parseFloat(lineItem.FinalChargedAmount) || 0,
                ConvenienceFeeTypeId: lineItem.ConvenienceFeeTypeId || 0,
                ConvenienceFeeType: lineItem.ConvenienceFeeType || "",
                FirstName: $scope.mainNMIPaymentRequestObj.PatientFirstName || "",
                LastName: $scope.mainNMIPaymentRequestObj.PatientLastName || "",
                Expiration: lineItem.TextToPayExpiration,
                Topic: dynamicTopic || "",
                Instructions: dynamicInstructions|| "Please complete your pending balance payment using the secure payment link below.",
                OrderId: "",
                PatientId: $scope.MainParentobj.PatientId || 0,
                UserId: $scope.MainParentobj.UserId || 0,
                PatientMrno: $scope.mainNMIPaymentRequestObj.PatientMrno || "",
                AppointmentId: $scope.MainParentobj.AppointmentId || 0,
                VisitId: $scope.mainNMIPaymentRequestObj.VisitId || 0,
                BillingProviderId: lineItem.BillingProviderId || 0,
                RenderingProviderId: lineItem.RenderingProviderId || 0,
                DepositTypeId: lineItem.DepositTypeId || 0,
                TransactionCategoryId: lineItem.TransactionCategoryId || 1
            };

        
            if (!payload.Phone || payload.Phone.length < 10) {
                alertify.error("Please enter a valid mobile number.");
                return;
            }
            if (!payload.Amount || payload.Amount <= 0) {
                alertify.error("Please enter a valid amount.");
                return;
            }
            if (!payload.Topic || payload.Topic.trim() === "") {
                alertify.error("Please enter a topic for the TextToPay message.");
                return;
            }
            if (!payload.PatientId) {
                alertify.error("Patient information is missing.");
                return;
            }
            if (!payload.OrganizationId) {
                alertify.error("Organization information is missing.");
                return;
            }

            $scope.isPaymentInProgress = true;
            $("#maineHnoteLoader").show();

            console.log("TextToPay Payload:", JSON.stringify(payload));

            eHnotePatientDataService.CreateTextToPayConversation(payload)
                .then(function (resp) {
                    $scope.isPaymentInProgress = false;
                    $("#maineHnoteLoader").hide();

                    var res = resp.data || {};

                    if (res.IsSuccess) {
                        alertify.success("TextToPay SMS sent successfully to " + payload.Phone);

                        lineItem.Status = 'Pending';
                        lineItem.IsDepositLineItemDisabled = true;
                        lineItem.PaymentProcessTypeId = 5;
                        lineItem.PaymentProcessType = "Text To Pay";
                        lineItem.TextToPayConversationId = res.Id;
                        lineItem.TextToPayRecordId = res.RecordId;
                        lineItem.TextToPayExpirationDate = res.Expiration;
                        lineItem.TextToPayConversationStatus = res.ConversationStatus || res.Status;
                        lineItem.TextToPayPaymentStatus = res.PaymentStatus || 'Pending';

                        try {
                            if ($uibModalInstance && typeof $uibModalInstance.close === 'function') {
                                $uibModalInstance.close({
                                    Status: 'Pending',
                                    TextToPaySent: true,
                                    ConversationId: res.Id,
                                    RecordId: res.RecordId
                                });
                            } else {
                                console.warn("$uibModalInstance not available");
                            }
                        } catch (closeErr) {
                            console.error("Error closing modal:", closeErr);
                        }
                    } else {
                        var errMsg = res.ErrorMessage || res.Message || "Failed to send TextToPay.";
                        alertify.error(errMsg);
                        lineItem.Status = 'Failed';
                        lineItem.TextToPayErrorMessage = errMsg;
                    }
                }, function (err) {
                    $scope.isPaymentInProgress = false;
                    $("#maineHnoteLoader").hide();
                    console.error("TextToPay error:", err);
                    alertify.error("Failed to send TextToPay. Please try again.");
                    lineItem.Status = 'Failed';
                });
        }

        function _multiDepositBuildAndSave(paymentToken, nmiLineItem, pendingItems, Closetype) {
            var closeType = Closetype || "";
            var PaymentDate = $filter("date")($scope.mainNMIPaymentRequestObj.PaymentDate, 'MM-dd-yyyy HH:mm:ss');

            angular.forEach($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (item) {
                if (item.TransactionId != '' && item.ReferenceNumber == undefined) {
                    item.ReferenceNumber = item.TransactionId || '';
                }
            });

            var allSiblingItems = [];
            if ($scope.IsEditLineItemMode && $scope.EditingLineItem) {
                var editingDepositId = $scope.EditingLineItem.PatientDepositId;
                allSiblingItems = ($scope.mainNMIPaymentRequestObj.PatientDepositLineItem || []).filter(function (i) {
                    return i.PatientDepositId === editingDepositId;
                });
            } else {
                allSiblingItems = $scope.mainNMIPaymentRequestObj.PatientDepositLineItem || [];
            }

            var totalOriginal = 0;
            var totalConvFee = 0;
            var totalFinal = 0;
            var gatewayAmount = 0;

           
            angular.forEach(allSiblingItems, function (item) {

                console.log(item.DepositAmount + "__" + item.PaymentAmount);

                item.OriginalAmount = parseFloat(item.DepositAmount || 0);
                item.ConvenienceFeeAmount = 0;
                item.FinalChargedAmount = item.OriginalAmount;
                item.ConvenienceFeeTypeId = 0;
                item.ConvenienceFeeType = "";

                if ($scope.IsConvenienceFeeEnabledForPaymentGateway &&
                    (item.PaymentModeId === 2 || item.PaymentModeId === 3 || item.PaymentModeId === 7)) {

                    var feeConfig = $scope.ConvenienceFeeMap
                        ? $scope.ConvenienceFeeMap[item.PaymentModeId]
                        : null;

                    if (feeConfig &&
                        feeConfig.IsActive &&
                        feeConfig.IsConvenienceFeeEnabled &&
                        parseFloat(feeConfig.ConvenienceFeeValue) > 0) {

                        var feeValue = parseFloat(feeConfig.ConvenienceFeeValue) || 0;
                        var feeTypeId = feeConfig.ConvenienceFeeTypeId;
                        var minFee = parseFloat(feeConfig.MinimumConvenienceFeeAmount) || 0;
                        var maxFee = parseFloat(feeConfig.MaximumConvenienceFeeAmount) || 0;

                        // ── Calculate raw fee (full precision, no rounding yet) ──
                        if (feeTypeId === 2) {
                            // Percentage
                            item.ConvenienceFeeAmount = (item.OriginalAmount * feeValue) / 100;

                            // Min/Max caps only apply to Percentage
                            if (minFee > 0 && item.OriginalAmount > 0 && item.ConvenienceFeeAmount < minFee) {
                                item.ConvenienceFeeAmount = minFee;
                            }
                            if (maxFee > 0 && item.ConvenienceFeeAmount > maxFee) {
                                item.ConvenienceFeeAmount = maxFee;
                            }
                        } else if (feeTypeId === 1) {
                            // Fixed — no Min/Max caps
                            item.ConvenienceFeeAmount = item.OriginalAmount > 0 ? feeValue : 0;
                        }

                        // ── FINANCIAL ROUNDING (round half up) ──
                        item.ConvenienceFeeAmount = $scope.roundHalfUp(item.ConvenienceFeeAmount);

                        item.ConvenienceFeeTypeId = feeTypeId;
                        item.ConvenienceFeeType = feeConfig.ConvenienceFeeType || "";
                    }

                    // ── Final charge = Original + Fee, also round-half-up ──
                    item.FinalChargedAmount = $scope.roundHalfUp(item.OriginalAmount + item.ConvenienceFeeAmount);
                    gatewayAmount += item.FinalChargedAmount;
                }

                // ── Accumulate totals (single pass) ──
                totalOriginal += parseFloat(item.OriginalAmount || 0);
                totalConvFee += parseFloat(item.ConvenienceFeeAmount || 0);
                totalFinal += parseFloat(item.FinalChargedAmount || 0);
            });

            // ── Round totals using round-half-up, NOT toFixed ──
            totalOriginal = $scope.roundHalfUp(totalOriginal);
            totalConvFee = $scope.roundHalfUp(totalConvFee);
            totalFinal = $scope.roundHalfUp(totalFinal);
            gatewayAmount = $scope.roundHalfUp(gatewayAmount);


            var patientDeposits = allSiblingItems.map(function (item) {

                var payModeObj = {
                    "PatientDepositPaymodeListId": item.PatientDepositPaymodeListId || 0,
                    "PaymentMethodId": item.PaymentModeId,
                    "PaymentMethodName": item.PaymentMode,
                    "DepositAmount": parseFloat(item.DepositAmount) || 0,
                    "OriginalAmount": parseFloat(item.OriginalAmount) || 0,
                    "ConvenienceFeeAmount": parseFloat(item.ConvenienceFeeAmount) || 0,
                    "FinalChargedAmount": parseFloat(item.FinalChargedAmount) || 0,
                    "ReferenceNumber": item.TransactionId || "",
                    "IsDepositAdded": false,
                    "DeleteInd": "N",
                    "PatientDepositId": item.PatientDepositId || 0,
                    "CardNumber": item.CardNumber || "",
                    "CardType": item.CardType || "",
                    "CardTypeId": item.CardTypeId || 0,
                    "NMITransactionId": item.NMITransactionId || 0,
                    "PaymentProcessTypeId": item.PaymentProcessTypeId || 0,
                    "PaymentProcessType": item.PaymentProcessType || "",
                    "OnlineTransactionNumber": item.OnlineTransactionNumber || "",
                    "BillPaymentTypeId": $scope.mainNMIPaymentRequestObj.PaymentTypeId,
                    "BillPaymentType": $scope.mainNMIPaymentRequestObj.PaymentType,
                    "PaymentTransactionTypeId": 1,
                    "PaymentTransactionType": "Credit",
                    "ChequeNumber": item.ChequeNumber || "",
                    "Remarks": item.Notes || "",
                    "DepositTypeId": item.DepositTypeId || "",
                    "DepositTypeName": item.DepositTypeName || "",
                    "Notes": item.Notes || "",
                    "ACHAccountNumber": item.ACHAccountNumber || "",
                    "ACHABANumber": item.ACHABANumber || "",
                    "BillingProviderId": item.BillingProviderId,
                    "RenderingProviderId": item.RenderingProviderId || 0,
                    "OrganizationId": item.OrganizationId || 0
                };

                return {
                    "UserId": $scope.MainParentobj.UserId,
                    "PatientDepositId": item.PatientDepositId || 0,
                    "PatientId": $scope.MainParentobj.PatientId || 0,
                    "ReceiptNo": "",
                    "ReceiptId": 0,
                    "DepositDate": $filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss'),
                    "PaymentDate": PaymentDate,
                    "DepositAmount": parseFloat(item.DepositAmount) || 0,
                    "OriginalAmount": parseFloat(item.OriginalAmount) || 0,
                    "ConvenienceFeeAmount": parseFloat(item.ConvenienceFeeAmount) || 0,
                    "FinalChargedAmount": parseFloat(item.FinalChargedAmount) || 0,
                    "DepositedByUserId": $scope.mainNMIPaymentRequestObj.RecievedUserId || 0,
                    "DepositedBy": $scope.mainNMIPaymentRequestObj.RecievedUserName || "",
                    "UnBilledAmount": parseFloat(item.DepositAmount) || 0,
                    "BilledAmount": 0,
                    "DeleteInd": "N",
                    "AppointmentId": $scope.MainParentobj.AppointmentId || 0,
                    "BillingProviderId": item.BillingProviderId,
                    "PaymentMethodId": item.PaymentModeId,
                    "PaymentMethodName": item.PaymentMode,
                    "ChequeNumber": item.ChequeNumber || "",
                    "CardNumber": item.CardNumber || "",
                    "CardType": item.CardType || "",
                    "CardTypeId": item.CardTypeId || 0,
                    "OnlineTransactionNumber": "",
                    "NMITransactionId": 0,
                    "CardName": "",
                    "CardExpiry": "",
                    "Notes": $scope.mainNMIPaymentRequestObj.PaymentNote || "",
                    "BatchNumber": $scope.MainParentobj.BatchNumber || "",
                    "OrganizationFacilityId": item.HospitalId,
                    "FacilityName": item.HospitalName || "",
                    "IsConsent": false,
                    "IsDepositPrint": $scope.MainParentobj.IsDepositPrint || false,
                    "IsEmail": false,
                    "DepositStatusId": 1,
                    "DepositStatus": "Deposited",
                    "PageSize": 10,
                    "PageNumber": 1,
                    "PatientDepositPaymodeList": [payModeObj],
                    "RenderingProviderId": item.RenderingProviderId || 0,
                    "DepositTypeId": item.DepositTypeId || 0,
                    "DepositType": item.DepositTypeName || "",
                    "PaymentTransactionTypeId": 1,
                    "PaymentTransactionType": "Credit",
                    "OrganizationTransactionId": item.OrganizationTransactionId || $scope.mainNMIPaymentRequestObj.OrganizationTransactionId,
                    "OrganizationTransactionName": item.OrganizationTransactionName || $scope.mainNMIPaymentRequestObj.OrganizationTransactionName,
                    "OrganizationId": item.HospitalId,
                    "OrganizationName": item.HospitalName || "",
                    "Remarks": "",
                    "RecievedUserId": $scope.mainNMIPaymentRequestObj.RecievedUserId || 0,
                    "RecievedUserName": $scope.mainNMIPaymentRequestObj.RecievedUserName || "",
                    "ACHAccountNumber": item.ACHAccountNumber || "",
                    "ACHABANumber": item.ACHABANumber || ""
                };
            });

            // ── Build NMI transaction wrapper ─────────────────────────────────
            // All card/billing fields read from nmiLineItem directly (ActiveDepositItem)
            var nmiObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());

            nmiObj.NMITransactionId = 0;
            nmiObj.UserId = $scope.mainNMIPaymentRequestObj.RecievedUserId;
            nmiObj.PatientId = $scope.mainNMIPaymentRequestObj.PatientId;
            nmiObj.OrganizationId = nmiLineItem ? nmiLineItem.HospitalId : $scope.mainNMIPaymentRequestObj.HospitalId;
            nmiObj.PaymentAmount = nmiLineItem ? parseFloat(nmiLineItem.FinalChargedAmount) || 0 : totalFinal;
            nmiObj.OriginalAmount = nmiLineItem ? parseFloat(nmiLineItem.OriginalAmount) || 0 : totalOriginal;
            nmiObj.ConvenienceFeeAmount = nmiLineItem ? parseFloat(nmiLineItem.ConvenienceFeeAmount) || 0 : totalConvFee;
            nmiObj.FinalChargedAmount = nmiLineItem ? parseFloat(nmiLineItem.FinalChargedAmount) || 0 : totalFinal;
            nmiObj.MerchentId = nmiLineItem ? (nmiLineItem.MerchentId || "") : "";
            nmiObj.MerchentName = nmiLineItem ? (nmiLineItem.MerchentName || "") : "";
            nmiObj.PaymentToken = paymentToken || "";
            nmiObj.CardHolderName = nmiLineItem ? (nmiLineItem.CardHolderName || "") : "";
            nmiObj.PatientEmail = $scope.mainNMIPaymentRequestObj.PatientEmailId || "";
            nmiObj.PatientMobile = $scope.mainNMIPaymentRequestObj.PatientMobileNumber || "";
            nmiObj.PatientMrNo = $scope.mainNMIPaymentRequestObj.PatientMrno || "";
            nmiObj.CardBillingAddress1 = nmiLineItem ? (nmiLineItem.CardBillingAddress1 || "") : "";
            nmiObj.CardBillingAddress2 = nmiLineItem ? (nmiLineItem.CardBillingAddress2 || "") : "";
            nmiObj.CardBillingState = nmiLineItem ? (nmiLineItem.CardBillingState || "") : "";
            nmiObj.CardBillingCity = nmiLineItem ? (nmiLineItem.CardBillingCity || "") : "";
            nmiObj.CardBillingZip = nmiLineItem ? (nmiLineItem.CardBillingZip || "") : "";
            nmiObj.ProcessorId = nmiLineItem ? (nmiLineItem.ProcessorId || "") : "";
            nmiObj.ProcessorName = nmiLineItem ? (nmiLineItem.ProcessorName || "") : "";
            nmiObj.TokenizationKey = nmiLineItem ? (nmiLineItem.TokenizationKey || "") : "";
            nmiObj.OrderId = "";
            nmiObj.OrderDescription = $scope.mainNMIPaymentRequestObj.PatientFirstName +
                " Multi-Deposit on " +
                $filter('date')(new Date(), 'MM-dd-yyyy');
            nmiObj.TransactionId = 0;
            nmiObj.ResponseId = 0;
            nmiObj.ResponseCode = "";
            nmiObj.ResponseText = "";
            nmiObj.Status = "";
            nmiObj.TransactionTypeId = $scope.mainNMIPaymentRequestObj.TransactionTypeId;
            nmiObj.TransactionType = $scope.mainNMIPaymentRequestObj.TransactionType;
            nmiObj.BillPaymentTypeId = $scope.mainNMIPaymentRequestObj.PaymentTypeId;
            nmiObj.BillPaymentType = $scope.mainNMIPaymentRequestObj.PaymentType;
            nmiObj.DeleteInd = "N";
            nmiObj.Type = $scope.mainNMIPaymentRequestObj.TransactionType;
            nmiObj.AppointmentId = $scope.mainNMIPaymentRequestObj.AppointmentId || 0;
            nmiObj.VisitId = $scope.mainNMIPaymentRequestObj.VisitId || 0;
            nmiObj.PoiDeviceId = nmiLineItem ? (nmiLineItem.PoiDeviceId || "") : "";
            nmiObj.ResponseMethod = (nmiLineItem && nmiLineItem.PaymentProcessTypeId === 1) ? "synchronous" : "";
            nmiObj.PaymentProcessTypeId = nmiLineItem ? (nmiLineItem.PaymentProcessTypeId || 0) : 0;
            nmiObj.PaymentProcessType = nmiLineItem ? (nmiLineItem.PaymentProcessType || "") : "";
            nmiObj.PaymentModeId = nmiLineItem ? nmiLineItem.PaymentModeId : 0;
            nmiObj.PaymentMode = nmiLineItem ? nmiLineItem.PaymentMode : "";
            nmiObj.CardNumber = nmiLineItem ? (nmiLineItem.CardNumber || "") : "";
            nmiObj.CardTypeId = nmiLineItem ? (nmiLineItem.CardTypeId || 0) : 0;
            nmiObj.CardType = nmiLineItem ? (nmiLineItem.CardType || "") : "";
            nmiObj.PaymentType = (nmiLineItem && nmiLineItem.PaymentModeId === 7) ? 'check' : 'creditcard';

            nmiObj.PatientDeposits = patientDeposits;
            nmiObj.TransactionCategoryId = $scope.MainParentobj.TransactionCategoryId || 1;
            nmiObj.TransactionCategoryName = $scope.MainParentobj.TransactionCategoryName || 'Deposit';
            nmiObj.TransactionSessionId = $scope.kountSessionId || "";
            

            console.log(JSON.stringify(nmiObj));

            eHnotePaymentGatewayService.PaymentProcessandAddDeposit(nmiObj)
                .then(function (resp) {

                    var res = resp.data || {};
                    var insertResults = res.DepositInsertResults || [];
                    var overallStatus = 'Success';

                    $scope.IsEditLineItemMode = false;
                    $scope.EditingLineItem = null;
                    $scope.EditingLineItemIndex = null;

                    // ── NMI gateway response — only drives status when gateway used ──
                    var gatewayWasUsed = nmiObj.PaymentProcessTypeId === 3
                        || nmiObj.PaymentProcessTypeId === 1;

                    if (res.NMITransactionResponse && gatewayWasUsed) {
                        var nmiR = res.NMITransactionResponse;
                        if (nmiR.ResponseId === 1) {
                            alertify.success(nmiR.ResponseText);
                            $scope.mainNMIPaymentRequestObj.NMITransactionId = nmiR.NMITransactionId;
                            $scope.mainNMIPaymentRequestObj.TransactionId = nmiR.TransactionId;
                        } else {
                            alertify.error(nmiR.ResponseText);
                            overallStatus = 'Failed';
                            $scope.mainNMIPaymentRequestObj.UITransactionStatus = 'Failure';
                        }
                    }

                    var result = insertResults[0];

                    angular.forEach(insertResults[0].PatientDepositPaymodeList, function (pitem) {
                        pitem.ReceiptNo = result.ReceiptNo || '';
                    });

                    if (!result || result.Status !== 'Success') {
                        overallStatus = 'Failed';
                        alertify.error(result ? result.Message : "Deposit save failed.");
                        return;
                    }

                    angular.forEach($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (lineItem, index) {
                        if (!lineItem) return;

                        var txn = (result.DepositTransaction || []).find(function (t) {
                            return String(t.PaymentMethodId) === String(lineItem.PaymentModeId);
                        }) || {};

                        lineItem.Status = 'Success';
                        lineItem.IsDepositLineItemDisabled = true;
                        lineItem.TransactionReceiptNo = txn.TransReciptNo || "";
                        lineItem.TransactionDate = txn.TransactionDate || "";
                        lineItem.TransactionTime = txn.TransactionTime || "";
                        lineItem.ReceiptNo = result.ReceiptNo || "";
                        lineItem.PatientDepositId = result.DepositId || 0;

                        $scope.MainParentobj.PatientDepositId = result.DepositId || 0;

                        var paymodeList = result.PatientDepositPaymodeList || [];
                        var pitem = paymodeList[index];

                        if (pitem) {
                            lineItem.NMITransactionId = pitem.NMITransactionId || 0;
                            lineItem.ReferenceNumber = pitem.ReferenceNumber || "";
                            lineItem.PatientDepositPaymodeList = [pitem];
                            lineItem.PatientDepositPaymodeListId = pitem.PatientDepositPaymodeListId || 0;
                        } else {
                            lineItem.PatientDepositPaymodeList = [];
                        }
                    });

                    if (insertResults.length > 0 && insertResults[0].Status === 'Success') {
                        $scope.PatientDepositPaymodeList = [];
                        $scope.PatientDepositPaymodeList.push(
                            ...(insertResults[0].PatientDepositPaymodeList || [])
                        );
                    }

                    alertify.success("Data Saved Successfully");
                    console.log($scope.PatientDepositPaymodeList);
                    console.log("PatientDepositPaymodeList");

                    $scope.ISShowCardPaymentDetails = false;
                    $scope.mainNMIPaymentRequestObj.UITransactionStatus =
                        overallStatus === 'Success' ? 'Success' : 'Failure';

                    $scope.checkstatusCollectAndSaveButton();

                    if (overallStatus === 'Success') {
                        var returnObj = {
                            "PatientDepositLineItem": $scope.mainNMIPaymentRequestObj.PatientDepositLineItem,
                            "Status": 'Success',
                            "PatientDepositPaymodeList": $scope.PatientDepositPaymodeList.filter(function (i) {
                                return i.PaymentTransactionTypeId !== 7;
                            })
                        };

                        if (closeType == "close") {
                            $scope.destroyNmiCollectScript();
                            $uibModalInstance.close(returnObj);
                        }
                    }

                    if (closeType == "close") {
                        $scope.uibclose();
                    }

                }, function (err) {
                    console.error("Multi-deposit save error:", err);
                    $scope.isPaymentInProgress = false;
                    alertify.error("Failed to process deposits. Please try again.");
                    $("#maineHnoteLoader").hide();
                });
        }


        $scope.validateDepositMandatoryFields = function () {

            var obj = {
                "IsValid": true,
                "ErrorMsg": []
            }



        }

        $scope.GetPaymentmodeList = function () {
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
                "CardTypeId": 0,
                "NMITransactionId": "",
                "PaymentProcessTypeId": 0,
                "PaymentProcessType": "",
                "OnlineTransactionNumber": "",
                "BillPaymentTypeId": 0,
                "BillPaymentType": "",
            }
            return Obj;
        }

        $scope.navtoAddPatientDeposits = function (AddPaymentModeObj, maindepositObj, Index) {


            var PatientDepositPaymodeList = [];
            PatientDepositPaymodeList.push(AddPaymentModeObj);


            var PaymentDate = $filter("date")(maindepositObj.PaymentDate, 'MM-dd-yyyy HH:mm:ss');


            maindepositObj.DepositAmount = parseFloat(PatientDepositPaymodeList[0].DepositAmount);


            var obj = {
                "UserId": $scope.MainParentobj.UserId,
                "PatientDepositId": 0,
                "PatientId": $scope.MainParentobj.PatientId || 0,
                "ReceiptNo": "",
                "ReceiptId": 0,
                "DepositDate": $filter('date')(new Date(), 'MM-dd-yyyy HH:mm:ss'),
                "PaymentDate": PaymentDate,
                "DepositAmount": maindepositObj.DepositAmount || 0,
                "DepositedByUserId": maindepositObj.RecievedUserId,
                "DepositedBy": maindepositObj.RecievedUserName,
                "UnBilledAmount": maindepositObj.DepositAmount,
                "BilledAmount": 0,
                "DeleteInd": "N",
                "AppointmentId": $scope.MainParentobj.AppointmentId,
                "BillingProviderId": $scope.SaveDepositPaymentReqObj.BillingProviderId,
                "PaymentMethodId": maindepositObj.PaymentModeId,
                "PaymentMethodName": maindepositObj.PaymentMode,
                //  "ChequeNumber": maindepositObj.ChequeNumber,
                "ChequeNumber": maindepositObj.ChequeNumber || "",
                "CardNumber": maindepositObj.CardNumber,
                "OnlineTransactionNumber": maindepositObj.TransactionId || "",
                "NMITransactionId": maindepositObj.NMITransactionId || 0,
                "CardName": "",
                "CardExpiry": "",
                "Notes": $scope.SaveDepositPaymentReqObj.PaymentNote,
                "BatchNumber": $scope.MainParentobj.BatchNumber || "",
                "OrganizationFacilityId": maindepositObj.HospitalId,
                "FacilityName": maindepositObj.HospitalName,
                "IsConsent": false,
                "IsDepositPrint": $scope.MainParentobj.IsDepositPrint,
                "IsEmail": false,
                "DepositStatusId": maindepositObj.DepositStatusId || 1,
                "DepositStatus": maindepositObj.DepositStatus || 'Deposited',
                "PageSize": 10,
                "PageNumber": 1,
                "PatientDepositPaymodeList": PatientDepositPaymodeList || [],
                "RenderingProviderId": $scope.SaveDepositPaymentReqObj.RenderingProviderId || 0,
                "DepositTypeId": $scope.SaveDepositPaymentReqObj.DepositTypeId,
                "DepositType": $scope.SaveDepositPaymentReqObj.DepositTypeName,
                "PaymentTransactionTypeId": maindepositObj.PaymentTransactionTypeId || 1,
                "PaymentTransactionType": maindepositObj.PaymentTransactionType || 'Credit',
                "OrganizationTransactionId": $scope.SaveDepositPaymentReqObj.OrganizationTransactionId,
                "OrganizationTransactionName": $scope.SaveDepositPaymentReqObj.OrganizationTransactionName,
                "OrganizationId": $scope.SaveDepositPaymentReqObj.HospitalId,
                "OrganizationName": $scope.SaveDepositPaymentReqObj.HospitalName,
                "Remarks": $scope.SaveDepositPaymentReqObj.Remarks || "",
                "RecievedUserId": $scope.SaveDepositPaymentReqObj.RecievedUserId || "",
                "RecievedUserName": $scope.SaveDepositPaymentReqObj.RecievedUserName || "",
            };
            eHnoteInsuranceService.AddUpdatePatientDepositAmount(obj).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.SaveDepositPaymentReqObj.UITransactionStatus = resp.data.Status;
                    //$scope.SaveDepositPaymentReqObj.ResponseText = resp.data.Status;

                    if ($scope.SaveDepositPaymentReqObj.PaymentTransactionType == "Failed") {
                        alertify.error("Deposit Transaction Failed");
                    } else {
                        if (obj.PatientDepositId === 0 || obj.PatientDepositId === null) {
                            alertify.success("Added Successfully");
                        } else {
                            alertify.success("Updated Successfully");
                        }
                    }
                    $scope.IsAddMultiplePaymentbutton = false;
                    $scope.ShowCollectpaymetnpaymentPopup = true;
                    $scope.ISShowCardPaymentDetails = false;

                    $scope.DepositTransactionData = resp.data;
                    $scope.SaveDepositPaymentReqObj.TransactionReceiptNo = $scope.DepositTransactionData.TransReciptNo || '';
                    $scope.SaveDepositPaymentReqObj.DepositTransactionDate = $scope.DepositTransactionData.DepositTransaction[0].TransactionDate || '';
                    $scope.SaveDepositPaymentReqObj.TransactionDate = $scope.DepositTransactionData.DepositTransaction[0].TransactionDate || '';
                    $scope.SaveDepositPaymentReqObj.TransactionTime = $scope.DepositTransactionData.DepositTransaction[0].TransactionTime || '';
                    $scope.SaveDepositPaymentReqObj.ReceiptNo = $scope.DepositTransactionData.ReceiptNo || '';
                    $scope.SaveDepositPaymentReqObj.ReferenceNumber = $scope.DepositTransactionData.PatientDepositPaymodeList[0].ReferenceNumber || '';

                    $scope.SaveDepositPaymentReqObj.PatientDepositPaymodeList = resp.data.PatientDepositPaymodeList || [];


                    if (resp.data.Status === "Success") {
                        $scope.DepositLineItemIndex = Index || 0;
                        $scope.DepositPaymentObj = $scope.SaveDepositPaymentReqObj || {};

                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem = $scope.mainNMIPaymentRequestObj.PatientDepositLineItem || [];

                        // Assign Status to selected row
                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].Status = $scope.DepositPaymentObj.UITransactionStatus || '';
                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].IsDepositLineItemDisabled = true;


                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].CardType = $scope.DepositPaymentObj.CardType;
                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].CardNumber = $scope.DepositPaymentObj.CardNumber;
                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].NMITransactionId = $scope.DepositPaymentObj.NMITransactionId;
                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].TransactionReceiptNo = $scope.DepositPaymentObj.TransactionReceiptNo;
                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].TransactionId = $scope.DepositPaymentObj.TransactionId;
                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].TransactionDate = $scope.DepositPaymentObj.TransactionDate;
                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].TransactionTime = $scope.DepositPaymentObj.TransactionTime;
                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].OrganizationName = $scope.DepositPaymentObj.HospitalName;
                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].OrganizationId = $scope.DepositPaymentObj.HospitalId;
                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].ChequeNumber = $scope.DepositPaymentObj.ChequeNumber;
                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].ReceiptNo = $scope.DepositPaymentObj.ReceiptNo;
                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].PatientDepositPaymodeList = $scope.DepositPaymentObj.PatientDepositPaymodeList || [];
                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].PatientDepositId = $scope.DepositPaymentObj.PatientDepositPaymodeList[0].PatientDepositId || 0;
                        $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].IsShoweachDepositNotes = false;
                        $scope.DepositPaymentObj.PatientDepositPaymodeList[0].ReceiptNo = $scope.DepositPaymentObj.PatientDepositPaymodeList[0].ReceiptNo || '';
                        $scope.DepositPaymentObj.PatientDepositPaymodeList[0].ReceiptNo = $scope.DepositPaymentObj.ReceiptNo;
                        $scope.PatientDepositPaymodeList.push(
                            ...($scope.DepositPaymentObj.PatientDepositPaymodeList || [])
                        );

                        $scope.IsShowDepositFields = true;
                    }

                    if ($scope.MainParentobj.ClaimDataObj != null && Object.keys($scope.MainParentobj.ClaimDataObj).length > 0) {
                        if ($scope.mainNMIPaymentRequestObj.PatientDepositLineItem != null) {
                            var filtredRenderArray = $filter("filter")($scope.AllDoctorList, { "DoctorID": $scope.MainParentobj.ClaimDataObj.RenderingProviderId }, true) || [];
                            if (filtredRenderArray.length > 0) {
                                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].RenderingProviderId = filtredRenderArray[0].DoctorID;
                                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].RenderingProviderName = filtredRenderArray[0].UserFullName;
                                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].UserBranchId = filtredRenderArray[0].UserBranchId;
                                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].RenderingProviderObj = filtredRenderArray[0] || '';
                            }
                        }
                    }
                    var List1 = $filter("filter")($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (Pitem,) { return Pitem.PaymentModeId === 1; }) || [];
                  


                    var List3 = $filter("filter")($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (Pitem) {
                        return Pitem.Status === '';
                    }) || [];

                    if (List3.length !== 0) {
                        $scope.IsShowCollectpaymentbutton = false;
                    } else {
                        $scope.IsShowCollectpaymentbutton = true;
                    }

                    $scope.checkstatusCollectAndSaveButton();

                    if ($scope.DepositTransactionData.PatientDepositPaymodeList != undefined) {
                        if ($scope.DepositTransactionData.PatientDepositPaymodeList[0].PaymentMethodId == 1) {
                            $scope.uibclose();
                        }
                    }

                } else {
                    alertify.error(resp.data.Message);
                }
            });
        }

        $scope.navtoDepositOnlinePaymentGateway = function (item, ditem) {


            var selectedItem = ditem[$scope.DepositIndex];

            $scope.mainNMIPaymentRequestObj.PaymentAmount = selectedItem.DepositAmount || 0;

            if ($scope.SaveDepositPaymentReqObj.PaymentProcessTypeId == 3) {
                if (!window.CollectJS) {
                    alert("Payment Gateway not loaded");
                    return;
                }

                if ($scope.isPaymentInProgress) {
                    alertify.error("Transaction already in progress. Please wait.");
                    return;
                }


                console.log($scope.ccValitationobj);

                if ($scope.SaveDepositPaymentReqObj.PaymentModeId === 2 || $scope.SaveDepositPaymentReqObj.PaymentModeId === 3) {
                    if (!$scope.ccValitationobj.ccnumbervalid || !$scope.ccValitationobj.cccvv || !$scope.ccValitationobj.ccexpiry) {
                        alertify.error("Please Enter the required fields");
                        return false;
                    }
                }
                if ($scope.SaveDepositPaymentReqObj.PaymentModeId === 7) {
                    if (!$scope.ccValitationobj.checkaccountvalid || !$scope.ccValitationobj.checkroutingnovalid || !$scope.ccValitationobj.checknamevalid) {
                        alertify.error("Please Enter the required fields");
                        return false;
                    }
                }

                if ($scope.SaveDepositPaymentReqObj.CardBillingZip == "") {
                    alertify.error("Please select Zip Code");
                    return false;
                };

                $scope.isPaymentInProgress = true;
                $("#maineHnoteLoader").show();
                CollectJS.startPaymentRequest(event);
            }
            else if ($scope.SaveDepositPaymentReqObj.PaymentProcessTypeId == 1) {
                var PoiDeviceId = $scope.SaveDepositPaymentReqObj.PoiDeviceId || "";
                if ($scope.SaveDepositPaymentReqObj.PaymentProcessTypeId == 1) {
                    if (PoiDeviceId == "") {
                        alertify.error("Please select PoiDevice");
                        return false;
                    };
                }
                $scope.coninueprocessonlineNMIPayment("", $scope.SaveDepositPaymentReqObj, $scope.mainNMIPaymentRequestObj.PatientDepositLineItem);

            }
        };

        
        $scope.initPaymentCollectJS = function () {
            var activeItem = $scope.ActiveDepositItem;
            if (!activeItem) return;

            $scope.$on("$destroy", function () { $scope.destroyNmiCollectScript(); });

            var kountEnabled = activeItem.PaymentProcessTypeId === 3 && $scope.IsKountEnabled && $scope.mainNMIPaymentRequestObj.PublicCheckOutKey &&
                typeof Gateway !== "undefined";

            console.log($scope.mainNMIPaymentRequestObj.PublicCheckOutKey + "__PublicCheckOutKey");
             
            $scope.loadNmiCollectScript($scope.mainNMIPaymentRequestObj.TokenizationKey).then(function () {

                var fields = {};
                if (activeItem.PaymentModeId === 2 || activeItem.PaymentModeId === 3) {
                    fields = {
                        ccnumber: { selector: "#nmi-ccnumber", placeholder: "0000 0000 0000 0000", display: "required" },
                        ccexp: { selector: "#nmi-exp", placeholder: "MM/YY", display: "required" },
                        cvv: { selector: "#nmi-cvv", placeholder: "***", display: "required" }
                    };
                } else if (activeItem.PaymentModeId === 7) {
                    fields = {
                        checkaccount: { selector: "#nmi-chkacctnumber", placeholder: "Account Number" },
                        checkaba: { selector: "#nmi-checkaba", placeholder: "Routing Number" },
                        checkname: { selector: "#nmi-checkname", placeholder: "Name on Account" }
                    };
                }

                console.log(kountEnabled + "__kountEnabled");

                //kountEnabled = true;
                if (kountEnabled) {
                    try {
                        console.log($scope.mainNMIPaymentRequestObj.PublicCheckOutKey + "__PublicCheckOutKey");
                        var gateway = Gateway.create($scope.mainNMIPaymentRequestObj.PublicCheckOutKey);
                        gateway.on("error", function (e) { console.error("Gateway.js/Kount error:", e); });
                        gateway.getKount().createSession()
                            .then(function (res) {
                                $scope.kountSessionId = res;   // always keep the LATEST session id
                                console.log("Kount transaction_session_id:", res);
                            })
                            .catch(function (e) { console.error("Kount createSession failed:", e); });
                    } catch (kErr) {
                        console.error("Kount init skipped:", kErr);
                    }
                }

                window.CollectJS.configure({
                    variant: "inline",
                    currency: "USD",
                    country: "US",
                    price: activeItem.FinalChargedAmount || activeItem.DepositAmount,
                    fields: fields,
                    validationCallback: function (field, status, message) {
                        console.log(status + "__" + field);

                        if (activeItem.PaymentProcessTypeId === 3 &&
                            (activeItem.PaymentModeId === 2 || activeItem.PaymentModeId === 3)) {
                            if (field === 'ccnumber') {
                                $scope.ccValitationobj.ccnumbervalid = status;
                                if (!status) alertify.error(message);
                            }
                            if (field === 'cvv') {
                                $scope.ccValitationobj.cccvv = status;
                                if (!status) alertify.error(message);
                            }
                            if (field === 'ccexp') {
                                $scope.ccValitationobj.ccexpiry = status;
                                if (!status) alertify.error(message);
                            }
                        }

                        if (activeItem.PaymentProcessTypeId === 3 && activeItem.PaymentModeId === 7) {
                            if (field === 'checkaccount') {
                                $scope.ccValitationobj.checkaccountvalid = status;
                                if (!status) alertify.error(message);
                            }
                            if (field === 'checkaba') {
                                $scope.ccValitationobj.checkroutingnovalid = status;
                                if (!status) alertify.error(message);
                            }
                            if (field === 'checkname') {
                                $scope.ccValitationobj.checknamevalid = status;
                                if (!status) alertify.error(message);
                            }
                        }
                    },

                    callback: function (response) {
                        $scope.$apply(function () {
                            $scope.isPaymentInProgress = false;
                            $("#maineHnoteLoader").hide();

                            var activeItem = $scope.ActiveDepositItem;

                            if (activeItem.PaymentModeId === 2 || activeItem.PaymentModeId === 3) {
                                var cardMap = { visa: 1, mastercard: 2, amex: 3 };
                                activeItem.CardTypeId = (response.card && response.card.type)
                                    ? (cardMap[response.card.type.toLowerCase()] || 0) : 0;
                                activeItem.CardNumber = response.card.number.slice(-4);
                                activeItem.CardType = response.card.type;
                            }

                            // Token received — build and save all pending rows
                            var lineItems = $scope.mainNMIPaymentRequestObj.PatientDepositLineItem || [];
                            var pendingItems = lineItems.filter(function (i) { return !i.IsDepositLineItemDisabled; });
                            _multiDepositBuildAndSave(response.token, activeItem, pendingItems);
                        });
                    },

                    timeoutCallback: function () {
                        alertify.error("Card tokenisation timed out. Please try again.");
                        $scope.$apply(function () { $scope.isPaymentInProgress = false; });
                        $("#maineHnoteLoader").hide();
                    },
                    fieldsAvailableCallback: function () {
                        console.log("CollectJS fields loaded.");
                        $("#maineHnoteLoader").hide();
                    }
                });

            }).catch(function (e) {
                $("#maineHnoteLoader").hide();
                alertify.error("Payment gateway not ready. Please reselect the location.");
                console.error("initPaymentCollectJS:", e);
            });
        };



        //setTimeout($scope.initPaymentCollectJS, 500);
        $scope.TextToPayExpirationOptions = [
            { value: "1d", label: "1 Day" },
            { value: "2d", label: "2 Days" },
            { value: "3d", label: "3 Days" },
            { value: "5d", label: "5 Days" },
            { value: "7d", label: "7 Days (Default)" },
            { value: "14d", label: "14 Days" },
            { value: "30d", label: "30 Days" }
        ];
        $scope.IsShowCollectpaymentbutton = false;
        $scope.coninueprocessonlineNMIPayment = function (paymentToken, pitem, ditem) {

            var selectedItem = ditem[$scope.DepositIndex];
            selectedItem = selectedItem || null;
            $scope.PatientDepositLineItemObj = selectedItem || null;

            paymentToken = paymentToken || "";

            var orderdescription = $scope.SaveDepositPaymentReqObj.PatientFirstName + " Payment" + $scope.SaveDepositPaymentReqObj.PaymentAmount + " for " + $scope.SaveDepositPaymentReqObj.PaymentType + " on " + $scope.SaveDepositPaymentReqObj.PaymentDate;

            $scope.mainNMITransactionObj = angular.copy(eHnoteCacheStorageService.getNMITransactionMainObject());


            $scope.SaveDepositPaymentReqObj.HospitalId = $scope.PatientDepositLineItemObj.HospitalId;
            $scope.SaveDepositPaymentReqObj.HospitalName = $scope.PatientDepositLineItemObj.HospitalName;

            $scope.AddPaymentModeObj = angular.copy($scope.GetPaymentmodeList());
            $scope.AddPaymentModeObj.PaymentMethodId = $scope.SaveDepositPaymentReqObj.PaymentModeId;
            $scope.AddPaymentModeObj.PaymentMethodName = $scope.SaveDepositPaymentReqObj.PaymentMode;
            $scope.AddPaymentModeObj.DepositAmount = $scope.SaveDepositPaymentReqObj.PaymentAmount || 0;
            $scope.AddPaymentModeObj.ReferenceNumber = '';
            $scope.AddPaymentModeObj.NMITransactionId = 0;
            $scope.AddPaymentModeObj.OnlineTransactionNumber = '';
            $scope.AddPaymentModeObj.PaymentProcessTypeId = $scope.SaveDepositPaymentReqObj.PaymentProcessTypeId || 0;
            $scope.AddPaymentModeObj.PaymentProcessType = $scope.SaveDepositPaymentReqObj.PaymentProcessType || "";
            $scope.AddPaymentModeObj.CardType = $scope.SaveDepositPaymentReqObj.CardType || "";
            $scope.AddPaymentModeObj.CardTypeId = $scope.SaveDepositPaymentReqObj.CardTypeId || "";
            $scope.AddPaymentModeObj.CardNumber = $scope.SaveDepositPaymentReqObj.CardNumber || "";
            $scope.AddPaymentModeObj.ChequeNumber = $scope.SaveDepositPaymentReqObj.ChequeNumber || "";
            $scope.AddPaymentModeObj.BillPaymentTypeId = $scope.SaveDepositPaymentReqObj.PaymentTypeId;
            $scope.AddPaymentModeObj.BillPaymentType = $scope.SaveDepositPaymentReqObj.PaymentType;
            $scope.AddPaymentModeObj.PaymentTransactionTypeId = 1;
            $scope.AddPaymentModeObj.PaymentTransactionType = "Credit";
            $scope.AddPaymentModeObj.Remarks = "";

            if ($scope.PatientDepositLineItemObj != null) {
                $scope.PatientDepositLineItemObj.PatientDepositPaymodeList = [];
                $scope.PatientDepositLineItemObj.PatientDepositPaymodeList.push($scope.AddPaymentModeObj);
                $scope.PatientDepositLineItemObj.DepositedByUserId = $scope.SaveDepositPaymentReqObj.RecievedUserId;
                $scope.PatientDepositLineItemObj.DepositedBy = $scope.SaveDepositPaymentReqObj.RecievedUserName;
                $scope.PatientDepositLineItemObj.UnBilledAmount = $scope.SaveDepositPaymentReqObj.PaymentAmount;
            }

            $scope.mainNMITransactionObj.NMITransactionId = 0;
            $scope.mainNMITransactionObj.UserId = $scope.SaveDepositPaymentReqObj.RecievedUserId;
            $scope.mainNMITransactionObj.PatientId = $scope.SaveDepositPaymentReqObj.PatientId;
            $scope.mainNMITransactionObj.OrganizationId = $scope.SaveDepositPaymentReqObj.HospitalId;
            $scope.mainNMITransactionObj.PaymentAmount = $scope.SaveDepositPaymentReqObj.PaymentAmount;
            $scope.mainNMITransactionObj.MerchentId = $scope.SaveDepositPaymentReqObj.MerchentId;
            $scope.mainNMITransactionObj.MerchentName = $scope.SaveDepositPaymentReqObj.MerchentName;
            $scope.mainNMITransactionObj.PaymentToken = paymentToken;
            $scope.mainNMITransactionObj.CardHolderName = $scope.SaveDepositPaymentReqObj.CardHolderName || "";
            $scope.mainNMITransactionObj.PatientEmail = $scope.SaveDepositPaymentReqObj.PatientEmailId || "";
            $scope.mainNMITransactionObj.PatientMobile = $scope.SaveDepositPaymentReqObj.PatientMobileNumber || "";
            $scope.mainNMITransactionObj.PatientMrNo = $scope.SaveDepositPaymentReqObj.PatientMrNo || "";

            $scope.mainNMITransactionObj.CardBillingAddress1 = $scope.SaveDepositPaymentReqObj.CardBillingAddress1 || "";
            $scope.mainNMITransactionObj.CardBillingAddress2 = $scope.SaveDepositPaymentReqObj.CardBillingAddress2 || "";
            $scope.mainNMITransactionObj.CardBillingState = $scope.SaveDepositPaymentReqObj.CardBillingState || "";
            $scope.mainNMITransactionObj.CardBillingCity = $scope.SaveDepositPaymentReqObj.CardBillingCity || "";
            $scope.mainNMITransactionObj.CardBillingZip = $scope.SaveDepositPaymentReqObj.CardBillingZip || "";

            $scope.mainNMITransactionObj.ProcessorId = $scope.SaveDepositPaymentReqObj.ProcessorId || "";
            $scope.mainNMITransactionObj.ProcessorName = $scope.SaveDepositPaymentReqObj.ProcessorName || "";
            $scope.mainNMITransactionObj.TokenizationKey = $scope.SaveDepositPaymentReqObj.TokenizationKey || "";

            $scope.mainNMITransactionObj.OrderId = "";
            $scope.mainNMITransactionObj.OrderDescription = orderdescription;
            $scope.mainNMITransactionObj.TransactionId = 0;
            $scope.mainNMITransactionObj.ResponseId = 0;
            $scope.mainNMITransactionObj.ResponseCode = "";
            $scope.mainNMITransactionObj.ResponseText = "";
            $scope.mainNMITransactionObj.Status = "";
            $scope.mainNMITransactionObj.TransactionTypeId = $scope.SaveDepositPaymentReqObj.TransactionTypeId;
            $scope.mainNMITransactionObj.TransactionType = $scope.SaveDepositPaymentReqObj.TransactionType;
            $scope.mainNMITransactionObj.BillPaymentTypeId = $scope.SaveDepositPaymentReqObj.PaymentTypeId;
            $scope.mainNMITransactionObj.BillPaymentType = $scope.SaveDepositPaymentReqObj.PaymentType;
            $scope.mainNMITransactionObj.DeleteInd = "N";
            $scope.mainNMITransactionObj.Type = $scope.SaveDepositPaymentReqObj.TransactionType;
            $scope.mainNMITransactionObj.AppointmentId = $scope.SaveDepositPaymentReqObj.AppointmentId;
            $scope.mainNMITransactionObj.VisitId = $scope.SaveDepositPaymentReqObj.VisitId;
            $scope.mainNMITransactionObj.PaymentType = $scope.SaveDepositPaymentReqObj.PaymentModeId == 2 ? 'creditcard' :
                $scope.SaveDepositPaymentReqObj.PaymentModeId == 7 ? 'check' :
                    'creditcard';
            if ($scope.SaveDepositPaymentReqObj.PaymentProcessTypeId == 1) {
                $scope.mainNMITransactionObj.ResponseMethod = "synchronous";
            } else {
                $scope.mainNMITransactionObj.ResponseMethod = "";
            }

            $scope.mainNMITransactionObj.PoiDeviceId = $scope.SaveDepositPaymentReqObj.PoiDeviceId || "";
            $scope.mainNMITransactionObj.PaymentProcessTypeId = $scope.SaveDepositPaymentReqObj.PaymentProcessTypeId || 0;
            $scope.mainNMITransactionObj.PaymentProcessType = $scope.SaveDepositPaymentReqObj.PaymentProcessType || "";

            $scope.mainNMITransactionObj.PaymentModeId = $scope.SaveDepositPaymentReqObj.PaymentModeId;
            $scope.mainNMITransactionObj.PaymentMode = $scope.SaveDepositPaymentReqObj.PaymentMode;
            $scope.mainNMITransactionObj.CardNumber = $scope.SaveDepositPaymentReqObj.CardNumber;
            $scope.mainNMITransactionObj.CardTypeId = $scope.SaveDepositPaymentReqObj.CardTypeId;
            $scope.mainNMITransactionObj.CardType = $scope.SaveDepositPaymentReqObj.CardType;
            if ($scope.PatientDepositLineItemObj != null) {
                $scope.PatientDepositLineItemObj.PaymentMethodId = $scope.SaveDepositPaymentReqObj.PaymentModeId;
                $scope.PatientDepositLineItemObj.PaymentMethodName = $scope.SaveDepositPaymentReqObj.PaymentMode;
                $scope.PatientDepositLineItemObj.Notes = $scope.SaveDepositPaymentReqObj.PaymentNote;
                $scope.PatientDepositLineItemObj.CardNumber = $scope.SaveDepositPaymentReqObj.CardNumber;
                $scope.PatientDepositLineItemObj.CardTypeId = $scope.SaveDepositPaymentReqObj.CardTypeId;
                $scope.PatientDepositLineItemObj.CardType = $scope.SaveDepositPaymentReqObj.CardType;
                $scope.PatientDepositLineItemObj.OrganizationId = $scope.SaveDepositPaymentReqObj.HospitalId;
                $scope.PatientDepositLineItemObj.OrganizationName = $scope.SaveDepositPaymentReqObj.HospitalName;
                $scope.PatientDepositLineItemObj.OrganizationTransactionName = $scope.mainNMIPaymentRequestObj.OrganizationTransactionName;
                /*    $scope.PatientDepositLineItemObj.HospitalId = $scope.SaveDepositPaymentReqObj.HospitalId;*/
                $scope.SaveDepositPaymentReqObj.PatientDepositLineItem.push($scope.PatientDepositLineItemObj);
            }
            $scope.mainNMITransactionObj.PatientDeposits = $scope.SaveDepositPaymentReqObj.PatientDepositLineItem || [];

            eHnotePaymentGatewayService.PaymentProcessandAddDeposit($scope.mainNMITransactionObj).then(function (resp) {

                console.log(JSON.stringify(resp));
                var res = resp.data || {};
                $scope.mainNMITransactionObj.ResponseText = res.NMITransactionResponse.ResponseText;
                $scope.SaveDepositPaymentReqObj.ResponseText = $scope.mainNMITransactionObj.ResponseText;
                res.ResponseId = parseInt(res.NMITransactionResponse.ResponseId || 0);

                if (res.NMITransactionResponse.ResponseId === 1) {
                    if (res.DepositInsertResults[0].Status == 'Success') {
                        alertify.success(res.NMITransactionResponse.ResponseText);
                        $scope.SaveDepositPaymentReqObj.UITransactionStatus = 'Success';
                    } else {
                        alertify.error(res.DepositInsertResults[0].Status);
                        $scope.SaveDepositPaymentReqObj.UITransactionStatus = 'Failed';
                    }


                } else if (res.NMITransactionResponse.ResponseId === 2) {
                    alertify.error(res.NMITransactionResponse.ResponseText);
                    $scope.SaveDepositPaymentReqObj.UITransactionStatus = 'Failed';
                } else {
                    alertify.error(res.NMITransactionResponse.ResponseText);
                    $scope.SaveDepositPaymentReqObj.UITransactionStatus = 'Failed';
                }
                $scope.IsAddMultiplePaymentbutton = false;
                $scope.ShowCollectpaymetnpaymentPopup = true;
                $scope.ISShowCardPaymentDetails = false;

                if (resp.data.DepositInsertResults[0] != undefined) {
                    if (resp.data.DepositInsertResults[0].DepositTransaction.length > 0) {

                        $scope.DepositTransactionData = resp.data.DepositInsertResults[0].DepositTransaction;
                        $scope.PatientDepositPaymodeListData = resp.data.DepositInsertResults[0].PatientDepositPaymodeList;

                        $scope.SaveDepositPaymentReqObj.NMITransactionId = $scope.PatientDepositPaymodeListData[0].NMITransactionId;
                        $scope.SaveDepositPaymentReqObj.TransactionId = $scope.DepositTransactionData[0].TransactionId;
                        $scope.SaveDepositPaymentReqObj.OnlineTransactionNumber = $scope.DepositTransactionData[0].OnlineTransactionNumber;
                        $scope.SaveDepositPaymentReqObj.TransactionReceiptNo = $scope.DepositTransactionData[0].TransReciptNo || '';
                        $scope.SaveDepositPaymentReqObj.DepositTransactionDate = $scope.DepositTransactionData[0].TransactionDate || '';
                        $scope.SaveDepositPaymentReqObj.TransactionDate = $scope.DepositTransactionData[0].TransactionDate || '';
                        $scope.SaveDepositPaymentReqObj.TransactionTime = $scope.DepositTransactionData[0].TransactionTime || '';
                        $scope.SaveDepositPaymentReqObj.ReceiptNo = resp.data.DepositInsertResults[0].ReceiptNo || '';
                        $scope.SaveDepositPaymentReqObj.ReferenceNumber = $scope.PatientDepositPaymodeListData[0].ReferenceNumber || '';
                        $scope.SaveDepositPaymentReqObj.PatientDepositPaymodeList = $scope.PatientDepositPaymodeListData || [];

                    }
                }



                $scope.DepositLineItemIndex = $scope.DepositIndex || 0;
                $scope.DepositPaymentObj = $scope.SaveDepositPaymentReqObj || {};

                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem = $scope.mainNMIPaymentRequestObj.PatientDepositLineItem || [];

                // Assign Status to selected row
                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].Status = $scope.DepositPaymentObj.UITransactionStatus || '';
                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].IsDepositLineItemDisabled = true;


                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].CardType = $scope.DepositPaymentObj.CardType;
                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].CardNumber = $scope.DepositPaymentObj.CardNumber;
                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].NMITransactionId = $scope.DepositPaymentObj.NMITransactionId;
                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].TransactionReceiptNo = $scope.DepositPaymentObj.TransactionReceiptNo;
                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].TransactionId = $scope.DepositPaymentObj.TransactionId;
                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].TransactionDate = $scope.DepositPaymentObj.TransactionDate;
                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].TransactionTime = $scope.DepositPaymentObj.TransactionTime;
                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].OrganizationName = $scope.DepositPaymentObj.HospitalName;
                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].OrganizationId = $scope.DepositPaymentObj.HospitalId;
                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].ChequeNumber = $scope.DepositPaymentObj.ChequeNumber;
                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].ReceiptNo = $scope.DepositPaymentObj.ReceiptNo;
                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].PatientDepositPaymodeList = $scope.DepositPaymentObj.PatientDepositPaymodeList || [];
                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].PatientDepositId = $scope.DepositPaymentObj.PatientDepositPaymodeList[0].PatientDepositId || 0;
                $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].IsShoweachDepositNotes = false;
                $scope.DepositPaymentObj.PatientDepositPaymodeList[0].ReceiptNo = $scope.DepositPaymentObj.PatientDepositPaymodeList[0].ReceiptNo || '';
                $scope.DepositPaymentObj.PatientDepositPaymodeList[0].ReceiptNo = $scope.DepositPaymentObj.ReceiptNo;
                $scope.PatientDepositPaymodeList.push(
                    ...($scope.DepositPaymentObj.PatientDepositPaymodeList || [])
                );

                $scope.IsShowDepositFields = true;
                if ($scope.MainParentobj.ClaimDataObj != null && Object.keys($scope.MainParentobj.ClaimDataObj).length > 0) {
                    if ($scope.mainNMIPaymentRequestObj.PatientDepositLineItem != null) {
                        var filtredRenderArray = $filter("filter")($scope.AllDoctorList, { "DoctorID": $scope.MainParentobj.ClaimDataObj.RenderingProviderId }, true) || [];
                        if (filtredRenderArray.length > 0) {
                            $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].RenderingProviderId = filtredRenderArray[0].DoctorID;
                            $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].RenderingProviderName = filtredRenderArray[0].UserFullName;
                            $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].UserBranchId = filtredRenderArray[0].UserBranchId;
                            $scope.mainNMIPaymentRequestObj.PatientDepositLineItem[$scope.DepositLineItemIndex].RenderingProviderObj = filtredRenderArray[0] || '';
                        }
                    }
                }
                var List2 = $filter("filter")($scope.mainNMIPaymentRequestObj.PatientDepositLineItem, function (Pitem) {
                    return Pitem.Status === '';
                }) || [];

                if (List2.length !== 0) {
                    $scope.IsShowCollectpaymentbutton = false;
                } else {
                    $scope.IsShowCollectpaymentbutton = true;
                }


            });

        };




        $scope.EditDepositLineItem = function (item, index) {

            // Snapshot originals for cancel

            var lineItems = $scope.mainNMIPaymentRequestObj.PatientDepositLineItem || [];
            var currentlyEditing = lineItems.find(function (li) {
                return li !== item && li.IsEditMode === true;
            });
            if (currentlyEditing) {
                $scope.CancelEditDepositLineItem(currentlyEditing);
            }


            item.OriginalAmount = item.DepositAmount;
            item.OriginalPaymentModeId = item.PaymentModeId;
            item.OriginalPaymentMode = item.PaymentMode;
            item.OriginalChequeNumber = item.ChequeNumber;
            item.OriginalCardTypeId = item.CardTypeId;
            item.OriginalCardNumber = item.CardNumber;
            item.OriginalProcessTypeId = item.PaymentProcessTypeId;
            if (item.ReferenceNumber != '') {
                item.TransactionId = item.ReferenceNumber || '';
            }

            // item.EditAmount = item.DepositAmount;
            item.EditChequeNumber = item.ChequeNumber;

            // Unlock the row for editing
            item.IsEditMode = true;
            item.IsDepositLineItemDisabled = false;
            item.IsShoweachDepositNotes = true;
            item.Status = '';
            console.log(item.PaymentMethodId + "PaymentMethodId");
            console.log(item.PaymentModeId + "PaymentModeId");
            // Point side panel at this row
            $scope.ActiveDepositItem = item;
            var PMID = item.PaymentMethodId;
            if (PMID != 1 && PMID != 12 && PMID != 6 && PMID != 4) {
                $scope.ISShowCardPaymentDetails = true;
            } else {
                $scope.ISShowCardPaymentDetails = false;
            }

            $scope.setActiveDepositRow(index);

            // Switch footer to edit mode
            $scope.IsEditLineItemMode = true;
            $scope.EditingLineItem = item;
            $scope.EditingLineItemIndex = index;
            $scope.IsShowpaymentbutton = true;
        };

        $scope.CancelEditDepositLineItem = function (item) {
            item.DepositAmount = item.OriginalAmount;
            item.PaymentModeId = item.OriginalPaymentModeId;
            item.PaymentMode = item.OriginalPaymentMode;
            item.ChequeNumber = item.OriginalChequeNumber;
            item.CardTypeId = item.OriginalCardTypeId;
            item.CardNumber = item.OriginalCardNumber;
            item.PaymentProcessTypeId = item.OriginalProcessTypeId;

            item.IsEditMode = false;
            item.IsDepositLineItemDisabled = true;
            item.Status = 'Success';
            item.IsShoweachDepositNotes = false;
            // Reset footer
            $scope.IsEditLineItemMode = false;
            $scope.EditingLineItem = null;
            $scope.EditingLineItemIndex = null;

            $scope.ISShowCardPaymentDetails = false;
            $scope.ActiveDepositItem = null;
            $scope.IsShowpaymentbutton = false;

        };

        $scope.SaveEditDepositLineItem = function (item, index) {

            // 1. Flush edit-mode values back onto the item
            /* item.DepositAmount = item.EditAmount;*/
            if (item.PaymentModeId === 5) {
                item.ChequeNumber = item.EditChequeNumber;
            }

            // 2. Mark THIS item as pending (unlocked), keep all others locked
            item.IsDepositLineItemDisabled = false;
            item.IsEditMode = false;
            item.Status = '';

            // 3. Temporarily lock every OTHER line item that was already saved,
            //    so navtoCollectMulipleDepositPayments only sees this one row
            var lineItems = $scope.mainNMIPaymentRequestObj.PatientDepositLineItem;
            var otherSavedItems = lineItems.filter(function (li) {
                return li !== item && li.IsDepositLineItemDisabled === true;
            });
            // They are already locked — nothing to change, the filter handles it.

            // 4. Re-init CollectJS if switching TO a gateway payment method
            if (item.PaymentProcessTypeId === 3) {
                $scope.initPaymentCollectJS(item);   // your existing init fn
            }

            // 5. Reuse the exact same multi-save flow — it will only pick up this item
            var closeType = "";
            if (lineItems.length === 1) {
                closeType = "close";
            }
            $scope.navtoCollectMulipleDepositPayments(closeType);
        };


        $scope.SetActiveDepositeClick = function (index, item, $event) {

            if ($scope.isAddingRow) {
                $event.stopPropagation();
                return;
            }

            if (!item.IsDepositLineItemDisabled && !item.IsEditMode) {
                $scope.setActiveDepositRow(index);
            }
        };

        $scope.formatUSNumberInfo = function (phoneNumberString) {
            $scope.textToPayUSnumberString = phoneNumberString || "";
            if ($scope.textToPayUSnumberString != "") {
                console.log($scope.textToPayUSnumberString);
                const match = phoneNumberString
                    .replace(/\D+/g, '')
                    .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
                const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
                const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
                const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
                $scope.ActiveDepositItem.PatientMobile = part1 + part2 + part3;
            } else {
                $scope.ActiveDepositItem.PatientMobile = "";
            }
        }

    }]);
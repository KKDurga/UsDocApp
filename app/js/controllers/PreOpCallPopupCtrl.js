"use strict";
eHnoteWebApp.controller("PreOpCallPopupCtrl", ["$scope", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "$interval", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "datapersistanceFactory", "$window", "eHnoteMainAppointmentService", "$q", "eHnotePatientAddressDataServices", "eHnoteOrgReferralDataServices", "localStorageFactory", "eHnoteSurgeryService", "$timeout", "eHnotePrintService", "eHnoteUserDataService", "eHnoteMainAdminServices", "eHnoteInsuranceService", "eHnotePatientVisitReasonServices", 'eHnoteSettingsDataService', 'eHnoteConditionsDataService', "eHnoteDiagnosisDataServices", "USPrintService", "ParentObject", "OrgASCChecklist", "$uibModalInstance", "allUserList", "ParentObj", "eHnoteAuditServices", function ($scope, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, $interval, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, datapersistanceFactory, $window, eHnoteMainAppointmentService, $q, eHnotePatientAddressDataServices, eHnoteOrgReferralDataServices, localStorageFactory, eHnoteSurgeryService, $timeout, eHnotePrintService, eHnoteUserDataService, eHnoteMainAdminServices, eHnoteInsuranceService, eHnotePatientVisitReasonServices, eHnoteSettingsDataService, eHnoteConditionsDataService, eHnoteDiagnosisDataServices, USPrintService, ParentObject, OrgASCChecklist, $uibModalInstance, allUserList, ParentObj, eHnoteAuditServices) {

    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    $scope.HospitalId = '';
    $scope.ParentHospitalId = '';
    if (doctorInfo !== undefined) {
        if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.ParentHospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.UserId=doctorInfo.doctorid||0;
        }
    }
    $scope.ParentObject = ParentObject || '';
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
    
    $scope.AddToCache = function () {
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    };

    $scope.adnewsigobj = {
        "IsNewSig": false,
        "MedicineId": 0,
    }

    $scope.allUserList = allUserList || [];

    $scope.PreopCallNurseReviewedByArray = [];

    //$scope.CurrentEnv = '';

    //var currenturl = $location.absUrl().split('?')[0];

    //var currenturl12 = currenturl.split('/#')[0];

    //if (currenturl12 == "https://ioj.ehnote.com" || currenturl12 == 'https://portal.ehnote.com') {
    //    $scope.CurrentEnv = 'Prod';
    //} else if (currenturl12 == "https://stg.ehnote.com" || currenturl12 == "https://insts.ehnote.com") {
    //    $scope.CurrentEnv = 'Stg';
    //} else {
    //    $scope.CurrentEnv = 'Dev'
    //};

    //$scope.IsTecEyeCareOrg = false;

    //if (($scope.CurrentEnv == 'Dev' && $scope.ParenthospitalId == 645) || ($scope.CurrentEnv == 'Stg' && $scope.ParenthospitalId == 3) || ($scope.CurrentEnv == 'Prod' && $scope.ParenthospitalId == 3)) {
    //    $scope.IsTecEyeCareOrg = true;
    //} else {
    //    $scope.IsTecEyeCareOrg = false;
    //};

    $scope.ParentObj = ParentObj;

    function getnewOrganizationSigObj() {
        var obj = {
            "UserId": $scope.UserId,
            "OrganizationSigTemplateId": 0,
            "OrganizationId": $scope.HospitalId,
            "Sig": "",
            "ActionId": "",
            "Action": "",
            "DoseId": "",
            "Dose": "",
            "DoseUnitId": "",
            "DoseUnit": "",
            "RouteId": "",
            "Route": "",
            "FrequencyId": "",
            "Frequency": "",
            "DoseOtherId": "",
            "DoseOther": "",
            "DaysSupplyId": "",
            "DaysSupply": "",
            "Quantity": "",
            "QuantityUnitId": "",
            "QuantityUnit": "",
            "RefillId": "",
            "Refills": "",
            "DeleteInd": "N",
            "IsFrequent": "N",
            "PageSize": 10,
            "PageNumber": 1,
            "MedicineId": $scope.adnewsigobj.MedicineId || 0
        };
        return obj;
    }
    $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
    function GetPreOpCallObj() {
        return {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "AppointmentId": $scope.ParentObject.AscAppointmentId || 0,
            "PatientId": $scope.ParentObject.PatientID || 0,
            "HospitalId": $scope.HospitalId,
            "PatientAscPreOpCallDetailId": 0,
            "ContactType": "",
            "PreopAddnewMobileNo": "",
            "IsConnectedWithPatient": false,
            "IsConnectedWithFamilyOrFriend": false,
            "IsLeftMsgWithFamilyOrFriend": false,
            "IsLeftMsgWithPatient": false,
            "IsNoResponse": false,
            "IsArrivalTimeShared": false,
            "IsAccompanyShared": false,
            "IsDrinkPlentyWaterShared": false,
            "IsNpoAfterMidnightShared": false,
            "IsTakeBpHeartMedShared": false,
            "IsDoNotTakeBpMedShared": false,
            "IsCoPay": false,
            "IsNoMakeupJewelMoistShared": false,
            "DropStartDate": "",
            "DropsStartTime": "",
            "ContactStartDate": "",
            "ContactStartTime": "",
            "CoPayNotes": "",
            "Remarks": "",
            "DeleteInd": "N",
            "IsPreopCallScreen": false,
            "IsPostopCallScreen": false,
            "IsPreopSubCallScreen": false,
            "IsPreopSubRosScreen": false,
            "IsEditPreopcallobjInd": false,
            "IsDoingWell": false,
            "IsMildDiscomfort": false,
            "IsModerateDiscomfort": false,
            "IsExtensiveDiscomfort": false,
            "IssummaryShow": false,
            "IsRosSummaryView":false,
            "IsOtherMobileNo": false,
            "IsPreOpEditModeInd": false,
            "IsPreOpnSaveNameEditModeInd": false,
            "GeneralInstructionsCallChecklist": [],
            "BillingInstructionsCallChecklist": [],
            "PreOpPostopcallCheckListTemplates": [],
            "TemplateName": "",
            "BillingInstructionRemarks": "",
            "CreatedByUserName":"",
            "PreopCallNurseReviewedById":null,
            "PreopCallNurseReviewedByName":'',
            "PreopCallNurseReviewedByTime":'',
            "PreopCallNurseReviewedByNotes":'',
            "PreopCallNurseReviewedByNotesInd": false,
            "IsPreopSubRosScreenNew": false,
            "IsPreopSubCallScreensummary": false,
            "IsPreopSubRosScreenNewsummary": false,
            "IsPreOpRosEditModeInd": false,
            "IsRossummaryShow": false,
            "IsFromRos": false,
            "PreopCallNurseReviewedByDate":null,
            "PreopCallArrivalTime": null,
            "IsFromPreOpCall": true,
            "IsClickSavePreOpCallBtn": false,
        }
    };
    $scope.PreOpCallObj = GetPreOpCallObj();
    $scope.PreopCallsummaryViewObj = GetPreOpCallObj();
    function GetPostOpCallObj() {
        return {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "AppointmentId": $scope.PreOpCallObj.AppointmentId,
            "PatientId": $scope.PreOpCallObj.AppointmentId,
            "HospitalId": $scope.HospitalId,
            "PatientAscPostOpCallId": 0,
            "PostopCallList": [],
            "IsArrivalTimeShared": false,
            "IsConnectedWithPatient": false,
            "Ispatientoutcome": false,
            "CoPayNotes": '',
            "Patientoutcomenotes": '',
            "ContactType": '',
            "AddnewMobileNo": '',
            "ContactStartDate": null,
            "ContactStartTime": '',
            "IsPreopCallScreen ": false,
            "IsPreopSubCallScreen ": false,
            "IssummaryShow ": false,
            "IsOtherMobileNo ": false,
            "IsPreOpEditModeInd": false,
            "IsPreOpnSaveNameEditModeInd": false,
            "CallAttempt": "",
            "SpokeWith": "",
            "PainLevel": null,
            "MedicationHelping": "",
            "SideEffects": "",
            "MedicationHelpingReason": "",
            "SideEffectsReason": "",
            "AdditionalNotes": "",
            "ScheduledDate": null,
            "PostOpCallActionTakenCheckList": [],
            "EyeShieldUsed": "",
            "ActivityRestrictions": "",
            "ConfirmedAppointment": "",
            "NauseaOrVomiting": "",
            "NauseaSeverity": "",
            "PostopCallNurseReviewedById": null,
            "PostopCallNurseReviewedByName": '',
            "PostopCallNurseReviewedByTime": '',
            "PostopCallNurseReviewedByDate": null,
            "RescheduleConfirmed":false,
            "IsClickSavePostOpCallBtn":false,
           
        }
    };
    $scope.PostOpCallObj = GetPostOpCallObj();

    $scope.GetPreopCallNurseReviewedByTime = function () {
        $scope.PreOpCallObj.PreopCallNurseReviewedByTime = $filter('date')(new Date(), "hh:mm a");
        $scope.PreOpCallObj.PreopCallNurseReviewedByDate = $filter('date')(new Date(), "yyyy-MM-dd");
    };
    $scope.GetPostopCallNurseReviewedByTime = function () {
        $scope.PostOpCallObj.PostopCallNurseReviewedByTime = $filter('date')(new Date(), "hh:mm a");
        $scope.PostOpCallObj.PostopCallNurseReviewedByDate = $filter('date')(new Date(), "yyyy-MM-dd");
    };
    $scope.GetPreopCallArrivalTime = function () {
        $scope.PreOpCallObj.PreopCallArrivalTime = $filter('date')(new Date(), "hh:mm a");
    };

    var PatientMonth = ''
    if ($scope.ParentObject.AgeInMonths != 0) {
        var PatientMonth = $scope.ParentObject.AgeInMonths + 'M';
    }
    $scope.ParentObject.Age = $scope.ParentObject.AgeInYears + 'Y' + ' ' + PatientMonth;

    $scope.ContactList = [];
    if ($scope.ParentObject != '') {
        if ($scope.ParentObject.MobileNo != '') {
            var obj = {
                "value": $scope.ParentObject.MobileNo
            }
            $scope.ContactList.push(obj);
        }
        if ($scope.ParentObject.ContactNo != '') {
            var obj = {
                "value": $scope.ParentObject.ContactNo
            }
            $scope.ContactList.push(obj);
        }

    }
    $scope.changeMobileNo = function (itype) {
        if (itype == 1) {
            $scope.PreOpCallObj.ContactType = $scope.ParentObject.MobileNo || null;
            $scope.PreOpCallObj.IsPreopOtherMobileNo = false;
            $scope.PreOpCallObj.PreopAddnewMobileNo = "";
        }
        else if (itype == 2) {
            $scope.PreOpCallObj.ContactType = $scope.ParentObject.ContactNo || null;
            $scope.PreOpCallObj.IsPreopOtherMobileNo = false;
            $scope.PreOpCallObj.PreopAddnewMobileNo = "";
        } else if (itype == 3) {
            $scope.ParentObject.PreopAddnewMobileNo = "";
            $scope.PreOpCallObj.ContactType = $scope.PreOpCallObj.PreopAddnewMobileNo || '';
            $scope.PreOpCallObj.IsPreopOtherMobileNo = true;
        } else {
            $scope.PreOpCallObj.ContactType = $scope.ParentObject.ContactType || null;
            $scope.PreOpCallObj.IsPreopOtherMobileNo = false;
        }

    }
    $scope.changepostopMobileNo = function (itype) {
        if (itype == 1) {
            $scope.PostOpCallObj.ContactType = $scope.ParentObject.MobileNo || "";
            $scope.PostOpCallObj.IsOtherMobileNo = false;
            $scope.PostOpCallObj.AddnewMobileNo = "";
        } else if (itype == 2) {
            $scope.PostOpCallObj.ContactType = $scope.ParentObject.ContactNo || "";
            $scope.PostOpCallObj.IsOtherMobileNo = false;
            $scope.PostOpCallObj.AddnewMobileNo = "";
        } else if (itype == 3) {
            $scope.ParentObject.AddnewMobileNo = "";
            $scope.PostOpCallObj.ContactType = $scope.PostOpCallObj.AddnewMobileNo || "";
            $scope.PostOpCallObj.IsOtherMobileNo = true;
        } else {
            $scope.PostOpCallObj.ContactType = $scope.ParentObject.ContactType || "";
            $scope.PostOpCallObj.IsOtherMobileNo = false;
        }

    }
    $scope.GetLabInvestigations = [{
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 506,
        "ProcedureName": 'HGB',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    },
    {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "ShowNotes": false,
        "Normal": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 840,
        "ProcedureName": 'HCT',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 841,
        "ProcedureName": 'WBC',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 842,
        "ProcedureName": 'RBC',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 843,
        "ProcedureName": 'A1C',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 844,
        "ProcedureName": 'Creatinine',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 845,
        "ProcedureName": 'RBS',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 846,
        "ProcedureName": 'FBS',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 847,
        "ProcedureName": 'PBBS',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 848,
        "ProcedureName": 'PLBS',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 849,
        "ProcedureName": 'Prothrombin Time',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 850,
        "ProcedureName": 'Partial Thromboplastin time',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 851,
        "ProcedureName": 'Li-Fraumeni Syndrome',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 863,
        "ProcedureName": 'U/A',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 864,
        "ProcedureName": 'Blood Available',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 865,
        "ProcedureName": 'Pre-Transfusion',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 852,
        "ProcedureName": 'Sodium',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 853,
        "ProcedureName": 'Potassium',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 854,
        "ProcedureName": 'Chloride',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 855,
        "ProcedureName": 'Carbondioxide',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 856,
        "ProcedureName": 'glucose',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 866,
        "ProcedureName": 'Creatine',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 857,
        "ProcedureName": 'Urea',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 858,
        "ProcedureName": 'LDL',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 859,
        "ProcedureName": 'HDL',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 860,
        "ProcedureName": 'Triglyceride',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 861,
        "ProcedureName": 'Albumin',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }, {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 862,
        "ProcedureName": 'Total Protein',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    },
    {
        "PatientInvestigationId": null,
        "ResultId": null,
        "AbNormal": false,
        "Normal": false,
        "ShowNotes": false,
        "DeleteInd": 'N',
        "Remarks": "",
        "ResultValue": "",
        "ValueSetId": "",
        "ResultAddedBy": "",
        "Status": "",
        "ProcedureId": 867,
        "ProcedureName": 'CXR',
        "CPTCODE": "",
        "InvestigationResultDate": '',

    }
    ];
    var Lifeobject = {
        "PatientDetailId": 0,
        "ActiveInd": "Y",
        "Smokinglist": [],
        "AlcoholQuantityId": 0,
        "AlcoholQuantityName": "",
        "AlcoholStatusId": 0,
        "AlcoholStatusName": "",
        "AlcoholDuration": "",
        "AlcoholDurationType": "D",
        "AlcoholDurationTypeName": "Day(s)",
        "AlcoholDurationDate": "",
        "DrugStatusId": 0,
        "DrugQuantityId": 0,
        "DrugQuantityName": "",
        "DrugWhenQuitId": 0,
        "DrugWhenQuit": "",
        "DrugDuration": "",
        "DrugDurationType": "D",
        "DrugDurationTypeName": "Day(s)",
        "DrugDurationDate": "",
        "DrugArray": [],
        "Remarks": "",
        "ShowNote": false,
        "SmokeShowDateFormat": true,
        "AlcoShowDateFormat": true,
        "DrugShowDateFormat": true,
        "SmokingType": "",
        "AlcoholType": "",
        "PsychisType": "",
        "DrugType": "",
        "DeleteInd": "N",
        "SmokingFromDate": "",
        "SmokingToDate": "",
    }
    $scope.GetHealthPreAdmAnesthetistObj = function () {
        return {
            "PreAdmissionId": 0,
            "OrganizationId": $scope.HospitalId || 0,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "PatientId": $scope.PostOpCallObj.PatientId || 0,
            "AppointmentId": $scope.PostOpCallObj.AppointmentId || 0,
            "LabList": angular.copy($scope.GetLabInvestigations) || [],
            "LifestyleHistory": angular.copy(Lifeobject) || '',
            "CardioVascularObj": {
                "Systolic": "",
                "Diastolic": "",
                "PR": "",
                "ECG": "",
                "ECGUnits": "BPM",
                "Notes": "",
                "BPlevel": "",
                "ShowNotes": false,
            },
            "AirwayObj": {
                "IsNormal": false,
                "ROMTMS": "",
                "ROMNECKAP": "",
                "ROMNECKLAT": "",
                "Class": "",
                "Notes": "",
                "Dentition": "",
                "DentitionList": [],
                "ChemistryNotes": "",

            },
            "IsAllHealthWNL": false,
            "IsAllGridView": true,
            "IsAllSearchView": false,
            "IsCardiacWNL": false,                 
            "IsPulmonaryWNL": false,
            "IsHepaticWNL": false,
            "IsEndocrineWNL": false,
            "IsNeurologicWNL": false,
            "IsHemeOncWNL": false,
            "IsNervousSystemWNL": false,
            "IsMusculoSkeletalSystemWNL": false,
            "IsKidneyDiseaseWNL": false,
            "IsAutoImmuneDisordersWNL": false,
            "IsPsychosisWNL": false,
            "IsOthersWNL": false,
            "IsHeentWNL": false,
            "IsLungsWNL": false,
            "LabNotes": '',
            "IsGeneralappearanceWNL": false,
            "SystemicHistoryArray": [],
            "ReviewedDate": "",
            "ReviewedTime": "",
            "DocumentDetails": [],
            "TempImagesArray": [],
            "AppointmentID": $scope.PostOpCallObj.AppointmentId,
            "ChemistryNotesInd": false,
            "SocialNotesInd": false,
            "AirwayObjPreAdmnotesInd": false,
            "PreviousPreAdmAnesthetistData": "",
            "PreAdmAppointmentId": 0,
            "AscAppointmentId": 0,
            "IsPreadminAnestiaSave": false,
            "IsAscAnestiaSave": false,           
            "CardiacNotes": "",
            "showCardiacNotes": false,
            "NeurologicNotes": "",
            "showNeurologicNotes": false,
            "GeneralAppearenceNotes": "",
            "showGeneralAppearenceNotes": false,
            "HeentNotes": "",
            "showHeentNotes": false,
            "LungsNotes": "",
            "showLungsNotes": false,
            "PulmonaryNotes": "",
            "showPulmonaryNotes": false,
            "HepaticNotes": "",
            "showHepaticNotes": false,
            "EndocrineNotes": "",
            "showEndocrineNotes": false,
            "HemeOncNotes": "",
            "showHemeOncNotes": false,
            "NervousSystemNotes": "",
            "showNervousSystemNotes": false,
            "KidneyDiseaseNotes": "",
            "showKidneyDiseaseNotes": false,
            "MusculoSkeletalSystemNotes": "",
            "showMusculoSkeletalSystemNotes": false,
            "PsychosisNotes": "",
            "showPsychosisNotes": false,
            "OthersNotes": "",
            "showOthersNotes": false,
            "OtherDataId": 0,
            "NonSmokerStatus": [],
            "SmokingStatus": [],
            "NonAlcoholStatus": [],
            "AlcoholStatus": [],
        };
    };
    $scope.obj = {
        "AllergyItems": [],
        "OccularHistoryArray": [],
        "FunctionalStatusHistory": [],
        "BirthHistory": [],
        "NutritionalHistory": [],
        "CurrentSystemicMedicationsHistory": [],
        "CurrentEyeMedicationArray": [],
        "VaccinationHistory": [],
        "LifestyleHistory": [],
        // "OcularSurgicalHistory": [],
        "OcularSurgicalHistoryArray": [],
        "FamilyHistory": [],
        "MenstrualHistory": [],
        "CurrentMedicationArray": [],
        "SystemicHistoryArray": [],
        "SurgicalHistoryArray": [],
        "SelectedAllergyItem": "",
        "isNKASelected": false,
        "isNKDASelected": false,
        "isNKSHSelected":false,
        "SelectedOcularHistoryItem": "",
        "SelectedFunctionalStatusHistoryItem": "",
        "OcularSurgicalHistoryItem": "",
        "SelectedNutritionalHistoryItem": "",
        "SelectedBirthHistoryItem": "",
        "SelectedFamilyHistoryItem": "",
        "CurrentMedicationItem": "",
        "SystemicHistoryItem": "",
        "SurgicalHistoryItem": "",

        "SelectedComplaintItem": "",
        "SelectedCurrentTreatmentItem": "",
        "SelectedCurrentTreatmentItemEye": 4,
        "SelectedAllergyItemEye": 4,
        "SelectedMedicalItemEye": 4,
        "SelectedBirthItemEye": 4,
        "SelectedOcularItemEye": 4,
        "SelectedSurgeryItemEye": 4,
        "SelectedFamilyItemEye": 4,
        "SelectedMedicalHistoryItem": "",

        "SelectedSystemicHistoryItem": "",
        "SelectedVaccinationHistoryItem": "",

        "SelectedCurrentSystemicMedicationsHistoryItem": "",
        "SelectedOcularSurgicalHistoryItem": "",

        "SelectedImmunisatonHistoryItem": "",
        "SelectedLifeStyleHistoryItem": "",
        "SelectedMenstrualHistoryItem": "",
        "SelectedDiagnosisItem": "",
        "SelectedInvestigationItem": "",
        "SelectedTreatments": "",
        "SelectedPrescriptions": "",
        "SelectedSurgeryItem": "",
        "SelectedObservations": "",
        "AddComplaints": false,
        "AddTreatment": false,
        "AddInvestigation": false,
        "AddDiagnosis": false,
        "AddMedicalHistory": false,
        "AddBirthHistory": false,
        "AddFamilyHistory": false,
        "AddSurgicalHistory": false,
        "AddNutritionalHistory": false,
        "AddImmunisationHistory": false,
        "AddLifeStyleHistory": false,
        "AddMenstrualHistory": false,
        "AddAllergyshow": false,
        "AddPrescriptionshow": false,
        "showhideMedAddBtn": false,
        "SelectedOcularHistoryItem": "",
        "SelectedConsultationTreatment": "",
        "isGlassPrescribed": false,
        "isRxPrescribed": false,
        "isSurgeriesPrescribed": false,
        "IsCompositionPrescription": false,
        "MedicineSearchType": "General",
        "ROSOverAllRemarks": "",

        "AllergyRemarks": "",
        "AllergyNotesInd": false,
        "SurgicalRemarks": "",
        "SurgicalNotesInd": false,
        "CurrentEyeNotesInd": false,
        "CurrentEyeRemarks": "",
        "CurrentSystemicNotesInd": false,
        "CurrentSystemicRemarks": "",
        "LifestyleHistoryNotesInd": false,
        "LifestyleHistoryRemarks": "",

        "SystemicOtherData": {
            "CardiacNotes": "",
            "showCardiacNotes": false,
            "NeurologicNotes": "",
            "showNeurologicNotes": false,
            "GeneralAppearenceNotes": "",
            "showGeneralAppearenceNotes": false,
            "HeentNotes": "",
            "showHeentNotes": false,
            "LungsNotes": "",
            "showLungsNotes": false,
            "PulmonaryNotes": "",
            "showPulmonaryNotes": false,
            "HepaticNotes": "",
            "showHepaticNotes": false,
            "HemeOncNotes": "",
            "showHemeOncNotes": false,
            "NervousSystemNotes": "",
            "showNervousSystemNotes": false,
            "KidneyDiseaseNotes": "",
            "showKidneyDiseaseNotes": false,
            "MusculoSkeletalSystemNotes": "",
            "showMusculoSkeletalSystemNotes": false,
            "PsychosisNotes": "",
            "showPsychosisNotes": false,
            "OthersNotes": "",
            "showOthersNotes": false,
            "OtherDataId": 0,
            "EndocrineNotes": '',
            "showEndocrineNotes": false,
        },

        "ROSAllergyRemarkObj": {
            "Eyes": [],
            "IsEyeNormal": false,
            "Respiratory": [],
            "IsRespiratoryNormal": false,
            "ENT": [],
            "IsENTNormal": false,
            "Skin": [],
            "IsSkinNormal": false,
            "GenitoUrinary": [],
            "IsGenitoUrinaryEyeNormal": false,
            "GastroInterstinal": [],
            "IsGastroInterstinalNormal": false,
            "CardioVascular": [],
            "IsCardioVascularNormal": false,
            "BloodOrLymph": [],
            "IsBloodOrLymphNormal": false,
            "Psychiatric": [],
            "IsPsychiatricNormal": false,
            "Constitutional": [],
            "IsConstitutionalNormal": false,
            "Neurological": [],
            "IsNeurologicalNormal": false,
            "Muscoloskeletal": [],
            "IsMuscoloskeletalNormal": false,
            "Endocrine": [],
            "IsEndocrineNormal": false,
            "Immunologic": [],
            "IsImmunologicNormal": false
        }
    };
    $scope.ROSHistoriesObj = {
        "AddMenstrualHistory": false,
        "AddAllergyshow": false,
        "showhideMedAddBtn": false,
        "AddMedicalHistory": false,
        "AddBirthHistory": false,
        "AddSystemicHistory": false,
        "AddVaccinationHistory": false,
        "AddSurgicalHistory": false,
        "AddNutritionalHistory": false,
        "AddFamilyHistory": false,
        "AddImmunisationHistory": false,
        "AddOccularHistory": false,
        "IsRcopia": false,
        "AddLifeStyleHistory": false
    }
    $scope.SigSearch = {
        "Shows": false
    }


    $scope.LogObj = {
        "UserId": $scope.UserId || null,
        "OrganizationId": $scope.HospitalId || null,
        "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
        "PatientId": $scope.cacheStorageItem.PatientID || null,
        "LogArray": [],
        "CoPayNotes": '',
        "Patientoutcomenotes": '',
        "ContactType": '',
        "AddnewMobileNo": '',
        "ContactStartDate": null,
        "ContactStartTime": '',
        "IsOtherMobileNo ": false,
        "CallAttempt": "",
        "SpokeWith": "",
        "PainLevel": null,
        "MedicationHelping": "",
        "SideEffects": "",
        "MedicationHelpingReason": "",
        "SideEffectsReason": "",
        "AdditionalNotes": "",
        "ScheduledDate": null,
        "PostOpCallActionTakenCheckList": [],
        "EyeShieldUsed": "",
        "ActivityRestrictions": "",
        "ConfirmedAppointment": "",
        "NauseaOrVomiting": "",
        "NauseaSeverity": "",
        "PostopCallNurseReviewedById": null,
        "PostopCallNurseReviewedByName": '',
        "PostopCallNurseReviewedByTime": '',
        "PostopCallNurseReviewedByDate": null,
        "RescheduleConfirmed": false,
        "OrgASCChecklist":[],
        "PreOpContactType":"",
        "PreOpContactStartDate":"",
        "PreOpContactStartTime":"",
        "PreOpIsConnectedWithPatient":false,
        "PreOpIsConnectedWithFamilyOrFriend":false,
        "PreOpIsLeftMsgWithPatient":false,
        "PreOpIsLeftMsgWithFamilyOrFriend":false,
        "PreOpIsNoResponse":false,
        "PreOpIsArrivalTimeShared":false,
        "PreOpIsAccompanyShared":false,
        "PreOpIsDrinkPlentyWaterShared":false,
        "PreOpIsCoPay":false,
        "PreOpIsNpoAfterMidnightShared":false,
        "PreOpIsTakeBpHeartMedShared":false,
        "PreOpIsDoNotTakeBpMedShared":false,
        "PreOpIsNoMakeupJewelMoistShared":false,
        "PreOpCoPayNotes":"",
        "PreOpIsDoingWell":false,
        "PreOpIsMildDiscomfort":false,
        "PreOpIsModerateDiscomfort":false,
        "PreOpIsExtensiveDiscomfort":false,
        "PreOpPatientoutcomeNotes" :"",
        "PreOpRemarks": "",
        "PreOpDropsStartTime":"",
        "PreOpDropStartDate":"",
        "PreOpAddnewMobileNo": "",
        "PreOpBillingInstructionRemarks": "",
        "PreOpCreatedByUserName":"",
        "PreopCallNurseReviewedById":null,
        "PreopCallNurseReviewedByTime":'',
        "PreopCallNurseReviewedByNotes":'',
        "PreopCallNurseReviewedByDate": null,
        "PreopCallArrivalTime": null,
        "GeneralInstructionsCallChecklist": [],
        "BillingInstructionsCallChecklist": [],
        
    };

    $scope.PainLevelScoreArray = [
        {
            "Id": 0,
            "Value": "0"
        },
        {
            "Id": 1,
            "Value": "1"
        },
        {
            "Id": 2,
            "Value": "2"
        },
        {
            "Id": 3,
            "Value": "3"
        },
        {
            "Id": 4,
            "Value": "4"
        },
        {
            "Id": 5,
            "Value": "5"
        },
        {
            "Id": 6,
            "Value": "6"
        },
        {
            "Id": 7,
            "Value": "7"
        },
        {
            "Id": 8,
            "Value": "8"
        },
        {
            "Id": 9,
            "Value": "9"
        },
        {
            "Id": 10,
            "Value": "10"
        },

    ]
   
    $scope.FrequentlyAllergyitems = [];
    $scope.FrequentlySurgicalHistory = [];
    $scope.FrequentlySystemicHistory = [];
    $scope.ROSocularSeverity = [];
    $scope.MainObj =  {
        "AllergyItems": [],
        "SystemicHistory": [],
        "SurgicalHistory": [],
        "CurrentSystemicMedicationsHistory": [],
        "CurrentEyeMedications": [],
        "LifestyleDetail": [],
    }
    $scope.GetPreOpPostopcallCheckListTemplates = function () {
        let params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "OrganizationId": $scope.HospitalId,
        };
        eHnoteSurgeryService.GetPreOpPostopcallCheckListTemplates(params).then(function (resp) {
            if (resp.data.status == "Success") {
                if (resp.data.rows.length > 0) {
                    $scope.PreOpCallObj.PreOpPostopcallCheckListTemplates = [];
                    $scope.PreOpCallObj.PreOpPostopcallCheckListTemplates = resp.data.rows || [];
                }
            }
        }, function (err) {
            alertify.error("Fetching Data failed!");
            console.log(err);
        });
    }
    $scope.init = function () {
        $scope.HealthPhysicalObj = angular.copy($scope.GetHealthPreAdmAnesthetistObj());
        $scope.PreOpCallObj.IsRosSummaryView = false;
        $scope.GetPreOpPostopcallCheckListTemplates();
        var req1 = {
            "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "PageSize": 10,
            "PageNumber": 1,
            "UserId": doctorinfo.doctorid,
            "IsFrequent": "Y"

        };
        let req2 = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": $scope.ParentObject.AscAppointmentId || 0,
            "PatientId": $scope.ParentObject.PatientID || 0,
            "AppointmentTypeId": 4,

        };
        let req3 = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "CheckListModuleId": 3
        };
      
        let tappid = doctorinfo.doctorid ? doctorinfo.doctorid : $scope.UserId;

        //var Req = {
        //    "ParentOrganizationId": $scope.ParenthospitalId,
        //};

        $q.all([
            eHnoteDiagnosisDataServices.GetMedicineDosageFieldsMasterData(),
            eHnoteDiagnosisDataServices.GetAllMasterConsultationData(),
            eHnoteSurgeryService.GetPreAdmissionHealthCategories($scope.ParenthospitalId),
            eHnoteDiagnosisDataServices.GetAllFrequentlyAddedData(req1),
            eHnoteSurgeryService.GetOTQuickAccessDetails(req2),
            eHnoteSurgeryService.GetOrganizationASCCheckListData(req3),
            eHnotePatientDataService.GetUserConsultationMasterTemplateDtls(tappid),
        ]).then(function (resp) {
            if (resp[0].data.status === "Success") {
                $scope.DoseArray = resp[0].data.doseArray || [];
                $scope.DoseOtherArray = resp[0].data.doseOtherArray || [];
                $scope.FrequencyArray = resp[0].data.frequencyArray || [];
                $scope.RefillsArray = resp[0].data.refillsArray || [];
                $scope.DurationArray = resp[0].data.durationArray || [];
                $scope.ActionArray = resp[0].data.actionArray || [];
                $scope.RouteArray = resp[0].data.routeArray || [];
                $scope.DoseUnitArray = resp[0].data.doseUnitArray || [];
                $scope.QuantityUnitArray = resp[0].data.quantityUnitArray || [];

                $scope.doseArray = resp[0].data.doseArray || [];
                $scope.doseOtherArray = resp[0].data.doseOtherArray || [];
                $scope.frequencyArray = resp[0].data.frequencyArray || [];
                $scope.refillsArray = resp[0].data.refillsArray || [];
                $scope.durationArray = resp[0].data.durationArray || [];
                $scope.actionArray = resp[0].data.actionArray || [];
                $scope.routeArray = resp[0].data.routeArray || [];
                $scope.doseUnitArray = resp[0].data.doseUnitArray || [];
                $scope.quantityUnitArray = resp[0].data.quantityUnitArray || [];
                $scope.MedicationStopReasons = resp[0].data.MedicationStopReasons || [];
            }
            if (resp[1].data.status === "Success") {
                $scope.MasterSmokingStatus = resp[1].data.SmokingStatus || [];
                $scope.MasterAlcoholStatus = resp[1].data.AlcoholStatus || [];
                $scope.ROSAllergyReactions = resp[1].data.ROSAllergyReactions || [];
                $scope.ROSAllergySeverity = resp[1].data.ROSAllergySeverity || [];
                $scope.ROSAllergyStatus = resp[1].data.ROSAllergyStatus || [];
                $scope.ROSAllergyType = resp[1].data.ROSAllergyType || [];
                $scope.Relations = resp[1].data.Relations || [];
                $scope.ROSModifiers = resp[1].data.Modifiers || [];
                $scope.SmokingStatus = resp[1].data.SmokingStatus || [];
                $scope.SmokingQuantity = resp[1].data.SmokingQuantity || [];
                $scope.AlcoholQuantity = resp[1].data.AlcoholQuantity || [];
                $scope.DrugNames = resp[1].data.DrugNames || [];
                $scope.DrugQuantity = resp[1].data.DrugQuantity || [];
                $scope.DrugWhenQuit = resp[1].data.DrugWhenQuit || [];
                $scope.ROSVaccinationStatus = resp[1].data.VaccinationStatus || [];
                angular.forEach($scope.ROSAllergySeverity, function (item) {
                    if (item.ROSAllergySeverityId !== 2 && item.ROSAllergySeverityId !== 4 && item.ROSAllergySeverityId !== 6 && item.ROSAllergySeverityId !== 7) {
                        $scope.ROSocularSeverity.push(item);
                    }
                });


                //$scope.HealthPhysicalObj.AlcoholStatus = resp[1].data.AlcoholStatus || [];
                $scope.HealthPhysicalObj.AlcoholQuantity = resp[1].data.AlcoholQuantity || [];
               // $scope.HealthPhysicalObj.SmokingStatus = resp[1].data.SmokingStatus || [];
                $scope.HealthPhysicalObj.SmokingQuantity = resp[1].data.SmokingQuantity || [];
                $scope.HealthPhysicalObj.DrugNames = resp[1].data.DrugNames || [];
                $scope.HealthPhysicalObj.DrugQuantity = resp[1].data.DrugQuantity || [];

                if (resp[1].data.SmokingStatus.length > 0) {
                    angular.forEach(resp[1].data.SmokingStatus, function (item) {
                        if (item.HistoryHabitsID == 3 || item.HistoryHabitsID == 4) {
                            $scope.HealthPhysicalObj.NonSmokerStatus.push(item);
                        } else {
                            $scope.HealthPhysicalObj.SmokingStatus.push(item);
                        }
                    });
                }
                if (resp[1].data.AlcoholStatus.length > 0) {
                    angular.forEach(resp[1].data.AlcoholStatus, function (item) {
                        if (item.HistoryHabitsID == 4 || item.HistoryHabitsID == 6) {
                            $scope.HealthPhysicalObj.NonAlcoholStatus.push(item);
                        } else {
                            $scope.HealthPhysicalObj.AlcoholStatus.push(item);
                        }
                    });
                }
                //$scope.HealthPhysicalObj.LifestyleHistory.Smokinglist = resp[1].data.SmokingStatus || [];

            }
            if (resp[5].data.status === "Success") {
                $scope.OrgPostOpChecklist = angular.copy(resp[5].data.rows);
            }
            if (resp[2].data.status === "Success") {
                if (resp[2].data.SystemicHistory.length > 0) {
                    $scope.HealthArray = angular.copy(resp[2].data.SystemicHistory);
                    angular.forEach($scope.HealthArray, function (item) {
                        var object = {
                            "PatientDetailId": 0,
                            "HistoryId": item.HistoryId,
                            "HistoryName": item.HistoryName,
                            "TypeId": item.TypeId,
                            "TypeName": item.TypeName,
                            "IsChecked": false,
                            "Value": '',
                            "DeleteInd": 'N',
                            "Remarks": "",
                            "SnomedCodeobj": "",
                            "OrganId": "",
                            "Duration": "",
                            "DurationType": "D",
                            "DurationTypeName": "Day(s)",
                            "DurationDate": null,
                            "SNOMEDId": null,
                            "SNOMEDCODE": "",
                            "ICD10CODE": "",
                            "DiagnosisObject": "",
                            "DiagnosisId": null,
                            "SeverityId": item.SeverityId || 0,
                            "PreAdmOthernotesInd": false,
                            "IsDiabetes": false,
                            "IsNoshowROS": false,
                            "StatusId": item.StatusId || 1,
                            "SeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                            "IsNormal": item.IsNormal,
                            "OrderId": 0
                        };
                        $scope.HealthPhysicalObj.SystemicHistoryArray.push(object);

                    })
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                        if (item.TypeId == 18) {
                            if (item.HistoryId == 110) {
                                item.OrderId = 1;
                            }

                            if (item.HistoryId == 158) {
                                item.OrderId = 2;
                            }

                            if (item.HistoryId == 159) {
                                item.OrderId = 3;
                            }

                            if (item.HistoryId == 111) {
                                item.OrderId = 4;
                            }

                            if (item.HistoryId == 112) {
                                item.OrderId = 5;
                            }

                            if (item.HistoryId == 113) {
                                item.OrderId = 6;
                            }

                            if (item.HistoryId == 114) {
                                item.OrderId = 7;
                            }

                            if (item.HistoryId == 160) {
                                item.OrderId = 8;
                            }

                            if (item.HistoryId == 161) {
                                item.OrderId = 9;
                            }

                        }
                    });
                }
               
                if (resp[2].data.BillingInstructionsCallChecklist.length > 0) {
                    $scope.PreOpCallObj.BillingInstructionsCallChecklist = [];
                    $scope.PreOpCallObj.BillingInstructionsCallChecklist = resp[2].data.BillingInstructionsCallChecklist || [];
                    $scope.PreOpCallObj.BillingInstructionsCallChecklist.forEach(item => {
                        item.Ischecked = false;
                        item.DeleteInd = 'N';
                        item.BillingAmout = null;
                        item.AppointmentPreOpPostOpCallDetailId = 0;
                    });
                    if ($scope.PreOpCallDetailsList.length > 0) {
                        $scope.PreopsummaryView($scope.PreOpCallDetailsList[0]);
                    }
                }
                if (resp[2].data.GeneralInstructionsCallChecklist.length > 0) {
                    $scope.PreOpCallObj.GeneralInstructionsCallChecklist = [];
                    $scope.PreOpCallObj.GeneralInstructionsCallChecklist = resp[2].data.GeneralInstructionsCallChecklist || [];
                   
                    $scope.PreOpCallObj.GeneralInstructionsCallChecklist.forEach(item => {
                        item.Ischecked = false;
                        item.DeleteInd = 'N';
                        item.AppointmentPreOpPostOpCallDetailId = 0;
                    });
                   
                    if ($scope.PreOpCallDetailsList.length>0) {
                        $scope.PreopsummaryView($scope.PreOpCallDetailsList[0]);
                    }
                }
                if (resp[2].data.PostOpCallActionTakenCheckList.length > 0) {
                    $scope.PostOpCallObj.PostOpCallActionTakenCheckList = [];
                    $scope.PostOpCallObj.PostOpCallActionTakenCheckList = resp[2].data.PostOpCallActionTakenCheckList || [];

                    $scope.PostOpCallObj.PostOpCallActionTakenCheckList.forEach(item => {
                        item.Ischecked = false;
                        item.DeleteInd = 'N';
                        item.PostOpCallActionTakenDetailId = 0;
                        item.Remarks = '';
                    });
                   
                    if ($scope.PostOpCallDetailsList.length > 0) {
                        $scope.Postopsummarymethod($scope.PostOpCallDetailsList[0]);
                    }
                    
                }
            }
            if (resp[3].data.Status === "Success") {

                $scope.FrequentlyAllergyitems = resp[3].data.Allergyitems || [];
                $scope.FrequentlySurgicalHistory = resp[3].data.SurgicalHistory || [];
                $scope.FrequentlySystemicHistory = resp[3].data.SystemicHistory || [];

                angular.forEach($scope.FrequentlyAllergyitems, function (item) {
                    item.Onselect = false;
                });
                angular.forEach($scope.FrequentlySurgicalHistory, function (item) {
                    item.Onselect = false;
                });
                angular.forEach($scope.FrequentlySystemicHistory, function (item) {
                    item.Onselect = false;
                });
            }
            if (resp[4].data.status === "Success") {

                $scope.OrganizationDetails = resp[4].data.OrganizationDetails || [];

                $scope.obj.AllergyItems = angular.copy(resp[4].data.AllergyItems);
                if ($scope.obj.AllergyItems > 0) {
                    angular.forEach($scope.obj.AllergyItems, function (Titem) {
                        Titem.Duration = Titem.Duration || '';
                        Titem.ShowDateFormat = true;
                        Titem.DurationDate = Titem.DurationDate || '';
                        if (Titem.DurationDate != '') {
                            Titem.ShowDateFormat = true;
                        }
                        if (Titem.Duration != '') {
                            Titem.ShowDateFormat = false;
                        }
                        if (Titem.DurationType == 'SB') {
                            Titem.ShowDateFormat = false;
                        }
                    })
                }
                $scope.obj.SystemicHistory = angular.copy(resp[4].data.SystemicHistory);
                $scope.obj.SurgicalHistoryArray = angular.copy(resp[4].data.SurgicalHistory);
                $scope.obj.CurrentSystemicMedicationsHistory = angular.copy(resp[4].data.CurrentSystemicMedicationList);
                angular.forEach($scope.obj.SurgicalHistoryArray, function (Titem) {
                    Titem.Duration = Titem.Duration || '';
                    Titem.ShowDateFormat = true;
                    Titem.DurationDate = Titem.DurationDate || '';
                    if (Titem.DurationDate != '') {
                        Titem.ShowDateFormat = true;
                    }
                    if (Titem.Duration != '') {
                        Titem.ShowDateFormat = false;
                    }
                })
                $scope.obj.CurrentEyeMedicationArray = angular.copy(resp[4].data.CurrentEyeMedicationList) || [];
                $scope.obj.LifestyleDetail = angular.copy(resp[4].data.LifestyleDetail);
               // $scope.HealthPhysicalObj.LifestyleHistory = angular.copy(resp[4].data.LifestyleDetail);
                $scope.PreOpCallObj.IsRosSummaryView = false;
                if ($scope.obj.AllergyItems.length > 0 || $scope.obj.SystemicHistory.length > 0 || $scope.obj.SurgicalHistoryArray.length > 0 || $scope.obj.CurrentSystemicMedicationsHistory.length > 0
                    || $scope.obj.CurrentEyeMedicationArray.length > 0 || $scope.obj.LifestyleDetail.length > 0) {
                    $scope.PreOpCallObj.IsRosSummaryView = true;
                    $scope.PreOpCallObj.IsPreOpRosEditModeInd = true;
                    $scope.PreOpCallObj.IsRossummaryShow = true;
                    $scope.PreOpCallObj.IsPreopCallScreen = true;
                    $scope.PreOpCallObj.IssummaryShow = true;
                    $scope.PreOpCallObj.IsPreopSubCallScreensummary  = true;

                }
                if ($scope.obj.LifestyleDetail.length>0) {
                    angular.forEach($scope.obj.LifestyleDetail, function (Litem) {
                        $scope.HealthPhysicalObj.LifestyleHistory.PatientDetailId = $scope.HealthPhysicalObj.LifestyleHistory.PatientDetailId || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.SmokingType = Litem.SmokingType || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = Litem.AlcoholType || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugType = Litem.DrugType || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.PsychisType = Litem.PsychisType || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholStatusId = Litem.AlcoholStatusId || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDuration = Litem.AlcoholDuration || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationType = Litem.AlcoholDurationType || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationDate = $filter('date')(Litem.AlcoholDurationDate, "MM-dd-yyyy") || null;
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholQuantityId = Litem.AlcoholQuantityId || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugStatusId = Litem.DrugStatusId || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate = $filter('date')(Litem.DrugDurationDate, "MM-dd-yyyy") || null;
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugQuantityId = Litem.DrugQuantityId || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugDuration = Litem.DrugDuration || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationType = Litem.DrugDurationType || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist = angular.copy(Litem.Smokinglist) || [];
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugArray = angular.copy(Litem.DrugArray) || [];
                        $scope.HealthPhysicalObj.LifestyleHistory.Remarks = angular.copy(Litem.Remarks) || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationDate = $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationDate || null;
                        if ($scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationDate != null) {
                            $scope.HealthPhysicalObj.LifestyleHistory.AlcoShowDateFormat = true;
                        }
                        if ($scope.HealthPhysicalObj.LifestyleHistory.AlcoholDuration != '') {
                            $scope.HealthPhysicalObj.LifestyleHistory.AlcoShowDateFormat = false;
                        }
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate = $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate || null;
                        if ($scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate != null) {
                            $scope.HealthPhysicalObj.LifestyleHistory.DrugShowDateFormat = true;
                        }
                        if ($scope.HealthPhysicalObj.LifestyleHistory.DrugDuration != '') {
                            $scope.HealthPhysicalObj.LifestyleHistory.DrugShowDateFormat = false;
                        }
                        if ($scope.HealthPhysicalObj.LifestyleHistory.DrugArray.length > 0) {
                            $scope.DrugListSelectedText = 'Selected';
                            angular.forEach($scope.HealthPhysicalObj.LifestyleHistory.DrugArray, function (ditem) {
                                angular.forEach($scope.HealthPhysicalObj.DrugNames, function (nitem) {
                                    if (ditem.HistoryHabitsId == nitem.HistoryHabitsID) {
                                        nitem.Ischecked = true;
                                    }
                                });
                            });
                        }

                        if ($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.length > 0) {
                            angular.forEach($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist, function (item) {
                                item.SmokingFromDate = item.SmokingFromDate || null;
                                item.SmokeShowDateFormat = true;
                                if (item.SmokingFromDate != null) {
                                    item.SmokingFromDate = moment(item.SmokingFromDate).format("MM-DD-YYYY");
                                    item.SmokeShowDateFormat = true;
                                }
                                item.SmokingDuration = item.SmokingDuration || '';
                                if (item.SmokingDuration != '') {
                                    item.SmokeShowDateFormat = false;
                                }
                            });
                        }
                    })
                }
                // accordian open/close statuses
                if ($scope.MainObj.AllergyItems.length > 0) {
                    $scope.Rosaacordian.IsAllergyacordian = true;
                }
                if ($scope.MainObj.SystemicHistory.length > 0) {
                    $scope.Rosaacordian.IsSystemicacordian = true;
                }
                if ($scope.MainObj.SurgicalHistory.length > 0) {
                    $scope.Rosaacordian.IsSurgicalacordian = true;
                }
                if ($scope.MainObj.CurrentSystemicMedicationsHistory.length > 0) {
                    $scope.Rosaacordian.IsCurrentSystemicacordian = true;
                }
                if ($scope.MainObj.CurrentEyeMedications.length > 0) {
                    $scope.Rosaacordian.IsCurrentEyeacordian = true;
                }
                // systemic history 
                if (resp[4].data.SystemicOtherData != undefined) {
                    $scope.obj.SystemicOtherData = angular.copy(resp[4].data.SystemicOtherData);
                    $scope.HealthPhysicalObj.IsCardiacWNL = $scope.obj.SystemicOtherData.IsCardiacWNL || false;
                    $scope.HealthPhysicalObj.IsPulmonaryWNL = $scope.obj.SystemicOtherData.IsPulmonaryWNL || false;
                    $scope.HealthPhysicalObj.IsHepaticWNL = $scope.obj.SystemicOtherData.IsHepaticWNL || false;
                    $scope.HealthPhysicalObj.IsEndocrineWNL = $scope.obj.SystemicOtherData.IsEndocrineWNL || false;
                    $scope.HealthPhysicalObj.IsNeurologicWNL = $scope.obj.SystemicOtherData.IsNeurologicWNL || false;
                    $scope.HealthPhysicalObj.IsHemeOncWNL = $scope.obj.SystemicOtherData.IsHemeOncWNL || false;
                    $scope.HealthPhysicalObj.IsNervousSystemWNL = $scope.obj.SystemicOtherData.IsNervousSystemWNL || false;
                    $scope.HealthPhysicalObj.IsKidneyDiseaseWNL = $scope.obj.SystemicOtherData.IsKidneyDiseaseWNL || false;
                    $scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL = $scope.obj.SystemicOtherData.IsMusculoSkeletalSystemWNL || false;
                    $scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL = $scope.obj.SystemicOtherData.IsAutoImmuneDisordersWNL || false;
                    $scope.HealthPhysicalObj.IsPsychosisWNL = $scope.obj.SystemicOtherData.IsPsychosisWNL || false;
                    $scope.HealthPhysicalObj.IsOthersWNL = $scope.obj.SystemicOtherData.IsOthersWNL || false;
                    $scope.HealthPhysicalObj.IsHeentWNL = $scope.obj.SystemicOtherData.IsHeentWNL || false;
                    $scope.HealthPhysicalObj.IsLungsWNL = $scope.obj.SystemicOtherData.IsLungsWNL || false;
                    $scope.HealthPhysicalObj.IsGeneralappearanceWNL = $scope.obj.SystemicOtherData.IsGeneralappearanceWNL || false;
                }
                //if all normal check true
                if ($scope.HealthPhysicalObj.IsCardiacWNL == true && $scope.HealthPhysicalObj.IsGeneralappearanceWNL == true &&
                    $scope.HealthPhysicalObj.IsHepaticWNL == true && $scope.HealthPhysicalObj.IsEndocrineWNL == true &&
                    $scope.HealthPhysicalObj.IsNeurologicWNL == true && $scope.HealthPhysicalObj.IsHemeOncWNL == true &&
                    $scope.HealthPhysicalObj.IsNervousSystemWNL == true && $scope.HealthPhysicalObj.IsKidneyDiseaseWNL == true &&
                    $scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL == true && $scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL == true &&
                    $scope.HealthPhysicalObj.IsPsychosisWNL == true && $scope.HealthPhysicalObj.IsOthersWNL == true &&
                    $scope.HealthPhysicalObj.IsHeentWNL == true && $scope.HealthPhysicalObj.IsLungsWNL == true && $scope.HealthPhysicalObj.IsPulmonaryWNL == true) {
                    $scope.HealthPhysicalObj.IsAllHealthWNL = true;
                } else {
                    $scope.HealthPhysicalObj.IsAllHealthWNL = false;
                }
                // Systemic history  Notes 
                $scope.HealthPhysicalObj.CardiacNotes = resp[4].data.SystemicOtherData.CardiacNotes || '';
                if ($scope.HealthPhysicalObj.CardiacNotes !== '') {
                    $scope.HealthPhysicalObj.showCardiacNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showCardiacNotes = false;
                }

                $scope.HealthPhysicalObj.NeurologicNotes = resp[4].data.SystemicOtherData.NeurologicNotes || '';
                if ($scope.HealthPhysicalObj.NeurologicNotes !== '') {
                    $scope.HealthPhysicalObj.showNeurologicNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showNeurologicNotes = false;
                }

                $scope.HealthPhysicalObj.GeneralAppearenceNotes = resp[4].data.SystemicOtherData.GeneralAppearenceNotes || '';
                if ($scope.HealthPhysicalObj.GeneralAppearenceNotes !== '') {
                    $scope.HealthPhysicalObj.showGeneralAppearenceNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showGeneralAppearenceNotes = false;
                }

                $scope.HealthPhysicalObj.HeentNotes = resp[4].data.SystemicOtherData.HeentNotes || '';
                if ($scope.HealthPhysicalObj.HeentNotes !== '') {
                    $scope.HealthPhysicalObj.showHeentNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showHeentNotes = false;
                }

                $scope.HealthPhysicalObj.LungsNotes = resp[4].data.SystemicOtherData.LungsNotes || '';
                if ($scope.HealthPhysicalObj.LungsNotes !== '') {
                    $scope.HealthPhysicalObj.showLungsNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showLungsNotes = false;
                }

                $scope.HealthPhysicalObj.PulmonaryNotes = resp[4].data.SystemicOtherData.PulmonaryNotes || '';
                if ($scope.HealthPhysicalObj.PulmonaryNotes !== '') {
                    $scope.HealthPhysicalObj.showPulmonaryNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showPulmonaryNotes = false;
                }

                $scope.HealthPhysicalObj.HepaticNotes = resp[4].data.SystemicOtherData.HepaticNotes || '';
                if ($scope.HealthPhysicalObj.HepaticNotes !== '') {
                    $scope.HealthPhysicalObj.showHepaticNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showHepaticNotes = false;
                }

                $scope.HealthPhysicalObj.HemeOncNotes = resp[4].data.SystemicOtherData.HemeOncNotes || '';
                if ($scope.HealthPhysicalObj.HemeOncNotes !== '') {
                    $scope.HealthPhysicalObj.showHemeOncNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showHemeOncNotes = false;
                }

                $scope.HealthPhysicalObj.NervousSystemNotes = resp[4].data.SystemicOtherData.NervousSystemNotes || '';
                if ($scope.HealthPhysicalObj.NervousSystemNotes !== '') {
                    $scope.HealthPhysicalObj.showNervousSystemNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showNervousSystemNotes = false;
                }
                $scope.HealthPhysicalObj.EndocrineNotes = resp[4].data.SystemicOtherData.EndocrineNotes || '';
                if ($scope.HealthPhysicalObj.EndocrineNotes !== '') {
                    $scope.HealthPhysicalObj.showEndocrineNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showEndocrineNotes = false;
                }

                $scope.HealthPhysicalObj.KidneyDiseaseNotes = resp[4].data.SystemicOtherData.KidneyDiseaseNotes || '';
                if ($scope.HealthPhysicalObj.KidneyDiseaseNotes !== '') {
                    $scope.HealthPhysicalObj.showKidneyDiseaseNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showKidneyDiseaseNotes = false;
                }

                $scope.HealthPhysicalObj.MusculoSkeletalSystemNotes = resp[4].data.SystemicOtherData.MusculoSkeletalSystemNotes || '';
                if ($scope.HealthPhysicalObj.MusculoSkeletalSystemNotes !== '') {
                    $scope.HealthPhysicalObj.showMusculoSkeletalSystemNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showMusculoSkeletalSystemNotes = false;
                }
                $scope.HealthPhysicalObj.PsychosisNotes = resp[4].data.SystemicOtherData.PsychosisNotes || '';
                if ($scope.HealthPhysicalObj.PsychosisNotes !== '') {
                    $scope.HealthPhysicalObj.showPsychosisNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showPsychosisNotes = false;
                }

                $scope.HealthPhysicalObj.OthersNotes = resp[4].data.SystemicOtherData.OthersNotes || '';
                if ($scope.HealthPhysicalObj.OthersNotes !== '') {
                    $scope.HealthPhysicalObj.showOthersNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showOthersNotes = false;
                }

                // frequently info
                if ($scope.obj.AllergyItems.length > 0) {
                    angular.forEach($scope.obj.AllergyItems, function (item) {
                        var FreqList = $filter("filter")($scope.FrequentlyAllergyitems, function (fitem) {
                            return fitem.AllergyId == item.AllergyId;
                        }, true) || [];
                        if (FreqList.length > 0) {
                            FreqList[0].Onselect = true;
                        }

                        if (item.AllergyId === 1) {
                            $scope.obj.isNKASelected = true;
                        } else {
                            $scope.obj.isNKASelected = false;
                        }
                        if (item.AllergyId === 2) {
                            $scope.obj.isNKDASelected = true;
                        } else {
                            $scope.obj.isNKDASelected = false;
                        }
                    });
                }
                if ($scope.obj.SystemicHistory.length > 0) {
                    angular.forEach($scope.obj.SystemicHistory, function (item) {
                        var FreqList = $filter("filter")($scope.FrequentlySurgicalHistory, function (fitem) {
                            return fitem.HistoryId == item.HistoryId;
                        }, true) || [];
                        if (FreqList.length > 0) {
                            FreqList[0].Onselect = true;
                        }
                        if (item.HistoryId === 1) {
                            $scope.obj.isNKSHSelected = true;
                        } else {
                            $scope.obj.isNKSHSelected = false;
                        }
                    });
                }
                $scope.obj.SurgicalHistoryArray = $scope.obj.SurgicalHistoryArray || [];
                if ($scope.obj.SurgicalHistoryArray.length > 0) {
                    angular.forEach($scope.obj.SurgicalHistoryArray, function (item) {
                        if (item.HistoryId === 1) {
                            $scope.obj.isNKSGHSelected = true;
                        } else {
                            $scope.obj.isNKSGHSelected = false;
                        }
                    })
                }
                $scope.obj.CurrentSystemicMedicationsHistory = $scope.obj.CurrentSystemicMedicationsHistory || [];

                if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
                    let List = $filter("filter")($scope.obj.CurrentSystemicMedicationsHistory, function (fitem) {
                        return fitem.MedicineId === 2 && fitem.DeleteInd == 'N';
                    }, true);
                    if (List.length > 0) {
                        $scope.obj.isNKCSMSelected = true;
                    } else {
                        $scope.obj.isNKCSMSelected = false;
                    }

                    let List1 = $filter("filter")($scope.obj.CurrentSystemicMedicationsHistory, function (fitem) {
                        return fitem.MedicineId === 1 && fitem.DeleteInd == 'N';
                    }, true);
                    if (List1.length > 0) {
                        $scope.obj.isNKCEMSelected = true;
                    } else {
                        $scope.obj.isNKCEMSelected = false;
                    }
                }
                //social 
                var TempRespi6 = $filter('filter')($scope.MainObj.LifestyleDetail, { 'HistoryId': 122 }, true);
                if (TempRespi6.length > 0) {
                    $scope.RespiratoryObj.IsLungsclearance = true;
                }
                if ($scope.MainObj.LifestyleDetail.length > 0) {
                    angular.forEach($scope.MainObj.LifestyleDetail, function (Litem) {
                        if (Litem.AlcoholType == '' && Litem.DrugType == '' && Litem.PsychisType == '' && Litem.SmokingType == '' && Litem.Remarks == '') {
                          //  $scope.HealthPhysical.LifeStyelInd = false;
                        } else {
                            //$scope.HealthPhysical.LifeStyelInd = true;
                            $scope.Rosaacordian.IsSocialacordian = true;
                        }
                    });
                } else {
                  //  $scope.HealthPhysical.LifeStyelInd = false;
                }
                //Systematic
                var TempSystemic1 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 110 }, true);
                if (TempSystemic1.length > 0) {
                    $scope.SystemicHisObj.IsDiabetes = true;
                }
                var TempSystemic2 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 111 }, true);
                if (TempSystemic2.length > 0) {
                    $scope.SystemicHisObj.IsLiverDisease = true;
                }
                var TempSystemic3 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 112 }, true);
                if (TempSystemic3.length > 0) {
                    $scope.SystemicHisObj.IsInfDisease = true;
                }
                var TempSystemic4 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 113 }, true);
                if (TempSystemic4.length > 0) {
                    $scope.SystemicHisObj.IsAllergies = true;
                }
                var TempSystemic5 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 114 }, true);
                if (TempSystemic5.length > 0) {
                    $scope.SystemicHisObj.IsEndocrine = true;
                }
                //if ($scope.SystemicHisObj.IsDiabetes == false && $scope.SystemicHisObj.IsLiverDisease == false && $scope.SystemicHisObj.IsInfDisease == false && $scope.SystemicHisObj.IsAllergies == false && $scope.SystemicHisObj.IsEndocrine == false) {
                //    $scope.SystemicHisObj.Indicatory = false;
                //} else {
                //    $scope.SystemicHisObj.Indicatory = true;
                //}

                // ROS Overall Notes
                $scope.obj.AllergyRemarks = resp[4].data.AllergyRemarks || '';
             
                if ($scope.obj.AllergyRemarks != '') {
                    $scope.obj.AllergyNotesInd = true;
                } else {
                    $scope.obj.AllergyNotesInd = false;
                }

                $scope.obj.SurgicalRemarks = resp[4].data.SurgicalRemarks || '';
            
                if ($scope.obj.SurgicalRemarks != '') {
                    $scope.obj.SurgicalNotesInd = true;
                } else {
                    $scope.obj.SurgicalNotesInd = false;
                }

                $scope.obj.CurrentSystemicRemarks = resp[4].data.CurrentSystemicRemarks || '';
             
                if ($scope.obj.CurrentSystemicRemarks != '') {
                    $scope.obj.CurrentSystemicNotesInd = true;
                } else {
                    $scope.obj.CurrentSystemicNotesInd = false;
                }

                $scope.obj.CurrentEyeRemarks = resp[4].data.CurrentEyeRemarks || '';
               
                if ($scope.obj.CurrentEyeRemarks != '') {
                    $scope.obj.CurrentEyeNotesInd = true;
                } else {
                    $scope.obj.CurrentEyeNotesInd = false;
                }
                $scope.obj.SystemicHistoryRemarks = resp[4].data.SystemicHistoryRemarks || '';
              
                if ($scope.obj.SystemicHistoryRemarks != '') {
                    $scope.obj.SystemicHistoryNotesInd = true;
                } else {
                    $scope.obj.SystemicHistoryNotesInd = false;
                }

                $scope.obj.LifestyleHistoryRemarks = resp[4].data.LifestyleHistoryRemarks || '';
             
                if ($scope.obj.LifestyleHistoryRemarks != '') {
                    $scope.obj.LifestyleHistoryNotesInd = true;
                } else {
                    $scope.obj.LifestyleHistoryNotesInd = false;
                }
            }
            if (resp[6].data.status === "Success") {
                if (resp[6].data.ROS.length > 0) {

                    $scope.ROSIsNormalArray = resp[6].data.ROS || [];
                }
            }

            if ($scope.allUserList.length > 0) {
                $scope.PreopCallNurseReviewedByArray = [];
                $scope.PreopCallNurseReviewedByArray = $scope.allUserList.filter((x) => x.RoleId == 8);
            }

        });
    }
    $scope.init();

    $scope.PostOpselectedItem = function (subArray, item) {
        if (subArray.length > 0) {
            angular.forEach(subArray, function (sitem) {
                if (sitem.OrganizationPreOpCheckListValueId !== item.OrganizationPreOpCheckListValueId) {
                    sitem.PatientAscCheckListDetailId = sitem.PatientAscCheckListDetailId || 0;
                    if (sitem.PatientAscCheckListDetailId != 0) {
                        sitem.DeleteInd = 'Y';
                    }
                    sitem.IsChecked = false;
                } else {
                    sitem.IsChecked = true;
                    sitem.DeleteInd = 'N';
                }
            });
        }
    }
    $scope.PostOpselectedmultiItem = function (item) {
        //if (subArray.length > 0) {
        //    angular.forEach(subArray, function (sitem) {
        //        //sitem.IsChecked = false;
        //        if (sitem.OrganizationPreOpCheckListValueId == item.OrganizationPreOpCheckListValueId) {
                //    item.IsChecked = true;
        //        }
        //    });
        //}
    }

    $scope.findDifferences = function (savedArray, editedArray) {
        var differences = [];
       
        angular.forEach(savedArray, function (item) {
            var edited = editedArray.filter(function (eitem) {
                item.Remarks = item.Remarks || '';
                eitem.Remarks = eitem.Remarks || '';
                return ((eitem.PostOpCallActionTakenCheckListId == item.PostOpCallActionTakenCheckListId) && (item.Remarks == eitem.Remarks) && (item.Ischecked == eitem.Ischecked) && (item.DeleteInd == eitem.DeleteInd));
            }) || [];


            if (edited.length == 0) {
                differences.push({
                    PostOpCallActionTakenCheckListId: item.PostOpCallActionTakenCheckListId,
                    Remarks: item.Remarks,
                    Ischecked: item.Ischecked,
                    DeleteInd: item.DeleteInd,
                    PostOpCallActionTakenCheckList: item.PostOpCallActionTakenCheckList,
                });
               
            }

        });

        return differences;
    };

    

    $scope.findOrgCheckListDifferences = function (savedArray, editedArray) {
        var differences = [];
        angular.forEach(savedArray, function (item) {
            var edited = editedArray.filter(function (eitem) {
                return ((item.CheckListId == eitem.CheckListId) && (item.Value == eitem.Value) && (item.DeleteInd == eitem.DeleteInd));
            }) || [];


            if (edited.length == 0) {
                differences.push({
                    CheckListId: item.CheckListId,
                    Value: item.Value,
                    CheckListModuleId: item.CheckListModuleId,
                    CheckListSubTypeId: item.CheckListSubTypeId,
                    DeleteInd: item.DeleteInd
                });
                
            }

        });
        return differences;
    };


    $scope.PostOpCallObj.PostopCallList = [];
    let OrgASCChecklist1 = [];
    $scope.PostOpCallObj.IsClickSavePostOpCallBtn = false;
    $scope.SavePostOpCall = function () {
        $scope.LogObj.LogArray = [];
        let temppostopcallList = $filter('filter')($scope.OrgPostOpChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 21 }, true) || [];
        if (temppostopcallList.length > 0) {
            $scope.PostOpCallObj.PostopCallList = angular.copy(temppostopcallList);
        }
       
        angular.forEach($scope.PostOpCallObj.PostopCallList, function (item) {
            let checkedvaluearray = $filter("filter")(item.OrganizationCheckListDetails, function (kitem, index) { return (kitem.IsChecked == true) || (kitem.IsChecked == false && kitem.DeleteInd == 'Y'); });

            if (checkedvaluearray.length > 0) {
                angular.forEach(checkedvaluearray, function (mitem) {
                    if (mitem !== undefined) {
                        if (mitem.CheckListId === item.CheckListId) {
                            let obj = {
                                "PatientAscCheckListDetailId": mitem.PatientAscCheckListDetailId || 0,
                                "CheckListId": item.CheckListId,
                                "CheckListName": item.CheckListName,
                                "CheckListModuleId": item.CheckListModuleId,
                                "CheckListCategoryId": item.CheckListCategoryId,
                                "CheckListSubTypeId": item.CheckListSubTypeId,
                                "ParentOrganizationId": item.ParentOrganizationId,
                                "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId,
                                "DeleteInd": mitem.DeleteInd,
                                "OrganizationPreOpCheckListValueId": (mitem != undefined) ? mitem.OrganizationPreOpCheckListValueId : null,
                                "Value": (mitem != undefined) ? mitem.Value : "",
                                "ChecklistDate": item.ChecklistDate || "",
                                "Remarks": item.Remarks || "",
                            };
                            OrgASCChecklist1.push(obj);
                        }
                    }
                });
            }
        })

      

        if ($scope.PostOpCallObj.PostOpCallActionTakenCheckList.length > 0) {
            angular.forEach($scope.PostOpCallObj.PostOpCallActionTakenCheckList, function (item) {
                if (item.PostOpCallActionTakenDetailId != 0 && item.Ischecked == false) {
                    item.DeleteInd = 'Y';
                }
            }); 
        }
        let filterdActionTakenCallChecklist = $filter('filter')($scope.PostOpCallObj.PostOpCallActionTakenCheckList, function (item) {
            return item.Ischecked == true || item.PostOpCallActionTakenDetailId != 0;
        });

        var req = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "AppointmentId": $scope.PostOpCallObj.AppointmentId,
            "PatientId": $scope.PostOpCallObj.PatientId,
            "HospitalId": $scope.HospitalId,
            "PatientAscPostOpCallId": $scope.PostOpCallObj.PatientAscPostOpCallId,
            "CoPayNotes": $scope.PostOpCallObj.CoPayNotes,
            "Patientoutcomenotes": $scope.PostOpCallObj.Patientoutcomenotes,
            "ContactType": $scope.PostOpCallObj.ContactType ,
            //"ContactType": $scope.PostOpCallObj.ContactType,
            "OtherNo": $scope.PostOpCallObj.AddnewMobileNo,
            "ContactStartDate": $scope.PostOpCallObj.ContactStartDate,
            "ContactStartTime": $scope.PostOpCallObj.ContactStartTime,
            "OrgASCChecklist": OrgASCChecklist1 || [],
            "PainLevel": $scope.PostOpCallObj.PainLevel || null,
            "AdditionalNotes": $scope.PostOpCallObj.AdditionalNotes || '',
            "ScheduledDate": $scope.PostOpCallObj.ScheduledDate || null,
            "CallAttempt": $scope.PostOpCallObj.CallAttempt || '',
            "SpokeWith": $scope.PostOpCallObj.SpokeWith || '',
            "PostOpCallActionTakenCheckList": filterdActionTakenCallChecklist || [],
            "SideEffects": $scope.PostOpCallObj.SideEffects || '',
            "SideEffectsReason": $scope.PostOpCallObj.SideEffectsReason || '',
            "MedicationHelping":$scope.PostOpCallObj.MedicationHelping || '',
            "MedicationHelpingReason": $scope.PostOpCallObj.MedicationHelpingReason || '',
            "ActivityRestrictions": $scope.PostOpCallObj.ActivityRestrictions || '',
            "EyeShieldUsed": $scope.PostOpCallObj.EyeShieldUsed || '',
            "ConfirmedAppointment": $scope.PostOpCallObj.ConfirmedAppointment || '',
            "NauseaOrVomiting": $scope.PostOpCallObj.NauseaOrVomiting || '',
            "NauseaSeverity": $scope.PostOpCallObj.NauseaSeverity || '',
            "EyeDropScheduleUnderstanding": $scope.PostOpCallObj.EyeDropScheduleUnderstanding || '',
            "PostopCallNurseReviewedById": $scope.PostOpCallObj.PostopCallNurseReviewedById || null,
            "PostopCallNurseReviewedByTime": $scope.PostOpCallObj.PostopCallNurseReviewedByTime || "",
            "PostopCallNurseReviewedByDate": $scope.PostOpCallObj.PostopCallNurseReviewedByDate || null,
            "RescheduleConfirmed": $scope.PostOpCallObj.RescheduleConfirmed || false,
            "Logs": {},
        }


        $scope.PostOpCallObj.PostopCallNurseReviewedById = $scope.PostOpCallObj.PostopCallNurseReviewedById || null;
        $scope.LogObj.PostopCallNurseReviewedById = $scope.LogObj.PostopCallNurseReviewedById || null;
      
        if ($scope.PostOpCallObj.PostopCallNurseReviewedById || $scope.LogObj.PostopCallNurseReviewedById) {
            let ActionType = ''
            let count = 0;
            if ($scope.LogObj.PostopCallNurseReviewedById == null) {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }

            let NewgivenByUser = '';
            let OldgivenByUser = '';

            var NewReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.PostOpCallObj.PostopCallNurseReviewedById });
            if (NewReviewedByArraylist.length > 0) {
                NewgivenByUser = angular.copy(NewReviewedByArraylist[0].SecondUserFullName) +
                    (NewReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(NewReviewedByArraylist[0].LicenseNumber) : "");
            }

            var OldReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.LogObj.PostopCallNurseReviewedById});
            if (OldReviewedByArraylist.length > 0) {
                OldgivenByUser = angular.copy(OldReviewedByArraylist[0].SecondUserFullName) +
                    (OldReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(OldReviewedByArraylist[0].LicenseNumber) : "");
            }

            if ($scope.PostOpCallObj.PostopCallNurseReviewedById != $scope.LogObj.PostopCallNurseReviewedById) {
                count++;
            }

            let OldValue = '';
            let NewValue = '';

            if (OldgivenByUser != '') {
                OldValue = `Reviewed  by ${OldgivenByUser} In  Post-Op Call`;
            }
            if (NewgivenByUser != '') {
                NewValue = `Reviewed  by ${NewgivenByUser} In  Post-Op Call`;
            }
            if (count !=0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOp Reviewed By",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": ActionType,
                    "OldActionDescription": OldValue,
                    "NewActionDescription": NewValue,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }

        $scope.PostOpCallObj.PostopCallNurseReviewedByTime = $scope.PostOpCallObj.PostopCallNurseReviewedByTime || '';
        $scope.LogObj.PostopCallNurseReviewedByTime = $scope.LogObj.PostopCallNurseReviewedByTime || '';

        if ($scope.PostOpCallObj.PostopCallNurseReviewedByTime || $scope.LogObj.PostopCallNurseReviewedByTime) {
            let count = 0;
            let ActionType = $scope.LogObj.PostopCallNurseReviewedByTime == '' ? 'Added' : 'Edited';

            if ($scope.PostOpCallObj.PostopCallNurseReviewedByTime != $scope.LogObj.PostopCallNurseReviewedByTime) {
                count++;
            }

            if (count != 0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOp Reviewed By Time",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": ActionType,
                    "OldActionDescription": $scope.LogObj.PostopCallNurseReviewedByTime,
                    "NewActionDescription": $scope.PostOpCallObj.PostopCallNurseReviewedByTime,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }


        $scope.PostOpCallObj.SideEffects = $scope.PostOpCallObj.SideEffects || '';
        $scope.LogObj.SideEffects = $scope.LogObj.SideEffects || '';
        $scope.PostOpCallObj.SideEffectsReason = $scope.PostOpCallObj.SideEffectsReason || '';
        $scope.LogObj.SideEffectsReason = $scope.LogObj.SideEffectsReason || '';
        $scope.PostOpCallObj.PainLevel = $scope.PostOpCallObj.PainLevel || null;
        $scope.LogObj.PainLevel = $scope.LogObj.PainLevel || null;
        $scope.PostOpCallObj.MedicationHelping = $scope.PostOpCallObj.MedicationHelping || '';
        $scope.LogObj.MedicationHelping = $scope.LogObj.MedicationHelping || '';
        $scope.PostOpCallObj.MedicationHelpingReason = $scope.PostOpCallObj.MedicationHelpingReason || '';
        $scope.LogObj.MedicationHelpingReason = $scope.LogObj.MedicationHelpingReason || '';

        if ($scope.PostOpCallObj.SideEffects || $scope.LogObj.SideEffects || $scope.PostOpCallObj.SideEffectsReason || $scope.LogObj.SideEffectsReason || $scope.PostOpCallObj.PainLevel || $scope.LogObj.PainLevel || $scope.PostOpCallObj.MedicationHelping || $scope.LogObj.MedicationHelping || $scope.PostOpCallObj.MedicationHelpingReason || $scope.LogObj.MedicationHelpingReason) {
            let ActionType = '';
            let count = 0;
            if ($scope.LogObj.SideEffects=='' && $scope.LogObj.SideEffectsReason=='' && $scope.LogObj.PainLevel==null && $scope.LogObj.MedicationHelping=='' && $scope.LogObj.MedicationHelpingReason=='') {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }
            let Newvalue = '';
            let Oldvalue = '';

            if ($scope.PostOpCallObj.SideEffects != $scope.LogObj.SideEffects) {
                if ($scope.PostOpCallObj.SideEffects)
                    Newvalue += `${Newvalue ? ', ' : ''}Any medication side effects? : ${$scope.PostOpCallObj.SideEffects}`;
                if ($scope.LogObj.SideEffects)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Any medication side effects? : ${$scope.LogObj.SideEffects}`;
                count++;
            }
            if ($scope.PostOpCallObj.SideEffectsReason != $scope.LogObj.SideEffectsReason) {
                if ($scope.PostOpCallObj.SideEffectsReason)
                    Newvalue += `${Newvalue ? ', ' : ''}Notes : ${$scope.PostOpCallObj.SideEffectsReason}`;
                if ($scope.LogObj.SideEffectsReason)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Notes : ${$scope.LogObj.SideEffectsReason}`;
                count++;
            }
            if ($scope.PostOpCallObj.PainLevel != $scope.LogObj.PainLevel) {
                if ($scope.PostOpCallObj.PainLevel)
                    Newvalue += `${Newvalue ? ', ' : ''}Pain Level : ${$scope.PostOpCallObj.PainLevel}`;
                if ($scope.LogObj.PainLevel)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Pain Level : ${$scope.LogObj.PainLevel}`;
                count++;
            }
            if ($scope.PostOpCallObj.MedicationHelping != $scope.LogObj.MedicationHelping) {
                if ($scope.PostOpCallObj.MedicationHelping)
                    Newvalue += `${Newvalue ? ', ' : ''}Is the prescribed pain medication helping? : ${$scope.PostOpCallObj.MedicationHelping}`;
                if ($scope.LogObj.MedicationHelping)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Is the prescribed pain medication helping? : ${$scope.LogObj.MedicationHelping}`;
                count++;
            }
            if ($scope.PostOpCallObj.MedicationHelpingReason != $scope.LogObj.MedicationHelpingReason) {
                if ($scope.PostOpCallObj.MedicationHelpingReason)
                    Newvalue += `${Newvalue ? ', ' : ''}Notes : ${$scope.PostOpCallObj.MedicationHelpingReason}`;
                if ($scope.LogObj.MedicationHelpingReason)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Notes : ${$scope.LogObj.MedicationHelpingReason}`;
                count++;
            }
            
            if (count !=0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall Pain & Medication ",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": ActionType,
                    "OldActionDescription": Oldvalue,
                    "NewActionDescription": Newvalue,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }

        $scope.PostOpCallObj.ActivityRestrictions = $scope.PostOpCallObj.ActivityRestrictions || '';
        $scope.LogObj.ActivityRestrictions = $scope.LogObj.ActivityRestrictions || '';
        $scope.PostOpCallObj.EyeShieldUsed = $scope.PostOpCallObj.EyeShieldUsed || '';
        $scope.LogObj.EyeShieldUsed = $scope.LogObj.EyeShieldUsed || '';
        
        if ($scope.PostOpCallObj.ActivityRestrictions || $scope.LogObj.ActivityRestrictions || $scope.PostOpCallObj.EyeShieldUsed || $scope.LogObj.EyeShieldUsed) {
            let ActionType = '';
            let count = 0;
            if ($scope.LogObj.ActivityRestrictions == '' && $scope.LogObj.EyeShieldUsed == '') {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }

            let Newvalue = '';
            let Oldvalue = '';

            if ($scope.PostOpCallObj.ActivityRestrictions != $scope.LogObj.ActivityRestrictions) {
                if ($scope.PostOpCallObj.ActivityRestrictions)
                    Newvalue += `${Newvalue ? ', ' : ''}Following activity restrictions? : ${$scope.PostOpCallObj.ActivityRestrictions}`;
                if ($scope.LogObj.ActivityRestrictions)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Following activity restrictions? : ${$scope.LogObj.ActivityRestrictions}`;
                count++;
            }
            if ($scope.PostOpCallObj.EyeShieldUsed != $scope.LogObj.EyeShieldUsed) {
                if ($scope.PostOpCallObj.EyeShieldUsed)
                    Newvalue += `${Newvalue ? ', ' : ''}Using eye shield (if applicable)? : ${$scope.PostOpCallObj.EyeShieldUsed}`;
                if ($scope.LogObj.EyeShieldUsed)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Using eye shield (if applicable)? : ${$scope.LogObj.EyeShieldUsed}`;
                count++;
            }
            

            if (count != 0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall Post-Op Care & Restrictions ",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": ActionType,
                    "OldActionDescription": Oldvalue,
                    "NewActionDescription": Newvalue,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }


        $scope.PostOpCallObj.ScheduledDate = $scope.PostOpCallObj.ScheduledDate || null;
        $scope.LogObj.ScheduledDate = $scope.LogObj.ScheduledDate || null;
        $scope.PostOpCallObj.ConfirmedAppointment = $scope.PostOpCallObj.ConfirmedAppointment || '';
        $scope.LogObj.ConfirmedAppointment = $scope.LogObj.ConfirmedAppointment || '';
        $scope.PostOpCallObj.RescheduleConfirmed = $scope.PostOpCallObj.RescheduleConfirmed || false;
        $scope.LogObj.RescheduleConfirmed = $scope.LogObj.RescheduleConfirmed || false

        if ($scope.PostOpCallObj.ScheduledDate || $scope.LogObj.ScheduledDate || $scope.PostOpCallObj.ConfirmedAppointment || $scope.LogObj.ConfirmedAppointment || $scope.PostOpCallObj.RescheduleConfirmed || $scope.LogObj.RescheduleConfirmed) {
            let ActionType = '';
            let count = 0;
            if ($scope.LogObj.ScheduledDate == null && $scope.LogObj.ConfirmedAppointment == '' && $scope.LogObj.RescheduleConfirmed==false) {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }

            let Newvalue = '';
            let Oldvalue = '';

            $scope.PostOpCallObj.ScheduledDate = $filter("date")($scope.PostOpCallObj.ScheduledDate, "MM-dd-yyyy") || null;
            $scope.LogObj.ScheduledDate = $filter("date")($scope.LogObj.ScheduledDate, "MM-dd-yyyy") || null;

            if ($scope.PostOpCallObj.ScheduledDate != $scope.LogObj.ScheduledDate) {
                if ($scope.PostOpCallObj.ScheduledDate)
                    Newvalue += `${Newvalue ? ', ' : ''}Scheduled for : ${$scope.PostOpCallObj.ScheduledDate}`;
                if ($scope.LogObj.ScheduledDate)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Scheduled for : ${$scope.LogObj.ScheduledDate}`;
                count++;
            }
            if ($scope.PostOpCallObj.ConfirmedAppointment != $scope.LogObj.ConfirmedAppointment) {
                if ($scope.PostOpCallObj.ConfirmedAppointment)
                    Newvalue += `${Newvalue ? ', ' : ''}Patient confirmed appointment? : ${$scope.PostOpCallObj.ConfirmedAppointment}`;
                if ($scope.LogObj.ConfirmedAppointment)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Patient confirmed appointment? : ${$scope.LogObj.ConfirmedAppointment}`;
                count++;
            }
            if ($scope.PostOpCallObj.RescheduleConfirmed != $scope.LogObj.RescheduleConfirmed) {
                if ($scope.PostOpCallObj.RescheduleConfirmed)
                    Newvalue += `${Newvalue ? ', ' : ''} Reschedule Confirmed`;
                if ($scope.LogObj.RescheduleConfirmed)
                    Oldvalue += `${Oldvalue ? ', ' : ''} Reschedule Confirmed`;
                count++;
            }

            if (count != 0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall Follow-up Appointment",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": ActionType,
                    "OldActionDescription": Oldvalue,
                    "NewActionDescription": Newvalue,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }


        $scope.PostOpCallObj.ContactType = $scope.PostOpCallObj.ContactType || '';
        $scope.LogObj.ContactType = $scope.LogObj.ContactType || '';
        $scope.PostOpCallObj.AddnewMobileNo = $scope.PostOpCallObj.AddnewMobileNo || '';
        $scope.LogObj.AddnewMobileNo = $scope.LogObj.AddnewMobileNo || '';
        $scope.PostOpCallObj.ContactStartDate = $scope.PostOpCallObj.ContactStartDate || null;
        $scope.LogObj.ContactStartDate = $scope.LogObj.ContactStartDate || null;
        $scope.PostOpCallObj.ContactStartTime = $scope.PostOpCallObj.ContactStartTime || '';
        $scope.LogObj.ContactStartTime = $scope.LogObj.ContactStartTime || '';
       
        

        if ($scope.PostOpCallObj.ContactType || $scope.LogObj.ContactType || $scope.PostOpCallObj.AddnewMobileNo || $scope.LogObj.AddnewMobileNo || $scope.PostOpCallObj.ContactStartDate || $scope.LogObj.ContactStartDate || $scope.PostOpCallObj.ContactStartTime || $scope.LogObj.ContactStartTime) {
            let ActionType = '';
            let count = 0;
            if ($scope.LogObj.ContactType == '' && $scope.LogObj.AddnewMobileNo == '' && $scope.LogObj.ContactStartDate == null && $scope.LogObj.ContactStartTime == '' ) {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }

            let Oldvalue = '';
            let Newvalue = '';

            if ($scope.PostOpCallObj.ContactType != $scope.LogObj.ContactType) {
                if ($scope.PostOpCallObj.ContactType)
                    Newvalue += `${Newvalue ? ', ' : ''}Mobile No: ${$scope.PostOpCallObj.ContactType}`;
                if ($scope.LogObj.ContactType)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Mobile No: ${$scope.LogObj.ContactType}`;
                count++;
            }
            if ($scope.PostOpCallObj.AddnewMobileNo != $scope.LogObj.AddnewMobileNo) {
                if ($scope.PostOpCallObj.AddnewMobileNo)
                    Newvalue += `${Newvalue ? ', ' : ''} Mobile No: ${$scope.PostOpCallObj.AddnewMobileNo}`;
                if ($scope.LogObj.AddnewMobileNo)
                    Oldvalue += `${Oldvalue ? ', ' : ''} Mobile No: ${$scope.LogObj.AddnewMobileNo}`;
                count++;
            }
            if ($scope.PostOpCallObj.ContactStartDate != $scope.LogObj.ContactStartDate) {
                if ($scope.PostOpCallObj.ContactStartDate)
                    Newvalue += `${Newvalue ? ', ' : ''} Contact Start Date: ${$scope.PostOpCallObj.ContactStartDate}`;
                if ($scope.LogObj.ContactStartDate)
                    Oldvalue += `${Oldvalue ? ', ' : ''} Contact Start Date: ${$scope.LogObj.ContactStartDate}`;
                count++;
            }
            if ($scope.PostOpCallObj.ContactStartTime != $scope.LogObj.ContactStartTime) {
                if ($scope.PostOpCallObj.ContactStartTime)
                    Newvalue += `${Newvalue ? ', ' : ''} Contact Start Time: ${$scope.PostOpCallObj.ContactStartTime}`;
                if ($scope.LogObj.ContactStartTime)
                    Oldvalue += `${Oldvalue ? ', ' : ''} Contact Start Time: ${$scope.LogObj.ContactStartTime}`;
                count++;
            }
           

            if (count != 0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall Contact Details",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": ActionType,
                    "OldActionDescription": Oldvalue,
                    "NewActionDescription": Newvalue,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }

        $scope.PostOpCallObj.CallAttempt = $scope.PostOpCallObj.CallAttempt || '';
        $scope.LogObj.CallAttempt = $scope.LogObj.CallAttempt || '';
        if ($scope.PostOpCallObj.CallAttempt || $scope.LogObj.CallAttempt) {
            let ActionType = '';
            let count = 0;
            if ($scope.LogObj.CallAttempt == '') {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }

            if ($scope.PostOpCallObj.CallAttempt != $scope.LogObj.CallAttempt) {
                count++;
            }

            let OldValue = '';
            let NewValue = '';

            if ($scope.LogObj.CallAttempt) {
                OldValue = 'Call Attempt ' + $scope.LogObj.CallAttempt;
            }
            if ($scope.PostOpCallObj.CallAttempt) {
                NewValue = 'Call Attempt ' + $scope.PostOpCallObj.CallAttempt;
            }

            if (count != 0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall Contact Details",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": ActionType,
                    "OldActionDescription": OldValue,
                    "NewActionDescription": NewValue,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }


        $scope.PostOpCallObj.SpokeWith = $scope.PostOpCallObj.SpokeWith || '';
        $scope.LogObj.SpokeWith = $scope.LogObj.SpokeWith || '';
        if ($scope.PostOpCallObj.SpokeWith || $scope.LogObj.SpokeWith) {
            let ActionType = '';
            let count = 0;
            if ($scope.LogObj.SpokeWith == '') {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }

            if ($scope.PostOpCallObj.SpokeWith != $scope.LogObj.SpokeWith) {
                count++;
            }

            let OldValue = '';
            let NewValue = '';

            if ($scope.LogObj.SpokeWith) {
                OldValue = 'Spoke With ' + $scope.LogObj.SpokeWith;
            }
            if ($scope.PostOpCallObj.SpokeWith) {
                NewValue = 'Spoke With ' + $scope.PostOpCallObj.SpokeWith;
            }
           

            if (count != 0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOp Contact Details",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": ActionType,
                    "OldActionDescription": OldValue,
                    "NewActionDescription": NewValue,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }


        $scope.PostOpCallObj.NauseaOrVomiting = $scope.PostOpCallObj.NauseaOrVomiting  || '';
        $scope.LogObj.NauseaOrVomiting  = $scope.LogObj.NauseaOrVomiting  || '';
        $scope.PostOpCallObj.NauseaSeverity = $scope.PostOpCallObj.NauseaSeverity || '';
        $scope.LogObj.NauseaSeverity = $scope.LogObj.NauseaSeverity || '';

        
        var filteredGeneralArray = $filter('filter')(req.PostOpCallActionTakenCheckList, { 'TypeId': 2 }, true) || [];
        var EditfilteredGeneralArray = $filter('filter')($scope.LogObj.PostOpCallActionTakenCheckList, { 'TypeId': 2 }, true) || [];

        if ($scope.LogObj.NauseaOrVomiting || $scope.LogObj.NauseaSeverity || EditfilteredGeneralArray.length > 0) {

            let count = 0;
            let differences = $scope.findDifferences(filteredGeneralArray, EditfilteredGeneralArray) || [];

            var NewAffecteditem = '';
            var OldAffecteditem = '';
            if (differences.length > 0) {

                let Newdata = differences
                    .filter(item => item.DeleteInd === 'N' && item.PostOpCallActionTakenCheckList)
                    .map(item => item.PostOpCallActionTakenCheckList)
                    .join(', ');
               
                let Olddata = differences
                    .filter(item => item.DeleteInd === 'Y' && item.PostOpCallActionTakenCheckList)
                    .map(item => item.PostOpCallActionTakenCheckList)
                    .join(', ');

                if (Newdata) {
                    NewAffecteditem += `${NewAffecteditem ? ', ' : ''}How is the patient feeling overall? : ${Newdata}`;
                }
                if (Olddata) {
                    OldAffecteditem += `${OldAffecteditem ? ', ' : ''}How is the patient feeling overall? : ${Olddata}`;
                }
            }

            if ($scope.PostOpCallObj.NauseaOrVomiting != $scope.LogObj.NauseaOrVomiting) {
                if ($scope.PostOpCallObj.NauseaOrVomiting) 
                    NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Any signs of nausea or vomiting? : ${$scope.PostOpCallObj.NauseaOrVomiting}`;
                if ($scope.LogObj.NauseaOrVomiting)
                    OldAffecteditem += `${OldAffecteditem ? ', ' : ''}Any signs of nausea or vomiting? : ${$scope.LogObj.NauseaOrVomiting}`;
                count++;
            }
            if ($scope.PostOpCallObj.NauseaSeverity != $scope.LogObj.NauseaSeverity) {
                if ($scope.PostOpCallObj.NauseaSeverity)
                    NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Severity : ${$scope.PostOpCallObj.NauseaSeverity}`;
                if ($scope.LogObj.NauseaSeverity)
                    OldAffecteditem += `${OldAffecteditem ? ', ' : ''}Severity : ${$scope.LogObj.NauseaSeverity}`;
                count++;
            }


            if (differences.length > 0 || count != 0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall General Well-being",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": "Edited",
                    "OldActionDescription": OldAffecteditem,
                    "NewActionDescription": NewAffecteditem,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }
        else if ($scope.PostOpCallObj.NauseaOrVomiting || $scope.PostOpCallObj.NauseaSeverity || filteredGeneralArray.length > 0 ) {
            let NewAffecteditem = '';
            if (filteredGeneralArray.length > 0) {
                let GeneralValues = filteredGeneralArray.map(item => item.PostOpCallActionTakenCheckList).join(', ');
                NewAffecteditem += `How is the patient feeling overall?: ${GeneralValues}`;
            }


            if ($scope.PostOpCallObj.NauseaOrVomiting) {
                NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Any signs of nausea or vomiting? : ${$scope.PostOpCallObj.NauseaOrVomiting}`;
            }
            if ($scope.PostOpCallObj.NauseaSeverity) {
                NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Severity : ${$scope.PostOpCallObj.NauseaSeverity}`;
            }
            
            if (NewAffecteditem != '') {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall General Well-being",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": "Added",
                    "OldActionDescription": '',
                    "NewActionDescription": NewAffecteditem,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }

        var filteredbeforeSurgeryArray = $filter('filter')(req.PostOpCallActionTakenCheckList, { 'TypeId': 4 }, true) || [];
        var EditfilteredbeforeSurgeryArray = $filter('filter')($scope.LogObj.PostOpCallActionTakenCheckList, { 'TypeId': 4 }, true) || [];
        var filteredsymptomsArray = $filter('filter')(req.PostOpCallActionTakenCheckList, { 'TypeId': 3 }, true) || [];
        var EditfilteredsymptomsArray = $filter('filter')($scope.LogObj.PostOpCallActionTakenCheckList, { 'TypeId': 3 }, true) || [];
        $scope.PostOpCallObj.EyeDropScheduleUnderstanding = $scope.PostOpCallObj.EyeDropScheduleUnderstanding || '';
        $scope.LogObj.EyeDropScheduleUnderstanding = $scope.LogObj.EyeDropScheduleUnderstanding || '';

        if ($scope.LogObj.EyeDropScheduleUnderstanding || EditfilteredsymptomsArray.length>0 || EditfilteredbeforeSurgeryArray.length > 0) {
           
            let count = 0;
            
            let differences = $scope.findDifferences(filteredbeforeSurgeryArray, EditfilteredbeforeSurgeryArray) || [];
            let SymtomsDifferences = $scope.findDifferences(filteredsymptomsArray, EditfilteredsymptomsArray) || [];

            var NewAffecteditem = '';
            var OldAffecteditem = '';
            if (differences.length > 0) {
                let NewbeforSurgeryValues = differences
                    .filter(item => item.DeleteInd === 'N' && item.PostOpCallActionTakenCheckList)
                    .map(item => item.PostOpCallActionTakenCheckList)
                    .join(', ');

                let OldbeforSurgeryValues = differences
                    .filter(item => item.DeleteInd === 'Y' && item.PostOpCallActionTakenCheckList)
                    .map(item => item.PostOpCallActionTakenCheckList)
                    .join(', ');

                if (NewbeforSurgeryValues) {
                    NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Vision compared to before surgery: ${NewbeforSurgeryValues}`;
                }
                if (OldbeforSurgeryValues) {
                    OldAffecteditem += `${OldAffecteditem ? ', ' : ''}Vision compared to before surgery: ${OldbeforSurgeryValues}`;
                }
            }

            if (SymtomsDifferences.length > 0) {
                let NewSymtomsValues = SymtomsDifferences
                    .filter(item => item.DeleteInd === 'N' && item.PostOpCallActionTakenCheckList)
                    .map(item => item.PostOpCallActionTakenCheckList)
                    .join(', ');

                let OldSymtomsValues = SymtomsDifferences
                    .filter(item => item.DeleteInd === 'Y' && item.PostOpCallActionTakenCheckList)
                    .map(item => item.PostOpCallActionTakenCheckList)
                    .join(', ');

                if (NewSymtomsValues) {
                    NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Any of the following symptoms? : ${NewSymtomsValues}`;
                }
                if (OldSymtomsValues) {
                    OldAffecteditem += `${OldAffecteditem ? ', ' : ''}Any of the following symptoms? : ${OldSymtomsValues}`;
                }
            }
            

            if ($scope.PostOpCallObj.EyeDropScheduleUnderstanding != $scope.LogObj.EyeDropScheduleUnderstanding) {
                if ($scope.PostOpCallObj.EyeDropScheduleUnderstanding)
                    NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Does the patient understand post-op eye drop schedule? : ${$scope.PostOpCallObj.EyeDropScheduleUnderstanding}`;
                if ($scope.LogObj.EyeDropScheduleUnderstanding)
                    OldAffecteditem += `${OldAffecteditem ? ', ' : ''}Does the patient understand post-op eye drop schedule? : ${$scope.LogObj.EyeDropScheduleUnderstanding}`;
                count++;
            }
           

            if (differences.length > 0 || count != 0 || SymtomsDifferences.length>0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall Vision & Eye Symptoms",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": "Edited",
                    "OldActionDescription": OldAffecteditem,
                    "NewActionDescription": NewAffecteditem,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }
        else if ($scope.PostOpCallObj.EyeDropScheduleUnderstanding || filteredsymptomsArray.length > 0 || filteredbeforeSurgeryArray.length > 0) {
            let NewAffecteditem = '';

            if (filteredbeforeSurgeryArray.length > 0) {
                let beforSurgeryValues = filteredbeforeSurgeryArray.map(item => item.PostOpCallActionTakenCheckList).join(', ');
                NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Vision compared to before surgery: ${beforSurgeryValues}`;
            }

            if (filteredsymptomsArray.length > 0) {
                let SymptomValues = filteredsymptomsArray.map(item => item.PostOpCallActionTakenCheckList).join(', ');
                NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Any of the following symptoms?: ${SymptomValues}`;
            }

            if ($scope.PostOpCallObj.EyeDropScheduleUnderstanding) {
                NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Does the patient understand post-op eye drop schedule? : ${$scope.PostOpCallObj.EyeDropScheduleUnderstanding}`;
            }

            if (NewAffecteditem != '') {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall Vision & Eye Symptoms",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": "Added",
                    "OldActionDescription": '',
                    "NewActionDescription": NewAffecteditem,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }


        $scope.PostOpCallObj.AdditionalNotes = $scope.PostOpCallObj.AdditionalNotes || '';
        $scope.LogObj.AdditionalNotes = $scope.LogObj.AdditionalNotes || '';
        if ($scope.PostOpCallObj.AdditionalNotes || $scope.LogObj.AdditionalNotes) {
            let ActionType = $scope.LogObj.AdditionalNotes == '' ? 'Added' : 'Edited';

            if ($scope.PostOpCallObj.AdditionalNotes != $scope.LogObj.AdditionalNotes) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall Additional Notes & Concerns ",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": ActionType,
                    "OldActionDescription": $scope.LogObj.AdditionalNotes,
                    "NewActionDescription": $scope.PostOpCallObj.AdditionalNotes,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }


        var filteredActionTakenArray = $filter('filter')(req.PostOpCallActionTakenCheckList, { 'TypeId': 1 }, true) || [];
        var EditfilteredActionTakenArray = $filter('filter')($scope.LogObj.PostOpCallActionTakenCheckList, { 'TypeId': 1 }, true) || [];
        if (EditfilteredActionTakenArray.length > 0) {
           
            let differences = $scope.findDifferences(filteredActionTakenArray, EditfilteredActionTakenArray) || [];
            if (differences.length > 0) {

                let NewItem = differences
                    .filter(item => item.DeleteInd === 'N' && item.PostOpCallActionTakenCheckList)
                    .map(item => item.PostOpCallActionTakenCheckList)
                    .join(', ');

                let OldItem = differences
                    .filter(item => item.DeleteInd === 'Y' && item.PostOpCallActionTakenCheckList)
                    .map(item => item.PostOpCallActionTakenCheckList)
                    .join(', ');

                if (NewItem) {
                    NewAffecteditem += `${NewAffecteditem ? ', ' : ''} ${NewItem}`;
                }
                if (OldItem) {
                    OldAffecteditem += `${OldAffecteditem ? ', ' : ''} ${OldItem}`;
                }

                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall Action Taken",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": 'Edited',
                    "OldActionDescription": OldAffecteditem,
                    "NewActionDescription": NewAffecteditem,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }
        else if (filteredActionTakenArray.length > 0) {
            let NewAffecteditem = '';

            let NewData = filteredActionTakenArray.map(item => item.PostOpCallActionTakenCheckList).join(', ');
            NewAffecteditem += `${NewAffecteditem ? ', ' : ''} ${NewData}`;

            if (NewAffecteditem != '') {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall Action Taken",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": "Added",
                    "OldActionDescription": '',
                    "NewActionDescription": NewAffecteditem,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }


        var filteredInstructionsArray = $filter('filter')(req.OrgASCChecklist, { 'CheckListId': 182 }, true) || [];
        var EditfilteredInstructionsArray = $filter('filter')($scope.LogObj.OrgASCChecklist, { 'CheckListId': 182}, true) || [];
        $scope.PostOpCallObj.CoPayNotes = $scope.PostOpCallObj.CoPayNotes || '';
        $scope.LogObj.CoPayNotes = $scope.LogObj.CoPayNotes || '';
        if ($scope.LogObj.CoPayNotes || EditfilteredInstructionsArray.length>0) {
            
            let count = 0;
            let NewAffecteditem = '';
            let OldAffecteditem = '';
            let differences = [];
            if (filteredInstructionsArray.length > 0 || EditfilteredInstructionsArray.length > 0) {
                differences = $scope.findOrgCheckListDifferences(filteredInstructionsArray, EditfilteredInstructionsArray) || [];

                if (differences.length>0) {
                    let NewItem = differences
                        .filter(item => item.DeleteInd === 'N' && item.Value)
                        .map(item => item.Value)
                        .join(', ');

                    let OldItem = differences
                        .filter(item => item.DeleteInd === 'Y' && item.Value)
                        .map(item => item.Value)
                        .join(', ');

                    if (NewItem) {
                        NewAffecteditem += `${NewAffecteditem ? ', ' : ''} ${NewItem}`;
                    }
                    if (OldItem) {
                        OldAffecteditem += `${OldAffecteditem ? ', ' : ''} ${OldItem}`;
                    }
                }
            }
           

            if ($scope.PostOpCallObj.CoPayNotes != $scope.LogObj.CoPayNotes) {
                if ($scope.PostOpCallObj.CoPayNotes)
                    NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Notes : ${$scope.PostOpCallObj.CoPayNotes}`;
                if ($scope.LogObj.CoPayNotes)
                    OldAffecteditem += `${OldAffecteditem ? ', ' : ''}Notes : ${$scope.LogObj.CoPayNotes}`;
                count++;
            }
            
            if (differences.length>0 || count != 0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall Instructions Provide to Patient",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": 'Edited',
                    "OldActionDescription": OldAffecteditem,
                    "NewActionDescription": NewAffecteditem,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }
        else if ($scope.PostOpCallObj.CoPayNotes || filteredInstructionsArray.length > 0) {
            let NewAffecteditem = '';

            if (filteredInstructionsArray.length > 0) {
                let NewData = filteredInstructionsArray.map(item => item.Value).join(', ');
                NewAffecteditem += `${NewAffecteditem ? ', ' : ''} ${NewData}`;
            }

            if ($scope.PostOpCallObj.CoPayNotes) {
                NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Notes : ${$scope.PostOpCallObj.CoPayNotes}`;
            }
           

            if (NewAffecteditem != '') {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall Instructions Provide to Patient",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": "Added",
                    "OldActionDescription": '',
                    "NewActionDescription": NewAffecteditem,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }

        var filteredResponseArray = $filter('filter')(req.OrgASCChecklist, { 'CheckListId': 181 }, true) || [];
        var EditfilteredResponseArray = $filter('filter')($scope.LogObj.OrgASCChecklist, { 'CheckListId': 181 }, true) || [];
        
        if (EditfilteredResponseArray.length > 0) {
           let differences = $scope.findOrgCheckListDifferences(filteredResponseArray, EditfilteredResponseArray) || [];
            let NewAffecteditem = '';
            let OldAffecteditem = '';
            if (differences.length > 0) {
                let NewItem = differences
                    .filter(item => item.DeleteInd === 'N' && item.Value)
                    .map(item => item.Value)
                    .join(', ');

                let OldItem = differences
                    .filter(item => item.DeleteInd === 'Y' && item.Value)
                    .map(item => item.Value)
                    .join(', ');

                if (NewItem) {
                    NewAffecteditem += `${NewAffecteditem ? ', ' : ''} ${NewItem}`;
                }
                if (OldItem) {
                    OldAffecteditem += `${OldAffecteditem ? ', ' : ''} ${OldItem}`;
                }

                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall Response",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": 'Edited',
                    "OldActionDescription": OldAffecteditem,
                    "NewActionDescription": NewAffecteditem,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }
        else if (filteredResponseArray.length > 0) {
            let NewAffecteditem = '';

            let NewData = filteredResponseArray.map(item => item.Value).join(', ');
            NewAffecteditem += `${NewAffecteditem ? ', ' : ''} ${NewData}`;

            if (NewAffecteditem != '') {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall Response",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": "Added",
                    "OldActionDescription": '',
                    "NewActionDescription": NewAffecteditem,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }

        var filteredPatientOutcomeArray = $filter('filter')(req.OrgASCChecklist, { 'CheckListId': 183 }, true) || [];
        var EditfilteredPatientOutcomeArray = $filter('filter')($scope.LogObj.OrgASCChecklist, { 'CheckListId': 183 }, true) || [];
        $scope.PostOpCallObj.Patientoutcomenotes = $scope.PostOpCallObj.Patientoutcomenotes || '';
        $scope.LogObj.Patientoutcomenotes = $scope.LogObj.Patientoutcomenotes || '';

        if (EditfilteredPatientOutcomeArray.length > 0 || $scope.LogObj.Patientoutcomenotes) {
           
            let count = 0;
            let differences = [];
            let NewAffecteditem = '';
            let OldAffecteditem = '';
            if (filteredPatientOutcomeArray.length > 0 || EditfilteredPatientOutcomeArray.length > 0) {
                differences = $scope.findOrgCheckListDifferences(filteredPatientOutcomeArray, EditfilteredPatientOutcomeArray) || [];

                if (differences.length > 0) {
                    let NewItem = differences
                        .filter(item => item.DeleteInd === 'N' && item.Value)
                        .map(item => item.Value)
                        .join(', ');

                    let OldItem = differences
                        .filter(item => item.DeleteInd === 'Y' && item.Value)
                        .map(item => item.Value)
                        .join(', ');

                    if (NewItem) {
                        NewAffecteditem += `${NewAffecteditem ? ', ' : ''} ${NewItem}`;
                    }
                    if (OldItem) {
                        OldAffecteditem += `${OldAffecteditem ? ', ' : ''} ${OldItem}`;
                    }
                }
            }
            

            if ($scope.PostOpCallObj.Patientoutcomenotes != $scope.LogObj.Patientoutcomenotes) {
                if ($scope.PostOpCallObj.Patientoutcomenotes)
                    NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Notes : ${$scope.PostOpCallObj.Patientoutcomenotes}`;
                if ($scope.LogObj.Patientoutcomenotes)
                    OldAffecteditem += `${OldAffecteditem ? ', ' : ''}Notes : ${$scope.LogObj.Patientoutcomenotes}`;
                count++;
            }


            if (differences.length > 0 || count != 0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall Patient Outcome",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": 'Edited',
                    "OldActionDescription": OldAffecteditem,
                    "NewActionDescription": NewAffecteditem,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }
        else if (filteredPatientOutcomeArray.length > 0 || $scope.PostOpCallObj.Patientoutcomenotes ) {
            let NewAffecteditem = '';

            if (filteredPatientOutcomeArray.length > 0) {
                let NewData = filteredPatientOutcomeArray.map(item => item.Value).join(', ');
                NewAffecteditem += `${NewAffecteditem ? ', ' : ''} ${NewData}`;
            }

            if ($scope.PostOpCallObj.Patientoutcomenotes) {
                NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Notes : ${$scope.PostOpCallObj.Patientoutcomenotes}`;
            }


            if (NewAffecteditem != '') {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PostOpCall Patient Outcome",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": "Added",
                    "OldActionDescription": '',
                    "NewActionDescription": NewAffecteditem,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }

        if ($scope.LogObj.LogArray.length > 0) {
            req.Logs = $scope.LogObj || {};
        }
        $scope.PostOpCallObj.IsClickSavePostOpCallBtn = true;
        eHnotePatientDataService.AddUpdatePatientPostOpCall(req).then(function (resp) {
            if (resp.data.Status == "Success") {
                $scope.PostOpCallObj.IsClickSavePostOpCallBtn = false;
                $uibModalInstance.close();
            }

        }, function (err) {
            $scope.PostOpCallObj.IsClickSavePostOpCallBtn = false;

        });
    };
    $scope.PostOpcallDetails = [];
    $scope.GetPostOpCall = function () {
        let params = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "AppointmentId": $scope.PostOpCallObj.AppointmentId,
        };
        eHnoteSurgeryService.GetPostOpCallDetails(params).then(function (resp) {
            if (resp.data.Status == "Success") {
                if (resp.data.rows.length > 0) {
                    $scope.PostOpcallDetails = resp.data.rows || [];
                    //angular.forEach(resp.data.rows, function (item) {
                    //    angular.forEach(item.OrgASCChecklist, function (mitem) {
                    //        angular.forEach($scope.OrgPostOpChecklist, function (hitem) {
                    //            if (hitem.CheckListCategoryId === mitem.CheckListCategoryId && mitem.CheckListId === hitem.CheckListId) {
                    //                hitem.IsChecked = true;
                    //            }
                    //        });
                    //    });
                    //});
                }
                //resp.data.rows = resp.data.rows || [];
                //if (resp.data.rows.length > 0) {
                //    angular.forEach(resp.data.rows, function (item) {
                //        angular.forEach(item.OrgASCChecklist, function (mitem) {
                //            angular.forEach($scope.OrgPostOpChecklist, function (hitem) {
                //                if (hitem.CheckListCategoryId === mitem.CheckListCategoryId && mitem.CheckListId === hitem.CheckListId) {
                //                    angular.forEach(hitem.OrganizationCheckListDetails, function (kitem) {
                //                        if (kitem.Value == mitem.Value && kitem.CheckListId === mitem.CheckListId) {
                //                            kitem.IsChecked = true;
                //                            hitem.IsChecked = true;
                //                            hitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || 0;
                //                            hitem.Value = mitem.Value || '';
                //                        } else {
                //                            kitem.IsChecked = false;
                //                        }
                //                    });
                //                }
                //            });
                //        });
                //    });
                //}
                ////$scope.PostOpObj.LastSignOffUserDetails = resp.data.LastSignOffUserDetails || [];
            }
        }, function (err) {
            alertify.error("Fetching Data failed!");
            console.log(err);
        });
    }
    $scope.GetPostOpCall();


    $scope.inti = function () {
        $scope.opcallobj = {
            "IsaddNew": false
        };
        $scope.PreOpCallDetailsList = [];
        $scope.PostOpCallDetailsList = [];
        $scope.PreOpCallObj = GetPreOpCallObj();
        var Obj = {
            "PatientId": $scope.ParentObject.PatientID || 0,
            "AppointmentId": $scope.ParentObject.AscAppointmentId || 0,
        }
        eHnotePatientDataService.GetPatientPreOpCallDetailsList(Obj).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.PreOpCallDetailsList = [];
                $scope.PostOpCallDetailsList = [];
                $scope.PreOpCallDetailsList = resp.data.rows || [];
                $scope.PostOpCallDetailsList = resp.data.PostOPCallLog || [];

                if ($scope.PreOpCallDetailsList.length > 0) {
                    $scope.PreOpCallObj.IssummaryShow = true;
                    $scope.PreOpCallObj.IsPreOpEditModeInd = true;
                    $scope.PreopsummaryView($scope.PreOpCallDetailsList[0]);
                } else {
                    $scope.PreOpCallObj.IsPreOpEditModeInd = false;
                    $scope.PreOpCallObj.IsPreOpnSaveNameEditModeInd = false;
                }
                if ($scope.PostOpCallDetailsList.length > 0) {
                    $scope.PostOpCallObj.IssummaryShow = true;
                    $scope.PostOpCallObj.IsPostOpEditModeInd = true;
                    $scope.Postopsummarymethod($scope.PostOpCallDetailsList[0]);
                }
                else {
                    $scope.PostOpCallObj.IsPostOpEditModeInd = false;
                    $scope.PostOpCallObj.IssummaryShow = false;
                }
                $scope.opcallobj = {
                    "IsaddNew": false
                };
                if ($scope.PreOpCallDetailsList.length > 0) {
                    $scope.opcallobj.IsaddNew = true;
                }

                //if ($scope.PreOpCallDetailsList.length > 0) {
                //    $scope.PreOpCallObj.PreopCallNurseReviewedById = $scope.PreOpCallDetailsList[0].PreopCallNurseReviewedById || null;
                //    $scope.PreOpCallObj.PreopCallNurseReviewedByTime = $scope.PreOpCallDetailsList[0].PreopCallNurseReviewedByTime || '';
                //    $scope.PreOpCallObj.PreopCallNurseReviewedByNotes = $scope.PreOpCallDetailsList[0].PreopCallNurseReviewedByNotes || '';

                //    if ($scope.PreOpCallObj.PreopCallNurseReviewedById !== null) {
                //        var TempArray = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreOpCallObj.PreopCallNurseReviewedById }) || [];
                //        if (TempArray.length > 0) {
                //            $scope.PreOpCallObj.PreopCallNurseReviewedByName = TempArray[0].FullName;
                //        }
                //    }

                //    if ($scope.PreOpCallObj.PreopCallNurseReviewedByNotes !== null) {
                //        $scope.PreOpCallObj.PreopCallNurseReviewedByNotesInd = true;
                //    }

                //} else {
                //    $scope.PreOpCallObj.PreopCallNurseReviewedById = null;
                //    $scope.PreOpCallObj.PreopCallNurseReviewedByTime = '';
                //    $scope.PreOpCallObj.PreopCallNurseReviewedByNotes = '';
                //    $scope.PreOpCallObj.PreopCallNurseReviewedByName = '';
                //}

            }

        }, function (err) {

        });
    }
    $scope.inti();

  
    $scope.PreOpCallObj.IsPreopCallScreen = true;
    $scope.PreOpCallObj.IsPreopSubCallScreen = true;
    $scope.PreOpCallObj.IsPreopSubCallScreensummary = true;
    $scope.PostOpCallObj.IsPostopCallScreen = false;
    $scope.PostOpCallObj.IsPostopSubCallScreen = false;
    $scope.ChangeTab = function (Tab) {
        if (Tab == 1) {
            $scope.PreOpCallObj.IsPreopCallScreen = true;
            $scope.PostOpCallObj.IsPostopCallScreen = false;
        } else {
            $scope.PostOpCallObj.IsPostopCallScreen = true;
           $scope.PostOpCallObj.IsPostopSubCallScreen = true;
            $scope.PreOpCallObj.IsPreopCallScreen = false;
            $scope.PreOpCallObj.IsPreopSubRosScreen = false;
            $scope.PreOpCallObj.IsRosSummaryView = false;
           // $scope.GetPostOpCall();
        }
    };

    $scope.newclicktime = function (item, type) {
        $scope.currentTime = $filter("date")(new Date(), "h:mm a");
        if (type == 'StartTime') {
            $scope.PreOpCallObj.ContactStartTime = $scope.currentTime;
        }
        if (type == 'DropsTime') {
            $scope.PreOpCallObj.DropsStartTime = $scope.currentTime;
        }

    };
    $scope.newpostopclicktime = function (item, type) {
        $scope.currentTime = $filter("date")(new Date(), "h:mm a");
        if (type == 'StartTime') {
            $scope.PostOpCallObj.ContactStartTime = $scope.currentTime;
        }
    }

    $scope.findPreOpCheckListDifferences = function (savedArray, editedArray) {
        var differences = [];
        angular.forEach(savedArray, function (item) {
            var edited = editedArray.filter(function (eitem) {
                return ((item.PreopPostopCallChecklistId == eitem.PreopPostopCallChecklistId) && (item.PreopPostopCallChecklist == eitem.PreopPostopCallChecklist) && (item.DeleteInd == eitem.DeleteInd));
            }) || [];

            if (edited.length == 0) {
                differences.push({
                    PreopPostopCallChecklistId: item.PreopPostopCallChecklistId,
                    PreopPostopCallChecklist: item.PreopPostopCallChecklist,
                    DeleteInd: item.DeleteInd
                });

            }

        });
        return differences;
    };

    $scope.findPreOpBillingInstructionDifferences = function (oldArray, newArray) {
        var differences = [];

        function normalize(val) {
            return (val === undefined || val === '' ? null : val);
        }

        // Index newArray by Id for quick lookup
        var newMap = {};
        newArray.forEach(e => newMap[e.PreopPostopCallChecklistId] = e);

        // Compare old → new
        oldArray.forEach(oldItem => {
            let newItem = newMap[oldItem.PreopPostopCallChecklistId];
            let oldAmt = normalize(oldItem.BillingAmout);
            let oldStr = `${oldItem.PreopPostopCallChecklist}${oldAmt ? ` ($${oldAmt})` : ''}`;

            if (!newItem) {
                // Removed completely
                differences.push({
                    OldValue: oldStr,
                    NewValue: ''
                });
            } else {
                let newAmt = normalize(newItem.BillingAmout);
                let newStr = `${newItem.PreopPostopCallChecklist}${newAmt ? ` ($${newAmt})` : ''}`;

                if (oldItem.DeleteInd === 'N' && newItem.DeleteInd === 'Y') {
                    // Unchecked
                    differences.push({
                        OldValue: oldStr,
                        NewValue: ''
                    });
                } else if (oldAmt != newAmt) {
                    // Billing amount changed
                    differences.push({
                        OldValue: oldStr,
                        NewValue: newStr
                    });
                }
            }
        });

        // Detect new additions (present in newArray but not in oldArray)
        newArray.forEach(newItem => {
            let oldItem = oldArray.find(o => o.PreopPostopCallChecklistId === newItem.PreopPostopCallChecklistId);
            let newAmt = normalize(newItem.BillingAmout);
            let newStr = `${newItem.PreopPostopCallChecklist}${newAmt ? ` ($${newAmt})` : ''}`;

            if (!oldItem && newItem.DeleteInd === 'N') {
                differences.push({
                    OldValue: '',
                    NewValue: newStr
                });
            }
        });
        return differences;
    };
    $scope.PreOpCallObj.IsClickSavePreOpCallBtn  = false;
    $scope.SavePreOpCall = function (val) {
        $rootScope.$broadcast('SaveROSFromPreOpCall');
        $scope.PreOpCallObj.PatientAscPreOpCallDetailId = $scope.PreOpCallObj.PatientAscPreOpCallDetailId || 0;
        if ($scope.PreOpCallObj.GeneralInstructionsCallChecklist.length > 0) {
            angular.forEach($scope.PreOpCallObj.GeneralInstructionsCallChecklist, function (item) {
                if (item.AppointmentPreOpPostOpCallDetailId != 0 && item.Ischecked == false) {
                    item.DeleteInd = 'Y';
                }
            });
        }
        let filterdGeneralInstructionsCallChecklist= $filter('filter')($scope.PreOpCallObj.GeneralInstructionsCallChecklist, function (item) {
            return item.Ischecked == true || item.AppointmentPreOpPostOpCallDetailId != 0;
        });
        if ($scope.PreOpCallObj.BillingInstructionsCallChecklist.length > 0) {
            angular.forEach($scope.PreOpCallObj.BillingInstructionsCallChecklist, function (item) {
                if (item.AppointmentPreOpPostOpCallDetailId != 0 && item.Ischecked == false) {
                    item.DeleteInd = 'Y';
                }
            });
        }
        let filterdBillingInstructionsCallChecklist = $filter('filter')($scope.PreOpCallObj.BillingInstructionsCallChecklist, function (item) {
            return item.Ischecked == true || item.AppointmentPreOpPostOpCallDetailId != 0;
        });
        var obj = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "AppointmentId": $scope.PreOpCallObj.AppointmentId,
            "PatientId": $scope.PreOpCallObj.PatientId,
            "HospitalId": $scope.HospitalId,
            "PatientAscPreOpCallDetailId": $scope.PreOpCallObj.PatientAscPreOpCallDetailId,
            "ContactType": $scope.PreOpCallObj.ContactType == '' ? $scope.PreOpCallObj.PreopAddnewMobileNo : $scope.PreOpCallObj.ContactType,
            "IsConnectedWithPatient": $scope.PreOpCallObj.IsConnectedWithPatient,
            "IsConnectedWithFamilyOrFriend": $scope.PreOpCallObj.IsConnectedWithFamilyOrFriend,
            "IsLeftMsgWithFamilyOrFriend": $scope.PreOpCallObj.IsLeftMsgWithFamilyOrFriend,
            "IsLeftMsgWithPatient": $scope.PreOpCallObj.IsLeftMsgWithPatient,
            "IsNoResponse": $scope.PreOpCallObj.IsNoResponse,
            "IsArrivalTimeShared": $scope.PreOpCallObj.IsArrivalTimeShared,
            "IsAccompanyShared": $scope.PreOpCallObj.IsAccompanyShared,
            "IsDrinkPlentyWaterShared": $scope.PreOpCallObj.IsDrinkPlentyWaterShared,
            "IsNpoAfterMidnightShared": $scope.PreOpCallObj.IsNpoAfterMidnightShared,
            "IsTakeBpHeartMedShared": $scope.PreOpCallObj.IsTakeBpHeartMedShared,
            "IsDoNotTakeBpMedShared": $scope.PreOpCallObj.IsDoNotTakeBpMedShared,
            "IsCoPay": $scope.PreOpCallObj.IsCoPay,
            "IsNoMakeupJewelMoistShared": $scope.PreOpCallObj.IsNoMakeupJewelMoistShared,
            "DropStartDate": $scope.PreOpCallObj.DropStartDate,
            "DropsStartTime": $scope.PreOpCallObj.DropsStartTime,
            "ContactStartDate": $scope.PreOpCallObj.ContactStartDate,
            "ContactStartTime": $scope.PreOpCallObj.ContactStartTime,
            "CoPayNotes": $scope.PreOpCallObj.CoPayNotes,
            "Remarks": $scope.PreOpCallObj.Remarks,
            "DeleteInd": $scope.PreOpCallObj.DeleteInd,
            "IsDoingWell": $scope.PreOpCallObj.IsDoingWell,
            "IsMildDiscomfort": $scope.PreOpCallObj.IsMildDiscomfort,
            "IsModerateDiscomfort": $scope.PreOpCallObj.IsModerateDiscomfort,
            "IsExtensiveDiscomfort": $scope.PreOpCallObj.IsExtensiveDiscomfort,
            "PatientoutcomeNotes": $scope.PreOpCallObj.PatientoutcomeNotes,
            "GeneralInstructionsCallChecklist": filterdGeneralInstructionsCallChecklist,
            "BillingInstructionsCallChecklist": filterdBillingInstructionsCallChecklist,
            "BillingInstructionRemarks": $scope.PreOpCallObj.BillingInstructionRemarks || "",
            "PreopCallNurseReviewedById": $scope.PreOpCallObj.PreopCallNurseReviewedById || null,
            "PreopCallNurseReviewedByTime": $scope.PreOpCallObj.PreopCallNurseReviewedByTime || "",
            "PreopCallNurseReviewedByNotes": $scope.PreOpCallObj.PreopCallNurseReviewedByNotes || "",
            "PreopCallNurseReviewedByDate": $scope.PreOpCallObj.PreopCallNurseReviewedByDate || null,
            "PreopCallArrivalTime": $scope.PreOpCallObj.PreopCallArrivalTime || null,
            "Logs": {},
        }


        $scope.PreOpCallObj.ContactType = $scope.PreOpCallObj.ContactType || null;
        $scope.LogObj.PreOpContactType = $scope.LogObj.PreOpContactType || '';
        $scope.PreOpCallObj.PreopAddnewMobileNo = $scope.PreOpCallObj.PreopAddnewMobileNo || '';
        $scope.LogObj.PreOpAddnewMobileNo = $scope.LogObj.PreOpAddnewMobileNo || '';
        $scope.PreOpCallObj.ContactStartDate = $scope.PreOpCallObj.ContactStartDate || null;
        $scope.LogObj.PreOpContactStartDate = $scope.LogObj.PreOpContactStartDate || null;
        $scope.PreOpCallObj.ContactStartTime = $scope.PreOpCallObj.ContactStartTime || '';
        $scope.LogObj.PreOpContactStartTime = $scope.LogObj.PreOpContactStartTime || '';

        if ($scope.PreOpCallObj.ContactType || $scope.LogObj.PreOpContactType || $scope.PreOpCallObj.PreopAddnewMobileNo || $scope.LogObj.PreOpAddnewMobileNo || $scope.PreOpCallObj.ContactStartDate || $scope.LogObj.PreOpContactStartDate || $scope.PreOpCallObj.ContactStartTime || $scope.LogObj.PreOpContactStartTime) {
            let ActionType = '';
            let count = 0;
            if ($scope.LogObj.PreOpContactType == '' && $scope.LogObj.PreOpAddnewMobileNo == '' && $scope.LogObj.PreOpContactStartDate == null && $scope.LogObj.PreOpContactStartTime == '') {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }

            let Newvalue = '';
            let Oldvalue = '';

            if ($scope.PreOpCallObj.ContactType != $scope.LogObj.PreOpContactType) {
                if ($scope.PreOpCallObj.ContactType)
                    Newvalue += `${Newvalue ? ', ' : ''}Mobile No: ${$scope.PreOpCallObj.ContactType}`;
                if ($scope.LogObj.PreOpContactType)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Mobile No: ${$scope.LogObj.PreOpContactType}`;
                count++;
            }
            if ($scope.PreOpCallObj.PreopAddnewMobileNo != $scope.LogObj.PreOpAddnewMobileNo) {
                if ($scope.PreOpCallObj.PreopAddnewMobileNo)
                    Newvalue += `${Newvalue ? ', ' : ''}Mobile No: ${$scope.PreOpCallObj.PreopAddnewMobileNo}`;
                if ($scope.LogObj.PreOpAddnewMobileNo)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Mobile No: ${$scope.LogObj.PreOpAddnewMobileNo}`;
                count++;
            }
            if ($scope.PreOpCallObj.ContactStartDate != $scope.LogObj.PreOpContactStartDate) {
                if ($scope.PreOpCallObj.ContactStartDate)
                    Newvalue += `${Newvalue ? ', ' : ''}Contact Start Date: ${$scope.PreOpCallObj.ContactStartDate}`;
                if ($scope.LogObj.PreOpContactStartDate)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Contact Start Date: ${$scope.LogObj.PreOpContactStartDate}`;
                count++;
            }
            if ($scope.PreOpCallObj.ContactStartTime != $scope.LogObj.PreOpContactStartTime) {
                if ($scope.PreOpCallObj.ContactStartTime)
                    Newvalue += `${Newvalue ? ', ' : ''}Contact Start Time: ${$scope.PreOpCallObj.ContactStartTime}`;
                if ($scope.LogObj.PreOpContactStartTime)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Contact Start Time: ${$scope.LogObj.PreOpContactStartTime}`;
                count++;
            }

            

            if (count != 0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PreOpCall Contact Details",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": ActionType,
                    "OldActionDescription": Oldvalue,
                    "NewActionDescription": Newvalue,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }



        $scope.PreOpCallObj.IsConnectedWithPatient = $scope.PreOpCallObj.IsConnectedWithPatient || false;
        $scope.LogObj.PreOpIsConnectedWithPatient = $scope.LogObj.PreOpIsConnectedWithPatient || false;

        $scope.PreOpCallObj.IsConnectedWithFamilyOrFriend = $scope.PreOpCallObj.IsConnectedWithFamilyOrFriend || false;
        $scope.LogObj.PreOpIsConnectedWithFamilyOrFriend = $scope.LogObj.PreOpIsConnectedWithFamilyOrFriend || false;

        $scope.PreOpCallObj.IsLeftMsgWithPatient = $scope.PreOpCallObj.IsLeftMsgWithPatient || false;
        $scope.LogObj.PreOpIsLeftMsgWithPatient = $scope.LogObj.PreOpIsLeftMsgWithPatient || false;

        $scope.PreOpCallObj.IsLeftMsgWithFamilyOrFriend = $scope.PreOpCallObj.IsLeftMsgWithFamilyOrFriend || false;
        $scope.LogObj.PreOpIsLeftMsgWithFamilyOrFriend = $scope.LogObj.PreOpIsLeftMsgWithFamilyOrFriend || false;

        $scope.PreOpCallObj.IsNoResponse = $scope.PreOpCallObj.IsNoResponse || false;
        $scope.LogObj.PreOpIsNoResponse = $scope.LogObj.PreOpIsNoResponse || false;

        $scope.PreOpCallObj.PreopCallArrivalTime = $scope.PreOpCallObj.PreopCallArrivalTime || null;
        $scope.LogObj.PreopCallArrivalTime = $scope.LogObj.PreopCallArrivalTime || null;


        if ($scope.PreOpCallObj.IsConnectedWithPatient || $scope.LogObj.PreOpIsConnectedWithPatient || $scope.PreOpCallObj.IsConnectedWithFamilyOrFriend || $scope.LogObj.PreOpIsConnectedWithFamilyOrFriend || $scope.PreOpCallObj.IsLeftMsgWithPatient || $scope.LogObj.PreOpIsLeftMsgWithPatient || $scope.PreOpCallObj.IsLeftMsgWithFamilyOrFriend || $scope.LogObj.PreOpIsLeftMsgWithFamilyOrFriend || $scope.PreOpCallObj.IsNoResponse || $scope.LogObj.PreOpIsNoResponse || $scope.PreOpCallObj.PreopCallArrivalTime || $scope.LogObj.PreopCallArrivalTime) {
            let ActionType = '';
            let count = 0;
            if ($scope.LogObj.PreOpIsConnectedWithPatient == false && $scope.LogObj.PreOpIsConnectedWithFamilyOrFriend == false && $scope.LogObj.PreOpIsLeftMsgWithPatient == false && $scope.LogObj.PreOpIsLeftMsgWithFamilyOrFriend == false && $scope.LogObj.PreOpIsNoResponse == false && $scope.LogObj.PreopCallArrivalTime==null) {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }

            let Newvalue = '';
            let Oldvalue = '';

            if ($scope.PreOpCallObj.IsConnectedWithPatient != $scope.LogObj.PreOpIsConnectedWithPatient) {
                if ($scope.PreOpCallObj.IsConnectedWithPatient)
                    Newvalue += `${Newvalue ? ', ' : ''}Connected with Patient`;
                if ($scope.LogObj.PreOpIsConnectedWithPatient)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Connected with Patient`;
                count++;
            }
            if ($scope.PreOpCallObj.IsConnectedWithFamilyOrFriend != $scope.LogObj.PreOpIsConnectedWithFamilyOrFriend) {
                if ($scope.PreOpCallObj.IsConnectedWithFamilyOrFriend)
                    Newvalue += `${Newvalue ? ', ' : ''}Connected with Family / Friend`;
                if ($scope.LogObj.PreOpIsConnectedWithFamilyOrFriend)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Connected with Family / Friend`;
                count++;
            }
            if ($scope.PreOpCallObj.IsLeftMsgWithPatient != $scope.LogObj.PreOpIsLeftMsgWithPatient) {
                if ($scope.PreOpCallObj.IsLeftMsgWithPatient)
                    Newvalue += `${Newvalue ? ', ' : ''}Left Message with Patient`;
                if ($scope.LogObj.PreOpIsLeftMsgWithPatient)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Left Message with Patient`;
                count++;
            }
            if ($scope.PreOpCallObj.IsLeftMsgWithFamilyOrFriend != $scope.LogObj.PreOpIsLeftMsgWithFamilyOrFriend) {
                if ($scope.PreOpCallObj.IsLeftMsgWithFamilyOrFriend)
                    Newvalue += `${Newvalue ? ', ' : ''}Left Message Family/Friend`;
                if ($scope.LogObj.PreOpIsLeftMsgWithFamilyOrFriend)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Left Message Family/Friend`;
                count++;
            }
            if ($scope.PreOpCallObj.IsNoResponse != $scope.LogObj.PreOpIsNoResponse) {
                if ($scope.PreOpCallObj.IsNoResponse)
                    Newvalue += `${Newvalue ? ', ' : ''}No Response`;
                if ($scope.LogObj.PreOpIsNoResponse)
                    Oldvalue += `${Oldvalue ? ', ' : ''}No Response`;
                count++;
            }

            if ($scope.PreOpCallObj.PreopCallArrivalTime != $scope.LogObj.PreopCallArrivalTime) {
                if ($scope.PreOpCallObj.PreopCallArrivalTime)
                    Newvalue += `${Newvalue ? ', ' : ''}Arrival Time : ${$scope.PreOpCallObj.PreopCallArrivalTime}`;
                if ($scope.LogObj.PreopCallArrivalTime)
                    Oldvalue += `${Oldvalue ? ', ' : ''}Arrival Time : ${$scope.LogObj.PreopCallArrivalTime}`;
                count++;
            }
            

            if (count != 0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PreOpCall Response",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": ActionType,
                    "OldActionDescription": Oldvalue,
                    "NewActionDescription": Newvalue,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }


        $scope.PreOpCallObj.PreopCallNurseReviewedById = $scope.PreOpCallObj.PreopCallNurseReviewedById || null;
        $scope.LogObj.PreopCallNurseReviewedById = $scope.LogObj.PreopCallNurseReviewedById || null;
        $scope.PreOpCallObj.PreopCallNurseReviewedByTime = $scope.PreOpCallObj.PreopCallNurseReviewedByTime || '';
        $scope.LogObj.PreopCallNurseReviewedByTime = $scope.LogObj.PreopCallNurseReviewedByTime || '';
        $scope.PreOpCallObj.PreopCallNurseReviewedByNotes = $scope.PreOpCallObj.PreopCallNurseReviewedByNotes || '';
        $scope.LogObj.PreopCallNurseReviewedByNotes = $scope.LogObj.PreopCallNurseReviewedByNotes || '';

        if ($scope.PreOpCallObj.PreopCallNurseReviewedById || $scope.LogObj.PreopCallNurseReviewedById || $scope.PreOpCallObj.PreopCallNurseReviewedByTime || $scope.LogObj.PreopCallNurseReviewedByTime || $scope.PreOpCallObj.PreopCallNurseReviewedByNotes || $scope.LogObj.PreopCallNurseReviewedByNotes) {
            let ActionType = ''
            let count = 0;
            if ($scope.LogObj.PreopCallNurseReviewedById == null && $scope.LogObj.PreopCallNurseReviewedByTime == '' && $scope.LogObj.PreopCallNurseReviewedByNotes == '') {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }

            let NewgivenByUser = '';
            let OldgivenByUser = '';


            var NewReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.PreOpCallObj.PreopCallNurseReviewedById });
            if (NewReviewedByArraylist.length > 0) {
                NewgivenByUser = angular.copy(NewReviewedByArraylist[0].SecondUserFullName) +
                    (NewReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(NewReviewedByArraylist[0].LicenseNumber) : "");
            }

            var OldReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.LogObj.PreopCallNurseReviewedById });
            if (OldReviewedByArraylist.length > 0) {
                OldgivenByUser = angular.copy(OldReviewedByArraylist[0].SecondUserFullName) +
                    (OldReviewedByArraylist[0].LicenseNumber ? " Lic:" + angular.copy(OldReviewedByArraylist[0].LicenseNumber) : "");
            }

            let OldValue = '';
            let NewValue = '';

            if (OldgivenByUser != '') {
                OldValue = `Pre-Op Reviewed By ${OldgivenByUser}`;
            }
            if (NewgivenByUser != '') {
                NewValue = `Pre-Op Reviewed By ${NewgivenByUser}`;
            }
            

            if ($scope.PreOpCallObj.PreopCallNurseReviewedById != $scope.LogObj.PreopCallNurseReviewedById) {
                count++;
            }
            if ($scope.PreOpCallObj.PreopCallNurseReviewedByTime != $scope.LogObj.PreopCallNurseReviewedByTime) {
                if ($scope.PreOpCallObj.PreopCallNurseReviewedByTime)
                    NewValue += `${NewValue ? ', ' : ''}Reviewed By Time: ${$scope.PreOpCallObj.PreopCallNurseReviewedByTime}`;
                if ($scope.LogObj.PreopCallNurseReviewedByTime)
                    OldValue += `${OldValue ? ', ' : ''}Reviewed By Time: ${$scope.LogObj.PreopCallNurseReviewedByTime}`;
                count++;
            }
            if ($scope.PreOpCallObj.PreopCallNurseReviewedByNotes != $scope.LogObj.PreopCallNurseReviewedByNotes) {
                if ($scope.PreOpCallObj.PreopCallNurseReviewedByNotes)
                    NewValue += `${NewValue ? ', ' : ''}Notes: ${$scope.PreOpCallObj.PreopCallNurseReviewedByNotes}`;
                if ($scope.LogObj.PreopCallNurseReviewedByNotes)
                    OldValue += `${OldValue ? ', ' : ''}Notes: ${$scope.LogObj.PreopCallNurseReviewedByNotes}`;
                count++;
            }

            if (count != 0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PreOpCall Reviewed By",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": ActionType,
                    "OldActionDescription": OldValue,
                    "NewActionDescription": NewValue,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }




        $scope.PreOpCallObj.CoPayNotes = $scope.PreOpCallObj.CoPayNotes || '';
        $scope.LogObj.PreOpCoPayNotes = $scope.LogObj.PreOpCoPayNotes || '';
        var filteredGeneralArray = $filter('filter')(obj.GeneralInstructionsCallChecklist, { 'Typeid': 1 }, true) || [];
        var EditfilteredGeneralArray = $filter('filter')($scope.LogObj.GeneralInstructionsCallChecklist, { 'Typeid': 1 }, true) || [];

        if ($scope.LogObj.PreOpCoPayNotes || EditfilteredGeneralArray.length > 0) {
            let count = 0;
            let differences = [];
            let NewAffecteditem = '';
            let OldAffecteditem = '';
            if (filteredGeneralArray.length > 0 || EditfilteredGeneralArray.length > 0) {
                differences = $scope.findPreOpCheckListDifferences(filteredGeneralArray, EditfilteredGeneralArray) || [];

                if (differences.length > 0) {
                    let NewItem = differences
                        .filter(item => item.DeleteInd === 'N' && item.PreopPostopCallChecklist)
                        .map(item => item.PreopPostopCallChecklist)
                        .join(', ');

                    let OldItem = differences
                        .filter(item => item.DeleteInd === 'Y' && item.PreopPostopCallChecklist)
                        .map(item => item.PreopPostopCallChecklist)
                        .join(', ');

                    if (NewItem) {
                        NewAffecteditem += `${NewAffecteditem ? ', ' : ''} ${NewItem}`;
                    }
                    if (OldItem) {
                        OldAffecteditem += `${OldAffecteditem ? ', ' : ''} ${OldItem}`;
                    }
                }
            }


            if ($scope.PreOpCallObj.CoPayNotes != $scope.LogObj.PreOpCoPayNotes) {
                if ($scope.PreOpCallObj.CoPayNotes) {
                    NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Notes : ${$scope.PreOpCallObj.CoPayNotes}`;
                }
                if ($scope.LogObj.PreOpCoPayNotes) {
                    OldAffecteditem += `${OldAffecteditem ? ', ' : ''}Notes : ${$scope.LogObj.PreOpCoPayNotes}`;
                }
                count++;
            }
            

            if (differences.length > 0 || count != 0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PreOpCall General Instructions",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": 'Edited',
                    "OldActionDescription": OldAffecteditem,
                    "NewActionDescription": NewAffecteditem,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }
        else if ($scope.PreOpCallObj.CoPayNotes || filteredGeneralArray.length > 0) {
            let NewAffecteditem = '';

            if (filteredGeneralArray.length > 0) {
                let NewData = filteredGeneralArray.map(item => item.PreopPostopCallChecklist).join(', ');
                NewAffecteditem += `${NewAffecteditem ? ', ' : ''} ${NewData}`;
            }

            if ($scope.PreOpCallObj.CoPayNotes) {
                NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Notes : ${$scope.PreOpCallObj.CoPayNotes}`;
            }


            if (NewAffecteditem != '') {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PreOpcall General Instructions",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": "Added",
                    "OldActionDescription": '',
                    "NewActionDescription": NewAffecteditem,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }

        $scope.PreOpCallObj.DropStartDate = $scope.PreOpCallObj.DropStartDate || '';
        $scope.LogObj.PreOpDropStartDate = $scope.LogObj.PreOpDropStartDate || '';
        $scope.PreOpCallObj.DropsStartTime = $scope.PreOpCallObj.DropsStartTime || '';
        $scope.LogObj.PreOpDropsStartTime = $scope.LogObj.PreOpDropsStartTime || '';
        $scope.PreOpCallObj.Remarks = $scope.PreOpCallObj.Remarks || "";
        $scope.LogObj.PreOpRemarks = $scope.LogObj.PreOpRemarks || "";
       

        if ($scope.PreOpCallObj.DropStartDate || $scope.LogObj.PreOpDropStartDate || $scope.PreOpCallObj.DropsStartTime || $scope.LogObj.PreOpDropsStartTime || $scope.PreOpCallObj.Remarks || $scope.LogObj.PreOpRemarks) {
            let ActionType = '';
            let count = 0;
            if ($scope.LogObj.PreOpDropStartDate == '' && $scope.LogObj.PreOpDropsStartTime == '' && $scope.LogObj.PreOpRemarks == '') {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }
            let NewValue = '';
            let OldValue = '';

            if ($scope.PreOpCallObj.DropStartDate != $scope.LogObj.PreOpDropStartDate) {
                if ($scope.PreOpCallObj.DropStartDate)
                    NewValue += `${NewValue ? ', ' : ''}Drop Start Date: ${$scope.PreOpCallObj.DropStartDate}`;
                if ($scope.LogObj.PreOpDropStartDate)
                    OldValue += `${OldValue ? ', ' : ''}Drop Start Date: ${$scope.LogObj.PreOpDropStartDate}`;
                count++;
            }
            if ($scope.PreOpCallObj.DropsStartTime != $scope.LogObj.PreOpDropsStartTime) {
                if ($scope.PreOpCallObj.DropsStartTime)
                    NewValue += `${NewValue ? ', ' : ''}Drop Start Time: ${$scope.PreOpCallObj.DropsStartTime}`;
                if ($scope.LogObj.PreOpDropsStartTime)
                    OldValue += `${OldValue ? ', ' : ''}Drop Start Time: ${$scope.LogObj.PreOpDropsStartTime}`;
                count++;
            }
            if ($scope.PreOpCallObj.Remarks != $scope.LogObj.PreOpRemarks) {
                if ($scope.PreOpCallObj.Remarks)
                    NewValue += `${NewValue ? ', ' : ''}Notes: ${$scope.PreOpCallObj.Remarks}`;
                if ($scope.LogObj.PreOpRemarks)
                    OldValue += `${OldValue ? ', ' : ''}Notes: ${$scope.LogObj.PreOpRemarks}`;
                count++;
            }
            


            if (count != 0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PreOpCall Start Drops",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": ActionType,
                    "OldActionDescription": OldValue,
                    "NewActionDescription": NewValue,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }




        var filteredBillingInstructionsArray = $filter('filter')(obj.BillingInstructionsCallChecklist, { 'Typeid': 2 }, true) || [];
        var EditfilteredBillingInstructionsArray = $filter('filter')($scope.LogObj.BillingInstructionsCallChecklist, { 'Typeid': 2 }, true) || [];
        $scope.PreOpCallObj.BillingInstructionRemarks = $scope.PreOpCallObj.BillingInstructionRemarks || '';
        $scope.LogObj.PreOpBillingInstructionRemarks = $scope.LogObj.PreOpBillingInstructionRemarks || '';
       

        if (EditfilteredBillingInstructionsArray.length > 0 || $scope.LogObj.PreOpBillingInstructionRemarks) {
            
            let count = 0;
            let OldAffecteditem = '';
            let NewAffecteditem = '';



            let differences = [];
            if (filteredBillingInstructionsArray.length > 0 || EditfilteredBillingInstructionsArray.length > 0) {
                differences = $scope.findPreOpBillingInstructionDifferences(EditfilteredBillingInstructionsArray, filteredBillingInstructionsArray) || [];

                if (differences.length > 0) {
                    differences.forEach(diff => {
                        if (diff.OldValue) {
                            OldAffecteditem += (OldAffecteditem ? ', ' : '') + diff.OldValue;
                        }
                        if (diff.NewValue) {
                            NewAffecteditem += (NewAffecteditem ? ', ' : '') + diff.NewValue;
                        }
                    });
                }
            }

            if ($scope.PreOpCallObj.BillingInstructionRemarks != $scope.LogObj.PreOpBillingInstructionRemarks) {
                if ($scope.PreOpCallObj.BillingInstructionRemarks) {
                    NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Notes : ${$scope.PreOpCallObj.BillingInstructionRemarks}`;
                }
                if ($scope.LogObj.PreOpBillingInstructionRemarks) {
                    OldAffecteditem += `${OldAffecteditem ? ', ' : ''}Notes : ${$scope.LogObj.PreOpBillingInstructionRemarks}`;
                }
                count++;
            }

           

            if (differences.length > 0 || count != 0) {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PreOpCall Billing Instructions",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": 'Edited',
                    "OldActionDescription": OldAffecteditem,
                    "NewActionDescription": NewAffecteditem,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }
        else if (filteredBillingInstructionsArray.length > 0 || $scope.PreOpCallObj.BillingInstructionRemarks) {
            let NewAffecteditem = '';

            if (filteredBillingInstructionsArray.length > 0) {
                let NewData = filteredBillingInstructionsArray
                    .filter(item => item.PreopPostopCallChecklist)
                    .map(item => `${item.PreopPostopCallChecklist}${item.BillingAmout ? ` ($${item.BillingAmout})` : ''}`)
                    .join(', ');

                NewAffecteditem += `${NewAffecteditem ? ', ' : ''}${NewData}`;
            }

           

            if ($scope.PreOpCallObj.BillingInstructionRemarks) {
                NewAffecteditem += `${NewAffecteditem ? ', ' : ''}Notes : ${$scope.PreOpCallObj.BillingInstructionRemarks}`;
            }


            if (NewAffecteditem != '') {
                let obj = {
                    "LogId": 0,
                    "SubModuleId": 38,
                    "SubModuleName": "Pre/post op call",
                    "ScreenType": "PreOpcall Billing Instructions",
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "ActionType": "Added",
                    "OldActionDescription": '',
                    "NewActionDescription": NewAffecteditem,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }


        if ($scope.LogObj.LogArray.length > 0) {
            obj.Logs = $scope.LogObj || {};
        }
        $scope.PreOpCallObj.IsClickSavePreOpCallBtn = true;
        eHnotePatientDataService.AddUpdatePatientPreOpCallDetails(obj).then(function (resp) {
            if (resp.data.Status == "Success") {
                $scope.PreOpCallObj.IsPreOpEditModeInd = true;
                $scope.PreOpCallObj.IsPreOpEditModeInd = false;
                $scope.PreOpCallObj.IsClickSavePreOpCallBtn = false;
                if (val == 1) {
                    $scope.ChangeSubTab(2);
                } else {
                    $scope.PreOpCallObj.IsClickSavePreOpCallBtn = false;
                    $uibModalInstance.close();
                }

            }

        }, function (err) {
            $scope.PreOpCallObj.IsClickSavePreOpCallBtn = false;
        });
    }
    function getMailStr(pval, dval, oval) {
        var strmail = "";
        if (pval)
            strmail = pval;
        if (dval)
            strmail += strmail ? ',' + dval : dval;
        if (oval)
            strmail += strmail ? ',' + oval : oval;
        return strmail;
    }
    $scope.eObj = {
        "PatientEmail": "",
        "DoctorEmail": "",
        "OtherEmail" : "",
    };

    $scope.Emailpreopcall = function () {
        $scope.PopUpOnPlan = $uibModal.open({
            "templateUrl": "preopcall.html",
            "scope": $scope,
            "keyboard": false,
            "backdrop": "static",
            "windowClass": "custom-small-modal",
            size: 'sm'
        });
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        appointmentinfo.EmailID = appointmentinfo.PatientDetails.EmailId ? appointmentinfo.PatientDetails.EmailId : "";
        if (appointmentinfo.EmailID) {
            $scope.eObj.PatientEmail = appointmentinfo.EmailID;
        }
    }
    $scope.preopcallEmailClose = function () {
        $scope.PopUpOnPlan.dismiss('cancel');
    }
    $scope.SendpreopcallEmail = function () {
        $scope.PreOpCallObj.PatientAscPreOpCallDetailId = $scope.PreOpCallObj.PatientAscPreOpCallDetailId || 0;
        if ($scope.eObj.PatientEmail == '') {
            alertify.error("Please Enter PatientEmail!");
            return false;
        }
        let FilterGeneralInstructionsCallChecklist = $filter('filter')($scope.PreOpCallObj.GeneralInstructionsCallChecklist, { 'Ischecked': true }) || [];
        let FilterBillingInstructionsCallChecklist = $filter('filter')($scope.PreOpCallObj.BillingInstructionsCallChecklist, { 'Ischecked': true }) || [];
        var obj = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "AppointmentId": $scope.PreOpCallObj.AppointmentId,
            "PatientId": $scope.PreOpCallObj.PatientId,
            "HospitalId": $scope.HospitalId,
            "PatientAscPreOpCallDetailId": $scope.PreOpCallObj.PatientAscPreOpCallDetailId,
            "ContactType": $scope.PreOpCallObj.ContactType == null ? $scope.PreOpCallObj.PreopAddnewMobileNo : $scope.PreOpCallObj.ContactType,
            "IsConnectedWithPatient": $scope.PreOpCallObj.IsConnectedWithPatient,
            "IsConnectedWithFamilyOrFriend": $scope.PreOpCallObj.IsConnectedWithFamilyOrFriend,
            "IsLeftMsgWithFamilyOrFriend": $scope.PreOpCallObj.IsLeftMsgWithFamilyOrFriend,
            "IsLeftMsgWithPatient": $scope.PreOpCallObj.IsLeftMsgWithPatient,
            "IsNoResponse": $scope.PreOpCallObj.IsNoResponse,
            "IsArrivalTimeShared": $scope.PreOpCallObj.IsArrivalTimeShared,
            "IsAccompanyShared": $scope.PreOpCallObj.IsAccompanyShared,
            "IsDrinkPlentyWaterShared": $scope.PreOpCallObj.IsDrinkPlentyWaterShared,
            "IsNpoAfterMidnightShared": $scope.PreOpCallObj.IsNpoAfterMidnightShared,
            "IsTakeBpHeartMedShared": $scope.PreOpCallObj.IsTakeBpHeartMedShared,
            "IsDoNotTakeBpMedShared": $scope.PreOpCallObj.IsDoNotTakeBpMedShared,
            "IsCoPay": $scope.PreOpCallObj.IsCoPay,
            "IsNoMakeupJewelMoistShared": $scope.PreOpCallObj.IsNoMakeupJewelMoistShared,
            "DropStartDate": $scope.PreOpCallObj.DropStartDate,
            "DropsStartTime": $scope.PreOpCallObj.DropsStartTime,
            "ContactStartDate": $scope.PreOpCallObj.ContactStartDate,
            "ContactStartTime": $scope.PreOpCallObj.ContactStartTime,
            "CoPayNotes": $scope.PreOpCallObj.CoPayNotes,
            "Remarks": $scope.PreOpCallObj.Remarks,
            "DeleteInd": $scope.PreOpCallObj.DeleteInd,
            "IsDoingWell": $scope.PreOpCallObj.IsDoingWell,
            "IsMildDiscomfort": $scope.PreOpCallObj.IsMildDiscomfort,
            "IsModerateDiscomfort": $scope.PreOpCallObj.IsModerateDiscomfort,
            "IsExtensiveDiscomfort": $scope.PreOpCallObj.IsExtensiveDiscomfort,
            "PatientoutcomeNotes": $scope.PreOpCallObj.PatientoutcomeNotes,
            "GeneralInstructionsCallChecklist": FilterGeneralInstructionsCallChecklist||[],
            "BillingInstructionsCallChecklist": FilterBillingInstructionsCallChecklist||[]
        }
        var printobj = datapersistanceFactory.getItem("printSettingData");
        printobj.PrintHeaderImgUrl = printobj.PrintHeaderImgUrl || "";
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        obj.emailAddresses = getMailStr($scope.eObj.PatientEmail, $scope.eObj.DoctorEmail, $scope.eObj.OtherEmail);
        obj.SurgeryDate = appointmentinfo.SurgeryList.length > 0 ? appointmentinfo.SurgeryList[0].SurgeryDate:"";
        obj.DoctorName = appointmentinfo.DoctorFullName;
        obj.PhoneNumber = appointmentinfo.PatientDetails.MobileNo ? appointmentinfo.PatientDetails.MobileNo : "";
        obj.PatientName = appointmentinfo.PatientDetails.FullName ? appointmentinfo.PatientDetails.FullName : "";
        obj.PatientGender = appointmentinfo.PatientDetails.Gender || '',
        obj.PatientDOB = appointmentinfo.PatientDetails.DOB || '',
            obj.HeaderLogo = $scope.OrganizationDetails?.[0]?.OrganizationLogoUrl || '',
        appointmentinfo.PatientDetails.AgeInYears = appointmentinfo.PatientDetails.AgeInYears || "";
        if (appointmentinfo.PatientDetails.AgeInYears !== "") {
            obj.PatientAge = appointmentinfo.PatientDetails.AgeInYears + "Y" + " " + appointmentinfo.PatientDetails.AgeInMonths + "M";
        } else {
            obj.PatientAge = appointmentinfo.PatientDetails.AgeInMonths + "M";
        }
        obj.PatientDisplayId = appointmentinfo.PatientDetails.PatientDisplayId ? appointmentinfo.PatientDetails.PatientDisplayId : "";
        obj.VisitReason = appointmentinfo.VisitReason || '',
            
       
        appointmentinfo.BranchId = appointmentinfo.BranchId || '';
        if (appointmentinfo.BranchId !='') {
            obj.HospitalId = appointmentinfo.BranchId;
        }
        angular.forEach(doctorinfo.doctordata.UserAddress, function (ditem) {
            if (ditem.ClinicId == obj.HospitalId) {
                obj.EmailCommunicationEnabled = ditem.EmailCommunicationEnabled;
                obj.EmailCommunicationProviderId = ditem.EmailCommunicationProviderId;

                obj.BranchName = ditem.ClinicName;
                obj.BranchPhone = ditem.MobileNo + "," + ditem.ContactNo;
                obj.BranchEmail = ditem.BranchEmail;
                obj.BranchAddress = ditem.Address1 + "," + ditem.Address2 + "," + ditem.CityName + "," +
                    ditem.StateName + "," + ditem.CountryName + "," + ditem.PinCode;
            }
        });
        eHnotePatientVisitReasonServices.preopcallEmail(obj).then(function (resp) {
            if (resp.data.Message === "Success") {
                alertify.success("Email sent successfully");
                $scope.PopUpOnPlan.dismiss('cancel');
            }
        })
    }
    $scope.selectedReponceforPatient = function (type) {
        $scope.PreOpCallObj.IsConnectedWithPatient = false;
        $scope.PreOpCallObj.IsConnectedWithFamilyOrFriend = false;
        $scope.PreOpCallObj.IsLeftMsgWithPatient = false;
        $scope.PreOpCallObj.IsLeftMsgWithFamilyOrFriend = false;
        $scope.PreOpCallObj.IsNoResponse = false;
        if (type == 1) {
            $scope.PreOpCallObj.IsConnectedWithPatient = true;
        } else if (type == 2) {
            $scope.PreOpCallObj.IsConnectedWithFamilyOrFriend = true;
        } else if (type == 3) {
            $scope.PreOpCallObj.IsLeftMsgWithPatient = true;
        } else if (type == 4) {
            $scope.PreOpCallObj.IsLeftMsgWithFamilyOrFriend = true;
        } else if (type == 5) {
            $scope.PreOpCallObj.IsNoResponse = true;
            $scope.PreOpCallObj.IsArrivalTimeShared = false;
            $scope.PreOpCallObj.IsAccompanyShared = false;
            $scope.PreOpCallObj.IsDrinkPlentyWaterShared = false;
            $scope.PreOpCallObj.IsCoPay = false;
            $scope.PreOpCallObj.IsNpoAfterMidnightShared = false;
            $scope.PreOpCallObj.IsTakeBpHeartMedShared = false;
            $scope.PreOpCallObj.IsDoNotTakeBpMedShared = false;
            $scope.PreOpCallObj.IsNoMakeupJewelMoistShared = false;
        }
        else {
            console.log("checking");
        }
    }
    $scope.closeuib = function () {
        //$uibModalInstance.dismiss("cancel");
        $uibModalInstance.close();
    };
    $scope.ChangeSubTab = function (type) {
        $scope.PreOpCallObj.IsPreopSubRosScreen = false;
        $scope.PreOpCallObj.IsPreopSubCallScreen = false;
        $scope.PreOpCallObj.IsPreopSubRosScreenNew = false;
        $scope.cacheStorageItem.IscomingPreOpCallScreen = 'PreopCall';
        $scope.AddToCache();
        if (type == 1) {
            $scope.PreOpCallObj.IsPreopSubCallScreen = true;
        }
        if (type == 2) {
            $scope.PreOpCallObj.IsPreopSubRosScreen = true;
            /*$scope.GetOTQuickAccessDetails();*/
        }
        if (type == 3) {
            $scope.PreOpCallObj.IsPreopSubRosScreenNew= true;
        }
    }

    $scope.ChangeSubTabSummary = function (type) {
        // $scope.PreOpCallObj.IsPreopSubRosScreen = false;
        /*if ($scope.PreOpCallObj.IsRosSummaryView) {*/
        $scope.PreOpCallObj.IsPreopSubCallScreensummary = false;
        $scope.PreOpCallObj.IsPreopSubRosScreenNewsummary = false;
        if (type == 1) {
            $scope.PreOpCallObj.IsPreopSubCallScreensummary = true;
            $scope.PreOpCallObj.IsPreopSubRosScreenNewsummary = false;

        }
        if (type == 2) {
            $scope.PreOpCallObj.IsPreopSubRosScreenNewsummary = true;
            $scope.PreOpCallObj.IsPreopSubCallScreensummary = false;
            $scope.PreOpCallObj.IsFromRos = true;
            /*$scope.GetOTQuickAccessDetails();*/
        }
        //} else {
        //    $scope.EditPreopcallItem()
        //    $scope.ChangeSubTab(3);
        //}
    }

    $scope.uibclose = function () {
        $uibModalInstance.dismiss("cancel");
    };
    $scope.EditPreopCallData = function (item) {
        console.log(item);
        if (item != undefined) {
            $scope.PreOpCallObj.IssummaryShow = true;
            $scope.PreOpCallObj.IsPreopSubCallScreensummary = true;
            $scope.PreOpCallObj.IsPreOpEditModeInd = true;
            $scope.PreOpCallObj.PatientAscPreOpCallDetailId = item.PatientAscPreOpCallDetailId;
            $scope.PreOpCallObj.ContactType = item.ContactType;
            $scope.PreOpCallObj.ContactStartDate = item.ContactStartDate;
            $scope.PreOpCallObj.ContactStartTime = item.ContactStartTime;
            $scope.PreOpCallObj.IsConnectedWithPatient = item.IsConnectedWithPatient;
            $scope.PreOpCallObj.IsConnectedWithFamilyOrFriend = item.IsConnectedWithFamilyOrFriend;
            $scope.PreOpCallObj.IsLeftMsgWithPatient = item.IsLeftMsgWithPatient;
            $scope.PreOpCallObj.IsLeftMsgWithFamilyOrFriend = item.IsLeftMsgWithFamilyOrFriend;
            $scope.PreOpCallObj.IsNoResponse = item.IsNoResponse;
            $scope.PreOpCallObj.IsArrivalTimeShared = item.IsArrivalTimeShared;
            $scope.PreOpCallObj.IsAccompanyShared = item.IsAccompanyShared;
            $scope.PreOpCallObj.IsDrinkPlentyWaterShared = item.IsDrinkPlentyWaterShared;
            $scope.PreOpCallObj.IsCoPay = item.IsCoPay;
            $scope.PreOpCallObj.IsNpoAfterMidnightShared = item.IsNpoAfterMidnightShared;
            $scope.PreOpCallObj.IsTakeBpHeartMedShared = item.IsTakeBpHeartMedShared;
            $scope.PreOpCallObj.IsDoNotTakeBpMedShared = item.IsDoNotTakeBpMedShared;
            $scope.PreOpCallObj.IsNoMakeupJewelMoistShared = item.IsNoMakeupJewelMoistShared;
            $scope.PreOpCallObj.CoPayNotes = item.CoPayNotes;
            $scope.PreOpCallObj.PatientoutcomeNotes = item.PatientoutcomeNotes;
            $scope.PreOpCallObj.Remarks = item.Remarks;
            $scope.PreOpCallObj.DropStartDate = item.DropStartDate ;
            $scope.PreOpCallObj.DropsStartTime = item.DropsStartTime ;
            $scope.PreOpCallObj.BillingInstructionRemarks = item.BillingInstructionRemarks;
            $scope.PreOpCallObj.CreatedByUserName = item.CreatedByUserName;

            $scope.PreOpCallObj.PreopCallNurseReviewedById = item.PreopCallNurseReviewedById || null;
            $scope.PreOpCallObj.PreopCallNurseReviewedByTime = item.PreopCallNurseReviewedByTime || '';
            $scope.PreOpCallObj.PreopCallNurseReviewedByNotes = item.PreopCallNurseReviewedByNotes || '';
            $scope.PreOpCallObj.PreopCallNurseReviewedByDate = item.PreopCallNurseReviewedByDate || null;


            $scope.LogObj.PreOpContactType = item.ContactType;
            $scope.LogObj.PreOpContactStartDate = item.ContactStartDate;
            $scope.LogObj.PreOpContactStartTime = item.ContactStartTime;
            $scope.LogObj.PreOpIsConnectedWithPatient = item.IsConnectedWithPatient;
            $scope.LogObj.PreOpIsConnectedWithFamilyOrFriend = item.IsConnectedWithFamilyOrFriend;
            $scope.LogObj.PreOpIsLeftMsgWithPatient = item.IsLeftMsgWithPatient;
            $scope.LogObj.PreOpIsLeftMsgWithFamilyOrFriend = item.IsLeftMsgWithFamilyOrFriend;
            $scope.LogObj.PreOpIsNoResponse = item.IsNoResponse;
            $scope.LogObj.PreOpIsArrivalTimeShared = item.IsArrivalTimeShared;
            $scope.LogObj.PreOpIsAccompanyShared = item.IsAccompanyShared;
            $scope.LogObj.PreOpIsDrinkPlentyWaterShared = item.IsDrinkPlentyWaterShared;
            $scope.LogObj.PreOpIsCoPay = item.IsCoPay;
            $scope.LogObj.PreOpIsNpoAfterMidnightShared = item.IsNpoAfterMidnightShared;
            $scope.LogObj.PreOpIsTakeBpHeartMedShared = item.IsTakeBpHeartMedShared;
            $scope.LogObj.PreOpIsDoNotTakeBpMedShared = item.IsDoNotTakeBpMedShared;
            $scope.LogObj.PreOpIsNoMakeupJewelMoistShared = item.IsNoMakeupJewelMoistShared;
            $scope.LogObj.PreOpCoPayNotes = item.CoPayNotes;
            $scope.LogObj.PreOpIsDoingWell = item.IsDoingWell;
            $scope.LogObj.PreOpIsMildDiscomfort = item.IsMildDiscomfort;
            $scope.LogObj.PreOpIsModerateDiscomfort = item.IsModerateDiscomfort;
            $scope.LogObj.PreOpIsExtensiveDiscomfort = item.IsExtensiveDiscomfort;
            $scope.LogObj.PreOpPatientoutcomeNotes = item.PatientoutcomeNotes || "";
            $scope.LogObj.PreOpRemarks = item.Remarks || "";
            $scope.LogObj.PreOpDropsStartTime = item.DropsStartTime || "";
            $scope.LogObj.PreOpDropStartDate = item.DropStartDate || "";
            $scope.LogObj.PreOpAddnewMobileNo = item.AddnewMobileNo || "";
            $scope.LogObj.PreOpBillingInstructionRemarks = item.BillingInstructionRemarks || "";
            $scope.LogObj.PreOpCreatedByUserName = item.CreatedByUserName || "";
            $scope.LogObj.PreopCallNurseReviewedById = item.PreopCallNurseReviewedById || null;
            $scope.LogObj.PreopCallNurseReviewedByTime = item.PreopCallNurseReviewedByTime || '';
            $scope.LogObj.PreopCallNurseReviewedByNotes = item.PreopCallNurseReviewedByNotes || '';
            $scope.LogObj.PreopCallNurseReviewedByDate = item.PreopCallNurseReviewedByDate || null;

            if ($scope.PreOpCallObj.PreopCallNurseReviewedById !== null) {
                var TempArray = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreOpCallObj.PreopCallNurseReviewedById }) || [];
                if (TempArray.length > 0) {
                    $scope.PreOpCallObj.PreopCallNurseReviewedByName = TempArray[0].FullName;
                }
            } else {
                $scope.PreOpCallObj.PreopCallNurseReviewedByName = '';
            }

            if ($scope.PreOpCallObj.PreopCallNurseReviewedByNotes !== '') {
                $scope.PreOpCallObj.PreopCallNurseReviewedByNotesInd = true;
            }

            var TempGeneralInstructionsCallChecklist = [];
            $scope.PreOpCallObj.GeneralInstructionsCallChecklist.forEach(sitem => sitem.Ischecked = false);
            if (item.GeneralInstructionsCallChecklist.length > 0) {
                angular.forEach($scope.PreOpCallObj.GeneralInstructionsCallChecklist, function (sitem) {
                    let value = $filter('filter')(item.GeneralInstructionsCallChecklist, { 'PreopPostopCallChecklistId': sitem.PreopPostopCallChecklistId }, true);
                    if (value.length > 0) {
                        sitem.Ischecked = true;
                        sitem.AppointmentPreOpPostOpCallDetailId = value[0].AppointmentPreOpPostOpCallDetailId;
                        TempGeneralInstructionsCallChecklist.push(sitem);
                    }
                })
            }
            $scope.LogObj.GeneralInstructionsCallChecklist = angular.copy(TempGeneralInstructionsCallChecklist);


            $scope.PreOpCallObj.BillingInstructionsCallChecklist.forEach(sitem => {
                sitem.Ischecked = false,
                sitem.BillingAmout = null;
            });

            var TempBillingInstructionsCallChecklist = [];
            if (item.BillingInstructionsCallChecklist.length > 0) {
                angular.forEach($scope.PreOpCallObj.BillingInstructionsCallChecklist, function (sitem) {
                    let value = $filter('filter')(item.BillingInstructionsCallChecklist, { 'PreopPostopCallChecklistId': sitem.PreopPostopCallChecklistId }, true);
                    if (value.length > 0) {
                        sitem.Ischecked = true;
                        sitem.AppointmentPreOpPostOpCallDetailId = value[0].AppointmentPreOpPostOpCallDetailId;
                        sitem.BillingAmout = value[0].BillingAmout;
                        TempBillingInstructionsCallChecklist.push(sitem);
                    }
                })
            }
            $scope.LogObj.BillingInstructionsCallChecklist = angular.copy(TempBillingInstructionsCallChecklist);

        }
    }
    $scope.EditPostopCallData = function (item) {
        angular.forEach($scope.OrgPostOpChecklist, function (hitem) {
            angular.forEach(hitem.OrganizationCheckListDetails, function (kitem) {
                kitem.IsChecked = false;
            });
        });
        console.log(item);
        if (item != undefined) {

            $scope.PostOpCallObj.PatientAscPostOpCallId = item.PatientAscPostOpCallId;
            $scope.PostOpCallObj.ContactStartDate = $filter('date')(item.ContactStartDate, 'MM-dd-yyyy');
            $scope.PostOpCallObj.ContactType = item.ContactType;
            $scope.PostOpCallObj.ContactStartTime = item.ContactStartTime;
            $scope.PostOpCallObj.CoPayNotes = item.CoPayNotes;
            $scope.PostOpCallObj.Patientoutcomenotes = item.Patientoutcomenotes;
            $scope.PostOpCallObj.PainLevel = item.PainLevel || null;
            $scope.PostOpCallObj.AdditionalNotes = item.AdditionalNotes || '';
            $scope.PostOpCallObj.ScheduledDate = $filter('date')(item.ScheduledDate, 'MM-dd-yyyy') || null;
            $scope.PostOpCallObj.CallAttempt = item.CallAttempt || '';
            $scope.PostOpCallObj.SpokeWith = item.SpokeWith || '';
            $scope.PostOpCallObj.SideEffects = item.SideEffects || '';
            $scope.PostOpCallObj.SideEffectsReason = item.SideEffectsReason || '';
            $scope.PostOpCallObj.MedicationHelping = item.MedicationHelping || '';
            $scope.PostOpCallObj.MedicationHelpingReason = item.MedicationHelpingReason || '';
            $scope.PostOpCallObj.ActivityRestrictions = item.ActivityRestrictions || '';
            $scope.PostOpCallObj.EyeShieldUsed = item.EyeShieldUsed || '';
            $scope.PostOpCallObj.ConfirmedAppointment = item.ConfirmedAppointment || '';
            $scope.PostOpCallObj.NauseaOrVomiting = item.NauseaOrVomiting || '';
            $scope.PostOpCallObj.NauseaSeverity = item.NauseaSeverity || '';
            $scope.PostOpCallObj.EyeDropScheduleUnderstanding = item.EyeDropScheduleUnderstanding || '';
            $scope.PostOpCallObj.PostopCallNurseReviewedById = item.PostopCallNurseReviewedById || null;
            $scope.PostOpCallObj.PostopCallNurseReviewedByName = item.PostopCallNurseReviewedByName || '';
            $scope.PostOpCallObj.PostopCallNurseReviewedByTime = item.PostopCallNurseReviewedByTime || '';
            $scope.PostOpCallObj.PostopCallNurseReviewedByDate = item.PostopCallNurseReviewedByDate || null;
            $scope.PostOpCallObj.RescheduleConfirmed = item.RescheduleConfirmed || false;



           
            $scope.LogObj.ContactStartDate = $filter('date')(item.ContactStartDate, 'MM-dd-yyyy');
            $scope.LogObj.ContactType = item.ContactType;
            $scope.LogObj.AddnewMobileNo = item.OtherNo || "";
            $scope.LogObj.ContactStartTime = item.ContactStartTime;
            $scope.LogObj.CoPayNotes = item.CoPayNotes;
            $scope.LogObj.Patientoutcomenotes = item.Patientoutcomenotes;
            $scope.LogObj.PainLevel = item.PainLevel || null;
            $scope.LogObj.AdditionalNotes = item.AdditionalNotes || '';
            $scope.LogObj.ScheduledDate = item.ScheduledDate || null;
            $scope.LogObj.CallAttempt = item.CallAttempt || '';
            $scope.LogObj.SpokeWith = item.SpokeWith || '';
            $scope.LogObj.SideEffects = item.SideEffects || '';
            $scope.LogObj.SideEffectsReason = item.SideEffectsReason || '';
            $scope.LogObj.MedicationHelping = item.MedicationHelping || '';
            $scope.LogObj.MedicationHelpingReason = item.MedicationHelpingReason || '';
            $scope.LogObj.ActivityRestrictions = item.ActivityRestrictions || '';
            $scope.LogObj.EyeShieldUsed = item.EyeShieldUsed || '';
            $scope.LogObj.ConfirmedAppointment = item.ConfirmedAppointment || '';
            $scope.LogObj.NauseaOrVomiting = item.NauseaOrVomiting || '';
            $scope.LogObj.NauseaSeverity = item.NauseaSeverity || '';
            $scope.LogObj.EyeDropScheduleUnderstanding = item.EyeDropScheduleUnderstanding || '';
            $scope.LogObj.PostopCallNurseReviewedById = item.PostopCallNurseReviewedById || null;
            $scope.LogObj.PostopCallNurseReviewedByName = item.PostopCallNurseReviewedByName || '';
            $scope.LogObj.PostopCallNurseReviewedByTime = item.PostopCallNurseReviewedByTime || '';
            $scope.LogObj.PostopCallNurseReviewedByDate = item.PostopCallNurseReviewedByDate || null;
            $scope.LogObj.RescheduleConfirmed = item.RescheduleConfirmed || false;


            angular.forEach(item.OrgASCChecklist, function (mitem) {
                angular.forEach($scope.OrgPostOpChecklist, function (hitem) {
                    if (mitem.CheckListId === hitem.CheckListId) {
                        angular.forEach(hitem.OrganizationCheckListDetails, function (kitem) {
                            if (kitem.Value == mitem.Value && kitem.CheckListId === mitem.CheckListId) {
                                kitem.IsChecked = true;
                                hitem.IsChecked = true;
                                kitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || 0;
                                hitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || 0;
                                hitem.Value = mitem.Value || '';
                            }
                            //else {
                            //    kitem.IsChecked = false;
                            //}
                        });
                    }
                });
            });

            $scope.LogObj.OrgASCChecklist = angular.copy(item.OrgASCChecklist);

             var TempPostOpCallActionTakenCheckList = [];
            $scope.PostOpCallObj.PostOpCallActionTakenCheckList.forEach(qitem => qitem.Ischecked = false);
            item.PostOpCallActionTakenCheckList = item.PostOpCallActionTakenCheckList || [];
            if (item.PostOpCallActionTakenCheckList.length > 0) {
                angular.forEach($scope.PostOpCallObj.PostOpCallActionTakenCheckList, function (sitem) {
                    let value = $filter('filter')(item.PostOpCallActionTakenCheckList, { 'PostOpCallActionTakenCheckListId': sitem.PostOpCallActionTakenCheckListId }, true);
                    if (value.length > 0) {
                        sitem.Ischecked = true;
                        sitem.PostOpCallActionTakenDetailId = value[0].PostOpCallActionTakenDetailId;
                        sitem.Remarks = value[0].Remarks || '';
                        TempPostOpCallActionTakenCheckList.push(sitem)
                    }
                })
            }
            $scope.LogObj.PostOpCallActionTakenCheckList = angular.copy(TempPostOpCallActionTakenCheckList);

        }
        $scope.PostOpCallObj.IssummaryShow = true;
        $scope.PostOpCallObj.IsPostOpEditModeInd = true;
    }

   
    $scope.GetPostOpCall();
    $scope.PreopsummaryView = function (item) {
        item = item || "";
        if (item != '') {
            $scope.PreOpCallObj.PatientAscPreOpCallDetailId = item.PatientAscPreOpCallDetailId;
            $scope.PreOpCallObj.ContactType = item.ContactType;
            $scope.PreOpCallObj.ContactStartDate = item.ContactStartDate;
            $scope.PreOpCallObj.ContactStartTime = item.ContactStartTime;
            $scope.PreOpCallObj.IsConnectedWithPatient = item.IsConnectedWithPatient;
            $scope.PreOpCallObj.IsConnectedWithFamilyOrFriend = item.IsConnectedWithFamilyOrFriend;
            $scope.PreOpCallObj.IsLeftMsgWithPatient = item.IsLeftMsgWithPatient;
            $scope.PreOpCallObj.IsLeftMsgWithFamilyOrFriend = item.IsLeftMsgWithFamilyOrFriend;
            $scope.PreOpCallObj.IsNoResponse = item.IsNoResponse;
            $scope.PreOpCallObj.IsArrivalTimeShared = item.IsArrivalTimeShared;
            $scope.PreOpCallObj.IsAccompanyShared = item.IsAccompanyShared;
            $scope.PreOpCallObj.IsDrinkPlentyWaterShared = item.IsDrinkPlentyWaterShared;
            $scope.PreOpCallObj.IsCoPay = item.IsCoPay;
            $scope.PreOpCallObj.IsNpoAfterMidnightShared = item.IsNpoAfterMidnightShared;
            $scope.PreOpCallObj.IsTakeBpHeartMedShared = item.IsTakeBpHeartMedShared;
            $scope.PreOpCallObj.IsDoNotTakeBpMedShared = item.IsDoNotTakeBpMedShared;
            $scope.PreOpCallObj.IsNoMakeupJewelMoistShared = item.IsNoMakeupJewelMoistShared;
            $scope.PreOpCallObj.CoPayNotes = item.CoPayNotes;
            $scope.PreOpCallObj.IsDoingWell = item.IsDoingWell;
            $scope.PreOpCallObj.IsMildDiscomfort = item.IsMildDiscomfort;
            $scope.PreOpCallObj.IsModerateDiscomfort = item.IsModerateDiscomfort;
            $scope.PreOpCallObj.IsExtensiveDiscomfort = item.IsExtensiveDiscomfort;
            $scope.PreOpCallObj.PatientoutcomeNotes = item.PatientoutcomeNotes || "";
            $scope.PreOpCallObj.Remarks = item.Remarks || "";
            $scope.PreOpCallObj.DropsStartTime = item.DropsStartTime || "";
            $scope.PreOpCallObj.DropStartDate = item.DropStartDate || "";
            $scope.PreOpCallObj.AddnewMobileNo = item.AddnewMobileNo || "";
            $scope.PreOpCallObj.BillingInstructionRemarks = item.BillingInstructionRemarks || "";
            $scope.PreOpCallObj.CreatedByUserName = item.CreatedByUserName || "";

            $scope.PreOpCallObj.PreopCallNurseReviewedById = item.PreopCallNurseReviewedById || null;
            $scope.PreOpCallObj.PreopCallNurseReviewedByTime = item.PreopCallNurseReviewedByTime || '';
            $scope.PreOpCallObj.PreopCallNurseReviewedByNotes = item.PreopCallNurseReviewedByNotes || '';
            $scope.PreOpCallObj.PreopCallNurseReviewedByDate = item.PreopCallNurseReviewedByDate || null;

            $scope.PreOpCallObj.PreopCallArrivalTime = item.PreopCallArrivalTime || null;



            $scope.LogObj.PreOpContactType = item.ContactType;
            $scope.LogObj.PreOpContactStartDate = item.ContactStartDate;
            $scope.LogObj.PreOpContactStartTime = item.ContactStartTime;
            $scope.LogObj.PreOpIsConnectedWithPatient = item.IsConnectedWithPatient;
            $scope.LogObj.PreOpIsConnectedWithFamilyOrFriend = item.IsConnectedWithFamilyOrFriend;
            $scope.LogObj.PreOpIsLeftMsgWithPatient = item.IsLeftMsgWithPatient;
            $scope.LogObj.PreOpIsLeftMsgWithFamilyOrFriend = item.IsLeftMsgWithFamilyOrFriend;
            $scope.LogObj.PreOpIsNoResponse = item.IsNoResponse;
            $scope.LogObj.PreOpIsArrivalTimeShared = item.IsArrivalTimeShared;
            $scope.LogObj.PreOpIsAccompanyShared = item.IsAccompanyShared;
            $scope.LogObj.PreOpIsDrinkPlentyWaterShared = item.IsDrinkPlentyWaterShared;
            $scope.LogObj.PreOpIsCoPay = item.IsCoPay;
            $scope.LogObj.PreOpIsNpoAfterMidnightShared = item.IsNpoAfterMidnightShared;
            $scope.LogObj.PreOpIsTakeBpHeartMedShared = item.IsTakeBpHeartMedShared;
            $scope.LogObj.PreOpIsDoNotTakeBpMedShared = item.IsDoNotTakeBpMedShared;
            $scope.LogObj.PreOpIsNoMakeupJewelMoistShared = item.IsNoMakeupJewelMoistShared;
            $scope.LogObj.PreOpCoPayNotes = item.CoPayNotes;
            $scope.LogObj.PreOpIsDoingWell = item.IsDoingWell;
            $scope.LogObj.PreOpIsMildDiscomfort = item.IsMildDiscomfort;
            $scope.LogObj.PreOpIsModerateDiscomfort = item.IsModerateDiscomfort;
            $scope.LogObj.PreOpIsExtensiveDiscomfort = item.IsExtensiveDiscomfort;
            $scope.LogObj.PreOpPatientoutcomeNotes = item.PatientoutcomeNotes || "";
            $scope.LogObj.PreOpRemarks = item.Remarks || "";
            $scope.LogObj.PreOpDropsStartTime = item.DropsStartTime || "";
            $scope.LogObj.PreOpDropStartDate = item.DropStartDate || "";
            $scope.LogObj.PreOpAddnewMobileNo = item.AddnewMobileNo || "";
            $scope.LogObj.PreOpBillingInstructionRemarks = item.BillingInstructionRemarks || "";
            $scope.LogObj.PreOpCreatedByUserName = item.CreatedByUserName || "";
            $scope.LogObj.PreopCallNurseReviewedById = item.PreopCallNurseReviewedById || null;
            $scope.LogObj.PreopCallNurseReviewedByTime = item.PreopCallNurseReviewedByTime || '';
            $scope.LogObj.PreopCallNurseReviewedByNotes = item.PreopCallNurseReviewedByNotes || '';
            $scope.LogObj.PreopCallNurseReviewedByDate = item.PreopCallNurseReviewedByDate || null;
            $scope.LogObj.PreopCallArrivalTime = item.PreopCallArrivalTime || null;



            if ($scope.PreOpCallObj.PreopCallNurseReviewedById !== null) {
                var TempArray = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreOpCallObj.PreopCallNurseReviewedById }) || [];
                if (TempArray.length > 0) {
                    $scope.PreOpCallObj.PreopCallNurseReviewedByName = TempArray[0].FullName;
                }
            } else {
                $scope.PreOpCallObj.PreopCallNurseReviewedByName = '';
            }

            if ($scope.PreOpCallObj.PreopCallNurseReviewedByNotes !== '') {
                $scope.PreOpCallObj.PreopCallNurseReviewedByNotesInd = true;
            }



            if (($scope.PreOpCallObj.ContactType != $scope.ParentObject.MobileNo) && ($scope.PreOpCallObj.ContactType != $scope.ParentObject.ContactNo)) {
                $scope.PreOpCallObj.PreopAddnewMobileNo = $scope.PreOpCallObj.ContactType;
                $scope.ParentObject.PreopAddnewMobileNo = $scope.PreOpCallObj.ContactType;
                $scope.LogObj.PreOpAddnewMobileNo = $scope.PreOpCallObj.ContactType
                $scope.PreOpCallObj.IsPreopOtherMobileNo = true;
            }

            var TempGeneralInstructionsCallChecklist = [];
            $scope.PreOpCallObj.GeneralInstructionsCallChecklist.forEach(qitem => qitem.Ischecked = false);
            if (item.GeneralInstructionsCallChecklist.length > 0) {
                angular.forEach($scope.PreOpCallObj.GeneralInstructionsCallChecklist, function (sitem) {
                    let value = $filter('filter')(item.GeneralInstructionsCallChecklist, { 'PreopPostopCallChecklistId': sitem.PreopPostopCallChecklistId }, true);
                    if (value.length > 0) {
                        sitem.Ischecked = true;
                        sitem.AppointmentPreOpPostOpCallDetailId = value[0].AppointmentPreOpPostOpCallDetailId;
                        TempGeneralInstructionsCallChecklist.push(sitem);
                    }
                })
            }

            $scope.LogObj.GeneralInstructionsCallChecklist = angular.copy(TempGeneralInstructionsCallChecklist);

            var TempBillingInstructionsCallChecklist = [];
            $scope.PreOpCallObj.BillingInstructionsCallChecklist.forEach(qitem => qitem.Ischecked = false);
            if (item.BillingInstructionsCallChecklist.length > 0) {
                angular.forEach($scope.PreOpCallObj.BillingInstructionsCallChecklist, function (sitem) {
                    let value = $filter('filter')(item.BillingInstructionsCallChecklist, { 'PreopPostopCallChecklistId': sitem.PreopPostopCallChecklistId }, true);
                    if (value.length > 0) {
                        sitem.Ischecked = true;
                        sitem.AppointmentPreOpPostOpCallDetailId = value[0].AppointmentPreOpPostOpCallDetailId;
                        sitem.BillingAmout = value[0].BillingAmout;
                        TempBillingInstructionsCallChecklist.push(sitem);
                    }
                })
            }
        }

        $scope.LogObj.BillingInstructionsCallChecklist = angular.copy(TempBillingInstructionsCallChecklist);
    }
   
    
    $scope.Postopsummarymethod = function (item) {
        angular.forEach($scope.OrgPostOpChecklist, function (hitem) {
            angular.forEach(hitem.OrganizationCheckListDetails, function (kitem) {
                kitem.IsChecked = false;
            });
        });
        $scope.Isinstructions = false;
        $scope.Isoutcome = false;
        console.log(item);
        if (item != undefined) {
            $scope.PostOpCallObj.PatientAscPostOpCallId = item.PatientAscPostOpCallId;
            $scope.PostOpCallObj.ContactStartDate = $filter('date')(item.ContactStartDate, 'MM-dd-yyyy');
            $scope.PostOpCallObj.ContactType = item.ContactType;
            $scope.PostOpCallObj.AddnewMobileNo = item.OtherNo || "";
            $scope.PostOpCallObj.ContactStartTime = item.ContactStartTime;
            $scope.PostOpCallObj.CoPayNotes = item.CoPayNotes;
            $scope.PostOpCallObj.Patientoutcomenotes = item.Patientoutcomenotes;
            $scope.PostOpCallObj.PainLevel = item.PainLevel || null;
            $scope.PostOpCallObj.AdditionalNotes = item.AdditionalNotes || '';
            $scope.PostOpCallObj.ScheduledDate = $filter('date')(item.ScheduledDate, 'MM-dd-yyyy') || null;
            $scope.PostOpCallObj.CallAttempt = item.CallAttempt || '';
            $scope.PostOpCallObj.SpokeWith = item.SpokeWith || '';
            $scope.PostOpCallObj.SideEffects = item.SideEffects || '';
            $scope.PostOpCallObj.SideEffectsReason = item.SideEffectsReason || '';
            $scope.PostOpCallObj.MedicationHelping = item.MedicationHelping || '';
            $scope.PostOpCallObj.MedicationHelpingReason = item.MedicationHelpingReason || '';
            $scope.PostOpCallObj.ActivityRestrictions = item.ActivityRestrictions || '';
            $scope.PostOpCallObj.EyeShieldUsed = item.EyeShieldUsed || '';
            $scope.PostOpCallObj.ConfirmedAppointment = item.ConfirmedAppointment || '';
            $scope.PostOpCallObj.NauseaOrVomiting = item.NauseaOrVomiting || '';
            $scope.PostOpCallObj.NauseaSeverity = item.NauseaSeverity || '';
            $scope.PostOpCallObj.EyeDropScheduleUnderstanding = item.EyeDropScheduleUnderstanding || '';
            $scope.PostOpCallObj.PostopCallNurseReviewedById = item.PostopCallNurseReviewedById || null;
            $scope.PostOpCallObj.PostopCallNurseReviewedByName = item.PostopCallNurseReviewedByName || '';
            $scope.PostOpCallObj.PostopCallNurseReviewedByTime = item.PostopCallNurseReviewedByTime || '';
            $scope.PostOpCallObj.PostopCallNurseReviewedByDate = item.PostopCallNurseReviewedByDate || null;
            $scope.PostOpCallObj.RescheduleConfirmed = item.RescheduleConfirmed || false;


            $scope.LogObj.ContactStartDate = $filter('date')(item.ContactStartDate, 'MM-dd-yyyy');
            $scope.LogObj.ContactType = item.ContactType;
            $scope.LogObj.AddnewMobileNo = item.OtherNo || "";
            $scope.LogObj.ContactStartTime = item.ContactStartTime;
            $scope.LogObj.CoPayNotes = item.CoPayNotes;
            $scope.LogObj.Patientoutcomenotes = item.Patientoutcomenotes;
            $scope.LogObj.PainLevel = item.PainLevel || null;
            $scope.LogObj.AdditionalNotes = item.AdditionalNotes || '';
            $scope.LogObj.ScheduledDate = item.ScheduledDate || null;
            $scope.LogObj.CallAttempt = item.CallAttempt || '';
            $scope.LogObj.SpokeWith = item.SpokeWith || '';
            $scope.LogObj.SideEffects = item.SideEffects || '';
            $scope.LogObj.SideEffectsReason = item.SideEffectsReason || '';
            $scope.LogObj.MedicationHelping = item.MedicationHelping || '';
            $scope.LogObj.MedicationHelpingReason = item.MedicationHelpingReason || '';
            $scope.LogObj.ActivityRestrictions = item.ActivityRestrictions || '';
            $scope.LogObj.EyeShieldUsed = item.EyeShieldUsed || '';
            $scope.LogObj.ConfirmedAppointment = item.ConfirmedAppointment || '';
            $scope.LogObj.NauseaOrVomiting = item.NauseaOrVomiting || '';
            $scope.LogObj.NauseaSeverity = item.NauseaSeverity || '';
            $scope.LogObj.EyeDropScheduleUnderstanding = item.EyeDropScheduleUnderstanding || '';
            $scope.LogObj.PostopCallNurseReviewedById = item.PostopCallNurseReviewedById || null;
            $scope.LogObj.PostopCallNurseReviewedByName = item.PostopCallNurseReviewedByName || '';
            $scope.LogObj.PostopCallNurseReviewedByTime = item.PostopCallNurseReviewedByTime || '';
            $scope.LogObj.PostopCallNurseReviewedByDate = item.PostopCallNurseReviewedByDate || null;
            $scope.LogObj.RescheduleConfirmed = item.RescheduleConfirmed || false;

                    

            $scope.PostOpCallObj.OrgASCChecklist = item.OrgASCChecklist;
            var Instructions = $filter("filter")($scope.PostOpCallObj.OrgASCChecklist, { "CheckListId": 182 }, true);
            if (Instructions.length>0) {
                $scope.Isinstructions=true
            }
            var Outcome = $filter("filter")($scope.PostOpCallObj.OrgASCChecklist, { "CheckListId": 183 }, true);
            if (Outcome.length > 0) {
                $scope.Isoutcome = true
            }
            angular.forEach(item.OrgASCChecklist, function (mitem) {
                angular.forEach($scope.OrgPostOpChecklist, function (hitem) {
                    if (mitem.CheckListId === hitem.CheckListId) {
                        angular.forEach(hitem.OrganizationCheckListDetails, function (kitem) {
                            if (kitem.Value == mitem.Value && kitem.CheckListId === mitem.CheckListId) {
                                kitem.IsChecked = true;
                                hitem.IsChecked = true;
                                kitem.PatientAscCheckListDetailId = mitem.PatientAscCheckListDetailId || 0;
                                hitem.PatientAscCheckListDetailId = mitem.PatientAscCheckListDetailId || 0;
                                kitem.Value = mitem.Value || '';
                            }

                        });
                    }
                });
            });

            $scope.LogObj.OrgASCChecklist = angular.copy(item.OrgASCChecklist);

            if ($scope.PostOpCallObj.AddnewMobileNo != "") {
                $scope.ParentObject.AddnewMobileNo = item.OtherNo;
                $scope.PostOpCallObj.ContactType = item.OtherNo;
                $scope.LogObj.ContactType = item.OtherNo;
                $scope.PostOpCallObj.IsOtherMobileNo = true;
            }


            var TempActionTakenCheckList = [];
            $scope.PostOpCallObj.PostOpCallActionTakenCheckList.forEach(qitem => qitem.Ischecked = false);
            item.PostOpCallActionTakenCheckList = item.PostOpCallActionTakenCheckList || [];
            if (item.PostOpCallActionTakenCheckList.length > 0) {
                angular.forEach($scope.PostOpCallObj.PostOpCallActionTakenCheckList, function (sitem) {
                    let value = $filter('filter')(item.PostOpCallActionTakenCheckList, { 'PostOpCallActionTakenCheckListId': sitem.PostOpCallActionTakenCheckListId }, true);
                    if (value.length > 0) {
                        sitem.Ischecked = true;
                        sitem.PostOpCallActionTakenDetailId = value[0].PostOpCallActionTakenDetailId;
                        sitem.Remarks = value[0].Remarks || '';
                        TempActionTakenCheckList.push(sitem);
                    }
                })

            }
            $scope.LogObj.PostOpCallActionTakenCheckList = angular.copy(TempActionTakenCheckList);
        }

    }

    $scope.selectedOutcomeforPatient = function (type) {
        $scope.PreOpCallObj.IsDoingWell = false;
        $scope.PreOpCallObj.IsMildDiscomfort = false;
        $scope.PreOpCallObj.IsModerateDiscomfort = false;
        $scope.PreOpCallObj.IsExtensiveDiscomfort = false;
        if (type == 1) {
            $scope.PreOpCallObj.IsDoingWell = true;
        } else if (type == 2) {
            $scope.PreOpCallObj.IsMildDiscomfort = true;
        } else if (type == 3) {
            $scope.PreOpCallObj.IsModerateDiscomfort = true;
        } else if (type == 4) {
            $scope.PreOpCallObj.IsExtensiveDiscomfort = true;
        }
        else {
            console.log("checking");
        }
    }
    $scope.EditPreopcallItem = function () {
        $scope.PreOpCallObj.IssummaryShow = false;
        $scope.PreOpCallObj.IsPreopSubCallScreensummary = false;
        $scope.PreOpCallObj.IsPreOpEditModeInd = false;
        $scope.PreOpCallObj.IsPreOpRosEditModeInd = false;
        $scope.PreOpCallObj.IsPreOpnSaveNameEditModeInd = true;

    }
    $scope.EditPreopRoslItemfromsummary = function () {
        $scope.PreOpCallObj.IsRossummaryShow = false;
        $scope.PreOpCallObj.IsFromRos = true;
        $scope.EditPreopcallItem();
        $scope.ChangeSubTab(3);
        $scope.EditPreopRoslItem();
    }
    $scope.EditPostopCallItem = function () {
        $scope.PostOpCallObj.IssummaryShow = false;
        $scope.PostOpCallObj.IsPostOpEditModeInd = false;
        $scope.PostOpCallObj.IsPostOpSaveNameEditModeInd = true;
    }
    $scope.AddNewPreopcall = function () {
        $scope.PreOpCallObj.IssummaryShow = false;
        $scope.PreOpCallObj.IsPreOpEditModeInd = false;
        $scope.PreOpCallObj.IsPreOpnSaveNameEditModeInd = false;
        $scope.PreOpCallObj.PatientAscPreOpCallDetailId = 0;
        $scope.PreOpCallObj.ContactType = null;
        $scope.PreOpCallObj.ContactStartDate = "";
        $scope.PreOpCallObj.ContactStartTime = "";
        $scope.PreOpCallObj.IsConnectedWithPatient = false;
        $scope.PreOpCallObj.IsConnectedWithFamilyOrFriend = false;
        $scope.PreOpCallObj.IsLeftMsgWithPatient = false;
        $scope.PreOpCallObj.IsLeftMsgWithFamilyOrFriend = false;
        $scope.PreOpCallObj.IsNoResponse = false;
        $scope.PreOpCallObj.IsArrivalTimeShared = false;
        $scope.PreOpCallObj.IsAccompanyShared = false;
        $scope.PreOpCallObj.IsDrinkPlentyWaterShared = false;
        $scope.PreOpCallObj.IsCoPay = false;
        $scope.PreOpCallObj.IsNpoAfterMidnightShared = false;
        $scope.PreOpCallObj.IsTakeBpHeartMedShared = false;
        $scope.PreOpCallObj.IsDoNotTakeBpMedShared = false;
        $scope.PreOpCallObj.IsNoMakeupJewelMoistShared = false;
        $scope.PreOpCallObj.CoPayNotes = "";
        $scope.PreOpCallObj.IsDoingWell = false;
        $scope.PreOpCallObj.IsMildDiscomfort = false;
        $scope.PreOpCallObj.IsModerateDiscomfort = false;
        $scope.PreOpCallObj.IsExtensiveDiscomfort = false;
        $scope.PreOpCallObj.PatientoutcomeNotes = "";
        $scope.PreOpCallObj.Remarks = "";
        $scope.PreOpCallObj.DropsStartTime = "";
        $scope.PreOpCallObj.DropStartDate = "";
        $scope.PreOpCallObj.AddnewMobileNo = "";
        $scope.PreOpCallObj.BillingInstructionRemarks = "";
        $scope.PreOpCallObj.PreopCallNurseReviewedById = 0;
        $scope.PreOpCallObj.PreopCallNurseReviewedByNotes = "";
        $scope.PreOpCallObj.PreopCallNurseReviewedByNotesInd = false;
        $scope.PreOpCallObj.PreopCallNurseReviewedByTime = "";
        $scope.PreOpCallObj.IsPreopOtherMobileNo = false;
        $scope.PreOpCallObj.PreopAddnewMobileNo = "";
        $scope.PreOpCallObj.PreopCallNurseReviewedByDate = null;
        $scope.PreOpCallObj.IsAddNewCallDetails = true;
        $scope.PreOpCallObj.PreopCallArrivalTime = null;

        $scope.PreOpCallObj.GeneralInstructionsCallChecklist.forEach(qitem => { qitem.Ischecked = false, qitem.AppointmentPreOpPostOpCallDetailId = 0;});
        $scope.PreOpCallObj.BillingInstructionsCallChecklist.forEach(oitem => {
            oitem.Ischecked = false;
            oitem.BillingAmout = null;
            oitem.AppointmentPreOpPostOpCallDetailId = 0;
        });

        $scope.LogObj.PreOpContactType ="";
        $scope.LogObj.PreOpContactStartDate = "";
        $scope.LogObj.PreOpContactStartTime = "";
        $scope.LogObj.PreOpIsConnectedWithPatient = false;
        $scope.LogObj.PreOpIsConnectedWithFamilyOrFriend = false;
        $scope.LogObj.PreOpIsLeftMsgWithPatient = false;
        $scope.LogObj.PreOpIsLeftMsgWithFamilyOrFriend = false;
        $scope.LogObj.PreOpIsNoResponse = false;
        $scope.LogObj.PreOpIsArrivalTimeShared = false;
        $scope.LogObj.PreOpIsAccompanyShared = false;
        $scope.LogObj.PreOpIsDrinkPlentyWaterShared = false;
        $scope.LogObj.PreOpIsCoPay = false;
        $scope.LogObj.PreOpIsNpoAfterMidnightShared = false;
        $scope.LogObj.PreOpIsTakeBpHeartMedShared = false;
        $scope.LogObj.PreOpIsDoNotTakeBpMedShared = false;
        $scope.LogObj.PreOpIsNoMakeupJewelMoistShared = false;
        $scope.LogObj.PreOpCoPayNotes ="";
        $scope.LogObj.PreOpIsDoingWell = false;
        $scope.LogObj.PreOpIsMildDiscomfort = false;
        $scope.LogObj.PreOpIsModerateDiscomfort = false;
        $scope.LogObj.PreOpIsExtensiveDiscomfort = false;
        $scope.LogObj.PreOpPatientoutcomeNotes = "";
        $scope.LogObj.PreOpRemarks = "";
        $scope.LogObj.PreOpDropsStartTime = "";
        $scope.LogObj.PreOpDropStartDate = "";
        $scope.LogObj.PreOpAddnewMobileNo = "";
        $scope.LogObj.PreOpBillingInstructionRemarks = "";
        $scope.LogObj.PreOpCreatedByUserName = "";
        $scope.LogObj.PreopCallNurseReviewedById = null;
        $scope.LogObj.PreopCallNurseReviewedByTime = "";
        $scope.LogObj.PreopCallNurseReviewedByNotes = "";
        $scope.LogObj.PreopCallNurseReviewedByDate = null;
        $scope.LogObj.PreopCallArrivalTime = null;
        $scope.LogObj.BillingInstructionsCallChecklist = [];
        $scope.LogObj.GeneralInstructionsCallChecklist = [];
    }
    /* Start ROS*/
    $scope.GetAllergyList = function (val) {
        var req = {
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "OrganizationId": $scope.HospitalId,
            //"HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "GetAllIndicator": 1,
            "SearchText": val,
            "AllergyType": 0,
            "PageSize": 10,
            "PageNumber": 1,
            "Type": '',
            "UserId": doctorinfo.doctorid,
            "IsFrequent": "N"

        };
        //if (val === "") {
        //    req.Type = 'C';
        //}

        if (req.SearchText == "") {
            req.IsFrequent = "Y";
        }



        return eHnoteConditionsDataService.getListOfAllergies(req).then(function (resp) {
            if (resp.data.count !== 0) {
                if (resp.data.rows !== undefined) {
                    $scope.ROSHistoriesObj.AddAllergyshow = false;
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                } else {
                    $scope.ROSHistoriesObj.AddAllergyshow = true;
                }
            } else {
                $scope.ROSHistoriesObj.AddAllergyshow = true;
            }
        });
    };
    $scope.Frequentlyaddedselect = function (val) {
        $scope.onAllergySelect(val);
    }
    $scope.onAllergySelect = function (object) {

        if ($scope.obj.isNKASelected) {
            angular.forEach($scope.obj.AllergyItems, function (item, nindex) {
                var List = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
                    return fitem.AllergyId === 1;
                }, true);
                if (List.length > 0) {
                    if (List[0].PatientDetailId === 0) {
                        var indexToRemove = $scope.obj.AllergyItems.indexOf(List[0]);
                        if (indexToRemove !== -1) {
                            $scope.obj.AllergyItems.splice(indexToRemove, 1);
                        }
                    } else {
                        List[0].DeleteInd = 'Y';
                    }
                }
                item.IsNKASelected = false
                $scope.obj.isNKASelected = false
            });

        }
        if ($scope.obj.isNKDASelected) {
            angular.forEach($scope.obj.AllergyItems, function (item, ndindex) {
                var List = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
                    return fitem.AllergyId === 2;
                }, true);
                if (List.length > 0) {
                    if (List[0].PatientDetailId === 0) {
                        var indexToRemove = $scope.obj.AllergyItems.indexOf(List[0]);
                        if (indexToRemove !== -1) {
                            $scope.obj.AllergyItems.splice(indexToRemove, 1);
                        }
                    } else {
                        List[0].DeleteInd = 'Y';
                    }
                }
                item.IsNKDASelected = false
                $scope.obj.isNKDASelected = false
            });
        }


        if (object.AllergyId === '') {
            object.AllergyName = '';
            return false;
        }
        var FreqList = $filter("filter")($scope.FrequentlyAllergyitems, function (fitem) {
            return fitem.AllergyId == object.AllergyId;
        }, true);
        if (FreqList.length > 0) {
            FreqList[0].Onselect = true;
        }
        $scope.obj.SelectedAllergyItem = object;
        $scope.obj.SelectedAllergyItem.showAllergieshistory = false;
        var i = 0;
        var obj = {
            "PatientDetailId": 0,
            "IsShowAllergySnomedAddInd": object.IsShowAllergySnomedAddInd || false,
            "AllergyId": object.AllergyId || null,
            "AllergyName": object.AllergyName || '',
            "OrganId": 4,
            "SeverityId": null,
            "SNOMEDId": null,
            "RxNormID": null,
            "SeverityName": '',
            "ReactionId": null,
            "StatusId": null,
            "Duration": null,
            "AllergyTypeId": null,
            "IsEdit": true,
            "ShowNote": true,
            "ShowDateFormat": true,
            "ReactionName": '',
            "DurationDate": '',
            "StatusName": '',
            "Remarks": '',
            "SnomedCode": '',
            "DurationType": 'D',
            "OnsetType": 'Date',
            "DiagnosisObject": 'D',
            "DeleteInd": 'N',

        }
        //  $scope.obj.AllergyItems = $filter('filter')($scope.obj.AllergyItems, { 'DeleteInd': 'N' }, true)||[];
        if ($scope.obj.AllergyItems.length > 0) {
            angular.forEach($scope.obj.AllergyItems, function (item) {
                if (item.AllergyId === obj.AllergyId && item.DeleteInd == "N") {
                    alertify.error('You have already entered this Allergy');
                    i++;
                }
            });
        }
        if ($scope.obj.AllergyItems.length !== 0) {
            angular.forEach($scope.obj.AllergyItems, function (item) {
                item.IsEdit = false;
            });
        }


        if (i === 0) {
            $scope.obj.SelectedAllergyItem.PatientDetailId = 0;
            $scope.obj.SelectedAllergyItem.ModifiedBy = $scope.DisplayName;
            $scope.obj.SelectedAllergyItem.ModifiedDt = $filter('date')(new Date(), "yyyy-MM-dd");
            $scope.obj.SelectedAllergyItem.OrganId = $scope.obj.SelectedAllergyItemEye || 4;
            $scope.obj.SelectedAllergyItem.SeverityId = '';
            $scope.obj.SelectedAllergyItem.ReactionId = '';
            $scope.obj.SelectedAllergyItem.ReactionName = '';
            //  $scope.obj.SelectedAllergyItem.RcopiaAllergyId = null;
            $scope.obj.SelectedAllergyItem.StatusId = 1;
            $scope.obj.SelectedAllergyItem.StatusName = 'Active';
            $scope.obj.SelectedAllergyItem.AllergyTypeId = '';
            $scope.obj.SelectedAllergyItem.Duration = null;
            $scope.obj.SelectedAllergyItem.DurationDate = '';
            $scope.obj.SelectedAllergyItem.ShowDateFormat = true;
            $scope.obj.SelectedAllergyItem.Remarks = '';
            $scope.obj.SelectedAllergyItem.SnomedCode = '';
            $scope.obj.SelectedAllergyItem.DurationType = 'D';
            $scope.obj.SelectedAllergyItem.IsEdit = true;
            $scope.obj.SelectedAllergyItem.ShowNote = false;
            $scope.obj.SelectedAllergyItem.DiagnosisObject = "";
            $scope.obj.SelectedAllergyItem.DeleteInd = "N";

            $scope.obj.AllergyItems.push($scope.obj.SelectedAllergyItem);
        }
        $scope.obj.SelectedAllergyItem = "";

    };
    $scope.DeleteAllergy = function (Aitem) {
        var index = $scope.obj.AllergyItems.indexOf(Aitem);
        if (Aitem.PatientDetailId === 0) {
            if (index > -1) {
                $scope.obj.AllergyItems.splice(index, 1);
            }
        } else {
            $scope.obj.AllergyItems[index].DeleteInd = 'Y';
        }
        var FreqList = $filter("filter")($scope.FrequentlyAllergyitems, function (fitem) {
            return fitem.AllergyId == Aitem.AllergyId;
        }, true);
        if (FreqList.length > 0) {
            FreqList[0].Onselect = false;
        }
    };
    $scope.onAllergyRcopiaSelect = function (object) {
        if ($scope.obj.isNKASelected) {
            angular.forEach($scope.obj.AllergyItems, function (item) {
                var List = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
                    return fitem.AllergyId === 1;
                }, true);
                if (List.length > 0) {
                    if (List[0].PatientDetailId === 0) {
                        var indexToRemove = $scope.obj.AllergyItems.indexOf(List[0]);
                        if (indexToRemove !== -1) {
                            $scope.obj.AllergyItems.splice(indexToRemove, 1);
                        }
                    } else {
                        List[0].DeleteInd = 'Y';
                    }
                }
                item.IsNKASelected = false
                $scope.obj.isNKASelected = false
            });

        }

        if ($scope.obj.isNKDASelected) {
            angular.forEach($scope.obj.AllergyItems, function (item, ndindex) {
                var List = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
                    return fitem.AllergyId === 2;
                }, true);
                if (List.length > 0) {
                    if (List[0].PatientDetailId === 0) {
                        var indexToRemove = $scope.obj.AllergyItems.indexOf(List[0]);
                        if (indexToRemove !== -1) {
                            $scope.obj.AllergyItems.splice(indexToRemove, 1);
                        }
                    } else {
                        List[0].DeleteInd = 'Y';
                    }
                }
                item.IsNKDASelected = false
                $scope.obj.isNKDASelected = false
            });
        }

        var req = {
            "RcopiaAllergyId": object.RcopiaAllergyId || "",
            "AllergyName": object.BrandName || "",
            "RxnormID": object.RxnormID || "",
            "RxnormIDType": object.RxnormIDType || "",
            "NDCID": object.NDCID || "",
            "GenericName": object.GenericName || "",
            "Form": object.Form || "",
            "Schedule": object.Schedule || "",
            "Strength": object.Strength || "",
            "RouteCode": object.RouteCode || "",
            "UserId": doctorinfo.doctorid,
            "OnsetDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a")
        }
        eHnoteConditionsDataService.SearchandUpdateAllergyRcopiaData(req).then(function (resp) {
            if (resp.data.status == "Success") {
                if (resp.data.rows.length > 0) {
                    var selectedobj = resp.data.rows[0];
                    if (selectedobj.AllergyId === '') {
                        selectedobj.AllergyName = '';
                        $scope.obj.SelectedAllergyItem = '';
                        return false;
                    }
                    $scope.obj.SelectedAllergyItem.AllergyId = selectedobj.AllergyId;
                    $scope.obj.SelectedAllergyItem.RcopiaAllergyId = selectedobj.RcopiaAllergyId || 0;
                    $scope.obj.SelectedAllergyItem.AllergyName = selectedobj.AllergyName;
                    $scope.obj.SelectedAllergyItem.showAllergieshistory = false;
                    var i = 0;
                    var obj = {
                        "PatientDetailId": 0,
                        "IsShowAllergySnomedAddInd": selectedobj.IsShowAllergySnomedAddInd || false,
                        "AllergyId": selectedobj.AllergyId || null,
                        "RcopiaAllergyId": selectedobj.RcopiaAllergyId || null,
                        "AllergyName": selectedobj.AllergyName || '',
                        "OrganId": 4,
                        "SeverityId": null,
                        "SNOMEDId": null,
                        "RxNormID": selectedobj.RxnormID || null,
                        "NDCID": selectedobj.NDCID || null,
                        "DrugGroupID": selectedobj.DrugGroupID || null,
                        "SeverityName": '',
                        "ReactionId": null,
                        "StatusId": null,
                        "Duration": null,
                        "AllergyTypeId": null,
                        "IsEdit": true,
                        "ShowNote": true,
                        "ShowDateFormat": true,
                        "ReactionName": '',
                        "DurationDate": '',
                        "StatusName": '',
                        "Remarks": '',
                        "SnomedCode": '',
                        "DurationType": 'D',
                        "OnsetType": 'Date',
                        "DiagnosisObject": 'D',
                        "DeleteInd": 'N',
                        "IsFrequent": selectedobj.IsFrequent || "N"
                    }
                    if ($scope.obj.AllergyItems.length > 0) {
                        angular.forEach($scope.obj.AllergyItems, function (item) {
                            if (item.AllergyId === obj.AllergyId && item.DeleteInd == "N") {
                                alertify.error('You have already entered this Allergy');
                                i++;
                            }
                        });
                    }

                    if ($scope.obj.AllergyItems.length !== 0) {
                        angular.forEach($scope.obj.AllergyItems, function (item) {
                            item.IsEdit = false;
                        });
                    }
                    if (i === 0) {
                        $scope.obj.SelectedAllergyItem.ModifiedBy = $scope.DisplayName;
                        $scope.obj.SelectedAllergyItem.ModifiedDt = $scope.DisplayDate;
                        $scope.obj.SelectedAllergyItem.OrganId = $scope.obj.SelectedAllergyItemEye || 4;
                        $scope.obj.SelectedAllergyItem.Duration = null;
                        $scope.obj.SelectedAllergyItem.NDCID = object.NDCID || "";
                        $scope.obj.SelectedAllergyItem.DurationType = 'D';
                        $scope.obj.SelectedAllergyItem.DeleteInd = "N";
                        $scope.obj.SelectedAllergyItem.IsEdit = true;
                        $scope.obj.SelectedAllergyItem.StatusId = 1;
                        $scope.obj.SelectedAllergyItem.StatusName = 'Active';
                        $scope.obj.SelectedAllergyItem.Reaction = '';
                        $scope.obj.SelectedAllergyItem.ShowDateFormat = true;
                        $scope.obj.AllergyItems.push($scope.obj.SelectedAllergyItem);                    
                    }
                    $scope.obj.SelectedAllergyItem = "";

                }
            }
        });



    };
    $scope.addAllergy = function (allergy) {
        allergy = allergy || "";
        if (allergy == '') {
            return false;
        }
        var reqObj = {
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "OrganizationId": $scope.HospitalId,
            //"HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "UserId": doctorinfo.doctorid,
            "AllergyId": 0,
            "AllergyName": allergy,
            "AllergyTypeId": 13,
            "Reaction": "",
            "DeleteInd": false,
            "ModifiedBy": $scope.DisplayName,
            "ModifiedDt": $scope.DisplayDate
        };
        eHnoteDiagnosisDataServices.addAllergy(reqObj).then(function (response) {
            if (response.data.Status === "Success") {
                $scope.onAllergySelect(response.data.rows[0]);
                $scope.ROSHistoriesObj.AddAllergyshow = false;
            }
            if (response.Status === 'Failure') {
                alertify.error(response.data.Message);
            }
        });
    };
    $scope.ChangeAllergy = function (mainitem) {
        angular.forEach($scope.obj.AllergyItems, function (item) {
            item.IsEdit = false;
        })
        mainitem.IsEdit = true;
    }
    $scope.changeReaction = function (item) {
        console.log(item);
        var List = $filter("filter")($scope.ROSAllergyReactions, { "ROSAllergyReactionsId": item.ReactionId }, true);
        if (List.length > 0) {
            item.ReactionName = List[0].AllergyReaction;
        } else {
            item.ReactionName = "";
        }

    }
    $scope.AddAllergiesnotes = function (item) {
        item.ShowNote = true;
    };
    $scope.ChangeSeverity = function (mainitem, item) {
        mainitem.SeverityId = item.ROSAllergiesID;
        mainitem.SeverityName = item.AllergyDescription || '';
    };
    $scope.ChangeStatus = function (mainitem, item) {
        mainitem.StatusId = item.ROSAllergiesID;
    };
    $scope.ChangeAllergyType = function (mainitem, item) {
        mainitem.AllergyTypeId = item.ROSAllergiesID;
    };
    $scope.ClearAllergy = function (Aitem) {
        var index = $scope.obj.AllergyItems.indexOf(Aitem);
        if (Aitem.PatientDetailId == 0) {
            if (index > -1) {
                $scope.obj.AllergyItems.splice(index, 1);
            }
        } else {
            $scope.obj.AllergyItems[index].DeleteInd = 'Y';
        }
        var FreqList = $filter("filter")($scope.FrequentlyAllergyitems, function (fitem) {
            return fitem.AllergyId == Aitem.AllergyId;
        }, true);
        if (FreqList.length > 0) {
            FreqList[0].Onselect = false;
        }
    };

    $scope.ClearSubAllergy = function (item) {
        item.Remarks = "";
        item.Duration = "";
        item.DurationType = "D";
        item.DurationDate = "";
        item.SeverityId = "";
        item.StatusId = "";
        item.StatusName = '';
        item.AllergyTypeId = "";
        item.SnomedCode = "";
        item.SNOMED = "";
        item.ReactionId = "";
        item.ReactionName = '';
    };
    $scope.ChangeOnSetItem = function (item) {
        item.ShowDateFormat = !item.ShowDateFormat;
    };
    $scope.onisNkaSelected = function () {
        var AllergiesArray = $filter("filter")($scope.obj.AllergyItems, { "DeleteInd": "N" }, true);
        if (AllergiesArray.length > 0) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to permanently delete all selected Allergies?", function () {
                if ($scope.obj.isNKASelected) {
                    $scope.obj.isNKDASelected = false;
                    $scope.ROSHistoriesObj.IsRcopia = false;

                    var newArray = [];
                    angular.forEach($scope.obj.AllergyItems, function (item) {

                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = 'Y';
                            newArray.push(item);
                        }
                    });
                    $scope.obj.AllergyItems = angular.copy(newArray);

                    var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "Name": "No Known Allergies" }, true);
                    if (filteredArray.length > 0) {
                        var obj = {
                            "PatientDetailId": 0,
                            "IsShowAllergySnomedAddInd": false,
                            "AllergyId": 1,
                            "AllergyName": "No Known Allergies",
                            "OrganId": 4,
                            "SeverityId": null,
                            "SNOMEDId": null,
                            "RxNormID": null,
                            "SeverityName": '',
                            "ReactionId": null,
                            "StatusId": null,
                            "Duration": null,
                            "AllergyTypeId": null,
                            "IsEdit": false,
                            "ShowNote": false,
                            "ShowDateFormat": false,
                            "ReactionName": '',
                            "DurationDate": '',
                            "StatusName": '',
                            "Remarks": '',
                            "SnomedCode": '',
                            "DurationType": 'D',
                            "OnsetType": 'Date',
                            "DiagnosisObject": 'D',
                            "DeleteInd": 'N',
                            "IsNKASelected": $scope.obj.isNKASelected || false,
                            "IsNKDASelected": false,
                        }
                        $scope.obj.AllergyItems.push(obj);
                    }
                    angular.forEach($scope.FrequentlyAllergyitems, function (item) {
                        item.Onselect = false;
                    });
                } else {
                    $scope.obj.isNKASelected = false;
                    $scope.obj.SelectedAllergyItem = '';
                    $scope.obj.AllergyItems = [];
                    angular.forEach($scope.FrequentlyAllergyitems, function (item) {
                        item.Onselect = false;
                    });
                }
                $scope.$digest();
            }, function () {
                $scope.obj.isNKASelected = false;
                $scope.$digest();
                r = "You pressed Cancel!";
            });
        } else {
            if ($scope.obj.isNKASelected) {
                $scope.obj.isNKDASelected = false;
                $scope.ROSHistoriesObj.IsRcopia = false;

                var newArray = [];
                angular.forEach($scope.obj.AllergyItems, function (item) {

                    if (item.PatientDetailId != 0) {
                        item.DeleteInd = 'Y';
                        newArray.push(item);
                    }
                });
                $scope.obj.AllergyItems = angular.copy(newArray);

                var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "Name": "No Known Allergies" }, true);
                if (filteredArray.length > 0) {
                    var obj = {
                        "PatientDetailId": 0,
                        "IsShowAllergySnomedAddInd": false,
                        "AllergyId": 1,
                        "AllergyName": "No Known Allergies",
                        "OrganId": 4,
                        "SeverityId": null,
                        "SNOMEDId": null,
                        "RxNormID": null,
                        "SeverityName": '',
                        "ReactionId": null,
                        "StatusId": null,
                        "Duration": null,
                        "AllergyTypeId": null,
                        "IsEdit": false,
                        "ShowNote": false,
                        "ShowDateFormat": false,
                        "ReactionName": '',
                        "DurationDate": '',
                        "StatusName": '',
                        "Remarks": '',
                        "SnomedCode": '',
                        "DurationType": 'D',
                        "OnsetType": 'Date',
                        "DiagnosisObject": 'D',
                        "DeleteInd": 'N',
                        "IsNKASelected": $scope.obj.isNKASelected || false,
                        "IsNKDASelected": false,
                    }
                    $scope.obj.AllergyItems.push(obj);
                }
                angular.forEach($scope.FrequentlyAllergyitems, function (item) {
                    item.Onselect = false;
                });
            } else {
                $scope.obj.isNKASelected = false;
                $scope.obj.SelectedAllergyItem = '';
                $scope.obj.AllergyItems = [];
                angular.forEach($scope.FrequentlyAllergyitems, function (item) {
                    item.Onselect = false;
                });
            }
        }
    };
    $scope.onisNkdaSelected = function () {
        var AllergiesArray = $filter("filter")($scope.obj.AllergyItems, { "DeleteInd": "N" }, true);
        if (AllergiesArray.length > 0) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to permanently delete all selected Allergies?", function () {
                if ($scope.obj.isNKDASelected) {
                    $scope.obj.isNKASelected = false;
                    $scope.ROSHistoriesObj.IsRcopia = false;
                    var NkdaArray = [];
                    angular.forEach($scope.obj.AllergyItems, function (item) {
                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = 'Y';
                            NkdaArray.push(item);
                        }
                    });
                    $scope.obj.AllergyItems = angular.copy(NkdaArray);
                    var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "Name": "No Known Drug Allergies" }, true);
                    if (filteredArray.length > 0) {
                        var obj = {
                            "PatientDetailId": 0,
                            "IsShowAllergySnomedAddInd": false,
                            "AllergyId": 2,
                            "AllergyName": "No Known Drug Allergies",
                            "OrganId": 4,
                            "SeverityId": null,
                            "SNOMEDId": null,
                            "RxNormID": null,
                            "SeverityName": '',
                            "ReactionId": null,
                            "StatusId": null,
                            "Duration": null,
                            "AllergyTypeId": null,
                            "IsEdit": false,
                            "ShowNote": false,
                            "ShowDateFormat": false,
                            "ReactionName": '',
                            "DurationDate": '',
                            "StatusName": '',
                            "Remarks": '',
                            "SnomedCode": '',
                            "DurationType": 'D',
                            "OnsetType": 'Date',
                            "DiagnosisObject": 'D',
                            "DeleteInd": 'N',
                            "IsNKASelected": false,
                            "IsNKDASelected": $scope.obj.isNKDASelected || false,
                        }
                        $scope.obj.AllergyItems.push(obj);
                    }
                    angular.forEach($scope.FrequentlyAllergyitems, function (item) {
                        item.Onselect = false;
                    });
                } else {
                    $scope.obj.isNKDASelected = false;
                    $scope.obj.SelectedAllergyItem = '';
                    $scope.obj.AllergyItems = [];
                    angular.forEach($scope.FrequentlyAllergyitems, function (item) {
                        item.Onselect = false;
                    });
                }
                $scope.$digest();
            }, function () {
                $scope.obj.isNKDASelected = false;
                $scope.$digest();
                r = "You pressed Cancel!";
            });
        } else {
            if ($scope.obj.isNKDASelected) {
                $scope.obj.isNKASelected = false;
                $scope.ROSHistoriesObj.IsRcopia = false;
                var NkdaArray = [];
                angular.forEach($scope.obj.AllergyItems, function (item) {
                    if (item.PatientDetailId != 0) {
                        item.DeleteInd = 'Y';
                        NkdaArray.push(item);
                    }
                });
                $scope.obj.AllergyItems = angular.copy(NkdaArray);
                var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "Name": "No Known Drug Allergies" }, true);
                if (filteredArray.length > 0) {
                    var obj = {
                        "PatientDetailId": 0,
                        "IsShowAllergySnomedAddInd": false,
                        "AllergyId": 2,
                        "AllergyName": "No Known Drug Allergies",
                        "OrganId": 4,
                        "SeverityId": null,
                        "SNOMEDId": null,
                        "RxNormID": null,
                        "SeverityName": '',
                        "ReactionId": null,
                        "StatusId": null,
                        "Duration": null,
                        "AllergyTypeId": null,
                        "IsEdit": false,
                        "ShowNote": false,
                        "ShowDateFormat": false,
                        "ReactionName": '',
                        "DurationDate": '',
                        "StatusName": '',
                        "Remarks": '',
                        "SnomedCode": '',
                        "DurationType": 'D',
                        "OnsetType": 'Date',
                        "DiagnosisObject": 'D',
                        "DeleteInd": 'N',
                        "IsNKASelected": false,
                        "IsNKDASelected": $scope.obj.isNKDASelected || false,
                    }
                    $scope.obj.AllergyItems.push(obj);
                }
                angular.forEach($scope.FrequentlyAllergyitems, function (item) {
                    item.Onselect = false;
                });
            } else {
                $scope.cacheStorageItem.isNKDASelected = false;
                $scope.obj.SelectedAllergyItem = '';
                $scope.obj.AllergyItems = [];
                angular.forEach($scope.FrequentlyAllergyitems, function (item) {
                    item.Onselect = false;
                });
            }
        }
    };
    $scope.onisNKSGHSelected = function () {
        if ($scope.obj.SurgicalHistoryArray.length > 0) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to permanently delete all selected SurgicalHistory?", function () {
                if ($scope.obj.isNKSGHSelected) {
                    var newArray = [];
                    angular.forEach($scope.obj.SurgicalHistoryArray, function (item) {
                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = 'Y';
                            newArray.push(item);
                        }
                    });
                    $scope.obj.SurgicalHistoryArray = angular.copy(newArray);
                    var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "TypeName": "SurgicalHistory" }, true);
                    if (filteredArray.length > 0) {
                        var object = {
                            "PatientDetailId": 0,
                            "HistoryId": filteredArray[0].Id || null,
                            "HistoryName": filteredArray[0].Name || '',
                            "IsEdit": false,
                            "showSurgicalHistory": false,
                            "ActiveInd": true,
                            "DeleteInd": 'N',
                            "DurationDate": "",
                            "Duration": "",
                            "DurationType": "D",
                            "DurationTypeName": "Day(s)",
                            "Remarks": "",
                            "ShowDateFormat": false,
                            "ShowNote": false,
                            "ModifierId": "",
                            "MODIFIERCODE": "",
                            "ModifierObj": "",
                            "CPTCode": "",
                            "ProcedureId": "",
                            "CPTObj": "",
                            "ShowDateFormat": false,
                            "isNKSGHSelected": $scope.obj.isNKSGHSelected || false,
                        };
                        $scope.obj.SurgicalHistoryArray.push(object);
                        $scope.$digest();
                    }
                    angular.forEach($scope.FrequentlySurgicalHistory, function (item) {
                        item.Onselect = false;
                    });
                }
            },
                function () {
                    $scope.obj.isNKSGHSelected = false;
                    $scope.$digest();
                    r = "You pressed Cancel!";
                });

        }
        else {
            if ($scope.obj.isNKSGHSelected) {
                var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "TypeName": "SurgicalHistory" }, true);
                if (filteredArray.length > 0) {
                    var object = {
                        "PatientDetailId": 0,
                        "HistoryId": filteredArray[0].Id || null,
                        "HistoryName": filteredArray[0].Name || '',
                        "IsEdit": false,
                        "showSurgicalHistory": false,
                        "ActiveInd": true,
                        "DeleteInd": 'N',
                        "DurationDate": "",
                        "Duration": "",
                        "DurationType": "D",
                        "DurationTypeName": "Day(s)",
                        "Remarks": "",
                        "ShowDateFormat": false,
                        "ShowNote": false,
                        "ModifierId": "",
                        "MODIFIERCODE": "",
                        "ModifierObj": "",
                        "CPTCode": "",
                        "ProcedureId": "",
                        "CPTObj": "",
                        "ShowDateFormat": false,
                        "isNKSGHSelected": $scope.obj.isNKSGHSelected || false,
                    };
                    $scope.obj.SurgicalHistoryArray.push(object);
                }
                angular.forEach($scope.FrequentlySurgicalHistory, function (item) {
                    item.Onselect = false;
                });
            }
        }
    }

    $scope.GetAllergyListUsingFocus = function () {
        $scope.FocusObj.AllergiesFocus = true;
    }


    // SurgicalHistory
    $scope.AddNewSurgicalHistory = function (SelectedSurgicalHistory) {
        SelectedSurgicalHistory = SelectedSurgicalHistory || "";
        if (SelectedSurgicalHistory === "") {
            alertify.error("Enter SurgicalHistory");
            return;
        }
        var object = {
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "OrganizationId": $scope.HospitalId,
            //"HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "UserId": doctorinfo.doctorid,
            "DeleteInd": false,
            "HistoryName": SelectedSurgicalHistory,
            "HistoryId": 0
        };
        eHnoteSettingsDataService.AddUpdateMasterSurgicalHistory(object).success(function (response) {
            if (response.Status === "Success") {
                if (response.count > 0) {
                    $scope.SelectedSurgicalHistory = "";
                    SelectedSurgicalHistory = "";
                    $scope.onRosSurgicalHistoryBlurChange(response.SurgicalHistory[0]);
                    $scope.ROSHistoriesObj.AddSurgicalHistory = false;
                    alertify.success("Successfully Added");
                }
            }
            if (response.Status === 'Failure') {
                alertify.error(response.Message);
                $scope.SelectedSurgicalHistory = "";
                SelectedSurgicalHistory = "";
            }
        })
            .error(function (error) {
                alertify.error("Error Occured");
            });
    };
    $scope.GetMasterSurgicalHistory = function (val, type) {
        var params = {
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "OrganizationId": $scope.HospitalId,
            //"HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "UserId": doctorinfo.doctorid,
            "NotesTypeId": 1,
            "HistoryId": 0,
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": val,
            "Type": '',
            "IsFrequent": "N"
        };
        if (params.SearchText == "") {
            params.IsFrequent = "Y";
        }


        return eHnoteSettingsDataService.GetMasterSurgicalHistory(params).then(function (resp) {
            if (resp.data.count !== 0) {
                if (resp.data.SurgicalHistory !== undefined) {
                    $scope.ROSHistoriesObj.AddSurgicalHistory = false;
                    return resp.data.SurgicalHistory.map(function (item) {
                        return item;
                    });
                } else {
                    $scope.ROSHistoriesObj.AddSurgicalHistory = true;
                }
            } else {
                $scope.ROSHistoriesObj.AddSurgicalHistory = false;
                if (val != '') {
                    $scope.ROSHistoriesObj.AddSurgicalHistory = true;
                }
            }
        });
    };
    $scope.onRosSurgicalHistoryBlurChange = function (surgicalHistory) {

        if ($scope.obj.isNKSGHSelected) {
            angular.forEach($scope.obj.SurgicalHistoryArray, function (item) {
                var List = $filter("filter")($scope.obj.SurgicalHistoryArray, function (fitem) {
                    return fitem.HistoryId === 1;
                }, true);
                if (List.length > 0) {
                    if (List[0].PatientDetailId === 0) {
                        var indexToRemove = $scope.obj.SurgicalHistoryArray.indexOf(List[0]);
                        if (indexToRemove !== -1) {
                            $scope.obj.SurgicalHistoryArray.splice(indexToRemove, 1);
                        }
                    } else {
                        List[0].DeleteInd = 'Y';
                    }
                }
                item.isNKSGHSelected = false
                $scope.obj.isNKSGHSelected = false
            });

        }

        if (surgicalHistory.HistoryId === '') {
            surgicalHistory.HistoryName = '';
            $scope.obj.SurgicalHistoryItem = '';
            return false;
        }
        angular.forEach($scope.FrequentlySurgicalHistory, function (item) {
            if (item.HistoryId === surgicalHistory.HistoryId && item.DeleteInd == 'N') {
                item.Onselect = true;
            }
        });
        $scope.obj.SurgicalHistoryItem = surgicalHistory;
        var i = 0;
        $scope.obj.SurgicalHistoryItem = $scope.obj.SurgicalHistoryItem || "";
        if ($scope.obj.SurgicalHistoryItem === "") {
            return;
        }
        if ($scope.obj.SurgicalHistoryArray.length !== 0) {
            angular.forEach($scope.obj.SurgicalHistoryArray, function (item) {
                item.IsEdit = false;
            });
        }
        if (angular.isObject($scope.obj.SurgicalHistoryItem)) {
            var object = {
                "PatientDetailId": 0,
                "HistoryId": $scope.obj.SurgicalHistoryItem.HistoryId,
                "HistoryName": $scope.obj.SurgicalHistoryItem.HistoryName,
                "IsEdit": true,
                "showSurgicalHistory": false,
                "ActiveInd": true,
                "DeleteInd": "N",
                //"OrganId": $scope.obj.SurgicalHistoryItem || "",
                "DurationDate": $scope.obj.SurgicalHistoryItem.DurationDate || "",
                "Duration": $scope.obj.SurgicalHistoryItem.Duration || "",
                "DurationType": $scope.obj.SurgicalHistoryItem.DurationType || "D",
                "DurationTypeName": $scope.obj.SurgicalHistoryItem.DurationTypeName || "Day(s)",
                "Remarks": $scope.obj.SurgicalHistoryItem.Remarks || "",
                "ShowDateFormat": true,
                "ShowNote": false,
                "ModifierId": "",
                "MODIFIERCODE": "",
                "ModifierObj": "",
                "CPTCode": $scope.obj.SurgicalHistoryItem.CPTCode || "",
                "ProcedureId": $scope.obj.SurgicalHistoryItem.ProcedureId || "",
                "CPTObj": $scope.obj.SurgicalHistoryItem.CPTCode || "",
                "ModifiedDt": $filter('date')(new Date(), "yyyy-MM-dd")
            };
        } else {
            var object = {
                "PatientDetailId": 0,
                "HistoryId": 0,
                "HistoryName": $scope.obj.SurgicalHistoryItem,
                "IsEdit": true,
                "showSurgicalHistory": false,
                "ActiveInd": true,
                "DeleteInd": "N",
                "DurationDate": $scope.obj.SurgicalHistoryItem.DurationDate || "",
                "Duration": $scope.obj.SurgicalHistoryItem.Duration || "",
                "DurationType": $scope.obj.SurgicalHistoryItem.DurationType || "D",
                "DurationTypeName": $scope.obj.SurgicalHistoryItem.DurationTypeName || "Day(s)",
                "Remarks": $scope.obj.SurgicalHistoryItem.Remarks || "",
                "ShowDateFormat": true,
                "ShowNote": false,
                "ModifierId": "",
                "MODIFIERCODE": "",
                "ModifierObj": "",
                "CPTCode": "",
                "ProcedureId": "",
                "CPTObj": "",
                "ModifiedDt": $filter('date')(new Date(), "yyyy-MM-dd")
            };
        }

        var i = 0;
        if ($scope.obj.SurgicalHistoryArray.length > 0) {
            angular.forEach($scope.obj.SurgicalHistoryArray, function (item) {
                if (item.HistoryId === object.HistoryId && item.DeleteInd == 'N') {
                    alertify.error('You have already entered this Surgical history');
                    $scope.obj.SurgicalHistoryItem = "";
                    i++;
                }
            });
        }
        if ($scope.obj.SurgicalHistoryArray.length !== 0) {
            var List = $filter("filter")($scope.obj.SurgicalHistoryArray, { "HistoryId": 1 }, true);
            if (List.length > 0) {
                if (List[0].PatientDetailId === 0) {
                    var indexToRemove = $scope.obj.SurgicalHistoryArray.indexOf(List[0]);
                    if (indexToRemove !== -1) {
                        $scope.obj.SurgicalHistoryArray.splice(indexToRemove, 1);
                    }
                } else {
                    List[0].DeleteInd = 'Y';
                }
            }
            angular.forEach($scope.obj.SurgicalHistoryArray, function (item, index) {
                item.IsEdit = false;
                /*if (index == 0) { item.IsEdit = true; }*/
            });
        }
        if (i === 0) {
            object.GeneralPatientHistoryId = 0;
            $scope.obj.SurgicalHistoryItem.DeleteInd = "N";
            $scope.obj.SurgicalHistoryArray.push(object);
            $scope.obj.SurgicalHistoryItem = "";
        }

    };
    $scope.AddSurgicalHistorynotes = function (item) {
        item.ShowNote = true;
    };
    $scope.ClearSubSurgicalHistory = function (item) {
        item.Remarks = "";
        item.Duration = "";
        item.DurationType = "D";
        item.DurationDate = "";
        item.Modifier = "";
        item.CPTObj = "";
        item.ModifierObj = "";
    };
    $scope.ChangeSurgicalHistory = function (mainitem) {
        angular.forEach($scope.obj.SurgicalHistoryArray, function (item) {
            item.IsEdit = false;
        })
        mainitem.IsEdit = true;
    }
    $scope.onclickSurgicalCptCode = function (mainitem) {
        mainitem.CPTCode = mainitem.CPTObj.CPTCode;
        mainitem.ProcedureId = mainitem.CPTObj.ProcedureId;
    };
    $scope.changeSurgicalModifier = function (mainitem) {
        mainitem.ModifierObj = mainitem.ModifierObj || "";
        if (mainitem.ModifierObj != "") {
            mainitem.MODIFIERCODE = mainitem.ModifierObj.MODIFIERCODE;
            mainitem.ModifierId = mainitem.ModifierObj.MODIFIERID;
        }
    }
    $scope.DeleteSurgicalHistory = function (sitem) {
        var index = $scope.obj.SurgicalHistoryArray.indexOf(sitem);
        if (sitem.PatientDetailId === 0) {
            if (index > -1) {
                $scope.obj.SurgicalHistoryArray.splice(index, 1);
            }
        } else {
            $scope.obj.SurgicalHistoryArray[index].DeleteInd = 'Y';
        }
        var FreqList = $filter("filter")($scope.FrequentlySurgicalHistory, function (fitem) {
            return fitem.HistoryId == sitem.HistoryId;
        }, true) || [];
        if (FreqList.length > 0) {
            FreqList[0].Onselect = false;
        }
    };
    /* Surgical History End*/


    //curent systamic//
    $scope.GetOrganizationMedicationlist = function (val) {

        var req = {
            "HospitalId": $scope.HospitalId,
            "PageSize": 10,
            "SearchText": val || '',
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "IsFrequent": "N",
            "ParentOrganizationId": $scope.ParenthospitalId || null
        };
        if (req.SearchKey == "") {
            req.IsFrequent = "Y";
        }

        return eHnoteConditionsDataService.GetOrganizationMedications(req).then(function (resp) {
            if (resp.data.count !== 0) {

                if (resp.data.MedicineList !== undefined) {
                    return resp.data.MedicineList.map(function (item) {
                        return item;
                    });
                }
            }
        });
    };
    $scope.onRosCurrentSystemicMedicationsHistorylist = function (CurrentSystemicMedicationsHistory, MedId) {
        $scope.SigSearch.Shows = false;

        CurrentSystemicMedicationsHistory.SigFields = false;
        if (CurrentSystemicMedicationsHistory.MedicineId === '') {
            CurrentSystemicMedicationsHistory.MedicineName = '';
            $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem = '';
            return false;
        }
        $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem = CurrentSystemicMedicationsHistory;
        var i = 0;
        $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem = $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem || "";
        if ($scope.obj.SelectedCurrentSystemicMedicationsHistoryItem === "") {
            return;
        }

        var locationtype = "";
        var medicationhistory = "";
        medicationhistory = MedId == 1 ? "CurrentEyeMedication" : "CurrentSystemicMedication";
        locationtype = MedId == 1 ? "Eye" : "General";

        if (angular.isObject($scope.obj.SelectedCurrentSystemicMedicationsHistoryItem)) {
            var object = {
                "CurrentSystemicMedicationId": 0,
                "HospitalId": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.OrganizationId,
                "MedicineId": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.MedicineId,
                "MedicineType": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.MedicineType,
                "MedicineTypeId": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.MedicineTypeId,
                "MedicineName": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.MedicineName,
                "MedicineObject": "",
                "RcopiaDrugId": "",
                "RcopiaMedicationId": 0,
                "MedicationName": "",
                "DrugNDCID": "",
                "DrugFirstDataBankMedID": "",
                "DrugGenericId": "",
                "DrugBrandName": "",
                "DrugGenericName": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.GenericName,
                "DrugForm": "",
                "DrugStrength": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.Strength,
                "DrugSchedule": "",
                "DrugSupply": "",
                "DrugCompound": "",
                "MedicationTypeId": "",
                "MedicationTypeName": "",
                "Sig": "",
                "SigId": 0,
                "ActionId": "",
                "Action": "",
                "DoseId": "",
                "Dose": "",
                "DoseUnitId": "",
                "DoseUnit": "",
                "RouteId": "",
                "Route": "",
                "FrequencyId": "",
                "Frequency": "",
                "DoseOtherId": "",
                "DoseOther": "",
                "DaysSupplyId": "",
                "DaysSupply": "",
                "Quantity": "",
                "QuantityUnitId": "",
                "QuantityUnit": "",
                "RefillId": "",
                "Refills": "",
                "SubstitutionPermitted": "y",
                "PatientInstructions": "",
                "DeleteInd": "N",
                "OtherNotes": "",
                "Remarks": "",
                "StartDate": null,
                "StopDate": null,
                "FillDate": '',
                "StopReason": "",
                "RcopiaMedicationStatus": "",
                "IsEdit": true,
                "ShowNote": false,
                //"RxNormList": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.RxNormList || [],
                "RXNormId": 0,
                "IsMedicationStopped": false,
                "SelectedMedicationHistory": medicationhistory,
                "MedicationLocationType": locationtype,
                "MedicationLocationTypeId": MedId
            };
            if ($scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.RxNormList.length > 0) {
                object.RXNormId = $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.RxNormList[0].RXNormId;
            }
        }
        var i = 0;
        if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
            angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (item) {
                if (item.MedicineId === object.MedicineId && item.DeleteInd === 'N') {
                    alertify.error('You have already entered this Current Systemic Medications history');
                    $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem = "";
                    i++;
                }
            });
        }
        if ($scope.obj.CurrentSystemicMedicationsHistory.length !== 0 && MedId == 2) {
            var List = $filter("filter")($scope.obj.CurrentSystemicMedicationsHistory, { "MedicineId": 2 }, true) || [];
            if (List.length > 0) {
                if (List[0].CurrentSystemicMedicationId === 0) {
                    var indexToRemove = $scope.obj.CurrentSystemicMedicationsHistory.indexOf(List[0]);
                    if (indexToRemove !== -1) {
                        $scope.obj.CurrentSystemicMedicationsHistory.splice(indexToRemove, 1);
                    }
                } else {
                    List[0].DeleteInd = 'Y';
                }
            }
            $scope.obj.isNKCSMSelected = false;
            angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (item) {
                item.IsEdit = false;
            });
        } else {
            var List = $filter("filter")($scope.obj.CurrentSystemicMedicationsHistory, { "MedicineId": 1 }, true) || [];
            if (List.length > 0) {
                if (List[0].CurrentSystemicMedicationId === 0) {
                    var indexToRemove = $scope.obj.CurrentSystemicMedicationsHistory.indexOf(List[0]);
                    if (indexToRemove !== -1) {
                        $scope.obj.CurrentSystemicMedicationsHistory.splice(indexToRemove, 1);
                    }
                } else {
                    List[0].DeleteInd = 'Y';
                }
            }
            $scope.obj.isNKCEMSelected = false;
            angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (item) {
                item.IsEdit = false;
            });
        }

        if (i === 0) {
            $scope.obj.CurrentSystemicMedicationsHistory.unshift(object);
            $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem = "";
        }
    };
    $scope.ONSelectCurrentSystemRcopia = function (CurrentSystemicMedicationsHistory, MedId) {


        $scope.SigSearch.Shows = false;

        //CurrentSystemicMedicationsHistory.SigFields = false;
        //if (CurrentSystemicMedicationsHistory.MedicineId === '') {
        //    CurrentSystemicMedicationsHistory.MedicineName = '';
        //    $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem = '';
        //    return false;
        //}
        $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem = CurrentSystemicMedicationsHistory;
        var i = 0;
        $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem = $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem || "";
        if ($scope.obj.SelectedCurrentSystemicMedicationsHistoryItem === "") {
            return;
        }


        var locationtype = "";
        var medicationhistory = "";
        medicationhistory = MedId == 1 ? "CurrentEyeMedication" : "CurrentSystemicMedication";
        locationtype = MedId == 1 ? "Eye" : "General";

        if (angular.isObject($scope.obj.SelectedCurrentSystemicMedicationsHistoryItem)) {
            var object = {
                "CurrentSystemicMedicationId": 0,
                "HospitalId": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.OrganizationId,
                "MedicineId": 0,
                "MedicineType": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.BrandName,
                "MedicineTypeId": 0,
                "MedicineName": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.BrandName,
                "MedicineObject": "",
                "RcopiaDrugId": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.RcopiaDrugId,
                "RcopiaMedicationId": 0,
                "MedicationName": "",
                "DrugNDCID": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.RcopiaDrugNDCID,
                "DrugFirstDataBankMedID": "",
                "DrugGenericId": "",
                "DrugBrandName": "",
                "DrugGenericName": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.GenericName,
                "DrugForm": "",
                "DrugStrength": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.Strength,
                "DrugSchedule": "",
                "DrugSupply": "",
                "DrugCompound": "",
                "MedicationTypeId": "",
                "MedicationTypeName": "",
                "Sig": "",
                "SigId": 0,
                "ActionId": "",
                "Action": "",
                "DoseId": "",
                "Dose": "",
                "DoseUnitId": "",
                "DoseUnit": "",
                "RouteId": "",
                "Route": "",
                "FrequencyId": "",
                "Frequency": "",
                "DoseOtherId": "",
                "DoseOther": "",
                "DaysSupplyId": "",
                "DaysSupply": "",
                "Quantity": "",
                "QuantityUnitId": "",
                "QuantityUnit": "",
                "RefillId": "",
                "Refills": "",
                "SubstitutionPermitted": "y",
                "PatientInstructions": "",
                "DeleteInd": "N",
                "OtherNotes": "",
                "Remarks": "",
                "StartDate": null,
                "StopDate": null,
                "FillDate": '',
                "StopReason": "",
                "RcopiaMedicationStatus": "",
                "IsEdit": true,
                "ShowNote": false,
                "IsMedicationStopped": false,
                "SelectedMedicationHistory": medicationhistory,
                "MedicationLocationType": locationtype,
                "MedicationLocationTypeId": MedId
            };
        }

        var mparams = {
            "UserId": $scope.UserId,
            "MedicineId": 0,
            "RcopiaDrugId": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.RcopiaDrugId,
            "DrugNDCID": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.RcopiaDrugNDCID,
            "FirstDataBankMedID": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.FirstDataBankMedID,
            "DrugGenericID": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.GenericID,
            "DrugName": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.BrandName,
            "GenericName": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.GenericName,
            "MedicineType": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.Form,
            "Strength": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.Strength,
            "Schedule": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.Schedule,
            "RouteCode": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.RouteCode,
            "RxNormList": []
        }

        if ($scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.RxNormList.length > 0) {
            var filteredRxNorm = $filter("filter")($scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.RxNormList, { "Status": 'a' }, true) || [];
            if (filteredRxNorm.length > 0) {
                $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem = filteredRxNorm[0].RxnormID;
                var rxNormObj = {
                    "MedicineRxNormsId": 0,
                    "RxnormID": filteredRxNorm[0].RxnormID,
                    "RxnormIDType": filteredRxNorm[0].RxnormIDType,
                    "Status": "a",
                    "Representative": "y"
                }

                mparams.RxNormList.push(rxNormObj)
            }
        }

        console.log(mparams);


        eHnoteDiagnosisDataServices.UpdateFirstBankMasterDrugDetails(mparams).then(function (response) {

            if (response.data.status === 'Success') {

                object.MedicineId = response.data.MedicineId;
                var i = 0;
                if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
                    angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (item) {
                        if (item.MedicineId === object.MedicineId && item.DeleteInd === 'N') {
                            alertify.error('You have already entered this Current Systemic Medications history');
                            $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem = "";
                            i++;
                        }
                    });
                }
                if ($scope.obj.CurrentSystemicMedicationsHistory.length !== 0) {
                    var List = $filter("filter")($scope.obj.CurrentSystemicMedicationsHistory, { "MedicineId": 1 }, true);
                    if (List.length > 0) {
                        if (List[0].PatientDetailId === 0) {
                            var indexToRemove = $scope.obj.CurrentSystemicMedicationsHistory.indexOf(List[0]);
                            if (indexToRemove !== -1) {
                                $scope.obj.CurrentSystemicMedicationsHistory.splice(indexToRemove, 1);
                            }
                        } else {
                            List[0].DeleteInd = 'Y';
                        }
                    }
                    $scope.obj.isNKCSMSelected = false;
                    angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (item) {
                        item.IsEdit = false;
                    });
                }
                if (i === 0) {
                    $scope.obj.CurrentSystemicMedicationsHistory.unshift(object);
                    $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem = "";
                }

            }
        });


    }
    $scope.GetDrugDataListFromRcopia = function (val) {
        var searchvalue = val || "";
        if (searchvalue != "") {
            var req = {
                "VendorName": "Appolo Pharmacy",
                "VendorPassword": "abc123",
                "searchText": searchvalue,
                "Maximum": 20,
                "UserId": $scope.UserId || null,
                "OrganizationId": $scope.HospitalId || null,
                "SearchType": "search_drug_detail",
                "RcopiaVendorAccountName": doctorInfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                "RcopiaVendorAccountPassword": doctorInfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                "RcopiaPracticeId": doctorInfo.doctordata.UserAddress[0].RcopiaPracticeId
            }
            return eHnoteConditionsDataService.getDrugDetailDataFromRcopia(req).then(function (resp) {
                if (resp.data.DrugDetailsList !== undefined) {
                    return resp.data.DrugDetailsList.map(function (item) {
                        return item;
                    });
                }
            });
        }
    }

    $scope.onisNKCEMSelected = function () {

        if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to permanently delete all selected CurrentEyeMedication?", function () {
                if ($scope.obj.isNKCEMSelected) {

                    var filteredEyeArray = $filter("filter")($scope.obj.CurrentSystemicMedicationsHistory, { "MedicationLocationTypeId": 1 }, true);

                    angular.forEach(filteredEyeArray, function (item) {
                        if (item.CurrentSystemicMedicationId != 0) {
                            item.DeleteInd = 'Y';
                        } else {
                            var indexToRemove = $scope.obj.CurrentSystemicMedicationsHistory.indexOf(item);
                            if (indexToRemove !== -1) {
                                $scope.obj.CurrentSystemicMedicationsHistory.splice(indexToRemove, 1);
                            }
                        }
                    });

                    var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "TypeName": "CurrentEyeMedications" }, true);
                    if (filteredArray.length > 0) {
                        var object = {
                            "CurrentSystemicMedicationId": 0,
                            "HospitalId": $scope.HospitalId,
                            "MedicineId": filteredArray[0].Id || null,
                            "MedicineType": "",
                            "MedicineTypeId": 0,
                            "MedicineName": filteredArray[0].Name || '',
                            "MedicineObject": "",
                            "RcopiaDrugId": "",
                            "RcopiaMedicationId": 0,
                            "MedicationName": "",
                            "DrugNDCID": "",
                            "DrugFirstDataBankMedID": "",
                            "DrugGenericId": "",
                            "DrugBrandName": "",
                            "DrugGenericName": "",
                            "DrugForm": "",
                            "DrugStrength": "",
                            "DrugSchedule": "",
                            "DrugSupply": "",
                            "DrugCompound": "",
                            "MedicationTypeId": "",
                            "MedicationTypeName": "",
                            "Sig": "",
                            "SigId": 0,
                            "ActionId": "",
                            "Action": "",
                            "DoseId": "",
                            "Dose": "",
                            "DoseUnitId": "",
                            "DoseUnit": "",
                            "RouteId": "",
                            "Route": "",
                            "FrequencyId": "",
                            "Frequency": "",
                            "DoseOtherId": "",
                            "DoseOther": "",
                            "DaysSupplyId": "",
                            "DaysSupply": "",
                            "Quantity": "",
                            "QuantityUnitId": "",
                            "QuantityUnit": "",
                            "RefillId": "",
                            "Refills": "",
                            "SubstitutionPermitted": "y",
                            "PatientInstructions": "",
                            "DeleteInd": "N",
                            "OtherNotes": "",
                            "Remarks": "",
                            "StartDate": null,
                            "StopDate": null,
                            "FillDate": '',
                            "StopReason": "",
                            "RcopiaMedicationStatus": "",
                            "IsEdit": false,
                            "ShowNote": false,
                            "isNKCEMSelected": $scope.obj.isNKCEMSelected || false,
                            "IsMedicationStopped": false,
                            "SelectedMedicationHistory": "CurrentEyeMedication",
                            "MedicationLocationType": "Eye",
                            "MedicationLocationTypeId": 1
                        };
                        $scope.obj.CurrentSystemicMedicationsHistory.push(object);
                        $scope.$digest();
                    }
                }
            },
                function () {
                    $scope.obj.isNKCEMSelected = false;
                    $scope.$digest();
                    r = "You pressed Cancel!";
                });

        }
        else {
            if ($scope.obj.isNKCEMSelected) {
                var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "TypeName": "CurrentEyeMedications" }, true);
                if (filteredArray.length > 0) {
                    var object = {
                        "CurrentSystemicMedicationId": 0,
                        "HospitalId": $scope.HospitalId,
                        "MedicineId": filteredArray[0].Id || null,
                        "MedicineType": "",
                        "MedicineTypeId": 0,
                        "MedicineName": filteredArray[0].Name || '',
                        "MedicineObject": "",
                        "RcopiaDrugId": "",
                        "RcopiaMedicationId": 0,
                        "MedicationName": "",
                        "DrugNDCID": "",
                        "DrugFirstDataBankMedID": "",
                        "DrugGenericId": "",
                        "DrugBrandName": "",
                        "DrugGenericName": "",
                        "DrugForm": "",
                        "DrugStrength": "",
                        "DrugSchedule": "",
                        "DrugSupply": "",
                        "DrugCompound": "",
                        "MedicationTypeId": "",
                        "MedicationTypeName": "",
                        "Sig": "",
                        "SigId": 0,
                        "ActionId": "",
                        "Action": "",
                        "DoseId": "",
                        "Dose": "",
                        "DoseUnitId": "",
                        "DoseUnit": "",
                        "RouteId": "",
                        "Route": "",
                        "FrequencyId": "",
                        "Frequency": "",
                        "DoseOtherId": "",
                        "DoseOther": "",
                        "DaysSupplyId": "",
                        "DaysSupply": "",
                        "Quantity": "",
                        "QuantityUnitId": "",
                        "QuantityUnit": "",
                        "RefillId": "",
                        "Refills": "",
                        "SubstitutionPermitted": "y",
                        "PatientInstructions": "",
                        "DeleteInd": "N",
                        "OtherNotes": "",
                        "Remarks": "",
                        "StartDate": null,
                        "StopDate": null,
                        "FillDate": '',
                        "StopReason": "",
                        "RcopiaMedicationStatus": "",
                        "IsEdit": false,
                        "ShowNote": false,
                        "isNKCEMSelected": $scope.obj.isNKCEMSelected || false,
                        "IsMedicationStopped": false,
                        "SelectedMedicationHistory": "CurrentEyeMedication",
                        "MedicationLocationType": "Eye",
                        "MedicationLocationTypeId": 1
                    };
                    $scope.obj.CurrentSystemicMedicationsHistory.push(object);
                }
            }
        }
    }

    $scope.onisNKCSMSelected = function () {
        if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to permanently delete all selected CurrentSystemicMedications?", function () {
                if ($scope.obj.isNKCSMSelected) {

                    var filteredEyeArray = $filter("filter")($scope.obj.CurrentSystemicMedicationsHistory, { "MedicationLocationTypeId": 2 }, true);

                    angular.forEach(filteredEyeArray, function (item) {
                        if (item.CurrentSystemicMedicationId != 0) {
                            item.DeleteInd = 'Y';
                        } else {
                            var indexToRemove = $scope.obj.CurrentSystemicMedicationsHistory.indexOf(item);
                            if (indexToRemove !== -1) {
                                $scope.obj.CurrentSystemicMedicationsHistory.splice(indexToRemove, 1);
                            }
                        }
                    });

                    var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "TypeName": "CurrentSystemicMedications" }, true);
                    if (filteredArray.length > 0) {
                        var object = {
                            "CurrentSystemicMedicationId": 0,
                            "HospitalId": $scope.HospitalId,
                            "MedicineId": filteredArray[0].Id || null,
                            "MedicineType": "",
                            "MedicineTypeId": null,
                            "MedicineName": filteredArray[0].Name || '',
                            "MedicineObject": "",
                            "RcopiaDrugId": "",
                            "RcopiaMedicationId": 0,
                            "MedicationName": "",
                            "DrugNDCID": "",
                            "DrugFirstDataBankMedID": "",
                            "DrugGenericId": "",
                            "DrugBrandName": "",
                            "DrugGenericName": "",
                            "DrugForm": "",
                            "DrugStrength": "",
                            "DrugSchedule": "",
                            "DrugSupply": "",
                            "DrugCompound": "",
                            "MedicationTypeId": "",
                            "MedicationTypeName": "",
                            "Sig": "",
                            "SigId": 0,
                            "ActionId": "",
                            "Action": "",
                            "DoseId": "",
                            "Dose": "",
                            "DoseUnitId": "",
                            "DoseUnit": "",
                            "RouteId": "",
                            "Route": "",
                            "FrequencyId": "",
                            "Frequency": "",
                            "DoseOtherId": "",
                            "DoseOther": "",
                            "DaysSupplyId": "",
                            "DaysSupply": "",
                            "Quantity": null,
                            "QuantityUnitId": "",
                            "QuantityUnit": "",
                            "RefillId": "",
                            "Refills": "",
                            "SubstitutionPermitted": "y",
                            "PatientInstructions": "",
                            "DeleteInd": "N",
                            "OtherNotes": "",
                            "Remarks": "",
                            "StartDate": null,
                            "StopDate": null,
                            "FillDate": '',
                            "StopReason": "",
                            "RcopiaMedicationStatus": "",
                            "IsEdit": false,
                            "ShowNote": false,
                            "isNKCSMSelected": $scope.obj.isNKCSMSelected || false,
                            "IsMedicationStopped": false,
                            "SelectedMedicationHistory": "CurrentSystemicMedication",
                            "MedicationLocationType": "General",
                            "MedicationLocationTypeId": 2
                        };
                        $scope.obj.CurrentSystemicMedicationsHistory.push(object);
                        $scope.$digest();
                    }
                }
            },
                function () {
                    $scope.obj.isNKCSMSelected = false;
                    $scope.$digest();
                    r = "You pressed Cancel!";
                });

        }
        else {
            if ($scope.obj.isNKCSMSelected) {
                var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "TypeName": "CurrentSystemicMedications" }, true);
                if (filteredArray.length > 0) {
                    var object = {
                        "CurrentSystemicMedicationId": 0,
                        "HospitalId": $scope.HospitalId,
                        "MedicineId": filteredArray[0].Id || null,
                        "MedicineType": "",
                        "MedicineTypeId": null,
                        "MedicineName": filteredArray[0].Name || '',
                        "MedicineObject": "",
                        "RcopiaDrugId": "",
                        "RcopiaMedicationId": 0,
                        "MedicationName": "",
                        "DrugNDCID": "",
                        "DrugFirstDataBankMedID": "",
                        "DrugGenericId": "",
                        "DrugBrandName": "",
                        "DrugGenericName": "",
                        "DrugForm": "",
                        "DrugStrength": "",
                        "DrugSchedule": "",
                        "DrugSupply": "",
                        "DrugCompound": "",
                        "MedicationTypeId": "",
                        "MedicationTypeName": "",
                        "Sig": "",
                        "SigId": 0,
                        "ActionId": "",
                        "Action": "",
                        "DoseId": "",
                        "Dose": "",
                        "DoseUnitId": "",
                        "DoseUnit": "",
                        "RouteId": "",
                        "Route": "",
                        "FrequencyId": "",
                        "Frequency": "",
                        "DoseOtherId": "",
                        "DoseOther": "",
                        "DaysSupplyId": "",
                        "DaysSupply": "",
                        "Quantity": null,
                        "QuantityUnitId": "",
                        "QuantityUnit": "",
                        "RefillId": "",
                        "Refills": "",
                        "SubstitutionPermitted": "y",
                        "PatientInstructions": "",
                        "DeleteInd": "N",
                        "OtherNotes": "",
                        "Remarks": "",
                        "StartDate": null,
                        "StopDate": null,
                        "FillDate": '',
                        "StopReason": "",
                        "RcopiaMedicationStatus": "",
                        "IsEdit": false,
                        "ShowNote": false,
                        "isNKCSMSelected": $scope.obj.isNKCSMSelected || false,
                        "IsMedicationStopped": false,
                        "SelectedMedicationHistory": "CurrentSystemicMedication",
                        "MedicationLocationType": "General",
                        "MedicationLocationTypeId": 2
                    };
                    $scope.obj.CurrentSystemicMedicationsHistory.push(object);
                }
            }
        }
    }
    $scope.StopCurrentSystemicMedication = function (item) {

        var dosesupplytest = "";
        if (item.DaysSupply !== '') {
            dosesupplytest = " for " + item.DaysSupplyDescription;
        }

        item.Sig = item.Action + " " + item.Dose + " " + item.DoseUnit + " " + item.Route + " " + item.Frequency + " " + item.DoseOther + "" + dosesupplytest;

        if (item.Sig == '') {
            alertify.error("Please Select Sig ");
            return false;
        }
        $scope.mInstanceShow = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/StopMedication.html",
            "backdrop": "static",
            "scope": $scope,
            "size": "lg",
            "windowClass": "examination-popover-popup overflow-hidden medicinorder-stop",
            "keyboard": false,
            "resolve": {
                "cache": function () { return angular.copy($scope.cacheStorageItem); },
                "MedicationDetails": function () { return angular.copy(item); },
                "ROSHistoryData": function () { return angular.copy($scope.obj); },

            },
            "controller": function ($scope, $uibModal, $uibModalInstance, cache, MedicationDetails, ROSHistoryData) {

                $scope.obj = ROSHistoryData;
                $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
                $scope.appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
                $scope.UserId = eHnoteMasterDataService.getLoginId();
                var hospitalID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;

                $scope.cacheStorageItem = cache;
                $scope.MedicationDetailsArrayDetails = [];
                $scope.MedicationDetailsArrayDetails.push(MedicationDetails);

                $scope.StopMedication = {
                    "StopDate": null,
                    "StopReason": "",
                    "StopReasonId": "",
                    "StopMedicationNotes": ""
                }
                if ($scope.MedicationDetailsArrayDetails.length > 0) {

                    $scope.MedicationDetailsArrayDetails[0].StopDate = $scope.MedicationDetailsArrayDetails[0].StopDate || null;
                    if ($scope.MedicationDetailsArrayDetails[0].StopDate == null) {
                        var TodayDate = new window.Date();
                        $scope.StopDate = $filter('date')(TodayDate, "MM/dd/yyyy");
                    } else {
                        $scope.StopDate = $filter('date')($scope.MedicationDetailsArrayDetails[0].StopDate, "MM/dd/yyyy");
                    }

                    $scope.StopMedication.StopReasonId = $scope.MedicationDetailsArrayDetails[0].StopReasonId || '';
                    $scope.StopMedication.StopMedicationNotes = $scope.MedicationDetailsArrayDetails[0].StopReason || '';
                }

                $scope.StopMedication.StopDate = $filter('date')($scope.StopDate, "MM/dd/yyyy") || null;
                $scope.closeStopmedicationPopup = function () {
                    $uibModalInstance.dismiss("cancel");
                };
                $scope.getMasterFieldDosageData = function () {
                    eHnoteDiagnosisDataServices.GetMedicineDosageFieldsMasterData().then(function (resp) {
                        console.log(JSON.stringify(resp));
                        $scope.doseArray = resp.data.doseArray || [];
                        $scope.doseOtherArray = resp.data.doseOtherArray || [];
                        $scope.frequencyArray = resp.data.frequencyArray || [];
                        $scope.refillsArray = resp.data.refillsArray || [];
                        $scope.durationArray = resp.data.durationArray || [];
                        $scope.actionArray = resp.data.actionArray || [];
                        $scope.routeArray = resp.data.routeArray || [];
                        $scope.doseUnitArray = resp.data.doseUnitArray || [];
                        $scope.quantityUnitArray = resp.data.quantityUnitArray || [];
                        $scope.MedicationStopReasons = resp.data.MedicationStopReasons || [];

                    }, function (err) {
                        alertify.error("Failed");
                        console.log(err);
                    });
                };

                $scope.getMasterFieldDosageData();

                $scope.changeStopMedication = function (item) {
                    if (item != null) {
                        var ListArray = $filter("filter")($scope.MedicationStopReasons, { "StopReasonId": item }, true);
                        if (ListArray.length > 0) {
                            $scope.StopMedication.StopMedicationNotes = ListArray[0].StopReason;
                        }
                    }
                    else {
                        $scope.StopMedication.StopMedicationNotes = "";
                    }
                }


                if ($scope.MedicationDetailsArrayDetails.length > 0) {
                    angular.forEach($scope.MedicationDetailsArrayDetails, function (item) {
                        item.IsMedicationStopped = false;

                    });
                }
                $scope.StopmedicatioSave = function () {
                    if ($scope.StopMedication.StopDate == '') {
                        alertify.error("Please Select Stop Date");
                        return false;
                    }
                    if ($scope.StopMedication.StopReasonId == '' || $scope.StopMedication.StopReasonId == null) {
                        alertify.error("Please Select Stop Reaon");
                        return false;
                    }


                    var dateComponents = $scope.StopMedication.StopDate.split('-');
                    var convertedDate = dateComponents.join('/');
                    $scope.convertedDate = convertedDate;

                    //var CurrentDate = $filter('date')(new Date(), "MM/dd/yyyy");
                    //if ($scope.convertedDate == CurrentDate) {
                    //    $scope.IsMedicationStopped = true;
                    //}

                    //if ($scope.convertedDate > CurrentDate) {
                    //    $scope.IsMedicationStopped = false;
                    //}

                    $scope.IsMedicationStopped = true;

                    if ($scope.MedicationDetailsArrayDetails.length > 0) {
                        angular.forEach($scope.MedicationDetailsArrayDetails, function (item) {
                            item.IsMedicationStopped = $scope.IsMedicationStopped;
                            item.StopReason = $scope.StopMedication.StopMedicationNotes;
                            item.StopReasonId = $scope.StopMedication.StopReasonId;
                            item.StopDate = $scope.StopMedication.StopDate;
                        });
                    }

                    let TypeId = null;
                    let TypeName = "";
                    if (ScreenObj.TypeId != null) {
                        TypeId = ScreenObj.TypeId;
                    }
                    if (ScreenObj.TypeName != null) {
                        TypeName = ScreenObj.TypeName;
                    }

                    var Allergobj = {
                        "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                        "AppointmentID": $scope.cacheStorageItem.AppointmentId || null,
                        "HospitalId": hospitalID,
                        "StatusFlag": 'D',
                        "TypeId": TypeId,
                        "TypeName": TypeName,
                        "ConsultationDate": $scope.cacheStorageItem.ConsultationDate || "",
                        "UserId": $scope.UserId,
                        "AppointmentDoctorId": "",
                        "AppointmentDoctorName": "",
                        "AppointmentDoctorRcopiaId": "",
                        "AppointmentDate": "",
                        "AllergyItems": [],
                        "PatientHealthConcerns": $scope.obj.HealthConcernsArray || [],
                        "PatientHealthGoals": $scope.obj.HealthGoalsArray || [],
                        "LabInvestigations": $scope.obj.LabInvestigations || [],
                        "ImplantList": $scope.obj.ImplantList || [],
                        "VitalsArray": $scope.AllVitalsList || [],
                        "BirthHistory": $scope.obj.BirthHistory || [],
                        "OccularHistory": $scope.obj.OccularHistoryArray || [],
                        "OcularSurgicalHistory": $scope.obj.OcularSurgicalHistoryArray || [],
                        "MedicalConditions": [], /*$scope.obj.CurrentMedicationArray*/
                        "SystemicHistory": $scope.obj.SystemicHistoryArray || [],
                        "SurgicalHistory": $scope.obj.SurgicalHistoryArray || [],
                        "CurrentSystemicMedicationsHistory": angular.copy($scope.MedicationDetailsArrayDetails) || [],
                        "FamilyHistory": $scope.obj.FamilyHistory || [],
                        "FunctionalStatusHistory": $scope.obj.FunctionalStatusHistory || [],
                        "LifestyleHistory": $scope.obj.LifestyleHistoryArray || [],
                        "VaccinationHistory": $scope.obj.VaccinationHistory || [],
                        "NutritionalHistory": $scope.obj.NutritionalHistory || [],
                        "MenstrualHistory": $scope.obj.MenstrualHistory || [],
                        "PsychiatryData": $scope.obj.PsychiatryData || [],
                        "ROSAllergyRemarkDetails": [],
                        "PsychologicalObservationsArray": $scope.PsychologicalObservationArray || [],
                        "IsPhysicalEvaluationNormal": $scope.obj.IsPhysicalEvaluationNormal,
                        //"isNKISelected": $scope.obj.isNKISelected,
                        "ROSOverAllRemarks": $scope.obj.ROSOverAllRemarks || "",
                        "labinvestigationNotes": $scope.obj.labinvestigationNotes || "",                        
                    }



                    angular.forEach(Allergobj.CurrentSystemicMedicationsHistory, function (mitem) {
                        if (mitem.StopDate != null && mitem.StopDate != undefined && mitem.StopDate != "") {
                            mitem.StopDate = $filter('date')(mitem.StopDate, 'yyyy-MM-dd');

                        }
                        if (mitem.MedicineObject.Sig != undefined && mitem.MedicineObject.Sig != "") {
                            mitem.Sig = mitem.MedicineObject.Sig || "";
                            mitem.MedicineObject = null;
                        } else {
                            mitem.MedicineObject = null;
                        }
                    });

                    console.log(JSON.stringify(Allergobj));

                    eHnoteDiagnosisDataServices.AddupdateROSData(Allergobj).then(function (response) {

                        if (response.data.Status === 'Success') {
                            alertify.success("Medication Stopped  Successfully");
                            $uibModalInstance.close(response);
                        }
                    });
                }
            }
        });

        $scope.mInstanceShow.result.then(function (resp) {

            $scope.StopmedicationArray = [];
            $scope.StopmedicationArray = angular.copy(resp.data.CurrentSystemicMedicationsHistory) || [];

            if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
                angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (iitem) {
                    angular.forEach($scope.StopmedicationArray, function (Nitem) {
                        if (iitem.MedicineId == Nitem.MedicineId) {
                            iitem.IsMedicationStopped = Nitem.IsMedicationStopped || false;
                            iitem.StopDate = $filter('date')(Nitem.StopDate, "MM/dd/yyyy");
                            iitem.StopReason = Nitem.StopReason;
                            iitem.StopReasonId = Nitem.StopReasonId;
                            iitem.CurrentSystemicMedicationId = Nitem.CurrentSystemicMedicationId;
                        }
                    })
                });
            }

            if ($scope.cacheStorageItem.CurrentSystemicMedicationsHistory.length > 0) {
                angular.forEach($scope.cacheStorageItem.CurrentSystemicMedicationsHistory, function (iitem) {
                    angular.forEach($scope.StopmedicationArray, function (Nitem) {
                        if (iitem.MedicineId == Nitem.MedicineId) {
                            iitem.IsMedicationStopped = Nitem.IsMedicationStopped || false;
                            iitem.StopDate = $filter('date')(Nitem.StopDate, "MM/dd/yyyy");
                            iitem.StopReason = Nitem.StopReason;
                            iitem.StopReasonId = Nitem.StopReasonId;
                        }
                    })
                })
            }

        }, function (cancel) {
        });
    }
    $scope.ONSigDetails = function (item, mainitem) {
        console.log(item);
        console.log(mainitem);
        //mainitem.SigFields = true;
        //mainitem.SigfieldsShows = true;
        $scope.adnewsigobj.IsNewSig = false;
        mainitem.isAddFocused = false;
        mainitem.isEditFocused = false;
        mainitem.ActionId = item.ActionId || null;
        mainitem.Action = item.Action || '';
        mainitem.Dose = item.Dose || '';
        mainitem.DoseUnit = item.DoseUnit || '';
        mainitem.Route = item.Route || '';
        mainitem.Frequency = item.Frequency || '';
        mainitem.DoseOther = item.DoseOther || '';
        mainitem.DaysSupply = item.DaysSupply || '';
        mainitem.QuantityUnit = item.QuantityUnit || '';
        mainitem.DoseId = item.DoseId || null;
        mainitem.DoseUnitId = item.DoseUnitId || null;
        mainitem.RouteId = item.RouteId || null;
        mainitem.FrequencyId = item.FrequencyId || null;
        mainitem.DoseOtherId = item.DoseOtherId || null;
        mainitem.DaysSupplyId = item.DaysSupplyId || null;
        mainitem.Quantity = item.Quantity || null;
        mainitem.QuantityUnitId = item.QuantityUnitId || null;
        mainitem.RefillId = item.RefillId || null;
        mainitem.Refills = item.Refills || null;
        mainitem.Sig = item.Sig;
        mainitem.SigId = item.OrganizationSigTemplateId;
        item.MedicineObject = '';


        if (item.DaysSupplyId != 0) {
            var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainitem.DaysSupplyId }, true);
            if (filteredArray.length > 0) {
                var DateCode = filteredArray[0].Code;
                var currentDate = new window.Date();
                var futureDate = new Date(currentDate.getTime() + (parseInt(DateCode) * 24 * 60 * 60 * 1000));
                mainitem.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');
            }
        }
    }
    $scope.ClearCurrentSystemicMedications = function (item, index) {
        var index = $scope.obj.CurrentSystemicMedicationsHistory.indexOf(item);
        item.CurrentSystemicMedicationId = item.CurrentSystemicMedicationId || null;
        if (item.CurrentSystemicMedicationId === null) {
            if (index > -1) {
                $scope.obj.CurrentSystemicMedicationsHistory.splice(index, 1);
            }
        } else {
            $scope.obj.CurrentSystemicMedicationsHistory[index].DeleteInd = 'Y';
        }
    }
    $scope.changeSigForMedicineCS = function (item) {
        item.Sig = "";
        item.SigId = 0;


        item.DrugActionId = '';
        item.Refills = '';
        item.OrganId = '';
        item.Drops = '';
        item.Duration = '';
        item.DurationType = 'D';
        item.ActionId = 0;
        item.Action = '';
        item.Dose = '';
        item.DoseUnit = '';
        item.Route = '';
        item.Frequency = '';
        item.DoseOther = '';
        item.DaysSupply = '';
        item.QuantityUnit = '';
        item.DoseId = 0;
        item.DoseUnitId = 0;
        item.RouteId = 0;
        item.FrequencyId = 0;
        item.DoseOtherId = 0;
        item.DaysSupplyId = 0;
        item.Quantity = "";
        item.QuantityUnitId = 0;
        item.RefillId = 0;
        item.Refills = '';

    }
    $scope.getParticularSigMedicationitems = function (text, item) {
        var params = {
            "MedicineId": item.MedicineId,
            "OrganizationId": $scope.HospitalId,
            "SearchText": text || '',
            "IsFrequent": "N",
            "PageSize": 10,
            "PageNumber": 1
        };
        if (text != "") {
            params.IsFrequent = "N";
        }
        return eHnotePatientDataService.GetOrganizationMedicationSigList(params).then(function (resp) {
            if (resp.data.rows.length !== 0) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            }

        });

    };
    $scope.getOrganizationMedicationSigitems = function (text) {
        text = text || '';
        var params = {
            "OrganizationId": $scope.HospitalId,
            "SearchText": text || '',
            "IsFrequent": "Y",
            "PageSize": 10,
            "PageNumber": 1
        };
        if (text != "") {
            params.IsFrequent = "N";
        }
        return eHnotePatientDataService.GetOrganizationMedicationSigList(params).then(function (resp) {
            if (resp.data.rows.length !== 0) {
                if (resp.data.rows !== undefined) {
                    return resp.data.rows.map(function (item) {
                        return item;
                    });
                }
            }

        });
    };
    $scope.ShowSigFields = function (item) {
        item.SigFields = !item.SigFields;
        $scope.adnewsigobj.IsNewSig = false;
        item.isEditFocused = true;
        item.isAddFocused = false;
    }
    $scope.ShowSigFieldsCurrentSystemic = function (item) {
        item.SigFields = !item.SigFields;
        $scope.adnewsigobj.IsNewSig = false;
        item.isEditFocused = true;
        item.isAddFocused = false;
    }
    $scope.addnewOrganizationSigChangeCurrentSystemic = function (item) {

        if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
            angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (item) {
                item.SigFormationFields = false;
                item.isAddFocused = false;

            });
        }

        item.MedicineObject = '';

        $scope.adnewsigobj.MedicineId = item.MedicineId || 0;
        $scope.addNewOrganizationSigObj.MedicineId = item.MedicineId || 0;
        //$scope.adnewsigobj.IsNewSig = !$scope.adnewsigobj.IsNewSig;
        item.SigFields = false;

        $scope.adnewsigobj.IsNewSig = true;
        item.SigFormationFields = !item.SigFormationFields;
        item.isEditFocused = false;
        item.isAddFocused = true;

        item.ActionId = 0;
        item.Action = '';
        item.Dose = '';
        item.DoseUnit = '';
        item.Route = '';
        item.Frequency = '';
        item.DoseOther = '';
        item.DaysSupply = '';
        item.QuantityUnit = '';
        item.DoseId = 0;
        item.DoseUnitId = 0;
        item.RouteId = 0;
        item.FrequencyId = 0;
        item.DoseOtherId = 0;
        item.DaysSupplyId = 0;
        item.Quantity = 0;
        item.QuantityUnitId = 0;
        item.RefillId = 0;
        item.Refills = '';
    }
    $scope.addnewOrganizationSigChange = function (item) {

        if ($scope.obj.CurrentEyeMedicationArray.length > 0) {
            angular.forEach($scope.obj.CurrentEyeMedicationArray, function (item) {
                item.SigFormationFields = false;
                item.isAddFocused = false;

            });
        }

        item.MedicineObject = '';

        $scope.adnewsigobj.MedicineId = item.MedicineId || 0;
        $scope.addNewOrganizationSigObj.MedicineId = item.MedicineId || 0;
        $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
       
        //$scope.adnewsigobj.IsNewSig = !$scope.adnewsigobj.IsNewSig;
        item.SigFields = false;

        $scope.adnewsigobj.IsNewSig = true;
        item.SigFormationFields = !item.SigFormationFields;
        item.isEditFocused = false;
        item.isAddFocused = true;



        item.ActionId = 0;
        item.Action = '';
        item.Dose = '';
        item.DoseUnit = '';
        item.Route = '';
        item.Frequency = '';
        item.DoseOther = '';
        item.DaysSupply = '';
        item.QuantityUnit = '';
        item.DoseId = 0;
        item.DoseUnitId = 0;
        item.RouteId = 0;
        item.FrequencyId = 0;
        item.DoseOtherId = 0;
        item.DaysSupplyId = 0;
        item.Quantity = 0;
        item.QuantityUnitId = 0;
        item.RefillId = 0;
        item.Refills = '';
    }

    $scope.changePrescAction = function (mainobj) {
        var filteredArray = $filter("filter")($scope.actionArray, { "MedicineDosaageFieldId": mainobj.ActionId }, true);
        if (filteredArray.length > 0) {
            mainobj.Action = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };
    $scope.changePrescDose = function (mainobj) {
        var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": mainobj.DoseId }, true);
        if (filteredArray.length > 0) {
            mainobj.Dose = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };
    $scope.changePrescDoseUnit = function (mainobj) {
        var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": mainobj.DoseUnitId }, true);
        if (filteredArray.length > 0) {
            mainobj.DoseUnit = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };
    $scope.changePrescRoute = function (mainobj) {
        var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": mainobj.RouteId }, true);
        if (filteredArray.length > 0) {
            mainobj.Route = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };
    $scope.changePrescFrequency = function (mainobj) {
        var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": mainobj.FrequencyId }, true);
        if (filteredArray.length > 0) {
            mainobj.Frequency = filteredArray[0].Description;
        };
        $scope.addSIgNameDynamicallyAdded();
    };
    $scope.changePrescDoseOther = function (mainobj) {
        var filteredArray = $filter("filter")($scope.doseOtherArray, { "MedicineDosaageFieldId": mainobj.DoseOtherId }, true);
        if (filteredArray.length > 0) {
            mainobj.DoseOther = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };
    $scope.changePrescDaysSupply = function (mainobj) {
        var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
        if (filteredArray.length > 0) {
            mainobj.DaysSupply = filteredArray[0].Code;
            mainobj.DaysSupplyDescription = filteredArray[0].Description;
        };
        if (mainobj.DaysSupplyId != 0) {
            var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
            if (filteredArray.length > 0) {
                var DateCode = filteredArray[0].Code;
                //var currentDate = new Date(mainobj.StartDate);
                var currentDate = new Date();
                var futureDate = new Date(currentDate.getTime() + (parseInt(DateCode) * 24 * 60 * 60 * 1000));
                mainobj.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');
            }
        } else {
            mainobj.StopDate = null;
            mainobj.DaysSupply = '';
            mainobj.DaysSupplyDescription = '';
        }

        $scope.addSIgNameDynamicallyAdded();
    };
    $scope.changePrescQuantityUnit = function (mainobj) {
        var filteredArray = $filter("filter")($scope.quantityUnitArray, { "MedicineDosaageFieldId": mainobj.QuantityUnitId }, true);
        if (filteredArray.length > 0) {
            mainobj.QuantityUnit = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };
    $scope.changePrescRefill = function (mainobj) {
        var filteredArray = $filter("filter")($scope.refillsArray, { "MedicineDosaageFieldId": mainobj.RefillId }, true);
        if (filteredArray.length > 0) {
            mainobj.Refill = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };
    $scope.addSIgNameDynamicallyAdded = function () {

        if ($scope.obj.CurrentEyeMedicationArray.length > 0) {
            angular.forEach($scope.obj.CurrentEyeMedicationArray, function (initem, index) {
                var dosesupplytest = "";

                if (initem.DaysSupply !== '') {
                    var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": initem.DaysSupplyId }, true);
                    if (filteredArray.length > 0) {
                        initem.DaysSupply = filteredArray[0].Code;
                        dosesupplytest = " for " + filteredArray[0].Description;
                    }
                }
                dosesupplytest = dosesupplytest || ""
                initem.MedicineObject = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;

                if (initem.Sig != '') {
                    initem.Sig = initem.MedicineObject;
                }


            });
        }
        if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
            angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (initem, index) {
                var dosesupplytest = "";

                if (initem.DaysSupply !== '') {
                    var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": initem.DaysSupplyId }, true);
                    if (filteredArray.length > 0) {
                        initem.DaysSupply = filteredArray[0].Code;
                        dosesupplytest = " for " + filteredArray[0].Description;
                    }
                }
                initem.MedicineObject = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;
                if (initem.Sig != '') {
                    initem.Sig = initem.MedicineObject;
                }
            });
        }
    }
    $scope.clearOrganizationSiginput = function () {
        $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
    };
    $scope.savedSigs = [];
    $scope.SaveOrganizationSig = function () {
        console.log($scope.addNewOrganizationSigObj);
        if ($scope.addNewOrganizationSigObj.Sig == '') {
            alertify.error("Please Enter Sig");
            return false;
        }

        if ($scope.addNewOrganizationSigObj.IsFrequent == true) {
            $scope.addNewOrganizationSigObj.IsFrequent = "Y";
        }

        eHnotePatientDataService.AddUpdateOrganizationMedicationSig($scope.addNewOrganizationSigObj, OnAddSigSuccess, OnAddSigError);
        function OnAddSigSuccess(response) {
            alertify.success("Sig Added  Successfully");
            $scope.savedSigs.push($scope.addNewOrganizationSigObj);
            $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
            $scope.adnewsigobj.IsNewSig = false;

        }
        function OnAddSigError() {
            alertify.error("Creating  Failed");
        }
    };
    //curent systamic//
    //curent eye//
    $scope.onRosOrganizationMedicationlist = function (object) {
        $scope.SigSearch.Shows = false;
        object.SigFields = false;

        if (object.MedicineId === '') {
            object.MedicineName = '';
            $scope.obj.CurrentMedicationItem = '';
            return false;
        }

        $scope.obj.CurrentMedicationItem = object;
        $scope.obj.CurrentMedicationItem = $scope.obj.CurrentMedicationItem || "";
        if ($scope.obj.CurrentMedicationItem === "") {
            return;
        }
        if (angular.isObject($scope.obj.CurrentMedicationItem)) {
            var object = {
                "CurrentEyeMedicalConditionId": 0,
                "HospitalId": $scope.obj.CurrentMedicationItem.OrganizationId,
                "MedicineId": $scope.obj.CurrentMedicationItem.MedicineId,
                "MedicineType": $scope.obj.CurrentMedicationItem.MedicineType,
                "MedicineTypeId": $scope.obj.CurrentMedicationItem.MedicineTypeId,
                "MedicineName": $scope.obj.CurrentMedicationItem.MedicineName,
                "MedicineObject": "",
                "RcopiaDrugId": "",
                "RcopiaMedicationId": 0,
                "MedicationName": "",
                "DrugNDCID": "",
                "DrugFirstDataBankMedID": "",
                "DrugGenericId": "",
                "DrugBrandName": "",
                "DrugGenericName": $scope.obj.CurrentMedicationItem.GenericName,
                "DrugForm": "",
                "DrugStrength": $scope.obj.CurrentMedicationItem.Strength,
                "DrugSchedule": null,
                "DrugSupply": "",
                "DrugCompound": "",
                "MedicationTypeId": "",
                "MedicationTypeName": "",
                "Sig": "",
                "SigId": 0,
                "ActionId": "",
                "Action": "",
                "DoseId": "",
                "Dose": "",
                "DoseUnitId": "",
                "DoseUnit": "",
                "RouteId": "",
                "Route": "",
                "FrequencyId": "",
                "Frequency": "",
                "DoseOtherId": "",
                "DoseOther": "",
                "DaysSupplyId": "",
                "DaysSupply": "",
                "Quantity": "",
                "QuantityUnitId": "",
                "QuantityUnit": "",
                "RefillId": "",
                "Refills": "",
                "SubstitutionPermitted": "y",
                "PatientInstructions": "",
                "DeleteInd": "N",
                "OtherNotes": "",
                "Remarks": "",
                "StartDate": null,
                "StopDate": null,
                "FillDate": '',
                "StopReason": "",
                "RcopiaMedicationStatus": "",
                "IsEdit": true,
                "ShowNote": false,
                "RxNormList": $scope.obj.CurrentMedicationItem.RxNormList || [],
                "IsMedicationStopped": false,
                "StopReasonId": null,
                "SigFormationFields": false,
                "isEditFocused": false,
                "isAddFocused": false,

            };
        }

        var i = 0;
        if ($scope.obj.CurrentEyeMedicationArray.length > 0) {
            angular.forEach($scope.obj.CurrentEyeMedicationArray, function (item) {
                if (item.MedicineId === $scope.obj.CurrentMedicationItem.MedicineId && item.DeleteInd == 'N') {
                    alertify.error('You have already entered this Current Eye Medication');
                    i++;
                }
            });
        }
        if ($scope.obj.CurrentEyeMedicationArray.length !== 0) {
            var List = $filter("filter")($scope.obj.CurrentEyeMedicationArray, { "MedicineId": 1 }, true);
            if (List.length > 0) {
                if (List[0].PatientDetailId === 0) {
                    var indexToRemove = $scope.obj.CurrentEyeMedicationArray.indexOf(List[0]);
                    if (indexToRemove !== -1) {
                        $scope.obj.CurrentEyeMedicationArray.splice(indexToRemove, 1);
                    }
                } else {
                    List[0].DeleteInd = 'Y';
                }
            }
            $scope.obj.isNKCEMSelected = false;
            angular.forEach($scope.obj.CurrentEyeMedicationArray, function (item) {
                item.IsEdit = false;
            });
        }
        if (i === 0) {
            object.MedicalHistoryDetailsId = 0;
            $scope.obj.CurrentEyeMedicationArray.unshift(object);


        }
        $scope.obj.CurrentMedicationItem = "";

    };
    $scope.ONSelectCurrentEyeRcopia = function (object) {
        $scope.SigSearch.Shows = false;
        object.SigFields = false;
        //if (object.MedicineId === '') {
        //    object.MedicineName = '';
        //    $scope.obj.CurrentMedicationItem = '';
        //    return false;
        //}
        $scope.obj.CurrentMedicationItem = object;
        $scope.obj.CurrentMedicationItem = $scope.obj.CurrentMedicationItem || "";
        if ($scope.obj.CurrentMedicationItem === "") {
            return;
        }
        if (angular.isObject($scope.obj.CurrentMedicationItem)) {
            var object = {
                "CurrentEyeMedicalConditionId": 0,
                "HospitalId": $scope.obj.CurrentMedicationItem.OrganizationId,
                "MedicineId": 0,
                "MedicineType": $scope.obj.CurrentMedicationItem.BrandName,
                "MedicineTypeId": 0,
                "MedicineName": $scope.obj.CurrentMedicationItem.BrandName,
                "MedicineObject": "",
                "RcopiaDrugId": $scope.obj.CurrentMedicationItem.RcopiaDrugId,
                "RcopiaMedicationId": 0,
                "MedicationName": "",
                "DrugNDCID": $scope.obj.CurrentMedicationItem.RcopiaDrugNDCID,
                "DrugFirstDataBankMedID": "",
                "DrugGenericId": "",
                "DrugBrandName": "",
                "DrugGenericName": $scope.obj.CurrentMedicationItem.GenericName,
                "DrugForm": "",
                "DrugStrength": $scope.obj.CurrentMedicationItem.Strength,
                "DrugSchedule": null,
                "DrugSupply": "",
                "DrugCompound": "",
                "MedicationTypeId": "",
                "MedicationTypeName": "",
                "Sig": "",
                "SigId": 0,
                "ActionId": "",
                "Action": "",
                "DoseId": "",
                "Dose": "",
                "DoseUnitId": "",
                "DoseUnit": "",
                "RouteId": "",
                "Route": "",
                "FrequencyId": "",
                "Frequency": "",
                "DoseOtherId": "",
                "DoseOther": "",
                "DaysSupplyId": "",
                "DaysSupply": "",
                "Quantity": "",
                "QuantityUnitId": "",
                "QuantityUnit": "",
                "RefillId": "",
                "Refills": "",
                "SubstitutionPermitted": "y",
                "PatientInstructions": "",
                "DeleteInd": "N",
                "OtherNotes": "",
                "Remarks": "",
                "StartDate": null,
                "StopDate": null,
                "FillDate": '',
                "StopReason": "",
                "RcopiaMedicationStatus": "",
                "IsEdit": true,
                "ShowNote": false,
                "IsMedicationStopped": false,
                "StopReasonId": null,
                "SigFormationFields": false,
                "isEditFocused": false,
                "isAddFocused": false,

            };
        }

        var mparams = {
            "UserId": $scope.UserId,
            "MedicineId": 0,
            "RcopiaDrugId": $scope.obj.CurrentMedicationItem.RcopiaDrugId,
            "DrugNDCID": $scope.obj.CurrentMedicationItem.RcopiaDrugNDCID,
            "FirstDataBankMedID": $scope.obj.CurrentMedicationItem.FirstDataBankMedID,
            "DrugGenericID": $scope.obj.CurrentMedicationItem.GenericID,
            "DrugName": $scope.obj.CurrentMedicationItem.BrandName,
            "GenericName": $scope.obj.CurrentMedicationItem.GenericName,
            "MedicineType": $scope.obj.CurrentMedicationItem.Form,
            "Strength": $scope.obj.CurrentMedicationItem.Strength,
            "Schedule": $scope.obj.CurrentMedicationItem.Schedule,
            "RouteCode": $scope.obj.CurrentMedicationItem.RouteCode,
            "RxNormList": []
        }

        if ($scope.obj.CurrentMedicationItem.RxNormList.length > 0) {
            var filteredRxNorm = $filter("filter")($scope.obj.CurrentMedicationItem.RxNormList, { "Status": 'a' }, true) || [];
            if (filteredRxNorm.length > 0) {
                $scope.obj.CurrentMedicationItem = filteredRxNorm[0].RxnormID;
                var rxNormObj = {
                    "MedicineRxNormsId": 0,
                    "RxnormID": filteredRxNorm[0].RxnormID,
                    "RxnormIDType": filteredRxNorm[0].RxnormIDType,
                    "Status": "a",
                    "Representative": "y"
                }

                mparams.RxNormList.push(rxNormObj)
            }
        }

        console.log(mparams);


        eHnoteDiagnosisDataServices.UpdateFirstBankMasterDrugDetails(mparams).then(function (response) {

            console.log(JSON.stringify(response));
            if (response.data.status === 'Success') {

                object.MedicineId = response.data.MedicineId;

                var i = 0;
                if ($scope.obj.CurrentEyeMedicationArray.length > 0) {
                    angular.forEach($scope.obj.CurrentEyeMedicationArray, function (item) {
                        if (item.MedicineId === object.MedicineId && item.DeleteInd == 'N') {
                            alertify.error('You have already entered this Current Eye Medication');
                            i++;
                        }
                    });
                }
                if ($scope.obj.CurrentEyeMedicationArray.length !== 0) {
                    var List = $filter("filter")($scope.obj.CurrentEyeMedicationArray, { "MedicineId": 1 }, true);
                    if (List.length > 0) {
                        if (List[0].PatientDetailId === 0) {
                            var indexToRemove = $scope.obj.CurrentEyeMedicationArray.indexOf(List[0]);
                            if (indexToRemove !== -1) {
                                $scope.obj.CurrentEyeMedicationArray.splice(indexToRemove, 1);
                            }
                        } else {
                            List[0].DeleteInd = 'Y';
                        }
                    }
                    $scope.obj.isNKCEMSelected = false
                    angular.forEach($scope.obj.CurrentEyeMedicationArray, function (item) {
                        item.IsEdit = false;
                    });
                }
                if (i === 0) {
                    object.MedicalHistoryDetailsId = 0;
                    $scope.obj.CurrentEyeMedicationArray.unshift(object);
                }
                $scope.obj.CurrentMedicationItem = "";


            }
        });

    };
    //curent eye//

    //systmic history
    $scope.OnSelectNormal = function (item) {
        if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
            var List = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, { "HistoryId": 1 }, true);
            if (List.length > 0) {
                if (List[0].PatientDetailId === 0) {
                    var indexToRemove = $scope.HealthPhysicalObj.SystemicHistoryArray.indexOf(List[0]);
                    if (indexToRemove !== -1) {
                        $scope.HealthPhysicalObj.SystemicHistoryArray.splice(indexToRemove, 1);
                    }
                } else {
                    List[0].DeleteInd = 'Y';
                }
            }
        }
        $scope.obj.isNKSHSelected = false;
        if (item === "All") {
            if ($scope.HealthPhysicalObj.IsAllHealthWNL) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    kitem.IsChecked = false;
                });
                $scope.HealthPhysicalObj.IsCardiacWNL = true;
                $scope.HealthPhysicalObj.IsPulmonaryWNL = true;
                $scope.HealthPhysicalObj.IsHepaticWNL = true;
                $scope.HealthPhysicalObj.IsEndocrineWNL = true;
                $scope.HealthPhysicalObj.IsNeurologicWNL = true;
                $scope.HealthPhysicalObj.IsHemeOncWNL = true;
                $scope.HealthPhysicalObj.IsNervousSystemWNL = true;
                $scope.HealthPhysicalObj.IsKidneyDiseaseWNL = true;
                $scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL = true;
                $scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL = true;
                $scope.HealthPhysicalObj.IsPsychosisWNL = true;
                $scope.HealthPhysicalObj.IsOthersWNL = true;
                $scope.HealthPhysicalObj.IsHeentWNL = true;
                $scope.HealthPhysicalObj.IsLungsWNL = true;
                $scope.HealthPhysicalObj.IsGeneralappearanceWNL = true;

                if ($scope.HealthPhysicalObj.IsHeentWNL) {
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                        if (kitem.TypeId === 16) {
                            if (kitem.IsNormal == true) {
                                kitem.IsChecked = true;
                            }
                            if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                kitem.DeleteInd = "Y";
                            } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                                kitem.DeleteInd = "N";
                            }
                        }
                    });
                }



                if ($scope.HealthPhysicalObj.IsLungsWNL) {
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                        if (kitem.TypeId === 17) {

                            if (kitem.IsNormal == true) {
                                kitem.IsChecked = true;
                            }
                            if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                kitem.DeleteInd = "Y";
                            } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                                kitem.DeleteInd = "N";
                            }
                        }
                    });
                }
                if ($scope.HealthPhysicalObj.IsCardiacWNL) {
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                        if (kitem.TypeId === 1) {

                            if (kitem.IsNormal == true) {
                                kitem.IsChecked = true;
                            }

                            if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                kitem.DeleteInd = "Y";
                            } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                                kitem.DeleteInd = "N";
                            }
                        }
                    });
                }


                if ($scope.HealthPhysicalObj.IsNeurologicWNL) {
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                        if (kitem.TypeId === 5) {

                            if (kitem.IsNormal == true) {
                                kitem.IsChecked = true;
                            }

                            if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                kitem.DeleteInd = "Y";
                            } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                                kitem.DeleteInd = "N";
                            }
                        }
                    });
                }

                if ($scope.HealthPhysicalObj.IsGeneralappearanceWNL) {
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                        if (kitem.TypeId === 21) {
                            if (kitem.IsNormal == true) {
                                kitem.IsChecked = true;
                            }

                            if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                kitem.DeleteInd = "Y";
                            } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                                kitem.DeleteInd = "N";
                            }
                        }
                    });
                }


            }
            else {
                $scope.HealthPhysicalObj.IsCardiacWNL = false;
                $scope.HealthPhysicalObj.IsPulmonaryWNL = false;
                $scope.HealthPhysicalObj.IsHepaticWNL = false;
                $scope.HealthPhysicalObj.IsEndocrineWNL = false;
                $scope.HealthPhysicalObj.IsNeurologicWNL = false;
                $scope.HealthPhysicalObj.IsHemeOncWNL = false;
                $scope.HealthPhysicalObj.IsNervousSystemWNL = false;
                $scope.HealthPhysicalObj.IsKidneyDiseaseWNL = false;
                $scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL = false;
                $scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL = false;
                $scope.HealthPhysicalObj.IsPsychosisWNL = false;
                $scope.HealthPhysicalObj.IsOthersWNL = false;
                $scope.HealthPhysicalObj.IsHeentWNL = false;
                $scope.HealthPhysicalObj.IsLungsWNL = false;
                $scope.HealthPhysicalObj.IsGeneralappearanceWNL = false;


                if ($scope.HealthPhysicalObj.IsCardiacWNL == false) {
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                        if (kitem.TypeId === 1) {
                            kitem.IsChecked = false;

                            if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                kitem.DeleteInd = "Y";
                            }
                        }
                    });
                }

                if ($scope.HealthPhysicalObj.IsHeentWNL == false) {
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                        if (kitem.TypeId === 16) {
                            kitem.IsChecked = false;

                            if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                kitem.DeleteInd = "Y";
                            }
                        }
                    });
                }

                if ($scope.HealthPhysicalObj.IsLungsWNL == false) {
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                        if (kitem.TypeId === 17) {
                            kitem.IsChecked = false;

                            if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                kitem.DeleteInd = "Y";
                            }
                        }
                    });
                }

                if ($scope.HealthPhysicalObj.IsNeurologicWNL == false) {
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                        if (kitem.TypeId === 5) {
                            kitem.IsChecked = false;

                            if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                kitem.DeleteInd = "Y";
                            }
                        }
                    });
                }
                if ($scope.HealthPhysicalObj.IsGeneralappearanceWNL == false) {
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                        if (kitem.TypeId === 21) {
                            kitem.IsChecked = false;

                            if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                kitem.DeleteInd = "Y";
                            }
                        }
                    });
                }
            }
        }
        if (item === "Cardiac") {
            if ($scope.HealthPhysicalObj.IsCardiacWNL) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 1) {
                        kitem.IsChecked = false;
                    }
                });
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 1) {
                        if (kitem.IsNormal == true) {
                            kitem.IsChecked = true;
                        }
                        if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                            kitem.DeleteInd = "Y";
                        } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                            kitem.DeleteInd = "N";
                        }
                        if (kitem.HistoryId === 20) {
                            if (kitem.IsChecked) {
                                $scope.HealthPhysicalObj.showCardiacNotes = true;
                            } else {
                                $scope.HealthPhysicalObj.showCardiacNotes = false;
                                $scope.HealthPhysicalObj.CardiacNotes = "";
                            }
                        }
                    }
                });
            } else {
                $scope.HealthPhysicalObj.IsAllHealthWNL = false;
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 1) {
                        kitem.IsChecked = false;

                        if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                            kitem.DeleteInd = "Y";
                        }
                    }
                });
            }
        }
        if (item === "Pulmonary") {
            if ($scope.HealthPhysicalObj.IsPulmonaryWNL) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 2) {
                        kitem.IsChecked = false;
                    }
                    if (kitem.HistoryId === 33) {
                        if (kitem.IsChecked) {
                            $scope.HealthPhysicalObj.showPulmonaryNotes = true;
                        } else {
                            $scope.HealthPhysicalObj.showPulmonaryNotes = false;
                            $scope.HealthPhysicalObj.PulmonaryNotes = "";
                        }
                    }
                });
            } else {
                $scope.HealthPhysicalObj.IsAllHealthWNL = false;
            }
        }
        if (item === "Hepatic") {
            if ($scope.HealthPhysicalObj.IsHepaticWNL) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 3) {
                        kitem.IsChecked = false;
                    }
                    if (kitem.HistoryId === 41) {
                        if (kitem.IsChecked) {
                            $scope.HealthPhysicalObj.showHepaticNotes = true;
                        } else {
                            $scope.HealthPhysicalObj.showHepaticNotes = false;
                            $scope.HealthPhysicalObj.HepaticNotes = "";
                        }
                    }
                });
            } else {
                $scope.HealthPhysicalObj.IsAllHealthWNL = false;
            }
        }
        if (item === "Endocrine") {
            if ($scope.HealthPhysicalObj.IsEndocrineWNL) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 4) {
                        kitem.IsChecked = false;
                    }
                });
            } else {
                $scope.HealthPhysicalObj.IsAllHealthWNL = false;
            }
        }
        if (item === "Neurologic") {
            if ($scope.HealthPhysicalObj.IsNeurologicWNL) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 5) {
                        kitem.IsChecked = false;
                    }
                });
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 5) {
                        if (kitem.IsNormal == true) {
                            kitem.IsChecked = true;
                        }
                        if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                            kitem.DeleteInd = "Y";
                        } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                            kitem.DeleteInd = "N";
                        }
                        if (kitem.HistoryId === 59) {
                            if (kitem.IsChecked) {
                                $scope.HealthPhysicalObj.showNeurologicNotes = true;
                            } else {
                                $scope.HealthPhysicalObj.showNeurologicNotes = false;
                                $scope.HealthPhysicalObj.NeurologicNotes = "";
                            }
                        }
                    }
                });
            } else {
                $scope.HealthPhysicalObj.IsAllHealthWNL = false;
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 5) {
                        kitem.IsChecked = false;

                        if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                            kitem.DeleteInd = "Y";
                        }
                    }
                });
            }
        }
        if (item === "HemeOnc") {
            if ($scope.HealthPhysicalObj.IsHemeOncWNL) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 6) {
                        kitem.IsChecked = false;
                    }
                    if (kitem.HistoryId === 67) {
                        if (kitem.IsChecked) {
                            $scope.HealthPhysicalObj.showHemeOncNotes = true;
                        } else {
                            $scope.HealthPhysicalObj.showHemeOncNotes = false;
                            $scope.HealthPhysicalObj.HemeOncNotes = "";
                        }
                    }
                });
            } else {
                $scope.HealthPhysicalObj.IsAllHealthWNL = false;
            }
        }
        if (item === "Nervous System") {
            if ($scope.HealthPhysicalObj.IsNervousSystemWNL) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 7) {
                        kitem.IsChecked = false;
                    }
                    if (kitem.HistoryId === 70) {
                        if (kitem.IsChecked) {
                            $scope.HealthPhysicalObj.showNervousSystemNotes = true;
                        } else {
                            $scope.HealthPhysicalObj.showNervousSystemNotes = false;
                            $scope.HealthPhysicalObj.NervousSystemNotes = "";
                        }
                    }
                });
            } else {
                $scope.HealthPhysicalObj.IsAllHealthWNL = false;
            }
        }
        if (item === "Kidney") {
            if ($scope.HealthPhysicalObj.IsKidneyDiseaseWNL) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 8) {
                        kitem.IsChecked = false;
                    }
                    if (kitem.HistoryId === 74) {
                        if (kitem.IsChecked) {
                            $scope.HealthPhysicalObj.showKidneyDiseaseNotes = true;
                        } else {
                            $scope.HealthPhysicalObj.showKidneyDiseaseNotes = false;
                            $scope.HealthPhysicalObj.KidneyDiseaseNotes = "";
                        }
                    }
                });
            } else {
                $scope.HealthPhysicalObj.IsAllHealthWNL = false;
            }
        }
        if (item === "MusculoSkeletal") {
            if ($scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 9) {
                        kitem.IsChecked = false;
                    }
                    if (kitem.HistoryId === 78) {
                        if (kitem.IsChecked) {
                            $scope.HealthPhysicalObj.showMusculoSkeletalSystemNotes = true;
                        } else {
                            $scope.HealthPhysicalObj.showMusculoSkeletalSystemNotes = false;
                            $scope.HealthPhysicalObj.MusculoSkeletalSystemNotes = "";
                        }
                    }
                });
            } else {
                $scope.HealthPhysicalObj.IsAllHealthWNL = false;
            }
        }
        if (item === "AutoImmune") {
            if ($scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 10) {
                        kitem.IsChecked = false;
                    }
                });
            } else {
                $scope.HealthPhysicalObj.IsAllHealthWNL = false;
            }
        }
        if (item === "Psychosis") {
            if ($scope.HealthPhysicalObj.IsPsychosisWNL) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 11) {
                        kitem.IsChecked = false;
                    }
                    if (kitem.HistoryId === 90) {
                        if (kitem.IsChecked) {
                            $scope.HealthPhysicalObj.showPsychosisNotes = true;
                        } else {
                            $scope.HealthPhysicalObj.showPsychosisNotes = false;
                            $scope.HealthPhysicalObj.PsychosisNotes = "";
                        }
                    }
                });
            } else {
                $scope.HealthPhysicalObj.IsAllHealthWNL = false;
            }
        }
        if (item === "Others") {
            if ($scope.HealthPhysicalObj.IsOthersWNL) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 12) {
                        kitem.IsChecked = false;
                    }
                    if (kitem.HistoryId === 95) {
                        if (kitem.IsChecked) {
                            $scope.HealthPhysicalObj.showOthersNotes = true;
                        } else {
                            $scope.HealthPhysicalObj.showOthersNotes = false;
                            $scope.HealthPhysicalObj.OthersNotes = "";
                        }
                    }
                });
            } else {
                $scope.HealthPhysicalObj.IsAllHealthWNL = false;
            }
        }

        if (item === "Heent") {
            if ($scope.HealthPhysicalObj.IsHeentWNL) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 16) {
                        kitem.IsChecked = false;
                    }
                });
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 16) {
                        if (kitem.IsNormal == true) {
                            kitem.IsChecked = true;
                        }
                        if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                            kitem.DeleteInd = "Y";
                        } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                            kitem.DeleteInd = "N";
                        }
                        if (kitem.HistoryId === 127) {
                            if (kitem.IsChecked) {
                                $scope.HealthPhysicalObj.showHeentNotes = true;
                            } else {
                                $scope.HealthPhysicalObj.showHeentNotes = false;
                                $scope.HealthPhysicalObj.HeentNotes = "";
                            }
                        }
                    }
                });
            } else {
                $scope.HealthPhysicalObj.IsAllHealthWNL = false;
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 16) {
                        kitem.IsChecked = false;

                        if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                            kitem.DeleteInd = "Y";
                        }
                    }
                });
            }
        }
        if (item === "Lungs") {
            if ($scope.HealthPhysicalObj.IsLungsWNL) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 17) {
                        kitem.IsChecked = false;
                    }
                });
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 17) {
                        if (kitem.IsNormal == true) {
                            kitem.IsChecked = true;
                        }
                        if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                            kitem.DeleteInd = "Y";
                        } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                            kitem.DeleteInd = "N";
                        }
                        if (kitem.HistoryId === 132) {
                            if (kitem.IsChecked) {
                                $scope.HealthPhysicalObj.showLungsNotes = true;
                            } else {
                                $scope.HealthPhysicalObj.showLungsNotes = false;
                                $scope.HealthPhysicalObj.LungsNotes = "";
                            }
                        }
                    }
                });
            } else {
                $scope.HealthPhysicalObj.IsAllHealthWNL = false;
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 17) {
                        kitem.IsChecked = false;

                        if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                            kitem.DeleteInd = "Y";
                        }
                    }
                });
            }
        }




        if (item === "General Appearance") {
            if ($scope.HealthPhysicalObj.IsGeneralappearanceWNL) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 21) {
                        kitem.IsChecked = false;
                        if (kitem.IsNormal == true) {
                            kitem.IsChecked = true;
                        }
                        if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                            kitem.DeleteInd = "Y";
                        } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                            kitem.DeleteInd = "N";
                        }
                        if (kitem.HistoryId === 166) {
                            if (kitem.IsChecked) {
                                $scope.HealthPhysicalObj.showGeneralAppearenceNotes = true;
                            } else {
                                $scope.HealthPhysicalObj.showGeneralAppearenceNotes = false;
                                $scope.HealthPhysicalObj.GeneralAppearenceNotes = "";
                            }
                        }
                    }
                });
            } else {
                $scope.HealthPhysicalObj.IsAllHealthWNL = false;
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 21) {
                        kitem.IsChecked = false;

                        if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                            kitem.DeleteInd = "Y";
                        }
                    }
                });
            }
        }
        //if all normal check true
        if ($scope.HealthPhysicalObj.IsCardiacWNL == true && $scope.HealthPhysicalObj.IsGeneralappearanceWNL == true &&
            $scope.HealthPhysicalObj.IsHepaticWNL == true && $scope.HealthPhysicalObj.IsEndocrineWNL == true &&
            $scope.HealthPhysicalObj.IsNeurologicWNL == true && $scope.HealthPhysicalObj.IsHemeOncWNL == true &&
            $scope.HealthPhysicalObj.IsNervousSystemWNL == true && $scope.HealthPhysicalObj.IsKidneyDiseaseWNL == true &&
            $scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL == true && $scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL == true &&
            $scope.HealthPhysicalObj.IsPsychosisWNL == true && $scope.HealthPhysicalObj.IsOthersWNL == true &&
            $scope.HealthPhysicalObj.IsHeentWNL == true && $scope.HealthPhysicalObj.IsLungsWNL == true && $scope.HealthPhysicalObj.IsPulmonaryWNL == true) {
            $scope.HealthPhysicalObj.IsAllHealthWNL = true;
        } else {
            $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        }
    };
    $scope.onRosSystemicHistoryBlurChange = function (SystemicHistory) {

        if ($scope.obj.isNKSHSelected) {
            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                var List = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, function (fitem) {
                    return fitem.HistoryId === 1;
                }, true);
                if (List.length > 0) {
                    if (List[0].PatientDetailId === 0) {
                        var indexToRemove = $scope.HealthPhysicalObj.SystemicHistoryArray.indexOf(List[0]);
                        if (indexToRemove !== -1) {
                            $scope.HealthPhysicalObj.SystemicHistoryArray.splice(indexToRemove, 1);
                        }
                    } else {
                        List[0].DeleteInd = 'Y';
                    }
                }
                item.isNKSHSelected = false
                $scope.obj.isNKSHSelected = false
            });

        }

        if (SystemicHistory.HistoryId === '') {
            SystemicHistory.HistoryName = '';
            $scope.obj.SystemicHistoryItem = '';
            return false;
        }
        angular.forEach($scope.FrequentlySystemicHistory, function (item) {
            if (item.HistoryId === SystemicHistory.HistoryId && item.DeleteInd == "N") {
                item.Onselect = true;
            }
        });
        $scope.obj.SystemicHistoryItem = SystemicHistory;
        var i = 0;
        $scope.obj.SystemicHistoryItem = $scope.obj.SystemicHistoryItem || "";
        if ($scope.obj.SystemicHistoryItem === "") {
            return;
        }
        //$scope.cacheStorageItem.SystemicHistoryArray = $scope.cacheStorageItem.SystemicHistoryArray || [];


        if (angular.isObject($scope.obj.SystemicHistoryItem)) {
            var object = {
                "PatientDetailId": 0,
                "HistoryId": $scope.obj.SystemicHistoryItem.HistoryId,
                "HistoryName": $scope.obj.SystemicHistoryItem.HistoryName,
                "IsNormal": $scope.obj.SystemicHistoryItem.IsNormal || false,
                "IsNoshowROS": true,
                "IsEdit": true,
                "IsChecked": true,
                "ActiveInd": true,
                "DeleteInd": "N",
                "Remarks": $scope.obj.SystemicHistoryItem.Remarks || "",
                "SnomedCodeobj": $scope.obj.SystemicHistoryItem.SNOMED || "",
                "OrganId": $scope.obj.SystemicHistoryItem.OrganId || "",
                "Duration": $scope.obj.SystemicHistoryItem.Duration || "",
                "DurationType": $scope.obj.SystemicHistoryItem.DurationType || "D",
                "DurationTypeName": $scope.obj.SystemicHistoryItem.DurationTypeName || "Day(s)",
                "DurationDate": $scope.obj.SystemicHistoryItem.DurationDate || null,
                "ShowNote": false,
                "SNOMEDId": $scope.obj.SystemicHistoryItem.SNOMEDId || null,
                "SNOMEDCODE": $scope.obj.SystemicHistoryItem.SNOMED || "",
                "ICD10CODE": $scope.obj.SystemicHistoryItem.ICD10CODE || "",
                "DiagnosisObject": $scope.obj.SystemicHistoryItem.ICD10CODE || "",
                "DiagnosisId": $scope.obj.SystemicHistoryItem.DiagnosisId || null,
                "SeverityId": null,
                "StatusId": 1,
                "SeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                "ShowDateFormat": true,
            };
        } else {
            var object = {
                "PatientDetailId": 0,
                "HistoryId": 0,
                "HistoryName": $scope.obj.SystemicHistoryItem,
                "IsNoshowROS": true,
                "IsNormal": false,
                "IsEdit": true,
                "IsChecked": true,

                "ActiveInd": true,
                "DeleteInd": "N",
                "Remarks": $scope.obj.SystemicHistoryItem.Remarks || "",
                "SnomedCode": $scope.obj.SystemicHistoryItem.SnomedCode || "",
                "OrganId": $scope.obj.SystemicHistoryItem.OrganId || "",
                "Duration": $scope.obj.SystemicHistoryItem.Duration || "",
                "DurationType": $scope.obj.SystemicHistoryItem.DurationType || "D",
                "DurationTypeName": $scope.obj.SystemicHistoryItem.DurationTypeName || "Day(s)",
                "DurationDate": $scope.obj.SystemicHistoryItem.DurationDate || null,
                "ShowNote": false,
                "SNOMEDId": "",
                "SNOMEDCODE": "",
                "ICD10CODE": "",
                "DiagnosisObject": "",
                "DiagnosisId": "",
                "SeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                "ShowDateFormat": true,
            };
        }

        var i = 0;
        if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                if (item.HistoryId === object.HistoryId && item.DeleteInd == "N" && item.IsChecked) {
                    alertify.error('You have already entered this Systemic history');
                    $scope.obj.SystemicHistoryItem = "";
                    i++;
                }
            });
        }
        if ($scope.HealthPhysicalObj.SystemicHistoryArray.length !== 0) {
            var List = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, { "HistoryId": 1 }, true);
            var List1 = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, { "HistoryId": object.HistoryId }, true);
            if (List1.length > 0) {
                List1[0].IsChecked = true;
                List1[0].DeleteInd = 'N';
                List1[0].ShowDateFormat = true;
                i++;
                $scope.obj.SystemicHistoryItem = "";
            }
            if (List.length > 0) {
                if (List[0].PatientDetailId === 0) {
                    var indexToRemove = $scope.HealthPhysicalObj.SystemicHistoryArray.indexOf(List[0]);
                    if (indexToRemove !== -1) {
                        $scope.HealthPhysicalObj.SystemicHistoryArray.splice(indexToRemove, 1);
                    }
                } else {
                    List[0].DeleteInd = 'Y';
                }
            }
            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item, index) {
                item.IsEdit = false;
                /*if (index == 0) { item.IsEdit = true; }*/
            });
        }
        if (i === 0) {
            object.GeneralPatientHistoryId = 0;
            $scope.HealthPhysicalObj.SystemicHistoryArray.push(object);
            $scope.obj.SystemicHistoryItem.DeleteInd = "N";
            $scope.obj.SystemicHistoryItem = "";
        }
        $scope.obj.SelectedSurgeryItem = "";
    };
    $scope.GetMasterSystemicHistory = function (val, type) {
        var params = {
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "OrganizationId": $scope.HospitalId,
            //"ParentHospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "UserId": doctorinfo.doctorid,
            "HistoryId": 0,
            "PageSize": 10,
            "PageNumber": 1,
            "SearchText": val,
            "Type": '',
            "IsFrequent": "N"

        };
        if (params.SearchText == "") {
            params.IsFrequent = "Y";
        }

        return eHnoteSettingsDataService.GetMasterSystemicHistory(params).then(function (resp) {
            if (resp.data.count !== 0) {
                if (resp.data.SystemicHistory !== undefined) {
                    $scope.ROSHistoriesObj.AddSystemicHistory = false;
                    return resp.data.SystemicHistory
                        .filter(function (item) {
                            return item.IsNormal != true;
                        })
                        .map(function (item) {
                            return item;
                        });
                } else {
                    $scope.ROSHistoriesObj.AddSystemicHistory = true;
                }
            } else {
                $scope.ROSHistoriesObj.AddSystemicHistory = false;
                if (val != '') {
                    $scope.ROSHistoriesObj.AddSystemicHistory = true;
                }
            }
        });
    };
    $scope.AddNewSystemicHistory = function (SelectedSystemicHistory) {
        SelectedSystemicHistory = SelectedSystemicHistory || "";
        if (SelectedSystemicHistory === "") {
            alertify.error("Enter Systemic History");
            return;
        }
        var object = {
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "OrganizationId": $scope.HospitalId,
            //"ParentHospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
            "UserId": doctorinfo.doctorid,
            "DeleteInd": false,
            "HistoryName": SelectedSystemicHistory,
            "HistoryId": 0
        };
        eHnoteSettingsDataService.AddUpdateMasterSystemicHistory(object).success(function (response) {
            if (response.Status === 'Success') {
                if (response.count > 0) {
                    $scope.SelectedSystemicHistory = "";
                    SelectedSystemicHistory = "";
                    $scope.onRosSystemicHistoryBlurChange(response.SystemicHistory[0]);
                    $scope.ROSHistoriesObj.AddSystemicHistory = false;
                    alertify.success("Successfully Added");
                }
            }
            if (response.Status === 'Failure') {
                alertify.error(response.Message);
                $scope.SelectedSystemicHistory = "";
                SystemicHistoryItem = "";
            }
        })
            .error(function (error) {
                alertify.error("Error Occured");
            });
    };
    $scope.DeleteSystemicHistory = function (sitem) {
        var index = $scope.obj.SystemicHistoryArray.indexOf(sitem);
        if (sitem.PatientDetailId === 0) {
            if (index > -1) {
                $scope.obj.SystemicHistoryArray.splice(index, 1);
            }
        } else {
            $scope.obj.SystemicHistoryArray[index].DeleteInd = 'Y';
        }
    }

    $scope.AddSystemicHistorynotes = function (item) {
        item.ShowNote = true;
    };

    $scope.ClearSubSystemicHistory = function (item) {
        item.OrganId = 1;
        item.Remarks = "";
        item.Duration = "";
        item.DurationType = "D";
        item.DurationDate = "";
        item.SeverityId = "";
        item.StatusId = "";
        item.SnomedCode = "";
        item.DiagnosisObject = "";
        item.SnomedCodeobj = "";
    };

    $scope.onSelectSystemicHistoryDiagnosis = function (item) {
        item.DiagnosisId = item.DiagnosisObject.DiagnosisId;
        item.ICD10CODE = item.DiagnosisObject.ICD10CODE || "";
    }

    $scope.ChangeSystemicHistory = function (mainitem) {
        angular.forEach($scope.obj.SystemicHistoryArray, function (item) {
            item.IsEdit = false;
        })
        mainitem.IsEdit = true;
    }
    $scope.ChangeSysitem = function (item) {
        if (item.DurationType === "SB") {
            item.Duration = "";
        }
    }
    $scope.ChangeOnSetItem1 = function (item) {
        if (item.ShowDateFormat) {
            item.DurationDate =  null;
        } else {
            item.Duration = '';
            item.DurationType = 'D';
        }
        item.ShowDateFormat = !item.ShowDateFormat;
    }
    $scope.ChangeSystemicHistoryDate = function (item) {
        item.Duration = "";
        item.DurationType = "";
    }
    //systamic history 
    $scope.ChangeSmokingValue = function (value, item) {
        if (value == 1) {
            if (item.SmokingType == "" || item.SmokingType == "No") {
                item.SmokingType = "Yes";


                // $scope.HealthPhysicalObj.LifestyleHistory.SmokingType = item;
                if (item.SmokingType == 'Yes') {
                    var Array = $filter('filter')($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist, { 'DeleteInd': 'N' }, true);
                    if (Array.length == 0) {
                        var SmokingObj = {
                            "SmokingHistoryId": 0,
                            "SmokingQuantityId": 0,
                            "SmokingQuantityName": "",
                            "SmokingStatusId": 0,
                            "SmokingStatusName": "",
                            "SmokingDuration": "",
                            "SmokingDurationType": "D",
                            "SmokingDurationTypeName": "Day(s)",
                            "SmokingDurationDate": null,
                            "SmokeShowDateFormat": true,
                            "SmokingType": "",
                            "DeleteInd": 'N',
                            "SmokingFromDate": null,
                            "SmokingToDate": "",
                        }
                        $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.push(SmokingObj);

                    }
                }
            }
            else {
                item.SmokingType = "";
                if ($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.length > 0) {
                    angular.forEach($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist, function (item) {
                        if (item.SmokingHistoryId !== 0) {
                            item.DeleteInd = 'Y';
                        } else {
                            var removeindex = $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.indexOf(item);
                            if (removeindex > -1) {
                                $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.splice(removeindex, 1);
                            }
                        }
                    });
                }
            }
        }
        if (value == 2) {
            if (item.SmokingType == "" || item.SmokingType == "Yes") {
                item.SmokingType = "No";
                item.SmokingStatusId = 0;
                item.SmokingQuantityId = 0;
                item.SmokingQuantityName = "";

                item.Smokinglist = item.Smokinglist || [];
                var newArray = [];
                if (item.Smokinglist.length > 0) {
                    angular.forEach(item.Smokinglist, function (item) {
                        if (item.SmokingHistoryId != 0) {
                            item.DeleteInd = 'Y';
                            newArray.push(item);
                        }
                    });
                }
                item.Smokinglist = angular.copy(newArray);
            }
            else {
                item.SmokingType = "";
                if ($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.length > 0) {
                    angular.forEach($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist, function (item) {
                        if (item.SmokingHistoryId !== 0) {
                            item.DeleteInd = 'Y';
                        } else {
                            var removeindex = $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.indexOf(item);
                            if (removeindex > -1) {
                                $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.splice(removeindex, 1);
                            }
                        }
                    });
                }
            }
        }
    }
    $scope.OnClickNormal = function () {
        if ($scope.HealthPhysicalObj.AirwayObj.IsNormal) {
            $scope.HealthPhysicalObj.AirwayObj.ROMTMS = "Full";
            $scope.HealthPhysicalObj.AirwayObj.ROMNECKAP = "Full";
            $scope.HealthPhysicalObj.AirwayObj.ROMNECKLAT = "Full";
        } else {
            $scope.HealthPhysicalObj.AirwayObj.ROMTMS = "";
            $scope.HealthPhysicalObj.AirwayObj.ROMNECKAP = "";
            $scope.HealthPhysicalObj.AirwayObj.ROMNECKLAT = "";
            //$scope.HealthPhysicalModal.AirwayObj.Class = "";
        }
    };
    $scope.ChangeAlcoholValue = function (val, item) {
        if (val == 1) {
            if (item.AlcoholType == "" || item.AlcoholType == "No") {
                item.AlcoholType = "Yes";

                //$scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = 'Yes';
            }
            else {
                item.AlcoholType = ""
                // $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = 'No';
                item.AlcoholStatusId = 0;
                item.AlcoholDurationDate = null;
                item.AlcoholQuantityId = 0;
                item.AlcoholDuration = ''
                item.AlcoholDurationType = 'D'
                item.AlcoShowDateFormat = true;
            }
        }
        if (val == 2) {
            if (item.AlcoholType == "" || item.AlcoholType == "Yes") {
                item.AlcoholType = "No";
            }
            else {
                item.AlcoholType = ""
                //$scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = 'No';
                item.AlcoholStatusId = 0;
                item.AlcoholDurationDate = null;
                item.AlcoholQuantityId = 0;
                item.AlcoholDuration = ''
                item.AlcoholDurationType = 'D'
                item.AlcoShowDateFormat = true;
            }
        }
    };
    $scope.ChangeDrugValue = function (val, item) {
        if (val == 1) {
            if (item.DrugType == "" || item.DrugType == "No") {
                item.DrugType = "Yes";
            }
            else {
                item.DrugType = ""
                item.DrugStatusId = 0;
                item.DrugDurationDate = null;
                item.DrugQuantityId = 0;
                item.DrugDurationType ='D'
                item.DrugDuration = ''
                item.DrugShowDateFormat = true;
            }
        }

        if (val == 2) {
            if (item.DrugType == "" || item.DrugType == "Yes") {
                item.DrugType = "No";
            }
            else {
                item.DrugType = ""
                item.DrugStatusId = 0;
                item.DrugDurationDate = null;
                item.DrugQuantityId = 0;
                item.DrugDuration = ''
                item.DrugShowDateFormat = true;
                item.DrugDurationType = 'D'
            }
        }
        //if (val == 'Yes') {
        //    $scope.HealthPhysicalObj.LifestyleHistory.DrugType = 'Yes';
        //} else {
        //    $scope.HealthPhysicalObj.LifestyleHistory.DrugType = 'No';
        //    $scope.HealthPhysicalObj.LifestyleHistory.DrugStatusId = 0;
        //    $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate = null;
        //    $scope.HealthPhysicalObj.LifestyleHistory.DrugQuantityId = 0;
        //}
    };

    $scope.ChangePsychis = function (val, item) {
        if (val == 1) {
            if (item.PsychisType == "" || item.PsychisType == "No") {
                item.PsychisType = "Yes";
            }
            else {
                item.PsychisType = ""
            }
        }
        if (val == 2) {
            if (item.PsychisType == "" || item.PsychisType == "Yes") {
                item.PsychisType = "No";
            }
            else {
                item.PsychisType = ""

            }
        }
    };
    $scope.SelectUrineAnalysis = function (val, item) {
        if (val == 1) {
            if (item.ResultValue == "" || item.ResultValue == "NEGATIVE") {
                item.ResultValue = "POSITIVE";
                item.DeleteInd = "N";
            } else {
                item.ResultValue = "";
                item.ResultId = item.ResultId || null;
                if (item.ResultId != null) {
                    item.DeleteInd = "Y";
                }
            }
        }
        if (val == 2) {
            if (item.ResultValue == "" || item.ResultValue == "POSITIVE") {
                item.ResultValue = "NEGATIVE";
                item.DeleteInd = "N";
            } else {
                item.ResultValue = "";
                item.ResultId = item.ResultId || null;
                if (item.ResultId != null) {
                    item.DeleteInd = "Y";
                }
            }
        }

    }
    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }
    $scope.ChangeAllDrugSelect = function (checked) {
        if (checked == true) {
            if ($scope.HealthPhysicalObj.DrugNames.length > 0) {
                angular.forEach($scope.HealthPhysicalObj.DrugNames, function (item) {
                    item.Ischecked = true;
                });
            }
            if ($scope.HealthPhysicalObj.LifestyleHistory.DrugArray.length > 0) {
                angular.forEach($scope.HealthPhysicalObj.DrugNames, function (item) {
                    var statusfilter = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistory.DrugArray, { "HistoryHabitsId": item.HistoryHabitsID }, true) || [];
                    if (statusfilter.length > 0) {
                        angular.forEach($scope.HealthPhysicalObj.LifestyleHistory.DrugArray, function (ditem) {
                            if (item.HistoryHabitsID == ditem.HistoryHabitsId) {
                                ditem.ActiveInd = "Y";
                            }
                        });
                    } else {
                        var obj = {
                            "DrugHistoryId": 0,
                            "ActiveInd": "Y",
                            "HabitsDescription": item.HabitsDescription,
                            "HistoryHabitsId": item.HistoryHabitsID,
                            "HabitsId": item.HabitsId
                        };
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugArray.push(obj);
                    }
                });

            } else {
                angular.forEach($scope.HealthPhysicalObj.DrugNames, function (item) {
                    var obj = {
                        "DrugHistoryId": 0,
                        "ActiveInd": "Y",
                        "HabitsDescription": item.HabitsDescription,
                        "HistoryHabitsId": item.HistoryHabitsID,
                        "HabitsId": item.HabitsId
                    };
                    $scope.HealthPhysicalObj.LifestyleHistory.DrugArray.push(obj);
                });
            }
            $scope.DrugListSelectedText = "All Selected";
        } else {
            if ($scope.HealthPhysicalObj.DrugNames.length > 0) {
                angular.forEach($scope.HealthPhysicalObj.DrugNames, function (item) {
                    item.Ischecked = false;
                });
            }
            if ($scope.HealthPhysicalObj.LifestyleHistory.DrugArray.length > 0) {
                var DrugList = [];
                angular.forEach($scope.HealthPhysicalObj.DrugNames, function (item) {
                    var statusfilter = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistory.DrugArray, { "HistoryHabitsId": item.HistoryHabitsID }, true) || [];

                    if (statusfilter.length > 0) {
                        angular.forEach($scope.HealthPhysicalObj.LifestyleHistory.DrugArray, function (ditem, index) {
                            if (item.HistoryHabitsID == ditem.HistoryHabitsId) {
                                if (ditem.DrugHistoryId != 0) {
                                    ditem.ActiveInd = "N";
                                    DrugList.push(ditem);
                                } else {
                                    //$scope.obj.LifestyleHistory.DrugArray.splice(index, 1);
                                }
                            }
                        });
                    }
                });
                $scope.HealthPhysicalObj.LifestyleHistory.DrugArray = angular.copy(DrugList);
            }

            $scope.DrugListSelectedText = "Select";
        }

        console.log(JSON.stringify($scope.HealthPhysicalObj.LifestyleHistory.DrugArray));
    };
    $scope.ChangeDrugItemselect = function (item, checked) {
        if (checked == true) {
            if ($scope.HealthPhysicalObj.LifestyleHistory.DrugArray.length > 0) {
                var statusfilter = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistory.DrugArray, { "HistoryHabitsId": item.HistoryHabitsID }, true) || [];
                if (statusfilter.length > 0) {
                    angular.forEach($scope.HealthPhysicalObj.LifestyleHistory.DrugArray, function (ditem) {
                        if (item.HistoryHabitsID == ditem.HistoryHabitsId) {
                            ditem.ActiveInd = "Y";
                        }
                    });
                } else {
                    var obj = {
                        "DrugHistoryId": 0,
                        "ActiveInd": "Y",
                        "HabitsDescription": item.HabitsDescription,
                        "HistoryHabitsId": item.HistoryHabitsID,
                        "HabitsId": item.HabitsId
                    };
                    $scope.HealthPhysicalObj.LifestyleHistory.DrugArray.push(obj);
                }

            } else {
                var obj = {
                    "DrugHistoryId": 0,
                    "ActiveInd": "Y",
                    "HabitsDescription": item.HabitsDescription,
                    "HistoryHabitsId": item.HistoryHabitsID,
                    "HabitsId": item.HabitsId
                };
                $scope.HealthPhysicalObj.LifestyleHistory.DrugArray.push(obj);
            }
        } else {
            if ($scope.HealthPhysicalObj.LifestyleHistory.DrugArray.length > 0) {
                var statusfilter = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistory.DrugArray, { "HistoryHabitsId": item.HistoryHabitsID }, true) || [];

                if (statusfilter.length > 0) {
                    angular.forEach($scope.HealthPhysicalObj.LifestyleHistory.DrugArray, function (ditem, index) {
                        if (item.HistoryHabitsID == ditem.HistoryHabitsId) {
                            if (ditem.DrugHistoryId != 0) {
                                ditem.ActiveInd = "N";
                            } else {
                                $scope.HealthPhysicalObj.LifestyleHistory.DrugArray.splice(index, 1);
                            }
                        }
                    });
                }
            }
        }

        var filterAllselect = $filter("filter")($scope.HealthPhysicalObj.DrugNames, { "Ischecked": true }, true) || [];
        if (filterAllselect.length === $scope.HealthPhysicalObj.DrugNames.length) {
            $scope.AllDrugListSelected = true;
            $scope.DrugListSelectedText = "All Selected";
        }
        else if (filterAllselect.length > 0) {
            if (filterAllselect.length == 1) {
                $scope.AllDrugListSelected = false;
                $scope.DrugListSelectedText = filterAllselect[0].HabitsDescription;
            } else {
                $scope.AllDrugListSelected = false;
                $scope.DrugListSelectedText = "Selected";
            }
        } else {
            $scope.AllDrugListSelected = false;
            $scope.DrugListSelectedText = "Select";
        }

        console.log(JSON.stringify($scope.HealthPhysicalObj.LifestyleHistory.DrugArray));
    }



    $scope.ChangeNormalLimit = function (item, type) {
        if (type == 'Anesthesia') {
            if (item.Name == "Prothrombin Time") {
                item.AbNormal = false;
            }
            if (item.Name == "Partial Thromboplastin time") {
                item.AbNormal = false;
            }
            if (item.Name == "Li-Fraumeni Syndrome") {
                item.AbNormal = false;
            }
            if (item.Name != "" || item.Name == "") {
                item.AbNormal = false;
            }
        } else {
            if (item.Name == "Prothrombin Time") {
                item.AbNormal = false;
            }
            if (item.Name == "Partial Thromboplastin time") {
                item.AbNormal = false;
            }
            if (item.Name == "Li-Fraumeni Syndrome") {
                item.AbNormal = false;
            }
            if (item.Name != "") {
                item.AbNormal = false;
            }
            if (item.Name != "" || item.Name == "") {
                item.AbNormal = false;
            }
        }
    }

    $scope.ChangeAbnormal = function (item, type) {
        if (type == 'Anesthesia') {
            if (item.Name == "Prothrombin Time") {
                item.Normal = false;
            }
            if (item.Name == "Partial Thromboplastin time") {
                item.Normal = false;
            }
            if (item.Name == "Li-Fraumeni Syndrome") {
                item.Normal = false;
            }
            if (item.Name != "" || item.Name == "") {
                item.Normal = false;
            }
        }
        else {
            if (item.Name == "Prothrombin Time") {
                item.Normal = false;
            }
            if (item.Name == "Partial Thromboplastin time") {
                item.Normal = false;
            }
            if (item.Name == "Li-Fraumeni Syndrome") {
                item.Normal = false;
            }
            if (item.Name != "" || item.Name == "") {
                item.Normal = false;
            }
        }
    }

  

    $scope.ChangeCardiacApp = function (item) {

        if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
            var List = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, { "HistoryId": 1 }, true);
            if (List.length > 0) {
                if (List[0].PatientDetailId === 0) {
                    var indexToRemove = $scope.HealthPhysicalObj.SystemicHistoryArray.indexOf(List[0]);
                    if (indexToRemove !== -1) {
                        $scope.HealthPhysicalObj.SystemicHistoryArray.splice(indexToRemove, 1);
                    }
                } else {
                    List[0].DeleteInd = 'Y';
                }
            }
        }
        $scope.obj.isNKSHSelected = false;
        if (item.IsNormal == false && item.IsChecked == true && $scope.HealthPhysicalObj.IsCardiacWNL == true) {
            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                if (kitem.TypeId === 1) {
                    if (kitem.IsNormal == true) {
                        kitem.IsChecked = false;
                        $scope.HealthPhysicalObj.IsCardiacWNL = false;
                    }

                }
            });

        }
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }


    $scope.ChangeNeuroApp = function (item) {
        if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
            var List = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, { "HistoryId": 1 }, true);
            if (List.length > 0) {
                if (List[0].PatientDetailId === 0) {
                    var indexToRemove = $scope.HealthPhysicalObj.SystemicHistoryArray.indexOf(List[0]);
                    if (indexToRemove !== -1) {
                        $scope.HealthPhysicalObj.SystemicHistoryArray.splice(indexToRemove, 1);
                    }
                } else {
                    List[0].DeleteInd = 'Y';
                }
            }
        }
        $scope.obj.isNKSHSelected = false;
        if (item.IsNormal == false && item.IsChecked == true && $scope.HealthPhysicalObj.IsNeurologicWNL == true) {

            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                if (kitem.TypeId === 5) {
                    if (kitem.IsNormal == true) {
                        kitem.IsChecked = false;
                        $scope.HealthPhysicalObj.IsNeurologicWNL = false;
                    }

                }
            });

        }
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }

    $scope.ChangeHeentApp = function (item) {
        if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
            var List = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, { "HistoryId": 1 }, true);
            if (List.length > 0) {
                if (List[0].PatientDetailId === 0) {
                    var indexToRemove = $scope.HealthPhysicalObj.SystemicHistoryArray.indexOf(List[0]);
                    if (indexToRemove !== -1) {
                        $scope.HealthPhysicalObj.SystemicHistoryArray.splice(indexToRemove, 1);
                    }
                } else {
                    List[0].DeleteInd = 'Y';
                }
            }
        }
        $scope.obj.isNKSHSelected = false;
        if (item.IsNormal == false && item.IsChecked == true && $scope.HealthPhysicalObj.IsHeentWNL == true) {
            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                if (kitem.TypeId === 16) {
                    if (kitem.IsNormal == true) {
                        kitem.IsChecked = false;
                        $scope.HealthPhysicalObj.IsHeentWNL = false;
                    }

                }
            });

        }
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }
    $scope.ChangeLungsApp = function (item) {
        if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
            var List = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, { "HistoryId": 1 }, true);
            if (List.length > 0) {
                if (List[0].PatientDetailId === 0) {
                    var indexToRemove = $scope.HealthPhysicalObj.SystemicHistoryArray.indexOf(List[0]);
                    if (indexToRemove !== -1) {
                        $scope.HealthPhysicalObj.SystemicHistoryArray.splice(indexToRemove, 1);
                    }
                } else {
                    List[0].DeleteInd = 'Y';
                }
            }
        }
        $scope.obj.isNKSHSelected = false;
        if (item.IsNormal == false && item.IsChecked == true && $scope.HealthPhysicalObj.IsLungsWNL == true) {
            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                if (kitem.TypeId === 17) {
                    if (kitem.IsNormal == true) {
                        kitem.IsChecked = false;
                        $scope.HealthPhysicalObj.IsLungsWNL = false;
                    }
                }
            });

        }
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }


    $scope.ChangeGeneralApp = function (item) {
        if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
            var List = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, { "HistoryId": 1 }, true);
            if (List.length > 0) {
                if (List[0].PatientDetailId === 0) {
                    var indexToRemove = $scope.HealthPhysicalObj.SystemicHistoryArray.indexOf(List[0]);
                    if (indexToRemove !== -1) {
                        $scope.HealthPhysicalObj.SystemicHistoryArray.splice(indexToRemove, 1);
                    }
                } else {
                    List[0].DeleteInd = 'Y';
                }
            }
        }
        $scope.obj.isNKSHSelected = false;
        if (item.IsNormal == false && item.IsChecked == true && $scope.HealthPhysicalObj.IsGeneralappearanceWNL == true) {
            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                if (kitem.TypeId === 21) {
                    if (kitem.IsNormal == true) {
                        kitem.IsChecked = false;
                        $scope.HealthPhysicalObj.IsGeneralappearanceWNL = false;
                    }

                }
            });
        }
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }

    $scope.ChangeOthersystems = function (item) {

        if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
            var List = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, { "HistoryId": 1 }, true);
            if (List.length > 0) {
                if (List[0].PatientDetailId === 0) {
                    var indexToRemove = $scope.HealthPhysicalObj.SystemicHistoryArray.indexOf(List[0]);
                    if (indexToRemove !== -1) {
                        $scope.HealthPhysicalObj.SystemicHistoryArray.splice(indexToRemove, 1);
                    }
                } else {
                    List[0].DeleteInd = 'Y';
                }
            }
        }
        $scope.obj.isNKSHSelected = false;
        if (item.IsChecked == false) {
            item.PatientDetailId = item.PatientDetailId || 0;
            if (item.PatientDetailId != 0) {
                item.DeleteInd = "Y";
            }
        } else {
            item.DeleteInd = "N";
            if (item.TypeId == 2) {
                $scope.HealthPhysicalObj.IsPulmonaryWNL = false;
            } if (item.TypeId == 3) {
                $scope.HealthPhysicalObj.IsHepaticWNL = false;
            } if (item.TypeId == 6) {
                $scope.HealthPhysicalObj.IsHemeOncWNL = false;
            } if (item.TypeId == 7) {
                $scope.HealthPhysicalObj.IsNervousSystemWNL = false;
            } if (item.TypeId == 8) {
                $scope.HealthPhysicalObj.IsKidneyDiseaseWNL = false;
            } if (item.TypeId == 9) {
                $scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL = false;
            } if (item.TypeId == 10) {
                $scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL = false;
            } if (item.TypeId == 11) {
                $scope.HealthPhysicalObj.IsPsychosisWNL = false;
            } if (item.TypeId == 12) {
                $scope.HealthPhysicalObj.IsOthersWNL = false;
            }
        }
    }
    $scope.toggleNormall = function () {

        if ($scope.obj.AllergyItems !== undefined) {
            var DeleteIndFilter = $filter("filter")($scope.obj.AllergyItems, { "DeleteInd": "Y", "AllergyId": 1 }, true);
            var DeleteFilter = $filter("filter")($scope.obj.AllergyItems, { "DeleteInd": "Y" }, true);
            var NkaFilter = $filter("filter")($scope.obj.AllergyItems, { "AllergyId": 1, "DeleteInd": "N" }, true);
            if ($scope.obj.AllergyItems.length === 0 || (DeleteIndFilter.length > 0 && DeleteFilter.length > 0)) {
                if (NkaFilter.length === 0) {
                    var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "TypeName": "Allergies", "Id": 1 }, true);
                    if (filteredArray.length > 0) {
                        var obj = {
                            "PatientDetailId": 0,
                            "IsShowAllergySnomedAddInd": false,
                            "AllergyId": filteredArray[0].Id || null,
                            "AllergyName": filteredArray[0].Name || '',
                            "OrganId": 4,
                            "SeverityId": null,
                            "SNOMEDId": null,
                            "RxNormID": null,
                            "SeverityName": '',
                            "ReactionId": null,
                            "StatusId": null,
                            "Duration": null,
                            "AllergyTypeId": null,
                            "IsEdit": false,
                            "ShowNote": false,
                            "ShowDateFormat": false,
                            "ReactionName": '',
                            "DurationDate": '',
                            "StatusName": '',
                            "Remarks": '',
                            "SnomedCode": '',
                            "DurationType": 'D',
                            "OnsetType": 'Date',
                            "DiagnosisObject": 'D',
                            "DeleteInd": 'N',

                        }
                        $scope.obj.AllergyItems.unshift(obj);
                        $scope.obj.isNKASelected = true;
                    };
                }
            }
        }
        if ($scope.obj.SurgicalHistoryArray !== undefined) {
            var DeleteIndFilter = $filter("filter")($scope.obj.SurgicalHistoryArray, { "DeleteInd": "Y", "HistoryId": 1 }, true);
            var NoneFilter = $filter("filter")($scope.obj.SurgicalHistoryArray, { "HistoryId": 1, "DeleteInd": "N" }, true);
            if ($scope.obj.SurgicalHistoryArray.length === 0 || DeleteIndFilter.length > 0) {
                if (NoneFilter.length === 0) {
                    var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "TypeName": "SurgicalHistory" }, true);
                    if (filteredArray.length > 0) {
                        var object = {
                            "PatientDetailId": 0,
                            "HistoryId": filteredArray[0].Id,
                            "HistoryName": filteredArray[0].Name,
                            "IsEdit": false,
                            "showSurgicalHistory": false,
                            "ActiveInd": true,
                            "DeleteInd": 'N',
                            //"OrganId": $scope.obj.SurgicalHistoryItem || "",
                            "DurationDate": "",
                            "Duration": "",
                            "DurationType": "D",
                            "DurationTypeName": "Day(s)",
                            "Remarks": "",
                            "ShowDateFormat": false,
                            "ShowNote": false,
                            "ModifierId": "",
                            "MODIFIERCODE": "",
                            "ModifierObj": "",
                            "CPTCode": "",
                            "ProcedureId": "",
                            "CPTObj": "",
                            "ShowDateFormat": false
                        };
                        $scope.obj.SurgicalHistoryArray.unshift(object);
                        $scope.obj.isNKSGHSelected = true;
                    };
                }

            }
        }
        if ($scope.HealthPhysicalObj.SystemicHistoryArray !== undefined) {
            let tempSystemicHistoryArray = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, { "IsChecked": true }, true);
            var DeleteIndFilter = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, { "DeleteInd": "Y", "HistoryId": 1 }, true);
            var NoneFilter = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, { "HistoryId": 1, "DeleteInd": "N" }, true);
            if (tempSystemicHistoryArray.length === 0 || DeleteIndFilter.length > 0) {
                if (NoneFilter.length === 0) {
                    var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "TypeName": "SystemicHistory" }, true);
                    if (filteredArray.length > 0) {
                        var object = {
                            "PatientDetailId": 0,
                            "HistoryId": filteredArray[0].Id,
                            "HistoryName": filteredArray[0].Name,
                            "IsEdit": false,
                            "ActiveInd": true,
                            "DeleteInd": 'N',
                            "Remarks": "",
                            "SnomedCodeobj": "",
                            "OrganId": "",
                            "Duration": "",
                            "DurationType": "D",
                            "DurationTypeName": "Day(s)",
                            "DurationDate": "",
                            "ShowNote": false,
                            "SNOMEDId": null,
                            "SNOMEDCODE": "",
                            "ICD10CODE": "",
                            "DiagnosisObject": "",
                            "DiagnosisId": null,
                            "SeverityId": null,
                            "StatusId": 50,
                            "SeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                            "ShowDateFormat": false
                        };
                        $scope.HealthPhysicalObj.SystemicHistoryArray.unshift(object);
                        $scope.obj.isNKSHSelected = true;
                    };
                }

            }
        }

        let tempCurrentEyeMedicationsArray = $filter('filter')($scope.obj.CurrentSystemicMedicationsHistory, { 'MedicationLocationTypeId': 1 }, true) || [];
        if (tempCurrentEyeMedicationsArray !== undefined) {
            /*  var DeleteIndFilter = $filter("filter")($scope.obj.CurrentEyeMedicationArray, { "DeleteInd": "Y" }, true);*/
            var DeleteIndFilter = $filter("filter")(tempCurrentEyeMedicationsArray, { "DeleteInd": "Y", "MedicineId": 1 }, true);
            var NoneFilter = $filter("filter")(tempCurrentEyeMedicationsArray, { "MedicineId": 1, "DeleteInd": "N" }, true);
            if (tempCurrentEyeMedicationsArray.length === 0 || DeleteIndFilter.length > 0) {
                if (NoneFilter.length === 0) {
                    var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "TypeName": "CurrentEyeMedications" }, true);
                    if (filteredArray.length > 0) {
                        var object = {
                            "CurrentEyeMedicalConditionId": 0,
                            "HospitalId": $scope.HospitalId,
                            "MedicineId": filteredArray[0].Id || 0,
                            "MedicineType": "",
                            "MedicineTypeId": 0,
                            "MedicineName": filteredArray[0].Name || "",
                            "MedicineObject": "",
                            "RcopiaDrugId": "",
                            "RcopiaMedicationId": 0,
                            "MedicationName": "",
                            "DrugNDCID": "",
                            "DrugFirstDataBankMedID": "",
                            "DrugGenericId": "",
                            "DrugBrandName": "",
                            "DrugGenericName": "",
                            "DrugForm": "",
                            "DrugStrength": "",
                            "DrugSchedule": "",
                            "DrugSupply": "",
                            "DrugCompound": "",
                            "MedicationTypeId": "",
                            "MedicationTypeName": "",
                            "Sig": "",
                            "SigId": 0,
                            "ActionId": "",
                            "Action": "",
                            "DoseId": "",
                            "Dose": "",
                            "DoseUnitId": "",
                            "DoseUnit": "",
                            "RouteId": "",
                            "Route": "",
                            "FrequencyId": "",
                            "Frequency": "",
                            "DoseOtherId": "",
                            "DoseOther": "",
                            "DaysSupplyId": "",
                            "DaysSupply": "",
                            "Quantity": "",
                            "QuantityUnitId": "",
                            "QuantityUnit": "",
                            "RefillId": "",
                            "Refills": "",
                            "SubstitutionPermitted": "y",
                            "PatientInstructions": "",
                            "DeleteInd": "N",
                            "OtherNotes": "",
                            "Remarks": "",
                            "StartDate": null,
                            "StopDate": null,
                            "FillDate": '',
                            "StopReason": "",
                            "RcopiaMedicationStatus": "",
                            "IsEdit": true,
                            "ShowNote": false,
                            "MedicationLocationTypeId": 1,
                            "IsMedicationStopped": false

                        };
                        $scope.obj.CurrentSystemicMedicationsHistory.push(object);
                        $scope.obj.isNKCEMSelected = true;
                    }
                }
            }
        }

        let tempCurrentSystemicMedicationsArray = $filter('filter')($scope.obj.CurrentSystemicMedicationsHistory, { 'MedicationLocationTypeId': 2 }, true) || [];
        if (tempCurrentSystemicMedicationsArray !== undefined) {
            var DeleteIndFilter = $filter("filter")(tempCurrentSystemicMedicationsArray, { "DeleteInd": "Y", "MedicineId": 2 }, true);
            var NoneFilter = $filter("filter")(tempCurrentSystemicMedicationsArray, { "MedicineId": 2, "DeleteInd": "N" }, true);
            if (tempCurrentSystemicMedicationsArray.length === 0 || DeleteIndFilter.length > 0) {
                if (NoneFilter.length == 0) {
                    var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "TypeName": "CurrentSystemicMedications" }, true);
                    if (filteredArray.length > 0) {
                        var object = {
                            "CurrentSystemicMedicationId": 0,
                            "HospitalId": $scope.HospitalId,
                            "MedicineId": filteredArray[0].Id || 0,
                            "MedicineType": "",
                            "MedicineTypeId": null,
                            "MedicineName": filteredArray[0].Name || "",
                            "MedicineObject": "",
                            "RcopiaDrugId": "",
                            "RcopiaMedicationId": 0,
                            "MedicationName": "",
                            "DrugNDCID": "",
                            "DrugFirstDataBankMedID": "",
                            "DrugGenericId": "",
                            "DrugBrandName": "",
                            "DrugGenericName": "",
                            "DrugForm": "",
                            "DrugStrength": "",
                            "DrugSchedule": "",
                            "DrugSupply": "",
                            "DrugCompound": "",
                            "MedicationTypeId": "",
                            "MedicationTypeName": "",
                            "Sig": "",
                            "SigId": 0,
                            "ActionId": "",
                            "Action": "",
                            "DoseId": "",
                            "Dose": "",
                            "DoseUnitId": "",
                            "DoseUnit": "",
                            "RouteId": "",
                            "Route": "",
                            "FrequencyId": "",
                            "Frequency": "",
                            "DoseOtherId": "",
                            "DoseOther": "",
                            "DaysSupplyId": "",
                            "DaysSupply": "",
                            "Quantity": "",
                            "QuantityUnitId": "",
                            "QuantityUnit": "",
                            "RefillId": "",
                            "Refills": "",
                            "SubstitutionPermitted": "y",
                            "PatientInstructions": "",
                            "DeleteInd": "N",
                            "OtherNotes": "",
                            "Remarks": "",
                            "StartDate": null,
                            "StopDate": null,
                            "FillDate": '',
                            "StopReason": "",
                            "RcopiaMedicationStatus": "",
                            "IsEdit": true,
                            "ShowNote": false,
                            "MedicationLocationTypeId": 2,
                            "IsMedicationStopped": false

                        };
                        $scope.obj.CurrentSystemicMedicationsHistory.push(object);
                        $scope.obj.isNKCSMSelected = true;
                    };
                }
            }
        }

        if ($scope.HealthPhysicalObj.LifestyleHistory !== undefined) {
            if ($scope.HealthPhysicalObj.LifestyleHistory.SmokingType == "" && $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType == "" && $scope.HealthPhysicalObj.LifestyleHistory.DrugType == "") {
                $scope.obj.LifestyleDetail = $scope.obj.LifestyleDetail || [];
                $scope.obj.LifestyleDetail.push($scope.HealthPhysicalObj.LifestyleHistory);
                var DeleteIndFilter = $filter("filter")($scope.obj.LifestyleDetail, { "DeleteInd": "Y", "SmokingType": "No", "AlcoholType": "No", "DrugType": "No" }, true);
                var NoneFilter = $filter("filter")($scope.obj.LifestyleDetail, { "DeleteInd": "N", "SmokingType": "No", "AlcoholType": "No", "DrugType": "No" }, true);
                var SmokeArray = $filter("filter")($scope.obj.LifestyleDetail, { "DeleteInd": "N", "SmokingType": "Yes" }, true);
                var AlcoholArray = $filter("filter")($scope.obj.LifestyleDetail, { "DeleteInd": "N", "AlcoholType": "Yes" }, true);
                var DrugArray = $filter("filter")($scope.obj.LifestyleDetail, { "DeleteInd": "N", "DrugType": "Yes" }, true);
                if ($scope.obj.LifestyleDetail.length === 1 || DeleteIndFilter.length > 0) {
                    if (SmokeArray.length == 0 && AlcoholArray.length == 0 && DrugArray.length == 0) {
                        if (NoneFilter.length == 0) {
                            var Lifeobject = {
                                "PatientDetailId": 0,
                                "ActiveInd": "Y",
                                "Smokinglist": [],
                                "AlcoholQuantityId": 0,
                                "AlcoholQuantityName": "",
                                "AlcoholStatusId": 0,
                                "AlcoholStatusName": "",
                                "AlcoholDuration": "",
                                "AlcoholDurationType": "D",
                                "AlcoholDurationTypeName": "Day(s)",
                                "AlcoholDurationDate": null,
                                "DrugQuantityId": 0,
                                "DrugQuantityName": "",
                                "DrugWhenQuitId": 0,
                                "DrugWhenQuit": "",
                                "DrugDuration": "",
                                "DrugDurationType": "D",
                                "DrugDurationTypeName": "Day(s)",
                                "DrugDurationDate": null,
                                "DrugArray": [],
                                "Remarks": "",
                                "ShowNote": false,
                                "SmokeShowDateFormat": true,
                                "AlcoShowDateFormat": true,
                                "DrugShowDateFormat": true,
                                "SmokingType": "No",
                                "AlcoholType": "No",
                                "DrugType": "No",
                                "DeleteInd": "N",
                                "SmokingFromDate": "",
                                "SmokingToDate": "",
                                "PsychisType": "",
                                "PsychisType": "No"
                            }
                            $scope.HealthPhysicalObj.LifestyleHistory = angular.copy(Lifeobject);
                            var SmokingObj = {
                                "SmokingHistoryId": 0,
                                "SmokingQuantityId": 0,
                                "SmokingQuantityName": "",
                                "SmokingStatusId": 0,
                                "SmokingStatusName": "",
                                "SmokingDuration": "",
                                "SmokingDurationType": "D",
                                "SmokingDurationTypeName": "Day(s)",
                                "SmokingDurationDate": null,
                                "SmokeShowDateFormat": true,
                                "SmokingType": "",
                                "DeleteInd": 'N',
                                "SmokingFromDate": null,
                                "SmokingToDate": "",
                            }
                            $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.push(SmokingObj);
                        }
                    }
                }
            }
        }
    };


    $scope.Rosaacordian = {

        "IsAllergysummry": false,
        "IsSurgicalsummry": false,
        "IsCurrentSystemicsummry": false,
        "IsCurrentEyesummry": false,
        "IsSocialsummry": false,
        "IsSystemicsummry": false,

        "IsAllergyacordian": false,
        "IsSurgicalacordian": false,
        "IsCurrentSystemicacordian": false,
        "IsCurrentEyeacordian": false,
        "IsSocialacordian": false,
        "IsSystemicacordian": false,
    }
    $scope.RosaacordianShowhide2 = function (type) {
        if (type == 1) {
            $scope.Rosaacordian.IsAllergyacordian = !$scope.Rosaacordian.IsAllergyacordian;
            $scope.Rosaacordian.IsSurgicalacordian = false
            $scope.Rosaacordian.IsCurrentSystemicacordian = false
            $scope.Rosaacordian.IsCurrentEyeacordian = false
            $scope.Rosaacordian.IsSocialacordian = false
            $scope.Rosaacordian.IsSystemicacordian = false
            if ($scope.obj.AllergyItems.length > 0) {
                $scope.Rosaacordian.IsAllergysummry = true;
            } else {
                $scope.Rosaacordian.IsAllergysummry = false;
            }
        }
        else if (type == 2) {
            $scope.Rosaacordian.IsAllergyacordian = false
            $scope.Rosaacordian.IsSurgicalacordian = !$scope.Rosaacordian.IsSurgicalacordian;
            $scope.Rosaacordian.IsCurrentSystemicacordian = false
            $scope.Rosaacordian.IsCurrentEyeacordian = false
            $scope.Rosaacordian.IsSocialacordian = false
            $scope.Rosaacordian.IsSystemicacordian = false
            if ($scope.obj.SurgicalHistoryArray.length > 0) {
                $scope.Rosaacordian.IsSurgicalsummry = true;
            } else {
                $scope.Rosaacordian.IsSurgicalsummry = false;
            }
        }
        else if (type == 3) {
            $scope.Rosaacordian.IsAllergyacordian = false;
            $scope.Rosaacordian.IsSurgicalacordian = false
            $scope.Rosaacordian.IsCurrentSystemicacordian = !$scope.Rosaacordian.IsCurrentSystemicacordian
            $scope.Rosaacordian.IsCurrentEyeacordian = false
            $scope.Rosaacordian.IsSocialacordian = false
            $scope.Rosaacordian.IsSystemicacordian = false
            if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
                $scope.Rosaacordian.IsCurrentSystemicsummry = true;
            } else {
                $scope.Rosaacordian.IsCurrentSystemicsummry = false;
            }
        }
        else if (type == 4) {
            $scope.Rosaacordian.IsAllergyacordian = false;
            $scope.Rosaacordian.IsSurgicalacordian = false
            $scope.Rosaacordian.IsCurrentSystemicacordian = false
            $scope.Rosaacordian.IsCurrentEyeacordian = !$scope.Rosaacordian.IsCurrentEyeacordian
            $scope.Rosaacordian.IsSocialacordian = false
            $scope.Rosaacordian.IsSystemicacordian = false
            if ($scope.obj.CurrentEyeMedicationArray.length > 0) {
                $scope.Rosaacordian.IsCurrentEyesummry = true;
            } else {
                $scope.Rosaacordian.IsCurrentEyesummry = false;
            }
        }
        else if (type == 5) {
            $scope.Rosaacordian.IsAllergyacordian = false;
            $scope.Rosaacordian.IsSurgicalacordian = false
            $scope.Rosaacordian.IsCurrentSystemicacordian = false
            $scope.Rosaacordian.IsCurrentEyeacordian = false
            $scope.Rosaacordian.IsSocialacordian = !$scope.Rosaacordian.IsSocialacordian
            $scope.Rosaacordian.IsSystemicacordian = false
            if ($scope.HealthPhysicalObj.LifestyleHistory.AlcoholType != '' || $scope.HealthPhysicalObj.LifestyleHistory.SmokingType != '' || $scope.HealthPhysicalObj.LifestyleHistory.DrugType != '' || $scope.HealthPhysicalObj.LifestyleHistory.PsychisType != '') {
                $scope.Rosaacordian.IsSocialsummry = true;
            } else {
                $scope.Rosaacordian.IsSocialsummry = false;
            }
        }
        else if (type == 6) {
            $scope.Rosaacordian.IsAllergyacordian = false;
            $scope.Rosaacordian.IsSurgicalacordian = false
            $scope.Rosaacordian.IsCurrentSystemicacordian = false
            $scope.Rosaacordian.IsCurrentEyeacordian = false
            $scope.Rosaacordian.IsSocialacordian = false
            $scope.Rosaacordian.IsSystemicacordian = !$scope.Rosaacordian.IsSystemicacordian
            if ($scope.obj.SystemicHistoryArray.length > 0) {
                $scope.Rosaacordian.IsSystemicsummry = true;
            } else {
                $scope.Rosaacordian.IsSystemicsummry = false;
            }
        }
    }

    $scope.RosaacordianSummuryShowhide = function (type) {

        if (type == 1) {

            $scope.Rosaacordian.IsAllergysummry = !$scope.Rosaacordian.IsAllergysummry;
            $scope.Rosaacordian.IsSurgicalsummry = false
            $scope.Rosaacordian.IsCurrentSystemicsummry = false
            $scope.Rosaacordian.IsCurrentEyesummry = false
            $scope.Rosaacordian.IsSocialsummry = false;
            $scope.Rosaacordian.IsSystemicsummry = false;
        }
        else if (type == 2) {

            $scope.Rosaacordian.IsAllergysummry = false;
            $scope.Rosaacordian.IsSurgicalsummry = !$scope.Rosaacordian.IsSurgicalsummry;
            $scope.Rosaacordian.IsCurrentSystemicsummry = false
            $scope.Rosaacordian.IsCurrentEyesummry = false
            $scope.Rosaacordian.IsSocialsummry = false;
            $scope.Rosaacordian.IsSystemicsummry = false;

        }
        else if (type == 3) {

            $scope.Rosaacordian.IsAllergysummry = false;
            $scope.Rosaacordian.IsSurgicalsummry = false;
            $scope.Rosaacordian.IsCurrentSystemicsummry = !$scope.Rosaacordian.IsCurrentSystemicsummry;;
            $scope.Rosaacordian.IsCurrentEyesummry = false
            $scope.Rosaacordian.IsSocialsummry = false;
            $scope.Rosaacordian.IsSystemicsummry = false;

        } else if (type == 4) {

            $scope.Rosaacordian.IsAllergysummry = false;
            $scope.Rosaacordian.IsSurgicalsummry = false;
            $scope.Rosaacordian.IsCurrentSystemicsummry = false;
            $scope.Rosaacordian.IsCurrentEyesummry = !$scope.Rosaacordian.IsCurrentEyesummry;
            $scope.Rosaacordian.IsSocialsummry = false;
            $scope.Rosaacordian.IsSystemicsummry = false;
        } else if (type == 5) {
            $scope.Rosaacordian.IsAllergysummry = false;
            $scope.Rosaacordian.IsSurgicalsummry = false;
            $scope.Rosaacordian.IsCurrentSystemicsummry = false;
            $scope.Rosaacordian.IsCurrentEyesummry = false;
            $scope.Rosaacordian.IsSocialsummry = !$scope.Rosaacordian.IsSocialsummry;

            $scope.Rosaacordian.IsSystemicsummry = false;


        }
        else if (type == 6) {
            $scope.Rosaacordian.IsAllergysummry = false;
            $scope.Rosaacordian.IsSurgicalsummry = false;
            $scope.Rosaacordian.IsCurrentSystemicsummry = false;
            $scope.Rosaacordian.IsCurrentEyesummry = false;
            $scope.Rosaacordian.IsSocialsummry = false;

            $scope.Rosaacordian.IsSystemicsummry = !$scope.Rosaacordian.IsSystemicsummry;



        }
    }
    $scope.SaveROS = function () {
        $scope.obj.type = "RosHistory";

        if ($scope.IsComingfrm == 'Admin') {
            $uibModalInstance.close($scope.obj);
            return false;
        }

        if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
            angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (mitem) {
                mitem.IsMedicationStopped = mitem.IsMedicationStopped || false;
                mitem.SelectedMedicationHistory = 'CurrentSystemicMedication';
                mitem.StopDate = mitem.StopDate || null;
                if (mitem.StopDate != null) {
                    mitem.StopDate = $filter('date')(mitem.StopDate, 'yyyy-MM-dd');

                }
                if (angular.isObject(mitem.MedicineObject)) {
                    mitem.Sig = mitem.MedicineObject.Sig || "";
                    mitem.MedicineObject = null;
                } else {
                    mitem.MedicineObject = mitem.MedicineObject || "";
                    if (mitem.MedicineObject != "") {
                        mitem.Sig = mitem.MedicineObject || "";
                    }
                    mitem.Sig = mitem.Sig || "";
                }

            });
        }

        $scope.obj.CurrentEyeMedicationArray = $scope.obj.CurrentEyeMedicationArray || [];
        if ($scope.obj.CurrentEyeMedicationArray.length > 0) {
            angular.forEach($scope.obj.CurrentEyeMedicationArray, function (Aitem) {
                Aitem.SelectedMedicationHistory = 'CurrentEyeMedication';
                Aitem.IsMedicationStopped = Aitem.IsMedicationStopped || false;
            });
        }

        if ($scope.obj.OccularHistoryArray != undefined) {
            if ($scope.obj.OccularHistoryArray.length > 0) {
                angular.forEach($scope.obj.OccularHistoryArray, function (hitem) {
                    if ((hitem.RDuration != '' || hitem.RDurationDate != '' || hitem.RSeverityId != 0) && (hitem.LDuration != '' || hitem.LDurationDate != '' || hitem.LSeverityId != 0)) {
                        hitem.IsBothEye = true;
                    } else {
                        hitem.IsBothEye = false;
                    }
                    if (hitem.DurationDate != "") {
                        hitem.Duration = "";
                        hitem.DurationType = 'D';
                    }
                    if (hitem.Duration != "") {
                        hitem.DurationDate = ""
                    }
                });
            }
        }

        if ($scope.obj.OcularSurgicalHistoryArray != undefined) {
            if ($scope.obj.OcularSurgicalHistoryArray.length > 0) {
                angular.forEach($scope.obj.OcularSurgicalHistoryArray, function (hitem) {
                    if ((hitem.RDuration != '' || hitem.RDurationDate != '' || hitem.RPerformedID != 0 || hitem.RCoManagedID != 0) && (hitem.LDuration != '' || hitem.LDurationDate != '' || hitem.LPerformedID != 0 || hitem.LCoManagedID != 0)) {
                        hitem.IsBothEye = true;
                    } else {
                        hitem.IsBothEye = false;
                    }
                    if (hitem.DurationDate != "") {
                        hitem.Duration = "";
                        hitem.DurationType = 'D';
                    }
                    if (hitem.Duration != "") {
                        hitem.DurationDate = "";
                    }
                });
            }
        }

        $scope.HealthPhysicalObj.LifestyleHistoryArray = $scope.HealthPhysicalObj.LifestyleHistoryArray || [];
        if ($scope.HealthPhysicalObj.LifestyleHistory != undefined) {

            if ($scope.HealthPhysicalObj.LifestyleHistory.PatientDetailId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.SmokingType != "" || $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.length > 0 ||
                $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType != "" || $scope.HealthPhysicalObj.LifestyleHistory.AlcoholQuantityId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.AlcoholStatusId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDuration != "" || $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationDate != "" ||
                $scope.HealthPhysicalObj.LifestyleHistory.DrugType != "" || $scope.HealthPhysicalObj.LifestyleHistory.DrugQuantityId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.DrugWhenQuitId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.DrugDuration != "" || $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate != "" || $scope.HealthPhysicalObj.LifestyleHistory.DrugArray.length > 0 || $scope.HealthPhysicalObj.LifestyleHistory.Remarks != '' || $scope.HealthPhysicalObj.LifestyleHistory.PsychisType != '') {
                if ($scope.HealthPhysicalObj.LifestyleHistory.SmokingType == "No") {
                    if ($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.length > 0) {
                        angular.forEach($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist, function (hitem, index) {
                            if (hitem.SmokingStatusId == 0 && hitem.SmokingDuration == '' && (hitem.SmokingDurationDate == null || hitem.SmokingDurationDate == '') && hitem.SmokingQuantityId == 0 && hitem.SmokingFromDate == '' && hitem.SmokingToDate == '') {
                                $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.splice(index, 1);
                            }
                        });
                    }
                }
                if ($scope.HealthPhysicalObj.LifestyleHistory.SmokingType == "Yes") {
                    if ($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.length > 0) {
                        angular.forEach($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist, function (hitem, hindex) {
                            if (hitem.SmokingStatusId == 0 && hitem.SmokingDuration == '' && (hitem.SmokingDurationDate == null || hitem.SmokingDurationDate == '') && hitem.SmokingQuantityId == 0 && hitem.SmokingFromDate == '' && hitem.SmokingToDate == '') {
                                $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.splice(hindex, 1);
                            }
                        });
                    }
                }

                if ($scope.HealthPhysicalObj.LifestyleHistory.SmokingType == "") {
                    $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist = [];
                }
                if ($scope.HealthPhysicalObj.LifestyleHistory.PatientDetailId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.SmokingType != "" || $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.length > 0 ||
                    $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType != "" || $scope.HealthPhysicalObj.LifestyleHistory.AlcoholQuantityId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.AlcoholStatusId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDuration != "" || $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationDate != "" ||
                    $scope.HealthPhysicalObj.LifestyleHistory.DrugType != "" || $scope.HealthPhysicalObj.LifestyleHistory.DrugQuantityId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.DrugWhenQuitId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.DrugDuration != "" || $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate != "" || $scope.HealthPhysicalObj.LifestyleHistory.DrugArray.length > 0 || $scope.HealthPhysicalObj.LifestyleHistory.Remarks != '' || $scope.HealthPhysicalObj.LifestyleHistory.PsychisType != '') {

                    $scope.HealthPhysicalObj.LifestyleHistoryArray.push($scope.HealthPhysicalObj.LifestyleHistory);
                }

            }

        }

        let TypeId = 9;
        let TypeName = "PreOpCall";

        let rossubmitreq = {
            "VisitId": $scope.ParentObject.Visitid || 0, //$scope.cacheStorageItem.PatientVisitId
            "PatientId": $scope.ParentObject.PatientID,
            "AppointmentID": $scope.ParentObject.AscAppointmentId,
            "HospitalId": $scope.HospitalId,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "TypeId": TypeId,
            "TypeName": TypeName,
            "AllergyItems": $scope.obj.AllergyItems || [],
            "SystemicHistory": [],
            "SurgicalHistory": $scope.obj.SurgicalHistoryArray || [],
            "CurrentSystemicMedicationsHistory": $scope.obj.CurrentSystemicMedicationsHistory || [],
            "LifestyleHistory": $scope.HealthPhysicalObj.LifestyleHistoryArray || [],
            //"OccularHistory": $scope.obj.OccularHistoryArray || [],
            //"OcularSurgicalHistory": $scope.obj.OcularSurgicalHistoryArray || [],// hiding ocular and ocular surgery changes 
            "MedicalConditions": $scope.obj.CurrentEyeMedicationArray || [],
            "ROSOverAllRemarks": $scope.obj.ROSOverAllRemarks || "",
            "IsCardiacWNL": $scope.HealthPhysicalObj.IsCardiacWNL || false,
            "IsPulmonaryWNL": $scope.HealthPhysicalObj.IsPulmonaryWNL || false,
            "IsHepaticWNL": $scope.HealthPhysicalObj.IsHepaticWNL || false,
            "IsEndocrineWNL": $scope.HealthPhysicalObj.IsEndocrineWNL || false,
            "IsNeurologicWNL": $scope.HealthPhysicalObj.IsNeurologicWNL || false,
            "IsHemeOncWNL": $scope.HealthPhysicalObj.IsHemeOncWNL || false,
            "IsNervousSystemWNL": $scope.HealthPhysicalObj.IsNervousSystemWNL || false,
            "IsMusculoSkeletalSystemWNL": $scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL || false,
            "IsKidneyDiseaseWNL": $scope.HealthPhysicalObj.IsKidneyDiseaseWNL || false,
            "IsAutoImmuneDisordersWNL": $scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL || false,
            "IsPsychosisWNL": $scope.HealthPhysicalObj.IsPsychosisWNL || false,
            "IsOthersWNL": $scope.HealthPhysicalObj.IsOthersWNL || false,
            "IsHeentWNL": $scope.HealthPhysicalObj.IsHeentWNL || false,
            "IsLungsWNL": $scope.HealthPhysicalObj.IsLungsWNL || false,
            "IsGeneralappearanceWNL": $scope.HealthPhysicalObj.IsGeneralappearanceWNL || false,
            "AllergyRemarks": $scope.obj.AllergyRemarks,
            "CurrentEyeRemarks": $scope.obj.CurrentEyeRemarks,
            "CurrentSystemicRemarks": $scope.obj.CurrentSystemicRemarks,
            "SurgicalRemarks": $scope.obj.SurgicalRemarks,
            "SystemicHistoryRemarks": $scope.obj.SystemicHistoryRemarks,
            "CardiacNotes": $scope.HealthPhysicalObj.CardiacNotes || "",
            "HeentNotes": $scope.HealthPhysicalObj.HeentNotes || "",
            "GeneralAppearenceNotes": $scope.HealthPhysicalObj.GeneralAppearenceNotes || "",
            "LungsNotes": $scope.HealthPhysicalObj.LungsNotes || "",
            "NeurologicNotes": $scope.HealthPhysicalObj.NeurologicNotes || "",
            "PulmonaryNotes": $scope.HealthPhysicalObj.PulmonaryNotes || "",
            "HepaticNotes": $scope.HealthPhysicalObj.HepaticNotes || "",
            "HemeOncNotes": $scope.HealthPhysicalObj.HemeOncNotes || "",
            "NervousSystemNotes": $scope.HealthPhysicalObj.NervousSystemNotes || "",
            "KidneyDiseaseNotes": $scope.HealthPhysicalObj.KidneyDiseaseNotes || "",
            "MusculoSkeletalSystemNotes": $scope.HealthPhysicalObj.MusculoSkeletalSystemNotes || "",
            "EndocrineNotes": $scope.HealthPhysicalObj.EndocrineNotes || "",
            "PsychosisNotes": $scope.HealthPhysicalObj.PsychosisNotes || "",
            
        }
        if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                if (item.IsNormal == true && item.IsChecked == true) {
                    item.IsNoshowROS = true;
                }
                item.PatientDetailId = item.PatientDetailId || 0;
                item.TypeId = item.TypeId || null;
                if (item.PatientDetailId != 0 && item.IsChecked == false && (item.TypeId == 1 || item.TypeId == 2 || item.TypeId == 3 || item.TypeId == 4 || item.TypeId == 5 || item.TypeId == 6 || item.TypeId == 7 || item.TypeId == 8 || item.TypeId == 9 || item.TypeId == 10 || item.TypeId == 11 || item.TypeId == 12 || item.TypeId == 16 || item.TypeId == 17 || item.TypeId == 21 || item.TypeId == 22 || item.TypeId == 18)) {
                    item.DeleteInd = "Y";
                }
            });
        }
        var temparray1 = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem, index) { return kitem.Value != '' || kitem.PatientDetailId != 0 || kitem.IsChecked == true });
        if (temparray1.length > 0) {
            rossubmitreq.SystemicHistory = temparray1;
        } else {
        }

        eHnoteDiagnosisDataServices.AddupdateROSData(rossubmitreq).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.PreOpCallObj.IsRosSummaryView = true;
                resp.data.SystemicHistory = resp.data.SystemicHistory || [];
                $scope.obj.SystemicHistory = angular.copy(resp.data.SystemicHistory);
                $scope.obj.AllergyItems = angular.copy(resp.data.AllergyItems);
                $scope.obj.SurgicalHistoryArray = angular.copy(resp.data.SurgicalHistory);
                $scope.obj.CurrentSystemicMedicationsHistory = angular.copy(resp.data.CurrentSystemicMedicationsHistory);
                $scope.obj.CurrentEyeMedicationArray = angular.copy(resp.data.MedicalConditions) || [];
                $scope.obj.AllergyRemarks = resp.data.AllergyRemarks || '';
                $scope.obj.SurgicalRemarks = resp.data.SurgicalRemarks || '';
                $scope.obj.CurrentSystemicRemarks = resp.data.CurrentSystemicRemarks || '';
                $scope.obj.CurrentEyeRemarks = resp.data.CurrentEyeRemarks || '';
                $scope.obj.SystemicHistoryRemarks = resp.data.SystemicHistoryRemarks || '';
                $scope.obj.LifestyleHistoryRemarks = resp.data.LifestyleHistoryRemarks || '';                                                                   

                $scope.obj.SystemicOtherData.CardiacNotes = resp.data.SystemicOtherData.CardiacNotes || "";
                $scope.obj.SystemicOtherData.OthersNotes = resp.data.SystemicOtherData.OthersNotes || "";
                $scope.obj.SystemicOtherData.PsychosisNotes = resp.data.SystemicOtherData.PsychosisNotes || "";
                $scope.obj.SystemicOtherData.EndocrineNotes = resp.data.SystemicOtherData.EndocrineNotes || "";
                $scope.obj.SystemicOtherData.MusculoSkeletalSystemNotes = resp.data.SystemicOtherData.MusculoSkeletalSystemNotes || "";
                $scope.obj.SystemicOtherData.KidneyDiseaseNotes = resp.data.SystemicOtherData.KidneyDiseaseNotes || "";

                $scope.obj.SystemicOtherData.NervousSystemNotes = resp.data.SystemicOtherData.NervousSystemNotes || "";
                $scope.obj.SystemicOtherData.HemeOncNotes = resp.data.SystemicOtherData.HemeOncNotes || "";
                $scope.obj.SystemicOtherData.HepaticNotes = resp.data.SystemicOtherData.HepaticNotes || "";
                $scope.obj.SystemicOtherData.LungsNotes = resp.data.SystemicOtherData.LungsNotes || "";
                $scope.obj.SystemicOtherData.HeentNotes = resp.data.SystemicOtherData.HeentNotes || "";
                 
                $scope.obj.SystemicOtherData.GeneralAppearenceNotes = resp.data.SystemicOtherData.GeneralAppearenceNotes || "";
                $scope.obj.SystemicOtherData.NeurologicNotes = resp.data.SystemicOtherData.NeurologicNotes || "";
                $scope.obj.SystemicOtherData.PulmonaryNotes = resp.data.SystemicOtherData.PulmonaryNotes || "";

                

                $scope.HealthPhysicalObj.DrugNames = $scope.HealthPhysicalObj.DrugNames || [];
                $scope.obj.LifestyleDetail = angular.copy(resp.data.LifestyleHistory);
                if (resp.data.LifestyleHistory.length > 0) {
                    angular.forEach(resp.data.LifestyleHistory, function (Litem) {
                        $scope.HealthPhysicalObj.LifestyleHistory.PatientDetailId = Litem.PatientDetailId || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.SmokingType = Litem.SmokingType || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = Litem.AlcoholType || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugType = Litem.DrugType || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.PsychisType = Litem.PsychisType || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholStatusId = Litem.AlcoholStatusId || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholStatusName = Litem.AlcoholStatusName || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDuration = Litem.AlcoholDuration || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationType = Litem.AlcoholDurationType || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationDate = $filter('date')(Litem.AlcoholDurationDate, "MM-dd-yyyy") || null;
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholQuantityId = Litem.AlcoholQuantityId || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholQuantityName = Litem.AlcoholQuantityName || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugStatusId = Litem.DrugStatusId || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugDuration = Litem.DrugDuration || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationType = Litem.DrugDurationType || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate = $filter('date')(Litem.DrugDurationDate, "MM-dd-yyyy") || null;
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugQuantityId = Litem.DrugQuantityId || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugQuantityName = Litem.DrugQuantityName || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist = angular.copy(Litem.Smokinglist) || [];
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugArray = angular.copy(Litem.DrugArray) || [];
                        $scope.HealthPhysicalObj.LifestyleHistory.Remarks = angular.copy(Litem.Remarks) || '';
                        if ($scope.HealthPhysicalObj.LifestyleHistory.Remarks != '') {
                            $scope.HealthPhysicalObj.SocialNotesInd = true;
                        }
                        if ($scope.HealthPhysicalObj.LifestyleHistory.DrugArray.length > 0) {
                            $scope.DrugListSelectedText = 'Selected';
                            angular.forEach($scope.HealthPhysicalObj.LifestyleHistory.DrugArray, function (ditem) {
                                angular.forEach($scope.HealthPhysicalObj.DrugNames, function (nitem) {
                                    if (ditem.HistoryHabitsId == nitem.HistoryHabitsID) {
                                        nitem.Ischecked = true;
                                    }
                                });
                            });
                        }

                        if ($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.length > 0) {
                            angular.forEach($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist, function (item) {
                                item.SmokingFromDate = item.SmokingFromDate || null;
                                if (item.SmokingFromDate != null) {
                                    item.SmokingFromDate = moment(item.SmokingFromDate).format("MM-DD-YYYY");
                                }
                            });
                        }
                    })
                }
            }
        });
    }
    $scope.RemovePrescriptionDetailObj = function (item, index) {

        if (item.MedicationLocationTypeId == 1) {
            var index = $scope.obj.CurrentSystemicMedicationsHistory.indexOf(item);
            item.CurrentSystemicMedicationId = item.CurrentSystemicMedicationId || null;
            if (item.CurrentEyeMedicalConditionId === null) {
                if (index > -1) {
                    $scope.obj.CurrentSystemicMedicationsHistory.splice(index, 1);
                }
            } else {
                $scope.obj.CurrentSystemicMedicationsHistory[index].DeleteInd = 'Y';
            }
        } else {
            var index = $scope.obj.CurrentSystemicMedicationsHistory.indexOf(item);
        item.CurrentEyeMedicalConditionId = item.CurrentEyeMedicalConditionId || null;
            if (item.CurrentSystemicMedicationId === null) {
            if (index > -1) {
                $scope.obj.CurrentSystemicMedicationsHistory.splice(index, 1);
            }
        } else {
            $scope.obj.CurrentSystemicMedicationsHistory[index].DeleteInd = 'Y';
        }
        }
      
    };
    $scope.GetOTQuickAccessDetails = function () {

        let req3 = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": $scope.ParentObject.AscAppointmentId || 0,
            "PatientId": $scope.ParentObject.PatientID || 0,
            "AppointmentTypeId": 4,

        };

        eHnoteSurgeryService.GetOTQuickAccessDetails(req3).then(function (resp) {
            if (resp.data.status === "Success") {
                $scope.MainObj.AllergyItems = angular.copy(resp.data.AllergyItems);
                $scope.MainObj.SystemicHistory = angular.copy(resp.data.SystemicHistory);
                $scope.MainObj.SurgicalHistory = angular.copy(resp.data.SurgicalHistory);
                $scope.MainObj.CurrentSystemicMedicationsHistory = angular.copy(resp.data.CurrentSystemicMedicationList);
                $scope.MainObj.CurrentEyeMedications = angular.copy(resp.data.CurrentEyeMedicationList);
                $scope.MainObj.LifestyleDetail = angular.copy(resp.data.LifestyleDetail);
                // accordian open/close statuses
                if ($scope.MainObj.AllergyItems.length > 0) {
                    $scope.Rosaacordian.IsAllergyacordian = true;
                }
                if ($scope.MainObj.SystemicHistory.length > 0) {
                    $scope.Rosaacordian.IsSystemicacordian = true;
                }
                if ($scope.MainObj.SurgicalHistory.length > 0) {
                    $scope.Rosaacordian.IsSurgicalacordian = true;
                }
                if ($scope.MainObj.CurrentSystemicMedicationsHistory.length > 0) {
                    $scope.Rosaacordian.IsCurrentSystemicacordian = true;
                }
                if ($scope.MainObj.CurrentEyeMedications.length > 0) {
                    $scope.Rosaacordian.IsCurrentEyeacordian = true;
                }
                // 
            }
            //social 


            var TempRespi6 = $filter('filter')($scope.MainObj.LifestyleDetail, { 'HistoryId': 122 }, true);
            if (TempRespi6.length > 0) {
                $scope.RespiratoryObj.IsLungsclearance = true;
            }


            if ($scope.MainObj.LifestyleDetail.length > 0) {
                angular.forEach($scope.MainObj.LifestyleDetail, function (Litem) {
                    if (Litem.AlcoholType == '' && Litem.DrugType == '' && Litem.PsychisType == '' && Litem.SmokingType == '' && Litem.Remarks == '') {
                        //$scope.HealthPhysical.LifeStyelInd = false;
                    } else {
                        //$scope.HealthPhysical.LifeStyelInd = true;
                        $scope.Rosaacordian.IsSocialacordian = true;
                    }
                });
            } else {
                //$scope.HealthPhysical.LifeStyelInd = false;
            }

            //Systematic




            var TempSystemic1 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 110 }, true);
            if (TempSystemic1.length > 0) {
                $scope.SystemicHisObj.IsDiabetes = true;
            }

            var TempSystemic2 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 111 }, true);
            if (TempSystemic2.length > 0) {
                $scope.SystemicHisObj.IsLiverDisease = true;
            }
            var TempSystemic3 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 112 }, true);
            if (TempSystemic3.length > 0) {
                $scope.SystemicHisObj.IsInfDisease = true;
            }
            var TempSystemic4 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 113 }, true);
            if (TempSystemic4.length > 0) {
                $scope.SystemicHisObj.IsAllergies = true;
            }
            var TempSystemic5 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 114 }, true);
            if (TempSystemic5.length > 0) {
                $scope.SystemicHisObj.IsEndocrine = true;
            }

            if ($scope.SystemicHisObj.IsDiabetes == false && $scope.SystemicHisObj.IsLiverDisease == false && $scope.SystemicHisObj.IsInfDisease == false && $scope.SystemicHisObj.IsAllergies == false && $scope.SystemicHisObj.IsEndocrine == false) {
                $scope.SystemicHisObj.Indicatory = false;
            } else {
                $scope.SystemicHisObj.Indicatory = true;
            }


        });

    };
    $scope.EditPreopRoslItem = function () {
        $scope.PreOpCallObj.IsRosSummaryView = false;
        $scope.RestructureInfo();
    }
    $scope.AddNewpostopcall = function () {
        $scope.PostOpCallObj.IssummaryShow = false;
        $scope.PostOpCallObj.IsPostOpEditModeInd = false;
        $scope.PostOpCallObj.IsPostOpSaveNameEditModeInd = false;
        $scope.PostOpCallObj.PatientAscPostOpCallId = 0;
        $scope.PostOpCallObj.ContactType = "";
        $scope.PostOpCallObj.AddnewMobileNo = "";
        $scope.PostOpCallObj.ContactStartDate = "";
        $scope.PostOpCallObj.ContactStartTime = "";
        $scope.PostOpCallObj.CoPayNotes = "";
        $scope.PostOpCallObj.Patientoutcomenotes = "";
        $scope.PostOpCallObj.PainLevel = null;
        $scope.PostOpCallObj.AdditionalNotes = "";
        $scope.PostOpCallObj.ScheduledDate = null;
        $scope.PostOpCallObj.CallAttempt = "";
        $scope.PostOpCallObj.SpokeWith = "";
        $scope.PostOpCallObj.SideEffects = "";
        $scope.PostOpCallObj.SideEffectsReason = "";
        $scope.PostOpCallObj.MedicationHelping = "";
        $scope.PostOpCallObj.MedicationHelpingReason = "";
        $scope.PostOpCallObj.ActivityRestrictions = "";
        $scope.PostOpCallObj.EyeShieldUsed = "";
        $scope.PostOpCallObj.ConfirmedAppointment = "";
        $scope.PostOpCallObj.NauseaOrVomiting = "";
        $scope.PostOpCallObj.NauseaSeverity = "";
        $scope.PostOpCallObj.EyeDropScheduleUnderstanding = "";
        $scope.PostOpCallObj.PostopCallNurseReviewedById = null;
        $scope.PostOpCallObj.PostopCallNurseReviewedByTime = "";
        $scope.PostOpCallObj.PostopCallNurseReviewedByDate = null;
        $scope.PostOpCallObj.RescheduleConfirmed = false;
        
        
        angular.forEach($scope.OrgPostOpChecklist, function (hitem) {
            angular.forEach(hitem.OrganizationCheckListDetails, function (kitem) {
                kitem.IsChecked = false;
                kitem.PatientAscCheckListDetailId = 0;
            });
        });

        $scope.PostOpCallObj.PostOpCallActionTakenCheckList.forEach(item => {
            item.Ischecked = false;
            item.DeleteInd = 'N';
            item.PostOpCallActionTakenDetailId = 0;
            item.Remarks = '';
        });


        $scope.LogObj.ContactStartDate = null;
        $scope.LogObj.ContactType = "";
        $scope.LogObj.AddnewMobileNo = "";
        $scope.LogObj.ContactStartTime = "";
        $scope.LogObj.CoPayNotes = "";
        $scope.LogObj.Patientoutcomenotes = "";
        $scope.LogObj.PainLevel = null;
        $scope.LogObj.AdditionalNotes = "";
        $scope.LogObj.ScheduledDate = null;
        $scope.LogObj.CallAttempt = "";
        $scope.LogObj.SpokeWith = "";
        $scope.LogObj.SideEffects = "";
        $scope.LogObj.SideEffectsReason = "";
        $scope.LogObj.MedicationHelping = "";
        $scope.LogObj.MedicationHelpingReason = "";
        $scope.LogObj.ActivityRestrictions = "";
        $scope.LogObj.EyeShieldUsed = "";
        $scope.LogObj.ConfirmedAppointment = "";
        $scope.LogObj.NauseaOrVomiting = "";
        $scope.LogObj.NauseaSeverity = "";
        $scope.LogObj.EyeDropScheduleUnderstanding = "";
        $scope.LogObj.PostopCallNurseReviewedById = null;
        $scope.LogObj.PostopCallNurseReviewedByName = "";
        $scope.LogObj.PostopCallNurseReviewedByTime = "";
        $scope.LogObj.PostopCallNurseReviewedByDate = null;
        $scope.LogObj.RescheduleConfirmed = false;
        $scope.LogObj.OrgASCChecklist =[];
        $scope.LogObj.PostOpCallActionTakenCheckList =[];                                                
                                                                                                           
                                                                                                              
    }
    $scope.Rosaacordian.IsCurrentEyesummry = true;
    $scope.Rosaacordian.IsSurgicalsummry = true;
    $scope.Rosaacordian.IsAllergysummry = true;
    $scope.Rosaacordian.IsSocialsummry = true;
    $scope.Rosaacordian.IsSystemicsummry = true;
    $scope.Rosaacordian.IsCurrentSystemicsummry = true;
    $scope.RosaacordianShowhide = function (type) {
        if (type == 1) {
            $scope.Rosaacordian.IsAllergysummry = !$scope.Rosaacordian.IsAllergysummry;
            $scope.Rosaacordian.IsSurgicalsummry = true;
            $scope.Rosaacordian.IsCurrentSystemicsummry = true;
            $scope.Rosaacordian.IsCurrentEyesummry = true;
            $scope.Rosaacordian.IsSocialsummry = true;
            $scope.Rosaacordian.IsSystemicsummry = true;
        } else if (type == 2) {
            $scope.Rosaacordian.IsSurgicalsummry = !$scope.Rosaacordian.IsSurgicalsummry;
            $scope.Rosaacordian.IsAllergysummry = true;
            $scope.Rosaacordian.IsCurrentSystemicsummry = true;
            $scope.Rosaacordian.IsCurrentEyesummry = true;
            $scope.Rosaacordian.IsSocialsummry = true;
            $scope.Rosaacordian.IsSystemicsummry = true;
        } else if (type == 3) {
            $scope.Rosaacordian.IsCurrentSystemicsummry = !$scope.Rosaacordian.IsCurrentSystemicsummry;
            $scope.Rosaacordian.IsAllergysummry = true;
            $scope.Rosaacordian.IsSurgicalsummry = true;

            $scope.Rosaacordian.IsCurrentEyesummry = true;
            $scope.Rosaacordian.IsSocialsummry = true;
            $scope.Rosaacordian.IsSystemicsummry = true;
        } else if (type == 4) {
            $scope.Rosaacordian.IsCurrentEyesummry = !$scope.Rosaacordian.IsCurrentEyesummry;
            $scope.Rosaacordian.IsAllergysummry = true;
            $scope.Rosaacordian.IsSurgicalsummry = true;
            $scope.Rosaacordian.IsCurrentSystemicsummry = true;
            $scope.Rosaacordian.IsSocialsummry = true;
            $scope.Rosaacordian.IsSystemicsummry = true;
        } else if (type == 5) {
            $scope.Rosaacordian.IsSocialsummry = !$scope.Rosaacordian.IsSocialsummry;
            $scope.Rosaacordian.IsAllergysummry = true;
            $scope.Rosaacordian.IsSurgicalsummry = true;
            $scope.Rosaacordian.IsCurrentSystemicsummry = true;
            $scope.Rosaacordian.IsCurrentEyesummry = true;
            $scope.Rosaacordian.IsSystemicsummry = true;
        } else if (type == 6) {
            $scope.Rosaacordian.IsSystemicsummry = !$scope.Rosaacordian.IsSystemicsummry;
            $scope.Rosaacordian.IsAllergysummry = true;
            $scope.Rosaacordian.IsSurgicalsummry = true;
            $scope.Rosaacordian.IsCurrentSystemicsummry = true;
            $scope.Rosaacordian.IsCurrentEyesummry = true;
            $scope.Rosaacordian.IsSocialsummry = true;
        } else {
            console.log('hu');
        }
        //$scope.Rosaacordian.IsCurrentEyesummry = !$scope.Rosaacordian.IsCurrentEyesummry;
        //$scope.Rosaacordian.IsSurgicalsummry = !$scope.Rosaacordian.IsSurgicalsummry;
        //$scope.Rosaacordian.IsAllergysummry = !$scope.Rosaacordian.IsAllergysummry;
        //$scope.Rosaacordian.IsSocialsummry = !$scope.Rosaacordian.IsSocialsummry;
        //$scope.Rosaacordian.IsSystemicsummry = !$scope.Rosaacordian.IsSystemicsummry;
        //$scope.Rosaacordian.IsCurrentSystemicsummry = !$scope.Rosaacordian.IsCurrentSystemicsummry;
    }
    $scope.Allergiessummary = function () {
        $scope.Rosaacordian.IsAllergysummry = !$scope.Rosaacordian.IsAllergysummry;
    }

    $scope.formatUSNumber = function (phoneNumberString) {
        $scope.USnumberString = phoneNumberString || "";
        if ($scope.USnumberString != "") {
            console.log($scope.USnumberString);
            const match = phoneNumberString
                .replace(/\D+/g, '')
                .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
            $scope.PostOpCallObj.AddnewMobileNo = part1 + part2 + part3;
        }
    }

    $scope.ChangeUSNumber = function (phoneNumberString) {
        $scope.USnumberString = phoneNumberString || "";
        if ($scope.USnumberString != "") {
            console.log($scope.USnumberString);
            const match = phoneNumberString
                .replace(/\D+/g, '')
                .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
            const part1 = match.length > 3 ? `(${match.substring(0, 3)})` : match
            const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
            const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
            $scope.PreOpCallObj.PreopAddnewMobileNo = part1 + part2 + part3;
        }
    }
    $scope.ChangeSmokeStatus = function (item) {
        item.SmokingStatusId = item.SmokingStatusId || 0;
        if (item.SmokingStatusId == 0) {
            item.SmokingStatusId = 0;
            item.SmokingStatusName = "";
        } else {
            var statusfilter = $filter("filter")($scope.SmokingStatus, { "HistoryHabitsID": item.SmokingStatusId }, true) || [];
            var TempArray = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist, { "SmokingStatusId": item.SmokingStatusId }, true) || [];
            if (TempArray.length > 1) {
                alertify.error("This Status Already Selected ");
                item.SmokingStatusId = 0;
                return false;
            }
            if (statusfilter.length > 0) {
                item.SmokingStatusName = statusfilter[0].HabitsDescription || '';
            }
        }
    }
    $scope.ChangeFormatDate = function (item) {
        item.Duration = "";
      /*  item.DurationType = "";*/
    };
    $scope.ChangeFormatDateLifestyle = function (item, type) {
        if (type == "Smoking") {
            item.SmokingDuration = "";
            item.SmokingDurationType = "D";
            item.SmokingDurationTypeName = "Day(s)";
        } else if (type == "Alcohol") {
            item.AlcoholDuration = "";
            item.AlcoholDurationType = "D";
            item.AlcoholDurationTypeName = "Day(s)";
        } else if (type == "Drug") {
            item.DrugDuration = "";
            item.DrugDurationType = "D";
            item.DrugDurationTypeName = "Day(s)";
        }
    };
    $scope.ChangeDateFormateforLifestyle = function (item, type) {

        if (type == "Smoking") {
            item.SmokeShowDateFormat = !item.SmokeShowDateFormat;
            item.SmokingDurationDate = null;
            item.SmokingFromDate = null;
            item.SmokingDuration = '';
            item.SmokingDurationType = 'D';
        } else if (type == "Alcohol") {
            item.AlcoShowDateFormat = !item.AlcoShowDateFormat;
            item.AlcoholDurationDate = null;
            item.AlcoholDuration = '';
            item.AlcoholDurationType = 'D';
        } else if (type == "Drug") {
            item.DrugShowDateFormat = !item.DrugShowDateFormat;
            item.DrugDurationDate = null;
            item.DrugDuration = '';
            item.DrugDurationType = 'D';

        }
    };
    $scope.ChangeSmokeQuantity = function (item) {
        item.SmokingQuantityId = item.SmokingQuantityId || 0;
        if (item.SmokingQuantityId == 0) {
            item.SmokingQuantityId = 0;
            item.SmokingQuantityName = "";
        } else {
            var statusfilter = $filter("filter")($scope.SmokingQuantity, { "HistoryHabitsID": item.SmokingQuantityId }, true) || [];
            if (statusfilter.length > 0) {
                item.SmokingQuantityName = statusfilter[0].HabitsDescription;
            }
        }
    };
    $scope.ChangeAlcoholstatus = function (item) {
        item.AlcoholStatusId = item.AlcoholStatusId || 0;
        if (item.AlcoholStatusId == 0) {
            item.AlcoholStatusId = 0;
            item.AlcoholStatusName = "";
        } else {
            var statusfilter = $filter("filter")($scope.HealthPhysicalObj.AlcoholStatus, { "HistoryHabitsID": item.AlcoholStatusId }, true) || [];
            if (statusfilter.length > 0) {
                item.AlcoholStatusName = statusfilter[0].HabitsDescription;
            }
        }
    };
    $scope.ChangeAlcoholQuantity = function (item) {
        item.AlcoholQuantityId = item.AlcoholQuantityId || 0;
        if (item.AlcoholQuantityId == 0) {
            item.AlcoholQuantityId = 0;
            item.AlcoholQuantityName = "";
        } else {
            var statusfilter = $filter("filter")($scope.AlcoholQuantity, { "HistoryHabitsID": item.AlcoholQuantityId }, true) || [];
            if (statusfilter.length > 0) {
                item.AlcoholQuantityName = statusfilter[0].HabitsDescription;
            }
        }
    };
    $scope.ChangeAllDrugSelect = function (checked) {
        if (checked == true) {
            if ($scope.DrugNames.length > 0) {
                angular.forEach($scope.DrugNames, function (item) {
                    item.Ischecked = true;
                });
            }
            if ($scope.HealthPhysicalObj.LifestyleHistory.DrugArray.length > 0) {
                angular.forEach($scope.DrugNames, function (item) {
                    var statusfilter = $filter("filter")($scope.obj.LifestyleHistory.DrugArray, { "HistoryHabitsId": item.HistoryHabitsID }, true) || [];
                    if (statusfilter.length > 0) {
                        angular.forEach($scope.obj.LifestyleHistory.DrugArray, function (ditem) {
                            if (item.HistoryHabitsID == ditem.HistoryHabitsId) {
                                ditem.ActiveInd = "Y";
                            }
                        });
                    } else {
                        var obj = {
                            "DrugHistoryId": 0,
                            "ActiveInd": "Y",
                            "HabitsDescription": item.HabitsDescription,
                            "HistoryHabitsId": item.HistoryHabitsID,
                            "HabitsId": item.HabitsId
                        };
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugArray.push(obj);
                    }
                });

            } else {
                angular.forEach($scope.DrugNames, function (item) {
                    var obj = {
                        "DrugHistoryId": 0,
                        "ActiveInd": "Y",
                        "HabitsDescription": item.HabitsDescription,
                        "HistoryHabitsId": item.HistoryHabitsID,
                        "HabitsId": item.HabitsId
                    };
                    $scope.HealthPhysicalObj.LifestyleHistory.DrugArray.push(obj);
                });
            }
            $scope.DrugListSelectedText = "All Selected";
        } else {
            if ($scope.DrugNames.length > 0) {
                angular.forEach($scope.DrugNames, function (item) {
                    item.Ischecked = false;
                });
            }
            if ($scope.HealthPhysicalObj.LifestyleHistory.DrugArray.length > 0) {
                var DrugList = [];
                angular.forEach($scope.DrugNames, function (item) {
                    var statusfilter = $filter("filter")($scope.obj.LifestyleHistory.DrugArray, { "HistoryHabitsId": item.HistoryHabitsID }, true) || [];

                    if (statusfilter.length > 0) {
                        angular.forEach($scope.obj.LifestyleHistory.DrugArray, function (ditem, index) {
                            if (item.HistoryHabitsID == ditem.HistoryHabitsId) {
                                if (ditem.DrugHistoryId != 0) {
                                    ditem.ActiveInd = "N";
                                    DrugList.push(ditem);
                                } else {
                                    //$scope.obj.LifestyleHistory.DrugArray.splice(index, 1);
                                }
                            }
                        });
                    }
                });
                $scope.HealthPhysicalObj.LifestyleHistory.DrugArray = angular.copy(DrugList);
            }

            $scope.DrugListSelectedText = "Select";
        }

        console.log(JSON.stringify($scope.HealthPhysicalObj.LifestyleHistory.DrugArray));
    };
    $scope.ChangeDrugQuantity = function (item) {
        item.DrugQuantityId = item.DrugQuantityId || 0;
        if (item.DrugQuantityId == 0) {
            item.DrugQuantityId = 0;
            item.DrugQuantityName = "";
        } else {
            var statusfilter = $filter("filter")($scope.DrugQuantity, { "HistoryHabitsID": item.DrugQuantityId }, true) || [];
            if (statusfilter.length > 0) {
                item.DrugQuantityName = statusfilter[0].HabitsDescription;
            }
        }
    };
    $scope.$watch("HealthPhysicalObj.SystemicHistoryArray", function (newVal, oldVal) {
        $scope.allSystemicHistoryValid = true;
        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
            if ((item.TypeId != 19 && item.IsChecked) || item.HistoryId == 1) {
                $scope.allSystemicHistoryValid = false;
            }
        });
    }, true);
    $scope.additionalSystemicFilter = function (item) {
        // respiratory section and default items shown in systemic history are filtered out here
        return item.TypeId !== 1 && item.TypeId !== 2 && item.TypeId !== 3 && item.TypeId !== 5 && item.TypeId !== 6 && item.TypeId !== 7 && item.TypeId !== 8 && item.TypeId !== 9 && item.TypeId !== 10 && item.TypeId !== 11 && item.TypeId !== 12 && item.TypeId !== 16 && item.TypeId !== 17 && item.TypeId !== 21 && item.TypeId !== 18 && item.TypeId !== 19 && item.IsChecked == true;
    };
    $scope.additionalSystemicFilter1 = function (item) {
        // respiratory section and default items shown in systemic history are filtered out here
        return item.HistoryId == 1 && item.IsChecked == true;
    };
     $scope.clearOrganizationSiginputEdit = function (item) {
            item.ActionId = '';
            item.DoseId = '';
            item.DoseUnitId = '';
            item.RouteId = '';
            item.FrequencyId = '';
            item.DoseOtherId = '';
            item.DaysSupplyId = '';
            item.Quantity = '';
            item.QuantityUnitId = '';
            item.RefillId = '';
            item.SubstitutionPermitted = '';
            
        }
    $scope.OnSelectGrid = function (type) {
        if (type == 'Grid') {
            $scope.HealthPhysicalObj.IsAllGridView = true;
            $scope.HealthPhysicalObj.IsAllSearchView = false;
        } else {
            $scope.HealthPhysicalObj.IsAllGridView = false;
            $scope.HealthPhysicalObj.IsAllSearchView = true;
        }
        if ($scope.HealthPhysicalObj.SystemicHistoryArray.length) {
            if (type == 'Search') {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (Titem) {
                    Titem.Duration = Titem.Duration || '';
                    if (Titem.Duration == '') {
                        Titem.ShowDateFormat = true;
                    }
                    if (Titem.DurationType == 'SB') {
                        Titem.ShowDateFormat = false;
                    }
                })
            }
        }
       
    }
    $scope.RestructureInfo = function () {

        if ($scope.obj.SystemicHistory.length > 0) {
            $scope.obj.SystemicHistory = $scope.obj.SystemicHistory || [];
            angular.forEach($scope.obj.SystemicHistory, function (item) {
                let tempArray = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'HistoryId': item.HistoryId }, true);
                if (tempArray.length == 0) {
                    $scope.HealthPhysicalObj.SystemicHistoryArray.push(item);
                }
            });
            angular.forEach($scope.obj.SystemicHistory, function (Aitem) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (Bitem) {
                    if (Aitem.HistoryId == Bitem.HistoryId) {
                        Bitem.PatientDetailId = Aitem.PatientDetailId;
                        Bitem.Value = Aitem.Value;
                        Bitem.IsNoshowROS = Aitem.IsNoshowROS || false;
                        Bitem.Remarks = Aitem.Remarks || '';
                        Bitem.IsChecked = true;
                        if (Bitem.Remarks != '') {
                            Bitem.PreAdmOthernotesInd = true;
                        }
                        Bitem.StatusId = Aitem.StatusId || 1;
                        Bitem.SeverityId = Aitem.SeverityId || null;
                        Bitem.DurationDate = Aitem.DurationDate || null;
                        Bitem.Duration = Aitem.Duration || '';
                        Bitem.DurationType = Aitem.DurationType || 'D';
                        Bitem.ICD10CODE = Aitem.ICD10CODE || '';
                        Bitem.SNOMEDCODE = Aitem.SNOMEDCODE || '';
                        Aitem.DurationDate = Aitem.DurationDate || null;
                        if (Aitem.DurationDate != null) {
                            Bitem.DurationDate = $filter('date')(Aitem.DurationDate, "MM-dd-yyyy");
                            Bitem.ShowDateFormat = true;
                        }
                        Bitem.ShowDateFormat = true;
                        if (Bitem.Duration != '') {
                            Bitem.ShowDateFormat = false;
                        }

                        if (Bitem.HistoryId == 118 || Bitem.HistoryId == 119 || Bitem.HistoryId == 120 || Bitem.HistoryId == 121 || Bitem.HistoryId == 118) {
                            Bitem.IsChecked = false;
                        }
                    }
                });
            });

            let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 110);
            if (templest.length > 0) {
                if (templest[0].Value == 'Yes' && templest[0].HistoryId == 110) {
                    let templest1 = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 158 || x.HistoryId == 159);
                    if (templest1.length > 0) {
                        angular.forEach(templest1, function (Aitem) {
                            Aitem.IsDiabetes = true;
                        })
                    }

                }
            }

            let templest2 = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 114);
            if (templest2.length > 0) {
                if (templest2[0].Value == 'Yes' && templest2[0].HistoryId == 114) {
                    let templest3 = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 160 || x.HistoryId == 161);
                    if (templest3.length > 0) {
                        angular.forEach(templest3, function (Aitem) {
                            Aitem.IsDiabetes = true;
                        })
                    }

                }
            }

        }
        if ($scope.obj.LifestyleDetail.length > 0) {
            angular.forEach($scope.obj.LifestyleDetail, function (Litem) {
                $scope.HealthPhysicalObj.LifestyleHistory.PatientDetailId = $scope.obj.LifestyleDetail[0].PatientDetailId || 0;
                $scope.HealthPhysicalObj.LifestyleHistory.SmokingType = Litem.SmokingType || '';
                $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = Litem.AlcoholType || '';
                $scope.HealthPhysicalObj.LifestyleHistory.DrugType = Litem.DrugType || '';
                $scope.HealthPhysicalObj.LifestyleHistory.PsychisType = Litem.PsychisType || '';
                $scope.HealthPhysicalObj.LifestyleHistory.AlcoholStatusId = Litem.AlcoholStatusId || 0;
                $scope.HealthPhysicalObj.LifestyleHistory.AlcoholStatusName = Litem.AlcoholStatusName || 0;
                $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDuration = Litem.AlcoholDuration || '';
                $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationType = Litem.AlcoholDurationType || '';
                $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationDate = $filter('date')(Litem.AlcoholDurationDate, "MM-dd-yyyy") || null;
                $scope.HealthPhysicalObj.LifestyleHistory.AlcoholQuantityId = Litem.AlcoholQuantityId || 0;
                $scope.HealthPhysicalObj.LifestyleHistory.AlcoholQuantityName = Litem.AlcoholQuantityName || 0;
                $scope.HealthPhysicalObj.LifestyleHistory.DrugStatusId = Litem.DrugStatusId || 0;
                $scope.HealthPhysicalObj.LifestyleHistory.DrugDuration = Litem.DrugDuration || '';
                $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationType = Litem.DrugDurationType || '';
                $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate = $filter('date')(Litem.DrugDurationDate, "MM-dd-yyyy") || null;
                $scope.HealthPhysicalObj.LifestyleHistory.DrugQuantityId = Litem.DrugQuantityId || 0;
                $scope.HealthPhysicalObj.LifestyleHistory.DrugQuantityName = Litem.DrugQuantityName || 0;
                $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist = angular.copy(Litem.Smokinglist) || [];
                $scope.HealthPhysicalObj.LifestyleHistory.DrugArray = angular.copy(Litem.DrugArray) || [];
                $scope.HealthPhysicalObj.LifestyleHistory.Remarks = angular.copy(Litem.Remarks) || '';
                if ($scope.HealthPhysicalObj.LifestyleHistory.Remarks != '') {
                    $scope.HealthPhysicalObj.SocialNotesInd = true;
                }
                if ($scope.HealthPhysicalObj.LifestyleHistory.DrugArray.length > 0) {
                    $scope.DrugListSelectedText = 'Selected';
                    angular.forEach($scope.HealthPhysicalObj.LifestyleHistory.DrugArray, function (ditem) {
                        angular.forEach($scope.HealthPhysicalObj.DrugNames, function (nitem) {
                            if (ditem.HistoryHabitsId == nitem.HistoryHabitsID) {
                                nitem.Ischecked = true;
                            }
                        });
                    });
                }

                if ($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.length > 0) {
                    angular.forEach($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist, function (item) {
                        item.SmokingFromDate = item.SmokingFromDate || null;
                        item.SmokeShowDateFormat = true;
                        if (item.SmokingFromDate != null) {
                            item.SmokingFromDate = moment(item.SmokingFromDate).format("MM-DD-YYYY");
                            item.SmokeShowDateFormat = true;
                        }
                        item.SmokingDuration = item.SmokingDuration || '';
                        if (item.SmokingDuration != '') {
                            item.SmokeShowDateFormat = false;
                        }
                    });
                }
            })
        }

    }
    $scope.OnSelectAllergyreaction = function (name, item) {
        console.log(item);
        var List1 = $filter("filter")($scope.ROSAllergyReactions, function (Ditem,) { return Ditem.AllergyReaction === name; }) || [];
        if (List1.length != 0) {
            item.ReactionId = List1[0].ROSAllergyReactionsId;
            item.ReactionName = List1[0].AllergyReaction;
            item.SelectedReaction = List1[0].AllergyReaction;
        } else {
            item.ReactionId = null;
            item.ReactionName = "";
        }
    };
    $scope.changeAllergySeverity = function (item) {
        var List = $filter("filter")($scope.ROSAllergySeverity, { "ROSAllergySeverityId": item.SeverityId }, true);
        if (List.length > 0) {
            item.SeverityName = List[0].AllergySeverity;
        } else {
            item.SeverityName = "";
        }
    }
    $scope.ShowSystemicHistoryNote = function (item) {
        item.PreAdmOthernotesInd = !item.PreAdmOthernotesInd;
    };
    $scope.changeAllergyStatus = function (item) {
        var List = $filter("filter")($scope.ROSAllergyStatus, { "ROSAllergyStatusId": item.StatusId }, true);
        if (List.length > 0) {
            item.StatusName = List[0].AllergyStatus;
        } else {
            item.StatusName = "";
        }
    }

    $scope.onisNKSHSelected = function () {
        if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Are you sure you want to permanently delete all selected Past Medical History?", function () {
                if ($scope.obj.isNKSHSelected) {
                    var newArray = [];
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {

                        item.IsChecked = false;
                        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
                        $scope.HealthPhysicalObj.IsAllGridView = true;
                        $scope.HealthPhysicalObj.IsAllSearchView = false;

                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = 'Y';
                            newArray.push(item);
                        }
                    });
                    if (newArray.length > 0) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (sitem) {
                            angular.forEach(newArray, function (nitem) {
                                if (sitem.HistoryId == nitem.HistoryId) {
                                    sitem.PatientDetailId = nitem.PatientDetailId || ''
                                    sitem.HistoryId = nitem.HistoryId || null
                                    sitem.HistoryName = nitem.HistoryName || ''
                                    sitem.PreAdmOthernotesInd = nitem.PreAdmOthernotesInd || false
                                    sitem.DeleteInd = nitem.DeleteInd || 'N'
                                    sitem.Remarks = nitem.Remarks || ''
                                    sitem.SnomedCodeobj = nitem.SnomedCodeobj || ''
                                    sitem.OrganId = nitem.OrganId || ''
                                    sitem.OrderId = nitem.OrderId || ''
                                    sitem.Duration = nitem.Duration || ''
                                    sitem.DurationType = nitem.DurationType || 'D'
                                    sitem.IsDiabetes = nitem.IsDiabetes || false
                                    sitem.DurationTypeName = nitem.DurationTypeName || 'Day(s)'
                                    sitem.IsChecked = nitem.IsChecked || false
                                    sitem.IsNormal = nitem.IsNormal || false
                                    sitem.IsNoshowROS = nitem.IsNoshowROS || false
                                    sitem.DurationDate = nitem.DurationDate || ''
                                    sitem.SNOMEDId = nitem.SNOMEDId || null
                                    sitem.SNOMEDCODE = nitem.SNOMEDCODE || ''
                                    sitem.ICD10CODE = nitem.ICD10CODE || ''
                                    sitem.SNOMEDCODE = nitem.SNOMEDCODE || ''
                                    sitem.DiagnosisObject = nitem.DiagnosisObject || ''
                                    sitem.DiagnosisId = nitem.DiagnosisId || null
                                    sitem.SeverityId = nitem.SeverityId || null
                                    sitem.Value = nitem.Value || ''
                                    sitem.StatusId = nitem.StatusId || ''
                                    sitem.TypeId = nitem.TypeId || ''
                                    sitem.TypeName = nitem.TypeName || ''
                                    sitem.SeverityDateTime = nitem.SeverityDateTime || ''

                                }
                            });
                        });

                        //$scope.HealthPhysicalObj.SystemicHistoryArray = angular.copy(newArray);
                    } else {
                        $scope.HealthPhysicalObj.SystemicHistoryArray = $scope.HealthPhysicalObj.SystemicHistoryArray || [];
                    }
                    var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "TypeName": "SystemicHistory" }, true);
                    if (filteredArray.length > 0) {
                        var object = {
                            "PatientDetailId": 0,
                            "HistoryId": filteredArray[0].Id || null,
                            "HistoryName": filteredArray[0].Name || '',
                            "IsEdit": false,
                            "ActiveInd": true,
                            "DeleteInd": 'N',
                            "Remarks": "",
                            "SnomedCodeobj": "",
                            "OrganId": "",
                            "Duration": "",
                            "DurationType": "D",
                            "DurationTypeName": "Day(s)",
                            "DurationDate": "",
                            "ShowNote": false,
                            "SNOMEDId": null,
                            "SNOMEDCODE": "",
                            "ICD10CODE": "",
                            "DiagnosisObject": "",
                            "DiagnosisId": null,
                            "SeverityId": null,
                            "StatusId": 50,
                            "SeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                            "ShowDateFormat": false,
                            "isNKSHSelected": $scope.obj.isNKSHSelected || false,
                        };
                        $scope.HealthPhysicalObj.SystemicHistoryArray.push(object);
                        $scope.$digest();
                        angular.forEach($scope.FrequentlySystemicHistory, function (item) {
                            item.Onselect = false;
                        });
                    }
                }
            },
                function () {
                    $scope.obj.isNKSHSelected = false;
                    $scope.$digest();
                    r = "You pressed Cancel!";
                });
        }
        else {
            if ($scope.obj.isNKSHSelected) {
                var filteredArray = $filter("filter")($scope.ROSIsNormalArray, { "TypeName": "SystemicHistory" }, true);
                if (filteredArray.length > 0) {
                    var object = {
                        "PatientDetailId": 0,
                        "HistoryId": filteredArray[0].Id || null,
                        "HistoryName": filteredArray[0].Name || '',
                        "IsEdit": false,
                        "ActiveInd": true,
                        "DeleteInd": 'N',
                        "Remarks": "",
                        "SnomedCodeobj": "",
                        "OrganId": "",
                        "Duration": "",
                        "DurationType": "D",
                        "DurationTypeName": "Day(s)",
                        "DurationDate": "",
                        "ShowNote": false,
                        "SNOMEDId": null,
                        "SNOMEDCODE": "",
                        "ICD10CODE": "",
                        "DiagnosisObject": "",
                        "DiagnosisId": null,
                        "SeverityId": null,
                        "StatusId": 50,
                        "SeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                        "ShowDateFormat": false,
                        "isNKSHSelected": $scope.obj.isNKSHSelected || false,
                    };
                    $scope.HealthPhysicalObj.SystemicHistoryArray.push(object);
                    angular.forEach($scope.FrequentlySystemicHistory, function (item) {
                        item.Onselect = false;
                    });
                }
            }
        }
    };
    $scope.ClearSmoking = function (item) {
        var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to clear  Smoking data? </h4>", function () {

            $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist = $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist || [];
            if ($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.length > 0) {
                angular.forEach($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist, function (item) {
                    if (item.DeleteInd == "N") {
                        item.SmokingStatusId = 0;
                        item.SmokingStatusName = "";
                        item.SmokingQuantityId = 0;
                        item.SmokingQuantityName = "";
                        item.SmokingDuration = "";
                        item.SmokingDurationType = "D";
                        item.SmokingDurationTypeName = "Day(s)";
                        item.SmokingDurationDate = null;
                        item.SmokeShowDateFormat = true;
                        item.SmokingType = '';
                        item.SmokingFromDate = null;
                        item.SmokingToDate = "";
                    }
                });

            }
            $scope.$digest();
        }, function () {
            r = "You pressed Cancel!";
        });
    };
    $scope.ClearAlchohal = function (item) {
        var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to clear  Alcohol data? </h4>", function () {
            $scope.HealthPhysicalObj.LifestyleHistory.AlcoholQuantityId = 0;
            $scope.HealthPhysicalObj.LifestyleHistory.AlcoholQuantityName = "";
            $scope.HealthPhysicalObj.LifestyleHistory.AlcoholStatusId = 0;
            $scope.HealthPhysicalObj.LifestyleHistory.SmokingQuantityName = "";
            $scope.HealthPhysicalObj.LifestyleHistory.AlcoholStatusName = "";
            $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationType = "D";
            $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDuration = null
            $scope.HealthPhysicalObj.LifestyleHistory.AlcoShowDateFormat = true;
            $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationDate = null;
            $scope.$digest();
        }, function () {
            r = "You pressed Cancel!";
        });
    };
    $scope.ClearDrug = function (item) {
        var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to clear  Drug data? </h4>", function () {
            let array = [];
            angular.forEach($scope.HealthPhysicalObj.LifestyleHistory.DrugArray, function (item) {
                if (item.DrugHistoryId != 0) {
                    item.ActiveInd = 'N';
                    array.push(item);
                }
            });
            $scope.HealthPhysicalObj.LifestyleHistory.DrugArray = array || [];
            if ($scope.DrugNames.length > 0) {
                angular.forEach($scope.DrugNames, function (item) {
                    item.Ischecked = false;
                });
                $scope.HealthPhysicalObj.LifestyleHistory.DrugStatusId = 0;
                $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate = null;
                $scope.HealthPhysicalObj.LifestyleHistory.DrugQuantityId = 0;
                $scope.HealthPhysicalObj.LifestyleHistory.DrugQuantityName = 0;
                $scope.HealthPhysicalObj.LifestyleHistory.DrugDuration = null
                $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationType = "D";
                $scope.HealthPhysicalObj.LifestyleHistory.DrugShowDateFormat = true;
                $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate = null
                $scope.HealthPhysicalObj.LifestyleHistory.DrugWhenQuitId = 0;
                $scope.DrugListSelectedText = "Select";
                $scope.AllDrugListSelected = false;
            }
            $scope.$digest();
        }, function () {
            r = "You pressed Cancel!";
        });
    };
    $scope.PreOpPostopcallCheckListTemplate = {
        templateUrl: 'AddPreOpPostopcallCheckListTemplate.html',
    };
    $scope.AddUpdatePreopPostopCallChecklistTemplate = function (Templatechecklist) {
        if ($scope.PreOpCallObj.TemplateName === "") {
            alertify.error("Please enter template name!");
            return false;
        }
        let templateReq = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "UserPreopPostopCallChecklistTemplateDetailId": 0,
            "TemplateName": $scope.PreOpCallObj.TemplateName,
            "DeleteInd": "N",
            "TemplateDetails": [],
        };
        let ChecklistGeneralArray = $filter('filter')($scope.PreOpCallObj.GeneralInstructionsCallChecklist, { 'Ischecked': true }, true);
        let ChecklistBillingArray = $filter('filter')($scope.PreOpCallObj.BillingInstructionsCallChecklist, { 'Ischecked': true }, true);
        if (ChecklistGeneralArray.length>0) {
            angular.forEach(ChecklistGeneralArray, function (item) {
                let obj = {
                    "AppointmentPreOpPostOpCallDetailId": 0,
                    "PreopPostopCallChecklistId": item.PreopPostopCallChecklistId,
                    "PreopPostopCallChecklist": item.PreopPostopCallChecklist,
                    "DeleteInd": "N",
                    "Typeid": item.Typeid,
                    "Typename": item.Typename,
                    "BillingAmout": null
                };
                templateReq.TemplateDetails.push(obj);
            });
        }
        if (ChecklistBillingArray.length > 0) {
            angular.forEach(ChecklistBillingArray, function (item) {
                let obj = {
                    "AppointmentPreOpPostOpCallDetailId": 0,
                    "PreopPostopCallChecklistId": item.PreopPostopCallChecklistId,
                    "PreopPostopCallChecklist": item.PreopPostopCallChecklist,
                    "DeleteInd": "N",
                    "Typeid": item.Typeid,
                    "Typename": item.Typename,
                    "BillingAmout": item.BillingAmout
                };
                templateReq.TemplateDetails.push(obj);
            });
        }
        console.log(templateReq);
        if (templateReq.TemplateDetails.length == 0) {
            alertify.error("Please Add atleast One Check list!");
            return false;
        } 

        eHnoteSurgeryService.AddUpdatePreOpPostopCallTemplates(templateReq).then(function (resp) {
            if (resp.data.status === "Success") {
                alertify.success("Template saved successfully!");
                $scope.PreOpCallObj.TemplateName = '';
                $scope.GetPreOpPostopcallCheckListTemplates();
            }
            if (resp.data.status === "Failure") {
                alertify.error(resp.data.Message)
            }
        }, function (err) {
            console.log(err);
        });
    }
    $scope.OnSelectChecklistTemplate = function (item) {

        if ($scope.PreOpCallObj.GeneralInstructionsCallChecklist.length > 0) {
            $scope.PreOpCallObj.GeneralInstructionsCallChecklist.forEach(nitem => {
                if (nitem.AppointmentPreOpPostOpCallDetailId != 0) {
                    nitem.DeleteInd = 'Y';
                }
                nitem.Ischecked = false;
            });
            angular.forEach($scope.PreOpCallObj.GeneralInstructionsCallChecklist, function (kitem) {
                let filtervalue = $filter('filter')(item.TemplateDetails, { 'PreopPostopCallChecklistId': kitem.PreopPostopCallChecklistId }, true) || [];
                if (filtervalue.length > 0) {
                    kitem.DeleteInd = 'N';
                    kitem.Ischecked  = true;
                }
            });
        }
        if ($scope.PreOpCallObj.BillingInstructionsCallChecklist.length > 0) {
            $scope.PreOpCallObj.BillingInstructionsCallChecklist.forEach(nitem => {
                if (nitem.AppointmentPreOpPostOpCallDetailId != 0) {
                    nitem.DeleteInd = 'Y';
                }
                nitem.Ischecked = false;
                nitem.BillingAmout = null;
            });
            angular.forEach($scope.PreOpCallObj.BillingInstructionsCallChecklist, function (kitem) {
                let filtervalue = $filter('filter')(item.TemplateDetails, { 'PreopPostopCallChecklistId': kitem.PreopPostopCallChecklistId }, true) || [];
                if (filtervalue.length > 0) {
                    kitem.DeleteInd = 'N';
                    kitem.Ischecked = true;
                    kitem.BillingAmout = filtervalue[0].BillingAmout;
                }
            });
        }
    }

    // Load From Previous
    $scope.LastVisitData = function () {
        eHnotePatientDataService.GetMedicalHistoriesByPatientId($scope.ParentObject.PatientID).then(function (resp) {
            resp.data = resp.data || '';
            if (resp.data !== '') {
                resp.data.rows = resp.data.rows || [];
                if (resp.data.rows.length > 0) {

                    $scope.AllergyItems = resp.data.rows[0].Allergy || [];

                    if ($scope.AllergyItems.length > 0) {

                        angular.forEach($scope.AllergyItems, function (item) {
                            if ((item.StatusId == 1) || item.AllergyId == 1 || item.AllergyId == 2) {
                                var isDuplicate = $scope.obj.AllergyItems.some(function (existingItem) {
                                    return existingItem.AllergyId === item.AllergyId && existingItem.DeleteInd == 'N';
                                });
                                if (!isDuplicate) {
                                    var object = {
                                        "PatientDetailId": null,
                                        "AllergyId": item.AllergyId,
                                        "AllergyName": item.AllergyName,
                                        "RcopiaAllergyId": item.RcopiaAllergyId,
                                        "AllergyTypeId": item.AllergyTypeId || null,
                                        "ShowNote": null,
                                        "RxNormID": item.RxNormID,
                                        "NDCID": item.NDCID,
                                        "SeverityId": item.SeverityId || '',
                                        "ReactionId": item.ReactionId || 0,
                                        "ReactionName": item.ReactionName || '',
                                        "StatusId": item.StatusId || '',
                                        "SnomedCode": item.SnomedCode || '',
                                        "SeverityDescription": item.SeverityName || '',
                                        "SNOMEDCTConceptID": item.SnomedCode || '',
                                        "OrganId": item.OrganId,
                                        "Deleted": "n",
                                        "DeleteInd": item.DeleteInd || 'N',
                                        "StatusName": item.StatusName || "",
                                        "DurationDate": item.DurationDate,
                                        "Duration": item.Duration,
                                        "DurationType": item.DurationType || "D",
                                        "AllergyRxNormId": item.AllergyRxNormId || null,
                                        "Remarks": item.Remarks || "",
                                        "StatusEndDate": item.StatusEndDate || null,
                                        "DrugFirstDataBankMedID": item.DrugFirstDataBankMedID,
                                        "IsFrequent": item.IsFrequent || "N",
                                        "ShowDateFormat": item.ShowDateFormat || false,
                                    };
                                    $scope.obj.AllergyItems.push(object);

                                    $scope.obj.AllergyRemarks = item.AllergyRemarks || "";

                                }
                            }
                        });

                        var IsAllergyDataAdded = false;
                        var TempAllergy = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
                            return fitem.AllergyId !== 1 && fitem.AllergyId !== 2 && fitem.DeleteInd == 'N';
                        }, true);

                        if (TempAllergy.length > 0) {
                            IsAllergyDataAdded = true;
                        }

                        if ($scope.obj.AllergyItems.length > 0) {
                            let List1 = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
                                return fitem.AllergyId === 1 && fitem.DeleteInd == 'N';
                            }, true);
                            if (List1.length > 0) {
                                $scope.obj.isNKASelected = true;
                            } else {
                                $scope.obj.isNKASelected = false;
                            }

                            let List2 = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
                                return fitem.AllergyId === 2 && fitem.DeleteInd == 'N';
                            }, true);
                            if (List2.length > 0) {
                                $scope.obj.isNKDASelected = true;
                            } else {
                                $scope.obj.isNKDASelected = false;
                            }
                        }

                        if (IsAllergyDataAdded) {
                            if ($scope.obj.isNKASelected) {
                                angular.forEach($scope.obj.AllergyItems, function (item, nindex) {
                                    var List = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
                                        return fitem.AllergyId === 1;
                                    }, true);
                                    if (List.length > 0) {
                                        if (List[0].PatientDetailId === 0) {
                                            var indexToRemove = $scope.obj.AllergyItems.indexOf(List[0]);
                                            if (indexToRemove !== -1) {
                                                $scope.obj.AllergyItems.splice(indexToRemove, 1);
                                            }
                                        } else {
                                            List[0].DeleteInd = 'Y';
                                        }
                                    }
                                    item.IsNKASelected = false
                                    $scope.obj.isNKASelected = false
                                });

                            }
                            if ($scope.obj.isNKDASelected) {
                                angular.forEach($scope.obj.AllergyItems, function (item, ndindex) {
                                    var List = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
                                        return fitem.AllergyId === 2;
                                    }, true);
                                    if (List.length > 0) {
                                        if (List[0].PatientDetailId === 0) {
                                            var indexToRemove = $scope.obj.AllergyItems.indexOf(List[0]);
                                            if (indexToRemove !== -1) {
                                                $scope.obj.AllergyItems.splice(indexToRemove, 1);
                                            }
                                        } else {
                                            List[0].DeleteInd = 'Y';
                                        }
                                    }
                                    item.IsNKDASelected = false
                                    $scope.obj.isNKDASelected = false
                                });
                            }
                        }

                        if ($scope.obj.AllergyItems.length > 0) {
                            angular.forEach($scope.obj.AllergyItems, function (item) {
                                item.ReactionName = item.ReactionName || ""
                                item.IsEdit = false;
                                item.DeleteInd = item.DeleteInd || 'N';
                                item.PatientDetailId = item.PatientDetailId || null;
                                item.DeleteInd = item.DeleteInd || 'N';
                                if (item.Remarks != '') {
                                    item.ShowNote = true;
                                }
                                item.DurationDate = item.DurationDate || '';
                                if (item.DurationDate != '') {
                                    item.ShowDateFormat = true;
                                    item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                                } else {
                                    item.ShowDateFormat = false;
                                }
                            });
                        }
                    }

                    // Current Systemic
                    $scope.CurrentSystemicMedicationsHistory = resp.data.rows[0].PatientCurrentSystemicMedications || [];

                    if ($scope.CurrentSystemicMedicationsHistory.length > 0) {

                        angular.forEach($scope.CurrentSystemicMedicationsHistory, function (item) {

                            var isDuplicate = $scope.obj.CurrentSystemicMedicationsHistory.some(function (existingItem) {
                                return existingItem.MedicineId === item.MedicineId && existingItem.DeleteInd == 'N';
                            });

                            if (item.IsMedicationStopped == false || item.IsMedicationStopped == null) {
                                if (!isDuplicate) {

                                    var object = {
                                        "CurrentSystemicMedicationId": 0,
                                        "HospitalId": item.OrganizationId || "",
                                        "MedicineId": item.MedicineId || "",
                                        "MedicineType": item.MedicineType || "",
                                        "MedicineTypeId": item.MedicineTypeId || "",
                                        "MedicineName": item.MedicineName || "",
                                        "MedicineObject": item.MedicineObject || "",
                                        "RcopiaDrugId": item.RcopiaDrugId || "",
                                        "RcopiaMedicationId": item.RcopiaMedicationId || null,
                                        "MedicationName": item.MedicationName || "",
                                        "DrugNDCID": item.DrugNDCID || "",
                                        "DrugFirstDataBankMedID": item.DrugFirstDataBankMedID || "",
                                        "DrugGenericId": item.DrugGenericId || "",
                                        "DrugBrandName": item.DrugBrandName || "",
                                        "DrugGenericName": item.DrugGenericName || "",
                                        "DrugForm": item.DrugForm || "",
                                        "DrugStrength": item.DrugStrength || "",
                                        "DrugSchedule": item.DrugSchedule || "",
                                        "DrugSupply": item.DrugSupply || "",
                                        "DrugCompound": item.DrugCompound || "",
                                        "MedicationTypeId": item.MedicationTypeId || "",
                                        "MedicationTypeName": item.MedicationTypeName || "",
                                        "Sig": item.Sig || "",
                                        "SigId": item.SigId || 0,
                                        "ActionId": item.ActionId || "",
                                        "Action": item.Action || "",
                                        "DoseId": item.DoseId || "",
                                        "Dose": item.Dose || "",
                                        "DoseUnitId": item.DoseUnitId || "",
                                        "DoseUnit": item.DoseUnit || "",
                                        "RouteId": item.RouteId || "",
                                        "Route": item.Route || "",
                                        "FrequencyId": item.FrequencyId || "",
                                        "Frequency": item.Frequency || "",
                                        "DoseOtherId": item.DoseOtherId || "",
                                        "DoseOther": item.DoseOther || "",
                                        "DaysSupplyId": item.DaysSupplyId || "",
                                        "DaysSupply": item.DaysSupply || "",
                                        "Quantity": item.Quantity || "",
                                        "QuantityUnitId": item.QuantityUnitId || "",
                                        "QuantityUnit": item.QuantityUnit || "",
                                        "RefillId": item.RefillId || "",
                                        "Refills": item.Refills || "",
                                        "SubstitutionPermitted": item.SubstitutionPermitted || "y",
                                        "PatientInstructions": item.PatientInstructions || "",
                                        "DeleteInd": "N",
                                        "OtherNotes": item.OtherNotes || "",
                                        "Remarks": item.Remarks || "",
                                        "StartDate": item.StartDate || null,
                                        "StopDate": item.StopDate || null,
                                        "FillDate": item.FillDate || '',
                                        "StopReason": item.StopReason || "",
                                        "RcopiaMedicationStatus": item.RcopiaMedicationStatus || "",
                                        "IsEdit": true,
                                        "ShowNote": false,
                                        "MedicationLocationTypeId": item.MedicationLocationTypeId,
                                        "MedicationLocationType": item.MedicationLocationType,
                                        "IsMedicationStopped": false,
                                    };

                                    $scope.obj.CurrentSystemicMedicationsHistory.push(object);
                                }
                            }
                        });

                        var CurrentEye = $filter("filter")($scope.obj.CurrentSystemicMedicationsHistory, { "MedicationLocationTypeId": 1 }, true);
                        var CurrentSystemic = $filter("filter")($scope.obj.CurrentSystemicMedicationsHistory, { "MedicationLocationTypeId": 2 }, true);

                        var IsCurrentEyeDataAdded = false;
                        var IsCurrentSystemicDataAdded = false;

                        if (CurrentEye.length > 0) {
                            var TempCurrentEye = $filter("filter")(CurrentEye, function (fitem) {
                                return fitem.MedicineId !== 1 && fitem.DeleteInd == 'N';
                            }, true);

                            if (TempCurrentEye.length > 0) {
                                IsCurrentEyeDataAdded = true;
                            }
                        }

                        if (CurrentSystemic.length > 0) {
                            var TempCurrentSystemic = $filter("filter")(CurrentSystemic, function (fitem) {
                                return fitem.MedicineId !== 2 && fitem.DeleteInd == 'N';
                            }, true);

                            if (TempCurrentSystemic.length > 0) {
                                IsCurrentSystemicDataAdded = true;
                            }
                        }

                        if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
                            let List = $filter("filter")($scope.obj.CurrentSystemicMedicationsHistory, function (fitem) {
                                return fitem.MedicineId === 1 && fitem.DeleteInd == 'N';
                            }, true);
                            if (List.length > 0) {
                                $scope.obj.isNKCEMSelected = true;
                            } else {
                                $scope.obj.isNKCEMSelected = false;
                            }
                            $scope.obj.CurrentSystemicMedicationsHistory[0].IsEdit = true;
                        }
                        if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
                            let List = $filter("filter")($scope.obj.CurrentSystemicMedicationsHistory, function (fitem) {
                                return fitem.MedicineId === 2 && fitem.DeleteInd == 'N';
                            }, true);
                            if (List.length > 0) {
                                $scope.obj.isNKCSMSelected = true;
                            } else {
                                $scope.obj.isNKCSMSelected = false;
                            }
                            $scope.obj.CurrentSystemicMedicationsHistory[0].IsEdit = true;
                        }
                        if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
                            angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (item) {
                                item.IsEdit = false;
                                if (item.Remarks != '') {
                                    item.ShowNote = true;
                                }
                                item.Duration = item.Duration || "";
                                if (item.Duration == "") { item.ShowDateFormat = true; } else { item.ShowDateFormat = false; }
                                item.MedicineObject = item.Sig || "";
                                item.RcopiaMedicationId = item.RcopiaMedicationId || null;
                                item.StartDate = $filter('date')(item.StartDate, "MM-dd-yyyy") || null;
                            });
                        }

                        if ($scope.obj.isNKCSMSelected && IsCurrentSystemicDataAdded) {
                            var List = $filter("filter")($scope.obj.CurrentSystemicMedicationsHistory, { "MedicineId": 2 }, true);
                            if (List.length > 0) {
                                angular.forEach(List, function (item) {
                                    if (item.PatientDetailId === 0) {
                                        var indexToRemove = $scope.obj.CurrentSystemicMedicationsHistory.indexOf(item);
                                        if (indexToRemove !== -1) {
                                            $scope.obj.CurrentSystemicMedicationsHistory.splice(indexToRemove, 1);
                                        }
                                    }
                                    else {
                                        item.DeleteInd = 'Y';
                                    }
                                });
                            }
                            $scope.obj.isNKCSMSelected = false;
                            angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (item) {
                                item.IsEdit = false;
                            });
                        }

                        if ($scope.obj.isNKCEMSelected && IsCurrentEyeDataAdded) {
                            var List = $filter("filter")($scope.obj.CurrentSystemicMedicationsHistory, { "MedicineId": 1 }, true);
                            if (List.length > 0) {
                                angular.forEach(List, function (item) {
                                    if (item.PatientDetailId === 0) {
                                        var indexToRemove = $scope.obj.CurrentSystemicMedicationsHistory.indexOf(item);
                                        if (indexToRemove !== -1) {
                                            $scope.obj.CurrentSystemicMedicationsHistory.splice(indexToRemove, 1);
                                        }
                                    }
                                    else {
                                        item.DeleteInd = 'Y';
                                    }
                                });
                            }
                            $scope.obj.isNKCEMSelected = false;
                            angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (item) {
                                item.IsEdit = false;
                            });
                        }
                    }


                    // Surgical History

                    $scope.SurgicalHistoryArray = resp.data.rows[0].PatientSurgical || [];

                    if ($scope.SurgicalHistoryArray.length > 0) {

                        angular.forEach($scope.SurgicalHistoryArray, function (Suitem) {
                            var isDuplicate = $scope.obj.SurgicalHistoryArray.some(function (existingItem) {
                                return existingItem.HistoryId === Suitem.HistoryId && existingItem.DeleteInd == 'N';
                            });

                            if (!isDuplicate) {
                                var object = {
                                    "PatientDetailId": 0,
                                    "HistoryId": Suitem.HistoryId,
                                    "HistoryName": Suitem.HistoryName,
                                    "IsEdit": Suitem.IsEdit || false,
                                    "showSurgicalHistory": Suitem.showSurgicalHistory || false,
                                    "ActiveInd": true,
                                    "DeleteInd": 'N',
                                    "DurationDate": Suitem.DurationDate || "",
                                    "Duration": Suitem.Duration || "",
                                    "DurationType": Suitem.DurationType || "D",
                                    "DurationTypeName": Suitem.DurationTypeName || "Day(s)",
                                    "Remarks": Suitem.Remarks || "",
                                    "ShowNote": Suitem.ShowNote || false,
                                    "ModifierId": Suitem.ModifierId || "",
                                    "MODIFIERCODE": Suitem.MODIFIERCODE || "",
                                    "ModifierObj": Suitem.ModifierObj || "",
                                    "CPTCode": Suitem.CPTCode || "",
                                    "ProcedureId": Suitem.ProcedureId || "",
                                    "CPTObj": Suitem.CPTCode || "",
                                    "ShowDateFormat": Suitem.ShowDateFormat || false,
                                    "IsFrequent": Suitem.IsFrequent || "N"
                                };
                                $scope.obj.SurgicalHistoryArray.push(object);
                            }
                        });

                        var IsSurgicalDataAdded = false;
                        var TempSurgical = $filter("filter")($scope.obj.SurgicalHistoryArray, function (fitem) {
                            return fitem.HistoryId !== 1 && fitem.DeleteInd == 'N';
                        }, true);

                        if (TempSurgical.length > 0) {
                            IsSurgicalDataAdded = true;
                        }

                        if ($scope.obj.SurgicalHistoryArray.length > 0) {
                            let List1 = $filter("filter")($scope.obj.SurgicalHistoryArray, function (fitem) {
                                return fitem.HistoryId === 1 && fitem.DeleteInd == 'N';
                            }, true);
                            if (List1.length > 0) {
                                $scope.obj.isNKSGHSelected = true;
                            } else {
                                $scope.obj.isNKSGHSelected = false;
                            }
                        }

                        if ($scope.obj.isNKSGHSelected && IsSurgicalDataAdded) {
                            angular.forEach($scope.obj.SurgicalHistoryArray, function (item) {
                                var List = $filter("filter")($scope.obj.SurgicalHistoryArray, function (fitem) {
                                    return fitem.HistoryId === 1;
                                }, true);
                                if (List.length > 0) {
                                    if (List[0].PatientDetailId === 0) {
                                        var indexToRemove = $scope.obj.SurgicalHistoryArray.indexOf(List[0]);
                                        if (indexToRemove !== -1) {
                                            $scope.obj.SurgicalHistoryArray.splice(indexToRemove, 1);
                                        }
                                    } else {
                                        List[0].DeleteInd = 'Y';
                                    }
                                }
                                item.isNKSGHSelected = false
                                $scope.obj.isNKSGHSelected = false
                            });

                        }

                        if ($scope.obj.SurgicalHistoryArray.length > 0) {
                            angular.forEach($scope.obj.SurgicalHistoryArray, function (item) {
                                item.IsEdit = false;
                                if (item.Remarks != '') {
                                    item.ShowNote = true;
                                }
                                item.DurationDate = item.DurationDate || '';
                                if (item.DurationDate != '') {
                                    item.ShowDateFormat = true;
                                    item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                                } else {
                                    item.ShowDateFormat = false;
                                }

                            });
                        }

                    }

                    $scope.LifestyleHistory = resp.data.rows[0].PatientLifestyle || [];
                   // $scope.HealthPhysicalObj.LifestyleHistoryArray = angular.copy($scope.LifestyleHistory) || [];
                    if ($scope.LifestyleHistory.length > 0) {

                        angular.forEach($scope.LifestyleHistory, function (Litem) {
                            var isDuplicate = $scope.HealthPhysicalObj.LifestyleHistoryArray.some(function (existingItem) {
                                return existingItem.HistoryId === Litem.HistoryId;
                            });


                            if (!isDuplicate) {
                                $scope.HealthPhysicalObj.LifestyleHistoryArray = angular.copy($scope.LifestyleHistory);
                                angular.forEach($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
                                    item.PatientDetailId = 0;
                                    if (item.HistoryId == 1) {
                                        $scope.HealthPhysicalObj.LifestyleHistory.SmokingType = item.SmokingType;

                                        if (item.SmokingFromDate != '' && item.SmokingFromDate != null) {
                                            item.SmokeShowDateFormat = true;
                                            item.SmokingFromDate = $filter('date')(item.SmokingFromDate, "MM-dd-yyyy");
                                        }
                                    }

                                    if (item.HistoryId == 2) {
                                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = item.AlcoholType;

                                        if (item.AlcoholDurationDate != '' && item.AlcoholDurationDate != null) {
                                            item.AlcoShowDateFormat = true;
                                            item.AlcoholDurationDate = $filter('date')(item.AlcoholDurationDate, "MM-dd-yyyy");
                                        }

                                    }
                                    if (item.HistoryId == 3) {
                                        $scope.HealthPhysicalObj.LifestyleHistory.DrugType = item.DrugType;

                                        if (item.DrugDurationDate != '' && item.DrugDurationDate != null) {
                                            item.DrugShowDateFormat = true;
                                            item.DrugDurationDate = $filter('date')(item.DrugDurationDate, "MM-dd-yyyy");
                                        }
                                    }
                                    if (item.HistoryId == 4) {
                                        $scope.HealthPhysicalObj.LifestyleHistory.PsychisType = item.PsychisType;
                                    }

                                });

                                if ($scope.HealthPhysicalObj.DrugNames.length > 0) {
                                    var drugObj = $scope.HealthPhysicalObj.LifestyleHistoryArray.find(function (historyItem) {
                                        return historyItem.HistoryId === 3;
                                    });
                                    if (drugObj) {
                                        drugObj.DrugArray = drugObj.DrugArray || [];

                                        if (drugObj.DrugArray.length > 0) {
                                            angular.forEach($scope.HealthPhysicalObj.DrugNames, function (item) {
                                                var statusfilter = $filter("filter")(drugObj.DrugArray, { "HistoryHabitsId": item.HistoryHabitsID }, true) || [];
                                                if (statusfilter.length > 0) {
                                                    angular.forEach(drugObj.DrugArray, function (ditem) {
                                                        if (item.HistoryHabitsID == ditem.HistoryHabitsId && ditem.ActiveInd == "Y") {
                                                            item.Ischecked = true;
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }

                            } else {

                                $scope.HealthPhysicalObj.LifestyleHistoryArray = angular.copy($scope.HealthPhysicalObj.LifestyleHistoryArray);
                            }
                        });
                    }

                    //  SystemicHistory     
                    $scope.SystemicHistory = resp.data.rows[0].SystemicHistory || [];

                    $scope.SystemicHistory = $scope.SystemicHistory || [];
                    if ($scope.SystemicHistory.length > 0) {

                        angular.forEach($scope.SystemicHistory, function (item) {
                            let tempArray = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'HistoryId': item.HistoryId }, true);
                            if (tempArray.length == 0) {
                                item.IsChecked = true;
                                item.PatientDetailId = 0;
                                $scope.HealthPhysicalObj.SystemicHistoryArray.push(item);
                            }
                        });
                        angular.forEach($scope.SystemicHistory, function (Aitem) {
                            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (Bitem) {
                                if (Aitem.HistoryId == Bitem.HistoryId) {
                                    Bitem.IsEdit = false;
                                    Bitem.SnomedCodeobj = Aitem.SNOMEDCODE || '';

                                    Bitem.PatientDetailId = Bitem.PatientDetailId || 0;
                                    if (Bitem.PatientDetailId != 0) {
                                        Bitem.PatientDetailId = Bitem.PatientDetailId || 0;
                                        Bitem.StatusId = Bitem.StatusId;
                                    } else {
                                        Bitem.PatientDetailId = 0;
                                        Bitem.StatusId = 1;
                                    }

                                    Bitem.Value = Aitem.Value;
                                    Bitem.IsNoshowROS = Aitem.IsNoshowROS || false;
                                    Bitem.Remarks = Aitem.Remarks || '';
                                    Bitem.IsChecked = true;
                                    if (Bitem.Remarks != '') {
                                        Bitem.ShowNote = true;
                                    }
                                    Bitem.SeverityId = Aitem.SeverityId || null;
                                    Bitem.DurationDate = Aitem.DurationDate || null;
                                    Bitem.Duration = Aitem.Duration || '';
                                    Bitem.DurationType = Aitem.DurationType || 'D';
                                    Bitem.ICD10CODE = Aitem.ICD10CODE || '';
                                    Bitem.SNOMEDCODE = Aitem.SNOMEDCODE || '';
                                    Bitem.IsFrequent = Aitem.IsFrequent || "",
                                        Bitem.DeleteInd = Aitem.DeleteInd || "N",
                                        Aitem.DurationDate = Aitem.DurationDate || null;
                                    if (Aitem.DurationDate != null) {
                                        Bitem.ShowDateFormat = true;
                                        Bitem.DurationDate = $filter('date')(Aitem.DurationDate, "MM-dd-yyyy");
                                    } else {
                                        Bitem.ShowDateFormat = false;
                                    }

                                    //if (Bitem.HistoryId == 118 || Bitem.HistoryId == 119 || Bitem.HistoryId == 120 || Bitem.HistoryId == 121 || Bitem.HistoryId == 118) {
                                    //    Bitem.IsChecked = false;
                                    //}
                                }
                            });
                        });
                        let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 110);
                        if (templest.length > 0) {
                            if (templest[0].Value == 'Yes' && templest[0].HistoryId == 110) {
                                let templest1 = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 158 || x.HistoryId == 159);
                                if (templest1.length > 0) {
                                    angular.forEach(templest1, function (Aitem) {
                                        Aitem.IsDiabetes = true;
                                    })
                                }

                            }
                        }

                        let templest2 = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 114);
                        if (templest2.length > 0) {
                            if (templest2[0].Value == 'Yes' && templest2[0].HistoryId == 114) {
                                let templest3 = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 160 || x.HistoryId == 161);
                                if (templest3.length > 0) {
                                    angular.forEach(templest3, function (Aitem) {
                                        Aitem.IsDiabetes = true;
                                    })
                                }

                            }
                        }

                        if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
                            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                                if (item.DeleteInd == 'N' && item.IsChecked) {
                                    var FreqList = $filter("filter")($scope.FrequentlySystemicHistory, function (fitem) {
                                        return fitem.HistoryId == item.HistoryId;
                                    }, true) || [];
                                    if (FreqList.length > 0) {
                                        item.IsFrequent = 'Y';
                                        FreqList[0].Onselect = true;
                                    } else {
                                        item.IsFrequent = 'N';
                                    }
                                }
                            });
                            $scope.HealthPhysicalObj.SystemicHistoryArray[0].IsEdit = true;
                        }

                        var IsSystemicDataAdded = false;
                        var TempSystemic = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, function (fitem) {
                            return fitem.HistoryId !== 1 && fitem.IsChecked == true && fitem.DeleteInd == 'N';
                        }, true);

                        if (TempSystemic.length > 0) {
                            IsSystemicDataAdded = true;
                        }
                        if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
                            let List1 = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, function (fitem) {
                                return fitem.HistoryId === 1 && fitem.DeleteInd == 'N';
                            }, true);
                            if (List1.length > 0) {
                                $scope.obj.isNKSHSelected = true;
                            } else {
                                $scope.obj.isNKSHSelected = false;
                            }
                        }

                        if ($scope.obj.isNKSHSelected && IsSystemicDataAdded) {
                            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                                var ListSystemic = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, function (fitem) {
                                    return fitem.HistoryId === 1;
                                }, true);
                                if (ListSystemic.length > 0) {
                                    if (ListSystemic[0].PatientDetailId === 0) {
                                        var indexToRemove = $scope.HealthPhysicalObj.SystemicHistoryArray.indexOf(ListSystemic[0]);
                                        if (indexToRemove !== -1) {
                                            $scope.HealthPhysicalObj.SystemicHistoryArray.splice(indexToRemove, 1);
                                        }
                                    } else {
                                        ListSystemic[0].DeleteInd = 'Y';
                                    }
                                }
                                item.isNKSHSelected = false
                                $scope.obj.isNKSHSelected = false
                            });
                        }
                    }
                };
            };
        }, function (err) {
            alertify.error(err.data.ExceptionMessage);
        });
    }

    $scope.ChangeCardiacAppForsearchview = function (item) {
        item.IsChecked = false;
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        }
  
    }


    $scope.previousSearchText = "";
    $scope.filteredAllergyList = [];

    $scope.GetAllergyListFromRcopia = function (val) {
        if (!val || val.trim().length === 0) {
            $scope.previousSearchText = "";
            $scope.filteredAllergyList = [];
            return [];
        }
        var req = {
            "VendorName": "Appolo Pharmacy",
            "VendorPassword": "abc123",
            "searchText": val || "nexium",
            "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
            "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
            "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId
        };

        if (!val || val.length < 3) {
            $scope.previousSearchText = "";
            $scope.filteredAllergyList = [];
            return [];
        }

        if (!$scope.previousSearchText && $scope.filteredAllergyList.length === 0) {
            return eHnoteConditionsDataService.getAllergyDataFromRcopia(req).then(function (resp) {
                if (resp.data.AllergyList !== undefined) {
                    if (resp.data.AllergyList.length < 200) {
                        $scope.previousSearchText = val;
                        $scope.filteredAllergyList = resp.data.AllergyList;
                        return resp.data.AllergyList;
                    } else {
                        $scope.previousSearchText = "";
                        $scope.filteredAllergyList = [];
                        alertify.error('More Records Available!');
                        return resp.data.AllergyList;
                    }
                }
            });
        } else {
            if (val && $scope.previousSearchText && val.toLowerCase().startsWith($scope.previousSearchText.toLowerCase()) && $scope.filteredAllergyList.length < 200) {
                return $scope.filteredAllergyList.filter(function (item) {
                    return item.BrandName && item.BrandName.toLowerCase().includes(val.toLowerCase());
                });
            } else {
                $scope.previousSearchText = "";
                $scope.filteredAllergyList = [];
                return eHnoteConditionsDataService.getAllergyDataFromRcopia(req).then(function (resp) {
                    if (resp.data.AllergyList !== undefined) {
                        if (resp.data.AllergyList.length < 200) {
                            $scope.previousSearchText = val;
                            $scope.filteredAllergyList = resp.data.AllergyList;
                            return resp.data.AllergyList;
                        } else {
                            $scope.previousSearchText = "";
                            $scope.filteredAllergyList = [];
                            alertify.error('More Records Available!');
                            return resp.data.AllergyList;
                        }
                    }
                });
            }
        }
    };

    $scope.ChangeSystemicCardiacApp = function (item) {      
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }
    $scope.ChangeSystemicPulmonaryApp = function (item) {
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }
    $scope.ChangeSystemicNeuroApp = function (item) {
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }
    $scope.ChangeSystemicHepaticApp = function (item) {
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }
    $scope.ChangeSystemiHemeOneApp = function (item) {
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }
    $scope.ChangeSystemicKidneyApp = function (item) {
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }
    $scope.ChangeSystemicMuscuApp = function (item) {
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }
    $scope.ChangeSystemicEndocrineApp = function (item) {
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
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


    $scope.RosSummaryPrint = function () {

        let obj = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": $scope.ParentObject.AscAppointmentId || 0,
            "PatientId": $scope.ParentObject.PatientID|| 0,
            "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId
        };

        eHnoteSurgeryService.GetOTQuickAccessDetails(obj).then(function (resp) {
            if (resp.data.status === "Success") {

                $scope.OrganizationDetails = resp.data.OrganizationDetails || [];
                if ($scope.OrganizationDetails.length && $scope.OrganizationDetails[0]?.OrganizationLogoUrl) {
                    $scope.toDataURL($scope.OrganizationDetails[0].OrganizationLogoUrl, function (dataURL) {
                        $scope.$applyAsync(() => {
                            $scope.OrganizationDetails[0].OrganizationLogoUrl = dataURL;
                            $scope.generateRosPrint(resp);
                        });
                    });
                } else {
                    $scope.generateRosPrint(resp);
                }
            }
        });

    }

    $scope.generateRosPrint = function (resp) {
        var AllergyItems = [];
        if (resp.data.AllergyItems.length > 0) {
            AllergyItems = angular.copy(resp.data.AllergyItems);
        }

        if (resp.data.SurgicalHistory.length > 0) {
            $scope.SurgicalHistory = angular.copy(resp.data.SurgicalHistory);
        } else {
            $scope.SurgicalHistory = [];
        }


        let systemiclist = $filter('filter')(resp.data.CurrentSystemicMedicationList, { 'MedicationLocationTypeId': 1 }, true) || [];
        if (systemiclist.length > 0) {
            $scope.CurrentSystemicMedicationsHistory = angular.copy(systemiclist);
        } else {
            $scope.CurrentSystemicMedicationsHistory = [];
        }

        let systemiceyelist = $filter('filter')(resp.data.CurrentSystemicMedicationList, { 'MedicationLocationTypeId': 2 }, true) || [];
        if (systemiceyelist.length > 0) {
            $scope.CurrentEyeMedications = angular.copy(systemiceyelist);
        } else {
            $scope.CurrentEyeMedications = [];
        }

        $scope.AllergyRemarks = resp.data.AllergyRemarks || '';
        $scope.SurgicalRemarks = resp.data.SurgicalRemarks || '';
        $scope.CurrentEyeRemarks = resp.data.CurrentEyeRemarks || '';
        $scope.CurrentSystemicRemarks = resp.data.CurrentSystemicRemarks || '';
        $scope.SystemicHistoryRemarks = resp.data.SystemicHistoryRemarks || '';
        $scope.LifestyleHistoryRemarks = resp.data.LifestyleHistoryRemarks || '';

        let CreatedByName = "";
        if (doctorinfo.doctordata.User.length > 0) {
            if (doctorinfo.doctordata.User[0].Suffix !== '') {
                CreatedByName = CreatedByName + doctorinfo.doctordata.User[0].FullName + ' ' + doctorinfo.doctordata.User[0].Suffix || "";
            } else {
                CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
            }
        }


        let CPTCode = "";
        let DiagnosisName = "";
        let AnesthesistName = "";
        let SurgeryName = "";
        let AdditionalSurgeryName = "";
        let SurgeonName = "";
        let OrganName = "";
        let ICDCode = "";
        let Surgeonlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.cacheStorageItem.DoctorID }, true);
        if (Surgeonlist.length > 0) {
            SurgeonName = Surgeonlist[0].UserFullName;
        } else {
            SurgeonName = '';
        }
        if (resp.data.SurgeryList.length > 0) {
            angular.forEach(resp.data.SurgeryList, function (item) {
                if (resp.data.SurgeryList[0].DiagnosisList.length > 0) {
                    angular.forEach(resp.data.SurgeryList[0].DiagnosisList, function (sitem) {
                        var IcdCode = '';
                        sitem.ICDCode = sitem.ICDCode || '';
                        if (sitem.ICDCode !== '') {
                            IcdCode = sitem.ICDCode;
                        }
                        DiagnosisName += ", " + IcdCode + '-' + sitem.DiagnosisName;
                    });
                    if (DiagnosisName.charAt(0) === ",") {
                        DiagnosisName = DiagnosisName.slice(1);
                    }
                }
                if (item.AnesthetistId != null) {
                    let Anesthesistlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.AnesthetistId }, true);
                    if (Anesthesistlist.length > 0) {
                        AnesthesistName = Anesthesistlist[0].UserFullName;
                    } else {
                        AnesthesistName = "";
                    }
                }
                item.OrganId = item.OrganId || "";
                if (item.OrganId !== '') {
                    if (item.OrganId == 1) {
                        OrganName = "OD";
                    } else if (item.OrganId == 2) {
                        OrganName = "OS";
                    } else if (item.OrganId == 3) {
                        OrganName = "OU";
                    } else if (item.OrganId == 4) {
                        OrganName = "General";
                    }
                }
            });
            SurgeryName = resp.data.SurgeryList[0].SurgeryName || "";
            CPTCode = resp.data.SurgeryList[0].CPTCode || "";
            var Description = "";
            if (resp.data.SurgeryList[0].AdditionalSurgery.length > 0) {
                angular.forEach(resp.data.SurgeryList[0].AdditionalSurgery, function (sitem) {
                    let OrganName = '';
                    sitem.OrganId = sitem.OrganId || null;
                    if (sitem.OrganId !== null) {
                        if (sitem.OrganId == 1) {
                            OrganName = "(OD)";
                        } else if (sitem.OrganId == 2) {
                            OrganName = "(OS)";
                        } else if (sitem.OrganId == 3) {
                            OrganName = "(OU)";
                        } else if (sitem.OrganId == 4) {
                            OrganName = "General";
                        }
                    }

                    Description += "," + sitem.Description + OrganName;
                });
                if (Description.charAt(0) === ",") {
                    Description = Description.slice(1);
                }
            }
            if (Description != '') {
                AdditionalSurgeryName += Description;
            }
        }


        var LifestyleDetail = [];
        if (resp.data.LifestyleDetail.length > 0) {
            if (resp.data.LifestyleDetail[0].AlcoholType !== '' || resp.data.LifestyleDetail[0].DrugType !== '' || resp.data.LifestyleDetail[0].SmokingType !== '' || resp.data.LifestyleDetail[0].PsychisType !== '' || resp.data.LifestyleDetail[0].Remarks != '') {
                LifestyleDetail = angular.copy(resp.data.LifestyleDetail);
            }
        } else {
            LifestyleDetail = [];
        }



        var SystemicHistoryArray = [];
        if (resp.data.SystemicHistory.length > 0) {
            angular.forEach(resp.data.SystemicHistory, function (item) {
                if (item.TypeId != 19) {
                    SystemicHistoryArray.push(item);
                }
            });
        } else {
            SystemicHistoryArray = [];
        }

        var Organization = '';
        if ($scope.IsTecEyeCareOrg) {
            Organization = 'Tec';
        } else {
            Organization = '';
        }

        $timeout(function () {
            var Object = {
                "CreatedBy": CreatedByName,
                'Surgeon': SurgeonName || '',
                "Anesthetist": AnesthesistName || '',
                "Diagnosis": DiagnosisName || '',
                "ICDCode": ICDCode || "",
                "Name": $scope.cacheStorageItem.PatientName || '',
                "Age": $scope.cacheStorageItem.Age || '',
                "Gender": $scope.cacheStorageItem.Gender || '',
                "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
                "PatientOldMrno": $scope.cacheStorageItem.PatientOldMrno || '',
                "VisitType": $scope.cacheStorageItem.AppointmentType || '',
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "PatientDOB": $scope.cacheStorageItem.PatientDOB || '',
                "SurgeryDate": $scope.cacheStorageItem.AppointmentDate || '',
                "AppointmentTime": $scope.cacheStorageItem.AppointmentTime || '',
                "SurgeryName": SurgeryName || '',
                "AdditionalSurgeryName": AdditionalSurgeryName || '',
                "OrganName": OrganName || '',
                "AllergyItems": AllergyItems || [],
                "SystemichistoryData": SystemicHistoryArray || [],
                "SurgicalHistory": $scope.SurgicalHistory || [],
                "CurrentSystemicMedicationsHistory": $scope.CurrentSystemicMedicationsHistory || [],
                "CurrentEyeMedications": $scope.CurrentEyeMedications || [],
                "SocialData": LifestyleDetail || [],
                "EhnoteLogoURL": $scope.HeaderLogo || '',
                'AllergyRemarks': $scope.AllergyRemarks || '',
                'SurgicalRemarks': $scope.SurgicalRemarks || '',
                'CurrentEyeRemarks': $scope.CurrentEyeRemarks || '',
                'CurrentSystemicRemarks': $scope.CurrentSystemicRemarks || '',
                'SystemicHistoryRemarks': $scope.SystemicHistoryRemarks || '',
                'LifestyleHistoryRemarks': $scope.LifestyleHistoryRemarks || '',
                "Organization": Organization || '',
                "CPTCode": CPTCode || '',
                "OrganizationDetails": $scope.OrganizationDetails || [],
                "EhnoteOrganisationLogoUrl": $scope.OrganizationDetails?.[0]?.OrganizationLogoUrl || '',
            }

            USPrintService.GenerateASCPreopRosSummaryPrint(Object);

        }, 500);
    }

    $scope.setSideEffect = function (value) {
        if ($scope.PostOpCallObj.SideEffects === value) {
            $scope.PostOpCallObj.SideEffects = '';
            $scope.PostOpCallObj.SideEffectsReason = '';
        } else {
            $scope.PostOpCallObj.SideEffects = value;
            if (value === 'No') {
                $scope.PostOpCallObj.SideEffectsReason = '';
            }
        }
    }

    $scope.setMedicationHelping = function (value) {
        if ($scope.PostOpCallObj.MedicationHelping === value) {
            $scope.PostOpCallObj.MedicationHelping = '';
            $scope.PostOpCallObj.MedicationHelpingReason = '';
        } else {
            $scope.PostOpCallObj.MedicationHelping = value;
            if (value === 'Yes') {
                $scope.PostOpCallObj.MedicationHelpingReason = '';
            }
        }
    };

    $scope.setConfirmedAppointment = function (value) {
        if ($scope.PostOpCallObj.ConfirmedAppointment === value) {
            $scope.PostOpCallObj.ConfirmedAppointment = '';
            $scope.PostOpCallObj.RescheduleConfirmed = false
        } else {
            $scope.PostOpCallObj.ConfirmedAppointment = value;
            if (value === 'Yes') {
                $scope.PostOpCallObj.RescheduleConfirmed = false;
            }
        }
    };

    $scope.setActivityRestrictions = function (value) {
        if ($scope.PostOpCallObj.ActivityRestrictions === value) {
            $scope.PostOpCallObj.ActivityRestrictions = '';
        } else {
            $scope.PostOpCallObj.ActivityRestrictions = value;
        }
    };

    $scope.setEyeShieldUsed = function (value) {
        if ($scope.PostOpCallObj.EyeShieldUsed === value) {
            $scope.PostOpCallObj.EyeShieldUsed = '';
        } else {
            $scope.PostOpCallObj.EyeShieldUsed = value;
        }
    };

    $scope.setEyeDropUnderstanding = function (value) {
        if ($scope.PostOpCallObj.EyeDropScheduleUnderstanding === value) {
            $scope.PostOpCallObj.EyeDropScheduleUnderstanding = '';
        } else {
            $scope.PostOpCallObj.EyeDropScheduleUnderstanding = value;
        }
    };

    $scope.setNauseaOrVomiting = function (value) {
        if ($scope.PostOpCallObj.NauseaOrVomiting === value) {
            $scope.PostOpCallObj.NauseaOrVomiting = '';
            $scope.PostOpCallObj.NauseaSeverity = null;
        } else {
            $scope.PostOpCallObj.NauseaOrVomiting = value;
            if (value === 'No') {
                $scope.PostOpCallObj.NauseaSeverity = null;
            }
        }
    };

    $scope.selectGeneralWellBeingItem = function (selectedItem) {
        angular.forEach($scope.PostOpCallObj.PostOpCallActionTakenCheckList, function (item) {
            if (item.TypeId === 2 && item.PostOpCallActionTakenCheckListId !== selectedItem.PostOpCallActionTakenCheckListId) {
                item.Ischecked = false;
            }
        });
        selectedItem.Ischecked = selectedItem.Ischecked;

        if (selectedItem.PostOpCallActionTakenCheckListId == 8 && selectedItem.Ischecked == false) {
            selectedItem.Remarks = '';
        }
    };

    $scope.selectBeforeSurgeryItem = function (selectedItem) {
        angular.forEach($scope.PostOpCallObj.PostOpCallActionTakenCheckList, function (item) {
            if (item.TypeId === 4 && item.PostOpCallActionTakenCheckListId !== selectedItem.PostOpCallActionTakenCheckListId) {
                item.Ischecked = false;
               
            }
        });
        selectedItem.Ischecked = selectedItem.Ischecked;

        if (selectedItem.PostOpCallActionTakenCheckListId==18 && selectedItem.Ischecked == false) {
            selectedItem.Remarks = '';
        }
    };

    $scope.onPreOpChecklistChange = function (mitem) {
        if (mitem.IsChecked === false) {
            mitem.DeleteInd = 'Y';
        } else {
            mitem.DeleteInd = 'N'; 
        }
    };

    $scope.cacheStorageItem.PatientImageS3URL = $scope.ParentObject.S3URL || '';
    $scope.cacheStorageItem.FullName = $scope.ParentObject.FullName || '';
    $scope.cacheStorageItem.PatientDisplayId = $scope.ParentObject.PatientDisplayId || '';
    $scope.cacheStorageItem.PatientID = $scope.ParentObject.PatientID || '';
    $scope.patiendetilsopen = function () {
        let patientId = $scope.cacheStorageItem.PatientID || 0;
        eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetPatientDetailsSuccess(data) {
            if (data !== undefined) {
                var selectedPatientData = data;

                $scope.PaitentDetails = {
                    "FullName": selectedPatientData.Patient[0].FullName || "",
                    "PatientDisplayId": selectedPatientData.Patient[0].PatientDisplayId || "",
                    "MobileNo": selectedPatientData.Patient[0].MobileNo || 0,
                    "DOB": selectedPatientData.Patient[0].DOB || "",
                    "AgeInYears": selectedPatientData.Patient[0].AgeInYears || 0,
                    "AgeInMonths": selectedPatientData.Patient[0].AgeInMonths || 0,
                    "S3URL": selectedPatientData.Patient[0].S3URL || "",
                    "SocialSecurityNo": selectedPatientData.Patient[0].SocialSecurityNo || "",
                    "BloodGroupName": selectedPatientData.Patient[0].PatientOtherDetails[0].BloodGroupName || "",
                    "MaritalStatusName": selectedPatientData.Patient[0].PatientOtherDetails[0].MaritalStatus || "",
                    "ExternalComanagerName": selectedPatientData.Patient[0].ExternalComanagerName || '',
                    "InternalComanagerName": selectedPatientData.Patient[0].InternalComanagerName || '',
                    "PCPDoctorName": selectedPatientData.Patient[0].PCPDoctorName || '',
                    "RefferalName": selectedPatientData.Patient[0].ReferralName || '',
                    "ContactInfo": {
                        "EmailID": selectedPatientData.Patient[0].EmailId || "",
                    }
                }

                $scope.PostalAddressSummaryObj = {
                    "AddressId": selectedPatientData.PatientAddress.PostalAddress.AddressId || 0,
                    "AddressLine1": selectedPatientData.PatientAddress.PostalAddress.AddressLine1 || "",
                    "AddressLine2": selectedPatientData.PatientAddress.PostalAddress.AddressLine2 || "",
                    "ZipCode": selectedPatientData.PatientAddress.PostalAddress.ZipCode || "",
                    "CountyId": selectedPatientData.PatientAddress.PostalAddress.CountyId || 0,
                    "CountyName": selectedPatientData.PatientAddress.PostalAddress.CountyName || "",
                    "CityName": selectedPatientData.PatientAddress.PostalAddress.CityName || "",
                    "CityId": selectedPatientData.PatientAddress.PostalAddress.CityId || 0,
                    "StateName": selectedPatientData.PatientAddress.PostalAddress.StateName || "",
                    "StateId": selectedPatientData.PatientAddress.PostalAddress.StateId || 0,
                    "CountryName": selectedPatientData.PatientAddress.PostalAddress.CountryName || "",
                    "CountryId": selectedPatientData.PatientAddress.PostalAddress.CountryId || 0,
                }

                $scope.PermanentAddressSummaryObj = {
                    "AddressId": selectedPatientData.PatientAddress.PermanentAddress.AddressId || 0,
                    "AddressLine1": selectedPatientData.PatientAddress.PermanentAddress.AddressLine1 || "",
                    "AddressLine2": selectedPatientData.PatientAddress.PermanentAddress.AddressLine2 || "",
                    "ZipCode": selectedPatientData.PatientAddress.PermanentAddress.ZipCode || "",
                    "CountyId": selectedPatientData.PatientAddress.PermanentAddress.CountyId || 0,
                    "CountyName": selectedPatientData.PatientAddress.PermanentAddress.CountyName || "",
                    "CityName": selectedPatientData.PatientAddress.PermanentAddress.CityName || "",
                    "CityId": selectedPatientData.PatientAddress.PermanentAddress.CityId || 0,
                    "StateName": selectedPatientData.PatientAddress.PermanentAddress.StateName || "",
                    "StateId": selectedPatientData.PatientAddress.PermanentAddress.StateId || 0,
                    "CountryName": selectedPatientData.PatientAddress.PermanentAddress.CountryName || "",
                    "CountryId": selectedPatientData.PatientAddress.PermanentAddress.CountryId || 0,
                }

                $scope.PatientOfficeNumber = selectedPatientData.Patient[0].OfficeAreaCode + selectedPatientData.Patient[0].PatientOfficeNumber;
                var obj1 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeNumber);
                $scope.PatientOfficeNumber = obj1.UsFormatMobileNumber;

                $scope.PatientMobileNumber = selectedPatientData.Patient[0].MobileNo;
                var obj2 = eHnoteUserDataService.UsMobileFormatChange($scope.PatientMobileNumber);
                $scope.PatientMobileNumber = obj2.UsFormatMobileNumber;

                $scope.DemographicSummaryObj = {
                    "LanguageName": selectedPatientData.Patient[0].AdditionalInfo.LanguageName || "",
                    "Proficiency": selectedPatientData.Patient[0].AdditionalInfo.Proficiency || "",
                    "SexualOrientation": selectedPatientData.Patient[0].AdditionalInfo.SexualOrientation || "",
                    "GenderIdentityStatus": selectedPatientData.Patient[0].AdditionalInfo.GenderIdentity || "",
                }

            }
        }
        function ongetPatientDetailsError(error) {
            console.log(error);
        }
    }
    
}]);
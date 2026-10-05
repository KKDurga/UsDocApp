"use strict";
eHnoteWebApp.controller("USAscSummaryParentCtrl", ["$scope", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "eHnoteSettingsDataService", "datapersistanceFactory", "eHnoteDiagnosisDataServices", "eHnoteSurgeryService", "$q", "$timeout", "eHnoteMainAdminServices", "eHnoteMainAppointmentService", "USPrintService", "eHnoteAuditServices", "eHnoteConditionsDataService", function ($scope, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, eHnoteSettingsDataService, datapersistanceFactory, eHnoteDiagnosisDataServices, eHnoteSurgeryService, $q, $timeout, eHnoteMainAdminServices, eHnoteMainAppointmentService, USPrintService, eHnoteAuditServices, eHnoteConditionsDataService) {

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.ParenthospitalId = 0;
    $scope.HospitalId = 0;
    $scope.SelectedFile = 18;
    $scope.currentDate = $filter('date')(new Date(), "yyyy-MM-dd");
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    };
    $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
    $scope.AddToCache = function () {
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    };

    $scope.AscSummaryTabObj = {
        "SelectedTab": 1
    }

    $scope.GetIntraopAnesthetistVitals = function () {
        return [
            {
                "Id": 1,
                "VitalName": "Systolic Pressure",
                "VitalReadingList": [],
            },
            {
                "Id": 2,
                "VitalName": "Diastolic Pressure",
                "VitalReadingList": [],
            },
            {
                "Id": 3,
                "VitalName": "Pulse",
                "VitalReadingList": [],
            },
            {
                "Id": 4,
                "VitalName": "Resp.Rate",
                "VitalReadingList": [],
            },
            //{
            //    "Id": 5,
            //    "VitalName": "Spo 2",
            //    "VitalReadingList": [],
            //},
            {
                "Id": 6,
                "VitalName": "O2 Saturation",
                "VitalReadingList": [],
            },
            {
                "Id": 7,
                "VitalName": "EKG Lead 2",
                "VitalReadingList": [],
            },
            {
                "Id": 8,
                "VitalName": "ETCO2",
                "VitalReadingList": [],
            }

        ];
    };

    $scope.PreOpSummaryParentObj = {
        "IsAscUnsigned": false,
        "IsShow": false,
        "IsEdit": false,
        "IsShowPreOpSummaryViewInd": false,
        "PatientASCPreOPId": 0,
        "Vitals": [],
        "SystemicHistory": [],
        "SurgicalHistory": [],
        "AllergyItems": [],
        "CurrentSystemicMedicationsHistory": [],
        "CurrentEyeMedications": [],
        "InvestigationsList": [],
        "AlderetScoreDetails": [],
        "TotalAlderetScore": null,
        "HealthArray": [],
        "IsCardiacWNL": false,
        "IsPulmonaryWNL": false,
        "IsHepaticWNL": false,
        "IsEndocrineWNL": false,
        "IsNeurologicWNL": false,
        "IsHemeOncWNL": false,
        "IsNervousSystemWNL": false,
        "IsKidneyDiseaseWNL": false,
        "IsMusculoSkeletalSystemWNL": false,
        "IsAutoImmuneDisordersWNL": false,
        "IsPsychosisWNL": false,
        "IsOthersWNL": false,
        "IsHeentWNL": false,
        "IsLungsWNL": false,
        "SelectedCardiacIssues": "",
        "SelectedPulmonaryIssues": "",
        "SelectedHepaticIssues": "",
        "SelectedEndocrineIssues": "",
        "SelectedNeurologicIssues": "",
        "SelectedHemeOncIssues": "",
        "SelectedNervousSystemIssues": "",
        "SelectedKidneyDiseaseIssues": "",
        "SelectedMusculoSkeletalSystemIssues": "",
        "SelectedAutoImmuneDisordersIssues": "",
        "SelectedPsychosisIssues": "",
        "SelectedOthersIssues": "",
        "SelectedHeentIssues": "",
        "SelectedLungsIssues": "",
        "PreOpCallDetails": [],
        "IsPreOpCallSummaryShow": false,
        "PreOpMedications": [],
        "DilationMedications": [],
        "PreOpMedicationRemarks": "",
        "OrgASCChecklist": [],
        "IsAllNurseCheckListChecked": null,
        "IsAllGeneralCheckListChecked": null,
        "NurseChecklistRemarks": "",
        "NewNurseChecklistName": "",
        "GeneralChecklistRemarks": "",
        "NewGeneralChecklistName": "",
        "NewMedicineChecklistName": "",
        "MedicineChecklistRemarks": "",
        "IsAllMedicineCheckListChecked": null,
        "NurseChecklistTemplates": [],
        "NurseChecklistValueType": "1",
        "GeneralChecklistValueType": "1",
        "MedicineChecklistValueType": "1",
        "IsAddNewNurseCheckList": false,
        "IsAddNewGeneralCheckList": false,
        "IsAddNewMedicineCheckList": false,
        "IsAllHealthWNL": false,
        "ReviewedBy": null,
        "ReviewedByName": null,
        "ActionReviewedBy": null,
        "ActionReviewedByName": null,
        "PreOpNotes": "",
        "PreOpChartStatus": "",
        "StatusFlag": "",
        "PreOpNurseNotes": "",
        "OthersNotes": "",
        "HeentNotes": "",
        "LungsNotes": "",
        "PsychosisNotes": "",
        "AutoImmuneDisordersNotes": "",
        "KidneyDiseaseNotes": "",
        "CardiacNotes": "",
        "PulmonaryNotes": "",
        "HepaticNotes": "",
        "EndocrineNotes": "",
        "NeurologicNotes": "",
        "HemeOncNotes": "",
        "NervousSystemNotes": "",
        "MusculoSkeletalSystemNotes": "",
        "ROSOverAllRemarks": "",
        "Ascpatientpopupsavearray": [],
        "IsVeinOpened": null,
        "IsDiabetes": null,
        "DiabetesResult": '',
        "DiabetesTime": '',
        "IsPreOpMedicationInd": false,
        "MedicationReviewId": null,
        "DilationReviewId": null,
        "DilationMedicationsNotes": "",
        "MedicationReviewName": "",
        "DilationReviewName": "",
        "ODPupilSize": "",
        "OSPupilSize": "",
    };

    $scope.IntraOpSummaryParentObj = {
        "IsShow": false,
        "IsEdit": false,
        "ShowGraph": false,
        "Vitals": [],
        "AllergyItems": [],
        "SystemicHistory": [],
        "SurgicalHistory": [],
        "CurrentEyeMedications": [],
        "CurrentSystemicMedicationsHistory": [],
        "InvestigationsList": [],
        "PatientASCIntraOPId": null,
        "SurgeonOperativeNotes": "",
        "Findings": "",
        "Complications": "",
        "OrdersReviewedBy": 0,
        "NurseActionobj": {
            "NurseChecklistValueType": "1",
            "NewNurseChecklistName": "",
            "OrgASCChecklist": [],
            "Cauteraisation": [],
            "NurseReviewedById": null,
            "NurseActionOrganId": null,
            "NurseActionArea": "",
            "Type": "Medications",
            "Levelofconsciousness": "",
            "LevelofconsciousnessNotes": "",
            "ChecklistRemarks": "",
            "PatientPosition": "",
            "PatientPositionNotes": "",
            "SafetyDevicePosition": {
                "ArmsToTheBody": "",
                "Strap": "",
                "AnotherRailing": "",
                "Others": ""
            },
            "SafetyDevicePositionNotes": "",
            "SkinPreparation": "",
            "SkinPreparationNotes": "",
            "Sterilewater": "",
            "Alcohol":"",
            "AreaNotes": "",
            "EspecimenLab": "",
            "EspecimenLabNotes": "",
            "CropHour": "",
            "SurgeonId": null,
            "CoSurgeonId": null,
            "TechnicianId": null,
            "NurseId": null,
            "AnesthesistId": null,
            "ReliefId": null,
            "SupportingStaffId": null,
            "SurgeryRoomNo": "",
            "HallEntranceStartTime": "",
            "HallEntranceEndTime": "",
            "SurgeryStartTime": "",
            "SurgeryEndTime": "",
            "AnesthesiaStartTime": "",
            "AnesthesiaEndTime": "",
            "SurgicalFirstNeedles": "",
            "SurgicalFirstBlades": "",
            "SurgicalFirstOthers": "",
            "SurgicalFirstVerifiedBy": "",
            "SurgicalFirstVerifiedByName": "",
            "SurgicalFirstTime": "",
            "SurgicalSecondNeedles": "",
            "SurgicalSecondBlades": "",
            "SurgicalSecondOthers": "",
            "SurgicalSecondVerifiedBy": "",
            "SurgicalSecondVerifiedByName": "",
            "SurgicalSecondTime": "",
            "SurgicalFinalNeedles": "",
            "SurgicalFinalBlades": "",
            "SurgicalFinalOthers": "",
            "CauteraisationOthers": "",
            "SurgicalFinalVerifiedBy": "",
            "SurgicalFinalVerifiedByName": "",
            "SurgicalFinalTime": "",
            "HydrationIV": false,
            "DrainageOthers": "",
            "Cleansed": false,
            "Contaminated": false,
            "Dirty": false,
            "Disposition": false,
            "Recoveryroom": false,
            "CarePostoperative": false,
            "OthersIntraData": false,
            "PatientTolerated": false
        },
        "Anesthetistobj": {
            "AnesthetistChecklistValueType": "1",
            "NewAnesthetistChecklistName": "",
            "OrgASCChecklist": [],
            "IntraOPAnesthesiaActionId": 0,
            "Type": "Medications",
            "MedicineObject": "",
            "InvestigationObj": "",
            "S3URL": "",
            "BaseURL": "",
            //"PatientAscInvestigations": [],
            //"PatientAscEyeDrops": [],
            //"PatientAscInjections": [],
            //"PatientAscMedications": [],
        },
        "Ordersobj": {
            "IntraOPOrdersActionId": 0,
            "Type": "Medications",
            "MedicineObject": "",
            "InvestigationObj": "",
            "EyeDropsObj": "",
            "Injectionsobj": "",
            "PatientAscInvestigations": [],
            "PatientAscEyeDrops": [],
            "PatientAscInjections": [],
            "PatientAscMedications": [],
            "TemplateName": ""
        },
        "IsAllNurseCheckListChecked": null,
        "IsAllActionCheckListChecked": null,
        "IsPreAnesthesiaListChecked": null,
        "IntraOpChartStatus": "D",
        "StatusFlag": "D",
        "IsPreAnesthesiaCheckListChecked": null,
        "graphImg": "",
        "NurseActionNotes": "",
        "DiagnosisObject": "",
        "PostOpDiagnosis": [],
        "Diagnosis": [],
        "ROSOverAllRemarks": "",
        "AnesthesiaTypelist": [{
            "AnesthesiaTypeId": 1,
            "AnesthesiaType": "TopicalAnesthesia",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0,

        },
        {
            "AnesthesiaTypeId": 2,
            "AnesthesiaType": "LocalAnesthesia",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 3,
            "AnesthesiaType": "GeneralAnesthesia",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 4,
            "AnesthesiaType": "PeribulbarAnesthesia",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 5,
            "AnesthesiaType": "Sub-TenonAnesthesia",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 6,
            "AnesthesiaType": "RegionalAnesthesia",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        }],
        "PrescriptionDetails": [],
        "ReviewDoctorId": null,
        "ReviewNurseId": null,
        "ReviewAnesthetistId": null,
        "ReviewTechnicianId": null,
        "ImplantsDetailsArray": [],
        "MedicineOrdersInstructions": "",
        "CheckinCheckReviewedBy": null,
        "AnesthesiaReviewedBy": null,
        "OxygenType": "",
        "OxygenQuantity": "",        
        "OxygenStatus": false,
        "EndotrachealTubeNotes": "",
        "LMANotes": "",
        "AnesthesiaMedications": [],
        "IntraOpMedications": [],
        "AnesthesiaMedicationsReviewId": null,
        "MedicationsReviewId": null,
        "AnesthesiaMedicationsNotes": "",
        "MedicationsNotes": "",
        "AnesthesiaMedicationsReviewName": "",
        "MedicationsReviewName": "",
    };

    $scope.PostOpSummaryParentObj = {
        "IsShow": false,
        "IsEdit": false,
        "IsShowPostOpSummaryViewInd": false,
        "ShowGraph": false,
        "PatientASCPostOPId": 0,
        "Vitals": [],
        "AllergyItems": [],
        "SystemicHistory": [],
        "SurgicalHistory": [],
        "OrgASCChecklist": [],
        "Diagnosis": [],
        "SelectedMedicineTemplateList": [],
        "NurseChart": {
            "Checklists": {
                "PostOPNurseCheckListId": 0,
                "PatientReceived": "",
                "AccompaniedBy": "",
                "PainLevel": "",
                "NourishmentProvider": "",
                "BloodSugar": "",
                "PostOpInstruction": "",
                "ReceivedRoom": "",
                "Patientallowed": "",
                "Personalbelonging": "",
                "Patientadvised": "",
                "PatientClinic": "",
                "Physicianexamine": "",
                "Removedintact": "",
                "Orientedtimes": "",
                "OtherMental": "",
                "Notes": "",
                "DeleteInd": "N"
            },
            "Actions": {
                "PostOPNurseActionId": 0,
                "Speech": "",
                "Vision": "",
                "Pain": "",
                "ConsciousLevel": "",
                "Fur": "",
                "IncisionlaDrainage": "",
                "Nausea": "",
                "IngestedFood": "",
                "Referred": "",
                "Relationship": "",
                "Exit": "",
                "Instruction": "",
                "Prescription": "",
                "LensCard": "",
                "Surveillance": "",
                "Bandage": "",
                "Advancediet": "",
                "Discharge": "",
                "Administer": "",
                "Tylenol": "",
                "Review": "",
                "Notes": "",
                "DeleteInd": "N",
                "SignoffBy": null
            },
            "ReviewedBy": null
        },
        "ContactStartTime": "",
        "PostOpInstruction": "",
        "PostOpInstructionTemplateId": 0,
        "SurgeonObj": {
            "DoctorNotes": "",
            "IsDoctorNotes": false,
            "PostOpInstruction": "",
            "MedicationsList": [],
            "InvestigationsList": [],
            "ReviewedBy": null
        },
        "DischargeObj": {
            "OperativeNotes": "",
            "SurgeonOperativeNotes": "",
            "ComplicationsNotes": "",
            "DischargeCriteriaList": [],
            "DischargeCriteriaNotes": "",
            "TransferList": [],
            "Time": "",
            "Meridian": "AM",
            "TransferReason": "",
            "FollowUpDate1": {
                "Date": "",
                "Time": "",
                "Meridian": "AM"
            },
            "FollowUpDate2": {
                "Date": "",
                "Time": "",
                "Meridian": "AM"
            },
            "FollowUpDate3": {
                "Date": "",
                "Time": "",
                "Meridian": "AM"
            },
            "Others": "",
            "ReviewedBy": null
        },
        "PostOpChartStatus": "D",
        "IsAllNurseCheckListChecked": null,
        "IsAllActionCheckListChecked": null,
        "StatusFlag": "D",
        "graphImg": "",
        "S3URL": "",
        "TotalAlderetScore": 0,
        "AlderetScoreDetails": [],
        "DischargeMedicationInstructionTemplates": [],
        "DischargeSummaryDetails": "",
        "DiagnosisObject": "",
        "PostOpDiagnosis": [],
        "ROSOverAllRemarks": "",
        "AnesthesiaTypelist": [{
            "AnesthesiaTypeId": 1,
            "AnesthesiaType": "TopicalAnesthesia",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0,

        },
        {
            "AnesthesiaTypeId": 2,
            "AnesthesiaType": "LocalAnesthesia",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 3,
            "AnesthesiaType": "GeneralAnesthesia",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 4,
            "AnesthesiaType": "PeribulbarAnesthesia",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 5,
            "AnesthesiaType": "Sub-TenonAnesthesia",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 6,
            "AnesthesiaType": "RegionalAnesthesia",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 7,
            "AnesthesiaType": "IVSedation",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        }],
        "Intake": "",
        "Output": "",
        "EBL": "",
        "InTime": "",
        "OutTime": "",
        "PrescriptionDetails": [],
        "ReviewDoctorId": null,
        "ReviewNurseId": null,
        "ReviewAnesthetistId": null,
        "CurrentEyeMedications": [],
        "CurrentSystemicMedicationsHistory": [],
        "MedicineOrdersInstructions": ""
    }

    $scope.Ascpatientpopupsavearray = [];

    $scope.GetPreOpCallObj = function () {
        return {
            "UserId": $scope.UserId,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId,
            "PatientId": $scope.cacheStorageItem.PatientID,
            "HospitalId": $scope.HospitalId,
            "PatientAscPreOpCallDetailId": 0,
            "ContactType": "",
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
            "DeleteInd": "N"
        }
    };

    $scope.PreOpCallObj = angular.copy($scope.GetPreOpCallObj());

    function GetCheckinObj() {
        return {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "AppointmentId": $scope.cacheStorageItem.AppointmentId,
            "PatientId": $scope.cacheStorageItem.PatientID,
            "HospitalId": $scope.HospitalId,
            "AdmissionId": 0,
            "PatientAscCheckInId": 0,
            "AdmissionDate": $filter("date")(new Date(), "MM-dd-yyyy") || "",
            "CheckInTime": $filter("date")(new Date(), "h:mm a") || "",
            "CheckInBy": eHnoteMasterDataService.getLoginId(),
            "RecievedForSurgery": "",
            "RecievedForSurgeryNotes": "",
            "AccompainedBy": "",
            "AccompainedByNotes": "",
            "PhoneNumber": "",
            "PhoneNumberCountryCode": "",
            "AlternatePhoneNumber": "",
            "AlternatePhoneNumberCountryCode": "",
            "DisplayNumber": "",
            "DisplayOfficeNumber": "",
            "PatientTransfferedIn": "",
            "PatientTransfferedNotes": "",
            "PatientDestination": "",
            "PatientDestinationNotes": "",
            "PTERefers": "",
            "PTEReferNotes": "",
            "PreOperativeOrientationOffered": "",
            "PreOperativeOrientationOfferedNotes": "",
            "ObservedBehavior": "",
            "ObservedBehaviorNotes": "",
            "LevelOfConsciousness": "",
            "LevelOfConsciousnessNotes": "",
        }

    };
    $scope.PreopCheckinObj = GetCheckinObj();

    $scope.AscSummaryParentObj = {
        "SystemicHistory": [],
        "SurgicalHistory": [],
        "AllergyItems": [],
        "CurrentSystemicMedicationsHistory": [],
        "CurrentEyeMedications": [],
    }

    $scope.GetAnesthetistVitals = function () {
        return [
            {
                "PatientAnesthesiaVitalId": 0,
                "PatientAnesthesiaPostOpDetailId": null,
                "VitalId": 1,
                "VitalName": "Systolic Pressure",
                "VitalValues": [],
                "DeleteInd": "N"
            },
            {
                "PatientAnesthesiaVitalId": 0,
                "PatientAnesthesiaPostOpDetailId": null,
                "VitalId": 2,
                "VitalName": "Diastolic Pressure",
                "VitalValues": [],
                "DeleteInd": "N"
            },
            {
                "PatientAnesthesiaVitalId": 0,
                "PatientAnesthesiaPostOpDetailId": null,
                "VitalId": 3,
                "VitalName": "Pulse",
                "VitalValues": [],
                "DeleteInd": "N"
            },
            {
                "PatientAnesthesiaVitalId": 0,
                "PatientAnesthesiaPostOpDetailId": null,
                "VitalId": 4,
                "VitalName": "Resp.Rate",
                "VitalValues": [],
                "DeleteInd": "N"
            },
            //{
            //    "PatientAnesthesiaVitalId": 0,
            //    "PatientAnesthesiaPostOpDetailId": null,
            //    "VitalId": 5,
            //    "VitalName": "Spo2",
            //    "VitalValues": [],
            //    "DeleteInd": "N"
            //},
            {
                "PatientAnesthesiaVitalId": 0,
                "PatientAnesthesiaPostOpDetailId": null,
                "VitalId": 6,
                "VitalName": "O2 Saturation",
                "VitalValues": [],
                "DeleteInd": "N"
            },
            //{
            //    "PatientAnesthesiaVitalId": 0,
            //    "PatientAnesthesiaPostOpDetailId": null,
            //    "VitalId": 7,
            //    "VitalName": "EKG Lead 2",
            //    "VitalValues": [],
            //    "DeleteInd": "N"
            //},
            //{
            //    "PatientAnesthesiaVitalId": 0,
            //    "PatientAnesthesiaPostOpDetailId": null,
            //    "VitalId": 8,
            //    "VitalName": "ETCO2",
            //    "VitalValues": [],
            //    "DeleteInd": "N"
            //}

        ];
    };
    $scope.AnesthetistVitals = angular.copy($scope.GetAnesthetistVitals());

    $scope.GetAldreteDetails = function () {
        return [
            {
                "PostOPAldreteDetailId": 0,
                "AldreteVitalId": 1,
                "AldreteVitalName": "Physical Activity",
                "TotalValue": "",
                "DeleteInd": "N",
                "AldreteValues": []
            },
            {
                "PostOPAldreteDetailId": 0,
                "AldreteVitalId": 2,
                "AldreteVitalName": "Respiration",
                "TotalValue": "",
                "DeleteInd": "N",
                "AldreteValues": []
            },
            {
                "PostOPAldreteDetailId": 0,
                "AldreteVitalId": 3,
                "AldreteVitalName": "Circulations",
                "TotalValue": "",
                "DeleteInd": "N",
                "AldreteValues": []
            },
            {
                "PostOPAldreteDetailId": 0,
                "AldreteVitalId": 4,
                "AldreteVitalName": "Consciousness",
                "TotalValue": "",
                "DeleteInd": "N",
                "AldreteValues": []
            },
            {
                "PostOPAldreteDetailId": 0,
                "AldreteVitalId": 5,
                "AldreteVitalName": "Spo2",
                "TotalValue": "",
                "DeleteInd": "N",
                "AldreteValues": []
            },
            {
                "PostOPAldreteDetailId": 0,
                "AldreteVitalId": 6,
                "AldreteVitalName": "Color",
                "TotalValue": "",
                "DeleteInd": "N",
                "AldreteValues": []
            }
        ];
    };

    $scope.AldreteDetails = angular.copy($scope.GetAldreteDetails());

    $scope.GetDischargeParentSummaryObj = function () {
        return {
            "PatientId": $scope.cacheStorageItem.PatientID,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId,
            "PatientName": "",
            "PatientASCPostOPId": null,
            "DiagnosisName": "",
            "ProcedureName": "",
            "Surgeon": "",
            "PatientDisplayId": null,
            "Organ": "",
            "Medications": [],
            "Prescriptions": [],
            "Diagnosis": [],
            "AllergyItems": [],
            "SurgicalHistory": [],
            "SystemicHistory": [],
            "CurrentEyeMedicationList": [],
            "CurrentSystemicMedicationList": [],
            "MedicationInstructions": "",
            "PostOpInstruction": "",
            "DischargeInstruction": "",
            "AscPostOpInstructionTemplateList": [],
            "PostOpConditionTemplatesList": [],
            "PostOpProceduralTemplatesList": [],
            "DischargeMedicationInstructionTemplates": [],
            "SelectedMedInstructionTemplate": "",
            "DischargeMedicationInstructions": "",
            "MedictionTemplateName": "",
            "FollowUpInstructions": "",
            "CoManagementInstruction": "",
            "PatientConditionInstruction": "",
            "ProceduralInstruction": "",
            "PostOpInstrufction": "",
            "ExaminationNotes": "",
            "FollowUpDate1": "",
            "FollowUpDate2": "",
            "FollowUpDate3": "",
            "FollowUpTime1": "",
            "FollowUpTime2": "",
            "FollowUpTime3": "",
            "DischargeMedicationTemplateName": "",
            "SelectedDischargeMedicationTemplate": "",
            "DischargePostOpInstructionTemplateName": "",
            "PostOpInstructionTemplateId": null,
            "DischargeReviewedBy": null,
            "DischargeReviewedByName": '',
            "DischargeSummaryTemplateName": "",
            "CoManagementTemplateName": "",
            "ConditionOnDischargeTemplateName": "",
            "ProceduralNameTemplateName": "",
            "FollowUpDate2Ind": false,
            "FollowUpDate3Ind": false,
            "DischargeMedicationInstructionTemplateId": null,
            "DischargeProcedureNameInstructionTemplateId": null,
            "PatientDischargeConditionInstructionTemplateId": null,
            "DischargeCoManagementInstructionTemplateId": null,
            "Findings": "",
            "MedicineOrdersInstructions": "",
            "Complications":"",
            "ProcedureDetails":"",
        }
    };

    $scope.DischargeParentSummaryObj = angular.copy($scope.GetDischargeParentSummaryObj());

    $scope.AdmissionSummaryObj = {
        "CurrentEyeMedications": [],
        "CurrentSystemicMedicationsHistory": [],
        "InvestigationsList": [],
        "Prescriptions": [],
        "SystemicHistory": [],
        "SurgicalHistory": [],
        "AllergyItems": [],
        "OrgASCChecklist": [],
        "IsAllNurseCheckListChecked": null,
        "IsAllMedicineCheckListChecked": null,
        "NurseChecklistTemplates": [],
        "MedicineChecklistTemplates": [],
        "SelectedNurseChecklistTemplate": "",
        "SelectedMedicineChecklistTemplate": "",
        "AdmissionRemarks": "",
        "SaveTempImagesArray": [],
        "ReviewedName": ""
    };

    $scope.OperativeParentSummaryObj = {
        "Complications": "",
        "ProcedureDetails": "",
        "Findings": "",
        "SurgeonOperativeNotes": "",
    }

    $scope.GetpatientAscSummaryDetails = function () {

        let req = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
            "PatientId": $scope.cacheStorageItem.PatientID || null
        };

        let Obj = {
            "PatientId": $scope.cacheStorageItem.PatientID,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId,
        }

        $q.all([
            eHnoteSurgeryService.GetMasterAldreteScoreDetails(),
            eHnoteSurgeryService.GetpatientAscSummary(req),
            eHnotePatientDataService.GetPatientPreOpCallDetailsList(Obj),

        ]).then(function (resp) {
            if (resp[0].data.status === "Success") {
                angular.forEach(resp[0].data.rows, function (item) {
                    item.Value = null;
                    item.IsChecked = false;
                    angular.forEach(item.AldreteScoreDetailTypes, function (kitem) {
                        kitem.IsChecked = false;
                    });
                });
                $scope.PreOpSummaryParentObj.AlderetScoreDetails = angular.copy(resp[0].data.rows);
            }

            if (resp[1].data.Status === "Success") {
                $scope.AscSummaryParentObj.AllergyItems = resp[1].data.AllergyItems || [];
                $scope.AscSummaryParentObj.SurgicalHistory = resp[1].data.SurgicalHistory || [];
                $scope.AscSummaryParentObj.SystemicHistory = resp[1].data.SystemicHistory || [];
                $scope.PreOpSummaryParentObj.SurgeryList = resp[1].data.SurgeryList || [];

                $scope.AscSummaryParentObj.CurrentEyeMedications = angular.copy(resp[1].data.CurrentEyeMedicationList);
                $scope.AscSummaryParentObj.CurrentSystemicMedicationsHistory = angular.copy(resp[1].data.CurrentSystemicMedicationList);


                $scope.AscSummaryParentObj.Complications = resp[1].data.Complications ||"";
                $scope.AscSummaryParentObj.Findings = resp[1].data.Findings || "";
                $scope.AscSummaryParentObj.SurgeonOperativeNotes = resp[1].data.SurgeonOperativeNotes || "";

                $scope.AscSummaryParentObj.Complications = $scope.AscSummaryParentObj.Complications.replace(/\n/g, '<br>');
                $scope.AscSummaryParentObj.Findings = $scope.AscSummaryParentObj.Findings.replace(/\n/g, '<br>');
                $scope.AscSummaryParentObj.SurgeonOperativeNotes = $scope.AscSummaryParentObj.SurgeonOperativeNotes.replace(/\n/g, '<br>');

                resp[1].data.Diagnosis = resp[1].data.Diagnosis || [];
                if (resp[1].data.Diagnosis.length > 0) {
                    $scope.IntraOpSummaryParentObj.Diagnosis = angular.copy(resp[1].data.Diagnosis);
                    $scope.IntraOpSummaryParentObj.IsIntraOpDiagnosisInd = true;
                } else {
                    $scope.IntraOpSummaryParentObj.Diagnosis = [];
                    $scope.IntraOpSummaryParentObj.IsIntraOpDiagnosisInd = false;
                }

                resp[1].data.Diagnosis = resp[1].data.Diagnosis || [];
                if (resp[1].data.Diagnosis.length > 0) {
                    $scope.PostOpSummaryParentObj.Diagnosis = angular.copy(resp[1].data.Diagnosis) || [];
                    $scope.PostOpSummaryParentObj.IsPostOpDiagnosisInd = true;
                } else {
                    $scope.PostOpSummaryParentObj.IsPostOpDiagnosisInd = false;
                }

                $scope.DischargeParentSummaryObj.Diagnosis = angular.copy(resp[1].data.Diagnosis);


                  

                $scope.OperativeParentSummaryObj.ProcedureDetails = resp[1].data.OperativeNotes[0].ProcedureDetails || "";
                //if (resp[1].data.OperativeNotes[0].Complications == '' || resp[1].data.OperativeNotes[0].Complications == null) {
                //    $scope.OperativeParentSummaryObj.Complications = resp[1].data.ComplicationsNotes || "";
                //} else {
                //    $scope.OperativeParentSummaryObj.Complications = resp[1].data.OperativeNotes[0].Complications || "";
                //}
                $scope.OperativeParentSummaryObj.Complications = resp[1].data.OperativeNotes[0].Complications || "";
                $scope.OperativeParentSummaryObj.Findings = resp[1].data.OperativeNotes[0].Findings || "";
                $scope.OperativeParentSummaryObj.SurgeonOperativeNotes = resp[1].data.OperativeNotes[0].SurgeonOperativeNotes || "";
                $scope.OperativeParentSummaryObj.OperativeChartStatus = resp[1].data.OperativeNotes[0].OperativeChartStatus || "";
                $scope.OperativeParentSummaryObj.Complications = $scope.OperativeParentSummaryObj.Complications.replace(/\n/g, '<br>');
                $scope.OperativeParentSummaryObj.ProcedureDetails = $scope.OperativeParentSummaryObj.ProcedureDetails.replace(/\n/g, '<br>');
                $scope.OperativeParentSummaryObj.Findings = $scope.OperativeParentSummaryObj.Findings.replace(/\n/g, '<br>');
                $scope.OperativeParentSummaryObj.SurgeonOperativeNotes = $scope.OperativeParentSummaryObj.SurgeonOperativeNotes.replace(/\n/g, '<br>');

                if (resp[1].data.PreOP.length > 0) {
                    let data = resp[1].data.PreOP[0];

                    $scope.PreOpSummaryParentObj.PatientASCPreOPId = data.PatientASCPreOPId || null;
                    $scope.PreOpSummaryParentObj.PreOpChartStatus = data.PreOpChartStatus || "";
                    $scope.PreOpSummaryParentObj.StatusFlag = data.StatusFlag || "";

                    if (data.VitalsArray.length > 0) {
                        angular.forEach(data.VitalsArray, function (item) {
                            var vitalslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.DoctorId });
                            if (vitalslist.length > 0) {
                                item.UserName = angular.copy(vitalslist[0].FullName);
                            }
                            //let ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                            //let edate = ndate + " " + item.VitalAddTime;
                            //item.VitalAddTime = $filter('date')(new Date(edate), "hh:mm a");
                            let currentDate = moment().format("YYYY-MM-DD");
                            let combinedDateTime = currentDate + " " + item.VitalAddTime;
                            let parsedDateTime = moment(combinedDateTime, "YYYY-MM-DD hh:mm a");
                            item.VitalAddTime = parsedDateTime.format("hh:mm a");
                        });
                        $scope.PreOpSummaryParentObj.IsShowPreOpVitalsInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOpVitalsInd = false;
                    }

                    $scope.PreOpSummaryParentObj.Vitals = data.VitalsArray || [];
                    $scope.PreOpSummaryParentObj.MedicationsList = data.MedicationsList || [];
                    $scope.PreOpSummaryParentObj.InvestigationsList = data.InvestigationsList || [];
                    $scope.PreOpSummaryParentObj.CurrentMedicationList = data.CurrentMedicationList || [];
                    $scope.PreOpSummaryParentObj.TotalAlderetScore = data.TotalAlderetScore;

                    if ($scope.PreOpSummaryParentObj.CurrentMedicationList.length > 0) {
                        $scope.IsContinuationMedication = false;
                        $scope.IsStopMedication = false;
                        angular.forEach($scope.PreOpSummaryParentObj.CurrentMedicationList, function (item) {
                            if (item.DeleteInd == "N") {
                                if (item.MedicationType == 'Continuation') {
                                    $scope.IsContinuationMedication = true;
                                }
                                if (item.MedicationType == 'Stop') {
                                    $scope.IsStopMedication = true;
                                }
                            }
                        });
                    }
                    // files
                    $scope.PreOpSummaryParentObj.DocumentDetails = angular.copy(data.DocumentDetails);
                    $scope.FilesObj.TempImagesArray = [];

                    // notes
                    $scope.PreOpSummaryParentObj.MedicineChecklistRemarks = data.MedicineChecklistRemarks;
                    $scope.PreOpSummaryParentObj.NurseChecklistRemarks = data.NurseChecklistRemarks;
                    $scope.PreOpSummaryParentObj.GeneralChecklistRemarks = data.GeneralChecklistRemarks;
                    $scope.PreOpSummaryParentObj.PreOpMedicationRemarks = data.PreOpMedicationRemarks;
                    $scope.PreOpSummaryParentObj.MedicationRemarks = data.MedicationRemarks;

                    // alderet score details
                    if (data.AlderetScoreDetails.length > 0) {
                        angular.forEach(data.AlderetScoreDetails, function (item) {
                            angular.forEach($scope.PreOpSummaryParentObj.AlderetScoreDetails, function (hitem) {
                                angular.forEach(hitem.AldreteScoreDetailTypes, function (kitem) {
                                    if (kitem.AldreteScoreDetailTypeId === item.AldreteScoreDetailTypeId) {
                                        if (item.DeleteInd == "N") {
                                            kitem.IsChecked = true;
                                            hitem.IsChecked = true;
                                            hitem.Value = kitem.AldreteScore;
                                            hitem.AldreteScoreDetailTypeName = kitem.AldreteScoreDetailTypeName;
                                            hitem.PreOpAlderetScoreDetailId = item.PreOpAlderetScoreDetailId || 0;
                                        }
                                    }
                                });
                            });
                        });
                    }

                    // checklists
                    if (data.OrgASCChecklist.length > 0) {
                        $scope.PreOpSummaryParentObj.OrgASCChecklist = angular.copy(data.OrgASCChecklist);
                    } else {
                        $scope.PreOpSummaryParentObj.OrgASCChecklist = angular.copy(resp[1].data.AdmitDetails[0].CheckLists);
                    }

                    // health array
                    if ($scope.PreOpSummaryParentObj.HealthArray.length === 0) {
                        $scope.PreOpSummaryParentObj.HealthArray = angular.copy($scope.MainObj.HealthArray);
                    }

                    //angular.forEach(data.HealthArray, function (item) {
                    //    angular.forEach($scope.PreOpSummaryParentObj.HealthArray, function (hitem) {
                    //        if (hitem.Id === item.Id) {
                    //            hitem.IsChecked = true;
                    //        }
                    //    });
                    //});

                    angular.forEach($scope.PreOpSummaryParentObj.HealthArray, function (item) {
                        let temparray = $filter('filter')(data.HealthArray, { "Id": item.Id }, true);
                        temparray = temparray || [];
                        if (temparray.length > 0) {
                            item.IsChecked = temparray[0].IsChecked;
                        } else {
                            item.IsChecked = null;
                        }
                        if (temparray.length > 0) {
                            if (item.CategoryId === 15) {
                                item.StatusId = temparray[0].StatusId || 0;
                                item.StatusName = temparray[0].StatusName || "";
                                item.QuantityId = temparray[0].QuantityId || 0;
                                item.QuantityName = temparray[0].QuantityName || "";
                                item.Date = temparray[0].Date || null;
                            }
                        }
                    });
                    $scope.PreOpSummaryParentObj.IsCardiacWNL = data.IsCardiacWNL;
                    $scope.PreOpSummaryParentObj.IsPulmonaryWNL = data.IsPulmonaryWNL;
                    $scope.PreOpSummaryParentObj.IsHepaticWNL = data.IsHepaticWNL;
                    $scope.PreOpSummaryParentObj.IsEndocrineWNL = data.IsEndocrineWNL;
                    $scope.PreOpSummaryParentObj.IsNeurologicWNL = data.IsNeurologicWNL;
                    $scope.PreOpSummaryParentObj.IsHemeOncWNL = data.IsHemeOncWNL;
                    $scope.PreOpSummaryParentObj.IsNervousSystemWNL = data.IsNervousSystemWNL;
                    $scope.PreOpSummaryParentObj.IsKidneyDiseaseWNL = data.IsKidneyDiseaseWNL;
                    $scope.PreOpSummaryParentObj.IsMusculoSkeletalSystemWNL = data.IsMusculoSkeletalSystemWNL;
                    $scope.PreOpSummaryParentObj.IsAutoImmuneDisordersWNL = data.IsAutoImmuneDisordersWNL;
                    $scope.PreOpSummaryParentObj.IsPsychosisWNL = data.IsPsychosisWNL;
                    $scope.PreOpSummaryParentObj.IsOthersWNL = data.IsOthersWNL;
                    $scope.PreOpSummaryParentObj.IsHeentWNL = data.IsHeentWNL;
                    $scope.PreOpSummaryParentObj.IsLungsWNL = data.IsLungsWNL;
                    $scope.PreOpSummaryParentObj.IsAllHealthWNL = data.IsAllHealthWNL;
                    $scope.PreOpSummaryParentObj.PreOpNotes = data.PreOpNotes || "";
                    $scope.PreOpSummaryParentObj.ReviewedBy = data.ReviewedBy || null;
                    $scope.PreOpSummaryParentObj.DilationReviewId = data.DilationReviewId || null;
                    $scope.PreOpSummaryParentObj.ActionReviewedBy = data.ActionReviewedBy || null;
                    $scope.PreOpSummaryParentObj.ReviewedDate = data.ReviewedDate || '';
                    $scope.PreOpSummaryParentObj.ReviewedTime = data.ReviewedTime || '';
                    $scope.PreOpSummaryParentObj.DilationMedicationsNotes = data.DilationMedicationsNotes || '';
                    $scope.PreOpSummaryParentObj.MedicationReviewId = data.MedicationReviewId || '';

                    if ($scope.PreOpSummaryParentObj.ReviewedBy != null) {
                        var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.PreOpSummaryParentObj.ReviewedBy });
                        if (ReviewedByArraylist.length > 0) {
                            $scope.PreOpSummaryParentObj.ReviewedByName = angular.copy(ReviewedByArraylist[0].FullName);
                        }
                        $scope.PreOpSummaryParentObj.IsShowPreOpCheckListReviewedByInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOpCheckListReviewedByInd = false;
                    }

                    if ($scope.PreOpSummaryParentObj.DilationReviewId != null) {
                        var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.PreOpSummaryParentObj.DilationReviewId });
                        if (ReviewedByArraylist.length > 0) {
                            $scope.PreOpSummaryParentObj.DilationReviewName = angular.copy(ReviewedByArraylist[0].FullName);
                        }
                    }

                    if ($scope.PreOpSummaryParentObj.MedicationReviewId != null) {
                        var MedicationArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.PreOpSummaryParentObj.MedicationReviewId });
                        MedicationArraylist = MedicationArraylist || [];
                        if (MedicationArraylist.length > 0) {
                            $scope.PreOpSummaryParentObj.MedicationReviewName = angular.copy(MedicationArraylist[0].FullName);
                        }
                    }

                    if ($scope.PreOpSummaryParentObj.ActionReviewedBy != null) {
                        var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.PreOpSummaryParentObj.ActionReviewedBy });
                        if (ReviewedByArraylist.length > 0) {
                            $scope.PreOpSummaryParentObj.ActionReviewedByName = angular.copy(ReviewedByArraylist[0].FullName);
                        }
                        $scope.PreOpSummaryParentObj.IsShowPreOPActionReviewedByInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOPActionReviewedByInd = false;
                    }

                    let tempHealthArray = angular.copy(data.HealthArray);
                    let tempCardiacArray = [];
                    let tempPulmonaryArray = [];
                    let tempHepaticArray = [];
                    let tempEndocrineArray = [];
                    let tempNeurologicArray = [];
                    let tempHemeOneArray = [];
                    let tempNervousSystemArray = [];
                    let tempKidneyDiseaseArray = [];
                    let tempMusculoSkeletalArray = [];
                    let tempAutoImmuneArray = [];
                    let tempPsychosisArray = [];
                    let tempOthersArray = [];
                    let tempHeentArray = [];
                    let tempLungsArray = [];
                    angular.forEach(tempHealthArray, function (item) {
                        if (item.CategoryId === 1) {
                            tempCardiacArray.push(item.Description);
                        }
                        if (item.CategoryId === 2) {
                            tempPulmonaryArray.push(item.Description);
                        }
                        if (item.CategoryId === 3) {
                            tempHepaticArray.push(item.Description);
                        }
                        if (item.CategoryId === 4) {
                            tempEndocrineArray.push(item.Description);
                        }
                        if (item.CategoryId === 5) {
                            tempNeurologicArray.push(item.Description);
                        }
                        if (item.CategoryId === 6) {
                            tempHemeOneArray.push(item.Description);
                        }
                        if (item.CategoryId === 7) {
                            tempNervousSystemArray.push(item.Description);
                        }
                        if (item.CategoryId === 8) {
                            tempKidneyDiseaseArray.push(item.Description);
                        }
                        if (item.CategoryId === 9) {
                            tempMusculoSkeletalArray.push(item.Description);
                        }
                        if (item.CategoryId === 10) {
                            tempAutoImmuneArray.push(item.Description);
                        }
                        if (item.CategoryId === 11) {
                            tempPsychosisArray.push(item.Description);
                        }
                        if (item.CategoryId === 12) {
                            tempOthersArray.push(item.Description);
                        }
                        if (item.CategoryId === 16) {
                            tempHeentArray.push(item.Description);
                        }
                        if (item.CategoryId === 17) {
                            tempLungsArray.push(item.Description);
                        }

                    });

                    if (tempCardiacArray.length > 0) {
                        $scope.PreOpSummaryParentObj.SelectedCardiacIssues = tempCardiacArray.join(", ");
                    } else {
                        $scope.PreOpSummaryParentObj.SelectedCardiacIssues = "";
                    }
                    if (tempPulmonaryArray.length > 0) {
                        $scope.PreOpSummaryParentObj.SelectedPulmonaryIssues = tempPulmonaryArray.join(", ");
                    } else {
                        $scope.PreOpSummaryParentObj.SelectedPulmonaryIssues = "";
                    }
                    if (tempHepaticArray.length > 0) {
                        $scope.PreOpSummaryParentObj.SelectedHepaticIssues = tempHepaticArray.join(", ");
                    } else {
                        $scope.PreOpSummaryParentObj.SelectedHepaticIssues = "";
                    }
                    if (tempEndocrineArray.length > 0) {
                        $scope.PreOpSummaryParentObj.SelectedEndocrineIssues = tempEndocrineArray.join(", ");
                    } else {
                        $scope.PreOpSummaryParentObj.SelectedEndocrineIssues = "";
                    }
                    if (tempNeurologicArray.length > 0) {
                        $scope.PreOpSummaryParentObj.SelectedNeurologicIssues = tempNeurologicArray.join(", ");
                    } else {
                        $scope.PreOpSummaryParentObj.SelectedNeurologicIssues = "";
                    }
                    if (tempHemeOneArray.length > 0) {
                        $scope.PreOpSummaryParentObj.SelectedHemeOncIssues = tempHemeOneArray.join(", ");
                    } else {
                        $scope.PreOpSummaryParentObj.SelectedHemeOncIssues = "";
                    }
                    if (tempNervousSystemArray.length > 0) {
                        $scope.PreOpSummaryParentObj.SelectedNervousSystemIssues = tempNervousSystemArray.join(", ");
                    } else {
                        $scope.PreOpSummaryParentObj.SelectedNervousSystemIssues = "";
                    }
                    if (tempKidneyDiseaseArray.length > 0) {
                        $scope.PreOpSummaryParentObj.SelectedKidneyDiseaseIssues = tempKidneyDiseaseArray.join(", ");
                    } else {
                        $scope.PreOpSummaryParentObj.SelectedKidneyDiseaseIssues = "";
                    }
                    if (tempMusculoSkeletalArray.length > 0) {
                        $scope.PreOpSummaryParentObj.SelectedMusculoSkeletalSystemIssues = tempMusculoSkeletalArray.join(", ");
                    } else {
                        $scope.PreOpSummaryParentObj.SelectedMusculoSkeletalSystemIssues = "";
                    }
                    if (tempAutoImmuneArray.length > 0) {
                        $scope.PreOpSummaryParentObj.SelectedAutoImmuneDisordersIssues = tempAutoImmuneArray.join(", ");
                    } else {
                        $scope.PreOpSummaryParentObj.SelectedAutoImmuneDisordersIssues = "";
                    }
                    if (tempPsychosisArray.length > 0) {
                        $scope.PreOpSummaryParentObj.SelectedPsychosisIssues = tempPsychosisArray.join(", ");
                    } else {
                        $scope.PreOpSummaryParentObj.SelectedPsychosisIssues = "";
                    }
                    if (tempOthersArray.length > 0) {
                        $scope.PreOpSummaryParentObj.SelectedOthersIssues = tempOthersArray.join(", ");
                    } else {
                        $scope.PreOpSummaryParentObj.SelectedOthersIssues = "";
                    }
                    if (tempHeentArray.length > 0) {
                        $scope.PreOpSummaryParentObj.SelectedHeentIssues = tempHeentArray.join(", ");
                    } else {
                        $scope.PreOpSummaryParentObj.SelectedHeentIssues = "";
                    }
                    if (tempLungsArray.length > 0) {
                        $scope.PreOpSummaryParentObj.SelectedLungsIssues = tempLungsArray.join(", ");
                    } else {
                        $scope.PreOpSummaryParentObj.SelectedLungsIssues = "";
                    }
                    // health array end

                    // pre-op medication

                    if (data.PreOpMedications.length > 0) {
                        var preopmedications = $filter('filter')(data.PreOpMedications, { 'IsPreOPMed': true }, true);
                        $scope.PreOpSummaryParentObj.PreOpMedications = angular.copy(preopmedications);
                        if ($scope.PreOpSummaryParentObj.PreOpMedications.length > 0) {
                            angular.forEach($scope.PreOpSummaryParentObj.PreOpMedications, function (item) {
                                if (item.DropTimings.length > 0) {
                                    angular.forEach(item.DropTimings, function (Dropitem) {
                                        Dropitem.MedicationTime = Dropitem.MedicationTime || '';
                                        
                                        if (Dropitem.MedicationTime != '') {
                                            //let Ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                                            //let Newdate = Ndate + " " + Dropitem.MedicationTime;
                                            //Dropitem.MedicationTime = $filter('date')(new Date(Newdate), "hh:mm a");
                                            let currentDate = moment().format("YYYY-MM-DD");
                                            let combinedDateTime = currentDate + " " + Dropitem.MedicationTime;
                                            let parsedDateTime = moment(combinedDateTime, "YYYY-MM-DD HH:mm");
                                            Dropitem.MedicationTime = parsedDateTime.format("hh:mm a");
                                        }
                                    });
                                }
                            });
                        }
                    }

                    if (data.DilationMedications.length > 0) {
                        var dilationmedications = $filter('filter')(data.DilationMedications, { 'IsDilationMed': true }, true);
                        $scope.PreOpSummaryParentObj.DilationMedications = angular.copy(dilationmedications);
                    }

                    $scope.cacheStorageItem.PatientCheckIn.RecievedForSurgery = data.RecievedForSurgery;
                    $scope.cacheStorageItem.PatientCheckIn.RecievedForSurgeryNotes = data.RecievedForSurgeryNotes;
                    $scope.cacheStorageItem.PatientCheckIn.AccompainedBy = data.AccompainedBy;
                    $scope.cacheStorageItem.PatientCheckIn.AccompainedByNotes = data.AccompainedByNotes;
                    $scope.cacheStorageItem.PatientCheckIn.PatientTransfferedIn = data.PatientTransfferedIn;
                    $scope.cacheStorageItem.PatientCheckIn.PatientTransfferedNotes = data.PatientTransfferedNotes;
                    $scope.cacheStorageItem.PatientCheckIn.PatientDestination = data.PatientDestination;
                    $scope.cacheStorageItem.PatientCheckIn.PatientDestinationNotes = data.PatientDestinationNotes;
                    $scope.cacheStorageItem.PatientCheckIn.PTERefers = data.PTERefers;
                    $scope.cacheStorageItem.PatientCheckIn.PTEReferNotes = data.PTEReferNotes;
                    $scope.cacheStorageItem.PatientCheckIn.PreOperativeOrientationOffered = data.PreOperativeOrientationOffered || '';
                    $scope.cacheStorageItem.PatientCheckIn.PreOperativeOrientationOfferedNotes = data.PreOperativeOrientationOfferedNotes || '';
                    $scope.cacheStorageItem.PatientCheckIn.ObservedBehavior = data.ObservedBehavior || '';
                    $scope.cacheStorageItem.PatientCheckIn.ObservedBehaviorNotes = data.ObservedBehaviorNotes || '';
                    $scope.cacheStorageItem.PatientCheckIn.LevelOfConsciousness = data.LevelOfConsciousness || '';
                    $scope.cacheStorageItem.PatientCheckIn.LevelOfConsciousnessNotes = data.LevelOfConsciousnessNotes || '';

                    $scope.PreopCheckinObj.RecievedForSurgery = data.PatientCheckIn.RecievedForSurgery;
                    $scope.PreopCheckinObj.RecievedForSurgeryNotes = data.PatientCheckIn.RecievedForSurgeryNotes;
                    $scope.PreopCheckinObj.AccompainedBy = data.PatientCheckIn.AccompainedBy;
                    $scope.PreopCheckinObj.AccompainedByNotes = data.PatientCheckIn.AccompainedByNotes;
                    $scope.PreopCheckinObj.PatientTransfferedIn = data.PatientCheckIn.PatientTransfferedIn;
                    $scope.PreopCheckinObj.PatientTransfferedNotes = data.PatientCheckIn.PatientTransfferedNotes;
                    $scope.PreopCheckinObj.PatientDestination = data.PatientCheckIn.PatientDestination;
                    $scope.PreopCheckinObj.PatientDestinationNotes = data.PatientCheckIn.PatientDestinationNotes;
                    $scope.PreopCheckinObj.PTERefers = data.PatientCheckIn.PTERefers;
                    $scope.PreopCheckinObj.PTEReferNotes = data.PatientCheckIn.PTEReferNotes;

                    $scope.PreopCheckinObj.PreOperativeOrientationOffered = data.PatientCheckIn.PreOperativeOrientationOffered || '';
                    $scope.PreopCheckinObj.PreOperativeOrientationOfferedNotes = data.PatientCheckIn.PreOperativeOrientationOfferedNotes || '';
                    $scope.PreopCheckinObj.ObservedBehavior = data.PatientCheckIn.ObservedBehavior || '';
                    $scope.PreopCheckinObj.ObservedBehaviorNotes = data.PatientCheckIn.ObservedBehaviorNotes || '';
                    $scope.PreopCheckinObj.LevelOfConsciousness = data.PatientCheckIn.LevelOfConsciousness || '';
                    $scope.PreopCheckinObj.LevelOfConsciousnessNotes = data.PatientCheckIn.LevelOfConsciousnessNotes || '';
                    $scope.PreopCheckinObj.PreOpOverallNotes = data.PatientCheckIn.PreOpOverallNotes || '';

                    if ($scope.PreopCheckinObj.PTERefers != '' || $scope.PreopCheckinObj.PatientDestination != '' || $scope.PreopCheckinObj.PatientTransfferedIn != '' || $scope.PreopCheckinObj.LevelOfConsciousness != '' || $scope.PreopCheckinObj.ObservedBehavior != '' || $scope.PreopCheckinObj.PreOperativeOrientationOffered != '' || $scope.PreopCheckinObj.AccompainedBy != '') {

                        if ($scope.Ascpatientpopupsavearray.length != 0) {
                            $scope.Ascpatientpopupsavearray[0] = angular.copy($scope.PreopCheckinObj) || [];
                        } else {
                            $scope.Ascpatientpopupsavearray.push($scope.PreopCheckinObj);
                        }

                    }

                    $scope.PreOpSummaryParentObj.CardiacNotes = data.CardiacNotes || '';
                    $scope.PreOpSummaryParentObj.PulmonaryNotes = data.PulmonaryNotes || '';
                    $scope.PreOpSummaryParentObj.HepaticNotes = data.HepaticNotes || '';
                    $scope.PreOpSummaryParentObj.EndocrineNotes = data.EndocrineNotes || '';
                    $scope.PreOpSummaryParentObj.NeurologicNotes = data.NeurologicNotes || '';
                    $scope.PreOpSummaryParentObj.HemeOncNotes = data.HemeOncNotes || '';
                    $scope.PreOpSummaryParentObj.NervousSystemNotes = data.NervousSystemNotes || '';
                    $scope.PreOpSummaryParentObj.KidneyDiseaseNotes = data.KidneyDiseaseNotes || '';
                    $scope.PreOpSummaryParentObj.MusculoSkeletalSystemNotes = data.MusculoSkeletalSystemNotes || '';
                    $scope.PreOpSummaryParentObj.AutoImmuneDisordersNotes = data.AutoImmuneDisordersNotes || '';
                    $scope.PreOpSummaryParentObj.PsychosisNotes = data.PsychosisNotes || '';
                    $scope.PreOpSummaryParentObj.OthersNotes = data.OthersNotes || '';
                    $scope.PreOpSummaryParentObj.HeentNotes = data.HeentNotes || '';
                    $scope.PreOpSummaryParentObj.LungsNotes = data.LungsNotes || '';
                    $scope.PreOpSummaryParentObj.IsVeinOpened = data.IsVeinOpened;
                    $scope.PreOpSummaryParentObj.IsDiabetes = data.IsDiabetes;
                    $scope.PreOpSummaryParentObj.DiabetesResult = data.DiabetesResult || '';
                    $scope.PreOpSummaryParentObj.DiabetesTime = data.DiabetesTime || '';

                    if ($scope.PreOpSummaryParentObj.IsVeinOpened == null && $scope.PreOpSummaryParentObj.IsDiabetes == null && $scope.PreOpSummaryParentObj.DiabetesResult == '' && $scope.PreOpSummaryParentObj.DiabetesTime == '') {
                        $scope.PreOpSummaryParentObj.IsPreOpMedicationInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsPreOpMedicationInd = false;
                    }

                    $scope.OrgASCChecklist = $scope.OrgASCChecklist || [];
                    if (data.OrgASCChecklist.length > 0) {
                        $scope.OrgASCChecklist = data.OrgASCChecklist || [];
                    } else {
                        $scope.OrgASCChecklist = [];
                    }

                    let nurselist = $filter("filter")($scope.OrgASCChecklist, { "CheckListCategoryId": 1 }, true);
                    if (nurselist.length > 0 || $scope.PreOpSummaryParentObj.NurseChecklistRemarks != '') {
                        $scope.PreOpSummaryParentObj.IsShowPreOpCheckListNurseInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOpCheckListNurseInd = false;
                    }

                    let generallist = $filter("filter")($scope.OrgASCChecklist, { "CheckListCategoryId": 6 }, true);
                    if (generallist.length > 0 || $scope.PreOpSummaryParentObj.GeneralChecklistRemarks != '') {
                        $scope.PreOpSummaryParentObj.IsShowPreOpCheckListGeneralInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOpCheckListGeneralInd = false;
                    }

                    let medicationlist = $filter("filter")($scope.OrgASCChecklist, { "CheckListCategoryId": 5 }, true);
                    if (medicationlist.length > 0 || $scope.PreOpSummaryParentObj.MedicineChecklistRemarks != '') {
                        $scope.PreOpSummaryParentObj.IsShowPreOpCheckListMedicationInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOpCheckListMedicationInd = false;
                    }

                    if ($scope.PreOpSummaryParentObj.IsShowPreOpCheckListNurseInd || $scope.PreOpSummaryParentObj.IsShowPreOpCheckListGeneralInd || $scope.PreOpSummaryParentObj.IsShowPreOpCheckListMedicationInd) {
                        $scope.PreOpSummaryParentObj.IsShowPreOpCheckListMainInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOpCheckListMainInd = false;
                    }

                    if ($scope.PreOpSummaryParentObj.MedicationsList.length > 0) {
                        $scope.PreOpSummaryParentObj.IsShowPreOpPreAdmissionPreSurgiesMedicationInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOpPreAdmissionPreSurgiesMedicationInd = false;
                    }
                    if ($scope.PreOpSummaryParentObj.CurrentMedicationList.length > 0) {
                        $scope.PreOpSummaryParentObj.IsShowPreOpPreAdmissionOrdersCurrentMedicationInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOpPreAdmissionOrdersCurrentMedicationInd = false;
                    }
                    if ($scope.PreOpSummaryParentObj.InvestigationsList.length > 0) {
                        $scope.PreOpSummaryParentObj.IsShowPreOpPreAdmissionOrdersLabInvestigationInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOpPreAdmissionOrdersLabInvestigationInd = false;
                    }
                    if ($scope.PreOpSummaryParentObj.IsShowPreOpPreAdmissionPreSurgiesMedicationInd || $scope.PreOpSummaryParentObj.IsShowPreOpPreAdmissionOrdersCurrentMedicationInd || $scope.PreOpSummaryParentObj.IsShowPreOpPreAdmissionOrdersLabInvestigationInd) {
                        $scope.PreOpSummaryParentObj.IsShowPreOpPreAdmissionOrdersInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOpPreAdmissionOrdersInd = false;
                    }

                    if (data.HealthArray.length > 0) {
                        $scope.PreOpSummaryParentObj.IsShowPreOpCheckListHealthPhysicalInd = true;
                    }
                    else if (!$scope.PreOpSummaryParentObj.IsCardiacWNL && !$scope.PreOpSummaryParentObj.IsPulmonaryWNL && !$scope.PreOpSummaryParentObj.IsHepaticWNL && !$scope.PreOpSummaryParentObj.IsAutoImmuneDisordersWNL && !$scope.PreOpSummaryParentObj.IsEndocrineWNL && !$scope.PreOpSummaryParentObj.IsHemeOncWNL &&
                        !$scope.PreOpSummaryParentObj.IsKidneyDiseaseWNL && !$scope.PreOpSummaryParentObj.IsMusculoSkeletalSystemWNL && !$scope.PreOpSummaryParentObj.IsNervousSystemWNL && !$scope.PreOpSummaryParentObj.IsNeurologicWNL && !$scope.PreOpSummaryParentObj.IsOthersWNL && !$scope.PreOpSummaryParentObj.IsPsychosisWNL) {

                        $scope.PreOpSummaryParentObj.IsShowPreOpCheckListHealthPhysicalInd = false;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOpCheckListHealthPhysicalInd = true;
                    }

                    if (data.AlderetScoreDetails.length > 0) {
                        $scope.PreOpSummaryParentObj.IsShowPreOpCheckListAldarateScoreInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOpCheckListAldarateScoreInd = false;
                    }

                    if ($scope.PreOpSummaryParentObj.IsShowPreOpCheckListHealthPhysicalInd || $scope.PreOpSummaryParentObj.IsShowPreOpCheckListAldarateScoreInd || $scope.PreOpSummaryParentObj.IsShowPreOpCheckListNurseInd || $scope.PreOpSummaryParentObj.IsShowPreOpCheckListMedicationInd) {
                        $scope.PreOpSummaryParentObj.IsShowPreOpCheckListInd = true
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOpCheckListInd = false;
                    }

                    if (data.PreOpCallDetails.length > 0) {
                        $scope.PreOpSummaryParentObj.IsShowPreOPActionPreOpcallInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOPActionPreOpcallInd = false;
                    }
                    if (data.PreOpMedications.length > 0) {
                        $scope.PreOpSummaryParentObj.IsShowPreOPActionPreOpMediactionInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOPActionPreOpMediactionInd = false;
                    }
                    if (data.PreOpMedications.length > 0) {
                        $scope.PreOpSummaryParentObj.IsShowPreOPActionPreOpMediactionInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOPActionPreOpMediactionInd = false;
                    }
                    if ($scope.PreopCheckinObj.RecievedForSurgery != "" || $scope.PreopCheckinObj.AccompainedBy != "" || $scope.PreopCheckinObj.PatientTransfferedIn != "" && $scope.PreopCheckinObj.PatientDestination != "" && $scope.PreopCheckinObj.PTERefers != "") {
                        $scope.PreOpSummaryParentObj.IsShowPreOPActionPreOpPatientInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOPActionPreOpPatientInd = false;
                    }

                    if ($scope.PreOpSummaryParentObj.IsShowPreOPActionPreOpMediactionInd || $scope.PreOpSummaryParentObj.IsShowPreOPActionPreOpPatientInd || $scope.PreOpSummaryParentObj.IsShowPreOPActionPreOpcallInd || $scope.PreOpSummaryParentObj.IsShowPreOpCheckListGeneralInd) {
                        $scope.PreOpSummaryParentObj.IsShowPreOpActionInd = true;
                    } else {
                        $scope.PreOpSummaryParentObj.IsShowPreOpActionInd = false;
                    }

                    if ($scope.PreOpSummaryParentObj.SelectedCardiacIssues == "" && $scope.PreOpSummaryParentObj.SelectedPulmonaryIssues == "" &&
                        $scope.PreOpSummaryParentObj.SelectedHepaticIssues == "" && $scope.PreOpSummaryParentObj.SelectedEndocrineIssues == "" &&
                        $scope.PreOpSummaryParentObj.SelectedNeurologicIssues == "" && $scope.PreOpSummaryParentObj.SelectedHemeOncIssues == "" &&
                        $scope.PreOpSummaryParentObj.SelectedNervousSystemIssues == "" && $scope.PreOpSummaryParentObj.SelectedMusculoSkeletalSystemIssues == "" &&
                        $scope.PreOpSummaryParentObj.SelectedKidneyDiseaseIssues == "" && $scope.PreOpSummaryParentObj.SelectedAutoImmuneDisordersIssues == "" &&
                        $scope.PreOpSummaryParentObj.SelectedPsychosisIssues == "" && $scope.PreOpSummaryParentObj.SelectedOthersIssues == "" && $scope.PreOpSummaryParentObj.SelectedHeentIssues == "" && $scope.PreOpSummaryParentObj.SelectedLungsIssues == "" &&
                        !$scope.PreOpSummaryParentObj.IsCardiacWNL && !$scope.PreOpSummaryParentObj.IsPulmonaryWNL &&
                        !$scope.PreOpSummaryParentObj.IsHepaticWNL && !$scope.PreOpSummaryParentObj.IsEndocrineWNL &&
                        !$scope.PreOpSummaryParentObj.IsNeurologicWNL && !$scope.PreOpSummaryParentObj.IsHemeOncWNL &&
                        !$scope.PreOpSummaryParentObj.IsNervousSystemWNL && !$scope.PreOpSummaryParentObj.IsKidneyDiseaseWNL &&
                        !$scope.PreOpSummaryParentObj.IsMusculoSkeletalSystemWNL && !$scope.PreOpSummaryParentObj.IsAutoImmuneDisordersWNL && !$scope.PreOpSummaryParentObj.IsHeentWNL && !$scope.PreOpSummaryParentObj.IsLungsWNL &&
                        !$scope.PreOpSummaryParentObj.IsPsychosisWNL && !$scope.PreOpSummaryParentObj.IsOthersWNL && $scope.PreOpSummaryParentObj.CardiacNotes == '' && $scope.PreOpSummaryParentObj.PulmonaryNotes == '' && $scope.PreOpSummaryParentObj.HepaticNotes == '' && $scope.PreOpSummaryParentObj.EndocrineNotes == '' && $scope.PreOpSummaryParentObj.NeurologicNotes == ''
                        && $scope.PreOpSummaryParentObj.HemeOncNotes == '' && $scope.PreOpSummaryParentObj.NervousSystemNotes == '' && $scope.PreOpSummaryParentObj.MusculoSkeletalSystemNotes == '' && $scope.PreOpSummaryParentObj.KidneyDiseaseNotes == '' && $scope.PreOpSummaryParentObj.AutoImmuneDisordersNotes == '' && $scope.PreOpSummaryParentObj.PsychosisNotes == '' && $scope.PreOpSummaryParentObj.OthersNotes == '' && $scope.PreOpSummaryParentObj.HeentNotes == '' && $scope.PreOpSummaryParentObj.LungsNotes == ''
                    ) {
                        $scope.ShowHealthAndPhysical = false;
                    } else {
                        $scope.ShowHealthAndPhysical = true;
                    }

                    $scope.PreOpSummaryParentObj.ODPupilSize = data.ODPupilSize || "";
                    $scope.PreOpSummaryParentObj.OSPupilSize = data.OSPupilSize || "";

                } else {
                    $scope.PreOpSummaryParentObj.PatientASCPreOPId = 0;
                    $scope.PreOpSummaryParentObj.Vitals = [];
                    $scope.PreOpSummaryParentObj.MedicationsList = [];
                    $scope.PreOpSummaryParentObj.InvestigationsList = [];
                    $scope.PreOpSummaryParentObj.CurrentMedicationList = [];
                    $scope.PreOpSummaryParentObj.TotalAlderetScore = null;

                    // files
                    $scope.PreOpSummaryParentObj.DocumentDetails = [];
                    $scope.FilesObj.TempImagesArray = [];

                    // notes
                    $scope.PreOpSummaryParentObj.MedicineChecklistRemarks = "";
                    $scope.PreOpSummaryParentObj.NurseChecklistRemarks = "";
                    $scope.PreOpSummaryParentObj.GeneralChecklistRemarks = "";
                    $scope.PreOpSummaryParentObj.PreOpMedicationRemarks = "";
                    $scope.PreOpSummaryParentObj.MedicationRemarks = "";

                    // health and physical
                    $scope.PreOpSummaryParentObj.HealthArray = [];
                    $scope.PreOpSummaryParentObj.SelectedCardiacIssues = "";
                    $scope.PreOpSummaryParentObj.SelectedPulmonaryIssues = "";
                    $scope.PreOpSummaryParentObj.SelectedHepaticIssues = "";
                    $scope.PreOpSummaryParentObj.SelectedEndocrineIssues = "";
                    $scope.PreOpSummaryParentObj.SelectedNeurologicIssues = "";
                    $scope.PreOpSummaryParentObj.SelectedHemeOncIssues = "";
                    $scope.PreOpSummaryParentObj.SelectedNervousSystemIssues = "";
                    $scope.PreOpSummaryParentObj.SelectedKidneyDiseaseIssues = "";
                    $scope.PreOpSummaryParentObj.SelectedMusculoSkeletalSystemIssues = "";
                    $scope.PreOpSummaryParentObj.SelectedAutoImmuneDisordersIssues = "";
                    $scope.PreOpSummaryParentObj.SelectedPsychosisIssues = "";
                    $scope.PreOpSummaryParentObj.SelectedOthersIssues = "";

                    $scope.PreOpSummaryParentObj.IsCardiacWNL = false;
                    $scope.PreOpSummaryParentObj.IsPulmonaryWNL = false;
                    $scope.PreOpSummaryParentObj.IsHepaticWNL = false;
                    $scope.PreOpSummaryParentObj.IsEndocrineWNL = false;
                    $scope.PreOpSummaryParentObj.IsNeurologicWNL = false;
                    $scope.PreOpSummaryParentObj.IsHemeOncWNL = false;
                    $scope.PreOpSummaryParentObj.IsNervousSystemWNL = false;
                    $scope.PreOpSummaryParentObj.IsKidneyDiseaseWNL = false;
                    $scope.PreOpSummaryParentObj.IsMusculoSkeletalSystemWNL = false;
                    $scope.PreOpSummaryParentObj.IsAutoImmuneDisordersWNL = false;
                    $scope.PreOpSummaryParentObj.IsPsychosisWNL = false;
                    $scope.PreOpSummaryParentObj.IsOthersWNL = false;
                    $scope.PreOpSummaryParentObj.IsHeentWNL = false;
                    $scope.PreOpSummaryParentObj.IsLungsWNL = false;
                    $scope.PreOpSummaryParentObj.IsAllHealthWNL = false;

                    $scope.PreOpSummaryParentObj.IsShowPreOpROSAllergiesInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOpVitalsInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOpROSInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOpROSSystemicHistoryInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOpROSSurgicalHistoryInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOpPreAdmissionOrdersInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOpPreAdmissionPreSurgiesMedicationInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOpPreAdmissionOrdersCurrentMedicationInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOpPreAdmissionOrdersLabInvestigationInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOpCheckListInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOpCheckListHealthPhysicalInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOpCheckListAldarateScoreInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOpCheckListMainInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOpCheckListNurseInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOpCheckListGeneralInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOpCheckListMedicationInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOpCheckListReviewedByInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOpActionInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOPActionPreOpcallInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOPActionPreOpMediactionInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOPActionPreOpPatientInd = false;
                    $scope.PreOpSummaryParentObj.IsShowPreOPActionReviewedByInd = false;
                }

                if (resp[1].data.IntraOP.length > 0) {

                    $scope.IntraOpSummaryParentObj.PatientASCIntraOPId = resp[1].data.IntraOP[0].PatientASCIntraOPId;
                    $scope.IntraOpSummaryParentObj.IntraOpChartStatus = resp[1].data.IntraOP[0].IntraOpChartStatus;
                    $scope.IntraOpSummaryParentObj.StatusFlag = resp[1].data.IntraOP[0].StatusFlag;

                    $scope.IntraOpSummaryParentObj.Ordersobj.PatientAscInjections = angular.copy(resp[1].data.IntraOP[0].PatientAscInjections) || [];
                    $scope.IntraOpSummaryParentObj.Ordersobj.PatientAscEyeDrops = angular.copy(resp[1].data.IntraOP[0].PatientAscEyeDrops) || [];
                    $scope.ImplantsDetailsArray = angular.copy(resp[1].data.IntraOP[0].ImplantsDetailsArray) || [];

                    if (resp[1].data.IntraOP[0].VitalsArray.length > 0) {


                        angular.forEach(resp[1].data.IntraOP[0].VitalsArray, function (item) {
                            var vitalslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.DoctorId });
                            if (vitalslist.length > 0) {
                                item.UserName = angular.copy(vitalslist[0].FullName);
                            }
                            //let ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                            //let edate = ndate + " " + item.VitalAddTime;
                            //item.VitalAddTime = $filter('date')(new Date(edate), "hh:mm a");
                            let currentDate = moment().format("YYYY-MM-DD");
                            let combinedDateTime = currentDate + " " + item.VitalAddTime;
                            let parsedDateTime = moment(combinedDateTime, "YYYY-MM-DD HH:mm");
                            item.VitalAddTime = parsedDateTime.format("hh:mm a");
                        });
                        $scope.IntraOpSummaryParentObj.Vitals = angular.copy(resp[1].data.IntraOP[0].VitalsArray);
                    }

                    // nurse checklist

                    if (resp[1].data.IntraOP[0].PatientAscChecklist.length > 0) {
                        angular.forEach(resp[1].data.IntraOP[0].PatientAscChecklist, function (hitem) {
                            angular.forEach($scope.AscCheckList, function (kitem) {
                                if (hitem.CheckListCategoryId === kitem.CheckListCategoryId && hitem.CheckListSubTypeId === kitem.CheckListSubTypeId) {
                                    angular.forEach(kitem.CheckList, function (jitem) {
                                        angular.forEach(jitem.OrganizationCheckListDetails, function (uitem) {
                                            if (hitem.CheckListId === jitem.CheckListId && uitem.Value === hitem.Value) {
                                                uitem.IsChecked = true;
                                                jitem.PatientAscCheckListDetailId = hitem.PatientAscCheckListDetailId || null;
                                            }
                                        });
                                    });
                                }
                            });
                        });
                    }

                    // anesthesia checklist
                    if (resp[1].data.IntraOP[0].PatientAscChecklist.length > 0) {
                        angular.forEach(resp[1].data.IntraOP[0].PatientAscChecklist, function (hitem) {
                            angular.forEach($scope.AscAnesthesistCheckList, function (kitem) {
                                if (hitem.CheckListCategoryId === kitem.CheckListCategoryId && hitem.CheckListSubTypeId === kitem.CheckListSubTypeId) {
                                    angular.forEach(kitem.CheckList, function (jitem) {
                                        angular.forEach(jitem.OrganizationCheckListDetails, function (uitem) {
                                            if (hitem.CheckListId === jitem.CheckListId && uitem.Value === hitem.Value) {
                                                uitem.IsChecked = true;
                                                jitem.PatientAscCheckListDetailId = hitem.PatientAscCheckListDetailId || null;
                                            }
                                        });
                                    });
                                }
                            });
                        });
                    }

                    $scope.IntraOpSummaryParentObj.PatientAscChecklist = resp[1].data.IntraOP[0].PatientAscChecklist;

                    $scope.IntraOpSummaryParentObj.NurseActionobj.CarePostoperative = resp[1].data.IntraOP[0].NurseActions.CarePostoperative;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.Recoveryroom = resp[1].data.IntraOP[0].NurseActions.Recoveryroom;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.Disposition = resp[1].data.IntraOP[0].NurseActions.Disposition;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.PatientTolerated = resp[1].data.IntraOP[0].NurseActions.PatientTolerated ;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.OthersIntraData = resp[1].data.IntraOP[0].NurseActions.OthersIntraData || "";
                   
                    $scope.IntraOpSummaryParentObj.NurseActionobj.EspecimenLabNotes = resp[1].data.IntraOP[0].NurseActions.EspecimenLabNotes || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.AreaNotes = resp[1].data.IntraOP[0].NurseActions.AreaNotes || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.SkinPreparationNotes = resp[1].data.IntraOP[0].NurseActions.SkinPreparationNotes || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.SafetyDevicePositionNotes = resp[1].data.IntraOP[0].NurseActions.SafetyDevicePositionNotes || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.PatientPositionNotes = resp[1].data.IntraOP[0].NurseActions.PatientPositionNotes || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.LevelofconsciousnessNotes = resp[1].data.IntraOP[0].NurseActions.LevelofconsciousnessNotes || "";



                    $scope.IntraOpSummaryParentObj.NurseActionobj.Sterilewater = resp[1].data.IntraOP[0].NurseActions.Sterilewater || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.Alcohol = resp[1].data.IntraOP[0].NurseActions.Alcohol || "";

                    $scope.IntraOpSummaryParentObj.NurseActionobj.ChecklistRemarks = resp[1].data.IntraOP[0].NurseActions.ChecklistRemarks || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.Levelofconsciousness = resp[1].data.IntraOP[0].NurseActions.Levelofconsciousness || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.PatientPosition = resp[1].data.IntraOP[0].NurseActions.PatientPosition || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.SkinPreparation = resp[1].data.IntraOP[0].NurseActions.SkinPreparation || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.EspecimenLab = resp[1].data.IntraOP[0].NurseActions.EspecimenLab || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.NurseActionOrganId = resp[1].data.IntraOP[0].NurseActions.NurseActionOrganId || null;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.NurseActionArea = resp[1].data.IntraOP[0].NurseActions.NurseActionArea || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeonId = resp[1].data.IntraOP[0].NurseActions.SurgeonId || null;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.CoSurgeonId = resp[1].data.IntraOP[0].NurseActions.CoSurgeonId || null;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.TechnicianId = resp[1].data.IntraOP[0].NurseActions.TechnicianId || null;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesistId = resp[1].data.IntraOP[0].NurseActions.AnesthesistId || null;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.ReliefId = resp[1].data.IntraOP[0].NurseActions.ReliefId || null;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.NurseId = resp[1].data.IntraOP[0].NurseActions.NurseId || null;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.SupportingStaffId = resp[1].data.IntraOP[0].NurseActions.SupportingStaffId || null;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.CropHour = resp[1].data.IntraOP[0].NurseActions.CropHour || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryRoomNo = resp[1].data.IntraOP[0].NurseActions.SurgeryRoomNo || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceStartTime = resp[1].data.IntraOP[0].NurseActions.HallEntranceStartTime || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceEndTime = resp[1].data.IntraOP[0].NurseActions.HallEntranceEndTime || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaStartTime = resp[1].data.IntraOP[0].NurseActions.AnesthesiaStartTime || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaEndTime = resp[1].data.IntraOP[0].NurseActions.AnesthesiaEndTime || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryStartTime = resp[1].data.IntraOP[0].NurseActions.SurgeryStartTime || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryEndTime = resp[1].data.IntraOP[0].NurseActions.SurgeryEndTime || "";

                    $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstNeedles = resp[1].data.IntraOP[0].NurseActions.SurgicalFirstNeedles || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstBlades = resp[1].data.IntraOP[0].NurseActions.SurgicalFirstBlades || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstOthers = resp[1].data.IntraOP[0].NurseActions.SurgicalFirstOthers || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstTime = resp[1].data.IntraOP[0].NurseActions.SurgicalFirstTime || "";

                    $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondNeedles = resp[1].data.IntraOP[0].NurseActions.SurgicalSecondNeedles || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondBlades = resp[1].data.IntraOP[0].NurseActions.SurgicalSecondBlades || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondOthers = resp[1].data.IntraOP[0].NurseActions.SurgicalSecondOthers || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondTime = resp[1].data.IntraOP[0].NurseActions.SurgicalSecondTime || "";

                    $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalNeedles = resp[1].data.IntraOP[0].NurseActions.SurgicalFinalNeedles || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalBlades = resp[1].data.IntraOP[0].NurseActions.SurgicalFinalBlades || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalOthers = resp[1].data.IntraOP[0].NurseActions.SurgicalFinalOthers || "";
                    $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalTime = resp[1].data.IntraOP[0].NurseActions.SurgicalFinalTime || "";

                    if (resp[1].data.IntraOP[0].NurseActions.SafetyDevicePosition != null) {
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SafetyDevicePosition.ArmsToTheBody = resp[1].data.IntraOP[0].NurseActions.SafetyDevicePosition.ArmsToTheBody || "";
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SafetyDevicePosition.Strap = resp[1].data.IntraOP[0].NurseActions.SafetyDevicePosition.Strap || "";
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SafetyDevicePosition.AnotherRailing = resp[1].data.IntraOP[0].NurseActions.SafetyDevicePosition.AnotherRailing || "";
                    }

                    $scope.IntraOpSummaryParentObj.NurseActionobj.HydrationIV = resp[1].data.IntraOP[0].NurseActions.HydrationIV || false;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.Cleansed = resp[1].data.IntraOP[0].NurseActions.Cleansed || false;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.Dirty = resp[1].data.IntraOP[0].NurseActions.Dirty || false;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.Contaminated = resp[1].data.IntraOP[0].NurseActions.Contaminated || false;

                    $scope.IntraOpSummaryParentObj.NurseActionobj.PatientTolerated = resp[1].data.IntraOP[0].NurseActions.PatientTolerated || false;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.Disposition = resp[1].data.IntraOP[0].NurseActions.Disposition || false;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.CarePostoperative = resp[1].data.IntraOP[0].NurseActions.CarePostoperative || false;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.Recoveryroom = resp[1].data.IntraOP[0].NurseActions.Recoveryroom || false;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.OthersIntraData = resp[1].data.IntraOP[0].NurseActions.OthersIntraData || false;

                    $scope.IntraOpSummaryParentObj.OxygenType = resp[1].data.IntraOP[0].OxygenType;
                    $scope.IntraOpSummaryParentObj.OxygenQuantity = resp[1].data.IntraOP[0].OxygenQuantity;

                    $scope.IntraOpSummaryParentObj.AnesthesiaTypelist = resp[1].data.IntraOP[0].AnesthesiaTypelist;
                    $scope.IntraOpSummaryParentObj.EndotrachealTubeNotes = resp[1].data.IntraOP[0].EndotrachealTubeNotes || "";
                    $scope.IntraOpSummaryParentObj.LMANotes = resp[1].data.IntraOP[0].LMANotes || "";

                    $scope.IntraOpSummaryParentObj.NurseActionobj.DrainageOthers = resp[1].data.IntraOP[0].NurseActions.DrainageOthers || "";


                    /* let ndate = $filter('date')(new Date(), "yyyy-MM-dd");*/
                    let currentDate = moment().format("YYYY-MM-DD");
                    
                    if ($scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceStartTime != '') {
                        let combinedDateTime = currentDate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceStartTime;
                        let parsedDateTime = moment(combinedDateTime, "YYYY-MM-DD HH:mm");
                        $scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceStartTime = parsedDateTime.format("hh:mm a");
                        //let edate = ndate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceStartTime;
                        //$scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceStartTime = $filter('date')(new Date(edate), "hh:mm a");
                    }

                    if ($scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceEndTime != '') {
                        let combinedDateTime = currentDate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceEndTime;
                        let parsedDateTime = moment(combinedDateTime, "YYYY-MM-DD HH:mm");
                        $scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceEndTime= parsedDateTime.format("hh:mm a");
                        //let edate = ndate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceEndTime;
                        //$scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceEndTime = $filter('date')(new Date(edate), "hh:mm a");
                    }
                    if ($scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaStartTime != '') {
                        let combinedDateTime = currentDate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaStartTime;
                        let parsedDateTime = moment(combinedDateTime, "YYYY-MM-DD HH:mm");
                        $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaStartTime = parsedDateTime.format("hh:mm a");
                        //let edate = ndate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaStartTime;
                        //$scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaStartTime = $filter('date')(new Date(edate), "hh:mm a");
                    }
                    if ($scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaEndTime != '') {
                        let combinedDateTime = currentDate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaEndTime;
                        let parsedDateTime = moment(combinedDateTime, "YYYY-MM-DD HH:mm");
                        $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaEndTime = parsedDateTime.format("hh:mm a");
                        //let edate = ndate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaEndTime;
                        //$scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaEndTime = $filter('date')(new Date(edate), "hh:mm a");
                    }
                    if ($scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryStartTime != '') {
                        let combinedDateTime = currentDate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryStartTime;
                        let parsedDateTime = moment(combinedDateTime, "YYYY-MM-DD HH:mm");
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryStartTime = parsedDateTime.format("hh:mm a");
                        //let edate = ndate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryStartTime;
                        //$scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryStartTime = $filter('date')(new Date(edate), "hh:mm a");
                    }
                    if ($scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryEndTime != '') {
                        let combinedDateTime = currentDate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryEndTime;
                        let parsedDateTime = moment(combinedDateTime, "YYYY-MM-DD HH:mm");
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryEndTime = parsedDateTime.format("hh:mm a");
                        //let edate = ndate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryEndTime;
                        //$scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryEndTime = $filter('date')(new Date(edate), "hh:mm a");
                    }



                    if ($scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstTime != '') {
                        let combinedDateTime = currentDate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstTime;
                        let parsedDateTime = moment(combinedDateTime, "YYYY-MM-DD HH:mm");
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstTime = parsedDateTime.format("hh:mm a");
                        //let edate = ndate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstTime;
                        //$scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstTime = $filter('date')(new Date(edate), "hh:mm a");
                    }
                    if ($scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondTime != '') {
                        let combinedDateTime = currentDate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondTime;
                        let parsedDateTime = moment(combinedDateTime, "YYYY-MM-DD HH:mm");
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondTime = parsedDateTime.format("hh:mm a");
                        //let edate = ndate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondTime;
                        //$scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondTime = $filter('date')(new Date(edate), "hh:mm a");
                    }
                    if ($scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalTime != '') {
                        let combinedDateTime = currentDate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalTime;
                        let parsedDateTime = moment(combinedDateTime, "YYYY-MM-DD HH:mm");
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalTime = parsedDateTime.format("hh:mm a");
                        //let edate = ndate + " " + $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalTime;
                        //$scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalTime = $filter('date')(new Date(edate), "hh:mm a");
                    }






                    if (resp[1].data.IntraOP[0].Cauteraisation.length > 0) {
                        //angular.forEach(resp[1].data.IntraOP[0].Cauteraisation, function (item) {
                        //    item.IsChecked = true;
                        //});
                        $scope.IntraOpSummaryParentObj.NurseActionobj.Cauteraisation = resp[1].data.IntraOP[0].Cauteraisation;
                        angular.forEach($scope.IntraOpSummaryParentObj.NurseActionobj.Cauteraisation, function (item) {
                            if (item.IsChecked == true) {
                                $scope.IntraOpSummaryParentObj.IsIntraCauteraisationInd = true;
                            }
                        });                  
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraCauteraisationInd = false;
                    }

                    // Anesthetist Actions Graph

                    if (resp[1].data.IntraOP[0].AnesthetistActions.AnesthesiaVitalsArray.length > 0) {
                        $scope.IntraAnesthetistVitals = angular.copy($scope.GetIntraopAnesthetistVitals());
                        angular.forEach(resp[1].data.IntraOP[0].AnesthetistActions.AnesthesiaVitalsArray, function (item) {
                            angular.forEach($scope.IntraAnesthetistVitals, function (kitem) {
                                if (kitem.Id === 1 && kitem.Id === item.VitalId) {
                                    let obj = {
                                        "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                        "VitalName": "Systolic Pressure",
                                        "MainId": 1,
                                        "Value": item.Value,
                                        "VitalSlotTime": item.VitalSlotTime,
                                    };
                                    kitem.VitalReadingList.push(obj);
                                }

                                if (kitem.Id === 2 && kitem.Id === item.VitalId) {
                                    let obj = {
                                        "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                        "VitalName": "Diastolic Pressure",
                                        "MainId": 2,
                                        "Value": item.Value,
                                        "VitalSlotTime": item.VitalSlotTime,
                                    };
                                    kitem.VitalReadingList.push(obj);
                                }

                                if (kitem.Id === 3 && kitem.Id === item.VitalId) {
                                    let obj = {
                                        "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                        "VitalName": "Pulse",
                                        "MainId": 3,
                                        "Value": item.Value,
                                        "VitalSlotTime": item.VitalSlotTime,
                                    };
                                    kitem.VitalReadingList.push(obj);
                                }

                                if (kitem.Id === 4 && kitem.Id === item.VitalId) {
                                    let obj = {
                                        "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                        "VitalName": "Resp.Rate",
                                        "MainId": 4,
                                        "Value": item.Value,
                                        "VitalSlotTime": item.VitalSlotTime,
                                    };
                                    kitem.VitalReadingList.push(obj);
                                }

                                //if (kitem.Id === 5 && kitem.Id === item.VitalId) {
                                //    let obj = {
                                //        "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                //        "VitalName": "Spo 2",
                                //        "MainId": 5,
                                //        "Value": item.Value,
                                //        "VitalSlotTime": item.VitalSlotTime,
                                //    };
                                //    kitem.VitalReadingList.push(obj);
                                //}

                                if (kitem.Id === 6 && kitem.Id === item.VitalId) {
                                    let obj = {
                                        "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                        "VitalName": "O2 Saturation",
                                        "MainId": 6,
                                        "Value": item.Value,
                                        "VitalSlotTime": item.VitalSlotTime,
                                    };
                                    kitem.VitalReadingList.push(obj);
                                }

                                if (kitem.Id === 7 && kitem.Id === item.VitalId) {
                                    let obj = {
                                        "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                        "VitalName": "EKG Lead 2",
                                        "MainId": 7,
                                        "Value": item.Value,
                                        "VitalSlotTime": item.VitalSlotTime,
                                    };
                                    kitem.VitalReadingList.push(obj);
                                }

                                if (kitem.Id === 8 && kitem.Id === item.VitalId) {
                                    let obj = {
                                        "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                        "VitalName": "ETCO2",
                                        "MainId": 8,
                                        "Value": item.Value,
                                        "VitalSlotTime": item.VitalSlotTime,
                                    };
                                    kitem.VitalReadingList.push(obj);
                                }
                            });
                        });

                        $scope.IntraNewTimeSlots = [];

                        let tempArray = $filter('filter')($scope.IntraAnesthetistVitals, { 'VitalName': 'Systolic Pressure' }, true);
                        if (tempArray.length > 0) {
                            tempArray[0].VitalReadingList = tempArray[0].VitalReadingList || [];
                            if (tempArray[0].VitalReadingList.length > 0) {
                                angular.forEach(tempArray[0].VitalReadingList, function (kitem) {
                                    $scope.IntraNewTimeSlots.push({ 'time': kitem.VitalSlotTime });
                                });
                            }
                        }
                    }

                    // Anesthesia Medicines

                    if (resp[1].data.IntraOP[0].AnesthetistActions.AnesthesiaMedicines.length > 0) {
                        $scope.IntraAnesthesiaMedicines = angular.copy(resp[1].data.IntraOP[0].AnesthetistActions.AnesthesiaMedicines);
                    } else {
                        $scope.IntraAnesthesiaMedicines = [];
                    }


                

                    $scope.IntraOpSummaryParentObj.EBLValue = resp[1].data.IntraOP[0].AnesthetistActions.EBLValue || "";
                    $scope.IntraOpSummaryParentObj.IntakeValue = resp[1].data.IntraOP[0].AnesthetistActions.IntakeValue || "";
                    $scope.IntraOpSummaryParentObj.OutputValue = resp[1].data.IntraOP[0].AnesthetistActions.OutputValue || "";

                    resp[1].data.IntraOP[0].NurseActions.CauteraisationOthers = resp[1].data.IntraOP[0].NurseActions.CauteraisationOthers || null;
                    $scope.IntraOpSummaryParentObj.NurseActionobj.CauteraisationOthers = resp[1].data.IntraOP[0].NurseActions.CauteraisationOthers;


                    $scope.IntraOpSummaryParentObj.AnesthesiaReviewedBy = resp[1].data.IntraOP[0].AnesthesiaReviewedBy || null;
                    if ($scope.IntraOpSummaryParentObj.AnesthesiaReviewedBy != null) {
                        var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.IntraOpSummaryParentObj.AnesthesiaReviewedBy });
                        if (ReviewedByArraylist.length > 0) {
                            $scope.IntraOpSummaryParentObj.AnesthesiaReviewedByName = angular.copy(ReviewedByArraylist[0].FullName);
                        }
                    }

                    $scope.IntraOpSummaryParentObj.CheckinCheckReviewedBy = resp[1].data.IntraOP[0].CheckinCheckReviewedBy || null;
                    if ($scope.IntraOpSummaryParentObj.CheckinCheckReviewedBy != null) {
                        var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.IntraOpSummaryParentObj.CheckinCheckReviewedBy });
                        if (ReviewedByArraylist.length > 0) {
                            $scope.IntraOpSummaryParentObj.CheckinCheckReviewedByName = angular.copy(ReviewedByArraylist[0].FullName);
                        }

                    }

                    $scope.IntraOpSummaryParentObj.OrdersReviewedDate = resp[1].data.IntraOP[0].OrdersReviewedDate;
                    $scope.IntraOpSummaryParentObj.OrdersReviewedTime = resp[1].data.IntraOP[0].OrdersReviewedtime;
                    $scope.IntraOpSummaryParentObj.DocumentDetails = angular.copy(resp[1].data.IntraOP[0].DocumentDetails);

                    $scope.IntraOpSummaryParentObj.SurgeonOperativeNotes = resp[1].data.IntraOP[0].SurgeonOperativeNotes || "";
                    $scope.IntraOpSummaryParentObj.SurgeonComplicationNotes = resp[1].data.Complications || "";
                    $scope.IntraOpSummaryParentObj.Anesthetistobj.S3URL = resp[1].data.IntraOP[0].S3URL;
                    $scope.IntraOpSummaryParentObj.Findings = resp[1].data.Findings || "";
                    $scope.IntraOpSummaryParentObj.MedicineOrdersInstructions = resp[1].data.IntraOP[0].MedicineOrdersInstructions;

                    $scope.IntraOpSummaryParentObj.SurgeonOperativeNotes = $scope.IntraOpSummaryParentObj.SurgeonOperativeNotes.replace(/\n/g, '<br>');
                    $scope.IntraOpSummaryParentObj.SurgeonComplicationNotes = $scope.IntraOpSummaryParentObj.SurgeonComplicationNotes.replace(/\n/g, '<br>');
                    //$scope.IntraOpSummaryParentObj.Findings = $scope.IntraOpSummaryParentObj.Findings.replace(/\n/g, '<br>');

                    if (resp[1].data.IntraOP[0].InvestigationsList.length > 0) {
                        $scope.IntraOpSummaryParentObj.InvestigationsList = angular.copy(resp[1].data.IntraOP[0].InvestigationsList);
                    } else {
                        $scope.IntraOpSummaryParentObj.InvestigationsList = [];
                    }

                    if (resp[1].data.IntraOP[0].Prescription.length > 0) {
                        $scope.IntraOpSummaryParentObj.PrescriptionDetails = angular.copy(resp[1].data.IntraOP[0].Prescription);
                    } else {
                        $scope.IntraOpSummaryParentObj.PrescriptionDetails = [];
                    }

                    var Nurselist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == resp[1].data.IntraOP[0].NurseActions.SurgicalFirstVerifiedBy }, true);
                    Nurselist = Nurselist || [];
                    if (Nurselist.length > 0) {
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstVerifiedByName = angular.copy(Nurselist[0].FullName);
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstVerifiedBy = resp[1].data.IntraOP[0].NurseActions.SurgicalFirstVerifiedBy;
                    } else {
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstVerifiedByName = '';
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstVerifiedBy = resp[1].data.IntraOP[0].NurseActions.SurgicalFirstVerifiedBy || '';
                    }

                    var SNurselist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == resp[1].data.IntraOP[0].NurseActions.SurgicalSecondVerifiedBy }, true);
                    SNurselist = SNurselist || [];
                    if (SNurselist.length > 0) {
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondVerifiedByName = angular.copy(SNurselist[0].FullName);
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondVerifiedBy = resp[1].data.IntraOP[0].NurseActions.SurgicalSecondVerifiedBy;
                    } else {
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondVerifiedByName = '';
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondVerifiedBy = resp[1].data.IntraOP[0].NurseActions.SurgicalSecondVerifiedBy || '';
                    }

                    var FNurselist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == resp[1].data.IntraOP[0].NurseActions.SurgicalFinalVerifiedBy }, true);
                    FNurselist = FNurselist || [];
                    if (FNurselist.length > 0) {
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalVerifiedByName = angular.copy(FNurselist[0].FullName);
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalVerifiedBy = resp[1].data.IntraOP[0].NurseActions.SurgicalFinalVerifiedBy;
                    } else {
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalVerifiedByName = '';
                        $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalVerifiedBy = resp[1].data.IntraOP[0].NurseActions.SurgicalFinalVerifiedBy || '';
                    }

                    angular.forEach($scope.allUserList, function (item) {

                        if ($scope.IntraOpSummaryParentObj.NurseActionobj.SurgeonId == item.DoctorID) {
                            $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeonName = item.UserFullName;
                        }
                        if ($scope.IntraOpSummaryParentObj.NurseActionobj.TechnicianId == item.DoctorID) {
                            $scope.IntraOpSummaryParentObj.NurseActionobj.TechnicianName = item.UserFullName;
                        }
                        if ($scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesistId == item.DoctorID) {
                            $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesistName = item.UserFullName;
                        }
                        if ($scope.IntraOpSummaryParentObj.NurseActionobj.NurseId == item.DoctorID) {
                            $scope.IntraOpSummaryParentObj.NurseActionobj.NurseName = item.UserFullName;
                        }
                        if ($scope.IntraOpSummaryParentObj.NurseActionobj.CoSurgeonId == item.DoctorID) {
                            $scope.IntraOpSummaryParentObj.NurseActionobj.CoSurgeonName = item.UserFullName;
                        }
                        if ($scope.IntraOpSummaryParentObj.NurseActionobj.ReliefId == item.DoctorID) {
                            $scope.IntraOpSummaryParentObj.NurseActionobj.ReliefName = item.UserFullName;
                        }
                        if ($scope.IntraOpSummaryParentObj.NurseActionobj.SupportingStaffId == item.DoctorID) {
                            $scope.IntraOpSummaryParentObj.NurseActionobj.SupportingStaffName = item.UserFullName;
                        }
                    });

                    let nurselist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 5 }, true);
                    if (nurselist.length > 0) {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseIntraProcedureInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseIntraProcedureInd = false;
                    }

                    let anticipationlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 6 }, true);
                    if (anticipationlist.length > 0) {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseAnticipationOfCriticalInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseAnticipationOfCriticalInd = false;
                    }

                    let timeoutlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 7 }, true);
                    if (timeoutlist.length > 0) {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseTimeOutStopBeforeInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseTimeOutStopBeforeInd = false;
                    }

                    let antibioticlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 8 }, true);
                    if (antibioticlist.length > 0) {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseAntibioticProphylaxisInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseAntibioticProphylaxisInd = false;
                    }

                    let otherslist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 9 }, true);
                    if (otherslist.length > 0) {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseIntraOthersInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseIntraOthersInd = false;
                    }

                    let identificationlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 10 }, true);
                    if (identificationlist.length > 0) {
                        $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistIdentificationOfPatientsInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistIdentificationOfPatientsInd = false;
                    }

                    let insertionlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 11 }, true);
                    if (insertionlist.length > 0) {
                        $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistMarkOfPreviouslyInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistMarkOfPreviouslyInd = false;
                    }

                    let preprocedurelist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 12 }, true);
                    if (preprocedurelist.length > 0) {
                        $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistPreprocedurereqInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistPreprocedurereqInd = false;
                    }

                    let patienthaslist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 13 }, true);
                    if (patienthaslist.length > 0) {
                        $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistPatientHasInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistPatientHasInd = false;
                    }

                    let implantlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 14 }, true);
                    if (implantlist.length > 0) {
                        $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistImplantInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistImplantInd = false;
                    }

                    let monitorslist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 15 }, true);
                    if (monitorslist.length > 0) {
                        $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistMonitorsInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistMonitorsInd = false;
                    }

                    let Anesthesiacheck = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 16 }, true);
                    if (Anesthesiacheck.length > 0) {
                        $scope.IntraOpSummaryParentObj.IsIntraOpAnesthesiacheckInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpAnesthesiacheckInd = false;
                    }

                    let pulseOximeter = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 17 }, true);
                    if (pulseOximeter.length > 0) {
                        $scope.IntraOpSummaryParentObj.IsIntraOpPulseOximeterInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpPulseOximeterInd = false;
                    }

                    if ($scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistIdentificationOfPatientsInd || $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistMarkOfPreviouslyInd || $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistPreprocedurereqInd || $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistPatientHasInd || $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistImplantInd || $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistMonitorsInd || $scope.IntraOpSummaryParentObj.IsIntraOpAnesthesiacheckInd || $scope.IntraOpSummaryParentObj.IsIntraOpPulseOximeterInd) {
                        $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistPreAnesthesiaInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistPreAnesthesiaInd = false;
                    }

                    if ($scope.IntraOpSummaryParentObj.IsIntraOpNurseIntraProcedureInd || $scope.IntraOpSummaryParentObj.IsIntraOpNurseAnticipationOfCriticalInd || $scope.IntraOpSummaryParentObj.IsIntraOpNurseTimeOutStopBeforeInd || $scope.IntraOpSummaryParentObj.IsIntraOpNurseAntibioticProphylaxisInd || $scope.IntraOpSummaryParentObj.IsIntraOpNurseIntraOthersInd || $scope.IntraOpSummaryParentObj.NurseActionobj.ChecklistRemarks != '' || $scope.IntraOpSummaryParentObj.CheckinCheckReviewedBy != null) {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseMainInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseMainInd = false;
                    }

                    if ($scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceStartTime == "" && $scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceEndTime == "" && $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryStartTime == "" && $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryEndTime == "" && $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaStartTime == "" && $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaEndTime == "") {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseSurgeryTimesInd = false;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseSurgeryTimesInd = true;
                    }

                    if ($scope.IntraOpSummaryParentObj.NurseActionobj.SurgeonId == null && $scope.IntraOpSummaryParentObj.NurseActionobj.TechnicianId == null && $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesistId == null && $scope.IntraOpSummaryParentObj.NurseActionobj.NurseId == null && $scope.IntraOpSummaryParentObj.NurseActionobj.ReliefId == null && $scope.IntraOpSummaryParentObj.NurseActionobj.SupportingStaffId == null && $scope.IntraOpSummaryParentObj.NurseActionobj.CoSurgeonId == null ) {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseSurgeryStaffInd = false;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseSurgeryStaffInd = true;
                    }

                    if ($scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstNeedles != "" || $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstBlades != "" || $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstOthers != "" || $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstVerifiedBy != "" || $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstTime != "") {
                        $scope.IntraOpSummaryParentObj.IsSurgicalCountFirstInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsSurgicalCountFirstInd = false;
                    }

                    if ($scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondNeedles != "" || $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondBlades != "" || $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondOthers != "" || $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondVerifiedBy != "" || $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondTime != "") {
                        $scope.IntraOpSummaryParentObj.IsSurgicalCountSecondInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsSurgicalCountSecondInd = false;
                    }

                    if ($scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalNeedles != "" || $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalBlades != "" || $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalOthers != "" || $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalVerifiedBy != "" || $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalTime != "") {
                        $scope.IntraOpSummaryParentObj.IsSurgicalCountFinalInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsSurgicalCountFinalInd = false;
                    }

                    if ($scope.IntraOpSummaryParentObj.IsSurgicalCountFirstInd || $scope.IntraOpSummaryParentObj.IsSurgicalCountSecondInd || $scope.IntraOpSummaryParentObj.IsSurgicalCountFinalInd) {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseSurgicalCountInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseSurgicalCountInd = false;
                    }

                    if ($scope.IntraOpSummaryParentObj.NurseActionobj.Cleansed || $scope.IntraOpSummaryParentObj.NurseActionobj.Contaminated || $scope.IntraOpSummaryParentObj.NurseActionobj.Dirty) {
                        $scope.IntraOpSummaryParentObj.IsIntraClasificationInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraClasificationInd = false;
                    }

                    if ($scope.IntraOpSummaryParentObj.NurseActionobj.Sterilewater == "" && $scope.IntraOpSummaryParentObj.NurseActionobj.Alcohol == "" && $scope.IntraOpSummaryParentObj.NurseActionobj.Levelofconsciousness == "" && $scope.IntraOpSummaryParentObj.NurseActionobj.PatientPosition == "" && $scope.IntraOpSummaryParentObj.NurseActionobj.SafetyDevicePosition.AnotherRailing == "" && $scope.IntraOpSummaryParentObj.NurseActionobj.SafetyDevicePosition.ArmsToTheBody == "" && $scope.IntraOpSummaryParentObj.NurseActionobj.SafetyDevicePosition.Others == "" && $scope.IntraOpSummaryParentObj.NurseActionobj.SafetyDevicePosition.Strap == "" && $scope.IntraOpSummaryParentObj.NurseActionobj.SkinPreparation == "" && $scope.IntraOpSummaryParentObj.NurseActionobj.AreaNotes == "" && $scope.IntraOpSummaryParentObj.NurseActionobj.EspecimenLab == "" && $scope.IntraOpSummaryParentObj.NurseActionobj.NurseActionOrganId == null && $scope.IntraOpSummaryParentObj.NurseActionobj.CropHour == "" && $scope.IntraOpSummaryParentObj.NurseActionobj.NurseActionArea == "") {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseIntraPreOpCallInd = false;
                    } else {
                        $scope.IntraOpSummaryParentObj.IsIntraOpNurseIntraPreOpCallInd = true;
                    }

                    var temparray1 = [];
                    var temparray1 = $filter("filter")($scope.IntraOpSummaryParentObj.DocumentDetails, { "FileTypeId": 20 }, true);

                    if (temparray1.length > 0) {
                        $scope.IntraOpSummaryParentObj.IntraAnesthesiaUploadfileInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IntraAnesthesiaUploadfileInd = false;
                    }

                    var temparray2 = [];
                    var temparray2 = $filter("filter")($scope.IntraOpSummaryParentObj.DocumentDetails, { "FileTypeId": 19 }, true);

                    if (temparray2.length > 0) {
                        $scope.IntraOpSummaryParentObj.IntraNurseUploadfileInd = true;
                    } else {
                        $scope.IntraOpSummaryParentObj.IntraNurseUploadfileInd = false;
                    }

                    $scope.IntraOpSummaryParentObj.ReviewDoctorId = resp[1].data.IntraOP[0].ReviewDoctorId != null ? resp[1].data.IntraOP[0].ReviewDoctorId : "";
                    $scope.IntraOpSummaryParentObj.ReviewNurseId = resp[1].data.IntraOP[0].ReviewNurseId != null ? resp[1].data.IntraOP[0].ReviewNurseId : "";
                    $scope.IntraOpSummaryParentObj.ReviewAnesthetistId = resp[1].data.IntraOP[0].ReviewAnesthetistId != null ? resp[1].data.IntraOP[0].ReviewAnesthetistId : "";
                    $scope.IntraOpSummaryParentObj.ReviewTechnicianId = resp[1].data.IntraOP[0].ReviewTechnicianId != null ? resp[1].data.IntraOP[0].ReviewTechnicianId : "";
                    $scope.IntraOpSummaryParentObj.AnesthesiaMedicationsReviewId = resp[1].data.IntraOP[0].AnesthesiaMedicationsReviewId != null ? resp[1].data.IntraOP[0].AnesthesiaMedicationsReviewId : "";
                    $scope.IntraOpSummaryParentObj.MedicationsReviewId = resp[1].data.IntraOP[0].MedicationsReviewId != null ? resp[1].data.IntraOP[0].MedicationsReviewId : "";

                    if ($scope.IntraOpSummaryParentObj.ReviewDoctorId != 0 || $scope.IntraOpSummaryParentObj.ReviewDoctorId != null) {
                        var doctorlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpSummaryParentObj.ReviewDoctorId });
                    }
                    doctorlist = doctorlist || [];
                    if (doctorlist.length > 0) {
                        $scope.IntraOpSummaryParentObj.DoctorName = angular.copy(doctorlist[0].FullName);
                    }

                    if ($scope.IntraOpSummaryParentObj.ReviewAnesthetistId != 0 || $scope.IntraOpSummaryParentObj.ReviewAnesthetistId != null) {
                        var anesthlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpSummaryParentObj.ReviewAnesthetistId });
                    }
                    anesthlist = anesthlist || [];
                    if (anesthlist.length > 0) {
                        $scope.IntraOpSummaryParentObj.AnesthesiaName = angular.copy(anesthlist[0].FullName);
                    }

                    if ($scope.IntraOpSummaryParentObj.ReviewNurseId != 0 || $scope.IntraOpSummaryParentObj.ReviewNurseId != null) {
                        var Nurslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpSummaryParentObj.ReviewNurseId });
                    }
                    Nurslist = Nurslist || [];
                    if (Nurslist.length > 0) {
                        $scope.IntraOpSummaryParentObj.NurseName = angular.copy(Nurslist[0].FullName);
                    }

                    if ($scope.IntraOpSummaryParentObj.ReviewTechnicianId != 0 || $scope.IntraOpSummaryParentObj.ReviewTechnicianId != null) {
                        var techlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpSummaryParentObj.ReviewTechnicianId });
                    }
                    techlist = techlist || [];
                    if (techlist.length > 0) {
                        $scope.IntraOpSummaryParentObj.TechnicianName = angular.copy(techlist[0].FullName);
                    }

                    if ($scope.IntraOpSummaryParentObj.AnesthesiaMedicationsReviewId != 0 || $scope.IntraOpSummaryParentObj.AnesthesiaMedicationsReviewId != null) {
                        var techlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpSummaryParentObj.AnesthesiaMedicationsReviewId });
                    }
                    techlist = techlist || [];
                    if (techlist.length > 0) {
                        $scope.IntraOpSummaryParentObj.AnesthesiaMedicationsReviewName = angular.copy(techlist[0].FullName);
                    }

                    if ($scope.IntraOpSummaryParentObj.MedicationsReviewId != 0 || $scope.IntraOpSummaryParentObj.MedicationsReviewId != null) {
                        var techlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpSummaryParentObj.MedicationsReviewId });
                    }
                    techlist = techlist || [];
                    if (techlist.length > 0) {
                        $scope.IntraOpSummaryParentObj.MedicationsReviewName = angular.copy(techlist[0].FullName);
                    }

                    $scope.IntraOpSummaryParentObj.AnesthesiaMedicationsNotes = resp[1].data.IntraOP[0].AnesthesiaMedicationsNotes || "";
                    $scope.IntraOpSummaryParentObj.MedicationsNotes = resp[1].data.IntraOP[0].MedicationsNotes || "";

                    //resp[1].data.IntraOP[0].Diagnosis = resp[1].data.IntraOP[0].Diagnosis || [];
                    //if (resp[1].data.IntraOP[0].Diagnosis.length > 0) {
                    //    $scope.IntraOpSummaryParentObj.Diagnosis = angular.copy(resp[1].data.IntraOP[0].Diagnosis);
                    //    $scope.IntraOpSummaryParentObj.IsIntraOpDiagnosisInd = true;
                    //} else {
                    //    $scope.IntraOpSummaryParentObj.Diagnosis = [];
                    //    $scope.IntraOpSummaryParentObj.IsIntraOpDiagnosisInd = false;
                    //}
                    $scope.IntraOpSummaryParentObj.AnesthesiaMedications = resp[1].data.IntraOP[0].AnesthesiaMedications || [];
                    if ($scope.IntraOpSummaryParentObj.AnesthesiaMedications.length > 0) {
                        angular.forEach($scope.IntraOpSummaryParentObj.AnesthesiaMedications, function (item) {
                            if (item.DropTimings.length > 0) {
                                angular.forEach(item.DropTimings, function (Dropitem) {
                                    Dropitem.MedicationTime = Dropitem.MedicationTime || '';
                                    if (Dropitem.MedicationTime != '') {
                                        //let Ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                                        //let Newdate = Ndate + " " + Dropitem.MedicationTime;
                                        //Dropitem.MedicationTime = $filter('date')(new Date(Newdate), "hh:mm a");
                                        let currentDate = moment().format("YYYY-MM-DD");
                                        let combinedDateTime = currentDate + " " + Dropitem.MedicationTime;
                                        let parsedDateTime = moment(combinedDateTime, "YYYY-MM-DD HH:mm");
                                        Dropitem.MedicationTime = parsedDateTime.format("hh:mm a");
                                    }
                                });
                            }
                        });
                    }

                    $scope.IntraOpSummaryParentObj.IntraOpMedications = resp[1].data.IntraOP[0].IntraOpMedications || [];
                    if ($scope.IntraOpSummaryParentObj.IntraOpMedications.length > 0) {
                        angular.forEach($scope.IntraOpSummaryParentObj.IntraOpMedications, function (item) {
                            if (item.DropTimings.length > 0) {
                                angular.forEach(item.DropTimings, function (Dropitem) {
                                    Dropitem.MedicationTime = Dropitem.MedicationTime || '';
                                    
                                    if (Dropitem.MedicationTime != '') {
                                        //let Ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                                        //let Newdate = Ndate + " " + Dropitem.MedicationTime;
                                        //Dropitem.MedicationTime = $filter('date')(new Date(Newdate), "hh:mm a");
                                        let currentDate = moment().format("YYYY-MM-DD");
                                        let combinedDateTime = currentDate + " " + Dropitem.MedicationTime;
                                        let parsedDateTime = moment(combinedDateTime, "YYYY-MM-DD HH:mm");
                                        Dropitem.MedicationTime = parsedDateTime.format("hh:mm a");
                                    }
                                });
                            }
                        });
                    }
                } else {
                    $scope.IntraOpSummaryParentObj.PatientASCIntraOPId = 0;
                    $scope.IntraOpSummaryParentObj.Vitals = [];

                    $scope.IntraOpSummaryParentObj.IsIntraOpVitalsInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpROSMainInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpROSSystemiInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpROSSurgicalInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpROSAllergiesInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpROSPhysicalInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpNurseIntraProcedureInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpNurseAnticipationOfCriticalInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpNurseTimeOutStopBeforeInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpNurseAntibioticProphylaxisInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpNurseIntraRemarksInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpNurseMainInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpNurseIntraOthersInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpNurseSurgeryTimesInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpNurseIntraPreOpCallInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpNurseSurgicalCountInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpAnesthetistActionInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpSurgeonMainInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpSurgeonDoctorNotesInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpSurgeonSurgeonOperativeNotesInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpOrdersMedicationInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpOrdersEyeDropsInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpOrdersInjectionsInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpOrdersLabsInvestigationsInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpOrdersMainInd = false;
                    $scope.IntraOpSummaryParentObj.IsSurgeonInd = false;
                    $scope.IntraOpSummaryParentObj.IsAnesthetistNotesInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraSurgeonComplicationNotes = false;
                    $scope.IntraOpSummaryParentObj.IsIntraDrainageInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraClasificationInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraCauteraisationInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraNurseActionInd = false;
                    $scope.IntraOpSummaryParentObj.IsIntraOpDiagnosisInd = false;
                    $scope.IntraOpSummaryParentObj.IsSurgicalCountFirstInd = false;
                    $scope.IntraOpSummaryParentObj.IsSurgicalCountSecondInd = false;
                    $scope.IntraOpSummaryParentObj.IsSurgicalCountFinalInd = false;
                    $scope.IntraOpSummaryParentObj.EBLValue = "";
                    $scope.IntraOpSummaryParentObj.IntakeValue =  "";
                    $scope.IntraOpSummaryParentObj.OutputValue = "";
                    $scope.IntraOpSummaryParentObj.LMANotes = "";
                    $scope.IntraOpSummaryParentObj.SurgeonComplicationNotes = "";
                    $scope.IntraAnesthesiaMedicines = [];
                    $scope.IntraAnesthetistVitals = [];
                    $scope.ImplantsDetailsArray = [];
                }

                if (resp[1].data.PostOP.length > 0) {
                    $scope.PostOpSummaryParentObj.SurgeryList = angular.copy(resp[1].data.SurgeryList);
                    $scope.PostOpSummaryParentObj.AlderetScoreDetails = angular.copy(resp[1].data.PreOpAlderetScoreDetails);
                    $scope.PostOpSummaryParentObj.TotalAlderetScore = resp[1].data.TotalAlderetScore;
                    $scope.PostOpSummaryParentObj.ROSOverAllRemarks = resp[1].data.ROSOverAllRemarks;
                    $scope.PostOpSummaryParentObj.SurgicalHistory = angular.copy(resp[1].data.SurgicalHistory);
                    $scope.PostOpSummaryParentObj.SystemicHistory = angular.copy(resp[1].data.SystemicHistory);
                    $scope.PostOpSummaryParentObj.AllergyItems = angular.copy(resp[1].data.AllergyItems);

                    if (resp[1].data.CurrentEyeMedicationList.length > 0) {
                        $scope.PostOpSummaryParentObj.CurrentEyeMedications = angular.copy(resp[1].data.CurrentEyeMedicationList);
                    }

                    if (resp[1].data.CurrentSystemicMedicationList.length > 0) {
                        $scope.PostOpSummaryParentObj.CurrentSystemicMedicationsHistory = angular.copy(resp[1].data.CurrentSystemicMedicationList);
                    }

                    //resp[1].data.Diagnosis = resp[1].data.Diagnosis || [];
                    //if (resp[1].data.Diagnosis.length > 0) {
                    //    $scope.PostOpSummaryParentObj.Diagnosis = angular.copy(resp[1].data.Diagnosis) || [];
                    //}

                    resp[1].data.IntraOPAnesthesiaTypelist = resp[1].data.IntraOPAnesthesiaTypelist || [];
                    if (resp[1].data.IntraOPAnesthesiaTypelist.length > 0) {
                        var Anesthelist = $filter("filter")(resp[1].data.IntraOPAnesthesiaTypelist, function (item) { return item.IsSelected == true; });
                        if (Anesthelist.length > 0) {
                            let PostopAnesthesiaList = angular.copy($scope.PostopAnesthesiaList);
                            angular.forEach(Anesthelist, function (Aitem) {
                                Aitem.PatientAnesthesiaPlanId = 0;
                                angular.forEach(PostopAnesthesiaList, function (item) {
                                    if (item.AnesthesiaTypeId == Aitem.AnesthesiaTypeId) {
                                        item.IsSelected = Aitem.IsSelected;
                                    }
                                });
                                $scope.PostOpSummaryParentObj.AnesthesiaTypelist = angular.copy(PostopAnesthesiaList);
                            });
                        }
                    }

                    resp[1].data.IntraOpInvestigationsList = resp[1].data.IntraOpInvestigationsList || [];
                    if (resp[1].data.IntraOpInvestigationsList.length > 0) {
                        $scope.PostOpSummaryParentObj.SurgeonObj.InvestigationsList = angular.copy(resp[1].data.IntraOpInvestigationsList);
                    }

                    resp[1].data.IntraOpPrescription = resp[1].data.IntraOpPrescription || [];
                    if (resp[1].data.IntraOpPrescription.length > 0) {
                        $scope.PostOpSummaryParentObj.PrescriptionDetails = angular.copy(resp[1].data.IntraOpPrescription);
                    }

                    // identity parameter
                    $scope.PostOpSummaryParentObj.PatientASCPostOPId = resp[1].data.PostOP[0].PatientASCPostOPId;

                    resp[1].data.PostOP[0].VitalsArray = resp[1].data.PostOP[0].VitalsArray || [];
                    if (resp[1].data.PostOP[0].VitalsArray.length > 0) {
                        angular.forEach(resp[1].data.PostOP[0].VitalsArray, function (item) {
                            var vitalslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.DoctorId });
                            if (vitalslist.length > 0) {
                                item.UserName = angular.copy(vitalslist[0].FullName);
                            }
                            //let ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                            //let edate = ndate + " " + item.VitalAddTime;
                            //item.VitalAddTime = $filter('date')(new Date(edate), "hh:mm a");
                            let currentDate = moment().format("YYYY-MM-DD");
                            let combinedDateTime = currentDate + " " + item.VitalAddTime;
                            let parsedDateTime = moment(combinedDateTime, "YYYY-MM-DD HH:mm");
                            item.VitalAddTime = parsedDateTime.format("hh:mm a");
                        });
                    }
                    $scope.PostOpSummaryParentObj.MedicineOrdersInstructions = angular.copy(resp[1].data.PostOP[0].MedicineOrdersInstructions);

                    $scope.PostOpSummaryParentObj.Vitals = resp[1].data.PostOP[0].VitalsArray;
                    if ($scope.PostOpSummaryParentObj.Vitals.length > 0) {
                        $scope.PostOpSummaryParentObj.IsPostOpVitalsInd = true;
                    } else {
                        $scope.PostOpSummaryParentObj.IsPostOpVitalsInd = false;
                    }

                    resp[1].data.PostOP[0].AnesthesiaTypelist = resp[1].data.PostOP[0].AnesthesiaTypelist || [];
                    if (resp[1].data.PostOP[0].AnesthesiaTypelist.length > 0) {
                        let PostopAnesthesiaList = angular.copy($scope.PostopAnesthesiaList);
                        angular.forEach(PostopAnesthesiaList, function (item) {
                            angular.forEach(resp[1].data.PostOP[0].AnesthesiaTypelist, function (Aitem) {
                                if (Aitem.AnesthesiaTypeId == item.AnesthesiaTypeId) {
                                    item.IsSelected = Aitem.IsSelected;
                                    item.PatientAnesthesiaPlanId = Aitem.PatientAnesthesiaPlanId;
                                }
                            });
                            $scope.PostOpSummaryParentObj.AnesthesiaTypelist = angular.copy(PostopAnesthesiaList);
                        });
                    }

                    $scope.PostOpSummaryParentObj.Intake = resp[1].data.PostOP[0].Intake || "";
                    $scope.PostOpSummaryParentObj.Output = resp[1].data.PostOP[0].Output || "";
                    $scope.PostOpSummaryParentObj.EBL = resp[1].data.PostOP[0].EBL || "";
                    $scope.PostOpSummaryParentObj.InTime = resp[1].data.PostOP[0].InTime || "";                 
                    $scope.PostOpSummaryParentObj.OutTime = resp[1].data.PostOP[0].OutTime || "";
                
                    $scope.PostOpSummaryParentObj.OxygenType = resp[1].data.PostOP[0].OxygenType;
                    $scope.PostOpSummaryParentObj.OxygenQuantity = resp[1].data.PostOP[0].OxygenQuantity;


                    if ($scope.PostOpSummaryParentObj.AllergyItems.length > 0) {
                        $scope.PostOpSummaryParentObj.IsPostOpROSAllergiesInd = true;
                    } else {
                        $scope.PostOpSummaryParentObj.IsPostOpROSAllergiesInd = false;
                    }

                    if ($scope.PostOpSummaryParentObj.SystemicHistory.length > 0) {
                        $scope.PostOpSummaryParentObj.IsPostOpROSSystemiInd = true;
                    } else {
                        $scope.PostOpSummaryParentObj.IsPostOpROSSystemiInd = false;
                    }

                    if ($scope.PostOpSummaryParentObj.SurgicalHistory.length > 0) {
                        $scope.PostOpSummaryParentObj.IsPostOpROSSurgicalInd = true;
                    } else {
                        $scope.PostOpSummaryParentObj.IsPostOpROSSurgicalInd = false;
                    }

                    if ($scope.PostOpSummaryParentObj.IsPostOpROSAllergiesInd || $scope.PostOpSummaryParentObj.IsPostOpROSSystemiInd || $scope.PostOpSummaryParentObj.IsPostOpROSSurgicalInd) {
                        $scope.PostOpSummaryParentObj.IsPostOpROSMainInd = true;
                    } else {
                        $scope.PostOpSummaryParentObj.IsPostOpROSMainInd = false;
                    }

                    $scope.PostOpSummaryParentObj.DocumentDetails = angular.copy(resp[1].data.PostOP[0].DocumentDetails);

                    $scope.IsNurseFileUploads = false;
                    $scope.IsAnesthetistFileUploads = false;
                    $scope.IsDischargeFileUploads = false;
                    $scope.IsSurgeonFileUploads = false;

                    if ($scope.PostOpSummaryParentObj.DocumentDetails.length > 0) {
                        var TempArray1 = $filter('filter')($scope.PostOpSummaryParentObj.DocumentDetails, { 'NoteFileTypeId': 24 }, true);
                        if (TempArray1.length > 0) {
                            $scope.IsSurgeonFileUploads = true;
                        } else {
                            $scope.IsSurgeonFileUploads = false;
                        }

                        var TempArray1 = $filter('filter')($scope.PostOpSummaryParentObj.DocumentDetails, { 'NoteFileTypeId': 25 }, true);
                        if (TempArray1.length > 0) {
                            $scope.IsDischargeFileUploads = true;
                        } else {
                            $scope.IsDischargeFileUploads = false;
                        }

                        var TempArray1 = $filter('filter')($scope.PostOpSummaryParentObj.DocumentDetails, { 'NoteFileTypeId': 23 }, true);
                        if (TempArray1.length > 0) {
                            $scope.IsAnesthetistFileUploads = true;
                        } else {
                            $scope.IsAnesthetistFileUploads = false;
                        }

                        var TempArray1 = $filter('filter')($scope.PostOpSummaryParentObj.DocumentDetails, { 'NoteFileTypeId': 22 }, true);
                        if (TempArray1.length > 0) {
                            $scope.IsNurseFileUploads = true;
                        } else {
                            $scope.IsNurseFileUploads = false;
                        }
                    }

                    $scope.PostOpSummaryParentObj.ReviewedBy = resp[1].data.PostOP[0].NurseReviewedBy || 0;
                    $scope.PostOpSummaryParentObj.NurseReviewedBy = resp[1].data.PostOP[0].NurseReviewedBy || 0;

                    $scope.PostOpSummaryParentObj.NurseReviewedDate = resp[1].data.PostOP[0].NurseReviewedDate;
                    $scope.PostOpSummaryParentObj.NurseReviewedTime = resp[1].data.PostOP[0].NurseReviewedtime;

                    //resp[1].data.PostOP[0].Diagnosis = resp[1].data.PostOP[0].Diagnosis || [];
                    //if (resp[1].data.PostOP[0].Diagnosis.length > 0) {
                    //    $scope.PostOpSummaryParentObj.Diagnosis = angular.copy(resp[1].data.PostOP[0].Diagnosis) || [];
                    //    $scope.PostOpSummaryParentObj.IsPostOpDiagnosisInd = true;
                    //} else {
                    //    $scope.PostOpSummaryParentObj.IsPostOpDiagnosisInd = false;
                    //}

                    if ($scope.PostOpSummaryParentObj.NurseReviewedBy != 0 || $scope.PostOpSummaryParentObj.NurseReviewedBy != null) {
                        var list1 = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpSummaryParentObj.NurseReviewedBy });
                        if (list1.length > 0) {
                            $scope.PostOpSummaryParentObj.NurseReviewedByName = angular.copy(list1[0].FullName);
                            $scope.PostOpSummaryParentObj.IsNurseInd = true;
                        }
                        else {
                            $scope.PostOpSummaryParentObj.IsNurseInd = false;
                        }
                    }
                    $scope.PostOpSummaryParentObj.S3URL = resp[1].data.PostOP[0].S3URL;

                    $scope.PostOpSummaryParentObj.DischargeReviewedDate = resp[1].data.PostOP[0].DischargeReviewedDate;
                    $scope.PostOpSummaryParentObj.DischargeReviewedTime = resp[1].data.PostOP[0].DischargeReviewedtime;
                    $scope.PostOpSummaryParentObj.DischargeObj.ComplicationsNotes = resp[1].data.PostOP[0].ComplicationsNotes || "";
                    $scope.PostOpSummaryParentObj.DischargeObj.SurgeonOperativeNotes = resp[1].data.PostOP[0].SurgeonOperativeNotes || "";

                    $scope.PostOpSummaryParentObj.DischargeObj.ComplicationsNotes = $scope.PostOpSummaryParentObj.DischargeObj.ComplicationsNotes.replace(/\n/g, '<br>');
                    $scope.PostOpSummaryParentObj.DischargeObj.SurgeonOperativeNotes = $scope.PostOpSummaryParentObj.DischargeObj.SurgeonOperativeNotes.replace(/\n/g, '<br>');
                    $scope.PostOpSummaryParentObj.DischargeReviewedBy = resp[1].data.PostOP[0].DischargeReviewedBy || 0;
                    if ($scope.PostOpSummaryParentObj.DischargeReviewedBy != 0 || $scope.PostOpSummaryParentObj.DischargeReviewedBy != null) {
                        var list1 = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpSummaryParentObj.DischargeReviewedBy });
                        if (list1.length > 0) {
                            $scope.PostOpSummaryParentObj.DischargeReviewedByName = angular.copy(list1[0].FullName);
                            $scope.PostOpSummaryParentObj.IsDischargeInd = true;
                        }
                        else {
                            $scope.PostOpSummaryParentObj.IsDischargeInd = false;
                        }
                    }
                    // nurse checklists and actions
                    if (resp[1].data.PostOP[0].NurseCheckLists.length > 0) {
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.PostOPNurseCheckListId = resp[1].data.PostOP[0].NurseCheckLists[0].PostOPNurseCheckListId;
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.PatientReceived = resp[1].data.PostOP[0].NurseCheckLists[0].PatientReceived;
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.AccompaniedBy = resp[1].data.PostOP[0].NurseCheckLists[0].AccompaniedBy;
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.PainLevel = resp[1].data.PostOP[0].NurseCheckLists[0].PainLevel;
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.PainLevelRemarks = resp[1].data.PostOP[0].NurseCheckLists[0].PainLevelRemarks;
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.NourishmentProvider = resp[1].data.PostOP[0].NurseCheckLists[0].NourishmentProvider;
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.BloodSugar = resp[1].data.PostOP[0].NurseCheckLists[0].BloodSugar;
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.PostOpInstruction = resp[1].data.PostOP[0].NurseCheckLists[0].PostOpInstruction;
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.ReceivedRoom = resp[1].data.PostOP[0].NurseCheckLists[0].ReceivedRoom;
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.Patientallowed = resp[1].data.PostOP[0].NurseCheckLists[0].Patientallowed;
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.Personalbelonging = resp[1].data.PostOP[0].NurseCheckLists[0].Personalbelonging;
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.Patientadvised = resp[1].data.PostOP[0].NurseCheckLists[0].Patientadvised;
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.PatientClinic = resp[1].data.PostOP[0].NurseCheckLists[0].PatientClinic;
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.Physicianexamine = resp[1].data.PostOP[0].NurseCheckLists[0].Physicianexamine;
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.Removedintact = resp[1].data.PostOP[0].NurseCheckLists[0].Removedintact;
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.Orientedtimes = resp[1].data.PostOP[0].NurseCheckLists[0].Orientedtimes;
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.OtherMental = resp[1].data.PostOP[0].NurseCheckLists[0].OtherMental;
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.Notes = resp[1].data.PostOP[0].NurseCheckLists[0].Notes;
                        //if (resp[1].data.PostOP[0].NurseCheckLists[0].PainLevel != '' && $scope.PostOpSummaryParentObj.IsEdit==true) {
                        //    $scope.PostOpSummaryParentObj.NurseChart.Checklists.PainLevel = $filter('filter')($scope.PainLevelScoreArray, { 'Id': resp[1].data.PostOP[0].NurseCheckLists[0].PainLevel }, true);
                        //}
                        //else {
                        //    $scope.PostOpSummaryParentObj.NurseChart.Checklists.PainLevel = resp[1].data.PostOP[0].NurseCheckLists[0].PainLevel||"";
                        //}
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.PainLevel = resp[1].data.PostOP[0].NurseCheckLists[0].PainLevel || "";
                        $scope.PostOpSummaryParentObj.NurseChart.Checklists.PainLevelRemarks = resp[1].data.PostOP[0].NurseCheckLists[0].PainLevelRemarks || "";
                    }
                    if ($scope.PostOpSummaryParentObj.NurseChart.Checklists.PatientReceived != '' || $scope.PostOpSummaryParentObj.NurseChart.Checklists.AccompaniedBy != '' || $scope.PostOpSummaryParentObj.NurseChart.Checklists.PainLevel != '' || $scope.PostOpSummaryParentObj.NurseChart.Checklists.PainLevelRemarks != '' || $scope.PostOpSummaryParentObj.NurseChart.Checklists.NourishmentProvider != '' || $scope.PostOpSummaryParentObj.NurseChart.Checklists.BloodSugar != ''
                        || $scope.PostOpSummaryParentObj.NurseChart.Checklists.PostOpInstruction != '' || $scope.PostOpSummaryParentObj.NurseChart.Checklists.ReceivedRoom != '' || $scope.PostOpSummaryParentObj.NurseChart.Checklists.Patientallowed != '' || $scope.PostOpSummaryParentObj.NurseChart.Checklists.Personalbelonging != '' || $scope.PostOpSummaryParentObj.NurseChart.Checklists.Patientadvised != ''
                        || $scope.PostOpSummaryParentObj.NurseChart.Checklists.PatientClinic != '' || $scope.PostOpSummaryParentObj.NurseChart.Checklists.Physicianexamine != '' || $scope.PostOpSummaryParentObj.NurseChart.Checklists.Removedintact != '' || $scope.PostOpSummaryParentObj.NurseChart.Checklists.Orientedtimes != '' || $scope.PostOpSummaryParentObj.NurseChart.Checklists.OtherMental != ''
                        || $scope.PostOpSummaryParentObj.NurseChart.Checklists.Notes != '') {

                        $scope.PostOpSummaryParentObj.IsPostOpChecklistInd = true;
                    } else {
                        $scope.PostOpSummaryParentObj.IsPostOpChecklistInd = false;
                    }

                    if (resp[1].data.PostOP[0].NurseActions.length > 0) {
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.PostOPNurseActionId = resp[1].data.PostOP[0].NurseActions[0].PostOPNurseActionId;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Speech = resp[1].data.PostOP[0].NurseActions[0].Speech;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Vision = resp[1].data.PostOP[0].NurseActions[0].Vision;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Pain = resp[1].data.PostOP[0].NurseActions[0].Pain;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.ConsciousLevel = resp[1].data.PostOP[0].NurseActions[0].ConsciousLevel;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Fur = resp[1].data.PostOP[0].NurseActions[0].Fur;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.IncisionlaDrainage = resp[1].data.PostOP[0].NurseActions[0].IncisionlaDrainage;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Nausea = resp[1].data.PostOP[0].NurseActions[0].Nausea;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.IngestedFood = resp[1].data.PostOP[0].NurseActions[0].IngestedFood;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Referred = resp[1].data.PostOP[0].NurseActions[0].Referred;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Relationship = resp[1].data.PostOP[0].NurseActions[0].Relationship;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Exit = resp[1].data.PostOP[0].NurseActions[0].Exit;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Instruction = resp[1].data.PostOP[0].NurseActions[0].Instruction;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Prescription = resp[1].data.PostOP[0].NurseActions[0].Prescription;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.LensCard = resp[1].data.PostOP[0].NurseActions[0].LensCard;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Surveillance = resp[1].data.PostOP[0].NurseActions[0].Surveillance;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Bandage = resp[1].data.PostOP[0].NurseActions[0].Bandage;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Advancediet = resp[1].data.PostOP[0].NurseActions[0].Advancediet;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Discharge = resp[1].data.PostOP[0].NurseActions[0].Discharge;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Administer = resp[1].data.PostOP[0].NurseActions[0].Administer;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Tylenol = resp[1].data.PostOP[0].NurseActions[0].Tylenol;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Review = resp[1].data.PostOP[0].NurseActions[0].Review;
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Notes = resp[1].data.PostOP[0].NurseActions[0].Notes;
                    }
                    if ($scope.PostOpSummaryParentObj.NurseChart.Actions.Speech != '' || $scope.PostOpSummaryParentObj.NurseChart.Actions.Vision != '' || $scope.PostOpSummaryParentObj.NurseChart.Actions.Pain != '' || $scope.PostOpSummaryParentObj.NurseChart.Actions.ConsciousLevel != '' ||
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Fur != '' || $scope.PostOpSummaryParentObj.NurseChart.Actions.IncisionlaDrainage != '' || $scope.PostOpSummaryParentObj.NurseChart.Actions.Nausea != '' || $scope.PostOpSummaryParentObj.NurseChart.Actions.IngestedFood != '' ||
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Referred != '' || $scope.PostOpSummaryParentObj.NurseChart.Actions.Relationship != '' || $scope.PostOpSummaryParentObj.NurseChart.Actions.Exit != '' || $scope.PostOpSummaryParentObj.NurseChart.Actions.Instruction != '' ||
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Prescription != '' || $scope.PostOpSummaryParentObj.NurseChart.Actions.Discharge != '' || $scope.PostOpSummaryParentObj.NurseChart.Actions.Administer != '' || $scope.PostOpSummaryParentObj.NurseChart.Actions.Tylenol != '' ||
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Advancediet != '' || $scope.PostOpSummaryParentObj.NurseChart.Actions.Speech != '' || $scope.PostOpSummaryParentObj.NurseChart.Actions.Speech != '' || $scope.PostOpSummaryParentObj.NurseChart.Actions.Speech != '' ||
                        $scope.PostOpSummaryParentObj.NurseChart.Actions.Review != '') {

                        $scope.PostOpSummaryParentObj.IsPostOpActionInd = true;

                    } else {
                        $scope.PostOpSummaryParentObj.IsPostOpActionInd = false;
                    }

                    if ($scope.PostOpSummaryParentObj.IsPostOpChecklistInd || $scope.PostOpSummaryParentObj.IsPostOpActionInd) {
                        $scope.PostOpSummaryParentObj.IsPostOpNurseMainInd = true;
                    } else {
                        $scope.PostOpSummaryParentObj.IsPostOpNurseMainInd = false;
                    }
                    resp[1].data.PostOP[0].SurgeonInvestigations = resp[1].data.PostOP[0].SurgeonInvestigations || [];
                    if (resp[1].data.PostOP[0].SurgeonInvestigations.length > 0) {
                        $scope.PostOpSummaryParentObj.SurgeonObj.InvestigationsList = angular.copy(resp[1].data.PostOP[0].SurgeonInvestigations);
                        $scope.PostOpSummaryParentObj.IsLabInvestigationInd = true;
                    } else {
                        $scope.PostOpSummaryParentObj.IsLabInvestigationInd = false;
                    }

                    resp[1].data.PostOP[0].SurgeonMedications = resp[1].data.PostOP[0].SurgeonMedications || [];
                    if (resp[1].data.PostOP[0].SurgeonMedications.length > 0) {
                        $scope.PostOpSummaryParentObj.SurgeonObj.MedicationsList = angular.copy(resp[1].data.PostOP[0].SurgeonMedications);
                        $scope.PostOpSummaryParentObj.IsPostOpMedicationInd = true;
                    } else {
                        $scope.PostOpSummaryParentObj.IsPostOpMedicationInd = false;
                    }

                    $scope.PostOpSummaryParentObj.SurgeonObj.DoctorNotes = resp[1].data.PostOP[0].DoctorNotes;
                    if ($scope.PostOpSummaryParentObj.SurgeonObj.DoctorNotes != "") {
                        $scope.PostOpSummaryParentObj.IsPostDoctorNotesInd = true;
                    } else {
                        $scope.PostOpSummaryParentObj.IsPostDoctorNotesInd = false;
                    }

                    $scope.PostOpSummaryParentObj.SurgeonObj.PostOpInstruction = resp[1].data.PostOP[0].PostOpInstruction;
                    if ($scope.PostOpSummaryParentObj.SurgeonObj.PostOpInstruction != "") {
                        $scope.PostOpSummaryParentObj.IsPostOpInstructionsInd = true;
                    } else {
                        $scope.PostOpSummaryParentObj.IsPostOpInstructionsInd = false;
                    }
                    if ($scope.PostOpSummaryParentObj.IsLabInvestigationInd || $scope.PostOpSummaryParentObj.IsPostOpMedicationInd || $scope.PostOpSummaryParentObj.IsPostOpInstructionsInd || $scope.PostOpSummaryParentObj.IsPostDoctorNotesInd || $scope.PostOpSummaryParentObj.IsPostOpDiagnosisInd) {
                        $scope.PostOpSummaryParentObj.IsPostOpSurgeonMainInd = true;
                    } else {
                        $scope.PostOpSummaryParentObj.IsPostOpSurgeonMainInd = false;
                    }

                    $scope.PostOpSummaryParentObj.SurgeonObj.ReviewedBy = resp[1].data.PostOP[0].SurgeonReviewedBy || 0;
                    $scope.PostOpSummaryParentObj.SurgeonReviewedBy = resp[1].data.PostOP[0].SurgeonReviewedBy || 0;

                    $scope.PostOpSummaryParentObj.SurgeonReviewedDate = resp[1].data.PostOP[0].SurgeonReviewedDate;
                    $scope.PostOpSummaryParentObj.SurgeonReviewedTime = resp[1].data.PostOP[0].SurgeonReviewedtime;

                    if ($scope.PostOpSummaryParentObj.SurgeonReviewedBy != 0 || $scope.PostOpSummaryParentObj.SurgeonReviewedBy != null) {
                        var list2 = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpSummaryParentObj.SurgeonReviewedBy });
                        if (list2.length > 0) {
                            $scope.PostOpSummaryParentObj.SurgeonReviewedByName = angular.copy(list2[0].FullName);
                            $scope.PostOpSummaryParentObj.IsSurgeonInd = true;
                        }
                        else {
                            $scope.PostOpSummaryParentObj.IsSurgeonInd = false;
                        }
                    }

                    // anesthesia tab

                    if (resp[1].data.PostOP[0].AnesthetistVitals.length > 0) {
                        $scope.PostAnesthetistVitals = angular.copy($scope.GetAnesthetistVitals());
                        angular.forEach(resp[1].data.PostOP[0].AnesthetistVitals, function (item) {
                            angular.forEach($scope.PostAnesthetistVitals, function (kitem) {
                                if (kitem.VitalId === 1 && kitem.VitalId === item.VitalsId) {
                                    let obj = {
                                        "VitalValueId": 0,
                                        "PostOPAnesthesiaVitalsId": item.PostOPAnesthesiaVitalsId || 0,
                                        "VitalName": "Systolic Pressure",
                                        "MainId": 1,
                                        "VitalSlotTime": item.VitalSlotTime,
                                        "Value": item.Value,
                                        "DeleteInd": "N"
                                    };
                                    kitem.VitalValues.push(obj);
                                }

                                if (kitem.VitalId === 2 && kitem.VitalId === item.VitalsId) {
                                    let obj = {
                                        "VitalValueId": 0,
                                        "PostOPAnesthesiaVitalsId": item.PostOPAnesthesiaVitalsId || 0,
                                        "VitalName": "Diastolic Pressure",
                                        "MainId": 2,
                                        "VitalSlotTime": item.VitalSlotTime,
                                        "Value": item.Value,
                                        "DeleteInd": "N"
                                    };
                                    kitem.VitalValues.push(obj);
                                }

                                if (kitem.VitalId === 3 && kitem.VitalId === item.VitalsId) {
                                    let obj = {
                                        "VitalValueId": 0,
                                        "PostOPAnesthesiaVitalsId": item.PostOPAnesthesiaVitalsId || 0,
                                        "VitalName": "Pulse",
                                        "MainId": 3,
                                        "VitalSlotTime": item.VitalSlotTime,
                                        "Value": item.Value,
                                        "DeleteInd": "N"
                                    };
                                    kitem.VitalValues.push(obj);
                                }

                                if (kitem.VitalId === 4 && kitem.VitalId === item.VitalsId) {
                                    let obj = {
                                        "VitalValueId": 0,
                                        "PostOPAnesthesiaVitalsId": item.PostOPAnesthesiaVitalsId || 0,
                                        "VitalName": "Resp.Rate",
                                        "MainId": 4,
                                        "VitalSlotTime": item.VitalSlotTime,
                                        "Value": item.Value,
                                        "DeleteInd": "N"
                                    };
                                    kitem.VitalValues.push(obj);
                                }

                                //if (kitem.VitalId === 5 && kitem.VitalId === item.VitalsId) {
                                //    let obj = {
                                //        "VitalValueId": 0,
                                //        "PostOPAnesthesiaVitalsId": item.PostOPAnesthesiaVitalsId || 0,
                                //        "VitalName": "Spo 2",
                                //        "MainId": 5,
                                //        "VitalSlotTime": item.VitalSlotTime,
                                //        "Value": item.Value,
                                //        "DeleteInd": "N"
                                //    };
                                //    kitem.VitalValues.push(obj);
                                //}

                                if (kitem.VitalId === 6 && kitem.VitalId === item.VitalsId) {
                                    let obj = {
                                        "VitalValueId": 0,
                                        "PostOPAnesthesiaVitalsId": item.PostOPAnesthesiaVitalsId || 0,
                                        "VitalName": "O2 Saturation",
                                        "MainId": 6,
                                        "VitalSlotTime": item.VitalSlotTime,
                                        "Value": item.Value,
                                        "DeleteInd": "N"
                                    };
                                    kitem.VitalValues.push(obj);
                                }

                                //if (kitem.VitalId === 7 && kitem.VitalId === item.VitalsId) {
                                //    let obj = {
                                //        "VitalValueId": 0,
                                //        "PostOPAnesthesiaVitalsId": item.PostOPAnesthesiaVitalsId || 0,
                                //        "VitalName": "EKG Lead 2",
                                //        "MainId": 7,
                                //        "VitalSlotTime": item.VitalSlotTime,
                                //        "Value": item.Value,
                                //        "DeleteInd": "N"
                                //    };
                                //    kitem.VitalValues.push(obj);
                                //}

                                //if (kitem.VitalId === 8 && kitem.VitalId === item.VitalsId) {
                                //    let obj = {
                                //        "VitalValueId": 0,
                                //        "PostOPAnesthesiaVitalsId": item.PostOPAnesthesiaVitalsId || 0,
                                //        "VitalName": "ETCO2",
                                //        "MainId": 8,
                                //        "VitalSlotTime": item.VitalSlotTime,
                                //        "Value": item.Value,
                                //        "DeleteInd": "N"
                                //    };
                                //    kitem.VitalValues.push(obj);
                                //}
                            });
                        });

                        $scope.NewTimeSlots = [];

                        let tempArray = $filter('filter')($scope.PostAnesthetistVitals, { 'VitalName': 'Systolic Pressure' }, true);
                        if (tempArray.length > 0) {
                            tempArray[0].VitalValues = tempArray[0].VitalValues || [];
                            if (tempArray[0].VitalValues.length > 0) {
                                angular.forEach(tempArray[0].VitalValues, function (kitem) {
                                    $scope.NewTimeSlots.push({ 'time': kitem.VitalSlotTime });
                                });
                            }
                        }
                    }

                    $scope.AldreteDetails = angular.copy($scope.GetAldreteDetails());

                    if (resp[1].data.PostOP[0].AldreteDetails.length > 0) {
                        angular.forEach(resp[1].data.PostOP[0].AldreteDetails, function (item) {
                            angular.forEach($scope.AldreteDetails, function (kitem) {
                                if (item.AldreteVitalId === kitem.AldreteVitalId) {
                                    let obj = {
                                        "PatientPostOpAldreteValueId": null,
                                        "PostOPAldreteDetailId": item.PostOPAldreteDetailId || 0,
                                        "AldreteVitalSlotTime": item.AldreteVitalSlotTime || "",
                                        "ValueId": item.ValueId,
                                        "Score": item.Score,
                                        "DeleteInd": "N"
                                    };
                                    kitem.AldreteValues.push(obj);
                                }
                            });
                        });
                    }
                    $scope.AldreteTotalScoreDetails = [];
                    if (resp[1].data.PostOP[0].AldreteTotalScoreDetails.length > 0) {
                        angular.forEach(resp[1].data.PostOP[0].AldreteTotalScoreDetails, function (item) {
                            let obj = {
                                "PostOPAnesthesiaTotalScoreId": item.PostOPAnesthesiaTotalScoreId || null,
                                "AldreteSlotTime": item.AldreteSlotTime,
                                "TotalScore": item.TotalScore,
                                "DeleteInd": "N"
                            }
                            $scope.AldreteTotalScoreDetails.push(obj);
                        });
                    }


                    // $scope.getTimesList();

                    //$scope.AnesthesiaObj.ReviewedBy = resp[1].data.PostOP[0].AnesthesiaReviewedBy || 0;

                    //$scope.PostOpSummaryParentObj.AnesthesiaReviewedBy = resp[1].data.PostOP[0].AnesthesiaReviewedBy || 0;

                    //$scope.PostOpSummaryParentObj.ReviewedDate = resp[1].data.PostOP[0].ReviewedDate;
                    //$scope.PostOpSummaryParentObj.ReviewedTime = resp[1].data.PostOP[0].Reviewedtime;

                    //if ($scope.PostOpSummaryParentObj.AnesthesiaReviewedBy != 0 || $scope.PostOpSummaryParentObj.AnesthesiaReviewedBy != null) {
                    //    var list = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpSummaryParentObj.AnesthesiaReviewedBy });
                    //    if (list.length > 0) {
                    //        $scope.PostOpSummaryParentObj.ReviewedByName = angular.copy(list[0].FullName);
                    //        //$scope.AnesthesiaObj.ReviewedBy = angular.copy(list[0].FullName);
                    //        $scope.PostOpSummaryParentObj.IsAnesthesiaInd = true;
                    //    }
                    //    else {
                    //        $scope.PostOpSummaryParentObj.IsAnesthesiaInd = false;
                    //    }

                    //}

                    //$scope.AnesthesiaObj.AnesthesiaTypeId = resp[1].data.PostOP[0].AnesthesiaTypeId;
                    //$scope.AnesthesiaObj.Duration = resp[1].data.PostOP[0].Duration || 0;
                    //if ($scope.AnesthesiaObj.Duration != 0) {
                    //    $scope.AnesthesiaObj.Duration = $scope.AnesthesiaObj.Duration.toString();
                    //}
                    //if ($scope.AnesthesiaObj.AnesthesiaTypeId != '' || $scope.AnesthesiaObj.AnesthesiaTypeId != null) {
                    //    $scope.isDisabledFields = true;
                    //} else {
                    //    $scope.isDisabledFields = false;
                    //}
                    //var consultationTime = $scope.AnesthesiaObj.Duration;

                    if ($scope.PostOpSummaryParentObj.IsPostOpGraphInd) {
                        $scope.PostOpSummaryParentObj.IsPostOpAnesthetistMainInd = true;
                    } else {
                        $scope.PostOpSummaryParentObj.IsPostOpAnesthetistMainInd = false;
                    }

                    resp[1].data.PostOP[0].AnesthesiaMedicines = resp[1].data.PostOP[0].AnesthesiaMedicines || [];
                    if (resp[1].data.PostOP[0].AnesthesiaMedicines.length > 0) {
                        $scope.PostAnesthesiaMedicines = angular.copy(resp[1].data.PostOP[0].AnesthesiaMedicines);
                    }

                    if (resp[1].data.PostOP[0].AnesthesiaMedicines.length > 0 || resp[1].data.PostOP[0].AldreteTotalScoreDetails.length > 0) {
                        $scope.PostOpSummaryParentObj.ShowGraph = true;
                    } else {
                        $scope.PostOpSummaryParentObj.ShowGraph = false;
                    }



                    if ($scope.PostOpSummaryParentObj.Vitals.length > 0) {
                        angular.forEach($scope.PostOpSummaryParentObj.Vitals, function (vitem) {
                            var vitallist = [];
                            var vitallist = $filter("filter")($scope.PerformedByArray, function (kitem) { return kitem.DoctorID == vitem.PerformedBy });
                            if (vitallist.length > 0) {
                                vitem.PerformedByName = angular.copy(vitallist[0].FullName);
                            }
                        });
                    }

                    $scope.PostOpSummaryParentObj.PostOpChartStatus = resp[1].data.PostOP[0].PostOpChartStatus;
                    $scope.PostOpSummaryParentObj.StatusFlag = resp[1].data.PostOP[0].StatusFlag;

                    resp[1].data.PostOP[0].InvestigationsList = resp[1].data.PostOP[0].InvestigationsList || [];
                    if (resp[1].data.PostOP[0].InvestigationsList.length > 0) {
                        $scope.PostOpSummaryParentObj.SurgeonObj.InvestigationsList = angular.copy(resp[1].data.PostOP[0].InvestigationsList);
                    } else {
                        $scope.PostOpSummaryParentObj.SurgeonObj.InvestigationsList = [];
                    }
                    resp[1].data.PostOP[0].Prescription = resp[1].data.PostOP[0].Prescription || [];
                    if (resp[1].data.PostOP[0].Prescription.length > 0) {
                        $scope.PostOpSummaryParentObj.PrescriptionDetails = angular.copy(resp[1].data.PostOP[0].Prescription);
                    } else {
                        $scope.PostOpSummaryParentObj.PrescriptionDetails = [];
                    }

                    $scope.PostOpSummaryParentObj.ReviewDoctorId = resp[1].data.PostOP[0].ReviewDoctorId != null ? resp[1].data.PostOP[0].ReviewDoctorId : "";
                    $scope.PostOpSummaryParentObj.ReviewNurseId = resp[1].data.PostOP[0].ReviewNurseId != null ? resp[1].data.PostOP[0].ReviewNurseId : "";
                    $scope.PostOpSummaryParentObj.ReviewAnesthetistId = resp[1].data.PostOP[0].ReviewAnesthetistId != null ? resp[1].data.PostOP[0].ReviewAnesthetistId : "";

                    if ($scope.PostOpSummaryParentObj.ReviewDoctorId != 0 || $scope.PostOpSummaryParentObj.ReviewDoctorId != null) {
                        var doctorlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpSummaryParentObj.ReviewDoctorId });
                    }
                    doctorlist = doctorlist || [];
                    if (doctorlist.length > 0) {
                        $scope.PostOpSummaryParentObj.DoctorName = angular.copy(doctorlist[0].FullName);
                    }

                    if ($scope.PostOpSummaryParentObj.ReviewAnesthetistId != 0 || $scope.PostOpSummaryParentObj.ReviewAnesthetistId != null) {
                        var anesthlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpSummaryParentObj.ReviewAnesthetistId });
                    }
                    anesthlist = anesthlist || [];
                    if (anesthlist.length > 0) {
                        $scope.PostOpSummaryParentObj.AnesthesiaName = angular.copy(anesthlist[0].FullName);
                    }

                    if ($scope.PostOpSummaryParentObj.ReviewNurseId != 0 || $scope.PostOpSummaryParentObj.ReviewNurseId != null) {
                        var Nurslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpSummaryParentObj.ReviewNurseId });
                    }
                    Nurslist = Nurslist || [];
                    if (Nurslist.length > 0) {
                        $scope.PostOpSummaryParentObj.NurseName = angular.copy(Nurslist[0].FullName);
                    }

                } else {
                    $scope.PostOpSummaryParentObj.PatientASCPostOPId = 0;
                    //$scope.PostOpSummaryParentObj.Vitals = [];
                    $scope.PostOpSummaryParentObj.ReviewedBy = null;

                    $scope.PostOpSummaryParentObj.NurseChart.Checklists.PostOPNurseCheckListId = 0;
                    $scope.PostOpSummaryParentObj.NurseChart.Checklists.PatientReceived = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Checklists.AccompaniedBy = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Checklists.PainLevel = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Checklists.PainLevelRemarks = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Checklists.NourishmentProvider = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Checklists.BloodSugar = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Checklists.PostOpInstruction = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Checklists.ReceivedRoom = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Checklists.Patientallowed = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Checklists.Personalbelonging = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Checklists.Patientadvised = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Checklists.PatientClinic = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Checklists.Physicianexamine = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Checklists.Removedintact = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Checklists.Orientedtimes = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Checklists.OtherMental = "";

                    $scope.PostOpSummaryParentObj.NurseChart.Actions.PostOPNurseActionId = 0;
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.Speech = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.Vision = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.Pain = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.ConsciousLevel = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.Fur = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.IncisionlaDrainage = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.Nausea = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.IngestedFood = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.Referred = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.Relationship = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.Exit = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.Instruction = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.Prescription = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.LensCard = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.Surveillance = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.Bandage = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.Advancediet = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.Discharge = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.Administer = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.Tylenol = "";
                    $scope.PostOpSummaryParentObj.NurseChart.Actions.Review = "";

                    $scope.PostOpSummaryParentObj.Intake =  "";
                    $scope.PostOpSummaryParentObj.Output = "";
                    $scope.PostOpSummaryParentObj.EBL =  "";
                    $scope.PostOpSummaryParentObj.InTime = "";
                    $scope.PostOpSummaryParentObj.OutTime = "";

                    $scope.PostOpSummaryParentObj.SurgeonObj.InvestigationsList = [];
                    $scope.PostOpSummaryParentObj.SurgeonObj.MedicationsList = [];
                }
                

                if (resp[1].data.PostOpDischarge.length > 0) {

                    //$scope.DischargeParentSummaryObj = angular.copy($scope.GetDischargeParentSummaryObj());

                    //$scope.DischargeParentSummaryObj.PostOpDiagnosis = angular.copy(resp[1].data.PostOpDischarge[0].PostOPDiagnosis);
                    $scope.DischargeParentSummaryObj.Prescriptions = angular.copy(resp[1].data.PostOpDischarge[0].Prescription);
                    $scope.DischargeParentSummaryObj.ExaminationNotes = angular.copy(resp[1].data.PostOpDischarge[0].Findings);
                    $scope.DischargeParentSummaryObj.MedicineOrdersInstructions = angular.copy(resp[1].data.PostOP[0].MedicineOrdersInstructions);

                    if (resp[1].data.PostOpDischarge.length > 0) {

                        $scope.PostopDischargeDetails = angular.copy(resp[1].data.PostOpDischarge[0]);
                        $scope.DischargeParentSummaryObj.DischargeChartStatus = $scope.PostopDischargeDetails.DischargeChartStatus;

                        let surgeriesArray = [];
                        angular.forEach($scope.cacheStorageItem.SurgeryList, function (item) {
                            surgeriesArray.push(item.SurgeryName);
                        });

                        let operativeProcedure;
                        if (surgeriesArray.length > 0) {
                            operativeProcedure = surgeriesArray.join(",");
                        } else {
                            operativeProcedure = "";
                        }

                        $scope.DischargeParentSummaryObj.PatientASCPostOPId = $scope.PostopDischargeDetails.PatientASCPostOPId || null;

                        $scope.DischargeParentSummaryObj.FollowUpDate1 = $filter('date')($scope.PostopDischargeDetails.FollowUpDate1, "MM-dd-yyyy") || "";
                        $scope.DischargeParentSummaryObj.FollowUpDate2 = $filter('date')($scope.PostopDischargeDetails.FollowUpDate2, "MM-dd-yyyy") || "";
                        $scope.DischargeParentSummaryObj.FollowUpDate3 = $filter('date')($scope.PostopDischargeDetails.FollowUpDate3, "MM-dd-yyyy") || "";

                        $scope.DischargeParentSummaryObj.DischargeReviewedBy = $scope.PostopDischargeDetails.DischargeReviewedBy || ""; 
                        if ($scope.DischargeParentSummaryObj.DischargeReviewedBy != 0 || $scope.DischargeParentSummaryObj.DischargeReviewedBy != null) {
                            var TempFilter = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.DischargeParentSummaryObj.DischargeReviewedBy }, true);
                            if (TempFilter.length > 0) {
                                $scope.DischargeParentSummaryObj.DischargeReviewedByName = angular.copy(TempFilter[0].FullName);
                            }
                            else {
                                $scope.DischargeParentSummaryObj.DischargeReviewedByName = '';
                            }
                        }
                        $scope.DischargeParentSummaryObj.FollowUpInstructions = $scope.PostopDischargeDetails.FollowUpInstructions || "";
                        $scope.DischargeParentSummaryObj.CoManagementInstruction = $scope.PostopDischargeDetails.CoManagementInstruction || "";
                        $scope.DischargeParentSummaryObj.MedicationInstruction = $scope.PostopDischargeDetails.MedicationInstruction || "";
                        $scope.DischargeParentSummaryObj.DischargeInstruction = $scope.PostopDischargeDetails.DischargeInstruction || "";
                        $scope.DischargeParentSummaryObj.PatientConditionInstruction = $scope.PostopDischargeDetails.PatientConditionInstruction || "";
                        $scope.DischargeParentSummaryObj.ProceduralInstruction = $scope.PostopDischargeDetails.ProceduralInstruction || "";
                        $scope.DischargeParentSummaryObj.ExaminationNotes = $scope.PostopDischargeDetails.ExaminationNotes || "";

                        $scope.DischargeParentSummaryObj.PatientConditionInstruction = $scope.DischargeParentSummaryObj.PatientConditionInstruction.replace(/\n/g, '<br>');
                        $scope.DischargeParentSummaryObj.DischargeInstruction = $scope.DischargeParentSummaryObj.DischargeInstruction.replace(/\n/g, '<br>');
                        $scope.DischargeParentSummaryObj.CoManagementInstruction = $scope.DischargeParentSummaryObj.CoManagementInstruction.replace(/\n/g, '<br>');
                        $scope.DischargeParentSummaryObj.ExaminationNotes = $scope.DischargeParentSummaryObj.ExaminationNotes.replace(/\n/g, '<br>');
                        $scope.DischargeParentSummaryObj.FollowUpInstructions = $scope.DischargeParentSummaryObj.FollowUpInstructions.replace(/\n/g, '<br>');
                    } else {
                        $scope.DischargeParentSummaryObj.DischargeReviewedBy = null;
                        $scope.DischargeParentSummaryObj.FollowUpInstructions = "";
                        $scope.DischargeParentSummaryObj.CoManagementInstruction = "";
                        $scope.DischargeParentSummaryObj.MedicationInstruction = "";
                        $scope.DischargeParentSummaryObj.DischargeInstruction = "";
                        $scope.DischargeParentSummaryObj.PatientConditionInstruction = "";
                        $scope.DischargeParentSummaryObj.ProceduralInstruction = "";
                        $scope.DischargeParentSummaryObj.FollowUpDate1 = "";
                        $scope.DischargeParentSummaryObj.FollowUpDate2 = "";
                        $scope.DischargeParentSummaryObj.FollowUpDate3 = "";
                        $scope.DischargeParentSummaryObj.FollowUpDate2Ind = false;
                        $scope.DischargeParentSummaryObj.FollowUpDate3Ind = false;
                    }
                }

                if (resp[1].data.AdmitDetails.length > 0) {
                    let respObj = resp[1].data.AdmitDetails[0];
                    if (respObj.CheckLists.length > 0) {
                        $scope.AdmissionSummaryObj.OrgASCChecklist = angular.copy(respObj.CheckLists);
                    } else {
                        $scope.AdmissionSummaryObj.OrgASCChecklist = [];
                    }

                    $scope.AdmissionSummaryObj.InvestigationsList = angular.copy(resp[1].data.PreAdmInvestigationList);
                    $scope.AdmissionSummaryObj.Prescriptions = angular.copy(resp[1].data.PreAdmPrescriptionList);

                    $scope.AdmissionSummaryObj.RecievedForSurgery = angular.copy(respObj.RecievedForSurgery);
                    $scope.AdmissionSummaryObj.RecievedForSurgeryNotes = angular.copy(respObj.RecievedForSurgeryNotes);
                    $scope.AdmissionSummaryObj.AccompainedBy = angular.copy(respObj.AccompainedBy);
                    $scope.AdmissionSummaryObj.AccompainedByNotes = angular.copy(respObj.AccompainedByNotes);
                    $scope.AdmissionSummaryObj.PainStatus = angular.copy(respObj.PainStatus);
                    $scope.AdmissionSummaryObj.Painlevel = angular.copy(respObj.Painlevel);
                    $scope.AdmissionSummaryObj.PainlevelNotes = angular.copy(respObj.PainlevelNotes);
                    $scope.AdmissionSummaryObj.PTERefers = angular.copy(respObj.PTERefers);
                    $scope.AdmissionSummaryObj.PTEReferNotes = angular.copy(respObj.PTEReferNotes);
                    $scope.AdmissionSummaryObj.ObservedBehaviour = angular.copy(respObj.ObservedBehavior);
                    $scope.AdmissionSummaryObj.ObservedBehaviourNotes = angular.copy(respObj.ObservedBehaviorNotes);
                    $scope.AdmissionSummaryObj.LevelOfConsciousness = angular.copy(respObj.LevelOfConsciousness);
                    $scope.AdmissionSummaryObj.LevelOfConsciousnessNotes = angular.copy(respObj.LevelOfConsciousnessNotes);
                    $scope.AdmissionSummaryObj.PatientDestination = angular.copy(respObj.PatientDestination);
                    $scope.AdmissionSummaryObj.PatientDestinationNotes = angular.copy(respObj.PatientDestinationNotes);
                    $scope.AdmissionSummaryObj.PatientTransfferedIn = angular.copy(respObj.PatientTransfferedIn);
                    $scope.AdmissionSummaryObj.PatientTransfferedNotes = angular.copy(respObj.PatientTransfferedNotes);
                    $scope.AdmissionSummaryObj.PreOperativeOrientationOffered = angular.copy(respObj.PreOperativeOrientationOffered);
                    $scope.AdmissionSummaryObj.PreOperativeOrientationOfferedNotes = angular.copy(respObj.PreOperativeOrientationOfferedNotes);

                    $scope.AdmissionSummaryObj.PhoneNumber = angular.copy(respObj.MobileNo);
                    $scope.AdmissionSummaryObj.PhoneNumberCountryCode = angular.copy(respObj.CountryCode);
                    $scope.AdmissionSummaryObj.AlternatePhoneNumber = angular.copy(respObj.AlternateMobileNo);
                    $scope.AdmissionSummaryObj.AlternatePhoneNumberCountryCode = angular.copy(respObj.AlternateCountryCode);
                    $scope.AdmissionSummaryObj.AdmissionRemarks = respObj.AdmissionRemarks || "";

                    if (respObj.Documents.length > 0) {
                        $scope.AdmissionSummaryObj.SaveTempImagesArray = respObj.Documents || [];
                    }
                    else {
                        $scope.AdmissionSummaryObj.SaveTempImagesArray = [];
                    }

                    respObj.ReviewedBy = respObj.ReviewedBy || null;
                    if (respObj.ReviewedBy != null) {
                        var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == respObj.ReviewedBy });
                        if (ReviewedByArraylist.length > 0) {
                            $scope.AdmissionSummaryObj.ReviewedName = angular.copy(ReviewedByArraylist[0].FullName) || "";
                        }
                    }
                }
            }

            if (resp[2].data.status == "Success") {
                $scope.PreOpSummaryParentObj.PreOpCallDetails = resp[2].data.rows || [];
                if ($scope.PreOpSummaryParentObj.PreOpCallDetails.length > 0) {

                    angular.forEach($scope.PreOpSummaryParentObj.PreOpCallDetails, function (hitem) {
                        let currentDate = moment().format("YYYY-MM-DD");
                        if (hitem.ContactStartTime !== "") {
                            let edate = currentDate + " " + hitem.ContactStartTime;
                            hitem.ContactStartTime = moment(edate, "YYYY-MM-DD HH:mm").format("hh:mm a");
                        }
                        if (hitem.DropsStartTime !== "") {
                            let edate = currentDate + " " + hitem.DropsStartTime;
                            hitem.DropsStartTime = moment(edate, "YYYY-MM-DD HH:mm").format("hh:mm a");
                        }
                        //let ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                        //if (hitem.ContactStartTime != "") {
                        //    let edate = ndate + " " + hitem.ContactStartTime;
                        //    hitem.ContactStartTime = $filter('date')(new Date(edate), "hh:mm a");
                        //}

                        //if (hitem.DropsStartTime != '') {
                        //    let edate = ndate + " " + hitem.DropsStartTime;
                        //    hitem.DropsStartTime = $filter('date')(new Date(edate), "hh:mm a");
                        //}
                    });
                    $scope.PreOpSummaryParentObj.IsPreOpCallSummaryShow = true;
                }
            }

            $scope.PerformedByArray = [];
            $scope.ReviewedByArray = [];
            $scope.AllNurseList = [];
            $scope.allUserList = $scope.allUserList || [];
            if ($scope.allUserList.length > 0) {
                $scope.PerformedByArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 8 || x.RoleId == 30 || x.RoleId == 43);
                $scope.ReviewedByArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 8 || x.RoleId == 30 || x.RoleId == 43);
                $scope.AnesthetistArray = $scope.allUserList.filter((x) => x.RoleId == 30 || x.RoleId == 8);
            }

            $scope.AllNurseList = angular.copy($scope.allUserList);
            $scope.AllNurseList = _.uniq($scope.AllNurseList, false, function (p) { return p.DoctorID; });
            $scope.AllNurseList = $filter("filter")($scope.AllNurseList, function (item) {
                return item.RoleId === 8;
            });

            angular.forEach($scope.cacheStorageItem.SurgeryList, function (item) {

                if ($scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId === item.PatientSurgeryId) {
                    $scope.SurgeryDiagnosisObj.OperativeProcedure = item.SurgeryName;
                    $scope.SurgeryDiagnosisObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
                    $scope.SurgeryDiagnosisObj.OrganId = item.OrganId;

                    item.DiagnosisList = item.DiagnosisList || [];
                    if (item.DiagnosisList.length > 0) {
                        $scope.SurgeryDiagnosisObj.Diagnosis = item.DiagnosisList[0].DiagnosisName;
                        $scope.SurgeryDiagnosisObj.OrganizationDiagnosisId = item.DiagnosisList[0].OrganizationDiagnosisId;
                        $scope.SurgeryDiagnosisObj.DiagnosisId = item.DiagnosisList[0].DiagnosisId;
                    }

                    $scope.SurgeryDiagnosisObj.Diagnosis2 = $scope.SurgeryDiagnosisObj.Diagnosis2 || '';
                    if (item.DiagnosisList.length > 1) {
                        $scope.SurgeryDiagnosisObj.Diagnosis2 = item.DiagnosisList[1].DiagnosisName;
                    }
                }

                item.DoctorId = item.DoctorId || '';
                if (item.DoctorId != '') {
                    let temparray3 = $filter('filter')($scope.allUserList, { 'DoctorID': item.DoctorId }, true);
                    if (temparray3.length > 0) {
                        $scope.SurgeryDiagnosisObj.Surgeon = temparray3[0].FullName;
                    } else {
                        $scope.SurgeryDiagnosisObj.Surgeon = "";
                    }
                }
            });

            if ($scope.PreOpSummaryParentObj.PatientASCPreOPId !== 0 && !$scope.PreOpSummaryParentObj.IsEdit) {
                $scope.PreOpSummaryParentObj.IsShow = false;
                $scope.PreOpSummaryParentObj.IsShowPreOpSummaryViewInd = true;
            }
            else if ($scope.PreOpSummaryParentObj.PatientASCPreOPId == 0) {
                $scope.PreOpSummaryParentObj.IsShow = true;
                $scope.PreOpSummaryParentObj.IsShowPreOpSummaryViewInd = false;
            }
            else if ($scope.PreOpSummaryParentObj.PatientASCPreOPId != 0 && $scope.PreOpSummaryParentObj.IsEdit) {
                $scope.PreOpSummaryParentObj.IsShow = true;
                $scope.PreOpSummaryParentObj.IsShowPreOpSummaryViewInd = false;
            }

            if ($scope.PreOpSummaryParentObj.SurgeryList.length > 0) {
                angular.forEach($scope.PreOpSummaryParentObj.SurgeryList, function (item) {
                    var surgerylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.SurgeonId }, true);
                    if (surgerylist.length > 0) {
                        $scope.SurgeryDiagnosisObj.Surgeon = angular.copy(surgerylist[0].FullName);
                        $scope.SurgeryDiagnosisObj.SurgeonID = angular.copy(item.SurgeonId);
                    } else {
                        $scope.SurgeryDiagnosisObj.Surgeon = $scope.SurgeryDiagnosisObj.Surgeon || '';
                    }

                    var Anesthetistlist = $filter("filter")($scope.AnesthetistArray, function (kitem) { return kitem.DoctorID == item.AnesthetistId }, true);
                    if (Anesthetistlist.length > 0) {
                        $scope.SurgeryDiagnosisObj.Anesthetist = angular.copy(Anesthetistlist[0].FullName);
                        $scope.SurgeryDiagnosisObj.AnesthetistID = angular.copy(item.AnesthetistId);
                    } else {
                        $scope.SurgeryDiagnosisObj.Anesthetist = $scope.SurgeryDiagnosisObj.Anesthetist || '';
                    }

                    var Nurselist = $filter("filter")($scope.AllNurseList, function (kitem) { return kitem.DoctorID == item.NurseId }, true);
                    if (Nurselist.length > 0) {
                        $scope.SurgeryDiagnosisObj.Nurse = angular.copy(Nurselist[0].FullName);
                        $scope.SurgeryDiagnosisObj.NurseID = angular.copy(item.NurseId);
                    } else {
                        $scope.SurgeryDiagnosisObj.Nurse = $scope.SurgeryDiagnosisObj.Nurse || '';
                    }
                });
            }

            if ($scope.TabObj.SelectedTab === 9) {
                var element = document.getElementById('summarymain0');

                if (element) {
                    element.scrollIntoView(false);
                }
            } else if ($scope.TabObj.SelectedTab === 2) {
                var element = document.getElementById('summarymain1');

                if (element) {
                    element.scrollIntoView(false);
                }
            } else if ($scope.TabObj.SelectedTab === 3) {
                var element = document.getElementById('summarymain2');

                if (element) {
                    element.scrollIntoView(false);
                }
            } else if ($scope.TabObj.SelectedTab === 4) {
                var element = document.getElementById('summarymain3');

                if (element) {
                    element.scrollIntoView(false);
                }
            } else if ($scope.TabObj.SelectedTab === 11) {
                var element = document.getElementById('summarymain4');

                if (element) {
                    element.scrollIntoView(false);
                }
            } else if ($scope.TabObj.SelectedTab === 13) {
                var element = document.getElementById('summarymain5');

                if (element) {
                    element.scrollIntoView(false);
                }
            }
        });
    }

    $scope.GetpatientAscSummaryDetails();

    $scope.ChangeAscSummaryTab = function (TabId) {
        if (TabId != 0) {
            $scope.AscSummaryTabObj.SelectedTab = TabId;
        } else {
            $scope.AscSummaryTabObj.SelectedTab = 1;
        }
    }

    $scope.NavFromSumary = function (val) {
       $scope.$emit("SummaryNavigationEvent", val);
    }

    $scope.UnsignFromSumary = function (val) {
        let screen = "";
        if (val == 1) {
            screen = "PreOp";
        }

        if (val == 2) {
            screen = "IntraOp";
        }

        if (val == 3) {
            screen = "PostOp";
        }

        if (val == 4) {
            screen = "Discharge";
        }

        if (val == 5) {
            screen = "OperativeNotes";
        }
      

        let obj = {
            "Screen": screen,
            "Type": "Unsign",
            "allUserList": $scope.allUserList||[],

        };

        let signmodalInstance = $uibModal.open({
            "templateUrl": "templates/consultation/SignOffPasswordRequired.html",
            "controller": "UsPasswordAuthenticationPopupCtrl",
            "size": "md",
            //"windowClass": "appointment-full-popup",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "obj": function () { return obj; }
            }
        });
        signmodalInstance.result.then(function (resp) {
            $scope.$emit("SummaryNavigationEvent", val);
        }, function (data) {

        });
    }

    $scope.OverallsignFromSumary = function (val) {
        let screen = "";
        screen = "ASCOverallSignoff";

        let obj = {
            "Screen": screen,
            "Type": "SignOff",
            "allUserList": $scope.allUserList||[],

        };

        let signmodalInstance = $uibModal.open({
            "templateUrl": "templates/consultation/SignOffPasswordRequired.html",
            "controller": "UsPasswordAuthenticationPopupCtrl",
            "size": "md",
            //"windowClass": "appointment-full-popup",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "obj": function () { return obj; }
            }
        });
        signmodalInstance.result.then(function (resp) {
            $scope.GetpatientAscSummaryDetails();
        }, function (data) {

        });
    }
    $scope.Surgeondoctor = '';
    $scope.Anesthetist = '';
    $scope.PreOpDiagnosis = '';
    $scope.SurgeryName = '';
    if ($scope.cacheStorageItem.SurgeryList.length > 0) {
        angular.forEach($scope.cacheStorageItem.SurgeryList, function (sitem) {
            var Surgeonlist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == sitem.SurgeonId });
            if (Surgeonlist.length > 0) {
                $scope.Surgeondoctor = Surgeonlist[0].FullName;
            }
            var Surgeonlist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == sitem.AnesthetistId });
            if (Surgeonlist.length > 0) {
                $scope.Anesthetist = Surgeonlist[0].FullName;
            }
            if (sitem.SurgeryName !== '' && sitem.SurgeryName !== null) {
                $scope.SurgeryName = sitem.SurgeryName;
            }
            if (sitem.DiagnosisList.length > 0) {
                angular.forEach(sitem.DiagnosisList, function (sitem) {
                    if ($scope.PreOpDiagnosis !== '') {
                        $scope.PreOpDiagnosis = $scope.PreOpDiagnosis + ' , ' + sitem.DiagnosisName;
                    }
                    if ($scope.PreOpDiagnosis == '') {
                        $scope.PreOpDiagnosis = sitem.DiagnosisName;
                    }
                });
            }
        });
    } else {
        $scope.Surgeondoctor = '';
        $scope.Anesthetist = '';
        $scope.PreOpDiagnosis = '';
        $scope.SurgeryName = '';
    }

    $scope.OperativeNotesPrint = function () {
        let CreatedByName = "";
        if (doctorinfo.doctordata.User.length > 0) {
            CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
        }
        var Object = {
            'SurgeryDate': $scope.SurgeryDiagnosisObj.SurgeryDate || '',
            'OperativeProcedure': $scope.SurgeryDiagnosisObj.OperativeProcedure || '',
            'OrganId': $scope.SurgeryDiagnosisObj.OrganId || '',
            'Surgeon': $scope.Surgeondoctor || '',
            "Anesthetist": $scope.Anesthetist || '',
            "Diagnosis": $scope.PreOpDiagnosis || '',
            "CreatedBy": CreatedByName,
            "ConsultationDate": $scope.cacheStorageItem.AppointmentDate || '',
            "Name": $scope.cacheStorageItem.PatientName || '',
            "Age": $scope.cacheStorageItem.Age || '',
            "Gender": $scope.cacheStorageItem.Gender || '',
            "PatientDOB": $scope.cacheStorageItem.PatientDOB || '',
            "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
            "PatientOldMrno": $scope.cacheStorageItem.PatientOldMrno || '',
            "PostOpDiagnosisArray": $scope.DischargeParentSummaryObj.Diagnosis || [], /*PostOpDiagnosis*/
            "LensUsedArray": $scope.ImplantsDetailsArray || [],
            "ProcedureNotes": $scope.OperativeParentSummaryObj.ProcedureDetails || '',
            "ComplicationsNotes": $scope.OperativeParentSummaryObj.Complications  || '',
            "Findings": $scope.OperativeParentSummaryObj.Findings  || '',
            "SurgeonOperativeNotes": $scope.OperativeParentSummaryObj.SurgeonOperativeNotes  || '',
            "VisitType": $scope.cacheStorageItem.AppointmentType  || '',
            "VisitReason": $scope.cacheStorageItem.VisitReason || '',
        }
        USPrintService.GenerateASCOperativeNotesPrint(Object);
    }
    $scope.DischargeSummaryPrint = function () {
        let CreatedByName = "";
        if (doctorinfo.doctordata.User.length > 0) {
            CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
        }
        var Medications = [];
        if ($scope.DischargeParentSummaryObj.Prescriptions.length > 0) {
            angular.forEach($scope.DischargeParentSummaryObj.Prescriptions, function (item) {
                if (item.PrescriptionDetails.length > 0) {
                    Medications.push(item);
                }
            });
        } else {
            Medications = [];
        }
        var Object = {
            'SurgeryDate': $scope.SurgeryDiagnosisObj.SurgeryDate || '',
            'OperativeProcedure': $scope.SurgeryDiagnosisObj.OperativeProcedure || '',
            'OrganId': $scope.SurgeryDiagnosisObj.OrganId || '',
            'Surgeon': $scope.Surgeondoctor || '',
            "Anesthetist": $scope.Anesthetist || '',
            "Diagnosis": $scope.PreOpDiagnosis || '',
            "CreatedBy": CreatedByName,
            "ConsultationDate": $scope.cacheStorageItem.AppointmentDate || '',
            "Name": $scope.cacheStorageItem.PatientName || '',
            "Age": $scope.cacheStorageItem.Age || '',
            "Gender": $scope.cacheStorageItem.Gender || '',
            "PatientDOB": $scope.cacheStorageItem.PatientDOB || '',
            "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
            "PatientOldMrno": $scope.cacheStorageItem.PatientOldMrno || '',
            "PostOpDiagnosisArray": $scope.DischargeParentSummaryObj.Diagnosis || [],/* PostOpDiagnosis*/
            "VisitType": $scope.cacheStorageItem.AppointmentType || '',
            "VisitReason": $scope.cacheStorageItem.VisitReason || '',
            "PatientCondition": $scope.DischargeParentSummaryObj.PatientConditionInstruction || '',
            "PostOpInstructions": $scope.DischargeParentSummaryObj.DischargeInstruction || '',
            "MedicationsArray": Medications || [],
            "MedicationInstructions": $scope.DischargeParentSummaryObj.MedicineOrdersInstructions || '',
            "ExternalCoManager": $scope.SurgeryDiagnosisObj.ExternalCoManager || '',
            "InternalCoManager": $scope.SurgeryDiagnosisObj.InternalCoManager || '',
            "CoManagementInstruction": $scope.DischargeParentSummaryObj.CoManagementInstruction || '',
            "FollowUpDate1": $scope.DischargeParentSummaryObj.FollowUpDate1 || '',
            "FollowUpDate2": $scope.DischargeParentSummaryObj.FollowUpDate2 || '',
            "FollowUpDate3": $scope.DischargeParentSummaryObj.FollowUpDate3 || '',
            "FollowUpInstructions": $scope.DischargeParentSummaryObj.FollowUpInstructions || '',
            "DischargeReviewedByName": $scope.DischargeParentSummaryObj.DischargeReviewedByName || '',
        }
        $scope.selectedPatientData;
        USPrintService.GenerateASCDischargeSummaryPrint(Object);
    }

    $scope.Ascsummarymoredata = {
        templateUrl: 'templates/uibpopups/Ascsummarymoredatapopover.html',
    }

    $scope.ShowFilesPopup = function () {
        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/FilesPopUp.html",
            "backdrop": "static",
            "keyboard": false,
            "windowClass": "modal__popup--1 bottom-to-top-modal in",
            //"windowClass": "offcanves-right",
            "scope": $scope,
            "controller": function ($scope, $uibModal, $uibModalInstance) {
                $scope.closeuibpopup = function () {
                    $uibModalInstance.dismiss();
                };
            },
        });
    };
    $scope.AdmitPrint = function () {
        let CreatedByName = "";
        if (doctorinfo.doctordata.User.length > 0) {
            CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
        }
        $scope.AdmitPatientObj = {
            'RecievedForSurgery': $scope.AdmissionSummaryObj.RecievedForSurgery ||'',
            'RecievedForSurgeryNotes': $scope.AdmissionSummaryObj.RecievedForSurgeryNotes ||'',
            'AccompainedBy': $scope.AdmissionSummaryObj.AccompainedBy ||'',
            'AccompainedByNotes': $scope.AdmissionSummaryObj.AccompainedByNotes ||'',
            'PreOperativeOrientationOffered': $scope.AdmissionSummaryObj.PreOperativeOrientationOffered ||'',
            'PreOperativeOrientationOfferedNotes': $scope.AdmissionSummaryObj.PreOperativeOrientationOfferedNotes ||'',
            'ObservedBehavior': $scope.AdmissionSummaryObj.ObservedBehavior ||'',
            'ObservedBehaviorNotes': $scope.AdmissionSummaryObj.ObservedBehaviorNotes ||'',
            'LevelOfConsciousness': $scope.AdmissionSummaryObj.LevelOfConsciousness ||'',
            'LevelOfConsciousnessNotes': $scope.AdmissionSummaryObj.LevelOfConsciousnessNotes ||'',
            'PatientTransfferedIn': $scope.AdmissionSummaryObj.PatientTransfferedIn ||'',
            'PatientTransfferedNotes': $scope.AdmissionSummaryObj.PatientTransfferedNotes ||'',
            'PatientDestination': $scope.AdmissionSummaryObj.PatientDestination ||'',
            'PatientDestinationNotes': $scope.AdmissionSummaryObj.PatientDestinationNotes ||'',
            'PTERefers': $scope.AdmissionSummaryObj.PTERefers ||'',
            'PTEReferNotes': $scope.AdmissionSummaryObj.PTEReferNotes ||'',
        }
        var PreSurgeries = [];
        if ($scope.AdmissionSummaryObj.Prescriptions.length > 0) {
            angular.forEach($scope.AdmissionSummaryObj.Prescriptions, function (item) {
                if (item.PrescriptionDetails.length > 0) {
                    PreSurgeries.push(item);
                }
            });
        } else {
            PreSurgeries = [];
        }
        var NurseChecklist = [];
        var MedicationsChecklist = [];
        if ($scope.AdmissionSummaryObj.OrgASCChecklist.length > 0) {
            var NurseFilter = $filter("filter")($scope.AdmissionSummaryObj.OrgASCChecklist, { "CheckListCategoryId": 1 }, true);
            var MedicationsFilter = $filter("filter")($scope.AdmissionSummaryObj.OrgASCChecklist, { "CheckListCategoryId": 5 }, true);
            if (NurseFilter.length > 0) {
                NurseChecklist = NurseFilter || [];
            }
            if (MedicationsFilter.length > 0) {
                MedicationsChecklist = MedicationsFilter || [];
            }
        } else {
            NurseChecklist = [];
            MedicationsChecklist = [];
        }

        var Object = {
            "CreatedBy": CreatedByName,
            'Surgeon': $scope.Surgeondoctor || '',
            "Anesthetist": $scope.Anesthetist || '',
            "Diagnosis": $scope.PreOpDiagnosis || '',
            "Name": $scope.cacheStorageItem.PatientName || '',
            "Age": $scope.cacheStorageItem.Age || '',
            "Gender": $scope.cacheStorageItem.Gender || '',
            "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
            "PatientOldMrno": $scope.cacheStorageItem.PatientOldMrno || '',
            "VisitType": $scope.cacheStorageItem.AppointmentType || '',
            "VisitReason": $scope.cacheStorageItem.VisitReason || '',
            "SurgeryDate": $scope.SurgeryDiagnosisObj.SurgeryDate || '',
            "SurgeryName": $scope.SurgeryName || '',
            "PreSurgeryMedications": PreSurgeries || [],
            "LabInvestigationsList": $scope.AdmissionSummaryObj.InvestigationsList || [],
            "AllergyItems": $scope.AscSummaryParentObj.AllergyItems || [],
            "SystemicHistory": $scope.AscSummaryParentObj.SystemicHistory || [],
            "SurgicalHistory": $scope.AscSummaryParentObj.SurgicalHistory || [],
            "CurrentSystemicMedicationsHistory": $scope.AscSummaryParentObj.CurrentSystemicMedicationsHistory || [],
            "CurrentEyeMedications": $scope.AscSummaryParentObj.CurrentEyeMedications || [],
            "NurseChecklist": NurseChecklist || [],
            "MedicationsChecklist": MedicationsChecklist || [],
            "PatientObject": $scope.AdmitPatientObj || '',
            "AdmissionRemarks": $scope.AdmissionSummaryObj.AdmissionRemarks || '',
            "ReviewedByName": $scope.AdmissionSummaryObj.ReviewedName || '',
        }
        USPrintService.GenerateASCAdmitPrint(Object);
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
    $scope.IntraOpPrint = function () {
        let CreatedByName = "";
        if (doctorinfo.doctordata.User.length > 0) {
            CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
        }
        $scope.NurseActions = {
            'Levelofconsciousness': $scope.IntraOpSummaryParentObj.NurseActionobj.Levelofconsciousness || '',
            'PatientPosition': $scope.IntraOpSummaryParentObj.NurseActionobj.PatientPosition || '',
            'ArmsToTheBody': $scope.IntraOpSummaryParentObj.NurseActionobj.SafetyDevicePosition.ArmsToTheBody || '',
            'Strap': $scope.IntraOpSummaryParentObj.NurseActionobj.SafetyDevicePosition.Strap || '',
            'AnotherRailing': $scope.IntraOpSummaryParentObj.NurseActionobj.SafetyDevicePosition.AnotherRailing || '',
            'SkinPreparation': $scope.IntraOpSummaryParentObj.NurseActionobj.SkinPreparation || '',
            'Sterilewater': $scope.IntraOpSummaryParentObj.NurseActionobj.Sterilewater || '',
            'Alcohol': $scope.IntraOpSummaryParentObj.NurseActionobj.Alcohol || '',
            'NurseActionOrganId': $scope.IntraOpSummaryParentObj.NurseActionobj.NurseActionOrganId || '',
            'NurseActionArea': $scope.IntraOpSummaryParentObj.NurseActionobj.NurseActionArea || '',
            'EspecimenLab': $scope.IntraOpSummaryParentObj.NurseActionobj.EspecimenLab || '',
            'CropHour': $scope.IntraOpSummaryParentObj.NurseActionobj.CropHour || '',
        };
        $scope.SurgeryStaff = {
            'SurgeonName': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeonName || '',
            'CoSurgeonName': $scope.IntraOpSummaryParentObj.NurseActionobj.CoSurgeonName || '',
            'TechnicianName': $scope.IntraOpSummaryParentObj.NurseActionobj.TechnicianName || '',
            'AnesthesistName': $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesistName || '',
            'ReliefName': $scope.IntraOpSummaryParentObj.NurseActionobj.ReliefName || '',
            'NurseName': $scope.IntraOpSummaryParentObj.NurseActionobj.NurseName || '',
            'SupportingStaffName': $scope.IntraOpSummaryParentObj.NurseActionobj.SupportingStaffName || '',
        };
        $scope.SurgeryTimes = {
            'SurgeryRoomNo': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryRoomNo || '',
            'HallEntranceStartTime': $scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceStartTime || '',
            'HallEntranceEndTime': $scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceEndTime || '',
            'AnesthesiaStartTime': $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaStartTime || '',
            'AnesthesiaEndTime': $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaEndTime || '',
            'SurgeryStartTime': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryStartTime || '',
            'SurgeryEndTime': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryEndTime || '',
        };
        $scope.SurgicalCount = {
            'SurgicalFirstNeedles': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstNeedles || '',
            'SurgicalFirstBlades': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstBlades || '',
            'SurgicalFirstOthers': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstOthers || '',
            'SurgicalFirstVerifiedByName': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstVerifiedByName || '',
            'SurgicalFirstTime': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstTime || '',
            'SurgicalSecondNeedles': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondNeedles || '',
            'SurgicalSecondBlades': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondBlades || '',
            'SurgicalSecondOthers': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondOthers || '',
            'SurgicalSecondVerifiedByName': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondVerifiedByName || '',
            'SurgicalSecondTime': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondTime || '',
            'SurgicalFinalNeedles': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalNeedles || '',
            'SurgicalFinalBlades': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalBlades || '',
            'SurgicalFinalOthers': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalOthers || '',
            'SurgicalFinalVerifiedByName': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalVerifiedByName || '',
            'SurgicalFinalTime': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalTime || '',
        };
        $scope.ReviewedByobj = {
            'DoctorName': $scope.IntraOpSummaryParentObj.DoctorName || '',
            'NurseName': $scope.IntraOpSummaryParentObj.NurseName || '',
            'AnesthesiaName': $scope.IntraOpSummaryParentObj.AnesthesiaName || '',
            'TechnicianName': $scope.IntraOpSummaryParentObj.TechnicianName || '',
        };

        let nurselist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 5 }, true);
        let anticipationlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 6 }, true);
        let timeoutlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 7 }, true);
        let antibioticlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 8 }, true);
        let otherslist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 9 }, true);
        let identificationlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 10 }, true);
        let insertionlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 11 }, true);
        let preprocedurelist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 12 }, true);
        let patienthaslist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 13 }, true);
        let implantlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 14 }, true);
        let monitorslist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 15 }, true);
        let Anesthesiacheck = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 16 }, true);
        let pulseOximeter = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 17 }, true);

        let CauteraisationArray = $filter("filter")($scope.IntraOpSummaryParentObj.NurseActionobj.Cauteraisation, { "IsChecked": true }, true);
        if ($scope.IntraOpSummaryParentObj.Anesthetistobj !== '') {
            var base64Img = '';
            if ($scope.IntraOpSummaryParentObj.Anesthetistobj.S3URL !== '') {
                $scope.toDataURL($scope.IntraOpSummaryParentObj.Anesthetistobj.S3URL, function (dataURL) {
                    base64Img = dataURL;
                    $scope.IntraOpSummaryParentObj.Anesthetistobj.BaseURL = base64Img;
                });
            } else {
                $scope.IntraOpSummaryParentObj.Anesthetistobj.BaseURL = base64Img;
            }
        }
       
        $timeout(function () {
            var Object = {
                "CreatedBy": CreatedByName,
                'Surgeon': $scope.Surgeondoctor || '',
                "Anesthetist": $scope.Anesthetist || '',
                "Diagnosis": $scope.PreOpDiagnosis || '',
                "Name": $scope.cacheStorageItem.PatientName || '',
                "Age": $scope.cacheStorageItem.Age || '',
                "Gender": $scope.cacheStorageItem.Gender || '',
                "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
                "PatientOldMrno": $scope.cacheStorageItem.PatientOldMrno || '',
                "VisitType": $scope.cacheStorageItem.AppointmentType || '',
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "SurgeryDate": $scope.SurgeryDiagnosisObj.SurgeryDate || '',
                "SurgeryName": $scope.SurgeryName || '',
                "VitalsArray": $scope.IntraOpSummaryParentObj.Vitals || [],
                "AllergyItems": $scope.AscSummaryParentObj.AllergyItems || [],
                "SystemicHistory": $scope.AscSummaryParentObj.SystemicHistory || [],
                "SurgicalHistory": $scope.AscSummaryParentObj.SurgicalHistory || [],
                "CurrentSystemicMedicationsHistory": $scope.AscSummaryParentObj.CurrentSystemicMedicationsHistory || [],
                "CurrentEyeMedications": $scope.AscSummaryParentObj.CurrentEyeMedications || [],
                "nurselist": nurselist || [],
                "anticipationlist": anticipationlist || [],
                "timeoutlist": timeoutlist || [],
                "antibioticlist": antibioticlist || [],
                "otherslist": otherslist || [],
                "identificationlist": identificationlist || [],
                "insertionlist": insertionlist || [],
                "preprocedurelist": preprocedurelist || [],
                "patienthaslist": patienthaslist || [],
                "implantlist": implantlist || [],
                "monitorslist": monitorslist || [],
                "Anesthesiacheck": Anesthesiacheck || [],
                "pulseOximeter": pulseOximeter || [],
                "AnesthesiaTypelist": $scope.IntraOpSummaryParentObj.AnesthesiaTypelist || [],
                "AnesthesiaMedications": $scope.IntraOpSummaryParentObj.AnesthesiaMedications || [],
                "AnesthesiaMedicationsNotes": $scope.IntraOpSummaryParentObj.AnesthesiaMedicationsNotes || '',
                "IntraOpMedications": $scope.IntraOpSummaryParentObj.IntraOpMedications || [],
                "MedicationsNotes": $scope.IntraOpSummaryParentObj.MedicationsNotes || '',
                "Findings": $scope.IntraOpSummaryParentObj.Findings || '',
                "SurgeonOperativeNotes": $scope.IntraOpSummaryParentObj.SurgeonOperativeNotes || '',
                "SurgeonComplicationNotes": $scope.IntraOpSummaryParentObj.SurgeonComplicationNotes || '',
                "IntraOpDiagnosis": $scope.IntraOpSummaryParentObj.Diagnosis || [],
                "MedicationsDetails": $scope.IntraOpSummaryParentObj.PrescriptionDetails || [],
                "LabInvestigationsList": $scope.IntraOpSummaryParentObj.InvestigationsList || [],
                "ImplantsDetailsArray": $scope.ImplantsDetailsArray || [],
                "NurseActions": $scope.NurseActions || '',
                "SurgeryStaff": $scope.SurgeryStaff || '',
                "SurgeryTimes": $scope.SurgeryTimes || '',
                "SurgicalCount": $scope.SurgicalCount || '',
                "HydrationIV": $scope.IntraOpSummaryParentObj.NurseActionobj.HydrationIV || '',
                "DrainageOthers": $scope.IntraOpSummaryParentObj.NurseActionobj.DrainageOthers || '',
                "Cleansed": $scope.IntraOpSummaryParentObj.NurseActionobj.Cleansed || '',
                "Dirty": $scope.IntraOpSummaryParentObj.NurseActionobj.Dirty || '',
                "Contaminated": $scope.IntraOpSummaryParentObj.NurseActionobj.Contaminated || '',
                "CauteraisationOthers": $scope.IntraOpSummaryParentObj.NurseActionobj.CauteraisationOthers || '',
                "CauteraisationArray": CauteraisationArray || [],
                "ReviewedBy": $scope.ReviewedByobj || '',
                "TimeSlotsArray": $scope.IntraNewTimeSlots || [],
                "AnesthetistVitalsArray": $scope.IntraAnesthetistVitals || [],
                "BaseURL": $scope.IntraOpSummaryParentObj.Anesthetistobj.BaseURL || '',
            }
            USPrintService.GenerateASCIntraOpPrint(Object);
        }, 500);
        
    }
    $scope.IntraOpAnesthesiaActionsPrint = function () {
        let CreatedByName = "";
        if (doctorinfo.doctordata.User.length > 0) {
            CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
        }
        if ($scope.IntraOpSummaryParentObj.Anesthetistobj !== '') {
            var base64Img = '';
            if ($scope.IntraOpSummaryParentObj.Anesthetistobj.S3URL !== '') {
                $scope.toDataURL($scope.IntraOpSummaryParentObj.Anesthetistobj.S3URL, function (dataURL) {
                    base64Img = dataURL;
                    $scope.IntraOpSummaryParentObj.Anesthetistobj.BaseURL = base64Img;
                });
            } else {
                $scope.IntraOpSummaryParentObj.Anesthetistobj.BaseURL = base64Img;
            }
        }
        $timeout(function () {
        var Object = {
            "CreatedBy": CreatedByName,
            'Surgeon': $scope.Surgeondoctor || '',
            "Anesthetist": $scope.Anesthetist || '',
            "Diagnosis": $scope.PreOpDiagnosis || '',
            "Name": $scope.cacheStorageItem.PatientName || '',
            "Age": $scope.cacheStorageItem.Age || '',
            "Gender": $scope.cacheStorageItem.Gender || '',
            "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
            "PatientOldMrno": $scope.cacheStorageItem.PatientOldMrno || '',
            "VisitType": $scope.cacheStorageItem.AppointmentType || '',
            "VisitReason": $scope.cacheStorageItem.VisitReason || '',
            "SurgeryDate": $scope.SurgeryDiagnosisObj.SurgeryDate || '',
            "SurgeryName": $scope.SurgeryName || '',
            "TimeSlotsArray": $scope.IntraNewTimeSlots || [],
            "AnesthetistVitalsArray": $scope.IntraAnesthetistVitals || [],
            "BaseURL": $scope.IntraOpSummaryParentObj.Anesthetistobj.BaseURL || '',
            "AnesthesiaTypelist": $scope.IntraOpSummaryParentObj.AnesthesiaTypelist || [],
            "AnesthesiaMedications": $scope.IntraOpSummaryParentObj.AnesthesiaMedications || [],
            "AnesthesiaMedicationsNotes": $scope.IntraOpSummaryParentObj.AnesthesiaMedicationsNotes || '',
        }
            USPrintService.GenerateASCIntraOpAnesthesiaActionsPrint(Object);
        }, 500);
    }






























    $scope.PreopSummaryPrint = function () {
        let CreatedByName = "";
        if (doctorinfo.doctordata.User.length > 0) {
            CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
        }

        let GeneralList = $filter("filter")($scope.PreOpSummaryParentObj.OrgASCChecklist, { "CheckListCategoryId": 6 }, true) || [];
    
        var Object = {

            "CreatedBy": CreatedByName,
            'Surgeon': $scope.Surgeondoctor || '',
            "Anesthetist": $scope.Anesthetist || '',
            "Diagnosis": $scope.PreOpDiagnosis || '',
            "Name": $scope.cacheStorageItem.PatientName || '',
            "Age": $scope.cacheStorageItem.Age || '',
            "Gender": $scope.cacheStorageItem.Gender || '',
            "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
            "PatientOldMrno": $scope.cacheStorageItem.PatientOldMrno || '',
            "VisitType": $scope.cacheStorageItem.AppointmentType || '',
            "VisitReason": $scope.cacheStorageItem.VisitReason || '',
            "SurgeryDate": $scope.SurgeryDiagnosisObj.SurgeryDate || '',
            "SurgeryName": $scope.SurgeryName || '',


            //"CreatedBy": CreatedByName,
            //"ConsultationDate": $scope.cacheStorageItem.AppointmentDate || '',           
            //"Name": $scope.cacheStorageItem.PatientName || '',
            //"Age": $scope.cacheStorageItem.Age || '',
            //"Gender": $scope.cacheStorageItem.Gender || '',
            //"PatientDOB": $scope.cacheStorageItem.PatientDOB || '',
            //"PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
            //"PatientOldMrno": $scope.cacheStorageItem.PatientOldMrno || '',    
            //"VisitType": $scope.cacheStorageItem.AppointmentType || '',
            //"VisitReason": $scope.cacheStorageItem.VisitReason || '',    
            
            "VitalsArray": $scope.PreOpSummaryParentObj.Vitals || [],
            "AllergyItems": $scope.AscSummaryParentObj.AllergyItems || [],
            "SystemicHistory": $scope.AscSummaryParentObj.SystemicHistory || [],
            "SurgicalHistory": $scope.AscSummaryParentObj.SurgicalHistory || [],
            "CurrentSystemicMedicationsHistory": $scope.AscSummaryParentObj.CurrentSystemicMedicationsHistory || [],
            "CurrentEyeMedications": $scope.AscSummaryParentObj.CurrentEyeMedications || [],
            "AlderetScoreDetails": $scope.PreOpSummaryParentObj.AlderetScoreDetails || [],
            "PreOpSummaryParentObj": $scope.PreOpSummaryParentObj ||'',
            "OrgASCChecklist": GeneralList ||[],
            "PreOpMedicationRemarks": $scope.PreOpSummaryParentObj.PreOpMedicationRemarks ||'',
            "Ascpatientpopupsavearray": $scope.Ascpatientpopupsavearray ||[],
            "PreOpCallDetails": $scope.PreOpSummaryParentObj.PreOpCallDetails ||[],
            "DilationMedications": $scope.PreOpSummaryParentObj.DilationMedications || [],
            "PreOpMedications": $scope.PreOpSummaryParentObj.PreOpMedications || [],
            "ReviewedByName": $scope.PreOpSummaryParentObj.ReviewedByName || '',

        }
      

       
        USPrintService.GenerateASCPreopPrint(Object);
    }

    $scope.PostopSummaryPrint = function () {
        let CreatedByName = "";
        if (doctorinfo.doctordata.User.length > 0) {
            CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
        }

       // let GeneralList = $filter("filter")($scope.PreOpSummaryParentObj.OrgASCChecklist, { "CheckListCategoryId": 6 }, true) || [];
        $scope.ReviewedByobj = {
            'DoctorName': $scope.PostOpSummaryParentObj.DoctorName || '',
            'NurseName': $scope.PostOpSummaryParentObj.NurseName || '',
            'AnesthesiaName': $scope.PostOpSummaryParentObj.AnesthesiaName || '',
            'TechnicianName': $scope.PostOpSummaryParentObj.TechnicianName || '',
        };
        var Object = {

            "CreatedBy": CreatedByName,
            'Surgeon': $scope.Surgeondoctor || '',
            "Anesthetist": $scope.Anesthetist || '',
            "Diagnosis": $scope.PreOpDiagnosis || '',
            "Name": $scope.cacheStorageItem.PatientName || '',
            "Age": $scope.cacheStorageItem.Age || '',
            "Gender": $scope.cacheStorageItem.Gender || '',
            "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
            "PatientOldMrno": $scope.cacheStorageItem.PatientOldMrno || '',
            "VisitType": $scope.cacheStorageItem.AppointmentType || '',
            "VisitReason": $scope.cacheStorageItem.VisitReason || '',
            "SurgeryDate": $scope.SurgeryDiagnosisObj.SurgeryDate || '',
            "SurgeryName": $scope.SurgeryName || '',            
            "VitalsArray": $scope.PostOpSummaryParentObj.Vitals || [],
            "AllergyItems": $scope.AscSummaryParentObj.AllergyItems || [],
            "SystemicHistory": $scope.AscSummaryParentObj.SystemicHistory || [],
            "SurgicalHistory": $scope.AscSummaryParentObj.SurgicalHistory || [],
            "CurrentSystemicMedicationsHistory": $scope.AscSummaryParentObj.CurrentSystemicMedicationsHistory || [],
            "CurrentEyeMedications": $scope.AscSummaryParentObj.CurrentEyeMedications || [],
            "SurgeonOperativeNotes": $scope.PostOpSummaryParentObj.DischargeObj.SurgeonOperativeNotes || '',
            "SurgeonComplicationNotes": $scope.PostOpSummaryParentObj.DischargeObj.ComplicationsNotes || '',
            "MedicationsDetails": $scope.PostOpSummaryParentObj.PrescriptionDetails || [],
            "LabInvestigationsList": $scope.PostOpSummaryParentObj.SurgeonObj.InvestigationsList || [],
            "PostOpDiagnosis": $scope.PostOpSummaryParentObj.PostOpDiagnosis || [],
            "PostOpCheckoutActions": $scope.PostOpSummaryParentObj.NurseChart.Actions || [],
            "PostOpChecklistActions": $scope.PostOpSummaryParentObj.NurseChart.Checklists ||"",
            "ReviewedByName": $scope.PostOpSummaryParentObj.ReviewedByName || '',
            "ReviewedBy": $scope.ReviewedByobj || '',
     


        }
      

       
        USPrintService.GenerateASCPostopPrint(Object);
    }

    $scope.ASCOverAllPrint = function () {
        let CreatedByName = "";
        if (doctorinfo.doctordata.User.length > 0) {
            CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
        }
        $scope.NurseActions = {
            'Levelofconsciousness': $scope.IntraOpSummaryParentObj.NurseActionobj.Levelofconsciousness || '',
            'PatientPosition': $scope.IntraOpSummaryParentObj.NurseActionobj.PatientPosition || '',
            'ArmsToTheBody': $scope.IntraOpSummaryParentObj.NurseActionobj.SafetyDevicePosition.ArmsToTheBody || '',
            'Strap': $scope.IntraOpSummaryParentObj.NurseActionobj.SafetyDevicePosition.Strap || '',
            'AnotherRailing': $scope.IntraOpSummaryParentObj.NurseActionobj.SafetyDevicePosition.AnotherRailing || '',
            'SkinPreparation': $scope.IntraOpSummaryParentObj.NurseActionobj.SkinPreparation || '',
            'Sterilewater': $scope.IntraOpSummaryParentObj.NurseActionobj.Sterilewater || '',
            'Alcohol': $scope.IntraOpSummaryParentObj.NurseActionobj.Alcohol || '',
            'NurseActionOrganId': $scope.IntraOpSummaryParentObj.NurseActionobj.NurseActionOrganId || '',
            'NurseActionArea': $scope.IntraOpSummaryParentObj.NurseActionobj.NurseActionArea || '',
            'EspecimenLab': $scope.IntraOpSummaryParentObj.NurseActionobj.EspecimenLab || '',
            'CropHour': $scope.IntraOpSummaryParentObj.NurseActionobj.CropHour || '',
        };
        $scope.SurgeryStaff = {
            'SurgeonName': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeonName || '',
            'CoSurgeonName': $scope.IntraOpSummaryParentObj.NurseActionobj.CoSurgeonName || '',
            'TechnicianName': $scope.IntraOpSummaryParentObj.NurseActionobj.TechnicianName || '',
            'AnesthesistName': $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesistName || '',
            'ReliefName': $scope.IntraOpSummaryParentObj.NurseActionobj.ReliefName || '',
            'NurseName': $scope.IntraOpSummaryParentObj.NurseActionobj.NurseName || '',
            'SupportingStaffName': $scope.IntraOpSummaryParentObj.NurseActionobj.SupportingStaffName || '',
        };
        $scope.SurgeryTimes = {
            'SurgeryRoomNo': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryRoomNo || '',
            'HallEntranceStartTime': $scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceStartTime || '',
            'HallEntranceEndTime': $scope.IntraOpSummaryParentObj.NurseActionobj.HallEntranceEndTime || '',
            'AnesthesiaStartTime': $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaStartTime || '',
            'AnesthesiaEndTime': $scope.IntraOpSummaryParentObj.NurseActionobj.AnesthesiaEndTime || '',
            'SurgeryStartTime': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryStartTime || '',
            'SurgeryEndTime': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgeryEndTime || '',
        };
        $scope.SurgicalCount = {
            'SurgicalFirstNeedles': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstNeedles || '',
            'SurgicalFirstBlades': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstBlades || '',
            'SurgicalFirstOthers': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstOthers || '',
            'SurgicalFirstVerifiedByName': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstVerifiedByName || '',
            'SurgicalFirstTime': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFirstTime || '',
            'SurgicalSecondNeedles': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondNeedles || '',
            'SurgicalSecondBlades': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondBlades || '',
            'SurgicalSecondOthers': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondOthers || '',
            'SurgicalSecondVerifiedByName': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondVerifiedByName || '',
            'SurgicalSecondTime': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalSecondTime || '',
            'SurgicalFinalNeedles': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalNeedles || '',
            'SurgicalFinalBlades': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalBlades || '',
            'SurgicalFinalOthers': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalOthers || '',
            'SurgicalFinalVerifiedByName': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalVerifiedByName || '',
            'SurgicalFinalTime': $scope.IntraOpSummaryParentObj.NurseActionobj.SurgicalFinalTime || '',
        };
        $scope.ReviewedByobj = {
            'DoctorName': $scope.IntraOpSummaryParentObj.DoctorName || '',
            'NurseName': $scope.IntraOpSummaryParentObj.NurseName || '',
            'AnesthesiaName': $scope.IntraOpSummaryParentObj.AnesthesiaName || '',
            'TechnicianName': $scope.IntraOpSummaryParentObj.TechnicianName || '',
        };
        $scope.PostOpReviewedByobj = {
            'DoctorName': $scope.PostOpSummaryParentObj.DoctorName || '',
            'NurseName': $scope.PostOpSummaryParentObj.NurseName || '',
            'AnesthesiaName': $scope.PostOpSummaryParentObj.AnesthesiaName || '',
            'TechnicianName': $scope.PostOpSummaryParentObj.TechnicianName || '',
        };

        let nurselist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 5 }, true);
        let anticipationlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 6 }, true);
        let timeoutlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 7 }, true);
        let antibioticlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 8 }, true);
        let otherslist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 9 }, true);
        let identificationlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 10 }, true);
        let insertionlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 11 }, true);
        let preprocedurelist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 12 }, true);
        let patienthaslist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 13 }, true);
        let implantlist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 14 }, true);
        let monitorslist = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 15 }, true);
        let Anesthesiacheck = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 16 }, true);
        let pulseOximeter = $filter("filter")($scope.IntraOpSummaryParentObj.PatientAscChecklist, { "CheckListSubTypeId": 17 }, true);

        let CauteraisationArray = $filter("filter")($scope.IntraOpSummaryParentObj.NurseActionobj.Cauteraisation, { "IsChecked": true }, true);
        if ($scope.IntraOpSummaryParentObj.Anesthetistobj !== '') {
            var base64Img = '';
            if ($scope.IntraOpSummaryParentObj.Anesthetistobj.S3URL !== '') {
                $scope.toDataURL($scope.IntraOpSummaryParentObj.Anesthetistobj.S3URL, function (dataURL) {
                    base64Img = dataURL;
                    $scope.IntraOpSummaryParentObj.Anesthetistobj.BaseURL = base64Img;
                });
            } else {
                $scope.IntraOpSummaryParentObj.Anesthetistobj.BaseURL = base64Img;
            }
        }

        $timeout(function () {
            var Object = {
                "CreatedBy": CreatedByName,
                'Surgeon': $scope.Surgeondoctor || '',
                "Anesthetist": $scope.Anesthetist || '',
                "Diagnosis": $scope.PreOpDiagnosis || '',
                "Name": $scope.cacheStorageItem.PatientName || '',
                "Age": $scope.cacheStorageItem.Age || '',
                "Gender": $scope.cacheStorageItem.Gender || '',
                "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
                "PatientOldMrno": $scope.cacheStorageItem.PatientOldMrno || '',
                "VisitType": $scope.cacheStorageItem.AppointmentType || '',
                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                "SurgeryDate": $scope.SurgeryDiagnosisObj.SurgeryDate || '',
                "SurgeryName": $scope.SurgeryName || '',
                "IntraOpVitalsArray": $scope.IntraOpSummaryParentObj.Vitals || [],
                "AllergyItems": $scope.AscSummaryParentObj.AllergyItems || [],
                "SystemicHistory": $scope.AscSummaryParentObj.SystemicHistory || [],
                "SurgicalHistory": $scope.AscSummaryParentObj.SurgicalHistory || [],
                "CurrentSystemicMedicationsHistory": $scope.AscSummaryParentObj.CurrentSystemicMedicationsHistory || [],
                "CurrentEyeMedications": $scope.AscSummaryParentObj.CurrentEyeMedications || [],
                "nurselist": nurselist || [],
                "anticipationlist": anticipationlist || [],
                "timeoutlist": timeoutlist || [],
                "antibioticlist": antibioticlist || [],
                "otherslist": otherslist || [],
                "identificationlist": identificationlist || [],
                "insertionlist": insertionlist || [],
                "preprocedurelist": preprocedurelist || [],
                "patienthaslist": patienthaslist || [],
                "implantlist": implantlist || [],
                "monitorslist": monitorslist || [],
                "Anesthesiacheck": Anesthesiacheck || [],
                "pulseOximeter": pulseOximeter || [],
                "AnesthesiaTypelist": $scope.IntraOpSummaryParentObj.AnesthesiaTypelist || [],
                "AnesthesiaMedications": $scope.IntraOpSummaryParentObj.AnesthesiaMedications || [],
                "AnesthesiaMedicationsNotes": $scope.IntraOpSummaryParentObj.AnesthesiaMedicationsNotes || '',
                "IntraOpMedications": $scope.IntraOpSummaryParentObj.IntraOpMedications || [],
                "MedicationsNotes": $scope.IntraOpSummaryParentObj.MedicationsNotes || '',
                "Findings": $scope.IntraOpSummaryParentObj.Findings || '',
                "IntraOpSurgeonOperativeNotes": $scope.IntraOpSummaryParentObj.SurgeonOperativeNotes || '',
                "IntraOpSurgeonComplicationNotes": $scope.IntraOpSummaryParentObj.SurgeonComplicationNotes || '',
                "IntraOpDiagnosis": $scope.IntraOpSummaryParentObj.Diagnosis || [],
                "MedicationsDetails": $scope.IntraOpSummaryParentObj.PrescriptionDetails || [],
                "LabInvestigationsList": $scope.IntraOpSummaryParentObj.InvestigationsList || [],
                "ImplantsDetailsArray": $scope.ImplantsDetailsArray || [],
                "NurseActions": $scope.NurseActions || '',
                "SurgeryStaff": $scope.SurgeryStaff || '',
                "SurgeryTimes": $scope.SurgeryTimes || '',
                "SurgicalCount": $scope.SurgicalCount || '',
                "HydrationIV": $scope.IntraOpSummaryParentObj.NurseActionobj.HydrationIV || '',
                "DrainageOthers": $scope.IntraOpSummaryParentObj.NurseActionobj.DrainageOthers || '',
                "Cleansed": $scope.IntraOpSummaryParentObj.NurseActionobj.Cleansed || '',
                "Dirty": $scope.IntraOpSummaryParentObj.NurseActionobj.Dirty || '',
                "Contaminated": $scope.IntraOpSummaryParentObj.NurseActionobj.Contaminated || '',
                "CauteraisationOthers": $scope.IntraOpSummaryParentObj.NurseActionobj.CauteraisationOthers || '',
                "CauteraisationArray": CauteraisationArray || [],
                "IntraOpReviewedBy": $scope.ReviewedByobj || '',
                "TimeSlotsArray": $scope.IntraNewTimeSlots || [],
                "AnesthetistVitalsArray": $scope.IntraAnesthetistVitals || [],
                "BaseURL": $scope.IntraOpSummaryParentObj.Anesthetistobj.BaseURL || '',
                "PostOpVitalsArray": $scope.PostOpSummaryParentObj.Vitals || [],
                "AllergyItems": $scope.AscSummaryParentObj.AllergyItems || [],
                "SystemicHistory": $scope.AscSummaryParentObj.SystemicHistory || [],
                "SurgicalHistory": $scope.AscSummaryParentObj.SurgicalHistory || [],
                "CurrentSystemicMedicationsHistory": $scope.AscSummaryParentObj.CurrentSystemicMedicationsHistory || [],
                "CurrentEyeMedications": $scope.AscSummaryParentObj.CurrentEyeMedications || [],
                "PostOpSurgeonOperativeNotes": $scope.PostOpSummaryParentObj.DischargeObj.SurgeonOperativeNotes || '',
                "PostOpSurgeonComplicationNotes": $scope.PostOpSummaryParentObj.DischargeObj.ComplicationsNotes || '',
                "MedicationsDetails": $scope.PostOpSummaryParentObj.PrescriptionDetails || [],
                "LabInvestigationsList": $scope.PostOpSummaryParentObj.SurgeonObj.InvestigationsList || [],
                "PostOpDiagnosis": $scope.PostOpSummaryParentObj.PostOpDiagnosis || [],
                "PostOpCheckoutActions": $scope.PostOpSummaryParentObj.NurseChart.Actions || [],
                "PostOpChecklistActions": $scope.PostOpSummaryParentObj.NurseChart.Checklists || "",
                "PostOpReviewedBy": $scope.PostOpReviewedByobj || '',
            }
            USPrintService.GenerateASCOverAllPrint(Object);
        }, 500);
    };

}]).value('duScrollBottomSpy', true).value('duScrollActiveClass', 'active').value('duScrollOffset', 60);
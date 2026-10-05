"use strict";
eHnoteWebApp.controller("QuickAccessSummaryCtrl", ["$scope", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "eHnoteSettingsDataService", "datapersistanceFactory", "eHnoteDiagnosisDataServices", "eHnoteSurgeryService", "$q", "$timeout", "eHnoteMainAdminServices", "eHnoteMainAppointmentService", "USPrintService", "eHnoteAuditServices", "$uibModalInstance", "SubTabId", "eHnoteUserDataService", "eHnoteOrgReferralDataServices", "allUserList", function ($scope, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, eHnoteSettingsDataService, datapersistanceFactory, eHnoteDiagnosisDataServices, eHnoteSurgeryService, $q, $timeout, eHnoteMainAdminServices, eHnoteMainAppointmentService, USPrintService, eHnoteAuditServices, $uibModalInstance, SubTabId, eHnoteUserDataService, eHnoteOrgReferralDataServices, allUserList) {

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.ParenthospitalId = 0;
    $scope.HospitalId = 0;
    $scope.SelectedFile = 18;
    $scope.SubTabId = SubTabId;
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
    $scope.ShowHealthAndPhysical = false;
    $scope.closeuib = function () {
        $uibModalInstance.dismiss("cancel");
    };
    $scope.allUserList = [];
    $scope.allUserList = allUserList;

    // Time Out Check List

    $scope.OnlyNusrseAnesthetistRoles = [];
    $scope.OnlyNusrseAnesthetistRoles = $scope.allUserList.filter((x) => x.RoleId == 8 || x.RoleId == 25);

    $scope.CheckinChecklistArray = [];
    $scope.CheckinChecklistArray = $scope.OnlyNusrseAnesthetistRoles;

    $scope.ProfileStatusRemarksArray = [];

    $scope.GetPreAdmAnesthetistQuickSummary = function () {
        return {
            "PreAdmissionApptDate": "",
            "Vitals": [],
            "SystemicHistory": [],
            "AllergyItems": [],
            "SurgicalHistory": [],
            "LabArray": [],
            "LabInvestigation": [],
            "Airway": "",
            "CardioVascular": "",
            "HealthArray": [],
            "RespiratoryHealthArray": [],
            "PrevAnesthesia": "",
            "AssessmentsASA": "",
            "AnesthesiaPlan": "",
            "PreAdmissionStatusId": null,
            "PreAdmissionStatus": '',
            "AnesthesiaPlan": "",
            "LabObj": "",
            "CardioVascularObj": {
                "Systolic": "",
                "Diastolic": "",
                "PR": "",
                "ECG": "",
                "ECGUnits": "",
                "Notes": ""
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
                "ChemistryNotes": '',
            },
            "MedicationsList": [],
            "CurrentMedicationList": [],
            "CurrentEyeMedications": [],
            "InvestigationsList": [],
            "IsRespiratoryNormal": false,
            "RespiratoryNotes": "",
            "CNSNotes": "",
            "SocialNotes": "",
            "SelectedCardiacIssues": "",
            "SelectedPulmonaryIssues": "",
            "PulmonaryNotes": "",
            "SelectedHepaticIssues": "",
            "HepaticNotes": "",
            "SelectedEndocrineIssues": "",
            "SelectedNeurologicIssues": "",
            "SelectedHemeOncIssues": "",
            "EndocrineNotes": "",
            "NeurologicNotes": "",
            "HemeOncNotes": "",
            "SelectedNervousSystemIssues": "",
            "NervousSystemNotes": "",
            "SelectedMusculoSkeletalSystemIssues": "",
            "MusculoSkeletalSystemNotes": "",
            "SelectedKidneyDiseaseIssues": "",
            "KidneyDiseaseNotes": "",
            "SelectedAutoImmuneDisordersIssues": "",
            "AutoImmuneDisordersNotes": "",
            "SelectedPsychosisIssues": "",
            "SelectedOthersIssues": "",
            "SelectedHeentIssues": "",
            "SelectedLungsIssues": "",
            "OthersNotes": "",
            "PsychosisNotes": "",
            "HeentNotes": "",
            "LungsNotes": "",
            "IsCNSHistory": null,
            "IsCardiovascularHistory": null,
            "IsCardiacWNL": false,
            "CardiacNotes": "",
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
            "APAnesthesiaOptionsObj": {
                "AnesPlanAnesthetistId": null,
                "AnesthesiologistId": null,
                "AnesthetistNotes": "",
                "Dosage": "",
                "ReviewedDate": "",
                "AnesthetistName": "",
                "AnesthesiologistName": "",
            },
            "ASAObj": {
                "Value": "",
                "Notes": "",
                "EValue": "",
                "ENotes": "",
            },
            "PrevAnestheticsObj": "",
            "PreviousAnesthetics": [],
            "ReviewedBy": null,
            "ShowAdvanceHealthEdit": false,
            "AscAppointmentId": null,
            "AscAppointmentDate": "",
            "FirstFollowupDate": "",
            "FirstFollowupApptId": null,
            "SecondFollowupDate": "",
            "SecondFollowupApptId": null,
            "ThirdFollowupDate": "",
            "ThirdFollowupApptId": null,
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
            "ReviewedDate": "",
            "ReviewedTime": "",
            "IsCXR": "",
            "PrescriptionDetails": [],
            "CurrentSystemicMedicationsHistory": [],
            "LabNotes": '',
            "LifestyleDetail": [],
            "MedicineOrdersInstructions":'',
            "ASAClassificationNotes":'',
            "AnesthesiaTypelist":[],
            "AnesthetistReviewedBy": null,
            "AnesthetistReviewedName": '',
            "AnesthesiologistReviewedBy": null,
            "AnesthesiologistReviewedName": '',
        };
    };

    $scope.PreAdmAnesthetistQuickSummary = angular.copy($scope.GetPreAdmAnesthetistQuickSummary());

    $scope.PreOpQuickSummaryObj = {
        "Vitals": [],
        "SystemicHistory": [],
        "SurgicalHistory": [],
        "Ascpatientpopupsavearray": [],
        "AllergyItems": [],
        "CurrentSystemicMedicationsHistory": [],
        "CurrentEyeMedications": [],
        "AlderetScoreDetails": [],
        "TotalAlderetScore": null,
        "HealthArray": [],
        "DocumentDetails": [],
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
        "ReviewedbyInd": false,
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
        "PreOpMedications": [],
        "DilationMedications": [],
        "PreOpMedicationRemarks": "",
        "OrgASCChecklist": [],
        "GeneralChecklistRemarks": "",
        "NewGeneralChecklistName": "",
        "IsAllMedicineCheckListChecked": null,
        "NurseChecklistTemplates": [],
        "NurseChecklistValueType": "1",
        "GeneralChecklistValueType": "1",
        "MedicineChecklistValueType": "1",
        "IsAddNewNurseCheckList": false,
        "IsAddNewGeneralCheckList": false,
        "IsAddNewMedicineCheckList": false,
        "IsShowPreOpCheckListHealthPhysicalInd": false,
        "IsAllHealthWNL": false,
        "ReviewedBy": null,
        "ReviewedByName": "",
        "ReviewedDate": "",
        "ReviewedTime": "",
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
        "MedicationReviewId": null,
        "DilationReviewId": null,
        "DilationMedicationsNotes": "",
        "MedicationReviewName": "",
        "MedicationRemarks": "",
        "DilationReviewName": "",
        "IsVeinOpened": null,
        "IsDiabetes": null,
        "DiabetesResult": "",
        "DiabetesTime": "",
        "ODPupilSize": "",
        "OSPupilSize": "",
        "MedicineChecklistRemarks": "",
        "NurseChecklistRemarks": "",
        "Ascpatientpopupsavearray": [],
    };

    $scope.IntraOpQuickSummaryObj = {
        "Vitals": [],
        "AllergyItems": [],
        "PreOpMedications": [],
        "SystemicHistory": [],
        "SurgicalHistory": [],
        "CurrentEyeMedications": [],
        "CurrentSystemicMedicationsHistory": [],
        "InvestigationsList": [],
        "DocumentDetails": [],
        "LastSignOffUserDetails": [],
        "PatientASCIntraOPId": null,
        "Pathology": "",
        "PatientAlert": "",
        "VitalsType": "",
        "SurgeonOperativeNotes": "",
        "SurgeonComplicationNotes": "",
        "Findings": "",
        "Complications": "",
        "OrdersReviewedBy": 0,
        "NurseActionobj": {
            "NurseChecklistValueType": "1",
            "NewNurseChecklistName": "",
            "SubOrganLidsList": [],
            "SubOrganConjunctivaList": [],
            "OrgASCChecklist": [],
            "Cauteraisation": [],
            "NurseReviewedById": null,
            "NurseActionOrganId": null,
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
            "PatientTolerated": false,
            "CauteraisationOthers": "",
        },
        "Ordersobj": {
            "PatientAscEyeDrops": [],
            "PatientAscInjections": [],
        },
        "Diagnosis": [],
        "IntraOpDiagnosis": [],
        "ROSOverAllRemarks": "",
        "PrescriptionDetails": [],
        "ReviewDoctorId": null,
        "ReviewNurseId": null,
        "ReviewAnesthetistId": null,
        "ReviewTechnicianId": null,
        "ImplantsDetailsArray": [],
        "MedicineOrdersInstructions": "",
        "DoctorNotes": "",
        "DoctorName": "",
        "NurseName": "",
        "AnesthesiaName": "",
        "ReviewedbyInd": false,
        "AnesthesiaTypelist": [],
        "AnesthesiaMedications": [],
        "EBLValue": "",
        "IntakeValue": "",
        "OutputValue": "",
        "InTime": "",
        "OutTime":"",
        "AnesthesiaMedicationsReviewId": null,
        "MedicationsReviewId": null,
        "AnesthesiaMedicationsNotes": "",
        "MedicationsNotes": "",
        "S3URL": "",
        "AnesthesiaMedicationsReviewName": "",
        "MedicationsReviewName": "",
        "CDEOD": "",
        "CDEOS": "",
        "CDERemarks": "",
        "IsCDEInd": false,
        "BeforeAnesthesiaReviewedByName": "",
        "BeforeORReviewedByName": "",
        "PatientStableSurgery": false,
        "AdequatePreoperativeWorkup": false,
        "DoctorLicense":'',
        "NurseLicense":'',
        "AnesthesiaLicense":'',
        "AnesthesiologistName":'',
        "AnesthesiologistLicense":'',
        "TechnicianName":'',
        "TechnicianLicense": '',
        "IsIntraOPAnesthesiaActionVitalsArrayEmpty":false,
    };

    $scope.PostOpQuickSummaryObj = {
        "IsShow": false,
        "IsEdit": false,
        "IsShowPostOpSummaryViewInd": false,
        "ProgressRemarksInd": false,
        "IsPostOpHighCriteria": false,
        "IsPostProceduresNotes": false,
        "ShowGraph": false,
        "Vitals": [],
        "AllergyItems": [],
        "SystemicHistory": [],
        "SurgicalHistory": [],
        "OrgASCChecklist": [],
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
        "IsAllNurseCheckListChecked": null,
        "IsAllActionCheckListChecked": null,
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
        "ReviewTechnicianId": null,
        "CurrentEyeMedications": [],
        "CurrentSystemicMedicationsHistory": [],
        "MedicineOrdersInstructions": "",
        "DoctorName": "",
        "NurseName": "",
        "TechnicianName": "",
        "AnesthesiaName": "",
        "ReviewedbyInd": false,
        "IsPostOpProgressNotesInd": false,
    }

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

    $scope.GetPostopAnesthetistVitals = function () {
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
            }
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
    $scope.PostopAnesthetistVitals = angular.copy($scope.GetPostopAnesthetistVitals());

    $scope.GetAnesthetistVitals = function () {
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
    $scope.AnesthetistVitals = angular.copy($scope.GetAnesthetistVitals());

    $scope.DischargeQuickSummaryObj = {
        "PatientId": $scope.cacheStorageItem.PatientID,
        "AppointmentId": $scope.cacheStorageItem.AppointmentId,
        "Surgeon": "",
        "Medications": [],
        "Prescriptions": [],
        "PostOpDiagnosis": [],
        "DiagnosisList": [],
        "PostOpInstruction": "",
        "DischargeInstruction": "",
        "SelectedMedInstructionTemplate": "",
        "FollowUpInstructions": "",
        "CoManagementInstruction": "",
        "PatientConditionInstruction": "",
        "ProceduralInstruction": "",
        "ExaminationNotes": "",
        "FollowUpDate1": "",
        "FollowUpDate2": "",
        "FollowUpDate3": "",
        "FollowUpTime1": "",
        "FollowUpTime2": "",
        "FollowUpTime3": "",
        "DischargeReviewedBy": null,
        "DischargeReviewedByName": "",
        "Findings": "",
        "MedicineOrdersInstructions": "",
        "PatientsInstructions":""
    };

    $scope.PatientDischargeObj = {
        "OperativeProcedure":"",
        "SurgeryDate":"",
        "OrganId":"",
        "Diagnosis":"",
        "Diagnosis2":"",
        "Surgeon":"",
        "InternalCoManager":"",
        "ExternalCoManager":"",
        "FullName":"",
        "DOB": "",
        "PatientDisplayId": null,
    }

    $scope.OperativeNotesObj = {
        "PatientOperativeNotesId": 0,
        "ProcedureDetails": "",
        "Complications": "",
        "OperativeReviewedName": "",
        "AdditionalSurgery": [],
        "Findings": "",
    };

    function GetPatientDetailsInfo() {
        var obj = {
            "PatientProfilePicDetails": [],
            "PatientTagId": 0,
            "PatientTagName": "",
            "PatientTagObj": "",
            "Title": "",
            "TitleId": 0,
            "FirstName": "",
            "MiddleName": "",
            "LastName": "",
            "DOB": "",
            "SocialSecurityNo": "",
            "Gender": "Male",
            "MaritalStatusID": "",
            "MaritalStatusName": "",
            "BloodGroupObj": {},
            "BloodGroupName": "",
            "BloodGroupId": 0,
            "MobileNumber": "",
            "ContactInfo": {
                "PatientHomeCode": "",
                "PatientHomeNumber": "",
                "PatientOfficeCode": "",
                "PatientOfficeNumber": "",
                "EmailID": "",
                "HomeCountryCode": "+1",
                "HomeAreaCode": "",
                "HomeNumber": "",
                "OfficeCountryCode": "+1",
                "OfficeAreaCode": "",
                "OfficeNumber": "",
                "MobileNumber": "",
                "ContactNumber": "",
                "AuthorizationId": "",
                "IsPatientSmsInd": false,
                "IsPatientEmailInd": false
            },
            "CurrentAge": "",
            "S3URL": "",
            "LeadSourceInd": "N",
            "PatientDisplayID": "",
            "Age": "",
            "DisplayMobileNumber": "",
            "DisplayAlternateNumber": "",
            "SecondLastName": "",
            "SecondLastNameInd": true,
            "IsNoChargePatient": false,
            "IsDiseased": false,
            "CauseOfDeath": "",
            "DateOfDeath": "",
            "OccupationId": null,
            "OccupationDescription": "",
            "EmployerPhoneNo": "",
            "Emergency": "",
            "EmergencyMobile": "",
            "FatherName": "",
            "MotherName": "",
            "Guardian": "",
            "Employer": "",
            "OldMrno": "",
            "BirthSex": "",
            "AuthorizedUserFullName": "",
            "AuthorizedUserEmailId": "",
            "AuthorizedUserMobileNo": ""
        }
        return obj;
    }

    $scope.PatientDetailsInfo = GetPatientDetailsInfo();

    function GetDemographicInfo() {
        var obj = {
            "PatientId": 0,
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "Ethnicity": [],
            "Race": [],
            "PreferedLanguage": [],
            "PreferedLanguageId": 0,
            "PreferedLanguageName": "",
            "PreferedLanguageObj": "",
            "ExpressionId": 0,
            "Expression": "",
            "ExpressionObj": "",
            "Proficiency": "",
            "ProficiencyId": 0,
            "ProficiencyObj": "",
            "MultipleBirth": "",
            "MothersMiddleName": "",
            "PatientPrefixListName": "",
            "PatientPrefixListId": 0,
            "PatientPrefixObj": "",
            "FirstName": "",
            "MiddleName": "",
            "LastName": "",
            "PatinetSuffixId": 0,
            "PatientSuffixName": "",
            "PatinetSuffixObj": "",
            "SexualOrientation": "",
            "SexualOrientationId": 0,
            "SexualOrientationObj": "",
            "GenderIdentityStatus": "",
            "GenderIdentityStatusId": 0,
            "GenderIdentityStatusObj": "",
            "LanguageID": "",
            "RaceID": "",
            "EthnicityID": "",
            "EthnicityName": "",
            "RaceName": "",
            "LanguageName": "",
            "LGuardianFirstName": "",
            "LGuardianMiddleName": "",
            "LGuardianLastName": "",
            "PatFatherFirstName": "",
            "LGuardianFullname": ""
        }
        return obj;
    }
    $scope.DemographicSummary = GetDemographicInfo();


    $scope.GetFaceSheetSummaryObj = function () {
        return {

            "OrganizationId": $scope.HospitalId || 0,
            "UserId": $scope.UserId,
            "PatientId": $scope.cacheStorageItem.PatientID || 0,
            "AppointmentId": $scope.FaceSheetAppointmentId,
            "FaceSheetChartStatus": 'D',
            "PatientData": [],
            "SurgeryList": [],
            "FaceSheetCheckList": [{
                "OrganId": null,
                "ReviewedBy": null,
                "PatientFaceSheetId": 0,
                "PreOpVerification": [],
                "SurgeonVerification": [],

            }],
            "Anesthetist": "",
            "SurgeonName": "",
            "ExternalCoManagerName": "",
            "InternalCoManagerName": "",
            "Cardiologist": "",
            "PreAdmissionStatus": '',
            "CardiologyStatus": '',
            "PreviousCDAValue": "",
            "PreviousCDAValueGivenDate": null,
            "SurgeonVerifiedUserId": null
        };

    };

    $scope.FaceSheetSummaryObj = $scope.GetFaceSheetSummaryObj;


  
    $scope.mastercheckListData = {
        "PreOp": [],
        "SurgeryDate": "",
        "OrganId": null,
        "SurgeryOperations": [],
        "ApptFaceSheetData": [],
        "LastSignOffUserDetails": []
    }
    $scope.PatientInsuranceSummary = [];

    $scope.PatientProfileStatusId = 3;
    $scope.PatientprofileStatusDetails = [];

    $scope.SelectedAppointmentObj = {
        "NotesTab": 1,
        "OtherNotes": "",
        "Routeslipnotes": "",
        "OtherNotesCreatedBy": "",
        "OtherNotesCreatedDt": "",
    }

    $scope.AdmissionObj = {
        "OrgASCChecklist": []
    }

    function GetApptPCPInfo() {
        var obj = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "PatientID": $scope.PatientId,
            "AppointmentId": $scope.AppointmentId,
            "PatientDesignatedInfoId": 0,
            "PCP": 0,
            "Referral": 0,
            "ExternalManager": 0,
            "Corporation": 0,
            "Office": 0,
            "ReferralMobileNo": 0,
            "ReferralContactNo": 0,
            "MasterReferralSourceId": 0,
            "MasterReferralSourceName": "",
            "MasterReferralSourceObj": '',
            "ReferralSourceId": 0,
            "ReferralSourceName": "",
            "ReferralSourceObj": "",
            "ReferralSubSourceId": 0,
            "ReferralDate": "",
            "PatientPCPDocuments": [],
            "PCPobj": "",
            "ReferalObj": "",
            "ExternalManegerObj": "",
            "CorporationObj": "",
            "OfficeObj": "",
            "PCPDoctorName": "",
            "ReferralName": "",
            "ExternalManagerName": "",
            "CorporationName": "",
            "OfficeName": "",
            "SummaryPcpDocument": [],
            "EmployerName": "",
            "OccupationId": "",
            "OccupationDescription": "",
            "EmployerPhoneNo": "",
            "Emergency": "",
            "EmergencyMobile": "",
            "S3URL": "",
            "PcpNPI": "",
            "ReferenceNumber": "",
            "PatientReferalDocuments": [],
            "PCPReferenceNumber": "",
            "PCPSecondReferenceNumber": "",
            "PCPContactNo": "",
            "PCPNotes": "",
            "IsPCPCoManagerInd": false,
            "PCPEmailId": "",
            "PCPReferralDate": null,
            "ReferalNotes": "",
            "IsReferalCoManagerInd": false,
            "ReferalReferenceNumber": "",
            "ReferalSecondReferenceNumber": "",
            "ReferalEmailId": "",
            "ReferalNPI": "",
            "SourceDesignatedInfoNotes": "",
            "PCPCheckBox": false,
            "ReferalCheckBox": false,
            "SourceCheckBox": false,
            "ReferralContact": ""
        }

        return obj;
    }
    $scope.PatientApptPCPInfo = GetApptPCPInfo();

    function getSummaryAppointmentPreAuthDataObj() {
        var obj = {
            "PatientPreAuthDocuments": [],
            "PatientPreAuthorizationId": 0,
            "PayorId": 0,
            "OrganizationPayorId": 0,
            "PayorObj": "",
            "PayorName": "",
            "PayorCode": "",
            "PlanName": "",
            "PlanCode": "",
            "PreAuthorizationNumber": "",
            "VisitReasonId": 0,
            "VisitTypeId": 0,
            "Remarks": "",
            "ServiceDate": "",
            "ExpiryDate": "",
            "TempDocuments": [],
            "PreAuthNumbers": [],
            "PreAuthNumber1": "",
            "PreAuthNumber2": "",
            "PreAuthNumber3": "",
            "PreAuthNumber4": "",
            "PreAuthNumber5": "",
            "PreAuthorizationCode": ""
        };
        return obj;
    }

    $scope.summaryAppointmentPreAuthDataObj = getSummaryAppointmentPreAuthDataObj();

    $scope.GetLabObj = function () {
        return {
            "HGB": "",
            "HCT": "",
            "WBC": "",
            "RBC": "",
            "A1C": "",
            "Creatinine": "",
            "RBS": "",
            "FBS": "",
            "PBBS": "",
            "PBLS": "",
            "LabTestArray": [
                {
                    "Name": "Prothrombin Time",
                    "IsNormalLimitsChecked": false,
                    "IsAbnormalChecked": false,
                    "Notes": ""
                },
                {
                    "Name": "Partial Thromboplastin time",
                    "IsNormalLimitsChecked": false,
                    "IsAbnormalChecked": false,
                    "Notes": ""
                },
                {
                    "Name": "Li-Fraumeni Syndrome",
                    "IsNormalLimitsChecked": false,
                    "IsAbnormalChecked": false,
                    "Notes": ""
                },
                {
                    "Name": "",
                    "IsNormalLimitsChecked": false,
                    "IsAbnormalChecked": false,
                    "Notes": ""
                },
            ],
            "Notes": "",
            "UrineAnalysis": "",
            "IsBloodAvailable": "",
            "IsPretransfusion": "",
            "Others": ""
        };
    };

    $scope.GetPrevAnesthetics = function () {
        return {
            "IsPrevAnesthesia": false,
            "IsComplications": false,
            "IsFamilyHistory": false,
            "IsDifficultAirway": false,
            "IsPONV": false,
            "IsPatientDNR": false,
            "IsSuspend": false,
            "IsContinue": false,
            "Notes": ""
        };
    };

    $scope.GetPreAdmCardioQuickSummaryObj = function () {
        return {
            "PreAdmissionApptDate": "",
            "Vitals": [],
            "SystemicHistory": [],
            "AllergyItems": [],
            "SurgicalHistory": [],
            "RespiratoryHealthArray": [],
            "SocialHealthArray": [],
            "LabArray": [],
            "Airway": "",
            "CardioVascular": "",
            "HealthArray": [],
            "PreAdmissionStatusId": null,
            "AnesthesiaPlan": "",
            "ReviewedbyInd": false,
            "LabObj": "",
            "CardioVascularObj": {
                "Systolic": "",
                "Diastolic": "",
                "PR": "",
                "ECG": "",
                "Notes": "",
                "ECGUnits": "",
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
            },
            "MedicationsList": [],
            "CurrentMedicationList": [],
            "CurrentEyeMedications": [],
            "CurrentSystemicMedicationsHistory": [],
            "InvestigationsList": [],
            "IsRespiratoryNormal": false,
            "RespiratoryNotes": "",
            "CNSNotes": "",
            "SocialNotes": "",
            "SelectedCardiacIssues": "",
            "SelectedPulmonaryIssues": "",
            "PulmonaryNotes": "",
            "SelectedHepaticIssues": "",
            "HepaticNotes": "",
            "SelectedEndocrineIssues": "",
            "SelectedNeurologicIssues": "",
            "SelectedHemeOncIssues": "",
            "EndocrineNotes": "",
            "NeurologicNotes": "",
            "HemeOncNotes": "",
            "SelectedNervousSystemIssues": "",
            "NervousSystemNotes": "",
            "SelectedMusculoSkeletalSystemIssues": "",
            "MusculoSkeletalSystemNotes": "",
            "SelectedKidneyDiseaseIssues": "",
            "KidneyDiseaseNotes": "",
            "SelectedAutoImmuneDisordersIssues": "",
            "AutoImmuneDisordersNotes": "",
            "SelectedPsychosisIssues": "",
            "SelectedOthersIssues": "",
            "OthersNotes": "",
            "PsychosisNotes": "",
            "HeentNotes": "",
            "LungsNotes": "",
            "IsCNSHistory": null,
            "IsCardiovascularHistory": null,
            "IsCardiacWNL": false,
            "CardiacNotes": "",
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
            "APAnesthesiaOptionsObj": "",
            "ASAObj": {
                "Value": "",
                "Notes": "",

            },
            "PrevAnestheticsObj": "",
            "ReviewedBy": null,
            "ShowAdvanceHealthEdit": false,
            "AscAppointmentId": null,
            "AscAppointmentDate": "",
            "FirstFollowupDate": "",
            "FirstFollowupApptId": null,
            "SecondFollowupDate": "",
            "SecondFollowupApptId": null,
            "ThirdFollowupDate": "",
            "ThirdFollowupApptId": null,
            "ROSOverAllRemarks": "",
            "SelectedHeentIssues": "",
            "SelectedLungsIssues": "",
            "PresentIllness": "",
            "Chemistry": "",
            "Treatment": "",
            "IsCXR": "",
            "ReviewByName": "",
            "ReviewedDate": "",
            "ReviewedTime": "",
            "PrescriptionDetails": [],
            "LabInvestigation": [],
            "LifestyleDetail": [],
            "CardiologistDiagnosis": [],
            "OtherSystemArray": [],
            "PreAdminCardRespiratoryInd": false,
            "CXRHistory": "",
            "LabNotes": "",
            "ChemistryNotes": "",
            "IsChestPain":null,
            "CardiologyChartStatus":'',
            "CardiologyStatus":'',
            "MedicineOrdersInstructions":'',
        };
    };

    $scope.PreAdmCardioQuickSummaryObj = angular.copy($scope.GetPreAdmCardioQuickSummaryObj());

    function GetCheckinObj() {
        return {
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
            "ObservedBehaviour": "",
            "PainStatus": "",
            "Painlevel": null,
            "PainlevelNotes": "",
            "ObservedBehaviourNotes": "",
            "LevelOfConsciousness": "",
            "LevelOfConsciousnessNotes": "",
            "PreOpOverallNotes": "",
            "CurrentEyeMedications": [],
            "CurrentSystemicMedicationsHistory": [],
            "InvestigationsList": [],
            "Prescriptions": [],
            "OrgASCChecklist": [],
            "IsAllNurseCheckListChecked": null,
            "IsAllMedicineCheckListChecked": null,
            "NurseChecklistTemplates": [],
            "MedicineChecklistTemplates": [],
            "PreOPAdmitFiles": [],
            "SelectedNurseChecklistTemplate": "",
            "SelectedMedicineChecklistTemplate": "",
            "AdmissionRemarks": "",
            "ClinicalVisitTypeName": "",
            "ReasonForVisit": "",
            "ReviewedByName": "",
            "AdmittedByName": "",
        }
    };
    $scope.AdmissionCheckinObj = angular.copy(GetCheckinObj());

    $scope.GetAPAnesthesiaOptionsObj = function () {
        return {
            "Dosage": "",
            "AnesthetistId": null,
            "IsTopicalAnesthesia": false,
            "IsLocalAnesthesia": false,
            "IsGeneralAnesthesia": false,
            "IsRegionalAnesthesia": false,
            "IsPeriBulbarAnesthesia": false,
            "IsSubtenonAnesthesia": false,
            "IsIVSedation": false,
            "IsMonitoredAnesthesiaCare": false,
            "IsOralSedation": false,
            "AnesthetistName": "",
            "AnesthetistNotes": "",
            "AnesthesiologistName": "",
            "AnesthesiologistId": null

        };
    };

    $scope.GetDisplayVitalsArray = function () {
        return [
            {
                "VitalName": "Temp",
                "Values": []
            },
            {
                "VitalName": "pulse",
                "Values": []
            },
            {
                "VitalName": "BP",
                "Values": []
            },
            {
                "VitalName": "Resp.Rate",
                "Values": []
            },
            {
                "VitalName": "SPO2",
                "Values": []
            },
            {
                "VitalName": "BGL",
                "Values": []
            },
            {
                "VitalName": "Time",
                "Values": []
            },
            {
                "VitalName": "Performed By",
                "Values": []
            },
            {
                "VitalName": "Notes",
                "Values": []
            }
        ]
    }

    $scope.AscPreopObj = {
        "OrgASCChecklist": []
    }

    $scope.cacheStorageItem.SurgeryList = $scope.cacheStorageItem.SurgeryList || [];
    if ($scope.cacheStorageItem.SurgeryList.length > 0) {
        angular.forEach($scope.cacheStorageItem.SurgeryList, function (item) {
            //$scope.PatientDischargeObj.OperativeProcedure = item.SurgeryName;
            //$scope.PatientDischargeObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
            //$scope.PatientDischargeObj.OrganId = item.OrganId;

            item.DiagnosisList = item.DiagnosisList || [];
            if (item.DiagnosisList.length > 0) {
                $scope.PatientDischargeObj.Diagnosis = item.DiagnosisList[0].DiagnosisName || '';
            }

            if (item.DiagnosisList.length > 1) {
                $scope.PatientDischargeObj.Diagnosis2 = item.DiagnosisList[1].DiagnosisName || '';
            }

            //item.DoctorId = item.DoctorId || '';
            //item.DoctorId = item.DoctorId == '' ? item.SurgeonId : '';
            //if (item.DoctorId != '') {
            //    let temparray3 = $filter('filter')($scope.allUserList, { 'DoctorID': item.DoctorId }, true);
            //    if (temparray3.length > 0) {
            //        $scope.PatientDischargeObj.Surgeon = temparray3[0].FullName || '';
            //        $scope.PatientDischargeObj.DoctorSuffix = angular.copy(temparray3[0].SuffixName) || '';
            //        $scope.PatientDischargeObj.DoctorLicense = angular.copy(temparray3[0].LicenseNumber) || '';
            //        if (temparray3[0].SuffixId == 10) {
            //            $scope.PatientDischargeObj.Surgeon = ' Dr. ' + $scope.PatientDischargeObj.Surgeon;
            //        }
            //    } else {
            //        $scope.PatientDischargeObj.Surgeon = "";
            //    }
            //}

            //item.InternalCoManagerId = item.InternalCoManagerId || '';
            //if (item.InternalCoManagerId != '') {
            //    let temparray = $filter('filter')($scope.allUserList, { 'DoctorID': item.InternalCoManagerId }, true);
            //    if (temparray.length > 0) {
            //        $scope.PatientDischargeObj.InternalCoManager = temparray[0].FullName || '';
            //    }
            //}

            //item.ExternalCoManagerId = item.ExternalCoManagerId || '';
            //if (item.ExternalCoManagerId != '') {
            //    let temparray = $filter('filter')($scope.allUserList, { 'DoctorID': item.ExternalCoManagerId }, true);
            //    if (temparray.length > 0) {
            //        $scope.PatientDischargeObj.ExternalCoManager = temparray[0].FullName || '';
            //    }
            //}
            //$scope.PatientDischargeObj.FullName = $scope.cacheStorageItem.PatientName || "";
            //$scope.PatientDischargeObj.DOB = $scope.cacheStorageItem.PatientDOB || "";
            //$scope.PatientDischargeObj.PatientDisplayId = $scope.cacheStorageItem.PatientDisplayId || "";
        });
    }

    $scope.GetMasterAldreteScoreDetails = function () {
        eHnoteSurgeryService.GetMasterAldreteScoreDetails().then(function (resp) {

            if (resp.data.status === "Success") {
                angular.forEach(resp.data.rows, function (item) {
                    item.Value = null;
                    item.IsChecked = false;
                    angular.forEach(item.AldreteScoreDetailTypes, function (kitem) {
                        kitem.IsChecked = false;
                    });
                });
                $scope.PreOpQuickSummaryObj.AlderetScoreDetails = angular.copy(resp.data.rows);
            }

        }, function (err) {
            console.log(err);
        });
    };

    $scope.GetPreOpChartData = function () {


        let appointmentId = null;
        if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
            appointmentId = $scope.cacheStorageItem.AppointmentId;
        }

        if ($scope.cacheStorageItem.AppointmentTypeId == 7 || $scope.cacheStorageItem.AppointmentTypeId == 6) {
            appointmentId = $scope.cacheStorageItem.AscAppointmentId;
        }

        let req1 = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "CheckListModuleId": 1
        };

        let req = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": appointmentId || null,
            "PatientId": $scope.cacheStorageItem.PatientID || null
        };

        $q.all([
            eHnoteSurgeryService.GetOrganizationASCCheckListData(req1),
            eHnoteSurgeryService.GetPreOpChartData(req),
        ]).then(function (resp) {

            let OrgASCChecklists = angular.copy(resp[0].data.rows);
            if (resp[0].data.status === "Success") {
                $scope.PreOpQuickSummaryObj.OrgASCChecklist = angular.copy(resp[0].data.rows);
                angular.forEach($scope.PreOpQuickSummaryObj.OrgASCChecklist, function (item) {
                    angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                        kitem.IsChecked = false;
                    });
                });
            }

            if (resp[1].data.Status === "Success") {

                $scope.PreOpQuickSummaryObj.AllergyItems = resp[1].data.AllergyItems || [];
                $scope.PreOpQuickSummaryObj.SurgicalHistory = resp[1].data.SurgicalHistory || [];
                $scope.PreOpQuickSummaryObj.SystemicHistory = resp[1].data.SystemicHistory || [];
                $scope.PreOpQuickSummaryObj.SurgeryList = resp[1].data.SurgeryList || [];
                $scope.PreOpQuickSummaryObj.CurrentEyeMedications = angular.copy(resp[1].data.CurrentEyeMedicationList);
                $scope.PreOpQuickSummaryObj.CurrentSystemicMedicationsHistory = angular.copy(resp[1].data.CurrentSystemicMedicationList);

                $scope.PreOpQuickSummaryObj.LastSignOffUserDetails = angular.copy(resp[1].data.LastSignOffUserDetails) || [];

                $scope.ReviewedByLicenseNo = "";
                $scope.ReviewedBySuffixName = "";

                if (resp[1].data.rows.length > 0) {
                    var preopdata = resp[1].data.rows[0];
                    if (preopdata.VitalsArray.length > 0) {
                        angular.forEach(preopdata.VitalsArray, function (item) {
                            var vitalslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.DoctorId });
                            if (vitalslist.length > 0) {
                                item.UserName = angular.copy(vitalslist[0].FullName);
                            }
                            let ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                            let edate = ndate + " " + item.VitalAddTime;

                            item.VitalAddTime = $filter('date')(new Date(edate), "hh:mm a");
                        });
                    }

                    $scope.PreOpQuickSummaryObj.Vitals = preopdata.VitalsArray || [];
                    $scope.PreOpQuickSummaryObj.TotalAlderetScore = preopdata.TotalAlderetScore;
                    $scope.PreOpQuickSummaryObj.DocumentDetails = angular.copy(preopdata.DocumentDetails);

                    if (preopdata.AlderetScoreDetails.length > 0) {
                        angular.forEach(preopdata.AlderetScoreDetails, function (item) {
                            angular.forEach($scope.PreOpQuickSummaryObj.AlderetScoreDetails, function (hitem) {
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

                    $scope.PreOpQuickSummaryObj.ReviewedDate = preopdata.ReviewedDate || '';
                    $scope.PreOpQuickSummaryObj.ReviewedTime = preopdata.ReviewedTime || '';
                    $scope.PreOpQuickSummaryObj.DilationReviewId = preopdata.DilationReviewId || '';
                    $scope.PreOpQuickSummaryObj.MedicationReviewId = preopdata.MedicationReviewId || '';
                    if (preopdata.ReviewedBy != null) {
                        var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == preopdata.ReviewedBy }) || [];
                        if (ReviewedByArraylist.length > 0) {
                            $scope.PreOpQuickSummaryObj.ReviewedByName = angular.copy(ReviewedByArraylist[0].FullName);
                            $scope.ReviewedBySuffixName = angular.copy(ReviewedByArraylist[0].SuffixName + ',') || '';
                            $scope.ReviewedByLicenseNo = angular.copy(ReviewedByArraylist[0].LicenseNumber) || '';
                            if (ReviewedByArraylist[0].SuffixId == 10) {
                                $scope.PreOpQuickSummaryObj.ReviewedByName = ' Dr. ' + $scope.PreOpQuickSummaryObj.ReviewedByName;
                            }
                        }
                    }

                    if ($scope.PreOpQuickSummaryObj.DilationReviewId != null) {
                        var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.PreOpQuickSummaryObj.DilationReviewId });

                        ReviewedByArraylist = ReviewedByArraylist || [];
                        if (ReviewedByArraylist.length > 0) {

                            var SuffixName = '';
                            ReviewedByArraylist[0].SuffixName = ReviewedByArraylist[0].SuffixName || "";
                            if (ReviewedByArraylist[0].SuffixName != "") {
                                SuffixName = ReviewedByArraylist[0].SuffixName + ',';
                            }

                            var LicenseNumber = "";
                            ReviewedByArraylist[0].LicenseNumber = ReviewedByArraylist[0].LicenseNumber || "";
                            if (ReviewedByArraylist[0].LicenseNumber != "") {
                                LicenseNumber = 'Lic:' + ' ' + ReviewedByArraylist[0].LicenseNumber + ',';
                            }

                            $scope.PreOpQuickSummaryObj.DilationReviewName = angular.copy(ReviewedByArraylist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        }
                        else {
                            $scope.PreOpQuickSummaryObj.DilationReviewName = ""
                        }
                    }

                    $scope.PreOpQuickSummaryObj.ODPupilSize = preopdata.ODPupilSize || "";
                    $scope.PreOpQuickSummaryObj.OSPupilSize = preopdata.OSPupilSize || "";

                    if ($scope.PreOpQuickSummaryObj.MedicationReviewId != null) {
                        var MedicationArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.PreOpQuickSummaryObj.MedicationReviewId });
                        MedicationArraylist = MedicationArraylist || [];
                        if (MedicationArraylist.length > 0) {

                            var SuffixName = '';
                            MedicationArraylist[0].SuffixName = MedicationArraylist[0].SuffixName || "";
                            if (MedicationArraylist[0].SuffixName != "") {
                                SuffixName = MedicationArraylist[0].SuffixName + ',';
                            }
                            var LicenseNumber = "";
                            MedicationArraylist[0].LicenseNumber = MedicationArraylist[0].LicenseNumber || "";
                            if (MedicationArraylist[0].LicenseNumber != "") {
                                LicenseNumber = 'Lic:' + ' ' + MedicationArraylist[0].LicenseNumber + ',';
                            }
                            $scope.PreOpQuickSummaryObj.MedicationReviewName = angular.copy(MedicationArraylist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        }
                        else {
                            $scope.PreOpQuickSummaryObj.MedicationReviewName = ""
                        }
                        //if (MedicationArraylist.length > 0) {
                        //    $scope.PreOpQuickSummaryObj.MedicationReviewName = angular.copy(MedicationArraylist[0].FullName);
                        //}
                    }

                    $scope.ModifiedPreopMedicationDate = "";
                    $scope.ModifiedDilationDate = "";

                    if (preopdata.PreOpMedications.length > 0) {
                        angular.forEach(preopdata.PreOpMedications, function (hitem) {
                            var dateTimeString = hitem.ModifiedDt;
                            $scope.ModifiedPreopMedicationDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                        });
                    }

                    if (preopdata.DilationMedications.length > 0) {
                        angular.forEach(preopdata.DilationMedications, function (hitem) {
                            var dateTimeString = hitem.ModifiedDt;
                            $scope.ModifiedDilationDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                        });
                    }

                    $scope.PreOpQuickSummaryObj.DilationMedicationsNotes = preopdata.DilationMedicationsNotes || '';
                    $scope.PreOpQuickSummaryObj.MedicationRemarks = preopdata.MedicationRemarks || '';

                    if ($scope.PreOpQuickSummaryObj.ReviewedDate != '' || $scope.PreOpQuickSummaryObj.ReviewedTime != '' || $scope.PreOpQuickSummaryObj.ReviewedByName != '') {
                        $scope.PreOpQuickSummaryObj.ReviewedbyInd = true;
                    } else {
                        $scope.PreOpQuickSummaryObj.ReviewedbyInd = false;
                    }

                    $scope.PreOpQuickSummaryObj.PreOpMedications = angular.copy(preopdata.PreOpMedications);
                    $scope.PreOpQuickSummaryObj.DilationMedications = angular.copy(preopdata.DilationMedications);
                    $scope.PreOpQuickSummaryObj.DocumentDetails = angular.copy(preopdata.DocumentDetails);
                    $scope.PreOpQuickSummaryObj.PreOpCallDetails = angular.copy(preopdata.PreOpCallDetails);
                    $scope.PreOpQuickSummaryObj.OrgASCChecklist = angular.copy(preopdata.OrgASCChecklist);
                    $scope.PreOpQuickSummaryObj.HealthArray = angular.copy(preopdata.HealthArray);

                    if ($scope.PreOpQuickSummaryObj.Ascpatientpopupsavearray.length != 0) {
                        $scope.PreOpQuickSummaryObj.Ascpatientpopupsavearray[0] = angular.copy(preopdata.PatientCheckIn);
                    } else {
                        $scope.PreOpQuickSummaryObj.Ascpatientpopupsavearray.push(preopdata.PatientCheckIn);
                    }
                    //$scope.PreOpQuickSummaryObj.Ascpatientpopupsavearray.push(preopdata.PatientCheckIn);

                    $scope.AscPreopObj.OrgASCChecklist = angular.copy(OrgASCChecklists);
                    if (preopdata.OrgASCChecklist.length > 0) {
                        angular.forEach(preopdata.OrgASCChecklist, function (item) {
                            angular.forEach($scope.AscPreopObj.OrgASCChecklist, function (hitem) {
                                if (hitem.CheckListCategoryId === item.CheckListCategoryId && item.CheckListId === hitem.CheckListId) {
                                    angular.forEach(hitem.OrganizationCheckListDetails, function (kitem) {
                                        if (kitem.Value == item.Value && kitem.CheckListId === item.CheckListId) {
                                            hitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || 0;
                                            hitem.Value = item.Value || '';
                                            hitem.IsChecked = true;
                                        }
                                    });
                                    hitem.Remarks = item.Remarks || "";
                                    hitem.ChecklistDate = $filter("date")(item.ChecklistDate, "MM-dd-yyyy") || "";

                                    if (hitem.Remarks != "") {
                                        hitem.shownotes = true;
                                        hitem.IsChecked = true;
                                    }
                                    if (hitem.ChecklistDate != "") {
                                        hitem.IsChecked = true;
                                    }
                                }
                            });
                        });
                    }

                    $scope.PreOpQuickSummaryObj.ChunkedClinicalChecklist = [];
                    let tempArray = $filter('filter')($scope.AscPreopObj.OrgASCChecklist, { 'CheckListCategoryId': 1 }, true) || [];
                    let filteredClinicalChecklist = angular.copy(tempArray);
                    if (filteredClinicalChecklist.length > 0) {
                        let chunkSize = Math.ceil((filteredClinicalChecklist.length) / 2);
                        for (let i = 0; i < filteredClinicalChecklist.length; i += chunkSize) {
                            $scope.PreOpQuickSummaryObj.ChunkedClinicalChecklist.push(filteredClinicalChecklist.slice(i, i + chunkSize));
                        }
                    }

                    let tempHealthArray = angular.copy(preopdata.HealthArray);
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
                        $scope.PreOpQuickSummaryObj.SelectedCardiacIssues = tempCardiacArray.join(", ");
                    } else {
                        $scope.PreOpQuickSummaryObj.SelectedCardiacIssues = "";
                    }
                    if (tempPulmonaryArray.length > 0) {
                        $scope.PreOpQuickSummaryObj.SelectedPulmonaryIssues = tempPulmonaryArray.join(", ");
                    } else {
                        $scope.PreOpQuickSummaryObj.SelectedPulmonaryIssues = "";
                    }
                    if (tempHepaticArray.length > 0) {
                        $scope.PreOpQuickSummaryObj.SelectedHepaticIssues = tempHepaticArray.join(", ");
                    } else {
                        $scope.PreOpQuickSummaryObj.SelectedHepaticIssues = "";
                    }
                    if (tempEndocrineArray.length > 0) {
                        $scope.PreOpQuickSummaryObj.SelectedEndocrineIssues = tempEndocrineArray.join(", ");
                    } else {
                        $scope.PreOpQuickSummaryObj.SelectedEndocrineIssues = "";
                    }
                    if (tempNeurologicArray.length > 0) {
                        $scope.PreOpQuickSummaryObj.SelectedNeurologicIssues = tempNeurologicArray.join(", ");
                    } else {
                        $scope.PreOpQuickSummaryObj.SelectedNeurologicIssues = "";
                    }
                    if (tempHemeOneArray.length > 0) {
                        $scope.PreOpQuickSummaryObj.SelectedHemeOncIssues = tempHemeOneArray.join(", ");
                    } else {
                        $scope.PreOpQuickSummaryObj.SelectedHemeOncIssues = "";
                    }
                    if (tempNervousSystemArray.length > 0) {
                        $scope.PreOpQuickSummaryObj.SelectedNervousSystemIssues = tempNervousSystemArray.join(", ");
                    } else {
                        $scope.PreOpQuickSummaryObj.SelectedNervousSystemIssues = "";
                    }
                    if (tempKidneyDiseaseArray.length > 0) {
                        $scope.PreOpQuickSummaryObj.SelectedKidneyDiseaseIssues = tempKidneyDiseaseArray.join(", ");
                    } else {
                        $scope.PreOpQuickSummaryObj.SelectedKidneyDiseaseIssues = "";
                    }
                    if (tempMusculoSkeletalArray.length > 0) {
                        $scope.PreOpQuickSummaryObj.SelectedMusculoSkeletalSystemIssues = tempMusculoSkeletalArray.join(", ");
                    } else {
                        $scope.PreOpQuickSummaryObj.SelectedMusculoSkeletalSystemIssues = "";
                    }
                    if (tempAutoImmuneArray.length > 0) {
                        $scope.PreOpQuickSummaryObj.SelectedAutoImmuneDisordersIssues = tempAutoImmuneArray.join(", ");
                    } else {
                        $scope.PreOpQuickSummaryObj.SelectedAutoImmuneDisordersIssues = "";
                    }
                    if (tempPsychosisArray.length > 0) {
                        $scope.PreOpQuickSummaryObj.SelectedPsychosisIssues = tempPsychosisArray.join(", ");
                    } else {
                        $scope.PreOpQuickSummaryObj.SelectedPsychosisIssues = "";
                    }
                    if (tempOthersArray.length > 0) {
                        $scope.PreOpQuickSummaryObj.SelectedOthersIssues = tempOthersArray.join(", ");
                    } else {
                        $scope.PreOpQuickSummaryObj.SelectedOthersIssues = "";
                    }
                    if (tempHeentArray.length > 0) {
                        $scope.PreOpQuickSummaryObj.SelectedHeentIssues = tempHeentArray.join(", ");
                    } else {
                        $scope.PreOpQuickSummaryObj.SelectedHeentIssues = "";
                    }
                    if (tempLungsArray.length > 0) {
                        $scope.PreOpQuickSummaryObj.SelectedLungsIssues = tempLungsArray.join(", ");
                    } else {
                        $scope.PreOpQuickSummaryObj.SelectedLungsIssues = "";
                    }

                    $scope.PreOpQuickSummaryObj.IsCardiacWNL = preopdata.IsCardiacWNL;
                    $scope.PreOpQuickSummaryObj.IsPulmonaryWNL = preopdata.IsPulmonaryWNL;
                    $scope.PreOpQuickSummaryObj.IsHepaticWNL = preopdata.IsHepaticWNL;
                    $scope.PreOpQuickSummaryObj.IsEndocrineWNL = preopdata.IsEndocrineWNL;
                    $scope.PreOpQuickSummaryObj.IsNeurologicWNL = preopdata.IsNeurologicWNL;
                    $scope.PreOpQuickSummaryObj.IsHemeOncWNL = preopdata.IsHemeOncWNL;
                    $scope.PreOpQuickSummaryObj.IsNervousSystemWNL = preopdata.IsNervousSystemWNL;
                    $scope.PreOpQuickSummaryObj.IsKidneyDiseaseWNL = preopdata.IsKidneyDiseaseWNL;
                    $scope.PreOpQuickSummaryObj.IsMusculoSkeletalSystemWNL = preopdata.IsMusculoSkeletalSystemWNL;
                    $scope.PreOpQuickSummaryObj.IsAutoImmuneDisordersWNL = preopdata.IsAutoImmuneDisordersWNL;
                    $scope.PreOpQuickSummaryObj.IsPsychosisWNL = preopdata.IsPsychosisWNL;
                    $scope.PreOpQuickSummaryObj.IsOthersWNL = preopdata.IsOthersWNL;
                    $scope.PreOpQuickSummaryObj.IsHeentWNL = preopdata.IsHeentWNL;
                    $scope.PreOpQuickSummaryObj.IsLungsWNL = preopdata.IsLungsWNL;
                    $scope.PreOpQuickSummaryObj.IsAllHealthWNL = preopdata.IsAllHealthWNL;

                    $scope.PreOpQuickSummaryObj.CardiacNotes = preopdata.CardiacNotes || '';
                    $scope.PreOpQuickSummaryObj.PulmonaryNotes = preopdata.PulmonaryNotes || '';
                    $scope.PreOpQuickSummaryObj.HepaticNotes = preopdata.HepaticNotes || '';
                    $scope.PreOpQuickSummaryObj.EndocrineNotes = preopdata.EndocrineNotes || '';
                    $scope.PreOpQuickSummaryObj.NeurologicNotes = preopdata.NeurologicNotes || '';
                    $scope.PreOpQuickSummaryObj.HemeOncNotes = preopdata.HemeOncNotes || '';
                    $scope.PreOpQuickSummaryObj.NervousSystemNotes = preopdata.NervousSystemNotes || '';
                    $scope.PreOpQuickSummaryObj.KidneyDiseaseNotes = preopdata.KidneyDiseaseNotes || '';
                    $scope.PreOpQuickSummaryObj.MusculoSkeletalSystemNotes = preopdata.MusculoSkeletalSystemNotes || '';
                    $scope.PreOpQuickSummaryObj.AutoImmuneDisordersNotes = preopdata.AutoImmuneDisordersNotes || '';
                    $scope.PreOpQuickSummaryObj.PsychosisNotes = preopdata.PsychosisNotes || '';
                    $scope.PreOpQuickSummaryObj.OthersNotes = preopdata.OthersNotes || '';
                    $scope.PreOpQuickSummaryObj.HeentNotes = preopdata.HeentNotes || '';
                    $scope.PreOpQuickSummaryObj.LungsNotes = preopdata.LungsNotes || '';
                    $scope.PreOpQuickSummaryObj.IsVeinOpened = preopdata.IsVeinOpened || null;
                    $scope.PreOpQuickSummaryObj.IsDiabetes = preopdata.IsDiabetes || null;
                    $scope.PreOpQuickSummaryObj.DiabetesResult = preopdata.DiabetesResult || '';
                    $scope.PreOpQuickSummaryObj.DiabetesTime = preopdata.DiabetesTime || '';

                    if (preopdata.HealthArray.length > 0) {
                        $scope.PreOpQuickSummaryObj.IsShowPreOpCheckListHealthPhysicalInd = true;
                    }
                    else if (!$scope.PreOpQuickSummaryObj.IsCardiacWNL && !$scope.PreOpQuickSummaryObj.IsPulmonaryWNL && !$scope.PreOpQuickSummaryObj.IsHepaticWNL && !$scope.PreOpQuickSummaryObj.IsAutoImmuneDisordersWNL && !$scope.PreOpQuickSummaryObj.IsEndocrineWNL && !$scope.PreOpQuickSummaryObj.IsHemeOncWNL &&
                        !$scope.PreOpQuickSummaryObj.IsKidneyDiseaseWNL && !$scope.PreOpQuickSummaryObj.IsMusculoSkeletalSystemWNL && !$scope.PreOpQuickSummaryObj.IsNervousSystemWNL && !$scope.PreOpQuickSummaryObj.IsNeurologicWNL && !$scope.PreOpQuickSummaryObj.IsOthersWNL && !$scope.PreOpQuickSummaryObj.IsPsychosisWNL) {

                        $scope.PreOpQuickSummaryObj.IsShowPreOpCheckListHealthPhysicalInd = false;
                    } else {
                        $scope.PreOpQuickSummaryObj.IsShowPreOpCheckListHealthPhysicalInd = true;
                    }

                    if ($scope.PreOpQuickSummaryObj.IsVeinOpened == null && $scope.PreOpQuickSummaryObj.IsDiabetes == null && $scope.PreOpQuickSummaryObj.DiabetesResult == '' && $scope.PreOpQuickSummaryObj.DiabetesTime == '') {
                        $scope.PreOpQuickSummaryObj.IsPreOpMedicationInd = true;
                    } else {
                        $scope.PreOpQuickSummaryObj.IsPreOpMedicationInd = false;
                    }

                    // notes
                    $scope.PreOpQuickSummaryObj.MedicineChecklistRemarks = preopdata.MedicineChecklistRemarks || "";
                    $scope.PreOpQuickSummaryObj.NurseChecklistRemarks = preopdata.NurseChecklistRemarks || "";
                    $scope.PreOpQuickSummaryObj.GeneralChecklistRemarks = preopdata.GeneralChecklistRemarks || "";
                    $scope.PreOpQuickSummaryObj.PreOpMedicationRemarks = preopdata.PreOpMedicationRemarks || "";

                }

            } else {
                $scope.PreOpQuickSummaryObj.Vitals = [];
                $scope.PreOpQuickSummaryObj.MedicationsList = [];
                $scope.PreOpQuickSummaryObj.InvestigationsList = [];
                $scope.PreOpQuickSummaryObj.CurrentMedicationList = [];
                $scope.PreOpQuickSummaryObj.TotalAlderetScore = null;

                // files
                $scope.PreOpQuickSummaryObj.DocumentDetails = [];
                $scope.FilesObj.TempImagesArray = [];

                // notes
                $scope.PreOpQuickSummaryObj.MedicineChecklistRemarks = "";
                $scope.PreOpQuickSummaryObj.NurseChecklistRemarks = "";
                $scope.PreOpQuickSummaryObj.GeneralChecklistRemarks = "";
                $scope.PreOpQuickSummaryObj.PreOpMedicationRemarks = "";

                // health and physical
                $scope.PreOpQuickSummaryObj.HealthArray = [];
                $scope.PreOpQuickSummaryObj.SelectedCardiacIssues = "";
                $scope.PreOpQuickSummaryObj.SelectedPulmonaryIssues = "";
                $scope.PreOpQuickSummaryObj.SelectedHepaticIssues = "";
                $scope.PreOpQuickSummaryObj.SelectedEndocrineIssues = "";
                $scope.PreOpQuickSummaryObj.SelectedNeurologicIssues = "";
                $scope.PreOpQuickSummaryObj.SelectedHemeOncIssues = "";
                $scope.PreOpQuickSummaryObj.SelectedNervousSystemIssues = "";
                $scope.PreOpQuickSummaryObj.SelectedKidneyDiseaseIssues = "";
                $scope.PreOpQuickSummaryObj.SelectedMusculoSkeletalSystemIssues = "";
                $scope.PreOpQuickSummaryObj.SelectedAutoImmuneDisordersIssues = "";
                $scope.PreOpQuickSummaryObj.SelectedPsychosisIssues = "";
                $scope.PreOpQuickSummaryObj.SelectedOthersIssues = "";

                $scope.PreOpQuickSummaryObj.IsCardiacWNL = false;
                $scope.PreOpQuickSummaryObj.IsPulmonaryWNL = false;
                $scope.PreOpQuickSummaryObj.IsHepaticWNL = false;
                $scope.PreOpQuickSummaryObj.IsEndocrineWNL = false;
                $scope.PreOpQuickSummaryObj.IsNeurologicWNL = false;
                $scope.PreOpQuickSummaryObj.IsHemeOncWNL = false;
                $scope.PreOpQuickSummaryObj.IsNervousSystemWNL = false;
                $scope.PreOpQuickSummaryObj.IsKidneyDiseaseWNL = false;
                $scope.PreOpQuickSummaryObj.IsMusculoSkeletalSystemWNL = false;
                $scope.PreOpQuickSummaryObj.IsAutoImmuneDisordersWNL = false;
                $scope.PreOpQuickSummaryObj.IsPsychosisWNL = false;
                $scope.PreOpQuickSummaryObj.IsOthersWNL = false;
                $scope.PreOpQuickSummaryObj.IsHeentWNL = false;
                $scope.PreOpQuickSummaryObj.IsLungsWNL = false;
                $scope.PreOpQuickSummaryObj.IsAllHealthWNL = false;
                $scope.PreOpQuickSummaryObj.ReviewedbyInd = false;
            }
        });
    }

    $scope.GetASCIntraOpDetails = function () {


        let appointmentId = null;
        if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
            appointmentId = $scope.cacheStorageItem.AppointmentId;
        }

        if ($scope.cacheStorageItem.AppointmentTypeId == 7 || $scope.cacheStorageItem.AppointmentTypeId == 6) {
            appointmentId = $scope.cacheStorageItem.AscAppointmentId;
        }

        let req1 = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "CheckListModuleId": 2
        };

        var param = {
            "AppointmentId": appointmentId || null,
        }

        $q.all([
            eHnoteSurgeryService.GetOrganizationASCCheckListData(req1),
            eHnoteSurgeryService.GetASCIntraOpChartData(param),

        ]).then(function (resp) {

            if (resp[0].data.rows.length > 0) {
                if (resp[0].data.status === "Success") {
                    $scope.IntraOpQuickSummaryObj.AllIntraOpChecklistsArray = [];

                    angular.forEach(resp[0].data.rows, function (item) {
                        item.IsChecked = false;
                        if (item.SubCheckList.length > 0) {
                            angular.forEach(item.SubCheckList, function (kitem) {
                                kitem.IsChecked = false;
                            });
                        }
                    });

                    let tempIntraopChecklistsArray = $filter('filter')(resp[0].data.rows, { 'CheckListModuleId': 2 }, true);
                    if (tempIntraopChecklistsArray.length > 0) {
                        $scope.IntraOpQuickSummaryObj.AllIntraOpChecklistsArray = angular.copy(tempIntraopChecklistsArray);
                    }

                }
            }

            if (resp[1].data.status === "Success") {

                // ROS
                $scope.IntraOpQuickSummaryObj.SurgicalHistory = angular.copy(resp[1].data.SurgicalHistory);
                $scope.IntraOpQuickSummaryObj.SystemicHistory = angular.copy(resp[1].data.SystemicHistory);
                $scope.IntraOpQuickSummaryObj.AllergyItems = angular.copy(resp[1].data.AllergyItems);
                $scope.IntraOpQuickSummaryObj.PreOpMedications = angular.copy(resp[1].data.PreOpMedications) || [];

                $scope.IntraOpQuickSummaryObj.PatientStableSurgery = resp[1].data.PatientStableSurgery || false;
                $scope.IntraOpQuickSummaryObj.AdequatePreoperativeWorkup = resp[1].data.AdequatePreoperativeWorkup || false;
                $scope.IntraOpQuickSummaryObj.Pathology = resp[1].data.Pathology || "";

                if (resp[1].data.CurrentEyeMedicationList.length > 0) {
                    $scope.IntraOpQuickSummaryObj.CurrentEyeMedications = angular.copy(resp[1].data.CurrentEyeMedicationList);
                }

                if (resp[1].data.CurrentSystemicMedicationList.length > 0) {
                    $scope.IntraOpQuickSummaryObj.CurrentSystemicMedicationsHistory = angular.copy(resp[1].data.CurrentSystemicMedicationList);
                }


                $scope.IntraOpQuickSummaryObj.SurgeryList = angular.copy(resp[1].data.SurgeryList);


                resp[1].data.Diagnosis = resp[1].data.Diagnosis || [];
                if (resp[1].data.Diagnosis.length > 0) {
                    $scope.IntraOpQuickSummaryObj.Diagnosis = angular.copy(resp[1].data.Diagnosis);
                    $scope.IntraOpQuickSummaryObj.IsIntraOpDiagnosisInd = true;
                } else {
                    $scope.IntraOpQuickSummaryObj.Diagnosis = [];
                    $scope.IntraOpQuickSummaryObj.IsIntraOpDiagnosisInd = false;
                }

                $scope.PostOpQuickSummaryObj.Diagnosis = angular.copy(resp[1].data.Diagnosis);

                if (resp[1].data.Prescription.length > 0) {
                    $scope.IntraOpQuickSummaryObj.PrescriptionDetails = angular.copy(resp[1].data.Prescription);
                } else {
                    $scope.IntraOpQuickSummaryObj.PrescriptionDetails = [];
                }

                $scope.IntraOpQuickSummaryObj.MedicineOrdersInstructions = resp[1].data.MedicineOrdersInstructions || '';
                if (resp[1].data.InvestigationsList.length > 0) {
                    $scope.IntraOpQuickSummaryObj.InvestigationsList = angular.copy(resp[1].data.InvestigationsList);
                } else {
                    $scope.IntraOpQuickSummaryObj.InvestigationsList = [];
                }

                $scope.IntraOpQuickSummaryObj.PatientAlert = resp[1].data.PatientAlert || false;
                $scope.IntraOpQuickSummaryObj.VitalsType = resp[1].data.VitalsType || "";
                $scope.IntraOpQuickSummaryObj.VitalsStatus = resp[1].data.VitalsStatus || null;
                $scope.IntraOpQuickSummaryObj.LastSignOffUserDetails = angular.copy(resp[1].data.LastSignOffUserDetails) || [];

                $scope.ImplantsDetailsArray = [];
                if (resp[1].data.rows.length > 0) {

                    $scope.IntraOpQuickSummaryObj.Ordersobj.PatientAscInjections = angular.copy(resp[1].data.rows[0].PatientAscInjections) || [];
                    $scope.IntraOpQuickSummaryObj.Ordersobj.PatientAscEyeDrops = angular.copy(resp[1].data.rows[0].PatientAscEyeDrops) || [];
                    $scope.ImplantsDetailsArray = angular.copy(resp[1].data.rows[0].ImplantsDetailsArray) || [];

                    if (resp[1].data.rows[0].VitalsArray.length > 0) {
                        angular.forEach(resp[1].data.rows[0].VitalsArray, function (item) {
                            var vitalslist = $scope.allUserList.filter(function (kitem) {
                                return kitem.DoctorID == item.DoctorId;
                            });
                            if (vitalslist.length > 0) {
                                item.UserName = angular.copy(vitalslist[0].FullName);
                            }
                            let ndate = moment().format("YYYY-MM-DD");
                            let edate = ndate + " " + item.VitalAddTime;
                            item.VitalAddTime = moment(edate, "YYYY-MM-DD hh:mm:ss").format("hh:mm a");
                        });

                        $scope.IntraOpQuickSummaryObj.Vitals = angular.copy(resp[1].data.rows[0].VitalsArray);
                    }

                    if (resp[1].data.rows[0].PatientAscChecklist.length > 0) {
                        angular.forEach(resp[1].data.rows[0].PatientAscChecklist, function (item) {
                            angular.forEach($scope.IntraOpQuickSummaryObj.AllIntraOpChecklistsArray, function (kitem) {
                                if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                                    if (kitem.CheckListId === item.CheckListId) {
                                        kitem.IsChecked = true;
                                        kitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                                        if (item.SubCheckList.length > 0) {
                                            angular.forEach(item.SubCheckList, function (jitem) {
                                                angular.forEach(kitem.SubCheckList, function (hitem) {
                                                    if (hitem.SubCheckListId == jitem.SubCheckListId) {
                                                        hitem.IsChecked = true;
                                                        hitem.PatientAscSubCheckListId = jitem.PatientAscSubCheckListId || null;
                                                    }
                                                });
                                            });
                                        }
                                    }
                                }
                            });
                        });
                    }

                    $scope.IntraOpQuickSummaryObj.PatientAscChecklist = resp[1].data.rows[0].PatientAscChecklist || [];

                    $scope.IntraOpQuickSummaryObj.NurseActionobj.ChecklistRemarks = resp[1].data.rows[0].NurseActions.ChecklistRemarks || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.Levelofconsciousness = resp[1].data.rows[0].NurseActions.Levelofconsciousness || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.LevelofconsciousnessNotes = resp[1].data.rows[0].NurseActions.LevelofconsciousnessNotes || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.PatientPosition = resp[1].data.rows[0].NurseActions.PatientPosition || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.PatientPositionNotes = resp[1].data.rows[0].NurseActions.PatientPositionNotes || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SkinPreparation = resp[1].data.rows[0].NurseActions.SkinPreparation || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SkinPreparationNotes = resp[1].data.rows[0].NurseActions.SkinPreparationNotes || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.Sterilewater = resp[1].data.rows[0].NurseActions.Sterilewater || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.Alcohol = resp[1].data.rows[0].NurseActions.Alcohol || "";


                    $scope.IntraOpQuickSummaryObj.NurseActionobj.EspecimenLabNotes = resp[1].data.rows[0].NurseActions.EspecimenLabNotes || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.AreaNotes = resp[1].data.rows[0].NurseActions.AreaNotes || "";

                    $scope.IntraOpQuickSummaryObj.NurseActionobj.EspecimenLab = resp[1].data.rows[0].NurseActions.EspecimenLab || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseActionOrganId = resp[1].data.rows[0].NurseActions.NurseActionOrganId || null;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseActionArea = resp[1].data.rows[0].NurseActions.NurseActionArea || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonId = resp[1].data.rows[0].NurseActions.SurgeonId || null;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.TechnicianId = resp[1].data.rows[0].NurseActions.TechnicianId || null;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistId = resp[1].data.rows[0].NurseActions.AnesthesistId || null;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.ReliefId = resp[1].data.rows[0].NurseActions.ReliefId || null;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseId = resp[1].data.rows[0].NurseActions.NurseId || null;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonId = resp[1].data.rows[0].NurseActions.CoSurgeonId || null;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SupportingStaffId = resp[1].data.rows[0].NurseActions.SupportingStaffId || null;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.CropHour = resp[1].data.rows[0].NurseActions.CropHour || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryRoomNo = resp[1].data.rows[0].NurseActions.SurgeryRoomNo || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceStartTime = resp[1].data.rows[0].NurseActions.HallEntranceStartTime || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceEndTime = resp[1].data.rows[0].NurseActions.HallEntranceEndTime || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaStartTime = resp[1].data.rows[0].NurseActions.AnesthesiaStartTime || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaEndTime = resp[1].data.rows[0].NurseActions.AnesthesiaEndTime || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStartTime = resp[1].data.rows[0].NurseActions.SurgeryStartTime || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryEndTime = resp[1].data.rows[0].NurseActions.SurgeryEndTime || "";

                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstNeedles = resp[1].data.rows[0].NurseActions.SurgicalFirstNeedles || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstBlades = resp[1].data.rows[0].NurseActions.SurgicalFirstBlades || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstOthers = resp[1].data.rows[0].NurseActions.SurgicalFirstOthers || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstTime = resp[1].data.rows[0].NurseActions.SurgicalFirstTime || "";

                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondNeedles = resp[1].data.rows[0].NurseActions.SurgicalSecondNeedles || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondBlades = resp[1].data.rows[0].NurseActions.SurgicalSecondBlades || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondOthers = resp[1].data.rows[0].NurseActions.SurgicalSecondOthers || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondTime = resp[1].data.rows[0].NurseActions.SurgicalSecondTime || "";

                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalNeedles = resp[1].data.rows[0].NurseActions.SurgicalFinalNeedles || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalBlades = resp[1].data.rows[0].NurseActions.SurgicalFinalBlades || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalOthers = resp[1].data.rows[0].NurseActions.SurgicalFinalOthers || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalTime = resp[1].data.rows[0].NurseActions.SurgicalFinalTime || "";

                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.ArmsToTheBody = resp[1].data.rows[0].NurseActions.SafetyDevicePosition.ArmsToTheBody || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.Strap = resp[1].data.rows[0].NurseActions.SafetyDevicePosition.Strap || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.AnotherRailing = resp[1].data.rows[0].NurseActions.SafetyDevicePosition.AnotherRailing || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePositionNotes = resp[1].data.rows[0].NurseActions.SafetyDevicePositionNotes || "";

                    $scope.IntraOpQuickSummaryObj.NurseActionobj.HydrationIV = resp[1].data.rows[0].NurseActions.HydrationIV || false;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.Cleansed = resp[1].data.rows[0].NurseActions.Cleansed || false;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.Dirty = resp[1].data.rows[0].NurseActions.Dirty || false;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.Contaminated = resp[1].data.rows[0].NurseActions.Contaminated || false;

                    $scope.IntraOpQuickSummaryObj.NurseActionobj.PatientTolerated = resp[1].data.rows[0].NurseActions.PatientTolerated || false;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.Disposition = resp[1].data.rows[0].NurseActions.Disposition || false;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.CarePostoperative = resp[1].data.rows[0].NurseActions.CarePostoperative || false;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.Recoveryroom = resp[1].data.rows[0].NurseActions.Recoveryroom || false;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.OthersIntraData = resp[1].data.rows[0].NurseActions.OthersIntraData || false;


                    $scope.IntraOpQuickSummaryObj.AnesthesiaTypelist = resp[1].data.rows[0].AnesthesiaTypelist || [];
                    $scope.IntraOpQuickSummaryObj.EBLValue = resp[1].data.rows[0].AnesthetistActions.EBLValue || "";
                    $scope.IntraOpQuickSummaryObj.IntakeValue = resp[1].data.rows[0].AnesthetistActions.IntakeValue || "";
                    $scope.IntraOpQuickSummaryObj.OutputValue = resp[1].data.rows[0].AnesthetistActions.OutputValue || "";
                    $scope.IntraOpQuickSummaryObj.InTime = resp[1].data.rows[0].AnesthetistActions.InTime || "";
                    $scope.IntraOpQuickSummaryObj.OutTime = resp[1].data.rows[0].AnesthetistActions.OutTime || "";
                    $scope.IntraOpQuickSummaryObj.AnesthesiaMedications = resp[1].data.rows[0].AnesthesiaMedications || [];
                    
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.CauteraisationOthers = resp[1].data.rows[0].NurseActions.CauteraisationOthers || "";
                    //$scope.IntraOpQuickSummaryObj.Pathology = resp[1].data.rows[0].Pathology || "";

                    // CDE //
                    $scope.IntraOpQuickSummaryObj.CDEOD = resp[1].data.rows[0].CDEOD || "";
                    $scope.IntraOpQuickSummaryObj.CDEOS = resp[1].data.rows[0].CDEOS || "";
                    $scope.IntraOpQuickSummaryObj.CDERemarks = resp[1].data.rows[0].CDERemarks || "";

                    if ($scope.IntraOpQuickSummaryObj.CDEOD != '' || $scope.IntraOpQuickSummaryObj.CDEOS != '' || $scope.IntraOpQuickSummaryObj.CDERemarks != '') {
                        $scope.IntraOpQuickSummaryObj.IsCDEInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsCDEInd = false;
                    }
                    //CDE//




                    if (resp[1].data.rows[0].SubOrganList.length > 0) {
                        if ($scope.IntraOpQuickSummaryObj.NurseActionobj.NurseActionArea == 'Lids') {
                            $scope.IntraOpQuickSummaryObj.NurseActionobj.SubOrganLidsList = resp[1].data.rows[0].SubOrganList;
                        }
                        else if ($scope.IntraOpQuickSummaryObj.NurseActionobj.NurseActionArea == 'Conjunctiva') {
                            $scope.IntraOpQuickSummaryObj.NurseActionobj.SubOrganConjunctivaList = resp[1].data.rows[0].SubOrganList;
                        }
                    }
                    let ndate = moment().format("YYYY-MM-DD");

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceStartTime != '') {
                        let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceStartTime;
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceStartTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm a");
                    }

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceEndTime != '') {
                        let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceEndTime;
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceEndTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm a");
                    }

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaStartTime != '') {

                        let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaStartTime;
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaStartTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm a");
                    }
                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaEndTime != '') {

                        let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaEndTime;
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaEndTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm a");
                    }
                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStartTime != '') {

                        let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStartTime;
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStartTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm a");
                    }
                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryEndTime != '') {

                        let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryEndTime;
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryEndTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm a");
                    }


                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstTime != '') {

                        let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstTime;
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm a");
                    }
                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondTime != '') {

                        let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondTime;
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm a");
                    }
                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalTime != '') {

                        let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalTime;
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm a");
                    }
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.DrainageOthers = resp[1].data.rows[0].NurseActions.DrainageOthers || "";

                    if (resp[1].data.rows[0].Cauteraisation.length > 0) {
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.Cauteraisation = resp[1].data.rows[0].Cauteraisation;
                        $scope.IntraOpQuickSummaryObj.IsIntraCauteraisationInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraCauteraisationInd = false;
                    }

                    var Nurselist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == resp[1].data.rows[0].NurseActions.SurgicalFirstVerifiedBy }, true);
                    Nurselist = Nurselist || [];
                    if (Nurselist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstVerifiedByName = angular.copy(Nurselist[0].FullName);
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstVerifiedBy = resp[1].data.rows[0].NurseActions.SurgicalFirstVerifiedBy;
                    } else {
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstVerifiedByName = '';
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstVerifiedBy = resp[1].data.rows[0].NurseActions.SurgicalFirstVerifiedBy || '';
                    }

                    var SNurselist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == resp[1].data.rows[0].NurseActions.SurgicalSecondVerifiedBy }, true);
                    SNurselist = SNurselist || [];
                    if (SNurselist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondVerifiedByName = angular.copy(SNurselist[0].FullName);
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondVerifiedBy = resp[1].data.rows[0].NurseActions.SurgicalSecondVerifiedBy;
                    } else {
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondVerifiedByName = '';
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondVerifiedBy = resp[1].data.rows[0].NurseActions.SurgicalSecondVerifiedBy || '';
                    }

                    var FNurselist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == resp[1].data.rows[0].NurseActions.SurgicalFinalVerifiedBy }, true);
                    FNurselist = FNurselist || [];
                    if (FNurselist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalVerifiedByName = angular.copy(FNurselist[0].FullName);
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalVerifiedBy = resp[1].data.rows[0].NurseActions.SurgicalFinalVerifiedBy;
                    } else {
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalVerifiedByName = '';
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalVerifiedBy = resp[1].data.rows[0].NurseActions.SurgicalFinalVerifiedBy || '';
                    }


                    $scope.IntraOpQuickSummaryObj.AnesthesiaReviewedBy = resp[1].data.rows[0].AnesthesiaReviewedBy || null;
                    if ($scope.IntraOpQuickSummaryObj.AnesthesiaReviewedBy != null) {
                        var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.IntraOpQuickSummaryObj.AnesthesiaReviewedBy });
                        if (ReviewedByArraylist.length > 0) {
                            $scope.IntraOpQuickSummaryObj.AnesthesiaReviewedByName = angular.copy(ReviewedByArraylist[0].FullName);
                        }
                    }

                    $scope.IntraOpQuickSummaryObj.CheckinCheckReviewedBy = resp[1].data.rows[0].CheckinCheckReviewedBy || null;
                    if ($scope.IntraOpQuickSummaryObj.CheckinCheckReviewedBy != null) {
                        var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.IntraOpQuickSummaryObj.CheckinCheckReviewedBy });
                        if (ReviewedByArraylist.length > 0) {
                            $scope.IntraOpQuickSummaryObj.CheckinCheckReviewedByName = angular.copy(ReviewedByArraylist[0].FullName);
                        }

                    }

                    $scope.IntraOpQuickSummaryObj.IntraOpMedications = resp[1].data.rows[0].IntraOpMedications || [];

                    angular.forEach($scope.allUserList, function (item) {

                        if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonId == item.DoctorID) {
                            $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName = item.FullName;

                            var License = '';
                            var Suffix = '';
                            if (item.SuffixName !== '') {
                                Suffix = item.SuffixName + ',';
                            }
                            if (item.LicenseNumber !== '') {
                                License = 'Lic: ' + item.LicenseNumber;
                            }

                            if (item.SuffixId == 10) {
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName = ' Dr. ' + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName + ' ' + Suffix + ' ' + License;
                            } else {
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName = $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName + ' ' + Suffix + ' ' + License;
                            }
                        }
                        if ($scope.IntraOpQuickSummaryObj.NurseActionobj.TechnicianId == item.DoctorID) {
                            $scope.IntraOpQuickSummaryObj.NurseActionobj.TechnicianName = item.FullName;
                        }
                        if ($scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistId == item.DoctorID) {
                            $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName = item.FullName;

                            var License = '';
                            var Suffix = '';
                            if (item.SuffixName !== '') {
                                Suffix = item.SuffixName + ',';
                            }
                            if (item.LicenseNumber !== '') {
                                License = 'Lic: ' + item.LicenseNumber;
                            }

                            if (item.SuffixId == 10) {
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName = ' Dr. ' + $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName + ' ' + Suffix + ' ' + License;
                            } else {
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName = $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName + ' ' + Suffix + ' ' + License;
                            }
                        }
                        if ($scope.IntraOpQuickSummaryObj.NurseActionobj.NurseId == item.DoctorID) {
                            $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseName = item.UserFullName;
                        }
                        if ($scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonId == item.DoctorID) {
                            $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName = item.FullName;
                            var License = '';
                            var Suffix = '';
                            if (item.SuffixName !== '') {
                                Suffix = item.SuffixName + ',';
                            }
                            if (item.LicenseNumber !== '') {
                                License = 'Lic: ' + item.LicenseNumber;
                            }

                            if (item.SuffixId == 10) {
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName = ' Dr. ' + $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName + ' ' + Suffix + ' ' + License;
                            } else {
                                $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName = $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName + ' ' + Suffix + ' ' + License;
                            }
                        }
                        if ($scope.IntraOpQuickSummaryObj.NurseActionobj.ReliefId == item.DoctorID) {
                            $scope.IntraOpQuickSummaryObj.NurseActionobj.ReliefName = item.FullName;
                        }
                        if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SupportingStaffId == item.DoctorID) {
                            $scope.IntraOpQuickSummaryObj.NurseActionobj.SupportingStaffName = item.FullName;
                        }
                    });

                    $scope.ModifiedAnesthesiaDate = "";
                    $scope.ModifiedIntraopDate = "";

                    if ($scope.IntraOpQuickSummaryObj.AnesthesiaMedications.length > 0) {
                        angular.forEach($scope.IntraOpQuickSummaryObj.AnesthesiaMedications, function (hitem) {
                            var dateTimeString = hitem.ModifiedDt;
                            $scope.ModifiedAnesthesiaDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                        });
                    }
                    if ($scope.IntraOpQuickSummaryObj.IntraOpMedications.length > 0) {
                        angular.forEach($scope.IntraOpQuickSummaryObj.IntraOpMedications, function (hitem) {
                            var dateTimeString = hitem.ModifiedDt;
                            $scope.ModifiedIntraopDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                        });
                    }

                    let nurselist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 5 }, true);
                    if (nurselist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraProcedureInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraProcedureInd = false;
                    }

                    let anticipationlist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 6 }, true);
                    if (anticipationlist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseAnticipationOfCriticalInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseAnticipationOfCriticalInd = false;
                    }

                    let timeoutlist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 7 }, true);
                    if (timeoutlist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseTimeOutStopBeforeInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseTimeOutStopBeforeInd = false;
                    }

                    let antibioticlist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 8 }, true);
                    if (antibioticlist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseAntibioticProphylaxisInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseAntibioticProphylaxisInd = false;
                    }

                    let otherslist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 9 }, true);
                    if (otherslist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraOthersInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraOthersInd = false;
                    }

                    let identificationlist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 10 }, true);
                    if (identificationlist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistIdentificationOfPatientsInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistIdentificationOfPatientsInd = false;
                    }

                    let insertionlist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 11 }, true);
                    if (insertionlist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistMarkOfPreviouslyInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistMarkOfPreviouslyInd = false;
                    }

                    let preprocedurelist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 12 }, true);
                    if (preprocedurelist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistPreprocedurereqInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistPreprocedurereqInd = false;
                    }

                    let patienthaslist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 13 }, true);
                    if (patienthaslist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistPatientHasInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistPatientHasInd = false;
                    }

                    let implantlist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 14 }, true);
                    if (implantlist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistImplantInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistImplantInd = false;
                    }

                    let monitorslist = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 15 }, true);
                    if (monitorslist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistMonitorsInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistMonitorsInd = false;
                    }

                    let Anesthesiacheck = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 16 }, true);
                    if (Anesthesiacheck.length > 0) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthesiacheckInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthesiacheckInd = false;
                    }

                    let pulseOximeter = $filter("filter")($scope.IntraOpQuickSummaryObj.PatientAscChecklist, { "CheckListSubTypeId": 17 }, true);
                    if (pulseOximeter.length > 0) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpPulseOximeterInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpPulseOximeterInd = false;
                    }

                    if ($scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraProcedureInd || $scope.IntraOpQuickSummaryObj.IsIntraOpNurseAnticipationOfCriticalInd || $scope.IntraOpQuickSummaryObj.IsIntraOpNurseTimeOutStopBeforeInd || $scope.IntraOpQuickSummaryObj.IsIntraOpNurseAntibioticProphylaxisInd || $scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraOthersInd || $scope.IntraOpQuickSummaryObj.NurseActionobj.ChecklistRemarks != '') {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseMainInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseMainInd = false;
                    }

                    if ($scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistIdentificationOfPatientsInd || $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistMarkOfPreviouslyInd || $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistPreprocedurereqInd || $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistPatientHasInd || $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistImplantInd || $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistMonitorsInd || $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthesiacheckInd || $scope.IntraOpQuickSummaryObj.IsIntraOpPulseOximeterInd) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistPreAnesthesiaInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthetistPreAnesthesiaInd = false;
                    }

                    // Anesthetist Actions Graph

                    if (resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray.length > 0) {
                        $scope.AnesthetistVitals = angular.copy($scope.GetAnesthetistVitals());
                        angular.forEach(resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray, function (item) {
                            angular.forEach($scope.AnesthetistVitals, function (kitem) {
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

                        $scope.NewTimeSlots = [];

                        let tempArray = $filter('filter')($scope.AnesthetistVitals, { 'VitalName': 'Systolic Pressure' }, true);
                        if (tempArray.length > 0) {
                            if (tempArray[0].VitalReadingList.length > 0) {
                                angular.forEach(tempArray[0].VitalReadingList, function (kitem) {
                                    //$scope.NewTimeSlots.push({ 'time': kitem.VitalSlotTime });
                                    kitem.DeleteInd = kitem.DeleteInd || 'N';
                                    if (kitem.DeleteInd == 'N') {
                                        let dummydate = "2024-01-01";
                                        let dummydatetime = dummydate + " " + kitem.VitalSlotTime;
                                        let newtime = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");
                                        let tempArray = kitem.VitalSlotTime.split(":");
                                        let stringCounter = tempArray.join("");
                                        let counter = parseInt(stringCounter);
                                        $scope.NewTimeSlots.push({ 'time': kitem.VitalSlotTime, 'NewTime': newtime, 'counter': counter });
                                    }
                                });
                            }
                        }
                    }

                    $scope.AnesthetistVitals = $scope.AnesthetistVitals || [];
                    if ($scope.AnesthetistVitals.length > 0) {
                        var count = 0;
                        angular.forEach($scope.AnesthetistVitals, function (kitem) {
                            if (kitem.VitalReadingList.length > 0) {
                                count++;
                            }
                        });
                        if (count == 0) {
                            $scope.IntraOpQuickSummaryObj.IsIntraOPAnesthesiaActionVitalsArrayEmpty = true;
                        }
                    }
                    // Anesthesia Medicines

                    if (resp[1].data.rows[0].AnesthetistActions.AnesthesiaMedicines.length > 0) {
                        $scope.AnesthesiaMedicines = angular.copy(resp[1].data.rows[0].AnesthetistActions.AnesthesiaMedicines);
                    }

                    $scope.IntraOpQuickSummaryObj.OrdersReviewedDate = resp[1].data.rows[0].OrdersReviewedDate;
                    $scope.IntraOpQuickSummaryObj.OrdersReviewedTime = resp[1].data.rows[0].OrdersReviewedtime;
                    $scope.IntraOpQuickSummaryObj.DocumentDetails = angular.copy(resp[1].data.rows[0].DocumentDetails);

                    $scope.IntraOpQuickSummaryObj.SurgeonOperativeNotes = resp[1].data.rows[0].SurgeonOperativeNotes;
                    $scope.IntraOpQuickSummaryObj.Complications = resp[1].data.Complications || "";
                    $scope.IntraOpQuickSummaryObj.Findings = resp[1].data.rows[0].Findings;
                    //$scope.IntraOpQuickSummaryObj.MedicineOrdersInstructions = resp[1].data.rows[0].MedicineOrdersInstructions || "";
                    $scope.IntraOpQuickSummaryObj.S3URL = resp[1].data.rows[0].S3URL || "";

                    $scope.IntraOpQuickSummaryObj.ReviewDoctorId = resp[1].data.rows[0].ReviewDoctorId != null ? resp[1].data.rows[0].ReviewDoctorId : "";
                    $scope.IntraOpQuickSummaryObj.ReviewNurseId = resp[1].data.rows[0].ReviewNurseId != null ? resp[1].data.rows[0].ReviewNurseId : "";
                    $scope.IntraOpQuickSummaryObj.ReviewAnesthetistId = resp[1].data.rows[0].ReviewAnesthetistId != null ? resp[1].data.rows[0].ReviewAnesthetistId : "";
                    $scope.IntraOpQuickSummaryObj.ReviewTechnicianId = resp[1].data.rows[0].ReviewTechnicianId != null ? resp[1].data.rows[0].ReviewTechnicianId : "";
                    $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewId = resp[1].data.rows[0].AnesthesiaMedicationsReviewId != null ? resp[1].data.rows[0].AnesthesiaMedicationsReviewId : "";
                    $scope.IntraOpQuickSummaryObj.MedicationsReviewId = resp[1].data.rows[0].MedicationsReviewId != null ? resp[1].data.rows[0].MedicationsReviewId : "";

                    if ($scope.IntraOpQuickSummaryObj.ReviewDoctorId != 0 || $scope.IntraOpQuickSummaryObj.ReviewDoctorId != null) {
                        var doctorlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpQuickSummaryObj.ReviewDoctorId });
                    }
                    doctorlist = doctorlist || [];
                    if (doctorlist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.DoctorName = angular.copy(doctorlist[0].FullName);
                        $scope.IntraOpQuickSummaryObj.DoctorSuffix = angular.copy(doctorlist[0].SuffixName);
                        $scope.IntraOpQuickSummaryObj.DoctorLicense = angular.copy(doctorlist[0].LicenseNumber)
                        if (doctorlist[0].SuffixId == 10) {
                            $scope.IntraOpQuickSummaryObj.DoctorName = ' Dr. ' + $scope.IntraOpQuickSummaryObj.DoctorName;
                        }
                    } else {
                        $scope.IntraOpQuickSummaryObj.DoctorName = '';
                        $scope.IntraOpQuickSummaryObj.DoctorSuffix = '';
                        $scope.IntraOpQuickSummaryObj.DoctorLicense = '';
                    }

                    if ($scope.IntraOpQuickSummaryObj.ReviewAnesthetistId != 0 || $scope.IntraOpQuickSummaryObj.ReviewAnesthetistId != null) {
                        var anesthlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpQuickSummaryObj.ReviewAnesthetistId });
                    }
                    anesthlist = anesthlist || [];
                    if (anesthlist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.AnesthesiaName = angular.copy(anesthlist[0].FullName);
                        $scope.IntraOpQuickSummaryObj.AnesthesiaSuffix = angular.copy(anesthlist[0].SuffixName);
                        $scope.IntraOpQuickSummaryObj.AnesthesiaLicense = angular.copy(anesthlist[0].LicenseNumber);
                        if (anesthlist[0].SuffixId == 10) {
                            $scope.IntraOpQuickSummaryObj.AnesthesiaName = ' Dr. ' + $scope.IntraOpQuickSummaryObj.AnesthesiaName;
                        }
                    } else {
                        $scope.IntraOpQuickSummaryObj.AnesthesiaName = '';
                        $scope.IntraOpQuickSummaryObj.AnesthesiaSuffix = '';
                        $scope.IntraOpQuickSummaryObj.AnesthesiaLicense = '';
                    }

                    if ($scope.IntraOpQuickSummaryObj.ReviewNurseId != 0 || $scope.IntraOpQuickSummaryObj.ReviewNurseId != null) {
                        var Nurslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpQuickSummaryObj.ReviewNurseId });
                    }
                    Nurslist = Nurslist || [];
                    if (Nurslist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.NurseName = angular.copy(Nurslist[0].FullName);
                        $scope.IntraOpQuickSummaryObj.NurseSuffix = angular.copy(Nurslist[0].SuffixName);
                        $scope.IntraOpQuickSummaryObj.NurseLicense = angular.copy(Nurslist[0].LicenseNumber);
                    } else {
                        $scope.IntraOpQuickSummaryObj.NurseName = '';
                        $scope.IntraOpQuickSummaryObj.NurseSuffix = '';
                        $scope.IntraOpQuickSummaryObj.NurseLicense = '';
                    }

                    if ($scope.IntraOpQuickSummaryObj.ReviewTechnicianId != 0 || $scope.IntraOpQuickSummaryObj.ReviewTechnicianId != null) {
                        var techlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpQuickSummaryObj.ReviewTechnicianId });
                    }
                    techlist = techlist || [];
                    if (techlist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.TechnicianName = angular.copy(techlist[0].FullName);
                        $scope.IntraOpQuickSummaryObj.TechnicianSuffix = angular.copy(techlist[0].SuffixName);
                        $scope.IntraOpQuickSummaryObj.TechnicianLicense = angular.copy(techlist[0].LicenseNumber);
                    } else {
                        $scope.IntraOpQuickSummaryObj.TechnicianName = '';
                        $scope.IntraOpQuickSummaryObj.TechnicianSuffix = '';
                        $scope.IntraOpQuickSummaryObj.TechnicianLicense = '';
                    }

                    if ($scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewId != 0 || $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewId != null) {
                        var techlist1 = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewId });
                    }

                    techlist1 = techlist1 || [];
                    if (techlist1.length > 0) {
                        var SuffixName = '';
                        techlist1[0].SuffixName = techlist1[0].SuffixName || '';
                        if (techlist1[0].SuffixName != "") {
                            SuffixName = techlist1[0].SuffixName + ',';
                        }

                        var LicenseNumber = "";

                        techlist1[0].LicenseNumber = techlist1[0].LicenseNumber || "";
                        if (techlist1[0].LicenseNumber != "") {
                            LicenseNumber = 'Lic:' + ' ' + techlist1[0].LicenseNumber + ',';
                        }

                        if (techlist1[0].SuffixId == 10) {
                            $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewName = angular.copy('Dr. ' + techlist1[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        } else {
                            $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewName = angular.copy(techlist1[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        }

                    } else {
                        $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewName = "";
                    }

                    if ($scope.IntraOpQuickSummaryObj.MedicationsReviewId != 0 || $scope.IntraOpQuickSummaryObj.MedicationsReviewId != null) {
                        var techlist2 = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpQuickSummaryObj.MedicationsReviewId });
                    }
                    techlist2 = techlist2 || [];
                    if (techlist2.length > 0) {

                        var SuffixName = '';

                        techlist2[0].SuffixName = techlist2[0].SuffixName || "";
                        if (techlist2[0].SuffixName != "") {
                            SuffixName = techlist2[0].SuffixName + ',';
                        }

                        var LicenseNumber = "";
                        techlist2[0].LicenseNumber = techlist2[0].LicenseNumber || "";
                        if (techlist2[0].LicenseNumber != "") {
                            LicenseNumber = 'Lic:' + ' ' + techlist2[0].LicenseNumber + ',';
                        }

                        if (techlist2[0].SuffixId == 10) {
                            $scope.IntraOpQuickSummaryObj.MedicationsReviewName = angular.copy('Dr. ' + techlist2[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        } else {
                            $scope.IntraOpQuickSummaryObj.MedicationsReviewName = angular.copy(techlist2[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        }
                    }
                    else {
                        $scope.IntraOpQuickSummaryObj.MedicationsReviewName = "";
                    }

                    $scope.IntraOpQuickSummaryObj.ReviewAnesthesiologistId = resp[1].data.rows[0].ReviewAnesthesiologistId || null;



                    if ($scope.IntraOpQuickSummaryObj.ReviewAnesthesiologistId != null) {
                        var anesthesiologist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpQuickSummaryObj.ReviewAnesthesiologistId });
                    }
                    anesthesiologist = anesthesiologist || [];

                    if (anesthesiologist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.AnesthesiologistName = angular.copy(anesthesiologist[0].FullName);
                        $scope.IntraOpQuickSummaryObj.AnesthesiologistSuffix = angular.copy(anesthesiologist[0].SuffixName);
                        $scope.IntraOpQuickSummaryObj.AnesthesiologistLicense = angular.copy(anesthesiologist[0].LicenseNumber);
                        if (anesthesiologist[0].SuffixId == 10) {
                            $scope.IntraOpQuickSummaryObj.AnesthesiologistName = ' Dr. ' + $scope.IntraOpQuickSummaryObj.AnesthesiologistName;
                        }
                        else {
                            $scope.IntraOpQuickSummaryObj.AnesthesiologistName = $scope.IntraOpQuickSummaryObj.AnesthesiologistName || "";
                        }
                    } else {
                        $scope.IntraOpQuickSummaryObj.AnesthesiologistName = '';
                        $scope.IntraOpQuickSummaryObj.AnesthesiologistSuffix = '';
                        $scope.IntraOpQuickSummaryObj.AnesthesiologistLicense = '';
                    }

                    $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsNotes = resp[1].data.rows[0].AnesthesiaMedicationsNotes || "";
                    $scope.IntraOpQuickSummaryObj.MedicationsNotes = resp[1].data.rows[0].MedicationsNotes || "";

                    if ($scope.IntraOpQuickSummaryObj.DoctorName != '' || $scope.IntraOpQuickSummaryObj.AnesthesiaName != '' || $scope.IntraOpQuickSummaryObj.NurseName != '') {
                        $scope.IntraOpQuickSummaryObj.ReviewedbyInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.ReviewedbyInd = false;
                    }

                    var temparray1 = [];
                    var temparray1 = $filter("filter")($scope.IntraOpQuickSummaryObj.DocumentDetails, { "FileTypeId": 20 }, true);

                    if (temparray1.length > 0) {
                        $scope.IntraOpQuickSummaryObj.IntraAnesthesiaUploadfileInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IntraAnesthesiaUploadfileInd = false;
                    }

                    var temparray2 = [];
                    var temparray2 = $filter("filter")($scope.IntraOpQuickSummaryObj.DocumentDetails, { "FileTypeId": 19 }, true);

                    if (temparray2.length > 0) {
                        $scope.IntraOpQuickSummaryObj.IntraNurseUploadfileInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IntraNurseUploadfileInd = false;
                    }

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.Sterilewater == '' && $scope.IntraOpQuickSummaryObj.NurseActionobj.Alcohol == '' && $scope.IntraOpQuickSummaryObj.NurseActionobj.Levelofconsciousness == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.PatientPosition == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.AnotherRailing == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.ArmsToTheBody == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.Others == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.Strap == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SkinPreparation == "" && $scope.IntraOpQuickSummaryObj.PatientStableSurgery == false && $scope.IntraOpQuickSummaryObj.AdequatePreoperativeWorkup == false ) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraPreOpCallInd = false;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraPreOpCallInd = true;
                    }

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.AreaNotes == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.EspecimenLab == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseActionOrganId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.CropHour == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseActionArea == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.EspecimenLabNotes == "") {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpEspecimenLab = false;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpEspecimenLab = true;
                    }

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.TechnicianId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.ReliefId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.SupportingStaffId == null) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgeryStaffInd = false;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgeryStaffInd = true;
                    }

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceStartTime == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceEndTime == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStartTime == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryEndTime == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaStartTime == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaEndTime == "") {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgeryTimesInd = false;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgeryTimesInd = true;
                    }

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstNeedles != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstBlades != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstOthers != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstVerifiedBy != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstTime != "") {
                        $scope.IntraOpQuickSummaryObj.IsSurgicalCountFirstInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsSurgicalCountFirstInd = false;
                    }

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondNeedles != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondBlades != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondOthers != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondVerifiedBy != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondTime != "") {
                        $scope.IntraOpQuickSummaryObj.IsSurgicalCountSecondInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsSurgicalCountSecondInd = false;
                    }

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalNeedles != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalBlades != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalOthers != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalVerifiedBy != "" || $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalTime != "") {
                        $scope.IntraOpQuickSummaryObj.IsSurgicalCountFinalInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsSurgicalCountFinalInd = false;
                    }

                    if ($scope.IntraOpQuickSummaryObj.IsSurgicalCountFirstInd || $scope.IntraOpQuickSummaryObj.IsSurgicalCountSecondInd || $scope.IntraOpQuickSummaryObj.IsSurgicalCountFinalInd) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgicalCountInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgicalCountInd = false;
                    }




                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceStartTime == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceEndTime == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStartTime == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryEndTime == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaStartTime == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaEndTime == "") {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgeryTimesInd = false;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgeryTimesInd = true;
                    }

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.Cleansed || $scope.IntraOpQuickSummaryObj.NurseActionobj.Contaminated || $scope.IntraOpQuickSummaryObj.NurseActionobj.Dirty) {
                        $scope.IntraOpQuickSummaryObj.IsIntraClasificationInd = true;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraClasificationInd = false;
                    }

                    $scope.ModifiedDate = "";
                    resp[1].data.rows[0].PatientAscChecklist = resp[1].data.rows[0].PatientAscChecklist || [];
                    if (resp[1].data.rows[0].PatientAscChecklist.length > 0) {
                        var dateTimeString = resp[1].data.rows[0].PatientAscChecklist[0].ModifiedDt || "";
                        $scope.ModifiedDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                    }

                    $scope.OverallModifiedDate = "";
                    resp[1].data.rows[0].ModifiedDt = resp[1].data.rows[0].ModifiedDt || [];
                    if (resp[1].data.rows[0].ModifiedDt != "") {
                        var dateTimeString = resp[1].data.rows[0].ModifiedDt || "";
                        $scope.OverallModifiedDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                    }

                    $scope.IntraOpQuickSummaryObj.IsBeforeAnesthesiaNormal = resp[1].data.rows[0].IsBeforeAnesthesiaNormal;
                    $scope.IntraOpQuickSummaryObj.IsBeforeIncisionNormal = resp[1].data.rows[0].IsBeforeIncisionNormal;
                    $scope.IntraOpQuickSummaryObj.IsBeforeORNormal = resp[1].data.rows[0].IsBeforeORNormal;

                    $scope.IntraOpQuickSummaryObj.BeforeAnesthesiaReviewedBy = resp[1].data.rows[0].BeforeAnesthesiaReviewedBy || null;
                    $scope.IntraOpQuickSummaryObj.BeforeIncisionReviewedBy = resp[1].data.rows[0].BeforeIncisionReviewedBy || null;
                    $scope.IntraOpQuickSummaryObj.BeforeORReviewedBy = resp[1].data.rows[0].BeforeORReviewedBy || null;

                    $scope.IntraOpQuickSummaryObj.OxygenType = resp[1].data.rows[0].OxygenType || "";
                    $scope.IntraOpQuickSummaryObj.OxygenQuantity = resp[1].data.rows[0].OxygenQuantity || "";

                    if ($scope.IntraOpQuickSummaryObj.BeforeAnesthesiaReviewedBy != null) {
                        let beforeanesthesiareviewedArray = $filter('filter')($scope.CheckinChecklistArray, { 'DoctorID': $scope.IntraOpQuickSummaryObj.BeforeAnesthesiaReviewedBy }, true) || [];
                        if (beforeanesthesiareviewedArray.length > 0) {

                            var SuffixName = '';
                            if (beforeanesthesiareviewedArray[0].SuffixName != "" && beforeanesthesiareviewedArray[0].SuffixName != null) {
                                SuffixName = beforeanesthesiareviewedArray[0].SuffixName + ',';
                            }

                            var LicenseNumber = "";
                            if (beforeanesthesiareviewedArray[0].LicenseNumber != "" && beforeanesthesiareviewedArray[0].LicenseNumber != null) {
                                LicenseNumber = 'Lic:' + ' ' + beforeanesthesiareviewedArray[0].LicenseNumber + ',';
                            }

                            if (beforeanesthesiareviewedArray[0].SuffixId == 10) {
                                $scope.IntraOpQuickSummaryObj.BeforeAnesthesiaReviewedByName = angular.copy('Dr. ' + beforeanesthesiareviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            } else {
                                $scope.IntraOpQuickSummaryObj.BeforeAnesthesiaReviewedByName = angular.copy(beforeanesthesiareviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            }
                        }
                    }

                    if ($scope.IntraOpQuickSummaryObj.BeforeIncisionReviewedBy != null) {
                        let beforeIncisionreviewedArray = $filter('filter')($scope.CheckinChecklistArray, { 'DoctorID': $scope.IntraOpQuickSummaryObj.BeforeIncisionReviewedBy }, true) || [];
                        if (beforeIncisionreviewedArray.length > 0) {

                            var SuffixName = '';
                            if (beforeIncisionreviewedArray[0].SuffixName != "" && beforeIncisionreviewedArray[0].SuffixName != null) {
                                SuffixName = beforeIncisionreviewedArray[0].SuffixName + ',';
                            }

                            var LicenseNumber = "";
                            if (beforeIncisionreviewedArray[0].LicenseNumber != "" && beforeIncisionreviewedArray[0].LicenseNumber != null) {
                                LicenseNumber = 'Lic:' + ' ' + beforeIncisionreviewedArray[0].LicenseNumber + ',';
                            }

                            if (beforeIncisionreviewedArray[0].SuffixId == 10) {
                                $scope.IntraOpQuickSummaryObj.BeforeIncisionReviewedByName = angular.copy('Dr. ' + beforeIncisionreviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            } else {
                                $scope.IntraOpQuickSummaryObj.BeforeIncisionReviewedByName = angular.copy(beforeIncisionreviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            }
                        }
                    }

                    if ($scope.IntraOpQuickSummaryObj.BeforeORReviewedBy != null) {
                        let beforeORreviewedArray = $filter('filter')($scope.CheckinChecklistArray, { 'DoctorID': $scope.IntraOpQuickSummaryObj.BeforeORReviewedBy }, true);
                        if (beforeORreviewedArray.length > 0) {

                            var SuffixName = '';
                            if (beforeORreviewedArray[0].SuffixName != "" && beforeORreviewedArray[0].SuffixName != null) {
                                SuffixName = beforeORreviewedArray[0].SuffixName + ',';
                            }

                            var LicenseNumber = "";
                            if (beforeORreviewedArray[0].LicenseNumber != "" && beforeORreviewedArray[0].LicenseNumber != null) {
                                LicenseNumber = 'Lic:' + ' ' + beforeORreviewedArray[0].LicenseNumber + ',';
                            }

                            if (beforeORreviewedArray[0].SuffixId == 10) {
                                $scope.IntraOpQuickSummaryObj.BeforeORReviewedByName = angular.copy('Dr. ' + beforeORreviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            } else {
                                $scope.IntraOpQuickSummaryObj.BeforeORReviewedByName = angular.copy(beforeORreviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            }
                        }
                    }

                }

            } else {
                $scope.IntraOpQuickSummaryObj.PatientASCIntraOPId = 0;
                $scope.IntraOpQuickSummaryObj.Vitals = [];

                $scope.IntraOpSummaryObj.IsIntraOpVitalsInd = false;
                $scope.IntraOpSummaryObj.ReviewedbyInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpROSMainInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpROSSystemiInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpROSSurgicalInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpROSAllergiesInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpROSPhysicalInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpNurseIntraProcedureInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpNurseAnticipationOfCriticalInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpNurseTimeOutStopBeforeInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpNurseAntibioticProphylaxisInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpNurseIntraRemarksInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpNurseMainInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpNurseIntraOthersInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpNurseSurgeryTimesInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpNurseIntraPreOpCallInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpNurseSurgicalCountInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpAnesthetistActionInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpSurgeonMainInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpSurgeonDoctorNotesInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpSurgeonSurgeonOperativeNotesInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpOrdersMedicationInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpOrdersEyeDropsInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpOrdersInjectionsInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpOrdersLabsInvestigationsInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpOrdersMainInd = false;
                $scope.IntraOpSummaryObj.IsSurgeonInd = false;
                $scope.IntraOpSummaryObj.IsAnesthetistNotesInd = false;
                $scope.IntraOpSummaryObj.IsIntraSurgeonComplicationNotes = false;
                $scope.IntraOpSummaryObj.IsIntraDrainageInd = false;
                $scope.IntraOpSummaryObj.IsIntraClasificationInd = false;
                $scope.IntraOpSummaryObj.IsIntraCauteraisationInd = false;
                $scope.IntraOpSummaryObj.IsIntraNurseActionInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpDiagnosisInd = false;
                $scope.IntraOpSummaryObj.IsSurgicalCountFirstInd = false;
                $scope.IntraOpSummaryObj.IsSurgicalCountSecondInd = false;
                $scope.IntraOpSummaryObj.IsSurgicalCountFinalInd = false;
                $scope.IntraOpSummaryObj.IsIntraOpEspecimenLab = false;
                $scope.IntraOpQuickSummaryObj.IsCDEInd = false;

            }
        });
    }

    $scope.GetPostOpChartData = function () {

        let appointmentId = null;
        if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
            appointmentId = $scope.cacheStorageItem.AppointmentId;
        }

        if ($scope.cacheStorageItem.AppointmentTypeId == 7 || $scope.cacheStorageItem.AppointmentTypeId == 6) {
            appointmentId = $scope.cacheStorageItem.AscAppointmentId;
        }

        let req = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "CheckListModuleId": 3
        };

        let reqObj = {
            "ParentOrganizationId": $scope.ParenthospitalId
        };

        let params = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": appointmentId || null,
            "PatientId": $scope.cacheStorageItem.PatientID || null
        };

        $q.all([
            eHnoteSurgeryService.GetOrganizationASCCheckListData(req),
            eHnoteSurgeryService.GetOrganizationPreOpMedications($scope.ParenthospitalId),
            eHnoteSurgeryService.GetPostOpChartData(params)

        ]).then(function (resp) {

            // patient goals
            resp[0].data.goalsList = resp[0].data.goalsList || [];
            if (resp[0].data.goalsList.length > 0) {
                $scope.PostOpQuickSummaryObj.MasterAscPatientGoal = angular.copy(resp[0].data.goalsList);
            }

            if ($scope.PostOpQuickSummaryObj.MasterAscPatientGoal.length > 0) {
                angular.forEach($scope.PostOpQuickSummaryObj.MasterAscPatientGoal, function (Gitem) {
                    Gitem.Value = "";
                    Gitem.DeleteInd = "N";
                });
            }

            if (resp[0].data.status === "Success") {
                $scope.PostOpQuickSummaryObj.OrgASCChecklist = angular.copy(resp[0].data.rows);
                angular.forEach($scope.PostOpQuickSummaryObj.OrgASCChecklist, function (item) {
                    item.IsChecked = false;
                });

                var list1 = $filter("filter")($scope.PostOpQuickSummaryObj.OrgASCChecklist, function (kitem, index) { return kitem.CheckListCategoryId == 4 && kitem.CheckListSubTypeId == 3 });
                var list2 = $filter("filter")($scope.PostOpQuickSummaryObj.OrgASCChecklist, function (kitem, index) { return kitem.CheckListCategoryId == 4 && kitem.CheckListSubTypeId == 4 });

                $scope.PostOpQuickSummaryObj.DischargeObj.DischargeCriteriaList = angular.copy(list1);
                $scope.PostOpQuickSummaryObj.DischargeObj.TransferList = angular.copy(list2);
            }

            if (resp[1].data.status === "Success") {
                angular.forEach(resp[1].data.rows, function (item) {
                    item.AscMedicationId = 0;
                    item.IsChecked = false;
                    item.DropTimings = [{ "MedicationTime": "" }, { "MedicationTime": "" }];
                });

                let temppostopMedications = $filter('filter')(resp[1].data.rows, { 'IsPostOpMed': true }, true);
                $scope.PostOpQuickSummaryObj.PostOpMedications = angular.copy(temppostopMedications);
            }

            if (resp[2].data.Status === "Success") {
                $scope.PostOpQuickSummaryObj.SurgeryList = angular.copy(resp[2].data.SurgeryList);
                $scope.PostOpQuickSummaryObj.AlderetScoreDetails = angular.copy(resp[2].data.PreOpAlderetScoreDetails);
                $scope.PostOpQuickSummaryObj.TotalAlderetScore = resp[2].data.TotalAlderetScore;
                $scope.PostOpQuickSummaryObj.ROSOverAllRemarks = resp[2].data.ROSOverAllRemarks;
                $scope.PostOpQuickSummaryObj.SurgicalHistory = angular.copy(resp[2].data.SurgicalHistory);
                $scope.PostOpQuickSummaryObj.SystemicHistory = angular.copy(resp[2].data.SystemicHistory);
                $scope.PostOpQuickSummaryObj.AllergyItems = angular.copy(resp[2].data.AllergyItems);
                $scope.PostOpQuickSummaryObj.LastSignOffUserDetails = resp[2].data.LastSignOffUserDetails || [];

                if (resp[2].data.CurrentEyeMedicationList.length > 0) {
                    $scope.PostOpQuickSummaryObj.CurrentEyeMedications = angular.copy(resp[2].data.CurrentEyeMedicationList);
                }

                if (resp[2].data.CurrentSystemicMedicationList.length > 0) {
                    $scope.PostOpQuickSummaryObj.CurrentSystemicMedicationsHistory = angular.copy(resp[2].data.CurrentSystemicMedicationList);
                }

                resp[2].data.PreAdmAnesthesiaTypelist = resp[2].data.PreAdmAnesthesiaTypelist || [];
                if (resp[2].data.PreAdmAnesthesiaTypelist.length > 0) {
                    $scope.PostOpQuickSummaryObj.AnesthesiaTypelist = angular.copy(resp[2].data.PreAdmAnesthesiaTypelist);
                }

                resp[2].data.IntraOpInvestigationsList = resp[2].data.IntraOpInvestigationsList || [];
                if (resp[2].data.IntraOpInvestigationsList.length > 0) {
                    $scope.PostOpQuickSummaryObj.SurgeonObj.InvestigationsList = angular.copy(resp[2].data.IntraOpInvestigationsList);
                }

                resp[2].data.IntraOpPrescription = resp[2].data.IntraOpPrescription || [];
                if (resp[2].data.IntraOpPrescription.length > 0) {
                    $scope.PostOpQuickSummaryObj.PrescriptionDetails = angular.copy(resp[2].data.IntraOpPrescription);
                }

                $scope.PostOpQuickSummaryObj.MedicineOrdersInstructions = resp[2].data.MedicineOrdersInstructions || "";
                resp[2].data.IntraOpHallEndTime = resp[2].data.IntraOpHallEndTime || "";
                if (resp[2].data.IntraOpHallEndTime != "") {
                    let dummydatetime = "2024-01-01" + " " + resp[2].data.IntraOpHallEndTime;
                    let time = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");
                    $scope.PostOpQuickSummaryObj.RecoveryStartTime = angular.copy(time);
                }

                if (resp[2].data.rows.length > 0) {

                    resp[2].data.rows[0].VitalsArray = resp[2].data.rows[0].VitalsArray || [];
                    if (resp[2].data.rows[0].VitalsArray.length > 0) {
                        angular.forEach(resp[2].data.rows[0].VitalsArray, function (item) {
                            var vitalslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.DoctorId });
                            if (vitalslist.length > 0) {
                                item.UserName = angular.copy(vitalslist[0].FullName);
                            }
                            let ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                            let edate = ndate + " " + item.VitalAddTime;

                            item.VitalAddTime = $filter('date')(new Date(edate), "hh:mm a");
                        });
                    }
                    //$scope.PostOpQuickSummaryObj.MedicineOrdersInstructions = resp[2].data.rows[0].MedicineOrdersInstructions || "";

                    $scope.PostOpQuickSummaryObj.Vitals = resp[2].data.rows[0].VitalsArray;
                    if ($scope.PostOpQuickSummaryObj.Vitals.length > 0) {
                        $scope.PostOpQuickSummaryObj.IsPostOpVitalsInd = true;
                    } else {
                        $scope.PostOpQuickSummaryObj.IsPostOpVitalsInd = false;
                    }

                    resp[2].data.rows[0].AnesthesiaTypelist = resp[2].data.rows[0].AnesthesiaTypelist || [];
                    if (resp[2].data.rows[0].AnesthesiaTypelist.length > 0) {
                        $scope.PostOpQuickSummaryObj.AnesthesiaTypelist = angular.copy(resp[2].data.rows[0].AnesthesiaTypelist);
                    }

                    $scope.PostOpQuickSummaryObj.Intake = resp[2].data.rows[0].Intake || "";
                    $scope.PostOpQuickSummaryObj.Output = resp[2].data.rows[0].Output || "";
                    $scope.PostOpQuickSummaryObj.EBL = resp[2].data.rows[0].EBL || "";
                    $scope.PostOpQuickSummaryObj.InTime = resp[2].data.rows[0].InTime || "";
                    $scope.PostOpQuickSummaryObj.OutTime = resp[2].data.rows[0].OutTime || "";

                    let ndate = moment().format("YYYY-MM-DD");
                    if ($scope.PostOpQuickSummaryObj.InTime != "") {
                        let edate = ndate + " " + $scope.PostOpQuickSummaryObj.InTime;
                        $scope.PostOpQuickSummaryObj.InTime = moment(edate).format("hh:mm A");
                    }

                    if ($scope.PostOpQuickSummaryObj.OutTime != "") {
                        let edate = ndate + " " + $scope.PostOpQuickSummaryObj.OutTime;
                        $scope.PostOpQuickSummaryObj.OutTime = moment(edate).format("hh:mm A");
                    }

                    resp[2].data.rows[0].OrgAscChecklist = resp[2].data.rows[0].OrgAscChecklist || [];
                    if (resp[2].data.rows[0].OrgAscChecklist.length > 0) {
                        angular.forEach(resp[2].data.rows[0].OrgAscChecklist, function (item) {
                            angular.forEach($scope.PostOpQuickSummaryObj.OrgASCChecklist, function (hitem) {
                                if (hitem.CheckListCategoryId === item.CheckListCategoryId && item.CheckListId === hitem.CheckListId) {
                                    hitem.IsChecked = true;
                                }
                            });
                        });
                    }

                    $scope.PostOpQuickSummaryObj.OxygenType = resp[2].data.rows[0].OxygenType || "";
                    $scope.PostOpQuickSummaryObj.OxygenQuantity = resp[2].data.rows[0].OxygenQuantity || "";

                    if ($scope.PostOpQuickSummaryObj.IsPostOpROSAllergiesInd || $scope.PostOpQuickSummaryObj.IsPostOpROSSystemiInd || $scope.PostOpQuickSummaryObj.IsPostOpROSSurgicalInd) {
                        $scope.PostOpQuickSummaryObj.IsPostOpROSMainInd = true;
                    } else {
                        $scope.PostOpQuickSummaryObj.IsPostOpROSMainInd = false;
                    }

                    $scope.PostOpQuickSummaryObj.DocumentDetails = angular.copy(resp[2].data.rows[0].DocumentDetails);

                    $scope.IsNurseFileUploads = false;

                    if ($scope.PostOpQuickSummaryObj.DocumentDetails.length > 0) {

                        var TempArray1 = $filter('filter')($scope.PostOpQuickSummaryObj.DocumentDetails, { 'NoteFileTypeId': 22 }, true);
                        if (TempArray1.length > 0) {
                            $scope.IsNurseFileUploads = true;
                        } else {
                            $scope.IsNurseFileUploads = false;
                        }
                    }

                    $scope.PostOpQuickSummaryObj.ReviewedBy = resp[2].data.rows[0].NurseReviewedBy || 0;
                    $scope.PostOpQuickSummaryObj.NurseReviewedBy = resp[2].data.rows[0].NurseReviewedBy || 0;

                    $scope.PostOpQuickSummaryObj.NurseReviewedDate = resp[2].data.rows[0].NurseReviewedDate;
                    $scope.PostOpQuickSummaryObj.NurseReviewedTime = resp[2].data.rows[0].NurseReviewedtime;

                    resp[2].data.rows[0].PostOpDiagnosis = resp[2].data.rows[0].PostOpDiagnosis || [];
                    if (resp[2].data.rows[0].PostOpDiagnosis.length > 0) {
                        $scope.PostOpQuickSummaryObj.PostOpDiagnosis = angular.copy(resp[2].data.rows[0].PostOpDiagnosis) || [];
                        $scope.PostOpQuickSummaryObj.IsPostOpDiagnosisInd = true;
                    } else {
                        $scope.PostOpQuickSummaryObj.IsPostOpDiagnosisInd = false;
                    }

                    if ($scope.PostOpQuickSummaryObj.NurseReviewedBy != 0 || $scope.PostOpQuickSummaryObj.NurseReviewedBy != null) {
                        var list1 = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.NurseReviewedBy });
                        if (list1.length > 0) {
                            $scope.PostOpQuickSummaryObj.NurseReviewedByName = angular.copy(list1[0].FullName);
                            $scope.PostOpQuickSummaryObj.IsNurseInd = true;
                        }
                        else {
                            $scope.PostOpQuickSummaryObj.IsNurseInd = false;
                        }
                    }
                    $scope.PostOpQuickSummaryObj.S3URL = resp[2].data.rows[0].S3URL || "";

                    $scope.PostOpQuickSummaryObj.DischargeObj.Complications = resp[2].data.rows[0].Complications || "";
                    $scope.PostOpQuickSummaryObj.DischargeObj.SurgeonOperativeNotes = resp[2].data.rows[0].SurgeonOperativeNotes || "";

                    // nurse checklists and actions
                    if (resp[2].data.rows[0].NurseCheckLists.length > 0) {
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PostOPNurseCheckListId = resp[2].data.rows[0].NurseCheckLists[0].PostOPNurseCheckListId;
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceived = resp[2].data.rows[0].NurseCheckLists[0].PatientReceived;
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.AccompaniedBy = resp[2].data.rows[0].NurseCheckLists[0].AccompaniedBy;
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevel = resp[2].data.rows[0].NurseCheckLists[0].PainLevel;
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevelRemarks = resp[2].data.rows[0].NurseCheckLists[0].PainLevelRemarks;
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.NourishmentProvider = resp[2].data.rows[0].NurseCheckLists[0].NourishmentProvider;
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.BloodSugar = resp[2].data.rows[0].NurseCheckLists[0].BloodSugar;
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PostOpInstruction = resp[2].data.rows[0].NurseCheckLists[0].PostOpInstruction;
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.ReceivedRoom = resp[2].data.rows[0].NurseCheckLists[0].ReceivedRoom;
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Patientallowed = resp[2].data.rows[0].NurseCheckLists[0].Patientallowed;
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Personalbelonging = resp[2].data.rows[0].NurseCheckLists[0].Personalbelonging;
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Patientadvised = resp[2].data.rows[0].NurseCheckLists[0].Patientadvised;
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientClinic = resp[2].data.rows[0].NurseCheckLists[0].PatientClinic;
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Physicianexamine = resp[2].data.rows[0].NurseCheckLists[0].Physicianexamine;
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Removedintact = resp[2].data.rows[0].NurseCheckLists[0].Removedintact;
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Orientedtimes = resp[2].data.rows[0].NurseCheckLists[0].Orientedtimes;
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.OtherMental = resp[2].data.rows[0].NurseCheckLists[0].OtherMental;
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Notes = resp[2].data.rows[0].NurseCheckLists[0].Notes;

                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevel = resp[2].data.rows[0].NurseCheckLists[0].PainLevel || "";
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevelRemarks = resp[2].data.rows[0].NurseCheckLists[0].PainLevelRemarks || "";
                    }
                    if ($scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceived != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.AccompaniedBy != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevel != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevelRemarks != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.NourishmentProvider != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.BloodSugar != ''
                        || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PostOpInstruction != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.ReceivedRoom != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Patientallowed != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Personalbelonging != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Patientadvised != ''
                        || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientClinic != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Physicianexamine != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Removedintact != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Orientedtimes != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.OtherMental != ''
                        || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Notes != '') {

                        $scope.PostOpQuickSummaryObj.IsPostOpChecklistInd = true;
                    } else {
                        $scope.PostOpQuickSummaryObj.IsPostOpChecklistInd = false;
                    }

                    if (resp[2].data.rows[0].NurseActions.length > 0) {
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.PostOPNurseActionId = resp[2].data.rows[0].NurseActions[0].PostOPNurseActionId;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Speech = resp[2].data.rows[0].NurseActions[0].Speech;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Vision = resp[2].data.rows[0].NurseActions[0].Vision;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Pain = resp[2].data.rows[0].NurseActions[0].Pain;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.ConsciousLevel = resp[2].data.rows[0].NurseActions[0].ConsciousLevel;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Fur = resp[2].data.rows[0].NurseActions[0].Fur;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.IncisionlaDrainage = resp[2].data.rows[0].NurseActions[0].IncisionlaDrainage;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Nausea = resp[2].data.rows[0].NurseActions[0].Nausea;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.IngestedFood = resp[2].data.rows[0].NurseActions[0].IngestedFood;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Referred = resp[2].data.rows[0].NurseActions[0].Referred;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Relationship = resp[2].data.rows[0].NurseActions[0].Relationship;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Exit = resp[2].data.rows[0].NurseActions[0].Exit;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Instruction = resp[2].data.rows[0].NurseActions[0].Instruction;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Prescription = resp[2].data.rows[0].NurseActions[0].Prescription;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.LensCard = resp[2].data.rows[0].NurseActions[0].LensCard;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Surveillance = resp[2].data.rows[0].NurseActions[0].Surveillance;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Bandage = resp[2].data.rows[0].NurseActions[0].Bandage;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Advancediet = resp[2].data.rows[0].NurseActions[0].Advancediet;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Discharge = resp[2].data.rows[0].NurseActions[0].Discharge;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Administer = resp[2].data.rows[0].NurseActions[0].Administer;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Tylenol = resp[2].data.rows[0].NurseActions[0].Tylenol;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Review = resp[2].data.rows[0].NurseActions[0].Review;
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Notes = resp[2].data.rows[0].NurseActions[0].Notes;
                    }
                    if ($scope.PostOpQuickSummaryObj.NurseChart.Actions.Speech != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Vision != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Pain != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.ConsciousLevel != '' ||
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Fur != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.IncisionlaDrainage != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Nausea != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.IngestedFood != '' ||
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Referred != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Relationship != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Exit != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Instruction != '' ||
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Prescription != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Discharge != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Administer != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Tylenol != '' ||
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Advancediet != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Speech != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Speech != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.Speech != '' ||
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Review != '') {

                        $scope.PostOpQuickSummaryObj.IsPostOpActionInd = true;

                    } else {
                        $scope.PostOpQuickSummaryObj.IsPostOpActionInd = false;
                    }

                    resp[2].data.rows[0].SurgeonInvestigations = resp[2].data.rows[0].SurgeonInvestigations || [];
                    if (resp[2].data.rows[0].SurgeonInvestigations.length > 0) {
                        $scope.PostOpQuickSummaryObj.SurgeonObj.InvestigationsList = angular.copy(resp[2].data.rows[0].SurgeonInvestigations);
                        $scope.PostOpQuickSummaryObj.IsLabInvestigationInd = true;
                    } else {
                        $scope.PostOpQuickSummaryObj.IsLabInvestigationInd = false;
                    }

                    $scope.PostOpQuickSummaryObj.SurgeonObj.DoctorNotes = resp[2].data.rows[0].DoctorNotes;
                    if ($scope.PostOpQuickSummaryObj.SurgeonObj.DoctorNotes != "") {
                        $scope.PostOpQuickSummaryObj.IsPostDoctorNotesInd = true;
                    } else {
                        $scope.PostOpQuickSummaryObj.IsPostDoctorNotesInd = false;
                    }

                    $scope.PostOpQuickSummaryObj.SurgeonObj.PostOpInstruction = resp[2].data.rows[0].PostOpInstruction;
                    if ($scope.PostOpQuickSummaryObj.SurgeonObj.PostOpInstruction != "") {
                        $scope.PostOpQuickSummaryObj.IsPostOpInstructionsInd = true;
                    } else {
                        $scope.PostOpQuickSummaryObj.IsPostOpInstructionsInd = false;
                    }
                    if ($scope.PostOpQuickSummaryObj.IsLabInvestigationInd || $scope.PostOpQuickSummaryObj.IsPostOpInstructionsInd || $scope.PostOpQuickSummaryObj.IsPostDoctorNotesInd || $scope.PostOpQuickSummaryObj.IsPostOpDiagnosisInd) {
                        $scope.PostOpQuickSummaryObj.IsPostOpSurgeonMainInd = true;
                    } else {
                        $scope.PostOpQuickSummaryObj.IsPostOpSurgeonMainInd = false;
                    }

                    // anesthesia tab

                    if (resp[2].data.rows[0].AnesthetistVitals.length > 0) {
                       /* $scope.AnesthetistVitals = angular.copy($scope.GetAnesthetistVitals());*/
                        $scope.PostopAnesthetistVitals = angular.copy($scope.GetPostopAnesthetistVitals());
                        angular.forEach(resp[2].data.rows[0].AnesthetistVitals, function (item) {
                            angular.forEach($scope.PostopAnesthetistVitals, function (kitem) {
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
                            });
                        });
                        if ($scope.PostopAnesthetistVitals.length > 0) {
                            angular.forEach($scope.PostopAnesthetistVitals, function (item) {
                                item.VitalValues = _.uniq(item.VitalValues, false, function (p) { return p.PostOPAnesthesiaVitalsId; });
                            });
                        }
                        $scope.NewTimeSlots = [];

                        let tempArray = $filter('filter')($scope.PostopAnesthetistVitals, { 'VitalName': 'Systolic Pressure' }, true);
                        if (tempArray.length > 0) {
                            tempArray[0].VitalValues = tempArray[0].VitalValues || [];
                            if (tempArray[0].VitalValues.length > 0) {
                                angular.forEach(tempArray[0].VitalValues, function (kitem) {
                                    //$scope.NewTimeSlots.push({ 'Time': kitem.VitalSlotTime });
                                    let dummydate = "2024-01-01";
                                    let dummydatetime = dummydate + " " + kitem.VitalSlotTime;
                                    let newtime = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");

                                    let tempArray = kitem.VitalSlotTime.split(":");
                                    let stringCounter = tempArray.join("");
                                    let counter = parseInt(stringCounter);

                                    $scope.NewTimeSlots.push({ 'time': kitem.VitalSlotTime, 'NewTime': newtime, 'counter': counter });
                                });
                            }
                        }
                    }

                    $scope.AldreteDetails = angular.copy($scope.GetAldreteDetails());

                    if (resp[2].data.rows[0].AldreteDetails.length > 0) {
                        angular.forEach(resp[2].data.rows[0].AldreteDetails, function (item) {
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
                    if (resp[2].data.rows[0].AldreteTotalScoreDetails.length > 0) {
                        angular.forEach(resp[2].data.rows[0].AldreteTotalScoreDetails, function (item) {
                            let obj = {
                                "PostOPAnesthesiaTotalScoreId": item.PostOPAnesthesiaTotalScoreId || null,
                                "AldreteSlotTime": item.AldreteSlotTime,
                                "TotalScore": item.TotalScore,
                                "DeleteInd": "N"
                            }
                            $scope.AldreteTotalScoreDetails.push(obj);
                        });
                    }

                    resp[2].data.rows[0].InvestigationsList = resp[2].data.rows[0].InvestigationsList || [];
                    if (resp[2].data.rows[0].InvestigationsList.length > 0) {
                        $scope.PostOpQuickSummaryObj.SurgeonObj.InvestigationsList = angular.copy(resp[2].data.rows[0].InvestigationsList);
                    } else {
                        $scope.PostOpQuickSummaryObj.SurgeonObj.InvestigationsList = [];
                    }
                    resp[2].data.rows[0].Prescription = resp[2].data.rows[0].Prescription || [];
                    if (resp[2].data.rows[0].Prescription.length > 0) {
                        $scope.PostOpQuickSummaryObj.PrescriptionDetails = angular.copy(resp[2].data.rows[0].Prescription);
                    } else {
                        $scope.PostOpQuickSummaryObj.PrescriptionDetails = [];
                    }

                    $scope.PostOpQuickSummaryObj.ReviewDoctorId = resp[2].data.rows[0].ReviewDoctorId != null ? resp[2].data.rows[0].ReviewDoctorId : "";
                    $scope.PostOpQuickSummaryObj.ReviewNurseId = resp[2].data.rows[0].ReviewNurseId != null ? resp[2].data.rows[0].ReviewNurseId : "";
                    $scope.PostOpQuickSummaryObj.ReviewAnesthetistId = resp[2].data.rows[0].ReviewAnesthetistId != null ? resp[2].data.rows[0].ReviewAnesthetistId : "";
                    $scope.PostOpQuickSummaryObj.ReviewTechnicianId = resp[2].data.rows[0].ReviewTechnicianId != null ? resp[2].data.rows[0].ReviewTechnicianId : "";


                    if ($scope.PostOpQuickSummaryObj.ReviewDoctorId != 0 || $scope.PostOpQuickSummaryObj.ReviewDoctorId != null) {
                        var doctorlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.ReviewDoctorId });
                    }
                    doctorlist = doctorlist || [];
                    if (doctorlist.length > 0) {
                        $scope.PostOpQuickSummaryObj.DoctorName = angular.copy(doctorlist[0].FullName);
                        $scope.PostOpQuickSummaryObj.DoctorSuffix = angular.copy(doctorlist[0].SuffixName);
                        $scope.PostOpQuickSummaryObj.DoctorLicense = angular.copy(doctorlist[0].LicenseNumber);
                        if (doctorlist[0].SuffixId == 10) {
                            $scope.PostOpQuickSummaryObj.DoctorName = ' Dr. ' + $scope.PostOpQuickSummaryObj.DoctorName;
                        }
                    } else {
                        $scope.PostOpQuickSummaryObj.DoctorName = "";
                        $scope.PostOpQuickSummaryObj.DoctorSuffix = '';
                        $scope.PostOpQuickSummaryObj.DoctorLicense = '';
                    }

                    if ($scope.PostOpQuickSummaryObj.ReviewAnesthetistId != 0 || $scope.PostOpQuickSummaryObj.ReviewAnesthetistId != null) {
                        var anesthlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.ReviewAnesthetistId });
                    }
                    anesthlist = anesthlist || [];
                    if (anesthlist.length > 0) {
                        $scope.PostOpQuickSummaryObj.AnesthesiaName = angular.copy(anesthlist[0].FullName);
                        $scope.PostOpQuickSummaryObj.AnesthesiaSuffix = angular.copy(anesthlist[0].SuffixName);
                        $scope.PostOpQuickSummaryObj.AnesthesiaLicense = angular.copy(anesthlist[0].LicenseNumber);
                        if (anesthlist[0].SuffixId == 10) {
                            $scope.PostOpQuickSummaryObj.AnesthesiaName = ' Dr. ' + $scope.PostOpQuickSummaryObj.AnesthesiaName;
                        }
                    } else {
                        $scope.PostOpQuickSummaryObj.AnesthesiaName = "";
                        $scope.PostOpQuickSummaryObj.AnesthesiaSuffix = '';
                        $scope.PostOpQuickSummaryObj.AnesthesiaLicense = '';
                    }

                    if ($scope.PostOpQuickSummaryObj.ReviewNurseId != 0 || $scope.PostOpQuickSummaryObj.ReviewNurseId != null) {
                        var Nurslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.ReviewNurseId });
                    }
                    Nurslist = Nurslist || [];
                    if (Nurslist.length > 0) {
                        $scope.PostOpQuickSummaryObj.NurseName = angular.copy(Nurslist[0].FullName);
                        $scope.PostOpQuickSummaryObj.NurseSuffix = angular.copy(Nurslist[0].SuffixName);
                        $scope.PostOpQuickSummaryObj.NurseLicense = angular.copy(Nurslist[0].LicenseNumber);
                    } else {
                        $scope.PostOpQuickSummaryObj.NurseName = "";
                        $scope.PostOpQuickSummaryObj.NurseSuffix = '';
                        $scope.PostOpQuickSummaryObj.NurseLicense = '';
                    }

                    if ($scope.PostOpQuickSummaryObj.ReviewTechnicianId != 0 || $scope.PostOpQuickSummaryObj.ReviewTechnicianId != null) {
                        var Technicianlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.ReviewTechnicianId });
                    }
                    Technicianlist = Technicianlist || [];
                    if (Technicianlist.length > 0) {
                        $scope.PostOpQuickSummaryObj.TechnicianName = angular.copy(Technicianlist[0].FullName);
                        $scope.PostOpQuickSummaryObj.TechnicianSuffix = angular.copy(Technicianlist[0].SuffixName);
                        $scope.PostOpQuickSummaryObj.TechnicianLicense = angular.copy(Technicianlist[0].LicenseNumber);
                    } else {
                        $scope.PostOpQuickSummaryObj.TechnicianName = "";
                        $scope.PostOpQuickSummaryObj.TechnicianSuffix = '';
                        $scope.PostOpQuickSummaryObj.TechnicianLicense = '';
                    }

                    if ($scope.PostOpQuickSummaryObj.DoctorName != '' || $scope.PostOpQuickSummaryObj.AnesthesiaName != '' || $scope.PostOpQuickSummaryObj.NurseName != '' || $scope.PostOpQuickSummaryObj.TechnicianName != '') {
                        $scope.PostOpQuickSummaryObj.ReviewedbyInd = true;
                    } else {
                        $scope.PostOpQuickSummaryObj.ReviewedbyInd = false;
                    }

                    if (resp[2].data.rows[0].PostOpMedications.length > 0) {
                        angular.forEach(resp[2].data.rows[0].PostOpMedications, function (item) {
                            angular.forEach($scope.PostOpQuickSummaryObj.PostOpMedications, function (hitem) {
                                if (item.MedicineId === hitem.MedicineId) {
                                    hitem.DropTimings = angular.copy(item.DropTimings);
                                    hitem.AscMedicationId = item.AscMedicationId;
                                    hitem.IsChecked = true;

                                    if (hitem.DropTimings.length > 0) {
                                        angular.forEach(hitem.DropTimings, function (Dropitem) {
                                            Dropitem.MedicationTime = Dropitem.MedicationTime || '';

                                            if (Dropitem.MedicationTime != '') {
                                                let Ndate = moment().format("YYYY-MM-DD");
                                                let Newdate = Ndate + " " + Dropitem.MedicationTime;
                                                Dropitem.MedicationTime = moment(Newdate, "YYYY-MM-DD HH:mm").format("hh:mm A");
                                            }
                                        });
                                    }
                                }
                            });
                        });
                    }

                    $scope.PostOpQuickSummaryObj.MedicationsReviewId = resp[2].data.rows[0].MedicationsReviewId != null ? resp[2].data.rows[0].MedicationsReviewId : null;
                    if ($scope.PostOpQuickSummaryObj.MedicationsReviewId != 0 || $scope.PostOpQuickSummaryObj.MedicationsReviewId != null) {
                        var reviewlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.MedicationsReviewId }) || [];
                    }
                    reviewlist = reviewlist || [];
                    if (reviewlist.length > 0) {

                        var SuffixName = '';
                        reviewlist[0].SuffixName = reviewlist[0].SuffixName || "";
                        if (reviewlist[0].SuffixName != "" && reviewlist[0].SuffixName != null) {
                            SuffixName = reviewlist[0].SuffixName + ',';
                        }

                        var LicenseNumber = "";
                        reviewlist[0].LicenseNumber = reviewlist[0].LicenseNumber || "";
                        if (reviewlist[0].LicenseNumber != "") {
                            LicenseNumber = 'Lic:' + ' ' + reviewlist[0].LicenseNumber + ',';
                        }


                        if (reviewlist[0].SuffixId == 10) {
                            $scope.PostOpQuickSummaryObj.MedicationsReviewName = angular.copy('Dr. ' + reviewlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        } else {
                            $scope.PostOpQuickSummaryObj.MedicationsReviewName = angular.copy(reviewlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        }

                    } else {
                        $scope.PostOpQuickSummaryObj.MedicationsReviewName = "";
                    }

                    $scope.ModifiedPostopDate = "";


                    if (resp[2].data.rows[0].PostOpMedications.length > 0) {
                        angular.forEach(resp[2].data.rows[0].PostOpMedications, function (hitem) {
                            var dateTimeString = hitem.ModifiedDt;

                            $scope.ModifiedPostopDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');

                        });
                    }

                    $scope.PostOpQuickSummaryObj.MedicationsNotes = resp[2].data.rows[0].MedicationsNotes || "";

                    // Progress Note

                    $scope.PostOpQuickSummaryObj.ProgressPatientStable = resp[2].data.rows[0].ProgressPatientStable || "";
                    $scope.PostOpQuickSummaryObj.ProgressPatientwheelchairNotes = resp[2].data.rows[0].ProgressPatientwheelchairNotes || "";
                    $scope.PostOpQuickSummaryObj.ProgressPatienttransferred = resp[2].data.rows[0].ProgressPatienttransferred || "";
                    $scope.PostOpQuickSummaryObj.IsPostProceduresNotes = resp[2].data.IsPostProceduresNotes || false;

                    resp[2].data.rows[0].RecoveryStartTime = resp[2].data.rows[0].RecoveryStartTime || '';
                    if (resp[2].data.rows[0].RecoveryStartTime != '') {
                        $scope.PostOpQuickSummaryObj.RecoveryStartTime = resp[2].data.rows[0].RecoveryStartTime || "";
                    }

                    resp[2].data.rows[0].RecoveryStopTime = resp[2].data.rows[0].RecoveryStopTime || "";
                    if (resp[2].data.rows[0].RecoveryStopTime != "") {
                        $scope.PostOpQuickSummaryObj.RecoveryStopTime = resp[2].data.rows[0].RecoveryStopTime || "";
                    }

                    if ($scope.PostOpQuickSummaryObj.ProgressPatientStable != '' || $scope.PostOpQuickSummaryObj.ProgressPatienttransferred != '' || $scope.PostOpQuickSummaryObj.ProgressPatientwheelchairNotes != '' || $scope.PostOpQuickSummaryObj.RecoveryStartTime != '' || $scope.PostOpQuickSummaryObj.RecoveryStopTime != '' || $scope.PostOpQuickSummaryObj.IsPostProceduresNotes == true) {
                        $scope.PostOpQuickSummaryObj.IsPostOpProgressNotesInd = true;
                    } else {
                        $scope.PostOpQuickSummaryObj.IsPostOpProgressNotesInd = false;
                    }

                    // patient goals functionality
                    $scope.PatientGoalsArray = resp[2].data.rows[0].PatientAscPatientGoal || [];
                    if (resp[2].data.rows[0].PatientAscPatientGoal.length > 0) {
                        angular.forEach(resp[2].data.rows[0].PatientAscPatientGoal, function (item) {
                            angular.forEach($scope.PostOpQuickSummaryObj.MasterAscPatientGoal, function (kitem) {
                                if (kitem.MasterPatientGoalId === item.MasterPatientGoalId) {
                                    kitem.Value = item.Value || "";
                                    kitem.ASCPatientGoalId = item.ASCPatientGoalId || null;
                                }
                            });
                        });
                    }

                    // Modified Date 

                    $scope.ModifiedDate = "";
                    resp[2].data.rows[0].ModifiedDt = resp[2].data.rows[0].ModifiedDt || "";
                    if (resp[2].data.rows[0].ModifiedDt != "") {
                        var dateTimeString = resp[2].data.rows[0].ModifiedDt || "";
                        $scope.ModifiedDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                    }

                    // High criteria 

                    $scope.PostOpQuickSummaryObj.HighCriteria = resp[2].data.rows[0].HighCriteria || "";
                    $scope.PostOpQuickSummaryObj.HighCriteriaRemarks = resp[2].data.rows[0].HighCriteriaRemarks || "";

                    if ($scope.PostOpQuickSummaryObj.HighCriteriaRemarks != '') {
                        $scope.PostOpQuickSummaryObj.ProgressRemarksInd = true;
                    } else {
                        $scope.PostOpQuickSummaryObj.ProgressRemarksInd = false;
                    }

                    $scope.PostOpQuickSummaryObj.CheckInReviewDoctorId = resp[2].data.rows[0].CheckInReviewDoctorId || null;
                    $scope.PostOpQuickSummaryObj.CheckInReviewNurseId = resp[2].data.rows[0].CheckInReviewNurseId || null;
                    $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistId = resp[2].data.rows[0].CheckInReviewAnesthetistId || null;


                    $scope.PostOpQuickSummaryObj.CheckInReviewDoctorName = "";
                    $scope.PostOpQuickSummaryObj.CheckInReviewNurseName = "";
                    $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistName = "";


                    if ($scope.PostOpQuickSummaryObj.CheckInReviewDoctorId != null) {
                        var doctorlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.CheckInReviewDoctorId });

                        if (doctorlist.length > 0) {
                            var License = '';
                            var Suffix = '';

                            if (doctorlist[0].SuffixName !== '') {
                                Suffix = doctorlist[0].SuffixName + ',';
                            }
                            if (doctorlist[0].LicenseNumber !== '') {
                                License = 'Lic: ' + doctorlist[0].LicenseNumber;
                            }

                            if (doctorlist[0].SuffixId == 10) {
                                $scope.PostOpQuickSummaryObj.CheckInReviewDoctorName = ' Dr. ' + doctorlist[0].FullName + ' ' + Suffix + ' ' + License;
                            } else {
                                $scope.PostOpQuickSummaryObj.CheckInReviewDoctorName = doctorlist[0].FullName + ' ' + Suffix + ' ' + License;
                            }
                        }
                    } else {
                        $scope.PostOpQuickSummaryObj.CheckInReviewDoctorName = "";
                    }

                    if ($scope.PostOpQuickSummaryObj.CheckInReviewNurseId != null) {
                        var Nurselist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.CheckInReviewNurseId });

                        if (Nurselist.length > 0) {
                            var License = '';
                            var Suffix = '';

                            if (Nurselist[0].SuffixName !== '') {
                                Suffix = Nurselist[0].SuffixName + ',';
                            }
                            if (Nurselist[0].LicenseNumber !== '') {
                                License = 'Lic: ' + Nurselist[0].LicenseNumber;
                            }

                            if (Nurselist[0].SuffixId == 10) {
                                $scope.PostOpQuickSummaryObj.CheckInReviewNurseName = ' Dr. ' + Nurselist[0].FullName + ' ' + Suffix + ' ' + License;
                            } else {
                                $scope.PostOpQuickSummaryObj.CheckInReviewNurseName = Nurselist[0].FullName + ' ' + Suffix + ' ' + License;
                            }
                        }
                    } else {
                        $scope.PostOpQuickSummaryObj.CheckInReviewNurseName = "";
                    }


                    if ($scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistId != null) {
                        var Anesthetist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistId });

                        if (Anesthetist.length > 0) {
                            var License = '';
                            var Suffix = '';

                            if (Anesthetist[0].SuffixName !== '') {
                                Suffix = Anesthetist[0].SuffixName + ',';
                            }
                            if (Anesthetist[0].LicenseNumber !== '') {
                                License = 'Lic: ' + Anesthetist[0].LicenseNumber;
                            }

                            if (Anesthetist[0].SuffixId == 10) {
                                $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistName = ' Dr. ' + Anesthetist[0].FullName + ' ' + Suffix + ' ' + License;
                            } else {
                                $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistName = Anesthetist[0].FullName + ' ' + Suffix + ' ' + License;
                            }
                        }
                    } else {
                        $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistName = "";
                    }
                    var ASCChecklist = '';
                    ASCChecklist = $filter('filter')($scope.PostOpQuickSummaryObj.OrgASCChecklist, { IsChecked: true }, true) || [];

                    if (ASCChecklist.length > 0 || $scope.PostOpQuickSummaryObj.HighCriteriaRemarks != '' || $scope.PostOpQuickSummaryObj.CheckInReviewDoctorId != null || $scope.PostOpQuickSummaryObj.CheckInReviewNurseId != null || $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistId != null) {
                        $scope.PostOpQuickSummaryObj.IsPostOpHighCriteria = true;
                    } else {
                        $scope.PostOpQuickSummaryObj.IsPostOpHighCriteria = false;
                    }
                    // Hight Criteria End

                }
            } else {
                $scope.PostOpQuickSummaryObj.Vitals = [];
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PostOPNurseCheckListId = 0;
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceived = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.AccompaniedBy = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevel = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevelRemarks = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.NourishmentProvider = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.BloodSugar = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PostOpInstruction = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.ReceivedRoom = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Patientallowed = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Personalbelonging = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Patientadvised = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientClinic = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Physicianexamine = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Removedintact = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Orientedtimes = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.OtherMental = "";

                $scope.PostOpQuickSummaryObj.NurseChart.Actions.PostOPNurseActionId = 0;
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.Speech = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.Vision = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.Pain = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.ConsciousLevel = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.Fur = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.IncisionlaDrainage = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.Nausea = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.IngestedFood = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.Referred = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.Relationship = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.Exit = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.Instruction = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.Prescription = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.LensCard = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.Surveillance = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.Bandage = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.Advancediet = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.Discharge = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.Administer = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.Tylenol = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Actions.Review = "";
                $scope.PostOpQuickSummaryObj.SurgeonObj.InvestigationsList = [];
                $scope.PostOpQuickSummaryObj.PrescriptionDetails = [];
                $scope.PostOpQuickSummaryObj.ReviewedbyInd = false;
            }
        });
    }

    $scope.GetDischargeData = function () {

        let appointmentId = null;
        if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
            appointmentId = $scope.cacheStorageItem.AppointmentId;
        }

        if ($scope.cacheStorageItem.AppointmentTypeId == 7 || $scope.cacheStorageItem.AppointmentTypeId == 6) {
            appointmentId = $scope.cacheStorageItem.AscAppointmentId;
        }

        let req = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": appointmentId || null,
            "PatientId": $scope.cacheStorageItem.PatientID || null
        };

        eHnoteSurgeryService.GetPostOpDischargeData(req).then(function (resp) {
            if (resp.data.Status === "Success") {

                $scope.DischargeQuickSummaryObj.LastSignOffUserDetails = angular.copy(resp.data.LastSignOffUserDetails) || [];
                $scope.DischargeQuickSummaryObj.Diagnosis = angular.copy(resp.data.Diagnosis);
                $scope.DischargeQuickSummaryObj.Prescriptions = angular.copy(resp.data.Prescription);
                $scope.DischargeQuickSummaryObj.InvestigationsList = resp.data.InvestigationsList || [];
                $scope.DischargeQuickSummaryObj.Findings = angular.copy(resp.data.Findings);
                $scope.DischargeQuickSummaryObj.MedicineOrdersInstructions = angular.copy(resp.data.MedicineOrdersInstructions);
                $scope.DischargeQuickSummaryObj.SurgeryList = resp.data.SurgeryList || [];
                $scope.DischargeQuickSummaryObj.ImplantsDetailsArray = resp.data.ImplantsDetailsArray || [];
                $scope.DischargeQuickSummaryObj.ReasonForVisit = resp.data.ReasonForVisit || "";
                $scope.DischargeQuickSummaryObj.ProcedureDescription = resp.data.ProcedureDescription || "";
                $scope.DischargeQuickSummaryObj.Complications = resp.data.Complications || "";
                $scope.DischargeQuickSummaryObj.Pathology = resp.data.Pathology || "";
                $scope.DischargeQuickSummaryObj.PostProceduresNotes = resp.data.PostProceduresNotes || "";
                $scope.DischargeQuickSummaryObj.PatientsInstructions = resp.data.PatientsInstructions || "";

                if ($scope.DischargeQuickSummaryObj.SurgeryList.length > 0) {
                    angular.forEach($scope.DischargeQuickSummaryObj.SurgeryList, function (item) {
                        item.DiagnosisList = item.DiagnosisList || [];
                        if (item.DiagnosisList.length > 0) {
                            $scope.DischargeQuickSummaryObj.DiagnosisList = item.DiagnosisList || [];
                        } else {
                            $scope.DischargeQuickSummaryObj.DiagnosisList = [];
                        }
                        item.DoctorId = item.DoctorId || 0;
                        if (item.DoctorId !== 0) {
                            let TempFilter = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.DoctorId });
                            TempFilter = TempFilter || [];
                            if (TempFilter.length > 0) {
                                var SuffixName = '';
                                TempFilter[0].SuffixName = TempFilter[0].SuffixName || '';
                                if (TempFilter[0].SuffixName != "") {
                                    SuffixName = TempFilter[0].SuffixName;
                                }
                                if (TempFilter[0].SuffixId == 10) {
                                    $scope.PatientDischargeObj.Surgeon = ' Dr. ' + TempFilter[0].FullName + ' ' + SuffixName ;
                                } else {
                                    $scope.PatientDischargeObj.Surgeon = TempFilter[0].FullName + ' ' + SuffixName ;
                                }
                                
                            }
                        }

                        item.InternalCoManagerId = item.InternalCoManagerId || '';
                        if (item.InternalCoManagerId != '') {
                            let temparray = $filter('filter')($scope.allUserList, { 'DoctorID': item.InternalCoManagerId }, true);
                            temparray = temparray || [];
                            if (temparray.length > 0) {
                                var SuffixName = '';
                                temparray[0].SuffixName = temparray[0].SuffixName || '';
                                if (temparray[0].SuffixName != "") {
                                    SuffixName = temparray[0].SuffixName;
                                }
                                if (temparray[0].SuffixId == 10) {
                                    $scope.PatientDischargeObj.InternalCoManager = ' Dr. ' + temparray[0].FullName + ' ' + SuffixName;
                                } else {
                                    $scope.PatientDischargeObj.InternalCoManager = temparray[0].FullName + ' ' + SuffixName;
                                }
                                //$scope.PatientDischargeObj.InternalCoManager = temparray[0].FullName || '';
                            }
                        }

                        item.ExternalCoManagerId = item.ExternalCoManagerId || '';
                        $scope.PatientDischargeObj.ExternalCoManager = item.ExternalCoManagerName || '';
                        //if (item.ExternalCoManagerId != '') {
                        //    let temparray = $filter('filter')($scope.allUserList, { 'DoctorID': item.ExternalCoManagerId }, true);
                        //    if (temparray.length > 0) {
                        //        $scope.PatientDischargeObj.ExternalCoManager = temparray[0].FullName || '';
                        //    }
                        //}
                        
                        $scope.PatientDischargeObj.OperativeProcedure = item.SurgeryName;
                        $scope.PatientDischargeObj.OrganId = item.OrganId;

                    });
                    $scope.PatientDischargeObj.FullName = $scope.cacheStorageItem.PatientName || "";
                    $scope.PatientDischargeObj.DOB = $scope.cacheStorageItem.PatientDOB || "";
                    $scope.PatientDischargeObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
                    $scope.PatientDischargeObj.PatientDisplayId = $scope.cacheStorageItem.PatientDisplayId || "";
                }

                if (resp.data.PostOpDischarge.length > 0) {

                    $scope.DischargeQuickSummaryObj.FinalDisposition = resp.data.PostOpDischarge[0].FinalDisposition || "";
                    $scope.DischargeQuickSummaryObj.ProcedureDetails = resp.data.PostOpDischarge[0].ProcedureDetails || "";
                    if ($scope.DischargeQuickSummaryObj.Pathology !== '') {
                        $scope.DischargeQuickSummaryObj.Pathology = $scope.DischargeQuickSummaryObj.Pathology.replace(/<br>/g, '\n');
                    }
                    if ($scope.DischargeQuickSummaryObj.FinalDisposition !== '') {
                        $scope.DischargeQuickSummaryObj.FinalDisposition = $scope.DischargeQuickSummaryObj.FinalDisposition.replace(/<br>/g, '\n');
                    }
                }

                if (resp.data.rows.length > 0) {

                    $scope.PostopDischargeDetails = angular.copy(resp.data.rows[0]);

                    $scope.DischargeQuickSummaryObj.FollowUpDate1 = $filter('date')($scope.PostopDischargeDetails.FollowUpDate1, "MM-dd-yyyy") || "";
                    $scope.DischargeQuickSummaryObj.FollowUpDate2 = $filter('date')($scope.PostopDischargeDetails.FollowUpDate2, "MM-dd-yyyy") || "";
                    $scope.DischargeQuickSummaryObj.FollowUpDate3 = $filter('date')($scope.PostopDischargeDetails.FollowUpDate3, "MM-dd-yyyy") || "";
                    $scope.DischargeQuickSummaryObj.DischargeReviewedBy = $scope.PostopDischargeDetails.DischargeReviewedBy || "";

                    if ($scope.DischargeQuickSummaryObj.DischargeReviewedBy != null) {
                        var doctorlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.DischargeQuickSummaryObj.DischargeReviewedBy });
                    }
                    doctorlist = doctorlist || [];
                    if (doctorlist.length > 0) {
                        $scope.DischargeQuickSummaryObj.DischargeReviewedByName = angular.copy(doctorlist[0].FullName);

                        $scope.DischargeQuickSummaryObj.DischargeReviewedByNameSuffix = angular.copy(doctorlist[0].SuffixName) || '';
                        $scope.DischargeQuickSummaryObj.DischargeReviewedByNameLicenseNumber = angular.copy(doctorlist[0].LicenseNumber) || '';
                        if (doctorlist[0].SuffixId == 10) {
                            $scope.DischargeQuickSummaryObj.DischargeReviewedByName = ' Dr. ' + $scope.DischargeQuickSummaryObj.DischargeReviewedByName;
                        }
                    } else {
                        $scope.DischargeQuickSummaryObj.DischargeReviewedByName = '';
                        $scope.DischargeQuickSummaryObj.DischargeReviewedByNameSuffix = '';
                        $scope.DischargeQuickSummaryObj.DischargeReviewedByNameLicenseNumber = '';
                    }
                    $scope.DischargeQuickSummaryObj.DischargeReviewedDate = $scope.PostopDischargeDetails.DischargeReviewedDate || '';
                    $scope.DischargeQuickSummaryObj.DischargeReviewedDate = $filter('date')($scope.DischargeQuickSummaryObj.DischargeReviewedDate, "MM-dd-yyyy hh:mm a") || '';


                    $scope.DischargeQuickSummaryObj.FollowUpInstructions = $scope.PostopDischargeDetails.FollowUpInstructions || "";
                    $scope.DischargeQuickSummaryObj.CoManagementInstruction = $scope.PostopDischargeDetails.CoManagementInstruction || "";
                    $scope.DischargeQuickSummaryObj.MedicationInstruction = $scope.PostopDischargeDetails.MedicationInstruction || "";
                    //$scope.DischargeQuickSummaryObj.DischargeInstruction = $scope.PostopDischargeDetails.DischargeInstruction || "";
                    $scope.DischargeQuickSummaryObj.PatientConditionInstruction = $scope.PostopDischargeDetails.PatientConditionInstruction || "";
                    $scope.DischargeQuickSummaryObj.ProceduralInstruction = $scope.PostopDischargeDetails.ProceduralInstruction || "";
                    $scope.DischargeQuickSummaryObj.ExaminationNotes = $scope.PostopDischargeDetails.ExaminationNotes || "";

                } else {
                    $scope.DischargeQuickSummaryObj.DischargeReviewedBy = null;
                    $scope.DischargeQuickSummaryObj.FollowUpInstructions = "";
                    $scope.DischargeQuickSummaryObj.CoManagementInstruction = "";
                    $scope.DischargeQuickSummaryObj.MedicationInstruction = "";
                    //$scope.DischargeQuickSummaryObj.DischargeInstruction = "";
                    $scope.DischargeQuickSummaryObj.PatientConditionInstruction = "";
                    $scope.DischargeQuickSummaryObj.ProceduralInstruction = "";
                    $scope.DischargeQuickSummaryObj.FollowUpDate1 = "";
                    $scope.DischargeQuickSummaryObj.FollowUpDate2 = "";
                    $scope.DischargeQuickSummaryObj.FollowUpDate3 = "";
                }
            }

        }, function () {

        });
    };

    $scope.GetOperativeNotesDetails = function () {

        let appointmentId = null;
        if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
            appointmentId = $scope.cacheStorageItem.AppointmentId;
        }

        if ($scope.cacheStorageItem.AppointmentTypeId == 7 || $scope.cacheStorageItem.AppointmentTypeId == 6) {
            appointmentId = $scope.cacheStorageItem.AscAppointmentId;
        }

        var params = {
            "AppointmentId": appointmentId || null,
            "RequestType": "ASC"
        }

        var obj = {
            "HospitalId": $scope.HospitalId || null,
            "PatientId": $scope.cacheStorageItem.PatientID || null,
            "AppointmentId": appointmentId || null,
        }

        $q.all([
            eHnotePatientDataService.getPatientASCDrawingPadImages(params),
            eHnoteSurgeryService.GetOperativeNotesDetails(obj)
        ]).then(function (resp) {
            if (resp[0].data.status === "Success") {
                if (resp[0].data.rows.length > 0) {
                    $scope.patientAscDrawingfiles = resp[0].data.rows || [];
                    $scope.DrawingPadImagesArray = [];
                    if ($scope.patientAscDrawingfiles.length > 0) {
                        angular.forEach($scope.patientAscDrawingfiles, function (item, index) {
                            if (index < 2) {
                                if (item.S3URL !== '') {
                                    $scope.toDataURL(item.S3URL, function (dataURL) {
                                        $scope.DrawingPadImagesArray.push(dataURL);
                                    });
                                }
                            }
                        });
                    }
                }
            }

            if (resp[1].data.Status == "Success") {


                $scope.OperativeNotesObj.LastSignOffUserDetails = angular.copy(resp[1].data.LastSignOffUserDetails) || [];
                $scope.OperativeNotesObj.PreProcedureNotes = resp[1].data.PreProcedureNotes || "";
                $scope.OperativeNotesObj.PostProceduresNotes = resp[1].data.PostProceduresNotes || "";
                $scope.OperativeNotesObj.Pathology = resp[1].data.Pathology || "";
                $scope.Diagnosis = resp[1].data.Diagnosis || [];
                $scope.ImplantsDetailsArray = resp[1].data.ImplantsDetailsArray || [];
                $scope.OperativeNotesObj.SurgeryList = resp[1].data.SurgeryList || [];
                $scope.OperativeNotesObj.Prescription = resp[1].data.Prescription || [];
                $scope.OperativeNotesObj.InvestigationsList = resp[1].data.InvestigationsList || [];
                $scope.OperativeNotesObj.PatientsInstructions = resp[1].data.PatientsInstructions || "";

                if ($scope.OperativeNotesObj.SurgeryList.length > 0) {
                    if ($scope.OperativeNotesObj.SurgeryList[0].AdditionalSurgery.length > 0) {
                        $scope.OperativeNotesObj.AdditionalSurgery = $scope.OperativeNotesObj.SurgeryList[0].AdditionalSurgery || [];
                    }
                    angular.forEach($scope.OperativeNotesObj.SurgeryList, function (item) {
                        item.DiagnosisList = item.DiagnosisList || [];
                        if (item.DiagnosisList.length > 0) {
                            $scope.OperativeNotesObj.DiagnosisList = item.DiagnosisList || [];
                        } else {
                            $scope.OperativeNotesObj.DiagnosisList = [];
                        }
                        item.DoctorId = item.DoctorId || 0;
                        if (item.DoctorId !== 0) {

                            let TempFilter = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.DoctorId });
                            TempFilter = TempFilter || [];
                            if (TempFilter.length > 0) {
                                var SuffixName = '';
                                TempFilter[0].SuffixName = TempFilter[0].SuffixName || '';
                                if (TempFilter[0].SuffixName != "") {
                                    SuffixName = TempFilter[0].SuffixName;
                                }
                                if (TempFilter[0].SuffixId == 10) {
                                    $scope.PatientDischargeObj.Surgeon = ' Dr. ' + TempFilter[0].FullName + ' ' + SuffixName;
                                } else {
                                    $scope.PatientDischargeObj.Surgeon = TempFilter[0].FullName + ' ' + SuffixName;
                                }

                            }
                        }
                        $scope.PatientDischargeObj.OperativeProcedure = item.SurgeryName;
                        $scope.PatientDischargeObj.OrganId = item.OrganId;
                    });
                    $scope.PatientDischargeObj.FullName = $scope.cacheStorageItem.PatientName || "";
                    $scope.PatientDischargeObj.DOB = $scope.cacheStorageItem.PatientDOB || "";
                    $scope.PatientDischargeObj.PatientDisplayId = $scope.cacheStorageItem.PatientDisplayId || "";
                    $scope.PatientDischargeObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
                }

                $scope.OperativeNotesObj.OperativeNotesReviewedBy = resp[1].data.rows[0].OperativeNotesReviewedBy || null;
                $scope.OperativeNotesObj.OperativeReviewedDate = resp[1].data.rows[0].OperativeReviewedDate || null;
                $scope.OperativeNotesObj.OperativeReviewedDate = $filter('date')($scope.OperativeNotesObj.OperativeReviewedDate, "MM-dd-yyyy hh:mm a");

                if ($scope.OperativeNotesObj.OperativeNotesReviewedBy != 0 || $scope.OperativeNotesObj.OperativeNotesReviewedBy != null) {
                    var TempFilter = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.OperativeNotesObj.OperativeNotesReviewedBy }, true) || [];
                    if (TempFilter.length > 0) {
                        $scope.OperativeNotesObj.OperativeReviewedName = angular.copy(TempFilter[0].FullName);
                        $scope.OperativeNotesObj.OperativeReviewedNameSuffix = angular.copy(TempFilter[0].SuffixName);
                        $scope.OperativeNotesObj.ReviewedByLicenseNumber = angular.copy(TempFilter[0].LicenseNumber);
                        if (TempFilter[0].SuffixId == 10) {
                            $scope.OperativeNotesObj.OperativeReviewedName = ' Dr. ' + $scope.OperativeNotesObj.OperativeReviewedName;
                        }
                    }
                    else {
                        $scope.OperativeNotesObj.OperativeReviewedName = '';
                        $scope.OperativeNotesObj.OperativeReviewedNameSuffix = '';
                        $scope.OperativeNotesObj.ReviewedByLicenseNumber = '';
                    }
                }

                if (resp[1].data.rows.length > 0) {
                    $scope.OperativeNotesObj.Complications = resp[1].data.rows[0].Complications;
                    $scope.OperativeNotesObj.Findings = resp[1].data.rows[0].Findings ||'';
                    $scope.OperativeNotesObj.SurgeonOperativeNotes = resp[1].data.rows[0].SurgeonOperativeNotes;
                    $scope.OperativeNotesObj.ProcedureDetails = resp[1].data.rows[0].ProcedureDetails;
                    $scope.OperativeNotesObj.ReasonForVisit = resp[1].data.rows[0].ReasonForVisit || "";
                    $scope.OperativeNotesObj.PhysicalExam = resp[1].data.rows[0].PhysicalExam || "";
                    $scope.OperativeNotesObj.PostProceduresNotes = resp[1].data.rows[0].PostProcedureNote || "";
                    //$scope.OperativeNotesObj.PatientsInstructions = resp[1].data.rows[0].PatientsInstructions || "";

                } else {
                    $scope.Diagnosis = []
                    $scope.ImplantsDetailsArray = [];
                    $scope.OperativeNotesObj.Complications = "";
                    $scope.OperativeNotesObj.Findings = "";
                    $scope.OperativeNotesObj.SurgeonOperativeNotes = "";
                }
            }

        });
    }

    $scope.MasterReferralSource = function () {
        eHnoteOrgReferralDataServices.GetMasterReferralSource($scope.ParenthospitalId).then(function (response) {
            $scope.ReferralSouceMaster = response.data.rows;
        });
    }

    $scope.SelectPatient = function () {
        eHnoteAuditServices.getPatientDetailsById($scope.cacheStorageItem.PatientID, ongetPatientDetailsSuccess, ongetPatientDetailsError);
        function ongetPatientDetailsSuccess(data) {
            if (data !== undefined) {
                var patientitem = data;
                console.log(JSON.stringify(patientitem));

                /* */

                $scope.PatientDetailsInfo.Age = patientitem.Patient[0].Age;
                $scope.PatientDetailsInfo.PatientDisplayID = patientitem.Patient[0].PatientDisplayId || "";
                $scope.PatientDetailsInfo.OldMrno = patientitem.Patient[0].OldMrno || "";
                $scope.PatientDetailsInfo.FullName = patientitem.Patient[0].FullName;
                $scope.PatientDetailsInfo.S3URL = patientitem.Patient[0].S3URL || "";
                $scope.PatientDetailsInfo.Gender = patientitem.Patient[0].Gender;

                $scope.PatientDetailsInfo.AgeInDays = patientitem.Patient[0].AgeInDays;
                $scope.PatientDetailsInfo.AgeInMonths = patientitem.Patient[0].AgeInMonths;
                $scope.PatientDetailsInfo.AgeInYears = patientitem.Patient[0].AgeInYears;

                $scope.PatientDetailsInfo.IsNoChargePatient = patientitem.Patient[0].IsNoChargePatient || false;
                $scope.PatientDetailsInfo.IsDiseased = patientitem.Patient[0].IsDiseased || false;

                $scope.PatientDetailsInfo.PatientTagList = [];
                if (patientitem.Patient[0].PatientTagList.length > 0) {
                    $scope.PatientDetailsInfo.PatientTagList = angular.copy(patientitem.Patient[0].PatientTagList);
                }

                if (patientitem.Patient[0].DOB != "") {
                    $scope.PatientDetailsInfo.DOB = $filter('date')(patientitem.Patient[0].DOB, "MM-dd-yyyy");
                }

                $scope.ageinYears = patientitem.Patient[0].AgeInYears;
                $scope.ageinMonths = patientitem.Patient[0].AgeInMonths ? patientitem.Patient[0].AgeInMonths.toString() : "";
                $scope.ageinDays = patientitem.Patient[0].AgeInDays ? patientitem.Patient[0].AgeInDays.toString() : "";
                $scope.PatientDetailsInfo.SocialSecurityNo = patientitem.Patient[0].SocialSecurityNo || "";
                if ($scope.PatientDetailsInfo.SocialSecurityNo == 0 || $scope.PatientDetailsInfo.SocialSecurityNo == "0") {
                    $scope.PatientDetailsInfo.SocialSecurityNo = "";
                }

                $scope.PatientOfficeumber = patientitem.Patient[0].OfficeAreaCode + patientitem.Patient[0].PatientOfficeNumber;
                $scope.PatientDetailsInfo.BloodGroupName = patientitem.Patient[0].PatientOtherDetails[0].BloodGroupName;

                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientOfficeumber);
                $scope.PatientOfficeNumber = obj.UsFormatMobileNumber;

                $scope.PatientDetailsInfo.ContactInfo.EmailID = patientitem.Patient[0].EmailId || "";
                $scope.PatientDetailsInfo.MaritalStatusName = patientitem.Patient[0].PatientOtherDetails[0].MaritalStatus || "";

                $scope.PatientMNumber = patientitem.Patient[0].Altareacode + patientitem.Patient[0].PatientHomeNumber;
                var obj = eHnoteUserDataService.UsMobileFormatChange($scope.PatientMNumber);
                $scope.PatientMobileNumber = obj.UsFormatMobileNumber;

                $scope.PatientDetailsInfo.EmployerPhoneNo = patientitem.Patient[0].EmployerPhoneNo;

                $scope.PatientDetailsInfo.FatherName = patientitem.Patient[0].FatherName;
                $scope.PatientDetailsInfo.MotherName = patientitem.Patient[0].MotherName;
                $scope.PatientDetailsInfo.Guardian = patientitem.Patient[0].Guardian;
                $scope.PatientDetailsInfo.Employer = patientitem.Patient[0].Employer;

                $scope.PatientDetailsInfo.OccupationDescription = patientitem.Patient[0].OccupationDescription;

                var DemographicsList = patientitem.Patient[0].AdditionalInfo;

                $scope.DemographicSummary.Ethnicity = angular.copy(patientitem.PatientEthnicity);
                $scope.DemographicSummary.Proficiency = DemographicsList.Proficiency || "";
                $scope.DemographicSummary.Race = angular.copy(patientitem.PatientRace);
                $scope.DemographicSummary.LanguageName = DemographicsList.LanguageName || "";
                $scope.DemographicSummary.MultipleBirth = DemographicsList.MultipleBirth || "";
                $scope.DemographicSummary.SexualOrientation = DemographicsList.SexualOrientation || "";
                $scope.DemographicSummary.Expression = DemographicsList.Expression || "";
                $scope.DemographicSummary.GenderIdentityStatus = DemographicsList.GenderIdentity || "";


                //$scope.PatientInsuranceSummary = [];
                //if (patientitem.patientInsuranceDetails.length > 0) {
                //    angular.forEach(patientitem.patientInsuranceDetails, function (initem) {
                //        var objectinsurance = {
                //            "CoverageId": initem.CoverageId,
                //            "CoverageName": "",
                //            "CoverageObj": "",
                //            "PatientInsuranceDetailId": initem.PatientInsuranceDetailId,
                //            "PlanId": initem.PlanId || 0,
                //            "PlanName": initem.PlanName || "",
                //            "PlanObj": "",
                //            "Payor": "",
                //            "PayorName": initem.PayorName || "",
                //            "PayorId": initem.PayorId || 0,
                //            "OrganizationPayorId": initem.OrganizationPayorId,
                //            "OrganizationPayorName": initem.OrganizationPayorName,
                //            "PayorObj": "",
                //            "PlanTypeId": initem.PlanTypeId || 0,
                //            "PlanDescription": initem.PlanDescriptionl || "", // initem.PlanTypeName || "",
                //            "PolicyId": initem.PolicyId,
                //            "GroupId": initem.GroupId || "",
                //            "GroupName": initem.GroupName || "",
                //            "RelationShipId": initem.RelationShipId || "",
                //            "InsuranceRelationShipObj": "",
                //            "PolicyHolder": initem.PolicyHolder || "",
                //            "PolicyHolderName": initem.PolicyHolderName || "",
                //            "Employer": "",
                //            "Coinsurance": initem.Coinsurance || "",
                //            "VisitCopay": initem.VisitCopay || "",
                //            "EffectiveDate": "",
                //            "ExpiryDate": "",
                //            "ScanDate": "",
                //            "VerifiedDate": "",
                //            "DeleteInd": false,
                //            "IsConnectToFutureAppointment": initem.IsConnectToFutureAppointment || false,
                //            "AcceptAssign": initem.AcceptAssign || "",
                //            "AssignBenifits": initem.AssignBenifits || "",
                //            "ReleaseInfo": initem.ReleaseInfo || "",
                //            "LaboratoryId": initem.LaboratoryId || 0,
                //            "StatusId": initem.StatusId || 0,
                //            "Comments": initem.Comments || "",
                //            "MSPTrailerTypeId": initem.MSPTrailerTypeId || 0,
                //            "Staff": initem.Staff || "",
                //            "PatientDocumentDetails": angular.copy(initem.PatientDocumentDetails) || "",
                //            "MsnTyp": "",
                //            "IsAcceptAssign": 0,
                //            "IsAcceptAssignBenifits": 0,
                //            "IsReleaseInfo": 0,
                //            "PatientBillingTypeId": 0,
                //            "TempInsuranceImagesArray": [],
                //            "InsuredPersonFirstName": initem.InsuredPersonFirstName || "",
                //            "InsuredPersonGenderID": initem.InsuredPersonGenderID || "",
                //            "InsuredPersonDOB": initem.InsuredPersonDOB || "",
                //            "InsuredPersonSSN": initem.InsuredPersonSSN || "",
                //            "RelationName": initem.RelationName || "",
                //            "IdentifierId": initem.IdentifierId,
                //            "IsDefaultBillingIns": initem.IsDefaultBillingIns || "",
                //            "PCP": initem.PCP || "",
                //            "IPA": initem.IPA || "",
                //            "AppointmentInsuranceDetailId": initem.AppointmentInsuranceDetailId || 0,
                //            "IsVerified": initem.IsVerified || false,
                //            "PatientId": initem.PatientId,
                //            "InsuredPersonMiddleName": initem.InsuredPersonMiddleName,
                //            "InsuredPersonLastName": initem.InsuredPersonLastName,
                //            "PatientFirstName": initem.PatientFirstName || "",
                //            "PatientLastName": initem.PatientLastName || "",
                //            "PatientDOB": initem.PatientDOB || "",
                //            "PatientSSN": initem.PatientSSN || "",
                //            "EligibilityStatusId": initem.EligibilityStatusId || 0,
                //            "IsIdentifier": false,
                //            "VerificationDate": initem.VerificationDate || null
                //        }
                //        objectinsurance.CoverageName = "";
                //        var filter1 = $filter("filter")($scope.InsuranceCoverageList, { "CoverageId": initem.CoverageId }, true) || [];
                //        if (filter1.length > 0) {
                //            objectinsurance.CoverageName = filter1[0].CoverageName || "";
                //        }

                //        objectinsurance.Status = "";
                //        var filter1 = $filter("filter")($scope.InsuranceStatusList, { "DropdownId": initem.StatusId }, true) || [];
                //        if (filter1.length > 0) {
                //            objectinsurance.Status = filter1[0].Value || "";
                //        }

                //        var filterStatus = [];
                //        filterStatus = $filter("filter")($scope.RelationShipTypeList, { "RelationId": objectinsurance.RelationShipId }, true) || [];
                //        if (filterStatus.length > 0) {
                //            objectinsurance.InsuranceRelationShipObj = filterStatus[0];
                //        }

                //        if (initem.EffectiveDate != "" && initem.EffectiveDate != null) {
                //            var date = initem.EffectiveDate;
                //            var data1 = date.split("-").reverse().join("-");
                //            objectinsurance.EffectiveDate = $filter("date")(data1, "MM-dd-yyyy") || "";
                //        }
                //        if (initem.ExpiryDate != "" && initem.ExpiryDate != null) {

                //            var date = initem.ExpiryDate;
                //            var data2 = date.split("-").reverse().join("-");
                //            objectinsurance.ExpiryDate = $filter("date")(data2, "MM-dd-yyyy") || "";
                //        }
                //        if (initem.ScanDate != "" && initem.ScanDate != null) {
                //            objectinsurance.ScanDate = $filter("date")(initem.ScanDate, "MM-dd-yyyy") || "";
                //        }
                //        if (initem.VerifiedDate != "" && initem.VerifiedDate != null) {
                //            objectinsurance.VerifiedDate = $filter("date")(initem.VerifiedDate, "MM-dd-yyyy") || "";
                //        }
                //        if (initem.InsuredPersonDOB != "" && initem.InsuredPersonDOB != null) {
                //            objectinsurance.InsuredPersonDOB = $filter("date")(initem.InsuredPersonDOB, "MM-dd-yyyy") || "";
                //        }

                //        if (initem.VerificationDate != "" && initem.VerificationDate != null) {
                //            objectinsurance.VerificationDate = $filter("date")(initem.VerificationDate, "MM-dd-yyyy HH:mm:ss");
                //        }

                //        var vitalslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.UserId });
                //        if (vitalslist.length > 0) {
                //            objectinsurance.UserVerifiedName = angular.copy(vitalslist[0].FullName);
                //        }

                //        $scope.PatientInsuranceSummary.push(objectinsurance);
                //    });
                //}

                /* */
            }
        }
        function ongetPatientDetailsError(error) {
            console.log(error);
        }
    }

    $scope.getApptAdditionalDetails = function () {

        eHnoteMainAppointmentService.getAdditionalApptDetailsById($scope.cacheStorageItem.AppointmentId).then(function (resp) {

            resp.data = resp.data || [];
            console.log(resp);

            if (resp.data.length > 0) {
                $scope.AppointmentNotesArray = resp.data[0].AppointmentNotes;
                $scope.ProfileStatusRemarksArray = resp.data[0].ProfileStatusHistoryArray || [];
                if (resp.data[0].AppointmentDetails.length > 0) {

                    $scope.SelectedAppointmentObj.VisitReasonName = resp.data[0].AppointmentDetails[0].VisitReasonName || '';
                    $scope.SelectedAppointmentObj.PaymentTypeId = resp.data[0].AppointmentDetails[0].PaymentTypeId || 2;
                    $scope.SelectedAppointmentObj.AppointmentDate = resp.data[0].AppointmentDetails[0].AppointmentDate;
                    $scope.SelectedAppointmentObj.RescheduledAppointmentDate = resp.data[0].AppointmentDetails[0].RescheduledAppointmentDate;
                    $scope.SelectedAppointmentObj.StartTime = resp.data[0].AppointmentDetails[0].StartTime;
                    $scope.SelectedAppointmentObj.PatientProfileStatusId = resp.data[0].AppointmentDetails[0].ProfileStatusMasterId;
                    $scope.SelectedAppointmentObj.AppointmentStatusId = resp.data[0].AppointmentDetails[0].AppointmentStatusId;
                    $scope.SelectedAppointmentObj.BookingStatus = resp.data[0].AppointmentDetails[0].BookingStatus;
                    $scope.SelectedAppointmentObj.AppointmentStatusName = resp.data[0].AppointmentDetails[0].AppointmentStatusName;
                    $scope.SelectedAppointmentObj.RescheduledAppointmentStartTime = resp.data[0].AppointmentDetails[0].RescheduledAppointmentStartTime;
                    $scope.SelectedAppointmentObj.AppointmentStatus = resp.data[0].AppointmentDetails[0].AppointmentStatus;
                    $scope.SelectedAppointmentObj.ProfileStatusName = resp.data[0].AppointmentDetails[0].ProfileStatusName;

                    resp.data[0].DoctorId = resp.data[0].DoctorId || '';
                    if (resp.data[0].DoctorId != '') {
                        let doctorlist = $filter('filter')($scope.allUserList, { 'DoctorID': resp.data[0].DoctorId }, true);
                        if (doctorlist.length > 0) {
                            $scope.SelectedAppointmentObj.DoctorFullName = doctorlist[0].FullName || '';
                        }
                    }
                }

            } else {
                $scope.AppointmentNotesArray = [];
            }
        }, function (err) {
            console.log(err);
            alertify.error("Getting data failed");
        });
    }




    $scope.GetSummaryAppointmentPreAuthData = function (req) {


        eHnotePatientDataService.GetAppointmentPreAuthorizationData(req).then(function (resp) {
            console.log(resp);
            if (resp.data.status === 'Success') {
                if (resp.data.PatientPreAuthorizationId !== 0) {
                    $scope.summaryAppointmentPreAuthDataObj = getSummaryAppointmentPreAuthDataObj();

                    $scope.summaryAppointmentPreAuthDataObj.PayorName = resp.data.PayorName;
                    $scope.summaryAppointmentPreAuthDataObj.PlanName = resp.data.PlanName;
                    $scope.summaryAppointmentPreAuthDataObj.PreAuthorizationNumber = resp.data.PreAuthNumber1;
                    $scope.summaryAppointmentPreAuthDataObj.PreAuthNumber1 = resp.data.PreAuthNumber1;
                    $scope.summaryAppointmentPreAuthDataObj.PreAuthNumber2 = resp.data.PreAuthNumber2;
                    $scope.summaryAppointmentPreAuthDataObj.PreAuthNumber3 = resp.data.PreAuthNumber3;
                    $scope.summaryAppointmentPreAuthDataObj.PreAuthNumber4 = resp.data.PreAuthNumber4;
                    $scope.summaryAppointmentPreAuthDataObj.PreAuthNumber5 = resp.data.PreAuthNumber5;
                    if ($scope.summaryAppointmentPreAuthDataObj.PreAuthNumber2 !== '') {
                        $scope.summaryAppointmentPreAuthDataObj.PreAuthorizationNumber += ", " + $scope.summaryAppointmentPreAuthDataObj.PreAuthNumber2;
                    }
                    if ($scope.summaryAppointmentPreAuthDataObj.PreAuthNumber3 !== '') {
                        $scope.summaryAppointmentPreAuthDataObj.PreAuthorizationNumber += ", " + $scope.summaryAppointmentPreAuthDataObj.PreAuthNumber3;
                    }
                    if ($scope.summaryAppointmentPreAuthDataObj.PreAuthNumber4 !== '') {
                        $scope.summaryAppointmentPreAuthDataObj.PreAuthorizationNumber += ", " + $scope.summaryAppointmentPreAuthDataObj.PreAuthNumber4;
                    }
                    if ($scope.summaryAppointmentPreAuthDataObj.PreAuthNumber5 !== '') {
                        $scope.summaryAppointmentPreAuthDataObj.PreAuthorizationNumber += ", " + $scope.summaryAppointmentPreAuthDataObj.PreAuthNumber5;
                    }
                    $scope.summaryAppointmentPreAuthDataObj.PreAuthorizationCode = resp.data.PreAuthorizationCode;
                    $scope.summaryAppointmentPreAuthDataObj.ServiceDate = $filter('date')(resp.data.ServiceDate, "MM-dd-yyyy");
                    $scope.summaryAppointmentPreAuthDataObj.ExpiryDate = $filter('date')(resp.data.ExpiryDate, "MM-dd-yyyy");
                    $scope.summaryAppointmentPreAuthDataObj.Remarks = resp.data.Remarks;

                    $scope.summaryAppointmentPreAuthDataObj.PatientPreAuthDocuments = resp.data.PatientPreAuthDocuments || [];
                    if ($scope.summaryAppointmentPreAuthDataObj.PatientPreAuthDocuments.length > 0) {
                        angular.forEach($scope.summaryAppointmentPreAuthDataObj.PatientPreAuthDocuments, function (pitem) {
                            pitem.FileTypeId = pitem.NoteFileTypeId;
                        });
                    }
                }
            }
        }, function (err) {
            console.log(err);
        });
    };

    $scope.SelectAppointment = function () {

        let req = { "AppointmentId": $scope.cacheStorageItem.AppointmentId, "PatientId": $scope.cacheStorageItem.PatientID }
        eHnotePatientDataService.GetPatientAppointmentPCPReferalData(req).then(function (resp) {
            console.log(resp);
            if (resp.data.status === 'Success') {

                /* */

                $scope.PatientApptPCPInfo.MasterReferralSourceId = resp.data.MasterReferralSourceId || 0;
                $scope.PatientApptPCPInfo.ReferralDate = resp.data.ReferralDate || "";
                if ($scope.PatientApptPCPInfo.ReferralDate != '') {
                    $scope.PatientApptPCPInfo.ReferralDate = $filter('date')($scope.PatientApptPCPInfo.ReferralDate, "MM-dd-yyyy");
                }
                $scope.PatientApptPCPInfo.PCPDoctorName = resp.data.PCPDoctorName || "";
                $scope.PatientApptPCPInfo.PcpNPI = resp.data.PcpNPI || "";
                $scope.PatientApptPCPInfo.PCPEmailId = resp.data.PCPEmailId || "";
                $scope.PatientApptPCPInfo.PCPContactNo = resp.data.PCPContactNo || "";
                $scope.PatientApptPCPInfo.PCPReferenceNumber = resp.data.PCPReferenceNumber || "";
                $scope.PatientApptPCPInfo.PCPSecondReferenceNumber = resp.data.PCPSecondReferenceNumber || "";
                $scope.PatientApptPCPInfo.PCPReferralDate = resp.data.PCPReferralDate || null;
                if ($scope.PatientApptPCPInfo.PCPReferralDate != null) {
                    $scope.PatientApptPCPInfo.PCPReferralDate = $filter('date')($scope.PatientApptPCPInfo.PCPReferralDate, "MM-dd-yyyy");
                }
                $scope.PatientApptPCPInfo.PCPNotes = resp.data.PCPNotes || "";

                $scope.PatientApptPCPInfo.ReferralName = resp.data.ReferralName || "";
                $scope.PatientApptPCPInfo.ReferalNPI = resp.data.ReferalNPI || "";
                $scope.PatientApptPCPInfo.ReferalEmailId = resp.data.ReferalEmailId || "";
                $scope.PatientApptPCPInfo.ReferralContact = resp.data.ReferralContact || "";
                $scope.PatientApptPCPInfo.ReferalReferenceNumber = resp.data.ReferalReferenceNumber || "";
                $scope.PatientApptPCPInfo.ReferalSecondReferenceNumber = resp.data.ReferalSecondReferenceNumber || "";
                $scope.PatientApptPCPInfo.ReferalNotes = resp.data.ReferalNotes || "";


                if ($scope.PatientApptPCPInfo.MasterReferralSourceId != 0) {
                    var filter1 = [];
                    filter1 = $filter("filter")($scope.ReferralSouceMaster, { "MasterReferralSourceId": $scope.PatientApptPCPInfo.MasterReferralSourceId }, true) || [];
                    if (filter1.length > 0) {
                        $scope.PatientApptPCPInfo.MasterReferralSourceName = filter1[0].MasterReferralSourceName || "";
                        $scope.PatientApptPCPInfo.MasterReferralSourceObj = filter1[0] || "";
                    }
                }
                $scope.PatientApptPCPInfo.SourceDesignatedInfoNotes = resp.data.SourceDesignatedInfoNotes || "";
                $scope.PatientApptPCPInfo.PatientPCPDocuments = angular.copy(resp.data.PatientPCPDocuments) || [];

                /* */
            }

            if (resp.data.status === "Failure") {
                $scope.PatientApptPCPInfo = GetApptPCPInfo();
            }

            $scope.GetSummaryAppointmentPreAuthData(req);

        }, function (err) {
            console.log(err);
        });
    };

    $scope.DesignatedSummaryObj = {
        "Tab": 1
    };

    $scope.SelectTabInDesignated = function (val) {
        $scope.DesignatedSummaryObj.Tab = val;
    };

    //$scope.ClickOnProfileStatus = {
    //    templateUrl: 'PatientProfileStatusRemarks.html',
    //};

    $scope.ClinicalChecklistObj = {
        "ClinicalChecklist": [],
        "IsAllClinicalCheckListChecked": '',
        "ClinicalChecklistTemplates": [],
        "MedicineChecklistTemplates": [],
        "SelectedClinicalChecklistTemplate": "",
        "AdmissionRemarks": "",
        "ChecklistReviewedDate": "",
        "ChecklistReviewedByName": "",
        "ChecklistReviewedBy": null,
        "PreAdmissionChecklistDocuments": [],
    };

    $scope.ChangeChecklistTab = function () {

        let appointmentId = null;
        if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
            appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
        }

        if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
            appointmentId = $scope.cacheStorageItem.AppointmentId;
        }

        let req = {
            "AppointmentId": appointmentId || 0
        };

        $q.all([
            eHnoteSurgeryService.GetPreAdmissionChecklistDetails(req.AppointmentId)
        ]).then(function (resp) {
            if (resp[0].data.status === "Success") {
                $scope.ClinicalChecklistObj.AdmissionRemarks = resp[0].data.CheckListRemarks || "";
                if ($scope.ClinicalChecklistObj.AdmissionRemarks !== '') {
                    $scope.ClinicalChecklistObj.AdmissionRemarks = $scope.ClinicalChecklistObj.AdmissionRemarks.replace(/<br>/g, '\n');
                }
                $scope.ClinicalChecklistObj.ClinicalChecklist = resp[0].data.rows || [];

                if (resp[0].data.PreAdmissionChecklistDocuments.length > 0) {
                    $scope.ClinicalChecklistObj.PreAdmissionChecklistDocuments = resp[0].data.PreAdmissionChecklistDocuments || [];
                } else {
                    $scope.ClinicalChecklistObj.PreAdmissionChecklistDocuments = $scope.ClinicalChecklistObj.PreAdmissionChecklistDocuments || [];
                }
                $scope.ClinicalChecklistObj.ChecklistReviewedBy = resp[0].data.ChecklistReviewedBy || null;
                if ($scope.ClinicalChecklistObj.ChecklistReviewedBy != null) {
                    var TempFilter = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.ClinicalChecklistObj.ChecklistReviewedBy }, true);
                    if (TempFilter.length > 0) {
                        var SuffixName = '';
                        TempFilter[0].SuffixName = TempFilter[0].SuffixName || '';
                        if (TempFilter[0].SuffixName != "") {
                            SuffixName = TempFilter[0].FullName + ' ' + TempFilter[0].SuffixName + ',';
                        } else {
                            SuffixName = TempFilter[0].FullName + ',';
                        }

                        var LicenseNumber = "";

                        TempFilter[0].LicenseNumber = TempFilter[0].LicenseNumber || "";
                        if (TempFilter[0].LicenseNumber != "") {
                            LicenseNumber = 'Lic:' + ' ' + TempFilter[0].LicenseNumber + ',';
                        }

                        $scope.ClinicalChecklistObj.ChecklistReviewedByName = angular.copy(SuffixName + ' ' + LicenseNumber);
                    }
                    else {
                        $scope.ClinicalChecklistObj.ChecklistReviewedByName = '';
                    }
                }

                if (resp[0].data.ChecklistReviewedDate != '' && resp[0].data.ChecklistReviewedTime != "") {
                    $scope.ClinicalChecklistObj.ChecklistReviewedDate = resp[0].data.ChecklistReviewedDate + 'T' + resp[0].data.ChecklistReviewedTime;
                }

                $scope.ClinicalChecklistObj.ChecklistReviewedDate = $filter('date')($scope.ClinicalChecklistObj.ChecklistReviewedDate, 'MM-dd-yyyy hh:mm a') || "";
            }
        });
    }

    $scope.GetHealthAdvancedData = function (array) {
        let tempHealthArray = angular.copy(array);
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
        let respiratoryArray = [];
        let socialArray = [];
        let HeentArray = [];
        let LungsArray = [];
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
            if (item.CategoryId === 13) {
                respiratoryArray.push(item.Description);
            }
            if (item.CategoryId === 15) {
                socialArray.push(item.Description);
            }
            if (item.CategoryId === 16) {
                HeentArray.push(item.Description);
            }
            if (item.CategoryId === 17) {
                LungsArray.push(item.Description);
            }
        });

        if (tempCardiacArray.length > 0) {
            $scope.PreAdmAnesthetistQuickSummary.SelectedCardiacIssues = tempCardiacArray.join(", ");
        } else {
            $scope.PreAdmAnesthetistQuickSummary.SelectedCardiacIssues = "";
        }
        if (tempPulmonaryArray.length > 0) {
            $scope.PreAdmAnesthetistQuickSummary.SelectedPulmonaryIssues = tempPulmonaryArray.join(", ");
        } else {
            $scope.PreAdmAnesthetistQuickSummary.SelectedPulmonaryIssues = "";
        }
        if (tempHepaticArray.length > 0) {
            $scope.PreAdmAnesthetistQuickSummary.SelectedHepaticIssues = tempHepaticArray.join(", ");
        } else {
            $scope.PreAdmAnesthetistQuickSummary.SelectedHepaticIssues = "";
        }
        if (tempEndocrineArray.length > 0) {
            $scope.PreAdmAnesthetistQuickSummary.SelectedEndocrineIssues = tempEndocrineArray.join(", ");
        } else {
            $scope.PreAdmAnesthetistQuickSummary.SelectedEndocrineIssues = "";
        }
        if (tempNeurologicArray.length > 0) {
            $scope.PreAdmAnesthetistQuickSummary.SelectedNeurologicIssues = tempNeurologicArray.join(", ");
        } else {
            $scope.PreAdmAnesthetistQuickSummary.SelectedNeurologicIssues = "";
        }
        if (tempHemeOneArray.length > 0) {
            $scope.PreAdmAnesthetistQuickSummary.SelectedHemeOncIssues = tempHemeOneArray.join(", ");
        } else {
            $scope.PreAdmAnesthetistQuickSummary.SelectedHemeOncIssues = "";
        }
        if (tempNervousSystemArray.length > 0) {
            $scope.PreAdmAnesthetistQuickSummary.SelectedNervousSystemIssues = tempNervousSystemArray.join(", ");
        } else {
            $scope.PreAdmAnesthetistQuickSummary.SelectedNervousSystemIssues = "";
        }
        if (tempKidneyDiseaseArray.length > 0) {
            $scope.PreAdmAnesthetistQuickSummary.SelectedKidneyDiseaseIssues = tempKidneyDiseaseArray.join(", ");
        } else {
            $scope.PreAdmAnesthetistQuickSummary.SelectedKidneyDiseaseIssues = "";
        }
        if (tempMusculoSkeletalArray.length > 0) {
            $scope.PreAdmAnesthetistQuickSummary.SelectedMusculoSkeletalSystemIssues = tempMusculoSkeletalArray.join(", ");
        } else {
            $scope.PreAdmAnesthetistQuickSummary.SelectedMusculoSkeletalSystemIssues = "";
        }
        if (tempAutoImmuneArray.length > 0) {
            $scope.PreAdmAnesthetistQuickSummary.SelectedAutoImmuneDisordersIssues = tempAutoImmuneArray.join(", ");
        } else {
            $scope.PreAdmAnesthetistQuickSummary.SelectedAutoImmuneDisordersIssues = "";
        }
        if (tempPsychosisArray.length > 0) {
            $scope.PreAdmAnesthetistQuickSummary.SelectedPsychosisIssues = tempPsychosisArray.join(", ");
        } else {
            $scope.PreAdmAnesthetistQuickSummary.SelectedPsychosisIssues = "";
        }
        if (tempOthersArray.length > 0) {
            $scope.PreAdmAnesthetistQuickSummary.SelectedOthersIssues = tempOthersArray.join(", ");
        } else {
            $scope.PreAdmAnesthetistQuickSummary.SelectedOthersIssues = "";
        }
        if (respiratoryArray.length > 0) {
            $scope.PreAdmAnesthetistQuickSummary.SelectedrespIssues = respiratoryArray.join(", ");
        } else {
            $scope.PreAdmAnesthetistQuickSummary.SelectedrespIssues = "";
        }
        if (socialArray.length > 0) {
            $scope.PreAdmAnesthetistQuickSummary.SelectedsocialIssues = socialArray.join(", ");
        } else {
            $scope.PreAdmAnesthetistQuickSummary.SelectedsocialIssues = "";
        }
        if (HeentArray.length > 0) {
            $scope.PreAdmAnesthetistQuickSummary.SelectedHeentIssues = HeentArray.join(", ");
        } else {
            $scope.PreAdmAnesthetistQuickSummary.SelectedHeentIssues = "";
        }
        if (LungsArray.length > 0) {
            $scope.PreAdmAnesthetistQuickSummary.SelectedLungsIssues = LungsArray.join(", ");
        } else {
            $scope.PreAdmAnesthetistQuickSummary.SelectedLungsIssues = "";
        }
    }

    
    $scope.GetCardioHealthAdvancedData = function (array) {
        let tempHealthArray = angular.copy(array);
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
        let respiratoryArray = [];
        let socialArray = [];
        let HeentArray = [];
        let LungsArray = [];
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
            if (item.CategoryId === 13) {
                respiratoryArray.push(item.Description);
            }
            if (item.CategoryId === 15) {
                socialArray.push(item.Description);
            }
            if (item.CategoryId === 16) {
                HeentArray.push(item.Description);
            }
            if (item.CategoryId === 17) {
                LungsArray.push(item.Description);
            }
        });

        if (tempCardiacArray.length > 0) {
            $scope.PreAdmCardioQuickSummaryObj.SelectedCardiacIssues = tempCardiacArray.join(", ");
        } else {
            $scope.PreAdmCardioQuickSummaryObj.SelectedCardiacIssues = "";
        }
        if (tempPulmonaryArray.length > 0) {
            $scope.PreAdmCardioQuickSummaryObj.SelectedPulmonaryIssues = tempPulmonaryArray.join(", ");
        } else {
            $scope.PreAdmCardioQuickSummaryObj.SelectedPulmonaryIssues = "";
        }
        if (tempHepaticArray.length > 0) {
            $scope.PreAdmCardioQuickSummaryObj.SelectedHepaticIssues = tempHepaticArray.join(", ");
        } else {
            $scope.PreAdmCardioQuickSummaryObj.SelectedHepaticIssues = "";
        }
        if (tempEndocrineArray.length > 0) {
            $scope.PreAdmCardioQuickSummaryObj.SelectedEndocrineIssues = tempEndocrineArray.join(", ");
        } else {
            $scope.PreAdmCardioQuickSummaryObj.SelectedEndocrineIssues = "";
        }
        if (tempNeurologicArray.length > 0) {
            $scope.PreAdmCardioQuickSummaryObj.SelectedNeurologicIssues = tempNeurologicArray.join(", ");
        } else {
            $scope.PreAdmCardioQuickSummaryObj.SelectedNeurologicIssues = "";
        }
        if (tempHemeOneArray.length > 0) {
            $scope.PreAdmCardioQuickSummaryObj.SelectedHemeOncIssues = tempHemeOneArray.join(", ");
        } else {
            $scope.PreAdmCardioQuickSummaryObj.SelectedHemeOncIssues = "";
        }
        if (tempNervousSystemArray.length > 0) {
            $scope.PreAdmCardioQuickSummaryObj.SelectedNervousSystemIssues = tempNervousSystemArray.join(", ");
        } else {
            $scope.PreAdmCardioQuickSummaryObj.SelectedNervousSystemIssues = "";
        }
        if (tempKidneyDiseaseArray.length > 0) {
            $scope.PreAdmCardioQuickSummaryObj.SelectedKidneyDiseaseIssues = tempKidneyDiseaseArray.join(", ");
        } else {
            $scope.PreAdmCardioQuickSummaryObj.SelectedKidneyDiseaseIssues = "";
        }
        if (tempMusculoSkeletalArray.length > 0) {
            $scope.PreAdmCardioQuickSummaryObj.SelectedMusculoSkeletalSystemIssues = tempMusculoSkeletalArray.join(", ");
        } else {
            $scope.PreAdmCardioQuickSummaryObj.SelectedMusculoSkeletalSystemIssues = "";
        }
        if (tempAutoImmuneArray.length > 0) {
            $scope.PreAdmCardioQuickSummaryObj.SelectedAutoImmuneDisordersIssues = tempAutoImmuneArray.join(", ");
        } else {
            $scope.PreAdmCardioQuickSummaryObj.SelectedAutoImmuneDisordersIssues = "";
        }
        if (tempPsychosisArray.length > 0) {
            $scope.PreAdmCardioQuickSummaryObj.SelectedPsychosisIssues = tempPsychosisArray.join(", ");
        } else {
            $scope.PreAdmCardioQuickSummaryObj.SelectedPsychosisIssues = "";
        }
        if (tempOthersArray.length > 0) {
            $scope.PreAdmCardioQuickSummaryObj.SelectedOthersIssues = tempOthersArray.join(", ");
        } else {
            $scope.PreAdmCardioQuickSummaryObj.SelectedOthersIssues = "";
        }
        if (respiratoryArray.length > 0) {
            $scope.PreAdmCardioQuickSummaryObj.SelectedrespIssues = respiratoryArray.join(", ");
        } else {
            $scope.PreAdmCardioQuickSummaryObj.SelectedrespIssues = "";
        }
        if (socialArray.length > 0) {
            $scope.PreAdmCardioQuickSummaryObj.SelectedsocialIssues = socialArray.join(", ");
        } else {
            $scope.PreAdmCardioQuickSummaryObj.SelectedsocialIssues = "";
        }
        if (HeentArray.length > 0) {
            $scope.PreAdmCardioQuickSummaryObj.SelectedHeentIssues = HeentArray.join(", ");
        } else {
            $scope.PreAdmCardioQuickSummaryObj.SelectedHeentIssues = "";
        }
        if (LungsArray.length > 0) {
            $scope.PreAdmCardioQuickSummaryObj.SelectedLungsIssues = LungsArray.join(", ");
        } else {
            $scope.PreAdmCardioQuickSummaryObj.SelectedLungsIssues = "";
        }
    }

    $scope.IsSocialHealthArrayShowInd = false;
    $scope.GetPreAdmissionDetails = function () {

        let appointmentId = null;
        if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
            appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
        }
        
        if ($scope.cacheStorageItem.AppointmentTypeId == 7 || $scope.cacheStorageItem.AppointmentTypeId == 6) {
            appointmentId = $scope.cacheStorageItem.AppointmentId;
        }

        let PatientSurgeryId = null;
        if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
            if ($scope.cacheStorageItem.PreAdmSurgeryList.length > 0) {
                PatientSurgeryId = $scope.cacheStorageItem.PreAdmSurgeryList[0].PatientSurgeryId;
            }
        } else if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
            if ($scope.cacheStorageItem.SurgeryList.length > 0) {
                PatientSurgeryId = $scope.cacheStorageItem.SurgeryList[0].PatientSurgeryId;
            }
        }

        let ReqObj = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": appointmentId || 0,
            "PatientId": $scope.cacheStorageItem.PatientID || 0,
            "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId || 0,
            "PatientSurgeryId": PatientSurgeryId || null,
        };

        $q.all([
            eHnoteSurgeryService.GetPatientPreAdmissionDetails(ReqObj),
        ]).then(function (resp) {

            if (resp[0].data.status === "Success") {
                if (resp[0].data.LastSignOffUserDetails.length > 0) {
                    $scope.PreAdmAnesthetistQuickSummary.LastSignOffUserDetails = resp[0].data.LastSignOffUserDetails || [];
                } else {
                    $scope.PreAdmAnesthetistQuickSummary.LastSignOffUserDetails = [];
                }

                if (resp[0].data.AllergyItems.length > 0) {
                    $scope.PreAdmAnesthetistQuickSummary.AllergyItems = resp[0].data.AllergyItems || [];
                } else {
                    $scope.PreAdmAnesthetistQuickSummary.AllergyItems = [];
                }
                if (resp[0].data.CurrentEyeMedicationList.length > 0) {
                    $scope.PreAdmAnesthetistQuickSummary.CurrentEyeMedications = resp[0].data.CurrentEyeMedicationList || [];
                } else {
                    $scope.PreAdmAnesthetistQuickSummary.CurrentEyeMedications = [];
                }
                if (resp[0].data.CurrentSystemicMedicationList.length > 0) {
                    $scope.PreAdmAnesthetistQuickSummary.CurrentSystemicMedicationsHistory = resp[0].data.CurrentSystemicMedicationList || [];
                } else {
                    $scope.PreAdmAnesthetistQuickSummary.CurrentSystemicMedicationsHistory = [];
                }
                if (resp[0].data.SurgicalHistory.length > 0) {
                    $scope.PreAdmAnesthetistQuickSummary.SurgicalHistory = resp[0].data.SurgicalHistory || [];
                } else {
                    $scope.PreAdmAnesthetistQuickSummary.SurgicalHistory = [];
                }

                if (resp[0].data.ROSOverAllRemarks != '') {
                    $scope.PreAdmAnesthetistQuickSummary.ROSOverAllRemarks = resp[0].data.ROSOverAllRemarks || [];
                } else {
                    $scope.PreAdmAnesthetistQuickSummary.ROSOverAllRemarks = '';
                }

                $scope.PreAdmAnesthetistQuickSummary.ROSOverAllRemarks = resp[0].data.ROSOverAllRemarks ||'';

                $scope.PreAdmAnesthetistQuickSummary.InvestigationsList = angular.copy(resp[0].data.InvestigationsList) || [];
                $scope.PreAdmAnesthetistQuickSummary.MedicineOrdersList = angular.copy(resp[0].data.Prescription) || [];
                $scope.PreAdmAnesthetistQuickSummary.DocumentDetails = angular.copy(resp[0].data.DocumentDetails) || [];
                $scope.PreAdmAnesthetistQuickSummary.InvestigationsList = angular.copy(resp[0].data.InvestigationsList) || [];
                $scope.PreAdmAnesthetistQuickSummary.LifestyleDetail = angular.copy(resp[0].data.LifestyleDetail) || [];

                if (resp[0].data.PreAdmissionDetails.length > 0) {
                    $scope.AnesthesiaPreAdmissionDetails = angular.copy(resp[0].data.PreAdmissionDetails);
                    $scope.PreAdmissionDetails = angular.copy(resp[0].data.PreAdmissionDetails[0]);

                    $scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedBy = $scope.PreAdmissionDetails.ReviwedBy || null;
                    if ($scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedBy !== null) {
                        var AnesthetistReviewedlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedBy }) || [];
                        if (AnesthetistReviewedlist.length > 0) {
                            var SuffixName = '';
                            AnesthetistReviewedlist[0].SuffixName = AnesthetistReviewedlist[0].SuffixName || '';
                            if (AnesthetistReviewedlist[0].SuffixName != "") {
                                SuffixName = AnesthetistReviewedlist[0].SuffixName;
                            }

                            var LicenseNumber = "";

                            AnesthetistReviewedlist[0].LicenseNumber = AnesthetistReviewedlist[0].LicenseNumber || "";
                            if (AnesthetistReviewedlist[0].LicenseNumber != "") {
                                LicenseNumber = 'LIC :' + ' ' + AnesthetistReviewedlist[0].LicenseNumber;
                            }

                            if (AnesthetistReviewedlist[0].SuffixId == 10) {
                                $scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedName = angular.copy('Dr.' + AnesthetistReviewedlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            } else {
                                $scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedName = angular.copy(AnesthetistReviewedlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            }
                            //$scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedName = AnesthetistReviewedlist[0].FullName || '';
                        }
                    }

                    $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedBy = $scope.PreAdmissionDetails.AnesthesiologistReviewedBy || null;
                    if ($scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedBy !== null) {
                        var AnesthesiologistReviewedlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedBy }) || [];
                        if (AnesthesiologistReviewedlist.length > 0) {
                            var SuffixName = '';
                            AnesthesiologistReviewedlist[0].SuffixName = AnesthesiologistReviewedlist[0].SuffixName || '';
                            if (AnesthesiologistReviewedlist[0].SuffixName != "") {
                                SuffixName = AnesthesiologistReviewedlist[0].SuffixName;
                            }

                            var LicenseNumber = "";

                            AnesthesiologistReviewedlist[0].LicenseNumber = AnesthesiologistReviewedlist[0].LicenseNumber || "";
                            if (AnesthesiologistReviewedlist[0].LicenseNumber != "") {
                                LicenseNumber = 'LIC :' + ' ' + AnesthesiologistReviewedlist[0].LicenseNumber;
                            }

                            if (AnesthesiologistReviewedlist[0].SuffixId == 10) {
                                $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedName = angular.copy('Dr.' + AnesthesiologistReviewedlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            } else {
                                $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedName = angular.copy(AnesthesiologistReviewedlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            }
                            //$scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedName = AnesthesiologistReviewedlist[0].FullName || '';
                        }
                    }

                    $scope.PreAdmAnesthetistQuickSummary.ReviewedDate = $scope.PreAdmissionDetails.AnesthesiaReviewedDate || "";
                    $scope.PreAdmAnesthetistQuickSummary.ReviewedTime = $scope.PreAdmissionDetails.AnesthesiaReviewedTime || "";

                    if ($scope.PreAdmissionDetails !== undefined) {
                        if ($scope.PreAdmissionDetails.Vitals.length > 0) {
                            angular.forEach($scope.PreAdmissionDetails.Vitals, function (vitem) {
                                var vitallist = [];
                                vitallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == vitem.DoctorId }) || [];
                                if (vitallist.length > 0) {
                                    vitem.UserName = angular.copy(vitallist[0].FullName);
                                }
                                let ndate = moment().format("YYYY-MM-DD");
                                let edate = ndate + " " + vitem.VitalAddTime;
                                let momentEdate = moment(edate, "YYYY-MM-DD HH:mm:ss");
                                vitem.VitalAddTime = momentEdate.format("hh:mm A");
                            });

                            $scope.PreAdmAnesthetistQuickSummary.Vitals = angular.copy($scope.PreAdmissionDetails.Vitals);
                        } else {
                            $scope.PreAdmAnesthetistQuickSummary.Vitals = [];
                        }

                        $scope.PreAdmAnesthetistQuickSummary.SystemicHistory = $scope.PreAdmissionDetails.SystemicHistory || [];
                        $scope.PreAdmAnesthetistQuickSummary.LabInvestigation = $scope.PreAdmissionDetails.LabInvestigation || [];
                        $scope.PreAdmAnesthetistQuickSummary.LabNotes = $scope.PreAdmissionDetails.LabNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.LifestyleDetail = $scope.PreAdmissionDetails.LifestyleDetail || [];
                        $scope.PreAdmAnesthetistQuickSummary.MedicineOrdersInstructions = $scope.PreAdmissionDetails.MedicineOrdersInstructions || '';
                        $scope.PreAdmAnesthetistQuickSummary.PreAdmissionStatus = $scope.PreAdmissionDetails.PreAdmissionStatus || '';

                        //$scope.PreAdmAnesthetistQuickSummary.LabObj = $scope.GetLabObj();
                        //$scope.PreAdmAnesthetistQuickSummary.LabObj.HGB = $scope.PreAdmissionDetails.LabTest.HGB;
                        //$scope.PreAdmAnesthetistQuickSummary.LabObj.HCT = $scope.PreAdmissionDetails.LabTest.HCT;
                        //$scope.PreAdmAnesthetistQuickSummary.LabObj.WBC = $scope.PreAdmissionDetails.LabTest.WBC;
                        //$scope.PreAdmAnesthetistQuickSummary.LabObj.RBC = $scope.PreAdmissionDetails.LabTest.RBC;
                        //$scope.PreAdmAnesthetistQuickSummary.LabObj.A1C = $scope.PreAdmissionDetails.LabTest.A1C;
                        //$scope.PreAdmAnesthetistQuickSummary.LabObj.Creatinine = $scope.PreAdmissionDetails.LabTest.Creatinine;
                        //$scope.PreAdmAnesthetistQuickSummary.LabObj.RBS = $scope.PreAdmissionDetails.LabTest.RBS;
                        //$scope.PreAdmAnesthetistQuickSummary.LabObj.FBS = $scope.PreAdmissionDetails.LabTest.FBS;
                        //$scope.PreAdmAnesthetistQuickSummary.LabObj.PBBS = $scope.PreAdmissionDetails.LabTest.PBBS;
                        //$scope.PreAdmAnesthetistQuickSummary.LabObj.PBLS = $scope.PreAdmissionDetails.LabTest.PBLS;
                        //$scope.PreAdmAnesthetistQuickSummary.LabObj.Notes = $scope.PreAdmissionDetails.LabTest.Notes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.LabObj.Others = $scope.PreAdmissionDetails.LabTest.Others || "";
                        //$scope.PreAdmAnesthetistQuickSummary.LabObj.IsBloodAvailable = $scope.PreAdmissionDetails.LabTest.IsBloodAvailable || "";
                        //$scope.PreAdmAnesthetistQuickSummary.LabObj.IsPretransfusion = $scope.PreAdmissionDetails.LabTest.IsPretransfusion || "";
                        //$scope.PreAdmAnesthetistQuickSummary.LabObj.UrineAnalysis = $scope.PreAdmissionDetails.LabTest.UrineAnalysis || "";
                        //if ($scope.PreAdmissionDetails.LabTest.TestArray.length > 0) {
                        //    $scope.PreAdmAnesthetistQuickSummary.LabObj.LabTestArray = $scope.PreAdmissionDetails.LabTest.TestArray;
                        //}

                        $scope.PreAdmissionDetails.CardioVascular = $scope.PreAdmissionDetails.CardioVascular || "";
                        if ($scope.PreAdmissionDetails.CardioVascular != "") {
                            //$scope.PreAdmAnesthetistQuickSummary.CardioVascularObj.Systolic = $scope.PreAdmissionDetails.CardioVascular.Systolic;
                            //$scope.PreAdmAnesthetistQuickSummary.CardioVascularObj.Diastolic = $scope.PreAdmissionDetails.CardioVascular.Diastolic;
                            //$scope.PreAdmAnesthetistQuickSummary.CardioVascularObj.PR = $scope.PreAdmissionDetails.CardioVascular.PR;
                            /*$scope.PreAdmAnesthetistQuickSummary.CardioVascularObj.BPlevel = $scope.PreAdmissionDetails.CardioVascular.BPlevel || "";*/
                            $scope.PreAdmAnesthetistQuickSummary.CardioVascularObj.ECG = $scope.PreAdmissionDetails.CardioVascular.CardioECG||'';
                            $scope.PreAdmAnesthetistQuickSummary.CardioVascularObj.ECGUnits = $scope.PreAdmissionDetails.CardioVascular.CardioECGUnits;
                            $scope.PreAdmAnesthetistQuickSummary.CardioVascularObj.Notes = $scope.PreAdmissionDetails.CardioVascular.CardioNotes || "";
                        }

                        $scope.PreAdmissionDetails.Airway = $scope.PreAdmissionDetails.Airway || '';
                        if ($scope.PreAdmissionDetails.Airway != '') {
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.ROMTMS = $scope.PreAdmissionDetails.Airway.ROMTMS ||'';
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.ROMNECKLAT = $scope.PreAdmissionDetails.Airway.ROMNECKLAT ||'';
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.ROMNECKAP = $scope.PreAdmissionDetails.Airway.ROMNECKAP ||'';
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Notes = $scope.PreAdmissionDetails.Airway.Notes || "";
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.IsNormal = $scope.PreAdmissionDetails.Airway.IsNormal;
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Class = $scope.PreAdmissionDetails.Airway.Class ||'';
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Dentition = $scope.PreAdmissionDetails.Airway.Dentition || "";
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.DentitionList = $scope.PreAdmissionDetails.Airway.DentitionList || [];
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.ChemistryNotes = $scope.PreAdmissionDetails.Airway.ChemistryNotes || '';
                        }

                        $scope.PreAdmAnesthetistQuickSummary.AnesthesiaTypelist = $scope.PreAdmissionDetails.AnesthesiaTypelist || [];
                        $scope.PreAdmAnesthetistQuickSummary.AnesthesiaTypelist = _.uniq($scope.PreAdmAnesthetistQuickSummary.AnesthesiaTypelist, false, function (p) { return p.AnesthesiaTypeId; });
                        $scope.PreAdmissionDetails.AnesthesiaPlan = $scope.PreAdmissionDetails.AnesthesiaPlan || "";
                        if ($scope.PreAdmissionDetails.AnesthesiaPlan != "") {
                            //$scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj = angular.copy($scope.GetAPAnesthesiaOptionsObj());
                            //$scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.IsTopicalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsTopicalAnesthesia;
                            //$scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.IsGeneralAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsGeneralAnesthesia;
                            //$scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.IsLocalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsLocalAnesthesia;
                            //$scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsPeriBulbarAnesthesia;
                            //$scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.IsRegionalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsRegionalAnesthesia;
                            //$scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.IsSubtenonAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsSubtenonAnesthesia;
                            $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.Dosage = $scope.PreAdmissionDetails.AnesthesiaPlan.AnesPlanDosage || '';
                            $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthetistNotes = $scope.PreAdmissionDetails.AnesthesiaPlan.AnesthetistNotes || '';
                            $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesPlanAnesthetistId = $scope.PreAdmissionDetails.AnesthesiaPlan.AnesPlanAnesthetistId || null;
                            $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistId = $scope.PreAdmissionDetails.AnesthesiaPlan.AnesthesiologistId || null;
                            $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.ReviewedDate = $scope.PreAdmissionDetails.AnesthesiaReviewedDate || '';
                            $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthetistName = '';
                            $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistName = '';

                            if ($scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesPlanAnesthetistId !== null) {
                                let Anesthetistlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesPlanAnesthetistId });
                                Anesthetistlist = Anesthetistlist || [];
                                if (Anesthetistlist.length > 0) {
                                    var SuffixName = '';
                                    Anesthetistlist[0].SuffixName = Anesthetistlist[0].SuffixName || '';
                                    if (Anesthetistlist[0].SuffixName != "") {
                                        SuffixName = Anesthetistlist[0].SuffixName;
                                    }

                                    var LicenseNumber = "";

                                    Anesthetistlist[0].LicenseNumber = Anesthetistlist[0].LicenseNumber || "";
                                    if (Anesthetistlist[0].LicenseNumber != "") {
                                        LicenseNumber = 'LIC :' + ' ' + Anesthetistlist[0].LicenseNumber;
                                    }

                                    if (Anesthetistlist[0].SuffixId == 10) {
                                        $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthetistName = ' Dr. ' + Anesthetistlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                                    } else {
                                        $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthetistName = Anesthetistlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                                    }
                                    //$scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthetistName = Anesthetistlist[0].FullName;
                                }
                            }

                            if ($scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistId !== null) {
                                let AnesthesiologistList = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistId });
                                AnesthesiologistList = AnesthesiologistList || [];
                                if (AnesthesiologistList.length > 0) {
                                    var SuffixName = '';
                                    AnesthesiologistList[0].SuffixName = AnesthesiologistList[0].SuffixName || '';
                                    if (AnesthesiologistList[0].SuffixName != "") {
                                        SuffixName = AnesthesiologistList[0].SuffixName;
                                    }

                                    var LicenseNumber = "";

                                    AnesthesiologistList[0].LicenseNumber = AnesthesiologistList[0].LicenseNumber || "";
                                    if (AnesthesiologistList[0].LicenseNumber != "") {
                                        LicenseNumber = 'LIC :' + ' ' + AnesthesiologistList[0].LicenseNumber;
                                    }

                                    if (AnesthesiologistList[0].SuffixId == 10) {
                                        $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistName = ' Dr. ' + AnesthesiologistList[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                                    } else {
                                        $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistName = AnesthesiologistList[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                                    }
                                   // $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistName = AnesthesiologistList[0].FullName;
                                }
                            }
                        }

                        $scope.PreAdmissionDetails.AssessmentsASA = $scope.PreAdmissionDetails.AssessmentsASA || "";
                        if ($scope.PreAdmissionDetails.AssessmentsASA != "") {
                            $scope.PreAdmAnesthetistQuickSummary.ASAObj.Notes = $scope.PreAdmissionDetails.AssessmentsASA.Notes || "";
                            $scope.PreAdmAnesthetistQuickSummary.ASAObj.Value = $scope.PreAdmissionDetails.AssessmentsASA.Value || '';
                            $scope.PreAdmAnesthetistQuickSummary.ASAObj.ENotes = $scope.PreAdmissionDetails.AssessmentsASA.ENotes || '';
                            $scope.PreAdmAnesthetistQuickSummary.ASAObj.EValue = $scope.PreAdmissionDetails.AssessmentsASA.EValue || '';
                        }

                        $scope.PreAdmAnesthetistQuickSummary.PreviousAnesthetics = $scope.PreAdmissionDetails.PreviousAnesthetics || [];
                        $scope.PreAdmAnesthetistQuickSummary.ASAClassificationNotes = $scope.PreAdmissionDetails.ASAClassificationNotes || '';

                        //if ($scope.PreAdmissionDetails.PrevAnesthesia != "") {
                        //    $scope.PreAdmAnesthetistQuickSummary.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());
                        //    $scope.PreAdmAnesthetistQuickSummary.PrevAnestheticsObj.Notes = $scope.PreAdmissionDetails.PrevAnesthesia.Notes || "";
                        //    $scope.PreAdmAnesthetistQuickSummary.PrevAnestheticsObj.IsComplications = $scope.PreAdmissionDetails.PrevAnesthesia.IsComplications;
                        //    $scope.PreAdmAnesthetistQuickSummary.PrevAnestheticsObj.IsContinue = $scope.PreAdmissionDetails.PrevAnesthesia.IsContinue;
                        //    $scope.PreAdmAnesthetistQuickSummary.PrevAnestheticsObj.IsDifficultAirway = $scope.PreAdmissionDetails.PrevAnesthesia.IsDifficultAirway;
                        //    $scope.PreAdmAnesthetistQuickSummary.PrevAnestheticsObj.IsFamilyHistory = $scope.PreAdmissionDetails.PrevAnesthesia.IsFamilyHistory;
                        //    $scope.PreAdmAnesthetistQuickSummary.PrevAnestheticsObj.IsPONV = $scope.PreAdmissionDetails.PrevAnesthesia.IsPONV;
                        //    $scope.PreAdmAnesthetistQuickSummary.PrevAnestheticsObj.IsPatientDNR = $scope.PreAdmissionDetails.PrevAnesthesia.IsPatientDNR;
                        //    $scope.PreAdmAnesthetistQuickSummary.PrevAnestheticsObj.IsPrevAnesthesia = $scope.PreAdmissionDetails.PrevAnesthesia.IsPrevAnesthesia;
                        //    $scope.PreAdmAnesthetistQuickSummary.PrevAnestheticsObj.IsSuspend = $scope.PreAdmissionDetails.PrevAnesthesia.IsSuspend;
                        //}

                        //$scope.PreAdmissionDetails.HealthArray = $scope.PreAdmissionDetails.HealthArray || [];
                        //if ($scope.PreAdmissionDetails.HealthArray.length > 0) {
                        //    $scope.PreAdmAnesthetistQuickSummary.HealthArray = angular.copy($scope.PreAdmissionDetails.HealthArray);
                        //}

                        //$scope.PreAdmissionDetails.DocumentDetails = $scope.PreAdmissionDetails.DocumentDetails || [];
                        //if ($scope.PreAdmissionDetails.DocumentDetails.length > 0) {
                        //    $scope.PreAdmAnesthetistQuickSummary.DocumentDetails = angular.copy($scope.PreAdmissionDetails.DocumentDetails);
                        //}
                        //else {
                        //    $scope.PreAdmAnesthetistQuickSummary.DocumentDetails = [];
                        //}
                    
                        //$scope.PreAdmAnesthetistQuickSummary.IsCXR = $scope.PreAdmissionDetails.IsCXR || "";
                        //$scope.PreAdmAnesthetistQuickSummary.CXRHistory = $scope.PreAdmissionDetails.CXRHistory || "";
                        //$scope.PreAdmAnesthetistQuickSummary.IsCardiacWNL = $scope.PreAdmissionDetails.IsCardiacWNL;
                        //$scope.PreAdmAnesthetistQuickSummary.IsCNSHistory = $scope.PreAdmissionDetails.IsCNSHistory;
                        //$scope.PreAdmAnesthetistQuickSummary.IsCardiovascularHistory = $scope.PreAdmissionDetails.IsCardiovascularHistory;
                        //$scope.PreAdmAnesthetistQuickSummary.IsAutoImmuneDisordersWNL = $scope.PreAdmissionDetails.IsAutoImmuneDisordersWNL;
                        //$scope.PreAdmAnesthetistQuickSummary.IsEndocrineWNL = $scope.PreAdmissionDetails.IsEndocrineWNL;
                        //$scope.PreAdmAnesthetistQuickSummary.IsHemeOncWNL = $scope.PreAdmissionDetails.IsHemeOncWNL;
                        //$scope.PreAdmAnesthetistQuickSummary.IsHepaticWNL = $scope.PreAdmissionDetails.IsHepaticWNL;
                        //$scope.PreAdmAnesthetistQuickSummary.IsKidneyDiseaseWNL = $scope.PreAdmissionDetails.IsKidneyDiseaseWNL;
                        //$scope.PreAdmAnesthetistQuickSummary.IsMusculoSkeletalSystemWNL = $scope.PreAdmissionDetails.IsMusculoSkeletalSystemWNL;
                        //$scope.PreAdmAnesthetistQuickSummary.IsNervousSystemWNL = $scope.PreAdmissionDetails.IsNervousSystemWNL;
                        //$scope.PreAdmAnesthetistQuickSummary.IsNeurologicWNL = $scope.PreAdmissionDetails.IsNeurologicWNL;
                        //$scope.PreAdmAnesthetistQuickSummary.IsOthersWNL = $scope.PreAdmissionDetails.IsOthersWNL;
                        //$scope.PreAdmAnesthetistQuickSummary.IsPsychosisWNL = $scope.PreAdmissionDetails.IsPsychosisWNL;
                        //$scope.PreAdmAnesthetistQuickSummary.IsPulmonaryWNL = $scope.PreAdmissionDetails.IsPulmonaryWNL;
                        //$scope.PreAdmAnesthetistQuickSummary.IsRespiratoryNormal = $scope.PreAdmissionDetails.IsRespiratoryNormal;
                        //$scope.PreAdmAnesthetistQuickSummary.IsHeentWNL = $scope.PreAdmissionDetails.IsHeentWNL;
                        //$scope.PreAdmAnesthetistQuickSummary.IsLungsWNL = $scope.PreAdmissionDetails.IsLungsWNL;

                        //$scope.PreAdmAnesthetistQuickSummary.SocialNotes = $scope.PreAdmissionDetails.SocialNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.RespiratoryNotes = $scope.PreAdmissionDetails.RespiratoryNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.PulmonaryNotes = $scope.PreAdmissionDetails.PulmonaryNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.PsychosisNotes = $scope.PreAdmissionDetails.PsychosisNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.OthersNotes = $scope.PreAdmissionDetails.OthersNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.NeurologicNotes = $scope.PreAdmissionDetails.NeurologicNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.NervousSystemNotes = $scope.PreAdmissionDetails.NervousSystemNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.MusculoSkeletalSystemNotes = $scope.PreAdmissionDetails.MusculoSkeletalSystemNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.KidneyDiseaseNotes = $scope.PreAdmissionDetails.KidneyDiseaseNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.HepaticNotes = $scope.PreAdmissionDetails.HepaticNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.HemeOncNotes = $scope.PreAdmissionDetails.HemeOncNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.EndocrineNotes = $scope.PreAdmissionDetails.EndocrineNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.CardiacNotes = $scope.PreAdmissionDetails.CardiacNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.CNSNotes = $scope.PreAdmissionDetails.CNSNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.AutoImmuneDisordersNotes = $scope.PreAdmissionDetails.AutoImmuneDisordersNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.HeentNotes = $scope.PreAdmissionDetails.HeentNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.LungsNotes = $scope.PreAdmissionDetails.LungsNotes || "";
                        //$scope.PreAdmAnesthetistQuickSummary.CurrentMedicationList = angular.copy($scope.PreAdmissionDetails.CurrentMedicationList);
                        //$scope.PreAdmAnesthetistQuickSummary.MedicationsList = angular.copy($scope.PreAdmissionDetails.MedicationsList);
                        //$scope.PreAdmAnesthetistQuickSummary.InvestigationsList = angular.copy($scope.PreAdmissionDetails.InvestigationsList);

                        //angular.forEach($scope.PreAdmAnesthetistQuickSummary.HealthArray, function (item) {
                        //    let temparray = $filter('filter')($scope.PreAdmAnesthetistQuickSummary.HealthArray, { "Id": item.Id }, true);
                        //    temparray = temparray || [];
                        //    if (temparray.length > 0) {
                        //        item.IsChecked = temparray[0].IsChecked;
                        //    } else {
                        //        item.IsChecked = null;
                        //    }                          
                        //});
                    

                        //if ($scope.PreAdmAnesthetistQuickSummary.IsCNSHistory == null && $scope.PreAdmAnesthetistQuickSummary.CNSNotes == "") {
                        //    $scope.PreAdmAnesthetistQuickSummary.IsPrAdmEvaluationCNSInd = false;
                        //} else {
                        //    $scope.PreAdmAnesthetistQuickSummary.IsPrAdmEvaluationCNSInd = true;
                        //}

                        //$scope.PreAdmAnesthetistQuickSummary.ReviewedBy = $scope.PreAdmissionDetails.ReviwedBy;

                        //if ($scope.PreAdmissionDetails.HealthArray.length > 0) {
                        //    $scope.GetHealthAdvancedData($scope.PreAdmissionDetails.HealthArray);
                        //}

                    }

                    // medicine orders // prescription

                    //$scope.PreAdmAnesthetistQuickSummary.PrescriptionDetails = angular.copy($scope.PreAdmissionDetails.Prescription);

                    //if ($scope.PreAdmissionDetails.DocumentDetails.length > 0) {
                    //    $scope.PreAdmAnesthetistQuickSummary.DocumentDetails = angular.copy($scope.PreAdmissionDetails.DocumentDetails);
                    //}
                    //else {
                    //    $scope.PreAdmAnesthetistQuickSummary.DocumentDetails = [];
                    //}

                    //var SHealthArray = $filter("filter")($scope.PreAdmAnesthetistQuickSummary.HealthArray, function (Nitem) {
                    //    return (Nitem.CategoryId == 15) && (Nitem.IsChecked === true || Nitem.IsChecked === false);
                    //}) || [];
                    //if (SHealthArray.length > 0) {
                    //    $scope.IsSocialHealthArrayShowInd = true;

                    //}

                } else {
                    $scope.AnesthesiaPreAdmissionDetails = [];

                    $scope.PreAdmAnesthetistQuickSummary = angular.copy($scope.GetPreAdmAnesthetistQuickSummary());
                    $scope.PreAdmAnesthetistQuickSummary.LabObj = angular.copy($scope.GetLabObj());
                    $scope.PreAdmAnesthetistQuickSummary.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());
                    $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj = angular.copy($scope.GetAPAnesthesiaOptionsObj());

                    //// ROS

                    //if (resp[0].data.CurrentSystemicMedicationList.length > 0) {
                    //    $scope.PreAdmAnesthetistQuickSummary.CurrentSystemicMedicationsHistory = angular.copy(resp[0].data.CurrentSystemicMedicationList);
                    //}

                    //if (resp[0].data.CurrentEyeMedicationList.length > 0) {
                    //    $scope.PreAdmAnesthetistQuickSummary.CurrentEyeMedications = angular.copy(resp[0].data.CurrentEyeMedicationList);
                    //}

                    //if (resp[0].data.AllergyItems.length > 0) {
                    //    $scope.PreAdmAnesthetistQuickSummary.AllergyItems = angular.copy(resp[0].data.AllergyItems);
                    //}
                    //if (resp[0].data.SystemicHistory.length > 0) {
                    //    $scope.PreAdmAnesthetistQuickSummary.SystemicHistory = angular.copy(resp[0].data.SystemicHistory);
                    //}
                    //if (resp[0].data.SurgicalHistory.length > 0) {
                    //    $scope.PreAdmAnesthetistQuickSummary.SurgicalHistory = angular.copy(resp[0].data.SurgicalHistory);
                    //}
                }
            }

            $scope.AllAnesthetistList = [];
            if ($scope.allUserList.length > 0) {
                angular.forEach($scope.allUserList, function (item) {
                    if (item.RoleId == 30 || item.RoleId == 8 || item.DoctorID == $scope.UserId || item.RoleId == 1 || item.RoleId == 43) {
                        $scope.AllAnesthetistList.push(item);
                    }
                })
            };
        });
    }

    $scope.GetPreAdmissionCardiologistDetails = function () {

        let appointmentId = null;
        if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
            appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
        }

        if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
            appointmentId = $scope.cacheStorageItem.AppointmentId;
        }

        let PatientSurgeryId = null;
        if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
            if ($scope.cacheStorageItem.PreAdmSurgeryList.length > 0) {
                PatientSurgeryId = $scope.cacheStorageItem.PreAdmSurgeryList[0].PatientSurgeryId;
            }
        } else if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
            if ($scope.cacheStorageItem.SurgeryList.length > 0) {
                PatientSurgeryId = $scope.cacheStorageItem.SurgeryList[0].PatientSurgeryId;
            }
        }

        let ReqObj = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": appointmentId || 0,
            "PatientId": $scope.cacheStorageItem.PatientID || 0,
            "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId || 0,
            "PatientSurgeryId": PatientSurgeryId || 0,
        };

        $q.all([
            eHnoteSurgeryService.GetPreAdmissionCardiologistDetails(ReqObj)
        ]).then(function (resp) {

            if (resp[0].data.status === "Success") {
                $scope.PreAdmCardioQuickSummaryObj = angular.copy($scope.GetPreAdmCardioQuickSummaryObj());

                // ROS

                if (resp[0].data.CurrentSystemicMedicationList.length > 0) {
                    $scope.PreAdmCardioQuickSummaryObj.CurrentSystemicMedicationsHistory = angular.copy(resp[0].data.CurrentSystemicMedicationList);
                } else {
                    $scope.PreAdmCardioQuickSummaryObj.CurrentSystemicMedicationsHistory = [];
                }

                if (resp[0].data.CurrentEyeMedicationList.length > 0) {
                    $scope.PreAdmCardioQuickSummaryObj.CurrentEyeMedications = angular.copy(resp[0].data.CurrentEyeMedicationList);
                } else {
                    $scope.PreAdmCardioQuickSummaryObj.CurrentEyeMedications = [];
                }

                if (resp[0].data.AllergyItems.length > 0) {
                    $scope.PreAdmCardioQuickSummaryObj.AllergyItems = angular.copy(resp[0].data.AllergyItems);
                } else {
                    $scope.PreAdmCardioQuickSummaryObj.AllergyItems = [];
                }
                if (resp[0].data.SurgicalHistory.length > 0) {
                    $scope.PreAdmCardioQuickSummaryObj.SurgicalHistory = angular.copy(resp[0].data.SurgicalHistory);
                } else {
                    $scope.PreAdmCardioQuickSummaryObj.SurgicalHistory = [];
                }
                if (resp[0].data.LastSignOffUserDetails.length > 0) {
                    $scope.PreAdmCardioQuickSummaryObj.LastSignOffUserDetails = angular.copy(resp[0].data.LastSignOffUserDetails) || [];
                }

                $scope.PreAdmCardioQuickSummaryObj.ROSOverAllRemarks = resp[0].data.ROSOverAllRemarks || '';
                $scope.PreAdmCardioQuickSummaryObj.PrescriptionDetails = resp[0].data.Prescription || [];
                $scope.PreAdmCardioQuickSummaryObj.InvestigationsList = resp[0].data.InvestigationsList || [];

                //$scope.PreAdmCardioQuickSummaryObj.AnesthesiaPlan = angular.copy(resp[0].data.AnesthesiaPlan) || [];

                //if ($scope.PreAdmCardioQuickSummaryObj.AnesthesiaPlan.length > 0) {
                //    let Anesthetistlist = $filter("filter")($scope.AnesthetistArray, function (kitem) { return kitem.DoctorID == $scope.PreAdmCardioQuickSummaryObj.AnesthesiaPlan[0].AnesPlanAnesthetistId });

                //    Anesthetistlist = Anesthetistlist || [];
                //    if (Anesthetistlist.length > 0) {
                //        $scope.PreAdmCardioQuickSummaryObj.AnesthetistName = Anesthetistlist[0].FullName;
                //    }
                //}


                if (resp[0].data.CardiologistDetails.length > 0) {
                    $scope.CardiologistPreAdmissionDetails = angular.copy(resp[0].data.CardiologistDetails);
                    $scope.PreAdmCardiologistDetails = angular.copy(resp[0].data.CardiologistDetails[0]);

                    if ($scope.PreAdmCardiologistDetails !== undefined) {

                        var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmCardiologistDetails.CardioLogistReviewedBy }, true)[0] || [];
                        var SuffixName = '';
                        ReviewName.SuffixName = ReviewName.SuffixName || '';
                        if (ReviewName.SuffixName != "") {
                            SuffixName = ReviewName.FullName + ' ' + ReviewName.SuffixName + ',';
                        }
                        else {
                            SuffixName = ReviewName.FullName + ',';
                        }
                        var LicenseNumber = "";

                        ReviewName.LicenseNumber = ReviewName.LicenseNumber || "";
                        if (ReviewName.LicenseNumber != "") {
                            LicenseNumber = 'Lic:' + ' ' + ReviewName.LicenseNumber + ',';
                        }

                        if (ReviewName.SuffixId == 10) {
                            $scope.PreAdmCardioQuickSummaryObj.ReviewByName = angular.copy('Dr. ' + SuffixName + ' ' + LicenseNumber);
                        } else {
                            $scope.PreAdmCardioQuickSummaryObj.ReviewByName = angular.copy(SuffixName + ' ' + LicenseNumber);
                        }
                        //$scope.PreAdmCardioQuickSummaryObj.ReviewByName = ReviewName.FullName || '';
                        $scope.PreAdmCardioQuickSummaryObj.ReviewedDate = $scope.PreAdmCardiologistDetails.CardioLogistReviewedDate || "";
                        $scope.PreAdmCardioQuickSummaryObj.ReviewedTime = $scope.PreAdmCardiologistDetails.CardioLogistReviewedTime || "";

                        $scope.PreAdmCardioQuickSummaryObj.CardiologyChartStatus = $scope.PreAdmCardiologistDetails.CardiologyChartStatus || '';
                        $scope.PreAdmCardioQuickSummaryObj.CardiologyStatus = $scope.PreAdmCardiologistDetails.CardiologyStatus || '';
                        $scope.PreAdmCardioQuickSummaryObj.MedicineOrdersInstructions = $scope.PreAdmCardiologistDetails.MedicineOrdersInstructions || '';

                        if ($scope.PreAdmCardioQuickSummaryObj.ReviewByName != "" || $scope.PreAdmCardioQuickSummaryObj.ReviewedDate != "" || $scope.PreAdmCardioQuickSummaryObj.ReviewedTime != "") {
                            $scope.PreAdmCardioQuickSummaryObj.ReviewedbyInd = true;
                        } else {
                            $scope.PreAdmCardioQuickSummaryObj.ReviewedbyInd = false;
                        }

                        $scope.PreAdmCardioQuickSummaryObj.LabInvestigation = $scope.PreAdmCardiologistDetails.LabInvestigation || [];
                        $scope.PreAdmCardioQuickSummaryObj.IsChestPain = $scope.PreAdmCardiologistDetails.IsChestPain;
                        $scope.PreAdmCardioQuickSummaryObj.PresentIllness = angular.copy($scope.PreAdmCardiologistDetails.Presentillness);
                        if ($scope.PreAdmCardioQuickSummaryObj.PresentIllness !== '') {
                            $scope.PreAdmCardioQuickSummaryObj.PresentIllness = $scope.PreAdmCardioQuickSummaryObj.PresentIllness.replace(/<br>/g, '\n');
                        }
                        $scope.PreAdmCardioQuickSummaryObj.Chemistry = angular.copy($scope.PreAdmCardiologistDetails.Chemistry);
                        $scope.PreAdmCardioQuickSummaryObj.Treatment = angular.copy($scope.PreAdmCardiologistDetails.Treatment);
                        if ($scope.PreAdmCardioQuickSummaryObj.Treatment !== '') {
                            $scope.PreAdmCardioQuickSummaryObj.Treatment = $scope.PreAdmCardioQuickSummaryObj.Treatment.replace(/<br>/g, '\n');
                        }
                        $scope.PreAdmCardioQuickSummaryObj.LabNotes = $scope.PreAdmCardiologistDetails.LabNotes || "";

                        $scope.PreAdmCardioQuickSummaryObj.CardioVascularObj.ECG = $scope.PreAdmCardiologistDetails.ECGValue;
                        $scope.PreAdmCardioQuickSummaryObj.CardioVascularObj.ECGUnits = $scope.PreAdmCardiologistDetails.ECGUnits;
                        $scope.PreAdmCardioQuickSummaryObj.CardioVascularObj.Notes = $scope.PreAdmCardiologistDetails.ECGNotes || "";

                        $scope.PreAdmCardiologistDetails.Vitals = $scope.PreAdmCardiologistDetails.Vitals || [];
                        if ($scope.PreAdmCardiologistDetails.Vitals.length > 0) {
                            angular.forEach($scope.PreAdmCardiologistDetails.Vitals, function (vitem) {
                                var vitallist = [];
                                vitallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == vitem.DoctorId }) || [];
                                if (vitallist.length > 0) {
                                    vitem.UserName = angular.copy(vitallist[0].FullName);
                                }
                                let ndate = moment().format("YYYY-MM-DD");
                                let edate = ndate + " " + vitem.VitalAddTime;
                                let momentEdate = moment(edate, "YYYY-MM-DD HH:mm:ss");
                                vitem.VitalAddTime = momentEdate.format("hh:mm A");
                            });

                            $scope.PreAdmCardioQuickSummaryObj.Vitals = angular.copy($scope.PreAdmCardiologistDetails.Vitals);
                        } else {
                            $scope.PreAdmCardioQuickSummaryObj.Vitals = [];
                        }


                        //$scope.PreAdmCardioQuickSummaryObj.LabObj = $scope.GetLabObj();
                        //$scope.PreAdmCardioQuickSummaryObj.LabObj.HGB = $scope.PreAdmCardiologistDetails.LabTest.HGB;
                        //$scope.PreAdmCardioQuickSummaryObj.LabObj.HCT = $scope.PreAdmCardiologistDetails.LabTest.HCT;
                        //$scope.PreAdmCardioQuickSummaryObj.LabObj.WBC = $scope.PreAdmCardiologistDetails.LabTest.WBC;
                        //$scope.PreAdmCardioQuickSummaryObj.LabObj.RBC = $scope.PreAdmCardiologistDetails.LabTest.RBC;
                        //$scope.PreAdmCardioQuickSummaryObj.LabObj.A1C = $scope.PreAdmCardiologistDetails.LabTest.A1C;
                        //$scope.PreAdmCardioQuickSummaryObj.LabObj.Creatinine = $scope.PreAdmCardiologistDetails.LabTest.Creatinine;
                        //$scope.PreAdmCardioQuickSummaryObj.LabObj.UrineAnalysis = $scope.PreAdmCardiologistDetails.LabTest.UrineAnalysis;
                        //$scope.PreAdmCardioQuickSummaryObj.LabObj.IsBloodAvailable = $scope.PreAdmCardiologistDetails.LabTest.IsBloodAvailable;
                        //$scope.PreAdmCardioQuickSummaryObj.LabObj.IsPretransfusion = $scope.PreAdmCardiologistDetails.LabTest.IsPretransfusion;
                        //$scope.PreAdmCardioQuickSummaryObj.LabObj.RBS = $scope.PreAdmCardiologistDetails.LabTest.RBS;
                        //$scope.PreAdmCardioQuickSummaryObj.LabObj.FBS = $scope.PreAdmCardiologistDetails.LabTest.FBS;
                        //$scope.PreAdmCardioQuickSummaryObj.LabObj.PBBS = $scope.PreAdmCardiologistDetails.LabTest.PBBS;
                        //$scope.PreAdmCardioQuickSummaryObj.LabObj.PBLS = $scope.PreAdmCardiologistDetails.LabTest.PBLS;
                        //$scope.PreAdmCardioQuickSummaryObj.LabObj.Others = $scope.PreAdmCardiologistDetails.LabTest.Others;
                        //$scope.PreAdmCardioQuickSummaryObj.LabObj.Notes = $scope.PreAdmCardiologistDetails.LabTest.Notes || "";
                        //if ($scope.PreAdmCardiologistDetails.LabTest.TestArray.length > 0) {
                        //    $scope.PreAdmCardioQuickSummaryObj.LabObj.LabTestArray = $scope.PreAdmCardiologistDetails.LabTest.TestArray;
                        //}

                        //if ($scope.PreAdmCardioQuickSummaryObj.LabObj.RBS != "" || $scope.PreAdmCardioQuickSummaryObj.LabObj.FBS != "" || $scope.PreAdmCardioQuickSummaryObj.LabObj.PBBS != "" || $scope.PreAdmCardioQuickSummaryObj.LabObj.PBLS != "" || $scope.PreAdmCardioQuickSummaryObj.LabObj.PBLS != "" || $scope.PreAdmCardioQuickSummaryObj.LabObj.Others != "") {
                        //    $scope.IsCardioDiabetesEnable = "true";
                        //}
                        //else {
                        //    $scope.IsCardioDiabetesEnable = "false";
                        //}

                        //$scope.PreAdmCardiologistDetails.CardioVascular = $scope.PreAdmCardiologistDetails.CardioVascular || "";
                        //if ($scope.PreAdmCardiologistDetails.CardioVascular != "") {
                        //    $scope.PreAdmCardioQuickSummaryObj.CardioVascularObj.Systolic = $scope.PreAdmCardiologistDetails.CardioVascular.Systolic;
                        //    $scope.PreAdmCardioQuickSummaryObj.CardioVascularObj.Diastolic = $scope.PreAdmCardiologistDetails.CardioVascular.Diastolic;
                        //    $scope.PreAdmCardioQuickSummaryObj.CardioVascularObj.PR = $scope.PreAdmCardiologistDetails.CardioVascular.PR;
                        //    $scope.PreAdmCardioQuickSummaryObj.CardioVascularObj.ECG = $scope.PreAdmCardiologistDetails.CardioVascular.ECG;
                        //    $scope.PreAdmCardioQuickSummaryObj.CardioVascularObj.ECGUnits = $scope.PreAdmCardiologistDetails.CardioVascular.ECGUnits;
                        //    $scope.PreAdmCardioQuickSummaryObj.CardioVascularObj.Notes = $scope.PreAdmCardiologistDetails.CardioVascular.Notes || "";
                        //}

                        $scope.PreAdmCardiologistDetails.Airway = $scope.PreAdmCardiologistDetails.Airway || '';
                        if ($scope.PreAdmCardiologistDetails.Airway != '') {
                            $scope.PreAdmCardioQuickSummaryObj.AirwayObj.ROMTMS = $scope.PreAdmCardiologistDetails.Airway.ROMTMS || '';
                            $scope.PreAdmCardioQuickSummaryObj.AirwayObj.ROMNECKLAT = $scope.PreAdmCardiologistDetails.Airway.ROMNECKLAT ||'';
                            $scope.PreAdmCardioQuickSummaryObj.AirwayObj.ROMNECKAP = $scope.PreAdmCardiologistDetails.Airway.ROMNECKAP ||'';
                            $scope.PreAdmCardioQuickSummaryObj.AirwayObj.Notes = $scope.PreAdmCardiologistDetails.Airway.Notes || "";
                            $scope.PreAdmCardioQuickSummaryObj.AirwayObj.IsNormal = $scope.PreAdmCardiologistDetails.Airway.IsNormal || '';
                            $scope.PreAdmCardioQuickSummaryObj.AirwayObj.Class = $scope.PreAdmCardiologistDetails.Airway.Class || '';
                            $scope.PreAdmCardioQuickSummaryObj.AirwayObj.Dentition = $scope.PreAdmCardiologistDetails.Airway.Dentition ||'';
                            $scope.PreAdmCardioQuickSummaryObj.AirwayObj.DentitionList = $scope.PreAdmCardiologistDetails.Airway.DentitionList ||[];
                            $scope.PreAdmCardioQuickSummaryObj.ChemistryNotes = $scope.PreAdmCardiologistDetails.Airway.ChemistryNotes ||'';
                        }

                        $scope.PreAdmCardioQuickSummaryObj.SystemicHistory = $scope.PreAdmCardiologistDetails.SystemicHistory ||[];
                        $scope.PreAdmCardioQuickSummaryObj.LifestyleDetail = $scope.PreAdmCardiologistDetails.LifestyleDetail ||[];

                        //if ($scope.PreAdmCardiologistDetails.HealthArray.length > 0) {
                        //    $scope.PreAdmCardioQuickSummaryObj.HealthArray = angular.copy($scope.PreAdmCardiologistDetails.HealthArray);
                        //}

                        //angular.forEach($scope.PreAdmCardioQuickSummaryObj.HealthArray, function (item) {
                        //    let temparray = $filter('filter')($scope.PreAdmCardioQuickSummaryObj.HealthArray, { "Id": item.Id }, true);
                        //    temparray = temparray || [];
                        //    if (temparray.length > 0) {
                        //        item.IsChecked = temparray[0].IsChecked;
                        //    } else {
                        //        item.IsChecked = null;
                        //    }
                        //});
                        $scope.PreAdmCardioQuickSummaryObj.IsCXR = $scope.PreAdmCardiologistDetails.IsCXR || "";
                        $scope.PreAdmCardioQuickSummaryObj.CXRHistory = $scope.PreAdmCardiologistDetails.CXRHistory || "";
                        $scope.PreAdmCardioQuickSummaryObj.IsCardiacWNL = $scope.PreAdmCardiologistDetails.IsCardiacWNL;
                        $scope.PreAdmCardioQuickSummaryObj.IsCNSHistory = $scope.PreAdmCardiologistDetails.IsCNSHistory;
                        $scope.PreAdmCardioQuickSummaryObj.IsAutoImmuneDisordersWNL = $scope.PreAdmCardiologistDetails.IsAutoImmuneDisordersWNL;
                        $scope.PreAdmCardioQuickSummaryObj.IsEndocrineWNL = $scope.PreAdmCardiologistDetails.IsEndocrineWNL;
                        $scope.PreAdmCardioQuickSummaryObj.IsHemeOncWNL = $scope.PreAdmCardiologistDetails.IsHemeOncWNL;
                        $scope.PreAdmCardioQuickSummaryObj.IsHepaticWNL = $scope.PreAdmCardiologistDetails.IsHepaticWNL;
                        $scope.PreAdmCardioQuickSummaryObj.IsKidneyDiseaseWNL = $scope.PreAdmCardiologistDetails.IsKidneyDiseaseWNL;
                        $scope.PreAdmCardioQuickSummaryObj.IsMusculoSkeletalSystemWNL = $scope.PreAdmCardiologistDetails.IsMusculoSkeletalSystemWNL;
                        $scope.PreAdmCardioQuickSummaryObj.IsNervousSystemWNL = $scope.PreAdmCardiologistDetails.IsNervousSystemWNL;
                        $scope.PreAdmCardioQuickSummaryObj.IsNeurologicWNL = $scope.PreAdmCardiologistDetails.IsNeurologicWNL;
                        $scope.PreAdmCardioQuickSummaryObj.IsOthersWNL = $scope.PreAdmCardiologistDetails.IsOthersWNL;
                        $scope.PreAdmCardioQuickSummaryObj.IsPsychosisWNL = $scope.PreAdmCardiologistDetails.IsPsychosisWNL;
                        $scope.PreAdmCardioQuickSummaryObj.IsPulmonaryWNL = $scope.PreAdmCardiologistDetails.IsPulmonaryWNL;
                        $scope.PreAdmCardioQuickSummaryObj.IsRespiratoryNormal = $scope.PreAdmCardiologistDetails.IsRespiratoryNormal;

                        $scope.PreAdmCardioQuickSummaryObj.SocialNotes = $scope.PreAdmCardiologistDetails.SocialNotes || "";
                        $scope.PreAdmCardioQuickSummaryObj.RespiratoryNotes = $scope.PreAdmCardiologistDetails.RespiratoryNotes || "";
                        $scope.PreAdmCardioQuickSummaryObj.PulmonaryNotes = $scope.PreAdmCardiologistDetails.PulmonaryNotes || "";
                        $scope.PreAdmCardioQuickSummaryObj.PsychosisNotes = $scope.PreAdmCardiologistDetails.PsychosisNotes || "";
                        $scope.PreAdmCardioQuickSummaryObj.OthersNotes = $scope.PreAdmCardiologistDetails.OthersNotes || "";
                        $scope.PreAdmCardioQuickSummaryObj.NeurologicNotes = $scope.PreAdmCardiologistDetails.NeurologicNotes || "";
                        $scope.PreAdmCardioQuickSummaryObj.NervousSystemNotes = $scope.PreAdmCardiologistDetails.NervousSystemNotes || "";
                        $scope.PreAdmCardioQuickSummaryObj.MusculoSkeletalSystemNotes = $scope.PreAdmCardiologistDetails.MusculoSkeletalSystemNotes || "";
                        $scope.PreAdmCardioQuickSummaryObj.KidneyDiseaseNotes = $scope.PreAdmCardiologistDetails.KidneyDiseaseNotes || "";
                        $scope.PreAdmCardioQuickSummaryObj.HepaticNotes = $scope.PreAdmCardiologistDetails.HepaticNotes || "";
                        $scope.PreAdmCardioQuickSummaryObj.HemeOncNotes = $scope.PreAdmCardiologistDetails.HemeOncNotes || "";
                        $scope.PreAdmCardioQuickSummaryObj.EndocrineNotes = $scope.PreAdmCardiologistDetails.EndocrineNotes || "";
                        $scope.PreAdmCardioQuickSummaryObj.CardiacNotes = $scope.PreAdmCardiologistDetails.CardiacNotes || "";
                        $scope.PreAdmCardioQuickSummaryObj.CNSNotes = $scope.PreAdmCardiologistDetails.CNSNotes || "";
                        $scope.PreAdmCardioQuickSummaryObj.AutoImmuneDisordersNotes = $scope.PreAdmCardiologistDetails.AutoImmuneDisordersNotes || "";

                        $scope.PreAdmCardioQuickSummaryObj.IsHeentWNL = $scope.PreAdmCardiologistDetails.IsHeentWNL;
                        $scope.PreAdmCardioQuickSummaryObj.IsLungsWNL = $scope.PreAdmCardiologistDetails.IsLungsWNL;
                        $scope.PreAdmCardioQuickSummaryObj.HeentNotes = $scope.PreAdmCardiologistDetails.HeentNotes || "";
                        $scope.PreAdmCardioQuickSummaryObj.LungsNotes = $scope.PreAdmCardiologistDetails.LungsNotes || "";

                        $scope.PreAdmCardioQuickSummaryObj.CurrentMedicationList = angular.copy($scope.PreAdmCardiologistDetails.CurrentMedicationList);
                        $scope.PreAdmCardioQuickSummaryObj.MedicationsList = angular.copy($scope.PreAdmCardiologistDetails.MedicationsList);

                        //$scope.PreAdmCardioQuickSummaryObj.ReviewedBy = $scope.PreAdmCardiologistDetails.ReviwedBy;
                        //$scope.CardiologistPreAdmissionDetails.ReviewByName = "";
                        //var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmCardioQuickSummaryObj.ReviewedBy }, true)[0] || [];
                        //$scope.CardiologistPreAdmissionDetails.ReviewByName = ReviewName.FullName || '';

                        //if ($scope.PreAdmCardiologistDetails.HealthArray.length > 0) {
                        //    $scope.GetCardioHealthAdvancedData($scope.PreAdmCardiologistDetails.HealthArray);
                        //}


                        //if ($scope.PreAdmCardioQuickSummaryObj.APAnesthesiaOptionsObj.AnesthetistId != '') {
                        //    let Anesthetistlist = $filter("filter")($scope.AnesthetistArray, function (kitem) { return kitem.DoctorID == $scope.PreAdmCardioQuickSummaryObj.APAnesthesiaOptionsObj.AnesthetistId });

                        //    Anesthetistlist = Anesthetistlist || [];
                        //    if (Anesthetistlist.length > 0) {
                        //        $scope.PreAdmCardioQuickSummaryObj.APAnesthesiaOptionsObj.AnesthetistName = Anesthetistlist[0].FullName;
                        //    }
                        //}
                    }

                    if ($scope.PreAdmCardiologistDetails.DocumentDetails.length > 0) {
                        $scope.PreAdmCardioQuickSummaryObj.DocumentDetails = angular.copy($scope.PreAdmCardiologistDetails.DocumentDetails);
                    }
                    else {
                        $scope.PreAdmCardioQuickSummaryObj.DocumentDetails = [];
                    }

                    resp[0].data.CardiologistDetails[0].CardiologistDiagnosis = resp[0].data.CardiologistDetails[0].CardiologistDiagnosis || [];
                    if (resp[0].data.CardiologistDetails[0].CardiologistDiagnosis.length > 0) {
                        $scope.PreAdmCardioQuickSummaryObj.CardiologistDiagnosis = angular.copy(resp[0].data.CardiologistDetails[0].CardiologistDiagnosis);
                    }

                    //$scope.PreAdmCardioQuickSummaryObj.PreAdminCardRespiratoryInd = false;
                    //if ($scope.PreAdmCardioQuickSummaryObj.HealthArray.length > 0) {
                    //    var CardResporotaryInfo = $filter('filter')($scope.PreAdmCardioQuickSummaryObj.HealthArray, function (item) {
                    //        return (item.CategoryId == 13 && item.IsChecked !== null);
                    //    });
                    //    if (CardResporotaryInfo.length > 0 || $scope.PreAdmCardioQuickSummaryObj.CXRHistory == 'No' || $scope.PreAdmCardioQuickSummaryObj.CXRHistory == 'Yes' || $scope.PreAdmCardioQuickSummaryObj.IsCXR == 'Yes' || $scope.PreAdmCardioQuickSummaryObj.IsCXR == 'No' || $scope.PreAdmCardioQuickSummaryObj.RespiratoryNotes != '') {
                    //        $scope.PreAdmCardioQuickSummaryObj.PreAdminCardRespiratoryInd = true;
                    //    }
                    //    else {
                    //        $scope.PreAdmCardioQuickSummaryObj.PreAdminCardRespiratoryInd = false;
                    //    }
                    //}

                    //$scope.PreAdmCardiologistDetails.OtherSystemArray = $scope.PreAdmCardiologistDetails.OtherSystemArray || [];
                    //if ($scope.PreAdmCardiologistDetails.OtherSystemArray.length > 0) {
                    //    $scope.PreAdmCardioQuickSummaryObj.OtherSystemArray = angular.copy($scope.PreAdmCardiologistDetails.OtherSystemArray);
                    //}
                    //else {
                    //    $scope.PreAdmCardioQuickSummaryObj.OtherSystemArray = [];
                    //}

                } else {
                    $scope.CardiologistPreAdmCardiologistDetails = [];
                    $scope.PreAdmCardioQuickSummaryObj = angular.copy($scope.GetPreAdmCardioQuickSummaryObj());
                    $scope.PreAdmCardioQuickSummaryObj.LabObj = angular.copy($scope.GetLabObj());
                    $scope.PreAdmCardioQuickSummaryObj.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());

                    // ROS

                    //if (resp[0].data.CurrentSystemicMedicationList.length > 0) {
                    //    $scope.PreAdmCardioQuickSummaryObj.CurrentSystemicMedicationsHistory = angular.copy(resp[0].data.CurrentSystemicMedicationList);
                    //}

                    //if (resp[0].data.CurrentEyeMedicationList.length > 0) {
                    //    $scope.PreAdmCardioQuickSummaryObj.CurrentEyeMedications = angular.copy(resp[0].data.CurrentEyeMedicationList);
                    //}

                    //if (resp[0].data.AllergyItems.length > 0) {
                    //    $scope.PreAdmCardioQuickSummaryObj.AllergyItems = angular.copy(resp[0].data.AllergyItems);
                    //}
                    //if (resp[0].data.SystemicHistory.length > 0) {
                    //    $scope.PreAdmCardioQuickSummaryObj.SystemicHistory = angular.copy(resp[0].data.SystemicHistory);
                    //}
                    //if (resp[0].data.SurgicalHistory.length > 0) {
                    //    $scope.PreAdmCardioQuickSummaryObj.SurgicalHistory = angular.copy(resp[0].data.SurgicalHistory);
                    //}
                }
            }
        });
    };

    $scope.GetASCAdmissionDetails = function () {

        let appointmentId = null;
        if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
            appointmentId = $scope.cacheStorageItem.AppointmentId;
        }

        if ($scope.cacheStorageItem.AppointmentTypeId == 7 || $scope.cacheStorageItem.AppointmentTypeId == 6) {
            appointmentId = $scope.cacheStorageItem.AscAppointmentId;
        }

        let req1 = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "CheckListModuleId": 1
        };

        let req = {
            "AppointmentId": appointmentId || 0,
        };

        let req3 = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": appointmentId || 0,
            "PatientId": $scope.cacheStorageItem.PatientID || 0,
            "AppointmentTypeId": 4, /* $scope.cacheStorageItem.AppointmentTypeId*/
        };

        $q.all([
            eHnoteSurgeryService.GetOrganizationASCCheckListData(req1),
            eHnoteSurgeryService.GetASCAdmissionDetails(req),
            eHnoteSurgeryService.GetOTQuickAccessDetails(req3)
        ]).then(function (resp) {
            let OrgASCChecklists = angular.copy(resp[0].data.rows);
            if (resp[0].data.status === "Success") {
                $scope.AdmissionCheckinObj.OrgASCChecklist = angular.copy(resp[0].data.rows);
                angular.forEach($scope.AdmissionCheckinObj.OrgASCChecklist, function (item) {
                    angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                        kitem.IsChecked = false;
                    });
                    item.ChecklistDate = null;
                    item.Remarks = "";
                });
            }

            if (resp[1].data.status === "Success") {

                let respObj = angular.copy(resp[1].data.rows[0]);

                if (resp[1].data.ClinicalCheckLists.length > 0) {
                    angular.forEach(resp[1].data.ClinicalCheckLists, function (item) {
                        angular.forEach($scope.AdmissionCheckinObj.OrgASCChecklist, function (kitem) {
                            if (item.CheckListCategoryId === 1 && item.CheckListId === kitem.CheckListId) {
                                angular.forEach(kitem.OrganizationCheckListDetails, function (hitem) {
                                    if (item.CheckListId == hitem.CheckListId && item.Value == hitem.Value) {
                                        hitem.IsChecked = true;
                                    }
                                });
                                kitem.Remarks = item.Remarks || "";
                                kitem.ChecklistDate = item.ChecklistDate || "";
                            }
                        });
                    });
                }

                if (resp[1].data.InvestigationsList.length > 0) {
                    $scope.AdmissionCheckinObj.InvestigationsList = angular.copy(resp[1].data.InvestigationsList);
                }

                if (resp[1].data.Prescription.length > 0) {
                    $scope.AdmissionCheckinObj.Prescriptions = angular.copy(resp[1].data.Prescription);
                }

                if (resp[1].data.rows.length > 0) {

                    $scope.AdmissionCheckinObj.PatientAscCheckInId = respObj.PatientAscCheckInId || null;
                    if (respObj.CheckLists.length > 0) {
                        $scope.AdmissionObj.OrgASCChecklist = angular.copy(OrgASCChecklists);

                        angular.forEach(respObj.CheckLists, function (item) {
                            angular.forEach($scope.AdmissionObj.OrgASCChecklist, function (kitem) {
                                if (item.CheckListCategoryId === kitem.CheckListCategoryId && item.CheckListId === kitem.CheckListId) {
                                    angular.forEach(kitem.OrganizationCheckListDetails, function (hitem) {
                                        if (item.CheckListId == hitem.CheckListId) {
                                            hitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                                            if (item.Value == hitem.Value) {
                                                hitem.IsChecked = true;
                                                kitem.IsChecked = true;
                                                kitem.Value = item.Value || '';
                                            } else {
                                                hitem.IsChecked = false;
                                            }
                                        }
                                    });
                                    kitem.Remarks = item.Remarks || "";
                                    kitem.ChecklistDate = $filter("date")(item.ChecklistDate, "MM-dd-yyyy") || "";
                                    
                                    if (kitem.Remarks != "") {
                                        kitem.shownotes = true;
                                        kitem.IsChecked = true;
                                    }
                                    if (kitem.ChecklistDate != "") {
                                        kitem.IsChecked = true;
                                    }
                                }
                            });
                        });

                        $scope.AdmissionCheckinObj.OrgASCChecklist = angular.copy(respObj.CheckLists);
                    } else {
                        $scope.AdmissionCheckinObj.OrgASCChecklist = [];
                    }

                    $scope.AdmissionCheckinObj.PreOPAdmitFiles = respObj.PreOPAdmitFiles || [];
                    $scope.AdmissionCheckinObj.ReasonForVisit = respObj.ReasonForVisit || "";
                    $scope.AdmissionCheckinObj.RecievedForSurgery = angular.copy(respObj.RecievedForSurgery);
                    $scope.AdmissionCheckinObj.RecievedForSurgeryNotes = angular.copy(respObj.RecievedForSurgeryNotes);
                    $scope.AdmissionCheckinObj.AccompainedBy = angular.copy(respObj.AccompainedBy);
                    $scope.AdmissionCheckinObj.AccompainedByNotes = angular.copy(respObj.AccompainedByNotes);
                    $scope.AdmissionCheckinObj.PainStatus = angular.copy(respObj.PainStatus);
                    $scope.AdmissionCheckinObj.Painlevel = angular.copy(respObj.Painlevel);
                    $scope.AdmissionCheckinObj.PainlevelNotes = angular.copy(respObj.PainlevelNotes);
                    $scope.AdmissionCheckinObj.PTERefers = angular.copy(respObj.PTERefers);
                    $scope.AdmissionCheckinObj.PTEReferNotes = angular.copy(respObj.PTEReferNotes);
                    $scope.AdmissionCheckinObj.ObservedBehaviour = angular.copy(respObj.ObservedBehavior);
                    $scope.AdmissionCheckinObj.ObservedBehaviourNotes = angular.copy(respObj.ObservedBehaviorNotes);
                    $scope.AdmissionCheckinObj.LevelOfConsciousness = angular.copy(respObj.LevelOfConsciousness);
                    $scope.AdmissionCheckinObj.LevelOfConsciousnessNotes = angular.copy(respObj.LevelOfConsciousnessNotes);
                    $scope.AdmissionCheckinObj.PatientDestination = angular.copy(respObj.PatientDestination);
                    $scope.AdmissionCheckinObj.PatientDestinationNotes = angular.copy(respObj.PatientDestinationNotes);
                    $scope.AdmissionCheckinObj.PatientTransfferedIn = angular.copy(respObj.PatientTransfferedIn);
                    $scope.AdmissionCheckinObj.PatientTransfferedNotes = angular.copy(respObj.PatientTransfferedNotes);
                    $scope.AdmissionCheckinObj.PreOperativeOrientationOffered = angular.copy(respObj.PreOperativeOrientationOffered);
                    $scope.AdmissionCheckinObj.PreOperativeOrientationOfferedNotes = angular.copy(respObj.PreOperativeOrientationOfferedNotes);                

                    $scope.AdmissionCheckinObj.PhoneNumber = angular.copy(respObj.MobileNo);
                    $scope.AdmissionCheckinObj.PhoneNumberCountryCode = angular.copy(respObj.CountryCode);
                    $scope.AdmissionCheckinObj.AlternatePhoneNumber = angular.copy(respObj.AlternateMobileNo);
                    $scope.AdmissionCheckinObj.AlternatePhoneNumberCountryCode = angular.copy(respObj.AlternateCountryCode);
                    $scope.AdmissionCheckinObj.AdmissionRemarks = respObj.AdmissionRemarks;

                    $scope.AdmissionCheckinObj.ClinicalVisitTypeName = respObj.ClinicalVisitType || "";

                    var ReviewedBylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == respObj.ReviewedBy }, true) || [];
                    if (ReviewedBylist.length > 0) {
                        $scope.AdmissionCheckinObj.ReviewedByName = angular.copy(ReviewedBylist[0].FullName);
                        $scope.AdmissionCheckinObj.ReviewedByLicenseNo = angular.copy(ReviewedBylist[0].LicenseNumber);
                        ReviewedBylist[0].SuffixName = ReviewedBylist[0].SuffixName || '';
                        $scope.AdmissionCheckinObj.ReviewedBySuffix = angular.copy(ReviewedBylist[0].SuffixName + ',');
                        if (ReviewedBylist[0].SuffixId == 10) {
                            $scope.AdmissionCheckinObj.ReviewedByName = ' Dr. ' + $scope.AdmissionCheckinObj.ReviewedByName;
                        }
                    } else {
                        $scope.AdmissionCheckinObj.ReviewedByName = $scope.AdmissionCheckinObj.ReviewedByName || '';
                        $scope.AdmissionCheckinObj.ReviewedByLicenseNo = '';
                        $scope.AdmissionCheckinObj.ReviewedBySuffix = '';
                    }

                    $scope.AdmissionCheckinObj.AdmittedBy = respObj.AdmittedBy || null;
                    if ($scope.AdmissionCheckinObj.AdmittedBy != null) {
                        $scope.AdmissionCheckinObj.AdmissionTime = respObj.AdmissionTime || "";
                        let ndate = moment().format("YYYY-MM-DD");
                        let edate = ndate + " " + $scope.AdmissionCheckinObj.AdmissionTime;
                        $scope.AdmissionCheckinObj.AdmissionTime = moment(edate, "YYYY-MM-DD hh:mm").format("hh:mm a");


                        var AdmittedBylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == respObj.AdmittedBy }, true) || [];
                        if (AdmittedBylist.length > 0) {
                            $scope.AdmissionCheckinObj.AdmittedByName = angular.copy(AdmittedBylist[0].FullName);
                            $scope.AdmissionCheckinObj.AdmittedByLicenseNo = angular.copy(AdmittedBylist[0].LicenseNumber);
                            AdmittedBylist[0].SuffixName = AdmittedBylist[0].SuffixName || '';
                            $scope.AdmissionCheckinObj.AdmittedBySuffix = angular.copy(AdmittedBylist[0].SuffixName + ',');
                            if (AdmittedBylist[0].SuffixId == 10) {
                                $scope.AdmissionCheckinObj.AdmittedByName = ' Dr. ' + $scope.AdmissionCheckinObj.AdmittedByName;
                            }
                        } else {
                            $scope.AdmissionCheckinObj.AdmittedByName = '';
                            $scope.AdmissionCheckinObj.AdmittedByLicenseNo = '';
                            $scope.AdmissionCheckinObj.AdmittedBySuffix = '';
                            $scope.AdmissionCheckinObj.AdmissionPrefix = '';
                        }

                        $scope.AdmissionCheckinObj.ChunkedClinicalChecklist = [];
                        let tempArray = $filter('filter')($scope.AdmissionObj.OrgASCChecklist, { 'CheckListCategoryId': 1 }, true) || [];
                        let filteredClinicalChecklist = angular.copy(tempArray);
                        if (filteredClinicalChecklist.length > 0) {
                            let chunkSize = Math.ceil((filteredClinicalChecklist.length) / 2);
                            for (let i = 0; i < filteredClinicalChecklist.length; i += chunkSize) {
                                $scope.AdmissionCheckinObj.ChunkedClinicalChecklist.push(filteredClinicalChecklist.slice(i, i + chunkSize));
                            }
                        }
                    }
                }
            }

            if (resp[2].data.status === "Success") {
                angular.forEach(resp[2].data.Vitals, function (item) {
                    let ndate = moment().format("YYYY-MM-DD");
                    let edate = ndate + " " + item.VitalAddTime;
                    item.VitalAddTime = moment(edate, "YYYY-MM-DD HH:mm").format("hh:mm A");
                });
                $scope.AdmissionCheckinObj.VitalsArray = angular.copy(resp[2].data.Vitals) || [];
                if ($scope.AdmissionCheckinObj.VitalsArray.length > 0) {
                    $scope.AdmissionCheckinObj.VitalsDisplay = $scope.GetDisplayVitalsArray();
                    angular.forEach($scope.AdmissionCheckinObj.VitalsArray, function (mainitem, $index) {
                        let TempFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 11 }, true) || [];
                        if (TempFilter.length > 0) {
                            var tempobj = {
                                "value": TempFilter[0].Value,
                                "UnitTypeName": TempFilter[0].UnitTypeName
                            }
                        }
                        $scope.AdmissionCheckinObj.VitalsDisplay[0].Values.push(tempobj);
                        let pulseFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 12 }, true) || [];
                        if (pulseFilter.length > 0) {
                            var pulseobj = {
                                "value": pulseFilter[0].Value,
                                "UnitTypeName": pulseFilter[0].UnitTypeName
                            }
                        }
                        $scope.AdmissionCheckinObj.VitalsDisplay[1].Values.push(pulseobj);
                        let BpUpFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 4 }, true) || [];
                        let BpLowFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 5 }, true) || [];
                        if (BpUpFilter.length > 0 || BpLowFilter.length > 0) {
                            if (BpUpFilter[0].Value != '' || BpLowFilter[0].Value != '') {
                                var Bpobj = {
                                    "value": BpUpFilter[0].Value + '/' + BpLowFilter[0].Value,
                                    "UnitTypeName": BpUpFilter[0].UnitTypeName
                                }
                            } else {
                                var Bpobj = {
                                    "value": "",
                                    "UnitTypeName": BpUpFilter[0].UnitTypeName
                                }
                            }
                        }
                        $scope.AdmissionCheckinObj.VitalsDisplay[2].Values.push(Bpobj);
                        let RespFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 14 }, true) || [];
                        if (RespFilter.length > 0) {
                            var Respobj = {
                                "value": RespFilter[0].Value,
                                "UnitTypeName": RespFilter[0].UnitTypeName
                            }
                        }
                        $scope.AdmissionCheckinObj.VitalsDisplay[3].Values.push(Respobj);
                        let Spo2Filter = $filter('filter')(mainitem.Vitals, { "VitalId": 15 }, true) || [];
                        if (Spo2Filter.length > 0) {
                            var Spo2obj = {
                                "value": Spo2Filter[0].Value,
                                "UnitTypeName": Spo2Filter[0].UnitTypeName
                            }
                        }
                        $scope.AdmissionCheckinObj.VitalsDisplay[4].Values.push(Spo2obj);
                        let BGLFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 8 }, true) || [];
                        if (BGLFilter.length > 0) {
                            var BGLobj = {
                                "value": BGLFilter[0].Value,
                                "UnitTypeName": BGLFilter[0].UnitTypeName
                            }
                        }
                        $scope.AdmissionCheckinObj.VitalsDisplay[5].Values.push(BGLobj);
                        var Time = {
                            "value": $scope.AdmissionCheckinObj.VitalsArray[$index].VitalAddTime || "",
                            "UnitTypeName": "",
                        }
                        $scope.AdmissionCheckinObj.VitalsDisplay[6].Values.push(Time);
                        var performedBy = {
                            "value": $scope.AdmissionCheckinObj.VitalsArray[$index].UserName || "",
                            "UnitTypeName": "",
                        }
                        $scope.AdmissionCheckinObj.VitalsDisplay[7].Values.push(performedBy);
                        var Notes = {
                            "value": $scope.AdmissionCheckinObj.VitalsArray[$index].VitalRemarks || "",
                            "UnitTypeName": "",
                        }
                        $scope.AdmissionCheckinObj.VitalsDisplay[8].Values.push(Notes);

                    });
                }
            }
        });
    };


    $scope.onClickSummaryTab = function (value) {
        value = value || 0;
        if (value == 1) {
            $scope.MasterReferralSource();
            $scope.SelectPatient();
            $scope.getApptAdditionalDetails();
            $scope.GetASCAppointmentDetailsById();
            $scope.SelectAppointment();
            $scope.SubTab = 1;
        } else if (value == 2) {

            if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
                if ($scope.cacheStorageItem.PreAdmAppointmentId == null) {
                    alertify.error("This Patient has no Pre-admission appointment !");
                    return false;
                }
            }

            $scope.GetPreAdmissionDetails();
            $scope.SubTab = 2;
        } else if (value == 3) {

            if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.AscAppointmentId == null) {
                    alertify.error("This Patient has no ASC appointment !");
                    return false;
                }
            }

            $scope.GetMasterAldreteScoreDetails();
            $scope.GetPreOpChartData();
            $scope.GetPreAdmissionDetails();
            $scope.SubTab = 3;
        } else if (value == 4) {

            if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.AscAppointmentId == null) {
                    alertify.error("This Patient has no ASC appointment !");
                    return false;
                }
            }

            $scope.GetASCIntraOpDetails();
            $scope.SubTab = 4;
        } else if (value == 5) {

            if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.AscAppointmentId == null) {
                    alertify.error("This Patient has no ASC appointment !");
                    return false;
                }
            }

            $scope.GetPostOpChartData();
            $scope.SubTab = 5;
        } else if (value == 6) {
            if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.AscAppointmentId == null) {
                    alertify.error("This Patient has no ASC appointment !");
                    return false;
                }
            }
            $scope.GetDischargeData();
            $scope.SubTab = 6;
        } else if (value == 7) {

            if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.AscAppointmentId == null) {
                    alertify.error("This Patient has no ASC appointment !");
                    return false;
                }
            }

            $scope.GetOperativeNotesDetails();
            $scope.SubTab = 7;
        } else if (value == 8) {

            if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.AscAppointmentId == null) {
                    alertify.error("This Patient has no ASC appointment !");
                    return false;
                }
            }

            $scope.GetASCAdmissionDetails();
            $scope.SubTab = 8;
        } else if (value == 9) {
            if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
                if ($scope.cacheStorageItem.PreAdmAppointmentId == null) {
                    alertify.error("This Patient has no Pre-admission appointment !");
                    return false;
                }
            }
            $scope.GetPreAdmissionCardiologistDetails();
            $scope.SubTab = 9;
        } else if (value == 10) {
            if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
                if ($scope.cacheStorageItem.PreAdmAppointmentId == null) {
                    alertify.error("This Patient has Pre-admission appointment !");
                    return false;
                }
            }
            $scope.ChangeChecklistTab();
            $scope.SubTab = 10;
        } else if (value == 11) {
            $scope.GetFaceSheetDetails();
            $scope.GetPentacomImageDetails();
            $scope.SubTab = 11;
        } else {
            $scope.SubTab = value;
        }
    };

    if ($scope.SubTabId == 1) {
        $scope.MasterReferralSource();
        $scope.SelectPatient();
        $scope.getApptAdditionalDetails();
        $scope.SelectAppointment();
        $scope.SubTab = 1;
    } else {
        $scope.SubTab = $scope.SubTabId;
    }


    $scope.GetASCAppointmentDetailsById = function () {
        let PatientSurgeryId = null;
        if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
            if ($scope.cacheStorageItem.PreAdmSurgeryList.length > 0) {
                PatientSurgeryId = $scope.cacheStorageItem.PreAdmSurgeryList[0].PatientSurgeryId;
            }
        } else if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
            if ($scope.cacheStorageItem.SurgeryList.length > 0) {
                PatientSurgeryId = $scope.cacheStorageItem.SurgeryList[0].PatientSurgeryId;
            }
        }

        var params = {
            "AppointmentId": $scope.cacheStorageItem.AppointmentId|| null,
            "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId,
            "PatientSurgeryId": PatientSurgeryId || null
        };
        eHnotePatientDataService.GetASCAppointmentDetailsById(params).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.PatientInsuranceSummary = [];

                
                if (resp.data.rows[0].AppointmentInsuranceList.length > 0) {
                    angular.forEach(resp.data.rows[0].AppointmentInsuranceList, function (initem) {
                        var objectinsurance = {
                            "CoverageId": initem.CoverageId,
                            "CoverageName": "",
                            "CoverageObj": "",
                            "PatientInsuranceDetailId": initem.PatientInsuranceDetailId,
                            "PlanId": initem.PlanId || 0,
                            "PlanName": initem.PlanName || "",
                            "PlanObj": "",
                            "Payor": "",
                            "PayorName": initem.PayorName || "",
                            "PayorId": initem.PayorId || 0,
                            "OrganizationPayorId": initem.OrganizationPayorId,
                            "OrganizationPayorName": initem.OrganizationPayorName,
                            "PayorObj": "",
                            "PlanTypeId": initem.PlanTypeId || 0,
                            "PlanDescription": initem.PlanDescriptionl || "", // initem.PlanTypeName || "",
                            "PolicyId": initem.PolicyId,
                            "GroupId": initem.GroupId || "",
                            "GroupName": initem.GroupName || "",
                            "RelationShipId": initem.RelationShipId || "",
                            "InsuranceRelationShipObj": "",
                            "PolicyHolder": initem.PolicyHolder || "",
                            "PolicyHolderName": initem.PolicyHolderName || "",
                            "Employer": "",
                            "Coinsurance": initem.Coinsurance || "",
                            "VisitCopay": initem.VisitCopay || "",
                            "EffectiveDate": "",
                            "ExpiryDate": "",
                            "ScanDate": "",
                            "VerifiedDate": "",
                            "DeleteInd": false,
                            "IsConnectToFutureAppointment": initem.IsConnectToFutureAppointment || false,
                            "AcceptAssign": initem.AcceptAssign || "",
                            "AssignBenifits": initem.AssignBenifits || "",
                            "ReleaseInfo": initem.ReleaseInfo || "",
                            "LaboratoryId": initem.LaboratoryId || 0,
                            "StatusId": initem.StatusId || 0,
                            "Comments": initem.Comments || "",
                            "MSPTrailerTypeId": initem.MSPTrailerTypeId || 0,
                            "Staff": initem.Staff || "",
                            "PatientDocumentDetails": angular.copy(initem.PatientDocumentDetails) || "",
                            "MsnTyp": "",
                            "IsAcceptAssign": 0,
                            "IsAcceptAssignBenifits": 0,
                            "IsReleaseInfo": 0,
                            "PatientBillingTypeId": 0,
                            "TempInsuranceImagesArray": [],
                            "InsuredPersonFirstName": initem.InsuredPersonFirstName || "",
                            "InsuredPersonGenderID": initem.InsuredPersonGenderID || "",
                            "InsuredPersonDOB": initem.InsuredPersonDOB || "",
                            "InsuredPersonSSN": initem.InsuredPersonSSN || "",
                            "RelationName": initem.RelationName || "",
                            "IdentifierId": initem.IdentifierId,
                            "IsDefaultBillingIns": initem.IsDefaultBillingIns || "",
                            "PCP": initem.PCP || "",
                            "IPA": initem.IPA || "",
                            "AppointmentInsuranceDetailId": initem.AppointmentInsuranceDetailId || 0,
                            "IsVerified": initem.IsVerified || false,
                            "PatientId": initem.PatientId,
                            "InsuredPersonMiddleName": initem.InsuredPersonMiddleName,
                            "InsuredPersonLastName": initem.InsuredPersonLastName,
                            "PatientFirstName": initem.PatientFirstName || "",
                            "PatientLastName": initem.PatientLastName || "",
                            "PatientDOB": initem.PatientDOB || "",
                            "PatientSSN": initem.PatientSSN || "",
                            "EligibilityStatusId": initem.EligibilityStatusId || 0,
                            "IsIdentifier": false,
                            "VerificationDate": initem.VerificationDate || null
                        }
                        objectinsurance.CoverageName = "";
                        var filter1 = $filter("filter")($scope.InsuranceCoverageList, { "CoverageId": initem.CoverageId }, true) || [];
                        if (filter1.length > 0) {
                            objectinsurance.CoverageName = filter1[0].CoverageName || "";
                        }

                        objectinsurance.Status = "";
                        var filter1 = $filter("filter")($scope.InsuranceStatusList, { "DropdownId": initem.StatusId }, true) || [];
                        if (filter1.length > 0) {
                            objectinsurance.Status = filter1[0].Value || "";
                        }

                        var filterStatus = [];
                        filterStatus = $filter("filter")($scope.RelationShipTypeList, { "RelationId": objectinsurance.RelationShipId }, true) || [];
                        if (filterStatus.length > 0) {
                            objectinsurance.InsuranceRelationShipObj = filterStatus[0];
                        }

                        if (initem.EffectiveDate != "" && initem.EffectiveDate != null) {
                            var date = initem.EffectiveDate;
                            var data1 = date.split("-").reverse().join("-");
                            objectinsurance.EffectiveDate = $filter("date")(data1, "MM-dd-yyyy") || "";
                        }
                        if (initem.ExpiryDate != "" && initem.ExpiryDate != null) {

                            var date = initem.ExpiryDate;
                            var data2 = date.split("-").reverse().join("-");
                            objectinsurance.ExpiryDate = $filter("date")(data2, "MM-dd-yyyy") || "";
                        }
                        if (initem.ScanDate != "" && initem.ScanDate != null) {
                            objectinsurance.ScanDate = $filter("date")(initem.ScanDate, "MM-dd-yyyy") || "";
                        }
                        if (initem.VerifiedDate != "" && initem.VerifiedDate != null) {
                            objectinsurance.VerifiedDate = $filter("date")(initem.VerifiedDate, "MM-dd-yyyy") || "";
                        }
                        if (initem.InsuredPersonDOB != "" && initem.InsuredPersonDOB != null) {
                            objectinsurance.InsuredPersonDOB = $filter("date")(initem.InsuredPersonDOB, "MM-dd-yyyy") || "";
                        }

                        if (initem.VerificationDate != "" && initem.VerificationDate != null) {
                            objectinsurance.VerificationDate = $filter("date")(initem.VerificationDate, "MM-dd-yyyy HH:mm:ss");
                        }

                        var vitalslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.UserId });
                        if (vitalslist.length > 0) {
                            objectinsurance.UserVerifiedName = angular.copy(vitalslist[0].FullName);
                        }

                        $scope.PatientInsuranceSummary.push(objectinsurance);
                    });
                }
            }

        }, function (err) {

        });


    };
    $scope.GetASCAppointmentDetailsById();


   

    $scope.FaceSheetAppointmentId = $scope.cacheStorageItem.AppointmentId;
    $scope.FaceSheetAppointmentTypeId = $scope.cacheStorageItem.AppointmentTypeId;

    if ($scope.cacheStorageItem.AppointmentType == "Pre-Op") {
        $scope.FaceSheetAppointmentId = $scope.cacheStorageItem.AscAppointmentId;
        $scope.FaceSheetAppointmentTypeId = 4;
    }

    $scope.GetFaceSheetDetails = function () {
        $scope.FaceSheetSummaryObj = $scope.GetFaceSheetSummaryObj;       
        let req = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": $scope.FaceSheetAppointmentId || 0,
            "PatientId": $scope.cacheStorageItem.PatientID || 0,
            "AppointmentTypeId": $scope.FaceSheetAppointmentTypeId,
        };
        eHnoteSurgeryService.GetAppointmentFaceSheetData(req).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.FaceSheetSummaryObj.PatientData = resp.data.PatientData || [];
                if ($scope.FaceSheetSummaryObj.PatientData.length > 0) {
                    var mobilenumber = $scope.FaceSheetSummaryObj.PatientData[0].MobileNo || ''
                    if (mobilenumber != '') {
                        var obj = eHnoteUserDataService.UsMobileFormatChange(mobilenumber);
                        $scope.FaceSheetSummaryObj.PatientData[0].MobileNo = obj.UsFormatMobileNumber;
                    }
                    var PatientMonth = ''
                    if ($scope.FaceSheetSummaryObj.PatientData[0].AgeInMonths != 0) {
                        var PatientMonth = $scope.FaceSheetSummaryObj.PatientData[0].AgeInMonths + 'M';
                    }
                    $scope.FaceSheetSummaryObj.PatientData[0].Age = $scope.FaceSheetSummaryObj.PatientData[0].Age + 'Y' + ' ' + PatientMonth || '';
                }
                if (resp.data.SurgeryList.length > 0) {
                    $scope.FaceSheetSummaryObj.SurgeryList = resp.data.SurgeryList || [];
                    $scope.SelectedOrganId = resp.data.SurgeryList.OrganId || null;
                    $scope.SurgeryDate = resp.data.SurgeryList[0].AscAppointmentDate || null;
                    if ($scope.FaceSheetSummaryObj.SurgeryList.length > 0) {
                        $scope.FaceSheetSummaryObj.SurgeryList[0].CardiologyStatus = $scope.FaceSheetSummaryObj.SurgeryList[0].CardiologyStatus || ''
                        $scope.FaceSheetSummaryObj.SurgeryList[0].PreAdmissionStatus = $scope.FaceSheetSummaryObj.SurgeryList[0].PreAdmissionStatus || ''
                        if ($scope.FaceSheetSummaryObj.SurgeryList[0].CardiologyStatus != '') {
                            $scope.FaceSheetSummaryObj.CardiologyStatus = $scope.FaceSheetSummaryObj.SurgeryList[0].CardiologyStatus || '';
                        }
                        if ($scope.FaceSheetSummaryObj.SurgeryList[0].PreAdmissionStatus != '') {
                            $scope.FaceSheetSummaryObj.PreAdmissionStatus = $scope.FaceSheetSummaryObj.SurgeryList[0].PreAdmissionStatus || '';
                        }
                        $scope.FaceSheetSummaryObj.SurgeryList[0].InternalCoManagerId = $scope.FaceSheetSummaryObj.SurgeryList[0].InternalCoManagerId || 0;
                        $scope.FaceSheetSummaryObj.SurgeryList[0].ExternalCoManagerId = $scope.FaceSheetSummaryObj.SurgeryList[0].ExternalCoManagerId || 0
                        if ($scope.FaceSheetSummaryObj.SurgeryList[0].InternalCoManagerId != 0) {
                            let Internallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.FaceSheetSummaryObj.SurgeryList[0].InternalCoManagerId }, true);
                            if (Internallist.length > 0) {
                                $scope.FaceSheetSummaryObj.InternalCoManagerName = Internallist[0].FullName || '';
                                Internallist[0].SuffixName = Internallist[0].SuffixName || '';
                                if (Internallist[0].SuffixName !== '') {
                                    $scope.FaceSheetSummaryObj.InternalCoManagerName = $scope.FaceSheetSummaryObj.InternalCoManagerName + ' ' + Internallist[0].SuffixName;
                                }
                                /*$scope.SurgeryDiagnosisObj.InternalCoManagerName = Internallist[0].FullName;*/
                            } else {
                                $scope.FaceSheetSummaryObj.InternalCoManagerName = '';
                            }
                        }
                        if ($scope.FaceSheetSummaryObj.SurgeryList[0].ExternalCoManagerId != 0) {
                            let Internallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.FaceSheetSummaryObj.SurgeryList[0].ExternalCoManagerId }, true);
                            if (Internallist.length > 0) {
                                $scope.FaceSheetSummaryObj.ExternalCoManagerName = Internallist[0].FullName || '';
                                /*$scope.SurgeryDiagnosisObj.InternalCoManagerName = Internallist[0].FullName;*/
                            } else {
                                $scope.FaceSheetSummaryObj.ExternalCoManagerName = $scope.FaceSheetSummaryObj.SurgeryList[0].ExternalCoManagerName || '';
                            }
                        }
                        $scope.FaceSheetSummaryObj.SurgeryList[0].SurgeonId = $scope.FaceSheetSummaryObj.SurgeryList[0].SurgeonId || 0;
                        if ($scope.FaceSheetSummaryObj.SurgeryList[0].SurgeonId != 0) {
                            let Internallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.FaceSheetSummaryObj.SurgeryList[0].SurgeonId }, true);
                            if (Internallist.length > 0) {
                                $scope.FaceSheetSummaryObj.SurgeonName = Internallist[0].FullName || '';
                                if (Internallist[0].SuffixId == 10) {
                                    $scope.FaceSheetSummaryObj.SurgeonName = ' Dr. ' + $scope.FaceSheetSummaryObj.SurgeonName;
                                }
                                if (Internallist[0].SuffixName !== '') {
                                    $scope.FaceSheetSummaryObj.SurgeonName = $scope.FaceSheetSummaryObj.SurgeonName + ' ' + Internallist[0].SuffixName;
                                }
                                /*$scope.SurgeryDiagnosisObj.InternalCoManagerName = Internallist[0].FullName;*/
                            } else {
                                $scope.FaceSheetSummaryObj.SurgeonName = '';
                            }
                        }
                        $scope.FaceSheetSummaryObj.SurgeryList[0].AnesthetistId = $scope.FaceSheetSummaryObj.SurgeryList[0].AnesthetistId || 0;
                        if ($scope.FaceSheetSummaryObj.SurgeryList[0].AnesthetistId != 0) {
                            let Internallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.FaceSheetSummaryObj.SurgeryList[0].AnesthetistId }, true);
                            if (Internallist.length > 0) {
                                $scope.FaceSheetSummaryObj.Anesthetist = Internallist[0].FullName || '';
                                /*$scope.SurgeryDiagnosisObj.InternalCoManagerName = Internallist[0].FullName;*/
                            } else {
                                $scope.FaceSheetSummaryObj.Anesthetist = '';
                            }
                        }
                    }
                }
                if (resp.data.AppointmentFaceSheetData.length > 0) {
                    $scope.mastercheckListData.ApptFaceSheetData = resp.data.AppointmentFaceSheetData || [];
                    $scope.mastercheckListData.LastSignOffUserDetails = resp.data.LastSignOffUserDetails || [];
                    $scope.FaceSheetSummaryObj.PreviousCDAValue = resp.data.AppointmentFaceSheetData[0].PreviousCDAValue || "";
                    $scope.FaceSheetSummaryObj.SurgeonVerifiedUserId = resp.data.AppointmentFaceSheetData[0].SurgeonVerifiedUserId || null;
                    $scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate = resp.data.AppointmentFaceSheetData[0].PreviousCDAValueGivenDate || null;

                    if ($scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate != '' && $scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate != null) {
                        /*  $scope.FaceSheetObj.PreviousCDAValueGivenDate = $filter('date')($scope.FaceSheetObj.PreviousCDAValueGivenDate, "MM-dd-yyyy");*/
                        $scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate = moment($scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate).format("MM-DD-YYYY");

                    }

                    //$scope.obj.FaceSheetChartStatus = resp.data.AppointmentFaceSheetData[0].FaceSheetChartStatus;

                    //if ($scope.obj.FaceSheetChartStatus == 'E') {
                    //    $scope.obj.IsSingelSummaryViewFacesheet = true;
                    //    $scope.obj.IsBothSummaryViewFacesheet = false;
                    //    $scope.obj.IsAddViewFacesheet = false;
                    //    $scope.obj.IsAddandSummaryViewFacesheet = false;
                    //} else {
                    //    $scope.obj.IsSingelSummaryViewFacesheet = false;
                    //    $scope.obj.IsBothSummaryViewFacesheet = false;
                    //    $scope.obj.IsAddViewFacesheet = true;
                    //    $scope.obj.IsAddandSummaryViewFacesheet = false;
                    //}
                    //else {

                    //    $uibModalInstance.close("close");
                    //}
                    $scope.FaceSheetSummaryObj.FaceSheetCheckList = [];
                    angular.forEach(resp.data.AppointmentFaceSheetData, function (item) {
                        item.SurgeryDate = $scope.SurgeryDate || null;
                        item.PreOpVerification = item.PreOpVerification || [];
                        item.SurgeonVerification = item.SurgeonVerification || [];
                        item.EditSurgeonVerification = angular.copy($scope.TempSurgeonCheckList) || [];
                        item.EditPreOpVerification = angular.copy($scope.TempFaceSheetCheckList) || [];
                        if (item.PreOpVerification.length > 0) {
                            angular.forEach(item.EditPreOpVerification, function (Aitem) {
                                var temparray = $filter("filter")(item.PreOpVerification, function (kitem, index) { return kitem.FaceSheetId == Aitem.FaceSheetId });
                                if (temparray.length > 0) {
                                    Aitem.FaceSheetVerificationId = temparray[0].FaceSheetVerificationId;
                                    Aitem.Value = temparray[0].Value;
                                    Aitem.Remarks = temparray[0].Remarks || '';
                                    Aitem.VerifiedUserId = temparray[0].VerifiedUserId || null;
                                    Aitem.IsShowNotes = false;
                                    if (Aitem.Remarks != '') {
                                        Aitem.IsShowNotes = true;
                                    }
                                }
                            });
                        }
                        if (item.SurgeonVerification.length > 0) {
                            angular.forEach(item.EditSurgeonVerification, function (Aitem) {
                                let temparray1 = $filter("filter")(item.SurgeonVerification, function (kitem, index) { return kitem.MasterFaceSheetId == Aitem.MasterFaceSheetId });
                                if (temparray1.length > 0) {
                                    Aitem.DeleteInd = temparray1[0].DeleteInd || 'N';
                                    Aitem.FaceSheetVerificationId = temparray1[0].FaceSheetVerificationId;
                                    Aitem.IsChecked = temparray1[0].IsChecked || false;
                                    Aitem.TonometryId = temparray1[0].TonometryId || null;
                                    Aitem.MasterFaceSheetId = temparray1[0].MasterFaceSheetId;
                                    Aitem.MasterFaceSheetName = temparray1[0].MasterFaceSheetName || '';
                                    Aitem.ODAixValue = temparray1[0].ODAixValue || '';
                                    Aitem.ODAvgKvalues = temparray1[0].ODAvgKvalues || '';
                                    Aitem.ODAxialLength = temparray1[0].ODAxialLength || '';
                                    Aitem.ODCylValue = temparray1[0].ODCylValue || '';
                                    Aitem.ODFormulaId = temparray1[0].ODFormulaId || null;
                                    Aitem.ODFormula = temparray1[0].ODFormula || '';
                                    Aitem.ODIOLManufacturer = temparray1[0].ODIOLManufacturer || '';
                                    Aitem.ODIOLModel = temparray1[0].ODIOLModel || '';
                                    Aitem.ODIOLpower = temparray1[0].ODIOLpower || '';
                                    Aitem.ODK1AxisValue = temparray1[0].ODK1AxisValue || '';
                                    Aitem.ODK1Value = temparray1[0].ODK1Value || '';
                                    Aitem.ODK2AxisValue = temparray1[0].ODK2AxisValue || '';
                                    Aitem.ODK2Value = temparray1[0].ODK2Value || '';
                                    Aitem.ODOpticalACD = temparray1[0].ODOpticalACD || '';
                                    Aitem.ODRemarks = temparray1[0].ODRemarks || '';
                                    Aitem.ODSCValue = temparray1[0].ODSCValue || '';
                                    Aitem.ODSphValue = temparray1[0].ODSphValue || '';
                                    Aitem.ODTargetRefraction = temparray1[0].ODTargetRefraction || '';
                                    Aitem.ODValue = temparray1[0].ODValue || '';
                                    Aitem.ODWhitetoWhite = temparray1[0].ODWhitetoWhite || '';
                                    Aitem.OSAixValue = temparray1[0].OSAixValue || '';
                                    Aitem.OSAvgKvalues = temparray1[0].OSAvgKvalues || '';
                                    Aitem.OSAxialLength = temparray1[0].OSAxialLength || '';
                                    Aitem.OSCylValue = temparray1[0].OSCylValue || '';
                                    Aitem.OSFormulaId = temparray1[0].OSFormulaId || null;
                                    Aitem.OSFormula = temparray1[0].OSFormula || '';
                                    Aitem.OSIOLManufacturer = temparray1[0].OSIOLManufacturer || '';
                                    Aitem.OSIOLModel = temparray1[0].OSIOLModel || '';
                                    Aitem.OSIOLpower = temparray1[0].OSIOLpower || '';
                                    Aitem.OSK1AxisValue = temparray1[0].OSK1AxisValue || '';
                                    Aitem.OSK1Value = temparray1[0].OSK1Value || '';
                                    Aitem.OSK2AxisValue = temparray1[0].OSK2AxisValue || '';
                                    Aitem.OSK2Value = temparray1[0].OSK2Value || '';
                                    Aitem.OSOpticalACD = temparray1[0].OSOpticalACD || '';
                                    Aitem.OSRemarks = temparray1[0].OSRemarks || '';
                                    Aitem.OSSCValue = temparray1[0].OSSCValue || '';
                                    Aitem.OSSphValue = temparray1[0].OSSphValue || '';
                                    Aitem.OSTargetRefraction = temparray1[0].OSTargetRefraction || '';
                                    Aitem.OSValue = temparray1[0].OSValue || '';
                                    Aitem.OSWhitetoWhite = temparray1[0].OSWhitetoWhite || '';
                                    Aitem.PupilOPValue = temparray1[0].PupilOPValue || '';
                                    Aitem.PupilPREValue = temparray1[0].PupilPREValue || '';
                                    Aitem.Remarks = temparray1[0].Remarks || '';
                                    Aitem.TypeValue = temparray1[0].TypeValue || '';
                                    Aitem.Value = temparray1[0].Value || '';
                                    Aitem.VerifiedUserId = temparray1[0].VerifiedUserId || '';
                                    Aitem.VerifiedUserName = temparray1[0].VerifiedUserName || '';
                                    Aitem.VisionPHValue = temparray1[0].VisionPHValue || '';
                                    Aitem.IsTopcon = temparray1[0].IsTopcon || false;
                                    Aitem.GivenbyId = temparray1[0].GivenbyId || null;
                                    Aitem.Givenby = temparray1[0].Givenby || '';
                                    Aitem.ODIOLPrevious = temparray1[0].ODIOLPrevious || '';
                                    Aitem.OSIOLPrevious = temparray1[0].OSIOLPrevious || '';
                                    Aitem.ODIOLTypeId = temparray1[0].ODIOLTypeId || null;
                                    Aitem.ODIOLType = temparray1[0].ODIOLType || '';
                                    Aitem.OSIOLTypeId = temparray1[0].OSIOLTypeId || null;
                                    Aitem.OSIOLType = temparray1[0].OSIOLType || '';
                                    Aitem.ODLasikTypeId = temparray1[0].ODLasikTypeId || null;
                                    Aitem.ODLasikType = temparray1[0].ODLasikType || '';
                                    Aitem.OSLasikTypeId = temparray1[0].OSLasikTypeId || null;
                                    Aitem.OSLasikType = temparray1[0].OSLasikType || '';

                                    Aitem.IsShowNotes = false;
                                    if (Aitem.Remarks != '' || Aitem.ODRemarks != '' || Aitem.OSRemarks != '') {
                                        Aitem.IsShowNotes = true;
                                    }

                                    if (Aitem.ODIOLTypeId == 16 || Aitem.ODIOLTypeId == 17) {
                                        $scope.IsODLasikType = true;
                                    };
                                    if (Aitem.OSIOLTypeId == 16 || Aitem.OSIOLTypeId == 17) {
                                        $scope.IsOSLasikType = true;
                                    };
                                }
                            });
                        }

                        var obj = {
                            "OrganId": item.OrganId,
                            "ReviewedBy": item.ReviewedBy,
                            "PatientFaceSheetId": item.PatientFaceSheetId,
                            "PreOpVerification": item.EditPreOpVerification || [],
                            "SurgeonVerification": item.EditSurgeonVerification || [],
                            "SurgeryDate": $scope.SurgeryDate || null,
                        }
                        $scope.FaceSheetSummaryObj.FaceSheetCheckList.push(obj);
                    });
                }
            }
        });
    }
    

    $scope.GetPentacomImageDetails = function () {
        var pentacamgetReq = {
            "PatientId": $scope.cacheStorageItem.PatientID,
            "AppointmentId": $scope.FaceSheetAppointmentId,
            "InvestigationId": 1155
        }

              
        eHnoteSurgeryService.getPatientApptPentacamfiles(pentacamgetReq).then(function (resp) {
            if (resp.data.Status == "Success") {
                $scope.pentaCamReportImages = [];
                if (resp.data.PentaCamReportDocuments.length > 0) {

                    angular.forEach(resp.data.PentaCamReportDocuments, function (pitem) {
                        var obj = {
                            "DocumentId": pitem.FileId,
                            "DocumentExt": pitem.FileExt,
                            "FileExt": pitem.FileExt,
                            "DocumentName": pitem.FileName,
                            "FileName": pitem.FileName,
                            "S3URL": pitem.S3URL,
                            "OrganId": pitem.OrganId,
                            "DeleteInd": "N",
                            "FileTypeId": 36,
                            "DisplayName": pitem.FileName || "",
                        }
                        $scope.pentaCamReportImages.push(obj);
                    });

                }
            }
        });       
    }

}]);
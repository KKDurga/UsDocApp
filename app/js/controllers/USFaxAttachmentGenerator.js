"use strict";
eHnoteWebApp.controller("USFaxAttachmentGenerator", ["$scope", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "$uibModalInstance", "datapersistanceFactory", "$window", "eHnoteMainAppointmentService", "$q", "eHnotePatientAddressDataServices", "eHnoteOrgReferralDataServices", "localStorageFactory", "eHnoteSurgeryService", "$timeout", "eHnotePrintService", "eHnoteSettingsDataService", "SurgeryStaticDataService", "eHnoteInsuranceService", "Lightbox", "eHnoteDbStaticDataService", "eHnoteMainAdminServices", "eHnoteAuditServices", "eHnoteDiagnosisDataServices", "datacookieFactory", "$translate", "eHnoteUserDataService", "eHnoteReferalDataService", "USPrintService", "InventoryService", "eHnoteConditionsDataService", "UsEmailPrintHelperService", "eHnotePatientVisitReasonServices", "resolveObj", function ($scope, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, $uibModalInstance, datapersistanceFactory, $window, eHnoteMainAppointmentService, $q, eHnotePatientAddressDataServices, eHnoteOrgReferralDataServices, localStorageFactory, eHnoteSurgeryService, $timeout, eHnotePrintService, eHnoteSettingsDataService, SurgeryStaticDataService, eHnoteInsuranceService, Lightbox, eHnoteDbStaticDataService, eHnoteMainAdminServices, eHnoteAuditServices, eHnoteDiagnosisDataServices, datacookieFactory, $translate, eHnoteUserDataService, eHnoteReferalDataService, USPrintService, InventoryService, eHnoteConditionsDataService, UsEmailPrintHelperService, eHnotePatientVisitReasonServices, resolveObj) {

    var appoint_info = eHnoteMasterDataService.getAppointmentInfo();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.resolveObj = resolveObj || {};
    $scope.TempIsCheckArray = resolveObj.TempIsCheckArray || [];
    $scope.HospitalId = 0;
    $scope.SelectedChartObj = resolveObj.ChartObj || {};
    $scope.SelectedAppointmentId = $scope.SelectedChartObj.AppointmentId || 0;
    $scope.ParentHospitalId = resolveObj.ParentHospitalId || 0;
    $scope.clinicDoctorList = resolveObj.clinicDoctorList || [];
    $scope.allUserList = resolveObj.clinicDoctorList || [];
    $scope.SelectedVisitId = $scope.SelectedChartObj.VisitId || 0;
    //$scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    }

    let BranchSettingsData = datapersistanceFactory.getItem("BranchSettingsData");
    $scope.IsShowEmptyASCChecklist = BranchSettingsData?.IsShowEmptyASCChecklist || false;

    $scope.GetScoreObject = function () {
        return {
            "PHQScore": 0,
            "AUDITScore": 0,
            "NHANESscore": 0,
            "HARKscore": 0
        }
    };
    $scope.ScoreObject = angular.copy($scope.GetScoreObject());
    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    if ($scope.cacheStorageItem == undefined) {
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
    }
   
    $scope.AddToCache = function () {
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    };
    $scope.AllAscPrintObj = {
        "IsAdmitPrintInd": false,
        "IsPreopPrintInd": false,
        "IsPreopAnesthesiaPrintInd": false,
        "IsPreopChecklistPrintInd": false,
        "IsIntraopPrintInd": false,
        "IsIntraopCheckinChecklistPrintInd": false,
        "IsIntraopAnesthesiaPrintInd": false,
        "IsIntraopChecklistPrintInd": false,
        "IsPostopPrintInd": false,
        "IsPostopChecklistPrintInd": false,
        "IsPostopAnesthesiaPrintInd": false,
        "IsOperativeNotesPrintInd": false,
        "IsDischargeSummaryPrintInd": false,
        "IsAllPrintSelected": false,
        "IsDoctorNotesPrintInd": false,
        "AllergyItems": [],
        "SystemicHistory": [],
        "SurgicalHistory": [],
        "CurrentSystemicMedicationList": [],
        "CurrentEyeMedicationList": [],
        "LifestyleDetail": [],
        "AllergyRemarks": "",
        "SurgicalRemarks": "",
        "CurrentSystemicRemarks": "",
        "CurrentEyeRemarks": "",
        "SystemicHistoryRemarks": "",
        "LifestyleHistoryRemarks": "",
        "RespiratoryRemarks": "",
        "IsFemtoPrintInd": false,
    }
    $scope.FaceSheetObj = {
        "FaceSheetCheckList": [{
            "OrganId": null,
            "ReviewedBy": null,
            "PatientFaceSheetId": 0,
            "PreOpVerification": [],
            "SurgeonVerification": [],

        }],
        "PreviousCDAODValue": "",
        "PreviousCDAOSValue": "",
        "PreviousCDAValueGivenDate": null,
        "SurgeonVerifiedUserId": null,
    };

    $scope.ParentObj = {
        'IsIOJParentOrganization': false
    };
    $scope.DilationObj = {
        "IsBeforeDilation": false,
        "IsAfterDilation": false,

    }
    $scope.GetSurgeryDiagnosisObj = function () {
        return {
            "DiagnosisName": "",
            "AnesthesistName": "",
            "NurseName": "",
            "SurgeryDate": "",
            "OperativeProcedure": "",
            "SurgeonName": "",
            "CPTCode ": "",
            "SurgeryName": "",
            "InternalCoManagerName": "",
            "ExternalCoManagerName": "",
            "CardialogistStatus": "",
            "PreAdmissionStatus": "",
            "AscAppointmentDate": "",
            "FirstFollowupDate": "",
            "SecondFollowupDate": "",
            "ThirdFollowupDate": "",
            "SurgeryList": []

        };
    };

    $scope.SurgeryDiagnosisObj = angular.copy($scope.GetSurgeryDiagnosisObj());

    var currenturl = $location.absUrl().split('?')[0];

    var CurrentEnvironment = currenturl.split('/#')[0];

    if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com") {
        $scope.ParentObj.IsIOJParentOrganization = true;
    } else {
        $scope.ParentObj.IsIOJParentOrganization = false;
    }

    $scope.SelectAllPrints = function () {
        if ($scope.AllAscPrintObj.IsAllPrintSelected) {
            $scope.AllAscPrintObj.IsAdmitPrintInd = true;
            $scope.AllAscPrintObj.IsPreopPrintInd = true;
            $scope.AllAscPrintObj.IsPreopAnesthesiaPrintInd = true;
            $scope.AllAscPrintObj.IsPreopChecklistPrintInd = true;
            $scope.AllAscPrintObj.IsIntraopPrintInd = true;
            $scope.AllAscPrintObj.IsIntraopCheckinChecklistPrintInd = true;
            $scope.AllAscPrintObj.IsIntraopAnesthesiaPrintInd = true;
            $scope.AllAscPrintObj.IsIntraopChecklistPrintInd = true;
            $scope.AllAscPrintObj.IsPostopPrintInd = true;
            $scope.AllAscPrintObj.IsPostopChecklistPrintInd = true;
            $scope.AllAscPrintObj.IsPostopAnesthesiaPrintInd = true;
            $scope.AllAscPrintObj.IsOperativeNotesPrintInd = true;
            $scope.AllAscPrintObj.IsDischargeSummaryPrintInd = true;
            $scope.AllAscPrintObj.IsFemtoPrintInd = true;
            $scope.AllAscPrintObj.IsDoctorNotesPrintInd = true;
        } else {
            $scope.AllAscPrintObj.IsAdmitPrintInd = false;
            $scope.AllAscPrintObj.IsPreopPrintInd = false;
            $scope.AllAscPrintObj.IsPreopAnesthesiaPrintInd = false;
            $scope.AllAscPrintObj.IsPreopChecklistPrintInd = false;
            $scope.AllAscPrintObj.IsIntraopPrintInd = false;
            $scope.AllAscPrintObj.IsIntraopCheckinChecklistPrintInd = false;
            $scope.AllAscPrintObj.IsIntraopAnesthesiaPrintInd = false;
            $scope.AllAscPrintObj.IsIntraopChecklistPrintInd = false;
            $scope.AllAscPrintObj.IsPostopPrintInd = false;
            $scope.AllAscPrintObj.IsPostopChecklistPrintInd = false;
            $scope.AllAscPrintObj.IsPostopAnesthesiaPrintInd = false;
            $scope.AllAscPrintObj.IsOperativeNotesPrintInd = false;
            $scope.AllAscPrintObj.IsDischargeSummaryPrintInd = false;
            $scope.AllAscPrintObj.IsAllPrintSelected = false;
            $scope.AllAscPrintObj.IsFemtoPrintInd = false;
            $scope.AllAscPrintObj.IsDoctorNotesPrintInd = false;
        }
    }

    $scope.SelectPreopPrint = function () {
        if ($scope.AllAscPrintObj.IsPreopPrintInd) {           
            $scope.AllAscPrintObj.IsPreopAnesthesiaPrintInd = true;
            $scope.AllAscPrintObj.IsPreopChecklistPrintInd = true;
        } else {
            $scope.AllAscPrintObj.IsPreopAnesthesiaPrintInd = false;
            $scope.AllAscPrintObj.IsPreopChecklistPrintInd = false;
        }
    }
    $scope.OnSubPreopChange = function () {
        if ($scope.AllAscPrintObj.IsPreopAnesthesiaPrintInd && $scope.AllAscPrintObj.IsPreopChecklistPrintInd) {          
            $scope.AllAscPrintObj.IsPreopPrintInd = true;
        } else {
            $scope.AllAscPrintObj.IsPreopPrintInd = false;
        }
    };

    $scope.SelectIntraopPrint = function () {
        if ($scope.AllAscPrintObj.IsIntraopPrintInd) {
            $scope.AllAscPrintObj.IsIntraopCheckinChecklistPrintInd = true;
            $scope.AllAscPrintObj.IsIntraopAnesthesiaPrintInd = true;
            $scope.AllAscPrintObj.IsIntraopChecklistPrintInd = true;
        } else {
            $scope.AllAscPrintObj.IsIntraopCheckinChecklistPrintInd = false;
            $scope.AllAscPrintObj.IsIntraopAnesthesiaPrintInd = false;
            $scope.AllAscPrintObj.IsIntraopChecklistPrintInd = false;
        }
    }
    $scope.OnSubIntraopChange = function () {
        if ($scope.AllAscPrintObj.IsIntraopCheckinChecklistPrintInd && $scope.AllAscPrintObj.IsIntraopAnesthesiaPrintInd && $scope.AllAscPrintObj.IsIntraopChecklistPrintInd) {
            $scope.AllAscPrintObj.IsIntraopPrintInd = true;
        } else {
            $scope.AllAscPrintObj.IsIntraopPrintInd = false;
        }
    };

    $scope.SelectPostopPrint = function () {
        if ($scope.AllAscPrintObj.IsPostopPrintInd) {
            $scope.AllAscPrintObj.IsPostopChecklistPrintInd = true;
            $scope.AllAscPrintObj.IsPostopAnesthesiaPrintInd = true;
        } else {
            $scope.AllAscPrintObj.IsPostopChecklistPrintInd = false;
            $scope.AllAscPrintObj.IsPostopAnesthesiaPrintInd = false;
        }
    }

    $scope.OnSubPostopChange = function () {
        if ($scope.AllAscPrintObj.IsPostopChecklistPrintInd && $scope.AllAscPrintObj.IsPostopAnesthesiaPrintInd) {
            $scope.AllAscPrintObj.IsPostopPrintInd = true;
        } else {
            $scope.AllAscPrintObj.IsPostopPrintInd = false;
        }
    };


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
            },
            {
                "Id": 9,
                "VitalName": "Temparature",
                "VitalReadingList": [],
            },
            {
                "Id": 10,
                "VitalName": "Note",
                "VitalReadingList": [],
            }

        ];
    };

    $scope.PostopAnesthesiaList = [
        {
            "AnesthesiaTypeId": 1,
            "AnesthesiaType": "Topical",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0,
        },
        {
            "AnesthesiaTypeId": 2,
            "AnesthesiaType": "Local",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 3,
            "AnesthesiaType": "General",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 4,
            "AnesthesiaType": "Peribulbar",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 5,
            "AnesthesiaType": "Sub-Tenon",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 6,
            "AnesthesiaType": "Regional",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 7,
            "AnesthesiaType": "IVSedation",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 8,
            "AnesthesiaType": "Monitored Anesthesia Care (MAC)",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 9,
            "AnesthesiaType": "Oral Sedation",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 12,
            "AnesthesiaType": "MAC",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        },
        {
            "AnesthesiaTypeId": 13,
            "AnesthesiaType": "General/ TIVA",
            "IsSelected": false,
            "PatientAnesthesiaPlanId": 0
        }
    ]
    $scope.visualacuityobj = {
        "IsSCDistance": false,
        "IsSCNear": false,
        "IsCCGDistance": false,
        "IsCCGNear": false,
        "IsTACDistance": false,
        "IsPinholeDistance": false,
        "IsCCLDistance": false,
        "IsCCLNear": false
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

    $scope.AldreteDetails = angular.copy($scope.GetAldreteDetails());

    $scope.PreAdmissionDetails = {
        "AssessmentsASA": {
            "Value": "",
            "Notes": "",
            "EValue": "",
            "ENotes": "",
            "IsEmergency": false,
        },
        "ASAObj": null,
        "ASAClassificationNotes": "",
        "ECGObj": "",
        "AnesthesiaTypelist": [],
        "AnesthetistName": "",
        "AnesthetistId": null,
        "ReviewedDate": "",
        "AnesthetistReviewedDate": "",
        "AnesthesiologistReviewedDate": "",
        "PrescriptionDetails": [],
        "Investigationslist": [],
        "ReviewedBy": null,
        "AnesthesiaReviewedName": "",
        "AnesthesiaSuffix": "",
        "AnesthesiaLicenseNo": "",
        "LabInvestigation": [],
        "Airway": "",
        "ChemistryNotes": "",
        "SystemicHistory": [],
        "AnesthesiologistName": "",
        "AnesthesiologistId": null,
        "AnesthesiologistReviewedBy": null,
        "AnesthesiologistReviewedName": "",
        "LifestyleDetail": [],
        "PreviousAnesthetics": [],
        "AnesthesiaPlan": {
            "AnesPlanDosage": "",
            "AnesthetistNotes": "",
            "IsAnestheticplan": false,
        },
        "PreAdmissionStatus": "",
        "LabNotes": "",
        "CardioVascular": "",
        "MedicineOrdersInstructions": "",
        "PhysicalEvaluationArray": [],
        "PhysicalNeurologicNotes": '',
        "PhysicalGeneralNotes": '',
        "PhysicalCardiocNotes": '',
        "PhysicalHepaticNotes": '',
        "PhysicalPulmonaryNotes": '',
        "LastDialysisDate": null,
    }

    $scope.AdmissionObj = {
        "RecievedForSurgery": "",
        "RecievedForSurgeryNotes": "",
        "AccompainedBy": "",
        "AccompainedByNotes": "",
        "AdmittedBy": null,
        "AdmissionTime": "",
        "AdmittedByName": "",
        "AdmittedByLicenseNo": "",
        "AdmittedBySuffix": "",
        "AdmissionPrefix": "",
        "ReviewedByName": "",
        "ReviewedBy": "",
        "ReviewedByLicenseNo": "",
        "ReviewedBySuffix": "",
        "AdmissionDate": "",
        "ReasonForVisit": "",
        "CheckLists": [],
        "NPOTime": "",
    }

    $scope.AscPreopObj = {
        "ReviewedBy": "",
        "ReviewedByName": "",
        "AlderetScoreDetails": [],
        "PreOPLastSignOffUserDetails": [],
        "PatientCheckIn": null,
        "PreOpMedications": [],
        "DilationMedications": [],
        "OrgASCChecklist": [],
        "PreOpCallDetails": [],
        "TotalAlderetScore": "",
        "IdentifierName": "",
        "IdentifierDurationDate": "",
        "PreOpMedicationRemarks": "",
        "MedicationReviewName": "",
        "MedicationRemarks": "",
        "ReviewedByName": "",
        "ReviewedDate": "",
        "ReviewedTime": "",
        "LastSignOffUserDetails": [],
        "ROSOverAllRemarks": "",
        "DilationReviewName": "",
        "DilationReviewId": null,
        "MedicationReviewName": "",
        "MedicationReviewId": null,
        "IsVeinOpened": null,
        "IsNasalcanula": null,
        "IsDiabetes": null,
        "IsHypoglycemiaCheck": false,
        "DiabetesResult": "",
        "DiabetesTime": "",
        "OSPupilSize": "",
        "DiabetesTimings": [],
        "PreOpNotes": "",
        "PreOpAnesthesiaNotes": null,
        "SurgicalSiteVerifiedBy": null,
        "SurgicalSiteVerifiedByName": "",
        "PreOpSurgicalSiteRemarks": "",
        "IVSite": null,
        "IVBlocked": null,
        "IVNeedleSize": null,
        "IVArm": "",
        "PatencyStatus": "",
        "IVSiteName": "",
        "IVNeedleSizeName": "",
        "PatencyStatus": "",
        "IVSiteBlocked": false,
        "PreOpOverallNotes": "",
        "NurseFallRiskReviewdDate": "",
        "NurseFallRiskID": 0,
        "NurseFallRiskName": '',
        "FallRiskLevel": '',
        "ImplementedFallRiskProtocol": false,
        "ImplementedFallRiskProtocoltype": '',
        "FallRiskAssessmentTotalScore": '',
        "NurseFallRiskLicenseNo": '',
        "OrderDetails": [],
        "IVSiteFluidsArray": [],
        "IVSiteFlushArray ": [],
        "IVSiteLRArray": [],
        "IVBlockedArray": [],
        "PreOpInRoomTime": '',
        "PreOpDiabetesRemarks": "",
        "NoOfAttempts": null,
        "IvAccessGivenBy": null,
        "IvAccessGivenByName": "",
        "IvAccessGivenByTime": '',
        "PainLevel": null,
        "FemtoArcuateIncisions1": '',
        "IsFemtoArcuateIncisions1NA": false,
        "FemtoArcuateIncisions2": '',
        "IsFemtoArcuateIncisions2NA": false,
        "FemtoArcuateIncisionsNotes": '',
        "FemtoTimeOut": '',
        "FemtoStartTime": '',
        "FemtoEndTime": '',
        "FemtoReferenceNo": '',
        "FemtoLotNo": '',
        "FemtoExpiryDate": null,
        "FemtoOverAllNotes": '',
        "FemtNurseReviewedById": null,
        "FemtNurseReviewedByName": '',
        "FemtDoctorReviewedById": null,
        "FemtDoctorReviewedByName": '',
        "FemtDoctorReviewedByDate": null,
        "FemtDoctorReviewedByTime": '',
        "IfFemtoTemplateDataAdded": false,
        "FallriskBraceletprovided": '',
        "AssistiveWalkingDevice": '',
    }

    $scope.AscIntraop = {
        "PatientAscChecklist": [],
        "IntraOPLastSignOffUserDetails": [],
        "NurseActions": {
            "Levelofconsciousness": "",
            "PatientPosition": "",
            "SafetyDevicePosition": {
                "ArmsToTheBody": "",
                "AnotherRailing": "",
                "Strap": "",
            },
            "SkinPreparation": "",
            "Sterilewater": "",
            "Alcohol": "",
            "NurseActionOrganId": "",
            "NurseActionArea": "",
            "CropHour": "",
            "LevelofconsciousnessNotes": "",
            "PatientPositionNotes": "",
            "SafetyDevicePositionNotes": "",
            "SkinPreparationNotes": "",
            "AreaNotes": "",
            "PatientTolerated": false,
            "Disposition": false,
            "CarePostoperative": false,
            "Recoveryroom": false,
            "OthersIntraData": "",
            "SurgeonName": "",
            "CoSurgeonName": "",
            "TechnicianName": "",
            "AnesthesistName": "",
            "ReliefName": "",
            "NurseName": "",
            "SupportingStaffName": "",
            "SurgeryRoomNo": "",
            "HallEntranceStartTime": "",
            "HallEntranceEndTime": "",
            "AnesthesiaStartTime": "",
            "AnesthesiaEndTime": "",
            "SurgeryStartTime": "",
            "SurgeryEndTime": "",
            "SurgicalFirstNeedles": "",
            "SurgicalFirstBlades": "",
            "SurgicalFirstOthers": "",
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
            "Cleansed": "",
            "Dirty": "",
            "Contaminated": "",
            "CauteraisationOthers": "",
            "EspecimenLab": "",
            "SurgicalSupplyName": "",
            "LotNumber": null,
            "ExpirationDate": null,
            "PhacoMachines": [],
            "AdditionalStaffName":''
        },
        "AnesthetistActions": {
            "IntakeValue": "",
            "OutputValue": "",
            "EBLValue": "",
            "InTime": "",
            "OutTime": "",
        },
        "PatientAlert": "",
        "VitalsType": "",
        "RecoveryStartTime": "",
        "RecoveryStopTime": "",
        "ModifiedDt": "",
        "DoctorName": "",
        "DoctorSuffix": "",
        "DoctorLicense": "",
        "NurseName": "",
        "NurseSuffix": "",
        "NurseLicense": "",
        "IntraOpNotes": null,
        "IntraOpAnesthesiaNotes": null,
        "AnesthesiaName": "",
        "AnesthesiaSuffix": "",
        "AnesthesiaLicense": "",
        "TechnicianName": "",
        "TechnicianSuffix": "",
        "TechnicianLicense": "",
        "AnesthesiologistName": "",
        "AnesthesiologistSuffix": "",
        "AnesthesiologistLicense": "",
        "OxygenQuantity": "",
        "OxygenType": "",
        "EndotrachealTubeNotes": "",
        "LMANotes": "",
        "BeforeAnesthesiaReviewedByName": "",
        "BeforeAnesthesiaTime": "",
        "BeforeIncisionReviewedByName": "",
        "BeforeORReviewedByName": "",
        "MedicationsReviewName": "",
        "MedicationsNotes": "",
        "AnesthesiaMedicationsNotes": "",
        "AnesthesiaMedicationsReviewName": "",
        "PreOpMedications": [],
        "OrderDetails": [],
        "LastSignOffUserDetails": [],
        "CDEOD": "",
        "CDEOS": "",
        "CDERemarks": "",
        "PatientStableSurgery": false,
        "AdequatePreoperativeWorkup": false,
        "EspecimenLab": "",
        "Pathology": "",
        "ProcedureDescription": "",
        "NurseReviewedDate": '',
        "AnesthetistReviewedDate": '',
        "AnesthesiologistReviewedDate": '',
        "ReviewedByobj": {
            'DoctorName': '',
            'DoctorSuffix': '',
            'DoctorLicense': '',
            'NurseName': '',
            'NurseSuffix': '',
            'NurseLicense': '',
            'AnesthesiaName': '',
            'AnesthesiaSuffix': '',
            'AnesthesiaLicense': '',
            'TechnicianName': '',
            'TechnicianSuffix': '',
            'TechnicianLicense': '',
            'ModifiedDate': '',
            "AnesthesiologistName": '',
            "AnesthesiologistSuffix": '',
            "AnesthesiologistLicense": '',
            "NurseReviewedDate": '',
            "AnesthetistReviewedDate": '',
            "AnesthesiologistReviewedDate": '',
        }
    }

    $scope.AscPostOp = {
        "ReviewedByName": "",
        "AnesthesiaReviewedBy": null,
        "BaseURL": "",
        "S3URL": "",
        "AnesthesiaTypelist": [],
        "InTime": null,
        "OutTime": null,
        "AldreteDetails": [],
        "PostOpMedications": [],
        "OrgASCChecklist": [],
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
                "DeleteInd": "N",
                "TemplateName": "",
                "PostOpNurseTemplateId": 0,
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
                "SignoffBy": null,
                "TemplateName": "",
                "PostOpActionTemplateId": 0,
            }
        },
        "MedicationsReviewId": null,
        "MedicationsReviewName": "",
        "MedicationsNotes": "",
        "MasterAscPatientGoal": [],
        "Prescription": [],
        "InvestigationsList": [],
        "Diagnosis": [],
        "PostOpLastSignOffUserDetails": [],
        "IsPostProceduresNotes": false,
        "ProgressPatientStable": "",
        "ProgressPatientwheelchairNotes": "",
        "ProgressPatienttransferred": "",
        "HighCriteriaRemarks": "",
        "CheckInReviewDoctorName": "",
        "CheckInReviewDoctorId": "",
        "CheckInReviewNurseId": "",
        "CheckInReviewNurseName": "",
        "CheckInReviewAnesthetistId": "",
        "CheckInReviewAnesthetistName": "",
        "SurgeonOperativeNotes": "",
        "RecoveryStartTime": "",
        "RecoveryStopTime": "",
        "Complications": "",
        "NurseReviewedDate": "",
        "AnesthetistReviewedDate": "",
        "IntrOpHandOffTime": "",
        "IntraOpHandOffReviewedByname": "",
        "PostOpNotes": null,
        "PostOpAnesthesiaNotes": null,
        "IsPatientDischarge": false,
        "PostopReviewedByobj": {
            'DoctorName': '',
            'DoctorSuffix': '',
            'DoctorLicense': '',
            'NurseName': '',
            'NurseSuffix': '',
            'NurseLicense': '',
            'AnesthesiaName': '',
            'AnesthesiaSuffix': '',
            'AnesthesiaLicense': '',
            'TechnicianName': '',
            'TechnicianSuffix': '',
            'TechnicianLicense': '',
            "ModifiedDate": '',
            "NurseReviewedDate": '',
            "AnesthetistReviewedDate": '',
        },
        "OrderDetails": [],
        "ProgressNotesPainScore": null,
        "IntraOpAnesthesiaStartTime": '',
        "IntraOpAnesthesiaEndTime": '',
        "DiscontinueIVTime": '',
        "PatientDischargeTime": '',
    }

    $scope.AscDischargeSummaryObj = {
        "Diagnosis": [],
        "PostOPDischargeLastSignOffUserDetails": [],
        "ExaminationNotes": "",
        "PatientConditionInstruction": "",
        "PatientsInstructions": "",
        "CoManagementInstruction": "",
        "FollowUpDate1": "",
        "FollowUpDate2": "",
        "FollowUpDate3": "",
        "FollowUpInstructions": "",
        "Complications": "",
        "DischargeReviewedBy": null,
        "FinalDisposition": "",
        "PostProcedureNote": "",
        "ProcedureDescription": "",
        "Prescriptions": [],
        "LastSignOffUserDetails": [],
        "PatientinstructionsInd": false
    }

    $scope.AscOperativeNotes = {
        "ImplantsDetailsArray": [],
        "OperativeNOtesLastSignOffUserDetails": [],
        "ProcedureDetails": "",
        "Complications": "",
        "ReasonForVisit": "",
        "Findings": "",
        "SurgeonOperativeNotes": "",
        "OperativeNotesReviewedBy": null,
        "OperativeReviewedName": "",
        "OperativeReviewedNameSuffix": "",
        "ReviewedByLicenseNumber": "",
        "OperativeReviewedDate": "",
        "MedicineOrdersInstructions": "",
        "PhysicalExam": "",
        "PreProcedureNotes": "",
        "Pathology": "",
        "PatientsInstructions": "",
        "PostProcedureNotes": "",
        "OperativeOverAllRemarks": "",
    }
    $scope.FemtotempObj = {

        "OrgASCChecklist": [],
        "FemtoArcuateNotesInd": false,
        "FemtoArcuateIncisions1": '',
        "IsFemtoArcuateIncisions1NA": false,
        "FemtoArcuateIncisions2": '',
        "IsFemtoArcuateIncisions2NA": false,
        "FemtoArcuateIncisionsNotes": '',
        "FemtoTimeOut": '',
        "FemtoStartTime": '',
        "FemtoEndTime": '',
        "FemtoReferenceNo": '',
        "FemtoLotNo": '',
        "FemtoExpiryDate": null,
        "FemtoOverAllNotes": '',
        "FemtNurseReviewedById": null,
        "FemtNurseReviewedByName": '',
        "FemtDoctorReviewedById": null,
        "FemtDoctorReviewedByName": '',
        "FemtDoctorReviewedByDate": null,
        "FemtDoctorReviewedByTime": '',
        "IfFemtoTemplateDataAdded": false,
        "FemtAnesthesiaReviewedById": null,
        "FemtAnesthesiaReviewedByName": '',
        "PatientASCFemtoId": null,
    }

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
            {
                "PatientAnesthesiaVitalId": 0,
                "PatientAnesthesiaPostOpDetailId": null,
                "VitalId": 6,
                "VitalName": "O2 Saturation",
                "VitalValues": [],
                "DeleteInd": "N"
            },
            {
                "PatientAnesthesiaVitalId": 0,
                "PatientAnesthesiaPostOpDetailId": null,
                "VitalId": 9,
                "VitalName": "Temparature",
                "VitalValues": [],
                "DeleteInd": "N"
            },
            {
                "PatientAnesthesiaVitalId": 0,
                "PatientAnesthesiaPostOpDetailId": null,
                "VitalId": 10,
                "VitalName": "Notes",
                "VitalValues": [],
                "DeleteInd": "N"
            }
        ];
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

    $scope.HeaderLogo = '';
    $scope.initOrgLogo = function () {
        var printobj = datapersistanceFactory.getItem("printSettingData");
        console.log(printobj);
        printobj.PrintHeaderImgUrl = printobj.PrintHeaderImgUrl || "";
        if (printobj.PrintHeaderImgUrl !== "") {
            $scope.toDataURL(printobj.PrintHeaderImgUrl, function (dataURL) {
                $scope.HeaderLogo = dataURL;
            });
        }
    }
    $scope.DrawingPadImagesArray = [];
    $scope.DrawingPadImgs = function () {
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
    };
    $scope.IsitAscSurgeryApptInd = false;
    $scope.showQuickSummary=false
    $scope.ChangesConsultation = function (item) {
        $scope.AllVisitsArray.forEach(visit => {
            visit.isActive = (visit.AppointmentId === item.AppointmentId);
            if (visit.VisitsArray && visit.VisitsArray.length > 0) {
                visit.VisitsArray.forEach((inVisit, index) => {
                    inVisit.isSelected = visit.isActive && index == 0;
                    //$scope.ConsultationId = inVisit.VisitId;
                });
            }
        });
        var ConsultationId = item.ConsultationId || 0;
       // var ConsultationId = $scope.ConsultationId || 0;
        var AppointmentId = item.AppointmentId || 0;
        $scope.SelectedAppointmentId = item.AppointmentId || 0;
        $scope.SelectedPatientId = item.PatientId || 0;
        //$scope.SelectedVisitId = item.VisitId || 0;
        if (item.VisitsArray.length > 0) {
            $scope.SelectedVisitId = item.VisitsArray[0].VisitId || 0;
        }
        $scope.IsitAscSurgeryApptInd = (item.AppointmentTypeId == 4 || item.AppointmentTypeId == 14) ? true : false;
        $scope.cacheStorageItem.selectedApptObj = angular.copy(item);
        $scope.cacheStorageItem.AppointmentTypeId = angular.copy(item.AppointmentTypeId);
        addcachefromservice(item);
        if ($scope.IsitAscSurgeryApptInd) {
            let obj = {
                "SubTab": (item.AppointmentTypeId == 4 || item.AppointmentTypeId == 14) ? 7 : 2,
                "AppointmentTypeId": item.AppointmentTypeId,
                "AppointmentId": item.AppointmentId,
                "SurgeryList": item.SurgeryList || [],
                "PatientID": item.PatientId || 0,
            }
            datapersistanceFactory.set('ASCPastvisits', obj);
            $scope.SurgeryDiagnosisObj.CPTCode = item.SurgeryList[0].CPTCode;
            $scope.SurgeryDiagnosisObj.AnesthetistId = item.SurgeryList[0].AnesthetistId;
            $scope.showQuickSummary = false;
            $timeout(() => {
                $scope.showQuickSummary = true;
            }, 10);
            $scope.AllAscPrintServices(item);
        } else {
            $scope.GetPatientAppointmenthistroy(ConsultationId, AppointmentId, $scope.SelectedVisitId);
        }
    }
    function addcachefromservice(item) {

        // cache adding
        $scope.cacheStorageItem.AppointmentId = angular.copy(item.AppointmentId);
        $scope.cacheStorageItem.PatientID = angular.copy(item.PatientId);
        $scope.cacheStorageItem.PatientName = item.PatientFullName || "";
        $scope.cacheStorageItem.PatientDisplayId = item.PatientDisplayId || "";
        $scope.cacheStorageItem.AppointmentVisitReasonName = item.AppointmentVisitReasonName || "";
        $scope.cacheStorageItem.VisitReason = item.AppointmentVisitReasonName || "";
        $scope.cacheStorageItem.AppointmentDate = item.AppointmentDateview || "";
        $scope.cacheStorageItem.AppointmentTime = item.StartTime || "";
        $scope.cacheStorageItem.PatientDOB = item.DOB || "";
        item.SurgeryList = item.SurgeryList || [];
        if (item.SurgeryList.length > 0) {
            $scope.cacheStorageItem.DoctorID = item.SurgeryList[0].SurgeonId || "";
        }
        $scope.cacheStorageItem.Gender = item.Sex || "";
        var PatientMonth = ''
        if (item.AgeInMonths != 0) {
            var PatientMonth = item.AgeInMonths + 'M';
        }
        $scope.cacheStorageItem.Age = item.AgeInYears + 'Y' + ' ' + PatientMonth;
        $scope.AddToCache();
    }
    $scope.GetOpthaPatientCaseHistory = function () {
        $scope.CaseHistory = [];
        var AppointmentTypeIds = null;
        AppointmentTypeIds = "1,2,3,5,6,8,9,10,4,7,14";

        if ($scope.SelectedChartObj.PatientID == undefined || $scope.SelectedChartObj.PatientID == '' || $scope.SelectedChartObj.PatientID == null) {
            $scope.SelectedChartObj.PatientID = null
        }
        //var object = {
        //    "PatientID": $scope.SelectedChartObj.PatientID != null ? $scope.SelectedChartObj.PatientID : appoint_info.PatientID,
        //    "HospitalID": $scope.HospitalId,
        //    "AppointmentTypeIds": AppointmentTypeIds
        //};
        //eHnotePatientDataService.GetAppointmentsForCaseHistory(object).then(function (resp) {
        //    if (resp.data !== undefined) {
        //        if (resp.data.length > 0) {
        //            $scope.CaseHistory = resp.data || [];
        //        }
        //    }
        //    if (resp.data.status === "Failure") {
        //        alertify.error("Getting Casehistory Failed");
        //        return;
        //    }
        //}, function (err) {
        //    alertify.error("Getting Casehistory Failed");
        //    $scope.CaseHistory = [];
        //});

        var CurrentDate = $filter('date')(new Date(), "yyyy-MM-dd");
        if (!$scope.SelectedChartObj.PatientID &&!$scope.cacheStorageItem.PatientID) {
            $scope.SelectedChartObj.PatientID = appoint_info.PatientID;
        }
        var obj1 = {
            "PatientId": $scope.SelectedChartObj.PatientID != null ? $scope.SelectedChartObj.PatientID : $scope.cacheStorageItem.PatientID,
            "OrganizationId": $scope.HospitalId,
            "UpcomingVisitsIndicator": false,
            "CurrentDate": CurrentDate,
            "AllBranchInd": "Y",
            "AppointmentStatusIds": "1,2,3,4,5,6,7,8,9,10,11",
        }
        eHnotePatientVisitReasonServices.GetPatientAppointmentVisitsById(obj1).then(function (resp) {
            if (resp.data.Status == "Success") {
                $scope.VisitsArray = [];
                $scope.AllVisitsArray = resp.data.rows || [];
                //$scope.AllVisitsArray = ($scope.AllVisitsArray || []).filter(visit => [2, 3, 4].includes(visit.CheckinStatusId) && ![5, 6, 7, 8, 9, 10, 11].includes(visit.AppointmentStatusId));
                $scope.AllVisitsArray = ($scope.AllVisitsArray || []).filter(visit => [2, 3, 4].includes(visit.AppointmentStatusId));
                $scope.AllVisitsArray.forEach(function (item) {
                    const hasVisits = item.VisitsArray && item.VisitsArray.length > 0;
                    item.isActive = hasVisits ? item.VisitsArray.some(visitItem => visitItem.VisitId === $scope.SelectedVisitId) : item.AppointmentId === $scope.SelectedAppointmentId;
                    if (hasVisits && item.isActive) {
                        item.VisitsArray.forEach((inItem, index) => {
                            inItem.isSelected = (index === 0);
                        });
                    }
                    item.showAll = false;
                    item.AppointmentDateview = angular.copy(item.AppointmentDate);
                    item.AppointmentDate = item.AppointmentDate ? $filter('date')(item.AppointmentDate, 'MMM d') : '';
                    
                });
                if ($scope.AllVisitsArray.length > 0) {
                    angular.forEach($scope.AllVisitsArray, function (Mitem) {
                        if (Mitem.VisitsArray.length > 0 && Mitem.StatusFlag !== 'R' && Mitem.StatusFlag !== 'C') {
                            angular.forEach(Mitem.VisitsArray, function (vitem) {
                                $scope.VisitsArray.push(vitem);
                            })
                        }
                        angular.forEach(Mitem.VisitsArray, function (subitem) {
                            subitem.IsVisitSignedDone = false;
                            //if (Mitem.AppointmentTypeId == 1) {
                            //    if (subitem.VisitStatus == 'E') {
                            //        subitem.IsVisitSignedDone = true;
                            //    }
                            //} else if (Mitem.AppointmentTypeId == 7 && Mitem.StatusFlag == 'D') {
                            //    subitem.IsVisitSignedDone = true;
                            //}
                            if (Mitem.AppointmentTypeId !== 4 && Mitem.AppointmentTypeId !== 14 && Mitem.AppointmentTypeId !== 7) {
                                if (subitem.OPChartStatus == 'E') {
                                    subitem.IsVisitSignedDone = true;
                                }
                            }
                            else if (Mitem.AppointmentTypeId == 7 && Mitem.StatusFlag == 'D') {
                                subitem.IsVisitSignedDone = true;
                            } else if ((Mitem.AppointmentTypeId == 4 || Mitem.AppointmentTypeId == 14) && Mitem.OperativeChartStatus == 'E') {
                                subitem.IsVisitSignedDone = true;
                            } else {

                            }
                        });
                    });

                    let activeAscSurgeryVisit = $scope.AllVisitsArray.find(item => item.isActive === true && (item.AppointmentTypeId === 4 || item.AppointmentTypeId === 14));
                    if (activeAscSurgeryVisit) {
                        // Active ASC Surgery appointment 
                        $scope.ChangesConsultation(activeAscSurgeryVisit);
                    } else {
                        // If no active ASC Surgery, check for any active visit
                        let anyActiveVisit = $scope.AllVisitsArray.find(item => item.isActive === true);
                        if (anyActiveVisit) {
                            $scope.ChangesConsultation(anyActiveVisit);
                        } else if ($scope.AllVisitsArray.length > 0) {
                            // If no active visits at all, default to the first item
                            $scope.ChangesConsultation($scope.AllVisitsArray[0]);
                        }
                    }
                }
            }
        }, function (err) {

        });
    };
    $scope.toggleShowAllVisits = function (mitem) {
        mitem.showAll = !mitem.showAll;
    };
    $scope.getDayOnly = function (dateString) {
        if (!dateString) return '';
        var match = dateString.match(/\d+/);
        return match ? match[0] : '';
    };
    $scope.GetOpthaPatientCaseHistory();

    $scope.selectedAppointmentVisit = function (mitem, item, $event) {
        $scope.SelectedAppointmentId = item.AppointmentId;
        $scope.SelectedVisitId = item.VisitId || 0;
        if ($event) {
            $event.stopPropagation();
        }
        $scope.AllVisitsArray.forEach(visit => {
            visit.isActive = (visit.AppointmentId === mitem.AppointmentId);
            if (visit.VisitsArray && visit.VisitsArray.length > 0) {
                visit.VisitsArray.forEach((inVisit, index) => {
                    inVisit.isSelected = (visit.AppointmentId === mitem.AppointmentId && inVisit.VisitId === item.VisitId);
                });
            }
        });
        let AppointmentId = mitem.AppointmentId;
        let SelectedVisitId = item.VisitId;
        let ConsultationId = item.VisitId;
        $scope.cacheStorageItem.selectedApptObj = angular.copy(mitem);
        $scope.cacheStorageItem.AppointmentTypeId = angular.copy(mitem.AppointmentTypeId);
        $scope.cacheStorageItem.AppointmentId = angular.copy(mitem.AppointmentId);
        $scope.cacheStorageItem.PatientID = angular.copy(mitem.PatientId);
        $scope.cacheStorageItem.PatientName = mitem.PatientName || "";
        $scope.cacheStorageItem.PatientDisplayId = mitem.PatientDisplayId || "";
        $scope.cacheStorageItem.PatientDOB = mitem.DOB || "";
        $scope.cacheStorageItem.Gender = mitem.Sex || "";
        $scope.cacheStorageItem.AppointmentVisitReasonName = mitem.AppointmentVisitReasonName || "";
        $scope.cacheStorageItem.VisitReason = mitem.AppointmentVisitReasonName || "";
        $scope.cacheStorageItem.AppointmentDate = mitem.AppointmentDateview || "";
        $scope.cacheStorageItem.AppointmentTime = mitem.StartTime || "";
       
        $scope.AddToCache();
        $scope.IsitAscSurgeryApptInd = (mitem.AppointmentTypeId == 4 || mitem.AppointmentTypeId == 14) ? true : false;
        if ($scope.IsitAscSurgeryApptInd) {

            let obj = {
                "SubTab": (mitem.AppointmentTypeId == 4 || mitem.AppointmentTypeId == 14) ? 7 : 2,
                "AppointmentTypeId": mitem.AppointmentTypeId,
                "AppointmentId": mitem.AppointmentId,
                "SurgeryList": mitem.SurgeryList || [],
                "PatientID": mitem.PatientId || 0,
            }
            datapersistanceFactory.set('ASCPastvisits', obj);

            $scope.showQuickSummary = false;
            $timeout(() => {
                $scope.showQuickSummary = true;
            }, 10);
            $scope.AllAscPrintServices(item);
        } else {
            $scope.GetPatientAppointmenthistroy(ConsultationId, AppointmentId, $scope.SelectedVisitId);
        }
    }
    $scope.MasterTestUsedlist = [];
    $scope.DocumentTypeArray = [];
    $scope.GetAssSeverityList = [];
    $scope.Modalities = [];
    function initializeMasterData() {
        eHnoteDiagnosisDataServices.GetAllMasterConsultationData().then(function (resp) {
            if (resp.data.status ==="Success") {
                $scope.MasterTestUsedlist = resp.data.MasterTestUsedArray || [];
                if (resp.data.MasterNoteFileTypes.length > 0) {
                    angular.forEach(resp.data.MasterNoteFileTypes, function (item) {
                        var obj = {
                            "Id": item.FileTypeId,
                            "Name": item.Filetype,
                            "IsChecked": true
                        };
                        $scope.DocumentTypeArray.push(obj);
                    });
                }
                if (resp.data.CheifComplaintSeverity.length > 0) {
                    $scope.GetAssSeverityList = resp.data.CheifComplaintSeverity || [];
                }
                if (resp.data.Modalities.length > 0) {
                    $scope.Modalities = resp.data.Modalities || [];
                }
            }
        }, function (error) {
            alertify.error(error);
        })
    }
    initializeMasterData()
    function generateAscSummaryPrintPdf() {
        if (!$scope.AllAscPrintObj.IsAdmitPrintInd && !$scope.AllAscPrintObj.IsPreopPrintInd && !$scope.AllAscPrintObj.IsPreopAnesthesiaPrintInd && !$scope.AllAscPrintObj.IsPreopChecklistPrintInd && !$scope.AllAscPrintObj.IsIntraopPrintInd && !$scope.AllAscPrintObj.IsIntraopCheckinChecklistPrintInd && !$scope.AllAscPrintObj.IsIntraopAnesthesiaPrintInd && !$scope.AllAscPrintObj.IsIntraopChecklistPrintInd && !$scope.AllAscPrintObj.IsPostopPrintInd && !$scope.AllAscPrintObj.IsPostopChecklistPrintInd && !$scope.AllAscPrintObj.IsPostopAnesthesiaPrintInd && !$scope.AllAscPrintObj.IsOperativeNotesPrintInd && !$scope.AllAscPrintObj.IsDischargeSummaryPrintInd && !$scope.AllAscPrintObj.IsFemtoPrintInd && !$scope.AllAscPrintObj.IsDoctorNotesPrintInd) {
            alertify.error("Please select print");
            return;
        }
        let req = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": $scope.SelectedAppointmentId || null,
            "PatientId": $scope.SelectedPatientId || null
        };
        $q.all([
            eHnoteSurgeryService.GetpatientAscSummary(req),
            /* Pre-Op Surgeon Orders saved from Admit - only needed when Admit is printed */
            $scope.AllAscPrintObj.IsAdmitPrintInd ? eHnoteSurgeryService.GetASCAdmissionDetails({ "AppointmentId": req.AppointmentId || 0 }).then(null, function () { return null; }) : $q.when(null),
        ]).then(function (resp) {
            if (resp[0].data.Status === "Success") {
                //Showing Loader
                $rootScope.$broadcast("loader_show");
                $("#maineHnoteLoader").show();
                $scope.maineHnoteLoader = true;
                $rootScope.mainsubeHnoteLoader = true;
                // for intraop Graph Generation
                if (resp[0].data.IntraOP.length > 0) {
                    let S3URL = resp[0].data.IntraOP[0].S3URL || '';
                    var base64Img = '';

                    if (S3URL !== '') {
                        $scope.toDataURL(S3URL, function (dataURL) {
                            base64Img = dataURL;
                            resp[0].data.IntraOP[0].BaseURL = base64Img;
                            proceedToAscOverallPrintIntial(resp);
                        });
                    } else {
                        resp[0].data.IntraOP[0].BaseURL = base64Img;
                        proceedToAscOverallPrintIntial(resp);
                    }
                }
                else {
                    proceedToAscOverallPrintIntial(resp);
                }
            }            
        });
    }
    function proceedToAscOverallPrintIntial(resp) {
        // post op graph
        if (resp[0].data.PostOP.length > 0) {
            let S3URL = resp[0].data.PostOP[0].S3URL || '';
            var base64Img = '';
            if (S3URL !== '') {
                $scope.toDataURL(S3URL, function (dataURL) {
                    base64Img = dataURL;
                    resp[0].data.PostOP[0].BaseURL = base64Img;
                    proceedToAscOverallPrintWithOrganizationLogo(resp);
                });
            } else {
                resp[0].data.PostOP[0].BaseURL = base64Img;
                proceedToAscOverallPrintWithOrganizationLogo(resp);
            }
        } else {
            proceedToAscOverallPrintWithOrganizationLogo(resp);
        }
    }

    function proceedToAscOverallPrintWithOrganizationLogo(resp) {
        // Organization Detials
        const orgDetails = resp?.[0]?.data?.OrganizationDetails || [];

        if (orgDetails.length > 0) {
            const S3URL = orgDetails[0]?.OrganizationLogoUrl || '';

            if (S3URL) {
                // Convert logo to Base64
                $scope.toDataURL(S3URL, function (dataURL) {
                    orgDetails[0].OrganizationLogoUrl = dataURL;
                    proceedToAscOverallPrint(resp);
                });
            } else {
                // No logo URL
                orgDetails[0].OrganizationLogoUrl = "";
                proceedToAscOverallPrint(resp);
            }
        } else {
            // No organization details
            proceedToAscOverallPrint(resp);
        }
    }

    function proceedToAscOverallPrint(resp) {
        let AdmitSurgeonOrders = USPrintService.GetAdmitSurgeonOrdersFromAdmission(resp[1] && resp[1].data && resp[1].data.status === "Success" ? resp[1].data : null, $scope.allUserList);
            $scope.CurrentAppointmentVital = resp[0].data.CurrentAppointmentVital || {};
            $scope.SurgeryDiagnosisObj.SurgeryList = resp[0].data.SurgeryList || [];
            $scope.Fluids = resp[0].data.PreOP[0] || [];
            $scope.Supplyitems = resp[0].data.IntraOP[0] || [];
            $scope.PhacoMachinesiarray = resp[0].data.IntraOP[0] || [];
            $scope.postopdataarray = resp[0].data.PostOP[0] || [];
            $scope.AppointmentBranch = resp[0].data.BranchId;
            $scope.AscPostOp.OxygenQuantity = $scope.postopdataarray.OxygenQuantity || null;
            $scope.AscPostOp.OxygenType = $scope.postopdataarray.OxygenType || null;



            $scope.AscIntraop.PhacoMachines = $scope.PhacoMachinesiarray.PhacoMachines || [];
            $scope.AscIntraop.LotNumber = $scope.Supplyitems.LotNumber || null;
            $scope.AscIntraop.SurgicalSupplyName = $scope.Supplyitems.SurgicalSupplyName || null;
            $scope.AscPreopObj.IVSiteFluids = $scope.Fluids.IVSiteFluids || null;
            $scope.AscPreopObj.IVSiteFlush = $scope.Fluids.IVSiteFlush || null;
            $scope.AscPreopObj.IVSiteLactatedRingers = $scope.Fluids.IVSiteLactatedRingers || null;

            if ($scope.AscPreopObj.IVSiteFluids !== null) {
                let FluidsArray = $filter('filter')($scope.AscPreopObj.IVSiteFluidsArray, { 'IVSiteMarkingId': $scope.AscPreopObj.IVSiteFluids }, true) || [];
                if (FluidsArray.length > 0) {
                    $scope.AscPreopObj.IVSiteFluidsName = FluidsArray[0].IVSiteMarkingName || '';
                };
            };
            if ($scope.AscPreopObj.IVSiteFlush !== null) {
                let FlushArray = $filter('filter')($scope.AscPreopObj.IVSiteFlushArray, { 'IVSiteMarkingId': $scope.AscPreopObj.IVSiteFlush }, true) || [];
                if (FlushArray.length > 0) {
                    $scope.AscPreopObj.IVSiteFlushName = FlushArray[0].IVSiteMarkingName || '';
                };
            };
            if ($scope.AscPreopObj.IVSiteLactatedRingers !== null) {
                let LactatedArray = $filter('filter')($scope.AscPreopObj.IVSiteLRArray, { 'IVSiteMarkingId': $scope.AscPreopObj.IVSiteLactatedRingers }, true) || [];
                if (LactatedArray.length > 0) {
                    $scope.AscPreopObj.IVSiteLactatedRingersName = LactatedArray[0].IVSiteMarkingName || '';
                };
            };

            if ($scope.SurgeryDiagnosisObj.SurgeryList.length > 0) {
                angular.forEach($scope.SurgeryDiagnosisObj.SurgeryList, function (item) {

                    $scope.SurgeryDiagnosisObj.ExternalCoManagerId = item.ExternalCoManagerId || null;
                    $scope.SurgeryDiagnosisObj.ExternalCoManager = item.ExternalCoManagerName || '';

                    $scope.SurgeryDiagnosisObj.InternalCoManagerId = item.InternalCoManagerId || null;
                    item.InternalCoManagerId = item.InternalCoManagerId || '';
                    if (item.InternalCoManagerId != '') {
                        let temparray = $filter('filter')($scope.allUserList, { 'DoctorID': item.InternalCoManagerId }, true);
                        if (temparray.length > 0) {
                            $scope.SurgeryDiagnosisObj.InternalCoManager = temparray[0].FullName;
                            temparray[0].SuffixName = temparray[0].SuffixName || '';
                            if (temparray[0].SuffixName !== '') {
                                $scope.SurgeryDiagnosisObj.InternalCoManager = $scope.SurgeryDiagnosisObj.InternalCoManager + ' ' + temparray[0].SuffixName;
                            }
                        } else {
                            $scope.SurgeryDiagnosisObj.InternalCoManager = "";
                        }
                    }
                });
            }

            let Surgeonlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.cacheStorageItem.DoctorID }, true) || [];
            if (Surgeonlist.length > 0) {
                $scope.SurgeryDiagnosisObj.SurgeonName = Surgeonlist[0].UserFullName;
                //if (Surgeonlist[0].SuffixId == 10) {
                //    $scope.SurgeryDiagnosisObj.SurgeonName = ' Dr. ' + $scope.SurgeryDiagnosisObj.SurgeonName;
                //}
                //if (Surgeonlist[0].SuffixName !== '') {
                //    $scope.SurgeryDiagnosisObj.SurgeonName = $scope.SurgeryDiagnosisObj.SurgeonName + ' ' + Surgeonlist[0].SuffixName;
                //}
            } else {
                $scope.SurgeryDiagnosisObj.SurgeonName = '';
            }
            let Anesthetist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.SurgeryDiagnosisObj.AnesthetistId }, true) || [];
            if (Anesthetist.length > 0) {
                $scope.SurgeryDiagnosisObj.AnesthesistName = Anesthetist[0].UserFullName;
            } else {
                $scope.SurgeryDiagnosisObj.AnesthesistName = '';
            }

            $scope.ReviewedByanethelogist = [];
            if ($scope.allUserList.length > 0) {
                $scope.ReviewedByanethelogist = $scope.allUserList.filter((x) => x.RoleId == 30);
            }
            else {
                $scope.ReviewedByanethelogist = [];
            }

            var DiagnosisName = '';
            var AdditionalSurgeryName = '';
            if ($scope.SurgeryDiagnosisObj.SurgeryList.length > 0) {
                $scope.SurgeryDiagnosisObj.SurgeryList[0].DiagnosisList = $scope.SurgeryDiagnosisObj.SurgeryList[0].DiagnosisList || [];
                if ($scope.SurgeryDiagnosisObj.SurgeryList[0].DiagnosisList.length > 0) {
                    angular.forEach($scope.SurgeryDiagnosisObj.SurgeryList[0].DiagnosisList, function (sitem) {
                        var IcdCode = '';
                        sitem.ICDCode = sitem.ICDCode || '';
                        if (sitem.ICDCode !== '') {
                            IcdCode = sitem.ICDCode;
                        }
                        DiagnosisName += "," + IcdCode + '-' + sitem.DiagnosisName;
                    });
                    if (DiagnosisName.charAt(0) === ",") {
                        DiagnosisName = DiagnosisName.slice(1);
                    }
                } else {
                    DiagnosisName = '';
                }

                var Description = "";
                $scope.SurgeryDiagnosisObj.SurgeryList[0].AdditionalSurgery = $scope.SurgeryDiagnosisObj.SurgeryList[0].AdditionalSurgery || [];
                if ($scope.SurgeryDiagnosisObj.SurgeryList[0].AdditionalSurgery.length > 0) {
                    angular.forEach($scope.SurgeryDiagnosisObj.SurgeryList[0].AdditionalSurgery, function (sitem) {

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
                    AdditionalSurgeryName = Description;
                }
            }

            var Organ = '';
            var OrganId = '';
            if ($scope.SurgeryDiagnosisObj.SurgeryList.length > 0) {
                OrganId = $scope.SurgeryDiagnosisObj.SurgeryList[0].OrganId || '';
                if (OrganId !== '' && OrganId !== null) {
                    if (OrganId == 1) {
                        Organ = "OD";
                    } else if (OrganId == 2) {
                        Organ = "OS";
                    } else if (OrganId == 3) {
                        Organ = "OU";
                    } else if (OrganId == 4) {
                        Organ = "General";
                    }
                }
            }
            if ($scope.SurgeryDiagnosisObj.SurgeryList.length > 0) {
                $scope.SurgeryDiagnosisObj.SurgeryEyeStatusId = $scope.SurgeryDiagnosisObj.SurgeryList[0].SurgeryEyeStatusId || 0;
                $scope.SurgeryDiagnosisObj.SurgeryEyeStatusName = $scope.SurgeryDiagnosisObj.SurgeryList[0].SurgeryEyeStatusName || '';
                //$scope.SurgeryDiagnosisObj.CPTCode = $scope.SurgeryDiagnosisObj.SurgeryList[0].CPTCode;
                $scope.SurgeryDiagnosisObj.SurgeryName = $scope.SurgeryDiagnosisObj.SurgeryList[0].SurgeryName;
                $scope.SurgeryDiagnosisObj.OrganId = $scope.SurgeryDiagnosisObj.SurgeryList[0].OrganId || "";
                $scope.SurgeryDiagnosisObj.AscAppointmentDate = $scope.SurgeryDiagnosisObj.SurgeryList[0].AscAppointmentDate;
                $scope.SurgeryDiagnosisObj.FirstFollowupDate = $scope.SurgeryDiagnosisObj.SurgeryList[0].FirstFollowupDate;
                $scope.SurgeryDiagnosisObj.SecondFollowupDate = $scope.SurgeryDiagnosisObj.SurgeryList[0].SecondFollowupDate;
                $scope.SurgeryDiagnosisObj.ThirdFollowupDate = $scope.SurgeryDiagnosisObj.SurgeryList[0].ThirdFollowupDate;
            }
            let vitalarray = [];
            vitalarray = resp[0].data.VitalsArray || [];

            $scope.PreopAnesthesiavitalarray = [];
        if (vitalarray.length > 0) {
            angular.forEach(vitalarray, function (item) {
                if (item.VitalAddTime) {
                    let ndate = moment().format("YYYY-MM-DD");
                    let edate = ndate + " " + item.VitalAddTime;
                    item.VitalAddTime = moment(edate, "YYYY-MM-DD HH:mm").format("hh:mm A");
                }
            });
            $scope.PreopAnesthesiavitalarray = $filter('filter')(vitalarray, { "TypeId": 2 }, true) || [];
        }
            //if (vitalarray.length > 0) {
            //    vitalarray = $filter('filter')(vitalarray, { "TypeId": 7 }, true) || [];
            //}

            //if (vitalarray.length > 0) {
            //    angular.forEach(vitalarray, function (item) {
            //        item.IsAdmitVitalInd = true;
            //    });
            //}

            $scope.AllAscPrintObj.AllergyItems = resp[0].data.AllergyItems || [];
            $scope.AllAscPrintObj.SystemicHistory = resp[0].data.SystemicHistory || [];
            $scope.AllAscPrintObj.LifestyleDetail = resp[0].data.LifestyleDetail || [];

            $scope.AllAscPrintObj.AllergyRemarks = resp[0].data.AllergyRemarks || '';
            $scope.AllAscPrintObj.SurgicalRemarks = resp[0].data.SurgicalRemarks || '';
            $scope.AllAscPrintObj.CurrentEyeRemarks = resp[0].data.CurrentEyeRemarks || '';
            $scope.AllAscPrintObj.CurrentSystemicRemarks = resp[0].data.CurrentSystemicRemarks || '';
            $scope.AllAscPrintObj.SystemicHistoryRemarks = resp[0].data.SystemicHistoryRemarks || '';
            $scope.AllAscPrintObj.LifestyleHistoryRemarks = resp[0].data.LifestyleHistoryRemarks || '';
            $scope.AllAscPrintObj.RespiratoryRemarks = resp[0].data.RespiratoryRemarks || '';


            var LifestyleDetail = [];
            if ($scope.AllAscPrintObj.LifestyleDetail.length > 0) {
                if ($scope.AllAscPrintObj.LifestyleDetail[0].AlcoholType !== '' || $scope.AllAscPrintObj.LifestyleDetail[0].DrugType !== '' || $scope.AllAscPrintObj.LifestyleDetail[0].SmokingType !== '' || $scope.AllAscPrintObj.LifestyleDetail[0].PsychisType !== '' || $scope.AllAscPrintObj.LifestyleDetail[0].Remarks !== '') {
                    LifestyleDetail = angular.copy($scope.AllAscPrintObj.LifestyleDetail);
                }
            } else {
                LifestyleDetail = [];
            }

            var SystemicHistoryArray = [];
            if ($scope.AllAscPrintObj.SystemicHistory.length > 0) {
                angular.forEach($scope.AllAscPrintObj.SystemicHistory, function (item) {
                    if (item.TypeId !== 19) {
                        SystemicHistoryArray.push(item)
                    };
                });
            } else {
                SystemicHistoryArray = [];
            }

            $scope.AllAscPrintObj.SurgicalHistory = resp[0].data.SurgicalHistory || [];
            //$scope.AllAscPrintObj.CurrentSystemicMedicationList = resp[0].data.CurrentSystemicMedicationList || [];
            //$scope.AllAscPrintObj.CurrentEyeMedicationList = resp[0].data.CurrentEyeMedicationList || [];

            let systemiclist = $filter('filter')(resp[0].data.CurrentSystemicMedicationList, { 'MedicationLocationTypeId': 1 }, true) || [];
            if (systemiclist.length > 0) {
                $scope.AllAscPrintObj.CurrentEyeMedicationList = angular.copy(systemiclist);
            }

            //$scope.AllAscPrintObj.CurrentEyeMedicationList = resp[0].data.CurrentEyeMedicationList || [];
            let systemiceyelist = $filter('filter')(resp[0].data.CurrentSystemicMedicationList, { 'MedicationLocationTypeId': 2 }, true) || [];
            if (systemiceyelist.length > 0) {
                $scope.AllAscPrintObj.CurrentSystemicMedicationList = angular.copy(systemiceyelist);
            }


            $scope.AllAscPrintObj.ReconcileMedicationList = [];
            if ($scope.AllAscPrintObj.CurrentEyeMedicationList.length > 0) {
                $scope.AllAscPrintObj.ReconcileMedicationList = $scope.AllAscPrintObj.ReconcileMedicationList.concat($scope.AllAscPrintObj.CurrentEyeMedicationList);
            }
            if ($scope.AllAscPrintObj.CurrentSystemicMedicationList.length > 0) {
                $scope.AllAscPrintObj.ReconcileMedicationList = $scope.AllAscPrintObj.ReconcileMedicationList.concat($scope.AllAscPrintObj.CurrentSystemicMedicationList);
            }
            let MedicalRecon = $filter('filter')(resp[0].data.CurrentSystemicMedicationList, function (item) { return item.MedicationLocationTypeId === 1 || item.MedicationLocationTypeId === 2 }, true) || [];
            $scope.BeforeAnesthesiaChecklist = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 7 }, true) || [];
            
            $scope.ConvertDate = function (Data) {
                if (Data.length > 0) {
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1; // January is 0!
                    var yyyy = today.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    today = yyyy + '/' + mm + '/' + dd;
                    var date2 = new Date(today);

                    angular.forEach(Data, function (item) {
                        item.MedicationResumeDate = item.MedicationResumeDate || null;
                        if (item.MedicationResumeDate != null) {
                            var todate = $filter('date')(item.MedicationResumeDate, "yyyy/MM/dd");
                            var date1 = new Date(todate);
                            var timeDiff = date1.getTime() - date2.getTime();
                            var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
                            item.StartDuration = dayDifference;
                            item.StartMessage = `Continue using ${item.MedicineName} ${Math.abs(dayDifference)} days after the surgery.`;
                        }
                    });
                }
            };

            if ($scope.AllAscPrintObj.ReconcileMedicationList.length > 0) {
                $scope.ConvertDate($scope.AllAscPrintObj.ReconcileMedicationList);
            }

            $scope.CreatedByName = "";
            if ($scope.doctorinfo.doctordata.User.length > 0) {
                if ($scope.doctorinfo.doctordata.User[0].Suffix !== '') {
                    $scope.CreatedByName = $scope.doctorinfo.doctordata.User[0].FullName + ' ' + $scope.doctorinfo.doctordata.User[0].Suffix || "";
                } else {
                    $scope.CreatedByName = $scope.doctorinfo.doctordata.User[0].FullName || "";
                }
            }

            $scope.PhysicalEvaluationArray = resp[0].data.PhysicalEvaluationDetails || [];

            /* Preadmission details */
            let Preadmindex = resp[0].data.PreAdmissionDetails.length;

            if (resp[0].data.PreAdmissionDetails.length > 0) {
                $scope.PreAdmissionDetails = angular.copy(resp[0].data.PreAdmissionDetails[0]);

                $scope.PreAdmissionDetails.PhysicalNeurologicNotes = $scope.PreAdmissionDetails.PhysicalNeurologicNotes || '';
                $scope.PreAdmissionDetails.PhysicalGeneralNotes = $scope.PreAdmissionDetails.PhysicalGeneralNotes || '';
                $scope.PreAdmissionDetails.PhysicalCardiocNotes = $scope.PreAdmissionDetails.PhysicalCardiocNotes || '';
                $scope.PreAdmissionDetails.PhysicalHepaticNotes = $scope.PreAdmissionDetails.PhysicalHepaticNotes || '';
                $scope.PreAdmissionDetails.PhysicalPulmonaryNotes = $scope.PreAdmissionDetails.PhysicalPulmonaryNotes || '';

                $scope.PreAdmissionDetails.LastDialysisDate = $scope.PreAdmissionDetails.LastDialysisDate || null;
                if ($scope.PreAdmissionDetails.LastDialysisDate !== null) {
                    $scope.PreAdmissionDetails.LastDialysisDate = moment($scope.PreAdmissionDetails.LastDialysisDate).format("MM-DD-YYYY");
                };

                var ECGObj = {
                    "ECG": $scope.PreAdmissionDetails.CardioVascular.CardioECG || "",
                    "ECGUnits": $scope.PreAdmissionDetails.CardioVascular.CardioECGUnits || "",
                    "Notes": $scope.PreAdmissionDetails.CardioVascular.CardioNotes || "",
                }
                $scope.PreAdmissionDetails.ECGObj = angular.copy(ECGObj);

                // Assessment ASA section
                const preAdmissionDetails = {
                    "Value": $scope.PreAdmissionDetails.AssessmentsASA.Value || "",
                    "Notes": $scope.PreAdmissionDetails.AssessmentsASA.Notes || "",
                    "EValue": $scope.PreAdmissionDetails.AssessmentsASA.EValue || "",
                    "ENotes": $scope.PreAdmissionDetails.AssessmentsASA.ENotes || "",
                    "IsEmergency": $scope.PreAdmissionDetails.AssessmentsASA.IsEmergency || false,
                };

                $scope.PreAdmissionDetails.ASAObj = null;
                $scope.PreAdmissionDetails.ASAObj = angular.copy(preAdmissionDetails);
                $scope.PreAdmissionDetails.ASAClassificationNotes = $scope.PreAdmissionDetails.ASAClassificationNotes || "";

                $scope.PreAdmissionDetails.AnesthesiaPlan.IsRisksbenefitsAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsRisksbenefitsAnesthesia || false;
                $scope.PreAdmissionDetails.AnesthesiaPlan.IsAnestheticplan = $scope.PreAdmissionDetails.AnesthesiaPlan.IsAnestheticplan || false;

                let tempAnesthesiaTypeList = angular.copy($scope.PreAdmissionDetails.AnesthesiaTypelist) || [];

                if (tempAnesthesiaTypeList.length > 0) {
                    angular.forEach(tempAnesthesiaTypeList, function (kitem) {
                        kitem.IsSelected = false;
                    });

                    angular.forEach(tempAnesthesiaTypeList, function (item) {
                        angular.forEach($scope.PostopAnesthesiaList, function (kitem) {
                            if (kitem.AnesthesiaTypeId === item.AnesthesiaTypeId) {
                                kitem.IsSelected = true;
                            }
                        });
                    });
                } else {
                    angular.forEach(tempAnesthesiaTypeList, function (kitem) {
                        kitem.IsSelected = false;
                    });
                }

                var anesthesiaTypeList = [];
                if ($scope.PostopAnesthesiaList.length > 0) {
                    anesthesiaTypeList = $filter('filter')($scope.PostopAnesthesiaList, { 'IsSelected': true }, true);
                } else {
                    anesthesiaTypeList = [];
                }

                $scope.PreAdmissionDetails.AnesthetistName = "";
                if ($scope.PreAdmissionDetails.AnesthesiaPlan.AnesPlanAnesthetistId != null) {
                    let tempArray = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmissionDetails.AnesthesiaPlan.AnesPlanAnesthetistId }, true) || [];
                    if (tempArray.length > 0) {
                        $scope.PreAdmissionDetails.AnesthetistName = tempArray[0].UserFullName;
                        var License = '';
                        //var Suffix = '';
                        //if (tempArray[0].SuffixName !== '') {
                        //    Suffix = tempArray[0].SuffixName + ',';
                        //}
                        if (tempArray[0].LicenseNumber !== '') {
                            License = 'Lic: ' + tempArray[0].LicenseNumber + ',';
                        }
                        $scope.PreAdmissionDetails.AnesthetistName = $scope.PreAdmissionDetails.AnesthetistName + ' ' + License;
                        //if (tempArray[0].SuffixId == 10) {
                        //    $scope.PreAdmissionDetails.AnesthetistName = ' Dr. ' + $scope.PreAdmissionDetails.AnesthetistName + ' ' + Suffix + ' ' + License;
                        //} else {
                        //    $scope.PreAdmissionDetails.AnesthetistName = $scope.PreAdmissionDetails.AnesthetistName + ' ' + Suffix + ' ' + License;
                        //}
                    }
                }

                $scope.PreAdmissionDetails.ReviewedDate = $filter('date')($scope.PreAdmissionDetails.AnesthesiaReviewedDate, 'MM-dd-yyyy hh:mm a') || "";
                $scope.PreAdmissionDetails.AnesthetistReviewedDate = $filter('date')($scope.PreAdmissionDetails.AnesthetistReviewedDate, 'MM-dd-yyyy hh:mm a') || "";
                $scope.PreAdmissionDetails.AnesthesiologistReviewedDate = $filter('date')($scope.PreAdmissionDetails.AnesthesiologistReviewedDate, 'MM-dd-yyyy hh:mm a') || "";

                var PrescriptionDetails = [];
                $scope.PreAdmissionDetails.Prescription = $scope.PreAdmissionDetails.Prescription || [];
                if ($scope.PreAdmissionDetails.Prescription.length > 0) {
                    angular.forEach($scope.PreAdmissionDetails.Prescription, function (item) {
                        if (item.PrescriptionDetails.length > 0) {
                            PrescriptionDetails.push(item);
                        }
                    });
                } else {
                    PrescriptionDetails = [];
                }

                $scope.PreAdmissionDetails.OrderDetails = $scope.PreAdmissionDetails.OrderDetails || [];

                var AnesthesiaOrdersdata = [];
                AnesthesiaOrdersdata = $filter('filter')($scope.PreAdmissionDetails.OrderDetails, { 'MedTypeId': 7 }, true) || [];

                if ($scope.PreAdmissionDetails.OrderDetails.length > 0) {
                    $scope.PreAdmissionDetails.OrderDetails = $filter('filter')($scope.PreAdmissionDetails.OrderDetails, { 'MedTypeId': 7 }, true) || [];
                }
                $scope.PreAdmissionDetails.Investigationslist = $scope.PreAdmissionDetails.InvestigationsList || [];

                $scope.PreAdmissionDetails.ReviwedBy = $scope.PreAdmissionDetails.ReviwedBy || null;
                if ($scope.PreAdmissionDetails.ReviwedBy != null) {
                    var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmissionDetails.ReviwedBy }, true)[0] || [];
                    $scope.PreAdmissionDetails.AnesthesiaReviewedName = ReviewName.FullName || '';
                    $scope.PreAdmissionDetails.AnesthesiaSuffix = ReviewName.SuffixName + ',' || '';
                    $scope.PreAdmissionDetails.AnesthesiaLicenseNo = ReviewName.LicenseNumber || '';
                    if (ReviewName.SuffixId == 10) {
                        $scope.PreAdmissionDetails.AnesthesiaReviewedName = ' Dr. ' + $scope.PreAdmissionDetails.AnesthesiaReviewedName;
                    }
                } else {
                    $scope.PreAdmissionDetails.AnesthesiaReviewedName = "";
                    $scope.PreAdmissionDetails.AnesthesiaSuffix = "";
                    $scope.PreAdmissionDetails.AnesthesiaLicenseNo = "";
                }

                var HandPLabData = [];
                if ($scope.PreAdmissionDetails.LabInvestigation.length > 0) {
                    angular.forEach($scope.PreAdmissionDetails.LabInvestigation, function (item) {
                        if (item.ResultValue !== '') {
                            if (item.ProcedureId == 506 || item.ProcedureId == 840 || item.ProcedureId == 841 || item.ProcedureId == 842 || item.ProcedureId == 843 || item.ProcedureId == 844 || item.ProcedureId == 845 || item.ProcedureId == 846 || item.ProcedureId == 847 || item.ProcedureId == 848 || item.ProcedureId == 863 || item.ProcedureId == 864 || item.ProcedureId == 865 || item.ProcedureId == 849 || item.ProcedureId == 850 || item.ProcedureId == 851 || item.ProcedureId == 2254) {
                                HandPLabData.push(item);
                            };
                        }
                    });
                } else {
                    HandPLabData = [];
                }

                var AirWayData = $scope.PreAdmissionDetails.Airway || '';
                var ChemistryNotes = $scope.PreAdmissionDetails.Airway.ChemistryNotes || ''

                var SystemicOthersNotesObj = resp[0].data.SystemicOtherData || '';

                var CNSArray = [];
                if ($scope.PreAdmissionDetails.SystemicHistory.length > 0) {
                    angular.forEach($scope.PreAdmissionDetails.SystemicHistory, function (item) {
                        if (item.HistoryId == 115) {
                            CNSArray.push(item)
                        };
                    });
                } else {
                    CNSArray = [];
                }

                var RespiratoryData = [];
                if ($scope.PreAdmissionDetails.SystemicHistory.length > 0) {
                    angular.forEach($scope.PreAdmissionDetails.SystemicHistory, function (item) {
                        if (item.Value !== '') {
                            if (item.HistoryId == 116 || item.HistoryId == 117 || item.HistoryId == 118 || item.HistoryId == 119 || item.HistoryId == 120 || item.HistoryId == 121 || item.HistoryId == 122) {
                                RespiratoryData.push(item)
                            };
                        }
                    });
                } else {
                    RespiratoryData = [];
                }

                if ($scope.PreAdmissionDetails.LabInvestigation.length > 0) {
                    angular.forEach($scope.PreAdmissionDetails.LabInvestigation, function (item) {
                        if (item.ResultValue !== '') {
                            if (item.ProcedureId == 867) {
                                RespiratoryData.push(item)
                            };
                        }
                    });
                }

                var HandPSystemicHistoryArray = [];
                if ($scope.PreAdmissionDetails.SystemicHistory.length > 0) {
                    angular.forEach($scope.PreAdmissionDetails.SystemicHistory, function (item) {
                        if (item.TypeId !== 19) {
                            HandPSystemicHistoryArray.push(item)
                        };
                    });
                } else {
                    HandPSystemicHistoryArray = [];
                }
                var ChemistryArray = [];
                if ($scope.PreAdmissionDetails.LabInvestigation.length > 0) {
                    angular.forEach($scope.PreAdmissionDetails.LabInvestigation, function (item) {
                        if (item.ResultValue !== '') {
                            if (item.ProcedureId == 852 || item.ProcedureId == 853 || item.ProcedureId == 854 || item.ProcedureId == 855 || item.ProcedureId == 856 || item.ProcedureId == 857 || item.ProcedureId == 858 || item.ProcedureId == 859 || item.ProcedureId == 860 || item.ProcedureId == 861 || item.ProcedureId == 862 || item.ProcedureId == 866) {
                                ChemistryArray.push(item)
                            };
                        }
                    });
                } else {
                    ChemistryArray = [];
                }
                var OtherSystemsArray = [];
                if ($scope.PreAdmissionDetails.SystemicHistory.length > 0) {
                    angular.forEach($scope.PreAdmissionDetails.SystemicHistory, function (item) {
                        if (item.TypeId != 19) {
                            OtherSystemsArray.push(item);
                        }
                    });
                } else {
                    OtherSystemsArray = [];
                }

                $scope.PreAdmissionDetails.AnesthesiologistName = "";
                if ($scope.PreAdmissionDetails.AnesthesiaPlan.AnesthesiologistId != null) {
                    let tempArray = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmissionDetails.AnesthesiaPlan.AnesthesiologistId }, true);
                    if (tempArray.length > 0) {

                        //var SuffixName = '';
                        //tempArray[0].SuffixName = tempArray[0].SuffixName || '';
                        //if (tempArray[0].SuffixName != "") {
                        //    SuffixName = tempArray[0].SuffixName;
                        //}

                        var LicenseNumber = "";

                        tempArray[0].LicenseNumber = tempArray[0].LicenseNumber || "";
                        if (tempArray[0].LicenseNumber != "") {
                            LicenseNumber = 'LIC :' + ' ' + tempArray[0].LicenseNumber;
                        }
                        $scope.PreAdmissionDetails.AnesthesiologistName = tempArray[0].UserFullName + ' ' + LicenseNumber;

                        //if (tempArray[0].SuffixId == 10) {
                        //    $scope.PreAdmissionDetails.AnesthesiologistName = ' Dr. ' + tempArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                        //} else {
                        //    $scope.PreAdmissionDetails.AnesthesiologistName = tempArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                        //}
                    }
                }

                if ($scope.PreAdmissionDetails.AnesthesiologistReviewedBy != null) {
                    var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmissionDetails.AnesthesiologistReviewedBy }, true) || [];

                    if (ReviewName.length > 0) {
                        //var SuffixName = '';
                        var LicenseNumber = "";
                        //ReviewName[0].SuffixName = ReviewName[0].SuffixName || '';
                        //if (ReviewName[0].SuffixName != "") {
                        //    SuffixName = ReviewName[0].SuffixName;
                        //}

                        ReviewName[0].LicenseNumber = ReviewName[0].LicenseNumber || "";
                        if (ReviewName[0].LicenseNumber != "") {
                            LicenseNumber = 'LIC :' + ' ' + ReviewName[0].LicenseNumber;
                        }
                        $scope.PreAdmissionDetails.AnesthesiologistReviewedName = angular.copy(ReviewName[0].UserFullName + ' ' + LicenseNumber);
                        //if (ReviewName[0].SuffixId == 10) {
                        //    $scope.PreAdmissionDetails.AnesthesiologistReviewedName = angular.copy('Dr.' + ReviewName[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        //} else {
                        //    $scope.PreAdmissionDetails.AnesthesiologistReviewedName = angular.copy(ReviewName[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        //}
                    }

                } else {
                    $scope.PreAdmissionDetails.AnesthesiologistReviewedName = "";
                }

                //var LifestyleDetail = [];
                //if ($scope.PreAdmissionDetails.LifestyleDetail.length > 0) {
                //    if ($scope.PreAdmissionDetails.LifestyleDetail[0].AlcoholType !== '' || $scope.PreAdmissionDetails.LifestyleDetail[0].DrugType !== '' || $scope.PreAdmissionDetails.LifestyleDetail[0].SmokingType !== '' || $scope.PreAdmissionDetails.LifestyleDetail[0].PsychisType !== '') {
                //        LifestyleDetail = angular.copy($scope.PreAdmissionDetails.LifestyleDetail);
                //    }
                //} else {
                //    LifestyleDetail = [];
                //}
            }

            /* Admit Print - Start */
            let Admitdetailsindex = resp[0].data.PreAdmissionDetails.length;
            if (resp[0].data.AdmitDetails.length > 0) {

                $scope.AdmissionObj = angular.copy(resp[0].data.AdmitDetails[0]);
                $scope.AdmissionObj.CheckLists = $scope.AdmissionObj.CheckLists || [];
                $scope.AdmissionObj.NPOTime = $scope.AdmissionObj.NPOTime || '';
                $scope.AdmissionObj.ReviewedByDateTime = $scope.AdmissionObj.ReviewedByDateTime || '';
                $scope.AdmissionObj.AdmittedByDateTime = $scope.AdmissionObj.AdmittedByDateTime || '';

                if ($scope.AdmissionObj.ReviewedByDateTime) {
                    $scope.AdmissionObj.ReviewedByDateTime = $filter('date')($scope.AdmissionObj.ReviewedByDateTime, 'MM-dd-yyyy hh:mm a') || null;
                }
                if ($scope.AdmissionObj.AdmittedByDateTime) {
                    $scope.AdmissionObj.AdmittedByDateTime = $filter('date')($scope.AdmissionObj.AdmittedByDateTime, 'MM-dd-yyyy hh:mm a') || null;
                }

                var AdmitChecklistData = [];
                if ($scope.AdmissionObj.CheckLists.length > 0) {
                    AdmitChecklistData = $filter('filter')($scope.AdmissionObj.CheckLists, { 'CheckListCategoryId': 17 }, true) || [];
                    angular.forEach(AdmitChecklistData, function (sitem) {
                        if (sitem.CheckListId == 243) {
                            sitem.Time = $scope.AdmissionObj.NPOTime || '';
                        } else {
                            sitem.Time = '';
                        }
                    });
                };

                $scope.AdmissionObj.AccompaniedSignedDateTime = $scope.AdmissionObj.AccompaniedSignedDateTime || null;
                if ($scope.AdmissionObj.AccompaniedSignedDateTime != null) {
                    $scope.AdmissionObj.AccompaniedSignedDateTime = $filter('date')($scope.AdmissionObj.AccompaniedSignedDateTime, "MM-dd-yyyy hh:mm a");
                }
                $scope.AdmitPatientObj = {
                    'RecievedForSurgery': $scope.AdmissionObj.RecievedForSurgery || '',
                    'RecievedForSurgeryNotes': $scope.AdmissionObj.RecievedForSurgeryNotes || '',
                    'AccompainedBy': $scope.AdmissionObj.AccompainedBy || '',
                    'AccompainedByNotes': $scope.AdmissionObj.AccompainedByNotes || '',
                    'AccompaniedSignString': $scope.AdmissionObj.AccompaniedSign || '',
                    'AccompaniedSignedDateTime': $scope.AdmissionObj.AccompaniedSignedDateTime || null,
                    'AccompainedName': $scope.AdmissionObj.AccompainedName || '',
                }

                $scope.initOrgLogo();

                $scope.AdmissionObj.AdmittedBy = $scope.AdmissionObj.AdmittedBy || null;
                if ($scope.AdmissionObj.AdmittedBy != null) {
                    let ndate = moment().format("YYYY-MM-DD");
                    let edate = ndate + " " + $scope.AdmissionObj.AdmissionTime;
                    $scope.AdmissionObj.AdmissionTime = moment(edate, "YYYY-MM-DD hh:mm").format("hh:mm a");


                    var AdmittedBylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.AdmissionObj.AdmittedBy }, true) || [];
                    if (AdmittedBylist.length > 0) {
                        $scope.AdmissionObj.AdmittedByName = angular.copy(AdmittedBylist[0].FullName);
                        $scope.AdmissionObj.AdmittedByLicenseNo = angular.copy(AdmittedBylist[0].LicenseNumber);
                        AdmittedBylist[0].SuffixName = AdmittedBylist[0].SuffixName || '';
                        $scope.AdmissionObj.AdmittedBySuffix = angular.copy(AdmittedBylist[0].SuffixName + ',');
                        if (AdmittedBylist[0].SuffixId == 10) {
                            $scope.AdmissionObj.AdmissionPrefix = ' Dr. '
                        } else {
                            $scope.AdmissionObj.AdmissionPrefix = ''
                        }
                    } else {
                        $scope.AdmissionObj.AdmittedByName = '';
                        $scope.AdmissionObj.AdmittedByLicenseNo = '';
                        $scope.AdmissionObj.AdmittedBySuffix = '';
                        $scope.AdmissionObj.AdmissionPrefix = '';
                    }
                }

                var ReviewedBylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.AdmissionObj.ReviewedBy }, true);
                if (ReviewedBylist.length > 0) {
                    $scope.AdmissionObj.ReviewedByName = angular.copy(ReviewedBylist[0].FullName);
                    $scope.AdmissionObj.ReviewedBy = angular.copy(ReviewedBylist[0].DoctorID);
                    $scope.AdmissionObj.ReviewedByLicenseNo = angular.copy(ReviewedBylist[0].LicenseNumber);
                    ReviewedBylist[0].SuffixName = ReviewedBylist[0].SuffixName || '';
                    $scope.AdmissionObj.ReviewedBySuffix = angular.copy(ReviewedBylist[0].SuffixName + ',');
                } else {
                    $scope.AdmissionObj.ReviewedByName = '';
                    $scope.AdmissionObj.ReviewedByLicenseNo = '';
                    $scope.AdmissionObj.ReviewedBySuffix = '';
                }
            }

            /* Pre-op-Anesthesia Print - Start */

            $scope.ReviewedBySuffixName = '';
            $scope.ReviewedByLicenseNo = '';
            $scope.GeneralList = [];
            $scope.MedicationsList = [];
            $scope.ClinicalList = [];
            $scope.FallRiskAssesment = [];

            let Preopindex = resp[0].data.PreOP.length;
            if (resp[0].data.PreOP.length > 0) {

                var preopresp = angular.copy(resp[0].data.PreOP[0]);

                $scope.AscPreopObj.ReviewedBy = preopresp.ReviewedBy || null;
                $scope.AscPreopObj.PainLevel = preopresp.PainLevel;

                if ($scope.AscPreopObj.ReviewedBy != null) {
                    var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.AscPreopObj.ReviewedBy }) || [];
                    if (ReviewedByArraylist.length > 0) {

                        let ReviewedByName = '';
                        ReviewedByName = ReviewedByArraylist[0].FirstName + ' ' + ReviewedByArraylist[0].LastName + ' ' + ReviewedByArraylist[0].SuffixName;
                        $scope.AscPreopObj.ReviewedByName = ReviewedByName;

                        /*  $scope.AscPreopObj.ReviewedByName = angular.copy(ReviewedByArraylist[0].UserFullName) || '';*/
                        //$scope.ReviewedBySuffixName = angular.copy(ReviewedByArraylist[0].SuffixName + ',') || '';
                        $scope.ReviewedByLicenseNo = angular.copy(ReviewedByArraylist[0].LicenseNumber) || '';
                        //if (ReviewedByArraylist[0].SuffixId == 10) {
                        //    $scope.AscPreopObj.ReviewedByName = ' Dr. ' + $scope.AscPreopObj.ReviewedByName;
                        //}
                    }
                }

                preopresp.IVAccessDetailsList = preopresp.IVAccessDetailsList || [];
                $scope.AscPreopObj.IVAccessDetailsList = preopresp.IVAccessDetailsList || [];
                if ($scope.AscPreopObj.IVAccessDetailsList.length > 0) {
                    angular.forEach($scope.AscPreopObj.IVAccessDetailsList, function (item) {
                        item.IVSiteFluidsName = item.IVSiteFluidsName || '';
                        if (item.IVSiteFluids !== null) {
                            let FluidsArray = $filter('filter')($scope.AscPreopObj.IVSiteFluidsArray, { 'IVSiteMarkingId': item.IVSiteFluids }, true) || [];
                            if (FluidsArray.length > 0) {
                                item.IVSiteFluidsName = FluidsArray[0].IVSiteMarkingName || '';
                            }
                        };
                        item.IVSiteFlushName = item.IVSiteFlushName || '';
                        if (item.IVSiteFlush !== null) {
                            let FlushArray = $filter('filter')($scope.AscPreopObj.IVSiteFlushArray, { 'IVSiteMarkingId': item.IVSiteFlush }, true) || [];
                            if (FlushArray.length > 0) {
                                item.IVSiteFlushName = FlushArray[0].IVSiteMarkingName || '';
                            }
                        };
                        item.IVSiteLactatedRingersName = item.IVSiteLactatedRingersName || '';
                        if (item.IVSiteLactatedRingers !== null) {
                            let LactatedArray = $filter('filter')($scope.AscPreopObj.IVSiteLRArray, { 'IVSiteMarkingId': item.IVSiteLactatedRingers }, true) || [];
                            if (LactatedArray.length > 0) {
                                item.IVSiteLactatedRingersName = LactatedArray[0].IVSiteMarkingName || '';
                            }
                        };
                        item.IVFluidsName = item.IVFluidsName || "";
                        if (item.IVFluidsId !== null) {
                            let Array = $filter('filter')($scope.AscPreopObj.IVFluidsArray, { 'IVSiteMarkingId': item.IVFluidsId }, true) || [];
                            if (Array.length > 0) {
                                item.IVFluidsName = Array[0].IVSiteMarkingName || '';
                            }
                        };

                        if (item.PatencyStatus == 'Not Patent' || item.PatencyStatus == 'Blocked') {
                            item.IVSiteBlocked = true;
                        } else {
                            item.IVSiteBlocked = false;
                        }

                        if (item.IvAccessGivenBy !== null) {
                            let IvGivenBy = $filter('filter')($scope.allUserList, { 'DoctorID': item.IvAccessGivenBy }, true) || [];
                            if (IvGivenBy.length > 0) {
                                item.IvAccessGivenByName = IvGivenBy[0].FullName || '';
                            } else {
                                item.IvAccessGivenByName = '';
                            }
                        } else {
                            if ($scope.RoleId == 8) {
                                item.IvAccessGivenBy = $scope.UserId || null;
                            };
                            item.IvAccessGivenByName = '';
                        }
                        item.IVNeedleSizeName = item.IVNeedleSizeName || "";
                        item.IVSiteName = item.IVSiteName || "";
                        item.IVArm = item.IVArm || "";
                    });
                }

                // alderet score details
                preopresp.AlderetScoreDetails = preopresp.AlderetScoreDetails || [];
                if (preopresp.AlderetScoreDetails.length > 0) {
                    angular.forEach(preopresp.AlderetScoreDetails, function (item) {
                        angular.forEach($scope.AscPreopObj.AlderetScoreDetails, function (hitem) {
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

                preopresp.PreOpCallDetails = preopresp.PreOpCallDetails || [];
                if (preopresp.PreOpCallDetails.length > 0) {
                    $scope.AscPreopObj.PreOpCallDetails = preopresp.PreOpCallDetails;
                }
                $scope.AscPreopObj.TotalAlderetScore = preopresp.TotalAlderetScore || "";
                $scope.AscPreopObj.IdentifierDurationDate = preopresp.IdentifierDurationDate || "";
                $scope.AscPreopObj.IdentifierName = preopresp.IdentifierName || "";
                $scope.AscPreopObj.PreOpMedicationRemarks = preopresp.PreOpMedicationRemarks || "";
                $scope.AscPreopObj.PreOpNotes = preopresp.PreOpNotes || "",
                    $scope.AscPreopObj.PreOpAnesthesiaNotes = preopresp.PreOpAnesthesiaNotes || null;
                $scope.AscPreopObj.IsVeinOpened = preopresp.IsVeinOpened;
                $scope.AscPreopObj.IsNasalcanula = preopresp.IsNasalcanula;
                $scope.AscPreopObj.IsDiabetes = preopresp.IsDiabetes;
                $scope.AscPreopObj.IsHypoglycemiaCheck = preopresp.IsHypoglycemiaCheck || false;
                $scope.AscPreopObj.DiabetesResult = preopresp.DiabetesResult || "";
                $scope.AscPreopObj.DiabetesTime = preopresp.DiabetesTime || "";
                $scope.AscPreopObj.ODPupilSize = preopresp.ODPupilSize || "";
                $scope.AscPreopObj.OSPupilSize = preopresp.OSPupilSize || "";
                $scope.AscPreopObj.DilationReviewId = preopresp.DilationReviewId || null;
                $scope.AscPreopObj.MedicationReviewId = preopresp.MedicationReviewId || null;
                $scope.AscPreopObj.PreOpOverallNotes = preopresp.PatientCheckIn.PreOpOverallNotes || '';
                $scope.AscPreopObj.NurseFallRiskReviewdDate = preopresp.NurseFallRiskReviewdDate || '';
                $scope.AscPreopObj.NurseFallRiskID = preopresp.NurseFallRiskID || 0;
                $scope.AscPreopObj.NurseFallRiskName = preopresp.NurseFallRiskName || '';
                $scope.AscPreopObj.FallRiskLevel = preopresp.FallRiskLevel || '';
                $scope.AscPreopObj.ImplementedFallRiskProtocoltype = preopresp.ImplementedFallRiskProtocoltype || '';
                $scope.AscPreopObj.FallRiskAssessmentTotalScore = preopresp.FallRiskAssessmentTotalScore || '';
                $scope.AscPreopObj.FallriskBraceletprovided = preopresp.FallriskBraceletprovided || '';
                $scope.AscPreopObj.AssistiveWalkingDevice = preopresp.AssistiveWalkingDevice || '';
                $scope.AscPreopObj.NurseFallRiskLicenseNo = preopresp.NurseFallRiskLicenseNo || '';
                $scope.AscPreopObj.ImplementedFallRiskProtocol = preopresp.ImplementedFallRiskProtocol || false;
                $scope.AscPreopObj.PreOpInRoomTime = preopresp.PreOpInRoomTime || '';
                $scope.AscPreopObj.PreOpDiabetesRemarks = preopresp.PreOpDiabetesRemarks || '';
                $scope.AscPreopObj.NoOfAttempts = preopresp.NoOfAttempts || null;
                $scope.AscPreopObj.IvAccessGivenBy = preopresp.IvAccessGivenBy || null;
                $scope.AscPreopObj.IvAccessGivenByTime = preopresp.IvAccessGivenByTime || '';
                $scope.AscPreopObj.IvAccessGivenByName = $scope.AscPreopObj.IvAccessGivenByName || '';
                if ($scope.AscPreopObj.IvAccessGivenBy !== null) {
                    let IvGivenBy = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.AscPreopObj.IvAccessGivenBy }, true) || [];
                    if (IvGivenBy.length > 0) {
                        $scope.AscPreopObj.IvAccessGivenByName = IvGivenBy[0].FullName || '';
                    }
                }
                //else {
                //    if ($scope.RoleId == 8) {
                //        $scope.AscPreopObj.IvAccessGivenBy = $scope.UserId || null;
                //    };
                //}

                // Femto Template

                $scope.AscPreopObj.FemtoArcuateIncisions1 = preopresp.FemtoArcuateIncisions1 || '';
                $scope.AscPreopObj.IsFemtoArcuateIncisions1NA = preopresp.IsFemtoArcuateIncisions1NA || false;
                $scope.AscPreopObj.FemtoArcuateIncisions2 = preopresp.FemtoArcuateIncisions2 || '';
                $scope.AscPreopObj.IsFemtoArcuateIncisions2NA = preopresp.IsFemtoArcuateIncisions2NA || false;
                $scope.AscPreopObj.FemtoArcuateIncisionsNotes = preopresp.FemtoArcuateIncisionsNotes || '';
                $scope.AscPreopObj.FemtoTimeOut = preopresp.FemtoTimeOut || '';
                $scope.AscPreopObj.FemtoStartTime = preopresp.FemtoStartTime || '';
                $scope.AscPreopObj.FemtoEndTime = preopresp.FemtoEndTime || '';
                $scope.AscPreopObj.FemtoReferenceNo = preopresp.FemtoReferenceNo || '';
                $scope.AscPreopObj.FemtoLotNo = preopresp.FemtoLotNo || '';
                $scope.AscPreopObj.FemtoExpiryDate = preopresp.FemtoExpiryDate || null;
                $scope.AscPreopObj.FemtoOverAllNotes = preopresp.FemtoOverAllNotes || '';
                $scope.AscPreopObj.FemtNurseReviewedById = preopresp.FemtNurseReviewedById || null;
                $scope.AscPreopObj.FemtNurseReviewedByName = preopresp.FemtNurseReviewedByName || '';
                $scope.AscPreopObj.FemtDoctorReviewedById = preopresp.FemtDoctorReviewedById || null;
                $scope.AscPreopObj.FemtDoctorReviewedByName = preopresp.FemtDoctorReviewedByName || '';
                $scope.AscPreopObj.FemtDoctorReviewedByDate = preopresp.FemtDoctorReviewedByDate || null;
                $scope.AscPreopObj.FemtDoctorReviewedByTime = preopresp.FemtDoctorReviewedByTime || '';

                if ($scope.AscPreopObj.FemtoExpiryDate !== null) {
                    $scope.AscPreopObj.FemtoExpiryDate = $filter("date")($scope.AscPreopObj.FemtoExpiryDate, "MM-dd-yyyy") || null;
                }
                if ($scope.AscPreopObj.FemtDoctorReviewedByDate !== null) {
                    $scope.AscPreopObj.FemtDoctorReviewedByDate = $filter("date")($scope.AscPreopObj.FemtDoctorReviewedByDate, "MM-dd-yyyy") || null;
                }

                if ($scope.AscPreopObj.FemtoArcuateIncisions1 !== '' || $scope.AscPreopObj.IsFemtoArcuateIncisions1NA || $scope.AscPreopObj.FemtoArcuateIncisions2 !== '' || $scope.AscPreopObj.IsFemtoArcuateIncisions2NA || $scope.AscPreopObj.FemtoTimeOut !== '' || $scope.AscPreopObj.FemtoStartTime !== '' || $scope.AscPreopObj.FemtoEndTime !== '' || $scope.AscPreopObj.FemtoReferenceNo !== ''
                    || $scope.AscPreopObj.FemtoLotNo !== '' || $scope.AscPreopObj.FemtoExpiryDate !== null || $scope.AscPreopObj.FemtoOverAllNotes !== '' || $scope.AscPreopObj.FemtNurseReviewedById !== null || $scope.AscPreopObj.FemtDoctorReviewedById !== null || $scope.AscPreopObj.FemtDoctorReviewedByDate !== null || $scope.AscPreopObj.FemtDoctorReviewedByTime !== '') {
                    $scope.AscPreopObj.IfFemtoTemplateDataAdded = true;
                } else {
                    $scope.AscPreopObj.IfFemtoTemplateDataAdded = false;
                }

                //$scope.FemtoObj = {
                //    "FemtoArcuateIncisions1": $scope.AscPreopObj.FemtoArcuateIncisions1 || '',
                //    "IsFemtoArcuateIncisions1NA": $scope.AscPreopObj.IsFemtoArcuateIncisions1NA || false,
                //    "FemtoArcuateIncisions2": $scope.AscPreopObj.FemtoArcuateIncisions2 || '',
                //    "IsFemtoArcuateIncisions2NA": $scope.AscPreopObj.IsFemtoArcuateIncisions2NA || false,
                //    "FemtoArcuateIncisionsNotes": $scope.AscPreopObj.FemtoArcuateIncisionsNotes || '',
                //    "FemtoTimeOut": $scope.AscPreopObj.FemtoTimeOut || '',
                //    "FemtoStartTime": $scope.AscPreopObj.FemtoStartTime || '',
                //    "FemtoEndTime": $scope.AscPreopObj.FemtoEndTime || '',
                //    "FemtoReferenceNo": $scope.AscPreopObj.FemtoReferenceNo || '',
                //    "FemtoLotNo": $scope.AscPreopObj.FemtoLotNo || '',
                //    "FemtoExpiryDate": $scope.AscPreopObj.FemtoExpiryDate || null,
                //    "FemtoOverAllNotes": $scope.AscPreopObj.FemtoOverAllNotes || '',
                //    "FemtNurseReviewedById": $scope.AscPreopObj.FemtNurseReviewedById || null,
                //    "FemtNurseReviewedByName": $scope.AscPreopObj.FemtNurseReviewedByName || '',
                //    "FemtDoctorReviewedById": $scope.AscPreopObj.FemtDoctorReviewedById || null,
                //    "FemtDoctorReviewedByName": $scope.AscPreopObj.FemtDoctorReviewedByName || '',
                //    "FemtDoctorReviewedByDate": $scope.AscPreopObj.FemtDoctorReviewedByDate || null,
                //    "FemtDoctorReviewedByTime": $scope.AscPreopObj.FemtDoctorReviewedByTime || '',
                //    "IfFemtoTemplateDataAdded": false,
                //}

                //if ($scope.FemtoObj.FemtoArcuateIncisions1 !== '' || $scope.FemtoObj.IsFemtoArcuateIncisions1NA || $scope.FemtoObj.FemtoArcuateIncisions2 !== '' || $scope.FemtoObj.IsFemtoArcuateIncisions2NA || $scope.FemtoObj.FemtoTimeOut !== '' || $scope.FemtoObj.FemtoStartTime !== '' || $scope.FemtoObj.FemtoEndTime !== '' || $scope.FemtoObj.FemtoReferenceNo !== ''
                //    || $scope.FemtoObj.FemtoLotNo !== '' || $scope.FemtoObj.FemtoExpiryDate !== null || $scope.FemtoObj.FemtoOverAllNotes !== '' || $scope.FemtoObj.FemtNurseReviewedById !== null || $scope.FemtoObj.FemtDoctorReviewedById !== null || $scope.FemtoObj.FemtDoctorReviewedByDate !== null || $scope.FemtoObj.FemtDoctorReviewedByTime !== '') {
                //    $scope.FemtoObj.IfFemtoTemplateDataAdded = true;
                //} else {
                //    $scope.FemtoObj.IfFemtoTemplateDataAdded = false;
                //}

                $scope.AscPreopObj.DiabetesTimings = preopresp.DiabetesTimings || [];
                var isNasalcanula = '';
                if ($scope.AscPreopObj.IsNasalcanula == true || $scope.AscPreopObj.IsNasalcanula == false) {
                    isNasalcanula = $scope.AscPreopObj.IsNasalcanula;
                }
                $scope.OxygenPreobj = {
                    'OxygenQuantity': preopresp.OxygenQuantity || '',
                    'EndotrachealTubeNotes': preopresp.EndotrachealTubeNotes || '',
                    'LMANotes': preopresp.LMANotes || '',
                    'OxygenType': preopresp.OxygenType || '',
                    'IsNasalcanula': isNasalcanula || '',
                }; $scope.OxygenPostobj = {
                    'OxygenQuantity': $scope.AscPostOp.OxygenQuantity || '',

                    'OxygenType': $scope.AscPostOp.OxygenType || '',

                };

                var isVeinOpened = '';
                if ($scope.AscPreopObj.IsVeinOpened == true || $scope.AscPreopObj.IsVeinOpened == false) {
                    isVeinOpened = $scope.AscPreopObj.IsVeinOpened;
                }
                var isDiabetes = '';
                if ($scope.AscPreopObj.IsDiabetes == true || $scope.AscPreopObj.IsDiabetes == false) {
                    isDiabetes = $scope.AscPreopObj.IsDiabetes;
                }
                var isHypoglycemiaCheck = '';
                if ($scope.AscPreopObj.IsHypoglycemiaCheck == true || $scope.AscPreopObj.IsHypoglycemiaCheck == false) {
                    isHypoglycemiaCheck = $scope.AscPreopObj.IsHypoglycemiaCheck;
                }

                if ($scope.AscPreopObj.DilationReviewId != null) {
                    var DilationArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.AscPreopObj.DilationReviewId }) || [];
                    if (DilationArraylist.length > 0) {

                        var SuffixName = '';
                        DilationArraylist[0].SuffixName = DilationArraylist[0].SuffixName || "";
                        if (DilationArraylist[0].SuffixName != "") {
                            SuffixName = DilationArraylist[0].SuffixName + ',';
                        }

                        var LicenseNumber = "";
                        DilationArraylist[0].LicenseNumber = DilationArraylist[0].LicenseNumber || "";
                        if (DilationArraylist[0].LicenseNumber != "") {
                            LicenseNumber = 'Lic:' + ' ' + DilationArraylist[0].LicenseNumber + ',';
                        }

                        $scope.AscPreopObj.DilationReviewName = angular.copy(DilationArraylist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                    }
                    else {
                        $scope.AscPreopObj.DilationReviewName = ""
                    }
                }

                if ($scope.AscPreopObj.MedicationReviewId != null) {
                    var MedicationArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.AscPreopObj.MedicationReviewId }) || [];
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
                        $scope.AscPreopObj.MedicationReviewName = angular.copy(MedicationArraylist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                    }
                    else {
                        $scope.AscPreopObj.MedicationReviewName = ""
                    }
                }


                $scope.AscPreopObj.DilationMedicationsNotes = preopresp.DilationMedicationsNotes || "";
                $scope.AscPreopObj.MedicationRemarks = preopresp.MedicationRemarks || "";
                $scope.AscPreopObj.ReviewedDate = preopresp.ReviewedDate || "";
                if ($scope.AscPreopObj.ReviewedDate != '') {
                    $scope.AscPreopObj.ReviewedDate = $filter('date')($scope.AscPreopObj.ReviewedDate, "MM-dd-yyyy");
                }
                $scope.AscPreopObj.ReviewedTime = preopresp.ReviewedTime || "";

                $scope.AscPreopObj.ReviewedTime = $scope.AscPreopObj.ReviewedTime || "";
                if ($scope.AscPreopObj.ReviewedTime != "") {
                    let ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                    let edate = ndate + " " + $scope.AscPreopObj.ReviewedTime;
                    var VitalAddTime = $filter('date')(new Date(edate), "hh:mm a") || "";
                    $scope.AscPreopObj.ReviewedTime = VitalAddTime;
                }
                $scope.AscPreopObj.PreOPLastSignOffUserDetails = resp[0].data.PreOPLastSignOffUserDetails || [];
                $scope.AscPreopObj.ROSOverAllRemarks = preopresp.ROSOverAllRemarks || "";

                $scope.Ascpatientpopupsavearray = [];
                $scope.AscPreopObj.PatientCheckIn = angular.copy(preopresp.PatientCheckIn);
                $scope.Ascpatientpopupsavearray.push($scope.AscPreopObj.PatientCheckIn);

                $scope.ModifiedPreopMedicationDate = "";
                $scope.ModifiedDilationDate = "";

                $scope.AscPreopObj.PreOpMedications = preopresp.PreOpMedications || [];
                if ($scope.AscPreopObj.PreOpMedications.length > 0) {
                    angular.forEach($scope.AscPreopObj.PreOpMedications, function (hitem) {
                        var dateTimeString = hitem.ModifiedDt;
                        $scope.ModifiedPreopMedicationDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                    });
                }

                $scope.AscPreopObj.DilationMedications = preopresp.DilationMedications || [];
                if ($scope.AscPreopObj.DilationMedications.length > 0) {
                    angular.forEach($scope.AscPreopObj.DilationMedications, function (hitem) {
                        var dateTimeString = hitem.ModifiedDt;
                        $scope.ModifiedDilationDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                    });
                }

                $scope.AscPreopObj.OrgASCChecklist = preopresp.OrgASCChecklist || [];

                // checklists 
                if ($scope.AscPreopObj.OrgASCChecklist.length > 0) {
                    angular.forEach($scope.AscPreopObj.OrgASCChecklist, function (item) {
                        angular.forEach($scope.AllOrgASCChecklist, function (hitem) {
                            if (hitem.CheckListCategoryId === item.CheckListCategoryId) {
                                if (item.CheckListId == 212 || item.CheckListId == 170) {
                                    if (item.AscMultiCheckValueArray.length > 0) {
                                        angular.forEach(item.AscMultiCheckValueArray, function (jitem) {
                                            angular.forEach(hitem.OrganizationCheckListDetails, function (Oitem) {
                                                if (Oitem.OrganizationPreOpCheckListValueId == jitem.OrganizationPreOpCheckListValueId) {
                                                    Oitem.IsChecked = true;
                                                    hitem.IsChecked = true;
                                                }
                                            });
                                        });
                                    }
                                } else {
                                    angular.forEach(hitem.OrganizationCheckListDetails, function (kitem) {
                                        if (kitem.Value == item.Value && kitem.CheckListId === item.CheckListId) {
                                            kitem.IsChecked = true;
                                            hitem.IsChecked = true;
                                            hitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || 0;
                                            hitem.Value = item.Value || '';
                                            hitem.Remarks = item.Remarks || "";
                                        }
                                        else {
                                            kitem.IsChecked = false;
                                        }
                                    });
                                    hitem.ChecklistDate = $filter("date")(item.ChecklistDate, "MM-dd-yyyy") || "";
                                }
                            }
                        });
                    });
                }
                if ($scope.AscPreopObj.OrgASCChecklist.length > 0) {
                    angular.forEach($scope.AscPreopObj.OrgASCChecklist, function (item) {
                        angular.forEach($scope.AllOrgASCChecklist, function (hitem) {
                            if (item.CheckListCategoryId == 11 || item.CheckListCategoryId == 14 || item.CheckListCategoryId == 15 || item.CheckListCategoryId == 16) {
                                if (hitem.CheckListCategoryId === item.CheckListCategoryId) {
                                    if (hitem.OrganizationCheckListDetails && hitem.OrganizationCheckListDetails.length > 0) {
                                        angular.forEach(hitem.OrganizationCheckListDetails, function (kitem) {
                                            if (kitem.Value == item.Value && kitem.CheckListId === item.CheckListId) {
                                                kitem.IsChecked = true;
                                                hitem.IsChecked = true;
                                                hitem.Score = item.Score || 0;
                                                hitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || 0;
                                                hitem.Value = item.Value || '';
                                                hitem.Remarks = item.Remarks || "";
                                            }
                                            else {
                                                kitem.IsChecked = false;
                                            }
                                        });
                                    //  hitem.ChecklistDate = $filter("date")(item.ChecklistDate, "MM-dd-yyyy") || "";
                                    } else if (item.CheckListId === hitem.CheckListId) {
                                        hitem.IsChecked = true;
                                    }
                                }
                            }
                        });
                    });
                }


                preopresp.SurgicalSiteVerifiedBy = preopresp.SurgicalSiteVerifiedBy || null;
                $scope.AscPreopObj.SurgicalSiteVerifiedByName = [];
                $scope.AscPreopObj.PreOpSurgicalSiteRemarks = preopresp.PreOpSurgicalSiteRemarks || "";

                if (preopresp.SurgicalSiteVerifiedBy != null) {
                    let SurgicalUserArray = $filter('filter')($scope.allUserList, { 'DoctorID': preopresp.SurgicalSiteVerifiedBy }, true) || [];
                    var LicenseNo = '';
                    if (SurgicalUserArray.length > 0) {
                        if (SurgicalUserArray[0].LicenseNumber != '') {
                            var LicenseNo = SurgicalUserArray[0].LicenseNumber || '';
                        }

                        $scope.AscPreopObj.SurgicalSiteVerifiedByName = SurgicalUserArray[0].SecondUserFullName + ' ' + LicenseNo;
                    }
                } else {
                    $scope.AscPreopObj.SurgicalSiteVerifiedByName = '';
                }

                preopresp.PreOpHandOffReviewedBy = preopresp.PreOpHandOffReviewedBy || null;
                if (preopresp.PreOpHandOffReviewedBy != null) {
                    let HandUser = $filter('filter')($scope.allUserList, { 'DoctorID': preopresp.PreOpHandOffReviewedBy }, true) || [];
                    var License = '';
                    if (HandUser.length > 0) {
                        if (HandUser[0].LicenseNumber != '') {
                            var License = HandUser[0].LicenseNumber || '';
                        }

                        $scope.AscPreopObj.PreOpHandOffReviewedByName = HandUser[0].SecondUserFullName + ' ' + License;
                    }
                } else {
                    $scope.AscPreopObj.PreOpHandOffReviewedByName = '';
                }
                preopresp.PreOpHandOffFrom = preopresp.PreOpHandOffFrom || null;
                if (preopresp.PreOpHandOffFrom != null) {
                    let HandUser = $filter('filter')($scope.allUserList, { 'DoctorID': preopresp.PreOpHandOffFrom }, true) || [];
                    var License = '';
                    if (HandUser.length > 0) {
                        if (HandUser[0].LicenseNumber != '') {
                            var License = HandUser[0].LicenseNumber || '';
                        }

                        $scope.AscPreopObj.PreOpHandOffFromName = HandUser[0].SecondUserFullName + ' ' + License;
                    }
                } else {
                    $scope.AscPreopObj.PreOpHandOffFromName = '';
                }


                $scope.AscPreopObj.IVSiteName = preopresp.IVSiteName || "";
                $scope.AscPreopObj.IVNeedleSizeName = preopresp.IVNeedleSizeName || "";
                $scope.AscPreopObj.PatencyStatus = preopresp.PatencyStatus || "";
                $scope.AscPreopObj.IVArm = preopresp.IVArm || "";
                $scope.AscPreopObj.IVBlockedArray = preopresp.IVBlockedArray || [];


                $scope.AscPreopObj.PreOpHandOffTime = preopresp.PreOpHandOffTime || "";
                $scope.AscPreopObj.PreOpHandoffRemarks = preopresp.PreOpHandoffRemarks || "";


                $scope.AscPreopObj.OrderDetails = preopresp.OrderDetails || [];

                angular.forEach($scope.AscPreopObj.OrderDetails, function (kitem) {
                    if (kitem.ReviewedBy != null) {
                        let ReviewedByName = '';
                        var Arraylist = $filter("filter")($scope.allUserList, function (pitem) { return pitem.DoctorID == kitem.ReviewedBy }, true) || [];
                        if (Arraylist.length > 0) {
                            ReviewedByName = Arraylist[0].FirstName + ' ' + Arraylist[0].LastName + ' ' + Arraylist[0].SuffixName;
                            kitem.ReviewedByName = ReviewedByName;
                        }
                    }
                });

                if ($scope.IsShowEmptyASCChecklist) {
                    $scope.GeneralList = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 6 }, true) || [];
                    $scope.MedicationsList = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 5 }, true) || [];
                    $scope.DietMedications = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 25, 'CheckListSubTypeId': 1 }, true) || [];
                    $scope.ClinicalList = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 1, 'CheckListSubTypeId': 1 }, true) || [];
                    $scope.PatientCheckList = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 12, "CheckListSubTypeId": 1 }, true) || [];
                } else {
                    $scope.GeneralList = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 6, "IsChecked": true }, true) || [];
                    $scope.MedicationsList = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 5, "IsChecked": true }, true) || [];
                    $scope.DietMedications = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 25, "IsChecked": true, 'CheckListSubTypeId': 1 }, true) || [];
                    $scope.ClinicalList = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 1, "IsChecked": true, 'CheckListSubTypeId': 1 }, true) || [];
                    $scope.PatientCheckList = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 12, "IsChecked": true, "CheckListSubTypeId": 1 }, true) || [];
                }

              
                $scope.FallRiskAssesment = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 11, "IsChecked": true }, true) || [];

                $scope.SurgicalSiteList = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListId": 168, "IsChecked": true }, true) || [];
                $scope.PatientPaticipateList = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListId": 169, "IsChecked": true }, true) || [];
                $scope.IVCondition = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListId": 170, "IsChecked": true }, true) || [];
                $scope.ProcedureVerify = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListId": 191, "IsChecked": true }, true) || [];

                $scope.PreOpNurseDiagnosis = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 14, "IsChecked": true }, true) || [];
                $scope.PreOpNurseAssessment = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 15, "IsChecked": true }, true) || [];
                $scope.PreOpNurseInterventions = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 16, "IsChecked": true }, true) || [];

                $scope.PreopFemtoTemplate = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 18, "IsChecked": true }, true) || [];
                
                var PreOpDialationMedicationListArray = [];
                PreOpDialationMedicationListArray = $filter('filter')($scope.AscPreopObj.OrderDetails, { 'MedTypeId': 2 }, true) || [];

                var PreOpMedicationListArray = [];
                PreOpMedicationListArray = $filter('filter')($scope.AscPreopObj.OrderDetails, { 'MedTypeId': 1 }, true) || [];

                //$scope.MainIVBlockedArray = $filter("filter")($scope.AscPreopObj.IVBlockedArray, { "IsSelected": true }, true) || [];

                $scope.AscPreopObj.IVCondition = $scope.IVCondition || [];
                $scope.AscPreopObj.PatientPaticipateList = $scope.PatientPaticipateList || [];
                $scope.AscPreopObj.SurgicalSiteList = $scope.SurgicalSiteList || [];
                $scope.AscPreopObj.ProcedureVerify = $scope.ProcedureVerify || [];

                var NurseFallRiskReviewdDate = $scope.AscPreopObj.NurseFallRiskReviewdDate || "";
                $scope.AscPreopObj.NurseFallRiskReviewdDate = $filter('date')(NurseFallRiskReviewdDate, 'MM-dd-yyyy hh:mm a') || '';

                var fallRiskProtocolType = '';
                if ($scope.AscPreopObj.ImplementedFallRiskProtocol == true) {
                    fallRiskProtocolType = $scope.AscPreopObj.ImplementedFallRiskProtocoltype || '';
                } else {
                    fallRiskProtocolType = ''
                }

                $scope.PreopNursevitalarray = [];
                if (preopresp.VitalsArray.length > 0) {
                    angular.forEach(preopresp.VitalsArray, function (item) {
                        if (item.VitalAddTime) {
                            let ndate = moment().format("YYYY-MM-DD");
                            let edate = ndate + " " + item.VitalAddTime;
                            item.VitalAddTime = moment(edate, "YYYY-MM-DD HH:mm").format("hh:mm A");
                        }
                    });

                    $scope.PreopNursevitalarray = $filter('filter')(preopresp.VitalsArray, { "TypeId": 4 }, true) || [];
                }
            }

            /* Pre-op-Anesthesia Print - End */

            /* Intra-op-Anesthesia Print - Start */

            let Intraopindex = resp[0].data.IntraOP.length;
            if (resp[0].data.IntraOP.length > 0) {

                $scope.AscIntraop = angular.copy(resp[0].data.IntraOP[0]);


                //let tempIntraopAnesthesiaTypeList = angular.copy($scope.AscIntraop.AnesthesiaTypelist) || [];
                //if (tempIntraopAnesthesiaTypeList.length > 0) {
                //    angular.forEach(tempIntraopAnesthesiaTypeList, function (kitem) {
                //        kitem.IsSelected = false;
                //    });

                //    angular.forEach(tempIntraopAnesthesiaTypeList, function (item) {
                //        angular.forEach($scope.PostopAnesthesiaList, function (kitem) {
                //            if (kitem.AnesthesiaTypeId === item.AnesthesiaTypeId) {
                //                kitem.IsSelected = true;
                //            }
                //        });
                //    });
                //} else {
                //    angular.forEach(tempIntraopAnesthesiaTypeList, function (kitem) {
                //        kitem.IsSelected = false;
                //    });
                //}

                //var AscIntraopanesthesiaTypeList = [];
                //if ($scope.PostopAnesthesiaList.length > 0) {
                //    AscIntraopanesthesiaTypeList = $filter('filter')($scope.PostopAnesthesiaList, { 'IsSelected': true }, true);
                //} else {
                //    AscIntraopanesthesiaTypeList = [];
                //}


                $scope.AscIntraop.ExpirationDate = $scope.AscIntraop.ExpirationDate || null;
                if ($scope.AscIntraop.ExpirationDate != null) {
                    $scope.AscIntraop.ExpirationDate = $filter('date')($scope.AscIntraop.ExpirationDate, "MM-dd-yyyy");
                }
                var AscIntraopanesthesiaTypeList = [];
                AscIntraopanesthesiaTypeList = angular.copy($scope.AscIntraop.AnesthesiaTypelist) || [];

                // new intraop chekclist format edit case

                $scope.AscIntraop.PatientAscChecklist = $scope.AscIntraop.PatientAscChecklist || [];
                if ($scope.AscIntraop.PatientAscChecklist.length > 0) {
                    angular.forEach($scope.AscIntraop.PatientAscChecklist, function (item) {
                        angular.forEach($scope.AllIntraOpChecklistsArray, function (kitem) {
                            if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                                if (kitem.CheckListId === item.CheckListId) {
                                    kitem.IsChecked = true;
                                    kitem.Score = item.Score || 0;
                                    kitem.Value = item.Value || '';
                                    kitem.Remarks = item.Remarks || '';
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
                                    if (item.CheckListId == 180 || item.CheckListId == 178 || item.CheckListId == 179 || item.CheckListCode == 336) {
                                        if (item.AscMultiCheckValueArray.length > 0) {
                                            angular.forEach(item.AscMultiCheckValueArray, function (jitem) {
                                                angular.forEach(kitem.OrganizationCheckListDetails, function (hitem) {
                                                    if (hitem.OrganizationPreOpCheckListValueId == jitem.OrganizationPreOpCheckListValueId) {
                                                        hitem.IsChecked = true;
                                                        hitem.PatientMultiCheckListId = jitem.PatientMultiCheckListId || null;
                                                    }
                                                });
                                            });
                                        }
                                    }
                                    else {
                                        if (kitem.OrganizationCheckListDetails.length > 0) {
                                            angular.forEach(kitem.OrganizationCheckListDetails, function (Gitem) {
                                                Gitem.IsChecked = false;
                                                if (item.Value == Gitem.Value) {
                                                    Gitem.IsChecked = true;
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        });
                    });
                }

                var checkedChecklistArray = [];
                if ($scope.AllIntraOpChecklistsArray.length > 0) {
                    checkedChecklistArray = angular.copy($scope.AllIntraOpChecklistsArray);
                }

                var IntraOpCheckInCheckListArray = [];
                var IntraOpCheckANSInCheckListArray = [];
                var IntraOpCheckoutCheckListArray = [];

                if ($scope.IsShowEmptyASCChecklist) {
                    IntraOpCheckInCheckListArray = $filter('filter')($scope.AllIntraOpChecklistsArray, { 'CheckListCategoryId': 13 }, true) || [];
                    IntraOpCheckANSInCheckListArray = $filter('filter')($scope.AllIntraOpChecklistsArray, { 'CheckListCategoryId': 26 }, true) || [];
                    IntraOpCheckoutCheckListArray = $filter('filter')($scope.AllIntraOpChecklistsArray, { 'CheckListCategoryId': 27 }, true) || [];
                } else {
                    IntraOpCheckInCheckListArray = $filter('filter')($scope.AllIntraOpChecklistsArray, { 'CheckListCategoryId': 13, "IsChecked": true }, true) || [];
                    IntraOpCheckANSInCheckListArray = $filter('filter')($scope.AllIntraOpChecklistsArray, { 'CheckListCategoryId': 26, "IsChecked": true }, true) || [];
                    IntraOpCheckoutCheckListArray = $filter('filter')($scope.AllIntraOpChecklistsArray, { 'CheckListCategoryId': 27, "IsChecked": true }, true) || [];
                }

                $scope.IntraOpNurseDiagnosis = $filter("filter")($scope.AllIntraOpChecklistsArray, { "CheckListCategoryId": 14, "IsChecked": true }, true) || [];
                $scope.IntraOpNurseAssessment = $filter("filter")($scope.AllIntraOpChecklistsArray, { "CheckListCategoryId": 15, "IsChecked": true }, true) || [];
                $scope.IntraOpNurseInterventions = $filter("filter")($scope.AllIntraOpChecklistsArray, { "CheckListCategoryId": 16, "IsChecked": true }, true) || [];


                // Time Out Check List

                $scope.OnlyNusrseAnesthetistRoles = [];
                $scope.OnlyNusrseAnesthetistRoles = $scope.allUserList.filter((x) => x.RoleId == 8 || x.RoleId == 25);

                $scope.CheckinChecklistArray = [];
                $scope.CheckinChecklistArray = $scope.OnlyNusrseAnesthetistRoles;

                $scope.AscIntraop.BeforeAnesthesiaReviewedBy = $scope.AscIntraop.BeforeAnesthesiaReviewedBy || null;
                if ($scope.AscIntraop.BeforeAnesthesiaReviewedBy != null) {
                    let beforeanesthesiareviewedArray = $filter('filter')($scope.CheckinChecklistArray, { 'DoctorID': $scope.AscIntraop.BeforeAnesthesiaReviewedBy }, true) || [];
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
                            $scope.AscIntraop.BeforeAnesthesiaReviewedByName = angular.copy('Dr. ' + beforeanesthesiareviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        } else {
                            $scope.AscIntraop.BeforeAnesthesiaReviewedByName = angular.copy(beforeanesthesiareviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        }
                    }
                }

                $scope.AscIntraop.BeforeIncisionReviewedBy = $scope.AscIntraop.BeforeIncisionReviewedBy || null;
                if ($scope.AscIntraop.BeforeIncisionReviewedBy != null) {
                    let beforeIncisionreviewedArray = $filter('filter')($scope.CheckinChecklistArray, { 'DoctorID': $scope.AscIntraop.BeforeIncisionReviewedBy }, true) || [];
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
                            $scope.AscIntraop.BeforeIncisionReviewedByName = angular.copy('Dr. ' + beforeIncisionreviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        } else {
                            $scope.AscIntraop.BeforeIncisionReviewedByName = angular.copy(beforeIncisionreviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        }
                    }
                }

                $scope.AscIntraop.IntraOpNotes = $scope.AscIntraop.IntraOpNotes || null;
                $scope.AscIntraop.IntraOpAnesthesiaNotes = $scope.AscIntraop.IntraOpAnesthesiaNotes || null;
                $scope.AscIntraop.BeforeORReviewedBy = $scope.AscIntraop.BeforeORReviewedBy || null;
                if ($scope.AscIntraop.BeforeORReviewedBy != null) {
                    let beforeORreviewedArray = $filter('filter')($scope.CheckinChecklistArray, { 'DoctorID': $scope.AscIntraop.BeforeORReviewedBy }, true) || [];
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
                            $scope.AscIntraop.BeforeORReviewedByName = angular.copy('Dr. ' + beforeORreviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        } else {
                            $scope.AscIntraop.BeforeORReviewedByName = angular.copy(beforeORreviewedArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        }
                    }
                }

                //$scope.intraopmedications = [];

                //$scope.AscIntraop.IntraOpMedications = $scope.AscIntraop.IntraOpMedications || [];
                //if ($scope.AscIntraop.IntraOpMedications.length > 0) {
                //    $scope.intraopmedications = $filter('filter')($scope.AscIntraop.IntraOpMedications, { 'IsChecked': true }, true);
                //} else {
                //    $scope.intraopmedications = [];
                //}

                $scope.AscIntraop.NurseActions.HallEntranceStartTime = $scope.AscIntraop.NurseActions.HallEntranceStartTime || "";
                if ($scope.AscIntraop.NurseActions.HallEntranceStartTime != "") {
                    let dummydate = "2024-01-01";
                    let dummydatetime = dummydate + " " + $scope.AscIntraop.NurseActions.HallEntranceStartTime;
                    $scope.AscIntraop.NurseActions.HallEntranceStartTime = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");
                }

                $scope.AscIntraop.NurseActions.HallEntranceEndTime = $scope.AscIntraop.NurseActions.HallEntranceEndTime || "";
                if ($scope.AscIntraop.NurseActions.HallEntranceEndTime != "") {
                    let dummydate = "2024-01-01";
                    let dummydatetime = dummydate + " " + $scope.AscIntraop.NurseActions.HallEntranceEndTime;
                    $scope.AscIntraop.NurseActions.HallEntranceEndTime = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");
                }
                $scope.AscIntraop.NurseActions.AnesthesiaStartTime = $scope.AscIntraop.NurseActions.AnesthesiaStartTime || "";
                if ($scope.AscIntraop.NurseActions.AnesthesiaStartTime != "") {
                    let dummydate = "2024-01-01";
                    let dummydatetime = dummydate + " " + $scope.AscIntraop.NurseActions.AnesthesiaStartTime;
                    $scope.AscIntraop.NurseActions.AnesthesiaStartTime = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");
                }
                $scope.AscIntraop.NurseActions.AnesthesiaEndTime = $scope.AscIntraop.NurseActions.AnesthesiaEndTime || "";
                if ($scope.AscIntraop.NurseActions.AnesthesiaEndTime != "") {
                    let dummydate = "2024-01-01";
                    let dummydatetime = dummydate + " " + $scope.AscIntraop.NurseActions.AnesthesiaEndTime;
                    $scope.AscIntraop.NurseActions.AnesthesiaEndTime = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");
                }

                $scope.AscIntraop.NurseActions.SurgeryStartTime = $scope.AscIntraop.NurseActions.SurgeryStartTime || "";
                if ($scope.AscIntraop.NurseActions.SurgeryStartTime != "") {
                    let dummydate = "2024-01-01";
                    let dummydatetime = dummydate + " " + $scope.AscIntraop.NurseActions.SurgeryStartTime;
                    $scope.AscIntraop.NurseActions.SurgeryStartTime = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");
                }

                $scope.AscIntraop.NurseActions.SurgeryEndTime = $scope.AscIntraop.NurseActions.SurgeryEndTime || "";
                if ($scope.AscIntraop.NurseActions.SurgeryEndTime != "") {
                    let dummydate = "2024-01-01";
                    let dummydatetime = dummydate + " " + $scope.AscIntraop.NurseActions.SurgeryEndTime;
                    $scope.AscIntraop.NurseActions.SurgeryEndTime = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");
                }

                let ndate = moment().format("YYYY-MM-DD");
                $scope.AscIntraop.NurseActions.SurgicalFirstTime = $scope.AscIntraop.NurseActions.SurgicalFirstTime || '';
                if ($scope.AscIntraop.NurseActions.SurgicalFirstTime != '') {
                    let edate = ndate + " " + $scope.AscIntraop.NurseActions.SurgicalFirstTime;
                    $scope.AscIntraop.NurseActions.SurgicalFirstTime = moment(edate).format("hh:mm A");
                }

                $scope.AscIntraop.NurseActions.SurgicalSecondTime = $scope.AscIntraop.NurseActions.SurgicalSecondTime || '';
                if ($scope.AscIntraop.NurseActions.SurgicalSecondTime != '') {
                    let edate = ndate + " " + $scope.AscIntraop.NurseActions.SurgicalSecondTime;
                    $scope.AscIntraop.NurseActions.SurgicalSecondTime = moment(edate).format("hh:mm A");
                }

                $scope.AscIntraop.NurseActions.SurgicalFinalTime = $scope.AscIntraop.NurseActions.SurgicalFinalTime || '';
                if ($scope.AscIntraop.NurseActions.SurgicalFinalTime != '') {
                    let edate = ndate + " " + $scope.AscIntraop.NurseActions.SurgicalFinalTime;
                    $scope.AscIntraop.NurseActions.SurgicalFinalTime = moment(edate).format("hh:mm A");
                }


                // implants
                $scope.ImplantsDetailsArray = [];
                let tempArray = $scope.AscIntraop.ImplantsDetailsArray || [];

                if (tempArray.length > 0) {
                    angular.forEach(tempArray, function (item) {
                        let LensArray = $filter('filter')($scope.TypesofLens, { 'LensId': item.LensTypeId }, true);
                        if (LensArray.length > 0) {
                            item.LensType = LensArray[0].LensType;
                        }


                        let ManufacturerArray = $filter('filter')($scope.Manufacturers, { 'ManufacturerId': item.ManufacturerId }, true);
                        if (ManufacturerArray.length > 0) {
                            item.ManufacturerName = ManufacturerArray[0].Manufacturer;
                        }

                        let ModelsArray = $filter('filter')($scope.HospitalModels, { 'ModelId': item.ModelId }, true);
                        if (ModelsArray.length > 0) {
                            item.ModelName = ModelsArray[0].Model;
                        }

                        let DiopterArray = $filter('filter')($scope.DiopterArray, { 'Id': item.IOLPowerId }, true);
                        if (DiopterArray.length > 0) {
                            item.Power = DiopterArray[0].Power;
                        }

                        let IOLStatusArray = $filter('filter')($scope.IOLStatusArray, { 'Id': item.StatusId }, true);
                        if (IOLStatusArray.length > 0) {
                            item.StatusName = IOLStatusArray[0].Name;
                        }
                    });

                    $scope.ImplantsDetailsArray = angular.copy(tempArray);
                }

                $scope.AscIntraop.DoctorName = '';
                $scope.AscIntraop.DoctorSuffix = '';
                $scope.AscIntraop.DoctorLicense = '';
                $scope.AscIntraop.AnesthesiaName = '';
                $scope.AscIntraop.AnesthesiaSuffix = '';
                $scope.AscIntraop.AnesthesiaLicense = '';
                $scope.AscIntraop.NurseName = '';
                $scope.AscIntraop.NurseSuffix = '';
                $scope.AscIntraop.NurseLicense = '';
                $scope.AscIntraop.TechnicianName = '';
                $scope.AscIntraop.TechnicianSuffix = '';
                $scope.AscIntraop.TechnicianLicense = '';
                $scope.AscIntraop.AnesthesiologistName = '';
                $scope.AscIntraop.AnesthesiologistSuffix = '';
                $scope.AscIntraop.AnesthesiologistLicense = '';
                $scope.AscIntraop.MedicationsReviewName = "";

                angular.forEach($scope.allUserList, function (item) {

                    if ($scope.AscIntraop.NurseActions.SurgeonId == item.DoctorID) {
                        $scope.AscIntraop.NurseActions.SurgeonName = item.UserFullName;
                        var License = '';
                        //var Suffix = '';
                        //if (item.SuffixName !== '') {
                        //    Suffix = item.SuffixName + ',';
                        //}
                        if (item.LicenseNumber !== '') {
                            License = 'Lic: ' + item.LicenseNumber;
                        }
                        $scope.AscIntraop.NurseActions.SurgeonName = $scope.AscIntraop.NurseActions.SurgeonName + ' ' + License;
                        //if (item.SuffixId == 10) {
                        //    $scope.AscIntraop.NurseActions.SurgeonName = ' Dr. ' + $scope.AscIntraop.NurseActions.SurgeonName + ' ' + Suffix + ' ' + License;
                        //} else {
                        //    $scope.AscIntraop.NurseActions.SurgeonName = $scope.AscIntraop.NurseActions.SurgeonName + ' ' + Suffix + ' ' + License;
                        //}
                    }
                    if ($scope.AscIntraop.NurseActions.TechnicianId == item.DoctorID) {
                        $scope.AscIntraop.NurseActions.TechnicianName = item.UserFullName;
                    }
                    if ($scope.AscIntraop.NurseActions.AnesthesistId == item.DoctorID) {
                        $scope.AscIntraop.NurseActions.AnesthesistName = item.UserFullName;
                        var License = '';
                        //var Suffix = '';
                        //if (item.SuffixName !== '') {
                        //    Suffix = item.SuffixName + ',';
                        //}
                        if (item.LicenseNumber !== '') {
                            License = 'Lic: ' + item.LicenseNumber;
                        }
                        $scope.AscIntraop.NurseActions.AnesthesistName = $scope.AscIntraop.NurseActions.AnesthesistName + ' ' + License;

                        //if (item.SuffixId == 10) {
                        //    $scope.AscIntraop.NurseActions.AnesthesistName = ' Dr. ' + $scope.AscIntraop.NurseActions.AnesthesistName + ' ' + Suffix + ' ' + License;
                        //} else {
                        //    $scope.AscIntraop.NurseActions.AnesthesistName = $scope.AscIntraop.NurseActions.AnesthesistName + ' ' + Suffix + ' ' + License;
                        //}
                    }
                    if ($scope.AscIntraop.NurseActions.NurseId == item.DoctorID) {
                        $scope.AscIntraop.NurseActions.NurseName = item.UserFullName;
                    }
                    if ($scope.AscIntraop.NurseActions.CoSurgeonId == item.DoctorID) {
                        $scope.AscIntraop.NurseActions.CoSurgeonName = item.UserFullName;
                        var License = '';
                        //var Suffix = '';
                        //if (item.SuffixName !== '') {
                        //    Suffix = item.SuffixName + ',';
                        //}
                        if (item.LicenseNumber !== '') {
                            License = 'Lic: ' + item.LicenseNumber;
                        }
                        $scope.AscIntraop.NurseActions.CoSurgeonName = $scope.AscIntraop.NurseActions.CoSurgeonName + ' ' + License;
                        //if (item.SuffixId == 10) {
                        //    $scope.AscIntraop.NurseActions.CoSurgeonName = ' Dr. ' + $scope.AscIntraop.NurseActions.CoSurgeonName + ' ' + Suffix + ' ' + License;
                        //} else {
                        //    $scope.AscIntraop.NurseActions.CoSurgeonName = $scope.AscIntraop.NurseActions.CoSurgeonName + ' ' + Suffix + ' ' + License;
                        //}
                    }
                    if ($scope.AscIntraop.NurseActions.ReliefId == item.DoctorID) {
                        $scope.AscIntraop.NurseActions.ReliefName = item.UserFullName;
                    }
                    if ($scope.AscIntraop.NurseActions.SupportingStaffId == item.DoctorID) {
                        $scope.AscIntraop.NurseActions.SupportingStaffName = item.UserFullName;
                    }

                    if ($scope.AscIntraop.ReviewDoctorId == item.DoctorID) {
                        $scope.AscIntraop.DoctorName = item.FullName;
                        $scope.AscIntraop.DoctorSuffix = item.SuffixName;
                        $scope.AscIntraop.DoctorLicense = item.LicenseNumber;
                        //if (item.SuffixId == 10) {
                        //    $scope.AscIntraop.DoctorName = ' Dr. ' + $scope.AscIntraop.DoctorName;
                        //}
                    }

                    if ($scope.AscIntraop.ReviewAnesthetistId == item.DoctorID) {
                        $scope.AscIntraop.AnesthesiaName = item.FullName;
                        $scope.AscIntraop.AnesthesiaSuffix = item.SuffixName;
                        $scope.AscIntraop.AnesthesiaLicense = item.LicenseNumber;
                        //if (item.SuffixId == 10) {
                        //    $scope.AscIntraop.AnesthesiaName = ' Dr. ' + $scope.AscIntraop.AnesthesiaName;
                        //}
                    }

                    if ($scope.AscIntraop.ReviewNurseId == item.DoctorID) {
                        $scope.AscIntraop.NurseName = item.FullName;
                        $scope.AscIntraop.NurseSuffix = item.SuffixName;
                        $scope.AscIntraop.NurseLicense = item.LicenseNumber;
                    }

                    if ($scope.AscIntraop.ReviewTechnicianId == item.DoctorID) {
                        $scope.AscIntraop.TechnicianName = item.FullName;
                        $scope.AscIntraop.TechnicianSuffix = item.SuffixName;
                        $scope.AscIntraop.TechnicianLicense = item.LicenseNumber;

                    }

                    if ($scope.AscIntraop.ReviewAnesthesiologistId == item.DoctorID) {

                        $scope.AscIntraop.AnesthesiologistName = item.FirstName + ' ' + item.LastName;
                        /*  $scope.AscIntraop.AnesthesiologistName = item.FullName;*/
                        $scope.AscIntraop.AnesthesiologistSuffix = item.SuffixName;
                        $scope.AscIntraop.AnesthesiologistLicense = item.LicenseNumber;
                        //if (item.SuffixId == 10) {
                        //    $scope.AscIntraop.AnesthesiologistName =  $scope.AscIntraop.AnesthesiologistName;
                        //}
                    }

                    if ($scope.AscIntraop.MedicationsReviewId == item.DoctorID) {
                        //var SuffixName = '';
                        //item.SuffixName = item.SuffixName || "";
                        //if (item.SuffixName != "") {
                        //    SuffixName = item.SuffixName + ',';
                        //}
                        var LicenseNumber = "";
                        item.LicenseNumber = item.LicenseNumber || "";
                        if (item.LicenseNumber != "") {
                            LicenseNumber = 'Lic:' + ' ' + item.LicenseNumber + ',';
                        }
                        $scope.AscIntraop.MedicationsReviewName = angular.copy(item.UserFullName + ' ' + LicenseNumber);
                        //if (item.SuffixId == 10) {
                        //    $scope.AscIntraop.MedicationsReviewName = angular.copy('Dr. ' + item.FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        //} else {
                        //    $scope.AscIntraop.MedicationsReviewName = angular.copy(item.FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        //}
                    }

                    if ($scope.AscIntraop.AnesthesiaMedicationsReviewId == item.DoctorID) {
                        //var SuffixName = '';
                        //item.SuffixName = item.SuffixName || "";
                        //if (item.SuffixName != "") {
                        //    SuffixName = item.SuffixName + ',';
                        //}
                        var LicenseNumber = "";
                        item.LicenseNumber = item.LicenseNumber || "";
                        if (item.LicenseNumber != "") {
                            LicenseNumber = 'Lic:' + ' ' + item.LicenseNumber + ',';
                        }
                        $scope.AscIntraop.AnesthesiaMedicationsReviewName = angular.copy(item.UserFullName + ' ' + LicenseNumber);
                        //if (item.SuffixId == 10) {
                        //    $scope.AscIntraop.AnesthesiaMedicationsReviewName = angular.copy('Dr. ' + item.FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        //} else {
                        //    $scope.AscIntraop.AnesthesiaMedicationsReviewName = angular.copy(item.FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        //}
                    }

                });

                var ArmsToTheBody = "";
                var Strap = "";
                var AnotherRailing = "";
                $scope.AscIntraop.NurseActions.SafetyDevicePosition = $scope.AscIntraop.NurseActions.SafetyDevicePosition || '';
                if ($scope.AscIntraop.NurseActions.SafetyDevicePosition != '') {
                    ArmsToTheBody = $scope.AscIntraop.NurseActions.SafetyDevicePosition.ArmsToTheBody;
                    Strap = $scope.AscIntraop.NurseActions.SafetyDevicePosition.Strap;
                    AnotherRailing = $scope.AscIntraop.NurseActions.SafetyDevicePosition.AnotherRailing;
                }

                var NurseFireRiskReviewdDate = $scope.AscIntraop.NurseActions.NurseFireRiskReviewdDate || "";
                $scope.AscIntraop.NurseActions.NurseFireRiskReviewdDate = $filter('date')(NurseFireRiskReviewdDate, 'MM-dd-yyyy hh:mm a') || '';

                var AnesthetistFireRiskReviewdDate = $scope.AscIntraop.NurseActions.AnesthetistReviewdDate || "";
                $scope.AscIntraop.NurseActions.AnesthetistReviewdDate = $filter('date')(AnesthetistFireRiskReviewdDate, 'MM-dd-yyyy hh:mm a') || '';

                var DoctorFireRiskReviewdDate = $scope.AscIntraop.NurseActions.DoctorReviewdDate || "";
                $scope.AscIntraop.NurseActions.DoctorReviewdDate = $filter('date')(DoctorFireRiskReviewdDate, 'MM-dd-yyyy hh:mm a') || '';

                var NurseFallRiskReviewdDate = $scope.AscIntraop.NurseActions.NurseFallRiskReviewdDate || "";
                $scope.AscIntraop.NurseActions.NurseFallRiskReviewdDate = $filter('date')(NurseFallRiskReviewdDate, 'MM-dd-yyyy hh:mm a') || '';

                var fallRiskProtocolType = '';
                if ($scope.AscIntraop.NurseActions.ImplementedFallRiskProtocol == true) {
                    fallRiskProtocolType = $scope.AscIntraop.NurseActions.ImplementedFallRiskProtocoltype || '';
                } else {
                    fallRiskProtocolType = ''
                }


                $scope.NurseActions = {
                    'Levelofconsciousness': $scope.AscIntraop.NurseActions.Levelofconsciousness || '',
                    'PatientPosition': $scope.AscIntraop.NurseActions.PatientPosition || '',
                    'ArmsToTheBody': ArmsToTheBody || '',
                    'Strap': Strap || '',
                    'AnotherRailing': AnotherRailing || '',
                    'SkinPreparation': $scope.AscIntraop.NurseActions.SkinPreparation || '',
                    'Sterilewater': $scope.AscIntraop.NurseActions.Sterilewater || '',
                    'Alcohol': $scope.AscIntraop.NurseActions.Alcohol || '',
                    'NurseActionOrganId': $scope.AscIntraop.NurseActions.NurseActionOrganId || '',
                    'NurseActionArea': $scope.AscIntraop.NurseActions.NurseActionArea || '',
                    'CropHour': $scope.AscIntraop.NurseActions.CropHour || '',
                    'levelofconsciousnessnotes': $scope.AscIntraop.NurseActions.LevelofconsciousnessNotes || '',
                    'Patientpositionnotes': $scope.AscIntraop.NurseActions.PatientPositionNotes || '',
                    'SafetyDevicePositionNotes': $scope.AscIntraop.NurseActions.SafetyDevicePositionNotes || '',
                    'SkinPreparationNotes': $scope.AscIntraop.NurseActions.SkinPreparationNotes || '',
                    'Areanotes': $scope.AscIntraop.NurseActions.AreaNotes || '',
                    'PatientTolerated': $scope.AscIntraop.NurseActions.PatientTolerated || false,
                    'Disposition': $scope.AscIntraop.NurseActions.Disposition || false,
                    'CarePostoperative': $scope.AscIntraop.NurseActions.CarePostoperative || false,
                    'Recoveryroom': $scope.AscIntraop.NurseActions.Recoveryroom || false,
                    'OthersIntraData': $scope.AscIntraop.NurseActions.OthersIntraData || '',
                    'PatientAlert': $scope.AscIntraop.PatientAlert || false,
                    'VitalsType': $scope.AscIntraop.VitalsType || '',
                    'EspecimenLab': $scope.AscIntraop.NurseActions.EspecimenLab || '',
                    'RiskLevel': $scope.AscIntraop.NurseActions.RiskLevel || '',
                    'FallRiskLevel': $scope.AscIntraop.NurseActions.FallRiskLevel || '',
                    'FallRiskAssessmentTotalScore': $scope.AscIntraop.NurseActions.FallRiskAssessmentTotalScore || 0,
                    'ImplementedFallRiskProtocoltype': fallRiskProtocolType || '',
                    //'HandOffReviewedByName': $scope.AscIntraop.NurseActions.HandOffReviewedByName || '',
                    //'HandOffTime': $scope.AscIntraop.NurseActions.HandOffTime || '',
                    //'HandoffRemarks': $scope.AscIntraop.NurseActions.HandoffRemarks || '',
                    'NurseFireRiskName': $scope.AscIntraop.NurseActions.NurseFireRiskName || '',
                    'NurseFireRiskLicenseNo': $scope.AscIntraop.NurseActions.NurseFireRiskLicenseNo || '',
                    'NurseFireRiskReviewdDate': $scope.AscIntraop.NurseActions.NurseFireRiskReviewdDate || '',
                    'AnesthetistFireRiskName': $scope.AscIntraop.NurseActions.AnesthetistFireRiskName || '',
                    'AnesthetistFireRiskLicenseNo': $scope.AscIntraop.NurseActions.AnesthetistFireRiskLicenseNo || '',
                    'AnesthetistReviewdDate': $scope.AscIntraop.NurseActions.AnesthetistReviewdDate || '',
                    'DoctorFireRiskName': $scope.AscIntraop.NurseActions.DoctorFireRiskName || '',
                    'DoctorFireRiskLicenseNo': $scope.AscIntraop.NurseActions.DoctorFireRiskLicenseNo || '',
                    'DoctorReviewdDate': $scope.AscIntraop.NurseActions.DoctorReviewdDate || '',
                    'NurseFallRiskName': $scope.AscIntraop.NurseActions.NurseFallRiskName || '',
                    'NurseFallRiskLicenseNo': $scope.AscIntraop.NurseActions.NurseFallRiskLicenseNo || '',
                    'NurseFallRiskReviewdDate': $scope.AscIntraop.NurseActions.NurseFallRiskReviewdDate || '',
                };
                $scope.SurgeryStaff = {
                    'SurgeonName': $scope.AscIntraop.NurseActions.SurgeonName || '',
                    'CoSurgeonName': $scope.AscIntraop.NurseActions.CoSurgeonName || '',
                    'TechnicianName': $scope.AscIntraop.NurseActions.TechnicianName || '',
                    'AnesthesistName': $scope.AscIntraop.NurseActions.AnesthesistName || '',
                    'ReliefName': $scope.AscIntraop.NurseActions.ReliefName || '',
                    'NurseName': $scope.AscIntraop.NurseActions.NurseName || '',
                    'SupportingStaffName': $scope.AscIntraop.NurseActions.SupportingStaffName || '',
                    'AdditionalStaffName': $scope.AscIntraop.NurseActions.AdditionalStaffName || '',
                    'AdditionalAnesthesistName': $scope.AscIntraop.NurseActions.SurgeryStaffAnesthesistName || '',
                };
                $scope.SurgeryTimes = {
                    'SurgeryRoomNo': $scope.AscIntraop.NurseActions.SurgeryRoomNo || '',
                    'HallEntranceStartTime': $scope.AscIntraop.NurseActions.HallEntranceStartTime || '',
                    'HallEntranceEndTime': $scope.AscIntraop.NurseActions.HallEntranceEndTime || '',
                    'AnesthesiaStartTime': $scope.AscIntraop.NurseActions.AnesthesiaStartTime || '',
                    'AnesthesiaEndTime': $scope.AscIntraop.NurseActions.AnesthesiaEndTime || '',
                    'SurgeryStartTime': $scope.AscIntraop.NurseActions.SurgeryStartTime || '',
                    'SurgeryEndTime': $scope.AscIntraop.NurseActions.SurgeryEndTime || '',
                    'RecoveryStartTime': $scope.AscIntraop.RecoveryStartTime || '',
                    'RecoveryStopTime': $scope.AscIntraop.RecoveryStopTime || '',
                    'BeforeAnesthesiaTime': $scope.AscIntraop.BeforeAnesthesiaTime || '',
                };

                var Nurselist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.AscIntraop.NurseActions.SurgicalFirstVerifiedBy }, true);
                Nurselist = Nurselist || [];
                if (Nurselist.length > 0) {
                    $scope.AscIntraop.NurseActions.SurgicalFirstVerifiedByName = angular.copy(Nurselist[0].FullName) || "";
                }

                var SNurselist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.AscIntraop.NurseActions.SurgicalSecondVerifiedBy }, true);
                SNurselist = SNurselist || [];
                if (SNurselist.length > 0) {
                    $scope.AscIntraop.NurseActions.SurgicalSecondVerifiedByName = angular.copy(SNurselist[0].FullName) || "";
                }

                var FNurselist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.AscIntraop.NurseActions.SurgicalFinalVerifiedBy }, true);
                FNurselist = FNurselist || [];
                if (FNurselist.length > 0) {
                    $scope.AscIntraop.NurseActions.SurgicalFinalVerifiedByName = angular.copy(FNurselist[0].FullName) || "";
                }

                $scope.SurgicalCount = {
                    'SurgicalFirstNeedles': $scope.AscIntraop.NurseActions.SurgicalFirstNeedles || '',
                    'SurgicalFirstBlades': $scope.AscIntraop.NurseActions.SurgicalFirstBlades || '',
                    'SurgicalFirstOthers': $scope.AscIntraop.NurseActions.SurgicalFirstOthers || '',
                    'SurgicalFirstVerifiedByName': $scope.AscIntraop.NurseActions.SurgicalFirstVerifiedByName || '',
                    'SurgicalFirstTime': $scope.AscIntraop.NurseActions.SurgicalFirstTime || '',
                    'SurgicalSecondNeedles': $scope.AscIntraop.NurseActions.SurgicalSecondNeedles || '',
                    'SurgicalSecondBlades': $scope.AscIntraop.NurseActions.SurgicalSecondBlades || '',
                    'SurgicalSecondOthers': $scope.AscIntraop.NurseActions.SurgicalSecondOthers || '',
                    'SurgicalSecondVerifiedByName': $scope.AscIntraop.NurseActions.SurgicalSecondVerifiedByName || '',
                    'SurgicalSecondTime': $scope.AscIntraop.NurseActions.SurgicalSecondTime || '',
                    'SurgicalFinalNeedles': $scope.AscIntraop.NurseActions.SurgicalFinalNeedles || '',
                    'SurgicalFinalBlades': $scope.AscIntraop.NurseActions.SurgicalFinalBlades || '',
                    'SurgicalFinalOthers': $scope.AscIntraop.NurseActions.SurgicalFinalOthers || '',
                    'SurgicalFinalVerifiedByName': $scope.AscIntraop.NurseActions.SurgicalFinalVerifiedByName || '',
                    'SurgicalFinalTime': $scope.AscIntraop.NurseActions.SurgicalFinalTime || '',
                };


                $scope.OverallModifiedDate = "";
                $scope.AscIntraop.ModifiedDt = $scope.AscIntraop.ModifiedDt || [];
                if ($scope.AscIntraop.ModifiedDt != "") {
                    var dateTimeString = $scope.AscIntraop.ModifiedDt || "";
                    $scope.OverallModifiedDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                }
                $scope.NurseReviewedDate = "";
                $scope.AscIntraop.NurseReviewedDate = $scope.AscIntraop.NurseReviewedDate || [];
                if ($scope.AscIntraop.NurseReviewedDate != "") {
                    var dateTimeString = $scope.AscIntraop.NurseReviewedDate || "";
                    $scope.NurseReviewedDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                }
                $scope.AnesthetistReviewedDate = "";
                $scope.AscIntraop.AnesthetistReviewedDate = $scope.AscIntraop.AnesthetistReviewedDate || [];
                if ($scope.AscIntraop.AnesthetistReviewedDate != "") {
                    var dateTimeString = $scope.AscIntraop.AnesthetistReviewedDate || "";
                    $scope.AnesthetistReviewedDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                }
                $scope.AnesthesiologistReviewedDate = "";
                $scope.AscIntraop.AnesthesiologistReviewedDate = $scope.AscIntraop.AnesthesiologistReviewedDate || [];
                if ($scope.AscIntraop.AnesthesiologistReviewedDate != "") {
                    var dateTimeString = $scope.AscIntraop.AnesthesiologistReviewedDate || "";
                    $scope.AnesthesiologistReviewedDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                }

                $scope.AscIntraop.IntraOPLastSignOffUserDetails = resp[0].data.IntraOPLastSignOffUserDetails || [];

                $scope.AscIntraop.ReviewedByobj = {
                    'DoctorName': $scope.AscIntraop.DoctorName || '',
                    'DoctorSuffix': $scope.AscIntraop.DoctorSuffix || '',
                    'DoctorLicense': $scope.AscIntraop.DoctorLicense || '',
                    'NurseName': $scope.AscIntraop.NurseName || '',
                    'NurseSuffix': $scope.AscIntraop.NurseSuffix || '',
                    'NurseLicense': $scope.AscIntraop.NurseLicense || '',
                    'AnesthesiaName': $scope.AscIntraop.AnesthesiaName || '',
                    'AnesthesiaSuffix': $scope.AscIntraop.AnesthesiaSuffix || '',
                    'AnesthesiaLicense': $scope.AscIntraop.AnesthesiaLicense || '',
                    'TechnicianName': $scope.AscIntraop.TechnicianName || '',
                    'TechnicianSuffix': $scope.AscIntraop.TechnicianSuffix || '',
                    'TechnicianLicense': $scope.AscIntraop.TechnicianLicense || '',
                    'ModifiedDate': $scope.OverallModifiedDate || '',
                    "AnesthesiologistName": $scope.AscIntraop.AnesthesiologistName || '',
                    "AnesthesiologistReviewedDate": $scope.AnesthesiologistReviewedDate || '',
                    "AnesthetistReviewedDate": $scope.AnesthetistReviewedDate || '',
                    "NurseReviewedDate": $scope.NurseReviewedDate || '',
                    "AnesthesiologistSuffix": $scope.AscIntraop.AnesthesiologistSuffix || '',
                    "AnesthesiologistLicense": $scope.AscIntraop.AnesthesiologistLicense || ''
                };
                $scope.Oxygenobj = {
                    'OxygenQuantity': $scope.AscIntraop.OxygenQuantity || '',
                    'EndotrachealTubeNotes': $scope.AscIntraop.EndotrachealTubeNotes || '',
                    'LMANotes': $scope.AscIntraop.LMANotes || '',
                    'OxygenType': $scope.AscIntraop.OxygenType || '',
                    'IntakeValue': $scope.AscIntraop.AnesthetistActions.IntakeValue || '',
                    'OutputValue': $scope.AscIntraop.AnesthetistActions.OutputValue || '',
                    'EBLValue': $scope.AscIntraop.AnesthetistActions.EBLValue || '',
                };

                //var base64Img = '';
                //$scope.AscIntraop.S3URL = $scope.AscIntraop.S3URL || '';
                //if ($scope.AscIntraop.S3URL !== '') {
                //    $scope.toDataURL($scope.AscIntraop.S3URL, function (dataURL) {
                //        base64Img = dataURL;
                //        $timeout(function () {
                //            $scope.AscIntraop.BaseURL = base64Img;
                //        }, 500);
                //    });
                //} else {
                //    $scope.AscIntraop.BaseURL = base64Img;
                //}

                $scope.AscIntraop.Cauteraisation = $scope.AscIntraop.Cauteraisation || [];
                if ($scope.AscIntraop.Cauteraisation.length > 0) {
                    $scope.CauteraisationArray = $filter("filter")($scope.AscIntraop.Cauteraisation, { "IsChecked": true }, true);
                }

                $scope.IntraOpAnesthetistVitals = [];
                $scope.AnesthetistVitals = angular.copy($scope.GetAnesthetistVitals());
                if ($scope.AscIntraop.AnesthetistActions.AnesthesiaVitalsArray.length > 0) {
                    angular.forEach($scope.AscIntraop.AnesthetistActions.AnesthesiaVitalsArray, function (item) {
                        angular.forEach($scope.AnesthetistVitals, function (kitem) {
                            if (kitem.Id === 1 && kitem.Id === item.VitalId) {
                                let obj = {
                                    "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                    "VitalName": "Systolic Pressure",
                                    "MainId": 1,
                                    "Value": item.Value,
                                    "DeleteInd": item.DeleteInd || 'N',
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
                                    "DeleteInd": item.DeleteInd || 'N',
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
                                    "DeleteInd": item.DeleteInd || 'N',
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
                                    "DeleteInd": item.DeleteInd || 'N',
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
                                    "DeleteInd": item.DeleteInd || 'N',
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
                                    "DeleteInd": item.DeleteInd || 'N',
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
                                    "DeleteInd": item.DeleteInd || 'N',
                                    "VitalSlotTime": item.VitalSlotTime,
                                };
                                kitem.VitalReadingList.push(obj);
                            }
                            if (kitem.Id === 9 && kitem.Id === item.VitalId) {
                                let obj = {
                                    "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                    "VitalName": "Temparature",
                                    "MainId": 9,
                                    "Value": item.Value,
                                    "DeleteInd": item.DeleteInd || 'N',
                                    "VitalSlotTime": item.VitalSlotTime,
                                };
                                kitem.VitalReadingList.push(obj);
                            }
                            if (kitem.Id === 10 && kitem.Id === item.VitalId) {
                                let obj = {
                                    "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                    "VitalName": "Note",
                                    "MainId": 10,
                                    "Value": item.Value,
                                    "DeleteInd": item.DeleteInd || 'N',
                                    "VitalSlotTime": item.VitalSlotTime,
                                };
                                kitem.VitalReadingList.push(obj);
                            }
                        });
                    });

                    angular.forEach($scope.AnesthetistVitals, function (item) {
                        angular.forEach(item.VitalReadingList, function (kitem) {
                            let splitarray = kitem.VitalSlotTime.split(":");
                            let stringCounter = splitarray.join("");
                            let counter = parseInt(stringCounter);
                            kitem.counter = counter;
                        });

                        // arranging in ascending order of time
                        if (item.VitalReadingList.length > 0) {
                            let filteredData = $filter('orderBy')(item.VitalReadingList, 'counter');
                            item.VitalReadingList = angular.copy(filteredData);
                        }
                    });

                    $scope.NewTimeSlots = [];

                    let tempArray = $filter('filter')($scope.AnesthetistVitals, { 'VitalName': 'Systolic Pressure' }, true) || [];
                    if (tempArray.length > 0) {
                        tempArray[0].VitalReadingList = tempArray[0].VitalReadingList || [];
                        if (tempArray[0].VitalReadingList.length > 0) {
                            angular.forEach(tempArray[0].VitalReadingList, function (kitem) {
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

                //$scope.anesthesiamedications = [];
                //if ($scope.AscIntraop.AnesthesiaMedications.length > 0) {
                //    $scope.anesthesiamedications = $filter('filter')($scope.AscIntraop.AnesthesiaMedications, { 'IsChecked': true }, true);
                //} else {
                //    $scope.anesthesiamedications = [];
                //}


                var ReviewedByanethelogistArray = [];
                if ($scope.AscIntraop.ReviewAnesthetistId !== 0 && $scope.ReviewedByanethelogist.length > 0) {
                    ReviewedByanethelogistArray = $filter("filter")($scope.ReviewedByanethelogist, function (kitem) { return kitem.DoctorID == $scope.AscIntraop.ReviewAnesthetistId }, true);
                }
                else {
                    ReviewedByanethelogistArray = [];
                }

                $scope.ModifiedAnesthesiaDate = "";
                $scope.ModifiedIntraopDate = "";

                //if ($scope.AscIntraop.AnesthesiaMedications.length > 0) {
                //    angular.forEach($scope.AscIntraop.AnesthesiaMedications, function (hitem) {
                //        var dateTimeString = hitem.ModifiedDt;
                //        $scope.ModifiedAnesthesiaDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');

                //    });
                //}
                //$scope.AscIntraop.IntraOpMedications = $scope.AscIntraop.IntraOpMedications || [];
                //if ($scope.AscIntraop.IntraOpMedications.length > 0) {
                //    angular.forEach($scope.AscIntraop.IntraOpMedications, function (hitem) {
                //        var dateTimeString = hitem.ModifiedDt;
                //        $scope.ModifiedIntraopDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                //    });
                //}

                var IntraOpOrderListArray = [];
                IntraOpOrderListArray = $filter('filter')($scope.AscIntraop.OrderDetails, { 'MedTypeId': 4 }, true) || [];

                var IntraOpOrderAnesthesia = [];
                IntraOpOrderAnesthesia = $filter('filter')($scope.AscIntraop.OrderDetails, { 'MedTypeId': 3 }, true) || [];
                // Modified date


                $scope.ModifiedDate = "";
                $scope.AscIntraop.PatientAscChecklist = $scope.AscIntraop.PatientAscChecklist || [];
                if ($scope.AscIntraop.PatientAscChecklist.length > 0) {
                    var dateTimeString = $scope.AscIntraop.PatientAscChecklist[0].ModifiedDt || "";
                    $scope.ModifiedDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                }

                var SubOrganList = [];
                if ($scope.AscIntraop.SubOrganList.length > 0) {
                    SubOrganList = $filter('filter')($scope.AscIntraop.SubOrganList, { "IsSelected": true }, true);
                } else {
                    SubOrganList = [];
                }



                /*  ----- *  ----- */
            }

            /* Intra-op-Anesthesia Print - End */

            /* Post-op - Start */

            $scope.AscPostOp.PostOpLastSignOffUserDetails = resp[0].data.PostOpLastSignOffUserDetails || [];
            $scope.AscPostopanesthesiaTypeList = [];

            let Postopindex = resp[0].data.PostOP.length;
            if (resp[0].data.PostOP.length > 0) {

                var postopresp = angular.copy(resp[0].data.PostOP[0]);

                let anesthesiaTypelist = postopresp.IntraOPAnesthesiaTypelist || [];
                if (anesthesiaTypelist && anesthesiaTypelist.length > 0) {
                    $scope.AscPostopanesthesiaTypeList = $filter('filter')(anesthesiaTypelist, { 'IsSelected': true }, true);
                }

                postopresp.NurseCheckLists = postopresp.NurseCheckLists || [];
                if (postopresp.NurseCheckLists.length > 0) {
                    $scope.AscPostOp.NurseChart.Checklists.PostOPNurseCheckListId = postopresp.NurseCheckLists[0].PostOPNurseCheckListId;
                    $scope.AscPostOp.NurseChart.Checklists.PatientReceived = postopresp.NurseCheckLists[0].PatientReceived;
                    $scope.AscPostOp.NurseChart.Checklists.AccompaniedBy = postopresp.NurseCheckLists[0].AccompaniedBy;
                    $scope.AscPostOp.NurseChart.Checklists.PainLevel = postopresp.NurseCheckLists[0].PainLevel || '';
                    $scope.AscPostOp.NurseChart.Checklists.PainLevelRemarks = postopresp.NurseCheckLists[0].PainLevelRemarks;
                    $scope.AscPostOp.NurseChart.Checklists.NourishmentProvider = postopresp.NurseCheckLists[0].NourishmentProvider;
                    $scope.AscPostOp.NurseChart.Checklists.BloodSugar = postopresp.NurseCheckLists[0].BloodSugar;
                    $scope.AscPostOp.NurseChart.Checklists.PostOpInstruction = postopresp.NurseCheckLists[0].PostOpInstruction;
                    $scope.AscPostOp.NurseChart.Checklists.ReceivedRoom = postopresp.NurseCheckLists[0].ReceivedRoom;
                    $scope.AscPostOp.NurseChart.Checklists.Patientallowed = postopresp.NurseCheckLists[0].Patientallowed;
                    $scope.AscPostOp.NurseChart.Checklists.Personalbelonging = postopresp.NurseCheckLists[0].Personalbelonging;
                    $scope.AscPostOp.NurseChart.Checklists.Patientadvised = postopresp.NurseCheckLists[0].Patientadvised;
                    $scope.AscPostOp.NurseChart.Checklists.PatientClinic = postopresp.NurseCheckLists[0].PatientClinic;
                    $scope.AscPostOp.NurseChart.Checklists.Physicianexamine = postopresp.NurseCheckLists[0].Physicianexamine;
                    $scope.AscPostOp.NurseChart.Checklists.Removedintact = postopresp.NurseCheckLists[0].Removedintact;
                    $scope.AscPostOp.NurseChart.Checklists.Orientedtimes = postopresp.NurseCheckLists[0].Orientedtimes;
                    $scope.AscPostOp.NurseChart.Checklists.OtherMental = postopresp.NurseCheckLists[0].OtherMental;
                    $scope.AscPostOp.NurseChart.Checklists.Notes = postopresp.NurseCheckLists[0].Notes;
                    $scope.AscPostOp.NurseChart.Checklists.ProgressBloodSugarNotes = postopresp.NurseCheckLists[0].ProgressBloodSugarNotes || '';
                    $scope.AscPostOp.NurseChart.Checklists.PostOpInstructionNotes = postopresp.NurseCheckLists[0].PostOpInstructionNotes || '';
                }

                postopresp.NurseActions = postopresp.NurseActions || [];
                if (postopresp.NurseActions.length > 0) {
                    $scope.AscPostOp.NurseChart.Actions.PostOPNurseActionId = postopresp.NurseActions[0].PostOPNurseActionId;
                    $scope.AscPostOp.NurseChart.Actions.Speech = postopresp.NurseActions[0].Speech;
                    $scope.AscPostOp.NurseChart.Actions.Vision = postopresp.NurseActions[0].Vision;
                    $scope.AscPostOp.NurseChart.Actions.Pain = postopresp.NurseActions[0].Pain;
                    $scope.AscPostOp.NurseChart.Actions.ConsciousLevel = postopresp.NurseActions[0].ConsciousLevel;
                    $scope.AscPostOp.NurseChart.Actions.Fur = postopresp.NurseActions[0].Fur;
                    $scope.AscPostOp.NurseChart.Actions.IncisionlaDrainage = postopresp.NurseActions[0].IncisionlaDrainage;
                    $scope.AscPostOp.NurseChart.Actions.Nausea = postopresp.NurseActions[0].Nausea;
                    $scope.AscPostOp.NurseChart.Actions.IngestedFood = postopresp.NurseActions[0].IngestedFood;
                    $scope.AscPostOp.NurseChart.Actions.Referred = postopresp.NurseActions[0].Referred;
                    $scope.AscPostOp.NurseChart.Actions.Relationship = postopresp.NurseActions[0].Relationship;
                    $scope.AscPostOp.NurseChart.Actions.Exit = postopresp.NurseActions[0].Exit;
                    $scope.AscPostOp.NurseChart.Actions.Instruction = postopresp.NurseActions[0].Instruction;
                    $scope.AscPostOp.NurseChart.Actions.Prescription = postopresp.NurseActions[0].Prescription;
                    $scope.AscPostOp.NurseChart.Actions.LensCard = postopresp.NurseActions[0].LensCard;
                    $scope.AscPostOp.NurseChart.Actions.Surveillance = postopresp.NurseActions[0].Surveillance;
                    $scope.AscPostOp.NurseChart.Actions.Bandage = postopresp.NurseActions[0].Bandage;
                    $scope.AscPostOp.NurseChart.Actions.Advancediet = postopresp.NurseActions[0].Advancediet;
                    $scope.AscPostOp.NurseChart.Actions.Discharge = postopresp.NurseActions[0].Discharge;
                    $scope.AscPostOp.NurseChart.Actions.Administer = postopresp.NurseActions[0].Administer;
                    $scope.AscPostOp.NurseChart.Actions.Tylenol = postopresp.NurseActions[0].Tylenol;
                    $scope.AscPostOp.NurseChart.Actions.Review = postopresp.NurseActions[0].Review;
                    $scope.AscPostOp.NurseChart.Actions.Notes = postopresp.NurseActions[0].Notes;
                }

                resp[0].data.IntrOpHandOffTime = resp[0].data.IntrOpHandOffTime || '';
                if (resp[0].data.IntrOpHandOffTime != "" && resp[0].data.IntrOpHandOffTime != "00:00:00") {
                    let dummydatetime = "2024-01-01" + " " + resp[0].data.IntrOpHandOffTime;
                    let time = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");
                    $scope.AscPostOp.IntrOpHandOffTime = angular.copy(time);
                }
                $scope.AscPostOp.IntraOpHandOffReviewedByname = angular.copy(resp[0].data.IntraOpHandOffReviewedByname) || '';

                postopresp.AnesthesiaReviewedBy = postopresp.AnesthesiaReviewedBy || null;
                if (postopresp.AnesthesiaReviewedBy != 0 || postopresp.AnesthesiaReviewedBy != null) {
                    var list = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == postopresp.AnesthesiaReviewedBy }) || [];
                    if (list.length > 0) {
                        $scope.AscPostOp.ReviewedByName = angular.copy(list[0].FirstName + ' ' + list[0].LastName + list[0].SuffixName);
                    }
                }

                angular.forEach($scope.allUserList, function (item) {

                    if (postopresp.ReviewDoctorId == item.DoctorID) {
                        $scope.AscPostOp.DoctorName = item.FirstName + ' ' + item.LastName;
                        $scope.AscPostOp.DoctorSuffix = item.SuffixName;
                        $scope.AscPostOp.DoctorLicense = item.LicenseNumber;
                        //if (item.SuffixId == 10) {
                        //    $scope.AscPostOp.DoctorName = ' Dr. ' + $scope.AscPostOp.DoctorName;
                        //}
                    }

                    if (postopresp.ReviewNurseId == item.DoctorID) {
                        $scope.AscPostOp.NurseName = item.FirstName + ' ' + item.LastName;
                        $scope.AscPostOp.NurseSuffix = item.SuffixName;
                        $scope.AscPostOp.NurseLicense = item.LicenseNumber;
                    }

                    if (postopresp.ReviewAnesthetistId == item.DoctorID) {
                        $scope.AscPostOp.AnesthesiaName = item.FirstName + ' ' + item.LastName;
                        $scope.AscPostOp.AnesthesiaSuffix = item.SuffixName;
                        $scope.AscPostOp.AnesthesiaLicense = item.LicenseNumber;
                        //if (item.SuffixId == 10) {
                        //    $scope.AscPostOp.AnesthesiaName = ' Dr. ' + $scope.AscPostOp.AnesthesiaName;
                        //}
                    }

                    if (postopresp.ReviewTechnicianId == item.DoctorID) {
                        $scope.AscPostOp.TechnicianName = item.FullName;
                        $scope.AscPostOp.TechnicianSuffix = item.SuffixName;
                        $scope.AscPostOp.TechnicianLicense = item.LicenseNumber;
                    }

                    if (postopresp.CheckInReviewDoctorId == item.DoctorID) {

                        var License = '';
                        //var Suffix = '';

                        //if (item.SuffixName !== '') {
                        //    Suffix = item.SuffixName + ',';
                        //}
                        if (item.LicenseNumber !== '') {
                            License = 'Lic: ' + item.LicenseNumber;
                        }

                        $scope.AscPostOp.CheckInReviewDoctorName = item.UserFullName + ' ' + License;

                        //if (item.SuffixId == 10) {
                        //    $scope.AscPostOp.CheckInReviewDoctorName = ' Dr. ' + item.FullName + ' ' + Suffix + ' ' + License;
                        //} else {
                        //    $scope.AscPostOp.CheckInReviewDoctorName = item.FullName + ' ' + Suffix + ' ' + License;
                        //}
                    }

                    if (postopresp.CheckInReviewNurseId == item.DoctorID) {

                        var License = '';
                        //var Suffix = '';

                        //if (item.SuffixName !== '') {
                        //    Suffix = item.SuffixName + ',';
                        //}
                        if (item.LicenseNumber !== '') {
                            License = 'Lic: ' + item.LicenseNumber;
                        }
                        $scope.AscPostOp.CheckInReviewNurseName = item.UserFullName + ' ' + License;

                        //if (item.SuffixId == 10) {
                        //    $scope.AscPostOp.CheckInReviewNurseName = ' Dr. ' + item.FullName + ' ' + Suffix + ' ' + License;
                        //} else {
                        //    $scope.AscPostOp.CheckInReviewNurseName = item.FullName + ' ' + Suffix + ' ' + License;
                        //}
                    }

                    if (postopresp.CheckInReviewAnesthetistId == item.DoctorID) {

                        var License = '';
                        //var Suffix = '';

                        //if (item.SuffixName !== '') {
                        //    Suffix = item.SuffixName + ',';
                        //}
                        if (item.LicenseNumber !== '') {
                            License = 'Lic: ' + item.LicenseNumber;
                        }

                        $scope.AscPostOp.CheckInReviewAnesthetistName = item.UserFullName + ' ' + License;
                        //if (item.SuffixId == 10) {
                        //    $scope.AscPostOp.CheckInReviewAnesthetistName = ' Dr. ' + item.FullName + ' ' + Suffix + ' ' + License;
                        //} else {
                        //    $scope.AscPostOp.CheckInReviewAnesthetistName = item.FullName + ' ' + Suffix + ' ' + License;
                        //}
                    }

                    if (postopresp.MedicationsReviewId == item.DoctorID) {

                        var License = '';
                        //var Suffix = '';

                        //if (item.SuffixName !== '') {
                        //    Suffix = item.SuffixName + ',';
                        //}
                        if (item.LicenseNumber !== '') {
                            License = 'Lic: ' + item.LicenseNumber;
                        }
                        $scope.AscPostOp.MedicationsReviewName = item.UserFullName + ' ' + License;
                        //if (item.SuffixId == 10) {
                        //    $scope.AscPostOp.MedicationsReviewName = ' Dr. ' + item.FullName + ' ' + Suffix + ' ' + License;
                        //} else {
                        //    $scope.AscPostOp.MedicationsReviewName = item.FullName + ' ' + Suffix + ' ' + License;
                        //}
                    }



                });

                // Modified Date 

                var ModifiedDate = "";
                $scope.AscPostOp.ModifiedDt = postopresp.ModifiedDt || "";
                if ($scope.AscPostOp.ModifiedDt != "") {
                    var dateTimeString = $scope.AscPostOp.ModifiedDt || "";
                    ModifiedDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                }
                var NurseReviewedDate = "";
                $scope.AscPostOp.NurseReviewedDate = postopresp.NurseReviewedDate || "";
                if ($scope.AscPostOp.NurseReviewedDate != "") {
                    var dateTimeString = $scope.AscPostOp.NurseReviewedDate || "";
                    NurseReviewedDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                }
                var AnesthetistReviewedDate = "";
                $scope.AscPostOp.AnesthetistReviewedDate = postopresp.AnesthetistReviewedDate || "";
                if ($scope.AscPostOp.ModifiedDt != "") {
                    var dateTimeString = $scope.AscPostOp.AnesthetistReviewedDate || "";
                    AnesthetistReviewedDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                }

                $scope.AscPostOp.PostopReviewedByobj = {
                    'DoctorName': $scope.AscPostOp.DoctorName || '',
                    'DoctorSuffix': $scope.AscPostOp.DoctorSuffix || '',
                    'DoctorLicense': $scope.AscPostOp.DoctorLicense || '',
                    'NurseName': $scope.AscPostOp.NurseName || '',
                    'NurseSuffix': $scope.AscPostOp.NurseSuffix || '',
                    'NurseLicense': $scope.AscPostOp.NurseLicense || '',
                    'AnesthesiaName': $scope.AscPostOp.AnesthesiaName || '',
                    'AnesthesiaSuffix': $scope.AscPostOp.AnesthesiaSuffix || '',
                    'AnesthesiaLicense': $scope.AscPostOp.AnesthesiaLicense || '',
                    'TechnicianName': $scope.AscPostOp.TechnicianName || '',
                    'TechnicianSuffix': $scope.AscPostOp.TechnicianSuffix || '',
                    'TechnicianLicense': $scope.AscPostOp.TechnicianLicense || '',
                    "ModifiedDate": ModifiedDate,
                    "AnesthetistReviewedDate": AnesthetistReviewedDate,
                    "NurseReviewedDate": NurseReviewedDate,
                };
                $scope.AscPostOp.BaseURL = postopresp.BaseURL || '';
                //var base64Img = '';
                //postopresp.S3URL = postopresp.S3URL || '';
                //if (postopresp.S3URL !== '') {
                //    $scope.toDataURL(postopresp.S3URL, function (dataURL) {
                //        base64Img = dataURL;
                //        $timeout(function () {
                //            $scope.AscPostOp.BaseURL = base64Img;
                //        }, 500);
                //    });
                //} else {
                //    $scope.AscPostOp.BaseURL = base64Img;
                //}

                //$scope.AscPostOp.AnesthesiaTypelist = postopresp.AnesthesiaTypelist || [];
                //if ($scope.AscPostOp.AnesthesiaTypelist.length > 0) {
                //    let PostopAnesthesiaList = angular.copy($scope.PostopAnesthesiaList);
                //    angular.forEach(PostopAnesthesiaList, function (item) {
                //        angular.forEach($scope.AscPostOp.AnesthesiaTypelist, function (Aitem) {
                //            if (Aitem.AnesthesiaTypeId == item.AnesthesiaTypeId) {
                //                item.IsSelected = Aitem.IsSelected;
                //                item.PatientAnesthesiaPlanId = Aitem.PatientAnesthesiaPlanId;
                //            }
                //        });
                //        $scope.AscPostOp.AnesthesiaTypelist = angular.copy(PostopAnesthesiaList);
                //    });
                //}

                //$scope.AscPostopanesthesiaTypeList = [];
                //if ($scope.AscPostOp.AnesthesiaTypelist.length > 0) {
                //    $scope.AscPostopanesthesiaTypeList = $filter('filter')($scope.AscPostOp.AnesthesiaTypelist, { 'IsSelected': true }, true);
                //} else {
                //    $scope.AscPostopanesthesiaTypeList = [];
                //}

                $scope.AscPostOp.DiscontinueIVTime = postopresp.DiscontinueIVTime || '';
                $scope.AscPostOp.PatientDischargeTime = postopresp.PatientDischargeTime || '';

                $scope.AscPostOp.OrderDetails = postopresp.OrderDetails || [];

                angular.forEach($scope.AscPostOp.OrderDetails, function (kitem) {
                    if (kitem.ReviewedBy != null) {
                        let ReviewedByName = '';
                        var Arraylist = $filter("filter")($scope.allUserList, function (pitem) { return pitem.DoctorID == kitem.ReviewedBy }, true) || [];
                        if (Arraylist.length > 0) {
                            ReviewedByName = Arraylist[0].FirstName + ' ' + Arraylist[0].LastName + ' ' + Arraylist[0].SuffixName;
                            kitem.ReviewedByName = ReviewedByName;
                        }

                    }
                });
                $scope.AscPostOp.AnesthesiaTypelist = postopresp.AnesthesiaTypelist || [];
                $scope.AscPostOp.PostOpNotes = postopresp.PostOpNotes || null;
                $scope.AscPostOp.PostOpAnesthesiaNotes = postopresp.PostOpAnesthesiaNotes || null;
                $scope.AscPostOp.IsPatientDischarge = postopresp.IsPatientDischarge || false;
                $scope.AscPostOp.ProgressNotesPainScore = postopresp.ProgressNotesPainScore;

                $scope.AscPostOp.IntraOpAnesthesiaStartTime = postopresp.IntraOpAnesthesiaStartTime || '';
                $scope.AscPostOp.IntraOpAnesthesiaEndTime = postopresp.IntraOpAnesthesiaEndTime || '';

                //$scope.AscPostopanesthesiaTypeList = [];
                //$scope.AscPostopanesthesiaTypeList = $filter('filter')($scope.AscPostOp.AnesthesiaTypelist, { 'IsSelected': true }, true);

                $scope.AldreteDetails = angular.copy($scope.GetAldreteDetails());

                $scope.AscPostOp.AldreteDetails = postopresp.AldreteDetails || [];
                if ($scope.AscPostOp.AldreteDetails.length > 0) {
                    angular.forEach($scope.AscPostOp.AldreteDetails, function (item) {
                        angular.forEach($scope.AldreteDetails, function (kitem) {
                            if (item.AldreteVitalId === kitem.AldreteVitalId) {
                                if (item.Score !== 0) {
                                    item.Score = item.Score || null;
                                }

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

                $scope.AldreteDetailsArray = [];
                if ($scope.AldreteDetails.length > 0) {
                    angular.forEach($scope.AldreteDetails, function (Aitem) {
                        if (Aitem.AldreteValues.length > 0) {
                            $scope.AldreteDetailsArray.push(Aitem);
                        }
                    })
                }
                else {
                    $scope.AldreteDetailsArray = [];
                }

                $scope.AldreteTotalScoreDetails = [];
                $scope.AscPostOp.AldreteTotalScoreDetails = postopresp.AldreteTotalScoreDetails || [];
                if ($scope.AscPostOp.AldreteTotalScoreDetails.length > 0) {
                    angular.forEach($scope.AscPostOp.AldreteTotalScoreDetails, function (item) {
                        let obj = {
                            "PostOPAnesthesiaTotalScoreId": item.PostOPAnesthesiaTotalScoreId || null,
                            "AldreteSlotTime": item.AldreteSlotTime,
                            "TotalScore": item.TotalScore,
                            "DeleteInd": "N"
                        }
                        $scope.AldreteTotalScoreDetails.push(obj);
                    });
                }

                $scope.PostOpMedications = [];
                $scope.ModifiedPostopDate = "";

                postopresp.PostOpMedications = postopresp.PostOpMedications || [];
                if (postopresp.PostOpMedications.length > 0) {
                    angular.forEach(postopresp.PostOpMedications, function (item) {
                        angular.forEach($scope.AscPostOp.PostOpMedications, function (hitem) {
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

                            item.ModifiedDt = item.ModifiedDt || '';
                            if (item.ModifiedDt != '') {
                                $scope.ModifiedPostopDate = $filter('date')(item.ModifiedDt, 'MM-dd-yyyy hh:mm a');
                            }

                        });
                    });
                }

                $scope.AscPostOp.PostOpMedications = $scope.AscPostOp.PostOpMedications || [];
                if ($scope.AscPostOp.PostOpMedications.length > 0) {
                    angular.forEach($scope.AscPostOp.PostOpMedications, function (item) {
                        if (item.IsChecked) {
                            $scope.PostOpMedications.push(item);
                        }
                    })
                }
                else {
                    $scope.PostOpMedications = [];
                }

                // patient goals functionality
                $scope.nurseList = [];
                $scope.AscPostOp.PatientAscPatientGoal = postopresp.PatientAscPatientGoal || [];
                if ($scope.AscPostOp.PatientAscPatientGoal.length > 0) {
                    angular.forEach($scope.AscPostOp.PatientAscPatientGoal, function (item) {
                        angular.forEach($scope.MasterAscPatientGoal, function (kitem) {
                            if (kitem.MasterPatientGoalId === item.MasterPatientGoalId) {
                                kitem.Value = item.Value || "";
                                kitem.ASCPatientGoalId = item.ASCPatientGoalId || null;
                            }
                        });
                    });
                }

                $scope.nurseList = [];
                if ($scope.IsShowEmptyASCChecklist) {
                    if ($scope.MasterAscPatientGoal && $scope.MasterAscPatientGoal.length > 0) {
                        angular.forEach($scope.MasterAscPatientGoal, function (item) {
                            $scope.nurseList.push(item);
                        });
                    }
                } else {
                    if ($scope.MasterAscPatientGoal && $scope.MasterAscPatientGoal.length > 0) {
                        angular.forEach($scope.MasterAscPatientGoal, function (item) {
                            if (item.Value) {
                                $scope.nurseList.push(item);
                            }
                        });
                    }
                }


                $scope.PostopReviewedByanethelogistArray = [];
                $scope.AscPostOp.ReviewAnesthetistId = postopresp.ReviewAnesthetistId || 0;
                if ($scope.AscPostOp.ReviewAnesthetistId !== 0 && $scope.ReviewedByanethelogist.length > 0) {
                    $scope.PostopReviewedByanethelogistArray = $filter("filter")($scope.ReviewedByanethelogist, function (kitem) { return kitem.DoctorID == $scope.AscPostOp.ReviewAnesthetistId }, true);
                }
                else {
                    $scope.PostopReviewedByanethelogistArray = [];
                }

                resp[0].data.IntraOpHallEndTime = resp[0].data.IntraOpHallEndTime || "";
                if (resp[0].data.IntraOpHallEndTime != "") {
                    let dummydatetime = "2024-01-01" + " " + resp[0].data.IntraOpHallEndTime;
                    let time = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");
                    $scope.AscPostOp.RecoveryStartTime = angular.copy(time);
                }

                postopresp.RecoveryStartTime = postopresp.RecoveryStartTime || '';
                if (postopresp.RecoveryStartTime != '') {
                    $scope.AscPostOp.RecoveryStartTime = angular.copy(postopresp.RecoveryStartTime);
                }

                if ($scope.AscPostOp.NurseChart.Checklists.ProgressBloodSugarNotes != '' || $scope.AscPostOp.NurseChart.Checklists.PostOpInstructionNotes != '') {
                    angular.forEach($scope.AscPostOp.OrgASCChecklist, function (item) {
                        if (item.CheckListId == 134 && $scope.AscPostOp.NurseChart.Checklists.ProgressBloodSugarNotes != '') {
                            item.Value = $scope.AscPostOp.NurseChart.Checklists.ProgressBloodSugarNotes || '';
                            item.IsChecked = true;
                            postopresp.OrgAscChecklist.push(item);
                        }
                        if (item.CheckListId == 135 && $scope.AscPostOp.NurseChart.Checklists.PostOpInstructionNotes != '') {
                            item.Value = $scope.AscPostOp.NurseChart.Checklists.PostOpInstructionNotes || '';
                            item.IsChecked = true;
                            postopresp.OrgAscChecklist.push(item);
                        }
                    });
                }

                postopresp.OrgAscChecklist = postopresp.OrgAscChecklist || [];
                if (postopresp.OrgAscChecklist.length > 0) {
                    angular.forEach(postopresp.OrgAscChecklist, function (item) {
                        angular.forEach($scope.AscPostOp.OrgASCChecklist, function (hitem) {
                            if (hitem.CheckListId == 139 && !$scope.ParentObj.IsIOJParentOrganization && $scope.AscPostOp.ProgressNotesPainScore !== null) {
                                hitem.IsChecked = true;
                            }
                            if (hitem.CheckListCategoryId === item.CheckListCategoryId && item.CheckListId === hitem.CheckListId) {
                                if (item.CheckListId == 132 || item.CheckListId == 136 || item.CheckListId == 152) {
                                    if (item.AscMultiCheckValueArray.length > 0) {
                                        angular.forEach(item.AscMultiCheckValueArray, function (jitem) {
                                            angular.forEach(hitem.OrganizationCheckListDetails, function (Oitem) {
                                                if (Oitem.OrganizationPreOpCheckListValueId == jitem.OrganizationPreOpCheckListValueId) {
                                                    Oitem.IsChecked = true;
                                                    hitem.IsChecked = true;
                                                }
                                            });
                                        });
                                    }
                                } else {
                                    angular.forEach(hitem.OrganizationCheckListDetails, function (kitem) {
                                        if (kitem.Value == item.Value && kitem.CheckListId === item.CheckListId) {
                                            kitem.IsChecked = true;
                                            hitem.IsChecked = true;
                                            hitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || 0;
                                            kitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || 0;
                                            hitem.Value = item.Value || '';
                                        } else {
                                            kitem.IsChecked = false;
                                        }
                                    });
                                }
                            }
                        });
                    });
                }

                $scope.PostopOrgASCChecklist = $filter('filter')($scope.AscPostOp.OrgASCChecklist, { IsChecked: true, CheckListCategoryId: 4 }, true) || [];

                var PostOpcheckListArray = [];
                //PostOpcheckListArray = $filter('filter')($scope.AscPostOp.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 1, 'IsChecked': true }, true) || [];

                PostOpcheckListArray = $filter('orderBy')($filter('filter')($scope.AscPostOp.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 1 }, true),
                    'OrgOrderBy',   // field name to sort by
                    false           // false = ascending, true = descending
                ) || [];



                $scope.PostOpNurseInterventions = [];
                var PostOpProgressNotesArray = [];
                var PostOpGeneralOrderArray = [];
                var PostOpCheckOutArray = [];
                var PostOpCallListArray = [];

                if ($scope.IsShowEmptyASCChecklist) {
                    PostOpProgressNotesArray = $filter('filter')($scope.AscPostOp.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 18 }, true) || [];
                    PostOpGeneralOrderArray = $filter('orderBy')($filter('filter')($scope.AscPostOp.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 19 }, true), 'OrgOrderBy', false) || [];
                    PostOpCheckOutArray = $filter('orderBy')($filter('filter')($scope.AscPostOp.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 2 }, true), 'OrgOrderBy', false) || [];
                    PostOpCallListArray = $filter('filter')($scope.AscPostOp.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 21 }, true) || [];
                    $scope.PostOpNurseInterventions = $filter('filter')($scope.AscPostOp.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListCategoryId': 16 }, true) || [];
                } else {
                    PostOpProgressNotesArray = $filter('filter')($scope.AscPostOp.OrgASCChecklist, { 'CheckListModuleId': 3, 'IsChecked': true, 'CheckListSubTypeId': 18 }, true) || [];
                    PostOpGeneralOrderArray = $filter('orderBy')($filter('filter')($scope.AscPostOp.OrgASCChecklist, { 'CheckListModuleId': 3, 'IsChecked': true, 'CheckListSubTypeId': 19 }, true), 'OrgOrderBy', false) || [];
                    PostOpCheckOutArray = $filter('orderBy')($filter('filter')($scope.AscPostOp.OrgASCChecklist, { 'CheckListModuleId': 3, 'IsChecked': true, 'CheckListSubTypeId': 2 }, true), 'OrgOrderBy', false) || [];
                    PostOpCallListArray = $filter('filter')($scope.AscPostOp.OrgASCChecklist, { 'CheckListModuleId': 3, 'IsChecked': true, 'CheckListSubTypeId': 21 }, true) || [];
                    $scope.PostOpNurseInterventions = $filter('filter')($scope.AscPostOp.OrgASCChecklist, { 'CheckListModuleId': 3, 'IsChecked': true, 'CheckListCategoryId': 16 }, true) || [];
                }


                var PostOpOrderListArray = [];
                PostOpOrderListArray = $filter('filter')($scope.AscPostOp.OrderDetails, { 'MedTypeId': 5 }, true) || [];


                var PostOpOrderAnesthesiaListArray = [];

                PostOpOrderAnesthesiaListArray = $filter('filter')($scope.AscPostOp.OrderDetails, { 'MedTypeId': 8 }, true) || [];
                console.log(PostOpOrderAnesthesiaListArray);
                $scope.AscPostOp.SurgeonOperativeNotes = postopresp.SurgeonOperativeNotes || '';
                $scope.AscPostOp.Complications = postopresp.Complications || '';
                $scope.AscPostOp.MedicationsNotes = postopresp.MedicationsNotes || '';
                $scope.AscPostOp.ProgressPatientStable = postopresp.ProgressPatientStable || '';
                $scope.AscPostOp.ProgressPatienttransferred = postopresp.ProgressPatienttransferred || '';
                $scope.AscPostOp.ProgressPatientwheelchairNotes = postopresp.ProgressPatientwheelchairNotes || '';
                $scope.AscPostOp.HighCriteriaRemarks = postopresp.HighCriteriaRemarks || '';
                $scope.AscPostOp.IsPostProceduresNotes = postopresp.IsPostProceduresNotes || false;
                $scope.AscPostOp.Prescription = postopresp.Prescription || [];
                $scope.AscPostOp.InvestigationsList = postopresp.InvestigationsList || [];
                $scope.AscPostOp.Diagnosis = postopresp.Diagnosis || [];

                // anesthesia tab
                $scope.PostopAnesthetistVitals = angular.copy($scope.GetPostopAnesthetistVitals());
                postopresp.AnesthetistVitals = postopresp.AnesthetistVitals || [];
                if (postopresp.AnesthetistVitals.length > 0) {
                    angular.forEach(postopresp.AnesthetistVitals, function (item) {
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
                            if (kitem.VitalId === 9 && kitem.VitalId === item.VitalsId) {
                                let obj = {
                                    "VitalValueId": 0,
                                    "PostOPAnesthesiaVitalsId": item.PostOPAnesthesiaVitalsId || 0,
                                    "VitalName": "Temparature",
                                    "MainId": 9,
                                    "VitalSlotTime": item.VitalSlotTime,
                                    "Value": item.Value,
                                    "DeleteInd": "N"
                                };
                                kitem.VitalValues.push(obj);
                            }
                            if (kitem.VitalId === 10 && kitem.VitalId === item.VitalsId) {
                                let obj = {
                                    "VitalValueId": 0,
                                    "PostOPAnesthesiaVitalsId": item.PostOPAnesthesiaVitalsId || 0,
                                    "VitalName": "Notes",
                                    "MainId": 10,
                                    "VitalSlotTime": item.VitalSlotTime,
                                    "Value": item.Value,
                                    "DeleteInd": "N"
                                };
                                kitem.VitalValues.push(obj);
                            }
                        });
                    });

                    angular.forEach($scope.PostopAnesthetistVitals, function (item) {
                        angular.forEach(item.VitalValues, function (kitem) {
                            let splitarray = kitem.VitalSlotTime.split(":");
                            let stringCounter = splitarray.join("");
                            let counter = parseInt(stringCounter);

                            kitem.counter = counter;
                        });

                        // arranging in ascending order of time
                        if (item.VitalValues.length > 0) {
                            let filteredData = $filter('orderBy')(item.VitalValues, 'counter');
                            item.VitalValues = angular.copy(filteredData);
                        }
                    });

                    $scope.PostopNewTimeSlots = [];

                    let tempArray = $filter('filter')($scope.PostopAnesthetistVitals, { 'VitalName': 'Systolic Pressure' }, true);
                    if (tempArray.length > 0) {
                        if (tempArray[0].VitalValues.length > 0) {
                            angular.forEach(tempArray[0].VitalValues, function (kitem) {
                                let dummydate = "2024-01-01";
                                let dummydatetime = dummydate + " " + kitem.VitalSlotTime;
                                let newtime = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");

                                let tempArray = kitem.VitalSlotTime.split(":");
                                let stringCounter = tempArray.join("");
                                let counter = parseInt(stringCounter);

                                $scope.PostopNewTimeSlots.push({ 'time': kitem.VitalSlotTime, 'NewTime': newtime, 'counter': counter });
                            });
                        }
                    }

                    let filteredData = $filter('orderBy')($scope.PostopNewTimeSlots, 'counter');
                    if (filteredData.length > 0) {
                        $scope.AscPostOp.InTime = $scope.AscPostOp.RecoveryStartTime || "";
                        $scope.AscPostOp.OutTime = filteredData[filteredData.length - 1].NewTime;
                        $scope.AscPostOp.RecoveryStopTime = filteredData[filteredData.length - 1].NewTime;
                    }

                    postopresp.RecoveryStopTime = postopresp.RecoveryStopTime || '';
                    if (postopresp.RecoveryStopTime != '') {
                        $scope.AscPostOp.RecoveryStopTime = postopresp.RecoveryStopTime || '';
                    }
                }

                $scope.AscPostOp.InTime = postopresp.InTime || null;
                $scope.AscPostOp.OutTime = postopresp.OutTime || null;

                let ndate = moment().format("YYYY-MM-DD");
                if ($scope.AscPostOp.InTime != null) {
                    let edate = ndate + " " + $scope.AscPostOp.InTime;
                    $scope.AscPostOp.InTime = moment(edate).format("hh:mm A");
                }

                if ($scope.AscPostOp.OutTime != null) {
                    let edate = ndate + " " + $scope.AscPostOp.OutTime;
                    $scope.AscPostOp.OutTime = moment(edate).format("hh:mm A");
                }

                /* ----- * ----- */
            }
            /* Post-op - End */

            /* Post-op-discharge - Start */
            let PostopDischargeindex = resp[0].data.PostOpDischarge.length;
            if (resp[0].data.PostOpDischarge.length > 0) {

                var postopdischarge = angular.copy(resp[0].data.PostOpDischarge[0]);

                $scope.AscDischargeSummaryObj.InvestigationsList = resp[0].data.InvestigationsList || [];

                resp[0].data.AssessmentDiagnosis = resp[0].data.AssessmentDiagnosis || [];
                if (resp[0].data.AssessmentDiagnosis.length > 0) {
                    $scope.AscDischargeSummaryObj.Diagnosis = resp[0].data.AssessmentDiagnosis || [];
                }

                $scope.AscDischargeSummaryObj.ExaminationNotes = postopdischarge.Findings || "";
                $scope.AscDischargeSummaryObj.PatientConditionInstruction = postopdischarge.PatientConditionInstruction || "";
                $scope.AscDischargeSummaryObj.PatientsInstructions = postopdischarge.PatientsInstructions || "";
                $scope.AscDischargeSummaryObj.CoManagementInstruction = postopdischarge.CoManagementInstruction || "";
                $scope.AscDischargeSummaryObj.FollowUpDate1 = postopdischarge.FollowUpDate1 || "";
                if ($scope.AscDischargeSummaryObj.FollowUpDate1 != '') {
                    $scope.AscDischargeSummaryObj.FollowUpDate1 = $filter('date')($scope.AscDischargeSummaryObj.FollowUpDate1, "MM-dd-yyyy");
                }
                $scope.AscDischargeSummaryObj.FollowUpDate2 = postopdischarge.FollowUpDate2 || "";
                $scope.AscDischargeSummaryObj.FollowUpDate3 = postopdischarge.FollowUpDate3 || "";
                $scope.AscDischargeSummaryObj.FollowUpInstructions = postopdischarge.FollowUpInstructions || "";
                $scope.AscDischargeSummaryObj.Complications = postopdischarge.Complications || "";
                $scope.AscDischargeSummaryObj.DischargeReviewedBy = postopdischarge.DischargeReviewedBy || null;
                $scope.AscDischargeSummaryObj.FinalDisposition = postopdischarge.FinalDisposition || "";
                $scope.AscDischargeSummaryObj.PostProcedureNote = postopdischarge.PostProcedureNote || "";
                $scope.AscDischargeSummaryObj.DischargeReviewedDate = postopdischarge.DischargeReviewedDate || "";
                $scope.AscDischargeSummaryObj.PatientinstructionsInd = postopdischarge.PatientinstructionsInd || false;

                $scope.AscDischargeSummaryObj.PatientSignString = postopdischarge.PatientSign || "";
                $scope.AscDischargeSummaryObj.NurseSignString = postopdischarge.NurseSign || "";
                $scope.AscDischargeSummaryObj.AccompaniedBySign = postopdischarge.AccompaniedBySign || "";
                $scope.AscDischargeSummaryObj.SignatureNurseId = postopdischarge.SignatureNurseId || 0;
                $scope.AscDischargeSummaryObj.SignatureNurseName = postopdischarge.SignatureNurseName || "";
                $scope.AscDischargeSummaryObj.PatientSignedDateTime = postopdischarge.PatientSignedDateTime || null;
                if ($scope.AscDischargeSummaryObj.PatientSignedDateTime != null) {
                    $scope.AscDischargeSummaryObj.PatientSignedDateTime = $filter('date')($scope.AscDischargeSummaryObj.PatientSignedDateTime, "MM-dd-yyyy hh:mm a");
                }
                $scope.AscDischargeSummaryObj.NurseSignedDateTime = postopdischarge.NurseSignedDateTime || null;
                if ($scope.AscDischargeSummaryObj.NurseSignedDateTime != null) {
                    $scope.AscDischargeSummaryObj.NurseSignedDateTime = $filter('date')($scope.AscDischargeSummaryObj.NurseSignedDateTime, "MM-dd-yyyy hh:mm a");
                }
                $scope.AscDischargeSummaryObj.AccompaniedBySignedDateTime = postopdischarge.AccompaniedBySignedDateTime || null;
                if ($scope.AscDischargeSummaryObj.AccompaniedBySignedDateTime != null) {
                    $scope.AscDischargeSummaryObj.AccompaniedBySignedDateTime = $filter('date')($scope.AscDischargeSummaryObj.AccompaniedBySignedDateTime, "MM-dd-yyyy hh:mm a");
                }
                $scope.AscDischargeSummaryObj.AccompainedBy = postopdischarge.AccompainedBy || '';
                $scope.AscDischargeSummaryObj.AccompainedByNotes = postopdischarge.AccompainedByNotes || '';
                $scope.AscDischargeSummaryObj.DischargeAccompainedName = postopdischarge.DischargeAccompainedName || '';
                $scope.AscDischargeSummaryObj.DischargeReviewedDate = $filter('date')($scope.AscDischargeSummaryObj.DischargeReviewedDate, "MM-dd-yyyy hh:mm a") || '';


                $scope.AscIntraop.ProcedureDescription = $scope.AscIntraop.ProcedureDescription || "";
                if ($scope.AscIntraop.ProcedureDescription != "") {
                    $scope.AscDischargeSummaryObj.ProcedureDescription = $scope.AscIntraop.ProcedureDescription || "";
                }

                $scope.AscDischargeSummaryObj.Prescriptions = angular.copy(resp[0].data.Prescription) || [];

                $scope.Medications = [];
                if ($scope.AscDischargeSummaryObj.Prescriptions.length > 0) {
                    angular.forEach($scope.AscDischargeSummaryObj.Prescriptions, function (item) {
                        if (item.PrescriptionDetails.length > 0) {
                            $scope.Medications.push(item);
                        }
                    });
                } else {
                    $scope.Medications = [];
                }

                if ($scope.AscDischargeSummaryObj.DischargeReviewedBy != 0 || $scope.AscDischargeSummaryObj.DischargeReviewedBy != null) {
                    var TempFilter = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.AscDischargeSummaryObj.DischargeReviewedBy }, true) || [];
                    if (TempFilter.length > 0) {
                        $scope.AscDischargeSummaryObj.DischargeReviewedByName = angular.copy(TempFilter[0].FirstName + ' ' + TempFilter[0].LastName + ' ' + TempFilter[0].SuffixName);
                        /*  $scope.AscDischargeSummaryObj.DischargeReviewedBySuffix = angular.copy(TempFilter[0].SuffixName);*/
                        $scope.AscDischargeSummaryObj.ReviewedByLicenseNumber = angular.copy(TempFilter[0].LicenseNumber);

                    }
                    else {
                        $scope.AscDischargeSummaryObj.DischargeReviewedByName = '';
                        $scope.AscDischargeSummaryObj.DischargeReviewedBySuffix = '';
                        $scope.AscDischargeSummaryObj.ReviewedByLicenseNumber = '';
                    }
                }

                $scope.AscDischargeSummaryObj.PostOPDischargeLastSignOffUserDetails = resp[0].data.PostOPDischargeLastSignOffUserDetails || [];

                $scope.ChecklistArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 43);

                $scope.SurgeonArray = $scope.ChecklistArray.filter((x) => x.SuffixId == 10);

                $scope.ReviewedByMDDoctorArray = [];
                if ($scope.AscDischargeSummaryObj.DischargeReviewedBy !== 0 && $scope.SurgeonArray.length > 0) {
                    $scope.ReviewedByMDDoctorArray = $filter("filter")($scope.SurgeonArray, function (kitem) { return kitem.DoctorID == $scope.AscDischargeSummaryObj.DischargeReviewedBy }, true);
                }
                else {
                    $scope.ReviewedByMDDoctorArray = [];
                }

                /* ----- * ----- */
            }
            /* Post-op-discharge - End */

            /* Operativenotes - Start */
            let OperativeNotesindex = resp[0].data.OperativeNotes.length;
            if (resp[0].data.OperativeNotes.length > 0) {

                $scope.SurgicalHistoryArray = [];
                $scope.SystemicHistoryArray = [];

                var operativenotes = angular.copy(resp[0].data.OperativeNotes[0]);
                $scope.SystemicHistoryArray = angular.copy(resp[0].data.SystemicHistory) || [];

                $scope.AscOperativeNotes.OperativeNOtesLastSignOffUserDetails = angular.copy(resp[0].data.OperativeNotesLastSignOffUserDetails) || [];
                //$scope.AscOperativeNotes.ImplantsDetailsArray = operativenotes.ImplantsDetailsArray || [];
                $scope.AscOperativeNotes.ProcedureDetails = operativenotes.ProcedureDetails || '';
                $scope.AscOperativeNotes.Complications = operativenotes.Complications || '';
                $scope.AscOperativeNotes.ReasonForVisit = operativenotes.ReasonForVisit || '';
                $scope.AscOperativeNotes.Findings = operativenotes.Findings || '';
                $scope.AscOperativeNotes.SurgeonOperativeNotes = operativenotes.SurgeonOperativeNotes || '';
                $scope.AscOperativeNotes.OperativeNotesReviewedBy = operativenotes.OperativeNotesReviewedBy || '';
                $scope.AscOperativeNotes.OperativeReviewedDate = operativenotes.OperativeReviewedDate || '';
                $scope.AscOperativeNotes.MedicineOrdersInstructions = operativenotes.MedicineOrdersInstructions || '';
                $scope.AscOperativeNotes.PhysicalExam = operativenotes.PhysicalExam || '';
                $scope.AscOperativeNotes.PreProcedureNotes = operativenotes.PreProcedureNotes || '';
                $scope.AscOperativeNotes.Pathology = operativenotes.Pathology || '';
                $scope.AscOperativeNotes.PatientsInstructions = operativenotes.PatientsInstructions || '';
                $scope.AscOperativeNotes.OperativeOverAllRemarks = operativenotes.OperativeOverAllRemarks || '';
                $scope.AscOperativeNotes.PostProcedureNotes = operativenotes.PostProcedureNotes || '';
                $scope.AscPostOp.IsPostProceduresNotes = operativenotes.IsPostProceduresNotes || false;

                $scope.SurgicalHistoryArray = operativenotes.SurgicalHistoryArray || [];
                // $scope.SystemicHistoryArray = operativenotes.SystemicHistoryArray || [];

                if ($scope.AscOperativeNotes.OperativeNotesReviewedBy != 0 || $scope.AscOperativeNotes.OperativeNotesReviewedBy != null) {
                    var TempFilter = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.AscOperativeNotes.OperativeNotesReviewedBy }, true);
                    if (TempFilter.length > 0) {
                        $scope.AscOperativeNotes.OperativeReviewedName = angular.copy(TempFilter[0].FirstName + ' ' + TempFilter[0].LastName);
                        $scope.AscOperativeNotes.OperativeReviewedNameSuffix = angular.copy(TempFilter[0].SuffixName);
                        $scope.AscOperativeNotes.ReviewedByLicenseNumber = angular.copy(TempFilter[0].LicenseNumber);
                        //if (TempFilter[0].SuffixId == 10) {
                        //    $scope.AscOperativeNotes.OperativeReviewedName = ' Dr. ' + $scope.AscOperativeNotes.OperativeReviewedName;
                        //}
                    }
                    else {
                        $scope.AscOperativeNotes.OperativeReviewedName = '';
                        $scope.AscOperativeNotes.OperativeReviewedNameSuffix = '';
                        $scope.AscOperativeNotes.ReviewedByLicenseNumber = '';
                    }
                }

                $scope.AscOperativeNotes.OperativeReviewedDate = $filter('date')($scope.AscOperativeNotes.OperativeReviewedDate, "MM-dd-yyyy hh:mm a");

            }

            $scope.Organization = '';
            if (!$scope.ParentObj.IsIOJParentOrganization) {
                $scope.Organization = 'Tec';
            } else {
                $scope.Organization = '';
            }

            /* Operativenotes - Start */

            /* FemtoTemplate - Start */
            let FemtoTemplateindex = resp[0].data.FemtoTemplates.length;
            if (resp[0].data.FemtoTemplates.length > 0) {
                var femtoresp = angular.copy(resp[0].data.FemtoTemplates[0]);

                $scope.FemtotempObj.FemtoArcuateIncisions1 = femtoresp.FemtoArcuateIncisions1 || '';
                $scope.FemtotempObj.IsFemtoArcuateIncisions1NA = femtoresp.IsFemtoArcuateIncisions1NA || false;
                $scope.FemtotempObj.FemtoArcuateIncisions2 = femtoresp.FemtoArcuateIncisions2 || '';
                $scope.FemtotempObj.IsFemtoArcuateIncisions2NA = femtoresp.IsFemtoArcuateIncisions2NA || false;
                $scope.FemtotempObj.FemtoArcuateIncisionsNotes = femtoresp.FemtoArcuateIncisionsNotes || '';
                $scope.FemtotempObj.FemtoTimeOut = femtoresp.FemtoTimeOut || '';
                $scope.FemtotempObj.FemtoStartTime = femtoresp.FemtoStartTime || '';
                $scope.FemtotempObj.FemtoEndTime = femtoresp.FemtoEndTime || '';
                $scope.FemtotempObj.FemtoReferenceNo = femtoresp.FemtoReferenceNo || '';
                $scope.FemtotempObj.FemtoLotNo = femtoresp.FemtoLotNo || '';
                $scope.FemtotempObj.FemtoExpiryDate = femtoresp.FemtoExpiryDate || null;
                $scope.FemtotempObj.FemtoOverAllNotes = femtoresp.FemtoOverAllNotes || '';
                $scope.FemtotempObj.FemtNurseReviewedById = femtoresp.FemtNurseReviewedById || null;
                $scope.FemtotempObj.FemtNurseReviewedByName = femtoresp.FemtNurseReviewedByName || '';
                $scope.FemtotempObj.FemtDoctorReviewedById = femtoresp.FemtDoctorReviewedById || null;
                $scope.FemtotempObj.FemtDoctorReviewedByName = femtoresp.FemtDoctorReviewedByName || '';
                $scope.FemtotempObj.FemtDoctorReviewedByDate = femtoresp.FemtDoctorReviewedByDate || null;
                $scope.FemtotempObj.FemtDoctorReviewedByTime = femtoresp.FemtDoctorReviewedByTime || '';
                $scope.FemtotempObj.FemtAnesthesiaReviewedById = femtoresp.FemtoAnesthesiaReviewedById || null;
                $scope.FemtotempObj.FemtAnesthesiaReviewedByName = femtoresp.FemtoAnesthesiaReviewedByName || '';

                if ($scope.FemtotempObj.FemtoExpiryDate !== null) {
                    $scope.FemtotempObj.FemtoExpiryDate = $filter("date")($scope.FemtotempObj.FemtoExpiryDate, "MM-dd-yyyy") || null;
                }
                if ($scope.FemtotempObj.FemtDoctorReviewedByDate !== null) {
                    $scope.FemtotempObj.FemtDoctorReviewedByDate = $filter("date")($scope.FemtotempObj.FemtDoctorReviewedByDate, "MM-dd-yyyy") || null;
                }

                if ($scope.FemtotempObj.FemtoArcuateIncisions1 !== '' || $scope.FemtotempObj.IsFemtoArcuateIncisions1NA || $scope.FemtotempObj.FemtoArcuateIncisions2 !== '' || $scope.FemtotempObj.IsFemtoArcuateIncisions2NA || $scope.FemtotempObj.FemtoTimeOut !== '' || $scope.FemtotempObj.FemtoStartTime !== '' || $scope.FemtotempObj.FemtoEndTime !== '' || $scope.FemtotempObj.FemtoReferenceNo !== ''
                    || $scope.FemtotempObj.FemtoLotNo !== '' || $scope.FemtotempObj.FemtoExpiryDate !== null || $scope.FemtotempObj.FemtoOverAllNotes !== '' || $scope.FemtotempObj.FemtNurseReviewedById !== null || $scope.FemtotempObj.FemtDoctorReviewedById !== null || $scope.FemtotempObj.FemtDoctorReviewedByDate !== null || $scope.FemtotempObj.FemtDoctorReviewedByTime !== '') {
                    $scope.FemtotempObj.IfFemtoTemplateDataAdded = true;
                } else {
                    $scope.FemtotempObj.IfFemtoTemplateDataAdded = false;
                }

                $scope.FemtoObj = {
                    "FemtoArcuateIncisions1": $scope.FemtotempObj.FemtoArcuateIncisions1 || '',
                    "IsFemtoArcuateIncisions1NA": $scope.FemtotempObj.IsFemtoArcuateIncisions1NA || false,
                    "FemtoArcuateIncisions2": $scope.FemtotempObj.FemtoArcuateIncisions2 || '',
                    "IsFemtoArcuateIncisions2NA": $scope.FemtotempObj.IsFemtoArcuateIncisions2NA || false,
                    "FemtoArcuateIncisionsNotes": $scope.FemtotempObj.FemtoArcuateIncisionsNotes || '',
                    "FemtoTimeOut": $scope.FemtotempObj.FemtoTimeOut || '',
                    "FemtoStartTime": $scope.FemtotempObj.FemtoStartTime || '',
                    "FemtoEndTime": $scope.FemtotempObj.FemtoEndTime || '',
                    "FemtoReferenceNo": $scope.FemtotempObj.FemtoReferenceNo || '',
                    "FemtoLotNo": $scope.FemtotempObj.FemtoLotNo || '',
                    "FemtoExpiryDate": $scope.FemtotempObj.FemtoExpiryDate || null,
                    "FemtoOverAllNotes": $scope.FemtotempObj.FemtoOverAllNotes || '',
                    "FemtNurseReviewedById": $scope.FemtotempObj.FemtNurseReviewedById || null,
                    "FemtNurseReviewedByName": $scope.FemtotempObj.FemtNurseReviewedByName || '',
                    "FemtDoctorReviewedById": $scope.FemtotempObj.FemtDoctorReviewedById || null,
                    "FemtDoctorReviewedByName": $scope.FemtotempObj.FemtDoctorReviewedByName || '',
                    "FemtDoctorReviewedByDate": $scope.FemtotempObj.FemtDoctorReviewedByDate || null,
                    "FemtDoctorReviewedByTime": $scope.FemtotempObj.FemtDoctorReviewedByTime || '',
                    "IfFemtoTemplateDataAdded": false,
                    "FemtAnesthesiaReviewedById": $scope.FemtotempObj.FemtAnesthesiaReviewedById || null,
                    "FemtAnesthesiaReviewedByName": $scope.FemtotempObj.FemtAnesthesiaReviewedByName || '',
                }

                if ($scope.FemtoObj.FemtoArcuateIncisions1 !== '' || $scope.FemtoObj.IsFemtoArcuateIncisions1NA || $scope.FemtoObj.FemtoArcuateIncisions2 !== '' || $scope.FemtoObj.IsFemtoArcuateIncisions2NA || $scope.FemtoObj.FemtoTimeOut !== '' || $scope.FemtoObj.FemtoStartTime !== '' || $scope.FemtoObj.FemtoEndTime !== '' || $scope.FemtoObj.FemtoReferenceNo !== ''
                    || $scope.FemtoObj.FemtoLotNo !== '' || $scope.FemtoObj.FemtoExpiryDate !== null || $scope.FemtoObj.FemtoOverAllNotes !== '' || $scope.FemtoObj.FemtNurseReviewedById !== null || $scope.FemtoObj.FemtDoctorReviewedById !== null || $scope.FemtoObj.FemtDoctorReviewedByDate !== null || $scope.FemtoObj.FemtDoctorReviewedByTime !== '') {
                    $scope.FemtoObj.IfFemtoTemplateDataAdded = true;
                } else {
                    $scope.FemtoObj.IfFemtoTemplateDataAdded = false;
                }


                $scope.IntraFemtoChecklist = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 18, "IsChecked": true }, true) || [];
                $scope.PreFemtoChecklist = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 19, "IsChecked": true }, true) || [];
                $scope.PostFemtoChecklist = $filter("filter")($scope.AllOrgASCChecklist, { "CheckListCategoryId": 20, "IsChecked": true }, true) || [];

            }
            /* FemtoTemplate - End */

        /* DoctorNotes - Start */
        let DoctorNotesindex = resp[0].data.DoctorNotes.length;
        if (resp[0].data.DoctorNotes.length > 0) {
            var doctornotesresp = angular.copy(resp[0].data.DoctorNotes[0]);
            $scope.FaceSheetObj.FaceSheetCheckList = [];

            var FaceSheetChartStatus = doctornotesresp.AppointmentFaceSheetData[0]?.FaceSheetChartStatus || '';
            angular.forEach(doctornotesresp.AppointmentFaceSheetData, function (item) {
                item.SurgeryDate = $scope.SurgeryDate || null;
                item.PreOpVerification = item.PreOpVerification || [];
                item.SurgeonVerification = item.SurgeonVerification || [];

                var obj = {
                    "OrganId": item.OrganId,
                    "ReviewedBy": item.ReviewedBy,
                    "PatientFaceSheetId": item.PatientFaceSheetId,
                    // "PreOpVerification": item.EditPreOpVerification || [],
                    "SurgeonVerification": item.SurgeonVerification || [],
                    "SurgeryDate": $scope.SurgeryDate || null,
                }
                $scope.FaceSheetObj.FaceSheetCheckList.push(obj);
            });

            doctornotesresp.PreviousAppointmentFaceSheetData = doctornotesresp.PreviousAppointmentFaceSheetData || [];
            if (doctornotesresp.PreviousAppointmentFaceSheetData.length > 0) {
                angular.forEach(doctornotesresp.PreviousAppointmentFaceSheetData, function (item) {
                    if (item.FindingId == 4) {
                        $scope.PreviousValuesObj.VisualODValue = item.ODSCValue || '';
                        $scope.PreviousValuesObj.VisualOSValue = item.OSSCValue || '';
                    }
                    if (item.FindingId == 2134) {
                        $scope.PreviousValuesObj.PupilSizeODValue = item.ODValue || '';
                        $scope.PreviousValuesObj.PupilSizeOSValue = item.OSValue || '';
                    }
                    if (item.FindingId == 1) {
                        $scope.PreviousValuesObj.ODSphARValue = item.ODSphValue || '';
                        $scope.PreviousValuesObj.OSSphARValue = item.OSSphValue || '';
                        $scope.PreviousValuesObj.ODCylARValue = item.ODCylValue || '';
                        $scope.PreviousValuesObj.OSCylARValue = item.OSCylValue || '';
                        $scope.PreviousValuesObj.ODAixARValue = item.ODAixValue || '';
                        $scope.PreviousValuesObj.OSAixARValue = item.OSAixValue || '';
                    }

                    if ($scope.PreviousValuesObj.ODSphARValue !== '' || $scope.PreviousValuesObj.ODCylARValue !== '' || $scope.PreviousValuesObj.ODAixARValue !== '') {
                        $scope.PreviousValuesObj.ODRefractionValue = $scope.PreviousValuesObj.ODSphARValue + '  /  ' + $scope.PreviousValuesObj.ODCylARValue + ' @ ' + $scope.PreviousValuesObj.ODAixARValue;
                    }
                    if ($scope.PreviousValuesObj.OSSphARValue !== '' || $scope.PreviousValuesObj.OSCylARValue !== '' || $scope.PreviousValuesObj.OSAixARValue !== '') {
                        $scope.PreviousValuesObj.OSRefractionValue = $scope.PreviousValuesObj.OSSphARValue + '  /  ' + $scope.PreviousValuesObj.OSCylARValue + '  @  ' + $scope.PreviousValuesObj.OSAixARValue;
                    }
                });
            };
            if (doctornotesresp.LatestAppointmentCD.length > 0) {
                $scope.FaceSheetObj.PreviousCDAODValue = doctornotesresp.LatestAppointmentCD[0].ODValue || "";
                $scope.FaceSheetObj.PreviousCDAOSValue = doctornotesresp.LatestAppointmentCD[0].OSValue || "";
                $scope.FaceSheetObj.PreviousCDAValueGivenDate = doctornotesresp.LatestAppointmentCD[0].ModifiedDt || null;

                if ($scope.FaceSheetObj.PreviousCDAValueGivenDate != '' && $scope.FaceSheetObj.PreviousCDAValueGivenDate != null) {
                    /*  $scope.FaceSheetObj.PreviousCDAValueGivenDate = $filter('date')($scope.FaceSheetObj.PreviousCDAValueGivenDate, "MM-dd-yyyy");*/
                    $scope.FaceSheetObj.PreviousCDAValueGivenDate = moment($scope.FaceSheetObj.PreviousCDAValueGivenDate).format("MM-DD-YYYY");

                }
            }
            var SurgeonVerifiedUserName = '';

            if (doctornotesresp.AppointmentFaceSheetData.length > 0) {
                SurgeonVerifiedUserName = doctornotesresp.AppointmentFaceSheetData[0].SurgeonVerifiedUserName || '';
            }
            var FaceSheetSignOffUserDetails = doctornotesresp.LastSignOffUserDetails || [];

        }
        /* DoctorNotes - End */

        var orgDetails = resp?.[0]?.data?.OrganizationDetails || [];

        //let anesthesiaTypelist = resp?.[0]?.data?.AnesthesiaTypelist || [];
        //if (anesthesiaTypelist && anesthesiaTypelist.length > 0) {
        //    $scope.AscPostopanesthesiaTypeList = $filter('filter')(anesthesiaTypelist, { 'IsSelected': true }, true);
        //}

            /* All Print - Start  */
            if ($scope.AllAscPrintObj.IsAllPrintSelected || $scope.AllAscPrintObj.IsAdmitPrintInd || $scope.AllAscPrintObj.IsPreopPrintInd || $scope.AllAscPrintObj.IsPreopAnesthesiaPrintInd || $scope.AllAscPrintObj.IsPreopChecklistPrintInd || $scope.AllAscPrintObj.IsIntraopPrintInd || $scope.AllAscPrintObj.IsIntraopCheckinChecklistPrintInd || $scope.AllAscPrintObj.IsIntraopAnesthesiaPrintInd || $scope.AllAscPrintObj.IsIntraopChecklistPrintInd || $scope.AllAscPrintObj.IsPostopPrintInd || $scope.AllAscPrintObj.IsPostopChecklistPrintInd || $scope.AllAscPrintObj.IsPostopAnesthesiaPrintInd || $scope.AllAscPrintObj.IsOperativeNotesPrintInd || $scope.AllAscPrintObj.IsDischargeSummaryPrintInd || $scope.AllAscPrintObj.IsFemtoPrintInd) {

                var ReceivedsurgeryChecklistData = [];
                if (preopresp?.CheckLists.length > 0) {
                    ReceivedsurgeryChecklistData = $filter('filter')(preopresp.CheckLists, { 'CheckListCategoryId': 12, 'CheckListSubTypeId': 13 }, true) || [];
                };

                if (preopresp?.PreOpAccompaniedSignedDateTime != null) {
                    preopresp.PreOpAccompaniedSignedDateTime = $filter('date')(preopresp.PreOpAccompaniedSignedDateTime, "MM-dd-yyyy hh:mm a");
                }
                $scope.PatientarrivalObj = {
                    'AccompainedBy': preopresp?.PreOpAccompainedBy || '',
                    'AccompainedByNotes': preopresp?.PreOpAccompainedByNotes || '',
                    'AccompaniedSignString': preopresp?.PreOpAccompaniedSign || '',
                    'AccompaniedSignedDateTime': preopresp?.PreOpAccompaniedSignedDateTime || null,
                    'AccompainedName': preopresp?.PreOpAccompainedName || '',
                }
                var NurseInterventions = [];

                if ($scope.IsShowEmptyASCChecklist) {
                    if ($scope.PostOpNurseInterventions && $scope.PostOpNurseInterventions.length > 0) {
                        angular.forEach($scope.PostOpNurseInterventions, function (item) {
                            item.Value = item.Value || '';
                            NurseInterventions.push(item);
                        })
                    }
                } else {
                    if ($scope.PostOpNurseInterventions && $scope.PostOpNurseInterventions.length > 0) {
                        angular.forEach($scope.PostOpNurseInterventions, function (item) {
                            item.Value = item.Value || '';
                            if (item.Value !== '') {
                                NurseInterventions.push(item);
                            }
                        })
                    }
                }
                

                $scope.AscIntraop.BeforeIncisionReviewedDateTime = $scope.AscIntraop.BeforeIncisionReviewedDateTime || '';
                if ($scope.AscIntraop.BeforeIncisionReviewedDateTime) {
                    $scope.AscIntraop.BeforeIncisionReviewedDateTime = $filter('date')($scope.AscIntraop.BeforeIncisionReviewedDateTime, 'MM-dd-yyyy hh:mm a');
                }
                $scope.AscIntraop.BeforeORReviewedDateTime = $scope.AscIntraop.BeforeORReviewedDateTime || '';
                if ($scope.AscIntraop.BeforeORReviewedDateTime) {
                    $scope.AscIntraop.BeforeORReviewedDateTime = $filter('date')($scope.AscIntraop.BeforeORReviewedDateTime, 'MM-dd-yyyy hh:mm a');
                }

                $timeout(function () {
                    var Object = {
                        "CreatedBy": $scope.CreatedByName,              // Admit Object
                        'Surgeon': $scope.SurgeryDiagnosisObj.SurgeonName || '',
                        "Anesthetist": $scope.SurgeryDiagnosisObj.AnesthesistName || '',
                        "Diagnosis": DiagnosisName || '',
                        "Name": $scope.cacheStorageItem.PatientName || '',
                        "Age": $scope.cacheStorageItem.Age || '',
                        "Gender": $scope.cacheStorageItem.Gender || '',
                        "PatientDOB": $scope.cacheStorageItem.PatientDOB || '',
                        "OrganName": Organ || '',
                        "AppointmentTime": $scope.cacheStorageItem.AppointmentTime || '',
                        "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
                        "VisitType": $scope.cacheStorageItem.AppointmentType || '',
                        "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                        "SurgeryDate": $scope.cacheStorageItem.AppointmentDate || '',
                        "SurgeryName": $scope.SurgeryDiagnosisObj.SurgeryName || '',
                        "AdditionalSurgeryName": AdditionalSurgeryName || '',
                        "VitalsArray": vitalarray || [],
                        "AdmitPatientObj": $scope.AdmitPatientObj || '',
                        "AdmissionRemarks": $scope.AdmissionObj.AdmissionRemarks || '',
                        "ReviewedByName": $scope.AdmissionObj.ReviewedByName || '',
                        "LicenseNo": $scope.AdmissionObj.ReviewedByLicenseNo || '',
                        "SuffixName": $scope.AdmissionObj.ReviewedBySuffix || '',
                        "ReviewedDate": $filter('date')($scope.AdmissionObj.AdmissionDate, "MM-dd-yyyy") || '',
                        "ReviewedTime": $scope.AdmissionObj.AdmissionTime || '',
                        "AdmittedByName": $scope.AdmissionObj.AdmittedByName || '',
                        "AdmittedByLicenseNo": $scope.AdmissionObj.AdmittedByLicenseNo || '',
                        "AdmittedBySuffix": $scope.AdmissionObj.AdmittedBySuffix || '',
                        "AdmissionDate": $filter('date')($scope.AdmissionObj.AdmissionDate, "MM-dd-yyyy") || '',
                        "AdmissionTime": $scope.AdmissionObj.AdmissionTime || '',
                        "AdmissionPrefix": $scope.AdmissionObj.AdmissionPrefix || '',
                        "EhnoteLogoURL": $scope.HeaderLogo || '',
                        "ReasonForVisit": $scope.AdmissionObj.ReasonForVisit || '',
                        "OrgAscChecklistData": (AdmitChecklistData && AdmitChecklistData.length > 0) ? AdmitChecklistData : AdmitSurgeonOrders.AdmitChecklist, /* Admit Checklist - falls back to GetASCAdmissionDetails */
                        "AllergyItems": $scope.AllAscPrintObj.AllergyItems || [],       // Pre-Op-Anesthesia Object
                        "SystemicHistory": SystemicHistoryArray || [],
                        "SurgicalHistory": $scope.AllAscPrintObj.SurgicalHistory || [],
                        "CurrentSystemicMedicationsHistory": $scope.AllAscPrintObj.CurrentSystemicMedicationList || [],
                        "CurrentEyeMedications": $scope.AllAscPrintObj.CurrentEyeMedicationList || [],
                        "AlderetScoreDetails": $scope.AscPreopObj.AlderetScoreDetails || [],
                        "Ascpatientpopupsavearray": $scope.Ascpatientpopupsavearray || [],
                        "PreOpCallDetails": $scope.AscPreopObj.PreOpCallDetails || [],
                        "TotalAlderetScore": $scope.AscPreopObj.TotalAlderetScore || '',
                        "IdentifierName": $scope.AscPreopObj.IdentifierName || '',
                        "IdentifierDurationDate": $scope.AscPreopObj.IdentifierDurationDate || '',
                        "PrevAnesthetics": $scope.PreAdmissionDetails.PreviousAnesthetics || [],
                        "AssessmentASAObj": $scope.PreAdmissionDetails.ASAObj || '',
                        "PreopAnesthesiaTypelist": anesthesiaTypeList || [],
                        "IntraopAnesthesiaTypelist": AscIntraopanesthesiaTypeList || [],
                        "AnesthesiaDosage": $scope.PreAdmissionDetails.AnesthesiaPlan.AnesPlanDosage || '',
                        "AnesthetistName": $scope.PreAdmissionDetails.AnesthetistName || '',
                        "AnesthetistReviewedDate": $scope.PreAdmissionDetails.AnesthetistReviewedDate || '',
                        "AnesthesiologistReviewedDate": $scope.PreAdmissionDetails.AnesthesiologistReviewedDate || '',
                        "AnesthetistNotes": $scope.PreAdmissionDetails.AnesthesiaPlan.AnesthetistNotes || '',
                        "IsRisksbenefitsAnesthesia": $scope.PreAdmissionDetails.AnesthesiaPlan.IsRisksbenefitsAnesthesia || false,
                        "IsAnestheticplan": $scope.PreAdmissionDetails.AnesthesiaPlan.IsAnestheticplan || false,
                        "PreAdmMedicationsDetails": PrescriptionDetails || [],
                        "LabInvestigationsList": $scope.PreAdmissionDetails.Investigationslist || [],
                        "AnesthesiaStatus": $scope.PreAdmissionDetails.PreAdmissionStatus || '',
                        "AnesthesiaReviewedName": $scope.PreAdmissionDetails.AnesthesiaReviewedName || '',
                        "AnesthesiaSuffix": $scope.PreAdmissionDetails.AnesthesiaSuffix || '',
                        "AnesthesiaLicenseNo": $scope.PreAdmissionDetails.AnesthesiaLicenseNo || '',
                        "HandpLabdata": HandPLabData || [],
                        "AirWayData": AirWayData || '',
                        "CNSData": CNSArray || [],
                        "RespiratoryData": RespiratoryData || [],
                        "SocialData": LifestyleDetail || [],
                        "SystemichistoryData": HandPSystemicHistoryArray || [],
                        "ChemistryData": ChemistryArray || [],
                        "ChemistryNotes": ChemistryNotes || '',
                        "OtherSystemsData": OtherSystemsArray || '',
                        "GeneralChecklist": $scope.GeneralList || [],
                        "MedicationChecklist": $scope.MedicationsList || [],
                        "ClinicalChecklist": $scope.ClinicalList || [],
                        "PreOpNurseDiagnosis": $scope.PreOpNurseDiagnosis || [],
                        "PreOpNurseAssessment": $scope.PreOpNurseAssessment || [],
                        "PreOpNurseInterventions": $scope.PreOpNurseInterventions || [],
                        "PreopFemtoTemplate": $scope.PreopFemtoTemplate || [],
                        "IntraFemtoChecklist": $scope.IntraFemtoChecklist || [],
                        "PreFemtoChecklist": $scope.PreFemtoChecklist || [],
                        "PostFemtoChecklist": $scope.PostFemtoChecklist || [],
                        "FemtoObj": $scope.FemtoObj,
                        "PatientCheckList": $scope.PatientCheckList || [],
                        "PreOpMedicationRemarks": $scope.AscPreopObj.PreOpMedicationRemarks || '',
                        "PreopNotes": $scope.AscPreopObj.PreOpNotes || "",
                        "PreOpAnesthesiaNotes": $scope.AscPreopObj.PreOpAnesthesiaNotes || null,
                        "DilationMedications": $scope.AscPreopObj.DilationMedications || [],
                        "AscPreOpMedications": $scope.AscPreopObj.PreOpMedications || [],
                        "IsVeinOpened": isVeinOpened,
                        "IsDiabetes": isDiabetes,
                        "IsHypoglycemiaCheck": isHypoglycemiaCheck,
                        "DiabetesTimings": $scope.AscPreopObj.DiabetesTimings || [],
                        "ODPupilSize": $scope.AscPreopObj.ODPupilSize || '',
                        "OSPupilSize": $scope.AscPreopObj.OSPupilSize || '',
                        "DilationReviewName": $scope.AscPreopObj.DilationReviewName || '',
                        "DilationMedicationsNotes": $scope.AscPreopObj.DilationMedicationsNotes || '',
                        "MedicationReviewName": $scope.AscPreopObj.MedicationReviewName || '',
                        "MedicationRemarks": $scope.AscPreopObj.MedicationRemarks || '',
                        "PreopReviewedByName": $scope.AscPreopObj.ReviewedByName || '',
                        "PainLevel": $scope.AscPreopObj.PainLevel,
                        "PreopReviewedDate": $scope.AscPreopObj.ReviewedDate || '',
                        "PreopReviewedTime": $scope.AscPreopObj.ReviewedTime || '',
                        "PreopReviewedByLicenseNo": $scope.ReviewedByLicenseNo || '',
                        "PreOPLastSignOffUserDetails": $scope.AscPreopObj.PreOPLastSignOffUserDetails || [],
                        "ModifiedPreopMedicationDate": $scope.ModifiedPreopMedicationDate || "",
                        "ModifiedDilationDate": $scope.ModifiedDilationDate || "",
                        "LabNotes": $scope.PreAdmissionDetails.LabNotes || "",
                        "AnesthesiologistName": $scope.PreAdmissionDetails.AnesthesiologistName || "",
                        "AnesthesiologistReviewedName": $scope.PreAdmissionDetails.AnesthesiologistReviewedName || "",
                        "ROSOverAllRemarks": $scope.AscPreopObj.ROSOverAllRemarks || '',
                        "ECGDetails": $scope.PreAdmissionDetails.ECGObj || '',
                        "ASAClassificationNotes": $scope.PreAdmissionDetails.ASAClassificationNotes || '',
                        "MedicationInstructions": $scope.PreAdmissionDetails.MedicineOrdersInstructions || '',
                        "PhysicalEvaluationArray": $scope.PhysicalEvaluationArray || [],
                        "PhysicalNeurologicNotes": $scope.PreAdmissionDetails.PhysicalNeurologicNotes || '',
                        "PhysicalGeneralNotes": $scope.PreAdmissionDetails.PhysicalGeneralNotes || '',
                        "PhysicalCardiocNotes": $scope.PreAdmissionDetails.PhysicalCardiocNotes || '',
                        "PhysicalHepaticNotes": $scope.PreAdmissionDetails.PhysicalHepaticNotes || '',
                        "LastDialysisDate": $scope.PreAdmissionDetails.LastDialysisDate || null,
                        "PhysicalPulmonaryNotes": $scope.PreAdmissionDetails.PhysicalPulmonaryNotes || '',
                        "Organization": $scope.Organization || '',
                        "ChecklistArray": checkedChecklistArray || [],
                        "IntraOpNurseDiagnosis": $scope.IntraOpNurseDiagnosis || [],                                                      // Intra-op-Anesthesia
                        "IntraOpNurseAssessment": $scope.IntraOpNurseAssessment || [],
                        "IntraOpNurseInterventions": $scope.IntraOpNurseInterventions || [],
                        "BeforeAnesthesiaReviewedByName": $scope.AscIntraop.BeforeAnesthesiaReviewedByName || "",
                        "BeforeAnesthesiaTime": $scope.AscIntraop.BeforeAnesthesiaTime || "",
                        "BeforeIncisionReviewedByName": $scope.AscIntraop.BeforeIncisionReviewedByName || "",
                        "BeforeORReviewedByName": $scope.AscIntraop.BeforeORReviewedByName || "",
                        // "IntraOpMedications": $scope.AscIntraop.IntraOpMedications || [],
                        "ImplantsDetailsArray": $scope.ImplantsDetailsArray || [],
                        "NurseActions": $scope.NurseActions || '',
                        "SurgeryStaff": $scope.SurgeryStaff || '',
                        "SurgeryTimes": $scope.SurgeryTimes || '',
                        "SurgicalCount": $scope.SurgicalCount || '',
                        "HydrationIV": $scope.AscIntraop.NurseActions.HydrationIV || false,
                        "DrainageOthers": $scope.AscIntraop.NurseActions.DrainageOthers || '',
                        "Cleansed": $scope.AscIntraop.NurseActions.Cleansed || '',
                        "CleanContaminated": $scope.AscIntraop.NurseActions.CleanContaminated || '',
                        "Dirty": $scope.AscIntraop.NurseActions.Dirty || '',
                        "Contaminated": $scope.AscIntraop.NurseActions.Contaminated || '',
                        "CauteraisationOthers": $scope.AscIntraop.NurseActions.CauteraisationOthers || '',
                        "CauteraisationArray": $scope.CauteraisationArray || [],
                        "IntraopMedicationsGivenBy": $scope.AscIntraop.MedicationsReviewName || '',
                        "IntraopMedicationsNotes": $scope.AscIntraop.MedicationsNotes || '',
                        "NewTimeSlots": $scope.NewTimeSlots || [],
                        "AnesthetistVitals": $scope.AnesthetistVitals || [],
                        "BaseURL": $scope.AscIntraop.BaseURL || '',
                        //   "AnesthesiaMedications": $scope.AscIntraop.AnesthesiaMedications || [],
                        "AnesthesiaMedicationsNotes": $scope.AscIntraop.AnesthesiaMedicationsNotes || '',
                        "AnesthesiaMedicationsGivenBy": $scope.AscIntraop.AnesthesiaMedicationsReviewName || '',
                        "Oxygenobj": $scope.Oxygenobj || '',
                        "OxygenPreobj": $scope.OxygenPreobj || '',
                        "IntraOpNotes": $scope.AscIntraop.IntraOpNotes || null,
                        "IntraOpAnesthesiaNotes": $scope.AscIntraop.IntraOpAnesthesiaNotes || null,
                        "IntraopReviewedBy": $scope.AscIntraop.ReviewedByobj || '',
                        "InTime": $scope.AscIntraop.AnesthetistActions.InTime || '',
                        "OutTime": $scope.AscIntraop.AnesthetistActions.OutTime || '',
                        "IntraOPLastSignOffUserDetails": $scope.AscIntraop.IntraOPLastSignOffUserDetails || [],
                        "ReviewedByanethelogist": ReviewedByanethelogistArray || [],
                        "ModifiedAnesthesiaDate": $scope.ModifiedAnesthesiaDate || "",
                        "ModifiedIntraopDate": $scope.ModifiedIntraopDate || "",
                        "ModifiedDate": $scope.ModifiedDate || "",
                        "CDEOD": $scope.AscIntraop.CDEOD || "",
                        "CDEOS": $scope.AscIntraop.CDEOS || "",
                        "CDERemarks": $scope.AscIntraop.CDERemarks || "",
                        "EquipmentList": $scope.AscIntraop.EquipmentList || [],
                        "AdditionalSurgery": $scope.AdditionalSurgery || [],
                        "PatientStableSurgery": $scope.AscIntraop.PatientStableSurgery || false,
                        "AdequatePreoperativeWorkup": $scope.AscIntraop.AdequatePreoperativeWorkup || false,
                        "EspecimenLab": $scope.AscIntraop.NurseActions.EspecimenLab || "",
                        "Pathology": $scope.AscIntraop.Pathology || "",
                        "SurgeonOperativeNotes": $scope.AscPostOp.SurgeonOperativeNotes || '',    // Post-Op-Anesthesia Object
                        "SurgeonComplicationNotes": $scope.AscPostOp.Complications || '',
                        "MedicationsDetails": $scope.AscPostOp.Prescription || [],
                        "PostOpDiagnosis": $scope.AscPostOp.Diagnosis || [],
                        "PostopReviewedByName": $scope.AscPostOp.ReviewedByName || '',
                        "PostopBaseURL": $scope.AscPostOp.BaseURL || '',
                        "PostopAnesthesiaTypelist": $scope.AscPostopanesthesiaTypeList || [],
                        "AldreteDetails": $scope.AldreteDetailsArray || [],
                        "AldreteTotalScoreDetails": $scope.AldreteTotalScoreDetails || [],
                        "PostopAnesthetistVitals": $scope.PostopAnesthetistVitals || [],
                        "PostopNewTimeSlots": $scope.PostopNewTimeSlots || [],
                        "IsPostopChecklistPrintInd": $scope.AllAscPrintObj.IsPostopChecklistPrintInd || false,
                        "IsPostopAnesthesiaPrintInd": $scope.AllAscPrintObj.IsPostopAnesthesiaPrintInd || false,
                        "PostOpCheckoutActions": $scope.AscPostOp.NurseChart.Actions || [],
                        "PostOpChecklistActions": $scope.AscPostOp.NurseChart.Checklists || [],
                        "PostOpMedications": $scope.PostOpMedications || [],
                        "MedicationsReviewName": $scope.AscPostOp.MedicationsReviewName || '',
                        "MedicationsNotes": $scope.AscPostOp.MedicationsNotes || '',
                        "NurseGoals": $scope.nurseList || [],
                        "PostOpNurseInterventions": $scope.PostOpNurseInterventions || [],
                        "PostOpNotes": $scope.AscPostOp.PostOpNotes || null,
                        "PostOpAnesthesiaNotes": $scope.AscPostOp.PostOpAnesthesiaNotes || null,
                        "IsPatientDischarge": $scope.AscPostOp.IsPatientDischarge || false,
                        "ProgressNotesPainScore": $scope.AscPostOp.ProgressNotesPainScore,
                        "PostopReviewedBy": $scope.AscPostOp.PostopReviewedByobj || '',
                        "PostopSignOffUserDetails": $scope.AscPostOp.PostOpLastSignOffUserDetails || [],
                        "RecoveryStartTime": $scope.AscPostOp.InTime || "",
                        "RecoveryStopTime": $scope.AscPostOp.OutTime || "",
                        "ModifiedPostopDate": $scope.ModifiedPostopDate || "",
                        "ProgressPatientStable": $scope.AscPostOp.ProgressPatientStable || "",
                        "ProgressPatientwheelchairNotes": $scope.AscPostOp.ProgressPatientwheelchairNotes || "",
                        "ProgressPatienttransferred": $scope.AscPostOp.ProgressPatienttransferred || "",
                        "IsPostProceduresNotes": $scope.AscPostOp.IsPostProceduresNotes || false,
                        "HighCriteriaRemarks": $scope.AscPostOp.HighCriteriaRemarks || "",
                        "HighCriteria": $scope.PostopOrgASCChecklist || [],
                        "CheckInReviewDoctorName": $scope.AscPostOp.CheckInReviewDoctorName || "",
                        "CheckInReviewNurseName": $scope.AscPostOp.CheckInReviewNurseName || "",
                        "CheckInReviewAnesthetistName": $scope.AscPostOp.CheckInReviewAnesthetistName || "",
                        'OperativeProcedure': $scope.SurgeryDiagnosisObj.SurgeryName || '',         // Discharge Print
                        'OrganId': OrganId || '',
                        "ConsultationDate": $scope.cacheStorageItem.AppointmentDate || '',
                        "PostOpDiagnosisArray": $scope.AscDischargeSummaryObj.Diagnosis || [],/* PostOpDiagnosis*/
                        "ExaminationNotes": $scope.AscDischargeSummaryObj.ExaminationNotes || '',
                        "PatientCondition": $scope.AscDischargeSummaryObj.PatientConditionInstruction || '',
                        "PostOpInstructions": $scope.AscDischargeSummaryObj.PatientsInstructions || '',
                        "MedicationsArray": $scope.Medications || [],
                        "ExternalCoManager": $scope.SurgeryDiagnosisObj.ExternalCoManager || '',
                        "InternalCoManager": $scope.SurgeryDiagnosisObj.InternalCoManager || '',
                        "CoManagementInstruction": $scope.AscDischargeSummaryObj.CoManagementInstruction || '',
                        "FollowUpDate1": $scope.AscDischargeSummaryObj.FollowUpDate1 || '',
                        "FollowUpDate2": $scope.AscDischargeSummaryObj.FollowUpDate2 || '',
                        "FollowUpDate3": $scope.AscDischargeSummaryObj.FollowUpDate3 || '',
                        "FollowUpInstructions": $scope.AscDischargeSummaryObj.FollowUpInstructions || '',
                        "Complications": $scope.AscDischargeSummaryObj.Complications || '',
                        "DischargeReviewedByName": $scope.AscDischargeSummaryObj.DischargeReviewedByName || '',
                        /*  "DischargeReviewedBySuffix": $scope.AscDischargeSummaryObj.DischargeReviewedBySuffix || '',*/
                        "PatientinstructionsInd": $scope.AscDischargeSummaryObj.PatientinstructionsInd || false,
                        "ReviewedByLicenseNumber": $scope.AscDischargeSummaryObj.ReviewedByLicenseNumber || '',
                        "DischargeReviewedDate": $scope.AscDischargeSummaryObj.DischargeReviewedDate || '',
                        "PostOPDischargeLastSignOffUserDetails": $scope.AscDischargeSummaryObj.PostOPDischargeLastSignOffUserDetails || [],
                        "ReviewedByMDonly": $scope.ReviewedByMDDoctorArray || [],
                        "PostProceduresNotes": $scope.AscDischargeSummaryObj.PostProcedureNote || '',
                        "ProcedureDescription": $scope.AscDischargeSummaryObj.ProcedureDescription || '',
                        "InvestigationsList": $scope.AscDischargeSummaryObj.InvestigationsList || [],
                        "FinalDisposition": $scope.AscDischargeSummaryObj.FinalDisposition || '',
                        "LensUsedArray": $scope.ImplantsDetailsArray || [],              // Operative notes - print
                        "ProcedureNotes": $scope.AscOperativeNotes.ProcedureDetails || '',
                        "ComplicationsNotes": $scope.AscOperativeNotes.Complications || '',
                        "ReasonForVisit": $scope.AscOperativeNotes.ReasonForVisit || '',
                        "SurgicalHistoryArray": $scope.SurgicalHistoryArray || '',
                        "SystemicHistoryArray": SystemicHistoryArray || [],
                        "Findings": $scope.AscOperativeNotes.Findings || '',
                        "SurgeonOperativeNotes": $scope.AscOperativeNotes.SurgeonOperativeNotes || '',
                        "OperativeNOtesLastSignOffUserDetails": $scope.AscOperativeNotes.OperativeNOtesLastSignOffUserDetails || [],
                        "OperativeReviewedName": $scope.AscOperativeNotes.OperativeReviewedName || '',
                        "OperativeReviewedNameSuffix": $scope.AscOperativeNotes.OperativeReviewedNameSuffix || '',
                        "ReviewedByLicenseNumber": $scope.AscOperativeNotes.ReviewedByLicenseNumber || '',
                        "OperativeReviewedDate": $scope.AscOperativeNotes.OperativeReviewedDate || '',
                        "MedicineInstructions": $scope.AscOperativeNotes.MedicineOrdersInstructions || '',
                        "PhysicalExam": $scope.AscOperativeNotes.PhysicalExam || '',
                        "PreProcedureNotes": $scope.AscOperativeNotes.PreProcedureNotes || "",
                        "Pathology": $scope.AscOperativeNotes.Pathology || '',
                        "PatientsInstructions": $scope.AscOperativeNotes.PatientsInstructions || '',
                        "PostProcedureNotes": $scope.AscOperativeNotes.PostProcedureNotes || '',
                        "DrawingPadImgArray": $scope.DrawingPadImagesArray || [],
                        "IsOperativeNotesPrintInd": $scope.AllAscPrintObj.IsOperativeNotesPrintInd || false,
                        "IsDischargeSummaryPrintInd": $scope.AllAscPrintObj.IsDischargeSummaryPrintInd || false,
                        "IsAdmitPrintInd": $scope.AllAscPrintObj.IsAdmitPrintInd || false,
                        "IsFemtoPrintInd": $scope.AllAscPrintObj.IsFemtoPrintInd || false,
                        "IsPreopAnesthesiaPrintInd": $scope.AllAscPrintObj.IsPreopAnesthesiaPrintInd || false,
                        "IsPreopChecklistPrintInd": $scope.AllAscPrintObj.IsPreopChecklistPrintInd || false,
                        "IsIntraopCheckinChecklistPrintInd": $scope.AllAscPrintObj.IsIntraopCheckinChecklistPrintInd || false,
                        "IsIntraopAnesthesiaPrintInd": $scope.AllAscPrintObj.IsIntraopAnesthesiaPrintInd || false,
                        "IsIntraopChecklistPrintInd": $scope.AllAscPrintObj.IsIntraopChecklistPrintInd || false,
                        "AscPreAdmissionIndex": Preadmindex || 0,
                        "AscAdmitDetailsIndex": Admitdetailsindex || 0,
                        "AscPreOPIndex": Preopindex || 0,
                        "AscIntraopIndex": Intraopindex || 0,
                        "AscPostopIndex": Postopindex || 0,
                        "AdmitSurgeonOrderDetails": AdmitSurgeonOrders.OrderDetails,
                        "AdmitODPupilSize": AdmitSurgeonOrders.ODPupilSize,
                        "AdmitOSPupilSize": AdmitSurgeonOrders.OSPupilSize,
                        "IsAdmitSurgeonOrdersTimeChecked": AdmitSurgeonOrders.IsSurgeonOrdersTimeChecked,
                        "PostopDischargeindex": PostopDischargeindex || 0,
                        "FemtoTemplateindex": FemtoTemplateindex || 0,
                        "OperativeNotesindex": OperativeNotesindex || 0,
                        "IVSiteName": $scope.AscPreopObj.IVSiteName || '',
                        "IVNeedleSizeName": $scope.AscPreopObj.IVNeedleSizeName || '',
                        "PatencyStatus": $scope.AscPreopObj.PatencyStatus || "",
                        "IVArm": $scope.AscPreopObj.IVArm || "",
                        "SurgicalSiteVerifiedByName": $scope.AscPreopObj.SurgicalSiteVerifiedByName || "",
                        "IVBlockedArray": $scope.AscPreopObj.IVBlockedArray || [],
                        "SurgicalSiteList": $scope.AscPreopObj.SurgicalSiteList || [],
                        "PatientPaticipateList": $scope.AscPreopObj.PatientPaticipateList || [],
                        "IVCondition": $scope.AscPreopObj.IVCondition || [],
                        "PreOpHandOffTime": $scope.AscPreopObj.PreOpHandOffTime || "",
                        "PreOpHandoffRemarks": $scope.AscPreopObj.PreOpHandoffRemarks || "",
                        "PreOpHandOffReviewedByName": $scope.AscPreopObj.PreOpHandOffReviewedByName || '',
                        "PreOpHandOffFromName": $scope.AscPreopObj.PreOpHandOffFromName || '',
                        "IntraOpCheckInCheckListArray": IntraOpCheckInCheckListArray || [],
                        'PatientReceivedByName': $scope.AscIntraop.NurseActions.PatientReceivedByName || '',
                        'PatientReceivedTime': $scope.AscIntraop.NurseActions.HallEntranceStartTime || '',
                        "SubOrganList": SubOrganList || [],
                        "OthersDetailsArray": $scope.AscIntraop.OthersDetailsArray || [],
                        "PostOpcheckList": PostOpcheckListArray || [],
                        "PostOpProgressNotes": PostOpProgressNotesArray || [],
                        "PostOpGeneralOrder": PostOpGeneralOrderArray || [],
                        "PostOpCheckOutActionsArray": PostOpCheckOutArray || [],
                        "PostOpCallList": PostOpCallListArray || [],
                        "PostOpCheckOutActionNotes": $scope.AscPostOp.NurseChart.Actions.Notes || '',
                        "IntrOpHandOffTime": $scope.AscPostOp.IntrOpHandOffTime || '',
                        "IntraOpHandOffReviewedByname": $scope.AscPostOp.IntraOpHandOffReviewedByname || '',
                        "PreOpOverallNotes": $scope.AscPreopObj.PreOpOverallNotes || '',
                        'NurseFallRiskName': $scope.AscPreopObj.NurseFallRiskName || '',
                        'NurseFallRiskLicenseNo': $scope.AscPreopObj.NurseFallRiskLicenseNo || '',
                        'NurseFallRiskReviewdDate': $scope.AscPreopObj.NurseFallRiskReviewdDate || '',
                        'FallRiskLevel': $scope.AscPreopObj.FallRiskLevel || '',
                        'FallRiskAssessmentTotalScore': $scope.AscPreopObj.FallRiskAssessmentTotalScore || 0,
                        'FallriskBraceletprovided': $scope.AscPreopObj.FallriskBraceletprovided || '',
                        'AssistiveWalkingDevice': $scope.AscPreopObj.AssistiveWalkingDevice || '',
                        'ImplementedFallRiskProtocoltype': fallRiskProtocolType || '',
                        "FallRiskAssesment": $scope.FallRiskAssesment || [],
                        "PatientSignString": $scope.AscDischargeSummaryObj.PatientSignString || '',
                        "NurseSignString": $scope.AscDischargeSummaryObj.NurseSignString || '',
                        "AccompaniedBySignString": $scope.AscDischargeSummaryObj.AccompaniedBySign || '',
                        "PatientSignedDateTime": $scope.AscDischargeSummaryObj.PatientSignedDateTime || null,
                        "NurseSignedDateTime": $scope.AscDischargeSummaryObj.NurseSignedDateTime || null,
                        "AccompaniedByDateTime": $scope.AscDischargeSummaryObj.AccompaniedBySignedDateTime || null,
                        "AccompainedBy": $scope.AscDischargeSummaryObj.AccompainedBy || '',
                        "AccompainedByNotes": $scope.AscDischargeSummaryObj.AccompainedByNotes || '',
                        "DischargeAccompainedName": $scope.AscDischargeSummaryObj.DischargeAccompainedName || '',
                        "SignaturePatientName": $scope.cacheStorageItem.PatientName || '',
                        "SignatureNurseName": $scope.AscDischargeSummaryObj.SignatureNurseName || '',
                        "AnesthesiaTypelist": AscIntraopanesthesiaTypeList || [],
                        //'SystemicOthersNotesObjData': SystemicOthersNotesObj || '',
                        "OperativeOverAllRemarks": $scope.AscOperativeNotes.OperativeOverAllRemarks || '',
                        'HandOffReviewedByName': $scope.AscIntraop.HandOffReviewedByName || '',
                        'HandOffFromReviewedByName': $scope.AscIntraop.HandOffFromReviewedByName || '',
                        'HandOffTime': $scope.AscIntraop.HandOffTime || '',
                        'HandoffRemarks': $scope.AscIntraop.HandoffRemarks || '',
                        'AllergyRemarks': $scope.AllAscPrintObj.AllergyRemarks || '',
                        'SurgicalRemarks': $scope.AllAscPrintObj.SurgicalRemarks || '',
                        'CurrentEyeRemarks': $scope.AllAscPrintObj.CurrentEyeRemarks || '',
                        'CurrentSystemicRemarks': $scope.AllAscPrintObj.CurrentSystemicRemarks || '',
                        'SystemicHistoryRemarks': $scope.AllAscPrintObj.SystemicHistoryRemarks || '',
                        'LifestyleHistoryRemarks': $scope.AllAscPrintObj.LifestyleHistoryRemarks || '',
                        "MedicationInstructionsList": $scope.AllAscPrintObj.ReconcileMedicationList || [],
                        "PostOpMedicationDetails": PostOpOrderListArray || [],
                        "PostOpOrderAnesthesiaListArray": PostOpOrderAnesthesiaListArray || [],
                        "PreOpDialationMedicationDetails": PreOpDialationMedicationListArray || [],
                        "PreOpMedicationDetails": PreOpMedicationListArray || [],
                        "OrderDetails": AnesthesiaOrdersdata || [],
                        "RespiratoryRemarks": $scope.AllAscPrintObj.RespiratoryRemarks || '',
                        "SystemicOthersNotesObj": SystemicOthersNotesObj || '',
                        "CurrentAppointmentVital": $scope.CurrentAppointmentVital || {},
                        "ProcedureVerify": $scope.AscPreopObj.ProcedureVerify || [],
                        "PreOpSurgicalSiteRemarks": $scope.AscPreopObj.PreOpSurgicalSiteRemarks || "",
                        "IVSiteFluidsName": $scope.AscPreopObj.IVSiteFluidsName || '',
                        "IVSiteFlushName": $scope.AscPreopObj.IVSiteFlushName || '',
                        "IVSiteLactatedRingersName": $scope.AscPreopObj.IVSiteLactatedRingersName || '',
                        "SurgicalSupplyName": $scope.AscIntraop.SurgicalSupplyName || '',
                        "ExpirationDate": $scope.AscIntraop.ExpirationDate || null,
                        "LotNumber": $scope.AscIntraop.LotNumber || null,
                        "PhacoMachines": $scope.AscIntraop.PhacoMachines || [],
                        "OxygenType": $scope.AscPostOp.OxygenType || '',
                        "OxygenQuantity": $scope.AscPostOp.OxygenQuantity || '',
                        "PreOpInRoomTime": $scope.AscPreopObj.PreOpInRoomTime || '',
                        "PreOpDiabetesRemarks": $scope.AscPreopObj.PreOpDiabetesRemarks || '',
                        "IvAccessGivenByName": $scope.AscPreopObj.IvAccessGivenByName || '',
                        "IvAccessGivenByTime": $scope.AscPreopObj.IvAccessGivenByTime || '',
                        "NoOfAttempts": $scope.AscPreopObj.NoOfAttempts || null,
                        "IntraOpAnesthesiaStartTime": $scope.AscPostOp.IntraOpAnesthesiaStartTime || '',
                        "IntraOpAnesthesiaEndTime": $scope.AscPostOp.IntraOpAnesthesiaEndTime || '',
                        "CPTCode": $scope.SurgeryDiagnosisObj.CPTCode || '',
                        "DiscontinueIVTime": $scope.AscPostOp.DiscontinueIVTime || '',
                        "PatientDischargeTime": $scope.AscPostOp.PatientDischargeTime || '',
                        "IntraOpOrderAnesthesia": IntraOpOrderAnesthesia || [],
                        "IntraOpMedicationDetails": IntraOpOrderListArray || [],
                        "BranchId": $scope.AppointmentBranch || 0,
                        "IsIOJParentOrganization": $scope.ParentObj.IsIOJParentOrganization || false,
                        "OrganizationDetails": orgDetails,
                        "EhnoteOrganisationLogoUrl": orgDetails?.[0]?.OrganizationLogoUrl || '',
                        "PatientarrivalObj": $scope.PatientarrivalObj || '',
                        "ReceivedsurgeryChecklistData": ReceivedsurgeryChecklistData || [],
                        "BeforeAnesthesiaChecklist": $scope.BeforeAnesthesiaChecklist || [],
                        "IntraOpCheckANSInCheckListArray": IntraOpCheckANSInCheckListArray || [],
                        "IntraOpCheckoutCheckListArray": IntraOpCheckoutCheckListArray || [],
                        "NurseInterventions": NurseInterventions || [],
                        "MedicalReconcilation": MedicalRecon || [],
                        "IsSurgeonOrdersTimeChecked": preopresp?.IsSurgeonOrdersTimeChecked || false,
                        "IsAnesthesiaOrdersTimeChecked": preopresp?.IsAnesthesiaOrdersTimeChecked || false,
                        "Recovery2Intime": postopresp?.Recovery2Intime || null,
                        "Recovery2Outtime": postopresp?.Recovery2Outtime || null,
                        "Recovery2PostOpAnesthesiaNotes": postopresp?.Recovery2PostOpAnesthesiaNotes || "",
                        "Recovery2PostOpNotes": postopresp?.Recovery2PostOpNotes || "",
                        "DietMedications": $scope.DietMedications || [],
                        "PBaseURL": postopresp?.BaseURL || "",
                        "AdmittedByDateTime": $scope.AdmissionObj.AdmittedByDateTime || '',
                        "ReviewedByDateTime": $scope.AdmissionObj.ReviewedByDateTime || '',
                        "FacesheetLastSignOffUserDetails": FaceSheetSignOffUserDetails || [],
                        "DoctorNotesindex": DoctorNotesindex || 0,
                        "SurgeonVerifiedUserName": SurgeonVerifiedUserName || '',
                        "FaceSheetChartStatus": FaceSheetChartStatus || '',
                        "DischargeChartStatus": postopdischarge?.DischargeChartStatus || '',
                        "PostOpNurseChartStatus": postopresp?.PostOpNurseChartStatus || '',
                        "PostOpAnesthesiaChartStatus": postopresp?.PostOpAnesthesiaChartStatus || '',
                        "IntraOpNurseChartStatus": $scope.AscIntraop.IntraOpNurseChartStatus || '',
                        "IntraOpAnesthesiaChartStatus": $scope.AscIntraop.IntraOpAnesthesiaChartStatus || '',
                        "PreOpNurseChartStatus": preopresp?.PreOpNurseChartStatus || '',
                        "PreOpAnesthesiaChartStatus": preopresp?.PreOpAnesthesiaChartStatus || '',
                        "OperativeChartStatus": operativenotes?.OperativeChartStatus || '',
                        "BeforeIncisionReviewedDateTime": $scope.AscIntraop.BeforeIncisionReviewedDateTime || '',
                        "BeforeORReviewedDateTime": $scope.AscIntraop.BeforeORReviewedDateTime || '',
                        "IVAccessDetailsList": $scope.AscPreopObj.IVAccessDetailsList || [],
                        "IsDoctorNotesPrintInd": $scope.AllAscPrintObj.IsDoctorNotesPrintInd || false,
                        "PreviousCDAValueGivenDate": $scope.FaceSheetObj.PreviousCDAValueGivenDate || '',
                        "PreviousCDAOSValue": $scope.FaceSheetObj.PreviousCDAOSValue || '',
                        "PreviousCDAODValue": $scope.FaceSheetObj.PreviousCDAODValue || '',
                        "PreviousValuesObj": $scope.PreviousValuesObj || '',
                        "FaceSheetCheckList": $scope.FaceSheetObj.FaceSheetCheckList || [],
                        "CodeImplants": operativenotes?.CodeImplants || '',
                        "OtherCodes": operativenotes?.OtherCodes || '',
                        "MedicationsPostOP": operativenotes?.MedicationsPostOP || '',
                        "CheifComplaints": operativenotes?.CheifComplaints || '',
                        "OccularHistoryRemarks": operativenotes?.OccularHistoryRemarks || '',
                        "OccularHistory": operativenotes?.OccularHistory || [],
                        "PostOpMedicationsNotes": operativenotes?.PostOpMedicationsNotes || '',
                        "SurgeryEyeStatusId": $scope.SurgeryDiagnosisObj.SurgeryEyeStatusId || 0,
                        "PreopNurseVitals": $scope.PreopNursevitalarray || [],
                        "PreopAnesthesiaVitals": $scope.PreopAnesthesiavitalarray || [],
                        "ProgressOverAllNotes": postopresp?.ProgressOverAllNotes || '',
                        "PreOpMedications": $scope.AscIntraop?.PreOpMedications || [],
                        "R2PostOpNurseChartStatus": postopresp?.R2PostOpNurseChartStatus || '',
                        "R2PostOpAnesthesiaChartStatus": postopresp?.R2PostOpAnesthesiaChartStatus || '',
                        "RecoveryEndTime": postopresp?.RecoveryStopTime || '',
                        "IsShowEmptyASCChecklist": $scope.IsShowEmptyASCChecklist || false,
                        "IsIntraOpSurgeonOrdersTimeAdded": $scope.AscIntraop?.IsIntraOpSurgeonOrdersTimeAdded || false,
                        "IsIntraOpAnesthesiaOrdersTimeAdded": $scope.AscIntraop?.IsIntraOpAnesthesiaOrdersTimeAdded || false,
                        "IsPostOpSurgeonOrdersTimeAdded": postopresp?.IsPostOpSurgeonOrdersTimeAdded || false,
                        "IsPostOpAnesthesiaOrdersTimeAdded": postopresp?.IsPostOpAnesthesiaOrdersTimeAdded || false,
                        "IntraOpSurgeryStaffNotes": $scope.AscIntraop?.IntraOpSurgeryStaffNotes || "",

                    }
                    let FaxOrPrintModeObj = {
                        "UserId": eHnoteMasterDataService.getLoginId(),
                        "OrganizationId": $scope.HospitalId || 0,
                        "PatientId": $scope.SelectedPatientId || 0,
                        "PatientName": Object.Name || "",
                        "IsPrintOnlyInd": true
                    } 
                   

                    USPrintService.GenerateAllASCPrints(Object, FaxOrPrintModeObj)
                        .then(function (resp) {
                            if (resp.status == "Success") {
                                let ascPdfObj = resp || {};
                                let date = $filter('date')(ascPdfObj.CreatedDt, 'MM-dd-yyyy');
                                $scope.AttachmentsArray = [];
                                let FileName = "";
                                if (ascPdfObj.FileName != '') {
                                    FileName = ascPdfObj.FileName.replace(/\s+/g, '');
                                }
                                var attachmentObj = {
                                    "FileId": 0,
                                    "FileName": FileName,
                                    "S3URL": ascPdfObj.S3url,
                                    "ExternalFileName": "_" + "Attachment",
                                    "FileExt": ascPdfObj.FileExt || "",
                                    "MimeType": "application/pdf",
                                    "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                                    "CreatedDate": date,
                                    "DeleteInd": "N",
                                    "DirectSecureMessageId": 0
                                }

                                $scope.AttachmentsArray.push(attachmentObj);
                                $uibModalInstance.close({
                                    attachments: $scope.AttachmentsArray,
                                    categoryList: $scope.GetCategoryListObj,
                                    chartSelectAllObj: $scope.ChartSelectALLobj,
                                    PastVisitSummaryGrid: $scope.PastVisitSummaryGrid,
                                    TempIsCheckArray: $scope.TempIsCheckArray
                                });
                            }
                        })
                        .catch(function (err) {
                            console.error("Error uploading PDF:", err);
                        })
                        .finally(function () {
                             //Hiding Loader
                            $rootScope.$broadcast("loader_hide");
                            $("#maineHnoteLoader").hide();
                            $scope.maineHnoteLoader = false;
                            $rootScope.mainsubeHnoteLoader = false;
                            console.log("Upload attempt completed.");
                        });
                }, 1000);
             }
        /* All Print - End  */

        }
    $scope.GetPdfGenerate = function () {
        
        if ($scope.IsitAscSurgeryApptInd) {
           generateAscSummaryPrintPdf();
            return;
        } else {
            $scope.ChartOverAllPrint($scope.treatmentArray[0]);
        }
        //console.log("$scope.TempIsCheckArray", $scope.TempIsCheckArray)
        //let selectedItems = getCheckedItems($scope.TempIsCheckArray);
        //function isSelected(sectionName, selectedItems) {
        //    return selectedItems.includes(sectionName);
        //}
        //function isOrdersSelected(sectionKey, selectedItems) {
        //    if (!Array.isArray(selectedItems)) return false;
        //    const ordersSections = [
        //        'InvestigationsDetails',
        //        'SurgeriesDetails',
        //        'ProceduresDetails',
        //        'ReferralDetails'
        //    ];
        //    return ordersSections.includes(sectionKey) && selectedItems.includes('Orders');
        //}
        //function isAssessmentSelected(selectedItems) {
        //    const isAssessmentPlanNamesArray = $scope.GetCategoryListObj.AssesmentPlanArray.filter(item => item.IsCheck === true).map(mitem => mitem.Name);
        //    return isAssessmentPlanNamesArray.some(item => selectedItems.includes(item))
        //}
        //function isAutorefraction(selectedKey, selectedItems) {
        //    if (!Array.isArray(selectedItems)) return false;
        //    const refractionArray = $scope.GetCategoryListObj.VisionAndPerceptionArray[1].RefractionArr.filter(item => item.IsCheck === true).map(mitem => mitem.Name);
        //    return refractionArray.some(item => selectedItems.includes(item) && selectedItems.includes(selectedKey));
        //}

        //function isSelectedColorVision(sectionKey, selectedItems) {
        //    const colorVision = $scope.GetCategoryListObj.ExaminactionArray[4].Name
        //    return colorVision === sectionKey && selectedItems.includes('Color Vision');
        //}
        //function isMotorExaminationSelected(selectedKey, selectedItems) {
        //    const examinationArray = $scope.GetCategoryListObj.ExaminactionArray.find(
        //        item => item.Name === "Motor examination"
        //    );
        //    if (examinationArray && examinationArray.MotorExaminationArr) {
        //        return examinationArray.MotorExaminationArr.some(item => item.IsCheck === true && item.Name === selectedKey) && selectedItems.includes('Motor examination');
        //    }
        //    return false;
        //}
        //let tempArray = $filter("filter")($scope.treatmentArray, { "AppointmentId": $scope.SelectedAppointmentId }, true);
        //if (tempArray.length == 0) {
        //    return false;
        //}
        //if (tempArray.length > 0) {
        //    var TempConsultationPlan = angular.copy(tempArray[0]);
        //}
        //let PrescriptionDetails = [];
        //TempConsultationPlan.PatientPrescription = TempConsultationPlan.PatientPrescription || [];
        //if (TempConsultationPlan.PatientPrescription.length > 0) {
        //    PrescriptionDetails = TempConsultationPlan.PatientPrescription[0].PrescriptionDetails || [];
        //}
        //function isFollowUpDetails(sectionKey, selectedItems) {
        //    const ReturnToOffice = $scope.GetCategoryListObj.ReturnToOffice[0].Name
        //    return ReturnToOffice === sectionKey && selectedItems.includes('Return To Office');
        //}


        //if (TempConsultationPlan.FamilyHistory.length > 0) {
        //    angular.forEach(TempConsultationPlan.FamilyHistory, function (rositem) {
        //        angular.forEach(rositem.FamilyHistorySubArray, function (sitem) {
        //            rositem.RelationAge = sitem.RelationAge || '';
        //            rositem.RelationId = sitem.RelationId || null;
        //            rositem.RelationName = sitem.RelationShipName || '';
        //            rositem.Remarks = sitem.Remarks || '';
        //            rositem.Status = sitem.Status || '';
        //            rositem.SubRelation = sitem.SubRelation || '';
        //        });
        //    });
        //}

        //if (TempConsultationPlan.AssessmentPlan.length > 0) {
        //    TempConsultationPlan.AssessmentPlan = $filter("filter")(TempConsultationPlan.AssessmentPlan, function (FAitem, index) { return FAitem.DiagnosisStatusId1 == 2 || FAitem.DiagnosisStatusId2 == 2 }) || [];

        //}
        //var req = {
        //    "AllergyItems": isSelected('Allergies', selectedItems) ? TempConsultationPlan.AllergyItems : [],
        //    "AnteriorSegmentArrayNew": isSelected('Anterior Segment', selectedItems) ? TempConsultationPlan.AnteriorSegmentDetails : [],
        //    "AppointmentDate": TempConsultationPlan.AppointmentDt || "",
        //    "AppointmentDt": TempConsultationPlan.AppointmentDt || "",
        //    "AppointmentId": TempConsultationPlan.AppointmentId || "",
        //    "AppointmentTime": TempConsultationPlan.AppointmentTime || "",
        //    "Appointmentwith": TempConsultationPlan.Appointmentwith || "",
        //    "AssessmentPlan": isAssessmentSelected(selectedItems) ? TempConsultationPlan.AssessmentPlan : [],
        //    "AutoRefractionDetails": isAutorefraction('Auto Refraction', selectedItems) ? TempConsultationPlan.AutoRefractionArray : [],
        //    "BirthHistory": isSelected('Birth History', selectedItems) ? TempConsultationPlan.BirthHistory : [],
        //    "BranchAddress": TempConsultationPlan.BranchAddress || "",
        //    "BranchEmail": TempConsultationPlan.BranchEmail || "",
        //    "BranchId": TempConsultationPlan.BranchId || "",
        //    "BranchName": TempConsultationPlan.BranchName || "",
        //    "BranchPhone": TempConsultationPlan.BranchMobile || "",
        //    "ChiefComplaints": isSelected('Chief Complaints', selectedItems) ? TempConsultationPlan.ChiefComplaints : [],
        //    "ColorVisionDetails": isSelectedColorVision('Color Vision', selectedItems) ? TempConsultationPlan.ColorVisionDetails : [],
        //    "ContactLensDetails": isAutorefraction("Contact Lens", selectedItems) ? TempConsultationPlan.ContactLensDetails : [],
        //    "CurrentEyeMedications": isSelected('Current Eye Medication', selectedItems) ? TempConsultationPlan.CurrentEyeMedications : [],
        //    "CurrentSystemicHistory": isSelected('Current Systemic Medications', selectedItems) ? TempConsultationPlan.CurrentSystemicMedicationsHistory : [],
        //    "CycloplegicRefractionDetails": isAutorefraction('Cycloplegic Refraction', selectedItems) ? TempConsultationPlan.CycloplegicRefractionArray : [],
        //    "DilationArray": isAutorefraction('Refraction', selectedItems) ? TempConsultationPlan.DilationArray : [],
        //    "DoctorId": TempConsultationPlan.DoctorId || "",
        //    "DoctorName": TempConsultationPlan.Appointmentwith || "",
        //    "DryEyeEvalutionDetails": isSelected('Dry Eye Evaluation', selectedItems) ? TempConsultationPlan.DryEyeEvaluationData : [],
        //    "emailAddresses": TempConsultationPlan.emailAddresses || '',
        //    "FamilyHistory": isSelected('Family History', selectedItems) ? TempConsultationPlan.FamilyHistory : [],
        //    "FinalGlassRxDetails": isAutorefraction('Final Glass Rx', selectedItems) ? TempConsultationPlan.FinalGlassRxArray : [],
        //    "FollowUpDate": TempConsultationPlan.FollowUpDate || "",
        //    "FollowUpDuration": TempConsultationPlan.FollowUpDuration || "",
        //    "FollowUpDurationType": TempConsultationPlan.FollowUpDurationType || "",
        //    "FollowUpNotes": TempConsultationPlan.FollowUpNotes || "",
        //    "FunctionalStatusHistory": isSelected('FunctionalStatus History', selectedItems) ? TempConsultationPlan.FunctionalStatusHistory : [],
        //    "GlassDetails": isSelected('GlassDetails', selectedItems) ? TempConsultationPlan.GlassDetails : [],
        //    "GlareDetails": isSelected('Glare', selectedItems) ? TempConsultationPlan.GlareArray : [],
        //    "GonioscopyDetails": isSelected('Gonioscopy', selectedItems) ? TempConsultationPlan.GonioscopyDetails : [],
        //    "HeadPosterDetails": isMotorExaminationSelected("Squint Evaluation", selectedItems) ? TempConsultationPlan.HeadPosterDetails : [],
        //    "HealthConcerns": isSelected('Health Concerns & Goals', selectedItems) ? TempConsultationPlan.PatientHealthConcerns : [],
        //    "HealthGoals": isSelected('Health Concerns & Goals', selectedItems) ? TempConsultationPlan.PatientGoals : [],
        //    "ImplantList": isSelected('Implants', selectedItems) ? TempConsultationPlan.ImplantList : [],
        //    "InvestigationsDetails": isOrdersSelected('InvestigationsDetails', selectedItems) ? TempConsultationPlan.InvestigationsDetails : [],
        //    "KeratometryDetails": isSelected('Keratometry', selectedItems) ? TempConsultationPlan.KeratometryValues : [],
        //    "LabInvestigations": isSelected('Lab & Investigation', selectedItems) ? TempConsultationPlan.LabInvestigations : [],
        //    "LacrimalPatencyRemarks": TempConsultationPlan.LacrimalPatencyRemarks || "",
        //    "LacrimalPatiencyDetails": isSelected('Lacrimal Patency', selectedItems) ? TempConsultationPlan.LacrimalPatiencyDetails : [],
        //    "LabinvestigationNotes": TempConsultationPlan.labinvestigationNotes || "",
        //    "LifestyleHistory": isSelected('Life Style History', selectedItems) ? TempConsultationPlan.LifestyleHistory : [],
        //    "ManifestRefractionDetails": isAutorefraction('Manifest Refraction', selectedItems) ? TempConsultationPlan.ManifestRefractionArray : [],
        //    "PrescriptionDetails": isSelected('Medical Rx', selectedItems) ? TempConsultationPlan.PatientPrescription[0].PrescriptionDetails : [],
        //    // "MedicalConditions": isSelected('Medical Rx', selectedItems) ? TempConsultationPlan.MedicalConditions : [],
        //    "MenstrualHistory": isSelected('Menstrual History', selectedItems) ? TempConsultationPlan.MenstrualHistory : [],
        //    "ModifiedBy": TempConsultationPlan.ModifiedBy || "",
        //    "ModifiedDate": TempConsultationPlan.ModifiedDate || "",
        //    "NineGazeExtraOcularDetails": isMotorExaminationSelected("Binocular Vision Test", selectedItems) ? TempConsultationPlan.NineGazeExtraOcularDetails : [],
        //    "NutritionalHistory": isSelected('Nutritional History', selectedItems) ? TempConsultationPlan.NutritionalHistory : [],
        //    "OccularHistory": isSelected('Ocular History', selectedItems) ? TempConsultationPlan.OccularHistory : [],
        //    "OccularSurgicalHistory": isSelected('Ocular Surgical History', selectedItems) ? TempConsultationPlan.OccularSurgicalHistory : [],
        //    "OPProcedures": isSelected('Procedures', selectedItems) ? TempConsultationPlan.OPProceduresArray : [],
        //    "OPProceduresArray": isSelected('Procedures', selectedItems) ? TempConsultationPlan.OPProceduresArray : [],
        //    "OrgGSTNO": TempConsultationPlan.AppointmentId || "",
        //    "OverallChartNotes": TempConsultationPlan.OverallChartNotes || "",
        //    "OverallProcedureNotes": TempConsultationPlan.OverallProcedureNotes || "",
        //    "OverRefractionDetails": isAutorefraction("Over Refraction", selectedItems) ? TempConsultationPlan.OverRefractionArray : [],
        //    "PachymetryAvgODValue": TempConsultationPlan.PachymetryAvgODValue || "",
        //    "PachymetryAvgOSValue": TempConsultationPlan.PachymetryAvgOSValue || "",
        //    "PachymetryDetails": isSelected('Pachymetry', selectedItems) ? TempConsultationPlan.Pachymetry : [],
        //    "PachymetryRemarks": TempConsultationPlan.PachymetryRemarks || "",
        //    "PatientAge": TempConsultationPlan.PatientArray[0].PatientAge || "",
        //    "PatientDisplayId": TempConsultationPlan.PatientArray[0].PatientDisplayId || "",
        //    "PatientGender": TempConsultationPlan.PatientArray[0].PatientGender || "",
        //    "PatientGst": TempConsultationPlan.AppointmentId || "",
        //    "PatientId": TempConsultationPlan.PatientArray[0].PatientId || "",
        //    "PatientName": TempConsultationPlan.PatientArray[0].FullName || "",
        //    "PhoneNumber": TempConsultationPlan.PatientArray[0].PhoneNumber || "",
        //    "PGPRefractionDetails": isAutorefraction('Present Glass Rx', selectedItems) ? TempConsultationPlan.PGPrefractionArray : [],
        //    "PhysicalEvaluation": isSelected('PsychologicalObservations', selectedItems) ? TempConsultationPlan.CustomAllergyRemarks : [],
        //    "PosteriorSegmentDetails": isSelected('Posterior Segments', selectedItems) ? TempConsultationPlan.PosteriorSegmentDetails : [],
        //    "Prescrip‌tionDetails": isSelected('PrescriptionDetails', selectedItems) ? PrescriptionDetails : [],
        //    "ProceduresDetails": isSelected('Procedures', selectedItems) ? TempConsultationPlan.OPProceduresArray : [],
        //    "PsychiatryData": isSelected('Psychiatry', selectedItems) ? TempConsultationPlan.PsychiatryData : [],
        //    "PsychologicalObservations": $scope.ScoreObject,
        //    "PupilSizeDetails": isSelected('Pupil size', selectedItems) ? TempConsultationPlan.PupilSizeDetails : [],
        //    "PupilSizeRemarks": TempConsultationPlan.PupilSizeRemarks || "",
        //    "ReferralDetails": isOrdersSelected('ReferralDetails', selectedItems) ? TempConsultationPlan.ReferralDetails : [],
        //    "ReferalDoctorName": TempConsultationPlan.ReferalDoctorName || "",
        //    "RetinoscopyRefractionDetails": isAutorefraction('Retinoscopy', selectedItems) ? TempConsultationPlan.RetinoscopyRefractionArray : [],
        //    "ReturnToOfficeNotes": TempConsultationPlan.ReturnToOfficeNotes || "",
        //    "ReturnToOfficeDetails": isFollowUpDetails('Return To Office', selectedItems) ? TempConsultationPlan.FollowUpDetails : [],
        //    "RoleName": TempConsultationPlan.RoleName || "",
        //    "ROSAllergyHeaders": isSelected('ROSAllergyHeaders', selectedItems) ? TempConsultationPlan.ROSAllergyHeaders : [],
        //    "ROSOverAllRemarks": TempConsultationPlan.ROSOverAllRemarks,
        //    "ScribeName": TempConsultationPlan.ScribeName || "",
        //    "StatusFlag": TempConsultationPlan.StatusFlag || "",
        //    "SuperBill": isSelected('SuperBill', selectedItems) ? TempConsultationPlan.SuperBillObj : {},
        //    "SurgicalHistory": isSelected('Surgical History', selectedItems) ? TempConsultationPlan.SurgicalHistory : [],
        //    "SurgeriesDetails": isOrdersSelected('Surgical History', selectedItems) ? TempConsultationPlan.SurgeriesDetails : [],
        //    "SquintDetails": isMotorExaminationSelected("Squint Evaluation", selectedItems) ? TempConsultationPlan.SquintDetails : [],
        //    "SquintPossibleDiagnosis": TempConsultationPlan.SquintPossibleDiagnosis || "",
        //    "SystemicHistory": isSelected('Systemic History', selectedItems) ? TempConsultationPlan.SystemicHistory : [],
        //    "TonoMetryDetails": isAutorefraction("TonoMetry", selectedItems) ? TempConsultationPlan.Tonometry : [],
        //    "UserId": $scope.UserId,
        //    "VaccinationHistory": isSelected('Vaccination History', selectedItems) ? TempConsultationPlan.VaccinationHistory : [],
        //    "VisionDetails": isSelected('IOP', selectedItems) ? TempConsultationPlan.VisionDetails : [],
        //    "Vitals": isSelected('Vitals', selectedItems) ? TempConsultationPlan.Vitals : [],

        //    "isSendRefLetterMail": false
        //};


        //req.isSendRefLetterMail = false;
        ////if (TempConsultationPlan.ChiefComplaints.length > 0 && isSelected('Chief Complaints', selectedItems)) {
        ////    angular.forEach(TempConsultationPlan.ChiefComplaints, function (Citems) {
        ////        var checifobj = {
        ////            "ChiefComplaintId": Citems.ChiefComplaintId || 0,
        ////            "ChiefComplaintName": Citems.ChiefComplaintName || "",
        ////            "Description": Citems.Description || "",
        ////            "OrganId": Citems.OrganId || 0,
        ////            "Duration": 1,
        ////            "DurationType": Citems.DurationType || '',
        ////            "Remarks": Citems.Remarks || "",
        ////        }
        ////        req.ChiefComplaints.push(checifobj);
        ////    })
        ////}
        ////TempConsultationPlan.ImplantList = TempConsultationPlan.ImplantList || [];
        ////if (TempConsultationPlan.ImplantList.length > 0 && isSelected('Implants', selectedItems)) {
        ////    angular.forEach(TempConsultationPlan.ImplantList, function (ImpItem) {
        ////        var Impobj = {
        ////            "DeviceDescription": ImpItem.DeviceDescription || 0,
        ////            "Location": ImpItem.Location || "",
        ////            "UDI": ImpItem.UDI || ""
        ////        }
        ////        req.ImplantList.push(Impobj);
        ////    })
        ////}
        //eHnoteDiagnosisDataServices.GetDemoViewConsultationPdf(req).then(function (resp) {
        //    if (resp.data.Message == 'Success') {
        //        $scope.DemoConsultationPdfUrl = [];
        //        $scope.AttachmentsArray = [];
        //        $scope.DemoConsultationPdfUrl = resp.data.data || [];
        //        if ($scope.DemoConsultationPdfUrl.Attachments.length > 0) {
        //            angular.forEach($scope.DemoConsultationPdfUrl.Attachments, function (item) {
        //                var patname = TempConsultationPlan.PatientArray[0].FullName.replace(/ /g, "");
        //                var attachmentObj = {
        //                    "FileId": 0,
        //                    "FileName": patname + "_" + "Attachment",
        //                    "S3URL": item.S3Url,
        //                    "ExternalFileName": patname + "_" + "Attachment",
        //                    "FileExt": item.FileExt,
        //                    "MimeType": "application/pdf",
        //                    "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
        //                    "CreatedDate": $scope.currentdate,
        //                    "DeleteInd": "N",
        //                    "DirectSecureMessageId": 0
        //                }

        //                $scope.AttachmentsArray.push(attachmentObj);
        //            })


        //            // $uibModalInstance.close($scope.AttachmentsArray);
        //            $uibModalInstance.close({
        //                attachments: $scope.AttachmentsArray,
        //                categoryList: $scope.GetCategoryListObj,
        //                chartSelectAllObj: $scope.ChartSelectALLobj,
        //                PastVisitSummaryGrid: $scope.PastVisitSummaryGrid,
        //                TempIsCheckArray: $scope.TempIsCheckArray
        //            });
        //        }

        //        /*$scope.GetPatientAllAppointmentDataExportInfo();*/
        //    }
        //})
    }
    function getCheckedItems(items) {
        let checkedItems = [];
        angular.forEach(items, function (item) {
            if (item.IsCheck === true) {
                checkedItems.push(item.Name);
            }
            angular.forEach(item, function (subItem) {
                if (subItem && Array.isArray(subItem)) {
                    checkedItems = checkedItems.concat(getCheckedItems(subItem));
                }
            });
        });
        return checkedItems;
    }
    function GetRemarksHeadersobj() {  // ROS Physical Evaluation
        var obj = [
            { "Id": 1, "Name": 'Eyes', "Active": "N" },
            { "Id": 2, "Name": 'Respiratory', "Active": "N" },
            { "Id": 3, "Name": 'ENT', "Active": "N" },
            { "Id": 4, "Name": 'Skin', "Active": "N" },
            { "Id": 5, "Name": 'Genito-Urinary', "Active": "N" },
            { "Id": 6, "Name": 'Gastro Interstinal', "Active": "N" },
            { "Id": 7, "Name": 'Cardio Vascular', "Active": "N" },
            { "Id": 8, "Name": 'Blood/Lymph', "Active": "N" },
            { "Id": 9, "Name": 'Psychiatric', "Active": "N" },
            { "Id": 10, "Name": 'Constitutional', "Active": "N" },
            { "Id": 11, "Name": 'Neurological', "Active": "N" },
            { "Id": 12, "Name": 'Muscolo skeletal', "Active": "N" },
            { "Id": 13, "Name": 'Endocrine', "Active": "N" },
            { "Id": 14, "Name": 'Immunologic', "Active": "N" }
        ];
        return obj;
    };
    $scope.GetRemarksHeaders = angular.copy(GetRemarksHeadersobj());
    $scope.GetPatientAppointmenthistroy = function (consultationid, AppointmentID, v_id) {
        var type = 0;
        if (consultationid === 0) {
            type = 1;
        }
        var object = {
            "AppointmentId": AppointmentID,
            "Type": type,
            "VisitId": v_id
        };
        eHnotePatientDataService.GetPatientConsultationDetailsByApptId(object).then(function (resp) {
            if (resp.data !== undefined) {
                
                $scope.treatmentData = resp.data;
                $scope.treatmentArray = [];

                angular.forEach(resp.data, function (item) {
                    if (AppointmentID === item.AppointmentId) {
                        let ApptTime = item.AppointmentDt + ' ' + item.AppointmentTime;
                        ApptTime = $filter('date')(new Date(ApptTime), "hh:mm a");
                        item.AppointmentTime = ApptTime;

                        item.OrganizationDetails = item.OrganizationDetails || [];
                        if (item.OrganizationDetails.length > 0) {
                            item.OrganizationDetails[0].OrganizationLogoUrl = item.OrganizationDetails[0].OrganizationLogoUrl || "";
                            if (item.OrganizationDetails[0].OrganizationLogoUrl !== "") {
                                $scope.toDataURL(item.OrganizationDetails[0].OrganizationLogoUrl, function (dataURL) {
                                    item.OrganizationDetails[0].OrganizationLogoUrl = dataURL;
                                });
                            }
                        }


                        $scope.treatmentArray.push(item);
                    }
                });
                $scope.RegisterPatientNotesArray = [];
                if ($scope.treatmentData.length > 0) {
                    angular.forEach($scope.treatmentData, function (Titem) {

                        if (Titem.PatientNotesArray.length > 0) {
                            angular.forEach(Titem.PatientNotesArray, function (mitem) {
                                if (Titem.AppointmentId == mitem.AppointmentId) {
                                    $scope.RegisterPatientNotesArray.push(mitem);
                                }

                            });
                        }

                        if (Titem.NineGazeExtraOcularDetails.length > 0) {
                            angular.forEach(Titem.NineGazeExtraOcularDetails, function (item) {
                                item.IsInvDataAdded = false;
                                if (item.ActiveInd === 'N') {
                                    item.IsInvDataAdded = true;

                                }

                                if (item.InvestigationId === 695) {
                                    var hasData = false;

                                    var checkData = function (data) {
                                        if (!data) return false;
                                        var found = false;
                                        angular.forEach(data, function (pos) {
                                            if (pos && ((pos.H && (pos.H.Amount || pos.H.Direction)) ||
                                                (pos.V && (pos.V.Amount || pos.V.Direction)))) {
                                                found = true;
                                            }
                                        });
                                        return found;
                                    };

                                    hasData = checkData(item.ODDistance) || checkData(item.OSDistance) ||
                                        checkData(item.ODNear) || checkData(item.OSNear) ||
                                        (item.ODNotes && item.ODNotes.length > 0) ||
                                        (item.OSNotes && item.OSNotes.length > 0) ||
                                        item.ODFullEOM || item.OSFullEOM;

                                    item.ActiveInd = hasData ? 'Y' : 'N';
                                    item.IsInvDataAdded = hasData;

                                }

                                if (item.ActiveInd === 'Y') {
                                    if (item.InvestigationId === 695) {
                                        item.AlphaPatternInd = false;
                                        if (item.AlphabetPattern != "") {
                                            item.IsInvDataAdded = true;
                                            item.AlphaPatternInd = true;
                                        }
                                        //if (item.RsrValue != "" || item.RsrIoValue != "" || item.RIoValue != "" || item.RLrValue != "" || item.RPgValue != "" || item.RMrValue != "" || item.RMrValue != "" || item.RIrValue != "" || item.RIrSoValue != "" || item.RSoValue != "" || item.LIoValue != "" || item.LIoSrValue != "" || item.LSrValue != "" || item.LMrValue != "" || item.LPgValue != "" || item.LLrValue != "" || item.LSoValue != "" || item.LSoIrValue != "" || item.LIrValue != "" || item.LRemarks != "" || item.RRemarks != "") {
                                        //    item.IsInvDataAdded = true;

                                        //}
                                    }
                                    if (item.InvestigationId === 18) {
                                        item.ExtraOcularInd = false;
                                        item.AlphaPatternInd = false;
                                        if (item.RsrValue != "" || item.RIoValue != "" || item.RLrValue != "" || item.RPgValue != "" || item.RMrValue != "" || item.RIrValue != "" || item.RIrSoValue != "" || item.RSoValue != "" || item.LIoValue != "" || item.LSrValue != "" || item.LMrValue != "" || item.LPgValue != "" || item.LLrValue != "" || item.LSoValue != "" || item.LIrValue != "" || item.LRemarks != "" || item.RRemarks != "") {
                                            item.IsInvDataAdded = true;
                                            item.ExtraOcularInd = true;
                                        }
                                    }

                                    if (item.InvestigationId === 2095) {
                                        item.ExtraOcularInd = false;
                                        item.AlphaPatternInd = false;
                                        if (item.RsrValue != "" || item.RIoValue != "" || item.RLrValue != "" || item.RPgValue != "" || item.RMrValue != "" || item.RIrValue != "" || item.RIrSoValue != "" || item.RSoValue != "" || item.LIoValue != "" || item.LSrValue != "" || item.LMrValue != "" || item.LPgValue != "" || item.LLrValue != "" || item.LSoValue != "" || item.LIrValue != "" || item.LRemarks != "" || item.RRemarks != "") {
                                            item.IsInvDataAdded = true;
                                            item.ExtraOcularInd = true;
                                        }
                                    }
                                    if (item.InvestigationId === 2096) {
                                        if (item.DistanceRemarks != "" || item.NearRemarks != "") {
                                            item.IsInvDataAdded = true;
                                        }
                                    }
                                }
                            });
                        }

                        if (Titem.SquintDetails.length > 0) {
                            $scope.IsShowPrismDetails = false;
                            angular.forEach(Titem.SquintDetails, function (item) {
                                item.IsInvDataAdded = false;
                                if (item.ActiveInd === 'N') {
                                    item.IsInvDataAdded = true;
                                }
                                if (item.ActiveInd === 'Y') {

                                    if (item.InvestigationId === 700) {
                                        if (item.TypeOfSquint.RightEye.length > 0 || item.TypeOfSquint.LeftEye.length > 0) {
                                            item.IsInvDataAdded = true;
                                        }
                                    }
                                    if (item.InvestigationId === 696 || item.InvestigationId === 701) {
                                        if (item.Remarks != "") {
                                            item.IsInvDataAdded = true;
                                        }
                                    }
                                    if (item.InvestigationId === 701) {
                                        if (item.Fly !== "" || item.Animals !== "" || item.Circles !== "" || item.RandotCircles !== "" || item.DistVectograph !== "" || item.DistStereo !== "" || item.Frisby !== "" || item.Lang !== "" || item.Remarks != "") {
                                            item.IsInvDataAdded = true;
                                        }
                                    }
                                    if (item.InvestigationId === 2095) {
                                        if (item.InvestigationOrgans.length > 0) {
                                            item.IsInvDataAdded = true;
                                            var i = 0;
                                            angular.forEach(item.InvestigationOrgans, function (sitem) {
                                                if (sitem.DeleteInd == 'N') {
                                                    i++
                                                }
                                            });
                                            if (i > 0) {
                                                $scope.IsShowDuction = true;
                                            } else {
                                                $scope.IsShowDuction = false;
                                            }
                                        }
                                    }
                                    if (item.InvestigationId === 697) {
                                        if (item.RightEye.Name != "" || item.RightEye.DegreeValue != "" || item.LeftEye.Name != "" || item.LeftEye.DegreeValue != "" || item.Remarks != "") {
                                            item.IsInvDataAdded = true;
                                        }
                                    }
                                    if (item.InvestigationId === 699) {
                                        if (item.DistanceValue !== '' || item.NearValue !== '' || item.DistanceTypeOfSquintId !== 0 || item.DistanceTypeOfSquintValue !== '' || item.DistanceFixationPreference !== ''
                                            || item.NearTypeOfSquintId !== 0 || item.NearTypeOfSquintValue !== '' || item.NearFixationPreference !== '' || item.Remarks !== '') {
                                            item.IsInvDataAdded = true;
                                        }

                                    }
                                    if (item.InvestigationId === 719) {
                                        if (item.PrismCoverDetailsArray.length > 0) {
                                            angular.forEach(item.PrismCoverDetailsArray, function (subitem) {
                                                subitem.IsInvDataAdded = false;
                                                if (subitem.Distance.DistanceRPrismValue != "" || subitem.Distance.DistanceLPrismValue != "" || subitem.Distance.DistanceRTypeOfSquintId != 0 || subitem.Distance.DistanceRTypeOfSquintValue != "" ||
                                                    subitem.Distance.DistanceLTypeOfSquintId != 0 || subitem.Distance.DistanceLTypeOfSquintValue != "" || subitem.Distance.DistanceRFixationPreference != "" || subitem.Distance.DistanceLFixationPreference != "" || subitem.Near.NearRPrismValue != "" || subitem.Near.NearLPrismValue != "" || subitem.Near.NearRTypeOfSquintId != 0 || subitem.Near.NearRTypeOfSquintValue != "" ||
                                                    subitem.Near.NearLTypeOfSquintId != 0 || subitem.Near.NearLTypeOfSquintValue != "" || subitem.Near.NearRFixationPreference != "" || subitem.Near.NearLFixationPreference != "" || subitem.AllRemarks != "") {
                                                    subitem.IsInvDataAdded = true;
                                                    item.IsInvDataAdded = true;
                                                    $scope.IsShowPrismDetails = true;
                                                }
                                            });
                                        }

                                    }
                                    if (item.InvestigationId === 721) {
                                        if (item.IsNystagmusNormal || item.Remarks || (item.NystagmusDetailsArray && item.NystagmusDetailsArray.length > 0)) {
                                            item.IsInvDataAdded = true;
                                        }
                                    }
                                    if (item.InvestigationId === 64) {
                                        if (item.DistanceValue !== '' || item.NearValue !== '' || item.Remarks != "") {
                                            item.IsInvDataAdded = true;
                                        }
                                    }

                                }

                            });
                        }

                        if (Titem.NearInvestigationdetails.length > 0) {
                            angular.forEach(Titem.NearInvestigationdetails, function (item) {
                                item.IsInvDataAdded = false;
                                if (item.ActiveInd === 'N') {
                                    item.IsInvDataAdded = true;
                                }
                                if (item.ActiveInd === 'Y') {
                                    if (item.InvestigationId === 815) {
                                        if (item.BlurOUValue != "" || item.BreakOUValue != "" || item.RecoveryOUValue != "" || item.Remarks != "") {
                                            item.IsInvDataAdded = true;
                                        }
                                    }
                                    if (item.InvestigationId === 2122) {
                                        if (item.BlurODValue != "" || item.BreakODValue != "" || item.RecoveryODValue != "" || item.Remarks != "" || item.BlurOSValue != "" || item.BreakOSValue != "" || item.RecoveryOSValue != "") {
                                            item.IsInvDataAdded = true;
                                        }
                                    }

                                    if (item.InvestigationId === 2123) {
                                        if (item.ODNegativeDistaceValue != "" || item.ODNegativeNearValue != "" || item.ODPositiveDistaceValue != "" || item.ODPositiveNearValue != "" || item.OSNegativeDistaceValue != "" || item.OSNegativeNearValue != "" || item.OSPositiveDistaceValue != "" || item.OSPositiveNearValue != "" || item.Remarks != "") {
                                            item.IsInvDataAdded = true;
                                        }
                                    }
                                    if (item.InvestigationId === 2124) {
                                        if (item.ODNegativeDistaceValue != "" || item.ODNegativeNearValue != "" || item.ODPositiveDistaceValue != "" || item.ODPositiveNearValue != "" || item.OSNegativeDistaceValue != "" || item.OSNegativeNearValue != "" || item.OSPositiveDistaceValue != "" || item.OSPositiveNearValue != "" || item.Remarks != "") {
                                            item.IsInvDataAdded = true;
                                        }
                                    }

                                }


                            });
                        }

                        if (Titem.DryEyeEvaluationData.length > 0) {
                            angular.forEach(Titem.DryEyeEvaluationData, function (item) {
                                item.ODValue1 = item.ODValue1 || '';
                                item.ODValue2 = item.ODValue2 || '';
                                item.ODvalue3 = item.ODvalue3 || '';
                                item.OSValue1 = item.OSValue1 || '';
                                item.OSValue2 = item.OSValue2 || '';
                                item.OSvalue3 = item.OSvalue3 || '';
                                item.Remarks = item.Remarks || '';
                                item.ODValue21 = item.ODValue21 || '';
                                item.ODvalue31 = item.ODvalue31 || '';
                                item.OSValue21 = item.OSValue21 || '';
                                item.OSvalue31 = item.OSvalue31 || '';

                                item.IsInvDataAdded = false;
                                if (item.ActiveInd === 'N') {
                                    item.IsInvDataAdded = true;
                                }
                                if (item.ActiveInd === 'Y') {
                                    if (item.InvestigationId === 2079) {
                                        if (item.ODValue2 != '' || item.ODvalue3 != '' || item.OSValue2 != '' || item.OSvalue3 != '' || item.Remarks != '' || item.ODValue21 != '' || item.ODvalue31 != '' || item.OSValue21 != '' || item.OSvalue31 != '') {
                                            item.IsInvDataAdded = true;
                                        }
                                    } else {
                                        if (item.ODValue1 != '' || item.ODValue2 != '' || item.ODvalue3 != '' || item.OSValue1 != '' || item.OSValue2 != '' || item.OSvalue3 != '' || item.Remarks != '') {
                                            item.IsInvDataAdded = true;
                                        }
                                    }
                                }
                            });
                        }

                        if (Titem.ColorVisionDetails.length > 0) {
                            angular.forEach(Titem.ColorVisionDetails, function (item) {
                                item.IsInvDataAdded = false;
                                if (item.ActiveInd === 'N') {
                                    item.IsInvDataAdded = true;
                                }
                                if (item.ActiveInd === 'Y') {
                                    if (item.RightEyeRemarks != '' || item.LeftEyeRemarks != '' || item.RS3Url != '' || item.LS3Url != '' || item.Notes != '') {
                                        item.IsInvDataAdded = true;
                                    }
                                }
                            });
                        }

                        if (Titem.ConfrontationalFieldTestDetails.length > 0) {
                            angular.forEach(Titem.ConfrontationalFieldTestDetails, function (item) {
                                var List = [];
                                var List1 = [];
                                if (item.FRDrawList.length > 0) {
                                    List = $filter("filter")(item.FRDrawList, { "IsChecked": true }, true) || [];
                                }
                                if (item.FLDrawList.length > 0) {
                                    List1 = $filter("filter")(item.FLDrawList, { "IsChecked": true }, true) || [];
                                }
                                if (List.length > 0 || List1.length > 0 || item.FRightEyeRemarks !== '' || item.FLeftEyeRemarks !== '' || item.FRightEyeNotes !== '' || item.FLeftEyeNotes !== '') {
                                    item.IsfourFieldDataAdded = true;
                                } else {
                                    item.IsfourFieldDataAdded = false;
                                }
                                var List2 = [];
                                var List3 = [];
                                if (item.RDrawList.length > 0) {
                                    var List2 = $filter("filter")(item.RDrawList, { "IsChecked": true }, true) || [];
                                }
                                if (item.LDrawList.length > 0) {
                                    List3 = $filter("filter")(item.LDrawList, { "IsChecked": true }, true) || [];

                                }
                                if (List2.length > 0 || List3.length > 0 || item.RightEyeRemarks !== '' || item.LeftEyeRemarks !== '' || item.ERightEyeNotes !== '' || item.ELeftEyeNotes !== '') {
                                    item.IseightyFieldDataAdded = true;
                                } else {
                                    item.IseightyFieldDataAdded = false;
                                }

                            });
                        }

                        if (Titem.PupilSizeDetails.length > 0) {
                            angular.forEach(Titem.PupilSizeDetails, function (item) {
                                item.IsInvDataAdded = false;
                                if (item.ActiveInd === 'Y') {

                                    if (item.InvestigationId === 2133 || item.InvestigationId === 2134 || item.InvestigationId === 2135 || item.InvestigationId === 2161 ||
                                        item.InvestigationId === 2160 || item.InvestigationId === 2162) {
                                        if (item.BeforeDilationRightEye != '' || item.BeforeDilationLeftEye != '' || item.AfterDilationRightEye != '' || item.AfterDilationLeftEye != '') {
                                            item.IsInvDataAdded = true;

                                        }
                                    }
                                }
                                if (Titem.PupilSizeDetails.length > 0) {

                                    var i = 0;
                                    angular.forEach(Titem.PupilSizeDetails, function (item) {

                                        if (item.InvestigationId === 2133 || item.InvestigationId === 2134 || item.InvestigationId === 2135 || item.InvestigationId === 2161 ||
                                            item.InvestigationId === 2160 || item.InvestigationId === 2162) {
                                            if (item.AfterDilationLeftEye != "" || item.AfterDilationRightEye != "") {
                                                i++;
                                            }
                                        }
                                    });
                                    if (i > 0) {
                                        $scope.DilationObj.IsAfterDilation = true;
                                    }
                                    else {
                                        $scope.DilationObj.IsAfterDilation = false;
                                    }

                                }

                                if (Titem.PupilSizeDetails.length > 0) {

                                    var j = 0;
                                    angular.forEach(Titem.PupilSizeDetails, function (item) {
                                        if (item.InvestigationId === 2133 || item.InvestigationId === 2134 || item.InvestigationId === 2135 || item.InvestigationId === 2161 ||
                                            item.InvestigationId === 2160 || item.InvestigationId === 2162) {
                                            if (item.BeforeDilationLeftEye != "" || item.BeforeDilationRightEye != "") {
                                                j++;
                                            }
                                        }
                                    });
                                    if (j > 0) {
                                        $scope.DilationObj.IsBeforeDilation = true;
                                    }
                                    else {
                                        $scope.DilationObj.IsBeforeDilation = false;
                                    }

                                }
                            });
                        }


                        if (Titem.LabInvestigations.length > 0) {
                            angular.forEach(Titem.LabInvestigations, function (item) {
                                item.IsAllnormal = false;
                                if (item.ProcedureId == 1) {
                                    item.IsAllnormal = true;
                                }
                            });
                        }

                        $scope.ROSAllergyHeaders = angular.copy($scope.GetRemarksHeaders);
                        if (Titem.CustomAllergyRemarks.length > 0) {
                            angular.forEach($scope.ROSAllergyHeaders, function (hitem) {
                                var filetrarray = $filter("filter")(Titem.CustomAllergyRemarks, function (iterator, ind) { return iterator.CustomAllergyRemarkCategory == hitem.Name && (iterator.CustomAllergyValue == 'Y' || iterator.CustomAllergyValue == 'N'); }) || [];
                                if (filetrarray.length > 0) {
                                    hitem.Active = "Y";
                                }
                            });
                        }

                        if (Titem.AnteriorSegmentDetails.length > 0) {
                            $scope.IsAnyAnteriorRemarksIsActive = false;
                            angular.forEach(Titem.AnteriorSegmentDetails, function (item) {
                                if (item.ActiveInd == "Y") {
                                    angular.forEach(item.RemarksArray, function (inv) {
                                        if (inv.ActiveInd == "Y" || Titem.AnteriorRemarks != '') {
                                            $scope.IsAnyAnteriorRemarksIsActive = true;
                                        }
                                    });
                                    if ((item.InvestigationId == 6 && item.ActiveInd == "Y") && (item.LMRDcNS != '' || item.RMRDcNS != '' || item.RMRD2 != '' || item.LMRD2 != '' || item.RLF != '' || item.LLF != '' || item.RPFH != '' || item.LPFH != '' || item.RMRD1 != '' || item.LMRD1 != '')) {
                                        $scope.IsAnyAnteriorRemarksIsActive = true;
                                    }
                                }
                            });
                        }

                        if (Titem.PosteriorSegmentDetails.length > 0) {
                            $scope.IsAnyPosteriorRemarksIsActive = false;
                            angular.forEach(Titem.PosteriorSegmentDetails, function (item) {
                                if (item.ActiveInd == "Y" && item.InvestigationId !== 32) {
                                    angular.forEach(item.RemarksArray, function (inv) {
                                        if (inv.ActiveInd == "Y" || Titem.PosteriorRemarks != '') {
                                            $scope.IsAnyPosteriorRemarksIsActive = true;
                                        }
                                    });
                                } else if (item.ActiveInd == "Y" && item.InvestigationId == 32) {
                                    item.RHorizontal = item.RHorizontal || '';
                                    item.RVertical = item.RVertical || '';
                                    item.RDPS = item.RDPS || '';
                                    item.LHorizontal = item.LHorizontal || '';
                                    item.LVertical = item.LVertical || '';
                                    item.LDPS = item.LDPS || '';
                                    if (item.RHorizontal !== '' || item.RVertical !== '' || item.RDPS !== '' || item.LHorizontal !== '' || item.LVertical !== '' || item.LDPS !== '' || Titem.PosteriorRemarks != '') {
                                        $scope.IsAnyPosteriorRemarksIsActive = true;
                                    }
                                } else {

                                }
                            });
                        }

                        if (Titem.AssessmentPlan.length > 0) {
                            Titem.AssessmentPlan = $filter("filter")(Titem.AssessmentPlan, function (item) {
                                return item.DiagnosisStatusId1 === 2 || item.DiagnosisStatusId2 === 2;
                            });
                        }

                        if (Titem.SuperBillObj.SuperBillArray.length > 0) {
                            angular.forEach(Titem.SuperBillObj.SuperBillArray, function (item) {
                                if (item.DiagnosisArray.length > 0) {
                                    item.ShowDiagForAdd = true;
                                } else {
                                    item.ShowDiagForAdd = false;
                                }
                                if ($scope.Modifiers !== undefined) {
                                    let tempModifiers = angular.copy($scope.Modifiers) || [];
                                    angular.forEach(tempModifiers, function (kitem) {
                                        angular.forEach(item.Modifiers, function (hitem) {
                                            if (kitem.MODIFIERID == hitem.MODIFIERID) {
                                                kitem.IsChecked = true;
                                            }
                                        });
                                    });

                                    item.Modifiers = angular.copy(tempModifiers) || [];
                                    item.DeleteInd = item.DeleteInd || false;
                                }
                            });
                        }




                        Titem.VisionDetails = Titem.VisionDetails || [];
                        if (Titem.VisionDetails.length > 0) {
                            angular.forEach(Titem.VisionDetails, function (item) {
                                item.IsInvDataAdded = false;
                                item.IsvisualactivityInd = false;
                                if (item.ActiveInd === 'N') {
                                    item.IsInvDataAdded = true;

                                }
                                if (item.ActiveInd === 'Y') {
                                    if (item.InvestigationId === 4 || item.InvestigationId === 5 || item.InvestigationId === 12 || item.InvestigationId === 13 ||
                                        item.InvestigationId === 2071 || item.InvestigationId === 2073 || item.InvestigationId === 2154 || item.InvestigationId === 2076) {
                                        if (item.RightEyeValues.Distance !== "" || item.RightEyeValues.Near !== "" || item.RightEyeValues.Remarks !== "" ||
                                            item.LeftEyeValues.Distance !== "" || item.LeftEyeValues.Near !== "" || item.LeftEyeValues.Remarks !== "" ||
                                            item.BothEyeValues.Distance !== "" || item.BothEyeValues.Near !== "" || (item.BothEyeValues.Remarks !== "" && item.BothEyeValues.Remarks != undefined) ||
                                            item.Value !== "" || (item.Remarks !== "" && item.Remarks !== undefined)) {
                                            item.IsInvDataAdded = true;

                                            item.IsvisualactivityInd = true;
                                        }

                                    }
                                    if (item.InvestigationId === 2155) {
                                        if (item.RightEye !== "" || item.LeftEye !== "" || item.Remarks !== "") {
                                            item.IsInvDataAdded = true;

                                        }
                                    }
                                }

                                if (item.InvestigationId === 2071) {
                                    if (item.RightEyeValues.Distance != "" || item.LeftEyeValues.Distance != "" || item.BothEyeValues.Distance != "") {
                                        $scope.visualacuityobj.IsCCLDistance = true;
                                    }
                                    else {
                                        $scope.visualacuityobj.IsCCLDistance = false;
                                    }
                                    if (item.RightEyeValues.Near != '' || item.LeftEyeValues.Near != "" || item.BothEyeValues.Near != "") {
                                        $scope.visualacuityobj.IsCCLNear = true;
                                    }
                                    else {
                                        $scope.visualacuityobj.IsCCLNear = false;
                                    }

                                }

                                if (item.InvestigationId === 5) {
                                    if (item.RightEyeValues.Distance != "" || item.LeftEyeValues.Distance != "" || item.BothEyeValues.Distance != "") {
                                        $scope.visualacuityobj.IsCCGDistance = true;
                                    }
                                    else {
                                        $scope.visualacuityobj.IsCCGDistance = false;
                                    }
                                    if (item.RightEyeValues.Near != '' || item.LeftEyeValues.Near != "" || item.BothEyeValues.Near != "") {
                                        $scope.visualacuityobj.IsCCGNear = true;
                                    }
                                    else {
                                        $scope.visualacuityobj.IsCCGNear = false;
                                    }

                                }
                                if (item.InvestigationId === 4) {
                                    if (item.RightEyeValues.Distance != "" || item.LeftEyeValues.Distance != "" || item.BothEyeValues.Distance != "") {
                                        $scope.visualacuityobj.IsSCDistance = true;
                                    }
                                    else {
                                        $scope.visualacuityobj.IsSCDistance = false;
                                    }
                                    if (item.RightEyeValues.Near != '' || item.LeftEyeValues.Near != "" || item.BothEyeValues.Near != "") {
                                        $scope.visualacuityobj.IsSCNear = true;
                                    }
                                    else {
                                        $scope.visualacuityobj.IsSCNear = false;
                                    }
                                }

                                if (item.InvestigationId === 13) {
                                    if (item.RightEyeValues.Remarks != "" || item.LeftEyeValues.Remarks != "") {
                                        $scope.visualacuityobj.IsPinholeDistance = true;
                                    }
                                    else {
                                        $scope.visualacuityobj.IsPinholeDistance = false;
                                    }
                                }
                            });
                        }


                        if (Titem.Pachymetry.length > 0) {
                            var count1 = 0;
                            var count2 = 0;
                            var pachyODAvgValue = 0;
                            var pachyOSAvgValue = 0;
                            Titem.PachymetryAvgODValue = 0;
                            Titem.PachymetryAvgOSValue = 0;
                            angular.forEach(Titem.Pachymetry, function (pitem) {
                                if (pitem.RightEye != '') {
                                    pachyODAvgValue += parseInt(pitem.RightEye) || 0;
                                    count1++;
                                }
                                if (pitem.LeftEye!='') {
                                    pachyOSAvgValue += parseInt(pitem.LeftEye) || 0;
                                    count2++;
                                }
                            });
                            if (pachyODAvgValue != 0) {
                                Titem.PachymetryAvgODValue = parseFloat(pachyODAvgValue / count1).toFixed(2) || 0;
                            }
                            if (pachyOSAvgValue!=0) {
                                Titem.PachymetryAvgOSValue = parseFloat(pachyOSAvgValue / count2).toFixed(2) || 0;
                            }
                        }


                        if (Titem.PsychologicalObservationsArray !== undefined) {
                            if (Titem.PsychologicalObservationsArray.length !== 0) {
                                $scope.ScoreObject = angular.copy($scope.GetScoreObject());
                                angular.forEach(Titem.PsychologicalObservationsArray, function (Aitem) {
                                    if (Aitem.TypeId == 1) {
                                        if (Aitem.QuestionId == 4) {
                                            angular.forEach(Aitem.SubQuestions, function (item) {
                                                $scope.ScoreObject.PHQScore += item.Score;
                                            });
                                        }

                                        if (Aitem.QuestionId == 7) {
                                            angular.forEach(Aitem.SubQuestions, function (item) {
                                                $scope.ScoreObject.AUDITScore += item.Score;
                                            });
                                        }
                                    }
                                    if (Aitem.TypeId == 2) {
                                        $scope.ScoreObject.NHANESscore += Aitem.Score;
                                    }
                                    if (Aitem.TypeId == 3) {
                                        $scope.ScoreObject.HARKscore += Aitem.Score;
                                    }
                                });

                                Titem.PsychologicalObservationsArray = angular.copy(Titem.PsychologicalObservationsArray);
                            } else {
                                $scope.ScoreObject = angular.copy($scope.GetScoreObject());
                            }
                        }



                    });
                }

                $scope.SelectedPlanArray = $filter("filter")($scope.treatmentData, { "AppointmentId": AppointmentID }, true);




            }
        }, function (err) {
            alertify.error(err.data.ExceptionMessage);
        });
    };
    /*$scope.GetPatientAppointmenthistroy(0, $scope.SelectedAppointmentId, $scope.SelectedVisitId);*/
    $scope.uibclose = function () {
        $uibModalInstance.dismiss("cancel");
    };
    var vistSummaryGridObj = {
        "IsChiefcomplantsArray": true,
        "IsROSArray": true,
        "IsVisionAndPerceptionArray": true,
        "IsExaminactionArray": true,
        "IsAssesmentPlanArray": true,
        "IsSubRefraction": false,
        "IsSubColorVision": false,
        "IsSubMotorExamination": false,
        "IsSubSquintEvaluationArr": false,
        "IsSubBinocularVisionArr": false,

        "IsOrdersArray": true,
        "IsMedicalRxArray": true,
        "IsProceduresArray": true,
    }
    var chartSelectAllObject = {
        IsROSAllChecked: false,
        IsVnPAllChecked: false,
        IsExaminationAllChecked: false,
        IsAssessmentAllChecked: false
    }
    $scope.PastVisitSummaryGrid = angular.copy(resolveObj.PastVisitSummaryGrid || vistSummaryGridObj);
    $scope.ChartSelectALLobj = angular.copy(resolveObj.chartSelectAllObj || chartSelectAllObject);
    $scope.GetCategoryList = function () {
        return {
            "IsAllCheck": false,
            "ChiefcomplantsArray": [
                {
                    "Name": "Chief Complaints",
                    "IsCheck": false
                }
            ],
            "ROSArray": [
                {
                    "Name": "Allergies",
                    "IsCheck": false
                },
                {
                    "Name": "Ocular History",
                    "IsCheck": false
                },
                {
                    "Name": "Ocular Surgical History",
                    "IsCheck": false
                },
                {
                    "Name": "Current Eye Medication",
                    "IsCheck": false
                },
                {
                    "Name": "Systemic History",
                    "IsCheck": false
                },
                {
                    "Name": "Surgical History",
                    "IsCheck": false
                },
                {
                    "Name": "Current Systemic Medications",
                    "IsCheck": false
                },
                {
                    "Name": "Family History",
                    "IsCheck": false
                },
                {
                    "Name": "FunctionalStatus History",
                    "IsCheck": false
                },
                {
                    "Name": "Life Style History",
                    "IsCheck": false
                },
                {
                    "Name": "Vaccination History",
                    "IsCheck": false
                },
                {
                    "Name": "Birth History",
                    "IsCheck": false
                },
                {
                    "Name": "Nutritional History",
                    "IsCheck": false
                },
                {
                    "Name": "Menstrual History",
                    "IsCheck": false
                },
                {
                    "Name": "Psychiatry",
                    "IsCheck": false
                },
                {
                    "Name": "Lab & Investigation",
                    "IsCheck": false
                },
                {
                    "Name": "Implants",
                    "IsCheck": false
                },
                {
                    "Name": "PsychologicalObservations",
                    "IsCheck": false
                },
                {
                    "Name": "Health Concerns & Goals",
                    "IsCheck": false
                },
                {
                    "Name": "Vitals",
                    "IsCheck": false
                }
            ],
            "VisionAndPerceptionArray": [
                {
                    "Name": "Visuial Activity",
                    //"Name": "Vision",
                    "IsCheck": false
                },
                {
                    "Name": "Refraction",
                    "IsCheck": false,
                    "RefractionArr": [
                        {
                            "Name": "Auto Refraction",
                            "IsCheck": false
                        },
                        {
                            "Name": "Retinoscopy",
                            "IsCheck": false
                        },
                        {
                            "Name": "Present Glass Rx",
                            "IsCheck": false
                        },
                        {
                            "Name": "Manifest Refraction",
                            "IsCheck": false
                        },
                        {
                            "Name": "Cycloplegic Refraction",
                            "IsCheck": false
                        },
                        {
                            "Name": " Over Refraction",
                            "IsCheck": false
                        },
                        {
                            "Name": "Final Glass Rx",
                            "IsCheck": false
                        } 
                        //{
                        //    "Name": "TonoMetry",
                        //    "IsCheck": false
                        //}
                    ]
                },
                {
                    "Name": "Keratometry",
                    "IsCheck": false
                },
                {
                    "Name": "IOP",
                    "IsCheck": false
                },
                {
                    "Name": "Pupil size",
                    "IsCheck": false
                },
                {
                    "Name": "Pachymetry",
                    "IsCheck": false
                },
                {
                    "Name": "PAM",
                    "IsCheck": false
                },
                {
                    "Name": "Glare",
                    "IsCheck": false
                },
                {
                    "Name": "Contact Lens",
                    "IsCheck": false
                }
            ],
            "ExaminactionArray": [
                {
                    "Name": "Anterior Segment",
                    "IsCheck": false
                },
                {
                    "Name": "Posterior Segments",
                    "IsCheck": false
                },
                {
                    "Name": "External Examination",
                    "IsCheck": false
                },
                {
                    "Name": "Amsler Grid",
                    "IsCheck": false
                },
                {
                    "Name": "Color Vision",
                    "IsCheck": false,
                    "ColorVisionArr": [
                        {
                            "Name": "Ishihara",
                            "IsCheck": false
                        },
                        {
                            "Name": "HRR",
                            "IsCheck": false
                        },
                        {
                            "Name": "Fransworth D15",
                            "IsCheck": false
                        },
                        {
                            "Name": "Fransworth D100",
                            "IsCheck": false
                        }
                    ]
                },
                {
                    "Name": "Gonioscopy",
                    "IsCheck": false
                },
                {
                    "Name": "Dry Eye Evaluation",
                    "IsCheck": false
                },
                {
                    "Name": "Hertel's Examination",
                    "IsCheck": false
                },
                {
                    "Name": "Lacrimal Patency",
                    "IsCheck": false
                },
                {
                    "Name": "Motor examination",
                    "IsCheck": false,
                    "MotorExaminationArr": [
                        {
                            "Name": "Squint Evaluation",
                            "IsCheck": false,
                            "SquintEvaluationArr": [
                                {
                                    "Name": "HCRT",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Cover/Alternate Cover test",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Cover/Alternate Prism Cover test",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Head Posture",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Nystagmus",
                                    "IsCheck": false
                                },
                            ]
                        },
                        {
                            "Name": "Binocular Vision Test",
                            "IsCheck": false,
                            "BinocularVisionArr": [
                                {
                                    "Name": "Worth Four Dot Test",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Stereopsis",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Near Point Convergence",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Neat Point Accommodation",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Fusional Vergence",
                                    "IsCheck": false
                                },
                                {
                                    "Name": "Relative Accommodation",
                                    "IsCheck": false
                                }
                            ]
                        }
                    ]
                }
            ],
            "AssesmentPlanArray": [
                {
                    "Name": "Diagnosis",
                    "IsCheck": false
                },
                {
                    "Name": "Plan Of Discussions",
                    "IsCheck": false
                },
                //{
                //    "Name": "Order's",
                //    "IsCheck": true
                //},
                //{
                //    "Name": "Referral",
                //    "IsCheck": false
                //},
                {
                    "Name": "Instructions",
                    "IsCheck": false
                }
            ],
            "Orders": [
                {
                    "Name": "Orders",
                    "IsCheck": false
                }
            ],
            "MedicalRx": [
                {
                    "Name": "Medical Rx",
                    "IsCheck": false
                }
            ],
            "Procedures": [
                {
                    "Name": "Procedures",
                    "IsCheck": false
                }
            ],
            "SuperBill": [
                {
                    "Name": "SuperBill",
                    "IsCheck": false
                }
            ],
            "ReturnToOffice": [
                {
                    "Name": "Return To Office",
                    "IsCheck": false
                }
            ],
            "staff": [
                {
                    "Name": "staff",
                    "IsCheck": false
                }
            ],
            "ConsultationNotes": [
                {
                    "Name": "ConsultationNotes",
                    "IsCheck": false
                }
            ],
            "PatientNotes": [
                {
                    "Name": "PatientNotes",
                    "IsCheck": false
                }
            ]
        }
    };
    $scope.GetCategoryListObj = resolveObj.categoryListObj || $scope.GetCategoryList();
    // $scope.GetCategoryListObj = $scope.GetCategoryList();                        
    $scope.ChangeAllCheckitem = function (type) {
        if (type === 'All') {
            var categoryObj = $scope.GetCategoryListObj;
            var checkValue = categoryObj.IsAllCheck;

            function setAllChecks(obj, value) {
                if (Array.isArray(obj)) {
                    obj.forEach(function (item) {
                        if (item.hasOwnProperty("IsCheck")) {
                            item.IsCheck = value;
                        }
                        for (var key in item) {
                            if (Array.isArray(item[key])) {
                                setAllChecks(item[key], value);
                            }
                        }
                    });
                } else if (typeof obj === 'object' && obj !== null) {
                    for (var prop in obj) {
                        if (Array.isArray(obj[prop])) {
                            setAllChecks(obj[prop], value);
                        }
                    }
                }
            }
            setAllChecks(categoryObj, checkValue);
            $scope.ChartSelectALLobj.IsAssessmentAllChecked = checkValue;
            $scope.ChartSelectALLobj.IsExaminationAllChecked = checkValue;
            $scope.ChartSelectALLobj.IsVnPAllChecked = checkValue;
            $scope.ChartSelectALLobj.IsROSAllChecked = checkValue;
            $scope.PastVisitSummaryGrid.IsSubRefraction = checkValue;
            $scope.PastVisitSummaryGrid.IsSubColorVision = checkValue;
            $scope.PastVisitSummaryGrid.IsSubMotorExamination = checkValue;
            $scope.PastVisitSummaryGrid.IsSubSquintEvaluationArr = checkValue;
            $scope.PastVisitSummaryGrid.IsSubBinocularVisionArr = checkValue;
            let index = $scope.TempIsCheckArray.findIndex(obj => obj === categoryObj);
            if (checkValue && index === -1) {
                $scope.TempIsCheckArray.push(categoryObj);
            } else if (!checkValue && index !== -1) {
                $scope.TempIsCheckArray.splice(index, 1);
            }

            return categoryObj;
        }
        if (type == 'ros') {
            /*$scope.ChartSelectALLobj.IsROSAllChecked = !$scope.ChartSelectALLobj.IsROSAllChecked || false;*/
            angular.forEach($scope.GetCategoryListObj.ROSArray, function (rositem) {
                /*if ($scope.ChartSelectALLobj.IsROSAllChecked) {*/
                rositem.IsCheck = $scope.ChartSelectALLobj.IsROSAllChecked || false;
                //} else {
                //    rositem.IsCheck =  false;
                //}
                /*}*/
            });
        }

        if (type == 'VnP') {
            /* $scope.ChartSelectALLobj.IsVnPAllChecked = !$scope.ChartSelectALLobj.IsVnPAllChecked || false;*/
            angular.forEach($scope.GetCategoryListObj.VisionAndPerceptionArray, function (rositem) {
                if ($scope.ChartSelectALLobj.IsVnPAllChecked) {
                    rositem.IsCheck = true;
                    rositem.RefractionArr = rositem.RefractionArr || [];
                    if (rositem.RefractionArr.length > 0) {
                        angular.forEach(rositem.RefractionArr, function (refrac) {
                            refrac.IsCheck = true;
                        });
                        $scope.PastVisitSummaryGrid.IsSubRefraction = true;
                    }

                } else {
                    rositem.IsCheck = false;
                    rositem.RefractionArr = rositem.RefractionArr || [];
                    if (rositem.RefractionArr.length > 0) {
                        angular.forEach(rositem.RefractionArr, function (refrac) {
                            refrac.IsCheck = false;
                        });
                        $scope.PastVisitSummaryGrid.IsSubRefraction = false;
                    }
                }
            });
        }
        if (type == 'Examination') {
            /*$scope.ChartSelectALLobj.IsExaminationAllChecked = !$scope.ChartSelectALLobj.IsExaminationAllChecked || false;*/
            angular.forEach($scope.GetCategoryListObj.ExaminactionArray, function (rositem) {
                if ($scope.ChartSelectALLobj.IsExaminationAllChecked) {
                    rositem.IsCheck = true;

                    rositem.ColorVisionArr = rositem.ColorVisionArr || [];
                    if (rositem.ColorVisionArr.length > 0) {
                        angular.forEach(rositem.ColorVisionArr, function (clritem) {
                            clritem.IsCheck = true;
                        });
                        $scope.PastVisitSummaryGrid.IsSubColorVision = true;
                    }
                    rositem.MotorExaminationArr = rositem.MotorExaminationArr || [];
                    if (rositem.MotorExaminationArr.length > 0) {
                        angular.forEach(rositem.MotorExaminationArr, function (clritem) {
                            clritem.IsCheck = true;
                        });
                        $scope.PastVisitSummaryGrid.IsSubMotorExamination = true;
                    }
                    rositem.SquintEvaluationArr = rositem.SquintEvaluationArr || [];
                    if (rositem.SquintEvaluationArr.length > 0) {
                        angular.forEach(rositem.SquintEvaluationArr, function (clritem) {
                            clritem.IsCheck = true;
                        });
                        $scope.PastVisitSummaryGrid.IsSubSquintEvaluationArr = true;
                    }
                    rositem.BinocularVisionArr = rositem.BinocularVisionArr || [];
                    if (rositem.BinocularVisionArr.length > 0) {
                        angular.forEach(rositem.BinocularVisionArr, function (clritem) {
                            clritem.IsCheck = true;
                        });
                        $scope.PastVisitSummaryGrid.IsSubBinocularVisionArr = true;
                    }
                } else {
                    rositem.IsCheck = false;
                    rositem.ColorVisionArr = rositem.ColorVisionArr || [];
                    if (rositem.ColorVisionArr.length > 0) {
                        angular.forEach(rositem.ColorVisionArr, function (clritem) {
                            clritem.IsCheck = false;
                        });
                        $scope.PastVisitSummaryGrid.IsSubColorVision = false;
                    }
                    rositem.MotorExaminationArr = rositem.MotorExaminationArr || [];
                    if (rositem.MotorExaminationArr.length > 0) {
                        angular.forEach(rositem.MotorExaminationArr, function (clritem) {
                            clritem.IsCheck = false;
                        });
                        $scope.PastVisitSummaryGrid.IsSubMotorExamination = false;
                    }
                    rositem.SquintEvaluationArr = rositem.SquintEvaluationArr || [];
                    if (rositem.SquintEvaluationArr.length > 0) {
                        angular.forEach(rositem.SquintEvaluationArr, function (clritem) {
                            clritem.IsCheck = false;
                        });
                        $scope.PastVisitSummaryGrid.IsSubSquintEvaluationArr = false;
                    }
                    rositem.BinocularVisionArr = rositem.BinocularVisionArr || [];
                    if (rositem.BinocularVisionArr.length > 0) {
                        angular.forEach(rositem.BinocularVisionArr, function (clritem) {
                            clritem.IsCheck = false;
                        });
                        $scope.PastVisitSummaryGrid.IsSubBinocularVisionArr = false;
                    }
                }
            });
        }
        if (type == 'Assessment') {
            /*  $scope.ChartSelectALLobj.IsAssessmentAllChecked = !$scope.ChartSelectALLobj.IsAssessmentAllChecked || false;*/
            angular.forEach($scope.GetCategoryListObj.AssesmentPlanArray, function (rositem) {
                /*if ($scope.ChartSelectALLobj.IsAssessmentAllChecked) {*/
                rositem.IsCheck = $scope.ChartSelectALLobj.IsAssessmentAllChecked;
                //} else {
                //    rositem.IsCheck =  false;
                //}
            });
        }
        $scope.TempIsCheckArray = [];
        $scope.TempIsCheckArray = $filter("filter")($scope.GetCategoryListObj.ChiefcomplantsArray, function (iterator, ind) { return iterator.IsCheck === true; }) || [];

        $scope.TempIsCheckROSArray = $filter("filter")($scope.GetCategoryListObj.ROSArray, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempIsCheckROSArray.length > 0) {
            angular.forEach($scope.TempIsCheckROSArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempIsCheckVandPArray = $filter("filter")($scope.GetCategoryListObj.VisionAndPerceptionArray, function (iterator, ind) { return iterator.IsCheck === true && iterator.Name !== "Refraction" }) || [];
        if ($scope.TempIsCheckVandPArray.length > 0) {
            angular.forEach($scope.TempIsCheckVandPArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempIsCheckRefractionArray = $filter("filter")($scope.GetCategoryListObj.VisionAndPerceptionArray[1].RefractionArr, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempIsCheckRefractionArray.length > 0) {
            angular.forEach($scope.TempIsCheckRefractionArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempIsCheckExaminactionArray = $filter("filter")($scope.GetCategoryListObj.ExaminactionArray, function (iterator, ind) { return iterator.IsCheck === true && iterator.Name !== "Color Vision" && iterator.Name !== "Motor examination" }) || [];
        if ($scope.TempIsCheckExaminactionArray.length > 0) {
            angular.forEach($scope.TempIsCheckExaminactionArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempIsCheckColorVisionArr = $filter("filter")($scope.GetCategoryListObj.ExaminactionArray[4].ColorVisionArr, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempIsCheckColorVisionArr.length > 0) {
            angular.forEach($scope.TempIsCheckColorVisionArr, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempIsCheckSquintEvaluationArr = $filter("filter")($scope.GetCategoryListObj.ExaminactionArray[9].MotorExaminationArr[0].SquintEvaluationArr, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempIsCheckSquintEvaluationArr.length > 0) {
            angular.forEach($scope.TempIsCheckSquintEvaluationArr, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempIsCheckBinocularVisionArr = $filter("filter")($scope.GetCategoryListObj.ExaminactionArray[9].MotorExaminationArr[1].BinocularVisionArr, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempIsCheckBinocularVisionArr.length > 0) {
            angular.forEach($scope.TempIsCheckBinocularVisionArr, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempIsCheckAssesmentPlanArray = $filter("filter")($scope.GetCategoryListObj.AssesmentPlanArray, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempIsCheckAssesmentPlanArray.length > 0) {
            angular.forEach($scope.TempIsCheckAssesmentPlanArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }

        $scope.TempOrderIsCheckArray = $filter("filter")($scope.GetCategoryListObj.Orders, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempOrderIsCheckArray.length > 0) {
            angular.forEach($scope.TempOrderIsCheckArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }

        $scope.TempMedicalRxIsCheckArray = $filter("filter")($scope.GetCategoryListObj.MedicalRx, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempMedicalRxIsCheckArray.length > 0) {
            angular.forEach($scope.TempMedicalRxIsCheckArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }

        $scope.TempProceduresIsCheckArray = $filter("filter")($scope.GetCategoryListObj.Procedures, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempProceduresIsCheckArray.length > 0) {
            angular.forEach($scope.TempProceduresIsCheckArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }

    }
    $scope.ChangeCheckitem = function (item, array, ind) {

        if (item.Name === "Chief Complaints" && item.IsCheck) {
            $scope.TempIsCheckArray = $filter("filter")($scope.GetCategoryListObj.ChiefcomplantsArray, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        }
        $scope.TempIsCheckROSArray = $filter("filter")($scope.GetCategoryListObj.ROSArray, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempIsCheckROSArray.length > 0) {
            angular.forEach($scope.TempIsCheckROSArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempIsCheckVandPArray = $filter("filter")($scope.GetCategoryListObj.VisionAndPerceptionArray, function (iterator, ind) { return iterator.IsCheck === true && iterator.Name !== "Refraction" }) || [];
        if ($scope.TempIsCheckVandPArray.length > 0) {
            angular.forEach($scope.TempIsCheckVandPArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }

        $scope.TempIsCheckExaminactionArray = $scope.GetCategoryListObj.ExaminactionArray.filter(item => item.IsCheck === true);
        if ($scope.TempIsCheckExaminactionArray.length > 0) {
            angular.forEach($scope.TempIsCheckExaminactionArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        /* $scope.TempIsCheckExaminactionArray = $filter("filter")($scope.GetCategoryListObj.ExaminactionArray, function (iterator, ind) { return iterator.IsCheck === true && iterator.Name !== "Color Vision" && iterator.Name !== "Motor examination" }) || [];
         if ($scope.TempIsCheckExaminactionArray.length > 0) {
             angular.forEach($scope.TempIsCheckExaminactionArray, function (item) {
                 $scope.TempIsCheckArray.push(item);
             });
         }*/
        $scope.TempIsCheckColorVisionArr = $filter("filter")($scope.GetCategoryListObj.ExaminactionArray[4].ColorVisionArr, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempIsCheckColorVisionArr.length > 0) {
            angular.forEach($scope.TempIsCheckColorVisionArr, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempIsCheckAssesmentPlanArray = $filter("filter")($scope.GetCategoryListObj.AssesmentPlanArray, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempIsCheckAssesmentPlanArray.length > 0) {
            angular.forEach($scope.TempIsCheckAssesmentPlanArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }

        $scope.TempOrderIsCheckArray = $filter("filter")($scope.GetCategoryListObj.Orders, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempOrderIsCheckArray.length > 0) {
            angular.forEach($scope.TempOrderIsCheckArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }

        $scope.TempMedicalRxIsCheckArray = $filter("filter")($scope.GetCategoryListObj.MedicalRx, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempMedicalRxIsCheckArray.length > 0) {
            angular.forEach($scope.TempMedicalRxIsCheckArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }

        $scope.TempProceduresIsCheckArray = $filter("filter")($scope.GetCategoryListObj.Procedures, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempProceduresIsCheckArray.length > 0) {
            angular.forEach($scope.TempProceduresIsCheckArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempSuperbillIsCheckArray = $filter("filter")($scope.GetCategoryListObj.SuperBill, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempSuperbillIsCheckArray.length > 0) {
            angular.forEach($scope.TempSuperbillIsCheckArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        $scope.TempReturnToOfficeCheckArray = $filter("filter")($scope.GetCategoryListObj.ReturnToOffice, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
        if ($scope.TempReturnToOfficeCheckArray.length > 0) {
            angular.forEach($scope.TempReturnToOfficeCheckArray, function (item) {
                $scope.TempIsCheckArray.push(item);
            });
        }
        //if ($scope.TempIsCheckArray.length > 7) {
        //    array[ind].IsCheck = false;
        //    alertify.error("Only 7 Summery History's Is Checked....!");
        //    return false;
        //}

        if (item.Name == "Refraction" && item.IsCheck) {
            $scope.PastVisitSummaryGrid.IsSubRefraction = true;
            $scope.GetCategoryListObj.VisionAndPerceptionArray[1].RefractionArr.forEach(inItem => {
                inItem.IsCheck = true;
            })
            $scope.TempIsCheckRefractionArray = $filter("filter")($scope.GetCategoryListObj.VisionAndPerceptionArray[1].RefractionArr, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
            if ($scope.TempIsCheckRefractionArray.length > 0) {
                angular.forEach($scope.TempIsCheckRefractionArray, function (item) {
                    $scope.TempIsCheckArray.push(item);
                });
            }
        } else if (item.Name == "Refraction") {
            $scope.PastVisitSummaryGrid.IsSubRefraction = false;
        } else if (item.Name == "Color Vision" && item.IsCheck) {
            $scope.PastVisitSummaryGrid.IsSubColorVision = true;
            $scope.GetCategoryListObj.ExaminactionArray[4].ColorVisionArr.forEach(inItem => {
                inItem.IsCheck = true;
            })

        } else if (item.Name == "Color Vision") {
            $scope.PastVisitSummaryGrid.IsSubColorVision = false;
        } else if (item.Name == "Motor examination" && item.IsCheck) {
            $scope.PastVisitSummaryGrid.IsSubMotorExamination = true;
            let motorExamObj = $scope.GetCategoryListObj.ExaminactionArray?.[9];
            if (motorExamObj && Array.isArray(motorExamObj.MotorExaminationArr)) {
                motorExamObj.MotorExaminationArr.forEach(subExam => {
                    subExam.IsCheck = true;
                    if (Array.isArray(subExam.SquintEvaluationArr)) {
                        subExam.SquintEvaluationArr.forEach(item => item.IsCheck = true);
                    }
                    if (Array.isArray(subExam.BinocularVisionArr)) {
                        subExam.BinocularVisionArr.forEach(item => item.IsCheck = true);
                    }
                });
                motorExamObj.MotorExaminationArr.forEach(inItem => {
                    if (inItem.IsCheck) {
                        $scope.TempIsCheckArray.push(inItem);
                    }
                })
            }
            $scope.TempIsCheckSquintEvaluationArr = $filter("filter")($scope.GetCategoryListObj.ExaminactionArray[9].MotorExaminationArr[0].SquintEvaluationArr, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
            if ($scope.TempIsCheckSquintEvaluationArr.length > 0) {
                angular.forEach($scope.TempIsCheckSquintEvaluationArr, function (item) {
                    $scope.TempIsCheckArray.push(item);
                });
            }
            $scope.TempIsCheckBinocularVisionArr = $filter("filter")($scope.GetCategoryListObj.ExaminactionArray[9].MotorExaminationArr[1].BinocularVisionArr, function (iterator, ind) { return iterator.IsCheck === true; }) || [];
            if ($scope.TempIsCheckBinocularVisionArr.length > 0) {
                angular.forEach($scope.TempIsCheckBinocularVisionArr, function (item) {
                    $scope.TempIsCheckArray.push(item);
                });
            }
        } else if (item.Name == "Motor examination") {
            $scope.PastVisitSummaryGrid.IsSubMotorExamination = false;
        } else if (item.Name == "Squint Evaluation" && item.IsCheck) {
            $scope.PastVisitSummaryGrid.IsSubSquintEvaluationArr = true;
        } else if (item.Name == "Squint Evaluation") {
            $scope.PastVisitSummaryGrid.IsSubSquintEvaluationArr = false;
        } else if (item.Name == "Binocular Vision Test" && item.IsCheck) {
            $scope.PastVisitSummaryGrid.IsSubBinocularVisionArr = true;
        } else if (item.Name == "Binocular Vision Test") {
            $scope.PastVisitSummaryGrid.IsSubBinocularVisionArr = false;
        }
        function isAllSelected(categoryObj) {
            let allSelected = true;
            function checkArrayItems(arr) {
                arr.forEach(function (item) {
                    if (item.hasOwnProperty("IsCheck") && !item.IsCheck) {
                        allSelected = false;
                    }
                    for (let key in item) {
                        if (Array.isArray(item[key])) {
                            checkArrayItems(item[key]);
                        }
                    }
                });
            }
            checkArrayItems(categoryObj.ChiefcomplantsArray);
            checkArrayItems(categoryObj.ROSArray);
            checkArrayItems(categoryObj.VisionAndPerceptionArray);
            checkArrayItems(categoryObj.ExaminactionArray);
            checkArrayItems(categoryObj.AssesmentPlanArray);
            checkArrayItems(categoryObj.Orders);
            checkArrayItems(categoryObj.MedicalRx);
            checkArrayItems(categoryObj.Procedures);
            return allSelected;
        }
        $scope.GetCategoryListObj.IsAllCheck = isAllSelected($scope.GetCategoryListObj);
    };
    $scope.HideShowChiefComplaints = function () {
        $scope.PastVisitSummaryGrid.IsChiefcomplantsArray = !$scope.PastVisitSummaryGrid.IsChiefcomplantsArray;
    };
    $scope.HideShoworderscheck = function () {
        $scope.PastVisitSummaryGrid.IsOrdersArray = !$scope.PastVisitSummaryGrid.IsOrdersArray;
    };
    $scope.HideShowMedcheck = function () {
        $scope.PastVisitSummaryGrid.IsMedicalRxArray = !$scope.PastVisitSummaryGrid.IsMedicalRxArray;
    };
    $scope.HideShowprocedurescheck = function () {
        $scope.PastVisitSummaryGrid.IsProceduresArray = !$scope.PastVisitSummaryGrid.IsProceduresArray;
    };
    $scope.HideShowROSDetails = function () {
        $scope.PastVisitSummaryGrid.IsROSArray = !$scope.PastVisitSummaryGrid.IsROSArray;
    };
    $scope.HideShowVisionAndPerceptionDetails = function () {
        $scope.PastVisitSummaryGrid.IsVisionAndPerceptionArray = !$scope.PastVisitSummaryGrid.IsVisionAndPerceptionArray;
    };
    $scope.HideShowExaminationsDetails = function () {
        $scope.PastVisitSummaryGrid.IsExaminactionArray = !$scope.PastVisitSummaryGrid.IsExaminactionArray;
    };
    $scope.HideShowAssesmentPlanDetails = function () {
        $scope.PastVisitSummaryGrid.IsAssesmentPlanArray = !$scope.PastVisitSummaryGrid.IsAssesmentPlanArray;
    };
    $scope.AllAscPrintServices = function (item) {
        item = item || {};
        var params = {
            "AppointmentId": item.AppointmentId,
            "RequestType": "ASC"
        }

        let obj = {
            "ParentOrganizationId": $scope.ParentHospitalId,
        }

        //let reqObj1 = {
        //    "ParentOrganizationId": $scope.ParentHospitalId
        //};

        let request = {
            "ParentOrganizationId": $scope.ParentHospitalId,
            "CheckListModuleId": 1
        };
        let request1 = {
            "ParentOrganizationId": $scope.ParentHospitalId,
            "CheckListModuleId": 2
        };
        let request2 = {
            "ParentOrganizationId": $scope.ParentHospitalId,
            "CheckListModuleId": 3
        };

        $q.all([
            eHnoteSurgeryService.GetOrganizationASCCheckListData(request),
            InventoryService.GetInventoryMasterIOLData(obj),
            eHnoteSurgeryService.GetOrganizationPreOpMedications($scope.ParentHospitalId),
            eHnotePatientDataService.getPatientASCDrawingPadImages(params),
            eHnoteSurgeryService.GetMasterAldreteScoreDetails(),
            eHnoteSurgeryService.GetOrganizationASCCheckListData(request1),
            eHnoteSurgeryService.GetOrganizationASCCheckListData(request2),
        ]).then(function (resp) {

            if (resp[0].data.status === "Success") {
                $scope.IVSiteMarkingList = resp[0].data.IVSiteMarkingList || [];


                if (!$scope.ParentObj.IsIOJParentOrganization) {
                    $scope.AscPreopObj.IVBlockedArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 7 }, true) || [];
                } else {
                    $scope.AscPreopObj.IVBlockedArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 2 }, true) || [];
                };

                if ($scope.AscPreopObj.IVBlockedArray.length > 0) {
                    angular.forEach($scope.AscPreopObj.IVBlockedArray, function (item) {
                        item.IsSelected = false;
                        item.DeleteInd = 'N';
                    })
                }
                //$scope.PreOpQuickSummaryObj.IVBlockedArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 2 }, true);
                if (!$scope.ParentObj.IsIOJParentOrganization) {
                    $scope.AscPreopObj.IVSiteFluidsArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 6 }, true);
                    $scope.AscPreopObj.IVSiteFlushArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 4 }, true);
                    $scope.AscPreopObj.IVSiteLRArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 5 }, true);
                };


                $scope.AllOrgASCChecklist = resp[0].data.rows;
                if (resp[0].data.status === "Success") {
                    angular.forEach(resp[0].data.rows, function (item) {
                        angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                            kitem.IsChecked = false;
                        });
                    });

                    // patient goals

                    resp[0].data.goalsList = resp[0].data.goalsList || [];
                    if (resp[0].data.goalsList.length > 0) {
                        $scope.MasterAscPatientGoal = angular.copy(resp[0].data.goalsList) || [];
                    }

                    if ($scope.MasterAscPatientGoal.length > 0) {
                        angular.forEach($scope.MasterAscPatientGoal, function (Gitem) {
                            Gitem.Value = "";
                            Gitem.DeleteInd = "N";
                        });
                    }

                }
            }

            if (resp[1].data != undefined) {

                $scope.TypesofLens = resp[1].data.TypesofLens || [];
                $scope.Manufacturers = resp[1].data.Manufacturers || [];
                $scope.DiopterArray = resp[1].data.DiopterArray || [];
                $scope.IOLStatusArray = resp[1].data.IOLStatusArray || [];
                $scope.HospitalModels = resp[1].data.HospitalModels || [];
            }

            if (resp[2].data.status === "Success") {
                angular.forEach(resp[2].data.rows, function (item) {
                    item.AscMedicationId = 0;
                    item.IsChecked = false;
                    item.DropTimings = [{ "MedicationTime": "" }, { "MedicationTime": "" }];
                });

                let temppostopMedications = $filter('filter')(resp[2].data.rows, { 'IsPostOpMed': true }, true);
                $scope.AscPostOp.PostOpMedications = angular.copy(temppostopMedications);
            }

            if (resp[3].data.Status === "Success") {
                console.log(resp[3]);
                $scope.patientAscDrawingfiles = [];
                if (resp[3].data.rows.length > 0) {
                    $scope.patientAscDrawingfiles = resp[3].data.rows;
                    $scope.DrawingPadImgs();
                }
            }

            if (resp[4].data.status === "Success") {
                angular.forEach(resp[4].data.rows, function (item) {
                    item.Value = null;
                    item.IsChecked = false;
                    angular.forEach(item.AldreteScoreDetailTypes, function (kitem) {
                        kitem.IsChecked = false;
                    });
                });
                $scope.AscPreopObj.AlderetScoreDetails = angular.copy(resp[4].data.rows);
            }

            // new format for checklists in intra-op
            if (resp[5].data.rows.length > 0) {
                if (resp[5].data.status === "Success") {
                    $scope.AllIntraOpChecklistsArray = [];

                    angular.forEach(resp[5].data.rows, function (item) {
                        item.IsChecked = false;
                        if (item.SubCheckList.length > 0) {
                            angular.forEach(item.SubCheckList, function (kitem) {
                                kitem.IsChecked = false;
                            });
                        }
                    });

                    let tempIntraopChecklistsArray = $filter('filter')(resp[5].data.rows, { 'CheckListModuleId': 2 }, true) || [];
                    if (tempIntraopChecklistsArray.length > 0) {
                        $scope.AllIntraOpChecklistsArray = angular.copy(tempIntraopChecklistsArray);
                    }

                }
            }

            if (resp[6].data.status === "Success") {
                $scope.AscPostOp.OrgASCChecklist = angular.copy(resp[6].data.rows);
                angular.forEach($scope.AscPostOp.OrgASCChecklist, function (item) {
                    item.IsChecked = false;
                });
            }
        });
    }




    // Overall Consultation Print
    //print by module code 
    $scope.GetModuleNamesInd = function () {
        return {
            "IsAllEmrModuleCheckInd": false,
            "IsChiefComplaintsInd": false,
            "IsReviewOfSystemInd": false,
            "IsAllergiesInd": false,
            "IsOcularHistoryInd": false,
            "IsOcularSurgicalHistoryInd": false,
            "IsCurrentEyeMedicationsInd": false,
            "IsSystemicHistoryInd": false,
            "IsSurgicalHistoryInd": false,
            "IsCurrentSystemicMedicationsInd": false,
            "IsFamilyHistoryInd": false,
            "IsFunctionalHistoryInd": false,
            "IsLifeStyleHistoryInd": false,
            "IsVaccinationHistoryInd": false,
            "IsBirthHistoryInd": false,
            "IsNutritionalHistoryInd": false,
            "IsMenstrualHistoryInd": false,
            "IsPhysicalEvaluationInd": false,
            "IsPsychiatryInd": false,
            "IsHealthConcernsAndGoalsInd": false,
            "IsLabInvestigationsInd": false,
            "IsImplantsInd": false,
            "IsPsychologicalObservationsInd": false,
            "IsVitalsInd": false,
            "IsFallRiskInd": false,
            "IsVisionAndPerceptionInd": false,
            "IsVisualAcuityInd": false,
            "IsAutoRefractionInd": false,
            "IsRetinoscopyInd": false,
            "IsPresentGlassRxInd": false,
            "IsManifestRefractionInd": false,
            "IsCyclopegicRefractionInd": false,
            "IsOverRefractionInd": false,
            "IsFinalGlassRxInd": false,
            "IsKeratometryInd": false,
            "IsIOPandPachyInd": false,
            "IsPupilSizeInd": false,
            "IsPAMInd": false,
            "IsGlareInd": false,
            "IsContactLensInd": false,
            "IsExaminationsInd": false,
            "IsAnteriorSegmentInd": false,
            "IsPosteriorSegmentInd": false,
            "IsDryEyeEvaluationInd": false,
            "IsAmslerGridInd": false,
            "IsConfrontationalFieldTestInd": false,
            "IsGonioscopyInd": false,
            "IsHertelsExaminationInd": false,
            "IsColorVisionTestInd": false,
            "IsLacrimalPatencyInd": false,
            "IsMotorExaminationInd": false,
            "IsAssessmentPlansInd": false,
            "IsOrdersInd": false,
            "IsMedicalRxInd": false,
            "IsGlassRxInd": false,
            "IsProceduresInd": false,
            "IsSuperBillInd": false,
            "IsReturnToOfficeInd": false,
            "IsStaffInd": false,
            "IsConsultationNoteInd": false,
            "IsRgblensInd": false,
            "IssoftContactlensInd": false,           
            "IsReturnToOfficeInd": false
        }
    }
    $scope.ModuleNamesInd = $scope.GetModuleNamesInd();
    $scope.ModuleNamesArray = [
        {
            "CategoryId": 1,
            "CategoryName": "Chief Complaints",
            "IsChecked": false,
            "SubTabsArray": [],
        },
        {
            "CategoryId": 2,
            "CategoryName": "Review Of System",
            "IsChecked": false,
            "SubTabsArray": [
                {
                    "SubCategoryId": 3,
                    "SubCategoryName": "Allergies",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 37,
                    "SubCategoryName": "Ocular History",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 72,
                    "SubCategoryName": "Ocular Surgical History",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 4,
                    "SubCategoryName": "Current Eye Medications",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 69,
                    "SubCategoryName": "Past Medical History",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 7,
                    "SubCategoryName": "Surgical History",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 73,
                    "SubCategoryName": "Current Systemic Medications",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 9,
                    "SubCategoryName": "Family History",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 71,
                    "SubCategoryName": "Functional History",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 46,
                    "SubCategoryName": "LifeStyle History",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 70,
                    "SubCategoryName": "Vaccination History",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 6,
                    "SubCategoryName": "Birth History",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 8,
                    "SubCategoryName": "Nutritional History",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 47,
                    "SubCategoryName": "Menstrual History",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 79,
                    "SubCategoryName": "Physical Evaluation",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 80,
                    "SubCategoryName": "Psychiatry",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 81,
                    "SubCategoryName": "Health Concerns And Goals",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 82,
                    "SubCategoryName": "Lab & Investigations",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 83,
                    "SubCategoryName": "Implants",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 84,
                    "SubCategoryName": "Psychological Observations",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 85,
                    "SubCategoryName": "Vitals",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 86,
                    "SubCategoryName": "Fall Risk Assessment",
                    "IsChecked": false,
                },
            ],
        },
        {
            "CategoryId": 3,
            "CategoryName": "Vision & Perception",
            "IsChecked": false,
            "SubTabsArray": [
                {
                    "SubCategoryId": 11,
                    "SubCategoryName": "Visual Acuity",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 49,
                    "SubCategoryName": "Auto Refraction",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 36,
                    "SubCategoryName": "Retinoscopy",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 42,
                    "SubCategoryName": "Present Glass Rx",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 50,
                    "SubCategoryName": "Manifest Refraction",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 54,
                    "SubCategoryName": "Cyclopegic Refraction",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 52,
                    "SubCategoryName": "Over Refraction",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 57,
                    "SubCategoryName": "Final Glass Rx",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 16,
                    "SubCategoryName": "Keratometry",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 60,
                    "SubCategoryName": "IOP & Pachy",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 61,
                    "SubCategoryName": "Pupil Size",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 74,
                    "SubCategoryName": "PAM",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 75,
                    "SubCategoryName": "Glare",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 22,
                    "SubCategoryName": "Amsler Grid",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 78,
                    "SubCategoryName": "Confrontational Field Test",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 38,
                    "SubCategoryName": "Dry Eye Evaluation",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 77,
                    "SubCategoryName": "Hertels Examination",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 23,
                    "SubCategoryName": "Color Vision test",
                    "IsChecked": false,
                }, {
                    "SubCategoryId": 41,
                    "SubCategoryName": "Lacrimal Patency",
                    "IsChecked": false,
                },
            ],
        },
        {
            "CategoryId": 9,
            "CategoryName": "Contact Lens",
            "IsChecked": false,
            "SubTabsArray": [
                {
                    "SubCategoryId": 121,
                    "SubCategoryName": "Soft Contact Lens ",
                    "IsChecked": false,

                },
                {
                    "SubCategoryId": 122,
                    "SubCategoryName": "Rgp Contact Lens",
                    "IsChecked": false,
                },

            ],
        },
        {
            "CategoryId": 4,
            "CategoryName": "Examinations",
            "IsChecked": false,
            "SubTabsArray": [
                {
                    "SubCategoryId": 24,
                    "SubCategoryName": "Anterior Segment",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 25,
                    "SubCategoryName": "Posterior Segment",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 26,
                    "SubCategoryName": "Gonioscopy",
                    "IsChecked": false,
                },
                {
                    "SubCategoryId": 21,
                    "SubCategoryName": "Motor examination / Squint evaluation / BV Testing",
                    "IsChecked": false,
                },
            ],
        },
        {
            "CategoryId": 5,
            "CategoryName": "Assessment Plans",
            "IsChecked": false,
            "SubTabsArray": [],
        },
        {
            "CategoryId": 6,
            "CategoryName": "Orders",
            "IsChecked": false,
            "SubTabsArray": [],
        },
        {
            "CategoryId": 7,
            "CategoryName": "Medical Rx",
            "IsChecked": false,
            "SubTabsArray": [],
        },
        {
            "CategoryId": 8,
            "CategoryName": "Glass Rx",
            "IsChecked": false,
            "SubTabsArray": [],
        },
        {
            "CategoryId": 10,
            "CategoryName": "Procedures",
            "IsChecked": false,
            "SubTabsArray": [],
        },
        {
            "CategoryId": 11,
            "CategoryName": "Super Bill",
            "IsChecked": false,
            "SubTabsArray": [],
        },
        {
            "CategoryId": 12,
            "CategoryName": "Return To Office",
            "IsChecked": false,
            "SubTabsArray": [],
        },
        {
            "CategoryId": 13,
            "CategoryName": "Staff",
            "IsChecked": false,
            "SubTabsArray": [],
        },
        {
            "CategoryId": 14,
            "CategoryName": "Consultation Notes",
            "IsChecked": false,
            "SubTabsArray": [],
        },
    ];
    const Contactlensindicators = [
        'IssoftContactlensInd',
        'IsRgblensInd',
    ];
    $scope.PrintObj = {
        'PrintType': 'Print',
        'IsPrintByModule': true
    }

    $scope.IsPrintByModule = true;

    const ROSindicators = [
        'IsAllergiesInd',
        'IsOcularHistoryInd',
        'IsOcularSurgicalHistoryInd',
        'IsCurrentEyeMedicationsInd',
        'IsSystemicHistoryInd',
        'IsSurgicalHistoryInd',
        'IsCurrentSystemicMedicationsInd',
        'IsFamilyHistoryInd',
        'IsFunctionalHistoryInd',
        'IsLifeStyleHistoryInd',
        'IsVaccinationHistoryInd',
        'IsBirthHistoryInd',
        'IsNutritionalHistoryInd',
        'IsMenstrualHistoryInd',
        'IsPhysicalEvaluationInd',
        'IsPsychiatryInd',
        'IsHealthConcernsAndGoalsInd',
        'IsLabInvestigationsInd',
        'IsImplantsInd',
        'IsPsychologicalObservationsInd',
        'IsVitalsInd',
        'IsFallRiskInd'
    ];
    const Visionindicators = [
        'IsVisualAcuityInd',
        'IsAutoRefractionInd',
        'IsRetinoscopyInd',
        'IsPresentGlassRxInd',
        'IsManifestRefractionInd',
        'IsCyclopegicRefractionInd',
        'IsOverRefractionInd',
        'IsFinalGlassRxInd',
        'IsKeratometryInd',
        'IsIOPandPachyInd',
        'IsPupilSizeInd',
        'IsPAMInd',
        'IsGlareInd'
    ];
    const Examinationsindicators = [
        'IsAnteriorSegmentInd',
        'IsPosteriorSegmentInd',
        'IsDryEyeEvaluationInd',
        'IsAmslerGridInd',
        'IsConfrontationalFieldTestInd',
        'IsGonioscopyInd',
        'IsHertelsExaminationInd',
        'IsColorVisionTestInd',
        'IsLacrimalPatencyInd',
        'IsMotorExaminationInd'
    ];
    $scope.mainPatientProfileObj = {
        "MainTab": 0,
        "PatientId": $scope.SelectedPatientId || 0,
        "AppointmentId": $scope.SelectedAppointmentId || 0,
        "PatientDetailsSummaryMode": false,
        "VisitId": 0,
        "VisitStatus": "",
        "AllBranchesList": [],
        "AllUsersList": [],
        "AllDoctorsList": [],
        "AllFacilities": [],
        "OrganizationFacilityList": [],
        "DepositTypes": [],
        "WriteOffReasons": [],
        "PatientDetailSummary": {},
        "patientInsuranceTpasArray": [],
        "AllMasterData": {},
        "FamilySummary": [],
        "TitlesList": [],
        "isAscChartShowInd": false,
        "StatusFlag": '',
        "AppointmentDate": '',
        "CardTypesData": [],
        "AppointmentDoctorId":0
    };

    $scope.visualCustomArrayOD = [
        {
            "OrganId": 1,
            "OrganName": "OD",
            'SCDistance': '',
            'SCNear': '',
            'CCGLDistance': '',
            'CCGLNear': '',
            'CCCLDistance': '',
            'CCCLNear': '',
            'Pinhole': '',
            'TAC': '',
        }
    ];
    $scope.visualCustomArrayOS = [
        {
            "OrganId": 2,
            "OrganName": "OS",
            'SCDistance': '',
            'SCNear': '',
            'CCGLDistance': '',
            'CCGLNear': '',
            'CCCLDistance': '',
            'CCCLNear': '',
            'Pinhole': '',
            'TAC': '',
        }
    ];
    $scope.visualCustomArrayOU = [
        {
            "OrganId": 3,
            "OrganName": "OU",
            'SCDistance': '',
            'SCNear': '',
            'CCGLDistance': '',
            'CCGLNear': '',
            'CCCLDistance': '',
            'CCCLNear': '',
            'Pinhole': '',
            'TAC': '',
        }
    ];
    $scope.ProcedureNotesObj = {
        "Notes": ""
    };
    $scope.IsPrintByModuleFromFax = true;
    $scope.visualMainCustomArray = [];
    //MainModule
    $scope.ModuleListIsChecked = function (Categoryitem) {
        // ROS
        if (Categoryitem == 'ROS') {
            const IsReviewOfSystemInd = $scope.ModuleNamesInd.IsReviewOfSystemInd;
            ROSindicators.forEach(ROSindicators => {
                $scope.ModuleNamesInd[ROSindicators] = IsReviewOfSystemInd;
            });
        }
        // VISION
        if (Categoryitem == 'Vision') {

            const IsVisionAndPerceptionInd = $scope.ModuleNamesInd.IsVisionAndPerceptionInd;
            Visionindicators.forEach(Visionindicators => {
                $scope.ModuleNamesInd[Visionindicators] = IsVisionAndPerceptionInd;
            });
        }
        //EXAMINATION
        if (Categoryitem == 'Examinations') {
            const IsExaminationsInd = $scope.ModuleNamesInd.IsExaminationsInd;
            Examinationsindicators.forEach(Examinationsindicators => {
                $scope.ModuleNamesInd[Examinationsindicators] = IsExaminationsInd;
            });
        }
        if (Categoryitem == 'contact') {
            const IsContactLensInd = $scope.ModuleNamesInd.IsContactLensInd;
            Contactlensindicators.forEach(Contactlensindicators => {
                $scope.ModuleNamesInd[Contactlensindicators] = IsContactLensInd;
            });
        }
    }
    //subModule
    $scope.SubModuleListIsChecked = function (type) {
        //ROS
        let allROSTrue = ROSindicators.every(indicator => $scope.ModuleNamesInd[indicator]);
        $scope.ModuleNamesInd.IsReviewOfSystemInd = allROSTrue;
        //VISION
        let allVisionTrue = Visionindicators.every(indicator => $scope.ModuleNamesInd[indicator]);
        $scope.ModuleNamesInd.IsVisionAndPerceptionInd = allVisionTrue;
        //EXAM
        let allExamTrue = Examinationsindicators.every(indicator => $scope.ModuleNamesInd[indicator]);
        $scope.ModuleNamesInd.IsExaminationsInd = allExamTrue;

        let contactlenstrue = Contactlensindicators.every(indicator => $scope.ModuleNamesInd[indicator]);
        $scope.ModuleNamesInd.IsContactLensInd = contactlenstrue;
    }

    $scope.CheckAllEmrCheckBoxes = function (Ischecked) {
        if (Ischecked) {
            for (let key in $scope.ModuleNamesInd) {
                if ($scope.ModuleNamesInd.hasOwnProperty(key)) {
                    $scope.ModuleNamesInd[key] = true;
                }
            }
        } else {
            $scope.ModuleNamesInd = $scope.GetModuleNamesInd();
        }
    }
    $scope.ChartOverAllPrint = function (pitem) {
       let CreatedByName = "";
        if (doctorinfo.doctordata.User.length > 0) {
            CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
        }

        var DoctorSignature = '';
        var TempArray = $filter("filter")($scope.allUserList, { "DoctorID": pitem.DoctorId }, true) || [];
        if (TempArray.length > 0) {
            if (TempArray[0].SuffixId == 10 || TempArray[0].SuffixId == 13) {
                DoctorSignature = TempArray[0].SignatureOfUser || '';
            }
        }

        var VisionArray = [];
        //angular.forEach($scope.cacheStorageItem.FinalVisionDetails, function (item) {
        angular.forEach(pitem.VisionDetails, function (item) {
            if (item.InvestigationId === 4 || item.InvestigationId == 5 || item.InvestigationId === 2071 || item.InvestigationId === 13 || item.InvestigationId === 2076) {
                VisionArray.push(item);
            }
        });
        if (VisionArray.length > 0) {

            var TempArray1 = $filter("filter")(VisionArray, { "InvestigationId": 4 }, true);
            if (TempArray1.length > 0) {
                $scope.visualCustomArrayOD[0].SCDistance = TempArray1[0].RightEyeValues.Distance;
                $scope.visualCustomArrayOD[0].SCNear = TempArray1[0].RightEyeValues.Near;
                $scope.visualCustomArrayOS[0].SCDistance = TempArray1[0].LeftEyeValues.Distance;
                $scope.visualCustomArrayOS[0].SCNear = TempArray1[0].LeftEyeValues.Near;
                $scope.visualCustomArrayOU[0].SCDistance = TempArray1[0].BothEyeValues.Distance;
                $scope.visualCustomArrayOU[0].SCNear = TempArray1[0].BothEyeValues.Near;
            }

            var TempArray2 = $filter("filter")(VisionArray, { "InvestigationId": 5 }, true);
            if (TempArray2.length > 0) {
                $scope.visualCustomArrayOD[0].CCGLDistance = TempArray2[0].RightEyeValues.Distance;
                $scope.visualCustomArrayOD[0].CCGLNear = TempArray2[0].RightEyeValues.Near;
                $scope.visualCustomArrayOS[0].CCGLDistance = TempArray2[0].LeftEyeValues.Distance;
                $scope.visualCustomArrayOS[0].CCGLNear = TempArray2[0].LeftEyeValues.Near;
                $scope.visualCustomArrayOU[0].CCGLDistance = TempArray2[0].BothEyeValues.Distance;
                $scope.visualCustomArrayOU[0].CCGLNear = TempArray2[0].BothEyeValues.Near;
            }

            var TempArray3 = $filter("filter")(VisionArray, { "InvestigationId": 2071 }, true);
            if (TempArray3.length > 0) {
                $scope.visualCustomArrayOD[0].CCCLDistance = TempArray3[0].RightEyeValues.Distance;
                $scope.visualCustomArrayOD[0].CCCLNear = TempArray3[0].RightEyeValues.Near;
                $scope.visualCustomArrayOS[0].CCCLDistance = TempArray3[0].LeftEyeValues.Distance;
                $scope.visualCustomArrayOS[0].CCCLNear = TempArray3[0].LeftEyeValues.Near;
                $scope.visualCustomArrayOU[0].CCCLDistance = TempArray3[0].BothEyeValues.Distance;
                $scope.visualCustomArrayOU[0].CCCLNear = TempArray3[0].BothEyeValues.Near;
            }

            var TempArray4 = $filter("filter")(VisionArray, { "InvestigationId": 13 }, true);
            if (TempArray4.length > 0) {
                $scope.visualCustomArrayOD[0].Pinhole = TempArray4[0].RightEyeValues.Remarks;
                $scope.visualCustomArrayOS[0].Pinhole = TempArray4[0].LeftEyeValues.Remarks;
            }

            var TempArray5 = $filter("filter")(VisionArray, { "InvestigationId": 2076 }, true);
            if (TempArray5.length > 0) {
                $scope.visualCustomArrayOD[0].TAC = TempArray5[0].RightEyeValues.Remarks;
                $scope.visualCustomArrayOS[0].TAC = TempArray5[0].LeftEyeValues.Remarks;
            }
            $scope.visualMainCustomArray = $scope.visualCustomArrayOD.concat($scope.visualCustomArrayOS, $scope.visualCustomArrayOU);
        } else {
            $scope.visualMainCustomArray = [];
        }
        $scope.cacheStorageItem.ROSAllergyHeaders = $scope.cacheStorageItem.ROSAllergyHeaders || [];
        var ROSAllergyHeadersData = [];
        angular.forEach($scope.cacheStorageItem.ROSAllergyHeaders, function (item) {
            if (item.Active == 'Y') {
                ROSAllergyHeadersData.push(item);
            }
        });

        pitem.CustomAllergyRemarks = pitem.CustomAllergyRemarks || [];
        var PHysicalEvaluationLength = 62;
        var CustomAllergyRemarksData = [];
        angular.forEach(pitem.CustomAllergyRemarks, function (item) {
            if (item.CustomAllergyValue == 'Y') {
                CustomAllergyRemarksData.push(item);
            }
        });
        pitem.PsychiatryData = pitem.PsychiatryData || [];
        var Psychiatry = [];
        angular.forEach(pitem.PsychiatryData, function (item) {
            if (item.PsychiatryType == 'Mood') {
                Psychiatry.push(item);
            }
        });
        var MentalStatus = [];
        angular.forEach(pitem.PsychiatryData, function (item) {
            if (item.PsychiatryType == 'Mental Status') {
                MentalStatus.push(item);
            }
        });

        var PamArray = [];
        pitem.VisionDetails = pitem.VisionDetails || 0;
        angular.forEach(pitem.VisionDetails, function (item) {
            if (item.InvestigationId == 2155) {
                PamArray.push(item);
            }
        });

        var PrescriptionDetails = [];
        pitem.PatientPrescription[0].PrescriptionDetails = pitem.PatientPrescription[0].PrescriptionDetails || [];
        if (pitem.PatientPrescription[0].PrescriptionDetails.length > 0) {
            angular.forEach(pitem.PatientPrescription[0].PrescriptionDetails, function (item) {
                PrescriptionDetails.push(item);
            });
        }

        
        pitem.SquintDetails = pitem.SquintDetails || [];
        //angular.forEach(pitem.SquintDetails, function (item) {
        //    if (item.InvestigationId == 2095 && item.InvestigationOrgans.length > 0) {
        //        DuctionsArray.push(item);
        //    }
        //});
        var Notes = '';
        if ($scope.cacheStorageItem.ReturnToOfficeNotes !== '' && $scope.cacheStorageItem.ReturnToOfficeNotes !== null && $scope.cacheStorageItem.ReturnToOfficeNotes !== undefined) {
            Notes = $scope.cacheStorageItem.ReturnToOfficeNotes;
        }
        var DurationDate = '';
        pitem.FollowUpDate = pitem.FollowUpDate || '';
        if (pitem.FollowUpDate !='') {
            DurationDate = $filter("date")(new Date(pitem.FollowUpDatee), "MM-dd-yyyy");
        }
        var Duration = '';
        if ($scope.cacheStorageItem.FollowUpDuration !== '' && $scope.cacheStorageItem.FollowUpDuration !== 0 && $scope.cacheStorageItem.FollowUpDuration !== null) {
            Duration = $scope.cacheStorageItem.FollowUpDuration
        }
        var DurationTypeName = '';
        if (Duration !== '') {
            DurationTypeName = $scope.cacheStorageItem.FollowUpDurationType === "Y" ? "Years(s)" : ($scope.cacheStorageItem.FollowUpDurationType === "M" ? "Month(s)" : ($scope.cacheStorageItem.FollowUpDurationType === "D" ? "Day(s)" : ($scope.cacheStorageItem.FollowUpDurationType === "W" ? "Week(s)" : ($scope.cacheStorageItem.FollowUpDurationType === "C" ? "To Be continued" : ($scope.cacheStorageItem.FollowUpDurationType === "L" ? "Life Time" : "")))));
        }
        $scope.cacheStorageItem.ReferralDetails = $scope.cacheStorageItem.ReferralDetails || [];
        var AppointmentDoctor = '';
        var UserFullName = '';
        var LicenseNumber = '';
        var followupDetails = pitem.FollowUpDetails || []
        followupDetails.forEach(item => {
            item.FollowUpDate = $filter("date")((item.FollowUpDate), "MM-dd-yyyy")
            item.FollowUpDurationType = item.FollowUpDurationType === "Y" ? "Years(s)" : (item.FollowUpDurationType === "M" ? "Month(s)" : (item.FollowUpDurationType === "D" ? "Day(s)" : (item.FollowUpDurationType === "W" ? "Week(s)" : (item.FollowUpDurationType === "C" ? "To Be continued" : (item.FollowUpDurationType === "L" ? "Life Time" : "")))));
        })
        $scope.DoctorArray = $filter("filter")($scope.allUserList, { "DoctorID": pitem.DoctorId }, true) || [];
        if ($scope.DoctorArray.length > 0) {
            AppointmentDoctor = $scope.DoctorArray[0].FullName;
            /* UserFullName = $scope.DoctorArray[0].UserFullName;*/
            if ($scope.DoctorArray[0].SuffixId == 13 || $scope.DoctorArray[0].SuffixId == 10) {
                UserFullName = $scope.DoctorArray[0].FirstName + ' ' + $scope.DoctorArray[0].LastName + ' ' + $scope.DoctorArray[0].SuffixName
            } else {
                UserFullName = $scope.DoctorArray[0].UserFullName;
            }
            LicenseNumber = $scope.DoctorArray[0].LicenseNumber;
        }
        $scope.SquitArray = [];
        if (pitem.SquintDetails.length > 0) {
            angular.forEach(pitem.SquintDetails, function (mitem, index) {
                if (mitem.InvestigationId == 699) {
                    if (mitem.DistanceValue !== '' || mitem.DistanceFixationPreference !== '' || mitem.NearValue !== '' || mitem.NearFixationPreference !== '' || mitem.Remarks !== '') {
                        $scope.SquitArray.push(mitem)
                    }
                }
                if (mitem.InvestigationId == 719) {
                    var Count = 0;
                    if (mitem.PrismCoverDetailsArray.length > 0) {
                        angular.forEach(mitem.PrismCoverDetailsArray, function (item) {
                            if (item.Distance.DistanceRPrismValue !== '' || item.Distance.DistanceRTypeOfSquintValue !== '' || item.Distance.DistanceRFixationPreference !== "" || item.Distance.DistanceLPrismValue !== '' || item.Distance.DistanceLTypeOfSquintValue !== '' || item.Distance.DistanceLFixationPreference !== '' || item.Near.NearRPrismValue !== '' || item.Near.NearRTypeOfSquintValue !== '' || item.Near.NearRFixationPreference !== '' || item.Near.NearLPrismValue !== '' || item.Near.NearLTypeOfSquintValue !== '' || item.Near.NearLFixationPreference !== '' || item.AllRemarks !== '') {
                                Count++
                            }
                        });
                        if (Count !== 0) {
                            $scope.SquitArray.push(mitem)
                        }
                    }
                }
                if (mitem.InvestigationId == 697) {
                    if (mitem.RightEye.Name !== '' || mitem.RightEye.DegreeValue !== '' || mitem.LeftEye.Name !== '' || mitem.LeftEye.DegreeValue !== '' || mitem.Remarks !== '') {
                        $scope.SquitArray.push(mitem)
                    }
                }
                if (mitem.InvestigationId == 721) {
                    mitem.Nystagmus = mitem.Nystagmus || '';
                    mitem.Remarks = mitem.Remarks || '';
                    if (mitem.IsNystagmusNormal || mitem.Remarks || (mitem.NystagmusDetailsArray && mitem.NystagmusDetailsArray.length > 0)) {
                        $scope.SquitArray.push(mitem)
                    }
                }
            });
        } else {
            $scope.SquitArray = [];
        }


        $scope.BinocularArray = [];
        if (pitem.SquintDetails.length > 0) {
            angular.forEach(pitem.SquintDetails, function (mitem, index) {
                if (mitem.InvestigationId == 64) {
                    if (mitem.DistanceValue !== '' || mitem.NearValue !== '' || mitem.Remarks !== '') {
                        $scope.BinocularArray.push(mitem)
                    }
                }
                if (mitem.InvestigationId == 701) {
                    $scope.BinocularArray.push(mitem)
                }
            });
        } else {
            $scope.BinocularArray = [];
        }

        pitem.AnteriorSegmentDetails = pitem.AnteriorSegmentDetails || [];
        $scope.AnteriorArray = [];
        if (pitem.AnteriorSegmentDetails.length > 0) {
            angular.forEach(pitem.AnteriorSegmentDetails, function (item) {
                if (item.RemarksArray.length > 0 || item.InvestigationId == 6) {
                    $scope.AnteriorArray.push(item)
                }
            });
        } else {
            $scope.AnteriorArray = [];
        }
        $scope.TempArray = [];

        $scope.TempArray = $filter('orderBy')($scope.AnteriorArray, 'OrderBY');

        $scope.AnteriorArray = angular.copy($scope.TempArray);

        pitem.PosteriorSegmentDetails = pitem.PosteriorSegmentDetails || [];
        $scope.PosteriorArray = [];
        if (pitem.PosteriorSegmentDetails.length > 0) {
            angular.forEach(pitem.PosteriorSegmentDetails, function (item) {
                if (item.RemarksArray.length > 0 || item.InvestigationId == 32) {
                    $scope.PosteriorArray.push(item)
                }
            });
        } else {
            $scope.PosteriorArray = [];
        }
        $scope.TempArray2 = [];

        $scope.TempArray2 = $filter('orderBy')($scope.PosteriorArray, 'OrderBY');

        $scope.PosteriorArray = angular.copy($scope.TempArray2);

        var ExtraOccularArray = [];
        var DuctionsArray = [];
        pitem.NineGazeExtraOcularDetails = pitem.NineGazeExtraOcularDetails || [];

        if (pitem.NineGazeExtraOcularDetails.length > 0) {
            angular.forEach(pitem.NineGazeExtraOcularDetails, function (item) {
                if (item.InvestigationId == 18) {
                    if (item.RsrValue != "" || item.RIoValue != "" || item.RLrValue != "" || item.RPgValue != "" || item.RMrValue != "" || item.RIrValue != "" || item.RIrSoValue != "" || item.RSoValue != "" || item.LIoValue != "" || item.LSrValue != "" || item.LMrValue != "" || item.LPgValue != "" || item.LLrValue != "" || item.LSoValue != "" || item.LIrValue != "" || item.LRemarks != "" || item.RRemarks != "") {
                        ExtraOccularArray.push(item)
                    }
                }
                if (item.InvestigationId == 2095) {
                    if (item.RIoValue != "" || item.RsrValue != "" || item.RIoValue != "" || item.RLrValue != "" || item.RPgValue != "" || item.RMrValue != "" || item.RIrValue != "" || item.RSoValue != "" || item.LIoValue != "" || item.LSrValue != "" || item.LMrValue != "" || item.LPgValue != "" || item.LLrValue != "" || item.LSoValue != "" || item.LIrValue != "" || item.LRemarks != "" || item.RRemarks != "") {
                        DuctionsArray.push(item)
                    }
                }
            });
        }
        var NineGazeArray = [];
        pitem.NineGazeExtraOcularDetails = pitem.NineGazeExtraOcularDetails || [];
        var TempArray = $filter("filter")(pitem.NineGazeExtraOcularDetails, { "InvestigationId": 695 }, true) || [];
        if (TempArray.length > 0) {
            NineGazeArray = angular.copy(TempArray);
        }

        $scope.NearInvestigationdetailsArray = [];
        if (pitem.NearInvestigationdetails.length > 0) {
            angular.forEach(pitem.NearInvestigationdetails, function (mitem, index) {
                if (mitem.InvestigationId == 815) {
                    if (mitem.BreakOUValue != '' || mitem.RecoveryOUValue != '' || mitem.Remarks != '') {
                        $scope.NearInvestigationdetailsArray.push(mitem)
                    }
                }
                if (mitem.InvestigationId == 2122) {
                    if (mitem.BlurODValue != '' || mitem.BreakODValue != '' || mitem.RecoveryODValue != '' || mitem.BlurOSValue != '' || mitem.BreakOSValue != '' || mitem.RecoveryOSValue != '' || mitem.BlurOUValue != '' || mitem.BreakOUValue != '' || mitem.RecoveryOUValue != '' || mitem.Remarks != '') {
                        $scope.NearInvestigationdetailsArray.push(mitem)
                    }
                }
                //if (mitem.InvestigationId == 2123) {
                //    if (mitem.ODNegativeDistaceValue != '' || mitem.ODNegativeNearValue != '' || mitem.ODPositiveDistaceValue != '' || mitem.ODPositiveNearValue != '' || mitem.OSNegativeDistaceValue != '' || mitem.OSNegativeNearValue != '' || mitem.OSPositiveDistaceValue != '' || mitem.OSPositiveNearValue != '' || mitem.Remarks != '') {
                //        $scope.NearInvestigationdetailsArray.push(mitem)
                //    }
                //}
                if (mitem.InvestigationId == 2123) {
                    if (mitem.HorDistancePositiveBlur != '' || mitem.HorDistancePositiveBreak != '' || mitem.HorDistancePositiveRecovery != '' ||
                        mitem.HorDistanceNegativeBlur != '' || mitem.HorDistanceNegativeBreak != '' || mitem.HorDistanceNegativeRecovery != '' ||
                        mitem.HorNearPositiveBlur != '' || mitem.HorNearPositiveBreak != '' || mitem.HorNearPositiveRecovery != '' ||
                        mitem.HorNearNegativeBlur != '' || mitem.HorNearNegativeBreak != '' || mitem.HorNearNegativeRecovery != '' ||
                        mitem.VerBaseUpBlur != '' || mitem.VerBaseUpBreak != '' || mitem.VerBaseUpRecovery != '' ||
                        mitem.VerBaseDownBlur != '' || mitem.VerBaseDownBreak != '' || mitem.VerBaseDownRecovery != '' ||
                        mitem.Remarks != '') {
                        $scope.NearInvestigationdetailsArray.push(mitem);
                    }
                }
                if (mitem.InvestigationId == 2124) {
                    if (mitem.ODNegativeDistaceValue != '' || mitem.ODNegativeNearValue != '' || mitem.ODPositiveDistaceValue != '' || mitem.ODPositiveNearValue != '' || mitem.OSNegativeDistaceValue != '' || mitem.OSNegativeNearValue != '' || mitem.OSPositiveDistaceValue != '' || mitem.OSPositiveNearValue != '' || mitem.Remarks != '') {
                        $scope.NearInvestigationdetailsArray.push(mitem)
                    }
                }
            });
        }



        var AllNormal = ''
        var occularHistory = $filter("filter")(pitem.OccularHistory, { "HistoryId": 1 }, true) || [];
        var ocularSurgicalHistory = $filter("filter")(pitem.OccularSurgicalHistory, { "HistoryId": 1 }, true) || [];
        var currentEyeMedications = $filter("filter")(pitem.CurrentEyeMedications, { "MedicineId": 1 }, true) || [];
        var systemicHistory = $filter("filter")(pitem.SystemicHistory, { "HistoryId": 1 }, true) || [];
        var surgicalHistory = $filter("filter")(pitem.SurgicalHistory, { "HistoryId": 1 }, true) || [];
        var currentSystemicMedicationsHistory = $filter("filter")(pitem.CurrentSystemicMedicationsHistory, { "MedicineId": 1 }, true) || [];
        var familyHistory = $filter("filter")(pitem.FamilyHistory, { "HistoryId": 1 }, true) || [];
        var functionalStatusHistory = $filter("filter")(pitem.FunctionalStatusHistory, { "HistoryId": 1 }, true) || [];
        var vaccinationHistory = $filter("filter")(pitem.VaccinationHistory, { "HistoryId": 1 }, true) || [];
        var birthHistory = $filter("filter")(pitem.BirthHistory, { "HistoryId": 1 }, true) || [];
        var nutritionalHistory = $filter("filter")(pitem.NutritionalHistory, { "HistoryId": 1 }, true) || [];
        var menstrualHistory = $filter("filter")(pitem.MenstrualHistory, { "HistoryId": 1 }, true) || [];
        var labInvestigations = $filter("filter")(pitem.LabInvestigations, { "ProcedureId": 1 }, true) || [];
        if (occularHistory != 0 || ocularSurgicalHistory != 0 || currentEyeMedications != 0 || systemicHistory != 0 || surgicalHistory != 0 || currentSystemicMedicationsHistory != 0 || familyHistory != 0 || functionalStatusHistory != 0 || vaccinationHistory != 0 || birthHistory != 0 || nutritionalHistory != 0 || menstrualHistory != 0 || labInvestigations != 0) {
            AllNormal = 'All other Review of systems referred as NORMAL';
        }

        var CurrentEyeMedications = $filter("filter")(pitem.CurrentSystemicMedicationsHistory, { "MedicationLocationTypeId": 1 }, true) || [];
        var CurrentSystemicMedicationsHistory = $filter("filter")(pitem.CurrentSystemicMedicationsHistory, { "MedicationLocationTypeId": 2 }, true) || [];

        angular.forEach(pitem.FinalGlassRxArray, function (item) {
            if (item.ExpirationDate != null) {
                item.ExpirationDate = $filter("date")(item.ExpirationDate, "MM-dd-yyyy");
            }
        })
        var DoctorFullName = '';
        if ($scope.allUserList.length !== 0) {
            var Doctorrarray = $filter("filter")($scope.allUserList, function (tempitem, ind) { return pitem.DoctorId === tempitem.DoctorID }) || [];

            if (Doctorrarray.length > 0) {
                DoctorFullName = Doctorrarray[0].UserFullName || "";
            }

        }

        var AssessmentPlanArray = [];
        if (pitem.AssessmentPlan.length > 0) {
            angular.forEach(pitem.AssessmentPlan, function (mitem) {
                if (mitem.DiagnosisStatusId1 == 2 || mitem.DiagnosisStatusId2 == 2) {
                    AssessmentPlanArray.push(mitem);
                }
            })
        }

        $scope.tempPachymetry = [];
        if (pitem.Pachymetry.length !== 0 || pitem.PachymetryRemarks != '') {
            var object = {
                "PatientFindingPachymetryId": 0,
                "InvestigationId": 176,
                "InvestigationDesc": "Pachymetry",
                "CategoryId": 1,
                "CategoryDesc": "Vision",
                "ActiveInd": "Y",
                "Pachymetry": pitem.Pachymetry || [],

                "ActiveInd": "Y",
                "Remarks": pitem.PachymetryRemarks || ""
            };
            $scope.tempPachymetry.push(object);
        }
        var count1 = 0;
        var count2 = 0;
        var pachyODAvgValue = 0;
        var pachyOSAvgValue = 0;
        pitem.PachymetryAvgODValue = 0;
        pitem.PachymetryAvgOSValue = 0;
        angular.forEach($scope.tempPachymetry, function (supitem) {
            angular.forEach(supitem.Pachymetry, function (pitem) {
                if (pitem.RightEye!='') {
                    pachyODAvgValue += parseInt(pitem.RightEye) || 0;
                    count1++;
                }
                if (pitem.LeftEye!='') {
                    pachyOSAvgValue += parseInt(pitem.LeftEye) || 0;
                    count2++;
                }
            });
        });
        if (pachyODAvgValue!=0) {
            pitem.PachymetryAvgODValue = parseFloat(pachyODAvgValue / count1).toFixed(2) || 0;
        }
        if (pachyOSAvgValue!=0) {
            pitem.PachymetryAvgOSValue = parseFloat(pachyOSAvgValue / count2).toFixed(2) || 0;
        }


        $scope.FinalPachymetryDetails = $scope.tempPachymetry || [];
        var orgDetails = pitem.OrganizationDetails || [];

        var obj = {
            "CreatedBy": CreatedByName,
            "ConsultationDate": pitem.AppointmentDt || '',
            "AppointmentTime": pitem.AppointmentTime || '',
            "PatientArray": pitem.PatientArray || [],
            "Address": doctorinfo.doctordata.UserAddress[0].Address1 + '  ' + doctorinfo.doctordata.UserAddress[0].Address2 || '',
            "ChiefComplaints": pitem.ChiefComplaints || [],
            "AllergyItems": pitem.AllergyItems || [],
            "OccularHistory": pitem.OccularHistory || [],
            "OcularSurgicalHistory": pitem.OccularSurgicalHistory || [],
            "CurrentEyeMedications": CurrentEyeMedications || [],
            "SystemicHistory": pitem.SystemicHistory || [],
            "SurgicalHistory": pitem.SurgicalHistory || [],
            "CurrentSystemicMedicationsHistory": CurrentSystemicMedicationsHistory || [],
            "FamilyHistory": pitem.FamilyHistory || [],
            "FunctionalStatusHistory": pitem.FunctionalStatusHistory || [],
            "VaccinationHistory": pitem.VaccinationHistory || [],
            "LifestyleHistory": pitem.LifestyleHistory || [],
            "BirthHistory": pitem.BirthHistory || [],
            "NutritionalHistory": pitem.NutritionalHistory || [],
            "MenstrualHistory": pitem.MenstrualHistory || [],
            "ROSAllergyHeaders": ROSAllergyHeadersData || [],
            "CustomAllergyRemarks": CustomAllergyRemarksData || [],
            "PHysicalEvaluationLength": PHysicalEvaluationLength || 0,
            "PsychiatryData": Psychiatry,
            "Mentalstatus": MentalStatus,
            "PatientHealthConcerns": pitem.PatientHealthConcerns || [],
            "PatientGoals": pitem.PatientGoals || [],
            "ImplantList": pitem.ImplantList || [],
            "LabInvestigations": pitem.LabInvestigations || [],
            "PHQScore": $scope.ScoreObject.PHQScore || 0,
            "AUDITScore": $scope.ScoreObject.AUDITScore || 0,
            "NHANESscore": $scope.ScoreObject.NHANESscore || 0,
            "HARKscore": $scope.ScoreObject.HARKscore || 0,
            "VitalsArray": pitem.Vitals || [],
            "DilationArray": pitem.DilationArray || [],
            "VisionDetails": $scope.visualMainCustomArray || [],
            "VisionArray": pitem.VisionDetails || [],
            "TestUsed": $scope.MasterTestUsedlist || [],
            "AutoRefractionArray": pitem.AutoRefractionArray || [],
            "RetinoscopyArray": pitem.RetinoscopyRefractionArray || [],
            "PGPRefractionArray": pitem.PGPrefractionArray || [],
            "ManifestRefractionArray": pitem.ManifestRefractionArray || [],
            "OverRefractionArray": pitem.OverRefractionArray || [],
            "CycloplegicRefractionArray": pitem.CycloplegicRefractionArray || [],
            "FinalGlassRefractionArray": pitem.FinalGlassRxArray || [],
            "IOPArray": pitem.Tonometry || [],
            "PupilSizeArray": pitem.PupilSizeDetails || [],
            "PupilSizeRemarks": pitem.PupilSizeRemarks || '',
            "PachymetryArray": $scope.FinalPachymetryDetails || [],
            "PachymetryAvgODValue": pitem.PachymetryAvgODValue || '',
            "PachymetryAvgOSValue": pitem.PachymetryAvgOSValue || '',
            "PamArray": PamArray,
            "GlareArray": pitem.GlareArray || [],
            "KeratometryArray": pitem.KeratometryValues || [],
            "AnteriorArray": $scope.AnteriorArray || [],
            "PosteriorArray": $scope.PosteriorArray || [],
            "GonioscopyArray": pitem.GonioscopyDetails || [],
            "ExtraOcularArray": ExtraOccularArray || [],
            "NineGazeArray": NineGazeArray || [],
            "ODFreelymoving": $scope.cacheStorageItem.ODExtraOcularFreelymovingInd || false,
            "OSFreelymoving": $scope.cacheStorageItem.OSExtraOcularFreelymovingInd || false,
            "ODDistance9GazeFreelymovingInd": pitem.ODDistance9GazeFreelymovingInd || false,
            "OSDistance9GazeFreelymovingInd": pitem.OSDistance9GazeFreelymovingInd || false,
            "ODNear9GazeFreelymovingInd": pitem.ODNear9GazeFreelymovingInd || false,
            "OSNear9GazeFreelymovingInd": pitem.OSNear9GazeFreelymovingInd || false,
            "DuctionsArray": DuctionsArray,
            "SquintArray": $scope.SquitArray || [],
            "BinocularArray": $scope.BinocularArray || [],
            "HeadPosterArray": pitem.HeadPosterDetails || [],
            "NearInvestigationArray": $scope.NearInvestigationdetailsArray || [],
            "DryEyeEvaluationData": pitem.DryEyeEvaluationData || [],
            "ColorVisionDetails": pitem.ColorVisionDetails || [],
            "LacrimalPatiencyDetails": pitem.LacrimalPatiencyDetails || [],
            "LacrimalPatencyRemarks": pitem.LacrimalPatencyRemarks || '',
            "HertelsExaminationArray": pitem.FinalHertelsExaminationArray || [],
            "NewAmslerGridArray": pitem.NewAmslerGridArray || [],
            "ConfrontationalFieldArray": pitem.ConfrontationalFieldTestDetails || [],
            "AssessmentPlanArray": AssessmentPlanArray || [],
            "InvestigationsDetails": pitem.InvestigationsDetails || [],
            "SurgeriesDetails": pitem.SurgeriesDetails || [],
            "ProceduresDetails": pitem.ProceduresDetails || [],
            "ReferralDetails": pitem.ReferralDetails || [],
            "GlassRxDetails": pitem.FinalGlassRxArray || [],
            "PrescriptionDetails": PrescriptionDetails || [],
            "ProceduresArray": pitem.OPProceduresArray || [],
            "SuperBillArray": pitem.SuperBillObj.SuperBillArray || [],
            "ReturnToOfficeNotes": Notes || '',
            "FollowUpDate": DurationDate || '',
            "FollowUpDuration": Duration,
            "FollowUpDurationType": DurationTypeName,
            "ScribeName": pitem.ScribeName || '',
            "DoctorName": pitem.DoctorName || '',
            "ConsultationNotes": pitem.OverallChartNotes || '',
            "VisitReason": pitem.VisitReason || '',
            "AppointmentDoctor": AppointmentDoctor || '',
            "OverallProcedureNotes": $scope.ProcedureNotesObj.Notes || '',
            "ExtendedOpthalmology": pitem.IsPosteriorExtendedOpthalmology || false,
            "IsExamedwithTorchused": $scope.cacheStorageItem.IsExamedwithTorchused || false,
            "IsAnteriorUndilatedView": $scope.cacheStorageItem.IsAnteriorUndilatedView || false,
            "IsPosteriorUndilatedView": $scope.cacheStorageItem.IsPosteriorUndilatedView || false,
            "PosteriorLensName": $scope.cacheStorageItem.PosteriorLensName || '',
            "FollowUpVisitReasonName": $scope.cacheStorageItem.FollowUpVisitReasonName || '',
            "ROSOverAllRemarks": pitem.ROSOverAllRemarks || '',
            "AllNormarlText": AllNormal || '',
            "LabInvestigationNotes": pitem.labinvestigationNotes || '',
            "AnteriorRemarks": pitem.AnteriorRemarks || '',
            "PosteriorRemarks": pitem.PosteriorRemarks || '',
            "AllergyRemarks": pitem.AllergyRemarks || "",
            "SurgicalRemarks": pitem.SurgicalRemarks || "",
            "CurrentEyeRemarks": pitem.CurrentEyeRemarks || "",
            "CurrentSystemicRemarks": pitem.CurrentSystemicRemarks || "",
            "SystemicHistoryRemarks": pitem.SystemicHistoryRemarks || "",
            "OccularHistoryRemarks": pitem.OccularHistoryRemarks || "",
            "OcularSurgicalHistoryRemarks": pitem.OcularSurgicalHistoryRemarks || "",
            "FamilyHistoryRemarks": pitem.FamilyHistoryRemarks || "",
            "FunctionalStatusRemarks": pitem.FunctionalStatusRemarks || "",
            "VaccinationHistoryRemarks": pitem.VaccinationHistoryRemarks || "",
            "BirthHistoryRemarks": pitem.BirthHistoryRemarks || "",
            "NutritionalHistoryRemarks": pitem.NutritionalHistoryRemarks || "",
            "MenstrualHistoryRemarks": pitem.MenstrualHistoryRemarks || "",
            "PhysicalEvaluationRemarks": pitem.PhysicalEvaluationRemarks || "",
            "PsychiatryRemarks": pitem.PsychiatryRemarks || "",
            "HealthGoalsRemarks": pitem.HealthGoalsRemarks || "",
            "LabInvestigationsRemarks": pitem.LabInvestigationsRemarks || "",
            "ImplantRemarks": pitem.ImplantRemarks || "",
            "PsychologicalObservRemarks": pitem.PsychologicalObservRemarks || "",
            "VitalsRemarks": pitem.VitalsRemarks || "",
            "LifestyleHistoryRemarks": pitem.LifestyleHistoryRemarks || "",

            "Name": $scope.cacheStorageItem.PatientName || '',
            "Age": $scope.cacheStorageItem.Age || '',
            "Gender": $scope.cacheStorageItem.Gender || '',
            "VisitReason": $scope.cacheStorageItem.AppointmentVisitReasonName || '',
            "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
            "PatientDOB": $scope.cacheStorageItem.PatientDOB || '',
            "EhnoteLogoURL": $scope.HeaderLogo || '',
            "DoctorSignatureURL": DoctorSignature || '',
            "LastSignOffUserDetails": pitem.LastSignOffUserDetails || [],
            "VisitReasonDate": $filter('date')(pitem.VisitReasonDate, 'MM-dd-yyyy') || "",
            "DoctorFullName": DoctorFullName || "",
            "UserFullName": UserFullName || '',
            "LicenseNumber": LicenseNumber || '',
            "MedicalReconsilationDateTime": $filter('date')(pitem.MedicalReconcilationDatetime, 'MM-dd-yyyy h:mm a') || null,
            "MedicalReconsilation": pitem.MedicalReconcillation || false,
            "ContactLensDetails": pitem.ContactLensDetails || [],
            "FallRiskAssessmentArray": pitem.FallRiskAssessmentArray || [],
            "FallRiskAssessmentTotalScore": pitem.FallRiskAssessmentTotalScore || '',
            "FallRiskLevel": pitem.FallRiskLevel || '',
            "ImplementedFallRiskProtocoltype": pitem.ImplementedFallRiskProtocoltype || '',
            "ImplementedFallRiskProtocol": pitem.ImplementedFallRiskProtocol || false,
            "FallriskBraceletprovided": pitem.FallriskBraceletprovided || '',
            "AssistiveWalkingDevice": pitem.AssistiveWalkingDevice || '',
            "FollowupDetails": followupDetails || [],
            "BranchId": pitem.BranchId,
            "HistoryOfPresentIllness": pitem.HistoryOfPresentIllness || '',
            "OrganizationDetails": orgDetails,
            "EhnoteOrganisationLogoUrl": orgDetails?.[0]?.OrganizationLogoUrl || '',

        }

        let FaxOrPrintModeObj = {
            "UserId": eHnoteMasterDataService.getLoginId(),
            "OrganizationId": $scope.HospitalId || 0,
            "PatientId": $scope.SelectedPatientId || 0,
            "PatientName": $scope.cacheStorageItem.PatientName,
            "IsPrintOnlyInd": true
        }
        if ($scope.PrintObj.IsPrintByModule) {
            //module based Print
            USPrintService.GenerateChartOverAllPrint(obj, $scope.ModuleNamesInd,FaxOrPrintModeObj)
             .then(function (resp) {
                 if (resp.status == "Success") {
                     let ascPdfObj = resp || {};
                     let date = $filter('date')(ascPdfObj.CreatedDt, 'MM-dd-yyyy');
                     let FileName = '';
                     if (ascPdfObj.FileName!='') {
                          FileName = ascPdfObj.FileName.replace(/\s+/g, '');
                     }
                     $scope.AttachmentsArray = [];
                     var attachmentObj = {
                         "FileId": 0,
                         "FileName": FileName ,
                         "S3URL": ascPdfObj.S3url,
                         "ExternalFileName": "_" + "Attachment",
                         "FileExt": ascPdfObj.FileExt || "",
                         "MimeType": "application/pdf",
                         "CreatedByUser": doctorinfo.doctordata.User[0].FullName,
                         "CreatedDate": date,
                         "DeleteInd": "N",
                         "DirectSecureMessageId": 0
                     }

                     $scope.AttachmentsArray.push(attachmentObj);
                     $uibModalInstance.close({
                         attachments: $scope.AttachmentsArray,
                         categoryList: $scope.GetCategoryListObj,
                         chartSelectAllObj: $scope.ChartSelectALLobj,
                         PastVisitSummaryGrid: $scope.PastVisitSummaryGrid,
                         TempIsCheckArray: $scope.TempIsCheckArray
                     });
                 }
             })
             .catch(function (err) {
                    console.error("Error uploading PDF:", err);
                });
        }
        else {
            // print all 
            for (let key in $scope.ModuleNamesInd) {
                if ($scope.ModuleNamesInd.hasOwnProperty(key)) {
                    $scope.ModuleNamesInd[key] = true;
                }
            }
            USPrintService.GenerateChartOverAllPrint(obj, $scope.ModuleNamesInd);
        }
    };

    $scope.ShowAdditionInfo = function (item) {
        item = item || "";
        item.AdditionalInformation = !item.AdditionalInformation;
    }
    $scope.ChangesstatusSoftLens = function (item, statusid) {
        if (statusid == 1) {
            item.showstatus = !item.showstatus;
        } else {
            item.showAdvancestatus = !item.showAdvancestatus;
        }
    };
    $scope.ChangesstatusRGP = function (item, statusid) {
        if (statusid == 1) {
            item.showstatus = !item.showstatus;
        } else {
            item.showAdvancestatus = !item.showAdvancestatus;
        }
    }



    $scope.OnSubPreopChange = function () {

        if ($scope.AllAscPrintObj.IsPreopAnesthesiaPrintInd && $scope.AllAscPrintObj.IsPreopChecklistPrintInd)    {

            // atleast 1 sub selected → main ON
            $scope.AllAscPrintObj.IsPreopPrintInd = true;

        } else {          
            $scope.AllAscPrintObj.IsPreopPrintInd = false;
        }
    };

    $scope.hasNineGazeData = function (eye) {

        if (!eye) return false;

        var positions = [
            "UpLeft", "Up", "UpRight",
            "Left", "Primary", "Right",
            "DownLeft", "Down", "DownRight"
        ];

        for (var i = 0; i < positions.length; i++) {

            var pos = eye[positions[i]];

            if (!pos) continue;

            if ((pos.H && (pos.H.Amount || pos.H.Direction)) ||
                (pos.V && (pos.V.Amount || pos.V.Direction))) {
                return true;
            }
        }

        return false;
    };


}]);
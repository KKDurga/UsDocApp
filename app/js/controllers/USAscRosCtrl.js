"use strict";
eHnoteWebApp.controller("USAscRosCtrl", ["$scope", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "$interval", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "datapersistanceFactory", "$window", "eHnoteMainAppointmentService", "$q", "eHnotePatientAddressDataServices", "eHnoteOrgReferralDataServices", "localStorageFactory", "eHnoteSurgeryService", "$timeout", "eHnotePrintService", "eHnoteUserDataService", "eHnoteMainAdminServices", "eHnoteInsuranceService", "eHnotePatientVisitReasonServices", 'eHnoteSettingsDataService', 'eHnoteConditionsDataService', "eHnoteDiagnosisDataServices", "USPrintService", function ($scope, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, $interval, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, datapersistanceFactory, $window, eHnoteMainAppointmentService, $q, eHnotePatientAddressDataServices, eHnoteOrgReferralDataServices, localStorageFactory, eHnoteSurgeryService, $timeout, eHnotePrintService, eHnoteUserDataService, eHnoteMainAdminServices, eHnoteInsuranceService, eHnotePatientVisitReasonServices, eHnoteSettingsDataService, eHnoteConditionsDataService, eHnoteDiagnosisDataServices, USPrintService) {

    var doctorInfo = eHnoteMasterDataService.getUserInfo();
    $scope.HospitalId = '';
    $scope.ParentHospitalId = '';
    if (doctorInfo !== undefined) {
        if (doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.ParentHospitalId = doctorInfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.UserId = doctorInfo.doctorid || 0;
        }
    }
    $scope.IsFromPreOpCall = false;
    $scope.PreOpCallObj = $scope.PreOpCallObj || '';
    $scope.IsPreOpnSaveNameEditModeInd = false;
    if ($scope.PreOpCallObj !== '') {
        if ($scope.PreOpCallObj.IsPreOpnSaveNameEditModeInd) {
            $scope.IsPreOpnSaveNameEditModeInd = true;
        }
        if ($scope.PreOpCallObj.IsAddNewCallDetails == true) {
            $scope.IsFromPreOpCall = false;
        } else {
            $scope.IsFromPreOpCall = true;
        }
    }
   

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    if ($scope.cacheStorageItem == undefined) {
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorageStructure();
    }



    $scope.AllergyStatus = {
        "ShowNoKnownAllergy": true  // default true
    };

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

    $scope.ParentObj.IsIOJParentOrganization;

    $scope.adnewsigobj = {
        "IsNewSig": false,
        "MedicineId": 0,
    }

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

    $scope.cacheStorageItem.IscomingPreOpCallScreen = $scope.cacheStorageItem.IscomingPreOpCallScreen || '';

    $scope.RoslogDiscriptionName = '';
    if ($scope.cacheStorageItem.IscomingPreOpCallScreen == 'PreopCall') {
        $scope.RoslogDiscriptionName = 'Pre-Op Call';
    } else {
        $scope.RoslogDiscriptionName = ' H&p Ros';
    }


    $scope.RosObject = {
        "IsRosSummaryView": false,

    }

    $scope.appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();

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

        "SmokingType": "",
        "AlcoholType": "",
        "PsychisType": "",
        "DrugType": "",
        "Remarks": "",

    }
    $scope.GetHealthPreAdmAnesthetistObj = function () {
        return {
            "PreAdmissionId": 0,
            "OrganizationId": $scope.HospitalId || 0,
            "UserId": eHnoteMasterDataService.getLoginId(),
            "PatientId": $scope.appointmentInfo.PatientID || 0,
            "AppointmentId": $scope.appointmentInfo.AppointmentID || 0,
            "LabList": angular.copy($scope.GetLabInvestigations) || [],
            "LifestyleHistory": angular.copy(Lifeobject) || '',
            "LifestyleHistoryArray": [],
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
            "AppointmentID": $scope.appointmentInfo.AppointmentID,
            "ChemistryNotesInd": false,
            "SocialNotesInd": false,
            "AirwayObjPreAdmnotesInd": false,
            "PreviousPreAdmAnesthetistData": "",
            "PreAdmAppointmentId": 0,
            "AppointmentID": 0,
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
        "isNKSHSelected": false,
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

    $scope.FrequentlyAllergyitems = [];
    $scope.FrequentlySurgicalHistory = [];
    $scope.FrequentlySystemicHistory = [];
    $scope.ROSocularSeverity = [];
    $scope.MainObj = {
        "AllergyItems": [],
        "SystemicHistory": [],
        "SurgicalHistory": [],
        "CurrentSystemicMedicationsHistory": [],
        "CurrentEyeMedications": [],
        "LifestyleDetail": [],
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

    $scope.LogObj = {
        "UserId": $scope.UserId || null,
        "OrganizationId": $scope.HospitalId || null,
        "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
        "PatientId": $scope.cacheStorageItem.PatientID || null,
        "LogArray": [],
        "AllergyItems": [],
        "SurgicalHistory": [],
        "CurrentSystemicMedicationsHistory": [],
        "CurrentEyeMedications": [],
        "SystemicHistory": [],
        "LifestyleDetail": [],
        "AllergyRemarks": "",
        "SurgicalRemarks": "",
        "CurrentEyeRemarks": "",
        "CurrentSystemicRemarks": "",
        "SystemicHistoryRemarks": "",
        "LifestyleHistoryRemarks": "",
        "CardiacNotes": "",
        "PulmonaryNotes": "",
        "NeurologicNotes": "",
        "HepaticNotes": "",
        "HemeOncNotes": "",
        "KidneyDiseaseNotes": "",
        "MusculoSkeletalSystemNotes": "",
        "EndocrineNotes": "",

    };

    $scope.init = function () {
        $scope.HealthPhysicalObj = angular.copy($scope.GetHealthPreAdmAnesthetistObj());
        $scope.RosObject.IsRosSummaryView = false;
        //$scope.GetPreOpPostopcallCheckListTemplates();
        var req1 = {
            "HospitalId": $scope.HospitalId,
            "PageSize": 30,
            "PageNumber": 1,
            "UserId": doctorinfo.doctorid,
            "IsFrequent": "Y"

        };
        let req2 = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": $scope.appointmentInfo.AppointmentID || 0,
            "PatientId": $scope.appointmentInfo.PatientID || 0,
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

                if ($scope.ROSAllergyReactions.length > 0) {
                    angular.forEach($scope.ROSAllergyReactions, function (item) {
                        item.Ischecked = false;
                    });
                }

                angular.forEach($scope.ROSAllergySeverity, function (item) {
                    if (item.ROSAllergySeverityId !== 2 && item.ROSAllergySeverityId !== 4 && item.ROSAllergySeverityId !== 6 && item.ROSAllergySeverityId !== 7) {
                        $scope.ROSocularSeverity.push(item);
                    }
                });

                $scope.MasterSmokingStatus = resp[1].data.SmokingStatus || [];
                $scope.MasterAlcoholStatus = resp[1].data.AlcoholStatus || [];
                // $scope.HealthPhysicalObj.AlcoholStatus = resp[1].data.AlcoholStatus || [];
                $scope.HealthPhysicalObj.AlcoholQuantity = resp[1].data.AlcoholQuantity || [];
                //  $scope.HealthPhysicalObj.SmokingStatus = resp[1].data.SmokingStatus || [];
                $scope.HealthPhysicalObj.SmokingQuantity = resp[1].data.SmokingQuantity || [];
                $scope.HealthPhysicalObj.DrugNames = resp[1].data.DrugNames || [];
                if ($scope.HealthPhysicalObj.DrugNames.length > 0) {
                    angular.forEach($scope.HealthPhysicalObj.DrugNames, function (item) {
                        item.Ischecked = false;
                    });
                }

                $scope.HealthPhysicalObj.DrugQuantity = resp[1].data.DrugQuantity || [];
                //$scope.HealthPhysicalObj.LifestyleHistory.Smokinglist = resp[1].data.SmokingStatus || [];
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
                    //$scope.PreOpCallObj.BillingInstructionsCallChecklist = [];
                    //$scope.PreOpCallObj.BillingInstructionsCallChecklist = resp[2].data.BillingInstructionsCallChecklist || [];
                    //$scope.PreOpCallObj.BillingInstructionsCallChecklist.forEach(item => {
                    //    item.Ischecked = false;
                    //    item.DeleteInd = 'N';
                    //    item.BillingAmout = null;
                    //    item.AppointmentPreOpPostOpCallDetailId = 0;
                    //});
                    //if ($scope.PreOpCallDetailsList.length > 0) {
                    //    $scope.PreopsummaryView($scope.PreOpCallDetailsList[0]);
                    //}
                }
                if (resp[2].data.GeneralInstructionsCallChecklist.length > 0) {
                    //$scope.PreOpCallObj.GeneralInstructionsCallChecklist = [];
                    //$scope.PreOpCallObj.GeneralInstructionsCallChecklist = resp[2].data.GeneralInstructionsCallChecklist || [];

                    //$scope.PreOpCallObj.GeneralInstructionsCallChecklist.forEach(item => {
                    //    item.Ischecked = false;
                    //    item.DeleteInd = 'N';
                    //    item.AppointmentPreOpPostOpCallDetailId = 0;
                    //});

                    //if ($scope.PreOpCallDetailsList.length > 0) {
                    //    $scope.PreopsummaryView($scope.PreOpCallDetailsList[0]);
                    //}
                }
            }
            if (resp[3].data.Status === "Success") {

                $scope.FrequentlyAllergyitems = resp[3].data.Allergyitems || [];
                $scope.FrequentlySurgicalHistory = resp[3].data.SurgicalHistory || [];
                $scope.FrequentlySystemicHistory = resp[3].data.SystemicHistory || [];
                $scope.FrequentMedicationsList = resp[3].data.OrganizationFavoriteMedications || [];

                angular.forEach($scope.FrequentlyAllergyitems, function (item) {
                    item.Onselect = false;
                });
                angular.forEach($scope.FrequentlySurgicalHistory, function (item) {
                    item.Onselect = false;
                });
                angular.forEach($scope.FrequentlySystemicHistory, function (item) {
                    item.Onselect = false;
                });
                angular.forEach($scope.FrequentMedicationsList, function (item) {
                    item.IsChecked = false;
                });

                if ($scope.obj.AllergyItems.length > 0) {
                    angular.forEach($scope.obj.AllergyItems, function (item) {
                        var FreqList = $filter("filter")($scope.FrequentlyAllergyitems, function (fitem) {
                            return fitem.AllergyId == item.AllergyId;
                        }, true) || [];
                        if (FreqList.length > 0) {
                            FreqList[0].Onselect = true;
                        }
                    });
                }

                if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
                    angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (suitem) {
                        var matchingItem1 = $scope.FrequentMedicationsList.find(function (frequentItem) {
                            return frequentItem.MedicineId === suitem.MedicineId;
                        });
                        matchingItem1 = matchingItem1 || "";
                        if (matchingItem1 != "") {
                            matchingItem1.IsChecked = true;
                        }
                    });
                }
            }
            if (resp[4].data.status === "Success") {
                $scope.obj.AllergyItems = angular.copy(resp[4].data.AllergyItems);

                if ($scope.obj.AllergyItems.length > 0) {
                    let NList = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
                        fitem.AllergyId = fitem.AllergyId || null;
                        return fitem.AllergyId === 1 && fitem.DeleteInd == 'N';
                    }, true);
                    if (NList.length > 0) {
                        $scope.AllergyStatus.ShowNoKnownAllergy = true;
                    } else {
                        $scope.AllergyStatus.ShowNoKnownAllergy = false;
                    }
                }

                if ($scope.obj.AllergyItems.length > 0) {
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

                        if (Titem.AllergyId === 2) {
                            Titem.IsNKDAshow = false;
                        } else {
                            Titem.IsNKDAshow = true;
                        }
                    })
                }              
                $scope.LogObj.AllergyItems = angular.copy($scope.obj.AllergyItems);
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
                    Titem.ModifierObj = $filter("filter")($scope.ROSModifiers, function (iterator, ind) { return iterator.MODIFIERID === Titem.ModifierId; })[0] || "";
                })
                $scope.LogObj.SurgicalHistory = angular.copy($scope.obj.SurgicalHistoryArray);
                $scope.obj.CurrentEyeMedicationArray = angular.copy(resp[4].data.CurrentEyeMedicationList) || [];
                $scope.obj.LifestyleDetail = angular.copy(resp[4].data.LifestyleDetail);
                $scope.HealthPhysicalObj.LifestyleHistoryArray = angular.copy(resp[4].data.LifestyleDetail);
                $scope.obj.LifestyleHistoryRemarks = resp[4].data.LifestyleHistoryRemarks || '';
                // $scope.HealthPhysicalObj.LifestyleHistory = angular.copy(resp[4].data.LifestyleDetail);
                $scope.RosObject.IsRosSummaryView = false;
                if (!$scope.IsPreOpnSaveNameEditModeInd) {
                    if ($scope.obj.AllergyItems.length > 0 || $scope.obj.SystemicHistory.length > 0 || $scope.obj.SurgicalHistoryArray.length > 0 || $scope.obj.CurrentSystemicMedicationsHistory.length > 0
                        || $scope.obj.CurrentEyeMedicationArray.length > 0 || $scope.obj.LifestyleDetail.length > 0) {
                        $scope.RosObject.IsRosSummaryView = true;
                    } else {
                        $scope.RosObject.IsRosSummaryView = false;
                    }
                }
                
                if ($scope.HealthPhysicalObj.LifestyleHistoryArray.length > 0) {

                    angular.forEach($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {

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

                    var filterAllselect = $filter("filter")($scope.HealthPhysicalObj.DrugNames, { "Ischecked": true }, true) || [];

                    if (filterAllselect.length === $scope.HealthPhysicalObj.DrugNames.length) {
                        $scope.AllDrugListSelected = true;
                        $scope.DrugListSelectedText = "All Selected";
                    } else if (filterAllselect.length > 0) {
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

                    $scope.LogObj.LifestyleDetail = angular.copy($scope.HealthPhysicalObj.LifestyleHistoryArray);

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

                $scope.LogObj.CardiacNotes = resp[4].data.SystemicOtherData.CardiacNotes || "";
                $scope.LogObj.PulmonaryNotes = resp[4].data.SystemicOtherData.PulmonaryNotes || "";
                $scope.LogObj.NeurologicNotes = resp[4].data.SystemicOtherData.NeurologicNotes || "";
                $scope.LogObj.HepaticNotes = resp[4].data.SystemicOtherData.HepaticNotes || "";
                $scope.LogObj.HemeOncNotes = resp[4].data.SystemicOtherData.HemeOncNotes || "";
                $scope.LogObj.KidneyDiseaseNotes = resp[4].data.SystemicOtherData.KidneyDiseaseNotes || "";
                $scope.LogObj.MusculoSkeletalSystemNotes = resp[4].data.SystemicOtherData.MusculoSkeletalSystemNotes || "";
                $scope.LogObj.EndocrineNotes = resp[4].data.SystemicOtherData.EndocrineNotes || "";


                // frequently info
               
                if ($scope.obj.AllergyItems.length > 0) {
                    let NkaList = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
                        return fitem.AllergyId === 2 && fitem.DeleteInd == 'N';
                    }, true);
                    if (NkaList.length > 0) {
                        $scope.obj.isNKDASelected = true;
                    } else {
                        $scope.obj.isNKDASelected = false;
                    }
                }
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
                $scope.LogObj.SystemicHistory = angular.copy($scope.obj.SystemicHistory) || [];
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
                $scope.obj.CurrentSystemicMedicationsHistory = $scope.obj.CurrentSystemicMedicationsHistory || [];

                if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
                    angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (item) {
                        item.StartDate = $filter('date')(item.StartDate, "MM-dd-yyyy") || null;
                    });
                }

                let TempMedicationArray = [];
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
                    TempMedicationArray = angular.copy($scope.obj.CurrentSystemicMedicationsHistory);
                }

                let tempCurrentEyeMedicationsArray = $filter('filter')(TempMedicationArray, { 'MedicationLocationTypeId': 1 }, true) || [];
                let tempCurrentSystemicMedicationsArray = $filter('filter')(TempMedicationArray, { 'MedicationLocationTypeId': 2 }, true) || [];
                if (tempCurrentEyeMedicationsArray.length > 0) {
                    $scope.LogObj.CurrentEyeMedications = angular.copy(tempCurrentEyeMedicationsArray);
                }
                if (tempCurrentSystemicMedicationsArray.length > 0) {
                    $scope.LogObj.CurrentSystemicMedicationsHistory = angular.copy(tempCurrentSystemicMedicationsArray);
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
                $scope.LogObj.AllergyRemarks = resp[4].data.AllergyRemarks || '';

                if ($scope.obj.AllergyRemarks != '') {
                    $scope.obj.AllergyNotesInd = true;
                } else {
                    $scope.obj.AllergyNotesInd = false;
                }

                $scope.obj.SurgicalRemarks = resp[4].data.SurgicalRemarks || '';
                $scope.LogObj.SurgicalRemarks = resp[4].data.SurgicalRemarks || '';

                if ($scope.obj.SurgicalRemarks != '') {
                    $scope.obj.SurgicalNotesInd = true;
                } else {
                    $scope.obj.SurgicalNotesInd = false;
                }

                $scope.obj.CurrentSystemicRemarks = resp[4].data.CurrentSystemicRemarks || '';
                $scope.LogObj.CurrentSystemicRemarks = resp[4].data.CurrentSystemicRemarks || '';

                if ($scope.obj.CurrentSystemicRemarks != '') {
                    $scope.obj.CurrentSystemicNotesInd = true;
                } else {
                    $scope.obj.CurrentSystemicNotesInd = false;
                }

                $scope.obj.CurrentEyeRemarks = resp[4].data.CurrentEyeRemarks || '';
                $scope.LogObj.CurrentEyeRemarks = resp[4].data.CurrentEyeRemarks || '';

                if ($scope.obj.CurrentEyeRemarks != '') {
                    $scope.obj.CurrentEyeNotesInd = true;
                } else {
                    $scope.obj.CurrentEyeNotesInd = false;
                }
                $scope.obj.SystemicHistoryRemarks = resp[4].data.SystemicHistoryRemarks || '';
                $scope.LogObj.SystemicHistoryRemarks = resp[4].data.SystemicHistoryRemarks || '';

                if ($scope.obj.SystemicHistoryRemarks != '') {
                    $scope.obj.SystemicHistoryNotesInd = true;
                } else {
                    $scope.obj.SystemicHistoryNotesInd = false;
                }

                $scope.obj.LifestyleHistoryRemarks = resp[4].data.LifestyleHistoryRemarks || '';
                $scope.LogObj.LifestyleHistoryRemarks = resp[4].data.LifestyleHistoryRemarks || '';

                if ($scope.obj.LifestyleHistoryRemarks != '') {
                    $scope.obj.LifestyleHistoryNotesInd = true;
                } else {
                    $scope.obj.LifestyleHistoryNotesInd = false;
                }

                if ($scope.obj.AllergyItems && $scope.obj.AllergyItems.length > 0) {

                    angular.forEach($scope.obj.AllergyItems, function (allergy) {

                        allergy.SelectedReactionIds = {};

                        if (allergy.Reactions && allergy.Reactions.length > 0) {

                            angular.forEach(allergy.Reactions, function (reaction) {

                                if (reaction.DeleteInd == 'N') {
                                    allergy.SelectedReactionIds[reaction.ReactionId] = true;
                                }
                            });
                        }
                    });
                }

            }
            if (resp[5].data.status === "Success") {
                $scope.OrgPostOpChecklist = angular.copy(resp[5].data.rows);
            }
            if (resp[6].data.status === "Success") {
                if (resp[6].data.ROS.length > 0) {

                    $scope.ROSIsNormalArray = resp[6].data.ROS || [];
                }
            }

            //if ($scope.allUserList.length > 0) {
            //    $scope.PreopCallNurseReviewedByArray = [];
            //    $scope.PreopCallNurseReviewedByArray = $scope.allUserList.filter((x) => x.RoleId == 8);
            //}

        });
        $scope.initOrgLogo();
    }
    $scope.init();

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
    //$scope.onAllergySelect = function (object) {

    //    if ($scope.obj.isNKASelected) {
    //        angular.forEach($scope.obj.AllergyItems, function (item, nindex) {
    //            var List = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
    //                return fitem.AllergyId === 1;
    //            }, true);
    //            if (List.length > 0) {
    //                if (List[0].PatientDetailId === 0) {
    //                    var indexToRemove = $scope.obj.AllergyItems.indexOf(List[0]);
    //                    if (indexToRemove !== -1) {
    //                        $scope.obj.AllergyItems.splice(indexToRemove, 1);
    //                    }
    //                } else {
    //                    List[0].DeleteInd = 'Y';
    //                }
    //            }
    //            item.IsNKASelected = false
    //            $scope.obj.isNKASelected = false
    //        });

    //    }
    //    //if ($scope.obj.isNKDASelected) {
    //    //    angular.forEach($scope.obj.AllergyItems, function (item, ndindex) {
    //    //        var List = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
    //    //            return fitem.AllergyId === 2;
    //    //        }, true);
    //    //        if (List.length > 0) {
    //    //            if (List[0].PatientDetailId === 0) {
    //    //                var indexToRemove = $scope.obj.AllergyItems.indexOf(List[0]);
    //    //                if (indexToRemove !== -1) {
    //    //                    $scope.obj.AllergyItems.splice(indexToRemove, 1);
    //    //                }
    //    //            } else {
    //    //                List[0].DeleteInd = 'Y';
    //    //            }
    //    //        }
    //    //        item.IsNKDASelected = false
    //    //        $scope.obj.isNKDASelected = false
    //    //    });
    //    //}


    //    if (object.AllergyId === '') {
    //        object.AllergyName = '';
    //        return false;
    //    }
    //    var FreqList = $filter("filter")($scope.FrequentlyAllergyitems, function (fitem) {
    //        return fitem.AllergyId == object.AllergyId;
    //    }, true);
    //    if (FreqList.length > 0) {
    //        FreqList[0].Onselect = true;
    //    }
    //    $scope.obj.SelectedAllergyItem = object;
    //    $scope.obj.SelectedAllergyItem.showAllergieshistory = false;
    //    var i = 0;
    //    var obj = {
    //        "PatientDetailId": 0,
    //        "IsShowAllergySnomedAddInd": object.IsShowAllergySnomedAddInd || false,
    //        "AllergyId": object.AllergyId || null,
    //        "AllergyName": object.AllergyName || '',
    //        "OrganId": 4,
    //        "SeverityId": null,
    //        "SNOMEDId": null,
    //        "RxNormID": null,
    //        "SeverityName": '',
    //        "ReactionId": null,
    //        "StatusId": null,
    //        "Duration": null,
    //        "AllergyTypeId": null,
    //        "IsEdit": true,
    //        "ShowNote": true,
    //        "ShowDateFormat": true,
    //        "ReactionName": '',
    //        "DurationDate": '',
    //        "StatusName": '',
    //        "Remarks": '',
    //        "SnomedCode": '',
    //        "DurationType": 'D',
    //        "OnsetType": 'Date',
    //        "DiagnosisObject": 'D',
    //        "DeleteInd": 'N',
    //        "IsNKDAshow": true

    //    }
    //    //  $scope.obj.AllergyItems = $filter('filter')($scope.obj.AllergyItems, { 'DeleteInd': 'N' }, true)||[];
    //    if ($scope.obj.AllergyItems.length > 0) {
    //        angular.forEach($scope.obj.AllergyItems, function (item) {
    //            if (item.AllergyId === obj.AllergyId && item.DeleteInd == "N") {
    //                alertify.error('You have already entered this Allergy');
    //                i++;
    //            }
    //        });
    //    }
    //    if ($scope.obj.AllergyItems.length !== 0) {
    //        angular.forEach($scope.obj.AllergyItems, function (item) {
    //            item.IsEdit = false;
    //        });
    //    }


    //    if (i === 0) {
    //        $scope.obj.SelectedAllergyItem.PatientDetailId = 0;
    //        $scope.obj.SelectedAllergyItem.ModifiedBy = $scope.DisplayName;
    //        $scope.obj.SelectedAllergyItem.ModifiedDt = $filter('date')(new Date(), "yyyy-MM-dd");
    //        $scope.obj.SelectedAllergyItem.OrganId = $scope.obj.SelectedAllergyItemEye || 4;
    //        $scope.obj.SelectedAllergyItem.SeverityId = '';
    //        $scope.obj.SelectedAllergyItem.ReactionId = '';
    //        $scope.obj.SelectedAllergyItem.ReactionName = '';
    //        //  $scope.obj.SelectedAllergyItem.RcopiaAllergyId = null;
    //        $scope.obj.SelectedAllergyItem.StatusId = 1;
    //        $scope.obj.SelectedAllergyItem.StatusName = 'Active';
    //        $scope.obj.SelectedAllergyItem.AllergyTypeId = '';
    //        $scope.obj.SelectedAllergyItem.Duration = null;
    //        $scope.obj.SelectedAllergyItem.DurationDate = '';
    //        $scope.obj.SelectedAllergyItem.ShowDateFormat = true;
    //        $scope.obj.SelectedAllergyItem.Remarks = '';
    //        $scope.obj.SelectedAllergyItem.SnomedCode = '';
    //        $scope.obj.SelectedAllergyItem.DurationType = 'D';
    //        $scope.obj.SelectedAllergyItem.IsEdit = true;
    //        $scope.obj.SelectedAllergyItem.ShowNote = false;
    //        $scope.obj.SelectedAllergyItem.DiagnosisObject = "";
    //        $scope.obj.SelectedAllergyItem.DeleteInd = "N";
    //        $scope.obj.SelectedAllergyItem.IsNKDAshow = true;
    //        $scope.obj.SelectedAllergyItem.RxNormID = object.RxnormID || null;
    //        $scope.obj.AllergyItems.push($scope.obj.SelectedAllergyItem);
    //    }
    //    $scope.obj.SelectedAllergyItem = "";
    //    $scope.AllergyStatus.ShowNoKnownAllergy = false;

    //};

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
        var req = {
            "PatientId": $scope.cacheStorageItem.PatientID,
            "AllergyId": object.AllergyId,
            "OrganizationId": $scope.HospitalId,
            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID
        }
        eHnotePatientDataService.GetPatientSelectedAllergy(req).then(function (resp) {
            if (resp.data.Status == "Success") {
                if (resp.data.rows.length > 0) {
                    var selectedobj = resp.data.rows[0];


                    if (selectedobj.AllergyId === '') {
                        selectedobj.AllergyName = '';
                        return false;
                    }
                    var FreqList = $filter("filter")($scope.FrequentlyAllergyitems, function (fitem) {
                        return fitem.AllergyId == selectedobj.AllergyId;
                    }, true);
                    if (FreqList.length > 0) {
                        FreqList[0].Onselect = true;
                    }
                    $scope.obj.SelectedAllergyItem = selectedobj;
                    $scope.obj.SelectedAllergyItem.showAllergieshistory = false;
                    var i = 0;
                    var obj = {
                        "PatientDetailId": 0,
                        "IsShowAllergySnomedAddInd": selectedobj.IsShowAllergySnomedAddInd || false,
                        "AllergyId": selectedobj.AllergyId || null,
                        "AllergyName": selectedobj.AllergyName || '',
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
                        "IsNKDAshow": true,
                        "Reactions": [],
                        "SelectedReactionIds": {},
                        "ReactionListSelectedText": '',
                        "ReactionSearch": ''

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
                        $scope.obj.SelectedAllergyItem.IsNKDAshow = true;
                        $scope.obj.SelectedAllergyItem.RxNormID = selectedobj.RxnormID || null;
                        $scope.obj.AllergyItems.push($scope.obj.SelectedAllergyItem);
                    }
                    $scope.obj.SelectedAllergyItem = "";
                    $scope.AllergyStatus.ShowNoKnownAllergy = false;

                }
                else {
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
                        "IsNKDAshow": true,
                        "Reactions": [],
                        "SelectedReactionIds": {},
                        "ReactionListSelectedText": '',
                        "ReactionSearch": ''

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
                        $scope.obj.SelectedAllergyItem.IsNKDAshow = true;
                        $scope.obj.SelectedAllergyItem.RxNormID = object.RxnormID || null;
                        $scope.obj.AllergyItems.push($scope.obj.SelectedAllergyItem);
                    }
                    $scope.obj.SelectedAllergyItem = "";

                    $scope.AllergyStatus.ShowNoKnownAllergy = false;
                }
            }
        });
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

        //if ($scope.obj.isNKDASelected) {
        //    angular.forEach($scope.obj.AllergyItems, function (item, ndindex) {
        //        var List = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
        //            return fitem.AllergyId === 2;
        //        }, true);
        //        if (List.length > 0) {
        //            if (List[0].PatientDetailId === 0) {
        //                var indexToRemove = $scope.obj.AllergyItems.indexOf(List[0]);
        //                if (indexToRemove !== -1) {
        //                    $scope.obj.AllergyItems.splice(indexToRemove, 1);
        //                }
        //            } else {
        //                List[0].DeleteInd = 'Y';
        //            }
        //        }
        //        item.IsNKDASelected = false
        //        $scope.obj.isNKDASelected = false
        //    });
        //}

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
            "OnsetDate": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
            "PatientId": $scope.cacheStorageItem.PatientID,
           
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

                    var FreqList = $filter("filter")($scope.FrequentlyAllergyitems, function (fitem) {
                        return fitem.AllergyId == $scope.obj.SelectedAllergyItem.AllergyId;
                    }, true);
                    FreqList = FreqList || [];
                    if (FreqList.length > 0) {
                        FreqList[0].Onselect = true;
                        var IsFrequent = FreqList[0].IsFrequent || 'N';
                    }
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
                        "IsFrequent": IsFrequent || "N",
                        "IsNKDAshow": true,
                        "PatientRcopiaAllergyId": selectedobj.PatientRcopiaAllergyId || "",
                        "Reactions": [],
                        "SelectedReactionIds": {},
                        "ReactionListSelectedText": '',
                        "ReactionSearch": ''
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
                        $scope.obj.SelectedAllergyItem.IsNKDAshow = true;
                        $scope.obj.SelectedAllergyItem.IsFrequent = IsFrequent || 'N';
                        $scope.obj.SelectedAllergyItem.RxNormID = selectedobj.RxnormID || null;
                        $scope.obj.AllergyItems.push($scope.obj.SelectedAllergyItem);
                    }
                    $scope.obj.SelectedAllergyItem = "";
                    $scope.AllergyStatus.ShowNoKnownAllergy = false;

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

        if (Aitem.AllergyId == 2) {
            if (Aitem.PatientDetailId == 0) {
                if (index > -1) {
                    $scope.obj.AllergyItems.splice(index, 1);
                    $scope.obj.isNKDASelected = false;
                }
            } else {
                $scope.obj.AllergyItems[index].DeleteInd = 'Y';
                $scope.obj.isNKDASelected = false;
            }
        } else {

            if (Aitem.PatientDetailId == 0) {
                if (index > -1) {
                    $scope.obj.AllergyItems.splice(index, 1);
                }
            } else {
                $scope.obj.AllergyItems[index].DeleteInd = 'Y';
            }
        }
        var activeItems = $scope.obj.AllergyItems.filter(function (item) {
            return item.DeleteInd !== 'Y';
        });

        if (activeItems.length === 0) {
            $scope.AllergyStatus.ShowNoKnownAllergy = true;
        } else if (activeItems.length === 1 && activeItems[0].AllergyId == 2) {
            // Only NKDA is selected
            $scope.AllergyStatus.ShowNoKnownAllergy = true;
        } else {
            $scope.AllergyStatus.ShowNoKnownAllergy = false;
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
           
                if ($scope.obj.isNKDASelected) {
                    $scope.obj.isNKASelected = false;
                    //$scope.ROSHistoriesObj.IsRcopia = false;
                    //var NkdaArray = [];
                    angular.forEach($scope.obj.AllergyItems, function (item) {
                        if (item.AllergyId == 1) {
                            item.DeleteInd = 'Y';
                           // NkdaArray.push(item);
                        }
                    });
                    //if (NkdaArray.length > 0) {
                    //    $scope.obj.AllergyItems = angular.copy(NkdaArray);
                    //}
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
                            "IsNKDAshow": false
                        }
                        $scope.obj.AllergyItems.push(obj);
                    }
                    //angular.forEach($scope.FrequentlyAllergyitems, function (item) {
                    //    item.Onselect = false;
                    //});
                } else {
                    $scope.obj.isNKDASelected = false;
                    $scope.obj.SelectedAllergyItem = '';
                    $scope.obj.AllergyItems = [];
                    //angular.forEach($scope.FrequentlyAllergyitems, function (item) {
                    //    item.Onselect = false;
                    //});
                }
               
           
        } else {
            if ($scope.obj.isNKDASelected) {
                $scope.obj.isNKASelected = false;
                //$scope.ROSHistoriesObj.IsRcopia = false;
                //var NkdaArray = [];
                angular.forEach($scope.obj.AllergyItems, function (item) {
                    if (item.AllergyId == 1) {
                        item.DeleteInd = 'Y';
                        //NkdaArray.push(item);
                    }
                });
                //if (NkdaArray.length > 0) {
                //   // $scope.obj.AllergyItems = angular.copy(NkdaArray);
                //}
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
                        "IsNKDAshow": false
                    }
                    $scope.obj.AllergyItems.push(obj);
                }
                //angular.forEach($scope.FrequentlyAllergyitems, function (item) {
                //    item.Onselect = false;
                //});
            } else {
                $scope.cacheStorageItem.isNKDASelected = false;
                $scope.obj.SelectedAllergyItem = '';
                $scope.obj.AllergyItems = [];
                //angular.forEach($scope.FrequentlyAllergyitems, function (item) {
                //    item.Onselect = false;
                //});
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
    $scope.GetOrganizationMedicationlist = function (val,Id) {

        var req = {
            "HospitalId": $scope.HospitalId,
            "PageSize": 10,
            "SearchText": val || '',
            "PageNumber": 1,
            "UserId": $scope.UserId,
            "IsFrequent": "N",
            "ParentOrganizationId": $scope.ParentHospitalId || null
        };
        if (req.SearchKey == "") {
            req.IsFrequent = "Y";
        }

        return eHnoteConditionsDataService.GetOrganizationMedications(req).then(function (resp) {
            if (resp.data.MedicineList.length > 0 ) {

                Id = Id || null;
                if (Id != null) {
                    var list1 = [];
                    angular.forEach(resp.data.MedicineList, function (item) {
                        if (item.MedicationLocationTypeId == Id || item.MedicationLocationTypeId == null || item.MedTypeId == null) {
                            list1.push(item);
                        }
                    });
                    return list1.map(function (item) {
                        return item;

                    });
                } else {
                    if (resp.data.MedicineList !== undefined) {
                        return resp.data.MedicineList.map(function (item) {
                            return item;
                        });
                    }
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
            "windowClass": "examination-popover-popup overflow-hidden medicinorder-stop  ",
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

                    let TypeId = 9;
                    let TypeName = "PreOpCall";

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
                        if (mitem.MedicineObject && mitem.MedicineObject.Sig != undefined && mitem.MedicineObject.Sig != "") {
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

            $scope.cacheStorageItem.CurrentSystemicMedicationsHistory = $scope.cacheStorageItem.CurrentSystemicMedicationsHistory || [];
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

    $scope.addSIgNameDynamically = function () {
        let dosesupplytest = "";
        if ($scope.addNewOrganizationSigObj.DaysSupply !== '') {
            dosesupplytest = " for " + $scope.addNewOrganizationSigObj.DaysSupplyDescription;
        }
        $scope.addNewOrganizationSigObj.Sig = $scope.addNewOrganizationSigObj.Action + " " + $scope.addNewOrganizationSigObj.Dose + " " + $scope.addNewOrganizationSigObj.DoseUnit + " " + $scope.addNewOrganizationSigObj.Route + " " + $scope.addNewOrganizationSigObj.Frequency + " " + $scope.addNewOrganizationSigObj.DoseOther + "" + dosesupplytest;
    }

    $scope.changePopupPrescAction = function (mainobj) {
        var filteredArray = $filter("filter")($scope.ActionArray, { "MedicineDosaageFieldId": mainobj.ActionId }, true);
        if (filteredArray.length > 0) {
            mainobj.Action = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescDose = function (mainobj) {
        var filteredArray = $filter("filter")($scope.DoseArray, { "MedicineDosaageFieldId": mainobj.DoseId }, true);
        if (filteredArray.length > 0) {
            mainobj.Dose = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescDoseUnit = function (mainobj) {
        var filteredArray = $filter("filter")($scope.DoseUnitArray, { "MedicineDosaageFieldId": mainobj.DoseUnitId }, true);
        if (filteredArray.length > 0) {
            mainobj.DoseUnit = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescRoute = function (mainobj) {
        var filteredArray = $filter("filter")($scope.RouteArray, { "MedicineDosaageFieldId": mainobj.RouteId }, true);
        if (filteredArray.length > 0) {
            mainobj.Route = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescFrequency = function (mainobj) {
        var filteredArray = $filter("filter")($scope.FrequencyArray, { "MedicineDosaageFieldId": mainobj.FrequencyId }, true);
        if (filteredArray.length > 0) {
            mainobj.Frequency = filteredArray[0].Description;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescDoseOther = function (mainobj) {
        var filteredArray = $filter("filter")($scope.DoseOtherArray, { "MedicineDosaageFieldId": mainobj.DoseOtherId }, true);
        if (filteredArray.length > 0) {
            mainobj.DoseOther = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescDaysSupply = function (mainobj) {
        var filteredArray = $filter("filter")($scope.DurationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
        if (filteredArray.length > 0) {

            mainobj.DaysSupply = filteredArray[0].Code;
            mainobj.DaysSupplyDescription = filteredArray[0].Description;
        };
        $scope.addSIgNameDynamically();
    };

    $scope.changePopupPrescQuantityUnit = function (mainobj) {
        var filteredArray = $filter("filter")($scope.QuantityUnitArray, { "MedicineDosaageFieldId": mainobj.QuantityUnitId }, true);
        if (filteredArray.length > 0) {
            mainobj.QuantityUnit = filteredArray[0].Code;
        };
    };

    $scope.changePopupPrescRefill = function (mainobj) {
        var filteredArray = $filter("filter")($scope.RefillsArray, { "MedicineDosaageFieldId": mainobj.RefillId }, true);
        if (filteredArray.length > 0) {
            mainobj.Refills = filteredArray[0].Code;
        };
    };


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
                let dosesupplytest = "";

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
                let dosesupplytest = "";

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
        if (MedId != undefined) {
            medicationhistory = MedId == 1 ? "CurrentEyeMedication" : "CurrentSystemicMedication";
            locationtype = MedId == 1 ? "Eye" : "General";
        } else {
            medicationhistory = $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.MedicationLocationTypeId == 1 ? "CurrentEyeMedication" : "CurrentSystemicMedication";
            locationtype = $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.MedicationLocationTypeId == 1 ? "Eye" : "General";
            MedId = $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.MedicationLocationTypeId;
            $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.GenericName = $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.DrugGenericName;
            $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.Strength = $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.DrugStrength;

        }



        var MedFreqList = $filter("filter")($scope.FrequentMedicationsList, function (fitem) {
            return fitem.MedicineId == $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.MedicineId;
        }, true);
        MedFreqList = MedFreqList || [];
        if (MedFreqList.length > 0) {
            MedFreqList[0].IsChecked = true;
            var IsFrequent = MedFreqList[0].IsFrequent || 'N';
        }

        if (angular.isObject($scope.obj.SelectedCurrentSystemicMedicationsHistoryItem)) {
            var object = {
                "CurrentSystemicMedicationId": 0,
                "HospitalId": $scope.HospitalId,
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
                "RXNormId": 0,
                "IsMedicationStopped": false,
                "SelectedMedicationHistory": medicationhistory,
                "LastUsedDate": null,
                "MedicationStopDate": null,
                "MedicationStopRemarks": "",
                "MedicationResumeDate": null,
                "MedicationResumeRemarks": "",
                "MedicationLocationType": locationtype,
                "MedicationLocationTypeId": MedId,
                "IsRosMedication": false,
                "IsFrequent": IsFrequent || 'N',
                "FavoriteMedicationId": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.FavoriteMedicationId
            };
            $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.RxNormList = $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.RxNormList || [];
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
                "HospitalId": $scope.HospitalId,
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
                "LastUsedDate": null,
                "MedicationStopDate": null,
                "MedicationStopRemarks": "",
                "MedicationResumeDate": null,
                "MedicationResumeRemarks": "",
                "MedicationLocationType": locationtype,
                "MedicationLocationTypeId": MedId,
                "IsRosMedication": false,

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

                var MedFreqList = $filter("filter")($scope.FrequentMedicationsList, function (fitem) {
                    return fitem.MedicineId == object.MedicineId;
                }, true);
                MedFreqList = MedFreqList || [];
                if (MedFreqList.length > 0) {
                    MedFreqList[0].IsChecked = true;
                    var IsFrequent = MedFreqList[0].IsFrequent;
                }

                object.IsFrequent = IsFrequent || 'N';

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

        let MedSystemiclist = $filter('filter')($scope.obj.CurrentSystemicMedicationsHistory, { 'DeleteInd': 'N' }, true) || [];
        if (MedSystemiclist.length == 0) {
            $scope.obj.ReconcileMedicationSummaryView = true;
        }




        var MedFreqList = $filter("filter")($scope.FrequentMedicationsList, function (fitem) {
            return fitem.MedicineId == item.MedicineId;
        }, true) || [];
        if (MedFreqList.length > 0) {
            MedFreqList[0].IsChecked = false;
        }



    }
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
            item.DurationDate = null;
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

    $scope.ChangeSmokingValue = function (value, item) {
        if (value == 1) {
            if (item.SmokingType == "" || item.SmokingType == "No") {
                item.SmokingType = "Yes";
            } else {
                item.SmokingType = '';
            }

        } else if (value == 2) {
            if (item.SmokingType == "" || item.SmokingType == "Yes") {
                item.SmokingType = "No";
            } else {
                item.SmokingType = '';
            }
        }

        var TempSmokingArray = $filter('filter')($scope.HealthPhysicalObj.LifestyleHistoryArray, { 'HistoryId': 1 }, true);

        if (item.SmokingType !== '') {
            if (TempSmokingArray.length == 0) {
                var Object = {
                    "PatientDetailId": 0,
                    "DeleteInd": "N",
                    "ActiveInd": "Y",
                    "Remarks": "",
                    "ShowNote": false,
                    "HistoryId": 1,
                    "HistoryName": "Smoking",
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
                    "SmokingFromDate": null,
                    "SmokingToDate": "",
                    "SmokingType": item.SmokingType || "",
                }
                $scope.HealthPhysicalObj.LifestyleHistoryArray.push(Object);
            } else {
                angular.forEach($scope.HealthPhysicalObj.LifestyleHistoryArray, function (Sitem) {
                    if (Sitem.HistoryId == 1) {
                        Sitem.SmokingType = item.SmokingType || '';
                        Sitem.DeleteInd = 'N';
                        if (Sitem.SmokingType == 'Yes') {
                            Sitem.SmokingStatusId = 0;
                            Sitem.SmokingStatusName = '';
                            Sitem.SmokingFromDate = null;
                            Sitem.SmokingQuantityId = 0;
                            Sitem.SmokingQuantityName = '';
                            Sitem.SmokingDuration = '';
                            Sitem.SmokingDurationType = 'D';
                            Sitem.SmokingDurationTypeName = "Day(s)";
                        } else if (Sitem.SmokingType == 'No') {
                            Sitem.SmokingStatusId = 0;
                            Sitem.SmokingStatusName = '';
                            Sitem.SmokingFromDate = null;
                            Sitem.SmokingQuantityId = 0;
                            Sitem.SmokingQuantityName = '';
                            Sitem.SmokingDuration = '';
                            Sitem.SmokingDurationType = 'D';
                            Sitem.SmokingDurationTypeName = "Day(s)";
                        }
                    }
                });
            }
        } else {
            if ($scope.HealthPhysicalObj.LifestyleHistoryArray.length > 0) {
                angular.forEach($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
                    if (item.HistoryId == 1 && item.PatientDetailId !== 0) {
                        item.DeleteInd = 'Y';
                    } else {
                        if (item.HistoryId == 1) {
                            var removeindex = $scope.HealthPhysicalObj.LifestyleHistoryArray.indexOf(item);
                            if (removeindex > -1) {
                                $scope.HealthPhysicalObj.LifestyleHistoryArray.splice(removeindex, 1);
                            }
                        }
                    }
                });
            }
        }
    };

    $scope.ChangeAlcoholValue = function (value, item) {
        if (value == 1) {
            if (item.AlcoholType == "" || item.AlcoholType == "No") {
                item.AlcoholType = "Yes";
            } else {
                item.AlcoholType = '';
            }

        } else if (value == 2) {
            if (item.AlcoholType == "" || item.AlcoholType == "Yes") {
                item.AlcoholType = "No";
            } else {
                item.AlcoholType = '';
            }
        }

        var TempAlcoholArray = $filter('filter')($scope.HealthPhysicalObj.LifestyleHistoryArray, { 'HistoryId': 2 }, true);

        if (item.AlcoholType !== '') {
            if (TempAlcoholArray.length == 0) {
                var Object = {
                    "PatientDetailId": 0,
                    "DeleteInd": "N",
                    "ActiveInd": "Y",
                    "HistoryId": 2,
                    "HistoryName": "Alcohol",
                    "AlcoholHistoryId": 0,
                    "AlcoholQuantityId": 0,
                    "AlcoholQuantityName": "",
                    "AlcoholStatusId": 0,
                    "AlcoholStatusName": "",
                    "AlcoholDuration": "",
                    "AlcoholDurationType": "D",
                    "AlcoholDurationDate": null,
                    "AlcoShowDateFormat": true,
                    "AlcoholType": item.AlcoholType || "",
                    "Remarks": "",
                    "ShowNote": false,
                }
                $scope.HealthPhysicalObj.LifestyleHistoryArray.push(Object);
            } else {
                angular.forEach($scope.HealthPhysicalObj.LifestyleHistoryArray, function (Aitem) {
                    if (Aitem.HistoryId == 2) {
                        Aitem.AlcoholType = item.AlcoholType || '';
                        Aitem.DeleteInd = 'N';
                        if (Aitem.AlcoholType == 'Yes') {
                            Aitem.AlcoholStatusId = 0;
                            Aitem.AlcoholStatusName = '';
                            Aitem.AlcoholDuration = '';
                            Aitem.AlcoholDurationType = 'D';
                            Aitem.AlcoholDurationDate = null;
                            Aitem.AlcoholQuantityId = 0;
                            Aitem.AlcoholQuantityName = '';

                        } else if (Aitem.AlcoholType == 'No') {
                            Aitem.AlcoholStatusId = 0;
                            Aitem.AlcoholStatusName = '';
                            Aitem.AlcoholDuration = '';
                            Aitem.AlcoholDurationType = 'D';
                            Aitem.AlcoholDurationDate = null;
                            Aitem.AlcoholQuantityId = 0;
                            Aitem.AlcoholQuantityName = '';
                        }
                    }
                });
            }
        } else {
            item.AlcoholType = "";
            if ($scope.HealthPhysicalObj.LifestyleHistoryArray.length > 0) {
                angular.forEach($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
                    if (item.HistoryId == 2 && item.PatientDetailId !== 0) {
                        item.DeleteInd = 'Y';
                    } else {
                        if (item.HistoryId == 2) {
                            var removeindex = $scope.HealthPhysicalObj.LifestyleHistoryArray.indexOf(item);
                            if (removeindex > -1) {
                                $scope.HealthPhysicalObj.LifestyleHistoryArray.splice(removeindex, 1);
                            }
                        }
                    }
                });
            }
        }
    };

    $scope.ChangeDrugValue = function (value, item) {
        if (value == 1) {
            if (item.DrugType == "" || item.DrugType == "No") {
                item.DrugType = "Yes";
            } else {
                item.DrugType = '';
            }

        } else if (value == 2) {
            if (item.DrugType == "" || item.DrugType == "Yes") {
                item.DrugType = "No";
            } else {
                item.DrugType = '';
            }
        }

        var TempDrugArray = $filter('filter')($scope.HealthPhysicalObj.LifestyleHistoryArray, { 'HistoryId': 3 }, true);

        if (item.DrugType !== '') {
            if (TempDrugArray.length == 0) {
                var Object = {
                    "PatientDetailId": 0,
                    "DeleteInd": "N",
                    "ActiveInd": "Y",
                    "Remarks": "",
                    "ShowNote": false,
                    "HistoryId": 3,
                    "HistoryName": "Drug",
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
                    "DrugShowDateFormat": true,
                    "DrugType": item.DrugType || "",
                }
                $scope.HealthPhysicalObj.LifestyleHistoryArray.push(Object);
            } else {
                angular.forEach($scope.HealthPhysicalObj.LifestyleHistoryArray, function (Ditem) {
                    if (Ditem.HistoryId == 3) {
                        Ditem.DrugType = item.DrugType || '';
                        Ditem.DeleteInd = 'N';

                        if (Ditem.DrugType == 'Yes') {
                            Ditem.DrugDurationDate = '';
                            Ditem.DrugDuration = '';
                            Ditem.DrugDurationType = 'D';
                            Ditem.DrugDurationTypeName = 'Day(s)';
                            Ditem.DrugQuantityId = 0;
                            Ditem.DrugQuantityName = '';
                            Ditem.DrugArray = Ditem.DrugArray || [];

                            if (Ditem.DrugArray.length > 0) {
                                angular.forEach(Ditem.DrugArray, function (Nitem) {
                                    Nitem.Ischecked = false;
                                    Nitem.DrugHistoryId = Nitem.DrugHistoryId || '';
                                    if (Nitem.DrugHistoryId !== 0) {
                                        Nitem.ActiveInd = "N";
                                    }
                                });
                            }

                        } else if (Ditem.DrugType == 'No') {

                            Ditem.DrugDurationDate = '';
                            Ditem.DrugDuration = '';
                            Ditem.DrugDurationType = 'D';
                            Ditem.DrugDurationTypeName = 'Day(s)';
                            Ditem.DrugQuantityId = 0;
                            Ditem.DrugQuantityName = '';
                            Ditem.DrugArray = Ditem.DrugArray || [];

                            if (Ditem.DrugArray.length > 0) {
                                angular.forEach(Ditem.DrugArray, function (Nitem) {
                                    Nitem.Ischecked = false;
                                    Nitem.DrugHistoryId = Nitem.DrugHistoryId || '';
                                    if (Nitem.DrugHistoryId !== 0) {
                                        Nitem.ActiveInd = "N";
                                    }
                                });
                            }
                            if ($scope.HealthPhysicalObj.DrugNames.length > 0) {
                                angular.forEach($scope.HealthPhysicalObj.DrugNames, function (item) {
                                    item.Ischecked = false;
                                });
                            }
                        }
                    }
                });
            }
        } else {
            item.DrugType = "";
            if ($scope.HealthPhysicalObj.DrugNames.length > 0) {
                angular.forEach($scope.HealthPhysicalObj.DrugNames, function (item) {
                    item.Ischecked = false;
                });
            }
            if ($scope.HealthPhysicalObj.LifestyleHistoryArray.length > 0) {
                angular.forEach($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
                    if (item.HistoryId == 3 && item.PatientDetailId !== 0) {
                        item.DeleteInd = 'Y';
                        item.DrugArray = item.DrugArray || [];
                        if (item.DrugArray.length > 0) {
                            angular.forEach(item.DrugArray, function (Nitem) {
                                Nitem.Ischecked = false;
                                Nitem.DrugHistoryId = Nitem.DrugHistoryId || '';
                                if (Nitem.DrugHistoryId !== 0) {
                                    Nitem.ActiveInd = "N";
                                }
                            });
                        };

                    } else {
                        if (item.HistoryId == 3) {
                            var removeindex = $scope.HealthPhysicalObj.LifestyleHistoryArray.indexOf(item);
                            if (removeindex > -1) {
                                $scope.HealthPhysicalObj.LifestyleHistoryArray.splice(removeindex, 1);
                            }

                            item.DrugArray = item.DrugArray || [];
                            if (item.DrugArray.length > 0) {
                                angular.forEach(item.DrugArray, function (Nitem) {
                                    Nitem.Ischecked = false;
                                });
                            };
                        }
                    }
                });
            }
        }
    };

    $scope.ChangePsychis = function (value, item) {
        if (value == 1) {
            if (item.PsychisType == "" || item.PsychisType == "No") {
                item.PsychisType = "Yes";
            } else {
                item.PsychisType = '';
            }

        } else if (value == 2) {
            if (item.PsychisType == "" || item.PsychisType == "Yes") {
                item.PsychisType = "No";
            } else {
                item.PsychisType = '';
            }
        }

        var TempPsychisArray = $filter('filter')($scope.HealthPhysicalObj.LifestyleHistoryArray, { 'HistoryId': 4 }, true);

        if (item.PsychisType !== '') {
            if (TempPsychisArray.length == 0) {
                var Object = {
                    "PatientDetailId": 0,
                    "DeleteInd": "N",
                    "ActiveInd": "Y",
                    "Remarks": "",
                    "ShowNote": false,
                    "HistoryId": 4,
                    "HistoryName": "Psychis",
                    "PsychisType": item.PsychisType || "",
                    "Remarks": "",
                    "ShowNote": false,
                    "PsychisShowDateFormat": true,
                };
                $scope.HealthPhysicalObj.LifestyleHistoryArray.push(Object);
            } else {
                angular.forEach($scope.HealthPhysicalObj.LifestyleHistoryArray, function (Pitem) {
                    if (Pitem.HistoryId == 4) {
                        Pitem.PsychisType = item.PsychisType || '';
                        Pitem.DeleteInd = 'N';
                    }
                });
            }
        } else {
            item.PsychisType = "";
            if ($scope.HealthPhysicalObj.LifestyleHistoryArray.length > 0) {
                angular.forEach($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
                    if (item.HistoryId == 4 && item.PatientDetailId !== 0) {
                        item.DeleteInd = 'Y';
                    } else {
                        if (item.HistoryId == 4) {
                            var removeindex = $scope.HealthPhysicalObj.LifestyleHistoryArray.indexOf(item);
                            if (removeindex > -1) {
                                $scope.HealthPhysicalObj.LifestyleHistoryArray.splice(removeindex, 1);
                            }
                        }
                    }
                });
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


    $scope.ChangeDrugItemselect = function (item, checked) {

        item.ActiveInd = 'Y';
        var drugObj = $scope.HealthPhysicalObj.LifestyleHistoryArray.find(function (historyItem) {
            return historyItem.HistoryId === 3 && historyItem.DeleteInd == 'N';
        });

        if (checked) {

            if (drugObj.DrugArray.length > 0) {
                var statusfilter = $filter("filter")(drugObj.DrugArray, { "HistoryHabitsId": item.HistoryHabitsID }, true) || [];
                if (statusfilter.length > 0) {

                    angular.forEach(drugObj.DrugArray, function (ditem) {
                        if (item.HistoryHabitsID == ditem.HistoryHabitsId) {
                            ditem.ActiveInd = "Y";
                        }
                    });
                } else {

                    var newObj = {
                        "DrugHistoryId": 0,
                        "ActiveInd": "Y",
                        "HabitsDescription": item.HabitsDescription,
                        "HistoryHabitsId": item.HistoryHabitsID,
                        "HabitsId": item.HabitsId
                    };
                    drugObj.DrugArray.push(newObj);
                }
            } else {

                var newObj = {
                    "DrugHistoryId": 0,
                    "ActiveInd": "Y",
                    "HabitsDescription": item.HabitsDescription,
                    "HistoryHabitsId": item.HistoryHabitsID,
                    "HabitsId": item.HabitsId
                };
                drugObj.DrugArray.push(newObj);
            }
        } else {

            if (drugObj.DrugArray.length > 0) {
                var statusfilter = $filter("filter")(drugObj.DrugArray, { "HistoryHabitsId": item.HistoryHabitsID }, true) || [];
                if (statusfilter.length > 0) {

                    angular.forEach(drugObj.DrugArray, function (ditem, index) {
                        if (item.HistoryHabitsID == ditem.HistoryHabitsId) {
                            if (ditem.DrugHistoryId != 0) {
                                ditem.ActiveInd = "N";
                            } else {

                                drugObj.DrugArray.splice(index, 1);
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
        } else if (filterAllselect.length > 0) {
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

        console.log("Final DrugArray:", JSON.stringify(drugObj.DrugArray));
    };
    $scope.ChangeAllDrugSelect = function (checked) {
        // 1. Get Drug Object from LifestyleHistoryArray where HistoryId = 3
        var drugObj = $scope.HealthPhysicalObj.LifestyleHistoryArray.find(function (item) {
            return item.HistoryId === 3 && item.DeleteInd == 'N';
        });

        // 2. If drugObj not found, stop the function
        if (!drugObj) return;

        // 3. If checkbox is checked
        if (checked) {
            $scope.DrugListSelectedText = "All Selected";

            // Mark all DrugNames as checked and add/update in DrugArray
            angular.forEach($scope.HealthPhysicalObj.DrugNames, function (item) {
                item.Ischecked = true;

                // Check if item already exists in DrugArray
                var existing = drugObj.DrugArray.find(function (d) {
                    return d.HistoryHabitsId === item.HistoryHabitsID;
                });

                if (existing) {
                    existing.ActiveInd = "Y"; // update
                } else {
                    // Add new entry
                    var newItem = {
                        DrugHistoryId: 0,
                        ActiveInd: "Y",
                        HabitsDescription: item.HabitsDescription,
                        HistoryHabitsId: item.HistoryHabitsID,
                        HabitsId: item.HabitsId
                    };
                    drugObj.DrugArray.push(newItem);
                }
            });

        } else {
            // 4. If checkbox is unchecked
            $scope.DrugListSelectedText = "Select";

            angular.forEach($scope.HealthPhysicalObj.DrugNames, function (item) {
                item.Ischecked = false;

                // Find the existing item in DrugArray
                var index = drugObj.DrugArray.findIndex(function (d) {
                    return d.HistoryHabitsId === item.HistoryHabitsID;
                });

                if (index !== -1) {
                    var existing = drugObj.DrugArray[index];

                    // If it's from DB (DrugHistoryId != 0), mark as inactive
                    if (existing.DrugHistoryId !== 0) {
                        existing.ActiveInd = "N";
                    } else {
                        // If it's not saved yet, remove from array
                        drugObj.DrugArray.splice(index, 1);
                    }
                }
            });
        }

        console.log("Final DrugArray:", drugObj.DrugArray);
    };


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



    $scope.ChangeGeneralApp = function (item) {
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
        $scope.obj.isNKSHSelected = false;
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
        if (item.HistoryId == 166) {
            item.IsNoshowROS = true;
        }
        if (item.HistoryId === 166) {
            if (item.IsChecked) {
                $scope.HealthPhysicalObj.showGeneralAppearenceNotes = true;
            } else {
                $scope.HealthPhysicalObj.showGeneralAppearenceNotes = false;
                $scope.HealthPhysicalObj.GeneralAppearenceNotes = "";
            }
        }

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
    }
    $scope.ChangeHeentApp = function (item) {
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
        $scope.obj.isNKSHSelected = false;
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
        if (item.HistoryId == 127) {
            item.IsNoshowROS = true;
        }
        if (item.HistoryId === 127) {
            if (item.IsChecked) {
                $scope.HealthPhysicalObj.showHeentNotes = true;
            } else {
                $scope.HealthPhysicalObj.showHeentNotes = false;
                $scope.HealthPhysicalObj.HeentNotes = "";
            }
        }
        $scope.allwnlcheck();
    }
    $scope.ChangeLungsApp = function (item) {
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
        $scope.obj.isNKSHSelected = false;
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
        if (item.HistoryId == 132) {
            item.IsNoshowROS = true;
        }
        if (item.HistoryId === 132) {
            if (item.IsChecked) {
                $scope.HealthPhysicalObj.showLungsNotes = true;
            } else {
                $scope.HealthPhysicalObj.showLungsNotes = false;
                $scope.HealthPhysicalObj.LungsNotes = "";
            }
        }

        $scope.allwnlcheck();
    }

    $scope.ChangeCardiacApp = function (item) {

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
        $scope.obj.isNKSHSelected = false;
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
        if (item.HistoryId == 20) {
            item.IsNoshowROS = true;
        }
        if (item.HistoryId === 20) {
            if (item.IsChecked) {
                $scope.HealthPhysicalObj.showCardiacNotes = true;
            } else {
                $scope.HealthPhysicalObj.showCardiacNotes = false;
                $scope.HealthPhysicalObj.CardiacNotes = "";
            }
        }
        $scope.allwnlcheck();

    }

    $scope.allwnlcheck = function () {
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
    }

    $scope.ChangeNeuroApp = function (item) {
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
        $scope.obj.isNKSHSelected = false;
        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
        if (item.HistoryId == 59) {
            item.IsNoshowROS = true;
        }
        if (item.HistoryId === 59) {
            if (item.IsChecked) {
                $scope.HealthPhysicalObj.showNeurologicNotes = true;
            } else {
                $scope.HealthPhysicalObj.showNeurologicNotes = false;
                $scope.HealthPhysicalObj.NeurologicNotes = "";
            }
        }
        $scope.allwnlcheck();
    }
    $scope.ChangeOthersystems = function (item) {
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


        if (item.HistoryId == 33 || item.HistoryId == 41 || item.HistoryId == 67 || item.HistoryId === 70 || item.HistoryId === 74 || item.HistoryId === 78 || item.HistoryId === 90 || item.HistoryId === 95) {
            item.IsNoshowROS = true;
        }


        if (item.HistoryId === 33) {
            if (item.IsChecked) {
                $scope.HealthPhysicalObj.showPulmonaryNotes = true;
            } else {
                $scope.HealthPhysicalObj.showPulmonaryNotes = false;
                $scope.HealthPhysicalObj.PulmonaryNotes = "";
            }
        }
        if (item.HistoryId === 41) {
            if (item.IsChecked) {
                $scope.HealthPhysicalObj.showHepaticNotes = true;
            } else {
                $scope.HealthPhysicalObj.showHepaticNotes = false;
                $scope.HealthPhysicalObj.HepaticNotes = "";
            }
        }
        if (item.HistoryId === 67) {
            if (item.IsChecked) {
                $scope.HealthPhysicalObj.showHemeOncNotes = true;
            } else {
                $scope.HealthPhysicalObj.showHemeOncNotes = false;
                $scope.HealthPhysicalObj.HemeOncNotes = "";
            }
        }
        if (item.HistoryId === 70) {
            if (item.IsChecked) {
                $scope.HealthPhysicalObj.showNervousSystemNotes = true;
            } else {
                $scope.HealthPhysicalObj.showNervousSystemNotes = false;
                $scope.HealthPhysicalObj.NervousSystemNotes = "";
            }
        }
        if (item.HistoryId === 74) {
            if (item.IsChecked) {
                $scope.HealthPhysicalObj.showKidneyDiseaseNotes = true;
            } else {
                $scope.HealthPhysicalObj.showKidneyDiseaseNotes = false;
                $scope.HealthPhysicalObj.KidneyDiseaseNotes = "";
            }
        }
        if (item.HistoryId === 78) {
            if (item.IsChecked) {
                $scope.HealthPhysicalObj.showMusculoSkeletalSystemNotes = true;
            } else {
                $scope.HealthPhysicalObj.showMusculoSkeletalSystemNotes = false;
                $scope.HealthPhysicalObj.MusculoSkeletalSystemNotes = "";
            }
        }
        if (item.HistoryId === 90) {
            if (item.IsChecked) {
                $scope.HealthPhysicalObj.showPsychosisNotes = true;
            } else {
                $scope.HealthPhysicalObj.showPsychosisNotes = false;
                $scope.HealthPhysicalObj.PsychosisNotes = "";
            }
        }
        if (item.HistoryId === 95) {
            if (item.IsChecked) {
                $scope.HealthPhysicalObj.showOthersNotes = true;
            } else {
                $scope.HealthPhysicalObj.showOthersNotes = false;
                $scope.HealthPhysicalObj.OthersNotes = "";
            }
        }
        $scope.allwnlcheck();
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

        $scope.HealthPhysicalObj.LifestyleHistoryArray = $scope.HealthPhysicalObj.LifestyleHistoryArray || [];
        var tempLifeStyleArray = [];
        if ($scope.HealthPhysicalObj.LifestyleHistoryArray.length > 0) {
            tempLifeStyleArray = $filter('filter')($scope.HealthPhysicalObj.LifestyleHistoryArray, { 'DeleteInd': 'N' }, true) || [];
        }

        if ($scope.HealthPhysicalObj.LifestyleHistoryArray.length == 0 || tempLifeStyleArray.length == 0) {
            var ROSLifestyle = {
                "Smoking": 1,
                "Alchol": 2,
                "Drug": 3,
                "Psychis": 4
            }
            if (ROSLifestyle.Smoking === 1) {
                var Object = {
                    "PatientDetailId": 0,
                    "DeleteInd": "N",
                    "ActiveInd": "Y",
                    "Remarks": "",
                    "ShowNote": false,
                    "HistoryId": 1,
                    "HistoryName": "Smoking",
                    // Smoking
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
                    "SmokingFromDate": null,
                    "SmokingToDate": "",
                    "SmokeShowDateFormat": true,
                    "SmokingType": "No",
                }
                $scope.HealthPhysicalObj.LifestyleHistoryArray.push(Object);

            }

            if (ROSLifestyle.Alchol === 2) {
                var Object = {
                    "PatientDetailId": 0,
                    "DeleteInd": "N",
                    "ActiveInd": "Y",
                    "HistoryId": 2,
                    "HistoryName": "Alcohol",
                    // Alcohol specific
                    "AlcoholHistoryId": 0,
                    "AlcoholQuantityId": 0,
                    "AlcoholQuantityName": "",
                    "AlcoholStatusId": 0,
                    "AlcoholStatusName": "",
                    "AlcoholDuration": "",
                    "AlcoholDurationType": "D",
                    "AlcoholDurationDate": null,
                    "AlcoShowDateFormat": true,
                    "AlcoholType": "No",
                    // Common
                    "Remarks": "",
                    "ShowNote": false,
                }
                $scope.HealthPhysicalObj.LifestyleHistoryArray.push(Object);

            }

            if (ROSLifestyle.Drug === 3) {
                var Object = {
                    "PatientDetailId": 0,
                    "DeleteInd": "N",
                    "ActiveInd": "Y",
                    "Remarks": "",
                    "ShowNote": false,
                    "HistoryId": 3,
                    "HistoryName": "Drug",

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
                    "DrugShowDateFormat": true,
                    "DrugType": "No",


                };
                $scope.HealthPhysicalObj.LifestyleHistoryArray.push(Object);
            }

            if (ROSLifestyle.Psychis === 4) {
                var Object = {
                    "PatientDetailId": 0,
                    "DeleteInd": "N",
                    "ActiveInd": "Y",
                    "Remarks": "",
                    "ShowNote": false,
                    "HistoryId": 4,
                    "HistoryName": "Psychis",
                    // Psychis                   
                    "PsychisType": "No",
                    "Remarks": "",
                    "ShowNote": false,
                    "PsychisShowDateFormat": true,
                }
                $scope.HealthPhysicalObj.LifestyleHistoryArray.push(Object);
                $scope.HealthPhysicalObj.isNKLHSelected = true;

                $scope.HealthPhysicalObj.LifestyleHistory.PsychisType = "No";
                $scope.HealthPhysicalObj.LifestyleHistory.DrugType = "No";
                $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = "No";
                $scope.HealthPhysicalObj.LifestyleHistory.SmokingType = "No";

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

    $scope.GetReactionNames = function (item) {

        if (!item.Reactions || !item.Reactions.length) {
            return '';
        }

        return item.Reactions
            .filter(function (r) {
                return r.DeleteInd !== 'Y';
            })
            .map(function (r) {
                return r.ReactionName;
            })
            .join(', ');
    };

    $scope.GetReactionIds = function (item) {

        if (!item.Reactions || !item.Reactions.length) {
            return '';
        }

        return item.Reactions
            .filter(function (r) {
                return r.DeleteInd !== 'Y';
            })
            .map(function (r) {
                return r.ReactionId;
            })
            .sort()
            .join(',');
    };


    $scope.compareAllergyItems = function () {
        $scope.obj.AllergyItems = $scope.obj.AllergyItems || [];
        $scope.LogObj.AllergyItems = $scope.LogObj.AllergyItems || [];
        const userOldAllergies = $filter("filter")($scope.LogObj.AllergyItems, { "CreatedBy": $scope.UserId }, true) || [];
        let count = 0;
        let dltcount = 0;
        let dltallergyNames = '';
        let DifferenceItem = [];

        angular.forEach($scope.obj.AllergyItems, function (item) {
            item.DurationDate = item.DurationDate ? $filter('date')(item.DurationDate, 'MM-dd-yyyy') : '';
            item.Duration = item.Duration || null;
            if (item.DeleteInd === 'Y') {
                if (dltcount > 0) dltallergyNames += ', ';
                dltallergyNames += item.AllergyName;
                dltcount++;
            } else {
                let edited = $scope.LogObj.AllergyItems.filter(function (eitem) {
                    eitem.DurationDate = eitem.DurationDate ? $filter('date')(eitem.DurationDate, 'MM-dd-yyyy') : '';
                    eitem.Duration = eitem.Duration || null;
                    return (
                        eitem.AllergyId === item.AllergyId &&
                        $scope.GetReactionIds(eitem) === $scope.GetReactionIds(item) &&
                        eitem.StatusId === item.StatusId &&
                        eitem.DurationDate === item.DurationDate &&
                        eitem.SeverityId === item.SeverityId &&
                        eitem.Duration === item.Duration &&
                        eitem.AllergyTypeId === item.AllergyTypeId &&
                        eitem.Remarks === item.Remarks
                    );
                });

                if (edited.length === 0) {
                    DifferenceItem.push(item);
                    count++;
                }
            }
        });

        // Edited log
        if (count > 0) {
            let Affecteditem = '';
            let OldAffecteditem = '';

            angular.forEach(DifferenceItem, function (itemA) {
                let newLine = `Allergy: ${itemA.AllergyName}`;
                //if (itemA.ReactionName) newLine += `, Allergy Reaction: ${itemA.ReactionName}`;
                var reactionNames = $scope.GetReactionNames(itemA);
                if (reactionNames) {
                    newLine += `, Allergy Reaction: ${reactionNames}`;
                }

                if (itemA.AllergyTypeId) {
                    let tempArray = $filter('filter')($scope.ROSAllergyType, { 'ROSAllergyTypeId': itemA.AllergyTypeId }, true);
                    if (tempArray.length > 0) newLine += `, Allergy Type: ${tempArray[0].AllergyType}`;
                }
                if (itemA.Duration) {
                    let unit = '';
                    switch (itemA.DurationType) {
                        case 'D':
                            unit = 'Days';
                            break;
                        case 'W':
                            unit = 'Weeks';
                            break;
                        case 'M':
                            unit = 'Months';
                            break;
                        case 'Y':
                            unit = 'Years';
                            break;
                        case 'SB':
                            unit = 'Since Birth';
                            break;
                    }

                    if (itemA.DurationType === 'SB') {
                        newLine += `, Duration: Since Birth`;
                    } else {
                        newLine += `, Duration: ${itemA.Duration} ${unit}`;
                    }
                }
                if (itemA.DurationDate) newLine += `, Onset: ${itemA.DurationDate}`;
                if (itemA.SeverityName && itemA.SeverityName.trim() !== '') newLine += `, Severity: ${itemA.SeverityName}`;
                if (itemA.StatusName) newLine += `, Status: ${itemA.StatusName}`;
                if (itemA.Remarks) newLine += `, Notes: ${itemA.Remarks}`;

                Affecteditem += `\n${newLine.toUpperCase()}`;

                let matchedOld = $scope.LogObj.AllergyItems.find(itemB => itemB.AllergyId === itemA.AllergyId);
                if (matchedOld) {
                    let oldLine = `Allergy: ${matchedOld.AllergyName}`;
                    //if (matchedOld.ReactionName) oldLine += `, Allergy Reaction: ${matchedOld.ReactionName}`;

                    var oldReactionNames = $scope.GetReactionNames(matchedOld);

                    if (oldReactionNames) {
                        oldLine += `, Allergy Reaction: ${oldReactionNames}`;
                    }

                    if (matchedOld.AllergyTypeId) {
                        let oldType = $filter('filter')($scope.ROSAllergyType, { 'ROSAllergyTypeId': matchedOld.AllergyTypeId }, true);
                        if (oldType.length > 0) oldLine += `, Allergy Type: ${oldType[0].AllergyType}`;
                    }
                    if (matchedOld.Duration) {
                        let unit = '';
                        switch (matchedOld.DurationType) {
                            case 'D':
                                unit = 'Days';
                                break;
                            case 'W':
                                unit = 'Weeks';
                                break;
                            case 'M':
                                unit = 'Months';
                                break;
                            case 'Y':
                                unit = 'Years';
                                break;
                            case 'SB':
                                unit = 'Since Birth';
                                break;
                        }

                        if (matchedOld.DurationType === 'SB') {
                            oldLine += `, Duration: Since Birth`;
                        } else {
                            oldLine += `, Duration: ${matchedOld.Duration} ${unit}`;
                        }
                    }
                    if (matchedOld.DurationDate) oldLine += `, Onset: ${matchedOld.DurationDate}`;
                    if (matchedOld.SeverityName && matchedOld.SeverityName.trim() !== '') oldLine += `, Severity: ${matchedOld.SeverityName}`;
                    if (matchedOld.StatusName) oldLine += `, Status: ${matchedOld.StatusName}`;
                    if (matchedOld.Remarks) oldLine += `, Notes: ${matchedOld.Remarks}`;

                    OldAffecteditem += `\n${oldLine.toUpperCase()}`;
                }
            });
            let actionType = 'Edited';
            if (userOldAllergies.length === 0 && OldAffecteditem === '') {
                actionType = 'Added';
            }
            let obj = {
                "LogId": 0,
                "ModuleId": 2,
                "ModuleName": "ASC",
                "SubModuleId": 3,
                "SubModuleName": "ROS",
                "ScreenType": "ROS",
                "ActionType": actionType,
                "OldActionDescription": OldAffecteditem.trim(),
                "NewActionDescription": Affecteditem.trim(),
                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            };
            $scope.LogObj.LogArray.push(obj);
        }

        // Deleted log
        if (dltcount > 0) {
            let description = (dltcount === 1)
                ? `Allergy - ${dltallergyNames.toUpperCase()}`
                : `Allergies - ${dltallergyNames.toUpperCase()}`;

            let obj = {
                "LogId": 0,
                "ModuleId": 2,
                "ModuleName": "ASC",
                "SubModuleId": 3,
                "SubModuleName": "ROS",
                "ScreenType": "ROS",
                "ActionType": "Deleted",
                "OldActionDescription": description,
                "NewActionDescription": '',
                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            };
            $scope.LogObj.LogArray.push(obj);
        }
    };

    $scope.compareSurgicalHistory = function () {
        $scope.obj.SurgicalHistoryArray = $scope.obj.SurgicalHistoryArray || [];
        $scope.LogObj.SurgicalHistory = $scope.LogObj.SurgicalHistory || [];
        const userOldSurgical = $filter("filter")($scope.LogObj.SurgicalHistory, { "CreatedBy": $scope.UserId }, true) || [];
        let count = 0;
        let dltcount = 0;
        let dltallergyNames = '';
        let DifferenceItem = [];

        angular.forEach($scope.obj.SurgicalHistoryArray, function (item) {
            item.DurationDate = item.DurationDate ? $filter('date')(item.DurationDate, 'MM-dd-yyyy') : '';
            item.Duration = item.Duration || null;
            if (item.DeleteInd === 'Y') {
                if (dltcount > 0) dltallergyNames += ', ';
                dltallergyNames += item.HistoryName;
                dltcount++;
            } else {
                let edited = $scope.LogObj.SurgicalHistory.filter(function (eitem) {
                    eitem.DurationDate = eitem.DurationDate ? $filter('date')(eitem.DurationDate, 'MM-dd-yyyy') : '';
                    eitem.Duration = eitem.Duration || null;
                    return (
                        eitem.HistoryId == item.HistoryId &&
                        eitem.ModifierId == item.ModifierId &&
                        eitem.DurationDate == item.DurationDate &&
                        eitem.Duration === item.Duration &&
                        eitem.Remarks === item.Remarks
                    );
                });

                if (edited.length === 0) {
                    DifferenceItem.push(item);
                    count++;
                }
            }
        });

        // Edited log
        if (count > 0) {
            let Affecteditem = '';
            let OldAffecteditem = '';

            angular.forEach(DifferenceItem, function (itemA) {

                let newLine = `Surgical History: ${itemA.HistoryName}`;

                if (itemA.ModifierId) {
                    let tempArray = $filter('filter')($scope.ROSModifiers, { 'MODIFIERID': itemA.ModifierId }, true);
                    if (tempArray.length > 0) newLine += `, Modifier: ${tempArray[0].DESCRIPTION1}`;
                }

                if (itemA.Duration) {
                    let unit = '';
                    switch (itemA.DurationType) {
                        case 'D':
                            unit = 'Days';
                            break;
                        case 'W':
                            unit = 'Weeks';
                            break;
                        case 'M':
                            unit = 'Months';
                            break;
                        case 'Y':
                            unit = 'Years';
                            break;
                        case 'SB':
                            unit = 'Since Birth';
                            break;
                    }

                    if (itemA.DurationType === 'SB') {
                        newLine += `, Duration: Since Birth`;
                    } else {
                        newLine += `, Duration: ${itemA.Duration} ${unit}`;
                    }
                }

                if (itemA.DurationDate) newLine += `, Onset: ${itemA.DurationDate}`;
                if (itemA.Remarks) newLine += `, Notes: ${itemA.Remarks}`;

                Affecteditem += `\n${newLine.toUpperCase()}`;

                let matchedOld = $scope.LogObj.SurgicalHistory.find(itemB => itemB.HistoryId === itemA.HistoryId);
                if (matchedOld) {
                    let oldLine = `${matchedOld.HistoryName}`;
                    if (matchedOld.ModifierId) {
                        let oldType = $filter('filter')($scope.ROSModifiers, { 'MODIFIERID': matchedOld.ModifierId }, true);
                        if (oldType.length > 0) oldLine += `, Modifier: ${oldType[0].DESCRIPTION1}`;
                    }

                    if (matchedOld.Duration) {
                        let unit = '';
                        switch (matchedOld.DurationType) {
                            case 'D':
                                unit = 'Days';
                                break;
                            case 'W':
                                unit = 'Weeks';
                                break;
                            case 'M':
                                unit = 'Months';
                                break;
                            case 'Y':
                                unit = 'Years';
                                break;
                            case 'SB':
                                unit = 'Since Birth';
                                break;
                        }

                        if (matchedOld.DurationType === 'SB') {
                            oldLine += `, Duration: Since Birth`;
                        } else {
                            oldLine += `, Duration: ${matchedOld.Duration} ${unit}`;
                        }
                    }

                    if (matchedOld.DurationDate) oldLine += `, Onset: ${matchedOld.DurationDate}`;
                    if (matchedOld.Remarks) oldLine += `, Notes: ${matchedOld.Remarks}`;

                    OldAffecteditem += `\n${oldLine.toUpperCase()}`;
                }
            });
            let actionType = 'Edited';
            if (userOldSurgical.length === 0 && OldAffecteditem === '') {
                actionType = 'Added';
            }
            let obj = {
                "LogId": 0,
                "ModuleId": 2,
                "ModuleName": "ASC",
                "SubModuleId": 3,
                "SubModuleName": "ROS",
                "ScreenType": "ROS",
                "ActionType": actionType,
                "OldActionDescription": OldAffecteditem.trim(),
                "NewActionDescription": Affecteditem.trim(),
                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            };
            $scope.LogObj.LogArray.push(obj);
        }

        if (dltcount != 0) {
            let description = (dltcount === 1)
                ? `Surgical History - ${dltallergyNames.toUpperCase()}`
                : `Surgical History - ${dltallergyNames.toUpperCase()}`;
            let obj = {
                "LogId": 0,
                "ModuleId": 2,
                "ModuleName": "ASC",
                "SubModuleId": 3,
                "SubModuleName": "ROS",
                "ScreenType": "ROS",
                "ActionType": "Deleted",
                "OldActionDescription": description,
                "NewActionDescription": '',
                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            };
            $scope.LogObj.LogArray.push(obj);
        }
    }
    $scope.compareCurrentSystemicMedicationsHistory = function (CurrentSystemicMedications) {
        CurrentSystemicMedications = CurrentSystemicMedications || [];
        $scope.LogObj.CurrentSystemicMedicationsHistory = $scope.LogObj.CurrentSystemicMedicationsHistory || [];
        const userOldCurrentSystemicMedication = $filter("filter")($scope.LogObj.CurrentSystemicMedicationsHistory, { "CreatedBy": $scope.UserId }, true) || [];

        let editedItems = [];
        let deletedItems = [];

        angular.forEach(CurrentSystemicMedications, function (item) {
            item.Sig = item.Sig || '';
            item.StartDate = item.StartDate ? $filter('date')(item.StartDate, 'MM-dd-yyyy') : null;

            if (item.DeleteInd === 'Y') {
                let delDesc = item.MedicineName;
                if (item.Sig) delDesc += ' Sig:' + item.Sig;
                if (item.StartDate) delDesc += ' StartDate:' + item.StartDate;
                deletedItems.push(delDesc);
            } else {
                // Check for exact match in previous list
                const matched = $scope.LogObj.CurrentSystemicMedicationsHistory.some(function (oldItem) {
                    oldItem.Sig = oldItem.Sig || '';
                    oldItem.StartDate = oldItem.StartDate ? $filter('date')(oldItem.StartDate, 'MM-dd-yyyy') : null;

                    return (
                        oldItem.MedicineId === item.MedicineId &&
                        oldItem.ActionId === item.ActionId &&
                        oldItem.DaysSupplyId === item.DaysSupplyId &&
                        oldItem.DoseId === item.DoseId &&
                        oldItem.DoseOtherId === item.DoseOtherId &&
                        oldItem.FrequencyId === item.FrequencyId &&
                        oldItem.RouteId === item.RouteId &&
                        oldItem.StartDate === item.StartDate &&
                        oldItem.Sig === item.Sig
                    );
                });

                if (!matched) {
                    editedItems.push({
                        newText: `${item.MedicineName}${item.Sig ? ' Sig:' + item.Sig : ''}${item.StartDate ? ' StartDate:' + item.StartDate : ''}`,
                        medicineId: item.MedicineId
                    });
                }
            }
        });

        // Log Edited items
        if (editedItems.length > 0) {
            let newDesc = 'Current Systemic Medications - ' + editedItems.map(i => i.newText.toUpperCase()).join(', ');

            let oldDescItems = $scope.LogObj.CurrentSystemicMedicationsHistory
                .filter(oldItem => editedItems.some(e => e.medicineId === oldItem.MedicineId))
                .map(oldItem => {
                    oldItem.Sig = oldItem.Sig || '';
                    oldItem.StartDate = oldItem.StartDate ? $filter('date')(oldItem.StartDate, 'MM-dd-yyyy') : null;
                    let info = oldItem.MedicineName;
                    if (oldItem.Sig) info += ' Sig:' + oldItem.Sig;
                    if (oldItem.StartDate) info += ' StartDate:' + oldItem.StartDate;
                    return info.toUpperCase();
                });
           
            let oldDesc = oldDescItems.length > 0
                ? 'Current Systemic Medications - ' + oldDescItems.join(', ')
                : '';

            let actionType = 'Edited';
            if (userOldCurrentSystemicMedication.length === 0 && oldDesc === '') {
                actionType = 'Added';
            }
            $scope.LogObj.LogArray.push({
                LogId: 0,
                ModuleId: 2,
                ModuleName: "ASC",
                SubModuleId: 3,
                SubModuleName: "ROS",
                ScreenType: "ROS",
                ActionType: actionType,
                OldActionDescription: oldDesc,
                NewActionDescription: newDesc,
                ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            });
        }

        // Log Deleted items
        if (deletedItems.length > 0) {
            let delDesc = 'Current Systemic Medications - ' + deletedItems.map(i => i.toUpperCase()).join(', ');

            $scope.LogObj.LogArray.push({
                LogId: 0,
                ModuleId: 2,
                ModuleName: "ASC",
                SubModuleId: 3,
                SubModuleName: "ROS",
                ScreenType: "ROS",
                ActionType: "Deleted",
                OldActionDescription: delDesc,
                NewActionDescription: '',
                ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            });
        }
    };


    $scope.compareCurrentEyeMedications = function (CurrentEyeMedications) {
        CurrentEyeMedications = CurrentEyeMedications || [];
        $scope.LogObj.CurrentEyeMedications = $scope.LogObj.CurrentEyeMedications || [];
        const userOldCurrentEyeMedications = $filter("filter")($scope.LogObj.CurrentEyeMedications, { "CreatedBy": $scope.UserId }, true) || [];
        let editedItems = [];
        let deletedItems = [];

        angular.forEach(CurrentEyeMedications, function (item) {
            item.Sig = item.Sig || '';
            item.StartDate = item.StartDate ? $filter('date')(item.StartDate, 'MM-dd-yyyy') : null;

            if (item.DeleteInd === 'Y') {
                let delDesc = item.MedicineName;
                if (item.Sig !== '') delDesc += ' Sig:' + item.Sig;
                if (item.StartDate) delDesc += ' StartDate:' + item.StartDate;
                deletedItems.push(delDesc);
            } else {
                // Try to find a matching item from previous saved log
                const matched = $scope.LogObj.CurrentEyeMedications.some(function (oldItem) {
                    oldItem.Sig = oldItem.Sig || '';
                    oldItem.StartDate = oldItem.StartDate ? $filter('date')(oldItem.StartDate, 'MM-dd-yyyy') : null;

                    return (
                        oldItem.MedicineId === item.MedicineId &&
                        oldItem.ActionId === item.ActionId &&
                        oldItem.DaysSupplyId === item.DaysSupplyId &&
                        oldItem.DoseId === item.DoseId &&
                        oldItem.DoseOtherId === item.DoseOtherId &&
                        oldItem.FrequencyId === item.FrequencyId &&
                        oldItem.RouteId === item.RouteId &&
                        oldItem.StartDate === item.StartDate &&
                        oldItem.Sig === item.Sig
                    );
                });

                if (!matched) {
                    editedItems.push({
                        newText: `${item.MedicineName}${item.Sig ? ' Sig:' + item.Sig : ''}${item.StartDate ? ' StartDate:' + item.StartDate : ''}`,
                        medicineId: item.MedicineId
                    });
                }
            }
        });

        // Add Edited log
        if (editedItems.length > 0) {
            let newDesc = 'Current Eye Medication - ' + editedItems.map(i => i.newText.toUpperCase()).join(', ');

            let oldDescItems = $scope.LogObj.CurrentEyeMedications
                .filter(oldItem => editedItems.some(e => e.medicineId === oldItem.MedicineId))
                .map(oldItem => {
                    oldItem.Sig = oldItem.Sig || '';
                    oldItem.StartDate = oldItem.StartDate ? $filter('date')(oldItem.StartDate, 'MM-dd-yyyy') : null;
                    let info = oldItem.MedicineName;
                    if (oldItem.Sig !== '') info += ' Sig:' + oldItem.Sig;
                    if (oldItem.StartDate) info += ' StartDate:' + oldItem.StartDate;
                    return info.toUpperCase();
                });

            let oldDesc = oldDescItems.length > 0
                ? 'Current Eye Medication - ' + oldDescItems.join(', ')
                : '';
            let actionType = 'Edited';
            if (userOldCurrentEyeMedications.length === 0 && oldDesc === '') {
                actionType = 'Added';
            }
            $scope.LogObj.LogArray.push({
                LogId: 0,
                ModuleId: 2,
                ModuleName: "ASC",
                SubModuleId: 3,
                SubModuleName: "ROS",
                ScreenType: "ROS",
                ActionType: actionType,
                OldActionDescription: oldDesc,
                NewActionDescription: newDesc,
                ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            });
        }

        // Add Deleted log
        if (deletedItems.length > 0) {
            let delDesc = 'Current Eye Medication - ' + deletedItems.map(i => i.toUpperCase()).join(', ');
            $scope.LogObj.LogArray.push({
                LogId: 0,
                ModuleId: 2,
                ModuleName: "ASC",
                SubModuleId: 3,
                SubModuleName: "ROS",
                ScreenType: "ROS",
                ActionType: "Deleted",
                OldActionDescription: delDesc,
                NewActionDescription: '',
                ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            });
        }
    };



    $scope.compareLifestyle = function () {
        $scope.HealthPhysicalObj.LifestyleHistoryArray = $scope.HealthPhysicalObj.LifestyleHistoryArray || [];
        $scope.LogObj.LifestyleDetail = $scope.LogObj.LifestyleDetail || [];
        var IsUserAlreadyAddedCCList = $filter("filter")($scope.LogObj.LifestyleDetail, { "UserId": $scope.UserId }, true) || [];
        var newvalue = '';
        var oldvalue = '';
        let SmokingData = '';
        let logSmokingData = '';
        let AlcoholData = '';
        let logAlcoholData = '';
        let DrugData = '';
        let logDrugData = '';
        let psychisData = '';
        let logpsychisData = '';
        let count = 0;
        let smokinglist = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
            return item.DeleteInd == 'N' && item.HistoryId == 1;
        }) || [];

        let logsmokinglist = $filter("filter")($scope.LogObj.LifestyleDetail, function (item) {
            return item.DeleteInd == 'N' && item.HistoryId == 1;
        }) || [];

        let alcohollist = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
            return item.DeleteInd == 'N' && item.HistoryId == 2;
        }) || [];

        let logalcohollist = $filter("filter")($scope.LogObj.LifestyleDetail, function (item) {
            return item.DeleteInd == 'N' && item.HistoryId == 2;
        }) || [];

        let druglist = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
            return item.DeleteInd == 'N' && item.HistoryId == 3;
        }) || [];

        let logdruglist = $filter("filter")($scope.LogObj.LifestyleDetail, function (item) {
            return item.DeleteInd == 'N' && item.HistoryId == 3;
        }) || [];

        let psychislist = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
            return item.DeleteInd == 'N' && item.HistoryId == 4;
        }) || [];

        let logpsychislist = $filter("filter")($scope.LogObj.LifestyleDetail, function (item) {
            return item.DeleteInd == 'N' && item.HistoryId == 4;
        }) || [];

        if (alcohollist.length > 0) {
            if (logalcohollist.length == 0) {
                count++;
            } else {
                if (alcohollist[0].AlcoholType != logalcohollist[0].AlcoholType) {
                    count++;
                }
            }
        }
        if (druglist.length > 0) {
            if (logdruglist.length == 0) {
                count++;
            } else {
                if (druglist[0].DrugType != logdruglist[0].DrugType) {
                    count++;
                }
            }
        }
        if (psychislist.length > 0) {
            if (logpsychislist.length == 0) {
                count++;
            } else {
                if (psychislist[0].PsychisType != logpsychislist[0].PsychisType) {
                    count++;
                }
            }
        }
        if (smokinglist.length > 0) {
            if (logsmokinglist.length == 0) {
                count++;
            } else {
                if (smokinglist[0].SmokingType != logsmokinglist[0].SmokingType) {
                    count++;
                }
            }
        }


        const formatDuration = (value, type) => {
            if (!value) return '';
            const labels = { Y: 'Year(s)', W: 'Week(s)', M: 'Month(s)', D: 'Day(s)', H: 'Hour(s)' };
            return `${value} ${labels[type] || ''}`;
        };

        if (alcohollist.length > 0 && logalcohollist.length > 0) {
            if (alcohollist[0].AlcoholType == 'Yes') {
                alcohollist[0].AlcoholDuration = alcohollist[0].AlcoholDuration || "";
                logalcohollist[0].AlcoholDuration = logalcohollist[0].AlcoholDuration || "";
                alcohollist[0].AlcoholStatusId = alcohollist[0].AlcoholStatusId || null;
                logalcohollist[0].AlcoholStatusId = logalcohollist[0].AlcoholStatusId || null;

                alcohollist[0].AlcoholDurationDate = alcohollist[0].AlcoholDurationDate || null;
                logalcohollist[0].AlcoholDurationDate = logalcohollist[0].AlcoholDurationDate || null;

                if (alcohollist[0].AlcoholDurationDate !== null) {
                    alcohollist[0].AlcoholDurationDate = $filter('date')(alcohollist[0].AlcoholDurationDate, "MM-dd-yyyy");
                }
                if (logalcohollist[0].AlcoholDurationDate !== null) {
                    logalcohollist[0].AlcoholDurationDate = $filter('date')(logalcohollist[0].AlcoholDurationDate, "MM-dd-yyyy");
                }


                if ((alcohollist[0].AlcoholType != logalcohollist[0].AlcoholType) || (alcohollist[0].AlcoholDurationDate != logalcohollist[0].AlcoholDurationDate) || (alcohollist[0].AlcoholQuantityId != logalcohollist[0].AlcoholQuantityId) || (alcohollist[0].AlcoholDuration != logalcohollist[0].AlcoholDuration) || (alcohollist[0].AlcoholStatusId != logalcohollist[0].AlcoholStatusId)) {
                    var newparts = [];
                    var oldparts = [];
                    count++;
                    if (alcohollist[0].AlcoholType != logalcohollist[0].AlcoholType) {
                        if (alcohollist[0].AlcoholType) newparts.push('Alcohol Type :' + alcohollist[0].AlcoholType);
                        if (logalcohollist[0].AlcoholType) oldparts.push('Alcohol Type :' + logalcohollist[0].AlcoholType);

                    }
                    if (alcohollist[0].AlcoholDurationDate != logalcohollist[0].AlcoholDurationDate) {
                        if (alcohollist[0].AlcoholDurationDate) newparts.push('Alcohol DurationDate :' + alcohollist[0].AlcoholDurationDate);
                        if (logalcohollist[0].AlcoholDurationDate) oldparts.push('Alcohol DurationDate :' + logalcohollist[0].AlcoholDurationDate);
                    }
                    if ((alcohollist[0].AlcoholDuration != logalcohollist[0].AlcoholDuration) || (alcohollist[0].AlcoholDurationType != logalcohollist[0].AlcoholDurationType)) {
                        let newduration = formatDuration(alcohollist[0].AlcoholDuration, alcohollist[0].AlcoholDurationType)
                        let oldduration = formatDuration(logalcohollist[0].AlcoholDuration, logalcohollist[0].AlcoholDurationType)
                        if (newduration) newparts.push('Alcohol Duration :' + newduration);
                        if (oldduration) oldparts.push('Alcohol Duration :' + oldduration);
                    }
                    if (alcohollist[0].AlcoholStatusId != logalcohollist[0].AlcoholStatusId) {
                        if (alcohollist[0].AlcoholStatusName) newparts.push('Alcohol StatusName :' + alcohollist[0].AlcoholStatusName);
                        if (logalcohollist[0].AlcoholStatusName) oldparts.push('Alcohol StatusName :' + logalcohollist[0].AlcoholStatusName);
                    }
                    if (alcohollist[0].AlcoholQuantityId != logalcohollist[0].AlcoholQuantityId) {
                        if (alcohollist[0].AlcoholQuantityName) newparts.push('Alcohol QuantityName :' + alcohollist[0].AlcoholQuantityName);
                        if (logalcohollist[0].AlcoholQuantityName) oldparts.push('Alcohol QuantityName :' + logalcohollist[0].AlcoholQuantityName);
                    }
                    AlcoholData = newparts.join('\n ');
                    logAlcoholData = oldparts.join('\n ');
                }
            }
            if (alcohollist[0].AlcoholType == 'No') {
                alcohollist[0].AlcoholDuration = alcohollist[0].AlcoholDuration || "";
                logalcohollist[0].AlcoholDuration = logalcohollist[0].AlcoholDuration || "";
                alcohollist[0].AlcoholStatusId = alcohollist[0].AlcoholStatusId || null;
                logalcohollist[0].AlcoholStatusId = logalcohollist[0].AlcoholStatusId || null;

                alcohollist[0].AlcoholDurationDate = alcohollist[0].AlcoholDurationDate || null;
                logalcohollist[0].AlcoholDurationDate = logalcohollist[0].AlcoholDurationDate || null;

                if (alcohollist[0].AlcoholDurationDate !== null) {
                    alcohollist[0].AlcoholDurationDate = $filter('date')(alcohollist[0].AlcoholDurationDate, "MM-dd-yyyy");
                }
                if (logalcohollist[0].AlcoholDurationDate !== null) {
                    logalcohollist[0].AlcoholDurationDate = $filter('date')(logalcohollist[0].AlcoholDurationDate, "MM-dd-yyyy");
                }


                if ((alcohollist[0].AlcoholType != logalcohollist[0].AlcoholType) || (alcohollist[0].AlcoholDurationDate != logalcohollist[0].AlcoholDurationDate) || (alcohollist[0].AlcoholDuration != logalcohollist[0].AlcoholDuration) || (alcohollist[0].AlcoholStatusId != logalcohollist[0].AlcoholStatusId)) {
                    var newparts = [];
                    var oldparts = [];
                    count++;

                    if (alcohollist[0].AlcoholType != logalcohollist[0].AlcoholType) {
                        if (alcohollist[0].AlcoholType) newparts.push('Alcohol Type :' + alcohollist[0].AlcoholType);
                        if (logalcohollist[0].AlcoholType) oldparts.push('Alcohol Type :' + logalcohollist[0].AlcoholType);

                    }
                    if (alcohollist[0].AlcoholDurationDate != logalcohollist[0].AlcoholDurationDate) {
                        if (alcohollist[0].AlcoholDurationDate) newparts.push('Alcohol DurationDate :' + alcohollist[0].AlcoholDurationDate);
                        if (logalcohollist[0].AlcoholDurationDate) oldparts.push('Alcohol DurationDate :' + logalcohollist[0].AlcoholDurationDate);
                    }
                    if ((alcohollist[0].AlcoholDuration != logalcohollist[0].AlcoholDuration) || (alcohollist[0].AlcoholDurationType != logalcohollist[0].AlcoholDurationType)) {
                        let newduration = formatDuration(alcohollist[0].AlcoholDuration, alcohollist[0].AlcoholDurationType)
                        let oldduration = formatDuration(logalcohollist[0].AlcoholDuration, logalcohollist[0].AlcoholDurationType)
                        if (newduration) newparts.push('Alcohol Duration :' + newduration);
                        if (oldduration) oldparts.push('Alcohol Duration :' + oldduration);
                    }
                    if (alcohollist[0].AlcoholStatusId != logalcohollist[0].AlcoholStatusId) {
                        if (alcohollist[0].AlcoholStatusName) newparts.push('Alcohol StatusName :' + alcohollist[0].AlcoholStatusName);
                        if (logalcohollist[0].AlcoholStatusName) oldparts.push('Alcohol StatusName :' + logalcohollist[0].AlcoholStatusName);
                    }
                    if (alcohollist[0].AlcoholQuantityId != logalcohollist[0].AlcoholQuantityId) {
                        if (alcohollist[0].AlcoholQuantityName) newparts.push('Alcohol QuantityName :' + alcohollist[0].AlcoholQuantityName);
                        if (logalcohollist[0].AlcoholQuantityName) oldparts.push('Alcohol QuantityName :' + logalcohollist[0].AlcoholQuantityName);
                    }
                    AlcoholData = newparts.join('\n ');
                    logAlcoholData = oldparts.join('\n ');
                }

            }
        }
        else if (alcohollist.length == 0 && logalcohollist.length > 0) {
            count++;
            var newparts = [];
            var oldparts = [];
            logalcohollist[0].AlcoholDuration = logalcohollist[0].AlcoholDuration || "";
            logalcohollist[0].AlcoholStatusId = logalcohollist[0].AlcoholStatusId || null;

            logalcohollist[0].AlcoholDurationDate = logalcohollist[0].AlcoholDurationDate || null;

            if (logalcohollist[0].AlcoholDurationDate !== null) {
                logalcohollist[0].AlcoholDurationDate = $filter('date')(logalcohollist[0].AlcoholDurationDate, "MM-dd-yyyy");
            }
            var oldparts = [];
            if (logalcohollist[0].AlcoholType) oldparts.push('Alcohol Type :' + logalcohollist[0].AlcoholType);
            if (logalcohollist[0].AlcoholDurationDate) oldparts.push('Alcohol DurationDate :' + logalcohollist[0].AlcoholDurationDate);
            let oldduration = formatDuration(logalcohollist[0].AlcoholDuration, logalcohollist[0].AlcoholDurationType)
            if (oldduration) oldparts.push('Alcohol Duration :' + oldduration);
            if (logalcohollist[0].AlcoholStatusName) oldparts.push('Alcohol StatusName :' + logalcohollist[0].AlcoholStatusName);
            if (logalcohollist[0].AlcoholQuantityName) oldparts.push('Alcohol QuantityName :' + logalcohollist[0].AlcoholQuantityName);
            AlcoholData = "";
            logAlcoholData = oldparts.join('\n ');
        }
        else if (alcohollist.length > 0 && logalcohollist.length == 0) {
            var newparts = [];

            alcohollist[0].AlcoholDuration = alcohollist[0].AlcoholDuration || "";
            alcohollist[0].AlcoholStatusId = alcohollist[0].AlcoholStatusId || null;
            alcohollist[0].AlcoholDurationDate = alcohollist[0].AlcoholDurationDate || null;

            if (alcohollist[0].AlcoholDurationDate !== null) {
                alcohollist[0].AlcoholDurationDate = $filter('date')(alcohollist[0].AlcoholDurationDate, "MM-dd-yyyy");
            }

            if (alcohollist[0].AlcoholType) newparts.push('Alcohol Type :' + alcohollist[0].AlcoholType);
            if (alcohollist[0].AlcoholDurationDate) newparts.push('Alcohol DurationDate :' + alcohollist[0].AlcoholDurationDate);

            let newduration = formatDuration(alcohollist[0].AlcoholDuration, alcohollist[0].AlcoholDurationType);
            if (newduration) newparts.push('Alcohol Duration :' + newduration);

            if (alcohollist[0].AlcoholStatusName) newparts.push('Alcohol StatusName :' + alcohollist[0].AlcoholStatusName);
            if (alcohollist[0].AlcoholQuantityName) newparts.push('Alcohol QuantityName :' + alcohollist[0].AlcoholQuantityName);

            AlcoholData = newparts.join('\n ');
            logAlcoholData = "";
        }


        if (druglist.length > 0 && logdruglist.length > 0) {
            if (druglist[0].DrugType == 'Yes') {
                var newparts = [];
                var oldparts = [];
                druglist[0].DrugArray = druglist[0].DrugArray || [];
                let saveddrug = druglist[0].DrugArray || [];
                let editdrugarray = logdruglist[0].DrugArray || [];
                let addedDrugs = [];
                let removedDrugs = [];
                let updatedNewDrugs = [];
                let updatedOldDrugs = [];
                if (saveddrug.length > 0) {
                    angular.forEach(saveddrug, function (sitem) {
                        var edited = editdrugarray.find(function (eitem) {
                            return ((eitem.HistoryHabitsId == sitem.HistoryHabitsId) && (sitem.ActiveInd == eitem.ActiveInd));
                        });
                        if (!edited) {
                            // New drug habit
                            if ((sitem.HabitsDescription) && (sitem.ActiveInd == 'Y')) {
                                addedDrugs.push(sitem.HabitsDescription);
                                count++;
                            }
                        } else {
                            if (sitem.HabitsDescription !== edited.HabitsDescription) {
                                if (sitem.HabitsDescription) updatedNewDrugs.push(sitem.HabitsDescription);
                                if (edited.HabitsDescription) updatedOldDrugs.push(edited.HabitsDescription);
                                count++;
                            }
                        }
                    })

                }
                angular.forEach(editdrugarray, function (eitem) {
                    var existsInNew = saveddrug.find(function (sitem) {
                        return ((eitem.HistoryHabitsId == sitem.HistoryHabitsId) && (sitem.ActiveInd == eitem.ActiveInd));
                    });

                    if (!existsInNew && eitem.HabitsDescription) {
                        removedDrugs.push(eitem.HabitsDescription);
                        count++;
                    }
                });
                if (addedDrugs.length > 0) {
                    newparts.push("Drugs : " + addedDrugs.join(', '));
                }
                if (removedDrugs.length > 0) {
                    oldparts.push("Drugs : " + removedDrugs.join(', '));
                }
                if (updatedNewDrugs.length > 0) {
                    newparts.push("Drugs: " + updatedNewDrugs.join(', '));
                }
                if (updatedOldDrugs.length > 0) {
                    oldparts.push("Drugs: " + updatedOldDrugs.join(', '));
                }
                DrugData = newparts.join(', ');
                logDrugData = oldparts.join(', ');


                druglist[0].DrugDurationDate = druglist[0].DrugDurationDate || null;
                logdruglist[0].DrugDurationDate = logdruglist[0].DrugDurationDate || null;

                if (druglist[0].DrugDurationDate !== null) {
                    druglist[0].DrugDurationDate = $filter('date')(druglist[0].DrugDurationDate, "MM-dd-yyyy");
                }
                if (logdruglist[0].DrugDurationDate !== null) {
                    logdruglist[0].DrugDurationDate = $filter('date')(logdruglist[0].DrugDurationDate, "MM-dd-yyyy");
                }
                druglist[0].DrugDuration = druglist[0].DrugDuration || 0;
                logdruglist[0].DrugDuration = logdruglist[0].DrugDuration || 0;

                if ((druglist[0].DrugDurationDate != logdruglist[0].DrugDurationDate) || (druglist[0].DrugDuration != logdruglist[0].DrugDuration) || (druglist[0].DrugQuantityId != logdruglist[0].DrugQuantityId) || (druglist[0].DrugType != logdruglist[0].DrugType)) {
                    count++;


                    if (druglist[0].DrugType != logdruglist[0].DrugType) {
                        if (druglist[0].DrugType) newparts.push('Drug Type :' + druglist[0].DrugType);
                        if (logdruglist[0].DrugType) oldparts.push('Drug Type :' + logdruglist[0].DrugType);

                    }
                    if (druglist[0].DrugDurationDate != logdruglist[0].DrugDurationDate) {
                        if (druglist[0].DrugDurationDate) newparts.push('Drug DurationDate :' + druglist[0].DrugDurationDate);
                        if (logdruglist[0].DrugDurationDate) oldparts.push('Drug DurationDate :' + logdruglist[0].DrugDurationDate);
                    }
                    if ((druglist[0].DrugDuration != logdruglist[0].DrugDuration) || (druglist[0].DrugDurationType != logdruglist[0].DrugDurationType)) {
                        let newduration = formatDuration(druglist[0].DrugDuration, druglist[0].DrugDurationType)
                        let oldduration = formatDuration(logdruglist[0].DrugDuration, logdruglist[0].DrugDurationType)
                        if (newduration) newparts.push('Drug Duration :' + newduration);
                        if (oldduration) oldparts.push('Drug Duration :' + oldduration);
                    }
                    DrugData = newparts.join('\n ');
                    logDrugData = oldparts.join('\n ');

                }
            }
            if (druglist[0].DrugType == 'No') {
                if (druglist[0].DrugType != logdruglist[0].DrugType) {

                    count++;
                    var newparts = [];
                    var oldparts = [];

                    let saveddrug = druglist[0].DrugArray || [];
                    let editdrugarray = logdruglist[0].DrugArray || [];
                    let addedDrugs = [];
                    let removedDrugs = [];
                    let updatedNewDrugs = [];
                    let updatedOldDrugs = [];
                    if (saveddrug.length > 0) {
                        angular.forEach(saveddrug, function (sitem) {
                            var edited = editdrugarray.find(function (eitem) {
                                return ((eitem.HistoryHabitsId == sitem.HistoryHabitsId) && (sitem.ActiveInd !== eitem.ActiveInd));
                            });
                            if (!edited) {
                                // New drug habit
                                if (sitem.HabitsDescription) {
                                    addedDrugs.push(sitem.HabitsDescription);
                                    count++;
                                }
                            } else {
                                if (sitem.ActiveInd !== edited.ActiveInd) {
                                    //if (sitem.HabitsDescription) updatedNewDrugs.push(sitem.HabitsDescription);
                                    if (edited.HabitsDescription) updatedOldDrugs.push(edited.HabitsDescription);
                                    count++;
                                }
                            }
                        })

                    }

                    
                    if (updatedNewDrugs.length > 0) {
                        newparts.push("Drugs: " + updatedNewDrugs.join(', '));
                    }
                    if (updatedOldDrugs.length > 0) {
                        oldparts.push("Drugs: " + updatedOldDrugs.join(', '));
                    }
                    DrugData = newparts.join(', ');
                    logDrugData = oldparts.join(', ');

                    if (druglist[0].DrugType) newparts.push('Drug Type :' + druglist[0].DrugType);
                    if (logdruglist[0].DrugType) oldparts.push('Drug Type :' + logdruglist[0].DrugType);
                    if (druglist[0].DrugDurationDate != logdruglist[0].DrugDurationDate) {
                        if (druglist[0].DrugDurationDate) newparts.push('Drug DurationDate :' + druglist[0].DrugDurationDate);
                        if (logdruglist[0].DrugDurationDate) oldparts.push('Drug DurationDate :' + logdruglist[0].DrugDurationDate);
                    }
                    if ((druglist[0].DrugDuration != logdruglist[0].DrugDuration) || (druglist[0].DrugDurationType != logdruglist[0].DrugDurationType)) {
                        let newduration = formatDuration(druglist[0].DrugDuration, druglist[0].DrugDurationType)
                        let oldduration = formatDuration(logdruglist[0].DrugDuration, logdruglist[0].DrugDurationType)
                        if (newduration) newparts.push('Drug Duration :' + newduration);
                        if (oldduration) oldparts.push('Drug Duration :' + oldduration);
                    }
                    DrugData = newparts.join('\n ');
                    logDrugData = oldparts.join('\n ');
                }
            }
        }
        else if (druglist.length == 0 && logdruglist.length > 0) {
            count++;
            var newparts = [];
            var oldparts = [];
            logdruglist[0].DrugArray = logdruglist[0].DrugArray || [];
            let removedDrugs = [];
            let editdrugarray = logdruglist[0].DrugArray || [];
            if (editdrugarray.length > 0) {
                angular.forEach(editdrugarray, function (eitem) {
                    if (eitem.HabitsDescription) {
                        removedDrugs.push(eitem.HabitsDescription);
                    }
                });
            }
            if (removedDrugs.length > 0) {
                oldparts.push("Drugs : " + removedDrugs.join(', '));
            }
            DrugData = "";
            logDrugData = oldparts.join(', ');

            logdruglist[0].DrugDurationDate = logdruglist[0].DrugDurationDate || null;
            if (logdruglist[0].DrugDurationDate !== null) {
                logdruglist[0].DrugDurationDate = $filter('date')(logdruglist[0].DrugDurationDate, "MM-dd-yyyy");
            }
            logdruglist[0].DrugDuration = logdruglist[0].DrugDuration || 0;

            if (logdruglist[0].DrugType) oldparts.push('Drug Type :' + logdruglist[0].DrugType);
            if (logdruglist[0].DrugDurationDate) oldparts.push('Drug DurationDate :' + logdruglist[0].DrugDurationDate);
            let oldduration = formatDuration(logdruglist[0].DrugDuration, logdruglist[0].DrugDurationType)
            if (oldduration) oldparts.push('Drug Duration :' + oldduration);
            DrugData = "";
            logDrugData = oldparts.join('\n ');
        }
        else if (druglist.length > 0 && logdruglist.length == 0) {
            var newparts = [];
            druglist[0].DrugArray = druglist[0].DrugArray || [];
            let addedDrugs = [];
            let saveddrug = druglist[0].DrugArray || [];

            if (saveddrug.length > 0) {
                angular.forEach(saveddrug, function (sitem) {
                    if (sitem.HabitsDescription && sitem.ActiveInd == 'Y') {
                        addedDrugs.push(sitem.HabitsDescription);
                    }
                });
            }

            if (addedDrugs.length > 0) {
                newparts.push("Drugs : " + addedDrugs.join(', '));
            }

            druglist[0].DrugDurationDate = druglist[0].DrugDurationDate || null;
            if (druglist[0].DrugDurationDate !== null) {
                druglist[0].DrugDurationDate = $filter('date')(druglist[0].DrugDurationDate, "MM-dd-yyyy");
            }
            druglist[0].DrugDuration = druglist[0].DrugDuration || 0;

            if (druglist[0].DrugType) newparts.push('Drug Type :' + druglist[0].DrugType);
            if (druglist[0].DrugDurationDate) newparts.push('Drug DurationDate :' + druglist[0].DrugDurationDate);
            let newduration = formatDuration(druglist[0].DrugDuration, druglist[0].DrugDurationType)
            if (newduration) newparts.push('Drug Duration :' + newduration);

            DrugData = newparts.join('\n ');
            logDrugData = "";   
        }


        if (smokinglist.length > 0 && logsmokinglist.length > 0) {
            if (smokinglist[0].SmokingType == 'Yes') {
                smokinglist[0].SmokingQuantityId = smokinglist[0].SmokingQuantityId || null;
                logsmokinglist[0].SmokingQuantityId = logsmokinglist[0].SmokingQuantityId || null;

                smokinglist[0].DeleteInd = smokinglist[0].DeleteInd || 'N';
                logsmokinglist[0].DeleteInd = logsmokinglist[0].DeleteInd || 'N';

                smokinglist[0].SmokingStatusId = smokinglist[0].SmokingStatusId || null;
                logsmokinglist[0].SmokingStatusId = logsmokinglist[0].SmokingStatusId || null;

                smokinglist[0].SmokingFromDate = smokinglist[0].SmokingFromDate || null;
                logsmokinglist[0].SmokingFromDate = logsmokinglist[0].SmokingFromDate || null;

                if (smokinglist[0].SmokingFromDate !== null) {
                    smokinglist[0].SmokingFromDate = $filter('date')(smokinglist[0].SmokingFromDate, "MM-dd-yyyy");
                }
                if (logsmokinglist[0].SmokingFromDate !== null) {
                    logsmokinglist[0].SmokingFromDate = $filter('date')(logsmokinglist[0].SmokingFromDate, "MM-dd-yyyy");
                }

                smokinglist[0].SmokingDuration = smokinglist[0].SmokingDuration || '';
                logsmokinglist[0].SmokingDuration = logsmokinglist[0].SmokingDuration || '';

                if ((smokinglist[0].SmokingType != logsmokinglist[0].SmokingType) || (logsmokinglist[0].SmokingQuantityId !== smokinglist[0].SmokingQuantityId) || (smokinglist[0].DeleteInd !== logsmokinglist[0].DeleteInd) || (smokinglist[0].SmokingStatusId !== logsmokinglist[0].SmokingStatusId) || (smokinglist[0].SmokingFromDate !== logsmokinglist[0].SmokingFromDate) || (smokinglist[0].SmokingDuration !== logsmokinglist[0].SmokingDuration)) {
                    var newparts = [];
                    var oldparts = [];
                    count++;


                    if (smokinglist[0].SmokingType != logsmokinglist[0].SmokingType) {
                        if (smokinglist[0].SmokingType) newparts.push('Smoking Type :' + smokinglist[0].SmokingType);
                        if (logsmokinglist[0].SmokingType) oldparts.push('Smoking Type :' + logsmokinglist[0].SmokingType);

                    }
                    if (smokinglist[0].SmokingFromDate != logsmokinglist[0].SmokingFromDate) {
                        if (smokinglist[0].SmokingFromDate) newparts.push('Smoking Date :' + smokinglist[0].SmokingFromDate);
                        if (logsmokinglist[0].SmokingFromDate) oldparts.push('Smoking Date :' + logsmokinglist[0].SmokingFromDate);
                    }
                    if ((smokinglist[0].SmokingDuration != logsmokinglist[0].SmokingDuration) || (smokinglist[0].SmokingDurationType != logsmokinglist[0].SmokingDurationType)) {
                        let newduration = formatDuration(smokinglist[0].SmokingDuration, smokinglist[0].SmokingDurationType)
                        let oldduration = formatDuration(logsmokinglist[0].SmokingDuration, logsmokinglist[0].SmokingDurationType)
                        if (newduration) newparts.push('Smoking Duration :' + newduration);
                        if (oldduration) oldparts.push('Smoking Duration :' + oldduration);
                    }
                    if (smokinglist[0].SmokingStatusId != logsmokinglist[0].SmokingStatusId) {
                        if (smokinglist[0].SmokingStatusName) newparts.push('Smoking StatusName :' + smokinglist[0].SmokingStatusName);
                        if (logsmokinglist[0].SmokingStatusName) oldparts.push('Smoking StatusName :' + logsmokinglist[0].SmokingStatusName);
                    }
                    if (smokinglist[0].SmokingQuantityId != logsmokinglist[0].SmokingQuantityId) {
                        if (smokinglist[0].SmokingQuantityName) newparts.push('Smoking QuantityName :' + smokinglist[0].SmokingQuantityName);
                        if (logsmokinglist[0].SmokingQuantityName) oldparts.push('Smoking QuantityName :' + logsmokinglist[0].SmokingQuantityName);
                    }

                    SmokingData = newparts.join('\n ');
                    logSmokingData = oldparts.join('\n ');
                }

            }
            if (smokinglist[0].SmokingType == 'No') {
                smokinglist[0].DeleteInd = smokinglist[0].DeleteInd || 'N';
                logsmokinglist[0].DeleteInd = logsmokinglist[0].DeleteInd || 'N';

                smokinglist[0].SmokingStatusId = smokinglist[0].SmokingStatusId || null;
                logsmokinglist[0].SmokingStatusId = logsmokinglist[0].SmokingStatusId || null;

                smokinglist[0].SmokingFromDate = smokinglist[0].SmokingFromDate || null;
                logsmokinglist[0].SmokingFromDate = logsmokinglist[0].SmokingFromDate || null;
                if (smokinglist[0].SmokingFromDate !== null) {
                    smokinglist[0].SmokingFromDate = $filter('date')(smokinglist[0].SmokingFromDate, "MM-dd-yyyy");
                }
                if (logsmokinglist[0].SmokingFromDate !== null) {
                    logsmokinglist[0].SmokingFromDate = $filter('date')(logsmokinglist[0].SmokingFromDate, "MM-dd-yyyy");
                }

                smokinglist[0].SmokingDuration = smokinglist[0].SmokingDuration || '';
                logsmokinglist[0].SmokingDuration = logsmokinglist[0].SmokingDuration || '';

                if ((smokinglist[0].SmokingType != logsmokinglist[0].SmokingType)||(smokinglist[0].DeleteInd !== logsmokinglist[0].DeleteInd) || (smokinglist[0].SmokingStatusId !== logsmokinglist[0].SmokingStatusId) || (smokinglist[0].SmokingFromDate !== logsmokinglist[0].SmokingFromDate) || (smokinglist[0].SmokingDuration !== logsmokinglist[0].SmokingDuration)) {
                    count++;
                    var newparts = [];
                    var oldparts = [];


                    if (smokinglist[0].SmokingType != logsmokinglist[0].SmokingType) {
                        if (smokinglist[0].SmokingType) newparts.push('Smoking Type :' + smokinglist[0].SmokingType);
                        if (logsmokinglist[0].SmokingType) oldparts.push('Smoking Type :' + logsmokinglist[0].SmokingType);

                    }
                    if (smokinglist[0].SmokingFromDate != logsmokinglist[0].SmokingFromDate) {
                        if (smokinglist[0].SmokingFromDate) newparts.push('Smoking Date :' + smokinglist[0].SmokingFromDate);
                        if (logsmokinglist[0].SmokingFromDate) oldparts.push('Smoking Date :' + logsmokinglist[0].SmokingFromDate);
                    }
                    if ((smokinglist[0].SmokingDuration != logsmokinglist[0].SmokingDuration) || (smokinglist[0].SmokingDurationType != logsmokinglist[0].SmokingDurationType)) {
                        let newduration = formatDuration(smokinglist[0].SmokingDuration, smokinglist[0].SmokingDurationType)
                        let oldduration = formatDuration(logsmokinglist[0].SmokingDuration, logsmokinglist[0].SmokingDurationType)
                        if (newduration) newparts.push('Smoking Duration :' + newduration);
                        if (oldduration) oldparts.push('Smoking Duration :' + oldduration);
                    }
                    if (smokinglist[0].SmokingStatusId != logsmokinglist[0].SmokingStatusId) {
                        if (smokinglist[0].SmokingStatusName) newparts.push('Smoking StatusName :' + smokinglist[0].SmokingStatusName);
                        if (logsmokinglist[0].SmokingStatusName) oldparts.push('Smoking StatusName :' + logsmokinglist[0].SmokingStatusName);
                    }
                    if (smokinglist[0].SmokingQuantityId != logsmokinglist[0].SmokingQuantityId) {
                        if (smokinglist[0].SmokingQuantityName) newparts.push('Smoking QuantityName :' + smokinglist[0].SmokingQuantityName);
                        if (logsmokinglist[0].SmokingQuantityName) oldparts.push('Smoking QuantityName :' + logsmokinglist[0].SmokingQuantityName);
                    }
                    SmokingData = newparts.join('\n ');
                    logSmokingData = oldparts.join('\n');
                }
            }
        }
        else if (smokinglist.length == 0 && logsmokinglist.length > 0) {
            count++;
            logsmokinglist[0].SmokingQuantityId = logsmokinglist[0].SmokingQuantityId || null;

            logsmokinglist[0].DeleteInd = logsmokinglist[0].DeleteInd || 'N';

            logsmokinglist[0].SmokingStatusId = logsmokinglist[0].SmokingStatusId || null;

            logsmokinglist[0].SmokingFromDate = logsmokinglist[0].SmokingFromDate || null;

            if (logsmokinglist[0].SmokingFromDate !== null) {
                logsmokinglist[0].SmokingFromDate = $filter('date')(logsmokinglist[0].SmokingFromDate, "MM-dd-yyyy");
            }

            logsmokinglist[0].SmokingDuration = logsmokinglist[0].SmokingDuration || '';
            var oldparts = [];
            if (logsmokinglist[0].SmokingType) oldparts.push('Smoking Type :' + logsmokinglist[0].SmokingType);
            if (logsmokinglist[0].SmokingFromDate) oldparts.push('Smoking Date :' + logsmokinglist[0].SmokingFromDate);
            let oldduration = formatDuration(logsmokinglist[0].SmokingDuration, logsmokinglist[0].SmokingDurationType)
            if (oldduration) oldparts.push('Smoking Duration :' + oldduration);
            if (logsmokinglist[0].SmokingStatusName) oldparts.push('Smoking StatusName :' + logsmokinglist[0].SmokingStatusName);
            if (logsmokinglist[0].SmokingQuantityName) oldparts.push('Smoking QuantityName :' + logsmokinglist[0].SmokingQuantityName);
            SmokingData = "";
            logSmokingData = oldparts.join('\n');
        }
        else if (smokinglist.length > 0 && logsmokinglist.length == 0) {
            var newparts = [];

            smokinglist[0].SmokingQuantityId = smokinglist[0].SmokingQuantityId || null;
            smokinglist[0].DeleteInd = smokinglist[0].DeleteInd || 'N';
            smokinglist[0].SmokingStatusId = smokinglist[0].SmokingStatusId || null;
            smokinglist[0].SmokingFromDate = smokinglist[0].SmokingFromDate || null;

            if (smokinglist[0].SmokingFromDate !== null) {
                smokinglist[0].SmokingFromDate = $filter('date')(smokinglist[0].SmokingFromDate, "MM-dd-yyyy");
            }

            smokinglist[0].SmokingDuration = smokinglist[0].SmokingDuration || '';

            if (smokinglist[0].SmokingType) newparts.push('Smoking Type :' + smokinglist[0].SmokingType);
            if (smokinglist[0].SmokingFromDate) newparts.push('Smoking Date :' + smokinglist[0].SmokingFromDate);
            let newduration = formatDuration(smokinglist[0].SmokingDuration, smokinglist[0].SmokingDurationType);
            if (newduration) newparts.push('Smoking Duration :' + newduration);
            if (smokinglist[0].SmokingStatusName) newparts.push('Smoking StatusName :' + smokinglist[0].SmokingStatusName);
            if (smokinglist[0].SmokingQuantityName) newparts.push('Smoking QuantityName :' + smokinglist[0].SmokingQuantityName);

            SmokingData = newparts.join('\n');
            logSmokingData = "";
        }

        if (psychislist.length > 0 && logpsychislist.length > 0) {
            if (psychislist[0].PsychisType != logpsychislist[0].PsychisType) {
                count++;
                var newparts = [];
                var oldparts = [];

                if (psychislist[0].PsychisType) newparts.push('Psychis Type :' + psychislist[0].PsychisType);
                if (logpsychislist[0].PsychisType) oldparts.push('Psychis Type :' + logpsychislist[0].PsychisType);
                psychisData = newparts.join('\n ');
                logpsychisData = oldparts.join('\n ');
            }

        }
        else if (psychislist.length == 0 && logpsychislist.length > 0) {
            count++;
            var oldparts = [];
            if (logpsychislist[0].PsychisType) oldparts.push('Psychis Type :' + logpsychislist[0].PsychisType);
            psychisData = "";
            logpsychisData = oldparts.join('\n ');
        }
        else if (psychislist.length > 0 && logpsychislist.length == 0) {
            var newparts = [];
            if (psychislist[0].PsychisType) newparts.push('Psychis Type :' + psychislist[0].PsychisType);
            psychisData = newparts.join('\n ');
            logpsychisData = "";
        }

        let newArr = [];
        if (SmokingData) newArr.push(SmokingData);
        if (AlcoholData) newArr.push(AlcoholData);
        if (DrugData) newArr.push(DrugData);
        if (psychisData) newArr.push(psychisData);
        newvalue = newArr.join('\n');

       
        let oldArr = [];
        if (logSmokingData) oldArr.push(logSmokingData);
        if (logAlcoholData) oldArr.push(logAlcoholData);
        if (logDrugData) oldArr.push(logDrugData);
        if (logpsychisData) oldArr.push(logpsychisData);

        oldvalue = oldArr.length > 0 ? oldArr.join('\n') : '';



        var ActionType = "Edited";
        if (IsUserAlreadyAddedCCList.length === 0 && oldvalue === '') {
            ActionType = "Added";
        }


        if (count != 0) {
            let obj = {
                "LogId": 0,
                "ModuleId": 2,
                "ModuleName": "ASC",
                "SubModuleId": 3,
                "SubModuleName": "ROS",
                "ScreenType": "ROS",
                "ActionType": ActionType,
                "OldActionDescription": oldvalue,
                "NewActionDescription": newvalue,
                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            };
            $scope.LogObj.LogArray.push(obj);
        }

    }

    $scope.compareSystemicHistory = function (Addedsystmic) {
        Addedsystmic = Addedsystmic || [];
        $scope.LogObj.SystemicHistory = $scope.LogObj.SystemicHistory || [];
        const userOldSystemicHistory = $filter("filter")($scope.LogObj.SystemicHistory, { "CreatedBy": $scope.UserId }, true) || [];

        let count = 0;
        let dltcount = 0;
        let dltallergyNames = '';
        let DifferenceItem = [];

        angular.forEach(Addedsystmic, function (item) {
            item.DurationDate = $filter('date')(item.DurationDate, 'MM-dd-yyyy') || null;
            item.SeverityId = item.SeverityId || null;
            item.Duration = item.Duration || null;
            if (item.DeleteInd === 'Y') {
                if (dltcount > 0) dltallergyNames += ', ';
                dltallergyNames += item.HistoryName;
                dltcount++;
            } else {
                let edited = $scope.LogObj.SystemicHistory.filter(function (eitem) {
                    eitem.DurationDate = $filter('date')(eitem.DurationDate, 'MM-dd-yyyy') || null;
                    eitem.SeverityId = eitem.SeverityId || null;
                    eitem.Duration = eitem.Duration || null;
                    return (
                        eitem.HistoryId == item.HistoryId &&
                        eitem.SeverityId == item.SeverityId &&
                        eitem.StatusId == item.StatusId &&
                        eitem.Duration === item.Duration &&
                        eitem.Remarks === item.Remarks &&
                        eitem.DurationDate == item.DurationDate
                    );
                });

                if (edited.length === 0) {
                    DifferenceItem.push(item);
                    count++;
                }
            }
        });

        // Edited log
        if (count > 0 || $scope.HealthPhysicalObj.CardiacNotes != '' || $scope.HealthPhysicalObj.PulmonaryNotes != '' || $scope.HealthPhysicalObj.NeurologicNotes != '' || $scope.HealthPhysicalObj.HepaticNotes != '' || $scope.HealthPhysicalObj.HemeOncNotes != '' || $scope.HealthPhysicalObj.KidneyDiseaseNotes != '' || $scope.HealthPhysicalObj.MusculoSkeletalSystemNotes != '' || $scope.HealthPhysicalObj.EndocrineNotes != '') {
            let Affecteditem = '';
            let OldAffecteditem = '';

            if (count > 0) {
               
                angular.forEach(DifferenceItem, function (itemA) {
                    let newLine = `Past Medical History - ${itemA.HistoryName}`;
                    if (itemA.Duration) {
                        let unit = '';
                        switch (itemA.DurationType) {
                            case 'D':
                                unit = 'Days';
                                break;
                            case 'W':
                                unit = 'Weeks';
                                break;
                            case 'M':
                                unit = 'Months';
                                break;
                            case 'Y':
                                unit = 'Years';
                                break;
                            case 'SB':
                                unit = 'Since Birth';
                                break;
                        }

                        if (itemA.DurationType === 'SB') {
                            newLine += `, Duration: Since Birth`;
                        } else {
                            newLine += `, Duration: ${itemA.Duration} ${unit}`;
                        }
                    }
                    if (itemA.DurationDate) newLine += `, Onset: ${itemA.DurationDate}`;
                    if (itemA.SeverityId) {
                        let tempArray = $filter('filter')($scope.ROSocularSeverity, { 'ROSAllergySeverityId': itemA.SeverityId }, true);
                        if (tempArray.length > 0) {
                            newLine += `, Severity: ${tempArray[0].AllergySeverity}`;
                        }
                    }
                    if (itemA.StatusId) {
                        let tempArray = $filter('filter')($scope.ROSAllergyStatus, { 'ROSAllergyStatusId': itemA.StatusId }, true);
                        if (tempArray.length > 0) {
                            newLine += `, Status: ${tempArray[0].AllergyStatus}`;
                        }
                    }
                    if (itemA.Remarks) newLine += `, Notes: ${itemA.Remarks}`;

                    Affecteditem += `\n${newLine.toUpperCase()}`;

                    let matchedOld = $scope.LogObj.SystemicHistory.find(itemB => itemB.HistoryId === itemA.HistoryId);
                    if (matchedOld) {
                        let oldLine = `Past Medical History - ${matchedOld.HistoryName}`;
                        if (matchedOld.Duration) {
                            let unit = '';
                            switch (matchedOld.DurationType) {
                                case 'D':
                                    unit = 'Days';
                                    break;
                                case 'W':
                                    unit = 'Weeks';
                                    break;
                                case 'M':
                                    unit = 'Months';
                                    break;
                                case 'Y':
                                    unit = 'Years';
                                    break;
                                case 'SB':
                                    unit = 'Since Birth';
                                    break;
                            }

                            if (matchedOld.DurationType === 'SB') {
                                oldLine += `, Duration: Since Birth`;
                            } else {
                                oldLine += `, Duration: ${matchedOld.Duration} ${unit}`;
                            }
                        }
                        if (matchedOld.DurationDate) oldLine += `, Onset: ${matchedOld.DurationDate}`;

                        if (matchedOld.SeverityId) {
                            let oldType = $filter('filter')($scope.ROSocularSeverity, { 'ROSAllergySeverityId': matchedOld.SeverityId }, true);
                            if (oldType.length > 0) oldLine += `, Severity: ${oldType[0].AllergySeverity}`;
                        }

                        if (matchedOld.StatusId) {
                            let oldType = $filter('filter')($scope.ROSAllergyStatus, { 'ROSAllergyStatusId': matchedOld.StatusId }, true);
                            if (oldType.length > 0) oldLine += `, Status: ${oldType[0].AllergyStatus}`;
                        }
                        if (matchedOld.Remarks) oldLine += `, Notes: ${matchedOld.Remarks}`;

                        OldAffecteditem += `\n${oldLine.toUpperCase()}`;
                    }
                });
            }
            if ($scope.HealthPhysicalObj.CardiacNotes != $scope.LogObj.CardiacNotes) {
                if ($scope.HealthPhysicalObj.CardiacNotes)
                    Affecteditem += `, Cardiac Notes: ${$scope.HealthPhysicalObj.CardiacNotes}`;
                    if ($scope.LogObj.CardiacNotes)
                        OldAffecteditem += `, Cardiac Notes: ${$scope.LogObj.CardiacNotes}`;
                }
            if ($scope.HealthPhysicalObj.PulmonaryNotes != $scope.LogObj.PulmonaryNotes) {
                if ($scope.HealthPhysicalObj.PulmonaryNotes)
                    Affecteditem += `,Pulmonary Notes: ${$scope.HealthPhysicalObj.PulmonaryNotes}`;
                    if ($scope.LogObj.CardiacNotes)
                        OldAffecteditem += `, Cardiac Notes: ${$scope.LogObj.CardiacNotes}`;
                }
            if ($scope.HealthPhysicalObj.NeurologicNotes != $scope.LogObj.NeurologicNotes) {
                if ($scope.HealthPhysicalObj.NeurologicNotes)
                    Affecteditem += `, Neurologic Notes: ${$scope.HealthPhysicalObj.NeurologicNotes}`;
                    if ($scope.LogObj.CardiacNotes)
                        OldAffecteditem += `, Cardiac Notes: ${$scope.LogObj.CardiacNotes}`;
                }
            if ($scope.HealthPhysicalObj.HepaticNotes != $scope.LogObj.HepaticNotes) {
                if ($scope.HealthPhysicalObj.HepaticNotes)
                    Affecteditem += `, Hepatic Notes: ${$scope.HealthPhysicalObj.HepaticNotes}`;
                    if ($scope.LogObj.HepaticNotes)
                        OldAffecteditem += `, Cardiac Notes: ${$scope.LogObj.HepaticNotes}`;
                }
            if ($scope.HealthPhysicalObj.HemeOncNotes != $scope.LogObj.HemeOncNotes) {
                if ($scope.HealthPhysicalObj.HemeOncNotes)
                    Affecteditem += `, Heme One Notes: ${$scope.HealthPhysicalObj.HemeOncNotes}`;
                    if ($scope.LogObj.CardiacNotes)
                        OldAffecteditem += `, Cardiac Notes: ${$scope.LogObj.CardiacNotes}`;
                }
            if ($scope.HealthPhysicalObj.KidneyDiseaseNotes != $scope.LogObj.KidneyDiseaseNotes) {
                if ($scope.HealthPhysicalObj.KidneyDiseaseNotes)
                    Affecteditem += `, Kidney Disease Notes: ${$scope.HealthPhysicalObj.KidneyDiseaseNotes}`;
                    if ($scope.LogObj.CardiacNotes)
                        OldAffecteditem += `, Cardiac Notes: ${$scope.LogObj.CardiacNotes}`;
                }
            if ($scope.HealthPhysicalObj.MusculoSkeletalSystemNotes != $scope.LogObj.MusculoSkeletalSystemNotes) {
                if ($scope.HealthPhysicalObj.MusculoSkeletalSystemNotes)
                    Affecteditem += `, Musculoskeletal Notes: ${$scope.HealthPhysicalObj.MusculoSkeletalSystemNotes}`;
                    if ($scope.LogObj.CardiacNotes)
                        OldAffecteditem += `, Cardiac Notes: ${$scope.LogObj.CardiacNotes}`;
                }
            if ($scope.HealthPhysicalObj.EndocrineNotes != $scope.LogObj.EndocrineNotes) {
                if ($scope.HealthPhysicalObj.EndocrineNotes)
                    Affecteditem += `, Endocrine Notes: ${$scope.HealthPhysicalObj.EndocrineNotes}`;
                    if ($scope.LogObj.CardiacNotes)
                        OldAffecteditem += `, Cardiac Notes: ${$scope.LogObj.CardiacNotes}`;
            }
            let actionType = 'Edited';
            if (userOldSystemicHistory.length === 0 && OldAffecteditem === '') {
                actionType = 'Added';
            } 

            if (Affecteditem || OldAffecteditem) {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 3,
                    "SubModuleName": "ROS",
                    "ScreenType": "ROS",
                    "ActionType": actionType,
                    "OldActionDescription": OldAffecteditem.trim(),
                    "NewActionDescription": Affecteditem.trim(),
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            } 
        }

            if (dltcount != 0) {
                let description = (dltcount === 1)
                    ? `Past Medical History - ${dltallergyNames.toUpperCase()}`
                    : `Past Medical History - ${dltallergyNames.toUpperCase()}`;

                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 3,
                    "SubModuleName": "ROS",
                    "ScreenType": "ROS",
                    "ActionType": "Deleted",
                    "OldActionDescription": description,
                    "NewActionDescription": '',
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        
    }



    $scope.SaveROS = function () {
        $scope.obj.type = "RosHistory";
        $scope.LogObj.LogArray = [];

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


        let TypeId = 9;
        let TypeName = "PreOpCall";

        let rossubmitreq = {
            "VisitId": $scope.appointmentInfo.Visitid || 0, //$scope.cacheStorageItem.PatientVisitId
            "PatientId": $scope.appointmentInfo.PatientID,
            //"ConsultationID": 0,
            "AppointmentID": $scope.appointmentInfo.AppointmentID,
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
            "LifestyleHistoryRemarks": $scope.obj.LifestyleHistoryRemarks,
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
            "Logs": {},

        }
        if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                if (item.IsNormal == true && item.IsChecked == true) {
                    item.IsNoshowROS = true;
                }
                item.PatientDetailId = item.PatientDetailId || 0;
                item.TypeId = item.TypeId || null;
                item.Value = item.Value || "";
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


        if (rossubmitreq.AllergyItems.length > 0) {
            if ($scope.LogObj.AllergyItems.length > 0) {

                $scope.compareAllergyItems();
            } else {
                let AllergyDetails = rossubmitreq.AllergyItems.map(function (item) {
                    let details = `Allergy: ${item.AllergyName}`;
                    //if (item.ReactionName) {
                    //    details += `, Allergy Reaction: ${item.ReactionName}`;
                    //}
                    var reactionNames = $scope.GetReactionNames(item);
                    if (reactionNames) {
                        details += `, Allergy Reaction: ${reactionNames}`;
                    }
                    if (item.AllergyTypeId) {
                        let tempArray = $filter('filter')($scope.ROSAllergyType, { 'ROSAllergyTypeId': item.AllergyTypeId }, true);
                        if (tempArray.length > 0) {
                            details += `, Allergy Type: ${tempArray[0].AllergyType}`;
                        }
                    }
                    if (item.Duration) {
                        let unit = '';
                        switch (item.DurationType) {
                            case 'D':
                                unit = 'Days';
                                break;
                            case 'W':
                                unit = 'Weeks';
                                break;
                            case 'M':
                                unit = 'Months';
                                break;
                            case 'Y':
                                unit = 'Years';
                                break;
                            case 'SB':
                                unit = 'Since Birth';
                                break;
                        }

                        if (item.DurationType === 'SB') {
                            details += `, Duration: Since Birth`;
                        } else {
                            details += `, Duration: ${item.Duration} ${unit}`;
                        }
                    }
                    if (item.DurationDate) {
                        details += `, Onset: ${item.DurationDate}`;
                    }
                    if (item.SeverityName && item.SeverityName.trim() !== '') {
                        details += `, Severity: ${item.SeverityName}`;
                    }
                    if (item.StatusName) {
                        details += `, Status: ${item.StatusName}`;
                    }
                    if (item.Remarks) {
                        details += `, Notes: ${item.Remarks}`;
                    }
                    return details;
                }).join('\n');

                let description = '';
               
                if (rossubmitreq.AllergyItems.length > 1) {
                    description = `Allergies - ${AllergyDetails.toUpperCase()}`;
                } else if (rossubmitreq.AllergyItems.length === 1) {
                    description = `Allergy - ${AllergyDetails.toUpperCase()}`;
                }
                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 3,
                    "SubModuleName": "Ros",
                    "ScreenType": "ROS",
                    "ActionType": "Added",
                    "OldActionDescription": '',
                    "NewActionDescription": description.trim(),
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }

        }
        if (rossubmitreq.SurgicalHistory.length > 0) {
            if ($scope.LogObj.SurgicalHistory.length > 0) {

                $scope.compareSurgicalHistory();
            } else {
                let AllergyDetails = rossubmitreq.SurgicalHistory.map(function (item) {
                    let details = `${item.HistoryName}`;
                   
                    if (item.ModifierId) {
                        let tempArray = $filter('filter')($scope.ROSModifiers, { 'MODIFIERID': item.ModifierId }, true);
                        if (tempArray.length > 0) {
                            details += `, Modifier: ${tempArray[0].DESCRIPTION1}`;
                        }
                    }
                    if (item.Duration) {
                        let unit = '';
                        switch (item.DurationType) {
                            case 'D':
                                unit = 'Days';
                                break;
                            case 'W':
                                unit = 'Weeks';
                                break;
                            case 'M':
                                unit = 'Months';
                                break;
                            case 'Y':
                                unit = 'Years';
                                break;
                            case 'SB':
                                unit = 'Since Birth';
                                break;
                        }

                        if (item.DurationType === 'SB') {
                            details += `, Duration: Since Birth`;
                        } else {
                            details += `, Duration: ${item.Duration} ${unit}`;
                        }
                    }
                    if (item.DurationDate) {
                        details += `, Onset: ${item.DurationDate}`;
                    }
                    if (item.Remarks) {
                        details += `, Notes: ${item.Remarks}`;
                    }
                    return details;
                }).join('\n');

                // Create log object for each allergy item
                let description = '';
                if (rossubmitreq.SurgicalHistory.length > 1) {
                    description = `Surgical History - ${AllergyDetails.toUpperCase()}`;
                } else if (rossubmitreq.SurgicalHistory.length === 1) {
                    description = `Surgical History - ${AllergyDetails.toUpperCase()}`;
                }
                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 3,
                    "SubModuleName": "ROS",
                    "ScreenType": "ROS",
                    "ActionType": "Added",
                    "OldActionDescription": '',
                    "NewActionDescription": description,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }

        }

        let tempCurrentSystemicMedicationsHistory = $filter('filter')(rossubmitreq.CurrentSystemicMedicationsHistory, { 'MedicationLocationTypeId': 2 }, true) || [];

        if (tempCurrentSystemicMedicationsHistory.length > 0) {
            if ($scope.LogObj.CurrentSystemicMedicationsHistory.length > 0) {

                $scope.compareCurrentSystemicMedicationsHistory(tempCurrentSystemicMedicationsHistory);
            } else {
                let medicineDescriptions = tempCurrentSystemicMedicationsHistory.map(function (item) {
                    let medicineInfo = item.MedicineName;
                    item.Sig = item.Sig || '';
                    item.StartDate = item.StartDate ? $filter('date')(item.StartDate, 'MM-dd-yyyy') : null;

                    if (item.Sig !== '') {
                        medicineInfo += ' Sig:' + item.Sig;
                    }
                    if (item.StartDate) {
                        medicineInfo += ' StartDate:' + item.StartDate;
                    }

                    return medicineInfo;
                }).join(', ');

                let description = `Current Systemic Medications - ${medicineDescriptions.toUpperCase()}`;

                let obj = {
                    LogId: 0,
                    ModuleId: 2,
                    ModuleName: "ASC",
                    SubModuleId: 3,
                    SubModuleName: "ROS",
                    ScreenType: "ROS",
                    ActionType: "Added",
                    OldActionDescription: '',
                    NewActionDescription: description,
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }

        }

        let tempCurrentEyeMedicationsList = $filter('filter')(rossubmitreq.CurrentSystemicMedicationsHistory, { 'MedicationLocationTypeId': 1 }, true) || [];
        if (tempCurrentEyeMedicationsList.length > 0) {
            if ($scope.LogObj.CurrentEyeMedications.length > 0) {
               
                $scope.compareCurrentEyeMedications(tempCurrentEyeMedicationsList);
            } else {
                let allergyNames = tempCurrentEyeMedicationsList.map(function (item) {
                    let medicineInfo = item.MedicineName;
                    item.Sig = item.Sig || '';
                    item.StartDate = item.StartDate ? $filter('date')(item.StartDate, 'MM-dd-yyyy') : null;

                    if (item.Sig !== '') {
                        medicineInfo += ' Sig:' + item.Sig;
                    }
                    if (item.StartDate) {
                        medicineInfo += ' StartDate:' + item.StartDate;
                    }

                    return medicineInfo;
                }).join(', ');

                let description = `Current Eye Medications - ${allergyNames.toUpperCase()}`;

                let obj = {
                    LogId: 0,
                    ModuleId: 2,
                    ModuleName: "ASC",
                    SubModuleId: 3,
                    SubModuleName: "ROS",
                    ScreenType: "ROS",
                    ActionType: "Added",
                    OldActionDescription: '',
                    NewActionDescription: description,
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }


       

        if (rossubmitreq.SystemicHistory.length > 0) {
            if ($scope.LogObj.SystemicHistory.length > 0) {
                $scope.compareSystemicHistory(rossubmitreq.SystemicHistory);
            } else {
                let AllergyDetails = rossubmitreq.SystemicHistory.map(function (item) {
                    let details = `${item.HistoryName}`;

                    if (item.Duration) {
                        let unit = '';
                        switch (item.DurationType) {
                            case 'D':
                                unit = 'Days';
                                break;
                            case 'W':
                                unit = 'Weeks';
                                break;
                            case 'M':
                                unit = 'Months';
                                break;
                            case 'Y':
                                unit = 'Years';
                                break;
                            case 'SB':
                                unit = 'Since Birth';
                                break;
                        }

                        if (item.DurationType === 'SB') {
                            details += `, Duration: Since Birth`;
                        } else {
                            details += `, Duration: ${item.Duration} ${unit}`;
                        }
                    }
                    if (item.DurationDate) {
                        details += `, Onset: ${item.DurationDate}`;
                    }

                    if (item.SeverityId) {
                        let tempArray = $filter('filter')($scope.ROSocularSeverity, { 'ROSAllergySeverityId': item.SeverityId }, true);
                        if (tempArray.length > 0) {
                            details += `, Severity: ${tempArray[0].AllergySeverity}`;
                        }
                    }
                    if (item.StatusId) {
                        let tempArray = $filter('filter')($scope.ROSAllergyStatus, { 'ROSAllergyStatusId': item.StatusId }, true);
                        if (tempArray.length > 0) {
                            details += `, Status: ${tempArray[0].AllergyStatus}`;
                        }
                    }

                    if (item.Remarks) {
                        details += `, Notes: ${item.Remarks}`;
                    }
                    return details;
                }).join('\n');

                if (rossubmitreq.CardiacNotes != $scope.LogObj.CardiacNotes) {
                    if (rossubmitreq.CardiacNotes)
                        AllergyDetails += `, Cardiac Notes: ${rossubmitreq.CardiacNotes}`;
                }
                if (rossubmitreq.PulmonaryNotes != $scope.LogObj.PulmonaryNotes) {
                    if (rossubmitreq.PulmonaryNotes)
                        AllergyDetails += `,Pulmonary Notes: ${rossubmitreq.PulmonaryNotes}`;
                }
                if (rossubmitreq.NeurologicNotes != $scope.LogObj.NeurologicNotes) {
                    if (rossubmitreq.NeurologicNotes)
                        AllergyDetails += `, Neurologic Notes: ${rossubmitreq.NeurologicNotes}`;
                }
                if (rossubmitreq.HepaticNotes != $scope.LogObj.HepaticNotes) {
                    AllergyDetails += `, Hepatic Notes: ${rossubmitreq.HepaticNotes}`;
                }
                if (rossubmitreq.HemeOncNotes != $scope.LogObj.HemeOncNotes) {
                    if (rossubmitreq.HemeOncNotes)
                        AllergyDetails += `, Heme One Notes: ${rossubmitreq.HemeOncNotes}`;
                }
                if (rossubmitreq.KidneyDiseaseNotes != $scope.LogObj.KidneyDiseaseNotes) {
                    if (rossubmitreq.KidneyDiseaseNotes)
                        AllergyDetails += `, Kidney Disease Notes: ${rossubmitreq.KidneyDiseaseNotes}`;
                }
                if (rossubmitreq.MusculoSkeletalSystemNotes != $scope.LogObj.MusculoSkeletalSystemNotes) {
                    if (rossubmitreq.MusculoSkeletalSystemNotes)
                        AllergyDetails += `, Musculoskeletal Notes: ${rossubmitreq.MusculoSkeletalSystemNotes}`;
                }
                if (rossubmitreq.EndocrineNotes != $scope.LogObj.EndocrineNotes) {
                    if (rossubmitreq.EndocrineNotes)
                        AllergyDetails += `, Endocrine Notes: ${rossubmitreq.EndocrineNotes}`;
                }
                // Create log object for each allergy item
                let description = '';
                if (rossubmitreq.SystemicHistory.length > 1) {
                    description = `Past Medical History - ${AllergyDetails.toUpperCase()}`;
                } else if (rossubmitreq.SystemicHistory.length === 1) {
                    description = `Past Medical History - ${AllergyDetails.toUpperCase()}`;
                }
                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 3,
                    "SubModuleName": "ROS",
                    "ScreenType": "ROS",
                    "ActionType": "Added",
                    "OldActionDescription": '',
                    "NewActionDescription": description,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }
        $scope.HealthPhysicalObj.LifestyleHistoryArray = $scope.HealthPhysicalObj.LifestyleHistoryArray || [];
        if ($scope.HealthPhysicalObj.LifestyleHistoryArray.length > 0) {
            if ($scope.LogObj.LifestyleDetail.length == 0) {
                var newvalue = '';
                var count = 0;
                const formatDuration = (value, type) => {
                    if (!value) return '';
                    const labels = { Y: 'Year(s)', W: 'Week(s)', M: 'Month(s)', D: 'Day(s)', H: 'Hour(s)' };
                    return `${value} ${labels[type] || ''}`;
                };


                var smokinglist = [];
                var alcohollist = [];
                var druglist = [];
                var psychislist = [];
                let SmokingData = '';
                let AlcoholData = '';
                let DrugData = '';
                let psychisData = '';

                smokinglist = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
                    return item.DeleteInd == 'N' && item.HistoryId == 1;
                }) || [];
                if (smokinglist.length > 0) {
                    count++;
                    let parts = [];
                    let date = '';
                    let duration = '';
                    SmokingData = smokinglist.filter(item => item.DeleteInd === 'N').map(item => {
                        item.SmokingFromDate = item.SmokingFromDate || ''
                        if (item.SmokingFromDate != '') {
                            date = item.SmokingFromDate;
                        } else {
                            duration = formatDuration(item.SmokingDuration, item.SmokingDurationType);
                        }
                        if (item.HistoryName) parts.push('History Name :' + item.HistoryName);
                        if (item.SmokingType) parts.push('Smoking Type :' + item.SmokingType);
                        if (date) parts.push('Smoking FromDate :' + date);
                        if (duration) parts.push('Smoking Duration :' + duration);
                        if (item.SmokingStatusName) parts.push('Smoking StatusName :' + item.SmokingStatusName);
                        if (item.SmokingQuantityName) parts.push('Smoking QuantityName :' + item.SmokingQuantityName);

                        return parts.join(' , ');

                    })
                        .join('\n');
                }

                alcohollist = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
                    return item.DeleteInd == 'N' && item.HistoryId == 2;
                }) || [];
                if (alcohollist.length > 0) {
                    count++;
                    let parts = [];
                    let alcoholdate = '';
                    let alcoholduration = '';
                    AlcoholData = alcohollist.filter(item => item.DeleteInd === 'N').map(item => {
                        item.AlcoholDurationDate = item.AlcoholDurationDate || ''
                        if (item.AlcoholDurationDate != '') {
                            alcoholdate = item.AlcoholDurationDate;
                        } else {
                            alcoholduration = formatDuration(item.AlcoholDuration, item.AlcoholDurationType);
                        }
                        if (item.HistoryName) parts.push('History Name :' + item.HistoryName);
                        if (item.AlcoholType) parts.push('Alcohol Type :' + item.AlcoholType);
                        if (alcoholdate) parts.push('Alcohol DurationDate :' + alcoholdate);
                        if (alcoholduration) parts.push('Alcohol Duration :' + alcoholduration);
                        if (item.AlcoholStatusName) parts.push('Alcohol StatusName :' + item.AlcoholStatusName);
                        if (item.AlcoholQuantityName) parts.push('Alcohol QuantityName :' + item.AlcoholQuantityName);

                        return parts.join(' , ');
                    })
                        .join('\n')
                }

                druglist = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
                    return item.DeleteInd == 'N' && item.HistoryId == 3;
                }) || [];
                if (druglist.length > 0) {
                    count++;
                    let parts = [];
                    let drugdate = '';
                    let drugduration = '';
                    DrugData = druglist.filter(item => item.DeleteInd === 'N').map(item => {
                        item.DrugDurationDate = item.DrugDurationDate || ''
                        if (item.DrugDurationDate != '') {
                            drugdate = item.DrugDurationDate;
                        } else {
                            drugduration = formatDuration(item.DrugDuration, item.DrugDurationType);
                        }
                        if (item.HistoryName) parts.push('History Name :' + item.HistoryName);
                        if (item.DrugType) parts.push('Drug Type :' + item.DrugType);
                        if (drugdate) parts.push('Drug DurationDate :' + drugdate);
                        if (drugduration) parts.push('Drug Duration :' + drugduration);
                        if (item.DrugArray && item.DrugArray.length > 0) parts.push('Drugs :' + (item.DrugArray || []).map(d => d.HabitsDescription).join(', '));
                        if (item.DrugQuantityName) parts.push('Drug QuantityName :' + item.DrugQuantityName);

                        return parts.join(' , ');
                    })
                        .join('\n')
                }


                psychislist = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
                    return item.DeleteInd == 'N' && item.HistoryId == 4;
                }) || [];
                if (psychislist.length > 0) {
                    count++;
                    psychisData = psychislist.filter(item => item.DeleteInd === 'N').map(item => {
                        let parts = [];
                        if (item.HistoryName) parts.push('History Name :' + item.HistoryName);
                        if (item.PsychisType) parts.push('Psychis Type :' + item.PsychisType);
                        return parts.join(' , ');
                    })
                        .join('\n')
                }

                newvalue = SmokingData + '\n' + AlcoholData + '\n' + DrugData + '\n' + psychisData;
                if (count!=0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 3,
                        "SubModuleName": "ROS",
                        "ScreenType": "ROS",
                        "ActionType": "Added",
                        "OldActionDescription": "",
                        "NewActionDescription": newvalue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            else {
                $scope.compareLifestyle();
            }

        }

        if (rossubmitreq.AllergyRemarks != '' || $scope.LogObj.AllergyRemarks != '') {
            let ActionType = ''
            if ($scope.LogObj.AllergyRemarks == '') {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }
            if (rossubmitreq.AllergyRemarks != $scope.LogObj.AllergyRemarks) {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 3,
                    "SubModuleName": "ROS",
                    "ScreenType":"ROS",
                    "ActionType": ActionType,
                    "OldActionDescription": $scope.LogObj.AllergyRemarks,
                    "NewActionDescription": rossubmitreq.AllergyRemarks,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }

        if (rossubmitreq.SurgicalRemarks != '' || $scope.LogObj.SurgicalRemarks != '') {
            let ActionType = ''
            if ($scope.LogObj.SurgicalRemarks == '') {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }

            if (rossubmitreq.SurgicalRemarks != $scope.LogObj.SurgicalRemarks) {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 3,
                    "SubModuleName": "ROS",
                    "ScreenType":"ROS",
                    "ActionType": ActionType,
                    "OldActionDescription": $scope.LogObj.SurgicalRemarks,
                    "NewActionDescription": rossubmitreq.SurgicalRemarks,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }

        if (rossubmitreq.CurrentEyeRemarks != '' || $scope.LogObj.CurrentEyeRemarks != '') {
            let ActionType = ''
            if ($scope.LogObj.CurrentEyeRemarks == '') {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }

            if (rossubmitreq.CurrentEyeRemarks != $scope.LogObj.CurrentEyeRemarks) {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 3,
                    "SubModuleName": "ROS",
                    "ScreenType": "ROS",
                    "ActionType": ActionType,
                    "OldActionDescription": $scope.LogObj.CurrentEyeRemarks,
                    "NewActionDescription": rossubmitreq.CurrentEyeRemarks,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }

        if (rossubmitreq.CurrentSystemicRemarks != '' || $scope.LogObj.CurrentSystemicRemarks != '') {
            let ActionType = ''
            if ($scope.LogObj.CurrentSystemicRemarks == '') {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }

            if (rossubmitreq.CurrentSystemicRemarks != $scope.LogObj.CurrentSystemicRemarks) {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 3,
                    "SubModuleName": "ROS",
                    "ScreenType": "ROS",
                    "ActionType": ActionType,
                    "OldActionDescription": $scope.LogObj.CurrentSystemicRemarks,
                    "NewActionDescription": rossubmitreq.CurrentSystemicRemarks,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }

        if (rossubmitreq.SystemicHistoryRemarks != '' || $scope.LogObj.SystemicHistoryRemarks != '') {
            let ActionType = ''
            if ($scope.LogObj.SystemicHistoryRemarks == '') {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }

            if (rossubmitreq.SystemicHistoryRemarks != $scope.LogObj.SystemicHistoryRemarks) {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 3,
                    "SubModuleName": "ROS",
                    "ScreenType": "ROS",
                    "ActionType": ActionType,
                    "OldActionDescription": $scope.LogObj.SystemicHistoryRemarks,
                    "NewActionDescription": rossubmitreq.SystemicHistoryRemarks,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }

        if (rossubmitreq.LifestyleHistoryRemarks != '' || $scope.LogObj.LifestyleHistoryRemarks != '') {
            let ActionType = ''
            if ($scope.LogObj.LifestyleHistoryRemarks == '') {
                ActionType = 'Added';
            } else {
                ActionType = 'Edited';
            }

            if (rossubmitreq.LifestyleHistoryRemarks != $scope.LogObj.LifestyleHistoryRemarks) {
                let obj = {
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 3,
                    "SubModuleName": "ROS",
                    "ScreenType": "ROS",
                    "ActionType": ActionType,
                    "OldActionDescription": $scope.LogObj.LifestyleHistoryRemarks,
                    "NewActionDescription": rossubmitreq.LifestyleHistoryRemarks,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }

        if ($scope.LogObj.LogArray.length > 0) {
            rossubmitreq.Logs = $scope.LogObj || {};
        }

        eHnoteDiagnosisDataServices.AddupdateROSData(rossubmitreq).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.RosObject.IsRosSummaryView = true;
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

                $scope.LogObj.AllergyItems = angular.copy(resp.data.AllergyItems);
                $scope.LogObj.SurgicalHistory = angular.copy(resp.data.SurgicalHistory);
                $scope.LogObj.SystemicHistory = angular.copy(resp.data.SystemicHistory);

                let TempMedicationArray = [];
                TempMedicationArray = angular.copy(resp.data.CurrentSystemicMedicationsHistory);
                let tempCurrentEyeMedicationsArray = $filter('filter')(TempMedicationArray, { 'MedicationLocationTypeId': 1 }, true) || [];
                let tempCurrentSystemicMedicationsArray = $filter('filter')(TempMedicationArray, { 'MedicationLocationTypeId': 2 }, true) || [];
                if (tempCurrentEyeMedicationsArray.length > 0) {
                    $scope.LogObj.CurrentEyeMedications = angular.copy(tempCurrentEyeMedicationsArray);
                }
                if (tempCurrentSystemicMedicationsArray.length > 0) {
                    $scope.LogObj.CurrentSystemicMedicationsHistory = angular.copy(tempCurrentSystemicMedicationsArray);
                }

                if ($scope.obj.AllergyItems && $scope.obj.AllergyItems.length) {

                    angular.forEach($scope.obj.AllergyItems, function (item) {

                        item.Duration = item.Duration || '';
                        item.DurationDate = item.DurationDate || '';

                        item.ShowDateFormat = !(item.Duration || item.DurationType === 'SB');
                        if (item.DurationDate) {
                            item.ShowDateFormat = true;
                        }

                        item.IsNKDAshow = item.AllergyId !== 2;

                        item.SelectedReactionIds = {};

                        angular.forEach(item.Reactions || [], function (reaction) {
                            if (reaction.DeleteInd === 'N') {
                                item.SelectedReactionIds[reaction.ReactionId] = true;
                            }
                        });
                    });
                }

                $scope.LogObj.AllergyRemarks = resp.data.AllergyRemarks || '';
                $scope.LogObj.SurgicalRemarks = resp.data.SurgicalRemarks || '';
                $scope.LogObj.CurrentSystemicRemarks = resp.data.CurrentSystemicRemarks || '';
                $scope.LogObj.CurrentEyeRemarks = resp.data.CurrentEyeRemarks || '';
                $scope.LogObj.SystemicHistoryRemarks = resp.data.SystemicHistoryRemarks || '';
                $scope.LogObj.LifestyleHistoryRemarks = resp.data.LifestyleHistoryRemarks || '';

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

                $scope.LogObj.CardiacNotes = resp.data.SystemicOtherData.CardiacNotes || "";
                $scope.LogObj.PulmonaryNotes = resp.data.SystemicOtherData.PulmonaryNotes || "";
                $scope.LogObj.NeurologicNotes = resp.data.SystemicOtherData.NeurologicNotes || "";
                $scope.LogObj.HepaticNotes = resp.data.SystemicOtherData.HepaticNotes || "";
                $scope.LogObj.HemeOncNotes = resp.data.SystemicOtherData.HemeOncNotes || "";
                $scope.LogObj.KidneyDiseaseNotes = resp.data.SystemicOtherData.KidneyDiseaseNotes || "";
                $scope.LogObj.MusculoSkeletalSystemNotes = resp.data.SystemicOtherData.MusculoSkeletalSystemNotes || "";
                $scope.LogObj.EndocrineNotes = resp.data.SystemicOtherData.EndocrineNotes || "";

                $scope.HealthPhysicalObj.DrugNames = $scope.HealthPhysicalObj.DrugNames || [];
                $scope.obj.LifestyleDetail = angular.copy(resp.data.LifestyleHistory);
                if (resp.data.LifestyleHistory.length > 0) {
                    $scope.HealthPhysicalObj.LifestyleHistory.Remarks = resp.data.LifestyleHistoryRemarks || '';
                    $scope.obj.LifestyleHistoryRemarks = resp.data.LifestyleHistoryRemarks || '';


                    $scope.HealthPhysicalObj.LifestyleHistoryArray = angular.copy(resp.data.LifestyleHistory) || [];
                    $scope.HealthPhysicalObj.DrugNames = $scope.HealthPhysicalObj.DrugNames || [];

                    if ($scope.HealthPhysicalObj.LifestyleHistoryArray.length > 0) {
                        angular.forEach($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {

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
                            angular.forEach($scope.HealthPhysicalObj.DrugNames, function (Ditem) {
                                Ditem.Ischecked = false;
                            });
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

                        var filterAllselect = $filter("filter")($scope.HealthPhysicalObj.DrugNames, { "Ischecked": true }, true) || [];

                        if (filterAllselect.length === $scope.HealthPhysicalObj.DrugNames.length) {
                            $scope.AllDrugListSelected = true;
                            $scope.DrugListSelectedText = "All Selected";
                        } else if (filterAllselect.length > 0) {
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
                    }


                    $scope.LogObj.LifestyleDetail = angular.copy($scope.HealthPhysicalObj.LifestyleHistoryArray) || [];
                }
                else {
                    $scope.LogObj.LifestyleDetail = [];
                }
               // if ($scope.obj.SystemicHistory.length == 0) {
                    if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                                item.PatientDetailId= 0,
                                item.HistoryId= item.HistoryId,
                                item.HistoryName= item.HistoryName,
                                item.TypeId= item.TypeId,
                                item.TypeName =item.TypeName,
                                item.IsChecked =false,
                                item.Value= '',
                                item.DeleteInd= 'N',
                                item.Remarks= "",
                                item.SnomedCodeobj= "",
                                item.OrganId="",
                                item.Duration="",
                                item.DurationType= "D",
                                item.DurationTypeName= "Day(s)",
                                item.DurationDate= null,
                                item.SNOMEDId= null,
                                item.SNOMEDCODE= "",
                                item.ICD10CODE= "",
                                item.DiagnosisObject="",
                                item.DiagnosisId= null,
                                item.SeverityId=  0,
                                item.PreAdmOthernotesInd= false,
                                item.IsDiabetes=false,
                                item.IsNoshowROS=false,
                                item.StatusId= 1,
                                item.SeverityDateTime= $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                                item.IsNormal= item.IsNormal,
                                item.OrderId= 0
                    });
                    }
              //  }
            }
        });
    }

    $scope.$on('SaveROSFromPreOpCall', function () {
        $scope.SaveROS();
    });
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
            "AppointmentId": $scope.ParentObject.AppointmentID || 0,
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
        $scope.RosObject.IsRosSummaryView = false;
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


        angular.forEach($scope.OrgPostOpChecklist, function (hitem) {
            angular.forEach(hitem.OrganizationCheckListDetails, function (kitem) {
                kitem.IsChecked = false;
                kitem.PatientAscCheckListDetailId = 0;
            });
        });
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
            //var statusfilter = $filter("filter")($scope.SmokingStatus, { "HistoryHabitsID": item.SmokingStatusId }, true) || [];
            //var TempArray = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist, { "SmokingStatusId": item.SmokingStatusId }, true) || [];
            var statusfilter = $filter("filter")($scope.MasterSmokingStatus, { "HistoryHabitsID": item.SmokingStatusId }, true) || [];
            var TempArray = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistory.Smokinglist, function (iterator, ind) { return iterator.SmokingStatusId == item.SmokingStatusId && iterator.DeleteInd == 'N'; }) || [];

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
            var statusfilter = $filter("filter")($scope.MasterAlcoholStatus, { "HistoryHabitsID": item.AlcoholStatusId }, true) || [];
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

        if (type == 'Grid') {
            // $scope.obj.isNKSHSelected = false;
            $scope.HealthPhysicalObj.IsAllGridView = true;
            $scope.HealthPhysicalObj.IsAllSearchView = false;
        } else {
            $scope.HealthPhysicalObj.IsAllGridView = false;
            $scope.HealthPhysicalObj.IsAllSearchView = true;
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
            $scope.HealthPhysicalObj.LifestyleHistoryArray = angular.copy($scope.obj.LifestyleDetail) || [];

            angular.forEach($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {

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

        }

        $scope.HealthPhysicalObj.LifestyleHistory.Remarks = angular.copy($scope.obj.LifestyleHistoryRemarks) || '';
        if ($scope.HealthPhysicalObj.LifestyleHistory.Remarks != '') {
            $scope.HealthPhysicalObj.SocialNotesInd = true;
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

                        // $scope.HealthPhysicalObj.SystemicHistoryArray = angular.copy(newArray);
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
                            "IsChecked": true
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
                        "IsChecked": true
                    };
                    $scope.HealthPhysicalObj.SystemicHistoryArray.push(object);
                    angular.forEach($scope.FrequentlySystemicHistory, function (item) {
                        item.Onselect = false;
                    });
                }
            }
        }
    }


    $scope.ClearSmoking = function () {
        alertify.confirm(
            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Smoking data?</h4>",
            function () {
                var smokingItem = $scope.HealthPhysicalObj.LifestyleHistoryArray.find(x => x.HistoryId === 1);

                if (smokingItem) {
                    // Reset Smoking-related fields
                    //smokingItem.SmokingType = "";
                    smokingItem.SmokingStatusId = 0;
                    smokingItem.SmokingStatusName = "";
                    smokingItem.SmokingQuantityId = 0;
                    smokingItem.SmokingQuantityName = "";
                    smokingItem.SmokingDuration = "";
                    smokingItem.SmokingDurationType = "D";
                    smokingItem.SmokingDurationTypeName = "Day(s)";
                    smokingItem.SmokingDurationDate = null;
                    smokingItem.SmokingFromDate = null;
                    smokingItem.SmokingToDate = "";
                    smokingItem.Remarks = "";
                    smokingItem.ShowNote = false;
                    smokingItem.SmokeShowDateFormat = true;
                }

                $scope.$apply(); // Needed for alertify
            },
            function () {
                // Cancelled
            }
        );
    };
    $scope.ClearAlchohal = function () {
        alertify.confirm(
            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Alcohol data?</h4>",
            function () {
                var AlchohalItem = $scope.HealthPhysicalObj.LifestyleHistoryArray.find(x => x.HistoryId === 2);

                if (AlchohalItem) {

                    //smokingItem.SmokingType = "";
                    AlchohalItem.AlcoholStatusId = 0;
                    AlchohalItem.AlcoholStatusName = "";
                    AlchohalItem.AlcoholQuantityId = 0;
                    AlchohalItem.AlcoholQuantityName = "";
                    AlchohalItem.AlcoholDuration = "";
                    AlchohalItem.AlcoholDurationType = "D";
                    AlchohalItem.AlcoShowDateFormat = null;
                    AlchohalItem.AlcoholDurationDate = null;

                }

                $scope.$apply(); // Needed for alertify
            },
            function () {
                // Cancelled
            }
        );
    };
    $scope.ClearDrug = function () {
        alertify.confirm(
            "<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to clear Drug data?</h4>",
            function () {
                var DrugItem = $scope.HealthPhysicalObj.LifestyleHistoryArray.find(x => x.HistoryId === 3);

                if (DrugItem) {
                    let array = [];
                    angular.forEach(DrugItem.DrugArray, function (item) {
                        if (item.DrugHistoryId != 0) {
                            item.ActiveInd = 'N';
                            array.push(item);
                        }
                    });
                    DrugItem.DrugArray = array || [];

                    angular.forEach($scope.HealthPhysicalObj.DrugNames, function (item) {
                        item.Ischecked = false;
                    });

                    DrugItem.DrugStatusId = 0;
                    DrugItem.DrugDurationDate = "";
                    DrugItem.DrugQuantityId = 0;
                    DrugItem.DrugQuantityName = "";
                    DrugItem.DrugDuration = "";
                    DrugItem.DrugDurationType = "D";
                    DrugItem.DrugShowDateFormat = true;
                    DrugItem.DrugDurationDate = null;
                    DrugItem.DrugWhenQuitId = 0;
                    $scope.DrugListSelectedText = "Select";
                    $scope.AllDrugListSelected = false;

                }

                $scope.$apply(); // Needed for alertify
            },
            function () {
                // Cancelled
            }
        );
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
        if (ChecklistGeneralArray.length > 0) {
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
                    kitem.Ischecked = true;
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
        eHnotePatientDataService.GetMedicalHistoriesByPatientId($scope.appointmentInfo.PatientID).then(function (resp) {
            resp.data = resp.data || '';
            if (resp.data !== '') {
                resp.data.rows = resp.data.rows || [];
                if (resp.data.rows.length > 0) {

                   
                    $scope.obj.AllergyRemarks = resp.data.rows[0].AllergyRemarks || "";
                    $scope.obj.SurgicalRemarks = resp.data.rows[0].SurgicalRemarks || "";
                    $scope.obj.CurrentSystemicRemarks = resp.data.rows[0].CurrentSystemicRemarks || "";
                    $scope.obj.CurrentEyeRemarks = resp.data.rows[0].CurrentEyeRemarks || "";
                    $scope.obj.SystemicHistoryRemarks = resp.data.rows[0].SystemicHistoryRemarks || "";
                    $scope.obj.LifestyleHistoryRemarks = resp.data.rows[0].LifestyleHistoryRemarks || "";


                    if ($scope.obj.AllergyRemarks != '') {
                        $scope.obj.AllergyNotesInd = true;
                    } else {
                        $scope.obj.AllergyNotesInd = false;
                    }

                    if ($scope.obj.SurgicalRemarks != '') {
                        $scope.obj.SurgicalNotesInd = true;
                    } else {
                        $scope.obj.SurgicalNotesInd = false;
                    }


                    if ($scope.obj.CurrentSystemicRemarks != '') {
                        $scope.obj.CurrentSystemicNotesInd = true;
                    } else {
                        $scope.obj.CurrentSystemicNotesInd = false;
                    }
                    if ($scope.obj.CurrentEyeRemarks != '') {
                        $scope.obj.CurrentEyeNotesInd = true;
                    } else {
                        $scope.obj.CurrentEyeNotesInd = false;
                    }

                    if ($scope.obj.SystemicHistoryRemarks != '') {
                        $scope.obj.SystemicHistoryNotesInd = true;
                    } else {
                        $scope.obj.SystemicHistoryNotesInd = false;
                    }

                    if ($scope.obj.LifestyleHistoryRemarks != '') {
                        $scope.obj.LifestyleHistoryNotesInd = true;
                    } else {
                        $scope.obj.LifestyleHistoryNotesInd = false;
                    }

                    $scope.AllergyItems = resp.data.rows[0].Allergy || [];


                    if ($scope.AllergyItems.length > 0) {

                        angular.forEach($scope.AllergyItems, function (item) {
                            if ((item.StatusId == 1) || item.AllergyId == 1 || item.AllergyId == 2) {
                                var isDuplicate = $scope.obj.AllergyItems.some(function (existingItem) {
                                    return existingItem.AllergyId === item.AllergyId && existingItem.DeleteInd == 'N';
                                });

                                if (item.AllergyId === 2) {
                                    item.IsNKDAshow = false;
                                } else {
                                    item.IsNKDAshow = true;
                                }

                                if (!isDuplicate) {

                                    var reactions = angular.copy(item.Reactions || []);
                                    if (reactions.length > 0) {
                                        angular.forEach(reactions, function (reaction) {
                                            reaction.AllergyReactionId = 0;
                                        });
                                    }

                                    var object = {
                                        "PatientDetailId": null,
                                        "AllergyId": item.AllergyId,
                                        "AllergyName": item.AllergyName,
                                        "RcopiaAllergyId": item.RcopiaAllergyId,
                                        "AllergyTypeId": item.AllergyTypeId || null,
                                        "ShowNote": null,
                                        "RxNormID": item.RxNormID || null,
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
                                        "IsNKDAshow": item.IsNKDAshow,
                                        "PatientRcopiaAllergyId": item.PatientRcopiaAllergyId || "",
                                        "Reactions": reactions
                                    };
                                    $scope.obj.AllergyItems.push(object);

                                  

                                }
                            }
                        });

                        var IsAllergyDataAdded = false;
                        var TempAllergy = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
                            return fitem.AllergyId !== 1 && fitem.DeleteInd == 'N';
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
                            //if ($scope.obj.isNKDASelected) {
                            //    angular.forEach($scope.obj.AllergyItems, function (item, ndindex) {
                            //        var List = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
                            //            return fitem.AllergyId === 2;
                            //        }, true);
                            //        if (List.length > 0) {
                            //            if (List[0].PatientDetailId === 0) {
                            //                var indexToRemove = $scope.obj.AllergyItems.indexOf(List[0]);
                            //                if (indexToRemove !== -1) {
                            //                    $scope.obj.AllergyItems.splice(indexToRemove, 1);
                            //                }
                            //            } else {
                            //                List[0].DeleteInd = 'Y';
                            //            }
                            //        }
                            //        item.IsNKDASelected = false
                            //        $scope.obj.isNKDASelected = false
                            //    });
                            //}
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

                                if (item.AllergyId === 2) {
                                    item.IsNKDAshow = false;
                                } else {
                                    item.IsNKDAshow = true;
                                }
                            });
                        }

                        if ($scope.obj.AllergyItems.length > 0) {
                            angular.forEach($scope.obj.AllergyItems, function (item) {
                                if (item.DeleteInd == 'N') {
                                    var FreqList = $filter("filter")($scope.FrequentlyAllergyitems, function (fitem) {
                                        return fitem.AllergyId == item.AllergyId;
                                    }, true) || [];
                                    if (FreqList.length > 0) {
                                        FreqList[0].Onselect = true;
                                    }
                                }
                            });
                        }
                        let NonNKDAAllergies = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
                            return fitem.AllergyId !== 2 && fitem.DeleteInd == 'N';
                        }, true);

                        if (NonNKDAAllergies.length > 0) {
                            // Means other allergies exist (except NKDA) → Hide button
                            $scope.AllergyStatus.ShowNoKnownAllergy = false;
                        } else {
                            // Show button only if NKA is selected
                            $scope.AllergyStatus.ShowNoKnownAllergy =  true;
                        }

                        if ($scope.obj.AllergyItems && $scope.obj.AllergyItems.length > 0) {

                            angular.forEach($scope.obj.AllergyItems, function (allergy) {

                                allergy.SelectedReactionIds = {};

                                if (allergy.Reactions && allergy.Reactions.length > 0) {

                                    angular.forEach(allergy.Reactions, function (reaction) {

                                        if (reaction.DeleteInd == 'N') {
                                            allergy.SelectedReactionIds[reaction.ReactionId] = true;
                                        }
                                    });
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
                                        "IsFrequent": item.IsFrequent || "N"
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
                            angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (item) {
                                if (item.DeleteInd == 'N') {
                                    var MedFreqList = $filter("filter")($scope.FrequentMedicationsList, function (fitem) {
                                        return fitem.MedicineId == item.MedicineId;
                                    }, true) || [];
                                    if (MedFreqList.length > 0) {
                                        MedFreqList[0].IsChecked = true;
                                        item.IsFrequent = "Y";
                                    }
                                }
                            });
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

                    if ($scope.LifestyleHistory.length > 0) {
                        if ($scope.HealthPhysicalObj.LifestyleHistoryArray.length > 0) {
                            angular.forEach($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
                                if (item.PatientDetailId != null) {
                                    item.DeleteInd = 'Y';
                                }
                                else {
                                    var removeindex = $scope.HealthPhysicalObj.LifestyleHistoryArray.indexOf(item);
                                    if (removeindex > -1) {
                                        $scope.HealthPhysicalObj.LifestyleHistoryArray.splice(removeindex, 1);
                                    }
                                }
                            })
                            angular.forEach($scope.LifestyleHistory, function (litem) {
                                var matchedList = $filter('filter')($scope.HealthPhysicalObj.LifestyleHistoryArray, { HistoryId: litem.HistoryId }, true);
                                // angular.forEach($scope.HealthPhysicalObj.LifestyleHistoryArray, function (hitem) {
                                if (matchedList.length > 0) {
                                    matchedList[0].SmokingType = litem.SmokingType || '';
                                    matchedList[0].SmokingStatusId = litem.SmokingStatusId || 0;
                                    matchedList[0].SmokingStatusName = litem.SmokingStatusName || '';
                                    matchedList[0].SmokingFromDate = litem.SmokingFromDate || null;
                                    matchedList[0].SmokingQuantityId = litem.SmokingQuantityId || 0;
                                    matchedList[0].SmokingQuantityName = litem.SmokingQuantityName || '';
                                    matchedList[0].SmokingDuration = litem.SmokingDuration || '';
                                    matchedList[0].SmokingDurationType = litem.SmokingDurationType || 'D';
                                    matchedList[0].SmokingDurationTypeName = litem.SmokingDurationTypeName || "Day(s)";
                                    matchedList[0].AlcoholType = litem.AlcoholType || '';
                                    matchedList[0].AlcoholStatusId = litem.AlcoholStatusId || 0;
                                    matchedList[0].AlcoholStatusName = litem.AlcoholStatusName || '';
                                    matchedList[0].AlcoholDuration = litem.AlcoholDuration || '';
                                    matchedList[0].AlcoholDurationType = litem.AlcoholDurationType || 'D';
                                    matchedList[0].AlcoholDurationDate = litem.AlcoholDurationDate || null;
                                    matchedList[0].AlcoholQuantityId = litem.AlcoholQuantityId || 0;
                                    matchedList[0].AlcoholQuantityName = litem.AlcoholQuantityName || '';
                                    matchedList[0].DrugType = litem.DrugType || '';
                                    matchedList[0].DrugDurationDate = litem.DrugDurationDate || null;
                                    matchedList[0].DrugDuration = litem.DrugDuration || '';
                                    matchedList[0].DrugDurationType = litem.DrugDurationType || 'D';
                                    matchedList[0].DrugDurationTypeName = litem.DrugDurationTypeName || 'Day(s)';
                                    matchedList[0].DrugQuantityId = litem.DrugQuantityId || 0;
                                    matchedList[0].DrugQuantityName = litem.DrugQuantityName || '';
                                    // hitem.DrugArray = litem.DrugArray || [];
                                    matchedList[0].DeleteInd = 'N';
                                    matchedList[0].PsychisType = litem.PsychisType || '';
                                    if (litem.HistoryId == 1) {
                                        $scope.HealthPhysicalObj.LifestyleHistory.SmokingType = litem.SmokingType;
                                    }
                                    if (litem.HistoryId == 2) {
                                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = litem.AlcoholType;
                                    }
                                    if (litem.HistoryId == 3) {
                                        if (matchedList[0].DrugArray.length == 0) {
                                            matchedList[0].DrugArray = litem.DrugArray || [];
                                        } else {
                                            angular.forEach(matchedList[0].DrugArray, function (item) {
                                                if (item.DrugHistoryId != 0) {
                                                    item.ActiveInd = 'N';
                                                } else {
                                                    var removeindex = matchedList[0].DrugArray.indexOf(item);
                                                    if (removeindex > -1) {
                                                        matchedList[0].DrugArray.splice(removeindex, 1);
                                                    }
                                                }
                                            });
                                            // hitem.DrugArray = array || [];

                                            if (litem.DrugArray.length > 0) {
                                                angular.forEach(litem.DrugArray, function (item) {
                                                    var matchedDrug = $filter('filter')(matchedList[0].DrugArray, { HistoryHabitsId: item.HistoryHabitsId, ActiveInd: 'Y' }, true);

                                                    if (matchedDrug.length > 0) {
                                                        matchedDrug[0].ActiveInd = 'Y';
                                                    } else {
                                                        matchedList[0].DrugArray.push(item);
                                                    }
                                                });
                                            }

                                        }

                                        $scope.HealthPhysicalObj.LifestyleHistory.DrugType = litem.DrugType;
                                        if (matchedList[0].DrugArray.length > 0) {

                                            angular.forEach(matchedList[0].DrugArray, function (DAitem) {
                                                if (DAitem.ActiveInd == 'Y') {
                                                    DAitem.DrugHistoryId = 0;
                                                }

                                                // DAitem.ActiveInd = "Y";

                                            });

                                        }


                                        if ($scope.HealthPhysicalObj.DrugNames.length > 0) {

                                            matchedList[0].DrugArray = matchedList[0].DrugArray || [];

                                            if (matchedList[0].DrugArray.length > 0) {

                                                angular.forEach($scope.HealthPhysicalObj.DrugNames, function (drugName) {

                                                    var matchedDrug = $filter('filter')(matchedList[0].DrugArray, { HistoryHabitsId: drugName.HistoryHabitsID, ActiveInd: 'Y' }, true);

                                                    if (matchedDrug.length > 0) {

                                                        drugName.Ischecked = true;

                                                    } else {
                                                        drugName.Ischecked = false;
                                                    }
                                                });
                                            }
                                        }
                                    }
                                    if (litem.HistoryId == 4) {
                                        $scope.HealthPhysicalObj.LifestyleHistory.PsychisType = litem.PsychisType;
                                    }
                                }
                                else {
                                    litem.PatientDetailId = null;

                                    if (litem.HistoryId == 1) {
                                        $scope.HealthPhysicalObj.LifestyleHistory.SmokingType = litem.SmokingType;

                                        if (litem.SmokingFromDate != '' && litem.SmokingFromDate != null) {
                                            litem.SmokeShowDateFormat = true;
                                            litem.SmokingFromDate = $filter('date')(litem.SmokingFromDate, "MM-dd-yyyy");
                                        }
                                    }

                                    if (litem.HistoryId == 2) {
                                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = litem.AlcoholType;

                                        if (litem.AlcoholDurationDate != '' && litem.AlcoholDurationDate != null) {
                                            litem.AlcoShowDateFormat = true;
                                            litem.AlcoholDurationDate = $filter('date')(litem.AlcoholDurationDate, "MM-dd-yyyy");
                                        }

                                    }
                                    if (litem.HistoryId == 3) {

                                        if (litem.DrugArray.length > 0) {

                                            angular.forEach(litem.DrugArray, function (DAitem) {

                                                DAitem.DrugHistoryId = 0;

                                                //  DAitem.ActiveInd = "Y";

                                            });

                                        }

                                        $scope.HealthPhysicalObj.LifestyleHistory.DrugType = litem.DrugType;

                                        if (litem.DrugDurationDate != '' && litem.DrugDurationDate != null) {
                                            litem.DrugShowDateFormat = true;
                                            litem.DrugDurationDate = $filter('date')(litem.DrugDurationDate, "MM-dd-yyyy");
                                        }

                                        if ($scope.HealthPhysicalObj.DrugNames.length > 0) {

                                            litem.DrugArray = litem.DrugArray || [];

                                            if (litem.DrugArray.length > 0) {

                                                angular.forEach($scope.HealthPhysicalObj.DrugNames, function (drugName) {

                                                    var matchedDrug = $filter('filter')(litem.DrugArray, { HistoryHabitsId: drugName.HistoryHabitsID }, true);

                                                    if (matchedDrug.length > 0) {

                                                        drugName.Ischecked = true;

                                                    }
                                                });
                                            }
                                        }
                                    }

                                    if (litem.HistoryId == 4) {

                                        $scope.HealthPhysicalObj.LifestyleHistory.PsychisType = litem.PsychisType;

                                    }
                                    $scope.HealthPhysicalObj.LifestyleHistoryArray.push(litem);
                                }

                                // });
                            });
                        }
                        else {
                            $scope.HealthPhysicalObj.DrugNames = $scope.HealthPhysicalObj.DrugNames || [];

                            if ($scope.LifestyleHistory.length > 0) {

                                angular.forEach($scope.LifestyleHistory, function (item) {
                                    item.PatientDetailId = null;

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

                                        if (item.DrugArray.length > 0) {

                                            angular.forEach(item.DrugArray, function (DAitem) {

                                                DAitem.DrugHistoryId = 0;

                                                //  DAitem.ActiveInd = "Y";

                                            });

                                        }

                                        $scope.HealthPhysicalObj.LifestyleHistory.DrugType = item.DrugType;

                                        if (item.DrugDurationDate != '' && item.DrugDurationDate != null) {
                                            item.DrugShowDateFormat = true;
                                            item.DrugDurationDate = $filter('date')(item.DrugDurationDate, "MM-dd-yyyy");
                                        }

                                        if ($scope.HealthPhysicalObj.DrugNames.length > 0) {

                                            item.DrugArray = item.DrugArray || [];

                                            if (item.DrugArray.length > 0) {

                                                angular.forEach($scope.HealthPhysicalObj.DrugNames, function (drugName) {

                                                    var matchedDrug = $filter('filter')(item.DrugArray, { HistoryHabitsId: drugName.HistoryHabitsID }, true);

                                                    if (matchedDrug.length > 0) {

                                                        drugName.Ischecked = true;

                                                    }
                                                });
                                            }
                                        }
                                    }

                                    if (item.HistoryId == 4) {

                                        $scope.HealthPhysicalObj.LifestyleHistory.PsychisType = item.PsychisType;

                                    }
                                    $scope.HealthPhysicalObj.LifestyleHistoryArray.push(item);
                                });
                            }
                        }
                    } else {
                        $scope.HealthPhysicalObj.LifestyleHistoryArray = $scope.HealthPhysicalObj.LifestyleHistoryArray || [];
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


    $scope.RosSummaryPrint = function () {

        let obj = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
            "PatientId": $scope.cacheStorageItem.PatientID || 0,
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

    };

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
            //if (resp.data.LifestyleDetail[0].AlcoholType !== '' || resp.data.LifestyleDetail[0].DrugType !== '' || resp.data.LifestyleDetail[0].SmokingType !== '' || resp.data.LifestyleDetail[0].PsychisType !== '' || resp.data.LifestyleDetail[0].Remarks != '') {
            LifestyleDetail = angular.copy(resp.data.LifestyleDetail);
            // }
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

    $scope.ChangeSystemicCardiacApp = function (item) {

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

        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }
    $scope.ChangeSystemicPulmonaryApp = function (item) {

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

        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }
    $scope.ChangeSystemicNeuroApp = function (item) {
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

        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }
    $scope.ChangeSystemicHepaticApp = function (item) {

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

        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }
    $scope.ChangeSystemiHemeOneApp = function (item) {

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

        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }
    $scope.ChangeSystemicKidneyApp = function (item) {

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

        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }
    $scope.ChangeSystemicMuscuApp = function (item) {

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

        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }
    $scope.ChangeSystemicEndocrineApp = function (item) {
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

        if (item.PatientDetailId !== 0 && item.IsChecked === false) {
            item.DeleteInd = "Y";
        } else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            item.DeleteInd = "N";
        }
    }



    //fav Allergies


    $scope.AddFrequentAllergyData = function (item) {
        $scope.onAllergySelect(item);
    }

    $scope.AddFrequentMedicationData = function (item) {
        $scope.onRosCurrentSystemicMedicationsHistorylist(item)
    }

    $scope.showAllfreq = {
        allrgy: false,
        allrgylist: 5,

        medication: false,
        medicationlist: 5,
    };


    $scope.showAllallrgyfreqclick = function () {
        $scope.showAllfreq.allrgy = !$scope.showAllfreq.allrgy;
        if ($scope.showAllfreq.allrgy) {
            $scope.showAllfreq.allrgylist = $scope.FrequentlyAllergyitems.length;
        } else {
            $scope.showAllfreq.allrgylist = 5;
        }
    }

    $scope.showAllMedicationfreqclick = function () {
        $scope.showAllfreq.medication = !$scope.showAllfreq.medication;
        if ($scope.showAllfreq.medication) {
            $scope.showAllfreq.medicationlist = $scope.FrequentMedicationsList.length;
        } else {
            $scope.showAllfreq.medicationlist = 5;
        }
    }

    $scope.ChangeAllergyHistoryFrequentStatus = function (item, ind) {
        if (item.IsFrequent == "N") {
            var Frequentval = "Y"
        } else {
            var Frequentval = "N"
        }

        var RxNormValue = null;

        if (item.RxNormID) {
            RxNormValue = item.RxNormID;
        } else if (item.RxnormID) {
            RxNormValue = item.RxnormID;
        } else {
            RxNormValue = null;
        }

        if (item.IsFrequent == "Y") {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Do you want to Remove this From the frequently added list", function () {
                var reqObj = {
                    "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                    "OrganizationId": $scope.HospitalId,

                    "UserId": doctorinfo.doctorid,
                    "AllergyId": item.AllergyId,
                    "AllergyName": item.AllergyName,
                    "AllergyTypeId": item.AllergyTypeId || null,
                    "Reaction": "",
                    "DeleteInd": false,
                    "ModifiedBy": "",
                    "ModifiedDt": "",
                    "IsFrequent": "N",
                    "RcopiaAllergyId": item.RcopiaAllergyId || "",
                    "NDCID": item.NDCID || null,
                    "RxNormID": RxNormValue || null
                };
                eHnoteDiagnosisDataServices.addAllergy(reqObj).then(function (response) {
                    if (response.data.Status === "Success") {
                        $scope.GetAllFrequentlyAddedData();


                        item.IsFrequent = Frequentval


                    }
                    if (response.data.Status === 'Failure') {

                        alertify.error(response.data.Message);


                    }
                });
            }, function () {
                r = "You pressed Cancel!";

            });
        }
        if (item.IsFrequent == "N") {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Do you want to add this to the frequently added list", function () {

                var reqObj = {
                    "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                    "OrganizationId": $scope.HospitalId,

                    "UserId": doctorinfo.doctorid,
                    "AllergyId": item.AllergyId,
                    "AllergyName": item.AllergyName,
                    "AllergyTypeId": item.AllergyTypeId || null,
                    "Reaction": "",
                    "DeleteInd": false,
                    "ModifiedBy": "",
                    "ModifiedDt": "",

                    "IsFrequent": "Y",
                    "RcopiaAllergyId": item.RcopiaAllergyId || "",
                    "NDCID": item.NDCID || null,
                    "RxNormID": RxNormValue || null
                };
                eHnoteDiagnosisDataServices.addAllergy(reqObj).then(function (response) {
                    if (response.data.Status === "Success") {
                        $scope.GetAllFrequentlyAddedData();

                        item.IsFrequent = Frequentval



                    }
                    if (response.data.Status === 'Failure') {

                        alertify.error(response.data.Message);

                    }
                })

            }, function () {
                r = "You pressed Cancel!";

            });
        }

    }

    $scope.ChangeMedicationHistoryFrequentStatus = function (item, MedId) {
        if (item.IsFrequent == "N") {
            var Frequentval = "Y"
        } else {
            var Frequentval = "N"
        }

        var locationtype = "";
        var medicationhistory = "";
        medicationhistory = MedId == 1 ? "CurrentEyeMedication" : "CurrentSystemicMedication";
        locationtype = MedId == 1 ? "Eye" : "General";

        if (item.IsFrequent == "Y") {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Do you want to Remove this From the frequently added list", function () {
                var object = {
                    "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,

                    "UserId": doctorinfo.doctorid,
                    "HospitalId": $scope.HospitalId,
                    "MedicineId": item.MedicineId,
                    "MedicineType": item.MedicineType || "",
                    "MedicineTypeId": item.MedicineTypeId || null,
                    "MedicineName": item.MedicineName,
                    "MedicineObject": "",
                    "RcopiaDrugId": "",
                    "RcopiaMedicationId": 0,
                    "MedicationName": "",
                    "DrugNDCID": "",
                    "DrugFirstDataBankMedID": "",
                    "DrugGenericId": "",
                    "DrugBrandName": "",
                    "DrugGenericName": item.DrugGenericName,
                    "DrugForm": "",
                    "DrugStrength": item.DrugStrength,
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
                    "RXNormId": 0,
                    "IsMedicationStopped": false,
                    "SelectedMedicationHistory": medicationhistory,
                    "LastUsedDate": null,
                    "MedicationStopDate": null,
                    "MedicationStopRemarks": "",
                    "MedicationResumeDate": null,
                    "MedicationResumeRemarks": "",
                    "MedicationLocationType": locationtype,
                    "MedicationLocationTypeId": MedId,
                    "IsRosMedication": false,
                    "IsFrequent": "N",
                };
                eHnoteDiagnosisDataServices.ModifyMedicatonFav(object).then(function (response) {
                    if (response.data.Status === "Success") {
                        $scope.GetAllFrequentlyAddedData();

                        item.IsFrequent = Frequentval


                    }
                    if (response.data.Status === 'Failure') {

                        alertify.error(response.data.Message);


                    }
                });
            }, function () {
                r = "You pressed Cancel!";

            });
        }
        if (item.IsFrequent == "N") {
            var r = alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>Do you want to add this to the frequently added list", function () {
                var object = {
                    "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                    "UserId": doctorinfo.doctorid,
                    "HospitalId": $scope.HospitalId,
                    "MedicineId": item.MedicineId,
                    "MedicineType": item.MedicineType || "",
                    "MedicineTypeId": item.MedicineTypeId || null,
                    "MedicineName": item.MedicineName,
                    "MedicineObject": "",
                    "RcopiaDrugId": "",
                    "RcopiaMedicationId": 0,
                    "MedicationName": "",
                    "DrugNDCID": "",
                    "DrugFirstDataBankMedID": "",
                    "DrugGenericId": "",
                    "DrugBrandName": "",
                    "DrugGenericName": item.DrugGenericName,
                    "DrugForm": "",
                    "DrugStrength": item.DrugStrength,
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
                    "RXNormId": 0,
                    "IsMedicationStopped": false,
                    "SelectedMedicationHistory": medicationhistory,
                    "LastUsedDate": null,
                    "MedicationStopDate": null,
                    "MedicationStopRemarks": "",
                    "MedicationResumeDate": null,
                    "MedicationResumeRemarks": "",
                    "MedicationLocationType": locationtype,
                    "MedicationLocationTypeId": MedId,
                    "IsRosMedication": false,
                    "IsFrequent": "Y",
                };


                eHnoteDiagnosisDataServices.ModifyMedicatonFav(object).then(function (response) {
                    if (response.data.Status === "Success") {
                        $scope.GetAllFrequentlyAddedData();

                        item.IsFrequent = Frequentval



                    }
                    if (response.data.Status === 'Failure') {

                        alertify.error(response.data.Message);

                    }
                })

            }, function () {
                r = "You pressed Cancel!";

            });
        }

    }
    $scope.GetAllFrequentlyAddedData = function () {
        var allrgireq = {
            "HospitalId": $scope.HospitalId,
            "PageSize": 30,
            "PageNumber": 1,
            "UserId": doctorinfo.doctorid,
            "IsFrequent": "Y"

        };
        eHnoteDiagnosisDataServices.GetAllFrequentlyAddedData(allrgireq).then(function (resp) {

            if (resp.data.Status === "Success") {

                $scope.FrequentlyAllergyitems = resp.data.Allergyitems || [];
                $scope.FrequentMedicationsList = resp.data.OrganizationFavoriteMedications || [];

                angular.forEach($scope.FrequentlyAllergyitems, function (item) {
                    item.Onselect = false;
                });

                angular.forEach($scope.FrequentMedicationsList, function (item) {
                    item.Onselect = false;
                });

                if ($scope.obj.AllergyItems.length > 0) {
                    angular.forEach($scope.obj.AllergyItems, function (item) {
                        if (item.DeleteInd == 'N') {
                            var FreqList = $filter("filter")($scope.FrequentlyAllergyitems, function (fitem) {
                                return fitem.AllergyId == item.AllergyId;
                            }, true) || [];
                            if (FreqList.length > 0) {
                                FreqList[0].Onselect = true;
                            }
                        }
                    });
                }

                if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
                    angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (item) {
                        if (item.DeleteInd == 'N') {
                            var MedFreqList = $filter("filter")($scope.FrequentMedicationsList, function (fitem) {
                                return fitem.MedicineId == item.MedicineId;
                            }, true) || [];
                            if (MedFreqList.length > 0) {
                                MedFreqList[0].IsChecked = true;
                            }
                        }
                    });
                }

            }
        })
    }

    $scope.ChangeAllergyReactionItemselect = function (allergy, reaction) {

        if (!allergy.Reactions) {
            allergy.Reactions = [];
        }

        var isChecked =
            allergy.SelectedReactionIds[reaction.ROSAllergyReactionsId];

        var existingReaction = allergy.Reactions.find(function (x) {
            return x.ReactionId == reaction.ROSAllergyReactionsId;
        });

        if (isChecked) {

            if (!existingReaction) {

                allergy.Reactions.push({
                    AllergyReactionId: 0,
                    ReactionId: reaction.ROSAllergyReactionsId,
                    ReactionName: reaction.AllergyReaction,
                    DeleteInd: 'N'
                });
            }
            else {

                existingReaction.DeleteInd = 'N';
            }
        }
        else {

            if (existingReaction) {

                if (existingReaction.AllergyReactionId > 0) {

                    existingReaction.DeleteInd = 'Y';
                }
                else {

                    var index = allergy.Reactions.indexOf(existingReaction);

                    if (index > -1) {
                        allergy.Reactions.splice(index, 1);
                    }
                }
            }
        }
    };

    $scope.RemoveReaction = function (allergy, reaction) {

        allergy.SelectedReactionIds[reaction.ReactionId] = false;

        if (reaction.AllergyReactionId > 0) {
            reaction.DeleteInd = 'Y';
        } else {
            var index = allergy.Reactions.indexOf(reaction);
            if (index > -1) {
                allergy.Reactions.splice(index, 1);
            }
        }
    };
}]);

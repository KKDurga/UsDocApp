
"use strict";
eHnoteWebApp.controller("AllApptQuickSummaryCtrl", ["$scope", "$rootScope", "$location", "$filter", "eHnoteLoginStatusService", "eHnoteMasterDataService", "eHnotePatientDataService", "alertify", "eHnoteCacheStorageService", "eHnoteUserAppointmentDataService", "$uibModal", "eHnoteSettingsDataService", "datapersistanceFactory", "eHnoteDiagnosisDataServices", "eHnoteSurgeryService", "$q", "$timeout", "eHnoteMainAdminServices", "eHnoteMainAppointmentService", "USPrintService", "eHnoteAuditServices", "eHnoteUserDataService", "eHnoteOrgReferralDataServices", "eHnoteReferalDataService", "$sce", function ($scope, $rootScope, $location, $filter, eHnoteLoginStatusService, eHnoteMasterDataService, eHnotePatientDataService, alertify, eHnoteCacheStorageService, eHnoteUserAppointmentDataService, $uibModal, eHnoteSettingsDataService, datapersistanceFactory, eHnoteDiagnosisDataServices, eHnoteSurgeryService, $q, $timeout, eHnoteMainAdminServices, eHnoteMainAppointmentService, USPrintService, eHnoteAuditServices, eHnoteUserDataService, eHnoteOrgReferralDataServices, eHnoteReferalDataService, $sce) {

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    $scope.ParenthospitalId = 0;
    $scope.HospitalId = 0;
    $scope.SelectedFile = 18;
    $scope.SubTabId = null;
    $scope.BranchId = 0;
    $scope.currentDate = $filter('date')(new Date(), "yyyy-MM-dd");
    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.BranchId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    };
    // for hadling this if cache is empty
    if (!angular.isObject($scope.cacheStorageItem) || (angular.isArray($scope.cacheStorageItem) && $scope.cacheStorageItem.length === 0)) {
        $scope.cacheStorageItem = {}; // Reset to a safe object
    }
    $scope.cacheStorageItem.selectedApptObj = $scope.cacheStorageItem.selectedApptObj || null;
    if ($scope.cacheStorageItem.selectedApptObj!=null) {
        $scope.cacheStorageItem.selectedApptObj.BranchId = $scope.cacheStorageItem.selectedApptObj.BranchId || 0;
        if ($scope.cacheStorageItem.selectedApptObj.BranchId !== 0) {
            $scope.HospitalId = $scope.cacheStorageItem.selectedApptObj.BranchId;
        }
    }
   
    $scope.selectedPatientData = eHnoteMasterDataService.getpatientData();
    $scope.AddToCache = function () {
        eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
    };
    $scope.ShowHealthAndPhysical = false;
    $scope.closeuib = function () {
        $uibModalInstance.dismiss("cancel")
    };    

    // Time Out Check List


    //$scope.ParentObj = datapersistanceFactory.getItem("ASCPastvisits");

    $scope.ParentObj = {
        'IsIOJParentOrganization': false
    };

    var currenturl = $location.absUrl().split('?')[0];

    var CurrentEnvironment = currenturl.split('/#')[0];

    if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com") {
        $scope.ParentObj.IsIOJParentOrganization = true;
    } else {
        $scope.ParentObj.IsIOJParentOrganization = false;
    }

    $scope.IsShowYagTemplate = eHnoteMasterDataService.getIsShowYagTemplate();

    let BranchSettingsData = datapersistanceFactory.getItem("BranchSettingsData");
    $scope.IsShowEmptyASCChecklist = BranchSettingsData?.IsShowEmptyASCChecklist || false;
    
    $scope.CheckinChecklistArray = [];
    $scope.CheckinChecklistArray = $scope.OnlyNusrseAnesthetistRoles || [];

    $scope.ProfileStatusRemarksArray = [];
    $scope.IspostopMedications = false;
    $scope.IsPostopGenOrders = false;
    $scope.IsAdmitMedications = false;
    $scope.IsAdmitGenOrders = false;
    $scope.IsAdmitInvestigation = false;
    $scope.IsPhyMedications = false;
    $scope.IsPhyGenOrders = false;
    $scope.IsPhyInvestigation = false;
    $scope.IsAnesMedications = false;
    $scope.IsAnesInvestigation = false;
    $scope.IsAnesGenOrders = false;
    $scope.IsAdmitPhyMedications = false;
    $scope.IsAdmitPhyGenOrders = false;
    $scope.IsAdmitPhyInvestigation = false;
    $scope.pentaCamReportImages = [];
    $scope.IsIntraopMedications = false;
    $scope.IsIntraopGenOrders = false;

    $scope.GetAppointmentImages = function (Id) {
        var AppointmentId = Id || 0;
        var req = {
            "AppointmentId": AppointmentId
        };
        eHnoteSurgeryService.GetAppointmentImagesData(req).then(function (resp) {
            if (resp.data.status === "Success") {
                $scope.PreAdmAnesthetistQuickSummary.DocumentDetails = [];
                if (resp.data.rows.length > 0) {
                    angular.forEach(resp.data.rows, function (item) {
                        if (item.FileTypeId == 32 || item.FileTypeId == 30) {
                            $scope.AdmissionCheckinObj.PreOPAdmitFiles.push(item);
                        };
                        if (item.FileTypeId == 33 || item.FileTypeId == 17) {
                            $scope.PreAdmAnesthetistQuickSummary.DocumentDetails.push(item);
                        };
                        if (item.FileTypeId == 36) {
                            $scope.pentaCamReportImages.push(item);
                        };
                    });
                }

            }
        });
    };
    $scope.show = {
        "IsAnesthesiaMedications": false,
        "IsAnesthesiaGenOrders": false,
        "IsNurseGenOrders": false,
        "IsNurseMedications": false,
    };
    $scope.AnesthVitals = {
        "isSystolic": false,
        "isDiastolic": false,
        "isPulse": false,
        "isRespRate": false,
        "isO2Saturation": false,
        "isEKGLead": false,
        "isETCO2": false,
        "isAllVitals": false,
        "OverallNurseAction": false
    }


    $scope.PostAnesthVitals = {
        "isSystolic": false,
        "isDiastolic": false,
        "isPulse": false,
        "isRespRate": false,
        "isO2Saturation": false,
        "isEKGLead": false,
        "isETCO2": false,
        "isAllVitals": false,
        "OverallNurseAction": false
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
            "ProcedureId": 2254,
            "ProcedureName": 'Blood platelets',
            "CPTCODE": "",
            "InvestigationResultDate": '',
        },{
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
    
    $scope.GetPreAdmAnesthetistQuickSummary = function () {
        return {
            "PreAdmissionChartStatus": "",
            "PreAdmissionApptDate": "",
            "Vitals": [],
            "SystemicHistory": [],
            "AllergyItems": [],
            "SurgicalHistory": [],
            "LabArray": [],
            "LabInvestigation": [],
            "LabList": angular.copy($scope.GetLabInvestigations) || [],
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
                "MouthOpening": "",
                "TMDistance": "",
                "UnableToAssess": false,
                "Tracheostomy": false,
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
                "IsRisksbenefitsAnesthesia": false,
                "IsAnestheticplan": false,
                "AnesthetistLic": "",
                "AnesthesiologistLic": "",
            },
            "ASAObj": {
                "Value": "",
                "Notes": "",
                "EValue": "",
                "ENotes": "",
                "IsEmergency": false,
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
            "AnesthesiaTypelist": [],
            "ReviewedDate": "",
            "ReviewedTime": "",
            "IsCXR": "",
            "PrescriptionDetails": [],
            "CurrentSystemicMedicationsHistory": [],
            "LabNotes": '',
            "LifestyleDetail": [],
            "MedicineOrdersInstructions": '',
            "ASAClassificationNotes": '',
            "AnesthesiaTypelist": [],
            "AnesthetistReviewedBy": null,
            "AnesthetistReviewedName": '',
            "AnesthesiologistReviewedBy": null,
            "AnesthesiologistReviewedName": '',
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
           
            
            "DocumentDetails":[],
            "AllergyRemarks": "",
            "SurgicalRemarks": "",
            "CurrentSystemicRemarks": "",
            "CurrentEyeRemarks": "",
            "SystemicHistoryRemarks": "",
            "LifestyleHistoryRemarks": "",
            "AnesthetistOrderDetails":[],
            "RespiratoryRemarks": "",
            "IsAirwayData": false,
            "PhysicalNeurologicNotes": '',
            "PhysicalGeneralNotes": '',
            "PhysicalCardiocNotes": '',
            "PhysicalHepaticNotes": '',
            "PhysicalPulmonaryNotes": '',
            "PhysicalEvaluationArray": [],
            "LastDialysisDate": null,
            "AnesthesiaVitalsDisplay": [],
            "IndicatorStatus": false,
            "Indicator": false,
            "IsAnesthesiaType": false,
            "AnesthetistLicNo": '',
            "AnesthesiologistLicNo": '',
        };
    };

    $scope.PreAdmAnesthetistQuickSummary = angular.copy($scope.GetPreAdmAnesthetistQuickSummary());

    $scope.subVitallist = function () {
        return [
            {
                "AppointmentVitalDataId": 0,
                "VitalId": 11,
                "VitalDesc": "Temperature",
                "Value": "",
                "UnitTypeId": 1,
                "UnitTypeName": "°F",
                "OrderType": 1
            },
            {
                "AppointmentVitalDataId": 0,
                "VitalId": 12,
                "VitalDesc": "Pulse",
                "Value": "",
                "UnitTypeId": 3,
                "UnitTypeName": "BPM",
                "OrderType": 2
            },
            {
                "AppointmentVitalDataId": 0,
                "VitalId": 4,
                "VitalDesc": "BP-Systolic",
                "Value": "",
                "UnitTypeId": 5,
                "UnitTypeName": "mmHg",
                "OrderType": 3
            },
            {
                "AppointmentVitalDataId": 0,
                "VitalId": 5,
                "VitalDesc": "BP-Diastolic",
                "Value": "",
                "UnitTypeId": 5,
                "UnitTypeName": "mmHg",
                "OrderType": 4
            },
            {
                "AppointmentVitalDataId": 0,
                "VitalId": 14,
                "VitalDesc": "Respiratory Rate",
                "Value": "",
                "UnitTypeId": 4,
                "UnitTypeName": "BPM",
                "OrderType": 5
            },
            {
                "AppointmentVitalDataId": 0,
                "VitalId": 15,
                "VitalDesc": "SpO2",
                "Value": "",
                "UnitTypeId": 6,
                "UnitTypeName": "%",
                "OrderType": 6
            },
            {
                "AppointmentVitalDataId": 0,
                "VitalId": 8,
                "VitalDesc": "Blood Glucose Level",
                "Value": "",
                "UnitTypeId": 11,
                "UnitTypeName": "mg/dL",
                "OrderType": 8
            },
            {
                "AppointmentVitalDataId": 0,
                "VitalId": 36,
                "VitalDesc": "ECG",
                "Value": "",
                "UnitTypeId": 17,
                "UnitTypeName": "BPM",
                "OrderType": 9
            },
        ]

    }

    $scope.FemtoQuickSummaryObj = {

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
        "AnesthetistFireRiskID": null,
        "AnesthetistFireRiskName": "",
        "AnesthetistFireRiskLicenseNo": null,
        "DoctorFireRiskID": null,
        "DoctorFireRiskName": "",
        "DoctorFireRiskLicenseNo": null,
        "RiskLevel": "",
        "NurseFireRiskID": null,
        "NurseFireRiskName": "",
        "NurseFireRiskLicenseNo": null,
        "NurseFireRiskReviewdDate": null,
        "AnesthetistReviewdDate": null,
        "DoctorReviewdDate": null,
    }

    // Task 56803 - medication orders (Surgeon, Anesthesia, Pre-Admission, Lasik, YAG) show AMSCA and DEA
    // next to the License ID when the reviewer is an MD.

    // A credential of 0 / "0" means "not on file" and must not be displayed.
    $scope.HasCredentialValue = function (Value) {
        return Value != null && Value !== '' && Value != 0;
    };

    // DEA/AMSCA live on the user list (the column is exposed as AMSCAA), not on the order row,
    // and apply only to providers carrying the MD suffix (SuffixId 10).
    $scope.SetSurgeonCredentials = function (OrderDetails) {
        var UserList = $scope.allUserList || [];
        angular.forEach(OrderDetails || [], function (Mitem) {
            if (!Mitem) { return; }
            Mitem.DEA = $scope.HasCredentialValue(Mitem.DEA) ? Mitem.DEA : '';
            Mitem.AMSCA = $scope.HasCredentialValue(Mitem.AMSCA) ? Mitem.AMSCA
                        : ($scope.HasCredentialValue(Mitem.AMSCAA) ? Mitem.AMSCAA : '');

            var Surgeonlist = UserList.filter(function (subitem) {
                return subitem.DoctorID == Mitem.ReviewedBy && subitem.SuffixId == 10;
            });
            if (Surgeonlist.length > 0) {
                Mitem.DEA = $scope.HasCredentialValue(Surgeonlist[0].DEA) ? Surgeonlist[0].DEA : Mitem.DEA;
                Mitem.AMSCA = $scope.HasCredentialValue(Surgeonlist[0].AMSCAA) ? Surgeonlist[0].AMSCAA : Mitem.AMSCA;
            }
        });
    };

    // The summaries can load before the user list arrives; re-applied once it does.
    $scope.SetQuickSummarySurgeonCredentials = function () {
        $scope.SetSurgeonCredentials(($scope.PreOpQuickSummaryObj || {}).OrderDetails);
        $scope.SetSurgeonCredentials(($scope.IntraOpQuickSummaryObj || {}).OrderDetails);
        $scope.SetSurgeonCredentials(($scope.PostOpQuickSummaryObj || {}).OrderDetails);
        $scope.SetSurgeonCredentials(($scope.PreAdmAnesthetistQuickSummary || {}).AnesthetistOrderDetails);
        $scope.SetSurgeonCredentials(($scope.PreAdmCardioQuickSummaryObj || {}).OrderDetails);
        $scope.SetSurgeonCredentials(($scope.AdmissionCheckinObj || {}).OrderDetails);
        $scope.SetSurgeonCredentials(($scope.AdmissionCheckinObj || {}).SurgeonOrders);
        $scope.SetSurgeonCredentials(($scope.SummaryObj || {}).OrderDetails);
        $scope.SetSurgeonCredentials($scope.yagPreOpDilationMedications);
        $scope.SetSurgeonCredentials($scope.yagIntraOpOrderDetails);
    };


    $scope.PreOpQuickSummaryObj = {
        "PreOpNurseChartStatus": '',
        "PreOpAnesthesiaChartStatus ": '',
        "IVSiteBlocked": false,
        "IVSiteFluidsArray": [],
        "IVSiteFlushArray": [],
        "IVSiteLRArray": [],
        "IVBlockedArray":[],
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
        "OrderDetails": [],
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
        "IsNasalcanula": null,
        "IsHypoglycemiaCheck":null,
        "DiabetesResult": "",
        "DiabetesTime": "",
        "ODPupilSize": "",
        "OSPupilSize": "",
        "MedicineChecklistRemarks": "",
        "NurseChecklistRemarks": "",
        "Ascpatientpopupsavearray": [],
        "DiabetesTimings": [],
        "SurgicalSiteVerifiedBy": null,
        "SurgicalSiteVerifiedByName": "",
        "PreOpSurgicalSiteRemarks":"",
        "IVSite": null,
        "IVBlockedArray": [],
        "IVNeedleSize": null,
        "PatencyStatus": "",
        "IVArm": "",
        "IdentifierName": "",
        "IdentifierDurationDate": "",
        "PreOpHandOffReviewedName": '',
        "PreOpHandOffReviewedBy": null,
        "PreOpHandOffTime": "",
        "PreOpHandoffRemarks": "",
        "PreOpOverallNotes": "",

        "NurseFallRiskID": 0,
        "NurseFallRiskName": '',
        "FallRiskLevel": '',
        "ImplementedFallRiskProtocol": false,
        "ImplementedFallRiskProtocoltype": '',
        "FallRiskAssessmentTotalScore": '',
        "PreOpAnesthesiaNotes": null,
        "OxygenType": "",
        "OxygenQuantity": "",
        "EndotrachealTubeNotes": "",
        "LMANotes": "",
        "IsPreOpMedicationInd": true,

        "IVSiteFluids": null,
        "IVSiteFlush": null,
        "IVSiteLactatedRingers": null,
        "IVSiteFluidsName": '',
        "IVSiteFlushName": '',
        "IVSiteLactatedRingersName": '',
        "PreOpHandOffFromName": '',
        "IVFluidsId": null,
        "IVFluidsName": '',
      
        "NursingCarePlanData": [],
        "PreOpInRoomTime": '',
        "PreOpDiabetesRemarks": '',
        "NoOfAttempts": null,
        "IvAccessGivenBy": null,
        "IvAccessGivenByName": '',
        "IvAccessGivenByTime": '',
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
        "PainLevel": null,
        "FallriskBraceletprovided": '',
        "AssistiveWalkingDevice": '',
        "AllOrgAscChecklistData": [],
        "IsBeforeAnesthesiaNormal": false,
        "BeforeAnesthesiaReviewedBy": null,
        "BeforeAnesthesiaReviewedByName": "",
        "BeforeAnesthesiaReviewedDateTime": null,
        "PreOpAccompainedBy": "",
        "PreOpAccompainedByNotes": "",
        "PreOpAccompainedName": "",
        "PreOpAccompaniedSign": "",
        "PreOpAccompaniedSignedDateTime": null,
        "IsAccompaniedSignDone": false,
        "AllergyRemarks": "",
        "SurgicalRemarks": "",
        "CurrentEyeRemarks": "",
        "CurrentSystemicRemarks": "",
        "SystemicHistoryRemarks": "",
        "LifestyleHistoryRemarks": "",
        "VitalsArray": [],
        "VitalsDisplay": [],
        "SystemicHistory": [],
        "AllergyItems": [],
        "SurgicalHistory": [],
        "CurrentSystemicMedicationList": [],
        "LifestyleHistoryArray": [],
        "IsSurgeonOrdersTimeChecked": false,
        "IsAnesthesiaOrdersTimeChecked":false,
        "ChunkedGeneralChecklist": [],
        "ChunkedClinicalChecklist": [],
        "FamilyRelationId": null,
        "FamilyRelationName": "",
        "IsIVAccessdata": false,
        "MentalStatus": "",
        "Height": "",
        "HeightUnit": "",
        "Weight": "",
        "WeightUnit": "",
        "BMI": "",
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
        "PatientTransferType": "",
        "PatientTransferNotes": "",
        "SurgeonOperativeNotes": "",
        "BeforeAnesthesiaTime": "",
        "SurgeonComplicationNotes": "",
        "Findings": "",
        "IntraOpNurseChartStatus": '',
        "IntraOpAnesthesiaChartStatus": '',
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
            "Alcohol": "",
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
            "CleanContaminated": false,
            "Contaminated": false,
            "Dirty": false,
            "Disposition": false,
            "Recoveryroom": false,
            "CarePostoperative": false,
            "OthersIntraData": false,
            "PatientTolerated": false,
            "NurseFireRiskID": 0,
            "AnesthetistFireRiskID": 0,
            "DoctorFireRiskID": 0,
            "RiskLevel": '',
            "IsShowAnesthetistReviewByinFireRisk": false,
            "IsShowDoctorReviewByinFireRisk": false,
            "NurseFallRiskID": 0,
            "FallRiskLevel": '',
            "ImplementedFallRiskProtocol": false,
            "ImplementedFallRiskProtocoltype": '',
            "FallRiskAssessmentTotalScore": '',
            "CauteraisationOthers": "",
            "PatientReceivedByName": "",
            "HallEntranceStartTime": "",
            "DoctorFireRiskName": "",
            "AnesthetistFireRiskName": "",
            "NurseFireRiskName":"",
            "NursingCarePlanData": [],
            "AdditionalStaffId": null,
            "NurseFireRiskReviewdDate": null,
            "AnesthetistReviewdDate": null,
            "DoctorReviewdDate": null,
            "SurgeryStaffAnesthesistId": null,
            "SurgeryStaffAnesthesistName":"",
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
        "OthersDetailsArray": [],
        "EquipmentList": [],
        "MedicineOrdersInstructions": "",
        "DoctorNotes": "",
        "DoctorName": "",
        "NurseName": "",
        "AnesthesiaName": "",
        "ReviewedbyInd": false,
        "AnesthesiaTypelist": [],
      //  "AnesthesiaMedications": [],
        "EBLValue": "",
        "IntakeValue": "",
        "OutputValue": "",
        "InTime": "",
        "OutTime": "",
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
        "DoctorLicense": '',
        "NurseLicense": '',
        "AnesthesiaLicense": '',
        "AnesthesiologistName": '',
        "AnesthesiologistLicense": '',
        "TechnicianName": '',
        "TechnicianLicense": '',
        "IsIntraOPAnesthesiaActionVitalsArrayEmpty": false,
        //"IntraOpMedications":'',
        "handOffNotesInd": false,
        "OxygenType": "",
        "OxygenQuantity": "",
        "EndotrachealTubeNotes": "",
        "LMANotes": "",
        "IntraOpAnesthesiaNotes": null,
        "IntraOpNotes": null,
        "HandoffRemarks": '',
        "HandOffReviewedByName": '',
        "HandOffTime": '',
        "HandOffReviewedBy": null,
        "PhacoMachines": [],
        "SurgicalSuplyName": '',
        "LotNumber": null,
        "ExpirationDate": null,
        "SurgicalSuplyId": null,
        "AllIntraOpChecklistsArray": [],
        "OrderDetails": [],
        "HandOffFromReviewedByName": '',
        "SurgicalSupplyName":'',
        "IntraOpNurseNotes": "",
        "BeforeAnesthesiaReviewedDateTime": null,
        "BeforeIncisionReviewedDateTime": null,
        "BeforeORReviewedDateTime": null,
        "NurseReviewedDate": null,
        "AnesthesiologistReviewedDate":null,
        "TechnicianReviewedDate": null,
        "IsIntraOpAnesthesiaOrdersTimeAdded": false,
        "IsIntraOpSurgeonOrdersTimeAdded": false,
        "IntraOpSurgeryStaffNotes":""
    };

    $scope.PostOpQuickSummaryObj = {
        "IsShow": false,
        "IsEdit": false,
        "IsShowPostOpSummaryViewInd": false,
        "ProgressRemarksInd": false,
        "IsPostOpHighCriteria": false,
        "IsPostProceduresNotes": false,
        "PostOpAnesthesiaChartStatus": '',
        "PostOpNurseChartStatus": '',
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
                "PainLevel": null,
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
        "RecoveryStartTime": "",
        "RecoveryStopTime": "",
        "PostOpMedications": [],
        "OrderDetails": [],
        "IntrOpHandOffTime": "",
        "IntraOpHandOffReviewedByname":"",
        "IsCheckinCheckListEmpty": false,
        "PostOpAnesthesiaNotes": null,
        "PostOpNotes": null,
        "IsPatientDischarge": false,
        "OxygenType": '',
        "OxygenType": '',
        "OxygenQuantity":'',
        "NursingCarePlanData": [],
        "ProgressNotesPainScore": null,
        "IntraOpAnesthesiaStartTime": '',
        "IntraOpAnesthesiaEndTime": '',
        "DiscontinueIVTime": '',
        "PatientDischargeTime": '',
        "ProgressOverAllNotes": "",
        "AnesthetistReviewedDate": null,
        "NurseReviewedDate":null,
        "DischargeSignOffStartTime": '',
        "DischargeSignOffEndTime": '',
        "DischargeStartTimeUser": null,
        "DischargeEndTimeUser": null,
        "DischargeStopTimerRemarks": null,
        "Recovery1Intime": null,
        "Recovery1Outtime": null,
        "Recovery2Intime": null,
        "Recovery2Outtime": null,
        "R2ReviewAnesthetistId": null,
        "R2ReviewNurseId": null,
        "Recovery2AnesthesiaReviewedDate": null,
        "Recovery2NurseReviewedDate": null,
        "R2PostOpNurseChartStatus": null,
        "R2PostOpAnesthesiaChartStatus": null,
        'IsGeneralOrdersListEmpty': true,
        'IsCheckoutActionListEmpty': true,
        'IsCheckinCheckListEmpty': true,
        "IsPostOpAnesthesiaOrdersTimeAdded": false,
        "IsPostOpSurgeonOrdersTimeAdded":false
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
            },
            {
                "Id": 9,
                "VitalName": "Temparature",
                "VitalReadingList": [],
            },
            {
                "Id":10,
                "VitalName": "Note",
                "VitalReadingList": [],
            }

        ];
    };
    $scope.AnesthetistVitals = angular.copy($scope.GetAnesthetistVitals());
    
    $scope.DischargeQuickSummaryObj = {
        "PatientId": $scope.cacheStorageItem.PatientID,
        "AppointmentId": $scope.SelectedAppointmentId,
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
        "PatientsInstructions": "",
        "PatientinstructionsInd": false,
        "CheifComplaints": "",
        "DischargeChartStatus": "",
    };

    $scope.PatientDischargeObj = {
        "OperativeProcedure": "",
        "SurgeryDate": "",
        "OrganId": "",
        "Diagnosis": "",
        "Diagnosis2": "",
        "Surgeon": "",
        "InternalCoManager": "",
        "ExternalCoManager": "",
        "FullName": "",
        "Gender": "",
        "DOB": "",
        "PatientDisplayId": null,
    }

    $scope.OperativeNotesObj = {
        "PatientOperativeNotesId": 0,
        "OperativeNoteAddendums": [],
        "ProcedureDetails": "",
        "Complications": "",
        "OperativeReviewedName": "",
        "AdditionalSurgery": [],
        "Findings": "",
        "OperativeNotesReviewedBy": null,
        "ReasonForVisit": "",
        "PhysicalExam": "",
        "AnesthesiaTypelist":[],
        "OperativeOverAllRemarks":"",
        "PreProcedureNotes":"",
        "PostOpMedicationsNotes": "",
        "OccularHistoryArray": [],
        "OccularHistoryRemarks": '',
        "CheifComplaints": "",
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
            "Gender": "",
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
            "FaceSheetChartStatus": '',
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
            "SurgeonVerifiedUserId": null,
            "FaceSheetChartStatus": ''
        };

    };

    $scope.FaceSheetSummaryObj = $scope.GetFaceSheetSummaryObj;


    $scope.PreviousValuesObj = {
        "PreviousODIOLPower": '',
        "PreviousOSIOLPower": '',
        "ODLensUsed": '',
        "OSLensUsed": '',
        "PupilSizeODValue": '',
        "PupilSizeOSValue": '',
        "VisualODValue": '',
        "VisualOSValue": '',
        "ODCylARValue": '',
        "OSCylARValue": '',
        "ODSphARValue": '',
        "OSSphARValue": '',
        "ODAixARValue": '',
        "OSAixARValue": '',
        "ODRefractionValue": '',
        "OSRefractionValue": '',
    };

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

    $scope.PreAdmissionDetails = [];

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

    $scope.CoordinatorObj = {
        'CoordinatorQuestionsList': [],
        'CoordinatorNotes': '',
        "IsVisionChallengeDataAdded": false,
        "IsVisionDiscomfortDataAdded": false,
        "LastSignOffUserDetails": [],
        "IsCounsellingDataAdded": false,
        "IsCoordinatorDataAdded": false,
        "IsCoManagerNotesAdded": false,
        "InternalCoManagerNotes": '',
        "ExternalCoManagerNotes": '',
        "ClearanceDoctorName": '',
        "ClearanceReqDate": null,
        "ClearanceRecievedDate": null,
        "DispanseUsersList": [],
        "DispensedByUserId": null,
        "DispensedByUserName": '',
        "DispenseDate": null,
        "DispenseTime": '',
        "CoordinatorChartStatus": '',
    };

    $scope.PreopNurseAnestiatab = 1;
    $scope.NurseanestiaTabchnage = function (value) {
        $scope.PreopNurseAnestiatab = value;
    }
    $scope.PostopNurseAnestiatab = 1;
    $scope.PostopnurseTabchange = function (value) {
        $scope.PostopNurseAnestiatab = value;
    }
    var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
    $scope.RoleId = userLoginDetails.RoleID;
    if ($scope.RoleId === 25 || $scope.RoleId === 30) {
        $scope.IntropNurseAnestiatab = 2;
    }
    else {
        $scope.IntropNurseAnestiatab = 1;
    }
  
    $scope.IntraopnurseTabchange = function (value) {
        $scope.IntropNurseAnestiatab = value;
    }
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

            if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
                if ($scope.cacheStorageItem.PreAdmAppointmentId == null) {
                    alertify.error("This Patient has no Pre-admission appointment !");
                    return false;
                }
            }

            $scope.GetPreAdmissionDetails();
            if ($scope.RoleId == 8) {
                $scope.SubTab = 10;
            } else if ($scope.RoleId == 72) {
                $scope.SubTab = 9;
            } else if ($scope.RoleId == 30 || $scope.RoleId == 25) {
                $scope.SubTab = 2;
            } else if ($scope.RoleId == 18) {
                $scope.SubTab = 13;
            } else {
                $scope.SubTab = 2;
            }
        } else if (value == 3) {

            if ($scope.SelectedAppointmentTypeId == 7) {
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

            if ($scope.SelectedAppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.AscAppointmentId == null) {
                    alertify.error("This Patient has no ASC appointment !");
                    return false;
                }
            }

            $scope.GetASCIntraOpDetails();
            $scope.SubTab = 4;
        } else if (value == 5) {

            if ($scope.SelectedAppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.AscAppointmentId == null) {
                    alertify.error("This Patient has no ASC appointment !");
                    return false;
                }
            }

            $scope.GetPostOpChartData();
            $scope.SubTab = 5;
        } else if (value == 6) {
            if ($scope.SelectedAppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.AscAppointmentId == null) {
                    alertify.error("This Patient has no ASC appointment !");
                    return false;
                }
            }
            $scope.GetDischargeData();
            $scope.SubTab = 6;
        } else if (value == 7) {

            if ($scope.SelectedAppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.AscAppointmentId == null) {
                    alertify.error("This Patient has no ASC appointment !");
                    return false;
                }
            }

            $scope.GetOperativeNotesDetails();
            $scope.SubTab = 7;
        } else if (value == 8) {

            if ($scope.SelectedAppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.AscAppointmentId == null) {
                    alertify.error("This Patient has no ASC appointment !");
                    return false;
                }
            }

            $scope.GetASCAdmissionDetails();
            $scope.SubTab = 8;
        } else if (value == 9) {
            if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
                if ($scope.cacheStorageItem.PreAdmAppointmentId == null) {
                    alertify.error("This Patient has no Pre-admission appointment !");
                    return false;
                }
            }
            $scope.GetPreAdmissionCardiologistDetails();
            $scope.SubTab = 9;
        } else if (value == 10) {
            if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
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
        }
        else if (value == 12) {
            $scope.GetFemtoTemplateChartData();
            $scope.SubTab = 12;
        }else if (value == 15) {
            getAppointmentSuperBillDetails();
            $scope.SubTab = 15;
        } else {
            $scope.SubTab = value;
        }
    };

    $scope.GetFemtoTemplateChartData = function () {

        let req1 = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "CheckListModuleId": 1,
            "GetAllIndicator": 1
        };
        let req2 = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": $scope.SelectedAppointmentId || null,
            "PatientId": $scope.SelectedPatientID || null,
        };

        $q.all([
            eHnoteSurgeryService.GetOrganizationASCCheckListData(req1),
            eHnoteSurgeryService.GetFemtoTemplateChartData(req2),
        ]).then(function (resp) {
            if (resp[0].data.status === "Success") {
                if (resp[0].data.rows.length > 0) {
                    $scope.FemtoQuickSummaryObj.OrgASCChecklist = resp[0].data.rows;
                    angular.forEach($scope.FemtoQuickSummaryObj.OrgASCChecklist, function (item) {
                        angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                            kitem.IsChecked = false;
                        });
                    });

                }

            }

            if (resp[1].data.status === "Success") {
                if (resp[1].data.rows.length > 0) {
                    $scope.TempOrgASCChecklistDetails = [];
                    if (resp[1].data.rows[0].OrgASCChecklist.length > 0) {
                        $scope.FemtoQuickSummaryObj.PatientASCPreOPId = resp[1].data.rows[0].PatientASCPreOPId || null;
                        angular.forEach(resp[1].data.rows[0].OrgASCChecklist, function (item) {
                            angular.forEach($scope.FemtoQuickSummaryObj.OrgASCChecklist, function (kitem) {
                                if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                                    if (kitem.CheckListId === item.CheckListId) {
                                        kitem.IsChecked = true;
                                        kitem.Score = item.Score || 0;
                                        kitem.Value = item.Value || '';
                                        kitem.Remarks = item.Remarks || '';
                                        if (kitem.Remarks !== '') {
                                            kitem.intranotes1 = true;
                                        }
                                        kitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                                        if (item.CheckListId == 212 || item.CheckListId == 170) {
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

                                        if (item.SubCheckList.length > 0) {
                                            angular.forEach(item.SubCheckList, function (Aitem) {
                                                angular.forEach(kitem.SubCheckList, function (Bitem) {
                                                    if (Aitem.SubCheckListId == Bitem.SubCheckListId) {
                                                        Bitem.PatientAscCheckListDetailId = Aitem.PatientAscCheckListDetailId || 0;
                                                        Bitem.PatientAscSubCheckListId = Aitem.PatientAscSubCheckListId || 0;
                                                        Bitem.IsChecked = true;
                                                    }
                                                });
                                            });
                                        }
                                    }
                                }
                            });
                        });
                        $scope.TempOrgASCChecklistLogs = angular.copy(resp[1].data.rows[0].OrgASCChecklist) || [];
                        angular.forEach($scope.TempOrgASCChecklistLogs, function (kitem) {
                            kitem.Remarks = kitem.Remarks || "";
                            kitem.ChecklistTime = kitem.ChecklistTime || "";
                            kitem.ChecklistDate = $filter("date")(kitem.ChecklistDate, "MM-dd-yyyy") || null;

                        });

                       
                        $scope.TempOrgASCChecklist = angular.copy(resp[1].data.rows[0].OrgASCChecklist) || [];
                        angular.forEach($scope.TempOrgASCChecklist, function (kitem) {
                            if (kitem.CheckListCategoryId == 18) {
                                $scope.TempOrgASCChecklistDetails.push(kitem);
                            }

                        });
                    }

                    $scope.FemtoQuickSummaryObj.FemtoArcuateIncisions1 = resp[1].data.rows[0].FemtoArcuateIncisions1 || '';
                    $scope.FemtoQuickSummaryObj.IsFemtoArcuateIncisions1NA = resp[1].data.rows[0].IsFemtoArcuateIncisions1NA || false;
                    $scope.FemtoQuickSummaryObj.FemtoArcuateIncisions2 = resp[1].data.rows[0].FemtoArcuateIncisions2 || '';
                    $scope.FemtoQuickSummaryObj.IsFemtoArcuateIncisions2NA = resp[1].data.rows[0].IsFemtoArcuateIncisions2NA || false;
                    $scope.FemtoQuickSummaryObj.FemtoArcuateIncisionsNotes = resp[1].data.rows[0].FemtoArcuateIncisionsNotes || '';
                    $scope.FemtoQuickSummaryObj.FemtoTimeOut = resp[1].data.rows[0].FemtoTimeOut || '';
                    $scope.FemtoQuickSummaryObj.FemtoStartTime = resp[1].data.rows[0].FemtoStartTime || '';
                    $scope.FemtoQuickSummaryObj.FemtoEndTime = resp[1].data.rows[0].FemtoEndTime || '';
                    $scope.FemtoQuickSummaryObj.FemtoReferenceNo = resp[1].data.rows[0].FemtoReferenceNo || '';
                    $scope.FemtoQuickSummaryObj.FemtoLotNo = resp[1].data.rows[0].FemtoLotNo || '';
                    $scope.FemtoQuickSummaryObj.FemtoExpiryDate = resp[1].data.rows[0].FemtoExpiryDate || null;
                    $scope.FemtoQuickSummaryObj.FemtoOverAllNotes = resp[1].data.rows[0].FemtoOverAllNotes || '';
                    $scope.FemtoQuickSummaryObj.FemtNurseReviewedById = resp[1].data.rows[0].FemtNurseReviewedById || null;
                    $scope.FemtoQuickSummaryObj.FemtNurseReviewedByName = resp[1].data.rows[0].FemtNurseReviewedByName || '';
                    $scope.FemtoQuickSummaryObj.FemtDoctorReviewedById = resp[1].data.rows[0].FemtDoctorReviewedById || null;
                    $scope.FemtoQuickSummaryObj.FemtDoctorReviewedByName = resp[1].data.rows[0].FemtDoctorReviewedByName || '';
                    $scope.FemtoQuickSummaryObj.FemtDoctorReviewedByDate = resp[1].data.rows[0].FemtDoctorReviewedByDate || null;
                    $scope.FemtoQuickSummaryObj.FemtDoctorReviewedByTime = resp[1].data.rows[0].FemtDoctorReviewedByTime || '';
                    $scope.FemtoQuickSummaryObj.FemtAnesthesiaReviewedById = resp[1].data.rows[0].FemtoAnesthesiaReviewedById || null;
                    $scope.FemtoQuickSummaryObj.FemtAnesthesiaReviewedByName = resp[1].data.rows[0].FemtoAnesthesiaReviewedByName || '';

                    if ($scope.FemtoQuickSummaryObj.FemtoArcuateIncisionsNotes !== '') {
                        $scope.FemtoQuickSummaryObj.FemtoArcuateNotesInd = true;
                    } else {
                        $scope.FemtoQuickSummaryObj.FemtoArcuateNotesInd = false;
                    }

                    if ($scope.FemtoQuickSummaryObj.FemtoExpiryDate !== null) {
                        $scope.FemtoQuickSummaryObj.FemtoExpiryDate = $filter("date")($scope.FemtoQuickSummaryObj.FemtoExpiryDate, "MM-dd-yyyy") || null;
                    }
                    if ($scope.FemtoQuickSummaryObj.FemtDoctorReviewedByDate !== null) {
                        $scope.FemtoQuickSummaryObj.FemtDoctorReviewedByDate = $filter("date")($scope.FemtoQuickSummaryObj.FemtDoctorReviewedByDate, "MM-dd-yyyy") || null;
                    }

                    if ($scope.TempOrgASCChecklistDetails.length > 0 || $scope.FemtoQuickSummaryObj.FemtoArcuateIncisions1 !== '' || $scope.FemtoQuickSummaryObj.IsFemtoArcuateIncisions1NA || $scope.FemtoQuickSummaryObj.FemtoArcuateIncisions2 !== '' || $scope.FemtoQuickSummaryObj.IsFemtoArcuateIncisions2NA || $scope.FemtoQuickSummaryObj.FemtoTimeOut !== '' || $scope.FemtoQuickSummaryObj.FemtoStartTime !== '' || $scope.FemtoQuickSummaryObj.FemtoEndTime !== '' || $scope.FemtoQuickSummaryObj.FemtoReferenceNo !== ''
                        || $scope.FemtoQuickSummaryObj.FemtoLotNo !== '' || $scope.FemtoQuickSummaryObj.FemtoExpiryDate !== null) {
                        $scope.FemtoQuickSummaryObj.IfFemtoTemplateDataAdded = true;
                    } else {
                        $scope.FemtoQuickSummaryObj.IfFemtoTemplateDataAdded = false;
                    }
                    // $scope.FemtoQuickSummaryObj.FemtoOverAllNotes !== '' || $scope.FemtoQuickSummaryObj.FemtNurseReviewedById !== null || $scope.FemtoQuickSummaryObj.FemtDoctorReviewedById !== null || $scope.FemtoQuickSummaryObj.FemtDoctorReviewedByDate !== null || $scope.FemtoQuickSummaryObj.FemtDoctorReviewedByTime !== '' || $scope.FemtoQuickSummaryObj.FemtAnesthesiaReviewedById !== null


                    $scope.FemtoQuickSummaryObj.RiskLevel = resp[1].data.rows[0].RiskLevel || "";

                    $scope.FemtoQuickSummaryObj.AnesthetistFireRiskID = resp[1].data.rows[0].AnesthetistFireRiskID || null;
                    $scope.FemtoQuickSummaryObj.AnesthetistFireRiskName = resp[1].data.rows[0].AnesthetistFireRiskName || "";
                    $scope.FemtoQuickSummaryObj.AnesthetistFireRiskLicenseNo = resp[1].data.rows[0].AnesthetistFireRiskLicenseNo || null;
                    $scope.FemtoQuickSummaryObj.AnesthetistReviewdDate = resp[1].data.rows[0].AnesthetistReviewdDate || null;

                    $scope.FemtoQuickSummaryObj.DoctorFireRiskID = resp[1].data.rows[0].DoctorFireRiskID || null;
                    $scope.FemtoQuickSummaryObj.DoctorFireRiskName = resp[1].data.rows[0].DoctorFireRiskName || "";
                    $scope.FemtoQuickSummaryObj.DoctorFireRiskLicenseNo = resp[1].data.rows[0].DoctorFireRiskLicenseNo || null;
                    $scope.FemtoQuickSummaryObj.DoctorReviewdDate = resp[1].data.rows[0].DoctorReviewdDate || null;

                    $scope.FemtoQuickSummaryObj.NurseFireRiskID = resp[1].data.rows[0].NurseFireRiskID || null;
                    $scope.FemtoQuickSummaryObj.NurseFireRiskName = resp[1].data.rows[0].NurseFireRiskName || "";
                    $scope.FemtoQuickSummaryObj.NurseFireRiskLicenseNo = resp[1].data.rows[0].NurseFireRiskLicenseNo || null;
                    $scope.FemtoQuickSummaryObj.NurseFireRiskReviewdDate = resp[1].data.rows[0].NurseFireRiskReviewdDate || null;
                }
            }
        });
    };

    $scope.GetPreAdmCoordinatorData = function () {
        let Req = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "CheckListModuleId": 4
        };
        let HospitalId = 0;
        let SelectedAppointmentHospitalId = $scope.SelectedAppointmentHospitalId || 0
        if (SelectedAppointmentHospitalId != 0) {
            HospitalId = angular.copy(SelectedAppointmentHospitalId) || 0;
        } else {
            HospitalId = $scope.HospitalId || 0;
        }
        let AppointmentId = 0;
        let SelectedAppointmentId = $scope.SelectedAppointmentId || 0;
        if (SelectedAppointmentId != 0) {
            AppointmentId = angular.copy(SelectedAppointmentId);
        } else {
            AppointmentId = angular.copy($scope.cacheStorageItem.AppointmentId) || 0;
        }
        let Req1 = {
            "AppointmentId": AppointmentId || 0,
            "OrganizationId": HospitalId || 0,
        };

        $q.all([
            eHnoteSurgeryService.GetOrganizationASCCheckListData(Req),
            eHnoteSurgeryService.GetPreAdmCoordinatorData(Req1),
        ]).then(function (resp) {

            if (resp[0].data.status === "Success") {
                if (resp[0].data.MasterCoOrdinatorQuestions.length > 0) {
                    $scope.CoordinatorObj.CoordinatorQuestionsList = [];
                    angular.forEach(resp[0].data.MasterCoOrdinatorQuestions, function (item) {
                        var obj = {
                            'PreAdmCoOrdinatorDetailId': 0,
                            'QuestionId': item.CoOrdinatorQuestionId || 0,
                            'Description': item.Description || '',
                            'TypeId': item.TypeId || 0,
                            'TypeName': item.TypeName || '',
                            'OdValue': '',
                            'OsValue': '',
                            'Notes': '',
                            'DeleteInd': 'N',
                            'ShowNotesInd': false,
                            'QuestionValueId': 0,
                            'SubValue': '',
                            'CoOrdinatorQuestionValues': [],
                        }

                        if (item.CoOrdinatorQuestionValues.length > 0) {
                            angular.forEach(item.CoOrdinatorQuestionValues, function (vitem) {
                                var ValueObj = {
                                    'QuestionId': vitem.CoOrdinatorQuestionId || 0,
                                    'QuestionValueId': vitem.CoOrdinatorQuestionValueId || 0,
                                    'Value': vitem.Value || '',
                                    'DeleteInd': 'N',
                                    'IsChecked': false,
                                };
                                obj.CoOrdinatorQuestionValues.push(ValueObj);
                            });
                        }
                        $scope.CoordinatorObj.CoordinatorQuestionsList.push(obj);
                    });
                }
            }
            if (resp[1].data.status === "Success") {
                if (resp[1].data.LastSignOffUserDetails.length > 0) {
                    $scope.CoordinatorObj.LastSignOffUserDetails = resp[1].data.LastSignOffUserDetails || [];
                } else {
                    $scope.CoordinatorObj.LastSignOffUserDetails = [];
                }
               
                if (resp[1].data.rows.length > 0) {

                    $scope.CoordinatorObj.CoordinatorChartStatus = resp[1].data.rows[0].CoordinatorChartStatus || '';
                    $scope.CoordinatorObj.CoordinatorNotes = resp[1].data.rows[0].CoordinatorNotes || '';
                    $scope.CoordinatorObj.InternalCoManagerNotes = resp[1].data.rows[0].InternalCoManagerNotes || '';
                    $scope.CoordinatorObj.ExternalCoManagerNotes = resp[1].data.rows[0].ExternalCoManagerNotes || '';
                    $scope.CoordinatorObj.ClearanceDoctorName = resp[1].data.rows[0].ClearanceDoctorName || '';
                    $scope.CoordinatorObj.ClearanceReqDate = resp[1].data.rows[0].ClearanceReqDate || null;

                    if ($scope.CoordinatorObj.ClearanceReqDate !== null) {
                        $scope.CoordinatorObj.ClearanceReqDate = $filter('date')(new Date($scope.CoordinatorObj.ClearanceReqDate), "MM-dd-yyyy")
                    }

                    $scope.CoordinatorObj.ClearanceRecievedDate = resp[1].data.rows[0].ClearanceRecievedDate || null;

                    if ($scope.CoordinatorObj.ClearanceRecievedDate !== null) {
                        $scope.CoordinatorObj.ClearanceRecievedDate = $filter('date')(new Date($scope.CoordinatorObj.ClearanceRecievedDate), "MM-dd-yyyy")
                    }

                    $scope.CoordinatorObj.DispensedByUserId = resp[1].data.rows[0].DispensedByUserId || null;

                    $scope.CoordinatorObj.DispenseDate = resp[1].data.rows[0].DispenseDate || null;

                    if ($scope.CoordinatorObj.DispenseDate !== null) {
                        $scope.CoordinatorObj.DispenseDate = $filter('date')(new Date($scope.CoordinatorObj.DispenseDate), "MM-dd-yyyy")
                    }

                    $scope.CoordinatorObj.DispenseTime = resp[1].data.rows[0].DispenseTime || '';

                    $scope.CoordinatorObj.DispensedByUserName = resp[1].data.rows[0].DispensedByUserName || '';

                    if (resp[1].data.rows[0].PreAdmCoOrdinatorDetails.length > 0) {
                        angular.forEach(resp[1].data.rows[0].PreAdmCoOrdinatorDetails, function (Aitem) {
                            angular.forEach($scope.CoordinatorObj.CoordinatorQuestionsList, function (Bitem) {
                                if (Bitem.QuestionId == Aitem.CoOrdinatorQuestionId) {
                                    Bitem.PreAdmCoOrdinatorDetailId = Aitem.PreAdmCoOrdinatorDetailId || 0;
                                    Bitem.OdValue = Aitem.ODValue;
                                    Bitem.OsValue = Aitem.OSValue;
                                    Bitem.Notes = Aitem.Notes || '';

                                    if (Bitem.Notes !== '') {
                                        Bitem.IsSubDataAdded = true;
                                    }

                                    if (Bitem.Notes !== '') {
                                        Bitem.ShowNotesInd = true;
                                    }

                                    if (Aitem.CoOrdinatorQuestionValues.length > 0) {
                                        angular.forEach(Aitem.CoOrdinatorQuestionValues, function (citem) {
                                            angular.forEach(Bitem.CoOrdinatorQuestionValues, function (ditem) {
                                                if (citem.QuestionValueId == ditem.QuestionValueId) {
                                                    ditem.CoOrdinatorValueDetailId = citem.CoOrdinatorValueDetailId || 0;
                                                    ditem.IsChecked = true;
                                                    Bitem.IsSubDataAdded = true;
                                                    if (citem.QuestionValueId == 4 || citem.QuestionValueId == 33) {
                                                        Bitem.IsShowSubData = true;
                                                    }
                                                }
                                            })

                                        })
                                    }
                                }
                            });
                        });
                    }

                    var VisionChallengesArray1 = $filter("filter")($scope.CoordinatorObj.CoordinatorQuestionsList, function (item) { return item.TypeId == 1 && (item.OdValue !== '' || item.OsValue !== '') });
                    var VisualDiscomfortArray1 = $filter("filter")($scope.CoordinatorObj.CoordinatorQuestionsList, function (item) { return item.TypeId == 2 && (item.OdValue !== '' || item.OsValue !== '') });
                    var CounsellingDetails = $filter("filter")($scope.CoordinatorObj.CoordinatorQuestionsList, function (item) { return item.TypeId == 3 });
                    var CoordinatorDetails = $filter("filter")($scope.CoordinatorObj.CoordinatorQuestionsList, function (item) { return item.TypeId == 4 });

                    if (VisionChallengesArray1.length > 0) {
                        $scope.CoordinatorObj.IsVisionChallengeDataAdded = true;
                    } else {
                        $scope.CoordinatorObj.IsVisionChallengeDataAdded = false;
                    };

                    if (VisualDiscomfortArray1.length > 0) {
                        $scope.CoordinatorObj.IsVisionDiscomfortDataAdded = true;
                    } else {
                        $scope.CoordinatorObj.IsVisionDiscomfortDataAdded = false;
                    };

                    if (CounsellingDetails.length > 0) {
                        let Counsellingcount = 0;
                        angular.forEach(CounsellingDetails, function (aitem) {
                            if (aitem.Notes !== '') {
                                Counsellingcount++;
                            }
                            if (aitem.CoOrdinatorQuestionValues.length > 0) {
                                angular.forEach(aitem.CoOrdinatorQuestionValues, function (bitem) {
                                    if (bitem.IsChecked) {
                                        Counsellingcount++;
                                    }
                                });
                            }
                        });
                        if (Counsellingcount > 0) {
                            $scope.CoordinatorObj.IsCounsellingDataAdded = true;
                        } else {
                            $scope.CoordinatorObj.IsCounsellingDataAdded = false;
                        };
                    }

                    if (CoordinatorDetails.length > 0) {
                        let Coordinatorcount = 0;
                        angular.forEach(CoordinatorDetails, function (aitem) {
                            if (aitem.Notes !== '') {
                                Coordinatorcount++;
                            }
                            if (aitem.CoOrdinatorQuestionValues.length > 0) {
                                angular.forEach(aitem.CoOrdinatorQuestionValues, function (bitem) {
                                    if (bitem.IsChecked) {
                                        Coordinatorcount++;
                                    }
                                });
                            }
                        });
                        if (Coordinatorcount > 0) {
                            $scope.CoordinatorObj.IsCoordinatorDataAdded = true;
                        } else {
                            $scope.CoordinatorObj.IsCoordinatorDataAdded = false;
                        };
                    }

                    if ($scope.CoordinatorObj.InternalCoManagerNotes !== '' || $scope.CoordinatorObj.ExternalCoManagerNotes !== '') {
                        $scope.CoordinatorObj.IsCoManagerNotesAdded = true;
                    }
                };
            };
        });
    };

    //$scope.SearchPCPDOClist = function () {
    //    var reqObj = {
    //        'LocationId': null,
    //        'PageNumber': 1,
    //        'PageSize': 1000,
    //        'SearchTaxt': "",
    //        "SpecializationId": $scope.SpecializationId || null,
    //        "DeleteInd": 'N',
    //        "OrganizationId": $scope.HospitalId || 0
    //    };
    //    eHnoteReferalDataService.GetReferalPCPDoctors(reqObj).then(function (resp) {
    //        if (resp.data.status === "Success") {
    //            $scope.ReferalPCPDoctorsList = resp.data.PcpRefdetails || [];
    //        }
    //        else {
    //            alertify.error(resp.data.Message);
    //        }
    //    });
    //};
    $scope.init = function () {
        $scope.allSubSpecializationsArray = [];
        eHnoteMainAppointmentService.getBranchSubSpecializationsById(doctorinfo.doctordata.UserAddress[0].SubOrganizationId, $scope.HospitalId).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.row.length > 0) {
                    $scope.allSubSpecializationsArray = resp.data.row;
                    $scope.listSubSplArray = angular.copy(resp.data.row);
                    angular.forEach($scope.allSubSpecializationsArray, function (item) {
                        item.isChecked = true;
                    });
                }
                var listSubSplArray = $filter("filter")($scope.allSubSpecializationsArray, function (iterator, ind) { return iterator.isChecked === true; });
                var subSplArray = _.pluck(listSubSplArray, "SubSpecializationId").join(",");

                var reqObj = {
                    "BranchId": $scope.BranchId,
                    "SubSpecializationIdArray": subSplArray
                }

                eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
                function onGetUsersSuccess(resp) {
                    if (resp.rows.length > 0) {

                        $scope.allUserList = resp.rows || [];
                        $scope.SetQuickSummarySurgeonCredentials();
                        /* the LASIK chart may have bound before the user list arrived */
                        $scope.BuildLasikSignOffInfo();
                        if ($scope.allUserList.length !== 0) {

                            $scope.OnlyNusrseAnesthetistRoles = [];
                            $scope.OnlyNusrseAnesthetistRoles = $scope.allUserList.filter((x) => x.RoleId == 8 || x.RoleId == 25);

                            $scope.CheckinChecklistArray = [];
                            $scope.CheckinChecklistArray = $scope.OnlyNusrseAnesthetistRoles;

                        }

                        if ($scope.cacheStorageItem.SurgeryList.length > 0) {
                            angular.forEach($scope.cacheStorageItem.SurgeryList, function (item) {
                                $scope.PatientDischargeObj.OperativeProcedure = item.SurgeryName;
                                $scope.PatientDischargeObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
                                $scope.PatientDischargeObj.OrganId = item.OrganId;

                                item.DiagnosisList = item.DiagnosisList || [];
                                if (item.DiagnosisList.length > 0) {
                                    $scope.PatientDischargeObj.Diagnosis = item.DiagnosisList[0].DiagnosisName || '';
                                }

                                if (item.DiagnosisList.length > 1) {
                                    $scope.PatientDischargeObj.Diagnosis2 = item.DiagnosisList[1].DiagnosisName || '';
                                }

                                item.DoctorId = item.DoctorId || '';
                                item.DoctorId = item.DoctorId == '' ? item.SurgeonId : '';

                                if (item.DoctorId != null) {

                                    item.DoctorId = item.DoctorId || '';

                                } else {
                                    item.DoctorId = $scope.UserId;
                                }
                                if (item.DoctorId != '') {
                                    let temparray3 = $filter('filter')($scope.allUserList, { 'DoctorID': item.DoctorId }, true);
                                    if (temparray3.length > 0) {
                                        $scope.PatientDischargeObj.Surgeon = temparray3[0].UserFullName || '';
                                        //$scope.PatientDischargeObj.DoctorSuffix = angular.copy(temparray3[0].SuffixName) || '';
                                        $scope.PatientDischargeObj.DoctorLicense = angular.copy(temparray3[0].LicenseNumber) || '';
                                        //if (temparray3[0].SuffixId == 10) {
                                        //    $scope.PatientDischargeObj.Surgeon = ' Dr. ' + $scope.PatientDischargeObj.Surgeon + ' ' + $scope.PatientDischargeObj.DoctorSuffix;
                                        //} else {

                                        //    $scope.PatientDischargeObj.Surgeon =  $scope.PatientDischargeObj.Surgeon + ' ' + $scope.PatientDischargeObj.DoctorSuffix;
                                        //}
                                    } else {
                                        $scope.PatientDischargeObj.Surgeon = "";
                                    }
                                }

                                item.InternalCoManagerId = item.InternalCoManagerId || '';
                                if (item.InternalCoManagerId != '') {
                                    let temparray = $filter('filter')($scope.allUserList, { 'DoctorID': item.InternalCoManagerId }, true);
                                    if (temparray.length > 0) {
                                        $scope.PatientDischargeObj.InternalCoManager = temparray[0].FullName || '';
                                    }
                                }

                                item.ExternalCoManagerId = item.ExternalCoManagerId || '';
                                if (item.ExternalCoManagerId != '') {
                                    let temparray = $filter('filter')($scope.allUserList, { 'DoctorID': item.ExternalCoManagerId }, true);
                                    if (temparray.length > 0) {
                                        $scope.PatientDischargeObj.ExternalCoManager = temparray[0].FullName || '';
                                    }
                                }
                                //$scope.PatientDischargeObj.FullName = $scope.cacheStorageItem.PatientName || "";
                                //$scope.PatientDischargeObj.DOB = $scope.cacheStorageItem.PatientDOB || "";
                                //$scope.PatientDischargeObj.PatientDisplayId = $scope.cacheStorageItem.PatientDisplayId || "";
                            });
                        }

                        if ($scope.OperativeNotesObj.OperativeNotesReviewedBy != null) {
                            var TempFilter = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.OperativeNotesObj.OperativeNotesReviewedBy }, true) || [];
                            if (TempFilter.length > 0) {
                                $scope.OperativeNotesObj.OperativeReviewedName = angular.copy(TempFilter[0].UserFullName);
                                //$scope.OperativeNotesObj.OperativeReviewedNameSuffix = angular.copy(TempFilter[0].SuffixName);
                                $scope.OperativeNotesObj.ReviewedByLicenseNumber = angular.copy(TempFilter[0].LicenseNumber);

                                //if (TempFilter[0].SuffixId == 10) {
                                //    $scope.OperativeNotesObj.OperativeReviewedName = ' Dr. ' + $scope.OperativeNotesObj.OperativeReviewedName;
                                //}
                            }
                            else {
                                $scope.OperativeNotesObj.OperativeReviewedName = '';
                                //$scope.OperativeNotesObj.OperativeReviewedNameSuffix = '';
                                $scope.OperativeNotesObj.ReviewedByLicenseNumber = '';
                            }

                        }



                        if ($scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedBy != null) {
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
                                    $scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedName = angular.copy(AnesthetistReviewedlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                                } else {
                                    $scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedName = angular.copy(AnesthetistReviewedlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                                }
                            }
                        }
                        if ($scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedBy != null) {

                            if ($scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedBy !== null) {
                                var AnesthesiologistReviewedlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedBy }) || [];
                                if (AnesthesiologistReviewedlist.length > 0) {
                                    var LicenseNumber = "";
                                    AnesthesiologistReviewedlist[0].LicenseNumber = AnesthesiologistReviewedlist[0].LicenseNumber || "";
                                    if (AnesthesiologistReviewedlist[0].LicenseNumber != "") {
                                        LicenseNumber = 'LIC :' + ' ' + AnesthesiologistReviewedlist[0].LicenseNumber;
                                    }
                                    $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedName = angular.copy(AnesthesiologistReviewedlist[0].UserFullName + ' ' + LicenseNumber);

                                }
                            }
                        }



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
                                    $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthetistName = Anesthetistlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
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


                                var LicenseNumber = "";

                                AnesthesiologistList[0].LicenseNumber = AnesthesiologistList[0].LicenseNumber || "";
                                if (AnesthesiologistList[0].LicenseNumber != "") {
                                    LicenseNumber = 'LIC :' + ' ' + AnesthesiologistList[0].LicenseNumber;
                                }
                                $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistName = AnesthesiologistList[0].UserFullName + ' ' + LicenseNumber;


                            }
                        }
                    }  else {
                        alertify.error("No Users Found in Selected Departments");
                    }
                    showascpreadmissionondemand();
                }
                function onGetUsersFailure(data) {
                    showascpreadmissionondemand();
                }
            }
        });
        // $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var data = datapersistanceFactory.getItem("ASCPastvisits");
        //data.PreAdmSurgeryList = data.PreAdmSurgeryList || [];
        //if (data.PreAdmSurgeryList.length > 0) {
        //    $scope.cacheStorageItem.PreAdmAppointmentId = data.PreAdmSurgeryList[0].PreAdmAppointmentId;
        //}
        //data.SurgeryList = data.SurgeryList || [];
        //if (data.SurgeryList.length > 0) {
        //    $scope.cacheStorageItem.AscAppointmentId = data.SurgeryList[0].AscAppointmentId;
        //}

        $scope.SelectedAppointmentTypeId = data.AppointmentTypeId;
        $scope.SelectedAppointmentId = data.AppointmentId;
        $scope.SelectedAppointmentHospitalId = data.HospitalId;
        $scope.IscomingFromInd = data.IscomingFromInd || false;
        /* Bulk Sign-Off names the LASIK phase it was clicked on - 1 Pre-Op,
           2 Intra-Op, 3 Post-Op. Absent, the template opens on Pre-Op. */
        $scope.SelectedLasikTypeId = data.LasikTypeId || null;
        $scope.SelectedSubTab = data.SubTab || 7;
        $scope.SelectedNurseAnesthesiaTab = data.NurseAnesthesiaTab || 1;
        $scope.IsComingFrom = data.IsComingFrom || '';
        $scope.SelectedVisitId = data.VisitId || 0;
        $scope.SelectedPatientID = data.PatientID || 0;
        data.SurgeryList = data.SurgeryList || [];
        if (data.SurgeryList.length > 0) {
            $scope.SurgeryCategoryId = data.SurgeryList[0].SurgeryCategoryId || 0;
            $scope.SurgeryCategoryName = data.SurgeryList[0].SurgeryCategoryName || '';
            let SurgeryTemplateType = '';
            if ($scope.SurgeryCategoryId != 4 && $scope.SurgeryCategoryId != 3) {
                SurgeryTemplateType = "Tabbed"
            } else if ($scope.SurgeryCategoryId == 4 || $scope.SurgeryCategoryId == 3) {
                SurgeryTemplateType = "SinglePage"
            }
            // In ASC controller, based on what was saved:
            if (SurgeryTemplateType === "Tabbed") {
                // Show Pre-Op / Intra-Op / Post-Op tabs with Nurse + Anesthesia sub-tabs
                // Used by: Cataract, Retina, Oculoplastics, Glaucoma, Cornea, Strabismus
                $scope.showTabbedTemplate = true;
                $scope.showSinglePageTemplate = false;
                $scope.showYAGTemplate = false;
            } else if (SurgeryTemplateType === "SinglePage") {
                if ($scope.SurgeryCategoryId === 4) {
                    // YAG — load existing YAG template, hide Pre/Intra/Post tabs
                    $scope.showYAGTemplate = true;
                    $scope.showTabbedTemplate = false;
                    $scope.showSinglePageTemplate = false;
                } else {
                    // LASIK — new single-page template
                    $scope.showSinglePageTemplate = true;
                    $scope.showTabbedTemplate = false;
                    $scope.showYAGTemplate = false;
                }
            }
        }

        $scope.ShowCorneaAsepsisBandage = true;
        if ($scope.SurgeryCategoryId == 4) {
            $scope.ShowCorneaAsepsisBandage = false;
        }
        
        $scope.IsShowYagTemplate = eHnoteMasterDataService.getIsShowYagTemplate();
        //$scope.cacheStorageItem.SurgeryList = data.SurgeryList || [];
        //$scope.cacheStorageItem.AscAppointmentId = $scope.cacheStorageItem.AscAppointmentId || 0;
        //if ($scope.cacheStorageItem.AscAppointmentId == 0) {
        //    $scope.cacheStorageItem.AscAppointmentId = data.AscAppointmentId || 0;
        //}
        //$scope.cacheStorageItem.PreAdmSurgeryList = data.PreAdmSurgeryList || [];

        

       // $scope.SearchPCPDOClist();
    }

    //function showascpreadmissionondemand() {
    //    if ($scope.cacheStorageItem.AppointmentTypeId == 4) {
    //        $scope.SelectedAppointmentTypeId = $scope.cacheStorageItem.AppointmentTypeId;
    //        $scope.SelectedAppointmentId = $scope.cacheStorageItem.AppointmentId;

    //        if ($scope.IscomingFromInd) {
    //            $scope.SubTabMin = $scope.SelectedSubTab;
    //            switch ($scope.SubTabMin) {
    //                case 3: // Pre-Op
    //                    $scope.PreopNurseAnestiatab = $scope.SelectedNurseAnesthesiaTab;
    //                    break;
    //                case 4: // Intra-Op
    //                    $scope.IntropNurseAnestiatab = $scope.SelectedNurseAnesthesiaTab;
    //                    break;
    //                case 5: // Post-Op
    //                    $scope.PostopNurseAnestiatab = $scope.SelectedNurseAnesthesiaTab;
    //                    break;
    //            }
                
    //        }
    //        else if($scope.RoleId === 30 || $scope.RoleId === 25) {
    //            $scope.SubTabMin = 4;
    //        } else {
    //            $scope.SubTabMin = 7;
    //        }
    //    } else {
    //        $scope.SelectedAppointmentTypeId = $scope.cacheStorageItem.AppointmentTypeId;
    //        $scope.SelectedAppointmentId = $scope.cacheStorageItem.AppointmentId;
    //        $scope.SubTabMin = 2;
    //    }
    //    $scope.onClickSummaryTab($scope.SubTabMin);
    //}

    $scope.IsFemtoTemplateShow = $scope.cacheStorageItem.IsFemtoTemplateShow || false;
    $scope.IsYagTemplateShow = $scope.cacheStorageItem.IsYagTemplateShow || false;

    $scope.IsPreopYagDataAdded = $scope.cacheStorageItem.IsPreopYagDataAdded || false;
    $scope.IsIntraopYagDataAdded = $scope.cacheStorageItem.IsIntraopYagDataAdded || false;
    $scope.IsPostopYagDataAdded = $scope.cacheStorageItem.IsPostopYagDataAdded || false;
    $scope.IsFemtoDataAdded = $scope.cacheStorageItem.IsFemtoDataAdded || false;
    $scope.SelectedAppointmentDate = $scope.cacheStorageItem.AppointmentDate
    $scope.showTabbedTemplate = false;
    $scope.showSinglePageTemplate = false;
    $scope.showYAGTemplate = false;
    $scope.SurgeryCategoryId = 0;
    /* The summary tab is named for the chart it opens - 4 is the Laser (Yag,
       Retina) template, 3 and 1 the LASIK one. */
    $scope.GetLasikTemplateName = function () {
        return (Number($scope.SurgeryCategoryId) === 4)
            ? "Laser (Yag, Retina) Template"
            : "Lasik Template";
    };

    /* Which categories offer the template tab at all: 3 (LASIK) and 4 (Laser /
       YAG), which are charted in it alone, and 1 (Cataract), which has the tab
       alongside its own Pre-Op / Intra-Op / Post-Op sections - the same as the ASC
       appointment list, which sets showLasikTemplate for category 1 too. */
    $scope.IsLasikTemplateTabAvailable = function () {
        return $scope.showYAGTemplate || $scope.showSinglePageTemplate ||
            Number($scope.SurgeryCategoryId) === 1;
    };

    $scope.SurgeryCategoryName = '';
    $scope.$on("ASCAllvisits", function (event, data) {
        console.log(data);
        //$scope.SelectedAppointmentTypeId = data.AppointmentTypeId;
        //$scope.SelectedAppointmentId = data.AppointmentId;
        //$scope.cacheStorageItem.SurgeryList = data.SurgeryList || [];
        //$scope.cacheStorageItem.PreAdmSurgeryList = data.PreAdmSurgeryList || [];
        //if (data.PreAdmSurgeryList.length > 0) {
        //    $scope.cacheStorageItem.PreAdmAppointmentId = data.PreAdmSurgeryList[0].PreAdmAppointmentId;
        //}
        //if (data.SurgeryList.length > 0) {
        //    $scope.cacheStorageItem.AscAppointmentId = data.SurgeryList[0].AscAppointmentId;
        //}

        $scope.IsFemtoTemplateShow = data.IsFemtoTemplateShow;
        $scope.IsYagTemplateShow = data.IsYagTemplateShow;
        $scope.IscomingFromInd = data.IscomingFromInd || false;
        /* Bulk Sign-Off names the LASIK phase it was clicked on - 1 Pre-Op,
           2 Intra-Op, 3 Post-Op. Absent, the template opens on Pre-Op. */
        $scope.SelectedLasikTypeId = data.LasikTypeId || null;
        $scope.IsComingFrom = data.IsComingFrom || '';
        $scope.SelectedVisitId = data.VisitId || 0;
        $scope.SelectedPatientID = data.PatientID || 0;
        $scope.SelectedAppointmentDate = data.SelectedAppointmentDate || 0;
        $scope.SelectedSubTab = data.SubTab || 7;
        $scope.SelectedNurseAnesthesiaTab = data.NurseAnesthesiaTab || 1;

        if (data.AppointmentTypeId == 4 || data.AppointmentTypeId == 14) {
            $scope.cacheStorageItem.AppointmentTypeId = data.AppointmentTypeId;
            $scope.SelectedAppointmentTypeId = data.AppointmentTypeId;
            $scope.SelectedAppointmentId = data.AppointmentId;
            data.SurgeryList = data.SurgeryList || [];
            if (data.SurgeryList.length > 0) {
                $scope.SurgeryCategoryId = data.SurgeryList[0].SurgeryCategoryId || 0;
                $scope.SurgeryCategoryName = data.SurgeryList[0].SurgeryCategoryName || '';
                let SurgeryTemplateType = '';
                if ($scope.SurgeryCategoryId != 4 && $scope.SurgeryCategoryId != 3) {
                    SurgeryTemplateType = "Tabbed"
                } else if ($scope.SurgeryCategoryId == 4 || $scope.SurgeryCategoryId == 3) {
                    SurgeryTemplateType = "SinglePage"
                }
                // In ASC controller, based on what was saved:
                if (SurgeryTemplateType === "Tabbed") {
                    // Show Pre-Op / Intra-Op / Post-Op tabs with Nurse + Anesthesia sub-tabs
                    // Used by: Cataract, Retina, Oculoplastics, Glaucoma, Cornea, Strabismus
                    $scope.showTabbedTemplate = true;
                    $scope.showSinglePageTemplate = false;
                    $scope.showYAGTemplate = false;
                } else if (SurgeryTemplateType === "SinglePage") {
                    if ($scope.SurgeryCategoryId  === 4) {
                        // YAG — load existing YAG template, hide Pre/Intra/Post tabs
                        $scope.showYAGTemplate = true;
                        $scope.showTabbedTemplate = false;
                        $scope.showSinglePageTemplate = false;
                    } else {
                        // LASIK — new single-page template
                        $scope.showSinglePageTemplate = true;
                        $scope.showTabbedTemplate = false;
                        $scope.showYAGTemplate = false;
                    }
                }
            }

            $scope.ShowCorneaAsepsisBandage = true;
            if ($scope.SurgeryCategoryId == 4) {
                $scope.ShowCorneaAsepsisBandage = false;
            }

            if ($scope.RoleId == 30 || $scope.RoleId === 25) {
                $scope.SubTabMin = 4;
            } else {
                $scope.SubTabMin = 7;
            }

            if ($scope.IsComingFrom) {
                $scope.SubTabMin = data.SubTab || 7;

                switch ($scope.SubTabMin) {
                    case 3: // Pre-Op
                        $scope.PreopNurseAnestiatab = $scope.SelectedNurseAnesthesiaTab;
                        break;
                    case 4: // Intra-Op
                        $scope.IntropNurseAnestiatab = $scope.SelectedNurseAnesthesiaTab;
                        break;
                    case 5: // Post-Op
                        $scope.PostopNurseAnestiatab = $scope.SelectedNurseAnesthesiaTab;
                        break;
                }
            }


        } else {
            $scope.cacheStorageItem.AppointmentTypeId = data.AppointmentTypeId;
            $scope.SelectedAppointmentTypeId = data.AppointmentTypeId;
            $scope.SelectedAppointmentId = data.AppointmentId;
            $scope.SelectedAppointmentHospitalId = data.HospitalId || $scope.HospitalId;

            if ($scope.RoleId == 8) {
                $scope.SubTabMin = 10;
               
            } else if ($scope.RoleId == 72) {
                $scope.SubTabMin = 9;
            } else if ($scope.RoleId == 30 || $scope.RoleId == 25) {
                $scope.SubTabMin = 2;
            } else if ($scope.RoleId == 18) {
                $scope.SubTabMin = 13;
            } else {
                $scope.SubTabMin = 2;
            }
        }

        $scope.onClickSummaryTab($scope.SubTabMin);
    });

    function showascpreadmissionondemand() {
        if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14){
            //$scope.SelectedAppointmentTypeId = $scope.cacheStorageItem.AppointmentTypeId;
            //$scope.SelectedAppointmentId = $scope.cacheStorageItem.AppointmentId;

            if ($scope.IscomingFromInd) {
                $scope.SubTabMin = $scope.SelectedSubTab;
                switch ($scope.SubTabMin) {
                    case 3: // Pre-Op
                        $scope.PreopNurseAnestiatab = $scope.SelectedNurseAnesthesiaTab;
                        break;
                    case 4: // Intra-Op
                        $scope.IntropNurseAnestiatab = $scope.SelectedNurseAnesthesiaTab;
                        break;
                    case 5: // Post-Op
                        $scope.PostopNurseAnestiatab = $scope.SelectedNurseAnesthesiaTab;
                        break;
                }
            } else if ($scope.RoleId === 30 || $scope.RoleId === 25) {
                $scope.SubTabMin = 4;
            } else {
                $scope.SubTabMin = 7;
            }
        } else {
            //$scope.SelectedAppointmentTypeId = $scope.cacheStorageItem.AppointmentTypeId;
            //$scope.SelectedAppointmentId = $scope.cacheStorageItem.AppointmentId;
            if ($scope.RoleId == 8) {
                $scope.SubTabMin = 10;

            } else if ($scope.RoleId == 72) {
                $scope.SubTabMin = 9;
            } else if ($scope.RoleId == 30 || $scope.RoleId == 25) {
                $scope.SubTabMin = 2;
            } else if ($scope.RoleId == 18) {
                $scope.SubTabMin = 13;
            } else {
                $scope.SubTabMin = 2;
            }
        }
        $scope.onClickSummaryTab($scope.SubTabMin);
    }
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
            "SelectedHepaticIssues": "",
            "SelectedEndocrineIssues": "",
            "SelectedNeurologicIssues": "",
            "SelectedHemeOncIssues": "",
            "EndocrineNotes": "",
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
            "IsCNSHistory": null,
            "IsCardiovascularHistory": null,
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
            "IsChestPain": null,
            "CardiologyChartStatus": '',
            "CardiologyStatus": '',
            "MedicineOrdersInstructions": '',
            "DocumentDetails": [],
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
            "AllergyRemarks": "",
            "SurgicalRemarks": "",
            "CurrentSystemicRemarks": "",
            "CurrentEyeRemarks": "",
            "PhysicianLifestyleHistoryRemarks": "",
            "PhysicianSystemicHistoryRemarks":"",
            "OrderDetails": [],
            "PhysicianRespiratoryRemarks":""
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
            "OrderDetails": [],
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
            "NPOTime": "",

            "OrderedByLicenseNumber": '',
            "OrderedByName": '',
            "IsOrderedByReviewed": false,
            "OrderedByDateTime": '',
            "OrderedBy": null,
            "PreopCallArrivalTime": '',
            "ReviewedByDateTime": null,
            "AdmittedByDateTime":null
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
            "AnesthesiologistId": null,
            "IsRisksbenefitsAnesthesia": false 

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

    $scope.SurgeryDiagnosisObj = {
        "SurgeryName": '',
        "SurgeonId": 0,
        "SurgeonName": '',
        "InternalCoManagerName": '',
        "ExternalCoManagerName": '',
        "AnesthesistName": '',
        "PreAdmissionStatus": '',
        "CardialogistStatus": '',
        "OrganId": null
    }

    $scope.cacheStorageItem.SurgeryList = $scope.cacheStorageItem.SurgeryList || [];
    //if ($scope.cacheStorageItem.SurgeryList.length > 0) {
    //    angular.forEach($scope.cacheStorageItem.SurgeryList, function (item) {

    //        item.DiagnosisList = item.DiagnosisList || [];
    //        if (item.DiagnosisList.length > 0) {
    //            $scope.PatientDischargeObj.Diagnosis = item.DiagnosisList[0].DiagnosisName || '';
    //        }

    //        if (item.DiagnosisList.length > 1) {
    //            $scope.PatientDischargeObj.Diagnosis2 = item.DiagnosisList[1].DiagnosisName || '';
    //        }

    //});
    //}

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
        if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
            appointmentId = $scope.SelectedAppointmentId;
        }

        if ($scope.SelectedAppointmentTypeId == 7 || $scope.SelectedAppointmentTypeId == 6) {
            appointmentId = $scope.cacheStorageItem.AscAppointmentId;
        }

        let req1 = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "CheckListModuleId": 1
        };

        let req = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": appointmentId || null,
            "PatientId": $scope.SelectedPatientID || null
        };

        $q.all([
            eHnoteSurgeryService.GetOrganizationASCCheckListData(req1),
            eHnoteSurgeryService.GetPreOpChartData(req),
        ]).then(function (resp) {

            let OrgASCChecklists = angular.copy(resp[0].data.rows);
            if (resp[0].data.status === "Success") {
                $scope.IVSiteMarkingList = resp[0].data.IVSiteMarkingList || [];
                $scope.PreOpQuickSummaryObj.OrgASCChecklist = angular.copy(resp[0].data.rows);
                $scope.PreOpQuickSummaryObj.NursingCarePlanData = angular.copy(resp[0].data.rows);
                angular.forEach($scope.PreOpQuickSummaryObj.OrgASCChecklist, function (item) {
                    angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                        kitem.IsChecked = false;
                    });
                });
               
                $scope.IVSiteMarkingList = resp[0].data.IVSiteMarkingList || [];

                if (!$scope.ParentObj.IsIOJParentOrganization) {
                    $scope.PreOpQuickSummaryObj.IVBlockedArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 7 }, true) || [];
                } else {
                    $scope.PreOpQuickSummaryObj.IVBlockedArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 2 }, true) || [];
                };

                $scope.PreOpQuickSummaryObj.IVBlockedArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 2 }, true) || [];

                if ($scope.PreOpQuickSummaryObj.IVBlockedArray.length > 0) {
                    angular.forEach($scope.PreOpQuickSummaryObj.IVBlockedArray, function (item) {
                        item.IsSelected = false;
                        item.DeleteInd = 'N';
                    })
                }
                //$scope.PreOpQuickSummaryObj.IVBlockedArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 2 }, true);
                if (!$scope.ParentObj.IsIOJParentOrganization) {
                    $scope.PreOpQuickSummaryObj.IVSiteFluidsArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 6 }, true);
                    $scope.PreOpQuickSummaryObj.IVSiteFlushArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 4 }, true);
                    $scope.PreOpQuickSummaryObj.IVSiteLRArray = $filter('filter')($scope.IVSiteMarkingList, { 'TypeId': 5 }, true);
                };
                
            }

            if (resp[1].data.Status === "Success") {
                $scope.PreOpQuickSummaryObj.AllergyItems = resp[1].data.AllergyItems || [];
                $scope.PreOpQuickSummaryObj.SurgicalHistory = resp[1].data.SurgicalHistory || [];
                $scope.PreOpQuickSummaryObj.SystemicHistory = resp[1].data.SystemicHistory || [];
                $scope.PreOpQuickSummaryObj.SurgeryList = resp[1].data.SurgeryList || [];
                $scope.PreOpQuickSummaryObj.CurrentEyeMedications = angular.copy(resp[1].data.CurrentEyeMedicationList);
                $scope.PreOpQuickSummaryObj.CurrentSystemicMedicationsHistory = angular.copy(resp[1].data.CurrentSystemicMedicationList);
                $scope.PreOpQuickSummaryObj.LifestyleHistory = angular.copy(resp[1].data.LifestyleHistory) || [];
                $scope.PreOpQuickSummaryObj.LastSignOffUserDetails = angular.copy(resp[1].data.LastSignOffUserDetails) || [];
                $scope.ReviewedByLicenseNo = "";
                $scope.ReviewedBySuffixName = "";


                resp[1].data.CurrentAppointmentVital = resp[1].data.CurrentAppointmentVital || '';
                resp[1].data.LatestAppointmentVital = resp[1].data.LatestAppointmentVital || '';

                resp[1].data.CurrentAppointmentVital.Height = resp[1].data.CurrentAppointmentVital.Height || '';
                resp[1].data.CurrentAppointmentVital.HeightUnit = resp[1].data.CurrentAppointmentVital.HeightUnit || '';
                resp[1].data.CurrentAppointmentVital.Weight = resp[1].data.CurrentAppointmentVital.Weight || '';
                resp[1].data.CurrentAppointmentVital.WeightUnit = resp[1].data.CurrentAppointmentVital.WeightUnit || '';
                resp[1].data.CurrentAppointmentVital.BMI = resp[1].data.CurrentAppointmentVital.BMI || '';

                resp[1].data.LatestAppointmentVital.Height = resp[1].data.LatestAppointmentVital.Height || '';
                resp[1].data.LatestAppointmentVital.HeightUnit = resp[1].data.LatestAppointmentVital.HeightUnit || '';
                resp[1].data.LatestAppointmentVital.Weight = resp[1].data.LatestAppointmentVital.Weight || '';
                resp[1].data.LatestAppointmentVital.WeightUnit = resp[1].data.LatestAppointmentVital.WeightUnit || '';
                resp[1].data.LatestAppointmentVital.BMI = resp[1].data.LatestAppointmentVital.BMI || '';

                if (resp[1].data.CurrentAppointmentVital.Height != "" || resp[1].data.CurrentAppointmentVital.Weight !== '' || resp[1].data.CurrentAppointmentVital.BMI !== '') {
                    $scope.PreOpQuickSummaryObj.Height = resp[1].data.CurrentAppointmentVital.Height || '';
                    $scope.PreOpQuickSummaryObj.HeightUnit = resp[1].data.CurrentAppointmentVital.HeightUnit || '';
                    $scope.PreOpQuickSummaryObj.Weight = resp[1].data.CurrentAppointmentVital.Weight || '';
                    $scope.PreOpQuickSummaryObj.WeightUnit = resp[1].data.CurrentAppointmentVital.WeightUnit || '';
                    $scope.PreOpQuickSummaryObj.BMI = resp[1].data.CurrentAppointmentVital.BMI || '';
                } else {
                    $scope.PreOpQuickSummaryObj.Height = resp[1].data.LatestAppointmentVital.Height || '';
                    $scope.PreOpQuickSummaryObj.HeightUnit = resp[1].data.LatestAppointmentVital.HeightUnit || '';
                    $scope.PreOpQuickSummaryObj.Weight = resp[1].data.LatestAppointmentVital.Weight || '';
                    $scope.PreOpQuickSummaryObj.WeightUnit = resp[1].data.LatestAppointmentVital.WeightUnit || '';
                    $scope.PreOpQuickSummaryObj.BMI = resp[1].data.LatestAppointmentVital.BMI || '';
                }
                $scope.PatientChekListArray = [];

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

                    if (resp[1].data.rows[0].OrgASCChecklist.length > 0) {
                        angular.forEach(resp[1].data.rows[0].OrgASCChecklist, function (item) {
                            angular.forEach($scope.PreOpQuickSummaryObj.OrgASCChecklist, function (kitem) {
                                /*if (item.CheckListCategoryId == 11) {*/
                                    if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                                        if (kitem.CheckListId === item.CheckListId) {
                                            kitem.IsChecked = true;
                                            kitem.Score = item.Score || 0;
                                            kitem.Value = item.Value || '';
                                            kitem.Remarks = item.Remarks || '';
                                            kitem.ChecklistDate = $filter("date")(item.ChecklistDate, "MM-dd-yyyy") || "";
                                            kitem.ChecklistTime = item.ChecklistTime || "";
                                            kitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                                            //if (item.SubCheckList.length > 0) {
                                            //    angular.forEach(item.SubCheckList, function (jitem) {
                                            //        angular.forEach(kitem.SubCheckList, function (hitem) {
                                            //            if (hitem.SubCheckListId == jitem.SubCheckListId) {
                                            //                hitem.IsChecked = true;
                                            //                kitem.IsChecked = true;
                                            //                hitem.PatientAscSubCheckListId = jitem.PatientAscSubCheckListId || null;
                                            //            }
                                            //        });
                                            //    });
                                            //}

                                            angular.forEach(kitem.OrganizationCheckListDetails, function (hitem) {
                                                if (hitem.Value == item.Value && hitem.CheckListId === item.CheckListId) {
                                                    kitem.IsChecked = true;
                                                    hitem.IsChecked = true;
                                                    hitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || 0;
                                                    hitem.Value = item.Value || '';
                                                }
                                            });

                                            if (kitem.CheckListId == 212 || kitem.CheckListId == 170 || kitem.CheckListId == 171) {
                                                if (item.AscMultiCheckValueArray.length > 0) {
                                                    angular.forEach(item.AscMultiCheckValueArray, function (jitem) {
                                                        angular.forEach(kitem.OrganizationCheckListDetails, function (Litem) {
                                                            if (Litem.OrganizationPreOpCheckListValueId == jitem.OrganizationPreOpCheckListValueId) {
                                                                Litem.IsChecked = true;
                                                                Litem.PatientMultiCheckListId = jitem.PatientMultiCheckListId || null;
                                                            }
                                                        });
                                                    });
                                                }
                                            }
                                        }
                                   /* }*/
                                }
                            });
                        });
                    }

                    $scope.PreAdmissionDetails.OrgAscChecklistDetails = $scope.PreAdmissionDetails.OrgAscChecklistDetails || [];

                    if ($scope.PreAdmissionDetails.OrgAscChecklistDetails.length > 0) {
                        angular.forEach($scope.PreAdmissionDetails.OrgAscChecklistDetails, function (item) {
                            angular.forEach($scope.PreOpQuickSummaryObj.OrgASCChecklist, function (kitem) {
                                if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                                    if (kitem.CheckListId === item.CheckListId) {
                                        kitem.IsChecked = true;
                                        kitem.Score = item.Score || 0;
                                        kitem.Value = item.Value || '';
                                        kitem.Remarks = item.Remarks || '';

                                        kitem.ChecklistDate = $filter("date")(item.ChecklistDate, "MM-dd-yyyy") || "";
                                        kitem.ChecklistTime = item.ChecklistTime || "";

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

                        $scope.PreOpQuickSummaryObj.AllOrgAscChecklistData = $filter("filter")($scope.PreOpQuickSummaryObj.OrgASCChecklist, function (kitem) { return kitem.CheckListCategoryId == 7 }, true);

                    }

                    $scope.PreOpQuickSummaryObj.FallRiskAssessmentTotalScore = resp[1].data.rows[0].FallRiskAssessmentTotalScore || '';
                    $scope.PreOpQuickSummaryObj.FallriskBraceletprovided = resp[1].data.rows[0].FallriskBraceletprovided || '';
                    $scope.PreOpQuickSummaryObj.AssistiveWalkingDevice = resp[1].data.rows[0].AssistiveWalkingDevice || '';
                    $scope.PreOpQuickSummaryObj.ImplementedFallRiskProtocol = resp[1].data.rows[0].ImplementedFallRiskProtocol || false;
                    $scope.PreOpQuickSummaryObj.ImplementedFallRiskProtocoltype = resp[1].data.rows[0].ImplementedFallRiskProtocoltype || '';

                    $scope.PreOpQuickSummaryObj.PreOpAccompainedBy = resp[1].data.rows[0].PreOpAccompainedBy || '';
                    $scope.PreOpQuickSummaryObj.PreOpAccompainedByNotes = resp[1].data.rows[0].PreOpAccompainedByNotes || '';
                    $scope.PreOpQuickSummaryObj.FamilyRelationId = resp[1].data.rows[0].FamilyRelationId || null;
                    $scope.PreOpQuickSummaryObj.FamilyRelationName = resp[1].data.rows[0].FamilyRelationName || '';
                    $scope.PreOpQuickSummaryObj.PreOpAccompainedName = resp[1].data.rows[0].AccompainedName || '';
                    $scope.PreOpQuickSummaryObj.PreOpAccompaniedSign = resp[1].data.rows[0].PreOpAccompaniedSign || '';
                    $scope.PreOpQuickSummaryObj.PreOpAccompaniedSignedDateTime = resp[1].data.rows[0].PreOpAccompaniedSignedDateTime || null;

                    if ($scope.PreOpQuickSummaryObj.PreOpAccompaniedSign !== '') {
                        $scope.PreOpQuickSummaryObj.IsAccompaniedSignDone = true;
                        //var canvasP1 = document.getElementById("SE_AccompaniedBySign");
                        //var ctxP1 = canvasP1.getContext("2d");
                        //ctxP1.clearRect(0, 0, canvasP1.width, canvasP1.height);
                        //var imageP1 = new Image();
                        //imageP1.onload = function () {
                        //    ctxP1.drawImage(imageP1, 0, 0, canvasP1.width, canvasP1.height);
                        //};
                        //imageP1.src = $scope.PreOpQuickSummaryObj.PreOpAccompaniedSign;
                    }

                    $scope.PreOpQuickSummaryObj.AllergyRemarks = resp[1].data.rows[0].AllergyRemarks || '';
                    $scope.PreOpQuickSummaryObj.SurgicalRemarks = resp[1].data.rows[0].SurgicalRemarks || '';
                    $scope.PreOpQuickSummaryObj.CurrentEyeRemarks = resp[1].data.rows[0].CurrentEyeRemarks || '';
                    $scope.PreOpQuickSummaryObj.CurrentSystemicRemarks = resp[1].data.rows[0].CurrentSystemicRemarks || '';
                    $scope.PreOpQuickSummaryObj.SystemicHistoryRemarks = resp[1].data.rows[0].SystemicHistoryRemarks || '';
                    $scope.PreOpQuickSummaryObj.LifestyleHistoryRemarks = resp[1].data.rows[0].LifestyleHistoryRemarks || '';

                    $scope.PreOpQuickSummaryObj.IsSurgeonOrdersTimeChecked = resp[1].data.rows[0].IsSurgeonOrdersTimeChecked || false;
                    $scope.PreOpQuickSummaryObj.IsAnesthesiaOrdersTimeChecked = resp[1].data.rows[0].IsAnesthesiaOrdersTimeChecked || false;

                    //$scope.PreOpQuickSummaryObj.LifestyleHistoryArray = angular.copy(rresp[1].data.LifestyleDetail) || [];
                    //$scope.PreOpQuickSummaryObj.AllergyItems = angular.copy(resp[1].data.AllergyItems) || [];
                    //$scope.PreOpQuickSummaryObj.SurgicalHistory = angular.copy(resp[1].data.SurgicalHistory) || [];
                    //$scope.PreOpQuickSummaryObj.CurrentSystemicMedicationList = angular.copy(resp[1].data.CurrentSystemicMedicationList) || [];
                    //$scope.PreOpQuickSummaryObj.SystemicHistory = angular.copy(resp[1].data.SystemicHistory) || [];

                    $scope.PreOpQuickSummaryObj.VitalsArray = resp[1].data.rows[0].VitalsArray || [];

                    if ($scope.PreOpQuickSummaryObj.VitalsArray.length > 0) {
                        $scope.PreOpQuickSummaryObj.VitalsDisplay = $scope.GetDisplayVitalsArray();
                        angular.forEach($scope.PreOpQuickSummaryObj.VitalsArray, function (mainitem, $index) {

                            let ndate = moment().format("YYYY-MM-DD");
                            let edate = ndate + " " + mainitem.VitalAddTime;
                            mainitem.VitalAddTime = moment(edate, "YYYY-MM-DD HH:mm").format("hh:mm A");

                            let TempFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 11 }, true) || [];
                            if (TempFilter.length > 0) {
                                var tempobj = {
                                    "value": TempFilter[0].Value,
                                    "UnitTypeName": TempFilter[0].UnitTypeName
                                }
                            }
                            $scope.PreOpQuickSummaryObj.VitalsDisplay[0].Values.push(tempobj);
                            let pulseFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 12 }, true) || [];
                            if (pulseFilter.length > 0) {
                                var pulseobj = {
                                    "value": pulseFilter[0].Value,
                                    "UnitTypeName": pulseFilter[0].UnitTypeName
                                }
                            }
                            $scope.PreOpQuickSummaryObj.VitalsDisplay[1].Values.push(pulseobj);
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
                            $scope.PreOpQuickSummaryObj.VitalsDisplay[2].Values.push(Bpobj);
                            let RespFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 14 }, true) || [];
                            if (RespFilter.length > 0) {
                                var Respobj = {
                                    "value": RespFilter[0].Value,
                                    "UnitTypeName": RespFilter[0].UnitTypeName
                                }
                            }
                            $scope.PreOpQuickSummaryObj.VitalsDisplay[3].Values.push(Respobj);
                            let Spo2Filter = $filter('filter')(mainitem.Vitals, { "VitalId": 15 }, true) || [];
                            if (Spo2Filter.length > 0) {
                                var Spo2obj = {
                                    "value": Spo2Filter[0].Value,
                                    "UnitTypeName": Spo2Filter[0].UnitTypeName
                                }
                            }
                            $scope.PreOpQuickSummaryObj.VitalsDisplay[4].Values.push(Spo2obj);
                            let BGLFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 8 }, true) || [];
                            if (BGLFilter.length > 0) {
                                var BGLobj = {
                                    "value": BGLFilter[0].Value,
                                    "UnitTypeName": BGLFilter[0].UnitTypeName
                                }
                            }
                            $scope.PreOpQuickSummaryObj.VitalsDisplay[5].Values.push(BGLobj);
                            
                            var Time = {
                                "value": $scope.PreOpQuickSummaryObj.VitalsArray[$index].VitalAddTime || "",
                                "UnitTypeName": "",
                            }
                            $scope.PreOpQuickSummaryObj.VitalsDisplay[6].Values.push(Time);
                            var performedBy = {
                                "value": $scope.PreOpQuickSummaryObj.VitalsArray[$index].UserName || "",
                                "UnitTypeName": "",
                            }
                            $scope.PreOpQuickSummaryObj.VitalsDisplay[7].Values.push(performedBy);

                            var NotesObj = {
                                "value": $scope.PreOpQuickSummaryObj.VitalsArray[$index].VitalRemarks || "",
                                "UnitTypeName": "",
                            }
                            $scope.PreOpQuickSummaryObj.VitalsDisplay[8].Values.push(NotesObj);
                        });
                    }


                    $scope.PreOpQuickSummaryObj.FallRiskLevel = resp[1].data.rows[0].FallRiskLevel || '';
                    $scope.PreOpQuickSummaryObj.NurseFallRiskID = resp[1].data.rows[0].NurseFallRiskID || 0;
                    $scope.PreOpQuickSummaryObj.NurseFallRiskName = resp[1].data.rows[0].NurseFallRiskName || '';
                    $scope.PreOpQuickSummaryObj.NurseFallRiskLicenseNo = resp[1].data.rows[0].NurseFallRiskLicenseNo || '';
                    $scope.PreOpQuickSummaryObj.OxygenType = resp[1].data.rows[0].OxygenType || "";
                    $scope.PreOpQuickSummaryObj.OxygenQuantity = resp[1].data.rows[0].OxygenQuantity || "";
                    $scope.PreOpQuickSummaryObj.EndotrachealTubeNotes = resp[1].data.rows[0].EndotrachealTubeNotes || "";
                    $scope.PreOpQuickSummaryObj.LMANotes = resp[1].data.rows[0].LMANotes || "";
                    $scope.PreOpQuickSummaryObj.PreOpInRoomTime = resp[1].data.rows[0].PreOpInRoomTime || '';
                    $scope.PreOpQuickSummaryObj.PreOpDiabetesRemarks = resp[1].data.rows[0].PreOpDiabetesRemarks || ''; 
                    $scope.PreOpQuickSummaryObj.IvAccessGivenBy = resp[1].data.rows[0].IvAccessGivenBy || null;
                    $scope.PreOpQuickSummaryObj.NoOfAttempts = resp[1].data.rows[0].NoOfAttempts || null;
                    $scope.PreOpQuickSummaryObj.IvAccessGivenByTime = resp[1].data.rows[0].IvAccessGivenByTime || '';
                    $scope.PreOpQuickSummaryObj.IvAccessGivenByName = $scope.PreOpQuickSummaryObj.IvAccessGivenByName || '';
                    $scope.PreOpQuickSummaryObj.PreOpNurseChartStatus = resp[1].data.rows[0].PreOpNurseChartStatus || '';
                    $scope.PreOpQuickSummaryObj.PreOpAnesthesiaChartStatus = resp[1].data.rows[0].PreOpAnesthesiaChartStatus || '';

                    $scope.PreOpQuickSummaryObj.MentalStatus = resp[1].data.rows[0].MentalStatus  || '';
                    //if ($scope.PreOpQuickSummaryObj.IvAccessGivenBy !== null) {
                    //    let IvGivenBy = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreOpQuickSummaryObj.IvAccessGivenBy }, true) || [];
                    //    if (IvGivenBy.length > 0) {
                    //        $scope.PreOpQuickSummaryObj.IvAccessGivenByName = IvGivenBy[0].FullName || '';
                    //    }
                    //} else {
                    //    if ($scope.RoleId == 8) {
                    //        $scope.PreOpQuickSummaryObj.IvAccessGivenBy = $scope.UserId || null;
                    //    };
                    //}

                    if (resp[1].data.rows[0].NurseFallRiskReviewdDate != "") {
                        var NurseFallRiskReviewdDate = resp[1].data.rows[0].NurseFallRiskReviewdDate || "";
                        $scope.PreOpQuickSummaryObj.NurseFallRiskReviewdDate = $filter('date')(NurseFallRiskReviewdDate, 'MM-dd-yyyy hh:mm a') || '';
                    }

                    $scope.PreOpQuickSummaryObj.ODPupilSize = preopdata.ODPupilSize || "";

                    // Femto Template

                    $scope.PreOpQuickSummaryObj.FemtoArcuateIncisions1 = preopdata.FemtoArcuateIncisions1 || '';
                    $scope.PreOpQuickSummaryObj.IsFemtoArcuateIncisions1NA = preopdata.IsFemtoArcuateIncisions1NA || false;
                    $scope.PreOpQuickSummaryObj.FemtoArcuateIncisions2 = preopdata.FemtoArcuateIncisions2 || '';
                    $scope.PreOpQuickSummaryObj.IsFemtoArcuateIncisions2NA = preopdata.IsFemtoArcuateIncisions2NA || false;
                    $scope.PreOpQuickSummaryObj.FemtoArcuateIncisionsNotes = preopdata.FemtoArcuateIncisionsNotes || '';
                    $scope.PreOpQuickSummaryObj.FemtoTimeOut = preopdata.FemtoTimeOut || '';
                    $scope.PreOpQuickSummaryObj.FemtoStartTime = preopdata.FemtoStartTime || '';
                    $scope.PreOpQuickSummaryObj.FemtoEndTime = preopdata.FemtoEndTime || '';
                    $scope.PreOpQuickSummaryObj.FemtoReferenceNo = preopdata.FemtoReferenceNo || '';
                    $scope.PreOpQuickSummaryObj.FemtoLotNo = preopdata.FemtoLotNo || '';
                    $scope.PreOpQuickSummaryObj.FemtoExpiryDate = preopdata.FemtoExpiryDate || null;
                    $scope.PreOpQuickSummaryObj.FemtoOverAllNotes = preopdata.FemtoOverAllNotes || '';
                    $scope.PreOpQuickSummaryObj.FemtNurseReviewedById = preopdata.FemtNurseReviewedById || null;
                    $scope.PreOpQuickSummaryObj.FemtNurseReviewedByName = preopdata.FemtNurseReviewedByName || '';
                    $scope.PreOpQuickSummaryObj.FemtDoctorReviewedById = preopdata.FemtDoctorReviewedById || null;
                    $scope.PreOpQuickSummaryObj.FemtDoctorReviewedByName = preopdata.FemtDoctorReviewedByName || '';
                    $scope.PreOpQuickSummaryObj.FemtDoctorReviewedByDate = preopdata.FemtDoctorReviewedByDate || null;
                    $scope.PreOpQuickSummaryObj.FemtDoctorReviewedByTime = preopdata.FemtDoctorReviewedByTime || '';

                    if ($scope.PreOpQuickSummaryObj.FemtoArcuateIncisionsNotes !== '') {
                        $scope.PreOpQuickSummaryObj.FemtoArcuateNotesInd = true;
                    } else {
                        $scope.PreOpQuickSummaryObj.FemtoArcuateNotesInd = false;
                    }

                    if ($scope.PreOpQuickSummaryObj.FemtoExpiryDate !== null) {
                        $scope.PreOpQuickSummaryObj.FemtoExpiryDate = $filter("date")($scope.PreOpQuickSummaryObj.FemtDoctorReviewedByDate, "MM-dd-yyyy") || null;
                    }
                    if ($scope.PreOpQuickSummaryObj.FemtDoctorReviewedByDate !== null) {
                        $scope.PreOpQuickSummaryObj.FemtDoctorReviewedByDate = $filter("date")($scope.PreOpQuickSummaryObj.FemtoExpiryDate, "MM-dd-yyyy") || null;
                    }

                    if ($scope.PreOpQuickSummaryObj.FemtoArcuateIncisions1 !== '' || $scope.PreOpQuickSummaryObj.IsFemtoArcuateIncisions1NA || $scope.PreOpQuickSummaryObj.FemtoArcuateIncisions2 !== '' || $scope.PreOpQuickSummaryObj.IsFemtoArcuateIncisions2NA || $scope.PreOpQuickSummaryObj.FemtoTimeOut !== '' || $scope.PreOpQuickSummaryObj.FemtoStartTime !== '' || $scope.PreOpQuickSummaryObj.FemtoEndTime !== '' || $scope.PreOpQuickSummaryObj.FemtoReferenceNo !== ''
                        || $scope.PreOpQuickSummaryObj.FemtoLotNo !== '' || $scope.PreOpQuickSummaryObj.FemtoExpiryDate !== null || $scope.PreOpQuickSummaryObj.FemtoOverAllNotes !== '' || $scope.PreOpQuickSummaryObj.FemtNurseReviewedById !== null || $scope.PreOpQuickSummaryObj.FemtDoctorReviewedById !== null || $scope.PreOpQuickSummaryObj.FemtDoctorReviewedByDate !== null || $scope.PreOpQuickSummaryObj.FemtDoctorReviewedByTime !== '') {
                        $scope.PreOpQuickSummaryObj.IfFemtoTemplateDataAdded = true;
                    } else {
                        $scope.PreOpQuickSummaryObj.IfFemtoTemplateDataAdded = false;
                    }

                    $scope.PreOpQuickSummaryObj.PainLevel = preopdata.PainLevel;
                    $scope.PreOpQuickSummaryObj.IVSiteName = preopdata.IVSiteName || "";
                    $scope.PreOpQuickSummaryObj.IVNeedleSizeName = preopdata.IVNeedleSizeName || "";
                    $scope.PreOpQuickSummaryObj.PatencyStatus = preopdata.PatencyStatus || "";
                    $scope.PreOpQuickSummaryObj.IVArm = preopdata.IVArm || "";
                    $scope.PreOpQuickSummaryObj.IdentifierName = preopdata.IdentifierName || "";
                    $scope.PreOpQuickSummaryObj.IdentifierDurationDate = preopdata.IdentifierDurationDate || "";
                    $scope.PreOpQuickSummaryObj.PreOpOverallNotes = preopdata.PatientCheckIn.PreOpOverallNotes || '';
                    $scope.PreOpQuickSummaryObj.IVSiteFluids = preopdata.IVSiteFluids || null;
                    $scope.PreOpQuickSummaryObj.IVSiteFlush = preopdata.IVSiteFlush || null;
                    $scope.PreOpQuickSummaryObj.IVFluidsId = preopdata.IVFluidsId || null;
                    $scope.PreOpQuickSummaryObj.IVSiteLactatedRingers = preopdata.IVSiteLactatedRingers || null;
                    //if (preopdata.IVBlockedArray.length > 0) {
                       
                    //    $scope.PreOpQuickSummaryObj.IVSiteBlocked = true;
                    //    angular.forEach($scope.PreOpQuickSummaryObj.IVBlockedArray, function (hitem) {
                    //        angular.forEach(preopdata.IVBlockedArray, function (kitem) {
                    //            if (kitem.IVSiteMarkingId === hitem.IVSiteMarkingId) {
                    //                kitem.IsSelected = true;
                    //                hitem.IsSelected = true;
                    //                hitem.DeleteInd = 'N';
                    //                hitem.IVSiteMarkingName = kitem.IVSiteMarkingName;
                    //                hitem.PatientIVBlockedId = kitem.PatientIVBlockedId || 0;
                                   
                    //            }
                    //        });
                    //    });
                    //}
                    //if ($scope.PreOpQuickSummaryObj.IVSiteFluids !== null) {
                    //    let FluidsArray = $filter('filter')($scope.PreOpQuickSummaryObj.IVSiteFluidsArray, { 'IVSiteMarkingId': $scope.PreOpQuickSummaryObj.IVSiteFluids }, true) || [];
                    //    if (FluidsArray.length > 0) {
                    //        $scope.PreOpQuickSummaryObj.IVSiteFluidsName = FluidsArray[0].IVSiteMarkingName || '';
                    //    };
                    //};
                    //if ($scope.PreOpQuickSummaryObj.IVSiteFlush !== null) {
                    //    let FlushArray = $filter('filter')($scope.PreOpQuickSummaryObj.IVSiteFlushArray, { 'IVSiteMarkingId': $scope.PreOpQuickSummaryObj.IVSiteFlush }, true) || [];
                    //    if (FlushArray.length > 0) {
                    //        $scope.PreOpQuickSummaryObj.IVSiteFlushName = FlushArray[0].IVSiteMarkingName || '';
                    //    };
                    //};
                    //if ($scope.PreOpQuickSummaryObj.IVSiteLactatedRingers !== null) {
                    //    let LactatedArray = $filter('filter')($scope.PreOpQuickSummaryObj.IVSiteLRArray, { 'IVSiteMarkingId': $scope.PreOpQuickSummaryObj.IVSiteLactatedRingers }, true) || [];
                    //    if (LactatedArray.length > 0) {
                    //        $scope.PreOpQuickSummaryObj.IVSiteLactatedRingersName = LactatedArray[0].IVSiteMarkingName || '';
                    //    };
                    //};
                    //if ($scope.PreOpQuickSummaryObj.IVFluidsId !== null) {
                    //    let Array = $filter('filter')($scope.PreOpQuickSummaryObj.IVFluidsArray, { 'IVSiteMarkingId': $scope.PreOpQuickSummaryObj.IVFluidsId }, true) || [];
                    //    if (Array.length > 0) {
                    //        $scope.PreOpQuickSummaryObj.IVFluidsName = Array[0].IVSiteMarkingName || '';
                    //    };
                    //};

                    //if ($scope.PreOpQuickSummaryObj.PatencyStatus == 'Blocked') {
                    //    $scope.PreOpQuickSummaryObj.IVSiteBlocked = true;
                    //} else {
                    //    $scope.PreOpQuickSummaryObj.IVSiteBlocked = false;
                    //}
                    $scope.PreOpQuickSummaryObj.IVAccessDetailsList = preopdata.IVAccessDetailsList || [];
                    if ($scope.PreOpQuickSummaryObj.IVAccessDetailsList.length > 0) {
                        angular.forEach($scope.PreOpQuickSummaryObj.IVAccessDetailsList, function (item) {
                            item.IVSiteFluidsName = item.IVSiteFluidsName || '';
                            if (item.IVSiteFluids !== null) {
                                let FluidsArray = $filter('filter')($scope.PreOpQuickSummaryObj.IVSiteFluidsArray, { 'IVSiteMarkingId': item.IVSiteFluids }, true) || [];
                                if (FluidsArray.length > 0) {
                                    item.IVSiteFluidsName = FluidsArray[0].IVSiteMarkingName || '';
                                }
                            };
                            item.IVSiteFlushName = item.IVSiteFlushName || '';
                            if (item.IVSiteFlush !== null) {
                                let FlushArray = $filter('filter')($scope.PreOpQuickSummaryObj.IVSiteFlushArray, { 'IVSiteMarkingId': item.IVSiteFlush }, true) || [];
                                if (FlushArray.length > 0) {
                                    item.IVSiteFlushName = FlushArray[0].IVSiteMarkingName || '';
                                }
                            };
                            item.IVSiteLactatedRingersName = item.IVSiteLactatedRingersName || '';
                            if (item.IVSiteLactatedRingers !== null) {
                                let LactatedArray = $filter('filter')($scope.PreOpQuickSummaryObj.IVSiteLRArray, { 'IVSiteMarkingId': item.IVSiteLactatedRingers }, true) || [];
                                if (LactatedArray.length > 0) {
                                    item.IVSiteLactatedRingersName = LactatedArray[0].IVSiteMarkingName || '';
                                }
                            };
                            item.IVFluidsName = item.IVFluidsName || "";
                            if (item.IVFluidsId !== null) {
                                let Array = $filter('filter')($scope.PreOpQuickSummaryObj.IVFluidsArray, { 'IVSiteMarkingId': item.IVFluidsId }, true) || [];
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
                            item.IvAccessGivenByTime = item.IvAccessGivenByTime || "";
                            item.IvAccessGivenByDate = item.IvAccessGivenByDate || null;
                            if (item.IvAccessGivenByDate != null) {
                                item.IvAccessGivenByDate = $filter('date')(item.IvAccessGivenByDate, "MM-dd-yyyy");
                            }

                            if (item.PatencyStatus !== '' || item.IvAccessGivenBy !== null || item.IVNeedleSizeName !== '' || item.IVSiteName !== '' || item.IvAccessGivenByTime !== '' || item.IVArm !== '') {
                                $scope.PreOpQuickSummaryObj.IsIVAccessdata = true;
                            }

                        });
                    }

                    preopdata.SurgicalSiteVerifiedBy = preopdata.SurgicalSiteVerifiedBy || null;
                    $scope.PreOpQuickSummaryObj.PreOpSurgicalSiteRemarks = preopdata.PreOpSurgicalSiteRemarks || "";
                    if (preopdata.SurgicalSiteVerifiedBy != null) {
                        let SurgicalUser = $filter('filter')($scope.allUserList, { 'DoctorID': preopdata.SurgicalSiteVerifiedBy }, true) || [];
                        var LicenseNo = '';
                        if (SurgicalUser.length > 0) {
                            if (SurgicalUser[0].LicenseNumber != '') {
                                var LicenseNo = SurgicalUser[0].LicenseNumber || '';
                            }

                            $scope.PreOpQuickSummaryObj.SurgicalSiteVerifiedByName = SurgicalUser[0].SecondUserFullName + ' ' + LicenseNo;
                        }
                    }

                    if (preopdata.IVBlockedArray.length > 0) {
                        angular.forEach($scope.PreOpQuickSummaryObj.IVBlockedArray, function (hitem) {
                            angular.forEach(preopdata.IVBlockedArray, function (kitem) {
                                if (kitem.IVSiteMarkingId === hitem.IVSiteMarkingId) {
                                    kitem.IsSelected = true;
                                    hitem.IsSelected = true;
                                    hitem.IVSiteMarkingName = kitem.IVSiteMarkingName;
                                    hitem.PatientIVBlockedId = kitem.PatientIVBlockedId || 0;


                                }
                            });
                        });
                    }

                    $scope.PreOpQuickSummaryObj.PreOpHandOffFrom = preopdata.PreOpHandOffFrom || null;
                    $scope.PreOpQuickSummaryObj.PreOpHandOffReviewedBy = preopdata.PreOpHandOffReviewedBy || null;
                    $scope.PreOpQuickSummaryObj.PreOpHandOffTime = preopdata.PreOpHandOffTime || "";
                    $scope.PreOpQuickSummaryObj.PreOpHandoffRemarks = preopdata.PreOpHandoffRemarks || "";
                    $scope.PreOpQuickSummaryObj.PreOpAnesthesiaNotes = preopdata.PreOpAnesthesiaNotes || null;


                    if ($scope.PreOpQuickSummaryObj.PreOpHandOffReviewedBy != null) {
                        let HandUser = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreOpQuickSummaryObj.PreOpHandOffReviewedBy }, true) || [];
                        var License = '';
                        if (HandUser.length > 0) {
                            if (HandUser[0].LicenseNumber != '') {
                                var License = HandUser[0].LicenseNumber || '';
                            }

                            $scope.PreOpQuickSummaryObj.PreOpHandOffReviewedName = HandUser[0].SecondUserFullName + ' ' + License;
                        }
                    }
                    if ($scope.PreOpQuickSummaryObj.PreOpHandOffFrom != null) {
                        let HandUser = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreOpQuickSummaryObj.PreOpHandOffFrom }, true) || [];
                        var License = '';
                        if (HandUser.length > 0) {
                            if (HandUser[0].LicenseNumber != '') {
                                var License = HandUser[0].LicenseNumber || '';
                            }

                            $scope.PreOpQuickSummaryObj.PreOpHandOffFromName = HandUser[0].SecondUserFullName + ' ' + License;
                        }
                    } else {
                        $scope.PreOpQuickSummaryObj.PreOpHandOffFromName = '';
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

                    $scope.PreOpQuickSummaryObj.ReviewedBy = preopdata.ReviewedBy || null;
                    $scope.PreOpQuickSummaryObj.ReviewedDate = preopdata.ReviewedDate || '';
                    $scope.PreOpQuickSummaryObj.ReviewedTime = preopdata.ReviewedTime || '';
                    $scope.PreOpQuickSummaryObj.DilationReviewId = preopdata.DilationReviewId || '';
                    $scope.PreOpQuickSummaryObj.MedicationReviewId = preopdata.MedicationReviewId || '';
                    if ($scope.PreOpQuickSummaryObj.ReviewedBy != null) {
                        var ReviewedByArraylist = $filter("filter")($scope.allUserList, function (item) { return item.DoctorID == $scope.PreOpQuickSummaryObj.ReviewedBy }) || [];
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

                    //if (preopdata.PreOpMedications.length > 0) {
                    //    angular.forEach(preopdata.PreOpMedications, function (hitem) {
                    //        var dateTimeString = hitem.ModifiedDt;
                    //        $scope.ModifiedPreopMedicationDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                    //    });
                    //}

                    //if (preopdata.DilationMedications.length > 0) {
                    //    angular.forEach(preopdata.DilationMedications, function (hitem) {
                    //        var dateTimeString = hitem.ModifiedDt;
                    //        $scope.ModifiedDilationDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                    //    });
                    //}

                    if (preopdata.OrderDetails.length > 0) {
                       
                        angular.forEach(preopdata.OrderDetails, function (Mitem) {
                            Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                            Mitem.UserOrderId = Mitem.UserOrderId || null;
                            Mitem.UserType = Mitem.UserType || null;
                            Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                            Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                            Mitem.ModifiedDt = Mitem.ModifiedDt || '';
                            if (Mitem.DilationMedications.length > 0) {
                                if (Mitem.DilationMedications.length > 0) {
                                    angular.forEach(Mitem.DilationMedications, function (item) {
                                        var dateTimeString = item.ModifiedDt;
                                        $scope.ModifiedDilationDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');                                      
                                    });
                                }

                            }

                            if (Mitem.PreOpMedications.length > 0) {
                                if (Mitem.PreOpMedications.length > 0) {
                                    angular.forEach(Mitem.PreOpMedications, function (item) {
                                        var dateTimeString = item.ModifiedDt;
                                        $scope.ModifiedPreopMedicationDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');                                    
                                    });
                                }

                            }
                        });
                    }

                    $scope.PreOpQuickSummaryObj.DilationMedicationsNotes = preopdata.DilationMedicationsNotes || '';
                    $scope.PreOpQuickSummaryObj.MedicationRemarks = preopdata.MedicationRemarks || '';

                    if ($scope.PreOpQuickSummaryObj.ReviewedDate != '' || $scope.PreOpQuickSummaryObj.ReviewedTime != '' || $scope.PreOpQuickSummaryObj.ReviewedByName != '') {
                        $scope.PreOpQuickSummaryObj.ReviewedbyInd = true;
                    } else {
                        $scope.PreOpQuickSummaryObj.ReviewedbyInd = false;
                    }

                    //$scope.PreOpQuickSummaryObj.PreOpMedications = angular.copy(preopdata.PreOpMedications);
                    //$scope.PreOpQuickSummaryObj.DilationMedications = angular.copy(preopdata.DilationMedications);
                    $scope.PreOpQuickSummaryObj.OrderDetails = angular.copy(preopdata.OrderDetails);
                    $scope.SetSurgeonCredentials($scope.PreOpQuickSummaryObj.OrderDetails);
                    if ($scope.PreOpQuickSummaryObj.OrderDetails.length > 0) {
                        var NurseMedCount = 0;
                        var NurseGenCount = 0;
                        var AnesthesiaGenCount = 0;
                        var AnesthesiaMedCount = 0;

                        angular.forEach($scope.PreOpQuickSummaryObj.OrderDetails, function (item) {
                            item.ReviewedBy = item.ReviewedBy || '';
                                if(item.ReviewedBy != ''){
                                    var Arraylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.ReviewedBy }, true);
                                    if (Arraylist.length > 0) {
                                            item.ReviewedByName = Arraylist[0].FullName + ' ' + Arraylist[0].SuffixName;
                                    }
                                }
                            if (item.MedTypeId == 1) {
                                if (item.PreOpMedications.length > 0) {
                                    AnesthesiaMedCount++;
                                };
                                if (item.GeneralOrders.length > 0) {
                                    AnesthesiaGenCount++;
                                };
                            }
                            else if (item.MedTypeId == 2) {
                                if (item.DilationMedications.length > 0) {
                                    NurseMedCount++;
                                };
                                if (item.GeneralOrders.length > 0) {
                                    NurseGenCount++;
                                };
                            }
                        });

                        if (NurseMedCount !== 0) {
                            $scope.show.IsNurseMedications = true;
                        } else {
                            $scope.show.IsNurseMedications = false;
                        };

                        if (NurseGenCount !== 0) {
                            $scope.show.IsNurseGenOrders = true;
                        } else {
                            $scope.show.IsNurseGenOrders = false;
                        };
                        if (AnesthesiaMedCount !== 0) {
                            $scope.show.IsAnesthesiaMedications = true;
                        } else {
                            $scope.show.IsAnesthesiaMedications = false;
                        };

                        if (AnesthesiaGenCount !== 0) {
                            $scope.show.IsAnesthesiaGenOrders = true;
                        } else {
                            $scope.show.IsAnesthesiaGenOrders = false;
                        };
                    } else {
                        $scope.PreOpQuickSummaryObj.OrderDetails = [];

                        $scope.show.IsAnesthesiaMedications = false;
                        $scope.show.IsAnesthesiaGenOrders = false;
                        $scope.show.IsNurseGenOrders = false;
                        $scope.show.IsNurseMedications = false;
                    }

                    $scope.PreOpQuickSummaryObj.DocumentDetails = angular.copy(preopdata.DocumentDetails);
                    $scope.PreOpQuickSummaryObj.PreOpCallDetails = angular.copy(preopdata.PreOpCallDetails);
                    /*$scope.PreOpQuickSummaryObj.OrgASCChecklist = angular.copy(preopdata.OrgASCChecklist);*/
                    $scope.PreOpQuickSummaryObj.HealthArray = angular.copy(preopdata.HealthArray);

                    if ($scope.PreOpQuickSummaryObj.Ascpatientpopupsavearray.length != 0) {
                        $scope.PreOpQuickSummaryObj.Ascpatientpopupsavearray[0] = angular.copy(preopdata.PatientCheckIn);
                    } else {
                        $scope.PreOpQuickSummaryObj.Ascpatientpopupsavearray.push(preopdata.PatientCheckIn);
                    }
                    //$scope.PreOpQuickSummaryObj.Ascpatientpopupsavearray.push(preopdata.PatientCheckIn);
                    $scope.IsAscPreoppatientChecklistarrayEmpty = false;
                    if ($scope.PreOpQuickSummaryObj.Ascpatientpopupsavearray.length > 0) {
                        angular.forEach($scope.PreOpQuickSummaryObj.Ascpatientpopupsavearray, function (item) {
                            if (item.RecievedForSurgery == '' && item.AccompainedBy == '' && item.PreOperativeOrientationOffered == '' && item.ObservedBehavior == '' && item.LevelOfConsciousness == '' && item.PatientTransfferedIn == '' && item.PatientDestination == '' && item.PTERefers == '' && item.PreOpOverallNotes == '') {
                                $scope.IsAscPreoppatientChecklistarrayEmpty = true;
                            }
                        });
                    }

                    $scope.AscPreopObj.OrgASCChecklist = angular.copy(OrgASCChecklists);
                    if (preopdata.OrgASCChecklist.length > 0) {
                        angular.forEach(preopdata.OrgASCChecklist, function (item) {
                            angular.forEach($scope.AscPreopObj.OrgASCChecklist, function (kitem) {
                                if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                                    if (kitem.CheckListId === item.CheckListId) {
                                        kitem.IsChecked = true;
                                        kitem.Score = item.Score || 0;
                                        kitem.Value = item.Value || '';
                                        kitem.Remarks = item.Remarks || '';
                                        kitem.ChecklistTime = item.ChecklistTime || '';
                                        kitem.ChecklistDate = item.ChecklistDate || null;
                                        if (kitem.Remarks !== '') {
                                            kitem.intranotes1 = true;
                                        }
                                        kitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
                                       
                                        if (item.CheckListId == 212 || item.CheckListId == 170 || item.CheckListId == 171) {
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

                    $scope.PreOpQuickSummaryObj.ChunkedGeneralChecklist = [];
                    //let tempArrayGeneral = $filter('filter')($scope.AscPreopObj.OrgASCChecklist, { 'CheckListCategoryId': 6}, true) || [];

                    let tempArrayGeneral = $scope.AscPreopObj.OrgASCChecklist
                        .filter(item =>
                            item.CheckListCategoryId === 6
                        )
                        .sort((a, b) => a.OrgOrderBy - b.OrgOrderBy);

                    let filteredClinicalChecklist1 = angular.copy(tempArrayGeneral);
                    if (filteredClinicalChecklist1.length > 0) {
                        let chunkSize = Math.ceil((filteredClinicalChecklist1.length) / 2);
                        for (let i = 0; i < filteredClinicalChecklist1.length; i += chunkSize) {
                            $scope.PreOpQuickSummaryObj.ChunkedGeneralChecklist.push(filteredClinicalChecklist1.slice(i, i + chunkSize));
                        }
                    }

                    $scope.PreOpQuickSummaryObj.ChunkedClinicalChecklist = [];
                    //let tempArray = $filter('filter')($scope.AscPreopObj.OrgASCChecklist, { 'CheckListCategoryId': 1, 'CheckListSubTypeId': 1 }, true) || [];

                    let tempArray = $scope.AscPreopObj.OrgASCChecklist
                        .filter(item =>
                            item.CheckListCategoryId === 1 &&
                            item.CheckListSubTypeId === 1
                        )
                        .sort((a, b) => a.OrgOrderBy - b.OrgOrderBy);

                    let filteredClinicalChecklist = angular.copy(tempArray);
                    if (filteredClinicalChecklist.length > 0) {
                        let chunkSize = Math.ceil((filteredClinicalChecklist.length) / 2);
                        for (let i = 0; i < filteredClinicalChecklist.length; i += chunkSize) {
                            $scope.PreOpQuickSummaryObj.ChunkedClinicalChecklist.push(filteredClinicalChecklist.slice(i, i + chunkSize));
                        }
                    }

                    $scope.PreOpQuickSummaryObj.ChunkedPatientChecklist = [];
                    let tempPatientArray = $filter('filter')($scope.AscPreopObj.OrgASCChecklist, { 'CheckListCategoryId': 12, 'CheckListSubTypeId': 1 }, true) || [];
                    let filteredPatientChecklist = angular.copy(tempPatientArray);
                    if (filteredPatientChecklist.length > 0) {
                        let chunkSize = Math.ceil((filteredPatientChecklist.length) / 2);
                        for (let i = 0; i < filteredPatientChecklist.length; i += chunkSize) {
                            $scope.PreOpQuickSummaryObj.ChunkedPatientChecklist.push(filteredPatientChecklist.slice(i, i + chunkSize));
                        }
                    }

                    
                    $scope.PatientChekListArray = (tempPatientArray || []).filter(item =>
                        (item.OrganizationCheckListDetails || []).some(sub => sub.IsChecked === true)
                    );
                    

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
                    $scope.PreOpQuickSummaryObj.IsVeinOpened = preopdata.IsVeinOpened;
                    $scope.PreOpQuickSummaryObj.IsDiabetes = preopdata.IsDiabetes;
                    $scope.PreOpQuickSummaryObj.IsNasalcanula = preopdata.IsNasalcanula;
                    $scope.PreOpQuickSummaryObj.IsHypoglycemiaCheck = preopdata.IsHypoglycemiaCheck;
                    $scope.PreOpQuickSummaryObj.DiabetesResult = preopdata.DiabetesResult || '';
                    $scope.PreOpQuickSummaryObj.DiabetesTime = preopdata.DiabetesTime || '';

                    $scope.PreOpQuickSummaryObj.DiabetesTimings = preopdata.DiabetesTimings || [];
                    if (preopdata.HealthArray.length > 0) {
                        $scope.PreOpQuickSummaryObj.IsShowPreOpCheckListHealthPhysicalInd = true;
                    }
                    else if (!$scope.PreOpQuickSummaryObj.IsCardiacWNL && !$scope.PreOpQuickSummaryObj.IsPulmonaryWNL && !$scope.PreOpQuickSummaryObj.IsHepaticWNL && !$scope.PreOpQuickSummaryObj.IsAutoImmuneDisordersWNL && !$scope.PreOpQuickSummaryObj.IsEndocrineWNL && !$scope.PreOpQuickSummaryObj.IsHemeOncWNL &&
                        !$scope.PreOpQuickSummaryObj.IsKidneyDiseaseWNL && !$scope.PreOpQuickSummaryObj.IsMusculoSkeletalSystemWNL && !$scope.PreOpQuickSummaryObj.IsNervousSystemWNL && !$scope.PreOpQuickSummaryObj.IsNeurologicWNL && !$scope.PreOpQuickSummaryObj.IsOthersWNL && !$scope.PreOpQuickSummaryObj.IsPsychosisWNL) {

                        $scope.PreOpQuickSummaryObj.IsShowPreOpCheckListHealthPhysicalInd = false;
                    } else {
                        $scope.PreOpQuickSummaryObj.IsShowPreOpCheckListHealthPhysicalInd = true;
                    }

                    if ($scope.PreOpQuickSummaryObj.IsVeinOpened == null && $scope.PreOpQuickSummaryObj.IsDiabetes == null && $scope.PreOpQuickSummaryObj.IsHypoglycemiaCheck == null && $scope.PreOpQuickSummaryObj.DiabetesResult == '' && $scope.PreOpQuickSummaryObj.DiabetesTime == '') {
                        $scope.PreOpQuickSummaryObj.IsPreOpMedicationInd = true;
                    } else {
                        $scope.PreOpQuickSummaryObj.IsPreOpMedicationInd = false;
                    }

                    // notes
                    $scope.PreOpQuickSummaryObj.MedicineChecklistRemarks = preopdata.MedicineChecklistRemarks || "";
                    $scope.PreOpQuickSummaryObj.NurseChecklistRemarks = preopdata.NurseChecklistRemarks || "";
                    $scope.PreOpQuickSummaryObj.GeneralChecklistRemarks = preopdata.GeneralChecklistRemarks || "";
                    $scope.PreOpQuickSummaryObj.PreOpMedicationRemarks = preopdata.PreOpMedicationRemarks || "";
                    $scope.PreOpQuickSummaryObj.PreOpNotes = preopdata.PreOpNotes || "";

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
                $scope.PreOpQuickSummaryObj.PreOpNotes = "";
               
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
        if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
            appointmentId = $scope.SelectedAppointmentId;
        }

        if ($scope.SelectedAppointmentTypeId == 7 || $scope.SelectedAppointmentTypeId == 6) {
            appointmentId = $scope.cacheStorageItem.AscAppointmentId;
        }

        let req1 = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "CheckListModuleId": 2
        };

        var param = {
            "AppointmentId": $scope.SelectedAppointmentId || null,
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

                    if (resp[0].data.AnaesthesiaTypes.length > 0) {
                        $scope.IntraOpQuickSummaryObj.AnesthesiaTypelist = resp[0].data.AnaesthesiaTypes || [];
                    }

                    $scope.IntraOpQuickSummaryObj.NursingCarePlanData = [];
                    angular.forEach($scope.IntraOpQuickSummaryObj.AllIntraOpChecklistsArray, function (item) {
                        if (item.CheckListCategoryId == 14 || item.CheckListCategoryId == 15 || item.CheckListCategoryId == 16) {
                            $scope.IntraOpQuickSummaryObj.NursingCarePlanData.push(item);
                        };
                    });

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
                if ($scope.IntraOpQuickSummaryObj.PreOpMedications.length > 0) {
                    angular.forEach($scope.IntraOpQuickSummaryObj.PreOpMedications, function (item) {
                        angular.forEach(item.DropTimings, function (kitem) {
                            if (kitem.GivenBy != null) {
                                let GivenByname = '';
                                var Arraylist = $filter("filter")($scope.allUserList, function (pitem) { return pitem.DoctorID == kitem.GivenBy }, true) || [];
                                if (Arraylist.length > 0) {
                                    GivenByname = Arraylist[0].FirstName + ' ' + Arraylist[0].LastName + ' ' + Arraylist[0].SuffixName
                                    kitem.GivenByname = GivenByname;
                                }
                            }
                        });
                    });
                }

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
                }
                else {
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

                if (resp[1].data.rows.length > 0) {
                    $scope.IntraOpQuickSummaryObj.PhacoMachines = resp[1].data.rows[0].PhacoMachines || [];
                    if ($scope.IntraOpQuickSummaryObj.PhacoMachines.length > 0) {
                        angular.forEach($scope.IntraOpQuickSummaryObj.PhacoMachines, function (item) {
                            item.EquipmentName = item.EquipmentName || '';
                        });
                    }
                    $scope.IntraOpQuickSummaryObj.SurgicalSuplyId = resp[1].data.rows[0].SurgicalSuplyId || null;
                    $scope.IntraOpQuickSummaryObj.SurgicalSupplyName = resp[1].data.rows[0].SurgicalSupplyName || null;

                    $scope.IntraOpQuickSummaryObj.PatientTransferNotes = resp[1].data.rows[0].PatientTransferNotes || "";
                    $scope.IntraOpQuickSummaryObj.PatientTransferType = resp[1].data.rows[0].PatientTransferType || "";

                    $scope.IntraOpQuickSummaryObj.LotNumber = resp[1].data.rows[0].LotNumber || null;
                    $scope.IntraOpQuickSummaryObj.ExpirationDate = resp[1].data.rows[0].ExpirationDate || null;
                    if ($scope.IntraOpQuickSummaryObj.ExpirationDate != null) {
                        $scope.IntraOpQuickSummaryObj.ExpirationDate = $filter('date')($scope.IntraOpQuickSummaryObj.ExpirationDate, "MM-dd-yyyy");
                    }

                    $scope.IntraOpQuickSummaryObj.IsIntraOpSurgeonOrdersTimeAdded = resp[1].data.rows[0].IsIntraOpSurgeonOrdersTimeAdded || false;
                    $scope.IntraOpQuickSummaryObj.IsIntraOpAnesthesiaOrdersTimeAdded = resp[1].data.rows[0].IsIntraOpAnesthesiaOrdersTimeAdded || false;
                }
                    
                $scope.IntraOpQuickSummaryObj.PatientAlert = resp[1].data.PatientAlert || false;
                $scope.IntraOpQuickSummaryObj.VitalsType = resp[1].data.VitalsType || "";
                
                $scope.IntraOpQuickSummaryObj.VitalsStatus = resp[1].data.VitalsStatus || null;
                $scope.IntraOpQuickSummaryObj.LastSignOffUserDetails = angular.copy(resp[1].data.LastSignOffUserDetails) || [];

                $scope.IntraOpQuickSummaryObj.PreOpHandOffTime = resp[1].data.PreOpHandOffTime || "";
                $scope.IntraOpQuickSummaryObj.PreOpHandoffRemarks = resp[1].data.PreOpHandoffRemarks || "";
                $scope.IntraOpQuickSummaryObj.PatientStableSurgery = resp[1].data.PatientStableSurgery || false;
                $scope.IntraOpQuickSummaryObj.AdequatePreoperativeWorkup = resp[1].data.AdequatePreoperativeWorkup || false;

                $scope.ImplantsDetailsArray = [];
                $scope.IntraOpQuickSummaryObj.EquipmentList = [];
                if (resp[1].data.rows.length > 0) {

                    $scope.IntraOpQuickSummaryObj.BeforeORReviewedDateTime = $filter('date')(resp[1].data.rows[0].BeforeORReviewedDateTime, 'MM-dd-yyyy hh:mm a') || null;
                    $scope.IntraOpQuickSummaryObj.BeforeIncisionReviewedDateTime = $filter('date')(resp[1].data.rows[0].BeforeIncisionReviewedDateTime, 'MM-dd-yyyy hh:mm a') || null;
                    $scope.IntraOpQuickSummaryObj.BeforeAnesthesiaReviewedDateTime = $filter('date')(resp[1].data.rows[0].BeforeAnesthesiaReviewedDateTime, 'MM-dd-yyyy hh:mm a') || null;

                    $scope.IntraOpQuickSummaryObj.NurseReviewedDate = $filter('date')(resp[1].data.rows[0].NurseReviewedDate, 'MM-dd-yyyy hh:mm a') || null;
                    $scope.IntraOpQuickSummaryObj.AnesthesiologistReviewedDate = $filter('date')(resp[1].data.rows[0].AnesthesiologistReviewedDate, 'MM-dd-yyyy hh:mm a') || null;

                    $scope.IntraOpQuickSummaryObj.TechnicianReviewedDate = $filter('date')(resp[1].data.rows[0].TechnicianReviewedDate, 'MM-dd-yyyy hh:mm a') || null;

                    $scope.IntraOpQuickSummaryObj.Ordersobj.PatientAscInjections = angular.copy(resp[1].data.rows[0].PatientAscInjections) || [];
                    $scope.IntraOpQuickSummaryObj.Ordersobj.PatientAscEyeDrops = angular.copy(resp[1].data.rows[0].PatientAscEyeDrops) || [];
                    $scope.ImplantsDetailsArray = angular.copy(resp[1].data.rows[0].ImplantsDetailsArray) || [];
                    $scope.IntraOpQuickSummaryObj.OthersDetailsArray = angular.copy(resp[1].data.rows[0].OthersDetailsArray) || [];
                    $scope.IntraOpQuickSummaryObj.EquipmentList = angular.copy(resp[1].data.rows[0].EquipmentList) || [];
                    
                    if (resp[1].data.rows[0].VitalsArray.length > 0) {
                        angular.forEach(resp[1].data.rows[0].VitalsArray, function (item) {
                            var vitalslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.DoctorId });
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
                        //$scope.AllIntraOpChecklistsArray = angular.copy(resp[4].data.rows[0].PatientAscChecklist)||[];
                        angular.forEach(resp[1].data.rows[0].PatientAscChecklist, function (item) {
                            angular.forEach($scope.IntraOpQuickSummaryObj.AllIntraOpChecklistsArray, function (kitem) {
                                if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                                    if (kitem.CheckListId === item.CheckListId) {
                                        kitem.IsChecked = true;
                                        kitem.Score = item.Score || 0;
                                        kitem.Value = item.Value || '';
                                        kitem.Remarks = item.Remarks || '';
                                        if (kitem.Remarks !== '') {
                                            kitem.intranotes1 = true;
                                        }
                                        if (item.AscMultiCheckValueArray.length == 0 && kitem.CheckListId == 180) {
                                            kitem.IsChecked = false;
                                            kitem.Value = '';
                                        }
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
                                            } else {
                                                kitem.IsChecked = false;
                                            }

                                        } else {
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
                    $scope.IntraOpQuickSummaryObj.IntraOpNurseChartStatus = resp[1].data.rows[0].IntraOpNurseChartStatus || '';
                    $scope.IntraOpQuickSummaryObj.IntraOpAnesthesiaChartStatus = resp[1].data.rows[0].IntraOpAnesthesiaChartStatus || '';
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.RiskLevel = resp[1].data.rows[0].NurseActions.RiskLevel || '';

                    $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseFireRiskID = resp[1].data.rows[0].NurseActions.NurseFireRiskID || 0;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseFireRiskName = resp[1].data.rows[0].NurseActions.NurseFireRiskName || '';
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseFireRiskLicenseNo = resp[1].data.rows[0].NurseActions.NurseFireRiskLicenseNo || '';
                    if (resp[1].data.rows[0].NurseActions.NurseFireRiskReviewdDate != "") {
                        var NurseFireRiskReviewdDate = resp[1].data.rows[0].NurseActions.NurseFireRiskReviewdDate || "";
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseFireRiskReviewdDate = $filter('date')(NurseFireRiskReviewdDate, 'MM-dd-yyyy hh:mm a') || '';
                    }
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseFallRiskID = resp[1].data.rows[0].NurseActions.NurseFallRiskID || 0;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseFallRiskName = resp[1].data.rows[0].NurseActions.NurseFallRiskName || '';
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseFallRiskLicenseNo = resp[1].data.rows[0].NurseActions.NurseFallRiskLicenseNo || '';
                    if (resp[1].data.rows[0].NurseActions.NurseFallRiskReviewdDate != "") {
                        var NurseFallRiskReviewdDate = resp[1].data.rows[0].NurseActions.NurseFallRiskReviewdDate || "";
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseFallRiskReviewdDate = $filter('date')(NurseFallRiskReviewdDate, 'MM-dd-yyyy hh:mm a') || '';
                    }
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.DoctorFireRiskID = resp[1].data.rows[0].NurseActions.DoctorFireRiskID || 0;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.DoctorFireRiskName = resp[1].data.rows[0].NurseActions.DoctorFireRiskName || '';
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.DoctorFireRiskLicenseNo = resp[1].data.rows[0].NurseActions.DoctorFireRiskLicenseNo || '';
                    if (resp[1].data.rows[0].NurseActions.DoctorReviewdDate != "") {
                        var DoctorReviewdDate = resp[1].data.rows[0].NurseActions.DoctorReviewdDate || "";
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.DoctorReviewdDate = $filter('date')(DoctorReviewdDate, 'MM-dd-yyyy hh:mm a') || '';
                    }
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthetistFireRiskID = resp[1].data.rows[0].NurseActions.AnesthetistFireRiskID || 0;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthetistFireRiskName = resp[1].data.rows[0].NurseActions.AnesthetistFireRiskName || '';
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthetistFireRiskLicenseNo = resp[1].data.rows[0].NurseActions.AnesthetistFireRiskLicenseNo || '';
                    if (resp[1].data.rows[0].NurseActions.AnesthetistReviewdDate != "") {
                        var AnesthetistReviewdDate = resp[1].data.rows[0].NurseActions.AnesthetistReviewdDate || "";
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthetistReviewdDate = $filter('date')(AnesthetistReviewdDate, 'MM-dd-yyyy hh:mm a') || '';
                    }

                    $scope.IntraOpQuickSummaryObj.NurseActionobj.FallRiskAssessmentTotalScore = resp[1].data.rows[0].NurseActions.FallRiskAssessmentTotalScore || '';
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.FallRiskLevel = resp[1].data.rows[0].NurseActions.FallRiskLevel || '';
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.ImplementedFallRiskProtocoltype = resp[1].data.rows[0].NurseActions.ImplementedFallRiskProtocoltype || '';
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.ImplementedFallRiskProtocol = resp[1].data.rows[0].NurseActions.ImplementedFallRiskProtocol || false;

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
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStaffAnesthesistId = resp[1].data.rows[0].NurseActions.SurgeryStaffAnesthesistId || null;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.ReliefId = resp[1].data.rows[0].NurseActions.ReliefId || null;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseId = resp[1].data.rows[0].NurseActions.NurseId || null;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.AdditionalStaffId = resp[1].data.rows[0].NurseActions.AdditionalStaffId || null;
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


                    resp[1].data.rows[0].NurseActions.SafetyDevicePosition = resp[1].data.rows[0].NurseActions.SafetyDevicePosition || "";
                    if (resp[1].data.rows[0].NurseActions.SafetyDevicePosition != "") {
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.ArmsToTheBody = resp[1].data.rows[0].NurseActions.SafetyDevicePosition.ArmsToTheBody || "";
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.Strap = resp[1].data.rows[0].NurseActions.SafetyDevicePosition.Strap || "";
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.AnotherRailing = resp[1].data.rows[0].NurseActions.SafetyDevicePosition.AnotherRailing || "";
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePositionNotes = resp[1].data.rows[0].NurseActions.SafetyDevicePositionNotes || "";
                    }

                    $scope.IntraOpQuickSummaryObj.NurseActionobj.HydrationIV = resp[1].data.rows[0].NurseActions.HydrationIV || false;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.Cleansed = resp[1].data.rows[0].NurseActions.Cleansed || false;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.CleanContaminated = resp[1].data.rows[0].NurseActions.CleanContaminated || false;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.Dirty = resp[1].data.rows[0].NurseActions.Dirty || false;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.Contaminated = resp[1].data.rows[0].NurseActions.Contaminated || false;

                    $scope.IntraOpQuickSummaryObj.NurseActionobj.PatientTolerated = resp[1].data.rows[0].NurseActions.PatientTolerated || false;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.Disposition = resp[1].data.rows[0].NurseActions.Disposition || false;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.CarePostoperative = resp[1].data.rows[0].NurseActions.CarePostoperative || false;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.Recoveryroom = resp[1].data.rows[0].NurseActions.Recoveryroom || false;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.OthersIntraData = resp[1].data.rows[0].NurseActions.OthersIntraData || '';

                    $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceStartTime = resp[1].data.rows[0].NurseActions.HallEntranceStartTime || "";
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.PatientReceivedById = resp[1].data.rows[0].NurseActions.PatientReceivedById || null;
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.PatientReceivedByName = resp[1].data.rows[0].NurseActions.PatientReceivedByName || "";
                    $scope.IntraOpQuickSummaryObj.HandoffRemarks = resp[1].data.rows[0].HandoffRemarks || "";
                    $scope.IntraOpQuickSummaryObj.HandOffTime = resp[1].data.rows[0].HandOffTime || "";
                    $scope.IntraOpQuickSummaryObj.HandOffReviewedBy = resp[1].data.rows[0].HandOffReviewedBy || null;
                    $scope.IntraOpQuickSummaryObj.HandOffReviewedByName = resp[1].data.rows[0].HandOffReviewedByName || '';
                    $scope.IntraOpQuickSummaryObj.HandOffFromReviewedByName = resp[1].data.rows[0].HandOffFromReviewedByName || '';

                    $scope.IntraOpQuickSummaryObj.AnesthesiaTypelist = resp[1].data.rows[0].AnesthesiaTypelist || [];
                    $scope.IntraOpQuickSummaryObj.EBLValue = resp[1].data.rows[0].AnesthetistActions.EBLValue || "";
                    $scope.IntraOpQuickSummaryObj.IntakeValue = resp[1].data.rows[0].AnesthetistActions.IntakeValue || "";
                    $scope.IntraOpQuickSummaryObj.OutputValue = resp[1].data.rows[0].AnesthetistActions.OutputValue || "";
                    $scope.IntraOpQuickSummaryObj.InTime = resp[1].data.rows[0].AnesthetistActions.InTime || "";
                    $scope.IntraOpQuickSummaryObj.OutTime = resp[1].data.rows[0].AnesthetistActions.OutTime || "";
                    $scope.IntraOpQuickSummaryObj.AnesthesiaMedications = resp[1].data.rows[0].AnesthesiaMedications || [];
                    $scope.IntraOpQuickSummaryObj.IntraOpNotes = resp[1].data.rows[0].IntraOpNotes || null;
                    $scope.IntraOpQuickSummaryObj.IntraOpNurseNotes = resp[1].data.rows[0].IntraOpNurseNotes || "";
                    $scope.IntraOpQuickSummaryObj.IntraOpSurgeryStaffNotes = resp[1].data.rows[0].IntraOpSurgeryStaffNotes || '';

                    if ($scope.IntraOpQuickSummaryObj.AnesthesiaMedications.length > 0) {
                        angular.forEach($scope.IntraOpQuickSummaryObj.AnesthesiaMedications, function (item) {
                            angular.forEach(item.DropTimings, function (kitem) {
                                if (kitem.GivenBy != null) {
                                    let GivenByname = '';
                                    var Arraylist = $filter("filter")($scope.allUserList, function (pitem) { return pitem.DoctorID == kitem.GivenBy }, true) || [];
                                    if (Arraylist.length > 0) {
                                        GivenByname = Arraylist[0].FirstName + ' ' + Arraylist[0].LastName + ' ' + Arraylist[0].SuffixName
                                        kitem.GivenByname = GivenByname;
                                    }
                                }
                            });
                        });
                    }

                    $scope.IntraOpQuickSummaryObj.NurseActionobj.CauteraisationOthers = resp[1].data.rows[0].NurseActions.CauteraisationOthers || "";
                    //$scope.IntraOpQuickSummaryObj.Pathology = resp[1].data.rows[0].Pathology || "";

                    if ($scope.IntraOpQuickSummaryObj.IntraOpNotes == null && $scope.IntraOpQuickSummaryObj.VitalsType == "" && $scope.IntraOpQuickSummaryObj.PatientTransferType == "") {
                        $scope.IntraOpQuickSummaryObj.handOffNotesInd = false;
                    } else {
                        $scope.IntraOpQuickSummaryObj.handOffNotesInd = true;
                    }

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
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceStartTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                    }

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceEndTime != '') {
                        let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceEndTime;
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceEndTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                    }

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaStartTime != '') {

                        let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaStartTime;
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaStartTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                    }
                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaEndTime != '') {

                        let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaEndTime;
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaEndTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                    }
                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStartTime != '') {

                        let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStartTime;
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStartTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                    }
                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryEndTime != '') {

                        let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryEndTime;
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryEndTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                    }


                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstTime != '') {

                        let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstTime;
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFirstTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                    }
                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondTime != '') {

                        let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondTime;
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalSecondTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                    }
                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalTime != '') {

                        let edate = ndate + " " + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalTime;
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgicalFinalTime = moment(edate, "YYYY-MM-DD HH:mm:ss").format("hh:mm A");
                    }
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.DrainageOthers = resp[1].data.rows[0].NurseActions.DrainageOthers || "";

                    if (resp[1].data.rows[0].Cauteraisation.length > 0) {
                        $scope.IntraOpQuickSummaryObj.NurseActionobj.Cauteraisation = resp[1].data.rows[0].Cauteraisation;
                    }
                    $scope.IntraOpQuickSummaryObj.NurseActionobj.Cauteraisation = $filter("filter")($scope.IntraOpQuickSummaryObj.NurseActionobj.Cauteraisation, { "IsChecked": true }, true) || [];

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.Cauteraisation.length > 0 || $scope.IntraOpQuickSummaryObj.NurseActionobj.CauteraisationOthers != '') {
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

                    //$scope.IntraOpQuickSummaryObj.IntraOpMedications = resp[1].data.rows[0].IntraOpMedications || [];

                    if (resp[1].data.rows[0].OrderDetails.length > 0) {
                        $scope.IntraOpQuickSummaryObj.OrderDetails = resp[1].data.rows[0].OrderDetails || [];
                        $scope.SetSurgeonCredentials($scope.IntraOpQuickSummaryObj.OrderDetails);
                        angular.forEach($scope.IntraOpQuickSummaryObj.OrderDetails, function (Mitem) {
                            Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                            Mitem.UserOrderId = Mitem.UserOrderId || null;
                            Mitem.UserType = Mitem.UserType || null;
                            Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                            Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                            Mitem.LicenseNumber = Mitem.LicenseNumber || '';
                            Mitem.ModifiedDt = Mitem.ModifiedDt || '';

                            if (Mitem.IntraOpMedications.length > 0) {
                                if (Mitem.IntraOpMedications.length > 0) {
                                    angular.forEach(Mitem.IntraOpMedications, function (item) {
                                        if (Mitem.MedTypeId == 4) {
                                            var dateTimeString = Mitem.ModifiedDt;
                                            $scope.ModifiedIntraopDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                        } else {
                                            var dateTimeString = Mitem.ModifiedDt;
                                            $scope.ModifiedAnesthesiaDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                        }
                                    });
                                }

                                $scope.IntraOpQuickSummaryObj.IntraOpMedications = resp[1].data.rows[0].IntraOpMedications || [];
                                if ($scope.IntraOpQuickSummaryObj.IntraOpMedications.length > 0) {
                                    angular.forEach($scope.IntraOpQuickSummaryObj.IntraOpMedications, function (item) {
                                        angular.forEach(item.DropTimings, function (kitem) {
                                            if (kitem.GivenBy != null) {
                                                let GivenByname = '';
                                                var Arraylist = $filter("filter")($scope.allUserList, function (pitem) { return pitem.DoctorID == kitem.GivenBy }, true) || [];
                                                if (Arraylist.length > 0) {
                                                    GivenByname = Arraylist[0].FirstName + ' ' + Arraylist[0].LastName + ' ' + Arraylist[0].SuffixName
                                                    kitem.GivenByname = GivenByname;
                                                }
                                            }
                                        });
                                    });
                                }
                            }
                        });

                    }
                    angular.forEach($scope.allUserList, function (item) {

                        if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonId == item.DoctorID) {
                            $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName = item.FullName;

                            var License = '';
                            //var Suffix = '';
                            //if (item.SuffixName !== '') {
                            //    Suffix = item.SuffixName + ',';
                            //}
                            if (item.LicenseNumber !== '') {
                                License = 'Lic: ' + item.LicenseNumber;
                            }

                            $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName = $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName + ' ' + License;
                            //if (item.SuffixId == 10) {
                            //    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName = ' Dr. ' + $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName + ' ' + Suffix + ' ' + License;
                            //} else {
                            //    $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName = $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonName + ' ' + Suffix + ' ' + License;
                            //}
                        }
                        if ($scope.IntraOpQuickSummaryObj.NurseActionobj.TechnicianId == item.DoctorID) {
                            $scope.IntraOpQuickSummaryObj.NurseActionobj.TechnicianName = item.FullName;
                        }
                        if ($scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistId == item.DoctorID) {
                            $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName = item.FullName;

                            var License = '';
                            //var Suffix = '';
                            //if (item.SuffixName !== '') {
                            //    Suffix = item.SuffixName + ',';
                            //}
                            if (item.LicenseNumber !== '') {
                                License = 'Lic: ' + item.LicenseNumber;
                            }

                            $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName = $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName + ' ' + License;
                            //if (item.SuffixId == 10) {
                            //    $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName = ' Dr. ' + $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName + ' ' + Suffix + ' ' + License;
                            //} else {
                            //    $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName = $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistName + ' ' + Suffix + ' ' + License;
                            //}
                        }
                        if ($scope.IntraOpQuickSummaryObj.NurseActionobj.NurseId == item.DoctorID) {
                            $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseName = item.FullName;
                        }

                        if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStaffAnesthesistId == item.DoctorID) {
                            $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStaffAnesthesistName = item.UserFullName;
                            var License = '';

                            if (item.LicenseNumber !== '') {
                                License = 'Lic: ' + item.LicenseNumber;
                            }
                            $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStaffAnesthesistName = $scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStaffAnesthesistName + ' ' + License;

                        }

                        if ($scope.IntraOpQuickSummaryObj.NurseActionobj.AdditionalStaffId == item.DoctorID) {
                            $scope.IntraOpQuickSummaryObj.NurseActionobj.AdditionalStaffName = item.FullName;
                        }
                        if ($scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonId == item.DoctorID) {
                            $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName = item.FullName;
                            var License = '';
                            //var Suffix = '';
                            //if (item.SuffixName !== '') {
                            //    Suffix = item.SuffixName + ',';
                            //}
                            if (item.LicenseNumber !== '') {
                                License = 'Lic: ' + item.LicenseNumber;
                            }

                            $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName = $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName + ' ' + License;
                            //if (item.SuffixId == 10) {
                            //    $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName = ' Dr. ' + $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName + ' ' + Suffix + ' ' + License;
                            //} else {
                            //    $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName = $scope.IntraOpQuickSummaryObj.NurseActionobj.CoSurgeonName + ' ' + Suffix + ' ' + License;
                            //}
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

                    //if ($scope.IntraOpQuickSummaryObj.AnesthesiaMedications.length > 0) {
                    //    angular.forEach($scope.IntraOpQuickSummaryObj.AnesthesiaMedications, function (hitem) {
                    //        var dateTimeString = hitem.ModifiedDt;
                    //        $scope.ModifiedAnesthesiaDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                    //    });
                    //}
                    //if ($scope.IntraOpQuickSummaryObj.IntraOpMedications.length > 0) {
                    //    angular.forEach($scope.IntraOpQuickSummaryObj.IntraOpMedications, function (hitem) {
                    //        var dateTimeString = hitem.ModifiedDt;
                    //        $scope.ModifiedIntraopDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                    //    });
                    //}

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
                                if (kitem.Id === 9 && kitem.Id === item.VitalId) {
                                    let obj = {
                                        "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                        "VitalName": "Temparature",
                                        "MainId": 9,
                                        "Value": item.Value,
                                        "VitalSlotTime": item.VitalSlotTime,
                                    };
                                    kitem.VitalReadingList.push(obj);
                                }
                                if (kitem.Id === 10 && kitem.Id === item.VitalId) {
                                    let obj = {
                                        "IntraOPAnesthesiaVitalsId": item.IntraOPAnesthesiaVitalsId || null,
                                        "VitalName": "Notes",
                                        "MainId": 10,
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


                    var TempVitals1 = $filter('filter')(resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray, { 'VitalId': 1 }, true);
                    if (TempVitals1.length > 0) {
                        if (TempVitals1[0].Value != "") {
                            $scope.AnesthVitals.isSystolic = true;
                        }


                    }
                    var TempVitals2 = $filter('filter')(resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray, { 'VitalId': 2 }, true);
                    if (TempVitals2.length > 0) {

                        if (TempVitals2[0].Value != "") {
                            $scope.AnesthVitals.isDiastolic = true;
                        }

                    }
                    var TempVitals3 = $filter('filter')(resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray, { 'VitalId': 3 }, true);
                    if (TempVitals3.length > 0) {

                        if (TempVitals3[0].Value != "") {
                            $scope.AnesthVitals.isPulse = true;
                        }
                    }
                    var TempVitals4 = $filter('filter')(resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray, { 'VitalId': 4 }, true);
                    if (TempVitals4.length > 0) {


                        if (TempVitals4[0].Value != "") {
                            $scope.AnesthVitals.isRespRate = true;
                        }
                    }

                    var TempVitals5 = $filter('filter')(resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray, { 'VitalId': 6 }, true);
                    if (TempVitals5.length > 0) {


                        if (TempVitals5[0].Value != "") {
                            $scope.AnesthVitals.isO2Saturation = true;
                        }
                    }

                    var TempVitals6 = $filter('filter')(resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray, { 'VitalId': 7 }, true);
                    if (TempVitals6.length > 0) {

                        if (TempVitals6[0].Value != "") {
                            $scope.AnesthVitals.isEKGLead = true;
                        }
                    }

                    var TempVitals7 = $filter('filter')(resp[1].data.rows[0].AnesthetistActions.AnesthesiaVitalsArray, { 'VitalId': 8 }, true);
                    if (TempVitals7.length > 0) {

                        if (TempVitals7[0].Value != "") {
                            $scope.AnesthVitals.isETCO2 = true;
                        }
                    }

                    if ($scope.AnesthVitals.isSystolic == false && $scope.AnesthVitals.isETCO2 == false && $scope.AnesthVitals.isEKGLead == false && $scope.AnesthVitals.isO2Saturation == false && $scope.AnesthVitals.isDiastolic == false && $scope.AnesthVitals.isPulse == false && $scope.AnesthVitals.isRespRate == false) {
                        $scope.AnesthVitals.isAllVitals = false;
                    } else {
                        $scope.AnesthVitals.isAllVitals = true;
                    }

                    $scope.NewTimeSlots = $scope.NewTimeSlots || [];

                    if ($scope.IntraOpQuickSummaryObj.EBLValue == "" && $scope.IntraOpQuickSummaryObj.IntakeValue == "" && $scope.IntraOpQuickSummaryObj.OutputValue == "" && $scope.IntraOpQuickSummaryObj.OxygenQuantity == "" && $scope.IntraOpQuickSummaryObj.OxygenType == "" && $scope.IntraOpQuickSummaryObj.EndotrachealTubeNotes == "" && $scope.IntraOpQuickSummaryObj.LMANotes == "" &&
                        $scope.NewTimeSlots.length == 0 && $scope.AnesthVitals.isAllVitals == false) {
                        $scope.AnesthVitals.OverallNurseAction = false;
                    } else {
                        $scope.AnesthVitals.OverallNurseAction = true;
                    }


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
                    }
                    else {
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
                        //var SuffixName = '';
                        //techlist1[0].SuffixName = techlist1[0].SuffixName || '';
                        //if (techlist1[0].SuffixName != "") {
                        //    SuffixName = techlist1[0].SuffixName + ',';
                        //}

                        var LicenseNumber = "";

                        techlist1[0].LicenseNumber = techlist1[0].LicenseNumber || "";
                        if (techlist1[0].LicenseNumber != "") {
                            LicenseNumber = 'Lic:' + ' ' + techlist1[0].LicenseNumber + ',';
                        }
                        $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewName = angular.copy(techlist1[0].FullName + ' ' + LicenseNumber);

                        //if (techlist1[0].SuffixId == 10) {
                        //    $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewName = angular.copy('Dr. ' + techlist1[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        //} else {
                        //    $scope.IntraOpQuickSummaryObj.AnesthesiaMedicationsReviewName = angular.copy(techlist1[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        //}

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
                            $scope.IntraOpQuickSummaryObj.MedicationsReviewName = angular.copy(techlist2[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        } else {
                            $scope.IntraOpQuickSummaryObj.MedicationsReviewName = angular.copy(techlist2[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        }
                    }
                    else {
                        $scope.IntraOpQuickSummaryObj.MedicationsReviewName = "";
                    }

                    $scope.IntraOpQuickSummaryObj.ReviewAnesthesiologistId = resp[1].data.rows[0].ReviewAnesthesiologistId || null;

                    $scope.IntraOpQuickSummaryObj.BeforeAnesthesiaTime = resp[1].data.rows[0].BeforeAnesthesiaTime || "";


                    if ($scope.IntraOpQuickSummaryObj.ReviewAnesthesiologistId != null) {
                        var anesthesiologist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.IntraOpQuickSummaryObj.ReviewAnesthesiologistId });
                    }
                    anesthesiologist = anesthesiologist || [];

                    if (anesthesiologist.length > 0) {
                        $scope.IntraOpQuickSummaryObj.AnesthesiologistName = angular.copy(anesthesiologist[0].FullName);
                        //$scope.IntraOpQuickSummaryObj.AnesthesiologistSuffix = angular.copy(anesthesiologist[0].SuffixName);
                        $scope.IntraOpQuickSummaryObj.AnesthesiologistLicense = angular.copy(anesthesiologist[0].LicenseNumber);
                        //if (anesthesiologist[0].SuffixId == 10) {
                        //    $scope.IntraOpQuickSummaryObj.AnesthesiologistName = ' Dr. ' + $scope.IntraOpQuickSummaryObj.AnesthesiologistName;
                        //}
                        //else {
                        //    $scope.IntraOpQuickSummaryObj.AnesthesiologistName = $scope.IntraOpQuickSummaryObj.AnesthesiologistName || "";
                        //}
                    }
                    else {
                        $scope.IntraOpQuickSummaryObj.AnesthesiologistName = '';
                        //$scope.IntraOpQuickSummaryObj.AnesthesiologistSuffix = '';
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

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.Sterilewater == '' && $scope.IntraOpQuickSummaryObj.NurseActionobj.Alcohol == '' && $scope.IntraOpQuickSummaryObj.NurseActionobj.Levelofconsciousness == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.PatientPosition == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.AnotherRailing == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.ArmsToTheBody == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.Others == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SafetyDevicePosition.Strap == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.SkinPreparation == "" && $scope.IntraOpQuickSummaryObj.PatientStableSurgery == false && $scope.IntraOpQuickSummaryObj.AdequatePreoperativeWorkup == false) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraPreOpCallInd = false;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseIntraPreOpCallInd = true;
                    }

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.AreaNotes == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.EspecimenLab == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseActionOrganId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.CropHour == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseActionArea == "" && $scope.IntraOpQuickSummaryObj.NurseActionobj.EspecimenLabNotes == "") {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpEspecimenLab = false;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpEspecimenLab = true;
                    }

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeonId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.TechnicianId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesistId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.NurseId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.ReliefId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.SupportingStaffId == null && $scope.IntraOpQuickSummaryObj.NurseActionobj.AdditionalStaffId == null && !$scope.IntraOpQuickSummaryObj.IntraOpSurgeryStaffNotes) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgeryStaffInd = false;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgeryStaffInd = true;
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




                    if (!$scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceStartTime && !$scope.IntraOpQuickSummaryObj.NurseActionobj.HallEntranceEndTime && !$scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryStartTime && !$scope.IntraOpQuickSummaryObj.NurseActionobj.SurgeryEndTime && !$scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaStartTime && !$scope.IntraOpQuickSummaryObj.NurseActionobj.AnesthesiaEndTime && !$scope.IntraOpQuickSummaryObj.BeforeAnesthesiaTime) {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgeryTimesInd = false;
                    } else {
                        $scope.IntraOpQuickSummaryObj.IsIntraOpNurseSurgeryTimesInd = true;
                    }

                    if ($scope.IntraOpQuickSummaryObj.NurseActionobj.Cleansed || $scope.IntraOpQuickSummaryObj.NurseActionobj.CleanContaminated || $scope.IntraOpQuickSummaryObj.NurseActionobj.Contaminated || $scope.IntraOpQuickSummaryObj.NurseActionobj.Dirty) {
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
                    $scope.IntraOpQuickSummaryObj.EndotrachealTubeNotes = resp[1].data.rows[0].EndotrachealTubeNotes || "";
                    $scope.IntraOpQuickSummaryObj.LMANotes = resp[1].data.rows[0].LMANotes || "";
                    $scope.IntraOpQuickSummaryObj.IntraOpAnesthesiaNotes = resp[1].data.rows[0].IntraOpAnesthesiaNotes || null;

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


                if ($scope.IntraOpQuickSummaryObj.OrderDetails.length > 0) {
                    var MedCount = 0;
                    var GenCount = 0;

                    angular.forEach($scope.IntraOpQuickSummaryObj.OrderDetails, function (item) {
                        if (item.IntraOpMedications.length > 0) {
                            MedCount++;
                        };
                        if (item.GeneralOrders.length > 0) {
                            GenCount++;
                        };
                    });

                    if (MedCount !== 0) {
                        $scope.IsIntraopMedications = true;
                    } else {
                        $scope.IsIntraopMedications = false;
                    };

                    if (GenCount !== 0) {
                        $scope.IsIntraopGenOrders = true;
                    } else {
                        $scope.IsIntraopGenOrders = false;
                    };
                } else {
                    $scope.PostOpQuickSummaryObj.OrderDetails = [];

                    $scope.IsIntraopMedications = false;
                    $scope.IsIntraopGenOrders = false;
                }

            }
            else {
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
        if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
            appointmentId = $scope.SelectedAppointmentId;
        }

        if ($scope.SelectedAppointmentTypeId == 7 || $scope.SelectedAppointmentTypeId == 6) {
            appointmentId = $scope.cacheStorageItem.AscAppointmentId;
        }

        let req = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "CheckListModuleId": 3
        };

        //let reqObj = {
        //    "ParentOrganizationId": $scope.ParenthospitalId
        //};

        let params = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": appointmentId || null,
            "PatientId": $scope.SelectedPatientID || null
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

                if (resp[0].data.AnaesthesiaTypes.length > 0) {
                    $scope.PostOpQuickSummaryObj.AnesthesiaTypelist = resp[0].data.AnaesthesiaTypes || [];
                }
            }

            if (resp[1].data.status === "Success") {
                angular.forEach(resp[1].data.rows, function (item) {
                    item.AscMedicationId = 0;
                    item.IsChecked = false;
                    item.DropTimings = [{ "MedicationTime": "" }, { "MedicationTime": "" }];
                });

                let temppostopMedications = $filter('filter')(resp[1].data.rows, { 'IsPostOpMed': true }, true);
                //$scope.PostOpQuickSummaryObj.PostOpMedications = angular.copy(temppostopMedications);
                $scope.MasterPostOpMedications = angular.copy(temppostopMedications);
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
                $scope.PostOpQuickSummaryObj.IntraOpHandOffReviewedByname = resp[2].data.IntraOpHandOffReviewedByname || '';
                $scope.PostOpQuickSummaryObj.OxygenType = resp[2].data.OxygenType || '';
                $scope.PostOpQuickSummaryObj.OxygenQuantity = resp[2].data.OxygenQuantity || '';

                $scope.PostOpQuickSummaryObj.IntraOpAnesthesiaStartTime = resp[2].data.IntraOpAnesthesiaStartTime || '';
                $scope.PostOpQuickSummaryObj.IntraOpAnesthesiaEndTime = resp[2].data.IntraOpAnesthesiaEndTime || '';

                $scope.PostOpQuickSummaryObj.DischargeSignOffStartTime = resp[2].data.DischargeSignOffStartTime || '';
                $scope.PostOpQuickSummaryObj.DischargeSignOffEndTime = resp[2].data.DischargeSignOffEndTime || '';
                $scope.PostOpQuickSummaryObj.DischargeStartTimeUser = resp[2].data.DischargeStartTimeUser || null;
                $scope.PostOpQuickSummaryObj.DischargeEndTimeUser = resp[2].data.DischargeEndTimeUser || null;
                $scope.PostOpQuickSummaryObj.DischargeStopTimerRemarks = resp[2].data.DischargeStopTimerRemarks || null;

                resp[2].data.IntrOpHandOffTime = resp[2].data.IntrOpHandOffTime || '';
                if (resp[2].data.IntrOpHandOffTime != "" && resp[2].data.IntrOpHandOffTime != "00:00:00") {
                    let dummydatetime = "2024-01-01" + " " + resp[2].data.IntrOpHandOffTime;
                    let time = moment(dummydatetime, "YYYY-MM-DD HH:mm").format("hh:mm A");
                    $scope.PostOpQuickSummaryObj.IntrOpHandOffTime = angular.copy(time);
                } 

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
                resp[2].data.IntraOPAnesthesiaTypelist = resp[2].data.IntraOPAnesthesiaTypelist || [];
                if (resp[2].data.IntraOPAnesthesiaTypelist.length > 0) {
                    $scope.PostOpQuickSummaryObj.AnesthesiaTypelist = angular.copy(resp[2].data.IntraOPAnesthesiaTypelist);
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
                $scope.PatientGoalsArray = [];
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

                    //resp[2].data.rows[0].AnesthesiaTypelist = resp[2].data.rows[0].AnesthesiaTypelist || [];
                    //if (resp[2].data.rows[0].AnesthesiaTypelist.length > 0) {
                    //    $scope.PostOpQuickSummaryObj.AnesthesiaTypelist = angular.copy(resp[2].data.rows[0].AnesthesiaTypelist);
                    //}

                    $scope.PostOpQuickSummaryObj.Intake = resp[2].data.rows[0].Intake || "";
                    $scope.PostOpQuickSummaryObj.Output = resp[2].data.rows[0].Output || "";
                    $scope.PostOpQuickSummaryObj.EBL = resp[2].data.rows[0].EBL || "";
                    $scope.PostOpQuickSummaryObj.InTime = resp[2].data.rows[0].InTime || "";
                    $scope.PostOpQuickSummaryObj.OutTime = resp[2].data.rows[0].OutTime || "";
                    $scope.PostOpQuickSummaryObj.PostOpAnesthesiaChartStatus = resp[2].data.rows[0].PostOpAnesthesiaChartStatus || '';
                    $scope.PostOpQuickSummaryObj.PostOpNurseChartStatus = resp[2].data.rows[0].PostOpNurseChartStatus || '';

                    $scope.PostOpQuickSummaryObj.R2PostOpNurseChartStatus = resp[2].data.rows[0].R2PostOpNurseChartStatus || "";
                    $scope.PostOpQuickSummaryObj.R2PostOpAnesthesiaChartStatus = resp[2].data.rows[0].R2PostOpAnesthesiaChartStatus || "";

                    let ndate = moment().format("YYYY-MM-DD");
                    if ($scope.PostOpQuickSummaryObj.InTime != "") {
                        let edate = ndate + " " + $scope.PostOpQuickSummaryObj.InTime;
                        $scope.PostOpQuickSummaryObj.InTime = moment(edate).format("hh:mm A");
                    }

                    if ($scope.PostOpQuickSummaryObj.OutTime != "") {
                        let edate = ndate + " " + $scope.PostOpQuickSummaryObj.OutTime;
                        $scope.PostOpQuickSummaryObj.OutTime = moment(edate).format("hh:mm A");
                    }

                    $scope.PostOpQuickSummaryObj.ProgressNotesPainScore = resp[2].data.rows[0].ProgressNotesPainScore;

                    $scope.PostOpQuickSummaryObj.IsPostOpSurgeonOrdersTimeAdded = resp[2].data.rows[0].IsPostOpSurgeonOrdersTimeAdded || false;
                    $scope.PostOpQuickSummaryObj.IsPostOpAnesthesiaOrdersTimeAdded = resp[2].data.rows[0].IsPostOpAnesthesiaOrdersTimeAdded || false;

                    $scope.PostOpQuickSummaryObj.DiscontinueIVTime = resp[2].data.rows[0].DiscontinueIVTime || '';
                    $scope.PostOpQuickSummaryObj.PatientDischargeTime = resp[2].data.rows[0].PatientDischargeTime || '';

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

                    if (resp[2].data.rows[0].OrgAscChecklist.length > 0) {
                        angular.forEach(resp[2].data.rows[0].OrgAscChecklist, function (item) {
                            angular.forEach($scope.PostOpQuickSummaryObj.OrgASCChecklist, function (hitem) {
                                if (hitem.CheckListId == 139 && !$scope.ParentObj.IsIOJParentOrganization && $scope.PostOpQuickSummaryObj.ProgressNotesPainScore !== null) {
                                    hitem.IsChecked = true;
                                }
                                if (hitem.CheckListCategoryId === item.CheckListCategoryId && item.CheckListId === hitem.CheckListId) {
                                    hitem.Remarks = item.Remarks || '';
                                    if (item.CheckListId == 132 || item.CheckListId == 136 ) {
                                        if (item.AscMultiCheckValueArray.length > 0) {
                                            angular.forEach(item.AscMultiCheckValueArray, function (jitem) {
                                                angular.forEach(hitem.OrganizationCheckListDetails, function (Oitem) {
                                                    if (Oitem.OrganizationPreOpCheckListValueId == jitem.OrganizationPreOpCheckListValueId) {
                                                        Oitem.IsChecked = true;
                                                        hitem.IsChecked = true;

                                                        Oitem.PatientMultiCheckListId = jitem.PatientMultiCheckListId || null;
                                                    }
                                                });
                                            });
                                        } else {
                                            hitem.IsChecked = false;
                                        }

                                    } else {
                                        angular.forEach(hitem.OrganizationCheckListDetails, function (kitem) {
                                            if (kitem.Value == item.Value && kitem.CheckListId === item.CheckListId) {
                                                kitem.IsChecked = true;
                                                hitem.IsChecked = true;
                                                hitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || 0;
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

                    let tempInterventionsCheckList = $filter('filter')($scope.PostOpQuickSummaryObj.OrgASCChecklist, { 'CheckListCategoryId': 16 }, true);
                    if (tempInterventionsCheckList.length > 0) {
                        $scope.PostOpQuickSummaryObj.NursingCarePlanData = angular.copy(tempInterventionsCheckList);
                    };

                    $scope.PostOpQuickSummaryObj.CheckinCheckList = [];

                    let tempCheckinCheckList = $filter('filter')($scope.PostOpQuickSummaryObj.OrgASCChecklist, { 'CheckListModuleId': 3, 'CheckListSubTypeId': 1 }, true);
                    let filteredCheckinCheckList = angular.copy(tempCheckinCheckList);
                    if (filteredCheckinCheckList.length > 0) {
                        filteredCheckinCheckList.sort(function (a, b) {
                            return a.OrgOrderBy - b.OrgOrderBy;
                        });
                        let chunkSize = Math.ceil((filteredCheckinCheckList.length) / 2);
                        for (let i = 0; i < filteredCheckinCheckList.length; i += chunkSize) {
                            $scope.PostOpQuickSummaryObj.CheckinCheckList.push(filteredCheckinCheckList.slice(i, i + chunkSize));
                        }
                    }
                    resp[2].data.rows[0].NurseCheckLists = resp[2].data.rows[0].NurseCheckLists || [];
                    if (resp[2].data.rows[0].NurseCheckLists.length > 0) {
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Notes = resp[2].data.rows[0].NurseCheckLists[0].Notes || "";
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevelRemarks = resp[2].data.rows[0].NurseCheckLists[0].PainLevelRemarks || "";
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceivedTime = resp[2].data.rows[0].NurseCheckLists[0].PatientReceivedTime || "";
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Saturation = resp[2].data.rows[0].NurseCheckLists[0].Saturation || "";
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceivedby = resp[2].data.rows[0].NurseCheckLists[0].PatientReceivedby || "";

                    }
                    
                    if ($scope.PostOpQuickSummaryObj.CheckinCheckList.length > 0 || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Notes || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevelRemarks || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevel && $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceivedTime && $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Saturation && $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceivedby) {
                        var CheckinCheckListcaunt = 0;
                        $scope.PostOpQuickSummaryObj.IsCheckinCheckListEmpty = false;
                        angular.forEach($scope.PostOpQuickSummaryObj.CheckinCheckList, function (item) {
                            angular.forEach(item, function (Aitem) {
                                if (Aitem.IsChecked) {
                                    CheckinCheckListcaunt++;
                                }
                            });
                        });
                        if (CheckinCheckListcaunt == 0 && !$scope.PostOpQuickSummaryObj.NurseChart.Checklists.Notes && !$scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevelRemarks && !$scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevel && !$scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceivedTime && !$scope.PostOpQuickSummaryObj.NurseChart.Checklists.Saturation && !$scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceivedby) {
                            $scope.PostOpQuickSummaryObj.IsCheckinCheckListEmpty = true;
                        }
                    } else {
                        $scope.PostOpQuickSummaryObj.IsCheckinCheckListEmpty = true;
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
                    $scope.PostOpQuickSummaryObj.NurseReviewedDate = $filter('date')(resp[2].data.rows[0].NurseReviewedDate, 'MM-dd-yyyy hh:mm a') || null;
                    $scope.PostOpQuickSummaryObj.AnesthetistReviewedDate = $filter('date')(resp[2].data.rows[0].AnesthetistReviewedDate, 'MM-dd-yyyy hh:mm a') || null;
                    $scope.PostOpQuickSummaryObj.NurseReviewedTime = resp[2].data.rows[0].NurseReviewedtime;                   
                    $scope.PostOpQuickSummaryObj.PostOpNotes = resp[2].data.rows[0].PostOpNotes;
                    $scope.PostOpQuickSummaryObj.Recovery2PostOpNotes = resp[2].data.rows[0].Recovery2PostOpNotes || null;

                    $scope.PostOpQuickSummaryObj.Recovery2AnesthesiaReviewedDate = $filter('date')(resp[2].data.rows[0].Recovery2AnesthesiaReviewedDate, 'MM-dd-yyyy hh:mm a') || null;
                    $scope.PostOpQuickSummaryObj.Recovery2NurseReviewedDate = $filter('date')(resp[2].data.rows[0].Recovery2NurseReviewedDate, 'MM-dd-yyyy hh:mm a') || null;

                    $scope.PostOpQuickSummaryObj.Recovery2Intime = resp[2].data.rows[0].Recovery2Intime;
                    $scope.PostOpQuickSummaryObj.Recovery2Outtime = resp[2].data.rows[0].Recovery2Outtime;
                    $scope.PostOpQuickSummaryObj.Recovery1Intime = resp[2].data.rows[0].Recovery1Intime;
                    $scope.PostOpQuickSummaryObj.Recovery1Outtime = resp[2].data.rows[0].Recovery1Outtime;
                    
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
                        //$scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevelRemarks = resp[2].data.rows[0].NurseCheckLists[0].PainLevelRemarks;
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
                       // $scope.PostOpQuickSummaryObj.NurseChart.Checklists.Notes = resp[2].data.rows[0].NurseCheckLists[0].Notes ||'';
                        $scope.PostOpQuickSummaryObj.NurseChart.Checklists.ProgressBloodSugarNotes = resp[2].data.rows[0].NurseCheckLists[0].ProgressBloodSugarNotes || "";
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.PostOpInstructionNotes = resp[2].data.rows[0].NurseCheckLists[0].PostOpInstructionNotes || '';
                        if ($scope.PostOpQuickSummaryObj.NurseChart.Checklists.ProgressBloodSugarNotes != '' || $scope.PostOpQuickSummaryObj.NurseChart.Actions.PostOpInstructionNotes != '') {
                            if ($scope.PostOpQuickSummaryObj.OrgASCChecklist.length > 0) {
                                angular.forEach($scope.PostOpQuickSummaryObj.OrgASCChecklist, function (item) {
                                    if (item.CheckListId==134 && $scope.PostOpQuickSummaryObj.NurseChart.Checklists.ProgressBloodSugarNotes != '') {
                                        item.IsChecked = true;
                                        item.Value = $scope.PostOpQuickSummaryObj.NurseChart.Checklists.ProgressBloodSugarNotes || '';
                                    }
                                    if (item.CheckListId == 135 && $scope.PostOpQuickSummaryObj.NurseChart.Actions.PostOpInstructionNotes != '') {
                                        item.IsChecked = true;
                                        item.Value = $scope.PostOpQuickSummaryObj.NurseChart.Actions.PostOpInstructionNotes || '';
                                    }
                                });
                            }
                        }
                        
                        //$scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevel = resp[2].data.rows[0].NurseCheckLists[0].PainLevel || "";
                        //$scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevelRemarks = resp[2].data.rows[0].NurseCheckLists[0].PainLevelRemarks || "";
                    }
                    if ($scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceived != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.AccompaniedBy != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevel != null || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevelRemarks != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.NourishmentProvider != '' || $scope.PostOpQuickSummaryObj.NurseChart.Checklists.BloodSugar != ''
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
                        $scope.PostOpQuickSummaryObj.NurseChart.Actions.Notes = resp[2].data.rows[0].NurseActions[0].Notes ||'';
                        
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

                    $scope.PostOpQuickSummaryObj.SurgeonObj.PostOpInstruction = resp[2].data.rows[0].PostOpInstruction || "";
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

                    var TempVitals1 = $filter('filter')(resp[2].data.rows[0].AnesthetistVitals, { 'VitalId': 1 }, true);
                    if (TempVitals1.length > 0) {
                        if (TempVitals1[0].Value != "") {
                            $scope.PostAnesthVitals.isSystolic = true;
                        }


                    }
                    var TempVitals2 = $filter('filter')(resp[2].data.rows[0].AnesthetistVitals, { 'VitalId': 2 }, true);
                    if (TempVitals2.length > 0) {

                        if (TempVitals2[0].Value != "") {
                            $scope.PostAnesthVitals.isDiastolic = true;
                        }

                    }
                    var TempVitals3 = $filter('filter')(resp[2].data.rows[0].AnesthetistVitals, { 'VitalId': 3 }, true);
                    if (TempVitals3.length > 0) {

                        if (TempVitals3[0].Value != "") {
                            $scope.PostAnesthVitals.isPulse = true;
                        }
                    }
                    var TempVitals4 = $filter('filter')(resp[2].data.rows[0].AnesthetistVitals, { 'VitalId': 4 }, true);
                    if (TempVitals4.length > 0) {


                        if (TempVitals4[0].Value != "") {
                            $scope.PostAnesthVitals.isRespRate = true;
                        }
                    }

                    var TempVitals5 = $filter('filter')(resp[2].data.rows[0].AnesthetistVitals, { 'VitalId': 6 }, true);
                    if (TempVitals5.length > 0) {


                        if (TempVitals5[0].Value != "") {
                            $scope.PostAnesthVitals.isO2Saturation = true;
                        }
                    }

                    var TempVitals6 = $filter('filter')(resp[2].data.rows[0].AnesthetistVitals, { 'VitalId': 7 }, true);
                    if (TempVitals6.length > 0) {

                        if (TempVitals6[0].Value != "") {
                            $scope.PostAnesthVitals.isEKGLead = true;
                        }
                    }

                    var TempVitals7 = $filter('filter')(resp[2].data.rows[0].AnesthetistVitals, { 'VitalId': 8 }, true);
                    if (TempVitals7.length > 0) {

                        if (TempVitals7[0].Value != "") {
                            $scope.PostAnesthVitals.isETCO2 = true;
                        }
                    }

                    if ($scope.PostAnesthVitals.isSystolic == false && $scope.PostAnesthVitals.isETCO2 == false && $scope.PostAnesthVitals.isEKGLead == false && $scope.PostAnesthVitals.isO2Saturation == false && $scope.PostAnesthVitals.isDiastolic == false && $scope.PostAnesthVitals.isPulse == false && $scope.PostAnesthVitals.isRespRate == false) {
                        $scope.PostAnesthVitals.isAllVitals = false;
                    } else {
                        $scope.PostAnesthVitals.isAllVitals = true;
                    }

                    $scope.NewTimeSlots = $scope.NewTimeSlots || [];
                    if ($scope.PostAnesthVitals.isAllVitals == false && $scope.NewTimeSlots.length == 0) {
                        $scope.PostAnesthVitals.OverallNurseAction = false;
                    } else {
                        $scope.PostAnesthVitals.OverallNurseAction = true;
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
                    $scope.PostOpQuickSummaryObj.R2ReviewNurseId = resp[2].data.rows[0].R2ReviewNurseId != null ? resp[2].data.rows[0].R2ReviewNurseId : "";
                    $scope.PostOpQuickSummaryObj.ReviewAnesthetistId = resp[2].data.rows[0].ReviewAnesthetistId != null ? resp[2].data.rows[0].ReviewAnesthetistId : "";
                    $scope.PostOpQuickSummaryObj.R2ReviewAnesthetistId = resp[2].data.rows[0].R2ReviewAnesthetistId != null ? resp[2].data.rows[0].R2ReviewAnesthetistId : "";
                    $scope.PostOpQuickSummaryObj.ReviewTechnicianId = resp[2].data.rows[0].ReviewTechnicianId != null ? resp[2].data.rows[0].ReviewTechnicianId : "";


                    if ($scope.PostOpQuickSummaryObj.ReviewDoctorId != 0 || $scope.PostOpQuickSummaryObj.ReviewDoctorId != null) {
                        var doctorlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.ReviewDoctorId });
                    }
                    doctorlist = doctorlist || [];
                    if (doctorlist.length > 0) {
                        $scope.PostOpQuickSummaryObj.DoctorName = angular.copy(doctorlist[0].UserFullName);
                        //$scope.PostOpQuickSummaryObj.DoctorSuffix = angular.copy(doctorlist[0].SuffixName);
                        $scope.PostOpQuickSummaryObj.DoctorLicense = angular.copy(doctorlist[0].LicenseNumber);
                        //if (doctorlist[0].SuffixId == 10) {
                        //    $scope.PostOpQuickSummaryObj.DoctorName = ' Dr. ' + $scope.PostOpQuickSummaryObj.DoctorName;
                        //}
                    } else {
                        $scope.PostOpQuickSummaryObj.DoctorName = "";
                       // $scope.PostOpQuickSummaryObj.DoctorSuffix = '';
                        $scope.PostOpQuickSummaryObj.DoctorLicense = '';
                    }

                    if ($scope.PostOpQuickSummaryObj.ReviewAnesthetistId != 0 || $scope.PostOpQuickSummaryObj.ReviewAnesthetistId != null) {
                        var anesthlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.ReviewAnesthetistId });
                    }
                    anesthlist = anesthlist || [];
                    if (anesthlist.length > 0) {
                        $scope.PostOpQuickSummaryObj.AnesthesiaName = angular.copy(anesthlist[0].UserFullName);
                        //$scope.PostOpQuickSummaryObj.AnesthesiaSuffix = angular.copy(anesthlist[0].SuffixName);
                        $scope.PostOpQuickSummaryObj.AnesthesiaLicense = angular.copy(anesthlist[0].LicenseNumber);
                        //if (anesthlist[0].SuffixId == 10) {
                        //    $scope.PostOpQuickSummaryObj.AnesthesiaName = ' Dr. ' + $scope.PostOpQuickSummaryObj.AnesthesiaName;
                        //}
                    } else {
                        $scope.PostOpQuickSummaryObj.AnesthesiaName = "";
                        //$scope.PostOpQuickSummaryObj.AnesthesiaSuffix = '';
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
                    let R2Nurslist=[]
                    if ($scope.PostOpQuickSummaryObj.R2ReviewNurseId != 0 || $scope.PostOpQuickSummaryObj.R2ReviewNurseId != null) {
                        R2Nurslist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.R2ReviewNurseId });
                    }
                    R2Nurslist = R2Nurslist || [];
                    if (R2Nurslist.length > 0) {
                        $scope.PostOpQuickSummaryObj.R2NurseName = angular.copy(R2Nurslist[0].FullName);
                        $scope.PostOpQuickSummaryObj.R2NurseSuffix = angular.copy(R2Nurslist[0].SuffixName);
                        $scope.PostOpQuickSummaryObj.R2NurseLicense = angular.copy(R2Nurslist[0].LicenseNumber);
                    } else {
                        $scope.PostOpQuickSummaryObj.R2NurseName = "";
                        $scope.PostOpQuickSummaryObj.R2NurseSuffix = '';
                        $scope.PostOpQuickSummaryObj.R2NurseLicense = '';
                    }
                    let R2anesthlist = [];
                    if ($scope.PostOpQuickSummaryObj.R2ReviewAnesthetistId != 0 || $scope.PostOpQuickSummaryObj.R2ReviewAnesthetistId != null) {
                        R2anesthlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.R2ReviewAnesthetistId });
                    }
                    R2anesthlist = R2anesthlist || [];
                    if (R2anesthlist.length > 0) {
                        $scope.PostOpQuickSummaryObj.R2AnesthesiaName = angular.copy(R2anesthlist[0].UserFullName);
                        //$scope.PostOpQuickSummaryObj.AnesthesiaSuffix = angular.copy(anesthlist[0].SuffixName);
                        $scope.PostOpQuickSummaryObj.R2AnesthesiaLicense = angular.copy(R2anesthlist[0].LicenseNumber);
                        //if (anesthlist[0].SuffixId == 10) {
                        //    $scope.PostOpQuickSummaryObj.AnesthesiaName = ' Dr. ' + $scope.PostOpQuickSummaryObj.AnesthesiaName;
                        //}
                    } else {
                        $scope.PostOpQuickSummaryObj.R2AnesthesiaName = "";
                        //$scope.PostOpQuickSummaryObj.AnesthesiaSuffix = '';
                        $scope.PostOpQuickSummaryObj.R2AnesthesiaLicense = '';
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


                    if (resp[2].data.rows[0].OrderDetails.length > 0) {
                        $scope.PostOpQuickSummaryObj.OrderDetails = resp[2].data.rows[0].OrderDetails || [];
                        $scope.SetSurgeonCredentials($scope.PostOpQuickSummaryObj.OrderDetails);
                        angular.forEach($scope.PostOpQuickSummaryObj.OrderDetails, function (Mitem) {
                            Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                            if (Mitem.ReviewedBy != null) {
                                var Arraylist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == Mitem.ReviewedBy }, true);
                                if (Arraylist.length > 0) {
                                        Mitem.ReviewedByName = Arraylist[0].FullName + ' ' + Arraylist[0].SuffixName;
                                }
                            }
                          
                            Mitem.UserOrderId = Mitem.UserOrderId || null;
                            Mitem.UserType = Mitem.UserType || null;
                            Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                            Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                            Mitem.LicenseNumber = Mitem.LicenseNumber || '';
                            Mitem.ModifiedDt = Mitem.ModifiedDt || '';

                            if (Mitem.PostOpMedications.length > 0) {
                                if (Mitem.PostOpMedications.length > 0) {
                                    angular.forEach(Mitem.PostOpMedications, function (item) {
                                        var dateTimeString = item.ModifiedDt;
                                        $scope.ModifiedPostopDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');
                                      
                                    });
                                }

                            }


                        });
                        if ($scope.PostOpQuickSummaryObj.OrderDetails.length > 0) {
                            var MedCount = 0;
                            var GenCount = 0;

                            angular.forEach($scope.PostOpQuickSummaryObj.OrderDetails, function (item) {
                                if (item.PostOpMedications.length > 0) {
                                    MedCount++;
                                };
                                if (item.GeneralOrders.length > 0) {
                                    GenCount++;
                                };
                            });

                            if (MedCount !== 0) {
                                $scope.IspostopMedications = true;
                            } else {
                                $scope.IspostopMedications = false;
                            };

                            if (GenCount !== 0) {
                                $scope.IsPostopGenOrders = true;
                            } else {
                                $scope.IsPostopGenOrders = false;
                            };
                        } else {
                            $scope.PostOpQuickSummaryObj.OrderDetails = [];

                            $scope.IspostopMedications = false;
                            $scope.IsPostopGenOrders = false;
                        }


                    }

                    //$scope.PostOpQuickSummaryObj.PostOpMedications = [];
                    //if (resp[2].data.rows[0].PostOpMedications.length > 0) {
                    //    $scope.PostOpQuickSummaryObj.PostOpMedications = resp[2].data.rows[0].PostOpMedications || [];
                    //    if ($scope.PostOpQuickSummaryObj.PostOpMedications.length > 0) {
                    //        angular.forEach($scope.PostOpQuickSummaryObj.PostOpMedications, function (item) {
                    //            angular.forEach(item.DropTimings, function (kitem) {
                    //                kitem.MedicationTime = kitem.MedicationTime || '';
                    //                if (kitem.MedicationTime != '') {
                    //                    let Ndate = moment().format("YYYY-MM-DD");
                    //                    let Newdate = Ndate + " " + kitem.MedicationTime;
                    //                    kitem.MedicationTime = moment(Newdate, "YYYY-MM-DD HH:mm").format("hh:mm A");
                    //                }  
                    //            });
                    //        });
                    //    }
                    //}



                    //if (resp[2].data.rows[0].PostOpMedications.length > 0) {
                    //    angular.forEach(resp[2].data.rows[0].PostOpMedications, function (item) {
                    //        angular.forEach($scope.PostOpQuickSummaryObj.PostOpMedications, function (hitem) {
                    //            if (item.MedicineId === hitem.MedicineId) {
                    //                hitem.DropTimings = angular.copy(item.DropTimings);
                    //                hitem.AscMedicationId = item.AscMedicationId;
                    //                hitem.IsChecked = true;

                    //                if (hitem.DropTimings.length > 0) {
                    //                    angular.forEach(hitem.DropTimings, function (Dropitem) {
                    //                        Dropitem.MedicationTime = Dropitem.MedicationTime || '';

                    //                        if (Dropitem.MedicationTime != '') {
                    //                            let Ndate = moment().format("YYYY-MM-DD");
                    //                            let Newdate = Ndate + " " + Dropitem.MedicationTime;
                    //                            Dropitem.MedicationTime = moment(Newdate, "YYYY-MM-DD HH:mm").format("hh:mm A");
                    //                        }
                    //                    });
                    //                }
                    //            }
                    //        });
                    //    });
                    //}

                    $scope.PostOpQuickSummaryObj.MedicationsReviewId = resp[2].data.rows[0].MedicationsReviewId != null ? resp[2].data.rows[0].MedicationsReviewId : null;
                    if ($scope.PostOpQuickSummaryObj.MedicationsReviewId != 0 || $scope.PostOpQuickSummaryObj.MedicationsReviewId != null) {
                        var reviewlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.MedicationsReviewId }) || [];
                    }
                    reviewlist = reviewlist || [];
                    if (reviewlist.length > 0) {

                        //var SuffixName = '';
                        //reviewlist[0].SuffixName = reviewlist[0].SuffixName || "";
                        //if (reviewlist[0].SuffixName != "" && reviewlist[0].SuffixName != null) {
                        //    SuffixName = reviewlist[0].SuffixName + ',';
                        //}

                        var LicenseNumber = "";
                        reviewlist[0].LicenseNumber = reviewlist[0].LicenseNumber || "";
                        if (reviewlist[0].LicenseNumber != "") {
                            LicenseNumber = 'Lic:' + ' ' + reviewlist[0].LicenseNumber + ',';
                        }
                        $scope.PostOpQuickSummaryObj.MedicationsReviewName = angular.copy(reviewlist[0].UserFullName + ' ' +  LicenseNumber);

                        //if (reviewlist[0].SuffixId == 10) {
                        //    $scope.PostOpQuickSummaryObj.MedicationsReviewName = angular.copy('Dr. ' + reviewlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        //} else {
                        //    $scope.PostOpQuickSummaryObj.MedicationsReviewName = angular.copy(reviewlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        //}

                    } else {
                        $scope.PostOpQuickSummaryObj.MedicationsReviewName = "";
                    }

                    $scope.ModifiedPostopDate = "";


                    //if (resp[2].data.rows[0].PostOpMedications.length > 0) {
                    //    angular.forEach(resp[2].data.rows[0].PostOpMedications, function (hitem) {
                    //        var dateTimeString = hitem.ModifiedDt;

                    //        $scope.ModifiedPostopDate = $filter('date')(dateTimeString, 'MM-dd-yyyy hh:mm a');

                    //    });
                    //}

                    $scope.PostOpQuickSummaryObj.MedicationsNotes = resp[2].data.rows[0].MedicationsNotes || "";

                    // Progress Note

                    $scope.PostOpQuickSummaryObj.ProgressPatientStable = resp[2].data.rows[0].ProgressPatientStable || "";
                    $scope.PostOpQuickSummaryObj.ProgressPatientwheelchairNotes = resp[2].data.rows[0].ProgressPatientwheelchairNotes || "";
                    $scope.PostOpQuickSummaryObj.ProgressPatienttransferred = resp[2].data.rows[0].ProgressPatienttransferred || "";
                    $scope.PostOpQuickSummaryObj.IsPostProceduresNotes = resp[2].data.IsPostProceduresNotes || false;
                    $scope.PostOpQuickSummaryObj.ProgressOverAllNotes = resp[2].data.rows[0].ProgressOverAllNotes || "";

                    resp[2].data.rows[0].RecoveryStartTime = resp[2].data.rows[0].RecoveryStartTime || '';
                    if (resp[2].data.rows[0].RecoveryStartTime != '') {
                        $scope.PostOpQuickSummaryObj.RecoveryStartTime = resp[2].data.rows[0].RecoveryStartTime || "";
                    }

                    resp[2].data.rows[0].RecoveryStopTime = resp[2].data.rows[0].RecoveryStopTime || "";
                    if (resp[2].data.rows[0].RecoveryStopTime != "") {
                        $scope.PostOpQuickSummaryObj.RecoveryStopTime = resp[2].data.rows[0].RecoveryStopTime || "";
                    }

                    var ProgressarrayList = $filter('filter')($scope.PostOpQuickSummaryObj.OrgASCChecklist, { 'CheckListSubTypeId': 18, 'IsChecked': true }, true) || [];

                    if ($scope.PostOpQuickSummaryObj.ProgressPatientStable != '' || $scope.PostOpQuickSummaryObj.ProgressPatienttransferred != '' || $scope.PostOpQuickSummaryObj.ProgressPatientwheelchairNotes != '' || $scope.PostOpQuickSummaryObj.IsPostProceduresNotes == true || ProgressarrayList.length > 0) {
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

                    $scope.PostOpQuickSummaryObj.PostOpAnesthesiaNotes = resp[2].data.rows[0].PostOpAnesthesiaNotes || null;
                    $scope.PostOpQuickSummaryObj.Recovery2PostOpAnesthesiaNotes = resp[2].data.rows[0].Recovery2PostOpAnesthesiaNotes || null;
                    $scope.PostOpQuickSummaryObj.IsPatientDischarge = resp[2].data.rows[0].IsPatientDischarge || false;


                    $scope.PostOpQuickSummaryObj.CheckInReviewDoctorName = "";
                    $scope.PostOpQuickSummaryObj.CheckInReviewNurseName = "";
                    $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistName = "";


                    if ($scope.PostOpQuickSummaryObj.CheckInReviewDoctorId != null) {
                        var doctorlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PostOpQuickSummaryObj.CheckInReviewDoctorId });

                        if (doctorlist.length > 0) {
                            var License = '';
                            //var Suffix = '';

                            //if (doctorlist[0].SuffixName !== '') {
                            //    Suffix = doctorlist[0].SuffixName + ',';
                            //}
                            if (doctorlist[0].LicenseNumber !== '') {
                                License = 'Lic: ' + doctorlist[0].LicenseNumber;
                            }
                            $scope.PostOpQuickSummaryObj.CheckInReviewDoctorName = doctorlist[0].UserFullName + ' ' + License
                            //if (doctorlist[0].SuffixId == 10) {
                            //    $scope.PostOpQuickSummaryObj.CheckInReviewDoctorName = ' Dr. ' + doctorlist[0].FullName + ' ' + Suffix + ' ' + License;
                            //} else {
                            //    $scope.PostOpQuickSummaryObj.CheckInReviewDoctorName = doctorlist[0].FullName + ' ' + Suffix + ' ' + License;
                            //}
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
                            //var Suffix = '';

                            //if (Anesthetist[0].SuffixName !== '') {
                            //    Suffix = Anesthetist[0].SuffixName + ',';
                            //}
                            if (Anesthetist[0].LicenseNumber !== '') {
                                License = 'Lic: ' + Anesthetist[0].LicenseNumber;
                            }
                            $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistName = Anesthetist[0].UserFullName + ' ' + License;

                            //if (Anesthetist[0].SuffixId == 10) {
                            //    $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistName = ' Dr. ' + Anesthetist[0].FullName + ' ' + Suffix + ' ' + License;
                            //} else {
                            //    $scope.PostOpQuickSummaryObj.CheckInReviewAnesthetistName = Anesthetist[0].FullName + ' ' + Suffix + ' ' + License;
                            //}
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
            }
            else {
                $scope.PostOpQuickSummaryObj.Vitals = [];
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PostOPNurseCheckListId = 0;
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PatientReceived = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.AccompaniedBy = "";
                $scope.PostOpQuickSummaryObj.NurseChart.Checklists.PainLevel = null;
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
    $scope.IsUnSignoffshow = false;
    $scope.GetDischargeData = function () {

        let appointmentId = null;
        let PatientSurgeryId = null;
        if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
            appointmentId = $scope.SelectedAppointmentId;
        }

        if ($scope.SelectedAppointmentTypeId == 7 || $scope.SelectedAppointmentTypeId == 6) {
            appointmentId = $scope.cacheStorageItem.AscAppointmentId;
        }
       
        if ($scope.SelectedAppointmentTypeId == 7) {
            //if ($scope.cacheStorageItem.PreAdmSurgeryList.length > 0) {
            //    PatientSurgeryId = $scope.cacheStorageItem.PreAdmSurgeryList[0].PatientSurgeryId;
            //}
        } else if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
            if ($scope.cacheStorageItem.SurgeryList.length > 0) {
                PatientSurgeryId = $scope.cacheStorageItem.SurgeryList[0].PatientSurgeryId;
            }
        }

        let req = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": appointmentId || null,
            "PatientId": $scope.SelectedPatientID || null,
            "PatientSurgeryId": PatientSurgeryId || null,
        };

        eHnoteSurgeryService.GetPostOpDischargeData(req).then(function (resp) {
            if (resp.data.Status === "Success") {

                $scope.DischargeQuickSummaryObj.LastSignOffUserDetails = angular.copy(resp.data.LastSignOffUserDetails) || [];
                if ($scope.DischargeQuickSummaryObj.LastSignOffUserDetails.length > 0) {
                    var SurgeonfilteredArray = $filter('filter')($scope.DischargeQuickSummaryObj.LastSignOffUserDetails, { 'UserType': "Surgeon", "LatestStatus": "SignOff" }, true) || [];
                    var NursefilteredArray = $filter('filter')($scope.DischargeQuickSummaryObj.LastSignOffUserDetails, { 'UserType': "Nurse", "LatestStatus": "SignOff" }, true) || [];

                    if (SurgeonfilteredArray.length > 0) {
                        $scope.IsUnSignoffshow = true;
                    }
                    else if (NursefilteredArray.length > 0) {
                        if ($scope.RoleId == 43 || $scope.RoleId == 1) {
                            $scope.IsUnSignoffshow = false;                          
                        }
                        else {
                            $scope.IsUnSignoffshow = true;
                           
                        }
                    }
                }
             
                $scope.DischargeQuickSummaryObj.Diagnosis = angular.copy(resp.data.Diagnosis);
                $scope.DischargeQuickSummaryObj.Prescriptions = angular.copy(resp.data.Prescription);
                $scope.DischargeQuickSummaryObj.InvestigationsList = resp.data.InvestigationsList || [];
                $scope.DischargeQuickSummaryObj.Findings = angular.copy(resp.data.Findings);
                $scope.DischargeQuickSummaryObj.MedicineOrdersInstructions = angular.copy(resp.data.MedicineOrdersInstructions);
                $scope.DischargeQuickSummaryObj.SurgeryList = resp.data.SurgeryList || [];
                $scope.DischargeQuickSummaryObj.ImplantsDetailsArray = resp.data.ImplantsDetailsArray || [];
                $scope.DischargeQuickSummaryObj.OthersDetailsArray = resp.data.OthersDetailsArray || [];
                $scope.DischargeQuickSummaryObj.ReasonForVisit = resp.data.ReasonForVisit || "";
                $scope.DischargeQuickSummaryObj.ProcedureDescription = resp.data.ProcedureDescription || "";
                $scope.DischargeQuickSummaryObj.Complications = resp.data.Complications || "";
                $scope.DischargeQuickSummaryObj.Pathology = resp.data.Pathology || "";
                $scope.DischargeQuickSummaryObj.PostProceduresNotes = resp.data.PostProceduresNotes || "";
                $scope.DischargeQuickSummaryObj.PatientsInstructions = resp.data.PatientsInstructions || "";
                $scope.DischargeQuickSummaryObj.PatientName = $scope.cacheStorageItem.PatientName || "";
                $scope.DischargeQuickSummaryObj.CurrentEyeMedicationList = resp.data.CurrentEyeMedicationList || [];
                $scope.DischargeQuickSummaryObj.CurrentSystemicMedicationList = resp.data.CurrentSystemicMedicationList || [];


                if ($scope.DischargeQuickSummaryObj.PostProceduresNotes !== '') {
                    $scope.DischargeQuickSummaryObj.PostProceduresNotes = $scope.DischargeQuickSummaryObj.PostProceduresNotes.replace(/<br>/g, '\n');
                }           
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
                                $scope.PatientDischargeObj.Surgeon = TempFilter[0].UserFullName;
                                //var SuffixName = '';
                                //TempFilter[0].SuffixName = TempFilter[0].SuffixName || '';
                                //if (TempFilter[0].SuffixName != "") {
                                //    SuffixName = TempFilter[0].SuffixName;
                                //}
                                //if (TempFilter[0].SuffixId == 10) {
                                //    $scope.PatientDischargeObj.Surgeon = ' Dr. ' + TempFilter[0].FullName + ' ' + SuffixName;
                                //} else {
                                //    $scope.PatientDischargeObj.Surgeon = TempFilter[0].FullName + ' ' + SuffixName;
                                //}

                            }
                        }

                        item.InternalCoManagerId = item.InternalCoManagerId || '';
                        if (item.InternalCoManagerId != '') {
                            let temparray = $filter('filter')($scope.allUserList, { 'DoctorID': item.InternalCoManagerId }, true);
                            temparray = temparray || [];
                            if (temparray.length > 0) {
                                $scope.PatientDischargeObj.InternalCoManager = temparray[0].UserFullName;
                                //var SuffixName = '';
                                //temparray[0].SuffixName = temparray[0].SuffixName || '';
                                //if (temparray[0].SuffixName != "") {
                                //    SuffixName = temparray[0].SuffixName;
                                //}
                                //if (temparray[0].SuffixId == 10) {
                                //    $scope.PatientDischargeObj.InternalCoManager = ' Dr. ' + temparray[0].FullName + ' ' + SuffixName;
                                //} else {
                                //    $scope.PatientDischargeObj.InternalCoManager = temparray[0].FullName + ' ' + SuffixName;
                                //}
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
                        $scope.PatientDischargeObj.FullName = item.PatientFullName || "";
                        $scope.PatientDischargeObj.DOB = item.DOB || "";
                        $scope.PatientDischargeObj.SurgeryDate = item.AppointmentDate || null;
                        $scope.PatientDischargeObj.PatientDisplayId = item.PatientDisplayId || "";
                        $scope.PatientDischargeObj.Gender = item.Gender || "";

                    });
                    
                }

                $scope.DischargeQuickSummaryObj.ReconcileMedicationList = [];
                if ($scope.DischargeQuickSummaryObj.CurrentEyeMedicationList.length > 0) {
                    $scope.DischargeQuickSummaryObj.ReconcileMedicationList = $scope.DischargeQuickSummaryObj.ReconcileMedicationList.concat($scope.DischargeQuickSummaryObj.CurrentEyeMedicationList);
                }
                if ($scope.DischargeQuickSummaryObj.CurrentSystemicMedicationList.length > 0) {
                    $scope.DischargeQuickSummaryObj.ReconcileMedicationList = $scope.DischargeQuickSummaryObj.ReconcileMedicationList.concat($scope.DischargeQuickSummaryObj.CurrentSystemicMedicationList);
                }

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

                if ($scope.DischargeQuickSummaryObj.ReconcileMedicationList.length > 0) {
                    $scope.DischargeQuickSummaryObj.ReconcileMedicationList = $filter("filter")($scope.DischargeQuickSummaryObj.ReconcileMedicationList, function (kitem, index) { return kitem.AppointmentId == $scope.cacheStorageItem.AppointmentId }) || [];
                    $scope.ConvertDate($scope.DischargeQuickSummaryObj.ReconcileMedicationList);
                }

                //$scope.DischargeQuickSummaryObj.PatientTolerated = resp.data.PatientTolerated || false;
                //if ($scope.DischargeQuickSummaryObj.PatientTolerated) {
                //    var PatienttoleratedDischarge = "Patient tolerated the surgery well and was transferred in stable condition";
                //    if ($scope.DischargeQuickSummaryObj.PostProceduresNotes !== '') {
                //        $scope.DischargeQuickSummaryObj.PostProceduresNotes = PatienttoleratedDischarge.replace(/<br>/g, '\n');
                //    } else {
                //        $scope.DischargeQuickSummaryObj.PostProceduresNotes = PatienttoleratedDischarge;
                //    }
                //} else {
                //    $scope.DischargeQuickSummaryObj.PostProceduresNotes = "";
                //}

                if (resp.data.PostOpDischarge.length > 0) {

                    $scope.DischargeQuickSummaryObj.FinalDisposition = resp.data.PostOpDischarge[0].FinalDisposition || "";
                    $scope.DischargeQuickSummaryObj.MedicationsPostOP = resp.data.PostOpDischarge[0].MedicationsPostOP || "";
                    $scope.DischargeQuickSummaryObj.ProcedureDetails = resp.data.PostOpDischarge[0].ProcedureDetails || "";
                    $scope.DischargeQuickSummaryObj.PatientinstructionsInd = resp.data.PostOpDischarge[0].PatientinstructionsInd || false;
                    if ($scope.DischargeQuickSummaryObj.Pathology !== '') {
                        $scope.DischargeQuickSummaryObj.Pathology = $scope.DischargeQuickSummaryObj.Pathology.replace(/<br>/g, '\n');
                    }
                    if ($scope.DischargeQuickSummaryObj.FinalDisposition !== '') {
                        $scope.DischargeQuickSummaryObj.FinalDisposition = $scope.DischargeQuickSummaryObj.FinalDisposition.replace(/<br>/g, '\n');
                    }

                    $scope.DischargeQuickSummaryObj.PatientSignString = resp.data.PostOpDischarge[0].PatientSign || "";
                    if ($scope.DischargeQuickSummaryObj.PatientSignString != '') {
                        $scope.DischargeQuickSummaryObj.IsPatientSignatureDone = true;
                        var canvasS = document.getElementById("PV_patientdischargeSigantureImg");
                        var ctxS = canvasS.getContext("2d");
                        ctxS.clearRect(0, 0, canvasS.width, canvasS.height);
                        var imageS = new Image();
                        imageS.onload = function () {
                            ctxS.drawImage(imageS, 0, 0, canvasS.width, canvasS.height);
                        };
                        imageS.src = $scope.DischargeQuickSummaryObj.PatientSignString;
                    }

                    $scope.DischargeQuickSummaryObj.NurseSignString = resp.data.PostOpDischarge[0].NurseSign || '';
                    if ($scope.DischargeQuickSummaryObj.NurseSignString != '') {
                        $scope.DischargeQuickSummaryObj.IsNurseSignatureDone = true;
                        var canvasP = document.getElementById("PV_NursedischargeSigantureImg");
                        var ctxP = canvasP.getContext("2d");
                        ctxP.clearRect(0, 0, canvasP.width, canvasP.height);
                        var imageP = new Image();
                        imageP.onload = function () {
                            ctxP.drawImage(imageP, 0, 0, canvasP.width, canvasP.height);
                        };
                        imageP.src = $scope.DischargeQuickSummaryObj.NurseSignString;
                    }

                    $scope.DischargeQuickSummaryObj.AccompaniedBySign = resp.data.PostOpDischarge[0].AccompaniedBySign || '';
                    if ($scope.DischargeQuickSummaryObj.AccompaniedBySign != '') {
                        $scope.DischargeQuickSummaryObj.IsAccompaniedBySignatureDone = true;
                        var canvasA = document.getElementById("PV_AccompaniedBySigantureImg");
                        var ctxA = canvasA.getContext("2d");
                        ctxA.clearRect(0, 0, canvasA.width, canvasA.height);
                        var imageA = new Image();
                        imageA.onload = function () {
                            ctxA.drawImage(imageA, 0, 0, canvasA.width, canvasA.height);
                        };
                        imageA.src = $scope.DischargeQuickSummaryObj.AccompaniedBySign;
                    }

                    $scope.DischargeQuickSummaryObj.PatientSignedDateTime = resp.data.PostOpDischarge[0].PatientSignedDateTime || null;
                    if ($scope.DischargeQuickSummaryObj.PatientSignedDateTime != null) {
                        $scope.DischargeQuickSummaryObj.PatientSignedDateTime = $filter('date')($scope.DischargeQuickSummaryObj.PatientSignedDateTime, "MM-dd-yyyy hh:mm a");
                    }
                    $scope.DischargeQuickSummaryObj.NurseSignedDateTime = resp.data.PostOpDischarge[0].NurseSignedDateTime || null;
                    if ($scope.DischargeQuickSummaryObj.NurseSignedDateTime != null) {
                        $scope.DischargeQuickSummaryObj.NurseSignedDateTime = $filter('date')($scope.DischargeQuickSummaryObj.NurseSignedDateTime, "MM-dd-yyyy hh:mm a");
                    }
                    $scope.DischargeQuickSummaryObj.AccompaniedBySignedDateTime = resp.data.PostOpDischarge[0].AccompaniedBySignedDateTime || null;
                    if ($scope.DischargeQuickSummaryObj.AccompaniedBySignedDateTime != null) {
                        $scope.DischargeQuickSummaryObj.AccompaniedBySignedDateTime = $filter('date')($scope.DischargeQuickSummaryObj.AccompaniedBySignedDateTime, "MM-dd-yyyy hh:mm a");
                    }
                    $scope.DischargeQuickSummaryObj.SignatureNurseName = resp.data.PostOpDischarge[0].SignatureNurseName || "";

                    $scope.DischargeQuickSummaryObj.AccompainedBy = resp.data.PostOpDischarge[0].AccompainedBy || '';
                    $scope.DischargeQuickSummaryObj.AccompainedByNotes = resp.data.PostOpDischarge[0].AccompainedByNotes || '';
                    $scope.DischargeQuickSummaryObj.DischargeAccompainedName = resp.data.PostOpDischarge[0].DischargeAccompainedName || '';
                    $scope.DischargeQuickSummaryObj.CheifComplaints = resp.data.PostOpDischarge[0].CheifComplaints || "";
                }

                if (resp.data.rows.length > 0) {

                    $scope.PostopDischargeDetails = angular.copy(resp.data.rows[0]);

                    $scope.DischargeQuickSummaryObj.FollowUpDate1 = $filter('date')($scope.PostopDischargeDetails.FollowUpDate1, "MM-dd-yyyy") || "";
                    $scope.DischargeQuickSummaryObj.FollowUpDate2 = $filter('date')($scope.PostopDischargeDetails.FollowUpDate2, "MM-dd-yyyy") || "";
                    $scope.DischargeQuickSummaryObj.FollowUpDate3 = $filter('date')($scope.PostopDischargeDetails.FollowUpDate3, "MM-dd-yyyy") || "";
                    $scope.DischargeQuickSummaryObj.DischargeReviewedBy = $scope.PostopDischargeDetails.DischargeReviewedBy || "";
                    $scope.DischargeQuickSummaryObj.DischargeChartStatus = $scope.PostopDischargeDetails.DischargeChartStatus || "";

                    if ($scope.DischargeQuickSummaryObj.DischargeReviewedBy != null) {
                        var doctorlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.DischargeQuickSummaryObj.DischargeReviewedBy });
                    }
                    doctorlist = doctorlist || [];
                    if (doctorlist.length > 0) {
                        $scope.DischargeQuickSummaryObj.DischargeReviewedByName = angular.copy(doctorlist[0].FirstName + ' ' + doctorlist[0].LastName + ' ' + doctorlist[0].SuffixName);

                        //$scope.DischargeQuickSummaryObj.DischargeReviewedByNameSuffix = angular.copy(doctorlist[0].SuffixName) || '';
                        $scope.DischargeQuickSummaryObj.DischargeReviewedByNameLicenseNumber = angular.copy(doctorlist[0].LicenseNumber) || '';
                        //if (doctorlist[0].SuffixId == 10) {
                        //    $scope.DischargeQuickSummaryObj.DischargeReviewedByName = ' Dr. ' + $scope.DischargeQuickSummaryObj.DischargeReviewedByName;
                        //}
                    } else {
                        $scope.DischargeQuickSummaryObj.DischargeReviewedByName = '';
                        //$scope.DischargeQuickSummaryObj.DischargeReviewedByNameSuffix = '';
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
        if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
            appointmentId = $scope.SelectedAppointmentId;
        }

        if ($scope.SelectedAppointmentTypeId == 7 || $scope.SelectedAppointmentTypeId == 6) {
            appointmentId = $scope.cacheStorageItem.AscAppointmentId;
        }

        var params = {
            "AppointmentId": appointmentId || null,
            "RequestType": "ASC"
        }

        var obj = {
            "HospitalId": $scope.HospitalId || null,
            "PatientId": $scope.SelectedPatientID || null,
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
                $scope.OperativeNotesObj.OperativeNoteAddendums = angular.copy(resp[1].data.OperativeNoteAddendums) || [];
                $scope.OperativeNotesObj.PatientStableSurgery = resp[1].data.PatientStableSurgery || false;
                $scope.OperativeNotesObj.AdequatePreoperativeWorkup = resp[1].data.AdequatePreoperativeWorkup || false;
                if ($scope.OperativeNotesObj.PatientStableSurgery == true && $scope.OperativeNotesObj.AdequatePreoperativeWorkup == true) {
                    $scope.OperativeNotesObj.PostProceduresNotes = resp[1].data.PreProcedureNotes || "";
                }
                if ($scope.OperativeNotesObj.PreProcedureNotes == "") {
                    if ($scope.OperativeNotesObj.PatientStableSurgery) {
                        let statement1 = "Patients is stable for surgery.";
                        let statement2 = "Pre-operative workup was found adequate.";
                        if ($scope.OperativeNotesObj.AdequatePreoperativeWorkup) {
                            $scope.OperativeNotesObj.PreProcedureNotes = statement1 + " " + statement2;
                        } else {
                            $scope.OperativeNotesObj.PreProcedureNotes = statement1;
                        }
                    } else if ($scope.OperativeNotesObj.AdequatePreoperativeWorkup) {
                        $scope.OperativeNotesObj.PreProcedureNotes = "Pre-operative workup was found adequate.";
                    } else {
                        $scope.OperativeNotesObj.PreProcedureNotes = "";
                    }
                }

                $scope.OperativeNotesObj.PatientTolerated = resp[1].data.PatientTolerated || false;
                if ($scope.OperativeNotesObj.PatientTolerated) {
                    var Patienttolerated = "Patient tolerated the surgery well and was transferred in stable condition";
                    if ($scope.OperativeNotesObj.PostProceduresNotes !== '') {
                        $scope.OperativeNotesObj.PostProceduresNotes = Patienttolerated.replace(/<br>/g, '\n');
                    } else {
                        $scope.OperativeNotesObj.PostProceduresNotes = Patienttolerated;
                    }
                } else {
                    $scope.OperativeNotesObj.PostProceduresNotes = "";
                }

                $scope.OperativeNotesObj.PostProceduresNotes = resp[1].data.PostProceduresNotes || "";
                $scope.OperativeNotesObj.Pathology = resp[1].data.Pathology || "";
                $scope.Diagnosis = resp[1].data.Diagnosis || [];
                $scope.ImplantsDetailsArray = resp[1].data.ImplantsDetailsArray || [];
                $scope.OperativeNotesObj.OthersDetailsArray = resp[1].data.OthersDetailsArray || [];
                $scope.OperativeNotesObj.SurgeryList = resp[1].data.SurgeryList || [];
                $scope.OperativeNotesObj.Prescription = resp[1].data.Prescription || [];
                $scope.OperativeNotesObj.InvestigationsList = resp[1].data.InvestigationsList || [];
                $scope.OperativeNotesObj.PatientsInstructions = resp[1].data.PatientsInstructions || "";
                $scope.OperativeNotesObj.AnesthesiaTypelist = resp[1].data.AnesthesiaTypelist || [];
                $scope.OperativeNotesObj.PostOpMedicationsNotes = resp[1].data.PostOpMedicationsNotes || "";
                $scope.OperativeNotesObj.MedicationsPostOP = resp[1].data.MedicationsPostOP || "";
                $scope.OperativeNotesObj.OccularHistoryArray = resp[1].data.OccularHistory || [];
                $scope.OperativeNotesObj.OccularHistoryRemarks = resp[1].data.OccularHistoryRemarks || "";
                

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
                                $scope.PatientDischargeObj.Surgeon = TempFilter[0].UserFullName;

                                //var SuffixName = '';
                                //TempFilter[0].SuffixName = TempFilter[0].SuffixName || '';
                                //if (TempFilter[0].SuffixName != "") {
                                //    SuffixName = TempFilter[0].SuffixName;
                                //}
                                //if (TempFilter[0].SuffixId == 10) {
                                //    $scope.PatientDischargeObj.Surgeon = ' Dr. ' + TempFilter[0].FullName + ' ' + SuffixName;
                                //} else {
                                //    $scope.PatientDischargeObj.Surgeon = TempFilter[0].FullName + ' ' + SuffixName;
                                //}

                            }
                        }
                        $scope.PatientDischargeObj.OperativeProcedure = item.SurgeryName;
                        $scope.PatientDischargeObj.OrganId = item.OrganId;
                        $scope.PatientDischargeObj.SurgeryEyeStatusName = item.SurgeryEyeStatusName || '';
                        $scope.PatientDischargeObj.SurgeryEyeStatusId = item.SurgeryEyeStatusId || 0;
                        $scope.PatientDischargeObj.FullName = item.PatientFullName || "";
                        $scope.PatientDischargeObj.DOB = item.DOB || "";
                        $scope.PatientDischargeObj.SurgeryDate = item.AppointmentDate || null;
                        $scope.PatientDischargeObj.PatientDisplayId = item.PatientDisplayId || "";
                        $scope.PatientDischargeObj.Gender = item.Gender || "";
                    });
                }



                if (resp[1].data.rows.length > 0) {
                    $scope.OperativeNotesObj.Complications = resp[1].data.rows[0].Complications || '';
                    $scope.OperativeNotesObj.CheifComplaints = resp[1].data.rows[0].CheifComplaints || '';
                    $scope.OperativeNotesObj.MedicationsPostOP = resp[1].data.rows[0].MedicationsPostOP || '';
                    $scope.OperativeNotesObj.OtherCodes = resp[1].data.rows[0].OtherCodes || '';
                    $scope.OperativeNotesObj.CodeImplants = resp[1].data.rows[0].CodeImplants || '';
                    $scope.OperativeNotesObj.Findings = resp[1].data.rows[0].Findings || '';
                    $scope.OperativeNotesObj.SurgeonOperativeNotes = resp[1].data.rows[0].SurgeonOperativeNotes || '';
                    $scope.OperativeNotesObj.ProcedureDetails = resp[1].data.rows[0].ProcedureDetails || "";
                    $scope.OperativeNotesObj.ReasonForVisit = resp[1].data.rows[0].ReasonForVisit || "";
                    $scope.OperativeNotesObj.PhysicalExam = resp[1].data.rows[0].PhysicalExam || "";
                    $scope.OperativeNotesObj.PreProcedureNotes = resp[1].data.rows[0].PreProcedureNotes || "";
                    //$scope.OperativeNotesObj.PostProceduresNotes = resp[1].data.rows[0].PostProcedureNote || "";
                    //$scope.OperativeNotesObj.PatientsInstructions = resp[1].data.rows[0].PatientsInstructions || "";
                    $scope.OperativeNotesObj.OperativeNotesReviewedBy = resp[1].data.rows[0].OperativeNotesReviewedBy || null;
                    $scope.OperativeNotesObj.OperativeOverAllRemarks = resp[1].data.rows[0].OperativeOverAllRemarks || "";
                    $scope.OperativeNotesObj.OperativeReviewedDate = resp[1].data.rows[0].OperativeReviewedDate || null;
                    $scope.OperativeNotesObj.OperativeReviewedDate = $filter('date')($scope.OperativeNotesObj.OperativeReviewedDate, "MM-dd-yyyy hh:mm a");
                    $scope.OperativeNotesObj.OperativeChartStatus = resp[1].data.rows[0].OperativeChartStatus || '';
                    

                    if ($scope.OperativeNotesObj.OperativeNotesReviewedBy != null) {
                        var TempFilter = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.OperativeNotesObj.OperativeNotesReviewedBy }, true) || [];
                        if (TempFilter.length > 0) {
                            $scope.OperativeNotesObj.OperativeReviewedName = angular.copy(TempFilter[0].FirstName + ' ' + TempFilter[0].LastName + ' '+ TempFilter[0].SuffixName); 
                            //$scope.OperativeNotesObj.OperativeReviewedNameSuffix = angular.copy(TempFilter[0].SuffixName);
                            $scope.OperativeNotesObj.ReviewedByLicenseNumber = angular.copy(TempFilter[0].LicenseNumber);

                            //if (TempFilter[0].SuffixId == 10) {
                            //    $scope.OperativeNotesObj.OperativeReviewedName = ' Dr. ' + $scope.OperativeNotesObj.OperativeReviewedName;
                            //}
                        }
                        else {
                            $scope.OperativeNotesObj.OperativeReviewedName = '';
                            //$scope.OperativeNotesObj.OperativeReviewedNameSuffix = '';
                            $scope.OperativeNotesObj.ReviewedByLicenseNumber = '';
                        }

                    }

                } else {
                    $scope.Diagnosis = []
                    $scope.ImplantsDetailsArray = [];
                    $scope.OperativeNotesObj.Complications = "";
                    $scope.OperativeNotesObj.Findings = "";
                    $scope.OperativeNotesObj.SurgeonOperativeNotes = "";
                }
                //let visitReasonId = resp[1].data.VisitReasonId || 0;
                //eHnoteMasterDataService.setIsShowYagTemplate(visitReasonId);
                //$scope.IsShowYagTemplate = eHnoteMasterDataService.getIsShowYagTemplate();
            }

        });
    }

    $scope.MasterReferralSource = function () {
        eHnoteOrgReferralDataServices.GetMasterReferralSource($scope.ParenthospitalId).then(function (response) {
            $scope.ReferralSouceMaster = response.data.rows;
        });
    }

   
        let Sourcetemparray = $filter("filter")($scope.ReferralSouceMaster, function (kitem) { return kitem.MasterReferralSourceId == $scope.PatientApptPCPInfo.MasterReferralSourceId }, true) || [];

        if (Sourcetemparray.length > 0) {

            $scope.PatientApptPCPInfo.MasterReferralSourceName = Sourcetemparray[0].MasterReferralSourceName;
        }
    
    $scope.SelectPatient = function () {
        eHnoteAuditServices.getPatientDetailsById($scope.SelectedPatientID, ongetPatientDetailsSuccess, ongetPatientDetailsError);
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

        eHnoteMainAppointmentService.getAdditionalApptDetailsById($scope.SelectedAppointmentId).then(function (resp) {

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

        let req = { "AppointmentId": $scope.SelectedAppointmentId, "PatientId": $scope.SelectedPatientID }
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
        "LastSignOffUserDetails": [],
        "CheckListChartStatus": '',
    };

    $scope.ChangeChecklistTab = function () {

        let appointmentId = null;
        if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
            appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
        }

        if ($scope.SelectedAppointmentTypeId == 7) {
            appointmentId = $scope.SelectedAppointmentId;
        }

        let req = {
            "AppointmentId": appointmentId || 0
        };
        let Object = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "CheckListModuleId": 1
        };

        $q.all([
            eHnoteSurgeryService.GetOrganizationASCCheckListData(Object),
            eHnoteSurgeryService.GetPreAdmissionChecklistDetails(req.AppointmentId)
        ]).then(function (resp) {
            if (resp[0].data.status === "Success") {
                let tempChecklistsArray = $filter('filter')(resp[0].data.rows, { 'CheckListCategoryId': 1, 'CheckListSubTypeId': 1 }, true);
                if (tempChecklistsArray.length > 0) {
                    angular.forEach(tempChecklistsArray, function (item) {
                        angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                            kitem.IsChecked = false;
                        });
                        item.ChecklistDate = null;
                        item.Remarks = "";
                    });
                    $scope.ClinicalChecklistObj.ClinicalChecklist = angular.copy(tempChecklistsArray);
                }


            }
            if (resp[1].data.status === "Success") {
                $scope.ClinicalChecklistObj.AdmissionRemarks = resp[1].data.CheckListRemarks || "";
                $scope.ClinicalChecklistObj.CheckListChartStatus = resp[1].data.CheckListChartStatus || "";
                $scope.ClinicalChecklistObj.LastSignOffUserDetails = resp[1].data.LastSignOffUserDetails || [];
                if ($scope.ClinicalChecklistObj.AdmissionRemarks !== '') {
                    $scope.ClinicalChecklistObj.AdmissionRemarks = $scope.ClinicalChecklistObj.AdmissionRemarks.replace(/<br>/g, '\n');
                }

                if (resp[1].data.rows.length > 0) {
                    angular.forEach(resp[1].data.rows, function (hitem) {
                        angular.forEach($scope.ClinicalChecklistObj.ClinicalChecklist, function (item) {
                            if (hitem.CheckListCategoryId === item.CheckListCategoryId && hitem.CheckListId === item.CheckListId) {
                                angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                                    if (hitem.CheckListId == kitem.CheckListId) {
                                        kitem.PatientAscCheckListDetailId = hitem.PatientAscCheckListDetailId || 0;
                                        if (kitem.Value == hitem.Value) {
                                            kitem.IsChecked = true;
                                            item.Value = kitem.Value || '';
                                        }
                                    }
                                });
                                item.ChecklistDate = $filter('date')(hitem.ChecklistDate, "MM-dd-yyyy") || null;

                                if (item.CheckListCategoryId === 1) {
                                    if (item.Value == "N/A" || item.Value == "No" || item.Value == "Not") {
                                        item.ChecklistDate = null;
                                    }
                                }
                                item.Remarks = hitem.Remarks || "";
                                if (item.ChecklistDate != "") {
                                    item.IsChecked = true;
                                }
                                
                            }

                        });
                    });
                }
               


                if (resp[1].data.PreAdmissionChecklistDocuments.length > 0) {
                    $scope.ClinicalChecklistObj.PreAdmissionChecklistDocuments = resp[1].data.PreAdmissionChecklistDocuments || [];
                } else {
                    $scope.ClinicalChecklistObj.PreAdmissionChecklistDocuments = $scope.ClinicalChecklistObj.PreAdmissionChecklistDocuments || [];
                }
                $scope.ClinicalChecklistObj.ChecklistReviewedBy = resp[1].data.ChecklistReviewedBy || null;
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

                if (resp[1].data.ChecklistReviewedDate != '' && resp[1].data.ChecklistReviewedTime != "") {
                    $scope.ClinicalChecklistObj.ChecklistReviewedDate = resp[1].data.ChecklistReviewedDate + 'T' + resp[1].data.ChecklistReviewedTime;
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
        if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
            appointmentId = $scope.SelectedAppointmentId;
        }

        if ($scope.SelectedAppointmentTypeId == 7 || $scope.SelectedAppointmentTypeId == 6) {
            appointmentId = $scope.SelectedAppointmentId;
        }

        let PatientSurgeryId = null;
        if ($scope.SelectedAppointmentTypeId == 7) {
            //if ($scope.cacheStorageItem.PreAdmSurgeryList.length > 0) {
            //    PatientSurgeryId = $scope.cacheStorageItem.PreAdmSurgeryList[0].PatientSurgeryId;
            //}
        } else if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
            if ($scope.cacheStorageItem.SurgeryList.length > 0) {
                PatientSurgeryId = $scope.cacheStorageItem.SurgeryList[0].PatientSurgeryId;
            }
        }

        let ReqObj = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": appointmentId || 0,
            "PatientId": $scope.SelectedPatientID || 0,
            "AppointmentTypeId": $scope.SelectedAppointmentTypeId || 0,
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

                $scope.PreAdmAnesthetistQuickSummary.ROSOverAllRemarks = resp[0].data.ROSOverAllRemarks || '';

                if (resp[0].data.SystemicOtherData != undefined) {
                    let respObjSys = resp[0].data.SystemicOtherData;
                    $scope.PreAdmAnesthetistQuickSummary.IsCardiacWNL = respObjSys.IsCardiacWNL || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsCNSHistory = respObjSys.IsCNSHistory || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsCardiacWNL = respObjSys.IsCardiacWNL || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsCardiovascularHistory = respObjSys.IsCardiovascularHistory || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsAutoImmuneDisordersWNL = respObjSys.IsAutoImmuneDisordersWNL || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsEndocrineWNL = respObjSys.IsEndocrineWNL || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsHemeOncWNL = respObjSys.IsHemeOncWNL || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsHepaticWNL = respObjSys.IsHepaticWNL || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsKidneyDiseaseWNL = respObjSys.IsKidneyDiseaseWNL || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsMusculoSkeletalSystemWNL = respObjSys.IsMusculoSkeletalSystemWNL || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsNervousSystemWNL = respObjSys.IsNervousSystemWNL || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsNeurologicWNL = respObjSys.IsNeurologicWNL || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsOthersWNL = respObjSys.IsOthersWNL || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsPsychosisWNL = respObjSys.IsPsychosisWNL || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsPulmonaryWNL = respObjSys.IsPulmonaryWNL || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsRespiratoryNormal = respObjSys.IsRespiratoryNormal || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsHeentWNL = respObjSys.IsHeentWNL || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsLungsWNL = respObjSys.IsLungsWNL || false;
                    $scope.PreAdmAnesthetistQuickSummary.IsGeneralappearanceWNL = respObjSys.IsGeneralappearanceWNL || false;

                    $scope.PreAdmAnesthetistQuickSummary.GeneralAppearenceNotes = respObjSys.GeneralAppearenceNotes || '';
                    if ($scope.PreAdmAnesthetistQuickSummary.GeneralAppearenceNotes !== '') {
                        $scope.PreAdmAnesthetistQuickSummary.showGeneralAppearenceNotes = true;
                    } else {
                        $scope.PreAdmAnesthetistQuickSummary.showGeneralAppearenceNotes = false;
                    }

                    $scope.PreAdmAnesthetistQuickSummary.HeentNotes = respObjSys.HeentNotes || '';
                    if ($scope.PreAdmAnesthetistQuickSummary.HeentNotes !== '') {
                        $scope.PreAdmAnesthetistQuickSummary.showHeentNotes = true;
                    } else {
                        $scope.PreAdmAnesthetistQuickSummary.showHeentNotes = false;
                    }

                    $scope.PreAdmAnesthetistQuickSummary.LungsNotes = respObjSys.LungsNotes || '';
                    if ($scope.PreAdmAnesthetistQuickSummary.LungsNotes !== '') {
                        $scope.PreAdmAnesthetistQuickSummary.showLungsNotes = true;
                    } else {
                        $scope.PreAdmAnesthetistQuickSummary.showLungsNotes = false;
                    }

                    $scope.PreAdmAnesthetistQuickSummary.CardiacNotes = respObjSys.CardiacNotes || '';
                    if ($scope.PreAdmAnesthetistQuickSummary.CardiacNotes !== '') {
                        $scope.PreAdmAnesthetistQuickSummary.showCardiacNotes = true;
                    } else {
                        $scope.PreAdmAnesthetistQuickSummary.showCardiacNotes = false;
                    }

                    $scope.PreAdmAnesthetistQuickSummary.NeurologicNotes = respObjSys.NeurologicNotes || '';
                    if ($scope.PreAdmAnesthetistQuickSummary.NeurologicNotes !== '') {
                        $scope.PreAdmAnesthetistQuickSummary.showNeurologicNotes = true;
                    } else {
                        $scope.PreAdmAnesthetistQuickSummary.showNeurologicNotes = false;
                    }

                    $scope.PreAdmAnesthetistQuickSummary.PulmonaryNotes = respObjSys.PulmonaryNotes || '';
                    if ($scope.PreAdmAnesthetistQuickSummary.PulmonaryNotes !== '') {
                        $scope.PreAdmAnesthetistQuickSummary.showPulmonaryNotes = true;
                    } else {
                        $scope.PreAdmAnesthetistQuickSummary.showPulmonaryNotes = false;
                    }

                    $scope.PreAdmAnesthetistQuickSummary.HepaticNotes = respObjSys.HepaticNotes || '';
                    if ($scope.PreAdmAnesthetistQuickSummary.HepaticNotes !== '') {
                        $scope.PreAdmAnesthetistQuickSummary.showHepaticNotes = true;
                    } else {
                        $scope.PreAdmAnesthetistQuickSummary.showHepaticNotes = false;
                    }

                    $scope.PreAdmAnesthetistQuickSummary.HemeOncNotes = respObjSys.HemeOncNotes || '';
                    if ($scope.PreAdmAnesthetistQuickSummary.HemeOncNotes !== '') {
                        $scope.PreAdmAnesthetistQuickSummary.showHemeOncNotes = true;
                    } else {
                        $scope.PreAdmAnesthetistQuickSummary.showHemeOncNotes = false;
                    }

                    $scope.PreAdmAnesthetistQuickSummary.NervousSystemNotes = respObjSys.NervousSystemNotes || '';
                    if ($scope.PreAdmAnesthetistQuickSummary.NervousSystemNotes !== '') {
                        $scope.PreAdmAnesthetistQuickSummary.showNervousSystemNotes = true;
                    } else {
                        $scope.PreAdmAnesthetistQuickSummary.showNervousSystemNotes = false;
                    }

                    $scope.PreAdmAnesthetistQuickSummary.KidneyDiseaseNotes = respObjSys.KidneyDiseaseNotes || '';
                    if ($scope.PreAdmAnesthetistQuickSummary.KidneyDiseaseNotes !== '') {
                        $scope.PreAdmAnesthetistQuickSummary.showKidneyDiseaseNotes = true;
                    } else {
                        $scope.PreAdmAnesthetistQuickSummary.showKidneyDiseaseNotes = false;
                    }

                    $scope.PreAdmAnesthetistQuickSummary.MusculoSkeletalSystemNotes = respObjSys.MusculoSkeletalSystemNotes || '';
                    if ($scope.PreAdmAnesthetistQuickSummary.MusculoSkeletalSystemNotes !== '') {
                        $scope.PreAdmAnesthetistQuickSummary.showMusculoSkeletalSystemNotes = true;
                    } else {
                        $scope.PreAdmAnesthetistQuickSummary.showMusculoSkeletalSystemNotes = false;
                    }
                    $scope.PreAdmAnesthetistQuickSummary.PsychosisNotes = respObjSys.PsychosisNotes || '';
                    if ($scope.PreAdmAnesthetistQuickSummary.PsychosisNotes !== '') {
                        $scope.PreAdmAnesthetistQuickSummary.showPsychosisNotes = true;
                    } else {
                        $scope.PreAdmAnesthetistQuickSummary.showPsychosisNotes = false;
                    }

                    $scope.PreAdmAnesthetistQuickSummary.OthersNotes = respObjSys.OthersNotes || '';
                    if ($scope.PreAdmAnesthetistQuickSummary.OthersNotes !== '') {
                        $scope.PreAdmAnesthetistQuickSummary.showOthersNotes = true;
                    } else {
                        $scope.PreAdmAnesthetistQuickSummary.showOthersNotes = false;
                    }

                    $scope.PreAdmAnesthetistQuickSummary.EndocrineNotes = respObjSys.EndocrineNotes || '';
                    
                }



                $scope.PreAdmAnesthetistQuickSummary.AllergyRemarks = resp[0].data.AllergyRemarks || '';
                $scope.PreAdmAnesthetistQuickSummary.SurgicalRemarks = resp[0].data.SurgicalRemarks || '';
                $scope.PreAdmAnesthetistQuickSummary.CurrentSystemicRemarks = resp[0].data.CurrentSystemicRemarks || '';
                $scope.PreAdmAnesthetistQuickSummary.CurrentEyeRemarks = resp[0].data.CurrentEyeRemarks || '';
                $scope.PreAdmAnesthetistQuickSummary.SystemicHistoryRemarks = resp[0].data.SystemicHistoryRemarks || '';
                $scope.PreAdmAnesthetistQuickSummary.LifestyleHistoryRemarks = resp[0].data.LifestyleHistoryRemarks || '';
                $scope.PreAdmAnesthetistQuickSummary.RespiratoryRemarks = resp[0].data.RespiratoryRemarks || '';

                $scope.PreAdmAnesthetistQuickSummary.InvestigationsList = angular.copy(resp[0].data.InvestigationsList) || [];
                $scope.PreAdmAnesthetistQuickSummary.MedicineOrdersList = angular.copy(resp[0].data.Prescription) || [];
                $scope.PreAdmAnesthetistQuickSummary.DocumentDetails = angular.copy(resp[0].data.DocumentDetails) || [];
                $scope.PreAdmAnesthetistQuickSummary.InvestigationsList = angular.copy(resp[0].data.InvestigationsList) || [];
                $scope.PreAdmAnesthetistQuickSummary.LifestyleDetail = angular.copy(resp[0].data.LifestyleDetail) || [];

                $scope.PreAdmAnesthetistQuickSummary.PhysicalEvaluationArray = angular.copy(resp[0].data.PhysicalEvaluationDetails) || [];
                //$scope.PreAdmAnesthetistQuickSummary.AnesthetistOrderDetails = angular.copy(resp[0].data.PreAdmissionDetails[0].OrderDetails) || [];



                if (resp[0].data.PreAdmissionDetails.length > 0) {
                    $scope.AnesthesiaPreAdmissionDetails = angular.copy(resp[0].data.PreAdmissionDetails);
                    $scope.PreAdmissionDetails = angular.copy(resp[0].data.PreAdmissionDetails[0]);

                    $scope.PreAdmAnesthetistQuickSummary.PreAdmissionChartStatus = $scope.PreAdmissionDetails.PreAdmissionChartStatus || '';
                    $scope.PreAdmAnesthetistQuickSummary.PhysicalNeurologicNotes = $scope.PreAdmissionDetails.PhysicalNeurologicNotes || '';
                    $scope.PreAdmAnesthetistQuickSummary.PhysicalGeneralNotes = $scope.PreAdmissionDetails.PhysicalGeneralNotes || '';
                    $scope.PreAdmAnesthetistQuickSummary.PhysicalCardiocNotes = $scope.PreAdmissionDetails.PhysicalCardiocNotes || '';
                    $scope.PreAdmAnesthetistQuickSummary.PhysicalHepaticNotes = $scope.PreAdmissionDetails.PhysicalHepaticNotes || '';
                    $scope.PreAdmAnesthetistQuickSummary.PhysicalPulmonaryNotes = $scope.PreAdmissionDetails.PhysicalPulmonaryNotes || '';

                    $scope.PreAdmAnesthetistQuickSummary.LastDialysisDate = $scope.PreAdmissionDetails.LastDialysisDate || null;
                    if ($scope.PreAdmAnesthetistQuickSummary.LastDialysisDate !== null) {
                        $scope.PreAdmAnesthetistQuickSummary.LastDialysisDate = moment($scope.PreAdmAnesthetistQuickSummary.LastDialysisDate).format("MM-DD-YYYY");
                    };

                    if ($scope.PreAdmissionDetails.OrderDetails.length > 0) {
                        $scope.PreAdmAnesthetistQuickSummary.AnesthetistOrderDetails = [];

                        $scope.PreAdmAnesthetistQuickSummary.AnesthetistOrderDetails = $scope.PreAdmissionDetails.OrderDetails || [];
                        $scope.SetSurgeonCredentials($scope.PreAdmAnesthetistQuickSummary.AnesthetistOrderDetails);
                        angular.forEach($scope.PreAdmAnesthetistQuickSummary.AnesthetistOrderDetails, function (Mitem) {
                            Mitem.ReviewedBy = Mitem.ReviewedBy || null;
                            Mitem.UserOrderId = Mitem.UserOrderId || null;
                            Mitem.UserType = Mitem.UserType || null;
                            Mitem.ScreenTypeId = Mitem.ScreenTypeId || null;
                            Mitem.ReviewedByName = Mitem.ReviewedByName || '';
                            Mitem.ModifiedDt = Mitem.ModifiedDt || '';
                            Mitem.IsOrderReviewed = Mitem.IsOrderReviewed || false;
                            Mitem.PreAdmAnesthetistObj = angular.copy(Mitem.PrescriptionArray) || [];
                            Mitem.PrescriptionMainAddObj = {
                                "PatientPrescriptionId": 0,
                                "PrescriptionDetails": [],
                            };
                            if (Mitem.PreAdmAnesthetistObj.length > 0) {
                                Mitem.PrescriptionMainAddObj.PatientPrescriptionId = Mitem.PreAdmAnesthetistObj[0].PatientPrescriptionId;
                                Mitem.PrescriptionMainAddObj.PrescriptionDetails = angular.copy(Mitem.PreAdmAnesthetistObj[0].PrescriptionDetails) || [];

                                angular.forEach(Mitem.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                                    item.StartDate = item.StartDate || null;
                                    item.StopDate = item.StopDate || null;
                                    if (item.StartDate != null) {
                                        item.StartDate = moment(item.StartDate).format("MM-DD-YYYY");
                                    }
                                    if (item.StopDate != null) {
                                        item.StopDate = moment(item.StopDate).format("MM-DD-YYYY");
                                    }
                                    item.SigObj = item.Sig;
                                });
                            }

                            if (Mitem.Investigationslist.length > 0) {
                                angular.forEach(Mitem.Investigationslist, function (item) {
                                    item.DurationDate = item.DurationDate || '';
                                    if (item.DurationDate !== '') {
                                        item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                                        item.ShowDateFormat = true;
                                    } else {
                                        item.ShowDateFormat = false;
                                    }
                                    item.InvestigationNotes = item.InvestigationNotes || '';
                                    if (item.InvestigationNotes !== '') {
                                        item.IsNoteEdit = true;
                                    }
                                });
                            }
                        });

                        if ($scope.PreAdmAnesthetistQuickSummary.AnesthetistOrderDetails.length > 0) {
                            var AnesPresCount = 0;
                            var AnesInvesCount = 0;
                            var AnesGeneralCount = 0;

                            angular.forEach($scope.PreAdmAnesthetistQuickSummary.AnesthetistOrderDetails, function (item) {

                                if (item.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                                    AnesPresCount++;
                                };
                                if (item.Investigationslist.length > 0) {
                                    AnesInvesCount++;
                                };
                                if (item.GeneralOrders.length > 0) {
                                    AnesGeneralCount++;
                                };

                            });
                            if (AnesPresCount !== 0) {
                                $scope.IsAnesMedications = true;
                            } else {
                                $scope.IsAnesMedications = false;
                            };

                            if (AnesGeneralCount !== 0) {
                                $scope.IsAnesGenOrders = true;
                            } else {
                                $scope.IsAnesGenOrders = false;
                            };
                            if (AnesInvesCount !== 0) {
                                $scope.IsAnesInvestigation = true;
                            } else {
                                $scope.IsAnesInvestigation = false;
                            };

                        } else {
                            $scope.PreAdmAnesthetistQuickSummary.AnesthetistOrderDetails = [];
                            $scope.IsAnesMedications = false;
                            $scope.IsAnesGenOrders = false;
                            $scope.IsAnesInvesCount = false;


                        }

                    }

                    $scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedBy = $scope.PreAdmissionDetails.ReviwedBy || null;
                    $scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedName = $scope.PreAdmissionDetails.ReviwedByName || '';
                    $scope.PreAdmAnesthetistQuickSummary.AnesthetistLicNo = $scope.PreAdmissionDetails.ReviwedByLICNumber || '';

                    //if ($scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedBy !== null) {
                    //    var AnesthetistReviewedlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedBy }) || [];
                    //    //if (AnesthetistReviewedlist.length > 0) {
                    //    //    var SuffixName = '';
                    //    //    AnesthetistReviewedlist[0].SuffixName = AnesthetistReviewedlist[0].SuffixName || '';
                    //    //    if (AnesthetistReviewedlist[0].SuffixName != "") {
                    //    //        SuffixName = AnesthetistReviewedlist[0].SuffixName;
                    //    //    }

                    //    //    var LicenseNumber = "";

                    //    //    AnesthetistReviewedlist[0].LicenseNumber = AnesthetistReviewedlist[0].LicenseNumber || "";
                    //    //    if (AnesthetistReviewedlist[0].LicenseNumber != "") {
                    //    //        LicenseNumber = 'LIC :' + ' ' + AnesthetistReviewedlist[0].LicenseNumber;
                    //    //    }

                    //    //    if (AnesthetistReviewedlist[0].SuffixId == 10) {
                    //    //        $scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedName = angular.copy( AnesthetistReviewedlist[0].FullName + ' ' + SuffixName);
                    //    //    } else {
                    //    //        $scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedName = angular.copy(AnesthetistReviewedlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                    //    //    }
                    //    //    //$scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedName = AnesthetistReviewedlist[0].FullName || '';
                    //    //}
                    //}

                    $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedBy = $scope.PreAdmissionDetails.AnesthesiologistReviewedBy || null;
                    $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedName = $scope.PreAdmissionDetails.AnesthesiologistReviewedByName || '';
                    $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistLicNo = $scope.PreAdmissionDetails.AnesthesiologistReviewedByLICNumber || '';

                    //if ($scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedBy !== null) {
                    //    var AnesthesiologistReviewedlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedBy }) || [];
                    //    //if (AnesthesiologistReviewedlist.length > 0) {
                    //    //    //var SuffixName = '';
                    //    //    //AnesthesiologistReviewedlist[0].SuffixName = AnesthesiologistReviewedlist[0].SuffixName || '';
                    //    //    //if (AnesthesiologistReviewedlist[0].SuffixName != "") {
                    //    //    //    SuffixName = AnesthesiologistReviewedlist[0].SuffixName;
                    //    //    //}

                    //    //    var LicenseNumber = "";

                    //    //    AnesthesiologistReviewedlist[0].LicenseNumber = AnesthesiologistReviewedlist[0].LicenseNumber || "";
                    //    //    if (AnesthesiologistReviewedlist[0].LicenseNumber != "") {
                    //    //        LicenseNumber = 'LIC :' + ' ' + AnesthesiologistReviewedlist[0].LicenseNumber;
                    //    //    }
                    //    //    $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedName = angular.copy(AnesthesiologistReviewedlist[0].UserFullName + ' ' + LicenseNumber);

                    //    //    //if (AnesthesiologistReviewedlist[0].SuffixId == 10) {
                    //    //    //    $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedName = angular.copy('Dr.' + AnesthesiologistReviewedlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                    //    //    //} else {
                    //    //    //    $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedName = angular.copy(AnesthesiologistReviewedlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                    //    //    //}
                    //    //    //$scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedName = AnesthesiologistReviewedlist[0].FullName || '';
                    //    //}
                    //}

                    $scope.PreAdmAnesthetistQuickSummary.ReviewedDate = $scope.PreAdmissionDetails.AnesthesiaReviewedDate || "";
                    $scope.PreAdmAnesthetistQuickSummary.ReviewedTime = $scope.PreAdmissionDetails.AnesthesiaReviewedTime || "";
                    $scope.PreAdmAnesthetistQuickSummary.Vitals = [];
                    if ($scope.PreAdmissionDetails !== undefined) {
                        if ($scope.PreAdmissionDetails.Vitals.length > 0) {
                            let vitallist = $filter("filter")($scope.PreAdmissionDetails.Vitals, function (kitem) { return kitem.TypeId == 2 });
                            if (vitallist.length > 0) {
                                angular.forEach($scope.PreAdmissionDetails.Vitals, function (item) {
                                    if (item.TypeId == 2) {
                                        item.Vitals = item.Vitals || [];
                                        let subvitals = angular.copy($scope.subVitallist()) || [];
                                        angular.forEach(item.Vitals, function (Aitem) {
                                            angular.forEach(subvitals, function (Bitem) {
                                                if (Aitem.VitalId == Bitem.VitalId) {
                                                    Bitem.Value = Aitem.Value;
                                                    Bitem.AppointmentVitalDataId = Aitem.AppointmentVitalDataId;
                                                    Bitem.UnitTypeId = Aitem.UnitTypeId;
                                                    Bitem.UnitTypeName = Aitem.UnitTypeName;
                                                }
                                            });
                                        });

                                        let ndate = moment().format("YYYY-MM-DD");
                                        let edate = ndate + " " + item.VitalAddTime;
                                        item.VitalAddTime = moment(edate, "YYYY-MM-DD HH:mm").format("hh:mm A");

                                        let obj = {
                                            "VitalSummaryId": item.VitalSummaryId,
                                            "AppointmentId": $scope.cacheStorageItem.AppointmentTypeId,
                                            "VitalAddDate": moment(item.VitalAddDate).format("MM-DD-YYYY"),
                                            "VitalAddTime": item.VitalAddTime,
                                            "DoctorId": item.DoctorId,
                                            "UserName": item.UserName || "",
                                            "VitalRemarks": item.VitalRemarks || "",
                                            "DeleteInd": "N",
                                            "IsEditVitalInd": false,
                                            "Vitals": angular.copy(subvitals) || [],
                                            "VitalshowNotesInd": false,
                                            "TypeId": item.TypeId,
                                        }
                                        
                                        $scope.PreAdmAnesthetistQuickSummary.Vitals.push(obj);
                                    };
                                });
                            };

                            if ($scope.PreAdmAnesthetistQuickSummary.Vitals.length > 0) {
                                $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay = $scope.GetDisplayVitalsArray();
                                angular.forEach($scope.PreAdmAnesthetistQuickSummary.Vitals, function (mainitem, $index) {
                                    let TempFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 11 }, true) || [];
                                    if (TempFilter.length > 0) {
                                        var tempobj = {
                                            "value": TempFilter[0].Value,
                                            "UnitTypeName": TempFilter[0].UnitTypeName
                                        }
                                    }
                                    $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[0].Values.push(tempobj);
                                    let pulseFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 12 }, true) || [];
                                    if (pulseFilter.length > 0) {
                                        var pulseobj = {
                                            "value": pulseFilter[0].Value,
                                            "UnitTypeName": pulseFilter[0].UnitTypeName
                                        }
                                    }
                                    $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[1].Values.push(pulseobj);
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
                                    $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[2].Values.push(Bpobj);
                                    let RespFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 14 }, true) || [];
                                    if (RespFilter.length > 0) {
                                        var Respobj = {
                                            "value": RespFilter[0].Value,
                                            "UnitTypeName": RespFilter[0].UnitTypeName
                                        }
                                    }
                                    $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[3].Values.push(Respobj);
                                    let Spo2Filter = $filter('filter')(mainitem.Vitals, { "VitalId": 15 }, true) || [];
                                    if (Spo2Filter.length > 0) {
                                        var Spo2obj = {
                                            "value": Spo2Filter[0].Value,
                                            "UnitTypeName": Spo2Filter[0].UnitTypeName
                                        }
                                    }
                                    $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[4].Values.push(Spo2obj);
                                    let BGLFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 8 }, true) || [];
                                    if (BGLFilter.length > 0) {
                                        var BGLobj = {
                                            "value": BGLFilter[0].Value,
                                            "UnitTypeName": BGLFilter[0].UnitTypeName
                                        }
                                    }
                                    $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[5].Values.push(BGLobj);

                                    var Time = {
                                        "value": $scope.PreAdmAnesthetistQuickSummary.Vitals[$index].VitalAddTime || "",
                                        "UnitTypeName": "",
                                    }
                                    $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[6].Values.push(Time);
                                    var performedBy = {
                                        "value": $scope.PreAdmAnesthetistQuickSummary.Vitals[$index].UserName || "",
                                        "UnitTypeName": "",
                                    }
                                    $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[7].Values.push(performedBy);

                                    var NotesObj = {
                                        "value": $scope.PreAdmAnesthetistQuickSummary.Vitals[$index].VitalRemarks || "",
                                        "UnitTypeName": "",
                                    }
                                    $scope.PreAdmAnesthetistQuickSummary.AnesthesiaVitalsDisplay[8].Values.push(NotesObj);
                                });
                            }

                        } else {
                            $scope.PreAdmAnesthetistQuickSummary.Vitals = [];
                        }

                        $scope.PreAdmAnesthetistQuickSummary.SystemicHistory = $scope.PreAdmissionDetails.SystemicHistory || [];
                        $scope.PreAdmAnesthetistQuickSummary.LabInvestigation = $scope.PreAdmissionDetails.LabInvestigation || [];
                        if ($scope.PreAdmissionDetails.LabInvestigation.length > 0) {
                            angular.forEach($scope.PreAdmissionDetails.LabInvestigation, function (Aitem) {
                                angular.forEach($scope.PreAdmAnesthetistQuickSummary.LabList, function (Bitem) {
                                    if (Bitem.ProcedureId == Aitem.ProcedureId) {
                                        Bitem.InvestigationResultDate = Aitem.InvestigationResultDate;
                                        Bitem.ResultId = Aitem.ResultId || null;
                                        Bitem.ResultValue = Aitem.ResultValue;
                                        Bitem.AbNormal = Aitem.AbNormal || false;
                                        Bitem.Normal = Aitem.Normal || false;
                                        Bitem.Remarks = Aitem.Remarks || '';
                                        if (Bitem.Remarks != '') {
                                            Bitem.ShowNotes = true;
                                        }
                                    }
                                });
                            });
                        }
                        $scope.PreAdmAnesthetistQuickSummary.LabNotes = $scope.PreAdmissionDetails.LabNotes || "";
                        $scope.PreAdmAnesthetistQuickSummary.MedicineOrdersInstructions = $scope.PreAdmissionDetails.MedicineOrdersInstructions || '';
                        $scope.PreAdmAnesthetistQuickSummary.PreAdmissionStatus = $scope.PreAdmissionDetails.PreAdmissionStatus || '';

                        var count = 0;
                        if ($scope.PreAdmAnesthetistQuickSummary.SystemicHistory.length > 0) {
                            angular.forEach($scope.PreAdmAnesthetistQuickSummary.SystemicHistory, function (item) {
                                if (item.HistoryId == 116 || item.HistoryId == 118 || item.HistoryId == 119 || item.HistoryId == 120 || item.HistoryId == 121 || item.HistoryId == 122) {
                                    count++
                                }
                            });
                            if (count !== 0) {
                                $scope.IsRespiratoty = true;
                            } else {
                                $scope.IsRespiratoty = false;
                            }
                        } else {
                            $scope.IsRespiratoty = false;
                        }

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
                            $scope.PreAdmAnesthetistQuickSummary.CardioVascularObj.ECG = $scope.PreAdmissionDetails.CardioVascular.CardioECG || '';
                            $scope.PreAdmAnesthetistQuickSummary.CardioVascularObj.ECGUnits = $scope.PreAdmissionDetails.CardioVascular.CardioECGUnits;
                            $scope.PreAdmAnesthetistQuickSummary.CardioVascularObj.Notes = $scope.PreAdmissionDetails.CardioVascular.CardioNotes || "";
                        }

                        $scope.PreAdmissionDetails.Airway = $scope.PreAdmissionDetails.Airway || '';
                        if ($scope.PreAdmissionDetails.Airway != '') {
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.ROMTMS = $scope.PreAdmissionDetails.Airway.ROMTMS || '';
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.ROMNECKLAT = $scope.PreAdmissionDetails.Airway.ROMNECKLAT || '';
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.ROMNECKAP = $scope.PreAdmissionDetails.Airway.ROMNECKAP || '';
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Notes = $scope.PreAdmissionDetails.Airway.Notes || "";
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.IsNormal = $scope.PreAdmissionDetails.Airway.IsNormal;
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Class = $scope.PreAdmissionDetails.Airway.Class || '';
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.MouthOpening = $scope.PreAdmissionDetails.Airway.MouthOpening || '';
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.TMDistance = $scope.PreAdmissionDetails.Airway.TMDistance || '';
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.UnableToAssess = $scope.PreAdmissionDetails.Airway.UnableToAssess || false;
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Tracheostomy = $scope.PreAdmissionDetails.Airway.Tracheostomy || false;
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Dentition = $scope.PreAdmissionDetails.Airway.Dentition || "";
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.DentitionList = $scope.PreAdmissionDetails.Airway.DentitionList || [];
                            $scope.PreAdmAnesthetistQuickSummary.AirwayObj.ChemistryNotes = $scope.PreAdmissionDetails.Airway.ChemistryNotes || '';

                            if ($scope.PreAdmAnesthetistQuickSummary.AirwayObj.DentitionList.length > 0) {
                                angular.forEach($scope.PreAdmAnesthetistQuickSummary.AirwayObj.DentitionList, function (Aitem) {
                                    Aitem.IsChecked = true;
                                });
                            }
                        }

                        if ($scope.PreAdmAnesthetistQuickSummary.AirwayObj.ROMTMS == '' && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.ROMNECKAP == '' && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.ROMNECKLAT == '' && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Class == '' && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.DentitionList.length == 0 && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Dentition == '' && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.Notes == '' && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.MouthOpening == '' && $scope.PreAdmAnesthetistQuickSummary.AirwayObj.TMDistance == '' && !$scope.PreAdmAnesthetistQuickSummary.AirwayObj.UnableToAssess && !$scope.PreAdmAnesthetistQuickSummary.AirwayObj.Tracheostomy) {
                            $scope.PreAdmAnesthetistQuickSummary.IsAirwayData = false;
                        } else {
                            $scope.PreAdmAnesthetistQuickSummary.IsAirwayData = true;
                        }

                        $scope.PreAdmAnesthetistQuickSummary.AnesthesiaTypelist = $scope.PreAdmissionDetails.AnesthesiaTypelist || [];
                        $scope.PreAdmAnesthetistQuickSummary.AnesthesiaTypelist = _.uniq($scope.PreAdmAnesthetistQuickSummary.AnesthesiaTypelist, false, function (p) { return p.AnesthesiaTypeId; });
                        $scope.PreAdmissionDetails.AnesthesiaPlan = $scope.PreAdmissionDetails.AnesthesiaPlan || "";
                        
                        if ($scope.PreAdmAnesthetistQuickSummary.AnesthesiaTypelist.length > 0) {
                            $scope.PreAdmAnesthetistQuickSummary.IsAnesthesiaType = true;
                        }

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
                            $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthetistName = $scope.PreAdmissionDetails.AnesthesiaPlan.AnesPlanAnesthetistName || '';
                            $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthetistLic = $scope.PreAdmissionDetails.AnesthesiaPlan.AnesthetistLICNumber || '';
                            $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistName = $scope.PreAdmissionDetails.AnesthesiaPlan.AnesthesiologistName || '';
                            $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistLic = $scope.PreAdmissionDetails.AnesthesiaPlan.AnesthesiologistLICNumber || '';
                            $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.IsRisksbenefitsAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsRisksbenefitsAnesthesia;
                            $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.IsAnestheticplan = $scope.PreAdmissionDetails.AnesthesiaPlan.IsAnestheticplan;

                            //if ($scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesPlanAnesthetistId !== null) {
                            //    let Anesthetistlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesPlanAnesthetistId });
                            //    Anesthetistlist = Anesthetistlist || [];
                            //    if (Anesthetistlist.length > 0) {
                            //        var SuffixName = '';
                            //        Anesthetistlist[0].SuffixName = Anesthetistlist[0].SuffixName || '';
                            //        if (Anesthetistlist[0].SuffixName != "") {
                            //            SuffixName = Anesthetistlist[0].SuffixName;
                            //        }

                            //        var LicenseNumber = "";

                            //        Anesthetistlist[0].LicenseNumber = Anesthetistlist[0].LicenseNumber || "";
                            //        if (Anesthetistlist[0].LicenseNumber != "") {
                            //            LicenseNumber = 'LIC :' + ' ' + Anesthetistlist[0].LicenseNumber;
                            //        }

                            //        if (Anesthetistlist[0].SuffixId == 10) {
                            //            $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthetistName = Anesthetistlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                            //        } else {
                            //            $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthetistName = Anesthetistlist[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                            //        }
                            //        //$scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthetistName = Anesthetistlist[0].FullName;
                            //    }
                            //}

                            //if ($scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistId !== null) {
                            //    let AnesthesiologistList = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistId });
                            //    AnesthesiologistList = AnesthesiologistList || [];
                            //    if (AnesthesiologistList.length > 0) {
                            //        //var SuffixName = '';
                            //        //AnesthesiologistList[0].SuffixName = AnesthesiologistList[0].SuffixName || '';
                            //        //if (AnesthesiologistList[0].SuffixName != "") {
                            //        //    SuffixName = AnesthesiologistList[0].SuffixName;
                            //        //}

                            //        var LicenseNumber = "";

                            //        AnesthesiologistList[0].LicenseNumber = AnesthesiologistList[0].LicenseNumber || "";
                            //        if (AnesthesiologistList[0].LicenseNumber != "") {
                            //            LicenseNumber = 'LIC :' + ' ' + AnesthesiologistList[0].LicenseNumber;
                            //        }
                            //        $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistName = AnesthesiologistList[0].UserFullName + ' ' + LicenseNumber;

                            //        //if (AnesthesiologistList[0].SuffixId == 10) {
                            //        //    $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistName = ' Dr. ' + AnesthesiologistList[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                            //        //} else {
                            //        //    $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistName = AnesthesiologistList[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                            //        //}
                            //        // $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistName = AnesthesiologistList[0].FullName;
                            //    }
                            //}
                        }

                        $scope.PreAdmissionDetails.AssessmentsASA = $scope.PreAdmissionDetails.AssessmentsASA || "";
                        if ($scope.PreAdmissionDetails.AssessmentsASA != "") {
                            $scope.PreAdmAnesthetistQuickSummary.ASAObj.Notes = $scope.PreAdmissionDetails.AssessmentsASA.Notes || "";
                            $scope.PreAdmAnesthetistQuickSummary.ASAObj.Value = $scope.PreAdmissionDetails.AssessmentsASA.Value || '';
                            $scope.PreAdmAnesthetistQuickSummary.ASAObj.ENotes = $scope.PreAdmissionDetails.AssessmentsASA.ENotes || '';
                            $scope.PreAdmAnesthetistQuickSummary.ASAObj.EValue = $scope.PreAdmissionDetails.AssessmentsASA.EValue || '';
                            $scope.PreAdmAnesthetistQuickSummary.ASAObj.IsEmergency = $scope.PreAdmissionDetails.AssessmentsASA.IsEmergency || false;
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


                    $scope.PreOpQuickSummaryObj.BeforeAnesthesiaReviewedBy = $scope.PreAdmissionDetails.BeforeAnesthesiaReviewedBy || null;
                    $scope.PreOpQuickSummaryObj.BeforeAnesthesiaReviewedByName = $scope.PreAdmissionDetails.BeforeAnesthesiaReviewedByName || "";

                    $scope.PreOpQuickSummaryObj.IsBeforeAnesthesiaNormal = $scope.PreAdmissionDetails.IsBeforeAnesthesiaNormal || false;

                    $scope.PreAdmissionDetails.OrgAscChecklistDetails = $scope.PreAdmissionDetails.OrgAscChecklistDetails || [];

                    if ($scope.PreAdmissionDetails.OrgAscChecklistDetails.length > 0) {
                        angular.forEach($scope.PreAdmissionDetails.OrgAscChecklistDetails, function (item) {
                            angular.forEach($scope.PreOpQuickSummaryObj.OrgASCChecklist, function (kitem) {
                                if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                                    if (kitem.CheckListId === item.CheckListId) {
                                        kitem.IsChecked = true;
                                        kitem.Score = item.Score || 0;
                                        kitem.Value = item.Value || '';
                                        kitem.Remarks = item.Remarks || '';

                                        kitem.ChecklistDate = $filter("date")(item.ChecklistDate, "MM-dd-yyyy") || "";
                                        kitem.ChecklistTime = item.ChecklistTime || "";

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

                        $scope.PreOpQuickSummaryObj.AllOrgAscChecklistData = $filter("filter")($scope.PreOpQuickSummaryObj.OrgASCChecklist, function (kitem) { return kitem.CheckListCategoryId == 7}, true);

                    }

                    if ($scope.PreAdmAnesthetistQuickSummary.AnesthetistReviewedBy == null && $scope.PreAdmAnesthetistQuickSummary.PreAdmissionStatus == '' && $scope.PreAdmAnesthetistQuickSummary.AnesthesiologistReviewedBy == null) {
                        $scope.PreAdmAnesthetistQuickSummary.IndicatorStatus = false;
                    } else {
                        $scope.PreAdmAnesthetistQuickSummary.IndicatorStatus = true;
                    }

                    if ($scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesPlanAnesthetistId == null && $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.Dosage == "" && $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthetistNotes == "" && $scope.PreAdmAnesthetistQuickSummary.IsAnesthesiaType == false && $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj.AnesthesiologistId == null) {
                        $scope.PreAdmAnesthetistQuickSummary.Indicator = false;
                    } else {
                        $scope.PreAdmAnesthetistQuickSummary.Indicator = true;
                    }

                } else {
                    $scope.AnesthesiaPreAdmissionDetails = [];

                    $scope.PreAdmAnesthetistQuickSummary = angular.copy($scope.GetPreAdmAnesthetistQuickSummary());
                    $scope.PreAdmAnesthetistQuickSummary.LabObj = angular.copy($scope.GetLabObj());
                    $scope.PreAdmAnesthetistQuickSummary.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());
                    $scope.PreAdmAnesthetistQuickSummary.APAnesthesiaOptionsObj = angular.copy($scope.GetAPAnesthesiaOptionsObj());

                    //// ROS

                    if (resp[0].data.CurrentSystemicMedicationList.length > 0) {
                        $scope.PreAdmAnesthetistQuickSummary.CurrentSystemicMedicationsHistory = angular.copy(resp[0].data.CurrentSystemicMedicationList);
                    }

                    if (resp[0].data.CurrentEyeMedicationList.length > 0) {
                        $scope.PreAdmAnesthetistQuickSummary.CurrentEyeMedications = angular.copy(resp[0].data.CurrentEyeMedicationList);
                    }

                    if (resp[0].data.AllergyItems.length > 0) {
                        $scope.PreAdmAnesthetistQuickSummary.AllergyItems = angular.copy(resp[0].data.AllergyItems);
                    }
                    //if (resp[0].data.SystemicHistory.length > 0) {
                    //    $scope.PreAdmAnesthetistQuickSummary.SystemicHistory = angular.copy(resp[0].data.SystemicHistory);
                    //}
                    if (resp[0].data.SurgicalHistory.length > 0) {
                        $scope.PreAdmAnesthetistQuickSummary.SurgicalHistory = angular.copy(resp[0].data.SurgicalHistory);
                    }

                    $scope.PreAdmAnesthetistQuickSummary.AllergyRemarks = resp[0].data.AllergyRemarks || '';
                    $scope.PreAdmAnesthetistQuickSummary.SurgicalRemarks = resp[0].data.SurgicalRemarks || '';
                    $scope.PreAdmAnesthetistQuickSummary.CurrentSystemicRemarks = resp[0].data.CurrentSystemicRemarks || '';
                    $scope.PreAdmAnesthetistQuickSummary.CurrentEyeRemarks = resp[0].data.CurrentEyeRemarks || '';
                    $scope.PreAdmAnesthetistQuickSummary.SystemicHistoryRemarks = resp[0].data.SystemicHistoryRemarks || '';
                    $scope.PreAdmAnesthetistQuickSummary.LifestyleHistoryRemarks = resp[0].data.LifestyleHistoryRemarks || '';
                }
            }

            $scope.cacheStorageItem.CopiedPreviousAppointmentId = $scope.cacheStorageItem.CopiedPreviousAppointmentId || 0;
            $scope.cacheStorageItem.PreAdmAppointmentId = $scope.cacheStorageItem.PreAdmAppointmentId || 0;

            if ($scope.cacheStorageItem.CopiedPreviousAppointmentId !== 0) {
                $scope.GetAppointmentImages($scope.cacheStorageItem.CopiedPreviousAppointmentId);
            };
            if ($scope.cacheStorageItem.PreAdmAppointmentId !== 0) {
                $scope.GetAppointmentImages($scope.cacheStorageItem.PreAdmAppointmentId);
            };

            //$scope.AllAnesthetistList = [];
            //if ($scope.allUserList.length > 0) {
            //    angular.forEach($scope.allUserList, function (item) {
            //        if (item.RoleId == 30 || item.RoleId == 8 || item.DoctorID == $scope.UserId || item.RoleId == 1 || item.RoleId == 43) {
            //            $scope.AllAnesthetistList.push(item);
            //        }
            //    })
            //};
        });
    }

    $scope.GetPreAdmissionCardiologistDetails = function () {

        let appointmentId = null;
        if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
            appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
        }

        if ($scope.SelectedAppointmentTypeId == 7) {
            appointmentId = $scope.SelectedAppointmentId;
        }

        let PatientSurgeryId = null;
        if ($scope.SelectedAppointmentTypeId == 7) {
            //if ($scope.cacheStorageItem.PreAdmSurgeryList.length > 0) {
            //    PatientSurgeryId = $scope.cacheStorageItem.PreAdmSurgeryList[0].PatientSurgeryId;
            //}
        } else if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
            if ($scope.cacheStorageItem.SurgeryList.length > 0) {
                PatientSurgeryId = $scope.cacheStorageItem.SurgeryList[0].PatientSurgeryId;
            }
        }

        let ReqObj = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": appointmentId || 0,
            "PatientId": $scope.SelectedPatientID || 0,
            "AppointmentTypeId": $scope.SelectedAppointmentTypeId || 0,
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

                resp[0].data.CardiologistDetails = resp[0].data.CardiologistDetails || [];
                if (resp[0].data.CardiologistDetails.length > 0) {
                    $scope.PreAdmCardioQuickSummaryObj.OrderDetails = resp[0].data.CardiologistDetails[0].OrderDetails || [];
                    $scope.SetSurgeonCredentials($scope.PreAdmCardioQuickSummaryObj.OrderDetails);
                } else {
                    $scope.PreAdmCardioQuickSummaryObj.OrderDetails = [];
                }
                if ($scope.PreAdmCardioQuickSummaryObj.OrderDetails.length > 0) {
                    var PhyPresCount = 0;
                    var PhyInvesCount = 0;
                    var PhyGeneralCount = 0;

                    angular.forEach($scope.PreAdmCardioQuickSummaryObj.OrderDetails, function (item) {

                        if (item.PrescriptionArray.length > 0) {
                            PhyPresCount++;
                        };
                        if (item.Investigationslist.length > 0) {
                            PhyInvesCount++;
                        };
                        if (item.GeneralOrders.length > 0) {
                            PhyGeneralCount++;
                        };

                    });
                    if (PhyPresCount !== 0) {
                        $scope.IsPhyMedications = true;
                    } else {
                        $scope.IsPhyMedications = false;
                    };

                    if (PhyGeneralCount !== 0) {
                        $scope.IsPhyGenOrders = true;
                    } else {
                        $scope.IsPhyGenOrders = false;
                    };
                    if (PhyInvesCount !== 0) {
                        $scope.IsPhyInvestigation = true;
                    } else {
                        $scope.IsPhyInvestigation = false;
                    };

                } else {
                    $scope.PreAdmCardioQuickSummaryObj.OrderDetails = [];
                    $scope.IsPhyMedications = false;
                    $scope.IsPhyGenOrders = false;
                    $scope.IsPhyInvestigation = false;


                }

                if (resp[0].data.SystemicOtherData != undefined) {
                    let respObjSystemic = resp[0].data.SystemicOtherData;
                    $scope.PreAdmCardioQuickSummaryObj.IsCardiacWNL = respObjSystemic.IsCardiacWNL || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsCNSHistory = respObjSystemic.IsCNSHistory || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsCardiacWNL = respObjSystemic.IsCardiacWNL || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsCardiovascularHistory = respObjSystemic.IsCardiovascularHistory || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsAutoImmuneDisordersWNL = respObjSystemic.IsAutoImmuneDisordersWNL || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsEndocrineWNL = respObjSystemic.IsEndocrineWNL || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsHemeOncWNL = respObjSystemic.IsHemeOncWNL || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsHepaticWNL = respObjSystemic.IsHepaticWNL || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsKidneyDiseaseWNL = respObjSystemic.IsKidneyDiseaseWNL || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsMusculoSkeletalSystemWNL = respObjSystemic.IsMusculoSkeletalSystemWNL || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsNervousSystemWNL = respObjSystemic.IsNervousSystemWNL || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsNeurologicWNL = respObjSystemic.IsNeurologicWNL || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsOthersWNL = respObjSystemic.IsOthersWNL || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsPsychosisWNL = respObjSystemic.IsPsychosisWNL || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsPulmonaryWNL = respObjSystemic.IsPulmonaryWNL || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsRespiratoryNormal = respObjSystemic.IsRespiratoryNormal || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsHeentWNL = respObjSystemic.IsHeentWNL || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsLungsWNL = respObjSystemic.IsLungsWNL || false;
                    $scope.PreAdmCardioQuickSummaryObj.IsGeneralappearanceWNL = respObjSystemic.IsGeneralappearanceWNL || false;

                    $scope.PreAdmCardioQuickSummaryObj.GeneralAppearenceNotes = respObjSystemic.GeneralAppearenceNotes || '';
                    if ($scope.PreAdmCardioQuickSummaryObj.GeneralAppearenceNotes !== '') {
                        $scope.PreAdmCardioQuickSummaryObj.showGeneralAppearenceNotes = true;
                    } else {
                        $scope.PreAdmCardioQuickSummaryObj.showGeneralAppearenceNotes = false;
                    }

                    $scope.PreAdmCardioQuickSummaryObj.HeentNotes = respObjSystemic.HeentNotes || '';
                    if ($scope.PreAdmCardioQuickSummaryObj.HeentNotes !== '') {
                        $scope.PreAdmCardioQuickSummaryObj.showHeentNotes = true;
                    } else {
                        $scope.PreAdmCardioQuickSummaryObj.showHeentNotes = false;
                    }

                    $scope.PreAdmCardioQuickSummaryObj.LungsNotes = respObjSystemic.LungsNotes || '';
                    if ($scope.PreAdmCardioQuickSummaryObj.LungsNotes !== '') {
                        $scope.PreAdmCardioQuickSummaryObj.showLungsNotes = true;
                    } else {
                        $scope.PreAdmCardioQuickSummaryObj.showLungsNotes = false;
                    }

                    $scope.PreAdmCardioQuickSummaryObj.CardiacNotes = respObjSystemic.CardiacNotes || '';
                    if ($scope.PreAdmCardioQuickSummaryObj.CardiacNotes !== '') {
                        $scope.PreAdmCardioQuickSummaryObj.showCardiacNotes = true;
                    } else {
                        $scope.PreAdmCardioQuickSummaryObj.showCardiacNotes = false;
                    }

                    $scope.PreAdmCardioQuickSummaryObj.NeurologicNotes = respObjSystemic.NeurologicNotes || '';
                    if ($scope.PreAdmCardioQuickSummaryObj.NeurologicNotes !== '') {
                        $scope.PreAdmCardioQuickSummaryObj.showNeurologicNotes = true;
                    } else {
                        $scope.PreAdmCardioQuickSummaryObj.showNeurologicNotes = false;
                    }

                    $scope.PreAdmCardioQuickSummaryObj.PulmonaryNotes = respObjSystemic.PulmonaryNotes || '';
                    if ($scope.PreAdmCardioQuickSummaryObj.PulmonaryNotes !== '') {
                        $scope.PreAdmCardioQuickSummaryObj.showPulmonaryNotes = true;
                    } else {
                        $scope.PreAdmCardioQuickSummaryObj.showPulmonaryNotes = false;
                    }

                    $scope.PreAdmCardioQuickSummaryObj.HepaticNotes = respObjSystemic.HepaticNotes || '';
                    if ($scope.PreAdmCardioQuickSummaryObj.HepaticNotes !== '') {
                        $scope.PreAdmCardioQuickSummaryObj.showHepaticNotes = true;
                    } else {
                        $scope.PreAdmCardioQuickSummaryObj.showHepaticNotes = false;
                    }

                    $scope.PreAdmCardioQuickSummaryObj.HemeOncNotes = respObjSystemic.HemeOncNotes || '';
                    if ($scope.PreAdmCardioQuickSummaryObj.HemeOncNotes !== '') {
                        $scope.PreAdmCardioQuickSummaryObj.showHemeOncNotes = true;
                    } else {
                        $scope.PreAdmCardioQuickSummaryObj.showHemeOncNotes = false;
                    }

                    $scope.PreAdmCardioQuickSummaryObj.NervousSystemNotes = respObjSystemic.NervousSystemNotes || '';
                    if ($scope.PreAdmCardioQuickSummaryObj.NervousSystemNotes !== '') {
                        $scope.PreAdmCardioQuickSummaryObj.showNervousSystemNotes = true;
                    } else {
                        $scope.PreAdmCardioQuickSummaryObj.showNervousSystemNotes = false;
                    }

                    $scope.PreAdmCardioQuickSummaryObj.KidneyDiseaseNotes = respObjSystemic.KidneyDiseaseNotes || '';
                    if ($scope.PreAdmCardioQuickSummaryObj.KidneyDiseaseNotes !== '') {
                        $scope.PreAdmCardioQuickSummaryObj.showKidneyDiseaseNotes = true;
                    } else {
                        $scope.PreAdmCardioQuickSummaryObj.showKidneyDiseaseNotes = false;
                    }

                    $scope.PreAdmCardioQuickSummaryObj.MusculoSkeletalSystemNotes = respObjSystemic.MusculoSkeletalSystemNotes || '';
                    if ($scope.PreAdmCardioQuickSummaryObj.MusculoSkeletalSystemNotes !== '') {
                        $scope.PreAdmCardioQuickSummaryObj.showMusculoSkeletalSystemNotes = true;
                    } else {
                        $scope.PreAdmCardioQuickSummaryObj.showMusculoSkeletalSystemNotes = false;
                    }
                    $scope.PreAdmCardioQuickSummaryObj.PsychosisNotes = respObjSystemic.PsychosisNotes || '';
                    if ($scope.PreAdmCardioQuickSummaryObj.PsychosisNotes !== '') {
                        $scope.PreAdmCardioQuickSummaryObj.showPsychosisNotes = true;
                    } else {
                        $scope.PreAdmCardioQuickSummaryObj.showPsychosisNotes = false;
                    }

                    $scope.PreAdmCardioQuickSummaryObj.OthersNotes = respObjSystemic.OthersNotes || '';
                    if ($scope.PreAdmCardioQuickSummaryObj.OthersNotes !== '') {
                        $scope.PreAdmCardioQuickSummaryObj.showOthersNotes = true;
                    } else {
                        $scope.PreAdmCardioQuickSummaryObj.showOthersNotes = false;
                    }


                }




                $scope.PreAdmCardioQuickSummaryObj.AllergyRemarks = resp[0].data.AllergyRemarks || '';
                $scope.PreAdmCardioQuickSummaryObj.SurgicalRemarks = resp[0].data.SurgicalRemarks || '';
                $scope.PreAdmCardioQuickSummaryObj.CurrentSystemicRemarks = resp[0].data.CurrentSystemicRemarks || '';
                $scope.PreAdmCardioQuickSummaryObj.CurrentEyeRemarks = resp[0].data.CurrentEyeRemarks || '';
                $scope.PreAdmCardioQuickSummaryObj.PhysicianSystemicHistoryRemarks = resp[0].data.PhysicianSystemicHistoryRemarks || '';
                $scope.PreAdmCardioQuickSummaryObj.PhysicianLifestyleHistoryRemarks = resp[0].data.PhysicianLifestyleHistoryRemarks || '';
                $scope.PreAdmCardioQuickSummaryObj.PhysicianRespiratoryRemarks = resp[0].data.PhysicianRespiratoryRemarks || '';

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

                    $scope.PreAdmCardiologistDetails.CardioLogistReviewedBy = $scope.PreAdmCardiologistDetails.CardioLogistReviewedBy || null;

                    if ($scope.PreAdmCardiologistDetails !== undefined) {


                        if ($scope.PreAdmCardiologistDetails.CardioLogistReviewedBy != null) {

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
                            $scope.PreAdmCardioQuickSummaryObj.AirwayObj.ROMNECKLAT = $scope.PreAdmCardiologistDetails.Airway.ROMNECKLAT || '';
                            $scope.PreAdmCardioQuickSummaryObj.AirwayObj.ROMNECKAP = $scope.PreAdmCardiologistDetails.Airway.ROMNECKAP || '';
                            $scope.PreAdmCardioQuickSummaryObj.AirwayObj.Notes = $scope.PreAdmCardiologistDetails.Airway.Notes || "";
                            $scope.PreAdmCardioQuickSummaryObj.AirwayObj.IsNormal = $scope.PreAdmCardiologistDetails.Airway.IsNormal || '';
                            $scope.PreAdmCardioQuickSummaryObj.AirwayObj.Class = $scope.PreAdmCardiologistDetails.Airway.Class || '';
                            $scope.PreAdmCardioQuickSummaryObj.AirwayObj.Dentition = $scope.PreAdmCardiologistDetails.Airway.Dentition || '';
                            $scope.PreAdmCardioQuickSummaryObj.AirwayObj.DentitionList = $scope.PreAdmCardiologistDetails.Airway.DentitionList || [];
                            $scope.PreAdmCardioQuickSummaryObj.ChemistryNotes = $scope.PreAdmCardiologistDetails.Airway.ChemistryNotes || '';
                        }

                        $scope.PreAdmCardioQuickSummaryObj.SystemicHistory = $scope.PreAdmCardiologistDetails.SystemicHistory || [];
                        $scope.PreAdmCardioQuickSummaryObj.LifestyleDetail = $scope.PreAdmCardiologistDetails.LifestyleDetail || [];

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
                        //$scope.PreAdmCardioQuickSummaryObj.PulmonaryNotes = $scope.PreAdmCardiologistDetails.PulmonaryNotes || "";
                        //$scope.PreAdmCardioQuickSummaryObj.PsychosisNotes = $scope.PreAdmCardiologistDetails.PsychosisNotes || "";
                        //$scope.PreAdmCardioQuickSummaryObj.OthersNotes = $scope.PreAdmCardiologistDetails.OthersNotes || "";
                        //$scope.PreAdmCardioQuickSummaryObj.NeurologicNotes = $scope.PreAdmCardiologistDetails.NeurologicNotes || "";
                        //$scope.PreAdmCardioQuickSummaryObj.NervousSystemNotes = $scope.PreAdmCardiologistDetails.NervousSystemNotes || "";
                        //$scope.PreAdmCardioQuickSummaryObj.MusculoSkeletalSystemNotes = $scope.PreAdmCardiologistDetails.MusculoSkeletalSystemNotes || "";
                        //$scope.PreAdmCardioQuickSummaryObj.KidneyDiseaseNotes = $scope.PreAdmCardiologistDetails.KidneyDiseaseNotes || "";
                        //$scope.PreAdmCardioQuickSummaryObj.HepaticNotes = $scope.PreAdmCardiologistDetails.HepaticNotes || "";
                        //$scope.PreAdmCardioQuickSummaryObj.HemeOncNotes = $scope.PreAdmCardiologistDetails.HemeOncNotes || "";
                        $scope.PreAdmCardioQuickSummaryObj.EndocrineNotes = $scope.PreAdmCardiologistDetails.EndocrineNotes || "";
              /*          $scope.PreAdmCardioQuickSummaryObj.CardiacNotes = $scope.PreAdmCardiologistDetails.CardiacNotes || "";*/
                        $scope.PreAdmCardioQuickSummaryObj.CNSNotes = $scope.PreAdmCardiologistDetails.CNSNotes || "";
                        $scope.PreAdmCardioQuickSummaryObj.AutoImmuneDisordersNotes = $scope.PreAdmCardiologistDetails.AutoImmuneDisordersNotes || "";

                        $scope.PreAdmCardioQuickSummaryObj.IsHeentWNL = $scope.PreAdmCardiologistDetails.IsHeentWNL;
                        $scope.PreAdmCardioQuickSummaryObj.IsLungsWNL = $scope.PreAdmCardiologistDetails.IsLungsWNL;
                        //$scope.PreAdmCardioQuickSummaryObj.HeentNotes = $scope.PreAdmCardiologistDetails.HeentNotes || "";
                        //$scope.PreAdmCardioQuickSummaryObj.LungsNotes = $scope.PreAdmCardiologistDetails.LungsNotes || "";

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

                    $scope.PreAdmCardiologistDetails.DocumentDetails = resp[0].data.DocumentDetails || [];
                    if ($scope.PreAdmCardiologistDetails.DocumentDetails.length > 0) {
                        $scope.PreAdmCardioQuickSummaryObj.DocumentDetails = angular.copy(resp[0].data.DocumentDetails);
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

                    if (resp[0].data.CurrentSystemicMedicationList.length > 0) {
                        $scope.PreAdmCardioQuickSummaryObj.CurrentSystemicMedicationsHistory = angular.copy(resp[0].data.CurrentSystemicMedicationList);
                    }

                    if (resp[0].data.CurrentEyeMedicationList.length > 0) {
                        $scope.PreAdmCardioQuickSummaryObj.CurrentEyeMedications = angular.copy(resp[0].data.CurrentEyeMedicationList);
                    }

                    if (resp[0].data.AllergyItems.length > 0) {
                        $scope.PreAdmCardioQuickSummaryObj.AllergyItems = angular.copy(resp[0].data.AllergyItems);
                    }
                    //if (resp[0].data.SystemicHistory.length > 0) {
                    //    $scope.PreAdmCardioQuickSummaryObj.SystemicHistory = angular.copy(resp[0].data.SystemicHistory);
                    //}
                    if (resp[0].data.SurgicalHistory.length > 0) {
                        $scope.PreAdmCardioQuickSummaryObj.SurgicalHistory = angular.copy(resp[0].data.SurgicalHistory);
                    }

                    $scope.PreAdmCardioQuickSummaryObj.AllergyRemarks = resp[0].data.AllergyRemarks || '';
                    $scope.PreAdmCardioQuickSummaryObj.SurgicalRemarks = resp[0].data.SurgicalRemarks || '';
                    $scope.PreAdmCardioQuickSummaryObj.CurrentSystemicRemarks = resp[0].data.CurrentSystemicRemarks || '';
                    $scope.PreAdmCardioQuickSummaryObj.CurrentEyeRemarks = resp[0].data.CurrentEyeRemarks || '';
                    $scope.PreAdmCardioQuickSummaryObj.PhysicianSystemicHistoryRemarks = resp[0].data.PhysicianSystemicHistoryRemarks || '';
                    $scope.PreAdmCardioQuickSummaryObj.PhysicianLifestyleHistoryRemarks = resp[0].data.PhysicianLifestyleHistoryRemarks || '';
                    $scope.PreAdmCardioQuickSummaryObj.PhysicianRespiratoryRemarks = resp[0].data.PhysicianRespiratoryRemarks || '';
                }
            }
        });
    };

    $scope.GetASCAdmissionDetails = function () {

        let appointmentId = null;
        if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
            appointmentId = $scope.SelectedAppointmentId;
        }

        if ($scope.SelectedAppointmentTypeId == 7 || $scope.SelectedAppointmentTypeId == 6) {
            appointmentId = $scope.cacheStorageItem.AscAppointmentId;
        }

        let req1 = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "CheckListModuleId": 1,
              "GetAllIndicator": 1
        };

        let req = {
            "AppointmentId": appointmentId || 0,
        };

        let req3 = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": appointmentId || 0,
            "PatientId": $scope.SelectedPatientID || 0,
            "AppointmentTypeId": 4, 
        };

        $q.all([
            eHnoteSurgeryService.GetOrganizationASCCheckListData(req1),
            eHnoteSurgeryService.GetASCAdmissionDetails(req),
            eHnoteSurgeryService.GetOTQuickAccessDetails(req3)
        ]).then(function (resp) {
            let OrgASCChecklists = angular.copy(resp[0].data.rows);
            if (resp[0].data.status === "Success") {
                $scope.AdmissionObj.OrgASCChecklist = angular.copy(resp[0].data.rows);
                angular.forEach($scope.AdmissionObj.OrgASCChecklist, function (item) {
                    angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                        kitem.IsChecked = false;
                    });
                    item.ChecklistDate = null;
                    item.Remarks = "";
                });
            }

            /* Pre-Op Surgeon Orders saved from the Admit screen (GetASCAdmissionDetails.OrderDetails, MedTypeId 2) -
              same data and rules as the Admit summary / print */
            let admitSurgeonOrders = USPrintService.GetAdmitSurgeonOrdersFromAdmission(resp[1].data.status === "Success" ? resp[1].data : null, $scope.allUserList);
            $scope.AdmissionCheckinObj.SurgeonOrders = admitSurgeonOrders.OrderDetails;
            $scope.SetSurgeonCredentials($scope.AdmissionCheckinObj.SurgeonOrders);
            $scope.AdmissionCheckinObj.ODPupilSize = admitSurgeonOrders.ODPupilSize;
            $scope.AdmissionCheckinObj.OSPupilSize = admitSurgeonOrders.OSPupilSize;
            $scope.AdmissionCheckinObj.IsSurgeonOrdersTimeChecked = admitSurgeonOrders.IsSurgeonOrdersTimeChecked;
            if (resp[1].data.status === "Success") {
                $scope.AdmissionCheckinObj.PreopCallArrivalTime = resp[1].data.PreopCallArrivalTime || "";
                let respObj = angular.copy(resp[1].data.rows[0]);

                if (resp[1].data.ClinicalCheckLists.length > 0) {
                    angular.forEach(resp[1].data.ClinicalCheckLists, function (item) {
                        angular.forEach($scope.AdmissionCheckinObj.OrgASCChecklist, function (kitem) {
                            if (item.CheckListCategoryId === 1 && item.CheckListId === kitem.CheckListId) {
                                angular.forEach(kitem.OrganizationCheckListDetails, function (hitem) {
                                    if (item.CheckListId == hitem.CheckListId && item.Value == hitem.Value) {
                                        hitem.IsChecked = true;
                                        kitem.IsChecked = true;
                                        kitem.Value = item.Value || '';
                                    } else {
                                        hitem.IsChecked = false;
                                    }
                                });
                                kitem.Remarks = item.Remarks || "";
                                kitem.ChecklistDate = item.ChecklistDate || "";
                                kitem.ChecklistTime = item.ChecklistTime || "";
                            }
                        });
                    });
                   
                 }


                //if (resp[1].data.ClinicalCheckLists.length > 0) {
                //    angular.forEach(resp[1].data.ClinicalCheckLists, function (item) {
                //        angular.forEach($scope.AdmissionObj.OrgASCChecklist, function (kitem) {
                //            if (item.CheckListCategoryId === 1 && item.CheckListId === kitem.CheckListId) {
                //                angular.forEach(kitem.OrganizationCheckListDetails, function (hitem) {
                //                    if (item.CheckListId == hitem.CheckListId && item.Value == hitem.Value) {
                //                        hitem.IsChecked = true;
                //                    } else {
                //                        hitem.IsChecked = false;
                //                    }
                //                });
                //                kitem.Remarks = item.Remarks || "";
                //                kitem.ChecklistDate = $filter("date")(item.ChecklistDate, "MM-dd-yyyy") || "";

                //                if (kitem.Remarks != "") {
                //                    kitem.shownotes = true;
                //                }
                //                if (kitem.ChecklistDate != "") {
                //                    kitem.IsChecked = true;
                //                }
                //            }
                //        });
                //    });
                //}


                $scope.AdmissionCheckinObj.ChunkedClinicalChecklist = [];


                //let tempArray = $filter('filter')($scope.AdmissionObj.OrgASCChecklist, { 'CheckListCategoryId': 1 }, true) || [];
                let tempArray = $scope.AdmissionObj.OrgASCChecklist
                    .filter(item =>
                        item.CheckListCategoryId === 1 &&
                        item.CheckListSubTypeId === 1
                    )
                    .sort((a, b) => a.OrgOrderBy - b.OrgOrderBy);
                let filteredClinicalChecklist = angular.copy(tempArray);
                if (filteredClinicalChecklist.length > 0) {
                    let chunkSize = Math.ceil((filteredClinicalChecklist.length) / 2);
                    for (let i = 0; i < filteredClinicalChecklist.length; i += chunkSize) {
                        $scope.AdmissionCheckinObj.ChunkedClinicalChecklist.push(filteredClinicalChecklist.slice(i, i + chunkSize));
                    }
                }
                $scope.PreOpQuickSummaryObj.ChunkedPatientChecklist = [];
                let tempPatientArray = $filter('filter')($scope.AdmissionObj.OrgASCChecklist, { 'CheckListCategoryId': 12, 'CheckListSubTypeId': 1 }, true) || [];
                let filteredPatientChecklist = angular.copy(tempPatientArray);
                if (filteredPatientChecklist.length > 0) {
                    let chunkSize = Math.ceil((filteredPatientChecklist.length) / 2);
                    for (let i = 0; i < filteredPatientChecklist.length; i += chunkSize) {
                        $scope.PreOpQuickSummaryObj.ChunkedPatientChecklist.push(filteredPatientChecklist.slice(i, i + chunkSize));
                    }
                }
                if (resp[1].data.InvestigationsList.length > 0) {
                    $scope.AdmissionCheckinObj.InvestigationsList = angular.copy(resp[1].data.InvestigationsList);
                }

                if (resp[1].data.Prescription.length > 0) {
                    $scope.AdmissionCheckinObj.Prescriptions = angular.copy(resp[1].data.Prescription);
                }
              
                if (resp[1].data.rows.length > 0) {

                    $scope.AdmissionCheckinObj.PatientAscCheckInId = respObj.PatientAscCheckInId || null;
                    $scope.AdmissionCheckinObj.NPOTime = respObj.NPOTime || '';


                    if (respObj.ReviewedByDateTime) {
                        $scope.AdmissionCheckinObj.ReviewedByDateTime = $filter('date')(respObj.ReviewedByDateTime, 'MM-dd-yyyy hh:mm a') || null;
                    } else {
                        $scope.AdmissionCheckinObj.ReviewedByDateTime = null;
                    }
                    if (respObj.AdmittedByDateTime) {
                        $scope.AdmissionCheckinObj.AdmittedByDateTime = $filter('date')(respObj.AdmittedByDateTime, 'MM-dd-yyyy hh:mm a') || null;
                    } else {
                        $scope.AdmissionCheckinObj.AdmittedByDateTime = null;
                    }

                    if (respObj.CheckLists.length > 0) {
                        $scope.AdmissionObj.OrgASCChecklist = angular.copy(OrgASCChecklists);

                        angular.forEach(respObj.CheckLists, function (item) {
                            angular.forEach($scope.AdmissionObj.OrgASCChecklist, function (kitem) {
                                if (item.CheckListCategoryId === kitem.CheckListCategoryId && item.CheckListId === kitem.CheckListId) {
                                    item.OrgOrderBy = kitem.OrgOrderBy;
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
                                    kitem.ChecklistTime = item.ChecklistTime || "";
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
                    $scope.AdmissionCheckinObj.OrderedByName = respObj.OrderedByName||'';
                    $scope.AdmissionCheckinObj.OrderedByLicenseNumber = respObj.OrderedByLicenseNumber||'';
                    $scope.AdmissionCheckinObj.OrderedByDateTime = respObj.OrderedByDateTime||null;
                    $scope.AdmissionCheckinObj.IsOrderedByReviewed = respObj.IsOrderedByReviewed||false;
                    $scope.AdmissionCheckinObj.OrderedBy = respObj.OrderedBy||null;

                    $scope.AdmissionCheckinObj.ClinicalVisitTypeName = respObj.ClinicalVisitType || "";
                    $scope.AdmissionCheckinObj.TemplateName = respObj.ASCTemplateName || "";

                    $scope.AdmissionCheckinObj.AccompaniedSignedDateTime = angular.copy(respObj.AccompaniedSignedDateTime) || null;
                    if ($scope.AdmissionCheckinObj.AccompaniedSignedDateTime != null) {
                        $scope.AdmissionCheckinObj.AccompaniedSignedDateTime = $filter('date')($scope.AdmissionCheckinObj.AccompaniedSignedDateTime, "MM-dd-yyyy hh:mm a");
                    }
                    $scope.AdmissionCheckinObj.AccompainedName = angular.copy(respObj.AccompainedName) || '';
                    $scope.AdmissionCheckinObj.AccompaniedSignString = angular.copy(respObj.AccompaniedSign) || '';
                    if ($scope.AdmissionCheckinObj.AccompaniedSignString != '') {
                        $scope.AdmissionCheckinObj.IsAccompaniedSignDone = true;
                        var canvasP1 = document.getElementById("S_AccompaniedBySign");
                        var ctxP1 = canvasP1.getContext("2d");
                        ctxP1.clearRect(0, 0, canvasP1.width, canvasP1.height);
                        var imageP1 = new Image();
                        imageP1.onload = function () {
                            ctxP1.drawImage(imageP1, 0, 0, canvasP1.width, canvasP1.height);
                        };
                        imageP1.src = $scope.AdmissionCheckinObj.AccompaniedSignString;
                    }

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
                    $scope.AdmissionCheckinObj.AdmissionDate = $filter('date')(respObj.AdmissionDate, "MM-dd-yyyy") || '';
                    $scope.AdmissionCheckinObj.AdmittedBy = respObj.AdmittedBy || null;
                    if ($scope.AdmissionCheckinObj.AdmittedBy != null) {
                        $scope.AdmissionCheckinObj.AdmissionTime = respObj.AdmissionTime || "";
                        let ndate = moment().format("YYYY-MM-DD");
                        let edate = ndate + " " + $scope.AdmissionCheckinObj.AdmissionTime;
                        $scope.AdmissionCheckinObj.AdmissionTime = moment(edate, "YYYY-MM-DD hh:mm").format("hh:mm A");


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
                       
                    }
                    $scope.AdmissionCheckinObj.ChunkedClinicalChecklist = [];
                    //let tempArray = $filter('filter')($scope.AdmissionObj.OrgASCChecklist, { 'CheckListCategoryId': 1, 'CheckListSubTypeId': 1 }, true) || [];
                    let tempArray = $scope.AdmissionObj.OrgASCChecklist
                        .filter(item =>
                            item.CheckListCategoryId === 1 &&
                            item.CheckListSubTypeId === 1
                        )
                        .sort((a, b) => a.OrgOrderBy - b.OrgOrderBy);
                    let filteredClinicalChecklist = angular.copy(tempArray);
                    if (filteredClinicalChecklist.length > 0) {
                        let chunkSize = Math.ceil((filteredClinicalChecklist.length) / 2);
                        for (let i = 0; i < filteredClinicalChecklist.length; i += chunkSize) {
                            $scope.AdmissionCheckinObj.ChunkedClinicalChecklist.push(filteredClinicalChecklist.slice(i, i + chunkSize));
                        }
                    }
                }

                if (resp[1].data.SurgeryList.length > 0) {
                    $scope.SurgeryDiagnosisObj.SurgeryName = resp[1].data.SurgeryList[0].SurgeryName || '';
                    $scope.AdmissionCheckinObj.SurgeryList = resp[1].data.SurgeryList || [];
                    $scope.SurgeryDiagnosisObj.SurgeonId = resp[1].data.SurgeryList[0].SurgeonId || 0;
                    $scope.SurgeryDiagnosisObj.InternalCoManagerId = resp[1].data.SurgeryList[0].InternalCoManagerId || 0;
                    $scope.SurgeryDiagnosisObj.ExternalCoManagerId = resp[1].data.SurgeryList[0].ExternalCoManagerId || 0;
                    $scope.SurgeryDiagnosisObj.AnesthetistId = resp[1].data.SurgeryList[0].AnesthetistId || 0;
                    $scope.SurgeryDiagnosisObj.ExternalCoManagerName = resp[1].data.SurgeryList[0].ExternalCoManagerName || '';
                    $scope.SurgeryDiagnosisObj.OrganId = resp[1].data.SurgeryList[0].OrganId || null;

                    var SurgeonObj = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.SurgeryDiagnosisObj.SurgeonId }, true)[0] || [];
                    $scope.SurgeryDiagnosisObj.SurgeonName = SurgeonObj.UserFullName || '';

                    var AnesthetistObj = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.SurgeryDiagnosisObj.AnesthetistId }, true)[0] || [];
                    $scope.SurgeryDiagnosisObj.AnesthesistName = AnesthetistObj.UserFullName || '';

                    var InternalCoManagerObj = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.SurgeryDiagnosisObj.InternalCoManagerId }, true)[0] || [];
                    $scope.SurgeryDiagnosisObj.InternalCoManagerName = InternalCoManagerObj.UserFullName || '';

                    //if ($scope.ReferalPCPDoctorsList.length > 0) {
                    //    var ExternalCoManagerObj = $filter('filter')($scope.ReferalPCPDoctorsList, { 'DoctorID': $scope.SurgeryDiagnosisObj.ExternalCoManagerId }, true)[0] || [];
                    //    $scope.SurgeryDiagnosisObj.ExternalCoManagerName = ExternalCoManagerObj.FullName || '';
                    //}

                  
                }

                $scope.SurgeryDiagnosisObj.PreAdmissionStatus = resp[1].data.PreAdmissionStatus || '';
                $scope.SurgeryDiagnosisObj.CardialogistStatus = resp[1].data.CardialogistStatus || '';
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
            if (resp[2].data.OrderDetails.length > 0) {
                $scope.AdmissionCheckinObj.OrderDetails = angular.copy(resp[2].data.OrderDetails);
                $scope.SetSurgeonCredentials($scope.AdmissionCheckinObj.OrderDetails);
            }
            if ($scope.AdmissionCheckinObj.OrderDetails.length > 0) {
                var AdmitPresCount = 0;
                var AdmitInvesCount = 0;
                var AdmitGeneralCount = 0;
                var AdmitPhyPresCount = 0;
                var AdmitPhyGeneralCount = 0;
                var AdmitPhyInvesCount = 0;
                angular.forEach($scope.AdmissionCheckinObj.OrderDetails, function (item) {

                    //if (item.PrescriptionArray.length > 0) {
                    //    AdmitPresCount++;
                    //};
                    //if (item.Investigationslist.length > 0) {
                    //    AdmitInvesCount++;
                    //};
                    //if (item.GeneralOrders.length > 0) {
                    //    AdmitGeneralCount++;
                    //};

                    if (item.MedTypeId == 7) {
                        if (item.PrescriptionArray.length > 0) {
                            AdmitPresCount++;
                        };
                        if (item.Investigationslist.length > 0) {
                            AdmitInvesCount++;
                        };
                        if (item.GeneralOrders.length > 0) {
                            AdmitGeneralCount++;
                        };
                    };
                    if (item.MedTypeId == 6) {
                        if (item.PrescriptionArray.length > 0) {
                            AdmitPhyPresCount++;
                        };
                        if (item.Investigationslist.length > 0) {
                            AdmitPhyInvesCount++;
                        };
                        if (item.GeneralOrders.length > 0) {
                            AdmitPhyGeneralCount++;
                        };
                    }

                });
                if (AdmitPresCount !== 0) {
                    $scope.IsAdmitMedications = true;
                } else {
                    $scope.IsAdmitMedications = false;
                };

                if (AdmitGeneralCount !== 0) {
                    $scope.IsAdmitGenOrders = true;
                } else {
                    $scope.IsAdmitGenOrders = false;
                };
                if (AdmitInvesCount !== 0) {
                    $scope.IsAdmitInvestigation = true;
                } else {
                    $scope.IsAdmitInvestigation = false;
                };
                if (AdmitPhyPresCount !== 0) {
                    $scope.IsAdmitPhyMedications = true;
                } else {
                    $scope.IsAdmitPhyMedications = false;
                };

                if (AdmitPhyInvesCount !== 0) {
                    $scope.IsAdmitPhyInvestigation = true;
                } else {
                    $scope.IsAdmitPhyInvestigation = false;
                };
                if (AdmitPhyGeneralCount !== 0) {
                    $scope.IsAdmitPhyGenOrders = true;
                } else {
                    $scope.IsAdmitPhyGenOrders = false;
                };
            } else {
                $scope.AdmissionCheckinObj.OrderDetails = [];
                $scope.IsAdmitMedications = false;
                $scope.IsAdmitGenOrders = false;
                $scope.IsAdmitInvestigation = false;
                $scope.IsAdmitPhyMedications = false;
                $scope.IsAdmitPhyGenOrders = false;
                $scope.IsAdmitPhyInvestigation = false;

            }

            $scope.cacheStorageItem.CopiedPreviousAppointmentId = $scope.cacheStorageItem.CopiedPreviousAppointmentId || 0;
            $scope.cacheStorageItem.PreAdmAppointmentId = $scope.cacheStorageItem.PreAdmAppointmentId || 0;

            if ($scope.cacheStorageItem.CopiedPreviousAppointmentId !== 0) {
                $scope.GetAppointmentImages($scope.cacheStorageItem.CopiedPreviousAppointmentId);
            };
            if ($scope.cacheStorageItem.PreAdmAppointmentId !== 0) {
                $scope.GetAppointmentImages($scope.cacheStorageItem.PreAdmAppointmentId);
            };

        });
    };

    $scope.yagPreOpOrgASCChecklist = [];
    $scope.yagPreOpVitalsArray = [];
    $scope.yagPreOpDilationMedications = [];
    $scope.yagIntraOpOrgASCChecklist = [];
    $scope.yagAnesthesiaTypelist = [];
    $scope.yagIntraOpOrderDetails = [];
    $scope.yagPostOpOrgASCChecklist = [];
    $scope.yagPostOpVitalsArray = [];
    $scope.IsShowPreopMedications = false;
    $scope.IsShowPreopCustomMedications = false;
    $scope.IsShowIntraopMedications = false;
    $scope.IsShowIntraopCustomMedications = false;
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

            if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
                if ($scope.cacheStorageItem.PreAdmAppointmentId == null) {
                    alertify.error("This Patient has no Pre-admission appointment !");
                    return false;
                }
            }

            $scope.SubTab = 2;
            $scope.GetPreAdmissionDetails();
           
        } else if (value == 3) {

            if ($scope.SelectedAppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.AscAppointmentId == null) {
                    alertify.error("This Patient has no ASC appointment !");
                    return false;
                }
            }

            $scope.GetMasterAldreteScoreDetails();
            $scope.GetPreOpChartData();
            $scope.GetPreAdmissionDetails();
            $scope.GetFaceSheetDetails();
            $scope.GetPentacomImageDetails();
            $scope.SubTab = 3;
        } else if (value == 4) {

            if ($scope.SelectedAppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.AscAppointmentId == null) {
                    alertify.error("This Patient has no ASC appointment !");
                    return false;
                }
            }

            $scope.GetASCIntraOpDetails();
            $scope.SubTab = 4;
        } else if (value == 5) {

            if ($scope.SelectedAppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.AscAppointmentId == null) {
                    alertify.error("This Patient has no ASC appointment !");
                    return false;
                }
            }

            $scope.GetPostOpChartData();
            $scope.SubTab = 5;
        } else if (value == 6) {
            if ($scope.SelectedAppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.AscAppointmentId == null) {
                    alertify.error("This Patient has no ASC appointment !");
                    return false;
                }
            }
            $scope.GetDischargeData();
            $scope.SubTab = 6;
        } else if (value == 7) {

            if ($scope.SelectedAppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.AscAppointmentId == null) {
                    alertify.error("This Patient has no ASC appointment !");
                    return false;
                }
            }

            $scope.GetOperativeNotesDetails();
            $scope.SubTab = 7;
        } else if (value == 8) {

            if ($scope.SelectedAppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.AscAppointmentId == null) {
                    alertify.error("This Patient has no ASC appointment !");
                    return false;
                }
            }

            $scope.GetASCAdmissionDetails();
            $scope.SubTab = 8;
        } else if (value == 9) {
            if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
                if ($scope.cacheStorageItem.PreAdmAppointmentId == null) {
                    alertify.error("This Patient has no Pre-admission appointment !");
                    return false;
                }
            }
            $scope.GetPreAdmissionCardiologistDetails();
            $scope.SubTab = 9;
        } else if (value == 10) {
            if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
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
        }
        else if (value == 12) {
            $scope.GetFemtoTemplateChartData();
            $scope.SubTab = 12;
        } else if (value == 13) {
            $scope.GetPreAdmCoordinatorData();
            $scope.SubTab = 13;
        } else if (value == 14) {
            $scope.SubTab = 14;
            getYagTemplateSummaryData()
        } else if (value == 15) {
            getAppointmentSuperBillDetails();
            $scope.SubTab = 15;
        }
        else if (value == 16) {
            getLasikTemplateSummaryData();
            $scope.SubTab = 16;
        }
        else {
            $scope.SubTab = value;
        }
    };

    //if ($scope.SubTabId == 1) {
    //    $scope.MasterReferralSource();
    //    $scope.SelectPatient();
    //    $scope.getApptAdditionalDetails();
    //    $scope.SelectAppointment();
    //    $scope.SubTab = 1;
    //} else {
    //    $scope.SubTab = $scope.SubTabId;
    //}
    function processVitalsArray(vitalsArray) {
        let ndate = moment().format("YYYY-MM-DD");
        const vitalOrder = [11, 12, 4, 5, 14, 15, 8, 66];
        return vitalsArray.map(item => {
            const systolicList = item.Vitals.filter(v => v.VitalId === 4);
            const diastolicList = item.Vitals.filter(v => v.VitalId === 5);
            const otherVitals = item.Vitals.filter(v => v.VitalId !== 4 && v.VitalId !== 5);
            const pairCount = Math.min(systolicList.length, diastolicList.length);
            const bpVitals = [];
            for (let i = 0; i < pairCount; i++) {
                bpVitals.push({
                    VitalDesc: "BP",
                    VitalId: 4,
                    UnitTypeName: systolicList[i].UnitTypeName || diastolicList[i].UnitTypeName || "mmHg",
                    Value: systolicList[i].Value + "/" + diastolicList[i].Value
                });
            }
            const edate = ndate + " " + item.VitalAddTime;
            item.VitalAddTime = moment(edate, "YYYY-MM-DD hh:mm").format("hh:mm A");
            let normalizedVitals = [...bpVitals, ...otherVitals].map(subitem => ({
                VitalDesc: subitem.VitalDesc,
                VitalId: subitem.VitalId,
                UnitTypeName: subitem.UnitTypeName,
                Value: subitem.Value
            }));
            normalizedVitals.sort((a, b) => {
                let aIndex = vitalOrder.indexOf(a.VitalId);
                let bIndex = vitalOrder.indexOf(b.VitalId);
                return aIndex - bIndex;
            });

            item.Vitals = normalizedVitals;
            return item;
        });
    }

    $scope.IntraOpYagFireRiskChecklistdata = [];

    function getYagTemplateSummaryData() {
        let req1 = {
            "ParentOrganizationId": $scope.ParenthospitalId,
            "CheckListModuleId": 1,
            "GetAllIndicator": 1
        };
        let req2 = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": $scope.SelectedAppointmentId || null,
            "PatientId": $scope.SelectedPatientID || null,
        };
        $scope.yagTemplateSummaryData = [];
        $q.all([
            eHnoteSurgeryService.GetOrganizationASCCheckListData(req1),
            eHnoteSurgeryService.GetPreOPYagTemplateChartData(req2),
            eHnoteSurgeryService.GetIntraOPYagTemplateChartData(req2),
            eHnoteSurgeryService.GetPostOPYagTemplateChartData(req2)]).then(function (resp) {
                if (resp[0].data.status === "Success") {
                    if (resp[0].data.rows.length > 0) {
                        $scope.IntraOpYagFireRiskChecklistdata = resp[0].data.rows;
                        angular.forEach($scope.IntraOpYagFireRiskChecklistdata, function (item) {
                            angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                                kitem.IsChecked = false;
                            });
                        });
                    }
                }
                if (resp[1].data.status === "Success") {
                    if (resp[1].data.rows.length > 0) {
                        let yagTempData = angular.copy(resp[1].data.rows[0]) || {};
                        $scope.yagPreOPLastSignOffUserDeatils = resp[1].data.LastSignOffUserDetails || [];
                        handlePreOPYagTemplateSummary(yagTempData)
                    }
                }
                if (resp[2].data.status === "Success") {
                    if (resp[2].data.rows.length > 0) {
                        let data = angular.copy(resp[2].data.rows[0]) || {};
                        $scope.yagIntraOPLastSignOffUserDeatils = resp[2].data.LastSignOffUserDetails || [];
                        handleIntraOPYagTemplateSummary(data)
                    }
                }
                if (resp[3].data.status === "Success") {
                    if (resp[3].data.rows.length > 0) {
                        let data = angular.copy(resp[3].data.rows[0]) || {};
                        $scope.yagPostOPLastSignOffUserDeatils = resp[3].data.LastSignOffUserDetails || [];
                        handlePostOPYagTemplateSummary(data)
                    }
                }

                $scope.IsShowPreopMedications = $scope.yagPreOpDilationMedications.length == 0 || $scope.yagPreOpDilationMedications.every(
                    mitem => mitem.DilationMedications.length === 0
                );

                $scope.IsShowPreopCustomMedications = $scope.yagPreOpDilationMedications.length == 0 || $scope.yagPreOpDilationMedications.every(
                    mitem => mitem.GeneralOrders.length === 0
                );
                $scope.IsShowIntraopMedications = $scope.yagIntraOpOrderDetails.length == 0 || $scope.yagIntraOpOrderDetails.every(
                    mitem => mitem.IntraOpMedications.length === 0
                );

                $scope.IsShowIntraopCustomMedications = $scope.yagIntraOpOrderDetails.length == 0 || $scope.yagIntraOpOrderDetails.every(
                    mitem => mitem.GeneralOrders.length === 0
                );

            })       
       
    }
   
    function handlePreOPYagTemplateSummary(data) {
        $scope.yagPreOPTemplateSummaryData = data || {};
        $scope.yagPreOpOrgASCChecklist = data?.OrgASCChecklist || [];
        $scope.yagPreOpVitalsArray = processVitalsArray(data.PreOpVitalsArray || []) || [];
        $scope.yagPreOpDilationMedications = data?.PreOpOrderDetails || [];
        $scope.SetSurgeonCredentials($scope.yagPreOpDilationMedications);

    }
    function handleIntraOPYagTemplateSummary(data) {
        $scope.yagIntraOPTemplateSummaryData = data || {};
        $scope.yagIntraOpOrgASCChecklist = data?.OrgASCChecklist || [];
        $scope.yagAnesthesiaTypelist = data?.AnesthesiaTypelist || [];
        $scope.yagIntraOpOrderDetails = data?.IntraOpOrderDetails || []
        $scope.SetSurgeonCredentials($scope.yagIntraOpOrderDetails);


        if (data.OrgASCChecklist.length > 0) {
            angular.forEach(data.OrgASCChecklist, function (item) {
                angular.forEach($scope.IntraOpYagFireRiskChecklistdata, function (kitem) {
                    if (kitem.CheckListCategoryId === item.CheckListCategoryId) {
                        if (kitem.CheckListId === item.CheckListId) {
                            kitem.IsChecked = true;
                            kitem.Score = item.Score || 0;
                            kitem.Value = item.Value || '';
                            kitem.Remarks = item.Remarks || '';
                            if (kitem.Remarks != "") {
                                kitem.shownotes = true;
                            }
                            kitem.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;

                            if (item.SubCheckList.length > 0) {
                                angular.forEach(item.SubCheckList, function (Aitem) {
                                    angular.forEach(kitem.SubCheckList, function (Bitem) {
                                        if (Aitem.SubCheckListId == Bitem.SubCheckListId) {
                                            Bitem.PatientAscCheckListDetailId = Aitem.PatientAscCheckListDetailId || 0;
                                            Bitem.PatientAscSubCheckListId = Aitem.PatientAscSubCheckListId || 0;
                                            Bitem.IsChecked = true;
                                        }
                                    });
                                });
                            }

                        }
                    }
                });
            });
        }
    }
    function handlePostOPYagTemplateSummary(data) {
        $scope.yagPostOPTemplateSummaryData = data || {};
        $scope.yagPostOpOrgASCChecklist = data?.OrgASCChecklist || [];
        $scope.yagPostOpVitalsArray = processVitalsArray(data?.PostOpVitalsArray || []) || [];
    }
    $scope.GetASCAppointmentDetailsById = function () {
        let PatientSurgeryId = null;
        if ($scope.SelectedAppointmentTypeId == 7) {
            //if ($scope.cacheStorageItem.PreAdmSurgeryList.length > 0) {
            //    PatientSurgeryId = $scope.cacheStorageItem.PreAdmSurgeryList[0].PatientSurgeryId;
            //}
        } else if ($scope.SelectedAppointmentTypeId == 4 || $scope.SelectedAppointmentTypeId == 14) {
            if ($scope.cacheStorageItem.SurgeryList.length > 0) {
                PatientSurgeryId = $scope.cacheStorageItem.SurgeryList[0].PatientSurgeryId;
            }
        }

        var params = {
            "AppointmentId": $scope.SelectedAppointmentId || null,
            "AppointmentTypeId": $scope.SelectedAppointmentTypeId,
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
    //$scope.GetASCAppointmentDetailsById();

    $scope.init();


    $scope.FaceSheetAppointmentTypeId = $scope.SelectedAppointmentTypeId;

    if ($scope.SelectedAppointmentTypeId == 7 || $scope.SelectedAppointmentTypeId == 6) {
        $scope.FaceSheetAppointmentId = $scope.cacheStorageItem.AscAppointmentId;
        $scope.FaceSheetAppointmentTypeId = 4;
    } else {
        $scope.FaceSheetAppointmentId = $scope.SelectedAppointmentId;
       
    }

    //if ($scope.cacheStorageItem.AppointmentType == "Pre-Op" || $scope.cacheStorageItem.AppointmentType == "ASC") {
    //    $scope.FaceSheetAppointmentId = $scope.cacheStorageItem.AscAppointmentId;
    //    $scope.FaceSheetAppointmentTypeId = 4;
    //}

    $scope.GetFaceSheetDetails = function () {
        $scope.FaceSheetSummaryObj = $scope.GetFaceSheetSummaryObj;
        let req = {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": $scope.SelectedAppointmentId || 0,
            "PatientId": $scope.SelectedPatientID || 0,
            "AppointmentTypeId": $scope.FaceSheetAppointmentTypeId,
        };
        eHnoteSurgeryService.GetAppointmentFaceSheetData(req).then(function (resp) {
            if (resp.data.Status === "Success") {
                $scope.FaceSheetSummaryObj.PatientData = resp.data.PatientData || [];
                $scope.FaceSheetSummaryObj.CurrentAppointmentVital = resp.data.CurrentAppointmentVital || '';
                $scope.FaceSheetSummaryObj.LatestAppointmentVital = resp.data.LatestAppointmentVital || '';
                $scope.FaceSheetSummaryObj.LastSignOffUserDetails = resp.data.LastSignOffUserDetails || [];
                $scope.FaceSheetSummaryObj.FaceSheetChartStatus = '';

                $scope.IntraOpCDE = resp.data.IntraOpCDE || [];
                $scope.PreOpPupliSize = resp.data.PreOpPupliSize || [];             
                //$scope.AllergyItems = resp.data.AllergyItemsArray || [];
                $scope.AllergyItems = [];
                resp.data.AllergyItemsArray = resp.data.AllergyItemsArray || [];
                if (resp.data.AllergyItemsArray.length>0) {
                    angular.forEach(resp.data.AllergyItemsArray, function (item) {
                        if (item.StatusId == 1 || item.AllergyId == 1 || item.AllergyId == 2) {
                            $scope.AllergyItems.push(item);
                        }
                    });
                }

                $scope.FaceSheetSummaryObj.ImplantsDetailsArray = resp.data.ImplantsDetailsArray || [];

                var TempArray1 = $filter("filter")($scope.FaceSheetSummaryObj.ImplantsDetailsArray, function (kitem) { return kitem.AppointmentId == $scope.FaceSheetAppointmentId }, true);
                var TempArray2 = $filter("filter")($scope.FaceSheetSummaryObj.ImplantsDetailsArray, function (kitem) { return kitem.AppointmentId !== $scope.FaceSheetAppointmentId }, true);

                if (TempArray1.length > 0) {
                    angular.forEach(TempArray1, function (item) {
                        if (item.OrganId == 1) {
                            $scope.PreviousValuesObj.ODLensUsed = item.Power || '';
                        } else if (item.OrganId == 2) {
                            $scope.PreviousValuesObj.OSLensUsed = item.Power || '';
                        }
                    });
                }
                if (TempArray2.length > 0) {
                    angular.forEach(TempArray2, function (sitem) {
                        if (sitem.OrganId == 1) {
                            $scope.PreviousValuesObj.PreviousODIOLPower = sitem.Power || '';
                        } else if (sitem.OrganId == 2) {
                            $scope.PreviousValuesObj.PreviousOSIOLPower = sitem.Power || '';
                        }
                    });
                }

                resp.data.PreviousAppointmentFaceSheetData = resp.data.PreviousAppointmentFaceSheetData || [];
                if (resp.data.PreviousAppointmentFaceSheetData.length > 0) {
                    angular.forEach(resp.data.PreviousAppointmentFaceSheetData, function (item) {
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

                    $scope.FaceSheetSummaryObj.CurrentAppointmentVital.Height = $scope.FaceSheetSummaryObj.CurrentAppointmentVital.Height || '';
                    $scope.FaceSheetSummaryObj.CurrentAppointmentVital.HeightUnit = $scope.FaceSheetSummaryObj.CurrentAppointmentVital.HeightUnit || '';
                    $scope.FaceSheetSummaryObj.CurrentAppointmentVital.Weight = $scope.FaceSheetSummaryObj.CurrentAppointmentVital.Weight || '';
                    $scope.FaceSheetSummaryObj.CurrentAppointmentVital.WeightUnit = $scope.FaceSheetSummaryObj.CurrentAppointmentVital.WeightUnit || '';

                    if (($scope.cacheStorageItem.AppointmentId == $scope.FaceSheetSummaryObj.CurrentAppointmentVital.AppointmentId) && ($scope.FaceSheetSummaryObj.CurrentAppointmentVital.Height !== '' || $scope.FaceSheetSummaryObj.CurrentAppointmentVital.HeightUnit !== '' || $scope.FaceSheetSummaryObj.CurrentAppointmentVital.Weight !== '' || $scope.FaceSheetSummaryObj.CurrentAppointmentVital.WeightUnit !== '')) {
                        $scope.FaceSheetSummaryObj.PatientData[0].Height = $scope.FaceSheetSummaryObj.CurrentAppointmentVital.Height || '';
                        $scope.FaceSheetSummaryObj.PatientData[0].HeightUnit = $scope.FaceSheetSummaryObj.CurrentAppointmentVital.HeightUnit || '';
                        $scope.FaceSheetSummaryObj.PatientData[0].Weight = $scope.FaceSheetSummaryObj.CurrentAppointmentVital.Weight || '';
                        $scope.FaceSheetSummaryObj.PatientData[0].WeightUnit = $scope.FaceSheetSummaryObj.CurrentAppointmentVital.WeightUnit || '';
                    } else {
                        $scope.FaceSheetSummaryObj.PatientData[0].Height = $scope.FaceSheetSummaryObj.LatestAppointmentVital.Height || '';
                        $scope.FaceSheetSummaryObj.PatientData[0].HeightUnit = $scope.FaceSheetSummaryObj.LatestAppointmentVital.HeightUnit || '';
                        $scope.FaceSheetSummaryObj.PatientData[0].Weight = $scope.FaceSheetSummaryObj.LatestAppointmentVital.Weight || '';
                        $scope.FaceSheetSummaryObj.PatientData[0].WeightUnit = $scope.FaceSheetSummaryObj.LatestAppointmentVital.WeightUnit || '';
                    }
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
                                $scope.FaceSheetSummaryObj.SurgeonName = Internallist[0].UserFullName || '';
                                //if (Internallist[0].SuffixId == 10) {
                                //    $scope.FaceSheetSummaryObj.SurgeonName = ' Dr. ' + $scope.FaceSheetSummaryObj.SurgeonName;
                                //}
                                //if (Internallist[0].SuffixName !== '') {
                                //    $scope.FaceSheetSummaryObj.SurgeonName = $scope.FaceSheetSummaryObj.SurgeonName + ' ' + Internallist[0].SuffixName;
                                //}
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
                    //$scope.FaceSheetSummaryObj.PreviousCDAValue = resp.data.AppointmentFaceSheetData[0].PreviousCDAValue || "";
                    $scope.FaceSheetSummaryObj.SurgeonVerifiedUserId = resp.data.AppointmentFaceSheetData[0].SurgeonVerifiedUserId || null;
                   // $scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate = resp.data.AppointmentFaceSheetData[0].PreviousCDAValueGivenDate || null;

                    //if ($scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate != '' && $scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate != null) {
                    //    /*  $scope.FaceSheetObj.PreviousCDAValueGivenDate = $filter('date')($scope.FaceSheetObj.PreviousCDAValueGivenDate, "MM-dd-yyyy");*/
                    //    $scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate = moment($scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate).format("MM-DD-YYYY");

                    //}

                    if (resp.data.LatestAppointmentCDE.length > 0) {
                        //$scope.FaceSheetSummaryObj.PreviousCDAValue = resp.data.LatestAppointmentCDE[0].Value || "";
                       // $scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate = resp.data.LatestAppointmentCDE[0].ModifiedDt || null;

                        //if ($scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate != '' && $scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate != null) {   /*  $scope.FaceSheetObj.PreviousCDAValueGivenDate = $filter('date')($scope.FaceSheetObj.PreviousCDAValueGivenDate, "MM-dd-yyyy");*/
                        //    $scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate = moment($scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate).format("MM-DD-YYYY");

                        //}


                        $scope.FaceSheetSummaryObj.PreviousCDAODValue = resp.data.LatestAppointmentCDE[0].ODValue || "";
                        $scope.FaceSheetSummaryObj.PreviousCDAOSValue = resp.data.LatestAppointmentCDE[0].OSValue || "";
                        $scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate = resp.data.LatestAppointmentCDE[0].ModifiedDt || null;

                        if ($scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate != '' && $scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate != null) {
                            /*  $scope.FaceSheetObj.PreviousCDAValueGivenDate = $filter('date')($scope.FaceSheetObj.PreviousCDAValueGivenDate, "MM-dd-yyyy");*/
                            $scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate = moment($scope.FaceSheetSummaryObj.PreviousCDAValueGivenDate).format("MM-DD-YYYY");

                        }
                    }

                    //$scope.obj.FaceSheetChartStatus = resp.data.AppointmentFaceSheetData[0].FaceSheetChartStatus;
                    $scope.FaceSheetSummaryObj.FaceSheetChartStatus = resp.data.AppointmentFaceSheetData[0].FaceSheetChartStatus;
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


                if ($scope.IntraOpCDE.length > 0) {
                    $scope.FaceSheetSummaryObj.FaceSheetCheckList = $scope.FaceSheetSummaryObj.FaceSheetCheckList || '';
                    if ($scope.FaceSheetSummaryObj.FaceSheetCheckList.length > 0) {
                        angular.forEach($scope.FaceSheetSummaryObj.FaceSheetCheckList, function (item) {
                            if (item.SurgeonVerification.length > 0) {
                                angular.forEach(item.SurgeonVerification, function (sitem) {
                                    if (sitem.MasterFaceSheetId == 6) {
                                        var temparray1 = $filter("filter")(item.SurgeonVerification, function (kitem, index) { return (kitem.MasterFaceSheetId == 6) && (kitem.Value != '' || kitem.VerifiedUserId != null) }) || [];

                                        if (temparray1.length == 0) {


                                            if (item.OrganId == 1) {
                                                sitem.Value = $scope.IntraOpCDE[0].CDEOD || '';
                                            } else {
                                                sitem.Value = $scope.IntraOpCDE[0].CDEOS || '';
                                            }
                                            sitem.Remarks = $scope.IntraOpCDE[0].CDERemarks || '';


                                            sitem.IsShowNotes = false;
                                            if (sitem.Remarks != '') {
                                                sitem.IsShowNotes = true;
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
                if ($scope.PreOpPupliSize.length > 0) {
                    $scope.FaceSheetSummaryObj.FaceSheetCheckList = $scope.FaceSheetSummaryObj.FaceSheetCheckList || '';
                    if ($scope.FaceSheetSummaryObj.FaceSheetCheckList.length > 0) {
                        angular.forEach($scope.FaceSheetSummaryObj.FaceSheetCheckList, function (item) {
                            if (item.SurgeonVerification.length > 0) {
                                angular.forEach(item.SurgeonVerification, function (sitem) {
                                    if (sitem.MasterFaceSheetId == 2) {
                                        var temparray1 = $filter("filter")(item.SurgeonVerification, function (kitem, index) { return (kitem.MasterFaceSheetId == 2) && (kitem.ODValue != '' || kitem.OSValue != '') }) || [];
                                        if (temparray1.length == 0) {                                   
                                            sitem.ODValue = $scope.PreOpPupliSize[0].ODPupilSize || '';
                                            sitem.OSValue = $scope.PreOpPupliSize[0].OSPupilSize || '';
                                            sitem.VerifiedUserId = $scope.PreOpPupliSize[0].DilationReviewId || null;
                                            sitem.Remarks = $scope.PreOpPupliSize[0].DilationMedicationsNotes || '';

                                            sitem.IsShowNotes = false;
                                            if (sitem.Remarks != '') {
                                                sitem.IsShowNotes = true;
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                }

            }
        });
    }

    $scope.GetPentacomImageDetails = function () {

        $scope.cacheStorageItem.AscAppointmentId = $scope.cacheStorageItem.AscAppointmentId || 0;
        
        var pentacamgetReq = {
            "PatientId": $scope.SelectedPatientID,
            "AppointmentId": $scope.SelectedAppointmentId,
            "InvestigationId": 1155
        }
        eHnoteSurgeryService.getPatientApptPentacamfiles(pentacamgetReq).then(function (resp) {
            if (resp.data.Status == "Success") {

                $scope.pentaCamFilesArray = [];
                if (resp.data.rows.length > 0) {
                    $scope.pentaCamFilesArray = resp.data.rows || [];
                }
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
                $scope.cacheStorageItem.CopiedPreviousAppointmentId = $scope.cacheStorageItem.CopiedPreviousAppointmentId || 0;
                $scope.cacheStorageItem.PreAdmAppointmentId = $scope.cacheStorageItem.PreAdmAppointmentId || 0;

                if ($scope.cacheStorageItem.CopiedPreviousAppointmentId !== 0) {
                    $scope.GetAppointmentImages($scope.cacheStorageItem.CopiedPreviousAppointmentId);
                };
                if ($scope.cacheStorageItem.PreAdmAppointmentId !== 0) {
                    $scope.GetAppointmentImages($scope.cacheStorageItem.PreAdmAppointmentId);
                };

            }
        });
    }

    $scope.FireRisksublistPopover = {
        templateUrl: 'FireRiskAssessmentsublistPopover_PV.html',
    };

    $scope.FireRiskAssessmentsublistPopoverClick = function (item) {
        $scope.popOverhtmlContent = "";
        item.Description = item.Description || "";
        if (item.Description != "") {
            $scope.popOverhtmlContent = $sce.trustAsHtml(item.Description);
        }

    };
    $scope.DoctorNotesClick = function () {    
        $scope.PreopNurseAnestiatab = 3;
        $scope.GetFaceSheetDetails();
        $scope.GetPentacomImageDetails();
    };

    $scope.VitalNotesObj = {
        "VitalNotesArray": []
    }

    $scope.OpenVitalNotespopover = {
        templateUrl: 'VitalNotesPopover.html',
    };

    $scope.ShowVitalsRemarks = function (item) {
        item.IsShowVitalRemarks = true;
        $scope.VitalNotesObj.VitalNotesArray = angular.copy(item);
    };

    $scope.SuperBillArray = [];
    $scope.SuperBillRemarks = "";
    function getAppointmentSuperBillDetails() {
        eHnoteDiagnosisDataServices.GetSuperBillDetailsByAppointmentId($scope.SelectedAppointmentId, $scope.SelectedVisitId).then(function (response) {
            console.log(response);
            if (response.data.Status == "Success") {
                if (response.data.rows.length > 0) {
                    let superbillitem = response.data.rows[0];
                    $scope.SuperBillArray = superbillitem.SuperBillArray || [];
                    $scope.SuperBillRemarks = superbillitem.SuperBillRemarks || "";
                }
            }
        });
    };


    /*Lasik Summary Start*/
    $scope.GetLasikTempObj = function () {
        return {
            "LasikTemplateId": null,
            "SurgeryCategoryId": null,
            "IsLasikSummaryInd": false,
            "Patientpresentsalone": "",
            "RecievedForSurgery": "",
            "CheckInChecklist": [],
            "OtherCheckInChecklist": [],
            "OrgASCChecklist": [],
            "DilationMedications": [],
            "PostOpMedications": [],
            "PreOpMedications": [],
            "IntraopOrgASCChecklist": [],
            "ImplementedFallRiskProtocol": false,
            "ImplementedFallRiskProtocoltype": '',
            "FallRiskAssessmentTotalScore": null,
            "FallRiskLevel": "",
            "NurseFallRiskID": "",
            "AccompainedBy": "",
            "AccompainedByNotes": "",
            "AccompainedName": "",
            "FamilyRelationId": null,
            "FamilyRelationName": "",
            "AccompainedTel": "",
            "RecievedForSurgeryNotes": "",
            "AccompainedByNotesInd": false,
            "RecievedForSurgeryNotesInd": false,
            "BP": "",
            "BPDiastolic": "",
            "Pulse": "",
            "VAOD": "",
            "VAOS": "",
            "IOPOD": "",
            "IOPOS": "",
            "IOPTime": "",
            "IOPOD": "",
            "IOPOS": "",
            "IOPTime": "",
            "IOPResultAssessment": "",
            "IOPActionTaken": "",
            "IOPReEval": "",
            "IOPReEvalTime": "",
            "CorneaOD": "",
            "CorneaOS": "",
            "InitialClinicalOther": "",
            "Describe": "",
            "AdverseEventDescription": "",
            "OrderType": 'Medications',
            "PostOrderType": 'Medications',
            "PreOpNotes": "",
            "IntraOpNotes": "",
            "PostOpNotes": "",
            "SurgeryStartTime": "",
            "SurgeryEndTime": "",
            "HallEntranceStartTime": "",
            "HallEntranceEndTime": "",
            "EquipmentId": "",
            "EquipmentName": "",
            "ODSph": "",
            "ODCyl": "",
            "ODAxis": "",
            "ODOpticalZone": "",
            "ODTreatmentZone": "",
            "OSSph": "",
            "OSCyl": "",
            "OSAxis": "",
            "OSOpticalZone": "",
            "OSTreatmentZone": "",
            "Periocularwashwithiodopovidone": "",
            "OrderDetails": [
                {
                    "UserOrderId": 0,
                    "UserId": $scope.UserId,
                    "DeleteInd": "N",
                    "IsOrderReviewed": false,
                    "ReviewedByPassword": '',
                    "ReviewedByDateTime": null,
                    "ReviewedBy": null,
                    "UserType": "Nurse",
                    "ScreenType": "PreOp",
                    "ScreenTypeId": 4,
                    "MedTypeId": null,
                    "MedTypeName": '',
                    "DilationMedications": [],
                    "GeneralOrders": [],
                    "PreOpMedications": [],
                    "PostOpMedications": [],
                    "OrderTypeId": 2,
                    "OrderTypeName": "Live Medications"
                }
            ],

            /* ---------- DISCHARGE ---------- */
            "IsAlertOrientedX3": false,
            "IsPhysicianExaminedSafeForDischarge": false,
            "DischargeVASScore": null,
            "BandageProtector": "",
            "BandageProtectorOther": "",
            "IsDischargeHomeWithAdult": false,

            "ResponsibleAdultName": "",
            "PostOpNotes": "",
            "FollowUpDate2Ind": false,
            "FollowUpDate3Ind": false,
            "FollowUpDate1": "",
            "FollowUpDate2": "",
            "FollowUpDate3": "",
            "SecondFollowupAppointmentId": 0,
            "ThirdFollowupAppointmentId": 0,

            /* Sign-off */
            "NurseReviewedById": null,
            "NurseReviewedByName": '',
            "NurseReviewedLicenseNumber": '',
            "NurseReviewedDate": '',
            "DoctorReviewedById": null,
            "DoctorReviewedByName": '',
            "DoctorReviewedLicenseNumber": '',
            "DoctorReviewedDate": '',

            "IsClickSaveLasikBtn": false,
            "StatusFlag": "D",
            "SignOffUserId": null,
            "LastSignOffUserDetails": [],
            "IsPostProcedureLevelOfCooperation": false,
            "RightEyeOD": false,
            "LeftEyeOS": false,
            "IOPReEvalOD": null,
            "IOPReEvalOS": null,
            "HeadFixation": "",
            "IsLateralSupportsUsed": false,
            "IsVacuumPillowUsed": false
        };
    };
    $scope.LasikTempObj = angular.copy($scope.GetLasikTempObj());

    $scope.GetSummaryObj = function () {
        return {
            "OrderDetails": [],   // MedTypeId 2  (surgeon / dilation orders)
            "PreOpMedRows": [],   // MedTypeId 2  (surgeon / dilation orders)
            "PostOpMedRows": [],  // MedTypeId 5  (post-op orders)
            "PreOpChecklist": [], // check-in list rows that have a value
            "OtherChecklist": [],
            "DISCHARGEChecklist": [], // check-out list rows (CheckListCategoryId 31)
            "FallRiskRows": [],
            "IntraopRows": [],
            "PostopStatusRows": [],
            "AdverseEventsRows": [],
            "PatientPositionLasikRows": []
        };
    };
    $scope.SummaryObj = $scope.GetSummaryObj();

    /* The LASIK chart is stored as one row per phase - TypeId 1 Pre-Op,
       2 Intra-Op, 3 Post-Op - so the quick summary shows the three phases as
       tabs, each one rendering its own row. The summary markup keeps reading
       LasikTempObj / SummaryObj: switching a tab only swaps which phase's
       objects those two names point at. */
    $scope.LasikTemplateTypes = {
        "PreOp": { "Key": "PreOp", "TypeId": 1, "TypeName": "Pre-Op", "Tab": "preop" },
        "IntraOp": { "Key": "IntraOp", "TypeId": 2, "TypeName": "Intra-Op", "Tab": "intraop" },
        "PostOp": { "Key": "PostOp", "TypeId": 3, "TypeName": "Post-Op", "Tab": "postop" }
    };

    $scope.LasikSectionByTab = { "preop": "PreOp", "intraop": "IntraOp", "postop": "PostOp" };
    $scope.LasikNav = { "selected": "preop" };
    $scope.ActiveLasikSection = "PreOp";
    $scope.LasikSignOffInfo = null;

    /* Every phase gets its own data + summary objects - two tabs sharing one
       array is how a value shown on one phase leaks into another. */
    $scope.ResetLasikSummaryTabs = function () {
        $scope.LasikTabData = {};

        angular.forEach($scope.LasikTemplateTypes, function (type, key) {
            $scope.LasikTabData[key] = {
                "Key": key,
                "TypeId": type.TypeId,
                "TypeName": type.TypeName,
                "AddData": angular.copy($scope.GetLasikTempObj()),
                "SummaryData": $scope.GetSummaryObj(),
                "SignOffInfo": null,
                "IsLoading": false
            };
        });
    };
    $scope.ResetLasikSummaryTabs();

    /* init() runs before this block is reached, so the user-list callback it fires
       can reach BuildLasikSignOffInfo -> here before the tabs exist. */
    $scope.ActivateLasikSection = function (sectionKey) {
        var tab = ($scope.LasikTabData || {})[sectionKey];
        if (!tab) { return false; }

        $scope.ActiveLasikSection = sectionKey;
        $scope.LasikTempObj = tab.AddData;
        $scope.SummaryObj = tab.SummaryData;
        $scope.LasikSignOffInfo = tab.SignOffInfo;
    };
    $scope.ActivateLasikSection("PreOp");

    /* A tab click asks the chart service for that phase on its own TypeId, so the
       summary on screen is what is stored for the phase that was clicked. */
    $scope.ChangeLasikSummaryTab = function (tabKey) {
        var sectionKey = $scope.LasikSectionByTab[tabKey] || "PreOp";

        $scope.LasikNav.selected = tabKey;
        $scope.ActivateLasikSection(sectionKey);
        $scope.LoadLasikSummarySection(sectionKey);
    };

    $scope.GetUserNameById = function (id, arr) {
        id = id || null;
        if (id === null) { return ''; }
        arr = arr || $scope.allUserList || [];
        var list = $filter('filter')(arr, { 'DoctorID': id }, true) || [];
        return list.length > 0 ? (list[0].UserFullName || list[0].FullName || '') : '';
    };

    /* A reviewer's licence, read off the same user record their name comes from.
       The role list is tried first and the full user list second, so a reviewer
       who is not in the shorter list still gets their licence. */
    $scope.GetUserLicenseById = function (id, arr) {
        id = id || null;
        if (id === null) { return ''; }

        var lists = [arr || [], $scope.allUserList || []];
        var license = '';

        angular.forEach(lists, function (list) {
            if (license !== '') { return; }

            var match = $filter('filter')(list, { 'DoctorID': id }, true) || [];
            if (match.length > 0) {
                license = match[0].LicenseNumber || match[0].LicenseNo || '';
            }
        });

        return license;
    };

    $scope.FormatAccompainedTel = function (value) {
        value = value || '';
        if (!/\d/.test(value)) { return ''; }
        var obj = eHnoteUserDataService.UsMobileFormatChange(value) || {};
        return obj.UsFormatMobileNumber || '';
    };
  
    /* One phase's sign-off line, kept on that phase's own tab. Called with no
       argument once the user list arrives, so a tab bound before it still gets
       its signer name filled in. */
    $scope.BuildLasikSignOffInfo = function (tab) {
        if (!tab) {
            angular.forEach($scope.LasikTabData, function (t) { $scope.BuildLasikSignOffInfo(t); });
            $scope.ActivateLasikSection($scope.ActiveLasikSection);
            return;
        }

        tab.SignOffInfo = null;

        /* The phase's own chart status is what says whether it is signed, and it is
           the only thing that says so - the same gate the LASIK template and the
           print use. LastSignOffUserDetails keeps naming whoever signed last even
           after an Unsign, so treating those rows as proof of a signature left the
           signature on screen for a phase that had just been unsigned. */
        var signOffDetails = tab.AddData.LastSignOffUserDetails || [];

        if (tab.AddData.StatusFlag === 'E') {
            var details = signOffDetails;

            /* The sign-off row does not always carry the signer's id, and when it
               does not the id has to be read off the detail rows or matched by
               name - the same way the LASIK template resolves it, so both screens
               name the same signer. */
            var signOffUserId = tab.AddData.SignOffUserId || null;

            if (signOffUserId === null) {
                var idFields = ["SignOffUserId", "SignOffUserID", "UserId", "UserID", "DoctorId", "DoctorID"];

                angular.forEach(details, function (detail) {
                    angular.forEach(idFields, function (field) {
                        if (signOffUserId === null && (detail || {})[field]) {
                            signOffUserId = (detail || {})[field];
                        }
                    });
                });
            }

            var signer = ($scope.allUserList || []).filter(function (u) {
                return signOffUserId !== null && Number(u.DoctorID) === Number(signOffUserId);
            })[0];

            /* no id anywhere - match the signer's name against the user list */
            if (!signer && details.length > 0) {
                var signerName = String(details[0].SignOffUserName || '').trim().toLowerCase();

                if (signerName !== '') {
                    signer = ($scope.allUserList || []).filter(function (user) {
                        var fullName = String((user || {}).UserFullName || (user || {}).FullName || '')
                            .trim().toLowerCase();
                        return fullName !== '' && fullName === signerName;
                    })[0];
                }
            }

            var info = null;

            if (details.length > 0) {
                var signOffRow = details[0] || {};

                /* This service spells the same field several ways across screens -
                   Date / SignOffDate / SignedOffDate / ReviewedByDateTime - and one
                   wrong guess reads undefined, which is what printed the date as
                   null. Read it without caring which spelling came back. */
                var pick = function (fieldNames) {
                    var found;

                    angular.forEach(fieldNames, function (field) {
                        if (found === undefined &&
                            signOffRow[field] !== null &&
                            signOffRow[field] !== undefined &&
                            signOffRow[field] !== '') {
                            found = signOffRow[field];
                        }
                    });

                    return found;
                };

                info = {
                    /* the detail row names the signer; when it does not, the
                       matched user record does */
                    "Name": pick(["SignOffUserName", "UserFullName", "FullName", "SignOffUser", "SignedBy"]) ||
                        (signer ? (signer.SecondUserFullName || signer.UserFullName || signer.FullName) : '') || '',
                    "SuffixName": pick(["SuffixName", "Suffix"]) || (signer ? signer.SuffixName : '') || '',
                    "LicenseNumber": pick(["LicenseNumber", "LicenseNo"]) || (signer ? signer.LicenseNumber : '') || '',
                    /* the detail row does not always carry the date - the chart's own
                       sign-off date is the same signing, so it stands in for it */
                    "Date": pick(["Date", "SignOffDate", "SignedOffDate", "ReviewedByDateTime", "SignOffDateTime"]) ||
                        tab.AddData.SignOffDate || null
                };
            } else if (signer) {
                info = {
                    "Name": signer.SecondUserFullName || signer.UserFullName || signer.FullName || '',
                    "SuffixName": signer.SuffixName || '',
                    "LicenseNumber": signer.LicenseNumber || '',
                    "Date": tab.AddData.SignOffDate || null
                };
            }

            if (info) {
                /* One place the whole signature line is composed - who signed, then
                   the licence they signed under, then when - the same order the
                   printed chart uses. A name that already ends in its own suffix is
                   not given it twice. */
                var text = info.Name || '';
                var suffix = info.SuffixName || '';

                if (suffix !== '' &&
                    text.toLowerCase().indexOf(suffix.toLowerCase(), text.length - suffix.length) === -1) {
                    text += ' ' + suffix;
                }

                /* the licence belongs with the name it licenses, so it is read
                   before the date rather than trailing the line */
                if (info.LicenseNumber) {
                    text += ', Lic: ' + info.LicenseNumber;
                }

                if (info.Date) {
                    text += ', ' + $filter('date')(info.Date, 'MM-dd-yyyy') +
                        ' ' + $filter('date')(info.Date, 'hh:mm a');
                }

                info.DisplayText = text;
                tab.SignOffInfo = info;
            }
        }

        if ($scope.LasikTabData[$scope.ActiveLasikSection] === tab) {
            $scope.LasikSignOffInfo = tab.SignOffInfo;
        }
    };

    $scope.BindLasikChecklistData = function (tab, savedList) {
        savedList = savedList || [];

        var obj = tab.AddData;
        var summary = tab.SummaryData;

        var masterArrays = [
            obj.CheckInChecklist,
            obj.OtherCheckInChecklist,
            obj.OrgASCChecklist,
            obj.IntraopOrgASCChecklist
        ];

        angular.forEach(savedList, function (sitem) {
            if (sitem.DeleteInd === 'Y') { return; }

            /* AscMultiCheckValueArray comes back as a JSON *string* -> "[]" */
            var multiArray = [];
            try {
                multiArray = angular.isString(sitem.AscMultiCheckValueArray)
                    ? (JSON.parse(sitem.AscMultiCheckValueArray) || [])
                    : (sitem.AscMultiCheckValueArray || []);
            } catch (e) { multiArray = []; }

            angular.forEach(masterArrays, function (marr) {
                var matched = $filter('filter')(marr || [], { 'CheckListId': sitem.CheckListId }, true) || [];

                angular.forEach(matched, function (mitem) {
                    mitem.PatientAscCheckListDetailId = sitem.PatientAscCheckListDetailId || 0;
                    mitem.Value = sitem.Value || '';
                    mitem.Score = sitem.Score || 0;
                    mitem.Remarks = sitem.Remarks || '';
                    mitem.ChecklistDate = sitem.ChecklistDate || null;
                    mitem.IsChecked = (mitem.Value !== '') || multiArray.length > 0;

                    angular.forEach(mitem.OrganizationCheckListDetails || [], function (kitem) {
                        kitem.IsChecked = false;

                        /* single select (radio / button list) */
                        if (mitem.Value !== '' && kitem.Value === mitem.Value) {
                            kitem.IsChecked = true;
                        }

                        /* multi select (checkbox list) */
                        var mfound = multiArray.filter(function (x) {
                            return (x.OrganizationPreOpCheckListValueId &&
                                x.OrganizationPreOpCheckListValueId === kitem.OrganizationPreOpCheckListValueId)
                                || (x.Value && x.Value === kitem.Value);
                        });
                        if (mfound.length > 0 && mfound[0].DeleteInd !== 'Y') {
                            kitem.IsChecked = true;
                            kitem.PatientMultiCheckListId = mfound[0].PatientMultiCheckListId || 0;
                        }
                    });
                });
            });


            const ids = [631, 632, 633, 634, 635];
            const filtered = savedList.filter(function (item) {
                return ids.includes(parseInt(item.CheckListId));
            });

            summary.PreOpChecklist = filtered || [];


            const Sids = [28];
            const Sfiltered = savedList.filter(function (item) {
                return Sids.includes(parseInt(item.CheckListCategoryId));
            });
            summary.OtherChecklist = Sfiltered || [];

            const Dids = [31];
            const Dfiltered = savedList.filter(function (item) {
                return Dids.includes(parseInt(item.CheckListCategoryId));
            });
            summary.DISCHARGEChecklist = Dfiltered || [];
            const Fallids = [11];
            const Fallfiltered = savedList.filter(function (item) {
                return Fallids.includes(parseInt(item.CheckListCategoryId));
            });
            summary.FallRiskRows = Fallfiltered || [];

            const Statusid = [351];
            const Statusfiltered = savedList.filter(function (item) {
                return Statusid.includes(parseInt(item.CheckListCode));
            });
            summary.PostopStatusRows = Statusfiltered || [];

            const AdverseEventid = [350];
            const AdverseEventfiltered = savedList.filter(function (item) {
                return AdverseEventid.includes(parseInt(item.CheckListCode));
            });
            summary.AdverseEventsRows = AdverseEventfiltered || [];

            const SafetyPauseid = [347];
            const SafetyPausefiltered = savedList.filter(function (item) {
                return SafetyPauseid.includes(parseInt(item.CheckListCode));
            });
            summary.IntraopRows = SafetyPausefiltered || [];

            const PatientPositionlasikid = [359, 373, 374, 349];
            const PatientPositionlasikfiltered = savedList.filter(function (item) {
                return PatientPositionlasikid.includes(parseInt(item.CheckListCode));
            });
            summary.PatientPositionLasikRows = PatientPositionlasikfiltered || [];
        });
    };

    /* ---------- 2. ORDERS / MEDICATIONS ---------- */
    $scope.BindLasikOrderDetails = function (tab, orders) {
        orders = orders || [];

        var obj = tab.AddData;
        var finalOrders = [];

        angular.forEach(orders, function (mitem) {
            if (mitem.DeleteInd === 'Y') { return; }

            mitem.DilationMedications = mitem.DilationMedications || [];
            mitem.PreOpMedications = mitem.PreOpMedications || [];
            mitem.PostOpMedications = mitem.PostOpMedications || [];
            mitem.GeneralOrders = mitem.GeneralOrders || [];
            mitem.ReviewedBy = mitem.ReviewedBy || null;
            mitem.ReviewedByPassword = '';
            mitem.IsOrderReviewed = mitem.IsOrderReviewed || false;
            mitem.OrderTypeId = mitem.OrderTypeId || 2;
            mitem.OrderTypeName = mitem.OrderTypeName || 'Live Medications';
            mitem.ReviewedByName = mitem.ReviewedByName || $scope.GetUserNameById(mitem.ReviewedBy, $scope.SurgeonArray);
            mitem.ReviewedByDateTime = (mitem.ReviewedByDateTime === '1900-01-01T00:00:00')
                ? null : mitem.ReviewedByDateTime;

            var allMeds = []
                .concat(mitem.DilationMedications)
                .concat(mitem.PreOpMedications)
                .concat(mitem.PostOpMedications);

            angular.forEach(allMeds, function (item) {
                item.DeleteInd = item.DeleteInd || 'N';
                item.DropTimings = item.DropTimings || [];
                item.MedicationNotes = item.MedicationNotes || '';
                item.maxDose = item.maxDose || '';

                angular.forEach(item.DropTimings, function (kitem) {
                    kitem.DeleteInd = kitem.DeleteInd || 'N';
                    kitem.Remarks = kitem.Remarks || '';
                    kitem.shownotes = false;
                    /* saved rows render as read-only text + pencil */
                    kitem.IsEditview = (kitem.DropTimingId || 0) !== 0;
                    kitem.IsEditDrop = (kitem.DropTimingId || 0) !== 0;
                    kitem.GivenByname = kitem.GivenByname || $scope.GetUserNameById(kitem.GivenBy);
                });
            });

            angular.forEach(mitem.GeneralOrders, function (g) {
                g.DeleteInd = g.DeleteInd || 'N';
                g.Status = g.Status || '';
            });

            finalOrders.push(mitem);
        });

        /* always keep one empty "live" block so new orders can still be added */
        if (finalOrders.length === 0) {
            finalOrders = angular.copy($scope.GetLasikTempObj().OrderDetails);
        }
        obj.OrderDetails = finalOrders;
        //tab.SummaryData.OrderDetails = finalOrders;

        /* "No medications administered" checkbox states */
        var preOpActive = (finalOrders || []).filter(function (o) {
            return o.DeleteInd === 'N' && o.MedTypeId === 2;
        }).some(function (o) {
            return (o.DilationMedications || []).some(function (i) { return i.DeleteInd === 'N'; });
        });
        if (preOpActive) {
            obj.DisableSurgeonordersCheck = preOpActive;
            obj.IsSurgeonOrdersTimeChecked = !preOpActive;
        }

        var postOpActive = (finalOrders || []).filter(function (o) {
            return o.DeleteInd === 'N' && o.MedTypeId === 5;
        }).some(function (o) {
            return (o.PostOpMedications || []).some(function (i) { return i.DeleteInd === 'N'; });
        });

        if (postOpActive) {
            obj.DisablePostOpSurgeonCheck = postOpActive;
            obj.IsPostOpSurgeonOrdersTimeAdded = !postOpActive;
        }
       
    };

    $scope.BindLasikTemplateResponse = function (tab, row) {
        row = row || {};

        var obj = tab.AddData;
        var summary = tab.SummaryData;

        /* keys */
        obj.LasikTemplateId = row.LasikTemplateId || 0;
        obj.StatusFlag = row.StatusFlag || 'D';
        obj.SignOffUserId = row.SignOffUserId || null;
        /* 'E' = signed off -> read-only summary, 'D' = draft -> editable form */
        //obj.IsLasikSummaryInd = (row.StatusFlag === 'E');

        /* ---- Pre-Op : arrival & accompaniment ---- */

        obj.AccompainedBy = row.AccompainedBy || '';
        obj.AccompainedByNotes = row.AccompainedByNotes || '';
        obj.AccompainedByNotesInd = obj.AccompainedByNotes !== '';
        obj.AccompainedName = row.AccompainedName || '';
        obj.ArrivalType = row.ArrivalType || '';
        obj.FamilyRelationId = row.FamilyRelationId || null;
        obj.FamilyRelationName = row.FamilyRelationName || '';
        obj.AccompainedTel = $scope.FormatAccompainedTel(row.AccompainedTel);
        obj.Patientpresentsalone = row.Patientpresentsalone || '';
        obj.RecievedForSurgery = row.RecievedForSurgery || '';
        obj.RecievedForSurgeryNotes = row.RecievedForSurgeryNotes || '';
        obj.RecievedForSurgeryNotesInd = obj.RecievedForSurgeryNotes !== '';

        /* ---- Pre-Op : initial clinical data ---- */
        // var clinical = row.InitialClinicalData || {};
        obj.BP = row.BP || '';
        obj.BPDiastolic = row.BPDiastolic || '';
        obj.Pulse = row.Pulse || '';
        obj.VAOD = row.VAOD || '';
        obj.VAOS = row.VAOS || '';
        obj.PreOpIOPOD = row.PreOpIOPOD || '';
        obj.PreOpIOPOS = row.PreOpIOPOS || '';
        obj.PreOpIOPTime = row.PreOpIOPTime || '';
        obj.CorneaOD = row.CorneaOD || '';
        obj.CorneaOS = row.CorneaOS || '';
        obj.InitialClinicalOther = row.Other || '';

        /* ---- Fall risk ---- */
        obj.FallRiskAssessmentTotalScore = row.FallRiskAssessmentTotalScore || 0;
        obj.FallRiskLevel = row.FallRiskLevel || '';
        obj.NurseFallRiskID = row.NurseFallRiskID || null;
        obj.NurseFallRiskName = $scope.GetUserNameById(row.NurseFallRiskID, $scope.ReviewedByArray);
        obj.NurseFallRiskReviewdDate = row.NurseFallRiskReviewdDate || null;
        obj.ImplementedFallRiskProtocol = $scope.ToBool(row.ImplementedFallRiskProtocol);
        obj.ImplementedFallRiskProtocoltype = row.ImplementedFallRiskProtocoltype || '';

        /* ---- Asepsis + notes ---- */
        obj.Periocularwashwithiodopovidone = $scope.ToBool(row.Periocularwashwithiodopovidone);
        obj.PreOpNotes = row.PreOpNotes || '';
        obj.IsSurgeonOrdersTimeChecked = row.IsSurgeonOrdersTimeChecked || false;

        /* ---- Intra-Op ---- */
        obj.EquipmentId = row.EquipmentId || null;
        obj.EquipmentName = row.EquipmentName || '';
        obj.ODSph = row.ODSph || '';
        obj.ODCyl = row.ODCyl || '';
        obj.ODAxis = row.ODAxis || '';
        obj.ODOpticalZone = row.ODOpticalZone || '';
        obj.ODTreatmentZone = row.ODTreatmentZone || '';
        obj.OSSph = row.OSSph || '';
        obj.OSCyl = row.OSCyl || '';
        obj.OSAxis = row.OSAxis || '';
        obj.OSOpticalZone = row.OSOpticalZone || '';
        obj.OSTreatmentZone = row.OSTreatmentZone || '';
        obj.AdverseEvent = row.AdverseEvent || '';
        obj.AdverseEventDescription = row.AdverseEventDescription || '';
        obj.HallEntranceStartTime = row.HallEntranceStartTime || '';
        obj.HallEntranceEndTime = row.HallEntranceEndTime || '';
        obj.SurgeryStartTime = row.SurgeryStartTime || '';
        obj.SurgeryEndTime = row.SurgeryEndTime || '';
        obj.IntraOpNotes = row.IntraOpNotes || '';

        /* ---- Post-Op IOP ---- */
        obj.IOPOD = row.IOPOD || '';
        obj.IOPOS = row.IOPOS || '';
        obj.IOPTime = row.IOPTime || '';
        obj.IOPResultAssessment = row.IOPResultAssessment || '';
        obj.IOPActionTaken = row.IOPActionTaken || '';
        obj.IOPReEval = row.IOPReEval || '';
        obj.IOPReEvalTime = row.IOPReEvalTime || '';

        /* ---- Discharge ---- */
        obj.IsAlertOrientedX3 = $scope.ToBool(row.IsAlertOrientedX3);
        obj.IsPhysicianExaminedSafeForDischarge = $scope.ToBool(row.IsPhysicianExaminedSafeForDischarge);
        obj.DischargeVASScore = (row.DischargeVASScore === null || row.DischargeVASScore === undefined)
            ? null : row.DischargeVASScore;
        obj.BandageProtector = row.BandageProtector || '';
        obj.BandageProtectorOther = row.BandageProtectorOther || '';
        obj.IsDischargeHomeWithAdult = $scope.ToBool(row.IsDischargeHomeWithAdult);
        obj.FollowUpId = row.FollowUpId || null;
        obj.FollowUpName = row.FollowUpName || '';
        obj.ResponsibleAdultName = row.ResponsibleAdultName || '';
        obj.PostOpNotes = row.PostOpNotes || '';
        obj.IsPostOpSurgeonOrdersTimeAdded = row.IsPostOpSurgeonOrdersTimeAdded || false;

        /* follow-up dates */
        obj.FollowUpDate1 = row.FollowUpDate1 ? $filter('date')(row.FollowUpDate1, 'MM-dd-yyyy') : '';
        obj.FollowUpDate2 = row.FollowUpDate2 ? $filter('date')(row.FollowUpDate2, 'MM-dd-yyyy') : '';
        obj.FollowUpDate3 = row.FollowUpDate3 ? $filter('date')(row.FollowUpDate3, 'MM-dd-yyyy') : '';
        obj.FollowUpDate2Ind = obj.FollowUpDate2 !== '';
        obj.FollowUpDate3Ind = obj.FollowUpDate3 !== '';
        /* lock a follow-up date once an appointment has been booked from it */
        obj.SecondFollowupAppointmentId = row.SecondFollowupAppointmentId || 0;
        obj.ThirdFollowupAppointmentId = row.ThirdFollowupAppointmentId || 0;

        /* ---- Sign-off ---- */
        obj.LastSignOffUserDetails = row.LastSignOffUserDetails || [];
        obj.SignOffDate = row.SignOffDate || row.SignedOffDate || null;
        $scope.BuildLasikSignOffInfo(tab);
        obj.NurseReviewedById = row.NurseReviewedById || null;
        obj.NurseReviewedByName = row.NurseReviewedByName ||
            $scope.GetUserNameById(row.NurseReviewedById, $scope.ReviewedByArray);
        obj.DoctorReviewedById = row.DoctorReviewedById || null;
        obj.DoctorReviewedByName = row.DoctorReviewedByName ||
            $scope.GetUserNameById(row.DoctorReviewedById, $scope.SurgeonArray);
        /* the reviewer's licence, shown beside the name it licenses */
        obj.NurseReviewedLicenseNumber = row.NurseReviewedLicenseNumber ||
            $scope.GetUserLicenseById(row.NurseReviewedById, $scope.ReviewedByArray);
        obj.DoctorReviewedLicenseNumber = row.DoctorReviewedLicenseNumber ||
            $scope.GetUserLicenseById(row.DoctorReviewedById, $scope.SurgeonArray);
        /* the review is shown with the date it was made, the same way and in the
           same format the LASIK template's own summary shows it */
        obj.NurseReviewedDate = row.NurseReviewedDate ?
            $filter('date')(row.NurseReviewedDate, "MM-dd-yyyy hh:mm a") : '';
        obj.DoctorReviewedDate = row.DoctorReviewedDate ?
            $filter('date')(row.DoctorReviewedDate, "MM-dd-yyyy hh:mm a") : '';
        summary.OrderDetails = row.OrderDetails;
        $scope.SetSurgeonCredentials(summary.OrderDetails);
        /* ---- collections ---- */
        $scope.BindLasikChecklistData(tab, row.OrgASCChecklist);
        $scope.BindLasikOrderDetails(tab, row.OrderDetails);

        /* radio defaults for the order-entry panels */
        obj.OrderType = 'Medications';
        obj.PostOrderType = 'Medications';
        obj.IsPostProcedureLevelOfCooperation = row.IsPostProcedureLevelOfCooperation || false;
        obj.RightEyeOD = row.RightEyeOD || false;
        obj.LeftEyeOS = row.LeftEyeOS || false;
        obj.IOPReEvalOD = row.IOPReEvalOD || null;
        obj.IOPReEvalOS = row.IOPReEvalOS || null;
        obj.HeadFixation = row.HeadFixation || "";
        obj.IsLateralSupportsUsed = row.IsLateralSupportsUsed || false;
        obj.IsVacuumPillowUsed = row.IsLateralSupportsUsed || false;
    };

    $scope.ToBool = function (v) {
        return v === true || v === 'Y' || v === 'y' || v === 'true' || v === 1;
    };

    /* One saved row belongs to the phase named by its TypeId. A row saved before
       the phases were split carries no TypeId - it holds all three phases' fields,
       so it is bound into all three tabs. */
    $scope.GetLasikRowSections = function (row) {
        var typeId = (row || {}).TypeId;
        typeId = (typeId === undefined || typeId === null || typeId === '') ? null : Number(typeId);

        var keys = [];
        angular.forEach($scope.LasikTemplateTypes, function (lasikType, key) {
            if (typeId === null || typeId === lasikType.TypeId) { keys.push(key); }
        });
        return keys;
    };

    /* The chart request for one phase. The service is asked for that phase's own
       TypeId / TypeName - 1 Pre-Op, 2 Intra-Op, 3 Post-Op - so only that phase's
       row comes back. OrganizationId is the appointment's branch, the same one
       the LASIK template popup saved the chart under. */
    $scope.GetLasikSummaryReqObj = function (sectionKey) {
        var lasikType = $scope.LasikTemplateTypes[sectionKey] || $scope.LasikTemplateTypes.PreOp;

        return {
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": $scope.SelectedAppointmentId || null,
            "PatientId": $scope.SelectedPatientID || null,
            "TypeId": lasikType.TypeId,
            "TypeName": lasikType.TypeName
        };
    };

    /* Load one phase and bind it into that phase's tab alone - what the service
       returns for a phase is all that phase shows, so the tab starts from a clean
       slate every time it is opened. */
    $scope.LoadLasikSummarySection = function (sectionKey) {
        var tab = $scope.LasikTabData[sectionKey];
        if (!tab) { return; }

        tab.IsLoading = true;

        return eHnoteSurgeryService.GetLasikTemplatesChartData($scope.GetLasikSummaryReqObj(sectionKey))
            .then(function (resp) {
                tab.IsLoading = false;
                tab.AddData = angular.copy($scope.GetLasikTempObj());
                tab.SummaryData = $scope.GetSummaryObj();
                tab.SignOffInfo = null;

                var rows = (resp.data.status === "Success") ? (resp.data.rows || []) : [];

                /* The service returns who signed the chart once, beside the rows
                   rather than on them, so a row read on its own carries no signer
                   at all - which is why the signature never appeared here. Put the
                   list onto every row before binding, exactly as the LASIK template
                   popup does, so both screens read the same sign-off. */
                var lastSignOffUserDetails = angular.copy(resp.data.LastSignOffUserDetails || []);

                angular.forEach(rows, function (row) {
                    row = angular.copy(row) || {};
                    if ($scope.GetLasikRowSections(row).indexOf(sectionKey) === -1) { return; }

                    if (!row.LastSignOffUserDetails || row.LastSignOffUserDetails.length === 0) {
                        row.LastSignOffUserDetails = angular.copy(lastSignOffUserDetails);
                    }

                    tab.AddData.IsLasikSummaryInd = true;
                    $scope.BindLasikTemplateResponse(tab, row);
                });

                /* the tab's objects were just replaced - point the view at them */
                if ($scope.ActiveLasikSection === sectionKey) {
                    $scope.ActivateLasikSection(sectionKey);
                }
            }, function () {
                tab.IsLoading = false;
            });
    };

    /* Which phase the LASIK tab opens on: the one Bulk Sign-Off was clicked on
       when it named one, Pre-Op otherwise. */
    $scope.GetInitialLasikSection = function () {
        var typeId = Number($scope.SelectedLasikTypeId) || null;
        var sectionKey = "PreOp";

        angular.forEach($scope.LasikTemplateTypes, function (lasikType, key) {
            if (typeId !== null && typeId === lasikType.TypeId) { sectionKey = key; }
        });

        return sectionKey;
    };

    /* Opening the LASIK tab starts on that phase, with nothing left over from the
       appointment looked at before it. */
    function getLasikTemplateSummaryData() {
        var sectionKey = $scope.GetInitialLasikSection();

        $scope.ResetLasikSummaryTabs();
        $scope.LasikNav.selected = $scope.LasikTemplateTypes[sectionKey].Tab;
        $scope.ActivateLasikSection(sectionKey);
        $scope.LoadLasikSummarySection(sectionKey);
    }

}]);
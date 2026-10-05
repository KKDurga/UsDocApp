"use strict";
eHnoteWebApp.controller("PreAdmissionAnesthesiaPopupCtrl", ["$scope", "$filter", "alertify", "$uibModalInstance", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteCacheStorageService", "allUserList", "eHnoteSurgeryService", "cache", "eHnoteConditionsDataService", "eHnotePatientDataService", "eHnoteDiagnosisDataServices", "$q", "eHnoteSettingsDataService", "$uibModal", function ($scope, $filter, alertify, $uibModalInstance, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteCacheStorageService, allUserList, eHnoteSurgeryService, cache, eHnoteConditionsDataService, eHnotePatientDataService, eHnoteDiagnosisDataServices, $q, eHnoteSettingsDataService, $uibModal) {

    $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();

    var doctorinfo = eHnoteMasterDataService.getUserInfo();
    $scope.UserId = eHnoteMasterDataService.getLoginId();
    $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
    $scope.LoginUserRoleID = doctorinfo.RoleID;
    $scope.ParenthospitalId = 0;
    $scope.HospitalId = 0;

    $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
    $scope.cache = cache || ''; // for orders 

    if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
        $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
    };

    $scope.closeuibpopup = function () {
        $uibModalInstance.close("close");
    };

    $scope.allUserList = angular.copy(allUserList)|| [];

    $scope.AnesthetistArray = $scope.allUserList.filter((x) => x.RoleId == 25); // 25 - anesthetist, 30 - anesthesiologist

    $scope.AnesthesiologistArray = $scope.allUserList.filter((x) => x.RoleId == 30 );

    $scope.VitalPerformedByArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 8 || x.RoleId == 30 || x.RoleId == 72 || x.RoleId == 43);

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

    $scope.OrderTypeObj = {
        "SelectedOrderType": 1
    };

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

    $scope.GetPreAdmAnesthetistObj = function () {
        return {
            "PreAdmissionId": 0,
            "OrganizationId": $scope.HospitalId || 0,
            "UserId": $scope.UserId,
            "PatientId": $scope.cacheStorageItem.PatientID || 0,
            "AppointmentId": $scope.cacheStorageItem.SelectedAppointmentId || 0,
            "PrevAnesthesia": "",
            "AssessmentsASA": "",
            "AnesthesiaPlan": "",
            "PreAdmissionStatusId": null,
            "AnesthesiaPlan": "",
            "PreAdmissionChartStatus": "D",
            "StatusFlag": "D",
            "PreAdmissionStatusId": null,
            "MedicationsList": [],
            "CurrentMedicationList": [],
            "CurrentEyeMedications": [],
            "InvestigationsList": [],
            "ASAObj": {
                "Value": "",
                "Notes": "",
            },
            "ReviewedBy": null,
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
            }],
            "ReviewedDate": "",
            "ReviewedTime": "",

            "PrescriptionDetails": [],
            "CurrentSystemicMedicationsHistory": [],
            "AppointmentID": $scope.cacheStorageItem.AppointmentId,
            "PrevAnestheticsObjNotesInd": false,
            "ASAClassificationNotes": "",
            "SystemicHistoryPopoverNotes": "",
        };
    };

    $scope.PreAdmAnesthetistObj = angular.copy($scope.GetPreAdmAnesthetistObj());

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

    $scope.VitalsObj = function () {
        return {
            "VitalSummaryId": 0,
            "AppointmentId": 0,
            "VitalAddDate": $filter('date')(new Date(), 'MM-dd-yyyy'),
            "VitalAddTime": "",
            "DoctorId": 0, // changing  to 0 as $scope.UserId
            "UserName": "",
            "DeleteInd": "N",
            "IsEditVitalInd": false,
            "VitalRemarks":"",
            "Vitals": angular.copy($scope.subVitallist()) || []
        };

    }
    $scope.AllVitalsArray = [];
    let vitalsobj = angular.copy($scope.VitalsObj());
    $scope.AllVitalsArray.push(vitalsobj);

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
            "AnesthesiologistId": "",
            "AnesthesiologistName":"",
        };
    };

    $scope.APAnesthesiaOptionsObj = angular.copy($scope.GetAPAnesthesiaOptionsObj());

    $scope.GetPrevAnesthetics = function () {
        return {
            "IsPrevAnesthesia": false,
            "IsComplications": null,
            "IsFamilyHistory": false,
            "IsDifficultAirway": false,
            "IsPONV": false,
            "IsPatientDNR": false,
            "IsSuspend": false,
            "IsContinue": false,
            "Notes": "",
            "PreviousAnesthetics": [],
            "AllergyItems": [],
            "SurgicalHistory": [],
            "CurrentSystemicMedicationsHistory": [],
            "CurrentEyeMedications": [],
            "ROSOverAllRemarks": '',
            "PreAdmissionChartStatus": null
        };
    };

    $scope.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());

    $scope.GetFilesObj = function () {
        return {
            "DocumentDetails": [],
            "TempImagesArray": []
        };
    };

    $scope.FilesObj = angular.copy($scope.GetFilesObj());

    $scope.PreAdmshownotes = {
        "PreAdmnotes1": false,
        "PreAdmnotes2": false,
        "PreAdmnotes3": false,
        "PreAdmnotes4": false,
        "PreAdmnotes5": false,
        "PreAdmnotes6": false,
        "PreAdmnotes7": false,
    }

    $scope.PreAdmSurgeryStatusArray = [
        {
            "StatusId": 1,
            "StatusName": "Approved"
        },
        {
            "StatusId": 2,
            "StatusName": "Not Fit for Surgery"
        },
        {
            "StatusId": 3,
            "StatusName": "Postpone Surgery"
        }
    ];

    $scope.OnSelectAssessPlanOption = function (val) {
        if (val == 1) {
            //$scope.APAnesthesiaOptionsObj.IsTopicalAnesthesia = !$scope.APAnesthesiaOptionsObj.IsTopicalAnesthesia;

            if ($scope.APAnesthesiaOptionsObj.IsTopicalAnesthesia) {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 1 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = true;
                }
            } else {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 1 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = false;
                }
            }
        }
        if (val == 2) {
            //  $scope.APAnesthesiaOptionsObj.IsLocalAnesthesia = !$scope.APAnesthesiaOptionsObj.IsLocalAnesthesia;

            if ($scope.APAnesthesiaOptionsObj.IsLocalAnesthesia) {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 2 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = true;
                }
            } else {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 2 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = false;
                }
            }
        }
        if (val == 3) {
            //$scope.APAnesthesiaOptionsObj.IsGeneralAnesthesia = !$scope.APAnesthesiaOptionsObj.IsGeneralAnesthesia;

            if ($scope.APAnesthesiaOptionsObj.IsGeneralAnesthesia) {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 3 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = true;
                }
            } else {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 3 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = false;
                }
            }
        }
        if (val == 4) {
            //   $scope.APAnesthesiaOptionsObj.IsRegionalAnesthesia = !$scope.APAnesthesiaOptionsObj.IsRegionalAnesthesia;

            if ($scope.APAnesthesiaOptionsObj.IsRegionalAnesthesia) {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 6 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = true;
                }
            } else {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 6 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = false;
                }
            }
        }
        if (val == 5) {
            //  $scope.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia = !$scope.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia;

            if ($scope.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia) {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 4 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = true;
                }
            } else {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 4 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = false;
                }
            }
        }
        if (val == 6) {
            //  $scope.APAnesthesiaOptionsObj.IsSubtenonAnesthesia = !$scope.APAnesthesiaOptionsObj.IsSubtenonAnesthesia;

            if ($scope.APAnesthesiaOptionsObj.IsSubtenonAnesthesia) {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 5 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = true;
                }
            } else {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 5 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = false;
                }
            }
        }
        if (val == 7) {
            //   $scope.APAnesthesiaOptionsObj.IsIVSedation = !$scope.APAnesthesiaOptionsObj.IsIVSedation;

            if ($scope.APAnesthesiaOptionsObj.IsIVSedation) {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 7 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = true;
                }
            } else {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 7 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = false;
                }
            }
        }
        if (val == 8) {
            //  $scope.APAnesthesiaOptionsObj.IsMonitoredAnesthesiaCare = !$scope.APAnesthesiaOptionsObj.IsMonitoredAnesthesiaCare;

            if ($scope.APAnesthesiaOptionsObj.IsMonitoredAnesthesiaCare) {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 8 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = true;
                }
            } else {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 8 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = false;
                }
            }
        }
        if (val == 9) {
            //  $scope.APAnesthesiaOptionsObj.IsOralSedation = !$scope.APAnesthesiaOptionsObj.IsOralSedation;

            if ($scope.APAnesthesiaOptionsObj.IsOralSedation) {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 9 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = true;
                }
            } else {
                let Anesthetistlist = $filter("filter")($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 9 });
                if (Anesthetistlist.length > 0) {
                    Anesthetistlist[0].IsSelected = false;
                }
            }
        }
    };

    $scope.OnSelectPrevAnesthesiaBtn = function (val) {
        if (val == 1) {
            $scope.PrevAnestheticsObj.IsPrevAnesthesia = true;
        }
        if (val == 2) {
            $scope.PrevAnestheticsObj.IsPrevAnesthesia = false;
        }
        if (val == 3) {
            if ($scope.PrevAnestheticsObj.IsComplications) {
                $scope.PrevAnestheticsObj.IsComplications = null;
            } else {
                $scope.PrevAnestheticsObj.IsComplications = true;
            }

        }
        if (val == 4) {
            if ($scope.PrevAnestheticsObj.IsComplications == false && $scope.PrevAnestheticsObj.IsComplications != null) {
                $scope.PrevAnestheticsObj.IsComplications = null;
            } else {
                $scope.PrevAnestheticsObj.IsComplications = false;
            }
        }
    };

    $scope.selectedImgs = function (files, TypeId) {

        files = files || [];
        if (files.length > 0) {
            angular.forEach(files, function (item) {
                files = item || [];
                $scope.file = item;
                if ($scope.file != null) {

                    var pName = $scope.file.name, name = "";
                    var type = $scope.file.type.split("/")[1];
                    if (pName.length > 9) {
                        name = pName.substring(0, 9) + "..." + "." + type;
                    } else {
                        name = angular.copy(pName) + '.' + type;
                    }

                    let FileTypeId = 17;
                    TypeId = TypeId || null;
                    if (TypeId != null) {
                        FileTypeId = TypeId;
                    }
                    var obj = {
                        "file": $scope.file,
                        "S3URL": "",
                        "DeleteInd": false,
                        "DocumentID": 0,
                        "DocumentName": $scope.file.name || "",
                        "FileName": $scope.file.name || "",
                        "FileExt": $scope.file.type,
                        "FileTypeId": FileTypeId,
                        "DisplayName": $scope.file.name || ""
                    };

                    $scope.FilesObj.TempImagesArray.push(obj);


                    angular.element("input[type='file']").val(null);
                }
            });
        }
    };

    $scope.OnSelectPreAdmissionStatus = function (Id) {
        $scope.PreAdmAnesthetistObj.PreAdmissionStatusId = Id;
        if ($scope.PreAdmAnesthetistObj.PreAdmissionStatusId === 1) {
            $scope.PreAdmAnesthetistObj.PreAdmissionStatus = "Approved";
        } else if ($scope.PreAdmAnesthetistObj.PreAdmissionStatusId === 2) {
            $scope.PreAdmAnesthetistObj.PreAdmissionStatus = "Not Fit for Surgery";
        } else if ($scope.PreAdmAnesthetistObj.PreAdmissionStatusId === 3) {
            $scope.PreAdmAnesthetistObj.PreAdmissionStatus = "Postpone Surgery";
        }else {
            $scope.PreAdmAnesthetistObj.PreAdmissionStatus = "";
        }
    };

    $scope.DeletePreAdmDocumentlist = function (item, index, mainitem) {

        $scope.DeleteFileUploadArray = { "DocumentID": item.DocumentId, "FileName": item.DocumentName, "Remarks": "" };
        alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
            var params = {
                "AppointmentID": mainitem.AppointmentId,
                "DeleteIndicator": 0,
                "ImagesArray": [],
                "UploadType": "Delete",
                "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "Remarks": ""
            };

            params.ImagesArray.push($scope.DeleteFileUploadArray);
            eHnoteDiagnosisDataServices.DeleteASCDocumentList(params, onupdateDeletesuccess, onupdateDelerror);
        }, function () { });
        function onupdateDeletesuccess(response) {
            if (response.Status === 'Success') {
             //   $scope.init();
                if (item.DocumentId!= 0) {
                    let index = $scope.PreAdmAnesthetistObj.DocumentDetails.findIndex(vital => vital.DocumentId === item.DocumentId);
                    if (index !== -1) {
                        $scope.PreAdmAnesthetistObj.DocumentDetails.splice(index, 1);
                    }              
                }
            }
        }
        function onupdateDelerror(errordata) {
            console.log(errordata);
        }
    }

    $scope.scanFiles = function (type) {
        $scope.SelectedFile = null;
        if (type == 1) {
            $scope.SelectedFile = 17;
        } else if (type == 2) {
            $scope.SelectedFile = 26;
        }
        else if (type == 32) {
            $scope.SelectedFile = 32;
        }
        else if (type == 33) {
            $scope.SelectedFile = 33;
        }

        $scope.currentDate = $filter('date')(new Date(), "yyyy-MM-dd");

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

        var obj = {
            "PatientId": $scope.cacheStorageItem.PatientID || null,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
            "PatientName": $scope.cacheStorageItem.PatientName || '',
            "Tab": "ASCFileUploads",
            "SignedDate": $scope.currentDate,
            "FileTypeId": parseInt($scope.SelectedFile),
            "FileName": '',
            "DisplayName": '',
            "PatientSurgeryId": PatientSurgeryId,

        }

        $scope.mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/PatientDocumentScanner.html",
            "backdrop": "static",
            "scope": $scope,
            "size": "lg",
            "resolve": {
                "mainObject": function () { return obj; }
            },
            "windowClass": "modal__eighty--",
            "keyboard": false,
            "controller": "DocumentScannerCtrl",
        });

        $scope.mInstanceAdd.result.then(function (data) {
            console.log(data);
            $scope.GetPreAdmScanDocuments();

        }, function (cancel) {
        });

    }

    $scope.PreAdmSignOff = function (str) {

        let obj = {
            "Screen": "Anesthesia PreAdmission",
            "Type": "SignOff",
            "UserType": "Anesthesia",
            "allUserList": angular.copy($scope.allUserList) || [],
        };

        let signmodalInstance = $uibModal.open({
            "templateUrl": "templates/consultation/SignOffPasswordNew.html",
            "controller": "UsSignOffPasswordPopupCtrl",
            //"size": "md",
            "windowClass": "",
            "backdrop": "static",
            "keyboard": false,
            "resolve": {
                "obj": function () { return obj; }
            }
        });
        signmodalInstance.result.then(function (resp) {
            $scope.SavePreAdmissionDetails("SignOff");
        }, function (data) {

        });
    };

    $scope.SavePreAdmissionDetails = function (str) {

        let appointmentId;
        appointmentId = $scope.cacheStorageItem.AppointmentId;
        //if ($scope.cacheStorageItem.AppointmentTypeId === 4) {
        //    appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
        //}
        //if ($scope.cacheStorageItem.AppointmentTypeId === 7) {
        //    appointmentId = $scope.cacheStorageItem.AppointmentId;
        //}

        var ReviewedDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");

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


        if ($scope.PreAdmAnesthetistObj.AnesthesiaTypelist.length > 0) {
            angular.forEach($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) {
                kitem.PatientSurgeryId = PatientSurgeryId;
            });
        }

        let tempAnesthesiaTypelist = $filter('filter')($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, { 'IsSelected': true }, true);

        let parentApptId;
        if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
            parentApptId = ($scope.cacheStorageItem.PreAdmSurgeryList.length > 0) ? $scope.cacheStorageItem.PreAdmSurgeryList[0].AppointmentId : null;
        } else if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
            parentApptId = ($scope.cacheStorageItem.SurgeryList.length > 0) ? $scope.cacheStorageItem.SurgeryList[0].AppointmentId : null;
        }


        // filter for only anesthesia orders
        let tempPrescriptionArray = $filter('filter')($scope.PrescriptionMainAddObj.PrescriptionDetails, { 'TypeId': 2 }, true);
        if (tempPrescriptionArray.length > 0) {
            let tempObj = angular.copy($scope.PrescriptionMainAddObj);
            tempObj.PrescriptionDetails = angular.copy(tempPrescriptionArray);
            $scope.PreAdmAnesthetistObj.PrescriptionDetails = [];
            $scope.PreAdmAnesthetistObj.PrescriptionDetails.push(tempObj);
        } else {
            $scope.PreAdmAnesthetistObj.PrescriptionDetails = [];
        }

        let tempInvArray = $filter('filter')($scope.Surgeryobj.Investigationslist, { 'TypeId': 2 }, true);

        //if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length !== 0) {
        //    $scope.PreAdmAnesthetistObj.PrescriptionDetails = [];
        //    $scope.PreAdmAnesthetistObj.PrescriptionDetails.push($scope.PrescriptionMainAddObj);
        //} else {
        //    $scope.PreAdmAnesthetistObj.PrescriptionDetails = [];
        //}

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

        if ($scope.cacheStorageItem.AppointmentTypeId === 4 || $scope.cacheStorageItem.AppointmentTypeId === 14) {
            $scope.PreAdmAnesthetistObj.IsAscAnestiaSave = true;
        }
        if ($scope.cacheStorageItem.AppointmentTypeId === 7) {
            $scope.PreAdmAnesthetistObj.IsPreadminAnestiaSave= true;
        }
        $scope.PrevAnestheticsObj.PreAdmissionChartStatus = $scope.PrevAnestheticsObj.PreAdmissionChartStatus || null;
        if ($scope.PrevAnestheticsObj.PreAdmissionChartStatus==null) {
            $scope.PrevAnestheticsObj.PreAdmissionChartStatus = "D";
        }
        let reqObj = {
            "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
            "PreAdmissionId": $scope.PreAdmAnesthetistObj.PreAdmissionId || 0,
            "OrganizationId": $scope.HospitalId || 0,
            "UserId": $scope.UserId,
            "PatientId": $scope.cacheStorageItem.PatientID || 0,
            "AppointmentId": appointmentId || 0,
            "AppointmentDate": $filter('date')(new Date(), "yyyy-MM-dd"),
            "ParentAppointmentId": parentApptId,
            "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId,
            "PatientSurgeryId": PatientSurgeryId,
            "PrevAnesthesia": "",
            "AssessmentsASA": "",
            "AnesthesiaPlan": "",
            "ReviwedBy": 0,
            "TempDocumentDetails": [],
            "DocumentDetails": [],
            "ConsentFormSignDate": $filter('date')(new Date(), "yyyy-MM-dd"),
            "PreAdmissionStatusId": $scope.PreAdmAnesthetistObj.PreAdmissionStatusId || null,
            "PreAdmissionStatus": $scope.PreAdmAnesthetistObj.PreAdmissionStatus || "",
            "PreAdmissionChartStatus": (str === "SignOff") ? "E" : $scope.PrevAnestheticsObj.PreAdmissionChartStatus,
            "StatusFlag": $scope.PreAdmAnesthetistObj.StatusFlag || "D",
            "ReviewedDate": "",
            "AnesthesiaTypelist": tempAnesthesiaTypelist || [],
            "PrescriptionArray": $scope.PreAdmAnesthetistObj.PrescriptionDetails || [],
            "InvestigationsList": tempInvArray || [],
            "MedicineOrdersInstructions": $scope.PreSurgeryIns.MedicineOrdersInstructions || "",
            "Airway": '',
            "LabNotes": $scope.HealthPhysicalObj.LabNotes || '',
            "PreviousAnesthetics": [],
            "VitalsArray": [],
            "LabInvestigations": [],
            "SystemicHistoryArray": [],
            "LifestyleHistory": $scope.HealthPhysicalObj.LifestyleHistoryArray || [],
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
            "ASAClassificationNotes": $scope.PreAdmAnesthetistObj.ASAClassificationNotes || "",
            "AnesthesiologistReviewedBy": 0,
            "CardioVascular": $scope.HealthPhysicalObj.CardioVascularObj,
            //"IsPreadminAnestiaSave": $scope.PreAdmAnesthetistObj.IsPreadminAnestiaSave || false,
            //"IsAscAnestiaSave": $scope.PreAdmAnesthetistObj.IsAscAnestiaSave || false,
        };

        reqObj.PrevAnesthesia = angular.copy($scope.PrevAnestheticsObj);
        reqObj.AssessmentsASA = $scope.PreAdmAnesthetistObj.ASAObj;
        reqObj.AnesthesiaPlan = angular.copy($scope.APAnesthesiaOptionsObj);

        //reqObj.OrganizationSurgeryId = $scope.SurgeryDiagnosisObj.OrganizationSurgeryId;
        //reqObj.SurgeryId = $scope.SurgeryDiagnosisObj.SurgeryId;
        //reqObj.OrganizationDiagnosisId = $scope.SurgeryDiagnosisObj.OrganizationDiagnosisId;
        //reqObj.DiagnosisId = $scope.SurgeryDiagnosisObj.DiagnosisId;

        reqObj.ReviwedBy = $scope.PreAdmAnesthetistObj.ReviewedBy;

        //if (reqObj.ReviwedBy == null) {
        //    reqObj.ReviewedDate = '';
        //} else {
        //    reqObj.ReviewedDate = ReviewedDate || null;
        //}

        reqObj.ReviewedDate = ReviewedDate || null;
        reqObj.AnesthesiologistReviewedBy = $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedBy;

        var tempVital = $filter("filter")($scope.AllVitalsArray, function (kitem, index) { return kitem.Value != '' });

        if (tempVital.length > 0) {
            reqObj.VitalsArray = tempVital;
        } else {
        }
        var tempAnesthetic = $filter("filter")($scope.PrevAnestheticsObj.PreviousAnesthetics, function (kitem, index) { return kitem.Value != '' || kitem.Remarks != '' });

        if (tempAnesthetic.length > 0) {
            reqObj.PreviousAnesthetics = tempAnesthetic;
        }

        if ($scope.HealthPhysicalObj.LabList.length > 0) {
            angular.forEach($scope.HealthPhysicalObj.LabList, function (item) {
                if (item.ResultValue == '' && item.ResultId !== null) {
                    item.DeleteInd = 'Y';
                }
            });
        }

        var temparray = $filter("filter")($scope.HealthPhysicalObj.LabList, function (kitem, index) { return kitem.ResultValue != '' || kitem.Normal == true || kitem.AbNormal == true || kitem.ResultId != null || kitem.Remarks !== ''});

        if (temparray.length > 0) {
            angular.forEach(temparray, function (item) {
                item.InvestigationResultDate = moment().format("YYYY-MM-DD");
            });
            reqObj.LabInvestigations = temparray;
        } else {
        }

        if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                if (item.IsNormal == true && item.IsChecked == true) {
                    item.IsNoshowROS = true;
                }
                item.PatientDetailId = item.PatientDetailId || 0;                
                item.TypeId = item.TypeId || null;
                if (item.PatientDetailId != 0 && item.IsChecked == false && (item.TypeId == 1 || item.TypeId == 2 || item.TypeId == 3 || item.TypeId == 4 || item.TypeId == 5 || item.TypeId == 6 || item.TypeId == 7 || item.TypeId == 8 || item.TypeId == 9 || item.TypeId == 10 || item.TypeId == 11 || item.TypeId == 12 || item.TypeId == 16 || item.TypeId == 17 || item.TypeId == 21 || item.TypeId == 18)) {
                    item.DeleteInd = "Y";
                }
            });
        }
        var temparray1 = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem, index) { return kitem.Value != '' || kitem.PatientDetailId != 0  || kitem.IsChecked == true });
        if (temparray1.length > 0) {
            reqObj.SystemicHistoryArray = temparray1;
        } else {
        }

        reqObj.Airway = $scope.HealthPhysicalObj.AirwayObj;
        if ($scope.HealthPhysicalObj.AirwayObj.DentitionList.length > 0) {
            var TempOther = $filter('filter')($scope.HealthPhysicalObj.AirwayObj.DentitionList, { 'DentitionId': 22 }, true) || [];
            if (TempOther.length > 0) {
                if (TempOther[0].IsChecked == false) {
                    $scope.HealthPhysicalObj.AirwayObj.Dentition = '';
                }
            }
            var temparray2 = $filter("filter")($scope.HealthPhysicalObj.AirwayObj.DentitionList, function (kitem, index) { return kitem.IsChecked == true });
            reqObj.Airway.DentitionList = temparray2 || [];
        }

        $scope.FilesObj.TempImagesArray = $scope.FilesObj.TempImagesArray || [];
        if ($scope.FilesObj.TempImagesArray.length > 0) {
            angular.forEach($scope.FilesObj.TempImagesArray, function (item) {
                item.DocumentID = item.DocumentID || 0;
                var object = {
                    "file": item.file,
                    "S3URL": item.S3URL || '',
                    "DeleteInd": item.DeleteInd,
                    "DocumentID": item.DocumentID,
                    "DocumentName": item.DocumentName,
                    "FileName": item.FileName,
                    "FileExt": item.FileExt,
                    "FileTypeId": item.FileTypeId,
                    "DisplayName": item.DisplayName,
                };
                if (item.DocumentID === 0) {
                    reqObj.TempDocumentDetails.push(object);
                    reqObj.DocumentDetails.push(object);
                }
                else {
                    reqObj.DocumentDetails.push(object);
                }
            });
        }

        console.log(JSON.stringify(reqObj));
        //return;

        eHnoteSurgeryService.AddUpdatePreAdmissionDetails(reqObj, callbackSuccess, callbackError);

        function callbackSuccess(response) {
            if (response.Status === "Success") {
                alertify.success("Pre-anesthesia data saved successfully!");
                $uibModalInstance.close();
            } else {
                alertify.error("Some Error Occured");
            }
        };
        function callbackError(err) {
            alertify.error("Uploading Failed");
        }
    }


    //orders code start

    $scope.MedicalrxObj = {
        "IsRcopiaa": false,
        "IsCurrentEye": true,
        "IsCurrentSystem": true
    }

    $scope.medicineGetObj = {
        "MedicineObject": ""
    }

    $scope.MedicationObj = {
        "AscOrderTemplateId": 0,
        "TemplateName": ""

    }

    $scope.InvestObj = {
        "AscOrderTemplateId": 0,
        "TemplateName": ""
    }

    $scope.Medicationtemplateover = {
        templateUrl: 'MedicationTemplatSave.html',
    };

    $scope.Investigationtemplateover = {
        templateUrl: 'InvestigationTemplatSave.html',
    };

    $scope.SaveIntraMedicationTemplate = function () {

        if ($scope.MedicationObj.TemplateName == "") {
            alertify.error("Please Enter Template Name!");
            return;
        }

        if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length === 0) {
            alertify.error("Please Add Atleast One Medication");
            return false;
        }

        $scope.MedicationArray = [];
        $scope.MedicationArray = angular.copy($scope.PrescriptionMainAddObj.PrescriptionDetails);

        let templateReq = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "AscOrderTemplateId": $scope.MedicationObj.AscOrderTemplateId || 0,
            "CategoryId": 1,
            "TemplateName": $scope.MedicationObj.TemplateName || "",
            "DeleteInd": "N",
            "PatientAscInvestigations": [],
            "PatientAscMedications": $scope.MedicationArray || [],
            "PatientAscEyeDrops": [],
            "PatientAscInjections": [],
            "Type": 'Medication',
            "TypeId": '1',
        };
        eHnotePatientDataService.AddUpdateUserAscOrderTemplates(templateReq).then(function (resp) {
            if (resp.data.status === "Success") {
                alertify.success("Template saved successfully!");
                $scope.GetUserAscOrderTemplates();
                $scope.IsOpenMedication = false;
                $scope.MedicationObj.TemplateName = "";
            }
            if (resp.data.status === "Failure") {
                alertify.error(resp.data.Message)
            }
        }, function (err) {
            console.log(err);
        });
    };

    function getNewPrescriptionDetailObj() {
        var obj = {
            "PatientPrescriptionDetailId": 0,
            "PatientPrescriptionId": 0,
            "PatientId": $scope.cache.PatientID,
            "MedicationId": 0,
            "RcopiaDrugId": "",
            "RcopiaMedicationId": "",
            "RcopiaPrescriptionId": "",
            "MedicationName": "",
            "DrugNDCID": "",
            "DrugFirstDataBankMedID": "",
            "DrugGenericId": "",
            "DrugBrandName": "",
            "DrugGenericName": "",
            "DrugForm": "",
            "DrugStrength": "",
            "DrugSchedule": "1",
            "DrugSupply": "",
            "DrugCompound": "",
            "MedicationTypeId": "",
            "MedicationTypeName": "",
            "Sig": "",
            "SigId": 0,
            "SigObj": "",
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
            "HasScheduledDrug": "n",
            "PatientInstructions": "",
            "DeleteInd": "N",
            "OtherNotes": "",
            "Remarks": "",
            "StartDate": $scope.CurrentDateMMFormat,
            "StopDate": null,
            "FillDate": $scope.CurrentDateMMFormat,
            "StopReason": "",
            "RcopiaMedicationStatus": "",
            "IsEditMode": true,
            "IsAllSig": false,
            "Type": "",
            "MedicineObj": "",
            "StopReasonId": "",
            "IsMedicationStopped": false,
            "SelectedMedicationHistory": 'CurrentEyeMedication'


        }
        return obj;
    };

    function getnewRcopiaPatientObj() {
        var obj = {
            "FirstName": "",
            "LastName": "",
            "ExternalID": "",
            "DeleteInd": "n",
            "MiddleName": "",
            "RcopiaPatientId": 0,
            "DOB": "",
            "Sex": "",
            "HomePhone": "",
            "Address1": "",
            "Address2": "",
            "City": "",
            "State": "",
            "Zip": "",
            "Suffix": "",
            "Prefix": "",
            "EmailId": "",
            "Race": "",
            "Ethnicity": ""
        };
        return obj;
    }

    $scope.RcopiaPatientObj = getnewRcopiaPatientObj();

    $scope.SigSearch = {
        "Shows": false
    }

    $scope.adnewsigobj = {
        "IsNewSig": false,
        "MedicineId": 0,
    }

    function getnewOrganizationSigObj() {
        var obj = {
            "UserId": $scope.UserId,
            "OrganizationSigTemplateId": 0,
            "OrganizationId": $scope.HospitalId || null,
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
            "DaysSupplyDescription": "",
            "Quantity": "",
            "QuantityUnitId": "",
            "QuantityUnit": "",
            "RefillId": "",
            "Refills": "",
            "DeleteInd": "N",
            "IsFrequent": "N",
            "PageSize": 10,
            "PageNumber": 1,
            "MedicineId": $scope.adnewsigobj.MedicineId || 0,
        };

        return obj;
    }


    $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();

    function getEmptyPrescriptionObj() {

        var TodayDate = $filter('date')(new Date(), "yyyy-MM-dd");

        var obj = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
            "PatientId": $scope.cache.PatientId,
            "RcopiaPatientId": $scope.RcopiaPatientObj.RcopiaPatientId,
            "PatientPrescriptionId": 0,
            "AppointmentId": $scope.cache.AppointmentId,
            "ProviderId": $scope.cache.DoctorId,
            "PrescribedDate": TodayDate,
            "RcopiaPrescriptionId": "",
            "LastUpdateDate": TodayDate,
            "PharmacyId": 0,
            "RcopiaPharmacyId": "",
            "PrescriberOrderNumber": "",
            "RxReferenceNumber": "",
            "PrescriptionAction": "",
            "CompletedDate": null,
            "SignedDate": null,
            "StopDate": null,
            "IsNKMSelected": false,
            "LastModifiedBy": $scope.UserId,
            "LastModifiedDate": TodayDate,
            "CompleteAction": "Created",
            "PrescriptionSentMethod": "",
            "PrescriptionStatus": "",
            "DeleteInd": "N",
            "RcopiaDeleted": "n",
            "PrescriptionDetails": []
        };
        return obj;
    };

    $scope.PrescriptionMainAddObj = getEmptyPrescriptionObj();

    $scope.Surgeryobj = {
        'MedicineObject': '',
        'CurrentMedicationobj': '',
        'SubType': 'PreSurgery',
        'PreMedicationslist': [],
        'CurrentMedicationslist': [],
        'Investigationslist': [],
        'EnterPreSurgeryTemplateName': "",
        'SelectedPreSurgeryTemplateName': "",
        "PrescriptionDetails": ""
    }

    $scope.PreSurgeryIns = { "MedicineOrdersInstructions": "" }

    // orders from cardiology
    $scope.CardiologyPrescription = [];
    $scope.CardiologyInvestigations = [];
    if ($scope.cache.PrescriptionDetails.length > 0) {
        $scope.CardiologyPrescription = angular.copy($scope.cache.PrescriptionDetails);
        $scope.PrescriptionMainAddObj = angular.copy($scope.cache.PrescriptionDetails[0]);
        $scope.PrescriptionMainAddObj.PrescriptionDetails = [];
        if ($scope.cache.PrescriptionDetails[0].PrescriptionDetails.length > 0) {
            let tempArray = $filter('filter')($scope.cache.PrescriptionDetails[0].PrescriptionDetails, { 'TypeId': 3 }, true);
            $scope.CardiologyPrescription[0].PrescriptionDetails = [];
            if (tempArray.length > 0) {
                angular.forEach(tempArray, function (item) {
                    $scope.CardiologyPrescription[0].PrescriptionDetails.push(item);
                });
            }
        }
    }

    if ($scope.cache.InvestigationsList.length > 0) {
        $scope.CardiologyInvestigations = $filter('filter')($scope.cache.InvestigationsList, { 'TypeId': 3 }, true) || [];
    }


    // orders from cardiology end


    $scope.PrescriptionChange = function (obj) {
        obj = obj || "";
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
                "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId
            }
            return eHnoteConditionsDataService.getDrugDetailDataFromRcopia(req).then(function (resp) {
                resp.data.DrugDetailsList = resp.data.DrugDetailsList || [];
                if (resp.data.DrugDetailsList.length > 0) {
                    return resp.data.DrugDetailsList.map(function (item) {
                        return item;
                    });
                }
            });
        }
    }

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

    $scope.pushPrescriptionMedicationDetails1 = function (obj, type, type1) {
        console.log(JSON.stringify(obj));
        $scope.SigSearch.Shows = false;
        obj.SigfieldsShows = false;
        $scope.adnewsigobj.IsNewSig = false;
        var newmedicationobj = getNewPrescriptionDetailObj();

        if (type === 'Rcopia') {
            newmedicationobj.RcopiaDrugId = obj.RcopiaDrugId;
            newmedicationobj.DrugNDCID = obj.RcopiaDrugNDCID;
            newmedicationobj.DrugFirstDataBankMedID = obj.FirstDataBankMedID;
            newmedicationobj.DrugGenericId = obj.GenericID;
            newmedicationobj.DrugBrandName = obj.BrandName;
            newmedicationobj.DrugGenericName = obj.GenericName;
            newmedicationobj.DrugForm = obj.Form;
            newmedicationobj.DrugStrength = obj.Strength;
            newmedicationobj.MedicationName = obj.BrandName + " " + obj.Strength;
            newmedicationobj.DrugSchedule = obj.Schedule;
            newmedicationobj.DrugSupply = obj.RouteCode;
            newmedicationobj.DrugCompound = "";
            newmedicationobj.Type = type1;
            newmedicationobj.IsMedicationStopped = false;
            newmedicationobj.SigFormationFields = false;
            newmedicationobj.isEditFocused = false;
            newmedicationobj.isAddFocused = false;
            newmedicationobj.SelectedMedicationHistory = 'CurrentEyeMedication';
            newmedicationobj.TypeId = 2;

            var mparams = {
                "UserId": $scope.UserId,
                "MedicineId": 0,
                "RcopiaDrugId": obj.RcopiaDrugId,
                "DrugNDCID": obj.RcopiaDrugNDCID,
                "FirstDataBankMedID": obj.FirstDataBankMedID,
                "DrugGenericID": obj.GenericID,
                "DrugName": obj.BrandName,
                "GenericName": obj.GenericName,
                "MedicineType": obj.Form,
                "Strength": obj.Strength,
                "Schedule": obj.Schedule,
                "RouteCode": obj.RouteCode,
                "RxNormList": []
            }

            if (obj.RxNormList.length > 0) {
                var filteredRxNorm = $filter("filter")(obj.RxNormList, { "Status": 'a' }, true) || [];
                if (filteredRxNorm.length > 0) {
                    newmedicationobj.DrugRxNormId = filteredRxNorm[0].RxnormID;
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
                    newmedicationobj.MedicationId = response.data.MedicineId;

                    if (response.data.RxNormList.length > 0) {
                        var filteredRxNorm = $filter("filter")(obj.RxNormList, { "Status": 'a', "Representative": 'y' }, true) || [];
                        if (filteredRxNorm.length > 0) {
                            newmedicationobj.DrugRxNormId = filteredRxNorm[0].RxnormID;
                        }
                    }

                    var medi = 0;
                    if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                        angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                            if (item.MedicationId == newmedicationobj.MedicationId) {
                                medi++;
                            }
                        });
                    }


                    // when showing cardiology orders separately for display

                    if ($scope.CardiologyPrescription.length > 0) {
                        angular.forEach($scope.CardiologyPrescription, function (kitem) {
                            angular.forEach(kitem.PrescriptionDetails, function (item) {
                                if (item.MedicationId == newmedicationobj.MedicationId) {
                                    medi++;
                                }
                            });
                        });
                    }

                    if (medi > 0) {
                        alertify.error('You have already entered this Drug');
                        $scope.medicineGetObj.MedicineObject = "";
                    } else {
                        $scope.PrescriptionMainAddObj.PrescriptionDetails.unshift(newmedicationobj);
                        $scope.medicineGetObj.MedicineObject = "";
                    }

                }
            });
        }
        else {
            newmedicationobj.MedicationId = obj.MedicineId;
            newmedicationobj.DrugBrandName = obj.MedicineName;
            newmedicationobj.MedicationName = obj.MedicineName;
            newmedicationobj.DrugSchedule = obj.ScheduleType;
            newmedicationobj.DrugStrength = obj.Strength;
            newmedicationobj.DrugGenericName = obj.GenericName;

            newmedicationobj.RcopiaDrugId = obj.RcopiaDrugId || "";
            newmedicationobj.DrugNDCID = obj.RcopiaDrugNDCID || "";
            newmedicationobj.DrugFirstDataBankMedID = obj.FirstDataBankMedID || "";
            newmedicationobj.DrugGenericId = obj.GenericID || "";
            newmedicationobj.Type = type1;
            newmedicationobj.IsMedicationStopped = false;
            newmedicationobj.RxNormList = obj.RxNormList || [];
            newmedicationobj.SigFormationFields = false;
            newmedicationobj.isEditFocused = false;
            newmedicationobj.isAddFocused = false;
            newmedicationobj.SelectedMedicationHistory = 'CurrentEyeMedication';
            newmedicationobj.TypeId = 2;

            if (obj.RxNormList.length > 0) {
                let filteredRxNorm = $filter("filter")(obj.RxNormList, { "Status": 'a', "Representative": 'y' }, true) || [];
                if (filteredRxNorm.length > 0) {
                    newmedicationobj.DrugRxNormId = filteredRxNorm[0].RXNormId;
                }
            }
            var medi = 0;
            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                    if (item.MedicationId == newmedicationobj.MedicationId) {
                        medi++;
                    }
                });
            }

            // when showing cardiology orders separately for display

            if ($scope.CardiologyPrescription.length > 0) {
                angular.forEach($scope.CardiologyPrescription, function (kitem) {
                    angular.forEach(kitem.PrescriptionDetails, function (item) {
                        if (item.MedicationId == newmedicationobj.MedicationId) {
                            medi++;
                        }
                    });
                });
            }


            if (medi > 0) {
                alertify.error('You have already entered this Drug');
                $scope.medicineGetObj.MedicineObject = "";
            } else {
                $scope.PrescriptionMainAddObj.PrescriptionDetails.unshift(newmedicationobj);
                $scope.medicineGetObj.MedicineObject = "";
            }
        }

        if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
            $scope.PrescriptionMainAddObj.IsNKMSelected = false;
        }
    };

    $scope.Selectedmedic = function (item, val) {
        item.SelectedMedicationHistory = val;
    }

    $scope.RemovePrescriptionDetailObj = function (index, item) {
        item.PatientPrescriptionDetailId = item.PatientPrescriptionDetailId || 0;
        if (item.PatientPrescriptionDetailId != 0) {
            item.DeleteInd = 'Y';

            item.RcopiaMedicationId = item.RcopiaMedicationId || "";
            console.log(item.RcopiaMedicationId + "__RcopiaMedicationId");

            $scope.PrescriptionMainAddObjFOrDelete = getEmptyPrescriptionObj();
            $scope.PrescriptionMainAddObjFOrDelete.PatientPrescriptionId = item.PatientPrescriptionId;

            var newmedicationobj = getNewPrescriptionDetailObj();
            newmedicationobj.PatientPrescriptionDetailId = item.PatientPrescriptionDetailId;
            newmedicationobj.PatientPrescriptionId = item.PatientPrescriptionId;
            newmedicationobj.MedicationId = item.MedicationId;
            newmedicationobj.RcopiaDrugId = item.RcopiaDrugId || 0;
            newmedicationobj.RcopiaMedicationId = item.RcopiaMedicationId || "";
            newmedicationobj.MedicationName = item.MedicationName || 0;
            newmedicationobj.DrugNDCID = item.DrugNDCID || "";
            newmedicationobj.DrugFirstDataBankMedID = item.DrugFirstDataBankMedID || "";
            newmedicationobj.DrugGenericId = item.DrugGenericId || "";
            newmedicationobj.DrugBrandName = item.DrugBrandName || "";
            newmedicationobj.DrugGenericName = item.DrugGenericName || "";
            newmedicationobj.DrugForm = item.DrugForm || "";
            newmedicationobj.DrugStrength = item.DrugStrength || "";
            newmedicationobj.DrugSchedule = item.DrugSchedule || "";
            newmedicationobj.DrugSupply = item.DrugSupply || "";
            newmedicationobj.DrugCompound = item.DrugSupply || "";
            newmedicationobj.MedicationTypeId = item.MedicationTypeId || "";
            newmedicationobj.MedicationTypeName = item.MedicationTypeName || "";
            newmedicationobj.Sig = item.Sig || "";
            newmedicationobj.SigId = item.SigId || "";
            newmedicationobj.ActionId = item.ActionId || "";
            newmedicationobj.Action = item.Action || "";
            newmedicationobj.DoseId = item.DoseId || "";
            newmedicationobj.Dose = item.Dose || "";
            newmedicationobj.DoseUnitId = item.DoseUnitId || "";
            newmedicationobj.DoseUnit = item.DoseUnit || "";
            newmedicationobj.RouteId = item.RouteId || "";
            newmedicationobj.Route = item.Route || "";
            newmedicationobj.FrequencyId = item.FrequencyId || "";
            newmedicationobj.Frequency = item.Frequency || "";
            newmedicationobj.DoseOtherId = item.DoseOtherId || "";
            newmedicationobj.DoseOther = item.DoseOther || "";
            newmedicationobj.DaysSupplyId = item.DaysSupplyId || "";
            newmedicationobj.DaysSupply = item.DaysSupply || "";
            newmedicationobj.Quantity = item.Quantity || "";
            newmedicationobj.QuantityUnitId = item.QuantityUnitId || "";
            newmedicationobj.QuantityUnit = item.QuantityUnit || "";
            newmedicationobj.RefillId = item.RefillId || "";
            newmedicationobj.Refills = item.Refills || "";
            newmedicationobj.SubstitutionPermitted = item.SubstitutionPermitted || "";
            newmedicationobj.PatientInstructions = item.PatientInstructions || "";
            newmedicationobj.DeleteInd = "Y";
            newmedicationobj.OtherNotes = "";
            newmedicationobj.Remarks = "";
            newmedicationobj.StartDate = "";
            newmedicationobj.StopDate = "";
            newmedicationobj.FillDate = "";
            newmedicationobj.StopReason = "";
            newmedicationobj.RcopiaMedicationStatus = 0;
            newmedicationobj.IsEditMode = false;
            newmedicationobj.SigFormationFields = false;
            $scope.PrescriptionMainAddObjFOrDelete.PrescriptionDetails.push(newmedicationobj);


            console.log(JSON.stringify($scope.PrescriptionMainAddObjFOrDelete));

            eHnotePatientDataService.AddUpdatePatientPrescriptionDetails($scope.PrescriptionMainAddObjFOrDelete, OnAddSigSuccess, OnAddSigError);
            function OnAddSigSuccess(response) {
                if (response.status === "Success") {
                    alertify.success("Medication Deleted  Successfully");
                    $scope.PrescriptionMainAddObj.PrescriptionDetails.splice(index, 1);
                    if (item.RcopiaMedicationId !== "") {

                        $scope.AddNewPrescriptionObj = getnewPrescriptionObj();

                        $scope.AddNewPrescriptionObj.PatientPrescriptionId = $scope.PrescriptionMainAddObjFOrDelete.PatientPrescriptionId || 0;

                        angular.forEach($scope.PrescriptionMainAddObjFOrDelete.PrescriptionDetails, function (pitem) {

                            var scheduletype = "unknown";
                            if (pitem.DrugSchedule == "0" || pitem.DrugSchedule == "" || pitem.DrugSchedule === 0) {
                                scheduletype = "unknown";
                            } else {
                                scheduletype = pitem.DrugSchedule;
                            }

                            if (pitem.DrugSchedule === "3" || pitem.DrugSchedule === "2" || pitem.DrugSchedule === "4" || pitem.DrugSchedule === "5" || pitem.DrugSchedule === "scheduled") {
                                pitem.HasScheduledDrug = "y";
                            }
                            var StopDate = $filter('date')(pitem.StopDate, "MM/dd/yyyy HH:mm:ss");
                            var obj = {
                                "PatientMedicationId": pitem.PatientPrescriptionDetailId,
                                "IsInPatientMedication": "n",
                                "HistorySource": "patient",
                                "HasScheduledDrug": pitem.HasScheduledDrug,
                                "Deleted": "y",
                                "RcopiaMedicationId": pitem.RcopiaMedicationId || "",
                                "MedicationId": pitem.MedicationId,
                                "DrugRocipaId": pitem.RcopiaDrugId,
                                "DrugFirstDataBankMedID": pitem.DrugFirstDataBankMedID,
                                "DrugNDCID": pitem.DrugNDCID,
                                "DrugRxNormId": pitem.DrugRxNormId,
                                "DrugBrandName": pitem.DrugBrandName,
                                "GenericName": pitem.DrugGenericName,
                                "Form": pitem.DrugForm,
                                "Schedule": scheduletype,
                                "Strength": pitem.DrugStrength,
                                "Supply": "n",
                                "Compound": "n",
                                "Action": pitem.DrugAction,
                                "Dose": pitem.DrugDose,
                                "Route": pitem.DoseRoute,
                                "DoseUnit": pitem.DoseUnit,
                                "DoseTiming": pitem.DoseTiming,
                                "DoseOther": pitem.DoseOther,
                                "Duration": pitem.DoseDuration,
                                "Quantity": pitem.DoseQuantity,
                                "QuantityUnit": pitem.QuantityUnit,
                                "Refills": pitem.Refills,
                                "SubstitutionPermitted": pitem.SubstitutionPermitted,
                                "OtherNotes": pitem.OtherNotes,
                                "PatientNotes": pitem.PatientNotes,
                                "Comments": "",
                                "StartDate": $scope.CurrentDateMMFormat,
                                "StopDate": StopDate,
                                "FillDate": $scope.CurrentDateMMFormat,
                                "StopReason": pitem.MedicineStopReason,
                                "DeleteInd": pitem.DeleteInd
                            };

                            $scope.AddNewPrescriptionObj.MedicationsList.push(obj);

                        });

                        eHnoteDiagnosisDataServices.addPatientMedicationsToRcopia($scope.AddNewPrescriptionObj).then(function (response) {
                            if (response.status === 'Success') {

                            }
                        });
                    }
                }
            }
            function OnAddSigError() {
                alertify.error("Creating  Failed");
            }
        } else {
            $scope.PrescriptionMainAddObj.PrescriptionDetails.splice(index, 1);
        }

    };

    $scope.ClearMedicineItem = function (mainitem) {
        mainitem.ActionId = "";
        mainitem.Action = "";
        mainitem.Dose = "";
        mainitem.DoseUnit = "";
        mainitem.Route = "";
        mainitem.Frequency = "";
        mainitem.DoseOther = "";
        mainitem.DaysSupply = "";
        mainitem.QuantityUnit = "";
        mainitem.DoseId = "";
        mainitem.DoseUnitId = "";
        mainitem.RouteId = "";
        mainitem.FrequencyId = "";
        mainitem.DoseOtherId = "";
        mainitem.DaysSupplyId = "";
        mainitem.Quantity = "";
        mainitem.QuantityUnitId = "";
        mainitem.RefillId = "";
        mainitem.Refills = "";
        mainitem.PatientInstructions = "";
        mainitem.SigObj = "";
        mainitem.MedicineObj = ""
    }

    $scope.getParticularSigMedicationitems = function (text, item) {
        text = text || '';
        var params = {
            "MedicineId": item.MedicationId,
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

    $scope.ONSigDetailsMedOrders = function (item, mainitem) {
        console.log(item);
        console.log(mainitem);
        $scope.adnewsigobj.IsNewSig = false;
        mainitem.isAddFocused = false;
        mainitem.isEditFocused = false;
        mainitem.SigfieldsShows = true;
        //mainitem.SigFields = true;
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
        mainitem.MedicineObj = ''

        if (item.DaysSupplyId != 0) {
            var filteredArray = $filter("filter")($scope.DurationArray, { "MedicineDosaageFieldId": mainitem.DaysSupplyId }, true);
            if (filteredArray.length > 0) {
                var DateCode = filteredArray[0].Code;
                var currentDate = new Date();
                var futureDate = new Date(currentDate.getTime() + (parseInt(DateCode) * 24 * 60 * 60 * 1000));
                mainitem.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');
            }
        }
    };

    $scope.ONSigDetailsSig = function (item, mainitem) {
        $scope.adnewsigobj.IsNewSig = false;
        console.log(item);
        console.log(mainitem);
        mainitem.isAddFocused = false;
        mainitem.isEditFocused = false;
        mainitem.SigfieldsShows = true;
        //mainitem.SigFields = true;
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

        if (item.DaysSupplyId != 0) {
            var filteredArray = $filter("filter")($scope.DurationArray, { "MedicineDosaageFieldId": mainitem.DaysSupplyId }, true);
            if (filteredArray.length > 0) {
                var DateCode = filteredArray[0].Code;
                var currentDate = new Date();
                var futureDate = new Date(currentDate.getTime() + (parseInt(DateCode) * 24 * 60 * 60 * 1000));
                mainitem.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');/* $filter('date')(futureDate, 'MM/dd/yyyy HH:mm:ss');*/
            }
        }
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

    $scope.changeSigForMedicine = function (item) {
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
    };

    $scope.EditSigFields = function (item) {
        item.SigFields = !item.SigFields;
        $scope.adnewsigobj.IsNewSig = false;
        item.isEditFocused = true;
        item.isAddFocused = false;

    }

    $scope.AddNewMedicineIdchange = function (item) {

        if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
            angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                item.SigFormationFields = false;
                item.isAddFocused = false;

            });
        }

        item.MedicineObj = '';
        item.SigObj = '';
        $scope.adnewsigobj.MedicineId = item.MedicationId || 0;
        /* $scope.adnewsigobj.IsNewSig = !$scope.adnewsigobj.IsNewSig;*/
        $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
        item.SigFields = false;
        /* item.SigFormationFields = !item.SigFormationFields;*/
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
        var filteredArray = $filter("filter")($scope.ActionArray, { "MedicineDosaageFieldId": mainobj.ActionId }, true);
        if (filteredArray.length > 0) {
            mainobj.Action = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescDose = function (mainobj) {
        var filteredArray = $filter("filter")($scope.DoseArray, { "MedicineDosaageFieldId": mainobj.DoseId }, true);
        if (filteredArray.length > 0) {
            mainobj.Dose = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescDoseUnit = function (mainobj) {
        var filteredArray = $filter("filter")($scope.DoseUnitArray, { "MedicineDosaageFieldId": mainobj.DoseUnitId }, true);
        if (filteredArray.length > 0) {
            mainobj.DoseUnit = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescRoute = function (mainobj) {
        var filteredArray = $filter("filter")($scope.RouteArray, { "MedicineDosaageFieldId": mainobj.RouteId }, true);
        if (filteredArray.length > 0) {
            mainobj.Route = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescFrequency = function (mainobj) {
        var filteredArray = $filter("filter")($scope.FrequencyArray, { "MedicineDosaageFieldId": mainobj.FrequencyId }, true);
        if (filteredArray.length > 0) {
            mainobj.Frequency = filteredArray[0].Description;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescDoseOther = function (mainobj) {
        var filteredArray = $filter("filter")($scope.DoseOtherArray, { "MedicineDosaageFieldId": mainobj.DoseOtherId }, true);
        if (filteredArray.length > 0) {
            mainobj.DoseOther = filteredArray[0].Code;
        };
        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescDaysSupply = function (mainobj) {
        var filteredArray = $filter("filter")($scope.DurationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
        if (filteredArray.length > 0) {

            mainobj.DaysSupply = filteredArray[0].Code;
            mainobj.DaysSupplyDescription = filteredArray[0].Description;

            var DateCode = filteredArray[0].Code;
            var currentDate = new Date();
            var futureDate = new Date(currentDate.getTime() + (parseInt(DateCode) * 24 * 60 * 60 * 1000));
            mainobj.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');/* $filter('date')(futureDate, 'MM/dd/yyyy HH:mm:ss');*/
        };

        $scope.addSIgNameDynamicallyAdded();
    };

    $scope.changePrescQuantityUnit = function (mainobj) {
        var filteredArray = $filter("filter")($scope.QuantityUnitArray, { "MedicineDosaageFieldId": mainobj.QuantityUnitId }, true);
        if (filteredArray.length > 0) {
            mainobj.QuantityUnit = filteredArray[0].Code;
        };
    };

    $scope.changePrescRefill = function (mainobj) {
        var filteredArray = $filter("filter")($scope.RefillsArray, { "MedicineDosaageFieldId": mainobj.RefillId }, true);
        if (filteredArray.length > 0) {
            mainobj.Refills = filteredArray[0].Code;
        };
    };

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
        if ($scope.addNewOrganizationSigObj.Quantity == '') {
            alertify.error("Please Enter Quantity");
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
            $scope.toggleAddSigFields();
            $scope.getOrganizationMedicationSigitems();
            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                    item.SigFields = true;
                });
            }

        }
        function OnAddSigError() {
            alertify.error("Creating  Failed");
        }
    };

    $scope.onselectInvestigation = function (InvObject) {

        if (InvObject.ProcedureId === '') {
            InvObject.InvestigationName = '';
            return false;
        }
        $scope.Surgeryobj.InvestigationObj = InvObject || "";
        if ($scope.Surgeryobj.InvestigationObj === "") {
            return;
        }
        var object = {
            "PatientInvestigationId": 0,
            "ProcedureCode": $scope.Surgeryobj.InvestigationObj.ProcedureCode || "",
            "OrgInvestigationId": $scope.Surgeryobj.InvestigationObj.OrganizationProcedureId,
            "InvestigationId": $scope.Surgeryobj.InvestigationObj.ProcedureId,
            "InvestigationName": $scope.Surgeryobj.InvestigationObj.ProcedureName,
            "InvestigationDate": $filter("date")(new Date(), "dd-MMM-yyyy"),
            "OrganId": "",
            "InvestigationNotes": $scope.Surgeryobj.InvestigationObj.Notes || "",
            "DeleteInd": "N",
            "IsEdit": false,
            "IsNoteEdit": false,
            "ShowDateFormat": false,
            "DurationDate": null,
            "Duration": null,
            "DurationType": "",
            "Remarks": "",
            "LocationId": null,
            "LabInvestFocus": false,
            "TypeId": 2
        }

        var i = 0;
        $scope.Surgeryobj.Investigationslist = $scope.Surgeryobj.Investigationslist || [];
        if ($scope.Surgeryobj.Investigationslist.length > 0) {
            angular.forEach($scope.Surgeryobj.Investigationslist, function (item) {
                if (item.InvestigationId === $scope.Surgeryobj.InvestigationObj.ProcedureId && item.DeleteInd === 'N') {
                    i++;
                }
            });
        }

        // when showing cardiology orders separately for display

        if ($scope.CardiologyInvestigations.length > 0) {
            angular.forEach($scope.CardiologyInvestigations, function (kitem) {
                if (kitem.InvestigationId == $scope.Surgeryobj.InvestigationObj.ProcedureId) {
                    i++;
                }
            });
        }


        if (i > 0) {
            alertify.error('You already entered this Investigation');
            $scope.Surgeryobj.InvestigationObj = "";
        }
        if (i === 0) {
            $scope.Surgeryobj.Investigationslist.push(object);
            $scope.Surgeryobj.InvestigationObj = "";
        }
        return false;

    };

    $scope.GetOrganizationTypeOfService = function (text) {
        var Type = 'Investigation';

        var params = {
            "OrganizationId": $scope.HospitalId,
            "ProcedureId": 0,
            "PageNumber": 1,
            "PageSize": 10,
            "CPTCODE": "",  // cptcode tblorganizationprocedure
            "SearchText": text || "", // searchtext
            "TypeOfServiceId": 0,
            "Type": Type || 0,
            /*"IsFrequent": 'N'*/
            "IsFrequent": 'N',
            "ParentOrganizationId": $scope.ParenthospitalId || null
        };

        if (params.SearchText == "") {
            params.IsFrequent = "Y";
        }

        return eHnoteSettingsDataService.GetOrganizationProceduresByType(params).then(function (resp) {
            if (resp.data.rows !== undefined) {
                return resp.data.rows.map(function (item) {
                    return item;
                });
            }
        });
    };

    $scope.OnselectInvestNotesTemplates = function (item) {
        $scope.Surgeryobj.Investigationslist = item.PatientAscInvestigations || [];

        angular.forEach($scope.Surgeryobj.Investigationslist, function (item) {
            //if (item.Remarks != '') {
            //    item.IsNoteEdit = true;
            //    item.InvestigationNotes = item.Remarks;

            //}
            //item.DurationDate = item.DurationDate || null;
            //if (item.DurationDate != null) {
            //    item.ShowDateFormat = true;
            //    item.DurationDate = $filter("date")(item.DurationDate, "MM-dd-yyyy");
            //}

            item.Remarks = '';
            item.DurationDate = null;
            item.OrganId = '';
            item.LocationId = null;
            item.Duration = null;
            item.DurationType = '';
        });


    }


    $scope.LabInvestNotes = function (item) {
        item.IsNoteEdit = !item.IsNoteEdit;
        item.LabInvestFocus = true;
    }

    $scope.ChangeDuration = function (item) {
        item.DurationDate = null;
    };

    $scope.ChangeItem = function (item) {
        item.ShowDateFormat = !item.ShowDateFormat;
    };

    $scope.ChangeFormatDate = function (item) {
        item.Duration = null;
        item.DurationType = '';
    }

    $scope.GetLocationName = function () {
        return [{
            "LocationId": 1,
            "LocationName": "OD"
        },
        {
            "LocationId": 2,
            "LocationName": "OS"
        },
        {
            "LocationId": 3,
            "LocationName": "OU"
        },
        {
            "LocationId": 4,
            "LocationName": "GENERAL"
        }
        ];
    };
    $scope.GetLocationNameList = angular.copy($scope.GetLocationName());

    $scope.GetOrganName = function () {
        return [{
            "OrganId": 1,
            "OrganName": "OD"
        },
        {
            "OrganId": 2,
            "OrganName": "OS"
        },
        {
            "OrganId": 3,
            "OrganName": "OU"
        }
        ];
    };
    $scope.GetOrganNameList = angular.copy($scope.GetOrganName());

    $scope.ChangeLocation = function (List, Litem) {
        if (Litem === 1) {
            List.OrganId = List.OrganId || '';
        } else {
            List.OrganId = '';
        }
    }

    $scope.DelectInvestigation = function (Aitem) {
        var index = $scope.Surgeryobj.Investigationslist.indexOf(Aitem);
        if (Aitem.PatientInvestigationId === 0) {
            if (index > -1) {
                $scope.Surgeryobj.Investigationslist.splice(index, 1);
            }
        } else {
            $scope.Surgeryobj.Investigationslist[index].DeleteInd = 'Y';
        }
    };

    $scope.GetUserAscOrderTemplates = function () {
        var params = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "CategoryId": 1
        }
        eHnotePatientDataService.GetUserAscOrderTemplates(params).then(function (resp) {
            if (resp.data.status == "Success") {
                $scope.MedicationTemplates = resp.data.Medications || [];
                $scope.InvestigationTemplates = resp.data.Investigations || [];
            }

        }, function (err) {

        });
    };
    $scope.GetUserAscOrderTemplates();

    $scope.IsOpenMedicationTemp = function () {
        $scope.IsOpenMedication = true;
    }

    $scope.IsOpenInvestigationTemp = function () {
        $scope.IsOpenInvestigation = true;
    }

    $scope.OnselectMedicationNotesTemplates = function (item) {
        console.log(item);
        $scope.PrescriptionMainAddObj.PrescriptionDetails = item.PatientAscMedications || [];

        if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
            angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (Citem) {
                Citem.SigObj = Citem.Sig;
                Citem.TypeId = 2;
                var NewDate = new Date();
                Citem.StartDate = $filter("date")(NewDate, "MM/dd/yyyy");
                if (Citem.DaysSupplyId != 0) {
                    var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": Citem.DaysSupplyId }, true);
                    if (filteredArray.length > 0) {
                        var DateCode = filteredArray[0].Code;
                        var currentDate = new Date();
                        var futureDate = new Date(currentDate.getTime() + (parseInt(DateCode) * 24 * 60 * 60 * 1000));
                        Citem.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');
                    }
                }

            });
        }
    }

    $scope.SaveIntraInvestTemplate = function () {

        if ($scope.InvestObj.TemplateName == "") {
            alertify.error("Please Enter Template Name!");
            return;
        }


        if ($scope.Surgeryobj.Investigationslist.length === 0) {
            alertify.error("Please Add Atleast One Investigation");
            return false;
        }


        angular.forEach($scope.Surgeryobj.Investigationslist, function (item) {
            if (item.InvestigationNotes != '') {
                item.Remarks = item.InvestigationNotes;
            }

        });

        $scope.InvestigationArray = [];
        $scope.InvestigationArray = angular.copy($scope.Surgeryobj.Investigationslist);

        let templateReq = {
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "AscOrderTemplateId": $scope.InvestObj.AscOrderTemplateId || 0,
            "CategoryId": 1,
            "TemplateName": $scope.InvestObj.TemplateName || "",
            "DeleteInd": "N",
            "PatientAscInvestigations": $scope.InvestigationArray || [],
            "PatientAscMedications": [],
            "PatientAscEyeDrops": [],
            "PatientAscInjections": [],
            "Type": 'Investigation',
            "TypeId": '2',
        };
        eHnotePatientDataService.AddUpdateUserAscOrderTemplates(templateReq).then(function (resp) {
            if (resp.data.status === "Success") {
                alertify.success("Template saved successfully!");
                $scope.GetUserAscOrderTemplates();
                $scope.IsOpenInvestigation = false;
                $scope.InvestObj.TemplateName = "";
            }
            if (resp.data.status === "Failure") {
                alertify.error(resp.data.Message)
            }
        }, function (err) {
            console.log(err);
        });
    };

    $scope.doseArray = [];
    $scope.doseOtherArray = [];
    $scope.frequencyArray = [];
    $scope.refillsArray = [];
    $scope.durationArray = [];
    $scope.actionArray = [];
    $scope.routeArray = [];
    $scope.doseUnitArray = [];
    $scope.quantityUnitArray = [];

    // orders code end

    $scope.GetHealthPreAdmAnesthetistObj = function () {
        return {
            "PreAdmissionId": 0,
            "OrganizationId": $scope.HospitalId || 0,
            "UserId": $scope.UserId,
            "PatientId": $scope.cacheStorageItem.PatientID || 0,
            "AppointmentId": $scope.cacheStorageItem.SelectedAppointmentId || 0,
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
            "LabNotes": '',
            "IsGeneralappearanceWNL": false,
            "SystemicHistoryArray": [],
            "ReviewedDate": "",
            "ReviewedTime": "",
            "DocumentDetails": [],
            "TempImagesArray": [],
            "AppointmentID": $scope.cacheStorageItem.AppointmentId,
            "ChemistryNotesInd": false,
            "SocialNotesInd": false,
            "AirwayObjPreAdmnotesInd": false,
            "PreviousPreAdmAnesthetistData": "",
            "PreAdmAppointmentId": 0,
            "AscAppointmentId": 0,
            "IsPreadminAnestiaSave": false,
            "IsAscAnestiaSave": false,
        };
    };
    $scope.IsshowCopyPrevious = false;
    $scope.PreviousPreAdmAppntData = [];
    $scope.init = function () {
        $scope.HealthPhysicalObj = angular.copy($scope.GetHealthPreAdmAnesthetistObj());
        $scope.TemperatureUnits = [
            {
                "Unit": "°F",
                "UnitId": 1
            },
            {
                "Unit": "°C",
                "UnitId": 2
            }
        ];

        $scope.ECGUnits = [
            {
                "Unit": "mV",
                "UnitId": 13
            },
            {
                "Unit": "sec",
                "UnitId": 14
            },
            {
                "Unit": "ms",
                "UnitId": 15
            },
            {
                "Unit": "Hz",
                "UnitId": 16
            },
            {
                "Unit": "BPM",
                "UnitId": 17
            }
        ];
        let appointmentId;
        //if ($scope.cacheStorageItem.AppointmentTypeId === 4) {
        //    appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
        //}
        //if ($scope.cacheStorageItem.AppointmentTypeId === 7 || $scope.cacheStorageItem.AppointmentTypeId === 6) {
        //    appointmentId = $scope.cacheStorageItem.AppointmentId;
        //}

        appointmentId = $scope.cacheStorageItem.AppointmentId;

        let PatientSurgeryId = null;
        if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
            $scope.IsshowCopyPrevious = true;
            if ($scope.cacheStorageItem.PreAdmSurgeryList.length > 0) {
                PatientSurgeryId = $scope.cacheStorageItem.PreAdmSurgeryList[0].PatientSurgeryId;
            }
        } else if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
            $scope.IsshowCopyPrevious = false;
            $scope.cacheStorageItem.CurrentPreAdmAppointmentId = $scope.cacheStorageItem.CurrentPreAdmAppointmentId || 0
            $scope.cacheStorageItem.PreAdmAppointmentId = $scope.cacheStorageItem.PreAdmAppointmentId || 0;
            if ($scope.cacheStorageItem.PreAdmAppointmentId == 0) {
                $scope.IsshowCopyPrevious = true;
            }
            //if ($scope.cacheStorageItem.CurrentPreAdmAppointmentId != 0) {
            //    $scope.IsshowCopyPrevious = false;
            //    if ($scope.cacheStorageItem.CurrentPreAdmAppointmentId != $scope.cacheStorageItem.PreAdmAppointmentId) {
            //        $scope.IsshowCopyPrevious = true;
            //    }
            //}
        
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
        let previousreq = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
 /*           "AppointmentId": appointmentId || 0,*/
            "PatientId": $scope.cacheStorageItem.PatientID || 0,
        };

        //var Req = {
        //    "ParentOrganizationId": $scope.ParenthospitalId,
        //};

        $q.all([
            eHnoteDiagnosisDataServices.GetMedicineDosageFieldsMasterData(),
            eHnoteDiagnosisDataServices.GetAllMasterConsultationData(),
            eHnoteSurgeryService.GetPreAdmissionHealthCategories($scope.ParenthospitalId),
            eHnoteSurgeryService.GetPatientPreAdmissionDetails(ReqObj),
            eHnoteDiagnosisDataServices.GetMasterCategoryDetails(),
            eHnoteSurgeryService.GetPatientPreviousPreAdmAppntData(previousreq)

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
            }
            if (resp[1].data.status === "Success") {
                $scope.HealthPhysicalObj.AlcoholStatus = resp[1].data.AlcoholStatus || [];
                $scope.HealthPhysicalObj.AlcoholQuantity = resp[1].data.AlcoholQuantity || [];
                $scope.HealthPhysicalObj.SmokingStatus = resp[1].data.SmokingStatus || [];
                $scope.HealthPhysicalObj.SmokingQuantity = resp[1].data.SmokingQuantity || [];
                $scope.HealthPhysicalObj.DrugNames = resp[1].data.DrugNames || [];
                $scope.HealthPhysicalObj.DrugQuantity = resp[1].data.DrugQuantity || [];
            }
            if (resp[2].data.status === "Success") {
                if (resp[2].data.DentitionArray.length > 0) {
                    $scope.HealthPhysicalObj.AirwayObj.DentitionList = resp[2].data.DentitionArray || [];
                    angular.forEach($scope.HealthPhysicalObj.AirwayObj.DentitionList, function (item) {
                        item.IsChecked = false;
                        item.PatientDentitionId = null;
                    });
                }
                if (resp[2].data.PreviousAnesthetics.length > 0) {
                    angular.forEach(resp[2].data.PreviousAnesthetics, function (item) {
                        let object = {
                            "PatientPreviousAnestheticId": 0,
                            "PreviousAnestheticId": item.PreviousAnestheticId,
                            "PreviousAnestheticName": item.PreviousAnestheticName,
                            "NotesInd": false,
                            "Value": '',
                            "DeleteInd": 'N',
                            "Remarks": "",

                        };
                        $scope.PrevAnestheticsObj.PreviousAnesthetics.push(object);

                    })
                }
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
                            "SeverityId": null,
                            "PreAdmOthernotesInd": false,
                            "IsDiabetes": false,
                            "IsNoshowROS": false,
                            "StatusId": 1,
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
            }

            if (resp[3].data.status === "Success") {

                if (resp[3].data.AllergyItems.length > 0) {
                    $scope.PrevAnestheticsObj.AllergyItems = resp[3].data.AllergyItems || [];
                }
                if (resp[3].data.CurrentEyeMedicationList.length > 0) {
                    $scope.PrevAnestheticsObj.CurrentEyeMedications = resp[3].data.CurrentEyeMedicationList || [];
                }
                if (resp[3].data.CurrentSystemicMedicationList.length > 0) {
                    $scope.PrevAnestheticsObj.CurrentSystemicMedicationsHistory = resp[3].data.CurrentSystemicMedicationList || [];
                }
                if (resp[3].data.SurgicalHistory.length > 0) {
                    $scope.PrevAnestheticsObj.SurgicalHistory = resp[3].data.SurgicalHistory || [];
                }

                if (resp[3].data.ROSOverAllRemarks !='') {
                    $scope.PrevAnestheticsObj.ROSOverAllRemarks = resp[3].data.ROSOverAllRemarks || '';
                }
             

                $scope.PreAdmAnesthetistObj.PrescriptionDetails = angular.copy(resp[3].data.Prescription)||[];
                if ($scope.PreAdmAnesthetistObj.PrescriptionDetails.length > 0) {
                    $scope.PrescriptionMainAddObj.PatientPrescriptionId = $scope.PreAdmAnesthetistObj.PrescriptionDetails[0].PatientPrescriptionId;
                    $scope.PrescriptionMainAddObj.PrescriptionDetails = angular.copy($scope.PreAdmAnesthetistObj.PrescriptionDetails[0].PrescriptionDetails) || [];
                }

                //let tempPrescArray = $filter('filter')($scope.PrescriptionMainAddObj.PrescriptionDetails, { 'TypeId': 2 }, true);
                //$scope.PrescriptionMainAddObj.PrescriptionDetails = angular.copy(tempPrescArray);

                if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                    angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
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

                $scope.Surgeryobj.Investigationslist = angular.copy(resp[3].data.InvestigationsList) || [];

                if ($scope.Surgeryobj.Investigationslist.length > 0) {
                    angular.forEach($scope.Surgeryobj.Investigationslist, function (item) {
                        item.DurationDate = item.DurationDate || '';
                        if (item.DurationDate !== '') {
                            item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                            item.ShowDateFormat = true;
                        } else {
                            item.ShowDateFormat = false;
                        }
                    });
                }

                if (resp[3].data.AnesthesiaVitals.length > 0) {
                    $scope.PreAdmAnesthesiaVitals = angular.copy(resp[3].data.AnesthesiaVitals) || [];
                } else {
                    $scope.PreAdmAnesthesiaVitals = [];
                }

                resp[3].data.DocumentDetails = resp[3].data.DocumentDetails || [];
                if (resp[3].data.DocumentDetails.length > 0) {
                    $scope.PreAdmAnesthetistObj.DocumentDetails = angular.copy(resp[3].data.DocumentDetails);
                }

                $scope.HealthPhysicalObj.DrugNames = $scope.HealthPhysicalObj.DrugNames || [];
                resp[3].data.LifestyleDetail = resp[3].data.LifestyleDetail || [];
                if (resp[3].data.LifestyleDetail.length > 0) {
                    angular.forEach(resp[3].data.LifestyleDetail, function (Litem) {
                        $scope.HealthPhysicalObj.LifestyleHistory.PatientDetailId = Litem.PatientDetailId || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.SmokingType = Litem.SmokingType || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = Litem.AlcoholType || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugType = Litem.DrugType || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.PsychisType = Litem.PsychisType || '';
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholStatusId = Litem.AlcoholStatusId || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationDate = $filter('date')(Litem.AlcoholDurationDate, "MM-dd-yyyy") || null;
                        $scope.HealthPhysicalObj.LifestyleHistory.AlcoholQuantityId = Litem.AlcoholQuantityId || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugStatusId = Litem.DrugStatusId || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate = $filter('date')(Litem.DrugDurationDate, "MM-dd-yyyy") || null;
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugQuantityId = Litem.DrugQuantityId || 0;
                        $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist = angular.copy(Litem.Smokinglist) || [];
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugArray = angular.copy(Litem.DrugArray) || [];
                        $scope.HealthPhysicalObj.LifestyleHistory.Remarks = angular.copy(Litem.Remarks) || '';
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
                    if ($scope.HealthPhysicalObj.LifestyleHistory.Remarks != '') {
                        $scope.HealthPhysicalObj.SocialNotesInd = true;
                    } else {
                        $scope.HealthPhysicalObj.SocialNotesInd = false;
                    }

                }

                if (resp[3].data.PreAdmissionDetails.length > 0) {
                    let respObj = resp[3].data.PreAdmissionDetails[0];
                    $scope.HealthPhysicalObj.IsCardiacWNL = respObj.IsCardiacWNL || false;
                    $scope.HealthPhysicalObj.IsCNSHistory = respObj.IsCNSHistory || false;
                    $scope.HealthPhysicalObj.IsCardiacWNL = respObj.IsCardiacWNL || false;
                    $scope.HealthPhysicalObj.IsCardiovascularHistory = respObj.IsCardiovascularHistory || false;
                    $scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL = respObj.IsAutoImmuneDisordersWNL || false;
                    $scope.HealthPhysicalObj.IsEndocrineWNL = respObj.IsEndocrineWNL || false;
                    $scope.HealthPhysicalObj.IsHemeOncWNL = respObj.IsHemeOncWNL || false;
                    $scope.HealthPhysicalObj.IsHepaticWNL = respObj.IsHepaticWNL || false;
                    $scope.HealthPhysicalObj.IsKidneyDiseaseWNL = respObj.IsKidneyDiseaseWNL || false;
                    $scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL = respObj.IsMusculoSkeletalSystemWNL || false;
                    $scope.HealthPhysicalObj.IsNervousSystemWNL = respObj.IsNervousSystemWNL || false;
                    $scope.HealthPhysicalObj.IsNeurologicWNL = respObj.IsNeurologicWNL || false;
                    $scope.HealthPhysicalObj.IsOthersWNL = respObj.IsOthersWNL || false;
                    $scope.HealthPhysicalObj.IsPsychosisWNL = respObj.IsPsychosisWNL || false;
                    $scope.HealthPhysicalObj.IsPulmonaryWNL = respObj.IsPulmonaryWNL || false;
                    $scope.HealthPhysicalObj.IsRespiratoryNormal = respObj.IsRespiratoryNormal || false;
                    $scope.HealthPhysicalObj.IsHeentWNL = respObj.IsHeentWNL || false;
                    $scope.HealthPhysicalObj.IsLungsWNL = respObj.IsLungsWNL || false;
                    $scope.HealthPhysicalObj.IsGeneralappearanceWNL = respObj.IsGeneralappearanceWNL || false;

                    $scope.HealthPhysicalObj.LabNotes = respObj.LabNotes || '';

                    if (respObj.Vitals.length > 0) {
                        $scope.AllVitalsArray = [];
                        angular.forEach(respObj.Vitals, function (item) {
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
                            }
                            if (obj.VitalRemarks != '') {
                                obj.VitalshowNotesInd = true;
                            }
                            $scope.AllVitalsArray.push(obj);
                        });
                    }

                    if (respObj.Airway != '') {
                        $scope.HealthPhysicalObj.AirwayObj.Class = respObj.Airway.Class || '';
                        $scope.HealthPhysicalObj.AirwayObj.IsNormal = respObj.Airway.IsNormal || false;
                        $scope.HealthPhysicalObj.AirwayObj.Notes = respObj.Airway.Notes || '';
                        $scope.HealthPhysicalObj.AirwayObj.ROMNECKAP = respObj.Airway.ROMNECKAP || '';
                        $scope.HealthPhysicalObj.AirwayObj.ROMNECKLAT = respObj.Airway.ROMNECKLAT || '';
                        $scope.HealthPhysicalObj.AirwayObj.ROMTMS = respObj.Airway.ROMTMS || '';
                        $scope.HealthPhysicalObj.AirwayObj.Dentition = respObj.Airway.Dentition || '';
                        $scope.HealthPhysicalObj.AirwayObj.ChemistryNotes = respObj.Airway.ChemistryNotes || '';

                        respObj.Airway.DentitionList = respObj.Airway.DentitionList || [];
                        if (respObj.Airway.DentitionList.length > 0) {
                            angular.forEach(respObj.Airway.DentitionList, function (Aitem) {
                                angular.forEach($scope.HealthPhysicalObj.AirwayObj.DentitionList, function (Bitem) {
                                    if (Aitem.DentitionId == Bitem.DentitionId) {
                                        Bitem.PatientDentitionId = Aitem.PatientDentitionId;
                                        Bitem.IsChecked = true;
                                    }
                                });
                            });
                        }

                    }
                    if (respObj.SystemicHistory.length > 0) {
                        angular.forEach(respObj.SystemicHistory, function (item) {
                            let tempArray = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'HistoryId': item.HistoryId }, true);
                            if (tempArray.length == 0) {
                                $scope.HealthPhysicalObj.SystemicHistoryArray.push(item);
                            }
                        });
                        angular.forEach(respObj.SystemicHistory, function (Aitem) {
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
                    if (respObj.LabInvestigation.length > 0) {
                        angular.forEach(respObj.LabInvestigation, function (Aitem) {
                            angular.forEach($scope.HealthPhysicalObj.LabList, function (Bitem) {
                                if (Aitem.ProcedureId == Bitem.ProcedureId) {
                                    Bitem.InvestigationResultDate = Aitem.InvestigationResultDate;
                                    Bitem.ResultId = Aitem.ResultId || null;
                                    Bitem.ResultValue = Aitem.ResultValue;
                                    Bitem.AbNormal = Aitem.AbNormal || false;
                                    Bitem.Normal = Aitem.Normal || false;
                                    Bitem.Remarks = Aitem.Remarks || '';
                                }
                            });
                        });
                    }
                    

                    if ($scope.HealthPhysicalObj.AirwayObj.ChemistryNotes != '') {
                        $scope.HealthPhysicalObj.ChemistryNotesInd = true;
                    }
                    else {
                        $scope.HealthPhysicalObj.ChemistryNotesInd = false;
                    }


                    if ($scope.HealthPhysicalObj.AirwayObj.Notes != '') {
                        $scope.HealthPhysicalObj.AirwayObjPreAdmnotesInd = true;
                    } else {
                        $scope.HealthPhysicalObj.AirwayObjPreAdmnotesInd = false;
                    }






                    $scope.PreAdmAnesthetistObj.PreAdmAppointmentId=respObj.PreAdmAppointmentId||0
                    $scope.PreAdmAnesthetistObj.AscAppointmentId=respObj.AscAppointmentId||0

                    //submit record identity
                    $scope.PreAdmAnesthetistObj.PreAdmissionId = respObj.PreAdmissionId || null;

                    // previous anesthesia section
                    $scope.PrevAnestheticsObj.PreAdmissionChartStatus = respObj.PreAdmissionChartStatus || null;
                    //$scope.PrevAnestheticsObj.IsComplications = respObj.PrevAnesthesia.IsComplications;
                    //$scope.PrevAnestheticsObj.IsPrevAnesthesia = respObj.PrevAnesthesia.IsPrevAnesthesia;
                    //$scope.PrevAnestheticsObj.IsFamilyHistory = respObj.PrevAnesthesia.IsFamilyHistory;
                    //$scope.PrevAnestheticsObj.IsDifficultAirway = respObj.PrevAnesthesia.IsDifficultAirway;
                    //$scope.PrevAnestheticsObj.IsPONV = respObj.PrevAnesthesia.IsPONV;
                    //$scope.PrevAnestheticsObj.IsPatientDNR = respObj.PrevAnesthesia.IsPatientDNR;
                    //$scope.PrevAnestheticsObj.IsSuspend = respObj.PrevAnesthesia.IsSuspend;
                    //$scope.PrevAnestheticsObj.IsContinue = respObj.PrevAnesthesia.IsContinue;
                    //$scope.PrevAnestheticsObj.Notes = respObj.PrevAnesthesia.Notes || "";
                    if ($scope.PrevAnestheticsObj.PreAdmissionChartStatus == 'E' || $scope.PrevAnestheticsObj.PreAdmissionChartStatus == 'D') {
                        $scope.IsshowCopyPrevious = false;
                    }

                    if (respObj.PreviousAnesthetics.length > 0) {
                        angular.forEach(respObj.PreviousAnesthetics, function (Aitem) {
                            angular.forEach($scope.PrevAnestheticsObj.PreviousAnesthetics, function (Bitem) {
                                if (Aitem.PreviousAnestheticId == Bitem.PreviousAnestheticId) {
                                    Bitem.PatientPreviousAnestheticId = Aitem.PatientPreviousAnestheticId;
                                    Bitem.Value = Aitem.Value || '';
                                    Bitem.Remarks = Aitem.Remarks || '';
                                }
                            });
                        });
                    }



                    if ($scope.PrevAnestheticsObj.Notes != "") {
                        $scope.PreAdmAnesthetistObj.PrevAnestheticsObjNotesInd = true;
                    } else {
                        $scope.PreAdmAnesthetistObj.PrevAnestheticsObjNotesInd = false;
                    }

                    if (respObj.MedicineOrdersInstructions != "") {
                        $scope.PreSurgeryIns.MedicineOrdersInstructions = respObj.MedicineOrdersInstructions;
                    } else {
                        $scope.PreSurgeryIns.MedicineOrdersInstructions = '';
                    }

                    // anesthesia plan section
                    let tempAnesthesiaTypeList = angular.copy(respObj.AnesthesiaTypelist);

                    if (tempAnesthesiaTypeList.length > 0) {
                        angular.forEach(tempAnesthesiaTypeList, function (item) {
                            angular.forEach($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) {
                                if (kitem.AnesthesiaTypeId === item.AnesthesiaTypeId) {
                                    kitem.IsSelected = true;
                                }
                            });
                        });
                    }

                    angular.forEach($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (item) {
                        if (item.AnesthesiaTypeId === 1 && item.IsSelected) {
                            $scope.APAnesthesiaOptionsObj.IsTopicalAnesthesia = true;
                        }
                        if (item.AnesthesiaTypeId === 2 && item.IsSelected) {
                            $scope.APAnesthesiaOptionsObj.IsLocalAnesthesia = true;
                        }
                        if (item.AnesthesiaTypeId === 3 && item.IsSelected) {
                            $scope.APAnesthesiaOptionsObj.IsGeneralAnesthesia = true;
                        }
                        if (item.AnesthesiaTypeId === 6 && item.IsSelected) {
                            $scope.APAnesthesiaOptionsObj.IsRegionalAnesthesia = true;
                        }
                        if (item.AnesthesiaTypeId === 4 && item.IsSelected) {
                            $scope.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia = true;
                        }
                        if (item.AnesthesiaTypeId === 5 && item.IsSelected) {
                            $scope.APAnesthesiaOptionsObj.IsSubtenonAnesthesia = true;
                        }
                        if (item.AnesthesiaTypeId === 7 && item.IsSelected) {
                            $scope.APAnesthesiaOptionsObj.IsIVSedation = true;
                        }
                        if (item.AnesthesiaTypeId === 8 && item.IsSelected) {
                            $scope.APAnesthesiaOptionsObj.IsMonitoredAnesthesiaCare = true;
                        }
                        if (item.AnesthesiaTypeId === 9 && item.IsSelected) {
                            $scope.APAnesthesiaOptionsObj.IsOralSedation = true;
                        }

                    });

                    $scope.APAnesthesiaOptionsObj.AnesthetistNotes = respObj.AnesthesiaPlan.AnesthetistNotes || "";
                    $scope.APAnesthesiaOptionsObj.Dosage = respObj.AnesthesiaPlan.AnesPlanDosage || "";
                    $scope.APAnesthesiaOptionsObj.AnesthetistId = respObj.AnesthesiaPlan.AnesPlanAnesthetistId || "";

                    $scope.APAnesthesiaOptionsObj.AnesthesiologistId = respObj.AnesthesiaPlan.AnesthesiologistId || null;

                    if ($scope.APAnesthesiaOptionsObj.AnesthetistId != "") {
                        let tempArray = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.APAnesthesiaOptionsObj.AnesthetistId }, true);
                        if (tempArray.length > 0) {
                            //$scope.APAnesthesiaOptionsObj.AnesthetistName = tempArray[0].FullName;

                            var SuffixName = '';
                            tempArray[0].SuffixName = tempArray[0].SuffixName || '';
                            if (tempArray[0].SuffixName != "") {
                                SuffixName = tempArray[0].SuffixName;
                            }

                            var LicenseNumber = "";

                            tempArray[0].LicenseNumber = tempArray[0].LicenseNumber || "";
                            if (tempArray[0].LicenseNumber != "") {
                                LicenseNumber = 'LIC :' + ' ' + tempArray[0].LicenseNumber;
                            }
                            
                            if (tempArray[0].SuffixId == 10) {
                                $scope.APAnesthesiaOptionsObj.AnesthetistName = ' Dr. ' + tempArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                            } else {
                                $scope.APAnesthesiaOptionsObj.AnesthetistName = tempArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                            }


                        }
                    }
                    $scope.APAnesthesiaOptionsObj.AnesthesiologistName = '';
                    if ($scope.APAnesthesiaOptionsObj.AnesthesiologistId != null) {
                        let tempArray = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.APAnesthesiaOptionsObj.AnesthesiologistId }, true);
                        if (tempArray.length > 0) {
                          
                            var SuffixName = '';
                            tempArray[0].SuffixName = tempArray[0].SuffixName || '';
                            if (tempArray[0].SuffixName != "") {
                                SuffixName = tempArray[0].SuffixName;
                            }

                            var LicenseNumber = "";

                            tempArray[0].LicenseNumber = tempArray[0].LicenseNumber || "";
                            if (tempArray[0].LicenseNumber != "") {
                                LicenseNumber = 'LIC :' + ' ' + tempArray[0].LicenseNumber;
                            }

                            if (tempArray[0].SuffixId == 10) {
                                $scope.APAnesthesiaOptionsObj.AnesthesiologistName = ' Dr. ' + tempArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                            } else {
                                $scope.APAnesthesiaOptionsObj.AnesthesiologistName = tempArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                            }


                        }
                    }

                    if ($scope.APAnesthesiaOptionsObj.AnesthetistNotes != "") {
                        $scope.PreAdmshownotes.PreAdmnotes7 = true;
                    } else {
                        $scope.PreAdmshownotes.PreAdmnotes7 = false;
                    }


                    // Assessment ASA section
                    $scope.PreAdmAnesthetistObj.ASAObj.Value = respObj.AssessmentsASA.Value || "";
                    $scope.PreAdmAnesthetistObj.ASAObj.Notes = respObj.AssessmentsASA.Notes || "";
                    // Assessment ASA"E" section
                    $scope.PreAdmAnesthetistObj.ASAObj.EValue = respObj.AssessmentsASA.EValue || "";
                    $scope.PreAdmAnesthetistObj.ASAObj.ENotes = respObj.AssessmentsASA.ENotes || "";

                    $scope.PreAdmAnesthetistObj.ASAClassificationNotes = respObj.ASAClassificationNotes || "";

                    // prescription and investigations

                    //$scope.PreAdmAnesthetistObj.PrescriptionDetails = angular.copy(respObj.Prescription);
                    //if ($scope.PreAdmAnesthetistObj.PrescriptionDetails.length > 0) {
                    //    $scope.PrescriptionMainAddObj.PatientPrescriptionId = $scope.PreAdmAnesthetistObj.PrescriptionDetails[0].PatientPrescriptionId;
                    //    $scope.PrescriptionMainAddObj.PrescriptionDetails = angular.copy($scope.PreAdmAnesthetistObj.PrescriptionDetails[0].PrescriptionDetails) || [];
                    //}

                    //let tempPrescArray = $filter('filter')($scope.PrescriptionMainAddObj.PrescriptionDetails, { 'TypeId': 2 }, true);
                    //$scope.PrescriptionMainAddObj.PrescriptionDetails = angular.copy(tempPrescArray);

                    //if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                    //    angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                    //        item.StartDate = item.StartDate || null;
                    //        item.StopDate = item.StopDate || null;
                    //        if (item.StartDate!=null) {
                    //            item.StartDate = moment(item.StartDate).format("MM-DD-YYYY");
                    //        }
                    //        if (item.StopDate != null) {
                    //            item.StopDate = moment(item.StopDate).format("MM-DD-YYYY");
                    //        }
                         
                          
                    //        item.SigObj = item.Sig;
                    //    });
                    //}

                    //if (respObj.InvestigationsList.length > 0) {
                    //    $scope.Surgeryobj.Investigationslist = $filter('filter')(respObj.InvestigationsList, { 'TypeId': 2 }, true);
                    //}

                   // $scope.Surgeryobj.Investigationslist = angular.copy(respObj.InvestigationsList);


                    // status and reviewed by
                    $scope.PreAdmAnesthetistObj.PreAdmissionStatusId = respObj.PreAdmissionStatusId || null;
                    $scope.PreAdmAnesthetistObj.PreAdmissionStatus = respObj.PreAdmissionStatus || "";
                    $scope.PreAdmAnesthetistObj.ReviewedBy = respObj.ReviwedBy || null;

                    $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedBy = respObj.AnesthesiologistReviewedBy || null;


                    if ($scope.PreAdmAnesthetistObj.ReviewedBy != null) {
                        var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmAnesthetistObj.ReviewedBy }, true)[0] || [];
                        //$scope.PreAdmAnesthetistObj.AnesthesiaReviewedName = ReviewName.FullName || '';


                        var SuffixName = '';
                        ReviewName.SuffixName = ReviewName.SuffixName || '';
                        if (ReviewName.SuffixName != "") {
                            SuffixName = ReviewName.SuffixName;
                        }

                        var LicenseNumber = "";

                        ReviewName.LicenseNumber = ReviewName.LicenseNumber || "";
                        if (ReviewName.LicenseNumber != "") {
                            LicenseNumber = 'LIC :' + ' ' + ReviewName.LicenseNumber;
                        }
                     
                        if (ReviewName.SuffixId == 10) {
                            $scope.PreAdmAnesthetistObj.AnesthesiaReviewedName = angular.copy('Dr.' + ReviewName.FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        } else {
                            $scope.PreAdmAnesthetistObj.AnesthesiaReviewedName = angular.copy(ReviewName.FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        }

                    } else {
                        $scope.PreAdmAnesthetistObj.AnesthesiaReviewedName = "";
                    }

                    if ($scope.PreAdmAnesthetistObj.AnesthesiologistReviewedBy != null) {
                        var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedBy }, true)[0] || [];
                      


                        var SuffixName = '';
                        ReviewName.SuffixName = ReviewName.SuffixName || '';
                        if (ReviewName.SuffixName != "") {
                            SuffixName = ReviewName.SuffixName;
                        }

                        var LicenseNumber = "";

                        ReviewName.LicenseNumber = ReviewName.LicenseNumber || "";
                        if (ReviewName.LicenseNumber != "") {
                            LicenseNumber = 'LIC :' + ' ' + ReviewName.LicenseNumber;
                        }

                        if (ReviewName.SuffixId == 10) {
                            $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedName = angular.copy('Dr.' + ReviewName.FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        } else {
                            $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedName = angular.copy(ReviewName.FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                        }

                    } else {
                        $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedName = "";
                    }



                    // documents
                    //$scope.PreAdmAnesthetistObj.DocumentDetails = angular.copy(respObj.DocumentDetails);

                    respObj.CardioVascular = respObj.CardioVascular || null;
                    if (respObj.CardioVascular != null) {
                        $scope.HealthPhysicalObj.CardioVascularObj.ECG = respObj.CardioVascular.CardioECG || "";
                        $scope.HealthPhysicalObj.CardioVascularObj.ECGUnits = respObj.CardioVascular.CardioECGUnits || "BPM";
                        $scope.HealthPhysicalObj.CardioVascularObj.Notes = respObj.CardioVascular.CardioNotes || "";
                    }

                }
            }
            if (resp[4].data.status === "Success") {
                if (resp[4].data.rows.length > 0) {
                    $scope.TemplateList = [];
                    $scope.TemplateList = angular.copy(resp[4].data.rows);
                }
            }
            if (resp[5].data.status === "Success") {
                /* console.log(resp[5].data);*/
                $scope.PreviousPreAdmAppntData = resp[5].data.rows || [];
                if ($scope.PreviousPreAdmAppntData.length > 0) {
                    angular.forEach($scope.PreviousPreAdmAppntData, function (item) {
                        item.AppointmentDate = item.AppointmentDate || '';
                        if (item.AppointmentDate != '') {
                            item.AppointmentDate = moment(item.AppointmentDate).format("MM-DD-YYYY");
                        }
                    });
                } else {
                    $scope.PreviousPreAdmAppntData = [];
                }
            }
        });

    };
  
    $scope.addSIgNameDynamically = function () {
        var dosesupplytest = "";
        if ($scope.addNewOrganizationSigObj.DaysSupply !== '') {
            dosesupplytest = " for " + $scope.addNewOrganizationSigObj.DaysSupply;
        }
        $scope.addNewOrganizationSigObj.Sig = $scope.addNewOrganizationSigObj.Action + " " + $scope.addNewOrganizationSigObj.Dose + " " + $scope.addNewOrganizationSigObj.DoseUnit + " " + $scope.addNewOrganizationSigObj.Route + " " + $scope.addNewOrganizationSigObj.Frequency + " " + $scope.addNewOrganizationSigObj.DoseOther + "" + dosesupplytest;
    }
    $scope.toggleAddSigFields = function () {
        $scope.showAddSigFields = !$scope.showAddSigFields;
        $scope.showAddSigButton = !$scope.showAddSigButton;
    };

    $scope.init();


    /*  start Vitals*/

    $scope.AddVitals = function () {
        if ($scope.AllVitalsArray.length > 0) {
            let index = $scope.AllVitalsArray.length - 1;
            let counter = 0;
            angular.forEach($scope.AllVitalsArray[index].Vitals, function (hitem) {
                if (hitem.Value != "") {
                    counter++;
                }
            });
            if (counter == 0) {
                alertify.error("Please enter vitals!");
                return;
            }
        }
        let vitalsobj = angular.copy($scope.VitalsObj());
        $scope.AllVitalsArray.push(vitalsobj);

    };
    $scope.changePerformedBy = function (item) {
        var vitallist = [];
        var vitallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.DoctorId });
        if (vitallist.length > 0) {
            item.UserName = angular.copy(vitallist[0].FullName);
        }
    }

    $scope.RemoveVitals = function (item) {
        if (item.VitalSummaryId == 0) {
            var index = $scope.AllVitalsArray.indexOf(item);
            if (index > -1) {
                $scope.AllVitalsArray.splice(index, 1);
            }
        } else {
            var index = $scope.AllVitalsArray.indexOf(item);
            $scope.AllVitalsArray[index].DeleteInd = 'Y';
        }
    }

    $scope.ClearVitals = function (item) {
        item.VitalAddTime = "";
        item.DoctorId = null;
        angular.forEach(item.Vitals, function (vitem) {
            if (vitem.VitalId == 11) {
                vitem.Value = '';
                vitem.UnitTypeId = 1;
                vitem.UnitTypeName = "°F";
            }
            if (vitem.VitalId == 12) {
                vitem.Value = '';
                vitem.UnitTypeId = 3;
                vitem.UnitTypeName = "/min";
            }
            if (vitem.VitalId == 4) {
                vitem.Value = '';
                vitem.UnitTypeId = 5;
                vitem.UnitTypeName = "mmHg";
            }
            if (vitem.VitalId == 5) {
                vitem.Value = '';
                vitem.UnitTypeId = 5;
                vitem.UnitTypeName = "mmHg";
            }
            if (vitem.VitalId == 14) {
                vitem.Value = '';
                vitem.UnitTypeId = 3;
                vitem.UnitTypeName = "/min";
            }
            if (vitem.VitalId == 15) {
                vitem.Value = '';
                vitem.UnitTypeId = 6;
                vitem.UnitTypeName = "%";
            }
            if (vitem.VitalId == 8) {
                vitem.Value = '';
                vitem.UnitTypeId = 11;
                vitem.UnitTypeName = "mg/dL";
            }
            if (vitem.VitalId == 36) {
                vitem.Value = '';
                vitem.UnitTypeId = null;
                vitem.UnitTypeName = '';
            }
        });

    }
    $scope.TimeStamp = function (index, item) {
        let VitalInfo = $filter('filter')(item.Vitals, function (item) {
            return item.Value != ''
        });
        if (VitalInfo.length > 0) {
            item.VitalAddTime = $filter('date')(new Date(), "hh:mm a");
            if (doctorinfo.RoleID == 1 || doctorinfo.RoleID == 8 || doctorinfo.RoleID == 30 || doctorinfo.RoleID == 43 || doctorinfo.RoleID == 56 || doctorinfo.RoleID == 57) {
                item.DoctorId = doctorinfo.doctorid;
            }
            var vitallist = [];
            var vitallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == doctorinfo.doctorid });
            if (vitallist.length > 0) {
                item.UserName = angular.copy(vitallist[0].FullName);
            }
        } else {
            item.DoctorId = null;
            item.VitalAddTime = '';
        }

    }

    $scope.GetPresentTime = function (index) {
        $scope.AllVitalsArray[index].VitalAddTime = $filter('date')(new Date(), "hh:mm a");
    };

    $scope.onSelectECG = function (item, id) {
        if (id == 13) {
            item.UnitTypeName = "mV";
        }
        if (id == 14) {
            item.UnitTypeName = "sec";
        }

        if (id == 15) {
            item.UnitTypeName = "ms";
        }

        if (id == 16) {
            item.UnitTypeName = "Hz";
        }
        if (id == 17) {
            item.UnitTypeName = "BPM";
        }

    }

    $scope.CopyVitals = function (item, index) {
        if (index > 0) {
            index = index - 1;
            let vitallist = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.UserId }, true);
            if (vitallist.length > 0) {
                item.UserName = angular.copy(vitallist[0].FullName);
                item.DoctorId = angular.copy(vitallist[0].DoctorID);
            }
            item.VitalAddTime = $filter('date')(new Date(), "hh:mm a");
            angular.forEach($scope.AllVitalsArray[index].Vitals, function (hitem) {
                angular.forEach(item.Vitals, function (vitem) {
                    if (hitem.VitalId == 11 && vitem.VitalId == 11) {
                        vitem.Value = hitem.Value;
                        vitem.UnitTypeId = hitem.UnitTypeId;
                        vitem.UnitTypeName = hitem.UnitTypeName;
                    }
                    if (hitem.VitalId == 12 && vitem.VitalId == 12) {
                        vitem.Value = hitem.Value;
                    }
                    if (hitem.VitalId === 4 && vitem.VitalId == 4) {
                        vitem.Value = hitem.Value;
                    }
                    if (hitem.VitalId === 5 && vitem.VitalId == 5) {
                        vitem.Value = hitem.Value;
                    }
                    if (hitem.VitalId == 14 && vitem.VitalId == 14) {
                        vitem.Value = hitem.Value;
                    }
                    if (hitem.VitalId == 15 && vitem.VitalId == 15) {
                        vitem.Value = hitem.Value;
                    }
                    if (hitem.VitalId === 8 && vitem.VitalId == 8) {
                        vitem.Value = hitem.Value;
                    }
                    if (hitem.VitalId === 36 && vitem.VitalId == 36) {
                        vitem.Value = hitem.Value;
                        vitem.UnitTypeId = hitem.UnitTypeId;
                        vitem.UnitTypeName = hitem.UnitTypeName;
                    }
                });
            });
        }
    }

    /*  End Vitals*/




    $scope.SelectTMS = function (val,item) {
        if (val === 1) {
            if (item.ROMTMS == "" || item.ROMTMS == "Limited") {
                item.ROMTMS = "Full";

            }
            else {
                item.ROMTMS = ""
            }
           // $scope.HealthPhysicalObj.AirwayObj.ROMTMS = "Full";
        }
        if (val === 2) {
            if (item.ROMTMS == "" || item.ROMTMS == "Full") {
                item.ROMTMS = "Limited";

            }
            else {
                item.ROMTMS = ""
            }
            //$scope.HealthPhysicalObj.AirwayObj.ROMTMS = "Limited";
            item.IsNormal = false;
        }
        if (item.ROMTMS == "Full" && item.ROMNECKAP == "Full" && item.ROMNECKLAT == "Full") {
            item.IsNormal = true;
        } else {
            item.IsNormal = false;
        }
    };
    $scope.RomNeckAP = function (val,item) {
        if (val === 1) {
            if (item.ROMNECKAP == "" || item.ROMNECKAP == "Limited") {
                item.ROMNECKAP = "Full";

            }
            else {
                item.ROMNECKAP = "";
            }
           // $scope.HealthPhysicalObj.AirwayObj.ROMNECKAP = "Full";
        }
        if (val === 2) {
            if (item.ROMNECKAP == "" || item.ROMNECKAP == "Full") {
                item.ROMNECKAP = "Limited";

            }
            else {
                item.ROMNECKAP = "";
            }
           // $scope.HealthPhysicalObj.AirwayObj.ROMNECKAP = "Limited";
            item.IsNormal = false;
        }
        if (item.ROMTMS == "Full" && item.ROMNECKAP == "Full" && item.ROMNECKLAT == "Full") {
            item.IsNormal = true;
        } else {
            item.IsNormal = false;
        }
    };
    $scope.RomNeckLAT = function (val, item) {

        if (val === 1) {
            if (item.ROMNECKLAT == "" || item.ROMNECKLAT == "Limited") {
                item.ROMNECKLAT = "Full";

            }
            else {
                item.ROMNECKLAT = "";
            }
            //$scope.HealthPhysicalObj.AirwayObj.ROMNECKLAT = "Full";

        }
        if (val === 2) {
            if (item.ROMNECKLAT == "" || item.ROMNECKLAT == "Full") {
                item.ROMNECKLAT = "Limited";

            }
            else {
                item.ROMNECKLAT = "";
            }
           // $scope.HealthPhysicalObj.AirwayObj.ROMNECKLAT = "Limited";
            item.IsNormal = false;
        }
        if (item.ROMTMS == "Full" && item.ROMNECKAP == "Full" && item.ROMNECKLAT == "Full") {
            item.IsNormal = true;
        } else {
            item.IsNormal = false;
        }
    };
    $scope.SelectClass = function (val,item) {
        if (val === 1) {
            if (item.Class == "" || item.Class == "2" || item.Class == "3" || item.Class == "4" || item.Class == "0") {
                item.Class = "1";

            }
            else {
                item.Class = "";
            }
           // $scope.HealthPhysicalObj.AirwayObj.Class = "1";
        }
        if (val === 2) {
            if (item.Class == "" || item.Class == "1" || item.Class == "3" || item.Class == "4" ||  item.Class == "0") {
                item.Class = "2";

            }
            else {
                item.Class = "";
            }
           // $scope.HealthPhysicalObj.AirwayObj.Class = "2";
        }
        if (val === 3) {
            if (item.Class == "" || item.Class == "1" || item.Class == "2" || item.Class == "4" || item.Class == "0") {
                item.Class = "3";

            }
            else {
                item.Class = "";
            }
          //  $scope.HealthPhysicalObj.AirwayObj.Class = "3";
        }
        if (val === 4) {
            if (item.Class == "" || item.Class == "1" || item.Class == "2" || item.Class == "3" || item.Class == "0") {
                item.Class = "4";

            }
            else {
                item.Class = "";
            }
            //$scope.HealthPhysicalObj.AirwayObj.Class = "4";
        }
        if (val === 0) {
            if (item.Class == "" || item.Class == "1" || item.Class == "2" || item.Class == "3" || item.Class == "4" ) {
                item.Class = "0";

            }
            else {
                item.Class = "";
            }
            //$scope.HealthPhysicalObj.AirwayObj.Class = "4";
        }
    };

    $scope.AnesthesiaEvaluation = function (val, item) {
        if (val === 1) {
            if (item.Value == "" || item.Value == "No") {
                item.Value = "Yes";
            }
            else {
                item.Value = "";
            }

        }
        if (val === 2) {
            if (item.Value == "" || item.Value == "Yes") {
                item.Value = "No";
            }
            else {
                item.Value = "";
            }
            
        }
    }

    $scope.SelectCNSBtn = function (type, item) {
        if (type === 1) {
            if (item.Value == "" || item.Value == "History Present") {
                item.Value = "No History";
                item.IsNoshowROS = true;
                item.DeleteInd = "N";

            } else {
                item.Value = "";
                item.PatientDetailId = item.PatientDetailId || 0;
                if (item.PatientDetailId != 0) {
                    item.DeleteInd = "Y";
                }

            }
        }
        if (type === 2) {
            if (item.Value == "" || item.Value == "No History") {
                item.Value = "History Present";
                item.IsNoshowROS = false;
                item.DeleteInd = "N";
            } else {
                item.Value = "";
                item.PatientDetailId = item.PatientDetailId || 0;
                if (item.PatientDetailId != 0) {
                    item.DeleteInd = "Y";
                }
            }
        }
    };
    $scope.SelectRespiratoryBtn = function (type, item) {
        if (type === 1) {
            if (item.Value == "" || item.Value == "History Present") {
                item.Value = "No History";
                item.DeleteInd = "N";

            } else {
                item.Value = "";
                item.PatientDetailId = item.PatientDetailId || 0;
                if (item.PatientDetailId != 0) {
                    item.DeleteInd = "Y";
                }

            }
        }
        if (type === 2) {
            if (item.Value == "" || item.Value == "No History") {
                item.Value = "History Present";
                item.DeleteInd = "N";
            } else {
                item.Value = "";
                item.PatientDetailId = item.PatientDetailId || 0;
                if (item.PatientDetailId != 0) {
                    item.DeleteInd = "Y";
                }
            }
        }
        item.IsNoshowROS = true;
    };
    $scope.SelectBlood = function (val, item) {
        if (val == 1) {
            if (item.ResultValue == "" || item.ResultValue == "No") {
                item.ResultValue = "Yes";
                item.DeleteInd = "N";
            } else {
                item.ResultValue = "";

                item.PatientInvestigationId = item.PatientInvestigationId || 0;
                if (item.PatientInvestigationId != 0) {
                    item.DeleteInd = "Y";
                }
            }
        }
        if (val == 2) {
            if (item.ResultValue == "" || item.ResultValue == "Yes") {
                item.ResultValue = "No";

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
    $scope.SelectCXR = function (val, item) {
        if (val == 1) {
            if (item.Value == "" || item.Value == "No") {
                item.Value = "Yes";
                item.IsNoshowROS = false;
                item.DeleteInd = "N";
            } else {
                item.Value = "";
                item.PatientDetailId = item.PatientDetailId || 0;
                if (item.PatientDetailId != 0) {
                    item.DeleteInd = "Y";
                }
            }
        }
        if (val == 2) {
            if (item.Value == "" || item.Value == "Yes") {
                item.Value = "No";
                item.IsNoshowROS = true;
                item.DeleteInd = "N";
            } else {
                item.Value = "";
                item.PatientDetailId = item.PatientDetailId || 0;
                if (item.PatientDetailId != 0) {
                    item.DeleteInd = "Y";
                }
            }
        }
    }

    //$scope.ChangeType = function (val, item) {
    //    if (val == 1) {
    //        if (item.Value == "" || item.Value == "No") {
    //            item.Value = "Yes";
    //            item.DeleteInd = "N";
    //            if (item.Value == 'Yes' && item.HistoryId == 110) {
    //                let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 158 || x.HistoryId == 159);
    //                if (templest.length > 0) {
    //                    angular.forEach(templest, function (Aitem) {
    //                        Aitem.IsDiabetes = true;
    //                    })
    //                }
    //            }
    //            if (item.Value == 'Yes' && item.HistoryId == 114) {
    //                let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 160 || x.HistoryId == 161);
    //                if (templest.length > 0) {
    //                    angular.forEach(templest, function (Aitem) {
    //                        Aitem.IsDiabetes = true;
    //                    })
    //                }
    //            }
    //        } else {
    //            item.Value = "";
    //            item.PatientDetailId = item.PatientDetailId || 0;
    //            if (item.PatientDetailId != 0) {
    //                item.DeleteInd = "Y";
    //            }
    //            if (item.HistoryId == 110 || item.HistoryId == 114) {
    //                let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 158 || x.HistoryId == 159);
    //                if (templest.length > 0) {
    //                    angular.forEach(templest, function (Aitem) {
    //                        Aitem.IsDiabetes = false;
    //                    })
    //                }
    //            }
    //        }
    //    }
    //    if (val == 2) {
    //        if (item.Value == "" || item.Value == "Yes") {
    //            item.Value = "No";
    //            item.DeleteInd = "N";
    //            item.IsNoshowROS = true;
    //            if (item.Value == 'No' && item.HistoryId == 110) {
    //                let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 158 || x.HistoryId == 159);
    //                if (templest.length > 0) {
    //                    angular.forEach(templest, function (Aitem) {
    //                        Aitem.IsDiabetes = false;
    //                        Aitem.Value = '';
    //                        Aitem.Remarks = '';
    //                    })
    //                }
    //            }
    //            if (item.Value == 'No' && item.HistoryId == 114) {
    //                let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 160 || x.HistoryId == 161);
    //                if (templest.length > 0) {
    //                    angular.forEach(templest, function (Aitem) {
    //                        Aitem.IsDiabetes = false;
    //                        Aitem.Value = '';
    //                        Aitem.Remarks = '';
    //                    })
    //                }
    //            }
    //        } else {
    //            item.Value = "";
    //            item.PatientDetailId = item.PatientDetailId || 0;
    //            if (item.PatientDetailId != 0) {
    //                item.DeleteInd = "Y";
    //            }

    //        }
    //    }
    //}


    $scope.ChangeSmokingValue = function (value, item) {
        if (value == 1) {
            if (item.SmokingType == "" || item.SmokingType == "No") {
                item.SmokingType = "Yes";

                //  $scope.HealthPhysicalObj.LifestyleHistory.SmokingType = item;
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
    $scope.ChangeAlcoholValue = function (val,item) {
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
            }
        }
        
    };
    $scope.ChangeDrugValue = function (val,item) {
        if (val == 1) {
            if (item.DrugType == "" || item.DrugType == "No") {
                item.DrugType = "Yes";

                //$scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = 'Yes';
            }
            else {
                item.DrugType = ""
               // $scope.HealthPhysicalObj.LifestyleHistory.DrugType = 'No';
                item.DrugStatusId = 0;
                item.DrugDurationDate = null;
                item.DrugQuantityId = 0;
            }
        }

        if (val == 2) {
            if (item.DrugType == "" || item.DrugType == "Yes") {
                item.DrugType = "No";

                //$scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = 'Yes';
            }
            else {
                item.DrugType = ""
                // $scope.HealthPhysicalObj.LifestyleHistory.DrugType = 'No';
                item.DrugStatusId = 0;
                item.DrugDurationDate = null;
                item.DrugQuantityId = 0;
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

    $scope.ChangePsychis = function (val,item) {
        if (val == 1) {
            if (item.PsychisType == "" || item.PsychisType == "No") {
                item.PsychisType = "Yes";

                //$scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = 'Yes';
            }
            else {
                item.PsychisType = ""
                // $scope.HealthPhysicalObj.LifestyleHistory.DrugType = 'No';
               
            }
        }
        if (val == 2) {
            if (item.PsychisType == "" || item.PsychisType == "Yes") {
                item.PsychisType = "No";

                //$scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = 'Yes';
            }
            else {
                item.PsychisType = ""
                // $scope.HealthPhysicalObj.LifestyleHistory.DrugType = 'No';
               
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

    $scope.OnSelectNormal = function (item) {
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


    $scope.ChangeCardiacApp = function (item) {
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
    }



    $scope.ShowROSPopUp = function (item) {
        item = item || 'Allergies';



        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.cacheStorageItem.AllergyItems = $scope.PrevAnestheticsObj.AllergyItems || [];

        if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
            //let temparray1 = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem, index) { return kitem.PatientDetailId != 0 });
            let temparray1 = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem, index) { return kitem.IsChecked == true });
            if (temparray1.length > 0) {
                $scope.cacheStorageItem.SystemicHistory = temparray1;
            } else {
                $scope.cacheStorageItem.SystemicHistory = [];
            }

            let tempsystemicarray = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem, index) { return kitem.DeleteInd == 'Y' }) || [];
            if (tempsystemicarray.length > 0) {
                $scope.cacheStorageItem.SystemicHistory = $scope.cacheStorageItem.SystemicHistory.concat(tempsystemicarray);
            }
        }

        $scope.cacheStorageItem.SurgicalHistory = $scope.PrevAnestheticsObj.SurgicalHistory || [];
        $scope.cacheStorageItem.CurrentEyeMedications = $scope.PrevAnestheticsObj.CurrentEyeMedications || [];
        $scope.cacheStorageItem.CurrentSystemicMedicationsHistory = $scope.PrevAnestheticsObj.CurrentSystemicMedicationsHistory || [];

        $scope.cacheStorageItem.ROSOverAllRemarks = $scope.PrevAnestheticsObj.ROSOverAllRemarks || '';

        var checkInvArray = $filter("filter")($scope.TemplateList, { "CategoryId": 2 }, true);
        var subVisionArray = checkInvArray[0].CategoryDetails;
        subVisionArray = subVisionArray.filter((x) => x.SubCategoryId == 3 || x.SubCategoryId == 4 || x.SubCategoryId == 7 || x.SubCategoryId == 69 || x.SubCategoryId == 73);
        var CategoryList = [];
        CategoryList = subVisionArray || [];
        angular.forEach(CategoryList, function (citem) {
            citem.IsSubCategoryChecked = true;
        });
        //var ScreenObj = "ASC";
        var ScreenObj = {
            "TypeId": 2,
            "TypeName": 'Anesthesia',
            "ScreenType": "ASC",
        }
        $scope.ROSIsNormalArray = [];
        $scope.modalROSInstance = $uibModal.open({
            "templateUrl": "templates/uibpopups/ROSpopupadding.html",
            "controller": "USPreAdmROSCtrl",
            "resolve": {
                "RosObject": function () { return item; },
                "CategoryList": function () { return CategoryList; },
                "cacheStorageItem": function () { return angular.copy($scope.cacheStorageItem) },
                "ROSIsNormalArray": function () { return angular.copy($scope.ROSIsNormalArray) },
                "ScreenObj": function () { return ScreenObj },
            },
            "backdrop": "static",
            "keyboard": false,
            // "windowClass": "newassessmentspopupuib",
            "windowClass": "modal-full-popup",
        });
        $scope.modalROSInstance.result.then(function (resp) {
            console.log(resp);

            if (resp.type == "RosHistory") {
                if (resp.AllergyItems.length != 0) {
                    $scope.PrevAnestheticsObj.AllergyItems = resp.AllergyItems || [];
                } else {
                    $scope.PrevAnestheticsObj.AllergyItems = [];
                }

                resp.ROSOverAllRemarks = resp.ROSOverAllRemarks || '';
                if (resp.ROSOverAllRemarks !='') {
                    $scope.PrevAnestheticsObj.ROSOverAllRemarks = resp.ROSOverAllRemarks;
                }
                if (resp.SystemicHistoryArray.length > 0) {
                    let TempInfo = resp.SystemicHistoryArray || [];
                    angular.forEach(TempInfo, function (item) {
                        item.DurationDate = item.DurationDate || null;
                        let tempArray = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'HistoryId': item.HistoryId }, true);
                        if (tempArray.length == 0) {
                            $scope.HealthPhysicalObj.SystemicHistoryArray.push(item);
                        }
                    });
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                        item.IsChecked = false;
                    });
                    angular.forEach(TempInfo, function (ritem) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                            if (ritem.HistoryId == item.HistoryId) {
                                item.PatientDetailId = angular.copy(ritem.PatientDetailId);
                                item.Duration = angular.copy(ritem.Duration);
                                item.DurationDate = ritem.DurationDate || null;
                                item.DurationType = angular.copy(ritem.DurationType);
                                item.DurationTypeName = angular.copy(ritem.DurationTypeName);
                                item.ActiveInd = angular.copy(ritem.ActiveInd);
                                item.SeverityId = angular.copy(ritem.SeverityId);
                                item.Remarks = angular.copy(ritem.Remarks);
                                item.IsChecked = true;                            
                            }
                        });
                    });
                    let CardiovascularArray = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'TypeId': 1, 'IsChecked': true,'IsNormal' :false}, true);
                    if (CardiovascularArray.length > 0) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (ritem) {
                            if (ritem.IsNormal == true && ritem.TypeId == 1 ) {
                                    ritem.IsChecked = false;
                                    $scope.HealthPhysicalObj.IsCardiacWNL = false;
                            }
                        });
                    }

                    let NeurologicArray = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'TypeId': 5, 'IsChecked': true, 'IsNormal': false }, true);
                    if (NeurologicArray.length > 0) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (ritem) {
                            if (ritem.IsNormal == true && ritem.TypeId == 5) {
                                ritem.IsChecked = false;
                                $scope.HealthPhysicalObj.IsNeurologicWNL = false;
                            }
                        });
                    }
                    let AppearanceArray = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'TypeId': 21, 'IsChecked': true, 'IsNormal': false }, true);
                    if (AppearanceArray.length > 0) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (ritem) {
                            if (ritem.IsNormal == true && ritem.TypeId == 21) {
                                ritem.IsChecked = false;
                                $scope.HealthPhysicalObj.IsGeneralappearanceWNL = false;
                            }
                        });
                    }
                    let HEENTArray = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'TypeId': 16, 'IsChecked': true, 'IsNormal': false }, true);
                    if (HEENTArray.length > 0) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (ritem) {
                            if (ritem.IsNormal == true && ritem.TypeId == 16) {
                                ritem.IsChecked = false;
                                $scope.HealthPhysicalObj.IsHeentWNL = false;
                            }
                        });
                    }
                    let LungsArray = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'TypeId': 17, 'IsChecked': true, 'IsNormal': false }, true);
                    if (LungsArray.length > 0) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (ritem) {
                            if (ritem.IsNormal == true && ritem.TypeId == 17) {
                                ritem.IsChecked = false;
                                $scope.HealthPhysicalObj.IsLungsWNL = false;
                            }
                        });
                    }
                    
                } else {
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                        item.IsChecked = false;
                    });

                   
                }
                if (resp.SurgicalHistoryArray.length != 0) {
                    // $scope.PrevAnestheticsObj.SurgicalHistory = resp.SurgicalHistoryArray||[];
                    $scope.PrevAnestheticsObj.SurgicalHistory = resp.SurgicalHistoryArray || [];
                } else {
                  /*  $scope.PrevAnestheticsObj.SurgicalHistory = $scope.PrevAnestheticsObj.SurgicalHistory || [];*/

                    $scope.PrevAnestheticsObj.SurgicalHistory = [];
                }
                if (resp.CurrentEyeMedicationArray.length != 0) {
                    $scope.PrevAnestheticsObj.CurrentEyeMedications = resp.CurrentEyeMedicationArray || [];
                } else {
                    /*$scope.PrevAnestheticsObj.CurrentEyeMedications = $scope.PrevAnestheticsObj.CurrentEyeMedications || [];*/

                    $scope.PrevAnestheticsObj.CurrentEyeMedications = [];
                }
                if (resp.CurrentSystemicMedicationsHistory.length != 0) {
                    $scope.PrevAnestheticsObj.CurrentSystemicMedicationsHistory = resp.CurrentSystemicMedicationsHistory || [];
                } else {
                   /* $scope.PrevAnestheticsObj.CurrentSystemicMedicationsHistory = $scope.PrevAnestheticsObj.CurrentSystemicMedicationsHistory || [];*/

                    $scope.PrevAnestheticsObj.CurrentSystemicMedicationsHistory = [];
                }
            }
            //if (resp.ROSOverAllRemarks != "" && resp.ROSOverAllRemarks != null) {
            //    $scope.MainObj.ROSOverAllRemarks = resp.ROSOverAllRemarks;
            //}
            //if (resp.type == "RosHistory") {
            //    if (resp.AllergyItems.length != 0) {
            //        $scope.MainObj.AllergyItems = [];
            //        angular.forEach(resp.AllergyItems, function (kitem) {
            //            kitem.SelectedReaction = kitem.SelectedReaction || "";
            //            $scope.MainObj.AllergyItems.push(kitem);
            //        });
            //    } else {
            //        $scope.MainObj.AllergyItems = [];
            //    }
            //    if (resp.SystemicHistoryArray.length != 0) {
            //        $scope.MainObj.SystemicHistory = [];
            //        angular.forEach(resp.SystemicHistoryArray, function (kitem) {
            //            $scope.MainObj.SystemicHistory.push(kitem);
            //        });
            //    } else {
            //        $scope.MainObj.SystemicHistory = [];
            //    }
            //    if (resp.SurgicalHistoryArray.length != 0) {
            //        $scope.MainObj.SurgicalHistory = [];
            //        angular.forEach(resp.SurgicalHistoryArray, function (kitem) {
            //            $scope.MainObj.SurgicalHistory.push(kitem);
            //        });
            //    } else {
            //        $scope.MainObj.SurgicalHistory = [];
            //    }


            //    if (resp.CurrentSystemicMedicationsHistory.length != 0) {
            //        $scope.MainObj.CurrentSystemicMedicationsHistory = angular.copy(resp.CurrentSystemicMedicationsHistory);
            //    } else {
            //        $scope.MainObj.CurrentSystemicMedicationsHistory = [];
            //    }
            //    if (resp.CurrentEyeMedicationArray.length != 0) {
            //        $scope.MainObj.CurrentEyeMedications = angular.copy(resp.CurrentEyeMedicationArray);
            //    }
            //    else {
            //        $scope.MainObj.CurrentEyeMedications = [];
            //    }
            //}

        }, function () { });
    };


    $scope.DeleteUploadedFileNew = function (item, index, mainitem) {
        if (item.DocumentID == 0) {
            $scope.FilesObj.TempImagesArray.splice(index, 1);
        }
    }

    $scope.changeAssessmentsASA = function () {
        $scope.PreAdmAnesthetistObj.ASAObj.EValue = "";
    }
    $scope.changeAssessmentsASAE = function () {
        $scope.PreAdmAnesthetistObj.ASAObj.Value = "";
    }
    $scope.onSelectTemperature = function (item, id) {
        if (id == 2) {
            item.UnitTypeName = "°C";
        } else {
            item.UnitTypeName = "°F";
        }
    };
    $scope.onSelectECG = function (item, id) {
        if (id == 13) {
            item.UnitTypeName = "mV";
        }
        if (id == 14) {
            item.UnitTypeName = "sec";
        }

        if (id == 15) {
            item.UnitTypeName = "ms";
        }

        if (id == 16) {
            item.UnitTypeName = "Hz";
        }
        if (id == 17) {
            item.UnitTypeName = "BPM";
        }

    }


    $scope.editmedicationspopup = function (item) {
        item = item || "";
        if (item != "") {
            item.SigFields = false;
            item.SigObj = item.Sig;
        }
        let mInstanceAdd = $uibModal.open({
            "templateUrl": "templates/uibpopups/EditNAddSigFieldsPopUp.html",
            //"size": "lg",
            //"backdrop": "static",
            "keyboard": false,
            "scope": $scope,
            "windowClass": "offcanvas-bottom-popover",
            "backdropClass": " ",
            "controller": function ($scope, $uibModalInstance, medicationObj) {
                $scope.uibclose = function () {
                    $uibModalInstance.dismiss("cancel");
                };

                $scope.MedicationObj = angular.copy(medicationObj);

                $scope.save = function () {
                    $uibModalInstance.close($scope.MedicationObj);
                };

                $scope.changePrescAction = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.ActionArray, { "MedicineDosaageFieldId": mainobj.ActionId }, true);
                    if (filteredArray.length > 0) {
                        $scope.MedicationObj.Action = filteredArray[0].Code;
                    };
                    $scope.addSIgNameDynamically();
                };
                $scope.changePrescDose = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.DoseArray, { "MedicineDosaageFieldId": mainobj.DoseId }, true);
                    if (filteredArray.length > 0) {
                        $scope.MedicationObj.Dose = filteredArray[0].Code;
                    };
                    $scope.addSIgNameDynamically();
                };

                $scope.changePrescDoseUnit = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.DoseUnitArray, { "MedicineDosaageFieldId": mainobj.DoseUnitId }, true);
                    if (filteredArray.length > 0) {
                        $scope.MedicationObj.DoseUnit = filteredArray[0].Code;
                    };
                    $scope.addSIgNameDynamically();
                };

                $scope.changePrescRoute = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.RouteArray, { "MedicineDosaageFieldId": mainobj.RouteId }, true);
                    if (filteredArray.length > 0) {
                        $scope.MedicationObj.Route = filteredArray[0].Code;
                    };
                    $scope.addSIgNameDynamically();
                };

                $scope.changePrescFrequency = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.FrequencyArray, { "MedicineDosaageFieldId": mainobj.FrequencyId }, true);
                    if (filteredArray.length > 0) {
                        $scope.MedicationObj.Frequency = filteredArray[0].Description;
                    };
                    $scope.addSIgNameDynamically();
                };

                $scope.changePrescDoseOther = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.DoseOtherArray, { "MedicineDosaageFieldId": mainobj.DoseOtherId }, true);
                    if (filteredArray.length > 0) {
                        $scope.MedicationObj.DoseOther = filteredArray[0].Code;
                    };
                    $scope.addSIgNameDynamically();
                };

                $scope.changePrescDaysSupply = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.DurationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true);
                    if (filteredArray.length > 0) {

                        $scope.MedicationObj.DaysSupply = filteredArray[0].Code;
                        $scope.MedicationObj.DaysSupplyDescription = filteredArray[0].Description;

                        var DateCode = filteredArray[0].Code;
                        var currentDate = new Date();
                        var futureDate = new Date(currentDate.getTime() + (parseInt(DateCode) * 24 * 60 * 60 * 1000));
                        $scope.MedicationObj.StopDate = $filter('date')(futureDate, 'MM/dd/yyyy');/* $filter('date')(futureDate, 'MM/dd/yyyy HH:mm:ss');*/
                    };

                    $scope.addSIgNameDynamically();
                };

                $scope.changePrescQuantityUnit = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.QuantityUnitArray, { "MedicineDosaageFieldId": mainobj.QuantityUnitId }, true);
                    if (filteredArray.length > 0) {
                        $scope.MedicationObj.QuantityUnit = filteredArray[0].Code;
                    };
                };

                $scope.changePrescRefill = function (mainobj) {
                    var filteredArray = $filter("filter")($scope.RefillsArray, { "MedicineDosaageFieldId": mainobj.RefillId }, true);
                    if (filteredArray.length > 0) {
                        $scope.MedicationObj.Refills = filteredArray[0].Code;
                    };
                };

                $scope.addSIgNameDynamically = function () {
                    var dosesupplytest = "";
                    if ($scope.MedicationObj.DaysSupply !== '') {
                        dosesupplytest = " for " + $scope.MedicationObj.DaysSupplyDescription;
                    }

                    if ($scope.MedicationObj.DaysSupply !== '') {
                        var filteredArray = $filter("filter")($scope.DurationArray, { "MedicineDosaageFieldId": $scope.MedicationObj.DaysSupplyId }, true);
                        if (filteredArray.length > 0) {
                            $scope.MedicationObj.DaysSupply = filteredArray[0].Code;
                            dosesupplytest = " for " + filteredArray[0].Description;
                        }
                    }


                    if ($scope.MedicationObj.MedicineObj == '') {
                        $scope.MedicationObj.SigObj = $scope.MedicationObj.Action + " " + $scope.MedicationObj.Dose + " " + $scope.MedicationObj.DoseUnit + " " + $scope.MedicationObj.Route + " " + $scope.MedicationObj.Frequency + " " + $scope.MedicationObj.DoseOther + "" + dosesupplytest;
                    } else {
                        $scope.MedicationObj.MedicineObj = $scope.MedicationObj.Action + " " + $scope.MedicationObj.Dose + " " + $scope.MedicationObj.DoseUnit + " " + $scope.MedicationObj.Route + " " + $scope.MedicationObj.Frequency + " " + $scope.MedicationObj.DoseOther + "" + dosesupplytest;
                    }
                }


            },
            "resolve": {
                "medicationObj": function () { return item; }
            }
        });

        mInstanceAdd.result.then(function (data) {
            item.ActionId = data.ActionId || null;
            item.Action = data.Action || "";
            item.Dose = data.Dose || "";
            item.DoseUnit = data.DoseUnit || "";
            item.Route = data.Route || "";
            item.Frequency = data.Frequency || "";
            item.DoseOther = data.DoseOther || "";
            item.DaysSupply = data.DaysSupply || "";
            item.QuantityUnit = data.QuantityUnit || "";
            item.DoseId = data.DoseId || null;
            item.DoseUnitId = data.DoseUnitId || null;
            item.RouteId = data.RouteId || null;
            item.FrequencyId = data.FrequencyId || null;
            item.DoseOtherId = data.DoseOtherId || null;
            item.DaysSupplyId = data.DaysSupplyId || null;
            item.Quantity = data.Quantity || null;
            item.QuantityUnitId = data.QuantityUnitId || null;
            item.RefillId = data.RefillId || null;
            item.Refills = data.Refills || null;
            item.PatientInstructions = data.PatientInstructions || "";
            //item.SigObj = data.SigObj;
            // item.Sig = data.Sig;
            item.Sig = item.Action + item.Dose + item.DoseUnit + item.Route + item.Frequency + item.DoseOther + (item.DaysSupply ? ` for ${item.DaysSupply} Days` : '');
            item.StopDate = data.StopDate;
            item.StartDate = data.StartDate;

        }, function () {

        });
    };

    $scope.viewMoreorLesstr = false;
   
    $scope.viewststematicaddnotes = {
        templateUrl: 'viewststematicaddnotes.html'
    };

    $scope.additionalSystemicFilter = function (item) {
        // respiratory section and default items shown in systemic history are filtered out here
        return item.TypeId !== 1 && item.TypeId !== 2 && item.TypeId !== 3 && item.TypeId !== 5 && item.TypeId !== 6 && item.TypeId !== 7 && item.TypeId !== 8 && item.TypeId !== 9 && item.TypeId !== 10 && item.TypeId !== 11 && item.TypeId !== 12 && item.TypeId !== 16 && item.TypeId !== 17 && item.TypeId !== 21 && item.TypeId !== 18 && item.TypeId !== 19 && item.IsChecked==true;
    };

    $scope.OpenSystemicNotesPopover = function (obj) {
        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
            item.IsPopoverOpen = false;
        });
        obj.IsPopoverOpen = true;
        $scope.PreAdmAnesthetistObj.SystemicHistoryPopoverObj = angular.copy(obj);
        $scope.PreAdmAnesthetistObj.SystemicHistoryPopoverNotes = obj.Remarks;
    }; 

    $scope.AddSystemicNotes = function () {
        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
            item.TypeId = item.TypeId || null;
            if (item.TypeId != null) {
                if (item.TypeId == $scope.PreAdmAnesthetistObj.SystemicHistoryPopoverObj.TypeId && item.HistoryId == $scope.PreAdmAnesthetistObj.SystemicHistoryPopoverObj.HistoryId) {
                    item.Remarks = $scope.PreAdmAnesthetistObj.SystemicHistoryPopoverNotes || "";
                    item.IsPopoverOpen = false;
                }
            }
        });
    };

    $scope.CopyFromPhysician = function () {
        let appointmentId;
        if ($scope.cacheStorageItem.AppointmentTypeId === 4 || $scope.cacheStorageItem.AppointmentTypeId === 14) {
            appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
        }
        if ($scope.cacheStorageItem.AppointmentTypeId === 7) {
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

        $scope.ReqObj = {
            "UserId": $scope.UserId,
            "OrganizationId": $scope.HospitalId,
            "AppointmentId": appointmentId || 0,
            "PatientId": $scope.cacheStorageItem.PatientID || 0,
            "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId,
            "PatientSurgeryId": PatientSurgeryId || null,
        };
        eHnoteSurgeryService.GetPreAdmissionCardiologistDetails($scope.ReqObj).then(function (resp) {
            if (resp.data.status === "Success") {
                console.log(resp.data);
                if (resp.data.CardiologistDetails.length > 0) {
                    
                    let respObj = resp.data.CardiologistDetails[0];
                    $scope.HealthPhysicalObj.IsCardiacWNL = respObj.IsCardiacWNL || false;
                    $scope.HealthPhysicalObj.IsCNSHistory = respObj.IsCNSHistory || false;
                    $scope.HealthPhysicalObj.IsCardiacWNL = respObj.IsCardiacWNL || false;
                    $scope.HealthPhysicalObj.IsCardiovascularHistory = respObj.IsCardiovascularHistory || false;
                    $scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL = respObj.IsAutoImmuneDisordersWNL || false;
                    $scope.HealthPhysicalObj.IsEndocrineWNL = respObj.IsEndocrineWNL || false;
                    $scope.HealthPhysicalObj.IsHemeOncWNL = respObj.IsHemeOncWNL || false;
                    $scope.HealthPhysicalObj.IsHepaticWNL = respObj.IsHepaticWNL || false;
                    $scope.HealthPhysicalObj.IsKidneyDiseaseWNL = respObj.IsKidneyDiseaseWNL || false;
                    $scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL = respObj.IsMusculoSkeletalSystemWNL || false;
                    $scope.HealthPhysicalObj.IsNervousSystemWNL = respObj.IsNervousSystemWNL || false;
                    $scope.HealthPhysicalObj.IsNeurologicWNL = respObj.IsNeurologicWNL || false;
                    $scope.HealthPhysicalObj.IsOthersWNL = respObj.IsOthersWNL || false;
                    $scope.HealthPhysicalObj.IsPsychosisWNL = respObj.IsPsychosisWNL || false;
                    $scope.HealthPhysicalObj.IsPulmonaryWNL = respObj.IsPulmonaryWNL || false;
                    $scope.HealthPhysicalObj.IsRespiratoryNormal = respObj.IsRespiratoryNormal || false;
                    $scope.HealthPhysicalObj.IsHeentWNL = respObj.IsHeentWNL || false;
                    $scope.HealthPhysicalObj.IsLungsWNL = respObj.IsLungsWNL || false;
                    $scope.HealthPhysicalObj.IsGeneralappearanceWNL = respObj.IsGeneralappearanceWNL || false;

                    $scope.HealthPhysicalObj.LabNotes = respObj.LabNotes || '';

                    //if (respObj.Vitals.length > 0) {
                    //    //$scope.AllVitalsArray = [];
                    //    angular.forEach(respObj.Vitals, function (item) {
                    //        item.Vitals = item.Vitals || [];
                    //        let subvitals = angular.copy($scope.subVitallist()) || [];
                    //        angular.forEach(item.Vitals, function (Aitem) {
                    //            angular.forEach(subvitals, function (Bitem) {
                    //                if (Aitem.VitalId == Bitem.VitalId) {
                    //                    Bitem.Value = Aitem.Value;
                    //                    Bitem.AppointmentVitalDataId = 0;
                    //                    Bitem.UnitTypeId = Aitem.UnitTypeId;
                    //                    Bitem.UnitTypeName = Aitem.UnitTypeName;
                    //                }
                    //            });
                    //        });

                    //        let ndate = moment().format("YYYY-MM-DD");
                    //        let edate = ndate + " " + item.VitalAddTime;
                    //        item.VitalAddTime = moment(edate, "YYYY-MM-DD HH:mm").format("hh:mm A");
                    //        //item.VitalAddTime = $filter('date')(new Date(), "hh:mm a");

                    //        if (doctorinfo.RoleID == 1 || doctorinfo.RoleID == 8 || doctorinfo.RoleID == 30 || doctorinfo.RoleID == 43 || doctorinfo.RoleID == 56 || doctorinfo.RoleID == 57 || doctorinfo.RoleID == 72) {
                    //            item.DoctorId = doctorinfo.doctorid;
                    //        }

                    //        let checkArray = $filter('filter')($scope.AllVitalsArray, { 'VitalAddTime': item.VitalAddTime }, true);

                    //        if (checkArray.length == 0) {
                    //            let obj = {
                    //                "VitalSummaryId": 0,
                    //                "AppointmentId": $scope.cacheStorageItem.AppointmentTypeId,
                    //                "VitalAddDate": $filter('date')(new Date(), 'MM-dd-yyyy'),
                    //                "VitalAddTime": item.VitalAddTime,
                    //                "DoctorId": item.DoctorId,
                    //                "UserName": item.UserName || "",
                    //                "VitalRemarks": item.VitalRemarks || "",
                    //                "DeleteInd": "N",
                    //                "IsEditVitalInd": false,
                    //                "Vitals": angular.copy(subvitals) || [],
                    //                "VitalshowNotesInd": false,
                    //            }
                    //            if (obj.VitalRemarks != '') {
                    //                obj.VitalshowNotesInd = true;
                    //            }
                    //            $scope.AllVitalsArray.push(obj);
                    //        }

                            
                    //    });
                    //}

                    if (respObj.Airway != '') {
                        $scope.HealthPhysicalObj.AirwayObj.Class = respObj.Airway.Class || '';
                        $scope.HealthPhysicalObj.AirwayObj.IsNormal = respObj.Airway.IsNormal || false;
                        $scope.HealthPhysicalObj.AirwayObj.Notes = respObj.Airway.Notes || '';
                        $scope.HealthPhysicalObj.AirwayObj.ROMNECKAP = respObj.Airway.ROMNECKAP || '';
                        $scope.HealthPhysicalObj.AirwayObj.ROMNECKLAT = respObj.Airway.ROMNECKLAT || '';
                        $scope.HealthPhysicalObj.AirwayObj.ROMTMS = respObj.Airway.ROMTMS || '';
                        $scope.HealthPhysicalObj.AirwayObj.Dentition = respObj.Airway.Dentition || '';
                        $scope.HealthPhysicalObj.AirwayObj.ChemistryNotes = respObj.Airway.ChemistryNotes || '';

                        respObj.Airway.DentitionList = respObj.Airway.DentitionList || [];
                        if (respObj.Airway.DentitionList.length > 0) {
                            angular.forEach(respObj.Airway.DentitionList, function (Aitem) {
                                angular.forEach($scope.HealthPhysicalObj.AirwayObj.DentitionList, function (Bitem) {
                                    if (Aitem.DentitionId == Bitem.DentitionId) {
                                        Bitem.PatientDentitionId = Aitem.PatientDentitionId;
                                        Bitem.IsChecked = true;
                                    }
                                });
                            });
                        }

                    }
                    if (respObj.SystemicHistory.length > 0) {
                        angular.forEach(respObj.SystemicHistory, function (item) {
                            let tempArray = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'HistoryId': item.HistoryId }, true);
                            if (tempArray.length == 0) {
                                $scope.HealthPhysicalObj.SystemicHistoryArray.push(item);
                            }
                        });
                        angular.forEach(respObj.SystemicHistory, function (Aitem) {
                            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (Bitem) {
                                if (Aitem.HistoryId == Bitem.HistoryId) {
                                    Bitem.PatientDetailId = Bitem.PatientDetailId||0;
                                    Bitem.Value = Aitem.Value;
                                    Bitem.IsNoshowROS = Aitem.IsNoshowROS || false;
                                    Bitem.Remarks = Aitem.Remarks || '';
                                    Bitem.IsChecked = true;
                                    if (Bitem.Remarks != '') {
                                        Bitem.PreAdmOthernotesInd = true;
                                    }
                                }
                            });
                        });

                    }
                    if (respObj.LabInvestigation.length > 0) {
                        angular.forEach(respObj.LabInvestigation, function (Aitem) {
                            angular.forEach($scope.HealthPhysicalObj.LabList, function (Bitem) {
                                if (Aitem.ProcedureId == Bitem.ProcedureId) {
                                    Bitem.InvestigationResultDate = Aitem.InvestigationResultDate;
                                    Bitem.ResultId = Bitem.ResultId||null;
                                    Bitem.ResultValue = Aitem.ResultValue;
                                    Bitem.AbNormal = Aitem.AbNormal || false;
                                    Bitem.Normal = Aitem.Normal || false;
                                    Bitem.Remarks = Aitem.Remarks || '';
                                }
                            });
                        });
                    }
                    $scope.HealthPhysicalObj.DrugNames = $scope.HealthPhysicalObj.DrugNames || [];
                    if (respObj.LifestyleDetail.length > 0) {
                        angular.forEach(respObj.LifestyleDetail, function (Litem) {
                            $scope.HealthPhysicalObj.LifestyleHistory.PatientDetailId = $scope.HealthPhysicalObj.LifestyleHistory.PatientDetailId||0;
                            $scope.HealthPhysicalObj.LifestyleHistory.SmokingType = Litem.SmokingType || '';
                            $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = Litem.AlcoholType || '';
                            $scope.HealthPhysicalObj.LifestyleHistory.DrugType = Litem.DrugType || '';
                            $scope.HealthPhysicalObj.LifestyleHistory.PsychisType = Litem.PsychisType || '';
                            $scope.HealthPhysicalObj.LifestyleHistory.AlcoholStatusId = Litem.AlcoholStatusId || 0;
                            $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationDate = $filter('date')(Litem.AlcoholDurationDate, "MM-dd-yyyy") || null;
                            $scope.HealthPhysicalObj.LifestyleHistory.AlcoholQuantityId = Litem.AlcoholQuantityId || 0;
                            $scope.HealthPhysicalObj.LifestyleHistory.DrugStatusId = Litem.DrugStatusId || 0;
                            $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate = $filter('date')(Litem.DrugDurationDate, "MM-dd-yyyy") || null;
                            $scope.HealthPhysicalObj.LifestyleHistory.DrugQuantityId = Litem.DrugQuantityId || 0;
                            $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist = angular.copy(Litem.Smokinglist) || [];
                            $scope.HealthPhysicalObj.LifestyleHistory.DrugArray = angular.copy(Litem.DrugArray) || [];
                            $scope.HealthPhysicalObj.LifestyleHistory.Remarks = angular.copy(Litem.Remarks) || '';
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
                                    if (item.SmokingFromDate!=null) {
                                        item.SmokingFromDate = moment(item.SmokingFromDate).format("MM-DD-YYYY");
                                    }
                                });
                            }
                        })
                    }

                    if ($scope.HealthPhysicalObj.AirwayObj.ChemistryNotes != '') {
                        $scope.HealthPhysicalObj.ChemistryNotesInd = true;
                    }
                    else {
                        $scope.HealthPhysicalObj.ChemistryNotesInd = false;
                    }

                    if ($scope.HealthPhysicalObj.LifestyleHistory.Remarks != '') {
                        $scope.HealthPhysicalObj.SocialNotesInd = true;
                    } else {
                        $scope.HealthPhysicalObj.SocialNotesInd = false;
                    }

                    if ($scope.HealthPhysicalObj.AirwayObj.Notes != '') {
                        $scope.HealthPhysicalObj.AirwayObjPreAdmnotesInd = true;
                    } else {
                        $scope.HealthPhysicalObj.AirwayObjPreAdmnotesInd = false;
                    }


                    $scope.HealthPhysicalObj.CardioVascularObj.ECG = respObj.ECGValue || "";
                    $scope.HealthPhysicalObj.CardioVascularObj.ECGUnits = respObj.ECGUnits || "BPM";
                    $scope.HealthPhysicalObj.CardioVascularObj.Notes = respObj.ECGNotes || "";

                } else {
                    alertify.error("Data is not added in Physician");
                   
                }
            }
        });
    }

    $scope.stopClosingDropDown = function (event) {
        event.stopPropagation();
    }

    $scope.GetPreAdmScanDocuments = function () {

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
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
            "PatientId": $scope.cacheStorageItem.PatientID || 0,
            "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId || 0,
            "PatientSurgeryId": PatientSurgeryId || null,
        };

        eHnoteSurgeryService.GetPatientPreAdmissionDetails(ReqObj).then(function (resp) {
            if (resp.data.status === "Success") {
                if (resp.data.DocumentDetails.length > 0) {
                    $scope.PreAdmAnesthetistObj.DocumentDetails = angular.copy(resp.data.DocumentDetails);
                }
            }
        });
    }
    $scope.SaveRosData = function () {
       

 

        if ($scope.PrevAnestheticsObj.CurrentSystemicMedicationsHistory.length > 0) {
            angular.forEach($scope.PrevAnestheticsObj.CurrentSystemicMedicationsHistory, function (mitem) {
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

        if ($scope.PrevAnestheticsObj.CurrentEyeMedications.length > 0) {
            angular.forEach($scope.PrevAnestheticsObj.CurrentEyeMedications, function (Aitem) {
                Aitem.SelectedMedicationHistory = 'CurrentEyeMedication';
                Aitem.IsMedicationStopped = Aitem.IsMedicationStopped || false;
            });
        }

        


        let rossubmitreq = {
            "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
            "AppointmentID": $scope.cacheStorageItem.AppointmentId,
            "HospitalId": $scope.HospitalId,
            "UserId": $scope.UserId,
            "TypeId": 2,
            "TypeName": "Anesthesia",
            "AllergyItems": $scope.PrevAnestheticsObj.AllergyItems || [],
   /*         "SystemicHistory": $scope.obj.SystemicHistoryArray || [],*/
            "SurgicalHistory": $scope.PrevAnestheticsObj.SurgicalHistory || [],
            "CurrentSystemicMedicationsHistory": $scope.PrevAnestheticsObj.CurrentSystemicMedicationsHistory || [],
            //"OccularHistory": $scope.obj.OccularHistoryArray || [],
            //"OcularSurgicalHistory": $scope.obj.OcularSurgicalHistoryArray || [],// hiding ocular and ocular surgery changes 
            "MedicalConditions": $scope.PrevAnestheticsObj.CurrentEyeMedications || [],
            "ROSOverAllRemarks": $scope.PrevAnestheticsObj.ROSOverAllRemarks || "",
        }

        eHnoteDiagnosisDataServices.AddupdateROSData(rossubmitreq).then(function (resp) {
            if (resp.data.Status === "Success") {
                //resp.data.SystemicHistory = resp.data.SystemicHistory || [];
                //$scope.obj.SystemicHistoryArray = angular.copy(resp.data.SystemicHistory);
                //$scope.obj.AllergyItems = angular.copy(resp.data.AllergyItems);
                //$scope.obj.SurgicalHistoryArray = angular.copy(resp.data.SurgicalHistory);
                //$scope.obj.CurrentSystemicMedicationsHistory = angular.copy(resp.data.CurrentSystemicMedicationsHistory);
                //$scope.obj.CurrentEyeMedicationArray = angular.copy(resp.data.MedicalConditions);
            }
        }, function () {

        });


    }
    $scope.OnSelectPreAdmissionPreviousdata = function (opitem) {
        opitem = opitem || ''
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
        if (opitem != '') {
            var confirmationMessage = "Are you sure you want to copy the data from " + opitem.AppointmentDate + " - " + opitem.VisitType + " ?";
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>" + confirmationMessage + "</h4>", function () {
                opitem.AllergyItems = opitem.AllergyItems || [];
                //opitem.AnesthesiaVitals = opitem.AnesthesiaVitals || [];
                opitem.CurrentEyeMedicationList = opitem.CurrentEyeMedicationList || [];
                opitem.CurrentSystemicMedicationList = opitem.CurrentSystemicMedicationList || [];
                opitem.DocumentDetails = opitem.DocumentDetails || [];
                opitem.InvestigationsList = opitem.InvestigationsList || [];
                opitem.PreAdmissionDetails = opitem.PreAdmissionDetails || [];
                opitem.Prescription = opitem.Prescription || [];
                opitem.ROSOverAllRemarks = opitem.ROSOverAllRemarks || '';
                opitem.SurgicalHistory = opitem.SurgicalHistory || [];
               
                if (opitem.AllergyItems.length == 0 && opitem.AnesthesiaVitals.length == 0 && opitem.CurrentEyeMedicationList.length == 0 && opitem.CurrentSystemicMedicationList.length == 0 && opitem.DocumentDetails.length == 0 && opitem.InvestigationsList.length == 0
                    && opitem.Prescription.length == 0 && opitem.SurgicalHistory.length == 0) {
                    alertify.error("No Data For This Date");
                    $scope.PreAdmAnesthetistObj.PreviousPreAdmAnesthetistData = '';
                    $scope.$digest();
                    return false;
                } else {
                    if (opitem.AllergyItems.length > 0) {
                        angular.forEach(opitem.AllergyItems, function (aitem) {
                            aitem.PatientDetailId = 0;
                            aitem.AppointmentId = $scope.cacheStorageItem.AppointmentId || 0;
                            aitem.ConsultationId = $scope.cacheStorageItem.ConsultationID || 0;

                            var i = 0;
                            if ($scope.PrevAnestheticsObj.AllergyItems.length > 0) {
                                angular.forEach($scope.PrevAnestheticsObj.AllergyItems, function (citem) {
                                    if (citem.AllergyId === aitem.AllergyId && citem.DeleteInd == 'N') {
                                        /*alertify.error('You have already entered this Allergy');*/
                                        i++;
                                    }
                                });
                            }
                            if ($scope.PrevAnestheticsObj.AllergyItems.length !== 0) {
                                var List = $filter("filter")($scope.PrevAnestheticsObj.AllergyItems, { "AllergyId": 1 }, true);
                                if (List.length > 0) {
                                    List[0].DeleteInd = 'Y';
                                }
                            }

                            if ($scope.PrevAnestheticsObj.AllergyItems.length !== 0) {
                                var List = $filter("filter")($scope.PrevAnestheticsObj.AllergyItems, { "AllergyId": 2 }, true);
                                if (List.length > 0) {
                                    List[0].DeleteInd = 'Y';
                                }
                            }

                            if (i === 0) {
                                $scope.PrevAnestheticsObj.AllergyItems.push(aitem);
                            }
                        });
                       /* $scope.PrevAnestheticsObj.AllergyItems = opitem.AllergyItems || [];*/
                    }
                    if (opitem.SurgicalHistory.length > 0) {
                        angular.forEach(opitem.SurgicalHistory, function (aitem) {
                            aitem.PatientDetailId = 0;
                            aitem.AppointmentId = $scope.cacheStorageItem.AppointmentId || 0;
                            aitem.ConsultationId = $scope.cacheStorageItem.ConsultationID || 0;
                            var i = 0;
                            if ($scope.PrevAnestheticsObj.SurgicalHistory.length > 0) {
                                angular.forEach($scope.PrevAnestheticsObj.SurgicalHistory, function (citem) {
                                    if (citem.HistoryId === aitem.HistoryId && citem.DeleteInd === 'N') {
                                        //alertify.error('You have already entered this Surgical history');
                                        i++;
                                    }
                                });
                            }
                            if ($scope.PrevAnestheticsObj.SurgicalHistory.length !== 0) {
                                var List = $filter("filter")($scope.PrevAnestheticsObj.SurgicalHistory, { "HistoryId": 1 }, true);
                                if (List.length > 0) {
                                    List[0].DeleteInd = 'Y';
                                }
                            }
                            if (i === 0 ) {
                        
                                $scope.PrevAnestheticsObj.SurgicalHistory.push(aitem);
            
                                //    surgicalHistory.iscopied = true;
                            }
                        });
                    //    $scope.PrevAnestheticsObj.SurgicalHistory = opitem.SurgicalHistory || [];
                    }


                    if (opitem.InvestigationsList.length > 0) {
                        angular.forEach(opitem.InvestigationsList, function (item) {
                            item.DurationDate = item.DurationDate || '';
                            item.PatientInvestigationId = 0;
                            item.PatientOrderId = 0;

                            //item.ProcedureCode = $scope.Surgeryobj.InvestigationObj.ProcedureCode || "";
                            //item.OrgInvestigationId = $scope.Surgeryobj.InvestigationObj.OrganizationProcedureId || null;
                            //item.InvestigationId = $scope.Surgeryobj.InvestigationObj.ProcedureId || 0;
                            //item.InvestigationName = $scope.Surgeryobj.InvestigationObj.ProcedureName || '';
                            if (item.DurationDate !== '') {
                                item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                                item.ShowDateFormat = true;
                            } else {
                                item.ShowDateFormat = false;
                            }
                        });
                        $scope.Surgeryobj.Investigationslist = angular.copy(opitem.InvestigationsList) || [];
                    }
                    if (opitem.Prescription.length > 0) {
                        angular.forEach(opitem.Prescription, function (aitem) {
                            aitem.PatientPrescriptionId = 0;
                            aitem.AppointmentId = $scope.cacheStorageItem.AppointmentId || 0;
                            /*                        aitem.ConsultationId = $scope.cacheStorageItem.ConsultationID || 0;*/
                            angular.forEach(aitem.PrescriptionDetails, function (aaitem) {
                                aaitem.PatientPrescriptionDetailId = 0;
                                aaitem.PatientPrescriptionId = 0;
                            });
                        });

                        $scope.PreAdmAnesthetistObj.PrescriptionDetails = opitem.Prescription || [];
                    }
                    if ($scope.PreAdmAnesthetistObj.PrescriptionDetails.length > 0) {
                        $scope.PrescriptionMainAddObj.PatientPrescriptionId = $scope.PreAdmAnesthetistObj.PrescriptionDetails[0].PatientPrescriptionId;
                        $scope.PrescriptionMainAddObj.PrescriptionDetails = angular.copy($scope.PreAdmAnesthetistObj.PrescriptionDetails[0].PrescriptionDetails) || [];
                    }
                    if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                        angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
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
                    if (opitem.CurrentSystemicMedicationList.length > 0) {
                        angular.forEach(opitem.CurrentSystemicMedicationList, function (aitem) {
                            aitem.CurrentSystemicMedicationId = 0;
                            aitem.AppointmentId = $scope.cacheStorageItem.AppointmentId || 0;
                            aitem.ConsultationId = $scope.cacheStorageItem.ConsultationID || 0;
                            var i = 0;
                            if ($scope.PrevAnestheticsObj.CurrentSystemicMedicationsHistory.length > 0) {
                                angular.forEach($scope.PrevAnestheticsObj.CurrentSystemicMedicationsHistory, function (csitem) {
                                    if (csitem.MedicineId === aitem.MedicineId && csitem.DeleteInd === 'N') {
                                        //alertify.error('You have already entered this Current Systemic Medications history');

                                        i++;
                                    }
                                });
                            }
                            if ($scope.PrevAnestheticsObj.CurrentSystemicMedicationsHistory.length !== 0) {
                                var List = $filter("filter")($scope.PrevAnestheticsObj.CurrentSystemicMedicationsHistory, { "MedicineId": 2 }, true);
                                if (List.length > 0) {
                                    List[0].DeleteInd = 'Y';
                                }
                            }

                            if (i === 0 ) {
                                $scope.PrevAnestheticsObj.CurrentSystemicMedicationsHistory.push(aitem);
            

                            }
                        });
                       /* $scope.PrevAnestheticsObj.CurrentSystemicMedicationsHistory = opitem.CurrentSystemicMedicationList || [];*/
                    }
                    if (opitem.CurrentEyeMedicationList.length > 0) {
                        angular.forEach(opitem.CurrentEyeMedicationList, function (aitem) {
                            aitem.CurrentEyeMedicalConditionId = 0;
                            aitem.AppointmentId = $scope.cacheStorageItem.AppointmentId || 0;
                            aitem.ConsultationId = $scope.cacheStorageItem.ConsultationID || 0;
                            var i = 0;
                            if ($scope.PrevAnestheticsObj.CurrentEyeMedications.length > 0) {
                                angular.forEach($scope.PrevAnestheticsObj.CurrentEyeMedications, function (item) {
                                    if (item.MedicineId === aitem.MedicineId && item.DeleteInd == 'N') {
                                        /*alertify.error('You have already entered this Current Eye Medication');*/
                                        i++;
                                    }
                                });
                            }
                            if ($scope.PrevAnestheticsObj.CurrentEyeMedications.length !== 0) {
                                var List = $filter("filter")($scope.PrevAnestheticsObj.CurrentEyeMedications, { "MedicineId": 1 }, true);
                                if (List.length > 0) {
                                    List[0].DeleteInd = 'Y';
                                }
                            }
                            if (i === 0) {
                                aitem.MedicalHistoryDetailsId = 0;
                                $scope.PrevAnestheticsObj.CurrentEyeMedications.push(aitem);
                                //    ohitem.iscopied = true;
                            }
                        });
                    //    $scope.PrevAnestheticsObj.CurrentEyeMedications = opitem.CurrentEyeMedicationList || [];
                    }
                    if (opitem.DocumentDetails.length > 0) {
                        angular.forEach(opitem.DocumentDetails, function (aitem) {
                            aitem.DocumentId = 0;
                            aitem.PatientSurgeryId = PatientSurgeryId || 0;
                        });
                        $scope.PreAdmAnesthetistObj.DocumentDetails = opitem.DocumentDetails || [];
                    }
                    /*item.AnesthesiaVitals = item.AnesthesiaVitals || [];*/
                    //if (opitem.AnesthesiaVitals.length > 0) {
                    //    $scope.AllVitalsArray = [];
                    //    angular.forEach(opitem.AnesthesiaVitals, function (vitem) {
                    //        vitem.AppointmentId = $scope.cacheStorageItem.AppointmentId || 0;
                    //        vitem.ConsultationId =$scope.cacheStorageItem.ConsultationID || 0;
                    //        vitem.VitalSummaryId = 0;
                    //        vitem.Vitals = vitem.Vitals || [];
                    //        let subvitals = angular.copy($scope.subVitallist()) || [];
                    //        angular.forEach(vitem.Vitals, function (Aitem) {
                    //            Aitem.AppointmentVitalDataId = 0;
                    //            Aitem.AppointmentId = $scope.cacheStorageItem.AppointmentId || 0;
                    //            angular.forEach(subvitals, function (Bitem) {
                    //                if (Aitem.VitalId == Bitem.VitalId) {
                    //                    Bitem.Value = Aitem.Value;
                    //                    Bitem.AppointmentVitalDataId = 0;
                    //                    Bitem.UnitTypeId = Aitem.UnitTypeId;
                    //                    Bitem.UnitTypeName = Aitem.UnitTypeName;
                    //                }
                    //            });
                    //        });

                    //        let ndate = moment().format("YYYY-MM-DD");
                    //        let edate = ndate + " " + vitem.VitalAddTime;
                    //        vitem.VitalAddTime = moment(edate, "YYYY-MM-DD HH:mm").format("hh:mm A");

                    //        let obj = {
                    //            "VitalSummaryId": vitem.VitalSummaryId,
                    //            "AppointmentId": $scope.cacheStorageItem.AppointmentTypeId,
                    //            "VitalAddDate": moment(vitem.VitalAddDate).format("MM-DD-YYYY"),
                    //            "VitalAddTime": vitem.VitalAddTime,
                    //            "DoctorId": vitem.DoctorId,
                    //            "UserName": vitem.UserName || "",
                    //            "VitalRemarks": vitem.VitalRemarks || "",
                    //            "DeleteInd": "N",
                    //            "IsEditVitalInd": false,
                    //            "Vitals": angular.copy(subvitals) || [],
                    //            "VitalshowNotesInd": false,
                    //        }
                    //        if (obj.VitalRemarks != '') {
                    //            obj.VitalshowNotesInd = true;
                    //        }
                    //        $scope.AllVitalsArray.push(obj);
                    //    });
                    //}
                    if (opitem.AnesthesiaPreAdmissionDetails.length > 0) {
                        let respObj = opitem.AnesthesiaPreAdmissionDetails[0];
                        $scope.HealthPhysicalObj.IsCardiacWNL = respObj.IsCardiacWNL || false;
                        $scope.HealthPhysicalObj.IsCNSHistory = respObj.IsCNSHistory || false;
                        $scope.HealthPhysicalObj.IsCardiacWNL = respObj.IsCardiacWNL || false;
                        $scope.HealthPhysicalObj.IsCardiovascularHistory = respObj.IsCardiovascularHistory || false;
                        $scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL = respObj.IsAutoImmuneDisordersWNL || false;
                        $scope.HealthPhysicalObj.IsEndocrineWNL = respObj.IsEndocrineWNL || false;
                        $scope.HealthPhysicalObj.IsHemeOncWNL = respObj.IsHemeOncWNL || false;
                        $scope.HealthPhysicalObj.IsHepaticWNL = respObj.IsHepaticWNL || false;
                        $scope.HealthPhysicalObj.IsKidneyDiseaseWNL = respObj.IsKidneyDiseaseWNL || false;
                        $scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL = respObj.IsMusculoSkeletalSystemWNL || false;
                        $scope.HealthPhysicalObj.IsNervousSystemWNL = respObj.IsNervousSystemWNL || false;
                        $scope.HealthPhysicalObj.IsNeurologicWNL = respObj.IsNeurologicWNL || false;
                        $scope.HealthPhysicalObj.IsOthersWNL = respObj.IsOthersWNL || false;
                        $scope.HealthPhysicalObj.IsPsychosisWNL = respObj.IsPsychosisWNL || false;
                        $scope.HealthPhysicalObj.IsPulmonaryWNL = respObj.IsPulmonaryWNL || false;
                        $scope.HealthPhysicalObj.IsRespiratoryNormal = respObj.IsRespiratoryNormal || false;
                        $scope.HealthPhysicalObj.IsHeentWNL = respObj.IsHeentWNL || false;
                        $scope.HealthPhysicalObj.IsLungsWNL = respObj.IsLungsWNL || false;
                        $scope.HealthPhysicalObj.IsGeneralappearanceWNL = respObj.IsGeneralappearanceWNL || false;

                        $scope.HealthPhysicalObj.LabNotes = respObj.LabNotes || '';


                        if (respObj.Airway != '') {
                            $scope.HealthPhysicalObj.AirwayObj.Class = respObj.Airway.Class || '';
                            $scope.HealthPhysicalObj.AirwayObj.IsNormal = respObj.Airway.IsNormal || false;
                            $scope.HealthPhysicalObj.AirwayObj.Notes = respObj.Airway.Notes || '';
                            $scope.HealthPhysicalObj.AirwayObj.ROMNECKAP = respObj.Airway.ROMNECKAP || '';
                            $scope.HealthPhysicalObj.AirwayObj.ROMNECKLAT = respObj.Airway.ROMNECKLAT || '';
                            $scope.HealthPhysicalObj.AirwayObj.ROMTMS = respObj.Airway.ROMTMS || '';
                            $scope.HealthPhysicalObj.AirwayObj.Dentition = respObj.Airway.Dentition || '';
                            $scope.HealthPhysicalObj.AirwayObj.ChemistryNotes = respObj.Airway.ChemistryNotes || '';

                            respObj.Airway.DentitionList = respObj.Airway.DentitionList || [];
                            if (respObj.Airway.DentitionList.length > 0) {
                                angular.forEach(respObj.Airway.DentitionList, function (Aitem) {
                                    angular.forEach($scope.HealthPhysicalObj.AirwayObj.DentitionList, function (Bitem) {
                                        if (Aitem.DentitionId == Bitem.DentitionId) {
                                            Bitem.PatientDentitionId = Bitem.PatientDentitionId || 0;
                                            Bitem.IsChecked = true;
                                        }
                                    });
                                });
                            }

                        }


                        if ($scope.HealthPhysicalObj.AirwayObj.ChemistryNotes != '') {
                            $scope.HealthPhysicalObj.ChemistryNotesInd = true;
                        }
                        else {
                            $scope.HealthPhysicalObj.ChemistryNotesInd = false;
                        }

                        if ($scope.HealthPhysicalObj.LifestyleHistory.Remarks != '') {
                            $scope.HealthPhysicalObj.SocialNotesInd = true;
                        } else {
                            $scope.HealthPhysicalObj.SocialNotesInd = false;
                        }

                        if ($scope.HealthPhysicalObj.AirwayObj.Notes != '') {
                            $scope.HealthPhysicalObj.AirwayObjPreAdmnotesInd = true;
                        } else {
                            $scope.HealthPhysicalObj.AirwayObjPreAdmnotesInd = false;
                        }




                        respObj.PreviousAnesthetics = respObj.PreviousAnesthetics || [];
                        if (respObj.PreviousAnesthetics.length > 0) {
                            angular.forEach(respObj.PreviousAnesthetics, function (Aitem) {
                                angular.forEach($scope.PrevAnestheticsObj.PreviousAnesthetics, function (Bitem) {
                                    if (Aitem.PreviousAnestheticId == Bitem.PreviousAnestheticId) {
                                        Bitem.PatientPreviousAnestheticId = Bitem.PatientPreviousAnestheticId||0;
                                        Bitem.Value = Aitem.Value || '';
                                        Bitem.Remarks = Aitem.Remarks || '';
                                    }
                                });
                            });
                        }



                        if ($scope.PrevAnestheticsObj.Notes != "") {
                            $scope.PreAdmAnesthetistObj.PrevAnestheticsObjNotesInd = true;
                        } else {
                            $scope.PreAdmAnesthetistObj.PrevAnestheticsObjNotesInd = false;
                        }

                        if (respObj.MedicineOrdersInstructions != "") {
                            $scope.PreSurgeryIns.MedicineOrdersInstructions = respObj.MedicineOrdersInstructions;
                        } else {
                            $scope.PreSurgeryIns.MedicineOrdersInstructions = '';
                        }

                        // anesthesia plan section
                        let tempAnesthesiaTypeList = angular.copy(respObj.AnesthesiaTypelist) || [];

                        if (tempAnesthesiaTypeList.length > 0) {
                            angular.forEach(tempAnesthesiaTypeList, function (item) {
                                angular.forEach($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) {
                                    if (kitem.AnesthesiaTypeId === item.AnesthesiaTypeId) {
                                        kitem.IsSelected = true;
                                    }
                                });
                            });
                        }

                        angular.forEach($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (item) {
                            if (item.AnesthesiaTypeId === 1 && item.IsSelected) {
                                $scope.APAnesthesiaOptionsObj.IsTopicalAnesthesia = true;
                            }
                            if (item.AnesthesiaTypeId === 2 && item.IsSelected) {
                                $scope.APAnesthesiaOptionsObj.IsLocalAnesthesia = true;
                            }
                            if (item.AnesthesiaTypeId === 3 && item.IsSelected) {
                                $scope.APAnesthesiaOptionsObj.IsGeneralAnesthesia = true;
                            }
                            if (item.AnesthesiaTypeId === 6 && item.IsSelected) {
                                $scope.APAnesthesiaOptionsObj.IsRegionalAnesthesia = true;
                            }
                            if (item.AnesthesiaTypeId === 4 && item.IsSelected) {
                                $scope.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia = true;
                            }
                            if (item.AnesthesiaTypeId === 5 && item.IsSelected) {
                                $scope.APAnesthesiaOptionsObj.IsSubtenonAnesthesia = true;
                            }
                            if (item.AnesthesiaTypeId === 7 && item.IsSelected) {
                                $scope.APAnesthesiaOptionsObj.IsIVSedation = true;
                            }
                            if (item.AnesthesiaTypeId === 8 && item.IsSelected) {
                                $scope.APAnesthesiaOptionsObj.IsMonitoredAnesthesiaCare = true;
                            }
                            if (item.AnesthesiaTypeId === 9 && item.IsSelected) {
                                $scope.APAnesthesiaOptionsObj.IsOralSedation = true;
                            }

                        });

                        $scope.APAnesthesiaOptionsObj.AnesthetistNotes = respObj.AnesthesiaPlan.AnesthetistNotes || "";
                        $scope.APAnesthesiaOptionsObj.Dosage = respObj.AnesthesiaPlan.AnesPlanDosage || "";
                        $scope.APAnesthesiaOptionsObj.AnesthetistId = respObj.AnesthesiaPlan.AnesPlanAnesthetistId || "";

                        $scope.APAnesthesiaOptionsObj.AnesthesiologistId = respObj.AnesthesiaPlan.AnesthesiologistId || null;

                        if ($scope.APAnesthesiaOptionsObj.AnesthetistId != "") {
                            let tempArray = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.APAnesthesiaOptionsObj.AnesthetistId }, true);
                            if (tempArray.length > 0) {
                                //$scope.APAnesthesiaOptionsObj.AnesthetistName = tempArray[0].FullName;

                                var SuffixName = '';
                                tempArray[0].SuffixName = tempArray[0].SuffixName || '';
                                if (tempArray[0].SuffixName != "") {
                                    SuffixName = tempArray[0].SuffixName;
                                }

                                var LicenseNumber = "";

                                tempArray[0].LicenseNumber = tempArray[0].LicenseNumber || "";
                                if (tempArray[0].LicenseNumber != "") {
                                    LicenseNumber = 'LIC :' + ' ' + tempArray[0].LicenseNumber;
                                }

                                if (tempArray[0].SuffixId == 10) {
                                    $scope.APAnesthesiaOptionsObj.AnesthetistName = ' Dr. ' + tempArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                                } else {
                                    $scope.APAnesthesiaOptionsObj.AnesthetistName = tempArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                                }


                            }
                        }
                        $scope.APAnesthesiaOptionsObj.AnesthesiologistName = '';
                        if ($scope.APAnesthesiaOptionsObj.AnesthesiologistId != null) {
                            let tempArray = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.APAnesthesiaOptionsObj.AnesthesiologistId }, true);
                            if (tempArray.length > 0) {

                                var SuffixName = '';
                                tempArray[0].SuffixName = tempArray[0].SuffixName || '';
                                if (tempArray[0].SuffixName != "") {
                                    SuffixName = tempArray[0].SuffixName;
                                }

                                var LicenseNumber = "";

                                tempArray[0].LicenseNumber = tempArray[0].LicenseNumber || "";
                                if (tempArray[0].LicenseNumber != "") {
                                    LicenseNumber = 'LIC :' + ' ' + tempArray[0].LicenseNumber;
                                }

                                if (tempArray[0].SuffixId == 10) {
                                    $scope.APAnesthesiaOptionsObj.AnesthesiologistName = ' Dr. ' + tempArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                                } else {
                                    $scope.APAnesthesiaOptionsObj.AnesthesiologistName = tempArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                                }


                            }
                        }

                        if ($scope.APAnesthesiaOptionsObj.AnesthetistNotes != "") {
                            $scope.PreAdmshownotes.PreAdmnotes7 = true;
                        } else {
                            $scope.PreAdmshownotes.PreAdmnotes7 = false;
                        }


                        // Assessment ASA section
                        $scope.PreAdmAnesthetistObj.ASAObj.Value = respObj.AssessmentsASA.Value || "";
                        $scope.PreAdmAnesthetistObj.ASAObj.Notes = respObj.AssessmentsASA.Notes || "";
                        // Assessment ASA"E" section
                        $scope.PreAdmAnesthetistObj.ASAObj.EValue = respObj.AssessmentsASA.EValue || "";
                        $scope.PreAdmAnesthetistObj.ASAObj.ENotes = respObj.AssessmentsASA.ENotes || "";

                        $scope.PreAdmAnesthetistObj.ASAClassificationNotes = respObj.ASAClassificationNotes || "";

                        // prescription and investigations



                        // status and reviewed by
                        $scope.PreAdmAnesthetistObj.PreAdmissionStatusId = respObj.PreAdmissionStatusId || null;
                        $scope.PreAdmAnesthetistObj.PreAdmissionStatus = respObj.PreAdmissionStatus || "";
                        $scope.PreAdmAnesthetistObj.ReviewedBy = respObj.ReviwedBy || null;

                        $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedBy = respObj.AnesthesiologistReviewedBy || null;


                        if ($scope.PreAdmAnesthetistObj.ReviewedBy != null) {
                            var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmAnesthetistObj.ReviewedBy }, true)[0] || [];
                            //$scope.PreAdmAnesthetistObj.AnesthesiaReviewedName = ReviewName.FullName || '';


                            var SuffixName = '';
                            ReviewName.SuffixName = ReviewName.SuffixName || '';
                            if (ReviewName.SuffixName != "") {
                                SuffixName = ReviewName.SuffixName;
                            }

                            var LicenseNumber = "";

                            ReviewName.LicenseNumber = ReviewName.LicenseNumber || "";
                            if (ReviewName.LicenseNumber != "") {
                                LicenseNumber = 'LIC :' + ' ' + ReviewName.LicenseNumber;
                            }

                            if (ReviewName.SuffixId == 10) {
                                $scope.PreAdmAnesthetistObj.AnesthesiaReviewedName = angular.copy('Dr.' + ReviewName.FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            } else {
                                $scope.PreAdmAnesthetistObj.AnesthesiaReviewedName = angular.copy(ReviewName.FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            }

                        } else {
                            $scope.PreAdmAnesthetistObj.AnesthesiaReviewedName = "";
                        }

                        if ($scope.PreAdmAnesthetistObj.AnesthesiologistReviewedBy != null) {
                            var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedBy }, true)[0] || [];



                            var SuffixName = '';
                            ReviewName.SuffixName = ReviewName.SuffixName || '';
                            if (ReviewName.SuffixName != "") {
                                SuffixName = ReviewName.SuffixName;
                            }

                            var LicenseNumber = "";

                            ReviewName.LicenseNumber = ReviewName.LicenseNumber || "";
                            if (ReviewName.LicenseNumber != "") {
                                LicenseNumber = 'LIC :' + ' ' + ReviewName.LicenseNumber;
                            }

                            if (ReviewName.SuffixId == 10) {
                                $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedName = angular.copy('Dr.' + ReviewName.FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            } else {
                                $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedName = angular.copy(ReviewName.FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            }

                        } else {
                            $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedName = "";
                        }



                        // documents
                        //$scope.PreAdmAnesthetistObj.DocumentDetails = angular.copy(respObj.DocumentDetails);

                        respObj.CardioVascular = respObj.CardioVascular || null;
                        if (respObj.CardioVascular != null) {
                            $scope.HealthPhysicalObj.CardioVascularObj.ECG = respObj.CardioVascular.CardioECG || "";
                            $scope.HealthPhysicalObj.CardioVascularObj.ECGUnits = respObj.CardioVascular.CardioECGUnits || "BPM";
                            $scope.HealthPhysicalObj.CardioVascularObj.Notes = respObj.CardioVascular.CardioNotes || "";
                        }

                    }
                    //aitem.AppointmentId = $scope.cacheStorageItem.AppointmentId || 0;
                    //aitem.ConsultationId = $scope.cacheStorageItem.ConsultationID || 0;
                    opitem.SystemicHistory = opitem.SystemicHistory || [];
                    if (opitem.SystemicHistory.length > 0) {
                        angular.forEach(opitem.SystemicHistory, function (item) {
                            item.PatientDetailId = 0
                            item.ConsultationId = $scope.cacheStorageItem.ConsultationID || 0;
                            item.AppointmentId = $scope.cacheStorageItem.AppointmentId || 0;
                            let tempArray = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'HistoryId': item.HistoryId }, true);
                            if (tempArray.length == 0) {
                                $scope.HealthPhysicalObj.SystemicHistoryArray.push(item);
                            }
                        });
                        angular.forEach(opitem.SystemicHistory, function (Aitem) {
                            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (Bitem) {
                                if (Aitem.HistoryId == Bitem.HistoryId) {
                                    Bitem.PatientDetailId = Bitem.PatientDetailId || 0;
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
                    opitem.LabInvestigation = opitem.LabInvestigation || [];
                    if (opitem.LabInvestigation.length > 0) {
                        angular.forEach(opitem.LabInvestigation, function (Aitem) {
                            angular.forEach($scope.HealthPhysicalObj.LabList, function (Bitem) {
                                if (Aitem.ProcedureId == Bitem.ProcedureId) {
                                    Bitem.PatientInvestigationId = 0;
                                    Bitem.InvestigationResultDate = Aitem.InvestigationResultDate;
                                    Bitem.ResultId = Bitem.ResultId || null;
                                    Bitem.ResultValue = Aitem.ResultValue;
                                    Bitem.AbNormal = Aitem.AbNormal || false;
                                    Bitem.Normal = Aitem.Normal || false;
                                    Bitem.Remarks = Aitem.Remarks || '';
                                }
                            });
                        });
                    }
                    $scope.HealthPhysicalObj.DrugNames = $scope.HealthPhysicalObj.DrugNames || [];
                    opitem.LifestyleDetail = opitem.LifestyleDetail || [];
                    if (opitem.LifestyleDetail.length > 0) {
                        angular.forEach(opitem.LifestyleDetail, function (Litem) {
                          
                            Litem.DrugArray = Litem.DrugArray || [];
                            Litem.Smokinglist = Litem.Smokinglist || [];
                            if (Litem.DrugArray.length > 0) {
                                angular.forEach(Litem.DrugArray, function (DLitem) {
                                    DLitem.PatientDetailId = 0;
                                    DLitem.DrugHistoryId = 0;
                                });
                            } 

                            if (Litem.Smokinglist.length > 0) {
                                angular.forEach(Litem.Smokinglist, function (SLitem) {
                                    SLitem.PatientDetailId = 0;
                                    SLitem.AppointmentId = $scope.cacheStorageItem.AppointmentId || 0;
                                    SLitem.SmokingHistoryId = 0;
                                });
                            }
                           /* $scope.HealthPhysicalObj.LifestyleHistory.PatientDetailId = 0;*/
                            $scope.HealthPhysicalObj.LifestyleHistory.SmokingType = Litem.SmokingType || '';
                            $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = Litem.AlcoholType || '';
                            $scope.HealthPhysicalObj.LifestyleHistory.DrugType = Litem.DrugType || '';
                            $scope.HealthPhysicalObj.LifestyleHistory.PsychisType = Litem.PsychisType || '';
                            $scope.HealthPhysicalObj.LifestyleHistory.AlcoholStatusId = Litem.AlcoholStatusId || 0;
                            $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationDate = $filter('date')(Litem.AlcoholDurationDate, "MM-dd-yyyy") || null;
                            $scope.HealthPhysicalObj.LifestyleHistory.AlcoholQuantityId = Litem.AlcoholQuantityId || 0;
                            $scope.HealthPhysicalObj.LifestyleHistory.DrugStatusId = Litem.DrugStatusId || 0;
                            $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate = $filter('date')(Litem.DrugDurationDate, "MM-dd-yyyy") || null;
                            $scope.HealthPhysicalObj.LifestyleHistory.DrugQuantityId = Litem.DrugQuantityId || 0;
                            $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist = angular.copy(Litem.Smokinglist) || [];
                            $scope.HealthPhysicalObj.LifestyleHistory.DrugArray = angular.copy(Litem.DrugArray) || [];
                            $scope.HealthPhysicalObj.LifestyleHistory.Remarks = angular.copy(Litem.Remarks) || '';
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
                    $scope.PrevAnestheticsObj.ROSOverAllRemarks = opitem.ROSOverAllRemarks || '';
                    $scope.PreAdmAnesthetistObj.PreviousPreAdmAnesthetistData = '';
                    $scope.$digest();
                    if ($scope.PrevAnestheticsObj.AllergyItems.length != 0 || $scope.PrevAnestheticsObj.CurrentEyeMedications.length != 0 || $scope.PrevAnestheticsObj.CurrentSystemicMedicationsHistory.length != 0 || $scope.PrevAnestheticsObj.SurgicalHistory.length > 0) {
                        $scope.SaveRosData();
                    }
                }


            }, function () {
                $scope.PreAdmAnesthetistObj.PreviousPreAdmAnesthetistData = '';
                $scope.$digest();
            });
        }
    }

    $scope.Historypopupnew = function (tab, type, from) {
        var HistoryTab = tab || 1;
        type = type || 1;
        from = from || "";

        let mInstanceShow = $uibModal.open({
            "templateUrl": "templates/UsNewConsultation/uibpopup/Historypopupnew.html",
            "controller": "HistorypopupnewCtrl",
            "backdrop": "static",
            //"scope": $scope,
            //"size": "lg",
          /*  "windowClass": "offcanves-right  ",*/
            "windowClass": "modal__popup--1 bottom-to-top-modal  ",
            "keyboard": false,
            "resolve": {
                "HistoryTab": function () { return HistoryTab },
                "Patientid": function () { return angular.copy($scope.cacheStorageItem.PatientID) },
                "HospitalId": function () { return angular.copy($scope.HospitalId) },
                "VisionObj": function () { return [] },
                "obj": function () { return [] },
                "RefractionDetails": function () { return [] },
                "TonometrySubList": function () { return [] },
                "cacheStorageItem": function () { return [] },
                "type": function () { return type },
                "Comingfrom": function () { return from },
            },

        });
    }

}]);
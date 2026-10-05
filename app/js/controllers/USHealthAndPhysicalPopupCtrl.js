"use strict";
eHnoteWebApp.controller("USHealthAndPhysicalPopupCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteCacheStorageService", "eHnoteSurgeryService", "$q", "eHnoteDiagnosisDataServices", "$uibModal", "MainObj", "ScreenObj", "$location", "allUserList", "ParentObj", "eHnoteAuditServices","eHnoteUserDataService",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, eHnoteMasterDataService, eHnoteCacheStorageService, eHnoteSurgeryService, $q, eHnoteDiagnosisDataServices, $uibModal, MainObj, ScreenObj, $location, allUserList, ParentObj, eHnoteAuditServices, eHnoteUserDataService) {


      

        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        $scope.DrugListSelectedText = "";

        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        };
       
        $scope.allUserList = allUserList || [];
        //$scope.AnethesiaOtherSystemsArrayList = [
        //    {
        //        "DescriptionId": 1,
        //        "Description": "Diabetes",
        //        "IsChecked": null,
        //        "Remarks": "",
        //    },
        //    {
        //        "DescriptionId": 2,
        //        "Description": "Liver Disease",
        //        "IsChecked": null,
        //        "Remarks": "",
        //    },
        //    {
        //        "DescriptionId": 3,
        //        "Description": "Inf. Disease",
        //        "IsChecked": null,
        //        "Remarks": "",
        //    },
        //    {
        //        "DescriptionId": 4,
        //        "Description": "Allergies",
        //        "IsChecked": null,
        //        "Remarks": "",
        //    },
        //    {
        //        "DescriptionId": 5,
        //        "Description": "Endocrine",
        //        "IsChecked": null,
        //        "Remarks": "",
        //    }
        //];

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

        $scope.ModuleId=0
        $scope.ModuleName = '';
        $scope.cacheStorageItem.AppointmentTypeId = $scope.cacheStorageItem.AppointmentTypeId || 0;
        if ($scope.cacheStorageItem.AppointmentTypeId == 7 || $scope.cacheStorageItem.AppointmentTypeId == 6) {
            $scope.ModuleId = 3;
            $scope.ModuleName = "Pre Admission";
        } else {
            $scope.ModuleId = 2;
            $scope.ModuleName = "ASC";
        }

        $scope.HealthPhysicalObject = {
            "IsHealthPhysical": true,
            "IsRos": false
        }
        $scope.ChangeTab = function (Tab) {
            $scope.HealthPhysicalObject.IsRos = false;
            $scope.HealthPhysicalObject.IsHealthPhysical = false;
            if (Tab == 1) {
                $scope.HealthPhysicalObject.IsHealthPhysical = true;
            } else {
                $scope.HealthPhysicalObject.IsRos = true;
               
            }
        };

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

        $scope.HPMainObj = MainObj || '';
        $scope.IsComingfrm = ScreenObj.IsComingfrm || '';
        if ($scope.IsComingfrm == 'Admin' || $scope.IsComingfrm == 'ASCQuickAccess') {
            $scope.HealthPhysicalObject.IsHealthPhysical = true;
        }

        $scope.GetuibaccoridianIndObj = function () {
            return {
                "IsHealthPhysicalInd": true,
                "IsPhysicalEvalutionInd": true, // false
            }
        }
        function AccordianFocus() {
            $scope.uibaccordianIndObj = $scope.HPMainObj.uibaccordianIndObj !== undefined ? $scope.HPMainObj.uibaccordianIndObj : $scope.GetuibaccoridianIndObj();
        }
        AccordianFocus();

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
                "ProcedureId": 2254,
                "ProcedureName": 'Blood platelets',
                "CPTCODE": "",
                "InvestigationResultDate": '',

            },{
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
            "ProcedureId": 852,
            "ProcedureName": 'Sodium',
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
            "ProcedureId": 853,
            "ProcedureName": 'Potassium',
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
            "ProcedureId": 854,
            "ProcedureName": 'Chloride',
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
            "ProcedureId": 855,
            "ProcedureName": 'Carbondioxide',
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
            "ProcedureId": 856,
            "ProcedureName": 'glucose',
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
            "ProcedureId": 866,
            "ProcedureName": 'Creatine',
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
            "ProcedureId": 857,
            "ProcedureName": 'Urea',
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
            "ProcedureId": 858,
            "ProcedureName": 'LDL',
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
            "ProcedureId": 859,
            "ProcedureName": 'HDL',
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
            "ProcedureId": 860,
            "ProcedureName": 'Triglyceride',
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
            "ProcedureId": 861,
            "ProcedureName": 'Albumin',
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

        $scope.SelectTMS = function (val) {
            if (val === 1) {
                $scope.HealthPhysicalObj.AirwayObj.ROMTMS = "Full";
            }
            if (val === 2) {
                $scope.HealthPhysicalObj.AirwayObj.ROMTMS = "Limited";
                $scope.HealthPhysicalObj.AirwayObj.IsNormal = false;
            }
        };
        $scope.RomNeckAP = function (val, item) {
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
            }
            if (val === 2) {
                if (item.ROMNECKLAT == "" || item.ROMNECKLAT == "Full") {
                    item.ROMNECKLAT = "Limited";
                }
                else {
                    item.ROMNECKLAT = "";
                }
                item.IsNormal = false;
            }
            if (item.ROMTMS == "Full" && item.ROMNECKAP == "Full" && item.ROMNECKLAT == "Full") {
                item.IsNormal = true;
            } else {
                item.IsNormal = false;
            }
        };
        $scope.SelectClass = function (val, item) {
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
                if (item.Class == "" || item.Class == "1" || item.Class == "3" || item.Class == "4" || item.Class == "0") {
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
                if (item.Class == "" || item.Class == "1" || item.Class == "2" || item.Class == "3" || item.Class == "4") {
                    item.Class = "0";
                }
                else {
                    item.Class = "";
                }
                //$scope.HealthPhysicalObj.AirwayObj.Class = "4";
            }
        };
        $scope.GetPreAdmAnesthetistObj = function () {
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
                    "MouthOpening": "",
                    "TMDistance": "",
                    "UnableToAssess": false,
                    "Tracheostomy": false,

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
                "SystemicHistoryArray": [],
                "ReviewedDate": "",
                "ReviewedTime": "",
                "DocumentDetails": [],
                "TempImagesArray": [],
                "AppointmentID": $scope.cacheStorageItem.AppointmentId,
                "ChemistryNotesInd": false,
                "SocialNotesInd": false,
                "AirwayObjPreAdmnotesInd": false,
                "SystemicHistoryPopoverNotes": "",
                "SystemicHistoryPopoverObj": "",
                "ECGValue": "",
                "ECGUnits": "",
                "ECGNotes": "",
                "RespiratoryRemarks": "",
                "RespiratoryNotesInd": false,
                "PhysicalEvaluationArray": [],
                "showGeneralNotes": false,
                "PhysicalGeneralNotes": '',
                "IsCardioVascularWNL": false,
                "showCardiacNotes": false,
                "PhysicalCardiocNotes": '',
                "IsPulmonaryWNL": false,
                "showPulmonaryNotes": false,
                "PhysicalPulmonaryNotes": '',
                "IsHepaticWNL": false,
                "showHepaticNotes": false,
                "PhysicalHepaticNotes": '',
                "PhysicalNeurologicNotes": '',
                "IsClickSaveHealthPhysicalBtn": false,
            };
        };
        $scope.HealthPhysicalObj = angular.copy($scope.GetPreAdmAnesthetistObj());

     
        $scope.GetFilesObj = function () {
            return {
                "DocumentDetails": [],
                "TempImagesArray": []
            };
        };

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

        $scope.LogObj = {
            "UserId": $scope.UserId || null,
            "OrganizationId": $scope.HospitalId || null,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
            "PatientId": $scope.cacheStorageItem.PatientID || null,
            "LogArray": [],



            "AllergyItems": [],
            "SystemicHistory": [],
            "SurgicalHistory": [],
            "CurrentEyeMedications": [],
            "CurrentSystemicMedicationsHistory": [],
            "LifestyleDetail": [],
            "AdmittedBy": 0,
            "SurgeryList": [],
            "LabList": [],
            "ECG": "",
            "CardioVascularNotes": "",
            "AirwayChemistryNotes": "",

            "AirwayIsNormal": false,
            "AirwayROMTMS": "",
            "AirwayROMNECKAP": "",
            "AirwayROMNECKLAT": "",
            "AirwayClass": "",
            "AirwayNotes": "",
            "AnesthesiaTypelist": [],
            "DentitionList": [],
            "MouthOpening": "",
            "TMDistance": "",
            "UnableToAssess": false,
            "Tracheostomy": false,
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
            "IsRisksbenefitsAnesthesia": false,
            "ASAObjValue": "",
            "ASAObjEValue": "",
            "PreviousAnesthetics": [],
            "PrescriptionDetails": [],
            "Investigationslist": [],
            "PreAdmissionStatusId": null,
            "ReviewedBy": null,
            "AnesthesiologistReviewedBy": null,
            "Investigationslist": [],
            "PrescriptionDetails": [],
            "GeneralOrders": [],
            "RespiratoryRemarks":"",
            "PhysicalEvaluationArray": [],
            "PhysicalNeurologicNotes": '',
            "PhysicalGeneralNotes": '',
            "PhysicalCardiocNotes": '',
            "PhysicalHepaticNotes": '',
            "PhysicalPulmonaryNotes": '',

        };

        $scope.RestructureToData = function () {
            $scope.HPMainObj.PreAdmission = $scope.HPMainObj.PreAdmission || '';         
            if ($scope.HPMainObj.PreAdmission != '') {
                $scope.HealthPhysicalObj.IsCardiacWNL = $scope.HPMainObj.PreAdmission.IsCardiacWNL || false;
                $scope.HealthPhysicalObj.IsCNSHistory = $scope.HPMainObj.PreAdmission.IsCNSHistory || false;
                $scope.HealthPhysicalObj.IsCardiacWNL = $scope.HPMainObj.PreAdmission.IsCardiacWNL || false;
                $scope.HealthPhysicalObj.IsCardiovascularHistory = $scope.HPMainObj.PreAdmission.IsCardiovascularHistory || false;
                $scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL = $scope.HPMainObj.PreAdmission.IsAutoImmuneDisordersWNL || false;
                $scope.HealthPhysicalObj.IsEndocrineWNL = $scope.HPMainObj.PreAdmission.IsEndocrineWNL || false;
                $scope.HealthPhysicalObj.IsHemeOncWNL = $scope.HPMainObj.PreAdmission.IsHemeOncWNL || false;
                $scope.HealthPhysicalObj.IsHepaticWNL = $scope.HPMainObj.PreAdmission.IsHepaticWNL || false;
                $scope.HealthPhysicalObj.IsKidneyDiseaseWNL = $scope.HPMainObj.PreAdmission.IsKidneyDiseaseWNL || false;
                $scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL = $scope.HPMainObj.PreAdmission.IsMusculoSkeletalSystemWNL || false;
                $scope.HealthPhysicalObj.IsNervousSystemWNL = $scope.HPMainObj.PreAdmission.IsNervousSystemWNL || false;
                $scope.HealthPhysicalObj.IsNeurologicWNL = $scope.HPMainObj.PreAdmission.IsNeurologicWNL || false;
                $scope.HealthPhysicalObj.IsOthersWNL = $scope.HPMainObj.PreAdmission.IsOthersWNL || false;
                $scope.HealthPhysicalObj.IsPsychosisWNL = $scope.HPMainObj.PreAdmission.IsPsychosisWNL || false;
                $scope.HealthPhysicalObj.IsPulmonaryWNL = $scope.HPMainObj.PreAdmission.IsPulmonaryWNL || false;
                $scope.HealthPhysicalObj.IsRespiratoryNormal = $scope.HPMainObj.PreAdmission.IsRespiratoryNormal || false;
                $scope.HealthPhysicalObj.IsHeentWNL = $scope.HPMainObj.PreAdmission.IsHeentWNL || false;
                $scope.HealthPhysicalObj.IsLungsWNL = $scope.HPMainObj.PreAdmission.IsLungsWNL || false;
                $scope.HealthPhysicalObj.AirwayObj.Class = $scope.HPMainObj.PreAdmission.AirClass || '';
                $scope.LogObj.AirwayClass = angular.copy($scope.HPMainObj.PreAdmission.AirClass) || '';
                $scope.HealthPhysicalObj.AirwayObj.IsNormal = $scope.HPMainObj.PreAdmission.AirIsNormal || false;
                $scope.LogObj.AirwayObjIsNormal = angular.copy($scope.HPMainObj.PreAdmission.AirIsNormal )|| false;
                $scope.HealthPhysicalObj.AirwayObj.Notes = $scope.HPMainObj.PreAdmission.AirNotes || '';
                $scope.LogObj.AirwayNotes = $scope.HPMainObj.PreAdmission.AirNotes || '';
                $scope.HealthPhysicalObj.AirwayObj.ROMNECKAP = $scope.HPMainObj.PreAdmission.AirROMNECKAP || '';
                $scope.LogObj.AirwayROMNECKAP = angular.copy($scope.HPMainObj.PreAdmission.AirROMNECKAP) || '';
                $scope.HealthPhysicalObj.AirwayObj.ROMNECKLAT = $scope.HPMainObj.PreAdmission.AirROMNECKLAT || '';
                $scope.LogObj.AirwayROMNECKLAT = angular.copy($scope.HPMainObj.PreAdmission.AirROMNECKLAT) || '';
                $scope.HealthPhysicalObj.AirwayObj.ROMTMS = $scope.HPMainObj.PreAdmission.AirROMTMS || '';
                if ($scope.HPMainObj.PreAdmission.Airway != undefined) {
                    $scope.HealthPhysicalObj.AirwayObj.Dentition = $scope.HPMainObj.PreAdmission.Airway.Dentition || '';             
                    $scope.HealthPhysicalObj.AirwayObj.ChemistryNotes = $scope.HPMainObj.PreAdmission.Airway.ChemistryNotes || '';
                    $scope.LogObj.AirwayChemistryNotes = angular.copy($scope.HPMainObj.PreAdmission.Airway.ChemistryNotes) || '';

                    $scope.HealthPhysicalObj.AirwayObj.MouthOpening = $scope.HPMainObj.PreAdmission.Airway.MouthOpening || '';
                    $scope.LogObj.MouthOpening = $scope.HPMainObj.PreAdmission.Airway.MouthOpening || '';

                    $scope.HealthPhysicalObj.AirwayObj.TMDistance = $scope.HPMainObj.PreAdmission.Airway.TMDistance || '';
                    $scope.LogObj.TMDistance = $scope.HPMainObj.PreAdmission.Airway.TMDistance || '';

                    $scope.HealthPhysicalObj.AirwayObj.UnableToAssess = $scope.HPMainObj.PreAdmission.Airway.UnableToAssess || false;
                    $scope.LogObj.UnableToAssess = $scope.HPMainObj.PreAdmission.Airway.UnableToAssess || false;

                    $scope.HealthPhysicalObj.AirwayObj.Tracheostomy = $scope.HPMainObj.PreAdmission.Airway.Tracheostomy || false;
                    $scope.LogObj.Tracheostomy = $scope.HPMainObj.PreAdmission.Airway.Tracheostomy || false;
                }

                $scope.HealthPhysicalObj.PhysicalNeurologicNotes = $scope.HPMainObj.PhysicalNeurologicNotes || '';
                $scope.LogObj.PhysicalNeurologicNotes = $scope.HPMainObj.PhysicalNeurologicNotes || '';

                $scope.HealthPhysicalObj.PhysicalGeneralNotes = $scope.HPMainObj.PhysicalGeneralNotes || '';
                $scope.LogObj.PhysicalGeneralNotes = $scope.HPMainObj.PhysicalGeneralNotes || '';

                $scope.HealthPhysicalObj.PhysicalCardiocNotes = $scope.HPMainObj.PhysicalCardiocNotes || '';
                $scope.LogObj.PhysicalCardiocNotes = $scope.HPMainObj.PhysicalCardiocNotes || '';

                $scope.HealthPhysicalObj.PhysicalHepaticNotes = $scope.HPMainObj.PhysicalHepaticNotes || '';
                $scope.LogObj.PhysicalHepaticNotes = $scope.HPMainObj.PhysicalHepaticNotes || '';

                $scope.HealthPhysicalObj.PhysicalPulmonaryNotes = $scope.HPMainObj.PhysicalPulmonaryNotes || '';
                $scope.LogObj.PhysicalPulmonaryNotes = $scope.HPMainObj.PhysicalPulmonaryNotes || '';

                if ($scope.HealthPhysicalObj.PhysicalGeneralNotes !== '') {
                    $scope.HealthPhysicalObj.showGeneralNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showGeneralNotes = false;
                }
                if ($scope.HealthPhysicalObj.PhysicalCardiocNotes !== '') {
                    $scope.HealthPhysicalObj.showCardiacNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showCardiacNotes = false;
                }
                if ($scope.HealthPhysicalObj.PhysicalPulmonaryNotes !== '') {
                    $scope.HealthPhysicalObj.showPulmonaryNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showPulmonaryNotes = false;
                }
                if ($scope.HealthPhysicalObj.PhysicalHepaticNotes !== '') {
                    $scope.HealthPhysicalObj.showHepaticNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showHepaticNotes = false;
                }

                $scope.HealthPhysicalObj.LabNotes = $scope.HPMainObj.PreAdmission.LabNotes || '';
                $scope.LogObj.AirwayROMTMS = angular.copy($scope.HPMainObj.PreAdmission.AirROMTMS) || '';

                if ($scope.HPMainObj.PreAdmission.CardioVascular != undefined) {
                    $scope.HealthPhysicalObj.CardioVascularObj.ECG = $scope.HPMainObj.PreAdmission.CardioVascular.CardioECG || '';
                    $scope.HealthPhysicalObj.CardioVascularObj.ECGUnits = $scope.HPMainObj.PreAdmission.CardioVascular.CardioECGUnits || 'BPM';
                    $scope.HealthPhysicalObj.CardioVascularObj.Notes = $scope.HPMainObj.PreAdmission.CardioVascular.CardioNotes || '';
                }
              
                $scope.LogObj.ECG = angular.copy($scope.HPMainObj.PreAdmission.CardioECG) || '';

                if ($scope.HealthPhysicalObj.CardioVascularObj.ECG == '') {
                    $scope.HealthPhysicalObj.CardioVascularObj.ECG = $scope.HPMainObj.PreAdmission.ECGValue || '';
                    $scope.HealthPhysicalObj.CardioVascularObj.ECGUnits = $scope.HPMainObj.PreAdmission.ECGUnits || 'BPM';
                }
                if ($scope.HealthPhysicalObj.CardioVascularObj.Notes == '') {
                    $scope.HealthPhysicalObj.CardioVascularObj.Notes = $scope.HPMainObj.PreAdmission.ECGNotes || '';
                }

                $scope.LogObj.CardioVascularNotes = angular.copy($scope.HealthPhysicalObj.CardioVascularObj.Notes) || '';
                $scope.LogObj.ECGUnits = angular.copy($scope.HealthPhysicalObj.CardioVascularObj.ECGUnits)|| 'BPM';
                $scope.LogObj.ECG = angular.copy($scope.HealthPhysicalObj.CardioVascularObj.ECG) || '';
                if ($scope.HealthPhysicalObj.CardioVascularObj.Notes != "") {
                    $scope.HealthPhysicalObj.CardioVascularObj.ShowNotes = true; 
                }
                $scope.HPMainObj.PreAdmission.DentitionList = $scope.HPMainObj.PreAdmission.DentitionList|| [];
                $scope.LogObj.DentitionList = [];
                if ($scope.HPMainObj.PreAdmission.Airway.DentitionList.length > 0) {
                    let templogDentitionList = [];
                    angular.forEach($scope.HPMainObj.PreAdmission.Airway.DentitionList, function (Aitem) {
                        angular.forEach($scope.HealthPhysicalObj.AirwayObj.DentitionList, function (Bitem) {
                            if (Aitem.DentitionId == Bitem.DentitionId) {
                                Bitem.PatientDentitionId = Aitem.PatientDentitionId;  
                                Bitem.IsChecked = true;
                                Bitem.DeleteInd = 'N';
                                templogDentitionList.push(Bitem);
                            }
                        });
                    });
                    $scope.LogObj.DentitionList = angular.copy(templogDentitionList);
                }

            }

            $scope.HPMainObj.PhysicalEvaluationArray = $scope.HPMainObj.PhysicalEvaluationArray || [];
            $scope.LogObj.PhysicalEvaluationArray = $scope.HPMainObj.PhysicalEvaluationArray || [];

            if ($scope.HPMainObj.PhysicalEvaluationArray.length > 0) {
                angular.forEach($scope.HPMainObj.PhysicalEvaluationArray, function (Aitem) {
                    angular.forEach($scope.HealthPhysicalObj.PhysicalEvaluationArray, function (Bitem) {
                        if (Aitem.Id == Bitem.Id) {
                            Bitem.PhysicalEvaluationDetailId = Aitem.PhysicalEvaluationDetailId;
                            Bitem.IsChecked = true;
                        }
                    });
                });
            }

            $scope.LogObj.SystemicHistory = [];
            if ($scope.HPMainObj.SystemicHistory.length > 0) {
                $scope.TemplogArray = [];
                angular.forEach($scope.HPMainObj.SystemicHistory, function (Aitem) {
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (Bitem) {
                        if (Aitem.HistoryId == Bitem.HistoryId) {
                            Bitem.PatientDetailId = Aitem.PatientDetailId;
                            Bitem.Value = Aitem.Value;
                            Bitem.Remarks = Aitem.Remarks || '';
                            Bitem.IsNoshowROS = Aitem.IsNoshowROS || false;
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
                            $scope.TemplogArray.push(Bitem);
                        }
                    });
                });
                $scope.LogObj.SystemicHistory = angular.copy($scope.TemplogArray);

                if ($scope.LogObj.SystemicHistory.length > 0) {
                    angular.forEach($scope.LogObj.SystemicHistory, function (item) {
                        item.IsChecked = true;
                    });
                }

                let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 110);
                if (templest.length>0) {
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
            if ($scope.HPMainObj.LabInvestigation.length > 0) {
                let tempforlog = [];
                angular.forEach($scope.HPMainObj.LabInvestigation, function (Aitem) {
                    angular.forEach($scope.HealthPhysicalObj.LabList, function (Bitem) {
                        if (Aitem.ProcedureId == Bitem.ProcedureId) {
                            Bitem.InvestigationResultDate = Aitem.InvestigationResultDate;
                            Bitem.ResultId = Aitem.ResultId;
                            Bitem.ResultValue = Aitem.ResultValue;
                            Bitem.AbNormal = Aitem.AbNormal || false;
                            Bitem.Normal = Aitem.Normal || false;
                            Bitem.Remarks = Aitem.Remarks || '';
                            if (Bitem.Remarks != '') {
                                Bitem.ShowNotes = true;
                            }
                            tempforlog.push(Bitem);
                        }
                    });
                });
                $scope.LogObj.LabList = angular.copy(tempforlog) || [];
            }
            $scope.HealthPhysicalObj.DrugNames = $scope.HealthPhysicalObj.DrugNames || [];
            if ($scope.HPMainObj.LifestyleDetail.length > 0) {
                angular.forEach($scope.HPMainObj.LifestyleDetail, function (Litem) {
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
            }

            if ($scope.HealthPhysicalObj.AirwayObj.ChemistryNotes != '') {
                $scope.HealthPhysicalObj.ChemistryNotesInd = true;
            } else {
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

            $scope.HealthPhysicalObj.RespiratoryRemarks = $scope.HPMainObj.RespiratoryRemarks || '';
            $scope.LogObj.RespiratoryRemarks = $scope.HPMainObj.RespiratoryRemarks || '';

            if ($scope.HealthPhysicalObj.RespiratoryRemarks != '') {
                $scope.HealthPhysicalObj.RespiratoryNotesInd = true;
            } else {
                $scope.HealthPhysicalObj.RespiratoryNotesInd = false;
            }

        }

        $scope.init = function () {
            $scope.HealthPhysicalObj = angular.copy($scope.GetPreAdmAnesthetistObj());
            $scope.FilesObj = angular.copy($scope.GetFilesObj());

            //var Req = {
            //    "ParentOrganizationId": $scope.ParenthospitalId,
            //};

            $q.all([
                eHnoteDiagnosisDataServices.GetAllMasterConsultationData(),
                eHnoteSurgeryService.GetPreAdmissionHealthCategories($scope.ParenthospitalId),

            ]).then(function (resp) {

                if (resp[0].data.status === "Success") {
                    $scope.HealthPhysicalObj.AlcoholStatus = resp[0].data.AlcoholStatus || [];
                    $scope.HealthPhysicalObj.AlcoholQuantity = resp[0].data.AlcoholQuantity || [];
                    $scope.HealthPhysicalObj.SmokingStatus = resp[0].data.SmokingStatus || [];
                    $scope.HealthPhysicalObj.SmokingQuantity = resp[0].data.SmokingQuantity || [];
                    $scope.HealthPhysicalObj.DrugNames = resp[0].data.DrugNames || [];
                    $scope.HealthPhysicalObj.DrugQuantity = resp[0].data.DrugQuantity || [];
                }
                if (resp[1].data.status === "Success") {
                    if (resp[1].data.DentitionArray.length > 0) {
                        $scope.HealthPhysicalObj.AirwayObj.DentitionList = resp[1].data.DentitionArray || [];
                        angular.forEach($scope.HealthPhysicalObj.AirwayObj.DentitionList, function (item) {
                            item.IsChecked = false;
                            item.PatientDentitionId = null;
                        });
                    }

                    //if (resp[1].data.ChemistryData.length > 0) {
                    //    angular.forEach(resp[1].data.ChemistryData, function (item) {
                    //        item.IsChecked = false;
                    //        item.PatientDentitionId = null;
                    //    });
                    //    if ($scope.HealthPhysicalObj.LabList.length>0) {

                    //    }
                    //}

                    if (resp[1].data.SystemicHistory.length > 0) {

                        $scope.HealthArray = angular.copy(resp[1].data.SystemicHistory);
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
                                "IsNoshowROS": false,
                                "IsDiabetes": false,
                                "StatusId": 1,
                                "SeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                                "IsNormal": item.IsNormal
                            };
                            $scope.HealthPhysicalObj.SystemicHistoryArray.push(object);

                        })
                    }

                    if (resp[1].data.rows.length > 0) {
                        angular.forEach(resp[1].data.rows, function (Ritem) {
                            if (Ritem.CategoryId == 18 || Ritem.CategoryId == 19 || Ritem.CategoryId == 20 || Ritem.CategoryId == 21) {
                                var PEobject = {
                                    "PhysicalEvaluationDetailId": 0,
                                    "HistoryId": Ritem.CategoryId,
                                    "HistoryName": Ritem.CategoryName,
                                    "Id": Ritem.Id,
                                    "Description": Ritem.Description,
                                    "IsChecked": false,
                                    "IsNormal": Ritem.IsNormal,
                                    "DeleteInd": 'N',
                                };
                                $scope.HealthPhysicalObj.PhysicalEvaluationArray.push(PEobject);
                            }
                        });
                    };
                  
                }


                if ($scope.HPMainObj != '') {

                    $scope.RestructureToData();
                }
            });



        }
        $scope.init();



        $scope.SelectCNSBtn = function (type, item) {
            if (type === 1) {
                if (item.Value == "" || item.Value == "History Present") {
                    item.Value = "No History";
                    item.IsNoshowROS = true;
                    item.DeleteInd = "N";
                } else {
                    item.Value = "";
                    item.PatientDetailId = item.PatientDetailId || 0;
                    if (item.PatientDetailId!=0) {
                        item.DeleteInd = "Y";
                    }
                }
            }
            if (type === 2) {
                if (item.Value == "" || item.Value == "No History") {
                    item.Value = "History Present";
                    item.DeleteInd = "N";
                    item.IsNoshowROS = false;
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
                    item.ResultId = item.ResultId || 0;
                    if (item.ResultId != 0) {
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
        $scope.ChangeType = function (val, item) {
            if (val == 1) {
                if (item.Value == "" || item.Value == "No") {
                    item.Value = "Yes";
                    item.DeleteInd = "N";
                    if (item.Value == 'Yes' && item.HistoryId == 110) {
                        let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 158 || x.HistoryId == 159);
                        if (templest.length > 0) {
                            angular.forEach(templest, function (Aitem) {
                                Aitem.IsDiabetes = true;
                            })
                        }
                    }
                    if (item.Value == 'Yes' && item.HistoryId == 114) {
                        let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 160 || x.HistoryId == 161);
                        if (templest.length > 0) {
                            angular.forEach(templest, function (Aitem) {
                                Aitem.IsDiabetes = true;
                            })
                        }
                    }
                } else {
                    item.Value = "";
                    item.PatientDetailId = item.PatientDetailId || 0;
                    if (item.PatientDetailId != 0) {
                        item.DeleteInd = "Y";
                    }
                    if (item.HistoryId == 110 || item.HistoryId == 114) {
                        let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 158 || x.HistoryId == 159);
                        if (templest.length > 0) {
                            angular.forEach(templest, function (Aitem) {
                                Aitem.IsDiabetes = false;
                            })
                        }
                    }
                }
            }
            if (val == 2) {
                if (item.Value == "" || item.Value == "Yes") {
                    item.Value = "No";
                    item.DeleteInd = "N";
                    item.IsNoshowROS = true;
                    if (item.Value == 'No' && item.HistoryId == 110) {
                        let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 158 || x.HistoryId == 159);
                        if (templest.length > 0) {
                            angular.forEach(templest, function (Aitem) {
                                Aitem.IsDiabetes = false;
                                Aitem.Value = '';
                                Aitem.Remarks = '';
                            })
                        }
                    }
                    if (item.Value == 'No' && item.HistoryId == 114) {
                        let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 160 || x.HistoryId == 161);
                        if (templest.length > 0) {
                            angular.forEach(templest, function (Aitem) {
                                Aitem.IsDiabetes = false;
                                Aitem.Value = '';
                                Aitem.Remarks = '';
                            })
                        }
                    }
                } else {
                    item.Value = "";
                    item.PatientDetailId = item.PatientDetailId || 0;
                    if (item.PatientDetailId != 0) {
                        item.DeleteInd = "Y";
                    }

                }
            }
        }

        $scope.ChangeType1 = function (item, val) {
            val = val || '';
            if (val != '') {
                item.Value = val;
                if (item.Value == 'Yes' && item.HistoryId == 110) {
                    let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 158 || x.HistoryId == 159);
                    if (templest.length > 0) {
                        angular.forEach(templest, function (Aitem) {
                            Aitem.IsDiabetes = true;
                        })
                    }
                }
                if (item.Value == 'No' && item.HistoryId == 110) {
                    let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 158 || x.HistoryId == 159);
                    if (templest.length > 0) {
                        angular.forEach(templest, function (Aitem) {
                            Aitem.IsDiabetes = false;
                        })
                    }
                }
                if (item.Value == 'Yes' && item.HistoryId == 114) {
                    let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 160 || x.HistoryId == 161);
                    if (templest.length > 0) {
                        angular.forEach(templest, function (Aitem) {
                            Aitem.IsDiabetes = true;
                        })
                    }
                }
                if (item.Value == 'No' && item.HistoryId == 114) {
                    let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 160 || x.HistoryId == 161);
                    if (templest.length > 0) {
                        angular.forEach(templest, function (Aitem) {
                            Aitem.IsDiabetes = false;
                        })
                    }
                }
            }
        }


        $scope.closeuibpopup = function () {
            $uibModalInstance.close();
        };

        //$scope.closeuibpopup = function () {
        //    $uibModalInstance.dismiss();
        //};
      
        //$scope.AddSystematicHistorymore = function () {
        //    $scope.mInstanceAdd = $uibModal.open({
        //        "templateUrl": "templates/uibpopups/Advancedhealth.html",
        //        "backdrop": "static",
        //        "keyboard": false,
        //        //"windowClass": "modal__popup--1 bottom-to-top-modal in",
        //        "windowClass": "offcanves-right",
        //        //"scope": $scope,
        //        "resolve": {
        //            "HealthPhysicalObj": function () { return angular.copy($scope.HealthPhysicalObj); },

        //        },
        //        "controller": function ($scope, $uibModal, $uibModalInstance, HealthPhysicalObj) {
        //            $scope.HealthArray = HealthPhysicalObj.SystemicHistoryArray;
        //            $scope.HealthPhysicalObj = HealthPhysicalObj;

        //            $scope.closeuib = function () {
        //                $uibModalInstance.dismiss();
        //            };

        //            $scope.OnSelectNormal = function (item) {
        //                if (item === "All") {
        //                    if ($scope.HealthPhysicalObj.IsAllHealthWNL) {
        //                        angular.forEach($scope.HealthArray, function (kitem) {
        //                            kitem.IsChecked = false;
        //                        });
        //                        $scope.HealthPhysicalObj.IsCardiacWNL = true;
        //                        $scope.HealthPhysicalObj.IsPulmonaryWNL = true;
        //                        $scope.HealthPhysicalObj.IsHepaticWNL = true;
        //                        $scope.HealthPhysicalObj.IsEndocrineWNL = true;
        //                        $scope.HealthPhysicalObj.IsNeurologicWNL = true;
        //                        $scope.HealthPhysicalObj.IsHemeOncWNL = true;
        //                        $scope.HealthPhysicalObj.IsNervousSystemWNL = true;
        //                        $scope.HealthPhysicalObj.IsKidneyDiseaseWNL = true;
        //                        $scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL = true;
        //                        $scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL = true;
        //                        $scope.HealthPhysicalObj.IsPsychosisWNL = true;
        //                        $scope.HealthPhysicalObj.IsOthersWNL = true;
        //                        $scope.HealthPhysicalObj.IsHeentWNL = true;
        //                        $scope.HealthPhysicalObj.IsLungsWNL = true;
        //                    } else {
        //                        $scope.HealthPhysicalObj.IsCardiacWNL = false;
        //                        $scope.HealthPhysicalObj.IsPulmonaryWNL = false;
        //                        $scope.HealthPhysicalObj.IsHepaticWNL = false;
        //                        $scope.HealthPhysicalObj.IsEndocrineWNL = false;
        //                        $scope.HealthPhysicalObj.IsNeurologicWNL = false;
        //                        $scope.HealthPhysicalObj.IsHemeOncWNL = false;
        //                        $scope.HealthPhysicalObj.IsNervousSystemWNL = false;
        //                        $scope.HealthPhysicalObj.IsKidneyDiseaseWNL = false;
        //                        $scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL = false;
        //                        $scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL = false;
        //                        $scope.HealthPhysicalObj.IsPsychosisWNL = false;
        //                        $scope.HealthPhysicalObj.IsOthersWNL = false;
        //                        $scope.HealthPhysicalObj.IsHeentWNL = false;
        //                        $scope.HealthPhysicalObj.IsLungsWNL = false;
        //                    }
        //                }
        //                if (item === "Cardiac") {
        //                    if ($scope.HealthPhysicalObj.IsCardiacWNL) {
        //                        angular.forEach($scope.HealthArray, function (kitem) {
        //                            if (kitem.TypeId === 1) {
        //                                kitem.IsChecked = false;
        //                            }
        //                        });
        //                    } else {
        //                        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //                    }
        //                }
        //                if (item === "Pulmonary") {
        //                    if ($scope.HealthPhysicalObj.IsPulmonaryWNL) {
        //                        angular.forEach($scope.HealthArray, function (kitem) {
        //                            if (kitem.TypeId === 2) {
        //                                kitem.IsChecked = false;
        //                            }
        //                        });
        //                    } else {
        //                        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //                    }
        //                }
        //                if (item === "Hepatic") {
        //                    if ($scope.HealthPhysicalObj.IsHepaticWNL) {
        //                        angular.forEach($scope.HealthArray, function (kitem) {
        //                            if (kitem.TypeId === 3) {
        //                                kitem.IsChecked = false;
        //                            }
        //                        });
        //                    } else {
        //                        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //                    }
        //                }
        //                if (item === "Endocrine") {
        //                    if ($scope.HealthPhysicalObj.IsEndocrineWNL) {
        //                        angular.forEach($scope.HealthArray, function (kitem) {
        //                            if (kitem.TypeId === 4) {
        //                                kitem.IsChecked = false;
        //                            }
        //                        });
        //                    } else {
        //                        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //                    }
        //                }
        //                if (item === "Neurologic") {
        //                    if ($scope.HealthPhysicalObj.IsNeurologicWNL) {
        //                        angular.forEach($scope.HealthArray, function (kitem) {
        //                            if (kitem.TypeId === 5) {
        //                                kitem.IsChecked = false;
        //                            }
        //                        });
        //                    } else {
        //                        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //                    }
        //                }
        //                if (item === "HemeOnc") {
        //                    if ($scope.HealthPhysicalObj.IsHemeOncWNL) {
        //                        angular.forEach($scope.HealthArray, function (kitem) {
        //                            if (kitem.TypeId === 6) {
        //                                kitem.IsChecked = false;
        //                            }
        //                        });
        //                    } else {
        //                        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //                    }
        //                }
        //                if (item === "Nervous System") {
        //                    if ($scope.HealthPhysicalObj.IsNervousSystemWNL) {
        //                        angular.forEach($scope.HealthArray, function (kitem) {
        //                            if (kitem.TypeId === 7) {
        //                                kitem.IsChecked = false;
        //                            }
        //                        });
        //                    } else {
        //                        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //                    }
        //                }
        //                if (item === "Kidney") {
        //                    if ($scope.HealthPhysicalObj.IsKidneyDiseaseWNL) {
        //                        angular.forEach($scope.HealthArray, function (kitem) {
        //                            if (kitem.TypeId === 8) {
        //                                kitem.IsChecked = false;
        //                            }
        //                        });
        //                    } else {
        //                        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //                    }
        //                }
        //                if (item === "MusculoSkeletal") {
        //                    if ($scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL) {
        //                        angular.forEach($scope.HealthArray, function (kitem) {
        //                            if (kitem.TypeId === 9) {
        //                                kitem.IsChecked = false;
        //                            }
        //                        });
        //                    } else {
        //                        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //                    }
        //                }
        //                if (item === "AutoImmune") {
        //                    if ($scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL) {
        //                        angular.forEach($scope.HealthArray, function (kitem) {
        //                            if (kitem.TypeId === 10) {
        //                                kitem.IsChecked = false;
        //                            }
        //                        });
        //                    } else {
        //                        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //                    }
        //                }
        //                if (item === "Psychosis") {
        //                    if ($scope.HealthPhysicalObj.IsPsychosisWNL) {
        //                        angular.forEach($scope.HealthArray, function (kitem) {
        //                            if (kitem.TypeId === 11) {
        //                                kitem.IsChecked = false;
        //                            }
        //                        });
        //                    } else {
        //                        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //                    }
        //                }
        //                if (item === "Others") {
        //                    if ($scope.HealthPhysicalObj.IsOthersWNL) {
        //                        angular.forEach($scope.HealthArray, function (kitem) {
        //                            if (kitem.TypeId === 12) {
        //                                kitem.IsChecked = false;
        //                            }
        //                        });
        //                    } else {
        //                        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //                    }
        //                }

        //                if (item === "Heent") {
        //                    if ($scope.HealthPhysicalObj.IsHeentWNL) {
        //                        angular.forEach($scope.HealthArray, function (kitem) {
        //                            if (kitem.TypeId === 16) {
        //                                kitem.IsChecked = false;
        //                            }
        //                        });
        //                    } else {
        //                        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //                    }
        //                }
        //                if (item === "Lungs") {
        //                    if ($scope.HealthPhysicalObj.IsLungsWNL) {
        //                        angular.forEach($scope.HealthArray, function (kitem) {
        //                            if (kitem.TypeId === 17) {
        //                                kitem.IsChecked = false;
        //                            }
        //                        });
        //                    } else {
        //                        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //                    }
        //                }

        //            };

        //            $scope.HealthAvancedPopUpSave = function () {
        //                var obj = {
        //                    "HealthPhysicalObj": $scope.HealthPhysicalObj,
        //                    "HealthArray": $scope.HealthArray,
        //                }
        //                $uibModalInstance.close(obj);
        //            }

        //        },
        //    });
        //    $scope.mInstanceAdd.result.then(function (resp) {
        //        if (resp.HealthArray.length>0) {
        //            var temparray1 = $filter("filter")(resp.HealthArray, function (kitem, index) { return kitem.IsChecked == true });
        //            if (temparray1.length > 0) {
        //                angular.forEach(temparray1, function (Aitem) {
        //                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (Bitem) {
        //                        if (Aitem.HistoryId == Bitem.HistoryId) {
        //                            Bitem.Value = Aitem.Value;
        //                            Bitem.Remarks = Aitem.Remarks;
        //                            Bitem.IsChecked = true;
        //                        }
        //                    })
        //                })
        //            }

        //            $scope.HealthPhysicalObj.IsCardiacWNL = resp.HealthPhysicalObj.IsCardiacWNL;
        //            $scope.HealthPhysicalObj.IsCNSHistory = resp.HealthPhysicalObj.IsCNSHistory;
        //            $scope.HealthPhysicalObj.IsCardiacWNL = resp.HealthPhysicalObj.IsCardiacWNL;
        //            $scope.HealthPhysicalObj.IsCardiovascularHistory = resp.HealthPhysicalObj.IsCardiovascularHistory;
        //            $scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL = resp.HealthPhysicalObj.IsAutoImmuneDisordersWNL;
        //            $scope.HealthPhysicalObj.IsEndocrineWNL = resp.HealthPhysicalObj.IsEndocrineWNL;
        //            $scope.HealthPhysicalObj.IsHemeOncWNL = resp.HealthPhysicalObj.IsHemeOncWNL;
        //            $scope.HealthPhysicalObj.IsHepaticWNL = resp.HealthPhysicalObj.IsHepaticWNL;
        //            $scope.HealthPhysicalObj.IsKidneyDiseaseWNL = resp.HealthPhysicalObj.IsKidneyDiseaseWNL;
        //            $scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL = resp.HealthPhysicalObj.IsMusculoSkeletalSystemWNL;
        //            $scope.HealthPhysicalObj.IsNervousSystemWNL = resp.HealthPhysicalObj.IsNervousSystemWNL;
        //            $scope.HealthPhysicalObj.IsNeurologicWNL = resp.HealthPhysicalObj.IsNeurologicWNL;
        //            $scope.HealthPhysicalObj.IsOthersWNL = resp.HealthPhysicalObj.IsOthersWNL;
        //            $scope.HealthPhysicalObj.IsPsychosisWNL = resp.HealthPhysicalObj.IsPsychosisWNL;
        //            $scope.HealthPhysicalObj.IsPulmonaryWNL = resp.HealthPhysicalObj.IsPulmonaryWNL;
        //            $scope.HealthPhysicalObj.IsRespiratoryNormal = resp.HealthPhysicalObj.IsRespiratoryNormal;
        //            $scope.HealthPhysicalObj.IsHeentWNL = resp.HealthPhysicalObj.IsHeentWNL;
        //            $scope.HealthPhysicalObj.IsLungsWNL = resp.HealthPhysicalObj.IsLungsWNL;
        //        }
        //    }, function (cancel) {

        //    });
        //};

        $scope.ChangeSmokingValue = function (item) {
            $scope.HealthPhysicalObj.LifestyleHistory.SmokingType = item;
            if (item == 'Yes') {
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
            } else {
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
        $scope.ChangeAlcoholValue = function (val) {
            if (val == 'Yes') {
                $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = 'Yes';
            } else {
                $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType = 'No';
                $scope.HealthPhysicalObj.LifestyleHistory.AlcoholStatusId = 0;
                $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationDate = null;
                $scope.HealthPhysicalObj.LifestyleHistory.AlcoholQuantityId = 0;
            }
        };
        $scope.ChangeDrugValue = function (val) {
            if (val == 'Yes') {
                $scope.HealthPhysicalObj.LifestyleHistory.DrugType = 'Yes';
            } else {
                $scope.HealthPhysicalObj.LifestyleHistory.DrugType = 'No';
                $scope.HealthPhysicalObj.LifestyleHistory.DrugStatusId = 0;
                $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate = null;
                $scope.HealthPhysicalObj.LifestyleHistory.DrugQuantityId = 0;
            }
        };
        $scope.SelectUrineAnalysis = function (val, item) {
            if (val == 1) {
                if (item.ResultValue == "" || item.ResultValue == "NEGATIVE") {
                    item.ResultValue = "POSITIVE";
                    item.DeleteInd = "N";
                } else {
                    item.ResultValue = "";
                    item.ResultId = item.ResultId || 0;
                    if (item.ResultId != 0) {
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
                    item.ResultId = item.ResultId || 0;
                    if (item.ResultId != 0) {
                        item.DeleteInd = "Y";
                    }
                }
            }

        }

        function generatePhysicalDescriptions(oldList, newList, oldNotes, newNotes) {
            let oldParts = [];
            let newParts = [];

            // Compare Dentition list
            newList.forEach(function (newItem) {
                let oldItem = oldList.find(item => item.Id === newItem.Id);
                if (!oldItem) {
                    newParts.push(newItem.Description);
                }
            });

            oldList.forEach(function (oldItem) {
                let newItem = newList.find(item => item.Id === oldItem.Id);
                if (!newItem) {
                    oldParts.push(oldItem.Description);
                }
            });

            // Compare Notes
            if ((oldNotes || '') !== (newNotes || '')) {
                if (oldNotes) oldParts.push(`Notes: ${oldNotes}`);
                if (newNotes) newParts.push(`Notes: ${newNotes}`);
            }

            return {
                oldDescription: oldParts.join(', '),
                newDescription: newParts.join(', ')
            };
        }
        function generateDentitionDescriptions(oldList, newList, oldNotes, newNotes) {
            let oldParts = [];
            let newParts = [];

            // Compare Dentition list
            newList.forEach(function (newItem) {
                let oldItem = oldList.find(item => item.DentitionId === newItem.DentitionId);
                if (!oldItem) {
                    newParts.push(newItem.DentitionName);
                }
            });

            oldList.forEach(function (oldItem) {
                let newItem = newList.find(item => item.DentitionId === oldItem.DentitionId);
                if (!newItem) {
                    oldParts.push(oldItem.DentitionName);
                }
            });

            // Compare Notes
            if ((oldNotes || '') !== (newNotes || '')) {
                if (oldNotes) oldParts.push(`Notes: ${oldNotes}`);
                if (newNotes) newParts.push(`Notes: ${newNotes}`);
            }

            return {
                oldDescription: oldParts.join(', '),
                newDescription: newParts.join(', ')
            };
        }

        function generateDeltaDescriptions(oldList, newList, oldECG, newECG) {
            let oldParts = [];
            let newParts = [];

            // --- ECG VALUE + UNITS COMBINED ---
            const formatECGValue = (val, units) => {
                val = val || '';
                if (val == '') return '';
                return (val || '') + (units ? ' ' + units : '');
            };

            let oldECGValueCombined = formatECGValue(oldECG.ECG, oldECG.ECGUnits);
            let newECGValueCombined = formatECGValue(newECG.ECG, newECG.ECGUnits);

            if (oldECGValueCombined !== newECGValueCombined) {
                if (oldECGValueCombined != '') {
                    oldParts.push('ECGValue: ' + oldECGValueCombined);
                }
                if (newECGValueCombined != '') {
                    newParts.push('ECGValue: ' + newECGValueCombined);
                }
            }

            // ECG Notes
            if ((oldECG.ECGNotes || '') !== (newECG.ECGNotes || '')) {
                if (oldECG.ECGNotes != '') {
                    oldParts.push('ECGNotes: ' + (oldECG.ECGNotes || ''));
                }
                if (newECG.ECGNotes != '') {
                    newParts.push('ECGNotes: ' + (newECG.ECGNotes || ''));
                }
            }

            // --- LAB VALUES COMPARISON ---
            newList.forEach(function (newItem) {
                let oldItem = oldList.find(item => item.ProcedureId === newItem.ProcedureId);

                let procName = '';
                if (newItem.ProcedureId === 849) {
                    procName = 'PT';
                } else if (newItem.ProcedureId === 850) {
                    procName = 'PTT';
                } else {
                    procName = newItem.ProcedureName;
                }
                let resultDisplay = newItem.ResultValue || '';
                if (newItem.ProcedureId === 849 || newItem.ProcedureId === 850) {
                    if (newItem.Normal === true) {
                        resultDisplay += ' (WNL)';
                    } else if (newItem.AbNormal === true) {
                        resultDisplay += ' (Abnormal)';
                    }
                }
                if (
                    !oldItem ||
                    oldItem.ResultValue !== newItem.ResultValue ||
                    oldItem.Remarks !== newItem.Remarks ||
                    oldItem.AbNormal !== newItem.AbNormal ||
                    oldItem.Normal !== newItem.Normal
                ) {
                    if (oldItem) {
                        let oldProcName = '';
                        if (oldItem.ProcedureId === 849) {
                            oldProcName = 'PT';
                        } else if (oldItem.ProcedureId === 850) {
                            oldProcName = 'PTT';
                        } else {
                            oldProcName = oldItem.ProcedureName;
                        }


                        let oldResultDisplay = oldItem.ResultValue || '';
                        if (oldItem.ProcedureId === 849 || oldItem.ProcedureId === 850) {
                            if (oldItem.Normal === true) {
                                oldResultDisplay += ' (WNL)';
                            } else if (oldItem.AbNormal === true) {
                                oldResultDisplay += ' (Abnormal)';
                            }
                        }

                        var OldRemarks = '';
                        oldItem.Remarks = oldItem.Remarks || '';
                        if (oldItem.Remarks !== '') {
                            OldRemarks = ', Notes :' + oldItem.Remarks;
                        }
                        var NewRemarks = '';
                        newItem.Remarks = newItem.Remarks || '';
                        if (newItem.Remarks !== '') {
                            NewRemarks = ', Notes :' + newItem.Remarks;
                        }

                        oldParts.push(`${oldProcName}: ${oldResultDisplay} ${OldRemarks}`);
                        newParts.push(`${procName}: ${resultDisplay} ${NewRemarks}`);
                    } else {
                        var NewRemarks = '';
                        newItem.Remarks = newItem.Remarks || '';
                        if (newItem.Remarks !== '') {
                            NewRemarks = ', Notes :' + newItem.Remarks;
                        }

                        newParts.push(`${procName}: ${resultDisplay} ${NewRemarks}`);
                    }
                }
            });

            return {
                oldDescription: oldParts.join(', '),
                newDescription: newParts.join(', ')
            };
        }
        function generateChemistryDescriptions(oldList, newList, oldNotes, newNotes) {
            let oldParts = [];
            let newParts = [];

            newList.forEach(function (newItem) {
                let oldItem = oldList.find(item => item.ProcedureId === newItem.ProcedureId);

                if (!oldItem || oldItem.ResultValue !== newItem.ResultValue) {
                    if (oldItem) oldParts.push(`${oldItem.ProcedureName}: ${oldItem.ResultValue}`);
                    newParts.push(`${newItem.ProcedureName}: ${newItem.ResultValue}`);
                }
            });

            // Compare Chemistry Notes
            if ((oldNotes || '') !== (newNotes || '')) {
                if (oldNotes) oldParts.push(`ChemistryNotes: ${oldNotes}`);
                if (newNotes) newParts.push(`ChemistryNotes: ${newNotes}`);
            }

            return {
                oldDescription: oldParts.join(', '),
                newDescription: newParts.join(', ')
            };
        }
        $scope.findHandPDifferences = function (savedArray, editedArray, LabsInvestigationsArray,editLabsInvestigationsArray) {
            var differences = [];
            /* var maxLength = Math.max(arr1.length, arr2.length);*/

            angular.forEach(savedArray, function (item) {
                //  item.ChecklistDate = item.ChecklistDate || null;
                item.Remarks = item.Remarks || '';

                var edited = editedArray.filter(function (eitem) {
                    //  eitem.ChecklistDate = eitem.ChecklistDate || null;
                    eitem.Remarks = eitem.Remarks || '';

                    return ((eitem.HistoryId == item.HistoryId) && (item.TypeId == eitem.TypeId) && (item.Value == eitem.Value) && (item.Remarks == eitem.Remarks) && (item.DeleteInd == eitem.DeleteInd));
                }) || [];


                if (edited.length == 0) {
                    differences.push({
                        HistoryId: item.HistoryId,
                        TypeId: item.TypeId,
                        HistoryName: item.HistoryName,
                        Value: item.Value,
                    });
                    /*count++;*/
                }

            });
            angular.forEach(LabsInvestigationsArray, function (item) {
                var edited = editLabsInvestigationsArray.filter(function (eitem) {

                    return ((eitem.ProcedureId == item.ProcedureId) && (item.ProcedureName == eitem.ProcedureName) && (item.ResultValue == eitem.ResultValue));
                }) || [];


                if (edited.length == 0) {
                    differences.push({
                        ProcedureId: item.ProcedureId,
                        ProcedureName: item.ProcedureName,
                        ResultValue: item.ResultValue,
                    });

                }

            });

            return differences;
        };


        $scope.HealthPhysicalObj.IsClickSaveHealthPhysicalBtn = false;
        $scope.SaveHealthPhysicalData = function () {
            $scope.LogObj.LogArray = [];
           

            $scope.HealthPhysicalObj.LifestyleHistoryArray = $scope.HealthPhysicalObj.LifestyleHistoryArray || [];
            if ($scope.HealthPhysicalObj.LifestyleHistory != undefined) {

                if ($scope.HealthPhysicalObj.LifestyleHistory.PatientDetailId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.SmokingType != "" || $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.length > 0 ||
                    $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType != "" || $scope.HealthPhysicalObj.LifestyleHistory.AlcoholQuantityId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.AlcoholStatusId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDuration != "" || $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationDate != "" ||
                    $scope.HealthPhysicalObj.LifestyleHistory.DrugType != "" || $scope.HealthPhysicalObj.LifestyleHistory.DrugQuantityId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.DrugWhenQuitId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.DrugDuration != "" || $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate != "" || $scope.HealthPhysicalObj.LifestyleHistory.DrugArray.length > 0 || $scope.HealthPhysicalObj.LifestyleHistory.Remarks != '') {
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
                        $scope.HealthPhysicalObj.LifestyleHistory.DrugType != "" || $scope.HealthPhysicalObj.LifestyleHistory.DrugQuantityId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.DrugWhenQuitId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.DrugDuration != "" || $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate != "" || $scope.HealthPhysicalObj.LifestyleHistory.DrugArray.length > 0 || $scope.HealthPhysicalObj.LifestyleHistory.Remarks != '') {

                        $scope.HealthPhysicalObj.LifestyleHistoryArray.push($scope.HealthPhysicalObj.LifestyleHistory);
                    }

                }

            }
            let PatientSurgeryId = null;
            if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId==14) {
                $scope.cacheStorageItem.SurgeryList[0] = $scope.cacheStorageItem.SurgeryList[0] || [];
                PatientSurgeryId = $scope.cacheStorageItem.SurgeryList[0].PatientSurgeryId;
            }
            if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
                $scope.cacheStorageItem.PreAdmSurgeryList[0] = $scope.cacheStorageItem.PreAdmSurgeryList[0] || [];
                PatientSurgeryId = $scope.cacheStorageItem.PreAdmSurgeryList[0].PatientSurgeryId;
            }

            $scope.currentDate = $filter('date')(new Date(), "yyyy-MM-dd");
            let reqObj = {
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId || null,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "PatientSurgeryId": PatientSurgeryId,
                //"Tab": "PreAdmission Vitals",
                //"SignedDate": $scope.currentDate,                      
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
                "LabNotes": $scope.HealthPhysicalObj.LabNotes||'',
                "Airway": '',
                "LabInvestigations": [],
                "SystemicHistoryArray": [],
                "TempDocumentDetails": [],
                "DocumentDetails": [],
                "LifestyleHistory": $scope.HealthPhysicalObj.LifestyleHistoryArray || [],
                "ECGValue": $scope.HealthPhysicalObj.CardioVascularObj.ECG || "",
                "ECGUnits": $scope.HealthPhysicalObj.CardioVascularObj.ECGUnits || "",
                "ECGNotes": $scope.HealthPhysicalObj.CardioVascularObj.Notes || "",
                "RespiratoryRemarks": $scope.HealthPhysicalObj.RespiratoryRemarks || "",
                "PhysicalGeneralNotes": $scope.HealthPhysicalObj.PhysicalGeneralNotes || "",
                "PhysicalCardiocNotes": $scope.HealthPhysicalObj.PhysicalCardiocNotes || "",
                "PhysicalNeurologicNotes": $scope.HealthPhysicalObj.PhysicalNeurologicNotes || "",
                "PhysicalPulmonaryNotes": $scope.HealthPhysicalObj.PhysicalPulmonaryNotes || "",
                "PhysicalHepaticNotes": $scope.HealthPhysicalObj.PhysicalHepaticNotes || "",
                "PhysicalEvaluationArray": [],
                "Logs": {},
            }

            if ($scope.HealthPhysicalObj.LabList.length>0) {
                angular.forEach($scope.HealthPhysicalObj.LabList, function (item) {
                    item.ResultId = item.ResultId||0;
                });
            }
            if ($scope.HealthPhysicalObj.LabList.length > 0) {
                angular.forEach($scope.HealthPhysicalObj.LabList, function (item) {
                    if (item.ResultValue == '' && item.ResultId !== 0) {
                        item.DeleteInd = 'Y';
                    }
                });
            }

            var temparray = $filter("filter")($scope.HealthPhysicalObj.LabList, function (kitem, index) { return kitem.ResultValue != '' || kitem.Normal == true || kitem.AbNormal == true || kitem.ResultId!= 0 });

            if (temparray.length > 0) {
                angular.forEach(temparray, function (item) {
                    item.InvestigationResultDate = $scope.currentDate;
                });
                reqObj.LabInvestigations = temparray;
            } else {
            }

            $scope.HealthPhysicalObj.CardioVascularObj.ECG = $scope.HealthPhysicalObj.CardioVascularObj.ECG || '';
            $scope.HealthPhysicalObj.CardioVascularObj.Notes = $scope.HealthPhysicalObj.CardioVascularObj.Notes || '';

            if ($scope.HealthPhysicalObj.PhysicalEvaluationArray.length > 0) {
                angular.forEach($scope.HealthPhysicalObj.PhysicalEvaluationArray, function (item) {
                    item.PhysicalEvaluationDetailId = item.PhysicalEvaluationDetailId || 0;
                    item.HistoryId = item.HistoryId || null;
                    if (item.PhysicalEvaluationDetailId != 0 && item.IsChecked == false && (item.HistoryId == 18 || item.HistoryId == 19 || item.HistoryId == 20 || item.HistoryId == 21)) {
                        item.DeleteInd = "Y";
                    }
                });
            }

            if ($scope.HealthPhysicalObj.PhysicalEvaluationArray.length > 0) {
                angular.forEach($scope.HealthPhysicalObj.PhysicalEvaluationArray, function (item) {
                    if (item.Id == 126 && $scope.HealthPhysicalObj.PhysicalGeneralNotes == '') {
                        if (item.PhysicalEvaluationDetailId != 0) {
                            item.DeleteInd = "Y";
                        } else {
                            item.IsChecked = false;
                        }
                    }
                    if (item.Id == 131 && $scope.HealthPhysicalObj.PhysicalCardiocNotes == '') {
                        if (item.PhysicalEvaluationDetailId != 0) {
                            item.DeleteInd = "Y";
                        } else {
                            item.IsChecked = false;
                        }
                    }
                    if (item.Id == 138 && $scope.HealthPhysicalObj.PhysicalPulmonaryNotes == '') {
                        if (item.PhysicalEvaluationDetailId != 0) {
                            item.DeleteInd = "Y";
                        } else {
                            item.IsChecked = false;
                        }
                    }
                    if (item.Id == 143 && $scope.HealthPhysicalObj.PhysicalHepaticNotes == '') {
                        if (item.PhysicalEvaluationDetailId != 0) {
                            item.DeleteInd = "Y";
                        } else {
                            item.IsChecked = false;
                        }
                    }
                });
            }

            var PhysicalTempArray = $filter("filter")($scope.HealthPhysicalObj.PhysicalEvaluationArray, function (kitem, index) { return kitem.PhysicalEvaluationDetailId != 0 || kitem.IsChecked == true });
            if (PhysicalTempArray.length > 0) {
                reqObj.PhysicalEvaluationArray = PhysicalTempArray;
            }

            if (reqObj.PhysicalEvaluationArray.length > 0 || $scope.LogObj.PhysicalEvaluationArray.length > 0) {
                //if ($scope.LogObj.PhysicalEvaluationArray.length == 0) {
                //    var TempGeneralData = $filter('filter')(reqObj.PhysicalEvaluationArray, { 'HistoryId': 18 }, true) || [];
                //    if (TempGeneralData.length > 0) {
                //        let obj = {
                //            "LogId": 0,
                //            "ModuleId": 2,
                //            "ModuleName": "ASC",
                //            "SubModuleId": 9,
                //            "SubModuleName": "Pre-Op",
                //            "ScreenType": "Pre-Op Anesthesia",
                //            "ActionType": "Added",
                //            "ActionDescription": `General Data In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                //        };
                //        $scope.LogObj.LogArray.push(obj);
                //    }
                //    var TempCardiovascularData = $filter('filter')(reqObj.PhysicalEvaluationArray, { 'HistoryId': 19 }, true) || [];
                //    if (TempCardiovascularData.length > 0) {
                //        let obj = {
                //            "LogId": 0,
                //            "ModuleId": 2,
                //            "ModuleName": "ASC",
                //            "SubModuleId": 9,
                //            "SubModuleName": "Pre-Op",
                //            "ScreenType": "Pre-Op Anesthesia",
                //            "ActionType": "Added",
                //            "ActionDescription": `Cardiovascular Data In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                //        };
                //        $scope.LogObj.LogArray.push(obj);
                //    }
                //    var TempPulmonaryData = $filter('filter')(reqObj.PhysicalEvaluationArray, { 'HistoryId': 20 }, true) || [];
                //    if (TempPulmonaryData.length > 0) {
                //        let obj = {
                //            "LogId": 0,
                //            "ModuleId": 2,
                //            "ModuleName": "ASC",
                //            "SubModuleId": 9,
                //            "SubModuleName": "Pre-Op",
                //            "ScreenType": "Pre-Op Anesthesia",
                //            "ActionType": "Added",
                //            "ActionDescription": `Pulmonary Data In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                //        };
                //        $scope.LogObj.LogArray.push(obj);
                //    }
                //    if (reqObj.PhysicalNeurologicNotes !== '') {
                //        let obj = {
                //            "LogId": 0,
                //            "ModuleId": 2,
                //            "ModuleName": "ASC",
                //            "SubModuleId": 9,
                //            "SubModuleName": "Pre-Op",
                //            "ScreenType": "Pre-Op Anesthesia",
                //            "ActionType": "Added",
                //            "ActionDescription": `Neurologic Data In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                //        };
                //        $scope.LogObj.LogArray.push(obj);
                //    }
                //    var TempHepaticData = $filter('filter')(reqObj.PhysicalEvaluationArray, { 'HistoryId': 21 }, true) || [];
                //    if (TempHepaticData.length > 0) {
                //        let obj = {
                //            "LogId": 0,
                //            "ModuleId": 2,
                //            "ModuleName": "ASC",
                //            "SubModuleId": 9,
                //            "SubModuleName": "Pre-Op",
                //            "ScreenType": "Pre-Op Anesthesia",
                //            "ActionType": "Added",
                //            "ActionDescription": `GI/Hepatic Data In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                //        };
                //        $scope.LogObj.LogArray.push(obj);
                //    }

                //} else {
                //    var TempGeneralData = $filter('filter')(reqObj.PhysicalEvaluationArray, { 'HistoryId': 18, 'DeleteInd': 'N' }, true) || [];
                //    var TempLogGeneralData = $filter('filter')($scope.LogObj.PhysicalEvaluationArray, { 'HistoryId': 18, 'DeleteInd': 'N' }, true) || [];
                //    if ((TempGeneralData.length !== TempLogGeneralData.length) || ($scope.LogObj.PhysicalGeneralNotes !== reqObj.PhysicalGeneralNotes)) {
                //        let obj = {
                //            "LogId": 0,
                //            "ModuleId": 2,
                //            "ModuleName": "ASC",
                //            "SubModuleId": 9,
                //            "SubModuleName": "Pre-Op",
                //            "ScreenType": "Pre-Op Anesthesia",
                //            "ActionType": "Edited",
                //            "ActionDescription": `General Data In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                //        };
                //        $scope.LogObj.LogArray.push(obj);
                //    }

                //    var TempCardioData = $filter('filter')(reqObj.PhysicalEvaluationArray, { 'HistoryId': 19, 'DeleteInd': 'N' }, true) || [];
                //    var TempLogCardioData = $filter('filter')($scope.LogObj.PhysicalEvaluationArray, { 'HistoryId': 19, 'DeleteInd': 'N' }, true) || [];
                //    if ((TempCardioData.length !== TempLogCardioData.length) || ($scope.LogObj.PhysicalCardiocNotes !== reqObj.PhysicalCardiocNotes)) {
                //        let obj = {
                //            "LogId": 0,
                //            "ModuleId": 2,
                //            "ModuleName": "ASC",
                //            "SubModuleId": 9,
                //            "SubModuleName": "Pre-Op",
                //            "ScreenType": "Pre-Op Anesthesia",
                //            "ActionType": "Edited",
                //            "ActionDescription": `Cardiovascular Data In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                //        };
                //        $scope.LogObj.LogArray.push(obj);
                //    }
                //    var TempPulmonaryData = $filter('filter')(reqObj.PhysicalEvaluationArray, { 'HistoryId': 20, 'DeleteInd': 'N' }, true) || [];
                //    var TempLogPulmonaryData = $filter('filter')($scope.LogObj.PhysicalEvaluationArray, { 'HistoryId': 20, 'DeleteInd': 'N' }, true) || [];
                //    if ((TempPulmonaryData.length !== TempLogPulmonaryData.length) || ($scope.LogObj.PhysicalPulmonaryNotes !== reqObj.PhysicalPulmonaryNotes)) {
                //        let obj = {
                //            "LogId": 0,
                //            "ModuleId": 2,
                //            "ModuleName": "ASC",
                //            "SubModuleId": 9,
                //            "SubModuleName": "Pre-Op",
                //            "ScreenType": "Pre-Op Anesthesia",
                //            "ActionType": "Edited",
                //            "ActionDescription": `Pulmonary Data In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                //        };
                //        $scope.LogObj.LogArray.push(obj);
                //    }
                //    if ($scope.LogObj.PhysicalNeurologicNotes !== reqObj.PhysicalNeurologicNotes) {
                //        let obj = {
                //            "LogId": 0,
                //            "ModuleId": 2,
                //            "ModuleName": "ASC",
                //            "SubModuleId": 9,
                //            "SubModuleName": "Pre-Op",
                //            "ScreenType": "Pre-Op Anesthesia",
                //            "ActionType": "Edited",
                //            "ActionDescription": `Neurologic Data In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                //        };
                //        $scope.LogObj.LogArray.push(obj);
                //    }
                //    var TempHepaticData = $filter('filter')(reqObj.PhysicalEvaluationArray, { 'HistoryId': 21, 'DeleteInd': 'N' }, true) || [];
                //    var TempLogHepaticData = $filter('filter')($scope.LogObj.PhysicalEvaluationArray, { 'HistoryId': 21, 'DeleteInd': 'N' }, true) || [];
                //    if ((TempHepaticData.length !== TempLogHepaticData.length) || ($scope.LogObj.PhysicalHepaticNotes !== reqObj.PhysicalHepaticNotes)) {
                //        let obj = {
                //            "LogId": 0,
                //            "ModuleId": 2,
                //            "ModuleName": "ASC",
                //            "SubModuleId": 9,
                //            "SubModuleName": "Pre-Op",
                //            "ScreenType": "Pre-Op Anesthesia",
                //            "ActionType": "Edited",
                //            "ActionDescription": `GI/Hepatic Data In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                //        };
                //        $scope.LogObj.LogArray.push(obj);
                //    }
                //}


                var TempGeneralData = $filter('filter')(reqObj.PhysicalEvaluationArray, { 'HistoryId': 18 }, true) || [];
                var TempLogGeneralData = $filter('filter')($scope.LogObj.PhysicalEvaluationArray, { 'HistoryId': 18 }, true) || [];
                var TempCardioData = $filter('filter')(reqObj.PhysicalEvaluationArray, { 'HistoryId': 19 }, true) || [];
                var TempLogCardioData = $filter('filter')($scope.LogObj.PhysicalEvaluationArray, { 'HistoryId': 19 }, true) || [];
                var TempPulmonaryData = $filter('filter')(reqObj.PhysicalEvaluationArray, { 'HistoryId': 20 }, true) || [];
                var TempLogPulmonaryData = $filter('filter')($scope.LogObj.PhysicalEvaluationArray, { 'HistoryId': 20 }, true) || [];
                var TempHepaticData = $filter('filter')(reqObj.PhysicalEvaluationArray, { 'HistoryId': 21 }, true) || [];
                var TempLogHepaticData = $filter('filter')($scope.LogObj.PhysicalEvaluationArray, { 'HistoryId': 21 }, true) || [];

                if (TempGeneralData.length > 0 || $scope.LogObj.PhysicalGeneralNotes != '' || reqObj.PhysicalGeneralNotes != '' || TempLogGeneralData.length > 0) {
                    let allNewGeneralData = TempGeneralData || [];
                    let allOldGeneralData = TempLogGeneralData || [];

                    let newGeneralData = $filter('filter')(TempGeneralData || [], { 'DeleteInd': 'N' }, true);
                    let oldLogGeneralData = $filter('filter')(TempLogGeneralData || [], { 'DeleteInd': 'N' }, true);
                    let IsUserAlreadyAddedDentitionList = $filter("filter")(oldLogGeneralData, { "CreatedBy": $scope.UserId }, true) || [];

                    reqObj.PhysicalGeneralNotes = reqObj.PhysicalGeneralNotes || '';
                    $scope.LogObj.PhysicalGeneralNotes = $scope.LogObj.PhysicalGeneralNotes || '';

                    if (oldLogGeneralData.length > 0) {
                        let GeneralDataDifferences = [];

                        newGeneralData.forEach(function (itemNew) {

                            const matchedOld = oldLogGeneralData.find(itemOld => itemOld.Id === itemNew.Id);
                            if (!matchedOld) {
                                GeneralDataDifferences.push(itemNew);
                            }
                        });

                        allOldGeneralData.forEach(function (itemOld) {
                            const matchedNew = allNewGeneralData.find(itemNew => itemNew.Id === itemOld.Id);
                            if (matchedNew && matchedNew.DeleteInd === "Y") {
                                GeneralDataDifferences.push({ deleted: true, ...itemOld });
                            }
                        });
                        const notesChanged = reqObj.PhysicalGeneralNotes !== $scope.LogObj.PhysicalGeneralNotes;

                        if (GeneralDataDifferences.length > 0 || notesChanged) {
                            const result = generatePhysicalDescriptions(oldLogGeneralData, newGeneralData, $scope.LogObj.PhysicalGeneralNotes, reqObj.PhysicalGeneralNotes);

                            let ActionType = "Edited";
                            if (IsUserAlreadyAddedDentitionList.length === 0 && result.oldDescription === '') {
                                ActionType = "Added";
                            }
                            //if (GeneralDataDifferences.every(d => d.deleted)) {
                            //    ActionType = "Deleted";
                            //}

                            let obj = {
                                "LogId": 0,
                                "ModuleId": $scope.ModuleId || 0,
                                "ModuleName": $scope.ModuleName || "",
                                "SubModuleId": 15,
                                "SubModuleName": "H&P",
                                "ScreenType": 'Quick Access',
                                "ActionType": ActionType,
                                "OldActionDescription": result.oldDescription,
                                "NewActionDescription": result.newDescription,
                                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        }
                    } else if (newGeneralData.length > 0 || reqObj.PhysicalGeneralNotes !== '') {
                        const result = generatePhysicalDescriptions([], newGeneralData, '', reqObj.PhysicalGeneralNotes);

                        if (result.newDescription !== '') {
                            let obj = {
                                "LogId": 0,
                                "ModuleId": $scope.ModuleId || 0,
                                "ModuleName": $scope.ModuleName || "",
                                "SubModuleId": 15,
                                "SubModuleName": "H&P",
                                "ScreenType": 'Quick Access',
                                "ActionType": "Added",
                                "OldActionDescription": '',
                                "NewActionDescription": result.newDescription,
                                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        }
                    }

                }

                if (TempCardioData.length > 0 || $scope.LogObj.PhysicalCardiocNotes != '' || reqObj.PhysicalCardiocNotes != '' || TempLogCardioData.length > 0) {
                    let allNewCardioData = TempCardioData || [];
                    let allOldCardioData = TempLogCardioData || [];

                    let newCardioData = $filter('filter')(TempCardioData || [], { 'DeleteInd': 'N' }, true);
                    let oldLogCardioData = $filter('filter')(TempLogCardioData || [], { 'DeleteInd': 'N' }, true);
                    let IsUserAlreadyAddedDentitionList = $filter("filter")(oldLogCardioData, { "CreatedBy": $scope.UserId }, true) || [];

                    reqObj.PhysicalCardiocNotes = reqObj.PhysicalCardiocNotes || '';
                    $scope.LogObj.PhysicalCardiocNotes = $scope.LogObj.PhysicalCardiocNotes || '';

                    if (oldLogCardioData.length > 0) {
                        let CardioDataDifferences = [];

                        newCardioData.forEach(function (itemNew) {

                            const matchedOld = oldLogCardioData.find(itemOld => itemOld.Id === itemNew.Id);
                            if (!matchedOld) {
                                CardioDataDifferences.push(itemNew);
                            }
                        });
                        allOldCardioData.forEach(function (itemOld) {
                            const matchedNew = allNewCardioData.find(itemNew => itemNew.Id === itemOld.Id);
                            if (matchedNew && matchedNew.DeleteInd === "Y") {
                                CardioDataDifferences.push({ deleted: true, ...itemOld });
                            }
                        });
                        const notesChanged = reqObj.PhysicalCardiocNotes !== $scope.LogObj.PhysicalCardiocNotes;

                        if (CardioDataDifferences.length > 0 || notesChanged) {
                            const result = generatePhysicalDescriptions(oldLogCardioData, newCardioData, $scope.LogObj.PhysicalCardiocNotes, reqObj.PhysicalCardiocNotes);

                            let ActionType = "Edited";
                            if (IsUserAlreadyAddedDentitionList.length === 0 && result.oldDescription === '') {
                                ActionType = "Added";
                            }
                            //if (CardioDataDifferences.every(d => d.deleted)) {
                            //    ActionType = "Deleted";
                            //}

                            let obj = {
                                "LogId": 0,
                                "ModuleId": $scope.ModuleId || 0,
                                "ModuleName": $scope.ModuleName || "",
                                "SubModuleId": 15,
                                "SubModuleName": "H&P",
                                "ScreenType": 'Quick Access',
                                "ActionType": ActionType,
                                "OldActionDescription": result.oldDescription,
                                "NewActionDescription": result.newDescription,
                                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        }
                    } else if (newCardioData.length > 0 || reqObj.PhysicalCardiocNotes !== '') {
                        const result = generatePhysicalDescriptions([], newCardioData, '', reqObj.PhysicalCardiocNotes);

                        if (result.newDescription !== '') {
                            let obj = {
                                "LogId": 0,
                                "ModuleId": $scope.ModuleId || 0,
                                "ModuleName": $scope.ModuleName || "",
                                "SubModuleId": 15,
                                "SubModuleName": "H&P",
                                "ScreenType": 'Quick Access',
                                "ActionType": "Added",
                                "OldActionDescription": '',
                                "NewActionDescription": result.newDescription,
                                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        }
                    }

                }

                if (TempPulmonaryData.length > 0 || $scope.LogObj.PhysicalPulmonaryNotes != '' || reqObj.PhysicalPulmonaryNotes != '' || TempLogPulmonaryData.length > 0) {
                    let allNewPulmonaryData = TempPulmonaryData || [];
                    let allOldPulmonaryData = TempLogPulmonaryData || [];

                    let newPulmonaryData = $filter('filter')(TempPulmonaryData || [], { 'DeleteInd': 'N' }, true);
                    let oldLogPulmonaryData = $filter('filter')(TempLogPulmonaryData || [], { 'DeleteInd': 'N' }, true);
                    let IsUserAlreadyAddedDentitionList = $filter("filter")(oldLogPulmonaryData, { "CreatedBy": $scope.UserId }, true) || [];

                    reqObj.PhysicalPulmonaryNotes = reqObj.PhysicalPulmonaryNotes || '';
                    $scope.LogObj.PhysicalPulmonaryNotes = $scope.LogObj.PhysicalPulmonaryNotes || '';

                    if (oldLogPulmonaryData.length > 0) {
                        let PulmonaryDataDifferences = [];

                        newPulmonaryData.forEach(function (itemNew) {

                            const matchedOld = oldLogPulmonaryData.find(itemOld => itemOld.Id === itemNew.Id);
                            if (!matchedOld) {
                                PulmonaryDataDifferences.push(itemNew);
                            }
                        });
                        allOldPulmonaryData.forEach(function (itemOld) {
                            const matchedNew = allNewPulmonaryData.find(itemNew => itemNew.Id === itemOld.Id);
                            if (matchedNew && matchedNew.DeleteInd === "Y") {
                                PulmonaryDataDifferences.push({ deleted: true, ...itemOld });
                            }
                        });

                        const notesChanged = reqObj.PhysicalPulmonaryNotes !== $scope.LogObj.PhysicalPulmonaryNotes;

                        if (PulmonaryDataDifferences.length > 0 || notesChanged) {
                            const result = generatePhysicalDescriptions(oldLogPulmonaryData, newPulmonaryData, $scope.LogObj.PhysicalPulmonaryNotes, reqObj.PhysicalPulmonaryNotes);

                            let ActionType = "Edited";
                            if (IsUserAlreadyAddedDentitionList.length === 0 && result.oldDescription === '') {
                                ActionType = "Added";
                            }
                            //if (PulmonaryDataDifferences.every(d => d.deleted)) {
                            //    ActionType = "Deleted";
                            //}

                            let obj = {
                                "LogId": 0,
                                "ModuleId": $scope.ModuleId || 0,
                                "ModuleName": $scope.ModuleName || "",
                                "SubModuleId": 15,
                                "SubModuleName": "H&P",
                                "ScreenType": 'Quick Access',
                                "ActionType": ActionType,
                                "OldActionDescription": result.oldDescription,
                                "NewActionDescription": result.newDescription,
                                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        }
                    } else if (newPulmonaryData.length > 0 || reqObj.PhysicalPulmonaryNotes !== '') {
                        const result = generatePhysicalDescriptions([], newPulmonaryData, '', reqObj.PhysicalPulmonaryNotes);

                        if (result.newDescription !== '') {
                            let obj = {
                                "LogId": 0,
                                "ModuleId": $scope.ModuleId || 0,
                                "ModuleName": $scope.ModuleName || "",
                                "SubModuleId": 15,
                                "SubModuleName": "H&P",
                                "ScreenType": 'Quick Access',
                                "ActionType": "Added",
                                "OldActionDescription": '',
                                "NewActionDescription": result.newDescription,
                                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        }
                    }

                }

                if (TempHepaticData.length > 0 || $scope.LogObj.PhysicalHepaticNotes != '' || reqObj.PhysicalHepaticNotes != '' || TempLogHepaticData.length > 0) {
                    let allNewHepaticData = TempHepaticData || [];
                    let allOldHepaticData = TempLogHepaticData || [];

                    let newHepaticData = $filter('filter')(TempHepaticData || [], { 'DeleteInd': 'N' }, true);
                    let oldLogHepaticData = $filter('filter')(TempLogHepaticData || [], { 'DeleteInd': 'N' }, true);
                    let IsUserAlreadyAddedDentitionList = $filter("filter")(oldLogHepaticData, { "CreatedBy": $scope.UserId }, true) || [];

                    reqObj.PhysicalHepaticNotes = reqObj.PhysicalHepaticNotes || '';
                    $scope.LogObj.PhysicalHepaticNotes = $scope.LogObj.PhysicalHepaticNotes || '';

                    if (oldLogHepaticData.length > 0) {
                        let HepaticDataDifferences = [];

                        newHepaticData.forEach(function (itemNew) {

                            const matchedOld = oldLogHepaticData.find(itemOld => itemOld.Id === itemNew.Id);
                            if (!matchedOld) {
                                HepaticDataDifferences.push(itemNew);
                            }
                        });
                        allOldHepaticData.forEach(function (itemOld) {
                            const matchedNew = allNewHepaticData.find(itemNew => itemNew.Id === itemOld.Id);
                            if (matchedNew && matchedNew.DeleteInd === "Y") {
                                HepaticDataDifferences.push({ deleted: true, ...itemOld });
                            }
                        });

                        const notesChanged = reqObj.PhysicalHepaticNotes !== $scope.LogObj.PhysicalHepaticNotes;

                        if (HepaticDataDifferences.length > 0 || notesChanged) {
                            const result = generatePhysicalDescriptions(oldLogHepaticData, newHepaticData, $scope.LogObj.PhysicalHepaticNotes, reqObj.PhysicalHepaticNotes);

                            let ActionType = "Edited";
                            if (IsUserAlreadyAddedDentitionList.length === 0 && result.oldDescription === '') {
                                ActionType = "Added";
                            }
                            //if (HepaticDataDifferences.every(d => d.deleted)) {
                            //    ActionType = "Deleted";
                            //}
                            let obj = {
                                "LogId": 0,
                                "ModuleId": $scope.ModuleId || 0,
                                "ModuleName": $scope.ModuleName || "",
                                "SubModuleId": 15,
                                "SubModuleName": "H&P",
                                "ScreenType": 'Quick Access',
                                "ActionType": ActionType,
                                "OldActionDescription": result.oldDescription,
                                "NewActionDescription": result.newDescription,
                                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        }
                    } else if (newHepaticData.length > 0 || reqObj.PhysicalHepaticNotes !== '') {
                        const result = generatePhysicalDescriptions([], newHepaticData, '', reqObj.PhysicalHepaticNotes);

                        if (result.newDescription !== '') {
                            let obj = {
                                "LogId": 0,
                                "ModuleId": $scope.ModuleId || 0,
                                "ModuleName": $scope.ModuleName || "",
                                "SubModuleId": 15,
                                "SubModuleName": "H&P",
                                "ScreenType": 'Quick Access',
                                "ActionType": "Added",
                                "OldActionDescription": '',
                                "NewActionDescription": result.newDescription,
                                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        }
                    }

                }

                if (reqObj.PhysicalNeurologicNotes !== '' && $scope.LogObj.PhysicalNeurologicNotes == '') {
                    let newDescription = `Notes: ${reqObj.PhysicalNeurologicNotes}`
                    let obj = {
                        "LogId": 0,
                        "ModuleId": $scope.ModuleId || 0,
                        "ModuleName": $scope.ModuleName || "",
                        "SubModuleId": 15,
                        "SubModuleName": "H&P",
                        "ScreenType": 'Quick Access',
                        "ActionType": "Added",
                        "OldActionDescription": "",
                        "NewActionDescription": newDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }

                if ($scope.LogObj.PhysicalNeurologicNotes != '') {
                    if ($scope.LogObj.PhysicalNeurologicNotes !== reqObj.PhysicalNeurologicNotes) {
                        let newDescription = `Notes: ${reqObj.PhysicalNeurologicNotes}`;
                        let oldDescription = `Notes: ${$scope.LogObj.PhysicalNeurologicNotes}`;

                        let obj = {
                            "LogId": 0,
                            "ModuleId": $scope.ModuleId || 0,
                            "ModuleName": $scope.ModuleName || "",
                            "SubModuleId": 15,
                            "SubModuleName": "H&P",
                            "ScreenType": 'Quick Access',
                            "ActionType": "Edited",
                            "OldActionDescription": oldDescription,
                            "NewActionDescription": newDescription,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                }

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
            var temparray1 = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem, index) { return kitem.Value != '' || kitem.IsChecked == true || kitem.PatientDetailId!=0 });

            if (temparray1.length > 0) {
                reqObj.SystemicHistoryArray = temparray1;
            } else {
            }

            reqObj.Airway = angular.copy($scope.HealthPhysicalObj.AirwayObj);
            if ($scope.HealthPhysicalObj.AirwayObj.DentitionList.length > 0) {
                var TempOther = $filter('filter')($scope.HealthPhysicalObj.AirwayObj.DentitionList, { 'DentitionId': 22 }, true) || [];
                if (TempOther.length > 0) {
                    if (TempOther[0].IsChecked == false) {
                        $scope.HealthPhysicalObj.AirwayObj.Dentition = '';
                    }
                }
                reqObj.Airway.DentitionList =[];
                angular.forEach($scope.HealthPhysicalObj.AirwayObj.DentitionList, function (hitem) {
                    hitem.PatientDentitionId = hitem.PatientDentitionId || 0;
                    if (hitem.IsChecked || (hitem.PatientDentitionId != 0 && hitem.IsChecked == false)) {
                        hitem.DeleteInd = 'N';
                        if (hitem.PatientDentitionId != 0 && hitem.IsChecked == false) {
                            hitem.DeleteInd = 'Y';
                        }
                        reqObj.Airway.DentitionList.push(hitem);
                    }
                });

                //var temparray2 = $filter("filter")($scope.HealthPhysicalObj.AirwayObj.DentitionList, function (kitem, index) { return kitem.IsChecked == true });
                //reqObj.Airway.DentitionList = temparray2 || [];
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
                if (reqObj.TempDocumentDetails.length > 0) {
                    var HnPfile = reqObj.TempDocumentDetails.filter(function (eitem) {
                        return eitem.FileTypeId == 33;
                    }) || [];
                    if (HnPfile.length > 0) {
                        let obj = {
                            "LogId": 0,
                            "ModuleId": $scope.ModuleId || 0,
                            "ModuleName": $scope.ModuleName || "",
                            "SubModuleId": 15,
                            "SubModuleName": "H&P",
                            "ScreenType": 'Quick Access',
                            "ActionType": "Imported",
                            "OldActionDescription": "",
                            "NewActionDescription": HnPfile[0].DisplayName + " Uploaded files in H&P",
                            //"ActionDescription": `Uploaded files in H&P for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                }
            }
            let hnpforrespiratory = [];
            let edithnpforrespiratory = [];
            hnpforrespiratory = $filter("filter")(reqObj.SystemicHistoryArray, function (kitem, index) { return kitem.HistoryId == 116 || kitem.HistoryId == 118 || kitem.HistoryId == 119 || kitem.HistoryId == 120 || kitem.HistoryId == 121 || kitem.HistoryId == 122 });

            edithnpforrespiratory = $filter("filter")($scope.LogObj.SystemicHistory, function (kitem, index) { return kitem.HistoryId == 116 || kitem.HistoryId == 118 || kitem.HistoryId == 119 || kitem.HistoryId == 120 || kitem.HistoryId == 121 || kitem.HistoryId == 122 });

            let LabsInvestigationslist = $filter("filter")(reqObj.LabInvestigations, function (item) {
                return item.ProcedureId == 867
            }) || [];

            let editLabsInvestigationslist = $filter("filter")($scope.LogObj.LabList, function (item) {
                return item.ProcedureId == 867
            }) || [];

            const newRemarks = reqObj.RespiratoryRemarks || '';
            const oldRemarks = $scope.LogObj.RespiratoryRemarks || '';
            const remarksChanged = newRemarks !== oldRemarks;

            if (edithnpforrespiratory.length > 0 || oldRemarks != '' || editLabsInvestigationslist.length > 0) {
                $scope.differences = $scope.findHandPDifferences(hnpforrespiratory, edithnpforrespiratory, LabsInvestigationslist, editLabsInvestigationslist) || [];

                if ($scope.differences.length > 0 || remarksChanged) {
                    let Affecteditem = '';
                    let OldAffecteditem = '';
                    let ActionType = "Edited";

                    angular.forEach($scope.differences, function (itemA) {
                        if (itemA.HistoryId) { // Check if it's an H&P item
                            if (itemA.HistoryName && (itemA.Value !== undefined && itemA.Value !== null)) {
                                if (Affecteditem !== '') Affecteditem += ', ';
                                Affecteditem += `${itemA.HistoryName}: ${itemA.Value}`;

                                var oldItem = edithnpforrespiratory.find(itemB => itemA.HistoryId === itemB.HistoryId);

                                if (oldItem && (oldItem.Value !== undefined && oldItem.Value !== null)) {
                                    if (OldAffecteditem !== '') OldAffecteditem += ', ';
                                    OldAffecteditem += `${oldItem.HistoryName}: ${oldItem.Value}`;
                                }
                            }
                        }
                    });

                    angular.forEach($scope.differences, function (itemA) {
                        if (itemA.ProcedureId === 867) { // Check if it's the specific Lab item
                            if (itemA.ProcedureName && (itemA.ResultValue !== undefined && itemA.ResultValue !== null)) {
                                if (Affecteditem !== '') Affecteditem += ', ';
                                Affecteditem += `${itemA.ProcedureName}: ${itemA.ResultValue}`;

                                var oldItem = editLabsInvestigationslist.find(itemB => itemA.ProcedureId === itemB.ProcedureId);

                                if (oldItem && (oldItem.ResultValue !== undefined && oldItem.ResultValue !== null)) {
                                    if (OldAffecteditem !== '') OldAffecteditem += ', ';
                                    OldAffecteditem += `${oldItem.ProcedureName}: ${oldItem.ResultValue}`;
                                }
                            }
                        }
                    });

                
                    if (remarksChanged) {
                        if (newRemarks) Affecteditem += `${Affecteditem ? ', ' : ''}Respiratory Remarks: ${newRemarks}`;
                        if (oldRemarks) OldAffecteditem += `${OldAffecteditem ? ', ' : ''}Respiratory Remarks: ${oldRemarks}`;
                    }

                    // Log Object Creation
                    if (Affecteditem != '' || OldAffecteditem != '') { // Only log if something changed
                        let obj = {
                            "LogId": 0,
                            "ModuleId": $scope.ModuleId || 0,
                            "ModuleName": $scope.ModuleName || "",
                            "SubModuleId": 15,
                            "SubModuleName": "H&P",
                            "ScreenType": 'Quick Access',
                            "ActionType": ActionType,
                            "OldActionDescription": OldAffecteditem,
                            "NewActionDescription": Affecteditem,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }
                }
            }
            else if (hnpforrespiratory.length > 0 || newRemarks != '' || LabsInvestigationslist.length > 0) {
                let Affecteditem = '';

                angular.forEach(hnpforrespiratory, function (itemA) {
                    if (itemA.PatientDetailId === 0) {
                        // Added Guard Clause
                        if (itemA.HistoryName && (itemA.Value !== undefined && itemA.Value !== null)) {
                            if (Affecteditem !== '') Affecteditem += ', ';
                            Affecteditem += `${itemA.HistoryName}: ${itemA.Value}`;
                        }
                    }
                });

                angular.forEach(LabsInvestigationslist, function (itemA) {
                    if (itemA.ProcedureId === 867) {
                        if (itemA.ProcedureName && (itemA.ResultValue !== undefined && itemA.ResultValue !== null)) {
                            if (Affecteditem !== '') Affecteditem += ', ';
                            Affecteditem += `${itemA.ProcedureName}: ${itemA.ResultValue}`;
                        }
                    }
                });

                if (newRemarks) Affecteditem += `${Affecteditem ? ', ' : ''}Respiratory Remarks: ${newRemarks}`;

                if (Affecteditem != '') {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": $scope.ModuleId || 0,
                        "ModuleName": $scope.ModuleName || "",
                        "SubModuleId": 15,
                        "SubModuleName": "H&P",
                        "ScreenType": 'Quick Access',
                        "ActionType": "Added",
                        "OldActionDescription": '',
                        "NewActionDescription": Affecteditem,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            //if (hnpforrespiratory.length > 0) {
            //    let actiontype = '';
            //    if (edithnpforrespiratory.length == 0) {
            //        actiontype = "Added";
            //    } else {
            //        actiontype = "Edited";
            //    }

            //    if (edithnpforrespiratory.length > 0) {
            //        let count = 0
            //        angular.forEach(hnpforrespiratory, function (item) {

            //            var edited = edithnpforrespiratory.filter(function (eitem) {
            //                return ((eitem.HistoryId == item.HistoryId) && (item.DeleteInd == eitem.DeleteInd) && (eitem.Value == item.Value) && (eitem.TypeId == item.TypeId) && (eitem.Remarks == item.Remarks));
            //            }) || [];


            //            if (edited.length == 0) {
            //                count++;
            //            }

            //        });
            //        if (count != 0) {
            //            let obj = {
            //                "LogId": 0,
            //                "ModuleId": $scope.ModuleId || 0,
            //                "ModuleName": $scope.ModuleName || "",
            //                "SubModuleId": 15,
            //                "SubModuleName": "H&P",
            //                "ScreenType": $scope.ModuleName || '',
            //                "ActionType": actiontype,
            //                "ActionDescription": `Respiratory in Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
            //                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //            };
            //            $scope.LogObj.LogArray.push(obj);
            //        }
            //    } else {
            //        let obj = {
            //            "LogId": 0,
            //            "ModuleId": $scope.ModuleId || 0,
            //            "ModuleName": $scope.ModuleName || "",
            //            "SubModuleId": 15,
            //            "SubModuleName": "H&P",
            //            "ScreenType": $scope.ModuleName||'',
            //            "ActionType": actiontype,
            //            "ActionDescription": `Respiratory in Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
            //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //        };
            //        $scope.LogObj.LogArray.push(obj);
            //    }




            //}
            //Respiratory

            //Labs
            let Labslist = $filter("filter")(reqObj.LabInvestigations, function (item) {
                return item.ProcedureId == 506 || item.ProcedureId == 840 || item.ProcedureId == 841 || item.ProcedureId == 842 || item.ProcedureId == 843 || item.ProcedureId == 844 ||
                    item.ProcedureId == 845 || item.ProcedureId == 846 || item.ProcedureId == 847 || item.ProcedureId == 848 || item.ProcedureId == 849 || item.ProcedureId == 850
                    || item.ProcedureId == 851 || item.ProcedureId == 863 || item.ProcedureId == 864 || item.ProcedureId == 865 || item.ProcedureId == 2254;
            }) || [];
            let editLabslist = $filter("filter")($scope.LogObj.LabList, function (item) {
                return item.ProcedureId == 506 || item.ProcedureId == 840 || item.ProcedureId == 841 || item.ProcedureId == 842 || item.ProcedureId == 843 || item.ProcedureId == 844 ||
                    item.ProcedureId == 845 || item.ProcedureId == 846 || item.ProcedureId == 847 || item.ProcedureId == 848 || item.ProcedureId == 849 || item.ProcedureId == 850
                    || item.ProcedureId == 851 || item.ProcedureId == 863 || item.ProcedureId == 864 || item.ProcedureId == 865 || item.ProcedureId == 2254;
            }) || [];
            let IsUserAlreadyAddedLabsList = $filter("filter")(editLabslist, { "CreatedBy": $scope.UserId }, true) || [];
            $scope.HealthPhysicalObj.CardioVascularObj.ECG = $scope.HealthPhysicalObj.CardioVascularObj.ECG || '';
            $scope.HealthPhysicalObj.CardioVascularObj.Notes = $scope.HealthPhysicalObj.CardioVascularObj.Notes || '';
            $scope.HealthPhysicalObj.CardioVascularObj.ECGUnits = $scope.HealthPhysicalObj.CardioVascularObj.ECGUnits || '';
            $scope.LogObj.ECGUnits = $scope.LogObj.ECGUnits || '';
            $scope.LogObj.ECG = $scope.LogObj.ECG || '';
            $scope.LogObj.CardioVascularNotes = $scope.LogObj.CardioVascularNotes || '';



            if (editLabslist.length > 0) {
                let labsDifferences = [];

                Labslist.forEach(function (itemNew) {
                    const matchedOld = editLabslist.find(itemOld =>
                        itemOld.ProcedureId === itemNew.ProcedureId &&
                        itemOld.ResultValue === itemNew.ResultValue
                    );
                    if (!matchedOld) {
                        labsDifferences.push(itemNew);
                    }
                });

                const notesChanged =
                    $scope.HealthPhysicalObj.CardioVascularObj.ECG !== $scope.LogObj.ECG ||
                    $scope.HealthPhysicalObj.CardioVascularObj.Notes !== $scope.LogObj.CardioVascularNotes ||
                    $scope.HealthPhysicalObj.CardioVascularObj.ECGUnits !== $scope.LogObj.ECGUnits;

                if (labsDifferences.length > 0 || notesChanged) {
                    const delta = generateDeltaDescriptions(
                        editLabslist,
                        Labslist,
                        {
                            ECG: $scope.LogObj.ECG,
                            ECGNotes: $scope.LogObj.CardioVascularNotes,
                            ECGUnits: $scope.LogObj.ECGUnits
                        },
                        {
                            ECG: $scope.HealthPhysicalObj.CardioVascularObj.ECG,
                            ECGNotes: $scope.HealthPhysicalObj.CardioVascularObj.Notes,
                            ECGUnits: $scope.HealthPhysicalObj.CardioVascularObj.ECGUnits
                        }
                    );

                    let ActionType = "Edited";
                    if (IsUserAlreadyAddedLabsList.length === 0 && delta.oldDescription === '') {
                        ActionType = "Added";
                    }

                    let obj = {
                        "LogId": 0,
                        "ModuleId": $scope.ModuleId || 0,
                        "ModuleName": $scope.ModuleName || "",
                        "SubModuleId": 15,
                        "SubModuleName": "H&P",
                        "ScreenType": 'Quick Access',
                        "ActionType": ActionType,
                        "OldActionDescription": delta.oldDescription,
                        "NewActionDescription": delta.newDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }

            } else if (
                Labslist.length > 0 ||
                $scope.HealthPhysicalObj.CardioVascularObj.ECG !== '' ||
                $scope.HealthPhysicalObj.CardioVascularObj.Notes !== '' ||
                $scope.HealthPhysicalObj.CardioVascularObj.ECGUnits !== ''
            ) {
                const delta = generateDeltaDescriptions(
                    [],
                    Labslist,
                    { ECG: '', ECGNotes: '', ECGUnits: '' },
                    {
                        ECG: $scope.HealthPhysicalObj.CardioVascularObj.ECG,
                        ECGNotes: $scope.HealthPhysicalObj.CardioVascularObj.Notes,
                        ECGUnits: $scope.HealthPhysicalObj.CardioVascularObj.ECGUnits
                    }
                );

                if (delta.newDescription !== '') {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": $scope.ModuleId || 0,
                        "ModuleName": $scope.ModuleName || "",
                        "SubModuleId": 15,
                        "SubModuleName": "H&P",
                        "ScreenType": 'Quick Access',
                        "ActionType": "Added",
                        "OldActionDescription": '',
                        "NewActionDescription": delta.newDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }



            //if (Labslist.length > 0 || $scope.HealthPhysicalObj.CardioVascularObj.ECG != '' || $scope.HealthPhysicalObj.CardioVascularObj.Notes != '') {
            //    let actiontype = '';
            //    let lablistcount = 0;
            //    if ($scope.LogObj.ECG == '' && editLabslist.length == 0 && $scope.LogObj.CardioVascularNotes == '') {
            //        actiontype = "Added";
            //    } else {
            //        actiontype = "Edited";
            //    }
            //    //edit lab
            //    if (editLabslist.length > 0 || $scope.LogObj.ECG != '' || $scope.LogObj.CardioVascularNotes != '') {
            //        if ($scope.HealthPhysicalObj.CardioVascularObj.ECG != $scope.LogObj.ECG) {
            //            lablistcount++;
            //        }
            //        if ($scope.HealthPhysicalObj.CardioVascularObj.Notes != $scope.LogObj.CardioVascularNotes) {
            //            lablistcount++;
            //        }
            //        let differences = [];
            //        Labslist.forEach(function (editedItem) {

            //            var savedItem = editLabslist.filter(function (item) {
            //                return (item.ProcedureId === editedItem.ProcedureId) && (item.ResultValue == editedItem.ResultValue) && (item.Remarks == editedItem.Remarks) && (item.AbNormal == editedItem.AbNormal) && (item.Normal == editedItem.Normal);
            //            }) || [];

            //            if (savedItem.length == 0) {

            //                differences.push({
            //                    ProcedureId: editedItem.ProcedureId,
            //                    savedResultValue: editedItem.ResultValue,
            //                });

            //            }
            //        });
            //        if (differences.length > 0) {
            //            lablistcount++;
            //        }
            //        if (lablistcount != 0) {
            //            let obj = {
            //                "LogId": 0,
            //                "ModuleId": $scope.ModuleId || 0,
            //                "ModuleName": $scope.ModuleName || "",
            //                "SubModuleId": 15,
            //                "SubModuleName": "H&P",
            //                "ScreenType": $scope.ModuleName || '',
            //                "ActionType": actiontype,
            //                "ActionDescription": `Labs in Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
            //                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //            };
            //            $scope.LogObj.LogArray.push(obj);
            //        }
            //        //edit lab
            //    }
            //    else {
            //        let obj = {
            //            "LogId": 0,
            //            "ModuleId": $scope.ModuleId || 0,
            //            "ModuleName": $scope.ModuleName || "",
            //            "SubModuleId": 15,
            //            "SubModuleName": "H&P",
            //            "ScreenType": $scope.ModuleName || '',
            //            "ActionType": actiontype,
            //            "ActionDescription": `Labs in Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
            //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //        };
            //        $scope.LogObj.LogArray.push(obj);
            //    }


            //}
            //else if ($scope.HealthPhysicalObj.CardioVascularObj.Notes == '' && $scope.LogObj.CardioVascularNotes != '') {
            //    if ($scope.HealthPhysicalObj.CardioVascularObj.Notes != $scope.LogObj.CardioVascularNotes) {
            //        let obj = {
            //            "LogId": 0,
            //            "ModuleId": $scope.ModuleId || 0,
            //            "ModuleName": $scope.ModuleName || "",
            //            "SubModuleId": 15,
            //            "SubModuleName": "H&P",
            //            "ScreenType": $scope.ModuleName || '',
            //            "ActionType": "Edited",
            //            "ActionDescription": `Labs in Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
            //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //        };
            //        $scope.LogObj.LogArray.push(obj);
            //    }
            //}
            //Labs


            //Chemistry
            let Chemistrylist = $filter("filter")(reqObj.LabInvestigations, function (item) {
                return item.ProcedureId == 852 || item.ProcedureId == 853 || item.ProcedureId == 854 || item.ProcedureId == 855 || item.ProcedureId == 856 || item.ProcedureId == 857 ||
                    item.ProcedureId == 858 || item.ProcedureId == 859 || item.ProcedureId == 860 || item.ProcedureId == 861 || item.ProcedureId == 862 || item.ProcedureId == 866;
            }) || [];
            let editChemistrylist = $filter("filter")($scope.LogObj.LabList, function (item) {
                return item.ProcedureId == 852 || item.ProcedureId == 853 || item.ProcedureId == 854 || item.ProcedureId == 855 || item.ProcedureId == 856 || item.ProcedureId == 857 ||
                    item.ProcedureId == 858 || item.ProcedureId == 859 || item.ProcedureId == 860 || item.ProcedureId == 861 || item.ProcedureId == 862 || item.ProcedureId == 866;
            }) || [];

            $scope.HealthPhysicalObj.AirwayObj.ChemistryNotes = $scope.HealthPhysicalObj.AirwayObj.ChemistryNotes || '';
            $scope.LogObj.AirwayChemistryNotes = $scope.LogObj.AirwayChemistryNotes || '';
            let IsUserAlreadyAddedChemistryList = $filter("filter")(editChemistrylist, { "CreatedBy": $scope.UserId }, true) || [];

            if (editChemistrylist.length > 0) {
                let chemistryDifferences = [];

                Chemistrylist.forEach(function (itemNew) {
                    const matchedOld = editChemistrylist.find(itemOld => itemOld.ProcedureId === itemNew.ProcedureId && itemOld.ResultValue === itemNew.ResultValue);
                    if (!matchedOld) {
                        chemistryDifferences.push(itemNew);
                    }
                });

                const notesChanged = $scope.HealthPhysicalObj.AirwayObj.ChemistryNotes !== $scope.LogObj.AirwayChemistryNotes;

                if (chemistryDifferences.length > 0 || notesChanged) {
                    let oldDescription = '';
                    let newDescription = '';

                    const result = generateChemistryDescriptions(editChemistrylist, Chemistrylist, $scope.LogObj.AirwayChemistryNotes, $scope.HealthPhysicalObj.AirwayObj.ChemistryNotes);
                    oldDescription = result.oldDescription;
                    newDescription = result.newDescription;

                    let ActionType = "Edited";
                    if (IsUserAlreadyAddedChemistryList.length === 0 && oldDescription === '') {
                        ActionType = "Added";
                    }

                    let obj = {
                        "LogId": 0,
                        "ModuleId": $scope.ModuleId || 0,
                        "ModuleName": $scope.ModuleName || "",
                        "SubModuleId": 15,
                        "SubModuleName": "H&P",
                        "ScreenType": 'Quick Access',
                        "ActionType": ActionType,
                        "OldActionDescription": oldDescription,
                        "NewActionDescription": newDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }

            } else if (Chemistrylist.length > 0 || $scope.HealthPhysicalObj.AirwayObj.ChemistryNotes !== '') {
                let newDescription = '';

                const result = generateChemistryDescriptions(editChemistrylist, Chemistrylist, '', $scope.HealthPhysicalObj.AirwayObj.ChemistryNotes);
                newDescription = result.newDescription;

                if (newDescription !== '') {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": $scope.ModuleId || 0,
                        "ModuleName": $scope.ModuleName || "",
                        "SubModuleId": 15,
                        "SubModuleName": "H&P",
                        "ScreenType": 'Quick Access',
                        "ActionType": "Added",
                        "OldActionDescription": '',
                        "NewActionDescription": newDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }


            //if (Chemistrylist.length > 0 || $scope.HealthPhysicalObj.AirwayObj.ChemistryNotes != '' || editChemistrylist.length > 0 || $scope.LogObj.AirwayChemistryNotes !='') {
            //    let actiontype = '';
            //    if ($scope.LogObj.AirwayChemistryNotes == '' && editChemistrylist.length == 0) {
            //        actiontype = "Added";
            //    } else {
            //        actiontype = "Edited";
            //    }
            //    let lablistcount = 0;

            //    if (editChemistrylist.length > 0 || $scope.LogObj.AirwayChemistryNotes != '') {
            //        if ($scope.HealthPhysicalObj.AirwayObj.ChemistryNotes != $scope.LogObj.AirwayChemistryNotes) {
            //            lablistcount++;
            //        }
      
            //            let differences = [];
            //            Chemistrylist.forEach(function (editedItem) {

            //                var savedItem = editChemistrylist.filter(function (item) {
            //                    return (item.ProcedureId === editedItem.ProcedureId) && (item.ResultValue == editedItem.ResultValue);
            //                }) || [];

            //                if (savedItem.length == 0) {

            //                    differences.push({
            //                        ProcedureId: editedItem.ProcedureId,
            //                        editedResultValue: editedItem.ResultValue
            //                    });

            //                }
            //            });
            //            if (differences.length > 0) {
            //                lablistcount++;
            //            }
            //            if (lablistcount != 0) {
            //                let obj = {
            //                    "LogId": 0,
            //                    "ModuleId": $scope.ModuleId || 0,
            //                    "ModuleName": $scope.ModuleName || "",
            //                    "SubModuleId": 15,
            //                    "SubModuleName": "H&P",
            //                    "ScreenType": $scope.ModuleName || '',
            //                    "ActionType": actiontype,
            //                    "ActionDescription": `Chemistry in Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
            //                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //                };
            //                $scope.LogObj.LogArray.push(obj);
            //            }
                

            //    }
            //    else {
            //        let obj = {
            //            "LogId": 0,
            //            "ModuleId": $scope.ModuleId || 0,
            //            "ModuleName": $scope.ModuleName || "",
            //            "SubModuleId": 15,
            //            "SubModuleName": "H&P",
            //            "ScreenType": $scope.ModuleName || '',
            //            "ActionType": actiontype,
            //            "ActionDescription": `Chemistry in Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
            //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //        };
            //        $scope.LogObj.LogArray.push(obj);
            //    }
            //}

            //Chemistry

            //airway
            reqObj.Airway.DentitionList = reqObj.Airway.DentitionList || [];
            if ($scope.ParentObj.IsIOJParentOrganization) {
                if ($scope.HealthPhysicalObj.AirwayObj.IsNormal || $scope.HealthPhysicalObj.AirwayObj.ROMTMS != '' || $scope.HealthPhysicalObj.AirwayObj.ROMNECKAP != '' || $scope.HealthPhysicalObj.AirwayObj.ROMNECKLAT != '' || $scope.HealthPhysicalObj.AirwayObj.Class != '' || reqObj.Airway.DentitionList.length > 0 || $scope.HealthPhysicalObj.AirwayObj.Notes != '' || $scope.LogObj.DentitionList.length > 0 || $scope.LogObj.AirwayObjIsNormal || $scope.LogObj.AirwayROMTMS != '' || $scope.LogObj.AirwayROMNECKAP != '' || $scope.LogObj.AirwayROMNECKLAT != '' || $scope.LogObj.AirwayClass != '' || $scope.LogObj.AirwayNotes != '') {

                    var NewValue = '';
                    var OldValue = '';
                    let allNewDentitionData = reqObj.Airway.DentitionList || [];
                    let allOldDentitionData = $scope.LogObj.DentitionList || [];
                    let newDentitionList = $filter('filter')(reqObj.Airway.DentitionList || [], { 'DeleteInd': 'N' }, true);
                    let oldDentitionList = $filter('filter')($scope.LogObj.DentitionList || [], { 'DeleteInd': 'N' }, true);
                    let IsUserAlreadyAddedDentitionList = $filter("filter")(oldDentitionList, { "CreatedBy": $scope.UserId }, true) || [];


                    if ($scope.HealthPhysicalObj.AirwayObj.IsNormal != $scope.LogObj.AirwayObjIsNormal) {
                        if ($scope.HealthPhysicalObj.AirwayObj.IsNormal == true)
                            NewValue += `${NewValue ? '\n ' : ''}Airway: Normal`;
                        if ($scope.LogObj.AirwayObjIsNormal == true)
                            OldValue += `${OldValue ? '\n ' : ''}Airway: Normal`;
                    }
                    if ($scope.HealthPhysicalObj.AirwayObj.ROMTMS != $scope.LogObj.AirwayROMTMS) {
                        if ($scope.HealthPhysicalObj.AirwayObj.ROMTMS)
                            NewValue += `${NewValue ? '\n ' : ''}ROMTMS: ${$scope.HealthPhysicalObj.AirwayObj.ROMTMS}`;
                        if ($scope.LogObj.AirwayROMTMS)
                            OldValue += `${OldValue ? '\n' : ''}ROMTMS: ${$scope.LogObj.AirwayROMTMS}`;

                    }
                    if ($scope.HealthPhysicalObj.AirwayObj.ROMNECKAP != $scope.LogObj.AirwayROMNECKAP) {
                        if ($scope.HealthPhysicalObj.AirwayObj.ROMNECKAP)
                            NewValue += `${NewValue ? '\n ' : ''}AP ${$scope.HealthPhysicalObj.AirwayObj.ROMNECKAP}`;
                        if ($scope.LogObj.AirwayROMNECKAP)
                            OldValue += `${OldValue ? '\n ' : ''}AP ${$scope.LogObj.AirwayROMNECKAP}`;
                    }
                    if ($scope.HealthPhysicalObj.AirwayObj.ROMNECKLAT != $scope.LogObj.AirwayROMNECKLAT) {
                        if ($scope.HealthPhysicalObj.AirwayObj.ROMNECKLAT)
                            NewValue += `${NewValue ? '\n ' : ''}LAT ${$scope.HealthPhysicalObj.AirwayObj.ROMNECKLAT}`;
                        if ($scope.LogObj.AirwayROMNECKLAT)
                            OldValue += `${OldValue ? '\n ' : ''}LAT ${$scope.LogObj.AirwayROMNECKLAT}`;
                    }
                    if ($scope.HealthPhysicalObj.AirwayObj.Class != $scope.LogObj.AirwayClass) {
                        if ($scope.HealthPhysicalObj.AirwayObj.Class)
                            NewValue += `${NewValue ? '\n ' : ''}Mallampati Score: ${$scope.HealthPhysicalObj.AirwayObj.Class}`;
                        if ($scope.LogObj.AirwayClass)
                            OldValue += `${OldValue ? '\n ' : ''}Mallampati Score: ${$scope.LogObj.AirwayClass}`;
                    }


                    let actiontype = '';
                    if (!$scope.LogObj.AirwayObjIsNormal && $scope.LogObj.AirwayROMNECKAP == '' && $scope.LogObj.AirwayROMTMS == '' && $scope.LogObj.AirwayROMNECKLAT == '' && $scope.LogObj.AirwayClass == '' && $scope.LogObj.AirwayNotes == '' && $scope.LogObj.DentitionList.length == 0 && $scope.LogObj.AirwayNotes == '') {
                        if (newDentitionList.length > 0 || $scope.HealthPhysicalObj.AirwayObj.Notes !== '') {
                            const result = generateDentitionDescriptions([], newDentitionList, '', $scope.HealthPhysicalObj.AirwayObj.Notes);
                            if (result.newDescription != '') {
                                NewValue += `${NewValue ? '\n ' : ''}DentitionList: ${result.newDescription}`;
                            }
                        }
                        actiontype = "Added";
                    } else {
                        if (oldDentitionList.length > 0) {
                            let dentitionDifferences = [];

                            newDentitionList.forEach(function (itemNew) {
                                const matchedOld = oldDentitionList.find(itemOld => itemOld.DentitionId === itemNew.DentitionId);
                                if (!matchedOld) {
                                    dentitionDifferences.push(itemNew);
                                }
                            });

                            allOldDentitionData.forEach(function (itemOld) {
                                const matchedNew = allNewDentitionData.find(itemNew => itemNew.PatientDentitionId === itemOld.PatientDentitionId);
                                if (matchedNew && matchedNew.DeleteInd === "Y") {
                                    dentitionDifferences.push({ deleted: true, ...itemOld });
                                }
                            });
                            const notesChanged = $scope.HealthPhysicalObj.AirwayObj.Notes !== $scope.LogObj.AirwayNotes;

                            if (dentitionDifferences.length > 0 || notesChanged) {
                                const result = generateDentitionDescriptions(oldDentitionList, newDentitionList, $scope.LogObj.AirwayNotes, $scope.HealthPhysicalObj.AirwayObj.Notes);
                                if (result.oldDescription != '') {
                                    OldValue += `${OldValue ? '\n ' : ''}DentitionList: ${result.oldDescription}`;

                                }
                                if (result.newDescription != '') {
                                    NewValue += `${NewValue ? '\n ' : ''}DentitionList: ${result.newDescription}`;

                                }
                            }
                        }
                        actiontype = "Edited";
                    }

                    let lablistcount = 0;
                    if ($scope.HealthPhysicalObj.AirwayObj.IsNormal != $scope.LogObj.AirwayObjIsNormal) {
                        lablistcount++;
                    }
                    if ($scope.HealthPhysicalObj.AirwayObj.ROMTMS != $scope.LogObj.AirwayROMTMS) {
                        lablistcount++;
                    }
                    if ($scope.HealthPhysicalObj.AirwayObj.ROMNECKAP != $scope.LogObj.AirwayROMNECKAP) {
                        lablistcount++;
                    }
                    if ($scope.HealthPhysicalObj.AirwayObj.ROMNECKLAT != $scope.LogObj.AirwayROMNECKLAT) {
                        lablistcount++;
                    }
                    if ($scope.HealthPhysicalObj.AirwayObj.Class != $scope.LogObj.AirwayClass) {
                        lablistcount++;
                    }
                    angular.forEach(reqObj.Airway.DentitionList, function (item) {
                        var edited = $scope.LogObj.DentitionList.filter(function (eitem) {
                            return ((eitem.DentitionId == item.DentitionId) && (eitem.DeleteInd == item.DeleteInd));
                        }) || [];

                        if (edited.length == 0) {
                            lablistcount++;
                        }

                    });

                    if (lablistcount != 0) {
                        let obj = {
                            "LogId": 0,
                            "ModuleId": $scope.ModuleId || 0,
                            "ModuleName": $scope.ModuleName || "",
                            "SubModuleId": 15,
                            "SubModuleName": "H&P",
                            "ScreenType": 'Quick Access',
                            "ActionType": actiontype,
                            "OldActionDescription": OldValue,
                            "NewActionDescription": NewValue,
                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                        $scope.LogObj.LogArray.push(obj);
                    }


                    //let actiontype = '';
                    //if (!$scope.LogObj.AirwayObjIsNormal && $scope.LogObj.DentitionList.length == 0 && $scope.LogObj.AirwayROMNECKAP == '' && $scope.LogObj.AirwayROMTMS == '' && $scope.LogObj.AirwayROMNECKLAT == '' && $scope.LogObj.AirwayClass == '' && $scope.LogObj.AirwayNotes == '') {
                    //    actiontype = "Added";
                    //} else {
                    //    actiontype = "Edited";
                    //}

                    //let lablistcount = 0;
                    //if ($scope.HealthPhysicalObj.AirwayObj.IsNormal != $scope.LogObj.AirwayObjIsNormal) {
                    //    lablistcount++;
                    //}
                    //if ($scope.HealthPhysicalObj.AirwayObj.ROMTMS != $scope.LogObj.AirwayROMTMS) {
                    //    lablistcount++;
                    //}
                    //if ($scope.HealthPhysicalObj.AirwayObj.ROMNECKAP != $scope.LogObj.AirwayROMNECKAP) {
                    //    lablistcount++;
                    //}
                    //if ($scope.HealthPhysicalObj.AirwayObj.ROMNECKLAT != $scope.LogObj.AirwayROMNECKLAT) {
                    //    lablistcount++;
                    //}
                    //if ($scope.HealthPhysicalObj.AirwayObj.Class != $scope.LogObj.AirwayClass) {
                    //    lablistcount++;
                    //}
                    //if ($scope.HealthPhysicalObj.AirwayObj.Notes != $scope.LogObj.AirwayNotes) {
                    //    lablistcount++;
                    //}

                    //angular.forEach(reqObj.Airway.DentitionList, function (item) {
                    //    var edited = $scope.LogObj.DentitionList.filter(function (eitem) {
                    //        return ((eitem.DentitionId == item.DentitionId) && (eitem.DeleteInd == item.DeleteInd));
                    //    }) || [];

                    //    if (edited.length == 0) {

                    //        lablistcount++;
                    //    }
                    //});

                    //if (lablistcount != 0) {
                    //    let obj = {
                    //        "LogId": 0,
                    //        "ModuleId": $scope.ModuleId || 0,
                    //        "ModuleName": $scope.ModuleName || "",
                    //        "SubModuleId": 15,
                    //        "SubModuleName": "H&P",
                    //        "ScreenType": $scope.ModuleName || '',
                    //        "ActionType": actiontype,
                    //        "ActionDescription": `Airway/Dentition in Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                    //        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    //    };
                    //    $scope.LogObj.LogArray.push(obj);
                    //}
                }
            } else {
                if ($scope.HealthPhysicalObj.AirwayObj.ROMTMS != '' || $scope.HealthPhysicalObj.AirwayObj.Class != '' || $scope.HealthPhysicalObj.AirwayObj.MouthOpening != '' || $scope.HealthPhysicalObj.AirwayObj.TMDistance != '' || $scope.HealthPhysicalObj.AirwayObj.UnableToAssess || $scope.HealthPhysicalObj.AirwayObj.Tracheostomy || reqObj.Airway.DentitionList.length > 0 || $scope.HealthPhysicalObj.AirwayObj.Notes != '' || $scope.LogObj.DentitionList.length > 0 || $scope.LogObj.AirwayROMTMS != '' || $scope.LogObj.AirwayClass != '' || $scope.LogObj.AirwayNotes != '' || $scope.LogObj.MouthOpening != '' || $scope.LogObj.TMDistance != '' || $scope.LogObj.UnableToAssess || $scope.LogObj.Tracheostomy) {
                    if (reqObj.Airway.DentitionList.length > 0 || $scope.LogObj.AirwayNotes != '' || $scope.HealthPhysicalObj.AirwayObj.Notes != '' || $scope.LogObj.DentitionList.length > 0) {

                        let allNewDentitionData = reqObj.Airway.DentitionList || [];
                        let allOldDentitionData = $scope.LogObj.DentitionList || [];
                        let newDentitionList = $filter('filter')(reqObj.Airway.DentitionList || [], { 'DeleteInd': 'N' }, true);
                        let oldDentitionList = $filter('filter')($scope.LogObj.DentitionList || [], { 'DeleteInd': 'N' }, true);
                        var deletedDentitionList = [];
                        let IsUserAlreadyAddedDentitionList = $filter("filter")(oldDentitionList, { "CreatedBy": $scope.UserId }, true) || [];

                        $scope.HealthPhysicalObj.AirwayObj.Notes = $scope.HealthPhysicalObj.AirwayObj.Notes || '';
                        $scope.LogObj.AirwayNotes = $scope.LogObj.AirwayNotes || '';

                        if (oldDentitionList.length > 0) {
                            let dentitionDifferences = [];

                            newDentitionList.forEach(function (itemNew) {
                                if (itemNew.DeleteInd === 'Y') {
                                    deletedDentitionList.push(itemNew.DentitionNane);
                                }

                                const matchedOld = oldDentitionList.find(itemOld => itemOld.DentitionId === itemNew.DentitionId);
                                if (!matchedOld) {
                                    dentitionDifferences.push(itemNew);
                                }
                            });

                            allOldDentitionData.forEach(function (itemOld) {
                                const matchedNew = allNewDentitionData.find(itemNew => itemNew.PatientDentitionId === itemOld.PatientDentitionId);
                                if (matchedNew && matchedNew.DeleteInd === "Y") {
                                    dentitionDifferences.push({ deleted: true, ...itemOld });
                                }
                            });
                            const notesChanged = $scope.HealthPhysicalObj.AirwayObj.Notes !== $scope.LogObj.AirwayNotes;

                            if (dentitionDifferences.length > 0 || notesChanged) {
                                const result = generateDentitionDescriptions(oldDentitionList, newDentitionList, $scope.LogObj.AirwayNotes, $scope.HealthPhysicalObj.AirwayObj.Notes);

                                let ActionType = "Edited";
                                if (IsUserAlreadyAddedDentitionList.length === 0 && result.oldDescription === '') {
                                    ActionType = "Added";
                                }
                                //if (dentitionDifferences.every(d => d.deleted)) {
                                //    ActionType = "Deleted";
                                //}

                                let obj = {
                                    "LogId": 0,
                                    "ModuleId": 2,
                                    "ModuleName": "ASC",
                                    "SubModuleId": 15,
                                    "SubModuleName": "H&P",
                                    "ScreenType": 'Quick Access',
                                    "ActionType": ActionType,
                                    "OldActionDescription": result.oldDescription,
                                    "NewActionDescription": result.newDescription,
                                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                };
                                $scope.LogObj.LogArray.push(obj);
                            }
                        } else if (newDentitionList.length > 0 || $scope.HealthPhysicalObj.AirwayObj.Notes !== '') {
                            const result = generateDentitionDescriptions([], newDentitionList, '', $scope.HealthPhysicalObj.AirwayObj.Notes);

                            if (result.newDescription !== '') {
                                let obj = {
                                    "LogId": 0,
                                    "ModuleId": 2,
                                    "ModuleName": "ASC",
                                    "SubModuleId": 15,
                                    "SubModuleName": "H&P",
                                    "ScreenType": 'Quick Access',
                                    "ActionType": "Added",
                                    "OldActionDescription": '',
                                    "NewActionDescription": result.newDescription,
                                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                };
                                $scope.LogObj.LogArray.push(obj);
                            }
                        }


                        //if ($scope.LogObj.DentitionList.length == 0 && $scope.LogObj.AirwayNotes == '') {
                        //    let obj = {
                        //        "LogId": 0,
                        //        "ModuleId": 2,
                        //        "ModuleName": "ASC",
                        //        "SubModuleId": 15,
                        //        "SubModuleName": "H&P",
                        //        "ScreenType": $scope.ModuleName || '',
                        //        "ActionType": 'Added',
                        //        "ActionDescription": `Dentition in Quick Summary for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                        //        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        //    };
                        //    $scope.LogObj.LogArray.push(obj);
                        //} else {
                        //    let tempDentitionArray = $filter('filter')(reqObj.Airway.DentitionList, { 'DeleteInd': "N" }, true);
                        //    let tempLogDentitionArray = $filter('filter')($scope.LogObj.DentitionList, { 'DeleteInd': "N" }, true);

                        //    if ((tempDentitionArray.length !== tempLogDentitionArray.length) || ($scope.LogObj.AirwayNotes !== $scope.HealthPhysicalObj.AirwayObj.Notes)) {
                        //        let obj = {
                        //            "LogId": 0,
                        //            "ModuleId": 2,
                        //            "ModuleName": "ASC",
                        //            "SubModuleId": 15,
                        //            "SubModuleName": "H&P",
                        //            "ScreenType": $scope.ModuleName || '',
                        //            "ActionType": 'Edited',
                        //            "ActionDescription": `Dentition in Quick Summary for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                        //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        //        };
                        //        $scope.LogObj.LogArray.push(obj);
                        //    }
                        //}
                    }

                    if ($scope.HealthPhysicalObj.AirwayObj.ROMTMS != '' || $scope.HealthPhysicalObj.AirwayObj.Class != '' || $scope.HealthPhysicalObj.AirwayObj.MouthOpening != '' || $scope.HealthPhysicalObj.AirwayObj.TMDistance != '' || $scope.HealthPhysicalObj.AirwayObj.UnableToAssess || $scope.HealthPhysicalObj.AirwayObj.Tracheostomy || $scope.LogObj.AirwayROMTMS != '' || $scope.LogObj.AirwayClass != '' || $scope.LogObj.MouthOpening != '' || $scope.LogObj.TMDistance != '' || $scope.LogObj.UnableToAssess || $scope.LogObj.Tracheostomy) {

                        var NewValue = '';
                        var OldValue = '';


                        if ($scope.HealthPhysicalObj.AirwayObj.ROMTMS != $scope.LogObj.AirwayROMTMS) {
                            if ($scope.HealthPhysicalObj.AirwayObj.ROMTMS)
                                NewValue += `${NewValue ? ', ' : ''}ROMTMS: ${$scope.HealthPhysicalObj.AirwayObj.ROMTMS}`;
                            if ($scope.LogObj.AirwayROMTMS)
                                OldValue += `${OldValue ? ', ' : ''}ROMTMS: ${$scope.LogObj.AirwayROMTMS}`;

                        }

                        if ($scope.HealthPhysicalObj.AirwayObj.Class != $scope.LogObj.AirwayClass) {
                            if ($scope.HealthPhysicalObj.AirwayObj.Class)
                                NewValue += `${NewValue ? ', ' : ''}Mallampati Score: ${$scope.HealthPhysicalObj.AirwayObj.Class}`;
                            if ($scope.LogObj.AirwayClass)
                                OldValue += `${OldValue ? ', ' : ''}Mallampati Score: ${$scope.LogObj.AirwayClass}`;
                        }

                        if ($scope.HealthPhysicalObj.AirwayObj.MouthOpening != $scope.LogObj.MouthOpening) {
                            if ($scope.HealthPhysicalObj.AirwayObj.MouthOpening)
                                NewValue += `${NewValue ? ', ' : ''}Mouth Opening: ${$scope.HealthPhysicalObj.AirwayObj.MouthOpening}`;
                            if ($scope.LogObj.MouthOpening)
                                OldValue += `${OldValue ? ', ' : ''}Mouth Opening: ${$scope.LogObj.MouthOpening}`;
                        }
                        if ($scope.HealthPhysicalObj.AirwayObj.TMDistance != $scope.LogObj.TMDistance) {
                            if ($scope.HealthPhysicalObj.AirwayObj.TMDistance)
                                NewValue += `${NewValue ? ', ' : ''}TM Distance: ${$scope.HealthPhysicalObj.AirwayObj.TMDistance}`;
                            if ($scope.LogObj.TMDistance)
                                OldValue += `${OldValue ? ', ' : ''}TM Distance: ${$scope.LogObj.TMDistance}`;
                        }
                        if ($scope.HealthPhysicalObj.AirwayObj.UnableToAssess != $scope.LogObj.UnableToAssess) {
                            if ($scope.HealthPhysicalObj.AirwayObj.UnableToAssess == true)
                                NewValue += `${NewValue ? ', ' : ''}UnableToAssess`;
                            if ($scope.LogObj.UnableToAssess == true)
                                OldValue += `${OldValue ? ', ' : ''}UnableToAssess`;
                        }
                        if ($scope.HealthPhysicalObj.AirwayObj.Tracheostomy != $scope.LogObj.Tracheostomy) {
                            if ($scope.HealthPhysicalObj.AirwayObj.Tracheostomy == true)
                                NewValue += `${NewValue ? ', ' : ''}Tracheostomy`;
                            if ($scope.LogObj.Tracheostomy == true)
                                OldValue += `${OldValue ? ', ' : ''}Tracheostomy`;
                        }

                        if ($scope.LogObj.AirwayROMTMS == '' && $scope.LogObj.AirwayClass == '' && $scope.LogObj.MouthOpening == '' && $scope.LogObj.TMDistance == '' && !$scope.LogObj.UnableToAssess && !$scope.LogObj.Tracheostomy) {
                            let obj = {
                                "LogId": 0,
                                "ModuleId": 2,
                                "ModuleName": "ASC",
                                "SubModuleId": 15,
                                "SubModuleName": "H&P",
                                "ScreenType": 'Quick Access',
                                "ActionType": 'Added',
                                "OldActionDescription": "",
                                "NewActionDescription": NewValue,
                               // "ActionDescription": `Airway in Quick Summary for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        } else {
                            let Counter = 0;
                            if ($scope.HealthPhysicalObj.AirwayObj.ROMTMS !== $scope.LogObj.AirwayROMTMS) {
                                Counter++;
                            }
                            if ($scope.HealthPhysicalObj.AirwayObj.Class !== $scope.LogObj.AirwayClass) {
                                Counter++;
                            }
                            if ($scope.HealthPhysicalObj.AirwayObj.MouthOpening !== $scope.LogObj.MouthOpening) {
                                Counter++;
                            }
                            if ($scope.HealthPhysicalObj.AirwayObj.TMDistance !== $scope.LogObj.TMDistance) {
                                Counter++;
                            }
                            if ($scope.HealthPhysicalObj.AirwayObj.UnableToAssess !== $scope.LogObj.UnableToAssess) {
                                Counter++;
                            }
                            if ($scope.HealthPhysicalObj.AirwayObj.Tracheostomy !== $scope.LogObj.Tracheostomy) {
                                Counter++;
                            }


                            if (Counter !== 0) {
                                let obj = {
                                    "LogId": 0,
                                    "ModuleId": 2,
                                    "ModuleName": "ASC",
                                    "SubModuleId": 15,
                                    "SubModuleName": "H&P",
                                    "ScreenType": 'Quick Access',
                                    "ActionType": 'Edited',
                                    "OldActionDescription": OldValue,
                                    "NewActionDescription": NewValue,
                                   // "ActionDescription": `Airway in Quick Summary for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                };
                                $scope.LogObj.LogArray.push(obj);
                            }
                        }
                    }

                }

            }

            //airway

            //if (reqObj.RespiratoryRemarks != '' || $scope.LogObj.RespiratoryRemarks != '') {
            //    let ActionType = ''
            //    if ($scope.LogObj.RespiratoryRemarks == '') {
            //        ActionType = 'Added';
            //    } else {
            //        ActionType = 'Edited';
            //    }
            //    let ActionDescription = "Respiratory Notes In Quick Access For Appointment ID:" + $scope.cacheStorageItem.AppointmentId || "";
            //    if (reqObj.RespiratoryRemarks != $scope.LogObj.RespiratoryRemarks) {
            //        let obj = {
            //            "LogId": 0,
            //            "ModuleId": $scope.ModuleId || 0,
            //            "ModuleName": $scope.ModuleName || "",
            //            "SubModuleId": 15,
            //            "SubModuleName": "H&P",
            //            "ScreenType": $scope.ModuleName || '',
            //            "ActionType": ActionType,
            //            "ActionDescription": ActionDescription,
            //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            //        };
            //        $scope.LogObj.LogArray.push(obj);
            //    }
            //}
            if ($scope.LogObj.LogArray.length > 0) {
                reqObj.Logs = $scope.LogObj || {};
            }
            console.log(JSON.stringify(reqObj))
            // return false;
            if ($scope.IsComingfrm == 'Admin') {
                $uibModalInstance.close(reqObj);
                return false;
            }
            $scope.HealthPhysicalObj.IsClickSaveHealthPhysicalBtn = true;
            eHnoteSurgeryService.AddUpdateASCHandPQuickAccess(reqObj, callbackSuccess, callbackError);

            function callbackSuccess(response) {
                if (response.Status === "Success") {
                    alertify.success("Pre-anesthesia data saved successfully!");
                    $scope.HealthPhysicalObj.IsClickSaveHealthPhysicalBtn = false;
                    $uibModalInstance.close($scope.AllVitalsArray);
                } else {
                    $scope.HealthPhysicalObj.IsClickSaveHealthPhysicalBtn = false;
                    alertify.error("Some Error Occured");
                }
            };
            function callbackError(err) {
                $scope.HealthPhysicalObj.IsClickSaveHealthPhysicalBtn = false;
                alertify.error("Uploading Failed");
            }

        }


        $scope.selectedHandP = function (files) {

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
                        let FileTypeId = 33;
                        //if ($scope.cacheStorageItem.AppointmentTypeId==4) {
                        //    FileTypeId = 33;
                        //}
                        //if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
                        //    FileTypeId = 32;
                        //}
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


        $scope.scanFiles = function (type) {
            $scope.SelectedFile = null;
            if (type == 33) {
                $scope.SelectedFile = 33;
            }
          
            let PatientSurgeryId = null;
            if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
                if ($scope.cacheStorageItem.SurgeryList.length > 0) {
                    PatientSurgeryId = $scope.cacheStorageItem.SurgeryList[0].PatientSurgeryId;
                }
            }
            if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
                if ($scope.cacheStorageItem.PreAdmSurgeryList.length > 0) {
                    PatientSurgeryId = $scope.cacheStorageItem.PreAdmSurgeryList[0].PatientSurgeryId;
                }
            }

            var obj = {
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientName": $scope.cacheStorageItem.PatientName || '',
                "Tab": "ASCFileUploads",
                "SignedDate": $filter('date')($scope.currentDate, "yyyy-MM-dd"),
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
                "windowClass": "modal__eighty--  ",
                "keyboard": false,
                "controller": "DocumentScannerCtrl",
            });
            $scope.mInstanceAdd.result.then(function (data) {
                console.log(data);
                //$scope.init();



                if (data.DocumentDetails.length > 0) {
                    angular.forEach(data.DocumentDetails, function (item) {
                        item.DocumentID = item.DocumentID || 0;
                        var object = {
                          
                            "S3URL": item.S3URL || '',
                            "DeleteInd": item.DeleteInd,
                            "DocumentID": item.DocumentID,
                            "DocumentName": item.DocumentName,
                            "FileName": item.DocumentName,
                            "FileExt": item.DocumentExt,
                            "FileTypeId": item.FileTypeId,
                            "DisplayName": item.DisplayName,
                        };                       
                        $scope.HealthPhysicalObj.DocumentDetails.push(object);
                    });                  
                   
                }

            }, function (cancel) {
            });

        }

        $scope.DeleteUploadedFileNew = function (item, index, mainitem) {
            if (item.DocumentID == 0) {
                $scope.FilesObj.TempImagesArray.splice(index, 1);
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
        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
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
                        //kitem.DeleteInd = "N";
                        //kitem.PatientDetailId = kitem.PatientDetailId || 0;
                        //if (kitem.PatientDetailId != 0) {
                        //    kitem.DeleteInd = "Y";
                        //}
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

                            }
                        });
                    }



                    if ($scope.HealthPhysicalObj.IsLungsWNL) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 17) {

                                if (kitem.IsNormal == true) {
                                    kitem.IsChecked = true;
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


                            }
                        });
                    }


                    if ($scope.HealthPhysicalObj.IsNeurologicWNL) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 5) {

                                if (kitem.IsNormal == true) {
                                    kitem.IsChecked = true;
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
                                //kitem.PatientDetailId = kitem.PatientDetailId || 0;
                                //if (kitem.PatientDetailId != 0) {
                                //    kitem.DeleteInd = "Y";
                                //}
                                kitem.IsChecked = false;
                            }
                        });
                    }

                    if ($scope.HealthPhysicalObj.IsHeentWNL == false) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 16) {
                                //kitem.PatientDetailId = kitem.PatientDetailId || 0;
                                //if (kitem.PatientDetailId != 0) {
                                //    kitem.DeleteInd = "Y";
                                //}
                                kitem.IsChecked = false;
                            }
                        });
                    }

                    if ($scope.HealthPhysicalObj.IsLungsWNL == false) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 17) {
                                kitem.IsChecked = false;
                                //kitem.PatientDetailId = kitem.PatientDetailId || 0;
                                //if (kitem.PatientDetailId != 0) {
                                //    kitem.DeleteInd = "Y";
                                //}

                            }
                        });
                    }

                    if ($scope.HealthPhysicalObj.IsNeurologicWNL == false) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 5) {
                                //kitem.PatientDetailId = kitem.PatientDetailId || 0;
                                //if (kitem.PatientDetailId != 0) {
                                //    kitem.DeleteInd = "Y";
                                //}
                                kitem.IsChecked = false;
                            }
                        });
                    }
                    if ($scope.HealthPhysicalObj.IsGeneralappearanceWNL == false) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 21) {
                                //kitem.PatientDetailId = kitem.PatientDetailId || 0;
                                //if (kitem.PatientDetailId != 0) {
                                //    kitem.DeleteInd = "Y";
                                //}
                                kitem.IsChecked = false;
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

                        }
                    });
                } else {
                    $scope.HealthPhysicalObj.IsAllHealthWNL = false;
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                        if (kitem.TypeId === 1) {
                            kitem.IsChecked = false;
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

                        }
                    });
                } else {
                    $scope.HealthPhysicalObj.IsAllHealthWNL = false;
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                        if (kitem.TypeId === 5) {
                            kitem.IsChecked = false;
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

                        }
                    });
                } else {
                    $scope.HealthPhysicalObj.IsAllHealthWNL = false;
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                        if (kitem.TypeId === 16) {
                            kitem.IsChecked = false;
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

                        }
                    });
                } else {
                    $scope.HealthPhysicalObj.IsAllHealthWNL = false;
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                        if (kitem.TypeId === 17) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }




            if (item === "General Appearance") {
                if ($scope.HealthPhysicalObj.IsGeneralappearanceWNL) {
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                        if (kitem.TypeId === 21) {
                            kitem.IsChecked = false;
                            // kitem.DeleteInd = "N";
                            if (kitem.IsNormal == true) {
                                kitem.IsChecked = true;
                            }
                        }
                    });
                } else {
                    $scope.HealthPhysicalObj.IsAllHealthWNL = false;
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                        if (kitem.TypeId === 21) {
                            kitem.IsChecked = false;
                            //kitem.PatientDetailId = kitem.PatientDetailId || 0;
                            //if (kitem.PatientDetailId != 0) {
                            //    kitem.DeleteInd = "Y";
                            //}
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
                        if (kitem.IsNormal == true ) {
                            kitem.IsChecked = false;
                            //kitem.DeleteInd = "N";
                            //kitem.PatientDetailId = kitem.PatientDetailId || 0;
                            //if (kitem.PatientDetailId != 0) {
                            //    kitem.DeleteInd = "Y";
                            //}
                            $scope.HealthPhysicalObj.IsCardiacWNL = false;
                        }

                    }
                });

            }
            //if (item.IsChecked == false) {
            //    item.PatientDetailId = item.PatientDetailId || 0;
            //    if (item.PatientDetailId != 0) {
            //        item.DeleteInd = "Y";
            //    }
            //}
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
            //if (item.IsChecked == false) {
            //    item.PatientDetailId = item.PatientDetailId || 0;
            //    if (item.PatientDetailId != 0) {
            //        item.DeleteInd = "Y";
            //    }
            //}
        }

        $scope.ChangeHeentApp = function (item) {
            if (item.IsNormal == false && item.IsChecked == true && $scope.HealthPhysicalObj.IsHeentWNL == true) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 16) {
                        if (kitem.IsNormal == true) {
                            kitem.IsChecked = false;
                            //kitem.DeleteInd = "N";
                            //kitem.PatientDetailId = kitem.PatientDetailId || 0;
                            //if (kitem.PatientDetailId != 0) {
                            //    kitem.DeleteInd = "Y";
                            //}
                            $scope.HealthPhysicalObj.IsHeentWNL = false;
                        }

                    }
                });

            }
            //if (item.IsChecked == false) {
            //    item.PatientDetailId = item.PatientDetailId || 0;
            //    if (item.PatientDetailId != 0) {
            //        item.DeleteInd = "Y";
            //    }
            //}
        }
        $scope.ChangeLungsApp = function (item) {
            if (item.IsNormal == false && item.IsChecked == true && $scope.HealthPhysicalObj.IsLungsWNL == true) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 17) {
                        if (kitem.IsNormal == true) {
                            kitem.IsChecked = false;
                            //kitem.DeleteInd = "N";
                            //kitem.PatientDetailId = kitem.PatientDetailId || 0;
                            //if (kitem.PatientDetailId != 0) {
                            //    kitem.DeleteInd = "Y";
                            //}
                            $scope.HealthPhysicalObj.IsLungsWNL = false;
                        }
                    }
                });

            }
            //if (item.IsChecked == false) {
            //    item.PatientDetailId = item.PatientDetailId || 0;
            //    if (item.PatientDetailId != 0) {
            //        item.DeleteInd = "Y";
            //    }
            //}
        }


        $scope.ChangeGeneralApp = function (item) {
            if (item.IsNormal == false && item.IsChecked == true && $scope.HealthPhysicalObj.IsGeneralappearanceWNL == true) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                    if (kitem.TypeId === 21) {
                        //kitem.DeleteInd = "N";
                        //kitem.PatientDetailId = kitem.PatientDetailId || 0;
                        //if (kitem.PatientDetailId != 0) {
                        //    kitem.DeleteInd = "Y";
                        //}
                        if (kitem.IsNormal == true) {
                            kitem.IsChecked = false;
                            $scope.HealthPhysicalObj.IsGeneralappearanceWNL = false;
                        }

                    }
                });
            }
            //if (item.IsChecked == false) {
            //    item.PatientDetailId = item.PatientDetailId || 0;
            //    if (item.PatientDetailId != 0) {
            //        item.DeleteInd = "Y";
            //    }
            //}

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

    //$scope.ChangeOthersystems = function (item) {
    //    if (item.IsChecked == false) {
    //        item.PatientDetailId = item.PatientDetailId || 0;
    //        if (item.PatientDetailId != 0) {
    //            item.DeleteInd = "Y";
    //        }
    //    } else {
    //        item.DeleteInd = "N";
    //    }
    //}

        $scope.DeletePreAdmDocumentlist = function (item, index, mainitem) {
           
            $scope.DeleteFileUploadArray = { "DocumentID": item.DocumentID, "FileName": item.DocumentName, "Remarks": "" };
            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete? </h4>", function () {
                $scope.LogObj.LogArray = [];
                let obj = {
                    "LogId": 0,
                    "ModuleId": $scope.ModuleId || 0,
                    "ModuleName": $scope.ModuleName || "",
                    "SubModuleId": 15,
                    "SubModuleName": "H&P",
                    "ScreenType": 'Quick Access',
                    "ActionType": "Deleted ",
                    "OldActionDescription": item.DisplayName + " Files(External) in Admit",
                    "NewActionDescription": "",
                  //  "ActionDescription": `Files in Quick Access(H&P) for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
                var params = {
                    "AppointmentID": $scope.cacheStorageItem.AppointmentId, //AppointmentID
                    "DeleteIndicator": 0,
                    "ImagesArray": [],
                    "UploadType": "Delete",
                    "HospitalID": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                    "Remarks": "",
                    "Logs": {},
                };

                if ($scope.LogObj.LogArray.length > 0) {
                    params.Logs = $scope.LogObj || {};
                }

                params.ImagesArray.push($scope.DeleteFileUploadArray);
                eHnoteDiagnosisDataServices.DeleteASCDocumentList(params, onupdateDeletesuccess, onupdateDelerror);
            }, function () { });
            function onupdateDeletesuccess(response) {
                if (response.Status === 'Success') {
                    item.DeleteInd = 'Y';
                    console.log('Checking');
                }
            }
            function onupdateDelerror(errordata) {
                console.log(errordata);
            }
        }




        //$scope.$watch("HealthPhysicalObj.SystemicHistoryArray", function (newVal, oldVal) {   // $watch comment by Vijay Not Needed functionality changed

        //    let CardiacCounter = 0;
        //    let PulmonaryCounter = 0;
        //    let HepaticCounter = 0;
        //    let EndocrineCounter = 0;
        //    let NeurologicCounter = 0;
        //    let HemeOncCounter = 0;
        //    let NervousSystemCounter = 0;
        //    let KidneyDiseaseCounter = 0;
        //    let MusculoSkeletalSystemCounter = 0;
        //    let AutoImmuneDisordersCounter = 0;
        //    let PsychosisCounter = 0;
        //    let OthersCounter = 0;
        //    let RespiratoryCounter = 0;
        //    let HeentCounter = 0;
        //    let LungsCounter = 0;
        //    let GeneralappearanceCounter = 0;

        //    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
        //        if (item.TypeId == 1 && item.IsChecked) {
        //            CardiacCounter++;
        //        }
        //        if (item.TypeId == 2 && item.IsChecked) {
        //            PulmonaryCounter++;
        //        }
        //        if (item.TypeId == 3 && item.IsChecked) {
        //            HepaticCounter++;
        //        }
        //        if (item.TypeId == 4 && item.IsChecked) {
        //            EndocrineCounter++;
        //        }
        //        if (item.TypeId == 5 && item.IsChecked) {
        //            NeurologicCounter++;
        //        }
        //        if (item.TypeId == 6 && item.IsChecked) {
        //            HemeOncCounter++;
        //        }
        //        if (item.TypeId == 7 && item.IsChecked) {
        //            NervousSystemCounter++;
        //        }
        //        if (item.TypeId == 8 && item.IsChecked) {
        //            KidneyDiseaseCounter++;
        //        }
        //        if (item.TypeId == 9 && item.IsChecked) {
        //            MusculoSkeletalSystemCounter++;
        //        }
        //        if (item.TypeId == 10 && item.IsChecked) {
        //            AutoImmuneDisordersCounter++;
        //        }
        //        if (item.TypeId == 11 && item.IsChecked) {
        //            PsychosisCounter++;
        //        }
        //        if (item.TypeId == 12 && item.IsChecked) {
        //            OthersCounter++;
        //        }
        //        if (item.TypeId == 13 && item.IsChecked) {
        //            RespiratoryCounter++;
        //        }
        //        if (item.TypeId == 16 && item.IsChecked) {
        //            HeentCounter++;
        //        }
        //        if (item.TypeId == 17 && item.IsChecked) {
        //            LungsCounter++;
        //        }
        //        if (item.TypeId == 21 && item.IsChecked) {
        //            GeneralappearanceCounter++;
        //        }
        //    });
        //    if (CardiacCounter > 0) {
        //        $scope.HealthPhysicalObj.IsCardiacWNL = true;
        //        $scope.HealthPhysicalObj.IsAllHealthWNL = false;

        //        var TempCardiac = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'TypeId': 1 }, true);

        //        if (TempCardiac.length > 0) {
        //            angular.forEach(TempCardiac, function (kitem) {
        //                if (kitem.IsNormal == false && kitem.IsChecked == true) {

        //                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
        //                        if (kitem.TypeId === 1) {
        //                            if (kitem.IsNormal == true) {
        //                                kitem.IsChecked = false;

        //                            }

        //                            $scope.HealthPhysicalObj.IsCardiacWNL = false;

        //                        }
        //                    });
        //                }
        //            });
        //        }
        //    }
        //    if (PulmonaryCounter > 0) {
        //        $scope.HealthPhysicalObj.IsPulmonaryWNL = false;
        //        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //    }
        //    if (HepaticCounter > 0) {
        //        $scope.HealthPhysicalObj.IsHepaticWNL = false;
        //        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //    }
        //    if (EndocrineCounter > 0) {
        //        $scope.HealthPhysicalObj.IsEndocrineWNL = false;
        //        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //    }
        //    if (NeurologicCounter > 0) {
        //        $scope.HealthPhysicalObj.IsNeurologicWNL = true;
        //        $scope.HealthPhysicalObj.IsAllHealthWNL = false;

        //        var TempNeuro = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'TypeId': 5 }, true);

        //        if (TempNeuro.length > 0) {
        //            angular.forEach(TempNeuro, function (kitem) {
        //                if (kitem.IsNormal == false && kitem.IsChecked == true) {
        //                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
        //                        if (kitem.TypeId === 5) {
        //                            if (kitem.IsNormal == true) {
        //                                kitem.IsChecked = false;
        //                            }

        //                            $scope.HealthPhysicalObj.IsNeurologicWNL = false;
        //                        }
        //                    });
        //                }
        //            });
        //        }

        //    }
        //    if (HemeOncCounter > 0) {
        //        $scope.HealthPhysicalObj.IsHemeOncWNL = false;
        //        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //    }
        //    if (NervousSystemCounter > 0) {
        //        $scope.HealthPhysicalObj.IsNervousSystemWNL = false;
        //        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //    }
        //    if (KidneyDiseaseCounter > 0) {
        //        $scope.HealthPhysicalObj.IsKidneyDiseaseWNL = false;
        //        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //    }
        //    if (MusculoSkeletalSystemCounter > 0) {
        //        $scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL = false;
        //        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //    }
        //    if (AutoImmuneDisordersCounter > 0) {
        //        $scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL = false;
        //        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //    }
        //    if (PsychosisCounter > 0) {
        //        $scope.HealthPhysicalObj.IsPsychosisWNL = false;
        //        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //    }
        //    if (OthersCounter > 0) {
        //        $scope.HealthPhysicalObj.IsOthersWNL = false;
        //        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //    }
        //    if (RespiratoryCounter > 0) {
        //        $scope.HealthPhysicalObj.IsRespiratoryNormal = false;
        //        $scope.HealthPhysicalObj.IsAllHealthWNL = false;
        //    }
        //    if (HeentCounter > 0) {
        //        $scope.HealthPhysicalObj.IsHeentWNL = true;
        //        $scope.HealthPhysicalObj.IsAllHealthWNL = false;

        //        var TempHeent = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'TypeId': 16}, true);


        //        if (TempHeent.length > 0) {
        //            angular.forEach(TempHeent, function (kitem) {
        //                if (kitem.IsNormal == false && kitem.IsChecked == true ) {

        //                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
        //                        if (kitem.TypeId === 16) {
        //                            if (kitem.IsNormal == true) {
        //                                kitem.IsChecked = false;
        //                            }
        //                            $scope.HealthPhysicalObj.IsHeentWNL = false;
        //                        }
        //                    });
        //                }
        //            });
        //        }

        //    }
        //    if (LungsCounter > 0) {
        //        $scope.HealthPhysicalObj.IsLungsWNL = true;
        //        $scope.HealthPhysicalObj.IsAllHealthWNL = false;

        //        var TempLungs = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'TypeId': 17 }, true);


        //        if (TempLungs.length > 0) {
        //            angular.forEach(TempLungs, function (kitem) {
        //                if (kitem.IsNormal == false && kitem.IsChecked == true ) {
        //                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
        //                        if (kitem.TypeId === 17) {
        //                            if (kitem.IsNormal == true) {
        //                                kitem.IsChecked = false;
        //                                $scope.HealthPhysicalObj.IsLungsWNL = false;
        //                            }

        //                        }
        //                    });
        //                }
        //            });
        //        }
        //    }

        //    if (GeneralappearanceCounter > 0) {
        //        $scope.HealthPhysicalObj.IsGeneralappearanceWNL = true;
        //        $scope.HealthPhysicalObj.IsAllHealthWNL = false;

        //        var TempGeneral = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'TypeId': 21 }, true);

        //        if (TempGeneral.length > 0) {
        //            angular.forEach(TempGeneral, function (kitem) {
        //                if (kitem.IsNormal == false && kitem.IsChecked == true) {
        //                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
        //                        if (kitem.TypeId === 21) {
        //                            if (kitem.IsNormal == true) {
        //                                kitem.IsChecked = false;
        //                                $scope.HealthPhysicalObj.IsGeneralappearanceWNL = false;
        //                            }

        //                        }
        //                    });
        //                }
        //            });
        //        }

        //    }

        //}, true);




        $scope.viewMoreorLesstr = false;

        $scope.viewststematicaddnotes = {
            templateUrl: 'viewststematicaddnotes.html'
        };


      

        $scope.additionalSystemicFilter = function (item) {
            // respiratory section and default items shown in systemic history are filtered out here
            return item.TypeId !== 1 && item.TypeId !== 2 && item.TypeId !== 3 && item.TypeId !== 5 && item.TypeId !== 6 && item.TypeId !== 7 && item.TypeId !== 8 && item.TypeId !== 9 && item.TypeId !== 10 && item.TypeId !== 11 && item.TypeId !== 12 && item.TypeId !== 16 && item.TypeId !== 17 && item.TypeId !== 21 && item.TypeId !== 18 && item.TypeId !== 19;
        };

        $scope.OpenSystemicNotesPopover = function (obj) {
            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                item.IsPopoverOpen = false;
            });
            obj.IsPopoverOpen = true;
            $scope.HealthPhysicalObj.SystemicHistoryPopoverObj = angular.copy(obj);
            $scope.HealthPhysicalObj.SystemicHistoryPopoverNotes = obj.Remarks;
        };

        $scope.AddSystemicNotes = function () {
            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                item.TypeId = item.TypeId || null;
                if (item.TypeId != null) {
                    if (item.TypeId == $scope.HealthPhysicalObj.SystemicHistoryPopoverObj.TypeId && item.HistoryId == $scope.HealthPhysicalObj.SystemicHistoryPopoverObj.HistoryId) {
                        item.Remarks = $scope.HealthPhysicalObj.SystemicHistoryPopoverNotes || "";
                        item.IsPopoverOpen = false;
                    }
                }
            });
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


        if ($scope.HPMainObj.TempDocumentDetails.length > 0) {
            $scope.FilesObj.TempImagesArray = $scope.HPMainObj.TempDocumentDetails || [];
        } else {
            $scope.FilesObj.TempImagesArray = [];
        }

        if ($scope.HPMainObj.DocumentDetails.length > 0) {
            $scope.HealthPhysicalObj.DocumentDetails = $scope.HPMainObj.DocumentDetails || [];
        } else {
            $scope.HealthPhysicalObj.DocumentDetails = [];
        }

        $scope.changeDenitionOtherdata = function (item) {
            if (item.DentitionId == 22 && item.IsChecked == false) {
                $scope.HealthPhysicalObj.AirwayObj.Dentition = "";
            }
        }

        $scope.OnSelectPhysicalEvalutionNormal = function (item) {
            if (item === "Cardiac") {
                if ($scope.HealthPhysicalObj.IsCardioVascularWNL) {
                    $scope.HealthPhysicalObj.showCardiacNotes = false;
                    angular.forEach($scope.HealthPhysicalObj.PhysicalEvaluationArray, function (kitem) {
                        if (kitem.HistoryId === 19) {
                            kitem.IsChecked = false;
                            if (kitem.IsNormal == true) {
                                kitem.IsChecked = true;
                            }
                            if (kitem.PhysicalEvaluationDetailId !== 0 && kitem.IsChecked === false) {
                                kitem.DeleteInd = "Y";
                            } else if (kitem.PhysicalEvaluationDetailId !== 0 && kitem.IsChecked === true) {
                                kitem.DeleteInd = "N";
                            }
                        }
                    });
                } else {
                    angular.forEach($scope.HealthPhysicalObj.PhysicalEvaluationArray, function (kitem) {
                        if (kitem.HistoryId === 19) {
                            kitem.IsChecked = false;

                            if (kitem.PhysicalEvaluationDetailId !== 0 && kitem.IsChecked === false) {
                                kitem.DeleteInd = "Y";
                            }
                        }
                    });
                }
            }
            if (item === "Pulmonary") {
                if ($scope.HealthPhysicalObj.IsPulmonaryWNL) {
                    $scope.HealthPhysicalObj.showPulmonaryNotes = false;
                    angular.forEach($scope.HealthPhysicalObj.PhysicalEvaluationArray, function (kitem) {
                        if (kitem.HistoryId === 20) {
                            kitem.IsChecked = false;
                            if (kitem.IsNormal == true) {
                                kitem.IsChecked = true;
                            }
                            if (kitem.PhysicalEvaluationDetailId !== 0 && kitem.IsChecked === false) {
                                kitem.DeleteInd = "Y";
                            } else if (kitem.PhysicalEvaluationDetailId !== 0 && kitem.IsChecked === true) {
                                kitem.DeleteInd = "N";
                            }
                        }
                    });
                } else {
                    angular.forEach($scope.HealthPhysicalObj.PhysicalEvaluationArray, function (kitem) {
                        if (kitem.HistoryId === 20) {
                            kitem.IsChecked = false;

                            if (kitem.PhysicalEvaluationDetailId !== 0 && kitem.IsChecked === false) {
                                kitem.DeleteInd = "Y";
                            }
                        }
                    });
                }
            }
            if (item === "Hepatic") {
                if ($scope.HealthPhysicalObj.IsHepaticWNL) {
                    $scope.HealthPhysicalObj.showHepaticNotes = false;
                    angular.forEach($scope.HealthPhysicalObj.PhysicalEvaluationArray, function (kitem) {
                        if (kitem.HistoryId === 21) {
                            kitem.IsChecked = false;
                            if (kitem.IsNormal == true) {
                                kitem.IsChecked = true;
                            }
                            if (kitem.PhysicalEvaluationDetailId !== 0 && kitem.IsChecked === false) {
                                kitem.DeleteInd = "Y";
                            } else if (kitem.PhysicalEvaluationDetailId !== 0 && kitem.IsChecked === true) {
                                kitem.DeleteInd = "N";
                            }
                        }
                    });
                } else {
                    angular.forEach($scope.HealthPhysicalObj.PhysicalEvaluationArray, function (kitem) {
                        if (kitem.HistoryId === 21) {
                            kitem.IsChecked = false;

                            if (kitem.PhysicalEvaluationDetailId !== 0 && kitem.IsChecked === false) {
                                kitem.DeleteInd = "Y";
                            }
                        }
                    });
                }
            }
        };

        $scope.ChangePhysiacalEvaluationValue = function (Type, item) {
            if (Type == 'General' && item.HistoryId == 18) {
                if (item.PhysicalEvaluationDetailId !== 0 && item.IsChecked === false) {
                    item.DeleteInd = "Y";
                } else if (item.PhysicalEvaluationDetailId !== 0 && item.IsChecked === true) {
                    item.DeleteInd = "N";
                }

                if (item.Id === 126) {
                    if (item.IsChecked) {
                        $scope.HealthPhysicalObj.showGeneralNotes = true;
                    } else {
                        $scope.HealthPhysicalObj.showGeneralNotes = false;
                        $scope.HealthPhysicalObj.PhysicalGeneralNotes = "";
                    }
                }
            } else if (Type == 'Cardioc' && item.HistoryId == 19) {

                if (item.IsNormal == false && item.IsChecked == true && $scope.HealthPhysicalObj.IsCardioVascularWNL == true) {

                    angular.forEach($scope.HealthPhysicalObj.PhysicalEvaluationArray, function (kitem) {
                        if (kitem.HistoryId === 19) {
                            if (kitem.IsNormal == true) {
                                kitem.IsChecked = false;
                                $scope.HealthPhysicalObj.IsCardioVascularWNL = false;
                            }

                        }
                    });

                }

                if (item.PhysicalEvaluationDetailId !== 0 && item.IsChecked === false) {
                    item.DeleteInd = "Y";
                } else if (item.PhysicalEvaluationDetailId !== 0 && item.IsChecked === true) {
                    item.DeleteInd = "N";
                }

                if (item.Id === 131) {
                    if (item.IsChecked) {
                        $scope.HealthPhysicalObj.showCardiacNotes = true;
                    } else {
                        $scope.HealthPhysicalObj.showCardiacNotes = false;
                        $scope.HealthPhysicalObj.PhysicalCardiocNotes = "";
                    }
                }
            } else if (Type == 'Pulmonary' && item.HistoryId == 20) {

                if (item.IsNormal == false && item.IsChecked == true && $scope.HealthPhysicalObj.IsPulmonaryWNL == true) {

                    angular.forEach($scope.HealthPhysicalObj.PhysicalEvaluationArray, function (kitem) {
                        if (kitem.HistoryId === 20) {
                            if (kitem.IsNormal == true) {
                                kitem.IsChecked = false;
                                $scope.HealthPhysicalObj.IsPulmonaryWNL = false;
                            }

                        }
                    });

                }

                if (item.PhysicalEvaluationDetailId !== 0 && item.IsChecked === false) {
                    item.DeleteInd = "Y";
                } else if (item.PhysicalEvaluationDetailId !== 0 && item.IsChecked === true) {
                    item.DeleteInd = "N";
                }

                if (item.Id === 138) {
                    if (item.IsChecked) {
                        $scope.HealthPhysicalObj.showPulmonaryNotes = true;
                    } else {
                        $scope.HealthPhysicalObj.showPulmonaryNotes = false;
                        $scope.HealthPhysicalObj.PhysicalPulmonaryNotes = "";
                    }
                }
            } else if (Type == 'Hepatic' && item.HistoryId == 21) {

                if (item.IsNormal == false && item.IsChecked == true && $scope.HealthPhysicalObj.IsHepaticWNL == true) {

                    angular.forEach($scope.HealthPhysicalObj.PhysicalEvaluationArray, function (kitem) {
                        if (kitem.HistoryId === 21) {
                            if (kitem.IsNormal == true) {
                                kitem.IsChecked = false;
                                $scope.HealthPhysicalObj.IsHepaticWNL = false;
                            }

                        }
                    });

                }

                if (item.PhysicalEvaluationDetailId !== 0 && item.IsChecked === false) {
                    item.DeleteInd = "Y";
                } else if (item.PhysicalEvaluationDetailId !== 0 && item.IsChecked === true) {
                    item.DeleteInd = "N";
                }

                if (item.Id === 143) {
                    if (item.IsChecked) {
                        $scope.HealthPhysicalObj.showHepaticNotes = true;
                    } else {
                        $scope.HealthPhysicalObj.showHepaticNotes = false;
                        $scope.HealthPhysicalObj.PhysicalHepaticNotes = "";
                    }
                }
            }
        };
        $scope.SelectROMTMS = function (val, item) {
            if (val === 1) {
                if (item.ROMTMS == "" || item.ROMTMS == "Limited" || item.ROMTMS == "Restricted") {
                    item.ROMTMS = "Unrestricted";
                }
                else {
                    item.ROMTMS = ""
                }
            }
            if (val === 2) {
                if (item.ROMTMS == "" || item.ROMTMS == "Unrestricted" || item.ROMTMS == "Restricted") {
                    item.ROMTMS = "Limited";
                }
                else {
                    item.ROMTMS = ""
                }
            }
            if (val === 3) {
                if (item.ROMTMS == "" || item.ROMTMS == "Limited" || item.ROMTMS == "Unrestricted") {
                    item.ROMTMS = "Restricted";
                }
                else {
                    item.ROMTMS = ""
                }
            }

        };
        $scope.SelectMouthOpening = function (val, item) {
            if (val === 1) {
                if (item.MouthOpening == "" || item.MouthOpening == "2FB" || item.MouthOpening == "3FB" || item.MouthOpening == ">FB") {
                    item.MouthOpening = "1FB";
                }
                else {
                    item.MouthOpening = ""
                }
            }
            if (val === 2) {
                if (item.MouthOpening == "" || item.MouthOpening == "1FB" || item.MouthOpening == "3FB" || item.MouthOpening == ">FB") {
                    item.MouthOpening = "2FB";
                }
                else {
                    item.MouthOpening = ""
                }
            }
            if (val === 3) {
                if (item.MouthOpening == "" || item.MouthOpening == "1FB" || item.MouthOpening == "2FB" || item.MouthOpening == ">FB") {
                    item.MouthOpening = "3FB";
                }
                else {
                    item.MouthOpening = ""
                }
            }
            if (val === 4) {
                if (item.MouthOpening == "" || item.MouthOpening == "1FB" || item.MouthOpening == "2FB" || item.MouthOpening == "3FB") {
                    item.MouthOpening = ">FB";
                }
                else {
                    item.MouthOpening = ""
                }
            }

        };
        $scope.SelectTMDistance = function (val, item) {
            if (val === 1) {
                if (item.TMDistance == "" || item.TMDistance == ">3FB") {
                    item.TMDistance = "<3FB";
                }
                else {
                    item.TMDistance = ""
                }
            }
            if (val === 2) {
                if (item.TMDistance == "" || item.TMDistance == "<3FB") {
                    item.TMDistance = ">3FB";
                }
                else {
                    item.TMDistance = ""
                }
            }
        };

        $scope.cacheStorageItem.PatientName = $scope.cacheStorageItem.PatientName || '';
        $scope.cacheStorageItem.PatientDisplayId = $scope.cacheStorageItem.PatientDisplayId || '';

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
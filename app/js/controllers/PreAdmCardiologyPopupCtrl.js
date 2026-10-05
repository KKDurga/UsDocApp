"use strict";
eHnoteWebApp.controller("PreAdmCardiologyPopupCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteSurgeryService", "eHnoteCacheStorageService", "eHnoteAuditServices", "$uibModal", "eHnoteMainAppointmentService", "eHnoteDiagnosisDataServices", "datapersistanceFactory", "eHnotePatientDataService", "$q", "eHnoteSettingsDataService", "eHnoteConditionsDataService","allUserList","cache",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, eHnoteMasterDataService, eHnoteSurgeryService, eHnoteCacheStorageService, eHnoteAuditServices, $uibModal, eHnoteMainAppointmentService, eHnoteDiagnosisDataServices, datapersistanceFactory, eHnotePatientDataService, $q, eHnoteSettingsDataService, eHnoteConditionsDataService, allUserList,cache) {

        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
        appointmentInfo.AppointmentTypeId = 7;
        eHnoteMasterDataService.addAppointmentInfo(appointmentInfo);
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

        $scope.allUserList = allUserList || [];
        $scope.cache = cache || ''; // for orders 
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.LoginUserRoleID = doctorinfo.RoleID;
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        };
        $scope.currentDate = $filter('date')(new Date(), "yyyy-MM-dd");

        $scope.AllAnesthetistList = [];
        $scope.AllCardiologistList = [];
        if ($scope.allUserList.length > 0) {
            angular.forEach($scope.allUserList, function (item) {
                if (item.RoleId == 30 || item.RoleId == 8 || item.DoctorID == $scope.UserId || item.RoleId == 1 ||  item.RoleId == 25 || item.RoleId == 16) {
                    $scope.AllAnesthetistList.push(item);
                }
                if (item.RoleId == 72) {
                    $scope.AllCardiologistList.push(item);
                }
            });
        };


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
                "DoctorId": 0,//changing 0 as  $scope.UserId
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
                    "ECGUnits": "",
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
                "IsGeneralappearanceWNL":false,
                "SystemicHistoryArray": [],
                "ReviewedDate": "",
                "ReviewedTime": "",
                "LabNotes": "",
                "DocumentDetails": [],
                "TempImagesArray": [],
                "AppointmentID": $scope.cacheStorageItem.AppointmentId,
                "ChemistryNotesInd": false,
                "SocialNotesInd": false,
                "AirwayObjPreAdmnotesInd": false,
                "ECGValue":"",
                "ECGUnits":"BPM",
                "ECGNotes":""
            };
        };

        $scope.GetPreAdmCardiologyObj = function () {
            return {
                "PreAdmissionId": 0,
                "OrganizationId": $scope.HospitalId || 0,
                "UserId": $scope.UserId,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "AppointmentId": $scope.cacheStorageItem.SelectedAppointmentId || 0,
                "ParentAppointmentId": null,
                "PreAdmissionApptId": null,
                "PreAdmissionApptDate": "",
                "CardiologyStatusId": null,
                "CardiologyStatus": "",
                "AnesthesiaPlan": null,
                "CardiologyChartStatus": "D",
                "StatusFlag": "D",
                "IsShow": false,
                "IsEdit": false,
                "IsShowPreAdmissionSummaryView": false,
                "InvestigationsList": [],
                "PrevAnestheticsObj": "",
                "ReviewedBy": null,
                "ShowAdvanceHealthEdit": false,
                "AscAppointmentId": null,
                "AscAppointmentDate": "",
                "PresentIllness": "",
                "Treatment": "",
                "PrescriptionDetails": [],
                "CardiologistDiagnosis": [],
                "TempImagesArray": [],
                "DocumentDetails": [],
                "IsChestPain": null,
                "AppointmentID": $scope.cacheStorageItem.AppointmentId,
                "IsAdvanceCardInd": false,
                "PresentIllnessInd": false,
                "TreatmentInd": false,
                "IsClosePopUpInd": false,
                "ReviewByName": "",
                "AllergyItems": [],
                "SurgicalHistory": [],
                "CurrentSystemicMedicationsHistory": [],
                "CurrentEyeMedications": [],
                "SystemicHistoryPopoverNotes": "",
                "ROSOverAllRemarks":'',
            };
        };

        $scope.PreAdmCardiologyObj = angular.copy($scope.GetPreAdmCardiologyObj());

        $scope.GetOrganName = function () {
            return [{
                "OrganId": 1,
                "OrganName": "OD"
            },
            {
                "OrganId": 2,
                "OrganName": "OS"
            },
            //{
            //    "OrganId": 3,
            //    "OrganName": "OU"
            //},
            {
                "OrganId": 4,
                "OrganName": "General"
            }
            ];
        };
        $scope.GetOrganNameList = angular.copy($scope.GetOrganName());

        $scope.GetSeverityName = function () {
            return [{
                "SeverityId": 1,
                "SeverityName": "Mild"
            },
            {
                "SeverityId": 3,
                "SeverityName": "Moderate"
            },
            {
                "SeverityId": 5,
                "SeverityName": "Severe"
            }];
        };
        $scope.GetSeverityList = angular.copy($scope.GetSeverityName());

        $scope.GetStatusName = function () {
            return [{
                "DiagnosisStatusId": 1,
                "DiagnosisStatus": "Provisional"
            },
            {
                "DiagnosisStatusId": 2,
                "DiagnosisStatus": "Active"
            },
            {
                "DiagnosisStatusId": 3,
                "DiagnosisStatus": "InActive"
            },
            {
                "DiagnosisStatusId": 4,
                "DiagnosisStatus": "Resolved"
            },
            {
                "DiagnosisStatusId": 5,
                "DiagnosisStatus": "RuledOut"
            },
            {
                "DiagnosisStatusId": 6,
                "DiagnosisStatus": "Not Examined"
            },
            {
                "DiagnosisStatusId": 7,
                "DiagnosisStatus": "Entered In Error"
            }];
        };

        $scope.GetStatusList = angular.copy($scope.GetStatusName());

        $scope.MedicalrxObj = {
            "IsRcopiaa": false,
            "IsCurrentEye": true,
            "IsCurrentSystem": true
        }

        $scope.medicineGetObj = {
            "MedicineObject": ""
        }

        $scope.SigSearch = {
            "Shows": false
        }

        $scope.adnewsigobj = {
            "IsNewSig": false,
            "MedicineId": 0,
        }

        function getNewPrescriptionDetailObj() {
            var obj = {
                "PatientPrescriptionDetailId": 0,
                "PatientPrescriptionId": 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
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

        function getEmptyPrescriptionObj() {

            var TodayDate = $filter('date')(new Date(), "yyyy-MM-dd");

            var obj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "RcopiaPatientId": $scope.RcopiaPatientObj.RcopiaPatientId,
                "PatientPrescriptionId": 0,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                "ProviderId": $scope.cacheStorageItem.DoctorId,
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

        $scope.MedicationObj = {
            "AscOrderTemplateId": 0,
            "TemplateName": ""
        }

        $scope.InvestObj = {
            "AscOrderTemplateId": 0,
            "TemplateName": ""
        }

        // orders from anesthesia
        $scope.AnesthesiaPrescription = [];
        $scope.AnesthesiaInvestigations = [];
        if ($scope.cache.PrescriptionDetails.length > 0) {
            $scope.AnesthesiaPrescription = angular.copy($scope.cache.PrescriptionDetails);
            $scope.PrescriptionMainAddObj = angular.copy($scope.cache.PrescriptionDetails[0]);
            $scope.PrescriptionMainAddObj.PrescriptionDetails = [];
            if ($scope.cache.PrescriptionDetails[0].PrescriptionDetails.length > 0) {
                let tempArray = $filter('filter')($scope.cache.PrescriptionDetails[0].PrescriptionDetails, { 'TypeId': 2 }, true);
                $scope.AnesthesiaPrescription[0].PrescriptionDetails = [];
                if (tempArray.length > 0) {
                    angular.forEach(tempArray, function (item) {
                        $scope.AnesthesiaPrescription[0].PrescriptionDetails.push(item);
                    });
                }
            }
        }

        if ($scope.cache.InvestigationsList.length > 0) {
            $scope.AnesthesiaInvestigations = $filter('filter')($scope.cache.InvestigationsList, {'TypeId': 2},true) || [];
        }


        // orders from anesthesia end

        $scope.SelectChestPain = function (val) {
            if (val == 1) {
                if ($scope.PreAdmCardiologyObj.IsChestPain == null || $scope.PreAdmCardiologyObj.IsChestPain == false) {
                    $scope.PreAdmCardiologyObj.IsChestPain = true;
                } else {
                    $scope.PreAdmCardiologyObj.IsChestPain = null;
                }
            }
            if (val == 2) {
                if ($scope.PreAdmCardiologyObj.IsChestPain == null || $scope.PreAdmCardiologyObj.IsChestPain == true) {
                    $scope.PreAdmCardiologyObj.IsChestPain = false;
                } else {
                    $scope.PreAdmCardiologyObj.IsChestPain = null;
                }
            }
        }

        $scope.GetDiagnosisList = function (val) {
            var object = {
                "LevelType": 'O',
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": val,
                "PageSize": 10,
                "PageNumber": 1,
                "Type": '',
                "IsFrequent": 'N',
                "ParentOrganizationId": $scope.ParenthospitalId || null,
            };

            if (object.SearchText == '') {
                object.IsFrequent = 'Y';
            }
            return eHnoteSettingsDataService.GetMasterDiagnosis(object).then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.DiagnosisList !== undefined) {
                        return response.data.DiagnosisList.map(function (item) {
                            return item;
                        });
                    }
                }
            });

        };

        $scope.DoseArray = [];
        $scope.DoseOtherArray = [];
        $scope.FrequencyArray = [];
        $scope.RefillsArray = [];
        $scope.DurationArray = [];
        $scope.ActionArray = [];
        $scope.RouteArray = [];
        $scope.DoseUnitArray = [];
        $scope.QuantityUnitArray = [];

        $scope.getMasterFieldDosageData = function () {
            eHnoteDiagnosisDataServices.GetMedicineDosageFieldsMasterData().then(function (resp) {
                $scope.DoseArray = resp.data.doseArray || [];
                $scope.DoseOtherArray = resp.data.doseOtherArray || [];
                $scope.FrequencyArray = resp.data.frequencyArray || [];
                $scope.RefillsArray = resp.data.refillsArray || [];
                $scope.DurationArray = resp.data.durationArray || [];
                $scope.ActionArray = resp.data.actionArray || [];
                $scope.RouteArray = resp.data.routeArray || [];
                $scope.DoseUnitArray = resp.data.doseUnitArray || [];
                $scope.QuantityUnitArray = resp.data.quantityUnitArray || [];
            }, function (err) {
                alertify.error("Failed");
                console.log(err);
            });
        };

        $scope.getMasterFieldDosageData();

        $scope.onSelectPreAdmCardioDiagnosis = function (mainobject) {
            console.log(mainobject);
            var i = 0;

            $scope.PreAdmCardiologyObj.CardiologistDiagnosis = $scope.PreAdmCardiologyObj.CardiologistDiagnosis || [];
            if ($scope.PreAdmCardiologyObj.CardiologistDiagnosis.length > 0) {
                angular.forEach($scope.PreAdmCardiologyObj.CardiologistDiagnosis, function (item) {

                    if (item.DiagnosisId === mainobject.DiagnosisId && item.DeleteInd == 'N') {
                        alertify.error('You already entered this Diagnosis');
                        i++;
                        return false;
                    }

                });
                $scope.PreAdmCardiologyObj.DiagnosisObject = "";
            }
            if (i === 0) {

                var obj = {
                    "ConsultationDiagnosisId": 0,
                    "AssessmentPlanId": 0,
                    "AssessmentPlan": {
                        "AssessmentPlanId": 0,
                        "PlanofDiscussionsNotes": "",
                        "PatientInstructions": "",
                        "AssessmentsNotes": "",
                        "DoctorNotes": "",
                        "ActionsTaken": ""
                    },
                    "DiagnosisId": mainobject.DiagnosisId,
                    "DiagnosisName": mainobject.DiagnosisName,
                    "OrganizationDiagnosisId": mainobject.OrganizationDiagnosisId,
                    "ICD10CODE": mainobject.ICD10CODE,
                    "ICD10DIAGNAME": mainobject.DiagnosisName,
                    "ICD10DIAGDESCRIPTION": mainobject.FullName,
                    "DiagnosisDescription": mainobject.FullName,
                    "CodeSystem": "ICD",
                    /*"StatusList": [],*/
                    "DeleteInd": "N",

                    "LocationId1": 0,
                    "SeverityId1": 0,
                    "Verificationstatusid1": null,
                    "DiagnosisStatus1": "Active",
                    "DiagnosisStatusId1": 2,
                    "EndDate1": null,
                    "StartDate1": null,

                    "LocationId2": 0,
                    "SeverityId2": 0,
                    "Verificationstatusid2": null,
                    "DiagnosisStatus2": "Active",
                    "DiagnosisStatusId2": 2,
                    "EndDate2": null,
                    "StartDate2": null,
                    "IsLocation2Added": false,
                }

                if (mainobject.OrganId == 1) {
                    obj.LocationId1 = 1;
                    obj.Location1 = 'OD';
                    obj.DiagnosisStatusId1 = 2;
                    obj.DiagnosisStatus1 = "Active";
                } else if (mainobject.OrganId == 2) {
                    obj.LocationId2 = 2;
                    obj.Location2 = 'OS';
                    obj.DiagnosisStatusId2 = 2;
                    obj.DiagnosisStatus2 = "Active";
                } else if (mainobject.OrganId == 3) {
                    obj.LocationId1 = 1;
                    obj.LocationId2 = 2;
                    obj.Location1 = 'OD';
                    obj.Location2 = 'OS';
                    obj.DiagnosisStatusId1 = 2;
                    obj.DiagnosisStatus1 = "Active";
                    obj.DiagnosisStatusId2 = 2;
                    obj.DiagnosisStatus2 = "Active";
                    obj.IsLocation2Added = true;
                } else if (mainobject.OrganId == 0) {
                    obj.LocationId1 = 0;
                    obj.Location1 = '';
                } else { }
                $scope.PreAdmCardiologyObj.CardiologistDiagnosis.push(obj);
                $scope.PreAdmCardiologyObj.DiagnosisObject = "";
            }
        }

        $scope.closeuibpopup = function () {
            $uibModalInstance.close("close");
        };

        $scope.ClearDiagnosis = function (item, index) {
            if (item.ConsultationDiagnosisId != 0) {
                item.DeleteInd = "Y";
            } else {
                $scope.PreAdmCardiologyObj.CardiologistDiagnosis.splice(index, 1);
            }
        }

        $scope.pushPrescriptionMedicationDetails = function (obj, type, type1) {
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
                newmedicationobj.TypeId = 3;


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

                        // when showing anesthesia orders separately for display

                        if ($scope.AnesthesiaPrescription.length > 0) {
                            angular.forEach($scope.AnesthesiaPrescription, function (kitem) {
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
                newmedicationobj.TypeId = 3;

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

                // when showing anesthesia orders separately for display

                if ($scope.AnesthesiaPrescription.length > 0) {
                    angular.forEach($scope.AnesthesiaPrescription, function (kitem) {
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

        $scope.Selectedmedic = function (item, val) {
            item.SelectedMedicationHistory = val;
        }

        $scope.EditSigFields = function (item) {
            item.SigFields = !item.SigFields;
            $scope.adnewsigobj.IsNewSig = false;
            item.isEditFocused = true;
            item.isAddFocused = false;

        }

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
                var filteredArray = $filter("filter")($scope.DurationArray, { "MedicineDosaageFieldId": mainitem.DaysSupplyId }, true) || [];
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
                var filteredArray = $filter("filter")($scope.DurationArray, { "MedicineDosaageFieldId": mainitem.DaysSupplyId }, true) || [];
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
            $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
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

        $scope.addSIgNameDynamically = function () {
            var dosesupplytest = "";
            if ($scope.addNewOrganizationSigObj.DaysSupply !== '') {
                dosesupplytest = " for " + $scope.addNewOrganizationSigObj.DaysSupplyDescription;
            }
            $scope.addNewOrganizationSigObj.Sig = $scope.addNewOrganizationSigObj.Action + " " + $scope.addNewOrganizationSigObj.Dose + " " + $scope.addNewOrganizationSigObj.DoseUnit + " " + $scope.addNewOrganizationSigObj.Route + " " + $scope.addNewOrganizationSigObj.Frequency + " " + $scope.addNewOrganizationSigObj.DoseOther + "" + dosesupplytest;
        }

        $scope.addSIgNameDynamicallyAdded = function () {

            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (initem, index) {
                    var dosesupplytest = "";
                    if (initem.DaysSupply !== '') {
                        dosesupplytest = " for " + initem.DaysSupplyDescription || "";
                    }

                    if (initem.DaysSupply !== '') {
                        var filteredArray = $filter("filter")($scope.DurationArray, { "MedicineDosaageFieldId": initem.DaysSupplyId }, true) || [];
                        if (filteredArray.length > 0) {
                            initem.DaysSupply = filteredArray[0].Code;
                            dosesupplytest = " for " + filteredArray[0].Description;
                        }
                    }

                    if (initem.MedicineObj == '') {
                        initem.SigObj = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;
                    } else {
                        initem.MedicineObj = initem.Action + " " + initem.Dose + " " + initem.DoseUnit + " " + initem.Route + " " + initem.Frequency + " " + initem.DoseOther + "" + dosesupplytest;
                    }
                });
            }
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
            var filteredArray = $filter("filter")($scope.DurationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true) || [];
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
            var filteredArray = $filter("filter")($scope.DurationArray, { "MedicineDosaageFieldId": mainobj.DaysSupplyId }, true) || [];
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

        $scope.RemovePrescriptionDetailObj = function (index, item) {
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

        $scope.toggleAddSigFields = function () {
            $scope.showAddSigFields = !$scope.showAddSigFields;

            $scope.showAddSigButton = !$scope.showAddSigButton;
        };

        $scope.getOrganizationMedicationSig = function (text) {
            text = text || '';
            var params = {
                "OrganizationId": $scope.HospitalId,
                "SearchText": text || '',
                "PageSize": 10,
                "PageNumber": 1
            };
            eHnotePatientDataService.GetOrganizationMedicationSigList(params).then(function (resp) {
                console.log(resp);
                if (resp.data.Status == "Success") {
                    $scope.GetOrganizationMedicationSigArrayList = [];
                    $scope.GetOrganizationMedicationSigArrayList = resp.data.rows;
                }
                else if (resp.data.Status == "Failure") {
                    alertify.error("Data Updating Failed");
                }
            });
        };

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
                $scope.getOrganizationMedicationSig();

            }
            function OnAddSigError() {
                alertify.error("Creating  Failed");
            }
        };
        $scope.savedSigs = [];
        $scope.clearOrganizationSiginput = function () {
            $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
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
                "TypeId": 3
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

            // when showing anesthesia orders separately for display

            if ($scope.AnesthesiaInvestigations.length > 0) {
                angular.forEach($scope.AnesthesiaInvestigations, function (kitem) {
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

        $scope.IsOpenInvestigationTemp = function () {
            $scope.IsOpenInvestigation = true;
        }

        $scope.Medicationtemplateover = {
            templateUrl: 'MedicationTemplatSave.html',
        };

        $scope.Investigationtemplateover = {
            templateUrl: 'InvestigationTemplatSave.html',
        };

        $scope.ChangeLocation = function (List, Litem) {
            if (Litem === 1) {
                List.OrganId = List.OrganId || '';
            } else {
                List.OrganId = '';
            }
        }

        $scope.ChangeItem = function (item) {
            item.ShowDateFormat = !item.ShowDateFormat;
        };

        $scope.ChangeDuration = function (item) {
            item.DurationDate = null;
        };

        $scope.ChangeFormatDate = function (item) {
            item.Duration = null;
            item.DurationType = '';
        }

        $scope.CardiologistselectedImgs = function (CardiologistFiles, TypeId) {

            CardiologistFiles = CardiologistFiles || [];
            if (CardiologistFiles.length > 0) {
                angular.forEach(CardiologistFiles, function (item) {
                    CardiologistFiles = item || [];
                    $scope.CardiologistFiles = item;
                    if ($scope.CardiologistFiles != null) {

                        var pName = $scope.CardiologistFiles.name, name = "";
                        var type = $scope.CardiologistFiles.type.split("/")[1];
                        if (pName.length > 9) {
                            name = pName.substring(0, 9) + "..." + "." + type;
                        } else {
                            name = angular.copy(pName) + '.' + type;
                        }

                        let FileTypeId = null;
                        TypeId = TypeId || null;
                        if (TypeId != null) {
                            FileTypeId = TypeId;
                        }

                        var obj = {
                            "file": $scope.CardiologistFiles,
                            "S3URL": "",
                            "DeleteInd": false,
                            "DocumentID": 0,
                            "DocumentName": $scope.CardiologistFiles.name || "",
                            "FileName": $scope.CardiologistFiles.name || "",
                            "FileExt": $scope.CardiologistFiles.type,
                            "FileTypeId": FileTypeId,
                            "DisplayName": $scope.CardiologistFiles.name || ""
                        };

                        $scope.PreAdmCardiologyObj.TempImagesArray.push(obj);


                        angular.element("input[type='file']").val(null);
                    }
                });
            }
        };

        $scope.DeleteUploadedCardiologistFileNew = function (item, index, mainitem) {
            if (item.DocumentID == 0) {
                $scope.PreAdmCardiologyObj.TempImagesArray.splice(index, 1);
            }
        }
        $scope.DeletePreAdmCardiologistDocumentlist = function (item, index, mainitem) {

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
                    $scope.GetPreAdmissionCardiologistDetails();
                }
            }
            function onupdateDelerror(errordata) {
                console.log(errordata);
            }
        }

        $scope.OnSelectPreAdmissionStatus = function (Id) {
            $scope.PreAdmCardiologyObj.CardiologyStatusId = Id;
            if ($scope.PreAdmCardiologyObj.CardiologyStatusId === 1) {
                $scope.PreAdmCardiologyObj.CardiologyStatus = "Approved";
            } else if ($scope.PreAdmCardiologyObj.CardiologyStatusId === 2) {
                $scope.PreAdmCardiologyObj.CardiologyStatus = "Not Fit for Surgery";
            } else {
                $scope.PreAdmCardiologyObj.CardiologyStatus = "Postpone Surgery";
            }
        };


        $scope.init = function () {
            $scope.HealthPhysicalObj = angular.copy($scope.GetPreAdmAnesthetistObj());
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
            if ($scope.cacheStorageItem.AppointmentTypeId === 4 || $scope.cacheStorageItem.AppointmentTypeId === 14) {
                appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
            }
            if ($scope.cacheStorageItem.AppointmentTypeId === 7 || $scope.cacheStorageItem.AppointmentTypeId === 6) {
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
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId,
                "PatientSurgeryId": PatientSurgeryId || null,
            };

            var Req = {
                "ParentOrganizationId": $scope.ParenthospitalId,
            };

            $q.all([
                eHnoteDiagnosisDataServices.GetAllMasterConsultationData(),
                eHnoteSurgeryService.GetPreAdmissionHealthCategories(Req),
                eHnoteSurgeryService.GetPreAdmissionCardiologistDetails(ReqObj),
                eHnoteDiagnosisDataServices.GetMasterCategoryDetails(),

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
                                "IsDiabetes": false,
                                "IsNoshowROS": false,
                                "StatusId": 1,
                                "SeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                                "IsNormal": item.IsNormal
                            };
                            $scope.HealthPhysicalObj.SystemicHistoryArray.push(object);

                        })
                    }
                }
                if (resp[2].data.status === "Success") {


                    if (resp[2].data.AllergyItems.length > 0) {
                        $scope.PreAdmCardiologyObj.AllergyItems = resp[2].data.AllergyItems || [];
                    }
                    if (resp[2].data.CurrentEyeMedicationList.length > 0) {
                        $scope.PreAdmCardiologyObj.CurrentEyeMedications = resp[2].data.CurrentEyeMedicationList || [];
                    }
                    if (resp[2].data.CurrentSystemicMedicationList.length > 0) {
                        $scope.PreAdmCardiologyObj.CurrentSystemicMedicationsHistory = resp[2].data.CurrentSystemicMedicationList || [];
                    }
                    if (resp[2].data.SurgicalHistory.length > 0) {
                        $scope.PreAdmCardiologyObj.SurgicalHistory = resp[2].data.SurgicalHistory || [];
                    }
                    if (resp[2].data.ROSOverAllRemarks  != '') {
                        $scope.PreAdmCardiologyObj.ROSOverAllRemarks = resp[2].data.ROSOverAllRemarks || '';
                    }

                    $scope.Surgeryobj.Investigationslist = resp[2].data.InvestigationsList || [];
                    if ($scope.Surgeryobj.Investigationslist.length > 0) {
                        $scope.Surgeryobj.Investigationslist.forEach(function (item) {
                            item.InvestigationNotes = item.InvestigationNotes || "";
                            if (item.InvestigationNotes != "") {
                                item.IsNoteEdit = true;
                            } else {
                                item.IsNoteEdit = false;
                            }
                            item.DurationDate = item.DurationDate || '';
                            if (item.DurationDate !== '') {
                                item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                                item.ShowDateFormat = true;
                            } else {
                                item.ShowDateFormat = false;
                            }
                        });
                    }


                    resp[2].data.Prescription = resp[2].data.Prescription || [];
                    if (resp[2].data.Prescription.length > 0) {
                        if (resp[2].data.Prescription[0].PrescriptionDetails.length > 0) {
                            $scope.PrescriptionMainAddObj.PatientPrescriptionId = resp[2].data.Prescription[0].PatientPrescriptionId;
                            $scope.PrescriptionMainAddObj.PrescriptionDetails = angular.copy(resp[2].data.Prescription[0].PrescriptionDetails) || [];
                            $scope.PreAdmCardiologyObj.PrescriptionDetails = angular.copy(resp[2].data.Prescription) || [];
                        }
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


                    if (resp[2].data.CardiologistDetails.length > 0) {
                        $scope.PreAdmissionDetails = angular.copy(resp[2].data.CardiologistDetails[0]);
                        let respObj = angular.copy(resp[2].data.CardiologistDetails[0]);


                        if (respObj.MedicineOrdersInstructions != "") {
                            $scope.PreSurgeryIns.MedicineOrdersInstructions = respObj.MedicineOrdersInstructions;
                        } else {
                            $scope.PreSurgeryIns.MedicineOrdersInstructions = '';
                        }

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
                                let formattedVitalAddTime = moment(edate, "YYYY-MM-DD hh:mm").format("hh:mm A");
                                let obj = {
                                    "VitalSummaryId": item.VitalSummaryId,
                                    "AppointmentId": $scope.cacheStorageItem.AppointmentTypeId,
                                    "VitalAddDate": moment(item.VitalAddDate).format("MM-DD-YYYY"),
                                    "VitalAddTime": formattedVitalAddTime,
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
                                        Bitem.ResultId = Aitem.ResultId||null;
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
                                        item.SmokingFromDate = $filter('date')(item.SmokingFromDate, "MM-dd-yyyy");
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

                        $scope.PreAdmCardiologyObj.StatusFlag = $scope.PreAdmissionDetails.StatusFlag;
                        $scope.PreAdmCardiologyObj.CardiologyChartStatus = $scope.PreAdmissionDetails.CardiologyChartStatus;

                        if ($scope.PreAdmissionDetails !== undefined) {

                            $scope.PreAdmCardiologyObj.PreAdmissionId = $scope.PreAdmissionDetails.PreAdmissionId;
                            $scope.PreAdmCardiologyObj.PreAdmissionApptId = $scope.PreAdmissionDetails.AppointmentId;
                            $scope.PreAdmCardiologyObj.PreAdmissionApptDate = $filter('date')($scope.PreAdmissionDetails.AppointmentDate, "MM-dd-yyyy");
                            $scope.PreAdmissionDetails.CardioLogistReviewedBy = $scope.PreAdmissionDetails.CardioLogistReviewedBy || 0;
                            if ($scope.PreAdmissionDetails.CardioLogistReviewedBy != 0) {
                                var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmissionDetails.CardioLogistReviewedBy }, true)[0] || [];
                                $scope.PreAdmCardiologyObj.ReviewByName = ReviewName.FullName || '';
                            }
                            $scope.PreAdmCardiologyObj.ReviewedBy = angular.copy($scope.PreAdmissionDetails.CardioLogistReviewedBy) || null;
                            $scope.PreAdmCardiologyObj.ReviewedDate = $scope.PreAdmissionDetails.CardioLogistReviewedDate || "";
                            //$scope.PreAdmCardiologyObj.ReviewedTime = $scope.PreAdmissionDetails.Reviewedtime || "";

                            $scope.PreAdmCardiologyObj.IsChestPain = $scope.PreAdmissionDetails.IsChestPain;
                            $scope.PreAdmCardiologyObj.PresentIllness = angular.copy($scope.PreAdmissionDetails.Presentillness) || "";
                            if ($scope.PreAdmCardiologyObj.PresentIllness != "") {
                                $scope.PreAdmCardiologyObj.PresentIllnessInd = true;
                            } else {
                                $scope.PreAdmCardiologyObj.PresentIllnessInd = false;
                            }

                            $scope.PreAdmCardiologyObj.Treatment = angular.copy($scope.PreAdmissionDetails.Treatment) || "";
                            if ($scope.PreAdmCardiologyObj.Treatment != "") {
                                $scope.PreAdmCardiologyObj.TreatmentInd = true;
                            } else {
                                $scope.PreAdmCardiologyObj.TreatmentInd = false;
                            }

                            $scope.PreAdmCardiologyObj.CardiologistDiagnosis = angular.copy($scope.PreAdmissionDetails.CardiologistDiagnosis) || [];

                            if ($scope.PreAdmCardiologyObj.CardiologistDiagnosis.length > 0) {
                                angular.forEach($scope.PreAdmCardiologyObj.CardiologistDiagnosis, function (item) {
                                    item.IsLocation2Added = false;
                                    item.LocationId1 = item.LocationId1 || 0;
                                    item.LocationId2 = item.LocationId2 || 0;
                                    if (item.LocationId1 !== 0 && item.LocationId2 !== 0) {
                                        item.IsLocation2Added = true;
                                    }
                                });
                            }

                            $scope.PreAdmCardiologyObj.CardiologyStatus = angular.copy($scope.PreAdmissionDetails.CardiologyStatus);
                            $scope.PreAdmCardiologyObj.CardiologyStatusId = angular.copy($scope.PreAdmissionDetails.CardiologyStatusId) || null;


                            //let tempInvArray = $filter('filter')($scope.PreAdmissionDetails.InvestigationsList, { 'TypeId': 3 }, true);
                            //if (tempInvArray.length > 0) {
                            //    $scope.Surgeryobj.Investigationslist = angular.copy(tempInvArray);
                            //}
                          //  $scope.Surgeryobj.Investigationslist = angular.copy(tempInvArray);

                          //  $scope.Surgeryobj.Investigationslist = $scope.PreAdmissionDetails.InvestigationsList || [];

                           

                           

                            $scope.PreAdmCardiologyObj.InvestigationsList = angular.copy($scope.PreAdmissionDetails.InvestigationsList) || [];
                            $scope.PreAdmCardiologyObj.DocumentDetails = $scope.PreAdmissionDetails.DocumentDetails || [];

                            //$scope.PreAdmissionDetails.Prescription = $scope.PreAdmissionDetails.Prescription || [];
                            //if ($scope.PreAdmissionDetails.Prescription.length > 0) {
                            //    if ($scope.PreAdmissionDetails.Prescription[0].PrescriptionDetails.length > 0) {
                            //        $scope.PrescriptionMainAddObj.PatientPrescriptionId = $scope.PreAdmissionDetails.Prescription[0].PatientPrescriptionId;
                            //        $scope.PrescriptionMainAddObj.PrescriptionDetails = angular.copy($scope.PreAdmissionDetails.Prescription[0].PrescriptionDetails) || [];
                            //        $scope.PreAdmCardiologyObj.PrescriptionDetails = angular.copy($scope.PreAdmissionDetails.Prescription) || [];
                            //    }
                            //}

                            //let tempPrescArray = $filter('filter')($scope.PrescriptionMainAddObj.PrescriptionDetails, { 'TypeId': 3 }, true);
                            //$scope.PrescriptionMainAddObj.PrescriptionDetails = angular.copy(tempPrescArray);

                            //$scope.PrescriptionMainAddObj.PrescriptionDetails = $scope.PrescriptionMainAddObj.PrescriptionDetails||[];

                            //if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                            //    angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (item) {
                            //        item.StartDate = item.StartDate || null;
                            //        item.StopDate = item.StopDate || null;
                            //        if (item.StartDate != null) {
                            //            item.StartDate = moment(item.StartDate).format("MM-DD-YYYY");
                            //        }
                            //        if (item.StopDate != null) {
                            //            item.StopDate = moment(item.StopDate).format("MM-DD-YYYY");
                            //        }
                            //        item.SigObj = item.Sig;
                            //    });
                            //}

                            $scope.HealthPhysicalObj.ECGValue = $scope.PreAdmissionDetails.ECGValue || "";
                            $scope.HealthPhysicalObj.ECGUnits = $scope.PreAdmissionDetails.ECGUnits || "BPM";
                            $scope.HealthPhysicalObj.ECGNotes = $scope.PreAdmissionDetails.ECGNotes || "";

                        }
                    }
                }

                if (resp[3].data.status === "Success") {
                    if (resp[3].data.rows.length > 0) {
                        $scope.TemplateList = [];
                        $scope.TemplateList = angular.copy(resp[3].data.rows);
                    }
                }
            });
        }

        $scope.init();
        $scope.GetPreAdmissionCardiologistDetails = function () {
            let appointmentId;
            if ($scope.cacheStorageItem.AppointmentTypeId === 4 || $scope.cacheStorageItem.AppointmentTypeId === 14) {
                appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
            }
            if ($scope.cacheStorageItem.AppointmentTypeId === 7 || $scope.cacheStorageItem.AppointmentTypeId === 6) {
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

                    /* for scan functionality */
                    if (resp.data.DocumentDetails.length > 0) {
                        $scope.PreAdmCardiologyObj.DocumentDetails = resp.data.DocumentDetails || [];
                    }

                    if (resp.data.CardiologistDetails.length > 0) {
                        $scope.PreAdmissionDetails = angular.copy(resp.data.CardiologistDetails[0]);

                        if ($scope.PreAdmissionDetails !== undefined) {
                            $scope.PreAdmCardiologyObj.DocumentDetails = $scope.PreAdmissionDetails.DocumentDetails || [];
                        }
                    }
                }
            });
        }

      //  $scope.GetPreAdmissionCardiologistDetails();

        $scope.PreAdmCardioSignOff = function () {

            let obj = {
                "Screen": "Cardiology PreAdmission",
                "Type": "SignOff",
                "UserType": "Cardiologist",
                "allUserList": angular.copy($scope.allUserList) || [],
            };

            let signmodalInstance = $uibModal.open({
                "templateUrl": "templates/consultation/SignOffPasswordNew.html",
                "controller": "UsSignOffPasswordPopupCtrl",
                //"size": "md",
                "windowClass": " ",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "obj": function () { return obj; }
                }
            });
            signmodalInstance.result.then(function (resp) {
                $scope.SavePreAdmissionCardioDetails("SignOff");
            }, function (data) {

            });
        };

        $scope.SavePreAdmissionCardioDetails = function (str) {
            let appointmentId;
            appointmentId = $scope.cacheStorageItem.AppointmentId;
            //if ($scope.cacheStorageItem.AppointmentTypeId === 4) {
            //    appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
            //}
            //if ($scope.cacheStorageItem.AppointmentTypeId === 7 || $scope.cacheStorageItem.AppointmentTypeId === 6) {
            //    appointmentId = $scope.cacheStorageItem.AppointmentId;
            //}

            var ReviewedDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");

            let parentApptId;
            if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
                parentApptId = ($scope.cacheStorageItem.PreAdmSurgeryList.length > 0) ? $scope.cacheStorageItem.PreAdmSurgeryList[0].AppointmentId : null;
            } else if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
                parentApptId = ($scope.cacheStorageItem.SurgeryList.length > 0) ? $scope.cacheStorageItem.SurgeryList[0].AppointmentId : null;
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

            $scope.HealthPhysicalObj.LifestyleHistoryArray = $scope.HealthPhysicalObj.LifestyleHistoryArray || [];
            if ($scope.HealthPhysicalObj.LifestyleHistory != undefined) {

                if ($scope.HealthPhysicalObj.LifestyleHistory.PatientDetailId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.SmokingType != "" || $scope.HealthPhysicalObj.LifestyleHistory.Smokinglist.length > 0 ||
                    $scope.HealthPhysicalObj.LifestyleHistory.AlcoholType != "" || $scope.HealthPhysicalObj.LifestyleHistory.AlcoholQuantityId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.AlcoholStatusId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDuration != "" || $scope.HealthPhysicalObj.LifestyleHistory.AlcoholDurationDate != "" ||
                    $scope.HealthPhysicalObj.LifestyleHistory.DrugType != "" || $scope.HealthPhysicalObj.LifestyleHistory.DrugQuantityId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.DrugWhenQuitId != 0 || $scope.HealthPhysicalObj.LifestyleHistory.DrugDuration != "" || $scope.HealthPhysicalObj.LifestyleHistory.DrugDurationDate != "" || $scope.HealthPhysicalObj.LifestyleHistory.DrugArray.length > 0 || $scope.HealthPhysicalObj.LifestyleHistory.Remarks != '' ||  $scope.HealthPhysicalObj.LifestyleHistory.PsychisType != '') {
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


            let reqObj = {
                "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                "PreAdmissionId": $scope.PreAdmCardiologyObj.PreAdmissionId || 0,
                "OrganizationId": $scope.HospitalId || 0,
                "UserId": $scope.UserId,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "AppointmentId": appointmentId || 0,
                "AppointmentDate": $filter('date')($scope.currentDate, "yyyy-MM-dd"),
                "ParentAppointmentId": parentApptId || 0,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId,
                "PatientSurgeryId": PatientSurgeryId,
                "InvestigationsList": [],
                "MedicineOrdersInstructions": $scope.PreSurgeryIns.MedicineOrdersInstructions || "",
                "ReviwedBy": 0,
                "TempDocumentDetails": [],
                "DocumentDetails": [],
                "ConsentFormSignDate": $filter('date')($scope.currentDate, "yyyy-MM-dd"),
                "CardiologyStatusId": $scope.PreAdmCardiologyObj.CardiologyStatusId || null,
                "CardiologyStatus": $scope.PreAdmCardiologyObj.CardiologyStatus || "",
                "CardiologyChartStatus": (str === "SignOff") ? "E" : "D",
                "StatusFlag": $scope.PreAdmCardiologyObj.StatusFlag,
                "ReviewedDate":"",
                "PresentIllness": $scope.PreAdmCardiologyObj.PresentIllness || "",
                "Treatment": $scope.PreAdmCardiologyObj.Treatment || "",
                "PrescriptionArray": [],
                "CardiologistDiagnosis": $scope.PreAdmCardiologyObj.CardiologistDiagnosis || [],
                "IsChestPain": $scope.PreAdmCardiologyObj.IsChestPain,
                "Airway": '',
                "LabNotes": $scope.HealthPhysicalObj.LabNotes || '',
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
                "ECGValue": $scope.HealthPhysicalObj.ECGValue,
                "ECGUnits": $scope.HealthPhysicalObj.ECGUnits,
                "ECGNotes": $scope.HealthPhysicalObj.ECGNotes,
            };

            // filter for only cardiologist orders
            let tempPrescriptionArray = $filter('filter')($scope.PrescriptionMainAddObj.PrescriptionDetails, { 'TypeId': 3 }, true);
            if (tempPrescriptionArray.length > 0) {
                let tempObj = angular.copy($scope.PrescriptionMainAddObj);
                tempObj.PrescriptionDetails = angular.copy(tempPrescriptionArray);
                $scope.PreAdmCardiologyObj.PrescriptionDetails = [];
                $scope.PreAdmCardiologyObj.PrescriptionDetails.push(tempObj);
            } else {
                $scope.PreAdmCardiologyObj.PrescriptionDetails = [];
            }

            //if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length !== 0) {
            //    $scope.PreAdmCardiologyObj.PrescriptionDetails = [];
            //    $scope.PreAdmCardiologyObj.PrescriptionDetails.push($scope.PrescriptionMainAddObj);
            //} else {
            //    $scope.PreAdmCardiologyObj.PrescriptionDetails = [];
            //}

            reqObj.PrescriptionArray = $scope.PreAdmCardiologyObj.PrescriptionDetails || [];

            //reqObj.InvestigationsList = $scope.Surgeryobj.Investigationslist || [];
            let tempInvArray = $filter('filter')($scope.Surgeryobj.Investigationslist, { 'TypeId': 3 }, true);
            reqObj.InvestigationsList = angular.copy(tempInvArray);
            reqObj.ReviwedBy = $scope.PreAdmCardiologyObj.ReviewedBy||null;

            if (reqObj.ReviwedBy == null) {
                reqObj.ReviewedDate = '';
            } else {
                reqObj.ReviewedDate = ReviewedDate || null;
            }
            var tempVital = $filter("filter")($scope.AllVitalsArray, function (kitem, index) { return kitem.Value != '' });

            if (tempVital.length > 0) {
                reqObj.VitalsArray = tempVital;
            } else {
            }

            if ($scope.HealthPhysicalObj.LabList.length > 0) {
                angular.forEach($scope.HealthPhysicalObj.LabList, function (item) {
                    if (item.ResultValue == '' && item.ResultId !== null) {
                        item.DeleteInd = 'Y';
                    }
                });
            }

            var temparray = $filter("filter")($scope.HealthPhysicalObj.LabList, function (kitem, index) { return kitem.ResultValue != '' || kitem.Normal == true || kitem.AbNormal == true || kitem.ResultId != null || kitem.Remarks !== '' });

            if (temparray.length > 0) {
                angular.forEach(temparray, function (item) {
                    item.InvestigationResultDate = $filter('date')(new Date(), "yyyy-MM-dd");;
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
            var temparray1 = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem, index) { return kitem.Value != '' || kitem.PatientDetailId != 0 || kitem.IsChecked == true  });

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



            if ($scope.PreAdmCardiologyObj.TempImagesArray.length > 0) {
                angular.forEach($scope.PreAdmCardiologyObj.TempImagesArray, function (item) {
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

            eHnoteSurgeryService.AddUpdatePreAdmissionCardiologistDetails(reqObj, callbackSuccess, callbackError);
            function callbackSuccess(response) {
                if (response.Status === "Success") {
                    alertify.success("Cardiologist data saved successfully!");
                    $scope.PreAdmCardiologyObj.PreAdmissionId = response.PreAdmissionId;
                    $scope.PreAdmCardiologyObj.IsClosePopUpInd = true;
                    $uibModalInstance.close();
                   // $scope.GetPreAdmissionCardiologistDetails();
                } else {
                    alertify.error("Some Error Occured");
                }               
            };
            function callbackError(err) {
                alertify.error("Uploading Failed");
            }
        };

        $scope.DeletePrescription = function (index,item) {

            item.PatientPrescriptionId = item.PatientPrescriptionId || 0;
            if (item.PatientPrescriptionId != 0) {
                item.DeleteInd = "Y";

                if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                    var Preslist = $filter("filter")($scope.PrescriptionMainAddObj.PrescriptionDetails, { "DeleteInd": "N" }, true);
                    Preslist = Preslist || [];
                    if (Preslist.length === 0) {
                        if ($scope.AnesthesiaPrescription.length==0) {
                            $scope.PrescriptionMainAddObj.DeleteInd = "Y";
                        }
                    }
                }
            } else {
                $scope.PrescriptionMainAddObj.PrescriptionDetails = $scope.PrescriptionMainAddObj.PrescriptionDetails || [];
                if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                    var Prescriptlist = $filter("filter")($scope.PrescriptionMainAddObj.PrescriptionDetails, { "MedicationId": item.MedicationId }, true) || [];
                    if (Prescriptlist.length > 0) {
                        $scope.PrescriptionMainAddObj.PrescriptionDetails.splice(index, 1);
                    }
                    if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length === 0) {
                        $scope.PrescriptionMainAddObj.PrescriptionDetails = [];
                    }
                }
            }
        }

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

        $scope.OnselectInvestNotesTemplates = function (item) {

            item.PatientAscInvestigations = item.PatientAscInvestigations || [];
            if (item.PatientAscInvestigations.length > 0) {
                $scope.Surgeryobj.Investigationslist = item.PatientAscInvestigations;
            } else {
                $scope.Surgeryobj.Investigationslist = [];
            }

            if ($scope.Surgeryobj.Investigationslist.length > 0) {
                angular.forEach($scope.Surgeryobj.Investigationslist, function (item) {
                    if (item.Remarks != '') {
                        item.IsNoteEdit = true;
                        item.InvestigationNotes = item.Remarks;

                    }
                    item.DurationDate = item.DurationDate || null;
                    if (item.DurationDate != null) {
                        item.ShowDateFormat = true;
                        item.DurationDate = $filter("date")(item.DurationDate, "MM-dd-yyyy");
                    }
                });
            }
        }

        $scope.OnselectMedicationNotesTemplates = function (item) {
            console.log(item);
            $scope.PrescriptionMainAddObj.PrescriptionDetails = item.PatientAscMedications || [];

            if ($scope.PrescriptionMainAddObj.PrescriptionDetails.length > 0) {
                angular.forEach($scope.PrescriptionMainAddObj.PrescriptionDetails, function (Citem) {
                    Citem.SigObj = Citem.Sig;
                    Citem.TypeId = 3;
                    var NewDate = new Date();
                    Citem.StartDate = $filter("date")(NewDate, "MM/dd/yyyy");
                    if (Citem.DaysSupplyId != 0) {
                        var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": Citem.DaysSupplyId }, true) || [];
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
                if (doctorinfo.RoleID == 1 || doctorinfo.RoleID == 8 || doctorinfo.RoleID == 30 || doctorinfo.RoleID == 43 || doctorinfo.RoleID == 56 || doctorinfo.RoleID == 57|| doctorinfo.RoleID == 72) {
                    item.DoctorId = doctorinfo.doctorid;
                }
                var vitallist = [];
                var vitallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == doctorinfo.doctorid });
                if (vitallist.length > 0) {
                    item.UserName = angular.copy(vitallist[0].FullName);
                }
            }
            else {
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
        $scope.RomNeckLAT = function (val,item) {
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
                }
                else {
                    item.DrugType = ""
                    item.DrugStatusId = 0;
                    item.DrugDurationDate = null;
                    item.DrugQuantityId = 0;
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
            $scope.cacheStorageItem.AllergyItems = $scope.PreAdmCardiologyObj.AllergyItems || [];
            if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
                let temparray1 = $filter("filter")($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem, index) { return kitem.IsChecked });
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
            $scope.cacheStorageItem.SurgicalHistory = $scope.PreAdmCardiologyObj.SurgicalHistory || [];
            $scope.cacheStorageItem.CurrentEyeMedications = $scope.PreAdmCardiologyObj.CurrentEyeMedications || [];
            $scope.cacheStorageItem.CurrentSystemicMedicationsHistory = $scope.PreAdmCardiologyObj.CurrentSystemicMedicationsHistory || [];

            $scope.cacheStorageItem.ROSOverAllRemarks = $scope.PreAdmCardiologyObj.ROSOverAllRemarks || '';
            var checkInvArray = $filter("filter")($scope.TemplateList, { "CategoryId": 2 }, true);
            var subVisionArray = checkInvArray[0].CategoryDetails;
            subVisionArray = subVisionArray.filter((x) => x.SubCategoryId == 3 || x.SubCategoryId == 4 || x.SubCategoryId == 7 || x.SubCategoryId == 69 || x.SubCategoryId == 73);
            var CategoryList = [];
            CategoryList = subVisionArray || [];
            angular.forEach(CategoryList, function (citem) {
                citem.IsSubCategoryChecked = true;
            });
           
            var ScreenObj = {
                "TypeId": 3,
                "TypeName": 'Cardiologist',
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
                "windowClass": "modal-full-popup  ",
            });
            $scope.modalROSInstance.result.then(function (resp) {
                console.log(resp);

                if (resp.type == "RosHistory") {
                    if (resp.AllergyItems.length != 0) {
                        $scope.PreAdmCardiologyObj.AllergyItems = angular.copy(resp.AllergyItems)|| [];
                    } else {
                        $scope.PreAdmCardiologyObj.AllergyItems = [];
                    }

                    resp.ROSOverAllRemarks = resp.ROSOverAllRemarks || '';
                    if (resp.ROSOverAllRemarks != '') {
                        $scope.PreAdmCardiologyObj.ROSOverAllRemarks = resp.ROSOverAllRemarks;
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
                        let CardiovascularArray = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'TypeId': 1, 'IsChecked': true, 'IsNormal': false }, true);
                        if (CardiovascularArray.length > 0) {
                            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (ritem) {
                                if (ritem.IsNormal == true && ritem.TypeId == 1) {
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
                        /* $scope.HealthPhysicalObj.SystemicHistoryArray = $scope.HealthPhysicalObj.SystemicHistoryArray || [];*/
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                            item.IsChecked = false;
                        });
                    }
                    if (resp.SurgicalHistoryArray.length != 0) {
                        $scope.PreAdmCardiologyObj.SurgicalHistory = angular.copy(resp.SurgicalHistoryArray) || [];
                    } else {
                        /* $scope.PreAdmCardiologyObj.SurgicalHistory = $scope.PreAdmCardiologyObj.SurgicalHistory||[];*/

                        $scope.PreAdmCardiologyObj.SurgicalHistory = [];
                    }
                    if (resp.CurrentEyeMedicationArray.length != 0) {
                        $scope.PreAdmCardiologyObj.CurrentEyeMedications = angular.copy(resp.CurrentEyeMedicationArray) || [];
                    } else {
                        /* $scope.PreAdmCardiologyObj.CurrentEyeMedications = $scope.PreAdmCardiologyObj.CurrentEyeMedications||[];*/

                        $scope.PreAdmCardiologyObj.CurrentEyeMedications = [];
                    }
                    if (resp.CurrentSystemicMedicationsHistory.length != 0) {
                        $scope.PreAdmCardiologyObj.CurrentSystemicMedicationsHistory = angular.copy(resp.CurrentSystemicMedicationsHistory) || [];
                    } else {
                        /* $scope.PreAdmCardiologyObj.CurrentSystemicMedicationsHistory = $scope.PreAdmCardiologyObj.CurrentSystemicMedicationsHistory||[];*/

                        $scope.PreAdmCardiologyObj.CurrentSystemicMedicationsHistory = [];
                    }
                }
              

            }, function () { });
        };


        $scope.CardiologyScanFiles = function (type) {
            $scope.SelectedFile = null;
            if (type == 27) {
                $scope.SelectedFile = 27;
            }
            else if (type == 26) {
                $scope.SelectedFile = 26;
            }
            else if (type == 28) {
                $scope.SelectedFile = 28;
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
                $scope.GetPreAdmissionCardiologistDetails();

            }, function (cancel) {
            });

        }
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
                  //  $scope.init();
                    if (item.DocumentId != 0) {
                        let index = $scope.PreAdmCardiologyObj.DocumentDetails.findIndex(vital => vital.DocumentId === item.DocumentId);
                        if (index !== -1) {
                            $scope.PreAdmCardiologyObj.DocumentDetails.splice(index, 1);
                        }
                    }
                }
            }
            function onupdateDelerror(errordata) {
                console.log(errordata);
            }
        }
        $scope.DeleteUploadedFileNew = function (item, index, mainitem) {
            if (item.DocumentID == 0) {
                $scope.PreAdmCardiologyObj.TempImagesArray.splice(index, 1);
            }
        }
        $scope.onSelectTemperature = function (item, id) {
            if (id == 2) {
                item.UnitTypeName = "°C";
            } else {
                item.UnitTypeName = "°F";
            }
        };


        $scope.OrderTypeObj = {
            "SelectedOrderType": 1
        };

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
                "backdropClass": "",
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
            return item.TypeId !== 1 && item.TypeId !== 2 && item.TypeId !== 3 && item.TypeId !== 5 && item.TypeId !== 6 && item.TypeId !== 7 && item.TypeId !== 8 && item.TypeId !== 9 && item.TypeId !== 10 && item.TypeId !== 11 && item.TypeId !== 12 && item.TypeId !== 16 && item.TypeId !== 17 && item.TypeId !== 21 && item.TypeId !== 18 && item.TypeId !== 19 && item.IsChecked == true;
        };
        $scope.additionalSystemicFilter1 = function (item) {
            // respiratory section and default items shown in systemic history are filtered out here
            return item.HistoryId == 1 && item.IsChecked == true;
        };

        $scope.OpenSystemicNotesPopover = function (obj) {
            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                item.IsPopoverOpen = false;
            });
            obj.IsPopoverOpen = true;
            $scope.PreAdmCardiologyObj.SystemicHistoryPopoverObj = angular.copy(obj);
            $scope.PreAdmCardiologyObj.SystemicHistoryPopoverNotes = obj.Remarks;
        };

        $scope.AddSystemicNotes = function () {
            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                item.TypeId = item.TypeId || null;
                if (item.TypeId != null) {
                    if (item.TypeId == $scope.PreAdmCardiologyObj.SystemicHistoryPopoverObj.TypeId && item.HistoryId == $scope.PreAdmCardiologyObj.SystemicHistoryPopoverObj.HistoryId) {
                        item.Remarks = $scope.PreAdmCardiologyObj.SystemicHistoryPopoverNotes || "";
                        item.IsPopoverOpen = false;
                    }
                }
            });
        };








        $scope.CopyFromAnesthesia = function () {
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

            let ReqObj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": appointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId || 0,
                "PatientSurgeryId": PatientSurgeryId || null,
            };

            eHnoteSurgeryService.GetPatientPreAdmissionDetails(ReqObj).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.HealthPhysicalObj.DrugNames = $scope.HealthPhysicalObj.DrugNames || [];
                    resp.data.LifestyleDetail = resp.data.LifestyleDetail || [];
                    if (resp.data.LifestyleDetail.length > 0) {
                        angular.forEach(resp.data.LifestyleDetail, function (Litem) {
                            $scope.HealthPhysicalObj.LifestyleHistory.PatientDetailId = $scope.HealthPhysicalObj.LifestyleHistory.PatientDetailId || 0;
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

                    if (resp.data.PreAdmissionDetails.length>0) {
                        let respObj = resp.data.PreAdmissionDetails[0];
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
                            //$scope.AllVitalsArray = [];
                            angular.forEach(respObj.Vitals, function (item) {
                                item.Vitals = item.Vitals || [];
                                let subvitals = angular.copy($scope.subVitallist()) || [];
                                angular.forEach(item.Vitals, function (Aitem) {
                                    angular.forEach(subvitals, function (Bitem) {
                                        if (Aitem.VitalId == Bitem.VitalId) {
                                            Bitem.Value = Aitem.Value;
                                            Bitem.AppointmentVitalDataId = 0;
                                            Bitem.UnitTypeId = Aitem.UnitTypeId;
                                            Bitem.UnitTypeName = Aitem.UnitTypeName;
                                        }
                                    });
                                });

                                let ndate = moment().format("YYYY-MM-DD");
                                let edate = ndate + " " + item.VitalAddTime;
                                item.VitalAddTime = moment(edate, "YYYY-MM-DD HH:mm").format("hh:mm A");

                                //item.VitalAddTime = $filter('date')(new Date(), "hh:mm a");

                                if (doctorinfo.RoleID == 1 || doctorinfo.RoleID == 8 || doctorinfo.RoleID == 30 || doctorinfo.RoleID == 43 || doctorinfo.RoleID == 56 || doctorinfo.RoleID == 57 || doctorinfo.RoleID == 72) {
                                    item.DoctorId = doctorinfo.doctorid;
                                }

                                let checkArray = $filter('filter')($scope.AllVitalsArray, { 'VitalAddTime': item.VitalAddTime }, true);

                                if (checkArray.length == 0) {
                                    let obj = {
                                        "VitalSummaryId": 0,
                                        "AppointmentId": $scope.cacheStorageItem.AppointmentTypeId,
                                        "VitalAddDate": $filter('date')(new Date(), 'MM-dd-yyyy'),
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
                                }

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
                                            Bitem.PatientDentitionId = 0;
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

                        respObj.CardioVascular.CardioECG = respObj.CardioVascular.CardioECG || "";
                        respObj.CardioVascular.CardioNotes = respObj.CardioVascular.CardioNotes || "";

                        if (respObj.CardioVascular.CardioECG != "" || respObj.CardioVascular.CardioNotes != "") {
                            $scope.HealthPhysicalObj.ECGValue = respObj.CardioVascular.CardioECG || "";
                            $scope.HealthPhysicalObj.ECGUnits = respObj.CardioVascular.CardioECGUnits || "BPM";
                            $scope.HealthPhysicalObj.ECGNotes = respObj.CardioVascular.CardioNotes || "";
                        }

                    }

                    
                }
            }, function () {

            });
        }

        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }

        $scope.LabInvestNotes = function (item) {
            item.IsNoteEdit = !item.IsNoteEdit;
            item.LabInvestFocus = true;
        }
        $scope.SelectLocation2 = function (item) {
            if (item.LocationId1 == item.LocationId2) {
                item.LocationId2 = 0;
                alertify.error('You already entered this Location');
                return false;
            }
        };
    }]);
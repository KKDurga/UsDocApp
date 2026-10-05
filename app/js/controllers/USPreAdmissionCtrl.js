"use strict";
eHnoteWebApp.controller("USPreAdmissionCtrl", ["$scope", "$rootScope", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteSurgeryService", "eHnoteCacheStorageService", "eHnoteAuditServices", "$uibModal", "eHnoteMainAppointmentService", "eHnoteDiagnosisDataServices", "datapersistanceFactory", "eHnotePatientDataService", "$q", "eHnoteSettingsDataService","USPrintService",
    function ($scope, $rootScope, $filter, alertify, eHnoteMasterDataService, eHnoteSurgeryService, eHnoteCacheStorageService, eHnoteAuditServices, $uibModal, eHnoteMainAppointmentService, eHnoteDiagnosisDataServices, datapersistanceFactory, eHnotePatientDataService, $q, eHnoteSettingsDataService, USPrintService) {

        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        // on page refresh, for preadmin tab to be displayed
        var appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
        appointmentInfo.AppointmentTypeId = 7;
        eHnoteMasterDataService.addAppointmentInfo(appointmentInfo);

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.LoginUserRoleID = doctorinfo.RoleID;
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        $scope.SelectedFile = 17;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        };

        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

        $scope.AddToCache = function () {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        };
        $scope.PreAdmAnesthetistObj.IsAdvanceAnestInd = false;
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
                "Others": "",
                "IsShowLabTestName": false,
            };
        };

        $scope.AirwayObj = {
            "IsNormal": false,
            "ROMTMS": "",
            "ROMNECKAP": "",
            "ROMNECKLAT": "",
            "Class": "",
            "Notes": ""
        };

        $scope.CardioVascularObj = {
            "Systolic": "",
            "Diastolic": "",
            "PR": "",
            "ECG": "",
            "ECGUnits": "",
            "Notes": "",
            "BPlevel": "",
        };

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
                "AnesthesiologistId":null

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
                "LastSignOffUserDetails":[],
                "PreviousAnesthetics":[],
            };
        };
        $scope.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());


        $scope.PreAdmObj = {
            "PreAdmissionId": 0,
            "OrganizationId": $scope.HospitalId || 0,
            "UserId": $scope.UserId,
            "PatientId": $scope.cacheStorageItem.PatientID || 0,
            "AppointmentId": $scope.cacheStorageItem.SelectedAppointmentId || 0,
            "ParentAppointmentId": null,
            "Vitals": [],
            "VitalsArray": [],
            "SystemicHistory": [],
            "AllergyItems": [],
            "SurgicalHistory": [],
            "CurrentSystemicMedicationsHistory": [],
            "CurrentEyeMedications": [],
            "LabArray": [],
            "LabNotes": "",
            "Airway": "",
            "CardioVascular": "",
            "Health": "",
            "PrevAnesthesia": "",
            "AssessmentsASA": "",
            "AnesthesiaPlan": "",
            "PreAdmissionStatusId": null,
            "AnesthesiaPlan": "",
            "PreAdmissionChartStatus": "D",
            "StatusFlag": "D",
            "IsShow": false,
            "IsEdit": false,
            "IsShowPreAdmissionSummaryView": false,
            "PreAdmissionStatusId": null,
            "InvestigationsList": [],
            "MedicineOrdersList": [],      
            "DocumentDetails": [],
            "ROSOverAllRemarks": "",
            "LabInvestigation": "",
            "LastSignOffUserDetails": [],
            "LifestyleDetail": [],
            "PreAdmission": "",
            "PatientData": "",
            "IsAirwayData": false,
            "IsLabInvestigationEmptyShowInd": false
        };

        $scope.PatientDetailsObj = {
            "PatientId": 0,
            "FullName": "",
            "Mobile": "",
            "DisplayId": "",
            "Gender": "",
            "Age": "",
            "S3URL": "",
            "ExternalCoManager": "",
            "InternalCoManager": "",
            "PCP": "",
            "InsuranceDetails": [],
            "Allergies": []
        };

        $scope.SurgeryDiagnosisObj = {
            "Diagnosis": "",
            "DiagnosisId": null,
            "OrganizationDiagnosisId": null,
            "OrganizationSurgeryId": null,
            "SurgeryId": null,
            "SurgeryDate": "",
            "OperativeProcedure": "",
            "Surgeon": "",
            "SelectedSurgery": "",
            "DiagnosisList": [],
            "HeightUnitName": "",
            "WeightUnitName": "",
        };

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

        $scope.AnethesiaOtherSystemsArrayList = [
            {
                "DescriptionId": 1,
                "Description": "Diabetes",
                "IsChecked": null,
                "Remarks": "",
            },
            {
                "DescriptionId": 2,
                "Description": "Liver Disease",
                "IsChecked": null,
                "Remarks": "",
            },
            {
                "DescriptionId": 3,
                "Description": "Inf. Disease",
                "IsChecked": null,
                "Remarks": "",
            },
            {
                "DescriptionId": 4,
                "Description": "Allergies",
                "IsChecked": null,
                "Remarks": "",
            }
        ];

        $scope.GetPreAdmSummaryObj = function () {
            var obj = {
                "IsPreadmVitalsInd": true,
                "IsPreAdmROSMainInd": true,
                "IsPrAdmROSSystemicInd": true,
                "IsPrAdmROSSurgicalInd": true,
                "IsPrAdmROSAllergiesInd": true,
                "IsPreAdmEvaluationMainInd": true,
                "IsPrAdmEvaluationLabInd": true,
                "IsPrAdmEvaluationCardioInd": true,
                "IsPrAdmEvaluationAirwayInd": true,
                "IsPreAdmChecklistMainInd": true,
                "IsPreAdmChecklistHealthPlanInd": true,
                "IsPreAdmPreSurgeryOrdersMainInd": true,
                "IsPreAdmPreSurgeryMedicationsInd": true,
                "IsPreAdmCurrentMedicationsInd": true,
                "IsPreAdmLabsInvestigationsInd": true,
                "IsPreAdmAnesthetistPlanMainInd": true,
                "IsPreAdmPreviousAnestheticInd": true,
                "IsPreAdmAssessmentASAInd": true,
                "IsPreAdmAnestheticPlanInd": true,
                "IsPrAdmPreviousInd": true,
                "IsPrAdmAssessmentInd": true,
                "IsPrAdmAssPlanInd": true,
            }
            return obj;
        }

        $scope.PreAdmissionSummaryObj = $scope.GetPreAdmSummaryObj();
        $scope.PreAdmissionSummaryObj1 = $scope.GetPreAdmSummaryObj();

        $scope.GetPreAdmAnesthetistObj = function () {
            return {
                "PreAdmissionId": 0,
                "OrganizationId": $scope.HospitalId || 0,
                "UserId": $scope.UserId,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "AppointmentId": $scope.cacheStorageItem.SelectedAppointmentId || 0,
                "ParentAppointmentId": null,
                "PreAdmissionApptId": null,
                "PreAdmissionApptDate": "",
                "Vitals": [],
                "SystemicHistory": [],
                "AllergyItems": [],
                "SurgicalHistory": [],
                "LabArray": [],
                "Airway": "",
                "CardioVascular": "",
                "HealthArray": angular.copy($scope.HealthArray),
                "PrevAnesthesia": "",
                "AssessmentsASA": "",
                "AnesthesiaPlan": "",
                "PreAdmissionStatusId": null,
                "AnesthesiaPlan": "",
                "PreAdmissionChartStatus": "D",
                "StatusFlag": "D",
                "IsShow": false,
                "IsEdit": false,
                "IsShowPreAdmissionSummaryView": false,
                "PreAdmissionStatusId": null,
                "LabObj": "",
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
                "APAnesthesiaOptionsObj": "",
                "ASAObj": {
                    "Value": "",
                    "Notes": "",
                    "EValue":"",
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
                "IsCXR": "",
                "CXRHistory": "",
                "PrescriptionDetails": [],
                "CurrentSystemicMedicationsHistory": [],
                "AppointmentID": $scope.cacheStorageItem.AppointmentId,
                "CardioVascularObjNotesInd": false,
                "MedicineOrdersInstructions": '',
                "AnesthesiaReviewedName": '',
                "AnesthesiologistReviewedName":'',
            };
        };

        $scope.PreAdmAnesthetistObj = angular.copy($scope.GetPreAdmAnesthetistObj());

        $scope.GetPreAdmCardioPopupSummaryObj = function () {
            return {
                "PresentIllness": "",
                "IsShowCardiologySummarydata": false,
                "PreAdmissionId": 0,
                "OrganizationId": $scope.HospitalId || 0,
                "UserId": $scope.UserId,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "AppointmentId": $scope.cacheStorageItem.SelectedAppointmentId || 0,
                "ParentAppointmentId": null,
                "PreAdmissionApptId": null,
                "PreAdmissionApptDate": "",
                "CardiologyStatusId": null,
                "PreAdmissionChartStatus": "D",
                "IsShowPreAdmissionSummaryView": false,
                "InvestigationsList": [],
                "ReviewedBy": null,
                "AscAppointmentId": null,
                "AscAppointmentDate": "",
                "Treatment": "",
                "PrescriptionDetails": [],
                "CardiologistDiagnosis": [],
                "TempImagesArray": [],
                "DocumentDetails": [],
                "IsChestPain": null,
                "AppointmentID": $scope.cacheStorageItem.AppointmentId,
                "IsAdvanceCardInd": false,
                "IsReviewedbyInd": false,
                "ReviewByName": "",
            };
        };

        $scope.PreAdmCardioPopupSummaryObj = angular.copy($scope.GetPreAdmCardioPopupSummaryObj());

        // select default surgery -> first in the list
        $scope.PreAdmSurgeryList = $scope.cacheStorageItem.PreAdmSurgeryList || [];
        if ($scope.PreAdmSurgeryList.length > 0) {
            $scope.SurgeryDiagnosisObj.SelectedSurgery = $scope.PreAdmSurgeryList[0];
        }

        $scope.SelectPatient = function () {
            let patientId = $scope.cacheStorageItem.PatientID || 0;
            eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
            function ongetPatientDetailsSuccess(data) {
                if (data !== undefined) {
                    var patientitem = data;

                    $scope.PatientDetailsObj.PatientId = patientitem.Patient[0].PatientID;
                    $scope.PatientDetailsObj.FullName = patientitem.Patient[0].FullName;
                    $scope.PatientDetailsObj.DisplayId = patientitem.Patient[0].PatientDisplayId;
                    $scope.PatientDetailsObj.Gender = patientitem.Patient[0].Gender;
                    $scope.PatientDetailsObj.Mobile = patientitem.Patient[0].AltCountryCode + '-' + patientitem.Patient[0].Altareacode + '-' + patientitem.Patient[0].PatientHomeNumber;
                    $scope.PatientDetailsObj.Age = patientitem.Patient[0].AgeInYears + 'Y' + ' ' + patientitem.Patient[0].AgeInMonths + 'M';

                    $scope.PatientDetailsObj.ExternalCoManager = "";
                    $scope.PatientDetailsObj.InternalCoManager = "";
                    $scope.PatientDetailsObj.PCP = patientitem.Patient[0].AdditionalInfo.PCPName;
                    $scope.PatientDetailsObj.S3URL = patientitem.Patient[0].S3URL;

                    $scope.PatientDetailsObj.Allergies = angular.copy(patientitem.PatientAllergies);

                    $scope.PatientDetailsObj.AddressLine1 = angular.copy(patientitem.PatientAddress.PermanentAddress.AddressLine1) || "";
                    $scope.PatientDetailsObj.AddressLine2 = angular.copy(patientitem.PatientAddress.PermanentAddress.AddressLine2) || "";
                    $scope.PatientDetailsObj.InsuranceDetails = angular.copy(patientitem.patientInsuranceDetails);
                }
            }
            function ongetPatientDetailsError(error) {
                console.log(error);
            }
        }

        $scope.AddToCache = function () {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        };

        $scope.UserDefineActiveTab = function () {
            if ($scope.LoginUserRoleID == 72) {
                $scope.NavObj.IsAnesthetistEvaluationTab = false;
                $scope.NavObj.IsAnesthetistPlanTab = false;
                $scope.NavObj.IsCardioEvaluationTab = true;
            }
            else {
                $scope.NavObj.IsAnesthetistEvaluationTab = true;
                $scope.NavObj.IsAnesthetistPlanTab = true;
                $scope.NavObj.IsCardioEvaluationTab = false;
            }
        }

        $scope.ClinicalChecklistParentObj = {
            "ClinicalChecklist": [],
            "IsAllClinicalCheckListChecked": '',
            "ClinicalChecklistTemplates": [],
            "MedicineChecklistTemplates": [],
            "SelectedClinicalChecklistTemplate": "",
            "AdmissionRemarks": "",
            "CheckListRemarks": "",
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
        $scope.init = function () {

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
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId || 0,
                "PatientSurgeryId": PatientSurgeryId || null,
            };

            let trackerReq = {
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
            };

            eHnoteMainAppointmentService.GetASCLatestTrackerStatusById(trackerReq).then(function (resp) {
                if (resp.data.Status === "Success") {
                    if (resp.data.rows.length > 0) {
                        if (resp.data.rows[0].RoomTypeId != 23) {
                            $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                            let params = {
                                "UserId": eHnoteMasterDataService.getLoginId(),
                                "HospitalId": $scope.HospitalId,
                                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                                "ASCAppointmentTrackerDetailId": 0,
                                "RoleId": $scope.RoleId,
                                "DoctorId": null,
                                "DoctorRoleId": null,
                                "RoomTypeId": 23,
                                "RoomId": null,
                                "Remarks": '',
                                "CurrentTime": $scope.CurrentTime,
                                "IsSendTo": "Y",
                                "IsCheckedIn": "N",
                                "IsCheckedOut": "N",
                                "IsReCheckIn": "N",
                                "IsReCheckOut": "N"
                            }
                            eHnoteMainAppointmentService.AddUpdateASCAppointmentTrackerDetails(params).then(function (resp) {
                                if (resp.data.Status === "Success") {
                                    $scope.cacheStorageItem.RoomTypeId = 23;
                                    $scope.AddToCache();
                                }
                            });
                        }
                    }
                }
            }, function () {

            });

            let obj = {
                "AppointmentID": $scope.cacheStorageItem.AppointmentId,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId
            };
            let req3 = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId
            };
            let Object = {
                "ParentOrganizationId": $scope.ParentHospitalId,
                "CheckListModuleId": 1
            };


            let CheckObj = {
                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
            };

            $q.all([
                eHnoteSurgeryService.GetPatientPreAdmissionDetails(ReqObj),
               // eHnoteSurgeryService.GetPreAdmissionCardiologistDetails(ReqObj),
              //  eHnoteSurgeryService.GetOTQuickAccessDetails(req3),
                //eHnoteSurgeryService.GetOrganizationASCCheckListData(Object),
                //eHnoteSurgeryService.GetPreAdmissionChecklistDetails(CheckObj.AppointmentId)
            ]).then(function (resp) {

                if (resp[0].data.status === "Success") {
                    if (resp[0].data.LastSignOffUserDetails.length > 0) {
                        $scope.PreAdmObj.LastSignOffUserDetails = resp[0].data.LastSignOffUserDetails || [];
                    } else {
                        $scope.PreAdmObj.LastSignOffUserDetails = [];
                    }

                    if (resp[0].data.AllergyItems.length > 0) {
                        $scope.PreAdmObj.AllergyItems = resp[0].data.AllergyItems || [];
                    } else {
                        $scope.PreAdmObj.AllergyItems = [];
                    }
                    if (resp[0].data.CurrentEyeMedicationList.length > 0) {
                        $scope.PreAdmObj.CurrentEyeMedications = resp[0].data.CurrentEyeMedicationList || [];
                    } else {
                        $scope.PreAdmObj.CurrentEyeMedications = [];
                    }
                    if (resp[0].data.CurrentSystemicMedicationList.length > 0) {
                        $scope.PreAdmObj.CurrentSystemicMedicationsHistory = resp[0].data.CurrentSystemicMedicationList || [];
                    } else {
                        $scope.PreAdmObj.CurrentSystemicMedicationsHistory = [];
                    }
                    if (resp[0].data.SurgicalHistory.length > 0) {
                        $scope.PreAdmObj.SurgicalHistory = resp[0].data.SurgicalHistory || [];
                    } else {
                        $scope.PreAdmObj.SurgicalHistory = [];
                    }
                    if (resp[0].data.ROSOverAllRemarks != '') {
                        $scope.PreAdmObj.ROSOverAllRemarks = resp[0].data.ROSOverAllRemarks || '';
                    } else {
                        $scope.PreAdmObj.ROSOverAllRemarks = '';
                    }

                    $scope.PreAdmObj.MedicineOrdersList = angular.copy(resp[0].data.Prescription)||[];
                    $scope.PreAdmObj.InvestigationsList = angular.copy(resp[0].data.InvestigationsList) || [];
                    $scope.PreAdmAnesthetistObj.DocumentDetails = angular.copy(resp[0].data.DocumentDetails) || [];
                    $scope.PreAdmObj.LifestyleDetail = angular.copy(resp[0].data.LifestyleDetail) || [];

                    if (resp[0].data.PreAdmissionDetails.length > 0) {
                        let respObj = resp[0].data.PreAdmissionDetails[0];

                        if (respObj.Vitals.length > 0) {
                            $scope.PreAdmObj.Vitals = angular.copy(respObj.Vitals);

                        }
                        if (respObj.SystemicHistory.length > 0) {
                            $scope.PreAdmObj.SystemicHistory = angular.copy(respObj.SystemicHistory);
                        }
                        if (respObj.LabInvestigation.length > 0) {
                            $scope.PreAdmObj.LabInvestigation = angular.copy(respObj.LabInvestigation);
                        }
                        //if (respObj.LifestyleDetail.length > 0) {
                        //    $scope.PreAdmObj.LifestyleDetail = angular.copy(respObj.LifestyleDetail);
                        //}

                        $scope.PreAdmObj.LabNotes = respObj.LabNotes || '';
                        $scope.PreAdmObj.Airway = angular.copy($scope.AirwayObj);

                        $scope.PreAdmObj.Airway.IsNormal = respObj.Airway.IsNormal || false;
                        $scope.PreAdmObj.Airway.ROMTMS = respObj.Airway.ROMTMS || '';
                        $scope.PreAdmObj.Airway.ROMNECKAP = respObj.Airway.ROMNECKAP || '';
                        $scope.PreAdmObj.Airway.ROMNECKLAT = respObj.Airway.ROMNECKLAT || '';
                        $scope.PreAdmObj.Airway.Class = respObj.Airway.Class || '';

                        $scope.PreAdmObj.Airway.DentitionList = respObj.Airway.DentitionList || [];
                        $scope.PreAdmObj.Airway.Dentition = respObj.Airway.Dentition || '';

                        $scope.PreAdmObj.Airway.Notes = respObj.Airway.Notes || '';
                        $scope.PreAdmObj.Airway.ChemistryNotes = respObj.Airway.ChemistryNotes || '';

                        if ($scope.PreAdmObj.Airway.ROMTMS == '' && $scope.PreAdmObj.Airway.ROMNECKAP == '' && $scope.PreAdmObj.Airway.ROMNECKLAT == '' && $scope.PreAdmObj.Airway.Class == '' && $scope.PreAdmObj.Airway.DentitionList.length == 0 && $scope.PreAdmObj.Airway.Dentition == '' && $scope.PreAdmObj.Airway.Notes == '') {
                            $scope.PreAdmObj.IsAirwayData = true;
                        } else {
                            $scope.PreAdmObj.IsAirwayData = false;
                        }

                        //submit record identity
                        $scope.PreAdmAnesthetistObj.PreAdmissionId = respObj.PreAdmissionId || null;

                        if (respObj.PreviousAnesthetics.length > 0) {
                            $scope.PrevAnestheticsObj.PreviousAnesthetics = respObj.PreviousAnesthetics || [];
                        }
                        else {
                            $scope.PrevAnestheticsObj.PreviousAnesthetics = [];
                        }
                        $scope.PrevAnestheticsObj.PreAdmissionChartStatus = respObj.PreAdmissionChartStatus || "";

                        if ($scope.PreAdmObj.LabInvestigation.length > 0) {
                            let FiterArray = $filter('filter')($scope.PreAdmObj.LabInvestigation, function (item) {
                                return item.ResultValue != '' || item.Normal || item.AbNormal || item.Remarks !== '';
                            });
                            if (FiterArray.length == 0) {
                                $scope.PreAdmObj.IsLabInvestigationEmptyShowInd = true;
                            } else {
                                $scope.PreAdmObj.IsLabInvestigationEmptyShowInd = false;
                            }
                        } else {
                            $scope.PreAdmObj.IsLabInvestigationEmptyShowInd = true;
                        }
                        // previous anesthesia section
                        //$scope.PrevAnestheticsObj.IsComplications = respObj.PrevAnesthesia.IsComplications;
                        //$scope.PrevAnestheticsObj.IsPrevAnesthesia = respObj.PrevAnesthesia.IsPrevAnesthesia;
                        //$scope.PrevAnestheticsObj.IsFamilyHistory = respObj.PrevAnesthesia.IsFamilyHistory;
                        //$scope.PrevAnestheticsObj.IsDifficultAirway = respObj.PrevAnesthesia.IsDifficultAirway;
                        //$scope.PrevAnestheticsObj.IsPONV = respObj.PrevAnesthesia.IsPONV;
                        //$scope.PrevAnestheticsObj.IsPatientDNR = respObj.PrevAnesthesia.IsPatientDNR;
                        //$scope.PrevAnestheticsObj.IsSuspend = respObj.PrevAnesthesia.IsSuspend;
                        //$scope.PrevAnestheticsObj.IsContinue = respObj.PrevAnesthesia.IsContinue;
                        //$scope.PrevAnestheticsObj.Notes = respObj.PrevAnesthesia.Notes || "";


                        //if ($scope.PrevAnestheticsObj.Notes != "") {
                        //    $scope.PreAdmAnesthetistObj.PrevAnestheticsObjNotesInd = true;
                        //} else {
                        //    $scope.PreAdmAnesthetistObj.PrevAnestheticsObjNotesInd = false;
                        //}

                        if (respObj.MedicineOrdersInstructions != "" && respObj.MedicineOrdersInstructions != null) {
                            $scope.PreAdmAnesthetistObj.MedicineOrdersInstructions = respObj.MedicineOrdersInstructions;
                        } else {
                            $scope.PreAdmAnesthetistObj.MedicineOrdersInstructions = '';
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
                            if (item.AnesthesiaTypeId === 4 && item.IsSelected) {
                                $scope.APAnesthesiaOptionsObj.IsRegionalAnesthesia = true;
                            }
                            if (item.AnesthesiaTypeId === 5 && item.IsSelected) {
                                $scope.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia = true;
                            }
                            if (item.AnesthesiaTypeId === 6 && item.IsSelected) {
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
                        $scope.APAnesthesiaOptionsObj.AnesthetistId = respObj.AnesthesiaPlan.AnesPlanAnesthetistId || null;

                        $scope.APAnesthesiaOptionsObj.AnesthesiologistId = respObj.AnesthesiaPlan.AnesthesiologistId || null;


                        if ($scope.APAnesthesiaOptionsObj.AnesthetistId != null) {
                            let tempArray = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.APAnesthesiaOptionsObj.AnesthetistId }, true);
                            if (tempArray.length > 0) {
                                //$scope.APAnesthesiaOptionsObj.AnesthetistName = tempArray[0].FullName;

                                var SuffixName = '';
                                tempArray[0].SuffixName = tempArray[0].SuffixName || '';
                                if (tempArray[0].SuffixName != "") {
                                    SuffixName = tempArray[0].FullName + ' ' + tempArray[0].SuffixName + ',';
                                } else {
                                    SuffixName = tempArray[0].FullName + ',';
                                }

                                var LicenseNumber = "";

                                tempArray[0].LicenseNumber = tempArray[0].LicenseNumber || "";
                                if (tempArray[0].LicenseNumber != "") {
                                    LicenseNumber = 'Lic:' + ' ' + tempArray[0].LicenseNumber+',';
                                }


                             
                                if (tempArray[0].SuffixId == 10) {
                                    $scope.APAnesthesiaOptionsObj.AnesthetistName = angular.copy('Dr. '+ SuffixName + ' ' + LicenseNumber);
                                } else {
                                    $scope.APAnesthesiaOptionsObj.AnesthetistName = angular.copy(SuffixName + ' ' + LicenseNumber);
                                }

                            }
                        }


                        $scope.APAnesthesiaOptionsObj.AnesthesiologistName = '';

                        if ($scope.APAnesthesiaOptionsObj.AnesthesiologistId != null) {
                            let tempArray = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.APAnesthesiaOptionsObj.AnesthesiologistId }, true);
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
                                $scope.APAnesthesiaOptionsObj.AnesthesiologistName = tempArray[0].UserFullName + ' ' + LicenseNumber;

                                //if (tempArray[0].SuffixId == 10) {
                                //    $scope.APAnesthesiaOptionsObj.AnesthesiologistName = 'Dr. ' + tempArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                                //} else {
                                //    $scope.APAnesthesiaOptionsObj.AnesthesiologistName = tempArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                                //}


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
                        //Assessment ASA "E" section
                        $scope.PreAdmAnesthetistObj.ASAObj.EValue = respObj.AssessmentsASA.EValue || "";
                        $scope.PreAdmAnesthetistObj.ASAObj.ENotes = respObj.AssessmentsASA.ENotes || "";
                        $scope.PreAdmAnesthetistObj.ASAClassificationNotes = respObj.ASAClassificationNotes || "";
                        // prescription and investigations

                        //$scope.PreAdmAnesthetistObj.PrescriptionDetails = angular.copy(respObj.Prescription);
                        //$scope.PreAdmAnesthetistObj.Investigationslist = angular.copy(respObj.InvestigationsList);

                        //$scope.PreAdmObj.MedicineOrdersList = angular.copy(respObj.Prescription);
                        //$scope.PreAdmObj.InvestigationsList = angular.copy(respObj.InvestigationsList);


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
                                SuffixName = ReviewName.FullName + ' ' + ReviewName.SuffixName + ',';
                            }
                            else {
                                SuffixName = ReviewName.FullName + ',';
                            }

                            var LicenseNumber = "";

                            ReviewName.LicenseNumber = ReviewName.LicenseNumber || "";
                            if (ReviewName.LicenseNumber != "") {
                                LicenseNumber = 'Lic:' + ' ' + ReviewName.LicenseNumber+',';
                            }                       
                         


                            if (ReviewName.SuffixId == 10) {
                                $scope.PreAdmAnesthetistObj.AnesthesiaReviewedName = angular.copy('Dr. '+ SuffixName + ' ' + LicenseNumber);
                            } else {
                                $scope.PreAdmAnesthetistObj.AnesthesiaReviewedName = angular.copy( SuffixName + ' ' + LicenseNumber);
                            }

                        } else {
                            $scope.PreAdmAnesthetistObj.AnesthesiaReviewedName = "";
                        }



                        if ($scope.PreAdmAnesthetistObj.AnesthesiologistReviewedBy != null) {
                            var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedBy }, true)[0] || [];
                          


                            //var SuffixName = '';
                            //ReviewName.SuffixName = ReviewName.SuffixName || '';
                            //if (ReviewName.SuffixName != "") {
                            //    SuffixName = ReviewName.SuffixName;
                            //}

                            var LicenseNumber = "";

                            ReviewName.LicenseNumber = ReviewName.LicenseNumber || "";
                            if (ReviewName.LicenseNumber != "") {
                                LicenseNumber = 'LIC :' + ' ' + ReviewName.LicenseNumber;
                            }
                            $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedName = angular.copy(ReviewName.UserFullName + ' ' + LicenseNumber);

                            //if (ReviewName.SuffixId == 10) {
                            //    $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedName = angular.copy('Dr. ' + ReviewName.FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            //} else {
                            //    $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedName = angular.copy(ReviewName.FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            //}

                        } else {
                            $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedName = "";
                        }

                        $scope.PreAdmAnesthetistObj.ReviewedDate = respObj.AnesthesiaReviewedDate || "";

                        $scope.PreAdmAnesthetistObj.ReviewedDate = $filter('date')($scope.PreAdmAnesthetistObj.ReviewedDate, 'MM-dd-yyyy hh:mm a') || "";

                        //$filter('date')($scope.CardiologyPopupDetails.CardioLogistReviewedDate, 'MM-dd-yyyy hh:mm a') || "";

                        // documents
                        //$scope.PreAdmAnesthetistObj.DocumentDetails = angular.copy(respObj.DocumentDetails);

                        respObj.CardioVascular = respObj.CardioVascular || null;
                        if (respObj.CardioVascular != null) {
                            $scope.PreAdmAnesthetistObj.CardioVascularObj.ECG = respObj.CardioVascular.CardioECG || "";
                            $scope.PreAdmAnesthetistObj.CardioVascularObj.ECGUnits = respObj.CardioVascular.CardioECGUnits || "";
                            $scope.PreAdmAnesthetistObj.CardioVascularObj.Notes = respObj.CardioVascular.CardioNotes || "";
                        }

                    }
                    else {  // for showing the no data added
                        $scope.PreAdmAnesthetistObj.DocumentDetails = [];
                        $scope.PreAdmObj.IsLabInvestigationEmptyShowInd = true;
                        $scope.PreAdmObj.IsAirwayData = true;
                        $scope.PreAdmAnesthetistObj.PreAdmissionStatus = "";
                    }
                }

                //if (resp[1].data.status === "Success") {

                //    if (resp[1].data.LastSignOffUserDetails.length > 0) {
                //        $scope.PreAdmCardioPopupSummaryObj.LastSignOffUserDetails = angular.copy(resp[1].data.LastSignOffUserDetails) || [];
                //    }

                //    if (resp[1].data.CardiologistDetails.length > 0) {
                //        $scope.CardiologyPopupDetails = angular.copy(resp[1].data.CardiologistDetails[0]);

                //        $scope.PreAdmCardioPopupSummaryObj.StatusFlag = $scope.CardiologyPopupDetails.StatusFlag;
                //        $scope.PreAdmCardioPopupSummaryObj.CardiologyChartStatus = $scope.CardiologyPopupDetails.CardiologyChartStatus;

                //        if ($scope.CardiologyPopupDetails !== undefined) {

                //            $scope.PreAdmCardioPopupSummaryObj.PreAdmissionId = $scope.CardiologyPopupDetails.PreAdmissionId;
                //            $scope.PreAdmCardioPopupSummaryObj.PreAdmissionApptId = $scope.CardiologyPopupDetails.AppointmentId;
                //            $scope.PreAdmCardioPopupSummaryObj.PreAdmissionApptDate = $filter('date')($scope.CardiologyPopupDetails.AppointmentDate, "MM-dd-yyyy");
                //            $scope.CardiologyPopupDetails.CardioLogistReviewedBy = $scope.CardiologyPopupDetails.CardioLogistReviewedBy || 0;
                //            if ($scope.CardiologyPopupDetails.CardioLogistReviewedBy != 0) {
                //                var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.CardiologyPopupDetails.CardioLogistReviewedBy }, true)[0] || [];
                //                $scope.PreAdmCardioPopupSummaryObj.ReviewByName = ReviewName.FullName || '';
                //            } else {
                //                $scope.PreAdmCardioPopupSummaryObj.ReviewByName = "";
                //            }
                //            $scope.PreAdmCardioPopupSummaryObj.ReviewedDate = $scope.CardiologyPopupDetails.CardioLogistReviewedDate || "";
                //            $scope.PreAdmCardioPopupSummaryObj.ReviewedTime = $scope.CardiologyPopupDetails.Reviewedtime || "";

                //            $scope.PreAdmCardioPopupSummaryObj.PresentIllness = angular.copy($scope.CardiologyPopupDetails.Presentillness).replace(/\n/g, '<br>');

                //            $scope.PreAdmCardioPopupSummaryObj.Treatment = angular.copy($scope.CardiologyPopupDetails.Treatment).replace(/\n/g, '<br>');
                //            $scope.PreAdmCardioPopupSummaryObj.IsChestPain = $scope.CardiologyPopupDetails.IsChestPain;

                //            $scope.PreAdmCardioPopupSummaryObj.CardiologistDiagnosis = angular.copy($scope.CardiologyPopupDetails.CardiologistDiagnosis) || [];
                //            $scope.PreAdmCardioPopupSummaryObj.CardiologyStatus = angular.copy($scope.CardiologyPopupDetails.CardiologyStatus) || "";
                //            $scope.PreAdmCardioPopupSummaryObj.CardiologyStatusId = angular.copy($scope.CardiologyPopupDetails.CardiologyStatusId) || null;

                //            if ($scope.PreAdmCardioPopupSummaryObj.CardiologyStatus != '' || $scope.PreAdmCardioPopupSummaryObj.ReviewByName != '' || $scope.PreAdmCardioPopupSummaryObj.ReviewedDate != '' || $scope.PreAdmCardioPopupSummaryObj.ReviewedTime != '') {
                //                $scope.PreAdmCardioPopupSummaryObj.IsReviewedbyInd = true;
                //            } else {
                //                $scope.PreAdmCardioPopupSummaryObj.IsReviewedbyInd = false;
                //            }

                //            //$scope.PreAdmCardioPopupSummaryObj.InvestigationsList = angular.copy($scope.CardiologyPopupDetails.InvestigationsList) || [];
                //            //$scope.CardiologyPopupDetails.Prescription = $scope.CardiologyPopupDetails.Prescription || [];
                //            //if ($scope.CardiologyPopupDetails.Prescription.length > 0) {
                //            //    $scope.PreAdmCardioPopupSummaryObj.PrescriptionDetails = angular.copy($scope.CardiologyPopupDetails.Prescription) || [];
                //            //} else {
                //            //    $scope.PreAdmCardioPopupSummaryObj.PrescriptionDetails = [];
                //            //}

                //            $scope.PreAdmObj.MedicineOrdersList = angular.copy($scope.CardiologyPopupDetails.Prescription);
                //            $scope.PreAdmObj.InvestigationsList = angular.copy($scope.CardiologyPopupDetails.InvestigationsList);


                //            $scope.PreAdmCardioPopupSummaryObj.DocumentDetails = $scope.CardiologyPopupDetails.DocumentDetails || [];

                //            if ($scope.PreAdmCardioPopupSummaryObj.PresentIllness != '' || $scope.PreAdmCardioPopupSummaryObj.Treatment != '' || $scope.PreAdmCardioPopupSummaryObj.CardiologistDiagnosis.length > 0 || $scope.PreAdmCardioPopupSummaryObj.InvestigationsList.length > 0 || $scope.PreAdmCardioPopupSummaryObj.PrescriptionDetails.length > 0 || $scope.PreAdmCardioPopupSummaryObj.DocumentDetails.length > 0) {
                //                $scope.PreAdmCardioPopupSummaryObj.IsShowCardiologySummarydata = true;
                //            } else {
                //                $scope.PreAdmCardioPopupSummaryObj.IsShowCardiologySummarydata = false;
                //            }
                //        }
                //    }
                //}

                //if (resp[2].data.status === "Success") {
                //    angular.forEach(resp[2].data.Vitals, function (item) {
                //        let ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                //        let edate = ndate + " " + item.VitalAddTime;

                //        item.VitalAddTime = $filter('date')(new Date(edate), "hh:mm a");
                //    });
                //    $scope.PreAdmObj.VitalsArray = angular.copy(resp[2].data.Vitals);
                //    $scope.PreAdmObj.SystemicHistory = angular.copy(resp[2].data.SystemicHistory);
                //    $scope.PreAdmObj.LabInvestigation = resp[2].data.LabInvestigation || [];                    
                //    $scope.PreAdmObj.LifestyleDetail = resp[2].data.LifestyleDetail || [];
                //    $scope.PreAdmObj.PreAdmission = resp[2].data.PreAdmission || '';
                //}
                //if (resp[3].data.status === "Success") {
                //    angular.forEach(resp[3].data.rows, function (item) {
                //        angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                //            kitem.IsChecked = false;
                //        });
                //        item.ChecklistDate = null;
                //        item.Remarks = "";
                //    });
                //    $scope.ClinicalChecklistParentObj.ClinicalChecklist = angular.copy(resp[3].data.rows);
                //}
                //if (resp[4].data.status === "Success") {

                //    $scope.ClinicalChecklistParentObj.SurgeryList = angular.copy(resp[4].data.SurgeryArray) || [];

                //    angular.forEach(resp[4].data.rows, function (hitem) {
                //        angular.forEach($scope.ClinicalChecklistParentObj.ClinicalChecklist, function (item) {
                //            if (hitem.CheckListCategoryId === item.CheckListCategoryId && hitem.CheckListId === item.CheckListId) {
                //                angular.forEach(item.OrganizationCheckListDetails, function (kitem) {
                //                    if (hitem.CheckListId == kitem.CheckListId) {
                //                        kitem.PatientAscCheckListDetailId = hitem.PatientAscCheckListDetailId || 0;
                //                        if (kitem.Value == hitem.Value) {
                //                            kitem.IsChecked = true;
                //                            item.Value = kitem.Value || '';
                //                        }
                //                    }
                //                });
                //                item.ChecklistDate = $filter('date')(hitem.ChecklistDate, "MM-dd-yyyy") || null;

                //                if (item.CheckListCategoryId === 1) {
                //                    if (item.Value == "N/A" || item.Value == "No" || item.Value == "Not") {
                //                        item.ChecklistDate = null;
                //                    }
                //                }
                //                item.Remarks = hitem.Remarks || "";

                //                if (item.Remarks != "") {
                //                    item.ShowNotesInd = true;
                //                }
                //                if (item.ChecklistDate != "") {
                //                    item.IsChecked = true;
                //                }
                //            }

                //        });
                //    });

                //    $scope.ClinicalChecklistParentObj.CheckListRemarks = resp[4].data.CheckListRemarks || "";
                    
                //    if (resp[4].data.PreAdmissionChecklistDocuments.length > 0) {
                //        $scope.ClinicalChecklistParentObj.PreAdmissionChecklistDocuments = resp[4].data.PreAdmissionChecklistDocuments || [];
                //        $scope.ClinicalChecklistParentObj.TempImagesArray = [];
                //    }
                //    $scope.ClinicalChecklistParentObj.ChecklistReviewedBy = resp[4].data.ChecklistReviewedBy || null;
                //    if ($scope.ClinicalChecklistParentObj.ChecklistReviewedBy != null) {
                //        var TempFilter = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.ClinicalChecklistParentObj.ChecklistReviewedBy }, true);
                //        if (TempFilter.length > 0) {
                //            $scope.ClinicalChecklistParentObj.ChecklistReviewedByName = angular.copy(TempFilter[0].FullName);
                //        }
                //        else {
                //            $scope.ClinicalChecklistParentObj.ChecklistReviewedByName = '';
                //        }
                //    }
                //}
                $scope.AllAnesthetistList = [];                
                $scope.AllAnesthetistList = angular.copy($scope.allUserList).filter((x) => x.RoleId == 25 || x.RoleId == 8 || x.RoleId == 30 || x.RoleId == 16|| x.RoleId == 1 || x.RoleId == 43)||[];
             
               
                $scope.PreAdmAnesthetistObj.ReviewedBy = $scope.PreAdmAnesthetistObj.ReviewedBy || 0;
                if ($scope.PreAdmAnesthetistObj.ReviewedBy == 0) {
                    $scope.PreAdmAnesthetistObj.ReviewedBy = $scope.UserId || 0;
                }

                //if ($scope.MainObj.IsPreAdmSummaryNav) {
                //    $scope.PreAdmObj.IsShow = true;
                //    $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;
                //} else {
                //    if (($scope.PreAdmAnesthetistObj.PreAdmissionId !== 0) && !$scope.PreAdmObj.IsEdit) {
                //        $scope.PreAdmObj.IsShow = false;
                //        $scope.PreAdmObj.IsShowPreAdmissionSummaryView = true;
                //    }
                //    else if ($scope.PreAdmAnesthetistObj.PreAdmissionId == 0) {
                //        $scope.PreAdmObj.IsShow = true;
                //        $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;
                //    }
                //    else if (($scope.PreAdmAnesthetistObj.PreAdmissionId !== 0) && $scope.PreAdmObj.IsEdit) {
                //        $scope.PreAdmObj.IsShow = true;
                //        $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;
                //    }
                //}


                //$scope.MainObj.IsPreAdmSummaryNav = false;

            });

            $scope.PerformedByArray = [];
            $scope.AllNurseList = [];
            $scope.allUserList = angular.copy($scope.allUserList)|| [];
            if ($scope.allUserList.length > 0) {
                $scope.PerformedByArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 8 || x.RoleId == 30 || x.RoleId == 72 || x.RoleId == 43);
                $scope.AnesthetistArray = $scope.allUserList.filter((x) => x.RoleId == 30 || x.RoleId == 25 || x.RoleId == 16 || x.RoleId == 1 || x.RoleId == 43  );
            }

            $scope.AllNurseList = angular.copy($scope.allUserList);
            $scope.AllNurseList = _.uniq($scope.AllNurseList, false, function (p) { return p.DoctorID; });
            $scope.AllNurseList = $filter("filter")($scope.AllNurseList, function (item) {
                return item.RoleId === 8;
            });

            $scope.currentDate = moment().format("hh:mm A");

            $scope.initOrgLogo();
        };

        $scope.init();


        $scope.$on("RefreshPreAdmHPSummaryEvent", function (event, data) {
           
            $scope.init();
        });

        //$scope.ShowROSPopUp = function (item) {
        //    item = item || 'Allergies';
        //    $scope.PreAdmAnesthetistObj.AllergyItems = $scope.PreAdmAnesthetistObj.AllergyItems || [];
        //    $scope.PreAdmAnesthetistObj.SystemicHistory = $scope.PreAdmAnesthetistObj.SystemicHistory || [];
        //    $scope.PreAdmAnesthetistObj.SurgicalHistory = $scope.PreAdmAnesthetistObj.SurgicalHistory || [];

        //    var checkInvArray = $filter("filter")($scope.TemplateList, { "CategoryId": 2 }, true);
        //    var subVisionArray = checkInvArray[0].CategoryDetails;
        //    subVisionArray = subVisionArray.filter((x) => x.SubCategoryId == 3 || x.SubCategoryId == 4 || x.SubCategoryId == 7 || x.SubCategoryId == 69 || x.SubCategoryId == 73);
        //    var CategoryList = [];
        //    CategoryList = subVisionArray || [];
        //    angular.forEach(CategoryList, function (citem) {
        //        citem.IsSubCategoryChecked = true;
        //    });
        //    var ScreenObj = "ASC";

        //    $scope.modalROSInstance = $uibModal.open({
        //        "templateUrl": "templates/uibpopups/ROSpopupadding.html",
        //        "controller": "USPreAdmROSCtrl",
        //        "resolve": {
        //            "RosObject": function () { return item; },
        //            "CategoryList": function () { return CategoryList; },
        //            "cacheStorageItem": function () { return angular.copy($scope.PreAdmAnesthetistObj) },
        //            "ROSIsNormalArray": function () { return angular.copy($scope.ROSIsNormalArray) },
        //            "ScreenObj": function () { return ScreenObj }
        //        },
        //        "backdrop": "static",
        //        "keyboard": false,
        //        "windowClass": "modal__popup--1 bottom-to-top-modal in",
        //        /* "windowClass": "newassessmentspopupuib",*/
        //    });
        //    $scope.modalROSInstance.result.then(function (resp) {
        //        console.log(resp);
        //        if (resp.ROSOverAllRemarks != "" || resp.ROSOverAllRemarks != null) {
        //            $scope.PreAdmAnesthetistObj.ROSOverAllRemarks = resp.ROSOverAllRemarks;
        //        }
        //        if (resp.type == "RosHistory") {
        //            if (resp.AllergyItems.length != 0) {
        //                $scope.PreAdmAnesthetistObj.AllergyItems = [];
        //                angular.forEach(resp.AllergyItems, function (kitem) {
        //                    //if (kitem.PatientDetailId == 0) {
        //                    //    kitem.ModifiedDt = $filter('date')(new Date(), "yyyy-MM-dd");
        //                    //}                        
        //                    $scope.PreAdmAnesthetistObj.AllergyItems.push(kitem);
        //                });
        //            } else {
        //                $scope.PreAdmAnesthetistObj.AllergyItems = [];
        //            }
        //            if (resp.SystemicHistoryArray.length != 0) {
        //                $scope.PreAdmAnesthetistObj.SystemicHistory = [];
        //                angular.forEach(resp.SystemicHistoryArray, function (kitem) {
        //                    $scope.PreAdmAnesthetistObj.SystemicHistory.push(kitem);
        //                });
        //            } else {
        //                $scope.PreAdmAnesthetistObj.SystemicHistory = [];
        //            }
        //            if (resp.SurgicalHistoryArray.length != 0) {
        //                $scope.PreAdmAnesthetistObj.SurgicalHistory = [];
        //                angular.forEach(resp.SurgicalHistoryArray, function (kitem) {
        //                    $scope.PreAdmAnesthetistObj.SurgicalHistory.push(kitem);
        //                });
        //            } else {
        //                $scope.PreAdmAnesthetistObj.SurgicalHistory = [];
        //            }


        //            if (resp.CurrentSystemicMedicationsHistory.length != 0) {
        //                $scope.PreAdmAnesthetistObj.CurrentSystemicMedicationsHistory = angular.copy(resp.CurrentSystemicMedicationsHistory);
        //            } else {
        //                $scope.PreAdmAnesthetistObj.CurrentSystemicMedicationsHistory = [];
        //            }
        //            if (resp.CurrentEyeMedicationArray.length != 0) {
        //                $scope.PreAdmAnesthetistObj.CurrentEyeMedications = angular.copy(resp.CurrentEyeMedicationArray);
        //            }
        //            else {
        //                $scope.PreAdmAnesthetistObj.CurrentEyeMedications = [];
        //            }

        //        }


        //        $scope.PreAdmAnesthetistObj.isNKASelected = resp.isNKASelected || false;
        //        $scope.PreAdmAnesthetistObj.isNKDASelected = resp.isNKDASelected || false;

        //    }, function () { });
        //};

        $scope.OnClickRespiratoryNormal = function () {

            if ($scope.PreAdmAnesthetistObj.IsRespiratoryNormal) {
                angular.forEach($scope.PreAdmAnesthetistObj.HealthArray, function (kitem) {
                    if (kitem.CategoryId == 13) {
                        kitem.IsChecked = null;
                    }
                });
            }
        };

        $scope.AdvancedHealth = function () {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/Advancedhealth.html",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                // "windowClass": "inventory-full-popup",
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                "controller": function ($scope, $uibModal, $uibModalInstance, PreAdmAnesthetistObj) {
                    $scope.cacheStorageItem = angular.copy(PreAdmAnesthetistObj);

                    $scope.closeuib = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.HealthAvancedPopUpSave = function () {
                        $uibModalInstance.close($scope.cacheStorageItem);
                    };

                    $scope.OnSelectNormal = function (item) {
                        if (item === "All") {
                            if ($scope.cacheStorageItem.IsAllHealthWNL) {
                                angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                                    kitem.IsChecked = null;
                                });
                                $scope.cacheStorageItem.IsCardiacWNL = true;
                                $scope.cacheStorageItem.IsPulmonaryWNL = true;
                                $scope.cacheStorageItem.IsHepaticWNL = true;
                                $scope.cacheStorageItem.IsEndocrineWNL = true;
                                $scope.cacheStorageItem.IsNeurologicWNL = true;
                                $scope.cacheStorageItem.IsHemeOncWNL = true;
                                $scope.cacheStorageItem.IsNervousSystemWNL = true;
                                $scope.cacheStorageItem.IsKidneyDiseaseWNL = true;
                                $scope.cacheStorageItem.IsMusculoSkeletalSystemWNL = true;
                                $scope.cacheStorageItem.IsAutoImmuneDisordersWNL = true;
                                $scope.cacheStorageItem.IsPsychosisWNL = true;
                                $scope.cacheStorageItem.IsOthersWNL = true;
                                $scope.cacheStorageItem.IsHeentWNL = true;
                                $scope.cacheStorageItem.IsLungsWNL = true;
                            } else {
                                $scope.cacheStorageItem.IsCardiacWNL = false;
                                $scope.cacheStorageItem.IsPulmonaryWNL = false;
                                $scope.cacheStorageItem.IsHepaticWNL = false;
                                $scope.cacheStorageItem.IsEndocrineWNL = false;
                                $scope.cacheStorageItem.IsNeurologicWNL = false;
                                $scope.cacheStorageItem.IsHemeOncWNL = false;
                                $scope.cacheStorageItem.IsNervousSystemWNL = false;
                                $scope.cacheStorageItem.IsKidneyDiseaseWNL = false;
                                $scope.cacheStorageItem.IsMusculoSkeletalSystemWNL = false;
                                $scope.cacheStorageItem.IsAutoImmuneDisordersWNL = false;
                                $scope.cacheStorageItem.IsPsychosisWNL = false;
                                $scope.cacheStorageItem.IsOthersWNL = false;
                                $scope.cacheStorageItem.IsHeentWNL = false;
                                $scope.cacheStorageItem.IsLungsWNL = false;
                            }
                        }
                        if (item === "Cardiac") {
                            if ($scope.cacheStorageItem.IsCardiacWNL) {
                                angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                                    if (kitem.CategoryId === 1) {
                                        kitem.IsChecked = null;
                                    }
                                });
                            } else {
                                $scope.cacheStorageItem.IsAllHealthWNL = false;
                            }
                        }
                        if (item === "Pulmonary") {
                            if ($scope.cacheStorageItem.IsPulmonaryWNL) {
                                angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                                    if (kitem.CategoryId === 2) {
                                        kitem.IsChecked = null;
                                    }
                                });
                            } else {
                                $scope.cacheStorageItem.IsAllHealthWNL = false;
                            }
                        }
                        if (item === "Hepatic") {
                            if ($scope.cacheStorageItem.IsHepaticWNL) {
                                angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                                    if (kitem.CategoryId === 3) {
                                        kitem.IsChecked = null;
                                    }
                                });
                            } else {
                                $scope.cacheStorageItem.IsAllHealthWNL = false;
                            }
                        }
                        if (item === "Endocrine") {
                            if ($scope.cacheStorageItem.IsEndocrineWNL) {
                                angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                                    if (kitem.CategoryId === 4) {
                                        kitem.IsChecked = null;
                                    }
                                });
                            } else {
                                $scope.cacheStorageItem.IsAllHealthWNL = false;
                            }
                        }
                        if (item === "Neurologic") {
                            if ($scope.cacheStorageItem.IsNeurologicWNL) {
                                angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                                    if (kitem.CategoryId === 5) {
                                        kitem.IsChecked = null;
                                    }
                                });
                            } else {
                                $scope.cacheStorageItem.IsAllHealthWNL = false;
                            }
                        }
                        if (item === "HemeOnc") {
                            if ($scope.cacheStorageItem.IsHemeOncWNL) {
                                angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                                    if (kitem.CategoryId === 6) {
                                        kitem.IsChecked = null;
                                    }
                                });
                            } else {
                                $scope.cacheStorageItem.IsAllHealthWNL = false;
                            }
                        }
                        if (item === "Nervous System") {
                            if ($scope.cacheStorageItem.IsNervousSystemWNL) {
                                angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                                    if (kitem.CategoryId === 7) {
                                        kitem.IsChecked = null;
                                    }
                                });
                            } else {
                                $scope.cacheStorageItem.IsAllHealthWNL = false;
                            }
                        }
                        if (item === "Kidney") {
                            if ($scope.cacheStorageItem.IsKidneyDiseaseWNL) {
                                angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                                    if (kitem.CategoryId === 8) {
                                        kitem.IsChecked = null;
                                    }
                                });
                            } else {
                                $scope.cacheStorageItem.IsAllHealthWNL = false;
                            }
                        }
                        if (item === "MusculoSkeletal") {
                            if ($scope.cacheStorageItem.IsMusculoSkeletalSystemWNL) {
                                angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                                    if (kitem.CategoryId === 9) {
                                        kitem.IsChecked = null;
                                    }
                                });
                            } else {
                                $scope.cacheStorageItem.IsAllHealthWNL = false;
                            }
                        }
                        if (item === "AutoImmune") {
                            if ($scope.cacheStorageItem.IsAutoImmuneDisordersWNL) {
                                angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                                    if (kitem.CategoryId === 10) {
                                        kitem.IsChecked = null;
                                    }
                                });
                            } else {
                                $scope.cacheStorageItem.IsAllHealthWNL = false;
                            }
                        }
                        if (item === "Psychosis") {
                            if ($scope.cacheStorageItem.IsPsychosisWNL) {
                                angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                                    if (kitem.CategoryId === 11) {
                                        kitem.IsChecked = null;
                                    }
                                });
                            } else {
                                $scope.cacheStorageItem.IsAllHealthWNL = false;
                            }
                        }
                        if (item === "Others") {
                            if ($scope.cacheStorageItem.IsOthersWNL) {
                                angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                                    if (kitem.CategoryId === 12) {
                                        kitem.IsChecked = null;
                                    }
                                });
                            } else {
                                $scope.cacheStorageItem.IsAllHealthWNL = false;
                            }
                        }

                        if (item === "Heent") {
                            if ($scope.cacheStorageItem.IsHeentWNL) {
                                angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                                    if (kitem.CategoryId === 16) {
                                        kitem.IsChecked = null;
                                    }
                                });
                            } else {
                                $scope.cacheStorageItem.IsAllHealthWNL = false;
                            }
                        }
                        if (item === "Lungs") {
                            if ($scope.cacheStorageItem.IsLungsWNL) {
                                angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                                    if (kitem.CategoryId === 17) {
                                        kitem.IsChecked = null;
                                    }
                                });
                            } else {
                                $scope.cacheStorageItem.IsAllHealthWNL = false;
                            }
                        }

                    };

                    $scope.$watch("cacheStorageItem.HealthArray", function (newVal, oldVal) {
                        let CardiacCounter = 0;
                        let PulmonaryCounter = 0;
                        let HepaticCounter = 0;
                        let EndocrineCounter = 0;
                        let NeurologicCounter = 0;
                        let HemeOncCounter = 0;
                        let NervousSystemCounter = 0;
                        let KidneyDiseaseCounter = 0;
                        let MusculoSkeletalSystemCounter = 0;
                        let AutoImmuneDisordersCounter = 0;
                        let PsychosisCounter = 0;
                        let OthersCounter = 0;
                        let RespiratoryCounter = 0;
                        let HeentCounter = 0;
                        let LungsCounter = 0;

                        angular.forEach($scope.cacheStorageItem.HealthArray, function (item) {
                            if (item.CategoryId == 1 && item.IsChecked) {
                                CardiacCounter++;
                            }
                            if (item.CategoryId == 2 && item.IsChecked) {
                                PulmonaryCounter++;
                            }
                            if (item.CategoryId == 3 && item.IsChecked) {
                                HepaticCounter++;
                            }
                            if (item.CategoryId == 4 && item.IsChecked) {
                                EndocrineCounter++;
                            }
                            if (item.CategoryId == 5 && item.IsChecked) {
                                NeurologicCounter++;
                            }
                            if (item.CategoryId == 6 && item.IsChecked) {
                                HemeOncCounter++;
                            }
                            if (item.CategoryId == 7 && item.IsChecked) {
                                NervousSystemCounter++;
                            }
                            if (item.CategoryId == 8 && item.IsChecked) {
                                KidneyDiseaseCounter++;
                            }
                            if (item.CategoryId == 9 && item.IsChecked) {
                                MusculoSkeletalSystemCounter++;
                            }
                            if (item.CategoryId == 10 && item.IsChecked) {
                                AutoImmuneDisordersCounter++;
                            }
                            if (item.CategoryId == 11 && item.IsChecked) {
                                PsychosisCounter++;
                            }
                            if (item.CategoryId == 12 && item.IsChecked) {
                                OthersCounter++;
                            }
                            if (item.CategoryId == 13 && item.IsChecked) {
                                RespiratoryCounter++;
                            }
                            if (item.CategoryId == 16 && item.IsChecked) {
                                HeentCounter++;
                            }
                            if (item.CategoryId == 17 && item.IsChecked) {
                                LungsCounter++;
                            }
                        });
                        if (CardiacCounter > 0) {
                            $scope.cacheStorageItem.IsCardiacWNL = false;
                            $scope.cacheStorageItem.IsAllHealthWNL = false;
                        }
                        if (PulmonaryCounter > 0) {
                            $scope.cacheStorageItem.IsPulmonaryWNL = false;
                            $scope.cacheStorageItem.IsAllHealthWNL = false;
                        }
                        if (HepaticCounter > 0) {
                            $scope.cacheStorageItem.IsHepaticWNL = false;
                            $scope.cacheStorageItem.IsAllHealthWNL = false;
                        }
                        if (EndocrineCounter > 0) {
                            $scope.cacheStorageItem.IsEndocrineWNL = false;
                            $scope.cacheStorageItem.IsAllHealthWNL = false;
                        }
                        if (NeurologicCounter > 0) {
                            $scope.cacheStorageItem.IsNeurologicWNL = false;
                            $scope.cacheStorageItem.IsAllHealthWNL = false;
                        }
                        if (HemeOncCounter > 0) {
                            $scope.cacheStorageItem.IsHemeOncWNL = false;
                            $scope.cacheStorageItem.IsAllHealthWNL = false;
                        }
                        if (NervousSystemCounter > 0) {
                            $scope.cacheStorageItem.IsNervousSystemWNL = false;
                            $scope.cacheStorageItem.IsAllHealthWNL = false;
                        }
                        if (KidneyDiseaseCounter > 0) {
                            $scope.cacheStorageItem.IsKidneyDiseaseWNL = false;
                            $scope.cacheStorageItem.IsAllHealthWNL = false;
                        }
                        if (MusculoSkeletalSystemCounter > 0) {
                            $scope.cacheStorageItem.IsMusculoSkeletalSystemWNL = false;
                            $scope.cacheStorageItem.IsAllHealthWNL = false;
                        }
                        if (AutoImmuneDisordersCounter > 0) {
                            $scope.cacheStorageItem.IsAutoImmuneDisordersWNL = false;
                            $scope.cacheStorageItem.IsAllHealthWNL = false;
                        }
                        if (PsychosisCounter > 0) {
                            $scope.cacheStorageItem.IsPsychosisWNL = false;
                            $scope.cacheStorageItem.IsAllHealthWNL = false;
                        }
                        if (OthersCounter > 0) {
                            $scope.cacheStorageItem.IsOthersWNL = false;
                            $scope.cacheStorageItem.IsAllHealthWNL = false;
                        }
                        if (RespiratoryCounter > 0) {
                            $scope.cacheStorageItem.IsRespiratoryNormal = false;
                            $scope.cacheStorageItem.IsAllHealthWNL = false;
                        }
                        if (HeentCounter > 0) {
                            $scope.cacheStorageItem.IsHeentWNL = false;
                            $scope.cacheStorageItem.IsAllHealthWNL = false;
                        }
                        if (LungsCounter > 0) {
                            $scope.cacheStorageItem.IsLungsWNL = false;
                            $scope.cacheStorageItem.IsAllHealthWNL = false;
                        }

                    }, true);

                },
                "resolve": {
                    "PreAdmAnesthetistObj": function () { return $scope.PreAdmAnesthetistObj; }
                }
            });
            $scope.mInstanceAdd.result.then(function (obj) {

                $scope.PreAdmAnesthetistObj.IsCardiacWNL = obj.IsCardiacWNL;
                $scope.PreAdmAnesthetistObj.IsPulmonaryWNL = obj.IsPulmonaryWNL;
                $scope.PreAdmAnesthetistObj.IsHepaticWNL = obj.IsHepaticWNL;
                $scope.PreAdmAnesthetistObj.IsEndocrineWNL = obj.IsEndocrineWNL;
                $scope.PreAdmAnesthetistObj.IsNeurologicWNL = obj.IsNeurologicWNL;
                $scope.PreAdmAnesthetistObj.IsHemeOncWNL = obj.IsHemeOncWNL;
                $scope.PreAdmAnesthetistObj.IsNervousSystemWNL = obj.IsNervousSystemWNL;
                $scope.PreAdmAnesthetistObj.IsKidneyDiseaseWNL = obj.IsKidneyDiseaseWNL;
                $scope.PreAdmAnesthetistObj.IsMusculoSkeletalSystemWNL = obj.IsMusculoSkeletalSystemWNL;
                $scope.PreAdmAnesthetistObj.IsAutoImmuneDisordersWNL = obj.IsAutoImmuneDisordersWNL;
                $scope.PreAdmAnesthetistObj.IsPsychosisWNL = obj.IsPsychosisWNL;
                $scope.PreAdmAnesthetistObj.IsOthersWNL = obj.IsOthersWNL;
                $scope.PreAdmAnesthetistObj.IsHeentWNL = obj.IsHeentWNL;
                $scope.PreAdmAnesthetistObj.IsLungsWNL = obj.IsLungsWNL;
                $scope.PreAdmAnesthetistObj.CardiacNotes = obj.CardiacNotes;
                $scope.PreAdmAnesthetistObj.PulmonaryNotes = obj.PulmonaryNotes;
                $scope.PreAdmAnesthetistObj.HepaticNotes = obj.HepaticNotes;
                $scope.PreAdmAnesthetistObj.EndocrineNotes = obj.EndocrineNotes;
                $scope.PreAdmAnesthetistObj.NeurologicNotes = obj.NeurologicNotes;
                $scope.PreAdmAnesthetistObj.HemeOncNotes = obj.HemeOncNotes;
                $scope.PreAdmAnesthetistObj.NervousSystemNotes = obj.NervousSystemNotes;
                $scope.PreAdmAnesthetistObj.KidneyDiseaseNotes = obj.KidneyDiseaseNotes;
                $scope.PreAdmAnesthetistObj.MusculoSkeletalSystemNotes = obj.MusculoSkeletalSystemNotes;
                $scope.PreAdmAnesthetistObj.AutoImmuneDisordersNotes = obj.AutoImmuneDisordersNotes;
                $scope.PreAdmAnesthetistObj.PsychosisNotes = obj.PsychosisNotes;
                $scope.PreAdmAnesthetistObj.OthersNotes = obj.OthersNotes;
                $scope.PreAdmAnesthetistObj.HeentNotes = obj.HeentNotes;
                $scope.PreAdmAnesthetistObj.LungsNotes = obj.LungsNotes;
                $scope.PreAdmAnesthetistObj.HealthArray = angular.copy(obj.HealthArray);

                let tempHealthArray = angular.copy(obj.HealthArray);
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
                        if (item.IsChecked) {
                            tempCardiacArray.push(item.Description);
                        }
                    }
                    if (item.CategoryId === 2) {
                        if (item.IsChecked) {
                            tempPulmonaryArray.push(item.Description);
                        }
                    }
                    if (item.CategoryId === 3) {
                        if (item.IsChecked) {
                            tempHepaticArray.push(item.Description);
                        }
                    }
                    if (item.CategoryId === 4) {
                        if (item.IsChecked) {
                            tempEndocrineArray.push(item.Description);
                        }
                    }
                    if (item.CategoryId === 5) {
                        if (item.IsChecked) {
                            tempNeurologicArray.push(item.Description);
                        }
                    }
                    if (item.CategoryId === 6) {
                        if (item.IsChecked) {
                            tempHemeOneArray.push(item.Description);
                        }
                    }
                    if (item.CategoryId === 7) {
                        if (item.IsChecked) {
                            tempNervousSystemArray.push(item.Description);
                        }
                    }
                    if (item.CategoryId === 8) {
                        if (item.IsChecked) {
                            tempKidneyDiseaseArray.push(item.Description);
                        }
                    }
                    if (item.CategoryId === 9) {
                        if (item.IsChecked) {
                            tempMusculoSkeletalArray.push(item.Description);
                        }
                    }
                    if (item.CategoryId === 10) {
                        if (item.IsChecked) {
                            tempAutoImmuneArray.push(item.Description);
                        }
                    }
                    if (item.CategoryId === 11) {
                        if (item.IsChecked) {
                            tempPsychosisArray.push(item.Description);
                        }
                    }
                    if (item.CategoryId === 12) {
                        if (item.IsChecked) {
                            tempOthersArray.push(item.Description);
                        }
                    }
                    if (item.CategoryId === 16) {
                        if (item.IsChecked) {
                            tempHeentArray.push(item.Description);
                        }
                    }
                    if (item.CategoryId === 17) {
                        if (item.IsChecked) {
                            tempLungsArray.push(item.Description);
                        }
                    }
                });

                if (tempCardiacArray.length > 0) {
                    $scope.PreAdmAnesthetistObj.SelectedCardiacIssues = tempCardiacArray.join(", ");
                } else {
                    $scope.PreAdmAnesthetistObj.SelectedCardiacIssues = "";
                }
                if (tempPulmonaryArray.length > 0) {
                    $scope.PreAdmAnesthetistObj.SelectedPulmonaryIssues = tempPulmonaryArray.join(", ");
                } else {
                    $scope.PreAdmAnesthetistObj.SelectedPulmonaryIssues = "";
                }
                if (tempHepaticArray.length > 0) {
                    $scope.PreAdmAnesthetistObj.SelectedHepaticIssues = tempHepaticArray.join(", ");
                } else {
                    $scope.PreAdmAnesthetistObj.SelectedHepaticIssues = "";
                }
                if (tempEndocrineArray.length > 0) {
                    $scope.PreAdmAnesthetistObj.SelectedEndocrineIssues = tempEndocrineArray.join(", ");
                } else {
                    $scope.PreAdmAnesthetistObj.SelectedEndocrineIssues = "";
                }
                if (tempNeurologicArray.length > 0) {
                    $scope.PreAdmAnesthetistObj.SelectedNeurologicIssues = tempNeurologicArray.join(", ");
                } else {
                    $scope.PreAdmAnesthetistObj.SelectedNeurologicIssues = "";
                }
                if (tempHemeOneArray.length > 0) {
                    $scope.PreAdmAnesthetistObj.SelectedHemeOncIssues = tempHemeOneArray.join(", ");
                } else {
                    $scope.PreAdmAnesthetistObj.SelectedHemeOncIssues = "";
                }
                if (tempNervousSystemArray.length > 0) {
                    $scope.PreAdmAnesthetistObj.SelectedNervousSystemIssues = tempNervousSystemArray.join(", ");
                } else {
                    $scope.PreAdmAnesthetistObj.SelectedNervousSystemIssues = "";
                }
                if (tempKidneyDiseaseArray.length > 0) {
                    $scope.PreAdmAnesthetistObj.SelectedKidneyDiseaseIssues = tempKidneyDiseaseArray.join(", ");
                } else {
                    $scope.PreAdmAnesthetistObj.SelectedKidneyDiseaseIssues = "";
                }
                if (tempMusculoSkeletalArray.length > 0) {
                    $scope.PreAdmAnesthetistObj.SelectedMusculoSkeletalSystemIssues = tempMusculoSkeletalArray.join(", ");
                } else {
                    $scope.PreAdmAnesthetistObj.SelectedMusculoSkeletalSystemIssues = "";
                }
                if (tempAutoImmuneArray.length > 0) {
                    $scope.PreAdmAnesthetistObj.SelectedAutoImmuneDisordersIssues = tempAutoImmuneArray.join(", ");
                } else {
                    $scope.PreAdmAnesthetistObj.SelectedAutoImmuneDisordersIssues = "";
                }
                if (tempPsychosisArray.length > 0) {
                    $scope.PreAdmAnesthetistObj.SelectedPsychosisIssues = tempPsychosisArray.join(", ");
                } else {
                    $scope.PreAdmAnesthetistObj.SelectedPsychosisIssues = "";
                }
                if (tempOthersArray.length > 0) {
                    $scope.PreAdmAnesthetistObj.SelectedOthersIssues = tempOthersArray.join(", ");
                } else {
                    $scope.PreAdmAnesthetistObj.SelectedOthersIssues = "";
                }

                if (tempHeentArray.length > 0) {
                    $scope.PreAdmAnesthetistObj.SelectedHeentIssues = tempHeentArray.join(", ");
                } else {
                    $scope.PreAdmAnesthetistObj.SelectedHeentIssues = "";
                }

                if (tempLungsArray.length > 0) {
                    $scope.PreAdmAnesthetistObj.SelectedLungsIssues = tempLungsArray.join(", ");
                } else {
                    $scope.PreAdmAnesthetistObj.SelectedLungsIssues = "";
                }

                $scope.IsShowHealthandPhysicalDeleteInd = true;
               

            }, function (data) {
                console.log(data);
            });
        }

        $scope.GetNavObj = function () {
            return {
                "IsEvaluationTab": false,
                "IsAnesthetistPlanTab": false,
                "IsAnesthetistEvaluationTab": false,
                "IsCardioEvaluationTab": false
            };
        };
        $scope.NavObj = $scope.GetNavObj();
        $scope.NavObj.IsEvaluationTab = true;

        $scope.ShowEvaluationTab = function () {
            $scope.NavObj = $scope.GetNavObj();
            $scope.NavObj.IsEvaluationTab = true;
        };
        $scope.ShowAnesthetistPlanTab = function () {
            $scope.NavObj = $scope.GetNavObj();
            $scope.NavObj.IsAnesthetistPlanTab = true;
        };
        $scope.NavObj.IsAnesthetistEvaluationTab = true;
        $scope.NavObj.IsAnesthetistPlanTab = true;
        if ($scope.LoginUserRoleID === 30) {
            $scope.NavObj.IsAnesthetistPlanTab = true;
            $scope.NavObj.IsCardioEvaluationTab = false;
        }
        if ($scope.LoginUserRoleID === 72) {
            $scope.NavObj.IsCardioEvaluationTab = true;
            $scope.NavObj.IsAnesthetistEvaluationTab = false;
            $scope.NavObj.IsAnesthetistPlanTab = false;
        }

        $scope.medicationcordinatorclick = function (Type) {
            Type = Type || 'PreSurgery';
            let initObj = {
                "CurrentMedicationList": $scope.PreAdmAnesthetistObj.CurrentMedicationList || [],
                "MedicationsList": $scope.PreAdmAnesthetistObj.MedicationsList || [],
                "InvestigationsList": $scope.PreAdmAnesthetistObj.InvestigationsList || [],
                "PatientId": $scope.cacheStorageItem.PatientID,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                "DoctorId": $scope.SurgeryDiagnosisObj.SelectedSurgery.DoctorId,
                "PrescriptionDetails": $scope.PreAdmAnesthetistObj.PrescriptionDetails || []
            };
            $scope.mInstancecoordinationAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/cordinationviewpopup.html",
                "controller": "UScoordinationviewpopupCtrl",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "cache": function () { return angular.copy(initObj) },
                    "Type": function () { return angular.copy(Type) },
                    "ScreenType": function () { return '' },
                    "IsComingFrom": function () { return ""; }
                },
                //  "windowClass": "newassessmentspopupuib",
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
            });

            $scope.mInstancecoordinationAdd.result.then(function (resp) {
                if (resp.PreMedicationslist.length !== 0) {
                    $scope.PreAdmAnesthetistObj.MedicationsList = resp.PreMedicationslist || [];
                } else {
                    $scope.PreAdmAnesthetistObj.MedicationsList = [];
                }
                if (resp.CurrentMedicationslist.length !== 0) {
                    $scope.PreAdmAnesthetistObj.CurrentMedicationList = resp.CurrentMedicationslist || [];

                    $scope.IsContinuationMedication = false;
                    $scope.IsStopMedication = false;
                    angular.forEach($scope.PreAdmAnesthetistObj.CurrentMedicationList, function (item) {
                        if (item.DeleteInd == "N") {
                            if (item.MedicationType == 'Continuation') {
                                $scope.IsContinuationMedication = true;
                            }
                            if (item.MedicationType == 'Stop') {
                                $scope.IsStopMedication = true;
                            }
                        }
                        item.StartDate = item.StartDate;
                        item.StopDate = item.StopDate;
                    });
                } else {
                    $scope.PreAdmAnesthetistObj.CurrentMedicationList = [];
                }
                if (resp.Investigationslist.length !== 0) {
                    $scope.PreAdmAnesthetistObj.InvestigationsList = resp.Investigationslist || [];
                } else {
                    $scope.PreAdmAnesthetistObj.InvestigationsList = [];
                }

                if (resp.PrescriptionMainAddObj.PrescriptionDetails.length !== 0) {
                    $scope.PreAdmAnesthetistObj.PrescriptionDetails = [];
                    $scope.PreAdmAnesthetistObj.PrescriptionDetails.push(resp.PrescriptionMainAddObj);
                } else {
                    $scope.PreAdmAnesthetistObj.PrescriptionDetails = [];
                }


            }, function () { });
        };

        $scope.GetPrevROSData = function (val) {

            if (val === 1 || val === 2 || val === 3) {
                $scope.IsLatestROS = true;
            } else {
                $scope.IsLatestROS = false;
            }
            eHnoteSurgeryService.GetPrevROSData($scope.cacheStorageItem.PatientID, $scope.IsLatestROS).then(function (response) {
                console.log(response);
                if (response.data.rows.length > 0) {
                    if (val === 1) {

                        angular.forEach(response.data.rows[0].SystemicHistory, function (item) {
                            item.PatientDetailId = 0;
                        });

                        let tempSystemicArray = [];
                        tempSystemicArray = angular.copy($scope.PreAdmAnesthetistObj.SystemicHistory);
                        if (tempSystemicArray.length > 0) {
                            if (response.data.rows[0].SystemicHistory.length > 0) {
                                angular.forEach(response.data.rows[0].SystemicHistory, function (item) {
                                    angular.forEach(tempSystemicArray, function (kitem) {
                                        if (kitem.HistoryId !== item.HistoryId) {
                                            let tempArray = $filter('filter')($scope.PreAdmAnesthetistObj.SystemicHistory, { 'HistoryId': item.HistoryId }, true);
                                            if (tempArray.length == 0) {
                                                $scope.PreAdmAnesthetistObj.SystemicHistory.push(item);
                                            }
                                        } else if (kitem.HistoryId == item.HistoryId) {
                                            let index = $scope.PreAdmAnesthetistObj.SystemicHistory.findIndex((x) => x.HistoryId == kitem.HistoryId);
                                            if (index > -1) {
                                                $scope.PreAdmAnesthetistObj.SystemicHistory[index].ActiveInd = true;
                                                $scope.PreAdmAnesthetistObj.SystemicHistory[index].DeleteInd = "N";
                                            }
                                        }
                                    });
                                });
                            }
                        } else {
                            $scope.PreAdmAnesthetistObj.SystemicHistory = angular.copy(response.data.rows[0].SystemicHistory);
                        }
                    }
                    if (val === 2) {

                        angular.forEach(response.data.rows[0].SurgicalHistory, function (item) {
                            item.PatientDetailId = 0;
                        });

                        let tempSurgicalArray = [];
                        tempSurgicalArray = angular.copy($scope.PreAdmAnesthetistObj.SurgicalHistory);
                        if (tempSurgicalArray.length > 0) {
                            if (response.data.rows[0].SurgicalHistory.length > 0) {
                                angular.forEach(response.data.rows[0].SurgicalHistory, function (item) {
                                    angular.forEach(tempSurgicalArray, function (kitem) {
                                        if (kitem.HistoryId !== item.HistoryId) {
                                            let tempArray = $filter('filter')($scope.PreAdmAnesthetistObj.SurgicalHistory, { 'HistoryId': item.HistoryId }, true);
                                            if (tempArray.length == 0) {
                                                $scope.PreAdmAnesthetistObj.SurgicalHistory.push(item);
                                            }

                                        } else if (kitem.HistoryId == item.HistoryId) {
                                            let index = $scope.PreAdmAnesthetistObj.SurgicalHistory.findIndex((x) => x.HistoryId == kitem.HistoryId);
                                            if (index > -1) {
                                                $scope.PreAdmAnesthetistObj.SurgicalHistory[index].ActiveInd = true;
                                                $scope.PreAdmAnesthetistObj.SurgicalHistory[index].DeleteInd = "N";
                                            }
                                        }
                                    });
                                });
                            }
                        } else {
                            $scope.PreAdmAnesthetistObj.SurgicalHistory = angular.copy(response.data.rows[0].SurgicalHistory);
                        }
                    }
                    if (val === 3) {

                        angular.forEach(response.data.rows[0].Allergy, function (item) {
                            item.PatientDetailId = 0;
                        });

                        let tempAllergyArray = [];
                        tempAllergyArray = angular.copy($scope.PreAdmAnesthetistObj.AllergyItems);
                        if (tempAllergyArray.length > 0) {
                            if (response.data.rows[0].Allergy.length > 0) {
                                angular.forEach(response.data.rows[0].Allergy, function (item) {
                                    angular.forEach(tempAllergyArray, function (kitem) {
                                        if (kitem.AllergyId !== item.AllergyId) {
                                            let tempArray = $filter('filter')($scope.PreAdmAnesthetistObj.AllergyItems, { 'AllergyId': item.AllergyId }, true);
                                            if (tempArray.length == 0) {
                                                $scope.PreAdmAnesthetistObj.AllergyItems.push(item);
                                            }

                                        } else if (kitem.AllergyId == item.AllergyId) {
                                            let index = $scope.PreAdmAnesthetistObj.AllergyItems.findIndex((x) => x.AllergyId == kitem.AllergyId);
                                            if (index > -1) {
                                                $scope.PreAdmAnesthetistObj.AllergyItems[index].ActiveInd = true;
                                                $scope.PreAdmAnesthetistObj.AllergyItems[index].DeleteInd = "N";
                                            }
                                        }
                                    });
                                });
                            }
                        } else {
                            $scope.PreAdmAnesthetistObj.AllergyItems = angular.copy(response.data.rows[0].Allergy);
                        }

                    }
                    // $scope.AddToCache();
                }


                if (!$scope.IsLatestROS) {
                    var modalInstance = $uibModal.open({
                        templateUrl: "ASCROSHistory.html",
                        "size": "lg",
                        "resolve": {
                            "SystemicHistory": function () { return response.data.rows[0].SystemicHistory; },
                            "SurgicalHistory": function () { return response.data.rows[0].SurgicalHistory; },
                            "AllergyItems": function () { return response.data.rows[0].Allergy; },
                            "val": function () { return val; },
                            "SystemicHistory1": function () { return $scope.PreAdmAnesthetistObj.SystemicHistory; },
                            "SurgicalHistory1": function () { return $scope.PreAdmAnesthetistObj.SurgicalHistory; },
                            "AllergyItems1": function () { return $scope.PreAdmAnesthetistObj.AllergyItems; },
                        },
                        "controller": function ($scope, $uibModal, $uibModalInstance, SystemicHistory, SurgicalHistory, AllergyItems, val, SystemicHistory1, SurgicalHistory1, AllergyItems1) {
                            $scope.ROSHistoryobj = {
                                "SystemicHistory": [],
                                "SurgicalHistory": [],
                                "AllergyItems": [],
                                "Type": '',
                                "IsSystemicHistory": false,
                                "IsAllergyItems": true,
                                "IsSurgicalHistory": false
                            }

                            $scope.SystemicHistory = SystemicHistory;
                            $scope.SurgicalHistory = SurgicalHistory;
                            $scope.AllergyItems = AllergyItems;

                            if (val === 'Systemic') {
                                $scope.ROSHistoryobj.SystemicHistory = SystemicHistory;
                                $scope.ROSHistoryobj.Type = val;
                            }
                            if (val === 'Surgical') {
                                $scope.ROSHistoryobj.SurgicalHistory = SurgicalHistory;
                                $scope.ROSHistoryobj.Type = val;
                            }
                            if (val === 'Allergies') {
                                $scope.ROSHistoryobj.AllergyItems = AllergyItems;
                                $scope.ROSHistoryobj.Type = val;
                            }

                            $scope.close = function (item) {
                                $uibModalInstance.dismiss("cancel");
                            };

                            $scope.Obj = {
                                "SystemicHistory": [],
                                "SurgicalHistory": [],
                                "AllergyItems": [],
                            }
                            $scope.Obj.SystemicHistory = SystemicHistory1;
                            $scope.Obj.SurgicalHistory = SurgicalHistory1;
                            $scope.Obj.AllergyItems = AllergyItems1;

                            $scope.CopyPreviousAllergy = function (pAllergy) {
                                if (pAllergy != undefined) {
                                    var obj = {
                                        "PatientDetailId": 0,
                                        "IsShowAllergySnomedAddInd": pAllergy.IsShowAllergySnomedAddInd || false,
                                        "AllergyId": pAllergy.AllergyId || null,
                                        "RcopiaAllergyId": pAllergy.RcopiaAllergyId || null,
                                        "AllergyName": pAllergy.AllergyName || '',
                                        "OrganId": 4,
                                        "SeverityId": pAllergy.SeverityId || 0,
                                        "SNOMEDId": pAllergy.SNOMEDId || null,
                                        "RxNormID": pAllergy.RxNormID || null,
                                        "NDCID": pAllergy.NDCID || null,
                                        "DrugGroupID": pAllergy.DrugGroupID || null,
                                        "SeverityName": pAllergy.SeverityName || "",
                                        "ReactionId": pAllergy.ReactionId || "",
                                        "StatusId": pAllergy.StatusId || "",
                                        "Duration": pAllergy.Duration || "",
                                        "AllergyTypeId": pAllergy.AllergyTypeId || 0,
                                        "IsEdit": true,
                                        "ShowNote": false,
                                        "ShowDateFormat": true,
                                        "ReactionName": pAllergy.ReactionName || "",
                                        "DurationDate": pAllergy.DurationDate || "",
                                        "StatusName": pAllergy.StatusName || "",
                                        "Remarks": pAllergy.Remarks || "",
                                        "SnomedCode": pAllergy.SnomedCode || "",
                                        "DurationType": 'D',
                                        "OnsetType": 'Date',
                                        "DiagnosisObject": 'D',
                                        "DeleteInd": 'N',
                                    }
                                    var i = 0;
                                    if ($scope.Obj.AllergyItems.length > 0) {
                                        angular.forEach($scope.Obj.AllergyItems, function (item) {
                                            if (item.AllergyId === obj.AllergyId && item.DeleteInd == 'N') {
                                                alertify.error('You have already entered this Allergy');
                                                i++;
                                            }
                                        });
                                    }
                                    if (i === 0) {
                                        $scope.Obj.AllergyItems.push(obj);
                                        pAllergy.iscopied = true;
                                    }
                                }
                            }
                            $scope.CopyPreviousSystemHistory = function (ohitem) {
                                var object = {
                                    "PatientDetailId": 0,
                                    "HistoryId": ohitem.HistoryId || "",
                                    "HistoryName": ohitem.HistoryName || "",
                                    "IsEdit": ohitem.IsEdit || true,
                                    "ActiveInd": true,
                                    "DeleteInd": 'N',
                                    "Remarks": ohitem.Remarks || "",
                                    "SnomedCodeobj": ohitem.SNOMED || "",
                                    "OrganId": ohitem.OrganId || "",
                                    "Duration": ohitem.Duration || "",
                                    "DurationType": ohitem.DurationType || "D",
                                    "DurationTypeName": ohitem.DurationTypeName || "Day(s)",
                                    "DurationDate": ohitem.DurationDate || "",
                                    "ShowNote": false,
                                    "SNOMEDId": ohitem.SNOMEDId || null,
                                    "SNOMEDCODE": ohitem.SNOMED || "",
                                    "ICD10CODE": ohitem.ICD10CODE || "",
                                    "DiagnosisObject": ohitem.ICD10CODE || "",
                                    "DiagnosisId": ohitem.DiagnosisId || null,
                                    "SeverityId": ohitem.SeverityId || null,
                                    "StatusId": 1,
                                    "SeverityDateTime": ohitem.SeverityDateTime || "",
                                    "ShowDateFormat": true,
                                };
                                var i = 0;
                                if ($scope.Obj.SystemicHistory.length > 0) {
                                    angular.forEach($scope.Obj.SystemicHistory, function (item) {
                                        if (item.HistoryId === object.HistoryId && item.DeleteInd === 'N') {
                                            alertify.error('You have already entered this Systemic history');
                                            i++;
                                        }
                                    });
                                }
                                if (i === 0) {
                                    $scope.Obj.SystemicHistory.push(object);
                                    ohitem.iscopied = true;
                                }
                            }
                            $scope.CopyPreviousSurgical = function (surgicalHistory) {
                                var object = {
                                    "PatientDetailId": 0,
                                    "HistoryId": surgicalHistory.HistoryId,
                                    "HistoryName": surgicalHistory.HistoryName,
                                    "IsEdit": true,
                                    "showSurgicalHistory": surgicalHistory.showSurgicalHistory || false,
                                    "ActiveInd": true,
                                    "DeleteInd": 'N',
                                    "DurationDate": surgicalHistory.DurationDate || "",
                                    "Duration": surgicalHistory.Duration || "",
                                    "DurationType": surgicalHistory.DurationType || "D",
                                    "DurationTypeName": surgicalHistory.DurationTypeName || "Day(s)",
                                    "Remarks": surgicalHistory.Remarks || "",
                                    "ShowDateFormat": surgicalHistory.DurationDate ? true : false,
                                    "ShowNote": false,
                                    "ModifierId": surgicalHistory.ModifierId || "",
                                    "MODIFIERCODE": surgicalHistory.MODIFIERCODE || "",
                                    "ModifierObj": surgicalHistory.ModifierObj || "",
                                    "CPTCode": surgicalHistory.CPTCode || "",
                                    "ProcedureId": surgicalHistory.ProcedureId || "",
                                    "CPTObj": surgicalHistory.CPTCode || "",
                                    "ShowDateFormat": true
                                };
                                var i = 0;
                                if ($scope.Obj.SurgicalHistory.length > 0) {
                                    angular.forEach($scope.Obj.SurgicalHistory, function (item) {
                                        if (item.HistoryId === object.HistoryId && item.DeleteInd === 'N') {
                                            alertify.error('You have already entered this Surgical history');
                                            i++;
                                        }
                                    });
                                }
                                if (i === 0) {
                                    $scope.Obj.SurgicalHistory.push(object);
                                    surgicalHistory.iscopied = true;
                                }

                            }

                            $scope.ChangeROSHistory = function (val) {
                                if (val == 'Systemic') {
                                    $scope.ROSHistoryobj.SystemicHistory = $scope.SystemicHistory;
                                    $scope.ROSHistoryobj.IsSystemicHistory = true;
                                    $scope.ROSHistoryobj.IsAllergyItems = false;
                                    $scope.ROSHistoryobj.IsSurgicalHistory = false;
                                }
                                if (val == 'Surgical') {
                                    $scope.ROSHistoryobj.SurgicalHistory = $scope.SurgicalHistory;
                                    $scope.ROSHistoryobj.IsSystemicHistory = false;
                                    $scope.ROSHistoryobj.IsAllergyItems = false;
                                    $scope.ROSHistoryobj.IsSurgicalHistory = true;
                                }
                                if (val == 'Allergies') {
                                    $scope.ROSHistoryobj.AllergyItems = $scope.AllergyItems;
                                    $scope.ROSHistoryobj.IsSystemicHistory = false;
                                    $scope.ROSHistoryobj.IsAllergyItems = true;
                                    $scope.ROSHistoryobj.IsSurgicalHistory = false;
                                }
                            }
                        }
                    });
                    modalInstance.result.then(function (result) {
                        $scope.PreAdmAnesthetistObj.AllergyItems = angular.copy(result.AllergyItems)
                        $scope.PreAdmAnesthetistObj.SurgicalHistory = angular.copy(result.SurgicalHistory)
                        $scope.PreAdmAnesthetistObj.SystemicHistory = angular.copy(result.SystemicHistory)

                    }, function () { });
                }
            }, function (err) {
                alertify.error("Fetching Data failed!");
                console.log(err);
            });
        };
        var SetupPopUp = "";
        $scope.SurgeryBookAppt = function (Type) {
            $scope.PageName = "book";

            var doctorinfo = eHnoteMasterDataService.getUserInfo();
            $scope.AppDate = "";
            $scope.ispatientExistsval = false;
            $scope.calenderDate = undefined;
            var clinicAddressId = { "ClinicId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalID };
            var doctorID = {
                "DoctorID": doctorinfo.doctorid
            };

            if (doctorinfo.RoleID === 3 || doctorinfo.RoleID === 43 || doctorinfo.RoleID === 11 || doctorinfo.RoleID === 57 || doctorinfo.RoleID === 18) {
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
                eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
            } else if (doctorinfo.RoleID === 1 || doctorinfo.RoleID === 56) {
                eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID);
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);
            } else {
                eHnoteMasterDataService.addSelectedHospitalinAppList(clinicAddressId);

                var doctorID1 = {
                    "DoctorID": 0
                };
                eHnoteMasterDataService.addSelectedDoctorinAppList(doctorID1);
            }

            datapersistanceFactory.set('appointmentinfo', "");
            var appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
            appointmentInfo.AppointmentStatus = "B";
            appointmentInfo.BillingId = 0;

            eHnoteMasterDataService.addAppointmentInfo(appointmentInfo);

            $scope.ASCDatesArray = [];
            //$scope.ASCDatesArray = [
            //    {
            //        "TabName": "ASC",
            //        "TabId": 2
            //    },
            //    {
            //        "TabName": "Post FollowUp 1",
            //        "TabId": 3
            //    },
            //    {
            //        "TabName": "Post FollowUp 2",
            //        "TabId": 4
            //    },
            //    {
            //        "TabName": "Post FollowUp 3",
            //        "TabId": 5
            //    },
            //];

            if ($scope.PreAdmAnesthetistObj.AscAppointmentDate == null || $scope.PreAdmAnesthetistObj.AscAppointmentDate == "") {
                let obj = {
                    "TabName": "ASC",
                    "TabId": 2
                };
                $scope.ASCDatesArray.push(obj);
            }

            if ($scope.PreAdmAnesthetistObj.FirstFollowupDate == null || $scope.PreAdmAnesthetistObj.FirstFollowupDate == "") {
                let obj = {
                    "TabName": "Post FollowUp 1",
                    "TabId": 3
                };
                $scope.ASCDatesArray.push(obj);
            }

            if ($scope.PreAdmAnesthetistObj.SecondFollowupDate == null || $scope.PreAdmAnesthetistObj.SecondFollowupDate == "") {
                let obj = {
                    "TabName": "Post FollowUp 2",
                    "TabId": 4
                };
                $scope.ASCDatesArray.push(obj);
            }
            if ($scope.PreAdmAnesthetistObj.ThirdFollowupDate == null || $scope.PreAdmAnesthetistObj.ThirdFollowupDate == "") {
                let obj = {
                    "TabName": "Post FollowUp 3",
                    "TabId": 5
                };
                $scope.ASCDatesArray.push(obj);
            }

            if ($scope.SpecializationId === 2) {
                $scope.PageName = "directFollowup";
            }

            var Obj = {
                "PageName": "book",
                "AppDate": "",
                "ispatientExistsval": false,
                "calenderDate": undefined,
                "AppointmentId": null,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                'IsComingFrom': 'Coordinator',
                "DoctorId": null,
                "StartTime": null,
                "EndTime": null,
                'IsApptType': 'PreAdmission',
                'type': 'ASC',
                "IsMultipleAppts": true,
                "ASCDatesArray": $scope.ASCDatesArray,
                "SurgeryList": $scope.cacheStorageItem.PreAdmSurgeryList || []
            };
            datapersistanceFactory.set('AppointmentDetailsCache', Obj);
            var openBookAppt = "";
            let bookapptSetupPopUp = $uibModal.open({
                "templateUrl": "templates/appointment/BookAppointmentPopup.html",
                "keyboard": false,
                "backdrop": "static",
                "windowClass": "appointment-full-popup",
                "controller": "UsNewBookAppointmentPopupCtrl",
                "resolve": {
                    "allUserList": function () { return angular.copy($scope.allUserList); },
                    "openBookAppt": function () { return openBookAppt; }
                }
            });

            bookapptSetupPopUp.result.then(function (resp) {
                $scope.SavePreAdmissionDetails();

            }, function (data) {

            });
        };

        $scope.SavePreAdmissionDetails = function (str) {
            let appointmentId;
            if ($scope.cacheStorageItem.AppointmentTypeId === 4 || $scope.cacheStorageItem.AppointmentTypeId === 14) {
                appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
            }
            if ($scope.cacheStorageItem.AppointmentTypeId === 7 || $scope.cacheStorageItem.AppointmentTypeId === 6) {
                appointmentId = $scope.cacheStorageItem.AppointmentId;
            }
          //  var ReviewedDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            var ReviewedDate = moment().format("YYYY-MM-DD HH:mm:ss");
            if ($scope.PreAdmAnesthetistObj.AnesthesiaTypelist.length > 0) {
                angular.forEach($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) {
                    kitem.PatientSurgeryId = $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId;
                });
            }

            let parentApptId = ($scope.PreAdmSurgeryList.length > 0) ? $scope.PreAdmSurgeryList[0].AppointmentId : null;
            let reqObj = {
                "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                "PreAdmissionId": $scope.PreAdmAnesthetistObj.PreAdmissionId || 0,
                "OrganizationId": $scope.HospitalId || 0,
                "UserId": $scope.UserId,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "AppointmentId": appointmentId || 0,
                "AppointmentDate": $filter('date')(new Date(), "yyyy-MM-dd"),
                "ParentAppointmentId": parentApptId,
                //"PatientSurgeryId": $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId, // commented because we dont save data for each surgery
                "VitalsArray": [],
                "SystemicHistory": [],
                "AllergyItems": [],
                "SurgicalHistory": [],
                "CurrentSystemicMedicationsList": [],
                "CurrentEyeMedicationsList": [],
                "InvestigationsList": [],
                "LabTest": "",
                "Airway": "",
                "CardioVascular": "",
                "HealthArray": "",
                "PrevAnesthesia": "",
                "AssessmentsASA": "",
                "AnesthesiaPlan": "",
                "IsRespiratoryNormal": $scope.PreAdmAnesthetistObj.IsRespiratoryNormal,
                "RespiratoryNotes": $scope.PreAdmAnesthetistObj.RespiratoryNotes || "",
                "IsCNSHistory": $scope.PreAdmAnesthetistObj.IsCNSHistory,
                "IsCardiovascularHistory": $scope.PreAdmAnesthetistObj.IsCardiovascularHistory,
                "CNSNotes": $scope.PreAdmAnesthetistObj.CNSNotes || "",
                "SocialNotes": $scope.PreAdmAnesthetistObj.SocialNotes || "",
                "IsCardiacWNL": $scope.PreAdmAnesthetistObj.IsCardiacWNL,
                "CardiacNotes": $scope.PreAdmAnesthetistObj.CardiacNotes || "",
                "IsPulmonaryWNL": $scope.PreAdmAnesthetistObj.IsPulmonaryWNL,
                "PulmonaryNotes": $scope.PreAdmAnesthetistObj.PulmonaryNotes || "",
                "IsHepaticWNL": $scope.PreAdmAnesthetistObj.IsHepaticWNL,
                "HepaticNotes": $scope.PreAdmAnesthetistObj.HepaticNotes || "",
                "IsEndocrineWNL": $scope.PreAdmAnesthetistObj.IsEndocrineWNL,
                "EndocrineNotes": $scope.PreAdmAnesthetistObj.EndocrineNotes || "",
                "IsNeurologicWNL": $scope.PreAdmAnesthetistObj.IsNeurologicWNL,
                "NeurologicNotes": $scope.PreAdmAnesthetistObj.NeurologicNotes || "",
                "IsHemeOncWNL": $scope.PreAdmAnesthetistObj.IsHemeOncWNL,
                "HemeOncNotes": $scope.PreAdmAnesthetistObj.HemeOncNotes || "",
                "IsNervousSystemWNL": $scope.PreAdmAnesthetistObj.IsNervousSystemWNL,
                "NervousSystemNotes": $scope.PreAdmAnesthetistObj.NervousSystemNotes || "",
                "IsKidneyDiseaseWNL": $scope.PreAdmAnesthetistObj.IsKidneyDiseaseWNL,
                "KidneyDiseaseNotes": $scope.PreAdmAnesthetistObj.KidneyDiseaseNotes || "",
                "IsMusculoSkeletalSystemWNL": $scope.PreAdmAnesthetistObj.IsMusculoSkeletalSystemWNL,
                "MusculoSkeletalSystemNotes": $scope.PreAdmAnesthetistObj.MusculoSkeletalSystemNotes || "",
                "IsAutoImmuneDisordersWNL": $scope.PreAdmAnesthetistObj.IsAutoImmuneDisordersWNL,
                "AutoImmuneDisordersNotes": $scope.PreAdmAnesthetistObj.AutoImmuneDisordersNotes || "",
                "IsPsychosisWNL": $scope.PreAdmAnesthetistObj.IsPsychosisWNL,
                "PsychosisNotes": $scope.PreAdmAnesthetistObj.PsychosisNotes || "",
                "IsOthersWNL": $scope.PreAdmAnesthetistObj.IsOthersWNL,
                "OthersNotes": $scope.PreAdmAnesthetistObj.OthersNotes || "",
                "IsHeentWNL": $scope.PreAdmAnesthetistObj.IsHeentWNL,
                "HeentNotes": $scope.PreAdmAnesthetistObj.HeentNotes || "",
                "IsLungsWNL": $scope.PreAdmAnesthetistObj.IsLungsWNL,
                "LungsNotes": $scope.PreAdmAnesthetistObj.LungsNotes || "",
                "ReviwedBy": 0,
                "TempDocumentDetails": [],
                "DocumentDetails": [],
                "ConsentFormSignDate": $filter('date')($scope.currentDate, "yyyy-MM-dd"),
                "PreAdmissionStatusId": $scope.PreAdmAnesthetistObj.PreAdmissionStatusId || null,
                "PreAdmissionStatus": $scope.PreAdmAnesthetistObj.PreAdmissionStatus || "",
                "ConsentFormSignDate": $filter('date')($scope.currentDate, "yyyy-MM-dd"),
                "PreAdmissionChartStatus": (str === "SignOff") ? "E" : "D",
                "StatusFlag": $scope.PreAdmAnesthetistObj.StatusFlag || "D",
                "ReviewedDate": ReviewedDate || null,
                "AnesthesiaTypelist": $scope.PreAdmAnesthetistObj.AnesthesiaTypelist || [],
                "HealthArray": $scope.cacheStorageItem.HealthArray || [],
                "ROSOverAllRemarks": $scope.PreAdmAnesthetistObj.ROSOverAllRemarks || "",
                "IsCXR": $scope.PreAdmAnesthetistObj.IsCXR || "",
                "CXRHistory": $scope.PreAdmAnesthetistObj.CXRHistory || "",
                "PrescriptionArray": $scope.PreAdmAnesthetistObj.PrescriptionDetails || [],
                "OtherSystemArray": $scope.AnethesiaOtherSystemsArrayList || []
            };
            reqObj.VitalsArray = $scope.PreAdmAnesthetistObj.Vitals;
            reqObj.SystemicHistory = $scope.PreAdmAnesthetistObj.SystemicHistory;
            reqObj.AllergyItems = $scope.PreAdmAnesthetistObj.AllergyItems;
            reqObj.SurgicalHistory = $scope.PreAdmAnesthetistObj.SurgicalHistory;
            reqObj.LabTest = $scope.PreAdmAnesthetistObj.LabObj;
            reqObj.Airway = $scope.PreAdmAnesthetistObj.AirwayObj;
            reqObj.CardioVascular = $scope.PreAdmAnesthetistObj.CardioVascularObj;

            //let tempHealthArray = angular.copy($scope.PreAdmAnesthetistObj.HealthArray);
            //tempHealthArray = $filter('filter')(tempHealthArray, { 'IsChecked': true }, true);
            let tempHealthArray = angular.copy($scope.PreAdmAnesthetistObj.HealthArray);
            tempHealthArray = $filter('filter')(tempHealthArray, function (item) {
                return item.IsChecked !== null;
            });

            reqObj.HealthArray = angular.copy(tempHealthArray);

            reqObj.PrevAnesthesia = $scope.PreAdmAnesthetistObj.PrevAnestheticsObj;
            reqObj.AssessmentsASA = $scope.PreAdmAnesthetistObj.ASAObj;
            reqObj.AnesthesiaPlan = $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj;

            reqObj.OrganizationSurgeryId = $scope.SurgeryDiagnosisObj.OrganizationSurgeryId;
            reqObj.SurgeryId = $scope.SurgeryDiagnosisObj.SurgeryId;
            reqObj.OrganizationDiagnosisId = $scope.SurgeryDiagnosisObj.OrganizationDiagnosisId;
            reqObj.DiagnosisId = $scope.SurgeryDiagnosisObj.DiagnosisId;
            reqObj.PatientAppointmentsDetails = {
                "AscAppointmentId": $scope.PreAdmAnesthetistObj.AscAppointmentId || 0,
                "AscAppointmentDate": $filter('date')($scope.PreAdmAnesthetistObj.AscAppointmentDate, "yyyy-MM-dd") || null,
                "FirstFollowupDate": $filter('date')($scope.PreAdmAnesthetistObj.FirstFollowupDate, "yyyy-MM-dd") || null,
                "FirstFollowupApptId": $scope.PreAdmAnesthetistObj.FirstFollowupApptId || 0,
                "SecondFollowupDate": $filter('date')($scope.PreAdmAnesthetistObj.SecondFollowupDate, "yyyy-MM-dd") || null,
                "SecondFollowupApptId": $scope.PreAdmAnesthetistObj.SecondFollowupApptId || 0,
                "ThirdFollowupDate": $filter('date')($scope.PreAdmAnesthetistObj.ThirdFollowupDate, "yyyy-MM-dd") || null,
                "ThirdFollowupApptId": $scope.PreAdmAnesthetistObj.ThirdFollowupApptId || 0
            };

            reqObj.CurrentSystemicMedicationsList = $scope.PreAdmAnesthetistObj.CurrentSystemicMedicationsHistory;
            reqObj.CurrentEyeMedicationsList = $scope.PreAdmAnesthetistObj.CurrentEyeMedications;
            reqObj.InvestigationsList = $scope.PreAdmAnesthetistObj.InvestigationsList;

            reqObj.ReviwedBy = $scope.PreAdmAnesthetistObj.ReviewedBy;
            console.log(JSON.stringify(reqObj));

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

            eHnoteSurgeryService.AddUpdatePreAdmissionDetails(reqObj, callbackSuccess, callbackError);
            /*console.log(response);*/
            function callbackSuccess(response) {
                if (response.Status === "Success") {
                    alertify.success("Pre-anesthesia data saved successfully!");
                    $scope.PreAdmAnesthetistObj.PreAdmissionId = response.PreAdmissionId;
                    $scope.PreAdmObj.IsEdit = false;
                    $scope.init();
                } else {
                    alertify.error("Some Error Occured");
                }
            };
            function callbackError(err) {
                alertify.error("Uploading Failed");
            }
        }

        $scope.GetFilesObj = function () {
            return {
                "DocumentDetails": [],
                "TempImagesArray": []
            };
        };

        $scope.FilesObj = angular.copy($scope.GetFilesObj());
        $scope.selectedImgs = function (files) {

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
                        var obj = {
                            "file": $scope.file,
                            "S3URL": "",
                            "DeleteInd": false,
                            "DocumentID": 0,
                            "DocumentName": $scope.file.name || "",
                            "FileName": $scope.file.name || "",
                            "FileExt": $scope.file.type,
                            "FileTypeId": parseInt($scope.SelectedFile),
                            "DisplayName": $scope.file.name || ""
                        };

                        $scope.FilesObj.TempImagesArray.push(obj);


                        angular.element("input[type='file']").val(null);
                    }
                });
            }
        };

        $scope.DeleteUploadedFileNew = function (item, index, mainitem) {
            if (item.DocumentID == 0) {
                $scope.FilesObj.TempImagesArray.splice(index, 1);
            }
        }
        $scope.GetPatientPreAdmissionDetailsForDocument = function () {
            let appointmentId;
            if ($scope.cacheStorageItem.AppointmentTypeId === 4 || $scope.cacheStorageItem.AppointmentTypeId === 14) {
                appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
            }
            if ($scope.cacheStorageItem.AppointmentTypeId === 7 || $scope.cacheStorageItem.AppointmentTypeId === 6) {
                appointmentId = $scope.cacheStorageItem.AppointmentId;
            }
            $scope.ReqObj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": appointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                //"PatientSurgeryId": $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId,
            };
            eHnoteSurgeryService.GetPatientPreAdmissionDetails($scope.ReqObj).then(function (response) {

                if (response.data.status === "Success") {
                    response.data.DocumentDetails = response.data.DocumentDetails || [];
                    if (response.data.DocumentDetails.length > 0) {
                        $scope.PreAdmAnesthetistObj.DocumentDetails = angular.copy(response.data.DocumentDetails);
                    }
                    else {
                        $scope.PreAdmAnesthetistObj.DocumentDetails = [];
                    }
                }
            }, function (err) {
                console.log(err);
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
                    /* $scope.init();*/
                    $scope.GetPatientPreAdmissionDetailsForDocument();
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

            var obj = {
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientName": $scope.MainObj.PatientDetails.FullName || '',
                "Tab": "ASCFileUploads",
                "SignedDate": $filter('date')($scope.currentDate, "yyyy-MM-dd"),
                "FileTypeId": parseInt($scope.SelectedFile),
                "FileName": '',
                "DisplayName": ''
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
                $scope.init();

            }, function (cancel) {
            });

        }

        $scope.CardiologyScanFiles = function (type) {
            $scope.SelectedFile = null;
            if (type == 1) {
                $scope.SelectedFile = 27;
            } else if (type == 2) {
                $scope.SelectedFile = 28;
            }

            var obj = {
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientName": $scope.MainObj.PatientDetails.FullName || '',
                "Tab": "ASCFileUploads",
                "SignedDate": $filter('date')($scope.currentDate, "yyyy-MM-dd"),
                "FileTypeId": parseInt($scope.SelectedFile),
                "FileName": '',
                "DisplayName": ''
            }

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/PatientDocumentScanner.html",
                "backdrop": "static",
                "scope": $scope,
                "size": "md",
                "resolve": {
                    "mainObject": function () { return obj; }
                },
                "windowClass": "modal__eighty-- zindexpopup",
                "keyboard": false,
                "controller": "DocumentScannerCtrl",
            });
            $scope.mInstanceAdd.result.then(function (data) {
                console.log(data);
                $scope.GetPreAdmissionCardiologistDetails();

            }, function (cancel) {
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
                $scope.PreAdmAnesthetistObj.SelectedCardiacIssues = tempCardiacArray.join(", ");
            } else {
                $scope.PreAdmAnesthetistObj.SelectedCardiacIssues = "";
            }
            if (tempPulmonaryArray.length > 0) {
                $scope.PreAdmAnesthetistObj.SelectedPulmonaryIssues = tempPulmonaryArray.join(", ");
            } else {
                $scope.PreAdmAnesthetistObj.SelectedPulmonaryIssues = "";
            }
            if (tempHepaticArray.length > 0) {
                $scope.PreAdmAnesthetistObj.SelectedHepaticIssues = tempHepaticArray.join(", ");
            } else {
                $scope.PreAdmAnesthetistObj.SelectedHepaticIssues = "";
            }
            if (tempEndocrineArray.length > 0) {
                $scope.PreAdmAnesthetistObj.SelectedEndocrineIssues = tempEndocrineArray.join(", ");
            } else {
                $scope.PreAdmAnesthetistObj.SelectedEndocrineIssues = "";
            }
            if (tempNeurologicArray.length > 0) {
                $scope.PreAdmAnesthetistObj.SelectedNeurologicIssues = tempNeurologicArray.join(", ");
            } else {
                $scope.PreAdmAnesthetistObj.SelectedNeurologicIssues = "";
            }
            if (tempHemeOneArray.length > 0) {
                $scope.PreAdmAnesthetistObj.SelectedHemeOncIssues = tempHemeOneArray.join(", ");
            } else {
                $scope.PreAdmAnesthetistObj.SelectedHemeOncIssues = "";
            }
            if (tempNervousSystemArray.length > 0) {
                $scope.PreAdmAnesthetistObj.SelectedNervousSystemIssues = tempNervousSystemArray.join(", ");
            } else {
                $scope.PreAdmAnesthetistObj.SelectedNervousSystemIssues = "";
            }
            if (tempKidneyDiseaseArray.length > 0) {
                $scope.PreAdmAnesthetistObj.SelectedKidneyDiseaseIssues = tempKidneyDiseaseArray.join(", ");
            } else {
                $scope.PreAdmAnesthetistObj.SelectedKidneyDiseaseIssues = "";
            }
            if (tempMusculoSkeletalArray.length > 0) {
                $scope.PreAdmAnesthetistObj.SelectedMusculoSkeletalSystemIssues = tempMusculoSkeletalArray.join(", ");
            } else {
                $scope.PreAdmAnesthetistObj.SelectedMusculoSkeletalSystemIssues = "";
            }
            if (tempAutoImmuneArray.length > 0) {
                $scope.PreAdmAnesthetistObj.SelectedAutoImmuneDisordersIssues = tempAutoImmuneArray.join(", ");
            } else {
                $scope.PreAdmAnesthetistObj.SelectedAutoImmuneDisordersIssues = "";
            }
            if (tempPsychosisArray.length > 0) {
                $scope.PreAdmAnesthetistObj.SelectedPsychosisIssues = tempPsychosisArray.join(", ");
            } else {
                $scope.PreAdmAnesthetistObj.SelectedPsychosisIssues = "";
            }
            if (tempOthersArray.length > 0) {
                $scope.PreAdmAnesthetistObj.SelectedOthersIssues = tempOthersArray.join(", ");
            } else {
                $scope.PreAdmAnesthetistObj.SelectedOthersIssues = "";
            }
            if (respiratoryArray.length > 0) {
                $scope.PreAdmAnesthetistObj.SelectedrespIssues = respiratoryArray.join(", ");
            } else {
                $scope.PreAdmAnesthetistObj.SelectedrespIssues = "";
            }
            if (socialArray.length > 0) {
                $scope.PreAdmAnesthetistObj.SelectedsocialIssues = socialArray.join(", ");
            } else {
                $scope.PreAdmAnesthetistObj.SelectedsocialIssues = "";
            }
            if (HeentArray.length > 0) {
                $scope.PreAdmAnesthetistObj.SelectedHeentIssues = HeentArray.join(", ");
            } else {
                $scope.PreAdmAnesthetistObj.SelectedHeentIssues = "";
            }
            if (LungsArray.length > 0) {
                $scope.PreAdmAnesthetistObj.SelectedLungsIssues = LungsArray.join(", ");
            } else {
                $scope.PreAdmAnesthetistObj.SelectedLungsIssues = "";
            }


        }

        $scope.OnSelectSurgery = function (obj) {
            obj = obj || "";
            //if (obj != "") {
            //    $scope.init();
            //}

            if ($scope.NavObj.IsAnesthetistEvaluationTab) {
                $scope.GetPatientPreAdmissionDetails();
            } else {
                $scope.GetPreAdmissionCardiologistDetails();
            }
        };
        $scope.OpenVitalsPopUp = function () {
            let givenVitalsArray = angular.copy($scope.PreAdmAnesthetistObj.Vitals);
            let PerformedByArray = angular.copy($scope.PerformedByArray);
            let TypeObj = {
                "TypeId": 2,
                "TypeName": "Anesthesia PreAdmission"
            }
            let modalInstance = $uibModal.open({
                "templateUrl": "templates/ASC/ASCVitalsPopUp.html",
                "controller": "USASCVitalsPopUpCtrl",
                "resolve": {
                    "VitalsArrayList": function () { return givenVitalsArray || []; },
                    "PerformedByArray": function () { return PerformedByArray || []; },
                    "allUserList": function () { return $scope.allUserList || {}; },
                    "UserId": function () { return $scope.UserId || {}; },
                    "VitalInd": function () { return false },
                    "TypeObj": function () { return TypeObj },
                },               
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                "backdrop": "static",
                //"scope": $scope,
                "keyboard": false
            });
            modalInstance.result.then(function (data) {
                $scope.PreAdmAnesthetistObj.Vitals = angular.copy(data);

            }, function (cancel) {

            });
        };

        $scope.changeDateOfSurgery = function (surgeryDt, item) {
            var FirstFollowupDate = moment(surgeryDt).add(1, 'days').format('MM-DD-YYYY');
            var SecondFollowupDate = moment(surgeryDt).add(7, 'days').format('MM-DD-YYYY');
            var ThirdFollowupDate = moment(surgeryDt).add(30, 'days').format('MM-DD-YYYY');
            item.FirstFollowupDate = FirstFollowupDate;
            item.SecondFollowupDate = SecondFollowupDate;
            item.ThirdFollowupDate = ThirdFollowupDate;
        };

        $scope.OnSelectPreAdmissionStatus = function (Id) {
            $scope.PreAdmAnesthetistObj.PreAdmissionStatusId = Id;
            if ($scope.PreAdmAnesthetistObj.PreAdmissionStatusId === 1) {
                $scope.PreAdmAnesthetistObj.PreAdmissionStatus = "Approved";
            } else if ($scope.PreAdmAnesthetistObj.PreAdmissionStatusId === 2) {
                $scope.PreAdmAnesthetistObj.PreAdmissionStatus = "Not Fit for Surgery";
            } else {
                $scope.PreAdmAnesthetistObj.PreAdmissionStatus = "Postpone Surgery";
            }

        };

        $scope.TimeStamp = function (index) {
            $scope.Vitals[index].Time = $filter('date')(new Date(), "hh:mm a");
        };

        $scope.PreAdmissionSummaryInds = function (type) {
            if (type == 'ROS Main') {
                if ($scope.PreAdmissionSummaryObj.IsPreAdmROSMainInd) {
                    $scope.PreAdmissionSummaryObj.IsPrAdmROSSystemicInd = true;
                    $scope.PreAdmissionSummaryObj.IsPrAdmROSSurgicalInd = true;
                    $scope.PreAdmissionSummaryObj.IsPrAdmROSAllergiesInd = true;
                }
                else {
                    $scope.PreAdmissionSummaryObj.IsPrAdmROSSystemicInd = false;
                    $scope.PreAdmissionSummaryObj.IsPrAdmROSSurgicalInd = false;
                    $scope.PreAdmissionSummaryObj.IsPrAdmROSAllergiesInd = false;
                }
            }
            if (type == 'Evaluation') {
                if ($scope.PreAdmissionSummaryObj.IsPreAdmEvaluationMainInd) {
                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = true;
                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = true;
                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationAirwayInd = true;
                }
                else {
                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = false;
                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = false;
                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationAirwayInd = false;
                }
            }
            if (type == 'Checklists') {
                if ($scope.PreAdmissionSummaryObj.IsPreAdmChecklistMainInd) {
                    $scope.PreAdmissionSummaryObj.IsPreAdmChecklistHealthPlanInd = true;
                }
                else {
                    $scope.PreAdmissionSummaryObj.IsPreAdmChecklistHealthPlanInd = false;

                }
            }
            if (type == 'PreSurgeryOrders') {
                if ($scope.PreAdmissionSummaryObj.IsPreAdmPreSurgeryOrdersMainInd) {
                    $scope.PreAdmissionSummaryObj.IsPreAdmPreSurgeryMedicationsInd = true;
                    $scope.PreAdmissionSummaryObj.IsPreAdmCurrentMedicationsInd = true;
                    $scope.PreAdmissionSummaryObj.IsPreAdmLabsInvestigationsInd = true;
                }
                else {
                    $scope.PreAdmissionSummaryObj.IsPreAdmPreSurgeryMedicationsInd = false;
                    $scope.PreAdmissionSummaryObj.IsPreAdmCurrentMedicationsInd = false;
                    $scope.PreAdmissionSummaryObj.IsPreAdmLabsInvestigationsInd = false;
                }
            }
            if (type == 'AnesthetistPlan') {
                if ($scope.PreAdmissionSummaryObj.IsPreAdmAnesthetistPlanMainInd) {
                    $scope.PreAdmissionSummaryObj.IsPreAdmPreviousAnestheticInd = true;
                    $scope.PreAdmissionSummaryObj.IsPreAdmAssessmentASAInd = true;
                    $scope.PreAdmissionSummaryObj.IsPreAdmAnestheticPlanInd = true;
                }
                else {
                    $scope.PreAdmissionSummaryObj.IsPreAdmPreviousAnestheticInd = false;
                    $scope.PreAdmissionSummaryObj.IsPreAdmAssessmentASAInd = false;
                    $scope.PreAdmissionSummaryObj.IsPreAdmAnestheticPlanInd = false;
                }
            }
        }

        $scope.PreAdmissionDynamicSummaryView = function (item) {

            if (item.PatientSurgeryId != '') {
                $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId = item.PatientSurgeryId;
            }
            $scope.GetPatientPreAdmissionDetails();
        }

        $scope.NavtoEditPreAdmissionData = function () {
            $scope.PreAdmObj.IsEdit = true;
            $scope.PreAdmObj.IsShow = false;
            $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;
            $scope.init();
        }

        $scope.UnSignPreAdmissionAppt = function () {
            let modalInstance = $uibModal.open({
                "templateUrl": "UnSignRemarksPopUp.html",
                "controller": function ($scope, $uibModal, $uibModalInstance) {

                    $scope.Obj = {
                        "Remarks": ""
                    };

                    $scope.ClosePopup = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.Unsign = function () {

                        if ($scope.Obj.Remarks === "") {
                            alertify.error("Please enter remarks!");
                            return;
                        }

                        let obj = {
                            "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                            "PatientId": $scope.cacheStorageItem.PatientID,
                            "UserId": $scope.UserId,
                            "PreAdmissionId": $scope.cacheStorageItem.PreAdmissionId,
                            "PatientASCPreOPId": 0,
                            "PatientASCIntraOPId": 0,
                            "PatientASCPostOPId": 0,
                            "StatusFlag": "E",
                            "Remarks": $scope.Obj.Remarks,
                            "Type": "PreAdmission" // "IntraOp", "PostOp"
                        };

                        eHnoteMainAppointmentService.AddAscUnsignDataLog(obj).then(function (resp) {
                            if (resp.data.Status === "Success") {
                                $uibModalInstance.close("close");
                            }
                        }, function (err) {
                            console.log(err);
                        });

                    };

                },
                "size": "md",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false
            });
            modalInstance.result.then(function (data) {
                $scope.PreAdmObj.IsEdit = true;
                $scope.PreAdmObj.IsShow = false;
                $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;
                $scope.init();
            }, function (cancel) {

            });
        };

        $scope.EditSurgery = function () {

            $scope.mInstanceAdd = $uibModal.open({
                templateUrl: "EditSurgeryStaff.html",
                "size": "lg",
                "resolve": {
                    "AllUserList": function () { return angular.copy($scope.allUserList); },
                    "AllAnesthetistList": function () { return $scope.AnesthetistArray; },
                    "AllNurseList": function () { return $scope.AllNurseList; },
                    "AppointmentId": function () { return $scope.cacheStorageItem.AppointmentId; },
                    "PatientSurgeryId": function () { return $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId; },
                    "SurgeonID": function () { return $scope.SurgeryDiagnosisObj.SelectedSurgery.DoctorId; },
                    "SurgeryList": function () { return $scope.PreAdmissionDetails.SurgeryList; },
                    "UserId": function () { return $scope.UserId; },
                    "SurgeryDiagnosisObj": function () { return $scope.SurgeryDiagnosisObj; }
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, AllUserList, AllAnesthetistList, AllNurseList, AppointmentId, PatientSurgeryId, SurgeonID, SurgeryDiagnosisObj, UserId) {
                    $scope.EditSurgeryObj = {
                        "AllUserList": [],
                        "AllAnesthetistList": [],
                        "AllNurseList": [],
                        "UserID": null,
                        "AnesthetistID": null,
                        "NurseID": null
                    }

                    $scope.EditSurgeryObj.AllUserList = AllUserList;
                    $scope.EditSurgeryObj.AllAnesthetistList = AllAnesthetistList;
                    $scope.EditSurgeryObj.AllNurseList = AllNurseList;
                    SurgeryDiagnosisObj.SurgeonID = SurgeryDiagnosisObj.SurgeonID || '';
                    if (SurgeryDiagnosisObj.SurgeonID != '') {
                        $scope.EditSurgeryObj.SurgeonID = SurgeryDiagnosisObj.SurgeonID;
                    } else {
                        $scope.EditSurgeryObj.SurgeonID = SurgeonID;
                    }
                    $scope.EditSurgeryObj.AnesthetistID = SurgeryDiagnosisObj.AnesthetistID;
                    $scope.EditSurgeryObj.NurseID = SurgeryDiagnosisObj.NurseID;

                    $scope.SaveEditSurgeryStaff = function (item) {
                        var obj = {
                            "PatientSurgeryID": PatientSurgeryId,
                            "AppointmentID": AppointmentId,
                            "AnesthetistID": item.AnesthetistID,
                            "NurseID": item.NurseID,
                            "SurgeonID": item.SurgeonID,
                            "UserId": UserId,
                            "AppointmentTypeId": 7,
                            "Logs": {},
                        };
                        eHnoteSurgeryService.AddUpdateSurgeryStaffList(obj).then(function (response) {
                            console.log(response);
                            if (response.data.status === "Success") {
                                $uibModalInstance.close(response);
                            }
                        });
                    };

                    $scope.close = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
            $scope.mInstanceAdd.result.then(function (data) {
                if (data.data.status === "Success") {
                    $scope.init();
                }
            }, function (cancel) {

            });
        }

        $scope.ConvertDate = function (Data) {
            if (Data.length > 0) {
                angular.forEach(Data, function (item) {
                    item.Duration = item.Duration || null;
                    if (item.Duration == null) {
                        item.DurationType = 'D';
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1; //January is 0!
                        var yyyy = today.getFullYear();
                        if (dd < 10) {
                            dd = '0' + dd
                        }
                        if (mm < 10) {
                            mm = '0' + mm
                        }
                        today = yyyy + '/' + mm + '/' + dd;
                        var date2 = new Date(today);
                        var todate = $filter('date')(item.DurationDate, "yyyy/MM/dd");
                        var date1 = new Date(todate);
                        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                        $scope.dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        item.Duration = $scope.dayDifference;
                        item.Duration = item.Duration || '';
                    }
                });
            }
        }
        $scope.Ascpreadminsurgerytable = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/Ascpreadminsurgery.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };
        $scope.Labpopup = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/Labpopup.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };
        $scope.healthandphysicalpopup = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/healthandphysicalpopup.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };

        $scope.changeDateOfSurgery = function (surgeryDt, item) {
            var FirstFollowupDate = moment(surgeryDt).add(1, 'days').format('MM-DD-YYYY');
            var SecondFollowupDate = moment(surgeryDt).add(7, 'days').format('MM-DD-YYYY');
            var ThirdFollowupDate = moment(surgeryDt).add(30, 'days').format('MM-DD-YYYY');
            item.FirstFollowupDate = FirstFollowupDate;
            item.SecondFollowupDate = SecondFollowupDate;
            item.ThirdFollowupDate = ThirdFollowupDate;
        };

        $scope.$watch("PreAdmAnesthetistObj", function (newVal, oldVal) {
            if ($scope.PreAdmAnesthetistObj.SelectedCardiacIssues == "" && $scope.PreAdmAnesthetistObj.SelectedPulmonaryIssues == "" &&
                $scope.PreAdmAnesthetistObj.SelectedHepaticIssues == "" && $scope.PreAdmAnesthetistObj.SelectedEndocrineIssues == "" &&
                $scope.PreAdmAnesthetistObj.SelectedNeurologicIssues == "" && $scope.PreAdmAnesthetistObj.SelectedHemeOncIssues == "" &&
                $scope.PreAdmAnesthetistObj.SelectedNervousSystemIssues == "" && $scope.PreAdmAnesthetistObj.SelectedMusculoSkeletalSystemIssues == "" &&
                $scope.PreAdmAnesthetistObj.SelectedKidneyDiseaseIssues == "" && $scope.PreAdmAnesthetistObj.SelectedAutoImmuneDisordersIssues == "" &&
                $scope.PreAdmAnesthetistObj.SelectedPsychosisIssues == "" && $scope.PreAdmAnesthetistObj.SelectedOthersIssues == "" &&
                $scope.PreAdmAnesthetistObj.SelectedHeentIssues == "" && $scope.PreAdmAnesthetistObj.SelectedLungsIssues == "" &&
                !$scope.PreAdmAnesthetistObj.IsCardiacWNL && !$scope.PreAdmAnesthetistObj.IsPulmonaryWNL &&
                !$scope.PreAdmAnesthetistObj.IsHepaticWNL && !$scope.PreAdmAnesthetistObj.IsEndocrineWNL &&
                !$scope.PreAdmAnesthetistObj.IsNeurologicWNL && !$scope.PreAdmAnesthetistObj.IsHemeOncWNL &&
                !$scope.PreAdmAnesthetistObj.IsNervousSystemWNL && !$scope.PreAdmAnesthetistObj.IsKidneyDiseaseWNL &&
                !$scope.PreAdmAnesthetistObj.IsMusculoSkeletalSystemWNL && !$scope.PreAdmAnesthetistObj.IsAutoImmuneDisordersWNL &&
                !$scope.PreAdmAnesthetistObj.IsPsychosisWNL && !$scope.PreAdmAnesthetistObj.IsOthersWNL && !$scope.PreAdmAnesthetistObj.IsHeentWNL && !$scope.PreAdmAnesthetistObj.IsLungsWNL
            ) {
                $scope.PreAdmAnesthetistObj.ShowAdvanceHealthEdit = false;
            } else {
                $scope.PreAdmAnesthetistObj.ShowAdvanceHealthEdit = true;
            }
        }, true);

        $rootScope.$on("BookMultipleAppt", function (event, data) {
            console.log("____BookMultipleAppt____", data);
            if (data.TabIndex === 2) {
                $scope.PreAdmAnesthetistObj.AscAppointmentId = data.AppointmentId;
                $scope.PreAdmAnesthetistObj.AscAppointmentDate = data.AppointmentDate;
            }

            if (data.TabIndex === 3) {
                $scope.PreAdmAnesthetistObj.FirstFollowupApptId = data.AppointmentId;
                $scope.PreAdmAnesthetistObj.FirstFollowupDate = data.AppointmentDate;
            }
            if (data.TabIndex === 4) {
                $scope.PreAdmAnesthetistObj.SecondFollowupApptId = data.AppointmentId;
                $scope.PreAdmAnesthetistObj.SecondFollowupDate = data.AppointmentDate;
            }
            if (data.TabIndex === 5) {
                $scope.PreAdmAnesthetistObj.ThirdFollowupApptId = data.AppointmentId;
                $scope.PreAdmAnesthetistObj.ThirdFollowupDate = data.AppointmentDate;
            }

            //$scope.SavePreAdmissionDetails();

        });


        $scope.GetCardiologistFilesObj = function () {
            return {
                "DocumentDetails": [],
                "TempImagesArray": []
            };
        };

        $scope.CardiologistFilesObj = angular.copy($scope.GetCardiologistFilesObj());
        $scope.CardiologistselectedImgs = function (CardiologistFiles) {

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
                        var obj = {
                            "file": $scope.CardiologistFiles,
                            "S3URL": "",
                            "DeleteInd": false,
                            "DocumentID": 0,
                            "DocumentName": $scope.CardiologistFiles.name || "",
                            "FileName": $scope.CardiologistFiles.name || "",
                            "FileExt": $scope.CardiologistFiles.type,
                            "FileTypeId": 27,
                            "DisplayName": $scope.CardiologistFiles.name || ""
                        };

                        $scope.CardiologistFilesObj.TempImagesArray.push(obj);


                        angular.element("input[type='file']").val(null);
                    }
                });
            }
        };

        $scope.DeleteUploadedCardiologistFileNew = function (item, index, mainitem) {
            if (item.DocumentID == 0) {
                $scope.CardiologistFilesObj.TempImagesArray.splice(index, 1);
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

        $scope.UserDefineActiveTab();

        $scope.IsDiabetesEnable = "false";

        $scope.ChangeDiabetes = function (val, type) {
            if (type == 'Anesthesia') {
                if (val == 1) {
                    $scope.IsDiabetesEnable = "true";
                } else {
                    $scope.IsDiabetesEnable = "false";

                    $scope.PreAdmAnesthetistObj.LabObj.RBS = "";
                    $scope.PreAdmAnesthetistObj.LabObj.FBS = "";
                    $scope.PreAdmAnesthetistObj.LabObj.PBBS = "";
                    $scope.PreAdmAnesthetistObj.LabObj.PBLS = "";
                    $scope.PreAdmAnesthetistObj.LabObj.Others = "";

                }
            }

        }


        $scope.IsCardioDiabetesEnable = "false"

        $scope.DeleteHealthandPhysical = function (type, item, value) {
            if (type == 1) {
                angular.forEach(item.HealthArray, function (hitem) {
                    if (hitem.CategoryId == 1) {
                        hitem.IsChecked = null;
                    }
                });
                item.IsCardiacWNL = false;
                item.CardiacNotes = "";
                item.SelectedCardiacIssues = "";
            }
            if (type == 2) {
                angular.forEach(item.HealthArray, function (hitem) {
                    if (hitem.CategoryId == 2) {
                        hitem.IsChecked = null;
                    }
                });
                item.IsPulmonaryWNL = false;
                item.SelectedPulmonaryIssues = "";
                item.PulmonaryNotes = "";
            }
            if (type == 3) {
                angular.forEach(item.HealthArray, function (hitem) {
                    if (hitem.CategoryId == 3) {
                        hitem.IsChecked = null;
                    }
                });
                item.IsHepaticWNL = false;
                item.HepaticNotes = "";
                item.SelectedHepaticIssues = "";
            }
            if (type == 4) {
                angular.forEach(item.HealthArray, function (hitem) {
                    if (hitem.CategoryId == 4) {
                        hitem.IsChecked = null;
                    }
                });
                item.IsEndocrineWNL = false;
                item.EndocrineNotes = "";
                item.SelectedEndocrineIssues = "";
            }
            if (type == 5) {
                angular.forEach(item.HealthArray, function (hitem) {
                    if (hitem.CategoryId == 5) {
                        hitem.IsChecked = null;
                    }
                });
                item.IsNeurologicWNL = false;
                item.NeurologicNotes = "";
                item.SelectedNeurologicIssues = "";
            }
            if (type == 6) {
                angular.forEach(item.HealthArray, function (hitem) {
                    if (hitem.CategoryId == 6) {
                        hitem.IsChecked = null;
                    }
                });
                item.IsHemeOncWNL = false;
                item.HemeOncNotes = "";
                item.SelectedHemeOncIssues = "";
            }
            if (type == 7) {
                angular.forEach(item.HealthArray, function (hitem) {
                    if (hitem.CategoryId == 7) {
                        hitem.IsChecked = null;
                    }
                });
                item.IsNervousSystemWNL = false;
                item.NervousSystemNotes = "";
                item.SelectedNervousSystemIssues = "";
            }
            if (type == 8) {
                angular.forEach(item.HealthArray, function (hitem) {
                    if (hitem.CategoryId == 9) {
                        hitem.IsChecked = null;
                    }
                });
                item.IsMusculoSkeletalSystemWNL = false;
                item.MusculoSkeletalSystemNotes = "";
                item.SelectedMusculoSkeletalSystemIssues = "";
            }
            if (type == 9) {
                angular.forEach(item.HealthArray, function (hitem) {
                    if (hitem.CategoryId == 8) {
                        hitem.IsChecked = null;
                    }
                });
                item.IsKidneyDiseaseWNL = false;
                item.KidneyDiseaseNotes = "";
                item.SelectedKidneyDiseaseIssues = "";
            }
            if (type == 10) {
                angular.forEach(item.HealthArray, function (hitem) {
                    if (hitem.CategoryId == 10) {
                        hitem.IsChecked = null;
                    }
                });
                item.IsAutoImmuneDisordersWNL = false;
                item.AutoImmuneDisordersNotes = "";
                item.SelectedAutoImmuneDisordersIssues = "";
            }
            if (type == 11) {
                angular.forEach(item.HealthArray, function (hitem) {
                    if (hitem.CategoryId == 11) {
                        hitem.IsChecked = null;
                    }
                });
                item.IsPsychosisWNL = false;
                item.PsychosisNotes = "";
                item.SelectedPsychosisIssues = "";
            }
            if (type == 12) {
                angular.forEach(item.HealthArray, function (hitem) {
                    if (hitem.CategoryId == 12) {
                        hitem.IsChecked = null;
                    }
                });
                item.IsOthersWNL = false;
                item.OthersNotes = "";
                item.SelectedOthersIssues = "";
            }
            if (type == 13) {
                angular.forEach(item.HealthArray, function (hitem) {
                    if (hitem.CategoryId == 16) {
                        hitem.IsChecked = null;
                    }
                });
                item.IsHeentWNL = false;
                item.HeentNotes = "";
                item.SelectedHeentIssues = "";
            }
            if (type == 14) {
                angular.forEach(item.HealthArray, function (hitem) {
                    if (hitem.CategoryId == 17) {
                        hitem.IsChecked = null;
                    }
                });
                item.IsLungsWNL = false;
                item.LungsNotes = "";
                item.SelectedLungsIssues = "";
            }
        }


        $scope.$watch("PreAdmAnesthetistObj", function (newVal, oldVal) {
            $scope.PreAdmAnesthetistObj.IsAdvanceAnestInd = false;
            // condition
            if ((($scope.PreAdmAnesthetistObj.IsCardiacWNL == false && $scope.PreAdmAnesthetistObj.SelectedCardiacIssues !== '') || $scope.PreAdmAnesthetistObj.IsCardiacWNL) ||
                (($scope.PreAdmAnesthetistObj.IsPulmonaryWNL == false && $scope.PreAdmAnesthetistObj.SelectedPulmonaryIssues !== '') || $scope.PreAdmAnesthetistObj.IsPulmonaryWNL) ||
                (($scope.PreAdmAnesthetistObj.IsHepaticWNL && $scope.PreAdmAnesthetistObj.SelectedHepaticIssues !== '') || $scope.PreAdmAnesthetistObj.IsHepaticWNL) ||
                (($scope.PreAdmAnesthetistObj.IsEndocrineWNL == false && $scope.PreAdmAnesthetistObj.SelectedEndocrineIssues !== '') || $scope.PreAdmAnesthetistObj.IsEndocrineWNL) ||
                (($scope.PreAdmAnesthetistObj.IsNeurologicWNL == false && $scope.PreAdmAnesthetistObj.SelectedNeurologicIssues !== '') || $scope.PreAdmAnesthetistObj.IsNeurologicWNL) ||
                (($scope.PreAdmAnesthetistObj.IsHemeOncWNL == false && $scope.PreAdmAnesthetistObj.SelectedHemeOncIssues !== '') || $scope.PreAdmAnesthetistObj.IsHemeOncWNL) ||
                (($scope.PreAdmAnesthetistObj.IsNervousSystemWNL == false && $scope.PreAdmAnesthetistObj.SelectedNervousSystemIssues !== '') || $scope.PreAdmAnesthetistObj.IsNervousSystemWNL) ||
                (($scope.PreAdmAnesthetistObj.IsMusculoSkeletalSystemWNL == false && $scope.PreAdmAnesthetistObj.SelectedMusculoSkeletalSystemIssues !== '') || $scope.PreAdmAnesthetistObj.IsMusculoSkeletalSystemWNL) ||
                (($scope.PreAdmAnesthetistObj.IsKidneyDiseaseWNL == false && $scope.PreAdmAnesthetistObj.SelectedKidneyDiseaseIssues !== '') || $scope.PreAdmAnesthetistObj.IsKidneyDiseaseWNL) ||
                (($scope.PreAdmAnesthetistObj.IsAutoImmuneDisordersWNL == false && $scope.PreAdmAnesthetistObj.SelectedAutoImmuneDisordersIssues !== '') || $scope.PreAdmAnesthetistObj.IsAutoImmuneDisordersWNL) ||
                (($scope.PreAdmAnesthetistObj.IsPsychosisWNL == false && $scope.PreAdmAnesthetistObj.SelectedPsychosisIssues !== '') || $scope.PreAdmAnesthetistObj.IsPsychosisWNL) ||
                (($scope.PreAdmAnesthetistObj.IsOthersWNL == false && $scope.PreAdmAnesthetistObj.SelectedOthersIssues !== '') || $scope.PreAdmAnesthetistObj.IsOthersWNL) ||
                (($scope.PreAdmAnesthetistObj.IsHeentWNL == false && $scope.PreAdmAnesthetistObj.SelectedHeentIssues !== '') || $scope.PreAdmAnesthetistObj.IsHeentWNL) ||
                (($scope.PreAdmAnesthetistObj.IsLungsWNL == false && $scope.PreAdmAnesthetistObj.SelectedLungsIssues !== '') || $scope.PreAdmAnesthetistObj.IsLungsWNL)
            ) {
                $scope.PreAdmAnesthetistObj.IsAdvanceAnestInd = true;
            } else {
                $scope.PreAdmAnesthetistObj.IsAdvanceAnestInd = false;
            }
        }, true);


            $scope.HealthandPhysicalAllDelete = function () {

                $scope.PreAdmAnesthetistObj.HealthArray = $scope.PreAdmAnesthetistObj.HealthArray || [];
                if ($scope.PreAdmAnesthetistObj.HealthArray.length > 0) {
                    angular.forEach($scope.PreAdmAnesthetistObj.HealthArray, function (hitem) {
                        if (hitem.CategoryId == 1) {
                            hitem.DeleteInd = hitem.IsChecked ? "Y" : "N";
                        }
                        if (hitem.CategoryId == 2) {
                            hitem.DeleteInd = hitem.IsChecked ? "Y" : "N";
                        }
                        if (hitem.CategoryId == 3) {
                            hitem.DeleteInd = hitem.IsChecked ? "Y" : "N";
                        }
                        if (hitem.CategoryId == 4) {
                            hitem.DeleteInd = hitem.IsChecked ? "Y" : "N";
                        }
                        if (hitem.CategoryId == 5) {
                            hitem.DeleteInd = hitem.IsChecked ? "Y" : "N";
                        }
                        if (hitem.CategoryId == 6) {
                            hitem.DeleteInd = hitem.IsChecked ? "Y" : "N";
                        }
                        if (hitem.CategoryId == 7) {
                            hitem.DeleteInd = hitem.IsChecked ? "Y" : "N";
                        }
                        if (hitem.CategoryId == 8) {
                            hitem.DeleteInd = hitem.IsChecked ? "Y" : "N";
                        }
                        if (hitem.CategoryId == 9) {
                            hitem.DeleteInd = hitem.IsChecked ? "Y" : "N";
                        }
                        if (hitem.CategoryId == 10) {
                            hitem.DeleteInd = hitem.IsChecked ? "Y" : "N";
                        }
                        if (hitem.CategoryId == 11) {
                            hitem.DeleteInd = hitem.IsChecked ? "Y" : "N";
                        }
                        if (hitem.CategoryId == 12) {
                            hitem.DeleteInd = hitem.IsChecked ? "Y" : "N";
                        }
                        if (hitem.CategoryId == 16) {
                            hitem.DeleteInd = hitem.IsChecked ? "Y" : "N";
                        }
                        if (hitem.CategoryId == 17) {
                            hitem.DeleteInd = hitem.IsChecked ? "Y" : "N";
                        }
                    });
                }
                $scope.PreAdmAnesthetistObj.IsCardiacWNL = false;
                $scope.PreAdmAnesthetistObj.SelectedCardiacIssues = "";
                $scope.PreAdmAnesthetistObj.CardiacNotes = "";
                $scope.PreAdmAnesthetistObj.IsPulmonaryWNL = false;
                $scope.PreAdmAnesthetistObj.SelectedPulmonaryIssues = "";
                $scope.PreAdmAnesthetistObj.PulmonaryNotes = "";
                $scope.PreAdmAnesthetistObj.IsHepaticWNL = false;
                $scope.PreAdmAnesthetistObj.HepaticNotes = "";
                $scope.PreAdmAnesthetistObj.SelectedHepaticIssues = "";
                $scope.PreAdmAnesthetistObj.IsEndocrineWNL = false;
                $scope.PreAdmAnesthetistObj.EndocrineNotes = "";
                $scope.PreAdmAnesthetistObj.SelectedEndocrineIssues = "";
                $scope.PreAdmAnesthetistObj.IsNeurologicWNL = false;
                $scope.PreAdmAnesthetistObj.NeurologicNotes = "";
                $scope.PreAdmAnesthetistObj.SelectedNeurologicIssues = "";
                $scope.PreAdmAnesthetistObj.IsHemeOncWNL = false;
                $scope.PreAdmAnesthetistObj.HemeOncNotes = "";
                $scope.PreAdmAnesthetistObj.SelectedHemeOncIssues = "";
                $scope.PreAdmAnesthetistObj.IsNervousSystemWNL = false;
                $scope.PreAdmAnesthetistObj.NervousSystemNotes = "";
                $scope.PreAdmAnesthetistObj.SelectedNervousSystemIssues = "";
                $scope.PreAdmAnesthetistObj.IsMusculoSkeletalSystemWNL = false;
                $scope.PreAdmAnesthetistObj.MusculoSkeletalSystemNotes = "";
                $scope.PreAdmAnesthetistObj.SelectedMusculoSkeletalSystemIssues = "";
                $scope.PreAdmAnesthetistObj.IsKidneyDiseaseWNL = false;
                $scope.PreAdmAnesthetistObj.KidneyDiseaseNotes = "";
                $scope.PreAdmAnesthetistObj.SelectedKidneyDiseaseIssues = "";
                $scope.PreAdmAnesthetistObj.IsAutoImmuneDisordersWNL = false;
                $scope.PreAdmAnesthetistObj.AutoImmuneDisordersNotes = "";
                $scope.PreAdmAnesthetistObj.SelectedAutoImmuneDisordersIssues = "";
                $scope.PreAdmAnesthetistObj.IsPsychosisWNL = false;
                $scope.PreAdmAnesthetistObj.PsychosisNotes = "";
                $scope.PreAdmAnesthetistObj.SelectedPsychosisIssues = "";
                $scope.PreAdmAnesthetistObj.IsOthersWNL = false;
                $scope.PreAdmAnesthetistObj.OthersNotes = "";
                $scope.PreAdmAnesthetistObj.SelectedOthersIssues = "";
                $scope.PreAdmAnesthetistObj.IsHeentWNL = false;
                $scope.PreAdmAnesthetistObj.HeentNotes = "";
                $scope.PreAdmAnesthetistObj.SelectedHeentIssues = "";
                $scope.PreAdmAnesthetistObj.IsLungsWNL = false;
                $scope.PreAdmAnesthetistObj.LungsNotes = "";
                $scope.PreAdmAnesthetistObj.SelectedLungsIssues = "";

                $scope.IsShowHealthandPhysicalDeleteInd = false;
            }

            $scope.AnesthesiaPlanSelect = function (item) {
                if (item.AnesthesiaTypeId == 1 && item.IsSelected == true) {
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsTopicalAnesthesia = true;
                } else if (item.AnesthesiaTypeId == 1 && item.IsSelected == false) {
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsTopicalAnesthesia = false;
                }
                if (item.AnesthesiaTypeId == 2 && item.IsSelected == true) {
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsLocalAnesthesia = true;
                } else if (item.AnesthesiaTypeId == 2 && item.IsSelected == false) {
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsLocalAnesthesia = false;
                }

                if (item.AnesthesiaTypeId == 3 && item.IsSelected == true) {
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsGeneralAnesthesia = true;
                } else if (item.AnesthesiaTypeId == 3 && item.IsSelected == false) {
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsGeneralAnesthesia = false;
                }

                if (item.AnesthesiaTypeId == 4 && item.IsSelected == true) {
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia = true;
                } else if (item.AnesthesiaTypeId == 4 && item.IsSelected == false) {
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia = false;
                }

                if (item.AnesthesiaTypeId == 5 && item.IsSelected == true) {
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsSubtenonAnesthesia = true;
                } else if (item.AnesthesiaTypeId == 5 && item.IsSelected == false) {
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsSubtenonAnesthesia = false;
                }
                if (item.AnesthesiaTypeId == 6 && item.IsSelected == true) {
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsRegionalAnesthesia = true;
                } else if (item.AnesthesiaTypeId == 6 && item.IsSelected == false) {
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsRegionalAnesthesia = false;
                }

            }

            $scope.RemoveVitalsData = function (item, index) {
                if (item.PatientPreAdmVitalId == 0) {
                    $scope.PreAdmAnesthetistObj.Vitals.splice(index, 1);
                } else {
                    item.DeleteInd = "Y";
                }
            }
            $scope.ClearAllergy = function (Aitem) {
                var index = $scope.PreAdmAnesthetistObj.AllergyItems.indexOf(Aitem);
                if (Aitem.PatientDetailId == 0) {
                    if (index > -1) {
                        $scope.PreAdmAnesthetistObj.AllergyItems.splice(index, 1);
                    }
                } else {
                    $scope.PreAdmAnesthetistObj.AllergyItems[index].DeleteInd = 'Y';
                }

            };
            $scope.ClearSystemicHistory = function (Aitem) {
                var index = $scope.PreAdmAnesthetistObj.SystemicHistory.indexOf(Aitem);
                if (Aitem.AllergyId == 0) {
                    if (index > -1) {
                        $scope.PreAdmAnesthetistObj.SystemicHistory.splice(index, 1);
                    }
                } else {
                    $scope.PreAdmAnesthetistObj.SystemicHistory[index].DeleteInd = 'Y';
                }

            };
            $scope.ClearSurgicalHistory = function (Aitem) {
                var index = $scope.PreAdmAnesthetistObj.SurgicalHistory.indexOf(Aitem);
                if (Aitem.AllergyId == 0) {
                    if (index > -1) {
                        $scope.PreAdmAnesthetistObj.SurgicalHistory.splice(index, 1);
                    }
                } else {
                    $scope.PreAdmAnesthetistObj.SurgicalHistory[index].DeleteInd = 'Y';
                }

            };

            $scope.ClearInvestigations = function (item, index) {
                if (item.PatientInvestigationId != 0) {
                    item.DeleteInd = "Y";
                } else {
                    $scope.PreAdmAnesthetistObj.InvestigationsList.splice(index, 1);
                }
            }
            $scope.ClearMedications = function (item, index) {
                if (item.ProcedureMedicationId != 0) {
                    item.DeleteInd = "Y";
                } else {
                    $scope.PreAdmAnesthetistObj.MedicationsList.splice(index, 1);
                }
            }
            $scope.ClearCurrentMedications = function (item, index) {
                if (item.ProcedureMedicationId != 0) {
                    item.DeleteInd = "Y";
                } else {
                    $scope.PreAdmAnesthetistObj.CurrentMedicationList.splice(index, 1);
                }
            }
            $scope.ClearPrescription = function (item, index) {

                if (item.PatientPrescriptionId != 0) {
                    item.DeleteInd = "Y";

                    if ($scope.PreAdmAnesthetistObj.PrescriptionDetails.length > 0) {
                        var Preslist = $filter("filter")($scope.PreAdmAnesthetistObj.PrescriptionDetails[0].PrescriptionDetails, { "DeleteInd": "N" }, true);
                        Preslist = Preslist || [];
                        if (Preslist.length === 0) {
                            angular.forEach($scope.PreAdmAnesthetistObj.PrescriptionDetails, function (item) {
                                item.DeleteInd = "Y";
                            });
                        }
                    }
                } else {
                    if ($scope.PreAdmAnesthetistObj.PrescriptionDetails.length > 0) {
                        var Prescriptlist = $filter("filter")($scope.PreAdmAnesthetistObj.PrescriptionDetails[0].PrescriptionDetails, { "MedicationId": item.MedicationId }, true);
                        Prescriptlist = Prescriptlist || [];
                        if (Prescriptlist.length > 0) {
                            $scope.PreAdmAnesthetistObj.PrescriptionDetails[0].PrescriptionDetails.splice(index, 1);
                        }
                        if ($scope.PreAdmAnesthetistObj.PrescriptionDetails[0].PrescriptionDetails.length === 0) {
                            $scope.PreAdmAnesthetistObj.PrescriptionDetails = [];
                        }
                    }
                }
            }

            $scope.showSelectedData = function () {
                var selectedData = [];

                if ($scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsFamilyHistory) {
                    selectedData.push('Family/pt History');
                }

                if ($scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsDifficultAirway) {
                    selectedData.push('Difficult airway');
                }

                if ($scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPONV) {
                    selectedData.push('PONV');
                }

                if ($scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPatientDNR) {
                    selectedData.push('Patient is DNR');
                }

                if ($scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsSuspend) {
                    selectedData.push('Suspend');
                }

                if ($scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsContinue) {
                    selectedData.push('Continue');
                }

                return selectedData.join(', ');
            };


            $scope.ChangeNormalLimit = function (item, type) {
                if (type == 'Anesthesia') {
                    if (item.Name == "Prothrombin Time") {
                        item.IsAbnormalChecked = false;
                    }
                    if (item.Name == "Partial Thromboplastin time") {
                        item.IsAbnormalChecked = false;
                    }
                    if (item.Name == "Li-Fraumeni Syndrome") {
                        item.IsAbnormalChecked = false;
                    }
                    if (item.Name != "" || item.Name == "") {
                        item.IsAbnormalChecked = false;
                    }
                } else {
                    if (item.Name == "Prothrombin Time") {
                        item.IsAbnormalChecked = false;
                    }
                    if (item.Name == "Partial Thromboplastin time") {
                        item.IsAbnormalChecked = false;
                    }
                    if (item.Name == "Li-Fraumeni Syndrome") {
                        item.IsAbnormalChecked = false;
                    }
                    if (item.Name != "") {
                        item.IsAbnormalChecked = false;
                    }
                    if (item.Name != "" || item.Name == "") {
                        item.IsAbnormalChecked = false;
                    }
                }
            }

            $scope.ChangeAbnormal = function (item, type) {
                if (type == 'Anesthesia') {
                    if (item.Name == "Prothrombin Time") {
                        item.IsNormalLimitsChecked = false;
                    }
                    if (item.Name == "Partial Thromboplastin time") {
                        item.IsNormalLimitsChecked = false;
                    }
                    if (item.Name == "Li-Fraumeni Syndrome") {
                        item.IsNormalLimitsChecked = false;
                    }
                    if (item.Name != "" || item.Name == "") {
                        item.IsNormalLimitsChecked = false;
                    }
                }
                else {
                    if (item.Name == "Prothrombin Time") {
                        item.IsNormalLimitsChecked = false;
                    }
                    if (item.Name == "Partial Thromboplastin time") {
                        item.IsNormalLimitsChecked = false;
                    }
                    if (item.Name == "Li-Fraumeni Syndrome") {
                        item.IsNormalLimitsChecked = false;
                    }
                    if (item.Name != "" || item.Name == "") {
                        item.IsNormalLimitsChecked = false;
                    }
                }
            }


            $scope.preadminpopupphysical = function () {
                let mInstanceAdd = $uibModal.open({
                    "templateUrl": "templates/uibpopups/preadminpopupphysical.html",
                    //"size": "lg",
                    "backdrop": "static",
                    "keyboard": false,
                    "scope": $scope,
                    // "windowClass": "inventory-full-popup",
                    "windowClass": "modal__popup--1 bottom-to-top-modal in",
                    "controller": function ($scope, $uibModalInstance, PreAdmAnesthetistObj, AnesthetistArray, DocumentList) {
                        $scope.PreAdmAnesthetistObj.DocumentDetails = DocumentList;
                        $scope.uibclose = function () {
                            $uibModalInstance.dismiss("cancel");
                        };

                        $scope.AnesthetistArray = angular.copy(AnesthetistArray);

                        $scope.HealthPhysicalModal = angular.copy(PreAdmAnesthetistObj);

                        $scope.SaveHealthandPhysical = function () {
                            $uibModalInstance.close($scope.HealthPhysicalModal);
                        };

                        $scope.SelectCNSBtn = function (val) {
                            if (val === 1) {
                                if ($scope.HealthPhysicalModal.IsCNSHistory == false && $scope.HealthPhysicalModal.IsCNSHistory != null) {
                                    $scope.HealthPhysicalModal.IsCNSHistory = null;
                                } else {
                                    $scope.HealthPhysicalModal.IsCNSHistory = false;
                                }
                            }
                            if (val === 2) {
                                if ($scope.HealthPhysicalModal.IsCNSHistory) {
                                    $scope.HealthPhysicalModal.IsCNSHistory = null;
                                } else {
                                    $scope.HealthPhysicalModal.IsCNSHistory = true;
                                }
                            }
                        };

                        $scope.OnClickNormal = function () {
                            if ($scope.HealthPhysicalModal.AirwayObj.IsNormal) {
                                $scope.HealthPhysicalModal.AirwayObj.ROMTMS = "Full";
                                $scope.HealthPhysicalModal.AirwayObj.ROMNECKAP = "Full";
                                $scope.HealthPhysicalModal.AirwayObj.ROMNECKLAT = "Full";
                            } else {
                                $scope.HealthPhysicalModal.AirwayObj.ROMTMS = "";
                                $scope.HealthPhysicalModal.AirwayObj.ROMNECKAP = "";
                                $scope.HealthPhysicalModal.AirwayObj.ROMNECKLAT = "";
                                //$scope.HealthPhysicalModal.AirwayObj.Class = "";
                            }
                        };

                        $scope.OnSelectPrevAnesthesiaBtn = function (val) {
                            if (val == 1) {
                                $scope.HealthPhysicalModal.PrevAnestheticsObj.IsPrevAnesthesia = true;
                            }
                            if (val == 2) {
                                $scope.HealthPhysicalModal.PrevAnestheticsObj.IsPrevAnesthesia = false;
                            }
                            if (val == 3) {
                                if ($scope.HealthPhysicalModal.PrevAnestheticsObj.IsComplications) {
                                    $scope.HealthPhysicalModal.PrevAnestheticsObj.IsComplications = null;
                                } else {
                                    $scope.HealthPhysicalModal.PrevAnestheticsObj.IsComplications = true;
                                }

                            }
                            if (val == 4) {
                                if ($scope.HealthPhysicalModal.PrevAnestheticsObj.IsComplications == false && $scope.HealthPhysicalModal.PrevAnestheticsObj.IsComplications != null) {
                                    $scope.HealthPhysicalModal.PrevAnestheticsObj.IsComplications = null;
                                } else {
                                    $scope.HealthPhysicalModal.PrevAnestheticsObj.IsComplications = false;
                                }
                            }
                        };

                        $scope.OnSelectAssessPlanOption = function (val) {
                            if (val == 1) {
                                $scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsTopicalAnesthesia = !$scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsTopicalAnesthesia;

                                if ($scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsTopicalAnesthesia) {
                                    let Anesthetistlist = $filter("filter")($scope.HealthPhysicalModal.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 1 });
                                    if (Anesthetistlist.length > 0) {
                                        Anesthetistlist[0].IsSelected = true;
                                    }
                                } else {
                                    let Anesthetistlist = $filter("filter")($scope.HealthPhysicalModal.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 1 });
                                    if (Anesthetistlist.length > 0) {
                                        Anesthetistlist[0].IsSelected = false;
                                    }
                                }
                            }
                            if (val == 2) {
                                $scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsLocalAnesthesia = !$scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsLocalAnesthesia;

                                if ($scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsLocalAnesthesia) {
                                    let Anesthetistlist = $filter("filter")($scope.HealthPhysicalModal.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 2 });
                                    if (Anesthetistlist.length > 0) {
                                        Anesthetistlist[0].IsSelected = true;
                                    }
                                } else {
                                    let Anesthetistlist = $filter("filter")($scope.HealthPhysicalModal.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 2 });
                                    if (Anesthetistlist.length > 0) {
                                        Anesthetistlist[0].IsSelected = false;
                                    }
                                }
                            }
                            if (val == 3) {
                                $scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsGeneralAnesthesia = !$scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsGeneralAnesthesia;

                                if ($scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsGeneralAnesthesia) {
                                    let Anesthetistlist = $filter("filter")($scope.HealthPhysicalModal.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 3 });
                                    if (Anesthetistlist.length > 0) {
                                        Anesthetistlist[0].IsSelected = true;
                                    }
                                } else {
                                    let Anesthetistlist = $filter("filter")($scope.HealthPhysicalModal.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 3 });
                                    if (Anesthetistlist.length > 0) {
                                        Anesthetistlist[0].IsSelected = false;
                                    }
                                }
                            }
                            if (val == 4) {
                                $scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsRegionalAnesthesia = !$scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsRegionalAnesthesia;

                                if ($scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsRegionalAnesthesia) {
                                    let Anesthetistlist = $filter("filter")($scope.HealthPhysicalModal.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 6 });
                                    if (Anesthetistlist.length > 0) {
                                        Anesthetistlist[0].IsSelected = true;
                                    }
                                } else {
                                    let Anesthetistlist = $filter("filter")($scope.HealthPhysicalModal.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 6 });
                                    if (Anesthetistlist.length > 0) {
                                        Anesthetistlist[0].IsSelected = false;
                                    }
                                }
                            }
                            if (val == 5) {
                                $scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia = !$scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia;

                                if ($scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia) {
                                    let Anesthetistlist = $filter("filter")($scope.HealthPhysicalModal.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 4 });
                                    if (Anesthetistlist.length > 0) {
                                        Anesthetistlist[0].IsSelected = true;
                                    }
                                } else {
                                    let Anesthetistlist = $filter("filter")($scope.HealthPhysicalModal.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 4 });
                                    if (Anesthetistlist.length > 0) {
                                        Anesthetistlist[0].IsSelected = false;
                                    }
                                }
                            }
                            if (val == 6) {
                                $scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsSubtenonAnesthesia = !$scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsSubtenonAnesthesia;

                                if ($scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsSubtenonAnesthesia) {
                                    let Anesthetistlist = $filter("filter")($scope.HealthPhysicalModal.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 5 });
                                    if (Anesthetistlist.length > 0) {
                                        Anesthetistlist[0].IsSelected = true;
                                    }
                                } else {
                                    let Anesthetistlist = $filter("filter")($scope.HealthPhysicalModal.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 5 });
                                    if (Anesthetistlist.length > 0) {
                                        Anesthetistlist[0].IsSelected = false;
                                    }
                                }
                            }
                            if (val == 7) {
                                $scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsIVSedation = !$scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsIVSedation;

                                if ($scope.HealthPhysicalModal.APAnesthesiaOptionsObj.IsIVSedation) {
                                    let Anesthetistlist = $filter("filter")($scope.HealthPhysicalModal.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 7 });
                                    if (Anesthetistlist.length > 0) {
                                        Anesthetistlist[0].IsSelected = true;
                                    }
                                } else {
                                    let Anesthetistlist = $filter("filter")($scope.HealthPhysicalModal.AnesthesiaTypelist, function (kitem) { return kitem.AnesthesiaTypeId == 7 });
                                    if (Anesthetistlist.length > 0) {
                                        Anesthetistlist[0].IsSelected = false;
                                    }
                                }
                            }
                        };

                        $scope.SelectTMS = function (val) {
                            if (val === 1) {
                                $scope.HealthPhysicalModal.AirwayObj.ROMTMS = "Full";
                            }
                            if (val === 2) {
                                $scope.HealthPhysicalModal.AirwayObj.ROMTMS = "Limited";
                                $scope.HealthPhysicalModal.AirwayObj.IsNormal = false;
                            }
                        };

                        $scope.RomNeckAP = function (val) {
                            if (val === 1) {
                                $scope.HealthPhysicalModal.AirwayObj.ROMNECKAP = "Full";
                            }
                            if (val === 2) {
                                $scope.HealthPhysicalModal.AirwayObj.ROMNECKAP = "Limited";
                                $scope.HealthPhysicalModal.AirwayObj.IsNormal = false;
                            }
                        };

                        $scope.RomNeckLAT = function (val) {
                            if (val === 1) {
                                $scope.HealthPhysicalModal.AirwayObj.ROMNECKLAT = "Full";
                            }
                            if (val === 2) {
                                $scope.HealthPhysicalModal.AirwayObj.ROMNECKLAT = "Limited";
                                $scope.HealthPhysicalModal.AirwayObj.IsNormal = false;
                            }
                        };

                        $scope.SelectClass = function (val) {
                            if (val === 1) {
                                $scope.HealthPhysicalModal.AirwayObj.Class = "1";
                            }
                            if (val === 2) {
                                $scope.HealthPhysicalModal.AirwayObj.Class = "2";
                            }
                            if (val === 3) {
                                $scope.HealthPhysicalModal.AirwayObj.Class = "3";
                            }
                            if (val === 4) {
                                $scope.HealthPhysicalModal.AirwayObj.Class = "4";
                            }
                        };

                        $scope.SelectCardiovascularHistoryBtn = function (val) {
                            if (val === 1) {
                                if ($scope.HealthPhysicalModal.IsCardiovascularHistory === false && $scope.HealthPhysicalModal.IsCardiovascularHistory != null) {
                                    $scope.HealthPhysicalModal.IsCardiovascularHistory = null;
                                } else {
                                    $scope.HealthPhysicalModal.IsCardiovascularHistory = false;
                                }
                            }
                            if (val === 2) {
                                if ($scope.HealthPhysicalModal.IsCardiovascularHistory) {
                                    $scope.HealthPhysicalModal.IsCardiovascularHistory = null;
                                } else {
                                    $scope.HealthPhysicalModal.IsCardiovascularHistory = true;
                                }
                            }
                        };

                        $scope.SelectUrineAnalysis = function (val) {
                            if (val == 1) {
                                if ($scope.HealthPhysicalModal.LabObj.UrineAnalysis == "" || $scope.HealthPhysicalModal.LabObj.UrineAnalysis == "NEGATIVE") {
                                    $scope.HealthPhysicalModal.LabObj.UrineAnalysis = "POSITIVE";
                                } else {
                                    $scope.HealthPhysicalModal.LabObj.UrineAnalysis = "";
                                }
                            }
                            if (val == 2) {
                                if ($scope.HealthPhysicalModal.LabObj.UrineAnalysis == "" || $scope.HealthPhysicalModal.LabObj.UrineAnalysis == "POSITIVE") {
                                    $scope.HealthPhysicalModal.LabObj.UrineAnalysis = "NEGATIVE";
                                } else {
                                    $scope.HealthPhysicalModal.LabObj.UrineAnalysis = "";
                                }
                            }
                        }

                        $scope.SelectBloodAvailability = function (val) {
                            if (val == 1) {
                                if ($scope.HealthPhysicalModal.LabObj.IsBloodAvailable == "" || $scope.HealthPhysicalModal.LabObj.IsBloodAvailable == "No") {
                                    $scope.HealthPhysicalModal.LabObj.IsBloodAvailable = "Yes";
                                } else {
                                    $scope.HealthPhysicalModal.LabObj.IsBloodAvailable = "";
                                }
                            }
                            if (val == 2) {
                                if ($scope.HealthPhysicalModal.LabObj.IsBloodAvailable == "" || $scope.HealthPhysicalModal.LabObj.IsBloodAvailable == "Yes") {
                                    $scope.HealthPhysicalModal.LabObj.IsBloodAvailable = "No";
                                } else {
                                    $scope.HealthPhysicalModal.LabObj.IsBloodAvailable = "";
                                }
                            }
                        }

                        $scope.SelectPreTransfusion = function (val) {
                            if (val == 1) {
                                if ($scope.HealthPhysicalModal.LabObj.IsPretransfusion == "" || $scope.HealthPhysicalModal.LabObj.IsPretransfusion == "No") {
                                    $scope.HealthPhysicalModal.LabObj.IsPretransfusion = "Yes";
                                } else {
                                    $scope.HealthPhysicalModal.LabObj.IsPretransfusion = "";
                                }
                            }
                            if (val == 2) {
                                if ($scope.HealthPhysicalModal.LabObj.IsPretransfusion == "" || $scope.HealthPhysicalModal.LabObj.IsPretransfusion == "Yes") {
                                    $scope.HealthPhysicalModal.LabObj.IsPretransfusion = "No";
                                } else {
                                    $scope.HealthPhysicalModal.LabObj.IsPretransfusion = "";
                                }
                            }
                        }

                        $scope.SelectCXR = function (val) {
                            if (val == 1) {
                                if ($scope.HealthPhysicalModal.IsCXR == "" || $scope.HealthPhysicalModal.IsCXR == "No") {
                                    $scope.HealthPhysicalModal.IsCXR = "Yes";
                                } else {
                                    $scope.HealthPhysicalModal.IsCXR = "";
                                }
                            }
                            if (val == 2) {
                                if ($scope.HealthPhysicalModal.IsCXR == "" || $scope.HealthPhysicalModal.IsCXR == "Yes") {
                                    $scope.HealthPhysicalModal.IsCXR = "No";
                                } else {
                                    $scope.HealthPhysicalModal.IsCXR = "";
                                }
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
                                        var obj = {
                                            "file": $scope.file,
                                            "S3URL": "",
                                            "DeleteInd": false,
                                            "DocumentID": 0,
                                            "DocumentName": $scope.file.name || "",
                                            "FileName": $scope.file.name || "",
                                            "FileExt": $scope.file.type,
                                            "FileTypeId": 26,
                                            "DisplayName": $scope.file.name || ""
                                        };

                                        $scope.FilesObj.TempImagesArray.push(obj);


                                        angular.element("input[type='file']").val(null);
                                    }
                                });
                            }
                        };








                        $scope.AddLabTest = function () {
                            let index = $scope.HealthPhysicalModal.LabObj.LabTestArray.length - 1;
                            if ($scope.HealthPhysicalModal.LabObj.LabTestArray[index].Name !== "" && ($scope.HealthPhysicalModal.LabObj.LabTestArray[index].IsNormalLimitsChecked || $scope.HealthPhysicalModal.LabObj.LabTestArray[index].IsAbnormalChecked)) {
                                let obj = {
                                    "Name": "",
                                    "IsNormalLimitsChecked": false,
                                    "IsAbnormalChecked": false,
                                    "Notes": ""
                                };
                                $scope.HealthPhysicalModal.LabObj.LabTestArray.push(obj);
                            } else {
                                alertify.error("Please select values!");
                                return;
                            }
                        };


                    },
                    "resolve": {
                        "PreAdmAnesthetistObj": function () {
                            return $scope.PreAdmAnesthetistObj;
                        },
                        "AnesthetistArray": function () {
                            return $scope.AnesthetistArray;
                        },
                        "DocumentList": function () { return $scope.PreAdmAnesthetistObj.DocumentDetails; },
                    }
                });

                mInstanceAdd.result.then(function (data) {
                    $scope.PreAdmAnesthetistObj.LabObj = angular.copy(data.LabObj);
                    $scope.PreAdmAnesthetistObj.CardioVascularObj = angular.copy(data.CardioVascularObj);
                    $scope.PreAdmAnesthetistObj.HealthArray = angular.copy(data.HealthArray);
                    $scope.PreAdmAnesthetistObj.SocialNotes = angular.copy(data.SocialNotes);
                    $scope.PreAdmAnesthetistObj.RespiratoryNotes = angular.copy(data.RespiratoryNotes);
                    $scope.PreAdmAnesthetistObj.AirwayObj = angular.copy(data.AirwayObj);
                    $scope.PreAdmAnesthetistObj.IsCNSHistory = angular.copy(data.IsCNSHistory);
                    $scope.PreAdmAnesthetistObj.CNSNotes = angular.copy(data.CNSNotes);
                    $scope.PreAdmAnesthetistObj.AnesthesiaTypelist = angular.copy(data.AnesthesiaTypelist);
                    $scope.PreAdmAnesthetistObj.IsCardiovascularHistory = angular.copy(data.IsCardiovascularHistory);
                    $scope.PreAdmAnesthetistObj.PrevAnestheticsObj = angular.copy(data.PrevAnestheticsObj);
                    $scope.PreAdmAnesthetistObj.ASAObj = angular.copy(data.ASAObj);
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj = angular.copy(data.APAnesthesiaOptionsObj);
                    $scope.PreAdmAnesthetistObj.IsCXR = angular.copy(data.IsCXR);


                    if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistId != '') {
                        let Anesthetistlist = $filter("filter")($scope.AnesthetistArray, function (kitem) { return kitem.DoctorID == $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistId });

                        Anesthetistlist = Anesthetistlist || [];
                        if (Anesthetistlist.length > 0) {
                            $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistName = Anesthetistlist[0].FullName;
                        }
                    }


                    if ($scope.PreAdmAnesthetistObj.LabObj.IsPretransfusion == "" && $scope.PreAdmAnesthetistObj.LabObj.IsBloodAvailable == "" && $scope.PreAdmAnesthetistObj.LabObj.UrineAnalysis == "" && $scope.PreAdmAnesthetistObj.LabObj.HGB == "" && $scope.PreAdmAnesthetistObj.LabObj.HCT == "" && $scope.PreAdmAnesthetistObj.LabObj.WBC == "" && $scope.PreAdmAnesthetistObj.LabObj.RBC == "" && $scope.PreAdmAnesthetistObj.LabObj.A1C == "" && $scope.PreAdmAnesthetistObj.LabObj.Creatinine == "" &&
                        $scope.PreAdmAnesthetistObj.LabObj.RBS == "" && $scope.PreAdmAnesthetistObj.LabObj.FBS == "" && $scope.PreAdmAnesthetistObj.LabObj.PBBS == "" && $scope.PreAdmAnesthetistObj.LabObj.PBLS == "" && $scope.PreAdmAnesthetistObj.LabObj.Notes == "") {
                        $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = false;
                    } else {
                        $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = true;
                    }
                    if ($scope.PreAdmAnesthetistObj.CardioVascularObj.Systolic == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.Diastolic == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.PR == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.ECG == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.ECGUnits == "" &&
                        $scope.PreAdmAnesthetistObj.CardioVascularObj.Notes == "") {
                        $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = false;
                    } else {
                        $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = true;
                    }

                    if ($scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS == "" && $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT == "" && $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP == "" && !$scope.PreAdmAnesthetistObj.AirwayObj.IsNormal &&
                        $scope.PreAdmAnesthetistObj.AirwayObj.Notes == "" && $scope.PreAdmAnesthetistObj.AirwayObj.Class == "") {
                        $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationAirwayInd = false;
                    } else {
                        $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationAirwayInd = true;
                    }


                    if ($scope.PreAdmAnesthetistObj.ASAObj.Notes == "" && $scope.PreAdmAnesthetistObj.ASAObj.Value == "") {
                        $scope.PreAdmissionSummaryObj.IsPrAdmAssessmentInd = false;
                    }
                    else {
                        $scope.PreAdmissionSummaryObj.IsPrAdmAssessmentInd = true;
                    }
                    if ($scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPrevAnesthesia && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsComplications == null && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsFamilyHistory && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsDifficultAirway && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPONV
                        && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPatientDNR && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsSuspend && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsContinue && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.Notes == '') {
                        $scope.PreAdmissionSummaryObj.IsPrAdmPreviousInd = false;
                    } else {
                        $scope.PreAdmissionSummaryObj.IsPrAdmPreviousInd = true;
                    }
                    if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.Dosage = "" && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistId == null && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsTopicalAnesthesia && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsLocalAnesthesia && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsGeneralAnesthesia &&
                        $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsRegionalAnesthesia && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsSubtenonAnesthesia && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsIVSedation && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistName == "" && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistNotes == "") {
                        $scope.PreAdmissionSummaryObj.IsPrAdmAssPlanInd = false;
                    } else {
                        $scope.PreAdmissionSummaryObj.IsPrAdmAssPlanInd = true;
                    }
                }, function () {

                });


            };


        $scope.Ascbasicdetailspopup = function () {

            let reqIds = {
                "UserId": $scope.UserId,
                "SpecializationId": $scope.SpecializationId,
                "HospitalId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                "PatientId": $scope.cacheStorageItem.PatientID,
                "Age": $scope.cacheStorageItem.Age,
                "RaceName": $scope.cacheStorageItem.RaceName,
                "Gender": $scope.cacheStorageItem.Gender,
                "ParenthospitalId": $scope.ParenthospitalId || null,

            };

            var modalInstance = $uibModal.open({
                "templateUrl": "templates/uibpopups/Ascbasicdetailspopup.html",
                "resolve": {
                    "AllUserList": function () { return angular.copy($scope.allUserList); },
                    "reqIds": function () { return reqIds; },
                    "SurgeryDiagnosisObj": function () { return $scope.SurgeryDiagnosisObj; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, AllUserList, reqIds, SurgeryDiagnosisObj) {

                    $scope.PatientID = reqIds.PatientId;
                    $scope.UserId = reqIds.UserId;
                    $scope.SpecializationId = reqIds.SpecializationId;
                    $scope.HospitalId = reqIds.HospitalId;

                    $scope.ParenthospitalId = reqIds.ParenthospitalId;

                    $scope.SurgeryDiagnosisObj = angular.copy(SurgeryDiagnosisObj);

                    $scope.adviseObj = {
                        'SearchProcedureObj': "",
                        'DiagnosisObject': "",
                        'SearchReferalObj': ""
                    };

                    $scope.EditSurgeryObj = {
                        "AllUserList": [],
                        "AllAnesthetistList": [],
                        "AllNurseList": [],
                        "UserID": null,
                        "AnesthetistID": null,
                        "NurseID": null,
                        "SurgeonID": null,
                        "Height": "",
                        "Weight": "",
                        "HeightUnitId": null,
                        "WeightUnitId": null,
                        "WeightUnitName": "",
                        "HeightUnitName": "",
                    }

                    $scope.HeightUnits = [
                        {
                            "Unit": "Ft/Inches",
                            "UnitId": 1
                        },
                        {
                            "Unit": "Cms",
                            "UnitId": 2
                        }
                    ];

                    $scope.WeightUnits = [
                        {
                            "Unit": "Kgs",
                            "UnitId": 1
                        },
                        {
                            "Unit": "lbs",
                            "UnitId": 2
                        }
                    ];

                    $scope.EditSurgeryObj.Height = $scope.SurgeryDiagnosisObj.Height;
                    $scope.EditSurgeryObj.Weight = $scope.SurgeryDiagnosisObj.Weight;
                    $scope.SurgeryDiagnosisObj.HeightUnitName = $scope.SurgeryDiagnosisObj.HeightUnitName || "";
                    $scope.SurgeryDiagnosisObj.WeightUnitName = $scope.SurgeryDiagnosisObj.WeightUnitName || "";
                    if ($scope.SurgeryDiagnosisObj.HeightUnitName != "") {
                        $scope.EditSurgeryObj.HeightUnitId = $filter('filter')($scope.HeightUnits, { 'Unit': $scope.SurgeryDiagnosisObj.HeightUnitName }, true)[0].UnitId;
                    }

                    if ($scope.SurgeryDiagnosisObj.WeightUnitName != "") {
                        $scope.EditSurgeryObj.WeightUnitId = $filter('filter')($scope.WeightUnits, { 'Unit': $scope.SurgeryDiagnosisObj.WeightUnitName }, true)[0].UnitId;
                    }
                    

                    if ($scope.EditSurgeryObj.WeightUnitId == 1) {
                        $scope.EditSurgeryObj.WeightUnitName = "Kgs"
                    } else {
                        $scope.EditSurgeryObj.WeightUnitName = "lbs"
                    }

                    if ($scope.EditSurgeryObj.HeightUnitId == 1) {
                        $scope.EditSurgeryObj.HeightUnitName = "Ft/Inches"
                    } else {
                        $scope.EditSurgeryObj.HeightUnitName = "Cms"
                    }

                    $scope.EditSurgeryObj.Age = reqIds.Age;
                    $scope.EditSurgeryObj.Gender = reqIds.Gender;
                    $scope.EditSurgeryObj.Race = reqIds.RaceName;


                    $scope.EditSurgeryObj.AllUserList = AllUserList;
                    $scope.EditSurgeryObj.AllAnesthetistList = [];
                    $scope.EditSurgeryObj.AllNurseList = [];

                    angular.forEach($scope.EditSurgeryObj.AllUserList, function (item) {
                        if (item.RoleId == 30 || item.RoleId == 8 || item.RoleId == 25 || item.RoleId == 16 || item.RoleId == 1 || item.RoleId == 43) {
                            $scope.EditSurgeryObj.AllAnesthetistList.push(item);
                        }
                    });

                    angular.forEach($scope.EditSurgeryObj.AllUserList, function (item) {
                        if (item.RoleId == 8) {
                            $scope.EditSurgeryObj.AllNurseList.push(item);
                        }
                    });

                    $scope.EditSurgeryObj.SurgeonID = SurgeryDiagnosisObj.SurgeonID;
                    $scope.EditSurgeryObj.AnesthetistID = SurgeryDiagnosisObj.AnesthetistID;
                    $scope.EditSurgeryObj.CoSurgeonId = SurgeryDiagnosisObj.CoSurgeonId;
                    $scope.EditSurgeryObj.ExternalCoManagerId = SurgeryDiagnosisObj.ExternalCoManagerId;
                    $scope.EditSurgeryObj.InternalCoManagerId = SurgeryDiagnosisObj.InternalCoManagerId;
                    $scope.EditSurgeryObj.NurseID = SurgeryDiagnosisObj.NurseID;

                    $scope.GetDiagnosisList = function (val) {
                        let object = {
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
                        if ($scope.Assesmenttab === 2) {
                            if ($scope.AdvisedOrderDetailsArray.length == 0) {
                                alertify.error("Please Select Any Order And Continue To search");
                                return false;
                            }
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

                    $scope.DiagnosisArray = [];

                    if ($scope.SurgeryDiagnosisObj.DiagnosisList.length > 0) {
                        angular.forEach($scope.SurgeryDiagnosisObj.DiagnosisList, function (item) {
                            item.DeleteInd = "N";
                            $scope.DiagnosisArray.push(item);
                        });
                    }

                    $scope.onSelectHeight = function (id) {
                        if (id == 2) {
                            $scope.EditSurgeryObj.HeightUnitName = "Cms";
                        } else {
                            $scope.EditSurgeryObj.HeightUnitName = "Ft/Inches";
                        }
                    };

                    $scope.onSelectWeight = function (id) {
                        if (id == 2) {
                            $scope.EditSurgeryObj.WeightUnitName = "lbs";
                        } else {
                            $scope.EditSurgeryObj.WeightUnitName = "Kgs";
                        }
                    };

                    $scope.onSelectDiagnosis = function (mainobject) {

                        let filterdiagnosis = $filter("filter")($scope.DiagnosisArray, function (Aitem, index) { return Aitem.DiagnosisId == mainobject.DiagnosisId },);
                        if (filterdiagnosis.length > 0) {
                            mainobject = "";
                            $scope.adviseObj.DiagnosisObject = "";
                            alertify.error("Diagnosis Already Added");
                            return false;
                        }

                        let obj = {
                            "DeleteInd": "N",
                            "DiagnosisDetailId": 0,
                            "DiagnosisId": mainobject.DiagnosisId,
                            "DiagnosisName": mainobject.DiagnosisName,
                            "ICDCode": mainobject.ICD10CODE,
                        }

                        $scope.DiagnosisArray.push(obj);


                        $scope.adviseObj.DiagnosisObject = "";
                    };

                    $scope.RemoveDiagnosis = function (obj) {
                        if (obj.DiagnosisDetailId == 0) {
                            let index = $scope.DiagnosisArray.indexOf(obj);
                            if (index > -1) {
                                $scope.DiagnosisArray.splice(index, 1);
                            }
                        } else {
                            obj.DeleteInd = "Y";
                        }

                    }


                    $scope.SaveEditSurgeryStaff = function (item) {
                        var obj = {
                            "AppointmentID": reqIds.AppointmentId,
                            "AnesthetistID": item.AnesthetistID,
                            "NurseID": item.NurseID,
                            "SurgeonID": item.SurgeonID,
                            "UserId": $scope.UserId,
                            "AppointmentTypeId": 7,
                            "Height": $scope.EditSurgeryObj.Height || null,
                            "Weight": $scope.EditSurgeryObj.Weight || null,
                            "PatientId": $scope.PatientID,
                            "DiagnosisList": $scope.DiagnosisArray || [],
                            "ExternalCoManagerId": $scope.EditSurgeryObj.ExternalCoManagerId,
                            "InternalCoManagerId": $scope.EditSurgeryObj.InternalCoManagerId,
                            "CoSurgeonId": $scope.EditSurgeryObj.CoSurgeonId,
                            "HeightUnitId": $scope.EditSurgeryObj.HeightUnitId,
                            "HeightUnitName": $scope.EditSurgeryObj.HeightUnitName || 'Cms',
                            "WeightUnitId": $scope.EditSurgeryObj.WeightUnitId,
                            "WeightUnitName": $scope.EditSurgeryObj.WeightUnitName || 'lbs',
                            "Logs": {},
                        };
                        eHnoteSurgeryService.AddUpdateSurgeryStaffList(obj).then(function (response) {
                            console.log(response);
                            if (response.data.status === "Success") {
                                $uibModalInstance.close(response);
                            }
                        });
                    };
                    $scope.close = function (item) {
                        $uibModalInstance.dismiss("cancel");
                    };
                },
                "backdrop": "static",
                "size": "lg",
                "keyboard": false,
                // "windowClass": "modal__popup--1 bottom-to-top-modal in",
            });
            modalInstance.result.then(function (data) {
                if (data.data.status === "Success") {

                    let patientId = $scope.cacheStorageItem.PatientID || 0;
                    eHnoteAuditServices.getPatientDetailsById(patientId, ongetPatientDetailsSuccess, ongetPatientDetailsError);
                    function ongetPatientDetailsSuccess(data) {
                        if (data !== undefined) {
                            var patientitem = data;
                            $scope.cacheStorageItem.Height = patientitem.Patient[0].Height;
                            $scope.cacheStorageItem.Weight = patientitem.Patient[0].Weight;

                            $scope.AddToCache();
                        }

                    }

                    function ongetPatientDetailsError(error) {
                        console.log(error);
                    }

                    $scope.GetSurgeryStaffListDetails();
                }
            }, function (cancel) {

            });
                
        }

            $scope.GetMedicalHistoriesByPatientId = function () {

                eHnotePatientDataService.GetMedicalHistoriesByPatientId($scope.cacheStorageItem.PatientID).then(function (resp) {
                    $scope.PreviousInvestigations = [];
                    if (resp.data.rows != undefined) {
                        $scope.PreviousInvestigations = resp.data.rows;
                        if ($scope.PreviousInvestigations.length > 0) {
                            angular.forEach($scope.PreviousInvestigations, function (item) {

                                if (item.Allergy.length > 0) {

                                    angular.forEach(item.Allergy, function (pAllergy) {
                                        var obj = {
                                            "PatientDetailId": 0,
                                            "IsShowAllergySnomedAddInd": pAllergy.IsShowAllergySnomedAddInd || false,
                                            "AllergyId": pAllergy.AllergyId || null,
                                            "RcopiaAllergyId": pAllergy.RcopiaAllergyId || null,
                                            "AllergyName": pAllergy.AllergyName || '',
                                            "OrganId": pAllergy.OrganId || 4,
                                            "SeverityId": pAllergy.SeverityId || 0,
                                            "SNOMEDId": pAllergy.SNOMEDId || null,
                                            "RxNormID": pAllergy.RxNormID || null,
                                            "NDCID": pAllergy.NDCID || null,
                                            "DrugGroupID": pAllergy.DrugGroupID || null,
                                            "SeverityName": pAllergy.SeverityName || "",
                                            "ReactionId": pAllergy.ReactionId || "",
                                            "StatusId": pAllergy.StatusId || "",
                                            "Duration": pAllergy.Duration || "",
                                            "AllergyTypeId": pAllergy.AllergyTypeId || 0,
                                            "IsEdit": true,
                                            "ShowNote": false,
                                            "ShowDateFormat": true,
                                            "ReactionName": pAllergy.ReactionName || "",
                                            "DurationDate": pAllergy.DurationDate || "",
                                            "StatusName": pAllergy.StatusName || "",
                                            "Remarks": pAllergy.Remarks || "",
                                            "SnomedCode": pAllergy.SnomedCode || "",
                                            "DurationType": 'D',
                                            "OnsetType": 'Date',
                                            "DiagnosisObject": 'D',
                                            "DeleteInd": 'N'
                                        }
                                        var i = 0;
                                        if ($scope.PreAdmAnesthetistObj.AllergyItems.length > 0) {
                                            angular.forEach($scope.PreAdmAnesthetistObj.AllergyItems, function (item) {
                                                if (item.AllergyId === obj.AllergyId && item.DeleteInd == 'N') {
                                                    i++;
                                                }
                                            });
                                        }
                                        if ($scope.PreAdmAnesthetistObj.AllergyItems.length !== 0) {
                                            var List = $filter("filter")($scope.PreAdmAnesthetistObj.AllergyItems, { "AllergyId": 1 }, true);
                                            if (List.length > 0) {
                                                List[0].DeleteInd = 'Y';
                                            }
                                        }

                                        if ($scope.PreAdmAnesthetistObj.AllergyItems.length !== 0) {
                                            var List = $filter("filter")($scope.PreAdmAnesthetistObj.AllergyItems, { "AllergyId": 2 }, true);
                                            if (List.length > 0) {
                                                List[0].DeleteInd = 'Y';
                                            }
                                        }

                                        if (i === 0) {
                                            $scope.PreAdmAnesthetistObj.AllergyItems.push(obj);
                                        }

                                    });
                                }

                                if (item.SystemicHistory.length > 0) {
                                    angular.forEach(item.SystemicHistory, function (ohitem) {
                                        var i = 0;
                                        var object = {
                                            "PatientDetailId": 0,
                                            "HistoryId": ohitem.HistoryId || "",
                                            "HistoryName": ohitem.HistoryName || "",
                                            "IsEdit": ohitem.IsEdit || true,
                                            "ActiveInd": true,
                                            "DeleteInd": 'N',
                                            "Remarks": ohitem.Remarks || "",
                                            "SnomedCodeobj": ohitem.SNOMED || "",
                                            "OrganId": ohitem.OrganId || "",
                                            "Duration": ohitem.Duration || "",
                                            "DurationType": ohitem.DurationType || "D",
                                            "DurationTypeName": ohitem.DurationTypeName || "Day(s)",
                                            "DurationDate": ohitem.DurationDate || "",
                                            "ShowNote": false,
                                            "SNOMEDId": ohitem.SNOMEDId || null,
                                            "SNOMEDCODE": ohitem.SNOMED || "",
                                            "ICD10CODE": ohitem.ICD10CODE || "",
                                            "DiagnosisObject": ohitem.ICD10CODE || "",
                                            "DiagnosisId": ohitem.DiagnosisId || null,
                                            "SeverityId": ohitem.SeverityId || null,
                                            "StatusId": 1,
                                            "SeverityDateTime": ohitem.SeverityDateTime || "",
                                            "ShowDateFormat": true
                                        };
                                        if ($scope.PreAdmAnesthetistObj.SystemicHistory.length > 0) {
                                            angular.forEach($scope.PreAdmAnesthetistObj.SystemicHistory, function (item) {
                                                if (item.HistoryId === object.HistoryId && item.DeleteInd === 'N') {
                                                    i++;
                                                }
                                            });
                                        }

                                        if ($scope.PreAdmAnesthetistObj.SystemicHistory.length !== 0) {
                                            var List = $filter("filter")($scope.PreAdmAnesthetistObj.SystemicHistory, { "HistoryId": 1 }, true);
                                            if (List.length > 0) {
                                                List[0].DeleteInd = 'Y';
                                            }
                                        }
                                        if (i === 0) {
                                            object.GeneralPatientHistoryId = 0;
                                            $scope.PreAdmAnesthetistObj.SystemicHistory.push(object);
                                        }
                                    });
                                }

                                if (item.PatientSurgical.length > 0) {
                                    angular.forEach(item.PatientSurgical, function (surgicalHistory) {
                                        var i = 0;

                                        var object = {
                                            "PatientDetailId": 0,
                                            "HistoryId": surgicalHistory.HistoryId,
                                            "HistoryName": surgicalHistory.HistoryName,
                                            "IsEdit": true,
                                            "showSurgicalHistory": surgicalHistory.showSurgicalHistory || false,
                                            "ActiveInd": true,
                                            "DeleteInd": 'N',
                                            "DurationDate": surgicalHistory.DurationDate || "",
                                            "Duration": surgicalHistory.Duration || "",
                                            "DurationType": surgicalHistory.DurationType || "D",
                                            "DurationTypeName": surgicalHistory.DurationTypeName || "Day(s)",
                                            "Remarks": surgicalHistory.Remarks || "",
                                            "ShowDateFormat": surgicalHistory.DurationDate ? true : false,
                                            "ShowNote": false,
                                            "ModifierId": surgicalHistory.ModifierId || "",
                                            "MODIFIERCODE": surgicalHistory.MODIFIERCODE || "",
                                            "ModifierObj": surgicalHistory.ModifierObj || "",
                                            "CPTCode": surgicalHistory.CPTCode || "",
                                            "ProcedureId": surgicalHistory.ProcedureId || "",
                                            "CPTObj": surgicalHistory.CPTCode || "",
                                            "ShowDateFormat": true
                                        };
                                        var i = 0;
                                        if ($scope.PreAdmAnesthetistObj.SurgicalHistory.length > 0) {
                                            angular.forEach($scope.PreAdmAnesthetistObj.SurgicalHistory, function (item) {
                                                if (item.HistoryId === object.HistoryId && item.DeleteInd === 'N') {
                                                    surgicalHistory = "";
                                                    i++;
                                                }
                                            });
                                        }
                                        if ($scope.PreAdmAnesthetistObj.SurgicalHistory.length !== 0) {
                                            var List = $filter("filter")($scope.PreAdmAnesthetistObj.SurgicalHistory, { "HistoryId": 1 }, true);
                                            if (List.length > 0) {
                                                List[0].DeleteInd = 'Y';
                                            }
                                        }
                                        if (i === 0 && surgicalHistory !== "") {
                                            object.GeneralPatientHistoryId = 0;
                                            $scope.PreAdmAnesthetistObj.SurgicalHistory.push(object);
                                        }
                                    });
                                }

                                if (item.PatientCurrentSystemicMedications.length > 0) {
                                    angular.forEach(item.PatientCurrentSystemicMedications, function (CurrentSystemicMedicationsHistory) {

                                        var object = {
                                            "CurrentSystemicMedicationId": 0,
                                            "HospitalId": CurrentSystemicMedicationsHistory.OrganizationId || "",
                                            "MedicineId": CurrentSystemicMedicationsHistory.MedicineId || "",
                                            "MedicineType": CurrentSystemicMedicationsHistory.MedicineType || "",
                                            "MedicineTypeId": CurrentSystemicMedicationsHistory.MedicineTypeId || "",
                                            "MedicineName": CurrentSystemicMedicationsHistory.MedicineName || "",
                                            "MedicineObject": CurrentSystemicMedicationsHistory.MedicineObject || "",
                                            "RcopiaDrugId": CurrentSystemicMedicationsHistory.RcopiaDrugId || "",
                                            "RcopiaMedicationId": CurrentSystemicMedicationsHistory.RcopiaMedicationId || 0,
                                            "MedicationName": CurrentSystemicMedicationsHistory.MedicationName || "",
                                            "DrugNDCID": CurrentSystemicMedicationsHistory.DrugNDCID || "",
                                            "DrugFirstDataBankMedID": CurrentSystemicMedicationsHistory.DrugFirstDataBankMedID || "",
                                            "DrugGenericId": CurrentSystemicMedicationsHistory.DrugGenericId || "",
                                            "DrugBrandName": CurrentSystemicMedicationsHistory.DrugBrandName || "",
                                            "DrugGenericName": CurrentSystemicMedicationsHistory.DrugGenericName || "",
                                            "DrugForm": CurrentSystemicMedicationsHistory.DrugForm || "",
                                            "DrugStrength": CurrentSystemicMedicationsHistory.DrugStrength || "",
                                            "DrugSchedule": CurrentSystemicMedicationsHistory.DrugSchedule || "",
                                            "DrugSupply": CurrentSystemicMedicationsHistory.DrugSupply || "",
                                            "DrugCompound": CurrentSystemicMedicationsHistory.DrugCompound || "",
                                            "MedicationTypeId": CurrentSystemicMedicationsHistory.MedicationTypeId || "",
                                            "MedicationTypeName": CurrentSystemicMedicationsHistory.MedicationTypeName || "",
                                            "Sig": CurrentSystemicMedicationsHistory.Sig || "",
                                            "SigId": CurrentSystemicMedicationsHistory.SigId || 0,
                                            "ActionId": CurrentSystemicMedicationsHistory.ActionId || "",
                                            "Action": CurrentSystemicMedicationsHistory.Action || "",
                                            "DoseId": CurrentSystemicMedicationsHistory.DoseId || "",
                                            "Dose": CurrentSystemicMedicationsHistory.Dose || "",
                                            "DoseUnitId": CurrentSystemicMedicationsHistory.DoseUnitId || "",
                                            "DoseUnit": CurrentSystemicMedicationsHistory.DoseUnit || "",
                                            "RouteId": CurrentSystemicMedicationsHistory.RouteId || "",
                                            "Route": CurrentSystemicMedicationsHistory.Route || "",
                                            "FrequencyId": CurrentSystemicMedicationsHistory.FrequencyId || "",
                                            "Frequency": CurrentSystemicMedicationsHistory.Frequency || "",
                                            "DoseOtherId": CurrentSystemicMedicationsHistory.DoseOtherId || "",
                                            "DoseOther": CurrentSystemicMedicationsHistory.DoseOther || "",
                                            "DaysSupplyId": CurrentSystemicMedicationsHistory.DaysSupplyId || "",
                                            "DaysSupply": CurrentSystemicMedicationsHistory.DaysSupply || "",
                                            "Quantity": CurrentSystemicMedicationsHistory.Quantity || "",
                                            "QuantityUnitId": CurrentSystemicMedicationsHistory.QuantityUnitId || "",
                                            "QuantityUnit": CurrentSystemicMedicationsHistory.QuantityUnit || "",
                                            "RefillId": CurrentSystemicMedicationsHistory.RefillId || "",
                                            "Refills": CurrentSystemicMedicationsHistory.Refills || "",
                                            "SubstitutionPermitted": CurrentSystemicMedicationsHistory.SubstitutionPermitted || "y",
                                            "PatientInstructions": CurrentSystemicMedicationsHistory.PatientInstructions || "",
                                            "DeleteInd": "N",
                                            "OtherNotes": CurrentSystemicMedicationsHistory.OtherNotes || "",
                                            "Remarks": CurrentSystemicMedicationsHistory.Remarks || "",
                                            "StartDate": CurrentSystemicMedicationsHistory.StartDate || null,
                                            "StopDate": CurrentSystemicMedicationsHistory.StopDate || null,
                                            "FillDate": CurrentSystemicMedicationsHistory.FillDate || '',
                                            "StopReason": CurrentSystemicMedicationsHistory.StopReason || "",
                                            "RcopiaMedicationStatus": CurrentSystemicMedicationsHistory.RcopiaMedicationStatus || "",
                                            "IsEdit": true,
                                            "ShowNote": false,

                                        };
                                        var i = 0;
                                        if ($scope.PreAdmAnesthetistObj.CurrentSystemicMedicationsHistory.length > 0) {
                                            angular.forEach($scope.PreAdmAnesthetistObj.CurrentSystemicMedicationsHistory, function (csitem) {
                                                if (csitem.MedicineId === object.MedicineId && csitem.DeleteInd === 'N') {
                                                    i++;
                                                }
                                            });
                                        }
                                        if ($scope.PreAdmAnesthetistObj.CurrentSystemicMedicationsHistory.length !== 0) {
                                            var List = $filter("filter")($scope.PreAdmAnesthetistObj.CurrentSystemicMedicationsHistory, { "MedicineId": 2 }, true);
                                            if (List.length > 0) {
                                                List[0].DeleteInd = 'Y';
                                            }
                                        }

                                        if (i === 0 && CurrentSystemicMedicationsHistory != "") {
                                            $scope.PreAdmAnesthetistObj.CurrentSystemicMedicationsHistory.push(object);
                                        }
                                    });
                                }

                                if (item.PatientCurrentEyeMedications.length > 0) {
                                    angular.forEach(item.PatientCurrentEyeMedications, function (ohitem) {
                                        if (ohitem != undefined) {
                                            var object = {
                                                "CurrentEyeMedicalConditionId": 0,
                                                "HospitalId": "",
                                                "MedicineId": ohitem.MedicineId || "",
                                                "MedicineType": ohitem.MedicineType || "",
                                                "MedicineTypeId": ohitem.MedicineTypeId || "",
                                                "MedicineName": ohitem.MedicineName || "",
                                                "MedicineObject": ohitem.MedicineObject || "",
                                                "RcopiaDrugId": ohitem.RcopiaDrugId || 0,
                                                "RcopiaMedicationId": ohitem.RcopiaMedicationId || 0,
                                                "MedicationName": ohitem.MedicationName || "",
                                                "DrugNDCID": ohitem.DrugNDCID || 0,
                                                "DrugFirstDataBankMedID": ohitem.DrugFirstDataBankMedID || 0,
                                                "DrugGenericId": ohitem.DrugGenericId || 0,
                                                "DrugBrandName": ohitem.DrugBrandName || "",
                                                "DrugGenericName": ohitem.GenericName || "",
                                                "DrugForm": ohitem.DrugForm || "",
                                                "DrugStrength": ohitem.Strength || "",
                                                "DrugSchedule": ohitem.DrugSchedule || "",
                                                "DrugSupply": ohitem.DrugSupply || "",
                                                "DrugCompound": ohitem.DrugCompound || "",
                                                "MedicationTypeId": ohitem.MedicationTypeId || "",
                                                "MedicationTypeName": ohitem.MedicationTypeName || "",
                                                "Sig": ohitem.Sig || "",
                                                "SigId": ohitem.SigId || 0,
                                                "ActionId": ohitem.ActionId || 0,
                                                "Action": ohitem.Action || "",
                                                "DoseId": ohitem.DoseId || 0,
                                                "Dose": ohitem.Dose || "",
                                                "DoseUnitId": ohitem.DoseUnitId || 0,
                                                "DoseUnit": ohitem.DoseUnit || "",
                                                "RouteId": ohitem.RouteId || 0,
                                                "Route": ohitem.Route || "",
                                                "FrequencyId": ohitem.FrequencyId || 0,
                                                "Frequency": ohitem.Frequency || "",
                                                "DoseOtherId": ohitem.DoseOtherId || 0,
                                                "DoseOther": ohitem.DoseOther || "",
                                                "DaysSupplyId": ohitem.DaysSupplyId || 0,
                                                "DaysSupply": ohitem.DaysSupply || "",
                                                "Quantity": ohitem.Quantity || "",
                                                "QuantityUnitId": ohitem.QuantityUnitId || 0,
                                                "QuantityUnit": ohitem.QuantityUnit || "",
                                                "RefillId": ohitem.RefillId || "",
                                                "Refills": ohitem.Refills || "",
                                                "SubstitutionPermitted": ohitem.SubstitutionPermitted || "",
                                                "PatientInstructions": ohitem.PatientInstructions || "",
                                                "DeleteInd": "N",
                                                "OtherNotes": ohitem.OtherNotes || "",
                                                "Remarks": ohitem.Remarks || "",
                                                "StartDate": ohitem.StartDate || null,
                                                "StopDate": ohitem.StopDate || null,
                                                "FillDate": ohitem.FillDate || '',
                                                "StopReason": ohitem.StopReason || "",
                                                "RcopiaMedicationStatus": ohitem.RcopiaMedicationStatus || "",
                                                "IsEdit": ohitem.IsEdit || true,
                                                "ShowNote": ohitem.ShowNote || false,

                                            };
                                            var i = 0;
                                            if ($scope.PreAdmAnesthetistObj.CurrentEyeMedications.length > 0) {
                                                angular.forEach($scope.PreAdmAnesthetistObj.CurrentEyeMedications, function (item) {
                                                    if (item.MedicineId === object.MedicineId && item.DeleteInd == 'N') {
                                                        i++;
                                                    }
                                                });
                                            }
                                            if ($scope.PreAdmAnesthetistObj.CurrentEyeMedications.length !== 0) {
                                                var List = $filter("filter")($scope.PreAdmAnesthetistObj.CurrentEyeMedications, { "MedicineId": 1 }, true);
                                                if (List.length > 0) {
                                                    List[0].DeleteInd = 'Y';
                                                }
                                            }
                                            if (i === 0) {
                                                object.MedicalHistoryDetailsId = 0;
                                                $scope.PreAdmAnesthetistObj.CurrentEyeMedications.push(object);
                                            }
                                        }
                                    });
                                }

                            });
                        }
                    }
                });
            };

            $scope.CopyFromCardiology = function () {

                alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to copy from Cardiology? </h4>", function () {

                    let appointmentId;
                    if ($scope.cacheStorageItem.AppointmentTypeId === 4 || $scope.cacheStorageItem.AppointmentTypeId === 14) {
                        appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
                    }
                    if ($scope.cacheStorageItem.AppointmentTypeId === 7) {
                        appointmentId = $scope.cacheStorageItem.AppointmentId;
                    }
                    $scope.ReqObj = {
                        "UserId": $scope.UserId,
                        "OrganizationId": $scope.HospitalId,
                        "AppointmentId": appointmentId || 0,
                        "PatientId": $scope.cacheStorageItem.PatientID || 0
                    };
                    eHnoteSurgeryService.GetPreAdmissionCardiologistDetails($scope.ReqObj).then(function (response) {
                        console.log(response);
                        if (response.data.status === "Success") {

                            if (response.data.LastSignOffUserDetails.length > 0) {
                                $scope.PreAdmCardioPopupSummaryObj.LastSignOffUserDetails = angular.copy(response.data.LastSignOffUserDetails)||[];
                            }
                            if (response.data.CardiologistDetails.length > 0) {
                                $scope.CardiologistDetails = angular.copy(response.data.CardiologistDetails[0]);                              

                                $scope.PreAdmAnesthetistObj.LabObj = $scope.GetLabObj();
                                $scope.PreAdmAnesthetistObj.LabObj.HGB = $scope.CardiologistDetails.LabTest.HGB;
                                $scope.PreAdmAnesthetistObj.LabObj.HCT = $scope.CardiologistDetails.LabTest.HCT;
                                $scope.PreAdmAnesthetistObj.LabObj.WBC = $scope.CardiologistDetails.LabTest.WBC;
                                $scope.PreAdmAnesthetistObj.LabObj.RBC = $scope.CardiologistDetails.LabTest.RBC;
                                $scope.PreAdmAnesthetistObj.LabObj.A1C = $scope.CardiologistDetails.LabTest.A1C;
                                $scope.PreAdmAnesthetistObj.LabObj.Creatinine = $scope.CardiologistDetails.LabTest.Creatinine;
                                $scope.PreAdmAnesthetistObj.LabObj.RBS = $scope.CardiologistDetails.LabTest.RBS;
                                $scope.PreAdmAnesthetistObj.LabObj.FBS = $scope.CardiologistDetails.LabTest.FBS;
                                $scope.PreAdmAnesthetistObj.LabObj.PBBS = $scope.CardiologistDetails.LabTest.PBBS;
                                $scope.PreAdmAnesthetistObj.LabObj.PBLS = $scope.CardiologistDetails.LabTest.PBLS;
                                $scope.PreAdmAnesthetistObj.LabObj.Notes = $scope.CardiologistDetails.LabTest.Notes || "";
                                $scope.PreAdmAnesthetistObj.LabObj.Others = $scope.CardiologistDetails.LabTest.Others || "";
                                $scope.PreAdmAnesthetistObj.LabObj.IsBloodAvailable = $scope.CardiologistDetails.LabTest.IsBloodAvailable || "";
                                $scope.PreAdmAnesthetistObj.LabObj.IsPretransfusion = $scope.CardiologistDetails.LabTest.IsPretransfusion || "";
                                $scope.PreAdmAnesthetistObj.LabObj.UrineAnalysis = $scope.CardiologistDetails.LabTest.UrineAnalysis || "";
                                if ($scope.CardiologistDetails.LabTest.TestArray.length > 0) {
                                    $scope.PreAdmAnesthetistObj.LabObj.LabTestArray = $scope.CardiologistDetails.LabTest.TestArray;

                                    angular.forEach($scope.PreAdmAnesthetistObj.LabObj.LabTestArray, function (item) {
                                        if (item.Notes != '') {
                                            item.PreAdmnotesInd = true;
                                        } else {
                                            item.PreAdmnotesInd = false;
                                        }
                                    });
                                }

                                $scope.CardiologistDetails.CardioVascular = $scope.CardiologistDetails.CardioVascular || "";
                                if ($scope.CardiologistDetails.CardioVascular != "") {
                                    $scope.PreAdmAnesthetistObj.CardioVascularObj.Systolic = $scope.CardiologistDetails.CardioVascular.Systolic;
                                    $scope.PreAdmAnesthetistObj.CardioVascularObj.Diastolic = $scope.CardiologistDetails.CardioVascular.Diastolic;
                                    $scope.PreAdmAnesthetistObj.CardioVascularObj.PR = $scope.CardiologistDetails.CardioVascular.PR;
                                    $scope.PreAdmAnesthetistObj.CardioVascularObj.ECG = $scope.CardiologistDetails.CardioVascular.ECG;
                                    $scope.PreAdmAnesthetistObj.CardioVascularObj.ECGUnits = $scope.CardiologistDetails.CardioVascular.ECGUnits;
                                    $scope.PreAdmAnesthetistObj.CardioVascularObj.Notes = $scope.CardiologistDetails.CardioVascular.Notes || "";
                                    if ($scope.PreAdmAnesthetistObj.CardioVascularObj.Notes != "") {
                                        $scope.PreAdmAnesthetistObj.CardioVascularObjNotesInd = true;
                                    } else {
                                        $scope.PreAdmAnesthetistObj.CardioVascularObjNotesInd = false;
                                    }
                                    $scope.PreAdmAnesthetistObj.CardioVascularObj.BPlevel = $scope.CardiologistDetails.CardioVascular.BPlevel || "";
                                }

                                $scope.CardiologistDetails.HealthArray = $scope.CardiologistDetails.HealthArray || [];
                                angular.forEach($scope.PreAdmAnesthetistObj.HealthArray, function (item) {
                                    let temparray = $filter('filter')($scope.CardiologistDetails.HealthArray, { "Id": item.Id }, true);
                                    temparray = temparray || [];
                                    if (temparray.length > 0) {
                                        item.IsChecked = temparray[0].IsChecked;
                                    } else {
                                        item.IsChecked = null;
                                    }
                                });

                                $scope.PreAdmAnesthetistObj.CXRHistory = $scope.CardiologistDetails.CXRHistory;
                                $scope.PreAdmAnesthetistObj.IsCXR = $scope.CardiologistDetails.IsCXR;
                                $scope.AnethesiaOtherSystemsArrayList = angular.copy($scope.CardiologistDetails.OtherSystemArray);

                                if ($scope.AnethesiaOtherSystemsArrayList.length > 0) {
                                    angular.forEach($scope.AnethesiaOtherSystemsArrayList, function (item) {
                                        if (item.Remarks != '') {
                                            item.PreAdmOthernotesInd = true;
                                        } else {
                                            item.PreAdmOthernotesInd = false;
                                        }
                                    });
                                }

                                $scope.PreAdmAnesthetistObj.IsCardiovascularHistory = $scope.CardiologistDetails.IsCardiovascularHistory;


                                if ($scope.CardiologistDetails.DocumentDetails.length > 0) {
                                    $scope.PreAdmAnesthetistObj.DocumentDetails = $scope.CardiologistDetails.DocumentDetails || [];
                                    angular.forEach($scope.PreAdmAnesthetistObj.DocumentDetails, function (item) {
                                        if (item.FileTypeId == 28) {
                                            item.FileTypeId = 26;
                                        }
                                    });

                                } else {
                                    $scope.PreAdmAnesthetistObj.DocumentDetails = [];
                                }

                                let tempHealthArray = angular.copy($scope.PreAdmAnesthetistObj.HealthArray);
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
                                        if (item.IsChecked) {
                                            tempCardiacArray.push(item.Description);
                                        }
                                    }
                                    if (item.CategoryId === 2) {
                                        if (item.IsChecked) {
                                            tempPulmonaryArray.push(item.Description);
                                        }
                                    }
                                    if (item.CategoryId === 3) {
                                        if (item.IsChecked) {
                                            tempHepaticArray.push(item.Description);
                                        }
                                    }
                                    if (item.CategoryId === 4) {
                                        if (item.IsChecked) {
                                            tempEndocrineArray.push(item.Description);
                                        }
                                    }
                                    if (item.CategoryId === 5) {
                                        if (item.IsChecked) {
                                            tempNeurologicArray.push(item.Description);
                                        }
                                    }
                                    if (item.CategoryId === 6) {
                                        if (item.IsChecked) {
                                            tempHemeOneArray.push(item.Description);
                                        }
                                    }
                                    if (item.CategoryId === 7) {
                                        if (item.IsChecked) {
                                            tempNervousSystemArray.push(item.Description);
                                        }
                                    }
                                    if (item.CategoryId === 8) {
                                        if (item.IsChecked) {
                                            tempKidneyDiseaseArray.push(item.Description);
                                        }
                                    }
                                    if (item.CategoryId === 9) {
                                        if (item.IsChecked) {
                                            tempMusculoSkeletalArray.push(item.Description);
                                        }
                                    }
                                    if (item.CategoryId === 10) {
                                        if (item.IsChecked) {
                                            tempAutoImmuneArray.push(item.Description);
                                        }
                                    }
                                    if (item.CategoryId === 11) {
                                        if (item.IsChecked) {
                                            tempPsychosisArray.push(item.Description);
                                        }
                                    }
                                    if (item.CategoryId === 12) {
                                        if (item.IsChecked) {
                                            tempOthersArray.push(item.Description);
                                        }
                                    }
                                    if (item.CategoryId === 16) {
                                        if (item.IsChecked) {
                                            tempHeentArray.push(item.Description);
                                        }
                                    }
                                    if (item.CategoryId === 17) {
                                        if (item.IsChecked) {
                                            tempLungsArray.push(item.Description);
                                        }
                                    }
                                });

                                if (tempCardiacArray.length > 0) {
                                    $scope.PreAdmAnesthetistObj.SelectedCardiacIssues = tempCardiacArray.join(", ");
                                } else {
                                    $scope.PreAdmAnesthetistObj.SelectedCardiacIssues = "";
                                }
                                if (tempPulmonaryArray.length > 0) {
                                    $scope.PreAdmAnesthetistObj.SelectedPulmonaryIssues = tempPulmonaryArray.join(", ");
                                } else {
                                    $scope.PreAdmAnesthetistObj.SelectedPulmonaryIssues = "";
                                }
                                if (tempHepaticArray.length > 0) {
                                    $scope.PreAdmAnesthetistObj.SelectedHepaticIssues = tempHepaticArray.join(", ");
                                } else {
                                    $scope.PreAdmAnesthetistObj.SelectedHepaticIssues = "";
                                }
                                if (tempEndocrineArray.length > 0) {
                                    $scope.PreAdmAnesthetistObj.SelectedEndocrineIssues = tempEndocrineArray.join(", ");
                                } else {
                                    $scope.PreAdmAnesthetistObj.SelectedEndocrineIssues = "";
                                }
                                if (tempNeurologicArray.length > 0) {
                                    $scope.PreAdmAnesthetistObj.SelectedNeurologicIssues = tempNeurologicArray.join(", ");
                                } else {
                                    $scope.PreAdmAnesthetistObj.SelectedNeurologicIssues = "";
                                }
                                if (tempHemeOneArray.length > 0) {
                                    $scope.PreAdmAnesthetistObj.SelectedHemeOncIssues = tempHemeOneArray.join(", ");
                                } else {
                                    $scope.PreAdmAnesthetistObj.SelectedHemeOncIssues = "";
                                }
                                if (tempNervousSystemArray.length > 0) {
                                    $scope.PreAdmAnesthetistObj.SelectedNervousSystemIssues = tempNervousSystemArray.join(", ");
                                } else {
                                    $scope.PreAdmAnesthetistObj.SelectedNervousSystemIssues = "";
                                }
                                if (tempKidneyDiseaseArray.length > 0) {
                                    $scope.PreAdmAnesthetistObj.SelectedKidneyDiseaseIssues = tempKidneyDiseaseArray.join(", ");
                                } else {
                                    $scope.PreAdmAnesthetistObj.SelectedKidneyDiseaseIssues = "";
                                }
                                if (tempMusculoSkeletalArray.length > 0) {
                                    $scope.PreAdmAnesthetistObj.SelectedMusculoSkeletalSystemIssues = tempMusculoSkeletalArray.join(", ");
                                } else {
                                    $scope.PreAdmAnesthetistObj.SelectedMusculoSkeletalSystemIssues = "";
                                }
                                if (tempAutoImmuneArray.length > 0) {
                                    $scope.PreAdmAnesthetistObj.SelectedAutoImmuneDisordersIssues = tempAutoImmuneArray.join(", ");
                                } else {
                                    $scope.PreAdmAnesthetistObj.SelectedAutoImmuneDisordersIssues = "";
                                }
                                if (tempPsychosisArray.length > 0) {
                                    $scope.PreAdmAnesthetistObj.SelectedPsychosisIssues = tempPsychosisArray.join(", ");
                                } else {
                                    $scope.PreAdmAnesthetistObj.SelectedPsychosisIssues = "";
                                }
                                if (tempOthersArray.length > 0) {
                                    $scope.PreAdmAnesthetistObj.SelectedOthersIssues = tempOthersArray.join(", ");
                                } else {
                                    $scope.PreAdmAnesthetistObj.SelectedOthersIssues = "";
                                }
                                if (tempHeentArray.length > 0) {
                                    $scope.PreAdmAnesthetistObj.SelectedHeentIssues = tempHeentArray.join(", ");
                                } else {
                                    $scope.PreAdmAnesthetistObj.SelectedHeentIssues = "";
                                }
                                if (tempLungsArray.length > 0) {
                                    $scope.PreAdmAnesthetistObj.SelectedLungsIssues = tempLungsArray.join(", ");
                                } else {
                                    $scope.PreAdmAnesthetistObj.SelectedLungsIssues = "";
                                }
                                $scope.PreAdmAnesthetistObj.IsCardiacWNL = $scope.CardiologistDetails.IsCardiacWNL;
                                //$scope.PreAdmAnesthetistObj.IsCNSHistory = $scope.CardiologistDetails.IsCNSHistory;
                                $scope.PreAdmAnesthetistObj.IsAutoImmuneDisordersWNL = $scope.CardiologistDetails.IsAutoImmuneDisordersWNL;
                                $scope.PreAdmAnesthetistObj.IsEndocrineWNL = $scope.CardiologistDetails.IsEndocrineWNL;
                                $scope.PreAdmAnesthetistObj.IsHemeOncWNL = $scope.CardiologistDetails.IsHemeOncWNL;
                                $scope.PreAdmAnesthetistObj.IsHepaticWNL = $scope.CardiologistDetails.IsHepaticWNL;
                                $scope.PreAdmAnesthetistObj.IsKidneyDiseaseWNL = $scope.CardiologistDetails.IsKidneyDiseaseWNL;
                                $scope.PreAdmAnesthetistObj.IsMusculoSkeletalSystemWNL = $scope.CardiologistDetails.IsMusculoSkeletalSystemWNL;
                                $scope.PreAdmAnesthetistObj.IsNervousSystemWNL = $scope.CardiologistDetails.IsNervousSystemWNL;
                                $scope.PreAdmAnesthetistObj.IsNeurologicWNL = $scope.CardiologistDetails.IsNeurologicWNL;
                                $scope.PreAdmAnesthetistObj.IsOthersWNL = $scope.CardiologistDetails.IsOthersWNL;
                                $scope.PreAdmAnesthetistObj.IsPsychosisWNL = $scope.CardiologistDetails.IsPsychosisWNL;
                                $scope.PreAdmAnesthetistObj.IsPulmonaryWNL = $scope.CardiologistDetails.IsPulmonaryWNL;
                                $scope.PreAdmAnesthetistObj.IsRespiratoryNormal = $scope.CardiologistDetails.IsRespiratoryNormal;

                                //$scope.PreAdmAnesthetistObj.SocialNotes = $scope.CardiologistDetails.SocialNotes || "";
                                $scope.PreAdmAnesthetistObj.RespiratoryNotes = $scope.CardiologistDetails.RespiratoryNotes || "";
                                $scope.PreAdmAnesthetistObj.PulmonaryNotes = $scope.CardiologistDetails.PulmonaryNotes || "";
                                $scope.PreAdmAnesthetistObj.PsychosisNotes = $scope.CardiologistDetails.PsychosisNotes || "";
                                $scope.PreAdmAnesthetistObj.OthersNotes = $scope.CardiologistDetails.OthersNotes || "";
                                $scope.PreAdmAnesthetistObj.NeurologicNotes = $scope.CardiologistDetails.NeurologicNotes || "";
                                $scope.PreAdmAnesthetistObj.NervousSystemNotes = $scope.CardiologistDetails.NervousSystemNotes || "";
                                $scope.PreAdmAnesthetistObj.MusculoSkeletalSystemNotes = $scope.CardiologistDetails.MusculoSkeletalSystemNotes || "";
                                $scope.PreAdmAnesthetistObj.KidneyDiseaseNotes = $scope.CardiologistDetails.KidneyDiseaseNotes || "";
                                $scope.PreAdmAnesthetistObj.HepaticNotes = $scope.CardiologistDetails.HepaticNotes || "";
                                $scope.PreAdmAnesthetistObj.HemeOncNotes = $scope.CardiologistDetails.HemeOncNotes || "";
                                $scope.PreAdmAnesthetistObj.EndocrineNotes = $scope.CardiologistDetails.EndocrineNotes || "";
                                $scope.PreAdmAnesthetistObj.CardiacNotes = $scope.CardiologistDetails.CardiacNotes || "";
                                //$scope.PreAdmAnesthetistObj.CNSNotes = $scope.CardiologistDetails.CNSNotes || "";
                                $scope.PreAdmAnesthetistObj.AutoImmuneDisordersNotes = $scope.CardiologistDetails.AutoImmuneDisordersNotes || "";

                                $scope.PreAdmAnesthetistObj.IsHeentWNL = $scope.CardiologistDetails.IsHeentWNL;
                                $scope.PreAdmAnesthetistObj.IsLungsWNL = $scope.CardiologistDetails.IsLungsWNL;
                                $scope.PreAdmAnesthetistObj.HeentNotes = $scope.CardiologistDetails.HeentNotes || "";
                                $scope.PreAdmAnesthetistObj.LungsNotes = $scope.CardiologistDetails.LungsNotes || "";


                                if ($scope.PreAdmAnesthetistObj.LabObj.IsPretransfusion == "" && $scope.PreAdmAnesthetistObj.LabObj.IsBloodAvailable == "" && $scope.PreAdmAnesthetistObj.LabObj.UrineAnalysis == "" && $scope.PreAdmAnesthetistObj.LabObj.HGB == "" && $scope.PreAdmAnesthetistObj.LabObj.HCT == "" && $scope.PreAdmAnesthetistObj.LabObj.WBC == "" && $scope.PreAdmAnesthetistObj.LabObj.RBC == "" && $scope.PreAdmAnesthetistObj.LabObj.A1C == "" && $scope.PreAdmAnesthetistObj.LabObj.Creatinine == "" &&
                                    $scope.PreAdmAnesthetistObj.LabObj.RBS == "" && $scope.PreAdmAnesthetistObj.LabObj.FBS == "" && $scope.PreAdmAnesthetistObj.LabObj.PBBS == "" && $scope.PreAdmAnesthetistObj.LabObj.PBLS == "" && $scope.PreAdmAnesthetistObj.LabObj.Notes == "") {
                                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = false;
                                } else {
                                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = true;
                                }
                                if ($scope.PreAdmAnesthetistObj.CardioVascularObj.Systolic == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.Diastolic == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.PR == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.ECG == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.ECGUnits == "" &&
                                    $scope.PreAdmAnesthetistObj.CardioVascularObj.Notes == "") {
                                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = false;
                                } else {
                                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = true;
                                }

                                if ($scope.PreAdmAnesthetistObj.RespiratoryNotes != '') {
                                    $scope.PreAdmAnesthetistObj.RespiratoryNotesInd = true;
                                } else {
                                    $scope.PreAdmAnesthetistObj.RespiratoryNotesInd = false;
                                }

                                if ($scope.PreAdmAnesthetistObj.LabObj.Notes != '') {
                                    $scope.PreAdmAnesthetistObj.LabObjInd = true;
                                } else {
                                    $scope.PreAdmAnesthetistObj.LabObjInd = false;
                                }
                            }
                        }
                    }, function (err) {
                        console.log(err);
                    });
                }, function () {
                });
            };

            $scope.DeleteHealthPhysicalData = function (item, val) {
                if (item.PreAdmissionId == 0 || item.PreAdmissionId == null) {
                    if (val == 1) {
                        $scope.PreAdmAnesthetistObj.LabObj = angular.copy($scope.GetLabObj());
                        if ($scope.PreAdmAnesthetistObj.LabObj.IsPretransfusion == "" && $scope.PreAdmAnesthetistObj.LabObj.IsBloodAvailable == "" && $scope.PreAdmAnesthetistObj.LabObj.UrineAnalysis == "" && $scope.PreAdmAnesthetistObj.LabObj.HGB == "" && $scope.PreAdmAnesthetistObj.LabObj.HCT == "" && $scope.PreAdmAnesthetistObj.LabObj.WBC == "" && $scope.PreAdmAnesthetistObj.LabObj.RBC == "" && $scope.PreAdmAnesthetistObj.LabObj.A1C == "" && $scope.PreAdmAnesthetistObj.LabObj.Creatinine == "" &&
                            $scope.PreAdmAnesthetistObj.LabObj.RBS == "" && $scope.PreAdmAnesthetistObj.LabObj.FBS == "" && $scope.PreAdmAnesthetistObj.LabObj.PBBS == "" && $scope.PreAdmAnesthetistObj.LabObj.PBLS == "" && $scope.PreAdmAnesthetistObj.LabObj.Notes == "") {
                            $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = true;
                        }

                    }
                    if (val == 2) {
                        $scope.PreAdmAnesthetistObj.CardioVascularObj.Systolic = "";
                        $scope.PreAdmAnesthetistObj.CardioVascularObj.Diastolic = "";
                        $scope.PreAdmAnesthetistObj.CardioVascularObj.PR = "";
                        $scope.PreAdmAnesthetistObj.CardioVascularObj.ECG = "";
                        $scope.PreAdmAnesthetistObj.CardioVascularObj.ECGUnits = "";
                        $scope.PreAdmAnesthetistObj.CardioVascularObj.Notes = "";

                        if ($scope.PreAdmAnesthetistObj.CardioVascularObj.Systolic == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.Diastolic == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.PR == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.ECG == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.ECGUnits == "" &&
                            $scope.PreAdmAnesthetistObj.CardioVascularObj.Notes == "") {
                            $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = true;
                        }
                    }
                    if (val == 3) {
                        $scope.PreAdmAnesthetistObj.AirwayObj.IsNormal = false;
                        $scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS = "";
                        $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP = "";
                        $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT = "";
                        $scope.PreAdmAnesthetistObj.AirwayObj.Class = "";
                        $scope.PreAdmAnesthetistObj.AirwayObj.Notes = "";

                        if ($scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS == "" && $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT == "" && $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP == "" && !$scope.PreAdmAnesthetistObj.AirwayObj.IsNormal &&
                            $scope.PreAdmAnesthetistObj.AirwayObj.Notes == "" && $scope.PreAdmAnesthetistObj.AirwayObj.Class == "") {
                            $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationAirwayInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationAirwayInd = true;
                        }
                    }
                    if (val == 4) {
                        $scope.PreAdmAnesthetistObj.RespiratoryNotes = '';
                        var RespiratoryData = $filter("filter")($scope.PreAdmAnesthetistObj.HealthArray, { "CategoryId": 13 }, true) || [];
                        if (RespiratoryData.length > 0) {
                            angular.forEach(RespiratoryData, function (pitem) {
                                pitem.IsChecked = false;
                            });
                        }
                    }
                    if (val == 5) {
                        $scope.PreAdmAnesthetistObj.CNSNotes = "";
                        $scope.PreAdmAnesthetistObj.IsCNSHistory = null;

                        $scope.PreAdmAnesthetistObjCNSNotes = false;

                        if ($scope.PreAdmAnesthetistObj.CNSNotes == "" || $scope.PreAdmAnesthetistObj.IsCNSHistory == null) {
                            $scope.PreAdmAnesthetistObjCNSNotes = true;
                        }
                    }
                    if (val == 6) {
                        $scope.PreAdmAnesthetistObj.SocialNotes = "";
                        var SocialData = $filter("filter")($scope.PreAdmAnesthetistObj.HealthArray, { "CategoryId": 15 }, true) || [];
                        if (SocialData.length > 0) {


                            angular.forEach(SocialData, function (pitem) {
                                pitem.IsChecked = false;
                            });
                        }
                    }
                    if (val == 7) {

                        $scope.PreAdmAnesthetistObj.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());
                        if ($scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPrevAnesthesia && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsComplications == null && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsFamilyHistory && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsDifficultAirway && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPONV
                            && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPatientDNR && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsSuspend && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsContinue && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.Notes == '') {
                            $scope.PreAdmissionSummaryObj.IsPrAdmPreviousInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPrAdmPreviousInd = true;
                        }

                    }
                    if (val == 9) {
                        $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj = angular.copy($scope.GetAPAnesthesiaOptionsObj());
                        if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.Dosage == "" && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistId == null && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsTopicalAnesthesia && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsLocalAnesthesia && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsGeneralAnesthesia &&
                            $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsRegionalAnesthesia && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsSubtenonAnesthesia && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsIVSedation && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistName == "" && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistNotes == "") {
                            $scope.PreAdmissionSummaryObj.IsPrAdmAssPlanInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPrAdmAssPlanInd = true;
                        }

                    }
                    if (val == 8) {

                        $scope.PreAdmAnesthetistObj.ASAObj.Notes = "";
                        $scope.PreAdmAnesthetistObj.ASAObj.Value = "";
                        if ($scope.PreAdmAnesthetistObj.ASAObj.Notes == "" && $scope.PreAdmAnesthetistObj.ASAObj.Value == "") {
                            $scope.PreAdmissionSummaryObj.IsPrAdmAssessmentInd = false;
                        }
                        else {
                            $scope.PreAdmissionSummaryObj.IsPrAdmAssessmentInd = true;
                        }
                    }
                } else {
                    var Obj = {
                        "PreAdmissionId": item.PreAdmissionId || null,
                        "OrganizationId": $scope.HospitalId || 0,
                        "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                        "PatientId": item.PatientId || null,
                        "TypeId": val
                    }
                    eHnoteSurgeryService.DeletePreAdmissionHelathPhysicalData(Obj).then(function (response) {

                        if (response.data.Status === "Success") {

                            if (val == 1) {
                                $scope.PreAdmAnesthetistObj.LabObj = angular.copy($scope.GetLabObj());

                                if ($scope.PreAdmAnesthetistObj.LabObj.IsPretransfusion == "" && $scope.PreAdmAnesthetistObj.LabObj.IsBloodAvailable == "" && $scope.PreAdmAnesthetistObj.LabObj.UrineAnalysis == "" && $scope.PreAdmAnesthetistObj.LabObj.HGB == "" && $scope.PreAdmAnesthetistObj.LabObj.HCT == "" && $scope.PreAdmAnesthetistObj.LabObj.WBC == "" && $scope.PreAdmAnesthetistObj.LabObj.RBC == "" && $scope.PreAdmAnesthetistObj.LabObj.A1C == "" && $scope.PreAdmAnesthetistObj.LabObj.Creatinine == "" &&
                                    $scope.PreAdmAnesthetistObj.LabObj.RBS == "" && $scope.PreAdmAnesthetistObj.LabObj.FBS == "" && $scope.PreAdmAnesthetistObj.LabObj.PBBS == "" && $scope.PreAdmAnesthetistObj.LabObj.PBLS == "" && $scope.PreAdmAnesthetistObj.LabObj.Notes == "") {
                                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = false;
                                } else {
                                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = true;
                                }

                            }
                            if (val == 2) {
                                $scope.PreAdmAnesthetistObj.CardioVascularObj.Systolic = "";
                                $scope.PreAdmAnesthetistObj.CardioVascularObj.Diastolic = "";
                                $scope.PreAdmAnesthetistObj.CardioVascularObj.PR = "";
                                $scope.PreAdmAnesthetistObj.CardioVascularObj.ECG = "";
                                $scope.PreAdmAnesthetistObj.CardioVascularObj.ECGUnits = "";
                                $scope.PreAdmAnesthetistObj.CardioVascularObj.Notes = "";

                                if ($scope.PreAdmAnesthetistObj.CardioVascularObj.Systolic == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.Diastolic == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.PR == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.ECG == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.ECGUnits == "" &&
                                    $scope.PreAdmAnesthetistObj.CardioVascularObj.Notes == "") {
                                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = false;
                                } else {
                                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = true;
                                }
                            }
                            if (val == 3) {
                                $scope.PreAdmAnesthetistObj.AirwayObj.IsNormal = false;
                                $scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS = "";
                                $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP = "";
                                $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT = "";
                                $scope.PreAdmAnesthetistObj.AirwayObj.Class = "";
                                $scope.PreAdmAnesthetistObj.AirwayObj.Notes = "";

                                if ($scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS == "" && $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT == "" && $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP == "" && !$scope.PreAdmAnesthetistObj.AirwayObj.IsNormal &&
                                    $scope.PreAdmAnesthetistObj.AirwayObj.Notes == "" && $scope.PreAdmAnesthetistObj.AirwayObj.Class == "") {
                                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationAirwayInd = false;
                                } else {
                                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationAirwayInd = true;
                                }
                            }
                            if (val == 4) {
                                $scope.PreAdmAnesthetistObj.RespiratoryNotes = '';
                                var RespiratoryData = $filter("filter")($scope.PreAdmAnesthetistObj.HealthArray, { "CategoryId": 13 }, true) || [];
                                if (RespiratoryData.length > 0) {
                                    angular.forEach(RespiratoryData, function (pitem) {
                                        pitem.IsChecked = false;
                                    });
                                }
                            }
                            if (val == 5) {
                                $scope.PreAdmAnesthetistObj.CNSNotes = "";
                                $scope.PreAdmAnesthetistObj.IsCNSHistory = null;

                                $scope.PreAdmAnesthetistObjCNSNotes = false;

                                if ($scope.PreAdmAnesthetistObj.CNSNotes == "" || $scope.PreAdmAnesthetistObj.IsCNSHistory == null) {
                                    $scope.PreAdmAnesthetistObjCNSNotes = true;
                                }
                            }
                            if (val == 6) {
                                $scope.PreAdmAnesthetistObj.SocialNotes = "";
                                var SocialData = $filter("filter")($scope.PreAdmAnesthetistObj.HealthArray, { "CategoryId": 15 }, true) || [];
                                if (SocialData.length > 0) {
                                    angular.forEach(SocialData, function (pitem) {
                                        pitem.IsChecked = false;
                                    });
                                }

                            }
                            if (val == 7) {


                                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());
                                if ($scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPrevAnesthesia && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsComplications == null && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsFamilyHistory && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsDifficultAirway && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPONV
                                    && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPatientDNR && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsSuspend && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsContinue && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.Notes == '') {
                                    $scope.PreAdmissionSummaryObj.IsPrAdmPreviousInd = false;
                                } else {
                                    $scope.PreAdmissionSummaryObj.IsPrAdmPreviousInd = true;
                                }


                            }
                            if (val == 9) {
                                $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj = angular.copy($scope.GetAPAnesthesiaOptionsObj());
                                if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.Dosage = "" && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistId == null && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsTopicalAnesthesia && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsLocalAnesthesia && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsGeneralAnesthesia &&
                                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsRegionalAnesthesia && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsSubtenonAnesthesia && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsIVSedation && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistName == "" && $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistNotes == "") {
                                    $scope.PreAdmissionSummaryObj.IsPrAdmAssPlanInd = false;
                                } else {
                                    $scope.PreAdmissionSummaryObj.IsPrAdmAssPlanInd = true;
                                }

                            }
                            if (val == 8) {

                                $scope.PreAdmAnesthetistObj.ASAObj.Notes = "";
                                $scope.PreAdmAnesthetistObj.ASAObj.Value = "";

                                if ($scope.PreAdmAnesthetistObj.ASAObj.Notes == "" && $scope.PreAdmAnesthetistObj.ASAObj.Value == "") {
                                    $scope.PreAdmissionSummaryObj.IsPrAdmAssessmentInd = false;
                                }
                                else {
                                    $scope.PreAdmissionSummaryObj.IsPrAdmAssessmentInd = true;
                                }
                            }
                        }

                    }, function (err) {
                        console.log(err);
                    });
                }
            }

            $scope.$on("PreAdmSummaryNavSubEvent", function (event, data) {
                if (data == 1) {
                    $scope.init();
                } else if (data == 2) {
                    $scope.ChangeTab(10);
                } else if (data == 3) {
                    $scope.ChangeTab(12);
                }
            });

            $scope.SelectUrineAnalysis = function (val) {
                if (val == 1) {
                    if ($scope.PreAdmAnesthetistObj.LabObj.UrineAnalysis == "" || $scope.PreAdmAnesthetistObj.LabObj.UrineAnalysis == "NEGATIVE") {
                        $scope.PreAdmAnesthetistObj.LabObj.UrineAnalysis = "POSITIVE";
                    } else {
                        $scope.PreAdmAnesthetistObj.LabObj.UrineAnalysis = "";
                    }
                }
                if (val == 2) {
                    if ($scope.PreAdmAnesthetistObj.LabObj.UrineAnalysis == "" || $scope.PreAdmAnesthetistObj.LabObj.UrineAnalysis == "POSITIVE") {
                        $scope.PreAdmAnesthetistObj.LabObj.UrineAnalysis = "NEGATIVE";
                    } else {
                        $scope.PreAdmAnesthetistObj.LabObj.UrineAnalysis = "";
                    }
                }
            }

            $scope.SelectBloodAvailability = function (val) {
                if (val == 1) {
                    if ($scope.PreAdmAnesthetistObj.LabObj.IsBloodAvailable == "" || $scope.PreAdmAnesthetistObj.LabObj.IsBloodAvailable == "No") {
                        $scope.PreAdmAnesthetistObj.LabObj.IsBloodAvailable = "Yes";
                    } else {
                        $scope.PreAdmAnesthetistObj.LabObj.IsBloodAvailable = "";
                    }
                }
                if (val == 2) {
                    if ($scope.PreAdmAnesthetistObj.LabObj.IsBloodAvailable == "" || $scope.PreAdmAnesthetistObj.LabObj.IsBloodAvailable == "Yes") {
                        $scope.PreAdmAnesthetistObj.LabObj.IsBloodAvailable = "No";
                    } else {
                        $scope.PreAdmAnesthetistObj.LabObj.IsBloodAvailable = "";
                    }
                }
            }

            $scope.SelectPreTransfusion = function (val) {
                if (val == 1) {
                    if ($scope.PreAdmAnesthetistObj.LabObj.IsPretransfusion == "" || $scope.PreAdmAnesthetistObj.LabObj.IsPretransfusion == "No") {
                        $scope.PreAdmAnesthetistObj.LabObj.IsPretransfusion = "Yes";
                    } else {
                        $scope.PreAdmAnesthetistObj.LabObj.IsPretransfusion = "";
                    }
                }
                if (val == 2) {
                    if ($scope.PreAdmAnesthetistObj.LabObj.IsPretransfusion == "" || $scope.PreAdmAnesthetistObj.LabObj.IsPretransfusion == "Yes") {
                        $scope.PreAdmAnesthetistObj.LabObj.IsPretransfusion = "No";
                    } else {
                        $scope.PreAdmAnesthetistObj.LabObj.IsPretransfusion = "";
                    }
                }
            }

            $scope.OnClickNormal = function () {
                if ($scope.PreAdmAnesthetistObj.AirwayObj.IsNormal) {
                    $scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS = "Full";
                    $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP = "Full";
                    $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT = "Full";
                } else {
                    $scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS = "";
                    $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP = "";
                    $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT = "";
                }
            };

            $scope.SelectTMS = function (val) {
                if (val == 1) {
                    if ($scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS == "" || $scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS == "Limited") {
                        $scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS = "Full";
                    } else {
                        $scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS = "";
                    }
                }
                if (val == 2) {
                    if ($scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS == "" || $scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS == "Full") {
                        $scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS = "Limited";
                    } else {
                        $scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS = "";
                    }
                    $scope.PreAdmAnesthetistObj.AirwayObj.IsNormal = false;
                }
            };

            $scope.RomNeckAP = function (val) {
                if (val == 1) {
                    if ($scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP == "" || $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP == "Limited") {
                        $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP = "Full";
                    } else {
                        $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP = "";
                    }
                }
                if (val == 2) {
                    if ($scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP == "" || $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP == "Full") {
                        $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP = "Limited";
                    } else {
                        $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP = "";
                    }
                    $scope.PreAdmAnesthetistObj.AirwayObj.IsNormal = false;
                }
            };

            $scope.RomNeckLAT = function (val) {
                if (val == 1) {
                    if ($scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT == "" || $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT == "Limited") {
                        $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT = "Full";
                    } else {
                        $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT = "";
                    }
                }
                if (val == 2) {
                    if ($scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT == "" || $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT == "Full") {
                        $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT = "Limited";
                    } else {
                        $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT = "";
                    }
                    $scope.PreAdmAnesthetistObj.AirwayObj.IsNormal = false;
                }
            };

            $scope.SelectClass = function (val) {
                if (val === 1) {
                    if ($scope.PreAdmAnesthetistObj.AirwayObj.Class == val) {
                        $scope.PreAdmAnesthetistObj.AirwayObj.Class = '';
                    } else {
                        $scope.PreAdmAnesthetistObj.AirwayObj.Class = val;
                    }
                }
                if (val === 2) {
                    if ($scope.PreAdmAnesthetistObj.AirwayObj.Class == val) {
                        $scope.PreAdmAnesthetistObj.AirwayObj.Class = '';
                    } else {
                        $scope.PreAdmAnesthetistObj.AirwayObj.Class = val;
                    }
                }
                if (val === 3) {
                    if ($scope.PreAdmAnesthetistObj.AirwayObj.Class == val) {
                        $scope.PreAdmAnesthetistObj.AirwayObj.Class = '';
                    } else {
                        $scope.PreAdmAnesthetistObj.AirwayObj.Class = val;
                    }
                }
                if (val === 4) {
                    if ($scope.PreAdmAnesthetistObj.AirwayObj.Class == val) {
                        $scope.PreAdmAnesthetistObj.AirwayObj.Class = '';
                    } else {
                        $scope.PreAdmAnesthetistObj.AirwayObj.Class = val;
                    }
                }
            };

            $scope.SelectCXR = function (val) {
                if (val == 1) {
                    if ($scope.PreAdmAnesthetistObj.IsCXR == "" || $scope.PreAdmAnesthetistObj.IsCXR == "No") {
                        $scope.PreAdmAnesthetistObj.IsCXR = "Yes";
                    } else {
                        $scope.PreAdmAnesthetistObj.IsCXR = "";
                    }
                }
                if (val == 2) {
                    if ($scope.PreAdmAnesthetistObj.IsCXR == "" || $scope.PreAdmAnesthetistObj.IsCXR == "Yes") {
                        $scope.PreAdmAnesthetistObj.IsCXR = "No";
                    } else {
                        $scope.PreAdmAnesthetistObj.IsCXR = "";
                    }
                }
            }

            $scope.SelectCXRHistory = function (val) {
                if (val == 1) {
                    if ($scope.PreAdmAnesthetistObj.CXRHistory == "" || $scope.PreAdmAnesthetistObj.CXRHistory == "No") {
                        $scope.PreAdmAnesthetistObj.CXRHistory = "Yes";
                    } else {
                        $scope.PreAdmAnesthetistObj.CXRHistory = "";
                    }
                }
                if (val == 2) {
                    if ($scope.PreAdmAnesthetistObj.CXRHistory == "" || $scope.PreAdmAnesthetistObj.CXRHistory == "Yes") {
                        $scope.PreAdmAnesthetistObj.CXRHistory = "No";
                    } else {
                        $scope.PreAdmAnesthetistObj.CXRHistory = "";
                    }
                }
            }

            $scope.SelectCNSBtn = function (val) {
                if (val === 1) {
                    if ($scope.PreAdmAnesthetistObj.IsCNSHistory == false && $scope.PreAdmAnesthetistObj.IsCNSHistory != null) {
                        $scope.PreAdmAnesthetistObj.IsCNSHistory = null;
                    } else {
                        $scope.PreAdmAnesthetistObj.IsCNSHistory = false;
                    }
                }
                if (val === 2) {
                    if ($scope.PreAdmAnesthetistObj.IsCNSHistory) {
                        $scope.PreAdmAnesthetistObj.IsCNSHistory = null;
                    } else {
                        $scope.PreAdmAnesthetistObj.IsCNSHistory = true;
                    }
                }
            };

            $scope.SelectCardiovascularHistoryBtn = function (val) {
                if (val === 1) {
                    if ($scope.PreAdmAnesthetistObj.IsCardiovascularHistory === false && $scope.PreAdmAnesthetistObj.IsCardiovascularHistory != null) {
                        $scope.PreAdmAnesthetistObj.IsCardiovascularHistory = null;
                    } else {
                        $scope.PreAdmAnesthetistObj.IsCardiovascularHistory = false;
                    }
                }
                if (val === 2) {
                    if ($scope.PreAdmAnesthetistObj.IsCardiovascularHistory) {
                        $scope.PreAdmAnesthetistObj.IsCardiovascularHistory = null;
                    } else {
                        $scope.PreAdmAnesthetistObj.IsCardiovascularHistory = true;
                    }
                }
            };

            $scope.SelectCardiovascularBpBtn = function (val) {
                if (val == 1) {
                    if ($scope.PreAdmAnesthetistObj.CardioVascularObj.BPlevel == "" || $scope.PreAdmAnesthetistObj.CardioVascularObj.BPlevel == "Low") {
                        $scope.PreAdmAnesthetistObj.CardioVascularObj.BPlevel = "High";
                    } else {
                        $scope.PreAdmAnesthetistObj.CardioVascularObj.BPlevel = "";
                    }
                }
                if (val == 2) {
                    if ($scope.PreAdmAnesthetistObj.CardioVascularObj.BPlevel == "" || $scope.PreAdmAnesthetistObj.CardioVascularObj.BPlevel == "High") {
                        $scope.PreAdmAnesthetistObj.CardioVascularObj.BPlevel = "Low";
                    } else {
                        $scope.PreAdmAnesthetistObj.CardioVascularObj.BPlevel = "";
                    }
                }
            }

            $scope.OnSelectPrevAnesthesiaBtn = function (val) {
                if (val == 1) {
                    $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPrevAnesthesia = true;
                }
                if (val == 2) {
                    $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPrevAnesthesia = false;
                }
                if (val == 3) {
                    if ($scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsComplications) {
                        $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsComplications = null;
                    } else {
                        $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsComplications = true;
                    }

                }
                if (val == 4) {
                    if ($scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsComplications == false && $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsComplications != null) {
                        $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsComplications = null;
                    } else {
                        $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsComplications = false;
                    }
                }
            };

            $scope.OnSelectAssessPlanOption = function (val) {
                if (val == 1) {
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsTopicalAnesthesia = !$scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsTopicalAnesthesia;

                    if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsTopicalAnesthesia) {
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
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsLocalAnesthesia = !$scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsLocalAnesthesia;

                    if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsLocalAnesthesia) {
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
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsGeneralAnesthesia = !$scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsGeneralAnesthesia;

                    if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsGeneralAnesthesia) {
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
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsRegionalAnesthesia = !$scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsRegionalAnesthesia;

                    if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsRegionalAnesthesia) {
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
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia = !$scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia;

                    if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia) {
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
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsSubtenonAnesthesia = !$scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsSubtenonAnesthesia;

                    if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsSubtenonAnesthesia) {
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
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsIVSedation = !$scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsIVSedation;

                    if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsIVSedation) {
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
            };

            $scope.ToggleSocialBtn = function (value, item) {
                if (value == 1) {
                    if (!item.IsChecked || item.IsChecked == null) {
                        item.IsChecked = true;
                    } else {
                        item.IsChecked = null;
                        item.Date = null;
                        item.StatusId = null;
                        item.StatusName = "";
                        item.QuantityId = null;
                        item.QuantityName = "";
                    }
                } else {
                    if (item.IsChecked || item.IsChecked == null) {
                        item.IsChecked = false;
                        item.Date = null;
                        item.StatusId = null;
                        item.StatusName = "";
                        item.QuantityId = null;
                        item.QuantityName = "";
                    } else {
                        item.IsChecked = null;
                    }
                }
            };

            $scope.ToggleAnesthOtherSystemBtn = function (value, item) {
                if (value == 1) {
                    if (!item.IsChecked || item.IsChecked == null) {
                        item.IsChecked = true;
                    } else {
                        item.IsChecked = null;
                    }
                } else {
                    if (item.IsChecked || item.IsChecked == null) {
                        item.IsChecked = false;
                    } else {
                        item.IsChecked = null;
                    }
                }
            };

            $scope.ChangeSmokeQuantity = function (item) {
                item.QuantityId = item.QuantityId || null;
                if (item.QuantityId == null) {
                    item.QuantityId = null;
                    item.QuantityName = "";
                } else {
                    var statusfilter = $filter("filter")($scope.PreAdmAnesthetistObj.SmokingQuantity, { "HistoryHabitsID": item.QuantityId }, true) || [];
                    if (statusfilter.length > 0) {
                        item.QuantityName = statusfilter[0].HabitsDescription;
                    }
                }
            };

            $scope.ChangeSmokeStatus = function (item) {
                item.StatusId = item.StatusId || null;
                if (item.StatusId == null) {
                    item.StatusId = null;
                    item.StatusName = "";
                } else {
                    var statusfilter = $filter("filter")($scope.PreAdmAnesthetistObj.SmokingStatus, { "HistoryHabitsID": item.StatusId }, true) || [];
                    if (statusfilter.length > 0) {
                        item.StatusName = statusfilter[0].HabitsDescription;
                    }
                }
            }

            $scope.ChangeAlcoholstatus = function (item) {
                item.StatusId = item.StatusId || 0;
                if (item.StatusId == 0) {
                    item.StatusId = 0;
                    item.StatusName = "";
                } else {
                    var statusfilter = $filter("filter")($scope.PreAdmAnesthetistObj.AlcoholStatus, { "HistoryHabitsID": item.StatusId }, true) || [];
                    if (statusfilter.length > 0) {
                        item.StatusName = statusfilter[0].HabitsDescription;
                    }
                }
            };
            $scope.ChangeAlcoholQuantity = function (item) {
                item.QuantityId = item.QuantityId || 0;
                if (item.QuantityId == 0) {
                    item.QuantityId = 0;
                    item.QuantityName = "";
                } else {
                    var statusfilter = $filter("filter")($scope.PreAdmAnesthetistObj.AlcoholQuantity, { "HistoryHabitsID": item.QuantityId }, true) || [];
                    if (statusfilter.length > 0) {
                        item.QuantityName = statusfilter[0].HabitsDescription;
                    }
                }
            };

            $scope.ChangeDrugStatus = function (item) {
                item.StatusId = item.StatusId || 0;
                if (item.StatusId == 0) {
                    item.StatusId = 0;
                    item.StatusName = "";
                } else {
                    var statusfilter = $filter("filter")($scope.PreAdmAnesthetistObj.DrugNames, { "HistoryHabitsID": item.StatusId }, true) || [];
                    if (statusfilter.length > 0) {
                        item.StatusName = statusfilter[0].HabitsDescription;
                    }
                }
            };
            $scope.ChangeDrugQuantity = function (item) {
                item.QuantityId = item.QuantityId || 0;
                if (item.QuantityId == 0) {
                    item.QuantityId = 0;
                    item.QuantityName = "";
                } else {
                    var statusfilter = $filter("filter")($scope.PreAdmAnesthetistObj.DrugQuantity, { "HistoryHabitsID": item.QuantityId }, true) || [];
                    if (statusfilter.length > 0) {
                        item.QuantityName = statusfilter[0].HabitsDescription;
                    }
                }
            };
      
            $scope.AddLabTest = function () {
                let index = $scope.PreAdmAnesthetistObj.LabObj.LabTestArray.length - 1;

                if (index >= 3) {
                    $scope.PreAdmAnesthetistObj.LabObj.IsShowLabTestName = true;
                }

                if ($scope.PreAdmAnesthetistObj.LabObj.LabTestArray[index].Name !== "" && ($scope.PreAdmAnesthetistObj.LabObj.LabTestArray[index].IsNormalLimitsChecked || $scope.PreAdmAnesthetistObj.LabObj.LabTestArray[index].IsAbnormalChecked)) {
                    let obj = {
                        "Name": "",
                        "IsNormalLimitsChecked": false,
                        "IsAbnormalChecked": false,
                        "Notes": ""
                    };
                    $scope.PreAdmAnesthetistObj.LabObj.LabTestArray.push(obj);
                } else {
                    alertify.error("Please select values!");
                    return;
                }
            };


            $scope.PreAdmSignOff = function (str) {

                let obj = {
                    "Screen": "Anesthesia PreAdmission",
                    "Type": "SignOff"
                };

                let signmodalInstance = $uibModal.open({
                    "templateUrl": "templates/consultation/SignOffPasswordRequired.html",
                    "controller": "UsPasswordAuthenticationPopupCtrl",
                    //"size": "md",
                    "windowClass": "appointment-full-popup",
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

            $scope.PreAdmshownotes = {
                "PreAdmnotes1": false,
                "PreAdmnotes2": false,
                "PreAdmnotes3": false,
                "PreAdmnotes4": false,
                "PreAdmnotes5": false,
                "PreAdmnotes6": false,
                "PreAdmnotes7": false,
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
                            var obj = {
                                "file": $scope.file,
                                "S3URL": "",
                                "DeleteInd": false,
                                "DocumentID": 0,
                                "DocumentName": $scope.file.name || "",
                                "FileName": $scope.file.name || "",
                                "FileExt": $scope.file.type,
                                "FileTypeId": 26,
                                "DisplayName": $scope.file.name || ""
                            };

                            $scope.FilesObj.TempImagesArray.push(obj);


                            angular.element("input[type='file']").val(null);
                        }
                    });
                }
            };


        $scope.ClearECGvalue = function (item) {

            if (item == '') {
                $scope.PreAdmAnesthetistObj.CardioVascularObj.ECGUnits = 'select';
            }
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

        $scope.ShowAddPreAdmissionPopup = function () {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/preAdmissionAdd.html",
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

        $scope.AddSystematicHistorymore = function () {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/Advancedhealth.html",
                "backdrop": "static",
                "keyboard": false,
                //"windowClass": "modal__popup--1 bottom-to-top-modal in",
                "windowClass": "offcanves-right",
                "scope": $scope,
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.closeuibpopup = function () {
                        $uibModalInstance.dismiss();
                    };
                },
            });
        };

        $scope.GetSurgeryStaffListDetails = function () {

            let obj = {
                "AppointmentID": $scope.cacheStorageItem.AppointmentId,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId
            };

            eHnoteSurgeryService.GetASCAppointmentSurgeryStaff(obj).then(function (response) {
                console.log(response);
                if (response.data.Status === "Success") {

                    let respObj = angular.copy(response.data.rows[0]);

                    $scope.SurgeryDiagnosisObj.SurgeonID = angular.copy(respObj.SurgeonID);
                    if (respObj.SurgeonID == 0) {
                        $scope.SurgeryDiagnosisObj.SurgeonID = $scope.cacheStorageItem.DoctorID;
                    }
                    let tempArray = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == respObj.SurgeonID }, true);
                    if (tempArray.length > 0) {
                        $scope.SurgeryDiagnosisObj.Surgeon = tempArray[0].FullName;
                    }

                    $scope.SurgeryDiagnosisObj.CoSurgeonId = angular.copy(respObj.CoSurgeonId);
                    let tempArray3 = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == respObj.CoSurgeonId }, true);
                    if (tempArray3.length > 0) {
                        $scope.SurgeryDiagnosisObj.CoSurgeon = tempArray3[0].FullName;
                    }


                    $scope.SurgeryDiagnosisObj.AnesthetistID = angular.copy(respObj.AnesthetistID);
                    let tempArray1 = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == respObj.AnesthetistID }, true);
                    if (tempArray1.length > 0) {
                        $scope.SurgeryDiagnosisObj.Anesthetist = tempArray1[0].FullName;
                    }

                    $scope.SurgeryDiagnosisObj.NurseID = angular.copy(respObj.NurseID);
                    let tempArray2 = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == respObj.NurseID }, true);
                    if (tempArray2.length > 0) {
                        $scope.SurgeryDiagnosisObj.Nurse = tempArray2[0].FullName;
                    }

                    $scope.SurgeryDiagnosisObj.InternalCoManagerId = respObj.InternalCoManagerId || null;
                    $scope.SurgeryDiagnosisObj.ExternalCoManagerId = respObj.ExternalCoManagerId || null;

                    $scope.SurgeryDiagnosisObj.DiagnosisList = angular.copy(respObj.DiagnosisList);
                    $scope.SurgeryDiagnosisObj.Height = angular.copy(respObj.Height);
                    $scope.SurgeryDiagnosisObj.Weight = angular.copy(respObj.Weight);
                    $scope.SurgeryDiagnosisObj.HeightUnitName = angular.copy(respObj.HeightUnitName);
                    $scope.SurgeryDiagnosisObj.WeightUnitName = angular.copy(respObj.WeightUnitName);

                }
            });
        }

        $scope.OpenAnesthesiaPopup = function () {

            let initObj = {
                "CurrentMedicationList": [],
                "MedicationsList": [],
                "InvestigationsList": $scope.PreAdmObj.InvestigationsList || [],
                "PatientId": $scope.cacheStorageItem.PatientID,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                "DoctorId": $scope.cacheStorageItem.DoctorID,
                "PrescriptionDetails": $scope.PreAdmObj.MedicineOrdersList || []
            };
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/PreAdmissionAnesthesiaPopup.html",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                "controller": "PreAdmissionAnesthesiaPopupCtrl",
                "resolve": {
                    "allUserList": function () { return angular.copy($scope.allUserList); },
                    "cache": function () { return initObj; }
                }
            });

            mInstanceAdd.result.then(function (data) {
                $scope.$emit("headerrefresh", true);
                $scope.GetPreAdmissionDetails();
            }, function () {

            });

        };

        // Check List Start Popup//
        $scope.ClinicalChecklistParentObj = {
            "CheckListRemarks": "",
            "PreAdmissionChecklistDocuments": [],
            "ClinicalChecklist": [],
            "ChecklistReviewedByName": null
        }

        $scope.ShowAddChecklistPopup = function () {
            $scope.modalInstance = $uibModal.open({
                "templateUrl": "templates/ASC/AscClinicalChecklist.html",
                "controller": "AscClinicalChecklistCtrl",
                "resolve": {
                    "allUserList": function () { return angular.copy($scope.allUserList); },

                },
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                "backdrop": "static",
                "keyboard": false
            });


            $scope.modalInstance.result.then(function (data) {
                $scope.ClinicalChecklistParentObj.CheckListRemarks = data.AdmissionRemarks || "";
                $scope.ClinicalChecklistParentObj.PreAdmissionChecklistDocuments = data.Documents || [];
                $scope.ClinicalChecklistParentObj.ClinicalChecklist = data.Checklist || [];
                $scope.ClinicalChecklistParentObj.ChecklistReviewedByName = data.ChecklistReviewedByName || null;
                $scope.ClinicalChecklistParentObj.ChecklistReviewedDate = data.ChecklistReviewedDate || "";

            }, function (cancel) {

            });
        }
         // Check List End Popup//

        $scope.CardiologyPopup = function () {

            let initObj = {
                "CurrentMedicationList": [],
                "MedicationsList": [],
                "InvestigationsList": angular.copy($scope.PreAdmObj.InvestigationsList) || [],
                "PatientId": $scope.cacheStorageItem.PatientID,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                "DoctorId": $scope.cacheStorageItem.DoctorID,
                "PrescriptionDetails": angular.copy($scope.PreAdmObj.MedicineOrdersList) || []
            };

            let modalInstance = $uibModal.open({
                "templateUrl": "templates/ASC/PreAdmCardiologyPopup.html",
                "controller": "PreAdmCardiologyPopupCtrl",
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                "backdrop": "static",
                //"scope": $scope,
                "keyboard": false,
                "resolve": {
                    "allUserList": function () { return angular.copy($scope.allUserList); },
                    "cache": function () { return initObj; }
                }
            });
            modalInstance.result.then(function (data) {
                $scope.$emit("headerrefresh", true);
                $scope.init();
            }, function (cancel) {

            });
        };

        $scope.GetPreAdmissionDetails = function () {

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

                    if (resp.data.LastSignOffUserDetails.length > 0) {
                        $scope.PreAdmObj.LastSignOffUserDetails = resp.data.LastSignOffUserDetails || [];
                    } else {
                        $scope.PreAdmObj.LastSignOffUserDetails = [];
                    }

                    if (resp.data.AllergyItems.length > 0) {
                        $scope.PreAdmObj.AllergyItems = resp.data.AllergyItems || [];
                    } else {
                        $scope.PreAdmObj.AllergyItems = [];
                    }
                    if (resp.data.CurrentEyeMedicationList.length > 0) {
                        $scope.PreAdmObj.CurrentEyeMedications = resp.data.CurrentEyeMedicationList || [];
                    } else {
                        $scope.PreAdmObj.CurrentEyeMedications = [];
                    }
                    if (resp.data.CurrentSystemicMedicationList.length > 0) {
                        $scope.PreAdmObj.CurrentSystemicMedicationsHistory = resp.data.CurrentSystemicMedicationList || [];
                    } else {
                        $scope.PreAdmObj.CurrentSystemicMedicationsHistory = [];
                    }
                    if (resp.data.SurgicalHistory.length > 0) {
                        $scope.PreAdmObj.SurgicalHistory = resp.data.SurgicalHistory || [];
                    } else {
                        $scope.PreAdmObj.SurgicalHistory = [];
                    }

                    if (resp.data.ROSOverAllRemarks != '') {
                        $scope.PreAdmObj.ROSOverAllRemarks = resp.data.ROSOverAllRemarks || [];
                    } else {
                        $scope.PreAdmObj.ROSOverAllRemarks = '';
                    }

                    $scope.PreAdmObj.InvestigationsList = angular.copy(resp.data.InvestigationsList) || [];
                    $scope.PreAdmObj.MedicineOrdersList = angular.copy(resp.data.Prescription)||[];
                    $scope.PreAdmAnesthetistObj.DocumentDetails = angular.copy(resp.data.DocumentDetails) || [];
                    $scope.PreAdmObj.LifestyleDetail = angular.copy(resp.data.LifestyleDetail) || [];

                    if (resp.data.PreAdmissionDetails.length > 0) {
                        let respObj = resp.data.PreAdmissionDetails[0];


                        if (respObj.Vitals.length > 0) {
                            $scope.PreAdmObj.Vitals = angular.copy(respObj.Vitals);
                        }
                        else {
                            $scope.PreAdmObj.Vitals = [];
                        }
                        if (respObj.SystemicHistory.length > 0) {
                            $scope.PreAdmObj.SystemicHistory = angular.copy(respObj.SystemicHistory);
                        }
                        else {
                            $scope.PreAdmObj.SystemicHistory = [];
                        }
                        if (respObj.LabInvestigation.length > 0) {
                            $scope.PreAdmObj.LabInvestigation = angular.copy(respObj.LabInvestigation);
                        } else {
                            $scope.PreAdmObj.LabInvestigation = [];
                        }
                        //if (respObj.LifestyleDetail.length > 0) {
                        //    $scope.PreAdmObj.LifestyleDetail = angular.copy(respObj.LifestyleDetail);
                        //}

                        $scope.PreAdmObj.LabNotes = respObj.LabNotes || '';
                        $scope.PreAdmObj.Airway = angular.copy($scope.AirwayObj);

                        $scope.PreAdmObj.Airway.IsNormal = respObj.Airway.IsNormal || false;
                        $scope.PreAdmObj.Airway.ROMTMS = respObj.Airway.ROMTMS || '';
                        $scope.PreAdmObj.Airway.ROMNECKAP = respObj.Airway.ROMNECKAP || '';
                        $scope.PreAdmObj.Airway.ROMNECKLAT = respObj.Airway.ROMNECKLAT || '';
                        $scope.PreAdmObj.Airway.Class = respObj.Airway.Class || '';

                        $scope.PreAdmObj.Airway.DentitionList = respObj.Airway.DentitionList || [];
                        $scope.PreAdmObj.Airway.Dentition = respObj.Airway.Dentition || '';

                        $scope.PreAdmObj.Airway.Notes = respObj.Airway.Notes || '';
                        $scope.PreAdmObj.Airway.ChemistryNotes = respObj.Airway.ChemistryNotes || '';
                        

                        if ($scope.PreAdmObj.Airway.ROMTMS == '' && $scope.PreAdmObj.Airway.ROMNECKAP == '' && $scope.PreAdmObj.Airway.ROMNECKLAT == '' && $scope.PreAdmObj.Airway.Class == '' && $scope.PreAdmObj.Airway.DentitionList.length == 0 && $scope.PreAdmObj.Airway.Dentition == '' && $scope.PreAdmObj.Airway.Notes == '') {
                            $scope.PreAdmObj.IsAirwayData = true;
                        } else {
                            $scope.PreAdmObj.IsAirwayData = false;
                        }

                        if (respObj.PreviousAnesthetics.length > 0) {
                            $scope.PrevAnestheticsObj.PreviousAnesthetics = respObj.PreviousAnesthetics || [];
                        }
                        else {
                            $scope.PrevAnestheticsObj.PreviousAnesthetics = [];
                        }
                        if ($scope.PreAdmObj.LabInvestigation.length > 0) {
                            let FiterArray = $filter('filter')($scope.PreAdmObj.LabInvestigation, function (item) {
                                return item.ResultValue != '' || item.Normal || item.AbNormal || item.Remarks !== '';
                            });
                            if (FiterArray.length == 0) {
                                $scope.PreAdmObj.IsLabInvestigationEmptyShowInd = true;
                            } else {
                                $scope.PreAdmObj.IsLabInvestigationEmptyShowInd = false;
                            }
                        }
                        else {
                            $scope.PreAdmObj.IsLabInvestigationEmptyShowInd = true;
                        }
                        //submit record identity
                        $scope.PreAdmAnesthetistObj.PreAdmissionId = respObj.PreAdmissionId || null;
                        $scope.PrevAnestheticsObj.PreAdmissionChartStatus = respObj.PreAdmissionChartStatus || "";

                        // previous anesthesia section
                        //$scope.PrevAnestheticsObj.IsComplications = respObj.PrevAnesthesia.IsComplications;
                        //$scope.PrevAnestheticsObj.IsPrevAnesthesia = respObj.PrevAnesthesia.IsPrevAnesthesia;
                        //$scope.PrevAnestheticsObj.IsFamilyHistory = respObj.PrevAnesthesia.IsFamilyHistory;
                        //$scope.PrevAnestheticsObj.IsDifficultAirway = respObj.PrevAnesthesia.IsDifficultAirway;
                        //$scope.PrevAnestheticsObj.IsPONV = respObj.PrevAnesthesia.IsPONV;
                        //$scope.PrevAnestheticsObj.IsPatientDNR = respObj.PrevAnesthesia.IsPatientDNR;
                        //$scope.PrevAnestheticsObj.IsSuspend = respObj.PrevAnesthesia.IsSuspend;
                        //$scope.PrevAnestheticsObj.IsContinue = respObj.PrevAnesthesia.IsContinue;
                        //$scope.PrevAnestheticsObj.Notes = respObj.PrevAnesthesia.Notes || "";
                        

                        //if ($scope.PrevAnestheticsObj.Notes != "") {
                        //    $scope.PreAdmAnesthetistObj.PrevAnestheticsObjNotesInd = true;
                        //} else {
                        //    $scope.PreAdmAnesthetistObj.PrevAnestheticsObjNotesInd = false;
                        //}

                        // anesthesia plan section
                        respObj.MedicineOrdersInstructions = respObj.MedicineOrdersInstructions || "";
                        if (respObj.MedicineOrdersInstructions != "") {
                            $scope.PreAdmAnesthetistObj.MedicineOrdersInstructions = respObj.MedicineOrdersInstructions;
                        } else {
                            $scope.PreAdmAnesthetistObj.MedicineOrdersInstructions = '';
                        }

                        let tempAnesthesiaTypeList = angular.copy(respObj.AnesthesiaTypelist);

                        if (tempAnesthesiaTypeList.length > 0) {
                            angular.forEach($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) {
                                kitem.IsSelected = false;
                            });
                            angular.forEach(tempAnesthesiaTypeList, function (item) {
                                angular.forEach($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) {
                                    if (kitem.AnesthesiaTypeId === item.AnesthesiaTypeId) {
                                        kitem.IsSelected = true;
                                    }
                                });
                            });
                        } else {
                            angular.forEach($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, function (kitem) {
                                    kitem.IsSelected = false;
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
                            if (item.AnesthesiaTypeId === 4 && item.IsSelected) {
                                $scope.APAnesthesiaOptionsObj.IsRegionalAnesthesia = true;
                            }
                            if (item.AnesthesiaTypeId === 5 && item.IsSelected) {
                                $scope.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia = true;
                            }
                            if (item.AnesthesiaTypeId === 6 && item.IsSelected) {
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
                        $scope.APAnesthesiaOptionsObj.AnesthetistId = respObj.AnesthesiaPlan.AnesPlanAnesthetistId || null;
                        $scope.APAnesthesiaOptionsObj.AnesthesiologistId = respObj.AnesthesiaPlan.AnesthesiologistId || null;
                        $scope.APAnesthesiaOptionsObj.AnesthetistName = "";
                        if ($scope.APAnesthesiaOptionsObj.AnesthetistId != null) {
                            let tempArray = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.APAnesthesiaOptionsObj.AnesthetistId }, true);
                            if (tempArray.length > 0) {
                                //$scope.APAnesthesiaOptionsObj.AnesthetistName = tempArray[0].FullName;

                                var SuffixName = '';
                                tempArray[0].SuffixName = tempArray[0].SuffixName || '';
                                if (tempArray[0].SuffixName != "") {
                                    SuffixName = tempArray[0].FullName + ' ' + tempArray[0].SuffixName + ',';
                                }
                                else {
                                    SuffixName = tempArray[0].FullName + ',';
                                }

                                var LicenseNumber = "";

                                tempArray[0].LicenseNumber = tempArray[0].LicenseNumber || "";
                                if (tempArray[0].LicenseNumber != "") {
                                    LicenseNumber = 'Lic:' + ' ' + tempArray[0].LicenseNumber+',';
                                }


                                if (tempArray[0].SuffixId == 10) {
                                    $scope.APAnesthesiaOptionsObj.AnesthetistName = angular.copy('Dr.' + SuffixName + ' ' + LicenseNumber);
                                } else {
                                    $scope.APAnesthesiaOptionsObj.AnesthetistName = angular.copy(SuffixName + ' ' + LicenseNumber);
                                }


                            }
                        }



                        $scope.APAnesthesiaOptionsObj.AnesthesiologistName = '';

                        if ($scope.APAnesthesiaOptionsObj.AnesthesiologistId != null) {
                            let tempArray = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.APAnesthesiaOptionsObj.AnesthesiologistId }, true);
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

                                $scope.APAnesthesiaOptionsObj.AnesthesiologistName = tempArray[0].UserFullName + ' ' + LicenseNumber;

                                //if (tempArray[0].SuffixId == 10) {
                                //    $scope.APAnesthesiaOptionsObj.AnesthesiologistName = 'Dr. ' + tempArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                                //} else {
                                //    $scope.APAnesthesiaOptionsObj.AnesthesiologistName = tempArray[0].FullName + ' ' + SuffixName + ' ' + LicenseNumber;
                                //}


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
                        // Assessment ASA section
                        $scope.PreAdmAnesthetistObj.ASAObj.EValue = respObj.AssessmentsASA.EValue || "";
                        $scope.PreAdmAnesthetistObj.ASAObj.ENotes = respObj.AssessmentsASA.ENotes || "";

                        $scope.PreAdmAnesthetistObj.ASAClassificationNotes = respObj.ASAClassificationNotes || "";

                        // prescription and investigations

                      //  $scope.PreAdmObj.MedicineOrdersList = angular.copy(respObj.Prescription);
                      //  $scope.PreAdmObj.InvestigationsList = angular.copy(respObj.InvestigationsList);


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
                                SuffixName = ReviewName.FullName+' '+ReviewName.SuffixName+',';
                            } else {
                                SuffixName = ReviewName.FullName + ',';
                            }

                            var LicenseNumber = "";

                            ReviewName.LicenseNumber = ReviewName.LicenseNumber || "";
                            if (ReviewName.LicenseNumber != "") {
                                LicenseNumber = 'Lic:' + ' ' + ReviewName.LicenseNumber+',';
                            }


                            if (ReviewName.SuffixId == 10) {
                                $scope.PreAdmAnesthetistObj.AnesthesiaReviewedName = angular.copy('Dr. '+ SuffixName + ' ' + LicenseNumber);
                            } else {
                                $scope.PreAdmAnesthetistObj.AnesthesiaReviewedName = angular.copy(SuffixName + ' ' + LicenseNumber);
                            }
                        } else {
                            $scope.PreAdmAnesthetistObj.AnesthesiaReviewedName = "";
                        }



                        if ($scope.PreAdmAnesthetistObj.AnesthesiologistReviewedBy != null) {
                            var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedBy }, true)[0] || [];



                            //var SuffixName = '';
                            //ReviewName.SuffixName = ReviewName.SuffixName || '';
                            //if (ReviewName.SuffixName != "") {
                            //    SuffixName = ReviewName.SuffixName;
                            //}

                            var LicenseNumber = "";

                            ReviewName.LicenseNumber = ReviewName.LicenseNumber || "";
                            if (ReviewName.LicenseNumber != "") {
                                LicenseNumber = 'LIC :' + ' ' + ReviewName.LicenseNumber;
                            }
                            $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedName = angular.copy(ReviewName.UserFullName + ' ' + LicenseNumber);

                            //if (ReviewName.SuffixId == 10) {
                            //    $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedName = angular.copy('Dr. ' + ReviewName.FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            //} else {
                            //    $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedName = angular.copy(ReviewName.FullName + ' ' + SuffixName + ' ' + LicenseNumber);
                            //}

                        } else {
                            $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedName = "";
                        }

                        $scope.PreAdmAnesthetistObj.ReviewedDate = respObj.AnesthesiaReviewedDate || "";

                        $scope.PreAdmAnesthetistObj.ReviewedDate = $filter('date')($scope.PreAdmAnesthetistObj.ReviewedDate, 'MM-dd-yyyy hh:mm a') || "";                      

                        //$filter('date')($scope.CardiologyPopupDetails.CardioLogistReviewedDate, 'MM-dd-yyyy hh:mm a') || "";

                        // documents
                        //$scope.PreAdmAnesthetistObj.DocumentDetails = angular.copy(respObj.DocumentDetails);

                        respObj.CardioVascular = respObj.CardioVascular || null;
                        if (respObj.CardioVascular != null) {
                            $scope.PreAdmAnesthetistObj.CardioVascularObj.ECG = respObj.CardioVascular.CardioECG || "";
                            $scope.PreAdmAnesthetistObj.CardioVascularObj.ECGUnits = respObj.CardioVascular.CardioECGUnits || "";
                            $scope.PreAdmAnesthetistObj.CardioVascularObj.Notes = respObj.CardioVascular.CardioNotes || "";
                        }

                    }
                }
            }, function () {

            });
        };


        $scope.UnsignFromSumary = function (val) {

            let screen = "";
            if (val == 1) {
                screen = "Anesthesia PreAdmission";
            }

            if (val == 2) {
                screen = "Cardiology PreAdmission";
            }

            let obj = {
                "Screen": screen,
                "Type": "Unsign",
                "UserType": "Anesthesia",
                "allUserList": angular.copy($scope.allUserList) || [],
            };

            let signmodalInstance = $uibModal.open({
                "templateUrl": "templates/consultation/SignOffPasswordNew.html",
                "controller": "UsSignOffPasswordPopupCtrl",
                "size": "md",
                //"windowClass": "appointment-full-popup",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "obj": function () { return obj; }
                }
            });
            signmodalInstance.result.then(function (resp) {
                if (val==1) {
                    $scope.OpenAnesthesiaPopup();
                }
                if (val == 2) {
                    $scope.CardiologyPopup();
                }
              
            }, function (data) {

            });
        }

        $scope.GetOTQuickAccessDetails = function () {

            let req3 = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId
            };

            eHnoteSurgeryService.GetOTQuickAccessDetails(req3).then(function (resp) {
                if (resp.data.status === "Success") {
                    angular.forEach(resp.data.Vitals, function (item) {
                        let ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                        let edate = ndate + " " + item.VitalAddTime;

                        item.VitalAddTime = $filter('date')(new Date(edate), "hh:mm a");
                    });
                    $scope.PreAdmObj.VitalsArray = angular.copy(resp.data.Vitals);
                    $scope.PreAdmObj.AllergyItems = angular.copy(resp.data.AllergyItems);
                    $scope.PreAdmObj.SystemicHistory = angular.copy(resp.data.SystemicHistory);
                    $scope.PreAdmObj.SurgicalHistory = angular.copy(resp.data.SurgicalHistory);
                    $scope.PreAdmObj.CurrentSystemicMedicationsHistory = angular.copy(resp.data.CurrentSystemicMedicationList);
                    $scope.PreAdmObj.CurrentEyeMedications = angular.copy(resp.data.CurrentEyeMedicationList);
                    $scope.PreAdmObj.DocumentDetails = angular.copy(resp.data.DocumentDetails);
                    $scope.PreAdmObj.ROSOverAllRemarks = resp.data.RosOverallRemarks || "";
                    $scope.PreAdmObj.LabInvestigation = resp.data.LabInvestigation || "";
                    $scope.PreAdmObj.LifestyleDetail = resp.data.LifestyleDetail || [];
                    $scope.PreAdmObj.PreAdmission = resp.data.PreAdmission || '';
                    $scope.PreAdmObj.PatientData = resp.data.PatientData || '';                                  
                }

            });
        };

        $scope.OpenHealthAndPhysicalPopUp1 = function (item) {
            item = item || '';
            var ScreenObj = {
                "IsComingfrm": "",
            }
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/ASC/ASCHealthAndPhysicalPopup.html",
                "controller": "USHealthAndPhysicalPopupCtrl",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "MainObj": function () { return angular.copy(item) },
                    "ScreenObj": function () { return angular.copy(ScreenObj) },
                    "allUserList": function () { return angular.copy($scope.allUserList); },
                },
                "windowClass": "modal__popup--1 bottom-to-top-modal in",

            });
            $scope.mInstanceAdd.result.then(function (resp) {
                $scope.GetOTQuickAccessDetails();
                $scope.$emit("headerrefresh", true);
            }, function () { });
        };
       
        $scope.AnesthesiaPrint = function () {
            let obj = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId
            };

            eHnoteSurgeryService.GetOTQuickAccessDetails(obj).then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.Vitals.length > 0) {
                        $scope.PreAdmObj.Vitals = angular.copy(resp.data.Vitals);
                    }
                    if (resp.data.AllergyItems.length > 0) {
                        $scope.PreAdmObj.AllergyItems = angular.copy(resp.data.AllergyItems);
                    }
                    if (resp.data.SystemicHistory.length > 0) {
                        $scope.PreAdmObj.SystemicHistory = angular.copy(resp.data.SystemicHistory);
                    }
                    if (resp.data.SurgicalHistory.length > 0) {
                        $scope.PreAdmObj.SurgicalHistory = angular.copy(resp.data.SurgicalHistory);
                    }
                    if (resp.data.CurrentSystemicMedicationList.length > 0) {
                        $scope.PreAdmObj.CurrentSystemicMedicationsHistory = angular.copy(resp.data.CurrentSystemicMedicationList);
                    }
                    if (resp.data.CurrentEyeMedicationList.length > 0) {
                        $scope.PreAdmObj.CurrentEyeMedications = angular.copy(resp.data.CurrentEyeMedicationList);
                    }
                    let CreatedByName = "";
                    if (doctorinfo.doctordata.User.length > 0) {
                        if (doctorinfo.doctordata.User[0].Suffix !== '') {
                            CreatedByName = CreatedByName + doctorinfo.doctordata.User[0].FullName + ' ' + doctorinfo.doctordata.User[0].Suffix || "";
                        } else {
                            CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
                        }
                    }
                    var HandPLabData = [];
                    if ($scope.PreAdmObj.LabInvestigation.length > 0) {
                        angular.forEach($scope.PreAdmObj.LabInvestigation, function (item) {
                            if (item.ResultValue !== '' || item.Normal || item.AbNormal || item.Remarks !== '') {
                                if (item.ProcedureId == 506 || item.ProcedureId == 840 || item.ProcedureId == 841 || item.ProcedureId == 842 || item.ProcedureId == 843 || item.ProcedureId == 844 || item.ProcedureId == 845 || item.ProcedureId == 846 || item.ProcedureId == 847 || item.ProcedureId == 848 || item.ProcedureId == 863 || item.ProcedureId == 864 || item.ProcedureId == 865 || item.ProcedureId == 849 || item.ProcedureId == 850 || item.ProcedureId == 851) {
                                    HandPLabData.push(item)
                                };
                            }
                        });
                    } else {
                        HandPLabData = [];
                    }

                    var ChecklistData = [];
                    if ($scope.ClinicalChecklistParentObj.ClinicalChecklist.length > 0) {
                        angular.forEach($scope.ClinicalChecklistParentObj.ClinicalChecklist, function (item) {
                            if (item.CheckListCategoryId == 1 && item.IsChecked == true) {
                                ChecklistData.push(item)
                            };
                        });
                    } else {
                        ChecklistData = [];
                    }

                    var RespiratoryData = [];
                    if ($scope.PreAdmObj.SystemicHistory.length > 0) {
                        angular.forEach($scope.PreAdmObj.SystemicHistory, function (item) {
                            if (item.Value !== '') {
                                if (item.HistoryId == 116 || item.HistoryId == 117 || item.HistoryId == 118 || item.HistoryId == 119 || item.HistoryId == 120 || item.HistoryId == 121 || item.HistoryId == 122) {
                                    RespiratoryData.push(item)
                                };
                            }
                        });
                    } else {
                        RespiratoryData = [];
                    }
                    if ($scope.PreAdmObj.LabInvestigation.length > 0) {
                        angular.forEach($scope.PreAdmObj.LabInvestigation, function (item) {
                            if (item.ResultValue !== '') {
                                if (item.ProcedureId == 867) {
                                    RespiratoryData.push(item)
                                };
                            }
                        });
                    }
                    var LifestyleDetail = [];
                    if ($scope.PreAdmObj.LifestyleDetail.length > 0) {
                        if (resp.data.LifestyleDetail[0].AlcoholType !== '' || resp.data.LifestyleDetail[0].DrugType !== '' || resp.data.LifestyleDetail[0].SmokingType !== '' || resp.data.LifestyleDetail[0].PsychisType !== '') {
                            LifestyleDetail = angular.copy($scope.PreAdmObj.LifestyleDetail); 
                        }
                    } else {
                        LifestyleDetail = [];
                    }
                    var HandPSystemicHistoryArray = [];
                    if ($scope.PreAdmObj.SystemicHistory.length > 0) {
                        angular.forEach($scope.PreAdmObj.SystemicHistory, function (item) {
                            if (item.TypeId != 19) {
                                HandPSystemicHistoryArray.push(item);
                            }
                        });
                    } else {
                        HandPSystemicHistoryArray = [];
                    }
                    var ChemistryArray = [];
                    if ($scope.PreAdmObj.LabInvestigation.length > 0) {
                        angular.forEach($scope.PreAdmObj.LabInvestigation, function (item) {
                            if (item.ResultValue !== '') {
                                if (item.ProcedureId == 852 || item.ProcedureId == 853 || item.ProcedureId == 854 || item.ProcedureId == 855 || item.ProcedureId == 856 || item.ProcedureId == 857 || item.ProcedureId == 858 || item.ProcedureId == 859 || item.ProcedureId == 860 || item.ProcedureId == 861 || item.ProcedureId == 862 || item.ProcedureId == 866) {
                                    ChemistryArray.push(item)
                                };
                            }
                        });
                    } else {
                        ChemistryArray = [];
                    }

                    var AirWayData = $scope.PreAdmObj.Airway || '';
                    var ChemistryNotes = $scope.PreAdmObj.Airway.ChemistryNotes || ''

                    var anesthesiaTypeList = [];
                    $scope.PreAdmAnesthetistObj.AnesthesiaTypelist = $scope.PreAdmAnesthetistObj.AnesthesiaTypelist || [];
                    if ($scope.PreAdmAnesthetistObj.AnesthesiaTypelist.length > 0) {
                        anesthesiaTypeList = $filter('filter')($scope.PreAdmAnesthetistObj.AnesthesiaTypelist, { 'IsSelected': true }, true);
                    } else {
                        anesthesiaTypeList = [];
                    }

                    var PrescriptionDetails = [];
                    $scope.PreAdmObj.MedicineOrdersList = $scope.PreAdmObj.MedicineOrdersList || [];
                    if ($scope.PreAdmObj.MedicineOrdersList.length > 0) {
                        angular.forEach($scope.PreAdmObj.MedicineOrdersList, function (item) {
                            if (item.PrescriptionDetails.length > 0) {
                                PrescriptionDetails.push(item);
                            }
                        });
                    } else {
                        PrescriptionDetails = [];
                    }
                    let DiagnosisName = "";
                    let AnesthesistName = "";
                    let SurgeryName = "";
                    let AdditionalSurgeryName = "";
                    let SurgeonName = "";
                    let OrganName = "";
                    let Description = "";

                    let Surgeonlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.cacheStorageItem.DoctorID }, true);
                    if (Surgeonlist.length > 0) {
                        SurgeonName = Surgeonlist[0].UserFullName;
                        //if (Surgeonlist[0].SuffixId == 10) {
                        //    SurgeonName = ' Dr. ' + SurgeonName;
                        //}
                        //if (Surgeonlist[0].SuffixName !== '') {
                        //    SurgeonName = SurgeonName + ' ' + Surgeonlist[0].SuffixName;
                        //}
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
                                        DiagnosisName += ", "+IcdCode + '-' + sitem.DiagnosisName;
                                });
                                if (DiagnosisName.charAt(0) === ",") {
                                    DiagnosisName = DiagnosisName.slice(1);
                                }
                            }
                            if (item.AnesthetistId != null) {
                                let Anesthesistlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.AnesthetistId }, true);
                                if (Anesthesistlist.length > 0) {
                                    AnesthesistName = Anesthesistlist[0].UserFullName;
                                    //if (Anesthesistlist[0].SuffixId == 10) {
                                    //    AnesthesistName = ' Dr. ' + AnesthesistName;
                                    //}
                                    //if (Anesthesistlist[0].SuffixName !== '') {
                                    //    AnesthesistName = AnesthesistName + ' ' + Anesthesistlist[0].SuffixName;
                                    //}
                                } else {
                                    AnesthesistName = "";
                                }
                            }
                            item.OrganId = item.OrganId || 0;
                            if (item.OrganId !== 0) {
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
                            if (item.AdditionalSurgery.length > 0) {
                                angular.forEach(item.AdditionalSurgery, function (sitem) {
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
                        });

                        SurgeryName = resp.data.SurgeryList[0].SurgeryName || "";
                    }
                   
                    var Object = {
                        "CreatedBy": CreatedByName,
                        'Surgeon': SurgeonName || '',
                        "Anesthetist": AnesthesistName || '',
                        "Diagnosis": DiagnosisName || '',
                        "Name": $scope.cacheStorageItem.PatientName || '',
                        "Age": $scope.cacheStorageItem.Age || '',
                        "PatientDOB": $scope.cacheStorageItem.PatientDOB || '',
                        "Gender": $scope.cacheStorageItem.Gender || '',
                        "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
                        "PatientOldMrno": $scope.cacheStorageItem.PatientOldMrno || '',
                        "VisitType": $scope.cacheStorageItem.AppointmentType || '',
                        "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                        "SurgeryDate": $scope.cacheStorageItem.AppointmentDate || '',
                        "AppointmentTime": $scope.cacheStorageItem.AppointmentTime || '',
                        "SurgeryName": SurgeryName || '',
                        "AdditionalSurgeryName": AdditionalSurgeryName || '',
                        "OrganName": OrganName || '',
                        "VitalsArray": $scope.PreAdmObj.Vitals || [],
                        "AllergyItems": $scope.PreAdmObj.AllergyItems || [],
                        "SystemicHistory": $scope.PreAdmObj.SystemicHistory || [],
                        "SurgicalHistory": $scope.PreAdmObj.SurgicalHistory || [],
                        "CurrentSystemicMedicationsHistory": $scope.PreAdmObj.CurrentSystemicMedicationsHistory || [],
                        "CurrentEyeMedications": $scope.PreAdmObj.CurrentEyeMedications || [],
                        "HandpLabdata": HandPLabData || [],
                        "LabNotes": $scope.PreAdmObj.LabNotes || '',
                        "AirWayData": AirWayData || '',
                        "RespiratoryData": RespiratoryData || [],
                        "SocialData": LifestyleDetail || [],
                        "SystemichistoryData": HandPSystemicHistoryArray || [],
                        "ChemistryData": ChemistryArray || [],
                        "ChemistryNotes": ChemistryNotes || '',
                        "PrevAnesthetics": $scope.PrevAnestheticsObj.PreviousAnesthetics || [],
                        "AssessmentASAObj": $scope.PreAdmAnesthetistObj.ASAObj || '',
                        "AnesthesiaTypelist": anesthesiaTypeList || [],
                        "AnesthesiaDosage": $scope.APAnesthesiaOptionsObj.Dosage || '',
                        "AnesthetistName": $scope.APAnesthesiaOptionsObj.AnesthetistName || '',
                        "AnesthetistReviewedDate": $scope.PreAdmAnesthetistObj.ReviewedDate || '',
                        "AnesthetistNotes": $scope.APAnesthesiaOptionsObj.AnesthetistNotes || '',
                        "MedicationsDetails": PrescriptionDetails || [],
                        "LabInvestigationsList": $scope.PreAdmObj.InvestigationsList || [],
                        "AnesthesiaStatus": $scope.PreAdmAnesthetistObj.PreAdmissionStatus || '',
                        "AnesthesiaReviewedName": $scope.PreAdmAnesthetistObj.AnesthesiaReviewedName || '',
                        "AnesthesiaSuffix": $scope.PreAdmAnesthetistObj.AnesthesiaSuffix || '',
                        "AnesthesiaLicenseNo": $scope.PreAdmAnesthetistObj.AnesthesiaLicenseNo || '',
                        "AnesthesiologistName": $scope.APAnesthesiaOptionsObj.AnesthesiologistName,
                        "AnesthesiologistReviewedName": $scope.PreAdmAnesthetistObj.AnesthesiologistReviewedName,
                        "EhnoteLogoURL": $scope.HeaderLogo || '',
                        "SignOffUserDetails": $scope.PreAdmObj.LastSignOffUserDetails || [],                      
                        "ECGDetails": $scope.PreAdmAnesthetistObj.CardioVascularObj || '',
                        "MedicationInstructions": $scope.PreAdmAnesthetistObj.MedicineOrdersInstructions || '',
                        "ASAClassificationNotes": $scope.PreAdmAnesthetistObj.ASAClassificationNotes || '',
                    }
                    USPrintService.GenerateASCPreAdmissionPrint(Object);
                }
            });
        };

 }]).value('duScrollBottomSpy', true).value('duScrollActiveClass', 'active').value('duScrollOffset', 60);






"use strict";
eHnoteWebApp.controller("USCardiologistPreAdmissionCtrl", ["$scope", "$rootScope", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteSurgeryService", "eHnoteCacheStorageService", "eHnoteAuditServices", "$uibModal", "eHnoteMainAppointmentService", "eHnoteDiagnosisDataServices", "datapersistanceFactory", "eHnotePatientDataService", "$q","eHnoteSettingsDataService",
    function ($scope, $rootScope, $filter, alertify, eHnoteMasterDataService, eHnoteSurgeryService, eHnoteCacheStorageService, eHnoteAuditServices, $uibModal, eHnoteMainAppointmentService, eHnoteDiagnosisDataServices, datapersistanceFactory, eHnotePatientDataService, $q, eHnoteSettingsDataService) {

        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        // on page refresh, for preadmin tab to be displayed
        var appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
       // appointmentInfo.AppointmentTypeId = 7;
        eHnoteMasterDataService.addAppointmentInfo(appointmentInfo);

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
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

        $scope.AddToCache = function () {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        };
       
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
                "AnesthetistName": ""
            };
        };

      
        $scope.PreAdmissionSummaryObj = {
            "IsPrAdmEvaluationCardioInd": false,
            "IsPrAdmEvaluationLabInd":false
        }

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

        $scope.PreAdmObj = {
            "PreAdmissionId": 0,
            "OrganizationId": $scope.HospitalId || 0,
            "UserId": $scope.UserId,
            "PatientId": $scope.cacheStorageItem.PatientID || 0,
            "AppointmentId": $scope.cacheStorageItem.SelectedAppointmentId || 0,
            "ParentAppointmentId": null,
            "Vitals": [],
            "SystemicHistory": [],
            "AllergyItems": [],
            "SurgicalHistory": [],
            "LabArray": [],
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
            "PreAdmissionStatusId": null
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
            "SelectedSurgery": ""
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

        $scope.CardioOtherSystemsArrayList = [
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
                "IsPreAdmAnestheticPlanInd": true
            }
            return obj;
        }

        $scope.PreAdmissionSummaryObj = $scope.GetPreAdmSummaryObj();
        $scope.PreAdmissionSummaryObj1 = $scope.GetPreAdmSummaryObj();

        $scope.GetPreAdmCardioObj = function () {
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
                "HealthArray": "",
                //"PrevAnesthesia": "",
                //"AssessmentsASA": "",
                //"AnesthesiaPlan": "",
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
                    "Notes": "",
                    "ECGUnits": "",
                    "BPlevel": ""
                },
                "AirwayObj": {
                    "IsNormal": false,
                    "ROMTMS": "",
                    "ROMNECKAP": "",
                    "ROMNECKLAT": "",
                    "Class": "",
                    "Notes": "",
                    "Dentition": ""
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
                "CXRHistory": "",
                "PrescriptionDetails": [],
                "CardiologistDiagnosis": [],
                "IsChestPain": null,
                "AppointmentID": $scope.cacheStorageItem.AppointmentId,
                "IsAdvanceCardInd":false
            };
        };

        $scope.PreAdmCardioObj = angular.copy($scope.GetPreAdmCardioObj());

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
            },
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
        // select default surgery -> first in the list
        $scope.PreAdmSurgeryList = $scope.cacheStorageItem.PreAdmSurgeryList || [];
        if ($scope.PreAdmSurgeryList.length > 0) {
            $scope.SurgeryDiagnosisObj.SelectedSurgery = $scope.PreAdmSurgeryList[0];
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
        $scope.init = function () {

            let appointmentId;
            if ($scope.cacheStorageItem.AppointmentTypeId === 4 || $scope.cacheStorageItem.AppointmentTypeId === 14) {
                appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
            }
            if ($scope.cacheStorageItem.AppointmentTypeId === 7||$scope.cacheStorageItem.AppointmentTypeId ===6) {
                appointmentId = $scope.cacheStorageItem.AppointmentId;
            }
            let ReqObj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": appointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
            };

            let trackerReq = {
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
            };

            eHnoteMainAppointmentService.GetASCLatestTrackerStatusById(trackerReq).then(function (resp) {
                if (resp.data.Status === "Success") {
                    if (resp.data.rows.length > 0) {
                        if (resp.data.rows[0].RoomTypeId != 22) {
                            $scope.CurrentTime = $filter("date")(new Date(), "HH:mm:ss");
                            let params = {
                                "UserId": eHnoteMasterDataService.getLoginId(),
                                "HospitalId": $scope.HospitalId,
                                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                                "ASCAppointmentTrackerDetailId": 0,
                                "RoleId": $scope.RoleId,
                                "DoctorId": null,
                                "DoctorRoleId": null,
                                "RoomTypeId": 22,
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
                                    $scope.cacheStorageItem.RoomTypeId = 22;
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

            $q.all([
                eHnoteSurgeryService.GetPreAdmissionCardiologistDetails(ReqObj),
                eHnoteSurgeryService.GetASCAppointmentSurgeryStaff(obj)
            ]).then(function (resp) {

                if (resp[0].data.status === "Success") {
                    $scope.SurgeryList = [];
                    $scope.PreAdmCardioObj = angular.copy($scope.GetPreAdmCardioObj());
                    $scope.PreAdmCardioObj.HealthArray = angular.copy($scope.HealthArray);
  
                    if (resp[0].data.CardiologistDetails.length > 0) {
                        $scope.CardiologistPreAdmissionDetails = angular.copy(resp[0].data.CardiologistDetails);
                        $scope.PreAdmissionDetails = angular.copy(resp[0].data.CardiologistDetails[0]);

                        $scope.PreAdmCardioObj.StatusFlag = $scope.PreAdmissionDetails.StatusFlag;
                        $scope.PreAdmCardioObj.PreAdmissionChartStatus = $scope.PreAdmissionDetails.PreAdmissionChartStatus;

                        if ($scope.PreAdmissionDetails !== undefined) {

                            $scope.PreAdmCardioObj.PreAdmissionId = $scope.PreAdmissionDetails.PreAdmissionId;
                            $scope.PreAdmCardioObj.PreAdmissionApptId = $scope.PreAdmissionDetails.AppointmentId;
                            $scope.PreAdmCardioObj.PreAdmissionApptDate = $filter('date')($scope.PreAdmissionDetails.AppointmentDate, "MM-dd-yyyy");
                            $scope.PreAdmCardioObj.IsCXR = $scope.PreAdmissionDetails.IsCXR || "";
                            $scope.PreAdmCardioObj.CXRHistory = $scope.PreAdmissionDetails.CXRHistory || "";


                            var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmissionDetails.ReviwedBy }, true)[0] || [];
                            $scope.PreAdmCardioObj.ReviewByName = ReviewName.FullName || '';
                            $scope.PreAdmCardioObj.ReviewedDate = $scope.PreAdmissionDetails.ReviewedDate || "";
                            $scope.PreAdmCardioObj.ReviewedTime = $scope.PreAdmissionDetails.Reviewedtime || "";


                            $scope.PreAdmCardioObj.PresentIllness = angular.copy($scope.PreAdmissionDetails.Presentillness) || "";
                          
                            $scope.PreAdmCardioObj.IsChestPain = $scope.PreAdmissionDetails.IsChestPain;
                            $scope.PreAdmCardioObj.Chemistry = angular.copy($scope.PreAdmissionDetails.Chemistry)||"";
                            $scope.PreAdmCardioObj.Treatment = angular.copy($scope.PreAdmissionDetails.Treatment);

                            $scope.PreAdmCardioObj.ROSOverAllRemarks = angular.copy($scope.PreAdmissionDetails.ROSOverAllRemarks);
                            //Notes Ind
                            if ($scope.PreAdmCardioObj.PresentIllness != '') {
                                $scope.PreAdmCardioObj.PresentIllnessInd = true;
                            } else {
                                $scope.PreAdmCardioObj.PresentIllnessInd = false;
                            }
                            if ($scope.PreAdmCardioObj.Chemistry != '') {
                                $scope.PreAdmCardioObj.ChemistryInd = true;
                            } else {
                                $scope.PreAdmCardioObj.ChemistryInd = false;
                            }
                            if ($scope.PreAdmCardioObj.Treatment != '') {
                                $scope.PreAdmCardioObj.TreatmentInd = true;
                            } else {
                                $scope.PreAdmCardioObj.TreatmentInd = false;
                            }


                            if ($scope.PreAdmCardioObj.ROSOverAllRemarks != "" || $scope.PreAdmCardioObj.ROSOverAllRemarks != null) {
                                $scope.PreAdmissionSummaryObj1.IsROSOverAllRemarksInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj1.IsROSOverAllRemarksInd = false;
                            }

                            if ($scope.PreAdmissionDetails.VitalsArray.length > 0) {
                                angular.forEach($scope.PreAdmissionDetails.VitalsArray, function (vitem) {
                                    var vitallist = [];
                                    var vitallist = $filter("filter")($scope.PerformedByArray, function (kitem) { return kitem.DoctorID == vitem.DoctorId });
                                    if (vitallist.length > 0) {
                                        vitem.UserName = angular.copy(vitallist[0].FullName);
                                    }
                                    //let ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                                    //let edate = ndate + " " + vitem.VitalAddTime;

                                    //vitem.VitalAddTime = $filter('date')(new Date(edate), "hh:mm a");
                                    let currentDate = moment().format("YYYY-MM-DD");
                                    let combinedDateTime = currentDate + " " + vitem.VitalAddTime;
                                    let parsedDateTime = moment(combinedDateTime, "YYYY-MM-DD hh:mm a");
                                    vitem.VitalAddTime = parsedDateTime.format("hh:mm a");
                                });
                                $scope.PreAdmCardioObj.Vitals = angular.copy($scope.PreAdmissionDetails.VitalsArray);
                            } else {
                                $scope.PreAdmCardioObj.Vitals = [];
                                //$scope.VitalsObj = angular.copy($scope.GetVitalsObj());
                                //$scope.Vitals.push($scope.VitalsObj);
                            }


                            $scope.PreAdmCardioObj.LabObj = $scope.GetLabObj();
                            $scope.PreAdmCardioObj.LabObj.HGB = $scope.PreAdmissionDetails.LabTest.HGB;
                            $scope.PreAdmCardioObj.LabObj.HCT = $scope.PreAdmissionDetails.LabTest.HCT;
                            $scope.PreAdmCardioObj.LabObj.WBC = $scope.PreAdmissionDetails.LabTest.WBC;
                            $scope.PreAdmCardioObj.LabObj.RBC = $scope.PreAdmissionDetails.LabTest.RBC;
                            $scope.PreAdmCardioObj.LabObj.A1C = $scope.PreAdmissionDetails.LabTest.A1C;
                            $scope.PreAdmCardioObj.LabObj.Creatinine = $scope.PreAdmissionDetails.LabTest.Creatinine;
                            $scope.PreAdmCardioObj.LabObj.UrineAnalysis = $scope.PreAdmissionDetails.LabTest.UrineAnalysis;
                            $scope.PreAdmCardioObj.LabObj.IsBloodAvailable = $scope.PreAdmissionDetails.LabTest.IsBloodAvailable;
                            $scope.PreAdmCardioObj.LabObj.IsPretransfusion = $scope.PreAdmissionDetails.LabTest.IsPretransfusion;
                            $scope.PreAdmCardioObj.LabObj.RBS = $scope.PreAdmissionDetails.LabTest.RBS;
                            $scope.PreAdmCardioObj.LabObj.FBS = $scope.PreAdmissionDetails.LabTest.FBS;
                            $scope.PreAdmCardioObj.LabObj.PBBS = $scope.PreAdmissionDetails.LabTest.PBBS;
                            $scope.PreAdmCardioObj.LabObj.PBLS = $scope.PreAdmissionDetails.LabTest.PBLS;
                            $scope.PreAdmCardioObj.LabObj.Others = $scope.PreAdmissionDetails.LabTest.Others;
                            $scope.PreAdmCardioObj.LabObj.Notes = $scope.PreAdmissionDetails.LabTest.Notes || "";
                            if ($scope.PreAdmissionDetails.LabTest.TestArray.length > 0) {
                                $scope.PreAdmCardioObj.LabObj.LabTestArray = $scope.PreAdmissionDetails.LabTest.TestArray;
                            } else {
                                $scope.PreAdmCardioObj.LabObj.LabTestArray = [];
                            }
                            if ($scope.PreAdmCardioObj.LabObj.LabTestArray.length > 0) {
                                angular.forEach($scope.PreAdmCardioObj.LabObj.LabTestArray, function (item) {
                                    if (item.Notes != '') {
                                        item.PreCardnotesInd = true;
                                    } else {
                                        item.PreCardnotesInd = false;
                                    }
                                })
                            }
                            if ($scope.PreAdmCardioObj.LabObj.Notes != '') {
                                $scope.PreAdmCardioObj.CardiologyLabNotesInd = true;
                            }
                            else {
                                $scope.PreAdmCardioObj.CardiologyLabNotesInd = false;
                            }
                            if ($scope.PreAdmCardioObj.LabObj.RBS != "" || $scope.PreAdmCardioObj.LabObj.FBS != "" || $scope.PreAdmCardioObj.LabObj.PBBS != "" || $scope.PreAdmCardioObj.LabObj.PBLS != "" || $scope.PreAdmCardioObj.LabObj.PBLS != "" || $scope.PreAdmCardioObj.LabObj.Others != "") {
                                $scope.IsCardioDiabetesEnable = "true";
                            }
                            else {
                                $scope.IsCardioDiabetesEnable = "false";
                            }

                            $scope.PreAdmissionDetails.CardioVascular = $scope.PreAdmissionDetails.CardioVascular || "";
                            if ($scope.PreAdmissionDetails.CardioVascular != "") {
                                $scope.PreAdmCardioObj.CardioVascularObj.Systolic = $scope.PreAdmissionDetails.CardioVascular.Systolic;
                                $scope.PreAdmCardioObj.CardioVascularObj.Diastolic = $scope.PreAdmissionDetails.CardioVascular.Diastolic;
                                $scope.PreAdmCardioObj.CardioVascularObj.PR = $scope.PreAdmissionDetails.CardioVascular.PR;
                                $scope.PreAdmCardioObj.CardioVascularObj.ECG = $scope.PreAdmissionDetails.CardioVascular.ECG;
                                $scope.PreAdmCardioObj.CardioVascularObj.ECGUnits = $scope.PreAdmissionDetails.CardioVascular.ECGUnits;
                                $scope.PreAdmCardioObj.CardioVascularObj.Notes = $scope.PreAdmissionDetails.CardioVascular.Notes || "";
                                $scope.PreAdmCardioObj.CardioVascularObj.BPlevel = $scope.PreAdmissionDetails.CardioVascular.BPlevel || "";
                                if ($scope.PreAdmCardioObj.CardioVascularObj.Notes != '') {
                                    $scope.PreAdmCardioObj.CardioVascularObjNotesInd = true;
                                } else {
                                    $scope.PreAdmCardioObj.CardioVascularObjNotesInd = false;
                                }
                            }

                            $scope.PreAdmissionDetails.Airway = $scope.PreAdmissionDetails.Airway || '';
                            if ($scope.PreAdmissionDetails.Airway != '') {
                                $scope.PreAdmCardioObj.AirwayObj.ROMTMS = $scope.PreAdmissionDetails.Airway.ROMTMS;
                                $scope.PreAdmCardioObj.AirwayObj.ROMNECKLAT = $scope.PreAdmissionDetails.Airway.ROMNECKLAT;
                                $scope.PreAdmCardioObj.AirwayObj.ROMNECKAP = $scope.PreAdmissionDetails.Airway.ROMNECKAP;
                                $scope.PreAdmCardioObj.AirwayObj.Notes = $scope.PreAdmissionDetails.Airway.Notes || "";
                                $scope.PreAdmCardioObj.AirwayObj.IsNormal = $scope.PreAdmissionDetails.Airway.IsNormal;
                                $scope.PreAdmCardioObj.AirwayObj.Class = $scope.PreAdmissionDetails.Airway.Class;
                                $scope.PreAdmCardioObj.AirwayObj.Dentition = $scope.PreAdmissionDetails.Airway.Dentition;
                            }

                            $scope.PreAdmCardioObj.HealthArray = angular.copy($scope.HealthArray);
                            angular.forEach($scope.PreAdmCardioObj.HealthArray, function (item) {
                                let temparray = $filter('filter')($scope.PreAdmissionDetails.HealthArray, { "Id": item.Id }, true);
                                if (temparray.length > 0) {
                                    item.IsChecked = temparray[0].IsChecked;
                                }
                                else {
                                    item.IsChecked = null;
                                }
                            });

                            $scope.PreAdmCardioObj.RespiratoryHealthArray = [];
                            $scope.PreAdmCardioObj.SocialHealthArray = [];
                            $scope.CardiologistFilesObj.TempImagesArray = [];

                            $scope.PreAdmCardioObj.RespiratoryHealthArray = $filter("filter")($scope.PreAdmCardioObj.HealthArray, { "CategoryId": 13 });
                            $scope.PreAdmCardioObj.SocialHealthArray = $filter("filter")($scope.PreAdmCardioObj.HealthArray, { "CategoryId": 15 });

                            if ($scope.PreAdmCardioObj.RespiratoryHealthArray.length > 0) {
                                $scope.PreAdmissionSummaryObj1.IsRespiratoryInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj1.IsRespiratoryInd = false;
                            }

                            if ($scope.PreAdmCardioObj.SocialHealthArray.length > 0) {
                                $scope.PreAdmissionSummaryObj1.IsSocialInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj1.IsSocialInd = false;
                            }

                            $scope.PreAdmCardioObj.IsCardiacWNL = $scope.PreAdmissionDetails.IsCardiacWNL;
                            $scope.PreAdmCardioObj.IsCNSHistory = $scope.PreAdmissionDetails.IsCNSHistory;
                            $scope.PreAdmCardioObj.IsAutoImmuneDisordersWNL = $scope.PreAdmissionDetails.IsAutoImmuneDisordersWNL;
                            $scope.PreAdmCardioObj.IsEndocrineWNL = $scope.PreAdmissionDetails.IsEndocrineWNL;
                            $scope.PreAdmCardioObj.IsHemeOncWNL = $scope.PreAdmissionDetails.IsHemeOncWNL;
                            $scope.PreAdmCardioObj.IsHepaticWNL = $scope.PreAdmissionDetails.IsHepaticWNL;
                            $scope.PreAdmCardioObj.IsKidneyDiseaseWNL = $scope.PreAdmissionDetails.IsKidneyDiseaseWNL;
                            $scope.PreAdmCardioObj.IsMusculoSkeletalSystemWNL = $scope.PreAdmissionDetails.IsMusculoSkeletalSystemWNL;
                            $scope.PreAdmCardioObj.IsNervousSystemWNL = $scope.PreAdmissionDetails.IsNervousSystemWNL;
                            $scope.PreAdmCardioObj.IsNeurologicWNL = $scope.PreAdmissionDetails.IsNeurologicWNL;
                            $scope.PreAdmCardioObj.IsOthersWNL = $scope.PreAdmissionDetails.IsOthersWNL;
                            $scope.PreAdmCardioObj.IsPsychosisWNL = $scope.PreAdmissionDetails.IsPsychosisWNL;
                            $scope.PreAdmCardioObj.IsPulmonaryWNL = $scope.PreAdmissionDetails.IsPulmonaryWNL;
                            $scope.PreAdmCardioObj.IsRespiratoryNormal = $scope.PreAdmissionDetails.IsRespiratoryNormal;

                            $scope.PreAdmCardioObj.SocialNotes = $scope.PreAdmissionDetails.SocialNotes || "";
                            $scope.PreAdmCardioObj.RespiratoryNotes = $scope.PreAdmissionDetails.RespiratoryNotes || "";
                            $scope.PreAdmCardioObj.PulmonaryNotes = $scope.PreAdmissionDetails.PulmonaryNotes || "";
                            $scope.PreAdmCardioObj.PsychosisNotes = $scope.PreAdmissionDetails.PsychosisNotes || "";
                            $scope.PreAdmCardioObj.OthersNotes = $scope.PreAdmissionDetails.OthersNotes || "";
                            $scope.PreAdmCardioObj.NeurologicNotes = $scope.PreAdmissionDetails.NeurologicNotes || "";
                            $scope.PreAdmCardioObj.NervousSystemNotes = $scope.PreAdmissionDetails.NervousSystemNotes || "";
                            $scope.PreAdmCardioObj.MusculoSkeletalSystemNotes = $scope.PreAdmissionDetails.MusculoSkeletalSystemNotes || "";
                            $scope.PreAdmCardioObj.KidneyDiseaseNotes = $scope.PreAdmissionDetails.KidneyDiseaseNotes || "";
                            $scope.PreAdmCardioObj.HepaticNotes = $scope.PreAdmissionDetails.HepaticNotes || "";
                            $scope.PreAdmCardioObj.HemeOncNotes = $scope.PreAdmissionDetails.HemeOncNotes || "";
                            $scope.PreAdmCardioObj.EndocrineNotes = $scope.PreAdmissionDetails.EndocrineNotes || "";
                            $scope.PreAdmCardioObj.CardiacNotes = $scope.PreAdmissionDetails.CardiacNotes || "";
                            $scope.PreAdmCardioObj.CNSNotes = $scope.PreAdmissionDetails.CNSNotes || "";
                            $scope.PreAdmCardioObj.AutoImmuneDisordersNotes = $scope.PreAdmissionDetails.AutoImmuneDisordersNotes || "";

                            $scope.PreAdmCardioObj.IsHeentWNL = $scope.PreAdmissionDetails.IsHeentWNL;
                            $scope.PreAdmCardioObj.IsLungsWNL = $scope.PreAdmissionDetails.IsLungsWNL;
                            $scope.PreAdmCardioObj.HeentNotes = $scope.PreAdmissionDetails.HeentNotes || "";
                            $scope.PreAdmCardioObj.LungsNotes = $scope.PreAdmissionDetails.LungsNotes || "";

                            $scope.PreAdmCardioObj.CurrentMedicationList = angular.copy($scope.PreAdmissionDetails.CurrentMedicationList);
                            $scope.PreAdmCardioObj.MedicationsList = angular.copy($scope.PreAdmissionDetails.MedicationsList);
                            $scope.PreAdmCardioObj.InvestigationsList = angular.copy($scope.PreAdmissionDetails.InvestigationsList);

                            $scope.PreAdmCardioObj.ReviewedBy = $scope.PreAdmissionDetails.ReviwedBy;
                            $scope.CardiologistPreAdmissionDetails.ReviewByName = "";
                            var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmCardioObj.ReviewedBy }, true)[0] || [];
                            $scope.CardiologistPreAdmissionDetails.ReviewByName = ReviewName.FullName || '';

                            if ($scope.PreAdmCardioObj.RespiratoryNotes != '') {
                                $scope.PreAdmCardioObj.RespiratoryNotesInd = true;
                            } else {
                                $scope.PreAdmCardioObj.RespiratoryNotesInd = false;
                            }
                            if ($scope.PreAdmissionDetails.HealthArray.length > 0) {
                                $scope.GetHealthAdvancedData1($scope.PreAdmissionDetails.HealthArray);

                                $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistMainInd = true;
                                $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistHealthPlanInd = true;
                            }
                            else if (!$scope.PreAdmissionDetails.IsCardiacWNL && !$scope.PreAdmissionDetails.IsCNSHistory && !$scope.PreAdmissionDetails.IsAutoImmuneDisordersWNL && !$scope.PreAdmissionDetails.IsEndocrineWNL && !$scope.PreAdmissionDetails.IsHemeOncWNL && !$scope.PreAdmissionDetails.IsHepaticWNL && !$scope.PreAdmissionDetails.IsPulmonaryWNL
                                && !$scope.PreAdmissionDetails.IsKidneyDiseaseWNL && !$scope.PreAdmissionDetails.IsMusculoSkeletalSystemWNL && !$scope.PreAdmissionDetails.IsNervousSystemWNL && !$scope.PreAdmissionDetails.IsNeurologicWNL && !$scope.PreAdmissionDetails.IsOthersWNL && !$scope.PreAdmissionDetails.IsPsychosisWNL && !$scope.PreAdmissionDetails.IsRespiratoryNormal && !$scope.PreAdmissionDetails.IsHeentWNL && !$scope.PreAdmissionDetails.IsLungsWNL) {

                                $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistMainInd = false;
                                $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistHealthPlanInd = false;
                            }



                            if ($scope.PreAdmCardioObj.IsCNSHistory == true) {
                                $scope.PreAdmissionSummaryObj1.IsCNSHistoryInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj1.IsCNSHistoryInd = false;
                            }


                            if ($scope.PreAdmCardioObj.APAnesthesiaOptionsObj.AnesthetistId != '') {
                                let Anesthetistlist = $filter("filter")($scope.AnesthetistArray, function (kitem) { return kitem.DoctorID == $scope.PreAdmCardioObj.APAnesthesiaOptionsObj.AnesthetistId });

                                Anesthetistlist = Anesthetistlist || [];
                                if (Anesthetistlist.length > 0) {
                                    $scope.PreAdmCardioObj.APAnesthesiaOptionsObj.AnesthetistName = Anesthetistlist[0].FullName;
                                }
                            }

                            if ($scope.PreAdmissionDetails.PreAdmissionId !== 0 && !$scope.PreAdmObj.IsEdit) {
                                //$scope.PreAdmObj.IsShow = false;
                                //$scope.PreAdmObj.IsShowPreAdmissionSummaryView = true;
                                $scope.PreAdmObj.IsShow = true;
                                $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;
                            }
                            else if ($scope.PreAdmissionDetails.PreAdmissionId == 0) {
                                $scope.PreAdmObj.IsShow = true;
                                $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;
                            }
                            else if ($scope.PreAdmissionDetails.PreAdmissionId != 0 && $scope.PreAdmObj.IsEdit) {
                                $scope.PreAdmObj.IsShow = true;
                                $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;
                            }
                        }

                        $scope.PreAdmCardioObj.PreAdmissionStatusId = $scope.PreAdmissionDetails.PreAdmissionStatusId;
                        $scope.PreAdmCardioObj.PreAdmissionStatus = $scope.PreAdmissionDetails.PreAdmissionStatus;
                        $scope.PreAdmCardioObj.PrescriptionDetails = angular.copy($scope.PreAdmissionDetails.Prescription);

                        $scope.FilesObj.TempImagesArray = [];


                        if ($scope.PreAdmissionDetails.VitalsArray.length > 0) {
                            $scope.PreAdmissionSummaryObj1.IsPreadmVitalsInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreadmVitalsInd = false;
                        }
                        
                        if ($scope.PreAdmissionDetails.InvestigationsList.length > 0) {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmLabsInvestigationsInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmLabsInvestigationsInd = false;
                        }

                        if ($scope.PreAdmissionSummaryObj1.IsPreAdmLabsInvestigationsInd || $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryMedicationsInd || $scope.PreAdmissionSummaryObj1.IsPreAdmCurrentMedicationsInd) {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryOrdersMainInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryOrdersMainInd = false;
                        }


                        if ($scope.PreAdmCardioObj.LabObj.HGB == "" && $scope.PreAdmCardioObj.LabObj.HCT == "" && $scope.PreAdmCardioObj.LabObj.WBC == "" && $scope.PreAdmCardioObj.LabObj.RBC == "" && $scope.PreAdmCardioObj.LabObj.A1C == "" && $scope.PreAdmCardioObj.LabObj.Creatinine == "" &&
                            $scope.PreAdmCardioObj.LabObj.RBS == "" && $scope.PreAdmCardioObj.LabObj.FBS == "" && $scope.PreAdmCardioObj.LabObj.PBBS == "" && $scope.PreAdmCardioObj.LabObj.PBLS == "" && $scope.PreAdmCardioObj.LabObj.Notes == "") {
                            $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = true;
                        }

                        if ($scope.PreAdmCardioObj.CardioVascularObj.Systolic == "" && $scope.PreAdmCardioObj.CardioVascularObj.Diastolic == "" && $scope.PreAdmCardioObj.CardioVascularObj.PR == "" && $scope.PreAdmCardioObj.CardioVascularObj.ECG == "" && $scope.PreAdmCardioObj.CardioVascularObj.ECGUnits == "" &&
                            $scope.PreAdmCardioObj.CardioVascularObj.Notes == "") {
                            $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = true;
                        }

                        if ($scope.PreAdmCardioObj.AirwayObj.ROMTMS == "" && $scope.PreAdmCardioObj.AirwayObj.ROMNECKLAT == "" && $scope.PreAdmCardioObj.AirwayObj.ROMNECKAP == "" && !$scope.PreAdmCardioObj.AirwayObj.IsNormal &&
                            $scope.PreAdmCardioObj.AirwayObj.Notes == "" && $scope.PreAdmCardioObj.AirwayObj.Class == "") {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationAirwayInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationAirwayInd = true;
                        }

                        if ($scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationAirwayInd || $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationCardioInd || $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationLabInd) {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmEvaluationMainInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmEvaluationMainInd = false;
                        }

                        if ($scope.PreAdmissionSummaryObj1.IsPrAdmROSAllergiesInd || $scope.PreAdmissionSummaryObj1.IsPrAdmROSSurgicalInd || $scope.PreAdmissionSummaryObj1.IsPrAdmROSSystemicInd) {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmROSMainInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmROSMainInd = false;
                        }

                        //if ($scope.PreAdmissionDetails.CurrentMedicationList.length > 0) {
                        //    $scope.IsContinuationMedication = false;
                        //    $scope.IsStopMedication = false;
                        //    angular.forEach($scope.PreAdmissionDetails.CurrentMedicationList, function (item) {
                        //        if (item.DeleteInd == "N") {
                        //            if (item.MedicationType == 'Continuation') {
                        //                $scope.IsContinuationMedication = true;
                        //            }
                        //            if (item.MedicationType == 'Stop') {
                        //                $scope.IsStopMedication = true;
                        //            }
                        //        }
                        //    });
                        //}

                        //let SelectedSurgeryList = $filter('filter')(resp[0].data.SurgeryArray, { 'PatientSurgeryId': $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId }, true);

                        let SelectedSurgeryList = angular.copy(resp[0].data.SurgeryArray);

                        SelectedSurgeryList = SelectedSurgeryList || [];

                        $scope.SelectedSurgeryArray = [];

                        if (SelectedSurgeryList.length > 0) {
                            angular.forEach(SelectedSurgeryList, function (item) {
                                let obj = {
                                    "SurgeryName": item.SurgeryName,
                                    "SurgerySuggestedDate": $filter('date')(item.SurgerySuggestedDate, "MM-dd-yyyy"),
                                    "PreAdmissionStatusId": $scope.PreAdmissionDetails.PreAdmissionStatusId,
                                    "AnesthetistName": $scope.PreAdmCardioObj.APAnesthesiaOptionsObj.AnesthetistName,
                                };
                                $scope.SelectedSurgeryArray.push(obj);
                            });
                        }

                        if ($scope.PreAdmissionDetails.DocumentDetails.length > 0) {
                            $scope.PreAdmCardioObj.DocumentDetails = angular.copy($scope.PreAdmissionDetails.DocumentDetails);
                        }
                        else {
                            $scope.PreAdmCardioObj.DocumentDetails = [];
                        }

                        resp[0].data.CardiologistDetails[0].CardiologistDiagnosis = resp[0].data.CardiologistDetails[0].CardiologistDiagnosis || [];
                        if (resp[0].data.CardiologistDetails[0].CardiologistDiagnosis.length > 0) {
                            $scope.PreAdmCardioObj.CardiologistDiagnosis = angular.copy(resp[0].data.CardiologistDetails[0].CardiologistDiagnosis);
                        }

                        if ($scope.PreAdmissionDetails.IsCardiovascularHistory != null) {
                            $scope.PreAdmCardioObj.IsCardiovascularHistory = $scope.PreAdmissionDetails.IsCardiovascularHistory;
                        }

                        $scope.PreAdmissionDetails.OtherSystemArray = $scope.PreAdmissionDetails.OtherSystemArray || [];
                        if ($scope.PreAdmissionDetails.OtherSystemArray.length > 0) {
                            $scope.CardioOtherSystemsArrayList = angular.copy($scope.PreAdmissionDetails.OtherSystemArray);
                        } else {
                            $scope.CardioOtherSystemsArrayList = [];
                        }
                        if ($scope.CardioOtherSystemsArrayList.length > 0) {
                            angular.forEach($scope.CardioOtherSystemsArrayList, function (item) {
                                if (item.Remarks != '') {
                                    item.OthernotesInd = true;
                                } else {
                                    item.OthernotesInd = false;
                                }
                            });
                        }

                    } else {
                        $scope.CardiologistPreAdmissionDetails = [];
                        $scope.PreAdmCardioObj = angular.copy($scope.GetPreAdmCardioObj());
                        $scope.PreAdmCardioObj.LabObj = angular.copy($scope.GetLabObj());
                        $scope.PreAdmCardioObj.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());
                        angular.forEach($scope.HealthArray, function (item) {
                            item.IsChecked = null;
                        });
                        $scope.PreAdmCardioObj.HealthArray = $scope.HealthArray || [];

                        $scope.PreAdmissionSummaryObj1.IsPreadmVitalsInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmROSMainInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmROSSystemicInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmROSSurgicalInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmROSAllergiesInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmEvaluationMainInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationLabInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationCardioInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationAirwayInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistMainInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistHealthPlanInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryOrdersMainInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryMedicationsInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmCurrentMedicationsInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmLabsInvestigationsInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmAnesthetistPlanMainInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmPreviousAnestheticInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmAssessmentASAInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmAnestheticPlanInd = false;

                        $scope.PreAdmObj.IsShow = true;
                        $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;

                    }
                }

                if (resp[1].data.Status === "Success") {
                    if (resp[1].data.rows.length > 0) {
                        let respObj = angular.copy(resp[1].data.rows[0]);

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

                }

                $scope.AllAnesthetistList = [];
                $scope.AllCardiologistList = [];
                if ($scope.allUserList.length > 0) {
                    angular.forEach($scope.allUserList, function (item) {
                        if (item.RoleId == 30 || item.RoleId == 8 || item.DoctorID == $scope.UserId || item.RoleId == 1 || item.RoleId == 43) {
                            $scope.AllAnesthetistList.push(item);
                        }
                       /* item.DoctorID == $scope.UserId*/
                        if (item.RoleId == 72 || item.RoleId == 8 || item.RoleId == 1 || item.RoleId == 43 || item.RoleId == 16) {
                            $scope.AllCardiologistList.push(item);
                        }
                    })
                };
                //if ($scope.PreAdmObj.IsEdit == true) {
                //    $scope.PreAdmCardioObj.ReviewedBy = $scope.PreAdmCardioObj.ReviewedBy || 0;
                //}
                //else {
                //    $scope.PreAdmCardioObj.ReviewedBy = $scope.UserId || 0;
                //}
                $scope.PreAdmCardioObj.ReviewedBy = $scope.PreAdmCardioObj.ReviewedBy || 0;
                if ($scope.PreAdmCardioObj.ReviewedBy == 0) {
                    $scope.PreAdmCardioObj.ReviewedBy = $scope.UserId || 0;
                }

                if ($scope.MainObj.IsPreAdmSummaryNav) {
                    $scope.PreAdmObj.IsShow = true;
                    $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;
                } else {
                    if (($scope.PreAdmCardioObj.PreAdmissionId !== 0) && !$scope.PreAdmObj.IsEdit) {
                        $scope.PreAdmObj.IsShow = false;
                        $scope.PreAdmObj.IsShowPreAdmissionSummaryView = true;
                    }
                    else if ($scope.PreAdmCardioObj.PreAdmissionId == 0) {
                        $scope.PreAdmObj.IsShow = true;
                        $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;
                    }
                    else if (($scope.PreAdmCardioObj.PreAdmissionId !== 0) && $scope.PreAdmObj.IsEdit) {
                        $scope.PreAdmObj.IsShow = true;
                        $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;
                    }
                }


                $scope.MainObj.IsPreAdmSummaryNav = false;



            });

            $scope.PerformedByArray = [];
            $scope.AllNurseList = [];
            $scope.allUserList = $scope.allUserList || [];
            if ($scope.allUserList.length > 0) {
                $scope.PerformedByArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 8 || x.RoleId == 30 || x.RoleId == 72 || x.RoleId == 43);
                $scope.AnesthetistArray = $scope.allUserList.filter((x) => x.RoleId == 30 );
            }

            $scope.AllNurseList = angular.copy($scope.allUserList);
            $scope.AllNurseList = _.uniq($scope.AllNurseList, false, function (p) { return p.DoctorID; });
            $scope.AllNurseList = $filter("filter")($scope.AllNurseList, function (item) {
                return item.RoleId === 8;
            });

            $scope.currentDate = $filter('date')(new Date(), "yyyy-MM-dd");
        };

        $scope.init();

        $scope.SelectPreAdmCardioHistory = function (val) {
            if (val === 1) {
                $scope.PreAdmCardioObj.IsCardiovascularHistory = false;
            }
            if (val === 2) {
                $scope.PreAdmCardioObj.IsCardiovascularHistory = true;
            }
        };

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

        $scope.ShowAnesthetistEvaluationTab = function () {
            $scope.NavObj = $scope.GetNavObj();
            $scope.NavObj.IsAnesthetistEvaluationTab = true;
            $scope.NavObj.IsAnesthetistPlanTab = true;
            $scope.GetPatientPreAdmissionDetails();
            if ($scope.LoginUserRoleID != 30) {
                $scope.SavePreAdmissionCardioDetails();
            }
        };
        $scope.ShowCardioEvaluationTab = function () {
            $scope.NavObj = $scope.GetNavObj();
            $scope.NavObj.IsCardioEvaluationTab = true;

            $scope.IsContinuationMedication = false;
            $scope.IsStopMedication = false;

            $scope.GetPreAdmissionCardiologistDetails();
            if ($scope.LoginUserRoleID != 72) {
                $scope.SavePreAdmissionDetails();
            }
            //$scope.ShowAdvanceHealthEdit = false;
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
            $rootScope.appointment_type = "1";
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
            if ($scope.Tab === 'teleappointments') {
                $rootScope.Consulatation_type = true;
            }
            if ($scope.Tab === 'appointments') {
                $rootScope.Consulatation_type = false;
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
                "ASCDatesArray": $scope.ASCDatesArray
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
                    $scope.GetPatientPreAdmissionDetails();
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
                "windowClass": "modal__eighty--  ",
                "keyboard": false,
                "controller": "DocumentScannerCtrl",
            });
            $scope.mInstanceAdd.result.then(function (data) {
                console.log(data);
                $scope.GetPatientPreAdmissionDetails();

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

        $scope.GetHealthAdvancedData1 = function (array) {
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
                $scope.PreAdmCardioObj.SelectedCardiacIssues = tempCardiacArray.join(", ");
            } else {
                $scope.PreAdmCardioObj.SelectedCardiacIssues = "";
            }
            if (tempPulmonaryArray.length > 0) {
                $scope.PreAdmCardioObj.SelectedPulmonaryIssues = tempPulmonaryArray.join(", ");
            } else {
                $scope.PreAdmCardioObj.SelectedPulmonaryIssues = "";
            }
            if (tempHepaticArray.length > 0) {
                $scope.PreAdmCardioObj.SelectedHepaticIssues = tempHepaticArray.join(", ");
            } else {
                $scope.PreAdmCardioObj.SelectedHepaticIssues = "";
            }
            if (tempEndocrineArray.length > 0) {
                $scope.PreAdmCardioObj.SelectedEndocrineIssues = tempEndocrineArray.join(", ");
            } else {
                $scope.PreAdmCardioObj.SelectedEndocrineIssues = "";
            }
            if (tempNeurologicArray.length > 0) {
                $scope.PreAdmCardioObj.SelectedNeurologicIssues = tempNeurologicArray.join(", ");
            } else {
                $scope.PreAdmCardioObj.SelectedNeurologicIssues = "";
            }
            if (tempHemeOneArray.length > 0) {
                $scope.PreAdmCardioObj.SelectedHemeOncIssues = tempHemeOneArray.join(", ");
            } else {
                $scope.PreAdmCardioObj.SelectedHemeOncIssues = "";
            }
            if (tempNervousSystemArray.length > 0) {
                $scope.PreAdmCardioObj.SelectedNervousSystemIssues = tempNervousSystemArray.join(", ");
            } else {
                $scope.PreAdmCardioObj.SelectedNervousSystemIssues = "";
            }
            if (tempKidneyDiseaseArray.length > 0) {
                $scope.PreAdmCardioObj.SelectedKidneyDiseaseIssues = tempKidneyDiseaseArray.join(", ");
            } else {
                $scope.PreAdmCardioObj.SelectedKidneyDiseaseIssues = "";
            }
            if (tempMusculoSkeletalArray.length > 0) {
                $scope.PreAdmCardioObj.SelectedMusculoSkeletalSystemIssues = tempMusculoSkeletalArray.join(", ");
            } else {
                $scope.PreAdmCardioObj.SelectedMusculoSkeletalSystemIssues = "";
            }
            if (tempAutoImmuneArray.length > 0) {
                $scope.PreAdmCardioObj.SelectedAutoImmuneDisordersIssues = tempAutoImmuneArray.join(", ");
            } else {
                $scope.PreAdmCardioObj.SelectedAutoImmuneDisordersIssues = "";
            }
            if (tempPsychosisArray.length > 0) {
                $scope.PreAdmCardioObj.SelectedPsychosisIssues = tempPsychosisArray.join(", ");
            } else {
                $scope.PreAdmCardioObj.SelectedPsychosisIssues = "";
            }
            if (tempOthersArray.length > 0) {
                $scope.PreAdmCardioObj.SelectedOthersIssues = tempOthersArray.join(", ");
            } else {
                $scope.PreAdmCardioObj.SelectedOthersIssues = "";
            }
            if (respiratoryArray.length > 0) {
                $scope.PreAdmCardioObj.SelectedrespIssues = respiratoryArray.join(", ");
            } else {
                $scope.PreAdmCardioObj.SelectedrespIssues = "";
            }
            if (socialArray.length > 0) {
                $scope.PreAdmCardioObj.SelectedsocialIssues = socialArray.join(", ");
            } else {
                $scope.PreAdmCardioObj.SelectedsocialIssues = "";
            }
            if (HeentArray.length > 0) {
                $scope.PreAdmCardioObj.SelectedHeentIssues = HeentArray.join(", ");
            } else {
                $scope.PreAdmCardioObj.SelectedHeentIssues = "";
            }
            if (LungsArray.length > 0) {
                $scope.PreAdmCardioObj.SelectedLungsIssues = LungsArray.join(", ");
            } else {
                $scope.PreAdmCardioObj.SelectedLungsIssues = "";
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

        $scope.changeDateOfSurgery = function (surgeryDt, item) {
            var FirstFollowupDate = moment(surgeryDt).add(1, 'days').format('MM-DD-YYYY');
            var SecondFollowupDate = moment(surgeryDt).add(7, 'days').format('MM-DD-YYYY');
            var ThirdFollowupDate = moment(surgeryDt).add(30, 'days').format('MM-DD-YYYY');
            item.FirstFollowupDate = FirstFollowupDate;
            item.SecondFollowupDate = SecondFollowupDate;
            item.ThirdFollowupDate = ThirdFollowupDate;
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
                    "AllUserList": function () { return $scope.allUserList; },
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

        $scope.CopyFromAnesthetist = function () {

            $scope.PreAdmCardioObj = angular.copy($scope.GetPreAdmCardioObj());

            $scope.PreAdmCardioObj.Vitals = angular.copy($scope.PreAdmAnesthetistObj.Vitals);

            $scope.PreAdmCardioObj.SystemicHistory = angular.copy($scope.PreAdmAnesthetistObj.SystemicHistory);
            $scope.PreAdmCardioObj.SurgicalHistory = angular.copy($scope.PreAdmAnesthetistObj.SurgicalHistory);
            $scope.PreAdmCardioObj.AllergyItems = angular.copy($scope.PreAdmAnesthetistObj.AllergyItems);

            $scope.PreAdmCardioObj.LabObj = angular.copy($scope.GetLabObj());
            $scope.PreAdmCardioObj.LabObj.HGB = $scope.PreAdmAnesthetistObj.LabObj.HGB;
            $scope.PreAdmCardioObj.LabObj.HCT = $scope.PreAdmAnesthetistObj.LabObj.HCT;
            $scope.PreAdmCardioObj.LabObj.WBC = $scope.PreAdmAnesthetistObj.LabObj.WBC;
            $scope.PreAdmCardioObj.LabObj.RBC = $scope.PreAdmAnesthetistObj.LabObj.RBC;
            $scope.PreAdmCardioObj.LabObj.A1C = $scope.PreAdmAnesthetistObj.LabObj.A1C;
            $scope.PreAdmCardioObj.LabObj.Creatinine = $scope.PreAdmAnesthetistObj.LabObj.Creatinine;
            $scope.PreAdmCardioObj.LabObj.UrineAnalysis = $scope.PreAdmAnesthetistObj.LabObj.UrineAnalysis;
            $scope.PreAdmCardioObj.LabObj.IsBloodAvailable = $scope.PreAdmAnesthetistObj.LabObj.IsBloodAvailable;
            $scope.PreAdmCardioObj.LabObj.IsPretransfusion = $scope.PreAdmAnesthetistObj.LabObj.IsPretransfusion;
            $scope.PreAdmCardioObj.LabObj.RBS = $scope.PreAdmAnesthetistObj.LabObj.RBS;
            $scope.PreAdmCardioObj.LabObj.FBS = $scope.PreAdmAnesthetistObj.LabObj.FBS;
            $scope.PreAdmCardioObj.LabObj.PBBS = $scope.PreAdmAnesthetistObj.LabObj.PBBS;
            $scope.PreAdmCardioObj.LabObj.PBLS = $scope.PreAdmAnesthetistObj.LabObj.PBLS;
            $scope.PreAdmCardioObj.LabObj.Others = $scope.PreAdmAnesthetistObj.LabObj.Others;
            $scope.PreAdmCardioObj.LabObj.Notes = $scope.PreAdmAnesthetistObj.LabObj.Notes || "";
            $scope.PreAdmCardioObj.LabObj.LabTestArray = $scope.PreAdmAnesthetistObj.LabObj.LabTestArray || [];

            $scope.PreAdmCardioObj.CardioVascularObj.Systolic = $scope.PreAdmAnesthetistObj.CardioVascularObj.Systolic;
            $scope.PreAdmCardioObj.CardioVascularObj.Diastolic = $scope.PreAdmAnesthetistObj.CardioVascularObj.Diastolic;
            $scope.PreAdmCardioObj.CardioVascularObj.PR = $scope.PreAdmAnesthetistObj.CardioVascularObj.PR;
            $scope.PreAdmCardioObj.CardioVascularObj.ECG = $scope.PreAdmAnesthetistObj.CardioVascularObj.ECG;
            $scope.PreAdmCardioObj.CardioVascularObj.ECGUnits = $scope.PreAdmAnesthetistObj.CardioVascularObj.ECGUnits;
            $scope.PreAdmCardioObj.CardioVascularObj.Notes = $scope.PreAdmAnesthetistObj.CardioVascularObj.Notes || "";

            $scope.PreAdmCardioObj.AirwayObj.ROMTMS = $scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS;
            $scope.PreAdmCardioObj.AirwayObj.ROMNECKLAT = $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT;
            $scope.PreAdmCardioObj.AirwayObj.ROMNECKAP = $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP;
            $scope.PreAdmCardioObj.AirwayObj.Notes = $scope.PreAdmAnesthetistObj.AirwayObj.Notes || "";
            $scope.PreAdmCardioObj.AirwayObj.IsNormal = $scope.PreAdmAnesthetistObj.AirwayObj.IsNormal;
            $scope.PreAdmCardioObj.AirwayObj.Class = $scope.PreAdmAnesthetistObj.AirwayObj.Class;
            $scope.PreAdmCardioObj.AirwayObj.Dentition = $scope.PreAdmAnesthetistObj.AirwayObj.Dentition;

            $scope.PreAdmCardioObj.MedicationsList = $scope.PreAdmAnesthetistObj.MedicationsList;
            $scope.PreAdmCardioObj.CurrentMedicationList = $scope.PreAdmAnesthetistObj.CurrentMedicationList;
            $scope.PreAdmCardioObj.InvestigationsList = $scope.PreAdmAnesthetistObj.InvestigationsList;

            $scope.PreAdmCardioObj.RespiratoryNotes = $scope.PreAdmAnesthetistObj.RespiratoryNotes || "";
            $scope.PreAdmCardioObj.CNSNotes = $scope.PreAdmAnesthetistObj.CNSNotes;
            $scope.PreAdmCardioObj.SocialNotes = $scope.PreAdmAnesthetistObj.SocialNotes;

            $scope.PreAdmCardioObj.HealthArray = angular.copy($scope.PreAdmAnesthetistObj.HealthArray);

            $scope.PreAdmCardioObj.SocialNotes = $scope.PreAdmAnesthetistObj.SocialNotes;
            $scope.PreAdmCardioObj.CardiacNotes = $scope.PreAdmAnesthetistObj.CardiacNotes;
            $scope.PreAdmCardioObj.PulmonaryNotes = $scope.PreAdmAnesthetistObj.PulmonaryNotes;
            $scope.PreAdmCardioObj.HepaticNotes = $scope.PreAdmAnesthetistObj.HepaticNotes;
            $scope.PreAdmCardioObj.EndocrineNotes = $scope.PreAdmAnesthetistObj.EndocrineNotes;
            $scope.PreAdmCardioObj.NeurologicNotes = $scope.PreAdmAnesthetistObj.NeurologicNotes;
            $scope.PreAdmCardioObj.HemeOncNotes = $scope.PreAdmAnesthetistObj.HemeOncNotes;
            $scope.PreAdmCardioObj.NervousSystemNotes = $scope.PreAdmAnesthetistObj.NervousSystemNotes;
            $scope.PreAdmCardioObj.MusculoSkeletalSystemNotes = $scope.PreAdmAnesthetistObj.MusculoSkeletalSystemNotes;
            $scope.PreAdmCardioObj.KidneyDiseaseNotes = $scope.PreAdmAnesthetistObj.KidneyDiseaseNotes;
            $scope.PreAdmCardioObj.AutoImmuneDisordersNotes = $scope.PreAdmAnesthetistObj.AutoImmuneDisordersNotes;
            $scope.PreAdmCardioObj.PsychosisNotes = $scope.PreAdmAnesthetistObj.PsychosisNotes;
            $scope.PreAdmCardioObj.OthersNotes = $scope.PreAdmAnesthetistObj.OthersNotes;

            $scope.PreAdmCardioObj.IsCardiacWNL = $scope.PreAdmAnesthetistObj.IsCardiacWNL;
            $scope.PreAdmCardioObj.IsCNSHistory = $scope.PreAdmAnesthetistObj.IsCNSHistory;
            $scope.PreAdmCardioObj.IsAutoImmuneDisordersWNL = $scope.PreAdmAnesthetistObj.IsAutoImmuneDisordersWNL;
            $scope.PreAdmCardioObj.IsEndocrineWNL = $scope.PreAdmAnesthetistObj.IsEndocrineWNL;
            $scope.PreAdmCardioObj.IsHemeOncWNL = $scope.PreAdmAnesthetistObj.IsHemeOncWNL;
            $scope.PreAdmCardioObj.IsHepaticWNL = $scope.PreAdmAnesthetistObj.IsHepaticWNL;
            $scope.PreAdmCardioObj.IsKidneyDiseaseWNL = $scope.PreAdmAnesthetistObj.IsKidneyDiseaseWNL;
            $scope.PreAdmCardioObj.IsMusculoSkeletalSystemWNL = $scope.PreAdmAnesthetistObj.IsMusculoSkeletalSystemWNL;
            $scope.PreAdmCardioObj.IsNervousSystemWNL = $scope.PreAdmAnesthetistObj.IsNervousSystemWNL;
            $scope.PreAdmCardioObj.IsNeurologicWNL = $scope.PreAdmAnesthetistObj.IsNeurologicWNL;
            $scope.PreAdmCardioObj.IsOthersWNL = $scope.PreAdmAnesthetistObj.IsOthersWNL;
            $scope.PreAdmCardioObj.IsPsychosisWNL = $scope.PreAdmAnesthetistObj.IsPsychosisWNL;
            $scope.PreAdmCardioObj.IsPulmonaryWNL = $scope.PreAdmAnesthetistObj.IsPulmonaryWNL;
            $scope.PreAdmCardioObj.IsRespiratoryNormal = $scope.PreAdmAnesthetistObj.IsRespiratoryNormal;

            $scope.PreAdmCardioObj.IsHeentWNL = $scope.PreAdmAnesthetistObj.IsHeentWNL;
            $scope.PreAdmCardioObj.IsLungsWNL = $scope.PreAdmAnesthetistObj.IsLungsWNL;
            $scope.PreAdmCardioObj.HeentNotes = $scope.PreAdmAnesthetistObj.HeentNotes || "";
            $scope.PreAdmCardioObj.LungsNotes = $scope.PreAdmAnesthetistObj.LungsNotes || "";


            $scope.PreAdmCardioObj.SelectedCardiacIssues = $scope.PreAdmAnesthetistObj.SelectedCardiacIssues || "";
            $scope.PreAdmCardioObj.SelectedPulmonaryIssues = $scope.PreAdmAnesthetistObj.SelectedPulmonaryIssues || "";
            $scope.PreAdmCardioObj.SelectedHepaticIssues = $scope.PreAdmAnesthetistObj.SelectedHepaticIssues || "";
            $scope.PreAdmCardioObj.SelectedEndocrineIssues = $scope.PreAdmAnesthetistObj.SelectedEndocrineIssues || "";
            $scope.PreAdmCardioObj.SelectedNeurologicIssues = $scope.PreAdmAnesthetistObj.SelectedNeurologicIssues || "";
            $scope.PreAdmCardioObj.SelectedHemeOncIssues = $scope.PreAdmAnesthetistObj.SelectedHemeOncIssues || "";
            $scope.PreAdmCardioObj.SelectedNervousSystemIssues = $scope.PreAdmAnesthetistObj.SelectedNervousSystemIssues || "";
            $scope.PreAdmCardioObj.SelectedMusculoSkeletalSystemIssues = $scope.PreAdmAnesthetistObj.SelectedMusculoSkeletalSystemIssues || "";
            $scope.PreAdmCardioObj.SelectedKidneyDiseaseIssues = $scope.PreAdmAnesthetistObj.SelectedKidneyDiseaseIssues || "";
            $scope.PreAdmCardioObj.SelectedAutoImmuneDisordersIssues = $scope.PreAdmAnesthetistObj.SelectedAutoImmuneDisordersIssues || "";
            $scope.PreAdmCardioObj.SelectedPsychosisIssues = $scope.PreAdmAnesthetistObj.SelectedPsychosisIssues || "";
            $scope.PreAdmCardioObj.SelectedOthersIssues = $scope.PreAdmAnesthetistObj.SelectedOthersIssues || "";
            $scope.PreAdmCardioObj.ReviewedBy = $scope.PreAdmAnesthetistObj.ReviewedBy || null;
            $scope.PreAdmCardioObj.PreAdmissionStatusId = $scope.PreAdmAnesthetistObj.PreAdmissionStatusId || null;
            $scope.PreAdmCardioObj.DocumentDetails = $scope.PreAdmissionDetails.DocumentDetails || [];
        }
        $scope.CopyFromCardioEvaluation = function () {

            $scope.PreAdmAnesthetistObj = angular.copy($scope.GetPreAdmAnesthetistObj());

            $scope.PreAdmAnesthetistObj.Vitals = angular.copy($scope.PreAdmCardioObj.Vitals);

            $scope.PreAdmAnesthetistObj.SystemicHistory = angular.copy($scope.PreAdmCardioObj.SystemicHistory);
            $scope.PreAdmAnesthetistObj.SurgicalHistory = angular.copy($scope.PreAdmCardioObj.SurgicalHistory);
            $scope.PreAdmAnesthetistObj.AllergyItems = angular.copy($scope.PreAdmCardioObj.AllergyItems);

            $scope.PreAdmAnesthetistObj.LabObj = angular.copy($scope.GetLabObj());
            $scope.PreAdmAnesthetistObj.LabObj.HGB = $scope.PreAdmCardioObj.LabObj.HGB;
            $scope.PreAdmAnesthetistObj.LabObj.HCT = $scope.PreAdmCardioObj.LabObj.HCT;
            $scope.PreAdmAnesthetistObj.LabObj.WBC = $scope.PreAdmCardioObj.LabObj.WBC;
            $scope.PreAdmAnesthetistObj.LabObj.RBC = $scope.PreAdmCardioObj.LabObj.RBC;
            $scope.PreAdmAnesthetistObj.LabObj.A1C = $scope.PreAdmCardioObj.LabObj.A1C;
            $scope.PreAdmAnesthetistObj.LabObj.Creatinine = $scope.PreAdmCardioObj.LabObj.Creatinine;
            $scope.PreAdmAnesthetistObj.LabObj.UrineAnalysis = $scope.PreAdmCardioObj.LabObj.UrineAnalysis;
            $scope.PreAdmAnesthetistObj.LabObj.IsBloodAvailable = $scope.PreAdmCardioObj.LabObj.IsBloodAvailable;
            $scope.PreAdmAnesthetistObj.LabObj.IsPretransfusion = $scope.PreAdmCardioObj.LabObj.IsPretransfusion;
            $scope.PreAdmAnesthetistObj.LabObj.RBS = $scope.PreAdmCardioObj.LabObj.RBS;
            $scope.PreAdmAnesthetistObj.LabObj.FBS = $scope.PreAdmCardioObj.LabObj.FBS;
            $scope.PreAdmAnesthetistObj.LabObj.PBBS = $scope.PreAdmCardioObj.LabObj.PBBS;
            $scope.PreAdmAnesthetistObj.LabObj.PBLS = $scope.PreAdmCardioObj.LabObj.PBLS;
            $scope.PreAdmAnesthetistObj.LabObj.Others = $scope.PreAdmCardioObj.LabObj.Others;
            $scope.PreAdmAnesthetistObj.LabObj.Notes = $scope.PreAdmCardioObj.LabObj.Notes || "";
            $scope.PreAdmAnesthetistObj.LabObj.LabTestArray = $scope.PreAdmCardioObj.LabObj.LabTestArray || [];

            $scope.PreAdmAnesthetistObj.CardioVascularObj.Systolic = $scope.PreAdmCardioObj.CardioVascularObj.Systolic;
            $scope.PreAdmAnesthetistObj.CardioVascularObj.Diastolic = $scope.PreAdmCardioObj.CardioVascularObj.Diastolic;
            $scope.PreAdmAnesthetistObj.CardioVascularObj.PR = $scope.PreAdmCardioObj.CardioVascularObj.PR;
            $scope.PreAdmAnesthetistObj.CardioVascularObj.ECG = $scope.PreAdmCardioObj.CardioVascularObj.ECG;
            $scope.PreAdmAnesthetistObj.CardioVascularObj.ECGUnits = $scope.PreAdmCardioObj.CardioVascularObj.ECGUnits;
            $scope.PreAdmAnesthetistObj.CardioVascularObj.Notes = $scope.PreAdmCardioObj.CardioVascularObj.Notes || "";

            $scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS = $scope.PreAdmCardioObj.AirwayObj.ROMTMS;
            $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT = $scope.PreAdmCardioObj.AirwayObj.ROMNECKLAT;
            $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP = $scope.PreAdmCardioObj.AirwayObj.ROMNECKAP;
            $scope.PreAdmAnesthetistObj.AirwayObj.Notes = $scope.PreAdmCardioObj.AirwayObj.Notes || "";
            $scope.PreAdmAnesthetistObj.AirwayObj.IsNormal = $scope.PreAdmCardioObj.AirwayObj.IsNormal;
            $scope.PreAdmAnesthetistObj.AirwayObj.Class = $scope.PreAdmCardioObj.AirwayObj.Class;
            $scope.PreAdmAnesthetistObj.AirwayObj.Dentition = $scope.PreAdmCardioObj.AirwayObj.Dentition;

            $scope.PreAdmAnesthetistObj.MedicationsList = $scope.PreAdmCardioObj.MedicationsList;
            $scope.PreAdmAnesthetistObj.CurrentMedicationList = $scope.PreAdmCardioObj.CurrentMedicationList;
            $scope.PreAdmAnesthetistObj.InvestigationsList = $scope.PreAdmCardioObj.InvestigationsList;

            $scope.PreAdmAnesthetistObj.RespiratoryNotes = $scope.PreAdmCardioObj.RespiratoryNotes || "";
            $scope.PreAdmAnesthetistObj.CNSNotes = $scope.PreAdmCardioObj.CNSNotes;
            $scope.PreAdmAnesthetistObj.SocialNotes = $scope.PreAdmCardioObj.SocialNotes;

            $scope.PreAdmAnesthetistObj.HealthArray = angular.copy($scope.PreAdmCardioObj.HealthArray);

            $scope.PreAdmAnesthetistObj.SocialNotes = $scope.PreAdmCardioObj.SocialNotes;
            $scope.PreAdmAnesthetistObj.CardiacNotes = $scope.PreAdmCardioObj.CardiacNotes;
            $scope.PreAdmAnesthetistObj.PulmonaryNotes = $scope.PreAdmCardioObj.PulmonaryNotes;
            $scope.PreAdmAnesthetistObj.HepaticNotes = $scope.PreAdmCardioObj.HepaticNotes;
            $scope.PreAdmAnesthetistObj.EndocrineNotes = $scope.PreAdmCardioObj.EndocrineNotes;
            $scope.PreAdmAnesthetistObj.NeurologicNotes = $scope.PreAdmCardioObj.NeurologicNotes;
            $scope.PreAdmAnesthetistObj.HemeOncNotes = $scope.PreAdmCardioObj.HemeOncNotes;
            $scope.PreAdmAnesthetistObj.NervousSystemNotes = $scope.PreAdmCardioObj.NervousSystemNotes;
            $scope.PreAdmAnesthetistObj.MusculoSkeletalSystemNotes = $scope.PreAdmCardioObj.MusculoSkeletalSystemNotes;
            $scope.PreAdmAnesthetistObj.KidneyDiseaseNotes = $scope.PreAdmCardioObj.KidneyDiseaseNotes;
            $scope.PreAdmAnesthetistObj.AutoImmuneDisordersNotes = $scope.PreAdmCardioObj.AutoImmuneDisordersNotes;
            $scope.PreAdmAnesthetistObj.PsychosisNotes = $scope.PreAdmCardioObj.PsychosisNotes;
            $scope.PreAdmAnesthetistObj.OthersNotes = $scope.PreAdmCardioObj.OthersNotes;


            $scope.PreAdmAnesthetistObj.IsHeentWNL = $scope.PreAdmCardioObj.IsHeentWNL;
            $scope.PreAdmAnesthetistObj.IsLungsWNL = $scope.PreAdmCardioObj.IsLungsWNL;
            $scope.PreAdmAnesthetistObj.HeentNotes = $scope.PreAdmCardioObj.HeentNotes || "";
            $scope.PreAdmAnesthetistObj.LungsNotes = $scope.PreAdmCardioObj.LungsNotes || "";


            $scope.PreAdmAnesthetistObj.IsCardiacWNL = $scope.PreAdmCardioObj.IsCardiacWNL;
            $scope.PreAdmAnesthetistObj.IsCNSHistory = $scope.PreAdmCardioObj.IsCNSHistory;
            $scope.PreAdmAnesthetistObj.IsAutoImmuneDisordersWNL = $scope.PreAdmCardioObj.IsAutoImmuneDisordersWNL;
            $scope.PreAdmAnesthetistObj.IsEndocrineWNL = $scope.PreAdmCardioObj.IsEndocrineWNL;
            $scope.PreAdmAnesthetistObj.IsHemeOncWNL = $scope.PreAdmCardioObj.IsHemeOncWNL;
            $scope.PreAdmAnesthetistObj.IsHepaticWNL = $scope.PreAdmCardioObj.IsHepaticWNL;
            $scope.PreAdmAnesthetistObj.IsKidneyDiseaseWNL = $scope.PreAdmCardioObj.IsKidneyDiseaseWNL;
            $scope.PreAdmAnesthetistObj.IsMusculoSkeletalSystemWNL = $scope.PreAdmCardioObj.IsMusculoSkeletalSystemWNL;
            $scope.PreAdmAnesthetistObj.IsNervousSystemWNL = $scope.PreAdmCardioObj.IsNervousSystemWNL;
            $scope.PreAdmAnesthetistObj.IsNeurologicWNL = $scope.PreAdmCardioObj.IsNeurologicWNL;
            $scope.PreAdmAnesthetistObj.IsOthersWNL = $scope.PreAdmCardioObj.IsOthersWNL;
            $scope.PreAdmAnesthetistObj.IsPsychosisWNL = $scope.PreAdmCardioObj.IsPsychosisWNL;
            $scope.PreAdmAnesthetistObj.IsPulmonaryWNL = $scope.PreAdmCardioObj.IsPulmonaryWNL;
            $scope.PreAdmAnesthetistObj.IsRespiratoryNormal = $scope.PreAdmCardioObj.IsRespiratoryNormal;

            $scope.PreAdmAnesthetistObj.SelectedCardiacIssues = $scope.PreAdmCardioObj.SelectedCardiacIssues || "";
            $scope.PreAdmAnesthetistObj.SelectedPulmonaryIssues = $scope.PreAdmCardioObj.SelectedPulmonaryIssues || "";
            $scope.PreAdmAnesthetistObj.SelectedHepaticIssues = $scope.PreAdmCardioObj.SelectedHepaticIssues || "";
            $scope.PreAdmAnesthetistObj.SelectedEndocrineIssues = $scope.PreAdmCardioObj.SelectedEndocrineIssues || "";
            $scope.PreAdmAnesthetistObj.SelectedNeurologicIssues = $scope.PreAdmCardioObj.SelectedNeurologicIssues || "";
            $scope.PreAdmAnesthetistObj.SelectedHemeOncIssues = $scope.PreAdmCardioObj.SelectedHemeOncIssues || "";
            $scope.PreAdmAnesthetistObj.SelectedNervousSystemIssues = $scope.PreAdmCardioObj.SelectedNervousSystemIssues || "";
            $scope.PreAdmAnesthetistObj.SelectedMusculoSkeletalSystemIssues = $scope.PreAdmCardioObj.SelectedMusculoSkeletalSystemIssues || "";
            $scope.PreAdmAnesthetistObj.SelectedKidneyDiseaseIssues = $scope.PreAdmCardioObj.SelectedKidneyDiseaseIssues || "";
            $scope.PreAdmAnesthetistObj.SelectedAutoImmuneDisordersIssues = $scope.PreAdmCardioObj.SelectedAutoImmuneDisordersIssues || "";
            $scope.PreAdmAnesthetistObj.SelectedPsychosisIssues = $scope.PreAdmCardioObj.SelectedPsychosisIssues || "";
            $scope.PreAdmAnesthetistObj.SelectedOthersIssues = $scope.PreAdmCardioObj.SelectedOthersIssues || "";
            $scope.PreAdmissionDetails.PrevAnesthesia = $scope.PreAdmissionDetails.PrevAnesthesia || "";
            if ($scope.PreAdmissionDetails.PrevAnesthesia != "") {
                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());
                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.Notes = $scope.PreAdmissionDetails.PrevAnesthesia.Notes || "";
                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsComplications = $scope.PreAdmissionDetails.PrevAnesthesia.IsComplications;
                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsContinue = $scope.PreAdmissionDetails.PrevAnesthesia.IsContinue;
                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsDifficultAirway = $scope.PreAdmissionDetails.PrevAnesthesia.IsDifficultAirway;
                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsFamilyHistory = $scope.PreAdmissionDetails.PrevAnesthesia.IsFamilyHistory;
                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPONV = $scope.PreAdmissionDetails.PrevAnesthesia.IsPONV;
                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPatientDNR = $scope.PreAdmissionDetails.PrevAnesthesia.IsPatientDNR;
                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPrevAnesthesia = $scope.PreAdmissionDetails.PrevAnesthesia.IsPrevAnesthesia;
                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsSuspend = $scope.PreAdmissionDetails.PrevAnesthesia.IsSuspend;
            }
            $scope.PreAdmAnesthetistObj.ReviewedBy = $scope.PreAdmCardioObj.ReviewedBy || null;
            $scope.PreAdmAnesthetistObj.PreAdmissionStatusId = $scope.PreAdmCardioObj.PreAdmissionStatusId || null;
            $scope.PreAdmAnesthetistObj.DocumentDetails = $scope.PreAdmissionDetails.DocumentDetails || [];

            $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj = angular.copy($scope.GetAPAnesthesiaOptionsObj());
            $scope.PreAdmissionDetails.AnesthesiaPlan = $scope.PreAdmissionDetails.AnesthesiaPlan || "";
            if ($scope.PreAdmissionDetails.AnesthesiaPlan != "") {
                $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsTopicalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsTopicalAnesthesia;
                $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsGeneralAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsGeneralAnesthesia;
                $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsLocalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsLocalAnesthesia;
                $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsPeriBulbarAnesthesia;
                $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsRegionalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsRegionalAnesthesia;
                $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsSubtenonAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsSubtenonAnesthesia;
                $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistId = parseInt($scope.PreAdmissionDetails.AnesthesiaPlan.AnesthetistId);
            }
        }
        $scope.SavePreAdmissionCardioDetails = function (str) {
            let appointmentId;
            if ($scope.cacheStorageItem.AppointmentTypeId === 4 || $scope.cacheStorageItem.AppointmentTypeId === 14) {
                appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
            }
            if ($scope.cacheStorageItem.AppointmentTypeId === 7||$scope.cacheStorageItem.AppointmentTypeId === 6) {
                appointmentId = $scope.cacheStorageItem.AppointmentId;
            }

            var ReviewedDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");

            let parentApptId = ($scope.cacheStorageItem.PreAdmSurgeryList.length > 0) ? $scope.cacheStorageItem.PreAdmSurgeryList[0].AppointmentId : null;
            let reqObj = {
                "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                "PreAdmissionId": $scope.PreAdmCardioObj.PreAdmissionId || 0,
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
                "IsRespiratoryNormal": $scope.PreAdmCardioObj.IsRespiratoryNormal,
                "RespiratoryNotes": $scope.PreAdmCardioObj.RespiratoryNotes || "",
                "IsCNSHistory": $scope.PreAdmCardioObj.IsCNSHistory,
                "IsCardiovascularHistory": $scope.PreAdmCardioObj.IsCardiovascularHistory,
                "CNSNotes": $scope.PreAdmCardioObj.CNSNotes || "",
                "SocialNotes": $scope.PreAdmCardioObj.SocialNotes || "",
                "IsCardiacWNL": $scope.PreAdmCardioObj.IsCardiacWNL,
                "CardiacNotes": $scope.PreAdmCardioObj.CardiacNotes || "",
                "IsPulmonaryWNL": $scope.PreAdmCardioObj.IsPulmonaryWNL,
                "PulmonaryNotes": $scope.PreAdmCardioObj.PulmonaryNotes || "",
                "IsHepaticWNL": $scope.PreAdmCardioObj.IsHepaticWNL,
                "HepaticNotes": $scope.PreAdmCardioObj.HepaticNotes || "",
                "IsEndocrineWNL": $scope.PreAdmCardioObj.IsEndocrineWNL,
                "EndocrineNotes": $scope.PreAdmCardioObj.EndocrineNotes || "",
                "IsNeurologicWNL": $scope.PreAdmCardioObj.IsNeurologicWNL,
                "NeurologicNotes": $scope.PreAdmCardioObj.NeurologicNotes || "",
                "IsHemeOncWNL": $scope.PreAdmCardioObj.IsHemeOncWNL,
                "HemeOncNotes": $scope.PreAdmCardioObj.HemeOncNotes || "",
                "IsNervousSystemWNL": $scope.PreAdmCardioObj.IsNervousSystemWNL,
                "NervousSystemNotes": $scope.PreAdmCardioObj.NervousSystemNotes || "",
                "IsKidneyDiseaseWNL": $scope.PreAdmCardioObj.IsKidneyDiseaseWNL,
                "KidneyDiseaseNotes": $scope.PreAdmCardioObj.KidneyDiseaseNotes || "",
                "IsMusculoSkeletalSystemWNL": $scope.PreAdmCardioObj.IsMusculoSkeletalSystemWNL,
                "MusculoSkeletalSystemNotes": $scope.PreAdmCardioObj.MusculoSkeletalSystemNotes || "",
                "IsAutoImmuneDisordersWNL": $scope.PreAdmCardioObj.IsAutoImmuneDisordersWNL,
                "AutoImmuneDisordersNotes": $scope.PreAdmCardioObj.AutoImmuneDisordersNotes || "",
                "IsPsychosisWNL": $scope.PreAdmCardioObj.IsPsychosisWNL,
                "PsychosisNotes": $scope.PreAdmCardioObj.PsychosisNotes || "",
                "IsOthersWNL": $scope.PreAdmCardioObj.IsOthersWNL,
                "OthersNotes": $scope.PreAdmCardioObj.OthersNotes || "",
                "IsHeentWNL": $scope.PreAdmCardioObj.IsHeentWNL,
                "HeentNotes": $scope.PreAdmCardioObj.HeentNotes || "",
                "IsLungsWNL": $scope.PreAdmCardioObj.IsLungsWNL,
                "LungsNotes": $scope.PreAdmCardioObj.LungsNotes || "",
                "ReviwedBy": 0,
                "TempDocumentDetails": [],
                "DocumentDetails": [],
                "CardiologistTempDocumentDetails": [],
                "CardiologistDocumentDetails": [],
                "ConsentFormSignDate": $filter('date')($scope.currentDate, "yyyy-MM-dd"),
                "PreAdmissionStatusId": $scope.PreAdmCardioObj.PreAdmissionStatusId || null,
                "PreAdmissionStatus": $scope.PreAdmCardioObj.PreAdmissionStatus || "",
                "PreAdmissionChartStatus": (str === "SignOff") ? "E" : "D",
                "StatusFlag": $scope.PreAdmCardioObj.StatusFlag,
                "ReviewedDate": ReviewedDate || null,
                "ROSOverAllRemarks": $scope.PreAdmCardioObj.ROSOverAllRemarks || "",
                "PresentIllness": $scope.PreAdmCardioObj.PresentIllness || "",
                "Chemistry": $scope.PreAdmCardioObj.Chemistry || "",
                "Treatment": $scope.PreAdmCardioObj.Treatment || "",
                "IsCXR": $scope.PreAdmCardioObj.IsCXR || "",
                "CXRHistory": $scope.PreAdmCardioObj.CXRHistory || "",
                "PrescriptionArray": $scope.PreAdmCardioObj.PrescriptionDetails || "",
                "CardiologistDiagnosis": $scope.PreAdmCardioObj.CardiologistDiagnosis || [],
                "OtherSystemArray": $scope.CardioOtherSystemsArrayList || [],
                "IsChestPain": $scope.PreAdmCardioObj.IsChestPain

            };
            reqObj.VitalsArray = $scope.PreAdmCardioObj.Vitals;
            reqObj.SystemicHistory = $scope.PreAdmCardioObj.SystemicHistory;
            reqObj.AllergyItems = $scope.PreAdmCardioObj.AllergyItems;
            reqObj.SurgicalHistory = $scope.PreAdmCardioObj.SurgicalHistory;
            reqObj.LabTest = $scope.PreAdmCardioObj.LabObj;
            reqObj.Airway = $scope.PreAdmCardioObj.AirwayObj;
            reqObj.CardioVascular = $scope.PreAdmCardioObj.CardioVascularObj;

            //let tempHealthArray = angular.copy($scope.PreAdmCardioObj.HealthArray);
            //tempHealthArray = $filter('filter')(tempHealthArray, { 'IsChecked': true }, true);
            let tempHealthArray = angular.copy($scope.PreAdmCardioObj.HealthArray);
            tempHealthArray = $filter('filter')(tempHealthArray, function (item) {
                return item.IsChecked !== null;
            });

            reqObj.HealthArray = angular.copy(tempHealthArray);

            reqObj.OrganizationSurgeryId = $scope.SurgeryDiagnosisObj.OrganizationSurgeryId;
            reqObj.SurgeryId = $scope.SurgeryDiagnosisObj.SurgeryId;
            reqObj.OrganizationDiagnosisId = $scope.SurgeryDiagnosisObj.OrganizationDiagnosisId;
            reqObj.DiagnosisId = $scope.SurgeryDiagnosisObj.DiagnosisId;
            reqObj.PatientAppointmentsDetails = {
                "AscAppointmentId": $scope.PreAdmCardioObj.AscAppointmentId || 0,
                "AscAppointmentDate": $filter('date')(new Date($scope.cacheStorageItem.DateOfSurgery), "yyyy-MM-dd") || null,
                "FirstFollowupDate": null,
                "FirstFollowupApptId": 0,
                "SecondFollowupDate": null,
                "SecondFollowupApptId": 0,
                "ThirdollowupDate": null,
                "ThirdFollowupApptId": 0
            };

            reqObj.CurrentSystemicMedicationsList = $scope.PreAdmCardioObj.CurrentSystemicMedicationsHistory;
            reqObj.CurrentEyeMedicationsList = $scope.PreAdmCardioObj.CurrentEyeMedications;
            reqObj.InvestigationsList = $scope.PreAdmCardioObj.InvestigationsList;

            reqObj.ReviwedBy = $scope.PreAdmCardioObj.ReviewedBy;
            //console.log(JSON.stringify(reqObj));

           
            $scope.CardiologistFilesObj.TempImagesArray = $scope.CardiologistFilesObj.TempImagesArray || [];
            if ($scope.CardiologistFilesObj.TempImagesArray.length > 0) {
                angular.forEach($scope.CardiologistFilesObj.TempImagesArray, function (item) {
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
                    $scope.PreAdmCardioObj.PreAdmissionId = response.PreAdmissionId;
                    $scope.PreAdmObj.IsEdit = false;
                    $scope.init();
                } else {
                    alertify.error("Some Error Occured");
                }
            };
            function callbackError(err) {
                alertify.error("Uploading Failed");
            }
        };

        $scope.OpenVitalsPopUp1 = function () {
            let givenVitalsArray = angular.copy($scope.PreAdmCardioObj.Vitals);
            let PerformedByArray = angular.copy($scope.PerformedByArray);
            let modalInstance = $uibModal.open({
                "templateUrl": "templates/ASC/ASCVitalsPopUp.html",
                "resolve": {
                    "VitalsArrayList": function () { return givenVitalsArray || []; },
                    "PerformedByArray": function () { return PerformedByArray || []; },
                    "allUserList": function () { return $scope.allUserList || {}; },
                    "UserId": function () { return $scope.UserId || {}; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, VitalsArrayList, PerformedByArray, allUserList, UserId) {
                    $scope.allUserList = angular.copy(allUserList);
                    $scope.AllVitalsArray = VitalsArrayList || [];
                    $scope.PerformedByArray = PerformedByArray;
                    var UserId = UserId;

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

                    $scope.VitalsObj = function () {
                        return {
                            "VitalSummaryId": 0,
                            "AppointmentId": 0,
                            "VitalAddDate": $filter('date')(new Date(), 'MM-dd-yyyy'),
                            "VitalAddTime": "",
                            "DoctorId": 0,
                            "UserName": "",
                            "DeleteInd": "N",
                            "IsEditVitalInd": false,
                            "Vitals": [
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
                                    "UnitTypeName": "/min",
                                    "OrderType": 2
                                },
                                {
                                    "AppointmentVitalDataId": 0,
                                    "VitalId": 4,
                                    "VitalDesc": "BP-Systolic",
                                    "Value": "",
                                    "UnitTypeId": 5,
                                    "UnitTypeName": "mm[Hg]",
                                    "OrderType": 3
                                },
                                {
                                    "AppointmentVitalDataId": 0,
                                    "VitalId": 5,
                                    "VitalDesc": "BP-Diastolic",
                                    "Value": "",
                                    "UnitTypeId": 5,
                                    "UnitTypeName": "mm[Hg]",
                                    "OrderType": 4
                                },
                                {
                                    "AppointmentVitalDataId": 0,
                                    "VitalId": 14,
                                    "VitalDesc": "Respiratory Rate",
                                    "Value": "",
                                    "UnitTypeId": 4,
                                    "UnitTypeName": "/min",
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
                            ]
                        };

                    }

                    $scope.onSelectTemperature = function (item, id) {
                        if (id == 2) {
                            item.UnitTypeName = "°C";
                        } else {
                            item.UnitTypeName = "°F";
                        }
                    };


                    $scope.SaveVitals = function () {
                        if ($scope.AllVitalsArray.length > 0) {
                            let VitalCount = 0;
                            let vitalarray = $filter('filter')($scope.AllVitalsArray, { "DeleteInd": "N" }, true);
                            vitalarray = vitalarray || [];
                            
                            let index = $scope.AllVitalsArray.length - 1;
                            let counter = 0;
                            angular.forEach($scope.AllVitalsArray[index].Vitals, function (hitem) {
                                if (hitem.Value != "") {
                                    counter++;
                                }
                            });
                            if (counter === 0) {
                                alertify.error("Please enter vitals!");
                                return;
                            }

                            if (vitalarray.length > 0) {
                                angular.forEach(vitalarray, function (item) {
                                    item.DoctorId = item.DoctorId || null;
                                    item.VitalAddTime = item.VitalAddTime || "";
                                    if (item.DoctorId == null) {
                                        VitalCount++;
                                    }
                                });
                            }
                            if (VitalCount > 0) {
                                alertify.error("Please select Performed By...!");
                                return false;
                            }
                        }
                        $uibModalInstance.close($scope.AllVitalsArray);
                    };

                    if ($scope.AllVitalsArray.length == 0) {
                        let vitalsobj = angular.copy($scope.VitalsObj());
                        $scope.AllVitalsArray.push(vitalsobj);
                    }

                    $scope.PerformedByName = function (id, PerformedByArray, item) {
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
                        angular.forEach(item.Vitals, function (hitem) {
                            hitem.Value = "";
                        });
                    }

                    //$scope.CopyVitals = function (item, index) {
                    //    if (index > 0) {
                    //        index = index - 1;
                    //        item.Temperature = $scope.AllVitalsArray[index].Temperature;
                    //        item.Pulse = $scope.AllVitalsArray[index].Pulse;
                    //        item.Systolic = $scope.AllVitalsArray[index].Systolic;
                    //        item.Diastolic = $scope.AllVitalsArray[index].Diastolic;
                    //        item.SPO2 = $scope.AllVitalsArray[index].SPO2;
                    //        item.BGL = $scope.AllVitalsArray[index].BGL;
                    //        item.Time = $scope.AllVitalsArray[index].Time;
                    //        item.RespRate = $scope.AllVitalsArray[index].RespRate;
                    //        item.PerformedBy = $scope.AllVitalsArray[index].PerformedBy;
                    //        item.PerformedByName = $scope.AllVitalsArray[index].PerformedByName;
                    //        item.TemperatureUnit = $scope.AllVitalsArray[index].TemperatureUnit;
                    //    }
                    //}


                    $scope.CopyVitals = function (item, index) {
                        if (index > 0) {
                            index = index - 1;

                            let vitallist = $filter('filter')($scope.allUserList, { 'DoctorID': UserId }, true);
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
                                });
                            });
                        }
                    }

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

                    $scope.GetPresentTime = function (index) {
                        $scope.AllVitalsArray[index].VitalAddTime = $filter('date')(new Date(), "hh:mm a");
                    };

                    $scope.TimeStamp = function (index,item) {
                        item.VitalAddTime = $filter('date')(new Date(), "hh:mm a");
                        if (doctorinfo.RoleID == 1 || doctorinfo.RoleID == 8 || doctorinfo.RoleID == 30 || doctorinfo.RoleID == 43 || doctorinfo.RoleID == 56 || doctorinfo.RoleID == 57) {
                            item.DoctorId = doctorinfo.doctorid;
                        }
                        var vitallist = [];
                        var vitallist = $filter("filter")(PerformedByArray, function (kitem) { return kitem.DoctorID == doctorinfo.doctorid });
                        if (vitallist.length > 0) {
                            item.UserName = angular.copy(vitallist[0].FullName);
                        }
                    }


                    $scope.ClosePopup = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                },
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                "backdrop": "static",
                //"scope": $scope,
                "keyboard": false
            });
            modalInstance.result.then(function (data) {
                $scope.PreAdmCardioObj.Vitals = angular.copy(data);

            }, function (cancel) {

            });
        };

        

        $scope.GetPreAdmissionCardiologistDetails = function () {
            let appointmentId;
            if ($scope.cacheStorageItem.AppointmentTypeId === 4 || $scope.cacheStorageItem.AppointmentTypeId === 14) {
                appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
            }
            if ($scope.cacheStorageItem.AppointmentTypeId === 7||$scope.cacheStorageItem.AppointmentTypeId === 6) {
                appointmentId = $scope.cacheStorageItem.AppointmentId;
            }
            $scope.ReqObj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": appointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                //"PatientSurgeryId": $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId,
            };
            eHnoteSurgeryService.GetPreAdmissionCardiologistDetails($scope.ReqObj).then(function (response) {
                console.log(response);
                if (response.data.status === "Success") {
                    $scope.SurgeryList = [];
                    $scope.PreAdmCardioObj = angular.copy($scope.GetPreAdmCardioObj());
                    $scope.PreAdmCardioObj.HealthArray = angular.copy($scope.HealthArray);
                    $scope.PreAdmCardioObj.LabObj = angular.copy($scope.GetLabObj());
                    $scope.PreAdmCardioObj.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());
                    $scope.PreAdmCardioObj.APAnesthesiaOptionsObj = angular.copy($scope.GetAPAnesthesiaOptionsObj());
                    if (response.data.SurgeryArray.length > 0) {

                        angular.forEach(response.data.SurgeryArray, function (item) {
                            let obj = {
                                "OrgSurgeryId": item.OrganizationSurgeryId,
                                "SurgeryId": item.SurgeryId,
                                "SurgeryListId": item.SurgeryListId,
                                "PatientSurgeryId": item.PatientSurgeryId,
                                "AppointmentId": item.AppointmentId,
                                "DeleteInd": "N",
                            };
                            $scope.SurgeryList.push(obj);
                        });

                        let temparray1 = $filter('filter')($scope.allUserList, { 'DoctorID': response.data.SurgeryArray[0].ExternalCoManagerId }, true);
                        if (temparray1.length > 0) {
                            $scope.PatientDetailsObj.ExternalCoManager = temparray1[0].FullName;
                        }

                        let temparray2 = $filter('filter')($scope.allUserList, { 'DoctorID': response.data.SurgeryArray[0].InternalCoManagerId }, true);
                        if (temparray2.length > 0) {
                            $scope.PatientDetailsObj.InternalCoManager = temparray2[0].FullName;
                        }

                        $scope.SurgeryDiagnosisObj.OperativeProcedure = response.data.SurgeryArray[0].SurgeryName;
                        // $scope.SurgeryDiagnosisObj.SurgeryDate = item.SurgerySuggestedDate; // not the suggested date but bind appt date 
                        $scope.SurgeryDiagnosisObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
                        $scope.SurgeryDiagnosisObj.OrganizationSurgeryId = response.data.SurgeryArray[0].OrganizationSurgeryId;
                        $scope.SurgeryDiagnosisObj.SurgeryId = response.data.SurgeryArray[0].SurgeryId;
                        response.data.SurgeryArray[0].DiagnosisList = response.data.SurgeryArray[0].DiagnosisList || [];
                        if (response.data.SurgeryArray[0].DiagnosisList.length > 0) {
                            $scope.SurgeryDiagnosisObj.Diagnosis = response.data.SurgeryArray[0].DiagnosisList[0].DiagnosisName;
                            $scope.SurgeryDiagnosisObj.OrganizationDiagnosisId = response.data.SurgeryArray[0].DiagnosisList[0].OrganizationDiagnosisId;
                            $scope.SurgeryDiagnosisObj.DiagnosisId = response.data.SurgeryArray[0].DiagnosisList[0].DiagnosisId;
                        }

                        $scope.SurgeryDiagnosisObj.Diagnosis2 = $scope.SurgeryDiagnosisObj.Diagnosis2 || "";
                        if (response.data.SurgeryArray[0].DiagnosisList.length > 1) {
                            $scope.SurgeryDiagnosisObj.Diagnosis2 = response.data.SurgeryArray[0].DiagnosisList[1].DiagnosisName;
                        }

                        let temparray3 = $filter('filter')($scope.allUserList, { 'DoctorID': response.data.SurgeryArray[0].DoctorID }, true);
                        if (temparray3.length > 0) {
                            $scope.SurgeryDiagnosisObj.Surgeon = temparray3[0].FullName;
                        } else {
                            $scope.SurgeryDiagnosisObj.Surgeon = "";
                        }
                    }

                    if (response.data.CardiologistDetails.length > 0) {
                        $scope.PreAdmissionDetails = angular.copy(response.data.CardiologistDetails[0]);

                        $scope.PreAdmCardioObj.StatusFlag = $scope.PreAdmissionDetails.StatusFlag;
                        $scope.PreAdmCardioObj.PreAdmissionChartStatus = $scope.PreAdmissionDetails.PreAdmissionChartStatus;

                        if ($scope.PreAdmissionDetails !== undefined) {

                            $scope.PreAdmCardioObj.PreAdmissionId = $scope.PreAdmissionDetails.PreAdmissionId;
                            $scope.PreAdmCardioObj.PreAdmissionApptId = $scope.PreAdmissionDetails.AppointmentId;
                            $scope.PreAdmCardioObj.PreAdmissionApptDate = $filter('date')($scope.PreAdmissionDetails.AppointmentDate, "MM-dd-yyyy");

                            $scope.PreAdmCardioObj.SystemicHistory = angular.copy($scope.PreAdmissionDetails.SystemicHistory);
                            $scope.PreAdmCardioObj.SurgicalHistory = angular.copy($scope.PreAdmissionDetails.SurgicalHistory);
                            $scope.PreAdmCardioObj.AllergyItems = angular.copy($scope.PreAdmissionDetails.AllergyItems);

                            if ($scope.PreAdmissionDetails.Vitals.length > 0) {
                                angular.forEach($scope.PreAdmissionDetails.Vitals, function (vitem) {
                                    var vitallist = [];
                                    var vitallist = $filter("filter")($scope.PerformedByArray, function (kitem) { return kitem.DoctorID == vitem.PerformedBy });
                                    if (vitallist.length > 0) {
                                        vitem.PerformedByName = angular.copy(vitallist[0].FullName);
                                    }
                                });
                                $scope.PreAdmCardioObj.Vitals = angular.copy($scope.PreAdmissionDetails.Vitals);
                            } else {
                                $scope.PreAdmCardioObj.Vitals = [];
                                //$scope.VitalsObj = angular.copy($scope.GetVitalsObj());
                                //$scope.Vitals.push($scope.VitalsObj);
                            }

                            $scope.PreAdmCardioObj.ROSOverAllRemarks = angular.copy($scope.PreAdmissionDetails.ROSOverAllRemarks);

                            if ($scope.PreAdmCardioObj.ROSOverAllRemarks != "" || $scope.PreAdmCardioObj.ROSOverAllRemarks != null) {
                                $scope.PreAdmissionSummaryObj1.IsROSOverAllRemarksInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj1.IsROSOverAllRemarksInd = false;
                            }

                            $scope.PreAdmCardioObj.LabObj = $scope.GetLabObj();
                            $scope.PreAdmCardioObj.LabObj.HGB = $scope.PreAdmissionDetails.LabTest.HGB;
                            $scope.PreAdmCardioObj.LabObj.HCT = $scope.PreAdmissionDetails.LabTest.HCT;
                            $scope.PreAdmCardioObj.LabObj.WBC = $scope.PreAdmissionDetails.LabTest.WBC;
                            $scope.PreAdmCardioObj.LabObj.RBC = $scope.PreAdmissionDetails.LabTest.RBC;
                            $scope.PreAdmCardioObj.LabObj.A1C = $scope.PreAdmissionDetails.LabTest.A1C;
                            $scope.PreAdmCardioObj.LabObj.Creatinine = $scope.PreAdmissionDetails.LabTest.Creatinine;
                            $scope.PreAdmCardioObj.LabObj.IsBloodAvailable = $scope.PreAdmissionDetails.LabTest.IsBloodAvailable;
                            $scope.PreAdmCardioObj.LabObj.UrineAnalysis = $scope.PreAdmissionDetails.LabTest.UrineAnalysis;
                            $scope.PreAdmCardioObj.LabObj.IsPretransfusion = $scope.PreAdmissionDetails.LabTest.IsPretransfusion;
                            $scope.PreAdmCardioObj.LabObj.RBS = $scope.PreAdmissionDetails.LabTest.RBS;
                            $scope.PreAdmCardioObj.LabObj.FBS = $scope.PreAdmissionDetails.LabTest.FBS;
                            $scope.PreAdmCardioObj.LabObj.PBBS = $scope.PreAdmissionDetails.LabTest.PBBS;
                            $scope.PreAdmCardioObj.LabObj.PBLS = $scope.PreAdmissionDetails.LabTest.PBLS;
                            $scope.PreAdmCardioObj.LabObj.Others = $scope.PreAdmissionDetails.LabTest.Others;
                            $scope.PreAdmCardioObj.LabObj.Notes = $scope.PreAdmissionDetails.LabTest.Notes || "";
                            if ($scope.PreAdmissionDetails.LabTest.TestArray.length > 0) {
                                $scope.PreAdmCardioObj.LabObj.LabTestArray = $scope.PreAdmissionDetails.LabTest.TestArray;
                            }

                            $scope.PreAdmissionDetails.CardioVascular = $scope.PreAdmissionDetails.CardioVascular || "";
                            if ($scope.PreAdmissionDetails.CardioVascular != "") {
                                $scope.PreAdmCardioObj.CardioVascularObj.Systolic = $scope.PreAdmissionDetails.CardioVascular.Systolic;
                                $scope.PreAdmCardioObj.CardioVascularObj.Diastolic = $scope.PreAdmissionDetails.CardioVascular.Diastolic;
                                $scope.PreAdmCardioObj.CardioVascularObj.PR = $scope.PreAdmissionDetails.CardioVascular.PR;
                                $scope.PreAdmCardioObj.CardioVascularObj.ECG = $scope.PreAdmissionDetails.CardioVascular.ECG;
                                $scope.PreAdmCardioObj.CardioVascularObj.ECGUnits = $scope.PreAdmissionDetails.CardioVascular.ECGUnits;
                                $scope.PreAdmCardioObj.CardioVascularObj.Notes = $scope.PreAdmissionDetails.CardioVascular.Notes || "";
                            }

                            $scope.PreAdmissionDetails.Airway = $scope.PreAdmissionDetails.Airway || '';
                            if ($scope.PreAdmissionDetails.Airway != '') {
                                $scope.PreAdmCardioObj.AirwayObj.ROMTMS = $scope.PreAdmissionDetails.Airway.ROMTMS;
                                $scope.PreAdmCardioObj.AirwayObj.ROMNECKLAT = $scope.PreAdmissionDetails.Airway.ROMNECKLAT;
                                $scope.PreAdmCardioObj.AirwayObj.ROMNECKAP = $scope.PreAdmissionDetails.Airway.ROMNECKAP;
                                $scope.PreAdmCardioObj.AirwayObj.Notes = $scope.PreAdmissionDetails.Airway.Notes || "";
                                $scope.PreAdmCardioObj.AirwayObj.IsNormal = $scope.PreAdmissionDetails.Airway.IsNormal;
                                $scope.PreAdmCardioObj.AirwayObj.Class = $scope.PreAdmissionDetails.Airway.Class;
                                $scope.PreAdmCardioObj.AirwayObj.Dentition = $scope.PreAdmissionDetails.Airway.Dentition;
                            }

                            $scope.PreAdmCardioObj.HealthArray = angular.copy($scope.HealthArray);
                            angular.forEach($scope.PreAdmCardioObj.HealthArray, function (item) {
                                let temparray = $filter('filter')($scope.PreAdmissionDetails.HealthArray, { "id": item.Id }, true);
                                if (temparray.length > 0) {
                                    item.IsChecked = temparray[0].IsChecked;
                                }
                                else {
                                    item.IsChecked = null;
                                }
                            });

                            $scope.PreAdmCardioObj.IsCardiacWNL = $scope.PreAdmissionDetails.IsCardiacWNL;
                            $scope.PreAdmCardioObj.IsCNSHistory = $scope.PreAdmissionDetails.IsCNSHistory;
                            $scope.PreAdmCardioObj.IsAutoImmuneDisordersWNL = $scope.PreAdmissionDetails.IsAutoImmuneDisordersWNL;
                            $scope.PreAdmCardioObj.IsEndocrineWNL = $scope.PreAdmissionDetails.IsEndocrineWNL;
                            $scope.PreAdmCardioObj.IsHemeOncWNL = $scope.PreAdmissionDetails.IsHemeOncWNL;
                            $scope.PreAdmCardioObj.IsHepaticWNL = $scope.PreAdmissionDetails.IsHepaticWNL;
                            $scope.PreAdmCardioObj.IsKidneyDiseaseWNL = $scope.PreAdmissionDetails.IsKidneyDiseaseWNL;
                            $scope.PreAdmCardioObj.IsMusculoSkeletalSystemWNL = $scope.PreAdmissionDetails.IsMusculoSkeletalSystemWNL;
                            $scope.PreAdmCardioObj.IsNervousSystemWNL = $scope.PreAdmissionDetails.IsNervousSystemWNL;
                            $scope.PreAdmCardioObj.IsNeurologicWNL = $scope.PreAdmissionDetails.IsNeurologicWNL;
                            $scope.PreAdmCardioObj.IsOthersWNL = $scope.PreAdmissionDetails.IsOthersWNL;
                            $scope.PreAdmCardioObj.IsPsychosisWNL = $scope.PreAdmissionDetails.IsPsychosisWNL;
                            $scope.PreAdmCardioObj.IsPulmonaryWNL = $scope.PreAdmissionDetails.IsPulmonaryWNL;
                            $scope.PreAdmCardioObj.IsRespiratoryNormal = $scope.PreAdmissionDetails.IsRespiratoryNormal;

                            $scope.PreAdmCardioObj.SocialNotes = $scope.PreAdmissionDetails.SocialNotes || "";
                            $scope.PreAdmCardioObj.RespiratoryNotes = $scope.PreAdmissionDetails.RespiratoryNotes || "";
                            $scope.PreAdmCardioObj.PulmonaryNotes = $scope.PreAdmissionDetails.PulmonaryNotes || "";
                            $scope.PreAdmCardioObj.PsychosisNotes = $scope.PreAdmissionDetails.PsychosisNotes || "";
                            $scope.PreAdmCardioObj.OthersNotes = $scope.PreAdmissionDetails.OthersNotes || "";
                            $scope.PreAdmCardioObj.NeurologicNotes = $scope.PreAdmissionDetails.NeurologicNotes || "";
                            $scope.PreAdmCardioObj.NervousSystemNotes = $scope.PreAdmissionDetails.NervousSystemNotes || "";
                            $scope.PreAdmCardioObj.MusculoSkeletalSystemNotes = $scope.PreAdmissionDetails.MusculoSkeletalSystemNotes || "";
                            $scope.PreAdmCardioObj.KidneyDiseaseNotes = $scope.PreAdmissionDetails.KidneyDiseaseNotes || "";
                            $scope.PreAdmCardioObj.HepaticNotes = $scope.PreAdmissionDetails.HepaticNotes || "";
                            $scope.PreAdmCardioObj.HemeOncNotes = $scope.PreAdmissionDetails.HemeOncNotes || "";
                            $scope.PreAdmCardioObj.EndocrineNotes = $scope.PreAdmissionDetails.EndocrineNotes || "";
                            $scope.PreAdmCardioObj.CardiacNotes = $scope.PreAdmissionDetails.CardiacNotes || "";
                            $scope.PreAdmCardioObj.CNSNotes = $scope.PreAdmissionDetails.CNSNotes || "";
                            $scope.PreAdmCardioObj.AutoImmuneDisordersNotes = $scope.PreAdmissionDetails.AutoImmuneDisordersNotes || "";

                            $scope.PreAdmCardioObj.IsHeentWNL = $scope.PreAdmissionDetails.IsHeentWNL;
                            $scope.PreAdmCardioObj.IsLungsWNL = $scope.PreAdmissionDetails.IsLungsWNL;
                            $scope.PreAdmCardioObj.HeentNotes = $scope.PreAdmissionDetails.HeentNotes || "";
                            $scope.PreAdmCardioObj.LungsNotes = $scope.PreAdmissionDetails.LungsNotes || "";

                            $scope.PreAdmCardioObj.CurrentMedicationList = angular.copy($scope.PreAdmissionDetails.CurrentMedicationList);
                            $scope.PreAdmCardioObj.MedicationsList = angular.copy($scope.PreAdmissionDetails.MedicationsList);
                            $scope.PreAdmCardioObj.InvestigationsList = angular.copy($scope.PreAdmissionDetails.InvestigationsList);

                            $scope.PreAdmCardioObj.ReviewedBy = $scope.PreAdmissionDetails.ReviwedBy;

                            if ($scope.PreAdmissionDetails.HealthArray.length > 0) {
                                $scope.GetHealthAdvancedData1($scope.PreAdmissionDetails.HealthArray);

                                $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistMainInd = true;
                                $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistHealthPlanInd = true;
                            }
                            else if (!$scope.PreAdmissionDetails.IsCardiacWNL && !$scope.PreAdmissionDetails.IsCNSHistory && !$scope.PreAdmissionDetails.IsAutoImmuneDisordersWNL && !$scope.PreAdmissionDetails.IsEndocrineWNL && !$scope.PreAdmissionDetails.IsHemeOncWNL && !$scope.PreAdmissionDetails.IsHepaticWNL && !$scope.PreAdmissionDetails.IsPulmonaryWNL
                                && !$scope.PreAdmissionDetails.IsKidneyDiseaseWNL && !$scope.PreAdmissionDetails.IsMusculoSkeletalSystemWNL && !$scope.PreAdmissionDetails.IsNervousSystemWNL && !$scope.PreAdmissionDetails.IsNeurologicWNL && !$scope.PreAdmissionDetails.IsOthersWNL && !$scope.PreAdmissionDetails.IsPsychosisWNL && !$scope.PreAdmissionDetails.IsRespiratoryNormal) {

                                $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistMainInd = false;
                                $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistHealthPlanInd = false;
                            }


                            if ($scope.PreAdmCardioObj.APAnesthesiaOptionsObj.AnesthetistId != '') {
                                let Anesthetistlist = $filter("filter")($scope.AnesthetistArray, function (kitem) { return kitem.DoctorID == $scope.PreAdmCardioObj.APAnesthesiaOptionsObj.AnesthetistId });

                                Anesthetistlist = Anesthetistlist || [];
                                if (Anesthetistlist.length > 0) {
                                    $scope.PreAdmCardioObj.APAnesthesiaOptionsObj.AnesthetistName = Anesthetistlist[0].FullName;
                                }
                            }

                            //if ($scope.PreAdmissionDetails.PreAdmissionId !== 0 && !$scope.PreAdmObj.IsEdit) {
                            //    $scope.PreAdmObj.IsShow = false;
                            //    $scope.PreAdmObj.IsShowPreAdmissionSummaryView = true;
                            //}
                            //else if ($scope.PreAdmissionDetails.PreAdmissionId == 0) {
                            //    $scope.PreAdmObj.IsShow = true;
                            //    $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;
                            //}
                            //else if ($scope.PreAdmissionDetails.PreAdmissionId != 0 && $scope.PreAdmObj.IsEdit) {
                            //    $scope.PreAdmObj.IsShow = true;
                            //    $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;
                            //}
                        }

                        $scope.PreAdmCardioObj.PreAdmissionStatusId = $scope.PreAdmissionDetails.PreAdmissionStatusId;
                        
                        $scope.FilesObj.TempImagesArray = [];


                        if ($scope.PreAdmissionDetails.Vitals.length > 0) {
                            $scope.PreAdmissionSummaryObj1.IsPreadmVitalsInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreadmVitalsInd = false;
                        }

                        $scope.PreAdmissionDetails.AllergyItems = $scope.PreAdmissionDetails.AllergyItems || [];
                        if ($scope.PreAdmissionDetails.AllergyItems.length > 0) {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmROSAllergiesInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmROSAllergiesInd = false;
                        }
                        $scope.PreAdmissionDetails.SystemicHistory = $scope.PreAdmissionDetails.SystemicHistory || [];
                        if ($scope.PreAdmissionDetails.SystemicHistory.length > 0) {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmROSSystemicInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmROSSystemicInd = false;
                        }

                        $scope.PreAdmissionDetails.SurgicalHistory = $scope.PreAdmissionDetails.SurgicalHistory || [];
                        if ($scope.PreAdmissionDetails.SurgicalHistory.length > 0) {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmROSSurgicalInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmROSSurgicalInd = false;
                        }
                        $scope.PreAdmissionDetails.MedicationsList = $scope.PreAdmissionDetails.MedicationsList || [];
                        if ($scope.PreAdmissionDetails.MedicationsList.length > 0) {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryMedicationsInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryMedicationsInd = false;
                        }
                        $scope.PreAdmissionDetails.CurrentMedicationList = $scope.PreAdmissionDetails.CurrentMedicationList || [];
                        if ($scope.PreAdmissionDetails.CurrentMedicationList.length > 0) {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmCurrentMedicationsInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmCurrentMedicationsInd = false;
                        }
                        $scope.PreAdmissionDetails.InvestigationsList = $scope.PreAdmissionDetails.InvestigationsList || [];
                        if ($scope.PreAdmissionDetails.InvestigationsList.length > 0) {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmLabsInvestigationsInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmLabsInvestigationsInd = false;
                        }

                        if ($scope.PreAdmissionSummaryObj1.IsPreAdmLabsInvestigationsInd || $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryMedicationsInd || $scope.PreAdmissionSummaryObj1.IsPreAdmCurrentMedicationsInd) {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryOrdersMainInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryOrdersMainInd = false;
                        }


                        if ($scope.PreAdmCardioObj.LabObj.HGB == "" && $scope.PreAdmCardioObj.LabObj.HCT == "" && $scope.PreAdmCardioObj.LabObj.WBC == "" && $scope.PreAdmCardioObj.LabObj.RBC == "" && $scope.PreAdmCardioObj.LabObj.A1C == "" && $scope.PreAdmCardioObj.LabObj.Creatinine == "" &&
                            $scope.PreAdmCardioObj.LabObj.RBS == "" && $scope.PreAdmCardioObj.LabObj.FBS == "" && $scope.PreAdmCardioObj.LabObj.PBBS == "" && $scope.PreAdmCardioObj.LabObj.PBLS == "" && $scope.PreAdmCardioObj.LabObj.Notes == "") {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationLabInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationLabInd = true;
                        }

                        if ($scope.PreAdmCardioObj.CardioVascularObj.Systolic == "" && $scope.PreAdmCardioObj.CardioVascularObj.Diastolic == "" && $scope.PreAdmCardioObj.CardioVascularObj.PR == "" && $scope.PreAdmCardioObj.CardioVascularObj.ECG == "" && $scope.PreAdmCardioObj.CardioVascularObj.ECGUnits == "" &&
                            $scope.PreAdmCardioObj.CardioVascularObj.Notes == "") {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationCardioInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationCardioInd = true;
                        }

                        if ($scope.PreAdmCardioObj.AirwayObj.ROMTMS == "" && $scope.PreAdmCardioObj.AirwayObj.ROMNECKLAT == "" && $scope.PreAdmCardioObj.AirwayObj.ROMNECKAP == "" && !$scope.PreAdmCardioObj.AirwayObj.IsNormal &&
                            $scope.PreAdmCardioObj.AirwayObj.Notes == "" && $scope.PreAdmCardioObj.AirwayObj.Class == "") {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationAirwayInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationAirwayInd = true;
                        }

                        if ($scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationAirwayInd || $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationCardioInd || $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationLabInd) {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmEvaluationMainInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmEvaluationMainInd = false;
                        }

                        if ($scope.PreAdmissionSummaryObj1.IsPrAdmROSAllergiesInd || $scope.PreAdmissionSummaryObj1.IsPrAdmROSSurgicalInd || $scope.PreAdmissionSummaryObj1.IsPrAdmROSSystemicInd) {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmROSMainInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmROSMainInd = false;
                        }

                        if ($scope.PreAdmissionDetails.CurrentMedicationList.length > 0) {
                            $scope.IsContinuationMedication = false;
                            $scope.IsStopMedication = false;
                            angular.forEach($scope.PreAdmissionDetails.CurrentMedicationList, function (item) {
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

                        //let SelectedSurgeryList = $filter('filter')(response.data.SurgeryArray, { 'PatientSurgeryId': $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId }, true);

                        let SelectedSurgeryList = angular.copy(response.data.SurgeryArray);

                        SelectedSurgeryList = SelectedSurgeryList || [];

                        $scope.SelectedSurgeryArray = [];

                        if (SelectedSurgeryList.length > 0) {
                            angular.forEach(SelectedSurgeryList, function (item) {
                                let obj = {
                                    "SurgeryName": item.SurgeryName,
                                    "SurgerySuggestedDate": $filter('date')(item.SurgerySuggestedDate, "MM-dd-yyyy"),
                                    "PreAdmissionStatusId": $scope.PreAdmissionDetails.PreAdmissionStatusId,
                                    "AnesthetistName": $scope.PreAdmCardioObj.APAnesthesiaOptionsObj.AnesthetistName,
                                };
                                $scope.SelectedSurgeryArray.push(obj);
                            });
                        }

                        if ($scope.PreAdmissionDetails.DocumentDetails.length > 0) {
                            $scope.PreAdmCardioObj.DocumentDetails = angular.copy($scope.PreAdmissionDetails.DocumentDetails);
                        }
                        else {
                            $scope.PreAdmCardioObj.DocumentDetails = [];
                        }

                    } else {

                        $scope.PreAdmCardioObj = angular.copy($scope.GetPreAdmCardioObj());
                        $scope.PreAdmCardioObj.LabObj = angular.copy($scope.GetLabObj());
                        $scope.PreAdmCardioObj.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());
                        $scope.PreAdmCardioObj.HealthArray = $scope.HealthArray || [];

                        response.data.SurgeryArray = response.data.SurgeryArray || [];
                        if (response.data.SurgeryArray.length > 0) {
                            let temparray3 = $filter('filter')($scope.allUserList, { 'DoctorID': response.data.SurgeryArray[0].DoctorID }, true);
                            if (temparray3.length > 0) {
                                $scope.SurgeryDiagnosisObj.Surgeon = temparray3[0].FullName;
                                // $scope.SurgeryDiagnosisObj.SurgeryDate = item.SurgerySuggestedDate; // not the suggested date but bind appt date 
                                $scope.SurgeryDiagnosisObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
                                response.data.SurgeryArray[0].DiagnosisList = response.data.SurgeryArray[0].DiagnosisList || [];
                                $scope.SurgeryDiagnosisObj.Diagnosis = response.data.SurgeryArray[0].DiagnosisList.length > 0 ? response.data.SurgeryArray[0].DiagnosisList[0].DiagnosisName : '';
                                $scope.SurgeryDiagnosisObj.Diagnosis2 = response.data.SurgeryArray[0].DiagnosisList.length > 1 ? response.data.SurgeryArray[0].DiagnosisList[1].DiagnosisName : '';
                                $scope.SurgeryDiagnosisObj.OperativeProcedure = response.data.SurgeryArray[0].SurgeryName;
                            } else {
                                $scope.SurgeryDiagnosisObj.Surgeon = "";
                            }
                        }

                        if ($scope.PreAdmSurgeryList.length > 0) {
                            angular.forEach($scope.PreAdmSurgeryList, function (item) {
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

                        $scope.PreAdmissionSummaryObj1.IsPreadmVitalsInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmROSMainInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmROSSystemicInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmROSSurgicalInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmROSAllergiesInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmEvaluationMainInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationLabInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationCardioInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationAirwayInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistMainInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistHealthPlanInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryOrdersMainInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryMedicationsInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmCurrentMedicationsInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmLabsInvestigationsInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmAnesthetistPlanMainInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmPreviousAnestheticInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmAssessmentASAInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmAnestheticPlanInd = false;

                        $scope.PreAdmObj.IsShow = true;
                        $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;
                        $scope.AllAnesthetistList = [];
                        $scope.AllCardiologistList = [];
                        if ($scope.allUserList.length > 0) {
                            angular.forEach($scope.allUserList, function (item) {
                                if (item.RoleId == 30 || item.RoleId == 8 || item.DoctorID == $scope.UserId) {
                                    $scope.AllAnesthetistList.push(item);
                                }
                              /*  item.RoleId == 72 || item.DoctorID == $scope.UserId*/
                                if (item.RoleId == 72 || item.RoleId == 8 || item.RoleId == 1 || item.RoleId == 43 || item.RoleId == 16 ) {
                                    $scope.AllCardiologistList.push(item);
                                }
                            })
                        };
                        if ($scope.PreAdmObj.IsEdit == true) {
                            $scope.PreAdmAnesthetistObj.ReviewedBy = $scope.PreAdmAnesthetistObj.ReviewedBy || 0;
                            $scope.PreAdmCardioObj.ReviewedBy = $scope.PreAdmCardioObj.ReviewedBy || 0;
                        }
                        else {
                            $scope.PreAdmAnesthetistObj.ReviewedBy = $scope.UserId || 0;
                            $scope.PreAdmCardioObj.ReviewedBy = $scope.UserId || 0;
                        }
                        //let SelectedSurgeryList = $filter('filter')(response.data.SurgeryArray, { 'PatientSurgeryId': $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId }, true);
                        let SelectedSurgeryList = angular.copy(response.data.SurgeryArray);
                        SelectedSurgeryList = SelectedSurgeryList || [];
                        $scope.SelectedSurgeryArray = [];
                        if (SelectedSurgeryList.length > 0) {
                            angular.forEach(SelectedSurgeryList, function (item) {
                                let obj = {
                                    "SurgeryName": item.SurgeryName,
                                };
                                $scope.SelectedSurgeryArray.push(obj);
                            });
                        }
                    }
                }
            }, function (err) {
                console.log(err);
            });
        };

        $scope.SelectTMS1 = function (val) {
            if (val === 1) {

                $scope.PreAdmCardioObj.AirwayObj.ROMTMS = "Full";
            }
            if (val === 2) {
                $scope.PreAdmCardioObj.AirwayObj.ROMTMS = "Limited";
            }
        };

        $scope.RomNeckAP1 = function (val) {
            if (val === 1) {
                $scope.PreAdmCardioObj.AirwayObj.ROMNECKAP = "Full";
            }
            if (val === 2) {
                $scope.PreAdmCardioObj.AirwayObj.ROMNECKAP = "Limited";
            }
        };

        $scope.RomNeckLAT1 = function (val) {
            if (val === 1) {
                $scope.PreAdmCardioObj.AirwayObj.ROMNECKLAT = "Full";
            }
            if (val === 2) {
                $scope.PreAdmCardioObj.AirwayObj.ROMNECKLAT = "Limited";
            }
        };

        $scope.SelectClass1 = function (val) {
            if (val === 1) {
                $scope.PreAdmCardioObj.AirwayObj.Class = "1";
            }
            if (val === 2) {
                $scope.PreAdmCardioObj.AirwayObj.Class = "2";
            }
            if (val === 3) {
                $scope.PreAdmCardioObj.AirwayObj.Class = "3";
            }
            if (val === 4) {
                $scope.PreAdmCardioObj.AirwayObj.Class = "4";
            }
        };

        $scope.OnClickNormalCardio = function () {
            if ($scope.PreAdmCardioObj.AirwayObj.IsNormal) {
                $scope.PreAdmCardioObj.AirwayObj.ROMTMS = "Full";
                $scope.PreAdmCardioObj.AirwayObj.ROMNECKAP = "Full";
                $scope.PreAdmCardioObj.AirwayObj.ROMNECKLAT = "Full";
            } else {
                $scope.PreAdmCardioObj.AirwayObj.ROMTMS = "";
                $scope.PreAdmCardioObj.AirwayObj.ROMNECKAP = "";
                $scope.PreAdmCardioObj.AirwayObj.ROMNECKLAT = "";
                //$scope.PreAdmCardioObj.AirwayObj.Class = "";
            }
        };

        $scope.OnClickRespiratoryNormal1 = function () {

            if ($scope.PreAdmCardioObj.IsRespiratoryNormal) {
                angular.forEach($scope.PreAdmCardioObj.HealthArray, function (kitem) {
                    if (kitem.CategoryId == 13) {
                        kitem.IsChecked = false;
                    }
                });
            }
        };


        $scope.medicationcordinatorclick1 = function (Type) {
            Type = Type || 'PreSurgery';
            let initObj = {
                "CurrentMedicationList": $scope.PreAdmCardioObj.CurrentMedicationList || [],
                "MedicationsList": $scope.PreAdmCardioObj.MedicationsList || [],
                "InvestigationsList": $scope.PreAdmCardioObj.InvestigationsList || [],
                "PatientId": $scope.cacheStorageItem.PatientID,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                "DoctorId": $scope.SurgeryDiagnosisObj.SelectedSurgery.DoctorId,
                "PrescriptionDetails": $scope.PreAdmCardioObj.PrescriptionDetails || []
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
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
            });

            $scope.mInstancecoordinationAdd.result.then(function (resp) {
                if (resp.PreMedicationslist.length !== 0) {
                    $scope.PreAdmCardioObj.MedicationsList = resp.PreMedicationslist || [];
                } else {
                    $scope.PreAdmCardioObj.MedicationsList = [];
                }
                if (resp.CurrentMedicationslist.length !== 0) {
                    $scope.PreAdmCardioObj.CurrentMedicationList = resp.CurrentMedicationslist || [];

                    $scope.IsContinuationMedication = false;
                    $scope.IsStopMedication = false;
                    angular.forEach($scope.PreAdmCardioObj.CurrentMedicationList, function (item) {
                        if (item.DeleteInd == "N") {
                            if (item.MedicationType == 'Continuation') {
                                $scope.IsContinuationMedication = true;
                            }
                            if (item.MedicationType == 'Stop') {
                                $scope.IsStopMedication = true;
                            }
                        }
                        item.StartDate = item.FromDate;
                        item.StopDate = item.ToDate;
                    });
                } else {
                    $scope.PreAdmCardioObj.CurrentMedicationList = [];
                }
                if (resp.Investigationslist.length !== 0) {
                    $scope.PreAdmCardioObj.InvestigationsList = resp.Investigationslist || [];
                } else {
                    $scope.PreAdmCardioObj.InvestigationsList = [];
                }

                if (resp.PrescriptionMainAddObj.PrescriptionDetails.length !== 0) {
                    $scope.PreAdmCardioObj.PrescriptionDetails = [];
                    $scope.PreAdmCardioObj.PrescriptionDetails.push(resp.PrescriptionMainAddObj);
                } else {
                    $scope.PreAdmCardioObj.PrescriptionDetails = [];
                }

            }, function () { });
        };

        $scope.GetPrevROSData1 = function (val) {

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
                        tempSystemicArray = angular.copy($scope.PreAdmCardioObj.SystemicHistory);
                        if (tempSystemicArray.length > 0) {
                            if (response.data.rows[0].SystemicHistory.length > 0) {
                                angular.forEach(response.data.rows[0].SystemicHistory, function (item) {
                                    angular.forEach(tempSystemicArray, function (kitem) {
                                        if (kitem.HistoryId !== item.HistoryId) {
                                            let tempArray = $filter('filter')($scope.PreAdmCardioObj.SystemicHistory, { 'HistoryId': item.HistoryId }, true);
                                            if (tempArray.length == 0) {
                                                $scope.PreAdmCardioObj.SystemicHistory.push(item);
                                            }
                                        } else if (kitem.HistoryId == item.HistoryId) {
                                            let index = $scope.PreAdmCardioObj.SystemicHistory.findIndex((x) => x.HistoryId == kitem.HistoryId);
                                            if (index > -1) {
                                                $scope.PreAdmCardioObj.SystemicHistory[index].ActiveInd = true;
                                                $scope.PreAdmCardioObj.SystemicHistory[index].DeleteInd = "N";
                                            }
                                        }
                                    });
                                });
                            }
                        } else {
                            $scope.PreAdmCardioObj.SystemicHistory = angular.copy(response.data.rows[0].SystemicHistory);
                        }
                    }
                    if (val === 2) {

                        angular.forEach(response.data.rows[0].SurgicalHistory, function (item) {
                            item.PatientDetailId = 0;
                        });

                        let tempSurgicalArray = [];
                        tempSurgicalArray = angular.copy($scope.PreAdmCardioObj.SurgicalHistory);
                        if (tempSurgicalArray.length > 0) {
                            if (response.data.rows[0].SurgicalHistory.length > 0) {
                                angular.forEach(response.data.rows[0].SurgicalHistory, function (item) {
                                    angular.forEach(tempSurgicalArray, function (kitem) {
                                        if (kitem.HistoryId !== item.HistoryId) {
                                            let tempArray = $filter('filter')($scope.PreAdmCardioObj.SurgicalHistory, { 'HistoryId': item.HistoryId }, true);
                                            if (tempArray.length == 0) {
                                                $scope.PreAdmCardioObj.SurgicalHistory.push(item);
                                            }

                                        } else if (kitem.HistoryId == item.HistoryId) {
                                            let index = $scope.PreAdmCardioObj.SurgicalHistory.findIndex((x) => x.HistoryId == kitem.HistoryId);
                                            if (index > -1) {
                                                $scope.PreAdmCardioObj.SurgicalHistory[index].ActiveInd = true;
                                                $scope.PreAdmCardioObj.SurgicalHistory[index].DeleteInd = "N";
                                            }
                                        }
                                    });
                                });
                            }
                        } else {
                            $scope.PreAdmCardioObj.SurgicalHistory = angular.copy(response.data.rows[0].SurgicalHistory);
                        }
                    }
                    if (val === 3) {

                        angular.forEach(response.data.rows[0].Allergy, function (item) {
                            item.PatientDetailId = 0;
                        });

                        let tempAllergyArray = [];
                        tempAllergyArray = angular.copy($scope.PreAdmCardioObj.AllergyItems);
                        if (tempAllergyArray.length > 0) {
                            if (response.data.rows[0].Allergy.length > 0) {
                                angular.forEach(response.data.rows[0].Allergy, function (item) {
                                    angular.forEach(tempAllergyArray, function (kitem) {
                                        if (kitem.AllergyId !== item.AllergyId) {
                                            let tempArray = $filter('filter')($scope.PreAdmCardioObj.AllergyItems, { 'AllergyId': item.AllergyId }, true);
                                            if (tempArray.length == 0) {
                                                $scope.PreAdmCardioObj.AllergyItems.push(item);
                                            }

                                        } else if (kitem.AllergyId == item.AllergyId) {
                                            let index = $scope.PreAdmCardioObj.AllergyItems.findIndex((x) => x.AllergyId == kitem.AllergyId);
                                            if (index > -1) {
                                                $scope.PreAdmCardioObj.AllergyItems[index].ActiveInd = true;
                                                $scope.PreAdmCardioObj.AllergyItems[index].DeleteInd = "N";
                                            }
                                        }
                                    });
                                });
                            }
                        } else {
                            $scope.PreAdmCardioObj.AllergyItems = angular.copy(response.data.rows[0].Allergy);
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
                            "SystemicHistory1": function () { return $scope.PreAdmCardioObj.SystemicHistory; },
                            "SurgicalHistory1": function () { return $scope.PreAdmCardioObj.SurgicalHistory; },
                            "AllergyItems1": function () { return $scope.PreAdmCardioObj.AllergyItems; },
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
                        $scope.PreAdmCardioObj.AllergyItems = angular.copy(result.AllergyItems);
                        $scope.PreAdmCardioObj.SystemicHistory = angular.copy(result.SystemicHistory);
                        $scope.PreAdmCardioObj.SurgicalHistory = angular.copy(result.SurgicalHistory);

                    }, function () { });
                }
            }, function (err) {
                alertify.error("Fetching Data failed!");
                console.log(err);
            });
        };

        $scope.OnSelectPreAdmissionStatus1 = function (Id) {
            $scope.PreAdmCardioObj.PreAdmissionStatusId = Id;
            if ($scope.PreAdmCardioObj.PreAdmissionStatusId === 1) {
                $scope.PreAdmCardioObj.PreAdmissionStatus = "Approved";
            } else if ($scope.PreAdmCardioObj.PreAdmissionStatusId === 2) {
                $scope.PreAdmCardioObj.PreAdmissionStatus = "Not Fit for Surgery";
            } else {
                $scope.PreAdmCardioObj.PreAdmissionStatus = "Postpone Surgery";
            }

        };

        $scope.AdvancedHealth1 = function () {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/Advancedhealth.html",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                "controller": function ($scope, $uibModal, $uibModalInstance, PreAdmCardioObj) {
                    $scope.cacheStorageItem = angular.copy(PreAdmCardioObj);

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
                    "PreAdmCardioObj": function () { return $scope.PreAdmCardioObj; }
                }
            });
            $scope.mInstanceAdd.result.then(function (obj) {

                $scope.PreAdmCardioObj.IsCardiacWNL = obj.IsCardiacWNL;
                $scope.PreAdmCardioObj.IsPulmonaryWNL = obj.IsPulmonaryWNL;
                $scope.PreAdmCardioObj.IsHepaticWNL = obj.IsHepaticWNL;
                $scope.PreAdmCardioObj.IsEndocrineWNL = obj.IsEndocrineWNL;
                $scope.PreAdmCardioObj.IsNeurologicWNL = obj.IsNeurologicWNL;
                $scope.PreAdmCardioObj.IsHemeOncWNL = obj.IsHemeOncWNL;
                $scope.PreAdmCardioObj.IsNervousSystemWNL = obj.IsNervousSystemWNL;
                $scope.PreAdmCardioObj.IsKidneyDiseaseWNL = obj.IsKidneyDiseaseWNL;
                $scope.PreAdmCardioObj.IsMusculoSkeletalSystemWNL = obj.IsMusculoSkeletalSystemWNL;
                $scope.PreAdmCardioObj.IsAutoImmuneDisordersWNL = obj.IsAutoImmuneDisordersWNL;
                $scope.PreAdmCardioObj.IsPsychosisWNL = obj.IsPsychosisWNL;
                $scope.PreAdmCardioObj.IsOthersWNL = obj.IsOthersWNL;
                $scope.PreAdmCardioObj.IsHeentWNL = obj.IsHeentWNL;
                $scope.PreAdmCardioObj.IsLungsWNL = obj.IsLungsWNL;
                $scope.PreAdmCardioObj.CardiacNotes = obj.CardiacNotes;
                $scope.PreAdmCardioObj.PulmonaryNotes = obj.PulmonaryNotes;
                $scope.PreAdmCardioObj.HepaticNotes = obj.HepaticNotes;
                $scope.PreAdmCardioObj.EndocrineNotes = obj.EndocrineNotes;
                $scope.PreAdmCardioObj.NeurologicNotes = obj.NeurologicNotes;
                $scope.PreAdmCardioObj.HemeOncNotes = obj.HemeOncNotes;
                $scope.PreAdmCardioObj.NervousSystemNotes = obj.NervousSystemNotes;
                $scope.PreAdmCardioObj.KidneyDiseaseNotes = obj.KidneyDiseaseNotes;
                $scope.PreAdmCardioObj.MusculoSkeletalSystemNotes = obj.MusculoSkeletalSystemNotes;
                $scope.PreAdmCardioObj.AutoImmuneDisordersNotes = obj.AutoImmuneDisordersNotes;
                $scope.PreAdmCardioObj.PsychosisNotes = obj.PsychosisNotes;
                $scope.PreAdmCardioObj.OthersNotes = obj.OthersNotes;
                $scope.PreAdmCardioObj.HeentNotes = obj.HeentNotes;
                $scope.PreAdmCardioObj.LungsNotes = obj.LungsNotes;

                $scope.PreAdmCardioObj.HealthArray = angular.copy(obj.HealthArray);

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
                    $scope.PreAdmCardioObj.SelectedCardiacIssues = tempCardiacArray.join(", ");
                } else {
                    $scope.PreAdmCardioObj.SelectedCardiacIssues = "";
                }
                if (tempPulmonaryArray.length > 0) {
                    $scope.PreAdmCardioObj.SelectedPulmonaryIssues = tempPulmonaryArray.join(", ");
                } else {
                    $scope.PreAdmCardioObj.SelectedPulmonaryIssues = "";
                }
                if (tempHepaticArray.length > 0) {
                    $scope.PreAdmCardioObj.SelectedHepaticIssues = tempHepaticArray.join(", ");
                } else {
                    $scope.PreAdmCardioObj.SelectedHepaticIssues = "";
                }
                if (tempEndocrineArray.length > 0) {
                    $scope.PreAdmCardioObj.SelectedEndocrineIssues = tempEndocrineArray.join(", ");
                } else {
                    $scope.PreAdmCardioObj.SelectedEndocrineIssues = "";
                }
                if (tempNeurologicArray.length > 0) {
                    $scope.PreAdmCardioObj.SelectedNeurologicIssues = tempNeurologicArray.join(", ");
                } else {
                    $scope.PreAdmCardioObj.SelectedNeurologicIssues = "";
                }
                if (tempHemeOneArray.length > 0) {
                    $scope.PreAdmCardioObj.SelectedHemeOncIssues = tempHemeOneArray.join(", ");
                } else {
                    $scope.PreAdmCardioObj.SelectedHemeOncIssues = "";
                }
                if (tempNervousSystemArray.length > 0) {
                    $scope.PreAdmCardioObj.SelectedNervousSystemIssues = tempNervousSystemArray.join(", ");
                } else {
                    $scope.PreAdmCardioObj.SelectedNervousSystemIssues = "";
                }
                if (tempKidneyDiseaseArray.length > 0) {
                    $scope.PreAdmCardioObj.SelectedKidneyDiseaseIssues = tempKidneyDiseaseArray.join(", ");
                } else {
                    $scope.PreAdmCardioObj.SelectedKidneyDiseaseIssues = "";
                }
                if (tempMusculoSkeletalArray.length > 0) {
                    $scope.PreAdmCardioObj.SelectedMusculoSkeletalSystemIssues = tempMusculoSkeletalArray.join(", ");
                } else {
                    $scope.PreAdmCardioObj.SelectedMusculoSkeletalSystemIssues = "";
                }
                if (tempAutoImmuneArray.length > 0) {
                    $scope.PreAdmCardioObj.SelectedAutoImmuneDisordersIssues = tempAutoImmuneArray.join(", ");
                } else {
                    $scope.PreAdmCardioObj.SelectedAutoImmuneDisordersIssues = "";
                }
                if (tempPsychosisArray.length > 0) {
                    $scope.PreAdmCardioObj.SelectedPsychosisIssues = tempPsychosisArray.join(", ");
                } else {
                    $scope.PreAdmCardioObj.SelectedPsychosisIssues = "";
                }
                if (tempOthersArray.length > 0) {
                    $scope.PreAdmCardioObj.SelectedOthersIssues = tempOthersArray.join(", ");
                } else {
                    $scope.PreAdmCardioObj.SelectedOthersIssues = "";
                }
                if (tempHeentArray.length > 0) {
                    $scope.PreAdmCardioObj.SelectedHeentIssues = tempHeentArray.join(", ");
                } else {
                    $scope.PreAdmCardioObj.SelectedHeentIssues = "";
                }
                if (tempLungsArray.length > 0) {
                    $scope.PreAdmCardioObj.SelectedLungsIssues = tempLungsArray.join(", ");
                } else {
                    $scope.PreAdmCardioObj.SelectedLungsIssues = "";
                }

               


            }, function (data) {
                console.log(data);
            });
        }


        $scope.$watch("PreAdmCardioObj", function (newVal, oldVal) {
            if ($scope.PreAdmCardioObj.SelectedCardiacIssues == "" && $scope.PreAdmCardioObj.SelectedPulmonaryIssues == "" &&
                $scope.PreAdmCardioObj.SelectedHepaticIssues == "" && $scope.PreAdmCardioObj.SelectedEndocrineIssues == "" &&
                $scope.PreAdmCardioObj.SelectedNeurologicIssues == "" && $scope.PreAdmCardioObj.SelectedHemeOncIssues == "" &&
                $scope.PreAdmCardioObj.SelectedNervousSystemIssues == "" && $scope.PreAdmCardioObj.SelectedMusculoSkeletalSystemIssues == "" &&
                $scope.PreAdmCardioObj.SelectedKidneyDiseaseIssues == "" && $scope.PreAdmCardioObj.SelectedAutoImmuneDisordersIssues == "" &&
                $scope.PreAdmCardioObj.SelectedPsychosisIssues == "" && $scope.PreAdmCardioObj.SelectedOthersIssues == "" &&
                $scope.PreAdmCardioObj.SelectedLungsIssues == "" && $scope.PreAdmCardioObj.SelectedHeentIssues == "" &&
                !$scope.PreAdmCardioObj.IsCardiacWNL && !$scope.PreAdmCardioObj.IsPulmonaryWNL &&
                !$scope.PreAdmCardioObj.IsHepaticWNL && !$scope.PreAdmCardioObj.IsEndocrineWNL &&
                !$scope.PreAdmCardioObj.IsNeurologicWNL && !$scope.PreAdmCardioObj.IsHemeOncWNL &&
                !$scope.PreAdmCardioObj.IsNervousSystemWNL && !$scope.PreAdmCardioObj.IsKidneyDiseaseWNL &&
                !$scope.PreAdmCardioObj.IsMusculoSkeletalSystemWNL && !$scope.PreAdmCardioObj.IsAutoImmuneDisordersWNL &&
                !$scope.PreAdmCardioObj.IsPsychosisWNL && !$scope.PreAdmCardioObj.IsOthersWNL && !$scope.PreAdmCardioObj.IsHeentWNL && !$scope.PreAdmCardioObj.IsLungsWNL
            ) {
                $scope.PreAdmCardioObj.ShowAdvanceHealthEdit = false;
            } else {
                $scope.PreAdmCardioObj.ShowAdvanceHealthEdit = true;
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


        $scope.$watch("PreAdmCardioObj", function (newVal, oldVal) {
            $scope.PreAdmCardioObj.IsAdvanceCardInd = false;
            // condition
            if ((($scope.PreAdmCardioObj.IsCardiacWNL == false && $scope.PreAdmCardioObj.SelectedCardiacIssues !== '') || $scope.PreAdmCardioObj.IsCardiacWNL) ||
                (($scope.PreAdmCardioObj.IsPulmonaryWNL == false && $scope.PreAdmCardioObj.SelectedPulmonaryIssues !== '') || $scope.PreAdmCardioObj.IsPulmonaryWNL) ||
                (($scope.PreAdmCardioObj.IsHepaticWNL && $scope.PreAdmCardioObj.SelectedHepaticIssues !== '') || $scope.PreAdmCardioObj.IsHepaticWNL) ||
                (($scope.PreAdmCardioObj.IsEndocrineWNL == false && $scope.PreAdmCardioObj.SelectedEndocrineIssues !== '') || $scope.PreAdmCardioObj.IsEndocrineWNL) ||
                (($scope.PreAdmCardioObj.IsNeurologicWNL == false && $scope.PreAdmCardioObj.SelectedNeurologicIssues !== '') || $scope.PreAdmCardioObj.IsNeurologicWNL) ||
                (($scope.PreAdmCardioObj.IsHemeOncWNL == false && $scope.PreAdmCardioObj.SelectedHemeOncIssues !== '') || $scope.PreAdmCardioObj.IsHemeOncWNL) ||
                (($scope.PreAdmCardioObj.IsNervousSystemWNL == false && $scope.PreAdmCardioObj.SelectedNervousSystemIssues !== '') || $scope.PreAdmCardioObj.IsNervousSystemWNL) ||
                (($scope.PreAdmCardioObj.IsMusculoSkeletalSystemWNL == false && $scope.PreAdmCardioObj.SelectedMusculoSkeletalSystemIssues !== '') || $scope.PreAdmCardioObj.IsMusculoSkeletalSystemWNL) ||
                (($scope.PreAdmCardioObj.IsKidneyDiseaseWNL == false && $scope.PreAdmCardioObj.SelectedKidneyDiseaseIssues !== '') || $scope.PreAdmCardioObj.IsKidneyDiseaseWNL) ||
                (($scope.PreAdmCardioObj.IsAutoImmuneDisordersWNL == false && $scope.PreAdmCardioObj.SelectedAutoImmuneDisordersIssues !== '') || $scope.PreAdmCardioObj.IsAutoImmuneDisordersWNL) ||
                (($scope.PreAdmCardioObj.IsPsychosisWNL == false && $scope.PreAdmCardioObj.SelectedPsychosisIssues !== '') || $scope.PreAdmCardioObj.IsPsychosisWNL) ||
                (($scope.PreAdmCardioObj.IsOthersWNL == false && $scope.PreAdmCardioObj.SelectedOthersIssues !== '') || $scope.PreAdmCardioObj.IsOthersWNL) ||
                (($scope.PreAdmCardioObj.IsHeentWNL == false && $scope.PreAdmCardioObj.SelectedHeentIssues !== '') || $scope.PreAdmCardioObj.IsHeentWNL) ||
                (($scope.PreAdmCardioObj.IsLungsWNL == false && $scope.PreAdmCardioObj.SelectedLungsIssues !== '') || $scope.PreAdmCardioObj.IsLungsWNL)
            ) {
                $scope.PreAdmCardioObj.IsAdvanceCardInd = true;
            } else {
                $scope.PreAdmCardioObj.IsAdvanceCardInd = false;
            }
        }, true);

        $scope.GetPreAdmissionSummary = function (str) {

            let appointmentId;
            if ($scope.cacheStorageItem.AppointmentTypeId === 4 || $scope.cacheStorageItem.AppointmentTypeId === 14) {
                appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
            }
            if ($scope.cacheStorageItem.AppointmentTypeId === 7||$scope.cacheStorageItem.AppointmentTypeId === 6) {
                appointmentId = $scope.cacheStorageItem.AppointmentId;
            }
            let ReqObj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": appointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                //"PatientSurgeryId": $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId,
            };

            $q.all([
                eHnoteSurgeryService.GetPatientPreAdmissionDetails(ReqObj),
                eHnoteSurgeryService.GetPreAdmissionCardiologistDetails(ReqObj)
            ]).then(function (resp) {

                if (resp[0].data.status === "Success") {
                    $scope.SurgeryList = [];
                    $scope.PreAdmAnesthetistObj = angular.copy($scope.GetPreAdmAnesthetistObj());
                    $scope.PreAdmAnesthetistObj.LabObj = angular.copy($scope.GetLabObj());
                    $scope.PreAdmAnesthetistObj.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());
                    $scope.PreAdmAnesthetistObj.HealthArray = angular.copy($scope.HealthArray);
                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj = angular.copy($scope.GetAPAnesthesiaOptionsObj());

                    if (resp[0].data.SurgeryArray.length > 0) {

                        angular.forEach(resp[0].data.SurgeryArray, function (item) {
                            let obj = {
                                "OrgSurgeryId": item.OrganizationSurgeryId,
                                "SurgeryId": item.SurgeryId,
                                "SurgeryListId": item.SurgeryListId,
                                "PatientSurgeryId": item.PatientSurgeryId,
                                "AppointmentId": item.AppointmentId,
                                "DeleteInd": "N",
                            };
                            $scope.SurgeryList.push(obj);
                        });

                        let temparray1 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[0].data.SurgeryArray[0].ExternalCoManagerId }, true);
                        if (temparray1.length > 0) {
                            $scope.PatientDetailsObj.ExternalCoManager = temparray1[0].FullName;
                        }

                        let temparray2 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[0].data.SurgeryArray[0].InternalCoManagerId }, true);
                        if (temparray2.length > 0) {
                            $scope.PatientDetailsObj.InternalCoManager = temparray2[0].FullName;
                        }

                        $scope.SurgeryDiagnosisObj.OperativeProcedure = resp[0].data.SurgeryArray[0].SurgeryName;
                        // $scope.SurgeryDiagnosisObj.SurgeryDate = item.SurgerySuggestedDate; // not the suggested date but bind appt date 
                        $scope.SurgeryDiagnosisObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
                        $scope.SurgeryDiagnosisObj.OrganizationSurgeryId = resp[0].data.SurgeryArray[0].OrganizationSurgeryId;
                        $scope.SurgeryDiagnosisObj.SurgeryId = resp[0].data.SurgeryArray[0].SurgeryId;
                        resp[0].data.SurgeryArray[0].DiagnosisList = resp[0].data.SurgeryArray[0].DiagnosisList || [];
                        if (resp[0].data.SurgeryArray[0].DiagnosisList.length > 0) {
                            $scope.SurgeryDiagnosisObj.Diagnosis = resp[0].data.SurgeryArray[0].DiagnosisList[0].DiagnosisName;
                            $scope.SurgeryDiagnosisObj.OrganizationDiagnosisId = resp[0].data.SurgeryArray[0].DiagnosisList[0].OrganizationDiagnosisId;
                            $scope.SurgeryDiagnosisObj.DiagnosisId = resp[0].data.SurgeryArray[0].DiagnosisList[0].DiagnosisId;
                        }

                        $scope.SurgeryDiagnosisObj.Diagnosis2 = $scope.SurgeryDiagnosisObj.Diagnosis2 || "";
                        if (resp[0].data.SurgeryArray[0].DiagnosisList.length > 1) {
                            $scope.SurgeryDiagnosisObj.Diagnosis2 = resp[0].data.SurgeryArray[0].DiagnosisList[1].DiagnosisName;
                        }

                        let temparray3 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[0].data.SurgeryArray[0].DoctorID }, true);
                        if (temparray3.length > 0) {
                            $scope.SurgeryDiagnosisObj.Surgeon = temparray3[0].FullName;
                        } else {
                            $scope.SurgeryDiagnosisObj.Surgeon = "";
                        }

                        $scope.PreAdmAnesthetistObj.AscAppointmentId = resp[0].data.SurgeryArray[0].AscAppointmentId || null;
                        $scope.PreAdmAnesthetistObj.AscAppointmentDate = resp[0].data.SurgeryArray[0].AscAppointmentDate || null;
                        $scope.PreAdmAnesthetistObj.FirstFollowupApptId = resp[0].data.SurgeryArray[0].FirstFollowupAppointmentId || null;
                        $scope.PreAdmAnesthetistObj.FirstFollowupDate = resp[0].data.SurgeryArray[0].FirstFollowupDate || null;
                        $scope.PreAdmAnesthetistObj.SecondFollowupApptId = resp[0].data.SurgeryArray[0].SecondFollowupAppointmentId || null;
                        $scope.PreAdmAnesthetistObj.SecondFollowupDate = resp[0].data.SurgeryArray[0].SecondFollowupDate || null;
                        $scope.PreAdmAnesthetistObj.ThirdFollowupApptId = resp[0].data.SurgeryArray[0].ThirdFollowupAppointmentId || null;
                        $scope.PreAdmAnesthetistObj.ThirdFollowupDate = resp[0].data.SurgeryArray[0].ThirdFollowupDate || null;
                    }

                    if (resp[0].data.PreAdmissionDetails.length > 0) {
                        $scope.AnesthesiaPreAdmissionDetails = angular.copy(resp[0].data.PreAdmissionDetails);
                        $scope.PreAdmissionDetails = angular.copy(resp[0].data.PreAdmissionDetails[0]);
                        $scope.PreAdmAnesthetistObj.AnesthesiaTypelist = $scope.PreAdmissionDetails.AnesthesiaTypelist;

                        $scope.PreAdmAnesthetistObj.StatusFlag = $scope.PreAdmissionDetails.StatusFlag;
                        $scope.PreAdmAnesthetistObj.PreAdmissionChartStatus = $scope.PreAdmissionDetails.PreAdmissionChartStatus;

                        if ($scope.PreAdmissionDetails !== undefined) {

                            $scope.PreAdmAnesthetistObj.PreAdmissionId = $scope.PreAdmissionDetails.PreAdmissionId;
                            $scope.PreAdmAnesthetistObj.PreAdmissionApptId = $scope.PreAdmissionDetails.AppointmentId;
                            $scope.PreAdmAnesthetistObj.PreAdmissionApptDate = $filter('date')($scope.PreAdmissionDetails.AppointmentDate, "MM-dd-yyyy");

                            $scope.PreAdmAnesthetistObj.SystemicHistory = angular.copy($scope.PreAdmissionDetails.SystemicHistory);
                            $scope.PreAdmAnesthetistObj.SurgicalHistory = angular.copy($scope.PreAdmissionDetails.SurgicalHistory);
                            $scope.PreAdmAnesthetistObj.AllergyItems = angular.copy($scope.PreAdmissionDetails.AllergyItems);


                            $scope.PreAdmAnesthetistObj.ROSOverAllRemarks = angular.copy($scope.PreAdmissionDetails.ROSOverAllRemarks);

                            if ($scope.PreAdmAnesthetistObj.ROSOverAllRemarks != "" || $scope.PreAdmAnesthetistObj.ROSOverAllRemarks != null) {
                                $scope.PreAdmissionSummaryObj.IsROSOverAllRemarksInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsROSOverAllRemarksInd = false;
                            }


                            if ($scope.PreAdmissionDetails.DocumentDetails.length > 0) {
                                $scope.PreAdmAnesthetistObj.DocumentDetails = angular.copy($scope.PreAdmissionDetails.DocumentDetails);
                            }
                            else {
                                $scope.PreAdmAnesthetistObj.DocumentDetails = [];
                            }
                            if ($scope.PreAdmissionDetails.Vitals.length > 0) {
                                angular.forEach($scope.PreAdmissionDetails.Vitals, function (vitem) {
                                    var vitallist = [];
                                    var vitallist = $filter("filter")($scope.PerformedByArray, function (kitem) { return kitem.DoctorID == vitem.PerformedBy });
                                    if (vitallist.length > 0) {
                                        vitem.PerformedByName = angular.copy(vitallist[0].FullName);
                                    }
                                });
                                $scope.PreAdmAnesthetistObj.Vitals = angular.copy($scope.PreAdmissionDetails.Vitals);
                            } else {
                                $scope.PreAdmAnesthetistObj.Vitals = [];
                                //$scope.VitalsObj = angular.copy($scope.GetVitalsObj());
                                //$scope.Vitals.push($scope.VitalsObj);
                            }


                            $scope.PreAdmAnesthetistObj.LabObj = $scope.GetLabObj();
                            $scope.PreAdmAnesthetistObj.LabObj.HGB = $scope.PreAdmissionDetails.LabTest.HGB;
                            $scope.PreAdmAnesthetistObj.LabObj.HCT = $scope.PreAdmissionDetails.LabTest.HCT;
                            $scope.PreAdmAnesthetistObj.LabObj.WBC = $scope.PreAdmissionDetails.LabTest.WBC;
                            $scope.PreAdmAnesthetistObj.LabObj.RBC = $scope.PreAdmissionDetails.LabTest.RBC;
                            $scope.PreAdmAnesthetistObj.LabObj.A1C = $scope.PreAdmissionDetails.LabTest.A1C;
                            $scope.PreAdmAnesthetistObj.LabObj.Creatinine = $scope.PreAdmissionDetails.LabTest.Creatinine;
                            $scope.PreAdmAnesthetistObj.LabObj.RBS = $scope.PreAdmissionDetails.LabTest.RBS;
                            $scope.PreAdmAnesthetistObj.LabObj.FBS = $scope.PreAdmissionDetails.LabTest.FBS;
                            $scope.PreAdmAnesthetistObj.LabObj.PBBS = $scope.PreAdmissionDetails.LabTest.PBBS;
                            $scope.PreAdmAnesthetistObj.LabObj.PBLS = $scope.PreAdmissionDetails.LabTest.PBLS;
                            $scope.PreAdmAnesthetistObj.LabObj.Notes = $scope.PreAdmissionDetails.LabTest.Notes || "";
                            $scope.PreAdmAnesthetistObj.LabObj.Others = $scope.PreAdmissionDetails.LabTest.Others || "";
                            $scope.PreAdmAnesthetistObj.LabObj.IsBloodAvailable = $scope.PreAdmissionDetails.LabTest.IsBloodAvailable || "";
                            $scope.PreAdmAnesthetistObj.LabObj.IsPretransfusion = $scope.PreAdmissionDetails.LabTest.IsPretransfusion || "";
                            $scope.PreAdmAnesthetistObj.LabObj.UrineAnalysis = $scope.PreAdmissionDetails.LabTest.UrineAnalysis || "";
                            if ($scope.PreAdmissionDetails.LabTest.TestArray.length > 0) {
                                $scope.PreAdmAnesthetistObj.LabObj.LabTestArray = $scope.PreAdmissionDetails.LabTest.TestArray;
                            }

                            if ($scope.PreAdmAnesthetistObj.LabObj.RBS != "" || $scope.PreAdmAnesthetistObj.LabObj.FBS != "" || $scope.PreAdmAnesthetistObj.LabObj.PBBS != "" || $scope.PreAdmAnesthetistObj.LabObj.PBLS != "" || $scope.PreAdmAnesthetistObj.LabObj.PBLS != "" || $scope.PreAdmAnesthetistObj.LabObj.Others != "") {
                                $scope.IsDiabetesEnable = "true";
                            }
                            else {
                                $scope.IsDiabetesEnable = "false";
                            }

                            $scope.PreAdmissionDetails.CardioVascular = $scope.PreAdmissionDetails.CardioVascular || "";
                            if ($scope.PreAdmissionDetails.CardioVascular != "") {
                                $scope.PreAdmAnesthetistObj.CardioVascularObj.Systolic = $scope.PreAdmissionDetails.CardioVascular.Systolic;
                                $scope.PreAdmAnesthetistObj.CardioVascularObj.Diastolic = $scope.PreAdmissionDetails.CardioVascular.Diastolic;
                                $scope.PreAdmAnesthetistObj.CardioVascularObj.PR = $scope.PreAdmissionDetails.CardioVascular.PR;
                                $scope.PreAdmAnesthetistObj.CardioVascularObj.ECG = $scope.PreAdmissionDetails.CardioVascular.ECG;
                                $scope.PreAdmAnesthetistObj.CardioVascularObj.ECGUnits = $scope.PreAdmissionDetails.CardioVascular.ECGUnits;
                                $scope.PreAdmAnesthetistObj.CardioVascularObj.Notes = $scope.PreAdmissionDetails.CardioVascular.Notes || "";
                            }

                            $scope.PreAdmissionDetails.Airway = $scope.PreAdmissionDetails.Airway || '';
                            if ($scope.PreAdmissionDetails.Airway != '') {
                                $scope.PreAdmAnesthetistObj.AirwayObj.ROMTMS = $scope.PreAdmissionDetails.Airway.ROMTMS;
                                $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKLAT = $scope.PreAdmissionDetails.Airway.ROMNECKLAT;
                                $scope.PreAdmAnesthetistObj.AirwayObj.ROMNECKAP = $scope.PreAdmissionDetails.Airway.ROMNECKAP;
                                $scope.PreAdmAnesthetistObj.AirwayObj.Notes = $scope.PreAdmissionDetails.Airway.Notes || "";
                                $scope.PreAdmAnesthetistObj.AirwayObj.IsNormal = $scope.PreAdmissionDetails.Airway.IsNormal;
                                $scope.PreAdmAnesthetistObj.AirwayObj.Class = $scope.PreAdmissionDetails.Airway.Class;
                                $scope.PreAdmAnesthetistObj.AirwayObj.Dentition = $scope.PreAdmissionDetails.Airway.Dentition || "";
                            }

                            $scope.PreAdmissionDetails.AnesthesiaPlan = $scope.PreAdmissionDetails.AnesthesiaPlan || "";
                            if ($scope.PreAdmissionDetails.AnesthesiaPlan != "") {
                                $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj = angular.copy($scope.GetAPAnesthesiaOptionsObj());
                                $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsTopicalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsTopicalAnesthesia;
                                $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsGeneralAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsGeneralAnesthesia;
                                $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsLocalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsLocalAnesthesia;
                                $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsPeriBulbarAnesthesia;
                                $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsRegionalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsRegionalAnesthesia;
                                $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.IsSubtenonAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsSubtenonAnesthesia;
                                $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.Dosage = $scope.PreAdmissionDetails.AnesthesiaPlan.Dosage;
                                $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistId = parseInt($scope.PreAdmissionDetails.AnesthesiaPlan.AnesthetistId);
                            }

                            $scope.PreAdmissionDetails.AssessmentsASA = $scope.PreAdmissionDetails.AssessmentsASA || "";
                            if ($scope.PreAdmissionDetails.AssessmentsASA != "") {
                                $scope.PreAdmAnesthetistObj.ASAObj.Notes = $scope.PreAdmissionDetails.AssessmentsASA.Notes || "";
                                $scope.PreAdmAnesthetistObj.ASAObj.Value = $scope.PreAdmissionDetails.AssessmentsASA.Value;
                            }

                            $scope.PreAdmissionDetails.PrevAnesthesia = $scope.PreAdmissionDetails.PrevAnesthesia || "";
                            if ($scope.PreAdmissionDetails.PrevAnesthesia != "") {
                                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());
                                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.Notes = $scope.PreAdmissionDetails.PrevAnesthesia.Notes || "";
                                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsComplications = $scope.PreAdmissionDetails.PrevAnesthesia.IsComplications;
                                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsContinue = $scope.PreAdmissionDetails.PrevAnesthesia.IsContinue;
                                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsDifficultAirway = $scope.PreAdmissionDetails.PrevAnesthesia.IsDifficultAirway;
                                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsFamilyHistory = $scope.PreAdmissionDetails.PrevAnesthesia.IsFamilyHistory;
                                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPONV = $scope.PreAdmissionDetails.PrevAnesthesia.IsPONV;
                                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPatientDNR = $scope.PreAdmissionDetails.PrevAnesthesia.IsPatientDNR;
                                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsPrevAnesthesia = $scope.PreAdmissionDetails.PrevAnesthesia.IsPrevAnesthesia;
                                $scope.PreAdmAnesthetistObj.PrevAnestheticsObj.IsSuspend = $scope.PreAdmissionDetails.PrevAnesthesia.IsSuspend;
                            }

                            angular.forEach($scope.PreAdmAnesthetistObj.HealthArray, function (item) {
                                let temparray = $filter('filter')($scope.PreAdmissionDetails.HealthArray, { "id": item.Id }, true);
                                if (temparray.length > 0) {
                                    item.IsChecked = temparray[0].IsChecked;
                                }
                                else {
                                    item.IsChecked = null;
                                }
                            });

                            $scope.PreAdmAnesthetistObj.RespiratoryHealthArray = [];
                            $scope.PreAdmAnesthetistObj.SocialHealthArray = [];

                            $scope.PreAdmAnesthetistObj.RespiratoryHealthArray = $filter("filter")($scope.PreAdmAnesthetistObj.HealthArray, { "CategoryId": 13 });
                            $scope.PreAdmAnesthetistObj.SocialHealthArray = $filter("filter")($scope.PreAdmAnesthetistObj.HealthArray, { "CategoryId": 15 });

                            if ($scope.PreAdmAnesthetistObj.RespiratoryHealthArray.length > 0) {
                                $scope.PreAdmissionSummaryObj.IsRespiratoryInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsRespiratoryInd = false;
                            }

                            if ($scope.PreAdmAnesthetistObj.SocialHealthArray.length > 0) {
                                $scope.PreAdmissionSummaryObj.IsSocialInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsSocialInd = false;
                            }

                            $scope.PreAdmAnesthetistObj.IsCardiacWNL = $scope.PreAdmissionDetails.IsCardiacWNL;
                            $scope.PreAdmAnesthetistObj.IsCNSHistory = $scope.PreAdmissionDetails.IsCNSHistory;
                            $scope.PreAdmAnesthetistObj.IsCardiovascularHistory = $scope.PreAdmissionDetails.IsCardiovascularHistory;
                            $scope.PreAdmAnesthetistObj.IsAutoImmuneDisordersWNL = $scope.PreAdmissionDetails.IsAutoImmuneDisordersWNL;
                            $scope.PreAdmAnesthetistObj.IsEndocrineWNL = $scope.PreAdmissionDetails.IsEndocrineWNL;
                            $scope.PreAdmAnesthetistObj.IsHemeOncWNL = $scope.PreAdmissionDetails.IsHemeOncWNL;
                            $scope.PreAdmAnesthetistObj.IsHepaticWNL = $scope.PreAdmissionDetails.IsHepaticWNL;
                            $scope.PreAdmAnesthetistObj.IsKidneyDiseaseWNL = $scope.PreAdmissionDetails.IsKidneyDiseaseWNL;
                            $scope.PreAdmAnesthetistObj.IsMusculoSkeletalSystemWNL = $scope.PreAdmissionDetails.IsMusculoSkeletalSystemWNL;
                            $scope.PreAdmAnesthetistObj.IsNervousSystemWNL = $scope.PreAdmissionDetails.IsNervousSystemWNL;
                            $scope.PreAdmAnesthetistObj.IsNeurologicWNL = $scope.PreAdmissionDetails.IsNeurologicWNL;
                            $scope.PreAdmAnesthetistObj.IsOthersWNL = $scope.PreAdmissionDetails.IsOthersWNL;
                            $scope.PreAdmAnesthetistObj.IsPsychosisWNL = $scope.PreAdmissionDetails.IsPsychosisWNL;
                            $scope.PreAdmAnesthetistObj.IsPulmonaryWNL = $scope.PreAdmissionDetails.IsPulmonaryWNL;
                            $scope.PreAdmAnesthetistObj.IsRespiratoryNormal = $scope.PreAdmissionDetails.IsRespiratoryNormal;

                            $scope.PreAdmAnesthetistObj.SocialNotes = $scope.PreAdmissionDetails.SocialNotes || "";
                            $scope.PreAdmAnesthetistObj.RespiratoryNotes = $scope.PreAdmissionDetails.RespiratoryNotes || "";
                            $scope.PreAdmAnesthetistObj.PulmonaryNotes = $scope.PreAdmissionDetails.PulmonaryNotes || "";
                            $scope.PreAdmAnesthetistObj.PsychosisNotes = $scope.PreAdmissionDetails.PsychosisNotes || "";
                            $scope.PreAdmAnesthetistObj.OthersNotes = $scope.PreAdmissionDetails.OthersNotes || "";
                            $scope.PreAdmAnesthetistObj.NeurologicNotes = $scope.PreAdmissionDetails.NeurologicNotes || "";
                            $scope.PreAdmAnesthetistObj.NervousSystemNotes = $scope.PreAdmissionDetails.NervousSystemNotes || "";
                            $scope.PreAdmAnesthetistObj.MusculoSkeletalSystemNotes = $scope.PreAdmissionDetails.MusculoSkeletalSystemNotes || "";
                            $scope.PreAdmAnesthetistObj.KidneyDiseaseNotes = $scope.PreAdmissionDetails.KidneyDiseaseNotes || "";
                            $scope.PreAdmAnesthetistObj.HepaticNotes = $scope.PreAdmissionDetails.HepaticNotes || "";
                            $scope.PreAdmAnesthetistObj.HemeOncNotes = $scope.PreAdmissionDetails.HemeOncNotes || "";
                            $scope.PreAdmAnesthetistObj.EndocrineNotes = $scope.PreAdmissionDetails.EndocrineNotes || "";
                            $scope.PreAdmAnesthetistObj.CardiacNotes = $scope.PreAdmissionDetails.CardiacNotes || "";
                            $scope.PreAdmAnesthetistObj.CNSNotes = $scope.PreAdmissionDetails.CNSNotes || "";
                            $scope.PreAdmAnesthetistObj.AutoImmuneDisordersNotes = $scope.PreAdmissionDetails.AutoImmuneDisordersNotes || "";

                            $scope.PreAdmAnesthetistObj.IsHeentWNL = $scope.PreAdmissionDetails.IsHeentWNL;
                            $scope.PreAdmAnesthetistObj.IsLungsWNL = $scope.PreAdmissionDetails.IsLungsWNL;
                            $scope.PreAdmAnesthetistObj.HeentNotes = $scope.PreAdmissionDetails.HeentNotes || "";
                            $scope.PreAdmAnesthetistObj.LungsNotes = $scope.PreAdmissionDetails.LungsNotes || "";


                            $scope.PreAdmAnesthetistObj.CurrentMedicationList = angular.copy($scope.PreAdmissionDetails.CurrentMedicationList);
                            $scope.PreAdmAnesthetistObj.MedicationsList = angular.copy($scope.PreAdmissionDetails.MedicationsList);
                            $scope.PreAdmAnesthetistObj.InvestigationsList = angular.copy($scope.PreAdmissionDetails.InvestigationsList);

                            $scope.PreAdmAnesthetistObj.ReviewedBy = $scope.PreAdmissionDetails.ReviwedBy;
                            $scope.AnesthesiaPreAdmissionDetails.ReviewByName = "";
                            var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmAnesthetistObj.ReviewedBy }, true)[0] || [];
                            $scope.AnesthesiaPreAdmissionDetails.ReviewByName = ReviewName.FullName || '';
                            if ($scope.PreAdmissionDetails.HealthArray.length > 0) {
                                $scope.GetHealthAdvancedData($scope.PreAdmissionDetails.HealthArray);

                                $scope.PreAdmissionSummaryObj.IsPreAdmChecklistMainInd = true;
                                $scope.PreAdmissionSummaryObj.IsPreAdmChecklistHealthPlanInd = true;
                            }
                            else if (!$scope.PreAdmissionDetails.IsCardiacWNL && !$scope.PreAdmissionDetails.IsCNSHistory && !$scope.PreAdmissionDetails.IsAutoImmuneDisordersWNL && !$scope.PreAdmissionDetails.IsEndocrineWNL && !$scope.PreAdmissionDetails.IsHemeOncWNL && !$scope.PreAdmissionDetails.IsHepaticWNL && !$scope.PreAdmissionDetails.IsPulmonaryWNL
                                && !$scope.PreAdmissionDetails.IsKidneyDiseaseWNL && !$scope.PreAdmissionDetails.IsMusculoSkeletalSystemWNL && !$scope.PreAdmissionDetails.IsNervousSystemWNL && !$scope.PreAdmissionDetails.IsNeurologicWNL && !$scope.PreAdmissionDetails.IsOthersWNL && !$scope.PreAdmissionDetails.IsPsychosisWNL && !$scope.PreAdmissionDetails.IsRespiratoryNormal && !$scope.PreAdmissionDetails.IsHeentWNL && !$scope.PreAdmissionDetails.IsLungsWNL) {

                                $scope.PreAdmissionSummaryObj.IsPreAdmChecklistMainInd = false;
                                $scope.PreAdmissionSummaryObj.IsPreAdmChecklistHealthPlanInd = false;
                            }


                            if ($scope.PreAdmAnesthetistObj.IsCNSHistory == true) {
                                $scope.PreAdmissionSummaryObj.IsCNSHistoryInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsCNSHistoryInd = false;
                            }


                            if ($scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistId != '') {
                                let Anesthetistlist = $filter("filter")($scope.AnesthetistArray, function (kitem) { return kitem.DoctorID == $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistId });

                                Anesthetistlist = Anesthetistlist || [];
                                if (Anesthetistlist.length > 0) {
                                    $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistName = Anesthetistlist[0].FullName;
                                }
                            }
                        }

                        $scope.PreAdmAnesthetistObj.PreAdmissionStatusId = $scope.PreAdmissionDetails.PreAdmissionStatusId;

                        $scope.CardiologistFilesObj.TempImagesArray = [];


                        if ($scope.PreAdmissionDetails.Vitals.length > 0) {
                            $scope.PreAdmissionSummaryObj.IsPreadmVitalsInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPreadmVitalsInd = false;
                        }
                        if ($scope.PreAdmissionDetails.AllergyItems.length > 0) {
                            $scope.PreAdmissionSummaryObj.IsPrAdmROSAllergiesInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPrAdmROSAllergiesInd = false;
                        }
                        if ($scope.PreAdmissionDetails.SystemicHistory.length > 0) {
                            $scope.PreAdmissionSummaryObj.IsPrAdmROSSystemicInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPrAdmROSSystemicInd = false;
                        }
                        if ($scope.PreAdmissionDetails.SurgicalHistory.length > 0) {
                            $scope.PreAdmissionSummaryObj.IsPrAdmROSSurgicalInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPrAdmROSSurgicalInd = false;
                        }
                        if ($scope.PreAdmissionDetails.MedicationsList.length > 0) {
                            $scope.PreAdmissionSummaryObj.IsPreAdmPreSurgeryMedicationsInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPreAdmPreSurgeryMedicationsInd = false;
                        }
                        if ($scope.PreAdmissionDetails.CurrentMedicationList.length > 0) {
                            $scope.PreAdmissionSummaryObj.IsPreAdmCurrentMedicationsInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPreAdmCurrentMedicationsInd = false;
                        }
                        if ($scope.PreAdmissionDetails.InvestigationsList.length > 0) {
                            $scope.PreAdmissionSummaryObj.IsPreAdmLabsInvestigationsInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPreAdmLabsInvestigationsInd = false;
                        }

                        if ($scope.PreAdmissionSummaryObj.IsPreAdmLabsInvestigationsInd || $scope.PreAdmissionSummaryObj.IsPreAdmPreSurgeryMedicationsInd || $scope.PreAdmissionSummaryObj.IsPreAdmCurrentMedicationsInd) {
                            $scope.PreAdmissionSummaryObj.IsPreAdmPreSurgeryOrdersMainInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPreAdmPreSurgeryOrdersMainInd = false;
                        }


                        if ($scope.PreAdmAnesthetistObj.LabObj.HGB == "" && $scope.PreAdmAnesthetistObj.LabObj.HCT == "" && $scope.PreAdmAnesthetistObj.LabObj.WBC == "" && $scope.PreAdmAnesthetistObj.LabObj.RBC == "" && $scope.PreAdmAnesthetistObj.LabObj.A1C == "" && $scope.PreAdmAnesthetistObj.LabObj.Creatinine == "" &&
                            $scope.PreAdmAnesthetistObj.LabObj.RBS == "" && $scope.PreAdmAnesthetistObj.LabObj.FBS == "" && $scope.PreAdmAnesthetistObj.LabObj.PBBS == "" && $scope.PreAdmAnesthetistObj.LabObj.PBLS == "" && $scope.PreAdmAnesthetistObj.LabObj.Notes == "") {
                            $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = true;
                        }

                        if ($scope.PreAdmAnesthetistObj.CardioVascularObj.Systolic == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.Diastolic == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.PR == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.ECG == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.ECG == "" &&
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

                        if ($scope.PreAdmissionSummaryObj.IsPrAdmEvaluationAirwayInd || $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd || $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd) {
                            $scope.PreAdmissionSummaryObj.IsPreAdmEvaluationMainInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPreAdmEvaluationMainInd = false;
                        }

                        if ($scope.PreAdmissionDetails.PrevAnesthesia.Notes == "" && !$scope.PreAdmissionDetails.PrevAnesthesia.IsComplications && !$scope.PreAdmissionDetails.PrevAnesthesia.IsContinue &&
                            !$scope.PreAdmissionDetails.PrevAnesthesia.IsDifficultAirway && !$scope.PreAdmissionDetails.PrevAnesthesia.IsFamilyHistory && !$scope.PreAdmissionDetails.PrevAnesthesia.IsPONV &&
                            !$scope.PreAdmissionDetails.PrevAnesthesia.IsPatientDNR && !$scope.PreAdmissionDetails.PrevAnesthesia.IsPrevAnesthesia && !$scope.PreAdmissionDetails.PrevAnesthesia.IsSuspend) {
                            $scope.PreAdmissionSummaryObj.IsPreAdmPreviousAnestheticInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPreAdmPreviousAnestheticInd = true;
                        }

                        if ($scope.PreAdmissionDetails.AssessmentsASA.Notes == "" && $scope.PreAdmissionDetails.AssessmentsASA.Value == "") {
                            $scope.PreAdmissionSummaryObj.IsPreAdmAssessmentASAInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPreAdmAssessmentASAInd = true;
                        }

                        if (!$scope.PreAdmissionDetails.AnesthesiaPlan.IsTopicalAnesthesia && !$scope.PreAdmissionDetails.AnesthesiaPlan.IsGeneralAnesthesia && !$scope.PreAdmissionDetails.AnesthesiaPlan.IsLocalAnesthesia &&
                            !$scope.PreAdmissionDetails.AnesthesiaPlan.IsPeriBulbarAnesthesia && !$scope.PreAdmissionDetails.AnesthesiaPlan.IsRegionalAnesthesia && !$scope.PreAdmissionDetails.AnesthesiaPlan.IsSubtenonAnesthesia &&
                            $scope.PreAdmissionDetails.AnesthesiaPlan.Dosage == "") {
                            $scope.PreAdmissionSummaryObj.IsPreAdmAnestheticPlanInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPreAdmAnestheticPlanInd = true;
                        }

                        if ($scope.PreAdmissionSummaryObj.IsPreAdmPreviousAnestheticInd || $scope.PreAdmissionSummaryObj.IsPreAdmAssessmentASAInd || $scope.PreAdmissionSummaryObj.IsPreAdmAnestheticPlanInd) {
                            $scope.PreAdmissionSummaryObj.IsPreAdmAnesthetistPlanMainInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPreAdmAnesthetistPlanMainInd = false;
                        }


                        if ($scope.PreAdmissionSummaryObj.IsPrAdmROSAllergiesInd || $scope.PreAdmissionSummaryObj.IsPrAdmROSSurgicalInd || $scope.PreAdmissionSummaryObj.IsPrAdmROSSystemicInd) {
                            $scope.PreAdmissionSummaryObj.IsPreAdmROSMainInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPreAdmROSMainInd = false;
                        }

                        if ($scope.PreAdmissionDetails.CurrentMedicationList.length > 0) {
                            $scope.IsContinuationMedication = false;
                            $scope.IsStopMedication = false;
                            angular.forEach($scope.PreAdmissionDetails.CurrentMedicationList, function (item) {
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

                        //let SelectedSurgeryList = $filter('filter')(resp[0].data.SurgeryArray, { 'PatientSurgeryId': $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId }, true);

                        let SelectedSurgeryList = angular.copy(resp[0].data.SurgeryArray);

                        SelectedSurgeryList = SelectedSurgeryList || [];

                        $scope.SelectedSurgeryArray = [];

                        if (SelectedSurgeryList.length > 0) {
                            angular.forEach(SelectedSurgeryList, function (item) {
                                let obj = {
                                    "SurgeryName": item.SurgeryName,
                                    "SurgerySuggestedDate": $filter('date')(item.SurgerySuggestedDate, "MM-dd-yyyy"),
                                    "PreAdmissionStatusId": $scope.PreAdmissionDetails.PreAdmissionStatusId,
                                    "AnesthetistName": $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj.AnesthetistName,
                                };
                                $scope.SelectedSurgeryArray.push(obj);
                            });
                        }

                    } else {
                        $scope.AnesthesiaPreAdmissionDetails = [];
                        $scope.PreAdmAnesthetistObj = angular.copy($scope.GetPreAdmAnesthetistObj());
                        $scope.PreAdmAnesthetistObj.LabObj = angular.copy($scope.GetLabObj());
                        $scope.PreAdmAnesthetistObj.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());
                        $scope.PreAdmAnesthetistObj.HealthArray = angular.copy($scope.HealthArray);
                        $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj = angular.copy($scope.GetAPAnesthesiaOptionsObj());

                        resp[0].data.SurgeryArray = resp[0].data.SurgeryArray || [];
                        if (resp[0].data.SurgeryArray.length > 0) {
                            let temparray3 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[0].data.SurgeryArray[0].DoctorID }, true);
                            if (temparray3.length > 0) {
                                $scope.SurgeryDiagnosisObj.Surgeon = temparray3[0].FullName;
                                // $scope.SurgeryDiagnosisObj.SurgeryDate = item.SurgerySuggestedDate; // not the suggested date but bind appt date 
                                $scope.SurgeryDiagnosisObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
                                resp[0].data.SurgeryArray[0].DiagnosisList = resp[0].data.SurgeryArray[0].DiagnosisList || [];
                                $scope.SurgeryDiagnosisObj.Diagnosis = resp[0].data.SurgeryArray[0].DiagnosisList.length > 0 ? resp[0].data.SurgeryArray[0].DiagnosisList[0].DiagnosisName : '';
                                $scope.SurgeryDiagnosisObj.Diagnosis2 = resp[0].data.SurgeryArray[0].DiagnosisList.length > 1 ? resp[0].data.SurgeryArray[0].DiagnosisList[1].DiagnosisName : '';
                                $scope.SurgeryDiagnosisObj.OperativeProcedure = resp[0].data.SurgeryArray[0].SurgeryName;
                            } else {
                                $scope.SurgeryDiagnosisObj.Surgeon = "";
                            }
                        }

                        if ($scope.PreAdmSurgeryList.length > 0) {
                            angular.forEach($scope.PreAdmSurgeryList, function (item) {
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

                        $scope.PreAdmissionSummaryObj.IsPreadmVitalsInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmROSMainInd = false;
                        $scope.PreAdmissionSummaryObj.IsPrAdmROSSystemicInd = false;
                        $scope.PreAdmissionSummaryObj.IsPrAdmROSSurgicalInd = false;
                        $scope.PreAdmissionSummaryObj.IsPrAdmROSAllergiesInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmEvaluationMainInd = false;
                        $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = false;
                        $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = false;
                        $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationAirwayInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmChecklistMainInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmChecklistHealthPlanInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmPreSurgeryOrdersMainInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmPreSurgeryMedicationsInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmCurrentMedicationsInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmLabsInvestigationsInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmAnesthetistPlanMainInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmPreviousAnestheticInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmAssessmentASAInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmAnestheticPlanInd = false;

                        $scope.PreAdmObj.IsShow = true;
                        $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;

                        //let SelectedSurgeryList = $filter('filter')(resp[0].data.SurgeryArray, { 'PatientSurgeryId': $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId }, true);

                        let SelectedSurgeryList = angular.copy(resp[0].data.SurgeryArray);
                        $scope.SelectedSurgeryArray = [];
                        if (SelectedSurgeryList.length > 0) {
                            angular.forEach(SelectedSurgeryList, function (item) {
                                let obj = {
                                    "SurgeryName": item.SurgeryName,
                                };
                                $scope.SelectedSurgeryArray.push(obj);
                            });
                        }
                    }
                }

                if (resp[1].data.status === "Success") {
                    $scope.SurgeryList = [];
                    $scope.PreAdmCardioObj = angular.copy($scope.GetPreAdmCardioObj());
                    $scope.PreAdmCardioObj.LabObj = angular.copy($scope.GetLabObj());
                    $scope.PreAdmCardioObj.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());
                    $scope.PreAdmCardioObj.HealthArray = angular.copy($scope.HealthArray);
                    $scope.PreAdmCardioObj.APAnesthesiaOptionsObj = angular.copy($scope.GetAPAnesthesiaOptionsObj());
                    if (resp[1].data.SurgeryArray.length > 0) {

                        angular.forEach(resp[1].data.SurgeryArray, function (item) {
                            let obj = {
                                "OrgSurgeryId": item.OrganizationSurgeryId,
                                "SurgeryId": item.SurgeryId,
                                "SurgeryListId": item.SurgeryListId,
                                "PatientSurgeryId": item.PatientSurgeryId,
                                "AppointmentId": item.AppointmentId,
                                "DeleteInd": "N",
                            };
                            $scope.SurgeryList.push(obj);
                        });

                        let temparray1 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[1].data.SurgeryArray[0].ExternalCoManagerId }, true);
                        if (temparray1.length > 0) {
                            $scope.PatientDetailsObj.ExternalCoManager = temparray1[0].FullName;
                        }

                        let temparray2 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[1].data.SurgeryArray[0].InternalCoManagerId }, true);
                        if (temparray2.length > 0) {
                            $scope.PatientDetailsObj.InternalCoManager = temparray2[0].FullName;
                        }

                        $scope.SurgeryDiagnosisObj.OperativeProcedure = resp[1].data.SurgeryArray[0].SurgeryName;
                        // $scope.SurgeryDiagnosisObj.SurgeryDate = item.SurgerySuggestedDate; // not the suggested date but bind appt date 
                        $scope.SurgeryDiagnosisObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
                        $scope.SurgeryDiagnosisObj.OrganizationSurgeryId = resp[1].data.SurgeryArray[0].OrganizationSurgeryId;
                        $scope.SurgeryDiagnosisObj.SurgeryId = resp[1].data.SurgeryArray[0].SurgeryId;
                        resp[1].data.SurgeryArray[0].DiagnosisList = resp[1].data.SurgeryArray[0].DiagnosisList || [];
                        if (resp[1].data.SurgeryArray[0].DiagnosisList.length > 0) {
                            $scope.SurgeryDiagnosisObj.Diagnosis = resp[1].data.SurgeryArray[0].DiagnosisList[0].DiagnosisName;
                            $scope.SurgeryDiagnosisObj.OrganizationDiagnosisId = resp[1].data.SurgeryArray[0].DiagnosisList[0].OrganizationDiagnosisId;
                            $scope.SurgeryDiagnosisObj.DiagnosisId = resp[1].data.SurgeryArray[0].DiagnosisList[0].DiagnosisId;
                        }

                        $scope.SurgeryDiagnosisObj.Diagnosis2 = $scope.SurgeryDiagnosisObj.Diagnosis2 || "";
                        if (resp[1].data.SurgeryArray[0].DiagnosisList.length > 1) {
                            $scope.SurgeryDiagnosisObj.Diagnosis2 = resp[1].data.SurgeryArray[0].DiagnosisList[1].DiagnosisName;
                        }

                        let temparray3 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[1].data.SurgeryArray[0].DoctorID }, true);
                        if (temparray3.length > 0) {
                            $scope.SurgeryDiagnosisObj.Surgeon = temparray3[0].FullName;
                        } else {
                            $scope.SurgeryDiagnosisObj.Surgeon = "";
                        }
                    }

                    if (resp[1].data.CardiologistDetails.length > 0) {
                        $scope.CardiologistPreAdmissionDetails = angular.copy(resp[1].data.CardiologistDetails);
                        $scope.PreAdmissionDetails = angular.copy(resp[1].data.CardiologistDetails[0]);

                        $scope.PreAdmCardioObj.StatusFlag = $scope.PreAdmissionDetails.StatusFlag;
                        $scope.PreAdmCardioObj.PreAdmissionChartStatus = $scope.PreAdmissionDetails.PreAdmissionChartStatus;

                        if ($scope.PreAdmissionDetails !== undefined) {

                            $scope.PreAdmCardioObj.PreAdmissionId = $scope.PreAdmissionDetails.PreAdmissionId;
                            $scope.PreAdmCardioObj.PreAdmissionApptId = $scope.PreAdmissionDetails.AppointmentId;
                            $scope.PreAdmCardioObj.PreAdmissionApptDate = $filter('date')($scope.PreAdmissionDetails.AppointmentDate, "MM-dd-yyyy");

                            $scope.PreAdmCardioObj.SystemicHistory = angular.copy($scope.PreAdmissionDetails.SystemicHistory);
                            $scope.PreAdmCardioObj.SurgicalHistory = angular.copy($scope.PreAdmissionDetails.SurgicalHistory);
                            $scope.PreAdmCardioObj.AllergyItems = angular.copy($scope.PreAdmissionDetails.AllergyItems);
                            if ($scope.PreAdmissionDetails.DocumentDetails.length > 0) {
                                $scope.PreAdmCardioObj.DocumentDetails = angular.copy($scope.PreAdmissionDetails.DocumentDetails);
                            }
                            else {
                                $scope.PreAdmCardioObj.DocumentDetails = [];
                            }
                            if ($scope.PreAdmissionDetails.Vitals.length > 0) {
                                angular.forEach($scope.PreAdmissionDetails.Vitals, function (vitem) {
                                    var vitallist = [];
                                    var vitallist = $filter("filter")($scope.PerformedByArray, function (kitem) { return kitem.DoctorID == vitem.PerformedBy });
                                    if (vitallist.length > 0) {
                                        vitem.PerformedByName = angular.copy(vitallist[0].FullName);
                                    }
                                });
                                $scope.PreAdmCardioObj.Vitals = angular.copy($scope.PreAdmissionDetails.Vitals);
                            } else {
                                $scope.PreAdmCardioObj.Vitals = [];
                                //$scope.VitalsObj = angular.copy($scope.GetVitalsObj());
                                //$scope.Vitals.push($scope.VitalsObj);
                            }

                            $scope.PreAdmCardioObj.ROSOverAllRemarks = angular.copy($scope.PreAdmissionDetails.ROSOverAllRemarks);

                            if ($scope.PreAdmCardioObj.ROSOverAllRemarks != "" || $scope.PreAdmCardioObj.ROSOverAllRemarks != null) {
                                $scope.PreAdmissionSummaryObj1.IsROSOverAllRemarksInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj1.IsROSOverAllRemarksInd = false;
                            }



                            $scope.PreAdmCardioObj.LabObj = $scope.GetLabObj();
                            $scope.PreAdmCardioObj.LabObj.HGB = $scope.PreAdmissionDetails.LabTest.HGB;
                            $scope.PreAdmCardioObj.LabObj.HCT = $scope.PreAdmissionDetails.LabTest.HCT;
                            $scope.PreAdmCardioObj.LabObj.WBC = $scope.PreAdmissionDetails.LabTest.WBC;
                            $scope.PreAdmCardioObj.LabObj.RBC = $scope.PreAdmissionDetails.LabTest.RBC;
                            $scope.PreAdmCardioObj.LabObj.A1C = $scope.PreAdmissionDetails.LabTest.A1C;
                            $scope.PreAdmCardioObj.LabObj.Creatinine = $scope.PreAdmissionDetails.LabTest.Creatinine;
                            $scope.PreAdmCardioObj.LabObj.IsBloodAvailable = $scope.PreAdmissionDetails.LabTest.IsBloodAvailable;
                            $scope.PreAdmCardioObj.LabObj.UrineAnalysis = $scope.PreAdmissionDetails.LabTest.UrineAnalysis;
                            $scope.PreAdmCardioObj.LabObj.IsPretransfusion = $scope.PreAdmissionDetails.LabTest.IsPretransfusion;
                            $scope.PreAdmCardioObj.LabObj.RBS = $scope.PreAdmissionDetails.LabTest.RBS;
                            $scope.PreAdmCardioObj.LabObj.FBS = $scope.PreAdmissionDetails.LabTest.FBS;
                            $scope.PreAdmCardioObj.LabObj.PBBS = $scope.PreAdmissionDetails.LabTest.PBBS;
                            $scope.PreAdmCardioObj.LabObj.PBLS = $scope.PreAdmissionDetails.LabTest.PBLS;
                            $scope.PreAdmCardioObj.LabObj.Others = $scope.PreAdmissionDetails.LabTest.Others;
                            $scope.PreAdmCardioObj.LabObj.Notes = $scope.PreAdmissionDetails.LabTest.Notes || "";
                            if ($scope.PreAdmissionDetails.LabTest.TestArray.length > 0) {
                                $scope.PreAdmCardioObj.LabObj.LabTestArray = $scope.PreAdmissionDetails.LabTest.TestArray;
                            }

                            if ($scope.PreAdmCardioObj.LabObj.RBS != "" || $scope.PreAdmCardioObj.LabObj.FBS != "" || $scope.PreAdmCardioObj.LabObj.PBBS != "" || $scope.PreAdmCardioObj.LabObj.PBLS != "" || $scope.PreAdmCardioObj.LabObj.PBLS != "" || $scope.PreAdmCardioObj.LabObj.Others != "") {
                                $scope.IsCardioDiabetesEnable = "true";
                            }
                            else {
                                $scope.IsCardioDiabetesEnable = "false";
                            }

                            $scope.PreAdmissionDetails.CardioVascular = $scope.PreAdmissionDetails.CardioVascular || "";
                            if ($scope.PreAdmissionDetails.CardioVascular != "") {
                                $scope.PreAdmCardioObj.CardioVascularObj.Systolic = $scope.PreAdmissionDetails.CardioVascular.Systolic;
                                $scope.PreAdmCardioObj.CardioVascularObj.Diastolic = $scope.PreAdmissionDetails.CardioVascular.Diastolic;
                                $scope.PreAdmCardioObj.CardioVascularObj.PR = $scope.PreAdmissionDetails.CardioVascular.PR;
                                $scope.PreAdmCardioObj.CardioVascularObj.ECG = $scope.PreAdmissionDetails.CardioVascular.ECG;
                                $scope.PreAdmCardioObj.CardioVascularObj.ECGUnits = $scope.PreAdmissionDetails.CardioVascular.ECGUnits;
                                $scope.PreAdmCardioObj.CardioVascularObj.Notes = $scope.PreAdmissionDetails.CardioVascular.Notes || "";
                            }

                            $scope.PreAdmissionDetails.Airway = $scope.PreAdmissionDetails.Airway || '';
                            if ($scope.PreAdmissionDetails.Airway != '') {
                                $scope.PreAdmCardioObj.AirwayObj.ROMTMS = $scope.PreAdmissionDetails.Airway.ROMTMS;
                                $scope.PreAdmCardioObj.AirwayObj.ROMNECKLAT = $scope.PreAdmissionDetails.Airway.ROMNECKLAT;
                                $scope.PreAdmCardioObj.AirwayObj.ROMNECKAP = $scope.PreAdmissionDetails.Airway.ROMNECKAP;
                                $scope.PreAdmCardioObj.AirwayObj.Notes = $scope.PreAdmissionDetails.Airway.Notes || "";
                                $scope.PreAdmCardioObj.AirwayObj.IsNormal = $scope.PreAdmissionDetails.Airway.IsNormal;
                                $scope.PreAdmCardioObj.AirwayObj.Class = $scope.PreAdmissionDetails.Airway.Class;
                                $scope.PreAdmCardioObj.AirwayObj.Dentition = $scope.PreAdmissionDetails.Airway.Dentition;
                            }

                            $scope.PreAdmCardioObj.HealthArray = angular.copy($scope.HealthArray);
                            angular.forEach($scope.PreAdmCardioObj.HealthArray, function (item) {
                                let temparray = $filter('filter')($scope.PreAdmissionDetails.HealthArray, { "id": item.Id }, true);
                                if (temparray.length > 0) {
                                    item.IsChecked = temparray[0].IsChecked;
                                }
                                else {
                                    item.IsChecked = null;
                                }
                            });

                            $scope.PreAdmCardioObj.RespiratoryHealthArray = [];
                            $scope.PreAdmCardioObj.SocialHealthArray = [];

                            $scope.PreAdmCardioObj.RespiratoryHealthArray = $filter("filter")(
                                $scope.PreAdmCardioObj.HealthArray,
                                { "CategoryId": 13, "IsChecked": true }
                            );

                            console.log("After filtering:", $scope.PreAdmCardioObj.RespiratoryHealthArray);
                            $scope.PreAdmCardioObj.SocialHealthArray = $filter("filter")($scope.PreAdmCardioObj.HealthArray, { "CategoryId": 15 });

                            if ($scope.PreAdmCardioObj.RespiratoryHealthArray.length > 0) {
                                $scope.PreAdmissionSummaryObj1.IsRespiratoryInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj1.IsRespiratoryInd = false;
                            }

                            if ($scope.PreAdmCardioObj.SocialHealthArray.length > 0) {
                                $scope.PreAdmissionSummaryObj1.IsSocialInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj1.IsSocialInd = false;
                            }

                            $scope.PreAdmCardioObj.IsCardiacWNL = $scope.PreAdmissionDetails.IsCardiacWNL;
                            $scope.PreAdmCardioObj.IsCNSHistory = $scope.PreAdmissionDetails.IsCNSHistory;
                            $scope.PreAdmCardioObj.IsAutoImmuneDisordersWNL = $scope.PreAdmissionDetails.IsAutoImmuneDisordersWNL;
                            $scope.PreAdmCardioObj.IsEndocrineWNL = $scope.PreAdmissionDetails.IsEndocrineWNL;
                            $scope.PreAdmCardioObj.IsHemeOncWNL = $scope.PreAdmissionDetails.IsHemeOncWNL;
                            $scope.PreAdmCardioObj.IsHepaticWNL = $scope.PreAdmissionDetails.IsHepaticWNL;
                            $scope.PreAdmCardioObj.IsKidneyDiseaseWNL = $scope.PreAdmissionDetails.IsKidneyDiseaseWNL;
                            $scope.PreAdmCardioObj.IsMusculoSkeletalSystemWNL = $scope.PreAdmissionDetails.IsMusculoSkeletalSystemWNL;
                            $scope.PreAdmCardioObj.IsNervousSystemWNL = $scope.PreAdmissionDetails.IsNervousSystemWNL;
                            $scope.PreAdmCardioObj.IsNeurologicWNL = $scope.PreAdmissionDetails.IsNeurologicWNL;
                            $scope.PreAdmCardioObj.IsOthersWNL = $scope.PreAdmissionDetails.IsOthersWNL;
                            $scope.PreAdmCardioObj.IsPsychosisWNL = $scope.PreAdmissionDetails.IsPsychosisWNL;
                            $scope.PreAdmCardioObj.IsPulmonaryWNL = $scope.PreAdmissionDetails.IsPulmonaryWNL;
                            $scope.PreAdmCardioObj.IsRespiratoryNormal = $scope.PreAdmissionDetails.IsRespiratoryNormal;

                            $scope.PreAdmCardioObj.SocialNotes = $scope.PreAdmissionDetails.SocialNotes || "";
                            $scope.PreAdmCardioObj.RespiratoryNotes = $scope.PreAdmissionDetails.RespiratoryNotes || "";
                            $scope.PreAdmCardioObj.PulmonaryNotes = $scope.PreAdmissionDetails.PulmonaryNotes || "";
                            $scope.PreAdmCardioObj.PsychosisNotes = $scope.PreAdmissionDetails.PsychosisNotes || "";
                            $scope.PreAdmCardioObj.OthersNotes = $scope.PreAdmissionDetails.OthersNotes || "";
                            $scope.PreAdmCardioObj.NeurologicNotes = $scope.PreAdmissionDetails.NeurologicNotes || "";
                            $scope.PreAdmCardioObj.NervousSystemNotes = $scope.PreAdmissionDetails.NervousSystemNotes || "";
                            $scope.PreAdmCardioObj.MusculoSkeletalSystemNotes = $scope.PreAdmissionDetails.MusculoSkeletalSystemNotes || "";
                            $scope.PreAdmCardioObj.KidneyDiseaseNotes = $scope.PreAdmissionDetails.KidneyDiseaseNotes || "";
                            $scope.PreAdmCardioObj.HepaticNotes = $scope.PreAdmissionDetails.HepaticNotes || "";
                            $scope.PreAdmCardioObj.HemeOncNotes = $scope.PreAdmissionDetails.HemeOncNotes || "";
                            $scope.PreAdmCardioObj.EndocrineNotes = $scope.PreAdmissionDetails.EndocrineNotes || "";
                            $scope.PreAdmCardioObj.CardiacNotes = $scope.PreAdmissionDetails.CardiacNotes || "";
                            $scope.PreAdmCardioObj.CNSNotes = $scope.PreAdmissionDetails.CNSNotes || "";
                            $scope.PreAdmCardioObj.AutoImmuneDisordersNotes = $scope.PreAdmissionDetails.AutoImmuneDisordersNotes || "";

                            $scope.PreAdmCardioObj.IsHeentWNL = $scope.PreAdmissionDetails.IsHeentWNL;
                            $scope.PreAdmCardioObj.IsLungsWNL = $scope.PreAdmissionDetails.IsLungsWNL;
                            $scope.PreAdmCardioObj.HeentNotes = $scope.PreAdmissionDetails.HeentNotes || "";
                            $scope.PreAdmCardioObj.LungsNotes = $scope.PreAdmissionDetails.LungsNotes || "";

                            $scope.PreAdmCardioObj.CurrentMedicationList = angular.copy($scope.PreAdmissionDetails.CurrentMedicationList);
                            $scope.PreAdmCardioObj.MedicationsList = angular.copy($scope.PreAdmissionDetails.MedicationsList);
                            $scope.PreAdmCardioObj.InvestigationsList = angular.copy($scope.PreAdmissionDetails.InvestigationsList);

                            $scope.PreAdmCardioObj.ReviewedBy = $scope.PreAdmissionDetails.ReviwedBy;
                            $scope.CardiologistPreAdmissionDetails.ReviewByName = "";
                            var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmCardioObj.ReviewedBy }, true)[0] || [];
                            $scope.CardiologistPreAdmissionDetails.ReviewByName = ReviewName.FullName || '';

                            if ($scope.PreAdmissionDetails.HealthArray.length > 0) {
                                $scope.GetHealthAdvancedData1($scope.PreAdmissionDetails.HealthArray);

                                $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistMainInd = true;
                                $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistHealthPlanInd = true;
                            }
                            else if (!$scope.PreAdmissionDetails.IsCardiacWNL && !$scope.PreAdmissionDetails.IsCNSHistory && !$scope.PreAdmissionDetails.IsAutoImmuneDisordersWNL && !$scope.PreAdmissionDetails.IsEndocrineWNL && !$scope.PreAdmissionDetails.IsHemeOncWNL && !$scope.PreAdmissionDetails.IsHepaticWNL && !$scope.PreAdmissionDetails.IsPulmonaryWNL && !$scope.PreAdmissionDetails.IsHeentWNL && !$scope.PreAdmissionDetails.IsLungsWNL
                                && !$scope.PreAdmissionDetails.IsKidneyDiseaseWNL && !$scope.PreAdmissionDetails.IsMusculoSkeletalSystemWNL && !$scope.PreAdmissionDetails.IsNervousSystemWNL && !$scope.PreAdmissionDetails.IsNeurologicWNL && !$scope.PreAdmissionDetails.IsOthersWNL && !$scope.PreAdmissionDetails.IsPsychosisWNL && !$scope.PreAdmissionDetails.IsRespiratoryNormal) {

                                $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistMainInd = false;
                                $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistHealthPlanInd = false;
                            }


                            if ($scope.PreAdmCardioObj.IsCNSHistory == true) {
                                $scope.PreAdmissionSummaryObj1.IsCNSHistoryInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj1.IsCNSHistoryInd = false;
                            }

                            if ($scope.PreAdmCardioObj.APAnesthesiaOptionsObj.AnesthetistId != '') {
                                let Anesthetistlist = $filter("filter")($scope.AnesthetistArray, function (kitem) { return kitem.DoctorID == $scope.PreAdmCardioObj.APAnesthesiaOptionsObj.AnesthetistId });

                                Anesthetistlist = Anesthetistlist || [];
                                if (Anesthetistlist.length > 0) {
                                    $scope.PreAdmCardioObj.APAnesthesiaOptionsObj.AnesthetistName = Anesthetistlist[0].FullName;
                                }
                            }
                        }

                        $scope.PreAdmCardioObj.PreAdmissionStatusId = $scope.PreAdmissionDetails.PreAdmissionStatusId;

                        $scope.FilesObj.TempImagesArray = [];


                        if ($scope.PreAdmissionDetails.Vitals.length > 0) {
                            $scope.PreAdmissionSummaryObj1.IsPreadmVitalsInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreadmVitalsInd = false;
                        }
                        if ($scope.PreAdmissionDetails.AllergyItems.length > 0) {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmROSAllergiesInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmROSAllergiesInd = false;
                        }
                        if ($scope.PreAdmissionDetails.SystemicHistory.length > 0) {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmROSSystemicInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmROSSystemicInd = false;
                        }
                        if ($scope.PreAdmissionDetails.SurgicalHistory.length > 0) {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmROSSurgicalInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmROSSurgicalInd = false;
                        }
                        if ($scope.PreAdmissionDetails.MedicationsList.length > 0) {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryMedicationsInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryMedicationsInd = false;
                        }
                        if ($scope.PreAdmissionDetails.CurrentMedicationList.length > 0) {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmCurrentMedicationsInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmCurrentMedicationsInd = false;
                        }
                        if ($scope.PreAdmissionDetails.InvestigationsList.length > 0) {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmLabsInvestigationsInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmLabsInvestigationsInd = false;
                        }

                        if ($scope.PreAdmissionSummaryObj1.IsPreAdmLabsInvestigationsInd || $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryMedicationsInd || $scope.PreAdmissionSummaryObj1.IsPreAdmCurrentMedicationsInd) {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryOrdersMainInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryOrdersMainInd = false;
                        }


                        if ($scope.PreAdmCardioObj.LabObj.HGB == "" && $scope.PreAdmCardioObj.LabObj.HCT == "" && $scope.PreAdmCardioObj.LabObj.WBC == "" && $scope.PreAdmCardioObj.LabObj.RBC == "" && $scope.PreAdmCardioObj.LabObj.A1C == "" && $scope.PreAdmCardioObj.LabObj.Creatinine == "" &&
                            $scope.PreAdmCardioObj.LabObj.RBS == "" && $scope.PreAdmCardioObj.LabObj.FBS == "" && $scope.PreAdmCardioObj.LabObj.PBBS == "" && $scope.PreAdmCardioObj.LabObj.PBLS == "" && $scope.PreAdmCardioObj.LabObj.Notes == "") {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationLabInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationLabInd = true;
                        }

                        if ($scope.PreAdmCardioObj.CardioVascularObj.Systolic == "" && $scope.PreAdmCardioObj.CardioVascularObj.Diastolic == "" && $scope.PreAdmCardioObj.CardioVascularObj.PR == "" && $scope.PreAdmCardioObj.CardioVascularObj.ECG == "" && $scope.PreAdmCardioObj.CardioVascularObj.ECGUnits == "" &&
                            $scope.PreAdmCardioObj.CardioVascularObj.Notes == "") {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationCardioInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationCardioInd = true;
                        }

                        if ($scope.PreAdmCardioObj.AirwayObj.ROMTMS == "" && $scope.PreAdmCardioObj.AirwayObj.ROMNECKLAT == "" && $scope.PreAdmCardioObj.AirwayObj.ROMNECKAP == "" && !$scope.PreAdmCardioObj.AirwayObj.IsNormal &&
                            $scope.PreAdmCardioObj.AirwayObj.Notes == "" && $scope.PreAdmCardioObj.AirwayObj.Class == "") {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationAirwayInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationAirwayInd = true;
                        }

                        if ($scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationAirwayInd || $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationCardioInd || $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationLabInd) {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmEvaluationMainInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmEvaluationMainInd = false;
                        }

                        if ($scope.PreAdmissionSummaryObj1.IsPrAdmROSAllergiesInd || $scope.PreAdmissionSummaryObj1.IsPrAdmROSSurgicalInd || $scope.PreAdmissionSummaryObj1.IsPrAdmROSSystemicInd) {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmROSMainInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsPreAdmROSMainInd = false;
                        }

                        if ($scope.PreAdmissionDetails.CurrentMedicationList.length > 0) {
                            $scope.IsContinuationMedication = false;
                            $scope.IsStopMedication = false;
                            angular.forEach($scope.PreAdmissionDetails.CurrentMedicationList, function (item) {
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

                        //let SelectedSurgeryList = $filter('filter')(resp[1].data.SurgeryArray, { 'PatientSurgeryId': $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId }, true);

                        let SelectedSurgeryList = angular.copy(resp[1].data.SurgeryArray);

                        SelectedSurgeryList = SelectedSurgeryList || [];

                        $scope.SelectedSurgeryArray = [];

                        if (SelectedSurgeryList.length > 0) {
                            angular.forEach(SelectedSurgeryList, function (item) {
                                let obj = {
                                    "SurgeryName": item.SurgeryName,
                                    "SurgerySuggestedDate": $filter('date')(item.SurgerySuggestedDate, "MM-dd-yyyy"),
                                    "PreAdmissionStatusId": $scope.PreAdmissionDetails.PreAdmissionStatusId,
                                    "AnesthetistName": $scope.PreAdmCardioObj.APAnesthesiaOptionsObj.AnesthetistName,
                                };
                                $scope.SelectedSurgeryArray.push(obj);
                            });
                        }

                    } else {
                        $scope.CardiologistPreAdmissionDetails = [];
                        $scope.PreAdmCardioObj = angular.copy($scope.GetPreAdmCardioObj());
                        $scope.PreAdmCardioObj.LabObj = angular.copy($scope.GetLabObj());
                        $scope.PreAdmCardioObj.PrevAnestheticsObj = angular.copy($scope.GetPrevAnesthetics());
                        $scope.PreAdmCardioObj.HealthArray = $scope.HealthArray || [];
                        resp[1].data.SurgeryArray = resp[1].data.SurgeryArray || [];
                        if (resp[1].data.SurgeryArray.length > 0) {
                            let temparray3 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[1].data.SurgeryArray[0].DoctorID }, true);
                            if (temparray3.length > 0) {
                                $scope.SurgeryDiagnosisObj.Surgeon = temparray3[0].FullName;
                                // $scope.SurgeryDiagnosisObj.SurgeryDate = item.SurgerySuggestedDate; // not the suggested date but bind appt date 
                                $scope.SurgeryDiagnosisObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
                                resp[1].data.SurgeryArray[0].DiagnosisList = resp[1].data.SurgeryArray[0].DiagnosisList || [];
                                $scope.SurgeryDiagnosisObj.Diagnosis = resp[1].data.SurgeryArray[0].DiagnosisList.length > 0 ? resp[1].data.SurgeryArray[0].DiagnosisList[0].DiagnosisName : '';
                                $scope.SurgeryDiagnosisObj.Diagnosis2 = resp[1].data.SurgeryArray[0].DiagnosisList.length > 1 ? resp[1].data.SurgeryArray[0].DiagnosisList[1].DiagnosisName : '';
                                $scope.SurgeryDiagnosisObj.OperativeProcedure = resp[1].data.SurgeryArray[0].SurgeryName;
                            } else {
                                $scope.SurgeryDiagnosisObj.Surgeon = "";
                            }
                        }

                        if ($scope.PreAdmSurgeryList.length > 0) {
                            angular.forEach($scope.PreAdmSurgeryList, function (item) {
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

                        $scope.PreAdmissionSummaryObj1.IsPreadmVitalsInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmROSMainInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmROSSystemicInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmROSSurgicalInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmROSAllergiesInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmEvaluationMainInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationLabInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationCardioInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPrAdmEvaluationAirwayInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistMainInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistHealthPlanInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryOrdersMainInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmPreSurgeryMedicationsInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmCurrentMedicationsInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmLabsInvestigationsInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmAnesthetistPlanMainInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmPreviousAnestheticInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmAssessmentASAInd = false;
                        $scope.PreAdmissionSummaryObj1.IsPreAdmAnestheticPlanInd = false;


                        $scope.PreAdmObj.IsShow = true;
                        $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;

                        //let SelectedSurgeryList = $filter('filter')(resp[1].data.SurgeryArray, { 'PatientSurgeryId': $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId }, true);

                        let SelectedSurgeryList = angular.copy(resp[1].data.SurgeryArray);
                        SelectedSurgeryList = SelectedSurgeryList || [];
                        $scope.SelectedSurgeryArray = [];
                        if (SelectedSurgeryList.length > 0) {
                            angular.forEach(SelectedSurgeryList, function (item) {
                                let obj = {
                                    "SurgeryName": item.SurgeryName,
                                };
                                $scope.SelectedSurgeryArray.push(obj);
                            });
                        }
                    }
                }

                $scope.PreAdmObj.IsEdit = true;
                $scope.PreAdmObj.IsShow = true;
                $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;
                if (str == 'SignOff') {
                    $scope.PreAdmObj.IsShowPreAdmissionSummaryView = true;
                    $scope.PreAdmObj.IsShow = false;
                }
                /* $scope.PreAdmObj.IsShowPreAdmissionSummaryView = true;*/
            });





        };
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


        $scope.ChangeDiabetesCardio = function (val, type) {
            if (type == 'Cardio') {
                if (val == 1) {
                    $scope.IsCardioDiabetesEnable = "true";
                } else {
                    $scope.IsCardioDiabetesEnable = "false";

                    $scope.PreAdmCardioObj.LabObj.RBS = "";
                    $scope.PreAdmCardioObj.LabObj.FBS = "";
                    $scope.PreAdmCardioObj.LabObj.PBBS = "";
                    $scope.PreAdmCardioObj.LabObj.PBLS = "";
                    $scope.PreAdmCardioObj.LabObj.Others = "";

                }
            }
        }

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
        
        $scope.ClearAllergyforcardio = function (Aitem) {
            var index = $scope.PreAdmCardioObj.AllergyItems.indexOf(Aitem);
            if (Aitem.PatientDetailId == 0) {
                if (index > -1) {
                    $scope.PreAdmCardioObj.AllergyItems.splice(index, 1);
                }
            } else {
                $scope.PreAdmCardioObj.AllergyItems[index].DeleteInd = 'Y';
            }

        };
        $scope.ClearSystemicHistoryforcardio = function (Aitem) {
            var index = $scope.PreAdmCardioObj.SystemicHistory.indexOf(Aitem);
            if (Aitem.AllergyId == 0) {
                if (index > -1) {
                    $scope.PreAdmCardioObj.SystemicHistory.splice(index, 1);
                }
            } else {
                $scope.PreAdmCardioObj.SystemicHistory[index].DeleteInd = 'Y';
            }

        };
        $scope.ClearSurgicalHistoryforcardio = function (Aitem) {
            var index = $scope.PreAdmCardioObj.SurgicalHistory.indexOf(Aitem);
            if (Aitem.AllergyId == 0) {
                if (index > -1) {
                    $scope.PreAdmCardioObj.SurgicalHistory.splice(index, 1);
                }
            } else {
                $scope.PreAdmCardioObj.SurgicalHistory[index].DeleteInd = 'Y';
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
        $scope.ClearInvestigationsdata = function (item, index) {
            if (item.PatientInvestigationId != 0) {
                item.DeleteInd = "Y";
            } else {
                $scope.PreAdmCardioObj.InvestigationsList.splice(index, 1);
            }
        }
        $scope.ClearMedicationsdata = function (item, index) {
            if (item.ProcedureMedicationId != 0) {
                item.DeleteInd = "Y";
            } else {
                $scope.PreAdmCardioObj.MedicationsList.splice(index, 1);
            }
        }
        $scope.ClearCurrentMedicationsdata = function (item, index) {
            if (item.ProcedureMedicationId != 0) {
                item.DeleteInd = "Y";
            } else {
                $scope.PreAdmCardioObj.CurrentMedicationList.splice(index, 1);
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


        $scope.RemoveVitalsDataCardio = function (item, index) {
            if (item.PatientPreAdmVitalId == 0) {
                $scope.PreAdmCardioObj.Vitals.splice(index, 1);
            } else {
                item.DeleteInd = "Y";
            }
        }


        $scope.cardiologistpopupclick = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/cardiologipopup.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                //"windowClass": "inventory-full-popup",
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                "controller": function ($scope, $uibModalInstance, PreAdmCardioObj, DocumentList) {

                    $scope.PreAdmCardioObj.DocumentDetails=DocumentList;
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.HealthPhysicalModal = angular.copy(PreAdmCardioObj);

                    $scope.SaveHealthandPhysical = function () {
                        $uibModalInstance.close($scope.HealthPhysicalModal);
                    };

                    $scope.SelectCNSBtn1 = function (val) {
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
                    $scope.CardiologistselectedImgsHandP = function (CardiologistFiles) {

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
                                        "FileTypeId": 28,
                                        "DisplayName": $scope.CardiologistFiles.name || ""
                                    };

                                    $scope.CardiologistFilesObj.TempImagesArray.push(obj);

                    $scope.AddLabTest1 = function () {
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


                                    angular.element("input[type='file']").val(null);
                                }
                            });
                        }
                    };

                },
                "resolve": {
                    "PreAdmCardioObj": function () {
                        return $scope.PreAdmCardioObj;
                    },
                    "DocumentList": function () { return $scope.PreAdmCardioObj.DocumentDetails; },
                }
            });

            mInstanceAdd.result.then(function (data) {
                $scope.PreAdmCardioObj.LabObj = angular.copy(data.LabObj);
                $scope.PreAdmCardioObj.CardioVascularObj = angular.copy(data.CardioVascularObj);
                $scope.PreAdmCardioObj.HealthArray = angular.copy(data.HealthArray);
                $scope.PreAdmCardioObj.SocialNotes = angular.copy(data.SocialNotes);
                $scope.PreAdmCardioObj.RespiratoryNotes = angular.copy(data.RespiratoryNotes);
                $scope.PreAdmCardioObj.IsCNSHistory = angular.copy(data.IsCNSHistory);
                $scope.PreAdmCardioObj.CNSNotes = angular.copy(data.CNSNotes);
                $scope.PreAdmCardioObj.IsCXR = angular.copy(data.IsCXR);

                if ($scope.PreAdmCardioObj.LabObj.IsPretransfusion == "" && $scope.PreAdmCardioObj.LabObj.IsBloodAvailable == "" && $scope.PreAdmCardioObj.LabObj.UrineAnalysis == "" && $scope.PreAdmCardioObj.LabObj.HGB == "" && $scope.PreAdmCardioObj.LabObj.HCT == "" && $scope.PreAdmCardioObj.LabObj.WBC == "" && $scope.PreAdmCardioObj.LabObj.RBC == "" && $scope.PreAdmCardioObj.LabObj.A1C == "" && $scope.PreAdmCardioObj.LabObj.Creatinine == "" &&
                    $scope.PreAdmCardioObj.LabObj.RBS == "" && $scope.PreAdmCardioObj.LabObj.FBS == "" && $scope.PreAdmCardioObj.LabObj.PBBS == "" && $scope.PreAdmCardioObj.LabObj.PBLS == "" && $scope.PreAdmCardioObj.LabObj.Notes == "") {
                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = false;
                } else {
                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = true;
                }
                if ($scope.PreAdmCardioObj.CardioVascularObj.Systolic == "" && $scope.PreAdmCardioObj.CardioVascularObj.Diastolic == "" && $scope.PreAdmCardioObj.CardioVascularObj.PR == "" && $scope.PreAdmCardioObj.CardioVascularObj.ECG == "" && $scope.PreAdmCardioObj.CardioVascularObj.ECGUnits == "" &&
                    $scope.PreAdmCardioObj.CardioVascularObj.Notes == "") {
                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = false;
                } else {
                    $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = true;
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
                    "AllUserList": function () { return $scope.allUserList; },
                    "reqIds": function () { return reqIds; },
                    "SurgeryDiagnosisObj": function () { return $scope.SurgeryDiagnosisObj; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, AllUserList, reqIds, SurgeryDiagnosisObj) {

                    $scope.PatientID = reqIds.PatientId;
                    $scope.UserId = reqIds.UserId;
                    $scope.SpecializationId = reqIds.SpecializationId;
                    $scope.HospitalId = reqIds.HospitalId;
                    $scope.ParenthospitalId = reqIds.ParenthospitalId || null;

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

        $scope.onSelectPreAdmCardioDiagnosis = function (mainobject) {
            console.log(mainobject);
            var i = 0;

            $scope.PreAdmCardioObj.CardiologistDiagnosis = $scope.PreAdmCardioObj.CardiologistDiagnosis || [];
            if ($scope.PreAdmCardioObj.CardiologistDiagnosis.length > 0) {
                angular.forEach($scope.PreAdmCardioObj.CardiologistDiagnosis, function (item) {

                    if (item.DiagnosisId === mainobject.DiagnosisId && item.DeleteInd == 'N') {
                        alertify.error('You already entered this Diagnosis');
                        i++;
                        return false;
                    }

                });
                $scope.PreAdmCardioObj.DiagnosisObject = "";
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
                    "StatusList": [],
                    "DeleteInd": "N",
                }

                var statusobj = {
                    "OrganStatusId": 0,
                    "OrganId": null,
                    "SeverityId": null,
                    "Verificationstatusid": null,
                    "DiagnosisStatus": null,
                    "DiagnosisStatusId": null,
                    "EndDate": null,
                    "StartDate": null,
                    "DeleteInd": "N"
                }
                obj.StatusList.push(statusobj);

                $scope.PreAdmCardioObj.CardiologistDiagnosis.push(obj);
                $scope.PreAdmCardioObj.DiagnosisObject = "";
            }
        }

        $scope.changeDiagnosisStatus = function (List, DiagnosisStatusId) {
            let listname = $filter('filter')($scope.GetStatusList, { 'DiagnosisStatusId': DiagnosisStatusId }, true);
            if (listname.length > 0) {
                List.DiagnosisStatus = listname[0].DiagnosisStatus;
            }
        }

        $scope.ClearDiagnosis = function (item, index) {
            if (item.ConsultationDiagnosisId != 0) {
                item.DeleteInd = "Y";
            } else {
                $scope.PreAdmCardioObj.CardiologistDiagnosis.splice(index, 1);
            }
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
                                    if ($scope.PreAdmCardioObj.AllergyItems.length > 0) {
                                        angular.forEach($scope.PreAdmCardioObj.AllergyItems, function (item) {
                                            if (item.AllergyId === obj.AllergyId && item.DeleteInd == 'N') {
                                                i++;
                                            }
                                        });
                                    }
                                    if ($scope.PreAdmCardioObj.AllergyItems.length !== 0) {
                                        var List = $filter("filter")($scope.PreAdmCardioObj.AllergyItems, { "AllergyId": 1 }, true);
                                        if (List.length > 0) {
                                            List[0].DeleteInd = 'Y';
                                        }
                                    }

                                    if ($scope.PreAdmCardioObj.AllergyItems.length !== 0) {
                                        var List = $filter("filter")($scope.PreAdmCardioObj.AllergyItems, { "AllergyId": 2 }, true);
                                        if (List.length > 0) {
                                            List[0].DeleteInd = 'Y';
                                        }
                                    }

                                    if (i === 0) {
                                        $scope.PreAdmCardioObj.AllergyItems.push(obj);
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
                                    if ($scope.PreAdmCardioObj.SystemicHistory.length > 0) {
                                        angular.forEach($scope.PreAdmCardioObj.SystemicHistory, function (item) {
                                            if (item.HistoryId === object.HistoryId && item.DeleteInd === 'N') {
                                                i++;
                                            }
                                        });
                                    }

                                    if ($scope.PreAdmCardioObj.SystemicHistory.length !== 0) {
                                        var List = $filter("filter")($scope.PreAdmCardioObj.SystemicHistory, { "HistoryId": 1 }, true);
                                        if (List.length > 0) {
                                            List[0].DeleteInd = 'Y';
                                        }
                                    }
                                    if (i === 0) {
                                        object.GeneralPatientHistoryId = 0;
                                        $scope.PreAdmCardioObj.SystemicHistory.push(object);
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
                                    if ($scope.PreAdmCardioObj.SurgicalHistory.length > 0) {
                                        angular.forEach($scope.PreAdmCardioObj.SurgicalHistory, function (item) {
                                            if (item.HistoryId === object.HistoryId && item.DeleteInd === 'N') {
                                                surgicalHistory = "";
                                                i++;
                                            }
                                        });
                                    }
                                    if ($scope.PreAdmCardioObj.SurgicalHistory.length !== 0) {
                                        var List = $filter("filter")($scope.PreAdmCardioObj.SurgicalHistory, { "HistoryId": 1 }, true);
                                        if (List.length > 0) {
                                            List[0].DeleteInd = 'Y';
                                        }
                                    }
                                    if (i === 0 && surgicalHistory !== "") {
                                        object.GeneralPatientHistoryId = 0;
                                        $scope.PreAdmCardioObj.SurgicalHistory.push(object);
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
                                    if ($scope.PreAdmCardioObj.CurrentSystemicMedicationsHistory.length > 0) {
                                        angular.forEach($scope.PreAdmCardioObj.CurrentSystemicMedicationsHistory, function (csitem) {
                                            if (csitem.MedicineId === object.MedicineId && csitem.DeleteInd === 'N') {
                                                i++;
                                            }
                                        });
                                    }
                                    if ($scope.PreAdmCardioObj.CurrentSystemicMedicationsHistory.length !== 0) {
                                        var List = $filter("filter")($scope.PreAdmCardioObj.CurrentSystemicMedicationsHistory, { "MedicineId": 2 }, true);
                                        if (List.length > 0) {
                                            List[0].DeleteInd = 'Y';
                                        }
                                    }

                                    if (i === 0 && CurrentSystemicMedicationsHistory != "") {
                                        $scope.PreAdmCardioObj.CurrentSystemicMedicationsHistory.push(object);
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
                                        if ($scope.PreAdmCardioObj.CurrentEyeMedications.length > 0) {
                                            angular.forEach($scope.PreAdmCardioObj.CurrentEyeMedications, function (item) {
                                                if (item.MedicineId === object.MedicineId && item.DeleteInd == 'N') {
                                                    i++;
                                                }
                                            });
                                        }
                                        if ($scope.PreAdmCardioObj.CurrentEyeMedications.length !== 0) {
                                            var List = $filter("filter")($scope.PreAdmCardioObj.CurrentEyeMedications, { "MedicineId": 1 }, true);
                                            if (List.length > 0) {
                                                List[0].DeleteInd = 'Y';
                                            }
                                        }
                                        if (i === 0) {
                                            object.MedicalHistoryDetailsId = 0;
                                            $scope.PreAdmCardioObj.CurrentEyeMedications.push(object);
                                        }
                                    }
                                });
                            }

                        });
                    }
                }
            });
        };

        $scope.CopyFromAnesthesia = function () {

            alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to copy from Anesthesia? </h4>", function () {

            let appointmentId;
            if ($scope.cacheStorageItem.AppointmentTypeId === 4 || $scope.cacheStorageItem.AppointmentTypeId === 14) {
                appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
            }
            if ($scope.cacheStorageItem.AppointmentTypeId === 7||$scope.cacheStorageItem.AppointmentTypeId === 6) {
                appointmentId = $scope.cacheStorageItem.AppointmentId;
            }
            $scope.ReqObj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": appointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0
            };
            eHnoteSurgeryService.GetPatientPreAdmissionDetails($scope.ReqObj).then(function (response) {
                console.log(response);
                if (response.data.status === "Success") {

                    if (response.data.PreAdmissionDetails.length > 0) {
                        $scope.AnesthesiaDetails = angular.copy(response.data.PreAdmissionDetails[0]);

                        $scope.PreAdmCardioObj.LabObj = $scope.GetLabObj();
                        $scope.PreAdmCardioObj.LabObj.HGB = $scope.AnesthesiaDetails.LabTest.HGB;
                        $scope.PreAdmCardioObj.LabObj.HCT = $scope.AnesthesiaDetails.LabTest.HCT;
                        $scope.PreAdmCardioObj.LabObj.WBC = $scope.AnesthesiaDetails.LabTest.WBC;
                        $scope.PreAdmCardioObj.LabObj.RBC = $scope.AnesthesiaDetails.LabTest.RBC;
                        $scope.PreAdmCardioObj.LabObj.A1C = $scope.AnesthesiaDetails.LabTest.A1C;
                        $scope.PreAdmCardioObj.LabObj.Creatinine = $scope.AnesthesiaDetails.LabTest.Creatinine;
                        $scope.PreAdmCardioObj.LabObj.RBS = $scope.AnesthesiaDetails.LabTest.RBS;
                        $scope.PreAdmCardioObj.LabObj.FBS = $scope.AnesthesiaDetails.LabTest.FBS;
                        $scope.PreAdmCardioObj.LabObj.PBBS = $scope.AnesthesiaDetails.LabTest.PBBS;
                        $scope.PreAdmCardioObj.LabObj.PBLS = $scope.AnesthesiaDetails.LabTest.PBLS;
                        $scope.PreAdmCardioObj.LabObj.Notes = $scope.AnesthesiaDetails.LabTest.Notes || "";
                        $scope.PreAdmCardioObj.LabObj.Others = $scope.AnesthesiaDetails.LabTest.Others || "";
                        $scope.PreAdmCardioObj.LabObj.IsBloodAvailable = $scope.AnesthesiaDetails.LabTest.IsBloodAvailable || "";
                        $scope.PreAdmCardioObj.LabObj.IsPretransfusion = $scope.AnesthesiaDetails.LabTest.IsPretransfusion || "";
                        $scope.PreAdmCardioObj.LabObj.UrineAnalysis = $scope.AnesthesiaDetails.LabTest.UrineAnalysis || "";
                        $scope.AnesthesiaDetails.LabTest.TestArray = $scope.AnesthesiaDetails.LabTest.TestArray || [];
                        if ($scope.AnesthesiaDetails.LabTest.TestArray.length > 0) {
                            $scope.PreAdmCardioObj.LabObj.LabTestArray = $scope.AnesthesiaDetails.LabTest.TestArray;
                            angular.forEach($scope.PreAdmCardioObj.LabObj.LabTestArray, function (item) {
                                if (item.Notes != '') {
                                    item.PreCardnotesInd = true;
                                } else {
                                    item.PreCardnotesInd = false;
                                }
                            });
                        }

                        if ($scope.PreAdmCardioObj.LabObj.Notes != '') {
                            $scope.PreAdmCardioObj.CardiologyLabNotesInd = true;
                        }
                        else {
                            $scope.PreAdmCardioObj.CardiologyLabNotesInd = false;
                        }
                      
                        $scope.AnesthesiaDetails.CardioVascular = $scope.AnesthesiaDetails.CardioVascular || "";
                        if ($scope.AnesthesiaDetails.CardioVascular != "") {
                            $scope.PreAdmCardioObj.CardioVascularObj.Systolic = $scope.AnesthesiaDetails.CardioVascular.Systolic;
                            $scope.PreAdmCardioObj.CardioVascularObj.Diastolic = $scope.AnesthesiaDetails.CardioVascular.Diastolic;
                            $scope.PreAdmCardioObj.CardioVascularObj.PR = $scope.AnesthesiaDetails.CardioVascular.PR;
                            $scope.PreAdmCardioObj.CardioVascularObj.ECG = $scope.AnesthesiaDetails.CardioVascular.ECG;
                            $scope.PreAdmCardioObj.CardioVascularObj.ECGUnits = $scope.AnesthesiaDetails.CardioVascular.ECGUnits;
                            $scope.PreAdmCardioObj.CardioVascularObj.Notes = $scope.AnesthesiaDetails.CardioVascular.Notes || "";
                            $scope.PreAdmCardioObj.CardioVascularObj.BPlevel = $scope.AnesthesiaDetails.CardioVascular.BPlevel || "";
                        }

                        if ($scope.PreAdmCardioObj.CardioVascularObj.Notes != "") {
                            $scope.PreAdmCardioObj.CardioVascularObjNotesInd = true;
                        } else {
                            $scope.PreAdmCardioObj.CardioVascularObjNotesInd = false;
                        }

                        $scope.AnesthesiaDetails.HealthArray = angular.copy($scope.AnesthesiaDetails.HealthArray)||[];
                        angular.forEach($scope.PreAdmCardioObj.HealthArray, function (item) {
                            let temparray = $filter('filter')($scope.AnesthesiaDetails.HealthArray, { "Id": item.Id }, true);
                            temparray = temparray || [];
                            if (temparray.length > 0) {
                                item.IsChecked = temparray[0].IsChecked;
                            } else {
                                item.IsChecked = null;
                            }
                        });
                        
                        $scope.PreAdmCardioObj.CXRHistory = $scope.AnesthesiaDetails.CXRHistory;
                        $scope.PreAdmCardioObj.IsCXR = $scope.AnesthesiaDetails.IsCXR; 
                        $scope.CardioOtherSystemsArrayList = angular.copy($scope.AnesthesiaDetails.OtherSystemArray);
                        $scope.PreAdmCardioObj.IsCardiovascularHistory = $scope.AnesthesiaDetails.IsCardiovascularHistory;

                        if ($scope.CardioOtherSystemsArrayList.length > 0) {
                            angular.forEach($scope.CardioOtherSystemsArrayList, function (item) {
                                if (item.Remarks != '') {
                                    item.OthernotesInd = true;
                                } else {
                                    item.OthernotesInd = false;
                                }
                            });
                        }

                        if ($scope.AnesthesiaDetails.DocumentDetails.length > 0) {
                            $scope.PreAdmCardioObj.DocumentDetails = $scope.AnesthesiaDetails.DocumentDetails || [];
                            angular.forEach($scope.PreAdmCardioObj.DocumentDetails, function (item) {
                                if (item.FileTypeId == 26) {
                                    item.FileTypeId = 28;
                                }
                            });

                        } else {
                            $scope.PreAdmCardioObj.DocumentDetails = [];
                        }
                        
                        let tempHealthArray = angular.copy($scope.PreAdmCardioObj.HealthArray);
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
                            $scope.PreAdmCardioObj.SelectedCardiacIssues = tempCardiacArray.join(", ");
                        } else {
                            $scope.PreAdmCardioObj.SelectedCardiacIssues = "";
                        }
                        if (tempPulmonaryArray.length > 0) {
                            $scope.PreAdmCardioObj.SelectedPulmonaryIssues = tempPulmonaryArray.join(", ");
                        } else {
                            $scope.PreAdmCardioObj.SelectedPulmonaryIssues = "";
                        }
                        if (tempHepaticArray.length > 0) {
                            $scope.PreAdmCardioObj.SelectedHepaticIssues = tempHepaticArray.join(", ");
                        } else {
                            $scope.PreAdmCardioObj.SelectedHepaticIssues = "";
                        }
                        if (tempEndocrineArray.length > 0) {
                            $scope.PreAdmCardioObj.SelectedEndocrineIssues = tempEndocrineArray.join(", ");
                        } else {
                            $scope.PreAdmCardioObj.SelectedEndocrineIssues = "";
                        }
                        if (tempNeurologicArray.length > 0) {
                            $scope.PreAdmCardioObj.SelectedNeurologicIssues = tempNeurologicArray.join(", ");
                        } else {
                            $scope.PreAdmCardioObj.SelectedNeurologicIssues = "";
                        }
                        if (tempHemeOneArray.length > 0) {
                            $scope.PreAdmCardioObj.SelectedHemeOncIssues = tempHemeOneArray.join(", ");
                        } else {
                            $scope.PreAdmCardioObj.SelectedHemeOncIssues = "";
                        }
                        if (tempNervousSystemArray.length > 0) {
                            $scope.PreAdmCardioObj.SelectedNervousSystemIssues = tempNervousSystemArray.join(", ");
                        } else {
                            $scope.PreAdmCardioObj.SelectedNervousSystemIssues = "";
                        }
                        if (tempKidneyDiseaseArray.length > 0) {
                            $scope.PreAdmCardioObj.SelectedKidneyDiseaseIssues = tempKidneyDiseaseArray.join(", ");
                        } else {
                            $scope.PreAdmCardioObj.SelectedKidneyDiseaseIssues = "";
                        }
                        if (tempMusculoSkeletalArray.length > 0) {
                            $scope.PreAdmCardioObj.SelectedMusculoSkeletalSystemIssues = tempMusculoSkeletalArray.join(", ");
                        } else {
                            $scope.PreAdmCardioObj.SelectedMusculoSkeletalSystemIssues = "";
                        }
                        if (tempAutoImmuneArray.length > 0) {
                            $scope.PreAdmCardioObj.SelectedAutoImmuneDisordersIssues = tempAutoImmuneArray.join(", ");
                        } else {
                            $scope.PreAdmCardioObj.SelectedAutoImmuneDisordersIssues = "";
                        }
                        if (tempPsychosisArray.length > 0) {
                            $scope.PreAdmCardioObj.SelectedPsychosisIssues = tempPsychosisArray.join(", ");
                        } else {
                            $scope.PreAdmCardioObj.SelectedPsychosisIssues = "";
                        }
                        if (tempOthersArray.length > 0) {
                            $scope.PreAdmCardioObj.SelectedOthersIssues = tempOthersArray.join(", ");
                        } else {
                            $scope.PreAdmCardioObj.SelectedOthersIssues = "";
                        }
                        if (tempHeentArray.length > 0) {
                            $scope.PreAdmCardioObj.SelectedHeentIssues = tempHeentArray.join(", ");
                        } else {
                            $scope.PreAdmCardioObj.SelectedHeentIssues = "";
                        }
                        if (tempLungsArray.length > 0) {
                            $scope.PreAdmCardioObj.SelectedLungsIssues = tempLungsArray.join(", ");
                        } else {
                            $scope.PreAdmCardioObj.SelectedLungsIssues = "";
                        }


                        $scope.PreAdmCardioObj.IsCardiacWNL = $scope.AnesthesiaDetails.IsCardiacWNL;
                        $scope.PreAdmCardioObj.IsCNSHistory = $scope.AnesthesiaDetails.IsCNSHistory;
                        $scope.PreAdmCardioObj.IsAutoImmuneDisordersWNL = $scope.AnesthesiaDetails.IsAutoImmuneDisordersWNL;
                        $scope.PreAdmCardioObj.IsEndocrineWNL = $scope.AnesthesiaDetails.IsEndocrineWNL;
                        $scope.PreAdmCardioObj.IsHemeOncWNL = $scope.AnesthesiaDetails.IsHemeOncWNL;
                        $scope.PreAdmCardioObj.IsHepaticWNL = $scope.AnesthesiaDetails.IsHepaticWNL;
                        $scope.PreAdmCardioObj.IsKidneyDiseaseWNL = $scope.AnesthesiaDetails.IsKidneyDiseaseWNL;
                        $scope.PreAdmCardioObj.IsMusculoSkeletalSystemWNL = $scope.AnesthesiaDetails.IsMusculoSkeletalSystemWNL;
                        $scope.PreAdmCardioObj.IsNervousSystemWNL = $scope.AnesthesiaDetails.IsNervousSystemWNL;
                        $scope.PreAdmCardioObj.IsNeurologicWNL = $scope.AnesthesiaDetails.IsNeurologicWNL;
                        $scope.PreAdmCardioObj.IsOthersWNL = $scope.AnesthesiaDetails.IsOthersWNL;
                        $scope.PreAdmCardioObj.IsPsychosisWNL = $scope.AnesthesiaDetails.IsPsychosisWNL;
                        $scope.PreAdmCardioObj.IsPulmonaryWNL = $scope.AnesthesiaDetails.IsPulmonaryWNL;
                        $scope.PreAdmCardioObj.IsRespiratoryNormal = $scope.AnesthesiaDetails.IsRespiratoryNormal;

                        $scope.PreAdmCardioObj.SocialNotes = $scope.AnesthesiaDetails.SocialNotes || "";
                        $scope.PreAdmCardioObj.RespiratoryNotes = $scope.AnesthesiaDetails.RespiratoryNotes || "";
                        $scope.PreAdmCardioObj.PulmonaryNotes = $scope.AnesthesiaDetails.PulmonaryNotes || "";
                        $scope.PreAdmCardioObj.PsychosisNotes = $scope.AnesthesiaDetails.PsychosisNotes || "";
                        $scope.PreAdmCardioObj.OthersNotes = $scope.AnesthesiaDetails.OthersNotes || "";
                        $scope.PreAdmCardioObj.NeurologicNotes = $scope.AnesthesiaDetails.NeurologicNotes || "";
                        $scope.PreAdmCardioObj.NervousSystemNotes = $scope.AnesthesiaDetails.NervousSystemNotes || "";
                        $scope.PreAdmCardioObj.MusculoSkeletalSystemNotes = $scope.AnesthesiaDetails.MusculoSkeletalSystemNotes || "";
                        $scope.PreAdmCardioObj.KidneyDiseaseNotes = $scope.AnesthesiaDetails.KidneyDiseaseNotes || "";
                        $scope.PreAdmCardioObj.HepaticNotes = $scope.AnesthesiaDetails.HepaticNotes || "";
                        $scope.PreAdmCardioObj.HemeOncNotes = $scope.AnesthesiaDetails.HemeOncNotes || "";
                        $scope.PreAdmCardioObj.EndocrineNotes = $scope.AnesthesiaDetails.EndocrineNotes || "";
                        $scope.PreAdmCardioObj.CardiacNotes = $scope.AnesthesiaDetails.CardiacNotes || "";
                        $scope.PreAdmCardioObj.CNSNotes = $scope.AnesthesiaDetails.CNSNotes || "";
                        $scope.PreAdmCardioObj.AutoImmuneDisordersNotes = $scope.AnesthesiaDetails.AutoImmuneDisordersNotes || "";

                        $scope.PreAdmCardioObj.IsHeentWNL = $scope.AnesthesiaDetails.IsHeentWNL;
                        $scope.PreAdmCardioObj.IsLungsWNL = $scope.AnesthesiaDetails.IsLungsWNL;
                        $scope.PreAdmCardioObj.HeentNotes = $scope.AnesthesiaDetails.HeentNotes || "";
                        $scope.PreAdmCardioObj.LungsNotes = $scope.AnesthesiaDetails.LungsNotes || "";

                        if ($scope.PreAdmCardioObj.LabObj.IsPretransfusion == "" && $scope.PreAdmCardioObj.LabObj.IsBloodAvailable == "" && $scope.PreAdmCardioObj.LabObj.UrineAnalysis == "" && $scope.PreAdmCardioObj.LabObj.HGB == "" && $scope.PreAdmCardioObj.LabObj.HCT == "" && $scope.PreAdmCardioObj.LabObj.WBC == "" && $scope.PreAdmCardioObj.LabObj.RBC == "" && $scope.PreAdmCardioObj.LabObj.A1C == "" && $scope.PreAdmCardioObj.LabObj.Creatinine == "" &&
                            $scope.PreAdmCardioObj.LabObj.RBS == "" && $scope.PreAdmCardioObj.LabObj.FBS == "" && $scope.PreAdmCardioObj.LabObj.PBBS == "" && $scope.PreAdmCardioObj.LabObj.PBLS == "" && $scope.PreAdmCardioObj.LabObj.Notes == "") {
                            $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = true;
                        }

                        if ($scope.PreAdmCardioObj.CardioVascularObj.Systolic == "" && $scope.PreAdmCardioObj.CardioVascularObj.Diastolic == "" && $scope.PreAdmCardioObj.CardioVascularObj.PR == "" && $scope.PreAdmCardioObj.CardioVascularObj.ECG == "" && $scope.PreAdmCardioObj.CardioVascularObj.ECGUnits == "" &&
                            $scope.PreAdmCardioObj.CardioVascularObj.Notes == "") {
                            $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = false;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = true;
                        }

                        if ($scope.PreAdmCardioObj.RespiratoryNotes != '') {
                            $scope.PreAdmCardioObj.RespiratoryNotesInd = true;
                        } else {
                            $scope.PreAdmCardioObj.RespiratoryNotesInd = false;
                        }
                    }
                }
            }, function (err) {
                console.log(err);
            });
            }, function () {
            });
        };

        $scope.ClearPrescription = function (item, index) {

            if (item.PatientPrescriptionId != 0) {
                item.DeleteInd = "Y";

                if ($scope.PreAdmCardioObj.PrescriptionDetails.length > 0) {
                    var Preslist = $filter("filter")($scope.PreAdmCardioObj.PrescriptionDetails[0].PrescriptionDetails, { "DeleteInd": "N" }, true);
                    Preslist = Preslist || [];
                    if (Preslist.length === 0) {
                        angular.forEach($scope.PreAdmCardioObj.PrescriptionDetails, function (item) {
                            item.DeleteInd = "Y";
                        });
                    }
                }
            } else {
                if ($scope.PreAdmCardioObj.PrescriptionDetails.length > 0) {
                    var Prescriptlist = $filter("filter")($scope.PreAdmCardioObj.PrescriptionDetails[0].PrescriptionDetails, { "MedicationId": item.MedicationId }, true);
                    Prescriptlist = Prescriptlist || [];
                    if (Prescriptlist.length > 0) {
                        $scope.PreAdmCardioObj.PrescriptionDetails[0].PrescriptionDetails.splice(index, 1);
                    }
                    if ($scope.PreAdmCardioObj.PrescriptionDetails[0].PrescriptionDetails.length === 0) {
                        $scope.PreAdmCardioObj.PrescriptionDetails = [];
                    }
                }
            }
        }


        $scope.DeleteHealthPhysicalCardioData = function (item, val) {
            if (item.PreAdmissionId == 0 || item.PreAdmissionId == null) {
                if (val == 1) {
                    $scope.PreAdmCardioObj.LabObj = angular.copy($scope.GetLabObj());
                    if ($scope.PreAdmCardioObj.LabObj.IsPretransfusion == "" && $scope.PreAdmCardioObj.LabObj.IsBloodAvailable == "" && $scope.PreAdmCardioObj.LabObj.UrineAnalysis == "" && $scope.PreAdmCardioObj.LabObj.HGB == "" && $scope.PreAdmCardioObj.LabObj.HCT == "" && $scope.PreAdmCardioObj.LabObj.WBC == "" && $scope.PreAdmCardioObj.LabObj.RBC == "" && $scope.PreAdmCardioObj.LabObj.A1C == "" && $scope.PreAdmCardioObj.LabObj.Creatinine == "" &&
                        $scope.PreAdmCardioObj.LabObj.RBS == "" && $scope.PreAdmCardioObj.LabObj.FBS == "" && $scope.PreAdmCardioObj.LabObj.PBBS == "" && $scope.PreAdmCardioObj.LabObj.PBLS == "" && $scope.PreAdmCardioObj.LabObj.Notes == "") {
                        $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = false;
                    } else {
                        $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = true;
                    }

                }
                if (val == 2) {
                    $scope.PreAdmCardioObj.CardioVascularObj.Systolic = "";
                    $scope.PreAdmCardioObj.CardioVascularObj.Diastolic = "";
                    $scope.PreAdmCardioObj.CardioVascularObj.PR = "";
                    $scope.PreAdmCardioObj.CardioVascularObj.ECG = "";
                    $scope.PreAdmCardioObj.CardioVascularObj.ECGUnits = "";
                    $scope.PreAdmCardioObj.CardioVascularObj.Notes = "";

                    if ($scope.PreAdmCardioObj.CardioVascularObj.Systolic == "" && $scope.PreAdmCardioObj.CardioVascularObj.Diastolic == "" && $scope.PreAdmCardioObj.CardioVascularObj.PR == "" && $scope.PreAdmCardioObj.CardioVascularObj.ECG == "" && $scope.PreAdmCardioObj.CardioVascularObj.ECGUnits == "" &&
                        $scope.PreAdmCardioObj.CardioVascularObj.Notes == "") {
                        $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = false;
                    } else {
                        $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = true;
                    }
                }
             
                if (val == 4) {
                    $scope.PreAdmCardioObj.RespiratoryNotes = '';
                    var RespiratoryData = $filter("filter")($scope.PreAdmCardioObj.HealthArray, { "CategoryId": 13 }, true) || [];
                    if (RespiratoryData.length > 0) {
                        angular.forEach(RespiratoryData, function (pitem) {
                            pitem.IsChecked = false;
                        });
                    }
                }
                if (val == 5) {
                    $scope.PreAdmCardioObj.CNSNotes = "";
                    $scope.PreAdmCardioObj.IsCNSHistory = null;
                }
               
                if (val == 6) {
                    $scope.PreAdmCardioObj.SocialNotes = "";
                    var SocialData = $filter("filter")($scope.PreAdmCardioObj.HealthArray, { "CategoryId": 15 }, true) || [];
                    if (SocialData.length > 0) {
                        angular.forEach(SocialData, function (pitem) {
                            pitem.IsChecked = false;
                        });
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
                            $scope.PreAdmCardioObj.LabObj = angular.copy($scope.GetLabObj());

                            if ($scope.PreAdmCardioObj.LabObj.IsPretransfusion == "" && $scope.PreAdmCardioObj.LabObj.IsBloodAvailable == "" && $scope.PreAdmCardioObj.LabObj.UrineAnalysis == "" && $scope.PreAdmCardioObj.LabObj.HGB == "" && $scope.PreAdmCardioObj.LabObj.HCT == "" && $scope.PreAdmCardioObj.LabObj.WBC == "" && $scope.PreAdmCardioObj.LabObj.RBC == "" && $scope.PreAdmCardioObj.LabObj.A1C == "" && $scope.PreAdmCardioObj.LabObj.Creatinine == "" &&
                                $scope.PreAdmCardioObj.LabObj.RBS == "" && $scope.PreAdmCardioObj.LabObj.FBS == "" && $scope.PreAdmCardioObj.LabObj.PBBS == "" && $scope.PreAdmCardioObj.LabObj.PBLS == "" && $scope.PreAdmCardioObj.LabObj.Notes == "") {
                                $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = false;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = true;
                            }

                        }
                        if (val == 2) {
                            $scope.PreAdmCardioObj.CardioVascularObj.Systolic = "";
                            $scope.PreAdmCardioObj.CardioVascularObj.Diastolic = "";
                            $scope.PreAdmCardioObj.CardioVascularObj.PR = "";
                            $scope.PreAdmCardioObj.CardioVascularObj.ECG = "";
                            $scope.PreAdmCardioObj.CardioVascularObj.ECGUnits = "";
                            $scope.PreAdmCardioObj.CardioVascularObj.Notes = "";

                            if ($scope.PreAdmCardioObj.CardioVascularObj.Systolic == "" && $scope.PreAdmCardioObj.CardioVascularObj.Diastolic == "" && $scope.PreAdmCardioObj.CardioVascularObj.PR == "" && $scope.PreAdmCardioObj.CardioVascularObj.ECG == "" && $scope.PreAdmCardioObj.CardioVascularObj.ECGUnits == "" &&
                                $scope.PreAdmCardioObj.CardioVascularObj.Notes == "") {
                                $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = false;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = true;
                            }
                        }
                       
                        if (val == 4) {
                            $scope.PreAdmCardioObj.RespiratoryNotes = '';
                            var RespiratoryData = $filter("filter")($scope.PreAdmCardioObj.HealthArray, { "CategoryId": 13 }, true) || [];
                            if (RespiratoryData.length > 0) {
                                angular.forEach(RespiratoryData, function (pitem) {
                                    pitem.IsChecked = false;
                                });
                            }
                        }
                        if (val == 5) {
                            $scope.PreAdmCardioObj.CNSNotes = "";
                            $scope.PreAdmCardioObj.IsCNSHistory = null;

                          
                        }
                        if (val == 6) {
                            $scope.PreAdmCardioObj.SocialNotes = "";
                            var SocialData = $filter("filter")($scope.PreAdmCardioObj.HealthArray, { "CategoryId": 15 }, true) || [];
                            if (SocialData.length > 0) {
                                angular.forEach(SocialData, function (pitem) {
                                    pitem.IsChecked = false;
                                });
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
                $scope.ChangeTab(5);
            } else if (data == 2) {
                $scope.init();
            } else if (data == 3) {
                $scope.ChangeTab(12);
            }
        });

        $scope.SelectUrineAnalysis = function (val) {
            if (val == 1) {
                if ($scope.PreAdmCardioObj.LabObj.UrineAnalysis == "" || $scope.PreAdmCardioObj.LabObj.UrineAnalysis == "NEGATIVE") {
                    $scope.PreAdmCardioObj.LabObj.UrineAnalysis = "POSITIVE";
                } else {
                    $scope.PreAdmCardioObj.LabObj.UrineAnalysis = "";
                }
            }
            if (val == 2) {
                if ($scope.PreAdmCardioObj.LabObj.UrineAnalysis == "" || $scope.PreAdmCardioObj.LabObj.UrineAnalysis == "POSITIVE") {
                    $scope.PreAdmCardioObj.LabObj.UrineAnalysis = "NEGATIVE";
                } else {
                    $scope.PreAdmCardioObj.LabObj.UrineAnalysis = "";
                }
            }
        }

        $scope.SelectBloodAvailability = function (val) {
            if (val == 1) {
                if ($scope.PreAdmCardioObj.LabObj.IsBloodAvailable == "" || $scope.PreAdmCardioObj.LabObj.IsBloodAvailable == "No") {
                    $scope.PreAdmCardioObj.LabObj.IsBloodAvailable = "Yes";
                } else {
                    $scope.PreAdmCardioObj.LabObj.IsBloodAvailable = "";
                }
            }
            if (val == 2) {
                if ($scope.PreAdmCardioObj.LabObj.IsBloodAvailable == "" || $scope.PreAdmCardioObj.LabObj.IsBloodAvailable == "Yes") {
                    $scope.PreAdmCardioObj.LabObj.IsBloodAvailable = "No";
                } else {
                    $scope.PreAdmCardioObj.LabObj.IsBloodAvailable = "";
                }
            }
        }

        $scope.SelectPreTransfusion = function (val) {
            if (val == 1) {
                if ($scope.PreAdmCardioObj.LabObj.IsPretransfusion == "" || $scope.PreAdmCardioObj.LabObj.IsPretransfusion == "No") {
                    $scope.PreAdmCardioObj.LabObj.IsPretransfusion = "Yes";
                } else {
                    $scope.PreAdmCardioObj.LabObj.IsPretransfusion = "";
                }
            }
            if (val == 2) {
                if ($scope.PreAdmCardioObj.LabObj.IsPretransfusion == "" || $scope.PreAdmCardioObj.LabObj.IsPretransfusion == "Yes") {
                    $scope.PreAdmCardioObj.LabObj.IsPretransfusion = "No";
                } else {
                    $scope.PreAdmCardioObj.LabObj.IsPretransfusion = "";
                }
            }
        }

        $scope.SelectCXR = function (val) {
            if (val == 1) {
                if ($scope.PreAdmCardioObj.IsCXR == "" || $scope.PreAdmCardioObj.IsCXR == "No") {
                    $scope.PreAdmCardioObj.IsCXR = "Yes";
                } else {
                    $scope.PreAdmCardioObj.IsCXR = "";
                }
            }
            if (val == 2) {
                if ($scope.PreAdmCardioObj.IsCXR == "" || $scope.PreAdmCardioObj.IsCXR == "Yes") {
                    $scope.PreAdmCardioObj.IsCXR = "No";
                } else {
                    $scope.PreAdmCardioObj.IsCXR = "";
                }
            }
        }

        $scope.SelectCXRHistory = function (val) {
            if (val == 1) {
                if ($scope.PreAdmCardioObj.CXRHistory == "" || $scope.PreAdmCardioObj.CXRHistory == "No") {
                    $scope.PreAdmCardioObj.CXRHistory = "Yes";
                } else {
                    $scope.PreAdmCardioObj.CXRHistory = "";
                }
            }
            if (val == 2) {
                if ($scope.PreAdmCardioObj.CXRHistory == "" || $scope.PreAdmCardioObj.CXRHistory == "Yes") {
                    $scope.PreAdmCardioObj.CXRHistory = "No";
                } else {
                    $scope.PreAdmCardioObj.CXRHistory = "";
                }
            }
        }

        $scope.SelectCardiovascularHistoryBtn = function (val) {
            if (val === 1) {
                if ($scope.PreAdmCardioObj.IsCardiovascularHistory === false && $scope.PreAdmCardioObj.IsCardiovascularHistory != null) {
                    $scope.PreAdmCardioObj.IsCardiovascularHistory = null;
                } else {
                    $scope.PreAdmCardioObj.IsCardiovascularHistory = false;
                }
            }
            if (val === 2) {
                if ($scope.PreAdmCardioObj.IsCardiovascularHistory) {
                    $scope.PreAdmCardioObj.IsCardiovascularHistory = null;
                } else {
                    $scope.PreAdmCardioObj.IsCardiovascularHistory = true;
                }
            }
        };

        $scope.SelectCardiovascularBpBtn = function (val) {
            if (val == 1) {
                if ($scope.PreAdmCardioObj.CardioVascularObj.BPlevel == "" || $scope.PreAdmCardioObj.CardioVascularObj.BPlevel == "Low") {
                    $scope.PreAdmCardioObj.CardioVascularObj.BPlevel = "High";
                } else {
                    $scope.PreAdmCardioObj.CardioVascularObj.BPlevel = "";
                }
            }
            if (val == 2) {
                if ($scope.PreAdmCardioObj.CardioVascularObj.BPlevel == "" || $scope.PreAdmCardioObj.CardioVascularObj.BPlevel == "High") {
                    $scope.PreAdmCardioObj.CardioVascularObj.BPlevel = "Low";
                } else {
                    $scope.PreAdmCardioObj.CardioVascularObj.BPlevel = "";
                }
            }
        }

        $scope.ToggleOtherSystemBtn = function (value, item) {
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

        $scope.CardiologistselectedImgsHandP = function (CardiologistFiles) {

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
                            "FileTypeId": 28,
                            "DisplayName": $scope.CardiologistFiles.name || ""
                        };

                        $scope.CardiologistFilesObj.TempImagesArray.push(obj);

                        angular.element("input[type='file']").val(null);
                    }
                });
            }
        };

        $scope.PreAdmCardioSignOff = function () {

            let obj = {
                "Screen": "Cardiology PreAdmission",
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
                $scope.SavePreAdmissionCardioDetails("SignOff");
            }, function (data) {

            });
        };

        $scope.SelectChestPain = function (val) {
            if (val == 1) {
                if ($scope.PreAdmCardioObj.IsChestPain == null || $scope.PreAdmCardioObj.IsChestPain == false) {
                    $scope.PreAdmCardioObj.IsChestPain = true;
                } else {
                    $scope.PreAdmCardioObj.IsChestPain = null;
                }
            }
            if (val == 2) {
                if ($scope.PreAdmCardioObj.IsChestPain == null || $scope.PreAdmCardioObj.IsChestPain == true) {
                    $scope.PreAdmCardioObj.IsChestPain = false;
                } else {
                    $scope.PreAdmCardioObj.IsChestPain = null;
                }
            }
        }

        $scope.USCardiologyshownotes = {
            "Cardiologynotes1": false,
            "Cardiologynotes2": false,
            "Cardiologynotes3": false,
        }

        $scope.ClearCardioECGvalue = function (item) {

            if (item == '') {
                $scope.PreAdmCardioObj.CardioVascularObj.ECGUnits = 'select';
            }
        }

        $scope.ShowFilesPopup = function () {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/FilesPopUp.html",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__popup--1 bottom-to-top-modal in  ",
                //"windowClass": "offcanves-right",
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

    }]);
"use strict";
eHnoteWebApp.controller("UsOverallPreAdmSummaryCtrl", ["$scope", "$rootScope", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteSurgeryService", "eHnoteCacheStorageService", "eHnoteAuditServices", "$uibModal", "eHnoteMainAppointmentService", "eHnoteDiagnosisDataServices", "datapersistanceFactory", "eHnotePatientDataService", "$q",
    function ($scope, $rootScope, $filter, alertify, eHnoteMasterDataService, eHnoteSurgeryService, eHnoteCacheStorageService, eHnoteAuditServices, $uibModal, eHnoteMainAppointmentService, eHnoteDiagnosisDataServices, datapersistanceFactory, eHnotePatientDataService, $q) {

        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();
        appointmentInfo.AppointmentTypeId = 7;
        eHnoteMasterDataService.addAppointmentInfo(appointmentInfo);
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

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

        $scope.GetPreAdmAnesthetistParentObj = function () {
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
                    "Notes": ""
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
                "InvestigationsList": [],
                "IsRespiratoryNormal": false,
                "PreAdminRespiratoryInd": false,
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
                }],
                "ReviewedDate": "",
                "ReviewedTime": "",
                "IsCXR": "",
                "CXRHistory": "",
                "PrescriptionDetails": [],
                "CurrentSystemicMedicationsHistory": [],
                "OtherSystemArray": [],
            };
        };

        $scope.PreAdmAnesthetistSummaryObj = angular.copy($scope.GetPreAdmAnesthetistParentObj());


        $scope.GetPreAdmCardioSummaryObj = function () {
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
                "PreAdminCardRespiratoryInd":false,
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
                "PrescriptionDetails": [],
                "CardiologistDiagnosis": [],
                "OtherSystemArray": [],
                "IsChestPain": null
            };
        };

        $scope.PreAdmCardioSummaryObj = angular.copy($scope.GetPreAdmCardioSummaryObj());

        $scope.PreAdmissionParentobj = {
            "SystemicHistory": [],
            "AllergyItems": [],
            "SurgicalHistory": [],
            "CurrentEyeMedications": [],
            "CurrentSystemicMedicationsHistory": [],
            "ROSOverAllRemarks": ""
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

        $scope.GetPreviousAnesthetics = function () {
            return {
                "IsPrevAnesthesia": false,
                "IsComplications": null,
                "IsFamilyHistory": false,
                "IsDifficultAirway": false,
                "IsPONV": false,
                "IsPatientDNR": false,
                "IsSuspend": false,
                "IsContinue": false,
                "Notes": ""
            };
        };

        $scope.GetPreAdmAPAnesthesiaOptionsObj = function () {
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
                "AnesthetistName": "",
                "AnesthetistNotes": ""
            };
        };

        $scope.GetPreAdmLabObj = function () {
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

        $scope.GetCardioLabObj = function () {
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
                $scope.PreAdmCardioSummaryObj.SelectedCardiacIssues = tempCardiacArray.join(", ");
            } else {
                $scope.PreAdmCardioSummaryObj.SelectedCardiacIssues = "";
            }
            if (tempPulmonaryArray.length > 0) {
                $scope.PreAdmCardioSummaryObj.SelectedPulmonaryIssues = tempPulmonaryArray.join(", ");
            } else {
                $scope.PreAdmCardioSummaryObj.SelectedPulmonaryIssues = "";
            }
            if (tempHepaticArray.length > 0) {
                $scope.PreAdmCardioSummaryObj.SelectedHepaticIssues = tempHepaticArray.join(", ");
            } else {
                $scope.PreAdmCardioSummaryObj.SelectedHepaticIssues = "";
            }
            if (tempEndocrineArray.length > 0) {
                $scope.PreAdmCardioSummaryObj.SelectedEndocrineIssues = tempEndocrineArray.join(", ");
            } else {
                $scope.PreAdmCardioSummaryObj.SelectedEndocrineIssues = "";
            }
            if (tempNeurologicArray.length > 0) {
                $scope.PreAdmCardioSummaryObj.SelectedNeurologicIssues = tempNeurologicArray.join(", ");
            } else {
                $scope.PreAdmCardioSummaryObj.SelectedNeurologicIssues = "";
            }
            if (tempHemeOneArray.length > 0) {
                $scope.PreAdmCardioSummaryObj.SelectedHemeOncIssues = tempHemeOneArray.join(", ");
            } else {
                $scope.PreAdmCardioSummaryObj.SelectedHemeOncIssues = "";
            }
            if (tempNervousSystemArray.length > 0) {
                $scope.PreAdmCardioSummaryObj.SelectedNervousSystemIssues = tempNervousSystemArray.join(", ");
            } else {
                $scope.PreAdmCardioSummaryObj.SelectedNervousSystemIssues = "";
            }
            if (tempKidneyDiseaseArray.length > 0) {
                $scope.PreAdmCardioSummaryObj.SelectedKidneyDiseaseIssues = tempKidneyDiseaseArray.join(", ");
            } else {
                $scope.PreAdmCardioSummaryObj.SelectedKidneyDiseaseIssues = "";
            }
            if (tempMusculoSkeletalArray.length > 0) {
                $scope.PreAdmCardioSummaryObj.SelectedMusculoSkeletalSystemIssues = tempMusculoSkeletalArray.join(", ");
            } else {
                $scope.PreAdmCardioSummaryObj.SelectedMusculoSkeletalSystemIssues = "";
            }
            if (tempAutoImmuneArray.length > 0) {
                $scope.PreAdmCardioSummaryObj.SelectedAutoImmuneDisordersIssues = tempAutoImmuneArray.join(", ");
            } else {
                $scope.PreAdmCardioSummaryObj.SelectedAutoImmuneDisordersIssues = "";
            }
            if (tempPsychosisArray.length > 0) {
                $scope.PreAdmCardioSummaryObj.SelectedPsychosisIssues = tempPsychosisArray.join(", ");
            } else {
                $scope.PreAdmCardioSummaryObj.SelectedPsychosisIssues = "";
            }
            if (tempOthersArray.length > 0) {
                $scope.PreAdmCardioSummaryObj.SelectedOthersIssues = tempOthersArray.join(", ");
            } else {
                $scope.PreAdmCardioSummaryObj.SelectedOthersIssues = "";
            }
            if (respiratoryArray.length > 0) {
                $scope.PreAdmCardioSummaryObj.SelectedrespIssues = respiratoryArray.join(", ");
            } else {
                $scope.PreAdmCardioSummaryObj.SelectedrespIssues = "";
            }
            if (socialArray.length > 0) {
                $scope.PreAdmCardioSummaryObj.SelectedsocialIssues = socialArray.join(", ");
            } else {
                $scope.PreAdmCardioSummaryObj.SelectedsocialIssues = "";
            }
            if (HeentArray.length > 0) {
                $scope.PreAdmCardioSummaryObj.SelectedHeentIssues = HeentArray.join(", ");
            } else {
                $scope.PreAdmCardioSummaryObj.SelectedHeentIssues = "";
            }
            if (LungsArray.length > 0) {
                $scope.PreAdmCardioSummaryObj.SelectedLungsIssues = LungsArray.join(", ");
            } else {
                $scope.PreAdmCardioSummaryObj.SelectedLungsIssues = "";
            }

        }
        $scope.IsSocialHealthArrayShow = false;
        $scope.GetASCPreAdmissionSummary = function () {

            let ReqObj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
            };

            $q.all([
                eHnoteSurgeryService.GetASCPreAdmissionSummary(ReqObj),

            ]).then(function (resp) {
                if (resp[0].data.status === "Success") {

                    $scope.SurgeryList = [];

                    if (resp[0].data.SurgeryArray.length > 0) {

                        let temparray1 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[0].data.SurgeryArray[0].ExternalCoManagerId }, true);
                        if (temparray1.length > 0) {
                            $scope.PatientDetailsObj.ExternalCoManager = temparray1[0].FullName;
                        }

                        let temparray2 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[0].data.SurgeryArray[0].InternalCoManagerId }, true);
                        if (temparray2.length > 0) {
                            $scope.PatientDetailsObj.InternalCoManager = temparray2[0].FullName;
                        }

                        $scope.PreAdmAnesthetistSummaryObj.AscAppointmentId = resp[0].data.SurgeryArray[0].AscAppointmentId || null;
                        $scope.PreAdmAnesthetistSummaryObj.AscAppointmentDate = resp[0].data.SurgeryArray[0].AscAppointmentDate || null;
                        $scope.PreAdmAnesthetistSummaryObj.FirstFollowupApptId = resp[0].data.SurgeryArray[0].FirstFollowupAppointmentId || null;
                        $scope.PreAdmAnesthetistSummaryObj.FirstFollowupDate = resp[0].data.SurgeryArray[0].FirstFollowupDate || null;
                        $scope.PreAdmAnesthetistSummaryObj.SecondFollowupApptId = resp[0].data.SurgeryArray[0].SecondFollowupAppointmentId || null;
                        $scope.PreAdmAnesthetistSummaryObj.SecondFollowupDate = resp[0].data.SurgeryArray[0].SecondFollowupDate || null;
                        $scope.PreAdmAnesthetistSummaryObj.ThirdFollowupApptId = resp[0].data.SurgeryArray[0].ThirdFollowupAppointmentId || null;
                        $scope.PreAdmAnesthetistSummaryObj.ThirdFollowupDate = resp[0].data.SurgeryArray[0].ThirdFollowupDate || null;

                    }

                    // ROS

                    if (resp[0].data.CurrentSystemicMedicationList.length > 0) {
                        $scope.PreAdmissionParentobj.CurrentSystemicMedicationsHistory = angular.copy(resp[0].data.CurrentSystemicMedicationList);
                    }

                    if (resp[0].data.CurrentEyeMedicationList.length > 0) {
                        $scope.PreAdmissionParentobj.CurrentEyeMedications = angular.copy(resp[0].data.CurrentEyeMedicationList);
                    }

                    if (resp[0].data.AllergyItems.length > 0) {
                        $scope.PreAdmissionParentobj.AllergyItems = angular.copy(resp[0].data.AllergyItems);
                    }
                    if (resp[0].data.SystemicHistory.length > 0) {
                        $scope.PreAdmissionParentobj.SystemicHistory = angular.copy(resp[0].data.SystemicHistory);
                    }
                    if (resp[0].data.SurgicalHistory.length > 0) {
                        $scope.PreAdmissionParentobj.SurgicalHistory = angular.copy(resp[0].data.SurgicalHistory);
                    }

                    if (resp[0].data.PreAdmissionDetails.length > 0) {
                        $scope.AnesthesiaPreAdmissionDetails = angular.copy(resp[0].data.PreAdmissionDetails);
                        $scope.PreAdmAnesthetistSummaryObj.AnesthesiaTypelist = $scope.AnesthesiaPreAdmissionDetails[0].AnesthesiaTypelist;
                        var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.AnesthesiaPreAdmissionDetails[0].ReviwedBy }, true)[0] || [];
                        $scope.PreAdmAnesthetistSummaryObj.ReviewByName = ReviewName.FullName || '';
                        $scope.PreAdmAnesthetistSummaryObj.ReviewedDate = $scope.AnesthesiaPreAdmissionDetails[0].ReviewedDate || "";
                        $scope.PreAdmAnesthetistSummaryObj.ReviewedTime = $scope.AnesthesiaPreAdmissionDetails[0].Reviewedtime || "";
                        let currentDate = moment().format("YYYY-MM-DD");
                        if ($scope.PreAdmAnesthetistSummaryObj.ReviewedTime !== '') {
                            let edate = currentDate + " " + $scope.PreAdmAnesthetistSummaryObj.ReviewedTime;
                            let parsedDateTime = moment(edate, "YYYY-MM-DD hh:mm a");
                            $scope.PreAdmAnesthetistSummaryObj.ReviewedTime = parsedDateTime.format("hh:mm a");
                        }
                        //let ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                        //if ($scope.PreAdmAnesthetistSummaryObj.ReviewedTime != '') {
                        //    let edate = ndate + " " + $scope.PreAdmAnesthetistSummaryObj.ReviewedTime;
                        //    $scope.PreAdmAnesthetistSummaryObj.ReviewedTime = $filter('date')(new Date(edate), "hh:mm a");
                        //}
                        $scope.PreAdmissionDetails = angular.copy(resp[0].data.PreAdmissionDetails[0]);

                        $scope.PreAdmAnesthetistSummaryObj.StatusFlag = $scope.PreAdmissionDetails.StatusFlag;
                        $scope.PreAdmAnesthetistSummaryObj.PreAdmissionChartStatus = $scope.PreAdmissionDetails.PreAdmissionChartStatus;

                        if ($scope.PreAdmissionDetails !== undefined) {

                            $scope.PreAdmAnesthetistSummaryObj.PreAdmissionId = $scope.PreAdmissionDetails.PreAdmissionId;
                            $scope.PreAdmAnesthetistSummaryObj.PreAdmissionApptId = $scope.PreAdmissionDetails.AppointmentId;
                            $scope.PreAdmAnesthetistSummaryObj.PreAdmissionApptDate = $filter('date')($scope.PreAdmissionDetails.AppointmentDate, "MM-dd-yyyy");
                            $scope.PreAdmAnesthetistSummaryObj.IsCXR = $scope.PreAdmissionDetails.IsCXR || "";
                            $scope.PreAdmAnesthetistSummaryObj.CXRHistory = $scope.PreAdmissionDetails.CXRHistory || "";

                            $scope.PreAdmissionParentobj.ROSOverAllRemarks = angular.copy($scope.PreAdmissionDetails.ROSOverAllRemarks);

                            if ($scope.PreAdmAnesthetistSummaryObj.ROSOverAllRemarks != "" || $scope.PreAdmAnesthetistSummaryObj.ROSOverAllRemarks != null) {
                                $scope.PreAdmAnesthetistSummaryObj.IsROSOverAllRemarksInd = true;
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.IsROSOverAllRemarksInd = false;
                            }

                            if ($scope.PreAdmissionDetails.VitalsArray.length > 0) {

                                angular.forEach($scope.PreAdmissionDetails.VitalsArray, function (vitem) {
                                    var vitallist = [];
                                    vitallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == vitem.DoctorId }) || [];
                                    if (vitallist.length > 0) {
                                        vitem.UserName = angular.copy(vitallist[0].FullName);
                                    }
                                    let ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                                    let edate = ndate + " " + vitem.VitalAddTime;

                                    vitem.VitalAddTime = $filter('date')(new Date(edate), "hh:mm a");
                                });

                                $scope.PreAdmAnesthetistSummaryObj.Vitals = angular.copy($scope.PreAdmissionDetails.VitalsArray);
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.Vitals = [];
                            }


                            $scope.PreAdmAnesthetistSummaryObj.LabObj = $scope.GetPreAdmLabObj();
                            $scope.PreAdmAnesthetistSummaryObj.LabObj.HGB = $scope.PreAdmissionDetails.LabTest.HGB;
                            $scope.PreAdmAnesthetistSummaryObj.LabObj.HCT = $scope.PreAdmissionDetails.LabTest.HCT;
                            $scope.PreAdmAnesthetistSummaryObj.LabObj.WBC = $scope.PreAdmissionDetails.LabTest.WBC;
                            $scope.PreAdmAnesthetistSummaryObj.LabObj.RBC = $scope.PreAdmissionDetails.LabTest.RBC;
                            $scope.PreAdmAnesthetistSummaryObj.LabObj.A1C = $scope.PreAdmissionDetails.LabTest.A1C;
                            $scope.PreAdmAnesthetistSummaryObj.LabObj.Creatinine = $scope.PreAdmissionDetails.LabTest.Creatinine;
                            $scope.PreAdmAnesthetistSummaryObj.LabObj.RBS = $scope.PreAdmissionDetails.LabTest.RBS;
                            $scope.PreAdmAnesthetistSummaryObj.LabObj.FBS = $scope.PreAdmissionDetails.LabTest.FBS;
                            $scope.PreAdmAnesthetistSummaryObj.LabObj.PBBS = $scope.PreAdmissionDetails.LabTest.PBBS;
                            $scope.PreAdmAnesthetistSummaryObj.LabObj.PBLS = $scope.PreAdmissionDetails.LabTest.PBLS;
                            $scope.PreAdmAnesthetistSummaryObj.LabObj.Notes = $scope.PreAdmissionDetails.LabTest.Notes || "";
                            $scope.PreAdmAnesthetistSummaryObj.LabObj.Others = $scope.PreAdmissionDetails.LabTest.Others || "";
                            $scope.PreAdmAnesthetistSummaryObj.LabObj.IsBloodAvailable = $scope.PreAdmissionDetails.LabTest.IsBloodAvailable || "";
                            $scope.PreAdmAnesthetistSummaryObj.LabObj.IsPretransfusion = $scope.PreAdmissionDetails.LabTest.IsPretransfusion || "";
                            $scope.PreAdmAnesthetistSummaryObj.LabObj.UrineAnalysis = $scope.PreAdmissionDetails.LabTest.UrineAnalysis || "";
                            $scope.PreAdmissionDetails.LabTest.TestArray = $scope.PreAdmissionDetails.LabTest.TestArray || [];
                            if ($scope.PreAdmissionDetails.LabTest.TestArray.length > 0) {
                                $scope.PreAdmAnesthetistSummaryObj.LabObj.LabTestArray = $scope.PreAdmissionDetails.LabTest.TestArray;
                            }

                            if ($scope.PreAdmAnesthetistSummaryObj.LabObj.RBS != "" || $scope.PreAdmAnesthetistSummaryObj.LabObj.FBS != "" || $scope.PreAdmAnesthetistSummaryObj.LabObj.PBBS != "" || $scope.PreAdmAnesthetistSummaryObj.LabObj.PBLS != "" || $scope.PreAdmAnesthetistSummaryObj.LabObj.PBLS != "" || $scope.PreAdmAnesthetistSummaryObj.LabObj.Others != "") {
                                $scope.IsDiabetesEnable = "true";
                            }
                            else {
                                $scope.IsDiabetesEnable = "false";
                            }


                            $scope.PreAdmissionDetails.CardioVascular = $scope.PreAdmissionDetails.CardioVascular || "";
                            if ($scope.PreAdmissionDetails.CardioVascular != "") {
                                $scope.PreAdmAnesthetistSummaryObj.CardioVascularObj.Systolic = $scope.PreAdmissionDetails.CardioVascular.Systolic;
                                $scope.PreAdmAnesthetistSummaryObj.CardioVascularObj.Diastolic = $scope.PreAdmissionDetails.CardioVascular.Diastolic;
                                $scope.PreAdmAnesthetistSummaryObj.CardioVascularObj.PR = $scope.PreAdmissionDetails.CardioVascular.PR;
                                $scope.PreAdmAnesthetistSummaryObj.CardioVascularObj.ECG = $scope.PreAdmissionDetails.CardioVascular.ECG;
                                $scope.PreAdmAnesthetistSummaryObj.CardioVascularObj.ECGUnits = $scope.PreAdmissionDetails.CardioVascular.ECGUnits;
                                $scope.PreAdmAnesthetistSummaryObj.CardioVascularObj.Notes = $scope.PreAdmissionDetails.CardioVascular.Notes || "";
                                $scope.PreAdmAnesthetistSummaryObj.CardioVascularObj.BPlevel = $scope.PreAdmissionDetails.CardioVascular.BPlevel || "";
                            }

                            $scope.PreAdmissionDetails.Airway = $scope.PreAdmissionDetails.Airway || '';
                            if ($scope.PreAdmissionDetails.Airway != '') {
                                $scope.PreAdmAnesthetistSummaryObj.AirwayObj.ROMTMS = $scope.PreAdmissionDetails.Airway.ROMTMS;
                                $scope.PreAdmAnesthetistSummaryObj.AirwayObj.ROMNECKLAT = $scope.PreAdmissionDetails.Airway.ROMNECKLAT;
                                $scope.PreAdmAnesthetistSummaryObj.AirwayObj.ROMNECKAP = $scope.PreAdmissionDetails.Airway.ROMNECKAP;
                                $scope.PreAdmAnesthetistSummaryObj.AirwayObj.Notes = $scope.PreAdmissionDetails.Airway.Notes || "";
                                $scope.PreAdmAnesthetistSummaryObj.AirwayObj.IsNormal = $scope.PreAdmissionDetails.Airway.IsNormal;
                                $scope.PreAdmAnesthetistSummaryObj.AirwayObj.Class = $scope.PreAdmissionDetails.Airway.Class;
                                $scope.PreAdmAnesthetistSummaryObj.AirwayObj.Dentition = $scope.PreAdmissionDetails.Airway.Dentition || "";
                            }

                            $scope.PreAdmissionDetails.AnesthesiaPlan = $scope.PreAdmissionDetails.AnesthesiaPlan || "";
                            if ($scope.PreAdmissionDetails.AnesthesiaPlan != "") {
                                $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj = angular.copy($scope.GetPreAdmAPAnesthesiaOptionsObj());
                                $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.IsTopicalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsTopicalAnesthesia;
                                $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.IsGeneralAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsGeneralAnesthesia;
                                $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.IsLocalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsLocalAnesthesia;
                                $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsPeriBulbarAnesthesia;
                                $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.IsRegionalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsRegionalAnesthesia;
                                $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.IsSubtenonAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsSubtenonAnesthesia;
                                $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.IsIVSedation = $scope.PreAdmissionDetails.AnesthesiaPlan.IsIVSedation;
                                $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.Dosage = $scope.PreAdmissionDetails.AnesthesiaPlan.Dosage;
                                $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.AnesthetistId = $scope.PreAdmissionDetails.AnesthesiaPlan.AnesthetistId;
                                $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.AnesthetistNotes = $scope.PreAdmissionDetails.AnesthesiaPlan.AnesthetistNotes;
                            }

                            if ($scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.Dosage == "" && $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.AnesthetistId == null && $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.IsTopicalAnesthesia == false && $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.IsLocalAnesthesia == false && $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.IsGeneralAnesthesia == false &&
                                $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.IsRegionalAnesthesia==false && $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia==false && $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.IsSubtenonAnesthesia == false && $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.IsIVSedation == false && $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.AnesthetistName == "" && $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.AnesthetistNotes == "") {
                                $scope.PreAdmAnesthetistSummaryObj.IsPrAdmAssPlanInd = false;
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.IsPrAdmAssPlanInd = true;
                            }

                            $scope.PreAdmissionDetails.AssessmentsASA = $scope.PreAdmissionDetails.AssessmentsASA || "";
                            if ($scope.PreAdmissionDetails.AssessmentsASA != "") {
                                $scope.PreAdmAnesthetistSummaryObj.ASAObj.Notes = $scope.PreAdmissionDetails.AssessmentsASA.Notes || "";
                                $scope.PreAdmAnesthetistSummaryObj.ASAObj.Value = $scope.PreAdmissionDetails.AssessmentsASA.Value;
                            }

                            if ($scope.PreAdmAnesthetistSummaryObj.ASAObj.Notes == "" && $scope.PreAdmAnesthetistSummaryObj.ASAObj.Value == "") {
                                $scope.PreAdmAnesthetistSummaryObj.IsPrAdmAssessmentInd = false;
                            }
                            else {
                                $scope.PreAdmAnesthetistSummaryObj.IsPrAdmAssessmentInd = true;
                            }

                            $scope.PreAdmissionDetails.PrevAnesthesia = $scope.PreAdmissionDetails.PrevAnesthesia || "";
                            if ($scope.PreAdmissionDetails.PrevAnesthesia != "") {
                                $scope.PreAdmAnesthetistSummaryObj.PrevAnestheticsObj = angular.copy($scope.GetPreviousAnesthetics());
                                $scope.PreAdmAnesthetistSummaryObj.PrevAnestheticsObj.Notes = $scope.PreAdmissionDetails.PrevAnesthesia.Notes || "";
                                $scope.PreAdmAnesthetistSummaryObj.PrevAnestheticsObj.IsComplications = $scope.PreAdmissionDetails.PrevAnesthesia.IsComplications;
                                $scope.PreAdmAnesthetistSummaryObj.PrevAnestheticsObj.IsContinue = $scope.PreAdmissionDetails.PrevAnesthesia.IsContinue;
                                $scope.PreAdmAnesthetistSummaryObj.PrevAnestheticsObj.IsDifficultAirway = $scope.PreAdmissionDetails.PrevAnesthesia.IsDifficultAirway;
                                $scope.PreAdmAnesthetistSummaryObj.PrevAnestheticsObj.IsFamilyHistory = $scope.PreAdmissionDetails.PrevAnesthesia.IsFamilyHistory;
                                $scope.PreAdmAnesthetistSummaryObj.PrevAnestheticsObj.IsPONV = $scope.PreAdmissionDetails.PrevAnesthesia.IsPONV;
                                $scope.PreAdmAnesthetistSummaryObj.PrevAnestheticsObj.IsPatientDNR = $scope.PreAdmissionDetails.PrevAnesthesia.IsPatientDNR;
                                $scope.PreAdmAnesthetistSummaryObj.PrevAnestheticsObj.IsPrevAnesthesia = $scope.PreAdmissionDetails.PrevAnesthesia.IsPrevAnesthesia;
                                $scope.PreAdmAnesthetistSummaryObj.PrevAnestheticsObj.IsSuspend = $scope.PreAdmissionDetails.PrevAnesthesia.IsSuspend;
                            }

                            angular.forEach($scope.PreAdmAnesthetistSummaryObj.HealthArray, function (item) {
                                let temparray = $filter('filter')($scope.PreAdmissionDetails.HealthArray, { "Id": item.Id }, true);
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
                            
                            var SHealthArray = $filter("filter")($scope.PreAdmAnesthetistSummaryObj.HealthArray, function (Nitem) {
                                return (Nitem.CategoryId == 15) && (Nitem.IsChecked === true || Nitem.IsChecked === false);
                            }) || [];
                            if (SHealthArray.length > 0) {
                                $scope.IsSocialHealthArrayShow = true;

                            }
                            $scope.PreAdmAnesthetistSummaryObj.PreAdminRespiratoryInd = false;
                            if ($scope.PreAdmAnesthetistSummaryObj.HealthArray.length>0) {
                                var Resprotary = $filter("filter")($scope.PreAdmAnesthetistSummaryObj.HealthArray, { "CategoryId": 13, "IsChecked": true  });
                                if (Resprotary.length > 0 || $scope.PreAdmAnesthetistSummaryObj.CXRHistory == 'No' || $scope.PreAdmAnesthetistSummaryObj.CXRHistory == 'Yes' || $scope.PreAdmAnesthetistSummaryObj.IsCXR == 'Yes' || $scope.PreAdmAnesthetistSummaryObj.IsCXR == 'No' || $scope.PreAdmAnesthetistSummaryObj.RespiratoryNotes != '') {
                                    $scope.PreAdmAnesthetistSummaryObj.PreAdminRespiratoryInd = true;
                                }
                                else {
                                    $scope.PreAdmAnesthetistSummaryObj.PreAdminRespiratoryInd = false;
                                }
                            }
                         
                            let tempHealthArray = angular.copy($scope.PreAdmissionDetails.HealthArray);

                          
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
                                $scope.PreAdmAnesthetistSummaryObj.SelectedCardiacIssues = tempCardiacArray.join(", ");
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedCardiacIssues = "";
                            }
                            if (tempPulmonaryArray.length > 0) {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedPulmonaryIssues = tempPulmonaryArray.join(", ");
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedPulmonaryIssues = "";
                            }
                            if (tempHepaticArray.length > 0) {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedHepaticIssues = tempHepaticArray.join(", ");
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedHepaticIssues = "";
                            }
                            if (tempEndocrineArray.length > 0) {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedEndocrineIssues = tempEndocrineArray.join(", ");
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedEndocrineIssues = "";
                            }
                            if (tempNeurologicArray.length > 0) {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedNeurologicIssues = tempNeurologicArray.join(", ");
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedNeurologicIssues = "";
                            }
                            if (tempHemeOneArray.length > 0) {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedHemeOncIssues = tempHemeOneArray.join(", ");
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedHemeOncIssues = "";
                            }
                            if (tempNervousSystemArray.length > 0) {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedNervousSystemIssues = tempNervousSystemArray.join(", ");
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedNervousSystemIssues = "";
                            }
                            if (tempKidneyDiseaseArray.length > 0) {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedKidneyDiseaseIssues = tempKidneyDiseaseArray.join(", ");
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedKidneyDiseaseIssues = "";
                            }
                            if (tempMusculoSkeletalArray.length > 0) {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedMusculoSkeletalSystemIssues = tempMusculoSkeletalArray.join(", ");
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedMusculoSkeletalSystemIssues = "";
                            }
                            if (tempAutoImmuneArray.length > 0) {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedAutoImmuneDisordersIssues = tempAutoImmuneArray.join(", ");
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedAutoImmuneDisordersIssues = "";
                            }
                            if (tempPsychosisArray.length > 0) {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedPsychosisIssues = tempPsychosisArray.join(", ");
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedPsychosisIssues = "";
                            }
                            if (tempOthersArray.length > 0) {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedOthersIssues = tempOthersArray.join(", ");
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedOthersIssues = "";
                            }
                            if (tempHeentArray.length > 0) {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedHeentIssues = tempHeentArray.join(", ");
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedHeentIssues = "";
                            }
                            if (tempLungsArray.length > 0) {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedLungsIssues = tempLungsArray.join(", ");
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.SelectedLungsIssues = "";
                            }


                            //$scope.PreAdmAnesthetistSummaryObj.RespiratoryHealthArray = [];
                            //$scope.PreAdmAnesthetistSummaryObj.SocialHealthArray = [];

                            //$scope.PreAdmAnesthetistSummaryObj.RespiratoryHealthArray = $filter("filter")($scope.PreAdmAnesthetistSummaryObj.HealthArray, { "CategoryId": 13 });
                            //$scope.PreAdmAnesthetistSummaryObj.SocialHealthArray = $filter("filter")($scope.PreAdmAnesthetistSummaryObj.HealthArray, { "CategoryId": 15 });

                            //if ($scope.PreAdmAnesthetistSummaryObj.RespiratoryHealthArray.length > 0) {
                            //    $scope.PreAdmAnesthetistSummaryObj.IsRespiratoryInd = true;
                            //} else {
                            //    $scope.PreAdmAnesthetistSummaryObj.IsRespiratoryInd = false;
                            //}

                            //if ($scope.PreAdmAnesthetistSummaryObj.SocialHealthArray.length > 0) {
                            //    $scope.PreAdmAnesthetistSummaryObj.IsSocialInd = true;
                            //} else {
                            //    $scope.PreAdmAnesthetistSummaryObj.IsSocialInd = false;
                            //}

                            $scope.PreAdmAnesthetistSummaryObj.IsCardiacWNL = $scope.PreAdmissionDetails.IsCardiacWNL;
                            $scope.PreAdmAnesthetistSummaryObj.IsCNSHistory = $scope.PreAdmissionDetails.IsCNSHistory;
                            $scope.PreAdmAnesthetistSummaryObj.IsCardiovascularHistory = $scope.PreAdmissionDetails.IsCardiovascularHistory;
                            $scope.PreAdmAnesthetistSummaryObj.IsAutoImmuneDisordersWNL = $scope.PreAdmissionDetails.IsAutoImmuneDisordersWNL;
                            $scope.PreAdmAnesthetistSummaryObj.IsEndocrineWNL = $scope.PreAdmissionDetails.IsEndocrineWNL;
                            $scope.PreAdmAnesthetistSummaryObj.IsHemeOncWNL = $scope.PreAdmissionDetails.IsHemeOncWNL;
                            $scope.PreAdmAnesthetistSummaryObj.IsHepaticWNL = $scope.PreAdmissionDetails.IsHepaticWNL;
                            $scope.PreAdmAnesthetistSummaryObj.IsKidneyDiseaseWNL = $scope.PreAdmissionDetails.IsKidneyDiseaseWNL;
                            $scope.PreAdmAnesthetistSummaryObj.IsMusculoSkeletalSystemWNL = $scope.PreAdmissionDetails.IsMusculoSkeletalSystemWNL;
                            $scope.PreAdmAnesthetistSummaryObj.IsNervousSystemWNL = $scope.PreAdmissionDetails.IsNervousSystemWNL;
                            $scope.PreAdmAnesthetistSummaryObj.IsNeurologicWNL = $scope.PreAdmissionDetails.IsNeurologicWNL;
                            $scope.PreAdmAnesthetistSummaryObj.IsOthersWNL = $scope.PreAdmissionDetails.IsOthersWNL;
                            $scope.PreAdmAnesthetistSummaryObj.IsPsychosisWNL = $scope.PreAdmissionDetails.IsPsychosisWNL;
                            $scope.PreAdmAnesthetistSummaryObj.IsPulmonaryWNL = $scope.PreAdmissionDetails.IsPulmonaryWNL;
                            $scope.PreAdmAnesthetistSummaryObj.IsRespiratoryNormal = $scope.PreAdmissionDetails.IsRespiratoryNormal;
                            $scope.PreAdmAnesthetistSummaryObj.IsHeentWNL = $scope.PreAdmissionDetails.IsHeentWNL;
                            $scope.PreAdmAnesthetistSummaryObj.IsLungsWNL = $scope.PreAdmissionDetails.IsLungsWNL;

                            $scope.PreAdmAnesthetistSummaryObj.SocialNotes = $scope.PreAdmissionDetails.SocialNotes || "";
                            $scope.PreAdmAnesthetistSummaryObj.RespiratoryNotes = $scope.PreAdmissionDetails.RespiratoryNotes || "";
                            $scope.PreAdmAnesthetistSummaryObj.PulmonaryNotes = $scope.PreAdmissionDetails.PulmonaryNotes || "";
                            $scope.PreAdmAnesthetistSummaryObj.PsychosisNotes = $scope.PreAdmissionDetails.PsychosisNotes || "";
                            $scope.PreAdmAnesthetistSummaryObj.OthersNotes = $scope.PreAdmissionDetails.OthersNotes || "";
                            $scope.PreAdmAnesthetistSummaryObj.NeurologicNotes = $scope.PreAdmissionDetails.NeurologicNotes || "";
                            $scope.PreAdmAnesthetistSummaryObj.NervousSystemNotes = $scope.PreAdmissionDetails.NervousSystemNotes || "";
                            $scope.PreAdmAnesthetistSummaryObj.MusculoSkeletalSystemNotes = $scope.PreAdmissionDetails.MusculoSkeletalSystemNotes || "";
                            $scope.PreAdmAnesthetistSummaryObj.KidneyDiseaseNotes = $scope.PreAdmissionDetails.KidneyDiseaseNotes || "";
                            $scope.PreAdmAnesthetistSummaryObj.HepaticNotes = $scope.PreAdmissionDetails.HepaticNotes || "";
                            $scope.PreAdmAnesthetistSummaryObj.HemeOncNotes = $scope.PreAdmissionDetails.HemeOncNotes || "";
                            $scope.PreAdmAnesthetistSummaryObj.EndocrineNotes = $scope.PreAdmissionDetails.EndocrineNotes || "";
                            $scope.PreAdmAnesthetistSummaryObj.CardiacNotes = $scope.PreAdmissionDetails.CardiacNotes || "";
                            $scope.PreAdmAnesthetistSummaryObj.CNSNotes = $scope.PreAdmissionDetails.CNSNotes || "";
                            $scope.PreAdmAnesthetistSummaryObj.AutoImmuneDisordersNotes = $scope.PreAdmissionDetails.AutoImmuneDisordersNotes || "";
                            $scope.PreAdmAnesthetistSummaryObj.HeentNotes = $scope.PreAdmissionDetails.HeentNotes || "";
                            $scope.PreAdmAnesthetistSummaryObj.LungsNotes = $scope.PreAdmissionDetails.LungsNotes || "";
                            $scope.PreAdmAnesthetistSummaryObj.CurrentMedicationList = angular.copy($scope.PreAdmissionDetails.CurrentMedicationList);
                            $scope.PreAdmAnesthetistSummaryObj.MedicationsList = angular.copy($scope.PreAdmissionDetails.MedicationsList);
                            $scope.PreAdmAnesthetistSummaryObj.InvestigationsList = angular.copy($scope.PreAdmissionDetails.InvestigationsList);

                            $scope.PreAdmAnesthetistSummaryObj.ReviewedBy = $scope.PreAdmissionDetails.ReviwedBy;

                            if ($scope.PreAdmissionDetails.HealthArray.length > 0) {
                                $scope.PreAdmAnesthetistSummaryObj.IsPreAdmChecklistMainInd = true;
                                $scope.PreAdmAnesthetistSummaryObj.IsPreAdmChecklistHealthPlanInd = true;
                            }
                            else if (!$scope.PreAdmissionDetails.IsCardiacWNL && !$scope.PreAdmissionDetails.IsCNSHistory && !$scope.PreAdmissionDetails.IsAutoImmuneDisordersWNL && !$scope.PreAdmissionDetails.IsEndocrineWNL && !$scope.PreAdmissionDetails.IsHemeOncWNL && !$scope.PreAdmissionDetails.IsHepaticWNL && !$scope.PreAdmissionDetails.IsPulmonaryWNL
                                && !$scope.PreAdmissionDetails.IsKidneyDiseaseWNL && !$scope.PreAdmissionDetails.IsMusculoSkeletalSystemWNL && !$scope.PreAdmissionDetails.IsNervousSystemWNL && !$scope.PreAdmissionDetails.IsNeurologicWNL && !$scope.PreAdmissionDetails.IsOthersWNL && !$scope.PreAdmissionDetails.IsPsychosisWNL && !$scope.PreAdmissionDetails.IsRespiratoryNormal && !$scope.PreAdmissionDetails.IsHeentWNL && !$scope.PreAdmissionDetails.IsLungsWNL) {

                                $scope.PreAdmAnesthetistSummaryObj.IsPreAdmChecklistMainInd = false;
                                $scope.PreAdmAnesthetistSummaryObj.IsPreAdmChecklistHealthPlanInd = false;
                            }

                            if ($scope.PreAdmAnesthetistSummaryObj.IsCNSHistory == true) {
                                $scope.PreAdmAnesthetistSummaryObj.IsCNSHistoryInd = true;
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.IsCNSHistoryInd = false;
                            }

                            if ($scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.AnesthetistId != null) {
                                let Anesthetistlist = $filter("filter")($scope.AnesthetistArray, function (kitem) { return kitem.DoctorID == $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.AnesthetistId });

                                Anesthetistlist = Anesthetistlist || [];
                                if (Anesthetistlist.length > 0) {
                                    $scope.PreAdmAnesthetistSummaryObj.APAnesthesiaOptionsObj.AnesthetistName = Anesthetistlist[0].FullName;
                                }
                            }
                        }
                        $scope.PreAdmAnesthetistSummaryObj.IsAdvanceAnestInd = false;
                        // condition
                        if ((($scope.PreAdmAnesthetistSummaryObj.IsCardiacWNL == false && $scope.PreAdmAnesthetistSummaryObj.SelectedCardiacIssues !== '') || $scope.PreAdmAnesthetistSummaryObj.IsCardiacWNL) ||
                            (($scope.PreAdmAnesthetistSummaryObj.IsPulmonaryWNL == false && $scope.PreAdmAnesthetistSummaryObj.SelectedPulmonaryIssues !== '') || $scope.PreAdmAnesthetistSummaryObj.IsPulmonaryWNL) ||
                            (($scope.PreAdmAnesthetistSummaryObj.IsHepaticWNL && $scope.PreAdmAnesthetistSummaryObj.SelectedHepaticIssues !== '') || $scope.PreAdmAnesthetistSummaryObj.IsHepaticWNL) ||
                            (($scope.PreAdmAnesthetistSummaryObj.IsEndocrineWNL == false && $scope.PreAdmAnesthetistSummaryObj.SelectedEndocrineIssues !== '') || $scope.PreAdmAnesthetistSummaryObj.IsEndocrineWNL) ||
                            (($scope.PreAdmAnesthetistSummaryObj.IsNeurologicWNL == false && $scope.PreAdmAnesthetistSummaryObj.SelectedNeurologicIssues !== '') || $scope.PreAdmAnesthetistSummaryObj.IsNeurologicWNL) ||
                            (($scope.PreAdmAnesthetistSummaryObj.IsHemeOncWNL == false && $scope.PreAdmAnesthetistSummaryObj.SelectedHemeOncIssues !== '') || $scope.PreAdmAnesthetistSummaryObj.IsHemeOncWNL) ||
                            (($scope.PreAdmAnesthetistSummaryObj.IsNervousSystemWNL == false && $scope.PreAdmAnesthetistSummaryObj.SelectedNervousSystemIssues !== '') || $scope.PreAdmAnesthetistSummaryObj.IsNervousSystemWNL) ||
                            (($scope.PreAdmAnesthetistSummaryObj.IsMusculoSkeletalSystemWNL == false && $scope.PreAdmAnesthetistSummaryObj.SelectedMusculoSkeletalSystemIssues !== '') || $scope.PreAdmAnesthetistSummaryObj.IsMusculoSkeletalSystemWNL) ||
                            (($scope.PreAdmAnesthetistSummaryObj.IsKidneyDiseaseWNL == false && $scope.PreAdmAnesthetistSummaryObj.SelectedKidneyDiseaseIssues !== '') || $scope.PreAdmAnesthetistSummaryObj.IsKidneyDiseaseWNL) ||
                            (($scope.PreAdmAnesthetistSummaryObj.IsAutoImmuneDisordersWNL == false && $scope.PreAdmAnesthetistSummaryObj.SelectedAutoImmuneDisordersIssues !== '') || $scope.PreAdmAnesthetistSummaryObj.IsAutoImmuneDisordersWNL) ||
                            (($scope.PreAdmAnesthetistSummaryObj.IsPsychosisWNL == false && $scope.PreAdmAnesthetistSummaryObj.SelectedPsychosisIssues !== '') || $scope.PreAdmAnesthetistSummaryObj.IsPsychosisWNL) ||
                            (($scope.PreAdmAnesthetistSummaryObj.IsOthersWNL == false && $scope.PreAdmAnesthetistSummaryObj.SelectedOthersIssues !== '') || $scope.PreAdmAnesthetistSummaryObj.IsOthersWNL) ||
                            (($scope.PreAdmAnesthetistSummaryObj.IsHeentWNL == false && $scope.PreAdmAnesthetistSummaryObj.SelectedHeentIssues !== '') || $scope.PreAdmAnesthetistSummaryObj.IsHeentWNL) ||
                            (($scope.PreAdmAnesthetistSummaryObj.IsLungsWNL == false && $scope.PreAdmAnesthetistSummaryObj.SelectedLungsIssues !== '') || $scope.PreAdmAnesthetistSummaryObj.IsLungsWNL)

                        ) {
                            $scope.PreAdmAnesthetistSummaryObj.IsAdvanceAnestInd = true;
                        } else {
                            $scope.PreAdmAnesthetistSummaryObj.IsAdvanceAnestInd = false;
                        }
                        // condtion over
                        $scope.PreAdmAnesthetistSummaryObj.PreAdmissionStatusId = $scope.PreAdmissionDetails.PreAdmissionStatusId;
                        $scope.PreAdmAnesthetistSummaryObj.PreAdmissionStatus = $scope.PreAdmissionDetails.PreAdmissionStatus||'';

                        // medicine orders // prescription

                        if ($scope.PreAdmissionDetails.Prescription.length > 0) {
                            $scope.PreAdmAnesthetistSummaryObj.PrescriptionDetails = angular.copy($scope.PreAdmissionDetails.Prescription);
                        }

                        $scope.FilesObj.TempImagesArray = [];


                        if ($scope.PreAdmissionDetails.VitalsArray.length > 0) {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreadmVitalsInd = true;
                        } else {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreadmVitalsInd = false;
                        }


                        if ($scope.PreAdmissionDetails.InvestigationsList.length > 0) {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreAdmLabsInvestigationsInd = true;
                        } else {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreAdmLabsInvestigationsInd = false;
                        }

                        if ($scope.PreAdmAnesthetistSummaryObj.IsPreAdmLabsInvestigationsInd || $scope.PreAdmAnesthetistSummaryObj.IsPreAdmPreSurgeryMedicationsInd || $scope.PreAdmAnesthetistSummaryObj.IsPreAdmCurrentMedicationsInd) {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreAdmPreSurgeryOrdersMainInd = true;
                        } else {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreAdmPreSurgeryOrdersMainInd = false;
                        }


                        if ($scope.PreAdmAnesthetistSummaryObj.LabObj.HGB == "" && $scope.PreAdmAnesthetistSummaryObj.LabObj.HCT == "" && $scope.PreAdmAnesthetistSummaryObj.LabObj.WBC == "" && $scope.PreAdmAnesthetistSummaryObj.LabObj.RBC == "" && $scope.PreAdmAnesthetistSummaryObj.LabObj.A1C == "" && $scope.PreAdmAnesthetistSummaryObj.LabObj.Creatinine == "" &&
                            $scope.PreAdmAnesthetistSummaryObj.LabObj.RBS == "" && $scope.PreAdmAnesthetistSummaryObj.LabObj.FBS == "" && $scope.PreAdmAnesthetistSummaryObj.LabObj.PBBS == "" && $scope.PreAdmAnesthetistSummaryObj.LabObj.PBLS == "" && $scope.PreAdmAnesthetistSummaryObj.LabObj.Notes == "") {
                            $scope.PreAdmAnesthetistSummaryObj.IsPrAdmEvaluationLabInd = false;
                        } else {
                            $scope.PreAdmAnesthetistSummaryObj.IsPrAdmEvaluationLabInd = true;
                        }

                        if ($scope.PreAdmAnesthetistSummaryObj.CardioVascularObj.Systolic == "" && $scope.PreAdmAnesthetistSummaryObj.CardioVascularObj.Diastolic == "" && $scope.PreAdmAnesthetistSummaryObj.CardioVascularObj.PR == "" && $scope.PreAdmAnesthetistSummaryObj.CardioVascularObj.ECG == "" && $scope.PreAdmAnesthetistSummaryObj.CardioVascularObj.ECGUnits == "" &&
                            $scope.PreAdmAnesthetistSummaryObj.CardioVascularObj.Notes == "" && $scope.PreAdmAnesthetistSummaryObj.CardioVascularObj.BPlevel=="") {
                            $scope.PreAdmAnesthetistSummaryObj.IsPrAdmEvaluationAnestheInd = false;
                        } else {
                            $scope.PreAdmAnesthetistSummaryObj.IsPrAdmEvaluationAnestheInd = true;
                        }


                        if ($scope.PreAdmAnesthetistSummaryObj.IsCNSHistory == null && $scope.PreAdmAnesthetistSummaryObj.CNSNotes == "") {
                            $scope.PreAdmAnesthetistSummaryObj.IsPrAdmEvaluationCNSInd = false;
                        } else {
                            $scope.PreAdmAnesthetistSummaryObj.IsPrAdmEvaluationCNSInd = true;
                        }

                        if ($scope.PreAdmAnesthetistSummaryObj.AirwayObj.ROMTMS == "" && $scope.PreAdmAnesthetistSummaryObj.AirwayObj.ROMNECKLAT == "" && $scope.PreAdmAnesthetistSummaryObj.AirwayObj.ROMNECKAP == "" && !$scope.PreAdmAnesthetistSummaryObj.AirwayObj.IsNormal &&
                            $scope.PreAdmAnesthetistSummaryObj.AirwayObj.Notes == "" && $scope.PreAdmAnesthetistSummaryObj.AirwayObj.Class == "") {
                            $scope.PreAdmAnesthetistSummaryObj.IsPrAdmEvaluationAirwayInd = false;
                        } else {
                            $scope.PreAdmAnesthetistSummaryObj.IsPrAdmEvaluationAirwayInd = true;
                        }

                        if ($scope.PreAdmAnesthetistSummaryObj.IsPrAdmEvaluationAirwayInd || $scope.PreAdmAnesthetistSummaryObj.IsPrAdmEvaluationCardioInd || $scope.PreAdmAnesthetistSummaryObj.IsPrAdmEvaluationLabInd) {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreAdmEvaluationMainInd = true;
                        } else {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreAdmEvaluationMainInd = false;
                        }

                        if ($scope.PreAdmissionDetails.PrevAnesthesia.Notes == "" && !$scope.PreAdmissionDetails.PrevAnesthesia.IsComplications && !$scope.PreAdmissionDetails.PrevAnesthesia.IsContinue &&
                            !$scope.PreAdmissionDetails.PrevAnesthesia.IsDifficultAirway && !$scope.PreAdmissionDetails.PrevAnesthesia.IsFamilyHistory && !$scope.PreAdmissionDetails.PrevAnesthesia.IsPONV &&
                            !$scope.PreAdmissionDetails.PrevAnesthesia.IsPatientDNR && !$scope.PreAdmissionDetails.PrevAnesthesia.IsPrevAnesthesia && !$scope.PreAdmissionDetails.PrevAnesthesia.IsSuspend) {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreAdmPreviousAnestheticInd = false;
                        } else {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreAdmPreviousAnestheticInd = true;
                        }

                        if ($scope.PreAdmissionDetails.AssessmentsASA.Notes == "" && $scope.PreAdmissionDetails.AssessmentsASA.Value == "") {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreAdmAssessmentASAInd = false;
                        } else {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreAdmAssessmentASAInd = true;
                        }

                        if (!$scope.PreAdmissionDetails.AnesthesiaPlan.IsTopicalAnesthesia && !$scope.PreAdmissionDetails.AnesthesiaPlan.IsGeneralAnesthesia && !$scope.PreAdmissionDetails.AnesthesiaPlan.IsLocalAnesthesia &&
                            !$scope.PreAdmissionDetails.AnesthesiaPlan.IsPeriBulbarAnesthesia && !$scope.PreAdmissionDetails.AnesthesiaPlan.IsRegionalAnesthesia && !$scope.PreAdmissionDetails.AnesthesiaPlan.IsSubtenonAnesthesia &&
                            $scope.PreAdmissionDetails.AnesthesiaPlan.Dosage == "") {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreAdmAnestheticPlanInd = false;
                        } else {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreAdmAnestheticPlanInd = true;
                        }

                        if ($scope.PreAdmAnesthetistSummaryObj.IsPreAdmPreviousAnestheticInd || $scope.PreAdmAnesthetistSummaryObj.IsPreAdmAssessmentASAInd || $scope.PreAdmAnesthetistSummaryObj.IsPreAdmAnestheticPlanInd) {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreAdmAnesthetistPlanMainInd = true;
                        } else {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreAdmAnesthetistPlanMainInd = false;
                        }


                        if ($scope.PreAdmAnesthetistSummaryObj.IsPrAdmROSAllergiesInd || $scope.PreAdmAnesthetistSummaryObj.IsPrAdmROSSurgicalInd || $scope.PreAdmAnesthetistSummaryObj.IsPrAdmROSSystemicInd) {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreAdmROSMainInd = true;
                        } else {
                            $scope.PreAdmAnesthetistSummaryObj.IsPreAdmROSMainInd = false;
                        }

                        if ($scope.PreAdmissionDetails.DocumentDetails.length > 0) {
                            $scope.PreAdmAnesthetistSummaryObj.DocumentDetails = angular.copy($scope.PreAdmissionDetails.DocumentDetails);
                        }
                        else {
                            $scope.PreAdmAnesthetistSummaryObj.DocumentDetails = [];
                        }

                        $scope.PreAdmissionDetails.OtherSystemArray = $scope.PreAdmissionDetails.OtherSystemArray || [];

                        if ($scope.PreAdmissionDetails.OtherSystemArray.length > 0) {
                            //$scope.PreAdmAnesthetistSummaryObj.OtherSystemArray = angular.copy($scope.PreAdmissionDetails.OtherSystemArray);
                            $scope.PreAdmAnesthetistSummaryObj.OtherSystemArray = angular.copy($scope.PreAdmissionDetails.OtherSystemArray);
                            let tempOtherSystemArray = $filter('filter')($scope.PreAdmAnesthetistSummaryObj.OtherSystemArray, { 'IsChecked': null }, true) || [];
                            if (tempOtherSystemArray.length == $scope.PreAdmAnesthetistSummaryObj.OtherSystemArray.length) {
                                $scope.PreAdmAnesthetistSummaryObj.OthersNotesNoDataInd = false;
                            } else {
                                $scope.PreAdmAnesthetistSummaryObj.OthersNotesNoDataInd = true;
                            }
                        }
                        else {
                            $scope.PreAdmAnesthetistSummaryObj.OtherSystemArray = [];
                        }

                        //Anesthesia Assessment Hide and Show Ind
                        if ($scope.PreAdmAnesthetistSummaryObj.IsPreAdmPreviousAnestheticInd == false && $scope.PreAdmAnesthetistSummaryObj.IsPrAdmAssPlanInd == false && $scope.PreAdmAnesthetistSummaryObj.IsPrAdmAssessmentInd == false) {
                            $scope.PreAdmAnesthetistSummaryObj.AssessmentInfoShowInd = false;
                        }
                        else {
                            $scope.PreAdmAnesthetistSummaryObj.AssessmentInfoShowInd = true;
                        }

                    } else {
                        $scope.AnesthesiaPreAdmissionDetails = [];

                        $scope.PreAdmAnesthetistSummaryObj = angular.copy($scope.GetPreAdmAnesthetistParentObj());

                        $scope.PreAdmAnesthetistSummaryObj.IsPreadmVitalsInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPreAdmROSMainInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPrAdmROSSystemicInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPrAdmROSSurgicalInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPrAdmROSAllergiesInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPreAdmEvaluationMainInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPrAdmEvaluationLabInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPrAdmEvaluationCardioInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPrAdmEvaluationAirwayInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPreAdmChecklistMainInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPreAdmChecklistHealthPlanInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPreAdmPreSurgeryOrdersMainInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPreAdmPreSurgeryMedicationsInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPreAdmCurrentMedicationsInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPreAdmLabsInvestigationsInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPreAdmAnesthetistPlanMainInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPreAdmPreviousAnestheticInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPreAdmAssessmentASAInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPreAdmAnestheticPlanInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.IsPrAdmEvaluationAnestheInd = false;
                        $scope.PreAdmAnesthetistSummaryObj.AssessmentInfoShowInd = false;

                        //$scope.PreAdmObj.IsShow = true;
                        //$scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;
                    }

                    if (resp[0].data.CardiologistDetails.length > 0) {

                        $scope.SurgeryList = [];
                        $scope.PreAdmCardioSummaryObj = angular.copy($scope.GetPreAdmCardioSummaryObj());
                        $scope.PreAdmCardioSummaryObj.HealthArray = angular.copy($scope.HealthArray);
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
                        }
                        $scope.SuregryListArray = [];
                        $scope.SuregryListArray = angular.copy(resp[0].data.SurgeryArray);
                        if ($scope.SuregryListArray.length > 0) {

                            $scope.PreAdmCardioSummaryObj.AscAppointmentId = resp[0].data.SurgeryArray[0].AscAppointmentId || null;
                            $scope.PreAdmCardioSummaryObj.AscAppointmentDate = resp[0].data.SurgeryArray[0].AscAppointmentDate || null;
                            $scope.PreAdmCardioSummaryObj.FirstFollowupApptId = resp[0].data.SurgeryArray[0].FirstFollowupAppointmentId || null;
                            $scope.PreAdmCardioSummaryObj.FirstFollowupDate = resp[0].data.SurgeryArray[0].FirstFollowupDate || null;
                            $scope.PreAdmCardioSummaryObj.SecondFollowupApptId = resp[0].data.SurgeryArray[0].SecondFollowupAppointmentId || null;
                            $scope.PreAdmCardioSummaryObj.SecondFollowupDate = resp[0].data.SurgeryArray[0].SecondFollowupDate || null;
                            $scope.PreAdmCardioSummaryObj.ThirdFollowupApptId = resp[0].data.SurgeryArray[0].ThirdFollowupAppointmentId || null;
                            $scope.PreAdmCardioSummaryObj.ThirdFollowupDate = resp[0].data.SurgeryArray[0].ThirdFollowupDate || null;
                        }

                        if (resp[0].data.AnesthesiaPlan.length > 0) {
                            $scope.PreAdmCardioSummaryObj.AnesthesiaPlan = angular.copy(resp[0].data.AnesthesiaPlan);
                        }

                        if ($scope.PreAdmCardioSummaryObj.AnesthesiaPlan.length > 0) {
                            let Anesthetistlist = $filter("filter")($scope.AnesthetistArray, function (kitem) { return kitem.DoctorID == $scope.PreAdmCardioSummaryObj.AnesthesiaPlan[0].AnesPlanAnesthetistId });

                            Anesthetistlist = Anesthetistlist || [];
                            if (Anesthetistlist.length > 0) {
                                $scope.PreAdmCardioSummaryObj.AnesthetistName = Anesthetistlist[0].FullName;
                            }
                        }


                        if (resp[0].data.CardiologistDetails.length > 0) {
                            $scope.CardiologistPreAdmissionDetails = angular.copy(resp[0].data.CardiologistDetails);
                            $scope.CardiologyDetails = angular.copy(resp[0].data.CardiologistDetails[0]);

                            $scope.PreAdmCardioSummaryObj.StatusFlag = $scope.CardiologyDetails.StatusFlag;
                            $scope.PreAdmCardioSummaryObj.PreAdmissionChartStatus = $scope.CardiologyDetails.PreAdmissionChartStatus;

                            if ($scope.CardiologyDetails !== undefined) {

                                $scope.PreAdmCardioSummaryObj.PreAdmissionId = $scope.CardiologyDetails.PreAdmissionId;
                                $scope.PreAdmCardioSummaryObj.PreAdmissionApptId = $scope.CardiologyDetails.AppointmentId;
                                $scope.PreAdmCardioSummaryObj.PreAdmissionApptDate = $filter('date')($scope.CardiologyDetails.AppointmentDate, "MM-dd-yyyy");
                                $scope.PreAdmCardioSummaryObj.IsCXR = $scope.CardiologyDetails.IsCXR || "";
                                $scope.PreAdmCardioSummaryObj.CXRHistory = $scope.CardiologyDetails.CXRHistory || "";


                                var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.CardiologyDetails.ReviwedBy }, true)[0] || [];
                                $scope.PreAdmCardioSummaryObj.ReviewByName = ReviewName.FullName || '';
                                $scope.PreAdmCardioSummaryObj.ReviewedDate = $scope.CardiologyDetails.ReviewedDate || "";
                                $scope.PreAdmCardioSummaryObj.ReviewedTime = $scope.CardiologyDetails.Reviewedtime || "";
                                //let ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                                //if ($scope.PreAdmCardioSummaryObj.ReviewedTime != '') {
                                //    let edate = ndate + " " + $scope.PreAdmCardioSummaryObj.ReviewedTime;
                                //    $scope.PreAdmCardioSummaryObj.ReviewedTime = $filter('date')(new Date(edate), "hh:mm a");
                                //}
                                let currentDate = moment().format("YYYY-MM-DD");
                                if ($scope.PreAdmAnesthetistSummaryObj.ReviewedTime !== '') {
                                    let edate = currentDate + " " + $scope.PreAdmCardioSummaryObj.ReviewedTime;
                                    let parsedDateTime = moment(edate, "YYYY-MM-DD hh:mm a");
                                    $scope.PreAdmCardioSummaryObj.ReviewedTime = parsedDateTime.format("hh:mm a");
                                }

                                if ($scope.CardiologyDetails.Presentillness != '') {
                                    $scope.PreAdmCardioSummaryObj.PresentIllness = angular.copy($scope.CardiologyDetails.Presentillness);
                                    $scope.PreAdmCardioSummaryObj.PresentIllness = $scope.PreAdmCardioSummaryObj.PresentIllness.replace(/\n/g, '<br>');
                                }
                                $scope.PreAdmCardioSummaryObj.IsChestPain = $scope.CardiologyDetails.IsChestPain;
                                $scope.PreAdmCardioSummaryObj.Chemistry = angular.copy($scope.CardiologyDetails.Chemistry);
                                $scope.PreAdmCardioSummaryObj.Treatment = angular.copy($scope.CardiologyDetails.Treatment);

                                $scope.PreAdmCardioSummaryObj.ROSOverAllRemarks = angular.copy($scope.CardiologyDetails.ROSOverAllRemarks);

                                if ($scope.PreAdmCardioSummaryObj.ROSOverAllRemarks != "" || $scope.PreAdmCardioSummaryObj.ROSOverAllRemarks != null) {
                                    $scope.PreAdmCardioSummaryObj.IsROSOverAllRemarksInd = true;
                                } else {
                                    $scope.PreAdmCardioSummaryObj.IsROSOverAllRemarksInd = false;
                                }

                                if ($scope.CardiologyDetails.VitalsArray.length > 0) {
                                    angular.forEach($scope.CardiologyDetails.VitalsArray, function (vitem) {
                                        var vitallist = [];
                                        vitallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == vitem.DoctorId })||[];
                                        if (vitallist.length > 0) {
                                            vitem.UserName = angular.copy(vitallist[0].FullName);
                                        }
                                        //let ndate = $filter('date')(new Date(), "yyyy-MM-dd");
                                        //let edate = ndate + " " + vitem.VitalAddTime;
                                        //vitem.VitalAddTime = $filter('date')(new Date(edate), "hh:mm a");
                                        let currentDate = moment().format("YYYY-MM-DD");
                                        let edate = currentDate + " " + vitem.VitalAddTime;
                                        let parsedDateTime = moment(edate, "YYYY-MM-DD hh:mm a");
                                        vitem.VitalAddTime = parsedDateTime.format("hh:mm a");
                                    });
                                    $scope.PreAdmCardioSummaryObj.Vitals = angular.copy($scope.CardiologyDetails.VitalsArray);
                                } else {
                                    $scope.PreAdmCardioSummaryObj.Vitals = [];
                                }


                                $scope.PreAdmCardioSummaryObj.LabObj = $scope.GetCardioLabObj();
                                $scope.PreAdmCardioSummaryObj.LabObj.HGB = $scope.CardiologyDetails.LabTest.HGB;
                                $scope.PreAdmCardioSummaryObj.LabObj.HCT = $scope.CardiologyDetails.LabTest.HCT;
                                $scope.PreAdmCardioSummaryObj.LabObj.WBC = $scope.CardiologyDetails.LabTest.WBC;
                                $scope.PreAdmCardioSummaryObj.LabObj.RBC = $scope.CardiologyDetails.LabTest.RBC;
                                $scope.PreAdmCardioSummaryObj.LabObj.A1C = $scope.CardiologyDetails.LabTest.A1C;
                                $scope.PreAdmCardioSummaryObj.LabObj.Creatinine = $scope.CardiologyDetails.LabTest.Creatinine;
                                $scope.PreAdmCardioSummaryObj.LabObj.UrineAnalysis = $scope.CardiologyDetails.LabTest.UrineAnalysis;
                                $scope.PreAdmCardioSummaryObj.LabObj.IsBloodAvailable = $scope.CardiologyDetails.LabTest.IsBloodAvailable;
                                $scope.PreAdmCardioSummaryObj.LabObj.IsPretransfusion = $scope.CardiologyDetails.LabTest.IsPretransfusion;
                                $scope.PreAdmCardioSummaryObj.LabObj.RBS = $scope.CardiologyDetails.LabTest.RBS;
                                $scope.PreAdmCardioSummaryObj.LabObj.FBS = $scope.CardiologyDetails.LabTest.FBS;
                                $scope.PreAdmCardioSummaryObj.LabObj.PBBS = $scope.CardiologyDetails.LabTest.PBBS;
                                $scope.PreAdmCardioSummaryObj.LabObj.PBLS = $scope.CardiologyDetails.LabTest.PBLS;
                                $scope.PreAdmCardioSummaryObj.LabObj.Others = $scope.CardiologyDetails.LabTest.Others;
                                $scope.PreAdmCardioSummaryObj.LabObj.Notes = $scope.CardiologyDetails.LabTest.Notes || "";
                                if ($scope.CardiologyDetails.LabTest.TestArray.length > 0) {
                                    $scope.PreAdmCardioSummaryObj.LabObj.LabTestArray = $scope.CardiologyDetails.LabTest.TestArray;
                                }

                                if ($scope.PreAdmCardioSummaryObj.LabObj.RBS != "" || $scope.PreAdmCardioSummaryObj.LabObj.FBS != "" || $scope.PreAdmCardioSummaryObj.LabObj.PBBS != "" || $scope.PreAdmCardioSummaryObj.LabObj.PBLS != "" || $scope.PreAdmCardioSummaryObj.LabObj.PBLS != "" || $scope.PreAdmCardioSummaryObj.LabObj.Others != "") {
                                    $scope.IsCardioDiabetesEnable = "true";
                                }
                                else {
                                    $scope.IsCardioDiabetesEnable = "false";
                                }

                                $scope.CardiologyDetails.CardioVascular = $scope.CardiologyDetails.CardioVascular || "";
                                if ($scope.CardiologyDetails.CardioVascular != "") {
                                    $scope.PreAdmCardioSummaryObj.CardioVascularObj.Systolic = $scope.CardiologyDetails.CardioVascular.Systolic;
                                    $scope.PreAdmCardioSummaryObj.CardioVascularObj.Diastolic = $scope.CardiologyDetails.CardioVascular.Diastolic;
                                    $scope.PreAdmCardioSummaryObj.CardioVascularObj.PR = $scope.CardiologyDetails.CardioVascular.PR;
                                    $scope.PreAdmCardioSummaryObj.CardioVascularObj.ECG = $scope.CardiologyDetails.CardioVascular.ECG;
                                    $scope.PreAdmCardioSummaryObj.CardioVascularObj.ECGUnits = $scope.CardiologyDetails.CardioVascular.ECGUnits;
                                    $scope.PreAdmCardioSummaryObj.CardioVascularObj.Notes = $scope.CardiologyDetails.CardioVascular.Notes || "";
                                    $scope.PreAdmCardioSummaryObj.CardioVascularObj.BPlevel = $scope.CardiologyDetails.CardioVascular.BPlevel || "";
                                }

                                $scope.CardiologyDetails.Airway = $scope.CardiologyDetails.Airway || '';
                                if ($scope.CardiologyDetails.Airway != '') {
                                    $scope.PreAdmCardioSummaryObj.AirwayObj.ROMTMS = $scope.CardiologyDetails.Airway.ROMTMS;
                                    $scope.PreAdmCardioSummaryObj.AirwayObj.ROMNECKLAT = $scope.CardiologyDetails.Airway.ROMNECKLAT;
                                    $scope.PreAdmCardioSummaryObj.AirwayObj.ROMNECKAP = $scope.CardiologyDetails.Airway.ROMNECKAP;
                                    $scope.PreAdmCardioSummaryObj.AirwayObj.Notes = $scope.CardiologyDetails.Airway.Notes || "";
                                    $scope.PreAdmCardioSummaryObj.AirwayObj.IsNormal = $scope.CardiologyDetails.Airway.IsNormal;
                                    $scope.PreAdmCardioSummaryObj.AirwayObj.Class = $scope.CardiologyDetails.Airway.Class;
                                    $scope.PreAdmCardioSummaryObj.AirwayObj.Dentition = $scope.CardiologyDetails.Airway.Dentition;
                                }
                                $scope.PreAdmCardioSummaryObj.HealthArray = angular.copy($scope.HealthArray);
                                angular.forEach($scope.PreAdmCardioSummaryObj.HealthArray, function (item) {
                                    let temparray = $filter('filter')($scope.CardiologyDetails.HealthArray, { "Id": item.Id }, true);
                                    if (temparray.length > 0) {
                                        item.IsChecked = temparray[0].IsChecked;
                                    } else {
                                        item.IsChecked = null;
                                    }
                                });
                                $scope.PreAdmCardioSummaryObj.PreAdminCardRespiratoryInd = false;
                                if ($scope.PreAdmCardioSummaryObj.HealthArray.length > 0) {
                                    var CardResporotaryInfo = $filter('filter')($scope.PreAdmCardioSummaryObj.HealthArray, function (item) {
                                        return (item.CategoryId==13&&item.IsChecked !== null);
                                    });
                                    if (CardResporotaryInfo.length > 0 || $scope.PreAdmCardioSummaryObj.CXRHistory == 'No' || $scope.PreAdmCardioSummaryObj.CXRHistory == 'Yes' || $scope.PreAdmCardioSummaryObj.IsCXR == 'Yes' || $scope.PreAdmCardioSummaryObj.IsCXR == 'No' || $scope.PreAdmCardioSummaryObj.RespiratoryNotes != '') {
                                        $scope.PreAdmCardioSummaryObj.PreAdminCardRespiratoryInd = true;
                                    }
                                    else {
                                        $scope.PreAdmCardioSummaryObj.PreAdminCardRespiratoryInd = false;
                                    }
                                }

                                //$scope.PreAdmCardioSummaryObj.RespiratoryHealthArray = [];
                                //$scope.PreAdmCardioSummaryObj.SocialHealthArray = [];
                                //$scope.CardiologistFilesObj.TempImagesArray = [];

                                //$scope.PreAdmCardioSummaryObj.RespiratoryHealthArray = $filter("filter")($scope.PreAdmCardioSummaryObj.HealthArray, { "CategoryId": 13 });
                                //$scope.PreAdmCardioSummaryObj.SocialHealthArray = $filter("filter")($scope.PreAdmCardioSummaryObj.HealthArray, { "CategoryId": 15 });

                                //if ($scope.PreAdmCardioSummaryObj.RespiratoryHealthArray.length > 0) {
                                //    $scope.PreAdmCardioSummaryObj.IsRespiratoryInd = true;
                                //} else {
                                //    $scope.PreAdmCardioSummaryObj.IsRespiratoryInd = false;
                                //}

                                //if ($scope.PreAdmCardioSummaryObj.SocialHealthArray.length > 0) {
                                //    $scope.PreAdmCardioSummaryObj.IsSocialInd = true;
                                //} else {
                                //    $scope.PreAdmCardioSummaryObj.IsSocialInd = false;
                                //} 
                                $scope.PreAdmCardioSummaryObj.IsCardiovascularHistory = $scope.CardiologyDetails.IsCardiovascularHistory;
                                $scope.PreAdmCardioSummaryObj.IsCardiacWNL = $scope.CardiologyDetails.IsCardiacWNL;
                                $scope.PreAdmCardioSummaryObj.IsCNSHistory = $scope.CardiologyDetails.IsCNSHistory;
                                $scope.PreAdmCardioSummaryObj.IsAutoImmuneDisordersWNL = $scope.CardiologyDetails.IsAutoImmuneDisordersWNL;
                                $scope.PreAdmCardioSummaryObj.IsEndocrineWNL = $scope.CardiologyDetails.IsEndocrineWNL;
                                $scope.PreAdmCardioSummaryObj.IsHemeOncWNL = $scope.CardiologyDetails.IsHemeOncWNL;
                                $scope.PreAdmCardioSummaryObj.IsHepaticWNL = $scope.CardiologyDetails.IsHepaticWNL;
                                $scope.PreAdmCardioSummaryObj.IsKidneyDiseaseWNL = $scope.CardiologyDetails.IsKidneyDiseaseWNL;
                                $scope.PreAdmCardioSummaryObj.IsMusculoSkeletalSystemWNL = $scope.CardiologyDetails.IsMusculoSkeletalSystemWNL;
                                $scope.PreAdmCardioSummaryObj.IsNervousSystemWNL = $scope.CardiologyDetails.IsNervousSystemWNL;
                                $scope.PreAdmCardioSummaryObj.IsNeurologicWNL = $scope.CardiologyDetails.IsNeurologicWNL;
                                $scope.PreAdmCardioSummaryObj.IsOthersWNL = $scope.CardiologyDetails.IsOthersWNL;
                                $scope.PreAdmCardioSummaryObj.IsPsychosisWNL = $scope.CardiologyDetails.IsPsychosisWNL;
                                $scope.PreAdmCardioSummaryObj.IsPulmonaryWNL = $scope.CardiologyDetails.IsPulmonaryWNL;
                                $scope.PreAdmCardioSummaryObj.IsRespiratoryNormal = $scope.CardiologyDetails.IsRespiratoryNormal;

                                $scope.PreAdmCardioSummaryObj.SocialNotes = $scope.CardiologyDetails.SocialNotes || "";
                                $scope.PreAdmCardioSummaryObj.RespiratoryNotes = $scope.CardiologyDetails.RespiratoryNotes || "";
                                $scope.PreAdmCardioSummaryObj.PulmonaryNotes = $scope.CardiologyDetails.PulmonaryNotes || "";
                                $scope.PreAdmCardioSummaryObj.PsychosisNotes = $scope.CardiologyDetails.PsychosisNotes || "";
                                $scope.PreAdmCardioSummaryObj.OthersNotes = $scope.CardiologyDetails.OthersNotes || "";
                                $scope.PreAdmCardioSummaryObj.NeurologicNotes = $scope.CardiologyDetails.NeurologicNotes || "";
                                $scope.PreAdmCardioSummaryObj.NervousSystemNotes = $scope.CardiologyDetails.NervousSystemNotes || "";
                                $scope.PreAdmCardioSummaryObj.MusculoSkeletalSystemNotes = $scope.CardiologyDetails.MusculoSkeletalSystemNotes || "";
                                $scope.PreAdmCardioSummaryObj.KidneyDiseaseNotes = $scope.CardiologyDetails.KidneyDiseaseNotes || "";
                                $scope.PreAdmCardioSummaryObj.HepaticNotes = $scope.CardiologyDetails.HepaticNotes || "";
                                $scope.PreAdmCardioSummaryObj.HemeOncNotes = $scope.CardiologyDetails.HemeOncNotes || "";
                                $scope.PreAdmCardioSummaryObj.EndocrineNotes = $scope.CardiologyDetails.EndocrineNotes || "";
                                $scope.PreAdmCardioSummaryObj.CardiacNotes = $scope.CardiologyDetails.CardiacNotes || "";
                                $scope.PreAdmCardioSummaryObj.CNSNotes = $scope.CardiologyDetails.CNSNotes || "";
                                $scope.PreAdmCardioSummaryObj.AutoImmuneDisordersNotes = $scope.CardiologyDetails.AutoImmuneDisordersNotes || "";

                                $scope.PreAdmCardioSummaryObj.IsHeentWNL = $scope.CardiologyDetails.IsHeentWNL;
                                $scope.PreAdmCardioSummaryObj.IsLungsWNL = $scope.CardiologyDetails.IsLungsWNL;
                                $scope.PreAdmCardioSummaryObj.HeentNotes = $scope.CardiologyDetails.HeentNotes || "";
                                $scope.PreAdmCardioSummaryObj.LungsNotes = $scope.CardiologyDetails.LungsNotes || "";

                                $scope.PreAdmCardioSummaryObj.CurrentMedicationList = angular.copy($scope.CardiologyDetails.CurrentMedicationList);
                                $scope.PreAdmCardioSummaryObj.MedicationsList = angular.copy($scope.CardiologyDetails.MedicationsList);
                                $scope.PreAdmCardioSummaryObj.InvestigationsList = angular.copy($scope.CardiologyDetails.InvestigationsList);

                                $scope.PreAdmCardioSummaryObj.ReviewedBy = $scope.CardiologyDetails.ReviwedBy;
                                $scope.CardiologistPreAdmissionDetails.ReviewByName = "";
                                var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.PreAdmCardioSummaryObj.ReviewedBy }, true)[0] || [];
                                $scope.CardiologistPreAdmissionDetails.ReviewByName = ReviewName.FullName || '';

                                var includedCategories = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 17];
                                let Advacnceheltharray = angular.copy($scope.PreAdmCardioSummaryObj.HealthArray) || [];
                                var tempHealthArray = [];
                                tempHealthArray = $filter('filter')(Advacnceheltharray, function (item) {
                                    return item.IsChecked !== null && includedCategories.includes(item.CategoryId);
                                });

                                $scope.PreAdmCardioSummaryObj.IsAdvanceCardInd = false;
                                // condition
                                if ((tempHealthArray.length>0)||(($scope.PreAdmCardioSummaryObj.IsCardiacWNL == false && $scope.PreAdmCardioSummaryObj.SelectedCardiacIssues !== '') || $scope.PreAdmCardioSummaryObj.IsCardiacWNL) ||
                                    (($scope.PreAdmCardioSummaryObj.IsPulmonaryWNL == false && $scope.PreAdmCardioSummaryObj.SelectedPulmonaryIssues !== '') || $scope.PreAdmCardioSummaryObj.IsPulmonaryWNL) ||
                                    (($scope.PreAdmCardioSummaryObj.IsHepaticWNL && $scope.PreAdmCardioSummaryObj.SelectedHepaticIssues !== '') || $scope.PreAdmCardioSummaryObj.IsHepaticWNL) ||
                                    (($scope.PreAdmCardioSummaryObj.IsEndocrineWNL == false && $scope.PreAdmCardioSummaryObj.SelectedEndocrineIssues !== '') || $scope.PreAdmCardioSummaryObj.IsEndocrineWNL) ||
                                    (($scope.PreAdmCardioSummaryObj.IsNeurologicWNL == false && $scope.PreAdmCardioSummaryObj.SelectedNeurologicIssues !== '') || $scope.PreAdmCardioSummaryObj.IsNeurologicWNL) ||
                                    (($scope.PreAdmCardioSummaryObj.IsHemeOncWNL == false && $scope.PreAdmCardioSummaryObj.SelectedHemeOncIssues !== '') || $scope.PreAdmCardioSummaryObj.IsHemeOncWNL) ||
                                    (($scope.PreAdmCardioSummaryObj.IsNervousSystemWNL == false && $scope.PreAdmCardioSummaryObj.SelectedNervousSystemIssues !== '') || $scope.PreAdmCardioSummaryObj.IsNervousSystemWNL) ||
                                    (($scope.PreAdmCardioSummaryObj.IsMusculoSkeletalSystemWNL == false && $scope.PreAdmCardioSummaryObj.SelectedMusculoSkeletalSystemIssues !== '') || $scope.PreAdmCardioSummaryObj.IsMusculoSkeletalSystemWNL) ||
                                    (($scope.PreAdmCardioSummaryObj.IsKidneyDiseaseWNL == false && $scope.PreAdmCardioSummaryObj.SelectedKidneyDiseaseIssues !== '') || $scope.PreAdmCardioSummaryObj.IsKidneyDiseaseWNL) ||
                                    (($scope.PreAdmCardioSummaryObj.IsAutoImmuneDisordersWNL == false && $scope.PreAdmCardioSummaryObj.SelectedAutoImmuneDisordersIssues !== '') || $scope.PreAdmCardioSummaryObj.IsAutoImmuneDisordersWNL) ||
                                    (($scope.PreAdmCardioSummaryObj.IsPsychosisWNL == false && $scope.PreAdmCardioSummaryObj.SelectedPsychosisIssues !== '') || $scope.PreAdmCardioSummaryObj.IsPsychosisWNL) ||
                                    (($scope.PreAdmCardioSummaryObj.IsOthersWNL == false && $scope.PreAdmCardioSummaryObj.SelectedOthersIssues !== '') || $scope.PreAdmCardioSummaryObj.IsOthersWNL) ||
                                    (($scope.PreAdmCardioSummaryObj.IsHeentWNL == false && $scope.PreAdmCardioSummaryObj.SelectedHeentIssues !== '') || $scope.PreAdmCardioSummaryObj.IsHeentWNL) ||
                                    (($scope.PreAdmCardioSummaryObj.IsLungsWNL == false && $scope.PreAdmCardioSummaryObj.SelectedLungsIssues !== '') || $scope.PreAdmCardioSummaryObj.IsLungsWNL)
                                ) {
                                    $scope.PreAdmCardioSummaryObj.IsAdvanceCardInd = true;
                                } else {
                                    $scope.PreAdmCardioSummaryObj.IsAdvanceCardInd = false;
                                }
                        // condtion over
                                if ($scope.CardiologyDetails.HealthArray.length > 0) {
                                    $scope.GetHealthAdvancedData($scope.CardiologyDetails.HealthArray);

                                    $scope.PreAdmCardioSummaryObj.IsPreAdmChecklistMainInd = true;
                                    $scope.PreAdmCardioSummaryObj.IsPreAdmChecklistHealthPlanInd = true;
                                }
                                else if (!$scope.CardiologyDetails.IsCardiacWNL && !$scope.CardiologyDetails.IsCNSHistory && !$scope.CardiologyDetails.IsAutoImmuneDisordersWNL && !$scope.CardiologyDetails.IsEndocrineWNL && !$scope.CardiologyDetails.IsHemeOncWNL && !$scope.CardiologyDetails.IsHepaticWNL && !$scope.CardiologyDetails.IsPulmonaryWNL
                                    && !$scope.CardiologyDetails.IsKidneyDiseaseWNL && !$scope.CardiologyDetails.IsMusculoSkeletalSystemWNL && !$scope.CardiologyDetails.IsNervousSystemWNL && !$scope.CardiologyDetails.IsNeurologicWNL && !$scope.CardiologyDetails.IsOthersWNL && !$scope.CardiologyDetails.IsPsychosisWNL && !$scope.CardiologyDetails.IsRespiratoryNormal && !$scope.CardiologyDetails.IsHeentWNL && !$scope.CardiologyDetails.IsLungsWNL) {

                                    $scope.PreAdmCardioSummaryObj.IsPreAdmChecklistMainInd = false;
                                    $scope.PreAdmCardioSummaryObj.IsPreAdmChecklistHealthPlanInd = false;
                                }



                                if ($scope.PreAdmCardioSummaryObj.IsCNSHistory == true) {
                                    $scope.PreAdmCardioSummaryObj.IsCNSHistoryInd = true;
                                } else {
                                    $scope.PreAdmCardioSummaryObj.IsCNSHistoryInd = false;
                                }


                                if ($scope.PreAdmCardioSummaryObj.APAnesthesiaOptionsObj.AnesthetistId != '') {
                                    let Anesthetistlist = $filter("filter")($scope.AnesthetistArray, function (kitem) { return kitem.DoctorID == $scope.PreAdmCardioSummaryObj.APAnesthesiaOptionsObj.AnesthetistId });

                                    Anesthetistlist = Anesthetistlist || [];
                                    if (Anesthetistlist.length > 0) {
                                        $scope.PreAdmCardioSummaryObj.APAnesthesiaOptionsObj.AnesthetistName = Anesthetistlist[0].FullName;
                                    }
                                }

                                //if ($scope.PreAdmissionDetails.PreAdmissionId !== 0 && !$scope.PreAdmObj.IsEdit) {
                                //    $scope.PreAdmObj.IsShow = true;
                                //    $scope.PreAdmObj.IsShowPreAdmissionSummaryView = false;
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

                            $scope.PreAdmCardioSummaryObj.PreAdmissionStatusId = $scope.CardiologyDetails.PreAdmissionStatusId;
                            $scope.PreAdmCardioSummaryObj.PreAdmissionStatus = $scope.CardiologyDetails.PreAdmissionStatus||'';
                            $scope.PreAdmCardioSummaryObj.PrescriptionDetails = angular.copy($scope.CardiologyDetails.Prescription);

                            $scope.FilesObj.TempImagesArray = [];


                            if ($scope.CardiologyDetails.VitalsArray.length > 0) {
                                $scope.PreAdmCardioSummaryObj.IsPreadmVitalsInd = true;
                            } else {
                                $scope.PreAdmCardioSummaryObj.IsPreadmVitalsInd = false;
                            }

                            if ($scope.CardiologyDetails.InvestigationsList.length > 0) {
                                $scope.PreAdmCardioSummaryObj.IsPreAdmLabsInvestigationsInd = true;
                            } else {
                                $scope.PreAdmCardioSummaryObj.IsPreAdmLabsInvestigationsInd = false;
                            }

                            if ($scope.PreAdmCardioSummaryObj.IsPreAdmLabsInvestigationsInd || $scope.PreAdmCardioSummaryObj.IsPreAdmPreSurgeryMedicationsInd || $scope.PreAdmCardioSummaryObj.IsPreAdmCurrentMedicationsInd) {
                                $scope.PreAdmCardioSummaryObj.IsPreAdmPreSurgeryOrdersMainInd = true;
                            } else {
                                $scope.PreAdmCardioSummaryObj.IsPreAdmPreSurgeryOrdersMainInd = false;
                            }


                            if ($scope.PreAdmCardioSummaryObj.LabObj.HGB == "" && $scope.PreAdmCardioSummaryObj.LabObj.HCT == "" && $scope.PreAdmCardioSummaryObj.LabObj.WBC == "" && $scope.PreAdmCardioSummaryObj.LabObj.RBC == "" && $scope.PreAdmCardioSummaryObj.LabObj.A1C == "" && $scope.PreAdmCardioSummaryObj.LabObj.Creatinine == "" &&
                                $scope.PreAdmCardioSummaryObj.LabObj.RBS == "" && $scope.PreAdmCardioSummaryObj.LabObj.FBS == "" && $scope.PreAdmCardioSummaryObj.LabObj.PBBS == "" && $scope.PreAdmCardioSummaryObj.LabObj.PBLS == "" && $scope.PreAdmCardioSummaryObj.LabObj.Notes == "") {
                                $scope.PreAdmCardioSummaryObj.IsPrAdmEvaluationLabInd = false;
                            } else {
                                $scope.PreAdmCardioSummaryObj.IsPrAdmEvaluationLabInd = true;
                            }

                            if ($scope.PreAdmCardioSummaryObj.CardioVascularObj.Systolic == "" && $scope.PreAdmCardioSummaryObj.CardioVascularObj.Diastolic == "" && $scope.PreAdmCardioSummaryObj.CardioVascularObj.PR == "" && $scope.PreAdmCardioSummaryObj.CardioVascularObj.ECG == "" && $scope.PreAdmCardioSummaryObj.CardioVascularObj.ECGUnits == "" &&
                                $scope.PreAdmCardioSummaryObj.CardioVascularObj.Notes == "" && $scope.PreAdmCardioSummaryObj.CardioVascularObj.BPlevel == "" ) {
                                $scope.PreAdmCardioSummaryObj.IsPrAdmEvaluationCardioInd = false;
                            } else {
                                $scope.PreAdmCardioSummaryObj.IsPrAdmEvaluationCardioInd = true;
                            }

                            if ($scope.PreAdmCardioSummaryObj.AirwayObj.ROMTMS == "" && $scope.PreAdmCardioSummaryObj.AirwayObj.ROMNECKLAT == "" && $scope.PreAdmCardioSummaryObj.AirwayObj.ROMNECKAP == "" && !$scope.PreAdmCardioSummaryObj.AirwayObj.IsNormal &&
                                $scope.PreAdmCardioSummaryObj.AirwayObj.Notes == "" && $scope.PreAdmCardioSummaryObj.AirwayObj.Class == "") {
                                $scope.PreAdmCardioSummaryObj.IsPrAdmEvaluationAirwayInd = false;
                            } else {
                                $scope.PreAdmCardioSummaryObj.IsPrAdmEvaluationAirwayInd = true;
                            }

                            if ($scope.PreAdmCardioSummaryObj.IsPrAdmEvaluationAirwayInd || $scope.PreAdmCardioSummaryObj.IsPrAdmEvaluationCardioInd || $scope.PreAdmCardioSummaryObj.IsPrAdmEvaluationLabInd) {
                                $scope.PreAdmCardioSummaryObj.IsPreAdmEvaluationMainInd = true;
                            } else {
                                $scope.PreAdmCardioSummaryObj.IsPreAdmEvaluationMainInd = false;
                            }

                            if ($scope.PreAdmCardioSummaryObj.IsPrAdmROSAllergiesInd || $scope.PreAdmCardioSummaryObj.IsPrAdmROSSurgicalInd || $scope.PreAdmCardioSummaryObj.IsPrAdmROSSystemicInd) {
                                $scope.PreAdmCardioSummaryObj.IsPreAdmROSMainInd = true;
                            } else {
                                $scope.PreAdmCardioSummaryObj.IsPreAdmROSMainInd = false;
                            }

                            let SelectedSurgeryList = angular.copy(resp[0].data.SurgeryArray);

                            SelectedSurgeryList = SelectedSurgeryList || [];

                            $scope.SelectedSurgeryArray = [];

                            if (SelectedSurgeryList.length > 0) {
                                angular.forEach(SelectedSurgeryList, function (item) {
                                    let obj = {
                                        "SurgeryName": item.SurgeryName,
                                        "SurgerySuggestedDate": $filter('date')(item.SurgerySuggestedDate, "MM-dd-yyyy"),
                                        "PreAdmissionStatusId": $scope.PreAdmCardioSummaryObj.PreAdmissionStatusId,
                                        "AnesthetistName": $scope.PreAdmCardioSummaryObj.APAnesthesiaOptionsObj.AnesthetistName,
                                    };
                                    $scope.SelectedSurgeryArray.push(obj);
                                });
                            }

                            if ($scope.CardiologyDetails.DocumentDetails.length > 0) {
                                $scope.PreAdmCardioSummaryObj.DocumentDetails = angular.copy($scope.CardiologyDetails.DocumentDetails);
                            }
                            else {
                                $scope.PreAdmCardioSummaryObj.DocumentDetails = [];
                            }

                            resp[0].data.CardiologistDetails[0].CardiologistDiagnosis = resp[0].data.CardiologistDetails[0].CardiologistDiagnosis || [];
                            if (resp[0].data.CardiologistDetails[0].CardiologistDiagnosis.length > 0) {
                                $scope.PreAdmCardioSummaryObj.CardiologistDiagnosis = angular.copy(resp[0].data.CardiologistDetails[0].CardiologistDiagnosis);
                            }

                            $scope.CardiologyDetails.OtherSystemArray = $scope.CardiologyDetails.OtherSystemArray || [];
                            if ($scope.CardiologyDetails.OtherSystemArray.length > 0) {
                                $scope.PreAdmCardioSummaryObj.OtherSystemArray = angular.copy($scope.CardiologyDetails.OtherSystemArray);
                            }
                            else {
                                $scope.PreAdmCardioSummaryObj.OtherSystemArray = [];
                            }

                        } else {
                            $scope.CardiologistPreAdmissionDetails = [];
                            $scope.PreAdmCardioSummaryObj = angular.copy($scope.GetPreAdmCardioSummaryObj());

                            resp[0].data.SurgeryArray = resp[0].data.SurgeryArray || [];

                            $scope.PreAdmCardioSummaryObj.IsPreadmVitalsInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPreAdmROSMainInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPrAdmROSSystemicInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPrAdmROSSurgicalInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPrAdmROSAllergiesInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPreAdmEvaluationMainInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPrAdmEvaluationLabInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPrAdmEvaluationCardioInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPrAdmEvaluationAirwayInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPreAdmChecklistMainInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPreAdmChecklistHealthPlanInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPreAdmPreSurgeryOrdersMainInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPreAdmPreSurgeryMedicationsInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPreAdmCurrentMedicationsInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPreAdmLabsInvestigationsInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPreAdmAnesthetistPlanMainInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPreAdmPreviousAnestheticInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPreAdmAssessmentASAInd = false;
                            $scope.PreAdmCardioSummaryObj.IsPreAdmAnestheticPlanInd = false;

                        }
                    }

                    /*checklist  start*/

                    if (resp[0].data.PreAdmisssionCheckLists.length > 0) {
                        $scope.ClinicalChecklistParentObj.ClinicalChecklist = angular.copy(resp[0].data.PreAdmisssionCheckLists);
                    }
                    if (resp[0].data.CheckListRemarks != "") {
                        $scope.ClinicalChecklistParentObj.CheckListRemarks = angular.copy(resp[0].data.CheckListRemarks);
                        $scope.ClinicalChecklistParentObj.CheckListRemarks = $scope.ClinicalChecklistParentObj.CheckListRemarks.replace(/\n/g, '<br>');
                    }
                    else {
                        $scope.ClinicalChecklistParentObj.CheckListRemarks = "";
                    }
                     /*only documents*/
                    if (resp[0].data.PreAdmissionChecklistDocuments.length > 0) {
                        $scope.ClinicalChecklistParentObj.PreAdmissionChecklistDocuments = angular.copy(resp[0].data.PreAdmissionChecklistDocuments) || [];
                    } else {
                        $scope.ClinicalChecklistParentObj.PreAdmissionChecklistDocuments = [];
                    }
                    /*checklist  end*/


                    if ($scope.TabObj.SelectedTab === 5) {
                        var element = document.getElementById('summarymain1');

                        if (element) {
                            element.scrollIntoView(false);
                        }
                    } else if ($scope.TabObj.SelectedTab === 10) {
                        var element = document.getElementById('summarymain2');

                        if (element) {
                            element.scrollIntoView(false);
                        }
                    } else if ($scope.TabObj.SelectedTab === 12) {
                        var element = document.getElementById('summarymain3');

                        if (element) {
                            element.scrollIntoView(false);
                        }
                    }
                }
            });
        }

        $scope.GetASCPreAdmissionSummary();

        $scope.NavFromSumary = function (val) {
            $scope.$emit("PreAdmSummaryNavigationEvent", val);
        }

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
                "Type": "Unsign"
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
                $scope.$emit("PreAdmSummaryNavigationEvent", val);
            }, function (data) {

            });
        }
        $scope.Ascpreadminmoredata = {
            templateUrl: 'templates/uibpopups/AscpreadminmoredataPopover.html',
        }
        
        $scope.Signoffreviewby = {
            templateUrl: 'templates/UIBPopovers/SignoffreviewbyPopover.html',
        }











        $scope.PreAdmOverallsignFromSumary = function (val) {
            let screen = "";
            screen = "PreAdmOverallSignoff";

            let obj = {
                "Screen": screen,
                "Type": "SignOff",
                "allUserList": $scope.allUserList || [],

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
                $scope.GetASCPreAdmissionSummary();
            }, function (data) {

            });
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

    }]);

"use strict";
eHnoteWebApp.controller("USAscVisitsCtrl", ["$scope", "$rootScope", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteSurgeryService", "eHnoteCacheStorageService", "eHnoteAuditServices", "$uibModal", "eHnoteMainAppointmentService", "eHnoteDiagnosisDataServices", "datapersistanceFactory", "eHnotePatientDataService","$q",
    function ($scope, $rootScope, $filter, alertify, eHnoteMasterDataService, eHnoteSurgeryService, eHnoteCacheStorageService, eHnoteAuditServices, $uibModal, eHnoteMainAppointmentService, eHnoteDiagnosisDataServices, datapersistanceFactory, eHnotePatientDataService, $q) {

        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var appointmentInfo = eHnoteMasterDataService.getAppointmentInfo();

        $scope.SelectedAppointmentId = $scope.cacheStorageItem.AppointmentId;
        $scope.VisitsObj = {
            "IsShowEdit": false,
            "IsPreAdmissionView": false,
            "IsASCView": false,
            "IsPreAdmissionData": false
        };

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        $scope.SelectedFile = 1;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        };


        $scope.GetASCSummaryObj = function(){
            return {
                "PatientASCPreOPId": null,
                "PatientASCIntraOPId": null,
                "PatientASCPostOPId": null,
                "PreOpVitals": [],
                "PreOpSystemicHistory": [],
                "PreOpSurgicalHistory": [],
                "PreOpAllergyHistory": [],
                "PreOpCurrentMedicationList": [],
                "PreOpSurgeryMedicationList": [],
                "PreOpInvestigationList": [],
                "PreOpMedications": [],
                "PreOpNotes": "",
                "ReviewedByName": "",
                "HealthArray": [],
                "IsAllHealthWNL": false,
                "IsAutoImmuneDisordersWNL": false,
                "IsCardiacWNL": false,
                "IsEndocrineWNL": false,
                "IsHemeOncWNL": false,
                "IsHepaticWNL": false,
                "IsKidneyDiseaseWNL": false,
                "IsMusculoSkeletalSystemWNL": false,
                "IsNervousSystemWNL": false,
                "IsNeurologicWNL": false,
                "IsOthersWNL": false,
                "IsPsychosisWNL": false,
                "IsPulmonaryWNL": false,
                "AlderetScoreDetails": [],
                "AldreteDetails": [],
                "AldreteTotalScoreDetails": [],
                "OrgASCChecklist": [],
                "PreOpCallDetails": [],
                "PatientCheckin": "",
                "IntraOpVitals": [],
                "IntraOpSystemicHistory": [],
                "IntraOpSurgicalHistory": [],
                "IntraOpAllergyHistory": [],
                "IntraOpNurseChecklists": [],
                "IntraOpAnesthesiaChecklists": [],
                "IntraOPDocumentDetails": [],
                "SurgeryRoomNo": "",
                "HallEntranceStartTime": "",
                "HallEntranceEndTime": "",
                "SurgeryStartTime": "",
                "SurgeryEndTime": "",
                "AnesthesiaStartTime": "",
                "AnesthesiaEndTime": "",
                "Surgeon": "",
                "Technician": "",
                "Anesthesiologist": "",
                "Relief": "",
                "CirculatingNurse": "",
                "OtherPersonPresent": "",
                "SurgicalFirstNeedles": null,
                "SurgicalFirstBlades": null,
                "SurgicalFirstOthers": null,
                "SurgicalFirstTime": "",
                "SurgicalFirstVerifiedBy": "",
                "SurgicalSecondNeedles": null,
                "SurgicalSecondBlades": null,
                "SurgicalSecondOthers": null,
                "SurgicalSecondTime": "",
                "SurgicalSecondVerifiedBy": "",
                "SurgicalFinalNeedles": null,
                "SurgicalFinalBlades": null,
                "SurgicalFinalOthers": null,
                "SurgicalFinalTime": "",
                "SurgicalFinalVerifiedBy": "",
                "SurgeonOperativeNotes": "",
                "IntraOpInvestigationsList": [],
                "IntraOpMedications": [],
                "Actions": [],
                "AnesthesiaTableArray": [],
                "GraphAnesthesiaStartTime": "",
                "GraphAnesthesiaEndTime": "",
                "GraphAnesthesiaSlotDuration": null,
                "IntraOpGraphUrl": "",
                "PostOpVitals": [],
                "PostOpDiagnosis": [],
                "DocumentDetails": [],
                "PostOpSystemicHistory": [],
                "PostOpSurgicalHistory": [],
                "PostOpAllergyHistory": [],
                "PostOpInstruction": "",
                "PostOpDoctorNotes": "",
                "PostOpMedications": [],
                "PostOpInvestigations": [],
                "DischargeCriteriaChecklist": [],
                "DischargeTransferChecklist": [],
                "PostOpOperativeNotes": "",
                "TransferTime": "",
                "TransferReason": "",
                "CriteriaNotes": "",
                "TotalAlderetScore": "",
                "PostOpAnesthesiaTableArray": [],
                "PostOpGraphAnesthesiaStartTime": "",
                "PostOpGraphAnesthesiaEndTime": "",
                "PostOpGraphAnesthesiaSlotDuration": null,
                "PostOpGraphUrl": "",
                "NurseCheckLists": [],
                "NurseActions": [],
                "PreOPDocumentDetails": [],
                "PreOperativeOrientationOffered": "",
                "PreOperativeOrientationOfferedNotes": "",
                "ObservedBehavior": "",
                "ObservedBehaviorNotes": "",
                "LevelOfConsciousness": "",
                "LevelOfConsciousnessNotes": "",
                "AccompainedBy": "",
                "PatientTransfferedIn": "",
                "PatientDestination": "",
                "PTERefers": "",
                "PTEReferNotes": "",
                "PatientDestinationNotes": "",
                "PatientTransfferedNotes": "",
                "AccompainedByNotes": "",
                "IsShowPreOpCheckListHealthPhysicalInd": false,


            };
        };

        $scope.ASCSummaryObj = angular.copy($scope.GetASCSummaryObj());

        $scope.GetVisitsChecklistsObj = function () {
            return {
                'IsShowPreOpVitalsInd': true,
                'IsShowPreOpROSInd': true,
                'IsShowPreOpSystemicHistoryInd': true,
                'IsShowPreOpSurgicalHistoryInd': true,
                'IsShowPreOpAllergiesInd': true,
                'IsShowPreOpPreAdmissionOrdersInd': true,
                'IsShowPreOpPreSurgiesMedicationInd': true,
                'IsShowPreOpCurrentMedicationInd': true,
                'IsShowPreOpLabInvestigationInd': true,
                'IsShowPreOpActionInd': true,
                'IsShowPreOpcallInd': true,
                'IsShowPreOpMedicationInd': true,
                'IsShowPreOPPatientCheckinInd': true,
                'IsShowPreOPNotesInd': true,
                'IsShowIntraOpVitalsInd': true,
                'IsShowIntraOpROSInd': true,
                'IsShowIntraOpSystemicHistoryInd': true,
                'IsShowIntraOpSurgicalHistoryInd': true,
                'IsShowIntraOpAllergiesInd': true,
                'IsShowIntraOpActionInd': true,
                'IsShowIntraOpSurgeryTimesInd': true,
                'IsShowIntraOpSurgeryStaffInd': true,
                'IsShowIntraOpSurgeryCountInd': true,
                'IsShowIntraOpSurgeonInd': true,
                'IsShowIntraOpDoctorNotesInd': true,
                'IsShowIntraOpOperativeNotesInd': true,
                'IsShowIntraOpOrdersInd': true,
                'IsShowIntraOpMedicationsInd': true,
                'IsShowIntraOpInvestigationsInd': true,
                'IsShowIntraOpAnesthesiaInd': true,
                'IsShowIntraOPNotesInd': true,
                'IsShowPostOpVitalsInd': true,
                'IsShowPostOpROSInd': true,
                'IsShowPostOpSystemicHistoryInd': true,
                'IsShowPostOpSurgicalHistoryInd': true,
                'IsShowPostOpAllergiesInd': true,
                'IsShowPostOpSurgeonInd': true,
                'IsShowPostOpDoctorNotesInd': true,
                'IsShowPostOpInstructionsInd': true,
                'IsShowPostOpOrdersInd': true,
                'IsShowPostOpMedicationsInd': true,
                'IsShowPostOpInvestigationsInd': true,
                'IsShowPostOpDischargeInd': true,
                'IsShowPostOpOperativeNotesInd': true,
                'IsShowPostOpDischargeCriteriaInd': true,
                'IsShowPostOpTransferInd': true,
                'IsShowPostOpAnesthesiaInd': true,
                'IsShowPostOPNotesInd': true,
                'IsShowIntraOtherFieldsInd ': true,
                'IsShowIntraClassificationCasesInd':true,
                'IsShowIntraDrainagePresenceInd ':true,
                'IsShowIntraCauteraisationInd': true,
                'IsShowIntraOpComplicationNotesInd': true,
                'IsShowNurseActionNotesInd': true,
                'IsShowAscPatientGoalInd': true,
                'IsActionPreOpCallInd':true
            };
        };

        $scope.VisitsChecklistsObj = angular.copy($scope.GetVisitsChecklistsObj());

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
                        "Name": "Partial Prothrombin Time",
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
                "Notes": ""
            };
        };

        $scope.LabObj = $scope.GetLabObj();

        $scope.CardioVascularObj = {
            "Systolic": "",
            "Diastolic": "",
            "PR": "",
            "ECG": "",
            "Notes": ""
        };

        $scope.AirwayObj = {
            "IsNormal": false,
            "ROMTMS": "",
            "ROMNECKAP": "",
            "ROMNECKLAT": "",
            "Class": "",
            "Notes": ""
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

        $scope.GetPreAdmObj = function() {
            return {
                "PreAdmissionId": null,
                "Vitals": [],
                "SystemicHistory": [],
                "AllergyItems": [],
                "SurgicalHistory": [],
                "LabObj": {
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
                            "Name": "Partial Prothrombin Time",
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
                    "Notes": ""
                },
                "AirwayObj": {
                    "IsNormal": false,
                    "ROMTMS": "",
                    "ROMNECKAP": "",
                    "ROMNECKLAT": "",
                    "Class": "",
                    "Notes": ""
                },
                "CardioVascularObj": {
                    "Systolic": "",
                    "Diastolic": "",
                    "PR": "",
                    "ECG": "",
                    "Notes": ""
                },
                "Health": "",
                "APAnesthesiaOptionsObj": {
                    "Dosage": "",
                    "AnesthetistId": null,
                    "IsTopicalAnesthesia": false,
                    "IsLocalAnesthesia": false,
                    "IsGeneralAnesthesia": false,
                    "IsRegionalAnesthesia": false,
                    "IsPeriBulbarAnesthesia": false,
                    "IsSubtenonAnesthesia": false,
                    "AnesthetistName": ""
                },
                "ASAObj": {
                    "Value": "",
                    "Notes": ""
                },
                "PrevAnestheticsObj": {
                    "IsPrevAnesthesia": false,
                    "IsComplications": false,
                    "IsFamilyHistory": false,
                    "IsDifficultAirway": false,
                    "IsPONV": false,
                    "IsPatientDNR": false,
                    "IsSuspend": false,
                    "IsContinue": false,
                    "Notes": ""
                },
                "IsCardiacWNL": false,
                "IsCNSHistory": false,
                "IsAutoImmuneDisordersWNL": false,
                "IsEndocrineWNL": false,
                "IsHemeOncWNL": false,
                "IsHepaticWNL": false,
                "IsKidneyDiseaseWNL": false,
                "IsMusculoSkeletalSystemWNL": false,
                "IsNervousSystemWNL": false,
                "IsNeurologicWNL": false,
                "IsOthersWNL": false,
                "IsPsychosisWNL": false,
                "IsPulmonaryWNL": false,
                "IsRespiratoryNormal": false,
                "SocialNotes": "",
                "RespiratoryNotes": "",
                "PulmonaryNotes": "",
                "PsychosisNotes": "",
                "OthersNotes": "",
                "NeurologicNotes": "",
                "NervousSystemNotes": "",
                "MusculoSkeletalSystemNotes": "",
                "KidneyDiseaseNotes": "",
                "HepaticNotes": "",
                "HemeOncNotes": "",
                "EndocrineNotes": "",
                "CardiacNotes": "",
                "CNSNotes": "",
                "AutoImmuneDisordersNotes": "",
                "CurrentMedicationList": [],
                "MedicationsList": [],
                "InvestigationsList": [],
                "ReviewedBy": null,
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
                "HeentNotes": "",
                "IsHeentWNL": false,
                "LungsNotes": "",
                "IsLungsWNL":false,
                //"PreAdmissionStatusId": null,
                //"AnesthesiaPlan": "",
                //"PreAdmissionChartStatus": "D",
                //"StatusFlag": "D",
                //"IsShow": false,
                //"IsEdit": false,
                //"IsShowPreAdmissionSummaryView": false,
                //"PreAdmissionStatusId": null
            };
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
                    "Notes": ""
                },
                "AirwayObj": {
                    "IsNormal": false,
                    "ROMTMS": "",
                    "ROMNECKAP": "",
                    "ROMNECKLAT": "",
                    "Class": "",
                    "Notes": ""
                },
                "MedicationsList": [],
                "CurrentMedicationList": [],
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
                "SelectedHeentIssues": "",
                "SelectedLungsIssues": "",
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
                "IsHeentWNL": false,
                "LungsNotes": "",
                "IsLungsWNL": false,
                "IsCNSHistory": false,
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
            };
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
        $scope.PreAdmObj = angular.copy($scope.GetPreAdmObj());
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
                "HealthArray": "",
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
                    "Notes": ""
                },
                "AirwayObj": {
                    "IsNormal": false,
                    "ROMTMS": "",
                    "ROMNECKAP": "",
                    "ROMNECKLAT": "",
                    "Class": "",
                    "Notes": ""
                },
                "MedicationsList": [],
                "CurrentMedicationList": [],
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
                "IsCNSHistory": false,
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
                "SelectedHeentIssues": "",
                "SelectedLungsIssues": "",
                "HeentNotes": "",
                "IsHeentWNL": false,
                "LungsNotes": "",
                "IsLungsWNL": false,
            };
        };
        $scope.PreAdmAnesthetistObj = angular.copy($scope.GetPreAdmAnesthetistObj());
        $scope.GetFilesObj = function () {
            return {
                "DocumentDetails": [],
                "TempImagesArray": []
            };
        };

        $scope.FilesObj = angular.copy($scope.GetFilesObj());
        $scope.GetASCOverallSummary = function (obj) {
            $scope.SelectedAppointment = angular.copy(obj);
            $scope.SurgeryList = angular.copy(obj.SurgeryList);
            $scope.GetSurgeryData();
        }

        $scope.GetSurgeryData = function (object) {
            object = object || "";
            let selectedSurgery;
            if (object == "") {
                angular.forEach($scope.SurgeryList, function (item) {
                    item.IsSelected = false;
                });
               
                if ($scope.SurgeryList.length > 0) {
                    selectedSurgery = $scope.SurgeryList[0];
                }
                selectedSurgery = selectedSurgery || "";
                if (selectedSurgery != "") {
                    selectedSurgery.IsSelected = !selectedSurgery.IsSelected;
                }
            } else {
                angular.forEach($scope.SurgeryList, function (item) {
                    item.IsSelected = false;
                });
                selectedSurgery = angular.copy(object);
                object.IsSelected = !object.IsSelected;
            }

            var obj = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.SelectedAppointment.AppointmentId || null,
                "PatientId": $scope.cacheStorageItem.PatientID,
                "PatientSurgeryId": (selectedSurgery != "") ? selectedSurgery.PatientSurgeryId : null
            }
            eHnoteSurgeryService.GetASCOverallSummary(obj).then(function (response) {
                if (response.data !== undefined) {
                    $scope.ASCSummaryObj = angular.copy($scope.GetASCSummaryObj());
                    $scope.ASCSummaryDetails = angular.copy(response.data);

                    if ($scope.ASCSummaryDetails.PatientASCPreOP.length > 0) {

                        angular.forEach($scope.ASCSummaryDetails.PatientASCPreOP, function (kitem) {

                            $scope.ASCSummaryObj.PatientASCPreOPId = kitem.PatientASCPreOPId;

                            if (kitem.Vitals.length > 0) {
                                angular.forEach(kitem.Vitals, function (hitem) {
                                    let today = $filter('date')(new Date(), "yyyy-MM-dd");
                                    let datetime = today + " " + hitem.Time;
                                    hitem.Time = $filter('date')(new Date(datetime), "hh:mm a");
                                });
                                $scope.ASCSummaryObj.PreOpVitals = angular.copy(kitem.Vitals);
                                $scope.VisitsChecklistsObj.IsShowPreOpVitalsInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPreOpVitalsInd = false;
                            }
                            if (kitem.SystemicHistory.length > 0) {
                                $scope.ASCSummaryObj.PreOpSystemicHistory = kitem.SystemicHistory;
                                $scope.VisitsChecklistsObj.IsShowPreOpSystemicHistoryInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPreOpSystemicHistoryInd = false;
                            }
                            if (kitem.SurgicalHistory.length > 0) {
                                $scope.ASCSummaryObj.PreOpSurgicalHistory = kitem.SurgicalHistory;
                                $scope.VisitsChecklistsObj.IsShowPreOpSurgicalHistoryInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPreOpSurgicalHistoryInd = false;
                            }
                            if (kitem.AllergyItems.length > 0) {
                                $scope.ASCSummaryObj.PreOpAllergyHistory = kitem.AllergyItems;
                                $scope.VisitsChecklistsObj.IsShowPreOpAllergiesInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPreOpAllergiesInd = false;
                            }
                          
                            if ($scope.VisitsChecklistsObj.IsShowPreOpAllergiesInd || $scope.VisitsChecklistsObj.IsShowPreOpSurgicalHistoryInd || $scope.VisitsChecklistsObj.IsShowPreOpSystemicHistoryInd) {
                                $scope.VisitsChecklistsObj.IsShowPreOpROSInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPreOpROSInd = false;
                            }


                            if (kitem.CurrentMedicationList.length > 0) {
                                $scope.ASCSummaryObj.PreOpCurrentMedicationList = kitem.CurrentMedicationList;
                                $scope.VisitsChecklistsObj.IsShowPreOpCurrentMedicationInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPreOpCurrentMedicationInd = false;
                            }
                            if ($scope.ASCSummaryObj.PreOpCurrentMedicationList.length > 0) {
                                $scope.IsContinuationMedication = false;
                                $scope.IsStopMedication = false;
                                angular.forEach($scope.ASCSummaryObj.PreOpCurrentMedicationList, function (item) {
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
                            if (kitem.MedicationsList.length > 0) {
                                $scope.ASCSummaryObj.PreOpSurgeryMedicationList = kitem.MedicationsList;
                                $scope.VisitsChecklistsObj.IsShowPreOpPreSurgiesMedicationInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPreOpPreSurgiesMedicationInd = false;
                            }
                            if (kitem.InvestigationsList.length > 0) {
                                $scope.ASCSummaryObj.PreOpInvestigationList = kitem.InvestigationsList;
                                $scope.VisitsChecklistsObj.IsShowPreOpLabInvestigationInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPreOpLabInvestigationInd = false;
                            }

                            if ($scope.VisitsChecklistsObj.IsShowPreOpCurrentMedicationInd || $scope.VisitsChecklistsObj.IsShowPreOpPreSurgiesMedicationInd || $scope.VisitsChecklistsObj.IsShowPreOpLabInvestigationInd) {
                                $scope.VisitsChecklistsObj.IsShowPreOpPreAdmissionOrdersInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPreOpPreAdmissionOrdersInd = false;
                            }

                            if (kitem.PreOpMedications.length > 0) {
                                $scope.ASCSummaryObj.PreOpMedications = kitem.PreOpMedications;
                                $scope.VisitsChecklistsObj.IsShowPreOpMedicationInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPreOpMedicationInd = false;
                            }

                            $scope.ASCSummaryObj.PreOpNotes = kitem.PreOpNotes;
                            $scope.ASCSummaryObj.ReviewedByName = kitem.ReviewedByName;

                            if ($scope.ASCSummaryObj.PreOpNotes == "") {
                                $scope.VisitsChecklistsObj.IsShowPreOPNotesInd = false;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPreOPNotesInd = true;
                            }

                            $scope.ASCSummaryObj.HealthArray = angular.copy(kitem.HealthArray);
                            $scope.ASCSummaryObj.PreOpROSOverAllRemarks = kitem.ROSOverAllRemarks;
                            $scope.ASCSummaryObj.IsAllHealthWNL = kitem.IsAllHealthWNL;
                            $scope.ASCSummaryObj.IsAutoImmuneDisordersWNL = kitem.IsAutoImmuneDisordersWNL;
                            $scope.ASCSummaryObj.IsCardiacWNL = kitem.IsCardiacWNL;
                            $scope.ASCSummaryObj.IsEndocrineWNL = kitem.IsEndocrineWNL;
                            $scope.ASCSummaryObj.IsHemeOncWNL = kitem.IsHemeOncWNL;
                            $scope.ASCSummaryObj.IsHepaticWNL = kitem.IsHepaticWNL;
                            $scope.ASCSummaryObj.IsKidneyDiseaseWNL = kitem.IsKidneyDiseaseWNL;
                            $scope.ASCSummaryObj.IsMusculoSkeletalSystemWNL = kitem.IsMusculoSkeletalSystemWNL;
                            $scope.ASCSummaryObj.IsNervousSystemWNL = kitem.IsNervousSystemWNL;
                            $scope.ASCSummaryObj.IsNeurologicWNL = kitem.IsNeurologicWNL;
                            $scope.ASCSummaryObj.IsOthersWNL = kitem.IsOthersWNL;
                            $scope.ASCSummaryObj.IsPsychosisWNL = kitem.IsPsychosisWNL;
                            $scope.ASCSummaryObj.IsPulmonaryWNL = kitem.IsPulmonaryWNL;

                            $scope.ASCSummaryObj.CardiacNotes = kitem.CardiacNotes || '';
                            $scope.ASCSummaryObj.PulmonaryNotes = kitem.PulmonaryNotes || '';
                            $scope.ASCSummaryObj.HepaticNotes = kitem.HepaticNotes || '';
                            $scope.ASCSummaryObj.EndocrineNotes = kitem.EndocrineNotes || '';
                            $scope.ASCSummaryObj.NeurologicNotes = kitem.NeurologicNotes || '';
                            $scope.ASCSummaryObj.HemeOncNotes = kitem.HemeOncNotes || '';
                            $scope.ASCSummaryObj.NervousSystemNotes = kitem.NervousSystemNotes || '';
                            $scope.ASCSummaryObj.KidneyDiseaseNotes = kitem.KidneyDiseaseNotes || '';
                            $scope.ASCSummaryObj.MusculoSkeletalSystemNotes = kitem.MusculoSkeletalSystemNotes || '';
                            $scope.ASCSummaryObj.AutoImmuneDisordersNotes = kitem.AutoImmuneDisordersNotes || '';
                            $scope.ASCSummaryObj.PsychosisNotes = kitem.PsychosisNotes || '';
                            $scope.ASCSummaryObj.OthersNotes = kitem.OthersNotes || '';
                            $scope.ASCSummaryObj.TotalAlderetScore = kitem.TotalAlderetScore || 0;

                            $scope.ASCSummaryObj.AlderetScoreDetails = angular.copy(kitem.AlderetScoreDetails);
                            $scope.ASCSummaryObj.OrgASCChecklist = angular.copy(kitem.OrgASCChecklist);

                            $scope.ASCSummaryObj.PreOPDocumentDetails = angular.copy(kitem.DocumentDetails);

                            $scope.ASCSummaryObj.RecievedForSurgery = kitem.RecievedForSurgery || '';
                            $scope.ASCSummaryObj.RecievedForSurgeryNotes = kitem.RecievedForSurgeryNotes || '';
                            $scope.ASCSummaryObj.AccompainedBy = kitem.AccompainedBy || '';
                            $scope.ASCSummaryObj.AccompainedByNotes = kitem.AccompainedByNotes || '';
                            $scope.ASCSummaryObj.PatientTransfferedIn = kitem.PatientTransfferedIn || '';
                            $scope.ASCSummaryObj.PatientTransfferedNotes = kitem.PatientTransfferedNotes || '';
                            $scope.ASCSummaryObj.PatientDestination = kitem.PatientDestination || '';
                            $scope.ASCSummaryObj.PatientDestinationNotes = kitem.PatientDestinationNotes || '';
                            $scope.ASCSummaryObj.PTERefers = kitem.PTERefers || '';
                            $scope.ASCSummaryObj.PTEReferNotes = kitem.PTEReferNotes || '';

                            $scope.ASCSummaryObj.PreOperativeOrientationOffered = kitem.PreOperativeOrientationOffered || '';
                            $scope.ASCSummaryObj.PreOperativeOrientationOfferedNotes = kitem.PreOperativeOrientationOfferedNotes || '';
                            $scope.ASCSummaryObj.ObservedBehavior = kitem.ObservedBehavior || '';
                            $scope.ASCSummaryObj.ObservedBehaviorNotes = kitem.ObservedBehaviorNotes || '';
                            $scope.ASCSummaryObj.LevelOfConsciousness = kitem.LevelOfConsciousness || '';
                            $scope.ASCSummaryObj.LevelOfConsciousnessNotes = kitem.LevelOfConsciousnessNotes || '';

                        });
                    }
                  /*  $scope.ASCSummaryObj.IsShowPreOpCheckListHealthPhysicalInd = false;*/
                    if ($scope.ASCSummaryObj.HealthArray .length > 0) {
                        $scope.ASCSummaryObj.IsShowPreOpCheckListHealthPhysicalInd = true;
                    }
                    else if (!$scope.ASCSummaryObj.IsCardiacWNL && !$scope.ASCSummaryObj.IsPulmonaryWNL && !$scope.ASCSummaryObj.IsHepaticWNL && !$scope.ASCSummaryObj.IsAutoImmuneDisordersWNL && !$scope.ASCSummaryObj.IsEndocrineWNL && !$scope.ASCSummaryObj.IsHemeOncWNL &&
                        !$scope.ASCSummaryObj.IsKidneyDiseaseWNL && !$scope.ASCSummaryObj.IsMusculoSkeletalSystemWNL && !$scope.ASCSummaryObj.IsNervousSystemWNL && !$scope.ASCSummaryObj.IsNeurologicWNL && !$scope.ASCSummaryObj.IsOthersWNL && !$scope.ASCSummaryObj.IsPsychosisWNL) {

                        $scope.ASCSummaryObj.IsShowPreOpCheckListHealthPhysicalInd = false;
                    } else {
                        $scope.ASCSummaryObj.IsShowPreOpCheckListHealthPhysicalInd = true;
                    }
                    if ($scope.ASCSummaryDetails.PatientASCIntraOP.length > 0) {
                        angular.forEach($scope.ASCSummaryDetails.PatientASCIntraOP, function (kitem) {

                            $scope.ASCSummaryObj.PatientASCIntraOPId = kitem.PatientASCIntraOPId;

                            if (kitem.SystemicHistory.length > 0) {
                                $scope.ASCSummaryObj.IntraOpSystemicHistory = angular.copy(kitem.SystemicHistory);
                                $scope.VisitsChecklistsObj.IsShowIntraOpSystemicHistoryInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpSystemicHistoryInd = false;
                            }
                            if (kitem.SurgicalHistory.length > 0) {
                                $scope.ASCSummaryObj.IntraOpSurgicalHistory = angular.copy(kitem.SurgicalHistory);
                                $scope.VisitsChecklistsObj.IsShowIntraOpSurgicalHistoryInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpSurgicalHistoryInd = false;
                            }
                            if (kitem.AllergyItems.length > 0) {
                                $scope.ASCSummaryObj.IntraOpAllergyHistory = angular.copy(kitem.AllergyItems);
                                $scope.VisitsChecklistsObj.IsShowIntraOpAllergiesInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpAllergiesInd = false;
                            }

                            $scope.ASCSummaryObj.ROSOverAllRemarks = kitem.ROSOverAllRemarks;

                            if ($scope.ASCSummaryObj.ROSOverAllRemarks != null || $scope.ASCSummaryObj.ROSOverAllRemarks != "") {
                                $scope.VisitsChecklistsObj.IsROSOverallRemarksInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsROSOverallRemarksInd = false;
                            }

                            if ($scope.VisitsChecklistsObj.IsShowIntraOpAllergiesInd || $scope.VisitsChecklistsObj.IsShowIntraOpSurgicalHistoryInd || $scope.VisitsChecklistsObj.IsShowIntraOpSystemicHistoryInd || $scope.VisitsChecklistsObj.IsROSOverallRemarksInd) {
                                $scope.VisitsChecklistsObj.IsShowIntraOpROSInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpROSInd = false;
                            }


                            if (kitem.Vitals.length > 0) {
                                $scope.ASCSummaryObj.IntraOpVitals = angular.copy(kitem.Vitals);
                                $scope.VisitsChecklistsObj.IsShowIntraOpVitalsInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpVitalsInd = false;
                            }

                            if (kitem.PatientAscChecklist.length > 0) {
                                $scope.ASCSummaryObj.IntraOpNurseChecklists = angular.copy(kitem.PatientAscChecklist);
                            }

                            $scope.ASCSummaryObj.SurgeryRoomNo = kitem.SurgeryRoomNo;
                            $scope.ASCSummaryObj.HallEntranceEndTime = kitem.HallEntranceEndTime;
                            $scope.ASCSummaryObj.HallEntranceStartTime = kitem.HallEntranceStartTime;
                            $scope.ASCSummaryObj.SurgeryEndTime = kitem.SurgeryEndTime;
                            $scope.ASCSummaryObj.SurgeryStartTime = kitem.SurgeryStartTime;
                            $scope.ASCSummaryObj.AnesthesiaStartTime = kitem.AnesthesiaStartTime;
                            $scope.ASCSummaryObj.AnesthesiaEndTime = kitem.AnesthesiaEndTime;

                            $scope.ASCSummaryObj.Disposition = kitem.Disposition;
                            $scope.ASCSummaryObj.Recoveryroom = kitem.Recoveryroom;
                            $scope.ASCSummaryObj.CarePostoperative = kitem.CarePostoperative;
                            $scope.ASCSummaryObj.OthersIntraData = kitem.OthersIntraData;
                            $scope.ASCSummaryObj.PatientTolerated = kitem.PatientTolerated;

                            $scope.ASCSummaryObj.Cleansed = kitem.Cleansed;
                            $scope.ASCSummaryObj.Contaminated = kitem.Contaminated;
                            $scope.ASCSummaryObj.Dirty = kitem.Dirty;
                            $scope.ASCSummaryObj.DrainageOthers = kitem.DrainageOthers;
                            $scope.ASCSummaryObj.HydrationIV = kitem.HydrationIV;

                            $scope.ASCSummaryObj.Cauteraisation = kitem.Cauteraisation || [];

                            $scope.ASCSummaryObj.AnesthetistNotes = kitem.AnesthetistNotes;
                            $scope.ASCSummaryObj.ChecklistRemarks = kitem.ChecklistRemarks;
                            $scope.ASCSummaryObj.NurseCheckListNotes = kitem.NurseCheckListNotes;

                            $scope.ASCSummaryObj.OrdersReviewedBy = kitem.OrdersReviewedBy;
                            $scope.ASCSummaryObj.OrdersReviewedDate = kitem.OrdersReviewedDate;
                            $scope.ASCSummaryObj.OrdersReviewedtime = kitem.OrdersReviewedtime;
                            $scope.ASCSummaryObj.NurseActionNotes = kitem.NurseActionNotes;

                            $scope.ASCSummaryObj.PatientAscPatientGoal = kitem.PatientAscPatientGoal || [];

                            if ($scope.ASCSummaryObj.PatientAscPatientGoal.length > 0) {
                                $scope.VisitsChecklistsObj.IsShowAscPatientGoalInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowAscPatientGoalInd = false;
                            }

                            //Action pre- op  Call
                          
                            $scope.ASCSummaryObj.Levelofconsciousness = kitem.Levelofconsciousness;
                            $scope.ASCSummaryObj.LevelofconsciousnessNotes = kitem.LevelofconsciousnessNotes;

                            $scope.ASCSummaryObj.PatientPosition = kitem.PatientPosition;
                            $scope.ASCSummaryObj.PatientPositionNotes = kitem.PatientPositionNotes;

                            $scope.ASCSummaryObj.SafetyDevicePosition = kitem.SafetyDevicePosition;
                            $scope.ASCSummaryObj.SafetyDevicePositionNotes = kitem.SafetyDevicePositionNotes;

                            $scope.ASCSummaryObj.SkinPreparation = kitem.SkinPreparation;
                            $scope.ASCSummaryObj.SkinPreparationNotes = kitem.SkinPreparationNotes;

                            $scope.ASCSummaryObj.AreaNotes = kitem.AreaNotes;
                            $scope.ASCSummaryObj.NurseActionArea = kitem.NurseActionArea;
                            $scope.ASCSummaryObj.NurseActionOrganId = kitem.NurseActionOrganId;
                            

                            $scope.ASCSummaryObj.EspecimenLab = kitem.EspecimenLab;
                            $scope.ASCSummaryObj.EspecimenLabNotes = kitem.EspecimenLabNotes;
                            $scope.ASCSummaryObj.CropHour = kitem.CropHour;
                          
                            if ($scope.ASCSummaryObj.Levelofconsciousness == "" && $scope.ASCSummaryObj.PatientPosition == "" && $scope.ASCSummaryObj.SafetyDevicePosition.AnotherRailing == "" && $scope.ASCSummaryObj.SafetyDevicePosition.ArmsToTheBody == "" && $scope.ASCSummaryObj.SafetyDevicePosition.Others == "" && $scope.ASCSummaryObj.SafetyDevicePosition.Strap == "" && $scope.ASCSummaryObj.SkinPreparation == "" && $scope.ASCSummaryObj.AreaNotes == "" && $scope.ASCSummaryObj.EspecimenLab == "") {
                                $scope.VisitsChecklistsObj.IsActionPreOpCallInd = false;
                            } else {
                                $scope.VisitsChecklistsObj.IsActionPreOpCallInd = true;
                            }
                           
                          



                            var OrderArray1 = [];
                            var OrderArray1 = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.ASCSummaryObj.OrdersReviewedBy }, true);
                            if (OrderArray1.length > 0) {
                                $scope.ASCSummaryObj.OrdersReviewedByName = OrderArray1[0].FullName;
                                $scope.VisitsChecklistsObj.IsShowOrdersReviewedByInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowOrdersReviewedByInd = false;
                            }

                            $scope.ASCSummaryObj.SurgeonReviewedBy = kitem.SurgeonReviewedBy;
                            $scope.ASCSummaryObj.SurgeonReviewedDate = kitem.SurgeonReviewedDate;
                            $scope.ASCSummaryObj.SurgeonReviewedtime = kitem.SurgeonReviewedtime;

                            var SurgeonArray1 =[];
                            var SurgeonArray1 = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.ASCSummaryObj.SurgeonReviewedBy }, true);
                            if (SurgeonArray1.length > 0) {
                                $scope.ASCSummaryObj.SurgeonReviewedByName = SurgeonArray1[0].FullName;
                                $scope.VisitsChecklistsObj.IsShowSurgeonReviewedByInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowSurgeonReviewedByInd = false;
                            }                     
                            if ($scope.ASCSummaryObj.SurgeryRoomNo == "" && $scope.ASCSummaryObj.HallEntranceEndTime == "" && $scope.ASCSummaryObj.HallEntranceStartTime == "" &&
                                $scope.ASCSummaryObj.SurgeryEndTime == "" && $scope.ASCSummaryObj.SurgeryStartTime == "" && $scope.ASCSummaryObj.AnesthesiaStartTime == "" && $scope.ASCSummaryObj.AnesthesiaEndTime == "")
                            {
                                $scope.VisitsChecklistsObj.IsShowIntraOpSurgeryTimesInd = false;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpSurgeryTimesInd = true;
                            }


                            if ($scope.ASCSummaryObj.Disposition == "" && $scope.ASCSummaryObj.Recoveryroom == "" && $scope.ASCSummaryObj.CarePostoperative == "" && $scope.ASCSummaryObj.OthersIntraData == "" && $scope.ASCSummaryObj.PatientTolerated == false) {
                                $scope.VisitsChecklistsObj.IsShowIntraOtherFieldsInd = false;
                            }
                            else {
                                $scope.VisitsChecklistsObj.IsShowIntraOtherFieldsInd = true;
                            }


                            if ($scope.ASCSummaryObj.HydrationIV == "" && $scope.ASCSummaryObj.DrainageOthers =="" ) {
                                $scope.VisitsChecklistsObj.IsShowIntraDrainagePresenceInd = false;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraDrainagePresenceInd = true;
                            }

                            if ($scope.ASCSummaryObj.Cleansed == "" && $scope.ASCSummaryObj.Contaminated == "" && $scope.ASCSummaryObj.Dirty == "" ) {
                                $scope.VisitsChecklistsObj.IsShowIntraClassificationCasesInd = false;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraClassificationCasesInd = true;
                            }




                            if ($scope.ASCSummaryObj.Cauteraisation.length > 0) {
                                $scope.VisitsChecklistsObj.IsShowIntraCauteraisationInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraCauteraisationInd = false;
                            }

                            if ($scope.ASCSummaryObj.NurseActionNotes == "") {
                                $scope.VisitsChecklistsObj.IsShowNurseActionNotesInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowNurseActionNotesInd = false;
                            }

                            //console.log($scope.allUserList);
                            //$filter('filter')($scope.allUserList, { 'DoctorID': id}, true);

                           // File Upload Intra-Op

                            $scope.ASCSummaryObj.IntraOPDocumentDetails = kitem.DocumentDetails || [];

                            var temparray = [];
                            var temparray = $filter("filter")($scope.ASCSummaryObj.IntraOPDocumentDetails, { "FileTypeId": 21 }, true);

                          

                            if (temparray.length > 0) {
                                $scope.VisitsChecklistsObj.IntraSurgeonUploadfileInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IntraSurgeonUploadfileInd = false;
                            }


                            var temparray1 = [];
                            var temparray1 = $filter("filter")($scope.ASCSummaryObj.IntraOPDocumentDetails, { "FileTypeId": 20 }, true);

                            if (temparray1.length > 0) {
                                $scope.VisitsChecklistsObj.IntraAnesthesiaUploadfileInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IntraAnesthesiaUploadfileInd = false;
                            }


                            var temparray2 = [];
                            var temparray2 = $filter("filter")($scope.ASCSummaryObj.IntraOPDocumentDetails, { "FileTypeId": 19 }, true);

                            if (temparray2.length > 0) {
                                $scope.VisitsChecklistsObj.IntraNurseUploadfileInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IntraNurseUploadfileInd = false;
                            }

                            let SurgeonArray = $filter('filter')($scope.allUserList, { 'DoctorID': kitem.SurgeonId }, true);
                            if (SurgeonArray.length > 0) {
                                $scope.ASCSummaryObj.Surgeon = SurgeonArray[0].FullName;
                            }

                            let TechnicianArray = $filter('filter')($scope.allUserList, { 'DoctorID': kitem.TechnicianId }, true);
                            if (TechnicianArray.length > 0) {
                                $scope.ASCSummaryObj.Technician = TechnicianArray[0].FullName;
                            }

                            let AnesthesiologistArray = $filter('filter')($scope.allUserList, { 'DoctorID': kitem.AnesthesistId }, true);
                            if (AnesthesiologistArray.length > 0) {
                                $scope.ASCSummaryObj.Anesthesiologist = AnesthesiologistArray[0].FullName;
                            }

                            let ReliefArray = $filter('filter')($scope.allUserList, { 'DoctorID': kitem.ReliefId }, true);
                            if (ReliefArray.length > 0) {
                                $scope.ASCSummaryObj.Relief = ReliefArray[0].FullName;
                            }

                            let CirculatingNurseArray = $filter('filter')($scope.allUserList, { 'DoctorID': kitem.NurseId }, true);
                            if (CirculatingNurseArray.length > 0) {
                                $scope.ASCSummaryObj.CirculatingNurse = CirculatingNurseArray[0].FullName;
                            }

                            let OtherPersonArray = $filter('filter')($scope.allUserList, { 'DoctorID': kitem.SupportingStaffId }, true);
                            if (OtherPersonArray.length > 0) {
                                $scope.ASCSummaryObj.OtherPersonPresent = OtherPersonArray[0].FullName;
                            }

                            if (kitem.SurgeonId == null && kitem.TechnicianId == null && kitem.AnesthesistId == null && kitem.ReliefId == null &&
                                kitem.NurseId == null && kitem.SupportingStaffId == null) {
                                $scope.VisitsChecklistsObj.IsShowIntraOpSurgeryStaffInd = false;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpSurgeryStaffInd = true;
                            }

                            $scope.ASCSummaryObj.SurgicalFirstNeedles = kitem.SurgicalFirstNeedles;
                            $scope.ASCSummaryObj.SurgicalFirstBlades = kitem.SurgicalFirstBlades;
                            $scope.ASCSummaryObj.SurgicalFirstOthers = kitem.SurgicalFirstOthers;
                            $scope.ASCSummaryObj.SurgicalFirstTime = kitem.SurgicalFirstTime;

                            let SurgicalFirstVerifiedByArray = $filter('filter')($scope.allUserList, { 'DoctorID': kitem.SurgicalFirstVerifiedBy }, true);
                            if (SurgicalFirstVerifiedByArray.length > 0) {
                                $scope.ASCSummaryObj.SurgicalFirstVerifiedBy = SurgicalFirstVerifiedByArray[0].FullName;
                            }


                            $scope.ASCSummaryObj.SurgicalSecondNeedles = kitem.SurgicalSecondNeedles;
                            $scope.ASCSummaryObj.SurgicalSecondBlades = kitem.SurgicalSecondBlades;
                            $scope.ASCSummaryObj.SurgicalSecondOthers = kitem.SurgicalSecondOthers;
                            $scope.ASCSummaryObj.SurgicalSecondTime = kitem.SurgicalSecondTime;

                            let SurgicalSecondVerifiedByArray = $filter('filter')($scope.allUserList, { 'DoctorID': kitem.SurgicalSecondVerifiedBy }, true);
                            if (SurgicalSecondVerifiedByArray.length > 0) {
                                $scope.ASCSummaryObj.SurgicalSecondVerifiedBy = SurgicalSecondVerifiedByArray[0].FullName;
                            }

                            $scope.ASCSummaryObj.SurgicalFinalNeedles = kitem.SurgicalFinalNeedles;
                            $scope.ASCSummaryObj.SurgicalFinalBlades = kitem.SurgicalFinalBlades;
                            $scope.ASCSummaryObj.SurgicalFinalOthers = kitem.SurgicalFinalOthers;
                            $scope.ASCSummaryObj.SurgicalFinalTime = kitem.SurgicalFinalTime;

                            let SurgicalFinalVerifiedByArray = $filter('filter')($scope.allUserList, { 'DoctorID': kitem.SurgicalFinalVerifiedBy }, true);
                            if (SurgicalFinalVerifiedByArray.length > 0) {
                                $scope.ASCSummaryObj.SurgicalFinalVerifiedBy = SurgicalFinalVerifiedByArray[0].FullName;
                            }

                            if ($scope.ASCSummaryObj.SurgicalFinalNeedles == null && $scope.ASCSummaryObj.SurgicalFinalBlades == null && $scope.ASCSummaryObj.SurgicalFinalOthers == null && $scope.ASCSummaryObj.SurgicalFinalTime == "12:00AM" &&
                                $scope.ASCSummaryObj.SurgicalSecondNeedles == null && $scope.ASCSummaryObj.SurgicalSecondBlades == null && $scope.ASCSummaryObj.SurgicalSecondOthers == null && $scope.ASCSummaryObj.SurgicalSecondTime == "12:00AM" &&
                                $scope.ASCSummaryObj.SurgicalFirstNeedles == null && $scope.ASCSummaryObj.SurgicalFirstBlades == null && $scope.ASCSummaryObj.SurgicalFirstOthers == null && $scope.ASCSummaryObj.SurgicalFirstTime == "12:00AM") {
                                $scope.VisitsChecklistsObj.IsShowIntraOpSurgeryCountInd = false;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpSurgeryCountInd = true;
                            }

                            if ($scope.VisitsChecklistsObj.IsShowIntraOpSurgeryCountInd || $scope.VisitsChecklistsObj.IsShowIntraOpSurgeryStaffInd || $scope.VisitsChecklistsObj.IsShowIntraOpSurgeryTimesInd || $scope.VisitsChecklistsObj.IsShowIntraOtherFieldsInd || $scope.VisitsChecklistsObj.IsShowIntraClassificationCasesInd || $scope.VisitsChecklistsObj.IsShowIntraDrainagePresenceInd || $scope.VisitsChecklistsObj.IsShowIntraCauteraisationInd || $scope.VisitsChecklistsObj.IsShowNurseActionNotesInd || $scope.VisitsChecklistsObj.IsShowAscPatientGoalInd || $scope.VisitsChecklistsObj.IsActionPreOpCallInd ) {
                                $scope.VisitsChecklistsObj.IsShowIntraOpActionInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpActionInd = false;
                            }

                            $scope.ASCSummaryObj.SurgeonOperativeNotes = kitem.SurgeonOperativeNotes || "";

                            if ($scope.ASCSummaryObj.SurgeonOperativeNotes == "") {
                                $scope.VisitsChecklistsObj.IsShowIntraOpOperativeNotesInd = false;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpOperativeNotesInd = true;
                            }

                            $scope.ASCSummaryObj.SurgeonComplicationNotes = kitem.SurgeonComplicationNotes || "";

                            if ($scope.ASCSummaryObj.SurgeonComplicationNotes == "") {
                                $scope.VisitsChecklistsObj.IsShowIntraOpComplicationNotesInd = false;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpComplicationNotesInd = true;
                            }

                            $scope.ASCSummaryObj.IntraPostOpDiagnosis = angular.copy(kitem.PostOpDiagnosis);
                            if ($scope.ASCSummaryObj.IntraPostOpDiagnosis.length > 0) {
                                $scope.VisitsChecklistsObj.IsShowIntraOpPostOpDiagnosisInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpPostOpDiagnosisInd = false;
                            }
                  
                            // Orders

                            $scope.ASCSummaryObj.IntraOpInvestigationsList = angular.copy(kitem.Investigations);
                            $scope.ASCSummaryObj.IntraOpMedications = angular.copy(kitem.PatientAscMedications);
                            $scope.ASCSummaryObj.IntraOpEyeDrops = angular.copy(kitem.PatientAscEyeDrops);
                            $scope.ASCSummaryObj.IntraOpInjections = angular.copy(kitem.PatientAscInjections);

                            if ($scope.ASCSummaryObj.IntraOpInvestigationsList.length > 0) {
                                $scope.VisitsChecklistsObj.IsShowIntraOpInvestigationsInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpInvestigationsInd = false;
                            }

                            if ($scope.ASCSummaryObj.IntraOpMedications.length > 0) {
                                $scope.VisitsChecklistsObj.IsShowIntraOpMedicationsInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpMedicationsInd = false;
                            }

                            if ($scope.ASCSummaryObj.IntraOpEyeDrops.length > 0) {
                                $scope.VisitsChecklistsObj.IsShowIntraOpEyeDropsInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpEyeDropsInd = false;
                            }

                            if ($scope.ASCSummaryObj.IntraOpInjections.length > 0) {
                                $scope.VisitsChecklistsObj.IsShowIntraOpinjectionsInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpinjectionsInd = false;
                            }

                            if ($scope.VisitsChecklistsObj.IsShowIntraOpMedicationsInd || $scope.VisitsChecklistsObj.IsShowIntraOpInvestigationsInd || $scope.VisitsChecklistsObj.IsShowIntraOpEyeDropsInd || $scope.VisitsChecklistsObj.IsShowIntraOpinjectionsInd   ) {
                                $scope.VisitsChecklistsObj.IsShowIntraOpOrdersInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpOrdersInd = false;
                            }

                            // anesthesia

                            $scope.ASCSummaryObj.Actions = angular.copy(kitem.Actions);
                            if ($scope.ASCSummaryObj.Actions.length > 0) {
                                let ActionsObj = $scope.ASCSummaryObj.Actions[0];
                                let timeslots = _.uniq(ActionsObj.AnesthesiaVitalsArray, false, function (p) { return p.VitalSlotTime; });

                                $scope.ASCSummaryObj.AnesthesiaTableArray = [];

                                angular.forEach(timeslots, function (item) {
                                    let obj = {
                                        "timeslot": "",
                                        "SystolicValue": "",
                                        "DiastolicValue": "",
                                        "PulseValue": "",
                                        "RespRateValue": "",
                                        "SPO2Value": "",
                                        "O2SaturationValue": "",
                                        "EKGLead2Value": "",
                                        "Medications": []
                                    };

                                    obj.timeslot = item.VitalSlotTime;
                                    let tempArray = $filter('filter')(ActionsObj.AnesthesiaVitalsArray, { 'VitalSlotTime': item.VitalSlotTime }, true);
                                    if (tempArray.length > 0) {
                                        let systolicArray = $filter('filter')(tempArray, { 'VitalId': 1 }, true);
                                        if (systolicArray.length > 0) {
                                            obj.SystolicValue = systolicArray[0].Value;
                                        }
                                        let diastolicArray = $filter('filter')(tempArray, { 'VitalId': 2 }, true);
                                        if (diastolicArray.length > 0) {
                                            obj.DiastolicValue = diastolicArray[0].Value;
                                        }
                                        let pulseArray = $filter('filter')(tempArray, { 'VitalId': 3 }, true);
                                        if (pulseArray.length > 0) {
                                            obj.PulseValue = pulseArray[0].Value;
                                        }
                                        let respRateArray = $filter('filter')(tempArray, { 'VitalId': 4 }, true);
                                        if (respRateArray.length > 0) {
                                            obj.RespRateValue = respRateArray[0].Value;
                                        }
                                        let spo2Array = $filter('filter')(tempArray, { 'VitalId': 5 }, true);
                                        if (spo2Array.length > 0) {
                                            obj.SPO2Value = spo2Array[0].Value;
                                        }
                                        let SaturationArray = $filter('filter')(tempArray, { 'VitalId': 6 }, true);
                                        if (SaturationArray.length > 0) {
                                            obj.O2SaturationValue = SaturationArray[0].Value;
                                        }
                                        let EKGArray = $filter('filter')(tempArray, { 'VitalId': 7 }, true);
                                        if (EKGArray.length > 0) {
                                            obj.EKGLead2Value = EKGArray[0].Value;
                                        }
                                    }

                                    angular.forEach(ActionsObj.AnesthesiaMedicines, function (kitem) {
                                        angular.forEach(kitem.MedicationTimeList, function (hitem) {
                                            if (hitem.SlotTime === obj.timeslot) {
                                                let object = {
                                                    "MedicationName": kitem.MedicationName,
                                                    "Value": hitem.Value
                                                };

                                                obj.Medications.push(object);
                                            }
                                        });
                                    });

                                    $scope.ASCSummaryObj.AnesthesiaTableArray.push(obj);
                                });

                                if ($scope.ASCSummaryObj.AnesthesiaTableArray.length > 0) {
                                    $scope.VisitsChecklistsObj.IsShowIntraOpAnesthesiaInd = true;
                                } else {
                                    $scope.VisitsChecklistsObj.IsShowIntraOpAnesthesiaInd = false;
                                }

                                $scope.ASCSummaryObj.GraphAnesthesiaStartTime = ActionsObj.AnesthesiaSlotStartTime;
                                $scope.ASCSummaryObj.GraphAnesthesiaEndTime = ActionsObj.AnesthesiaSlotEndTime;
                                $scope.ASCSummaryObj.GraphAnesthesiaSlotDuration = ActionsObj.Duration;

                            } else {
                                $scope.VisitsChecklistsObj.IsShowIntraOpAnesthesiaInd = false;
                            }

                            $scope.ASCSummaryObj.IntraOpGraphUrl = kitem.S3URL;

                        });
                    }

                    if ($scope.ASCSummaryDetails.PreOpCallDetails.length > 0) {
                        $scope.ASCSummaryObj.PreOpCallDetails = angular.copy($scope.ASCSummaryDetails.PreOpCallDetails);
                        $scope.VisitsChecklistsObj.IsShowPreOpcallInd = true;
                    } else {
                        $scope.VisitsChecklistsObj.IsShowPreOpcallInd = false;
                    }

                    $scope.ASCSummaryDetails.PatientCheckin = $scope.ASCSummaryDetails.PatientCheckin || "";
                    if ($scope.ASCSummaryDetails.PatientCheckin != "") {
                        $scope.ASCSummaryObj.PatientCheckin = angular.copy($scope.ASCSummaryDetails.PatientCheckin);
                    }

                    if ($scope.ASCSummaryDetails.PatientASCPostOP.length > 0) {
                        angular.forEach($scope.ASCSummaryDetails.PatientASCPostOP, function (kitem) {

                            $scope.ASCSummaryObj.PatientASCPostOPId = kitem.PatientASCPostOPId;

                            if (kitem.Vitals.length > 0) {
                                angular.forEach(kitem.Vitals, function (hitem) {
                                    let today = $filter('date')(new Date(), "yyyy-MM-dd");
                                    let datetime = today + " " + hitem.Time;
                                    hitem.Time = $filter('date')(new Date(datetime), "hh:mm a");
                                });
                                $scope.ASCSummaryObj.PostOpVitals = angular.copy(kitem.Vitals);
                                $scope.VisitsChecklistsObj.IsShowPostOpVitalsInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPostOpVitalsInd = false;
                            }
                            $scope.ASCSummaryObj.PostOpROSOverAllRemarks = angular.copy(kitem.ROSOverAllRemarks);
                            $scope.ASCSummaryObj.PostOpDiagnosis = angular.copy(kitem.PostOpDiagnosis);
                            $scope.ASCSummaryObj.DocumentDetails = angular.copy(kitem.DocumentDetails);
                            $scope.ASCSummaryObj.PostOpSystemicHistory = angular.copy(kitem.SystemicHistory);
                            $scope.ASCSummaryObj.PostOpSurgicalHistory = angular.copy(kitem.SurgicalHistory);
                            $scope.ASCSummaryObj.PostOpAllergyHistory = angular.copy(kitem.AllergyItems);
                            $scope.ASCSummaryObj.AldreteDetails = angular.copy(kitem.AldreteDetails);
                            $scope.ASCSummaryObj.AldreteTotalScoreDetails = angular.copy(kitem.AldreteTotalScoreDetails);

                            $scope.IsSurgeonFileUploads = false;
                            $scope.IsDischargeFileUploads = false;
                            $scope.IsAnesthetistFileUploads = false;
                            $scope.IsNurseFileUploads = false;

                            if ($scope.ASCSummaryObj.DocumentDetails.length > 0) {
                                var TempArray1 = $filter('filter')($scope.ASCSummaryObj.DocumentDetails, { 'NoteFileTypeId': 24 }, true);
                                if (TempArray1.length > 0) {
                                    $scope.IsSurgeonFileUploads = true;
                                } else {
                                    $scope.IsSurgeonFileUploads = false;
                                }

                                var TempArray1 = $filter('filter')($scope.ASCSummaryObj.DocumentDetails, { 'NoteFileTypeId': 25 }, true);
                                if (TempArray1.length > 0) {
                                    $scope.IsDischargeFileUploads = true;
                                } else {
                                    $scope.IsDischargeFileUploads = false;
                                }

                                var TempArray1 = $filter('filter')($scope.ASCSummaryObj.DocumentDetails, { 'NoteFileTypeId': 23 }, true);
                                if (TempArray1.length > 0) {
                                    $scope.IsAnesthetistFileUploads = true;
                                } else {
                                    $scope.IsAnesthetistFileUploads = false;
                                }
                                
                                var TempArray1 = $filter('filter')($scope.ASCSummaryObj.DocumentDetails, { 'NoteFileTypeId': 22 }, true);
                                if (TempArray1.length > 0) {
                                    $scope.IsNurseFileUploads = true;
                                } else {
                                    $scope.IsNurseFileUploads = false;
                                }
                            }
                           
                            if ($scope.ASCSummaryObj.PostOpSystemicHistory.length > 0) {
                                $scope.VisitsChecklistsObj.IsShowPostOpSystemicHistoryInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPostOpSystemicHistoryInd = false;
                            }

                            if ($scope.ASCSummaryObj.PostOpSurgicalHistory.length > 0) {
                                $scope.VisitsChecklistsObj.IsShowPostOpSurgicalHistoryInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPostOpSurgicalHistoryInd = false;
                            }

                            if ($scope.ASCSummaryObj.PostOpAllergyHistory.length > 0) {
                                $scope.VisitsChecklistsObj.IsShowPostOpAllergiesInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPostOpAllergiesInd = false;
                            }

                            if ($scope.VisitsChecklistsObj.IsShowPostOpAllergiesInd || $scope.VisitsChecklistsObj.IsShowPostOpSurgicalHistoryInd || $scope.VisitsChecklistsObj.IsShowPostOpSystemicHistoryInd) {
                                $scope.VisitsChecklistsObj.IsShowPostOpROSInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPostOpROSInd = false;
                            }

                            // surgeon
                            $scope.ASCSummaryObj.PostOpDoctorNotes = angular.copy(kitem.DoctorNotes);
                            $scope.ASCSummaryObj.PostOpInstruction = angular.copy(kitem.PostOpInstruction);

                            if ($scope.ASCSummaryObj.PostOpDoctorNotes == "") {
                                $scope.VisitsChecklistsObj.IsShowPostOpDoctorNotesInd = false;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPostOpDoctorNotesInd = true;
                            }

                            if ($scope.ASCSummaryObj.PostOpInstruction == "") {
                                $scope.VisitsChecklistsObj.IsShowPostOpInstructionsInd = false;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPostOpInstructionsInd = true;
                            }

                            if ($scope.VisitsChecklistsObj.IsShowPostOpDoctorNotesInd || $scope.VisitsChecklistsObj.IsShowPostOpInstructionsInd) {
                                $scope.VisitsChecklistsObj.IsShowPostOpSurgeonInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPostOpSurgeonInd = false;
                            }

                            // orders
                            $scope.ASCSummaryObj.PostOpMedications = angular.copy(kitem.SurgeonMedications);
                            $scope.ASCSummaryObj.PostOpInvestigations = angular.copy(kitem.SurgeonInvestigations);

                            if ($scope.ASCSummaryObj.PostOpMedications.length > 0) {
                                $scope.VisitsChecklistsObj.IsShowPostOpMedicationsInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPostOpMedicationsInd = false;
                            }

                            if ($scope.ASCSummaryObj.PostOpInvestigations.length > 0) {
                                $scope.VisitsChecklistsObj.IsShowPostOpInvestigationsInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPostOpInvestigationsInd = false;
                            }

                            if ($scope.VisitsChecklistsObj.IsShowPostOpMedicationsInd || $scope.VisitsChecklistsObj.IsShowPostOpInvestigationsInd) {
                                $scope.VisitsChecklistsObj.IsShowPostOpOrdersInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPostOpOrdersInd = false;
                            }

                            // discharge

                            $scope.ASCSummaryObj.DischargeCriteriaChecklist = angular.copy(kitem.DischargeCriteriaChecklist);
                            $scope.ASCSummaryObj.DischargeCriteriaChecklist = $filter('filter')($scope.ASCSummaryObj.DischargeCriteriaChecklist, { "Value": "Yes" }, true);
                            $scope.ASCSummaryObj.PostOpOperativeNotes = angular.copy(kitem.OperativeNotes);
                            $scope.ASCSummaryObj.CriteriaNotes = angular.copy(kitem.CriteriaNotes);
                            $scope.ASCSummaryObj.TotalAlderetScore = angular.copy(kitem.TotalAlderetScore);

                            $scope.ASCSummaryObj.DischargeTransferChecklist = angular.copy(kitem.DischargeTransferChecklist);
                            $scope.ASCSummaryObj.TransferReason = angular.copy(kitem.TransferReason);
                            $scope.ASCSummaryObj.TransferTime = angular.copy(kitem.TransferTime);

                            $scope.ASCSummaryObj.FollowUpDate1 = angular.copy(kitem.FollowUpDate1);
                            $scope.ASCSummaryObj.FollowUpDate2 = angular.copy(kitem.FollowUpDate2);
                            $scope.ASCSummaryObj.FollowUpDate3 = angular.copy(kitem.FollowUpDate3);

                            $scope.ASCSummaryObj.FollowUpTime1 = angular.copy(kitem.FollowUpTime1);
                            $scope.ASCSummaryObj.FollowUpTime2 = angular.copy(kitem.FollowUpTime2);
                            $scope.ASCSummaryObj.FollowUpTime3 = angular.copy(kitem.FollowUpTime3);

                            if ($scope.ASCSummaryObj.DischargeCriteriaChecklist.length > 0) {
                                $scope.VisitsChecklistsObj.IsShowPostOpDischargeCriteriaInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPostOpDischargeCriteriaInd = false;
                            }

                            if ($scope.ASCSummaryObj.PostOpOperativeNotes == null) {
                                $scope.VisitsChecklistsObj.IsShowPostOpOperativeNotesInd = false;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPostOpOperativeNotesInd = true;
                            }

                            if ($scope.ASCSummaryObj.DischargeTransferChecklist.length === 0 && $scope.ASCSummaryObj.FollowUpDate1 == null && $scope.ASCSummaryObj.FollowUpDate2 == null &&
                                $scope.ASCSummaryObj.FollowUpDate3 == null && $scope.ASCSummaryObj.FollowUpTime1 == null && $scope.ASCSummaryObj.FollowUpTime2 == null && $scope.ASCSummaryObj.FollowUpTime3 == null &&
                                $scope.ASCSummaryObj.TransferReason == null && $scope.ASCSummaryObj.TransferTime == null) {
                                $scope.VisitsChecklistsObj.IsShowPostOpTransferInd = false;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPostOpTransferInd = true;
                            }

                            if ($scope.VisitsChecklistsObj.IsShowPostOpTransferInd || $scope.VisitsChecklistsObj.IsShowPostOpOperativeNotesInd || $scope.VisitsChecklistsObj.IsShowPostOpDischargeCriteriaInd) {
                                $scope.VisitsChecklistsObj.IsShowPostOpDischargeInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPostOpDischargeInd = false;
                            }


                            // Anesthesia graph

                            let timeslots = _.uniq(kitem.AnesthetistVitals, false, function (p) { return p.VitalSlotTime; });

                            $scope.ASCSummaryObj.PostAnesthesiaTableArray = [];

                            angular.forEach(timeslots, function (item) {
                                let obj = {
                                    "timeslot": "",
                                    "SystolicValue": "",
                                    "DiastolicValue": "",
                                    "PulseValue": "",
                                    "RespRateValue": "",
                                    "SPO2Value": "",
                                    "O2SaturationValue": "",
                                    "EKGLead2Value": "",
                                    "Medications": []
                                };

                                obj.timeslot = item.VitalSlotTime;
                                let tempArray = $filter('filter')(kitem.AnesthetistVitals, { 'VitalSlotTime': item.VitalSlotTime }, true);
                                if (tempArray.length > 0) {
                                    let systolicArray = $filter('filter')(tempArray, { 'VitalsId': 1 }, true);
                                    if (systolicArray.length > 0) {
                                        obj.SystolicValue = systolicArray[0].Value;
                                    }
                                    let diastolicArray = $filter('filter')(tempArray, { 'VitalsId': 2 }, true);
                                    if (diastolicArray.length > 0) {
                                        obj.DiastolicValue = diastolicArray[0].Value;
                                    }
                                    let pulseArray = $filter('filter')(tempArray, { 'VitalsId': 3 }, true);
                                    if (pulseArray.length > 0) {
                                        obj.PulseValue = pulseArray[0].Value;
                                    }
                                    let respRateArray = $filter('filter')(tempArray, { 'VitalsId': 4 }, true);
                                    if (respRateArray.length > 0) {
                                        obj.RespRateValue = respRateArray[0].Value;
                                    }
                                    let spo2Array = $filter('filter')(tempArray, { 'VitalsId': 5 }, true);
                                    if (spo2Array.length > 0) {
                                        obj.SPO2Value = spo2Array[0].Value;
                                    }
                                    let SaturationArray = $filter('filter')(tempArray, { 'VitalsId': 6 }, true);
                                    if (SaturationArray.length > 0) {
                                        obj.O2SaturationValue = SaturationArray[0].Value;
                                    }
                                    let EKGArray = $filter('filter')(tempArray, { 'VitalsId': 7 }, true);
                                    if (EKGArray.length > 0) {
                                        obj.EKGLead2Value = EKGArray[0].Value;
                                    }
                                }

                                angular.forEach(kitem.AnesthesiaMedicines, function (kitem) {
                                    angular.forEach(kitem.MedicationTimeList, function (hitem) {
                                        if (hitem.SlotTime === obj.timeslot) {
                                            let object = {
                                                "MedicationName": kitem.MedicationName,
                                                "Value": hitem.Value
                                            };

                                            obj.Medications.push(object);
                                        }
                                    });
                                });

                                $scope.ASCSummaryObj.PostOpAnesthesiaTableArray.push(obj);
                            });

                            if ($scope.ASCSummaryObj.PostOpAnesthesiaTableArray.length > 0) {
                                $scope.VisitsChecklistsObj.IsShowPostOpAnesthesiaInd = true;
                            } else {
                                $scope.VisitsChecklistsObj.IsShowPostOpAnesthesiaInd = false;
                            }

                            $scope.ASCSummaryObj.PostOpGraphAnesthesiaStartTime = kitem.AnesthesiaSlotStartTime;
                            $scope.ASCSummaryObj.PostOpGraphAnesthesiaEndTime = kitem.AnesthesiaSlotEndTime;
                            $scope.ASCSummaryObj.PostOpGraphAnesthesiaSlotDuration = kitem.Duration;

                            $scope.ASCSummaryObj.PostOpGraphUrl = kitem.S3URL;

                            // checklists

                            if (kitem.NurseCheckLists.length > 0) {
                                $scope.ASCSummaryObj.NurseCheckLists = angular.copy(kitem.NurseCheckLists[0]);
                            }
                            if (kitem.NurseActions.length > 0) {
                                $scope.ASCSummaryObj.NurseActions = angular.copy(kitem.NurseActions[0]);
                            }

                        });
                    }

                    $scope.VisitsObj.IsPreAdmissionView = false;
                    $scope.VisitsObj.IsASCView = true;
                }
            }, function (err) {
                console.log(err);
            });
        };

        //$scope.GetAllAppointments = function () {
        //    var AppointmentTypeIds = "4";
        //    var object = {
        //        "PatientID": $scope.cacheStorageItem.PatientID,
        //        "HospitalID": $scope.HospitalId,
        //        "AppointmentTypeIds": AppointmentTypeIds
        //    };
        //    eHnotePatientDataService.GetAppointmentsForCaseHistory(object).then(function (resp) {
        //        if (resp.data.length > 0) {
        //            $scope.CaseHistory = angular.copy(resp.data);
        //            $scope.SelectedAppointment = angular.copy(resp.data[0]);
        //            let todayDate = $filter('date')(new Date(), "yyyy-MM-dd");
        //            if ($scope.SelectedAppointment.AppointmentDate === todayDate && $scope.SelectedAppointment.AppointmentStatus == "D") {
        //                $scope.VisitsObj.IsShowEdit = true;
        //            } else {
        //                $scope.VisitsObj.IsShowEdit = false;
        //            }
        //            $scope.GetASCOverallSummary(resp.data[0]);
        //        }
        //    });
        //};

        $scope.GetPreAdmissionDetails = function (apptObj) {
            $scope.SelectedAppointment = angular.copy(apptObj);
            let patientSurgeryId = null;
            if (apptObj.PreAdmSurgeryList.length > 0) {
                patientSurgeryId = apptObj.PreAdmSurgeryList[0].PatientSurgeryId;
            }
            $scope.GetPreAdmissionSurgeryData(patientSurgeryId);
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
            });

            if (tempCardiacArray.length > 0) {
                $scope.PreAdmObj.SelectedCardiacIssues = tempCardiacArray.join(", ");
            } else {
                $scope.PreAdmObj.SelectedCardiacIssues = "";
            }
            if (tempPulmonaryArray.length > 0) {
                $scope.PreAdmObj.SelectedPulmonaryIssues = tempPulmonaryArray.join(", ");
            } else {
                $scope.PreAdmObj.SelectedPulmonaryIssues = "";
            }
            if (tempHepaticArray.length > 0) {
                $scope.PreAdmObj.SelectedHepaticIssues = tempHepaticArray.join(", ");
            } else {
                $scope.PreAdmObj.SelectedHepaticIssues = "";
            }
            if (tempEndocrineArray.length > 0) {
                $scope.PreAdmObj.SelectedEndocrineIssues = tempEndocrineArray.join(", ");
            } else {
                $scope.PreAdmObj.SelectedEndocrineIssues = "";
            }
            if (tempNeurologicArray.length > 0) {
                $scope.PreAdmObj.SelectedNeurologicIssues = tempNeurologicArray.join(", ");
            } else {
                $scope.PreAdmObj.SelectedNeurologicIssues = "";
            }
            if (tempHemeOneArray.length > 0) {
                $scope.PreAdmObj.SelectedHemeOncIssues = tempHemeOneArray.join(", ");
            } else {
                $scope.PreAdmObj.SelectedHemeOncIssues = "";
            }
            if (tempNervousSystemArray.length > 0) {
                $scope.PreAdmObj.SelectedNervousSystemIssues = tempNervousSystemArray.join(", ");
            } else {
                $scope.PreAdmObj.SelectedNervousSystemIssues = "";
            }
            if (tempKidneyDiseaseArray.length > 0) {
                $scope.PreAdmObj.SelectedKidneyDiseaseIssues = tempKidneyDiseaseArray.join(", ");
            } else {
                $scope.PreAdmObj.SelectedKidneyDiseaseIssues = "";
            }
            if (tempMusculoSkeletalArray.length > 0) {
                $scope.PreAdmObj.SelectedMusculoSkeletalSystemIssues = tempMusculoSkeletalArray.join(", ");
            } else {
                $scope.PreAdmObj.SelectedMusculoSkeletalSystemIssues = "";
            }
            if (tempAutoImmuneArray.length > 0) {
                $scope.PreAdmObj.SelectedAutoImmuneDisordersIssues = tempAutoImmuneArray.join(", ");
            } else {
                $scope.PreAdmObj.SelectedAutoImmuneDisordersIssues = "";
            }
            if (tempPsychosisArray.length > 0) {
                $scope.PreAdmObj.SelectedPsychosisIssues = tempPsychosisArray.join(", ");
            } else {
                $scope.PreAdmObj.SelectedPsychosisIssues = "";
            }
            if (tempOthersArray.length > 0) {
                $scope.PreAdmObj.SelectedOthersIssues = tempOthersArray.join(", ");
            } else {
                $scope.PreAdmObj.SelectedOthersIssues = "";
            }

        }

        $scope.GetPreAdmissionSurgeryData = function (id) {
            id = id || null;

            $scope.ReqObj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.SelectedAppointment.AppointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "PatientSurgeryId": id,
            };
            eHnoteSurgeryService.GetPatientPreAdmissionDetails($scope.ReqObj).then(function (response) {
                console.log(response);
                if (response.data.status === "Success") {

                    $scope.PreAdmObj = angular.copy($scope.GetPreAdmObj());

                    $scope.PreAdmSurgeryList = response.data.SurgeryArray || [];

                    if ($scope.PreAdmSurgeryList.length > 0) {
                        angular.forEach($scope.PreAdmSurgeryList, function (item) {
                            item.IsSelected = false;
                            if (item.PatientSurgeryId == id) {
                                item.IsSelected = true;
                            }
                        });
                        
                    }
                    if (response.data.PreAdmissionDetails.length > 0) {

                        $scope.VisitsObj.IsPreAdmissionData = true;

                        $scope.PreAdmissionDetails = angular.copy(response.data.PreAdmissionDetails[0]);

                        $scope.PreAdmObj.StatusFlag = $scope.PreAdmissionDetails.StatusFlag;
                        $scope.PreAdmObj.PreAdmissionChartStatus = $scope.PreAdmissionDetails.PreAdmissionChartStatus;
                        $scope.PreAdmObj.PreAdmissionId = $scope.PreAdmissionDetails.PreAdmissionId;

                        if ($scope.PreAdmissionDetails !== undefined) {

                            $scope.PreAdmObj.SystemicHistory = angular.copy($scope.PreAdmissionDetails.SystemicHistory);
                            $scope.PreAdmObj.SurgicalHistory = angular.copy($scope.PreAdmissionDetails.SurgicalHistory);
                            $scope.PreAdmObj.AllergyItems = angular.copy($scope.PreAdmissionDetails.AllergyItems);

                            if ($scope.PreAdmObj.SystemicHistory.length > 0) {
                                $scope.PreAdmissionSummaryObj.IsPrAdmROSSystemicInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPrAdmROSSystemicInd = false;
                            }

                            if ($scope.PreAdmObj.SurgicalHistory.length > 0) {
                                $scope.PreAdmissionSummaryObj.IsPrAdmROSSurgicalInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPrAdmROSSurgicalInd = false;
                            }

                            if ($scope.PreAdmObj.AllergyItems.length > 0) {
                                $scope.PreAdmissionSummaryObj.IsPrAdmROSAllergiesInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPrAdmROSAllergiesInd = false;
                            }

                            if ($scope.PreAdmissionDetails.Vitals.length > 0) {
                                angular.forEach($scope.PreAdmissionDetails.Vitals, function (vitem) {
                                    var vitallist = [];
                                    var vitallist = $filter("filter")($scope.PerformedByArray, function (kitem) { return kitem.DoctorID == vitem.PerformedBy });
                                    if (vitallist.length > 0) {
                                        vitem.PerformedByName = angular.copy(vitallist[0].FullName);
                                    }
                                });
                                $scope.PreAdmissionSummaryObj.IsPreadmVitalsInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPreadmVitalsInd = false;
                            }
                            if ($scope.PreAdmissionSummaryObj.IsPrAdmROSAllergiesInd || $scope.PreAdmissionSummaryObj.IsPrAdmROSSurgicalInd || $scope.PreAdmissionSummaryObj.IsPrAdmROSSystemicInd) {
                                $scope.PreAdmissionSummaryObj.IsPreAdmROSMainInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPreAdmROSMainInd = false;
                            }

                            $scope.PreAdmObj.Vitals = angular.copy($scope.PreAdmissionDetails.Vitals);

                            $scope.PreAdmObj.LabObj.HGB = $scope.PreAdmissionDetails.LabTest.HGB;
                            $scope.PreAdmObj.LabObj.HCT = $scope.PreAdmissionDetails.LabTest.HCT;
                            $scope.PreAdmObj.LabObj.WBC = $scope.PreAdmissionDetails.LabTest.WBC;
                            $scope.PreAdmObj.LabObj.RBC = $scope.PreAdmissionDetails.LabTest.RBC;
                            $scope.PreAdmObj.LabObj.A1C = $scope.PreAdmissionDetails.LabTest.A1C;
                            $scope.PreAdmObj.LabObj.Creatinine = $scope.PreAdmissionDetails.LabTest.Creatinine;
                            $scope.PreAdmObj.LabObj.RBS = $scope.PreAdmissionDetails.LabTest.RBS;
                            $scope.PreAdmObj.LabObj.FBS = $scope.PreAdmissionDetails.LabTest.FBS;
                            $scope.PreAdmObj.LabObj.PBBS = $scope.PreAdmissionDetails.LabTest.PBBS;
                            $scope.PreAdmObj.LabObj.PBLS = $scope.PreAdmissionDetails.LabTest.PBLS;
                            $scope.PreAdmObj.LabObj.Notes = $scope.PreAdmissionDetails.LabTest.Notes || "";
                            $scope.PreAdmObj.LabObj.LabTestArray = $scope.PreAdmissionDetails.LabTest.LabTestArray || [];

                            if ($scope.PreAdmObj.LabObj.HGB == "" && $scope.PreAdmObj.LabObj.HCT == "" && $scope.PreAdmObj.LabObj.WBC == "" && $scope.PreAdmObj.LabObj.RBC == "" && $scope.PreAdmObj.LabObj.A1C == "" && $scope.PreAdmObj.LabObj.Creatinine == "" &&
                                $scope.PreAdmObj.LabObj.RBS == "" && $scope.PreAdmObj.LabObj.FBS == "" && $scope.PreAdmObj.LabObj.PBBS == "" && $scope.PreAdmObj.LabObj.PBLS == "" && $scope.PreAdmObj.LabObj.Notes == "") {
                                $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = false;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = true;
                            }

                            $scope.PreAdmissionDetails.CardioVascular = $scope.PreAdmissionDetails.CardioVascular || '';
                            if ($scope.PreAdmissionDetails.CardioVascular != '') {
                                $scope.PreAdmObj.CardioVascularObj.Systolic = $scope.PreAdmissionDetails.CardioVascular.Systolic;
                                $scope.PreAdmObj.CardioVascularObj.Diastolic = $scope.PreAdmissionDetails.CardioVascular.Diastolic;
                                $scope.PreAdmObj.CardioVascularObj.PR = $scope.PreAdmissionDetails.CardioVascular.PR;
                                $scope.PreAdmObj.CardioVascularObj.ECG = $scope.PreAdmissionDetails.CardioVascular.ECG;
                                $scope.PreAdmObj.CardioVascularObj.Notes = $scope.PreAdmissionDetails.CardioVascular.Notes || "";
                            }

                            if ($scope.PreAdmObj.CardioVascularObj.Systolic == "" && $scope.PreAdmObj.CardioVascularObj.Diastolic == "" && $scope.PreAdmObj.CardioVascularObj.PR == "" && $scope.PreAdmObj.CardioVascularObj.ECG == "" &&
                                $scope.PreAdmObj.CardioVascularObj.Notes == "") {
                                $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = false;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = true;
                            }

                            $scope.PreAdmObj.AirwayObj.ROMTMS = $scope.PreAdmissionDetails.Airway.ROMTMS;
                            $scope.PreAdmObj.AirwayObj.ROMNECKLAT = $scope.PreAdmissionDetails.Airway.ROMNECKLAT;
                            $scope.PreAdmObj.AirwayObj.ROMNECKAP = $scope.PreAdmissionDetails.Airway.ROMNECKAP;
                            $scope.PreAdmObj.AirwayObj.Notes = $scope.PreAdmissionDetails.Airway.Notes || "";
                            $scope.PreAdmObj.AirwayObj.IsNormal = $scope.PreAdmissionDetails.Airway.IsNormal;
                            $scope.PreAdmObj.AirwayObj.Class = $scope.PreAdmissionDetails.Airway.Class;

                            if ($scope.PreAdmObj.AirwayObj.ROMTMS == "" && $scope.PreAdmObj.AirwayObj.ROMNECKLAT == "" && $scope.PreAdmObj.AirwayObj.ROMNECKAP == "" && !$scope.PreAdmObj.AirwayObj.IsNormal &&
                                $scope.PreAdmObj.AirwayObj.Notes == "" && $scope.PreAdmObj.AirwayObj.Class == "") {
                                $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationAirwayInd = false;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationAirwayInd = true;
                            }


                            if ($scope.PreAdmissionSummaryObj.IsPrAdmEvaluationAirwayInd || $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd || $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd) {
                                $scope.PreAdmissionSummaryObj.IsPreAdmEvaluationMainInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPreAdmEvaluationMainInd = false;
                            }

                            $scope.PreAdmissionDetails.AnesthesiaPlan = $scope.PreAdmissionDetails.AnesthesiaPlan || "";
                            if ($scope.PreAdmissionDetails.AnesthesiaPlan != "") {
                                $scope.PreAdmObj.APAnesthesiaOptionsObj.IsTopicalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsTopicalAnesthesia;
                                $scope.PreAdmObj.APAnesthesiaOptionsObj.IsGeneralAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsGeneralAnesthesia;
                                $scope.PreAdmObj.APAnesthesiaOptionsObj.IsLocalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsLocalAnesthesia;
                                $scope.PreAdmObj.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsPeriBulbarAnesthesia;
                                $scope.PreAdmObj.APAnesthesiaOptionsObj.IsRegionalAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsRegionalAnesthesia;
                                $scope.PreAdmObj.APAnesthesiaOptionsObj.IsSubtenonAnesthesia = $scope.PreAdmissionDetails.AnesthesiaPlan.IsSubtenonAnesthesia;
                                $scope.PreAdmObj.APAnesthesiaOptionsObj.Dosage = $scope.PreAdmissionDetails.AnesthesiaPlan.Dosage;
                                $scope.PreAdmObj.APAnesthesiaOptionsObj.AnesthetistId = parseInt($scope.PreAdmissionDetails.AnesthesiaPlan.AnesthetistId);
                            }

                            if (!$scope.PreAdmObj.APAnesthesiaOptionsObj.IsTopicalAnesthesia && !$scope.PreAdmObj.APAnesthesiaOptionsObj.IsGeneralAnesthesia && !$scope.PreAdmObj.APAnesthesiaOptionsObj.IsLocalAnesthesia &&
                                !$scope.PreAdmObj.APAnesthesiaOptionsObj.IsPeriBulbarAnesthesia && !$scope.PreAdmObj.APAnesthesiaOptionsObj.IsRegionalAnesthesia && !$scope.PreAdmObj.APAnesthesiaOptionsObj.IsSubtenonAnesthesia &&
                                $scope.PreAdmObj.APAnesthesiaOptionsObj.Dosage == "") {
                                $scope.PreAdmissionSummaryObj.IsPreAdmAnestheticPlanInd = false;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPreAdmAnestheticPlanInd = true;
                            }

                            $scope.PreAdmissionDetails.AssessmentsASA = $scope.PreAdmissionDetails.AssessmentsASA || "";
                            if ($scope.PreAdmissionDetails.AssessmentsASA != "") {
                                $scope.PreAdmObj.ASAObj.Notes = $scope.PreAdmissionDetails.AssessmentsASA.Notes || "";
                                $scope.PreAdmObj.ASAObj.Value = $scope.PreAdmissionDetails.AssessmentsASA.Value;
                            }

                            if ($scope.PreAdmObj.ASAObj.Notes == "" && $scope.PreAdmObj.ASAObj.Value == "") {
                                $scope.PreAdmissionSummaryObj.IsPreAdmAssessmentASAInd = false;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPreAdmAssessmentASAInd = true;
                            }


                            $scope.PreAdmissionDetails.PrevAnesthesia = $scope.PreAdmissionDetails.PrevAnesthesia || "";
                            if ($scope.PreAdmissionDetails.PrevAnesthesia != "") {
                                $scope.PreAdmObj.PrevAnestheticsObj.Notes = $scope.PreAdmissionDetails.PrevAnesthesia.Notes || "";
                                $scope.PreAdmObj.PrevAnestheticsObj.IsComplications = $scope.PreAdmissionDetails.PrevAnesthesia.IsComplications;
                                $scope.PreAdmObj.PrevAnestheticsObj.IsContinue = $scope.PreAdmissionDetails.PrevAnesthesia.IsContinue;
                                $scope.PreAdmObj.PrevAnestheticsObj.IsDifficultAirway = $scope.PreAdmissionDetails.PrevAnesthesia.IsDifficultAirway;
                                $scope.PreAdmObj.PrevAnestheticsObj.IsFamilyHistory = $scope.PreAdmissionDetails.PrevAnesthesia.IsFamilyHistory;
                                $scope.PreAdmObj.PrevAnestheticsObj.IsPONV = $scope.PreAdmissionDetails.PrevAnesthesia.IsPONV;
                                $scope.PreAdmObj.PrevAnestheticsObj.IsPatientDNR = $scope.PreAdmissionDetails.PrevAnesthesia.IsPatientDNR;
                                $scope.PreAdmObj.PrevAnestheticsObj.IsPrevAnesthesia = $scope.PreAdmissionDetails.PrevAnesthesia.IsPrevAnesthesia;
                                $scope.PreAdmObj.PrevAnestheticsObj.IsSuspend = $scope.PreAdmissionDetails.PrevAnesthesia.IsSuspend;
                            }

                            if ($scope.PreAdmObj.PrevAnestheticsObj.Notes == "" && !$scope.PreAdmObj.PrevAnestheticsObj.IsComplications && !$scope.PreAdmObj.PrevAnestheticsObj.IsContinue &&
                                !$scope.PreAdmObj.PrevAnestheticsObj.IsDifficultAirway && !$scope.PreAdmObj.PrevAnestheticsObj.IsFamilyHistory && !$scope.PreAdmObj.PrevAnestheticsObj.IsPONV &&
                                !$scope.PreAdmObj.PrevAnestheticsObj.IsPatientDNR && !$scope.PreAdmObj.PrevAnestheticsObj.IsPrevAnesthesia && !$scope.PreAdmObj.PrevAnestheticsObj.IsSuspend) {
                                $scope.PreAdmissionSummaryObj.IsPreAdmPreviousAnestheticInd = false;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPreAdmPreviousAnestheticInd = true;
                            }


                            if ($scope.PreAdmissionSummaryObj.IsPreAdmPreviousAnestheticInd || $scope.PreAdmissionSummaryObj.IsPreAdmAssessmentASAInd || $scope.PreAdmissionSummaryObj.IsPreAdmAnestheticPlanInd) {
                                $scope.PreAdmissionSummaryObj.IsPreAdmAnesthetistPlanMainInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPreAdmAnesthetistPlanMainInd = false;
                            }

                            $scope.PreAdmObj.IsCardiacWNL = $scope.PreAdmissionDetails.IsCardiacWNL;
                            $scope.PreAdmObj.IsCNSHistory = $scope.PreAdmissionDetails.IsCNSHistory;
                            $scope.PreAdmObj.IsAutoImmuneDisordersWNL = $scope.PreAdmissionDetails.IsAutoImmuneDisordersWNL;
                            $scope.PreAdmObj.IsEndocrineWNL = $scope.PreAdmissionDetails.IsEndocrineWNL;
                            $scope.PreAdmObj.IsHemeOncWNL = $scope.PreAdmissionDetails.IsHemeOncWNL;
                            $scope.PreAdmObj.IsHepaticWNL = $scope.PreAdmissionDetails.IsHepaticWNL;
                            $scope.PreAdmObj.IsKidneyDiseaseWNL = $scope.PreAdmissionDetails.IsKidneyDiseaseWNL;
                            $scope.PreAdmObj.IsMusculoSkeletalSystemWNL = $scope.PreAdmissionDetails.IsMusculoSkeletalSystemWNL;
                            $scope.PreAdmObj.IsNervousSystemWNL = $scope.PreAdmissionDetails.IsNervousSystemWNL;
                            $scope.PreAdmObj.IsNeurologicWNL = $scope.PreAdmissionDetails.IsNeurologicWNL;
                            $scope.PreAdmObj.IsOthersWNL = $scope.PreAdmissionDetails.IsOthersWNL;
                            $scope.PreAdmObj.IsPsychosisWNL = $scope.PreAdmissionDetails.IsPsychosisWNL;
                            $scope.PreAdmObj.IsPulmonaryWNL = $scope.PreAdmissionDetails.IsPulmonaryWNL;
                            $scope.PreAdmObj.IsRespiratoryNormal = $scope.PreAdmissionDetails.IsRespiratoryNormal;

                            $scope.PreAdmObj.SocialNotes = $scope.PreAdmissionDetails.SocialNotes || "";
                            $scope.PreAdmObj.RespiratoryNotes = $scope.PreAdmissionDetails.RespiratoryNotes || "";
                            $scope.PreAdmObj.PulmonaryNotes = $scope.PreAdmissionDetails.PulmonaryNotes || "";
                            $scope.PreAdmObj.PsychosisNotes = $scope.PreAdmissionDetails.PsychosisNotes || "";
                            $scope.PreAdmObj.OthersNotes = $scope.PreAdmissionDetails.OthersNotes || "";
                            $scope.PreAdmObj.NeurologicNotes = $scope.PreAdmissionDetails.NeurologicNotes || "";
                            $scope.PreAdmObj.NervousSystemNotes = $scope.PreAdmissionDetails.NervousSystemNotes || "";
                            $scope.PreAdmObj.MusculoSkeletalSystemNotes = $scope.PreAdmissionDetails.MusculoSkeletalSystemNotes || "";
                            $scope.PreAdmObj.KidneyDiseaseNotes = $scope.PreAdmissionDetails.KidneyDiseaseNotes || "";
                            $scope.PreAdmObj.HepaticNotes = $scope.PreAdmissionDetails.HepaticNotes || "";
                            $scope.PreAdmObj.HemeOncNotes = $scope.PreAdmissionDetails.HemeOncNotes || "";
                            $scope.PreAdmObj.EndocrineNotes = $scope.PreAdmissionDetails.EndocrineNotes || "";
                            $scope.PreAdmObj.CardiacNotes = $scope.PreAdmissionDetails.CardiacNotes || "";
                            $scope.PreAdmObj.CNSNotes = $scope.PreAdmissionDetails.CNSNotes || "";
                            $scope.PreAdmObj.AutoImmuneDisordersNotes = $scope.PreAdmissionDetails.AutoImmuneDisordersNotes || "";

                            $scope.PreAdmObj.CurrentMedicationList = angular.copy($scope.PreAdmissionDetails.CurrentMedicationList);
                            $scope.PreAdmObj.MedicationsList = angular.copy($scope.PreAdmissionDetails.MedicationsList);
                            $scope.PreAdmObj.InvestigationsList = angular.copy($scope.PreAdmissionDetails.InvestigationsList);

                            if ($scope.PreAdmObj.CurrentMedicationList.length > 0) {
                                $scope.PreAdmissionSummaryObj.IsPreAdmCurrentMedicationsInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPreAdmCurrentMedicationsInd = false;
                            }

                            if ($scope.PreAdmObj.MedicationsList.length > 0) {
                                $scope.PreAdmissionSummaryObj.IsPreAdmPreSurgeryMedicationsInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPreAdmPreSurgeryMedicationsInd = false;
                            }

                            if ($scope.PreAdmObj.InvestigationsList.length > 0) {
                                $scope.PreAdmissionSummaryObj.IsPreAdmLabsInvestigationsInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPreAdmLabsInvestigationsInd = false;
                            }

                            if ($scope.PreAdmissionSummaryObj.IsPreAdmLabsInvestigationsInd || $scope.PreAdmissionSummaryObj.IsPreAdmPreSurgeryMedicationsInd || $scope.PreAdmissionSummaryObj.IsPreAdmCurrentMedicationsInd) {
                                $scope.PreAdmissionSummaryObj.IsPreAdmPreSurgeryOrdersMainInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsPreAdmPreSurgeryOrdersMainInd = false;
                            }

                            $scope.ReviwedBy = $scope.PreAdmissionDetails.ReviwedBy;

                            //if ($scope.PreAdmissionDetails.HealthArray.length > 0) {
                            //    $scope.GetHealthAdvancedData($scope.PreAdmissionDetails.HealthArray);
                            //    $scope.PreAdmissionSummaryObj.IsPreAdmChecklistMainInd = true;
                            //    $scope.PreAdmissionSummaryObj.IsPreAdmChecklistHealthPlanInd = true;
                            //} else {
                            //    $scope.PreAdmissionSummaryObj.IsPreAdmChecklistMainInd = false;
                            //    $scope.PreAdmissionSummaryObj.IsPreAdmChecklistHealthPlanInd = false;
                            //}

                            if ($scope.PreAdmObj.APAnesthesiaOptionsObj.AnesthetistId != '') {
                                let Anesthetistlist = $filter("filter")($scope.AnesthetistArray, function (kitem) { return kitem.DoctorID == $scope.PreAdmObj.APAnesthesiaOptionsObj.AnesthetistId });

                                Anesthetistlist = Anesthetistlist || [];
                                if (Anesthetistlist.length > 0) {
                                    $scope.PreAdmObj.APAnesthesiaOptionsObj.AnesthetistName = Anesthetistlist[0].FullName;
                                }
                            }

                            if ($scope.PreAdmissionDetails.PreAdmissionId !== 0 && !$scope.PreAdmObj.IsEdit) {
                                $scope.PreAdmObj.IsShow = false;
                                $scope.PreAdmObj.IsShowPreAdmissionSummaryView = true;
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

                        $scope.PreAdmObj.PreAdmissionStatusId = $scope.PreAdmissionDetails.PreAdmissionStatusId;

                        //$scope.FilesObj.TempImagesArray = [];

                    } else {
                        $scope.VisitsObj.IsPreAdmissionData = false;

                        $scope.PreAdmissionSummaryObj.IsPreadmVitalsInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmROSMainInd = false;
                        $scope.PreAdmissionSummaryObj.IsPrAdmROSSystemicInd = false;
                        $scope.PreAdmissionSummaryObj.IsPrAdmROSSurgicalInd = false;
                        $scope.PreAdmissionSummaryObj.IsPrAdmROSAllergiesInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmEvaluationMainInd = false;
                        $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationLabInd = false;
                        $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationCardioInd = false;
                        $scope.PreAdmissionSummaryObj.IsPrAdmEvaluationAirwayInd = false;
                        //$scope.PreAdmissionSummaryObj.IsPreAdmChecklistMainInd = false;
                        //$scope.PreAdmissionSummaryObj.IsPreAdmChecklistHealthPlanInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmPreSurgeryOrdersMainInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmPreSurgeryMedicationsInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmCurrentMedicationsInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmLabsInvestigationsInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmAnesthetistPlanMainInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmPreviousAnestheticInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmAssessmentASAInd = false;
                        $scope.PreAdmissionSummaryObj.IsPreAdmAnestheticPlanInd = false;
                    }
                    $scope.VisitsObj.IsPreAdmissionView = true;
                    $scope.VisitsObj.IsASCView = false;

                }

            }, function () {

            });
        };
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
        $scope.getMasterFieldDosageDataInAssesment = function () {
            $scope.doseArray = [];
            $scope.doseOtherArray =  [];
            $scope.frequencyArray =  [];
            $scope.refillsArray = [];
            $scope.durationArray =  [];
            $scope.actionArray =  [];
            $scope.routeArray =  [];
            $scope.doseUnitArray =  [];
            $scope.quantityUnitArray =  [];
            $scope.Equipment =  [];
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
                $scope.Equipment = resp.data.Equipment || [];
            }, function (err) {
                alertify.error("Failed");
                console.log(err);
            });
        };
        $scope.getMasterFieldDosageDataInAssesment();


        $scope.init = function () {
            let AppointmentTypeIds = "4,7,14";
            let object = {
                "PatientID": $scope.cacheStorageItem.PatientID,
                "HospitalID": $scope.HospitalId,
                "AppointmentTypeIds": AppointmentTypeIds
            };
            $scope.SelectPatient();
            let appointmentId;
            if ($scope.cacheStorageItem.AppointmentTypeId === 4 || $scope.cacheStorageItem.AppointmentTypeId === 14) {
                appointmentId = $scope.cacheStorageItem.PreAdmAppointmentId;
            }
            if ($scope.cacheStorageItem.AppointmentTypeId === 7) {
                appointmentId = $scope.cacheStorageItem.AppointmentId;
            }
            let ReqObj = {
                "UserId": $scope.UserId,
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": appointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                //"PatientSurgeryId": $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId,
            };

            //var Req = {
            //    "ParentOrganizationId": $scope.ParenthospitalId,
            //};

            $q.all([
                eHnotePatientDataService.GetAppointmentsForCaseHistory(object),
                eHnoteSurgeryService.GetPreAdmissionHealthCategories($scope.ParenthospitalId),
                eHnoteSurgeryService.GetPatientPreAdmissionDetails(ReqObj),
                eHnoteSurgeryService.GetPreAdmissionCardiologistDetails($scope.ReqObj)               
            ]).then(function (resp) {
                if (resp[0].data.length > 0) {
                    $scope.CaseHistory = angular.copy(resp[0].data);
                    $scope.SelectedAppointment = angular.copy(resp[0].data[0]);
                    let todayDate = $filter('date')(new Date(), "yyyy-MM-dd");
                    if ($scope.SelectedAppointment.AppointmentDate === todayDate) {
                        $scope.VisitsObj.IsShowEdit = true;
                    } else {
                        $scope.VisitsObj.IsShowEdit = false;
                    }
                    if ($scope.SelectedAppointment.AppointmentTypeId === 4 || $scope.SelectedAppointment.AppointmentTypeId === 14) {
                        $scope.GetASCOverallSummary(resp[0].data[0]);
                    } else if ($scope.SelectedAppointment.AppointmentTypeId === 7) {
                        $scope.GetPreAdmissionDetails(resp[0].data[0]);
                    }
                }
                if (resp[1].data.status === "Success") {
                    if (resp[1].data.rows.length > 0) {
                        angular.forEach(resp[1].data.rows, function (item) {
                            item.IsChecked = false;
                        });
                        $scope.HealthArray = angular.copy(resp[1].data.rows);
                        $scope.PreAdmAnesthetistObj.HealthArray = angular.copy($scope.HealthArray);

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
                    }
                }
                if (resp[2].data.status === "Success") {

                    $scope.SurgeryList = [];

                    if (resp[2].data.SurgeryArray.length > 0) {

                        angular.forEach(resp[2].data.SurgeryArray, function (item) {
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

                        let temparray1 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[2].data.SurgeryArray[0].ExternalCoManagerId }, true);
                        if (temparray1.length > 0) {
                            $scope.PatientDetailsObj.ExternalCoManager = temparray1[0].FullName;
                        }

                        let temparray2 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[2].data.SurgeryArray[0].InternalCoManagerId }, true);
                        if (temparray2.length > 0) {
                            $scope.PatientDetailsObj.InternalCoManager = temparray2[0].FullName;
                        }

                        $scope.SurgeryDiagnosisObj.OperativeProcedure = resp[2].data.SurgeryArray[0].SurgeryName;
                        // $scope.SurgeryDiagnosisObj.SurgeryDate = item.SurgerySuggestedDate; // not the suggested date but bind appt date 
                        $scope.SurgeryDiagnosisObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
                        $scope.SurgeryDiagnosisObj.OrganizationSurgeryId = resp[2].data.SurgeryArray[0].OrganizationSurgeryId;
                        $scope.SurgeryDiagnosisObj.SurgeryId = resp[2].data.SurgeryArray[0].SurgeryId;
                        resp[2].data.SurgeryArray[0].DiagnosisList = resp[2].data.SurgeryArray[0].DiagnosisList || [];
                        if (resp[2].data.SurgeryArray[0].DiagnosisList.length > 0) {
                            $scope.SurgeryDiagnosisObj.Diagnosis = resp[2].data.SurgeryArray[0].DiagnosisList[0].DiagnosisName;
                            $scope.SurgeryDiagnosisObj.OrganizationDiagnosisId = resp[2].data.SurgeryArray[0].DiagnosisList[0].OrganizationDiagnosisId;
                            $scope.SurgeryDiagnosisObj.DiagnosisId = resp[2].data.SurgeryArray[0].DiagnosisList[0].DiagnosisId;
                        }

                        $scope.SurgeryDiagnosisObj.Diagnosis2 = $scope.SurgeryDiagnosisObj.Diagnosis2 || "";
                        if (resp[2].data.SurgeryArray[0].DiagnosisList.length > 1) {
                            $scope.SurgeryDiagnosisObj.Diagnosis2 = resp[2].data.SurgeryArray[0].DiagnosisList[1].DiagnosisName;
                        }

                        let temparray3 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[2].data.SurgeryArray[0].DoctorID }, true);
                        if (temparray3.length > 0) {
                            $scope.SurgeryDiagnosisObj.Surgeon = temparray3[0].FullName;
                        } else {
                            $scope.SurgeryDiagnosisObj.Surgeon = "";
                        }

                        $scope.PreAdmAnesthetistObj.AscAppointmentId = resp[2].data.SurgeryArray[0].AscAppointmentId || null;
                        $scope.PreAdmAnesthetistObj.AscAppointmentDate = resp[2].data.SurgeryArray[0].AscAppointmentDate || null;
                        $scope.PreAdmAnesthetistObj.FirstFollowupApptId = resp[2].data.SurgeryArray[0].FirstFollowupAppointmentId || null;
                        $scope.PreAdmAnesthetistObj.FirstFollowupDate = resp[2].data.SurgeryArray[0].FirstFollowupDate || null;
                        $scope.PreAdmAnesthetistObj.SecondFollowupApptId = resp[2].data.SurgeryArray[0].SecondFollowupAppointmentId || null;
                        $scope.PreAdmAnesthetistObj.SecondFollowupDate = resp[2].data.SurgeryArray[0].SecondFollowupDate || null;
                        $scope.PreAdmAnesthetistObj.ThirdFollowupApptId = resp[2].data.SurgeryArray[0].ThirdFollowupAppointmentId || null;
                        $scope.PreAdmAnesthetistObj.ThirdFollowupDate = resp[2].data.SurgeryArray[0].ThirdFollowupDate || null;

                    }

                    if (resp[2].data.PreAdmissionDetails.length > 0) {
                        $scope.AnesthesiaPreAdmissionDetails = angular.copy(resp[2].data.PreAdmissionDetails);
                        $scope.AnesthesiaPreAdmissionDetails.ReviewByName = "";
                        var ReviewName = $filter('filter')($scope.allUserList, { 'DoctorID': $scope.AnesthesiaPreAdmissionDetails[0].ReviwedBy }, true)[0] || [];
                        $scope.AnesthesiaPreAdmissionDetails.ReviewByName = ReviewName.FullName || '';
                        $scope.PreAdmissionDetails = angular.copy(resp[2].data.PreAdmissionDetails[0]);

                        $scope.PreAdmAnesthetistObj.StatusFlag = $scope.PreAdmissionDetails.StatusFlag;
                        $scope.PreAdmAnesthetistObj.PreAdmissionChartStatus = $scope.PreAdmissionDetails.PreAdmissionChartStatus;

                        if ($scope.PreAdmissionDetails !== undefined) {

                            $scope.PreAdmAnesthetistObj.PreAdmissionId = $scope.PreAdmissionDetails.PreAdmissionId;
                            $scope.PreAdmAnesthetistObj.PreAdmissionApptId = $scope.PreAdmissionDetails.AppointmentId;
                            $scope.PreAdmAnesthetistObj.PreAdmissionApptDate = $filter('date')($scope.PreAdmissionDetails.AppointmentDate, "MM-dd-yyyy");

                            // this object is no longer being sent. we get the data in surgery array
                            //$scope.PreAdmAnesthetistObj.AscAppointmentId = $scope.PreAdmissionDetails.PatientAppointmentsDetails.AscAppointmentId || null;
                            //$scope.PreAdmAnesthetistObj.AscAppointmentDate = $scope.PreAdmissionDetails.PatientAppointmentsDetails.AscAppointmentDate || null;
                            //$scope.PreAdmAnesthetistObj.FirstFollowupApptId = $scope.PreAdmissionDetails.PatientAppointmentsDetails.FirstFollowupAppointmentId || null;
                            //$scope.PreAdmAnesthetistObj.FirstFollowupDate = $scope.PreAdmissionDetails.PatientAppointmentsDetails.FirstFollowupDate || null;
                            //$scope.PreAdmAnesthetistObj.SecondFollowupApptId = $scope.PreAdmissionDetails.PatientAppointmentsDetails.SecondFollowupAppointmentId || null;
                            //$scope.PreAdmAnesthetistObj.SecondFollowupDate = $scope.PreAdmissionDetails.PatientAppointmentsDetails.SecondFollowupDate || null;
                            //$scope.PreAdmAnesthetistObj.ThirdFollowupApptId = $scope.PreAdmissionDetails.PatientAppointmentsDetails.ThirdFollowupAppointmentId || null;
                            //$scope.PreAdmAnesthetistObj.ThirdFollowupDate = $scope.PreAdmissionDetails.PatientAppointmentsDetails.ThirdFollowupDate || null;


                            $scope.PreAdmAnesthetistObj.SystemicHistory = angular.copy($scope.PreAdmissionDetails.SystemicHistory);
                            $scope.PreAdmAnesthetistObj.SurgicalHistory = angular.copy($scope.PreAdmissionDetails.SurgicalHistory);
                            $scope.PreAdmAnesthetistObj.AllergyItems = angular.copy($scope.PreAdmissionDetails.AllergyItems);
                           
                            $scope.PreAdmAnesthetistObj.DocumentDetails = angular.copy($scope.PreAdmissionDetails.DocumentDetails) || [];
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

                            $scope.PreAdmAnesthetistObj.ROSOverAllRemarks = angular.copy($scope.PreAdmissionDetails.ROSOverAllRemarks);

                            if ($scope.PreAdmAnesthetistObj.ROSOverAllRemarks != "" || $scope.PreAdmAnesthetistObj.ROSOverAllRemarks != null) {
                                $scope.PreAdmissionSummaryObj.IsROSOverAllRemarksInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj.IsROSOverAllRemarksInd = false;
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
                            if ($scope.PreAdmissionDetails.LabTest.TestArray.length > 0) {
                                $scope.PreAdmAnesthetistObj.LabObj.LabTestArray = $scope.PreAdmissionDetails.LabTest.TestArray;
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
                                    item.IsChecked = true;
                                } else {
                                    item.IsChecked = false;
                                }
                            });

                            $scope.PreAdmAnesthetistObj.IsCardiacWNL = $scope.PreAdmissionDetails.IsCardiacWNL;
                            $scope.PreAdmAnesthetistObj.IsCNSHistory = $scope.PreAdmissionDetails.IsCNSHistory;
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

                        $scope.PreAdmAnesthetistObj.PreAdmissionStatusId = $scope.PreAdmissionDetails.PreAdmissionStatusId;

                        $scope.FilesObj.TempImagesArray = [];



                        if ($scope.PreAdmAnesthetistObj.DocumentDetails.length > 0) {
                            $scope.PreAdmissionSummaryObj.IsFileUploadInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj.IsFileUploadInd = false;
                        }
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

                        if ($scope.PreAdmAnesthetistObj.CardioVascularObj.Systolic == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.Diastolic == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.PR == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.ECG == "" && $scope.PreAdmAnesthetistObj.CardioVascularObj.ECGUnits== "" &&
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

                        //let SelectedSurgeryList = $filter('filter')(resp[3].data.SurgeryArray, { 'PatientSurgeryId': $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId }, true);

                        let SelectedSurgeryList = angular.copy(resp[2].data.SurgeryArray);

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
                        $scope.PreAdmAnesthetistObj.HealthArray = angular.copy(resp[0].data.rows);
                        $scope.PreAdmAnesthetistObj.APAnesthesiaOptionsObj = angular.copy($scope.GetAPAnesthesiaOptionsObj());

                        $scope.PreAdmAnesthetistObj.AscAppointmentId = resp[2].data.SurgeryArray[0].AscAppointmentId || null;
                        $scope.PreAdmAnesthetistObj.AscAppointmentDate = resp[2].data.SurgeryArray[0].AscAppointmentDate || null;
                        $scope.PreAdmAnesthetistObj.FirstFollowupApptId = resp[2].data.SurgeryArray[0].FirstFollowupAppointmentId || null;
                        $scope.PreAdmAnesthetistObj.FirstFollowupDate = resp[2].data.SurgeryArray[0].FirstFollowupDate || null;
                        $scope.PreAdmAnesthetistObj.SecondFollowupApptId = resp[2].data.SurgeryArray[0].SecondFollowupAppointmentId || null;
                        $scope.PreAdmAnesthetistObj.SecondFollowupDate = resp[2].data.SurgeryArray[0].SecondFollowupDate || null;
                        $scope.PreAdmAnesthetistObj.ThirdFollowupApptId = resp[2].data.SurgeryArray[0].ThirdFollowupAppointmentId || null;
                        $scope.PreAdmAnesthetistObj.ThirdFollowupDate = resp[2].data.SurgeryArray[0].ThirdFollowupDate || null;

                        resp[2].data.SurgeryArray = resp[2].data.SurgeryArray || [];
                        if (resp[2].data.SurgeryArray.length > 0) {
                            let temparray3 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[2].data.SurgeryArray[0].DoctorID }, true);
                            if (temparray3.length > 0) {
                                $scope.SurgeryDiagnosisObj.Surgeon = temparray3[0].FullName;
                                // $scope.SurgeryDiagnosisObj.SurgeryDate = item.SurgerySuggestedDate; // not the suggested date but bind appt date 
                                $scope.SurgeryDiagnosisObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
                                resp[2].data.SurgeryArray[0].DiagnosisList = resp[2].data.SurgeryArray[0].DiagnosisList || [];
                                $scope.SurgeryDiagnosisObj.Diagnosis = resp[2].data.SurgeryArray[0].DiagnosisList.length > 0 ? resp[2].data.SurgeryArray[0].DiagnosisList[0].DiagnosisName : '';
                                $scope.SurgeryDiagnosisObj.Diagnosis2 = resp[2].data.SurgeryArray[0].DiagnosisList.length > 1 ? resp[2].data.SurgeryArray[0].DiagnosisList[1].DiagnosisName : '';
                                $scope.SurgeryDiagnosisObj.OperativeProcedure = resp[2].data.SurgeryArray[0].SurgeryName;
                            } else {
                                $scope.SurgeryDiagnosisObj.Surgeon = "";
                            }
                        }

                        $scope.PreAdmSurgeryList = $scope.PreAdmSurgeryList || [];
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

                        //let SelectedSurgeryList = $filter('filter')(resp[3].data.SurgeryArray, { 'PatientSurgeryId': $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId }, true);

                        let SelectedSurgeryList = angular.copy(resp[2].data.SurgeryArray);
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
                if (resp[3].data.status === "Success") {

                    $scope.SurgeryList = [];
                    $scope.PreAdmCardioObj = angular.copy($scope.GetPreAdmCardioObj());
                    $scope.PreAdmCardioObj.HealthArray = angular.copy($scope.HealthArray);
                    if (resp[3].data.SurgeryArray.length > 0) {

                        angular.forEach(resp[3].data.SurgeryArray, function (item) {
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

                        let temparray1 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[3].data.SurgeryArray[0].ExternalCoManagerId }, true);
                        if (temparray1.length > 0) {
                            $scope.PatientDetailsObj.ExternalCoManager = temparray1[0].FullName;
                        }

                        let temparray2 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[3].data.SurgeryArray[0].InternalCoManagerId }, true);
                        if (temparray2.length > 0) {
                            $scope.PatientDetailsObj.InternalCoManager = temparray2[0].FullName;
                        }

                        $scope.SurgeryDiagnosisObj.OperativeProcedure = resp[3].data.SurgeryArray[0].SurgeryName;
                        // $scope.SurgeryDiagnosisObj.SurgeryDate = item.SurgerySuggestedDate; // not the suggested date but bind appt date 
                        $scope.SurgeryDiagnosisObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
                        $scope.SurgeryDiagnosisObj.OrganizationSurgeryId = resp[3].data.SurgeryArray[0].OrganizationSurgeryId;
                        $scope.SurgeryDiagnosisObj.SurgeryId = resp[3].data.SurgeryArray[0].SurgeryId;
                        resp[3].data.SurgeryArray[0].DiagnosisList = resp[3].data.SurgeryArray[0].DiagnosisList || [];
                        if (resp[3].data.SurgeryArray[0].DiagnosisList.length > 0) {
                            $scope.SurgeryDiagnosisObj.Diagnosis = resp[3].data.SurgeryArray[0].DiagnosisList[0].DiagnosisName;
                            $scope.SurgeryDiagnosisObj.OrganizationDiagnosisId = resp[3].data.SurgeryArray[0].DiagnosisList[0].OrganizationDiagnosisId;
                            $scope.SurgeryDiagnosisObj.DiagnosisId = resp[3].data.SurgeryArray[0].DiagnosisList[0].DiagnosisId;
                        }

                        $scope.SurgeryDiagnosisObj.Diagnosis2 = $scope.SurgeryDiagnosisObj.Diagnosis2 || "";
                        if (resp[3].data.SurgeryArray[0].DiagnosisList.length > 1) {
                            $scope.SurgeryDiagnosisObj.Diagnosis2 = resp[3].data.SurgeryArray[0].DiagnosisList[1].DiagnosisName;
                        }

                        let temparray3 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[3].data.SurgeryArray[0].DoctorID }, true);
                        if (temparray3.length > 0) {
                            $scope.SurgeryDiagnosisObj.Surgeon = temparray3[0].FullName;
                        } else {
                            $scope.SurgeryDiagnosisObj.Surgeon = "";
                        }
                    }

                    if (resp[3].data.CardiologistDetails.length > 0) {
                        $scope.CardiologistPreAdmissionDetails = angular.copy(resp[3].data.CardiologistDetails);
                        $scope.PreAdmissionDetails = angular.copy(resp[3].data.CardiologistDetails[0]);

                        $scope.PreAdmCardioObj.StatusFlag = $scope.PreAdmissionDetails.StatusFlag;
                        $scope.PreAdmCardioObj.PreAdmissionChartStatus = $scope.PreAdmissionDetails.PreAdmissionChartStatus;

                        if ($scope.PreAdmissionDetails !== undefined) {

                            $scope.PreAdmCardioObj.PreAdmissionId = $scope.PreAdmissionDetails.PreAdmissionId;
                            $scope.PreAdmCardioObj.PreAdmissionApptId = $scope.PreAdmissionDetails.AppointmentId;
                            $scope.PreAdmCardioObj.PreAdmissionApptDate = $filter('date')($scope.PreAdmissionDetails.AppointmentDate, "MM-dd-yyyy");

                            $scope.PreAdmCardioObj.SystemicHistory = angular.copy($scope.PreAdmissionDetails.SystemicHistory);
                            $scope.PreAdmCardioObj.SurgicalHistory = angular.copy($scope.PreAdmissionDetails.SurgicalHistory);
                            $scope.PreAdmCardioObj.AllergyItems = angular.copy($scope.PreAdmissionDetails.AllergyItems);

                            $scope.PreAdmCardioObj.DocumentDetails = angular.copy($scope.PreAdmissionDetails.DocumentDetails) || [];
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


                            $scope.PreAdmCardioObj.LabObj = $scope.GetLabObj();
                            $scope.PreAdmCardioObj.LabObj.HGB = $scope.PreAdmissionDetails.LabTest.HGB;
                            $scope.PreAdmCardioObj.LabObj.HCT = $scope.PreAdmissionDetails.LabTest.HCT;
                            $scope.PreAdmCardioObj.LabObj.WBC = $scope.PreAdmissionDetails.LabTest.WBC;
                            $scope.PreAdmCardioObj.LabObj.RBC = $scope.PreAdmissionDetails.LabTest.RBC;
                            $scope.PreAdmCardioObj.LabObj.A1C = $scope.PreAdmissionDetails.LabTest.A1C;
                            $scope.PreAdmCardioObj.LabObj.Creatinine = $scope.PreAdmissionDetails.LabTest.Creatinine;
                            $scope.PreAdmCardioObj.LabObj.RBS = $scope.PreAdmissionDetails.LabTest.RBS;
                            $scope.PreAdmCardioObj.LabObj.FBS = $scope.PreAdmissionDetails.LabTest.FBS;
                            $scope.PreAdmCardioObj.LabObj.PBBS = $scope.PreAdmissionDetails.LabTest.PBBS;
                            $scope.PreAdmCardioObj.LabObj.PBLS = $scope.PreAdmissionDetails.LabTest.PBLS;
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
                            }

                            $scope.PreAdmCardioObj.HealthArray = angular.copy($scope.HealthArray);
                            angular.forEach($scope.PreAdmCardioObj.HealthArray, function (item) {
                                let temparray = $filter('filter')($scope.PreAdmissionDetails.HealthArray, { "id": item.Id }, true);
                                if (temparray.length > 0) {
                                    item.IsChecked = true;
                                } else {
                                    item.IsChecked = false;
                                }
                            });

                            $scope.PreAdmCardioObj.RespiratoryHealthArray = [];
                            $scope.PreAdmCardioObj.SocialHealthArray = [];

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

                            if ($scope.PreAdmissionDetails.HealthArray.length > 0) {
                                $scope.GetHealthAdvancedData1($scope.PreAdmissionDetails.HealthArray);

                                $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistMainInd = true;
                                $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistHealthPlanInd = true;
                            }
                            else if (!$scope.PreAdmissionDetails.IsCardiacWNL && !$scope.PreAdmissionDetails.IsCNSHistory && !$scope.PreAdmissionDetails.IsAutoImmuneDisordersWNL && !$scope.PreAdmissionDetails.IsEndocrineWNL && !$scope.PreAdmissionDetails.IsHemeOncWNL && !$scope.PreAdmissionDetails.IsHepaticWNL && !$scope.PreAdmissionDetails.IsPulmonaryWNL
                                && !$scope.PreAdmissionDetails.IsKidneyDiseaseWNL && !$scope.PreAdmissionDetails.IsMusculoSkeletalSystemWNL && !$scope.PreAdmissionDetails.IsNervousSystemWNL && !$scope.PreAdmissionDetails.IsNeurologicWNL && !$scope.PreAdmissionDetails.IsOthersWNL && !$scope.PreAdmissionDetails.IsPsychosisWNL && !$scope.PreAdmissionDetails.IsRespiratoryNormal && !$scope.PreAdmissionDetails.IsHeentWNL && !$scope.PreAdmissionDetails.IsLungsWNL ) {

                                $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistMainInd = false;
                                $scope.PreAdmissionSummaryObj1.IsPreAdmChecklistHealthPlanInd = false;
                            }

                            if ($scope.PreAdmCardioObj.IsCNSHistory == true) {
                                $scope.PreAdmissionSummaryObj1.IsCNSHistoryInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj1.IsCNSHistoryInd = false;
                            }

                            $scope.PreAdmCardioObj.ROSOverAllRemarks = angular.copy($scope.PreAdmissionDetails.ROSOverAllRemarks);

                            if ($scope.PreAdmCardioObj.ROSOverAllRemarks != "" || $scope.PreAdmCardioObj.ROSOverAllRemarks != null) {
                                $scope.PreAdmissionSummaryObj1.IsROSOverAllRemarksInd = true;
                            } else {
                                $scope.PreAdmissionSummaryObj1.IsROSOverAllRemarksInd = false;
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

                        $scope.FilesObj.TempImagesArray = [];


                        if ($scope.PreAdmCardioObj.DocumentDetails.length > 0) {
                            $scope.PreAdmissionSummaryObj1.IsFileUploadInd = true;
                        } else {
                            $scope.PreAdmissionSummaryObj1.IsFileUploadInd = false;
                        }
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

                        //let SelectedSurgeryList = $filter('filter')(resp[4].data.SurgeryArray, { 'PatientSurgeryId': $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId }, true);

                        let SelectedSurgeryList = angular.copy(resp[3].data.SurgeryArray);

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

                        resp[3].data.SurgeryArray = resp[3].data.SurgeryArray || [];
                        if (resp[3].data.SurgeryArray.length > 0) {
                            let temparray3 = $filter('filter')($scope.allUserList, { 'DoctorID': resp[3].data.SurgeryArray[0].DoctorID }, true);
                            if (temparray3.length > 0) {
                                $scope.SurgeryDiagnosisObj.Surgeon = temparray3[0].FullName;
                                // $scope.SurgeryDiagnosisObj.SurgeryDate = item.SurgerySuggestedDate; // not the suggested date but bind appt date 
                                $scope.SurgeryDiagnosisObj.SurgeryDate = $scope.cacheStorageItem.AppointmentDate;
                                resp[3].data.SurgeryArray[0].DiagnosisList = resp[3].data.SurgeryArray[0].DiagnosisList || [];
                                $scope.SurgeryDiagnosisObj.Diagnosis = resp[3].data.SurgeryArray[0].DiagnosisList.length > 0 ? resp[3].data.SurgeryArray[0].DiagnosisList[0].DiagnosisName : '';
                                $scope.SurgeryDiagnosisObj.Diagnosis2 = resp[3].data.SurgeryArray[0].DiagnosisList.length > 1 ? resp[3].data.SurgeryArray[0].DiagnosisList[1].DiagnosisName : '';
                                $scope.SurgeryDiagnosisObj.OperativeProcedure = resp[3].data.SurgeryArray[0].SurgeryName;
                            } else {
                                $scope.SurgeryDiagnosisObj.Surgeon = "";
                            }
                        }
                        $scope.PreAdmSurgeryList = $scope.PreAdmSurgeryList || [];
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

                        //let SelectedSurgeryList = $filter('filter')(resp[4].data.SurgeryArray, { 'PatientSurgeryId': $scope.SurgeryDiagnosisObj.SelectedSurgery.PatientSurgeryId }, true);

                        let SelectedSurgeryList = angular.copy(resp[3].data.SurgeryArray);
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
            });
         
        };

        $scope.init();


        $scope.clicksApptListuibpopup = function () {
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/appointmentlistpop.html",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                //"size": "md",
                "windowClass": "appointmentlistuib",
                "controller": function ($scope, $uibModal, $uibModalInstance, eHnotePatientPVService) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };

                    $scope.ChangesConsultation = function (obj) {
                        $scope.SelectedAppointment = angular.copy(obj);
                        let todayDate = $filter('date')(new Date(), "yyyy-MM-dd");
                        if ($scope.SelectedAppointment.AppointmentDate === todayDate) {
                            $scope.VisitsObj.IsShowEdit = true;
                        } else {
                            $scope.VisitsObj.IsShowEdit = false;
                        }
                        $scope.SelectedAppointmentId = obj.AppointmentId;
                        if ($scope.SelectedAppointment.AppointmentTypeId === 4 || $scope.SelectedAppointment.AppointmentTypeId === 14) {
                            $scope.GetASCOverallSummary(obj);
                        } else if ($scope.SelectedAppointment.AppointmentTypeId === 7) {
                            $scope.GetPreAdmissionDetails(obj);
                        }
                    };
                }
            });
        }
        $scope.ChangesConsultation = function (obj) {
            $scope.SelectedAppointment = angular.copy(obj);
            let todayDate = $filter('date')(new Date(), "yyyy-MM-dd");
            if ($scope.SelectedAppointment.AppointmentDate === todayDate) {
                $scope.VisitsObj.IsShowEdit = true;
            } else {
                $scope.VisitsObj.IsShowEdit = false;
            }
            $scope.SelectedAppointmentId = obj.AppointmentId;
            if ($scope.SelectedAppointment.AppointmentTypeId === 4 || $scope.SelectedAppointment.AppointmentTypeId === 14) {
                $scope.GetASCOverallSummary(obj);
            } else if ($scope.SelectedAppointment.AppointmentTypeId === 7) {
                $scope.GetPreAdmissionDetails(obj);
            }
        };

        $scope.EditApptFromVisit = function () {
            $scope.ChangeTabType(2);
        };

        $scope.OpenPreOpChecklistPopUp = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/Pre-opchecklistpopup.html",
               // "size": "lg",
                "backdrop": "static",
                "scope": $scope,
                "keyboard": false,
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };
        $scope.OpenIntraOpChecklistPopUp = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/Intra-opchecklistpopup.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                /*"windowClass": "inventory-full-popup",*/
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };
        $scope.OpenPostOpChecklistPopUp = function () {
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/Post-opchecklistpopup.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
                /*"windowClass": "inventory-full-popup",*/
                "controller": function ($scope, $uibModal, $uibModalInstance) {
                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }
            });
        };

        $scope.UnSignASCSummary = function () {
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
                            "AppointmentId": $scope.SelectedAppointment.AppointmentId,
                            "PatientId": $scope.cacheStorageItem.PatientID,
                            "UserId": $scope.UserId,
                            "PatientASCPreOPId": $scope.ASCSummaryObj.PatientASCPreOPId || null,
                            "PatientASCIntraOPId": $scope.ASCSummaryObj.PatientASCIntraOPId || null,
                            "PatientASCPostOPId": $scope.ASCSummaryObj.PatientASCPostOPId || null,
                            "StatusFlag": "E",
                            "Remarks": $scope.Obj.Remarks,
                            "Type": "ASCSummary" // "IntraOp", "PostOp"
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
                $scope.$emit("UnsignFromSummary", "");
            }, function (cancel) {

            });
        };

        $scope.NavtoEditPreAdmissionData = function () {
            $scope.$emit("NavToEditPreAdmissionFromSummary", "");
        };

        $scope.NavToEditASC = function () {
            $scope.$emit("NavToEditASCFromSummary", "");
        };

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
                            "AppointmentId": $scope.SelectedAppointment.AppointmentId,
                            "PatientId": $scope.cacheStorageItem.PatientID,
                            "UserId": $scope.UserId,
                            "PreAdmissionId": $scope.PreAdmObj.PreAdmissionId,
                            "PatientASCPreOPId": null,
                            "PatientASCIntraOPId":null,
                            "PatientASCPostOPId": null,
                            "StatusFlag": "E",
                            "Remarks": $scope.Obj.Remarks,
                            "Type": "ASCSummary" // "IntraOp", "PostOp"
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
                $scope.$emit("UnsignPreAdmissionFromSummary", "");
            }, function (cancel) {

            });
        };
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
    }]);
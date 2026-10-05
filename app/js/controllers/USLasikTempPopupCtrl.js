
"use strict";
eHnoteWebApp.controller("USLasikTempPopupCtrl", ["$scope", "$rootScope", "$location", "$filter", "alertify", "$uibModal", "$q", "$timeout", "$uibModalInstance", "eHnoteMasterDataService", "eHnoteLoginStatusService", "eHnoteCacheStorageService", "eHnoteSurgeryService", "datapersistanceFactory", "eHnoteDiagnosisDataServices", "localStorageFactory", "eHnoteConditionsDataService", "eHnoteUserDataService", "allUserList","SurgeryCategoryId","USPrintService", "eHnoteSettingsDataService", "DropTimingGivenByService",
    function ($scope, $rootScope, $location, $filter, alertify, $uibModal, $q, $timeout, $uibModalInstance, eHnoteMasterDataService, eHnoteLoginStatusService, eHnoteCacheStorageService, eHnoteSurgeryService, datapersistanceFactory, eHnoteDiagnosisDataServices, localStorageFactory, eHnoteConditionsDataService, eHnoteUserDataService, allUserList, SurgeryCategoryId, USPrintService, eHnoteSettingsDataService, DropTimingGivenByService) {
        // Task 13 - Given By passcode handlers for medication timing rows (templates/uibpopups/DropTimingGivenBy.html).
        DropTimingGivenByService.attach($scope);
        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.ParentHospitalId = 0;
        $scope.HospitalId = 0;
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        $scope.ParentHospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
        $scope.RoleId = userLoginDetails.RoleID;
        $scope.MainselectedApptObj = $scope.cacheStorageItem.selectedApptObj;
        $scope.uibclose = function () {
            $uibModalInstance.dismiss("cancel");
        };
        $scope.ParentObj = {
            'IsIOJParentOrganization': false
        };
        $scope.TabObj = {
            "SelectedTab": 1,
            "PreopSUBTAB": 1,
            "IntraopSUBTAB": 2,
            "PostopSUBTAB": 1
        };
        var currenturl = $location.absUrl().split('?')[0];

        var CurrentEnvironment = currenturl.split('/#')[0];

        if (CurrentEnvironment == "https://ioj.ehnote.com" || CurrentEnvironment == "https://insts.ehnote.com") {
            $scope.ParentObj.IsIOJParentOrganization = true;
        } else {
            $scope.ParentObj.IsIOJParentOrganization = false;
        }

        $scope.GetuibaccoridianIndObj = function () {
            return {
                "IsHealthPhysicalInd": false,
                "IsPhysicalEvalutionInd": false,
            }
        }
        $scope.uibaccordianIndObj = $scope.GetuibaccoridianIndObj();
        $scope.MainObj = {
            "PatientId": $scope.cacheStorageItem.PatientID,
            "AppointmentId": $scope.cacheStorageItem.AppointmentId,
            "UserId": $scope.UserId,
            "HospitalId": $scope.HospitalId,
            "SurgeryDiagnosisObj": {
                "Diagnosis": "",
                "DiagnosisId": null,
                "OrganizationDiagnosisId": null,
                "OrganizationSurgeryId": null,
                "SurgeryId": null,
                "SurgeryDate": "",
                "OperativeProcedure": "",
                "Surgeon": "",
            },
            "PatientDetails": {
                "PatientId": 0,
                "FullName": "",
                "DOB": "",
                "Mobile": "",
                "DisplayId": "",
                "Gender": "",
                "Age": "",
                "S3URL": "",
                "ExternalCoManager": "",
                "InternalCoManager": "",
                "PCP": "",
                "AddressLine1": "",
                "AddressLine2": "",
                "InsuranceDetails": [],
                "Allergies": []
            },
            "HealthArray": [],
            "PostalAddress": {
                "AddressId": 0,
                "AddressLine1": "",
                "AddressLine2": "",
                "ZipCode": "",
                "CountyName": "",
                "CountyId": 0,
                "CityName": "",
                "CityId": 0,
                "StateName": "",
                "StateId": 0,
                "CountryName": "",
                "CountryId": 0,
                "CountyCodeObj": "",
                "ZipCodeArray": []
            },
            "PermanentAddress": {
                "AddressId": 0,
                "AddressLine1": "",
                "AddressLine2": "",
                "ZipCode": "",
                "CountyName": "",
                "CountyId": 0,
                "CityName": "",
                "CityId": 0,
                "StateName": "",
                "StateId": 0,
                "CountryName": "",
                "CountryId": 0,
                "CountyCodeObj": "",
                "ZipCodeArray": []
            },
            "IsSummaryNav": false,
            "IsPreAdmSummaryNav": false,
            "VitalsArray": [],
            "AllergyItems": [],
            "SystemicHistory": [],
            "SurgicalHistory": [],
            "CurrentSystemicMedicationsHistory": [],
            "CurrentEyeMedications": [],
            "SurgeryList": [],
            "OcularHistory": [],
            "OcularSurgicalHistory": [],
            "PatientData": {
                "Height": "",
                "HeightUnit": "",
                "Weight": "",
                "WeightUnit": "",
                "BMI": "",
            },
            "AllergyRemarks": "",
            "SurgicalRemarks": "",
            "CurrentSystemicRemarks": "",
            "CurrentEyeRemarks": "",
            "CardioVascularObj": {
                "Systolic": "",
                "Diastolic": "",
                "PR": "",
                "ECG": "",
                "ECGUnits": "",
                "Notes": "",
                "BPlevel": "",
            },
            "Airway": {
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
            "SystemicOtherData": {
                "CardiacNotes": "",
                "showCardiacNotes": false,
                "EndocrineNotes": "",
                "showEndocrineNotes": false,
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
            },
            "SystemicHistoryRemarks": "",
            "LifestyleHistoryRemarks": "",
            "RespiratoryRemarks": "",
            "DiagnosisList": [],
            "PhysicalEvaluationArray": [],
            "PhysicalGeneralNotes": '',
            "PhysicalCardiocNotes": '',
            "PhysicalPulmonaryNotes": '',
            "PhysicalHepaticNotes": '',
            "PhysicalNeurologicNotes": '',
            "uibaccordianIndObj": $scope.uibaccordianIndObj,
        };
        $scope.AddToCache = function () {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
            $scope.MainObj.PatientDetails.FullName = $scope.cacheStorageItem.PatientName || "";
            $scope.MainObj.PatientDetails.DOB = $scope.cacheStorageItem.PatientDOB || "";
            $scope.MainObj.PatientDetails.DisplayId = $scope.cacheStorageItem.PatientDisplayId || "";
            $scope.MainObj.PatientDetails.Mobile = $scope.cacheStorageItem.PatientMobileNumber || "";
            $scope.MainObj.PatientDetails.Gender = $scope.cacheStorageItem.Gender || "";
            $scope.MainObj.PatientDetails.Age = $scope.cacheStorageItem.Age || "";
            $scope.MainObj.PatientDetails.RaceName = $scope.cacheStorageItem.RaceName || "";
        };
        let OrderTypeId = 0, OrderTypeName = '';
        if ($scope.cacheStorageItem.AdmissionId == 0) {
            OrderTypeId = 1;
            OrderTypeName = "Standing Medications(Pre Surgery)";
        } else {
            OrderTypeId = 2;
            OrderTypeName = "Live Medications";
        }
        $scope.EditSurgeryObj = {
            "AllDoctorsList": [],
            "AllAnesthetistList": [],
            "AllNurseList": [],
            "UserID": null,
            "AnesthetistID": null,
            "NurseID": null,
            "SearchProcedureObj": "",
            "SearchAdditionalProcedureObj": "",
            "DiagnosisObject": "",
            "FirstFollowupDate": "",
            "SecondFollowupDate": "",
            "ThirdFollowupDate": "",
            "TempImagesArray": [],
            "PCPobj": ""
        }
        $scope.Lab = {
            "isHGB": false,
            "isHCT": false,
            "isWBC": false,
            "isRBC": false,
            "isA1C": false,
            "isCreatinine ": false,
            "isRBS ": false,
            "isFBS ": false,
            "isPBBS": false,
            "isPLBS": false,
            "isU/A ": false,
            "isBloodAvailable": false,
            "isBloodPlate": false,
            "isPretransfusion": false,
            "isPT": false,
            "isPTT": false,
            "isLFS": false,
            "AllFields": false

        }


        $scope.Chemical = {
            "isSodium": false,
            "isPotassium": false,
            "isChloride": false,
            "isCarbondioxide": false,
            "isglucose": false,
            "isCreatininely": false,
            "isUrea": false,
            "isLDL": false,
            "isHDL": false,
            "isTriglycerides": false,
            "isAlbumin": false,
            "isTotalProtein": false,
            "ChemicalHistoryInd": false
        }
        $scope.HealthPhysical = {
            "AirwaysInd": false,
            "LifeStyelInd": false
        }

        $scope.CNS = {
            "isIndicator": false
        }

        $scope.RespiratoryObj = {
            "IsResp": false,
            "IsCXR": false,
            "IsAsthma": false,
            "IsWheezing": false,
            "IsCOPD": false,
            "IsBreathing": false,
            "IsLungsclearance": false,
            "IsResIndicator": false
        }

        $scope.SystemicHisObj = {
            "IsDiabetes": false,
            "IsLiverDisease": false,
            "IsInfDisease": false,
            "IsAllergies": false,
            "IsEndocrine": false,
            "Indicatory": false
        }

        $scope.AccordianStatusObj = {
            "IsSystemicOpen": false,
            "IsAllergyOpen": false,
            "IsCurrentSystemicOpen": false,
            "IsSurgicalOpen": false,
            "IsCurrentEyeOpen": false,
            "IsHPLabOpen": false,
            "IsHPAirwaysOpen": false,
            "IsHPRespiratoryOpen": false,
            "IsHPSocialOpen": false,
            "IsHPChemistryOpen": false,
            "IsHPECGOpen": false,
            "IsPreDiagOpen": false,
        };

        $scope.GetLasikTempObj = function () {
            return {
                "SurgeryCategoryId": SurgeryCategoryId,
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
                        "OrderTypeId": OrderTypeId || 2,
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
                "DoctorReviewedById": null,
                "DoctorReviewedByName": '',

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
                "IsVacuumPillowUsed": false,
                "IsPreOpLasikSummaryInd": false,
                "IsIntraOpLasikSummaryInd": false,
                "IsPostOpLasikSummaryInd": false,
                "ArrivalType": "",
                "DoctorReviewedDate": null,
                "NurseReviewedDate": null,
                "IsSurgeonOrdersTimeChecked": false,
                "IsPostOpSurgeonOrdersTimeAdded":false
            };
        };

        //$scope.VASScoreList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        $scope.VASScoreList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        $scope.LasikTempObj = angular.copy($scope.GetLasikTempObj());

        $scope.LasikTemplateTypes = {
            "PreOp": { "Key": "PreOp", "TypeId": 1, "TypeName": "Pre-Op", "Tab": "preop", "Title": "Pre-Op" },
            "IntraOp": { "Key": "IntraOp", "TypeId": 2, "TypeName": "Intra-Op", "Tab": "intraop", "Title": "Intra-Op" },
            "PostOp": { "Key": "PostOp", "TypeId": 3, "TypeName": "Post-Op", "Tab": "postop", "Title": "Post-Op / Discharge" }
        };

        $scope.LasikSectionByTab = { "preop": "PreOp", "intraop": "IntraOp", "postop": "PostOp" };

        
        $scope.GetLasikTabStateObj = function (type) {
            return {
                "Key": type.Key,
                "TypeId": type.TypeId,
                "TypeName": type.TypeName,
                "Title": type.Title,
                "StatusFlag": "D",
                "ChartStatus": "D",
                "IsSaved": false,
                "IsLoading": false,
                "HasLoaded": false,
                "LoadedSnapshot": null,
                "HasData": false,
                "IsSigned": false,
                "IsTypedRow": false,
                "IsSummaryView": false,
                "IsAddView": true,
                "IsEditView": true,
                "IsClickSaveBtn": false,
                "SignOffUserId": null,
                "SignOffDate": null,
                "LastSignOffUserDetails": [],
                "SignOffInfo": null,
                "SignedBy": "",
                "NurseReviewedById": null,
                "NurseReviewedByName": "",
                "DoctorReviewedById": null,
                "DoctorReviewedByName": "",
                "LoadPromise": null
            };
        };

        $scope.ResetLasikTabState = function () {
            $scope.LasikTabState = {};
            angular.forEach($scope.LasikTemplateTypes, function (type, key) {
                $scope.LasikTabState[key] = $scope.GetLasikTabStateObj(type);
            });
        };
        $scope.ResetLasikTabState();

        
        $scope.ResetLasikTabData = function () {
            $scope.LasikTabData = {};
            angular.forEach($scope.LasikTemplateTypes, function (type, key) {
                $scope.LasikTabData[key] = {
                    "Key": type.Key,
                    "TypeId": type.TypeId,
                    "TypeName": type.TypeName,
                    "AddData": angular.copy($scope.GetLasikTempObj()),
                    "SummaryData": $scope.GetSummaryObj()
                };
            });
        };

        /* Switch the add / summary context to one section. */
        $scope.ActivateLasikSection = function (sectionKey) {
            if (!$scope.LasikTabData[sectionKey]) { return false; }

            $scope.ActiveLasikSection = sectionKey;
            $scope.SelectedLasikTab = $scope.LasikTemplateTypes[sectionKey];
            $scope.LasikTempObj = $scope.LasikTabData[sectionKey].AddData;
            $scope.SummaryObj = $scope.LasikTabData[sectionKey].SummaryData;
        };

        /* The master lists every tab needs a private copy of - two tabs sharing one
           checklist array is how an answer given on one leaks into another. */
        $scope.SetLasikTabDataField = function (field, value) {
            angular.forEach($scope.LasikTabData, function (tab) {
                tab.AddData[field] = angular.copy(value);
            });
        };

        
        $scope.LasikPendingEditSections = {};

        /* the section the header Save / Sign off / Unsign buttons act on */
        $scope.ActiveLasikSection = "PreOp";

        /* The chart request. Pass a section to ask for just that TypeId; pass
           nothing and every section's row comes back for the popup to split. */
        $scope.GetLasikTemplateReqObj = function (sectionKey) {
            var lasikType = sectionKey ? $scope.LasikTemplateTypes[sectionKey] : null;
            return {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "TypeId": lasikType ? lasikType.TypeId : null,
                "TypeName": lasikType ? lasikType.TypeName : ""
            };
        };

        
        $scope.PreOpTemplateobj = {
            "IsOpenOrderTemplate": false,
            "SelectedOrderTemplate": '',
            "TemplateName": '',
            "PreOpTemplateName": '',
            "DilationTemplateName": '',
            "IsOpenPreOpOrderTemplate": false,
            "SelectedPreopOrderTemplate": '',
        };
        $scope.PostOpTemplateobj = {
            "IsOpenOrderTemplate": false,
            "IsOpenAnesthesiaOrderTemplate": false,
            "SelectedOrderTemplate": '',
            "TemplateName": '',

        };
        $scope.GetDilationMedicationObj = function () {
            return {

                "MedicineObject": "",
                "MedicationId": null,
                "OrganizationMedicationId": null,
                "MedicationName": "",
                "FrequencyId": null,
                "DoseId": null,
                "DoseUnitId": null,
                "RouteId": null,
                "ActionId": null,

                "Frequency": "",
                "Dose": "",
                "DoseUnit": "",
                "Route": "",
                "Action": "",
                "OrderDescription": "",
                "MedicationNotes": "",
                "maxDose": "",
                "IsChecked": false,
                "EditIndex": -1,

                "OrderTypeId": OrderTypeId || null,
                "OrderTypeName": "",
                "IsmedSearchDisabled": false
            };
        };

        $scope.DilationMedicationObj = angular.copy($scope.GetDilationMedicationObj());

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
                "ThirdFollowupDate": ""
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
                //{
                //    "VitalName": "ECG",
                //    "Values": []
                //},
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

        /* one add screen + one summary screen per tab, Pre-Op selected to start with */
        $scope.ResetLasikTabData();
        $scope.ActivateLasikSection('PreOp');

        $scope.SurgeryDiagnosisObj = angular.copy($scope.GetSurgeryDiagnosisObj());


        $scope.BindAccompaniedDetails = function (admitData) {
            admitData = admitData || {};

            var admitName = admitData.AdmitPreopAccompainedName || "";
            var admitBy = admitData.AdmitPreopAccompainedBy || "";

            var preOpData = $scope.GetLasikSectionAddData('PreOp');
            var postOpData = $scope.GetLasikSectionAddData('PostOp');

            /* Admit -> Pre-Op
               Bind only when Pre-Op field is empty */
            if (!preOpData.AccompainedName && admitName) {
                preOpData.AccompainedName = admitName;
            }

            if (!preOpData.AccompainedBy && admitBy) {
                preOpData.AccompainedBy = admitBy;
            }

            if (!preOpData.ArrivalType && (preOpData.AccompainedName || preOpData.AccompainedBy)) {
                preOpData.ArrivalType = 'ACCOMPANIED';
            }

            /* Pre-Op -> Post-Op / Discharge
               Bind only when Post-Op field is empty */
            if (!postOpData.AccompainedName && preOpData.AccompainedName) {
                postOpData.AccompainedName = preOpData.AccompainedName;
            }
        };


        $scope.init = function () {
            $scope.isFaxPopoverOpen = false;
            // $scope.allUserList = localStorageFactory.getItem("allUserList") || [];
            $scope.ShowCorneaAsepsisBandage = true;
            if ($scope.LasikTempObj.SurgeryCategoryId == 4) {
                $scope.ShowCorneaAsepsisBandage = false;
            }

            $scope.allUserList = allUserList || [];
            $scope.TemplateList = [];
            $scope.ApptSurgeryList = [];
            $scope.LasikTemplate = [];
            $scope.ExternalPreadmissionDocuments = [];
            $scope.AddToCache();
            $scope.ReviewedByArray = $scope.allUserList.filter((x) => x.RoleId == 8);
            $scope.nurseAndAscTechnicianList = $scope.allUserList.filter((x) => x.RoleId == 8 || x.RoleId == 38);
            $scope.MedicationGivenByNurseArray = $scope.allUserList.filter((x) => x.RoleId == 8);
            $scope.NurseAnesthetistArray = $scope.allUserList.filter((x) => x.RoleId == 8 || x.RoleId == 25);
            $scope.ChecklistArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 43);
            $scope.PreopHandOffArray = $scope.allUserList.filter(x => x.RoleId == 8);
            $scope.MedicationGivenByArray = $scope.allUserList.filter(x => x.RoleId == 8);
            $scope.AnesthesiaGivenArray = $scope.allUserList.filter(x => x.RoleId == 8 || x.RoleId == 25);

            $scope.SurgeonArray = $scope.ChecklistArray.filter((x) => x.SuffixId == 10);

            $scope.maxDoseList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            let req1 = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId
            };
            let request = {
                "ParentOrganizationId": $scope.ParentHospitalId,
                "CheckListModuleId": 0
            };
            let request1 = {
                "ParentOrganizationId": $scope.ParentHospitalId,
                "CheckListModuleId": 2
            };
            /* the section the popup opens on - the other two tabs are fetched when
               they are opened, or by LoadLasikPrintSections before a print */
            let defaultSectionKey = $scope.ActiveLasikSection || "PreOp";
            let req2 = $scope.GetLasikTemplateReqObj(defaultSectionKey);
            let req3 = {
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "ScreenTypeId": 4,
                "PageSize": 100,
                "SearchText": '',
                "PageNumber": 1,

            };
            $q.all([



                eHnoteSurgeryService.GetOTQuickAccessDetails(req1),
                eHnoteDiagnosisDataServices.GetAllMasterConsultationData(),
                eHnoteDiagnosisDataServices.GetMasterCategoryDetails(),
                eHnoteSurgeryService.GetPatientPreviousAscSurgeries($scope.cacheStorageItem.PatientID),
                eHnoteSurgeryService.GetOrganizationLasikCheckListData(request),
                eHnoteSurgeryService.GetOrganizationASCCheckListData(request1),
                eHnoteSurgeryService.GetAscUserOrderTemplates(req3),
                eHnoteDiagnosisDataServices.GetMedicineDosageFieldsMasterData(),
                eHnoteSurgeryService.GetOrganizationPreOpMedications($scope.HospitalId),
                eHnoteSurgeryService.GetLasikTemplatesChartData(req2),
            ]).then(function (resp) {

                if (resp[0].data.status === "Success") {
                    angular.forEach(resp[0].data.Vitals, function (item) {
                        let ndate = moment().format("YYYY-MM-DD");
                        let edate = ndate + " " + item.VitalAddTime;
                        item.VitalAddTime = moment(edate, "YYYY-MM-DD hh:mm").format("hh:mm A");
                    });
                    $scope.MainObj.VitalsArray = angular.copy(resp[0].data.Vitals) || [];
                    $scope.MainObj.AllergyItems = angular.copy(resp[0].data.AllergyItems);
                    $scope.MainObj.SystemicHistory = angular.copy(resp[0].data.SystemicHistory);
                    $scope.EditSurgeryObj.DiagnosisList = resp[0].data.DiagnosisList || [];
                    $scope.MainObj.DiagnosisList = resp[0].data.DiagnosisList || [];



                    $scope.MainObj.SurgicalHistory = angular.copy(resp[0].data.SurgicalHistory);
                    $scope.MainObj.CurrentSystemicMedicationsHistory = angular.copy(resp[0].data.CurrentSystemicMedicationList);
                    $scope.MainObj.CurrentEyeMedications = angular.copy(resp[0].data.CurrentEyeMedicationList);

                    $scope.MainObj.PhysicalEvaluationArray = resp[0].data.PhysicalEvaluationDetails || [];
                    /* $scope.MainObj.SystemicOtherData = angular.copy(resp[0].data.SystemicOtherData);*/

                    $scope.diabetesString = '';
                    if (!$scope.ParentObj.IsIOJParentOrganization) {
                        let diabetesarray = [];
                        const diabetesIds = [
                            640, 641, 804, 808, 926, 927, 966, 587, 874, 953, 697, 696
                        ];
                        if ($scope.MainObj.SystemicHistory.length > 0) {
                            angular.forEach($scope.MainObj.SystemicHistory, function (item) {
                                if (diabetesIds.includes(item.HistoryId)) {
                                    $scope.hasDiabetes = true;
                                    diabetesarray.push(item.HistoryName);
                                }
                            });
                        }

                        $scope.diabetesString = diabetesarray.join(',') || '';
                    }

                    if (resp[0].data.SystemicOtherData != undefined) {
                        let respobjSys = resp[0].data.SystemicOtherData || {};

                        $scope.MainObj.SystemicOtherData.OtherDataId = respobjSys.OtherDataId || 0;

                        $scope.MainObj.SystemicOtherData.CardiacNotes = respobjSys.CardiacNotes || '';
                        if ($scope.MainObj.SystemicOtherData.CardiacNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showCardiacNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showCardiacNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.NeurologicNotes = respobjSys.NeurologicNotes || '';
                        if ($scope.MainObj.SystemicOtherData.NeurologicNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showNeurologicNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showNeurologicNotes = false;
                        }
                        $scope.MainObj.SystemicOtherData.EndocrineNotes = respobjSys.EndocrineNotes || '';
                        if ($scope.MainObj.SystemicOtherData.EndocrineNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showEndocrineNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showEndocrineNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.GeneralAppearenceNotes = respobjSys.GeneralAppearenceNotes || '';
                        if ($scope.MainObj.SystemicOtherData.GeneralAppearenceNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showGeneralAppearenceNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showGeneralAppearenceNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.HeentNotes = respobjSys.HeentNotes || '';
                        if ($scope.MainObj.SystemicOtherData.HeentNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showHeentNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showHeentNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.LungsNotes = respobjSys.LungsNotes || '';
                        if ($scope.MainObj.SystemicOtherData.LungsNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showLungsNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showLungsNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.PulmonaryNotes = respobjSys.PulmonaryNotes || '';
                        if ($scope.MainObj.SystemicOtherData.PulmonaryNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showPulmonaryNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showPulmonaryNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.HepaticNotes = respobjSys.HepaticNotes || '';
                        if ($scope.MainObj.SystemicOtherData.HepaticNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showHepaticNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showHepaticNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.HemeOncNotes = respobjSys.HemeOncNotes || '';
                        if ($scope.MainObj.SystemicOtherData.HemeOncNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showHemeOncNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showHemeOncNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.NervousSystemNotes = respobjSys.NervousSystemNotes || '';
                        if ($scope.MainObj.SystemicOtherData.NervousSystemNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showNervousSystemNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showNervousSystemNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.KidneyDiseaseNotes = respobjSys.KidneyDiseaseNotes || '';
                        if ($scope.MainObj.SystemicOtherData.KidneyDiseaseNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showKidneyDiseaseNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showKidneyDiseaseNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.MusculoSkeletalSystemNotes = respobjSys.MusculoSkeletalSystemNotes || '';
                        if ($scope.MainObj.SystemicOtherData.MusculoSkeletalSystemNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showMusculoSkeletalSystemNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showMusculoSkeletalSystemNotes = false;
                        }
                        $scope.MainObj.SystemicOtherData.PsychosisNotes = respobjSys.PsychosisNotes || '';
                        if ($scope.MainObj.SystemicOtherData.PsychosisNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showPsychosisNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showPsychosisNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.OthersNotes = respobjSys.OthersNotes || '';
                        if ($scope.MainObj.SystemicOtherData.OthersNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showOthersNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showOthersNotes = false;
                        }
                    }
                    if (resp[0].data.PreAdmission.CardioVascular != null) {
                        $scope.MainObj.CardioVascularObj.ECG = resp[0].data.PreAdmission.CardioVascular.CardioECG || "";
                        $scope.MainObj.CardioVascularObj.ECGUnits = resp[0].data.PreAdmission.CardioVascular.CardioECGUnits || "BPM";
                        $scope.MainObj.CardioVascularObj.Notes = resp[0].data.PreAdmission.CardioVascular.CardioNotes || "";
                    }

                    $scope.MainObj.AllergyRemarks = angular.copy(resp[0].data.AllergyRemarks) || '';
                    $scope.MainObj.SurgicalRemarks = angular.copy(resp[0].data.SurgicalRemarks) || '';
                    $scope.MainObj.CurrentEyeRemarks = angular.copy(resp[0].data.CurrentEyeRemarks) || '';
                    $scope.MainObj.CurrentSystemicRemarks = angular.copy(resp[0].data.CurrentSystemicRemarks) || '';
                    $scope.MainObj.SystemicHistoryRemarks = angular.copy(resp[0].data.SystemicHistoryRemarks) || '';
                    $scope.MainObj.LifestyleHistoryRemarks = angular.copy(resp[0].data.LifestyleHistoryRemarks) || '';
                    $scope.MainObj.RespiratoryRemarks = angular.copy(resp[0].data.RespiratoryRemarks) || '';


                    // accordian open/close statuses
                    if ($scope.MainObj.AllergyItems.length > 0) {
                        $scope.AccordianStatusObj.IsAllergyOpen = true;
                    }
                    if ($scope.MainObj.SystemicHistory.length > 0) {
                        $scope.AccordianStatusObj.IsSystemicOpen = true;
                    }
                    if ($scope.MainObj.SurgicalHistory.length > 0) {
                        $scope.AccordianStatusObj.IsSurgicalOpen = true;
                    }
                    let CurrentSystemicMedicationsHistory = $filter('filter')($scope.MainObj.CurrentSystemicMedicationsHistory, { 'MedicationLocationTypeId': 2 }, true) || [];
                    if (CurrentSystemicMedicationsHistory.length > 0) {
                        $scope.AccordianStatusObj.IsCurrentSystemicOpen = true;
                    }
                    let CurrentEyeMedications = $filter('filter')($scope.MainObj.CurrentSystemicMedicationsHistory, { 'MedicationLocationTypeId': 1 }, true) || [];
                    if (CurrentEyeMedications.length > 0) {
                        $scope.AccordianStatusObj.IsCurrentEyeOpen = true;
                    }
                    //$scope.MainObj.OcularHistory = angular.copy(resp[0].data.OccularHistory);
                    //$scope.MainObj.OcularSurgicalHistory = angular.copy(resp[0].data.OcularSurgicalHistory);
                    $scope.MainObj.DocumentDetails = angular.copy(resp[0].data.DocumentDetails);
                    $scope.MainObj.ROSOverAllRemarks = resp[0].data.RosOverallRemarks || "";
                    $scope.MainObj.LabInvestigation = resp[0].data.LabInvestigation || [];
                    $scope.MainObj.SystemicHistory = resp[0].data.SystemicHistory || [];
                    $scope.MainObj.LifestyleDetail = resp[0].data.LifestyleDetail || [];
                    $scope.MainObj.PreAdmission = resp[0].data.PreAdmission || '';

                    if ($scope.MainObj.PreAdmission !== '') {
                        if ($scope.MainObj.PreAdmission.CardioVascular !== undefined) {
                            $scope.MainObj.PreAdmission.ECGValue = $scope.MainObj.PreAdmission.CardioVascular.CardioECG || ''
                            $scope.MainObj.PreAdmission.ECGNotes = $scope.MainObj.PreAdmission.CardioVascular.CardioNotes || ''
                            $scope.MainObj.PreAdmission.ECGUnits = $scope.MainObj.PreAdmission.CardioVascular.CardioECGUnits || ''
                        }

                        $scope.MainObj.PhysicalNeurologicNotes = $scope.MainObj.PreAdmission.PhysicalNeurologicNotes || '';
                        $scope.MainObj.PhysicalGeneralNotes = $scope.MainObj.PreAdmission.PhysicalGeneralNotes || '';
                        $scope.MainObj.PhysicalCardiocNotes = $scope.MainObj.PreAdmission.PhysicalCardiocNotes || '';
                        $scope.MainObj.PhysicalHepaticNotes = $scope.MainObj.PreAdmission.PhysicalHepaticNotes || '';
                        $scope.MainObj.PhysicalPulmonaryNotes = $scope.MainObj.PreAdmission.PhysicalPulmonaryNotes || '';

                        $scope.MainObj.PreAdmission.Airway = $scope.MainObj.PreAdmission.Airway || '';
                        if ($scope.MainObj.PreAdmission.Airway !== '') {
                            $scope.MainObj.Airway.MouthOpening = $scope.MainObj.PreAdmission.Airway.MouthOpening || '';
                            $scope.MainObj.Airway.TMDistance = $scope.MainObj.PreAdmission.Airway.TMDistance || '';
                            $scope.MainObj.Airway.UnableToAssess = $scope.MainObj.PreAdmission.Airway.UnableToAssess || false;
                            $scope.MainObj.Airway.Tracheostomy = $scope.MainObj.PreAdmission.Airway.Tracheostomy || false;
                        }
                    };


                    $scope.MainObj.PatientData = resp[0].data.LatestAppointmentVital || '';
                    resp[0].data.CurrentAppointmentVital = resp[0].data.CurrentAppointmentVital || '';

                    resp[0].data.CurrentAppointmentVital.Height = resp[0].data.CurrentAppointmentVital.Height || '';
                    resp[0].data.CurrentAppointmentVital.Weight = resp[0].data.CurrentAppointmentVital.Weight || '';
                    resp[0].data.CurrentAppointmentVital.BMI = resp[0].data.CurrentAppointmentVital.BMI || '';

                    resp[0].data.LatestAppointmentVital.Height = resp[0].data.LatestAppointmentVital.Height || '';
                    resp[0].data.LatestAppointmentVital.HeightUnit = resp[0].data.LatestAppointmentVital.HeightUnit || '';
                    resp[0].data.LatestAppointmentVital.Weight = resp[0].data.LatestAppointmentVital.Weight || '';
                    resp[0].data.LatestAppointmentVital.WeightUnit = resp[0].data.LatestAppointmentVital.WeightUnit || '';
                    resp[0].data.LatestAppointmentVital.BMI = resp[0].data.LatestAppointmentVital.BMI || '';

                    if (resp[0].data.CurrentAppointmentVital != "" && ($scope.cacheStorageItem.AppointmentId == resp[0].data.CurrentAppointmentVital.AppointmentId)) {
                        if (resp[0].data.CurrentAppointmentVital.Height !== "" && resp[0].data.CurrentAppointmentVital.Weight !== "") {
                            $scope.MainObj.PatientData.Height = resp[0].data.CurrentAppointmentVital.Height || '';
                            $scope.MainObj.PatientData.HeightUnit = resp[0].data.CurrentAppointmentVital.HeightUnit || '';
                            $scope.MainObj.PatientData.Weight = resp[0].data.CurrentAppointmentVital.Weight || '';
                            $scope.MainObj.PatientData.WeightUnit = resp[0].data.CurrentAppointmentVital.WeightUnit || '';
                            $scope.MainObj.PatientData.BMI = resp[0].data.CurrentAppointmentVital.BMI || '';

                            $scope.LogObj.Height = resp[0].data.CurrentAppointmentVital.Height || '';
                            $scope.LogObj.Weight = resp[0].data.CurrentAppointmentVital.Weight || '';
                            $scope.LogObj.BMI = resp[0].data.CurrentAppointmentVital.BMI || '';
                        } else {
                            $scope.MainObj.PatientData.Height = resp[0].data.LatestAppointmentVital.Height || '';
                            $scope.MainObj.PatientData.HeightUnit = resp[0].data.LatestAppointmentVital.HeightUnit || '';
                            $scope.MainObj.PatientData.Weight = resp[0].data.LatestAppointmentVital.Weight || '';
                            $scope.MainObj.PatientData.WeightUnit = resp[0].data.LatestAppointmentVital.WeightUnit || '';
                            $scope.MainObj.PatientData.BMI = resp[0].data.LatestAppointmentVital.BMI || '';
                        }
                    }
                    else {
                        $scope.MainObj.PatientData.Height = resp[0].data.LatestAppointmentVital.Height || '';
                        $scope.MainObj.PatientData.HeightUnit = resp[0].data.LatestAppointmentVital.HeightUnit || '';
                        $scope.MainObj.PatientData.Weight = resp[0].data.LatestAppointmentVital.Weight || '';
                        $scope.MainObj.PatientData.WeightUnit = resp[0].data.LatestAppointmentVital.WeightUnit || '';
                        $scope.MainObj.PatientData.BMI = resp[0].data.LatestAppointmentVital.BMI || '';
                    }

                    if ($scope.MainObj.VitalsArray.length > 0) {
                        $scope.MainObj.VitalsDisplay = $scope.GetDisplayVitalsArray();
                        angular.forEach($scope.MainObj.VitalsArray, function (mainitem, $index) {
                            let TempFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 11 }, true) || [];
                            if (TempFilter.length > 0) {
                                var tempobj = {
                                    "value": TempFilter[0].Value,
                                    "UnitTypeName": TempFilter[0].UnitTypeName
                                }
                            }
                            $scope.MainObj.VitalsDisplay[0].Values.push(tempobj);
                            let pulseFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 12 }, true) || [];
                            if (pulseFilter.length > 0) {
                                var pulseobj = {
                                    "value": pulseFilter[0].Value,
                                    "UnitTypeName": pulseFilter[0].UnitTypeName
                                }
                            }
                            $scope.MainObj.VitalsDisplay[1].Values.push(pulseobj);
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
                            $scope.MainObj.VitalsDisplay[2].Values.push(Bpobj);
                            let RespFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 14 }, true) || [];
                            if (RespFilter.length > 0) {
                                var Respobj = {
                                    "value": RespFilter[0].Value,
                                    "UnitTypeName": RespFilter[0].UnitTypeName
                                }
                            }
                            $scope.MainObj.VitalsDisplay[3].Values.push(Respobj);
                            let Spo2Filter = $filter('filter')(mainitem.Vitals, { "VitalId": 15 }, true) || [];
                            if (Spo2Filter.length > 0) {
                                var Spo2obj = {
                                    "value": Spo2Filter[0].Value,
                                    "UnitTypeName": Spo2Filter[0].UnitTypeName
                                }
                            }
                            $scope.MainObj.VitalsDisplay[4].Values.push(Spo2obj);
                            let BGLFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 8 }, true) || [];
                            if (BGLFilter.length > 0) {
                                var BGLobj = {
                                    "value": BGLFilter[0].Value,
                                    "UnitTypeName": BGLFilter[0].UnitTypeName
                                }
                            }
                            $scope.MainObj.VitalsDisplay[5].Values.push(BGLobj);
                            //let ECGFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 36 }, true) || [];
                            //if (ECGFilter.length > 0) {
                            //    var ECGobj = {
                            //        "value": ECGFilter[0].Value,
                            //        "UnitTypeName": ECGFilter[0].UnitTypeName
                            //    }
                            //}
                            //$scope.MainObj.VitalsDisplay[6].Values.push(ECGobj);
                            var Time = {
                                "value": $scope.MainObj.VitalsArray[$index].VitalAddTime || "",
                                "UnitTypeName": "",
                            }
                            $scope.MainObj.VitalsDisplay[6].Values.push(Time);
                            var performedBy = {
                                "value": $scope.MainObj.VitalsArray[$index].UserName || "",
                                "UnitTypeName": "",
                            }
                            $scope.MainObj.VitalsDisplay[7].Values.push(performedBy);

                            var NotesObj = {
                                "value": $scope.MainObj.VitalsArray[$index].VitalRemarks || "",
                                "UnitTypeName": "",
                            }
                            $scope.MainObj.VitalsDisplay[8].Values.push(NotesObj);
                        });
                    }
                    var TempFilter1 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 506 }, true);
                    if (TempFilter1.length > 0) {
                        $scope.Lab.isHGB = true;
                    } else {
                        $scope.Lab.isHGB = false;
                    }
                    var TempFilter2 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 840 }, true);
                    if (TempFilter2.length > 0) {
                        $scope.Lab.isHCT = true;
                    } else {
                        $scope.Lab.isHCT = false;
                    }
                    var TempFilter3 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 841 }, true);
                    if (TempFilter3.length > 0) {
                        $scope.Lab.isWBC = true;
                    } else {
                        $scope.Lab.isWBC = false;
                    }
                    var TempFilter4 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 842 }, true);
                    if (TempFilter4.length > 0) {
                        $scope.Lab.isRBC = true;
                    }
                    else {
                        $scope.Lab.isRBC = false;
                    }
                    var TempFilter5 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 843 }, true);
                    if (TempFilter5.length > 0) {
                        $scope.Lab.isA1C = true;
                    } else {
                        $scope.Lab.isA1C = false;
                    }
                    var TempFilter6 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 844 }, true);
                    if (TempFilter6.length > 0) {
                        $scope.Lab.isCreatinine = true;
                    } else {
                        $scope.Lab.isCreatinine = false;
                    }
                    var TempFilter7 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 863 }, true);
                    if (TempFilter7.length > 0) {
                        $scope.Lab.isUA = true;
                    } else {
                        $scope.Lab.isUA = false;
                    }
                    var TempFilter8 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 864 }, true);
                    if (TempFilter8.length > 0) {
                        $scope.Lab.isBloodAvailable = true;
                    } else {
                        $scope.Lab.isBloodAvailable = false;
                    }
                    var TempFilter9 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 865 }, true);
                    if (TempFilter9.length > 0) {
                        $scope.Lab.isPretransfusion = true;
                    } else {
                        $scope.Lab.isPretransfusion = false;
                    }
                    var TempFilter10 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 845 }, true);
                    if (TempFilter10.length > 0) {
                        $scope.Lab.isRBS = true;
                    }
                    else {
                        $scope.Lab.isRBS = false;
                    }
                    var TempFilter11 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 846 }, true);
                    if (TempFilter11.length > 0) {
                        $scope.Lab.isFBS = true;
                    } else {
                        $scope.Lab.isFBS = false;
                    }
                    var TempFilter12 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 847 }, true);
                    if (TempFilter12.length > 0) {
                        $scope.Lab.isPBBS = true;
                    } else {
                        $scope.Lab.isPBBS = false;
                    }
                    var TempFilter13 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 848 }, true);
                    if (TempFilter13.length > 0) {

                        $scope.Lab.isPLBS = true;
                    } else {
                        $scope.Lab.isPLBS = false;
                    }
                    var TempFilter14 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 849 }, true);
                    if (TempFilter14.length > 0) {
                        $scope.Lab.isPT = true;
                    } else {
                        $scope.Lab.isPT = false;
                    }
                    var TempFilter15 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 850 }, true);
                    if (TempFilter15.length > 0) {
                        $scope.Lab.isPTT = true;
                    } else {
                        $scope.Lab.isPTT = false;
                    }
                    var TempFilter16 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 851 }, true);
                    if (TempFilter16.length > 0) {
                        $scope.Lab.isLFS = true;
                    } else {
                        $scope.Lab.isLFS = false;
                    }
                    var TempFilter17 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 2254 }, true);
                    if (TempFilter17.length > 0) {
                        $scope.Lab.isBloodPlate = true;
                    } else {
                        $scope.Lab.isBloodPlate = false;
                    }



                    if ($scope.Lab.isHGB == false && $scope.Lab.isHCT == false && $scope.Lab.isWBC == false && $scope.Lab.isRBC == false && $scope.Lab.isA1C == false && $scope.Lab.isCreatinine == false && $scope.Lab.isRBS == false && $scope.Lab.isFBS == false && $scope.Lab.isPBBS == false && $scope.Lab.isPLBS == false && $scope.Lab.isUA == false && $scope.Lab.isBloodAvailable == false &&
                        $scope.Lab.isPretransfusion == false && $scope.Lab.isPT == false && $scope.Lab.isPTT == false && $scope.Lab.isLFS == false && $scope.Lab.isBloodPlate == false) {
                        $scope.Lab.AllFields = false;
                    } else {
                        $scope.Lab.AllFields = true;
                        $scope.AccordianStatusObj.IsHPLabOpen = true;
                    }


                    var TempChem1 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 852 }, true);
                    if (TempChem1.length > 0) {
                        $scope.Chemical.isSodium = true;
                    }
                    var TempChem2 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 853 }, true);
                    if (TempChem2.length > 0) {
                        $scope.Chemical.isPotassium = true;
                    }
                    var TempChem3 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 854 }, true);
                    if (TempChem3.length > 0) {
                        $scope.Chemical.isChloride = true;
                    }
                    var TempChem4 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 855 }, true);
                    if (TempChem4.length > 0) {
                        $scope.Chemical.isCarbondioxide = true;
                    }

                    var TempChem5 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 856 }, true);
                    if (TempChem5.length > 0) {
                        $scope.Chemical.isglucose = true;
                    }
                    var TempChem6 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 866 }, true);
                    if (TempChem6.length > 0) {
                        $scope.Chemical.isCreatininely = true;
                    }
                    var TempChem7 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 857 }, true);
                    if (TempChem7.length > 0) {
                        $scope.Chemical.isUrea = true;
                    }
                    var TempChem8 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 858 }, true);
                    if (TempChem8.length > 0) {
                        $scope.Chemical.isLDL = true;
                    }

                    var TempChem9 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 859 }, true);
                    if (TempChem9.length > 0) {
                        $scope.Chemical.isHDL = true;
                    }
                    var TempChem10 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 860 }, true);
                    if (TempChem10.length > 0) {
                        $scope.Chemical.isTriglycerides = true;
                    }
                    var TempChem11 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 861 }, true);
                    if (TempChem11.length > 0) {
                        $scope.Chemical.isAlbumin = true;
                    }
                    var TempChem12 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 862 }, true);
                    if (TempChem12.length > 0) {
                        $scope.Chemical.isTotalProtein = true;
                    }

                    if ($scope.Chemical.isSodium == false && $scope.Chemical.isPotassium == false && $scope.Chemical.isChloride == false && $scope.Chemical.isCarbondioxide == false && $scope.Chemical.isglucose == false && $scope.Chemical.isCreatininely == false && $scope.Chemical.isUrea == false && $scope.Chemical.isLDL == false &&
                        $scope.Chemical.isHDL == false && $scope.Chemical.isTriglycerides == false && $scope.Chemical.isAlbumin == false && $scope.Chemical.isTotalProtein == false) {
                        $scope.ChemicalHistoryInd = false;
                    } else {
                        $scope.ChemicalHistoryInd = true;
                        $scope.AccordianStatusObj.IsHPChemistryOpen = true;
                    }



                    if (Object.keys(resp[0].data.PreAdmission).length === 0) {



                        $scope.HealthPhysical.AirwaysInd = false;
                    } else {

                        $scope.MainObj.PreAdmission = resp[0].data.PreAdmission;

                        $scope.MainObj.PreAdmission.Airway = $scope.MainObj.PreAdmission.Airway || '';
                        if ($scope.MainObj.PreAdmission.Airway !== '') {
                            $scope.MainObj.PreAdmission.Airway.ChemistryNotes = $scope.MainObj.PreAdmission.Airway.ChemistryNotes || '';
                            $scope.MainObj.PreAdmission.Airway.DentitionList = $scope.MainObj.PreAdmission.Airway.DentitionList || [];
                        }

                        if (!($scope.MainObj.PreAdmission.AirIsNormal == true || $scope.MainObj.PreAdmission.AirROMTMS != '' || $scope.MainObj.PreAdmission.AirROMNECKAP != '' || $scope.MainObj.PreAdmission.AirROMNECKAP != '' || $scope.MainObj.PreAdmission.AirROMNECKLAT != '' || $scope.MainObj.PreAdmission.AirClass != '' || $scope.MainObj.PreAdmission.Airway.DentitionList.length >
                            0 || ($scope.MainObj.PreAdmission.Dentition !== '' && $scope.MainObj.PreAdmission.Dentition !== null) || $scope.MainObj.PreAdmission.AirNotes != '' || $scope.MainObj.Airway.MouthOpening !== '' || $scope.MainObj.Airway.TMDistance !== '' || $scope.MainObj.Airway.UnableToAssess || $scope.MainObj.Airway.Tracheostomy)
                        ) {
                            $scope.HealthPhysical.AirwaysInd = false;
                        } else {
                            $scope.HealthPhysical.AirwaysInd = true;
                            $scope.AccordianStatusObj.IsHPAirwaysOpen = true;
                        }

                        if ($scope.MainObj.PreAdmission.ECGValue != '' || $scope.MainObj.PreAdmission.ECGNotes != '') {
                            $scope.AccordianStatusObj.IsHPECGOpen = true;
                        }

                    }


                    var TempCNS = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 115 }, true);
                    if (TempCNS.length > 0) {
                        $scope.CNS.isIndicator = true;
                    }


                    var TempRespi = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 116 }, true);
                    if (TempRespi.length > 0) {
                        $scope.RespiratoryObj.IsResp = true;
                    }

                    //var TempRespi1 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 117 }, true);
                    var TempRespi1 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 867 }, true);
                    if (TempRespi1.length > 0) {
                        $scope.RespiratoryObj.IsCXR = true;
                    }

                    var TempRespi2 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 118 }, true);
                    if (TempRespi2.length > 0) {
                        $scope.RespiratoryObj.IsAsthma = true;
                    }

                    var TempRespi3 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 119 }, true);
                    if (TempRespi3.length > 0) {
                        $scope.RespiratoryObj.IsWheezing = true;
                    }

                    var TempRespi4 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 120 }, true);
                    if (TempRespi4.length > 0) {
                        $scope.RespiratoryObj.IsCOPD = true;
                    }
                    var TempRespi5 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 121 }, true);
                    if (TempRespi5.length > 0) {
                        $scope.RespiratoryObj.IsBreathing = true;
                    }
                    var TempRespi6 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 122 }, true);
                    if (TempRespi6.length > 0) {
                        $scope.RespiratoryObj.IsLungsclearance = true;
                    }


                    if ($scope.RespiratoryObj.IsResp == false && $scope.RespiratoryObj.IsCXR == false && $scope.RespiratoryObj.IsAsthma == false && $scope.RespiratoryObj.IsWheezing == false && $scope.RespiratoryObj.IsCOPD == false && $scope.RespiratoryObj.IsBreathing == false && $scope.RespiratoryObj.IsLungsclearance == false) {
                        $scope.RespiratoryObj.IsResIndicator = false;
                    } else {
                        $scope.RespiratoryObj.IsResIndicator = true;
                        $scope.AccordianStatusObj.IsHPRespiratoryOpen = true;
                    }



                    if ($scope.MainObj.LifestyleDetail.length > 0) {
                        angular.forEach($scope.MainObj.LifestyleDetail, function (Litem) {
                            Litem.AlcoholDurationDate = Litem.AlcoholDurationDate || null;
                            Litem.DrugDurationDate = Litem.DrugDurationDate || null;
                            if (Litem.AlcoholType == '' && Litem.DrugType == '' && Litem.PsychisType == '' && Litem.SmokingType == '' && Litem.Remarks == '') {
                                $scope.HealthPhysical.LifeStyelInd = false;
                            } else {
                                $scope.HealthPhysical.LifeStyelInd = true;
                                $scope.AccordianStatusObj.IsHPSocialOpen = true;
                            }
                        });
                    } else {
                        $scope.HealthPhysical.LifeStyelInd = false;
                    }

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


                }


                if (resp[1].data.status === "Success") {

                    $scope.Modalities = resp[1].data.Modalities || [];
                    $scope.ROSAllergyReactions = resp[1].data.ROSAllergyReactions || [];
                    $scope.ROSAllergySeverity = resp[1].data.ROSAllergySeverity || [];
                    $scope.ROSAllergyStatus = resp[1].data.ROSAllergyStatus || [];
                    $scope.ROSAllergyType = resp[1].data.ROSAllergyType || [];
                }

                if (resp[2].data.status === "Success") {
                    if (resp[2].data.rows.length > 0) {

                        $scope.TemplateList = angular.copy(resp[2].data.rows);
                    }
                }
                if (resp[3].data.status === 'Success') {
                    $scope.PatientSurgeries = resp[3].data.rows || [];
                }
                if (resp[4].data.status === "Success") {
                    let masterAscChecklist = angular.copy(resp[4].data.rows) || [];
                    $scope.LasikTemplate = angular.copy(resp[4].data.LasikTemplate);
                    angular.forEach(masterAscChecklist, function (item) {
                        item.IsChecked = false;
                    });
                    // Checklist IDs required for LASIK
                    const ids = [631, 632, 633, 634, 635];

                    /* Each tab gets its own copy of the master checklist. Pre-Op reads
                       categories 28/11 out of it and Post-Op reads 351/31 - on one
                       shared array a saved Pre-Op answer would surface in the Post-Op
                       add screen as well. CheckInChecklist stays a filtered view over
                       the very same row objects as OtherCheckInChecklist. */
                    angular.forEach($scope.LasikTabData, function (tab) {
                        let clinicalChecklist = angular.copy(masterAscChecklist);
                        tab.AddData.OrgASCChecklist = angular.copy(masterAscChecklist);
                        tab.AddData.OtherCheckInChecklist = clinicalChecklist;
                        tab.AddData.CheckInChecklist = clinicalChecklist.filter(function (item) {
                            return ids.includes(parseInt(item.CheckListId));
                        });
                    });
                }
                if (resp[5].data.status === "Success") {
                    $scope.SetLasikTabDataField('IntraopOrgASCChecklist', resp[5].data.rows);
                    $scope.LasikTemplate = angular.copy(resp[5].data.LasikTemplate);
                }
                if (resp[6].data.Status === "Success") {
                    $scope.UserOrderList = resp[6].data.rows || [];
                }
                // req3 above only asks for ScreenTypeId 4, so bring in the post-op ones too
                $scope.AppendPostOpOrderTemplates();

                if (resp[7].data.status === "Success") {
                    $scope.DoseArray = resp[7].data.doseArray || [];
                    $scope.DoseOtherArray = resp[7].data.doseOtherArray || [];
                    $scope.FrequencyArray = resp[7].data.frequencyArray || [];
                    $scope.RefillsArray = resp[7].data.refillsArray || [];
                    $scope.DurationArray = resp[7].data.durationArray || [];
                    $scope.ActionArray = resp[7].data.actionArray || [];
                    $scope.RouteArray = resp[7].data.routeArray || [];
                    $scope.DoseUnitArray = resp[7].data.doseUnitArray || [];
                    $scope.QuantityUnitArray = resp[7].data.quantityUnitArray || [];

                    $scope.doseArray = resp[7].data.doseArray || [];
                    $scope.doseOtherArray = resp[7].data.doseOtherArray || [];
                    $scope.frequencyArray = resp[7].data.frequencyArray || [];
                    $scope.refillsArray = resp[7].data.refillsArray || [];
                    $scope.durationArray = resp[7].data.durationArray || [];
                    $scope.actionArray = resp[7].data.actionArray || [];
                    $scope.routeArray = resp[7].data.routeArray || [];
                    $scope.doseUnitArray = resp[7].data.doseUnitArray || [];
                    $scope.quantityUnitArray = resp[7].data.quantityUnitArray || [];
                    $scope.MedicationStopReasons = resp[7].data.MedicationStopReasons || [];
                }
                if (resp[8].data.status === "Success") {
                    angular.forEach(resp[8].data.rows, function (item) {
                        item.AscMedicationId = 0;
                        item.IsChecked = false;
                        item.DropTimings = [{ "MedicationTime": "" }, { "MedicationTime": "" }];
                    });
                    let tempPreOpMedications = $filter('filter')(resp[8].data.rows, { "MedTypeId": 1 }, true);
                    $scope.MasterPreOpMedications = angular.copy(tempPreOpMedications) || [];
                    let tempDilationMedications = $filter('filter')(resp[8].data.rows, { "MedTypeId": 2 }, true);
                    $scope.MasterDilationMedications = angular.copy(tempDilationMedications);


                    let temppostopMedications = $filter('filter')(resp[8].data.rows, { "MedTypeId": 5 }, true);
                    //   $scope.LasikTempObj.PostOpMedications = angular.copy(temppostopMedications);
                    $scope.MasterPostOpMedications = angular.copy(temppostopMedications);

                    let temppostopanesthesiaMedications = $filter('filter')(resp[8].data.rows, { "MedTypeId": 8 }, true);
                    $scope.MasterPostOpAnesthesiaMedications = angular.copy(temppostopanesthesiaMedications);
                }

                if (resp[9].data.status === "Success") {
                    var rows = angular.copy(resp[9].data.rows || []);
                    var lastSignOffUserDetails = angular.copy(resp[9].data.LastSignOffUserDetails || []);
                    if (rows.length > 0) {
                        angular.forEach(rows, function (row) {
                            row.LastSignOffUserDetails = angular.copy(lastSignOffUserDetails);
                        });
                    }
                    $scope.BindLasikTemplateSection(defaultSectionKey, rows);

                    angular.forEach($scope.LasikTemplateTypes, function (lasikType, sectionKey) {
                        if (sectionKey !== defaultSectionKey) {
                            $scope.RefreshLasikTabMode(sectionKey);
                        }
                    });

                    // Admit -> PreOp -> PostOp fallback
                    $scope.BindAccompaniedDetails(resp[9].data);
                }

                /* the chart is bound - anything driving this controller without the
                   popup on screen (the ASC "Print All" reuse) can print from here */
                $scope.IsLasikChartLoaded = true;
            });
        }

        $scope.IsLasikChartLoaded = false;
        /* Which phases the print covers. The template's own Print button fills this
           in from the section on screen; the ASC "Print All" popup fills it in from
           the phases the user ticked there. Empty means the whole chart. */
        $scope.LasikPrintPhases = {
            "IsLasikPreopPrintInd": false,
            "IsLasikIntraopPrintInd": false,
            "IsLasikPostopPrintInd": false
        };

        /* Which of the two screens is driving the print. The template's own Print
           button prints the one section open in front of the user; the ASC print
           popup drives this controller with no popup on screen and prints every
           phase it was given. The two are told apart here rather than guessed at,
           so neither screen's Print can change the other's behaviour. */
        $scope.IsLasikSectionPrint = false;

        $scope.init();




        $scope.newclicktime = function (item, type) {
            $scope.currentTime = $filter("date")(new Date(), "h:mm a");

            if (type == 'HandOffTime') {
                item.HandOffTime = $scope.currentTime;
            }
            else if (type == 'HallStart') {
                item.HallEntranceStartTime = $scope.currentTime;
            }
            else if (type == 'HallEnd') {
                item.HallEntranceEndTime = $scope.currentTime;
            }
            else if (type == 'SurgeryStart') {
                item.SurgeryStartTime = $scope.currentTime;
            }
            else if (type == 'SurgeryEnd') {
                item.SurgeryEndTime = $scope.currentTime;
                /*$scope.IntraOpObj.HandOffTime = angular.copy(item.SurgeryEndTime);// for Hand-Off Notes	*/
            }
            else if (type == 'PreOpIOPTime') { item.PreOpIOPTime = $scope.currentTime; }
            else if (type == 'IOPTime') { item.IOPTime = $scope.currentTime; }
            else if (type == 'IOPReEvalTime') { item.IOPReEvalTime = $scope.currentTime; }

            else {

            }

        }


        $scope.OnclickAccPatient = function () {
            if ($scope.LasikTempObj.IsAccompaniedSignDone) {
                alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to delete the added signature? </h4>", function () {
                    $scope.clearSign('SE_AccompaniedBySign');
                    $scope.LasikTempObj.AccompainedBy = 'Self';
                    $scope.LasikTempObj.AccompainedByNotes = '';
                    $scope.LasikTempObj.AccompainedByNotesInd = false;
                }, function () {
                    return;
                });
            } else {
                $scope.LasikTempObj.AccompainedBy = 'Self';
                $scope.LasikTempObj.AccompainedByNotes = '';
                $scope.LasikTempObj.AccompainedByNotesInd = false;
            }
        }

        $scope.OnclickAccFamily = function () {
            $scope.LasikTempObj.AccompainedBy = 'Family';
            $scope.LasikTempObj.AccompainedByNotes = '';
            $scope.LasikTempObj.AccompainedByNotesInd = false;
        }
        $scope.OnclickAccFirend = function () {
            $scope.LasikTempObj.AccompainedBy = 'Friend';
            $scope.LasikTempObj.AccompainedByNotes = '';
            $scope.LasikTempObj.AccompainedByNotesInd = false;
        }

        /* ---- Arrival & Accompaniment : the two options are mutually exclusive ---- */
        $scope.OnclickAccompaniedByAdult = function () {
            $scope.LasikTempObj.ArrivalType = 'ACCOMPANIED';
        }

        $scope.OnclickPatientPresentsAlone = function () {
            $scope.LasikTempObj.ArrivalType = 'ALONE';
            $scope.LasikTempObj.AccompainedBy = '';
            $scope.LasikTempObj.AccompainedByNotes = '';
            $scope.LasikTempObj.AccompainedByNotesInd = false;
            $scope.LasikTempObj.AccompainedName = '';
            $scope.LasikTempObj.AccompainedTel = '';
        }

        /* Accompanying adult's phone: 10 digits max, shown as (123) 456-7890 */
        $scope.FormatAccompainedTel = function (value) {
            value = value || '';
            if (!/\d/.test(value)) { return ''; }
            var obj = eHnoteUserDataService.UsMobileFormatChange(value) || {};
            return obj.UsFormatMobileNumber || '';
        };

        $scope.ChangeAccompainedTel = function () {
            $scope.LasikTempObj.AccompainedTel = $scope.FormatAccompainedTel($scope.LasikTempObj.AccompainedTel);
        };

        $scope.morepopoverlist = {
            templateUrl: 'morepopover.html',
        };
        $scope.MainQuickAccessApptTab = "Surgery";
        $scope.ChangeMainAccessTab = function (type) {
            $scope.MainQuickAccessApptTab = type;

        };


        $scope.ChangeFallRisKChecklist = function (bool, MItem) {
            angular.forEach(MItem.OrganizationCheckListDetails, function (item) {
                item.IsChecked = false;
            });
            bool.IsChecked = true;
            MItem.IsChecked = true;
            MItem.Value = bool.Value || '';
            MItem.Score = bool.SubValue;

            $scope.LasikTempObj.FallRiskAssessmentTotalScore = 0;
            angular.forEach($scope.LasikTempObj.OrgASCChecklist, function (Titem) {
                if ((Titem.IsChecked) && (Titem.CheckListId == 162 || Titem.CheckListId == 163 || Titem.CheckListId == 164 || Titem.CheckListId == 165 || Titem.CheckListId == 166 || Titem.CheckListId == 167)) {
                    Titem.Score = Titem.Score || 0;
                    $scope.LasikTempObj.FallRiskAssessmentTotalScore += Titem.Score || 0;
                }
            });

            if ($scope.LasikTempObj.FallRiskAssessmentTotalScore <= 24) {
                $scope.LasikTempObj.FallRiskLevel = 'low Risk';
                $scope.LasikTempObj.ImplementedFallRiskProtocoltype = 'Good basic nursing care taken';
            } else if ($scope.LasikTempObj.FallRiskAssessmentTotalScore >= 25 && $scope.LasikTempObj.FallRiskAssessmentTotalScore <= 44) {
                $scope.LasikTempObj.FallRiskLevel = 'Moderate Risk';
                $scope.LasikTempObj.ImplementedFallRiskProtocoltype = 'Implemented standard fall prevention interventions';
            } else if ($scope.LasikTempObj.FallRiskAssessmentTotalScore >= 45) {
                $scope.LasikTempObj.FallRiskLevel = 'High Risk';
                $scope.LasikTempObj.ImplementedFallRiskProtocoltype = 'Implemented high risk fall prevention interventions';
            }
        };

        $scope.GetEditSurgeryObj = function () {
            return {
                "AppointmentID": $scope.cacheStorageItem.AppointmentId,
                "PatientId": $scope.cacheStorageItem.PatientID,
                "UserId": $scope.UserId,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId,
                "Gender": "",
                "Age": "",
                "Race": "",
                "Height": "",
                "BMI": "",
                "Weight": "",
                "HeightUnitId": 1,
                "HeightUnitName": "cm",
                "WeightUnitId": 2,
                "WeightUnitName": "lbs",
                "basicDetails": false,
                "PatientVitalsArray": [],
                "DiagnosisList": [],
                "IsPreopDiag": false,
                "IsClickSavePreAdmSurgeryBtn": false,
            };
        };

        $scope.subVitallist = function () {
            return [
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 1,
                    "VitalDesc": "Height",
                    "Value": "",
                    "UnitTypeId": 2,
                    "UnitTypeName": "cm",
                    "OrderType": 1
                },
                {
                    "AppointmentVitalDataId": 0,
                    "VitalId": 2,
                    "VitalDesc": "Weight",
                    "Value": "",
                    "UnitTypeId": 2,
                    "UnitTypeName": "lbs",
                    "OrderType": 2
                },
            ]

        }
        $scope.PatientVitalsObj = function () {
            return {
                "VitalSummaryId": 0,
                "AppointmentId": 0,
                "VitalAddDate": moment().format("YYYY-MM-DD"),
                "VitalAddTime": "",
                "DoctorId": 0,
                "UserName": "",
                "DeleteInd": "N",
                "IsEditVitalInd": false,
                "VitalRemarks": "",
                "Vitals": angular.copy($scope.subVitallist()) || []
            };
        }

        var VitalsObj = angular.copy($scope.PatientVitalsObj());
        // $scope.EditSurgeryObj.PatientVitalsArray.push(VitalsObj);
        $scope.HeightUnits = [
            {
                "Unit": "Ft/Inches",
                "UnitId": 1
            },
            {
                "Unit": "cm",
                "UnitId": 2
            }
        ];
        $scope.WeightUnits = [
            {
                "Unit": "kg",
                "UnitId": 1
            },
            {
                "Unit": "lbs",
                "UnitId": 2
            }
        ];
        $scope.Changeheight = function (mitem) {
            var count = 0;
            angular.forEach(mitem, function (witem) {
                if (witem.Value != '') {
                    count++;
                }
            });

            if (count == 2) {
                if (mitem[0].UnitTypeName == "cm" && mitem[1].UnitTypeName == "kg") {
                    let heightinmeters = mitem[0].Value / 100;
                    $scope.EditSurgeryObj.BMI = ((mitem[1].Value / (heightinmeters * heightinmeters))).toFixed(2);
                    if ($scope.EditSurgeryObj.BMI == "NaN") {
                        $scope.EditSurgeryObj.BMI = '';
                    }
                }
                else if (mitem[0].UnitTypeName == "cm" && mitem[1].UnitTypeName == "lbs") {
                    let heightinmeters = mitem[0].Value / 2.54;
                    $scope.EditSurgeryObj.BMI = ((mitem[1].Value * 703) / (heightinmeters * heightinmeters)).toFixed(2);
                    if ($scope.EditSurgeryObj.BMI == "NaN") {
                        $scope.EditSurgeryObj.BMI = '';
                    }
                }
                else if ((mitem[0].UnitTypeName == "Ft/Inches" && mitem[1].UnitTypeName == "kg") || (mitem[0].UnitTypeName == "Ft/Inches" && mitem[1].UnitTypeName == "lbs")) {
                    var heightInInches = '', heightInmeters = '', Incentimeters = '';
                    const parts = mitem[0].Value.split("'");
                    const firstPart = parts[0].trim();
                    if (firstPart.length > 1) {
                        // More than 2 digits: Treat as inches
                        const inches = parseInt(firstPart, 10);
                        heightInInches = inches;
                        Incentimeters = heightInInches * 2.54;
                        heightInmeters = Incentimeters / 100;
                    }
                    else {
                        const feet = parseInt(firstPart, 10);
                        const inches = parts[1] ? parseInt(parts[1].replace('"', '').trim(), 10) : 0;
                        heightInInches = feet * 12 + inches;
                        Incentimeters = heightInInches * 2.54;
                        heightInmeters = Incentimeters / 100;
                    }
                    if (mitem[1].UnitTypeName == "kg") {
                        $scope.EditSurgeryObj.BMI = (mitem[1].Value / (heightInmeters * heightInmeters)).toFixed(2);
                    }
                    else if (mitem[1].UnitTypeName == "lbs") {
                        $scope.EditSurgeryObj.BMI = ((mitem[1].Value * 703) / (heightInInches * heightInInches)).toFixed(2);
                    }
                }
                else {
                    $scope.EditSurgeryObj.BMI = '';
                }
            }
            else {
                $scope.EditSurgeryObj.BMI = '';
            }

        }
        $scope.Changeweight = function (mitem) {
            var count = 0;
            angular.forEach(mitem, function (witem) {
                if (witem.Value != '') {
                    count++;
                }
            });

            if (count == 2) {
                if (mitem[0].UnitTypeName == "cm" && mitem[1].UnitTypeName == "kg") {
                    let heightinmeters = mitem[0].Value / 100;
                    $scope.EditSurgeryObj.BMI = ((mitem[1].Value / (heightinmeters * heightinmeters))).toFixed(2);
                    if ($scope.EditSurgeryObj.BMI == "NaN") {
                        $scope.EditSurgeryObj.BMI = '';
                    }
                }
                else if (mitem[0].UnitTypeName == "cm" && mitem[1].UnitTypeName == "lbs") {
                    let heightinmeters = mitem[0].Value / 2.54;
                    $scope.EditSurgeryObj.BMI = ((mitem[1].Value * 703) / (heightinmeters * heightinmeters)).toFixed(2);
                    if ($scope.EditSurgeryObj.BMI == "NaN") {
                        $scope.EditSurgeryObj.BMI = '';
                    }
                }
                else if ((mitem[0].UnitTypeName == "Ft/Inches" && mitem[1].UnitTypeName == "kg") || (mitem[0].UnitTypeName == "Ft/Inches" && mitem[1].UnitTypeName == "lbs")) {
                    var heightInInches = '', heightInmeters = '';
                    const parts = mitem[0].Value.split("'");
                    const firstPart = parts[0].trim();
                    if (firstPart.length > 1) {
                        // More than 2 digits: Treat as inches
                        const inches = parseInt(firstPart, 10);
                        heightInInches = inches;
                        let Incentimeters = heightInInches * 2.54;
                        heightInmeters = Incentimeters / 100;
                    }
                    else {
                        const feet = parseInt(firstPart, 10);
                        const inches = parts[1] ? parseInt(parts[1].replace('"', '').trim(), 10) : 0;
                        heightInInches = feet * 12 + inches;
                        let Incentimeters = heightInInches * 2.54;
                        heightInmeters = Incentimeters / 100;
                    }
                    if (mitem[1].UnitTypeName == "kg") {
                        $scope.EditSurgeryObj.BMI = (mitem[1].Value / (heightInmeters * heightInmeters)).toFixed(2);
                    }
                    else if (mitem[1].UnitTypeName == "lbs") {
                        $scope.EditSurgeryObj.BMI = ((mitem[1].Value * 703) / (heightInInches * heightInInches)).toFixed(2);
                    }
                }
                else {
                    $scope.EditSurgeryObj.BMI = '';
                }
            }
            else {
                $scope.EditSurgeryObj.BMI = '';
            }

        }

        $scope.onSelectHeight = function (id, item, mitem) {
            if (id == 2) {
                item.UnitTypeId = id;
                item.UnitTypeName = 'cm';
            } else {
                item.UnitTypeId = id;
                item.UnitTypeName = "Ft/Inches";
            }
            var count = 0;
            angular.forEach(mitem, function (witem) {
                if (witem.Value != '') {
                    count++;
                }
            });

            if (count == 2) {
                if (mitem[0].UnitTypeName == "cm" && mitem[1].UnitTypeName == "kg") {
                    let heightinmeters = mitem[0].Value / 100;
                    $scope.EditSurgeryObj.BMI = ((mitem[1].Value / (heightinmeters * heightinmeters))).toFixed(2);
                    if ($scope.EditSurgeryObj.BMI == "NaN") {
                        $scope.EditSurgeryObj.BMI = '';
                    }
                }
                else if (mitem[0].UnitTypeName == "cm" && mitem[1].UnitTypeName == "lbs") {
                    let heightinmeters = mitem[0].Value / 2.54;
                    $scope.EditSurgeryObj.BMI = ((mitem[1].Value * 703) / (heightinmeters * heightinmeters)).toFixed(2);
                    if ($scope.EditSurgeryObj.BMI == "NaN") {
                        $scope.EditSurgeryObj.BMI = '';
                    }
                }
                else if ((mitem[0].UnitTypeName == "Ft/Inches" && mitem[1].UnitTypeName == "kg") || (mitem[0].UnitTypeName == "Ft/Inches" && mitem[1].UnitTypeName == "lbs")) {
                    var heightInInches = '', heightInmeters = '';
                    const parts = mitem[0].Value.split("'");
                    const firstPart = parts[0].trim();
                    if (firstPart.length > 1) {
                        // More than 2 digits: Treat as inches
                        const inches = parseInt(firstPart, 10);
                        heightInInches = inches;
                        let Incentimeters = heightInInches * 2.54;
                        heightInmeters = Incentimeters / 100;
                    }
                    else {
                        const feet = parseInt(firstPart, 10);
                        const inches = parts[1] ? parseInt(parts[1].replace('"', '').trim(), 10) : 0;
                        heightInInches = feet * 12 + inches;
                        let Incentimeters = heightInInches * 2.54;
                        heightInmeters = Incentimeters / 100;
                    }
                    if (mitem[1].UnitTypeName == "kg") {
                        $scope.EditSurgeryObj.BMI = (mitem[1].Value / (heightInmeters * heightInmeters)).toFixed(2);
                    }
                    else if (mitem[1].UnitTypeName == "lbs") {
                        $scope.EditSurgeryObj.BMI = ((mitem[1].Value * 703) / (heightInInches * heightInInches)).toFixed(2);
                    }
                }
                else {
                    $scope.EditSurgeryObj.BMI = '';
                }
            }
            else {
                $scope.EditSurgeryObj.BMI = '';
            }
        };

        $scope.onSelectWeight = function (id, item, mitem) {
            if (id == 2) {
                item.UnitTypeId = id;
                item.UnitTypeName = "lbs";
            } else {
                item.UnitTypeId = id;
                item.UnitTypeName = "kg";
            }
            var count = 0;
            angular.forEach(mitem, function (witem) {
                if (witem.Value != '') {
                    count++;
                }
            });

            if (count == 2) {
                if (mitem[0].UnitTypeName == "cm" && mitem[1].UnitTypeName == "kg") {
                    let heightinmeters = mitem[0].Value / 100;
                    $scope.EditSurgeryObj.BMI = ((mitem[1].Value / (heightinmeters * heightinmeters))).toFixed(2);
                    if ($scope.EditSurgeryObj.BMI == "NaN") {
                        $scope.EditSurgeryObj.BMI = '';
                    }
                }
                else if (mitem[0].UnitTypeName == "cm" && mitem[1].UnitTypeName == "lbs") {
                    let heightinmeters = mitem[0].Value / 2.54;
                    $scope.EditSurgeryObj.BMI = ((mitem[1].Value * 703) / (heightinmeters * heightinmeters)).toFixed(2);
                    if ($scope.EditSurgeryObj.BMI == "NaN") {
                        $scope.EditSurgeryObj.BMI = '';
                    }
                }
                else if ((mitem[0].UnitTypeName == "Ft/Inches" && mitem[1].UnitTypeName == "kg") || (mitem[0].UnitTypeName == "Ft/Inches" && mitem[1].UnitTypeName == "lbs")) {
                    var heightInInches = '', heightInmeters = '';
                    const parts = mitem[0].Value.split("'");
                    const firstPart = parts[0].trim();
                    if (firstPart.length > 1) {
                        // More than 2 digits: Treat as inches
                        const inches = parseInt(firstPart, 10);
                        heightInInches = inches;
                        let Incentimeters = heightInInches * 2.54;
                        heightInmeters = Incentimeters / 100;
                    }
                    else {
                        const feet = parseInt(firstPart, 10);
                        const inches = parts[1] ? parseInt(parts[1].replace('"', '').trim(), 10) : 0;
                        heightInInches = feet * 12 + inches;
                        let Incentimeters = heightInInches * 2.54;
                        heightInmeters = Incentimeters / 100;
                    }
                    if (mitem[1].UnitTypeName == "kg") {
                        $scope.EditSurgeryObj.BMI = (mitem[1].Value / (heightInmeters * heightInmeters)).toFixed(2);
                    }
                    else if (mitem[1].UnitTypeName == "lbs") {
                        $scope.EditSurgeryObj.BMI = ((mitem[1].Value * 703) / (heightInInches * heightInInches)).toFixed(2);
                    }
                }
                else {
                    $scope.EditSurgeryObj.BMI = '';
                }
            }
            else {
                $scope.EditSurgeryObj.BMI = '';
            }
        };

        $scope.UpdateSurgeryDetails = function () {

            $scope.LogObj.LogArray = [];
            var count = 0;
            angular.forEach($scope.EditSurgeryObj.PatientVitalsArray, function (vitem) {
                angular.forEach(vitem.Vitals, function (item) {
                    if (item.VitalId == 2) {

                        $scope.EditSurgeryObj.Weight = item.Value || '';
                    } else {
                        $scope.EditSurgeryObj.Height = item.Value || '';
                    }
                });
            });

            let obj = {
                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                "PatientId": $scope.cacheStorageItem.PatientID,
                "UserId": $scope.UserId,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId,
                "PatientVitalsArray": $scope.EditSurgeryObj.PatientVitalsArray,
                "BMI": $scope.EditSurgeryObj.BMI,
                "Logs": {},
                //"Height": $scope.EditSurgeryObj.Height,
                //"Weight": $scope.EditSurgeryObj.Weight,
                //"HeightUnitId": $scope.EditSurgeryObj.HeightUnitId || null,
                //"HeightUnitName": $scope.EditSurgeryObj.HeightUnitName || '',
                //"WeightUnitId": $scope.EditSurgeryObj.WeightUnitId || '',
                //"WeightUnitName": $scope.EditSurgeryObj.WeightUnitName || ''
            }
            if ($scope.EditSurgeryObj.Height != '' || $scope.LogObj.Height != '' || $scope.EditSurgeryObj.Weight != '' || $scope.LogObj.Weight != '' || $scope.EditSurgeryObj.BMI !== '' || $scope.LogObj.BMI) {
                let ActionType = ''
                let ScreenType = ''
                let ActionDescription = ''
                if ($scope.LogObj.Height == '' && $scope.LogObj.Weight == '' && $scope.LogObj.BMI == '') {
                    ActionType = 'Added';
                } else {
                    ActionType = 'Edited';
                }
                if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
                    ScreenType = 'ASC';
                    //ActionDescription = `BMI In ASC for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
                } else {
                    ScreenType = 'Pre-admission List';
                    //ActionDescription = `BMI In Pre-admission List for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
                }

                //if ($scope.LogObj.Height != $scope.EditSurgeryObj.Height) {
                //    count++;
                //}
                //if ($scope.LogObj.Weight != $scope.EditSurgeryObj.Weight) {
                //    count++;
                //}
                //if ($scope.LogObj.BMI != $scope.EditSurgeryObj.BMI) {
                //    count++;
                //}

                var prevheight = '';
                var newheight = '';
                var prevweight = '';
                var newweight = '';
                var prevBMI = '';
                var newBMI = '';

                if ($scope.LogObj.Height != $scope.EditSurgeryObj.Height) {

                    if ($scope.LogObj.Height) {
                        prevheight = "Height: " + $scope.LogObj.Height + ",";
                    }
                    if ($scope.EditSurgeryObj.Height) {
                        newheight = "Height: " + $scope.EditSurgeryObj.Height + ",";
                    }

                    count++;
                }
                if ($scope.LogObj.Weight != $scope.EditSurgeryObj.Weight) {
                    if ($scope.LogObj.Weight) {
                        prevweight = "Weight: " + $scope.LogObj.Weight + ",";
                    }
                    if ($scope.EditSurgeryObj.Weight) {
                        newweight = "Weight: " + $scope.EditSurgeryObj.Weight + ",";
                    }
                    count++;
                }
                if ($scope.LogObj.BMI != $scope.EditSurgeryObj.BMI) {

                    if ($scope.LogObj.BMI) {
                        prevBMI = "BMI: " + $scope.LogObj.BMI;
                    }
                    if ($scope.EditSurgeryObj.BMI) {
                        newBMI = "BMI: " + $scope.EditSurgeryObj.BMI;
                    }
                    count++;
                }

                var OldActionDescription = '';
                var NewActionDescription = '';
                if (prevheight != '' || prevweight != '' || prevBMI != '') {
                    OldActionDescription = prevheight + " " + prevweight + " " + prevBMI;
                }
                if (newheight != '' || newweight != '' || newBMI != '') {
                    NewActionDescription = newheight + " " + newweight + " " + newBMI;
                }
                if (count !== 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 38,
                        "SubModuleName": "BMI",
                        "ScreenType": ScreenType,
                        "ActionType": ActionType,
                        //"ActionDescription": ActionDescription,
                        "OldActionDescription": OldActionDescription,
                        "NewActionDescription": NewActionDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }
            if ($scope.LogObj.LogArray.length > 0) {
                obj.Logs = $scope.LogObj || {};
            }

            eHnoteSurgeryService.UpdatePatientSurgeryData(obj).then(function (resp) {
                if (resp.data.status === "Success") {
                    $scope.GetOTQuickAccessDetails();
                    $scope.EditSurgeryObj = angular.copy($scope.GetEditSurgeryObj());
                }
            });
        }
        $scope.basicDetailsEditPopover = {
            templateUrl: 'basicDetailsEditPopover.html',
        };
        $scope.UpdateSurgeryData = function () {
            $scope.EditSurgeryObj = angular.copy($scope.GetEditSurgeryObj());

            $scope.EditSurgeryObj.basicDetails = true;
            $scope.EditSurgeryObj.Race = $scope.MainObj.PatientDetails.RaceName;
            $scope.EditSurgeryObj.Age = $scope.MainObj.PatientDetails.Age;
            $scope.EditSurgeryObj.Gender = $scope.MainObj.PatientDetails.Gender;
            $scope.EditSurgeryObj.BMI = $scope.MainObj.PatientData.BMI;

            $scope.EditSurgeryObj.PatientVitalsArray.push(VitalsObj);

            var Heightlist = $filter("filter")($scope.HeightUnits, function (kitem) { return kitem.Unit == $scope.MainObj.PatientData.HeightUnit }, true);
            if (Heightlist.length > 0) {
                $scope.EditSurgeryObj.HeightUnitId = Heightlist[0].UnitId;
            }

            var Weightlist = $filter("filter")($scope.WeightUnits, function (kitem) { return kitem.Unit == $scope.MainObj.PatientData.WeightUnit }, true);
            if (Weightlist.length > 0) {
                $scope.EditSurgeryObj.WeightUnitId = Weightlist[0].UnitId;
            }

            angular.forEach($scope.EditSurgeryObj.PatientVitalsArray, function (vitem) {
                angular.forEach(vitem.Vitals, function (item) {
                    if (item.VitalId == 1) {
                        item.Value = $scope.MainObj.PatientData.Height || '';
                        item.UnitTypeId = $scope.EditSurgeryObj.HeightUnitId || 1;
                        /*item.UnitTypeName = $scope.MainObj.PatientData.HeightUnit || 'cm';*/
                        item.UnitTypeName = $scope.EditSurgeryObj.HeightUnitId === 1 ? 'Ft/Inches' : 'Cms';
                    }
                    if (item.VitalId == 2) {
                        item.Value = $scope.MainObj.PatientData.Weight || '';
                        item.UnitTypeId = $scope.EditSurgeryObj.WeightUnitId || 2;
                        item.UnitTypeName = $scope.MainObj.PatientData.WeightUnit || 'lbs';
                    }
                });
            });
        }
        $scope.quickacccesspopup = function () {
            $scope.ResponsiveQuickAccessOpen = $uibModal.open({
                "templateUrl": "templates/uibpopups/QuickAccesspopupoffcanves.html",
                "backdrop": "static",
                "keyboard": false,
                "scope": $scope,
                "windowClass": "Quickaccessoffcanves",
            });
        };
        $scope.RepsonsiveQuickAccesspPopUpClose = function () {
            if ($scope.ResponsiveQuickAccessOpen) {
                $scope.ResponsiveQuickAccessOpen.dismiss("cancel");
                $scope.ResponsiveQuickAccessOpen = null; // Clear the reference
            }
        }


        $scope.OpenHealthAndPhysicalPopUp = function (item, Type) {
            item = item || '';
            if (Type == 1) {
                item.uibaccordianIndObj.IsHealthPhysicalInd = true;
                item.uibaccordianIndObj.IsPhysicalEvalutionInd = false;
            } else if (Type == 2) {
                item.uibaccordianIndObj.IsPhysicalEvalutionInd = true;
                item.uibaccordianIndObj.IsHealthPhysicalInd = false;
            } else {
                item.uibaccordianIndObj.IsHealthPhysicalInd = true;
                item.uibaccordianIndObj.IsPhysicalEvalutionInd = false;
            }

            var ScreenObj = {
                "IsComingfrm": "ASCQuickAccess",
            }
            $scope.RepsonsiveQuickAccesspPopUpClose(); // for responsive .
            item.TempDocumentDetails = [];
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/ASC/ASCQuickHealthAndPhysicalPopup.html",
                "controller": "USHealthAndPhysicalPopupCtrl",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "MainObj": function () { return angular.copy(item) },
                    "ScreenObj": function () { return angular.copy(ScreenObj) },
                    "allUserList": function () { return angular.copy($scope.allUserList) },
                    "ParentObj": function () { return $scope.ParentObj; },
                },
                "windowClass": "modal__popup--1 bottom-to-top-modal in",

            });
            $scope.mInstanceAdd.result.then(function (resp) {
                $scope.GetOTQuickAccessDetails();
                if ($scope.cacheStorageItem.AppointmentTypeId === 7) {
                    $scope.$broadcast("RefreshPreAdmHPSummaryEvent", '');
                } else {
                    $scope.$broadcast("RefreshPreAdmHPSummaryEvent", 2);
                }
            }, function () { });
        };
        $scope.ShowROSPopUp = function (item) {
            item = item || 'Allergies';

            $scope.MainObj.AllergyItems = $scope.MainObj.AllergyItems || [];
            /* $scope.MainObj.SystemicHistory = $scope.MainObj.SystemicHistory || [];*/
            $scope.MainObj.SurgicalHistory = $scope.MainObj.SurgicalHistory || [];

            if ($scope.MainObj.SystemicHistory.length > 0) {
                angular.forEach($scope.MainObj.SystemicHistory, function (Bitem) {
                    if (Bitem.HistoryId == 20 || Bitem.HistoryId == 59 || Bitem.HistoryId == 166 || Bitem.HistoryId == 127 || Bitem.HistoryId == 132 || Bitem.HistoryId == 33 || Bitem.HistoryId == 41 || Bitem.HistoryId == 67 || Bitem.HistoryId === 70 || Bitem.HistoryId === 74 || Bitem.HistoryId === 78 || Bitem.HistoryId === 90 || Bitem.HistoryId === 95) {
                        Bitem.IsNoshowROS = true;
                    }
                    //$scope.MainObj.SystemicHistory.push(Bitem);
                });
            };

            /*    $scope.MainObj.SystemicOtherData = $scope.MainObj.SystemicOtherData || {};*/
            if ($scope.MainObj.SystemicOtherData != undefined) {
                let respobjSys = $scope.MainObj.SystemicOtherData || {};

                $scope.MainObj.SystemicOtherData.OtherDataId = respobjSys.OtherDataId || 0;

                $scope.MainObj.SystemicOtherData.CardiacNotes = respobjSys.CardiacNotes || '';
                if ($scope.MainObj.SystemicOtherData.CardiacNotes !== '') {
                    $scope.MainObj.SystemicOtherData.showCardiacNotes = true;
                } else {
                    $scope.MainObj.SystemicOtherData.showCardiacNotes = false;
                }

                $scope.MainObj.SystemicOtherData.NeurologicNotes = respobjSys.NeurologicNotes || '';
                if ($scope.MainObj.SystemicOtherData.NeurologicNotes !== '') {
                    $scope.MainObj.SystemicOtherData.showNeurologicNotes = true;
                } else {
                    $scope.MainObj.SystemicOtherData.showNeurologicNotes = false;
                }
                $scope.MainObj.SystemicOtherData.EndocrineNotes = respobjSys.EndocrineNotes || '';
                if ($scope.MainObj.SystemicOtherData.EndocrineNotes !== '') {
                    $scope.MainObj.SystemicOtherData.showEndocrineNotes = true;
                } else {
                    $scope.MainObj.SystemicOtherData.showEndocrineNotes = false;
                }

                $scope.MainObj.SystemicOtherData.GeneralAppearenceNotes = respobjSys.GeneralAppearenceNotes || '';
                if ($scope.MainObj.SystemicOtherData.GeneralAppearenceNotes !== '') {
                    $scope.MainObj.SystemicOtherData.showGeneralAppearenceNotes = true;
                } else {
                    $scope.MainObj.SystemicOtherData.showGeneralAppearenceNotes = false;
                }

                $scope.MainObj.SystemicOtherData.HeentNotes = respobjSys.HeentNotes || '';
                if ($scope.MainObj.SystemicOtherData.HeentNotes !== '') {
                    $scope.MainObj.SystemicOtherData.showHeentNotes = true;
                } else {
                    $scope.MainObj.SystemicOtherData.showHeentNotes = false;
                }

                $scope.MainObj.SystemicOtherData.LungsNotes = respobjSys.LungsNotes || '';
                if ($scope.MainObj.SystemicOtherData.LungsNotes !== '') {
                    $scope.MainObj.SystemicOtherData.showLungsNotes = true;
                } else {
                    $scope.MainObj.SystemicOtherData.showLungsNotes = false;
                }

                $scope.MainObj.SystemicOtherData.PulmonaryNotes = respobjSys.PulmonaryNotes || '';
                if ($scope.MainObj.SystemicOtherData.PulmonaryNotes !== '') {
                    $scope.MainObj.SystemicOtherData.showPulmonaryNotes = true;
                } else {
                    $scope.MainObj.SystemicOtherData.showPulmonaryNotes = false;
                }

                $scope.MainObj.SystemicOtherData.HepaticNotes = respobjSys.HepaticNotes || '';
                if ($scope.MainObj.SystemicOtherData.HepaticNotes !== '') {
                    $scope.MainObj.SystemicOtherData.showHepaticNotes = true;
                } else {
                    $scope.MainObj.SystemicOtherData.showHepaticNotes = false;
                }

                $scope.MainObj.SystemicOtherData.HemeOncNotes = respobjSys.HemeOncNotes || '';
                if ($scope.MainObj.SystemicOtherData.HemeOncNotes !== '') {
                    $scope.MainObj.SystemicOtherData.showHemeOncNotes = true;
                } else {
                    $scope.MainObj.SystemicOtherData.showHemeOncNotes = false;
                }

                $scope.MainObj.SystemicOtherData.NervousSystemNotes = respobjSys.NervousSystemNotes || '';
                if ($scope.MainObj.SystemicOtherData.NervousSystemNotes !== '') {
                    $scope.MainObj.SystemicOtherData.showNervousSystemNotes = true;
                } else {
                    $scope.MainObj.SystemicOtherData.showNervousSystemNotes = false;
                }

                $scope.MainObj.SystemicOtherData.KidneyDiseaseNotes = respobjSys.KidneyDiseaseNotes || '';
                if ($scope.MainObj.SystemicOtherData.KidneyDiseaseNotes !== '') {
                    $scope.MainObj.SystemicOtherData.showKidneyDiseaseNotes = true;
                } else {
                    $scope.MainObj.SystemicOtherData.showKidneyDiseaseNotes = false;
                }

                $scope.MainObj.SystemicOtherData.MusculoSkeletalSystemNotes = respobjSys.MusculoSkeletalSystemNotes || '';
                if ($scope.MainObj.SystemicOtherData.MusculoSkeletalSystemNotes !== '') {
                    $scope.MainObj.SystemicOtherData.showMusculoSkeletalSystemNotes = true;
                } else {
                    $scope.MainObj.SystemicOtherData.showMusculoSkeletalSystemNotes = false;
                }
                $scope.MainObj.SystemicOtherData.PsychosisNotes = respobjSys.PsychosisNotes || '';
                if ($scope.MainObj.SystemicOtherData.PsychosisNotes !== '') {
                    $scope.MainObj.SystemicOtherData.showPsychosisNotes = true;
                } else {
                    $scope.MainObj.SystemicOtherData.showPsychosisNotes = false;
                }

                $scope.MainObj.SystemicOtherData.OthersNotes = respobjSys.OthersNotes || '';
                if ($scope.MainObj.SystemicOtherData.OthersNotes !== '') {
                    $scope.MainObj.SystemicOtherData.showOthersNotes = true;
                } else {
                    $scope.MainObj.SystemicOtherData.showOthersNotes = false;
                }
            }

            var checkInvArray = $filter("filter")($scope.TemplateList, { "CategoryId": 2 }, true);
            var subVisionArray = checkInvArray[0].CategoryDetails;
            //x.SubCategoryId == 37
            //x.SubCategoryId == 72
            subVisionArray = subVisionArray.filter((x) => x.SubCategoryId == 3 || x.SubCategoryId == 4 || x.SubCategoryId == 7 || x.SubCategoryId == 69 || x.SubCategoryId == 73);
            var CategoryList = [];
            CategoryList = subVisionArray || [];
            angular.forEach(CategoryList, function (citem) {
                citem.IsSubCategoryChecked = true;
            });
            // var ScreenObj = "ASC";
            var ScreenObj = {
                "TypeId": 2,
                "TypeName": 'Anesthesia',
                "ScreenType": "ASC",
            }

            $scope.MainObj.PatientImageS3URL = $scope.cacheStorageItem.PatientImageS3URL || "";
            $scope.MainObj.PatientName = $scope.cacheStorageItem.PatientName || "";
            $scope.MainObj.PatientDisplayId = $scope.cacheStorageItem.PatientDisplayId || "";
            $scope.MainObj.Gender = $scope.cacheStorageItem.Gender || "";
            $scope.MainObj.Age = $scope.cacheStorageItem.Age || "";
            $scope.MainObj.PatientDOB = $scope.cacheStorageItem.PatientDOB || "";
            $scope.MainObj.AppointmentTypeId = $scope.cacheStorageItem.AppointmentTypeId || 0;
            $scope.MainObj.PatientVisitId = $scope.cacheStorageItem.PatientVisitId || 0;
            $scope.RepsonsiveQuickAccesspPopUpClose();  // for responsive .
            $scope.modalROSInstance = $uibModal.open({
                "templateUrl": "templates/uibpopups/ROSAddinQuickAccess.html",
                "controller": "USPreAdmROSCtrl",
                "resolve": {
                    "RosObject": function () { return item; },
                    "CategoryList": function () { return CategoryList; },
                    "cacheStorageItem": function () { return angular.copy($scope.MainObj) },
                    "ROSIsNormalArray": function () { return angular.copy($scope.ROSIsNormalArray) },
                    "ScreenObj": function () { return ScreenObj },
                    "ParentObj": function () { return $scope.ParentObj; },
                },
                "backdrop": "static",
                "keyboard": false,
                // "windowClass": "newassessmentspopupuib",
                "windowClass": "modal__popup--1 bottom-to-top-modal in",
            });
            $scope.modalROSInstance.result.then(function (resp) {
                console.log(resp);
                $scope.GetOTQuickAccessDetails();
                if ($scope.cacheStorageItem.AppointmentTypeId === 7) {
                    $scope.$broadcast("RefreshPreAdmHPSummaryEvent", '');
                } else {
                    $scope.$broadcast("RefreshPreAdmHPSummaryEvent", 2);
                }


            }, function () { });
        };
        $scope.OpenVitalsPopUp = function (item) {
            let givenVitalsArray = angular.copy(item.VitalsArray);
            let DocumentDetails = angular.copy(item.DocumentDetails);
            let PerformedByArray = $scope.allUserList.filter((x) => x.RoleId == 1 || x.RoleId == 8 || x.RoleId == 30 || x.RoleId == 72 || x.RoleId == 43 || x.RoleId == 18 || x.RoleId == 66 || x.RoleId == 67);
            let TypeObj = {
                "TypeId": 2,
                "TypeName": "Anesthesia PreAdmission"
            }
            $scope.RepsonsiveQuickAccesspPopUpClose(); // for responsive .
            let modalInstance = $uibModal.open({
                "templateUrl": "templates/ASC/ASCVitalsPopUp.html",
                "controller": "USASCVitalsPopUpCtrl",
                "resolve": {
                    "VitalsArrayList": function () { return givenVitalsArray || []; },
                    "PerformedByArray": function () { return PerformedByArray || []; },
                    "DocumentDetails": function () { return DocumentDetails || []; },
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
                $scope.GetOTQuickAccessDetails();
                if ($scope.cacheStorageItem.AppointmentTypeId === 7) {
                    $scope.$broadcast("RefreshPreAdmHPSummaryEvent", '');
                }
            }, function (cancel) {

            });
        };
        $scope.Quicksummarypopupprofile = function () {
            let LogItem = {
                "SubModuleId": 12,
                "SubModuleName": "Quick summary",
                "ScreenType": "ASC",
                "ActionType": "Accessed",
                "OldActionDescription": "",
                "NewActionDescription": "Quick summary Screen from ASC",
                //  "ActionDescription": `Quick summary Screen from ASC List For Appointment ID : ${$scope.LogObj.AppointmentId}`,
            }
            $scope.AddAuditLog(LogItem);
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/MainQuicksummarypopup.html",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__popup--1 bottom-to-top-modal",
                "resolve": {
                    "cacheStorageItem": function () { return $scope.cacheStorageItem; },
                    "ParentObj": function () { return $scope.ParentObj; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, cacheStorageItem, ParentObj) {
                    $scope.cacheStorageItem = $scope.cacheStorageItem || {};
                    $scope.cacheStorageItem.FullName = cacheStorageItem.PatientName || '';
                    $scope.cacheStorageItem.PatientDisplayId = cacheStorageItem.PatientDisplayId || '';
                    $scope.cacheStorageItem.PatientID = cacheStorageItem.PatientID || 0;
                    $scope.cacheStorageItem.PatientImageS3URL = cacheStorageItem.PatientImageS3URL || '';

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

                    let SubTab = 7;
                    $scope.ParentObj = ParentObj;
                    if (cacheStorageItem.AppointmentTypeId == 4 || cacheStorageItem.AppointmentTypeId == 14) {
                        SubTab = 7;
                    }
                    if (cacheStorageItem.AppointmentTypeId == 7) {
                        SubTab = 2;
                    }
                    let obj = {
                        "SubTab": SubTab,
                        "AppointmentTypeId": cacheStorageItem.AppointmentTypeId,
                        "AppointmentId": cacheStorageItem.AppointmentId,
                        "AscAppointmentId": cacheStorageItem.AscAppointmentId,
                        "SurgeryList": cacheStorageItem.SurgeryList || [],
                        "PreAdmSurgeryList": cacheStorageItem.PreAdmSurgeryList || [],
                        "IsIOJParentOrganization": $scope.ParentObj.IsIOJParentOrganization || false,
                        "PatientID": $scope.cacheStorageItem.PatientID || 0,
                    }
                    console.log("ASCAllvisits called 10");
                    $scope.$broadcast("ASCAllvisits", obj);

                    datapersistanceFactory.set('ASCPastvisits', obj);

                    $scope.uibclose = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                }

            });
        };
        $scope.GetLogObj = function () {
            return {
                "UserId": $scope.UserId || null,
                "OrganizationId": $scope.HospitalId || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "LogArray": [],
                "Height": "",
                "Weight": "",
                "BMI": "",
            }
        }
        $scope.LogObj = $scope.GetLogObj();
        $scope.AddAuditLog = function (selectedItem) {
            $scope.LogObj.LogArray = [];
            let SubModuleName = selectedItem.SubModuleName || "";
            let SubModuleId = selectedItem.SubModuleId || 0;
            let ScreenType = selectedItem.ScreenType || "ASC List";
            let ActionType = selectedItem.ActionType || "Accessed";
            let OldActionDescription = selectedItem.OldActionDescription || "";
            let NewActionDescription = selectedItem.NewActionDescription || "";

            let obj = {
                "LogId": 0,
                "ModuleId": $scope.ModuleId || 2,
                "ModuleName": $scope.ModuleName || "ASC",
                "SubModuleId": SubModuleId,
                "SubModuleName": SubModuleName,
                "ScreenType": ScreenType,
                "ActionType": ActionType,
                "OldActionDescription": OldActionDescription,
                "NewActionDescription": NewActionDescription,
                //"ActionDescription": ActionDescription,
                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
            };
            $scope.LogObj.LogArray.push(obj);
            eHnoteSurgeryService.AddAuditLog($scope.LogObj).then(function (resp) {
                if (resp.data.status == "Success") {
                    console.log('Added');
                }
            });
        }
        $scope.GetOTQuickAccessDetails = function () {

            let req3 = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId,

            };

            eHnoteSurgeryService.GetOTQuickAccessDetails(req3).then(function (resp) {
                if (resp.data.status === "Success") {
                    angular.forEach(resp.data.Vitals, function (item) {
                        let ndate = moment().format("YYYY-MM-DD");
                        let edate = ndate + " " + item.VitalAddTime;
                        item.VitalAddTime = moment(edate, "YYYY-MM-DD HH:mm").format("hh:mm A");
                    });
                    $scope.MainObj.VitalsArray = angular.copy(resp.data.Vitals) || [];
                    if ($scope.MainObj.VitalsArray.length > 0) {
                        $scope.MainObj.VitalsDisplay = $scope.GetDisplayVitalsArray();
                        angular.forEach($scope.MainObj.VitalsArray, function (mainitem, $index) {
                            let TempFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 11 }, true) || [];
                            if (TempFilter.length > 0) {
                                var tempobj = {
                                    "value": TempFilter[0].Value,
                                    "UnitTypeName": TempFilter[0].UnitTypeName
                                }
                            }
                            $scope.MainObj.VitalsDisplay[0].Values.push(tempobj);
                            let pulseFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 12 }, true) || [];
                            if (pulseFilter.length > 0) {
                                var pulseobj = {
                                    "value": pulseFilter[0].Value,
                                    "UnitTypeName": pulseFilter[0].UnitTypeName
                                }
                            }
                            $scope.MainObj.VitalsDisplay[1].Values.push(pulseobj);
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
                            $scope.MainObj.VitalsDisplay[2].Values.push(Bpobj);
                            let RespFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 14 }, true) || [];
                            if (RespFilter.length > 0) {
                                var Respobj = {
                                    "value": RespFilter[0].Value,
                                    "UnitTypeName": RespFilter[0].UnitTypeName
                                }
                            }
                            $scope.MainObj.VitalsDisplay[3].Values.push(Respobj);
                            let Spo2Filter = $filter('filter')(mainitem.Vitals, { "VitalId": 15 }, true) || [];
                            if (Spo2Filter.length > 0) {
                                var Spo2obj = {
                                    "value": Spo2Filter[0].Value,
                                    "UnitTypeName": Spo2Filter[0].UnitTypeName
                                }
                            }
                            $scope.MainObj.VitalsDisplay[4].Values.push(Spo2obj);
                            let BGLFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 8 }, true) || [];
                            if (BGLFilter.length > 0) {
                                var BGLobj = {
                                    "value": BGLFilter[0].Value,
                                    "UnitTypeName": BGLFilter[0].UnitTypeName
                                }
                            }
                            $scope.MainObj.VitalsDisplay[5].Values.push(BGLobj);
                            //let ECGFilter = $filter('filter')(mainitem.Vitals, { "VitalId": 36 }, true) || [];
                            //if (ECGFilter.length > 0) {
                            //    var ECGobj= {
                            //        "value": ECGFilter[0].Value,
                            //        "UnitTypeName": ECGFilter[0].UnitTypeName
                            //    }
                            //}
                            //$scope.MainObj.VitalsDisplay[6].Values.push(ECGobj);
                            var Time = {
                                "value": $scope.MainObj.VitalsArray[$index].VitalAddTime || "",
                                "UnitTypeName": "",
                            }
                            $scope.MainObj.VitalsDisplay[6].Values.push(Time);
                            var performedBy = {
                                "value": $scope.MainObj.VitalsArray[$index].UserName || "",
                                "UnitTypeName": "",
                            }
                            $scope.MainObj.VitalsDisplay[7].Values.push(performedBy);

                            var NotesObj = {
                                "value": $scope.MainObj.VitalsArray[$index].VitalRemarks || "",
                                "UnitTypeName": "",
                            }
                            $scope.MainObj.VitalsDisplay[8].Values.push(NotesObj);
                        });
                    }
                    $scope.MainObj.AllergyItems = angular.copy(resp.data.AllergyItems);


                    if (resp.data.SystemicHistory.length > 0) {
                        angular.forEach(resp.data.SystemicHistory, function (Bitem) {
                            if (Bitem.HistoryId == 20 || Bitem.HistoryId == 59 || Bitem.HistoryId == 166 || Bitem.HistoryId == 127 || Bitem.HistoryId == 132 || Bitem.HistoryId == 33 || Bitem.HistoryId == 41 || Bitem.HistoryId == 67 || Bitem.HistoryId === 70 || Bitem.HistoryId === 74 || Bitem.HistoryId === 78 || Bitem.HistoryId === 90 || Bitem.HistoryId === 95) {
                                Bitem.IsNoshowROS = true;
                            }
                            $scope.MainObj.SystemicHistory.push(Bitem);
                        });
                    };

                    /*$scope.MainObj.SystemicHistory = angular.copy(resp.data.SystemicHistory);*/

                    $scope.MainObj.SurgicalHistory = angular.copy(resp.data.SurgicalHistory);
                    $scope.MainObj.CurrentSystemicMedicationsHistory = angular.copy(resp.data.CurrentSystemicMedicationList);
                    $scope.MainObj.CurrentEyeMedications = angular.copy(resp.data.CurrentEyeMedicationList);
                    $scope.MainObj.DocumentDetails = angular.copy(resp.data.DocumentDetails);
                    $scope.MainObj.ROSOverAllRemarks = resp.data.RosOverallRemarks || "";
                    $scope.MainObj.LabInvestigation = resp.data.LabInvestigation || "";
                    $scope.MainObj.SystemicHistory = resp.data.SystemicHistory || [];
                    $scope.MainObj.LifestyleDetail = resp.data.LifestyleDetail || [];
                    $scope.MainObj.PreAdmission = resp.data.PreAdmission || '';

                    $scope.MainObj.PhysicalEvaluationArray = resp.data.PhysicalEvaluationDetails || [];

                    $scope.diabetesString = '';
                    if (!$scope.ParentObj.IsIOJParentOrganization) {
                        let diabetesarray = [];
                        const diabetesIds = [
                            640, 641, 804, 808, 926, 927, 966, 587, 874, 953, 697, 696
                        ];
                        if ($scope.MainObj.SystemicHistory.length > 0) {
                            angular.forEach($scope.MainObj.SystemicHistory, function (item) {
                                if (diabetesIds.includes(item.HistoryId)) {
                                    $scope.hasDiabetes = true;
                                    diabetesarray.push(item.HistoryName);
                                }
                            });
                        }

                        $scope.diabetesString = diabetesarray.join(',') || '';
                    }
                    /*  $scope.MainObj.SystemicOtherData = angular.copy(resp.data.SystemicOtherData) || '';*/
                    if (resp.data.SystemicOtherData != undefined) {
                        let respobjSys = resp.data.SystemicOtherData || {};

                        $scope.MainObj.SystemicOtherData.OtherDataId = respobjSys.OtherDataId || 0;

                        $scope.MainObj.SystemicOtherData.CardiacNotes = respobjSys.CardiacNotes || '';
                        if ($scope.MainObj.SystemicOtherData.CardiacNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showCardiacNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showCardiacNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.NeurologicNotes = respobjSys.NeurologicNotes || '';
                        if ($scope.MainObj.SystemicOtherData.NeurologicNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showNeurologicNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showNeurologicNotes = false;
                        }
                        $scope.MainObj.SystemicOtherData.EndocrineNotes = respobjSys.EndocrineNotes || '';
                        if ($scope.MainObj.SystemicOtherData.EndocrineNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showEndocrineNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showEndocrineNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.GeneralAppearenceNotes = respobjSys.GeneralAppearenceNotes || '';
                        if ($scope.MainObj.SystemicOtherData.GeneralAppearenceNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showGeneralAppearenceNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showGeneralAppearenceNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.HeentNotes = respobjSys.HeentNotes || '';
                        if ($scope.MainObj.SystemicOtherData.HeentNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showHeentNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showHeentNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.LungsNotes = respobjSys.LungsNotes || '';
                        if ($scope.MainObj.SystemicOtherData.LungsNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showLungsNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showLungsNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.PulmonaryNotes = respobjSys.PulmonaryNotes || '';
                        if ($scope.MainObj.SystemicOtherData.PulmonaryNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showPulmonaryNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showPulmonaryNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.HepaticNotes = respobjSys.HepaticNotes || '';
                        if ($scope.MainObj.SystemicOtherData.HepaticNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showHepaticNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showHepaticNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.HemeOncNotes = respobjSys.HemeOncNotes || '';
                        if ($scope.MainObj.SystemicOtherData.HemeOncNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showHemeOncNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showHemeOncNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.NervousSystemNotes = respobjSys.NervousSystemNotes || '';
                        if ($scope.MainObj.SystemicOtherData.NervousSystemNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showNervousSystemNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showNervousSystemNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.KidneyDiseaseNotes = respobjSys.KidneyDiseaseNotes || '';
                        if ($scope.MainObj.SystemicOtherData.KidneyDiseaseNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showKidneyDiseaseNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showKidneyDiseaseNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.MusculoSkeletalSystemNotes = respobjSys.MusculoSkeletalSystemNotes || '';
                        if ($scope.MainObj.SystemicOtherData.MusculoSkeletalSystemNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showMusculoSkeletalSystemNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showMusculoSkeletalSystemNotes = false;
                        }
                        $scope.MainObj.SystemicOtherData.PsychosisNotes = respobjSys.PsychosisNotes || '';
                        if ($scope.MainObj.SystemicOtherData.PsychosisNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showPsychosisNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showPsychosisNotes = false;
                        }

                        $scope.MainObj.SystemicOtherData.OthersNotes = respobjSys.OthersNotes || '';
                        if ($scope.MainObj.SystemicOtherData.OthersNotes !== '') {
                            $scope.MainObj.SystemicOtherData.showOthersNotes = true;
                        } else {
                            $scope.MainObj.SystemicOtherData.showOthersNotes = false;
                        }
                    }

                    if (resp.data.PreAdmission.CardioVascular != null) {
                        $scope.MainObj.CardioVascularObj.ECG = resp.data.PreAdmission.CardioVascular.CardioECG || "";
                        $scope.MainObj.CardioVascularObj.ECGUnits = resp.data.PreAdmission.CardioVascular.CardioECGUnits || "BPM";
                        $scope.MainObj.CardioVascularObj.Notes = resp.data.PreAdmission.CardioVascular.CardioNotes || "";
                    }

                    $scope.MainObj.ReconciliationReviewedById = resp.data.ReconciliationReviewedById || '';

                    $scope.MainObj.PatientData = resp.data.LatestAppointmentVital || '';
                    $scope.MainObj.AllergyRemarks = resp.data.AllergyRemarks || '';
                    $scope.MainObj.SurgicalRemarks = resp.data.SurgicalRemarks || '';
                    $scope.MainObj.CurrentEyeRemarks = resp.data.CurrentEyeRemarks || '';
                    $scope.MainObj.CurrentSystemicRemarks = resp.data.CurrentSystemicRemarks || '';
                    $scope.MainObj.SystemicHistoryRemarks = resp.data.SystemicHistoryRemarks || '';
                    $scope.MainObj.LifestyleHistoryRemarks = resp.data.LifestyleHistoryRemarks || '';
                    $scope.MainObj.RespiratoryRemarks = resp.data.RespiratoryRemarks || '';
                    $scope.EditSurgeryObj.DiagnosisList = resp.data.DiagnosisList || [];
                    $scope.MainObj.DiagnosisList = resp.data.DiagnosisList || [];


                    resp.data.CurrentAppointmentVital = resp.data.CurrentAppointmentVital || '';

                    resp.data.CurrentAppointmentVital.Height = resp.data.CurrentAppointmentVital.Height || '';
                    resp.data.CurrentAppointmentVital.Weight = resp.data.CurrentAppointmentVital.Weight || '';
                    resp.data.CurrentAppointmentVital.BMI = resp.data.CurrentAppointmentVital.BMI || '';

                    resp.data.LatestAppointmentVital.Height = resp.data.LatestAppointmentVital.Height || '';
                    resp.data.LatestAppointmentVital.HeightUnit = resp.data.LatestAppointmentVital.HeightUnit || '';
                    resp.data.LatestAppointmentVital.Weight = resp.data.LatestAppointmentVital.Weight || '';
                    resp.data.LatestAppointmentVital.BMI = resp.data.LatestAppointmentVital.BMI || '';
                    resp.data.LatestAppointmentVital.WeightUnit = resp.data.LatestAppointmentVital.WeightUnit || '';

                    if (resp.data.CurrentAppointmentVital != "" && ($scope.cacheStorageItem.AppointmentId == resp.data.CurrentAppointmentVital.AppointmentId)) {
                        if (resp.data.CurrentAppointmentVital.Height !== "" || resp.data.CurrentAppointmentVital.Weight !== "" || resp.data.CurrentAppointmentVital.BMI !== '') {
                            $scope.MainObj.PatientData.Height = resp.data.CurrentAppointmentVital.Height || '';
                            $scope.MainObj.PatientData.HeightUnit = resp.data.CurrentAppointmentVital.HeightUnit || '';
                            $scope.MainObj.PatientData.Weight = resp.data.CurrentAppointmentVital.Weight || '';
                            $scope.MainObj.PatientData.WeightUnit = resp.data.CurrentAppointmentVital.WeightUnit || '';
                            $scope.MainObj.PatientData.BMI = resp.data.CurrentAppointmentVital.BMI || '';

                            $scope.LogObj.Height = resp.data.CurrentAppointmentVital.Height || '';
                            $scope.LogObj.Weight = resp.data.CurrentAppointmentVital.Weight || '';
                            $scope.LogObj.BMI = resp.data.CurrentAppointmentVital.BMI || '';
                        } else {
                            $scope.MainObj.PatientData.Height = resp.data.LatestAppointmentVital.Height || '';
                            $scope.MainObj.PatientData.HeightUnit = resp.data.LatestAppointmentVital.HeightUnit || '';
                            $scope.MainObj.PatientData.Weight = resp.data.LatestAppointmentVital.Weight || '';
                            $scope.MainObj.PatientData.WeightUnit = resp.data.LatestAppointmentVital.WeightUnit || '';
                            $scope.MainObj.PatientData.BMI = resp.data.LatestAppointmentVital.BMI || '';
                        }
                    }
                    else {
                        $scope.MainObj.PatientData.Height = resp.data.LatestAppointmentVital.Height || '';
                        $scope.MainObj.PatientData.HeightUnit = resp.data.LatestAppointmentVital.HeightUnit || '';
                        $scope.MainObj.PatientData.Weight = resp.data.LatestAppointmentVital.Weight || '';
                        $scope.MainObj.PatientData.WeightUnit = resp.data.LatestAppointmentVital.WeightUnit || '';
                        $scope.MainObj.PatientData.BMI = resp.data.LatestAppointmentVital.BMI || '';
                    }


                    $scope.QuickAccesAllegies = angular.copy(resp.data.AllergyItems) || [];
                    if ($scope.QuickAccesAllegies.length > 0) {
                        let QuickAccesAllegies = $scope.QuickAccesAllegies || [];
                        eHnoteMasterDataService.addAllergiesShownQuickAccess(QuickAccesAllegies);
                    } else {
                        var Algobj = {};
                        eHnoteMasterDataService.addAllergiesShownQuickAccess(Algobj);
                    }


                    if ($scope.QuickAccesAllegies.length > 0) {
                        $scope.QuickAccesAllegies = $filter("filter")($scope.QuickAccesAllegies, function (item) {
                            return item.StatusId == 1 || item.AllergyId == 1 || item.AllergyId == 2;
                        }) || [];
                    }
                    // accordian open/close statuses
                    if ($scope.MainObj.AllergyItems.length > 0) {
                        $scope.AccordianStatusObj.IsAllergyOpen = true;
                    }
                    if ($scope.MainObj.SystemicHistory.length > 0) {
                        $scope.AccordianStatusObj.IsSystemicOpen = true;
                    }
                    if ($scope.MainObj.SurgicalHistory.length > 0) {
                        $scope.AccordianStatusObj.IsSurgicalOpen = true;
                    }
                    let CurrentSystemicMedicationsHistory = $filter('filter')($scope.MainObj.CurrentSystemicMedicationsHistory, { 'MedicationLocationTypeId': 2 }, true) || [];
                    if (CurrentSystemicMedicationsHistory.length > 0) {
                        $scope.AccordianStatusObj.IsCurrentSystemicOpen = true;
                    }
                    let CurrentEyeMedications = $filter('filter')($scope.MainObj.CurrentSystemicMedicationsHistory, { 'MedicationLocationTypeId': 1 }, true) || [];
                    if (CurrentEyeMedications.length > 0) {
                        $scope.AccordianStatusObj.IsCurrentEyeOpen = true;
                    }


                }





                var TempFilter1 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 506 }, true);
                if (TempFilter1.length > 0) {
                    $scope.Lab.isHGB = true;
                } else {
                    $scope.Lab.isHGB = false;
                }
                var TempFilter2 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 840 }, true);
                if (TempFilter2.length > 0) {
                    $scope.Lab.isHCT = true;
                } else {
                    $scope.Lab.isHCT = false;
                }
                var TempFilter3 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 841 }, true);
                if (TempFilter3.length > 0) {
                    $scope.Lab.isWBC = true;
                } else {
                    $scope.Lab.isWBC = false;
                }
                var TempFilter4 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 842 }, true);
                if (TempFilter4.length > 0) {
                    $scope.Lab.isRBC = true;
                }
                else {
                    $scope.Lab.isRBC = false;
                }
                var TempFilter5 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 843 }, true);
                if (TempFilter5.length > 0) {
                    $scope.Lab.isA1C = true;
                } else {
                    $scope.Lab.isA1C = false;
                }
                var TempFilter6 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 844 }, true);
                if (TempFilter6.length > 0) {
                    $scope.Lab.isCreatinine = true;
                } else {
                    $scope.Lab.isCreatinine = false;
                }
                var TempFilter7 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 863 }, true);
                if (TempFilter7.length > 0) {
                    $scope.Lab.isUA = true;
                } else {
                    $scope.Lab.isUA = false;
                }
                var TempFilter8 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 864 }, true);
                if (TempFilter8.length > 0) {
                    $scope.Lab.isBloodAvailable = true;
                } else {
                    $scope.Lab.isBloodAvailable = false;
                }
                var TempFilter9 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 865 }, true);
                if (TempFilter9.length > 0) {
                    $scope.Lab.isPretransfusion = true;
                } else {
                    $scope.Lab.isPretransfusion = false;
                }
                var TempFilter10 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 845 }, true);
                if (TempFilter10.length > 0) {
                    $scope.Lab.isRBS = true;
                }
                else {
                    $scope.Lab.isRBS = false;
                }
                var TempFilter11 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 846 }, true);
                if (TempFilter11.length > 0) {
                    $scope.Lab.isFBS = true;
                } else {
                    $scope.Lab.isFBS = false;
                }
                var TempFilter12 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 847 }, true);
                if (TempFilter12.length > 0) {
                    $scope.Lab.isPBBS = true;
                } else {
                    $scope.Lab.isPBBS = false;
                }
                var TempFilter13 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 848 }, true);
                if (TempFilter13.length > 0) {

                    $scope.Lab.isPLBS = true;
                } else {
                    $scope.Lab.isPLBS = false;
                }
                var TempFilter14 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 849 }, true);
                if (TempFilter14.length > 0) {
                    $scope.Lab.isPT = true;
                } else {
                    $scope.Lab.isPT = false;
                }
                var TempFilter15 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 850 }, true);
                if (TempFilter15.length > 0) {
                    $scope.Lab.isPTT = true;
                } else {
                    $scope.Lab.isPTT = false;
                }
                var TempFilter16 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 851 }, true);
                if (TempFilter16.length > 0) {
                    $scope.Lab.isLFS = true;
                } else {
                    $scope.Lab.isLFS = false;
                }
                var TempFilter17 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 2254 }, true);
                if (TempFilter17.length > 0) {
                    $scope.Lab.isBloodPlate = true;
                } else {
                    $scope.Lab.isBloodPlate = false;
                }



                if ($scope.Lab.isHGB == false && $scope.Lab.isHCT == false && $scope.Lab.isWBC == false && $scope.Lab.isRBC == false && $scope.Lab.isA1C == false && $scope.Lab.isCreatinine == false && $scope.Lab.isRBS == false && $scope.Lab.isFBS == false && $scope.Lab.isPBBS == false && $scope.Lab.isPLBS == false && $scope.Lab.isUA == false && $scope.Lab.isBloodAvailable == false &&
                    $scope.Lab.isPretransfusion == false && $scope.Lab.isPT == false && $scope.Lab.isPTT == false && $scope.Lab.isLFS == false && $scope.Lab.isBloodPlate == false) {
                    $scope.Lab.AllFields = false;
                } else {
                    $scope.Lab.AllFields = true;
                    $scope.AccordianStatusObj.IsHPLabOpen = true;
                }




                var TempChem1 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 852 }, true);
                if (TempChem1.length > 0) {
                    $scope.Chemical.isSodium = true;
                }
                var TempChem2 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 853 }, true);
                if (TempChem2.length > 0) {
                    $scope.Chemical.isPotassium = true;
                }
                var TempChem3 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 854 }, true);
                if (TempChem3.length > 0) {
                    $scope.Chemical.isChloride = true;
                }
                var TempChem4 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 855 }, true);
                if (TempChem4.length > 0) {
                    $scope.Chemical.isCarbondioxide = true;
                }

                var TempChem5 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 856 }, true);
                if (TempChem5.length > 0) {
                    $scope.Chemical.isglucose = true;
                }
                var TempChem6 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 866 }, true);
                if (TempChem6.length > 0) {
                    $scope.Chemical.isCreatininely = true;
                }
                var TempChem7 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 857 }, true);
                if (TempChem7.length > 0) {
                    $scope.Chemical.isUrea = true;
                }
                var TempChem8 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 858 }, true);
                if (TempChem8.length > 0) {
                    $scope.Chemical.isLDL = true;
                }

                var TempChem9 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 859 }, true);
                if (TempChem9.length > 0) {
                    $scope.Chemical.isHDL = true;
                }
                var TempChem10 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 860 }, true);
                if (TempChem10.length > 0) {
                    $scope.Chemical.isTriglycerides = true;
                }
                var TempChem11 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 861 }, true);
                if (TempChem11.length > 0) {
                    $scope.Chemical.isAlbumin = true;
                }
                var TempChem12 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 862 }, true);
                if (TempChem12.length > 0) {
                    $scope.Chemical.isTotalProtein = true;
                }

                if ($scope.Chemical.isSodium == false && $scope.Chemical.isPotassium == false && $scope.Chemical.isChloride == false && $scope.Chemical.isCarbondioxide == false && $scope.Chemical.isglucose == false && $scope.Chemical.isCreatininely == false && $scope.Chemical.isUrea == false && $scope.Chemical.isLDL == false &&
                    $scope.Chemical.isHDL == false && $scope.Chemical.isTriglycerides == false && $scope.Chemical.isAlbumin == false && $scope.Chemical.isTotalProtein == false) {
                    $scope.ChemicalHistoryInd = false;
                } else {
                    $scope.ChemicalHistoryInd = true;
                    $scope.AccordianStatusObj.IsHPChemistryOpen = true;
                }
                if ($scope.MainObj.PreAdmission !== '') {
                    if ($scope.MainObj.PreAdmission.Airway !== undefined) {
                        $scope.MainObj.PreAdmission.Airway.DentitionList = $scope.MainObj.PreAdmission.Airway.DentitionList || [];
                    }

                    $scope.MainObj.PhysicalNeurologicNotes = $scope.MainObj.PreAdmission.PhysicalNeurologicNotes || '';
                    $scope.MainObj.PhysicalGeneralNotes = $scope.MainObj.PreAdmission.PhysicalGeneralNotes || '';
                    $scope.MainObj.PhysicalCardiocNotes = $scope.MainObj.PreAdmission.PhysicalCardiocNotes || '';
                    $scope.MainObj.PhysicalHepaticNotes = $scope.MainObj.PreAdmission.PhysicalHepaticNotes || '';
                    $scope.MainObj.PhysicalPulmonaryNotes = $scope.MainObj.PreAdmission.PhysicalPulmonaryNotes || '';
                }


                if ($scope.MainObj.PreAdmission.Airway !== undefined) {
                    $scope.MainObj.PreAdmission.AirIsNormal = $scope.MainObj.PreAdmission.Airway.IsNormal;
                    $scope.MainObj.PreAdmission.AirROMTMS = $scope.MainObj.PreAdmission.Airway.ROMTMS;
                    $scope.MainObj.PreAdmission.AirROMNECKAP = $scope.MainObj.PreAdmission.Airway.ROMNECKAP;
                    $scope.MainObj.PreAdmission.AirROMNECKAP = $scope.MainObj.PreAdmission.Airway.ROMNECKAP;
                    $scope.MainObj.PreAdmission.AirClass = $scope.MainObj.PreAdmission.Airway.Class;
                    $scope.MainObj.PreAdmission.AirROMNECKLAT = $scope.MainObj.PreAdmission.Airway.ROMNECKLAT;
                    $scope.MainObj.PreAdmission.AirNotes = $scope.MainObj.PreAdmission.Airway.Notes;
                    $scope.MainObj.PreAdmission.ChemistryNotes = $scope.MainObj.PreAdmission.Airway.ChemistryNotes;

                    $scope.MainObj.Airway.MouthOpening = $scope.MainObj.PreAdmission.Airway.MouthOpening || '';
                    $scope.MainObj.Airway.TMDistance = $scope.MainObj.PreAdmission.Airway.TMDistance || '';
                    $scope.MainObj.Airway.UnableToAssess = $scope.MainObj.PreAdmission.Airway.UnableToAssess || false;
                    $scope.MainObj.Airway.Tracheostomy = $scope.MainObj.PreAdmission.Airway.Tracheostomy || false;
                }

                if (Object.keys($scope.MainObj.PreAdmission).length !== 0) {
                    $scope.MainObj.PreAdmission.AirIsNormal = $scope.MainObj.PreAdmission.AirIsNormal || false;
                    $scope.MainObj.PreAdmission.AirROMTMS = $scope.MainObj.PreAdmission.AirROMTMS || '';
                    $scope.MainObj.PreAdmission.AirROMNECKAP = $scope.MainObj.PreAdmission.AirROMNECKAP || '';
                    $scope.MainObj.PreAdmission.AirClass = $scope.MainObj.PreAdmission.AirClass || '';
                    $scope.MainObj.PreAdmission.AirROMNECKLAT = $scope.MainObj.PreAdmission.AirROMNECKLAT || '';
                    $scope.MainObj.PreAdmission.Dentition = $scope.MainObj.PreAdmission.Dentition || '';
                    $scope.MainObj.PreAdmission.AirNotes = $scope.MainObj.PreAdmission.AirNotes || '';
                    $scope.MainObj.PreAdmission.ChemistryNotes = $scope.MainObj.PreAdmission.ChemistryNotes || '';

                    if (!($scope.MainObj.PreAdmission.AirIsNormal == true || $scope.MainObj.PreAdmission.AirROMTMS != '' || $scope.MainObj.PreAdmission.AirROMNECKAP != '' || $scope.MainObj.PreAdmission.AirROMNECKLAT != '' || $scope.MainObj.PreAdmission.AirClass != '' || $scope.MainObj.PreAdmission.Airway.DentitionList.length >
                        0 ||
                        ($scope.MainObj.PreAdmission.Dentition !== '' && $scope.MainObj.PreAdmission.Dentition !== null) ||
                        $scope.MainObj.PreAdmission.AirNotes != '')
                    ) {
                        $scope.HealthPhysical.AirwaysInd = false;
                    } else {
                        $scope.HealthPhysical.AirwaysInd = true;
                        $scope.AccordianStatusObj.IsHPAirwaysOpen = true;
                    }

                }


                if ($scope.MainObj.PreAdmission !== '') {
                    if ($scope.MainObj.PreAdmission.CardioVascular !== undefined) {
                        $scope.MainObj.PreAdmission.ECGValue = $scope.MainObj.PreAdmission.CardioVascular.CardioECG || ''
                        $scope.MainObj.PreAdmission.ECGNotes = $scope.MainObj.PreAdmission.CardioVascular.CardioNotes || ''
                        $scope.MainObj.PreAdmission.ECGUnits = $scope.MainObj.PreAdmission.CardioVascular.CardioECGUnits || ''
                    }
                };

                if ($scope.MainObj.PreAdmission.ECGValue != '' || $scope.MainObj.PreAdmission.ECGNotes != '') {
                    $scope.AccordianStatusObj.IsHPECGOpen = true;
                }

                //CNS

                var TempCNS = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 115 }, true);
                if (TempCNS.length > 0) {
                    $scope.CNS.isIndicator = true;
                }

                //Respiratory



                var TempRespi = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 116 }, true);
                if (TempRespi.length > 0) {
                    $scope.RespiratoryObj.IsResp = true;
                }

                var TempRespi1 = $filter('filter')($scope.MainObj.LabInvestigation, { 'ProcedureId': 867 }, true);
                if (TempRespi1.length > 0) {
                    $scope.RespiratoryObj.IsCXR = true;
                }

                var TempRespi2 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 118 }, true);
                if (TempRespi2.length > 0) {
                    $scope.RespiratoryObj.IsAsthma = true;
                }

                var TempRespi3 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 119 }, true);
                if (TempRespi3.length > 0) {
                    $scope.RespiratoryObj.IsWheezing = true;
                }

                var TempRespi4 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 120 }, true);
                if (TempRespi4.length > 0) {
                    $scope.RespiratoryObj.IsCOPD = true;
                }
                var TempRespi5 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 121 }, true);
                if (TempRespi5.length > 0) {
                    $scope.RespiratoryObj.IsBreathing = true;
                }
                var TempRespi6 = $filter('filter')($scope.MainObj.SystemicHistory, { 'HistoryId': 122 }, true);
                if (TempRespi6.length > 0) {
                    $scope.RespiratoryObj.IsLungsclearance = true;
                }


                if ($scope.RespiratoryObj.IsResp == false && $scope.RespiratoryObj.IsCXR == false && $scope.RespiratoryObj.IsAsthma == false && $scope.RespiratoryObj.IsWheezing == false && $scope.RespiratoryObj.IsCOPD == false && $scope.RespiratoryObj.IsBreathing == false && $scope.RespiratoryObj.IsLungsclearance == false) {
                    $scope.RespiratoryObj.IsResIndicator = false;
                } else {
                    $scope.RespiratoryObj.IsResIndicator = true;
                    $scope.AccordianStatusObj.IsHPRespiratoryOpen = true;
                }


                var TempRespi6 = $filter('filter')($scope.MainObj.LifestyleDetail, { 'HistoryId': 122 }, true);
                if (TempRespi6.length > 0) {
                    $scope.RespiratoryObj.IsLungsclearance = true;
                }


                if ($scope.MainObj.LifestyleDetail.length > 0) {
                    angular.forEach($scope.MainObj.LifestyleDetail, function (Litem) {
                        Litem.AlcoholDurationDate = Litem.AlcoholDurationDate || null;
                        Litem.DrugDurationDate = Litem.DrugDurationDate || null;
                        if (Litem.AlcoholType == '' && Litem.DrugType == '' && Litem.PsychisType == '' && Litem.SmokingType == '' && Litem.Remarks == '') {
                            $scope.HealthPhysical.LifeStyelInd = false;
                        } else {
                            $scope.HealthPhysical.LifeStyelInd = true;
                            $scope.AccordianStatusObj.IsHPSocialOpen = true;
                        }
                    });
                } else {
                    $scope.HealthPhysical.LifeStyelInd = false;
                }
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
        $scope.GetSurgeryStaffListDetails = function () {

            var obj = {
                "AppointmentID": $scope.cacheStorageItem.AppointmentId,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId
            };

            eHnoteSurgeryService.GetASCAppointmentSurgeryStaff(obj).then(function (response) {
                if (response.data.Status === "Success") {
                    $scope.ApptSurgeryList = angular.copy(response.data.SurgeryList);
                    $scope.ExternalPreadmissionDocuments = angular.copy(response.data.DocumentDetails);
                    $scope.SurgeryDiagnosisObj = angular.copy($scope.GetSurgeryDiagnosisObj());

                    $scope.SurgeryDiagnosisObj.PreAdmissionStatus = response.data.PreAdmissionStatus || "";
                    $scope.SurgeryDiagnosisObj.CardialogistStatus = response.data.CardialogistStatus || "";
                    $scope.SurgeryDiagnosisObj.ReasonForVisit = response.data.ReasonForVisit || "";
                    if (response.data.AppointmentVisitReasonId) {
                        let vistResonId = response.data.AppointmentVisitReasonId || 0;
                        eHnoteMasterDataService.setIsShowYagTemplate(vistResonId);
                        $scope.IsShowYagTemplate = eHnoteMasterDataService.getIsShowYagTemplate();
                    }


                    if ($scope.ApptSurgeryList.length > 0) {
                        angular.forEach($scope.ApptSurgeryList, function (item) {

                            if ($scope.ApptSurgeryList[0].DiagnosisList.length > 0) {
                                $scope.SurgeryDiagnosisObj.DiagnosisName = $scope.ApptSurgeryList[0].DiagnosisList[0].DiagnosisName;
                            }
                            $scope.SurgeryDiagnosisObj.SurgeryEyeStatusId = $scope.ApptSurgeryList[0].SurgeryEyeStatusId || 0;
                            $scope.SurgeryDiagnosisObj.SurgeryEyeStatusName = $scope.ApptSurgeryList[0].SurgeryEyeStatusName || '';
                            $scope.SurgeryDiagnosisObj.CPTCode = $scope.ApptSurgeryList[0].CPTCode;
                            $scope.SurgeryDiagnosisObj.SurgeryName = $scope.ApptSurgeryList[0].SurgeryName;
                            $scope.SurgeryDiagnosisObj.OrganId = $scope.ApptSurgeryList[0].OrganId || "";
                            $scope.SurgeryDiagnosisObj.AscAppointmentDate = $scope.ApptSurgeryList[0].AscAppointmentDate;
                            $scope.SurgeryDiagnosisObj.FirstFollowupDate = $scope.ApptSurgeryList[0].FirstFollowupDate;
                            $scope.SurgeryDiagnosisObj.SecondFollowupDate = $scope.ApptSurgeryList[0].SecondFollowupDate;
                            $scope.SurgeryDiagnosisObj.ThirdFollowupDate = $scope.ApptSurgeryList[0].ThirdFollowupDate;

                            item.AnesthetistId = item.AnesthetistId || null;
                            item.NurseId = item.NurseId || null;
                            item.SurgeonId = item.SurgeonId || null;
                            item.InternalCoManagerId = item.InternalCoManagerId || null;
                            item.ExternalCoManagerId = item.ExternalCoManagerId || null;
                            item.ExternalCoManagerName = item.ExternalCoManagerName || "";

                            if (item.AnesthetistId != null) {
                                let Anesthesistlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.AnesthetistId }, true);
                                if (Anesthesistlist.length > 0) {
                                    $scope.ApptSurgeryList[0].AnesthesistName = Anesthesistlist[0].FullName;
                                    $scope.SurgeryDiagnosisObj.AnesthesistName = Anesthesistlist[0].UserFullName || "";

                                } else {
                                    $scope.ApptSurgeryList[0].AnesthesistName = '';
                                }
                            }

                            if (item.NurseId != null) {
                                let Nurselist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.NurseId }, true);
                                if (Nurselist.length > 0) {
                                    $scope.ApptSurgeryList[0].NurseName = Nurselist[0].FullName;
                                    $scope.SurgeryDiagnosisObj.NurseName = Nurselist[0].FullName;
                                } else {
                                    $scope.ApptSurgeryList[0].NurseName = '';
                                }
                            }

                            if (item.SurgeonId != null) {
                                let Surgeonlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.SurgeonId }, true);
                                if (Surgeonlist.length > 0) {
                                    $scope.ApptSurgeryList[0].SurgeonName = Surgeonlist[0].FullName;
                                    $scope.SurgeryDiagnosisObj.SurgeonName = Surgeonlist[0].UserFullName;

                                } else {
                                    $scope.ApptSurgeryList[0].SurgeonName = '';
                                }
                            } else {
                                let Surgeonlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.cacheStorageItem.DoctorID }, true);
                                if (Surgeonlist.length > 0) {
                                    $scope.ApptSurgeryList[0].SurgeonName = Surgeonlist[0].FullName;
                                    $scope.SurgeryDiagnosisObj.SurgeonName = Surgeonlist[0].UserFullName;
                                } else {
                                    $scope.ApptSurgeryList[0].SurgeonName = '';
                                }
                            }

                            if (item.InternalCoManagerId != null) {
                                let Internallist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == item.InternalCoManagerId }, true);
                                if (Internallist.length > 0) {
                                    $scope.ApptSurgeryList[0].InternalCoManagerName = Internallist[0].FullName;
                                    $scope.SurgeryDiagnosisObj.InternalCoManagerName = Internallist[0].UserFullName;

                                } else {
                                    $scope.ApptSurgeryList[0].InternalCoManagerName = '';
                                }
                            }

                            $scope.SurgeryDiagnosisObj.ExternalCoManagerName = item.ExternalCoManagerName || "";

                        });
                    }

                }
            });
        }
        $scope.GetSurgeryStaffListDetails();
        $scope.OperativeNotesPopup = function () {
            var type = 3;
            var screentype = "ASC";
            console.log($scope.AscTab + "_AscTab");
            if ($scope.cacheStorageItem.AppointmentTypeId === 7) {
                screentype = "PreOp";
            }
            $scope.ActionArea = `Operative Notes Screen In ${$scope.ModuleName}`;
            let LogItem = {
                "SubModuleId": 5,
                "SubModuleName": "Operative Notes",
                "ScreenType": $scope.ModuleName || '',
                "ActionType": "Accessed",
                "OldActionDescription": "",
                "NewActionDescription": `${$scope.ActionArea}`,
                // "ActionDescription": `${$scope.ActionArea} For Appointment ID : ${$scope.LogObj.AppointmentId}`,
            }
            $scope.AddAuditLog(LogItem);
            /* $scope.ActionArea = 'Operative Notes Screen';*/
            /*     $scope.AddAscActionLog();*/
            $scope.mInstancecoordinationAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/faceLiftPopup.html",
                "controller": "USFaceSheetPopupCtrl",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    "allUserList": function () { return angular.copy($scope.allUserList) },
                    "SubTab": function () { return type; },
                    "ScreenType": function () { return screentype; },
                    "ParentObj": function () { return $scope.ParentObj; },
                },
                //"windowClass": "modal__popup--1 bottom-to-top-modal in",
                "windowClass": "modal__popup--1 bottom-to-top-modal",
            });

            $scope.mInstancecoordinationAdd.result.then(function (resp) {
                $scope.GetSurgeryStaffListDetails();
                if ($scope.TabObj.SelectedTab == 2 || $scope.TabObj.SelectedTab == 22) {
                    $scope.$broadcast("RefreshPreAdmHPSummaryEvent", 2);
                } else if ($scope.TabObj.SelectedTab == 3) {
                    $scope.$broadcast("RefreshPreAdmHPSummaryEvent", 3);
                } else if ($scope.TabObj.SelectedTab == 4) {
                    $scope.$broadcast("RefreshPreAdmHPSummaryEvent", 4);
                } else {
                    $scope.$broadcast("RefreshPreAdmHPSummaryEvent", 3);
                }
                $scope.GetOTQuickAccessDetails();
            }, function () {
                $scope.GetSurgeryStaffListDetails();
                if ($scope.TabObj.SelectedTab == 2 || $scope.TabObj.SelectedTab == 22) {
                    $scope.$broadcast("RefreshPreAdmHPSummaryEvent", 2);
                } else if ($scope.TabObj.SelectedTab == 3) {
                    $scope.$broadcast("RefreshPreAdmHPSummaryEvent", 3);
                } else if ($scope.TabObj.SelectedTab == 4) {
                    $scope.$broadcast("RefreshPreAdmHPSummaryEvent", 4);
                } else {
                    $scope.$broadcast("RefreshPreAdmHPSummaryEvent", 3);
                }
                $scope.GetOTQuickAccessDetails();
            });

        }
        $scope.NavtoNewimagemanagementPopup = function () {
            console.log($scope.Modalities);
            $scope.AllDoctorList = angular.copy($scope.allUserList);
            $scope.AllDoctorList = _.uniq($scope.AllDoctorList, false, function (p) { return p.DoctorID; });
            $scope.AllDoctorList = $filter("filter")($scope.AllDoctorList, function (item) {
                return item.RoleId === 1 || item.RoleId === 43;
            });
            let appointmentinfo = {
                AppointmentID: $scope.cacheStorageItem.AppointmentId || 0,
                PatientID: $scope.cacheStorageItem.PatientID || 0,
                PatientName: $scope.cacheStorageItem.PatientName || '',
                DoctorName: $scope.SurgeryDiagnosisObj.SurgeonName || "",
                ConsultationDt: $scope.SurgeryDiagnosisObj.SurgeryDate || '',
            };
            eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
            /*    $scope.ActionArea = 'Image Management Screen';*/
            $scope.ActionArea = `Image Management Screen In ${$scope.ModuleName}` || '';
            let LogItem = {
                "SubModuleId": 7,
                "SubModuleName": "Image Management",
                "ScreenType": $scope.ModuleName || '',
                "ActionType": "Accessed",
                "OldActionDescription": "",
                "NewActionDescription": `${$scope.ActionArea}`,
                // "ActionDescription": `${$scope.ActionArea} For Appointment ID : ${$scope.LogObj.AppointmentId}`,
            }
            $scope.AddAuditLog(LogItem);
            var pobject = {
                "From": 'ASC'
            }
            var mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/NewimagemanagementV2.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__popup--1 bottom-to-top-modal",
                "controller": "EhnoteImageManagementPopupCtrl",
                "resolve": {
                    "ModalitiesArray": function () { return angular.copy($scope.Modalities) },
                    "AllDoctorList": function () { return angular.copy($scope.AllDoctorList) },
                    "PatientOrderId": 0,
                    "IsComingFrom": function () { return angular.copy(pobject.From) }
                },
            });
            mInstanceAdd.result.then(function (SelectedInvestigationIdArray) {

                $scope.init();
            }, function (Investigation) {
                console.log("Cancel");

            });
        }
        $scope.ShowFilesPopup = function () {
            $scope.ActionArea = `Documents Screen In ${$scope.ModuleName}` || '';
            let LogItem = {
                "SubModuleId": 8,
                "SubModuleName": "Documents",
                "ScreenType": $scope.ModuleName || '',
                "ActionType": "Accessed",
                "OldActionDescription": "",
                "NewActionDescription": `${$scope.ActionArea}`,
                // "ActionDescription": `${$scope.ActionArea} For Appointment ID : ${$scope.LogObj.AppointmentId}`,
            }
            $scope.AddAuditLog(LogItem);
            //$scope.AddAscActionLog();
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/FilesPopUp.html",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": "modal__popup--1 bottom-to-top-modal",
                "resolve": {
                    "cacheStorageItem": function () { return $scope.cacheStorageItem; },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, cacheStorageItem) {
                    $scope.cacheStorageItem = angular.copy(cacheStorageItem);
                    $scope.cacheStorageItem.FullName = cacheStorageItem.PatientName || '';
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


                    $scope.closeuibpopup = function () {
                        $uibModalInstance.dismiss();
                    };
                },
            });
        };
        $scope.Historypopupnew = function (tab, type, from) {
            var HistoryTab = tab || 1;
            type = type || 1;
            from = from || "";
            $scope.obj = {
                "ParentObj": $scope.ParentObj || '',
            }
            /*let appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();*/
            if (HistoryTab == 1) {
                $scope.ActionArea = `Visits Summary Screen In ${$scope.ModuleName}`;
                let LogItem = {
                    "SubModuleId": 5,
                    "SubModuleName": "Visits Summary",
                    "ScreenType": $scope.ModuleName || '',
                    "ActionType": "Accessed",
                    "OldActionDescription": "",
                    "NewActionDescription": `${$scope.ActionArea}`,
                    // "ActionDescription": `${$scope.ActionArea} For Appointment ID : ${$scope.LogObj.AppointmentId}`,
                }
                $scope.AddAuditLog(LogItem);
            }
            let mInstanceShow = $uibModal.open({
                "templateUrl": "templates/UsNewConsultation/uibpopup/Historypopupnew.html",
                "controller": "HistorypopupnewCtrl",
                "backdrop": "static",
                //"scope": $scope,
                //"size": "lg",
                /*  "windowClass": "offcanves-right",*/
                "windowClass": "modal__popup--1 bottom-to-top-modal",
                "keyboard": false,
                "resolve": {
                    "HistoryTab": function () { return HistoryTab },
                    "Patientid": function () { return angular.copy($scope.cacheStorageItem.PatientID) },
                    /* "AppointmentID": function () { return angular.copy(appointmentinfo.AppointmentID) },*/
                    "HospitalId": function () { return angular.copy($scope.HospitalId) },
                    "VisionObj": function () { return [] },
                    "obj": function () { return angular.copy($scope.obj) },
                    "RefractionDetails": function () { return [] },
                    "TonometrySubList": function () { return [] },
                    "cacheStorageItem": function () { return angular.copy($scope.cacheStorageItem) || [] },
                    "type": function () { return type },
                    "Comingfrom": function () { return from },
                },

            });
        }
        $scope.navtoDocumentsPopup = function () {

            /*console.log($scope.selectedApptObj);*/
            $scope.AppointmentPatientdata = [];
            $scope.ActionArea = `Consents Forms Screen In ${$scope.ModuleName}` || '';
            let LogItem = {
                "SubModuleId": 6,
                "SubModuleName": "Documents",
                "ScreenType": $scope.ModuleName || '',
                "ActionType": "Accessed",
                "OldActionDescription": "",
                "NewActionDescription": `${$scope.ActionArea}`,
                // "ActionDescription": `${$scope.ActionArea} For Appointment ID : ${$scope.LogObj.AppointmentId}`,
            }
            $scope.AddAuditLog(LogItem);
            //$scope.AddAscActionLog();
            var hospitalobj = {
                "HospitalName": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "Address1": doctorinfo.doctordata.UserAddress[0].Address1,
                "Address2": doctorinfo.doctordata.UserAddress[0].Address2,
                "CityName": doctorinfo.doctordata.UserAddress[0].CityName,
                "StateName": doctorinfo.doctordata.UserAddress[0].StateName,
                "CountryName": doctorinfo.doctordata.UserAddress[0].CountryName,
                "MobileNo": doctorinfo.doctordata.UserAddress[0].MobileNo,
                "AreaCode": doctorinfo.doctordata.UserAddress[0].AreaCode,
                "PinCode": doctorinfo.doctordata.UserAddress[0].PinCode
            };

            $scope.AppointmentPatientdata.push(hospitalobj);

            var sobj = {
                "mainitem": $scope.MainselectedApptObj,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                "ParentHospitalId": $scope.ParentHospitalId,
                "PatientId": $scope.cacheStorageItem.PatientID,
                "HospitalAddress": $scope.AppointmentPatientdata,
                "selectedArray": [],
                "selectedObj": "",
                "Page": "PreOp",
                "PatientDetails": $scope.MainselectedApptObj.Patient || "",
                "ApptHospitalId": $scope.MainselectedApptObj.BranchId || 0,
            }

            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/DocumentsPopup.html",
                "backdrop": "static",
                "scope": $scope,
                "resolve": {
                    "ParentObject": function () { return sobj; }
                },
                "keyboard": false,
                "controller": "UsPatientDocumentsCtrl",
                "windowClass": "modal__popup--1 bottom-to-top-modal"
            });
            $scope.mInstanceAdd.result.then(function (result) {
                console.log(result);
                if ($scope.TabObj.SelectedTab == 2 && $scope.TabObj.PreopSUBTAB === 2) {
                    $scope.$broadcast("RefreshAppointmentConsents", 2);
                } else if ($scope.TabObj.SelectedTab == 4) {
                    $scope.$broadcast("RefreshAppointmentConsents", 4);
                } else {
                    //    $scope.$broadcast("RefreshAppointmentConsents", 3);
                }
            }, function (cancel) {
                if ($scope.TabObj.SelectedTab == 2 && $scope.TabObj.PreopSUBTAB === 2) {
                    $scope.$broadcast("RefreshAppointmentConsents", 2);
                } else if ($scope.TabObj.SelectedTab == 4) {
                    $scope.$broadcast("RefreshAppointmentConsents", 4);
                } else {
                    //    $scope.$broadcast("RefreshAppointmentConsents", 3);
                }
            });
        }
        $scope.MedicationReconciliation = function () {

            var ScreenObj = {
                "TypeId": 2,
                "TypeName": 'Anesthesia',
                "ScreenType": "ASC",
            }
            $scope.ActionArea = `Medication Reconciliation In ${$scope.ModuleName}` || '';

            let LogItem = {
                "SubModuleId": 17,
                "SubModuleName": "Medication Reconciliation",
                "ScreenType": $scope.ModuleName || '',
                "ActionType": "Accessed",
                "OldActionDescription": "",
                "NewActionDescription": `${$scope.ActionArea}`,
                // "ActionDescription": `${$scope.ActionArea} For Appointment ID : ${$scope.LogObj.AppointmentId}`,
            }
            $scope.AddAuditLog(LogItem);
            let mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/medicationreconciliation.html",
                //"size": "lg",
                "backdrop": "static",
                "keyboard": false,
                // "scope": $scope,
                "windowClass": "modal__ninety--",
                "resolve": {
                    "allUserList": function () { return $scope.allUserList; },
                    "cacheStorageItem": function () { return $scope.cacheStorageItem; },
                    "ApptSurgeryDetails": function () { return angular.copy($scope.ApptSurgeryList); },
                    "SurgeryDiagnosisObj": function () { return $scope.SurgeryDiagnosisObj; },
                    "ROSAllergyReactions": function () { return $scope.ROSAllergyReactions; },
                    "ROSAllergySeverity": function () { return $scope.ROSAllergySeverity; },
                    "ROSAllergyStatus": function () { return $scope.ROSAllergyStatus; },
                    "ROSAllergyType": function () { return $scope.ROSAllergyType; },
                    "HospitalId": function () { return angular.copy($scope.HospitalId) },
                    "ROSIsNormalArray": function () { return angular.copy($scope.ROSIsNormalArray) },
                    "ScreenObj": function () { return ScreenObj },
                    "ParentHospitalId": function () { return angular.copy($scope.ParentHospitalId) },
                    "toDataURL": function () { return $scope.toDataURL },
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, allUserList, cacheStorageItem, ApptSurgeryDetails, SurgeryDiagnosisObj, ROSAllergyReactions, ROSAllergySeverity, ROSAllergyStatus, ROSAllergyType, HospitalId, ROSIsNormalArray, ScreenObj, ParentHospitalId, toDataURL, eHnotePatientDataService) {

                    $scope.allUserList = allUserList || [];
                    $scope.NurseListArray = $scope.allUserList.filter((x) => x.RoleId == 8);
                    $scope.cacheStorageItem = cacheStorageItem;
                    $scope.HospitalId = HospitalId;
                    $scope.ROSAllergyReactions = ROSAllergyReactions;
                    $scope.ROSAllergySeverity = ROSAllergySeverity;
                    $scope.ROSAllergyStatus = ROSAllergyStatus;
                    $scope.ROSAllergyType = ROSAllergyType;
                    $scope.ParentHospitalId = ParentHospitalId || null;

                    $scope.AllergyStatus = {
                        "ShowNoKnownAllergy": true  // default true
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
                    $scope.toDataURL = toDataURL;
                    if ($scope.ROSAllergyReactions.length > 0) {
                        angular.forEach($scope.ROSAllergyReactions, function (item) {
                            item.Ischecked = false;
                        });
                    }

                    cacheStorageItem.PatientName = cacheStorageItem.PatientName || '';
                    cacheStorageItem.PatientDisplayId = cacheStorageItem.PatientDisplayId || '';
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
                    $scope.HeaderImage = '';
                    $scope.ApptSurgeryDetails = '';
                    ApptSurgeryDetails = ApptSurgeryDetails || [];

                    if (ApptSurgeryDetails.length > 0) {
                        $scope.ApptSurgeryDetails = ApptSurgeryDetails[0];
                        $scope.ApptSurgeryDetails.SurgeonId = $scope.ApptSurgeryDetails.SurgeonId || "";

                        var surgeonid = $scope.ApptSurgeryDetails.SurgeonId != "" ? $scope.ApptSurgeryDetails.SurgeonId : $scope.cacheStorageItem.DoctorID || "";
                        if (surgeonid != "") {
                            let Medicationsurgeonlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == surgeonid }, true) || [];

                            if (Medicationsurgeonlist.length > 0) {
                                $scope.ApptSurgeryDetails.SurgeonName = Medicationsurgeonlist[0].UserFullName || "";
                            }
                        } else {
                            $scope.ApptSurgeryDetails.SurgeonName = "";
                        }
                    }
                    $scope.SurgeryDiagnosisDetails = SurgeryDiagnosisObj;

                    $scope.SurgeryDiagnosisDetails.InternalCoManagerName = $scope.SurgeryDiagnosisDetails.InternalCoManagerName || "";
                    $scope.SurgeryDiagnosisDetails.ExternalCoManagerName = $scope.SurgeryDiagnosisDetails.ExternalCoManagerName || "";

                    $scope.SurgeryDiagnosisDetails.CoManagerName = $scope.SurgeryDiagnosisDetails.InternalCoManagerName != "" ? $scope.SurgeryDiagnosisDetails.InternalCoManagerName : $scope.SurgeryDiagnosisDetails.ExternalCoManagerName || "";


                    $scope.UserId = eHnoteMasterDataService.getLoginId();

                    $scope.ROSIsNormalArray = ROSIsNormalArray;
                    $scope.ScreenObj = ScreenObj;
                    $scope.ModeuleId = '';
                    $scope.ModuleName = '';
                    $scope.cacheStorageItem.AppointmentTypeId = $scope.cacheStorageItem.AppointmentTypeId || 0;
                    if ($scope.cacheStorageItem.AppointmentTypeId == 7 || $scope.cacheStorageItem.AppointmentTypeId == 6) {
                        $scope.ModeuleId = 3;
                        $scope.ModuleName = 'Pre Admission';
                    } else {
                        $scope.ModeuleId = 2;
                        $scope.ModuleName = 'ASC';
                    }
                    $scope.ReconcileMainObj = {
                        "AllergyItems": [],
                        "CurrentEyeMedications": [],
                        "CurrentSystemicMedicationsHistory": [],
                        "ReconciliationReviewedById": "",
                    }

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

                    $scope.obj = {
                        "AllergyItems": [],
                        "OccularHistoryArray": [],
                        "FunctionalStatusHistory": [],
                        "ReconcileMedicationList": [],
                        "BirthHistory": [],
                        "NutritionalHistory": [],
                        "CurrentSystemicMedicationsHistory": [],
                        "CurrentEyeMedicationArray": [],
                        "VaccinationHistory": [],
                        "LifestyleHistory": [],
                        "OcularSurgicalHistoryArray": [],
                        "FamilyHistory": [],
                        "MenstrualHistory": [],
                        "CurrentMedicationArray": [],
                        "SystemicHistoryArray": [],
                        "SurgicalHistoryArray": [],
                        "SelectedAllergyItem": "",
                        "isNKASelected": $scope.cacheStorageItem.isNKASelected || false,
                        "isNKDASelected": $scope.cacheStorageItem.isNKDASelected || false,
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
                        "IsCurrentEyeMedicationStopped": false,
                        "ReconciliationSummaryView": false,
                        "IsReconciliationDataInd": false,
                        "ReconcileMedicationSummaryView": true,
                        "ReconciliationAllergySummaryView": true,
                        "IsClickSaveMedReconciliationBtn": false,
                        "MedicineSearchType": "General",
                        "ROSOverAllRemarks": "",
                        "ReconciliationReviewedByName": "",
                        "ReconciliationReviewedById": "",
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

                    $scope.adnewsigobj = {
                        "IsNewSig": false,
                        "MedicineId": 0,
                    }

                    $scope.SigSearch = {
                        "Shows": false
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

                    $scope.RosObj = {
                        'Type': "",
                        'IsCurrentEyeMedication': true,
                        'IsGeneralMedication': false,
                        'IsCurrentEye': true,
                        'IsCurrentSystem': true,
                    };

                    $scope.OnSelectCurrentMedication = function (Id) {
                        if (Id == 1) {
                            $scope.RosObj.IsCurrentEyeMedication = true;
                            $scope.RosObj.IsGeneralMedication = false;
                            $scope.obj.isNKCEMSelected = false;
                        } else {
                            $scope.RosObj.IsGeneralMedication = true;
                            $scope.RosObj.IsCurrentEyeMedication = false;
                            $scope.obj.isNKCSMSelected = false;
                        }
                    }

                    /*Allergy */
                    $scope.GetAllergyList = function (val) {
                        var req = {
                            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                            "OrganizationId": $scope.HospitalId,
                            //"HospitalId": $scope.ParentHospitalId,
                            "GetAllIndicator": 1,
                            "SearchText": val,
                            "AllergyType": 0,
                            "PageSize": 10,
                            "PageNumber": 1,
                            "Type": '',
                            "UserId": $scope.cacheStorageItem.DoctorID,
                            "IsFrequent": "N"

                        };

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
                                    var FreqList = $filter("filter")($scope.FrequentAllergyList, function (fitem) {
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
                                    var FreqList = $filter("filter")($scope.FrequentAllergyList, function (fitem) {
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

                    $scope.addAllergy = function (allergy) {
                        allergy = allergy || "";
                        if (allergy == '') {
                            return false;
                        }
                        var reqObj = {
                            "ParentOrganizationId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                            "OrganizationId": $scope.HospitalId,
                            //"HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                            "UserId": $scope.UserId,
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
                            $scope.showAllfreq.allrgylist = $scope.FrequentAllergyList.length;
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

                                $scope.FrequentAllergyList = resp.data.Allergyitems || [];
                                $scope.FrequentMedicationsList = resp.data.OrganizationFavoriteMedications || [];

                                angular.forEach($scope.FrequentAllergyList, function (item) {
                                    item.IsChecked = false;
                                });

                                angular.forEach($scope.FrequentMedicationsList, function (item) {
                                    item.IsChecked = false;
                                });

                                if ($scope.obj.AllergyItems.length > 0) {
                                    angular.forEach($scope.obj.AllergyItems, function (item) {
                                        if (item.DeleteInd == 'N') {
                                            var FreqList = $filter("filter")($scope.FrequentAllergyList, function (fitem) {
                                                return fitem.AllergyId == item.AllergyId;
                                            }, true) || [];
                                            if (FreqList.length > 0) {
                                                FreqList[0].IsChecked = true;
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

                    $scope.ChangeOnSetItem = function (item) {
                        item.ShowDateFormat = !item.ShowDateFormat;
                    }

                    $scope.ChangeFormatDate = function (item) {
                        item.Duration = "";
                        //item.DurationType = "D";
                    };

                    $scope.ChangeAllergy = function (item) {
                        if (item.DurationType === 'SB') {
                            item.Duration = '';
                        }
                        item.DurationDate = '';
                    }

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


                                angular.forEach($scope.obj.AllergyItems, function (item) {
                                    if (item.AllergyId == 1) {
                                        item.DeleteInd = 'Y';

                                    }
                                });

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

                            } else {
                                $scope.obj.isNKDASelected = false;
                                $scope.obj.SelectedAllergyItem = '';
                                $scope.obj.AllergyItems = [];

                            }
                            $scope.$digest();

                        } else {
                            if ($scope.obj.isNKDASelected) {
                                $scope.obj.isNKASelected = false;


                                angular.forEach($scope.obj.AllergyItems, function (item) {
                                    if (item.AllergyId == 1) {
                                        item.DeleteInd = 'Y';

                                    }
                                });

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

                            } else {
                                $scope.cacheStorageItem.isNKDASelected = false;
                                $scope.obj.SelectedAllergyItem = '';
                                $scope.obj.AllergyItems = [];

                            }
                        }
                    };

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



                    $scope.AddAllergiesnotes = function (item) {
                        item.ShowNote = true;
                    };

                    $scope.GetAllergyListFromRcopia = function (val) {
                        var searchvalue = val || "";

                        if (searchvalue != "") {
                            var req = {
                                "VendorName": "Appolo Pharmacy",
                                "VendorPassword": "abc123",
                                "searchText": searchvalue || "",
                                "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                                "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                                "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId
                            }
                            return eHnoteConditionsDataService.getAllergyDataFromRcopia(req).then(function (resp) {
                                if (resp.data.AllergyList !== undefined) {
                                    return resp.data.AllergyList.map(function (item) {
                                        return item;
                                    });
                                }
                            });
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
                        var FreqList = $filter("filter")($scope.FrequentAllergyList, function (fitem) {
                            return fitem.AllergyId == Aitem.AllergyId;
                        }, true);
                        if (FreqList.length > 0) {
                            FreqList[0].IsChecked = false;
                        }
                    };

                    $scope.AddAllergiesnotes = function (item) {
                        item.ShowNote = true;
                    };

                    $scope.GetAllergyListFromRcopia = function (val) {
                        var searchvalue = val || "";

                        if (searchvalue != "") {
                            var req = {
                                "VendorName": "Appolo Pharmacy",
                                "VendorPassword": "abc123",
                                "searchText": searchvalue || "",
                                "RcopiaVendorAccountName": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountName,
                                "RcopiaVendorAccountPassword": doctorinfo.doctordata.UserAddress[0].RcopiaVendorAccountPassword,
                                "RcopiaPracticeId": doctorinfo.doctordata.UserAddress[0].RcopiaPracticeId
                            }
                            return eHnoteConditionsDataService.getAllergyDataFromRcopia(req).then(function (resp) {
                                if (resp.data.AllergyList !== undefined) {
                                    return resp.data.AllergyList.map(function (item) {
                                        return item;
                                    });
                                }
                            });
                        }
                    }

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

                                    var FreqList = $filter("filter")($scope.FrequentAllergyList, function (fitem) {
                                        return fitem.AllergyId == $scope.obj.SelectedAllergyItem.AllergyId;
                                    }, true);
                                    FreqList = FreqList || [];
                                    if (FreqList.length > 0) {
                                        FreqList[0].IsChecked = true;
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
                                        $scope.obj.SelectedAllergyItem.IsNKDAshow = true;
                                        $scope.obj.SelectedAllergyItem.IsFrequent = IsFrequent || 'N';
                                        $scope.obj.SelectedAllergyItem.RxnormID = object.RxnormID;
                                        $scope.obj.SelectedAllergyItem.RxNormID = object.RxnormID;
                                        $scope.obj.AllergyItems.push($scope.obj.SelectedAllergyItem);
                                    }
                                    $scope.obj.SelectedAllergyItem = "";
                                    $scope.AllergyStatus.ShowNoKnownAllergy = false;
                                }
                            }
                        });
                    };

                    $scope.GetOrganizationMedicationlist = function (val) {

                        var req = {
                            "HospitalId": $scope.HospitalId,
                            "PageSize": 10,
                            "SearchText": val || '',
                            "PageNumber": 1,
                            "UserId": $scope.UserId,
                            "IsFrequent": "N",
                            "ParentOrganizationId": $scope.ParentHospitalId
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

                    $scope.onRosOrganizationMedicationlist = function (object) {
                        $scope.SigSearch.Shows = false;
                        object.SigFields = false;

                        if (object.MedicineId === '') {
                            object.MedicineName = '';
                            $scope.obj.CurrentMedicationItem = '';
                            return false;
                        }

                        $scope.obj.CurrentMedicationItem = object;
                        $scope.obj.CurrentMedicationItem = $scope.obj.CurrentMedicationItem || "";
                        if ($scope.obj.CurrentMedicationItem === "") {
                            return;
                        }
                        if (angular.isObject($scope.obj.CurrentMedicationItem)) {
                            var object = {
                                "CurrentEyeMedicalConditionId": 0,
                                "HospitalId": $scope.obj.CurrentMedicationItem.OrganizationId,
                                "MedicineId": $scope.obj.CurrentMedicationItem.MedicineId,
                                "MedicineType": $scope.obj.CurrentMedicationItem.MedicineType,
                                "MedicineTypeId": $scope.obj.CurrentMedicationItem.MedicineTypeId,
                                "MedicineName": $scope.obj.CurrentMedicationItem.MedicineName,
                                "MedicineObject": "",
                                "RcopiaDrugId": "",
                                "RcopiaMedicationId": 0,
                                "MedicationName": "",
                                "DrugNDCID": "",
                                "DrugFirstDataBankMedID": "",
                                "DrugGenericId": "",
                                "DrugBrandName": "",
                                "DrugGenericName": $scope.obj.CurrentMedicationItem.GenericName,
                                "DrugForm": "",
                                "DrugStrength": $scope.obj.CurrentMedicationItem.Strength,
                                "DrugSchedule": null,
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
                                "RxNormList": $scope.obj.CurrentMedicationItem.RxNormList || [],
                                "IsMedicationStopped": false,
                                "StopReasonId": null,
                                "SigFormationFields": false,
                                "isEditFocused": false,
                                "isAddFocused": false,
                                "SelectedMedicationHistory": "CurrentEyeMedication",
                                "LastUsedDate": null,
                                "MedicationStopDate": null,
                                "MedicationStopRemarks": "",
                                "MedicationResumeDate": null,
                                "MedicationResumeRemarks": "",
                                "MedicationLocationType": "Eye",
                                "MedicationLocationTypeId": 1,
                                "IsRosMedication": false

                            };
                        }

                        var i = 0;
                        if ($scope.obj.CurrentEyeMedicationArray.length > 0) {
                            angular.forEach($scope.obj.CurrentEyeMedicationArray, function (item) {
                                if (item.MedicineId === $scope.obj.CurrentMedicationItem.MedicineId && item.DeleteInd == 'N') {
                                    alertify.error('You have already entered this Current Eye Medication');
                                    i++;
                                }
                            });
                        }
                        if ($scope.obj.CurrentEyeMedicationArray.length !== 0) {
                            var List = $filter("filter")($scope.obj.CurrentEyeMedicationArray, { "MedicineId": 1 }, true);
                            if (List.length > 0) {
                                if (List[0].PatientDetailId === 0) {
                                    var indexToRemove = $scope.obj.CurrentEyeMedicationArray.indexOf(List[0]);
                                    if (indexToRemove !== -1) {
                                        $scope.obj.CurrentEyeMedicationArray.splice(indexToRemove, 1);
                                    }
                                } else {
                                    List[0].DeleteInd = 'Y';
                                }
                            }
                            $scope.obj.isNKCEMSelected = false;
                            angular.forEach($scope.obj.CurrentEyeMedicationArray, function (item) {
                                item.IsEdit = false;
                            });
                        }
                        if (i === 0) {
                            object.MedicalHistoryDetailsId = 0;
                            $scope.obj.CurrentEyeMedicationArray.unshift(object);


                        }
                        $scope.obj.CurrentMedicationItem = "";

                    };

                    $scope.ONSelectCurrentEyeRcopia = function (object) {
                        $scope.SigSearch.Shows = false;
                        object.SigFields = false;

                        $scope.obj.CurrentMedicationItem = object;
                        $scope.obj.CurrentMedicationItem = $scope.obj.CurrentMedicationItem || "";
                        if ($scope.obj.CurrentMedicationItem === "") {
                            return;
                        }
                        if (angular.isObject($scope.obj.CurrentMedicationItem)) {
                            var object = {
                                "CurrentEyeMedicalConditionId": 0,
                                "HospitalId": $scope.obj.CurrentMedicationItem.OrganizationId,
                                "MedicineId": 0,
                                "MedicineType": $scope.obj.CurrentMedicationItem.BrandName,
                                "MedicineTypeId": 0,
                                "MedicineName": $scope.obj.CurrentMedicationItem.BrandName,
                                "MedicineObject": "",
                                "RcopiaDrugId": $scope.obj.CurrentMedicationItem.RcopiaDrugId,
                                "RcopiaMedicationId": 0,
                                "MedicationName": "",
                                "DrugNDCID": $scope.obj.CurrentMedicationItem.RcopiaDrugNDCID,
                                "DrugFirstDataBankMedID": "",
                                "DrugGenericId": "",
                                "DrugBrandName": "",
                                "DrugGenericName": $scope.obj.CurrentMedicationItem.GenericName,
                                "DrugForm": "",
                                "DrugStrength": $scope.obj.CurrentMedicationItem.Strength,
                                "DrugSchedule": null,
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
                                "StopReasonId": null,
                                "SigFormationFields": false,
                                "isEditFocused": false,
                                "isAddFocused": false,
                                "SelectedMedicationHistory": "CurrentEyeMedication",
                                "LastUsedDate": null,
                                "MedicationStopDate": null,
                                "MedicationStopRemarks": "",
                                "MedicationResumeDate": null,
                                "MedicationResumeRemarks": "",
                                "MedicationLocationType": "Eye",
                                "MedicationLocationTypeId": 1,
                                "IsRosMedication": false

                            };
                        }

                        var mparams = {
                            "UserId": $scope.UserId,
                            "MedicineId": 0,
                            "RcopiaDrugId": $scope.obj.CurrentMedicationItem.RcopiaDrugId,
                            "DrugNDCID": $scope.obj.CurrentMedicationItem.RcopiaDrugNDCID,
                            "FirstDataBankMedID": $scope.obj.CurrentMedicationItem.FirstDataBankMedID,
                            "DrugGenericID": $scope.obj.CurrentMedicationItem.GenericID,
                            "DrugName": $scope.obj.CurrentMedicationItem.BrandName,
                            "GenericName": $scope.obj.CurrentMedicationItem.GenericName,
                            "MedicineType": $scope.obj.CurrentMedicationItem.Form,
                            "Strength": $scope.obj.CurrentMedicationItem.Strength,
                            "Schedule": $scope.obj.CurrentMedicationItem.Schedule,
                            "RouteCode": $scope.obj.CurrentMedicationItem.RouteCode,
                            "RxNormList": []
                        }

                        if ($scope.obj.CurrentMedicationItem.RxNormList.length > 0) {
                            var filteredRxNorm = $filter("filter")($scope.obj.CurrentMedicationItem.RxNormList, { "Status": 'a' }, true) || [];
                            if (filteredRxNorm.length > 0) {
                                $scope.obj.CurrentMedicationItem = filteredRxNorm[0].RxnormID;
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

                                object.MedicineId = response.data.MedicineId;

                                var i = 0;
                                if ($scope.obj.CurrentEyeMedicationArray.length > 0) {
                                    angular.forEach($scope.obj.CurrentEyeMedicationArray, function (item) {
                                        if (item.MedicineId === object.MedicineId && item.DeleteInd == 'N') {
                                            alertify.error('You have already entered this Current Eye Medication');
                                            i++;
                                        }
                                    });
                                }
                                if ($scope.obj.CurrentEyeMedicationArray.length !== 0) {
                                    var List = $filter("filter")($scope.obj.CurrentEyeMedicationArray, { "MedicineId": 1 }, true);
                                    if (List.length > 0) {
                                        if (List[0].PatientDetailId === 0) {
                                            var indexToRemove = $scope.obj.CurrentEyeMedicationArray.indexOf(List[0]);
                                            if (indexToRemove !== -1) {
                                                $scope.obj.CurrentEyeMedicationArray.splice(indexToRemove, 1);
                                            }
                                        } else {
                                            List[0].DeleteInd = 'Y';
                                        }
                                    }
                                    $scope.obj.isNKCEMSelected = false
                                    angular.forEach($scope.obj.CurrentEyeMedicationArray, function (item) {
                                        item.IsEdit = false;
                                    });
                                }
                                if (i === 0) {
                                    object.MedicalHistoryDetailsId = 0;
                                    $scope.obj.CurrentEyeMedicationArray.unshift(object);
                                }
                                $scope.obj.CurrentMedicationItem = "";
                            }
                        });


                    };

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

                    $scope.RemovePrescriptionDetailObj = function (item, index) {
                        var index = $scope.obj.CurrentEyeMedicationArray.indexOf(item);
                        item.CurrentEyeMedicalConditionId = item.CurrentEyeMedicalConditionId || null;
                        if (item.CurrentEyeMedicalConditionId === null) {
                            if (index > -1) {
                                $scope.obj.CurrentEyeMedicationArray.splice(index, 1);
                            }
                        } else {
                            $scope.obj.CurrentEyeMedicationArray[index].DeleteInd = 'Y';
                        }

                        let MedEyelist = $filter('filter')($scope.obj.CurrentEyeMedicationArray, { 'DeleteInd': 'N' }, true) || [];
                        if (MedEyelist.length == 0) {
                            $scope.obj.ReconcileMedicationSummaryView = true;
                        }
                    };

                    $scope.getParticularSigMedicationitems = function (text, item) {
                        text = text || '';
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
                        var dosesupplytest = "";
                        if ($scope.addNewOrganizationSigObj.DaysSupply !== '') {
                            dosesupplytest = " for " + $scope.addNewOrganizationSigObj.DaysSupplyDescription;
                        }
                        $scope.addNewOrganizationSigObj.Sig = $scope.addNewOrganizationSigObj.Action + " " + $scope.addNewOrganizationSigObj.Dose + " " + $scope.addNewOrganizationSigObj.DoseUnit + " " + $scope.addNewOrganizationSigObj.Route + " " + $scope.addNewOrganizationSigObj.Frequency + " " + $scope.addNewOrganizationSigObj.DoseOther + "" + dosesupplytest;
                    }

                    $scope.addSIgNameDynamicallyAdded = function () {

                        if ($scope.obj.CurrentEyeMedicationArray.length > 0) {
                            angular.forEach($scope.obj.CurrentEyeMedicationArray, function (initem, index) {
                                var dosesupplytest = "";

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
                                var dosesupplytest = "";

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

                    $scope.clearOrganizationSiginput = function () {
                        $scope.addNewOrganizationSigObj = getnewOrganizationSigObj();
                    };

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

                                    var filteredSystemicArray = $filter("filter")($scope.obj.CurrentSystemicMedicationsHistory, { "MedicationLocationTypeId": 2 }, true);

                                    angular.forEach(filteredSystemicArray, function (item) {
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

                    $scope.ONSigDetails = function (item, mainitem) {
                        console.log(item);
                        console.log(mainitem);
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

                    $scope.StopCurrentEyeMedication = function (item, type) {

                        item.IsMedicationStopped = !item.IsMedicationStopped;

                        if (!item.IsMedicationStopped) {
                            item.StopDate = null;
                            item.StopReasonId = null;
                            item.StopReason = "";
                        }
                    }

                    $scope.changeStopMedication = function (item, StopReasonId) {
                        item = item || null;
                        if (item != null) {
                            var ListArray = $filter("filter")($scope.MedicationStopReasons, { "StopReasonId": StopReasonId }, true) || [];
                            if (ListArray.length > 0) {
                                item.StopReason = ListArray[0].StopReason || "";
                            }
                        }
                        else {
                            item.StopReason = "";
                        }
                    }

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
                                "FavoriteMedicationId": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.FavoriteMedicationId,
                                "Continuefield": "Yes",
                                "MedicationreconcillationRemarks": ""
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
                                "Continuefield": "Yes",
                                "MedicationreconcillationRemarks": "",

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
                            }
                        });

                    }

                    $scope.OnchangeContinuefield = function (item, data) {
                        item.Continuefield = data;
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

                    $scope.changePopupPrescDose = function (item, DoseId) {
                        var filteredArray = $filter("filter")($scope.doseArray, { "MedicineDosaageFieldId": DoseId }, true) || [];
                        if (filteredArray.length > 0) {
                            item.Dose = filteredArray[0].Code;
                        };
                        //$scope.addSIgNameDynamically();
                    };

                    $scope.changePopupPrescDoseUnit = function (item, DoseUnitId) {
                        var filteredArray = $filter("filter")($scope.doseUnitArray, { "MedicineDosaageFieldId": DoseUnitId }, true) || [];
                        if (filteredArray.length > 0) {
                            item.DoseUnit = filteredArray[0].Code;
                        };
                        //$scope.addSIgNameDynamically();
                    };

                    $scope.changePopupPrescRoute = function (item, RouteId) {
                        var filteredArray = $filter("filter")($scope.routeArray, { "MedicineDosaageFieldId": RouteId }, true) || [];
                        if (filteredArray.length > 0) {
                            item.Route = filteredArray[0].Code;
                        };
                        //$scope.addSIgNameDynamically();
                    };

                    $scope.changePopupPrescFrequency = function (item, FrequencyId) {
                        var filteredArray = $filter("filter")($scope.frequencyArray, { "MedicineDosaageFieldId": FrequencyId }, true) || [];
                        if (filteredArray.length > 0) {
                            item.Frequency = filteredArray[0].Description;
                        };
                        //$scope.addSIgNameDynamically();
                    };
                    $scope.LogObj = {
                        "UserId": $scope.UserId || null,
                        "OrganizationId": $scope.HospitalId || null,
                        "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                        "PatientId": $scope.cacheStorageItem.PatientID || null,
                        "LogArray": [],
                        "AllergyItems": [],
                        "CurrentEyeMedications": [],
                        "CurrentSystemicMedicationsHistory": [],
                        "ReconciliationReviewedById": null,
                    }
                    $scope.Rosinit = function () {

                        let tappid = $scope.cacheStorageItem.DoctorID ? $scope.cacheStorageItem.DoctorID : $scope.UserId;
                        $scope.cacheStorageItem.OptometristId = $scope.cacheStorageItem.OptometristId || null;
                        if ($scope.RoleId === 10 || $scope.RoleId === 61) {
                            tappid = $scope.cacheStorageItem.OptometristId === null ? $scope.UserId : $scope.cacheStorageItem.OptometristId;
                        }

                        let req3 = {
                            "OrganizationId": $scope.HospitalId,
                            "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                            "PatientId": $scope.cacheStorageItem.PatientID || 0,
                            "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId,
                        };

                        var reqobj = {
                            "HospitalId": $scope.HospitalId,
                            "PageSize": 10,
                            "PageNumber": 1,
                            "UserId": $scope.UserId,
                            "IsFrequent": "Y",
                        };

                        $q.all([
                            eHnoteDiagnosisDataServices.GetMedicineDosageFieldsMasterData(),
                            eHnoteSurgeryService.GetOTQuickAccessDetails(req3),
                            eHnoteDiagnosisDataServices.GetAllFrequentlyAddedData(reqobj),
                            eHnoteDiagnosisDataServices.GetAllMasterConsultationData(),
                            eHnotePatientDataService.GetUserConsultationMasterTemplateDtls(tappid),
                        ]).then(function (resp) {

                            if (resp[0].data.status == "Success") {
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

                                $scope.ReconcileMainObj.AllergyItems = angular.copy(resp[1].data.AllergyItems);
                                $scope.ReconcileMainObj.CurrentSystemicMedicationsHistory = angular.copy(resp[1].data.CurrentSystemicMedicationList);
                                $scope.ReconcileMainObj.CurrentEyeMedications = angular.copy(resp[1].data.CurrentEyeMedicationList);

                                $scope.ReconcileMainObj.ReconciliationReviewedById = resp[1].data.ReconciliationReviewedById || '';

                                $scope.ReconcileMainObj.AllergyRemarks = resp[1].data.AllergyRemarks || '';
                                $scope.ReconcileMainObj.CurrentEyeRemarks = resp[1].data.CurrentEyeRemarks || "";
                                $scope.ReconcileMainObj.CurrentSystemicRemarks = resp[1].data.CurrentSystemicRemarks || "";
                                $scope.ReconcileMainObj.SurgicalRemarks = resp[1].data.SurgicalRemarks || "";
                                $scope.ReconcileMainObj.SystemicHistoryRemarks = resp[1].data.SystemicHistoryRemarks || "";
                                $scope.ReconcileMainObj.LifestyleHistoryRemarks = resp[1].data.LifestyleHistoryRemarks || "";
                                $scope.ReconcileMainObj.SystemicHistory = resp[1].data.SystemicHistory || "";

                                $scope.ReconcileMainObj.NeurologicNotes = resp[1].data.SystemicOtherData.NeurologicNotes || null;
                                $scope.ReconcileMainObj.HeentNotes = resp[1].data.SystemicOtherData.HeentNotes || null;
                                $scope.ReconcileMainObj.LungsNotes = resp[1].data.SystemicOtherData.LungsNotes || null;
                                $scope.ReconcileMainObj.GeneralAppearenceNotes = resp[1].data.SystemicOtherData.GeneralAppearenceNotes || null;
                                $scope.ReconcileMainObj.CardiacNotes = resp[1].data.SystemicOtherData.CardiacNotes || null;
                                $scope.ReconcileMainObj.EndocrineNotes = resp[1].data.SystemicOtherData.EndocrineNotes || null;

                                $scope.OrganizationDetails = resp[1].data.OrganizationDetails || [];
                                if ($scope.OrganizationDetails.length > 0) {
                                    $scope.OrganizationDetails[0].OrganizationLogoUrl = $scope.OrganizationDetails[0].OrganizationLogoUrl || "";
                                    if ($scope.OrganizationDetails[0].OrganizationLogoUrl !== "") {
                                        $scope.toDataURL($scope.OrganizationDetails[0].OrganizationLogoUrl, function (dataURL) {
                                            $scope.OrganizationDetails[0].OrganizationLogoUrl = dataURL;
                                        });
                                    }
                                }
                            }

                            if (resp[2].data.Status === "Success") {
                                $scope.FrequentAllergyList = resp[2].data.Allergyitems || [];

                                $scope.FrequentMedicationsList = resp[2].data.OrganizationFavoriteMedications || [];

                                angular.forEach($scope.FrequentAllergyList, function (item) {
                                    item.IsChecked = false;
                                });

                                angular.forEach($scope.FrequentMedicationsList, function (item) {
                                    item.IsChecked = false;
                                });


                            }

                            if (resp[3].data.status === "Success") {

                                $scope.Modalities = resp[3].data.Modalities || [];
                                $scope.ROSAllergyReactions = resp[3].data.ROSAllergyReactions || [];
                                $scope.ROSAllergySeverity = resp[3].data.ROSAllergySeverity || [];
                                $scope.ROSAllergyStatus = resp[3].data.ROSAllergyStatus || [];
                                $scope.ROSAllergyType = resp[3].data.ROSAllergyType || [];

                                if ($scope.ROSAllergyReactions.length > 0) {
                                    angular.forEach($scope.ROSAllergyReactions, function (item) {
                                        item.Ischecked = false;
                                    });
                                }
                            }
                            if (resp[4].data.status === "Success") {
                                if (resp[4].data.ROS.length > 0) {
                                    $scope.ROSIsNormalArray = [];
                                    $scope.ROSIsNormalArray = resp[4].data.ROS || [];
                                }
                            }

                            /* Ros Data */

                            if ($scope.ReconcileMainObj.AllergyItems.length > 0) {
                                angular.forEach($scope.ReconcileMainObj.AllergyItems, function (item) {
                                    item.Remarks = item.AllergyRemarks || item.Remarks;
                                });
                                $scope.obj.AllergyItems = angular.copy($scope.ReconcileMainObj.AllergyItems) || [];

                                angular.forEach($scope.obj.AllergyItems, function (item) {
                                    item.IsEdit = false;
                                    item.Remarks = item.Remarks || '';

                                    item.ReactionName = item.ReactionName || '';
                                    item.ReactionId = item.ReactionId || null;
                                    if (item.ReactionName != '' || item.ReactionId != null) {
                                        var obj = {
                                            "AllergyReaction": item.ReactionName,
                                            "ROSAllergyReactionsId": item.ReactionId
                                        }
                                        item.SelectedReaction = angular.copy(obj);
                                    }

                                    if (item.Remarks != '') {
                                        item.ShowNote = true;
                                    }

                                    item.DurationDate = item.DurationDate || '';
                                    item.Duration = item.Duration == 0 ? '' : item.Duration;
                                    //item.DurationType = item.DurationType == '' ? 'D' : item.DurationType;

                                    if (item.DurationDate != '') {
                                        item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                                        item.ShowDateFormat = true;
                                    }
                                    if (item.AllergyId === 1) {
                                        $scope.obj.isNKASelected = true;
                                    } else {
                                        $scope.obj.isNKASelected = false;
                                    }
                                    if (item.AllergyId === 2) {
                                        $scope.obj.isNKDASelected = true;
                                    } else {
                                        $scope.obj.isNKDASelected = false;
                                    }

                                    var matchingItem = $scope.FrequentAllergyList.find(function (frequentItem) {
                                        return frequentItem.AllergyId === item.AllergyId;
                                    });

                                    matchingItem = matchingItem || "";
                                    if (matchingItem != "") {
                                        matchingItem.IsChecked = true;
                                    }

                                    if (item.AllergyId === 2) {
                                        item.IsNKDAshow = false;
                                    } else {
                                        item.IsNKDAshow = true;
                                    }
                                });
                                $scope.obj.AllergyItems[0].IsEdit = true;
                                $scope.obj.ReconciliationAllergySummaryView = true;

                                let tempalergy = angular.copy($scope.obj.AllergyItems) || [];
                                $scope.LogObj.AllergyItems = angular.copy(tempalergy);

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
                                    let NkaList = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
                                        return fitem.AllergyId === 2 && fitem.DeleteInd == 'N';
                                    }, true);
                                    if (NkaList.length > 0) {
                                        $scope.obj.isNKDASelected = true;
                                    } else {
                                        $scope.obj.isNKDASelected = false;
                                    }
                                }
                            }

                            $scope.ReconcileMainObj.CurrentEyeMedications = $scope.ReconcileMainObj.CurrentEyeMedications || [];
                            if ($scope.ReconcileMainObj.CurrentEyeMedications.length > 0) {
                                angular.forEach($scope.ReconcileMainObj.CurrentEyeMedications, function (suitem) {
                                    suitem.SigFields = false;
                                    suitem.SigFormationFields = false;
                                    suitem.MedicationStopDate = suitem.MedicationStopDate || null;
                                    suitem.MedicationResumeDate = suitem.MedicationResumeDate || null;
                                    suitem.MedicationLocationType = suitem.MedicationLocationType || "";
                                    if (suitem.MedicationLocationType == "") {
                                        suitem.IsRosMedication = true;
                                        suitem.ROSMedicationLocationType = "Eye";
                                    } else {
                                        suitem.IsRosMedication = false;
                                    }
                                    if (suitem.MedicationResumeDate != null) {
                                        suitem.MedicationResumeDate = $filter('date')(suitem.MedicationResumeDate, "MM-dd-yyyy");
                                    }
                                    if (suitem.MedicationStopDate != null) {
                                        suitem.MedicationStopDate = $filter('date')(suitem.MedicationStopDate, "MM-dd-yyyy");
                                    }

                                    suitem.LastUsedDate = suitem.LastUsedDate || null;
                                    if (suitem.LastUsedDate != null) {
                                        suitem.LastUsedDate = $filter('date')(suitem.LastUsedDate, "MM-dd-yyyy");
                                    }

                                    if (suitem.MedicationStopDate != null || suitem.MedicationResumeDate != null) {
                                        suitem.IsMedicationDateInd = true;
                                        suitem.isChecked = true;
                                    }
                                    if (suitem.MedicationStopDate != null && suitem.MedicationResumeDate == null) {
                                        suitem.IsMedicationStopped = true;
                                    }
                                });
                            }

                            if ($scope.ReconcileMainObj.CurrentEyeMedications.length > 0) {
                                $scope.obj.CurrentEyeMedicationArray = $scope.ReconcileMainObj.CurrentEyeMedications || [];
                                if ($scope.obj.CurrentEyeMedicationArray.length > 0) {
                                    let List = $filter("filter")($scope.obj.CurrentEyeMedicationArray, function (fitem) {
                                        return fitem.MedicineId === 1
                                    }, true);
                                    if (List.length > 0) {
                                        $scope.obj.isNKCEMSelected = true;
                                    } else {
                                        $scope.obj.isNKCEMSelected = false;
                                    }
                                }
                                $scope.obj.CurrentEyeMedicationArray[0].IsEdit = true;
                                $scope.obj.ReconcileMedicationSummaryView = true;

                                if ($scope.obj.CurrentEyeMedicationArray.length > 0) {
                                    angular.forEach($scope.obj.CurrentEyeMedicationArray, function (item) {
                                        item.MedicineObject = item.Sig || "";
                                        item.SelectedMedicationHistory = 'CurrentEyeMedication';
                                    });
                                }
                            }

                            $scope.ReconcileMainObj.CurrentSystemicMedicationsHistory = $scope.ReconcileMainObj.CurrentSystemicMedicationsHistory || [];

                            if ($scope.ReconcileMainObj.CurrentSystemicMedicationsHistory.length > 0) {
                                angular.forEach($scope.ReconcileMainObj.CurrentSystemicMedicationsHistory, function (suitem) {
                                    suitem.SigFields = false;
                                    suitem.SigFormationFields = false;
                                    suitem.MedicationStopDate = suitem.MedicationStopDate || null;
                                    suitem.MedicationResumeDate = suitem.MedicationResumeDate || null;
                                    suitem.MedicationLocationType = suitem.MedicationLocationType || "";
                                    suitem.MedicationLocationTypeId = suitem.MedicationLocationTypeId;
                                    suitem.MedicationLocationType = suitem.MedicationLocationTypeId == 1 ? "Eye" : "General";
                                    if (suitem.MedicationResumeDate != null) {
                                        suitem.MedicationResumeDate = $filter('date')(suitem.MedicationResumeDate, "MM-dd-yyyy");
                                    }
                                    if (suitem.MedicationStopDate != null) {
                                        suitem.MedicationStopDate = $filter('date')(suitem.MedicationStopDate, "MM-dd-yyyy");
                                    }

                                    suitem.LastUsedDate = suitem.LastUsedDate || null;
                                    if (suitem.LastUsedDate != null) {
                                        suitem.LastUsedDate = $filter('date')(suitem.LastUsedDate, "MM-dd-yyyy");
                                    }

                                    if (suitem.MedicationStopDate != null || suitem.MedicationResumeDate != null) {
                                        suitem.IsMedicationDateInd = true;
                                        suitem.isChecked = true;
                                    }
                                    if (suitem.MedicationStopDate != null && suitem.MedicationResumeDate == null) {
                                        suitem.IsMedicationStopped = true;
                                    }
                                    var matchingItem1 = $scope.FrequentMedicationsList.find(function (frequentItem) {
                                        return frequentItem.MedicineId === suitem.MedicineId;
                                    });

                                    matchingItem1 = matchingItem1 || "";
                                    if (matchingItem1 != "") {
                                        matchingItem1.IsChecked = true;
                                    }

                                    suitem.Continuefield = suitem.Continuefield || "";

                                    if (suitem.MedicineId != 1 && suitem.MedicineId != 2) {
                                        if (suitem.Continuefield == "") {
                                            suitem.Continuefield = "Yes";
                                        } else {
                                            suitem.Continuefield = suitem.Continuefield;
                                        }
                                    }

                                });
                            }

                            if ($scope.ReconcileMainObj.CurrentSystemicMedicationsHistory.length > 0) {
                                $scope.obj.CurrentSystemicMedicationsHistory = $scope.ReconcileMainObj.CurrentSystemicMedicationsHistory || [];
                                if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
                                    let List = $filter("filter")($scope.obj.CurrentSystemicMedicationsHistory, function (fitem) {
                                        return fitem.MedicineId === 2 && fitem.DeleteInd == 'N';
                                    }, true);
                                    if (List.length > 0) {
                                        $scope.obj.isNKCSMSelected = true;
                                    } else {
                                        $scope.obj.isNKCSMSelected = false;
                                    }
                                }
                                angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (item) {
                                    item.IsEdit = false;
                                    if (item.Remarks != '') {
                                        item.ShowNote = true;
                                    }
                                    item.Duration = item.Duration || "";
                                    if (item.Duration == "") { item.ShowDateFormat = true; } else { item.ShowDateFormat = false; }
                                    item.MedicineObject = item.Sig || "";
                                    item.SelectedMedicationHistory = 'CurrentSystemicMedication';
                                });
                                $scope.obj.CurrentSystemicMedicationsHistory[0].IsEdit = true;
                                $scope.obj.ReconcileMedicationSummaryView = true;
                                let tempcsystamicforlogs = angular.copy($scope.obj.CurrentSystemicMedicationsHistory) || [];

                                let tempCurrentEyeMedicationsArray = $filter('filter')(tempcsystamicforlogs, { 'MedicationLocationTypeId': 1 }, true) || [];
                                let tempCurrentSystemicMedicationsArray = $filter('filter')(tempcsystamicforlogs, { 'MedicationLocationTypeId': 2 }, true) || [];
                                if (tempCurrentEyeMedicationsArray.length > 0) {
                                    $scope.LogObj.CurrentEyeMedications = angular.copy(tempCurrentEyeMedicationsArray);
                                }
                                if (tempCurrentSystemicMedicationsArray.length > 0) {
                                    $scope.LogObj.CurrentSystemicMedicationsHistory = angular.copy(tempCurrentSystemicMedicationsArray);
                                }
                            }


                            $scope.obj.ReconciliationReviewedByName = $scope.obj.ReconciliationReviewedByName || "";
                            $scope.obj.ReconciliationReviewedById = angular.copy($scope.ReconcileMainObj.ReconciliationReviewedById) || null;
                            $scope.LogObj.ReconciliationReviewedById = angular.copy($scope.ReconcileMainObj.ReconciliationReviewedById) || null;
                            if ($scope.ReconcileMainObj.ReconciliationReviewedById != "") {
                                var filteredArray = $filter("filter")($scope.allUserList, { "DoctorID": $scope.ReconcileMainObj.ReconciliationReviewedById }, true) || [];
                                if (filteredArray.length > 0) {
                                    $scope.obj.ReconciliationReviewedByName = filteredArray[0].FullName || "";
                                };
                            }

                            $scope.obj.ReconcileMedicationList = [];
                            $scope.obj.CurrentEyeMedicationArray = $scope.obj.CurrentEyeMedicationArray || [];
                            if ($scope.obj.CurrentEyeMedicationArray.length !== 0) {
                                $scope.obj.ReconcileMedicationList = $scope.obj.ReconcileMedicationList.concat($scope.obj.CurrentEyeMedicationArray);
                            }
                            if ($scope.obj.CurrentSystemicMedicationsHistory.length !== 0) {
                                $scope.obj.ReconcileMedicationList = $scope.obj.ReconcileMedicationList.concat($scope.obj.CurrentSystemicMedicationsHistory);
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

                            $scope.initLogo();

                        });
                    }

                    $scope.Rosinit();
                    $scope.obj.IsClickSaveMedReconciliationBtn = false;
                    $scope.SaveRosData = function () {
                        $scope.obj.type = "RosHistory";
                        $scope.LogObj.LogArray = [];

                        if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {

                            var i = 0;
                            var j = 0;

                            angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (mitem) {
                                mitem.IsMedicationStopped = mitem.IsMedicationStopped || false;
                                mitem.SelectedMedicationHistory = 'CurrentSystemicMedication';
                                mitem.MedicationStopDate = mitem.MedicationStopDate || null;
                                mitem.LastUsedDate = mitem.LastUsedDate || null;
                                if (mitem.MedicationStopDate != null) {
                                    mitem.MedicationStopDate = $filter('date')(mitem.MedicationStopDate, 'yyyy-MM-dd');
                                }

                                if (mitem.IsMedicationStopped) {

                                    mitem.MedicationStopDate = mitem.MedicationStopDate || '';
                                    if (mitem.MedicationStopDate == '') {
                                        i++;
                                    }

                                    mitem.MedicationStopRemarks = mitem.MedicationStopRemarks || "";
                                    if (mitem.MedicationStopRemarks == "") {
                                        j++;
                                    }

                                }
                            });

                            if (i > 0) {
                                alertify.error("Please select stop date!");
                                return false;
                            }

                            if (j > 0) {
                                alertify.error("Please select remarks!");
                                return false;
                            }
                        }

                        $scope.obj.CurrentEyeMedicationArray = $scope.obj.CurrentEyeMedicationArray || [];
                        if ($scope.obj.CurrentEyeMedicationArray.length > 0) {

                            var a = 0;
                            var b = 0;

                            angular.forEach($scope.obj.CurrentEyeMedicationArray, function (Aitem) {
                                Aitem.SelectedMedicationHistory = 'CurrentEyeMedication';
                                Aitem.IsMedicationStopped = Aitem.IsMedicationStopped || false;
                                Aitem.LastUsedDate = Aitem.LastUsedDate || null;

                                if (Aitem.MedicationStopDate != null) {
                                    Aitem.MedicationStopDate = $filter('date')(Aitem.MedicationStopDate, 'yyyy-MM-dd');
                                }

                                if (Aitem.IsMedicationStopped) {

                                    Aitem.MedicationStopDate = Aitem.MedicationStopDate || null;
                                    if (Aitem.MedicationStopDate == '') {
                                        a++;
                                    }

                                    Aitem.MedicationStopRemarks = Aitem.MedicationStopRemarks || "";
                                    if (Aitem.MedicationStopRemarks == "") {
                                        b++;
                                    }

                                }
                            });


                            if (a > 0) {
                                alertify.error("Please select stop date!");
                                return false;
                            }

                            if (b > 0) {
                                alertify.error("Please select remarks!");
                                return false;
                            }
                        }


                        let TypeId = null;
                        let TypeName = "";
                        if ($scope.ScreenObj.TypeId != null) {
                            TypeId = $scope.ScreenObj.TypeId;
                        }
                        if ($scope.ScreenObj.TypeName != null) {
                            TypeName = $scope.ScreenObj.TypeName;
                        }


                        let rossubmitreq = {
                            "VisitId": $scope.cacheStorageItem.PatientVisitId,
                            "PatientId": $scope.cacheStorageItem.PatientId,
                            //"ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                            "AppointmentID": $scope.cacheStorageItem.AppointmentId,
                            "HospitalId": $scope.HospitalId,
                            "UserId": $scope.UserId,
                            "TypeId": TypeId,
                            "TypeName": TypeName,
                            "AllergyItems": $scope.obj.AllergyItems || [],
                            "SystemicHistory": [],
                            "SurgicalHistory": [],
                            "CurrentSystemicMedicationsHistory": $scope.obj.CurrentSystemicMedicationsHistory || [],
                            "MedicalConditions": $scope.obj.CurrentEyeMedicationArray || [],
                            "ROSOverAllRemarks": "",
                            "ReconciliationReviewedById": $scope.obj.ReconciliationReviewedById || null,
                            "AllergyRemarks": $scope.ReconcileMainObj.AllergyRemarks || "",
                            "CurrentEyeRemarks": $scope.ReconcileMainObj.CurrentEyeRemarks || "",
                            "CurrentSystemicRemarks": $scope.ReconcileMainObj.CurrentSystemicRemarks || "",
                            "SurgicalRemarks": $scope.ReconcileMainObj.SurgicalRemarks || "",
                            "SystemicHistoryRemarks": $scope.ReconcileMainObj.SystemicHistoryRemarks || "",
                            "LifestyleHistoryRemarks": $scope.ReconcileMainObj.LifestyleHistoryRemarks || "",
                            "SystemicHistory": $scope.ReconcileMainObj.SystemicHistory,
                            "NeurologicNotes": $scope.ReconcileMainObj.NeurologicNotes || null,
                            "HeentNotes": $scope.ReconcileMainObj.HeentNotes || null,
                            "LungsNotes": $scope.ReconcileMainObj.LungsNotes || null,
                            "GeneralAppearenceNotes": $scope.ReconcileMainObj.GeneralAppearenceNotes || null,
                            "CardiacNotes": $scope.ReconcileMainObj.CardiacNotes || null,
                            "EndocrineNotes": $scope.ReconcileMainObj.EndocrineNotes || null,

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
                                    "ScreenType": "Medication Reconciliation(Allergies)",
                                    "ActionType": "Added",
                                    "OldActionDescription": '',
                                    "NewActionDescription": description.trim(),
                                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                };
                                $scope.LogObj.LogArray.push(obj);

                            }
                        }

                        if (rossubmitreq.CurrentSystemicMedicationsHistory.length > 0) {

                            let tempCurrentEyeMedicationsList = $filter('filter')(rossubmitreq.CurrentSystemicMedicationsHistory, { 'MedicationLocationTypeId': 1 }, true) || [];
                            let tempCurrentSystemicMedicationsHistory = $filter('filter')(rossubmitreq.CurrentSystemicMedicationsHistory, { 'MedicationLocationTypeId': 2 }, true) || [];
                            let NewValue = '';
                            let OldValue = '';
                            let logcount = 0;
                            if (tempCurrentEyeMedicationsList.length > 0) {
                                $scope.LogObj.CurrentEyeMedications = $scope.LogObj.CurrentEyeMedications || [];
                                let tempCurrentEyeMedicationsList1 = tempCurrentEyeMedicationsList || [];

                                let getActionName = id => ($filter("filter")($scope.actionArray, { MedicineDosaageFieldId: id || 0 }, true)[0] || {}).Description || "";
                                let getDoseName = id => ($filter("filter")($scope.doseArray, { MedicineDosaageFieldId: id || 0 }, true)[0] || {}).Description || "";
                                let getDoseUnitName = id => ($filter("filter")($scope.doseUnitArray, { MedicineDosaageFieldId: id || 0 }, true)[0] || {}).Description || "";
                                let getRouteName = id => ($filter("filter")($scope.routeArray, { MedicineDosaageFieldId: id || 0 }, true)[0] || {}).Description || "";
                                let getDoseTimeName = id => ($filter("filter")($scope.frequencyArray, { MedicineDosaageFieldId: id || 0 }, true)[0] || {}).Description || "";
                                // helper: build description for a prescription
                                function buildPrescriptionDescription(oldItem, newItem) {
                                    let oldparts = [], newparts = [];

                                    if (newItem?.MedicationLocationTypeId !== oldItem?.MedicationLocationTypeId) {
                                        if (newItem?.MedicationLocationTypeId) {
                                            newparts.push(`MedicationLocationType: ${newItem.MedicationLocationType}`);
                                        }
                                        if (oldItem?.MedicationLocationTypeId) {
                                            oldparts.push(`MedicationLocationType: ${oldItem.MedicationLocationType}`);
                                        }
                                    }
                                    if (newItem?.MedicineName) newparts.push("Medication: " + newItem.MedicineName);
                                    if (oldItem?.MedicineName) oldparts.push("Medication: " + oldItem.MedicineName);



                                    if (newItem?.ActionId != oldItem?.ActionId) {
                                        if (newItem?.ActionId) newparts.push("Action: " + getActionName(newItem.ActionId));
                                        if (oldItem?.ActionId) oldparts.push("Action: " + getActionName(oldItem.ActionId));

                                    }

                                    if (newItem?.DoseId != oldItem?.DoseId) {
                                        if (newItem?.DoseId) newparts.push("Dose: " + getDoseName(newItem.DoseId));
                                        if (oldItem?.DoseId) oldparts.push("Dose: " + getDoseName(oldItem.DoseId));
                                    }
                                    if (newItem?.DoseUnitId != oldItem?.DoseUnitId) {
                                        if (newItem?.DoseUnitId) newparts.push("Dose Unit: " + getDoseUnitName(newItem.DoseUnitId));
                                        if (oldItem?.DoseUnitId) oldparts.push("Dose Unit: " + getDoseUnitName(oldItem.DoseUnitId));
                                    }
                                    if (newItem?.RouteId != oldItem?.RouteId) {
                                        if (newItem?.RouteId) newparts.push("Route: " + getRouteName(newItem.RouteId));
                                        if (oldItem?.RouteId) oldparts.push("Route: " + getRouteName(oldItem.RouteId));
                                    }
                                    if (newItem?.FrequencyId != oldItem?.FrequencyId) {
                                        if (newItem?.FrequencyId) newparts.push("Dose Timing: " + getDoseTimeName(newItem.FrequencyId));
                                        if (oldItem?.FrequencyId) oldparts.push("Dose Timing: " + getDoseTimeName(oldItem.FrequencyId));
                                    }
                                    //if (newItem?.DoseOtherId != oldItem?.DoseOtherId) {
                                    //    if (newItem?.DoseOtherId) newparts.push("Other: " + getDoseOtherName(newItem.DoseOtherId));
                                    //    if (oldItem?.DoseOtherId) oldparts.push("Other: " + getDoseOtherName(oldItem.DoseOtherId));
                                    //}
                                    //if (newItem?.DaysSupplyId != oldItem?.DaysSupplyId) {
                                    //    if (newItem?.DaysSupplyId) newparts.push("Days Supply: " + getDaysSupplyName(newItem.DaysSupplyId));
                                    //    if (oldItem?.DaysSupplyId) oldparts.push("Days Supply: " + getDaysSupplyName(oldItem.DaysSupplyId));
                                    //}

                                    if (newItem?.LastUsedDate !== oldItem?.LastUsedDate) {
                                        if (newItem?.LastUsedDate) {
                                            newparts.push(`LastUsedDate: ${newItem.LastUsedDate}`);
                                        }
                                        if (oldItem?.LastUsedDate) {
                                            oldparts.push(`LastUsedDate: ${oldItem.LastUsedDate}`);
                                        }
                                    }


                                    if (newItem?.MedicationStopRemarks !== oldItem?.MedicationStopRemarks) {
                                        if (newItem?.MedicationStopRemarks) {
                                            newparts.push(`MedicationStopRemarks: ${newItem.MedicationStopRemarks}`);
                                        }
                                        if (oldItem?.MedicationStopRemarks) {
                                            oldparts.push(`MedicationStopRemarks: ${oldItem.MedicationStopRemarks}`);
                                        }
                                    }

                                    if (newItem?.MedicationLocationTypeId !== oldItem?.MedicationLocationTypeId) {
                                        if (newItem?.MedicationLocationTypeId) {
                                            newparts.push(`MedicationLocationType: ${newItem.MedicationLocationType}`);
                                        }
                                        if (oldItem?.MedicationLocationTypeId) {
                                            oldparts.push(`MedicationLocationType: ${oldItem.MedicationLocationType}`);
                                        }
                                    }


                                    if (newItem?.MedicationResumeRemarks !== oldItem?.MedicationResumeRemarks) {
                                        if (newItem?.MedicationResumeRemarks) {
                                            newparts.push(`MedicationResumeRemarks: ${newItem.MedicationResumeRemarks}`);
                                        }
                                        if (oldItem?.MedicationResumeRemarks) {
                                            oldparts.push(`MedicationResumeRemarks: ${oldItem.MedicationResumeRemarks}`);
                                        }
                                    }

                                    if (newItem?.MedicationResumeDate !== oldItem?.MedicationResumeDate) {
                                        if (newItem?.MedicationResumeDate) {
                                            newparts.push(`MedicationResumeDate: ${newItem.MedicationResumeDate}`);
                                        }
                                        if (oldItem?.MedicationResumeDate) {
                                            oldparts.push(`MedicationResumeDate: ${oldItem.MedicationResumeDate}`);
                                        }
                                    }




                                    return {
                                        newDesc: newparts.join(", "),
                                        oldDesc: oldparts.join(", ")
                                    };
                                }

                                tempCurrentEyeMedicationsList1.forEach(function (newItem) {
                                    let deletecount = 0;

                                    if (newItem.DeleteInd == 'Y') deletecount++;

                                    let oldItem = ($scope.LogObj.CurrentEyeMedications || []).find(x => x.MedicineId == newItem.MedicineId);
                                    let { newDesc, oldDesc } = buildPrescriptionDescription(oldItem, newItem);

                                    // Deleted
                                    if (deletecount > 0) {
                                        let obj = {
                                            "LogId": 0,
                                            "ModuleId": 2,
                                            "ModuleName": "ASC",
                                            "SubModuleId": 3,
                                            "SubModuleName": "medical recancillation ",
                                            "ScreenType": "medical recancillation ",
                                            "ActionType": "Deleted",
                                            "OldActionDescription": oldDesc || newDesc,
                                            "NewActionDescription": "",
                                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                        };
                                        $scope.LogObj.LogArray.push(obj);
                                    }
                                    if (newDesc != oldDesc) {
                                        if (newDesc) {
                                            NewValue += `${NewValue ? '\n ' : ''}${newDesc}`;
                                        }
                                        if (oldDesc) {
                                            OldValue += `${OldValue ? '\n ' : ''}${oldDesc}`;
                                        }
                                        logcount++;
                                    }



                                });

                            }

                            if (tempCurrentSystemicMedicationsHistory.length > 0) {
                                $scope.LogObj.CurrentSystemicMedicationsHistory = $scope.LogObj.CurrentSystemicMedicationsHistory || [];
                                let tempCurrentEyeMedicationsList2 = tempCurrentSystemicMedicationsHistory || [];


                                let getActionName = id => ($filter("filter")($scope.actionArray, { MedicineDosaageFieldId: id || 0 }, true)[0] || {}).Description || "";
                                let getDoseName = id => ($filter("filter")($scope.doseArray, { MedicineDosaageFieldId: id || 0 }, true)[0] || {}).Description || "";
                                let getDoseUnitName = id => ($filter("filter")($scope.doseUnitArray, { MedicineDosaageFieldId: id || 0 }, true)[0] || {}).Description || "";
                                let getRouteName = id => ($filter("filter")($scope.routeArray, { MedicineDosaageFieldId: id || 0 }, true)[0] || {}).Description || "";
                                let getDoseTimeName = id => ($filter("filter")($scope.frequencyArray, { MedicineDosaageFieldId: id || 0 }, true)[0] || {}).Description || "";
                                // helper: build description for a prescription
                                function buildPrescriptionDescription(oldItem, newItem) {
                                    let oldparts = [], newparts = [];
                                    if (newItem?.MedicineName) newparts.push("Medication: " + newItem.MedicineName);
                                    if (oldItem?.MedicineName) oldparts.push("Medication: " + oldItem.MedicineName);

                                    if (newItem?.MedicationLocationTypeId !== oldItem?.MedicationLocationTypeId) {
                                        if (newItem?.MedicationLocationTypeId) {
                                            newparts.push(`MedicationLocationType: ${newItem.MedicationLocationType}`);
                                        }
                                        if (oldItem?.MedicationLocationTypeId) {
                                            oldparts.push(`MedicationLocationType: ${oldItem.MedicationLocationType}`);
                                        }
                                    }

                                    if (newItem?.ActionId != oldItem?.ActionId) {
                                        if (newItem?.ActionId) newparts.push("Action: " + getActionName(newItem.ActionId));
                                        if (oldItem?.ActionId) oldparts.push("Action: " + getActionName(oldItem.ActionId));

                                    }

                                    if (newItem?.DoseId != oldItem?.DoseId) {
                                        if (newItem?.DoseId) newparts.push("Dose: " + getDoseName(newItem.DoseId));
                                        if (oldItem?.DoseId) oldparts.push("Dose: " + getDoseName(oldItem.DoseId));
                                    }
                                    if (newItem?.DoseUnitId != oldItem?.DoseUnitId) {
                                        if (newItem?.DoseUnitId) newparts.push("Dose Unit: " + getDoseUnitName(newItem.DoseUnitId));
                                        if (oldItem?.DoseUnitId) oldparts.push("Dose Unit: " + getDoseUnitName(oldItem.DoseUnitId));
                                    }
                                    if (newItem?.RouteId != oldItem?.RouteId) {
                                        if (newItem?.RouteId) newparts.push("Route: " + getRouteName(newItem.RouteId));
                                        if (oldItem?.RouteId) oldparts.push("Route: " + getRouteName(oldItem.RouteId));
                                    }
                                    if (newItem?.FrequencyId != oldItem?.FrequencyId) {
                                        if (newItem?.FrequencyId) newparts.push("Dose Timing: " + getDoseTimeName(newItem.FrequencyId));
                                        if (oldItem?.FrequencyId) oldparts.push("Dose Timing: " + getDoseTimeName(oldItem.FrequencyId));
                                    }
                                    //if (newItem?.DoseOtherId != oldItem?.DoseOtherId) {
                                    //    if (newItem?.DoseOtherId) newparts.push("Other: " + getDoseOtherName(newItem.DoseOtherId));
                                    //    if (oldItem?.DoseOtherId) oldparts.push("Other: " + getDoseOtherName(oldItem.DoseOtherId));
                                    //}
                                    //if (newItem?.DaysSupplyId != oldItem?.DaysSupplyId) {
                                    //    if (newItem?.DaysSupplyId) newparts.push("Days Supply: " + getDaysSupplyName(newItem.DaysSupplyId));
                                    //    if (oldItem?.DaysSupplyId) oldparts.push("Days Supply: " + getDaysSupplyName(oldItem.DaysSupplyId));
                                    //}

                                    if (newItem?.LastUsedDate !== oldItem?.LastUsedDate) {
                                        if (newItem?.LastUsedDate) {
                                            newparts.push(`LastUsedDate: ${newItem.LastUsedDate}`);
                                        }
                                        if (oldItem?.LastUsedDate) {
                                            oldparts.push(`LastUsedDate: ${oldItem.LastUsedDate}`);
                                        }
                                    }


                                    if (newItem?.MedicationStopRemarks !== oldItem?.MedicationStopRemarks) {
                                        if (newItem?.MedicationStopRemarks) {
                                            newparts.push(`MedicationStopRemarks: ${newItem.MedicationStopRemarks}`);
                                        }
                                        if (oldItem?.MedicationStopRemarks) {
                                            oldparts.push(`MedicationStopRemarks: ${oldItem.MedicationStopRemarks}`);
                                        }
                                    }

                                    if (newItem?.MedicationLocationTypeId !== oldItem?.MedicationLocationTypeId) {
                                        if (newItem?.MedicationLocationTypeId) {
                                            newparts.push(`MedicationLocationType: ${newItem.MedicationLocationType}`);
                                        }
                                        if (oldItem?.MedicationLocationTypeId) {
                                            oldparts.push(`MedicationLocationType: ${oldItem.MedicationLocationType}`);
                                        }
                                    }


                                    if (newItem?.MedicationResumeRemarks !== oldItem?.MedicationResumeRemarks) {
                                        if (newItem?.MedicationResumeRemarks) {
                                            newparts.push(`MedicationResumeRemarks: ${newItem.MedicationResumeRemarks}`);
                                        }
                                        if (oldItem?.MedicationResumeRemarks) {
                                            oldparts.push(`MedicationResumeRemarks: ${oldItem.MedicationResumeRemarks}`);
                                        }
                                    }

                                    if (newItem?.MedicationResumeDate !== oldItem?.MedicationResumeDate) {
                                        if (newItem?.MedicationResumeDate) {
                                            newparts.push(`MedicationResumeDate: ${newItem.MedicationResumeDate}`);
                                        }
                                        if (oldItem?.MedicationResumeDate) {
                                            oldparts.push(`MedicationResumeDate: ${oldItem.MedicationResumeDate}`);
                                        }
                                    }




                                    return {
                                        newDesc: newparts.join(", "),
                                        oldDesc: oldparts.join(", ")
                                    };
                                }

                                tempCurrentEyeMedicationsList2.forEach(function (newItem) {
                                    let deletecount = 0;

                                    if (newItem.DeleteInd == 'Y') deletecount++;

                                    let oldItem = ($scope.LogObj.CurrentSystemicMedicationsHistory || []).find(x => x.MedicineId == newItem.MedicineId);
                                    let { newDesc, oldDesc } = buildPrescriptionDescription(oldItem, newItem);

                                    // Deleted
                                    if (deletecount > 0) {
                                        let obj = {
                                            "LogId": 0,
                                            "ModuleId": 2,
                                            "ModuleName": "ASC",
                                            "SubModuleId": 3,
                                            "SubModuleName": "medical recancillation ",
                                            "ScreenType": "medical recancillation ",
                                            "ActionType": "Deleted",
                                            "OldActionDescription": oldDesc || newDesc,
                                            "NewActionDescription": "",
                                            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                        };
                                        $scope.LogObj.LogArray.push(obj);
                                    }
                                    if (newDesc != oldDesc) {
                                        if (newDesc) {
                                            NewValue += `${NewValue ? '\n ' : ''}${newDesc}`;
                                        }
                                        if (oldDesc) {
                                            OldValue += `${OldValue ? '\n ' : ''}${oldDesc}`;
                                        }
                                        logcount++;
                                    }

                                });
                            }

                            if (logcount) {

                                let Screentype = '';
                                if (OldValue == '') {
                                    Screentype = 'Added';
                                } else {
                                    Screentype = 'Edited';
                                }
                                let obj = {
                                    "LogId": 0,
                                    "ModuleId": 2,
                                    "ModuleName": "ASC",
                                    "SubModuleId": 3,
                                    "SubModuleName": "Medication Reconciliation",
                                    "ScreenType": "Medication Reconciliation(medications)",
                                    "ActionType": Screentype,
                                    "OldActionDescription": OldValue,
                                    "NewActionDescription": NewValue,
                                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                };
                                $scope.LogObj.LogArray.push(obj);
                            }

                        }


                        $scope.obj.ReconciliationReviewedById = $scope.obj.ReconciliationReviewedById || null;
                        if ($scope.obj.ReconciliationReviewedById != null) {
                            let editStatusReviewedcount = 0;
                            let ActionType = '';
                            var Newvalue = '';
                            var OldValue = '';

                            if ($scope.LogObj.ReconciliationReviewedById == null) {
                                ActionType = 'Added';
                            } else {
                                ActionType = 'Edited';
                            }

                            if ($scope.obj.ReconciliationReviewedById != $scope.LogObj.ReconciliationReviewedById) {
                                editStatusReviewedcount++
                            }


                            if ($scope.obj.ReconciliationReviewedById != $scope.LogObj.ReconciliationReviewedById) {
                                let NewAffecteditem = '';
                                let OldAffecteditem = '';
                                let NewSurgeon = $filter("filter")($scope.allUserList, function (item) {
                                    return item.DoctorID == $scope.obj.ReconciliationReviewedById;
                                });
                                if (NewSurgeon.length > 0) {
                                    NewAffecteditem = `Reviewed By: : ${NewSurgeon[0].FullName}`;
                                    Newvalue += `${Newvalue ? ', ' : ''}${NewAffecteditem}`;
                                }
                                let OldSurgeon = $filter("filter")($scope.allUserList, function (item) {
                                    return item.DoctorID == $scope.LogObj.ReconciliationReviewedById;
                                });
                                if (OldSurgeon.length > 0) {
                                    OldAffecteditem = `Reviewed By: : ${OldSurgeon[0].FullName}`;
                                    OldValue += `${OldValue ? ', ' : ''}${OldAffecteditem}`;
                                }
                            }




                            if (editStatusReviewedcount != 0) {
                                let obj = {
                                    "LogId": 0,
                                    "ModuleId": $scope.ModeuleId || 0,
                                    "ModuleName": $scope.ModuleName || '',
                                    "SubModuleId": 17,
                                    "SubModuleName": "Medication Reconciliation",
                                    "ScreenType": "Medication Reconciliation Reviewed By:",
                                    "ActionType": ActionType,
                                    "OldActionDescription": OldValue,
                                    "NewActionDescription": Newvalue,
                                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                                };
                                $scope.LogObj.LogArray.push(obj);
                            }
                        }


                        if ($scope.LogObj.LogArray.length > 0) {
                            rossubmitreq.Logs = $scope.LogObj || {};
                        }
                        $scope.obj.IsClickSaveMedReconciliationBtn = true;
                        eHnoteDiagnosisDataServices.AddupdateROSData(rossubmitreq).then(function (resp) {

                            if (resp.data.Status === "Success") {
                                $scope.obj.AllergyItems = angular.copy(resp.data.AllergyItems);
                                $scope.obj.CurrentSystemicMedicationsHistory = angular.copy(resp.data.CurrentSystemicMedicationsHistory);
                                $scope.obj.CurrentEyeMedicationArray = angular.copy(resp.data.MedicalConditions);
                                $scope.obj.IsReconciliationDataInd = true;
                                alertify.success('Data saved successfully!');
                                $scope.obj.IsClickSaveMedReconciliationBtn = false;

                            }

                            $scope.Rosinit();

                        }, function () {
                            $scope.obj.IsClickSaveMedReconciliationBtn = false;
                            alertify.error("Getting Failed");
                        });
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
                        const userOldAllergies = $filter("filter")($scope.LogObj.AllergyItems, { "CreatedBy": $scope.UserId }, true) || [];
                        $scope.obj.AllergyItems = $scope.obj.AllergyItems || [];
                        $scope.LogObj.AllergyItems = $scope.LogObj.AllergyItems || [];
                        let count = 0;
                        let dltcount = 0;
                        let dltallergyNames = '';
                        let DifferenceItem = [];

                        angular.forEach($scope.obj.AllergyItems, function (item) {
                            item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy") || null;
                            item.DurationType = item.DurationType || '';
                            item.Duration = item.Duration || '';
                            item.Remarks = item.Remarks || '';
                            if (item.DeleteInd === 'Y') {
                                if (dltcount > 0) dltallergyNames += ', ';
                                dltallergyNames += item.AllergyName;
                                dltcount++;
                            } else {
                                let edited = $scope.LogObj.AllergyItems.filter(function (eitem) {
                                    eitem.DurationDate = $filter('date')(eitem.DurationDate, "MM-dd-yyyy") || null;
                                    eitem.DurationType = eitem.DurationType || '';
                                    eitem.Duration = eitem.Duration || '';
                                    eitem.Remarks = eitem.Remarks || '';
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
                            if (OldAffecteditem === '') {
                                actionType = 'Added';
                            }
                            let obj = {
                                "LogId": 0,
                                "ModuleId": 2,
                                "ModuleName": "ASC",
                                "SubModuleId": 3,
                                "SubModuleName": "ROS",
                                "ScreenType": "Medication Reconciliation(Allergies)",
                                "ActionType": actionType,
                                "OldActionDescription": userOldAllergies.length > 0 ? OldAffecteditem.trim() : '',
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
                                "ScreenType": "Medication Reconciliation(Allergies)",
                                "ActionType": "Deleted",
                                "OldActionDescription": description,
                                "NewActionDescription": '',
                                "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                            };
                            $scope.LogObj.LogArray.push(obj);
                        }
                    };


                    $scope.uibclose = function () {
                        $uibModalInstance.close($scope.obj);
                    };

                    $scope.ShowMedicationDate = function (item) {
                        item.IsMedicationDateInd = !item.IsMedicationDateInd;
                        if (item.IsMedicationDateInd) {
                            item.MedicationResumeDate = $filter("date")(new Date(), "MM-dd-yyyy");
                        } else {
                            item.MedicationResumeDate = null;
                        }
                    }

                    $scope.RosMedicationShowhide = function (type) {
                        if (type == 1) {
                            $scope.obj.ReconciliationAllergySummaryView = !$scope.obj.ReconciliationAllergySummaryView;
                        } else {
                            $scope.obj.ReconcileMedicationSummaryView = !$scope.obj.ReconcileMedicationSummaryView;
                        }
                    }

                    $scope.SelectMedDate = function (item) {
                        item.MedicationStopDate = item.MedicationStopDate || null;
                        item.MedicationResumeDate = item.MedicationResumeDate || null;
                        if (item.MedicationStopDate != null && item.MedicationResumeDate == null) {
                            item.IsMedicationStopped = true;
                        } else {
                            item.IsMedicationStopped = false;
                        }
                    }

                    $scope.changemedicationtype = function (item, type) {
                        if (type == "Eye") {
                            item.MedicationLocationType = "Eye";
                            item.MedicationLocationTypeId = 1;
                        } else {
                            item.MedicationLocationType = "General";
                            item.MedicationLocationTypeId = 2;
                        }
                    }

                    $scope.ClearAllMedicationDates = function (item) {
                        item.MedicationStopDate = null;
                        item.MedicationStopRemarks = "";
                        item.MedicationResumeDate = null;
                        item.MedicationResumeRemarks = "";
                        item.IsMedicationStopped = false;
                    }

                    $scope.DataURL = function (dataURL, callback) {
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

                    $scope.initLogo = function () {
                        var printobj = datapersistanceFactory.getItem("printSettingData");
                        console.log(printobj);
                        printobj.PrintHeaderImgUrl = printobj.PrintHeaderImgUrl || "";
                        if (printobj.PrintHeaderImgUrl !== "") {
                            $scope.DataURL(printobj.PrintHeaderImgUrl, function (dataURL) {
                                $scope.HeaderImage = dataURL;
                            });
                        }
                    }

                    $scope.MedicationPrint = function () {
                        var AppointmentDoctor = '';
                        var UserFullName = '';
                        var LicenseNumber = '';

                        if ($scope.cacheStorageItem.selectedApptObj != undefined) {
                            $scope.DoctorArray = $filter("filter")($scope.allUserList, { "DoctorID": $scope.cacheStorageItem.selectedApptObj.DoctorID }, true) || [];
                            if ($scope.DoctorArray.length > 0) {
                                AppointmentDoctor = $scope.DoctorArray[0].FullName;
                                UserFullName = $scope.DoctorArray[0].UserFullName;
                                LicenseNumber = $scope.DoctorArray[0].LicenseNumber;
                            }

                        }
                        let CreatedByName = "";
                        if (doctorinfo.doctordata.User.length > 0) {
                            if (doctorinfo.doctordata.User[0].Suffix !== '') {
                                CreatedByName = CreatedByName + doctorinfo.doctordata.User[0].FullName + ' ' + doctorinfo.doctordata.User[0].Suffix || "";
                            } else {
                                CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
                            }
                        }

                        let SurgeonName = "";

                        let Surgeonlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.cacheStorageItem.DoctorID }, true);
                        if (Surgeonlist.length > 0) {
                            SurgeonName = Surgeonlist[0].UserFullName;
                        } else {
                            SurgeonName = '';
                        }

                        let ReconciliationReviewedName = "";
                        let ReconciliationReviewedLICNo = "";

                        let Reviewedlist = $filter("filter")($scope.allUserList, function (kitem) { return kitem.DoctorID == $scope.ReconcileMainObj.ReconciliationReviewedById }, true);
                        if (Reviewedlist.length > 0) {
                            ReconciliationReviewedName = Reviewedlist[0].UserFullName || "";
                            ReconciliationReviewedLICNo = Reviewedlist[0].LicenseNumber || "";
                        } else {
                            ReconciliationReviewedName = "";
                            ReconciliationReviewedLICNo = "";
                        }

                        if ($scope.cacheStorageItem.selectedApptObj != undefined) {
                            var TempArray = $filter("filter")($scope.allUserList, { "DoctorID": $scope.cacheStorageItem.selectedApptObj.DoctorID }, true) || [];
                            if (TempArray.length > 0) {
                                if (TempArray[0].SuffixId == 10 || TempArray[0].SuffixId == 13) {
                                    $scope.DoctorSignature = TempArray[0].SignatureOfUser || '';
                                }
                            }
                        }

                        let CurrentDate = $filter("date")(new Date(), "MM-dd-yyyy");

                        let CurrentTime = $filter("date")(new Date(), "hh:mm a");

                        let currentSystemicMedications = $filter('filter')(
                            $scope.obj.CurrentSystemicMedicationsHistory, function (item) {
                                return item.MedicationLocationTypeId === 1 || item.MedicationLocationTypeId === 2;
                            },
                            true
                        ) || [];

                        $timeout(function () {
                            var Object = {
                                "CreatedBy": CreatedByName || '',
                                "Name": $scope.cacheStorageItem.PatientName || '',
                                "Age": $scope.cacheStorageItem.Age || '',
                                "Gender": $scope.cacheStorageItem.Gender || '',
                                "PatientDisplayId": $scope.cacheStorageItem.PatientDisplayId || '',
                                "VisitReason": $scope.cacheStorageItem.VisitReason || '',
                                "PatientDOB": $scope.cacheStorageItem.PatientDOB || '',
                                "SurgeryDate": $scope.ApptSurgeryDetails.AscAppointmentDate || "",
                                "EhnoteLogoURL": $scope.HeaderImage || '',
                                "SurgeryName": $scope.ApptSurgeryDetails.SurgeryName || "",
                                "Surgeon": SurgeonName || "",
                                "AllergyItems": $scope.obj.AllergyItems || [],
                                "CurrentSystemicMedicationsHistory": currentSystemicMedications || [],
                                "ReconciliationReviewedName": ReconciliationReviewedName || '',
                                "ReconciliationReviewedLICNo": ReconciliationReviewedLICNo || '',
                                "ReconciliationCurrentDate": CurrentDate || '',
                                "ReconciliationCurrentTime": CurrentTime || '',
                                "DoctorSignatureURL": $scope.DoctorSignature || '',
                                "UserFullName": UserFullName || '',
                                "LicenseNumber": LicenseNumber || '',
                                "OrganizationDetails": $scope.OrganizationDetails || [],
                                "EhnoteOrganisationLogoUrl": $scope.OrganizationDetails?.[0]?.OrganizationLogoUrl || '',
                            }

                            USPrintService.GenerateMedicationPrint(Object);

                        }, 500);
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
                }
            });
            mInstanceAdd.result.then(function (data) {
                if (data.IsReconciliationDataInd == true) {
                    $scope.GetOTQuickAccessDetails();
                    $scope.$broadcast("RefreshPreAdmHPSummaryEvent", 2);
                }
            }, function (cancel) {

            });
        };
        $scope.navtoSuperBillPopup = function (item) {
            item = item || "";
            let appointmentinfo = {
                AppointmentID: $scope.cacheStorageItem.AppointmentId || 0,
                PatientID: $scope.cacheStorageItem.PatientID || 0,
                PatientName: $scope.cacheStorageItem.PatientName || '',
                DoctorName: $scope.cacheStorageItem.selectedApptObj.DoctorFullName || "",
                ConsultationDt: $scope.cacheStorageItem.AppointmentDate || '',
            };
            eHnoteMasterDataService.addAppointmentInfo(appointmentinfo);
            item.AppointmentID = item.AppointmentID || 0;
            $scope.cacheStorageItem.appointmentid = item.AppointmentID != 0 ? item.AppointmentID : (item.AppointmentId || 0);
            $scope.cacheStorageItem.ConsultationID = item.VisitId || 0;

            $scope.ActionArea = `Super Bill In ${$scope.ModuleName}` || '';

            let LogItem = {
                "SubModuleId": 19,
                "SubModuleName": "Super Bill",
                "ScreenType": $scope.ModuleName || '',
                "ActionType": "Accessed",
                "OldActionDescription": "",
                "NewActionDescription": `${$scope.ActionArea}`,
                //  "ActionDescription": `${$scope.ActionArea} For Appointment ID : ${$scope.LogObj.AppointmentId}`,
            }
            $scope.AddAuditLog(LogItem);
            //$scope.AddAscActionLog();
            $scope.IsInsuranceAvailable = (item.AppointmentInsuranceList || []).some(item => item.StatusId === 1);
            $scope.sbillmInstanceAdd = $uibModal.open({
                //"templateUrl": "templates/uibpopups/superbillpopup.html",
                "templateUrl": "templates/uibpopups/superbillpopup.html",
                "backdrop": "static",
                "resolve": {
                    "ParentObject": function () { return angular.copy(item); },
                    "cacheStorageItem": function () { return angular.copy($scope.cacheStorageItem); },
                    "allUserList": function () { return angular.copy($scope.allUserList) },
                    "IsInsuranceAvailable": function () { return $scope.IsInsuranceAvailable }
                },
                "keyboard": false,
                "windowClass": "modal__popup--1 bottom-to-top-modal",
                "controller": "UsSuperBillPopupCtrl",
            });
            $scope.sbillmInstanceAdd.result.then(function (result) {
                console.log(result);
            }, function (cancel) {
            });

        };
        $scope.navtoAllOrdersPopup = function () {
            $scope.PreOpAndDialationMedications = {
                "PatientASCPreOPId": 0,
                "AppointmentID": "",
                "PatientID": "",
                "DoctorID": "",
                "PreOpMedications": [],
                "DilationMedications": [],
                "SubTabType": 1,
                "DiabetesTimings": []
            }

            $scope.PreOpAndDialationMedications.AppointmentID = $scope.cacheStorageItem.AppointmentId || null;
            $scope.PreOpAndDialationMedications.PatientID = $scope.cacheStorageItem.PatientID || null;
            $scope.PreOpAndDialationMedications.DoctorID = $scope.cacheStorageItem.DoctorID || null;
            $scope.PreOpAndDialationMedications.PatientASCPreOPId = 0;
            $scope.PreOpAndDialationMedications.PatientSurgeryId = 0;

            console.log($scope.cacheStorageItem);
            $scope.cacheStorageItem = $scope.cacheStorageItem || "";
            // $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
            $scope.ActionArea = `All Orders Screen In ${$scope.ModuleName}` || '';

            let LogItem = {
                "SubModuleId": 36,
                "SubModuleName": "All Orders",
                "ScreenType": $scope.ModuleName || '',
                "ActionType": "Accessed",
                "OldActionDescription": "",
                "NewActionDescription": `${$scope.ActionArea}`,
                // "ActionDescription": `${$scope.ActionArea} For Appointment ID : ${$scope.LogObj.AppointmentId}`,
            }
            $scope.AddAuditLog(LogItem);
            $scope.mInstanceAdd = $uibModal.open({
                "templateUrl": "templates/uibpopups/dilationPrePostpopup.html",
                // "size": "lg",
                "backdrop": "static",
                "keyboard": false,
                "resolve": {
                    //"MedicationGivenByArray": function () { return $scope.MedicationGivenByArray; },
                    "PreOpAndDialationMedications": function () { return $scope.PreOpAndDialationMedications; },
                    "cacheStorageItem": function () { return $scope.cacheStorageItem; },
                    // "AscAppointmentsList": function () { return $scope.AscAppointmentsList; },
                    "UserAccessRights": function () { return $scope.UserAccessRights; },
                    "allUserList": function () { return $scope.allUserList; },
                    "ParentObj": function () { return $scope.ParentObj; },
                },
                "windowClass": "modal__ninety--",
                "controller": "USMedicationOrderPopupCtrl",
            });
            $scope.mInstanceAdd.result.then(function (resp) {
                if ($scope.TabObj.SelectedTab == 2 || $scope.TabObj.SelectedTab == 22) {
                    $scope.$broadcast("RefreshOrdersEvent", 2);
                } else if ($scope.TabObj.SelectedTab == 3 || $scope.TabObj.SelectedTab == 33) {
                    $scope.$broadcast("RefreshPreAdmHPSummaryEvent", 3);
                } else if ($scope.TabObj.SelectedTab == 4 || $scope.TabObj.SelectedTab == 44) {
                    $scope.$broadcast("RefreshPreAdmHPSummaryEvent", 4);
                } else {
                    $scope.$broadcast("RefreshPreAdmHPSummaryEvent", 3);
                }
            }, function () { });
        }

        $scope.GetPostOpMedicationObj = function () {
            return {
                "OrderName": "",
                "MedicineObject": "",
                "MedicationId": null,
                "OrganizationMedicationId": null,
                "MedicationName": "",
                "DeleteInd": "N",
                "FrequencyId": null,
                "DoseId": null,
                "DoseUnitId": null,
                "RouteId": null,
                "ActionId": null,

                "Frequency": "",
                "Dose": "",
                "DoseUnit": "",
                "Route": "",
                "Action": "",

                "OrderDescription": "",
                "MedicationNotes": "",
                "maxDose": "",
                "IsChecked": false,
                "EditIndex": -1,
                "OrderTypeId": OrderTypeId || null,
                "OrderTypeName": "",
                "IsmedSearchDisabled": false
            };
        };
        $scope.PostOpMedicationObj = angular.copy($scope.GetPostOpMedicationObj());

        $scope.IsOpenOrderPopup = function (type) {
            if (type == 'Preop') {
                $scope.PreOpTemplateobj.IsOpenOrderTemplate = !$scope.PreOpTemplateobj.IsOpenOrderTemplate;
            } else {
                $scope.PostOpTemplateobj.IsOpenOrderTemplate = !$scope.PostOpTemplateobj.IsOpenOrderTemplate;
            }

        }

        $scope.OnclickPatientSelf = function () {
            $scope.LasikTempObj.RecievedForSurgery = 'Self';
            $scope.LasikTempObj.RecievedForSurgeryNotes = '';
            $scope.LasikTempObj.RecievedForSurgeryNotesInd = false;
        };

        $scope.ClickOrderTemplate = {
            templateUrl: 'AddOrderTemplate.html',
        };
        $scope.OnSelectOrderTemplate = function (mainitem, medtype) {
            console.log(mainitem);
            if (medtype == 5) {
                $scope.AddPostOpOrderTemplate(mainitem);
                return;
            }
            if (medtype == 1) {
                let templist = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === 1 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];

                if (templist.length > 0) {
                    if (mainitem.PreOpMedications.length > 0) {

                        angular.forEach(mainitem.PreOpMedications, function (item) {
                            var i = 0;
                            angular.forEach($scope.LasikTempObj.OrderDetails, function (mitem) {
                                //if (mitem.OrderTypeId === 2) {
                                angular.forEach(mitem.PreOpMedications, function (citem) {
                                    if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                        i++
                                    }
                                });
                                /*}*/
                            });
                            if (i == 0) {
                                let List1 = $filter("filter")(templist[0].PreOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                                let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                                //if (List.length > 0) {
                                //    alertify.error("Medicine name already added!");
                                //    $scope.PostOpMedicationObj.MedicineObject = '';
                                //    return false;
                                //}
                                if (List.length == 0) {
                                    let GivenBy = null;
                                    let loggedUser = $filter('filter')($scope.PreopHandOffArray, { 'DoctorID': $scope.UserId }, true) || [];
                                    if (loggedUser.length > 0) {
                                        GivenBy = loggedUser[0].DoctorID;
                                    }


                                    var obj = {
                                        "AscMedicationId": 0,
                                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                        "ParentOrganizationId": $scope.ParentHospitalId,
                                        "ASCOrganizationMedicationId": 0,
                                        "Strength": item.Strength || '',
                                        "IsFrequent": item.IsFrequent || 'N',
                                        "MedicineId": item.MedicineId,
                                        "MedicationName": item.MedicationName,
                                        "IsChecked": false,
                                        "IsDilationMed": false,
                                        "IsIntraAnesthesiaMed": false,
                                        "IsIntraMed": false,
                                        "IsPreOPMed": false,
                                        "MedicationDosage": "",
                                        "DropTimings": [],
                                        //"DropTimings": [{
                                        //    "DropTimingId": 0,
                                        //    "MedicineId": item.MedicineId,
                                        //    "MedicationName": item.MedicationName,
                                        //    "GivenBy": GivenBy || null,
                                        //    "shownotes": false,
                                        //    "IsEditDrop": false,
                                        //    "IsEditview": false,
                                        //    "Remarks": "",
                                        //    "DeleteInd": "N",
                                        //    "MedicationTime": "",
                                        //    "MedicationDosage": ""
                                        //}],
                                        "TypeId": 4,
                                        "DeleteInd": "N",
                                        "Action": item.Action,
                                        "Dose": item.Dose,
                                        "DoseUnit": item.DoseUnit,
                                        "Route": item.Route,
                                        "Frequency": item.Frequency,
                                        "ActionId": item.ActionId,
                                        "DoseId": item.DoseId,
                                        "DoseUnitId": item.DoseUnitId,
                                        "RouteId": item.RouteId,
                                        "FrequencyId": item.FrequencyId,
                                        "OrderDescription": item.OrderDescription,
                                        "MedicationNotes": item.MedicationNotes,
                                        "maxDose": item.maxDose,
                                        "OrderTypeId": item.OrderTypeId,
                                        "OrderTypeName": item.OrderTypeName
                                    }
                                    templist[0].PreOpMedications.push(obj);
                                    $scope.DilationMedicationObj.MedicineObject = "";
                                }
                            }
                        });
                    }
                    if (mainitem.GeneralOrders.length > 0) {

                        angular.forEach(mainitem.GeneralOrders, function (item) {
                            var j = 0;
                            angular.forEach($scope.LasikTempObj.OrderDetails, function (mitem) {

                                angular.forEach(mitem.GeneralOrders, function (citem) {
                                    if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                        j++
                                    }
                                });

                            });
                            if (j == 0) {
                                let Gobj = {
                                    "GeneralOrderId": null,
                                    "MedicineName": item.MedicineName || '',
                                    "DeleteInd": "N",
                                    "Status": "",

                                }
                                templist[0].GeneralOrders.push(Gobj);
                            }
                        });
                    }

                }
                else {

                    //let templist2 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                    let templist2 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist2.length > 0) {
                        templist2[0].MedTypeId = 1;
                        templist2[0].MedTypeName = 'PreOP Medication';
                        templist2[0].UserType = 'Anesthesia';
                    } else {
                        //let templist3 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 1, 'DeleteInd': 'N' }, true) || [];
                        let templist3 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                            return oitem.MedTypeId === 1 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                        }) || [];
                        if (templist3.length > 0) {

                        } else {
                            var obj = {
                                "UserOrderId": 0,
                                "UserId": $scope.UserId,
                                "DeleteInd": "N",
                                "ReviewedBy": null,
                                "UserType": "Nurse",
                                "ScreenType": "Pre-Op",
                                "ScreenTypeId": 4,
                                "MedTypeId": 1,
                                "MedTypeName": 'PreOP Medication',
                                "PreOpMedications": [],
                                "GeneralOrders": [],
                                "DilationMedications": [],
                                "OrderTypeId": OrderTypeId || 2,
                                "OrderTypeName": "Live Medications",
                                "IsOrderReviewed": false,
                            }
                            $scope.LasikTempObj.OrderDetails.push(obj);
                        }

                    }
                    //let templist1 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 1, 'DeleteInd': 'N' }, true) || [];
                    let templist1 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 1 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist1.length > 0) {
                        if (mainitem.PreOpMedications.length > 0) {
                            angular.forEach(mainitem.PreOpMedications, function (item) {
                                var i = 0;
                                angular.forEach($scope.LasikTempObj.OrderDetails, function (mitem) {

                                    angular.forEach(mitem.PreOpMedications, function (citem) {
                                        if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                            i++
                                        }
                                    });

                                });
                                if (i == 0) {
                                    let List = $filter("filter")(templist1[0].PreOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId, 'DeleteInd': 'N' }, true) || [];
                                    //let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                                    //if (List.length > 0) {
                                    //    alertify.error("Medicine name already added!");
                                    //    $scope.PostOpMedicationObj.MedicineObject = "";
                                    //    return false;
                                    //}

                                    if (List.length == 0) {
                                        let GivenBy = null;
                                        let loggedUser = $filter('filter')($scope.PreopHandOffArray, { 'DoctorID': $scope.UserId }, true) || [];
                                        if (loggedUser.length > 0) {
                                            GivenBy = loggedUser[0].DoctorID;
                                        }


                                        var obj = {
                                            "AscMedicationId": 0,
                                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                            "ParentOrganizationId": $scope.ParentHospitalId,
                                            "ASCOrganizationMedicationId": 0,
                                            "Strength": item.Strength || '',
                                            "IsFrequent": item.IsFrequent || 'N',
                                            "MedicineId": item.MedicineId,
                                            "MedicationName": item.MedicationName,
                                            "IsChecked": false,
                                            "IsDilationMed": false,
                                            "IsIntraAnesthesiaMed": false,
                                            "IsIntraMed": false,
                                            "IsPreOPMed": false,
                                            "MedicationDosage": "",
                                            "DropTimings": [],
                                            //"DropTimings": [{
                                            //    "DropTimingId": 0,
                                            //    "MedicineId": item.MedicineId,
                                            //    "MedicationName": item.MedicationName,
                                            //    "GivenBy": GivenBy || null,
                                            //    "shownotes": false,
                                            //    "IsEditDrop": false,
                                            //    "IsEditview": false,
                                            //    "Remarks": "",
                                            //    "DeleteInd": "N",
                                            //    "MedicationTime": "",
                                            //    "MedicationDosage": ""
                                            //}],
                                            "TypeId": 4,
                                            "DeleteInd": "N",
                                            "Action": item.Action,
                                            "Dose": item.Dose,
                                            "DoseUnit": item.DoseUnit,
                                            "Route": item.Route,
                                            "Frequency": item.Frequency,
                                            "ActionId": item.ActionId,
                                            "DoseId": item.DoseId,
                                            "DoseUnitId": item.DoseUnitId,
                                            "RouteId": item.RouteId,
                                            "FrequencyId": item.FrequencyId,
                                            "OrderDescription": item.OrderDescription,
                                            "MedicationNotes": item.MedicationNotes,
                                            "maxDose": item.maxDose,
                                            "OrderTypeId": item.OrderTypeId,
                                            "OrderTypeName": item.OrderTypeName
                                        }
                                        templist1[0].PreOpMedications.push(obj);
                                        $scope.PreOpMedicationObj.MedicineObject = "";
                                    }
                                }
                            });
                        }
                        if (mainitem.GeneralOrders.length > 0) {
                            angular.forEach(mainitem.GeneralOrders, function (item) {
                                var j = 0;
                                angular.forEach($scope.LasikTempObj.OrderDetails, function (mitem) {

                                    angular.forEach(mitem.GeneralOrders, function (citem) {
                                        if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                            j++
                                        }
                                    });

                                });
                                if (j == 0) {
                                    let Gobj = {
                                        "GeneralOrderId": null,
                                        "MedicineName": item.MedicineName || '',
                                        "DeleteInd": "N",
                                        "Status": "",

                                    }
                                    templist1[0].GeneralOrders.push(Gobj);
                                }
                                //$scope.PostOpMedicationObj.OrderName = "";
                            });
                        }
                    }


                }

                let activeOrders = ($scope.LasikTempObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 1);

                let isColumnTrue = activeOrders.some(order =>
                (order.PreOpMedications &&
                    order.PreOpMedications.some(item => item.DeleteInd === 'N'))
                );
                if (isColumnTrue) {
                    $scope.LasikTempObj.DisableAnesthesiaOrdersCheck = isColumnTrue;
                    $scope.LasikTempObj.IsAnesthesiaOrdersTimeChecked = !isColumnTrue;
                }
            }
            else {
                //let templist = $filter("filter")($scope.LasikTempObj.OrderDetails, { "MedTypeId": 2, 'IsOrderReviewed': false, 'DeleteInd': 'N'}, true);
                let templist = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === 2 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];

                if (templist.length > 0) {
                    if (mainitem.DilationMedications.length > 0) {
                        angular.forEach(mainitem.DilationMedications, function (item) {
                            var i = 0;
                            angular.forEach($scope.LasikTempObj.OrderDetails, function (mitem) {

                                angular.forEach(mitem.DilationMedications, function (citem) {
                                    if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                        i++
                                    }
                                });

                            });
                            if (i == 0) {
                                let List1 = $filter("filter")(templist[0].DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                                let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                                //if (List.length > 0) {
                                //    alertify.error("Medicine name already added!");
                                //    $scope.PostOpMedicationObj.MedicineObject = '';
                                //    return false;
                                //}
                                if (List.length == 0) {
                                    let GivenBy = null;
                                    let loggedUser = $filter('filter')($scope.MedicationGivenByNurseArray, { 'DoctorID': $scope.UserId }, true) || [];
                                    if (loggedUser.length > 0) {
                                        GivenBy = loggedUser[0].DoctorID;
                                    }


                                    var obj = {
                                        "AscMedicationId": 0,
                                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                        "ParentOrganizationId": $scope.ParentHospitalId,
                                        "ASCOrganizationMedicationId": 0,
                                        "Strength": item.Strength || '',
                                        "IsFrequent": item.IsFrequent || 'N',
                                        "MedicineId": item.MedicineId,
                                        "MedicationName": item.MedicationName,
                                        "IsChecked": false,
                                        "IsDilationMed": false,
                                        "IsIntraAnesthesiaMed": false,
                                        "IsIntraMed": false,
                                        "IsPreOPMed": false,
                                        "MedicationDosage": "",
                                        "DropTimings": [],
                                        //"DropTimings": [{
                                        //    "DropTimingId": 0,
                                        //    "MedicineId": item.MedicineId,
                                        //    "MedicationName": item.MedicationName,
                                        //    "GivenBy": GivenBy || null,
                                        //    "shownotes": false,
                                        //    "IsEditDrop": false,
                                        //    "IsEditview": false,
                                        //    "Remarks": "",
                                        //    "DeleteInd": "N",
                                        //    "MedicationTime": "",
                                        //    "MedicationDosage": ""
                                        //}],
                                        "TypeId": 4,
                                        "DeleteInd": "N",
                                        "Action": item.Action,
                                        "Dose": item.Dose,
                                        "DoseUnit": item.DoseUnit,
                                        "Route": item.Route,
                                        "Frequency": item.Frequency,
                                        "ActionId": item.ActionId,
                                        "DoseId": item.DoseId,
                                        "DoseUnitId": item.DoseUnitId,
                                        "RouteId": item.RouteId,
                                        "FrequencyId": item.FrequencyId,
                                        "OrderDescription": item.OrderDescription,
                                        "MedicationNotes": item.MedicationNotes,
                                        "maxDose": item.maxDose,
                                        "OrderTypeId": item.OrderTypeId || null,
                                        "OrderTypeName": item.OrderTypeName || ''
                                    }
                                    templist[0].DilationMedications.push(obj);
                                    $scope.PreOpMedicationObj.MedicineObject = "";
                                }
                            }
                        });
                    }
                    if (mainitem.GeneralOrders.length > 0) {
                        angular.forEach(mainitem.GeneralOrders, function (item) {
                            var j = 0;
                            angular.forEach($scope.LasikTempObj.OrderDetails, function (mitem) {

                                angular.forEach(mitem.GeneralOrders, function (citem) {
                                    if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                        j++
                                    }
                                });

                            });
                            if (j == 0) {
                                let Gobj = {
                                    "GeneralOrderId": null,
                                    "MedicineName": item.MedicineName || '',
                                    "DeleteInd": "N",
                                    "Status": "",

                                }
                                templist[0].GeneralOrders.push(Gobj);
                            }
                        });
                    }



                }
                else {

                    //let templist2 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                    let templist2 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist2.length > 0) {
                        templist2[0].MedTypeId = 2;
                        templist2[0].MedTypeName = 'Dilation Medication';
                    } else {
                        //let templist3 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 2, 'DeleteInd': 'N' }, true) || [];
                        let templist3 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                            return oitem.MedTypeId === 2 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                        }) || [];
                        if (templist3.length > 0) {

                        } else {
                            var obj = {
                                "UserOrderId": 0,
                                "UserId": $scope.UserId,
                                "DeleteInd": "N",
                                "ReviewedBy": null,
                                "UserType": "Nurse",
                                "ScreenType": "Pre-Op",
                                "ScreenTypeId": 4,
                                "MedTypeId": 2,
                                "MedTypeName": 'Dilation Medication',
                                "DilationMedications": [],
                                "PreOpMedications": [],
                                "GeneralOrders": [],
                                "OrderTypeId": OrderTypeId || 2,
                                "OrderTypeName": "Live Medications",
                                "IsOrderReviewed": false,
                            }
                            $scope.LasikTempObj.OrderDetails.push(obj);
                        }

                    }
                    //let templist1 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 2, 'DeleteInd': 'N' }, true) || [];
                    let templist1 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 2 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist1.length > 0) {

                        if (mainitem.DilationMedications.length > 0) {
                            angular.forEach(mainitem.DilationMedications, function (item) {
                                var i = 0;
                                angular.forEach($scope.LasikTempObj.OrderDetails, function (mitem) {

                                    angular.forEach(mitem.DilationMedications, function (citem) {
                                        if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                            i++
                                        }
                                    });

                                });
                                if (i == 0) {
                                    let List = $filter("filter")(templist1[0].DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId, 'DeleteInd': 'N' }, true) || [];


                                    if (List.length == 0) {
                                        let GivenBy = null;
                                        let loggedUser = $filter('filter')($scope.MedicationGivenByNurseArray, { 'DoctorID': $scope.UserId }, true) || [];
                                        if (loggedUser.length > 0) {
                                            GivenBy = loggedUser[0].DoctorID;
                                        }


                                        var obj = {
                                            "AscMedicationId": 0,
                                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                                            "ParentOrganizationId": $scope.ParentHospitalId,
                                            "ASCOrganizationMedicationId": 0,
                                            "Strength": item.Strength || '',
                                            "IsFrequent": item.IsFrequent || 'N',
                                            "MedicineId": item.MedicineId,
                                            "MedicationName": item.MedicationName,
                                            "IsChecked": false,
                                            "IsDilationMed": false,
                                            "IsIntraAnesthesiaMed": false,
                                            "IsIntraMed": false,
                                            "IsPreOPMed": false,
                                            "MedicationDosage": "",
                                            "DropTimings": [],
                                            "TypeId": 4,
                                            "DeleteInd": "N",
                                            "Action": item.Action,
                                            "Dose": item.Dose,
                                            "DoseUnit": item.DoseUnit,
                                            "Route": item.Route,
                                            "Frequency": item.Frequency,
                                            "ActionId": item.ActionId,
                                            "DoseId": item.DoseId,
                                            "DoseUnitId": item.DoseUnitId,
                                            "RouteId": item.RouteId,
                                            "FrequencyId": item.FrequencyId,
                                            "OrderDescription": item.OrderDescription,
                                            "MedicationNotes": item.MedicationNotes,
                                            "maxDose": item.maxDose,
                                            "OrderTypeId": item.OrderTypeId || null,
                                            "OrderTypeName": item.OrderTypeName || ''
                                        }
                                        templist1[0].DilationMedications.push(obj);
                                        $scope.DilationMedicationObj.MedicineObject = "";
                                    }
                                }
                            });
                        }
                        if (mainitem.GeneralOrders.length > 0) {
                            angular.forEach(mainitem.GeneralOrders, function (item) {
                                var j = 0;
                                angular.forEach($scope.LasikTempObj.OrderDetails, function (mitem) {

                                    angular.forEach(mitem.GeneralOrders, function (citem) {
                                        if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                                            j++
                                        }
                                    });

                                });
                                if (j == 0) {
                                    let Gobj = {
                                        "GeneralOrderId": null,
                                        "MedicineName": item.MedicineName || '',
                                        "DeleteInd": "N",
                                        "Status": "",

                                    }
                                    templist1[0].GeneralOrders.push(Gobj);

                                }
                            });
                        }
                    }


                }

                let activeOrders = ($scope.LasikTempObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 2);

                let isColumnTrue = activeOrders.some(order =>
                (order.DilationMedications &&
                    order.DilationMedications.some(item => item.DeleteInd === 'N'))
                );

                if (isColumnTrue) {
                    $scope.LasikTempObj.DisableSurgeonordersCheck = isColumnTrue;
                    $scope.LasikTempObj.IsSurgeonOrdersTimeChecked = !isColumnTrue;
                }

            }

        }

        $scope.updateOrderDescription = function (id) {

            if (id == 2) {
                $scope.DilationMedicationObj.OrderDescription = $scope.DilationMedicationObj.Action + " " + $scope.DilationMedicationObj.MedicationName + " " + $scope.DilationMedicationObj.Dose + " " + $scope.DilationMedicationObj.DoseUnit + " " + $scope.DilationMedicationObj.Route + " " + $scope.DilationMedicationObj.Frequency + " " + ($scope.DilationMedicationObj.maxDose ? " for " + $scope.DilationMedicationObj.maxDose + " times." : "");

            } else if (id == 1) {
                $scope.PreOpMedicationObj.OrderDescription = $scope.PreOpMedicationObj.Action + " " + $scope.PreOpMedicationObj.MedicationName + " " + $scope.PreOpMedicationObj.Dose + " " + $scope.PreOpMedicationObj.DoseUnit + " " + $scope.PreOpMedicationObj.Route + " " + $scope.PreOpMedicationObj.Frequency + " " + ($scope.PreOpMedicationObj.maxDose ? " for " + $scope.PreOpMedicationObj.maxDose + " times." : "");

            } else if (id == 5) {
                $scope.PostOpMedicationObj.OrderDescription = $scope.PostOpMedicationObj.Action + " " + $scope.PostOpMedicationObj.MedicationName + " " + $scope.PostOpMedicationObj.Dose + " " + $scope.PostOpMedicationObj.DoseUnit + " " + $scope.PostOpMedicationObj.Route + " " + $scope.PostOpMedicationObj.Frequency + " " + ($scope.PostOpMedicationObj.maxDose ? " for " + $scope.PostOpMedicationObj.maxDose + " times." : "");

            }
        }
        $scope.updateSurgeonOrderCheckbox = function (Type) {

            if (Type == 'DilationMedication') {
                let activeOrders = ($scope.LasikTempObj.OrderDetails || [])
                    .filter(order => order.DeleteInd === 'N' && order.MedTypeId == 2);

                if (activeOrders.length === 0) {
                    $scope.LasikTempObj.DisableSurgeonordersCheck = false;
                    return;
                }

                let isAllDeleted = activeOrders.every(order => {

                    let dilation = order.DilationMedications || [];


                    let noActiveDilation =
                        dilation.length === 0 ||
                        dilation.every(item => item.DeleteInd === 'Y');

                    return noActiveDilation;
                });

                $scope.LasikTempObj.DisableSurgeonordersCheck = !isAllDeleted;
            }
            else if (Type == 'PreOpMediacation') {
                let activeOrders = ($scope.LasikTempObj.OrderDetails || [])
                    .filter(order => order.DeleteInd === 'N' && order.MedTypeId == 1);

                if (activeOrders.length === 0) {
                    $scope.LasikTempObj.DisableAnesthesiaOrdersCheck = false;
                    return;
                }

                let isAllDeleted = activeOrders.every(order => {

                    let dilation = order.PreOpMedications || [];

                    let noActiveDilation =
                        dilation.length === 0 ||
                        dilation.every(item => item.DeleteInd === 'Y');
                    return noActiveDilation;
                });

                $scope.LasikTempObj.DisableAnesthesiaOrdersCheck = !isAllDeleted;
            }
        };



        $scope.editDilationMedication = function (item, index) {
            $scope.DilationMedicationObj.MedicineObject = {
                MedicationName: item.MedicationName,
                MedicineId: item.MedicineId,
                OrganizationPrescriptionId: item.OrganizationPrescriptionId,
                Strength: item.Strength || '',
                IsFrequent: item.IsFrequent || 'N',
                AscMedicationId: item.AscMedicationId || 0

            };
            $scope.DilationMedicationObj.MedicationName = item.MedicationName;
            $scope.DilationMedicationObj.AscMedicationId = item.AscMedicationId;
            $scope.DilationMedicationObj.Action = item.Action;
            $scope.DilationMedicationObj.Dose = item.Dose;
            $scope.DilationMedicationObj.DoseUnit = item.DoseUnit;
            $scope.DilationMedicationObj.Route = item.Route;
            $scope.DilationMedicationObj.Frequency = item.Frequency;

            $scope.DilationMedicationObj.OrderTypeId = item.OrderTypeId;
            $scope.DilationMedicationObj.OrderTypeName = item.OrderTypeName;

            $scope.DilationMedicationObj.ActionId = item.ActionId;
            $scope.DilationMedicationObj.DoseId = item.DoseId;
            $scope.DilationMedicationObj.DoseUnitId = item.DoseUnitId;
            $scope.DilationMedicationObj.RouteId = item.RouteId;
            $scope.DilationMedicationObj.FrequencyId = item.FrequencyId;

            $scope.DilationMedicationObj.DropTimings = item.DropTimings || [];

            $scope.DilationMedicationObj.MedicationNotes = item.MedicationNotes;
            $scope.DilationMedicationObj.maxDose = item.maxDose;

            $scope.DilationMedicationObj.OrderDescription = item.OrderDescription;

            $scope.DilationMedicationObj.EditIndex = index;

            $scope.DilationMedicationObj.IsmedSearchDisabled = true;
            $scope.LasikTempObj.OrderType = 'Medications';



        };

        $scope.DeleteMainMediacation = function (item, Aitem, Type) {
            if (Type == 'DilationMedication') {
                var index = Aitem.DilationMedications.indexOf(item);
            }
            if (Type == 'PreOpMediacation') {
                var index = Aitem.PreOpMedications.indexOf(item);
            }
            if (Type == 'PostOpMedications') {
                var index = Aitem.PostOpMedications.indexOf(item);
            }

            if (item.AscMedicationId != 0) {
                alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {
                    if (index > -1) {
                        item.DeleteInd = 'Y';
                    }
                    $scope.updateSurgeonOrderCheckbox(Type);
                    $scope.$digest();
                    $scope.PreopOrderinit(Type);
                }, function () {

                });
            }
            else {
                if (index > -1) {
                    if (Type == 'DilationMedication') {
                        Aitem.DilationMedications.splice(index, 1);
                    }
                    if (Type == 'PreOpMediacation') {
                        Aitem.PreOpMedications.splice(index, 1);
                    }
                    if (Type == 'PostOpMedications') {
                        Aitem.PostOpMedications.splice(index, 1);
                    }

                }
                $scope.updateSurgeonOrderCheckbox(Type);
            }
            $scope.PreopOrderinit(Type);
        }
        $scope.SelectDialtionMedicationItems1 = function (item, type) {

            let i = 0;
            angular.forEach($scope.LasikTempObj.OrderDetails, function (mitem) {
                angular.forEach(mitem.DilationMedications, function (Aitem) {
                    if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                        i++;
                    }
                });
            });

            if (i > 0) {
                alertify.error('You have already entered this Medication');
                $scope.DilationMedicationObj.MedicineObject = {};
                $scope.DilationMedicationObj.MedicationName = '';
                return false;
            }

            $scope.DilationMedicationObj.MedicineObject = item;
            $scope.DilationMedicationObj.MedicationName = item.MedicineName;

            if ($scope.DilationMedicationObj.AscMedicationId != 0) {
                item.AscMedicationId = $scope.DilationMedicationObj.AscMedicationId;
            }

            $scope.updateOrderDescription(2);
        };
        $scope.getOrgMedicines = function (text, val) {
            val = val || null;
            var req = {
                "HospitalId": $scope.HospitalId,
                "PageSize": 10,
                "SearchText": text || '',
                "PageNumber": 1,
                "UserId": $scope.UserId,
                "IsFrequent": "N",
                "MedTypeId": val,
                "ParentOrganizationId": $scope.ParentHospitalId || null
            };


            return eHnoteConditionsDataService.GetOrganizationMedications(req).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.MedicineList !== undefined) {
                        var list1 = [];
                        angular.forEach(resp.data.MedicineList, function (item) {
                            if (item.MedTypeId == val || item.MedTypeId == null) {
                                list1.push(item);
                            }
                        });
                        return list1.map(function (item) {
                            return item;

                        });
                    }
                }
            });
        }

        $scope.AddGeneralOrder = function (Screen, Type) {


            if (Screen == 'Postop') {
                if (Type == 'Nurse') {
                    if ($scope.PostOpMedicationObj.OrderName == '') {
                        alertify.error("Please Enter General Orders!");
                        return false;
                    }
                    //let templist = $filter("filter")($scope.LasikTempObj.OrderDetails, { "MedTypeId": 5, 'IsOrderReviewed': false }, true);
                    let templist = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 5 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist.length > 0) {
                        let Gobj = {
                            "GeneralOrderId": null,
                            "MedicineName": $scope.PostOpMedicationObj.OrderName || '',
                            "DeleteInd": "N",
                            "Status": "",
                            "MedicationTime": "",
                        }
                        templist[0].GeneralOrders.push(Gobj);
                        $scope.PostOpMedicationObj.OrderName = "";
                    } else {
                        //let templist2 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                        let templist2 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                            return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                        }) || [];
                        if (templist2.length > 0) {
                            templist2[0].MedTypeId = 5;
                            templist2[0].MedTypeName = 'PostOp Medication';

                            templist2[0].ScreenType = 'PostOp';
                            templist2[0].ScreenTypeId = 6;
                        } else {

                            //let templist3 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 5 }, true) || [];
                            let templist3 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                                return oitem.MedTypeId === 5 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                            }) || [];
                            if (templist3.length > 0) {

                            } else {
                                var obj = {
                                    "UserOrderId": 0,
                                    "UserId": $scope.UserId,
                                    "DeleteInd": "N",
                                    "IsOrderReviewed": false,
                                    "ReviewedByDateTime": null,
                                    "ReviewedByPassword": '',
                                    "ReviewedBy": null,
                                    "UserType": "Nurse",
                                    "ScreenType": "PostOp",
                                    "ScreenTypeId": 6,
                                    "MedTypeId": 5,
                                    "MedTypeName": 'PostOp Medication',
                                    "PostOpMedications": [],
                                    "GeneralOrders": [],
                                    "OrderTypeId": OrderTypeId || 2,
                                    "OrderTypeName": "Live Medications"
                                }
                                $scope.LasikTempObj.OrderDetails.push(obj);
                            }

                        }

                        //let templist1 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 5 }, true) || [];
                        let templist1 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                            return oitem.MedTypeId === 5 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                        }) || [];

                        if (templist1.length > 0) {
                            let Gobj = {
                                "GeneralOrderId": null,
                                "MedicineName": $scope.PostOpMedicationObj.OrderName || '',
                                "DeleteInd": "N",
                                "Status": "",
                                "MedicationTime": "",
                            }
                            templist1[0].GeneralOrders.push(Gobj);
                            $scope.PostOpMedicationObj.OrderName = "";
                        } else {

                        }
                    }

                    let activeOrders = ($scope.LasikTempObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 5);

                    let isColumnTrue = activeOrders.some(order =>
                    (order.PostOpMedications &&
                        order.PostOpMedications.some(item => item.DeleteInd === 'N'))
                    );
                    if (isColumnTrue) {
                        $scope.LasikTempObj.DisablePostOpSurgeonCheck = isColumnTrue;
                        $scope.LasikTempObj.IsPostOpSurgeonOrdersTimeAdded = !isColumnTrue;
                    }

                }
            } else {
                if ($scope.DilationMedicationObj.OrderName == '') {
                    alertify.error("Please Enter General Orders!");
                    return false;
                }
                //let templist = $filter("filter")($scope.LasikTempObj.OrderDetails, {  "MedTypeId": 2, 'IsOrderReviewed': false }, true);
                let templist = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === 2 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist.length > 0) {
                    let Gobj = {
                        "GeneralOrderId": null,
                        "MedicineName": $scope.DilationMedicationObj.OrderName || '',
                        "DeleteInd": "N",
                        "Status": "",
                        "MedicationTime": "",
                    }
                    templist[0].GeneralOrders.push(Gobj);
                    $scope.DilationMedicationObj.OrderName = "";
                }
                else {
                    //let templist2 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                    let templist2 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist2.length > 0) {
                        templist2[0].MedTypeId = 2;
                        templist2[0].MedTypeName = 'Dilation Medication';
                    } else {

                        //let templist3 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 2 }, true) || [];
                        let templist3 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                            return oitem.MedTypeId === 2 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                        }) || [];
                        if (templist3.length > 0) {

                        } else {
                            let obj = {
                                "UserOrderId": 0,
                                "UserId": $scope.UserId,
                                "DeleteInd": "N",
                                "ReviewedBy": null,
                                "IsOrderReviewed": false,
                                "ReviewedByPassword": '',
                                "ReviewedByDateTime": null,
                                "UserType": "Nurse",
                                "ScreenType": "PreOp",
                                "ScreenTypeId": 4,
                                "MedTypeId": 2,
                                "MedTypeName": 'Dilation Medication',
                                "DilationMedications": [],
                                "PreOpMedications": [],
                                "GeneralOrders": [],
                                "OrderTypeId": OrderTypeId || 2,
                                "OrderTypeName": "Live Medications"
                            }
                            $scope.LasikTempObj.OrderDetails.push(obj);
                        }

                    }


                    //let templist1 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 2 }, true) || [];
                    let templist1 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 2 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist1.length > 0) {
                        let Gobj = {
                            "GeneralOrderId": null,
                            "MedicineName": $scope.DilationMedicationObj.OrderName || '',
                            "DeleteInd": "N",
                            "Status": "",
                            "MedicationTime": "",
                        }
                        templist1[0].GeneralOrders.push(Gobj);
                        $scope.DilationMedicationObj.OrderName = "";
                    } else {

                    }
                }

                let activeOrders = ($scope.LasikTempObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 2);

                let isColumnTrue = activeOrders.some(order =>
                (order.DilationMedications &&
                    order.DilationMedications.some(item => item.DeleteInd === 'N'))
                );
                if (isColumnTrue) {
                    $scope.LasikTempObj.DisableSurgeonordersCheck = isColumnTrue;
                    $scope.LasikTempObj.IsSurgeonOrdersTimeChecked = !isColumnTrue;
                }
            }


        }
        $scope.PreopOrderinit = function (Type) {

            let FinalNurseOrderDetails = $filter('filter')($scope.LasikTempObj.OrderDetails, { 'MedTypeId': 2 }, true) || [];
            if (FinalNurseOrderDetails.length > 0) {
                angular.forEach(FinalNurseOrderDetails, function (Mitem) {
                    let temp = $filter('filter')(Mitem.DilationMedications, { 'DeleteInd': 'N' }, true) || [];
                    let temp1 = $filter('filter')(Mitem.GeneralOrders, { 'DeleteInd': 'N' }, true) || [];
                    if (temp.length == 0 && temp1.length == 0) {
                        Mitem.DeleteInd = 'Y';
                    }
                });
            }


            let FinalAnesthisiaOrderDetails = $filter('filter')($scope.LasikTempObj.OrderDetails, { 'MedTypeId': 1 }, true) || [];
            if (FinalAnesthisiaOrderDetails.length > 0) {
                angular.forEach(FinalAnesthisiaOrderDetails, function (Mitem) {
                    let temp = $filter('filter')(Mitem.PreOpMedications, { 'DeleteInd': 'N' }, true) || [];
                    let temp1 = $filter('filter')(Mitem.GeneralOrders, { 'DeleteInd': 'N' }, true) || [];
                    if (temp.length == 0 && temp1.length == 0) {
                        Mitem.DeleteInd = 'Y';
                    }
                });
            }

        }
        $scope.DeleteGeneralOrder = function (Mitem, item, Type) {
            var index = Mitem.GeneralOrders.indexOf(item);
            if (item.GeneralOrderId === 0) {
                if (index > -1) {
                    Mitem.GeneralOrders.splice(index, 1);
                }
            } else {
                item.DeleteInd = "Y";
            }
            $scope.PreopOrderinit('');
        }

        //var OrderTypeId = null;
        //var OrderTypeName = "";
        $scope.AddDilationMedication = function () {
            $scope.propMedicationSurgeon = true;
            $scope.propMedicationAnsthesia = true;
            let item = $scope.DilationMedicationObj.MedicineObject;
            if (!item || !item.OrganizationPrescriptionId) {
                alertify.error('Please select a Medicine');
                return false;
            }

            if ($scope.DilationMedicationObj.OrderTypeName == "" && $scope.DilationMedicationObj.OrderTypeId == null) {
                OrderTypeId = OrderTypeId;
                OrderTypeName = "Live Medications";
            } else {
                OrderTypeId = $scope.DilationMedicationObj.OrderTypeId;
                OrderTypeName = $scope.DilationMedicationObj.OrderTypeName;
            }

            let obj = {
                "AscMedicationId": item.AscMedicationId || 0,
                "OrganizationMedicationId": item.OrganizationPrescriptionId,
                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "ASCOrganizationMedicationId": 0,
                "Strength": item.Strength || '',
                "IsFrequent": item.IsFrequent || 'N',
                "MedicineId": item.MedicineId,
                "MedicationName": $scope.DilationMedicationObj.MedicationName,
                "Action": $scope.DilationMedicationObj.Action,
                "Dose": $scope.DilationMedicationObj.Dose,
                "DoseUnit": $scope.DilationMedicationObj.DoseUnit,
                "Route": $scope.DilationMedicationObj.Route,
                "Frequency": $scope.DilationMedicationObj.Frequency,
                "ActionId": $scope.DilationMedicationObj.ActionId,
                "DoseId": $scope.DilationMedicationObj.DoseId,
                "DoseUnitId": $scope.DilationMedicationObj.DoseUnitId,
                "RouteId": $scope.DilationMedicationObj.RouteId,
                "FrequencyId": $scope.DilationMedicationObj.FrequencyId,
                "OrderDescription": $scope.DilationMedicationObj.OrderDescription,
                "MedicationNotes": $scope.DilationMedicationObj.MedicationNotes,
                "maxDose": $scope.DilationMedicationObj.maxDose,
                "IsChecked": false,
                "IsDilationMed": false,
                "IsIntraAnesthesiaMed": false,
                "IsIntraMed": false,
                "IsPreOPMed": false,
                "MedicationDosage": "",
                "DropTimings": $scope.DilationMedicationObj.DropTimings || [],
                "TypeId": 2,
                "DeleteInd": "N",
                "OrderTypeId": OrderTypeId,
                "OrderTypeName": OrderTypeName,
            };
            let templist = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                return oitem.MedTypeId === 2 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
            }) || [];


            if (templist.length > 0 && templist[0].DilationMedications.length > $scope.DilationMedicationObj.EditIndex && $scope.DilationMedicationObj.EditIndex >= 0) {
                templist[0].DilationMedications[$scope.DilationMedicationObj.EditIndex] = obj;
                alertify.success('Updated successfully');
            }

            else {

                if (templist.length > 0) {
                    templist[0].DilationMedications.push(obj);
                } else {

                    let newObj = {
                        "UserOrderId": 0,
                        "UserId": $scope.UserId,
                        "DeleteInd": "N",
                        "ReviewedBy": null,
                        "IsOrderReviewed": false,
                        "ReviewedByDateTime": null,
                        "ReviewedByPassword": '',
                        "UserType": "Nurse",
                        "ScreenType": "PreOp",
                        "ScreenTypeId": 4,
                        "MedTypeId": 2,
                        "MedTypeName": 'Dilation Medication',
                        "DilationMedications": [obj],
                        "PreOpMedications": [],
                        "GeneralOrders": [],
                        "OrderTypeId": OrderTypeId || 2,
                        "OrderTypeName": "Live Medications"
                    };
                    $scope.LasikTempObj.OrderDetails.push(newObj);
                }
                alertify.success('Added successfully');
            }


            let activeOrders = ($scope.LasikTempObj.OrderDetails || [])
                .filter(order => order.DeleteInd === 'N' && order.MedTypeId == 2);

            let isColumnTrue = activeOrders.some(order =>
            (order.DilationMedications &&
                order.DilationMedications.some(item => item.DeleteInd === 'N'))
            );

            $scope.LasikTempObj.DisableSurgeonordersCheck = isColumnTrue;
            $scope.LasikTempObj.IsSurgeonOrdersTimeChecked = !isColumnTrue;

            $scope.DilationMedicationObj = angular.copy($scope.GetDilationMedicationObj());
        };
        $scope.ClearMedicationData = function (type) {

            if (type == 1) {
                $scope.PreOpMedicationObj = angular.copy($scope.GetDilationMedicationObj());
            } else if (type == 2) {
                $scope.DilationMedicationObj = angular.copy($scope.GetDilationMedicationObj());
            }
            else if (type == 3) {
                $scope.AnesthesiaMedicationObj = angular.copy($scope.GetIntraOpMedicationObj());
            }
            else if (type == 4) {
                $scope.IntraOpMedicationObj = angular.copy($scope.GetIntraOpMedicationObj());
            }
            else if (type == 5) {
                $scope.PostOpMedicationObj = angular.copy($scope.GetPostOpMedicationObj());
            }
            else if (type == 8) {
                $scope.PostOpMedicationObj = angular.copy($scope.GetPostOpMedicationObj());
            }

        }

        /* ---------------------------------------------------------------
           POST-OP MEDICATION ORDERS

           The post-op block of the template was wired to handlers that were
           never ported into this controller, so every one of them evaluated to
           a no-op: Add Medication, the typeahead select, Select Template, Edit,
           the favourite star and the dosage dropdowns all did nothing. Only the
           Favorites list worked, because SelectPostOpMedicationItemsFrequent1
           does exist. These mirror the Pre-Op (Dilation) versions above, on
           MedTypeId 5 / PostOpMedications.
           --------------------------------------------------------------- */

        // one post-op medication row -> the shape stored in PostOpMedications
        function buildPostOpMedicationRow(item, medObj, OrderTypeId, OrderTypeName) {
            return {
                "AscMedicationId": item.AscMedicationId || 0,
                "OrganizationMedicationId": item.OrganizationPrescriptionId,
                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                "ParentOrganizationId": $scope.ParenthospitalId,
                "ASCOrganizationMedicationId": 0,
                "Strength": item.Strength || '',
                "IsFrequent": item.IsFrequent || 'N',
                "MedicineId": item.MedicineId,
                "MedicationName": medObj.MedicationName,
                "Action": medObj.Action,
                "Dose": medObj.Dose,
                "DoseUnit": medObj.DoseUnit,
                "Route": medObj.Route,
                "Frequency": medObj.Frequency,
                "ActionId": medObj.ActionId,
                "DoseId": medObj.DoseId,
                "DoseUnitId": medObj.DoseUnitId,
                "RouteId": medObj.RouteId,
                "FrequencyId": medObj.FrequencyId,
                "OrderDescription": medObj.OrderDescription,
                "MedicationNotes": medObj.MedicationNotes,
                "maxDose": medObj.maxDose,
                "IsChecked": false,
                "IsDilationMed": false,
                "IsIntraAnesthesiaMed": false,
                "IsIntraMed": false,
                "IsPreOPMed": false,
                "MedicationDosage": "",
                "DropTimings": medObj.DropTimings || [],
                "TypeId": 4,
                "DeleteInd": "N",
                "OrderTypeId": OrderTypeId,
                "OrderTypeName": OrderTypeName
            };
        }

        // the live post-op order bucket, created on first use
        function getPostOpOrderBucket(OrderTypeId, OrderTypeName) {
            let templist = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                return oitem.MedTypeId === 5 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
            }) || [];

            if (templist.length > 0) { return templist[0]; }

            let newObj = {
                "UserOrderId": 0,
                "UserId": $scope.UserId,
                "DeleteInd": "N",
                "ReviewedBy": null,
                "IsOrderReviewed": false,
                "ReviewedByDateTime": null,
                "ReviewedByPassword": '',
                "UserType": "Nurse",
                "ScreenType": "PostOp",
                "ScreenTypeId": 6,
                "MedTypeId": 5,
                "MedTypeName": "PostOp Medication",
                "PostOpMedications": [],
                "GeneralOrders": [],
                "OrderTypeId": OrderTypeId,
                "OrderTypeName": OrderTypeName || "Live Medications"
            };
            $scope.LasikTempObj.OrderDetails.push(newObj);
            return newObj;
        }

        function refreshPostOpSurgeonCheck() {
            let activeOrders = ($scope.LasikTempObj.OrderDetails || [])
                .filter(order => order.DeleteInd === 'N' && order.MedTypeId == 5);

            let isColumnTrue = activeOrders.some(order =>
            (order.PostOpMedications &&
                order.PostOpMedications.some(item => item.DeleteInd === 'N'))
            );

            $scope.LasikTempObj.DisablePostOpSurgeonCheck = isColumnTrue;
            $scope.LasikTempObj.IsPostOpSurgeonOrdersTimeAdded = !isColumnTrue;
        }

        // typeahead pick in the Medication box
        $scope.SelectPostMedicationItems1 = function (item, type) {
            let i = 0;
            angular.forEach($scope.LasikTempObj.OrderDetails, function (mitem) {
                if (mitem.MedTypeId == 5) {
                    angular.forEach(mitem.PostOpMedications, function (Aitem) {
                        if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                            i++;
                        }
                    });
                }
            });

            if (i > 0) {
                alertify.error('You have already entered this Medication');
                $scope.PostOpMedicationObj.MedicineObject = {};
                $scope.PostOpMedicationObj.MedicationName = '';
                return false;
            }

            $scope.PostOpMedicationObj.MedicineObject = item;
            $scope.PostOpMedicationObj.MedicationName = item.MedicineName;

            if ($scope.PostOpMedicationObj.AscMedicationId != 0) {
                item.AscMedicationId = $scope.PostOpMedicationObj.AscMedicationId;
            }

            $scope.updateOrderDescription(5);
        };

        $scope.AddPostopMedication = function () {
            $scope.PostOpMedicationSurgeon = true;

            let item = $scope.PostOpMedicationObj.MedicineObject;
            if (!item || !item.OrganizationPrescriptionId) {
                alertify.error('Please select a Medicine');
                return false;
            }

            let OrderTypeId, OrderTypeName;
            if ($scope.PostOpMedicationObj.OrderTypeName == "" && $scope.PostOpMedicationObj.OrderTypeId == null) {
                OrderTypeId = 2;
                OrderTypeName = "Live Medications";
            } else {
                OrderTypeId = $scope.PostOpMedicationObj.OrderTypeId;
                OrderTypeName = $scope.PostOpMedicationObj.OrderTypeName;
            }

            let obj = buildPostOpMedicationRow(item, $scope.PostOpMedicationObj, OrderTypeId, OrderTypeName);
            let bucket = getPostOpOrderBucket(OrderTypeId, OrderTypeName);

            if (bucket.PostOpMedications.length > $scope.PostOpMedicationObj.EditIndex && $scope.PostOpMedicationObj.EditIndex >= 0) {
                bucket.PostOpMedications[$scope.PostOpMedicationObj.EditIndex] = obj;
                alertify.success('Updated successfully');
            } else {
                bucket.PostOpMedications.push(obj);
                alertify.success('Added successfully');
            }

            refreshPostOpSurgeonCheck();
            $scope.PostOpMedicationObj = angular.copy($scope.GetPostOpMedicationObj());
        };

        // pulls an existing row back into the entry form; AddPostopMedication
        // then updates in place because EditIndex is set
        $scope.editPostMedication = function (item, index, Id) {
            if (Id != 5) { return; }

            $scope.PostOpMedicationObj.MedicineObject = {
                MedicationName: item.MedicationName,
                MedicineId: item.MedicineId,
                OrganizationPrescriptionId: item.OrganizationPrescriptionId,
                Strength: item.Strength || '',
                IsFrequent: item.IsFrequent || 'N',
                AscMedicationId: item.AscMedicationId || 0
            };

            $scope.PostOpMedicationObj.MedicationName = item.MedicationName;
            $scope.PostOpMedicationObj.AscMedicationId = item.AscMedicationId;
            $scope.PostOpMedicationObj.Action = item.Action;
            $scope.PostOpMedicationObj.Dose = item.Dose;
            $scope.PostOpMedicationObj.DoseUnit = item.DoseUnit;
            $scope.PostOpMedicationObj.Route = item.Route;
            $scope.PostOpMedicationObj.Frequency = item.Frequency;
            $scope.PostOpMedicationObj.ActionId = item.ActionId;
            $scope.PostOpMedicationObj.DoseId = item.DoseId;
            $scope.PostOpMedicationObj.DoseUnitId = item.DoseUnitId;
            $scope.PostOpMedicationObj.RouteId = item.RouteId;
            $scope.PostOpMedicationObj.FrequencyId = item.FrequencyId;
            $scope.PostOpMedicationObj.OrderTypeId = item.OrderTypeId;
            $scope.PostOpMedicationObj.OrderTypeName = item.OrderTypeName;
            $scope.PostOpMedicationObj.OrderDescription = item.OrderDescription;
            $scope.PostOpMedicationObj.MedicationNotes = item.MedicationNotes;
            $scope.PostOpMedicationObj.maxDose = item.maxDose;
            $scope.PostOpMedicationObj.DropTimings = item.DropTimings || [];

            $scope.PostOpMedicationObj.EditIndex = index;
            $scope.PostOpMedicationObj.IsmedSearchDisabled = true;
            $scope.LasikTempObj.PostOrderType = 'Medications';
        };

        // Select Template -> copy the template's medications into the live bucket
        $scope.AddPostOpOrderTemplate = function (mainitem) {
            if (!mainitem) { return; }

            let bucket = getPostOpOrderBucket(2, "Live Medications");

            angular.forEach(mainitem.PostOpMedications || [], function (item) {
                var i = 0;
                angular.forEach($scope.LasikTempObj.OrderDetails, function (mitem) {
                    if (mitem.MedTypeId == 5) {
                        angular.forEach(mitem.PostOpMedications, function (citem) {
                            if (citem.MedicineId == item.MedicineId && citem.DeleteInd == "N") {
                                i++;
                            }
                        });
                    }
                });
                if (i > 0) { return; }

                bucket.PostOpMedications.push(
                    buildPostOpMedicationRow(item, item, 2, "Live Medications")
                );
            });

            angular.forEach(mainitem.GeneralOrders || [], function (item) {
                var j = 0;
                angular.forEach($scope.LasikTempObj.OrderDetails, function (mitem) {
                    angular.forEach(mitem.GeneralOrders, function (citem) {
                        if (citem.MedicineName == item.MedicineName && citem.DeleteInd == "N") {
                            j++;
                        }
                    });
                });
                if (j > 0) { return; }

                bucket.GeneralOrders.push({
                    "GeneralOrderId": null,
                    "MedicineName": item.MedicineName || '',
                    "DeleteInd": "N",
                    "Status": ""
                });
            });

            refreshPostOpSurgeonCheck();
            $scope.PostOpMedicationObj = angular.copy($scope.GetPostOpMedicationObj());
        };

        /* ---- dosage dropdowns (shared by the Pre-Op and Post-Op blocks) ---- */

        // type 1 -> PreOpMedicationObj, 2 -> DilationMedicationObj, 5 -> PostOpMedicationObj
        function medObjForType(type) {
            if (type == 1) { return $scope.PreOpMedicationObj; }
            if (type == 5) { return $scope.PostOpMedicationObj; }
            return $scope.DilationMedicationObj;
        }

        function applyDosageField(list, Id, medObj, codeField, idField) {
            var filteredArray = $filter("filter")(list, { "MedicineDosaageFieldId": Id }, true);
            if (filteredArray.length > 0) {
                medObj[codeField] = filteredArray[0].Code;
                medObj[idField] = filteredArray[0].MedicineDosaageFieldId;
            }
        }

        $scope.changePreopAction = function (Id, type) {
            applyDosageField($scope.actionArray, Id, medObjForType(type), 'Action', 'ActionId');
            $scope.updateOrderDescription(type);
        };

        $scope.changePreopDose = function (Id, type) {
            applyDosageField($scope.doseArray, Id, medObjForType(type), 'Dose', 'DoseId');
            $scope.updateOrderDescription(type);
        };

        $scope.changePreopDoseUnit = function (Id, type) {
            applyDosageField($scope.doseUnitArray, Id, medObjForType(type), 'DoseUnit', 'DoseUnitId');
            $scope.updateOrderDescription(type);
        };

        $scope.changePreopRoute = function (Id, type) {
            applyDosageField($scope.routeArray, Id, medObjForType(type), 'Route', 'RouteId');
            $scope.updateOrderDescription(type);
        };

        $scope.changePreopFrequency = function (Id, type) {
            applyDosageField($scope.frequencyArray, Id, medObjForType(type), 'Frequency', 'FrequencyId');
            $scope.updateOrderDescription(type);
        };

        $scope.onMaxDoseChange = function (id, item, type) {
            medObjForType(type).maxDose = id;
            $scope.updateOrderDescription(type);
        };

        // favourite star on a medication row
        $scope.AddFrequentlyMed = function (item, MedTypeId) {
            var Frequentval = item.IsFrequent == "N" ? "Y" : "N";
            var isPostOp = MedTypeId == 5;

            var obj = {
                "ParentOrganizationId": $scope.ParenthospitalId,
                "OrganizationId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                "MedicineId": item.MedicineId,
                "MedicineName": item.MedicationName,
                "UserType": "Nurse",
                "ScreenTypeId": isPostOp ? 6 : 4,
                "ScreenTypeName": isPostOp ? 'Post-Op' : 'Pre-Op',
                "MedTypeId": MedTypeId || null,
                "MedTypeName": isPostOp ? 'PostOp Medication' : 'Dilation Medication',
                "DeleteInd": 'N',
                "IsFrequent": Frequentval,
                "Action": item.Action,
                "Dose": item.Dose,
                "DoseUnit": item.DoseUnit,
                "Route": item.Route,
                "Frequency": item.Frequency,
                "ActionId": item.ActionId,
                "DoseId": item.DoseId,
                "DoseUnitId": item.DoseUnitId,
                "RouteId": item.RouteId,
                "FrequencyId": item.FrequencyId,
                "OrderDescription": item.OrderDescription,
                "MedicationNotes": item.MedicationNotes,
                "maxDose": item.maxDose
            };

            var save = function () {
                eHnoteSurgeryService.AddUpdateFrequentMedications(obj).then(function (resp) {
                    if (resp.data.Status === "Success" || resp.data.status === "Success") {
                        item.IsFrequent = Frequentval;
                        $scope.RefreshFrequentMedications();
                    } else {
                        alertify.error(resp.data.Message);
                    }
                }, function (err) {
                    console.log(err);
                });
            };

            var message = Frequentval == "Y"
                ? "Do you want to add this to the frequently added list?"
                : "Do you want to remove this from the frequently added list?";

            alertify.confirm("<b class='txt-centre'>Confirm !</b><h4 class='txt-body-centre'>" + message + "</h4>", save, function () { });
        };

        // reloads the Favorites strips after a star toggle
        $scope.RefreshFrequentMedications = function () {
            eHnoteSurgeryService.GetOrganizationPreOpMedications($scope.HospitalId).then(function (resp) {
                if (resp.data.status !== "Success") { return; }

                angular.forEach(resp.data.rows, function (mitem) {
                    mitem.AscMedicationId = 0;
                    mitem.IsChecked = false;
                    mitem.DropTimings = [{ "MedicationTime": "" }, { "MedicationTime": "" }];
                });

                $scope.MasterPreOpMedications = angular.copy($filter('filter')(resp.data.rows, { "MedTypeId": 1 }, true)) || [];
                $scope.MasterDilationMedications = angular.copy($filter('filter')(resp.data.rows, { "MedTypeId": 2 }, true)) || [];
                $scope.MasterPostOpMedications = angular.copy($filter('filter')(resp.data.rows, { "MedTypeId": 5 }, true)) || [];
                $scope.MasterPostOpAnesthesiaMedications = angular.copy($filter('filter')(resp.data.rows, { "MedTypeId": 8 }, true)) || [];
            });
        };

        $scope.SelectDialtionMedicationItemsFrequent1 = function (item, type) {
            $scope.propMedicationSurgeon = true;
            //let templist = $filter("filter")($scope.LasikTempObj.OrderDetails, {  "MedTypeId": 2, 'IsOrderReviewed': false, 'DeleteInd': 'N'}, true);



            let templist = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                return oitem.MedTypeId === 2 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
            }) || [];
            let i = 0;
            angular.forEach($scope.LasikTempObj.OrderDetails, function (mitem) {
                angular.forEach(mitem.DilationMedications, function (Aitem) {
                    if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                        i++;
                    }
                });
            });

            if (i > 0) {
                alertify.error('You have already entered this Medication');
                $scope.DilationMedicationObj.MedicineObject = "";
                return false;
            }
            if (templist.length > 0) {

                let List1 = $filter("filter")(templist[0].DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                if (List.length > 0) {
                    alertify.error("Medicine name already added!");
                    $scope.DilationMedicationObj.MedicineObject = '';
                    return false;
                }
                let GivenBy = null;
                let loggedUser = $filter('filter')($scope.MedicationGivenByNurseArray, { 'DoctorID': $scope.UserId }, true) || [];
                if (loggedUser.length > 0) {
                    GivenBy = loggedUser[0].DoctorID;
                }

                if (type == 'Frequently') {
                    var obj = {
                        "AscMedicationId": 0,
                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "ASCOrganizationMedicationId": 0,
                        "Strength": item.Strength || '',
                        "IsFrequent": item.IsFrequent || 'N',
                        "MedicineId": item.MedicineId,
                        "MedicationName": item.MedicationName,
                        "IsChecked": false,
                        "IsDilationMed": false,
                        "IsIntraAnesthesiaMed": false,
                        "IsIntraMed": false,
                        "IsPreOPMed": false,
                        "MedicationDosage": "",
                        "DropTimings": [],

                        "TypeId": 2,
                        "DeleteInd": "N",
                        "Action": item.Action,
                        "Dose": item.Dose,
                        "DoseUnit": item.DoseUnit,
                        "Route": item.Route,
                        "Frequency": item.Frequency,
                        "ActionId": item.ActionId,
                        "DoseId": item.DoseId,
                        "DoseUnitId": item.DoseUnitId,
                        "RouteId": item.RouteId,
                        "FrequencyId": item.FrequencyId,
                        "MedicationNotes": item.MedicationNotes || "",
                        "maxDose": item.maxDose,
                        "OrderDescription": item.OrderDescription,
                        "OrderTypeId": OrderTypeId,
                        "OrderTypeName": "Live Medications"
                    }
                    templist[0].DilationMedications.push(obj);
                    $scope.DilationMedicationObj.MedicineObject = "";


                } else {
                    var obj = {
                        "AscMedicationId": 0,
                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "ASCOrganizationMedicationId": 0,
                        "Strength": item.Strength || '',
                        "IsFrequent": item.IsFrequent || 'N',
                        "MedicineId": item.MedicineId,
                        "MedicationName": item.MedicineName,
                        "IsChecked": false,
                        "IsDilationMed": false,
                        "IsIntraAnesthesiaMed": false,
                        "IsIntraMed": false,
                        "IsPreOPMed": false,
                        "MedicationDosage": "",
                        "DropTimings": [],

                        "TypeId": 2,
                        "DeleteInd": "N",
                        "Action": item.Action,
                        "Dose": item.Dose,
                        "DoseUnit": item.DoseUnit,
                        "Route": item.Route,
                        "Frequency": item.Frequency,
                        "MedicationNotes": item.MedicationNotes || "",
                        "maxDose": item.maxDose || "",
                        "ActionId": item.ActionId,
                        "DoseId": item.DoseId,
                        "DoseUnitId": item.DoseUnitId,
                        "RouteId": item.RouteId,
                        "FrequencyId": item.FrequencyId,

                        "OrderDescription": item.OrderDescription,
                        "OrderTypeId": 2,
                        "OrderTypeName": "Live Medications"
                    }
                    templist[0].DilationMedications.push(obj);
                    $scope.DilationMedicationObj.MedicineObject = "";
                }




            } else {

                //let templist2 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                let templist2 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId = 2;
                    templist2[0].MedTypeName = 'Dilation Medication';
                } else {

                    //let templist3 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 2, 'DeleteInd': 'N' }, true) || [];
                    let templist3 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 2 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist3.length > 0) {

                    } else {
                        var obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "ReviewedBy": null,
                            "IsOrderReviewed": false,
                            "ReviewedByDateTime": null,
                            "ReviewedByPassword": '',
                            "UserType": "Nurse",
                            "ScreenType": "PreOp",
                            "ScreenTypeId": 4,
                            "MedTypeId": 2,
                            "MedTypeName": 'Dilation Medication',
                            "DilationMedications": [],
                            "PreOpMedications": [],
                            "GeneralOrders": [],
                            "OrderTypeId": OrderTypeId || 2,
                            "OrderTypeName": "Live Medications",
                            "UserType": "Nurse",

                        }
                        $scope.LasikTempObj.OrderDetails.push(obj);
                    }

                }
                //let templist1 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 2, 'DeleteInd': 'N' }, true) || [];
                let templist1 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === 2 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist1.length > 0) {
                    let List1 = $filter("filter")(templist1[0].DilationMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                    let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                    if (List.length > 0) {
                        alertify.error("Medicine name already added!");
                        $scope.DilationMedicationObj.MedicineObject = '';
                        return false;
                    }
                    let GivenBy = null;
                    let loggedUser = $filter('filter')($scope.MedicationGivenByNurseArray, { 'DoctorID': $scope.UserId }, true) || [];
                    if (loggedUser.length > 0) {
                        GivenBy = loggedUser[0].DoctorID;
                    }

                    if (type == 'Frequently') {
                        var obj = {
                            "AscMedicationId": 0,
                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                            "ParentOrganizationId": $scope.ParenthospitalId,
                            "ASCOrganizationMedicationId": 0,
                            "Strength": item.Strength || '',
                            "IsFrequent": item.IsFrequent || 'N',
                            "MedicineId": item.MedicineId,
                            "MedicationName": item.MedicationName,
                            "IsChecked": false,
                            "IsDilationMed": false,
                            "IsIntraAnesthesiaMed": false,
                            "IsIntraMed": false,
                            "IsPreOPMed": false,
                            "MedicationDosage": "",
                            "DropTimings": [],
                            "Action": item.Action,
                            "Dose": item.Dose,
                            "DoseUnit": item.DoseUnit,
                            "Route": item.Route,
                            "Frequency": item.Frequency,
                            "MedicationNotes": item.MedicationNotes || "",
                            "maxDose": item.maxDose,
                            "ActionId": item.ActionId,
                            "DoseId": item.DoseId,
                            "DoseUnitId": item.DoseUnitId,
                            "RouteId": item.RouteId,
                            "FrequencyId": item.FrequencyId,

                            "OrderDescription": item.OrderDescription,
                            "TypeId": 2,
                            "DeleteInd": "N",
                            "OrderTypeId": OrderTypeId || 2,
                            "OrderTypeName": "Live Medications"
                        }
                        templist1[0].DilationMedications.push(obj);
                        $scope.DilationMedicationObj.MedicineObject = "";
                    } else {
                        var obj = {
                            "AscMedicationId": 0,
                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                            "ParentOrganizationId": $scope.ParenthospitalId,
                            "ASCOrganizationMedicationId": 0,
                            "Strength": item.Strength || '',
                            "IsFrequent": item.IsFrequent || 'N',
                            "MedicineId": item.MedicineId,
                            "MedicationName": item.MedicineName,
                            "IsChecked": false,
                            "IsDilationMed": false,
                            "IsIntraAnesthesiaMed": false,
                            "IsIntraMed": false,
                            "IsPreOPMed": false,
                            "MedicationDosage": "",
                            "DropTimings": [],
                            "Action": item.Action,
                            "Dose": item.Dose,
                            "DoseUnit": item.DoseUnit,
                            "Route": item.Route,
                            "Frequency": item.Frequency,

                            "ActionId": item.ActionId,
                            "DoseId": item.DoseId,
                            "DoseUnitId": item.DoseUnitId,
                            "RouteId": item.RouteId,
                            "FrequencyId": item.FrequencyId,
                            "MedicationNotes": item.MedicationNotes || "",
                            "maxDose": item.maxDose,
                            "OrderDescription": item.OrderDescription,
                            "TypeId": 2,
                            "DeleteInd": "N",
                            "OrderTypeId": OrderTypeId || 2,
                            "OrderTypeName": "Live Medications"
                        }
                        templist1[0].DilationMedications.push(obj);
                        $scope.DilationMedicationObj.MedicineObject = "";
                    }

                } else {

                }
            }

            let activeOrders = ($scope.LasikTempObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 2);

            let isColumnTrue = activeOrders.some(order =>
            (order.DilationMedications &&
                order.DilationMedications.some(item => item.DeleteInd === 'N'))
            );

            $scope.LasikTempObj.DisableSurgeonordersCheck = isColumnTrue;
            $scope.LasikTempObj.IsSurgeonOrdersTimeChecked = !isColumnTrue;
        }
        /* This popup carries both a Pre-Op and a Post-Op orders block, and each
           saves its templates under its own screen (4 / 6). The page load only
           fetched ScreenTypeId 4, so a post-op template could never show up in
           its Select Template dropdown - pull both lists into the one source. */
        function orderTemplateReq(ScreenTypeId) {
            return {
                "HospitalId": $scope.HospitalId,
                "UserId": $scope.UserId,
                "ScreenTypeId": ScreenTypeId,
                "PageSize": 100,
                "SearchText": '',
                "PageNumber": 1
            };
        }

        $scope.GetOrderTemplates = function () {
            $q.all([
                eHnoteSurgeryService.GetAscUserOrderTemplates(orderTemplateReq(4)),
                eHnoteSurgeryService.GetAscUserOrderTemplates(orderTemplateReq(6))
            ]).then(function (resp) {
                let list = [];
                angular.forEach(resp, function (r) {
                    if (r.data.Status === "Success") {
                        list = list.concat(r.data.rows || []);
                    }
                });
                $scope.UserOrderList = list;
            }, function (err) {
                console.log(err);
            });
        };

        // page load already fetches ScreenTypeId 4 - this tops it up with 6
        $scope.AppendPostOpOrderTemplates = function () {
            eHnoteSurgeryService.GetAscUserOrderTemplates(orderTemplateReq(6)).then(function (resp) {
                if (resp.data.Status === "Success") {
                    $scope.UserOrderList = ($scope.UserOrderList || []).concat(resp.data.rows || []);
                }
            }, function (err) {
                console.log(err);
            });
        };

        $scope.AddUpdateOrderTemplate = function (medtype) {
            var MedTypeName, ScreenType, ScreenTypeId;
            if (medtype == 1) {
                MedTypeName = 'PreOP Medication';
                ScreenType = 'Pre-OP';
                ScreenTypeId = 4;
            }
            else if (medtype == 5) {
                MedTypeName = 'PostOp Medication';
                ScreenType = 'Post-OP';
                ScreenTypeId = 6;
            }
            else {
                MedTypeName = 'Dilation Medication';
                ScreenType = 'Pre-OP';
                ScreenTypeId = 4;
            }

            // the post-op popover writes into its own object
            let TemplateObj = medtype == 5 ? $scope.PostOpTemplateobj : $scope.PreOpTemplateobj;

            if (!TemplateObj.TemplateName) {
                alertify.error("Please enter template name!");
                return false;
            }

            let templateReq = {
                "UserId": $scope.UserId || "",
                "HospitalId": $scope.HospitalId || "",
                "RoleId": $scope.RoleId || null,
                "TemplateId": 0,
                "TemplateName": TemplateObj.TemplateName || "",
                "DeleteInd": "N",
                "ScreenType": ScreenType,
                "ScreenTypeId": ScreenTypeId,
                "MedTypeId": medtype,
                "MedTypeName": MedTypeName,
                "DilationMedications": [],
                "GeneralOrders": [],
                "PreOpMedications": [],
                "PostOpMedications": [],
            };



            let FinalOrderDetails = [];
            if (medtype == 1) {
                FinalOrderDetails = $filter('filter')(angular.copy($scope.LasikTempObj.OrderDetails), { 'MedTypeId': 1 }, true) || [];
                var count = 0
                angular.forEach(FinalOrderDetails, function (Mitem) {
                    let templist = $filter("filter")(Mitem.PreOpMedications, { "DeleteInd": 'N' }, true) || [];
                    let templist1 = $filter("filter")(Mitem.GeneralOrders, { "DeleteInd": 'N' }, true) || [];
                    if (templist.length !== 0 || templist1.length !== 0) {
                        count++;
                    }
                });
                if (count == 0) {
                    alertify.error("Please add any orders data!");
                    return false;
                }
                if (FinalOrderDetails.length > 0) {
                    angular.forEach(FinalOrderDetails, function (Mitem) {
                        if (Mitem.PreOpMedications.length > 0) {
                            angular.forEach(Mitem.PreOpMedications, function (item) {
                                item.IsPreOPMed = true;
                                item.UserType = "Nurse";
                                item.DropTimings = [];
                                if (item.DeleteInd == 'N') {
                                    templateReq.PreOpMedications.push(item);
                                }

                            });
                        }
                        if (Mitem.GeneralOrders.length > 0) {
                            angular.forEach(Mitem.GeneralOrders, function (item) {
                                if (item.DeleteInd == 'N') {
                                    templateReq.GeneralOrders.push(item);
                                }
                            });
                            //  templateReq.GeneralOrders = Mitem.GeneralOrders || [];
                        }
                    });
                }
            }
            else if (medtype == 5) {
                FinalOrderDetails = $filter('filter')(angular.copy($scope.LasikTempObj.OrderDetails), { 'MedTypeId': 5 }, true) || [];
                var count = 0
                angular.forEach(FinalOrderDetails, function (Mitem) {
                    let templist = $filter("filter")(Mitem.PostOpMedications, { "DeleteInd": 'N' }, true) || [];
                    let templist1 = $filter("filter")(Mitem.GeneralOrders, { "DeleteInd": 'N' }, true) || [];

                    if (templist.length !== 0 || templist1.length !== 0) {
                        count++;
                    }
                });
                if (count == 0) {
                    alertify.error("Please add any orders data!");
                    return false;
                }
                angular.forEach(FinalOrderDetails, function (Mitem) {
                    angular.forEach(Mitem.PostOpMedications || [], function (item) {
                        item.UserType = "Nurse";
                        item.DropTimings = [];
                        if (item.DeleteInd == 'N') {
                            templateReq.PostOpMedications.push(item);
                        }
                    });
                    angular.forEach(Mitem.GeneralOrders || [], function (item) {
                        if (item.DeleteInd == 'N') {
                            templateReq.GeneralOrders.push(item);
                        }
                    });
                });
            }
            else {
                FinalOrderDetails = $filter('filter')(angular.copy($scope.LasikTempObj.OrderDetails), { 'MedTypeId': 2 }, true) || [];
                var count = 0
                angular.forEach(FinalOrderDetails, function (Mitem) {
                    let templist = $filter("filter")(Mitem.DilationMedications, { "DeleteInd": 'N' }, true) || [];
                    let templist1 = $filter("filter")(Mitem.GeneralOrders, { "DeleteInd": 'N' }, true) || [];

                    if (templist.length !== 0 || templist1.length !== 0) {
                        count++;
                    }
                });
                if (count == 0) {
                    alertify.error("Please add any orders data!");
                    return false;
                }
                if (FinalOrderDetails.length > 0) {
                    angular.forEach(FinalOrderDetails, function (Mitem) {
                        if (Mitem.DilationMedications.length > 0) {
                            angular.forEach(Mitem.DilationMedications, function (item) {
                                item.IsPreOPMed = true;
                                item.UserType = "Nurse";
                                item.DropTimings = [];
                                if (item.DeleteInd == 'N') {
                                    templateReq.DilationMedications.push(item);
                                }

                            });
                        }
                        if (Mitem.GeneralOrders.length > 0) {
                            angular.forEach(Mitem.GeneralOrders, function (item) {
                                if (item.DeleteInd == 'N') {
                                    templateReq.GeneralOrders.push(item);
                                }
                            });
                            //templateReq.GeneralOrders = Mitem.GeneralOrders || [];
                        }
                    });
                }
            }
            //console.log(JSON.stringify(templateReq));
            //return false;
            eHnoteSurgeryService.AddUpdateAscUserOrderTemplates(templateReq).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("Template saved successfully!");
                    $scope.GetOrderTemplates();
                    if (medtype == 1) {
                        $scope.PreOpTemplateobj.IsOpenPreopOrderTemplate = false;
                        $scope.PreOpTemplateobj.TemplateName = '';
                    }
                    else if (medtype == 5) {
                        $scope.PostOpTemplateobj.IsOpenOrderTemplate = false;
                        $scope.PostOpTemplateobj.TemplateName = '';
                    }
                    else {
                        $scope.PreOpTemplateobj.IsOpenOrderTemplate = false;
                        $scope.PreOpTemplateobj.TemplateName = '';
                    }
                }
                if (resp.data.status === "Failure") {
                    alertify.error('TemplateName Already Exists')
                }
            }, function (err) {
                console.log(err);
            });

        };




        // The checkbox carries ng-model="kitem.IsChecked", so ngModel has already flipped
        // IsChecked by the time this runs. Toggling it again here cancelled every click and
        // made the boxes unselectable - this only does the bookkeeping now.
        $scope.OnPatientChecklistMultiSelect = function (sitem, MItem) {
            sitem.PatientMultiCheckListId = sitem.PatientMultiCheckListId || 0;
            sitem.DeleteInd = (sitem.PatientMultiCheckListId !== 0 && !sitem.IsChecked) ? 'Y' : 'N';

            // parent stays checked while any child is still selected
            MItem.IsChecked = (MItem.OrganizationCheckListDetails || []).some(function (k) {
                return k.IsChecked === true;
            });
        };


        $scope.BuildChecklistPayload = function (sourceArray) {
            let result = [];
            sourceArray = sourceArray || [];

            angular.forEach(sourceArray, function (item) {

                item.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || 0;

                let obj = {
                    "PatientAscCheckListDetailId": item.PatientAscCheckListDetailId,
                    "CheckListId": item.CheckListId,
                    "CheckListName": item.CheckListName || "",
                    "CheckListModuleId": item.CheckListModuleId || null,
                    "CheckListCategoryId": item.CheckListCategoryId || null,
                    "CheckListSubTypeId": item.CheckListSubTypeId || null,
                    "ParentOrganizationId": $scope.ParentHospitalId,
                    "OrganizationPreOpCheckListId": item.OrganizationPreOpCheckListId || null,
                    "OrganizationPreOpCheckListValueId": null,
                    "Value": item.Value || "",
                    "Score": item.Score || 0,
                    "Remarks": item.Remarks || "",
                    "DeleteInd": "N",
                    "AscMultiCheckValueArray": []
                };

                // single-select (radio) -> take the checked child
                let checked = $filter("filter")(item.OrganizationCheckListDetails || [],
                    function (k) { return k.IsChecked === true; }) || [];

                if (item.CheckListCode != 363 && checked.length > 0) {
                    obj.OrganizationPreOpCheckListValueId = checked[0].OrganizationPreOpCheckListValueId || null;
                    obj.Value = checked[0].Value || "";
                    obj.Score = checked[0].SubValue || item.Score || 0;
                }

                // multi-select (checkbox) -> push every child that is checked or previously saved
                angular.forEach(item.OrganizationCheckListDetails || [], function (kitem) {
                    kitem.PatientMultiCheckListId = kitem.PatientMultiCheckListId || 0;
                    kitem.IsChecked = kitem.IsChecked || false;

                    if (kitem.IsChecked || kitem.PatientMultiCheckListId !== 0) {
                        obj.AscMultiCheckValueArray.push({
                            "PatientMultiCheckListId": kitem.PatientMultiCheckListId,
                            "CheckListId": kitem.CheckListId,
                            "OrganizationPreOpCheckListId": kitem.OrganizationPreOpCheckListId || null,
                            "OrganizationPreOpCheckListValueId": kitem.OrganizationPreOpCheckListValueId || null,
                            "Value": kitem.Value || "",
                            "DeleteInd": (kitem.PatientMultiCheckListId !== 0 && !kitem.IsChecked) ? "Y" : "N"
                        });
                    }
                });

                // soft-delete rows that were saved before but are now cleared
                if (item.PatientAscCheckListDetailId !== 0 &&
                    checked.length === 0 &&
                    obj.AscMultiCheckValueArray.length === 0 &&
                    obj.Value === "" && obj.Remarks === "") {
                    obj.DeleteInd = "Y";
                }

                let hasData = obj.Value !== "" || obj.Remarks !== "" ||
                    obj.AscMultiCheckValueArray.length > 0 ||
                    item.PatientAscCheckListDetailId !== 0;

                if (hasData) { result.push(obj); }
            });

            return result;
        };

        // OtherCheckInChecklist and OrgASCChecklist are two copies of the same
        // organisation checklist, so one checklist can reach the payload from more than
        // one source array. Two *new* rows (PatientAscCheckListDetailId 0) for the same
        // checklist insert it twice and it then shows twice in the summary, so keep a
        // single new row per checklist - the answered one when only one was touched.
        // Rows that already exist carry their own id and are left alone.
        $scope.DropDuplicateNewChecklistRows = function (rows) {
            let result = [];
            let keptIndexByCheckList = {};

            let hasData = function (row) {
                return row.Value !== "" || row.Remarks !== "" ||
                    (row.AscMultiCheckValueArray || []).length > 0;
            };

            angular.forEach(rows || [], function (row) {
                if (row.PatientAscCheckListDetailId !== 0) { result.push(row); return; }

                let kept = keptIndexByCheckList[row.CheckListId];
                if (kept === undefined) {
                    keptIndexByCheckList[row.CheckListId] = result.length;
                    result.push(row);
                } else if (hasData(row) && !hasData(result[kept])) {
                    result[kept] = row;
                }
            });

            return result;
        };

        $scope.GetLasikSectionMedTypes = function (sectionKey) {
            if (sectionKey === 'PreOp') { return [1, 2]; }
            if (sectionKey === 'PostOp') { return [5, 8]; }
            return [];
        };

        /* A section's own add-screen object, whichever tab is currently open. */
        $scope.GetLasikSectionAddData = function (sectionKey) {
            var tab = $scope.LasikTabData[sectionKey];
            return tab ? tab.AddData : $scope.LasikTempObj;
        };

        /* Only that tab's order blocks, with the empty ones dropped. */
        $scope.GetLasikSectionOrders = function (sectionKey) {
            let addData = $scope.GetLasikSectionAddData(sectionKey);
            let medTypes = $scope.GetLasikSectionMedTypes(sectionKey);
            let orders = angular.copy($filter('filter')(addData.OrderDetails || [],
                function (Mitem) { return medTypes.indexOf(Mitem.MedTypeId) !== -1; })) || [];

            angular.forEach(orders, function (Mitem) {
                let m1 = $filter('filter')(Mitem.DilationMedications || [], { 'DeleteInd': 'N' }, true) || [];
                let m2 = $filter('filter')(Mitem.PreOpMedications || [], { 'DeleteInd': 'N' }, true) || [];
                let m3 = $filter('filter')(Mitem.PostOpMedications || [], { 'DeleteInd': 'N' }, true) || [];
                let g1 = $filter('filter')(Mitem.GeneralOrders || [], { 'DeleteInd': 'N' }, true) || [];
                if (m1.length === 0 && m2.length === 0 && m3.length === 0 && g1.length === 0) {
                    Mitem.DeleteInd = 'Y';
                }
            });

            return orders;
        };

        
        $scope.GetLasikSectionChecklist = function (sectionKey) {
            let addData = $scope.GetLasikSectionAddData(sectionKey);
            let rows = [];

            if (sectionKey === 'PreOp') {
                rows = rows
                    .concat($scope.BuildChecklistPayload(
                        $filter('filter')(addData.OtherCheckInChecklist || [], { 'CheckListCategoryId': 28 }, true)))
                    .concat($scope.BuildChecklistPayload(
                        $filter('filter')(addData.OrgASCChecklist || [], { 'CheckListCategoryId': 11 }, true)));
            } else if (sectionKey === 'IntraOp') {
                rows = rows.concat($scope.BuildChecklistPayload(addData.IntraopOrgASCChecklist || []));
            } else {
                rows = rows
                    .concat($scope.BuildChecklistPayload(
                        $filter('filter')(addData.OrgASCChecklist || [], { 'CheckListCode': 351 }, true)))
                    .concat($scope.BuildChecklistPayload(
                        $filter('filter')(addData.OtherCheckInChecklist || [], { 'CheckListCategoryId': 31 }, true)));
            }

            return $scope.DropDuplicateNewChecklistRows(rows);
        };

        /* --- the field blocks each section owns --- */
        $scope.GetLasikPreOpFields = function (obj) {
            return {
                //"Patientcheckin": {
                //    "AccompainedBy": obj.AccompainedBy || "",
                //    "AccompainedByNotes": obj.AccompainedByNotes || "",
                //    "AccompainedName": obj.AccompainedName || "",
                //    "FamilyRelationId": obj.FamilyRelationId || null,
                //    "FamilyRelationName": obj.FamilyRelationName || "",
                //    "AccompainedTel": obj.AccompainedTel || "",
                //    "Patientpresentsalone": obj.Patientpresentsalone || "",
                //    "RecievedForSurgery": obj.RecievedForSurgery || "",
                //    "RecievedForSurgeryNotes": obj.RecievedForSurgeryNotes || ""
                //},
                "BP": obj.BP || "",
                "BPDiastolic": obj.BPDiastolic || "",
                "Pulse": obj.Pulse || "",
                "VAOD": obj.VAOD || "",
                "VAOS": obj.VAOS || "",
                "PreOpIOPOD": obj.PreOpIOPOD || "",
                "PreOpIOPOS": obj.PreOpIOPOS || "",
                "PreOpIOPTime": obj.PreOpIOPTime || "",
                "CorneaOD": obj.CorneaOD || "",
                "CorneaOS": obj.CorneaOS || "",
                "Other": obj.InitialClinicalOther || "",
                "FallRiskAssessmentTotalScore": obj.FallRiskAssessmentTotalScore || 0,
                "FallRiskLevel": obj.FallRiskLevel || "",
                "NurseFallRiskID": obj.NurseFallRiskID || null,
                "NurseFallRiskReviewdDate": obj.NurseFallRiskReviewdDate || null,
                "ImplementedFallRiskProtocol": obj.ImplementedFallRiskProtocol || false,
                "ImplementedFallRiskProtocoltype": obj.ImplementedFallRiskProtocoltype || "",
                "Periocularwashwithiodopovidone": obj.Periocularwashwithiodopovidone || false,
                "PreOpNotes": obj.PreOpNotes || "",
                "AccompainedBy": obj.AccompainedBy || "",
                "AccompainedByNotes": obj.AccompainedByNotes || "",
                "AccompainedName": obj.AccompainedName || "",
                "ArrivalType": obj.ArrivalType || "",
                "AccompainedTel": obj.AccompainedTel || "",
                "IsSurgeonOrdersTimeChecked": obj.IsSurgeonOrdersTimeChecked || false,
            };
        };

        $scope.GetLasikIntraOpFields = function (obj) {
            return {
                "EquipmentId": obj.EquipmentId || null,
                "EquipmentName": obj.EquipmentName || "",
                "ODSph": obj.ODSph || "",
                "ODCyl": obj.ODCyl || "",
                "ODAxis": obj.ODAxis || "",
                "ODOpticalZone": obj.ODOpticalZone || "",
                "ODTreatmentZone": obj.ODTreatmentZone || "",
                "OSSph": obj.OSSph || "",
                "OSCyl": obj.OSCyl || "",
                "OSAxis": obj.OSAxis || "",
                "OSOpticalZone": obj.OSOpticalZone || "",
                "OSTreatmentZone": obj.OSTreatmentZone || "",
                "AdverseEvent": obj.AdverseEvent || "",
                "AdverseEventDescription": obj.AdverseEventDescription || "",
                "HallEntranceStartTime": obj.HallEntranceStartTime || "",
                "HallEntranceEndTime": obj.HallEntranceEndTime || "",
                "SurgeryStartTime": obj.SurgeryStartTime || "",
                "SurgeryEndTime": obj.SurgeryEndTime || "",
                "IntraOpNotes": obj.IntraOpNotes || "",
                "RightEyeOD": obj.RightEyeOD || false,
                "LeftEyeOS": obj.LeftEyeOS || false,
                "HeadFixation": obj.HeadFixation || "",
                "IsLateralSupportsUsed": obj.IsLateralSupportsUsed || false,
                "IsVacuumPillowUsed": obj.IsVacuumPillowUsed || false
            };
        };

        /* Post-Op and Discharge share one tab, one save and one sign-off. */
        $scope.GetLasikPostOpFields = function (obj) {
            return {
                /* --- Post-op --- */
                "IOPOD": obj.IOPOD || "",
                "IOPOS": obj.IOPOS || "",
                "IOPTime": obj.IOPTime || "",
                "IOPResultAssessment": obj.IOPResultAssessment || "",
                "IOPActionTaken": obj.IOPActionTaken || "",
                "IOPReEval": obj.IOPReEval || "",
                "IOPReEvalTime": obj.IOPReEvalTime || "",
                "IOPReEvalOD": obj.IOPReEvalOD || null,
                "IOPReEvalOS": obj.IOPReEvalOS || null,
                "IsPostProcedureLevelOfCooperation": obj.IsPostProcedureLevelOfCooperation || false,

                /* --- Discharge --- */
                "IsAlertOrientedX3": obj.IsAlertOrientedX3 || false,
                "IsPhysicianExaminedSafeForDischarge": obj.IsPhysicianExaminedSafeForDischarge || false,
                "DischargeVASScore": obj.DischargeVASScore,
                "BandageProtector": obj.BandageProtector || "",
                "BandageProtectorOther": obj.BandageProtectorOther || "",
                "IsDischargeHomeWithAdult": obj.IsDischargeHomeWithAdult || false,
                "FollowUpId": obj.FollowUpId || null,
                "FollowUpName": obj.FollowUpName || "",
                "FollowUpDate1": obj.FollowUpDate1 || null,
                "FollowUpDate2": obj.FollowUpDate2 || null,
                "FollowUpDate3": obj.FollowUpDate3 || null,
                "ResponsibleAdultName": obj.ResponsibleAdultName || "",
                "PostOpNotes": obj.PostOpNotes || "",
                "AccompainedName": obj.AccompainedName || "",
                "IsPostOpSurgeonOrdersTimeAdded": obj.IsPostOpSurgeonOrdersTimeAdded || false,
            };
        };

        /* One payload builder for all three sections: the common chart keys plus
           the TypeId/TypeName that identifies the section, plus that section's
           fields, checklist rows and order blocks - nothing from the other two. */
        $scope.GetLasikSaveObj = function (str, sectionKey) {
            sectionKey = sectionKey || $scope.ActiveLasikSection;

            let lasikType = $scope.LasikTemplateTypes[sectionKey];
            let state = $scope.LasikTabState[sectionKey];

            let PatientSurgeryId = null;
            if ($scope.cacheStorageItem.AppointmentTypeId == 7) {
                if (($scope.cacheStorageItem.PreAdmSurgeryList || []).length > 0) {
                    PatientSurgeryId = $scope.cacheStorageItem.PreAdmSurgeryList[0].PatientSurgeryId;
                }
            } else if ($scope.cacheStorageItem.AppointmentTypeId == 4 || $scope.cacheStorageItem.AppointmentTypeId == 14) {
                if (($scope.cacheStorageItem.SurgeryList || []).length > 0) {
                    PatientSurgeryId = $scope.cacheStorageItem.SurgeryList[0].PatientSurgeryId;
                }
            }

            if (!state.NurseReviewedDate && state.NurseReviewedById) {
                state.NurseReviewedDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            }

            if (!state.DoctorReviewedDate && state.DoctorReviewedById) {
                state.DoctorReviewedDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            }


            let submitObj = {
                "LasikTemplateId": state.LasikTemplateId || 0,
                "TypeId": lasikType.TypeId,
                "TypeName": lasikType.TypeName,
                "PatientId": $scope.cacheStorageItem.PatientID || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId || null,
                "VisitId": $scope.cacheStorageItem.PatientVisitId || null,
                "PatientSurgeryId": PatientSurgeryId,
                "UserId": $scope.UserId || null,
                "UserType": "Nurse",
                "HospitalId": $scope.HospitalId || null,
                "ParentOrganizationId": $scope.ParentHospitalId || null,
                "StatusFlag": state.StatusFlag || "D",
                "SignOffUserId": state.SignOffUserId || null,
                "TemplateType": "LASIK",

                /* --- Sign-off: each section reviews and signs on its own.
                       Only Post-Op carries the extra MD review. --- */
                "NurseReviewedById": state.NurseReviewedById || null,
                "NurseReviewedByName": state.NurseReviewedByName || "",
                "NurseReviewedDate": state.NurseReviewedDate || null,
                "DoctorReviewedById": (sectionKey === 'PostOp') ? (state.DoctorReviewedById || null) : null,
                "DoctorReviewedByName": (sectionKey === 'PostOp') ? (state.DoctorReviewedByName || "") : "",
                "DoctorReviewedDate": (sectionKey === 'PostOp') ? (state.DoctorReviewedDate || null) : null,

                /* --- Collections, this section's rows only --- */
                "OrgASCChecklist": $scope.GetLasikSectionChecklist(sectionKey),
                "OrderDetails": $scope.GetLasikSectionOrders(sectionKey),
                "Logs": {}
            };

            /* read the section's own add screen, not whichever tab happens to be open */
            let addData = $scope.GetLasikSectionAddData(sectionKey);
            if (sectionKey === 'PreOp') {
                angular.extend(submitObj, $scope.GetLasikPreOpFields(addData));
            } else if (sectionKey === 'IntraOp') {
                angular.extend(submitObj, $scope.GetLasikIntraOpFields(addData));
            } else {
                angular.extend(submitObj, $scope.GetLasikPostOpFields(addData));
            }

            return submitObj;
        };

        /* Save / Sign off / Unsign for one section. Same API for all three - the
           section is carried by TypeId / TypeName inside the payload. */
        $scope.SaveLasikTemplateData = function (str, sectionKey) {
            str = str || 'Draft';
            sectionKey = sectionKey || $scope.ActiveLasikSection;

            let lasikType = $scope.LasikTemplateTypes[sectionKey];
            let state = $scope.LasikTabState[sectionKey];
            if (!lasikType || !state) { return false; }

            if (state.IsClickSaveBtn) { return false; }

            /* a signed section is read-only - it has to be unsigned first */
            if (str === 'Draft' && state.IsSigned) {
                alertify.error("Please unsign " + lasikType.TypeName + " before making changes!");
                return false;
            }

            /* start a fresh change log for this save */
            $scope.LogObj.LogArray = [];

            // Given-by validation, on this section's medication drop timings only
            let missingGivenBy = 0, missingTime = 0, notValidated = 0, notValidatedGeneral = 0;
            let sectionMedTypes = $scope.GetLasikSectionMedTypes(sectionKey);
            angular.forEach($scope.GetLasikSectionAddData(sectionKey).OrderDetails || [], function (Mitem) {
                if (sectionMedTypes.indexOf(Mitem.MedTypeId) === -1) { return; }

                let meds = []
                    .concat(Mitem.DilationMedications || [])
                    .concat(Mitem.PreOpMedications || [])
                    .concat(Mitem.PostOpMedications || []);

                angular.forEach(meds, function (item) {
                    angular.forEach(item.DropTimings || [], function (dt) {
                        if (dt.DeleteInd === 'Y') { return; }
                        if (!dt.MedicationTime) { missingTime++; }
                        if (!dt.GivenBy) { missingGivenBy++; }
                    });
                    // Task 13 - every timing must be validated with the Given By passcode before saving.
                    notValidated += DropTimingGivenByService.GetNotValidatedCount(item.DropTimings);
                });
                angular.forEach(Mitem.GeneralOrders || [], function (g) {
                    if (g.DeleteInd !== 'Y' && g.Status === 'Done' && !g.GivenBy) { missingGivenBy++; }
                });
                // Task 13 - a custom order marked Done needs the Given By passcode as well.
                notValidatedGeneral += DropTimingGivenByService.GetNotValidatedGeneralOrdersCount(Mitem.GeneralOrders);
            });

            if (missingTime > 0) { alertify.error("Please enter time for medications!"); return false; }
            if (missingGivenBy > 0) { alertify.error("Please select Given By for medications!"); return false; }
            if (notValidated > 0) { alertify.error("Please validate Given By password for Medications!"); return false; }
            if (notValidatedGeneral > 0) { alertify.error("Please validate Given By password for Custom Orders!"); return false; }

            if (str === 'SignOff') {
                if (!state.SignOffUserId) {
                    alertify.error("Please select the signing technician / nurse!");
                    return false;
                }
            }

            if (str === 'SignOff' || str === 'Unsign') {
                let signedByUser = '';
                let signOffUser = $filter("filter")($scope.allUserList, function (item) {
                    return item.DoctorID == state.SignOffUserId;
                }) || [];
                if (signOffUser.length > 0) {
                    signedByUser = signOffUser[0].SecondUserFullName +
                        (signOffUser[0].LicenseNumber ? " Lic:" + signOffUser[0].LicenseNumber : "");
                }

                $scope.LogObj.LogArray.push({
                    "LogId": 0,
                    "ModuleId": 2,
                    "ModuleName": "ASC",
                    "SubModuleId": 36,
                    "SubModuleName": "Lasik Template",
                    "ScreenType": (str === 'SignOff') ? "Signed off" : "Unsigned",
                    "ActionType": (str === 'SignOff') ? "Signed off" : "Unsigned",
                    "OldActionDescription": "",
                    "NewActionDescription": (str === 'SignOff')
                        ? `Lasik ${lasikType.TypeName} signed off by ${signedByUser}`
                        : `Lasik ${lasikType.TypeName} unsigned by ${signedByUser}`,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                });
            }

            /* unsigning takes this tab - and only this tab - back to the edit view */
            if (str === 'Unsign') {
                $scope.LasikPendingEditSections[sectionKey] = true;
            }

            let submitObj = $scope.GetLasikSaveObj(str, sectionKey);
            if ($scope.LogObj.LogArray.length > 0) {
                submitObj.Logs = $scope.LogObj;
            }

            state.IsClickSaveBtn = true;

            eHnoteSurgeryService.AddUpdateLasikTemplateData(submitObj).then(function (resp) {
                state.IsClickSaveBtn = false;
                if (resp.data.Status === "Success" || resp.data.status === "Success") {
                    if (str === 'SignOff') {
                        alertify.success(lasikType.TypeName + " signed successfully!");
                    } else if (str === 'Unsign') {
                        alertify.success(lasikType.TypeName + " unsigned successfully!");
                    } else {
                        alertify.success(lasikType.TypeName + " draft saved successfully!");
                    }
                   
                    $scope.LoadLasikTemplateSection(sectionKey);
                } else {
                    $scope.LasikPendingEditSections[sectionKey] = false;
                    alertify.error(resp.data.Message || "Some error occurred");
                }
            }, function () {
                state.IsClickSaveBtn = false;
                $scope.LasikPendingEditSections[sectionKey] = false;
                alertify.error("Saving failed");
            });
        };




        $scope.GetPresentMedicationTime = function (Obj, parentObj, type) {

            Obj.MedicationTime = $filter('date')(new Date(), "hh:mm a");
            if (type == 'DilationMedications') {
                let loggedUser = $filter('filter')($scope.MedicationGivenByNurseArray, { 'DoctorID': $scope.UserId }, true) || [];
                if (loggedUser.length > 0) {
                    Obj.GivenBy = loggedUser[0].DoctorID;
                }
            }
            if (type == 'PreOpMedications') {
                let loggedUser = $filter('filter')($scope.MedicationGivenByArray, { 'DoctorID': $scope.UserId }, true) || [];
                if (loggedUser.length > 0) {
                    Obj.GivenBy = loggedUser[0].DoctorID;
                }
            }
            if (type == 'PostOpMedications') {
                let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
                if (loggedUser.length > 0) {
                    Obj.GivenBy = loggedUser[0].DoctorID;
                }
            }

        };

        $scope.GetCustomOrdersTime = function (item) {
            item.MedicationTime = $filter('date')(new Date(), "hh:mm a");
        };

        $scope.SelectPostOpMedicationItemsFrequent1 = function (item, type) {
            $scope.PostOpMedicationSurgeon = true;

            //let templist = $filter("filter")($scope.LasikTempObj.OrderDetails, { "MedTypeId": 5, 'IsOrderReviewed': false }, true);
            let templist = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                return oitem.MedTypeId === 5 && oitem.IsOrderReviewed === false && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
            }) || [];
            let i = 0;
            angular.forEach($scope.LasikTempObj.OrderDetails, function (mitem) {
                if (mitem.MedTypeId == 5) {
                    angular.forEach(mitem.PostOpMedications, function (Aitem) {
                        if (Aitem.MedicineId == item.MedicineId && Aitem.DeleteInd == 'N') {
                            i++;
                        }
                    });
                };
            });

            if (i > 0) {
                alertify.error('You have already entered this Medication');
                $scope.PostOpMedicationObj.MedicineObject = "";
                return false;
            }
            if (templist.length > 0) {

                let List1 = $filter("filter")(templist[0].PostOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                if (List.length > 0) {
                    alertify.error("Medicine name already added!");
                    $scope.PostOpMedicationObj.MedicineObject = '';
                    return false;
                }
                let GivenBy = null;
                let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
                if (loggedUser.length > 0) {
                    GivenBy = loggedUser[0].DoctorID;
                }

                if (type == 'Frequently') {
                    var obj = {
                        "AscMedicationId": 0,
                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "ASCOrganizationMedicationId": 0,
                        "Strength": item.Strength || '',
                        "IsFrequent": item.IsFrequent || 'N',
                        "MedicineId": item.MedicineId,
                        "MedicationName": item.MedicationName,
                        "IsChecked": false,
                        "IsDilationMed": false,
                        "IsIntraAnesthesiaMed": false,
                        "IsIntraMed": false,
                        "IsPreOPMed": false,
                        "MedicationDosage": "",
                        "DropTimings": [],

                        "TypeId": 4,
                        "DeleteInd": "N",
                        "Action": item.Action,
                        "Dose": item.Dose,
                        "DoseUnit": item.DoseUnit,
                        "Route": item.Route,
                        "Frequency": item.Frequency,
                        "ActionId": item.ActionId,
                        "DoseId": item.DoseId,
                        "DoseUnitId": item.DoseUnitId,
                        "RouteId": item.RouteId,
                        "FrequencyId": item.FrequencyId,
                        "OrderDescription": item.OrderDescription,
                        "MedicationNotes": item.MedicationNotes || "",
                        "maxDose": item.maxDose,
                        "OrderTypeId": OrderTypeId || 2,
                        "OrderTypeName": "Live Medications"
                    }
                    templist[0].PostOpMedications.push(obj);
                    $scope.PostOpMedicationObj.MedicineObject = "";
                    // $scope.AddIntraOpDropsTime(obj, 'PostOpMedications');
                } else {
                    var obj = {
                        "AscMedicationId": 0,
                        "OrganizationMedicationId": item.OrganizationPrescriptionId,
                        "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                        "ParentOrganizationId": $scope.ParenthospitalId,
                        "ASCOrganizationMedicationId": 0,
                        "Strength": item.Strength || '',
                        "IsFrequent": item.IsFrequent || 'N',
                        "MedicineId": item.MedicineId,
                        "MedicationName": item.MedicineName,
                        "IsChecked": false,
                        "IsDilationMed": false,
                        "IsIntraAnesthesiaMed": false,
                        "IsIntraMed": false,
                        "IsPreOPMed": false,
                        "MedicationDosage": "",
                        "DropTimings": [],

                        "TypeId": 4,
                        "DeleteInd": "N",
                        "Action": item.Action,
                        "Dose": item.Dose,
                        "DoseUnit": item.DoseUnit,
                        "Route": item.Route,
                        "Frequency": item.Frequency,
                        "ActionId": item.ActionId,
                        "DoseId": item.DoseId,
                        "DoseUnitId": item.DoseUnitId,
                        "RouteId": item.RouteId,
                        "FrequencyId": item.FrequencyId,
                        "OrderDescription": item.OrderDescription,
                        "MedicationNotes": item.MedicationNotes || "",
                        "maxDose": item.maxDose,
                        "OrderTypeId": 2,
                        "OrderTypeName": "Live Medications"
                    }
                    templist[0].PostOpMedications.push(obj);
                    $scope.PostOpMedicationObj.MedicineObject = "";
                    //  $scope.AddIntraOpDropsTime(obj, 'PostOpMedications');
                }





            } else {

                //let templist2 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": null }, true) || [];
                let templist2 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === null && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist2.length > 0) {
                    templist2[0].MedTypeId = 5;
                    templist2[0].MedTypeName = 'PostOp Medication';

                    templist2[0].ScreenType = 'PostOp';
                    templist2[0].ScreenTypeId = 6;
                } else {

                    //let templist3 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 5 }, true) || [];
                    let templist3 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                        return oitem.MedTypeId === 5 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                    }) || [];
                    if (templist3.length > 0) {

                    } else {
                        var obj = {
                            "UserOrderId": 0,
                            "UserId": $scope.UserId,
                            "DeleteInd": "N",
                            "IsOrderReviewed": false,
                            "ReviewedByDateTime": null,
                            "ReviewedByPassword": '',
                            "ReviewedBy": null,
                            "UserType": "Nurse",
                            "ScreenType": "PostOp",
                            "ScreenTypeId": 6,
                            "MedTypeId": 5,
                            "MedTypeName": 'PostOp Medication',
                            "PostOpMedications": [],
                            "GeneralOrders": [],
                            "OrderTypeId": OrderTypeId || 2,
                            "OrderTypeName": "Live Medications"
                        }
                        $scope.LasikTempObj.OrderDetails.push(obj);
                    }

                }
                //let templist1 = $filter("filter")($scope.LasikTempObj.OrderDetails, { "ReviewedBy": null, "MedTypeId": 5 }, true) || [];
                let templist1 = $filter("filter")($scope.LasikTempObj.OrderDetails, function (oitem) {
                    return oitem.MedTypeId === 5 && oitem.ReviewedBy === null && oitem.DeleteInd === 'N' && oitem.OrderTypeId === OrderTypeId;
                }) || [];
                if (templist1.length > 0) {
                    let List1 = $filter("filter")(templist1[0].PostOpMedications, { "OrganizationPrescriptionId": item.OrganizationPrescriptionId }, true);
                    let List = $filter('filter')(List1, { 'DeleteInd': 'N' }, true);
                    if (List.length > 0) {
                        alertify.error("Medicine name already added!");
                        $scope.PostOpMedicationObj.MedicineObject = "";
                        return false;
                    }
                    let GivenBy = null;
                    let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true) || [];
                    if (loggedUser.length > 0) {
                        GivenBy = loggedUser[0].DoctorID;
                    }

                    if (type == 'Frequently') {
                        var obj = {
                            "AscMedicationId": 0,
                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                            "ParentOrganizationId": $scope.ParenthospitalId,
                            "ASCOrganizationMedicationId": 0,
                            "Strength": item.Strength || '',
                            "IsFrequent": item.IsFrequent || 'N',
                            "MedicineId": item.MedicineId,
                            "MedicationName": item.MedicationName,
                            "IsChecked": false,
                            "IsDilationMed": false,
                            "IsIntraAnesthesiaMed": false,
                            "IsIntraMed": false,
                            "IsPreOPMed": false,
                            "MedicationDosage": "",
                            "DropTimings": [],

                            "TypeId": 4,
                            "DeleteInd": "N",
                            "Action": item.Action,
                            "Dose": item.Dose,
                            "DoseUnit": item.DoseUnit,
                            "Route": item.Route,
                            "Frequency": item.Frequency,
                            "ActionId": item.ActionId,
                            "DoseId": item.DoseId,
                            "DoseUnitId": item.DoseUnitId,
                            "RouteId": item.RouteId,
                            "FrequencyId": item.FrequencyId,
                            "OrderDescription": item.OrderDescription,
                            "MedicationNotes": item.MedicationNotes || "",
                            "maxDose": item.maxDose,
                            "OrderTypeId": OrderTypeId || 2,
                            "OrderTypeName": "Live Medications"
                        }
                        templist1[0].PostOpMedications.push(obj);
                        $scope.PostOpMedicationObj.MedicineObject = "";

                    } else {
                        var obj = {
                            "AscMedicationId": 0,
                            "OrganizationMedicationId": item.OrganizationPrescriptionId,
                            "OrganizationPrescriptionId": item.OrganizationPrescriptionId,
                            "ParentOrganizationId": $scope.ParenthospitalId,
                            "ASCOrganizationMedicationId": 0,
                            "Strength": item.Strength || '',
                            "IsFrequent": item.IsFrequent || 'N',
                            "MedicineId": item.MedicineId,
                            "MedicationName": item.MedicineName,
                            "IsChecked": false,
                            "IsDilationMed": false,
                            "IsIntraAnesthesiaMed": false,
                            "IsIntraMed": false,
                            "IsPreOPMed": false,
                            "MedicationDosage": "",
                            "DropTimings": [],

                            "TypeId": 4,
                            "DeleteInd": "N",
                            "Action": item.Action,
                            "Dose": item.Dose,
                            "DoseUnit": item.DoseUnit,
                            "Route": item.Route,
                            "Frequency": item.Frequency,
                            "ActionId": item.ActionId,
                            "DoseId": item.DoseId,
                            "DoseUnitId": item.DoseUnitId,
                            "RouteId": item.RouteId,
                            "FrequencyId": item.FrequencyId,
                            "OrderDescription": item.OrderDescription,
                            "MedicationNotes": item.MedicationNotes || "",
                            "maxDose": item.maxDose,
                            "OrderTypeId": OrderTypeId || 2,
                            "OrderTypeName": "Live Medications"
                        }
                        templist1[0].PostOpMedications.push(obj);
                        $scope.PostOpMedicationObj.MedicineObject = "";
                        //$scope.AddIntraOpDropsTime(obj, 'PostOpMedications');
                    }



                } else {




                }

            }



            let activeOrders = ($scope.LasikTempObj.OrderDetails || []).filter(order => order.DeleteInd === 'N' && order.MedTypeId == 5);

            let isColumnTrue = activeOrders.some(order =>
            (order.PostOpMedications &&
                order.PostOpMedications.some(item => item.DeleteInd === 'N'))
            );

            $scope.LasikTempObj.DisablePostOpSurgeonCheck = isColumnTrue;
            $scope.LasikTempObj.IsPostOpSurgeonOrdersTimeAdded = !isColumnTrue;
        }

        $scope.AddPreOpDropsTime = function (obj, type) {

            let activeTimings = obj.DropTimings.filter(x => x.DeleteInd !== "Y");
            let templength = activeTimings.length;

            if (templength > 0) {
                let value = obj.DropTimings[templength - 1].MedicationTime;
                let GivenBy = obj.DropTimings[templength - 1].GivenBy;
                if (value == "") {
                    alertify.error("Please enter time!");
                    return;
                }
                GivenBy = GivenBy || null;
                if (GivenBy == null) {
                    alertify.error("Please Select GivenBy for Medications!");
                    return;
                }
            }



            let selectedGivenBy = null;
            if (type == 'DilationMedications') {
                let loggedUser = $filter('filter')($scope.MedicationGivenByNurseArray, { 'DoctorID': $scope.UserId }, true) || [];
                if (loggedUser.length > 0) {
                    selectedGivenBy = loggedUser[0].DoctorID;
                }
            }
            if (type == 'PreOpMediacation') {
                let loggedUser = $filter('filter')($scope.PreopHandOffArray, { 'DoctorID': $scope.UserId }, true) || [];
                if (loggedUser.length > 0) {
                    selectedGivenBy = loggedUser[0].DoctorID;
                }
            }

            let object = {
                "DropTimingId": 0,
                "MedicineId": obj.MedicineId,
                "MedicationName": obj.MedicationName,
                "GivenBy": selectedGivenBy || null,
                "shownotes": false,
                "IsEditDrop": false,
                "IsEditview": false,
                "Remarks": "",
                "MedicationTime": "",
                "DeleteInd": "N",
                "MedicationDosage": ""
            };
            obj.DropTimings.push(object);
        };
        $scope.AddIntraOpDropsTime = function (obj, type) {
            //let templength = obj.DropTimings.length;

            let activeTimings = obj.DropTimings.filter(x => x.DeleteInd !== "Y");
            let templength = activeTimings.length;

            if (templength > 0) {
                let value = obj.DropTimings[templength - 1].MedicationTime;
                let GivenBy = obj.DropTimings[templength - 1].GivenBy;
                if (value == "") {
                    alertify.error("Please enter time!");
                    return;
                }
                GivenBy = GivenBy || null;
                if (GivenBy == null) {
                    alertify.error("Please Select GivenBy  for Medications!");
                    return;
                }
            }




            let PostGivenby = null;
            if (type == 'PostOpMedications') {
                let loggedUser = $filter('filter')($scope.NurseAnesthetistArray, { 'DoctorID': $scope.UserId }, true);
                if (loggedUser.length > 0) {
                    PostGivenby = loggedUser[0].DoctorID;
                }
            }
            if (type == 'PostOpAnesthesiaMedications') {
                let loggedUser = $filter('filter')($scope.AnesthesiaGivenArray, { 'DoctorID': $scope.UserId }, true);
                if (loggedUser.length > 0) {
                    PostGivenby = loggedUser[0].DoctorID;
                }
            }



            let object = {
                "DropTimingId": 0,
                "MedicineId": obj.MedicineId,
                "MedicationName": obj.MedicationName,
                "GivenBy": PostGivenby || null,
                "shownotes": false,
                "IsEditDrop": false,
                "IsEditview": false,
                "Remarks": "",
                "DeleteInd": "N",
                "MedicationTime": null,
                "MedicationDosage": ""
            };
            obj.DropTimings.push(object);
        };

        $scope.DeleteDrop = function (item, Aitem, Type) {

            Aitem.DropTimingId = Aitem.DropTimingId || 0;
            if (Type == 'PreOpMediacation') {
                var index = item.DropTimings.indexOf(Aitem);
                var index1 = $scope.LasikTempObj.PreOpMedications.indexOf(item);

            }
            else {
                var index = item.DropTimings.indexOf(Aitem);
                var index1 = $scope.LasikTempObj.DilationMedications.indexOf(item);
            }
            if (Aitem.DropTimingId != 0) {
                alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {
                    if (index > -1) {
                        Aitem.DeleteInd = 'Y';

                    }
                    $scope.$digest();
                }, function () {

                });
            }
            else {
                if (index > -1) {
                    item.DropTimings.splice(index, 1);

                }
            }

        }

        $scope.DeletePostOpDrop = function (item, Aitem) {

            Aitem.DropTimingId = Aitem.DropTimingId || 0;
            var index = item.DropTimings.indexOf(Aitem);
            var index1 = $scope.LasikTempObj.PostOpMedications.indexOf(item);
            if (Aitem.DropTimingId != 0) {
                alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure you want to Delete?</h4>", function () {

                    if (index > -1) {
                        Aitem.DeleteInd = 'Y';

                    }

                    $scope.$digest();
                }, function () {
                });
            }
            else {
                if (index > -1) {
                    item.DropTimings.splice(index, 1);

                }
            }

        }

        // Task 56803 - Lasik Surgeon orders show AMSCA and DEA next to the License ID when the reviewer is an MD.
        // A credential of 0 / "0" means "not on file" and must not be displayed.
        $scope.HasCredentialValue = function (Value) {
            return Value != null && Value !== '' && Value != 0;
        };

        // DEA/AMSCA live on the user list (the AMSCA column is exposed as AMSCAA), not on the order row,
        // and apply only to providers carrying the MD suffix (SuffixId 10).
        $scope.SetSurgeonCredentials = function (OrderDetails) {
            var UserList = ($scope.allUserList && $scope.allUserList.length > 0) ? $scope.allUserList : (localStorageFactory.getItem("allUserList") || []);
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

        $scope.GetValidateUserPassword = function (item, type) {

            item.ReviewedBy = item.ReviewedBy || null;
            if (item.ReviewedBy == null) {
                alertify.error("Please Select ReviewedBy");
                return false;
            }
            item.ReviewedByPassword = item.ReviewedByPassword || '';
            if (item.ReviewedByPassword == '') {
                alertify.error("Please Enter Password");
                return false;
            }
            let reqObj = {
                "Password": item.ReviewedByPassword,
                "UserId": $scope.UserId,
                "ReviewedBy": item.ReviewedBy,
                "OrganizationId": $scope.HospitalId
            };
            eHnoteSurgeryService.GetUserValidatePassword(reqObj).then(function (resp) {
                if (resp.data.status === "Success") {
                    alertify.success("Successfully Validated!");
                    //$scope.MedicationOrdersReviwedByLogs(item);
                    item.IsOrderReviewed = true;
                    //  item.ReviewedByDateTime = $filter("date")(new Date(), "MM-dd-yyyy hh:mm a");
                    let Admissiondatetime = $scope.cacheStorageItem.Admissiondatetime || null;
                    let ReviewedByDateTime = $filter("date")(new Date(), "MM-dd-yyyy hh:mm a") || null;
                    if (Admissiondatetime) {
                        ReviewedByDateTime = $filter('date')(Admissiondatetime, "MM-dd-yyyy hh:mm a") || null;
                    }
                    item.ReviewedByDateTime = ReviewedByDateTime;
                    if (type == 'DilationMedications' || type == 'PostOpMedications') {
                        angular.forEach($scope.SurgeonArray, function (subitem) {
                            if (subitem.DoctorID == item.ReviewedBy) {
                                item.ReviewedByName = subitem.UserFullName;
                                item.LicenseNumber = subitem.LicenseNumber;
                            }
                        });
                    }
                    else {

                    }
                    // Task 56803 - re-resolve for the reviewer just validated, not a previous one.
                    item.DEA = '';
                    item.AMSCA = '';
                    $scope.SetSurgeonCredentials([item]);
                } else {
                    alertify.error("Invalid Password!");
                }
            }, function (err) {
                alertify.error("Fetching data failed!");

            });
        };

        $scope.addTextBoxF1 = function () {

            if ($scope.LasikTempObj.FollowUpDate1 == '') {
                alertify.error("Please Enter Followup 1 !");
                return false;
            }
            $scope.LasikTempObj.FollowUpDate2Ind = true;
        }

        $scope.addTextBoxF2 = function () {
            if ($scope.LasikTempObj.FollowUpDate2 == '') {
                alertify.error("Please Enter Followup 2 !");
                return false;
            }
            $scope.LasikTempObj.FollowUpDate3Ind = true;
        }

        /* The role a user record already carries; the two LASIK sign-off roles are
           named only when the record has no RoleName of its own. */
        $scope.GetLasikUserRoleName = function (user) {
            if (!user) { return ''; }
            if (user.RoleName) { return user.RoleName; }
            if (Number(user.RoleId) === 8) { return 'Nurse'; }
            if (Number(user.RoleId) === 38) { return 'ASC Technician'; }
            return '';
        };

        /* "Arjun Reddy BSN (Nurse)" - name, credentials and role for the sign-off
           picker, built from the user record itself. */
        $scope.GetLasikUserDisplayName = function (user) {
            if (!user) { return ''; }

            var text = user.FullName || user.UserFullName || user.SecondUserFullName || '';
            if (user.SuffixName) { text += ' ' + user.SuffixName; }

            //var role = $scope.GetLasikUserRoleName(user);
            //if (role) { text += ' (' + role + ')'; }
            return text;
        };

        /* The only users allowed to sign a LASIK tab: nurses and ASC technicians,
           straight off the existing nurseAndAscTechnicianList. */
        $scope.GetLasikSignOffUsers = function () {
            return ($scope.nurseAndAscTechnicianList || []).map(function (user) {
                return angular.extend({}, user, {
                    "SignOffDisplayName": $scope.GetLasikUserDisplayName(user),
                    //"SignOffRoleName": $scope.GetLasikUserRoleName(user)
                });
            });
        };

        /* Reviewed by (nurse / ASC technician) - every tab keeps its own. */
        $scope.ChangeReviewedbyItem = function (sectionKey) {
            var state = $scope.LasikTabState[sectionKey];
            if (!state) { return false; }

            var TempFilter = $filter('filter')($scope.nurseAndAscTechnicianList, { 'DoctorID': state.NurseReviewedById }, true) || [];
            if (TempFilter.length > 0) {
                state.NurseReviewedById = TempFilter[0].DoctorID;
                state.NurseReviewedByName = TempFilter[0].UserFullName;
                state.NurseReviewedDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            } else {
                state.NurseReviewedById = null;
                state.NurseReviewedByName = '';
                state.NurseReviewedDate = null;
            }
        };

        /* Reviewed by - Doctor. Post-Op only: Pre-Op and Intra-Op are nurse /
           ASC technician sign-offs and carry no MD review. */
        $scope.ChangeMDReviewedbyItem = function (sectionKey) {
            var state = $scope.LasikTabState[sectionKey];
            if (!state) { return false; }

            var TempFilter = $filter('filter')($scope.SurgeonArray, { 'DoctorID': state.DoctorReviewedById }, true) || [];
            if (TempFilter.length > 0) {
                state.DoctorReviewedById = TempFilter[0].DoctorID;
                state.DoctorReviewedByName = TempFilter[0].UserFullName;
                state.DoctorReviewedDate = $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss");
            } else {
                state.DoctorReviewedById = null;
                state.DoctorReviewedByName = '';
                state.DoctorReviewedDate = null;
            }
        };


        $scope.OnPreOpChecklistSelect = function (obj, parentobj) {

            // Only handle the options belonging to this checklist question
            angular.forEach(parentobj.OrganizationCheckListDetails, function (item) {

                if (item === obj) {

                    // Select clicked option
                    item.IsChecked = true;

                    parentobj.Value = item.Value;

                    item.PatientAscCheckListDetailId =
                        item.PatientAscCheckListDetailId || null;

                    // If previously saved, don't delete the selected item
                    item.DeleteInd = "N";

                } else {

                    // Unselect only the other options of THIS checklist
                    item.IsChecked = false;

                    // Mark previously saved options as deleted
                    //if (item.PatientAscCheckListDetailId != null) {
                    //    item.DeleteInd = "Y";
                    //}
                }
            });

            // Clear remarks when selected option is not Other
            if (obj.Value != "Other") {
                parentobj.Remarks = "";
            }

            parentobj.ChecklistDate = null;
        };


        //$scope.OnPreOpChecklistSelect = function (obj, parentobj) {
        //    var CheckListInd = false;
        //    angular.forEach(parentobj.OrganizationCheckListDetails, function (item) {
        //        if (obj.IsChecked == true) {
        //            CheckListInd = true;
        //            parentobj.Value = obj.Value;
        //            item.PatientAscCheckListDetailId = item.PatientAscCheckListDetailId || null;
        //            if (item.PatientAscCheckListDetailId != null) {
        //                item.DeleteInd = "Y";
        //            }
        //        } else {
        //            item.IsChecked = false;
        //        }
        //    });

        //    if (CheckListInd == true) {
        //        obj.IsChecked = false;
        //        parentobj.IsChecked = false;
        //    } else {
        //        obj.IsChecked = true;
        //        parentobj.IsChecked = true;

        //        // Clear Remarks when changing to any option other than Other
        //        if (obj.Value != "Other") {
        //            parentobj.Remarks = "";
        //        }

        //        parentobj.ChecklistDate = null;
        //    }
        //};




        /* ---------- small helpers ---------- */
        $scope.ToBool = function (v) {
            return v === true || v === 'Y' || v === 'y' || v === 'true' || v === 1;
        };
        $scope.ToYN = function (v) { return (v === true || v === 'Y') ? 'Y' : 'N'; };

        $scope.GetUserNameById = function (id, arr) {
            id = id || null;
            if (id === null) { return ''; }
            arr = arr || $scope.allUserList || [];
            var list = $filter('filter')(arr, { 'DoctorID': id }, true) || [];
            return list.length > 0 ? (list[0].UserFullName || list[0].FullName || '') : '';
        };

        /* A reviewer's licence, read off the same user record their name comes
           from. The role list is tried first and the full user list second, so a
           reviewer who is not in the shorter list still gets their licence. */
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

        
        $scope.BuildLasikSignOffInfo = function (state) {
            if (!state) { return; }
            state.SignOffInfo = null;
            state.SignedBy = '';

            if (state.StatusFlag !== 'E') { return; }

            var info = null;
            var details = state.LastSignOffUserDetails || [];

            /* the signer's own record, for the credentials / role the chart row
               does not carry itself */
            var signer = ($scope.allUserList || []).filter(function (u) {
                return Number(u.DoctorID) === Number(state.SignOffUserId);
            })[0];

            if (details.length > 0) {
                info = {
                    "Name": details[0].SignOffUserName || '',
                    "SuffixName": details[0].SuffixName || (signer ? signer.SuffixName : '') || '',
                    "LicenseNumber": details[0].LicenseNumber || (signer ? signer.LicenseNumber : '') || '',
                    "Date": details[0].Date || null
                };
            } else {
                if (!signer) { return; }

                info = {
                    "Name": signer.FullName || '',
                    "SuffixName": signer.SuffixName || '',
                    "LicenseNumber": signer.LicenseNumber || '',
                    "Date": state.SignOffDate || null
                };
            }

            /* one place the signature string is composed, so all three tabs read alike */
            var text = info.Name || '';
            if (info.SuffixName) { text += ' ' + info.SuffixName; }
            if (info.LicenseNumber) { text += ', ' + 'Lic:' + info.LicenseNumber; }
            if (info.Date) {
                text += ', ' + $filter('date')(info.Date, 'MM-dd-yyyy') +
                    ' ' + $filter('date')(info.Date, 'hh:mm a');
            }
            info.DisplayText = text;

            state.SignOffInfo = info;
            state.SignedBy = info.Name || '';
        };

        /* ---------- 1. CHECKLISTS ---------- */
        /* Binds one section's saved answers into that section's own checklist copies
           and builds that section's summary rows. */
        $scope.BindLasikChecklistData = function (tab, savedList) {
            savedList = savedList || [];

            var addData = tab.AddData;
            var masterArrays = [
                addData.CheckInChecklist,
                addData.OtherCheckInChecklist,
                addData.OrgASCChecklist,
                addData.IntraopOrgASCChecklist
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
            });

            $scope.BuildLasikChecklistSummary(tab.SummaryData, savedList);
        };

        /* The summary rows are read straight off the saved list, which can hold more than
           one row per checklist: answers that were cleared again are kept as DeleteInd 'Y',
           and charts saved while the check-in list was being submitted twice carry a stale
           duplicate of every check-in answer. Both made the summary list an item several
           times over. Keep only live rows, one per checklist - the last one, which is the
           row the loop above binds into the edit view, so summary and edit view agree. */
        $scope.PickLatestChecklistRows = function (savedList, matches) {
            let rowByCheckList = {};
            let order = [];

            angular.forEach(savedList || [], function (item) {
                if (item.DeleteInd === 'Y' || !matches(item)) { return; }

                if (!rowByCheckList.hasOwnProperty(item.CheckListId)) {
                    order.push(item.CheckListId);
                }
                rowByCheckList[item.CheckListId] = item;
            });

            return order.map(function (id) { return rowByCheckList[id]; });
        };

        /* Fills one tab's summary screen. Only rows saved under that tab's TypeId
           reach it, so a summary can never show another section's answers. */
        $scope.BuildLasikChecklistSummary = function (summaryObj, savedList) {
            let on = function (field, ids) {
                return function (item) { return ids.indexOf(parseInt(item[field])) !== -1; };
            };

            summaryObj.PreOpChecklist =
                $scope.PickLatestChecklistRows(savedList, on('CheckListId', [631, 632, 633, 634, 635]));
            summaryObj.OtherChecklist =
                $scope.PickLatestChecklistRows(savedList, on('CheckListCategoryId', [28]));
            summaryObj.DISCHARGEChecklist =
                $scope.PickLatestChecklistRows(savedList, on('CheckListCategoryId', [31]));
            summaryObj.FallRiskRows =
                $scope.PickLatestChecklistRows(savedList, on('CheckListCategoryId', [11]));
            summaryObj.PostopStatusRows =
                $scope.PickLatestChecklistRows(savedList, on('CheckListCode', [351]));
            summaryObj.AdverseEventsRows =
                $scope.PickLatestChecklistRows(savedList, on('CheckListCode', [350]));
            summaryObj.IntraopRows =
                $scope.PickLatestChecklistRows(savedList, on('CheckListCode', [347]));
            summaryObj.PatientPositionLasikRows =
                $scope.PickLatestChecklistRows(savedList, on('CheckListCode', [359, 373, 374, 349]));
        };

        /* ---------- 2. ORDERS / MEDICATIONS ---------- */
        /* One section's saved order blocks, into that section's own add screen. */
        $scope.BindLasikOrderDetails = function (tab, orders) {
            orders = orders || [];
            var finalOrders = [];

            angular.forEach(orders, function (mitem) {
                if (mitem.DeleteInd === 'Y') { return; }
                mitem.UserOrderId = mitem.UserOrderId || 0;
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
                        kitem.IsEditDrop = false;
                        if (kitem.GivenBy == $scope.UserId || $scope.RoleId == 73) {
                            kitem.IsEditDrop = true;
                        }
                        kitem.GivenByname = kitem.GivenByname || $scope.GetUserNameById(kitem.GivenBy);
                    });
                });

                angular.forEach(mitem.GeneralOrders, function (g) {
                    g.DeleteInd = g.DeleteInd || 'N';
                    g.Status = g.Status || '';
                    g.GeneralOrderId = g.GeneralOrderId || 0;
                });

                finalOrders.push(mitem);
            });

            /* always keep one empty "live" block so new orders can still be added */
            if (finalOrders.length === 0) {
                finalOrders = angular.copy($scope.GetLasikTempObj().OrderDetails);
            }
            tab.AddData.OrderDetails = finalOrders;
            tab.SummaryData.OrderDetails = finalOrders;
            $scope.SetSurgeonCredentials(finalOrders);

            /* "No medications administered" checkbox states */
            var preOpActive = (finalOrders || []).filter(function (o) {
                return o.DeleteInd === 'N' && o.MedTypeId === 2;
            }).some(function (o) {
                return (o.DilationMedications || []).some(function (i) { return i.DeleteInd === 'N'; });
            });
            if (preOpActive) {
                tab.AddData.DisableSurgeonordersCheck = preOpActive;
                tab.AddData.IsSurgeonOrdersTimeChecked = !preOpActive;
            }

            var postOpActive = (finalOrders || []).filter(function (o) {
                return o.DeleteInd === 'N' && o.MedTypeId === 5;
            }).some(function (o) {
                return (o.PostOpMedications || []).some(function (i) { return i.DeleteInd === 'N'; });
            });

            if (postOpActive) {
                tab.AddData.DisablePostOpSurgeonCheck = postOpActive;
                tab.AddData.IsPostOpSurgeonOrdersTimeAdded = !postOpActive;
            }
            
        };

        /* ---------- 3. MAIN BIND ---------- */

        /* Which tabs a saved row feeds. Rows written before the split carry no
           TypeId - one row then held all three sections, so it still binds, and
           reads as signed, for all three. */
        /* The saved checklist rows a section owns, out of one chart row's list. */
        $scope.FilterLasikSectionChecklistRows = function (sectionKey, savedList) {
            var inList = function (v, ids) { return ids.indexOf(parseInt(v)) !== -1; };

            return (savedList || []).filter(function (item) {
                if (!item || item.DeleteInd === 'Y') { return false; }

                if (sectionKey === 'PreOp') {
                    return inList(item.CheckListCategoryId, [28, 11]);
                }
                if (sectionKey === 'IntraOp') {
                    return inList(item.CheckListCategoryId, [29]) ||
                        inList(item.CheckListCode, [347, 350, 359, 373, 374, 349]);
                }
                return inList(item.CheckListCategoryId, [31]) || inList(item.CheckListCode, [351]);
            });
        };

        /* Does this chart row actually carry anything for this section? The row is
           run through the section's own binder into a scratch template and the
           section's own payload builder decides whether anything came out. */
        $scope.RowHasLasikSectionContent = function (sectionKey, row) {
            row = row || {};

            var scratch = $scope.GetLasikTempObj();
            var pristine = $scope.GetLasikTempObj();
            var current, blank;

            if (sectionKey === 'PreOp') {
                $scope.BindLasikPreOpFields(scratch, row);
                current = $scope.GetLasikPreOpFields(scratch);
                blank = $scope.GetLasikPreOpFields(pristine);
            } else if (sectionKey === 'IntraOp') {
                $scope.BindLasikIntraOpFields(scratch, row);
                current = $scope.GetLasikIntraOpFields(scratch);
                blank = $scope.GetLasikIntraOpFields(pristine);
            } else {
                $scope.BindLasikPostOpFields(scratch, row);
                current = $scope.GetLasikPostOpFields(scratch);
                blank = $scope.GetLasikPostOpFields(pristine);
            }

            if (!angular.equals(current, blank)) { return true; }
            if ($scope.FilterLasikSectionChecklistRows(sectionKey, row.OrgASCChecklist).length > 0) { return true; }

            var medTypes = $scope.GetLasikSectionMedTypes(sectionKey);
            return (row.OrderDetails || []).filter(function (o) {
                return o && o.DeleteInd !== 'Y' && medTypes.indexOf(o.MedTypeId) !== -1;
            }).length > 0;
        };

        $scope.GetLasikRowSections = function (row) {
            var typeId = row.TypeId || null;
            var keys = [];

            angular.forEach($scope.LasikTemplateTypes, function (lasikType, key) {
                if (typeId !== null && Number(typeId) === lasikType.TypeId) { keys.push(key); }
            });
            if (keys.length > 0) { return keys; }

            /* No TypeId on the row - a chart saved before the split, or a backend
               that does not echo it yet. Give it only to the sections it actually
               carries data for: binding an Intra-Op row into Pre-Op would overwrite
               Pre-Op's fields with that row's empty ones and wipe the tab. */
            if (typeId === null) {
                angular.forEach($scope.LasikTemplateTypes, function (lasikType, key) {
                    if ($scope.RowHasLasikSectionContent(key, row)) { keys.push(key); }
                });
            }
            return keys;
        };

        /* A fingerprint of exactly what this section would send on save, taken every
           time the section is loaded. Comparing it against the section's current
           contents says whether the user has unsaved edits on that tab. */
        $scope.GetLasikSectionSnapshot = function (sectionKey) {
            var addData = $scope.GetLasikSectionAddData(sectionKey);
            var fields;

            if (sectionKey === 'PreOp') { fields = $scope.GetLasikPreOpFields(addData); }
            else if (sectionKey === 'IntraOp') { fields = $scope.GetLasikIntraOpFields(addData); }
            else { fields = $scope.GetLasikPostOpFields(addData); }

            return angular.toJson({
                "Fields": fields,
                "Checklist": $scope.GetLasikSectionChecklist(sectionKey),
                "Orders": $scope.GetLasikSectionOrders(sectionKey)
            });
        };

        $scope.IsLasikSectionDirty = function (sectionKey) {
            var state = $scope.LasikTabState[sectionKey];
            if (!state) { return false; }

            if (!state.HasLoaded) {
                return false;
            }

            return state.LoadedSnapshot !== $scope.GetLasikSectionSnapshot(sectionKey);
        };

        /* Does this tab have anything saved of its own? Answered from the section's
           own fields, checklist rows and order blocks - the same three things its
           save payload is built from - by comparing them against a pristine
           template. A row that comes back without a TypeId is bound into all three
           tabs (see GetLasikRowSections), so "a row exists" is NOT proof that this
           section has data: without this check, saving Pre-Op would put the empty
           Intra-Op and Post-Op tabs into the summary view too. */
        $scope.HasLasikSectionData = function (sectionKey) {
            var tab = $scope.LasikTabData[sectionKey];
            if (!tab) { return false; }

            var pristine = $scope.GetLasikTempObj();
            var current, blank;

            if (sectionKey === 'PreOp') {
                current = $scope.GetLasikPreOpFields(tab.AddData);
                blank = $scope.GetLasikPreOpFields(pristine);
            } else if (sectionKey === 'IntraOp') {
                current = $scope.GetLasikIntraOpFields(tab.AddData);
                blank = $scope.GetLasikIntraOpFields(pristine);
            } else {
                current = $scope.GetLasikPostOpFields(tab.AddData);
                blank = $scope.GetLasikPostOpFields(pristine);
            }

            if (!angular.equals(current, blank)) { return true; }

            if (($scope.GetLasikSectionChecklist(sectionKey) || []).length > 0) { return true; }

            var orders = $filter('filter')($scope.GetLasikSectionOrders(sectionKey) || [],
                { 'DeleteInd': 'N' }, true) || [];
            return orders.length > 0;
        };

        /* The add / summary mode of a tab comes from that tab's own data and its own
           sign-off status - never from the tab that was open before it. A tab with
           nothing saved is always on its add screen; a tab that has data keeps the
           mode it is already in, so pressing Edit (or unsigning) and then switching
           tabs and back does not throw the user out of the screen they opened. */
        $scope.RefreshLasikTabMode = function (sectionKey) {
            var state = $scope.LasikTabState[sectionKey];
            if (!state) { return; }

            state.HasData = $scope.HasLasikSectionData(sectionKey);

            if (!state.HasData && !state.IsSaved && !state.IsTypedRow) {

                var hasLoaded = state.HasLoaded;
                var loadedSnapshot = state.LoadedSnapshot;
                var isLoading = state.IsLoading;
                var loadPromise = state.LoadPromise;

                angular.extend(state, $scope.GetLasikTabStateObj($scope.LasikTemplateTypes[sectionKey]));

                /*
                 * Preserve GET state.
                 */
                state.HasLoaded = hasLoaded;
                state.LoadedSnapshot = loadedSnapshot;
                state.IsLoading = isLoading;
                state.LoadPromise = loadPromise;
            }
            if (!state.StatusFlag || !String(state.StatusFlag).trim()) {
                state.IsSummaryView = false;
            }else if (state.IsSigned || state.IsSaved) {
                state.IsSummaryView = true;
            } else if (!state.HasData) {
                state.IsSummaryView = false;
            }

            state.IsAddView = !state.IsSummaryView;
            state.IsEditView = state.IsAddView;
        };

        /* Who signed this section. The chart row carries SignOffUserId when the
           backend echoes it back; when it does not, the section is left with no
           signer even though it is signed - the Unsign popup then opens with the
           Nurse / ASC Technician box empty, and Unsign is refused by the "Please
           select the signing technician / nurse!" check above, so the sign-off is
           never lifted here or on the bulk sign-off screen. The sign-off rows name
           the signer themselves, by id where they carry one and by name otherwise,
           so the id is read back from them. */
        $scope.ResolveLasikSignOffUserId = function (row, details) {
            row = row || {};
            details = details || [];

            if (row.SignOffUserId) { return row.SignOffUserId; }

            /* an id on the sign-off row, whatever the service called it */
            var idFields = ["SignOffUserId", "SignOffUserID", "UserId", "UserID", "DoctorId", "DoctorID"];
            var signOffUserId = null;

            angular.forEach(details, function (detail) {
                angular.forEach(idFields, function (field) {
                    if (signOffUserId === null && (detail || {})[field]) {
                        signOffUserId = (detail || {})[field];
                    }
                });
            });

            if (signOffUserId !== null) { return signOffUserId; }

            /* no id anywhere - match the signer's name against the users who can
               sign a LASIK tab, which is the list the Unsign popup itself offers */
            var signerName = String((details[0] || {}).SignOffUserName || '').trim().toLowerCase();
            if (signerName === '') { return null; }

            var match = ($scope.nurseAndAscTechnicianList || $scope.allUserList || []).filter(function (user) {
                var fullName = String((user || {}).UserFullName || (user || {}).FullName || '').trim().toLowerCase();
                return fullName !== '' && fullName === signerName;
            })[0];

            return match ? match.DoctorID : null;
        };

        $scope.BindLasikSectionState = function (sectionKey, row) {
            var state = $scope.LasikTabState[sectionKey];
            if (!state) { return; }

            state.LasikTemplateId = row.LasikTemplateId || 0;
            /* this section's own chart status, straight from this section's own row */
            state.StatusFlag = row.StatusFlag || null;
            state.ChartStatus = state.StatusFlag;
            /* 'E' = signed off -> read-only summary + Unsign, 'D' = draft -> editable */
            state.IsSigned = (state.StatusFlag === 'E');
            state.IsSaved = true;
            state.IsTypedRow = ((row.TypeId || null) !== null);
            /* provisional - RefreshLasikTabMode has the final say once this section's
               data is bound, and drops the tab back to its add screen if it has none */
            state.IsSummaryView = state.IsSigned || !$scope.LasikPendingEditSections[sectionKey];

            state.LastSignOffUserDetails = row.LastSignOffUserDetails || [];
            state.SignOffUserId = $scope.ResolveLasikSignOffUserId(row, state.LastSignOffUserDetails);
            state.SignOffDate = row.SignOffDate || row.SignedOffDate || null;

            state.NurseReviewedById = row.NurseReviewedById || null;
            state.NurseReviewedByName = row.NurseReviewedByName ||
                $scope.GetUserNameById(row.NurseReviewedById, $scope.nurseAndAscTechnicianList);
            /* the reviewer's licence, shown and printed beside the name it licenses */
            state.NurseReviewedLicenseNumber = $scope.GetUserLicenseById(row.NurseReviewedById, $scope.nurseAndAscTechnicianList);
            if (row.NurseReviewedDate) {
                state.NurseReviewedDate = $filter('date')(row.NurseReviewedDate, "MM-dd-yyyy hh:mm a");
            }


            if (sectionKey === 'PostOp') {
                state.DoctorReviewedById = row.DoctorReviewedById || null;
                state.DoctorReviewedByName = row.DoctorReviewedByName ||
                    $scope.GetUserNameById(row.DoctorReviewedById, $scope.SurgeonArray);
                state.DoctorReviewedLicenseNumber = $scope.GetUserLicenseById(row.DoctorReviewedById, $scope.SurgeonArray);
                if (row.DoctorReviewedDate) {
                    state.DoctorReviewedDate = $filter('date')(row.DoctorReviewedDate, "MM-dd-yyyy hh:mm a");
                }
            }

            $scope.BuildLasikSignOffInfo(state);
        };

        /* One saved row into one tab: that tab's add screen, that tab's summary
           screen, that tab's sign-off state. Nothing else is read or written. */
        $scope.BindLasikTemplateRow = function (sectionKey, row) {
            var tab = $scope.LasikTabData[sectionKey];
            if (!tab) { return; }

            row = row || {};
            $scope.BindLasikSectionState(sectionKey, row);

            if (sectionKey === 'PreOp') { $scope.BindLasikPreOpFields(tab.AddData, row); }
            else if (sectionKey === 'IntraOp') { $scope.BindLasikIntraOpFields(tab.AddData, row); }
            else { $scope.BindLasikPostOpFields(tab.AddData, row); }
            
            $scope.BindLasikChecklistData(tab, row.OrgASCChecklist);
            $scope.BindLasikOrderDetails(tab, row.OrderDetails);

            /* radio defaults for the order-entry panels */
            tab.AddData.OrderType = 'Medications';
            tab.AddData.PostOrderType = 'Medications';

            /* decide this tab's mode now that its own data is in place */
            $scope.RefreshLasikTabMode(sectionKey);

        };

        /* Rows returned for a single TypeId, into that section alone. */
        $scope.BindLasikTemplateSection = function (sectionKey, rows) {
            rows = rows || [];

            var sectionType = $scope.LasikTemplateTypes[sectionKey];

            var own = rows.filter(function (row) {
                row = row || {};

                if (row.TypeId == null) {
                    return true;
                }

                return sectionType &&
                    Number(row.TypeId) === Number(sectionType.TypeId);
            });

            if (own.length > 0) {
                angular.extend(
                    $scope.LasikTabState[sectionKey],
                    $scope.GetLasikTabStateObj(sectionType)
                );

                angular.forEach(own, function (row) {
                    $scope.BindLasikTemplateRow(sectionKey, row);
                });
            } else {
                $scope.RefreshLasikTabMode(sectionKey);
            }

            $scope.LasikPendingEditSections[sectionKey] = false;
        };

        /* Every section's row goes into its own tab's add screen and its own summary
           screen - a Pre-Op row is never read into the Intra-Op or Post-Op context.
           A tab with no row keeps its default (empty) add screen and an empty
           summary, without touching the others. */
        $scope.BindLasikTemplateRows = function (rows) {
            rows = rows || [];

            /* which sections this response actually speaks for */
            var matched = {};
            angular.forEach(rows, function (row) {
                angular.forEach($scope.GetLasikRowSections(row || {}), function (sectionKey) {
                    matched[sectionKey] = true;
                });
            });

            /* Only those sections start from a clean state. A section the response
               says nothing about keeps what it already had - it is not this
               response's business to clear it. */
            angular.forEach(matched, function (isMatched, sectionKey) {
                angular.extend($scope.LasikTabState[sectionKey],
                    $scope.GetLasikTabStateObj($scope.LasikTemplateTypes[sectionKey]));
            });

            angular.forEach(rows, function (row) {
                row = row || {};
                angular.forEach($scope.GetLasikRowSections(row), function (sectionKey) {
                    $scope.BindLasikTemplateRow(sectionKey, row);
                });
            });

            /* a tab no row touched still needs its mode settled */
            angular.forEach($scope.LasikTabState, function (state, sectionKey) {
                if (!matched[sectionKey]) { $scope.RefreshLasikTabMode(sectionKey); }
            });

            $scope.LasikPendingEditSections = {};
        };

        $scope.BindLasikPreOpFields = function (obj, row) {
            row = row || {};

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
            if (obj.NurseFallRiskID) {
                obj.NurseFallRiskName = $scope.GetUserNameById(row.NurseFallRiskID, $scope.ReviewedByArray);
            }
            obj.NurseFallRiskReviewdDate = row.NurseFallRiskReviewdDate || null;
            obj.ImplementedFallRiskProtocol = $scope.ToBool(row.ImplementedFallRiskProtocol);
            obj.ImplementedFallRiskProtocoltype = row.ImplementedFallRiskProtocoltype || '';

            /* ---- Asepsis + notes ---- */
            obj.Periocularwashwithiodopovidone = $scope.ToBool(row.Periocularwashwithiodopovidone);
            obj.PreOpNotes = row.PreOpNotes || '';
            /* a note already written opens its box, so it is read and edited where it
               is; with nothing written the row still offers Add Notes */
            if (obj.PreOpNotes !== '') { $scope.showPreOpNotes = true; }
            obj.IsSurgeonOrdersTimeChecked = row.IsSurgeonOrdersTimeChecked || false;
        };

        $scope.BindLasikIntraOpFields = function (obj, row) {
            row = row || {};

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
            if (obj.IntraOpNotes !== '') { $scope.showIntraOpNotes = true; }
            obj.RightEyeOD = row.RightEyeOD || false;
            obj.LeftEyeOS = row.LeftEyeOS || false;
            obj.HeadFixation = row.HeadFixation || "";
            obj.IsLateralSupportsUsed = row.IsLateralSupportsUsed || false;
            obj.IsVacuumPillowUsed = row.IsVacuumPillowUsed || false;
        };

        /* Post-Op and Discharge are one section - they share a tab and a sign-off. */
        $scope.BindLasikPostOpFields = function (obj, row) {
            row = row || {};

            /* ---- Post-Op IOP ---- */
            obj.IOPOD = row.IOPOD || '';
            obj.IOPOS = row.IOPOS || '';
            obj.IOPTime = row.IOPTime || '';
            obj.IOPResultAssessment = row.IOPResultAssessment || '';
            obj.AccompainedName = row.AccompainedName || '';
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
            if (obj.PostOpNotes !== '') { $scope.showPostOpNotes = true; }

            /* follow-up dates */
            obj.FollowUpDate1 = row.FollowUpDate1 ? $filter('date')(row.FollowUpDate1, 'MM-dd-yyyy') : '';
            obj.FollowUpDate2 = row.FollowUpDate2 ? $filter('date')(row.FollowUpDate2, 'MM-dd-yyyy') : '';
            obj.FollowUpDate3 = row.FollowUpDate3 ? $filter('date')(row.FollowUpDate3, 'MM-dd-yyyy') : '';
            obj.FollowUpDate2Ind = obj.FollowUpDate2 !== '';
            obj.FollowUpDate3Ind = obj.FollowUpDate3 !== '';
            /* lock a follow-up date once an appointment has been booked from it */
            obj.SecondFollowupAppointmentId = row.SecondFollowupAppointmentId || 0;
            obj.ThirdFollowupAppointmentId = row.ThirdFollowupAppointmentId || 0;

            obj.IsPostProcedureLevelOfCooperation = row.IsPostProcedureLevelOfCooperation || false;
            obj.IOPReEvalOD = row.IOPReEvalOD || null;
            obj.IOPReEvalOS = row.IOPReEvalOS || null;
            obj.IsPostOpSurgeonOrdersTimeAdded = row.IsPostOpSurgeonOrdersTimeAdded || false;
        };




        $scope.GetCheckedValues = function (item) {
            item = item || {};
            var vals = [];
            angular.forEach(item.OrganizationCheckListDetails || [], function (k) {
                if (k.IsChecked && k.Value) { vals.push(k.Value); }
            });
            if (vals.length === 0 && item.Value) { vals.push(item.Value); }
            return vals.join(', ');
        };

        $scope.HasCheckedValues = function (item) {
            return $scope.GetCheckedValues(item) !== '';
        };


        $scope.changeEquipment = function (id) {
            var filtredArray = $filter("filter")($scope.LasikTemplate, { "LasikTemplateId": id }, true) || [];
            if (filtredArray.length > 0) {
                $scope.LasikTempObj.EquipmentName = filtredArray[0].LasikTemplateName || "";
            } else {
                $scope.LasikTempObj.EquipmentName = "";
            }
        }














        /* Back to the edit view, for this tab only. A signed tab stays read-only
           until it is unsigned. */
        $scope.EditLasikData = function (sectionKey) {
            sectionKey = sectionKey || $scope.ActiveLasikSection;

            var state = $scope.LasikTabState[sectionKey];
            if (!state || state.IsSigned) { return false; }

            state.IsSummaryView = false;
            state.IsEditView = true;
        };

        ///* Pre-Op is the landing phase, so its tab starts highlighted.
        //   It lives on an object because du-scroll-container creates a child scope
        //   on the nav <ul> - a plain $scope.selected written from here would be
        //   shadowed by the first ng-click and the pill would freeze. */
        //var lasikSpyLock = null;

        ///* A tab click hands over to du-smooth-scroll, which animates the pane past
        //   every section in between. Left alone the spy repaints the pill on each
        //   animation frame and the nav visibly jitters, so hold it off until the
        //   scrolling has settled. */
        //function lockLasikSpy() {
        //    if (lasikSpyLock) { $timeout.cancel(lasikSpyLock); }
        //    lasikSpyLock = $timeout(function () { lasikSpyLock = null; }, 250, false);
        //}

        //$scope.LasikNav = {
        //    selected: 'preop',
        //    goTo: function (key) {
        //        $scope.LasikNav.selected = key;
        //        lockLasikSpy();
        //    }
        //};


        ///* This popup is opened only for SurgeryCategoryId 3 (YAG) - see the routing in
        //   UsAscAppointmentList.js. YAG has no corneal pachymetry, no periocular asepsis prep
        //   and no bandage/protector step, so those rows stay hidden. Flip to true if the
        //   template is ever reused for a category that needs them. */
        

        ///* ---------------- SECTION INDICATOR (scroll spy) ----------------
        //   du-scrollspy cannot drive this nav. spyAPI.addSpy resolves the scroll
        //   container once, inside a $timeout, and keeps it as long as it stays in
        //   the document. Both panes sit behind ng-if, so at that moment
        //   du-scroll-container has only seen an empty id and has fallen back to the
        //   nav <ul> itself - a node that never scrolls. The spy therefore binds its
        //   handler to the <ul>, no scroll event ever reaches it and
        //   'duScrollspy:becameActive' never fires. Spy on the real pane instead. */

        //var LasikSections = [
        //    { id: 'LasikmainPre-Op', key: 'preop' },
        //    { id: 'LasikmainIntra-Op', key: 'intraop' },
        //    { id: 'LasikmainPost-Op', key: 'postop' },
        //    { id: 'LasikmainDischarge', key: 'discharge' }
        //];

        //// the section headers are position:sticky, so treat anything that has
        //// reached the sticky band as the section being read
        //var LasikSpyOffset = 40;
        //var lasikScrollPane = null;

        //function onLasikScroll() {
        //    if (!lasikScrollPane) { return; }

        //    // a click driven scroll is still running - keep the lock alive until
        //    // the animation stops firing events, then let the spy take over again
        //    if (lasikSpyLock) {
        //        lockLasikSpy();
        //        return;
        //    }

        //    var paneTop = lasikScrollPane.getBoundingClientRect().top;
        //    var active = LasikSections[0].key;

        //    // last section whose top has passed the top of the pane
        //    angular.forEach(LasikSections, function (section) {
        //        var el = document.getElementById(section.id);
        //        if (el && el.getBoundingClientRect().top - paneTop <= LasikSpyOffset) {
        //            active = section.key;
        //        }
        //    });

        //    // a short last section can never reach the top - once the pane is
        //    // scrolled to the bottom that section is the one being read
        //    if (lasikScrollPane.scrollTop + lasikScrollPane.clientHeight >= lasikScrollPane.scrollHeight - 2) {
        //        active = LasikSections[LasikSections.length - 1].key;
        //    }

        //    if (active !== $scope.LasikNav.selected) {
        //        $scope.$applyAsync(function () {
        //            $scope.LasikNav.selected = active;
        //        });
        //    }
        //}
         
        ///* du-scroll-container still resolves its target with document.getElementById
        //   at $observe time, so publish the id after render for du-smooth-scroll
        //   (the click -> scroll half), and rebind the spy when the view swaps. */
        //$scope.LasikScrollContainerId = '';
        //function bindLasikScrollSpy() {
        //    $timeout(function () {
        //        var id = $scope.LasikTempObj.IsLasikSummaryInd ? 'LasikmainSummary' : 'Lasikmain';
        //        $scope.LasikScrollContainerId = id;

        //        if (lasikScrollPane) {
        //            lasikScrollPane.removeEventListener('scroll', onLasikScroll);
        //        }
        //        lasikScrollPane = document.getElementById(id);
        //        if (!lasikScrollPane) { return; }

        //        lasikScrollPane.addEventListener('scroll', onLasikScroll);
        //        onLasikScroll();
        //    });
        //}
        //bindLasikScrollSpy();
        //$scope.$watch('LasikTempObj.IsLasikSummaryInd', bindLasikScrollSpy);

        //$scope.$on('$destroy', function () {
        //    if (lasikScrollPane) {
        //        lasikScrollPane.removeEventListener('scroll', onLasikScroll);
        //        lasikScrollPane = null;
        //    }
        //});




        $scope.LasikNav = {
            selected: 'preop',
        };

        /* Selecting a tab swaps the whole context - selected type, add screen,
           summary screen - and then reloads that section from the chart service
           using its own TypeId / TypeName, so what is shown is what is stored for
           that section. The mode of the tab being left behind is never carried over.

           The one case that does not reload is a tab holding edits that have not
           been saved yet: reloading over them would throw the user's work away. */
        $scope.ChangeLasikTab = function (Key) {
            var sectionKey = $scope.LasikSectionByTab[Key] || 'PreOp';

            var state =
                $scope.LasikTabState[sectionKey];

            if (!state) {
                return false;
            }
            $scope.LasikNav.selected = Key;
            $scope.ActivateLasikSection(sectionKey);

            if (state.IsLoading) {
                return;
            }

           
            if (!state.HasLoaded) {

                $scope.LoadLasikTemplateSection(
                    sectionKey
                );

                return;
            }

            if (
                $scope.IsLasikSectionDirty(
                    sectionKey
                )
            ) {

                $scope.RefreshLasikTabMode(
                    sectionKey
                );

                return;
            }

            
            $scope.LoadLasikTemplateSection(
                sectionKey
            );

        };

        /* Load one section through the existing chart service, asking for its own
           TypeId / TypeName. Only that section is touched by the response. */
        $scope.LoadLasikTemplateSection = function (sectionKey) {

            var state =
                $scope.LasikTabState[sectionKey];

            if (!state) {
                return $q.when();
            }

            
            if (
                state.IsLoading &&
                state.LoadPromise
            ) {
                return state.LoadPromise;
            }

            state.IsLoading = true;

            state.LoadPromise =
                eHnoteSurgeryService
                    .GetLasikTemplatesChartData(
                        $scope.GetLasikTemplateReqObj(sectionKey)
                    )

                    .then(function (resp) {

                        if (
                            resp.data &&
                            resp.data.status === "Success"
                        ) {

                            var rows =
                                angular.copy(
                                    resp.data.rows || []
                                );

                            var lastSignOffUserDetails =
                                angular.copy(
                                    resp.data.LastSignOffUserDetails || []
                                );

                            /*
                             * Bind sign-off details.
                             */
                            if (rows.length > 0) {

                                angular.forEach(
                                    rows,
                                    function (row) {

                                        row.LastSignOffUserDetails =
                                            angular.copy(
                                                lastSignOffUserDetails
                                            );
                                    }
                                );
                            }

                            /*
                             * IMPORTANT:
                             *
                             * Bind ONLY the selected section.
                             */
                            $scope.BindLasikTemplateSection(
                                sectionKey,
                                rows
                            );

                            /*
                             * Admit -> PreOp -> PostOp fallback
                             */
                            $scope.BindAccompaniedDetails(
                                resp.data
                            );

                        } else {
                            $scope.RefreshLasikTabMode(
                                sectionKey
                            );
                        }
                        state.HasLoaded = true;
                        state.LoadedSnapshot =
                            $scope.GetLasikSectionSnapshot(
                                sectionKey
                            );

                        return resp;

                    }, function (error) {
                        state.HasLoaded = false;
                        state.LoadedSnapshot = null;

                        $scope.RefreshLasikTabMode(
                            sectionKey
                        );

                        return $q.reject(error);

                    })
                    .finally(function () {

                        state.IsLoading = false;
                        state.LoadPromise = null;
                    });

            return state.LoadPromise;
        };


        /* Sign off / unsign one section. The password check is the existing one -
           only the section it applies to changes. */
        $scope.OpenLasikSignOffPopup = function (type, sectionKey) {
            type = type || 'SignOff';
            sectionKey = sectionKey || $scope.ActiveLasikSection;

            var lasikType = $scope.LasikTemplateTypes[sectionKey];
            var state = $scope.LasikTabState[sectionKey];
            if (!lasikType || !state) { return false; }

            /* ---------- validations (SignOff only), against this section's own data ---------- */
            //var addData = $scope.GetLasikSectionAddData(sectionKey);
            //if (type === 'SignOff') {
            //    if (sectionKey === 'PreOp' && (addData.BP || '').trim() === '') {
            //        alertify.error("Please enter BP values!");
            //        return false;
            //    }
            //    if (!state.NurseReviewedById) {
            //        alertify.error("Please select the reviewing nurse!");
            //        return false;
            //    }
            //    /* the MD review belongs to Post-Op only - Pre-Op and Intra-Op are
            //       nurse / ASC technician sign-offs */
            //    if (sectionKey === 'PostOp' && !state.DoctorReviewedById) {
            //        alertify.error("Please select the reviewing MD!");
            //        return false;
            //    }
            //}

            /* the consent status shown while signing must be the current one */
            if (type === 'SignOff' && IsPostOpConsentSignOff(sectionKey)) {
                $scope.GetPatientAppointmentConsentsById();
            }

            var mainObj = {
                "IsPostOpNurseSignOff": IsPostOpConsentSignOff(sectionKey),
                /* Nurses and ASC technicians are the only signers of a LASIK tab.
                   The Post-Op MD review is a separate field and is never picked
                   from here. */
                "SignOffUsersArray": $scope.GetLasikSignOffUsers(),
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                "PatientVisitId": $scope.cacheStorageItem.PatientVisitId || 0,
                "SectionState": state,
                "LasikType": lasikType,
                "type": type,
                "RoleId": $scope.RoleId || null,
                "UserId": $scope.UserId || null
            };

            var signmodalInstance = $uibModal.open({
                "templateUrl": "lasikSignOffPopup.html",
                "size": "md",
                "backdrop": "static",
                "keyboard": false,
                "windowClass": " ",
                /* the popup inherits this scope so it can show the consent
                   signature status of the logged-in role and apply the
                   signature without closing the sign-off */
                "scope": $scope,
                "resolve": {
                    "resolveMainObj": function () { return mainObj; },

                },
                "controller": ["$scope", "$uibModalInstance", "resolveMainObj",
                    "eHnoteSettingsDataService", "eHnoteMasterDataService", "alertify",
                    function ($scope, $uibModalInstance, resolveMainObj,
                        eHnoteSettingsDataService, eHnoteMasterDataService, alertify) {

                        /* the one section being signed / unsigned */
                        $scope.SectionState = resolveMainObj.SectionState;
                        /* set once - the template reads a flag, not a function, on every digest */
                        $scope.IsPostOpNurseSignOff = resolveMainObj.IsPostOpNurseSignOff;
                        $scope.LasikType = resolveMainObj.LasikType;
                        $scope.roleId = resolveMainObj.RoleId;
                        $scope.type = resolveMainObj.type;

                        var UserId = resolveMainObj.UserId;
                        var AppointmentId = resolveMainObj.AppointmentId;
                        var PatientVisitId = resolveMainObj.PatientVisitId;

                        /* Only a nurse or an ASC technician signs a LASIK tab - the
                           list does not change with the role of whoever opened the
                           popup, and a doctor is never offered here. */
                        $scope.ReviewersArray = resolveMainObj.SignOffUsersArray || [];

                        $scope.signOffObj = {
                            "SignOffUserId": null,
                            "SignOffPassword": '',
                            "Remarks": ''
                        };

                        /* prefill: unsign -> last signer; sign -> logged-in user if eligible */
                        if ($scope.SectionState.StatusFlag === 'E') {
                            $scope.signOffObj.SignOffUserId = $scope.SectionState.SignOffUserId;

                        } else {
                            var eligible = $scope.ReviewersArray.some(function (i) { return Number(i.DoctorID) === Number(UserId); });
                            $scope.signOffObj.SignOffUserId = eligible ? UserId : null;
                        }

                        $scope.ValidateLasikSignOffPassword = function () {
                            var DoctorId = $scope.signOffObj.SignOffUserId || null;
                            if (DoctorId === null) {
                                alertify.error("Select User");
                                return false;
                            }
                            if (($scope.signOffObj.SignOffPassword || "") === "") {
                                alertify.error("Please Enter Valid Password");
                                return false;
                            }

                            var params = {
                                "VisitId": PatientVisitId,
                                "UserId": eHnoteMasterDataService.getLoginId(),
                                "AppointmentId": AppointmentId || 0,
                                "DoctorId": DoctorId,
                                "SignOffPassword": $scope.signOffObj.SignOffPassword,
                                "IsPreOPLasik": false,
                                "IsIntraOPLasik": false,
                                "IsPostOPLasik": false,
                                "Screens": [{
                                    "Screen": "",
                                    "Type": $scope.type || '',
                                    "Remarks": $scope.signOffObj.Remarks || "",
                                    "UserType":'Nurse'
                                }]
                            };

                            switch ($scope.LasikType.TypeName) {
                                case "Pre-Op":
                                    params.IsPreOPLasik = true;
                                    params.Screens[0].Screen ='LasikPreop'
                                    break;
                                case "Intra-Op":
                                    params.IsIntraOPLasik = true;
                                    params.Screens[0].Screen = 'LasikIntraop  '
                                    break;
                                case "Post-Op":
                                    params.IsPostOPLasik = true;
                                    params.Screens[0].Screen = 'LasikPostop'
                                    break;
                            }
                            console.log("params", params)

                            eHnoteSettingsDataService.GetValidateLasikTemplateSignOffPassword(
                                params, onSuccess, onError);

                            function onSuccess(data) {
                                if (data.status === "Success") {
                                    alertify.success($scope.type === "SignOff"
                                        ? 'Successfully Signed Off' : 'Successfully Unsigned');


                                    let obj = {
                                        "StatusFlag": ($scope.SectionState.StatusFlag === 'D') ? 'E' : 'D',
                                        "SignOffUserId": DoctorId,
                                        "type": $scope.type,
                                        "SectionKey": $scope.LasikType.Key
                                    }
                                    $uibModalInstance.close(obj);
                                } else {
                                    /* password rejected: nothing is signed, the tab stays
                                       in the view it was in */
                                    alertify.error(data.Message);
                                }
                            }
                            function onError(err) { console.log(err); }
                        };

                        $scope.uibclose = function () {
                            $uibModalInstance.dismiss("cancel");
                        };
                    }]
            });

            signmodalInstance.result.then(function (resp) {
                /* only the section that was signed / unsigned moves */
                var target = $scope.LasikTabState[resp.SectionKey];
                if (!target) { return false; }

                target.StatusFlag = resp.StatusFlag;
                target.ChartStatus = resp.StatusFlag;
                target.SignOffUserId = resp.SignOffUserId;

                $scope.SaveLasikTemplateData(resp.type, resp.SectionKey);
            }, function () { });
        };


        $scope.ChangeGeneralMedicationStatus = function (item, Id) {
            if (Id == 1) {
                item.Status = 'Done';
                item.MedicationTime = $filter('date')(new Date(), "hh:mm a");
            } else {
                item.Status = 'NotDone';
                item.MedicationTime = '';
            }
            /* Task 13 - Done re-opens the row so the Given By passcode can be validated,
               Not Done clears the recorded Given By and its validated state. */
            $scope.ResetGeneralOrderValidation(item, Id == 1);
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

        /* Print is built from all three tabs, but the chart load asks for the active
           section's TypeId alone and any other tab is only fetched when it is
           opened - so a print driven with no popup on screen finds the tabs nobody
           opened empty. That is why ticking Intra-Op and Post-Op in the ASC print
           popup printed neither: the sections were emitted with nothing in them.
           Fetch what the print covers through the same per-section loader a tab
           switch uses. */
        $scope.LoadLasikPrintSections = function () {
            var phases = $scope.LasikPrintPhases || {};
            var wanted = [];

            if (phases.IsLasikPreopPrintInd) { wanted.push('PreOp'); }
            if (phases.IsLasikIntraopPrintInd) { wanted.push('IntraOp'); }
            if (phases.IsLasikPostopPrintInd) { wanted.push('PostOp'); }

            /* Nothing named at all -> the whole chart. */
            if (wanted.length === 0) { wanted = ['PreOp', 'IntraOp', 'PostOp']; }

            /* The ASC print popup drives this controller with nothing on screen, so
               a tab nobody opened is empty and every section the print covers has to
               be fetched - a tab bound empty by an earlier response is exactly the
               case that printed blank. The template's own Print button prints the
               section already open in front of the user, so it prints as it stands
               and only a never-loaded section is fetched. */
            var forceReload = !$scope.IsLasikSectionPrint;

            var pending = wanted.filter(function (sectionKey) {
                var state = $scope.LasikTabState[sectionKey];
                /* LoadedSnapshot is only set once a section's rows have been bound,
                   so a null one is a tab that has never been loaded */
                return !!state && (forceReload || state.LoadedSnapshot === null);
            }).map(function (sectionKey) {
                return $scope.LoadLasikTemplateSection(sectionKey);
            });

            return $q.all(pending).then(function () {
                /* A section the print covers that still holds nothing prints as an
                   empty heading. Name it once so an empty section on the page can be
                   told apart from one that was never fetched. */
                var empty = wanted.filter(function (sectionKey) {
                    return !$scope.HasLasikSectionData(sectionKey);
                });

                if (empty.length > 0) {
                    console.warn("LASIK print: no saved chart data for " + empty.join(", "));
                }
            });
        };

        /* sectionKey given -> the Print button on the LASIK template, which prints
           the one section the user has open and nothing else. No sectionKey -> the
           ASC print popup, which has already put the phases it wants in
           LasikPrintPhases; that selection is left exactly as it set it. */
        $scope.PrintLasikTemplateData = function (sectionKey) {

            var isSectionPrint = !!(sectionKey && $scope.LasikTemplateTypes[sectionKey]);
            $scope.IsLasikSectionPrint = isSectionPrint;

            if (isSectionPrint) {
                $scope.LasikPrintPhases = {
                    "IsLasikPreopPrintInd": sectionKey === "PreOp",
                    "IsLasikIntraopPrintInd": sectionKey === "IntraOp",
                    /* Post-Op carries the Discharge summary, the same pairing the
                       print builder and the sign-off screen use */
                    "IsLasikPostopPrintInd": sectionKey === "PostOp"
                };
            }

            let obj = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
                "PatientId": $scope.cacheStorageItem.PatientID || 0,
                "AppointmentTypeId": $scope.cacheStorageItem.AppointmentTypeId
            };
            /* every section the print covers is in place before the print is built */
            $scope.LoadLasikPrintSections().then(function () {
                eHnoteSurgeryService.GetOTQuickAccessDetails(obj).then(function (resp) {
                    if (resp.data.status === "Success") {

                        $scope.OrganizationDetails = resp.data.OrganizationDetails || [];
                        if ($scope.OrganizationDetails.length && $scope.OrganizationDetails[0]?.OrganizationLogoUrl) {
                            $scope.toDataURL($scope.OrganizationDetails[0].OrganizationLogoUrl, function (dataURL) {
                                $scope.$applyAsync(() => {
                                    $scope.OrganizationDetails[0].OrganizationLogoUrl = dataURL;
                                    $scope.generateLasikPrint(resp);
                                });
                            });
                        } else {
                            $scope.generateLasikPrint(resp);
                        }
                    }
                });
            });
        }

        $scope.generateLasikPrint = function (resp) {
            let CreatedByName = "";
            if (doctorinfo.doctordata.User.length > 0) {
                if (doctorinfo.doctordata.User[0].Suffix !== '') {
                    CreatedByName = CreatedByName + doctorinfo.doctordata.User[0].FullName + ' ' + doctorinfo.doctordata.User[0].Suffix || "";
                } else {
                    CreatedByName = doctorinfo.doctordata.User[0].FullName || "";
                }
            }

            let DiagnosisName = "";
            let AnesthesistName = "";
            let SurgeryName = "";
            let CPTCode = "";
            let SurgeryDate = "";
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

            if ($scope.cacheStorageItem.SurgeryList.length > 0) {
                SurgeryDate = $filter('date')($scope.cacheStorageItem.SurgeryList[0].SurgeryDate, 'MM-dd-yyyy') || '';
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

            /* The add / summary context follows the tab on screen - LasikTempObj
               and SummaryObj are whichever section was last activated, Pre-Op to
               start with. Reading the whole print off them prints Pre-Op's fields
               and leaves Intra-Op and Post-Op blank, so each section is read from
               its own tab here. */
            let LasikAddData = function (sectionKey) {
                return ($scope.LasikTabData[sectionKey] || {}).AddData || {};
            };
            let LasikSummaryData = function (sectionKey) {
                return ($scope.LasikTabData[sectionKey] || {}).SummaryData || {};
            };
            let LasikSectionState = function (sectionKey) {
                return ($scope.LasikTabState || {})[sectionKey] || {};
            };

            let PreOpAdd = LasikAddData('PreOp');
            let PreOpSummary = LasikSummaryData('PreOp');
            let IntraOpAdd = LasikAddData('IntraOp');
            let IntraOpSummary = LasikSummaryData('IntraOp');
            let PostOpAdd = LasikAddData('PostOp');
            let PostOpSummary = LasikSummaryData('PostOp');
            /* the reviewer names and the sign-off live on the tab's state, not on
               its add screen; Post-Op and Discharge are the one section */

            let PreOpState = LasikSectionState('PreOp');
            let IntraOpState = LasikSectionState('IntraOp');
            let PostOpState = LasikSectionState('PostOp');

            let patientCheckinObj = {
                "AccompainedBy": PreOpAdd.AccompainedBy || "",
                "AccompainedByNotes": PreOpAdd.AccompainedByNotes || "",
                "AccompainedName": PreOpAdd.AccompainedName || "",
                "AccompainedTel": PreOpAdd.AccompainedTel || "",
                "ArrivalType": PreOpAdd.ArrivalType || ""
            }

            /* An order block saved without a TypeId is bound into every tab, so the
               blocks are collected once across the three and then split by
               MedTypeId - 2 is the pre-op / dilation order, 5 the post-op one. */
            let AllOrderDetails = [];
            let seenOrderIds = {};

            angular.forEach([PreOpSummary, IntraOpSummary, PostOpSummary], function (summary) {
                angular.forEach(summary.OrderDetails || [], function (item) {
                    var orderId = item.UserOrderId || 0;
                    if (orderId !== 0) {
                        if (seenOrderIds[orderId]) { return; }
                        seenOrderIds[orderId] = true;
                    }
                    AllOrderDetails.push(item);
                });
            });

            let PreopOrderDetails = AllOrderDetails.filter(function (item) {
                return item.MedTypeId == 2;
            });
            let PostopOrderDetails = AllOrderDetails.filter(function (item) {
                return item.MedTypeId == 5;
            });
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
                    "PatientDOB": $scope.cacheStorageItem.PatientDOB || '',
                    "SurgeryDate": SurgeryDate || '',
                    "VisitReason": $scope.cacheStorageItem.AppointmentVisitReasonName || '',
                    "AppointmentTime": $scope.cacheStorageItem.AppointmentTime || '',
                    "SurgeryName": SurgeryName || '',
                    "AdditionalSurgeryName": AdditionalSurgeryName || '',
                    "OrganName": OrganName || '',
                    "OrganizationDetails": $scope.OrganizationDetails || [],
                    "EhnoteOrganisationLogoUrl": $scope.OrganizationDetails?.[0]?.OrganizationLogoUrl || '',
                    "StatusFlag": PreOpAdd.StatusFlag || "D",
                    "ShowCorneaAsepsisBandage": $scope.ShowCorneaAsepsisBandage || false,
                    "Patientcheckin": patientCheckinObj,
                    "OtherChecklist": angular.copy(PreOpSummary.OtherChecklist || []),
                    "BP": PreOpAdd.BP || "",
                    "BPDiastolic": PreOpAdd.BPDiastolic || "",
                    "Pulse": PreOpAdd.Pulse || "",
                    "VAOD": PreOpAdd.VAOD || "",
                    "VAOS": PreOpAdd.VAOS || "",
                    "PreOpIOPOD": PreOpAdd.PreOpIOPOD || "",
                    "PreOpIOPOS": PreOpAdd.PreOpIOPOS || "",
                    "PreOpIOPTime": PreOpAdd.PreOpIOPTime || "",
                    "CorneaOD": PreOpAdd.CorneaOD || "",
                    "CorneaOS": PreOpAdd.CorneaOS || "",
                    "Other": PreOpAdd.InitialClinicalOther || "",
                    "FallRiskRows": angular.copy(PreOpSummary.FallRiskRows || []),
                    "FallRiskAssessmentTotalScore": PreOpAdd.FallRiskAssessmentTotalScore || 0,
                    "FallRiskLevel": PreOpAdd.FallRiskLevel || "",
                    "NurseFallRiskID": PreOpAdd.NurseFallRiskID || null,
                    "NurseFallRiskName": PreOpAdd.NurseFallRiskName || "",
                    "NurseFallRiskReviewdDate": PreOpAdd.NurseFallRiskReviewdDate || null,
                    "ImplementedFallRiskProtocol": PreOpAdd.ImplementedFallRiskProtocol || false,
                    "ImplementedFallRiskProtocoltype": PreOpAdd.ImplementedFallRiskProtocoltype || "",
                    "PreopOrderDetails": PreopOrderDetails || [],
                    "PostopOrderDetails": PostopOrderDetails || [],
                    "Periocularwashwithiodopovidone": PreOpAdd.Periocularwashwithiodopovidone || false,
                    "PreOpNotes": PreOpAdd.PreOpNotes || "",
                    "IntraopRows": angular.copy(IntraOpSummary.IntraopRows || []),
                    "RightEyeOD": IntraOpAdd.RightEyeOD || false,
                    "LeftEyeOS": IntraOpAdd.LeftEyeOS || false,
                    "PatientPositionLasikRows": angular.copy(IntraOpSummary.PatientPositionLasikRows || []),
                    "HeadFixation": IntraOpAdd.HeadFixation || "",
                    "IsLateralSupportsUsed": IntraOpAdd.IsLateralSupportsUsed || false,
                    "IsVacuumPillowUsed": IntraOpAdd.IsVacuumPillowUsed || false,
                    "EquipmentName": IntraOpAdd.EquipmentName || "",
                    "ODSph": IntraOpAdd.ODSph || "",
                    "ODCyl": IntraOpAdd.ODCyl || "",
                    "ODAxis": IntraOpAdd.ODAxis || "",
                    "ODOpticalZone": IntraOpAdd.ODOpticalZone || "",
                    "ODTreatmentZone": IntraOpAdd.ODTreatmentZone || "",
                    "OSSph": IntraOpAdd.OSSph || "",
                    "OSCyl": IntraOpAdd.OSCyl || "",
                    "OSAxis": IntraOpAdd.OSAxis || "",
                    "OSOpticalZone": IntraOpAdd.OSOpticalZone || "",
                    "OSTreatmentZone": IntraOpAdd.OSTreatmentZone || "",
                    "AdverseEventsRows": angular.copy(IntraOpSummary.AdverseEventsRows || []),
                    "IntraOpNotes": IntraOpAdd.IntraOpNotes || "",
                    "HallEntranceStartTime": IntraOpAdd.HallEntranceStartTime || "",
                    "HallEntranceEndTime": IntraOpAdd.HallEntranceEndTime || "",
                    "SurgeryStartTime": IntraOpAdd.SurgeryStartTime || "",
                    "SurgeryEndTime": IntraOpAdd.SurgeryEndTime || "",
                    "IsPostProcedureLevelOfCooperation": PostOpAdd.IsPostProcedureLevelOfCooperation || false,
                    "PostopStatusRows": angular.copy(PostOpSummary.PostopStatusRows || []),
                    "IOPOD": PostOpAdd.IOPOD || "",
                    "IOPOS": PostOpAdd.IOPOS || "",
                    "IOPTime": PostOpAdd.IOPTime || "",
                    "IOPResultAssessment": PostOpAdd.IOPResultAssessment || "",
                    "IOPActionTaken": PostOpAdd.IOPActionTaken || "",
                    "IOPReEvalTime": PostOpAdd.IOPReEvalTime || "",
                    "IOPReEvalOD": PostOpAdd.IOPReEvalOD || null,
                    "IOPReEvalOS": PostOpAdd.IOPReEvalOS || null,
                    "DISCHARGEChecklist": angular.copy(PostOpSummary.DISCHARGEChecklist || []),
                    "PostOpNotes": PostOpAdd.PostOpNotes || "",
                    "LasikSignOffInfo": PostOpState.SignOffInfo || $scope.LasikSignOffInfo || null,
                    /* all three false -> the whole chart, as the Print button here
                       has always done; the ASC print popup sets the ones it wants */
                    "IsLasikPreopPrintInd": $scope.LasikPrintPhases.IsLasikPreopPrintInd || false,
                    "IsLasikIntraopPrintInd": $scope.LasikPrintPhases.IsLasikIntraopPrintInd || false,
                    "IsLasikPostopPrintInd": $scope.LasikPrintPhases.IsLasikPostopPrintInd || false,
                    /* Each phase is signed off on its own, so each one carries its
                       own signature to the print. LasikSignOffInfo above stays the
                       Post-Op one, which is what the discharge summary prints. */
                    "PreOpLasikSignOffInfo": PreOpState.SignOffInfo || null,
                    "IntraOpLasikSignOffInfo": IntraOpState.SignOffInfo || null,

                    /* Pre-Op */
                    "PreOpNurseReviewedByName": PreOpState.NurseReviewedByName || "",
                    "PreOpNurseReviewedLicenseNumber": PreOpState.NurseReviewedLicenseNumber || "",
                    "PreOpNurseReviewedDate": PreOpState.NurseReviewedDate || null,

                    /* Intra-Op */
                    "IntraOpNurseReviewedByName": IntraOpState.NurseReviewedByName || "",
                    "IntraOpNurseReviewedLicenseNumber": IntraOpState.NurseReviewedLicenseNumber || "",
                    "IntraOpNurseReviewedDate": IntraOpState.NurseReviewedDate || null,

                    /* Post-Op */
                    "PostOpNurseReviewedByName": PostOpState.NurseReviewedByName || "",
                    "PostOpNurseReviewedLicenseNumber": PostOpState.NurseReviewedLicenseNumber || "",
                    "PostOpNurseReviewedDate": PostOpState.NurseReviewedDate || null,

                    "PostOpDoctorReviewedByName": PostOpState.DoctorReviewedByName || "",
                    "PostOpDoctorReviewedLicenseNumber": PostOpState.DoctorReviewedLicenseNumber || "",
                    "PostOpDoctorReviewedDate": PostOpState.DoctorReviewedDate || null,
                    "AccompainedName": PostOpAdd.AccompainedName || "",

                    "IsSurgeonOrdersTimeChecked": PreOpAdd.IsSurgeonOrdersTimeChecked || false,
                    "IsPostOpSurgeonOrdersTimeAdded": PostOpAdd.IsPostOpSurgeonOrdersTimeAdded || false,
                    "AppointmentDate": $scope.cacheStorageItem.AppointmentDate || null
                }
                USPrintService.GenerateLasikTemplatePrint(Object);
            }, 500);
        }


        /* ==================================================================
           Consent form signature status - role based.

           Mirrors the ASC Post-Op sign-off behaviour (USAscPostOpCtrl): while
           signing a template the signer is shown the consent signatures that
           are still pending for their OWN role, and can apply them without
           leaving the sign-off popup. A role with nothing pending is shown
           as complete (green).
           ================================================================== */
        $scope.consentsMainObj = {
            "OrganizationConsents": [],
            "PatientConsents": [],
            "MainConsents": [],
            "SelectedConsentTemplateId": 0
        };
        $scope.IsshowBulkSignrefreshButton = false;
        $scope.ConsentformSignatureIndication = '';
        $scope.ConsentSignStatus = getEmptyConsentSignStatus();

        function getEmptyConsentSignStatus() {
            return {
                "HasConsents": false,
                "PendingConsents": [],
                "PatientRequired": 0,
                "PatientPending": 0,
                "StaffRequired": 0,
                "StaffPending": 0,
                "GaurdianRequired": 0,
                "GaurdianPending": 0,
                "AnesthesistRequired": 0,
                "AnesthesistPending": 0,
                "DoctorRequired": 0,
                "DoctorPending": 0,
                "TotalPending": 0
            };
        }

        /* the roles that own a consent signature - the status is evaluated per
           role, never globally */
        function IsNurseConsentRole() { return $scope.RoleId == 8 || $scope.RoleId == 38; }
        function IsAnesthesiaConsentRole() { return $scope.RoleId == 25 || $scope.RoleId == 30; }
        function IsSurgeonConsentRole() { return $scope.RoleId == 1 || $scope.RoleId == 43; }
        /* consent status is shown only on the Post-Op sign-off, and only to a nurse (8) */
        function IsPostOpConsentSignOff(sectionKey) { return sectionKey === 'PostOp' && $scope.RoleId == 8; }

        /* which role badges this user sees - role based, never global */
        $scope.ConsentRoleAccess = {
            "Nurse": IsNurseConsentRole(),
            "Anesthesia": IsAnesthesiaConsentRole(),
            "Surgeon": IsSurgeonConsentRole()
        };

        function getnewMainConsentObj() {
            var obj = {
                "PatientConsentFormId": 0,
                "IsPartiallySaved": false,
                "HTMLContent": "",
                "S3URL": "",
                "ConsentFormId": 0,
                "ConsentFormName": "",
                "ConsentTemplateId": 0,
                "ConsentTypeId": 0,
                "ConsentTypeName": "",
                "PDFcontent": "",
                "IsPatientSignRequired": false,
                "IsDoctorSignRequired": false,
                "IsAnesthesistSignRequired": false,
                "IsCounselorSignRequired": false,
                "IsStaffSignRequired": false,
                "IsGuardianSignRequired": false,
                "IsSignRequiredForEachVisit": false,
                "IsPatientSignatureDone": "",
                "IsProviderSignatureDone": "",
                "ProviderUserId": 0,
                "ProviderUserName": "",
                "IsStaffSignatureDone": "",
                "StaffUserId": 0,
                "StaffUserName": "",
                "IsCounselorSignatureDone": "",
                "CounselorUserId": 0,
                "CounselorUserName": "",
                "IsAnesthesistSignatureDone": "",
                "AnesthesistUserId": 0,
                "AnesthesistUserName": "",
                "IsGaurdianSignatureDone": "",
                "GaurdianUserId": 0,
                "GaurdianFirstName": "",
                "GaurdianLastName": "",
                "GaurdianRelationShipId": "",
                "PatientClass": "disabled",
                "ProviderClass": "disabled",
                "StaffClass": "disabled",
                "AnesthesistClass": "disabled",
                "CounselorClass": "disabled",
                "GaurdianClass": "disabled",
                "IsSelected": false
            };
            return obj;
        }

        $scope.GetPatientAppointmentConsentsById = function () {
            $scope.consentsMainObj.MainConsents = [];
            $scope.consentsMainObj.OrganizationConsents = [];
            $scope.consentsMainObj.PatientConsents = [];
            $scope.ConsentSignStatus = getEmptyConsentSignStatus();
            $scope.IsshowBulkSignrefreshButton = false;
            $scope.ConsentformSignatureIndication = '';

            var obj = {
                "OrganizationId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                "PatientId": $scope.cacheStorageItem.PatientID,
                "ServiceTypeId": $scope.cacheStorageItem.VisitTypeId,
                "VisitId": 0,
                "AppointmentType": $scope.cacheStorageItem.AppointmentType
            };

            return eHnoteSettingsDataService.GetPatientAppointmentConsentsById(obj).then(function (resp) {
                $scope.admissiondatetime = resp.data.Admissiondatetime || null;

                resp.data.OrganizationConsents = resp.data.OrganizationConsents || [];
                if (resp.data.OrganizationConsents.length > 0) {
                    $scope.consentsMainObj.OrganizationConsents = resp.data.OrganizationConsents;
                    angular.forEach($scope.consentsMainObj.OrganizationConsents, function (oitem) {
                        oitem.isConsentAddedForPatient = false;
                    });
                }
                resp.data.PatientAppointmentConsents = resp.data.PatientAppointmentConsents || [];

                var filteredArray = $filter("filter")($scope.consentsMainObj.OrganizationConsents, { "IsPrimary": "Y" }, true);
                if (resp.data.PatientAppointmentConsents.length > 0) {
                    $scope.consentsMainObj.PatientConsents = resp.data.PatientAppointmentConsents;
                    $scope.consentsMainObj.SelectedConsentTemplateId = $scope.consentsMainObj.PatientConsents[0].ConsentTemplateId || 0;
                    if ($scope.consentsMainObj.SelectedConsentTemplateId === 0 && filteredArray.length > 0) {
                        $scope.consentsMainObj.SelectedConsentTemplateId = filteredArray[0].ConsentTemplateId;
                    }
                } else {
                    if (filteredArray.length > 0) {
                        $scope.consentsMainObj.SelectedConsentTemplateId = filteredArray[0].ConsentTemplateId;
                    }
                }
                reformAppointmentConsentsandOrgConsents($scope.consentsMainObj.SelectedConsentTemplateId);
                return resp;
            }, function (err) {
                console.log(err);
            });
        };

        function reformAppointmentConsentsandOrgConsents(consentTemplateId) {
            $scope.consentsMainObj.MainConsents = [];

            var filteredOrgConsentTemplateArray = $filter("filter")($scope.consentsMainObj.OrganizationConsents, { "ConsentTemplateId": consentTemplateId }, true);
            if (filteredOrgConsentTemplateArray.length > 0) {

                if ($scope.consentsMainObj.PatientConsents.length === 0) {
                    angular.forEach(filteredOrgConsentTemplateArray[0].ConsentTemplateDetails, function (oitem) {
                        var obj = getnewMainConsentObj();
                        obj.ConsentFormId = oitem.OrganisationConsentFormId;
                        obj.ConsentFormName = oitem.DocumentName;
                        obj.ConsentTemplateId = oitem.ConsentTemplateId;
                        obj.ConsentTypeId = oitem.ConsentTypeId;
                        obj.ConsentTypeName = oitem.ConsentTypeName;
                        obj.PDFcontent = oitem.PDFcontent || "";
                        obj.IsPatientSignRequired = oitem.IsPatientSignRequired;
                        obj.IsDoctorSignRequired = oitem.IsDoctorSignRequired;
                        obj.IsAnesthesistSignRequired = oitem.IsAnesthesistSignRequired;
                        obj.IsCounselorSignRequired = oitem.IsCounselorSignRequired;
                        obj.IsStaffSignRequired = oitem.IsStaffSignRequired;
                        obj.IsGuardianSignRequired = oitem.IsGuardianSignRequired;
                        obj.IsSignRequiredForEachVisit = oitem.IsSignRequiredForEachVisit;
                        obj.IsPatientSignatureDone = false;
                        obj.IsProviderSignatureDone = false;
                        obj.IsStaffSignatureDone = false;
                        obj.IsCounselorSignatureDone = false;
                        obj.IsAnesthesistSignatureDone = false;
                        obj.IsGaurdianSignatureDone = false;
                        $scope.consentsMainObj.MainConsents.push(obj);
                    });
                } else {
                    angular.forEach($scope.consentsMainObj.PatientConsents, function (item1) {
                        if (filteredOrgConsentTemplateArray[0].ConsentTemplateDetails.length > 0) {
                            angular.forEach(filteredOrgConsentTemplateArray[0].ConsentTemplateDetails, function (item2) {
                                if (item1.ConsentFormId === item2.OrganisationConsentFormId) {
                                    item2.isConsentAddedForPatient = true;
                                }
                            });
                        }
                    });

                    angular.forEach($scope.consentsMainObj.PatientConsents, function (oitem) {
                        var obj = getnewMainConsentObj();
                        obj.PatientConsentFormId = oitem.PatientConsentDocumentId;
                        obj.ConsentFormId = oitem.ConsentFormId;
                        obj.ConsentFormName = oitem.ConsentFormName;
                        obj.ConsentTemplateId = consentTemplateId;
                        obj.ConsentTypeId = oitem.ConsentTypeId;
                        obj.ConsentTypeName = oitem.ConsentTypeName;
                        obj.HTMLContent = oitem.HTMLContent;
                        obj.S3URL = oitem.S3URL;
                        obj.PDFcontent = oitem.HTMLContent;
                        obj.IsPatientSignRequired = oitem.IsPatientSignRequired;
                        obj.IsDoctorSignRequired = oitem.IsDoctorSignRequired;
                        obj.IsAnesthesistSignRequired = oitem.IsAnesthesistSignRequired;
                        obj.IsCounselorSignRequired = oitem.IsCounselorSignRequired;
                        obj.IsStaffSignRequired = oitem.IsStaffSignRequired;
                        obj.IsGuardianSignRequired = oitem.IsGuardianSignRequired;
                        obj.IsSignRequiredForEachVisit = oitem.IsSignRequiredForEachVisit;
                        obj.IsPatientSignatureDone = oitem.IsPatientSignatureDone;
                        obj.IsProviderSignatureDone = oitem.IsProviderSignatureDone;
                        obj.ProviderUserId = oitem.ProviderUserId || 0;
                        obj.ProviderUserName = oitem.ProviderUserName || "";
                        obj.IsStaffSignatureDone = oitem.IsStaffSignatureDone;
                        obj.StaffUserId = oitem.StaffUserId || 0;
                        obj.StaffUserName = oitem.StaffUserName || "";
                        obj.IsCounselorSignatureDone = oitem.IsCounselorSignatureDone;
                        obj.CounselorUserId = oitem.CounselorUserId || 0;
                        obj.CounselorUserName = oitem.CounselorUserName || "";
                        obj.IsAnesthesistSignatureDone = oitem.IsAnesthesistSignatureDone;
                        obj.AnesthesistUserId = oitem.AnesthesistUserId || 0;
                        obj.AnesthesistUserName = oitem.AnesthesistUserName;
                        obj.IsGaurdianSignatureDone = oitem.IsGaurdianSignatureDone;
                        obj.GaurdianUserId = oitem.GaurdianUserId;
                        obj.GaurdianFirstName = oitem.GaurdianFirstName || "";
                        obj.GaurdianLastName = oitem.GaurdianLastName || "";
                        obj.GaurdianRelationShipId = oitem.GaurdianRelationShipId || 0;
                        obj.IsScannedDocument = oitem.IsScannedDocument;
                        obj.AppointmentId = oitem.AppointmentId;
                        obj.PatientId = oitem.PatientId;
                        obj.DocumentName = oitem.DocumentName;
                        obj.DeleteInd = oitem.DeleteInd || 'Y';
                        obj.PatientSignedDateTime = oitem.PatientSignedDateTime || "";
                        obj.ProviderSignedDateTime = oitem.ProviderSignedDateTime || "";
                        obj.StaffSignedDateTime = oitem.StaffSignedDateTime || "";
                        obj.CounselorSignedDateTime = oitem.CounselorSignedDateTime || "";
                        obj.AnesthesistSignedDateTime = oitem.AnesthesistSignedDateTime || "";
                        obj.GaurdianSignedDateTime = oitem.GaurdianSignedDateTime || "";
                        obj.PatientSignCaptureUserId = oitem.PatientSignCaptureUserId || 0;
                        obj.ProviderSignCaptureUserId = oitem.ProviderSignCaptureUserId || 0;
                        obj.StaffSignCaptureUserId = oitem.StaffSignCaptureUserId || 0;
                        obj.CounselorSignCaptureUserId = oitem.CounselorSignCaptureUserId || 0;
                        obj.AnesthesistSignCaptureUserId = oitem.AnesthesistSignCaptureUserId || 0;
                        obj.GaurdianSignCaptureUserId = oitem.GaurdianSignCaptureUserId || 0;
                        $scope.consentsMainObj.MainConsents.push(obj);
                    });

                    angular.forEach(filteredOrgConsentTemplateArray[0].ConsentTemplateDetails, function (oitem) {
                        if (!oitem.isConsentAddedForPatient) {
                            var obj = getnewMainConsentObj();
                            obj.ConsentFormId = oitem.OrganisationConsentFormId;
                            obj.ConsentFormName = oitem.DocumentName;
                            obj.ConsentTemplateId = oitem.ConsentTemplateId;
                            obj.ConsentTypeId = oitem.ConsentTypeId;
                            obj.ConsentTypeName = oitem.ConsentTypeName;
                            obj.PDFcontent = oitem.PDFcontent;
                            obj.IsPatientSignRequired = oitem.IsPatientSignRequired;
                            obj.IsDoctorSignRequired = oitem.IsDoctorSignRequired;
                            obj.IsAnesthesistSignRequired = oitem.IsAnesthesistSignRequired;
                            obj.IsCounselorSignRequired = oitem.IsCounselorSignRequired;
                            obj.IsStaffSignRequired = oitem.IsStaffSignRequired;
                            obj.IsGuardianSignRequired = oitem.IsGuardianSignRequired;
                            obj.IsSignRequiredForEachVisit = oitem.IsSignRequiredForEachVisit;
                            obj.IsPatientSignatureDone = false;
                            obj.IsProviderSignatureDone = false;
                            obj.IsStaffSignatureDone = false;
                            obj.IsCounselorSignatureDone = false;
                            obj.IsAnesthesistSignatureDone = false;
                            obj.IsGaurdianSignatureDone = false;
                            obj.IsScannedDocument = false;
                            $scope.consentsMainObj.MainConsents.push(obj);
                        }
                    });
                }
            }

            BuildConsentSignStatusForRole();
        }

        /* Evaluates the consent signature status for the logged-in role only.
           Every role keeps its own required / pending counters, so a role with
           nothing pending is reported complete while another role on the same
           consent may still be pending. */
        function BuildConsentSignStatusForRole() {
            var status = getEmptyConsentSignStatus();
            var consents = $scope.consentsMainObj.MainConsents || [];
            status.HasConsents = consents.length > 0;

            $scope.IsshowBulkSignrefreshButton = false;
            $scope.ConsentformSignatureIndication = '';

            angular.forEach(consents, function (item) {

                if (!item.IsCounselorSignRequired) {
                    item.CounselorClass = 'disabled';
                } else {
                    item.CounselorClass = item.IsCounselorSignatureDone ? 'complete' : 'incomplete';
                }

                item.CanBulksignconsent = false;

                if (IsNurseConsentRole()) {
                    if (!item.IsPatientSignRequired) {
                        item.PatientClass = 'disabled';
                    } else {
                        status.PatientRequired++;
                        if (item.IsPatientSignatureDone) {
                            item.PatientClass = 'complete';
                        } else {
                            item.PatientClass = 'incomplete';
                            status.PatientPending++;
                        }
                    }

                    if (!item.IsGuardianSignRequired) {
                        item.GaurdianClass = 'disabled';
                    } else {
                        status.GaurdianRequired++;
                        if (item.IsGaurdianSignatureDone) {
                            item.GaurdianClass = 'complete';
                        } else {
                            item.GaurdianClass = 'incomplete';
                            status.GaurdianPending++;
                        }
                    }

                    if (!item.IsStaffSignRequired) {
                        item.StaffClass = 'disabled';
                    } else {
                        status.StaffRequired++;
                        if (item.IsStaffSignatureDone) {
                            item.StaffClass = 'complete';
                        } else {
                            item.StaffClass = 'incomplete';
                            status.StaffPending++;
                        }
                    }

                    item.CanBulksignconsent = item.StaffClass == 'incomplete' ||
                        item.PatientClass == 'incomplete' ||
                        item.GaurdianClass == 'incomplete';
                }

                if (IsAnesthesiaConsentRole()) {
                    if (!item.IsAnesthesistSignRequired) {
                        item.AnesthesistClass = 'disabled';
                    } else {
                        status.AnesthesistRequired++;
                        if (item.IsAnesthesistSignatureDone) {
                            item.AnesthesistClass = 'complete';
                        } else {
                            item.AnesthesistClass = 'incomplete';
                            status.AnesthesistPending++;
                        }
                    }
                    item.CanBulksignconsent = item.AnesthesistClass == 'incomplete';
                }

                if (IsSurgeonConsentRole()) {
                    if (!item.IsDoctorSignRequired) {
                        item.ProviderClass = 'disabled';
                    } else {
                        status.DoctorRequired++;
                        if (item.IsProviderSignatureDone) {
                            item.ProviderClass = 'complete';
                        } else {
                            item.ProviderClass = 'incomplete';
                            status.DoctorPending++;
                        }
                    }
                    item.CanBulksignconsent = item.ProviderClass == 'incomplete';
                }

                if (item.CanBulksignconsent) {
                    $scope.IsshowBulkSignrefreshButton = true;
                    status.PendingConsents.push(item.ConsentFormName || item.DocumentName || "Consent Form");
                }
            });

            status.TotalPending = status.PatientPending + status.StaffPending +
                status.GaurdianPending + status.AnesthesistPending + status.DoctorPending;

            var messages = [];
            if (status.StaffPending > 0) { messages.push("Staff Sign Is Incomplete in the consent forms."); }
            if (status.PatientPending > 0) { messages.push("Patient Sign Is InComplete In Consents forms."); }
            if (status.GaurdianPending > 0) { messages.push("Gaurdian Sign Is InComplete In Consents forms."); }
            if (status.AnesthesistPending > 0) { messages.push("Anesthesia Sign Is InComplete In Consents Forms."); }
            if (status.DoctorPending > 0) { messages.push("Surgeon Sign Is InComplete In Consents Forms."); }
            $scope.ConsentformSignatureIndication = messages.join("\n");

            $scope.ConsentSignStatus = status;
        }

        /* Apply signature from inside the sign-off popup - opens the consents
           screen and refreshes this role's status when it is closed, so the
           indicator updates without reloading the template. */
        $scope.ApplyConsentsSignature = function (signOffUserId) {
            $scope.ProviderSigBase64 = null;
            var signer = $filter("filter")($scope.allUserList || [], function (item) {
                return item.DoctorID == (signOffUserId || $scope.UserId);
            }) || [];
            if (signer.length > 0 && signer[0].SignatureOfUser) {
                $scope.ProviderSigBase64 = signer[0].SignatureOfUser || null;
            }

            $scope.AppointmentPatientdata = [];
            var hospitalobj = {
                "HospitalName": doctorinfo.doctordata.UserAddress[0].ClinicName,
                "Address1": doctorinfo.doctordata.UserAddress[0].Address1,
                "Address2": doctorinfo.doctordata.UserAddress[0].Address2,
                "CityName": doctorinfo.doctordata.UserAddress[0].CityName,
                "StateName": doctorinfo.doctordata.UserAddress[0].StateName,
                "CountryName": doctorinfo.doctordata.UserAddress[0].CountryName,
                "MobileNo": doctorinfo.doctordata.UserAddress[0].MobileNo,
                "AreaCode": doctorinfo.doctordata.UserAddress[0].AreaCode,
                "PinCode": doctorinfo.doctordata.UserAddress[0].PinCode
            };
            $scope.AppointmentPatientdata.push(hospitalobj);

            var selectedApptObj = $scope.MainselectedApptObj || {};
            var sobj = {
                "mainitem": selectedApptObj,
                "UserId": $scope.UserId,
                "HospitalId": $scope.HospitalId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                "ParentHospitalId": $scope.ParentHospitalId,
                "PatientId": $scope.cacheStorageItem.PatientID,
                "HospitalAddress": $scope.AppointmentPatientdata,
                "selectedArray": [],
                "selectedObj": "",
                "Page": "PreOp",
                "PatientDetails": selectedApptObj.Patient || "",
                "ApptHospitalId": selectedApptObj.BranchId || 0
            };

            var consentmodalInstance = $uibModal.open({
                "templateUrl": "templates/uibpopups/DocumentsPopup.html",
                "backdrop": "static",
                "scope": $scope,
                "resolve": {
                    "ParentObject": function () { return sobj; }
                },
                "keyboard": false,
                "controller": "UsPatientDocumentsCtrl",
                "windowClass": "modal__popup--1 bottom-to-top-modal"
            });

            consentmodalInstance.result.then(function (result) {
                if (result && result.MainConsents) {
                    $scope.consentsMainObj.MainConsents = result.MainConsents || [];
                    BuildConsentSignStatusForRole();
                } else {
                    $scope.GetPatientAppointmentConsentsById();
                }
            }, function () {
                $scope.GetPatientAppointmentConsentsById();
            });
        };

        $scope.$on("RefreshAppointmentConsents", function () {
            $scope.GetPatientAppointmentConsentsById();
        });

        $scope.GetPatientAppointmentConsentsById();
    }]).value('duScrollBottomSpy', true).value('duScrollActiveClass', 'active').value('duScrollOffset', 10);
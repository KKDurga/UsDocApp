"use strict";
eHnoteWebApp.controller("USPreAdmROSCtrl", ["$scope", "$rootScope", "$uibModal", "$uibModalInstance", "$filter", "alertify", "eHnoteMasterDataService", "CategoryList", "RosObject", "cacheStorageItem", "eHnoteConditionsDataService", "eHnoteDiagnosisDataServices", "eHnoteSettingsDataService", "eHnoteMainAppointmentService", "SurgeryStaticDataService", "ScreenObj", "ROSIsNormalArray", "eHnotePatientDataService", "$q", "eHnoteSurgeryService", "datapersistanceFactory", "$location", "ParentObj", "eHnoteAuditServices","eHnoteUserDataService",
    function ($scope, $rootScope, $uibModal, $uibModalInstance, $filter, alertify, eHnoteMasterDataService, CategoryList, RosObject, cacheStorageItem, eHnoteConditionsDataService, eHnoteDiagnosisDataServices, eHnoteSettingsDataService, eHnoteMainAppointmentService, SurgeryStaticDataService, ScreenObj, ROSIsNormalArray, eHnotePatientDataService, $q, eHnoteSurgeryService, datapersistanceFactory, $location, ParentObj, eHnoteAuditServices, eHnoteUserDataService) {

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
            $scope.SubOrginactionID = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.SubHospitalID;
        }
        $scope.CategoryDetails = CategoryList || [];
        $scope.cacheStorageItem = cacheStorageItem || '';
        $scope.OrganizationSettingsData = datapersistanceFactory.getItem("OrganizationSettingsData") || {};

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

        $scope.RosObj = {
            'Type': RosObject,

        };

        $scope.AllergyStatus = {
            "ShowNoKnownAllergy": true  // default true
        };



        $scope.adnewsigobj = {
            "IsNewSig": false,
            "MedicineId": 0,
        }

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

        $scope.ScreenObj = ScreenObj.ScreenType || 'ASC';
        $scope.IsComingfrm = ScreenObj.IsComingfrm || '';

        $scope.ROSIsNormalArray = ROSIsNormalArray || [];

        $scope.obj = {
            "IsClickSaveAscRosBtn": false,
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
            "MedicineSearchType": "General",
            "ROSOverAllRemarks": "",
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
            },
            "AllergyRemarks": "",
            "AllergyNotesInd": false,
            "SurgicalRemarks": "",
            "SurgicalNotesInd": false,
            "CurrentEyeNotesInd": false,
            "CurrentEyeRemarks": "",
            "CurrentSystemicNotesInd": false,
            "CurrentSystemicRemarks": "",
            "SystemicHistoryNotesInd": false,

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
            "SystemicHistoryRemarks": "",
            "LifestyleHistoryNotesInd": false,
            "LifestyleHistoryRemarks": ""
        };

        $scope.SigSearch = {
            "Shows": false
        }

        $scope.TimmeObject = {
            "Hours": SurgeryStaticDataService.GetHours(),
            "Minutes": SurgeryStaticDataService.GetMinutes()
        };
        $scope.obj.ROSOverAllRemarks = $scope.cacheStorageItem.ROSOverAllRemarks;
        $scope.GetROSEditDetails = function () {

            if ($scope.obj.OccularHistoryArray.length > 0) {
                angular.forEach($scope.obj.OccularHistoryArray, function (suitem) {
                    if (suitem.PatientDetailId != 0) {
                        //suitem.ActiveInd = true;
                        suitem.OrganId = parseInt(suitem.OrganId) || 0;
                        suitem.SeverityId = parseInt(suitem.SeverityId) || "";
                        suitem.StatusId = parseInt(suitem.StatusId) || 0;
                        suitem.SNOMEDId = parseInt(suitem.SNOMEDId) || 0;
                        suitem.SNOMEDCODE = suitem.SNOMEDCODE || "";
                        suitem.DiagnosisObject = suitem.ICD10CODE || "";
                    }
                });
            }
            if ($scope.obj.OcularSurgicalHistoryArray.length > 0) {
                angular.forEach($scope.obj.OcularSurgicalHistoryArray, function (suitem) {
                    if (suitem.PatientDetailId != 0) {
                        //  suitem.ActiveInd = true;
                        suitem.OrganId = parseInt(suitem.OrganId) || 0;
                        suitem.CPTObj = suitem.CPTCode || "";
                        suitem.ModifierObj = $filter("filter")($scope.ROSModifiers, function (iterator, ind) { return iterator.MODIFIERID === suitem.ModifierId; })[0] || "";
                    } else if (suitem.PatientDetailId == 0) {
                        suitem.ModifierObj = $filter("filter")($scope.ROSModifiers, function (iterator, ind) { return iterator.MODIFIERID === suitem.ModifierId; })[0] || "";
                    }
                });
            }
            if ($scope.obj.SystemicHistoryArray.length > 1) {
                var Demo = $filter('filter')($scope.obj.SystemicHistoryArray, { 'HistoryId': 1 }, true) || [];
                if (Demo.length > 0) {
                    let index = $scope.obj.SystemicHistoryArray.indexOf(Demo[0]);
                    if (Demo[0].PatientDetailId != 0) {
                        $scope.obj.SystemicHistoryArray[index].DeleteInd = 'Y';
                    } else {
                        $scope.obj.SystemicHistoryArray.splice(index);
                    }
                    $scope.obj.isNKSHSelected = false;
                }
            }
            if ($scope.obj.SystemicHistoryArray.length > 0) {
                angular.forEach($scope.obj.SystemicHistoryArray, function (suitem) {
                    if (suitem.PatientDetailId != 0) {
                        //  suitem.ActiveInd = true;
                        suitem.OrganId = parseInt(suitem.OrganId) || 0;
                        suitem.SNOMEDId = parseInt(suitem.SNOMEDId) || 0;
                        suitem.SnomedCode = suitem.SNOMEDCODE || "";
                        suitem.DiagnosisObject = suitem.ICD10CODE || "";
                    }
                });
            }
            if ($scope.obj.SurgicalHistoryArray.length > 0) {
                angular.forEach($scope.obj.SurgicalHistoryArray, function (suitem) {
                    if (suitem.PatientDetailId != 0) {
                        //  suitem.ActiveInd = true;
                        suitem.OrganId = parseInt(suitem.OrganId) || 0;
                        suitem.CPTObj = suitem.CPTCode || "";
                        suitem.ModifierObj = $filter("filter")($scope.ROSModifiers, function (iterator, ind) { return iterator.MODIFIERID === suitem.ModifierId; })[0] || "";
                    } else if (suitem.PatientDetailId == 0) {
                        suitem.ModifierObj = $filter("filter")($scope.ROSModifiers, function (iterator, ind) { return iterator.MODIFIERID === suitem.ModifierId; })[0] || "";
                    }
                });
            }

        }

        $scope.GetAllMasterConsultationData = function () {
            eHnoteDiagnosisDataServices.GetAllMasterConsultationData().then(function (resp) {
                $scope.HealthPhysicalObj.NonSmokerStatus = [];
                $scope.HealthPhysicalObj.SmokingStatus = [];
                $scope.HealthPhysicalObj.AlcoholStatus = [];
                $scope.HealthPhysicalObj.NonAlcoholStatus = [];
                if (resp.data.status === "Success") {
                    $scope.ROSAllergyReactions = resp.data.ROSAllergyReactions || [];
                    $scope.ROSAllergySeverity = resp.data.ROSAllergySeverity || [];
                    $scope.ROSAllergyStatus = resp.data.ROSAllergyStatus || [];
                    $scope.ROSAllergyType = resp.data.ROSAllergyType || [];
                    $scope.Relations = resp.data.Relations || [];
                    $scope.ROSModifiers = resp.data.Modifiers || [];
                    $scope.SmokingStatus = resp.data.SmokingStatus || [];
                    $scope.SmokingQuantity = resp.data.SmokingQuantity || [];
                    $scope.AlcoholQuantity = resp.data.AlcoholQuantity || [];
                    $scope.DrugNames = resp.data.DrugNames || [];
                    $scope.DrugQuantity = resp.data.DrugQuantity || [];
                    $scope.DrugWhenQuit = resp.data.DrugWhenQuit || [];
                    $scope.ROSVaccinationStatus = resp.data.VaccinationStatus || [];
                    $scope.MasterSmokingStatus = resp.data.SmokingStatus || [];
                    $scope.MasterAlcoholStatus = resp.data.AlcoholStatus || [];
                    angular.forEach($scope.ROSAllergySeverity, function (item) {
                        if (item.ROSAllergySeverityId !== 2 && item.ROSAllergySeverityId !== 4 && item.ROSAllergySeverityId !== 6 && item.ROSAllergySeverityId !== 7) {
                            $scope.ROSocularSeverity.push(item);
                        }
                    });
                    if (resp.data.SmokingStatus.length > 0) {
                        angular.forEach(resp.data.SmokingStatus, function (item) {
                            if (item.HistoryHabitsID == 3 || item.HistoryHabitsID == 4) {
                                $scope.HealthPhysicalObj.NonSmokerStatus.push(item);
                            } else {
                                $scope.HealthPhysicalObj.SmokingStatus.push(item);
                            }
                        });
                    }
                    if (resp.data.AlcoholStatus.length > 0) {
                        angular.forEach(resp.data.AlcoholStatus, function (item) {
                            if (item.HistoryHabitsID == 4 || item.HistoryHabitsID == 6) {
                                $scope.HealthPhysicalObj.NonAlcoholStatus.push(item);
                            } else {
                                $scope.HealthPhysicalObj.AlcoholStatus.push(item);
                            }
                        });
                    }
                    // if ($scope.cacheStorageItem.IsEditConsultation == true || $scope.cacheStorageItem.appointmentStatus !== "B") {
                    $scope.GetROSEditDetails();
                    //  }

                }

            });
        }

        $scope.GetMasterCustomAllergyRemarks = function () {
            eHnoteDiagnosisDataServices.GetMasterCustomAllergyRemarks().then(function (resp) {
                if (resp.data.status === "Success") {
                    if (resp.data.rows.length > 0) {
                        var remarksArray = resp.data.rows || [];
                        angular.forEach(remarksArray, function (ritem) {
                            var obj = {
                                "AllergyRemarksDetailId": 0,
                                "CustomAllergyRemarkId": ritem.CustomAllergyRemarkId,
                                "CustomAllergyRemarkName": ritem.CustomAllergyRemarkName,
                                "CustomAllergyRemarkCategory": ritem.CustomAllergyRemarkCategory,
                                "CustomAllergyValue": "",
                                "ActiveInd": "Y"
                            };
                            if (ritem.CustomAllergyRemarkCategory == "Eyes") {
                                $scope.obj.ROSAllergyRemarkObj.Eyes.push(obj);
                            }
                            else if (ritem.CustomAllergyRemarkCategory == "Respiratory") {
                                $scope.obj.ROSAllergyRemarkObj.Respiratory.push(obj);
                            }
                            else if (ritem.CustomAllergyRemarkCategory == "ENT") {
                                $scope.obj.ROSAllergyRemarkObj.ENT.push(obj);
                            }
                            else if (ritem.CustomAllergyRemarkCategory == "Skin") {
                                $scope.obj.ROSAllergyRemarkObj.Skin.push(obj);
                            }
                            else if (ritem.CustomAllergyRemarkCategory == "Genito-Urinary") {
                                $scope.obj.ROSAllergyRemarkObj.GenitoUrinary.push(obj);
                            }
                            else if (ritem.CustomAllergyRemarkCategory == "Gastro Interstinal") {
                                $scope.obj.ROSAllergyRemarkObj.GastroInterstinal.push(obj);
                            }
                            else if (ritem.CustomAllergyRemarkCategory == "Cardio Vascular") {
                                $scope.obj.ROSAllergyRemarkObj.CardioVascular.push(obj);
                            }
                            else if (ritem.CustomAllergyRemarkCategory == "Blood/Lymph") {
                                $scope.obj.ROSAllergyRemarkObj.BloodOrLymph.push(obj);
                            }
                            else if (ritem.CustomAllergyRemarkCategory == "Psychiatric") {
                                $scope.obj.ROSAllergyRemarkObj.Psychiatric.push(obj);
                            }
                            else if (ritem.CustomAllergyRemarkCategory == "Constitutional") {
                                $scope.obj.ROSAllergyRemarkObj.Constitutional.push(obj);
                            }
                            else if (ritem.CustomAllergyRemarkCategory == "Neurological") {
                                $scope.obj.ROSAllergyRemarkObj.Neurological.push(obj);
                            }
                            else if (ritem.CustomAllergyRemarkCategory == "Muscolo skeletal") {
                                $scope.obj.ROSAllergyRemarkObj.Muscoloskeletal.push(obj);
                            }
                            else if (ritem.CustomAllergyRemarkCategory == "Endocrine") {
                                $scope.obj.ROSAllergyRemarkObj.Endocrine.push(obj);
                            }
                            else if (ritem.CustomAllergyRemarkCategory == "Immunologic") {
                                $scope.obj.ROSAllergyRemarkObj.Immunologic.push(obj);
                            }
                        });

                        $scope.cacheStorageItem.ROSAllergyRemarkDetails = $scope.cacheStorageItem.ROSAllergyRemarkDetails || [];
                        if ($scope.cacheStorageItem.ROSAllergyRemarkDetails.length > 0) {
                            angular.forEach($scope.cacheStorageItem.ROSAllergyRemarkDetails, function (subitem) {
                                if (subitem.CustomAllergyRemarkCategory == "Eyes") {
                                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Eyes, function (ritem) {
                                        if (ritem.CustomAllergyRemarkId === subitem.CustomAllergyRemarkId) {
                                            ritem.AllergyRemarksDetailId = subitem.AllergyRemarksDetailId;
                                            ritem.ActiveInd = subitem.ActiveInd;
                                            ritem.CustomAllergyValue = subitem.CustomAllergyValue;
                                        }
                                        if ($scope.obj.ROSAllergyRemarkObj.Eyes.length > 0) {
                                            angular.forEach($scope.obj.ROSAllergyRemarkObj.Eyes, function (yitem) {
                                                if (yitem.CustomAllergyValue == 'N') {
                                                    $scope.obj.ROSAllergyRemarkObj.IsEyeNormal = true;
                                                } else {
                                                    $scope.obj.ROSAllergyRemarkObj.IsEyeNormal = false;
                                                }

                                            });

                                        }
                                    });
                                }
                                else if (subitem.CustomAllergyRemarkCategory == "Respiratory") {
                                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Respiratory, function (ritem) {
                                        if (ritem.CustomAllergyRemarkId === subitem.CustomAllergyRemarkId) {
                                            ritem.AllergyRemarksDetailId = subitem.AllergyRemarksDetailId;
                                            ritem.ActiveInd = subitem.ActiveInd;
                                            ritem.CustomAllergyValue = subitem.CustomAllergyValue;
                                        }
                                        if ($scope.obj.ROSAllergyRemarkObj.Respiratory.length > 0) {
                                            angular.forEach($scope.obj.ROSAllergyRemarkObj.Respiratory, function (yitem) {
                                                if (yitem.CustomAllergyValue == 'N') {
                                                    $scope.obj.ROSAllergyRemarkObj.IsRespiratoryNormal = true;
                                                } else {
                                                    $scope.obj.ROSAllergyRemarkObj.IsRespiratoryNormal = false;
                                                }

                                            });

                                        }
                                    });
                                }
                                else if (subitem.CustomAllergyRemarkCategory == "ENT") {
                                    angular.forEach($scope.obj.ROSAllergyRemarkObj.ENT, function (ritem) {
                                        if (ritem.CustomAllergyRemarkId === subitem.CustomAllergyRemarkId) {
                                            ritem.AllergyRemarksDetailId = subitem.AllergyRemarksDetailId;
                                            ritem.ActiveInd = subitem.ActiveInd;
                                            ritem.CustomAllergyValue = subitem.CustomAllergyValue;
                                        }
                                        if ($scope.obj.ROSAllergyRemarkObj.ENT.length > 0) {
                                            angular.forEach($scope.obj.ROSAllergyRemarkObj.ENT, function (yitem) {
                                                if (yitem.CustomAllergyValue == 'N') {
                                                    $scope.obj.ROSAllergyRemarkObj.IsENTNormal = true;
                                                } else {
                                                    $scope.obj.ROSAllergyRemarkObj.IsENTNormal = false;
                                                }

                                            });

                                        }
                                    });
                                }
                                else if (subitem.CustomAllergyRemarkCategory == "Skin") {
                                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Skin, function (ritem) {
                                        if (ritem.CustomAllergyRemarkId === subitem.CustomAllergyRemarkId) {
                                            ritem.AllergyRemarksDetailId = subitem.AllergyRemarksDetailId;
                                            ritem.ActiveInd = subitem.ActiveInd;
                                            ritem.CustomAllergyValue = subitem.CustomAllergyValue;
                                        }
                                        if ($scope.obj.ROSAllergyRemarkObj.Skin.length > 0) {
                                            angular.forEach($scope.obj.ROSAllergyRemarkObj.Skin, function (yitem) {
                                                if (yitem.CustomAllergyValue == 'N') {
                                                    $scope.obj.ROSAllergyRemarkObj.IsSkinNormal = true;
                                                } else {
                                                    $scope.obj.ROSAllergyRemarkObj.IsSkinNormal = false;
                                                }

                                            });

                                        }
                                    });
                                }
                                else if (subitem.CustomAllergyRemarkCategory == "Genito-Urinary") {
                                    angular.forEach($scope.obj.ROSAllergyRemarkObj.GenitoUrinary, function (ritem) {
                                        if (ritem.CustomAllergyRemarkId === subitem.CustomAllergyRemarkId) {
                                            ritem.AllergyRemarksDetailId = subitem.AllergyRemarksDetailId;
                                            ritem.ActiveInd = subitem.ActiveInd;
                                            ritem.CustomAllergyValue = subitem.CustomAllergyValue;
                                        }
                                        if ($scope.obj.ROSAllergyRemarkObj.GenitoUrinary.length > 0) {
                                            angular.forEach($scope.obj.ROSAllergyRemarkObj.GenitoUrinary, function (yitem) {
                                                if (yitem.CustomAllergyValue == 'N') {
                                                    $scope.obj.ROSAllergyRemarkObj.IsGenitoUrinaryEyeNormal = true;
                                                } else {
                                                    $scope.obj.ROSAllergyRemarkObj.IsGenitoUrinaryEyeNormal = false;
                                                }

                                            });

                                        }
                                    });
                                }
                                else if (subitem.CustomAllergyRemarkCategory == "Gastro Interstinal") {
                                    angular.forEach($scope.obj.ROSAllergyRemarkObj.GastroInterstinal, function (ritem) {
                                        if (ritem.CustomAllergyRemarkId === subitem.CustomAllergyRemarkId) {
                                            ritem.AllergyRemarksDetailId = subitem.AllergyRemarksDetailId;
                                            ritem.ActiveInd = subitem.ActiveInd;
                                            ritem.CustomAllergyValue = subitem.CustomAllergyValue;
                                        }
                                        if ($scope.obj.ROSAllergyRemarkObj.GastroInterstinal.length > 0) {
                                            angular.forEach($scope.obj.ROSAllergyRemarkObj.GastroInterstinal, function (yitem) {
                                                if (yitem.CustomAllergyValue == 'N') {
                                                    $scope.obj.ROSAllergyRemarkObj.IsGastroInterstinalNormal = true;
                                                } else {
                                                    $scope.obj.ROSAllergyRemarkObj.IsGastroInterstinalNormal = false;
                                                }

                                            });

                                        }

                                    });
                                }
                                else if (subitem.CustomAllergyRemarkCategory == "Cardio Vascular") {
                                    angular.forEach($scope.obj.ROSAllergyRemarkObj.CardioVascular, function (ritem) {
                                        if (ritem.CustomAllergyRemarkId === subitem.CustomAllergyRemarkId) {
                                            ritem.AllergyRemarksDetailId = subitem.AllergyRemarksDetailId;
                                            ritem.ActiveInd = subitem.ActiveInd;
                                            ritem.CustomAllergyValue = subitem.CustomAllergyValue;
                                        }
                                        if ($scope.obj.ROSAllergyRemarkObj.CardioVascular.length > 0) {
                                            angular.forEach($scope.obj.ROSAllergyRemarkObj.CardioVascular, function (yitem) {
                                                if (yitem.CustomAllergyValue == 'N') {
                                                    $scope.obj.ROSAllergyRemarkObj.IsCardioVascularNormal = true;
                                                } else {
                                                    $scope.obj.ROSAllergyRemarkObj.IsCardioVascularNormal = false;
                                                }

                                            });

                                        }
                                    });
                                }
                                else if (subitem.CustomAllergyRemarkCategory == "Blood/Lymph") {
                                    angular.forEach($scope.obj.ROSAllergyRemarkObj.BloodOrLymph, function (ritem) {
                                        if (ritem.CustomAllergyRemarkId === subitem.CustomAllergyRemarkId) {
                                            ritem.AllergyRemarksDetailId = subitem.AllergyRemarksDetailId;
                                            ritem.ActiveInd = subitem.ActiveInd;
                                            ritem.CustomAllergyValue = subitem.CustomAllergyValue;
                                        }
                                        if ($scope.obj.ROSAllergyRemarkObj.BloodOrLymph.length > 0) {
                                            angular.forEach($scope.obj.ROSAllergyRemarkObj.BloodOrLymph, function (yitem) {
                                                if (yitem.CustomAllergyValue == 'N') {
                                                    $scope.obj.ROSAllergyRemarkObj.IsBloodOrLymphNormal = true;
                                                } else {
                                                    $scope.obj.ROSAllergyRemarkObj.IsBloodOrLymphNormal = false;
                                                }

                                            });

                                        }
                                    });
                                }
                                else if (subitem.CustomAllergyRemarkCategory == "Psychiatric") {
                                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Psychiatric, function (ritem) {
                                        if (ritem.CustomAllergyRemarkId === subitem.CustomAllergyRemarkId) {
                                            ritem.AllergyRemarksDetailId = subitem.AllergyRemarksDetailId;
                                            ritem.ActiveInd = subitem.ActiveInd;
                                            ritem.CustomAllergyValue = subitem.CustomAllergyValue;
                                        }
                                        if ($scope.obj.ROSAllergyRemarkObj.Psychiatric.length > 0) {
                                            angular.forEach($scope.obj.ROSAllergyRemarkObj.Psychiatric, function (xitem) {
                                                if (xitem.CustomAllergyValue == 'N') {
                                                    $scope.obj.ROSAllergyRemarkObj.IsPsychiatricNormal = true;
                                                } else {
                                                    $scope.obj.ROSAllergyRemarkObj.IsPsychiatricNormal = false;
                                                }

                                            });

                                        }
                                    });
                                }
                                else if (subitem.CustomAllergyRemarkCategory == "Constitutional") {
                                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Constitutional, function (ritem) {
                                        if (ritem.CustomAllergyRemarkId === subitem.CustomAllergyRemarkId) {
                                            ritem.AllergyRemarksDetailId = subitem.AllergyRemarksDetailId;
                                            ritem.ActiveInd = subitem.ActiveInd;
                                            ritem.CustomAllergyValue = subitem.CustomAllergyValue;
                                        }
                                    });
                                    if ($scope.obj.ROSAllergyRemarkObj.Constitutional.length > 0) {
                                        angular.forEach($scope.obj.ROSAllergyRemarkObj.Constitutional, function (yitem) {
                                            if (yitem.CustomAllergyValue == 'N') {
                                                $scope.obj.ROSAllergyRemarkObj.IsConstitutionalNormal = true;
                                            } else {
                                                $scope.obj.ROSAllergyRemarkObj.IsConstitutionalNormal = false;
                                            }

                                        });

                                    }


                                }
                                else if (subitem.CustomAllergyRemarkCategory == "Neurological") {
                                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Neurological, function (ritem) {
                                        if (ritem.CustomAllergyRemarkId === subitem.CustomAllergyRemarkId) {
                                            ritem.AllergyRemarksDetailId = subitem.AllergyRemarksDetailId;
                                            ritem.ActiveInd = subitem.ActiveInd;
                                            ritem.CustomAllergyValue = subitem.CustomAllergyValue;
                                        }
                                        if ($scope.obj.ROSAllergyRemarkObj.Neurological.length > 0) {
                                            angular.forEach($scope.obj.ROSAllergyRemarkObj.Neurological, function (yitem) {
                                                if (yitem.CustomAllergyValue == 'N') {
                                                    $scope.obj.ROSAllergyRemarkObj.IsNeurologicalNormal = true;
                                                } else {
                                                    $scope.obj.ROSAllergyRemarkObj.IsNeurologicalNormal = false;
                                                }

                                            });

                                        }
                                    });
                                }
                                else if (subitem.CustomAllergyRemarkCategory == "Muscolo skeletal") {
                                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Muscoloskeletal, function (ritem) {
                                        if (ritem.CustomAllergyRemarkId === subitem.CustomAllergyRemarkId) {
                                            ritem.AllergyRemarksDetailId = subitem.AllergyRemarksDetailId;
                                            ritem.ActiveInd = subitem.ActiveInd;
                                            ritem.CustomAllergyValue = subitem.CustomAllergyValue;
                                        }
                                        if ($scope.obj.ROSAllergyRemarkObj.Muscoloskeletal.length > 0) {
                                            angular.forEach($scope.obj.ROSAllergyRemarkObj.Muscoloskeletal, function (yitem) {
                                                if (yitem.CustomAllergyValue == 'N') {
                                                    $scope.obj.ROSAllergyRemarkObj.IsMuscoloskeletalNormal = true;
                                                } else {
                                                    $scope.obj.ROSAllergyRemarkObj.IsMuscoloskeletalNormal = false;
                                                }

                                            });

                                        }

                                    });
                                }
                                else if (subitem.CustomAllergyRemarkCategory == "Endocrine") {
                                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Endocrine, function (ritem) {
                                        if (ritem.CustomAllergyRemarkId === subitem.CustomAllergyRemarkId) {
                                            ritem.AllergyRemarksDetailId = subitem.AllergyRemarksDetailId;
                                            ritem.ActiveInd = subitem.ActiveInd;
                                            ritem.CustomAllergyValue = subitem.CustomAllergyValue;
                                        }
                                        if ($scope.obj.ROSAllergyRemarkObj.Endocrine.length > 0) {
                                            angular.forEach($scope.obj.ROSAllergyRemarkObj.Endocrine, function (yitem) {
                                                if (yitem.CustomAllergyValue == 'N') {
                                                    $scope.obj.ROSAllergyRemarkObj.IsEndocrineNormal = true;
                                                } else {
                                                    $scope.obj.ROSAllergyRemarkObj.IsEndocrineNormal = false;
                                                }

                                            });

                                        }
                                    });
                                }
                                else if (subitem.CustomAllergyRemarkCategory == "Immunologic") {
                                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Immunologic, function (ritem) {
                                        if (ritem.CustomAllergyRemarkId === subitem.CustomAllergyRemarkId) {
                                            ritem.AllergyRemarksDetailId = subitem.AllergyRemarksDetailId;
                                            ritem.ActiveInd = subitem.ActiveInd;
                                            ritem.CustomAllergyValue = subitem.CustomAllergyValue;
                                        }
                                        if ($scope.obj.ROSAllergyRemarkObj.Immunologic.length > 0) {
                                            angular.forEach($scope.obj.ROSAllergyRemarkObj.Immunologic, function (yitem) {
                                                if (yitem.CustomAllergyValue == 'N') {
                                                    $scope.obj.ROSAllergyRemarkObj.IsImmunologicNormal = true;
                                                } else {
                                                    $scope.obj.ROSAllergyRemarkObj.IsImmunologicNormal = false;
                                                }

                                            });

                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            });
        }

        $scope.GetAllUserData = function () {
            $scope.allSubSpecializationsArray = [];
            $scope.AllUserList = [];
            eHnoteMainAppointmentService.getBranchSubSpecializationsById($scope.SubOrginactionID, doctorinfo.doctorid).then(function (resp) {
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
                        "BranchId": $scope.HospitalId,
                        "SubSpecializationIdArray": subSplArray
                    }

                    eHnoteMainAppointmentService.getAllUsersByDepartmentId(reqObj, onGetUsersSuccess, onGetUsersFailure);
                    function onGetUsersSuccess(resp) {
                        if (resp.status == "Success") {
                            if (resp.rows.length > 0) {
                                $scope.AllUserList = resp.rows;
                                if ($scope.AllUserList.length !== 0) {

                                    $scope.PerformedDoctorList = $filter("filter")($scope.AllUserList, function (item) {
                                        return item.RoleId === 1 || item.RoleId === 43;
                                    });
                                }

                            } else {
                                alertify.error("No Users Found in Selected Departments");
                                $scope.RoomDoctorsList = [];
                                $scope.FilteredRoomDoctorsList = [];
                            }
                        }
                    }

                    function onGetUsersFailure(data) {
                    }

                }
            });
        }

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


                if ($scope.cacheStorageItem.CurrentSystemicMedicationsHistory.length > 0) {
                    angular.forEach($scope.cacheStorageItem.CurrentSystemicMedicationsHistory, function (suitem) {

                        let tempArray = $filter('filter')($scope.frequencyArray, { 'MedicineDosaageFieldId': suitem.FrequencyId }, true);
                        if (tempArray.length > 0) {
                            suitem.Frequency = tempArray[0].Description;
                        } else {
                            suitem.Frequency = "";
                        }
                    });
                }

            }, function (err) {
                alertify.error("Failed");
                console.log(err);
            });
        };
        var Lifeobject = {
     
            "SmokingType": "",
            "AlcoholType": "",
            "DrugType": "",
            "PsychisType": "",
            "Remarks": "",
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
        $scope.GetHealthPreAdmAnesthetistObj = function () {
            return {
                "PreAdmissionId": 0,
                "OrganizationId": $scope.HospitalId || 0,
                "UserId": eHnoteMasterDataService.getLoginId(),
                "PatientId": $scope.cacheStorageItem.PatientId || 0,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || 0,
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
                "AppointmentID": $scope.cacheStorageItem.AppointmentId,
                "ChemistryNotesInd": false,
                "SocialNotesInd": false,
                "AirwayObjPreAdmnotesInd": false,
                "PreviousPreAdmAnesthetistData": "",
                "PreAdmAppointmentId": 0,
                "AscAppointmentId": 0,
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
                "MentalStatus": "",
            };
        };


        $scope.init = function () {
            $scope.FrequentlyAllergyitems = [];
            $scope.FrequentlySurgicalHistory = [];
            $scope.FrequentlySystemicHistory = [];
            $scope.ROSocularSeverity = [];
            $scope.ROSIsNormalArray = [];
            let tappid = $scope.cacheStorageItem.DoctorID ? $scope.cacheStorageItem.DoctorID : $scope.UserId;
            $scope.HealthPhysicalObj = angular.copy($scope.GetHealthPreAdmAnesthetistObj());
            var allrgireq = {
                "HospitalId": $scope.HospitalId,
                "PageSize": 30,
                "PageNumber": 1,
                "UserId": doctorinfo.doctorid,
                "IsFrequent": "Y"

            };

            //var Req = {
            //    "ParentOrganizationId": $scope.ParenthospitalId,
            //};

            $q.all([
                eHnotePatientDataService.GetUserConsultationMasterTemplateDtls(tappid),
                eHnoteDiagnosisDataServices.GetAllFrequentlyAddedData(allrgireq),
                eHnoteDiagnosisDataServices.GetAllMasterConsultationData(),
                eHnoteSurgeryService.GetPreAdmissionHealthCategories($scope.ParenthospitalId),
                eHnotePatientDataService.GetMedicalHistoriesByPatientId($scope.cacheStorageItem.PatientId),
            ]).then(function (resp) {
                $scope.HealthPhysicalObj.NonSmokerStatus = [];
                $scope.HealthPhysicalObj.SmokingStatus = [];
                $scope.HealthPhysicalObj.AlcoholStatus = [];
                $scope.HealthPhysicalObj.NonAlcoholStatus = [];
                if (resp[0].data.status === "Success") {
                    if (resp[0].data.ROS.length > 0) {
                        $scope.ROSIsNormalArray = [];
                        $scope.ROSIsNormalArray = resp[0].data.ROS || [];
                    }
                }
                if (resp[1].data.Status === "Success") {

                    $scope.FrequentlyAllergyitems = resp[1].data.Allergyitems || [];
                    $scope.FrequentlySurgicalHistory = resp[1].data.SurgicalHistory || [];
                    $scope.FrequentlySystemicHistory = resp[1].data.SystemicHistory || [];
                    $scope.FrequentMedicationsList = resp[1].data.OrganizationFavoriteMedications || [];

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
                    if ($scope.obj.SurgicalHistoryArray.length > 0) {
                        angular.forEach($scope.obj.SurgicalHistoryArray, function (item) {
                            var FreqList = $filter("filter")($scope.FrequentlySurgicalHistory, function (fitem) {
                                return fitem.HistoryId == item.HistoryId;
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
                if (resp[2].data.status === "Success") {
                    $scope.ROSAllergyReactions = resp[2].data.ROSAllergyReactions || [];
                    $scope.ROSAllergySeverity = resp[2].data.ROSAllergySeverity || [];
                    $scope.ROSAllergyStatus = resp[2].data.ROSAllergyStatus || [];
                    $scope.ROSAllergyType = resp[2].data.ROSAllergyType || [];
                    $scope.Relations = resp[2].data.Relations || [];
                    $scope.ROSModifiers = resp[2].data.Modifiers || [];
                    $scope.SmokingStatus = resp[2].data.SmokingStatus || [];
                    $scope.SmokingQuantity = resp[2].data.SmokingQuantity || [];
                    $scope.AlcoholQuantity = resp[2].data.AlcoholQuantity || [];
                    $scope.DrugNames = resp[2].data.DrugNames || [];
                    $scope.DrugQuantity = resp[2].data.DrugQuantity || [];
                    $scope.DrugWhenQuit = resp[2].data.DrugWhenQuit || [];
                    $scope.ROSVaccinationStatus = resp[2].data.VaccinationStatus || [];
                    $scope.MasterSmokingStatus = resp[2].data.SmokingStatus || [];
                    $scope.MasterAlcoholStatus = resp[2].data.AlcoholStatus || [];

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
                   // $scope.HealthPhysicalObj.AlcoholStatus = resp[2].data.AlcoholStatus || [];
                    $scope.HealthPhysicalObj.AlcoholQuantity = resp[2].data.AlcoholQuantity || [];
                   // $scope.HealthPhysicalObj.SmokingStatus = resp[2].data.SmokingStatus || [];
                    $scope.HealthPhysicalObj.SmokingQuantity = resp[2].data.SmokingQuantity || [];
                    $scope.HealthPhysicalObj.DrugNames = resp[2].data.DrugNames || [];
                    if ($scope.HealthPhysicalObj.DrugNames.length > 0) {
                        angular.forEach($scope.HealthPhysicalObj.DrugNames, function (item) {
                            item.Ischecked = false;
                        });
                    }
                    $scope.HealthPhysicalObj.DrugQuantity = resp[2].data.DrugQuantity || [];

                    if (resp[2].data.SmokingStatus.length > 0) {
                        angular.forEach(resp[2].data.SmokingStatus, function (item) {
                            if (item.HistoryHabitsID == 3 || item.HistoryHabitsID == 4) {
                                $scope.HealthPhysicalObj.NonSmokerStatus.push(item);
                            } else {
                                $scope.HealthPhysicalObj.SmokingStatus.push(item);
                            }
                        });
                    }
                    if (resp[2].data.AlcoholStatus.length > 0) {
                        angular.forEach(resp[2].data.AlcoholStatus, function (item) {
                            if (item.HistoryHabitsID == 4 || item.HistoryHabitsID == 6) {
                                $scope.HealthPhysicalObj.NonAlcoholStatus.push(item);
                            } else {
                                $scope.HealthPhysicalObj.AlcoholStatus.push(item);
                            }
                        });
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
                    }


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
                    if (filterAllselect.length === $scope.DrugNames.length) {
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
                if (resp[3].data.status === "Success") {
                    if (resp[3].data.SystemicHistory.length > 0) {
                        $scope.HealthArray = angular.copy(resp[3].data.SystemicHistory) || [];
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
                                "IsNormal": item.IsNormal
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

                $scope.obj.AllergyRemarks = $scope.cacheStorageItem.AllergyRemarks || '';
                $scope.LogObj.AllergyRemarks = $scope.cacheStorageItem.AllergyRemarks || '';
                if ($scope.obj.AllergyRemarks != '') {
                    $scope.obj.AllergyNotesInd = true;
                } else {
                    $scope.obj.AllergyNotesInd = false;
                }

                $scope.obj.SurgicalRemarks = $scope.cacheStorageItem.SurgicalRemarks || '';
                $scope.LogObj.SurgicalRemarks = $scope.cacheStorageItem.SurgicalRemarks || '';
                if ($scope.obj.SurgicalRemarks != '') {
                    $scope.obj.SurgicalNotesInd = true;
                } else {
                    $scope.obj.SurgicalNotesInd = false;
                }

                $scope.obj.CurrentSystemicRemarks = $scope.cacheStorageItem.CurrentSystemicRemarks || '';
                $scope.LogObj.CurrentSystemicRemarks = $scope.cacheStorageItem.CurrentSystemicRemarks || '';
                if ($scope.obj.CurrentSystemicRemarks != '') {
                    $scope.obj.CurrentSystemicNotesInd = true;
                } else {
                    $scope.obj.CurrentSystemicNotesInd = false;
                }

                $scope.obj.CurrentEyeRemarks = $scope.cacheStorageItem.CurrentEyeRemarks || '';
                $scope.LogObj.CurrentEyeRemarks = $scope.cacheStorageItem.CurrentEyeRemarks || '';
                if ($scope.obj.CurrentEyeRemarks != '') {
                    $scope.obj.CurrentEyeNotesInd = true;
                } else {
                    $scope.obj.CurrentEyeNotesInd = false;
                }
                $scope.obj.SystemicHistoryRemarks = $scope.cacheStorageItem.SystemicHistoryRemarks || '';
                $scope.LogObj.SystemicHistoryRemarks = $scope.cacheStorageItem.SystemicHistoryRemarks || '';
                if ($scope.obj.SystemicHistoryRemarks != '') {
                    $scope.obj.SystemicHistoryNotesInd = true;
                } else {
                    $scope.obj.SystemicHistoryNotesInd = false;
                }

                $scope.obj.LifestyleHistoryRemarks = $scope.cacheStorageItem.LifestyleHistoryRemarks || '';
                $scope.LogObj.LifestyleHistoryRemarks = $scope.cacheStorageItem.LifestyleHistoryRemarks || '';
                if ($scope.obj.LifestyleHistoryRemarks != '') {
                    $scope.obj.LifestyleHistoryNotesInd = true;
                } else {
                    $scope.obj.LifestyleHistoryNotesInd = false;
                }


                if ($scope.cacheStorageItem.SystemicHistory.length > 0) {
                    $scope.cacheStorageItem.SystemicHistory = angular.copy($scope.cacheStorageItem.SystemicHistory);
                    if ($scope.cacheStorageItem.SystemicHistory.length > 0) {
                        angular.forEach($scope.cacheStorageItem.SystemicHistory, function (item) {
                            let tempArray = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'HistoryId': item.HistoryId }, true);
                            if (tempArray.length == 0) {
                                $scope.HealthPhysicalObj.SystemicHistoryArray.push(item);
                            }
                        });
                        angular.forEach($scope.cacheStorageItem.SystemicHistory, function (Aitem) {
                            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (Bitem) {
                                if (Aitem.HistoryId == Bitem.HistoryId) {
                                    Bitem.PatientDetailId = Aitem.PatientDetailId;
                                    Bitem.Value = Aitem.Value;
                                    Bitem.StatusId = Aitem.StatusId || 0;
                                    Bitem.SeverityId = Aitem.SeverityId || 0;
                                    Bitem.IsNoshowROS = Aitem.IsNoshowROS || false;
                                    Bitem.Remarks = Aitem.Remarks || '';
                                    Bitem.IsChecked = true;
                                    Aitem.DurationDate = Aitem.DurationDate || null;
                                    Bitem.Duration = Aitem.Duration || '';
                                    Bitem.DurationType = Aitem.DurationType || 'D';
                                    Bitem.ShowDateFormat = true;
                                    if (Aitem.DurationDate != null) {
                                        Bitem.DurationDate = $filter('date')(Aitem.DurationDate, "MM-dd-yyyy");
                                        Bitem.ShowDateFormat = true;
                                    }
                                    if (Bitem.Duration != '') {
                                        Bitem.ShowDateFormat = false;
                                    }
                                    if (Bitem.Remarks != '') {
                                        Bitem.PreAdmOthernotesInd = true;
                                    }

                                    if (Bitem.HistoryId == 166 || Bitem.HistoryId == 127 || Bitem.HistoryId == 132 || Bitem.HistoryId == 20 || Bitem.HistoryId == 59 || Bitem.HistoryId == 33 || Bitem.HistoryId == 41 || Bitem.HistoryId == 67 || Bitem.HistoryId == 70 || Bitem.HistoryId == 74 || Bitem.HistoryId == 78 || Bitem.HistoryId == 90 || Bitem.HistoryId == 95) {
                                        Bitem.IsNoshowROS = true;
                                    }
                                }
                            });
                        });

                        let templest = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 110) || [];
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

                        let templest2 = $scope.HealthPhysicalObj.SystemicHistoryArray.filter((x) => x.HistoryId == 114) || [];
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
                } else {
                    $scope.cacheStorageItem.SystemicHistory = [];
                }
                if ($scope.obj.AllergyItems.length > 0) {
                    angular.forEach($scope.obj.AllergyItems, function (item) {
                        var matchingItem = $scope.FrequentlyAllergyitems.find(function (frequentItem) {
                            return frequentItem.AllergyId === item.AllergyId;
                        });

                        matchingItem = matchingItem || "";
                        if (matchingItem != "") {
                            matchingItem.Onselect = true;
                        }
                    });
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
            
               
              
                if (resp[4].data != undefined) {
                    $scope.PreviousInvestigations = resp[4].data.rows || [];
                    
                 
                }

            });

            if ($scope.RosObj.Type == 'Remarks') {
                $scope.GetMasterCustomAllergyRemarks();

            } else {
                $scope.ROSAllergyReactions = [];
                $scope.ROSAllergySeverity = [];
                $scope.ROSocularSeverity = [];
                $scope.ROSAllergyStatus = [];
                $scope.ROSAllergyType = [];
                $scope.Relations = [];
                $scope.ROSModifiers = [];
                $scope.ROSVaccinationStatus = [];
                $scope.GetAllMasterConsultationData();
                $scope.GetAllUserData();
            }
            $scope.getMasterFieldDosageData();


            var Lifeobject = {
                "HistoryId": 113,
                "HistoryName": 'Life Style History',
                "IsEdit": true,
                "AlcoholStatus": 'N',
                "AlcoholQuantityId": '',
                "SmokingStatusId": '',
                "SmokingQuantityId": '',
                "DrugWhenQuitId": '',
                "DrugQuantityId": '',
                "DrugId": '',
                "Duration": '',
                "DurationDate": '',
                "DurationType": 'D',
                "ShowDateFormat": false,
                "showNutritionalHistory": false,
                "ActiveInd": true,
                "Remarks": "",
                "ShowNote": false,
                "SmokingType": "",
                "AlcoholType": "",
                "DrugType": "",
                "PsychisType": "",
            }
            $scope.obj.LifestyleHistory.push(Lifeobject);

            $scope.LogObj = {
                "UserId": $scope.UserId || null,
                "OrganizationId": $scope.HospitalId || null,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
                "PatientId": $scope.cacheStorageItem.PatientId || null,
                "LogArray": [],



                "AllergyItems": [],
                "SystemicHistory": [],
                "SurgicalHistory": [],
                "CurrentEyeMedications": [],
                "CurrentSystemicMedicationsHistory": [],
                "LifestyleDetail": [],
                "AdmittedBy": 0,
                "SurgeryList": [],
                "AllergyRemarks": "",
                "SurgicalRemarks": "",
                "CurrentSystemicRemarks": "",
                "CurrentEyeRemarks": "",
                "SystemicHistoryRemarks": "",
                "LifestyleHistoryRemarks": "",
                "CardiacNotes": '',
                "NeurologicNotes": '',
                "HepaticNotes": '',
                "HemeOncNotes": '',
                "KidneyDiseaseNotes": '',
                "MusculoSkeletalSystemNotes": '',
                "EndocrineNotes": '',
                "PulmonaryNotes": '',
                "HeentNotes":"",
                "LungsNotes":"",
                "NervousSystemNotes":"",
                "PsychosisNotes":"",
                "OthersNotes":"",
            };


            if ($scope.cacheStorageItem.AllergyItems.length > 0) {
                angular.forEach($scope.cacheStorageItem.AllergyItems, function (item) {
                    item.Remarks = item.AllergyRemarks || item.Remarks;
                });
                $scope.obj.AllergyItems = $scope.cacheStorageItem.AllergyItems || [];

                angular.forEach($scope.obj.AllergyItems, function (item) {
                    item.IsEdit = false;
                    //item.ActiveInd = true;
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
                    item.ShowDateFormat = true;
                    if (item.DurationDate != '') {
                        item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                        item.ShowDateFormat = true;
                    }
                    item.Duration = item.Duration || '';
                    if (item.Duration != '') {
                        item.ShowDateFormat = false;
                    }
                    if (item.DurationType == 'SB') {
                        item.ShowDateFormat = false;
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
                    var FreqList = $filter("filter")($scope.FrequentlyAllergyitems, function (fitem) {
                        return fitem.AllergyId == item.AllergyId;
                    }, true) || [];
                    if (FreqList.length > 0) {
                        FreqList[0].Onselect = true;
                    }

                    if (item.AllergyId === 2) {
                        item.IsNKDAshow = false;
                    } else {
                        item.IsNKDAshow = true;
                    }

                });
                $scope.obj.AllergyItems[0].IsEdit = true;
                $scope.LogObj.AllergyItems = angular.copy($scope.obj.AllergyItems);
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
            if ($scope.cacheStorageItem.SystemicHistory.length > 0) {
                $scope.obj.SystemicHistoryArray = $scope.cacheStorageItem.SystemicHistory || [];
                angular.forEach($scope.obj.SystemicHistoryArray, function (item) {
                    item.IsEdit = false;
                    item.SnomedCodeobj = item.SNOMEDCODE || '';
                    item.IsNoshowROS = item.IsNoshowROS || false;
                    if (item.IsNormal == true && item.IsChecked == true) {
                        item.IsNoshowROS = true;
                    }
                    //item.ActiveInd = true;
                    item.DurationDate = item.DurationDate || '';
                    if (item.DurationDate != '') {
                        item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                        item.ShowDateFormat = true;
                    }
                    item.Remarks = item.Remarks || '';
                    if (item.Remarks != '') {
                        item.ShowNote = true;
                    }


                    if (item.HistoryId === 1) {
                        $scope.obj.isNKSHSelected = true;
                    } else {
                        $scope.obj.isNKSHSelected = false;
                    }
                });
                $scope.obj.SystemicHistoryArray[0].IsEdit = true;

                $scope.LogObj.SystemicHistory = angular.copy($scope.obj.SystemicHistoryArray) || [];
                if ($scope.LogObj.SystemicHistory.length > 0) {
                    angular.forEach($scope.LogObj.SystemicHistory, function (item) {
                        item.IsChecked = true;
                    });
                }
            }
            if ($scope.cacheStorageItem.SurgicalHistory.length > 0) {
                $scope.obj.SurgicalHistoryArray = $scope.cacheStorageItem.SurgicalHistory || [];
                angular.forEach($scope.obj.SurgicalHistoryArray, function (item) {
                    item.IsEdit = false;
                    //item.ActiveInd = true;
                    item.Remarks = item.Remarks || '';
                    item.ShowDateFormat = true;
                    if (item.Remarks != '') {
                        item.ShowNote = true;
                    }
                    item.DurationDate = item.DurationDate || '';
                    if (item.DurationDate != '') {
                        item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                        item.ShowDateFormat = true;
                    }
                    item.Duration = item.Duration || '';
                    if (item.Duration != '') {
                        item.ShowDateFormat = false;
                    }
                    if (item.HistoryId === 1) {
                        $scope.obj.isNKSGHSelected = true;
                    } else {
                        $scope.obj.isNKSGHSelected = false;
                    }
                    var FreqList = $filter("filter")($scope.FrequentlySurgicalHistory, function (fitem) {
                        return fitem.HistoryId == item.HistoryId;
                    }, true) || [];
                    if (FreqList.length > 0) {
                        FreqList[0].Onselect = true;
                    }
                });
                $scope.obj.SurgicalHistoryArray[0].IsEdit = true;

                $scope.LogObj.SurgicalHistory = angular.copy($scope.obj.SurgicalHistoryArray);
            }

            $scope.cacheStorageItem.CurrentEyeMedications = $scope.cacheStorageItem.CurrentEyeMedications || [];
            if ($scope.cacheStorageItem.CurrentEyeMedications.length > 0) {
                angular.forEach($scope.cacheStorageItem.CurrentEyeMedications, function (suitem) {
                    suitem.SigFields = false;
                    suitem.SigFormationFields = false;
                    if (suitem.StartDate != null && suitem.StartDate != undefined && suitem.StartDate != "") {
                        suitem.StartDate = $filter('date')(suitem.StartDate, "MM-dd-yyyy");
                    }
                    if (suitem.StopDate != null && suitem.StopDate != undefined && suitem.StopDate != "") {
                        suitem.StopDate = $filter('date')(suitem.StopDate, "MM-dd-yyyy");
                    }

                });
            }

            $scope.cacheStorageItem.CurrentEyeMedicationArray = $scope.cacheStorageItem.CurrentEyeMedications || [];

            if ($scope.cacheStorageItem.CurrentEyeMedicationArray.length > 0) {
                $scope.obj.CurrentEyeMedicationArray = $scope.cacheStorageItem.CurrentEyeMedicationArray || [];
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

                if ($scope.obj.CurrentEyeMedicationArray.length > 0) {
                    angular.forEach($scope.obj.CurrentEyeMedicationArray, function (item) {

                        item.MedicineObject = item.Sig || "";

                    });
                }
            }

            $scope.cacheStorageItem.CurrentSystemicMedicationsHistory = $scope.cacheStorageItem.CurrentSystemicMedicationsHistory || [];

            if ($scope.cacheStorageItem.CurrentSystemicMedicationsHistory.length > 0) {
                angular.forEach($scope.cacheStorageItem.CurrentSystemicMedicationsHistory, function (suitem) {
                    suitem.SigFields = false;
                    suitem.SigFormationFields = false;
                    if (suitem.StartDate != null && suitem.StartDate != undefined && suitem.StartDate != "") {
                        suitem.StartDate = $filter('date')(suitem.StartDate, "MM-dd-yyyy");
                    }
                    if (suitem.StopDate != null && suitem.StopDate != undefined && suitem.StopDate != "") {
                        suitem.StopDate = $filter('date')(suitem.StopDate, "MM-dd-yyyy");
                    }
                });
            }

            let TempMedicationArray = [];
            if ($scope.cacheStorageItem.CurrentSystemicMedicationsHistory.length > 0) {
                $scope.obj.CurrentSystemicMedicationsHistory = $scope.cacheStorageItem.CurrentSystemicMedicationsHistory || [];
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
                });
                $scope.obj.CurrentSystemicMedicationsHistory[0].IsEdit = true;

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
            if ($scope.cacheStorageItem.LifestyleDetail.length > 0) {
           
                $scope.HealthPhysicalObj.LifestyleHistoryArray = angular.copy($scope.cacheStorageItem.LifestyleDetail);
                $scope.HealthPhysicalObj.LifestyleHistory.Remarks = angular.copy($scope.cacheStorageItem.LifestyleHistoryRemarks) || '';
                    if ($scope.HealthPhysicalObj.LifestyleHistory.Remarks != '') {
                        $scope.HealthPhysicalObj.SocialNotesInd = true;
                }
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
                    let tempobjforlog = angular.copy($scope.HealthPhysicalObj.LifestyleHistoryArray);
                    $scope.LogObj.LifestyleDetail=angular.copy(tempobjforlog);

                }



               
            }

            $scope.HealthPhysicalObj.LifestyleHistory.Remarks = angular.copy($scope.cacheStorageItem.LifestyleHistoryRemarks) || '';
            if ($scope.HealthPhysicalObj.LifestyleHistory.Remarks != '') {
                $scope.HealthPhysicalObj.SocialNotesInd = true;
            }
            if ($scope.cacheStorageItem.SystemicOtherData != undefined) {
                $scope.HealthPhysicalObj.IsCardiacWNL = $scope.cacheStorageItem.SystemicOtherData.IsCardiacWNL || false;
                $scope.HealthPhysicalObj.IsPulmonaryWNL = $scope.cacheStorageItem.SystemicOtherData.IsPulmonaryWNL || false;
                $scope.HealthPhysicalObj.IsHepaticWNL = $scope.cacheStorageItem.SystemicOtherData.IsHepaticWNL || false;
                $scope.HealthPhysicalObj.IsEndocrineWNL = $scope.cacheStorageItem.SystemicOtherData.IsEndocrineWNL || false;
                $scope.HealthPhysicalObj.IsNeurologicWNL = $scope.cacheStorageItem.SystemicOtherData.IsNeurologicWNL || false;
                $scope.HealthPhysicalObj.IsHemeOncWNL = $scope.cacheStorageItem.SystemicOtherData.IsHemeOncWNL || false;
                $scope.HealthPhysicalObj.IsNervousSystemWNL = $scope.cacheStorageItem.SystemicOtherData.IsNervousSystemWNL || false;
                $scope.HealthPhysicalObj.IsKidneyDiseaseWNL = $scope.cacheStorageItem.SystemicOtherData.IsKidneyDiseaseWNL || false;
                $scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL = $scope.cacheStorageItem.SystemicOtherData.IsMusculoSkeletalSystemWNL || false;
                $scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL = $scope.cacheStorageItem.SystemicOtherData.IsAutoImmuneDisordersWNL || false;
                $scope.HealthPhysicalObj.IsPsychosisWNL = $scope.cacheStorageItem.SystemicOtherData.IsPsychosisWNL || false;
                $scope.HealthPhysicalObj.IsOthersWNL = $scope.cacheStorageItem.SystemicOtherData.IsOthersWNL || false;
                $scope.HealthPhysicalObj.IsHeentWNL = $scope.cacheStorageItem.SystemicOtherData.IsHeentWNL || false;
                $scope.HealthPhysicalObj.IsLungsWNL = $scope.cacheStorageItem.SystemicOtherData.IsLungsWNL || false;
                $scope.HealthPhysicalObj.IsGeneralappearanceWNL = $scope.cacheStorageItem.SystemicOtherData.IsGeneralappearanceWNL || false;

                $scope.HealthPhysicalObj.OtherDataId = $scope.cacheStorageItem.SystemicOtherData.OtherDataId || 0;


                $scope.HealthPhysicalObj.CardiacNotes = cacheStorageItem.SystemicOtherData.CardiacNotes || '';
                $scope.LogObj.CardiacNotes = cacheStorageItem.SystemicOtherData.CardiacNotes || '';
                if ($scope.HealthPhysicalObj.CardiacNotes !== '') {
                    $scope.HealthPhysicalObj.showCardiacNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showCardiacNotes = false;
                }

                $scope.HealthPhysicalObj.NeurologicNotes = cacheStorageItem.SystemicOtherData.NeurologicNotes || '';
                $scope.LogObj.NeurologicNotes = cacheStorageItem.SystemicOtherData.NeurologicNotes || '';
                if ($scope.HealthPhysicalObj.NeurologicNotes !== '') {
                    $scope.HealthPhysicalObj.showNeurologicNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showNeurologicNotes = false;
                }

                $scope.HealthPhysicalObj.GeneralAppearenceNotes = cacheStorageItem.SystemicOtherData.GeneralAppearenceNotes || '';
                if ($scope.HealthPhysicalObj.GeneralAppearenceNotes !== '') {
                    $scope.HealthPhysicalObj.showGeneralAppearenceNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showGeneralAppearenceNotes = false;
                }

                $scope.HealthPhysicalObj.HeentNotes = cacheStorageItem.SystemicOtherData.HeentNotes || '';
                $scope.LogObj.HeentNotes = cacheStorageItem.SystemicOtherData.HeentNotes || '';
                if ($scope.HealthPhysicalObj.HeentNotes !== '') {
                    $scope.HealthPhysicalObj.showHeentNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showHeentNotes = false;
                }

                $scope.HealthPhysicalObj.LungsNotes = cacheStorageItem.SystemicOtherData.LungsNotes || '';
                $scope.LogObj.LungsNotes = cacheStorageItem.SystemicOtherData.LungsNotes || '';
                if ($scope.HealthPhysicalObj.LungsNotes !== '') {
                    $scope.HealthPhysicalObj.showLungsNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showLungsNotes = false;
                }

                $scope.HealthPhysicalObj.PulmonaryNotes = cacheStorageItem.SystemicOtherData.PulmonaryNotes || '';
                $scope.LogObj.PulmonaryNotes = cacheStorageItem.SystemicOtherData.PulmonaryNotes || '';
                if ($scope.HealthPhysicalObj.PulmonaryNotes !== '') {
                    $scope.HealthPhysicalObj.showPulmonaryNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showPulmonaryNotes = false;
                }

                $scope.HealthPhysicalObj.HepaticNotes = cacheStorageItem.SystemicOtherData.HepaticNotes || '';
                $scope.LogObj.HepaticNotes = cacheStorageItem.SystemicOtherData.HepaticNotes || '';
                if ($scope.HealthPhysicalObj.HepaticNotes !== '') {
                    $scope.HealthPhysicalObj.showHepaticNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showHepaticNotes = false;
                }

                $scope.HealthPhysicalObj.HemeOncNotes = cacheStorageItem.SystemicOtherData.HemeOncNotes || '';
                $scope.LogObj.HemeOncNotes = cacheStorageItem.SystemicOtherData.HemeOncNotes || '';
                if ($scope.HealthPhysicalObj.HemeOncNotes !== '') {
                    $scope.HealthPhysicalObj.showHemeOncNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showHemeOncNotes = false;
                }

                $scope.HealthPhysicalObj.NervousSystemNotes = cacheStorageItem.SystemicOtherData.NervousSystemNotes || '';
                $scope.LogObj.NervousSystemNotes = cacheStorageItem.SystemicOtherData.NervousSystemNotes || '';
                if ($scope.HealthPhysicalObj.NervousSystemNotes !== '') {
                    $scope.HealthPhysicalObj.showNervousSystemNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showNervousSystemNotes = false;
                }
                $scope.HealthPhysicalObj.EndocrineNotes = cacheStorageItem.SystemicOtherData.EndocrineNotes || '';
                $scope.LogObj.EndocrineNotes = cacheStorageItem.SystemicOtherData.EndocrineNotes || '';
                if ($scope.HealthPhysicalObj.EndocrineNotes !== '') {
                    $scope.HealthPhysicalObj.showEndocrineNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showEndocrineNotes = false;
                }

                $scope.HealthPhysicalObj.KidneyDiseaseNotes = cacheStorageItem.SystemicOtherData.KidneyDiseaseNotes || '';
                $scope.LogObj.KidneyDiseaseNotes = cacheStorageItem.SystemicOtherData.KidneyDiseaseNotes || '';
                if ($scope.HealthPhysicalObj.KidneyDiseaseNotes !== '') {
                    $scope.HealthPhysicalObj.showKidneyDiseaseNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showKidneyDiseaseNotes = false;
                }

                $scope.HealthPhysicalObj.MusculoSkeletalSystemNotes = cacheStorageItem.SystemicOtherData.MusculoSkeletalSystemNotes || '';
                $scope.LogObj.MusculoSkeletalSystemNotes = cacheStorageItem.SystemicOtherData.MusculoSkeletalSystemNotes || '';
                if ($scope.HealthPhysicalObj.MusculoSkeletalSystemNotes !== '') {
                    $scope.HealthPhysicalObj.showMusculoSkeletalSystemNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showMusculoSkeletalSystemNotes = false;
                }
                $scope.HealthPhysicalObj.PsychosisNotes = cacheStorageItem.SystemicOtherData.PsychosisNotes || '';
                $scope.LogObj.PsychosisNotes = cacheStorageItem.SystemicOtherData.PsychosisNotes || '';
                if ($scope.HealthPhysicalObj.PsychosisNotes !== '') {
                    $scope.HealthPhysicalObj.showPsychosisNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showPsychosisNotes = false;
                }

                $scope.HealthPhysicalObj.OthersNotes = cacheStorageItem.SystemicOtherData.OthersNotes || '';
                $scope.LogObj.OthersNotes = cacheStorageItem.SystemicOtherData.OthersNotes || '';
                if ($scope.HealthPhysicalObj.OthersNotes !== '') {
                    $scope.HealthPhysicalObj.showOthersNotes = true;
                } else {
                    $scope.HealthPhysicalObj.showOthersNotes = false;
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
        }
        $scope.init();



        $scope.ChangeRositem = function (type) {
            $scope.RosObj.Type = type;
            $scope.FocusObj = GetFocusObj();
        }
        $scope.closeshowROSpopupadding = function () {
            $uibModalInstance.dismiss("cancel");
        };
        $scope.ChangeItem = function (item) {
            item.ShowDateFormat = !item.ShowDateFormat;
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



        function GetFocusObj() {
            var obj = {

                "AllergiesFocus": false,
                "CurrentTreatmentFocus": false,
                "MedicalHistoryFocus": false,
                "BirthHistoryFocus": false,
                "SystemicHistoryFocus": false,
                "VaccinationHistoryFocus": false,
                "FunctionalStatusHistoryFocus": false,
                "CurrentSystemicMedicationsHistoryFocus": false,
                "OcularSurgicalHistoryFocus": false,
                "SurgicalHistoryFocus": false,
                "NutritionalHistoryFocus": false,
                "FamilyHistoryFocus": false,
                "ImmunisationHistoryFocus": false,
                "OcularHistoryFocus": false,
                "LifestyleHistoryFocus": false,
                "MenstrualHistoryFocus": false,

            }
            return obj;
        }
        $scope.FocusObj = GetFocusObj();

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

        /*Allergy */
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

                    } else {
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
            //var List = $filter("filter")($scope.ROSAllergyReactions, function (Aitem, index) { return Aitem.ROSAllergiesID === item.ReactionId });
            if (List.length > 0) {
                item.ReactionName = List[0].AllergyReaction;
            } else {
                item.ReactionName = "";
            }

        }
        $scope.changeAllergySeverity = function (item) {
            var List = $filter("filter")($scope.ROSAllergySeverity, { "ROSAllergySeverityId": item.SeverityId }, true);
            if (List.length > 0) {
                item.SeverityName = List[0].AllergySeverity;
            } else {
                item.SeverityName = "";
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

        $scope.GetDiagnosisEasyList = function (val) {
            var object = {
                "LevelType": 'O',
                "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID,
                "UserId": doctorinfo.doctorid,
                "SpecializationId": $scope.SpecializationId,
                "SearchText": val,
                "PageSize": 10,
                "PageNumber": 1,
                "Type": '',
                "ParentOrganizationId": $scope.ParenthospitalId || null,
            };
            return eHnoteSettingsDataService.GetMasterDiagnosis(object).then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.DiagnosisList !== undefined) {
                        $scope.obj.AddDiagnosis = false;
                        return response.data.DiagnosisList.map(function (item) {
                            return item;
                        });
                    } else {
                        $scope.obj.AddDiagnosis = true;
                    }
                } else {
                    $scope.obj.AddDiagnosis = false;
                    if (val != '') {
                        $scope.obj.AddDiagnosis = true;
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
                            $scope.obj.SelectedAllergyItem.IsNKDAshow = true;
                            $scope.obj.SelectedAllergyItem.ShowDateFormat = true;
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

        //$scope.compareAllergyItems = function () {
        //    $scope.obj.AllergyItems = $scope.obj.AllergyItems || [];
        //    $scope.LogObj.AllergyItems = $scope.LogObj.AllergyItems || [];
        //    let count = 0;
        //    let allergyNames = '';
        //    let dltcount = 0;
        //    let dltallergyNames = '';
        //    angular.forEach($scope.obj.AllergyItems, function (item) {
        //        if (item.DeleteInd == 'Y') {
        //            if (dltcount > 0) {
        //                dltallergyNames += ', ';
        //            }
        //            dltallergyNames += item.AllergyName;
        //            dltcount++;
        //        } else {
        //            var edited = $scope.LogObj.AllergyItems.filter(function (eitem) {
        //                return ((eitem.AllergyId == item.AllergyId) && (eitem.ReactionId == item.ReactionId) && (eitem.StatusId == item.StatusId) && (eitem.DurationDate == item.DurationDate) && (eitem.SeverityId == item.SeverityId) && (eitem.Duration == item.Duration) && (eitem.AllergyTypeId == item.AllergyTypeId) && (eitem.Remarks == item.Remarks));
        //            }) || [];


        //            if (edited.length == 0) {
        //                if (count > 0) {
        //                    allergyNames += ', ';
        //                }
        //                allergyNames += item.AllergyName;
        //                count++;
        //            }
        //        }

        //    });

        //    if (count != 0) {
        //        let description = '';
        //        if (count === 1) {
        //            description = `Allergy - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        } else {
        //            description = `Allergies - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        }
        //        let obj = {
        //            "LogId": 0,
        //            "ModuleId": $scope.ModeuleId || 0,
        //            "ModuleName": $scope.ModuleName || '',
        //            "SubModuleId": 14,
        //            "SubModuleName": "ROS",
        //            "ScreenType": "Quick Access ROS",
        //            "ActionType": "Edited",
        //            "ActionDescription": description,
        //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
        //        };
        //        $scope.LogObj.LogArray.push(obj);
        //    }

        //    if (dltcount != 0) {
        //        let description = '';
        //        if (dltcount === 1) {
        //            description = `Allergy - ${dltallergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        } else {
        //            description = `Allergies - ${dltallergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        }
        //        let obj = {
        //            "LogId": 0,
        //            "ModuleId": $scope.ModeuleId || 0,
        //            "ModuleName": $scope.ModuleName || '',
        //            "SubModuleId": 14,
        //            "SubModuleName": "ROS",
        //            "ScreenType": "Quick Access ROS",
        //            "ActionType": "Deleted",
        //            "ActionDescription": description,
        //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
        //        };
        //        $scope.LogObj.LogArray.push(obj);
        //    }

        //}

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
                if (userOldAllergies.length === 0 && OldAffecteditem === '') {
                    actionType = 'Added';
                }
                let obj = {
                    "LogId": 0,
                    "ModuleId": $scope.ModeuleId || 0,
                    "ModuleName": $scope.ModuleName || '',
                    "SubModuleId": 14,
                    "SubModuleName": "ROS",
                    "ScreenType": "Quick Access ROS(Allergies)",
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
                    "ModuleId": $scope.ModeuleId || 0,
                    "ModuleName": $scope.ModuleName || '',
                    "SubModuleId": 14,
                    "SubModuleName": "ROS",
                    "ScreenType": "Quick Acces ROS(Allergies)",
                    "ActionType": "Deleted",
                    "OldActionDescription": description,
                    "NewActionDescription": '',
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        };


        //$scope.compareSurgicalHistory = function () {
        //    $scope.obj.SurgicalHistoryArray = $scope.obj.SurgicalHistoryArray || [];
        //    $scope.LogObj.SurgicalHistory = $scope.LogObj.SurgicalHistory || [];
        //    let count = 0;
        //    let allergyNames = '';
        //    let dltcount = 0;
        //    let dltallergyNames = '';
        //    angular.forEach($scope.obj.SurgicalHistoryArray, function (item) {
        //        if (item.DeleteInd == 'Y') {
        //            if (dltcount > 0) {
        //                dltallergyNames += ', ';
        //            }
        //            dltallergyNames += item.HistoryName;
        //            dltcount++;

        //        } else {
        //            var edited = $scope.LogObj.SurgicalHistory.filter(function (eitem) {
        //                return ((eitem.HistoryId == item.HistoryId) && (eitem.ModifierId == item.ModifierId) && (eitem.DurationDate == item.DurationDate) && (eitem.Duration == item.Duration) && (eitem.Remarks == item.Remarks));
        //            }) || [];



        //            if (edited.length == 0) {
        //                if (count > 0) {
        //                    allergyNames += ', ';
        //                }
        //                allergyNames += item.HistoryName;
        //                count++;
        //            }
        //        }

        //    });

        //    if (count != 0) {
        //        let description = '';
        //        if (count === 1) {
        //            description = `SurgicalHistory - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        } else {
        //            description = `SurgicalHistory - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        }
        //        let obj = {
        //            "LogId": 0,
        //            "ModuleId": $scope.ModeuleId || 0,
        //            "ModuleName": $scope.ModuleName || '',
        //            "SubModuleId": 14,
        //            "SubModuleName": "ROS",
        //            "ScreenType": "Quick Access ROS",
        //            "ActionType": "Edited",
        //            "ActionDescription": description,
        //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
        //        };
        //        $scope.LogObj.LogArray.push(obj);
        //    }

        //    if (dltcount != 0) {
        //        let description = '';
        //        if (dltcount === 1) {
        //            description = `SurgicalHistory - ${dltallergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        } else {
        //            description = `SurgicalHistory - ${dltallergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        }
        //        let obj = {
        //            "LogId": 0,
        //            "ModuleId": $scope.ModeuleId || 0,
        //            "ModuleName": $scope.ModuleName || '',
        //            "SubModuleId": 14,
        //            "SubModuleName": "ROS",
        //            "ScreenType": "Quick Access ROS",
        //            "ActionType": "Deleted",
        //            "ActionDescription": description,
        //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
        //        };
        //        $scope.LogObj.LogArray.push(obj);
        //    }
        //}

        $scope.compareSurgicalHistory = function () {
            $scope.obj.SurgicalHistoryArray = $scope.obj.SurgicalHistoryArray || [];
            $scope.LogObj.SurgicalHistory = $scope.LogObj.SurgicalHistory || [];
            const userOldSurgical = $filter("filter")($scope.LogObj.SurgicalHistory, { "CreatedBy": $scope.UserId }, true) || [];
            let count = 0;
            let dltcount = 0;
            let dltallergyNames = '';
            let DifferenceItem = [];

            angular.forEach($scope.obj.SurgicalHistoryArray, function (item) {
                item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy") || null;
                item.DurationType = item.DurationType || '';
                item.Duration = item.Duration || '';
                item.Remarks = item.Remarks || '';
                if (item.DeleteInd === 'Y') {
                    if (dltcount > 0) dltallergyNames += ', ';
                    dltallergyNames += item.HistoryName;
                    dltcount++;
                } else {
                    let edited = $scope.LogObj.SurgicalHistory.filter(function (eitem) {
                        eitem.DurationDate = $filter('date')(eitem.DurationDate, "MM-dd-yyyy") || null;
                        eitem.DurationType = eitem.DurationType || '';
                        eitem.Duration = eitem.Duration || '';
                        eitem.Remarks = eitem.Remarks || '';
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

                    let newLine = `SurgicalHistory: ${itemA.HistoryName}`;

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
                    "ModuleId": $scope.ModeuleId || 0,
                    "ModuleName": $scope.ModuleName || '',
                    "SubModuleId": 14,
                    "SubModuleName": "ROS",
                    "ScreenType": "Quick Acces ROS(SurgicalHistory)",
                    "ActionType": actionType,
                    "OldActionDescription": userOldSurgical.length > 0 ? OldAffecteditem.trim() : '',
                    "NewActionDescription": Affecteditem.trim(),
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }

            if (dltcount != 0) {
                let description = (dltcount === 1)
                    ? `SurgicalHistory - ${dltallergyNames.toUpperCase()}`
                    : `SurgicalHistory - ${dltallergyNames.toUpperCase()}`;
                let obj = {
                    "LogId": 0,
                    "ModuleId": $scope.ModeuleId || 0,
                    "ModuleName": $scope.ModuleName || '',
                    "SubModuleId": 14,
                    "SubModuleName": "ROS",
                    "ScreenType": "Quick Acces ROS(SurgicalHistory)",
                    "ActionType": "Deleted",
                    "OldActionDescription": description,
                    "NewActionDescription": '',
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }
        }

        //$scope.compareCurrentSystemicMedicationsHistory = function (CurrentSystemicMedications) {
        //    CurrentSystemicMedications = CurrentSystemicMedications || [];
        //    $scope.LogObj.CurrentSystemicMedicationsHistory = $scope.LogObj.CurrentSystemicMedicationsHistory || [];
        //    let count = 0, allergyNames = '';
        //    let dltcount = 0;
        //    let dltallergyNames = '';
        //    angular.forEach(CurrentSystemicMedications, function (item) {
        //        let Sig = '', dltSig = '';
        //        if (item.DeleteInd == 'Y') {
        //            item.Sig = item.Sig || '';
        //            if (item.Sig != '') {
        //                dltSig = ' Sig:' + item.Sig;
        //            }
        //            if (dltcount > 0) {
        //                dltallergyNames += ', ';
        //            }
        //            dltallergyNames += item.MedicineName + dltSig;
        //            dltcount++;

        //        } else {
        //            item.Sig = item.Sig || '';
        //            item.StartDate = $filter('date')(item.StartDate, 'MM-dd-yyyy') || null;
        //            var edited = $scope.LogObj.CurrentSystemicMedicationsHistory.filter(function (eitem) {
        //                eitem.StartDate = $filter('date')(eitem.StartDate, 'MM-dd-yyyy') || null;
        //                eitem.Sig = eitem.Sig || '';
        //                return ((eitem.MedicineId == item.MedicineId)
        //                    && (eitem.ActionId == item.ActionId) && (eitem.DaysSupplyId == item.DaysSupplyId) && (eitem.DoseId == item.DoseId) && (eitem.DoseOtherId == item.DoseOtherId)
        //                    && (eitem.FrequencyId == item.FrequencyId) && (eitem.RouteId == item.RouteId) && (eitem.StartDate == item.StartDate) && (eitem.Sig == item.Sig));
        //            }) || [];

        //            if (item.Sig != '') {
        //                Sig = ' Sig:' + item.Sig;
        //            }

        //            if (edited.length == 0) {
        //                if (count > 0) {
        //                    allergyNames += ', ';
        //                }
        //                allergyNames += item.MedicineName + Sig;
        //                count++;
        //            }
        //        }
        //    });

        //    if (count != 0) {
        //        let description = '';
        //        if (count === 1) {
        //            description = `Current Systemic Medications - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        } else {
        //            description = `Current Systemic Medications - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        }
        //        let obj = {
        //            "LogId": 0,
        //            "ModuleId": $scope.ModeuleId || 0,
        //            "ModuleName": $scope.ModuleName || '',
        //            "SubModuleId": 14,
        //            "SubModuleName": "ROS",
        //            "ScreenType": "Quick Access ROS",
        //            "ActionType": "Edited",
        //            "ActionDescription": description,
        //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
        //        };
        //        $scope.LogObj.LogArray.push(obj);
        //    }

        //    if (dltcount != 0) {
        //        let description = '';
        //        if (dltcount === 1) {
        //            description = `Current Systemic Medications - ${dltallergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        } else {
        //            description = `Current Systemic Medications - ${dltallergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        }
        //        let obj = {
        //            "LogId": 0,
        //            "ModuleId": $scope.ModeuleId || 0,
        //            "ModuleName": $scope.ModuleName || '',
        //            "SubModuleId": 14,
        //            "SubModuleName": "ROS",
        //            "ScreenType": "Quick Access ROS",
        //            "ActionType": "Deleted",
        //            "ActionDescription": description,
        //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
        //        };
        //        $scope.LogObj.LogArray.push(obj);
        //    }

        //}

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
                    ModuleId: $scope.ModeuleId || 0,
                    ModuleName: $scope.ModuleName || '',
                    SubModuleId: 14,
                    SubModuleName: "ROS",
                    ScreenType: "Quick Access ROS(Current Systemic Medications)",
                    ActionType: actionType,
                    OldActionDescription: userOldCurrentSystemicMedication.length > 0 ? oldDesc : '',
                    NewActionDescription: newDesc,
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                });
            }

            // Log Deleted items
            if (deletedItems.length > 0) {
                let delDesc = 'Current Systemic Medications - ' + deletedItems.map(i => i.toUpperCase()).join(', ');

                $scope.LogObj.LogArray.push({
                    LogId: 0,
                    ModuleId: $scope.ModeuleId || 0,
                    ModuleName: $scope.ModuleName || '',
                    SubModuleId: 14,
                    SubModuleName: "ROS",
                    ScreenType: "Quick Access ROS(Current Systemic Medications)",
                    ActionType: "Deleted",
                    OldActionDescription: delDesc,
                    NewActionDescription: '',
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                });
            }
        };



        //$scope.compareCurrentEyeMedications = function (CurrentEyeMedications) {
        //    CurrentEyeMedications = CurrentEyeMedications || [];
        //    $scope.LogObj.CurrentEyeMedications = $scope.LogObj.CurrentEyeMedications || [];
        //    let count = 0, allergyNames = '';
        //    let dltcount = 0;
        //    let dltallergyNames = '';
        //    angular.forEach(CurrentEyeMedications, function (item) {
        //        let Sig = '', dltSig = '';
        //        if (item.DeleteInd == 'Y') {
        //            item.Sig = item.Sig || '';
        //            if (item.Sig != '') {
        //                dltSig = ' Sig:' + item.Sig;
        //            }
        //            if (dltcount > 0) {
        //                dltallergyNames += ', ';
        //            }
        //            dltallergyNames += item.MedicineName + dltSig;
        //            dltcount++;

        //        } else {
        //            item.Sig = item.Sig || '';
        //            item.StartDate = $filter('date')(item.StartDate, 'MM-dd-yyyy') || null;
        //            var edited = $scope.LogObj.CurrentEyeMedications.filter(function (eitem) {
        //                eitem.Sig = eitem.Sig || '';
        //                eitem.StartDate = $filter('date')(eitem.StartDate, 'MM-dd-yyyy') || null;
        //                return ((eitem.MedicineId == item.MedicineId)
        //                    && (eitem.ActionId == item.ActionId) && (eitem.DaysSupplyId == item.DaysSupplyId) && (eitem.DoseId == item.DoseId) && (eitem.DoseOtherId == item.DoseOtherId)
        //                    && (eitem.FrequencyId == item.FrequencyId) && (eitem.RouteId == item.RouteId) && (eitem.StartDate == item.StartDate) && (eitem.Sig == item.Sig));
        //            }) || [];

        //            if (item.Sig != '') {
        //                Sig = ' Sig:' + item.Sig;
        //            }

        //            if (edited.length == 0) {
        //                if (count > 0) {
        //                    allergyNames += ', ';
        //                }
        //                allergyNames += item.MedicineName + Sig;
        //                count++;
        //            }
        //        }


        //    });

        //    if (count != 0) {
        //        let description = '';
        //        if (count === 1) {
        //            description = `Current Eye Medication - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        } else {
        //            description = `Current Eye Medication - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        }
        //        let obj = {
        //            "LogId": 0,
        //            "ModuleId": $scope.ModeuleId || 0,
        //            "ModuleName": $scope.ModuleName || '',
        //            "SubModuleId": 14,
        //            "SubModuleName": "ROS",
        //            "ScreenType": "Quick Access ROS",
        //            "ActionType": "Edited",
        //            "ActionDescription": description,
        //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
        //        };
        //        $scope.LogObj.LogArray.push(obj);
        //    }

        //    if (dltcount != 0) {
        //        let description = '';
        //        if (dltcount === 1) {
        //            description = `Current Eye Medication - ${dltallergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        } else {
        //            description = `Current Eye Medication - ${dltallergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        }
        //        let obj = {
        //            "LogId": 0,
        //            "ModuleId": $scope.ModeuleId || 0,
        //            "ModuleName": $scope.ModuleName || '',
        //            "SubModuleId": 14,
        //            "SubModuleName": "ROS",
        //            "ScreenType": "Quick Access ROS",
        //            "ActionType": "Deleted",
        //            "ActionDescription": description,
        //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
        //        };
        //        $scope.LogObj.LogArray.push(obj);
        //    }
        //}

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
                    ModuleId: $scope.ModeuleId || 0,
                    ModuleName: $scope.ModuleName || '',
                    SubModuleId: 14,
                    SubModuleName: "ROS",
                    ScreenType: "Quick Access ROS(Current Eye Medication)",
                    ActionType: actionType,
                    OldActionDescription: userOldCurrentEyeMedications.length > 0 ? oldDesc : '',
                    NewActionDescription: newDesc,
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                });
            }

            // Add Deleted log
            if (deletedItems.length > 0) {
                let delDesc = 'Current Eye Medication - ' + deletedItems.map(i => i.toUpperCase()).join(', ');
                $scope.LogObj.LogArray.push({
                    LogId: 0,
                    ModuleId: $scope.ModeuleId || 0,
                    ModuleName: $scope.ModuleName || '',
                    SubModuleId: 14,
                    SubModuleName: "ROS",
                    ScreenType: "Quick Access ROS(Current Eye Medication)",
                    ActionType: "Deleted",
                    OldActionDescription: delDesc,
                    NewActionDescription: '',
                    ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                });
            }
        };


        //$scope.compareLifestyle = function () {
        //    $scope.HealthPhysicalObj.LifestyleHistoryArray = $scope.HealthPhysicalObj.LifestyleHistoryArray || [];
        //    $scope.LogObj.LifestyleDetail = $scope.LogObj.LifestyleDetail || [];


        //    let count = 0;
        //    let smokinglist = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
        //        return item.DeleteInd == 'N' && item.HistoryId == 1;
        //    }) || [];

        //    let logsmokinglist = $filter("filter")($scope.LogObj.LifestyleDetail, function (item) {
        //        return item.DeleteInd == 'N' && item.HistoryId == 1;
        //    }) || [];

        //    let alcohollist = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
        //        return item.DeleteInd == 'N' && item.HistoryId == 2;
        //    }) || [];

        //    let logalcohollist = $filter("filter")($scope.LogObj.LifestyleDetail, function (item) {
        //        return item.DeleteInd == 'N' && item.HistoryId == 2;
        //    }) || [];

        //    let druglist = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
        //        return item.DeleteInd == 'N' && item.HistoryId == 3;
        //    }) || [];

        //    let logdruglist = $filter("filter")($scope.LogObj.LifestyleDetail, function (item) {
        //        return item.DeleteInd == 'N' && item.HistoryId == 3;
        //    }) || [];

        //    let psychislist = $filter("filter")($scope.HealthPhysicalObj.LifestyleHistoryArray, function (item) {
        //        return item.DeleteInd == 'N' && item.HistoryId == 4;
        //    }) || [];

        //    let logpsychislist = $filter("filter")($scope.LogObj.LifestyleDetail, function (item) {
        //        return item.DeleteInd == 'N' && item.HistoryId == 4;
        //    }) || [];

        //    if (alcohollist.length > 0) {
        //        if (logalcohollist.length == 0) {
        //            count++;
        //        } else {
        //            if (alcohollist[0].AlcoholType != logalcohollist[0].AlcoholType) {
        //                count++;
        //            }
        //        }
        //    }
        //    if (druglist.length > 0) {
        //        if (logdruglist.length == 0) {
        //            count++;
        //        } else {
        //            if (druglist[0].DrugType != logdruglist[0].DrugType) {
        //                count++;
        //            }
        //        }
        //    }
        //    if (psychislist.length > 0) {
        //        if (logpsychislist.length == 0) {
        //            count++;
        //        } else {
        //            if (psychislist[0].PsychisType != logpsychislist[0].PsychisType) {
        //                count++;
        //            }
        //        }
        //    }
        //    if (smokinglist.length > 0) {
        //        if (logsmokinglist.length == 0) {
        //            count++;
        //        } else {
        //            if (smokinglist[0].SmokingType != logsmokinglist[0].SmokingType) {
        //                count++;
        //            }
        //        }
        //    }
        //    if (alcohollist.length > 0 && logalcohollist.length > 0) {
        //        if (alcohollist[0].AlcoholType == 'Yes') {
        //            alcohollist[0].AlcoholDuration = alcohollist[0].AlcoholDuration || "";
        //            logalcohollist[0].AlcoholDuration = logalcohollist[0].AlcoholDuration || "";
        //            alcohollist[0].AlcoholStatusId = alcohollist[0].AlcoholStatusId || null;
        //            logalcohollist[0].AlcoholStatusId = logalcohollist[0].AlcoholStatusId || null;

        //            alcohollist[0].AlcoholDurationDate = alcohollist[0].AlcoholDurationDate || null;
        //            logalcohollist[0].AlcoholDurationDate = logalcohollist[0].AlcoholDurationDate || null;

        //            if (alcohollist[0].AlcoholDurationDate !== null) {
        //                alcohollist[0].AlcoholDurationDate = $filter('date')(alcohollist[0].AlcoholDurationDate, "MM-dd-yyyy");
        //            }
        //            if (logalcohollist[0].AlcoholDurationDate !== null) {
        //                logalcohollist[0].AlcoholDurationDate = $filter('date')(logalcohollist[0].AlcoholDurationDate, "MM-dd-yyyy");
        //            }


        //            if ((alcohollist[0].AlcoholDurationDate != logalcohollist[0].AlcoholDurationDate) || (alcohollist[0].AlcoholQuantityId != logalcohollist[0].AlcoholQuantityId) || (alcohollist[0].AlcoholDuration != logalcohollist[0].AlcoholDuration) || (alcohollist[0].AlcoholStatusId != logalcohollist[0].AlcoholStatusId)) {
        //                count++;
        //            }
        //        }
        //    }
        //    if (druglist.length > 0 && logdruglist.length > 0) {
        //        if (druglist[0].DrugType == 'Yes') {
        //            druglist[0].DrugArray = druglist[0].DrugArray || [];
        //            let saveddrug = druglist[0].DrugArray || [];
        //            let editdrugarray = logdruglist[0].DrugArray || [];
        //            if (saveddrug.length > 0) {
        //                angular.forEach(saveddrug, function (sitem) {
        //                    var edited = editdrugarray.filter(function (eitem) {
        //                        return ((eitem.HistoryHabitsId == sitem.HistoryHabitsId) && (sitem.ActiveInd == eitem.ActiveInd));
        //                    }) || [];
        //                    if (edited.length == 0) {
        //                        count++;
        //                    }
        //                })

        //            }

        //            druglist[0].DrugDurationDate = druglist[0].DrugDurationDate || null;
        //            logdruglist[0].DrugDurationDate = logdruglist[0].DrugDurationDate || null;

        //            if (druglist[0].DrugDurationDate !== null) {
        //                druglist[0].DrugDurationDate = $filter('date')(druglist[0].DrugDurationDate, "MM-dd-yyyy");
        //            }
        //            if (logdruglist[0].DrugDurationDate !== null) {
        //                logdruglist[0].DrugDurationDate = $filter('date')(logdruglist[0].DrugDurationDate, "MM-dd-yyyy");
        //            }
        //            druglist[0].DrugDuration = druglist[0].DrugDuration || 0;
        //            logdruglist[0].DrugDuration = logdruglist[0].DrugDuration || 0;

        //            if ((druglist[0].DrugDurationDate != logdruglist[0].DrugDurationDate) || (druglist[0].DrugDuration != logdruglist[0].DrugDuration) || (druglist[0].DrugQuantityId != logdruglist[0].DrugQuantityId)) {
        //                count++;
        //            }
        //        }
        //    }
        //    if (smokinglist.length > 0 && logsmokinglist.length > 0) {
        //        if (smokinglist[0].SmokingType == 'Yes') {
        //            smokinglist[0].SmokingQuantityId = smokinglist[0].SmokingQuantityId || null;
        //            logsmokinglist[0].SmokingQuantityId = logsmokinglist[0].SmokingQuantityId || null;

        //            smokinglist[0].DeleteInd = smokinglist[0].DeleteInd || 'N';
        //            logsmokinglist[0].DeleteInd = logsmokinglist[0].DeleteInd || 'N';

        //            smokinglist[0].SmokingStatusId = smokinglist[0].SmokingStatusId || null;
        //            logsmokinglist[0].SmokingStatusId = logsmokinglist[0].SmokingStatusId || null;

        //            smokinglist[0].SmokingFromDate = smokinglist[0].SmokingFromDate || null;
        //            logsmokinglist[0].SmokingFromDate = logsmokinglist[0].SmokingFromDate || null;

        //            if (smokinglist[0].SmokingFromDate !== null) {
        //                smokinglist[0].SmokingFromDate = $filter('date')(smokinglist[0].SmokingFromDate, "MM-dd-yyyy");
        //            }
        //            if (logsmokinglist[0].SmokingFromDate !== null) {
        //                logsmokinglist[0].SmokingFromDate = $filter('date')(logsmokinglist[0].SmokingFromDate, "MM-dd-yyyy");
        //            }

        //            smokinglist[0].SmokingDuration = smokinglist[0].SmokingDuration || '';
        //            logsmokinglist[0].SmokingDuration = logsmokinglist[0].SmokingDuration || '';

        //            if ((logsmokinglist[0].SmokingQuantityId !== smokinglist[0].SmokingQuantityId) || (smokinglist[0].DeleteInd !== logsmokinglist[0].DeleteInd) || (smokinglist[0].SmokingStatusId !== logsmokinglist[0].SmokingStatusId) || (smokinglist[0].SmokingFromDate !== logsmokinglist[0].SmokingFromDate) || (smokinglist[0].SmokingDuration !== logsmokinglist[0].SmokingDuration)) {
        //                count++;
        //            }

        //        }
        //        if (smokinglist[0].SmokingType == 'No') {
        //            smokinglist[0].DeleteInd = smokinglist[0].DeleteInd || 'N';
        //            logsmokinglist[0].DeleteInd = logsmokinglist[0].DeleteInd || 'N';

        //            smokinglist[0].SmokingStatusId = smokinglist[0].SmokingStatusId || null;
        //            logsmokinglist[0].SmokingStatusId = logsmokinglist[0].SmokingStatusId || null;

        //            smokinglist[0].SmokingFromDate = smokinglist[0].SmokingFromDate || null;
        //            logsmokinglist[0].SmokingFromDate = logsmokinglist[0].SmokingFromDate || null;
        //            if (smokinglist[0].SmokingFromDate !== null) {
        //                smokinglist[0].SmokingFromDate = $filter('date')(smokinglist[0].SmokingFromDate, "MM-dd-yyyy");
        //            }
        //            if (logsmokinglist[0].SmokingFromDate !== null) {
        //                logsmokinglist[0].SmokingFromDate = $filter('date')(logsmokinglist[0].SmokingFromDate, "MM-dd-yyyy");
        //            }

        //            smokinglist[0].SmokingDuration = smokinglist[0].SmokingDuration || '';
        //            logsmokinglist[0].SmokingDuration = logsmokinglist[0].SmokingDuration || '';

        //            if ((smokinglist[0].DeleteInd !== logsmokinglist[0].DeleteInd) || (smokinglist[0].SmokingStatusId !== logsmokinglist[0].SmokingStatusId) || (smokinglist[0].SmokingFromDate !== logsmokinglist[0].SmokingFromDate) || (smokinglist[0].SmokingDuration !== logsmokinglist[0].SmokingDuration)) {
        //                count++;
        //            }
        //        }
        //    }


        //    if (count != 0) {
        //        let obj = {
        //            "LogId": 0,
        //            "ModuleId": 2,
        //            "ModuleName": "ASC",
        //            "SubModuleId": 9,
        //            "SubModuleName": "Pre-Op",
        //            "ScreenType": "Pre-Op Anesthesia",
        //            "ActionType": "Edited",
        //            "ActionDescription": `Lifestyle History In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
        //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
        //        };
        //        $scope.LogObj.LogArray.push(obj);
        //    }

        //}


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
                        //if (alcohollist[0].HistoryName) newparts.push('HistoryName :' + alcohollist[0].HistoryName);
                        //if (logalcohollist[0].HistoryName) oldparts.push('HistoryName :' + logalcohollist[0].HistoryName);


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

                        //if (alcohollist[0].HistoryName) newparts.push('HistoryName :' + alcohollist[0].HistoryName);
                        //if (logalcohollist[0].HistoryName) oldparts.push('HistoryName :' + logalcohollist[0].HistoryName);


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

                        //if (druglist[0].HistoryName) newparts.push('HistoryName :' + druglist[0].HistoryName);
                        //if (logdruglist[0].HistoryName) oldparts.push('HistoryName :' + logdruglist[0].HistoryName);


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

                        if (addedDrugs.length > 0) {
                            newparts.push("Drugs Added: " + addedDrugs.join(', '));
                        }
                        if (removedDrugs.length > 0) {
                            oldparts.push("Drugs Removed: " + removedDrugs.join(', '));
                        }
                        if (updatedNewDrugs.length > 0) {
                            newparts.push("Drugs: " + updatedNewDrugs.join(', '));
                        }
                        if (updatedOldDrugs.length > 0) {
                            oldparts.push("Drugs: " + updatedOldDrugs.join(', '));
                        }
                        DrugData = newparts.join(', ');
                        logDrugData = oldparts.join(', ');

                        //if (druglist[0].HistoryName) newparts.push('HistoryName :' + druglist[0].HistoryName);
                        //if (logdruglist[0].HistoryName) oldparts.push('HistoryName :' + logdruglist[0].HistoryName);


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
            if (druglist.length == 0 && logdruglist.length > 0) {
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

                        //if (smokinglist[0].HistoryName) newparts.push('HistoryName :' + smokinglist[0].HistoryName);
                        //if (logsmokinglist[0].HistoryName) oldparts.push('HistoryName :' + logsmokinglist[0].HistoryName);


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

                    if ((smokinglist[0].SmokingType != logsmokinglist[0].SmokingType) || (smokinglist[0].DeleteInd !== logsmokinglist[0].DeleteInd) || (smokinglist[0].SmokingStatusId !== logsmokinglist[0].SmokingStatusId) || (smokinglist[0].SmokingFromDate !== logsmokinglist[0].SmokingFromDate) || (smokinglist[0].SmokingDuration !== logsmokinglist[0].SmokingDuration)) {
                        count++;
                        var newparts = [];
                        var oldparts = [];

                        //if (smokinglist[0].HistoryName) newparts.push('HistoryName :' + smokinglist[0].HistoryName);
                        //if (logsmokinglist[0].HistoryName) oldparts.push('HistoryName :' + logsmokinglist[0].HistoryName);


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
                    //if (psychislist[0].HistoryName) newparts.push('HistoryName :' + psychislist[0].HistoryName);
                    //if (logpsychislist[0].HistoryName) oldparts.push('HistoryName :' + logpsychislist[0].HistoryName);


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
                    "ModuleId": $scope.ModeuleId || 0,
                    "ModuleName": $scope.ModuleName || '',
                    "SubModuleId": 14,
                    "SubModuleName": "ROS",
                    "ScreenType": "Quick Access ROS(Social)",
                    "ActionType": ActionType,
                    "OldActionDescription": oldvalue,
                    "NewActionDescription": newvalue,
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }

        }


        //$scope.compareSystemicHistory = function (Addedsystmic) {
        //    Addedsystmic = Addedsystmic || [];
        //    $scope.LogObj.SystemicHistory = $scope.LogObj.SystemicHistory || [];
        //    let count = 0, allergyNames = '';
        //    let dltcount = 0;
        //    let dltallergyNames = '';
        //    angular.forEach(Addedsystmic, function (item) {
        //        if (item.DeleteInd == 'Y') {
        //            if (dltcount > 0) {
        //                dltallergyNames += ', ';
        //            }
        //            dltallergyNames += item.HistoryName;
        //            dltcount++;

        //        } else {
        //            item.DurationDate = item.DurationDate || null;
        //            var edited = $scope.LogObj.SystemicHistory.filter(function (eitem) {
        //                eitem.DurationDate = eitem.DurationDate || null;
        //                return ((eitem.HistoryId == item.HistoryId) && (eitem.SeverityId == item.SeverityId) && (eitem.StatusId == item.StatusId) && (eitem.TypeId == item.TypeId) && (eitem.IsChecked == item.IsChecked) && (eitem.Remarks == item.Remarks) && (eitem.DurationDate == item.DurationDate));
        //            }) || [];


        //            if (edited.length == 0) {
        //                if (count > 0) {
        //                    allergyNames += ', ';
        //                }
        //                allergyNames += item.HistoryName;
        //                count++;
        //            }
        //        }
        //    });

        //    if (count != 0) {
        //        let description;
        //        if (count === 1) {
        //            description = `Past Medical History - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        } else {
        //            description = `Past Medical History - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        }
        //        let obj = {
        //            "LogId": 0,
        //            "ModuleId": $scope.ModeuleId || 0,
        //            "ModuleName": $scope.ModuleName || '',
        //            "SubModuleId": 14,
        //            "SubModuleName": "ROS",
        //            "ScreenType": "Quick Access ROS",
        //            "ActionType": "Edited",
        //            "ActionDescription": description,
        //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
        //        };
        //        $scope.LogObj.LogArray.push(obj);
        //    }

        //    if (dltcount != 0) {
        //        let description = '';
        //        if (dltcount === 1) {
        //            description = `Past Medical History - ${dltallergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        } else {
        //            description = `Past Medical History - ${dltallergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
        //        }
        //        let obj = {
        //            "LogId": 0,
        //            "ModuleId": $scope.ModeuleId || 0,
        //            "ModuleName": $scope.ModuleName || '',
        //            "SubModuleId": 14,
        //            "SubModuleName": "ROS",
        //            "ScreenType": "Quick Access ROS",
        //            "ActionType": "Deleted",
        //            "ActionDescription": description,
        //            "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
        //        };
        //        $scope.LogObj.LogArray.push(obj);
        //    }

        //}

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
                item.Duration = item.Duration || '';
                if (item.DeleteInd === 'Y') {
                    if (dltcount > 0) dltallergyNames += ', ';
                    dltallergyNames += item.HistoryName;
                    dltcount++;
                } else {
                    let edited = $scope.LogObj.SystemicHistory.filter(function (eitem) {
                        eitem.DurationDate = $filter('date')(eitem.DurationDate, 'MM-dd-yyyy') || null;
                        eitem.SeverityId = eitem.SeverityId || null;
                        eitem.Duration = eitem.Duration || '';
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
                    count++;
                }
                if ($scope.HealthPhysicalObj.PulmonaryNotes != $scope.LogObj.PulmonaryNotes) {
                    if ($scope.HealthPhysicalObj.PulmonaryNotes)
                        Affecteditem += `, Pulmonary Notes: ${$scope.HealthPhysicalObj.PulmonaryNotes}`;
                    if ($scope.LogObj.PulmonaryNotes)
                        OldAffecteditem += `, Pulmonary Notes: ${$scope.LogObj.PulmonaryNotes}`;
                    count++;
                }
                if ($scope.HealthPhysicalObj.NeurologicNotes != $scope.LogObj.NeurologicNotes) {
                    if ($scope.HealthPhysicalObj.NeurologicNotes)
                        Affecteditem += `, Neurologic Notes: ${$scope.HealthPhysicalObj.NeurologicNotes}`;
                    if ($scope.LogObj.NeurologicNotes)
                        OldAffecteditem += `, Neurologic Notes: ${$scope.LogObj.NeurologicNotes}`;
                }
                if ($scope.HealthPhysicalObj.HepaticNotes != $scope.LogObj.HepaticNotes) {
                    if ($scope.HealthPhysicalObj.HepaticNotes)
                        Affecteditem += `, Hepatic Notes: ${$scope.HealthPhysicalObj.HepaticNotes}`;
                    if ($scope.LogObj.HepaticNotes)
                        OldAffecteditem += `, Hepatic Notes: ${$scope.LogObj.HepaticNotes}`;
                    count++;
                }
                if ($scope.HealthPhysicalObj.HemeOncNotes != $scope.LogObj.HemeOncNotes) {
                    if ($scope.HealthPhysicalObj.HemeOncNotes)
                        Affecteditem += `, Heme One Notes: ${$scope.HealthPhysicalObj.HemeOncNotes}`;
                    if ($scope.LogObj.HemeOncNotes)
                        OldAffecteditem += `, Heme One Notes: ${$scope.LogObj.HemeOncNotes}`;
                    count++;
                }
                if ($scope.HealthPhysicalObj.KidneyDiseaseNotes != $scope.LogObj.KidneyDiseaseNotes) {
                    if ($scope.HealthPhysicalObj.KidneyDiseaseNotes)
                        Affecteditem += `, Kidney Disease Notes: ${$scope.HealthPhysicalObj.KidneyDiseaseNotes}`;
                    if ($scope.LogObj.KidneyDiseaseNotes)
                        OldAffecteditem += `, Kidney Disease Notes: ${$scope.LogObj.KidneyDiseaseNotes}`;
                    count++;
                }
                if ($scope.HealthPhysicalObj.MusculoSkeletalSystemNotes != $scope.LogObj.MusculoSkeletalSystemNotes) {
                    if ($scope.HealthPhysicalObj.MusculoSkeletalSystemNotes)
                        Affecteditem += `, Musculoskeletal Notes: ${$scope.HealthPhysicalObj.MusculoSkeletalSystemNotes}`;
                    if ($scope.LogObj.MusculoSkeletalSystemNotes)
                        OldAffecteditem += `, Musculoskeletal Notes: ${$scope.LogObj.MusculoSkeletalSystemNotes}`;
                    count++;
                }
                if ($scope.HealthPhysicalObj.EndocrineNotes != $scope.LogObj.EndocrineNotes) {
                    if ($scope.HealthPhysicalObj.EndocrineNotes)
                        Affecteditem += `, Endocrine Notes: ${$scope.HealthPhysicalObj.EndocrineNotes}`;
                    if ($scope.LogObj.EndocrineNotes)
                        OldAffecteditem += `, Endocrine Notes: ${$scope.LogObj.EndocrineNotes}`;
                    count++
                }
                let actionType = 'Edited';
                if (userOldSystemicHistory.length === 0 && OldAffecteditem === '') {
                    actionType = 'Added';
                }
                if (count != 0) {
                    let obj = {
                        "LogId": 0,
                        "ModuleId": 2,
                        "ModuleName": "ASC",
                        "SubModuleId": 3,
                        "SubModuleName": "ROS",
                        "ScreenType": "Quick Access ROS(Past Medical History)",
                        "ActionType": actionType,
                        "OldActionDescription": userOldSystemicHistory.length > 0 ? OldAffecteditem.trim() : '',
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
                    "ScreenType": "Quick Access ROS(Past Medical History)",
                    "ActionType": "Deleted",
                    "OldActionDescription": description,
                    "NewActionDescription": '',
                    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                };
                $scope.LogObj.LogArray.push(obj);
            }

        }
        $scope.obj.IsClickSaveAscRosBtn = false;
        $scope.SaveRosData = function () {
            $scope.LogObj.LogArray = [];
            $scope.obj.type = "RosHistory";
            $scope.obj.SystemicOtherData = {};
            if ($scope.obj.SystemicOtherData != undefined) {
                $scope.obj.SystemicOtherData.IsCardiacWNL = $scope.HealthPhysicalObj.IsCardiacWNL || false;
                $scope.obj.SystemicOtherData.IsPulmonaryWNL = $scope.HealthPhysicalObj.IsPulmonaryWNL || false;
                $scope.obj.SystemicOtherData.IsHepaticWNL = $scope.HealthPhysicalObj.IsHepaticWNL || false;
                $scope.obj.SystemicOtherData.IsEndocrineWNL = $scope.HealthPhysicalObj.IsEndocrineWNL || false;
                $scope.obj.SystemicOtherData.IsNeurologicWNL = $scope.HealthPhysicalObj.IsNeurologicWNL || false;
                $scope.obj.SystemicOtherData.IsHemeOncWNL = $scope.HealthPhysicalObj.IsHemeOncWNL || false;
                $scope.obj.SystemicOtherData.IsNervousSystemWNL = $scope.HealthPhysicalObj.IsNervousSystemWNL || false;
                $scope.obj.SystemicOtherData.IsKidneyDiseaseWNL = $scope.HealthPhysicalObj.IsKidneyDiseaseWNL || false;
                $scope.obj.SystemicOtherData.IsMusculoSkeletalSystemWNL = $scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL || false;
                $scope.obj.SystemicOtherData.IsAutoImmuneDisordersWNL = $scope.HealthPhysicalObj.IsAutoImmuneDisordersWNL || false;
                $scope.obj.SystemicOtherData.IsPsychosisWNL = $scope.HealthPhysicalObj.IsPsychosisWNL || false;
                $scope.obj.SystemicOtherData.IsOthersWNL = $scope.HealthPhysicalObj.IsOthersWNL || false;
                $scope.obj.SystemicOtherData.IsHeentWNL = $scope.HealthPhysicalObj.IsHeentWNL || false;
                $scope.obj.SystemicOtherData.IsLungsWNL = $scope.HealthPhysicalObj.IsLungsWNL || false;
                $scope.obj.SystemicOtherData.IsGeneralappearanceWNL = $scope.HealthPhysicalObj.IsGeneralappearanceWNL || false;

                $scope.obj.SystemicOtherData.OtherDataId = $scope.HealthPhysicalObj.OtherDataId || 0;


                $scope.obj.SystemicOtherData.CardiacNotes = $scope.HealthPhysicalObj.CardiacNotes || '';
                if ($scope.obj.SystemicOtherData.CardiacNotes !== '') {
                    $scope.obj.SystemicOtherData.showCardiacNotes = true;
                } else {
                    $scope.obj.SystemicOtherData.showCardiacNotes = false;
                }


                $scope.obj.SystemicOtherData.NeurologicNotes = $scope.HealthPhysicalObj.NeurologicNotes || '';
                if ($scope.obj.SystemicOtherData.NeurologicNotes !== '') {
                    $scope.obj.SystemicOtherData.showNeurologicNotes = true;
                } else {
                    $scope.obj.SystemicOtherData.showNeurologicNotes = false;
                }

                $scope.obj.SystemicOtherData.GeneralAppearenceNotes = $scope.HealthPhysicalObj.GeneralAppearenceNotes || '';
                if ($scope.obj.SystemicOtherData.GeneralAppearenceNotes !== '') {
                    $scope.obj.SystemicOtherData.showGeneralAppearenceNotes = true;
                } else {
                    $scope.obj.SystemicOtherData.showGeneralAppearenceNotes = false;
                }

                $scope.obj.SystemicOtherData.HeentNotes = $scope.HealthPhysicalObj.HeentNotes || '';
                if ($scope.obj.SystemicOtherData.HeentNotes !== '') {
                    $scope.obj.SystemicOtherData.showHeentNotes = true;
                } else {
                    $scope.obj.SystemicOtherData.showHeentNotes = false;
                }

                $scope.obj.SystemicOtherData.LungsNotes = $scope.HealthPhysicalObj.LungsNotes || '';
                if ($scope.obj.SystemicOtherData.LungsNotes !== '') {
                    $scope.obj.SystemicOtherData.showLungsNotes = true;
                } else {
                    $scope.obj.SystemicOtherData.showLungsNotes = false;
                }

                $scope.obj.SystemicOtherData.PulmonaryNotes = $scope.HealthPhysicalObj.PulmonaryNotes || '';
                if ($scope.obj.SystemicOtherData.PulmonaryNotes !== '') {
                    $scope.obj.SystemicOtherData.showPulmonaryNotes = true;
                } else {
                    $scope.obj.SystemicOtherData.showPulmonaryNotes = false;
                }

                $scope.obj.SystemicOtherData.HepaticNotes = $scope.HealthPhysicalObj.HepaticNotes || '';
                if ($scope.obj.SystemicOtherData.HepaticNotes !== '') {
                    $scope.obj.SystemicOtherData.showHepaticNotes = true;
                } else {
                    $scope.obj.SystemicOtherData.showHepaticNotes = false;
                }

                $scope.obj.SystemicOtherData.HemeOncNotes = $scope.HealthPhysicalObj.HemeOncNotes || '';
                if ($scope.obj.SystemicOtherData.HemeOncNotes !== '') {
                    $scope.obj.SystemicOtherData.showHemeOncNotes = true;
                } else {
                    $scope.obj.SystemicOtherData.showHemeOncNotes = false;
                }

                $scope.obj.SystemicOtherData.NervousSystemNotes = $scope.HealthPhysicalObj.NervousSystemNotes || '';
                if ($scope.obj.SystemicOtherData.NervousSystemNotes !== '') {
                    $scope.obj.SystemicOtherData.showNervousSystemNotes = true;
                } else {
                    $scope.obj.SystemicOtherData.showNervousSystemNotes = false;
                }
                $scope.obj.SystemicOtherData.EndocrineNotes = $scope.HealthPhysicalObj.EndocrineNotes || '';
                if ($scope.obj.SystemicOtherData.EndocrineNotes !== '') {
                    $scope.obj.SystemicOtherData.showEndocrineNotes = true;
                } else {
                    $scope.obj.SystemicOtherData.showEndocrineNotes = false;
                }

                $scope.obj.SystemicOtherData.KidneyDiseaseNotes = $scope.HealthPhysicalObj.KidneyDiseaseNotes || '';
                if ($scope.obj.SystemicOtherData.KidneyDiseaseNotes !== '') {
                    $scope.obj.SystemicOtherData.showKidneyDiseaseNotes = true;
                } else {
                    $scope.obj.SystemicOtherData.showKidneyDiseaseNotes = false;
                }

                $scope.obj.SystemicOtherData.MusculoSkeletalSystemNotes = $scope.HealthPhysicalObj.MusculoSkeletalSystemNotes || '';
                if ($scope.obj.SystemicOtherData.MusculoSkeletalSystemNotes !== '') {
                    $scope.obj.SystemicOtherData.showMusculoSkeletalSystemNotes = true;
                } else {
                    $scope.obj.SystemicOtherData.showMusculoSkeletalSystemNotes = false;
                }
                $scope.obj.SystemicOtherData.PsychosisNotes = $scope.HealthPhysicalObj.PsychosisNotes || '';
                if ($scope.obj.SystemicOtherData.PsychosisNotes !== '') {
                    $scope.obj.SystemicOtherData.showPsychosisNotes = true;
                } else {
                    $scope.obj.SystemicOtherData.showPsychosisNotes = false;
                }

                $scope.obj.SystemicOtherData.OthersNotes = $scope.HealthPhysicalObj.OthersNotes || '';
                if ($scope.obj.SystemicOtherData.OthersNotes !== '') {
                    $scope.obj.SystemicOtherData.showOthersNotes = true;
                } else {
                    $scope.obj.SystemicOtherData.showOthersNotes = false;
                }

            }
            if ($scope.IsComingfrm == 'Admin') {
                $scope.obj.SystemicHistoryArray = angular.copy($scope.HealthPhysicalObj.SystemicHistoryArray) || [];
                $scope.obj.LifestyleHistory = angular.copy($scope.HealthPhysicalObj.LifestyleHistoryArray) || [];
                $scope.obj.LifestyleHistoryRemarks = angular.copy($scope.HealthPhysicalObj.LifestyleHistory.Remarks) || '';
                $scope.obj.SystemicOtherData = angular.copy($scope.HealthPhysicalObj) || {};
                $uibModalInstance.close($scope.obj);
                return false;
            }
            if ($scope.IsComingfrm == 'Preop') {
                $scope.obj.SystemicHistoryArray = angular.copy($scope.HealthPhysicalObj.SystemicHistoryArray) || [];
                $scope.obj.LifestyleHistory = angular.copy($scope.HealthPhysicalObj.LifestyleHistoryArray) || [];
                $scope.obj.LifestyleHistoryRemarks = angular.copy($scope.HealthPhysicalObj.LifestyleHistory.Remarks) || '';
                $scope.obj.SystemicOtherData = angular.copy($scope.HealthPhysicalObj) || {};
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

            //let rossubmitreq = {
            //    "UserId": $scope.cacheStorageItem.UserId || null,
            //    "HospitalId": $scope.cacheStorageItem.HospitalId || null,
            //    "PatientId": $scope.cacheStorageItem.PatientId || null,
            //    "AppointmentId": $scope.cacheStorageItem.AppointmentId || null,
            //    "AllergyItems": $scope.obj.AllergyItems || [],
            //    "SystemicHistory": $scope.obj.SystemicHistoryArray || [],
            //    "SurgicalHistory": $scope.obj.SurgicalHistoryArray || [],
            //    "CurrentSystemicMedicationsList": $scope.obj.CurrentSystemicMedicationsHistory || [],
            //    "CurrentEyeMedicationsList": $scope.obj.CurrentEyeMedicationArray || [],
            //    "ROSOverAllRemarks": $scope.obj.ROSOverAllRemarks || ""
            //};

            let TypeId = null;
            let TypeName = "";
            if (ScreenObj.TypeId != null) {
                TypeId = ScreenObj.TypeId;
            }
            if (ScreenObj.TypeName != null) {
                TypeName = ScreenObj.TypeName;
            }
            $scope.HealthPhysicalObj.LifestyleHistoryArray = $scope.HealthPhysicalObj.LifestyleHistoryArray || [];
         


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
                //"SystemicHistory": $scope.obj.SystemicHistoryArray || [],
                "SystemicHistory": [],
                "SurgicalHistory": $scope.obj.SurgicalHistoryArray || [],
                "CurrentSystemicMedicationsHistory": $scope.obj.CurrentSystemicMedicationsHistory || [],
                //"OccularHistory": $scope.obj.OccularHistoryArray || [],
                //"OcularSurgicalHistory": $scope.obj.OcularSurgicalHistoryArray || [],// hiding ocular and ocular surgery changes 
                "MedicalConditions": $scope.obj.CurrentEyeMedicationArray || [],
                "LifestyleHistory": $scope.HealthPhysicalObj.LifestyleHistoryArray || [],
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
                "CardiacNotes": $scope.HealthPhysicalObj.CardiacNotes || "",
                "NeurologicNotes": $scope.HealthPhysicalObj.NeurologicNotes || "",
                "GeneralAppearenceNotes": $scope.HealthPhysicalObj.GeneralAppearenceNotes || '',
                "HeentNotes": $scope.HealthPhysicalObj.HeentNotes || "",
                "LungsNotes": $scope.HealthPhysicalObj.LungsNotes || "",
                "PulmonaryNotes": $scope.HealthPhysicalObj.PulmonaryNotes || "",
                "HepaticNotes": $scope.HealthPhysicalObj.HepaticNotes || "",
                "EndocrineNotes": $scope.HealthPhysicalObj.EndocrineNotes || "",
                "HemeOncNotes": $scope.HealthPhysicalObj.HemeOncNotes || "",
                "NervousSystemNotes": $scope.HealthPhysicalObj.NervousSystemNotes || "",
                "KidneyDiseaseNotes": $scope.HealthPhysicalObj.KidneyDiseaseNotes || "",
                "MusculoSkeletalSystemNotes": $scope.HealthPhysicalObj.MusculoSkeletalSystemNotes || "",
                "PsychosisNotes": $scope.HealthPhysicalObj.PsychosisNotes || "",
                "OthersNotes": $scope.HealthPhysicalObj.OthersNotes || "",
                "OtherDataId": $scope.HealthPhysicalObj.OtherDataId || 0,
                "Logs": {},
                "AllergyRemarks": $scope.obj.AllergyRemarks || "",
                "SurgicalRemarks": $scope.obj.SurgicalRemarks || "",
                "CurrentSystemicRemarks": $scope.obj.CurrentSystemicRemarks || "",
                "CurrentEyeRemarks": $scope.obj.CurrentEyeRemarks || "",
                "SystemicHistoryRemarks": $scope.obj.SystemicHistoryRemarks || "",
                "LifestyleHistoryRemarks": $scope.HealthPhysicalObj.LifestyleHistory.Remarks || "",

            }

            if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                    if (item.IsNormal == true && item.IsChecked == true) {
                        item.IsNoshowROS = true;
                    }
                    item.PatientDetailId = item.PatientDetailId || 0;
                    item.TypeId = item.TypeId || null;
                    if (item.PatientDetailId != 0 && item.IsChecked == false && (item.TypeId == 1 || item.TypeId == 2 || item.TypeId == 3 || item.TypeId == 4 || item.TypeId == 5 || item.TypeId == 6 || item.TypeId == 7 || item.TypeId == 8 || item.TypeId == 9 || item.TypeId == 10 || item.TypeId == 11 || item.TypeId == 12 || item.TypeId == 16 || item.TypeId == 17 || item.TypeId == 21 || item.TypeId == 22 || item.TypeId == 18)) {
                        item.DeleteInd = "Y";
                    }
                });
            }
            if ($scope.HealthPhysicalObj.SystemicHistoryArray.length > 0) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                    if (item.HistoryId == 166 && $scope.HealthPhysicalObj.GeneralAppearenceNotes == '') {
                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = "Y";
                        } else {
                            item.IsChecked = false;
                        }
                    }
                    if (item.HistoryId == 127 && $scope.HealthPhysicalObj.HeentNotes == '') {
                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = "Y";
                        } else {
                            item.IsChecked = false;
                        }
                    }
                    if (item.HistoryId == 132 && $scope.HealthPhysicalObj.LungsNotes == '') {
                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = "Y";
                        } else {
                            item.IsChecked = false;
                        }
                    }
                    if (item.HistoryId == 20 && $scope.HealthPhysicalObj.CardiacNotes == '') {
                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = "Y";
                        } else {
                            item.IsChecked = false;
                        }
                    }
                    if (item.HistoryId == 59 && $scope.HealthPhysicalObj.NeurologicNotes == '') {
                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = "Y";
                        } else {
                            item.IsChecked = false;
                        }
                    }
                    if (item.HistoryId == 33 && $scope.HealthPhysicalObj.PulmonaryNotes == '') {
                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = "Y";
                        } else {
                            item.IsChecked = false;
                        }
                    }
                    if (item.HistoryId == 41 && $scope.HealthPhysicalObj.HepaticNotes == '') {
                        67
                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = "Y";
                        } else {
                            item.IsChecked = false;
                        }
                    }
                    if (item.HistoryId == 67 && $scope.HealthPhysicalObj.HemeOncNotes == '') {
                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = "Y";
                        } else {
                            item.IsChecked = false;
                        }
                    }
                    if (item.HistoryId == 70 && $scope.HealthPhysicalObj.NervousSystemNotes == '') {
                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = "Y";
                        } else {
                            item.IsChecked = false;
                        }
                    }
                    if (item.HistoryId == 74 && $scope.HealthPhysicalObj.KidneyDiseaseNotes == '') {
                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = "Y";
                        } else {
                            item.IsChecked = false;
                        }
                    }
                    if (item.HistoryId == 78 && $scope.HealthPhysicalObj.MusculoSkeletalSystemNotes == '') {
                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = "Y";
                        } else {
                            item.IsChecked = false;
                        }
                    }
                    if (item.HistoryId == 90 && $scope.HealthPhysicalObj.PsychosisNotes == '') {
                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = "Y";
                        } else {
                            item.IsChecked = false;
                        }
                    }
                    if (item.HistoryId == 95 && $scope.HealthPhysicalObj.OthersNotes == '') {
                        if (item.PatientDetailId != 0) {
                            item.DeleteInd = "Y";
                        } else {
                            item.IsChecked = false;
                        }
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
                        "ModuleId": $scope.ModeuleId || 0,
                        "ModuleName": $scope.ModuleName || '',
                        "SubModuleId": 14,
                        "SubModuleName": "Ros",
                        "ScreenType": "Quick Access ROS(Allergies)",
                        "ActionType": "Added",
                        "OldActionDescription": '',
                        "NewActionDescription": description.trim(),
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);

                    //let allergyNames = rossubmitreq.AllergyItems.map(function (item) {
                    //    return item.AllergyName;
                    //}).join(',');
                    //let description = '';
                    //if (rossubmitreq.AllergyItems.length > 1) {
                    //    description = `Allergies - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
                    //} else if (rossubmitreq.AllergyItems.length === 1) {
                    //    description = `Allergy - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
                    //}
                    //let obj = {
                    //    "LogId": 0,
                    //    "ModuleId": $scope.ModeuleId || 0,
                    //    "ModuleName": $scope.ModuleName || '',
                    //    "SubModuleId": 14,
                    //    "SubModuleName": "ROS",
                    //    "ScreenType": "Quick Access ROS",
                    //    "ActionType": "Added",
                    //    "ActionDescription": description,
                    //    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    //};
                    //$scope.LogObj.LogArray.push(obj);
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
                        description = `SurgicalHistory - ${AllergyDetails.toUpperCase()}`;
                    } else if (rossubmitreq.SurgicalHistory.length === 1) {
                        description = `SurgicalHistory - ${AllergyDetails.toUpperCase()}`;
                    }
                    let obj = {
                        "LogId": 0,
                        "ModuleId": $scope.ModeuleId || 0,
                        "ModuleName": $scope.ModuleName || '',
                        "SubModuleId": 14,
                        "SubModuleName": "ROS",
                        "ScreenType": "Quick Access ROS(SurgicalHistory)",
                        "ActionType": "Added",
                        "OldActionDescription": '',
                        "NewActionDescription": description,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);



                    //let allergyNames = rossubmitreq.SurgicalHistory.map(function (item) {
                    //    return item.HistoryName;
                    //}).join(',');

                    //// Create log object for each allergy item
                    //let description = '';
                    //if (rossubmitreq.SurgicalHistory.length > 1) {
                    //    description = `SurgicalHistory - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
                    //} else if (rossubmitreq.SurgicalHistory.length === 1) {
                    //    description = `SurgicalHistory - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
                    //}
                    //let obj = {
                    //    "LogId": 0,
                    //    "ModuleId": $scope.ModeuleId || 0,
                    //    "ModuleName": $scope.ModuleName || '',
                    //    "SubModuleId": 14,
                    //    "SubModuleName": "ROS",
                    //    "ScreenType": "Quick Access ROS",
                    //    "ActionType": "Added",
                    //    "ActionDescription": description,
                    //    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    //};
                    //$scope.LogObj.LogArray.push(obj);
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
                        ModuleId: $scope.ModeuleId || 0,
                        ModuleName: $scope.ModuleName || '',
                        SubModuleId: 14,
                        SubModuleName: "ROS",
                        ScreenType: "Quick Access ROS(Current Systemic Medications)",
                        ActionType: "Added",
                        OldActionDescription: '',
                        NewActionDescription: description,
                        ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);


                    //let allergyNames = tempCurrentSystemicMedicationsHistory.map(function (item) {
                    //    let medicineInfo = item.MedicineName;
                    //    item.Sig = item.Sig || '';
                    //    if (item.Sig !== '') {
                    //        medicineInfo += ' Sig:' + item.Sig;
                    //    }
                    //    return medicineInfo;
                    //}).join(',');

                    //// Create log object for each allergy item
                    //let description = '';
                    //if (tempCurrentSystemicMedicationsHistory.length > 1) {
                    //    description = `Current Systemic Medications - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
                    //} else if (tempCurrentSystemicMedicationsHistory.length === 1) {
                    //    description = `Current Systemic Medications - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
                    //}
                    //let obj = {
                    //    "LogId": 0,
                    //    "ModuleId": $scope.ModeuleId || 0,
                    //    "ModuleName": $scope.ModuleName || '',
                    //    "SubModuleId": 14,
                    //    "SubModuleName": "ROS",
                    //    "ScreenType": "Quick Access ROS",
                    //    "ActionType": "Added",
                    //    "ActionDescription": description,
                    //    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    //};
                    //$scope.LogObj.LogArray.push(obj);
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
                        ModuleId: $scope.ModeuleId || 0,
                        ModuleName: $scope.ModuleName || '',
                        SubModuleId: 14,
                        SubModuleName: "ROS",
                        ScreenType: "Quick Access ROS(Current Eye Medications)",
                        ActionType: "Added",
                        OldActionDescription: '',
                        NewActionDescription: description,
                        ActionDateTime: $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);

                    //let allergyNames = tempCurrentEyeMedicationsList.map(function (item) {
                    //    let medicineInfo = item.MedicineName;
                    //    item.Sig = item.Sig || '';
                    //    if (item.Sig !== '') {
                    //        medicineInfo += ' Sig:' + item.Sig;
                    //    }
                    //    return medicineInfo;
                    //}).join(',');
                    //let description;
                    //if (tempCurrentEyeMedicationsList.length > 1) {
                    //    description = `Current Eye Medications - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
                    //} else if (tempCurrentEyeMedicationsList.length === 1) {
                    //    description = `Current Eye Medications - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
                    //}
                    //let obj = {
                    //    "LogId": 0,
                    //    "ModuleId": $scope.ModeuleId || 0,
                    //    "ModuleName": $scope.ModuleName || '',
                    //    "SubModuleId": 14,
                    //    "SubModuleName": "ROS",
                    //    "ScreenType": "Quick Access ROS",
                    //    "ActionType": "Added",
                    //    "ActionDescription": description,
                    //    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    //};
                    //$scope.LogObj.LogArray.push(obj);
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
                    if ($scope.HealthPhysicalObj.CardiacNotes != $scope.LogObj.CardiacNotes) {
                        if ($scope.HealthPhysicalObj.CardiacNotes)
                            AllergyDetails += `, Cardiac Notes: ${$scope.HealthPhysicalObj.CardiacNotes}`;
                    }
                    if ($scope.HealthPhysicalObj.PulmonaryNotes != $scope.LogObj.PulmonaryNotes) {
                        if ($scope.HealthPhysicalObj.PulmonaryNotes)
                            AllergyDetails += `,Pulmonary Notes: ${$scope.HealthPhysicalObj.PulmonaryNotes}`;
                    }
                    if ($scope.HealthPhysicalObj.NeurologicNotes != $scope.LogObj.NeurologicNotes) {
                        if ($scope.HealthPhysicalObj.NeurologicNotes)
                            AllergyDetails += `, Neurologic Notes: ${$scope.HealthPhysicalObj.NeurologicNotes}`;
                    }
                    if ($scope.HealthPhysicalObj.HepaticNotes != $scope.LogObj.HepaticNotes) {
                        AllergyDetails += `, Hepatic Notes: ${$scope.HealthPhysicalObj.HepaticNotes}`;
                    }
                    if ($scope.HealthPhysicalObj.HemeOncNotes != $scope.LogObj.HemeOncNotes) {
                        if ($scope.HealthPhysicalObj.HemeOncNotes)
                            AllergyDetails += `, Heme One Notes: ${$scope.HealthPhysicalObj.HemeOncNotes}`;
                    }
                    if ($scope.HealthPhysicalObj.KidneyDiseaseNotes != $scope.LogObj.KidneyDiseaseNotes) {
                        if ($scope.HealthPhysicalObj.KidneyDiseaseNotes)
                            AllergyDetails += `, Kidney Disease Notes: ${$scope.HealthPhysicalObj.KidneyDiseaseNotes}`;
                    }
                    if ($scope.HealthPhysicalObj.MusculoSkeletalSystemNotes != $scope.LogObj.MusculoSkeletalSystemNotes) {
                        if ($scope.HealthPhysicalObj.MusculoSkeletalSystemNotes)
                            AllergyDetails += `, Musculoskeletal Notes: ${$scope.HealthPhysicalObj.MusculoSkeletalSystemNotes}`;
                    }
                    if ($scope.HealthPhysicalObj.EndocrineNotes != $scope.LogObj.EndocrineNotes) {
                        if ($scope.HealthPhysicalObj.EndocrineNotes)
                            AllergyDetails += `, Endocrine Notes: ${$scope.HealthPhysicalObj.EndocrineNotes}`;
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
                        "ScreenType": "Quick Access ROS(Past Medical History)",
                        "ActionType": "Added",
                        "OldActionDescription": '',
                        "NewActionDescription": description,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);


                    //let allergyNames = rossubmitreq.SystemicHistory.map(function (item) {
                    //    return item.HistoryName;
                    //}).join(',');

                    //// Create log object for each allergy item
                    //let description = '';
                    //if (rossubmitreq.SystemicHistory.length > 1) {
                    //    description = `Past Medical History - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
                    //} else if (rossubmitreq.SystemicHistory.length === 1) {
                    //    description = `Past Medical History - ${allergyNames.toUpperCase()} In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`;
                    //}
                    //let obj = {
                    //    "LogId": 0,
                    //    "ModuleId": $scope.ModeuleId || 0,
                    //    "ModuleName": $scope.ModuleName || '',
                    //    "SubModuleId": 14,
                    //    "SubModuleName": "ROS",
                    //    "ScreenType": "Quick Access ROS",
                    //    "ActionType": "Added",
                    //    "ActionDescription": description,
                    //    "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    //};
                    //$scope.LogObj.LogArray.push(obj);
                }
            }
            $scope.HealthPhysicalObj.LifestyleHistoryArray = $scope.HealthPhysicalObj.LifestyleHistoryArray || [];
            if ($scope.HealthPhysicalObj.LifestyleHistoryArray.length > 0) {
                var newvalue = '';
                if ($scope.LogObj.LifestyleDetail.length == 0) {
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
                        psychisData = psychislist.filter(item => item.DeleteInd === 'N').map(item => {
                            let parts = [];
                            if (item.HistoryName) parts.push('History Name :' + item.HistoryName);
                            if (item.PsychisType) parts.push('Psychis Type :' + item.PsychisType);
                            return parts.join(' , ');
                        })
                            .join('\n')
                    }

                    newvalue = SmokingData + '\n' + AlcoholData + '\n' + DrugData + '\n' + psychisData;

                    let obj = {
                        "LogId": 0,
                        "ModuleId": $scope.ModeuleId || 0,
                        "ModuleName": $scope.ModuleName || '',
                        "SubModuleId": 14,
                        "SubModuleName": "ROS",
                        "ScreenType": "Quick Access ROS(Social)",
                        "ActionType": "Added",
                        "OldActionDescription": "",
                        "NewActionDescription": newvalue,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);


                //if ($scope.LogObj.LifestyleDetail.length == 0) {
                //    let obj = {
                //        "LogId": 0,
                //        "ModuleId": $scope.ModeuleId || 0,
                //        "ModuleName": $scope.ModuleName || '',
                //        "SubModuleId": 14,
                //        "SubModuleName": "ROS",
                //        "ScreenType": "Quick Access ROS",
                //        "ActionType": "Added",
                //        "ActionDescription": `Lifestyle History In Quick Access for Appointment ID: ${$scope.cacheStorageItem.AppointmentId}`,
                //        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                //    };
                //    $scope.LogObj.LogArray.push(obj);

                } else {
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
                //let ActionDescription = "Allergies Notes In Quick Access For Appointment ID:" + $scope.cacheStorageItem.AppointmentId || "";
                if (rossubmitreq.AllergyRemarks != $scope.LogObj.AllergyRemarks) {
                    let newDescription = "";
                    let oldDescription = "";
                    if (rossubmitreq.AllergyRemarks) {
                        newDescription = `Allergies Notes In Quick Access ROS: ${rossubmitreq.AllergyRemarks}`;
                    }
                    if ($scope.LogObj.AllergyRemarks) {
                        oldDescription = `Allergies Notes In Quick Access ROS: ${$scope.LogObj.AllergyRemarks}`;
                    }
                    let obj = {
                        "LogId": 0,
                        "ModuleId": $scope.ModeuleId || 0,
                        "ModuleName": $scope.ModuleName || '',
                        "SubModuleId": 14,
                        "SubModuleName": "ROS",
                        "ScreenType": "Quick Access ROS",
                        "ActionType": ActionType,
                        "OldActionDescription": oldDescription,
                        "NewActionDescription": newDescription,
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
              //  let ActionDescription = "SurgicalHistory Notes In Quick Access For Appointment ID:" + $scope.cacheStorageItem.AppointmentId || "";
                if (rossubmitreq.SurgicalRemarks != $scope.LogObj.SurgicalRemarks) {
                    let newDescription = "";
                    let oldDescription = "";
                    if (rossubmitreq.SurgicalRemarks) {
                        newDescription = `SurgicalHistory Notes In Quick Access ROS: ${rossubmitreq.SurgicalRemarks}`;
                    }
                    if ($scope.LogObj.SurgicalRemarks) {
                        oldDescription = `SurgicalHistory Notes In Quick Access ROS: ${$scope.LogObj.SurgicalRemarks}`;
                    }
                    let obj = {
                        "LogId": 0,
                        "ModuleId": $scope.ModeuleId || 0,
                        "ModuleName": $scope.ModuleName || '',
                        "SubModuleId": 14,
                        "SubModuleName": "ROS",
                        "ScreenType": "Quick Access ROS",
                        "ActionType": ActionType,
                        "OldActionDescription": oldDescription,
                        "NewActionDescription": newDescription,
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
               // let ActionDescription = "Current Eye Medications Notes In Quick Access For Appointment ID:" + $scope.cacheStorageItem.AppointmentId || "";
                if (rossubmitreq.CurrentEyeRemarks != $scope.LogObj.CurrentEyeRemarks) {
                    let newDescription = "";
                    let oldDescription = "";
                    if (rossubmitreq.CurrentEyeRemarks) {
                        newDescription = `Current Eye Medications Notes In Quick Access ROS: ${rossubmitreq.CurrentEyeRemarks}`;
                    }
                    if ($scope.LogObj.CurrentEyeRemarks) {
                        oldDescription = `Current Eye Medications Notes In Quick Access ROS: ${$scope.LogObj.CurrentEyeRemarks}`;
                    }
                    let obj = {
                        "LogId": 0,
                        "ModuleId": $scope.ModeuleId || 0,
                        "ModuleName": $scope.ModuleName || '',
                        "SubModuleId": 14,
                        "SubModuleName": "ROS",
                        "ScreenType": "Quick Access ROS",
                        "ActionType": ActionType,
                        "OldActionDescription": oldDescription,
                        "NewActionDescription": newDescription,
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
              //  let ActionDescription = "Current Systemic Medications Notes In Quick Access For Appointment ID:" + $scope.cacheStorageItem.AppointmentId || "";
                if (rossubmitreq.CurrentSystemicRemarks != $scope.LogObj.CurrentSystemicRemarks) {
                    let newDescription = "";
                    let oldDescription = "";
                    if (rossubmitreq.CurrentSystemicRemarks) {
                        newDescription = `Current Systemic Medications Notes In Quick Access ROS: ${rossubmitreq.CurrentSystemicRemarks}`;
                    }
                    if ($scope.LogObj.CurrentSystemicRemarks) {
                        oldDescription = `Current Systemic Medications Notes In Quick Access ROS: ${$scope.LogObj.CurrentSystemicRemarks}`;
                    }
                    let obj = {
                        "LogId": 0,
                        "ModuleId": $scope.ModeuleId || 0,
                        "ModuleName": $scope.ModuleName || '',
                        "SubModuleId": 14,
                        "SubModuleName": "ROS",
                        "ScreenType": "Quick Access ROS",
                        "ActionType": ActionType,
                        "OldActionDescription": oldDescription,
                        "NewActionDescription": newDescription,
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
               // let ActionDescription = "Systemic History Notes In Quick Access For Appointment ID:" + $scope.cacheStorageItem.AppointmentId || "";
                if (rossubmitreq.SystemicHistoryRemarks != $scope.LogObj.SystemicHistoryRemarks) {
                    let newDescription = "";
                    let oldDescription = "";
                    if (rossubmitreq.SystemicHistoryRemarks) {
                        newDescription = `Systemic History Notes In Quick Access ROS: ${rossubmitreq.SystemicHistoryRemarks}`;
                    }
                    if ($scope.LogObj.SystemicHistoryRemarks) {
                        oldDescription = `Systemic History Notes In Quick Access ROS: ${$scope.LogObj.SystemicHistoryRemarks}`;
                    }
                    let obj = {
                        "LogId": 0,
                        "ModuleId": $scope.ModeuleId || 0,
                        "ModuleName": $scope.ModuleName || '',
                        "SubModuleId": 14,
                        "SubModuleName": "ROS",
                        "ScreenType": "Quick Access ROS",
                        "ActionType": ActionType,
                        "OldActionDescription": oldDescription,
                        "NewActionDescription": newDescription,
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
               // let ActionDescription = "Lifestyle History Notes In Quick Access For Appointment ID:" + $scope.cacheStorageItem.AppointmentId || "";
                if (rossubmitreq.LifestyleHistoryRemarks != $scope.LogObj.LifestyleHistoryRemarks) {
                    let newDescription = "";
                    let oldDescription = "";
                    if (rossubmitreq.LifestyleHistoryRemarks) {
                        newDescription = `Lifestyle History Notes In Quick Access ROS: ${rossubmitreq.LifestyleHistoryRemarks}`;
                    }
                    if ($scope.LogObj.LifestyleHistoryRemarks) {
                        oldDescription = `Lifestyle History Notes In Quick Access ROS: ${$scope.LogObj.LifestyleHistoryRemarks}`;
                    }
                    let obj = {
                        "LogId": 0,
                        "ModuleId": $scope.ModeuleId || 0,
                        "ModuleName": $scope.ModuleName || '',
                        "SubModuleId": 14,
                        "SubModuleName": "ROS",
                        "ScreenType": "Quick Access ROS",
                        "ActionType": ActionType,
                        "OldActionDescription": oldDescription,
                        "NewActionDescription": newDescription,
                        "ActionDateTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    };
                    $scope.LogObj.LogArray.push(obj);
                }
            }

            if ($scope.LogObj.LogArray.length > 0) {
                rossubmitreq.Logs = $scope.LogObj || {};
            }
            rossubmitreq.CurrentSystemicMedicationsHistory = rossubmitreq.CurrentSystemicMedicationsHistory || []
            if (rossubmitreq.CurrentSystemicMedicationsHistory.length > 0) {
                angular.forEach(rossubmitreq.CurrentSystemicMedicationsHistory, function (mitem) {                 
                    mitem.StartDate = mitem.StartDate || null;                   
                });
            }

            $scope.obj.IsClickSaveAscRosBtn = true;
            eHnoteDiagnosisDataServices.AddupdateROSData(rossubmitreq).then(function (resp) {
                if (resp.data.Status === "Success") {
                    resp.data.SystemicHistory = resp.data.SystemicHistory || [];
                    $scope.obj.SystemicHistoryArray = angular.copy(resp.data.SystemicHistory);
                    $scope.obj.AllergyItems = angular.copy(resp.data.AllergyItems);
                    $scope.obj.SurgicalHistoryArray = angular.copy(resp.data.SurgicalHistory);
                    $scope.obj.CurrentSystemicMedicationsHistory = angular.copy(resp.data.CurrentSystemicMedicationsHistory);
                    $scope.obj.CurrentEyeMedicationArray = angular.copy(resp.data.MedicalConditions);
                    $scope.HealthPhysicalObj.DrugNames = $scope.HealthPhysicalObj.DrugNames || [];
                    if (resp.data.LifestyleHistory.length > 0) {
                        $scope.HealthPhysicalObj.LifestyleHistoryArray = angular.copy(resp.data.LifestyleHistory);

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
                                    $scope.obj.LifestyleHistory.PsychisType = item.PsychisType;
                                }

                            });
                        }


                        if ($scope.DrugNames.length > 0) {
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

                    $scope.HealthPhysicalObj.LifestyleHistory.Remarks = resp.data.LifestyleHistoryRemarks || '';
                    if ($scope.HealthPhysicalObj.LifestyleHistory.Remarks != '') {
                                $scope.HealthPhysicalObj.SocialNotesInd = true;
                            }
                    $scope.obj.IsClickSaveAscRosBtn = false;
                    $uibModalInstance.close($scope.obj);
                }
            }, function () {

            });


        }

        /* Current Systemic Medications */
        $scope.GetMasterCurrentSystemicMedications = function (val) {
            var params = {
                "ParentHospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "UserId": doctorinfo.doctorid,
                "GetAllIndicator": 1,
                "PageSize": 10,
                "PageNumber": 1,
                "SearchText": val,
                "Type": '',
                "IsFrequent": "N"

            };
            //if (val === "") {
            //    params.Type = 'C';
            //}
            if (params.SearchText == "") {
                params.IsFrequent = "Y";
            }

            return eHnoteSettingsDataService.GetMasterCurrentSystemicMedications(params).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.CurrentSystemicMedicationsHistory !== undefined) {
                        //if (val === "") {
                        //    var obj = {
                        //        "HistoryId": "",
                        //        "HistoryName": "Frequently Added"
                        //    };
                        //    resp.data.CurrentSystemicMedicationsHistory.unshift(obj);
                        //}
                        $scope.ROSHistoriesObj.AddCurrentSystemicMedicationsHistory = false;
                        return resp.data.CurrentSystemicMedicationsHistory.map(function (item) {
                            return item;
                        });
                    } else {
                        $scope.ROSHistoriesObj.AddCurrentSystemicMedicationsHistory = true;
                    }
                } else {
                    $scope.ROSHistoriesObj.AddCurrentSystemicMedicationsHistory = false;
                    if (val != '') {
                        $scope.ROSHistoriesObj.AddCurrentSystemicMedicationsHistory = true;
                    }
                }
            });
        };
        $scope.AddNewCurrentSystemicMedications = function (SelectedCurrentSystemicMedications) {
            SelectedCurrentSystemicMedications = SelectedCurrentSystemicMedications || "";
            if (SelectedCurrentSystemicMedications === "") {
                alertify.error("Enter Current Systemic Medications  History");
                return;
            }
            var object = {
                "ParentHospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "UserId": $scope.UserId,
                "DeleteInd": false,
                "HistoryName": SelectedCurrentSystemicMedications,
                "HistoryId": 0
            };
            eHnoteSettingsDataService.AddUpdateMasterCurrentSystemicHistory(object).success(function (response) {

                if (response.Status === "Success") {
                    if (response.count > 0) {
                        $scope.SelectedCurrentSystemicMedicationsHistory = "";
                        SelectedCurrentSystemicMedications = "";
                        $scope.onRosCurrentSystemicMedicationsHistoryBlurChange(response.CurrentSystemicMedicationsHistory[0]);
                        $scope.ROSHistoriesObj.AddCurrentSystemicMedicationsHistory = false;
                        alertify.success("Successfully Added");
                    }
                }
                if (response.Status === 'Failure') {
                    alertify.error(response.Message);
                    $scope.SelectedCurrentSystemicMedicationsHistory = "";
                    SelectedCurrentSystemicMedications = "";
                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });

        };
        $scope.onRosCurrentSystemicMedicationsHistoryBlurChange = function (CurrentSystemicMedicationsHistory) {
            if (CurrentSystemicMedicationsHistory.HistoryId === '') {
                CurrentSystemicMedicationsHistory.HistoryName = '';
                $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem = '';
                return false;
            }
            $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem = CurrentSystemicMedicationsHistory;
            var i = 0;
            $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem = $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem || "";
            if ($scope.obj.SelectedCurrentSystemicMedicationsHistoryItem === "") {
                return;
            }

            if (angular.isObject($scope.obj.SelectedCurrentSystemicMedicationsHistoryItem)) {
                var object = {
                    "HistoryId": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.HistoryId,
                    "HistoryName": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.HistoryName,
                    "IsEdit": true,
                    "OrganId": "",
                    "Frequency": "",
                    "showCurrentSystemicMedicationsHistory": false,
                    "ActiveInd": true,
                    "Duration": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.Duration || "",
                    "DurationType": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.DurationType || "D",
                    "DurationDate": '',
                    "ShowDateFormat": false,
                    "Remarks": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.Remarks || "",
                    "ShowNote": false
                };
            } else {
                var object = {
                    "HistoryId": 0,
                    "HistoryName": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem,
                    "IsEdit": true,
                    "OrganId": "",
                    "Frequency": "",
                    "showCurrentSystemicMedicationsHistory": false,
                    "ActiveInd": true,
                    "Duration": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.Duration || "",
                    "DurationType": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.DurationType || "D",
                    "DurationDate": '',
                    "ShowDateFormat": false,
                    "Remarks": $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem.Remarks || "",
                    "ShowNote": false
                };
            }
            var i = 0;
            if ($scope.obj.CurrentSystemicMedicationsHistory.length > 0) {
                angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (item) {
                    if (item.HistoryId === object.HistoryId && item.ActiveInd === true) {
                        alertify.error('You have already entered this Current Systemic Medications history');
                        $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem = "";
                        i++;
                    }
                });
            }
            if ($scope.obj.CurrentSystemicMedicationsHistory.length !== 0) {
                angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (item) {
                    item.IsEdit = false;
                });
            }
            if (i === 0) {
                object.GeneralPatientHistoryId = 0;
                $scope.obj.CurrentSystemicMedicationsHistory.push(object);
                $scope.obj.SelectedCurrentSystemicMedicationsHistoryItem = "";
            }
        };

        $scope.ChangeCurrentSystemicMedications = function (mainitem) {
            angular.forEach($scope.obj.CurrentSystemicMedicationsHistory, function (item) {
                item.IsEdit = false;
            })
            mainitem.IsEdit = true;
        }

        $scope.AddCurntSysMedicnotes = function (item) {
            item.ShowNote = true;
        };

        $scope.ClearSubCurSysMHistory = function (item) {
            item.Remarks = "";
            item.Duration = "";
            item.DurationType = "D";
            item.DurationDate = "";
            item.Frequency = "";
            item.OrganId = 1;
        };

        /* Current Systemic Medications End*/


        /* Systemic History */
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
            $scope.obj.SystemicHistoryItem = SystemicHistory;
            var i = 0;
            $scope.obj.SystemicHistoryItem = $scope.obj.SystemicHistoryItem || "";
            if ($scope.obj.SystemicHistoryItem === "") {
                return;
            }
            $scope.cacheStorageItem.SystemicHistoryArray = $scope.cacheStorageItem.SystemicHistoryArray || [];


            if (angular.isObject($scope.obj.SystemicHistoryItem)) {
                var object = {
                    "PatientDetailId": 0,
                    "HistoryId": $scope.obj.SystemicHistoryItem.HistoryId,
                    "HistoryName": $scope.obj.SystemicHistoryItem.HistoryName,
                    "IsNormal": $scope.obj.SystemicHistoryItem.IsNormal || false,
                    "IsEdit": true,
                    "IsNoshowROS": true,
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
                    "TypeId": $scope.obj.SystemicHistoryItem.TypeId || null,
                    "TypeName": $scope.obj.SystemicHistoryItem.TypeName || null,
                    "IsNoshowROS": false,
                    "ShowDateFormat": true,
                };
            } else {
                var object = {
                    "PatientDetailId": 0,
                    "HistoryId": 0,
                    "HistoryName": $scope.obj.SystemicHistoryItem,
                    "IsNormal": false,
                    "IsNoshowROS": true,
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
                    "TypeId": $scope.obj.SystemicHistoryItem.TypeId || null,
                    "TypeName": $scope.obj.SystemicHistoryItem.TypeName || null,
                    "IsNoshowROS": false,
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
            if (object.HistoryId == 20 || object.HistoryId == 59 || object.HistoryId == 127 || object.HistoryId == 132 || object.HistoryId == 166) {
                object.IsNoshowROS = true;
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
            $scope.allwnlcheck();
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

        $scope.AddSystemicHistorynotes = function (item) {
            item.ShowNote = true;
        };



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
                $scope.obj.isNKSHSelected = false;
                $scope.HealthPhysicalObj.IsAllGridView = true;
                $scope.HealthPhysicalObj.IsAllSearchView = false;
            } else {
                $scope.HealthPhysicalObj.IsAllGridView = false;
                $scope.HealthPhysicalObj.IsAllSearchView = true;
            }
        }


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

        //$scope.changeSeverity = function (item) {
        //    item.SeverityName = item.SeverityId.AllergyDescription;
        //    item.SeverityID = item.SeverityId.ROSAllergiesID;
        //}

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

        /* Systemic History End*/

        /* Surgical History */
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
                if (item.HistoryId === surgicalHistory.HistoryId) {
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
                mainitem.ModifierName = mainitem.ModifierObj.DESCRIPTION1 ;
            }
        }

        /* Surgical History End*/


        /* Allergy Remark Start*/

        $scope.SaveAllergiesRemarks = function () {
            var obj = {
                "ROSAllergyRemark": [],
                "type": "AllergyRemarks"
            };

            angular.forEach($scope.obj.ROSAllergyRemarkObj.Eyes, function (ritem) {
                if (ritem.AllergyRemarksDetailId != 0 || ritem.CustomAllergyValue != '') {
                    obj.ROSAllergyRemark.push(ritem);
                }
            });
            angular.forEach($scope.obj.ROSAllergyRemarkObj.Respiratory, function (ritem) {
                if (ritem.AllergyRemarksDetailId != 0 || ritem.CustomAllergyValue != '') {
                    obj.ROSAllergyRemark.push(ritem);
                }
            });
            angular.forEach($scope.obj.ROSAllergyRemarkObj.ENT, function (ritem) {
                if (ritem.AllergyRemarksDetailId != 0 || ritem.CustomAllergyValue != '') {
                    obj.ROSAllergyRemark.push(ritem);
                }
            });
            angular.forEach($scope.obj.ROSAllergyRemarkObj.Skin, function (ritem) {
                if (ritem.AllergyRemarksDetailId != 0 || ritem.CustomAllergyValue != '') {
                    obj.ROSAllergyRemark.push(ritem);
                }
            });
            angular.forEach($scope.obj.ROSAllergyRemarkObj.GenitoUrinary, function (ritem) {
                if (ritem.AllergyRemarksDetailId != 0 || ritem.CustomAllergyValue != '') {
                    obj.ROSAllergyRemark.push(ritem);
                }
            });
            angular.forEach($scope.obj.ROSAllergyRemarkObj.GastroInterstinal, function (ritem) {
                if (ritem.AllergyRemarksDetailId != 0 || ritem.CustomAllergyValue != '') {
                    obj.ROSAllergyRemark.push(ritem);
                }
            });
            angular.forEach($scope.obj.ROSAllergyRemarkObj.CardioVascular, function (ritem) {
                if (ritem.AllergyRemarksDetailId != 0 || ritem.CustomAllergyValue != '') {
                    obj.ROSAllergyRemark.push(ritem);
                }
            });
            angular.forEach($scope.obj.ROSAllergyRemarkObj.BloodOrLymph, function (ritem) {
                if (ritem.AllergyRemarksDetailId != 0 || ritem.CustomAllergyValue != '') {
                    obj.ROSAllergyRemark.push(ritem);
                }
            });
            angular.forEach($scope.obj.ROSAllergyRemarkObj.Psychiatric, function (ritem) {
                if (ritem.AllergyRemarksDetailId != 0 || ritem.CustomAllergyValue != '') {
                    obj.ROSAllergyRemark.push(ritem);
                }
            });
            angular.forEach($scope.obj.ROSAllergyRemarkObj.Constitutional, function (ritem) {
                if (ritem.AllergyRemarksDetailId != 0 || ritem.CustomAllergyValue != '') {
                    obj.ROSAllergyRemark.push(ritem);
                }
            });
            angular.forEach($scope.obj.ROSAllergyRemarkObj.Neurological, function (ritem) {
                if (ritem.AllergyRemarksDetailId != 0 || ritem.CustomAllergyValue != '') {
                    obj.ROSAllergyRemark.push(ritem);
                }
            });
            angular.forEach($scope.obj.ROSAllergyRemarkObj.Muscoloskeletal, function (ritem) {
                if (ritem.AllergyRemarksDetailId != 0 || ritem.CustomAllergyValue != '') {
                    obj.ROSAllergyRemark.push(ritem);
                }
            });
            angular.forEach($scope.obj.ROSAllergyRemarkObj.Endocrine, function (ritem) {
                if (ritem.AllergyRemarksDetailId != 0 || ritem.CustomAllergyValue != '') {
                    obj.ROSAllergyRemark.push(ritem);
                }
            });
            angular.forEach($scope.obj.ROSAllergyRemarkObj.Immunologic, function (ritem) {
                if (ritem.AllergyRemarksDetailId != 0 || ritem.CustomAllergyValue != '') {
                    obj.ROSAllergyRemark.push(ritem);
                }
            });

            $uibModalInstance.close(obj);
        }
        $scope.ChangeRemarksvalues = function (checked, Type) {
            if (Type == "Eyes") {
                if (checked == true) {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Eyes, function (ritem) {
                        ritem.CustomAllergyValue = "N";
                    });
                } else {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Eyes, function (ritem) {
                        ritem.CustomAllergyValue = "";
                    });
                }
            }
            else if (Type == "Respiratory") {
                if (checked == true) {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Respiratory, function (ritem) {
                        ritem.CustomAllergyValue = "N";
                    });
                } else {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Respiratory, function (ritem) {
                        ritem.CustomAllergyValue = "";
                    });
                }
            }
            else if (Type == "ENT") {
                if (checked == true) {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.ENT, function (ritem) {
                        ritem.CustomAllergyValue = "N";
                    });
                } else {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.ENT, function (ritem) {
                        ritem.CustomAllergyValue = "";
                    });
                }
            }
            else if (Type == "Skin") {
                if (checked == true) {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Skin, function (ritem) {
                        ritem.CustomAllergyValue = "N";
                    });
                } else {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Skin, function (ritem) {
                        ritem.CustomAllergyValue = "";
                    });
                }
            }
            else if (Type == "GenitoUrinary") {
                if (checked == true) {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.GenitoUrinary, function (ritem) {
                        ritem.CustomAllergyValue = "N";
                    });
                } else {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.GenitoUrinary, function (ritem) {
                        ritem.CustomAllergyValue = "";
                    });
                }
            }
            else if (Type == "GastroInterstinal") {
                if (checked == true) {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.GastroInterstinal, function (ritem) {
                        ritem.CustomAllergyValue = "N";
                    });
                } else {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.GastroInterstinal, function (ritem) {
                        ritem.CustomAllergyValue = "";
                    });
                }
            }
            else if (Type == "CardioVascular") {
                if (checked == true) {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.CardioVascular, function (ritem) {
                        ritem.CustomAllergyValue = "N";
                    });
                } else {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.CardioVascular, function (ritem) {
                        ritem.CustomAllergyValue = "";
                    });
                }
            }
            else if (Type == "BloodOrLymph") {
                if (checked == true) {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.BloodOrLymph, function (ritem) {
                        ritem.CustomAllergyValue = "N";
                    });
                } else {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.BloodOrLymph, function (ritem) {
                        ritem.CustomAllergyValue = "";
                    });
                }
            }
            else if (Type == "Psychiatric") {
                if (checked == true) {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Psychiatric, function (ritem) {
                        ritem.CustomAllergyValue = "N";
                    });
                } else {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Psychiatric, function (ritem) {
                        ritem.CustomAllergyValue = "";
                    });
                }
            }
            else if (Type == "Constitutional") {
                if (checked == true) {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Constitutional, function (ritem) {
                        ritem.CustomAllergyValue = "N";
                    });
                } else {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Constitutional, function (ritem) {
                        ritem.CustomAllergyValue = "";
                    });
                }
            }
            else if (Type == "Neurological") {
                if (checked == true) {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Neurological, function (ritem) {
                        ritem.CustomAllergyValue = "N";
                    });
                } else {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Neurological, function (ritem) {
                        ritem.CustomAllergyValue = "";
                    });
                }
            }
            else if (Type == "Muscoloskeletal") {
                if (checked == true) {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Muscoloskeletal, function (ritem) {
                        ritem.CustomAllergyValue = "N";
                    });
                } else {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Muscoloskeletal, function (ritem) {
                        ritem.CustomAllergyValue = "";
                    });
                }
            }
            else if (Type == "Endocrine") {
                if (checked == true) {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Endocrine, function (ritem) {
                        ritem.CustomAllergyValue = "N";
                    });
                } else {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Endocrine, function (ritem) {
                        ritem.CustomAllergyValue = "";
                    });
                }
            }
            else if (Type == "Immunologic") {
                if (checked == true) {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Immunologic, function (ritem) {
                        ritem.CustomAllergyValue = "N";
                    });
                } else {
                    angular.forEach($scope.obj.ROSAllergyRemarkObj.Immunologic, function (ritem) {
                        ritem.CustomAllergyValue = "";
                    });
                }
            }
        }
        /* Allergy Remark End*/



        $scope.getDateOfDuration = function (year, month, day) {
            year = parseInt(year) || 0;
            month = parseInt(month) || 0;
            day = parseInt(day) || 0;
            var today = new Date();
            var todayYear = today.getFullYear();
            var todaymonth = today.getMonth() + 1;
            var dateNow = today.getDate();
            var dobyear = todayYear - year;
            if (todaymonth > month) {
                var dobmonth = todaymonth - month;
            }
            if (todaymonth <= month) {
                dobyear = dobyear - 1;
                dobmonth = todaymonth - month;
                dobmonth = 12 + dobmonth;
            }

            if (dateNow > day)
                var dateAge = dateNow - day;
            else {
                dobmonth--;
                dateAge = 30 + dateNow - day;

                if (dobmonth < 0) {
                    dobmonth = 11;
                    dobyear--;
                }
            }
            dobmonth = dobmonth < 10 ? "0" + dobmonth : dobmonth;
            dateAge = dateAge < 10 ? "0" + dateAge : dateAge;
            if (dateAge === "00") {
                dateAge = "01";
            }
            return dobmonth + "/" + dateAge + "/" + dobyear;
        };

        $scope.ChangeLifestyle = function (mainitem) {
            angular.forEach($scope.obj.LifestyleHistory, function (item) {
                item.IsEdit = false;
            })
            mainitem.IsEdit = true;
        }

      

        $scope.changestatusvaci = function (minitem, item) {
            minitem.StatusId = item.ROSAllergiesID;
            minitem.StatusIdName = item.AllergyDescription || '';

        }
        $scope.ChangeOnSetItem = function (item) {
            item.ShowDateFormat = !item.ShowDateFormat;
        }
        $scope.ChangeSysitem = function (item) {
            if (item.DurationType === 'SB') {
                item.Duration = '';
            }
            item.DurationDate = '';
        }
        $scope.ChangeAllergy = function (item) {
            if (item.DurationType === 'SB') {
                item.Duration = '';
            }
            item.DurationDate = '';
        }
        $scope.changeAllergyStatus = function (item) {
            var List = $filter("filter")($scope.ROSAllergyStatus, { "ROSAllergyStatusId": item.StatusId }, true);
            if (List.length > 0) {
                item.StatusName = List[0].AllergyStatus;
            } else {
                item.StatusName = "";
            }
        }
        $scope.GetAllergyListUsingFocus = function () {
            $scope.FocusObj.AllergiesFocus = true;
        }
        $scope.GetMasterSystemicHistoryOnFocus = function () {
            $scope.FocusObj.SystemicHistoryFocus = true;
        }
        $scope.GetMasterSurgicalHistoryOnFocus = function () {
            $scope.FocusObj.SurgicalHistoryFocus = true;
        }

        //$scope.ChangeFormatDate = function (item) {
        //    item.Duration = '';
        //    item.DurationType = '';
        //}
        $scope.ChangeDuration = function (item) {
            item.DurationDate = '';
        }
        $scope.ChangeDurationTODATE = function (item) {
            item.DurationDate = '';
        }
        $scope.ChangeCardiacAppForsearchview = function (item) {
            item.IsChecked = false;
            if (item.PatientDetailId !== 0 && item.IsChecked === false) {
                item.DeleteInd = "Y";
            }
            //else if (item.PatientDetailId !== 0 && item.IsChecked === true) {
            //    item.DeleteInd = "N";
            //}
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
                       // $scope.ROSHistoriesObj.IsRcopia = false;
                       // var NkdaArray = [];
                        angular.forEach($scope.obj.AllergyItems, function (item) {
                            if (item.AllergyId == 1) {
                                item.DeleteInd = 'Y';
                                //NkdaArray.push(item);
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
                    $scope.$digest();
              
            } else {
                if ($scope.obj.isNKDASelected) {
                    $scope.obj.isNKASelected = false;
                   // $scope.ROSHistoriesObj.IsRcopia = false;
                   // var NkdaArray = [];
                    angular.forEach($scope.obj.AllergyItems, function (item) {
                        if (item.AllergyId == 1) {
                            item.DeleteInd = 'Y';
                            //NkdaArray.push(item);
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
                    $scope.cacheStorageItem.isNKDASelected = false;
                    $scope.obj.SelectedAllergyItem = '';
                    $scope.obj.AllergyItems = [];
                    //angular.forEach($scope.FrequentlyAllergyitems, function (item) {
                    //    item.Onselect = false;
                    //});
                }
            }
        };
        $scope.toggleNormall = function () {
            if ($scope.CategoryDetails.length > 0) {
                var Categoryfilter = $filter("filter")($scope.CategoryDetails, { "SubCategoryName": "Allergies" }, true);
                if (Categoryfilter.length > 0) {
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
                }
            }
            if ($scope.CategoryDetails.length > 0) {
                var Categoryfilter = $filter("filter")($scope.CategoryDetails, { "SubCategoryName": "Surgical History" }, true);
                if (Categoryfilter.length > 0) {

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

                }
            }
            if ($scope.CategoryDetails.length > 0) {
                var Categoryfilter = $filter("filter")($scope.CategoryDetails, { "SubCategoryName": "Past Medical History" }, true);
                if (Categoryfilter.length > 0) {

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
                                        "ShowDateFormat": false,
                                        "IsChecked": true
                                    };
                                    $scope.HealthPhysicalObj.SystemicHistoryArray.unshift(object);
                                    $scope.obj.isNKSHSelected = true;
                                    angular.forEach($scope.FrequentlySystemicHistory, function (item) {
                                        item.Onselect = false;
                                    });
                                };
                            }

                        }
                    }

                }
            }

            if ($scope.CategoryDetails.length > 0) {
                var Categoryfilter = $filter("filter")($scope.CategoryDetails, { "SubCategoryName": "Current Eye Medication" }, true);
                if (Categoryfilter.length > 0) {
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
                }
            }

            if ($scope.CategoryDetails.length > 0) {
                var Categoryfilter = $filter("filter")($scope.CategoryDetails, { "SubCategoryName": "Current Systemic Medications" }, true);
                if (Categoryfilter.length > 0) {
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
                        "DrugDurationDate": "",
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


        $scope.GetOrganizationMedicationlist = function (val, Id) {

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

                    Id = Id || null;
                    if (Id != null) {
                        var list1 = [];
                        angular.forEach(resp.data.MedicineList, function (item) {
                            if (item.MedicationLocationTypeId == Id || item.MedicationLocationTypeId == null) {
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
            //if (object.MedicineId === '') {
            //    object.MedicineName = '';
            //    $scope.obj.CurrentMedicationItem = '';
            //    return false;
            //}
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
                    if (resp.data.DrugDetailsList !== undefined) {
                        return resp.data.DrugDetailsList.map(function (item) {
                            return item;
                        });
                    }
                });
            }
        }

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

        $scope.StopCurrentMedication = function (item, type) {

            var dosesupplytest = "";
            if (item.DaysSupply !== '') {

                var filteredArray = $filter("filter")($scope.durationArray, { "MedicineDosaageFieldId": item.DaysSupplyId }, true);
                if (filteredArray.length > 0) {
                    // mainobj.DaysSupply = filteredArray[0].Code;
                    dosesupplytest = " for " + filteredArray[0].Description;
                };

                //dosesupplytest = " for " + item.DaysSupplyDescription;
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
                //"size": "lg",
                "windowClass": "examination-popover-popup overflow-hidden medicinorder-stop",
                "keyboard": false,
                "resolve": {
                    "cache": function () { return angular.copy($scope.cacheStorageItem); },
                    "MedicationDetails": function () { return angular.copy(item); },
                    "ROSHistoryData": function () { return angular.copy($scope.obj); },
                    "TypeData": function () { return angular.copy(type); }
                },
                "controller": function ($scope, $uibModal, $uibModalInstance, cache, MedicationDetails, ROSHistoryData, TypeData) {
                    type = TypeData;
                    if (type == 'CurrentEyeMedication') { }
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

                    $scope.closeStopmedicationPopup = function () {
                        $uibModalInstance.dismiss("cancel");
                    };
                    $scope.StopMedication.StopDate = $filter('date')($scope.StopDate, "MM/dd/yyyy") || null;

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

                        let TypeId = null;
                        let TypeName = "";
                        if (ScreenObj.TypeId != null) {
                            TypeId = ScreenObj.TypeId;
                        }
                        if (ScreenObj.TypeName != null) {
                            TypeName = ScreenObj.TypeName;
                        }

                        var Allergobj = {
                            "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                            "AppointmentID": $scope.cacheStorageItem.AppointmentId || null,
                            "PatientId": $scope.cacheStorageItem.PatientId,
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
                            "MedicalConditions": $scope.MedicationDetailsArrayDetails || [],
                            "SystemicHistory": $scope.obj.SystemicHistoryArray || [],
                            "SurgicalHistory": $scope.obj.SurgicalHistoryArray || [],
                            "CurrentSystemicMedicationsHistory": [], /*angular.copy($scope.obj.CurrentSystemicMedicationsHistory)*/
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
                            if (mitem.MedicineObject.Sig != undefined && mitem.MedicineObject.Sig != "") {
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
                $scope.StopmedicationArray = angular.copy(resp.data.MedicalConditions) || [];


                if ($scope.obj.CurrentEyeMedicationArray.length > 0) {
                    angular.forEach($scope.obj.CurrentEyeMedicationArray, function (iitem) {
                        angular.forEach($scope.StopmedicationArray, function (Nitem) {
                            if (iitem.MedicineId == Nitem.MedicineId) {
                                iitem.IsMedicationStopped = Nitem.IsMedicationStopped || false;
                                iitem.StopDate = $filter('date')(Nitem.StopDate, "MM/dd/yyyy");
                                iitem.StopReason = Nitem.StopReason;
                                iitem.StopReasonId = Nitem.StopReasonId;
                                iitem.CurrentEyeMedicalConditionId = Nitem.CurrentEyeMedicalConditionId

                            }
                        });
                    });
                }

                if ($scope.cacheStorageItem.CurrentEyeMedications.length > 0) {
                    angular.forEach($scope.cacheStorageItem.CurrentEyeMedications, function (iitem) {
                        angular.forEach($scope.StopmedicationArray, function (Nitem) {
                            if (iitem.MedicineId == Nitem.MedicineId) {
                                iitem.IsMedicationStopped = Nitem.IsMedicationStopped || false;
                                iitem.StopDate = $filter('date')(Nitem.StopDate, "MM/dd/yyyy");
                                iitem.StopReason = Nitem.StopReason;
                                iitem.StopReasonId = Nitem.StopReasonId;
                            }
                        });
                    });
                }

            }, function (cancel) {
            });
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
        $scope.savedSigs = [];
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
                "windowClass": "examination-popover-popup overflow-hidden medicinorder-stop",
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

                        let TypeId = null;
                        let TypeName = "";
                        if (ScreenObj.TypeId != null) {
                            TypeId = ScreenObj.TypeId;
                        }
                        if (ScreenObj.TypeName != null) {
                            TypeName = ScreenObj.TypeName;
                        }

                        var Allergobj = {
                            "ConsultationID": $scope.cacheStorageItem.ConsultationID || 0,
                            "AppointmentID": $scope.cacheStorageItem.AppointmentId || null,
                            "PatientId": $scope.cacheStorageItem.PatientId,
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
                            if (mitem.MedicineObject.Sig != undefined && mitem.MedicineObject.Sig != "") {
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

        $scope.ClearCurrentSystemicMedicationsHistoryItem = function (item, MedicineObject) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to clear Current Systemic Medications data?</h4>", function () {
                /* angular.forEach(item, function (mainitem) {*/
                item.ActionId = "";
                item.Action = "";
                item.Dose = '';
                item.DoseUnit = '';
                item.Route = '';
                item.Frequency = '';
                item.DoseOther = '';
                item.DaysSupply = '';
                item.QuantityUnit = '';
                item.DoseId = "";
                item.DoseUnitId = "";
                item.RouteId = "";
                item.FrequencyId = "";
                item.DoseOtherId = "";
                item.DaysSupplyId = "";
                item.Quantity = "";
                item.QuantityUnitId = "";
                item.RefillId = "";
                item.Refills = "";
                item.PatientInstructions = '';
                item.MedicineObject = '';
                item.StartDate = null;
                item.StopDate = null;
                item.Sig = '';
                /*  })*/
                $scope.$digest();
            }, function () {
                r = "You pressed Cancel!";
            });
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


        $scope.addSIgNameDynamically = function () {
            var dosesupplytest = "";
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

        /*Ocular Surgical History */

        $scope.GetMasterOcularSurgical = function (val) {
            var params = {
                "ParentHospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "UserId": doctorinfo.doctorid,
                "GetAllIndicator": 1,
                "PageSize": 10,
                "PageNumber": 1,
                "SearchText": val,
                "Type": '',
                "IsFrequent": "N"
            };
            if (params.SearchText == "") {
                params.IsFrequent = "Y";
            }

            return eHnoteSettingsDataService.GetMasterOcularSurgicalHistory(params).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.OcularSurgicalHistory !== undefined) {
                        $scope.ROSHistoriesObj.AddOcularSurgicalHistory = false;
                        return resp.data.OcularSurgicalHistory.map(function (item) {
                            return item;
                        });
                    } else {
                        $scope.ROSHistoriesObj.AddOcularSurgicalHistory = true;
                    }
                } else {
                    $scope.ROSHistoriesObj.AddOcularSurgicalHistory = false;
                    if (val != '') {
                        $scope.ROSHistoriesObj.AddOcularSurgicalHistory = true;
                    }
                }
            });
        };

        $scope.onRosOcularSurgicalHistoryBlurChange = function (OcularSurgicalHistory) {
            if (OcularSurgicalHistory.HistoryId === '') {
                OcularSurgicalHistory.HistoryName = '';
                $scope.obj.OcularSurgicalHistoryItem = '';
                return false;
            }
            $scope.obj.OcularSurgicalHistoryItem = OcularSurgicalHistory;
            var i = 0;
            $scope.obj.OcularSurgicalHistoryItem = $scope.obj.OcularSurgicalHistoryItem || "";
            if ($scope.obj.OcularSurgicalHistoryItem === "") {
                return;
            }

            /* if (angular.isObject($scope.obj.OcularSurgicalHistoryItem)) {  // Date: 28-03-2023 changes organ seperate sessions By divya
                 var object = {
                     "PatientDetailId" : 0,
                     "HistoryId": $scope.obj.OcularSurgicalHistoryItem.HistoryId,
                     "HistoryName": $scope.obj.OcularSurgicalHistoryItem.HistoryName,
                     "IsEdit": true,
                     "showOcularSurgicalHistory": false,
                     "ActiveInd": true,
                     "Remarks": $scope.obj.OcularSurgicalHistoryItem.Remarks || "",
                     "ShowNote": false,
                     "OrganId": "",
                     "MODIFIERCODE": "",
                     "ModifierId": "",
                     "ModifierObj" : "",
                     "CPTCode": $scope.obj.OcularSurgicalHistoryItem.CPTCode || "",
                     "ProcedureId": $scope.obj.OcularSurgicalHistoryItem.ProcedureId || "",
                     "CPTObj": $scope.obj.OcularSurgicalHistoryItem.CPTCode || "",
                     "DurationType": "D",
                     "Duration": "",
                     "Performedby": "",
                     "CoManagedby": "",
                     "CoManagedID": "",
                     "PerformedID": "",
                     "DurationDate": "",
                     "ShowDateFormat":true
                 };
             } else {
                 var object = {
                     "PatientDetailId" :0,
                     "HistoryId": 0,
                     "HistoryName": $scope.obj.OcularSurgicalHistoryItem,
                     "IsEdit": true,
                     "showOcularSurgicalHistory": false,
                     "ActiveInd": true,
                     "Remarks": $scope.obj.OcularSurgicalHistoryItem.Remarks || "",
                     "ShowNote": false,
                     "OrganId": "",
                     "MODIFIERCODE": "",
                     "CPTCode": "",
                     "ProcedureId": "",
                     "Performedby": "",
                     "CoManagedby": "",
                     "DurationDate": "",
                     "ShowDateFormat": true
                 
                 };
             }*/
            if (angular.isObject($scope.obj.OcularSurgicalHistoryItem)) {  // Date: 28-03-2023 changes organ seperate sessions By divya
                var object = {
                    "PatientDetailId": 0,
                    "HistoryId": $scope.obj.OcularSurgicalHistoryItem.HistoryId,
                    "HistoryName": $scope.obj.OcularSurgicalHistoryItem.HistoryName,
                    "IsEdit": true,
                    "showOcularSurgicalHistory": false,
                    "ActiveInd": true,
                    "DeleteInd": 'N',
                    "Remarks": $scope.obj.OcularSurgicalHistoryItem.Remarks || "",
                    "ShowNote": false,
                    "MODIFIERCODE": "",
                    "ModifierId": "",
                    "ModifierObj": "",
                    "CPTCode": $scope.obj.OcularSurgicalHistoryItem.CPTCode || "",
                    "ProcedureId": $scope.obj.OcularSurgicalHistoryItem.ProcedureId || "",
                    "CPTObj": $scope.obj.OcularSurgicalHistoryItem.CPTCode || "",
                    "RDurationType": "D",
                    "RDuration": "",
                    "RPerformedby": "",
                    "RCoManagedby": "",
                    "RCoManagedID": "",
                    "RPerformedID": "",
                    "RDurationDate": "",
                    "RShowDateFormat": true,
                    "LDurationType": "D",
                    "LDuration": "",
                    "LPerformedby": "",
                    "LCoManagedby": "",
                    "LCoManagedID": "",
                    "LPerformedID": "",
                    "LDurationDate": "",
                    "LShowDateFormat": true,
                    "IsBothEye": false
                };
            } else {
                var object = {
                    "PatientDetailId": 0,
                    "HistoryId": 0,
                    "HistoryName": $scope.obj.OcularSurgicalHistoryItem,
                    "IsEdit": true,
                    "showOcularSurgicalHistory": false,
                    "ActiveInd": true,
                    "DeleteInd": 'N',
                    "Remarks": $scope.obj.OcularSurgicalHistoryItem.Remarks || "",
                    "ShowNote": false,
                    "MODIFIERCODE": "",
                    "CPTCode": "",
                    "ProcedureId": "",
                    "RDurationType": "D",
                    "RDuration": "",
                    "RPerformedby": "",
                    "RCoManagedby": "",
                    "RCoManagedID": "",
                    "RPerformedID": "",
                    "RDurationDate": "",
                    "RShowDateFormat": true,
                    "LDurationType": "D",
                    "LDuration": "",
                    "LPerformedby": "",
                    "LCoManagedby": "",
                    "LCoManagedID": "",
                    "LPerformedID": "",
                    "LDurationDate": "",
                    "LShowDateFormat": true,
                    "IsBothEye": false
                };
            }

            var i = 0;
            if ($scope.obj.OcularSurgicalHistoryArray.length > 0) {
                angular.forEach($scope.obj.OcularSurgicalHistoryArray, function (item) {
                    if (item.HistoryId === object.HistoryId && item.DeleteInd === 'N') {
                        alertify.error('You have already entered this OcularSurgical history');
                        $scope.obj.OcularSurgicalHistoryItem = "";
                        i++;
                    }
                });
            }
            if ($scope.obj.OcularSurgicalHistoryArray.length !== 0) {
                var List = $filter("filter")($scope.obj.OcularSurgicalHistoryArray, { "HistoryId": 1 }, true);
                if (List.length > 0) {
                    angular.forEach(List, function (item) {
                        if (item.PatientDetailId === 0) {
                            var indexToRemove = $scope.obj.OcularSurgicalHistoryArray.indexOf(item);
                            if (indexToRemove !== -1) {
                                $scope.obj.OcularSurgicalHistoryArray.splice(indexToRemove, 1);
                            }
                        }
                        else {
                            item.DeleteInd = 'Y';
                        }
                    });
                }
                $scope.obj.isNKOSHSelected = false
                angular.forEach($scope.obj.OcularSurgicalHistoryArray, function (item, index) {
                    item.IsEdit = false;
                    /* if (index == 0) { item.IsEdit = true; }*/
                });
            }
            object.IsShowOcularSurgicalHistoryInd = false;
            object.IsShowOcularSurgicalHistoryAddInd = false;
            if (object.CPTCode == "") {
                object.IsShowOcularSurgicalHistoryInd = true;
            }
            if (i === 0) {
                object.GeneralPatientHistoryId = 0;
                $scope.obj.OcularSurgicalHistoryArray.unshift(object);
                $scope.obj.OcularSurgicalHistoryItem = "";
            }


        };

        $scope.AddNewOcularSurgical = function (SelectedOcularSurgical) {
            SelectedOcularSurgical = SelectedOcularSurgical || "";
            if (SelectedOcularSurgical === "") {
                alertify.error("Enter Ocular Surgical  History");
                return;
            }
            var object = {
                "ParentHospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "UserId": doctorinfo.doctorid,
                "DeleteInd": false,
                "HistoryName": SelectedOcularSurgical,
                "HistoryId": 0
            };
            eHnoteSettingsDataService.AddUpdateMasterOcularSurgicalHistory(object).success(function (response) {

                if (response.Status === "Success") {
                    if (response.count > 0) {
                        $scope.SelectedOcularSurgicalHistory = "";
                        SelectedOcularSurgical = "";
                        $scope.onRosOcularSurgicalHistoryBlurChange(response.OcularSurgicalHistory[0]);
                        $scope.ROSHistoriesObj.AddOcularSurgicalHistory = false;
                        alertify.success("Successfully Added");
                    }
                }
                if (response.Status === 'Failure') {
                    alertify.error(response.Message);
                    $scope.SelectedOcularSurgicalHistory = "";
                    SelectedOcularSurgicalHistory = "";
                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });

        };

        $scope.ChangeOcularSurgicalHistory = function (mainitem) {
            angular.forEach($scope.obj.OcularSurgicalHistoryArray, function (item) {
                item.IsEdit = false;
            })
            mainitem.IsEdit = true;
        }

        $scope.AddSurgeryOccularnotes = function (item) {
            item.ShowNote = true;
        };

        $scope.ClearSurgeryOccularhistoty = function (item, index) {
            var index = $scope.obj.OcularSurgicalHistoryArray.indexOf(item);
            item.PatientDetailId = item.PatientDetailId || null;
            if (item.PatientDetailId === null) {
                if (index > -1) {
                    $scope.obj.OcularSurgicalHistoryArray.splice(index, 1);
                }
            } else {
                $scope.obj.OcularSurgicalHistoryArray[index].DeleteInd = 'Y';
            }

        };


        $scope.ClearSubsurgeryOccularhistoty = function (item, type) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to clear Ocular Surgical History data?</h4>", function () {
                if (type == 'R') {
                    item.RDuration = '';
                    item.RPerformedID = "";
                    item.RCoManagedID = "";
                    item.RDurationType = "D";
                    item.RDurationDate = "";
                    item.RPerformedName = "";
                    item.RCoManagedName = "";
                    if (type == 'R' && (item.LDurationDate == "" && item.LPerformedID == "" && item.LCoManagedID == "" && item.LPerformedName == "" && item.LCoManagedName == "")) {
                        item.Remarks = "";
                        item.ModifierObj = "";
                    }
                }
                if (type == 'L') {
                    item.LDurationDate = "";
                    item.LDuration = "";
                    item.LDurationType = "D";
                    item.LPerformedID = "";
                    item.LCoManagedID = "";
                    item.LPerformedName = "";
                    item.LCoManagedName = "";
                    if (type == 'L' && (item.RDurationDate == "" && item.RPerformedID == "" && item.RCoManagedID == "" && item.RCoManagedName == "" && item.RPerformedName == "")) {
                        item.Remarks = "";
                        item.ModifierObj = "";
                    }
                }
                $scope.$digest();
                //item.Remarks = "";
                //item.ModifierObj = "";
            }, function () {
                r = "You pressed Cancel!";
            });
        };

        $scope.ChangeManaged = function (name, item, type) {
            //item.CoManagedID = item.CoManagedID || "";
            // item.CoManagedID = item.CoManagedby.DoctorID;
            if (type == 'R') {
                var List1 = $filter("filter")($scope.PerformedDoctorList, function (Ditem,) { return Ditem.FullName === name; }) || [];
                if (List1.length != 0) {
                    item.RCoManagedby = List1[0].FullName;
                    item.RCoManagedName = List1[0].FullName;
                    item.RCoManagedID = List1[0].DoctorID;
                }
            } else {
                var List1 = $filter("filter")($scope.PerformedDoctorList, function (Ditem,) { return Ditem.FullName === name; }) || [];
                if (List1.length != 0) {
                    item.LCoManagedby = List1[0].FullName;
                    item.LCoManagedName = List1[0].FullName;
                    item.LCoManagedID = List1[0].DoctorID;
                }
            }
        };
        $scope.ChangePerformed = function (name, item, type) {
            //item.PerformedID = item.PerformedID || "";
            //item.Performedby = item.Performedby.DoctorID;
            if (type == 'R') {
                var List1 = $filter("filter")($scope.PerformedDoctorList, function (Ditem,) { return Ditem.FullName === name; }) || [];
                if (List1.length != 0) {
                    item.RPerformedby = List1[0].FullName;
                    item.RPerformedName = List1[0].FullName;
                    item.RPerformedID = List1[0].DoctorID;
                }
            } else {
                var List1 = $filter("filter")($scope.PerformedDoctorList, function (Ditem,) { return Ditem.FullName === name; }) || [];
                if (List1.length != 0) {
                    item.LPerformedby = List1[0].FullName;
                    item.LPerformedName = List1[0].FullName;
                    item.LPerformedID = List1[0].DoctorID;
                }
            }
        };
        $scope.ChangeOculrSurgicalModifier = function (mainitem) {
            mainitem.ModifierObj = mainitem.ModifierObj || "";
            if (mainitem.ModifierObj != "") {
                mainitem.MODIFIERCODE = mainitem.ModifierObj.MODIFIERCODE;
                mainitem.ModifierId = mainitem.ModifierObj.MODIFIERID;
            }
        }

        /* Ocular Surgical End*/

        /*Ocular History */
        $scope.GetMasterOccularHistory = function (val, type) {
            var params = {
                "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
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


            return eHnoteSettingsDataService.GetMasterOccularHistory(params).then(function (resp) {
                if (resp.data.count !== 0) {
                    if (resp.data.OccularHistory !== undefined) {
                        $scope.ROSHistoriesObj.AddOccularHistory = false;
                        return resp.data.OccularHistory.map(function (item) {
                            return item;
                        });
                    } else {
                        $scope.ROSHistoriesObj.AddOccularHistory = true;
                    }
                } else {
                    $scope.ROSHistoriesObj.AddOccularHistory = false;
                    if (val != '') {
                        $scope.ROSHistoriesObj.AddOccularHistory = true;
                    }

                }
            });
        };

        $scope.onRosOccularHistoryBlurChange = function (occularHistory) {
            if (occularHistory.HistoryId === '') {
                occularHistory.HistoryName = '';
                $scope.obj.SelectedOcularHistoryItem = '';
                return false;
            }
            $scope.obj.SelectedOcularHistoryItem = occularHistory;

            var i = 0;
            $scope.obj.SelectedOcularHistoryItem = $scope.obj.SelectedOcularHistoryItem || "";
            if ($scope.obj.SelectedOcularHistoryItem === "") {
                return;
            }

            var object = {};    // date: 28-03-2023 change request for Organ session will seperate by divya
            if (angular.isObject(occularHistory)) {
                object = {
                    "PatientDetailId": 0,
                    "HistoryId": $scope.obj.SelectedOcularHistoryItem.HistoryId,
                    "HistoryName": $scope.obj.SelectedOcularHistoryItem.HistoryName,
                    "IsEdit": true,
                    "showOccularHistory": false,
                    "ActiveInd": true,
                    "DeleteInd": 'N',
                    "Remarks": $scope.obj.SelectedOcularHistoryItem.Remarks || "",
                    "DiagnosisId": $scope.obj.SelectedOcularHistoryItem.DiagnosisId || "",
                    "DiagnosisObject": $scope.obj.SelectedOcularHistoryItem.ICD10CODE || "",
                    "ICD10CODE": $scope.obj.SelectedOcularHistoryItem.ICD10CODE || "",
                    "SNOMEDCODE": $scope.obj.SelectedOcularHistoryItem.SNOMED || "",
                    "SNOMEDId": $scope.obj.SelectedOcularHistoryItem.SNOMEDId || "",
                    "ShowNote": false,
                    "RDuration": $scope.obj.SelectedOcularHistoryItem.Duration || "",
                    "RDurationType": $scope.obj.SelectedOcularHistoryItem.DurationType || "D",
                    "RDurationTypeName": $scope.obj.SelectedOcularHistoryItem.DurationTypeName || "Day(s)",
                    "RSeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                    "RDurationDate": "",
                    "RShowDateFormat": true,
                    "RSeverityId": "",
                    "RStatusId": 1,
                    "RStatusName": 'Active',
                    "RSeverityName": "",
                    "LDuration": $scope.obj.SelectedOcularHistoryItem.Duration || "",
                    "LDurationType": $scope.obj.SelectedOcularHistoryItem.DurationType || "D",
                    "LDurationTypeName": $scope.obj.SelectedOcularHistoryItem.DurationTypeName || "Day(s)",
                    "LSeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                    "LDurationDate": "",
                    "LShowDateFormat": true,
                    "LSeverityId": "",
                    "LStatusId": 1,
                    "LStatusName": 'Active',
                    "LSeverityName": "",
                    "IsBothEye": false,
                    "IsFrequent": $scope.obj.SelectedOcularHistoryItem.IsFrequent || "",
                };
            } else {
                var object = {
                    "PatientDetailId": 0,
                    "HistoryId": 0,
                    "HistoryName": $scope.obj.SelectedOcularHistoryItem,
                    "IsEdit": true,
                    "showOccularHistory": false,
                    "ActiveInd": true,
                    "DeleteInd": 'N',
                    "DiagnosisId": $scope.obj.SelectedOcularHistoryItem.DiagnosisId || "",
                    "ICD10CODE": $scope.obj.SelectedOcularHistoryItem.ICD10CODE || "",
                    "SNOMEDCODE": $scope.obj.SelectedOcularHistoryItem.SNOMED || "",
                    "SNOMEDId": $scope.obj.SelectedOcularHistoryItem.SNOMEDId || "",
                    "Remarks": $scope.obj.SelectedOcularHistoryItem.Remarks || "",
                    "ShowNote": false,
                    "RDuration": "",
                    "RDurationType": "D",
                    "RDurationTypeName": "Day(s)",
                    "RSeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                    "RDurationDate": "",
                    "RShowDateFormat": true,
                    "RSeverityId": "",
                    "RStatusId": 1,
                    "RStatusName": 'Active',
                    "RSeverityName": "",
                    "LDuration": "",
                    "LDurationType": "D",
                    "LDurationTypeName": "Day(s)",
                    "LSeverityDateTime": $filter('date')(new Date(), "MM-dd-yyyy h:mm a"),
                    "LDurationDate": "",
                    "LShowDateFormat": true,
                    "LSeverityId": "",
                    "LStatusId": 1,
                    "LStatusName": 'Active',
                    "LSeverityName": "",
                    "IsBothEye": false,
                    "IsFrequent": $scope.obj.SelectedOcularHistoryItem.IsFrequent || "",
                };
            }

            var i = 0;
            if ($scope.obj.OccularHistoryArray.length > 0) {
                angular.forEach($scope.obj.OccularHistoryArray, function (item) {
                    if (item.HistoryId === object.HistoryId && item.DeleteInd === 'N') {
                        alertify.error('You have already entered this Ocular History');
                        $scope.obj.SelectedOcularHistoryItem = "";
                        i++;
                    }
                });
            }
            if ($scope.obj.OccularHistoryArray.length !== 0) {
                var List = $filter("filter")($scope.obj.OccularHistoryArray, { "HistoryId": 1 }, true);
                if (List.length > 0) {
                    angular.forEach(List, function (item) {
                        if (item.PatientDetailId === 0) {
                            var indexToRemove = $scope.obj.OccularHistoryArray.indexOf(item);
                            if (indexToRemove !== -1) {
                                $scope.obj.OccularHistoryArray.splice(indexToRemove, 1);
                            }
                        }
                        else {
                            item.DeleteInd = 'Y';
                        }
                    });
                }
                $scope.obj.isNKOHSelected = false
                angular.forEach($scope.obj.OccularHistoryArray, function (item, index) {
                    item.IsEdit = false;
                    /*if (index == 0) { item.IsEdit = true; }*/
                });
            }

            object.IsShowoccularHistorySnomedInd = false;
            object.IsShowoccularHistorySnomedInd = false;
            object.IsShowoccularHistorySnomedAddInd = false;
            object.IsShowoccularHistoryICD10CODEAddInd = false;
            if (object.SNOMEDCODE == "") {
                object.IsShowoccularHistorySnomedInd = true;
            }
            if (object.ICD10CODE == "") {
                object.IsShowoccularHistoryICD10CODEInd = true;
            }

            if (i === 0) {
                object.GeneralPatientHistoryId = 0;
                $scope.obj.OccularHistoryArray.unshift(object);
                $scope.obj.SelectedOcularHistoryItem = "";
            }

        };

        $scope.AddNewOccularHistory = function (SelectedOccularHistory) {
            SelectedOccularHistory = SelectedOccularHistory || "";
            if (SelectedOccularHistory === "") {
                alertify.error("Enter OccularHistory");
                return;
            }
            var object = {
                "HospitalId": doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID,
                "UserId": doctorinfo.doctorid,
                "DeleteInd": false,
                "HistoryName": SelectedOccularHistory,
                "HistoryId": 0
            };
            eHnoteSettingsDataService.AddUpdateMasterOccularHistory(object).success(function (response) {
                if (response.Status === 'Success') {
                    if (response.count > 0) {
                        $scope.SelectedOccularHistory = "";
                        SelectedOccularHistory = "";
                        $scope.onRosOccularHistoryBlurChange(response.OccularHistory[0]);
                        $scope.ROSHistoriesObj.AddOccularHistory = false;
                        alertify.success("Successfully Added");
                    }
                }
                if (response.Status === 'Failure') {
                    alertify.error(response.Message);
                    $scope.SelectedOccularHistory = "";
                    SelectedOccularHistory = "";
                }
            })
                .error(function (error) {
                    alertify.error("Error Occured");
                });
        };

        $scope.ChangeOcular = function (mainitem) {
            angular.forEach($scope.obj.OccularHistoryArray, function (item) {
                item.IsEdit = false;
            })
            mainitem.IsEdit = true;
        }

        $scope.AddOccularnotes = function (item) {
            item.ShowNote = true;
        };

        $scope.ClearOccularHistory = function (item, index) {
            var index = $scope.obj.OccularHistoryArray.indexOf(item);
            item.PatientDetailId = item.PatientDetailId || null;
            if (item.PatientDetailId === null) {
                if (index > -1) {
                    $scope.obj.OccularHistoryArray.splice(index, 1);
                }
            } else {
                $scope.obj.OccularHistoryArray[index].DeleteInd = 'Y';
            }

        };

        $scope.ClearSubOccularHistory = function (item, type) {
            var r = alertify.confirm("<b class='txt-centre'>Confirm!</b><h4 class='txt-body-centre'>Are you sure want to clear Ocular History data?  </h4>", function () {
                if (type == 'R') {
                    item.RDurationDate = "";
                    item.RSeverityId = "";
                    item.RStatusId = "";
                    item.RDuration = "";
                }
                if (type == 'L') {
                    item.LDurationDate = "";
                    item.LSeverityId = "";
                    item.LStatusId = "";
                    item.LDuration = "";
                }
                item.OrganId = 1;
                item.Remarks = "";
                item.ReactionId = "";
                item.DurationType = "D";
                item.DurationDate = "";
                item.SnomedCode = "";
                item.DiagnosisObject = "";
                /*  item.SNOMEDCODE = "";*/
                $scope.$digest();
            }, function () {
                r = "You pressed Cancel!";
            });
        };

        $scope.GetSearchSnomedCodes = function (val, type) {
            var object = {
                "HospitalId": $scope.HospitalId,
                "PageSize": 10,
                "PageNumber": 1,
                "SearchText": val,
                "ParentOrganizationId": $scope.ParenthospitalId || null,

            };
            return eHnoteSettingsDataService.GetSearchSnomedCodes(object).then(function (response) {
                if (response.data.count !== 0) {
                    if (response.data.rows !== undefined) {
                        return response.data.rows.map(function (item) {
                            return item;
                        });
                    }
                }
            });

        };
        $scope.onSelectSnomed = function (item, mainItem) {
            item = item || "";
            if (item != "") {
                mainItem.SNOMEDCODE = item.ConceptId.toString();
                mainItem.SNOMEDId = item.SnomedCodeId;
            }
        };
        $scope.changeSnomed = function (minitem) {
            minitem.SNOMEDId = "";
        }

        $scope.ChangeFormatDate = function (item) {
            item.Duration = "";
            /*  item.DurationType = "";*/
        };
        $scope.ChangeOccularDuration = function (item, type) {
            if (type == "R") {
                item.RDurationDate = "";
            } else {
                item.LDurationDate = "";
            }
        };
        $scope.ChangeOccularItem = function (item, type) {
            if (type == "R") {
                item.RShowDateFormat = !item.RShowDateFormat;
                if (item.RShowDateFormat) { item.RDuration = '', item.RDurationType = 'D' } else { item.RDurationDate = '' }
            } else {
                item.LShowDateFormat = !item.LShowDateFormat;
                if (item.LShowDateFormat) { item.LDuration = '', item.LDurationType = 'D' } else { item.LDurationDate = '' }
            }
        }
        $scope.ChangeOccularFormatDate = function (item, type) {
            if (type == 'R') {
                item.RDuration = "";
                //item.RDurationType = "";
            } else {
                item.LDuration = "";
                //item.LDurationType = "";
            }
        };
        $scope.ChangeOccualrSeverity = function (id, item, type) {
            if (type == 'R') {
                var List1 = $filter("filter")($scope.ROSocularSeverity, function (Ditem) { return Ditem.ROSAllergySeverityId === id; }) || [];
                if (List1.length != 0) {
                    item.RSeverityName = List1[0].AllergySeverity;
                }
            } else {
                var List1 = $filter("filter")($scope.ROSocularSeverity, function (Ditem) { return Ditem.ROSAllergySeverityId === id; }) || [];
                if (List1.length != 0) {
                    item.LSeverityName = List1[0].AllergySeverity;
                }
            }
        };
        $scope.ChangeOccualrStatus = function (id, item, type) {
            if (type == 'R') {
                var List1 = $filter("filter")($scope.ROSAllergyStatus, function (Ditem) { return Ditem.ROSAllergyStatusId === id; }) || [];
                if (List1.length != 0) {
                    item.RStatusName = List1[0].AllergyStatus;
                }
            } else {
                var List1 = $filter("filter")($scope.ROSAllergyStatus, function (Ditem) { return Ditem.ROSAllergyStatusId === id; }) || [];
                if (List1.length != 0) {
                    item.LStatusName = List1[0].AllergyStatus;
                }
            }
        };
        $scope.additionalSystemicFilter = function (item) {
            // respiratory section and default items shown in systemic history are filtered out here
            return item.TypeId !== 1 && item.TypeId !== 2 && item.TypeId !== 3 && item.TypeId !== 5 && item.TypeId !== 6 && item.TypeId !== 7 && item.TypeId !== 8 && item.TypeId !== 9 && item.TypeId !== 10 && item.TypeId !== 11 && item.TypeId !== 12 && item.TypeId !== 16 && item.TypeId !== 17 && item.TypeId !== 21 && item.TypeId !== 18 && item.TypeId !== 19 && item.IsChecked == true;
        };
        $scope.additionalSystemicFilter1 = function (item) {
            // respiratory section and default items shown in systemic history are filtered out here
            return item.HistoryId == 1 && item.IsChecked == true;
        };

        /* Ocular History End*/
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
        $scope.ChangeSmokeStatus = function (item) {
            item.SmokingStatusId = item.SmokingStatusId || 0;
            if (item.SmokingStatusId == 0) {
                item.SmokingStatusId = 0;
                item.SmokingStatusName = "";
            } else {
                var statusfilter = $filter("filter")($scope.MasterSmokingStatus, { "HistoryHabitsID": item.SmokingStatusId }, true) || [];
                var TempArray = $filter("filter")($scope.obj.LifestyleHistory.Smokinglist, function (iterator, ind) { return iterator.SmokingStatusId == item.SmokingStatusId && iterator.DeleteInd == 'N'; }) || [];

                //var statusfilter = $filter("filter")($scope.SmokingStatus, { "HistoryHabitsID": item.SmokingStatusId }, true) || [];
                //var TempArray = $filter("filter")($scope.obj.LifestyleHistory.Smokinglist, { "SmokingStatusId": item.SmokingStatusId }, true) || [];
                if (TempArray.length > 1) {
                    alertify.error("This Status Already Selected ");
                    item.SmokingStatusId = 0;
                    return false;
                }
                if (statusfilter.length > 0) {
                    item.SmokingStatusName = statusfilter[0].HabitsDescription;
                }
            }
        }
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
  

        $scope.DrugListSelectedText = "Selected";
    

        $scope.ChangeDrugItemselect = function (item, checked) {

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
        $scope.OnSelectNormal = function (item) {
            $scope.obj.isNKSHSelected = false;
            if (item === "All") {
                if ($scope.HealthPhysicalObj.IsAllHealthWNL) {
                    angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                        kitem.IsChecked = false;
                        if (kitem.HistoryId == 1) {
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
                    }
                    if ($scope.HealthPhysicalObj.IsPulmonaryWNL) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 2) {
                                if (kitem.IsNormal == true) {
                                    kitem.IsChecked = true;
                                }

                                if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                    kitem.DeleteInd = "Y";
                                } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                                    kitem.DeleteInd = "N";
                                }
                                if (kitem.HistoryId === 33) {
                                    if (kitem.IsChecked) {
                                        $scope.HealthPhysicalObj.showPulmonaryNotes = true;
                                    } else {
                                        $scope.HealthPhysicalObj.showPulmonaryNotes = false;
                                        $scope.HealthPhysicalObj.PulmonaryNotes = "";
                                    }
                                }
                            }
                        });
                    }

                    if ($scope.HealthPhysicalObj.IsHepaticWNL) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 3) {
                                if (kitem.IsNormal == true) {
                                    kitem.IsChecked = true;
                                }

                                if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                    kitem.DeleteInd = "Y";
                                } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                                    kitem.DeleteInd = "N";
                                }
                                if (kitem.HistoryId === 41) {
                                    if (kitem.IsChecked) {
                                        $scope.HealthPhysicalObj.showHepaticNotes = true;
                                    } else {
                                        $scope.HealthPhysicalObj.showHepaticNotes = false;
                                        $scope.HealthPhysicalObj.HepaticNotes = "";
                                    }
                                }
                            }
                        });
                    }
                    if ($scope.HealthPhysicalObj.IsHemeOncWNL) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 6) {
                                if (kitem.IsNormal == true) {
                                    kitem.IsChecked = true;
                                }

                                if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                    kitem.DeleteInd = "Y";
                                } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                                    kitem.DeleteInd = "N";
                                }
                                if (kitem.HistoryId === 67) {
                                    if (kitem.IsChecked) {
                                        $scope.HealthPhysicalObj.showHemeOncNotes = true;
                                    } else {
                                        $scope.HealthPhysicalObj.showHemeOncNotes = false;
                                        $scope.HealthPhysicalObj.HemeOncNotes = "";
                                    }
                                }
                            }
                        });
                    }

                    if ($scope.HealthPhysicalObj.IsNervousSystemWNL) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 7) {
                                if (kitem.IsNormal == true) {
                                    kitem.IsChecked = true;
                                }

                                if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                    kitem.DeleteInd = "Y";
                                } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                                    kitem.DeleteInd = "N";
                                }
                                if (kitem.HistoryId === 70) {
                                    if (kitem.IsChecked) {
                                        $scope.HealthPhysicalObj.showNervousSystemNotes = true;
                                    } else {
                                        $scope.HealthPhysicalObj.showNervousSystemNotes = false;
                                        $scope.HealthPhysicalObj.NervousSystemNotes = "";
                                    }
                                }
                            }
                        });
                    }
                    if ($scope.HealthPhysicalObj.IsKidneyDiseaseWNL) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 8) {
                                if (kitem.IsNormal == true) {
                                    kitem.IsChecked = true;
                                }

                                if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                    kitem.DeleteInd = "Y";
                                } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                                    kitem.DeleteInd = "N";
                                }
                                if (kitem.HistoryId === 74) {
                                    if (kitem.IsChecked) {
                                        $scope.HealthPhysicalObj.showKidneyDiseaseNotes = true;
                                    } else {
                                        $scope.HealthPhysicalObj.showKidneyDiseaseNotes = false;
                                        $scope.HealthPhysicalObj.KidneyDiseaseNotes = "";
                                    }
                                }
                            }
                        });
                    }
                    if ($scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 9) {
                                if (kitem.IsNormal == true) {
                                    kitem.IsChecked = true;
                                }

                                if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                    kitem.DeleteInd = "Y";
                                } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                                    kitem.DeleteInd = "N";
                                }
                                if (kitem.HistoryId === 78) {
                                    if (kitem.IsChecked) {
                                        $scope.HealthPhysicalObj.showMusculoSkeletalSystemNotes = true;
                                    } else {
                                        $scope.HealthPhysicalObj.showMusculoSkeletalSystemNotes = false;
                                        $scope.HealthPhysicalObj.MusculoSkeletalSystemNotes = "";
                                    }
                                }
                            }
                        });
                    }
                    if ($scope.HealthPhysicalObj.IsPsychosisWNL) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 11) {
                                if (kitem.IsNormal == true) {
                                    kitem.IsChecked = true;
                                }

                                if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                    kitem.DeleteInd = "Y";
                                } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                                    kitem.DeleteInd = "N";
                                }
                                if (kitem.HistoryId === 90) {
                                    if (kitem.IsChecked) {
                                        $scope.HealthPhysicalObj.showPsychosisNotes = true;
                                    } else {
                                        $scope.HealthPhysicalObj.showPsychosisNotes = false;
                                        $scope.HealthPhysicalObj.PsychosisNotes = "";
                                    }
                                }
                            }
                        });
                    }
                    if ($scope.HealthPhysicalObj.IsOthersWNL) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 12) {
                                if (kitem.IsNormal == true) {
                                    kitem.IsChecked = true;
                                }

                                if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                    kitem.DeleteInd = "Y";
                                } else if (kitem.PatientDetailId !== 0 && kitem.IsChecked === true) {
                                    kitem.DeleteInd = "N";
                                }
                                if (kitem.HistoryId === 95) {
                                    if (kitem.IsChecked) {
                                        $scope.HealthPhysicalObj.showOthersNotes = true;
                                    } else {
                                        $scope.HealthPhysicalObj.showOthersNotes = false;
                                        $scope.HealthPhysicalObj.OthersNotes = "";
                                    }
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
                    if ($scope.HealthPhysicalObj.IsPulmonaryWNL == false) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 2) {
                                kitem.IsChecked = false;

                                if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                    kitem.DeleteInd = "Y";
                                }
                            }
                        });
                    }
                    if ($scope.HealthPhysicalObj.IsHepaticWNL == false) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 3) {
                                kitem.IsChecked = false;

                                if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                    kitem.DeleteInd = "Y";
                                }
                            }
                        });
                    }
                    if ($scope.HealthPhysicalObj.IsHemeOncWNL == false) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 6) {
                                kitem.IsChecked = false;

                                if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                    kitem.DeleteInd = "Y";
                                }
                            }
                        });
                    }
                    if ($scope.HealthPhysicalObj.IsNervousSystemWNL == false) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 7) {
                                kitem.IsChecked = false;

                                if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                    kitem.DeleteInd = "Y";
                                }
                            }
                        });
                    }
                    if ($scope.HealthPhysicalObj.IsKidneyDiseaseWNL == false) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 8) {
                                kitem.IsChecked = false;

                                if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                    kitem.DeleteInd = "Y";
                                }
                            }
                        });
                    }
                    if ($scope.HealthPhysicalObj.IsMusculoSkeletalSystemWNL == false) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 9) {
                                kitem.IsChecked = false;

                                if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                    kitem.DeleteInd = "Y";
                                }
                            }
                        });
                    }
                    if ($scope.HealthPhysicalObj.IsPsychosisWNL == false) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 11) {
                                kitem.IsChecked = false;

                                if (kitem.PatientDetailId !== 0 && kitem.IsChecked === false) {
                                    kitem.DeleteInd = "Y";
                                }
                            }
                        });
                    }
                    if ($scope.HealthPhysicalObj.IsOthersWNL == false) {
                        angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (kitem) {
                            if (kitem.TypeId === 12) {
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
        $scope.Frequentlyaddedselect = function (val) {
            $scope.onAllergySelect(val);
        }
        $scope.stopClosingDropDown = function (event) {
            event.stopPropagation();
        }

        //ros
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
        //ros

        $scope.ShowSystemicHistoryNote = function (item) {
            item.PreAdmOthernotesInd = !item.PreAdmOthernotesInd;
        };
        $scope.GetMedicalHistoriesByPatientId = function () {
            let tmpLifestyleHistory = [];
            let tempSystemicHistory = [];
            angular.forEach($scope.PreviousInvestigations, function (item) {
                if (item.Allergy.length > 0) {

                    angular.forEach(item.Allergy, function (pAllergy) {
                        pAllergy.Remarks = pAllergy.Remarks || '';
                        if (pAllergy.Remarks != '') {
                            pAllergy.ShowNote = true;
                        } else {
                            pAllergy.ShowNote = false;
                        }
                        pAllergy.DurationDate = pAllergy.DurationDate || '';
                        if (pAllergy.DurationDate != '') {
                            pAllergy.ShowDateFormat = true;
                            pAllergy.DurationDate = $filter('date')(pAllergy.DurationDate, "MM-dd-yyyy");
                        } else {
                            pAllergy.ShowDateFormat = false;
                        }
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
                            "IsEdit": pAllergy.IsEdit || false,
                            "ShowNote": pAllergy.ShowNote || false,
                            "ShowDateFormat": pAllergy.ShowDateFormat || false,
                            "ReactionName": pAllergy.ReactionName || "",
                            "DurationDate": pAllergy.DurationDate || "",
                            "StatusName": pAllergy.StatusName || "",
                            "Remarks": pAllergy.Remarks || "",
                            "SnomedCode": pAllergy.SnomedCode || "",
                            "DurationType": pAllergy.DurationType || 'D',
                            "OnsetType": 'Date',
                            "DiagnosisObject": 'D',
                            "DeleteInd": 'N',
                            "IsFrequent": pAllergy.IsFrequent || "N"
                            /*  "ReactionList": []*/
                        }
                        var i = 0;
                        if ($scope.obj.AllergyItems.length > 0) {
                            angular.forEach($scope.obj.AllergyItems, function (item) {
                                if (item.AllergyId === obj.AllergyId && item.DeleteInd == 'N') {
                                    /*alertify.error('You have already entered this Allergy');*/
                                    i++;
                                }
                            });
                        }
                        if ($scope.obj.AllergyItems.length !== 0) {
                            var List = $filter("filter")($scope.obj.AllergyItems, { "AllergyId": 1 }, true);
                            if (List.length > 0) {
                                List[0].DeleteInd = 'Y';
                            }
                        }

                        if ($scope.obj.AllergyItems.length !== 0) {
                            var List = $filter("filter")($scope.obj.AllergyItems, { "AllergyId": 2 }, true);
                            if (List.length > 0) {
                                List[0].DeleteInd = 'Y';
                            }
                        }

                        if (i === 0) {
                            var FreqList = $filter("filter")($scope.FrequentlyAllergyitems, function (fitem) {
                                return fitem.AllergyId == obj.AllergyId;
                            }, true);
                            if (FreqList.length > 0) {
                                FreqList[0].Onselect = true;
                            }
                            $scope.obj.AllergyItems.push(obj);
                        }

                    });
                    if ($scope.obj.AllergyItems.length > 0) {
                        $scope.obj.AllergyItems[0].IsEdit = true;
                    }
                }
                if (item.PatientSurgical.length > 0) {

                    $scope.obj.SurgicalHistoryItem = "";
                    angular.forEach(item.PatientSurgical, function (surgicalHistory) {
                        surgicalHistory.IsEdit = false;
                        if (surgicalHistory.Remarks != '') {
                            surgicalHistory.ShowNote = true;
                        }
                        surgicalHistory.DurationDate = surgicalHistory.DurationDate || '';
                        if (surgicalHistory.DurationDate != '') {
                            surgicalHistory.ShowDateFormat = true;
                            surgicalHistory.DurationDate = $filter('date')(surgicalHistory.DurationDate, "MM-dd-yyyy");
                        } else {
                            surgicalHistory.ShowDateFormat = false;
                        }
                        $scope.obj.SurgicalHistoryItem = surgicalHistory;
                        var i = 0;
                        $scope.obj.SurgicalHistoryItem = $scope.obj.SurgicalHistoryItem || "";
                        //if ($scope.obj.SurgicalHistoryItem === "") {
                        //    return;
                        //}
                        if ($scope.obj.SurgicalHistoryItem !== "") {
                            var object = {
                                "PatientDetailId": 0,
                                "HistoryId": $scope.obj.SurgicalHistoryItem.HistoryId,
                                "HistoryName": $scope.obj.SurgicalHistoryItem.HistoryName,
                                "IsEdit": $scope.obj.SurgicalHistoryItem.IsEdit || false,
                                "showSurgicalHistory": $scope.obj.SurgicalHistoryItem.showSurgicalHistory || false,
                                "ActiveInd": true,
                                "DeleteInd": 'N',
                                //"OrganId": $scope.obj.SurgicalHistoryItem || "",
                                "DurationDate": $scope.obj.SurgicalHistoryItem.DurationDate || "",
                                "Duration": $scope.obj.SurgicalHistoryItem.Duration || "",
                                "DurationType": $scope.obj.SurgicalHistoryItem.DurationType || "D",
                                "DurationTypeName": $scope.obj.SurgicalHistoryItem.DurationTypeName || "Day(s)",
                                "Remarks": $scope.obj.SurgicalHistoryItem.Remarks || "",
                                //"ShowDateFormat": $scope.obj.SurgicalHistoryItem.DurationDate ? true : false,
                                "ShowNote": $scope.obj.SurgicalHistoryItem.ShowNote || false,
                                "ModifierId": $scope.obj.SurgicalHistoryItem.ModifierId || "",
                                "MODIFIERCODE": $scope.obj.SurgicalHistoryItem.MODIFIERCODE || "",
                                "ModifierObj": $scope.obj.SurgicalHistoryItem.ModifierObj || "",
                                "CPTCode": $scope.obj.SurgicalHistoryItem.CPTCode || "",
                                "ProcedureId": $scope.obj.SurgicalHistoryItem.ProcedureId || "",
                                "CPTObj": $scope.obj.SurgicalHistoryItem.CPTCode || "",
                                "ShowDateFormat": $scope.obj.SurgicalHistoryItem.ShowDateFormat || false,
                                "IsFrequent": $scope.obj.SurgicalHistoryItem.IsFrequent || "N"
                            };
                        }
                        var i = 0;
                        if ($scope.obj.SurgicalHistoryArray.length > 0) {
                            angular.forEach($scope.obj.SurgicalHistoryArray, function (item) {
                                if (item.HistoryId === object.HistoryId && item.DeleteInd === 'N') {
                                    //alertify.error('You have already entered this Surgical history');
                                    $scope.obj.SurgicalHistoryItem = "";
                                    i++;
                                }
                            });
                        }
                        if ($scope.obj.SurgicalHistoryArray.length !== 0) {
                            var List = $filter("filter")($scope.obj.SurgicalHistoryArray, { "HistoryId": 1 }, true);
                            if (List.length > 0) {
                                List[0].DeleteInd = 'Y';
                            }
                        }
                        if (i === 0 && $scope.obj.SurgicalHistoryItem !== "") {
                            var FreqList = $filter("filter")($scope.FrequentlySurgicalHistory, function (fitem) {
                                return fitem.HistoryId == object.HistoryId;
                            }, true) || [];
                            if (FreqList.length > 0) {
                                FreqList[0].Onselect = true;
                            }
                            object.GeneralPatientHistoryId = 0;
                            $scope.obj.SurgicalHistoryArray.push(object);
                            $scope.obj.SurgicalHistoryItem = "";
                            //    surgicalHistory.iscopied = true;
                        }
                    });
                    if ($scope.obj.SurgicalHistoryArray.length > 0) {
                        $scope.obj.SurgicalHistoryArray[0].IsEdit = true;
                    }
                }
                if (item.PatientLifestyle.length > 0) {

                    /* SubCategoryId==46*/

                    angular.forEach(item.PatientLifestyle, function (sitem) {
                        if (sitem.DeleteInd == 'N' && sitem.ActiveInd == 'Y') {
                            sitem.PatientDetailId = 0;
                            //if (sitem.Smokinglist.length > 0) {
                            //    angular.forEach(sitem.Smokinglist, function (titem) {
                            //        titem.SmokingHistoryId = 0;
                            //        titem.PatientDetailId = 0;
                            //    });
                            //}
                            //if (sitem.DrugArray.length > 0) {
                            //    angular.forEach(sitem.DrugArray, function (dtitem) {
                            //        dtitem.DrugHistoryId = 0;
                            //        dtitem.PatientDetailId = 0;
                            //    });
                            //}
                            tmpLifestyleHistory = item.PatientLifestyle;

                        }
                    });
                }
                if (item.SystemicHistory.length > 0) {

                    tempSystemicHistory = item.SystemicHistory || [];
                }
                // Current Systemic
                $scope.CurrentSystemicMedicationsHistory = item.PatientCurrentSystemicMedications || [];
                if ($scope.CurrentSystemicMedicationsHistory.length > 0) {
                    angular.forEach($scope.CurrentSystemicMedicationsHistory, function (item) {
                        var isDuplicate = $scope.obj.CurrentSystemicMedicationsHistory.some(function (existingItem) {
                            return existingItem.MedicineId === item.MedicineId;
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
                                };

                                $scope.obj.CurrentSystemicMedicationsHistory.push(object);

                            }
                        }

                    });
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
            });
            $scope.HealthPhysicalObj.LifestyleHistoryArray = angular.copy(tmpLifestyleHistory);
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
            }



            angular.forEach(tempSystemicHistory, function (item) {
                let tempArray = $filter('filter')($scope.HealthPhysicalObj.SystemicHistoryArray, { 'HistoryId': item.HistoryId }, true);
                if (tempArray.length == 0) {
                    item.IsChecked = true;
                    item.PatientDetailId = 0
                    $scope.HealthPhysicalObj.SystemicHistoryArray.push(item);

                }
            });
            angular.forEach(tempSystemicHistory, function (Aitem) {
                angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (Bitem) {
                    if (Aitem.HistoryId == Bitem.HistoryId) {
                        Bitem.IsEdit = false;
                        Bitem.SnomedCodeobj = Aitem.SNOMEDCODE || '';                    
                        Bitem.PatientDetailId = Bitem.PatientDetailId || 0;
                        if (Bitem.PatientDetailId != 0) {
                            Bitem.PatientDetailId = Bitem.PatientDetailId || 0;
                            Bitem.StatusId = Bitem.StatusId ;
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

                        if (Bitem.HistoryId == 166 || Bitem.HistoryId == 127 || Bitem.HistoryId == 132 || Bitem.HistoryId == 20 || Bitem.HistoryId == 59 || Bitem.HistoryId == 33 || Bitem.HistoryId == 41 || Bitem.HistoryId == 67 || Bitem.HistoryId == 70 || Bitem.HistoryId == 74 || Bitem.HistoryId == 78 || Bitem.HistoryId == 90 || Bitem.HistoryId == 95) {
                            Bitem.IsNoshowROS = true;
                        }
                    }
                });
            });

            angular.forEach($scope.HealthPhysicalObj.SystemicHistoryArray, function (item) {
                if (item.DeleteInd == 'N' && item.IsChecked) {
                    item.DurationDate = item.DurationDate || null;
                    if (item.DurationDate != null) {
                        item.ShowDateFormat = true;
                        item.DurationDate = $filter('date')(item.DurationDate, "MM-dd-yyyy");
                    } else {
                        item.ShowDateFormat = false;
                    }
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

        $scope.LastVisitData = function () {
            eHnotePatientDataService.GetMedicalHistoriesByPatientId($scope.cacheStorageItem.PatientId).then(function (resp) {
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
                        $scope.HealthPhysicalObj.LifestyleHistory.Remarks = resp.data.rows[0].LifestyleHistoryRemarks || "";

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
                                return fitem.AllergyId !== 1 &&  fitem.DeleteInd == 'N';
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

                            let NonNKDAAllergies = $filter("filter")($scope.obj.AllergyItems, function (fitem) {
                                return fitem.AllergyId !== 2 && fitem.DeleteInd == 'N';
                            }, true);

                            if (NonNKDAAllergies.length > 0) {
                                // Means other allergies exist (except NKDA) → Hide button
                                $scope.AllergyStatus.ShowNoKnownAllergy = false;
                            } else {
                                // Show button only if NKA is selected
                                $scope.AllergyStatus.ShowNoKnownAllergy = true;
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

        $scope.cacheStorageItem.PatientID = $scope.cacheStorageItem.PatientId || '';
        $scope.cacheStorageItem.FullName = $scope.cacheStorageItem.PatientDetails.FullName || '';
        $scope.cacheStorageItem.PatientDisplayId = $scope.cacheStorageItem.PatientDetails.DisplayId || '';
        $scope.cacheStorageItem.PatientImageS3URL = $scope.cacheStorageItem.PatientDetails.S3URL || '';

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

        $scope.OnclickMentalStatus = function (Data) {
            $scope.HealthPhysicalObj.MentalStatus = Data;
        };

        $scope.HealthPhysicalObj.MentalStatus = $scope.cacheStorageItem.MentalStatus || '';

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
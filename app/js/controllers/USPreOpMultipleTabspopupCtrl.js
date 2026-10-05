"use strict";
eHnoteWebApp.controller("USPreOpMultipleTabspopupCtrl", ["$scope", "$rootScope", "$uibModalInstance", "$filter", "alertify", "eHnoteMasterDataService", "eHnoteDbStaticDataService", "eHnoteSettingsDataService", "eHnoteConditionsDataService", "eHnotePatientDataService", "eHnoteDiagnosisDataServices", "AlderetScoreDetails", "$uibModal", "cacheStorageItem", "Ascpatientpopupsavearray", "eHnoteCacheStorageService", "eHnoteLoginStatusService", "PreOpCallDetails", "TotalAlderetScore","Type",
    function ($scope, $rootScope, $uibModalInstance, $filter, alertify, eHnoteMasterDataService, eHnoteDbStaticDataService, eHnoteSettingsDataService, eHnoteConditionsDataService, eHnotePatientDataService, eHnoteDiagnosisDataServicesType, AlderetScoreDetails, $uibModal, cacheStorageItem, Ascpatientpopupsavearray, eHnoteCacheStorageService, eHnoteLoginStatusService, PreOpCallDetails, TotalAlderetScore, Type) {


        $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();

        var doctorinfo = eHnoteMasterDataService.getUserInfo();
        $scope.UserId = eHnoteMasterDataService.getLoginId();
        var userLoginDetails = eHnoteLoginStatusService.getUserLoginDetails();
        $scope.UserAccessRights = eHnoteMasterDataService.getUserAppPermissions();
        var appointmentinfo = eHnoteMasterDataService.getAppointmentInfo();
        $scope.SpecializationId = doctorinfo.doctordata.User[0].SpecializationId;
        $scope.ParenthospitalId = 0;
        $scope.HospitalId = 0;
       
        $scope.currentDate = $filter('date')(new Date(), "yyyy-MM-dd");
        if (doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo !== undefined && doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode !== undefined) {
            $scope.HospitalCD = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalCode;
            $scope.ParenthospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.ParentHospitalID;
            $scope.HospitalId = doctorinfo.doctordata.UserAddress[0].ExtDetails.HospitalInfo.HospitalID;
        };
        
        $scope.AddToCache = function () {
            eHnoteCacheStorageService.addCacheStorage($scope.cacheStorageItem);
            $scope.cacheStorageItem = eHnoteCacheStorageService.getCacheStorage();
        };

        Type = Type || 'AldereteScore';
        $scope.Preopobj = {        
            'SubType': Type,
        }

        $scope.PreOpObj = {
          
            "TotalAlderetScore": null,           
        };

        $scope.preopSubPopupScreenAccessObj = {
            "AnesthesiaAddAccess": true,
            "AnesthesiaSummaryAccess": true,
            "PreOpNoteSummaryAccess": true,
            "PreOpNoteEditAccess": true,
            "AldereteScoreEditAccess": true,
            "PreOpCallEditAccess": true,
            "PatientCheckListEditAccess": true
        }
        function GetCheckinObj() {
            return {
                "UserId": eHnoteMasterDataService.getLoginId(),
                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                "PatientId":  $scope.cacheStorageItem.PatientID,
                "HospitalId": $scope.HospitalId,
                "AdmissionId": 0,
                "PatientAscCheckInId": 0,
                "AdmissionDate": $filter("date")(new Date(), "MM-dd-yyyy") || "",
                "CheckInTime": $filter("date")(new Date(), "h:mm a") || "",
                "CheckInBy": eHnoteMasterDataService.getLoginId(),
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
                "ObservedBehavior": "",
                "ObservedBehaviorNotes": "",
                "LevelOfConsciousness": "",
                "LevelOfConsciousnessNotes": "",
                "PreOpOverallNotes":""
            }

        };
        $scope.PreopCheckinObj = GetCheckinObj();



        var PatientcheckinObj = {
            "RecievedForSurgery": $scope.PreopCheckinObj.RecievedForSurgery || '',
            "RecievedForSurgeryNotes": $scope.PreopCheckinObj.RecievedForSurgeryNotes || '',
            "AccompainedBy": $scope.PreopCheckinObj.AccompainedBy || '',
            "AccompainedByNotes": $scope.PreopCheckinObj.AccompainedByNotes || '',
            "PatientTransfferedIn": $scope.PreopCheckinObj.PatientTransfferedIn || '',
            "PatientTransfferedNotes": $scope.PreopCheckinObj.PatientTransfferedNotes || '',
            "PatientDestination": $scope.PreopCheckinObj.PatientDestination || '',
            "PatientDestinationNotes": $scope.PreopCheckinObj.PatientDestinationNotes || '',
            "PTERefers": $scope.PreopCheckinObj.PTERefers || '',
            "PTEReferNotes": $scope.PreopCheckinObj.PTEReferNotes || '',
            "PreOperativeOrientationOffered": $scope.PreopCheckinObj.PreOperativeOrientationOffered || '',
            "PreOperativeOrientationOfferedNotes": $scope.PreopCheckinObj.PreOperativeOrientationOfferedNotes || '',
            "ObservedBehavior": $scope.PreopCheckinObj.ObservedBehavior || '',
            "ObservedBehaviorNotes": $scope.PreopCheckinObj.ObservedBehaviorNotes || '',
            "LevelOfConsciousness": $scope.PreopCheckinObj.LevelOfConsciousness || '',
            "LevelOfConsciousnessNotes": $scope.PreopCheckinObj.LevelOfConsciousnessNotes || '',
            "PreOpOverallNotes": $scope.PreopCheckinObj.PreOpOverallNotes || '',
        }


        $scope.GetPreOpCallObj = function () {
            return {
                "UserId": $scope.UserId,
                "AppointmentId": $scope.cacheStorageItem.AppointmentId,
                "PatientId": $scope.cacheStorageItem.PatientID,
                "HospitalId": $scope.HospitalId,
                "PatientAscPreOpCallDetailId": 0,
                "ContactType": "",
                "IsConnectedWithPatient": false,
                "IsConnectedWithFamilyOrFriend": false,
                "IsLeftMsgWithFamilyOrFriend": false,
                "IsLeftMsgWithPatient": false,
                "IsNoResponse": false,
                "IsArrivalTimeShared": false,
                "IsAccompanyShared": false,
                "IsDrinkPlentyWaterShared": false,
                "IsNpoAfterMidnightShared": false,
                "IsTakeBpHeartMedShared": false,
                "IsDoNotTakeBpMedShared": false,
                "IsCoPay": false,
                "IsNoMakeupJewelMoistShared": false,
                "DropStartDate": "",
                "DropsStartTime": "",
                "ContactStartDate": "",
                "ContactStartTime": "",
                "CoPayNotes": "",
                "Remarks": "",
                "DeleteInd": "N"
            }
        };

        $scope.PreOpCallObj = angular.copy($scope.GetPreOpCallObj());

        $scope.AlderetScoreDetails = AlderetScoreDetails || [];
        $scope.Ascpatientpopupsavearray = Ascpatientpopupsavearray || [];
        $scope.PreOpCallDetails = PreOpCallDetails || [];
        $scope.PreOpObj.TotalAlderetScore = TotalAlderetScore;

        if ($scope.Ascpatientpopupsavearray.length > 0) {
            angular.forEach($scope.Ascpatientpopupsavearray, function (item) {
                $scope.PreopCheckinObj.RecievedForSurgery = item.RecievedForSurgery;
                $scope.PreopCheckinObj.RecievedForSurgeryNotes = item.RecievedForSurgeryNotes;
                $scope.PreopCheckinObj.AccompainedBy = item.AccompainedBy;
                $scope.PreopCheckinObj.AccompainedByNotes = item.AccompainedByNotes;
                $scope.PreopCheckinObj.PatientTransfferedIn = item.PatientTransfferedIn;
                $scope.PreopCheckinObj.PatientTransfferedNotes = item.PatientTransfferedNotes;
                $scope.PreopCheckinObj.PatientDestination = item.PatientDestination;
                $scope.PreopCheckinObj.PatientDestinationNotes = item.PatientDestinationNotes;
                $scope.PreopCheckinObj.PTERefers = item.PTERefers;
                $scope.PreopCheckinObj.PTEReferNotes = item.PTEReferNotes;
                $scope.PreopCheckinObj.PreOperativeOrientationOffered = item.PreOperativeOrientationOffered;
                $scope.PreopCheckinObj.PreOperativeOrientationOfferedNotes = item.PreOperativeOrientationOfferedNotes;
                $scope.PreopCheckinObj.ObservedBehavior = item.ObservedBehavior;
                $scope.PreopCheckinObj.ObservedBehaviorNotes = item.ObservedBehaviorNotes;
                $scope.PreopCheckinObj.LevelOfConsciousness = item.LevelOfConsciousness;
                $scope.PreopCheckinObj.LevelOfConsciousnessNotes = item.LevelOfConsciousnessNotes;
                $scope.PreopCheckinObj.PreOpOverallNotes = item.PreOpOverallNotes;

                if ($scope.PreopCheckinObj.PreOpOverallNotes != '') {
                    $scope.ShowPreopPatientnotes = true;
                }

            });
        }

        if ($scope.PreOpCallDetails.length > 0) {
            angular.forEach($scope.PreOpCallDetails, function (item) {
                $scope.PreOpCallObj.ContactStartDate = $filter('date')(item.ContactStartDate, "MM-dd-yyyy") || '';
                $scope.PreOpCallObj.DropStartDate = $filter('date')(item.DropStartDate, "MM-dd-yyyy") || '';
                $scope.PreOpCallObj.PatientAscPreOpCallDetailId = item.PatientAscPreOpCallDetailId;
                $scope.PreOpCallObj.Remarks = item.Remarks;
                $scope.PreOpCallObj.PatientId = item.PatientId;
                $scope.PreOpCallObj.AppointmentId = item.AppointmentId;
                $scope.PreOpCallObj.ContactType = item.ContactType;
                $scope.PreOpCallObj.IsConnectedWithPatient = item.IsConnectedWithPatient;
                $scope.PreOpCallObj.IsConnectedWithFamilyOrFriend = item.IsConnectedWithFamilyOrFriend;
                $scope.PreOpCallObj.IsLeftMsgWithFamilyOrFriend = item.IsLeftMsgWithFamilyOrFriend;
                $scope.PreOpCallObj.IsLeftMsgWithPatient = item.IsLeftMsgWithPatient;
                $scope.PreOpCallObj.IsNoResponse = item.IsNoResponse;
                $scope.PreOpCallObj.IsArrivalTimeShared = item.IsArrivalTimeShared;
                $scope.PreOpCallObj.IsAccompanyShared = item.IsAccompanyShared;

                $scope.PreOpCallObj.IsDrinkPlentyWaterShared = item.IsDrinkPlentyWaterShared;
                $scope.PreOpCallObj.IsNpoAfterMidnightShared = item.IsNpoAfterMidnightShared;
                $scope.PreOpCallObj.IsTakeBpHeartMedShared = item.IsTakeBpHeartMedShared;
                $scope.PreOpCallObj.IsDoNotTakeBpMedShared = item.IsDoNotTakeBpMedShared;
                $scope.PreOpCallObj.IsNoMakeupJewelMoistShared = item.IsNoMakeupJewelMoistShared;

                $scope.PreOpCallObj.IsCoPay = item.IsCoPay;
                $scope.PreOpCallObj.DeleteInd = item.DeleteInd;
                $scope.PreOpCallObj.CoPayNotes = item.CoPayNotes;
                $scope.PreOpCallObj.DropsStartTime = item.DropsStartTime;
                var StartTime = $filter("date")(item.ContactStartTime, "h:mm a");
                $scope.PreOpCallObj.ContactStartTime = StartTime;

                if ($scope.PreOpCallObj.CoPayNotes != '') {
                    $scope.ShowCopaynotes = true;
                } 

                if ($scope.PreOpCallObj.Remarks != '') {
                    $scope.ShowPreopOverallnotes = true;
                }
            });
        }


        $scope.ContactList = [];

        if ($scope.cacheStorageItem.MobileNo != '') {
            var obj = {
                "value": $scope.cacheStorageItem.MobileNo
            }
            $scope.ContactList.push(obj);
        }

        $scope.TabChange = function (val) {
            if (val == 1) {
                $scope.Preopobj.SubType = 'AldereteScore';
            }
            if (val ==2) {
                $scope.Preopobj.SubType = 'HealthPhysical';
            }
            if (val ==3 ) {
                $scope.Preopobj.SubType = 'PreOpCall';
            }
            if (val ==4) {
                $scope.Preopobj.SubType = 'Patient';
            }
        }



        $scope.closeuib = function () {
            $uibModalInstance.dismiss("cancel");
        }


      // Alderet Score//

        $scope.OnSelectAlderetScore1 = function (Obj, ParentObj) {
            angular.forEach($scope.AlderetScoreDetails, function (item) {
                if (item.AldreteScoreTypeId === ParentObj.AldreteScoreTypeId) {
                    angular.forEach(item.AldreteScoreDetailTypes, function (kitem) {
                        kitem.IsChecked = false;
                    });
                }
            });
            ParentObj.Value = Obj.AldreteScore;
            ParentObj.IsChecked = true;
            Obj.IsChecked = true;
            Obj.DeleteInd = 'N';
            ParentObj.DeleteInd = 'N';
            $scope.PreOpObj.TotalAlderetScore = null;
            let sum = 0;
            angular.forEach($scope.AlderetScoreDetails, function (item) {
                if (item.DeleteInd == 'N') {
                    sum += item.Value;
                }
            });

            $scope.PreOpObj.TotalAlderetScore = sum;
        };
        //Alderet Score//


        //Health and Physical//
        $scope.cacheStorageItem = angular.copy(cacheStorageItem);
       
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
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Pulmonary") {
                if ($scope.cacheStorageItem.IsPulmonaryWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 2) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Hepatic") {
                if ($scope.cacheStorageItem.IsHepaticWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 3) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Endocrine") {
                if ($scope.cacheStorageItem.IsEndocrineWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 4) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Neurologic") {
                if ($scope.cacheStorageItem.IsNeurologicWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 5) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "HemeOnc") {
                if ($scope.cacheStorageItem.IsHemeOncWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 6) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Nervous System") {
                if ($scope.cacheStorageItem.IsNervousSystemWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 7) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Kidney") {
                if ($scope.cacheStorageItem.IsKidneyDiseaseWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 8) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "MusculoSkeletal") {
                if ($scope.cacheStorageItem.IsMusculoSkeletalSystemWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 9) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "AutoImmune") {
                if ($scope.cacheStorageItem.IsAutoImmuneDisordersWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 10) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Psychosis") {
                if ($scope.cacheStorageItem.IsPsychosisWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 11) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Others") {
                if ($scope.cacheStorageItem.IsOthersWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 12) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Heent") {
                if ($scope.cacheStorageItem.IsHeentWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 16) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }
            if (item === "Lungs") {
                if ($scope.cacheStorageItem.IsLungsWNL) {
                    angular.forEach($scope.cacheStorageItem.HealthArray, function (kitem) {
                        if (kitem.CategoryId === 17) {
                            kitem.IsChecked = false;
                        }
                    });
                }
            }

            if ($scope.cacheStorageItem.IsCardiacWNL && $scope.cacheStorageItem.IsPulmonaryWNL && $scope.cacheStorageItem.IsHepaticWNL && $scope.cacheStorageItem.IsEndocrineWNL && $scope.cacheStorageItem.IsNeurologicWNL && $scope.cacheStorageItem.IsHemeOncWNL && $scope.cacheStorageItem.IsNervousSystemWNL && $scope.cacheStorageItem.IsKidneyDiseaseWNL && $scope.cacheStorageItem.IsMusculoSkeletalSystemWNL && $scope.cacheStorageItem.IsAutoImmuneDisordersWNL && $scope.cacheStorageItem.IsPsychosisWNL && $scope.cacheStorageItem.IsOthersWNL && $scope.cacheStorageItem.IsHeentWNL && $scope.cacheStorageItem.IsLungsWNL) {
                $scope.cacheStorageItem.IsAllHealthWNL = true;
            } else {
                $scope.cacheStorageItem.IsAllHealthWNL = false;
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

       //Health and Physical//

      


        $scope.newclicktime = function (item, type) {
            $scope.currentTime = $filter("date")(new Date(), "h:mm a");
            if (type == 'StartTime') {
                item.ContactStartTime = $scope.currentTime;
            }
            if (type == 'DropsTime') {
                item.DropsStartTime = $scope.currentTime;
            }

        };
        $scope.PreOpConnectedWithPatient = function (pitem) {
            pitem.IsConnectedWithPatient = !pitem.IsConnectedWithPatient;
            pitem.IsNoResponse = false;
        }
        $scope.PreOpConnectedWithFamilyOrFriend = function (pitem) {
            pitem.IsConnectedWithFamilyOrFriend = !pitem.IsConnectedWithFamilyOrFriend;
            pitem.IsNoResponse = false;
        }
        $scope.PreOpLeftMsgWithPatient = function (pitem) {
            pitem.IsLeftMsgWithPatient = !pitem.IsLeftMsgWithPatient;
            pitem.IsNoResponse = false;
        }

        $scope.PreLeftMsgWithFamilyOrFriend = function (pitem) {
            pitem.IsLeftMsgWithFamilyOrFriend = !pitem.IsLeftMsgWithFamilyOrFriend;
            pitem.IsNoResponse = false;
        }
        $scope.PreOpNoResponse = function (item) {
            item.IsConnectedWithFamilyOrFriend = false;
            item.IsConnectedWithPatient = false;
            item.IsLeftMsgWithFamilyOrFriend = false;
            item.IsLeftMsgWithPatient = false;
            item.IsNoResponse = !item.IsNoResponse;
        }
       
        $scope.SavePreopMultipleData = function () {


            $scope.Obj = {
                "AlderetScoreDetails": $scope.AlderetScoreDetails,
                "Ascpatientpopupsavearray": $scope.Ascpatientpopupsavearray || [],
                "cacheStorageItem": $scope.cacheStorageItem,              
                "TotalScore": $scope.PreOpObj.TotalAlderetScore || null,
                "PreopCheckinObj": $scope.PreopCheckinObj,
                "PreOpCallObj": $scope.PreOpCallObj,
            }
            $uibModalInstance.close($scope.Obj);
        }

        $scope.focusTextarea = function (Type) {
            if (Type == 'Patient Transferred' ) {
                $scope.isPatientTransferredFocused = true;
            }
            if (Type == 'Level Of Consciousness') {
                $scope.isPatientLevelOfConsciousnessFocused = true;
            }
            if (Type == 'PTE Refers') {
                $scope.isPatientPTERefersFocused = true;
            }

            if (Type == 'Patient Destination') {
                $scope.isPatientDestinationFocused = true;
            }

            if (Type == 'Observed Behavior') {
                $scope.isObservedBehavior = true;
            }
            if (Type == 'received for surgery') {
                $scope.isreceivedforsurgery = true;
            }
            if (Type == 'Accompanied ') {
                $scope.isAccompanied = true;
            }
            if (Type == 'PreOperative') {
                $scope.isPreOperative = true;

            }



        }
           
      

     
    }]);